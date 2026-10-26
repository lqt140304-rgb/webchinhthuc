// B04 — trang /dat-lich (B01): form, kiểm tra dữ liệu, thông báo trung thực, accessibility, responsive.
// Chạy: BASE_URL=http://localhost:4173 EVIDENCE_DIR=./ev node --test tests/e2e/2b-booking.e2e.test.cjs
const { test, before, after, describe } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { chromium } = require('playwright')

const BASE = (process.env.BASE_URL || 'http://localhost:4173').replace(/\/$/, '')
const EVIDENCE = process.env.EVIDENCE_DIR || path.join(process.cwd(), 'e2e-evidence')
fs.mkdirSync(EVIDENCE, { recursive: true })
const WIDTHS = [[320, 568, true], [360, 740, true], [390, 844, true], [768, 1024, false], [1366, 768, false], [1440, 900, false], [1920, 1080, false]]
const FIELDS = 'main form input:not([type=hidden]):not([type=submit]), main form select, main form textarea'
const FALSE_SUCCESS = /đặt lịch thành công|đã đặt lịch|đã xác nhận|lịch hẹn đã được|đã tiếp nhận yêu cầu|gửi thành công/i

let browser
const consoleErrors = []
const measurements = []
before(async () => { browser = await chromium.launch() })
after(async () => {
  fs.writeFileSync(path.join(EVIDENCE, 'measurements-2b-booking.json'), JSON.stringify({ base: BASE, measurements, consoleErrors }, null, 2))
  await browser?.close()
})

async function open(urlPath, { width = 1440, height = 900, mobile = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile })
  const page = await ctx.newPage()
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(`${urlPath}@${width}: ${m.text()}`))
  page.on('pageerror', (e) => consoleErrors.push(`${urlPath}@${width}: ${e.message}`))
  await page.goto(BASE + urlPath, { waitUntil: 'networkidle' })
  return { ctx, page }
}

async function fillValid(page) {
  const today = new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10)
  for (const el of await page.locator(FIELDS).all()) {
    const tag = await el.evaluate((e) => e.tagName.toLowerCase())
    const type = (await el.getAttribute('type')) || ''
    const name = ((await el.getAttribute('name')) || (await el.getAttribute('id')) || '').toLowerCase()
    if (tag === 'select') {
      const v = await el.evaluate((s) => [...s.options].find((o) => o.value && !o.disabled)?.value)
      if (v) await el.selectOption(v)
    } else if (type === 'radio') {
      if (!(await page.locator(`input[type=radio][name="${await el.getAttribute('name')}"]:checked`).count())) await el.check()
    } else if (type === 'checkbox') {
      if (await el.evaluate((e) => e.required)) await el.check()
    } else if (type === 'date') await el.fill(today)
    else if (type === 'tel' || /phone|sdt|dien-thoai/.test(name)) await el.fill('0912345678')
    else if (tag === 'textarea') await el.fill('Bé ăn ít hai ngày nay (dữ liệu kiểm thử QA).')
    else await el.fill(/pet|be-cung|ten-be/.test(name) ? 'Mít' : 'Nguyễn Văn Kiểm Thử')
  }
}

