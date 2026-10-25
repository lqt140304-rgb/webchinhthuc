// Mô phỏng hành vi kiểu GitHub Pages: server tĩnh trả public/404.html (HTTP 404) cho mọi đường dẫn không có tệp.
// Đây là mô phỏng logic của 404.html, KHÔNG phải kiểm chứng trên host đích.
// Chạy: npx http-server dist -p 4190 -s  (hoặc server tĩnh tương đương có trang 404.html)
//       SIM_URL=http://localhost:4190 EVIDENCE_DIR=./evidence node tests/e2e/hosting-404html-sim.cjs
const { chromium } = require('playwright')
const fs = require('node:fs')
const path = require('node:path')
const BASE = (process.env.SIM_URL || 'http://localhost:4190').replace(/\/$/, '')
const EVIDENCE = process.env.EVIDENCE_DIR || path.join(process.cwd(), 'e2e-evidence')
fs.mkdirSync(EVIDENCE, { recursive: true })

;(async () => {
  const browser = await chromium.launch()
  const page = await (await browser.newContext({ viewport: { width: 1366, height: 768 } })).newPage()
  const results = []
  for (const p of ['/gioi-thieu', '/dich-vu/spa', '/khong-ton-tai']) {
    const res = await page.goto(BASE + p)
    await page.waitForURL(BASE + '/', { timeout: 5000 }).catch(() => {})
    await page.waitForLoadState('networkidle')
    const h1 = await page.locator('main h1').first().innerText().catch(() => null)
    results.push({
      requested: p,
      firstStatus: res.status(),
      finalPath: new URL(page.url()).pathname,
      h1: h1 && h1.slice(0, 60),
      sessionStorageRedirect: await page.evaluate(() => sessionStorage.getItem('redirect')),
    })
  }
  await browser.close()
  fs.writeFileSync(path.join(EVIDENCE, 'hosting-404html-sim.json'), JSON.stringify({ base: BASE, results }, null, 2))
  console.log(JSON.stringify(results, null, 2))
  const lost = results.filter((r) => r.finalPath !== r.requested)
  if (lost.length) {
    console.error(`FAIL: ${lost.length}/${results.length} đường dẫn sâu bị đưa về ${lost.map((r) => r.finalPath).join(', ')}`)
    process.exit(1)
  }
})()
