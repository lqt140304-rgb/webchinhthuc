// B04 — QA 6 section trang chủ (mốc 2B) theo MASTER PROMPT mục VII, XII và quyết định 26/10/2026.
// Chạy: BASE_URL=http://localhost:4173 EVIDENCE_DIR=./ev node --test tests/e2e/2b.e2e.test.cjs
// Test tự động không thay thế xem ảnh bằng mắt, thiết bị thật hay trình đọc màn hình thật.
const { test, before, after, describe } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { chromium } = require('playwright')

const BASE = (process.env.BASE_URL || 'http://localhost:4173').replace(/\/$/, '')
const EVIDENCE = process.env.EVIDENCE_DIR || path.join(process.cwd(), 'e2e-evidence')
fs.mkdirSync(EVIDENCE, { recursive: true })

const WIDTHS = [
  [320, 568, true],
  [360, 740, true],
  [390, 844, true],
  [768, 1024, false],
  [1366, 768, false],
  [1440, 900, false],
  [1920, 1080, false],
]
const SECTIONS = [
  ['hero', 'main section:nth-of-type(1)'],
  ['vi-sao', '#vi-sao-chon-le-son'],
  ['dich-vu', '#dich-vu-tieu-bieu'],
  ['cau-chuyen', '#cau-chuyen-noi-bat'],
  ['kien-thuc', '#goc-kien-thuc'],
  ['dat-lich-lien-he', '#dat-lich-va-lien-he'],
]
const HOTLINE_TEL = 'tel:0973555105'

let browser
const consoleErrors = []
const measurements = []

before(async () => {
  browser = await chromium.launch()
})
after(async () => {
  fs.writeFileSync(path.join(EVIDENCE, 'measurements-2b.json'), JSON.stringify({ base: BASE, measurements, consoleErrors }, null, 2))
  await browser?.close()
})

async function open(urlPath, { width = 1440, height = 900, mobile = false, reducedMotion } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, reducedMotion })
  const page = await ctx.newPage()
  const tag = `${urlPath}@${width}${mobile ? 'm' : ''}`
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(`${tag}: ${m.text()}`))
  page.on('pageerror', (e) => consoleErrors.push(`${tag}: ${e.message}`))
  await page.goto(BASE + urlPath, { waitUntil: 'networkidle' })
  return { ctx, page }
}

// Cuộn hết trang để ảnh lazy tải xong, chờ theo trạng thái thay vì sleep cố định.
async function loadAll(page) {
  for (const img of await page.locator('main img').all()) {
    await img.scrollIntoViewIfNeeded()
    await img.evaluate((i) => (i.complete && i.naturalWidth > 0 ? null : new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }) })))
  }
  await page.evaluate(() => scrollTo(0, 0))
}

