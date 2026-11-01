const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { chromium } = require('playwright');
const { recordConsoleErrors } = require('../e2e/console-errors.cjs');

test('expected document 404 is recorded; missing script and runtime errors remain failures', async () => {
  const server = http.createServer((req, res) => {
    if (req.url === '/app') {
      res.setHeader('Content-Type', 'text/html');
      res.end('<script src="/missing.js"></script><script src="/missing-page"></script><script>throw new Error("runtime sentinel")</script>');
    } else { res.writeHead(404, { 'Content-Type': 'text/html' }); res.end('<h1>Missing</h1>'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    const errors = [], measurements = [];
    const base = `http://127.0.0.1:${server.address().port}`;
    recordConsoleErrors(page, errors, measurements, 'test', base, new Set(['/missing-page', '/missing.js']));
    await page.goto(base + '/missing-page', { waitUntil: 'networkidle' });
    assert.equal(errors.length, 0);
    assert.equal(measurements.length, 1);
    await page.goto(base + '/app', { waitUntil: 'networkidle' });
    assert(errors.some(error => error.includes('/missing.js')));
    assert(errors.some(error => error.includes('/missing-page')), 'A later script at the same URL must still fail');
    assert(errors.some(error => error.includes('runtime sentinel')));
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});
