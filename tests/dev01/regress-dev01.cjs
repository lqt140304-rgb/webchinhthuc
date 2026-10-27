// Regression: compare baseline (ab443fe) vs DEV-01 (e1d45c9) on home, booking and other routes.
// Usage: node regress-dev01.cjs <baseUrl> <devUrl> <outDir>
const { chromium } = require('playwright');
const fs = require('fs');
const [BASEURL, DEVURL, OUT] = [process.argv[2], process.argv[3], process.argv[4]];
fs.mkdirSync(OUT + '/regress', { recursive: true });
const ROUTES = ['/', '/dat-lich', '/dich-vu', '/bang-gia', '/lien-he', '/goc-thu-cung', '/khong-ton-tai'];
const snap = async (p, url) => {
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(300);
  return p.evaluate(() => ({
    title: document.title, robots: document.querySelector('meta[name=robots]')?.content, canonical: document.querySelector('link[rel=canonical]')?.href || null,
    desc: document.querySelector('meta[name=description]')?.content,
    mainText: document.querySelector('main')?.innerText || '', sections: document.querySelectorAll('main section').length,
    headerText: document.querySelector('header')?.innerText || '', footerText: document.querySelector('footer')?.innerText || '',
    h: document.body.scrollHeight,
  }));
};
(async () => {
  const br = await chromium.launch();
  const out = {};
  for (const r of ROUTES) for (const w of [375, 1440]) {
    const c1 = await br.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' }); const p1 = await c1.newPage();
    const c2 = await br.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' }); const p2 = await c2.newPage();
    const a = await snap(p1, BASEURL + r); const b = await snap(p2, DEVURL + r);
    const diff = {};
    for (const k of Object.keys(a)) if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) diff[k] = k.endsWith('Text') ? { base: a[k].length, dev: b[k].length } : { base: a[k], dev: b[k] };
    if (r === '/' || r === '/dat-lich') {
      const n = r === '/' ? 'home' : 'dat-lich';
      await p1.screenshot({ path: `${OUT}/regress/${n}-${w}-base.png`, fullPage: true }); await p2.screenshot({ path: `${OUT}/regress/${n}-${w}-dev.png`, fullPage: true });
    }
    out[r + '@' + w] = { same: Object.keys(diff).length === 0, diff, sections: b.sections, robots: b.robots, title: b.title };
    if (diff.headerText) out[r + '@' + w].headerDiff = { base: a.headerText, dev: b.headerText };
    await c1.close(); await c2.close();
  }
  // header-only: menu descriptions in desktop mega menu
  fs.writeFileSync(OUT + '/regress/regress.json', JSON.stringify(out, null, 1));
  for (const [k, v] of Object.entries(out)) console.log(k.padEnd(20), v.same ? 'SAME' : 'DIFF ' + JSON.stringify(v.diff).slice(0, 300), '| sections', v.sections, '| robots', v.robots);
  await br.close();
})();
