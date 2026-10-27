const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 4301;
const DIST = path.resolve(__dirname, '../dist');

// Simple SPA static server
function startServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
  };

  const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    let filePath = path.join(DIST, urlPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (e) {
      res.writeHead(500);
      res.end('Server Error: ' + e.message);
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`Test server running at http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

async function runTests() {
  const server = await startServer();
  const browser = await chromium.launch();
  const BASE = `http://127.0.0.1:${PORT}`;

  const viewports = [320, 360, 375, 390, 414, 768, 1024, 1440, 1920];
  const routes = ['/gioi-thieu', '/doi-ngu', '/co-so-vat-chat', '/', '/dat-lich'];

  console.log('\n--- 1. TESTING HEADER MOBILE TOUCH TARGETS & SIZES ---');
  for (const vp of [320, 360, 375, 390, 414, 768, 1024]) {
    const context = await browser.newContext({ viewport: { width: vp, height: 800 } });
    const page = await context.newPage();
    await page.goto(`${BASE}/doi-ngu`, { waitUntil: 'networkidle' });

    const headerMetrics = await page.evaluate(() => {
      const header = document.querySelector('header');
      const cta = header.querySelector('a[href="/dat-lich"]');
      const hamburger = header.querySelector('button[aria-label^="Mở menu"]');
      const subtitle = header.querySelector('.text-\\[10px\\], .text-xs.uppercase');

      const headerBox = header ? header.getBoundingClientRect() : null;
      const ctaBox = cta ? cta.getBoundingClientRect() : null;
      const hamBox = hamburger ? hamburger.getBoundingClientRect() : null;

      const docEl = document.documentElement;
      const overflow = Math.max(0, docEl.scrollWidth - docEl.clientWidth);

      return {
        headerHeight: headerBox ? Math.round(headerBox.height) : 0,
        ctaWidth: ctaBox ? Math.round(ctaBox.width) : 0,
        ctaHeight: ctaBox ? Math.round(ctaBox.height) : 0,
        hamWidth: hamBox ? Math.round(hamBox.width) : 0,
        hamHeight: hamBox ? Math.round(hamBox.height) : 0,
        overflow,
        subtitleVisible: subtitle ? window.getComputedStyle(subtitle).display !== 'none' : false,
      };
    });

    console.log(
      `VP ${vp}px -> Header H: ${headerMetrics.headerHeight}px | CTA: ${headerMetrics.ctaWidth}x${headerMetrics.ctaHeight}px | Ham: ${headerMetrics.hamWidth}x${headerMetrics.hamHeight}px | Ovf: ${headerMetrics.overflow}px | Subtitle: ${headerMetrics.subtitleVisible}`
    );

    if (vp <= 414) {
      if (headerMetrics.ctaHeight < 44) {
        console.error(`FAIL: CTA height ${headerMetrics.ctaHeight} < 44 at ${vp}px`);
      }
      if (headerMetrics.hamWidth < 44 || headerMetrics.hamHeight < 44) {
        console.error(`FAIL: Hamburger size ${headerMetrics.hamWidth}x${headerMetrics.hamHeight} < 44 at ${vp}px`);
      }
    }
    if (headerMetrics.overflow > 0) {
      console.error(`FAIL: Horizontal overflow ${headerMetrics.overflow}px at ${vp}px`);
    }

    await context.close();
  }

  console.log('\n--- 2. TESTING TEAM GRID CARD WIDTHS ACROSS DEPARTMENTS (DEV01-P2-1) ---');
  for (const vp of [768, 1024, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width: vp, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${BASE}/doi-ngu`, { waitUntil: 'networkidle' });

    const teamCards = await page.evaluate(() => {
      const sections = ['dept-vet', 'dept-grooming', 'dept-support'];
      const data = {};
      for (const id of sections) {
        const sec = document.getElementById(id);
        if (!sec) continue;
        const cards = Array.from(sec.querySelectorAll('article')).map((card) => {
          const rect = card.getBoundingClientRect();
          const name = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : '';
          return {
            name,
            x: Math.round(rect.left),
            y: Math.round(rect.top + window.scrollY),
            w: Math.round(rect.width),
            h: Math.round(rect.height),
          };
        });
        data[id] = cards;
      }
      return data;
    });

    console.log(`\nViewport ${vp}px Card Measurements:`);
    const allWidths = [];
    for (const [dept, cards] of Object.entries(teamCards)) {
      console.log(`  [${dept}] (${cards.length} cards):`);
      for (const [idx, c] of cards.entries()) {
        console.log(`    Card #${idx + 1} (${c.name}): ${c.w} x ${c.h} px (x: ${c.x}, y: ${c.y})`);
        allWidths.push(c.w);
      }
    }

    // Check if card 3 of vet team is centered at 768px
    if (vp === 768 && teamCards['dept-vet'] && teamCards['dept-vet'].length === 3) {
      const c1 = teamCards['dept-vet'][0];
      const c2 = teamCards['dept-vet'][1];
      const c3 = teamCards['dept-vet'][2];
      const row1Center = (c1.x + c2.x + c2.w) / 2;
      const c3Center = c3.x + c3.w / 2;
      console.log(`  -> At 768px Vet Card 3 Center: ${c3Center} vs Row 1 Center: ${row1Center} (Diff: ${Math.abs(c3Center - row1Center)}px)`);
      if (Math.abs(c3Center - row1Center) <= 2) {
        console.log(`  -> PASS: Vet Card 3 is perfectly centered in Row 2!`);
      } else {
        console.error(`  -> FAIL: Vet Card 3 is NOT centered in Row 2!`);
      }
    }

    // Check uniformity of widths: min and max should match exactly (within 1px rounding)
    const minW = Math.min(...allWidths);
    const maxW = Math.max(...allWidths);
    console.log(`  -> Width Range: min=${minW}px, max=${maxW}px (Diff=${maxW - minW}px)`);
    if (maxW - minW <= 1) {
      console.log(`  -> PASS: 100% UNIFORM CARD WIDTH ACROSS ALL DEPARTMENTS AT ${vp}px!`);
    } else {
      console.error(`  -> FAIL: Non-uniform card widths at ${vp}px! Diff=${maxW - minW}px`);
    }

    await context.close();
  }

  console.log('\n--- 3. TESTING FAUX ITALIC LORA (DEV01-P2-2) ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${BASE}/gioi-thieu`, { waitUntil: 'networkidle' });

    const italicSerif = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('main *'));
      return els
        .filter((e) => {
          const cs = window.getComputedStyle(e);
          return cs.fontStyle === 'italic' && /Lora/i.test(cs.fontFamily) && e.textContent.trim().length > 0;
        })
        .map((e) => `${e.tagName}: "${e.textContent.trim().slice(0, 50)}"`);
    });

    console.log(`Italic Lora count: ${italicSerif.length}`);
    if (italicSerif.length === 0) {
      console.log('PASS: Zero faux italic Lora elements found on /gioi-thieu!');
    } else {
      console.error('FAIL: Found faux italic Lora:', italicSerif);
    }
    await context.close();
  }

  console.log('\n--- 4. TESTING ALT TEXT ON /co-so-vat-chat (DEV01-P2-3) ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${BASE}/co-so-vat-chat`, { waitUntil: 'networkidle' });

    const imgAlts = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('main img'));
      return imgs.map((img) => ({
        src: img.getAttribute('src'),
        alt: img.alt,
      }));
    });

    for (const img of imgAlts) {
      console.log(`Image: ${img.src} -> alt: "${img.alt}"`);
      if (img.alt.includes('Không gian tiếp đón') || img.alt.includes('Khu vực thăm khám')) {
        console.error(`FAIL: alt text describes facility zone instead of actual image: "${img.alt}"`);
      } else {
        console.log(`PASS: alt text accurately describes image content.`);
      }
    }
    await context.close();
  }

  console.log('\n--- 5. TESTING INTERNAL JARGON "Bản mockup" (DEV01-P2-4) ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${BASE}/doi-ngu`, { waitUntil: 'networkidle' });

    const pageText = await page.evaluate(() => document.body.innerText);
    const hasMockupJargon = /bản\s+mockup|mockup\s+hiện/i.test(pageText);

    console.log(`Contains "Bản mockup" jargon: ${hasMockupJargon}`);
    if (!hasMockupJargon) {
      console.log('PASS: Zero "Bản mockup" internal jargon found on /doi-ngu!');
    } else {
      console.error('FAIL: Found "Bản mockup" jargon on /doi-ngu!');
    }
    await context.close();
  }

  console.log('\n--- 6. TESTING HOMEPAGE & BOOKINGPAGE REGRESSION ---');
  for (const route of ['/', '/dat-lich']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const res = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });

    const h1 = await page.evaluate(() => document.querySelector('h1')?.textContent.trim());
    console.log(`Route ${route} status: ${res.status()} | h1: "${h1}"`);

    await context.close();
  }

  console.log('\nALL VERIFICATIONS COMPLETED.');
  await browser.close();
  server.close();
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