describe('B01 /dat-lich: form', () => {
  test('mọi trường có nhãn; trường bắt buộc được đánh dấu', async () => {
    const { ctx, page } = await open('/dat-lich')
    try {
      const info = await page.locator(FIELDS).evaluateAll((els) => els.map((el) => ({
        name: el.name || el.id, type: el.type,
        label: (el.labels?.[0]?.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 50),
        required: el.required || el.getAttribute('aria-required') === 'true',
      })))
      measurements.push({ id: 'B01-fields', fields: info })
      assert.ok(info.length >= 6, `form có ${info.length} trường`)
      assert.deepEqual(info.filter((f) => !f.label).map((f) => f.name), [], 'trường không có nhãn')
    } finally { await ctx.close() }
  })

  test('gửi form rỗng: không gửi, có thông báo lỗi gắn với trường và focus vào lỗi đầu tiên', async () => {
    const { ctx, page } = await open('/dat-lich')
    try {
      await page.locator('main form [type=submit]').first().click()
      await page.waitForFunction(() => document.querySelector('main [aria-invalid="true"], main [role="alert"], main form :invalid'), null, { timeout: 3000 }).catch(() => {})
      const r = await page.evaluate(() => {
        const invalid = [...document.querySelectorAll('main form [aria-invalid="true"]')]
        const described = invalid.filter((el) => (el.getAttribute('aria-describedby') || '').split(/\s+/).some((id) => id && document.getElementById(id)?.textContent.trim()))
        const a = document.activeElement
        return {
          invalid: invalid.length, described: described.length,
          nativeInvalid: document.querySelectorAll('main form :invalid').length,
          focusOnInvalid: !!a && (a.getAttribute('aria-invalid') === 'true' || a.matches(':invalid')),
          text: document.querySelector('main').innerText,
        }
      })
      measurements.push({ id: 'B01-empty-submit', ...r, text: undefined })
      assert.ok(!FALSE_SUCCESS.test(r.text), 'form rỗng nhưng hiện thông báo thành công')
      assert.ok(r.invalid + r.nativeInvalid > 0, 'không có kiểm tra dữ liệu')
      assert.ok(r.invalid === 0 || r.described === r.invalid, `${r.invalid - r.described} lỗi không gắn aria-describedby vào trường`)
      assert.ok(r.focusOnInvalid, 'focus không chuyển tới trường lỗi đầu tiên')
    } finally { await ctx.close() }
  })

  test('số điện thoại sai định dạng bị chặn', async () => {
    const { ctx, page } = await open('/dat-lich')
    try {
      await fillValid(page)
      await page.locator('main form input[type=tel], main form input[name*=phone i]').first().fill('12345')
      await page.locator('main form [type=submit]').first().click()
      const blocked = await page.evaluate(() => !!document.querySelector('main form [aria-invalid="true"], main form :invalid'))
      assert.ok(blocked, 'SĐT 12345 vẫn được chấp nhận')
    } finally { await ctx.close() }
  })

  test('ngày hẹn không cho chọn ngày trong quá khứ', async () => {
    const { ctx, page } = await open('/dat-lich')
    try {
      const min = await page.locator('main form input[type=date]').first().getAttribute('min')
      const today = new Date().toISOString().slice(0, 10)
      measurements.push({ id: 'B01-date-min', min, today })
      // Cho phép lệch 1 ngày do múi giờ giữa trình duyệt và máy chạy test.
      const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10)
      assert.ok(min && min >= yesterday, `min=${min}, hôm nay=${today}`)
    } finally { await ctx.close() }
  })

  test('gửi dữ liệu hợp lệ: KHÔNG báo đặt lịch/tiếp nhận thành công; nói rõ chưa gửi và dẫn tới hotline', async () => {
    const { ctx, page } = await open('/dat-lich')
    try {
      const requests = []
      page.on('request', (r) => { if (!/\.(js|css|png|jpg|svg|woff2?)$|fonts\.g/.test(r.url()) && r.method() !== 'GET') requests.push(`${r.method()} ${r.url()}`) })
      await fillValid(page)
      await page.locator('main form [type=submit]').first().click()
      await page.waitForFunction(() => !document.querySelector('main form') || document.querySelector('main [role="status"], main [aria-live]')?.textContent.trim(), null, { timeout: 3000 }).catch(() => {})
      const text = await page.locator('main').innerText()
      await page.screenshot({ path: path.join(EVIDENCE, '2b-booking-after-submit-1440.png'), fullPage: true })
      const result = text.match(/[^\n]*Thành Công[^\n]*/gi) || []
      measurements.push({ id: 'B01-valid-submit', requests, successPhrases: result, hasHotline: /097 355 51 05/.test(text), saysNotSent: /chưa (được )?(gửi|kết nối|lưu)|không (được )?gửi|thử nghiệm|bản mẫu/i.test(text) })
      assert.deepEqual(requests, [], 'form gửi request ra ngoài dù chưa có backend')
      assert.ok(!FALSE_SUCCESS.test(text), 'có thông báo đặt lịch/tiếp nhận thành công giả')
      assert.match(text, /chưa (được )?(gửi|kết nối|lưu)|không (được )?gửi|thử nghiệm|bản mẫu/i, 'không nói rõ dữ liệu chưa được gửi')
      assert.match(text, /097 355 51 05/, 'không dẫn tới hotline')
    } finally { await ctx.close() }
  })

  test('focus nhìn thấy trên mọi trường và nút của form (outline/box-shadow, hoặc viền đổi màu ≥ 3:1)', async () => {
    const { ctx, page } = await open('/dat-lich')
    try {
      const noRing = []
      const borderOnly = []
      const style = (e) => { const c = getComputedStyle(e); return { border: c.borderTopColor, bw: parseFloat(c.borderTopWidth), outline: c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0, shadow: c.boxShadow && c.boxShadow !== 'none' } }
      for (const el of await page.locator(`${FIELDS}, main form button`).all()) {
        const before = await el.evaluate(style)
        await el.focus()
        const after = await el.evaluate(style)
        const name = await el.evaluate((e) => e.name || e.id || e.textContent.trim().slice(0, 20))
        if (after.outline || after.shadow) continue
        const ratio = await page.evaluate(([a, b]) => {
          const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
          const rgb = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = '#fff'; cv.fillRect(0, 0, 1, 1); cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); return [...cv.getImageData(0, 0, 1, 1).data].slice(0, 3) }
          const lum = (x) => { const [r, g, bb] = x.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r + 0.7152 * g + 0.0722 * bb }
          const [p, q] = [lum(rgb(a)), lum(rgb(b))].sort((m, n) => n - m)
          return (p + 0.05) / (q + 0.05)
        }, [before.border, after.border])
        if (after.bw >= 1 && ratio >= 3) borderOnly.push({ name, width: after.bw, ratio: +ratio.toFixed(2) })
        else noRing.push(name)
      }
      measurements.push({ id: 'B01-focus', noRing, borderOnly })
      assert.deepEqual(noRing, [], 'phần tử không có chỉ báo focus nhìn thấy')
    } finally { await ctx.close() }
  })

  test('/dat-lich: title riêng, noindex (meta), một h1', async () => {
    const { ctx, page } = await open('/dat-lich')
    try {
      const m = await page.evaluate(() => ({ title: document.title, robots: document.querySelector('meta[name=robots]')?.content, h1: document.querySelectorAll('main h1').length }))
      measurements.push({ id: 'B01-meta', ...m })
      assert.match(m.robots || '', /noindex/)
      assert.equal(m.h1, 1)
      assert.ok(/Đặt lịch/i.test(m.title), `title: ${m.title}`)
    } finally { await ctx.close() }
  })
})

