// E2E bổ sung cho vòng sửa 02 của mốc 2A (docs/ANTIGRAVITY_2A_FIX_ROUND_02.md).
// Chạy cùng bộ chuẩn: BASE_URL=http://localhost:4173 EVIDENCE_DIR=./ev node --test tests/e2e/
// Tùy chọn: APP_DIR=<thư mục bản sao đúng SHA> để kiểm tra vercel.json và dist/; thiếu thì nhóm đó SKIP.
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
const CONFIRMED_STREET = '101 Khuất Duy Tiến'
const CONFIRMED_ADDRESS = '101 Khuất Duy Tiến, Thanh Xuân, Hà Nội'
const UNCONFIRMED_UNITS = /Nhân Chính|Phường|Quận/

let browser
const consoleErrors = []
const measurements = []

before(async () => {
  browser = await chromium.launch()
})
after(async () => {
  fs.writeFileSync(path.join(EVIDENCE, 'measurements-round02.json'), JSON.stringify({ base: BASE, measurements, consoleErrors }, null, 2))
  await browser?.close()
})

async function open(urlPath, { width = 1366, height = 768, mobile = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile })
  const page = await ctx.newPage()
  const tag = `${urlPath}@${width}${mobile ? 'm' : ''}`
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(`${tag}: ${m.text()}`))
  page.on('pageerror', (e) => consoleErrors.push(`${tag}: ${e.message}`))
  await page.goto(BASE + urlPath, { waitUntil: 'networkidle' })
  return { ctx, page }
}

// Mở Drawer và lần lượt mở từng nhóm accordion; trả về toàn bộ link và trạng thái nhóm.
async function drawerSnapshot(page) {
  await page.locator(MENU_BTN).click()
  await page.locator(DIALOG).waitFor({ state: 'visible' })
  const labels = (await page.locator(`${DIALOG} button[aria-expanded]`).allTextContents()).map((l) => l.trim()).filter(Boolean)
  const groupStyles = await page
    .locator(`${DIALOG} button[aria-expanded]`)
    .evaluateAll((bs) => bs.map((b) => `${b.textContent.trim()}|${getComputedStyle(b).color}|${getComputedStyle(b).fontWeight}`))
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
  return { current: [...current], groupStyles }
}

const jsonLd = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
      try {
        return JSON.parse(s.textContent)
      } catch {
        return { parseError: true }
      }
    }),
  )

const canonical = (page) => page.evaluate(() => [...document.querySelectorAll('link[rel="canonical"]')].map((l) => l.getAttribute('href')))

// ---------------------------------------------------------------- R2-P1-3 Drawer
describe('R2 P1-3 Drawer: ranh giới route và đúng một mục hiện tại', () => {
  for (const [route, expected] of [
    ['/', ['/']],
    ['/dich-vu', ['/dich-vu']],
    ['/dich-vu/spa', ['/dich-vu/spa']],
    ['/goc-thu-cung', ['/goc-thu-cung']],
    ['/goc-thu-cung?cat=news', ['/goc-thu-cung?cat=news']],
    ['/cau-chuyen', ['/cau-chuyen']],
  ]) {
    test(`Drawer "${route}": aria-current đúng ${expected}`, async () => {
      const { ctx, page } = await open(route, { width: 390, height: 844, mobile: true })
      try {
        const s = await drawerSnapshot(page)
        measurements.push({ id: 'R2-P1-3-drawer', route, ...s })
        assert.deepEqual(s.current, expected)
      } finally {
        await ctx.close()
      }
    })
  }

  test('Drawer "/cau-chuyen/abc": nhất quán với desktop (Câu chuyện là mục hiện tại)', async () => {
    const { ctx, page } = await open('/cau-chuyen/abc', { width: 390, height: 844, mobile: true })
    try {
      const s = await drawerSnapshot(page)
      measurements.push({ id: 'R2-P1-3-drawer', route: '/cau-chuyen/abc', ...s })
      assert.deepEqual(s.current, ['/cau-chuyen'], 'desktop đánh dấu "Câu chuyện" ở trang chi tiết nhưng Drawer thì không')
    } finally {
      await ctx.close()
    }
  })

  for (const route of ['/dich-vu-khong-ton-tai', '/cau-chuyenxyz', '/gioi-thieu-abc', '/goc-thu-cung-abc']) {
    test(`Drawer ranh giới: "${route}" (404) không có mục/nhóm hiện tại`, async () => {
      const { ctx, page } = await open(route, { width: 390, height: 844, mobile: true })
      try {
        assert.ok(await page.locator('main h1', { hasText: 'Không tìm thấy' }).isVisible(), 'không phải trang 404')
        const s = await drawerSnapshot(page)
        measurements.push({ id: 'R2-P1-3-drawer-boundary', route, ...s })
        assert.deepEqual(s.current, [])
        const distinct = new Set(s.groupStyles.map((x) => x.split('|').slice(1).join('|')))
        assert.equal(distinct.size, 1, `nhóm accordion được tô trên trang 404: ${s.groupStyles}`)
      } finally {
        await ctx.close()
      }
    })
  }
})

