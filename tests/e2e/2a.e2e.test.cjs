// E2E mốc 2A — Bệnh viện Thú y Lê Sơn.
// Chạy: BASE_URL=http://localhost:4173 EVIDENCE_DIR=./evidence node --test tests/e2e/2a.e2e.test.cjs
// Tùy chọn: HOST_URL=<URL host đích đã chốt> để chạy nhóm P1-8; thiếu thì nhóm này SKIP (BLOCKED).
// Chỉ dùng node:test + thư viện `playwright` có sẵn trong môi trường, không thêm dependency vào repo.
const { test, before, after, describe } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { chromium } = require('playwright')

const BASE = (process.env.BASE_URL || 'http://localhost:4173').replace(/\/$/, '')
const HOST = process.env.HOST_URL ? process.env.HOST_URL.replace(/\/$/, '') : null
const EVIDENCE = process.env.EVIDENCE_DIR || path.join(process.cwd(), 'e2e-evidence')
fs.mkdirSync(EVIDENCE, { recursive: true })

const VIEWPORTS = [
  [320, 568],
  [390, 844],
  [768, 1024],
  [1366, 768],
  [1440, 900],
]
const PAGES = { home: '/', comingSoon: '/gioi-thieu', notFound: '/khong-ton-tai-e2e' }
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
  fs.writeFileSync(path.join(EVIDENCE, 'measurements.json'), JSON.stringify({ base: BASE, measurements, consoleErrors }, null, 2))
  await browser?.close()
})

async function open(urlPath, { width = 1366, height = 768, mobile = false, reducedMotion } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, reducedMotion })
  const page = await ctx.newPage()
  const tag = `${urlPath}@${width}${mobile ? 'm' : ''}`
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(`${tag}: ${m.text()}`))
  page.on('pageerror', (e) => consoleErrors.push(`${tag}: ${e.message}`))
  await page.goto(BASE + urlPath, { waitUntil: 'networkidle' })
  return { ctx, page }
}

const widths = (page) =>
  page.evaluate(() => ({
    innerWidth: window.innerWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
  }))

const rectOf = (page, sel) =>
  page.locator(sel).first().evaluate((el) => {
    const r = el.getBoundingClientRect()
    return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }
  })

// Chờ meta của route mới được áp dụng (useEffect chạy sau render), không dùng sleep cố định.
// Hết 3s mà title vẫn như cũ thì trả về giá trị hiện tại để assertion bên dưới báo lỗi.
const settledMeta = async (page, prevTitle) => {
  await page.waitForFunction((t) => document.title !== t, prevTitle, { timeout: 3000 }).catch(() => {})
  return { title: await page.title(), robots: await robots(page) }
}

const robots = (page) => page.evaluate(() => document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null)

const focusInDialog = (page) => page.evaluate((sel) => !!document.activeElement?.closest(sel), DIALOG)

// Mở dropdown desktop bằng bàn phím (Enter) để các test không phụ thuộc hành vi chuột của P1-4.
async function openDropdownByKeyboard(page, label) {
  const t = page.locator(`${DESKTOP_NAV} button`, { hasText: label })
  await t.focus()
  await page.keyboard.press('Enter')
  await page.waitForFunction(([sel, text]) => [...document.querySelectorAll(sel)].some((b) => b.textContent.includes(text) && b.getAttribute('aria-expanded') === 'true'), [`${DESKTOP_NAV} button`, label])
  return t
}

// Drawer dùng accordion (mở nhóm này có thể đóng nhóm khác): mở lần lượt từng nhóm và gom dữ liệu sau mỗi lần mở.
async function collectDrawer(page) {
  const labels = await page.locator(`${DIALOG} button[aria-expanded]`).allTextContents()
  const hrefs = new Set()
  const classes = new Set()
  const grab = async () => {
    for (const h of await page.locator(`${DIALOG} a[href]`).evaluateAll((as) => as.map((a) => a.getAttribute('href')))) hrefs.add(h)
    for (const c of await page.locator(`${DIALOG} [class]`).evaluateAll((es) => es.flatMap((e) => (e.getAttribute('class') || '').split(/\s+/)))) classes.add(c)
  }
  await grab()
  for (const label of labels.map((l) => l.trim()).filter(Boolean)) {
    const btn = page.locator(`${DIALOG} button[aria-expanded]`, { hasText: label }).first()
    if ((await btn.getAttribute('aria-expanded')) !== 'true') await btn.click()
    await page.waitForFunction(([sel, text]) => [...document.querySelectorAll(sel)].some((b) => b.textContent.trim() === text && b.getAttribute('aria-expanded') === 'true'), [`${DIALOG} button[aria-expanded]`, label])
    await grab()
  }
  return { hrefs: [...hrefs], classes: [...classes] }
}

