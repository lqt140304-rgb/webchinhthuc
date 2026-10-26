const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const evDir = path.join('docs', 'qa', '2b-font-evidence');
if (!fs.existsSync(evDir)) fs.mkdirSync(evDir, { recursive: true });

const viewports = [
  { name: 'home-320px', route: '/', width: 320, height: 600, mobile: true },
  { name: 'home-390px', route: '/', width: 390, height: 844, mobile: true },
  { name: 'home-768px', route: '/', width: 768, height: 1024, mobile: false },
  { name: 'home-1440px', route: '/', width: 1440, height: 900, mobile: false },
  { name: 'booking-390px', route: '/dat-lich', width: 390, height: 844, mobile: true },
  { name: 'booking-1440px', route: '/dat-lich', width: 1440, height: 900, mobile: false }
];

async function capture() {
  const browser = await chromium.launch();
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.mobile
    });
    const page = await context.newPage();
    await page.goto('http://localhost:4173' + vp.route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const dest = path.join(evDir, `${vp.name}.png`);
    await page.screenshot({ path: dest, fullPage: false });
    console.log(`Saved screenshot: ${dest}`);
    await context.close();
  }
  await browser.close();
}

capture().catch(console.error);
