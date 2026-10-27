// Record layout-shift entries on first load of each route (Preview, bypass header), with and without throttling.
const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch(); const U = process.argv[2]; const out = [];
  for (const route of ['/', '/gioi-thieu', '/doi-ngu', '/co-so-vat-chat']) for (const slow of [false, true]) for (const VP of [{ width: 412, height: 823 }, { width: 1440, height: 900 }]) {
    const c = await br.newContext({ viewport: VP, extraHTTPHeaders: { 'x-vercel-protection-bypass': process.env.BYPASS, 'x-vercel-set-bypass-cookie': 'true' } });
    await c.addInitScript(() => { window.__ls = []; new PerformanceObserver(l => { for (const e of l.getEntries()) window.__ls.push({ v: +e.value.toFixed(4), t: Math.round(e.startTime), src: (e.sources || []).map(s => (s.node && (s.node.tagName + (s.node.id ? '#' + s.node.id : ''))) + ` y ${Math.round(s.previousRect.y)}→${Math.round(s.currentRect.y)}`) }); }).observe({ type: 'layout-shift', buffered: true }); });
    const p = await c.newPage();
    if (slow) { const cdp = await c.newCDPSession(p); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 }); }
    await p.goto(U + route, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
    const ls = await p.evaluate(() => window.__ls);
    out.push({ route, slow, vp: VP.width, cls: +ls.reduce((a, e) => a + e.v, 0).toFixed(3), entries: ls.slice(0, 4) });
    if (route === '/gioi-thieu' && slow) { /* filmstrip */ }
    await c.close();
  }
  console.log(JSON.stringify(out, null, 1)); await br.close();
})();
