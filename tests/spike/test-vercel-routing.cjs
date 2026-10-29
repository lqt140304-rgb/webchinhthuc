const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const { chromium } = require('playwright');
const { configuredHeaders, remoteOptions, checkAccess } = require('./vercel-routing-support.cjs');

const root = path.resolve(__dirname, '../..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const client = path.join(root, config.outputDirectory);
const remote = Boolean(process.env.BASE_URL);
const evidence = { mode: remote ? 'REMOTE' : 'LOCAL MODEL — NOT VERCEL EDGE', checks: [] };

// Guard the actual deployment config: the old hardcoded servers missed this bug.
assert.equal(config.cleanUrls, true);
assert.deepEqual(config.rewrites, ['tai-khoan', 'cau-chuyen', 'bai-viet'].map(prefix => ({
  source: `/${prefix}/(.*)`, destination: '/__spa-fallback',
})), 'cleanUrls rewrites must target the extensionless SPA URL');
assert(config.headers.some(rule => rule.source === '/(.*)' && rule.headers.some(
  header => header.key === 'X-Robots-Tag' && header.value === 'noindex, nofollow',
)));

const prerender = [...fs.readFileSync(path.join(root, 'react-router.config.ts'), 'utf8')
  .matchAll(/^\s+'(\/[^']*)',?$/gm)].map(match => match[1]);
assert.equal(prerender.length, 19);
// Local build artifacts are never evidence about a remote deployment.
if (!remote) for (const route of prerender) {
  const html = fs.readFileSync(path.join(client, route, 'index.html'), 'utf8');
  assert(html.includes('"isSpaMode":false'), `${route}: prerender mode`);
  assert.match(html, /<meta[^>]+name="robots"[^>]+content="noindex, nofollow"/);
}
if (!remote) assert(fs.readFileSync(path.join(client, '__spa-fallback.html'), 'utf8').includes('"isSpaMode":true'));

// Local static routing model, driven by vercel.json, not a Vercel edge emulator.
// BASE_URL runs the same HTTP/browser assertions against an approved deployment.
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const rewrite = config.rewrites.find(rule => new RegExp(`^${rule.source}$`).test(pathname));
  const target = rewrite ? rewrite.destination : pathname;
  const candidates = [target, `${target}/index.html`];
  if (config.cleanUrls && !path.extname(target)) candidates.push(`${target}.html`);
  const file = candidates.map(item => path.join(client, item)).find(item =>
    item.startsWith(client + path.sep) && fs.existsSync(item) && fs.statSync(item).isFile());
  const selected = file || path.join(client, '404.html');
  const mime = { '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
  res.writeHead(file ? 200 : 404, {
    'Content-Type': mime[path.extname(selected)] || 'text/html; charset=utf-8',
    ...configuredHeaders(config, pathname),
  });
  res.end(fs.readFileSync(selected));
});

