const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const clientDir = path.resolve(__dirname, '..', 'build', 'client');
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\6f5020a8-5310-41e1-a151-7821d0315e27';

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0].replace(/\/$/, '') || '/';

  const exactFilePath = path.join(clientDir, req.url.split('?')[0]);
  if (fs.existsSync(exactFilePath) && fs.statSync(exactFilePath).isFile()) {
    const ext = path.extname(exactFilePath);
    const contentType = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.webp' ? 'image/webp' : ext === '.woff2' ? 'font/woff2' : 'text/html';
    res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
    return res.end(fs.readFileSync(exactFilePath));
  }

  const dirIndexPath = path.join(clientDir, urlPath === '/' ? 'index.html' : urlPath + '/index.html');
  if (fs.existsSync(dirIndexPath) && fs.statSync(dirIndexPath).isFile()) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(dirIndexPath));
  }

  // SPA rewrite for dynamic routes
  if (urlPath.startsWith('/cau-chuyen/') || urlPath.startsWith('/bai-viet/') || urlPath.startsWith('/tai-khoan/')) {
    const spaFallback = path.join(clientDir, '__spa-fallback.html');
    if (fs.existsSync(spaFallback)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(spaFallback));
    }
  }

  const notFoundPath = path.join(clientDir, '404.html');
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync(notFoundPath));
});

const PORT = 5199;

server.listen(PORT, async () => {
  console.log(`Screenshot server running on http://localhost:${PORT}`);
  const browser = await chromium.launch();

  try {
    const pagesToCapture = [
      {
        url: `http://localhost:${PORT}/cau-chuyen`,
        name: 'stories'
      },
      {
        url: `http://localhost:${PORT}/goc-thu-cung`,
        name: 'pet-corner'
      },
      {
        url: `http://localhost:${PORT}/cau-chuyen/ca-dieu-tri-01`,
        name: 'story-detail'
      },
      {
        url: `http://localhost:${PORT}/bai-viet/dinh-duong-an-toan-cho-thu-cung`,
        name: 'article-detail'
      }
    ];

    for (const item of pagesToCapture) {
      // 1. Desktop 1440x900
      const desktopContext = await browser.newContext({
        viewport: { width: 1440, height: 900 }
      });
      const desktopPage = await desktopContext.newPage();
      await desktopPage.goto(item.url, { waitUntil: 'networkidle' });
      await desktopPage.waitForTimeout(500);
      const desktopPath = path.join(artifactDir, `p3-batch3b-${item.name}-1440.png`);
      await desktopPage.screenshot({ path: desktopPath });
      console.log(`Saved desktop screenshot: ${desktopPath}`);
      await desktopContext.close();

      // 2. Mobile 390x844
      const mobileContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true
      });
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto(item.url, { waitUntil: 'networkidle' });
      await mobilePage.waitForTimeout(500);
      const mobilePath = path.join(artifactDir, `p3-batch3b-${item.name}-390.png`);
      await mobilePage.screenshot({ path: mobilePath });
      console.log(`Saved mobile screenshot: ${mobilePath}`);
      await mobileContext.close();
    }

    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Screenshot capture failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
});
