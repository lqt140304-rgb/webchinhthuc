// Proxy cục bộ thêm header x-vercel-protection-bypass để chạy E2E/visual (BASE_URL=http://127.0.0.1:4180)
// với Preview có Vercel Authentication. Không ghi log secret. Không dùng cho Lighthouse (đo trực tiếp host thật).
// Chạy: NODE_USE_ENV_PROXY=1 VERCEL_AUTOMATION_BYPASS_SECRET=... node tests/vercel/bypass-proxy.cjs https://<preview-host> [port]
const http = require('http'), https = require('https');
const target = new URL(process.argv[2]); const port = +(process.argv[3] || 4180);
const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
if (!secret) { console.error('Thiếu VERCEL_AUTOMATION_BYPASS_SECRET'); process.exit(1); }
http.createServer((req, res) => {
  const headers = { ...req.headers, host: target.host, 'x-vercel-protection-bypass': secret };
  delete headers['accept-encoding']; // tránh nén để Playwright đọc thẳng
  const up = https.request({ hostname: target.hostname, port: 443, path: req.url, method: req.method, headers }, r => {
    const h = { ...r.headers };
    if (h.location) h.location = h.location.replace(target.origin, `http://127.0.0.1:${port}`);
    res.writeHead(r.statusCode, h); r.pipe(res);
  });
  up.on('error', e => { res.writeHead(502); res.end('upstream error: ' + e.message); });
  req.pipe(up);
}).listen(port, '127.0.0.1', () => console.log(`bypass proxy http://127.0.0.1:${port} -> ${target.origin}`));