async function run() {
  let browser;
  let context;
  try {
    let base;
    if (remote) {
      assert(process.env.DEPLOYMENT_EVIDENCE_FILE, 'DEPLOYMENT_EVIDENCE_FILE required: saved deployment object from Vercel API');
      const deployment = JSON.parse(fs.readFileSync(process.env.DEPLOYMENT_EVIDENCE_FILE, 'utf8'));
      const options = remoteOptions(process.env, deployment);
      base = options.base;
      Object.assign(evidence, options, {
        provenance: 'Caller-supplied Vercel API metadata; obtain freshly and verify independently before running',
      });
      console.log(`REMOTE deployment=${options.deploymentId} sha=${options.sha} origin=${base}`);
    } else {
      await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
      base = `http://127.0.0.1:${server.address().port}`;
      console.log('LOCAL CONFIG-DRIVEN MODEL (not Vercel edge verification)');
    }
    browser = await chromium.launch();
    // User-provided authenticated state only; never create a bypass or disable protection.
    context = await browser.newContext(remote && process.env.PLAYWRIGHT_STORAGE_STATE
      ? { storageState: process.env.PLAYWRIGHT_STORAGE_STATE } : {});
    // An expired session must not navigate the browser to an external login page.
    if (remote) await context.route('**/*', async route => {
      const request = route.request();
      if (request.isNavigationRequest() && request.frame() === request.frame().page().mainFrame()
        && new URL(request.url()).origin !== base) return route.abort();
      return route.continue();
    });
    // Stop before following an SSO redirect. Check once before any route/browser tests.
    if (remote) await checkAccess(context, base + '/');
    const cases = [
      ['/bai-viet/dinh-duong-an-toan-cho-thu-cung', 200, true, 'Chi tiết bài viết cẩm nang'],
      ['/cau-chuyen/ca-dieu-tri-01', 200, true, 'Chi tiết câu chuyện điều trị'],
      ['/tai-khoan/lich-hen', 200, true, 'Cổng quản lý hồ sơ thú cưng'],
      ['/khong-ton-tai-patch03', 404, false, 'Không tìm thấy trang yêu cầu'],
      ['/dich-vu/slug-khong-ton-tai', 404, false, 'Không tìm thấy trang yêu cầu'],
      ['/bai-viet-khong-hop-le/test', 404, false, 'Không tìm thấy trang yêu cầu'],
      ['/quan-ly/lich-truc', 404, false, 'Không tìm thấy trang yêu cầu'],
    ];
    for (const [route, status, spa, heading] of cases) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {
        if (message.type() === 'error' && !(status === 404 && message.text().includes('status of 404'))) errors.push(message.text());
      });
      for (const action of ['direct', 'reload']) {
        if (remote) await checkAccess(context, base + route);
        const response = action === 'direct'
          ? await page.goto(base + route, { waitUntil: 'networkidle' })
          : await page.reload({ waitUntil: 'networkidle' });
        assert.equal(new URL(response.url()).origin, base, 'Unexpected navigation outside Preview');
        const body = await response.body();
        const headers = response.headers();
        evidence.checks.push({ route, action, status: response.status(),
          contentType: headers['content-type'], xRobotsTag: headers['x-robots-tag'] || null,
          bodySha256: crypto.createHash('sha256').update(body).digest('hex') });
        assert.equal(response.status(), status, `${route} ${action}: HTTP`);
        assert(body.toString().includes(`"isSpaMode":${spa}`), `${route}: raw SPA mode`);
        assert.match(headers['x-robots-tag'] || '', /\bnoindex\b/);
        assert.match(headers['x-robots-tag'] || '', /\bnofollow\b/);
        await page.getByRole('heading', { level: 1, name: heading }).waitFor();
        assert.equal(await page.evaluate(() => window.__reactRouterContext.isSpaMode), spa);
        assert.deepEqual(await page.locator('meta[name="robots"]').evaluateAll(nodes =>
          nodes.map(node => node.content)), ['noindex, nofollow']);
        assert.deepEqual(errors, [], `${route}: browser errors including hydration #418`);
        console.log(`PASS ${route} ${action}: HTTP ${status}, isSpaMode:${spa}, no hydration errors, noindex`);
      }
      await page.close();
    }
    console.log(remote ? 'PASS: 14 remote HTTP/browser checks; local prerender checks skipped'
      : 'PASS: 19 local prerender files and SEO retained; 14 local model HTTP/browser checks (NOT edge)');
    evidence.verdict = 'PASS';
  } catch (error) {
    evidence.verdict = error.code === 'AUTH_BLOCKED' ? 'BLOCKED' : 'FAIL';
    throw error;
  } finally {
    if (process.env.QA_EVIDENCE_FILE) fs.writeFileSync(process.env.QA_EVIDENCE_FILE, JSON.stringify(evidence, null, 2));
    if (context) await context.close();
    if (browser) await browser.close();
    if (server.listening) await new Promise(resolve => server.close(resolve));
  }
}

run().catch(error => {
  // Avoid printing raw responses, cookies, storage state or authenticated URLs.
  console.error(error.code === 'AUTH_BLOCKED' ? error.message : `FAIL: ${error.message.split('\n')[0]}`);
  process.exitCode = error.code === 'AUTH_BLOCKED' ? 2 : 1;
});
