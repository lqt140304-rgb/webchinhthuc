// Full-page screenshots of the same routes on two deployments (all lazy images forced to load), for pixel diff.
const { chromium } = require('playwright');
(async () => {
  const [A, B, out, ...routes] = process.argv.slice(2); const br = await chromium.launch();
  for (const r of routes) for (const w of [375, 1440]) for (const [tag, url] of [['a', A], ['b', B]]) {
    const c = await br.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce', extraHTTPHeaders: { 'x-vercel-protection-bypass': process.env.BYPASS, 'x-vercel-set-bypass-cookie': 'true' } });
    const p = await c.newPage(); await p.goto(url + r, { waitUntil: 'networkidle' });
    await p.evaluate(async () => { document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager'); for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); scrollTo(0, 0); });
    await p.waitForTimeout(700); await p.screenshot({ path: `${out}/${(r.slice(1) || 'home')}-${w}-${tag}.png`, fullPage: true }); await c.close();
  }
  await br.close();
})();
