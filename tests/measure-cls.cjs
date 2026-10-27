const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 4303;
const DIST = path.resolve('D:/webbvct/dist');

function startServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
  };

  const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    let filePath = path.join(DIST, urlPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (e) {
      res.writeHead(500);
      res.end('Server Error: ' + e.message);
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      resolve(server);
    });
  });
}

(async () => {
  const server = await startServer();
  const br = await chromium.launch();
  const U = `http://127.0.0.1:${PORT}`;
  const out = [];

  for (const route of ['/', '/gioi-thieu', '/doi-ngu', '/co-so-vat-chat']) {
    for (const slow of [false, true]) {
      const c = await br.newContext({ viewport: { width: 412, height: 823 } });
      await c.addInitScript(() => {
        window.__ls = [];
        new PerformanceObserver(l => {
          for (const e of l.getEntries()) {
            if (!e.hadRecentInput) {
              window.__ls.push({
                v: +e.value.toFixed(4),
                t: Math.round(e.startTime),
                src: (e.sources || []).map(s => (s.node && (s.node.tagName + (s.node.id ? '#' + s.node.id : ''))) + ` y ${Math.round(s.previousRect.y)}→${Math.round(s.currentRect.y)}`)
              });
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
      });

      const p = await c.newPage();
      if (slow) {
        const cdp = await c.newCDPSession(p);
        await cdp.send('Network.emulateNetworkConditions', {
          offline: false,
          latency: 150,
          downloadThroughput: 1.6e6 / 8,
          uploadThroughput: 750e3 / 8
        });
      }
      await p.goto(U + route, { waitUntil: 'networkidle' });
      await p.waitForTimeout(1500);
      const ls = await p.evaluate(() => window.__ls);
      out.push({ route, slow, cls: +ls.reduce((a, e) => a + e.v, 0).toFixed(3), entries: ls.slice(0, 4) });
      await c.close();
    }
  }

  console.log(JSON.stringify(out, null, 2));
  await br.close();
  server.close();
})();
