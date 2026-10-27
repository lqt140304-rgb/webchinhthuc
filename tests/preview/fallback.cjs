// Filmstrip of /doi-ngu first load on a throttled network: is the Suspense fallback full-height and the footer kept out of view?
const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch(); const U = process.argv[2]; const res = [];
  for (const mode of ['direct', 'client-nav']) {
    const c = await br.newContext({ viewport: { width: 412, height: 823 }, extraHTTPHeaders: { 'x-vercel-protection-bypass': process.env.BYPASS, 'x-vercel-set-bypass-cookie': 'true' } });
    const p = await c.newPage(); const cdp = await c.newCDPSession(p);
    if (mode === 'client-nav') { await p.goto(U + '/', { waitUntil: 'networkidle' }); }
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: 400e3 / 8, uploadThroughput: 400e3 / 8 });
    if (mode === 'direct') p.goto(U + '/doi-ngu').catch(() => {}); else p.evaluate(() => { history.pushState({}, '', '/doi-ngu'); dispatchEvent(new PopStateEvent('popstate')); });
    for (let i = 0; i < 40; i++) {
      await p.waitForTimeout(150);
      const s = await p.evaluate(() => { const f = document.querySelector('footer'); const fb = document.querySelector('[role=status][aria-label="Đang tải trang"]'); return { fallback: !!fb, fbH: fb ? Math.round(fb.getBoundingClientRect().height) : 0, footerTop: f ? Math.round(f.getBoundingClientRect().top) : null, h1: !!document.querySelector('main h1') }; }).catch(() => null);
      if (!s) continue; res.push({ mode, t: (i + 1) * 150, ...s });
      if (s.fallback && !res.some(r => r.mode === mode && r.shot)) { await p.screenshot({ path: `ev/fallback-${mode}.png` }); res[res.length - 1].shot = true; }
      if (s.h1) break;
    }
    await c.close();
  }
  console.log(JSON.stringify(res.filter(r => r.fallback || r.h1).map(r => `${r.mode} t=${r.t} fallback=${r.fallback} fbH=${r.fbH} footerTop=${r.footerTop} h1=${r.h1}`), null, 1)); await br.close();
})();
