const { chromium } = require('playwright');

async function verify() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const fontRequests = [];
  page.on('request', req => {
    const u = req.url();
    if (u.includes('/fonts/')) fontRequests.push(u.split('/').pop());
  });

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const typographyCheck = await page.evaluate(() => {
    const targets = [
      { label: 'Header Logo Subtitle ("BỆNH VIỆN THÚ Y")', selector: 'header .tracking-widest' },
      { label: 'Header Nav Links', selector: 'header nav a, header nav button' },
      { label: 'Header CTA Button ("Đặt lịch khám")', selector: 'header a[href="/dat-lich"]' },
      { label: 'Hero Headline H1', selector: 'main h1' },
      { label: 'Hero Frame 1 Caption Subtitle', selector: 'main p.font-serif' },
      { label: 'Hero Eyebrow ("CHĂM SÓC")', selector: 'main span.uppercase.font-bold' },
      { label: 'Section 2 Values Title H3', selector: 'section:nth-of-type(2) h3' },
      { label: 'Section 4 Italic Footnote', selector: 'section:nth-of-type(4) p.italic, section:nth-of-type(4) span.italic' },
      { label: 'Section 5 Knowledge Card Title', selector: 'section:nth-of-type(5) h3' },
      { label: 'Footer Heading H4', selector: 'footer h4' },
      { label: 'General Body Paragraph', selector: 'main p:not(.font-serif)' }
    ];

    return targets.map(t => {
      const el = document.querySelector(t.selector);
      if (!el) return { label: t.label, found: false };
      const comp = window.getComputedStyle(el);
      return {
        label: t.label,
        found: true,
        text: el.innerText.trim().slice(0, 35),
        fontFamily: comp.fontFamily.split(',')[0].replace(/["']/g, ''),
        fontWeight: comp.fontWeight,
        fontStyle: comp.fontStyle,
        fontSize: comp.fontSize,
        lineHeight: comp.lineHeight
      };
    });
  });

  console.log('\n=== TYPOGRAPHY COMPUTED STYLES VERIFICATION (Home) ===');
  typographyCheck.forEach(t => {
    if (t.found) {
      console.log(`[${t.fontWeight}] ${t.fontFamily} (${t.fontStyle}) | ${t.label}: "${t.text}"`);
    } else {
      console.log(`[NOT FOUND] ${t.label}`);
    }
  });

  console.log('\n=== FONT REQUESTS ON HOMEPAGE ===');
  console.log(`Total font files requested: ${fontRequests.length}`);
  fontRequests.forEach(f => console.log(`  * ${f}`));

  // Check /dat-lich route
  const bookingFontRequests = [];
  page.on('request', req => {
    const u = req.url();
    if (u.includes('/fonts/')) bookingFontRequests.push(u.split('/').pop());
  });

  await page.goto('http://localhost:4173/dat-lich', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const bookingTypographyCheck = await page.evaluate(() => {
    const targets = [
      { label: 'Booking Page H1', selector: 'main h1' },
      { label: 'Booking Form Section Title', selector: 'main h2' },
      { label: 'Form Label ("Họ và tên chủ nuôi")', selector: 'label[for="ownerName"], label' },
      { label: 'Form Input Value / Placeholder', selector: 'input#ownerName' },
      { label: 'Booking Submit Button', selector: 'button[type="submit"]' },
      { label: 'Step Process Title', selector: 'main h3' }
    ];
    return targets.map(t => {
      const el = document.querySelector(t.selector);
      if (!el) return { label: t.label, found: false };
      const comp = window.getComputedStyle(el);
      return {
        label: t.label,
        found: true,
        text: el.innerText.trim().slice(0, 35),
        fontFamily: comp.fontFamily.split(',')[0].replace(/["']/g, ''),
        fontWeight: comp.fontWeight,
        fontStyle: comp.fontStyle
      };
    });
  });

  console.log('\n=== TYPOGRAPHY COMPUTED STYLES VERIFICATION (/dat-lich) ===');
  bookingTypographyCheck.forEach(t => {
    if (t.found) {
      console.log(`[${t.fontWeight}] ${t.fontFamily} (${t.fontStyle}) | ${t.label}: "${t.text}"`);
    } else {
      console.log(`[NOT FOUND] ${t.label}`);
    }
  });

  await browser.close();
}

verify().catch(console.error);
