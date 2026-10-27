// QA 3A-04: extract ALL viewer-reachable text (visible, hidden N states, filter states,
// drawer, wireframe mode, attributes) and scan for P1 claim phrases.
const { chromium } = require('playwright');
const fs = require('fs');
const URL = 'http://127.0.0.1:4191/docs/design/phase-3a-interactive-mockups.html';
const OUT = process.argv[2];
const P1 = ['Nội khoa','Ngoại khoa','hội chẩn','phác đồ','Kỹ thuật viên','Nhân viên Hỗ trợ','khép kín','chỉ định xét nghiệm',
  'kíp trực','ca trực','bàn giao','cách ly','hồi sức','phân luồng','tách biệt','đèn sưởi','sinh hiệu','monitor','thoáng đãng',
  'khử khuẩn','vô khuẩn','sạch khuẩn','vệ sinh định kỳ','chỉ chia sẻ','da liễu','thân nhiệt','Bồn tắm','Mindray','phẫu thuật',
  'Bác sĩ trưởng','3 bác sĩ','ba bác sĩ','dinh dưỡng','dự phòng','thuộc tính','hidden','verified','Đã khắc phục','QA'];
(async () => {
  const br = await chromium.launch();
  const out = { states: {}, hits: {} };
  for (const w of [1440, 375]) {
    const p = await br.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(URL, { waitUntil: 'networkidle' });
    if (w === 375) { await p.click('button:has-text("390px")'); }
    for (const page of ['gioi-thieu', 'doi-ngu', 'co-so-vat-chat']) {
      await p.evaluate(pg => switchPageByNav(pg), page);
      if (page === 'doi-ngu') await p.evaluate(() => setTeamCount(8, 'standard'));
      await p.waitForTimeout(150);
      const txt = await p.evaluate(pg => document.getElementById('page-' + pg).innerText, page);
      out.states[`${page}@${w}`] = txt;
    }
    if (w === 375) {
      await p.click('#p3a-menu-toggle'); await p.waitForTimeout(150);
      out.states['drawer@375'] = await p.evaluate(() => document.getElementById('p3a-mobile-drawer').innerText);
      out.states['header@375'] = await p.evaluate(() => { const h = document.querySelector('.p3a-header'); const cta = h.querySelector('.p3a-btn-primary'); const r = cta.getBoundingClientRect(); const sub = h.querySelector('.p3a-brand-sub').getBoundingClientRect(); return JSON.stringify({ cta: cta.innerText, ctaH: r.height, ctaW: r.width, subH: sub.height, headerH: h.getBoundingClientRect().height }); });
    }
    await p.close();
  }
  // header at 320
  { const p = await br.newPage({ viewport: { width: 1440, height: 900 } }); await p.goto(URL, { waitUntil: 'networkidle' });
    for (const vp of ['320', '360', '390']) { await p.click(`button:has-text("${vp}px")`); await p.waitForTimeout(150);
      out.states['header@' + vp] = await p.evaluate(() => { const h = document.querySelector('.p3a-header'); const cta = h.querySelector('.p3a-btn-primary'); const r = cta.getBoundingClientRect(); const sub = h.querySelector('.p3a-brand-sub').getBoundingClientRect(); const lh = parseFloat(getComputedStyle(cta).lineHeight) || 20; return JSON.stringify({ cta: cta.innerText, ctaH: Math.round(r.height), ctaW: Math.round(r.width), ctaLines: Math.round((r.height - parseFloat(getComputedStyle(cta).paddingTop) - parseFloat(getComputedStyle(cta).paddingBottom)) / lh), subH: Math.round(sub.height), headerH: Math.round(h.getBoundingClientRect().height) }); }); }
    await p.screenshot({ path: OUT + '/header-320.png', clip: { x: 0, y: 0, width: 1440, height: 260 } });
    // wireframe mode text + filter statuses + attributes
    await p.click('button:has-text("Wireframe Blueprint")'); await p.waitForTimeout(150);
    out.states['wireframe-notes'] = await p.evaluate(() => [...document.querySelectorAll('.p3a-wf-note')].map(e => e.innerText).join('\n'));
    await p.click('button:has-text("Mockup Trực quan")');
    await p.evaluate(() => switchPageByNav('doi-ngu'));
    const st = [];
    for (const k of ['vet', 'grooming', 'support', 'all']) { await p.evaluate(k => filterDept(k, [...document.querySelectorAll('.p3a-filter-btn')].find(b => b.getAttribute('onclick').includes("'" + k + "'"))), k); st.push(await p.evaluate(() => document.getElementById('p3a-filter-status').textContent.trim())); }
    out.states['aria-live'] = st.join('\n');
    out.filterActiveClasses = await p.evaluate(() => [...document.querySelectorAll('.p3a-filter-btn')].map(b => b.textContent.trim() + ' class=' + b.className + ' pressed=' + b.getAttribute('aria-pressed')));
    out.states['attributes'] = await p.evaluate(() => [...document.querySelectorAll('#p3a-stage [title],#p3a-stage [alt],#p3a-stage [aria-label],#p3a-stage [data-tooltip]')].map(e => ['title', 'alt', 'aria-label', 'data-tooltip'].map(a => e.getAttribute(a)).filter(Boolean).join(' | ')).join('\n'));
    out.wfNoteVisibleInMockupMode = await p.evaluate(() => [...document.querySelectorAll('.p3a-wf-note')].filter(e => e.offsetParent !== null).length);
    await p.close(); }
  for (const [k, t] of Object.entries(out.states)) for (const ph of P1) {
    let i = -1; while ((i = t.indexOf(ph, i + 1)) >= 0) (out.hits[ph] ||= []).push(`${k}: …${t.slice(Math.max(0, i - 80), i + 60).replace(/\s+/g, ' ')}…`);
  }
  fs.writeFileSync(OUT + '/claims04.json', JSON.stringify(out, null, 1));
  for (const [k, v] of Object.entries(out.hits)) { console.log('== ' + k + ' (' + v.length + ')'); [...new Set(v.map(x => x.replace(/@\d+/, '')))].forEach(x => console.log('  ' + x)); }
  console.log('filter classes', out.filterActiveClasses); console.log('wfNotes visible in mockup mode', out.wfNoteVisibleInMockupMode);
  for (const k of Object.keys(out.states).filter(k => k.startsWith('header') || k === 'aria-live')) console.log(k, out.states[k]);
  await br.close();
})();
