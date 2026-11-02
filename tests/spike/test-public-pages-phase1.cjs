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
    path: '/dich-vu/kham-dieu-tri',
    filePath: path.join(clientDir, 'dich-vu', 'kham-dieu-tri', 'index.html'),
    expectedH1: 'Khám & điều trị thú cưng tại 101 Khuất Duy Tiến',
    titleFragment: 'Khám & điều trị thú cưng',
  },
  {
    path: '/dich-vu/noi-tru',
    filePath: path.join(clientDir, 'dich-vu', 'noi-tru', 'index.html'),
    expectedH1: 'Chăm sóc nội trú & lưu trú thú cưng tại 101 Khuất Duy Tiến',
    titleFragment: 'Chăm sóc nội trú',
  },
  {
    path: '/dich-vu/spa',
    filePath: path.join(clientDir, 'dich-vu', 'spa', 'index.html'),
    expectedH1: 'Spa & Grooming thẩm mỹ cho thú cưng tại Lê Sơn',
    titleFragment: 'Spa & Grooming thẩm mỹ',
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
  {
    path: '/bang-gia',
    filePath: path.join(clientDir, 'bang-gia', 'index.html'),
    expectedH1: 'Bảng giá dịch vụ tại Bệnh viện Thú y Lê Sơn',
    titleFragment: 'Bảng giá dịch vụ',
  },
  {
    path: '/san-pham',
    filePath: path.join(clientDir, 'san-pham', 'index.html'),
    expectedH1: 'Sản phẩm dinh dưỡng & chăm sóc thú cưng tại Lê Sơn',
    titleFragment: 'Sản phẩm & Dinh dưỡng thú cưng',
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

// Step 1B: Verify /bang-gia & /san-pham prerendered HTML and medical neutrality
const pricingFilePath = path.join(clientDir, 'bang-gia', 'index.html');
assert(fs.existsSync(pricingFilePath), 'Prerendered index.html missing for /bang-gia');
const pricingHtml = fs.readFileSync(pricingFilePath, 'utf-8');
for (const svc of ['X-quang', 'Siêu âm', 'Phẫu thuật', 'Xét nghiệm']) {
  assert(pricingHtml.includes(svc), `Confirmed service "${svc}" missing in /bang-gia prerendered HTML`);
}
for (const forbidden of ['nhịn ăn', 'X-quang kỹ thuật số', 'đầu dò chuyên dụng', 'an toàn tuyệt đối']) {
  assert(!pricingHtml.includes(forbidden), `Forbidden unverified/medical instruction "${forbidden}" found in /bang-gia prerender HTML`);
}
assert(pricingHtml.includes('content="noindex, nofollow"'), 'Pricing robots meta missing');
console.log('[PASS] Static prerender HTML verified for /bang-gia (confirmed services present, medical advice purged, noindex verified)');

const productsFilePath = path.join(clientDir, 'san-pham', 'index.html');
assert(fs.existsSync(productsFilePath), 'Prerendered index.html missing for /san-pham');
const productsHtml = fs.readFileSync(productsFilePath, 'utf-8');
assert(
  productsHtml.includes('Danh mục sản phẩm minh họa — chưa xác nhận hàng hóa đang kinh doanh'),
  'Required mock disclaimer label missing in /san-pham prerendered HTML'
);
for (const forbidden of ['nhịn ăn', 'an toàn tuyệt đối', 'cách thời điểm dùng kháng sinh']) {
  assert(!productsHtml.includes(forbidden), `Forbidden unverified phrase "${forbidden}" found in /san-pham prerender HTML`);
}
assert(productsHtml.includes('content="noindex, nofollow"'), 'Products robots meta missing');
console.log('[PASS] Static prerender HTML verified for /san-pham (standardized mock label present, medical claims purged, noindex verified)');

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

      // Verify FAQ Accessibility (P3-1) if FAQ buttons present
      const faqButtons = page.locator('button[id^="faq-btn-"]');
      const faqCount = await faqButtons.count();
      if (faqCount > 0) {
        for (let i = 0; i < faqCount; i++) {
          const btn = faqButtons.nth(i);
          const btnId = await btn.getAttribute('id');
          const ariaControls = await btn.getAttribute('aria-controls');
          const ariaExpanded = await btn.getAttribute('aria-expanded');

          assert(btnId && btnId.startsWith('faq-btn-'), `FAQ button missing valid ID on ${route.path}`);
          assert(ariaControls && ariaControls.startsWith('faq-panel-'), `FAQ button missing valid aria-controls on ${route.path}`);
          assert(ariaExpanded === 'true' || ariaExpanded === 'false', `FAQ button missing boolean aria-expanded on ${route.path}`);

          const panel = page.locator(`#${ariaControls}`);
          assert((await panel.count()) === 1, `Controlled FAQ panel #${ariaControls} missing in DOM on ${route.path}`);
          assert.strictEqual(await panel.getAttribute('role'), 'region', `FAQ panel #${ariaControls} missing role="region" on ${route.path}`);
          assert.strictEqual(await panel.getAttribute('aria-labelledby'), btnId, `FAQ panel #${ariaControls} aria-labelledby mismatch on ${route.path}`);
        }
        console.log(`  [PASS] FAQ Accessibility: verified ${faqCount} FAQ items with stable IDs, aria-controls, aria-expanded & role="region"`);
      }

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

        // On mobile viewports (< 1024px), verify Header primary controls, ALL Footer links, and primary main CTAs/FAQ buttons have touch targets >= 44x44px
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

            // Check main interactive buttons and CTA links (excluding inline paragraph text links)
            const mainButtonsAndCtas = document.querySelectorAll('main button, main nav a, main a.inline-flex');
            for (const el of mainButtonsAndCtas) {
              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                if (rect.width < 43.5 || rect.height < 43.5) {
                  const label = (el.getAttribute('href') || el.textContent || '').trim().slice(0, 28);
                  undersized.push(`main interactive "${label}" (${Math.round(rect.width)}x${Math.round(rect.height)}px)`);
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

    // Verify ComingSoonView "Quay lại Trang chủ" button touch target >= 44x44px on remaining ComingSoon route (/cau-chuyen)
    console.log('\n--- Testing ComingSoonView Touch Targets (/cau-chuyen) ---');
    const comingSoonPage = await context.newPage();
    await comingSoonPage.setViewportSize({ width: 390, height: 844 });
    await comingSoonPage.goto(`http://localhost:${PORT}/cau-chuyen`, { waitUntil: 'networkidle' });
    const backBtnBox = await comingSoonPage.locator('a:has-text("Quay lại Trang chủ")').boundingBox();
    assert(backBtnBox, 'Back to home button not found on ComingSoonView');
    assert(backBtnBox.width >= 43.5 && backBtnBox.height >= 43.5, `ComingSoon back button touch target too small: ${backBtnBox.width}x${backBtnBox.height}px`);
    console.log(`  [PASS] ComingSoon back button touch target: ${Math.round(backBtnBox.width)}x${Math.round(backBtnBox.height)}px (>= 44x44px)`);
    await comingSoonPage.close();

    console.log('\n=== STEP 3: INTERACTIVE & ACCESSIBILITY TESTS FOR /bang-gia & /san-pham ===');

    // 3A: Interactive tests for /bang-gia (Accordion, Search, Category Filter, Empty State)
    console.log('\n--- Testing /bang-gia Interactive Ledger & Accessibility ---');
    const pricingTestPage = await context.newPage();
    await pricingTestPage.goto(`http://localhost:${PORT}/bang-gia`, { waitUntil: 'networkidle' });

    // Test Accordion toggle
    const firstAccordionBtn = pricingTestPage.locator('article button[aria-controls]').first();
    const controlledPanelId = await firstAccordionBtn.getAttribute('aria-controls');
    assert(controlledPanelId, 'Pricing accordion button missing aria-controls');
    const panelLocator = pricingTestPage.locator(`#${controlledPanelId}`);

    // Initial state: collapsed
    assert.strictEqual(await firstAccordionBtn.getAttribute('aria-expanded'), 'false', 'Initial accordion should be collapsed');
    assert(await panelLocator.isHidden(), 'Accordion panel should be hidden initially');

    // Click to expand
    await firstAccordionBtn.click();
    await pricingTestPage.waitForTimeout(150);
    assert.strictEqual(await firstAccordionBtn.getAttribute('aria-expanded'), 'true', 'Accordion aria-expanded should be true after click');
    assert(await panelLocator.isVisible(), 'Accordion panel should be visible after click');
    assert.strictEqual(await panelLocator.getAttribute('role'), 'region', 'Accordion panel must have role="region"');

    // Click again to collapse
    await firstAccordionBtn.click();
    await pricingTestPage.waitForTimeout(150);
    assert.strictEqual(await firstAccordionBtn.getAttribute('aria-expanded'), 'false', 'Accordion aria-expanded should be false after second click');
    console.log('  [PASS] Accordion expand/collapse & ARIA role="region" verified');

    // Test Category filter
    const clsTab = pricingTestPage.locator('button[role="tab"]:has-text("X-quang, Siêu âm & Xét nghiệm")');
    await clsTab.click();
    await pricingTestPage.waitForTimeout(150);
    assert.strictEqual(await clsTab.getAttribute('aria-selected'), 'true', 'Category tab aria-selected mismatch');
    const groupNotice = await pricingTestPage.locator('text=Bệnh viện Thú y Lê Sơn có cung cấp dịch vụ X-quang, Siêu âm và Xét nghiệm').count();
    assert(groupNotice >= 1, 'Confirmed services group notice missing when category selected');
    console.log('  [PASS] Category filter & confirmed service group notice verified');

    // Test Search & Empty State
    const searchInput = pricingTestPage.locator('#service-search-input');
    await searchInput.fill('không-thể-tìm-thấy-dịch-vụ-này-xyz');
    await pricingTestPage.waitForTimeout(150);
    const emptyHeading = pricingTestPage.locator('text=Không tìm thấy dịch vụ phù hợp');
    assert(await emptyHeading.isVisible(), 'Empty state heading missing for unmatched search');
    const resetSearchBtn = pricingTestPage.locator('button:has-text("Xem toàn bộ bảng giá")');
    await resetSearchBtn.click();
    await pricingTestPage.waitForTimeout(150);
    assert.strictEqual(await searchInput.inputValue(), '', 'Search input should be cleared after clicking reset');
    console.log('  [PASS] Search & empty state reset verified');
    await pricingTestPage.close();

    // 3B: Interactive & Accessibility tests for /san-pham (Modal Focus Trap, Escape, Return Focus, Background Inert)
    console.log('\n--- Testing /san-pham Product Modal Accessibility (P2-1) ---');
    const productsTestPage = await context.newPage();
    await productsTestPage.goto(`http://localhost:${PORT}/san-pham`, { waitUntil: 'networkidle' });

    // Find first modal trigger button ("Xem thông tin" or "Chi tiết")
    const openModalBtn = productsTestPage.locator('button:has-text("Xem thông tin"), button:has-text("Chi tiết")').first();
    await openModalBtn.scrollIntoViewIfNeeded();
    await openModalBtn.click();
    await productsTestPage.waitForTimeout(200);

    // Verify dialog presence and ARIA attributes
    const dialogLocator = productsTestPage.locator('div[role="dialog"]');
    assert((await dialogLocator.count()) === 1, 'Modal dialog not found in DOM');
    assert.strictEqual(await dialogLocator.getAttribute('aria-modal'), 'true', 'Modal dialog missing aria-modal="true"');
    assert.strictEqual(await dialogLocator.getAttribute('aria-labelledby'), 'product-modal-title', 'Modal missing aria-labelledby');

    // Verify background inert and body overflow
    const isBodyOverflowHidden = await productsTestPage.evaluate(() => document.body.style.overflow === 'hidden');
    assert(isBodyOverflowHidden, 'Body overflow must be hidden while modal is open');

    const isBackgroundInert = await productsTestPage.evaluate(() => {
      const bg = document.querySelector('div[aria-hidden="true"]');
      return bg !== null && bg.hasAttribute('inert');
    });
    assert(isBackgroundInert, 'Background container must have aria-hidden="true" and inert attribute');
    console.log('  [PASS] Modal ARIA (role=dialog, aria-modal=true), body scroll lock, and background inert verified');

    // Verify initial focus is on close button
    const initialFocusedLabel = await productsTestPage.evaluate(() => (document.activeElement ? document.activeElement.getAttribute('aria-label') : null));
    assert.strictEqual(initialFocusedLabel, 'Đóng cửa sổ chi tiết sản phẩm', 'Initial focus should be on close button');
    console.log('  [PASS] Initial focus landed on modal close button');

    // Test Focus Trap: Tab through all focusable elements inside modal
    for (let i = 0; i < 5; i++) {
      await productsTestPage.keyboard.press('Tab');
    }
    const anyFocusOutside = await productsTestPage.evaluate(() => {
      const modal = document.querySelector('div[role="dialog"]');
      return modal ? !modal.contains(document.activeElement) : true;
    });
    assert(!anyFocusOutside, 'Focus escaped modal during Tab navigation');
    console.log('  [PASS] Tab focus trap cycles cleanly within modal dialog');

    // Test Shift+Tab reverse cycle
    await productsTestPage.keyboard.press('Shift+Tab');
    const isStillInside = await productsTestPage.evaluate(() => {
      const modal = document.querySelector('div[role="dialog"]');
      return modal ? modal.contains(document.activeElement) : false;
    });
    assert(isStillInside, 'Focus escaped modal during Shift+Tab navigation');
    console.log('  [PASS] Shift+Tab reverse focus trap verified');

    // Test Escape key closes modal and returns focus
    await productsTestPage.keyboard.press('Escape');
    await productsTestPage.waitForTimeout(200);
    assert((await dialogLocator.count()) === 0, 'Modal dialog should be closed after Escape key');

    const isBodyOverflowRestored = await productsTestPage.evaluate(() => document.body.style.overflow !== 'hidden');
    assert(isBodyOverflowRestored, 'Body overflow should be restored after closing modal');

    const isFocusReturned = await productsTestPage.evaluate(() => {
      const active = document.activeElement;
      return active ? (active.textContent || '').includes('Xem thông tin') || (active.textContent || '').includes('Chi tiết') : false;
    });
    assert(isFocusReturned, 'Focus must return to the trigger button that opened the modal');
    console.log('  [PASS] Escape key closes modal, restores body overflow, and returns focus to opener button');

    // Test Backdrop click to close
    const reOpenBtn = productsTestPage.locator('button:has-text("Xem thông tin"), button:has-text("Chi tiết")').first();
    await reOpenBtn.click();
    await productsTestPage.waitForTimeout(200);
    assert((await productsTestPage.locator('div[role="dialog"]').count()) === 1, 'Modal not reopened');
    await productsTestPage.mouse.click(10, 10);
    await productsTestPage.waitForTimeout(200);
    assert((await productsTestPage.locator('div[role="dialog"]').count()) === 0, 'Modal should close when clicking backdrop overlay');
    console.log('  [PASS] Backdrop click closes modal dialog');

    await productsTestPage.close();

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
