// E2E bổ sung cho vòng sửa 03 của mốc 2A (A01–A03 trong "Quyết định và thứ tự làm việc" ngày 26/10/2026).
// Chạy: BASE_URL=http://localhost:4173 APP_DIR=<bản sao đã build> EVIDENCE_DIR=./ev node --test tests/e2e/
const { test, before, after, describe } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { chromium } = require('playwright')

const BASE = (process.env.BASE_URL || 'http://localhost:4173').replace(/\/$/, '')
const APP_DIR = process.env.APP_DIR || null
const EVIDENCE = process.env.EVIDENCE_DIR || path.join(process.cwd(), 'e2e-evidence')
fs.mkdirSync(EVIDENCE, { recursive: true })

const MENU_BTN = 'header button[aria-haspopup="dialog"]'
const DIALOG = '[role="dialog"][aria-modal="true"]'
const DESKTOP_NAV = 'header nav'

let browser
const consoleErrors = []
const measurements = []

before(async () => {
  browser = await chromium.launch()
})
after(async () => {
  fs.writeFileSync(path.join(EVIDENCE, 'measurements-round03.json'), JSON.stringify({ base: BASE, measurements, consoleErrors }, null, 2))
  await browser?.close()
})

async function open(urlPath, { width = 1280, height = 800, mobile = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile })
  const page = await ctx.newPage()
  const tag = `${urlPath}@${width}${mobile ? 'm' : ''}`
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(`${tag}: ${m.text()}`))
  page.on('pageerror', (e) => consoleErrors.push(`${tag}: ${e.message}`))
  await page.goto(BASE + urlPath, { waitUntil: 'networkidle' })
  return { ctx, page }
}

async function openDropdownByKeyboard(page, label) {
  const t = page.locator(`${DESKTOP_NAV} button`, { hasText: label })
  await t.focus()
  await page.keyboard.press('Enter')
  await page.waitForFunction(([sel, text]) => [...document.querySelectorAll(sel)].some((b) => b.textContent.includes(text) && b.getAttribute('aria-expanded') === 'true'), [`${DESKTOP_NAV} button`, label])
}

const headerCurrent = (page) => page.evaluate(() => [...document.querySelectorAll('header [aria-current="page"]')].map((e) => e.getAttribute('href')))

async function drawerCurrent(page) {
  await page.locator(MENU_BTN).click()
  await page.locator(DIALOG).waitFor({ state: 'visible' })
  const labels = (await page.locator(`${DIALOG} button[aria-expanded]`).allTextContents()).map((l) => l.trim()).filter(Boolean)
  const current = new Set()
  const grab = async () => {
    for (const h of await page.locator(`${DIALOG} [aria-current="page"]`).evaluateAll((as) => as.map((a) => a.getAttribute('href')))) current.add(h)
  }
  await grab()
  for (const label of labels) {
    const btn = page.locator(`${DIALOG} button[aria-expanded]`, { hasText: label }).first()
    if ((await btn.getAttribute('aria-expanded')) !== 'true') await btn.click()
    await page.waitForFunction(([sel, text]) => [...document.querySelectorAll(sel)].some((b) => b.textContent.trim() === text && b.getAttribute('aria-expanded') === 'true'), [`${DIALOG} button[aria-expanded]`, label])
    await grab()
  }
  return [...current]
}

// ---------------------------------------------------------------- A02 query / dấu "/" cuối
const CASES = [
  // [url, nhóm dropdown cần mở, mục hiện tại kỳ vọng trong dropdown, mục kỳ vọng trong Drawer]
  ['/dich-vu/spa?utm_source=facebook', 'Dịch vụ', ['/dich-vu/spa'], ['/dich-vu/spa']],
  ['/dich-vu/spa/', 'Dịch vụ', ['/dich-vu/spa'], ['/dich-vu/spa']],
  ['/dich-vu/spa/?fbclid=abc', 'Dịch vụ', ['/dich-vu/spa'], ['/dich-vu/spa']],
  ['/dich-vu?utm_medium=cpc', 'Dịch vụ', ['/dich-vu'], ['/dich-vu']],
  ['/goc-thu-cung?cat=news&utm_source=zalo', 'Góc thú cưng', ['/goc-thu-cung?cat=news'], ['/goc-thu-cung?cat=news']],
  ['/goc-thu-cung?utm_source=zalo', 'Góc thú cưng', ['/goc-thu-cung'], ['/goc-thu-cung']],
  ['/goc-thu-cung/', 'Góc thú cưng', ['/goc-thu-cung'], ['/goc-thu-cung']],
]