// ---------------------------------------------------------------- P1-1
describe('P1-1 Header 320px', () => {
  for (const mobile of [false, true]) {
    test(`viewport đúng 320px, Menu nằm trọn và mở được Drawer (isMobile=${mobile})`, async () => {
      const { ctx, page } = await open('/', { width: 320, height: 568, mobile })
      try {
        const w = await widths(page)
        const btn = await page.locator(MENU_BTN).isVisible() ? await rectOf(page, MENU_BTN) : null
        measurements.push({ id: 'P1-1', mobile, ...w, menuButton: btn })
        await page.screenshot({ path: path.join(EVIDENCE, `p1-1-header-320${mobile ? '-mobile' : ''}.png`), clip: { x: 0, y: 0, width: 320, height: 120 } })
        assert.equal(w.innerWidth, 320, 'innerWidth bị nới khỏi 320px: nội dung tràn làm viewport mobile tự giãn')
        assert.ok(w.scrollWidth <= 320, `tràn ngang: scrollWidth=${w.scrollWidth}`)
        assert.ok(btn, 'không thấy nút Menu')
        assert.ok(btn.left >= 0 && btn.right <= 320, `nút Menu ngoài viewport: ${btn.left}..${btn.right}`)
        await page.locator(MENU_BTN).click()
        await page.locator(DIALOG).waitFor({ state: 'visible' })
      } finally {
        await ctx.close()
      }
    })
  }
})

// ---------------------------------------------------------------- Responsive
describe('Responsive: không tràn ngang ở 5 viewport', () => {
  for (const [w, h] of VIEWPORTS) {
    for (const [name, urlPath] of Object.entries(PAGES)) {
      test(`${name} @ ${w}px`, async () => {
        const { ctx, page } = await open(urlPath, { width: w, height: h, mobile: w < 768 })
        try {
          const m = await widths(page)
          measurements.push({ id: 'RESP', page: name, requested: w, ...m })
          await page.screenshot({ path: path.join(EVIDENCE, `resp-${name}-${w}.png`), fullPage: name !== 'home' || w <= 390 })
          assert.equal(m.innerWidth, w, `innerWidth=${m.innerWidth} khác viewport yêu cầu ${w}`)
          assert.ok(m.scrollWidth <= w, `tràn ngang: scrollWidth=${m.scrollWidth} > ${w}`)
          assert.ok(await page.locator('main h1').first().isVisible(), 'không thấy h1 trong main')
        } finally {
          await ctx.close()
        }
      })
    }
  }
})

