// QA DEV-01: render checks for /gioi-thieu, /doi-ngu, /co-so-vat-chat on a local vite preview.
// Usage: node qa-dev01.cjs <baseUrl> <outDir>
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = process.argv[2] || 'http://127.0.0.1:4301';
const OUT = process.argv[3] || './ev';
fs.mkdirSync(OUT + '/shots', { recursive: true });
const ROUTES = ['/gioi-thieu', '/doi-ngu', '/co-so-vat-chat'];
const VPS = [320, 375, 768, 1024, 1440, 1920];
const FORBIDDEN = ['Nội khoa', 'Ngoại khoa', 'hội chẩn', 'phác đồ', 'Kỹ thuật viên', 'Nhân viên Hỗ trợ', 'khép kín',
  'chỉ định xét nghiệm', 'kíp trực', 'ca trực', 'bàn giao', 'cách ly', 'hồi sức', 'phân luồng', 'tách biệt', 'đèn sưởi',
  'sinh hiệu', 'monitor', 'Mindray', 'phẫu thuật', 'phòng mổ', 'sạch khuẩn', 'vô khuẩn', 'Bác sĩ trưởng', '3 bác sĩ',
  'ba bác sĩ', 'năm kinh nghiệm', 'thành lập năm', 'giải thưởng', 'chứng nhận', 'ISO', 'hàng đầu', 'số 1', 'uy tín nhất',
  'được vệ sinh định kỳ', 'chỉ chia sẻ trực tiếp', 'thuộc tính hidden', 'verified', 'mockup', 'Mockup'];

const pageCheck = () => {
  const r = {};
  const de = document.documentElement;
  r.overflowPx = Math.max(0, de.scrollWidth - de.clientWidth);
  r.wide = [...document.querySelectorAll('main *')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.right > de.clientWidth + 1 || b.left < -1); }).slice(0, 5).map(e => e.tagName + '.' + (e.className || '').toString().slice(0, 40));
  r.clipped = [...document.querySelectorAll('main h1,main h2,main h3,main p,main span,main a,main button,main li')].filter(e => {
    const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    return (e.scrollWidth > e.clientWidth + 2 && (cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.textOverflow === 'ellipsis'));
  }).slice(0, 5).map(e => e.textContent.trim().slice(0, 40));
  r.imgs = [...document.querySelectorAll('main img')].map(i => { const b = i.getBoundingClientRect(); const cs = getComputedStyle(i); return { src: i.getAttribute('src'), alt: i.alt, fit: cs.objectFit, w: Math.round(b.width), h: Math.round(b.height), nat: i.naturalWidth + 'x' + i.naturalHeight, loaded: i.complete && i.naturalWidth > 0 }; });
  r.distorted = r.imgs.filter(i => i.loaded && i.fit !== 'cover' && i.fit !== 'contain' && Math.abs((i.w / i.h) - (parseInt(i.nat) / parseInt(i.nat.split('x')[1]))) > 0.02).length;
  r.h1 = document.querySelectorAll('h1').length;
  const hs = [...document.querySelectorAll('main h1,main h2,main h3,main h4')].map(h => +h.tagName[1]);
  r.headingSkip = hs.some((l, i) => i > 0 && l > hs[i - 1] + 1);
  r.smallTap = [...document.querySelectorAll('main a, main button, header a, header button')].filter(e => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return b.width > 0 && cs.visibility !== 'hidden' && (b.height < 44 || b.width < 24); }).map(e => (e.textContent.trim() || e.getAttribute('aria-label') || '').slice(0, 30) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height));
  r.title = document.title;
  r.robots = document.querySelector('meta[name=robots]')?.content;
  r.canonical = document.querySelector('link[rel=canonical]')?.href;
  r.description = document.querySelector('meta[name=description]')?.content;
  r.italicSerif = [...document.querySelectorAll('main *')].filter(e => { const cs = getComputedStyle(e); return cs.fontStyle === 'italic' && /Lora/.test(cs.fontFamily) && e.childNodes.length && e.textContent.trim(); }).map(e => e.tagName + ': ' + e.textContent.trim().slice(0, 50));
  r.fonts = [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '') + '/' + f.weight + '/' + f.style))];
  return r;
};