describe('A02 query không liên quan và dấu "/" cuối', () => {
  for (const [url, group, expDropdown] of CASES) {
    test(`desktop "${url}": dropdown đúng ${expDropdown}, nhóm "${group}" được tô`, async () => {
      const { ctx, page } = await open(url)
      try {
        await openDropdownByKeyboard(page, group)
        const cur = await page.evaluate((nav) => [...document.querySelectorAll(`${nav} [id^="dropdown-menu"] [aria-current="page"]`)].map((e) => e.getAttribute('href')), DESKTOP_NAV)
        const styles = await page.evaluate((nav) => Object.fromEntries([...document.querySelectorAll(`${nav} > div > button`)].map((b) => [b.textContent.trim(), `${getComputedStyle(b).color}|${getComputedStyle(b).fontWeight}`])), DESKTOP_NAV)
        measurements.push({ id: 'A02-desktop', url, dropdownCurrent: cur, styles })
        assert.deepEqual(cur, expDropdown)
        const others = Object.entries(styles).filter(([k]) => !k.includes(group)).map(([, v]) => v)
        const mine = Object.entries(styles).find(([k]) => k.includes(group))?.[1]
        assert.ok(mine && others.every((v) => v !== mine), `nhóm "${group}" không khác các nhóm khác: ${JSON.stringify(styles)}`)
      } finally {
        await ctx.close()
      }
    })
  }

  for (const [url, , , expDrawer] of CASES) {
    test(`Drawer "${url}": đúng ${expDrawer}`, async () => {
      const { ctx, page } = await open(url, { width: 390, height: 844, mobile: true })
      try {
        const cur = await drawerCurrent(page)
        measurements.push({ id: 'A02-drawer', url, current: cur })
        assert.deepEqual(cur, expDrawer)
      } finally {
        await ctx.close()
      }
    })
  }

  test('trang chủ có query: chỉ "Trang chủ" là hiện tại', async () => {
    const { ctx, page } = await open('/?utm_source=zalo')
    try {
      assert.deepEqual(await headerCurrent(page), ['/'])
    } finally {
      await ctx.close()
    }
  })

  test('404 có dấu "/" cuối hoặc query vẫn không tô mục nào', async () => {
    for (const url of ['/dich-vu-khong-ton-tai/', '/cau-chuyenxyz?utm_source=x']) {
      const { ctx, page } = await open(url)
      try {
        assert.ok(await page.locator('main h1', { hasText: 'Không tìm thấy' }).isVisible(), `${url} không phải trang 404`)
        assert.deepEqual(await headerCurrent(page), [], `${url} vẫn có aria-current`)
      } finally {
        await ctx.close()
      }
    }
  })
})

// ---------------------------------------------------------------- A01 trang danh sách và chi tiết
describe('A01 Câu chuyện: danh sách và chi tiết nhất quán giữa desktop và Drawer', () => {
  for (const url of ['/cau-chuyen', '/cau-chuyen/abc', '/cau-chuyen/abc/']) {
    test(`"${url}": desktop và Drawer cùng đánh dấu /cau-chuyen`, async () => {
      const d = await open(url)
      const m = await open(url, { width: 390, height: 844, mobile: true })
      try {
        const desk = await headerCurrent(d.page)
        const drw = await drawerCurrent(m.page)
        measurements.push({ id: 'A01', url, desktop: desk, drawer: drw })
        assert.deepEqual(desk, ['/cau-chuyen'])
        assert.deepEqual(drw, ['/cau-chuyen'])
      } finally {
        await d.ctx.close()
        await m.ctx.close()
      }
    })
  }
})

// ---------------------------------------------------------------- A03 logo, favicon
describe('A03 logo và favicon', () => {
  test('logo đủ nét (≥ 2× cỡ hiển thị) ở Header, Drawer, Footer; favicon riêng', async () => {
    const { ctx, page } = await open('/', { width: 1366, height: 768 })
    try {
      const imgs = await page.evaluate(() =>
        [...document.querySelectorAll('img')]
          .filter((i) => /logo/i.test(i.getAttribute('src') || '') || /logo/i.test(i.alt))
          .map((i) => ({ src: i.getAttribute('src'), natural: i.naturalWidth, rendered: Math.round(i.getBoundingClientRect().width), where: i.closest('header,footer,[role=dialog]')?.tagName || 'other' })),
      )
      const icon = await page.evaluate(() => [...document.querySelectorAll('link[rel~="icon"]')].map((l) => ({ href: l.getAttribute('href'), type: l.getAttribute('type'), sizes: l.getAttribute('sizes') })))
      const iconRes = await page.request.get(new URL(icon[0].href, BASE).href)
      const iconBytes = (await iconRes.body()).length
      measurements.push({ id: 'A03', imgs, icon, iconBytes, iconType: iconRes.headers()['content-type'] })
      assert.ok(imgs.length >= 2, 'không tìm thấy ảnh logo')
      for (const i of imgs) {
        if (i.rendered === 0) continue
        assert.ok(i.natural >= i.rendered * 2, `logo ${i.where} chỉ ${i.natural}px cho ${i.rendered}px hiển thị (mờ trên màn hình 2×)`)
      }
      assert.equal(iconRes.status(), 200)
      assert.ok(!/logo/.test(icon[0].href), `favicon vẫn dùng ảnh logo: ${icon[0].href}`)
      assert.ok(iconBytes <= 50 * 1024, `favicon ${iconBytes} byte`)
      assert.match(iconRes.headers()['content-type'] || '', /image\//)
    } finally {
      await ctx.close()
    }
  })

  test('ảnh logo gốc không được tham chiếu và không nằm trong dist/ (P3)', async (t) => {
    if (!APP_DIR) return t.skip('đặt APP_DIR để kiểm tra dist/')
    const dist = path.join(APP_DIR, 'dist')
    const big = []
    const walk = (dir) => {
      for (const f of fs.readdirSync(dir)) {
        const p = path.join(dir, f)
        const st = fs.statSync(p)
        if (st.isDirectory()) walk(p)
        else if (/logo/i.test(f) && st.size > 100 * 1024) big.push(`${path.relative(dist, p)} (${st.size} B)`)
      }
    }
    walk(dist)
    const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
    const js = fs.readdirSync(path.join(dist, 'assets')).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(dist, 'assets', f), 'utf8')).join('\n')
    const referenced = /logo-original/.test(html + js)
    measurements.push({ id: 'A03-dist', bigLogoFiles: big, referenced })
    assert.equal(referenced, false, 'mã vẫn tham chiếu ảnh logo gốc')
    assert.deepEqual(big, [], `dist/ còn ảnh logo gốc nặng, được triển khai công khai dù không dùng: ${big}`)
  })
})

test('round03: không có console error / pageerror', () => {
  assert.deepEqual(consoleErrors, [])
})