// ---------------------------------------------------------------- Cấu trúc
describe('B04 cấu trúc: đúng 6 section, đúng thứ tự, không có section bác sĩ trưởng', () => {
  test('main có đúng 6 section cấp 1, theo thứ tự quy định', async () => {
    const { ctx, page } = await open('/')
    try {
      const top = await page.evaluate(() => [...document.querySelectorAll('main section')].filter((s) => !s.parentElement.closest('main section')).map((s) => s.id || s.querySelector('h1,h2')?.textContent.trim().slice(0, 40)))
      measurements.push({ id: 'B04-structure', sections: top })
      assert.equal(top.length, 6, `có ${top.length} section: ${JSON.stringify(top)}`)
      for (const [name, sel] of SECTIONS.slice(1)) assert.ok(await page.locator(sel).count(), `thiếu section ${name} (${sel})`)
      const order = await page.evaluate((sels) => sels.map((s) => document.querySelector(s)?.getBoundingClientRect().top + scrollY), SECTIONS.map((s) => s[1]))
      assert.deepEqual([...order].sort((a, b) => a - b), order, `sai thứ tự section: ${order}`)
    } finally {
      await ctx.close()
    }
  })

  test('không có section giới thiệu Bác sĩ trưởng trên trang chủ', async () => {
    const { ctx, page } = await open('/')
    try {
      const text = await page.locator('main').innerText()
      assert.ok(!/Lê Thái Sơn|Bác sĩ trưởng/i.test(text), 'trang chủ nhắc tới Bác sĩ trưởng')
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- Từng section
describe('B04 nội dung từng section', () => {
  test('Section 1 Hero: đúng headline, CTA Đặt lịch và Gọi hotline, ba khung ảnh', async () => {
    const { ctx, page } = await open('/')
    try {
      const hero = page.locator(SECTIONS[0][1])
      const h1 = (await page.locator('main h1').allTextContents()).map((t) => t.replace(/\s+/g, ' ').trim())
      assert.equal(h1.length, 1, `trang có ${h1.length} h1`)
      assert.match(h1[0], /Khi bé không khỏe, bạn không phải lo một mình\.?/)
      assert.ok(await hero.locator('a[href="/dat-lich"]').count(), 'Hero thiếu CTA /dat-lich')
      assert.ok(await hero.locator(`a[href="${HOTLINE_TEL}"]`).count(), 'Hero thiếu CTA gọi hotline')
      const imgs = await hero.locator('img').count()
      assert.ok(imgs >= 3, `Hero có ${imgs} ảnh`)
    } finally {
      await ctx.close()
    }
  })

  test('Section 2 Vì sao chọn Lê Sơn: ba giá trị và lối cấp cứu 24/24', async () => {
    const { ctx, page } = await open('/')
    try {
      const s = page.locator('#vi-sao-chon-le-son')
      const h3 = (await s.locator('h3').allTextContents()).map((t) => t.trim())
      measurements.push({ id: 'B04-s2', values: h3 })
      assert.ok(h3.some((t) => /Chuyên môn/i.test(t) && /Trách nhiệm/i.test(t)), 'thiếu "Chuyên môn và trách nhiệm"')
      assert.ok(h3.some((t) => /Tận tâm/i.test(t) && /Lắng nghe/i.test(t)), 'thiếu "Tận tâm, lắng nghe"')
      assert.ok(h3.some((t) => /Theo dõi/i.test(t) && /minh bạch/i.test(t)), 'thiếu "Theo dõi và chăm sóc minh bạch"')
      assert.ok(await s.locator(`a[href="${HOTLINE_TEL}"], a[href="/dich-vu/cap-cuu"]`).count(), 'thiếu lối cấp cứu 24/24')
    } finally {
      await ctx.close()
    }
  })

  test('Section 3 Dịch vụ tiêu biểu: đúng 3 dịch vụ, CTA tất cả dịch vụ, lối cấp cứu', async () => {
    const { ctx, page } = await open('/')
    try {
      const s = page.locator('#dich-vu-tieu-bieu')
      const hrefs = await s.locator('a[href^="/dich-vu/"]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')))])
      measurements.push({ id: 'B04-s3', hrefs })
      for (const h of ['/dich-vu/kham-dieu-tri', '/dich-vu/noi-tru', '/dich-vu/spa']) assert.ok(hrefs.includes(h), `thiếu link ${h}`)
      assert.equal((await s.locator('h3').count()), 3, 'số thẻ dịch vụ khác 3')
      assert.ok(await s.locator('a[href="/dich-vu"]').count(), 'thiếu CTA Xem tất cả dịch vụ')
      assert.ok(await s.locator(`a[href="${HOTLINE_TEL}"], a[href="/dich-vu/cap-cuu"]`).count(), 'thiếu lối cấp cứu 24/24')
    } finally {
      await ctx.close()
    }
  })

  test('Section 4 Câu chuyện: đúng một câu chuyện, có nhãn minh họa, CTA Đọc câu chuyện tới trang chi tiết', async () => {
    const { ctx, page } = await open('/')
    try {
      const s = page.locator('#cau-chuyen-noi-bat')
      const text = await s.innerText()
      assert.equal(await s.locator('h3').count(), 1, 'không phải đúng một câu chuyện')
      assert.match(text, /minh họa/i, 'thiếu nhãn minh họa cho ca mẫu')
      const cta = await s.locator('a').evaluateAll((as) => as.map((a) => ({ href: a.getAttribute('href'), text: a.textContent.trim() })))
      measurements.push({ id: 'B04-s4', cta })
      const read = cta.find((c) => /Đọc\b.*câu chuyện/i.test(c.text))
      assert.ok(read, 'thiếu CTA "Đọc câu chuyện"')
      // B03 (Giai đoạn 3): CTA về trang chi tiết khi có nội dung; ở 2B chấp nhận trang danh sách.
      assert.match(read.href, /^\/cau-chuyen(\/[^/]+)?$/, `CTA trỏ tới ${read.href}`)
      if (read.href === '/cau-chuyen') measurements.push({ id: 'B03-info', note: 'CTA câu chuyện trỏ trang danh sách — xử lý ở Giai đoạn 3' })
    } finally {
      await ctx.close()
    }
  })

  test('Section 5 Góc kiến thức: 2–3 bài, có nhãn bản mẫu, link /bai-viet/:slug', async () => {
    const { ctx, page } = await open('/')
    try {
      const s = page.locator('#goc-kien-thuc')
      const n = await s.locator('article').count()
      assert.ok(n >= 2 && n <= 3, `có ${n} bài viết`)
      assert.match(await s.innerText(), /bản mẫu|minh họa/i, 'thiếu nhãn bản mẫu')
      const links = await s.locator('article a').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
      assert.ok(links.every((h) => /^\/bai-viet\/[^/]+$/.test(h)), `link bài viết: ${links}`)
    } finally {
      await ctx.close()
    }
  })

  test('Section 6 Đặt lịch & Liên hệ: CTA, hotline, giờ khám, địa chỉ, chỉ đường; KHÔNG có form (B01)', async () => {
    const { ctx, page } = await open('/')
    try {
      const s = page.locator('#dat-lich-va-lien-he')
      const text = await s.innerText()
      assert.ok(await s.locator('a[href="/dat-lich"]').count(), 'thiếu CTA /dat-lich')
      assert.ok(await s.locator(`a[href="${HOTLINE_TEL}"]`).count(), 'thiếu hotline')
      assert.match(text, /08:00\s*[–-]\s*21:00/, 'thiếu giờ khám 08:00–21:00')
      assert.match(text, /101 Khuất Duy Tiến/, 'thiếu địa chỉ')
      assert.ok(await s.locator('a[href*="google.com/maps"], a[href*="maps.google"], a[href*="goo.gl/maps"]').count(), 'thiếu liên kết chỉ đường')
      const forms = await page.locator('main form').count()
      measurements.push({ id: 'B04-s6', formsOnHome: forms })
      assert.equal(forms, 0, `trang chủ còn ${forms} form — form đầy đủ phải nằm ở /dat-lich (B01)`)
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- B01 /dat-lich
describe('B01 trang /dat-lich', () => {
  test('/dat-lich có form với nhãn cho mọi trường, không báo đặt lịch thành công giả', async () => {
    const { ctx, page } = await open('/dat-lich')
    try {
      const form = page.locator('main form')
      assert.ok(await form.count(), '/dat-lich chưa có form')
      const unlabeled = await form.locator('input:not([type=hidden]):not([type=submit]), select, textarea').evaluateAll((els) =>
        els.filter((el) => !(el.labels && el.labels.length) && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')).map((el) => el.name || el.id || el.outerHTML.slice(0, 60)),
      )
      assert.deepEqual(unlabeled, [], `trường chưa có nhãn: ${unlabeled}`)
      await form.locator('[type=submit], button:not([type=button])').first().click()
      const invalid = await form.evaluate((f) => !f.checkValidity() || !!f.querySelector('[aria-invalid="true"]'))
      assert.ok(invalid, 'gửi form rỗng nhưng không có kiểm tra dữ liệu')
      const body = await page.locator('main').innerText()
      assert.ok(!/đặt lịch thành công|đã xác nhận lịch|lịch hẹn đã được xác nhận/i.test(body), 'có thông báo xác nhận giả')
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- Responsive 7 kích thước
describe('B04 responsive ở 7 kích thước', () => {
  for (const [w, h, mobile] of WIDTHS) {
    test(`@${w}px: không tràn, ảnh không méo, chữ không bị cắt`, async () => {
      const { ctx, page } = await open('/', { width: w, height: h, mobile })
      try {
        await loadAll(page)
        const r = await page.evaluate((W) => {
          const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
          const distorted = [...document.querySelectorAll('main img')]
            .filter((i) => i.naturalWidth && i.getBoundingClientRect().width > 0)
            .filter((i) => {
              const fit = getComputedStyle(i).objectFit
              if (fit === 'cover' || fit === 'contain') return false
              const b = i.getBoundingClientRect()
              return Math.abs(b.width / b.height - i.naturalWidth / i.naturalHeight) > 0.03
            })
            .map((i) => i.getAttribute('src'))
          const clipped = [...document.querySelectorAll('main h1, main h2, main h3, main p, main a, main button')]
            .filter((el) => {
              const cs = getComputedStyle(el)
              if (cs.display === 'none' || cs.visibility === 'hidden') return false
              if (/-webkit-box/.test(cs.display) || cs.webkitLineClamp !== 'none') return false
              const ov = cs.overflowX !== 'visible' || cs.overflowY !== 'visible'
              return ov && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)
            })
            .map((el) => el.textContent.trim().slice(0, 40))
          const offscreen = [...document.querySelectorAll('main a, main button')]
            .filter((el) => el.getBoundingClientRect().width > 0)
            .filter((el) => {
              const b = el.getBoundingClientRect()
              return b.right > W + 1 || b.left < -1
            })
            .map((el) => el.textContent.trim().slice(0, 30))
          return { innerWidth, scrollWidth, distorted, clipped, offscreen }
        }, w)
        measurements.push({ id: 'B04-resp', width: w, ...r })
        await page.screenshot({ path: path.join(EVIDENCE, `2b-home-${w}.png`), fullPage: true })
        assert.equal(r.innerWidth, w, `viewport bị nới thành ${r.innerWidth}`)
        assert.ok(r.scrollWidth <= w, `tràn ngang: ${r.scrollWidth}`)
        assert.deepEqual(r.distorted, [], 'ảnh bị méo')
        assert.deepEqual(r.clipped, [], 'chữ bị cắt')
        assert.deepEqual(r.offscreen, [], 'nút/link nằm ngoài màn hình')
      } finally {
        await ctx.close()
      }
    })
  }
})

// ---------------------------------------------------------------- Ảnh, font, link
describe('B04 ảnh, font tiếng Việt, liên kết', () => {
  test('mọi ảnh trong main tải được và có alt (ảnh trang trí: alt="" kèm aria-hidden)', async () => {
    const { ctx, page } = await open('/')
    try {
      await loadAll(page)
      const imgs = await page.evaluate(() => [...document.querySelectorAll('main img')].map((i) => ({ src: i.getAttribute('src'), ok: i.complete && i.naturalWidth > 0, alt: i.getAttribute('alt'), hidden: i.closest('[aria-hidden="true"]') !== null })))
      measurements.push({ id: 'B04-img', imgs })
      assert.deepEqual(imgs.filter((i) => !i.ok).map((i) => i.src), [], 'ảnh lỗi')
      assert.deepEqual(imgs.filter((i) => i.alt === null || (i.alt === '' && !i.hidden)).map((i) => i.src), [], 'ảnh thiếu alt')
    } finally {
      await ctx.close()
    }
  })

  test('Be Vietnam Pro và Lora tải được, hiển thị dấu tiếng Việt', async () => {
    const { ctx, page } = await open('/')
    try {
      await page.evaluate(() => document.fonts.ready)
      const r = await page.evaluate(() => ({
        sans: document.fonts.check('16px "Be Vietnam Pro"', 'Khỏe ộ ữ ỹ đ'),
        serif: document.fonts.check('32px "Lora"', 'Khỏe ộ ữ ỹ đ'),
        loaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight} ${f.style}`),
        h1Font: getComputedStyle(document.querySelector('main h1')).fontFamily,
      }))
      measurements.push({ id: 'B04-font', ...r })
      assert.ok(r.loaded.some((f) => /Be Vietnam Pro/.test(f)), `Be Vietnam Pro chưa tải: ${r.loaded}`)
      assert.ok(r.loaded.some((f) => /Lora/.test(f)), `Lora chưa tải: ${r.loaded}`)
    } finally {
      await ctx.close()
    }
  })

  test('không có nút chết: mọi link nội bộ trong main mở ra trang hợp lệ, không có href="#"', async () => {
    const { ctx, page } = await open('/')
    try {
      const hrefs = await page.locator('main a[href]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')))])
      const bad = hrefs.filter((h) => h === '#' || h === '' || /^javascript:/i.test(h))
      const dead = []
      for (const h of hrefs.filter((x) => x.startsWith('/'))) {
        await page.goto(BASE + h, { waitUntil: 'networkidle' })
        if (await page.locator('main h1', { hasText: 'Không tìm thấy' }).count()) dead.push(h)
      }
      measurements.push({ id: 'B04-links', hrefs, bad, dead })
      assert.deepEqual(bad, [], 'link rỗng hoặc "#"')
      assert.deepEqual(dead, [], 'link nội bộ dẫn tới 404')
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- Accessibility
describe('B04 accessibility', () => {
  test('mọi phần tử nhận focus trong main có vòng focus nhìn thấy', async () => {
    const { ctx, page } = await open('/')
    try {
      const n = await page.locator('main a[href], main button, main input, main select, main textarea').count()
      const noRing = []
      await page.locator('main').evaluate((m) => m.focus?.())
      for (let i = 0; i < n + 40 && noRing.length < 10; i++) {
        await page.keyboard.press('Tab')
        const r = await page.evaluate(() => {
          const el = document.activeElement
          if (!el || !el.closest('main')) return null
          const cs = getComputedStyle(el)
          const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none')
          return { ring, text: (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 30) }
        })
        if (r && !r.ring) noRing.push(r.text)
      }
      measurements.push({ id: 'B04-focus', focusables: n, noRing })
      assert.deepEqual(noRing, [], 'phần tử không có vòng focus')
    } finally {
      await ctx.close()
    }
  })

  test('tương phản chữ trong main đạt WCAG AA', async () => {
    const { ctx, page } = await open('/')
    try {
      await loadAll(page)
      const fails = await page.evaluate(() => {
        const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
        const rgba = (c) => {
          cv.clearRect(0, 0, 1, 1)
          cv.fillStyle = '#000'
          cv.fillStyle = c
          cv.fillRect(0, 0, 1, 1)
          const d = cv.getImageData(0, 0, 1, 1).data
          return [d[0], d[1], d[2], d[3] / 255]
        }
        const bg = (el) => {
          const layers = []
          for (let e = el; e; e = e.parentElement) {
            const cs = getComputedStyle(e)
            if (cs.backgroundImage !== 'none') return null
            const c = rgba(cs.backgroundColor)
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
        const out = []
        const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT)
        const seen = new Set()
        while (walker.nextNode()) {
          const el = walker.currentNode.parentElement
          if (!walker.currentNode.textContent.trim() || seen.has(el)) continue
          seen.add(el)
          const cs = getComputedStyle(el)
          if (cs.visibility === 'hidden' || el.getBoundingClientRect().width === 0) continue
          const b = bg(el)
          if (!b) continue // nằm trên ảnh/gradient: kiểm bằng mắt
          const f = rgba(cs.color)
          const fg = f.slice(0, 3).map((v, i) => v * f[3] + b[i] * (1 - f[3]))
          const [x, y] = [lum(fg), lum(b)].sort((p, q) => q - p)
          const ratio = (x + 0.05) / (y + 0.05)
          const size = parseFloat(cs.fontSize)
          const large = size >= 24 || (Number(cs.fontWeight) >= 700 && size >= 18.66)
          if (ratio < (large ? 3 : 4.5)) out.push({ text: el.textContent.trim().slice(0, 40), ratio: +ratio.toFixed(2), size })
        }
        return out
      })
      measurements.push({ id: 'B04-contrast', fails })
      assert.deepEqual(fails, [], 'chữ không đạt tương phản')
    } finally {
      await ctx.close()
    }
  })

  test('prefers-reduced-motion: không còn animation/transition kéo dài', async () => {
    const { ctx, page } = await open('/', { reducedMotion: 'reduce' })
    try {
      await loadAll(page)
      const long = await page.evaluate(() =>
        [...document.querySelectorAll('main *')]
          .map((el) => {
            const cs = getComputedStyle(el)
            const max = (s) => Math.max(...s.split(',').map((x) => parseFloat(x) * (x.includes('ms') ? 0.001 : 1)))
            return { el: el.className?.toString().slice(0, 30), a: max(cs.animationDuration), t: max(cs.transitionDuration) }
          })
          .filter((x) => x.a > 0.05 || x.t > 0.05)
          .slice(0, 10),
      )
      assert.deepEqual(long, [], 'còn chuyển động khi bật giảm chuyển động')
    } finally {
      await ctx.close()
    }
  })
})

// ---------------------------------------------------------------- Hiệu năng & SEO
describe('B04 layout shift, SEO, dữ liệu', () => {
  for (const [w, h, mobile] of [WIDTHS[2], WIDTHS[5]]) {
    test(`CLS khi tải và cuộn @${w}px < 0.1`, async () => {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile })
      const page = await ctx.newPage()
      try {
        await page.addInitScript(() => {
          window.__cls = 0
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value
          }).observe({ type: 'layout-shift', buffered: true })
        })
        await page.goto(BASE + '/', { waitUntil: 'networkidle' })
        await loadAll(page)
        const cls = await page.evaluate(() => window.__cls)
        measurements.push({ id: 'B04-cls', width: w, cls })
        assert.ok(cls < 0.1, `CLS ${cls.toFixed(3)}`)
      } finally {
        await ctx.close()
      }
    })
  }

  test('metadata trang chủ: title, description, canonical, robots index', async () => {
    const { ctx, page } = await open('/')
    try {
      const m = await page.evaluate(() => ({
        title: document.title,
        desc: document.querySelector('meta[name=description]')?.content || '',
        canonical: [...document.querySelectorAll('link[rel=canonical]')].map((l) => l.href),
        robots: document.querySelector('meta[name=robots]')?.content || null,
        lang: document.documentElement.lang,
      }))
      measurements.push({ id: 'B04-seo', ...m })
      assert.ok(m.title.length >= 10 && m.title.length <= 65, `title dài ${m.title.length}`)
      assert.ok(m.desc.length >= 70 && m.desc.length <= 170, `description dài ${m.desc.length}`)
      assert.equal(m.canonical.length, 1)
      assert.ok(!/noindex/.test(m.robots || ''), 'trang chủ bị noindex')
      assert.equal(m.lang, 'vi')
    } finally {
      await ctx.close()
    }
  })

  test('không có dữ liệu chưa xác minh trình bày như thật (heuristic, cần xem thêm bằng mắt)', async () => {
    const { ctx, page } = await open('/')
    try {
      const text = await page.locator('main').innerText()
      const flags = []
      for (const [name, re] of [
        ['số liệu thống kê', /\d+[.,]?\d*\s*(%|\+\s*(khách|ca|năm)|năm kinh nghiệm|khách hàng hài lòng)/gi],
        ['tuyên bố quốc tế', /chuẩn quốc tế|đạt chuẩn quốc tế|hàng đầu (việt nam|hà nội)|số 1/gi],
        ['đơn vị hành chính chưa xác nhận', /Nhân Chính|Phường|Quận/g],
        ['cam kết ngày lễ (B02)', /ngày lễ|lễ tết|Tết/gi],
      ]) {
        const m = text.match(re)
        if (m) flags.push({ name, matches: [...new Set(m)] })
      }
      measurements.push({ id: 'B04-data', flags })
      assert.deepEqual(flags, [], `cần xác minh: ${JSON.stringify(flags)}`)
    } finally {
      await ctx.close()
    }
  })
})

test('2B: không có console error / pageerror', () => {
  assert.deepEqual(consoleErrors, [])
})
