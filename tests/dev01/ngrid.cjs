// Simulate N = 1..8 cards inside the real TeamGrid on /doi-ngu by cloning a rendered card (CSS-only layout test).
const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch(); const out = [];
  for (const w of [375, 768, 800, 1024, 1440]) {
    const p = await br.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(process.argv[2] + '/doi-ngu', { waitUntil: 'networkidle' });
    for (const n of [1, 2, 3, 5, 7, 8]) {
      const rows = await p.evaluate(n => {
        const grid = document.querySelector('#dept-vet article').parentElement;
        const proto = grid.querySelector('article').cloneNode(true);
        grid.querySelectorAll('article').forEach(a => a.remove());
        for (let i = 0; i < n; i++) grid.appendChild(proto.cloneNode(true));
        const gb = grid.getBoundingClientRect();
        const byRow = {};
        grid.querySelectorAll('article').forEach(a => { const b = a.getBoundingClientRect(); (byRow[Math.round(b.top)] ||= []).push(b); });
        return Object.values(byRow).map(r => ({ n: r.length, w: [...new Set(r.map(b => Math.round(b.width)))], h: [...new Set(r.map(b => Math.round(b.height)))], leftGap: Math.round(r[0].left - gb.left), rightGap: Math.round(gb.right - r[r.length - 1].right) }));
      }, n);
      out.push(`${w} N=${n} ${JSON.stringify(rows)}`);
    }
    await p.close();
  }
  console.log(out.join('\n')); await br.close();
})();
