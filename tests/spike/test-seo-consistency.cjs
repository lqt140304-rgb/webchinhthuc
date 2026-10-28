const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const clientDir = path.resolve(__dirname, '..', '..', 'build', 'client');

// Static server matching vercel.json
const server = http.createServer((req, res) => {
  const cleanUrl = req.url.split('?')[0].replace(/\/$/, '') || '/';
  const filePath = path.join(clientDir, req.url.split('?')[0]);
  
  // 1. Exact static file
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const contentType = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'text/html';
    res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
    return res.end(fs.readFileSync(filePath));
  }

  // 2. Directory index.html
  const indexPath = path.join(clientDir, cleanUrl === '/' ? '' : cleanUrl, 'index.html');
  if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(indexPath));
  }

  // 3. SPA rewrites
  if (cleanUrl.startsWith('/tai-khoan') || cleanUrl.startsWith('/cau-chuyen') || cleanUrl.startsWith('/bai-viet')) {
    const spaFallback = path.join(clientDir, '__spa-fallback.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(spaFallback));
  }

  // 4. 404
  const notFoundPath = path.join(clientDir, '404.html');
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  return res.end(fs.readFileSync(notFoundPath));
});

async function runSeoConsistencyTest() {
  console.log('=== STARTING SEO ENVIRONMENT CONSISTENCY TEST ===');
  
  await new Promise(resolve => server.listen(4174, resolve));
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 1. Audit Raw Prerendered HTML on Disk
    console.log('[1] Auditing Raw Prerendered HTML Files...');
    const homeHtml = fs.readFileSync(path.join(clientDir, 'index.html'), 'utf8');
    const robotsMatchHome = homeHtml.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
    assert(robotsMatchHome, 'Raw index.html must have a robots meta tag');
    const rawHomeRobots = robotsMatchHome[1];
    console.log(`  Raw index.html robots directive: "${rawHomeRobots}"`);

    const aboutHtml = fs.readFileSync(path.join(clientDir, 'gioi-thieu', 'index.html'), 'utf8');
    const robotsMatchAbout = aboutHtml.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
    assert(robotsMatchAbout, 'Raw gioi-thieu/index.html must have a robots meta tag');
    const rawAboutRobots = robotsMatchAbout[1];
    console.log(`  Raw gioi-thieu/index.html robots directive: "${rawAboutRobots}"`);

    // 2. Audit Hydrated DOM in Headless Browser
    console.log('[2] Auditing Hydrated DOM in Browser (Direct URL)...');
    await page.goto('http://127.0.0.1:4174/', { waitUntil: 'networkidle' });

    // Wait for hydration to settle
    await page.waitForTimeout(500);

    const hydratedHomeRobotsTags = await page.$$eval('meta[name="robots"]', els => els.map(el => el.getAttribute('content')));
    console.log(`  Hydrated index.html robots tags count: ${hydratedHomeRobotsTags.length}`);
    console.log(`  Hydrated index.html robots content: ${JSON.stringify(hydratedHomeRobotsTags)}`);

    // Assertions: EXACTLY 1 robots tag, NO conflicting duplicates!
    assert.strictEqual(hydratedHomeRobotsTags.length, 1, 'There must be EXACTLY ONE robots meta tag after hydration!');
    assert.strictEqual(hydratedHomeRobotsTags[0], rawHomeRobots, 'Hydrated DOM robots tag MUST match raw prerendered HTML!');

    // 3. Test Browser Page Refresh
    console.log('[3] Auditing Hydrated DOM after Browser Refresh...');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const reloadedHomeRobotsTags = await page.$$eval('meta[name="robots"]', els => els.map(el => el.getAttribute('content')));
    assert.strictEqual(reloadedHomeRobotsTags.length, 1, 'Exactly one robots tag after refresh');
    assert.strictEqual(reloadedHomeRobotsTags[0], rawHomeRobots, 'Robots tag consistent after refresh');
    console.log(`  Refreshed index.html robots content: ${JSON.stringify(reloadedHomeRobotsTags)} (PASS)`);

    // 4. Test Navigation to Another Page (/gioi-thieu)
    console.log('[4] Auditing Hydrated DOM on /gioi-thieu...');
    await page.goto('http://127.0.0.1:4174/gioi-thieu', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const hydratedAboutRobotsTags = await page.$$eval('meta[name="robots"]', els => els.map(el => el.getAttribute('content')));
    assert.strictEqual(hydratedAboutRobotsTags.length, 1, 'Exactly one robots tag on /gioi-thieu');
    assert.strictEqual(hydratedAboutRobotsTags[0], rawAboutRobots, 'Hydrated /gioi-thieu robots tag matches raw prerender');
    console.log(`  Hydrated /gioi-thieu robots content: ${JSON.stringify(hydratedAboutRobotsTags)} (PASS)`);

    // 5. Test Private Route (/tai-khoan)
    console.log('[5] Auditing Hydrated DOM on Private Route (/tai-khoan)...');
    await page.goto('http://127.0.0.1:4174/tai-khoan', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const hydratedPortalRobotsTags = await page.$$eval('meta[name="robots"]', els => els.map(el => el.getAttribute('content')));
    assert.strictEqual(hydratedPortalRobotsTags.length, 1, 'Exactly one robots tag on /tai-khoan');
    assert.strictEqual(hydratedPortalRobotsTags[0], 'noindex, nofollow', 'Private route MUST always be noindex, nofollow');
    console.log(`  Hydrated /tai-khoan robots content: ${JSON.stringify(hydratedPortalRobotsTags)} (PASS)`);

    console.log('\n=== ALL SEO ENVIRONMENT CONSISTENCY TESTS PASSED! ===');
  } finally {
    await browser.close();
    server.close();
  }
}

runSeoConsistencyTest().catch(err => {
  console.error('[FAIL] SEO Consistency Test Failed:', err);
  process.exit(1);
});