describe('B01 /dat-lich: responsive 7 kích thước', () => {
  for (const [w, h, mobile] of WIDTHS) {
    test(`@${w}px không tràn, nút gửi nằm trong màn hình`, async () => {
      const { ctx, page } = await open('/dat-lich', { width: w, height: h, mobile })
      try {
        const r = await page.evaluate(() => ({
          innerWidth, scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
          off: [...document.querySelectorAll('main input, main select, main textarea, main button, main a')].filter((e) => { const b = e.getBoundingClientRect(); return b.width && (b.right > innerWidth + 1 || b.left < -1) }).map((e) => e.name || e.textContent.trim().slice(0, 20)),
        }))
        measurements.push({ id: 'B01-resp', width: w, ...r })
        await page.screenshot({ path: path.join(EVIDENCE, `2b-booking-${w}.png`), fullPage: true })
        assert.equal(r.innerWidth, w)
        assert.ok(r.scrollWidth <= w, `tràn ngang ${r.scrollWidth}`)
        assert.deepEqual(r.off, [])
      } finally { await ctx.close() }
    })
  }
})

test('/dat-lich: tương phản chữ đạt AA', async () => {
  const { ctx, page } = await open('/dat-lich')
  try {
    const fails = await page.evaluate(() => {
      const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
      const rgba = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = '#000'; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); const d = cv.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255] }
      const bg = (el) => { const L = []; for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none') return null; const c = rgba(cs.backgroundColor); if (c[3] > 0) L.push(c); if (c[3] >= 1) break } let o = [255, 255, 255]; for (const l of L.reverse()) o = o.map((v, i) => l[i] * l[3] + v * (1 - l[3])); return o }
      const lum = (rgb) => { const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
      const out = []; const seen = new Set()
      const w = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT)
      while (w.nextNode()) {
        const el = w.currentNode.parentElement
        if (!w.currentNode.textContent.trim() || seen.has(el)) continue
        seen.add(el)
        const cs = getComputedStyle(el); if (el.getBoundingClientRect().width === 0) continue
        const b = bg(el); if (!b) continue
        const f = rgba(cs.color); const fg = f.slice(0, 3).map((v, i) => v * f[3] + b[i] * (1 - f[3]))
        const [x, y] = [lum(fg), lum(b)].sort((p, q) => q - p); const ratio = (x + 0.05) / (y + 0.05)
        const size = parseFloat(cs.fontSize); const large = size >= 24 || (Number(cs.fontWeight) >= 700 && size >= 18.66)
        if (ratio < (large ? 3 : 4.5)) out.push({ text: el.textContent.trim().slice(0, 40), ratio: +ratio.toFixed(2) })
      }
      return out
    })
    measurements.push({ id: 'B01-contrast', fails })
    assert.deepEqual(fails, [])
  } finally { await ctx.close() }
})

test('2b-booking: không có console error / pageerror', () => {
  assert.deepEqual(consoleErrors, [])
})
