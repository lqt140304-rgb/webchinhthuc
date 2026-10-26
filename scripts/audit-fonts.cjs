const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function run() {
  const fontsCssPath = path.join('src', 'styles', 'fonts.css');
  const fontsCss = fs.readFileSync(fontsCssPath, 'utf8');

  // Parse font-face rules
  const fontFaceMatches = [...fontsCss.matchAll(/@font-face\s*\{([^}]+)\}/g)];
  console.log(`Total @font-face rules in fonts.css: ${fontFaceMatches.length}`);

  const declaredRules = fontFaceMatches.map((m, idx) => {
    const body = m[1];
    const family = (body.match(/font-family:\s*'([^']+)'/) || [])[1];
    const style = (body.match(/font-style:\s*(\w+)/) || [])[1];
    const weight = (body.match(/font-weight:\s*([^;]+)/) || [])[1];
    const src = (body.match(/src:\s*url\('([^']+)'\)/) || [])[1];
    const range = (body.match(/unicode-range:\s*([^;]+);/) || [])[1];
    return { idx: idx + 1, family, style, weight, src, rangeSnippet: range?.slice(0, 30) };
  });

  console.log('\n--- Declared @font-face rules: ---');
  declaredRules.forEach(r => {
    console.log(`[${r.idx}] ${r.family} | ${r.style} | ${r.weight} | ${r.src}`);
  });

  // Launch browser and record actual font requests on Home and /dat-lich
  const browser = await chromium.launch();

  for (const route of ['/', '/dat-lich']) {
    console.log(`\n=== Checking Route: ${route} ===`);
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true
    });
    const page = await context.newPage();

    const fontRequests = [];
    page.on('request', req => {
      const u = req.url();
      if (u.includes('/fonts/') || u.endsWith('.woff2')) {
        fontRequests.push({ url: u, resourceType: req.resourceType() });
      }
    });

    await page.goto(`http://localhost:4173${route}`, { waitUntil: 'networkidle' });

    console.log(`Actual font requests made (${fontRequests.length} files):`);
    let totalBytes = 0;
    fontRequests.forEach(f => {
      const relPath = path.join('public', f.url.replace(/^http:\/\/[^/]+\//, ''));
      const size = fs.existsSync(relPath) ? fs.statSync(relPath).size : 0;
      totalBytes += size;
      console.log(`  - ${f.url} (${(size / 1024).toFixed(1)} KB)`);
    });
    console.log(`Total font payload on ${route}: ${(totalBytes / 1024).toFixed(1)} KB across ${fontRequests.length} requests`);

    // Check computed fonts of elements in initial viewport (viewport height 844)
    const viewportFonts = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const inView = elements.filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.top < 844 && rect.bottom > 0 && rect.width > 0 && rect.height > 0;
      });

      const fontUsage = new Set();
      inView.forEach(el => {
        if (el.innerText && el.innerText.trim()) {
          const comp = window.getComputedStyle(el);
          fontUsage.add(`${comp.fontFamily} | weight: ${comp.fontWeight} | style: ${comp.fontStyle} (text: "${el.innerText.trim().slice(0, 25)}")`);
        }
      });
      return Array.from(fontUsage);
    });

    console.log(`\nComputed fonts in initial viewport (${viewportFonts.length} distinct usages):`);
    viewportFonts.slice(0, 15).forEach(f => console.log(`  * ${f}`));

    await context.close();
  }

  await browser.close();
}

run().catch(console.error);
