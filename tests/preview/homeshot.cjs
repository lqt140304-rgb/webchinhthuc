const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  for (const [tag, url] of [['old', process.argv[2]], ['new', process.argv[3]]]) for (const w of [375, 1440]) {
    const c = await br.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce', extraHTTPHeaders: { 'x-vercel-protection-bypass': process.env.BYPASS, 'x-vercel-set-bypass-cookie': 'true' } });
    const p = await c.newPage(); await p.goto(url + '/', { waitUntil: 'networkidle' });
    await p.evaluate(async () => { document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager'); for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); scrollTo(0, 0); });
    await p.waitForTimeout(800);
    await p.screenshot({ path: `ev/home2-${w}-${tag}.png`, fullPage: true }); await c.close();
  }
  await br.close();
})();
