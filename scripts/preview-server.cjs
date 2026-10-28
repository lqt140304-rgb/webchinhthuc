const http = require('http');
const fs = require('fs');
const path = require('path');

const clientDir = path.resolve(__dirname, '..', 'build', 'client');

// Parse --port from args
let port = 4173;
const portIdx = process.argv.indexOf('--port');
if (portIdx !== -1 && process.argv[portIdx + 1]) {
  port = parseInt(process.argv[portIdx + 1], 10);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const cleanPath = urlPath.replace(/\/$/, '') || '/';

  // 1. Exact static file (assets, images, robots.txt, etc.)
  const exactPath = path.join(clientDir, urlPath);
  if (fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) {
    const ext = path.extname(exactPath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    return res.end(fs.readFileSync(exactPath));
  }

  // 2. Directory index.html (Prerendered clean URLs: /gioi-thieu, /dat-lich, etc.)
  const indexPath = path.join(clientDir, cleanPath === '/' ? '' : cleanPath, 'index.html');
  if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(indexPath));
  }

  // 3. SPA Rewrites (matching vercel.json for dynamic parameterized routes)
  if (cleanPath.startsWith('/tai-khoan') || cleanPath.startsWith('/cau-chuyen') || cleanPath.startsWith('/bai-viet')) {
    const fallbackPath = path.join(clientDir, '__spa-fallback.html');
    if (fs.existsSync(fallbackPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(fallbackPath));
    }
  }

  // 4. 404 Fallback (matching vercel.json default fallback)
  const notFoundPath = path.join(clientDir, '404.html');
  if (fs.existsSync(notFoundPath)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(notFoundPath));
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

server.listen(port, () => {
  console.log(`[Preview Server] Serving build/client at http://localhost:${port}`);
});
