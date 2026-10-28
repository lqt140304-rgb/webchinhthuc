const http = require('http');
const fs = require('fs');
const path = require('path');

const clientDir = 'D:/webbvct-spike/build/client';
if (fs.existsSync(path.join(clientDir, '404/index.html'))) {
  fs.copyFileSync(path.join(clientDir, '404/index.html'), path.join(clientDir, '404.html'));
}

// A production-grade static server simulator matching Vercel's static routing logic:
const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0].replace(/\/$/, '') || '/';
  
  // 1. Check exact static file
  const filePath = path.join(clientDir, urlPath === '/' ? 'index.html' : urlPath + '/index.html');
  if (fs.existsSync(filePath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(filePath));
  }

  // 2. Check private SPA routes
  if (urlPath.startsWith('/tai-khoan') || urlPath.startsWith('/quan-ly')) {
    const spaFallback = path.join(clientDir, '__spa-fallback.html');
    if (fs.existsSync(spaFallback)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' });
      return res.end(fs.readFileSync(spaFallback));
    }
  }

  // 3. Fallback: Not found -> HTTP 404
  const notFoundPath = path.join(clientDir, '404.html');
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' });
  if (fs.existsSync(notFoundPath)) {
    return res.end(fs.readFileSync(notFoundPath));
  }
  return res.end('404 Not Found');
});

server.listen(4173, async () => {
  console.log('Testing server running on port 4173...');
  
  const testUrls = [
    { url: '/', expectStatus: 200, expectText: 'LÊ SƠN' },
    { url: '/gioi-thieu', expectStatus: 200, expectText: 'Về Bệnh Viện Thú Y Lê Sơn' },
    { url: '/doi-ngu', expectStatus: 200, expectText: 'Đội Ngũ Bác Sĩ' },
    { url: '/co-so-vat-chat', expectStatus: 200, expectText: 'Cơ Sở Vật Chất' },
    { url: '/spike-seo-test', expectStatus: 200, expectText: 'Xác Minh Hiển Thị SEO HTML Tĩnh' },
    { url: '/tai-khoan/lich-hen', expectStatus: 200, expectText: '__reactRouterContext' },
    { url: '/quan-ly/lich-truc', expectStatus: 200, expectText: '__reactRouterContext' },
    { url: '/duong-dan-khong-ton-tai', expectStatus: 404, expectText: 'Không tìm thấy trang yêu cầu' },
    { url: '/dich-vu/slug-khong-ton-tai', expectStatus: 404, expectText: 'Không tìm thấy trang yêu cầu' },
  ];

  for (const test of testUrls) {
    await new Promise((resolve) => {
      http.get('http://localhost:4173' + test.url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const statusPass = res.statusCode === test.expectStatus;
          const textPass = data.includes(test.expectText);
          console.log(`URL: ${test.url.padEnd(30)} | Status: ${res.statusCode} (Expected ${test.expectStatus}: ${statusPass ? 'PASS' : 'FAIL'}) | Content: ${textPass ? 'PASS' : 'FAIL'}`);
          resolve();
        });
      });
    });
  }

  server.close();
});