// ---------------------------------------------------------------- P1-2
describe('P1-2 Kích thước khung sau khi sửa token', () => {
  test('ComingSoon và 404 ở 1440px có độ rộng chữ dễ đọc (≤ 800px)', async () => {
    const { ctx, page } = await open('/gioi-thieu', { width: 1440, height: 900 })
    try {
      const cs = await page.evaluate(() => {
        const h1 = document.querySelector('main h1')
        const box = h1.parentElement
        const sub = h1.nextElementSibling
        return { maxWidth: getComputedStyle(box).maxWidth, boxWidth: box.getBoundingClientRect().width, subtitleWidth: sub?.getBoundingClientRect().width ?? 0 }
      })
      await page.screenshot({ path: path.join(EVIDENCE, 'p1-2-coming-soon-1440.png') })
      await page.goto(BASE + PAGES.notFound, { waitUntil: 'networkidle' })
      const nf = await page.evaluate(() => {
        const box = document.querySelector('main h1').parentElement
        return { maxWidth: getComputedStyle(box).maxWidth, boxWidth: box.getBoundingClientRect().width }
      })
      await page.screenshot({ path: path.join(EVIDENCE, 'p1-2-404-1440.png') })
      measurements.push({ id: 'P1-2', comingSoon: cs, notFound: nf })
      assert.ok(cs.boxWidth <= 800, `ComingSoon rộng ${cs.boxWidth}px (max-width ${cs.maxWidth})`)
      assert.ok(cs.subtitleWidth <= 800, `phụ đề ComingSoon rộng ${cs.subtitleWidth}px`)
      assert.ok(nf.boxWidth <= 800, `404 rộng ${nf.boxWidth}px (max-width ${nf.maxWidth})`)
    } finally {
      await ctx.close()
    }
  })

  test('Drawer ở 768px không phủ gần hết màn hình (≤ 480px)', async () => {
    const { ctx, page } = await open('/', { width: 768, height: 1024 })
    try {
      await page.locator(MENU_BTN).click()
      await page.locator(DIALOG).waitFor({ state: 'visible' })
      const d = await rectOf(page, DIALOG)
      measurements.push({ id: 'P1-2', drawer768: d.width })
      await page.screenshot({ path: path.join(EVIDENCE, 'p1-2-drawer-768.png') })
      assert.ok(d.width <= 480, `Drawer rộng ${d.width}px ở viewport 768px`)
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- Drawer
describe('Drawer: focus, Escape, cuộn', () => {
  test('mở: focus vào trong, trigger có aria-expanded/aria-controls', async () => {
    const { ctx, page } = await open('/', { width: 390, height: 844, mobile: true })
    try {
      const trigger = page.locator(MENU_BTN)
      assert.equal(await trigger.getAttribute('aria-expanded'), 'false', 'trigger chưa có aria-expanded="false" khi đóng')
      await trigger.click()
      await page.locator(DIALOG).waitFor({ state: 'visible' })
      await page.waitForFunction((sel) => !!document.activeElement?.closest(sel), DIALOG)
      assert.equal(await trigger.getAttribute('aria-expanded'), 'true', 'trigger chưa có aria-expanded="true" khi mở')
      const controls = await trigger.getAttribute('aria-controls')
      assert.ok(controls && (await page.locator(`#${controls}`).count()) === 1, 'aria-controls không trỏ tới phần tử tồn tại')
    } finally {
      await ctx.close()
    }
  })

  test('Tab/Shift+Tab không thoát dialog; Escape đóng, trả focus, khôi phục cuộn', async () => {
    const { ctx, page } = await open('/', { width: 390, height: 844, mobile: true })
    try {
      await page.evaluate(() => window.scrollTo(0, 1200))
      await page.waitForFunction(() => window.scrollY >= 1100)
      const y0 = await page.evaluate(() => window.scrollY)
      const overflow0 = await page.evaluate(() => document.body.style.overflow)
      await page.locator(MENU_BTN).click()
      await page.waitForFunction((sel) => !!document.activeElement?.closest(sel), DIALOG)
      for (let i = 0; i < 30; i++) {
        await page.keyboard.press('Tab')
        assert.ok(await focusInDialog(page), `Tab lần ${i + 1} làm focus thoát dialog`)
      }
      for (let i = 0; i < 30; i++) {
        await page.keyboard.press('Shift+Tab')
        assert.ok(await focusInDialog(page), `Shift+Tab lần ${i + 1} làm focus thoát dialog`)
      }
      await page.screenshot({ path: path.join(EVIDENCE, 'drawer-open-390.png') })
      await page.keyboard.press('Escape')
      await page.locator(DIALOG).waitFor({ state: 'detached' }).catch(() => page.locator(DIALOG).waitFor({ state: 'hidden' }))
      await page.waitForFunction((sel) => document.activeElement?.matches(sel), MENU_BTN)
      assert.equal(await page.evaluate(() => document.body.style.overflow), overflow0, 'overflow của body không được khôi phục')
      assert.equal(await page.evaluate(() => window.scrollY), y0, 'vị trí cuộn thay đổi sau khi đóng Drawer')
    } finally {
      await ctx.close()
    }
  })

  test('chọn link trong Drawer: đóng, đổi route, khôi phục cuộn', async () => {
    const { ctx, page } = await open('/', { width: 390, height: 844, mobile: true })
    try {
      await page.locator(MENU_BTN).click()
      await page.locator(DIALOG).waitFor({ state: 'visible' })
      await page.locator(`${DIALOG} button`, { hasText: 'Dịch vụ' }).click()
      await page.locator(`${DIALOG} a[href="/dich-vu/spa"]`).click()
      await page.waitForURL('**/dich-vu/spa')
      assert.equal(await page.locator(DIALOG).count(), 0, 'Drawer chưa đóng sau khi đổi route')
      assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden', 'body vẫn bị khóa cuộn')
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- P1-5
describe('P1-5 Resize qua breakpoint desktop', () => {
  test('mở ở 900px, resize 1180px: gỡ khóa cuộn; quay lại mobile vẫn mở được', async () => {
    const { ctx, page } = await open('/', { width: 900, height: 800 })
    try {
      await page.locator(MENU_BTN).click()
      await page.locator(DIALOG).waitFor({ state: 'visible' })
      await page.setViewportSize({ width: 1180, height: 800 })
      await page.waitForFunction(() => document.body.style.overflow !== 'hidden', null, { timeout: 3000 }).catch(() => {})
      const state = await page.evaluate((sel) => ({ overflow: document.body.style.overflow, dialogInDom: !!document.querySelector(sel) }), DIALOG)
      await page.mouse.move(600, 500)
      await page.mouse.wheel(0, 1200)
      const scrolled = await page.waitForFunction(() => window.scrollY > 0, null, { timeout: 3000 }).then(() => true, () => false)
      measurements.push({ id: 'P1-5', ...state, scrolled })
      await page.screenshot({ path: path.join(EVIDENCE, 'p1-5-resize-1180.png') })
      assert.notEqual(state.overflow, 'hidden', 'body vẫn overflow:hidden sau khi lên desktop')
      assert.ok(scrolled, 'không cuộn được trang sau khi lên desktop')
      await page.keyboard.press('Tab')
      assert.ok(!(await focusInDialog(page)), 'focus vẫn bị giữ trong Drawer đã ẩn')
      await page.setViewportSize({ width: 390, height: 844 })
      await page.locator(MENU_BTN).click()
      await page.locator(DIALOG).waitFor({ state: 'visible' })
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- P1-4 / P2-2
describe('P1-4 và P2-2 Dropdown desktop', () => {
  const trigger = (page, label) => page.locator(`${DESKTOP_NAV} button`, { hasText: label })

  test('rê chuột rồi bấm vẫn truy cập được submenu', async () => {
    const { ctx, page } = await open('/', { width: 1280, height: 800 })
    try {
      const t = trigger(page, 'Dịch vụ')
      await t.hover()
      await t.click()
      await page.screenshot({ path: path.join(EVIDENCE, 'p1-4-hover-click-1280.png'), clip: { x: 0, y: 0, width: 1280, height: 420 } })
      assert.equal(await t.getAttribute('aria-expanded'), 'true', 'submenu đóng sau khi rê rồi bấm')
      const id = await t.getAttribute('aria-controls')
      assert.ok(await page.locator(`#${id} a[href="/dich-vu/spa"]`).isVisible(), 'không thấy link Spa trong submenu')
    } finally {
      await ctx.close()
    }
  })

  test('bàn phím: mở, focus mục đầu, Escape đóng và trả focus', async () => {
    const { ctx, page } = await open('/', { width: 1280, height: 800 })
    try {
      const t = trigger(page, 'Dịch vụ')
      await t.focus()
      await page.keyboard.press('Enter')
      assert.equal(await t.getAttribute('aria-expanded'), 'true', 'Enter không mở submenu')
      await page.keyboard.press('Escape')
      assert.equal(await t.getAttribute('aria-expanded'), 'false', 'Escape không đóng submenu')
      assert.ok(await t.evaluate((el) => el === document.activeElement), 'focus không trở về trigger')
    } finally {
      await ctx.close()
    }
  })

  test('P2-2: Tab rời nhóm thì submenu đóng', async () => {
    const { ctx, page } = await open('/', { width: 1280, height: 800 })
    try {
      const t = trigger(page, 'Dịch vụ')
      await t.focus()
      await page.keyboard.press('Enter')
      const id = await t.getAttribute('aria-controls')
      const n = await page.locator(`#${id} a`).count()
      for (let i = 0; i <= n; i++) await page.keyboard.press('Tab')
      const inside = await page.evaluate((mid) => !!document.getElementById(mid)?.contains(document.activeElement), id)
      assert.ok(!inside, 'focus vẫn nằm trong submenu sau khi Tab qua hết')
      assert.equal(await t.getAttribute('aria-expanded'), 'false', 'submenu vẫn mở sau khi focus rời nhóm')
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- P1-3
describe('P1-3 Trạng thái trang hiện tại', () => {
  const navState = (page) =>
    page.evaluate((navSel) => {
      const nav = document.querySelector(navSel)
      const items = [...nav.querySelectorAll(':scope > a, :scope > div > button, :scope > div > a')]
      return {
        current: [...document.querySelectorAll('header [aria-current="page"]')].map((e) => e.textContent.trim()),
        styles: Object.fromEntries(items.map((e) => [e.textContent.trim(), `${getComputedStyle(e).color}|${getComputedStyle(e).fontWeight}`])),
      }
    }, DESKTOP_NAV)

  test('"/" : Trang chủ có aria-current="page", không có mục nào khác', async () => {
    const { ctx, page } = await open('/', { width: 1280, height: 800 })
    try {
      const s = await navState(page)
      measurements.push({ id: 'P1-3', route: '/', current: s.current })
      assert.deepEqual(s.current, ['Trang chủ'], 'chỉ link "Trang chủ" được mang aria-current (logo không nên)')
    } finally {
      await ctx.close()
    }
  })

  for (const [route, group, other] of [
    ['/dich-vu/spa', 'Dịch vụ', 'Về Lê Sơn'],
    ['/cau-chuyen/abc', 'Câu chuyện', 'Về Lê Sơn'],
  ]) {
    test(`"${route}": nhóm "${group}" được tô, tối đa 1 aria-current`, async () => {
      const { ctx, page } = await open(route, { width: 1280, height: 800 })
      try {
        const s = await navState(page)
        measurements.push({ id: 'P1-3', route, ...s })
        assert.ok(s.current.length <= 1, `nhiều mục cùng aria-current: ${s.current}`)
        assert.ok(!s.current.includes('Trang chủ'), 'Trang chủ bị đánh dấu là trang hiện tại')
        assert.notEqual(s.styles[group], s.styles[other], `"${group}" không khác biệt so với "${other}"`)
      } finally {
        await ctx.close()
      }
    })
  }

  const currentIn = (page, scope) => page.evaluate((sc) => [...document.querySelectorAll(`${sc} [aria-current="page"]`)].map((e) => e.getAttribute('href')), scope)

  for (const [route, label, expected] of [
    ['/dich-vu/spa', 'Dịch vụ', ['/dich-vu/spa']],
    ['/dich-vu', 'Dịch vụ', ['/dich-vu']],
    ['/goc-thu-cung?cat=news', 'Góc thú cưng', ['/goc-thu-cung?cat=news']],
    ['/goc-thu-cung', 'Góc thú cưng', ['/goc-thu-cung']],
  ]) {
    test(`dropdown desktop "${route}": đúng một mục aria-current (${expected})`, async () => {
      const { ctx, page } = await open(route, { width: 1280, height: 800 })
      try {
        await openDropdownByKeyboard(page, label)
        const cur = await currentIn(page, `${DESKTOP_NAV} [id^="dropdown-menu"]`)
        measurements.push({ id: 'P1-3', route, dropdownCurrent: cur })
        assert.deepEqual(cur, expected)
      } finally {
        await ctx.close()
      }
    })
  }

  for (const route of ['/dich-vu-khong-ton-tai', '/cau-chuyenxyz', '/gioi-thieu-abc']) {
    test(`ranh giới route: "${route}" (404) không làm nhóm nào là hiện tại`, async () => {
      const { ctx, page } = await open(route, { width: 1280, height: 800 })
      try {
        const cur = await page.evaluate(() => [...document.querySelectorAll('header [aria-current="page"]')].map((e) => e.textContent.trim()))
        const styles = await page.evaluate((navSel) => [...document.querySelectorAll(`${navSel} > div > button, ${navSel} > a`)].map((e) => `${e.textContent.trim()}|${getComputedStyle(e).color}|${getComputedStyle(e).fontWeight}`), DESKTOP_NAV)
        measurements.push({ id: 'P1-3', route, current: cur, styles })
        assert.ok(await page.locator('main h1', { hasText: 'Không tìm thấy' }).isVisible(), 'không phải trang 404')
        assert.deepEqual(cur, [], `trang 404 vẫn có mục aria-current: ${cur}`)
        const distinct = new Set(styles.map((x) => x.split('|').slice(1).join('|')))
        assert.equal(distinct.size, 1, `có mục điều hướng được tô trên trang 404: ${styles}`)
      } finally {
        await ctx.close()
      }
    })
  }

  test('Drawer "/dich-vu/spa": link Spa có aria-current="page"', async () => {
    const { ctx, page } = await open('/dich-vu/spa', { width: 390, height: 844, mobile: true })
    try {
      await page.locator(MENU_BTN).click()
      await page.locator(DIALOG).waitFor({ state: 'visible' })
      const spa = page.locator(`${DIALOG} a[href="/dich-vu/spa"]`)
      if (!(await spa.isVisible())) await page.locator(`${DIALOG} button`, { hasText: 'Dịch vụ' }).click()
      assert.equal(await spa.getAttribute('aria-current'), 'page')
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- P1-6
describe('P1-6 Lối vào và tham số', () => {
  test('desktop: có link /lien-he và /dich-vu trong header hoặc footer, vào đúng route', async () => {
    const { ctx, page } = await open('/', { width: 1366, height: 768 })
    try {
      const lienHe = page.locator('header a[href="/lien-he"], footer a[href="/lien-he"]')
      const dichVu = page.locator('header a[href="/dich-vu"], footer a[href="/dich-vu"]')
      await openDropdownByKeyboard(page, 'Dịch vụ')
      const counts = { lienHe: await lienHe.count(), dichVu: await dichVu.count() }
      measurements.push({ id: 'P1-6', ...counts })
      assert.ok(counts.dichVu >= 1, 'không có link /dich-vu trong header/footer')
      assert.ok(counts.lienHe >= 1, 'không có link /lien-he trong header/footer')
      await lienHe.first().click()
      await page.waitForURL('**/lien-he')
      assert.ok(await page.locator('main h1').isVisible())
    } finally {
      await ctx.close()
    }
  })

  test('Drawer: có link /lien-he và /dich-vu', async () => {
    const { ctx, page } = await open('/', { width: 390, height: 844, mobile: true })
    try {
      await page.locator(MENU_BTN).click()
      await page.locator(DIALOG).waitFor({ state: 'visible' })
      const { hrefs } = await collectDrawer(page)
      measurements.push({ id: 'P1-6', drawerHrefs: hrefs })
      assert.ok(hrefs.includes('/lien-he'), 'Drawer thiếu /lien-he')
      assert.ok(hrefs.includes('/dich-vu'), 'Drawer thiếu /dich-vu')
      assert.ok(!hrefs.some((h) => h.includes('tab=')), 'Drawer còn link dùng ?tab=')
    } finally {
      await ctx.close()
    }
  })

  test('tin tức dùng ?cat=news, không còn ?tab=', async () => {
    const { ctx, page } = await open('/', { width: 1366, height: 768 })
    try {
      await openDropdownByKeyboard(page, 'Góc thú cưng')
      const hrefs = await page.evaluate(() => [...document.querySelectorAll('a[href*="goc-thu-cung?"]')].map((a) => a.getAttribute('href')))
      assert.ok(hrefs.length >= 1, 'không thấy link tin tức')
      assert.ok(hrefs.every((h) => h.includes('cat=news') && !h.includes('tab=')), `link tin tức: ${hrefs}`)
    } finally {
      await ctx.close()
    }
  })

  test('ComingSoon có CTA liên hệ/đặt lịch ngoài hotline và nút về trang chủ', async () => {
    const { ctx, page } = await open('/gioi-thieu', { width: 1366, height: 768 })
    try {
      assert.ok((await page.locator('main a[href="/lien-he"], main a[href="/dat-lich"]').count()) >= 1, 'ComingSoon thiếu CTA liên hệ/đặt lịch')
    } finally {
      await ctx.close()
    }
  })

  test('mobile 390px: hotline dễ thấy ở header hoặc thanh dưới đáy', async () => {
    const { ctx, page } = await open('/', { width: 390, height: 844, mobile: true })
    try {
      const tel = page.locator('a[href^="tel:"]')
      let visibleInViewport = 0
      for (const a of await tel.all()) {
        if (!(await a.isVisible())) continue
        const r = await a.boundingBox()
        if (r && r.y >= 0 && r.y + r.height <= 844) visibleInViewport++
      }
      assert.ok(visibleInViewport >= 1, 'không có hotline hiển thị trong màn hình đầu')
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- P1-7
describe('P1-7 Meta, lịch sử và tệp SEO', () => {
  test('title riêng, noindex đúng qua navigation, Back/Forward và 404', async () => {
    const { ctx, page } = await open('/', { width: 1366, height: 768 })
    try {
      const homeTitle = await page.title()
      const log = { home: { title: homeTitle, robots: await robots(page) } }
      assert.ok(!/noindex/.test(log.home.robots ?? ''), 'trang chủ không được có noindex')

      await page.locator('footer a[href="/gioi-thieu"]').click()
      await page.waitForURL('**/gioi-thieu')
      log.gioiThieu = await settledMeta(page, homeTitle)

      await page.locator('footer a[href="/bang-gia"]').click()
      await page.waitForURL('**/bang-gia')
      log.bangGia = await settledMeta(page, log.gioiThieu.title)

      await page.locator('header a[href="/"]').first().click()
      await page.waitForURL(BASE + '/')
      log.backHome = await settledMeta(page, log.bangGia.title)

      await page.goBack()
      await page.waitForURL('**/bang-gia')
      log.historyBack = await settledMeta(page, log.backHome.title)
      await page.goForward()
      await page.waitForURL(BASE + '/')
      log.historyForward = await settledMeta(page, log.historyBack.title)

      await page.goto(BASE + PAGES.notFound, { waitUntil: 'networkidle' })
      log.notFound = { title: await page.title(), robots: await robots(page) }
      measurements.push({ id: 'P1-7', ...log })

      assert.match(log.gioiThieu.robots ?? '', /noindex/)
      assert.notEqual(log.gioiThieu.title, homeTitle, 'trang chờ dùng chung title với trang chủ')
      assert.notEqual(log.bangGia.title, log.gioiThieu.title, 'hai trang chờ dùng chung title')
      assert.match(log.bangGia.robots ?? '', /noindex/)
      assert.ok(!/noindex/.test(log.backHome.robots ?? ''), 'meta noindex còn sót khi về trang chủ')
      assert.equal(log.backHome.title, homeTitle, 'title trang chủ không được khôi phục')
      assert.match(log.historyBack.robots ?? '', /noindex/, 'Back về trang chờ mất noindex')
      assert.ok(!/noindex/.test(log.historyForward.robots ?? ''), 'Forward về trang chủ còn noindex')
      assert.match(log.notFound.robots ?? '', /noindex/, '404 thiếu noindex')
      assert.notEqual(log.notFound.title, homeTitle, '404 dùng chung title với trang chủ')
    } finally {
      await ctx.close()
    }
  })

  test('robots.txt là text/plain, chặn /tai-khoan/, /dang-nhap, /dang-ky', async () => {
    const { ctx, page } = await open('/', { width: 1366, height: 768 })
    try {
      const res = await page.request.get(BASE + '/robots.txt')
      const body = await res.text()
      measurements.push({ id: 'P1-7', robotsTxt: { status: res.status(), type: res.headers()['content-type'], head: body.slice(0, 200) } })
      assert.equal(res.status(), 200)
      assert.match(res.headers()['content-type'] || '', /text\/plain/)
      assert.ok(!body.includes('<div id="root">'), 'robots.txt trả về HTML của SPA')
      for (const rule of ['Disallow: /tai-khoan/', 'Disallow: /dang-nhap', 'Disallow: /dang-ky']) assert.ok(body.includes(rule), `thiếu "${rule}"`)
      assert.match(body, /Sitemap:\s*\S+sitemap\.xml/)
    } finally {
      await ctx.close()
    }
  })

  test('sitemap.xml là XML hợp lệ, chỉ chứa trang chủ', async () => {
    const { ctx, page } = await open('/', { width: 1366, height: 768 })
    try {
      const res = await page.request.get(BASE + '/sitemap.xml')
      const body = await res.text()
      assert.equal(res.status(), 200)
      assert.match(res.headers()['content-type'] || '', /xml/)
      const parsed = await page.evaluate((xml) => {
        const doc = new DOMParser().parseFromString(xml, 'application/xml')
        return { error: !!doc.querySelector('parsererror'), locs: [...doc.getElementsByTagName('loc')].map((l) => l.textContent.trim()) }
      }, body)
      measurements.push({ id: 'P1-7', sitemap: parsed })
      assert.ok(!parsed.error, 'sitemap.xml không parse được')
      assert.equal(parsed.locs.length, 1, `sitemap có ${parsed.locs.length} URL`)
      assert.match(parsed.locs[0], /^https?:\/\/[^/]+\/?$/, `URL không phải trang chủ: ${parsed.locs[0]}`)
    } finally {
      await ctx.close()
    }
  })

  test('[thông tin] HTML gốc của trang chờ chưa có noindex (giới hạn client rendering)', async (t) => {
    const { ctx, page } = await open('/', { width: 1366, height: 768 })
    try {
      const raw = await (await page.request.get(BASE + '/gioi-thieu')).text()
      const has = /<meta[^>]+name=["']robots["'][^>]*noindex/i.test(raw)
      measurements.push({ id: 'P1-7', rawHtmlNoindex: has })
      if (!has) t.skip('BLOCKED: noindex trong HTML gốc cần phương án host/prerender được duyệt')
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- P1-8
describe('P1-8 Host đích', () => {
  test('mở thẳng/F5 route con, asset và URL sai trên host đích', async (t) => {
    if (!HOST) return t.skip('BLOCKED: chưa chốt host đích (đặt HOST_URL để chạy)')
    const { ctx, page } = await open('/', { width: 1366, height: 768 })
    try {
      const out = {}
      for (const p of ['/', '/gioi-thieu', '/dich-vu/spa', '/cau-chuyen/abc', '/robots.txt', '/sitemap.xml', '/images/logo.png', PAGES.notFound]) {
        out[p] = (await page.request.get(HOST + p)).status()
      }
      measurements.push({ id: 'P1-8', host: HOST, status: out })
      for (const p of ['/', '/gioi-thieu', '/dich-vu/spa', '/cau-chuyen/abc', '/robots.txt', '/sitemap.xml', '/images/logo.png']) assert.equal(out[p], 200, `${p} trả ${out[p]}`)
      const r = await page.goto(HOST + '/dich-vu/spa', { waitUntil: 'networkidle' })
      assert.ok(r.ok())
      assert.ok(await page.locator('main h1').isVisible(), 'route con không render app')
      await page.reload({ waitUntil: 'networkidle' })
      assert.ok(await page.locator('main h1').isVisible(), 'F5 route con không render app')
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- P2
function contrastIn(page, sels) {
  return page.evaluate((list) => {
    const cv = document.createElement('canvas').getContext('2d')
    const rgba = (c) => {
      cv.clearRect(0, 0, 1, 1)
      cv.fillStyle = '#000'
      cv.fillStyle = c
      cv.fillRect(0, 0, 1, 1)
      const d = cv.getImageData(0, 0, 1, 1).data
      return [d[0], d[1], d[2], d[3] / 255]
    }
    const bgStack = (el) => {
      const layers = []
      for (let e = el; e; e = e.parentElement) {
        const c = rgba(getComputedStyle(e).backgroundColor)
        if (c[3] > 0) layers.push(c)
        if (c[3] >= 1) break
      }
      let out = [255, 255, 255]
      for (const l of layers.reverse()) out = out.map((v, i) => l[i] * l[3] + v * (1 - l[3]))
      return out
    }
    const lum = (rgb) => {
      const [r, g, b] = rgb.map((v) => {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    return list.map(([label, sel]) => {
      const el = document.querySelector(sel)
      if (!el) return { label, missing: true }
      const cs = getComputedStyle(el)
      const fg = rgba(cs.color)
      const bg = bgStack(el)
      const fgc = fg.slice(0, 3).map((v, i) => v * fg[3] + bg[i] * (1 - fg[3]))
      const [a, b] = [lum(fgc), lum(bg)].sort((x, y) => y - x)
      const size = parseFloat(cs.fontSize)
      const bold = Number(cs.fontWeight) >= 700
      const large = size >= 24 || (bold && size >= 18.66)
      return { label, ratio: +((a + 0.05) / (b + 0.05)).toFixed(2), need: large ? 3 : 4.5, size, weight: cs.fontWeight }
    })
  }, sels)
}

describe('P2 Khả năng truy cập và CSS', () => {
  test('P2-1 tương phản các điểm đã nêu đạt WCAG AA', async () => {
    const { ctx, page } = await open('/', { width: 1366, height: 768 })
    try {
      await openDropdownByKeyboard(page, 'Dịch vụ')
      const res = await contrastIn(page, [
        ['Footer: dòng phụ dưới tên bệnh viện', 'footer a[href="/"] span:last-child'],
        ['Footer: số hotline trong ô cấp cứu', 'footer div a[href^="tel:"]'],
        ['Footer: link Cấp cứu', 'footer a[href="/dich-vu/cap-cuu"]'],
        ['Header: nút hotline', 'header a[href^="tel:"]'],
        ['Dropdown: mô tả mục (dòng phụ dưới nhãn)', 'header nav [id^="dropdown-menu"] a > span:last-child'],
      ])
      measurements.push({ id: 'P2-1', contrast: res })
      const missing = res.filter((r) => r.missing).map((r) => r.label)
      assert.deepEqual(missing, [], `không tìm thấy phần tử để đo, cần cập nhật selector: ${missing}`)
      const fails = res.filter((r) => r.ratio < r.need)
      assert.equal(fails.length, 0, `không đạt: ${JSON.stringify(fails)}`)
    } finally {
      await ctx.close()
    }
  })

  test('P2-3 chuyển trang: focus vào main/h1 hoặc có thông báo aria-live', async () => {
    const { ctx, page } = await open('/', { width: 1366, height: 768 })
    try {
      await page.locator('footer a[href="/gioi-thieu"]').click()
      await page.waitForURL('**/gioi-thieu')
      const ok = await page
        .waitForFunction(() => {
          const a = document.activeElement
          const inMain = a && a !== document.body && !!a.closest('main')
          const live = [...document.querySelectorAll('[aria-live]')].some((n) => n.textContent.trim().length > 0)
          return inMain || live
        }, null, { timeout: 2000 })
        .then(() => true, () => false)
      assert.ok(ok, 'không dời focus và không có thông báo khi chuyển trang')
    } finally {
      await ctx.close()
    }
  })

  test('P2-4 không còn lớp animate-in/fade-in/slide-in-* và py-0.2', async () => {
    const { ctx, page } = await open('/', { width: 390, height: 844, mobile: true })
    try {
      await page.locator(MENU_BTN).click()
      await page.locator(DIALOG).waitFor({ state: 'visible' })
      const { classes } = await collectDrawer(page)
      await page.keyboard.press('Escape')
      await page.setViewportSize({ width: 1366, height: 768 })
      for (const label of ['Về Lê Sơn', 'Dịch vụ', 'Góc thú cưng']) {
        await page.locator(`${DESKTOP_NAV} button`, { hasText: label }).click()
        for (const c of await page.locator('header [class]').evaluateAll((es) => es.flatMap((e) => (e.getAttribute('class') || '').split(/\s+/)))) classes.push(c)
      }
      for (const c of await page.locator('body [class]').evaluateAll((es) => es.flatMap((e) => (e.getAttribute('class') || '').split(/\s+/)))) classes.push(c)
      const bad = [...new Set(classes.filter((c) => /^(animate-in|fade-in|slide-in-from-.*|py-0\.2)$/.test(c)))]
      assert.deepEqual(bad, [])
    } finally {
      await ctx.close()
    }
  })

  test('P2-5 thanh dưới đáy có padding theo safe-area', async () => {
    const { ctx, page } = await open('/', { width: 390, height: 844, mobile: true })
    try {
      const hasSafeArea = await page.evaluate(() => {
        const bar = document.querySelector('[aria-label="Thanh tác vụ nhanh khẩn cấp"]') || [...document.querySelectorAll('div')].find((d) => getComputedStyle(d).position === 'fixed' && d.querySelector('a[href^="tel:"]'))
        if (!bar) return 'missing'
        if ((bar.getAttribute('style') || '').includes('safe-area-inset-bottom')) return true
        for (const sheet of document.styleSheets) {
          let rules
          try { rules = sheet.cssRules } catch { continue }
          for (const r of rules) {
            const walk = (rule) => {
              if (rule.cssRules) return [...rule.cssRules].some(walk)
              return rule.selectorText && rule.cssText.includes('safe-area-inset-bottom') && bar.matches(rule.selectorText)
            }
            if (walk(r)) return true
          }
        }
        return false
      })
      assert.equal(hasSafeArea, true, 'thanh dưới đáy không dùng env(safe-area-inset-bottom)')
    } finally {
      await ctx.close()
    }
  })

  test('giảm chuyển động được tôn trọng', async () => {
    const { ctx, page } = await open('/', { width: 1366, height: 768, reducedMotion: 'reduce' })
    try {
      const d = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('header')).transitionDuration))
      assert.ok(d <= 0.01, `transition-duration ${d}s`)
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- Tổng
test('không có console error / pageerror trong toàn bộ lượt chạy', () => {
  assert.deepEqual(consoleErrors, [])
})