// ---------------------------------------------------------------- R2-P1-4 luồng chuột đầy đủ
describe('R2 P1-4 Dropdown: luồng chuột thật', () => {
  test('rê → bấm → di chuột vào submenu → bấm "Spa" thì tới /dich-vu/spa', async () => {
    const { ctx, page } = await open('/', { width: 1280, height: 800 })
    try {
      const t = page.locator(`${DESKTOP_NAV} button`, { hasText: 'Dịch vụ' })
      await t.hover()
      await t.click()
      const id = await t.getAttribute('aria-controls')
      const spa = page.locator(`#${id} a[href="/dich-vu/spa"]`)
      await spa.hover()
      assert.equal(await t.getAttribute('aria-expanded'), 'true', 'submenu đóng khi di chuột từ trigger xuống submenu')
      await spa.click()
      await page.waitForURL('**/dich-vu/spa')
      assert.equal(await t.getAttribute('aria-expanded'), 'false', 'submenu không đóng sau khi chọn mục')
    } finally {
      await ctx.close()
    }
  })

  test('bấm lần hai (sau khi đã giữ mở) thì đóng; rời chuột thì đóng', async () => {
    const { ctx, page } = await open('/', { width: 1280, height: 800 })
    try {
      const t = page.locator(`${DESKTOP_NAV} button`, { hasText: 'Dịch vụ' })
      await t.hover()
      await t.click()
      assert.equal(await t.getAttribute('aria-expanded'), 'true')
      await t.click()
      assert.equal(await t.getAttribute('aria-expanded'), 'false', 'bấm lần hai không đóng submenu')
      await t.hover()
      await page.mouse.move(640, 700)
      await page.waitForFunction((sel) => document.querySelector(sel)?.getAttribute('aria-expanded') === 'false', '#dropdown-trigger-services', { timeout: 2000 }).catch(() => {})
      assert.equal(await t.getAttribute('aria-expanded'), 'false', 'rời chuột mà submenu vẫn mở')
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- Quyết định 3: bỏ hotline Header
describe('R2 Quyết định 3: bỏ hotline Header, vẫn có lối gọi', () => {
  for (const [w, h, mobile] of [
    [320, 568, true],
    [768, 1024, false],
    [1366, 768, false],
    [1536, 864, false],
  ]) {
    test(`Header @${w}px không có tel:, vẫn có lối gọi trong màn hình đầu hoặc Drawer`, async () => {
      const { ctx, page } = await open('/', { width: w, height: h, mobile })
      try {
        const headerTel = await page.locator('header a[href^="tel:"]').count()
        assert.equal(headerTel, 0, `Header còn ${headerTel} link tel:`)
        const visibleTel = []
        for (const a of await page.locator('a[href^="tel:"]').all()) {
          if (!(await a.isVisible())) continue
          const b = await a.boundingBox()
          if (b && b.y >= 0 && b.y + b.height <= h) visibleTel.push(await a.evaluate((el) => el.closest('section,footer,[aria-label]')?.getAttribute('aria-label') || el.closest('section,footer')?.tagName || 'other'))
        }
        let drawerTel = null
        if (w < 1024) {
          await page.locator(MENU_BTN).click()
          await page.locator(DIALOG).waitFor({ state: 'visible' })
          drawerTel = await page.locator(`${DIALOG} a[href^="tel:"]`).count()
        }
        const footerTel = await page.locator('footer a[href^="tel:"]').count()
        measurements.push({ id: 'R2-D3', width: w, headerTel, visibleTel, drawerTel, footerTel })
        assert.ok(visibleTel.length >= 1, 'không có hotline nhìn thấy trong màn hình đầu')
        assert.ok(footerTel >= 1, 'Footer thiếu hotline')
        if (w < 1024) assert.ok(drawerTel >= 1, 'Drawer thiếu hotline')
      } finally {
        await ctx.close()
      }
    })
  }
})

// ---------------------------------------------------------------- R1-1 JSON-LD
describe('R2 R1-1 JSON-LD chỉ ở trang chủ, đúng dữ liệu đã xác nhận', () => {
  test('trang chủ có đúng một VeterinaryCare khớp địa chỉ/giờ đã xác nhận', async () => {
    const { ctx, page } = await open('/', { width: 1366, height: 768 })
    try {
      const ld = await jsonLd(page)
      measurements.push({ id: 'R2-R1-1', route: '/', jsonLd: ld })
      const vet = ld.filter((x) => x['@type'] === 'VeterinaryCare')
      assert.equal(vet.length, 1, `có ${vet.length} khối VeterinaryCare`)
      const a = vet[0].address || {}
      assert.equal(a.streetAddress, CONFIRMED_STREET)
      assert.ok(!UNCONFIRMED_UNITS.test(JSON.stringify(a)), `địa chỉ JSON-LD có đơn vị hành chính chưa xác nhận: ${JSON.stringify(a)}`)
      assert.match(JSON.stringify(a), /Thanh Xuân/)
      assert.match(JSON.stringify(a), /Hà Nội/)
      const hours = vet[0].openingHoursSpecification || []
      assert.ok(hours.some((x) => x.opens === '08:00' && x.closes === '21:00'), 'thiếu giờ 08:00–21:00')
      assert.equal(vet[0].telephone?.replace(/\D/g, '').slice(-9), '973555105', 'số điện thoại JSON-LD khác hotline')
      const text = await page.locator('body').innerText()
      assert.ok(text.includes(CONFIRMED_ADDRESS) || text.includes('101 Khuất Duy Tiến'), 'địa chỉ hiển thị không khớp')
      assert.ok(!UNCONFIRMED_UNITS.test(text), 'trang còn hiển thị tên phường/quận chưa xác nhận')
    } finally {
      await ctx.close()
    }
  })

  test('HTML gốc không còn JSON-LD tĩnh (không phát trên mọi route)', async () => {
    const { ctx, page } = await open('/', { width: 1366, height: 768 })
    try {
      for (const p of ['/', '/gioi-thieu', '/khong-ton-tai-r2']) {
        const raw = await (await page.request.get(BASE + p)).text()
        assert.ok(!raw.includes('application/ld+json'), `HTML gốc của ${p} còn JSON-LD tĩnh`)
      }
    } finally {
      await ctx.close()
    }
  })

  test('JSON-LD bị gỡ khi rời trang chủ, không nhân đôi khi quay lại, đúng qua Back/Forward', async () => {
    const { ctx, page } = await open('/', { width: 1366, height: 768 })
    try {
      const count = async () => (await jsonLd(page)).filter((x) => x['@type'] === 'VeterinaryCare').length
      const log = { home: await count() }
      await page.locator('footer a[href="/gioi-thieu"]').click()
      await page.waitForURL('**/gioi-thieu')
      await page.waitForFunction(() => !document.getElementById('hospital-jsonld') && !document.querySelector('script[type="application/ld+json"]'), null, { timeout: 3000 }).catch(() => {})
      log.comingSoon = await count()
      await page.goto(BASE + '/khong-ton-tai-r2', { waitUntil: 'networkidle' })
      log.notFound = await count()
      await page.goto(BASE + '/', { waitUntil: 'networkidle' })
      await page.locator('footer a[href="/bang-gia"]').click()
      await page.waitForURL('**/bang-gia')
      await page.locator('header a[href="/"]').first().click()
      await page.waitForURL(BASE + '/')
      await page.waitForFunction(() => document.querySelectorAll('script[type="application/ld+json"]').length >= 1, null, { timeout: 3000 }).catch(() => {})
      log.backHomeViaLink = await count()
      await page.goBack()
      await page.waitForURL('**/bang-gia')
      await page.waitForFunction(() => !document.querySelector('script[type="application/ld+json"]'), null, { timeout: 3000 }).catch(() => {})
      log.historyBack = await count()
      await page.goForward()
      await page.waitForURL(BASE + '/')
      await page.waitForFunction(() => document.querySelectorAll('script[type="application/ld+json"]').length >= 1, null, { timeout: 3000 }).catch(() => {})
      log.historyForward = await count()
      measurements.push({ id: 'R2-R1-1-lifecycle', ...log })
      assert.deepEqual(log, { home: 1, comingSoon: 0, notFound: 0, backHomeViaLink: 1, historyBack: 0, historyForward: 1 })
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- P3 canonical
describe('R2 P3 canonical', () => {
  test('404 không có canonical, kể cả khi đi từ trang có canonical; trang chủ có canonical gốc', async () => {
    const { ctx, page } = await open('/gioi-thieu', { width: 1366, height: 768 })
    try {
      const log = { comingSoon: await canonical(page) }
      await page.evaluate(() => {
        window.history.pushState({}, '', '/khong-ton-tai-r2')
        window.dispatchEvent(new PopStateEvent('popstate'))
      })
      await page.locator('main h1', { hasText: 'Không tìm thấy' }).waitFor()
      await page.waitForFunction(() => document.querySelectorAll('link[rel="canonical"]').length === 0, null, { timeout: 3000 }).catch(() => {})
      log.notFoundAfterClientNav = await canonical(page)
      await page.goto(BASE + '/khong-ton-tai-r2', { waitUntil: 'networkidle' })
      log.notFoundDirect = await canonical(page)
      await page.goto(BASE + '/', { waitUntil: 'networkidle' })
      log.home = await canonical(page)
      measurements.push({ id: 'R2-P3-canonical', ...log })
      assert.deepEqual(log.notFoundAfterClientNav, [])
      assert.deepEqual(log.notFoundDirect, [])
      assert.equal(log.home.length, 1, `trang chủ có ${log.home.length} canonical`)
      assert.match(log.home[0], /^https:\/\/bvthuyleson\.vn\/?$/)
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- Quyết định 1: Vercel
describe('R2 Quyết định 1: chỉ cấu hình Vercel', () => {
  test('dist/ không còn 404.html, _redirects; vercel.json hợp lệ cho SPA', (t) => {
    if (!APP_DIR) return t.skip('đặt APP_DIR để kiểm tra tệp trong bản sao')
    const dist = path.join(APP_DIR, 'dist')
    assert.ok(fs.existsSync(path.join(dist, 'index.html')), 'chưa build dist/')
    for (const f of ['404.html', '_redirects']) assert.ok(!fs.existsSync(path.join(dist, f)), `dist còn ${f}`)
    for (const f of ['public/404.html', 'public/_redirects', 'netlify.toml', 'static.json']) assert.ok(!fs.existsSync(path.join(APP_DIR, f)), `còn cấu hình host khác: ${f}`)
    const cfg = JSON.parse(fs.readFileSync(path.join(APP_DIR, 'vercel.json'), 'utf8'))
    measurements.push({ id: 'R2-D1', vercel: cfg })
    assert.ok(Array.isArray(cfg.rewrites) && cfg.rewrites.length >= 1, 'vercel.json thiếu rewrites')
    assert.ok(cfg.rewrites.some((r) => r.destination === '/index.html'), 'không có rewrite về /index.html')
    assert.ok(!cfg.redirects?.some((r) => /^\/?$/.test(r.destination)), 'có redirect đưa mọi URL về trang chủ')
  })

  test('preview không phục vụ trang chuyển hướng 404.html cũ', async () => {
    const { ctx, page } = await open('/', { width: 1366, height: 768 })
    try {
      const body = await (await page.request.get(BASE + '/404.html')).text()
      assert.ok(!body.includes('sessionStorage.redirect') && !body.includes('http-equiv="refresh"'), '404.html chuyển hướng cũ vẫn được phục vụ')
      const r = await page.goto(BASE + '/gioi-thieu', { waitUntil: 'networkidle' })
      assert.equal(new URL(page.url()).pathname, '/gioi-thieu', 'đường dẫn sâu bị đổi')
      assert.ok(r.ok())
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- P3 logo/favicon
describe('R2 P3 tối ưu logo và favicon (brief vòng 02 mục 5)', () => {
  test('logo hiển thị và favicon không dùng ảnh gốc 377KB', async () => {
    const { ctx, page } = await open('/', { width: 1366, height: 768 })
    try {
      const info = await page.evaluate(() => {
        const logo = document.querySelector('header a[href="/"] img')
        const icon = document.querySelector('link[rel~="icon"]')
        return { logoSrc: logo?.currentSrc || logo?.getAttribute('src'), logoRendered: logo ? Math.round(logo.getBoundingClientRect().width) : 0, iconHref: icon?.getAttribute('href') }
      })
      const size = async (u) => (u ? (await (await page.request.get(new URL(u, BASE).href)).body()).length : 0)
      info.logoBytes = await size(info.logoSrc)
      info.iconBytes = await size(info.iconHref)
      measurements.push({ id: 'R2-P3-logo', ...info })
      // Ngưỡng do QA đặt: logo hiển thị ~44px không cần quá 100KB; favicon không quá 50KB.
      assert.ok(info.logoBytes <= 100 * 1024, `logo Header nặng ${info.logoBytes} byte cho ${info.logoRendered}px`)
      assert.ok(info.iconBytes <= 50 * 1024, `favicon nặng ${info.iconBytes} byte (${info.iconHref})`)
    } finally {
      await ctx.close()
    }
  })
})

test('round02: không có console error / pageerror', () => {
  assert.deepEqual(consoleErrors, [])
})
