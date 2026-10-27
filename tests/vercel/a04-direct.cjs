// A04 trực tiếp trên host Vercel (không proxy): route, refresh, trailing slash, query, 404, console/network, meta SEO.
// Chạy: VERCEL_AUTOMATION_BYPASS_SECRET=... node tests/vercel/a04-direct.cjs https://<preview> <outDir>
const { chromium } = require('playwright'); const fs = require('fs');
const [,, base, out] = process.argv; const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const routes = ['/', '/dat-lich', '/dat-lich/', '/dat-lich?utm_source=qa&x=1', '/gioi-thieu', '/dich-vu', '/dich-vu/kham-dieu-tri', '/lien-he', '/bang-gia', '/goc-thu-cung', '/cau-chuyen', '/tai-khoan', '/tai-khoan/', '/tai-khoan/dang-nhap', '/quan-ly', '/khong-ton-tai', '/abc/xyz'];
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 1366, height: 900 }, extraHTTPHeaders: secret ? { 'x-vercel-protection-bypass': secret } : {} });
  const res = [];
  for (const r of routes) {
    const p = await ctx.newPage(); const cons = [], bad = [], redirects = [];
    p.on('console', m => { if (m.type() === 'error') cons.push(m.text().slice(0, 160)) });
    p.on('pageerror', e => cons.push('pageerror: ' + e.message.slice(0, 160)));
    p.on('response', x => { const u = x.url(); if (x.status() >= 400 && !/vercel\.live/.test(u)) bad.push(x.status() + ' ' + u.replace(base, '')); if (x.status() >= 300 && x.status() < 400) redirects.push(x.status() + ' ' + u.replace(base, '')) });
    const resp = await p.goto(base + r, { waitUntil: 'networkidle' });
    const info = async () => p.evaluate(() => ({ url: location.pathname + location.search, title: document.title, h1: document.querySelector('h1')?.textContent.trim().slice(0, 60), robots: document.querySelector('meta[name=robots]')?.content || null, canonical: document.querySelector('link[rel=canonical]')?.href || null, notFound: /không tìm thấy|404/i.test(document.body.innerText.slice(0, 2000)), comingSoon: /sắp ra mắt|đang được xây dựng|coming soon/i.test(document.body.innerText.slice(0, 3000)) }));
    const first = await info();
    await p.reload({ waitUntil: 'networkidle' }); const afterReload = await info();
    res.push({ route: r, status: resp.status(), xRobots: resp.headers()['x-robots-tag'] || null, ...first, reloadSame: JSON.stringify(first) === JSON.stringify(afterReload), consoleErrors: cons, httpErrors: bad, redirects });
    if (['/', '/dat-lich', '/khong-ton-tai', '/tai-khoan', '/gioi-thieu'].includes(r)) await p.screenshot({ path: `${out}/direct${r === '/' ? '-home' : r.replace(/\//g, '-')}-1366.png` });
    await p.close();
  }
  fs.writeFileSync(`${out}/a04-direct.json`, JSON.stringify(res, null, 1));
  for (const x of res) console.log([x.route, x.status, 'XRT=' + x.xRobots, 'meta=' + x.robots, 'canon=' + (x.canonical || '-').replace(base, ''), 'h1=' + x.h1, x.notFound ? 'NOTFOUND' : '', x.comingSoon ? 'COMINGSOON' : '', 'reloadSame=' + x.reloadSame, 'cons=' + x.consoleErrors.length, 'http>=400=' + x.httpErrors.length, x.redirects.length ? 'redir=' + x.redirects.join(',') : ''].join(' | '));
  await br.close();
})();
