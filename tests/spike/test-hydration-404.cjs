const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const clientDir = path.resolve(__dirname, '..', '..', 'build', 'client');

// Static server matching vercel.json
const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0].replace(/\/$/, '') || '/';
  
  // Static assets
  const exactFilePath = path.join(clientDir, req.url.split('?')[0]);
  if (fs.existsSync(exactFilePath) && fs.statSync(exactFilePath).isFile()) {
    const ext = path.extname(exactFilePath);
    const contentType = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'text/html';
    res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
    return res.end(fs.readFileSync(exactFilePath));
  }

  // Prerendered static pages
  const dirIndexPath = path.join(clientDir, urlPath === '/' ? 'index.html' : urlPath + '/index.html');
  if (fs.existsSync(dirIndexPath) && fs.statSync(dirIndexPath).isFile()) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(dirIndexPath));
  }

  // SPA fallback for dynamic routes
  if (urlPath.startsWith('/tai-khoan/') || urlPath.startsWith('/cau-chuyen/') || urlPath.startsWith('/bai-viet/')) {
    const spaFallback = path.join(clientDir, '__spa-fallback.html');
    if (fs.existsSync(spaFallback)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(spaFallback));
    }
  }

  // 404
  const notFoundPath = path.join(clientDir, '404.html');
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync(notFoundPath));
});

server.listen(5199, async () => {
  console.log('Testing Hydration & Console Errors with Playwright Chromium...');
  const browser = await chromium.launch();
  
  const testUrls = [
    { url: '/khong-ton-tai', expectStatus: 404, expectH1: 'Không tìm thấy trang yêu cầu' },
    { url: '/quan-ly/lich-truc', expectStatus: 404, expectH1: 'Không tìm thấy trang yêu cầu' },
    { url: '/dich-vu/slug-khong-ton-tai', expectStatus: 404, expectH1: 'Không tìm thấy trang yêu cầu' },
    { url: '/cau-chuyen/ca-dieu-tri-01', expectStatus: 200, expectH1: 'Chi tiết câu chuyện điều trị' },
    { url: '/bai-viet/cham-soc-mua-mua', expectStatus: 200, expectH1: 'Chi tiết bài viết cẩm nang' },
    { url: '/tai-khoan', expectStatus: 200, expectH1: 'Cổng quản lý hồ sơ thú cưng' },
    { url: '/tai-khoan/', expectStatus: 200, expectH1: 'Cổng quản lý hồ sơ thú cưng' },
    { url: '/tai-khoan/lich-hen', expectStatus: 200, expectH1: 'Cổng quản lý hồ sơ thú cưng' },
  ];

  let totalFailed = 0;

  for (const t of testUrls) {
    const page = await browser.newPage();
    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', msg => {
      // Ignore normal expected 404 network resource errors
      if (msg.type() === 'error' && !msg.text().includes('status of 404')) {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err.message);
    });

    const resp = await page.goto('http://localhost:5199' + t.url, { waitUntil: 'networkidle' });
    const h1 = await page.evaluate(() => document.querySelector('h1')?.innerText || '');
    const has418 = pageErrors.some(e => e.includes('418') || e.includes('Hydration failed'));

    const statusMatch = resp.status() === t.expectStatus;
    const h1Match = h1.includes(t.expectH1);
    const pass = statusMatch && h1Match && !has418 && consoleErrors.length === 0 && pageErrors.length === 0;

    if (!pass) totalFailed++;

    console.log(
      `URL: ${t.url.padEnd(28)} | HTTP: ${resp.status()} | H1: ${h1.slice(0, 30).padEnd(30)} | Hydration 418: ${has418 ? 'FAIL' : 'CLEAN'} | Result: ${pass ? 'PASS' : 'FAIL'}`
    );

    if (consoleErrors.length > 0) console.log('   Console errors:', consoleErrors);
    if (pageErrors.length > 0) console.log('   Page errors:', pageErrors);

    await page.close();
  }

  await browser.close();
  server.close(() => {
    if (totalFailed === 0) {
      console.log('\n[PASS] All 404 and Dynamic Route hydration tests PASSED with 0 errors.');
      process.exit(0);
    } else {
      console.error(`\n[FAIL] ${totalFailed} tests failed.`);
      process.exit(1);
    }
  });
});
