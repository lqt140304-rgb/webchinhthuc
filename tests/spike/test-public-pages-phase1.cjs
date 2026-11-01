const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const clientDir = path.resolve(__dirname, '..', '..', 'build', 'client');

if (!fs.existsSync(clientDir)) {
  console.error(`[ERROR] Build client directory missing: ${clientDir}. Please run 'npm run build' first.`);
  process.exit(1);
}

const targetRoutes = [
  {
    path: '/dich-vu',
    filePath: path.join(clientDir, 'dich-vu', 'index.html'),
    expectedH1: 'Danh mục dịch vụ y tế toàn diện',
    titleFragment: 'Danh Mục Dịch Vụ Y Tế',
  },
  {
    path: '/dich-vu/cap-cuu',
    filePath: path.join(clientDir, 'dich-vu', 'cap-cuu', 'index.html'),
    expectedH1: 'Cấp cứu thú cưng khẩn cấp tại Hà Nội',
    titleFragment: 'Tiếp Nhận Cấp Cứu 24/24',
  },
  {
    path: '/lien-he',
    filePath: path.join(clientDir, 'lien-he', 'index.html'),
    expectedH1: 'Liên hệ & Chỉ đường cơ sở',
    titleFragment: 'Liên hệ & Thông tin phòng khám',
  },
];

console.log('=== STEP 1: STATIC PRERENDERED HTML AUDIT ===');
for (const route of targetRoutes) {
  assert(fs.existsSync(route.filePath), `Prerendered index.html missing for ${route.path} at ${route.filePath}`);
  const html = fs.readFileSync(route.filePath, 'utf-8');
  const normalizedHtml = html.replace(/&amp;/g, '&');

  // Check title
  assert(normalizedHtml.includes(route.titleFragment), `Title fragment "${route.titleFragment}" missing in ${route.path}`);
  assert(normalizedHtml.includes('Bệnh viện Thú y Lê Sơn') || normalizedHtml.includes('Lê Sơn'), `Brand name missing in ${route.path}`);

  // Check robots
  assert(normalizedHtml.includes('content="noindex, nofollow"'), `noindex, nofollow meta missing in ${route.path}`);

  // Check description
  assert(normalizedHtml.includes('<meta name="description"'), `meta description missing in ${route.path}`);

  // Check telephone link
  assert(normalizedHtml.includes('tel:0973555105'), `tel:0973555105 missing in ${route.path}`);
  assert(normalizedHtml.includes('097 355 51 05'), `Formatted hotline 097 355 51 05 missing in ${route.path}`);

  // Ensure NO Coming Soon badge
  assert(!normalizedHtml.includes('Tính Năng Đang Phát Triển'), `ComingSoon banner found in static HTML for ${route.path}`);

  console.log(`[PASS] Static prerender HTML verified for: ${route.path}`);
}

console.log('\n=== STEP 2: RUNNING PLAYWRIGHT DOM, HYDRATION & RESPONSIVENESS AUDIT ===');

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0].replace(/\/$/, '') || '/';

  const exactFilePath = path.join(clientDir, req.url.split('?')[0]);
  if (fs.existsSync(exactFilePath) && fs.statSync(exactFilePath).isFile()) {
    const ext = path.extname(exactFilePath);
    const contentType = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'text/html';
    res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
    return res.end(fs.readFileSync(exactFilePath));
  }

  const dirIndexPath = path.join(clientDir, urlPath === '/' ? 'index.html' : urlPath + '/index.html');
  if (fs.existsSync(dirIndexPath) && fs.statSync(dirIndexPath).isFile()) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(dirIndexPath));
  }

  // 404 fallback
  const notFoundPath = path.join(clientDir, '404.html');
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync(notFoundPath));
});

const PORT = 5198;
const TEST_VIEWPORTS = [
  { name: 'Mobile XS', width: 320, height: 600 },
  { name: 'Mobile Modern', width: 390, height: 844 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Laptop Standard', width: 1366, height: 768 },
  { name: 'Desktop Standard', width: 1440, height: 900 },
];

server.listen(PORT, async () => {
  let browser;
  let hasFailure = false;

  try {
    browser = await chromium.launch();
    const context = await browser.newContext();

    for (const route of targetRoutes) {
      console.log(`\n--- Testing Route: ${route.path} ---`);
      const page = await context.newPage();

      const pageErrors = [];
      page.on('pageerror', (err) => pageErrors.push(err.message));
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Filter out benign font/favicon resource warnings if any
          if (!text.includes('favicon') && !text.includes('Failed to load resource')) {
            pageErrors.push(text);
          }
        }
      });

      const response = await page.goto(`http://localhost:${PORT}${route.path}`, { waitUntil: 'networkidle' });
      assert.strictEqual(response.status(), 200, `Expected 200 status for ${route.path}, got ${response.status()}`);

      // Verify H1 exists and text matches
      const h1Text = await page.locator('h1').first().textContent();
      assert(h1Text && h1Text.includes(route.expectedH1), `H1 text mismatch on ${route.path}. Expected "${route.expectedH1}", got "${h1Text}"`);
      console.log(`  [PASS] H1: "${h1Text.trim()}"`);

      // Verify no ComingSoonView badge remains
      const comingSoonCount = await page.locator('text=Tính Năng Đang Phát Triển').count();
      assert.strictEqual(comingSoonCount, 0, `ComingSoonView badge found on active page ${route.path}`);
      console.log(`  [PASS] No Coming Soon placeholder found`);

      // Verify hotline and tel: link
      const telLink = page.locator('a[href^="tel:0973555105"]').first();
      assert((await telLink.count()) > 0, `No clickable tel:0973555105 link found on ${route.path}`);
      console.log(`  [PASS] Verified hotline tel:0973555105 link`);

      // Verify no hydration or unhandled console errors
      const hydrationErrors = pageErrors.filter((e) => e.includes('Hydration') || e.includes('Minified React error #418'));
      assert.strictEqual(hydrationErrors.length, 0, `Hydration errors detected on ${route.path}: ${hydrationErrors.join(', ')}`);
      console.log(`  [PASS] Zero React hydration errors`);

      // Test horizontal overflow on all standard viewports
      for (const vp of TEST_VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.waitForTimeout(100);

        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;

          const overflowingElements = [];
          if (scrollWidth > clientWidth) {
            const allElements = Array.from(document.querySelectorAll('*'));
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > clientWidth + 1) {
                overflowingElements.push({
                  tag: el.tagName,
                  className: el.className ? String(el.className).slice(0, 100) : '',
                  id: el.id,
                  right: rect.right,
                  clientWidth,
                });
              }
            }
          }

          return {
            hasOverflow: scrollWidth > clientWidth,
            scrollWidth,
            clientWidth,
            delta: scrollWidth - clientWidth,
            overflowingElements: overflowingElements.slice(0, 5),
          };
        });

        if (overflow.hasOverflow) {
          console.error('Overflowing elements sample:', JSON.stringify(overflow.overflowingElements, null, 2));
        }

        assert(
          !overflow.hasOverflow,
          `Horizontal overflow detected on ${route.path} at ${vp.name} (${vp.width}x${vp.height}): scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth} (delta: ${overflow.delta}px)`
        );
        console.log(`  [PASS] Viewport ${vp.name} (${vp.width}px): No horizontal overflow`);
      }

      await page.close();
    }

    console.log('\n=== ALL PHASE 1 PUBLIC PAGES TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('\n[FAIL] Test assertion failure:', err);
    hasFailure = true;
  } finally {
    if (browser) {
      await browser.close();
    }
    server.close();
    process.exit(hasFailure ? 1 : 0);
  }
});
