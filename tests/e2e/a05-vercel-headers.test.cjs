// A05 — kiểm tĩnh phương án X-Robots-Tag trong vercel.json TRƯỚC khi triển khai.
// Mô phỏng cách Vercel so khớp `source` bằng path-to-regexp v6 (thư viện kiểm tra, không thuộc repo).
// Đây KHÔNG thay thế kiểm tra trên host Vercel thật (A04).
// Chạy: APP_DIR=<bản sao đúng SHA> PATH_TO_REGEXP=<đường dẫn tới node_modules/path-to-regexp> node --test tests/e2e/a05-vercel-headers.test.cjs
const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const APP_DIR = process.env.APP_DIR
let pathToRegexp = null
try {
  pathToRegexp = require(process.env.PATH_TO_REGEXP || 'path-to-regexp').pathToRegexp
} catch {
  pathToRegexp = null
}

// Trang chờ và khu vực tài khoản/nội bộ: phải nhận noindex từ phản hồi ban đầu (gồm tuyến gốc, tuyến con, dấu "/" cuối).
const MUST_NOINDEX = [
  '/gioi-thieu', '/gioi-thieu/', '/doi-ngu', '/co-so-vat-chat',
  '/dich-vu', '/dich-vu/', '/dich-vu/kham-dieu-tri', '/dich-vu/noi-tru', '/dich-vu/spa', '/dich-vu/cap-cuu', '/dich-vu/spa/',
  '/bang-gia', '/cau-chuyen', '/cau-chuyen/', '/cau-chuyen/mot-ca-bat-ky',
  '/goc-thu-cung', '/bai-viet/mot-bai-bat-ky', '/san-pham', '/dat-lich', '/lien-he',
  '/dang-nhap', '/dang-ky', '/tai-khoan', '/tai-khoan/', '/tai-khoan/ho-so', '/tai-khoan/lich-hen',
  '/quan-ly', '/quan-ly/', '/quan-ly/lich-hen',
]
// Không bao giờ được noindex nhầm.
const MUST_NOT_NOINDEX = ['/', '/robots.txt', '/sitemap.xml', '/favicon.png', '/images/logo.png', '/assets/index-abc123.js', '/assets/index-abc123.css']
// Cần quyết định riêng (soft 404): URL không tồn tại.
const DECISION_SOFT404 = ['/khong-ton-tai', '/dich-vu-khong-ton-tai', '/abc/xyz']

function loadConfig() {
  return JSON.parse(fs.readFileSync(path.join(APP_DIR, 'vercel.json'), 'utf8'))
}

function robotsFor(cfg, url) {
  const hits = []
  for (const h of cfg.headers || []) {
    if (h.has || h.missing) hits.push({ source: h.source, note: 'có has/missing — chỉ kiểm được trên host thật' })
    const re = pathToRegexp(h.source)
    if (!re.test(url)) continue
    for (const kv of h.headers || []) if (/^x-robots-tag$/i.test(kv.key)) hits.push({ source: h.source, value: kv.value })
  }
  return hits.filter((x) => x.value)
}

describe('A05 X-Robots-Tag theo tuyến trong vercel.json (kiểm tĩnh)', () => {
  const ready = APP_DIR && pathToRegexp && fs.existsSync(path.join(APP_DIR || '', 'vercel.json'))

  test('vercel.json có khối headers với X-Robots-Tag', (t) => {
    if (!ready) return t.skip('thiếu APP_DIR, vercel.json hoặc path-to-regexp')
    const cfg = loadConfig()
    const has = (cfg.headers || []).some((h) => (h.headers || []).some((kv) => /^x-robots-tag$/i.test(kv.key)))
    assert.ok(has, 'chưa có header X-Robots-Tag nào — phương án A05 chưa được áp dụng')
    assert.ok((cfg.rewrites || []).some((r) => r.destination === '/index.html'), 'mất rewrite SPA về /index.html')
  })

  for (const url of MUST_NOINDEX) {
    test(`"${url}" nhận noindex`, (t) => {
      if (!ready) return t.skip('thiếu APP_DIR, vercel.json hoặc path-to-regexp')
      const hits = robotsFor(loadConfig(), url)
      assert.ok(hits.some((h) => /noindex/i.test(h.value)), `không có X-Robots-Tag noindex cho ${url}`)
    })
  }

  for (const url of MUST_NOT_NOINDEX) {
    test(`"${url}" KHÔNG bị noindex`, (t) => {
      if (!ready) return t.skip('thiếu APP_DIR, vercel.json hoặc path-to-regexp')
      const hits = robotsFor(loadConfig(), url)
      assert.ok(!hits.some((h) => /noindex/i.test(h.value)), `${url} bị noindex bởi ${JSON.stringify(hits)}`)
    })
  }

  test('[quyết định] URL không tồn tại (soft 404) có được noindex không', (t) => {
    if (!ready) return t.skip('thiếu APP_DIR, vercel.json hoặc path-to-regexp')
    const cfg = loadConfig()
    const res = Object.fromEntries(DECISION_SOFT404.map((u) => [u, robotsFor(cfg, u).some((h) => /noindex/i.test(h.value))]))
    t.diagnostic(`soft 404 noindex: ${JSON.stringify(res)}`)
  })
})