(async () => {
  const br = await chromium.launch();
  const res = { pages: {}, header: {}, team: {}, filter: {}, keyboard: {}, drawer: {}, reload: {}, reduced: {}, console: {}, content: {}, focus: {} };
  for (const route of ROUTES) {
    for (const w of VPS) {
      const ctx = await br.newContext({ viewport: { width: w, height: 900 } });
      const p = await ctx.newPage();
      const errs = []; p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text().slice(0, 200)); }); p.on('pageerror', e => errs.push('pageerror: ' + e.message));
      await p.goto(BASE + route, { waitUntil: 'networkidle' });
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } window.scrollTo(0, 0); });
      await p.waitForTimeout(300);
      const r = await p.evaluate(pageCheck);
      r.console = errs;
      res.pages[route + '@' + w] = r;
      await p.screenshot({ path: `${OUT}/shots/${route.slice(1)}-${w}.png`, fullPage: true });
      if (route === '/doi-ngu') {
        res.team[w] = await p.evaluate(() => [...document.querySelectorAll('main section')].filter(s => s.querySelector('article h3')).map(s => ({ id: s.id, cards: [...s.querySelectorAll('article')].filter(a => a.querySelector('[aria-hidden=true]')).map(a => { const b = a.getBoundingClientRect(); return { name: a.querySelector('h3').textContent.trim().slice(0, 22), x: Math.round(b.left), y: Math.round(b.top + scrollY), w: Math.round(b.width), h: Math.round(b.height), bg: getComputedStyle(a).backgroundColor, shadow: getComputedStyle(a).boxShadow.slice(0, 30), border: getComputedStyle(a).borderColor }; }), container: (() => { const c = s.querySelector('.max-w-7xl'); const b = c.getBoundingClientRect(); return { left: Math.round(b.left), width: Math.round(b.width) }; })() })));
      }
      await ctx.close();
    }
  }
  // Header at narrow widths, on home and a 3A page
  for (const route of ['/', '/doi-ngu']) for (const w of [320, 360, 375, 390, 400, 414, 420, 430, 768]) {
    const ctx = await br.newContext({ viewport: { width: w, height: 800 } }); const p = await ctx.newPage();
    await p.goto(BASE + route, { waitUntil: 'networkidle' });
    res.header[route + '@' + w] = await p.evaluate(() => {
      const h = document.querySelector('header'); const cta = [...h.querySelectorAll('a')].find(a => a.getAttribute('href') === '/dat-lich');
      const visTxt = el => [...el.querySelectorAll('span')].filter(s => getComputedStyle(s).display !== 'none' && s.offsetParent).map(s => s.textContent.trim()).join('|');
      const cb = cta.getBoundingClientRect(); const lh = parseFloat(getComputedStyle(cta).lineHeight) || 16;
      const sub = [...h.querySelectorAll('span')].find(s => s.textContent.trim() === 'Bệnh viện Thú y');
      return { headerH: Math.round(h.getBoundingClientRect().height), cta: visTxt(cta), ctaH: Math.round(cb.height), ctaW: Math.round(cb.width), ctaRight: Math.round(cb.right), subVisible: !!(sub && getComputedStyle(sub).display !== 'none'), subH: sub ? Math.round(sub.getBoundingClientRect().height) : 0, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    if (w === 375 || w === 414) await p.screenshot({ path: `${OUT}/shots/header-${route === '/' ? 'home' : 'doi-ngu'}-${w}.png`, clip: { x: 0, y: 0, width: w, height: 90 } });
    await ctx.close();
  }
  // Filter keyboard + aria-live + all-state content
  {
    const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
    await p.goto(BASE + '/doi-ngu', { waitUntil: 'networkidle' });
    const btns = await p.$$('[role=toolbar] button');
    res.filter.buttons = await Promise.all(btns.map(b => b.evaluate(e => e.textContent.trim() + ' pressed=' + e.getAttribute('aria-pressed') + ' h=' + Math.round(e.getBoundingClientRect().height))));
    // keyboard: focus first button then Tab to 2nd, press Enter; Tab to 3rd press Space
    await btns[0].focus();
    const steps = [];
    for (const [key, i] of [['Tab', 1], ['Enter', 1], ['Tab', 2], ['Space', 2], ['Tab', 3], ['Enter', 3], ['Shift+Tab', 2], ['Shift+Tab', 1], ['Shift+Tab', 0], ['Enter', 0]]) {
      await p.keyboard.press(key); await p.waitForTimeout(120);
      steps.push(await p.evaluate(k => ({ key: k, focused: document.activeElement.textContent.trim().slice(0, 40), focusRing: (() => { const cs = getComputedStyle(document.activeElement); return cs.outlineStyle + ' ' + cs.outlineWidth + ' / ' + cs.boxShadow.slice(0, 40); })(), pressed: [...document.querySelectorAll('[role=toolbar] button')].map(b => b.getAttribute('aria-pressed')).join(','), sections: [...document.querySelectorAll('main section[id^=dept]')].map(s => s.id).join(','), live: document.getElementById('team-filter-status').textContent.trim(), liveAttr: document.getElementById('team-filter-status').getAttribute('aria-live') }), key));
    }
    res.keyboard = steps;
    await ctx.close();
  }
  // Content scan across filter states and all routes (rendered text + attributes)
  {
    const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
    const texts = {};
    for (const route of ROUTES) {
      await p.goto(BASE + route, { waitUntil: 'networkidle' });
      texts[route] = await p.evaluate(() => document.querySelector('main').innerText + '\n' + [...document.querySelectorAll('main [alt],main [aria-label],main [title]')].map(e => [e.getAttribute('alt'), e.getAttribute('aria-label'), e.getAttribute('title')].filter(Boolean).join(' | ')).join('\n') + '\nTITLE ' + document.title + '\nDESC ' + document.querySelector('meta[name=description]')?.content);
      if (route === '/doi-ngu') for (const i of [1, 2, 3]) { await p.click(`[role=toolbar] button >> nth=${i}`); await p.waitForTimeout(100); texts[route + '#f' + i] = await p.evaluate(() => document.querySelector('main').innerText); }
    }
    const hdr = await p.evaluate(() => document.querySelector('header').innerText + '\n' + (document.querySelector('footer')?.innerText || ''));
    texts['header+footer'] = hdr;
    const hits = {};
    for (const [k, t] of Object.entries(texts)) for (const ph of FORBIDDEN) { let i = -1; while ((i = t.indexOf(ph, i + 1)) >= 0) (hits[ph] ||= []).push(k + ': …' + t.slice(Math.max(0, i - 70), i + 50).replace(/\s+/g, ' ') + '…'); }
    res.content = { hits, texts };
    await ctx.close();
  }
  // Mobile drawer
  {
    const ctx = await br.newContext({ viewport: { width: 375, height: 800 } }); const p = await ctx.newPage();
    await p.goto(BASE + '/gioi-thieu', { waitUntil: 'networkidle' });
    const tog = await p.$('header button[aria-label^="Mở menu"]');
    const before = await tog.evaluate(b => ({ label: b.getAttribute('aria-label'), expanded: b.getAttribute('aria-expanded'), controls: b.getAttribute('aria-controls'), box: Math.round(b.getBoundingClientRect().width) + 'x' + Math.round(b.getBoundingClientRect().height) }));
    await tog.click(); await p.waitForTimeout(400);
    const open = await p.evaluate(() => ({ expanded: document.querySelector('header button[aria-label^="Mở menu"], header button[aria-label^="Đóng menu"]')?.getAttribute('aria-expanded'), dialog: !!document.querySelector('[role=dialog]'), links: [...document.querySelectorAll('[role=dialog] a, nav[aria-label] a')].map(a => a.getAttribute('href')).filter((v, i, s) => s.indexOf(v) === i).slice(0, 30), focusInside: !!document.activeElement.closest('[role=dialog]') }));
    await p.screenshot({ path: `${OUT}/shots/drawer-375.png` });
    await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    const esc = await p.evaluate(() => ({ expanded: document.querySelector('header button[aria-label^="Mở menu"], header button[aria-label^="Đóng menu"]')?.getAttribute('aria-expanded'), dialog: !!document.querySelector('[role=dialog]'), focus: document.activeElement.getAttribute('aria-label') || document.activeElement.textContent.trim().slice(0, 30) }));
    await tog.click(); await p.waitForTimeout(400);
    const acc = await p.$('[role=dialog] button:has-text("Về Lê Sơn")'); if (acc) { await acc.click(); await p.waitForTimeout(300); }
    res.drawerAbout = await p.evaluate(() => [...document.querySelectorAll('[role=dialog] a')].filter(a => a.offsetParent).map(a => a.getAttribute('href') + ' ' + a.textContent.trim().replace(/\s+/g, ' ').slice(0, 60)));
    const link = await p.$('[role=dialog] a[href="/doi-ngu"]');
    let nav = null; if (link) { await link.click(); await p.waitForTimeout(600); nav = await p.evaluate(() => ({ path: location.pathname, h1: document.querySelector('h1')?.textContent.trim(), dialog: !!document.querySelector('[role=dialog]') })); }
    res.drawer = { before, open, esc, nav };
    await ctx.close();
  }
  // Direct nav + reload
  for (const route of ROUTES) {
    const ctx = await br.newContext(); const p = await ctx.newPage();
    const r1 = await p.goto(BASE + route, { waitUntil: 'networkidle' }); const a = await p.evaluate(() => document.querySelector('h1')?.textContent.trim());
    const r2 = await p.reload({ waitUntil: 'networkidle' }); const b = await p.evaluate(() => ({ h1: document.querySelector('h1')?.textContent.trim(), robots: document.querySelector('meta[name=robots]')?.content, title: document.title }));
    res.reload[route] = { status1: r1.status(), h1: a, status2: r2.status(), after: b };
    await ctx.close();
  }
  // Reduced motion + focus ring sampling
  {
    const ctx = await br.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
    await p.goto(BASE + '/gioi-thieu', { waitUntil: 'networkidle' });
    res.reduced = await p.evaluate(() => { const els = [...document.querySelectorAll('main *')]; const t = els.map(e => getComputedStyle(e)); return { maxTransition: Math.max(...t.map(c => Math.max(...c.transitionDuration.split(',').map(parseFloat)))), maxAnim: Math.max(...t.map(c => Math.max(...c.animationDuration.split(',').map(parseFloat)))) }; });
    const rings = [];
    for (let i = 0; i < 18; i++) { await p.keyboard.press('Tab'); await p.waitForTimeout(40); rings.push(await p.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return (e.textContent.trim() || e.getAttribute('aria-label') || e.tagName).slice(0, 28) + ' :: ' + cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor + (cs.boxShadow !== 'none' ? ' | shadow' : ''); })); }
    res.focus.gioiThieu = rings;
    await ctx.close();
  }
  fs.writeFileSync(OUT + '/qa-dev01.json', JSON.stringify(res, null, 1));
  // summary
  for (const [k, v] of Object.entries(res.pages)) console.log(k.padEnd(22), 'ovf', v.overflowPx, 'wide', v.wide.length, 'clip', v.clipped.length, 'dist', v.distorted, 'h1', v.h1, 'skip', v.headingSkip, 'tap<44', v.smallTap.length, 'italicLora', v.italicSerif.length, 'console', v.console.length, 'robots', v.robots);
  console.log('HEADER'); for (const [k, v] of Object.entries(res.header)) console.log(' ', k, JSON.stringify(v));
  console.log('CONTENT HITS'); for (const [k, v] of Object.entries(res.content.hits)) console.log(' ', k, v.length, v.slice(0, 3));
  await br.close();
})();
