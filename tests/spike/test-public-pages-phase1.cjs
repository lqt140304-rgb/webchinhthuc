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

// Also verify /dich-vu/noi-tru prerendered HTML does not claim 24/7 in title/meta/ComingSoon H1
const inpatientFilePath = path.join(clientDir, 'dich-vu', 'noi-tru', 'index.html');
assert(fs.existsSync(inpatientFilePath), `Prerendered index.html missing for /dich-vu/noi-tru`);
const inpatientHtml = fs.readFileSync(inpatientFilePath, 'utf-8');
assert(inpatientHtml.includes('<title>Chăm sóc nội trú — Bệnh viện Thú y Lê Sơn</title>'), 'Inpatient title mismatch');
assert(!inpatientHtml.includes('<title>Chăm sóc nội trú 24/7'), 'Inpatient title must not claim 24/7');
assert(inpatientHtml.includes('content="noindex, nofollow"'), 'Inpatient robots meta missing');
console.log('[PASS] Static prerender HTML verified for: /dich-vu/noi-tru (neutral title/meta without unverified 24/7)');

// Verify /dich-vu and /dich-vu/kham-dieu-tri prerendered HTML include the 4 confirmed clinical services (X-quang, Siêu âm, Phẫu thuật, Xét nghiệm)
const servicesHtml = fs.readFileSync(path.join(clientDir, 'dich-vu', 'index.html'), 'utf-8');
for (const confirmedSvc of ['X-quang', 'Siêu âm', 'Phẫu thuật', 'Xét nghiệm']) {
  assert(
    servicesHtml.includes(confirmedSvc),
    `Confirmed clinical service "${confirmedSvc}" missing in /dich-vu prerendered HTML`
  );
}
const examFilePath = path.join(clientDir, 'dich-vu', 'kham-dieu-tri', 'index.html');
assert(fs.existsSync(examFilePath), 'Prerendered index.html missing for /dich-vu/kham-dieu-tri');
const examHtml = fs.readFileSync(examFilePath, 'utf-8');
assert(examHtml.includes('xét nghiệm') && examHtml.includes('siêu âm') && examHtml.includes('X-quang') && examHtml.includes('phẫu thuật'), 'Confirmed services missing in /dich-vu/kham-dieu-tri prerendered HTML');
assert(examHtml.includes('content="noindex, nofollow"'), 'Exam route robots meta missing');
console.log('[PASS] Static prerender HTML verified for confirmed clinical services (X-quang, Siêu âm, Phẫu thuật, Xét nghiệm)');

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
  { name: 'Mobile Android', width: 360, height: 740 },
  { name: 'Mobile Modern', width: 390, height: 844 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Laptop Standard', width: 1366, height: 768 },
  { name: 'Desktop Standard', width: 1440, height: 900 },
  { name: 'Desktop Full HD', width: 1920, height: 1080 },
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
      const failedRequests = [];

      page.on('pageerror', (err) => pageErrors.push(err.message));
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          pageErrors.push(msg.text());
        }
      });
      page.on('requestfailed', (req) => {
        const failure = req.failure();
        if (!req.url().endsWith('/favicon.ico')) {
          failedRequests.push(`${req.url()} (${failure ? failure.errorText : 'failed'})`);
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

      // Verify Landmark Integrity (Single <main> and single #main-content) - P2-3
      const mainCount = await page.locator('main').count();
      assert.strictEqual(mainCount, 1, `Landmark error: expected exactly 1 <main> element on ${route.path}, found ${mainCount}`);
      const mainContentIdCount = await page.locator('#main-content').count();
      assert.strictEqual(mainContentIdCount, 1, `Landmark error: expected exactly 1 #main-content ID on ${route.path}, found ${mainContentIdCount}`);
      console.log(`  [PASS] Landmark integrity: exactly 1 <main> element and 1 #main-content ID`);

      // Verify Hydrated DOM Meta Robots - P3-2
      const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content');
      assert.strictEqual(robotsMeta, 'noindex, nofollow', `Robots meta in hydrated DOM mismatch on ${route.path}: got "${robotsMeta}"`);
      console.log(`  [PASS] Hydrated DOM meta robots: "${robotsMeta}"`);

      // Verify zero resource request failures (no 404 images/chunks) - P3-2
      assert.strictEqual(failedRequests.length, 0, `Resource request failures on ${route.path}: ${failedRequests.join(', ')}`);
      console.log(`  [PASS] Zero resource request failures`);

      // Verify zero console/runtime/hydration errors - P3-2
      assert.strictEqual(pageErrors.length, 0, `Errors detected on ${route.path}: ${pageErrors.join(', ')}`);
      console.log(`  [PASS] Zero console/runtime/hydration errors`);

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

        // On mobile viewports (< 1024px), verify Header primary controls and ALL Footer links have touch targets >= 44x44px
        if (vp.width < 1024) {
          const touchTargets = await page.evaluate(() => {
            const headerSelectors = [
              'header a[href="/"]',
              'header a[href="/dat-lich"]',
              'header button[aria-haspopup="dialog"]',
            ];
            const undersized = [];
            for (const sel of headerSelectors) {
              const els = document.querySelectorAll(sel);
              for (const el of els) {
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                  if (rect.width < 43.5 || rect.height < 43.5) {
                    undersized.push(`${sel} (${Math.round(rect.width)}x${Math.round(rect.height)}px)`);
                  }
                }
              }
            }

            // Check ALL footer links
            const footerLinks = document.querySelectorAll('footer a');
            for (const el of footerLinks) {
              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                if (rect.width < 43.5 || rect.height < 43.5) {
                  const href = el.getAttribute('href') || el.textContent.trim().slice(0, 20);
                  undersized.push(`footer a[href="${href}"] (${Math.round(rect.width)}x${Math.round(rect.height)}px)`);
                }
              }
            }
            return undersized;
          });
          assert.strictEqual(
            touchTargets.length,
            0,
            `Undersized touch targets (<44x44px) on ${route.path} at ${vp.name}: ${touchTargets.join(', ')}`
          );
        }

        console.log(`  [PASS] Viewport ${vp.name} (${vp.width}px): No horizontal overflow & mobile touch targets >= 44x44px`);
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
