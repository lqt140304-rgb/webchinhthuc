import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert'

async function run() {
  const evidenceDir = path.resolve('docs/qa/2a-fix-evidence')
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true })
  }

  const BASE_URL = 'http://localhost:4173'

  console.log('Đang kết nối Chrome DevTools Protocol...')
  const targetsRes = await fetch('http://localhost:9222/json/list')
  const targets = await targetsRes.json()
  const pageTarget = targets.find((t) => t.type === 'page')
  if (!pageTarget) {
    throw new Error('Không tìm thấy page target trên cổng 9222')
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl)
  let idCounter = 1
  const pending = new Map()

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      if (msg.error) reject(msg.error)
      else resolve(msg.result)
    }
  }

  await new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = reject
  })

  function send(method, params = {}) {
    const id = idCounter++
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject })
      ws.send(JSON.stringify({ id, method, params }))
    })
  }

  await send('Page.enable')
  await send('Runtime.enable')

  async function evalScript(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })
    if (res.exceptionDetails) {
      throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`)
    }
    return res.result.value
  }

  async function captureScreenshot(filename) {
    const { data } = await send('Page.captureScreenshot', { format: 'png' })
    const buf = Buffer.from(data, 'base64')
    fs.writeFileSync(path.join(evidenceDir, filename), buf)
    console.log(`[EVIDENCE] Đã lưu ảnh: docs/qa/2a-fix-evidence/${filename}`)
  }

  const testResults = []

  function logPass(name, detail = '') {
    testResults.push({ name, status: 'PASS', detail })
    console.log(`  ✓ [PASS] ${name} ${detail ? `(${detail})` : ''}`)
  }

  function logFail(name, err) {
    testResults.push({ name, status: 'FAIL', detail: err.message })
    console.error(`  ✗ [FAIL] ${name}: ${err.message}`)
    throw err
  }

  console.log('\n===============================================================')
  console.log('BỘ KIỂM THỬ E2E MỐC 2A THEO QUY TRÌNH DOCS/QA/2A-E2E-PROTOCOL.MD')
  console.log('===============================================================')

  // -------------------------------------------------------------------------
  // SUITE 1: HEADER & VIEWPORT 320PX (P1-1)
  // -------------------------------------------------------------------------
  console.log('\n--- SUITE 1: HEADER 320PX & MENU VISIBILITY (P1-1) ---')
  try {
    await send('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 568,
      deviceScaleFactor: 1,
      mobile: true,
    })
    await send('Page.navigate', { url: `${BASE_URL}/` })
    await new Promise((r) => setTimeout(r, 1000))

    const metrics = await evalScript(`
      (() => {
        const vpWidth = window.innerWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const menuBtn = document.querySelector('button[aria-controls="mobile-nav-dialog"]');
        const btnRect = menuBtn ? menuBtn.getBoundingClientRect() : null;
        return {
          vpWidth,
          scrollWidth,
          btnExists: !!menuBtn,
          btnRight: btnRect ? Math.round(btnRect.right) : -1,
          btnWidth: btnRect ? Math.round(btnRect.width) : -1
        };
      })()
    `)

    assert.strictEqual(metrics.vpWidth, 320, 'Viewport width phải chính xác là 320px')
    assert.ok(metrics.scrollWidth <= 320, `scrollWidth (${metrics.scrollWidth}px) không được vượt quá 320px`)
    assert.ok(metrics.btnExists, 'Nút hamburger menu phải tồn tại')
    assert.ok(metrics.btnRight <= 320, `Nút menu (right: ${metrics.btnRight}px) phải nằm trọn trong viewport 320px`)

    await captureScreenshot('header-320-fixed.png')
    logPass('Header 320px viewport & scrollWidth', `scrollWidth=${metrics.scrollWidth}px <= 320px, MenuBtn right=${metrics.btnRight}px`)

    // Bấm nút menu để mở Drawer tại 320px
    await evalScript(`
      (() => {
        const btn = document.querySelector('button[aria-controls="mobile-nav-dialog"]');
        if (btn) btn.click();
      })()
    `)
    await new Promise((r) => setTimeout(r, 400))
    const drawerOpen = await evalScript(`!!document.getElementById('mobile-nav-dialog')`)
    assert.ok(drawerOpen, 'Drawer phải mở khi nhấn nút menu tại 320px')
    logPass('Header 320px Drawer interaction', 'Bấm nút menu mở Drawer thành công')

    // Đóng drawer lại
    await evalScript(`
      (() => {
        const closeBtn = document.querySelector('button[aria-label="Đóng menu điều hướng"]');
        if (closeBtn) closeBtn.click();
      })()
    `)
    await new Promise((r) => setTimeout(r, 300))
  } catch (err) {
    logFail('Suite 1: Header 320px', err)
  }

  // -------------------------------------------------------------------------
  // SUITE 2: RESPONSIVE ACROSS ALL REQUIRED VIEWPORTS (P1-1, P1-2)
  // -------------------------------------------------------------------------
  console.log('\n--- SUITE 2: RESPONSIVE KIỂM SOÁT TRÀN NGANG TOÀN BỘ SITE ---')
  const viewports = [
    { w: 320, h: 568, name: '320px' },
    { w: 390, h: 844, name: '390px' },
    { w: 768, h: 1024, name: '768px' },
    { w: 1024, h: 768, name: '1024px' },
    { w: 1366, h: 768, name: '1366px' },
    { w: 1440, h: 900, name: '1440px' },
  ]

  for (const vp of viewports) {
    try {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.w < 768,
      })
      await send('Page.navigate', { url: `${BASE_URL}/` })
      await new Promise((r) => setTimeout(r, 800))

      const data = await evalScript(`
        (() => {
          const bodyWidth = document.body.scrollWidth;
          const htmlWidth = document.documentElement.scrollWidth;
          const maxScroll = Math.max(bodyWidth, htmlWidth);
          return { maxScroll, target: ${vp.w} };
        })()
      `)

      assert.ok(
        data.maxScroll <= vp.w,
        `Viewport ${vp.name} bị tràn: maxScroll=${data.maxScroll}px > target=${vp.w}px`
      )
      logPass(`Trang chủ Responsive ${vp.name}`, `scrollWidth=${data.maxScroll}px <= ${vp.w}px`)
    } catch (err) {
      logFail(`Trang chủ Responsive ${vp.name}`, err)
    }
  }

  // Chụp ảnh bằng chứng các viewport chính
  await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 568, deviceScaleFactor: 1, mobile: true })
  await send('Page.navigate', { url: `${BASE_URL}/` })
  await new Promise((r) => setTimeout(r, 800))
  await captureScreenshot('homepage-320-fixed.png')

  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url: `${BASE_URL}/` })
  await new Promise((r) => setTimeout(r, 800))
  await captureScreenshot('homepage-1366-fixed.png')

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url: `${BASE_URL}/` })
  await new Promise((r) => setTimeout(r, 800))
  await captureScreenshot('homepage-1440-fixed.png')

  // Chụp ảnh Drawer mở trên tablet 768px
  await send('Emulation.setDeviceMetricsOverride', { width: 768, height: 1024, deviceScaleFactor: 1, mobile: true })
  await send('Page.navigate', { url: `${BASE_URL}/` })
  await new Promise((r) => setTimeout(r, 800))
  await evalScript(`
    (() => {
      const btn = document.querySelector('button[aria-controls="mobile-nav-dialog"]');
      if (btn) btn.click();
    })()
  `)
  await new Promise((r) => setTimeout(r, 500))
  await captureScreenshot('drawer-open-768-fixed.png')
  await evalScript(`document.querySelector('button[aria-label="Đóng menu điều hướng"]')?.click()`)

  // Kiểm tra ComingSoon tại 1440px
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url: `${BASE_URL}/gioi-thieu` })
  await new Promise((r) => setTimeout(r, 800))
  const comingSoonWidth = await evalScript(`document.documentElement.scrollWidth`)
  assert.ok(comingSoonWidth <= 1440, 'ComingSoon không được tràn ngang ở 1440px')
  await captureScreenshot('coming-soon-1440-fixed.png')
  logPass('ComingSoonView Responsive 1440px', `scrollWidth=${comingSoonWidth}px <= 1440px`)

  // Kiểm tra 404 tại 1440px
  await send('Page.navigate', { url: `${BASE_URL}/duong-dan-khong-ton-tai-404` })
  await new Promise((r) => setTimeout(r, 800))
  const notFoundWidth = await evalScript(`document.documentElement.scrollWidth`)
  assert.ok(notFoundWidth <= 1440, '404 không được tràn ngang ở 1440px')
  await captureScreenshot('not-found-1440-fixed.png')
  logPass('NotFoundPage Responsive 1440px', `scrollWidth=${notFoundWidth}px <= 1440px`)

  // -------------------------------------------------------------------------
  // SUITE 3: DRAWER BEHAVIOR, FOCUS & RESIZE ACROSS 1024PX (P1-5)
  // -------------------------------------------------------------------------
  console.log('\n--- SUITE 3: DRAWER UNMOUNT, BODY OVERFLOW & KEYBOARD (P1-5) ---')
  try {
    await send('Emulation.setDeviceMetricsOverride', { width: 900, height: 700, deviceScaleFactor: 1, mobile: true })
    await send('Page.navigate', { url: `${BASE_URL}/` })
    await new Promise((r) => setTimeout(r, 800))

    // Mở drawer tại 900px
    await evalScript(`document.querySelector('button[aria-controls="mobile-nav-dialog"]')?.click()`)
    await new Promise((r) => setTimeout(r, 400))

    const openState = await evalScript(`
      (() => ({
        dialogExists: !!document.getElementById('mobile-nav-dialog'),
        bodyOverflow: document.body.style.overflow
      }))()
    `)
    assert.ok(openState.dialogExists, 'Drawer phải hiển thị')
    assert.strictEqual(openState.bodyOverflow, 'hidden', 'Body overflow phải là hidden khi drawer mở')
    logPass('Drawer mở & khóa cuộn body tại 900px', 'body.style.overflow = hidden')

    // Resize lên 1180px (vượt qua breakpoint lg: 1024px)
    await send('Emulation.setDeviceMetricsOverride', { width: 1180, height: 800, deviceScaleFactor: 1, mobile: false })
    await new Promise((r) => setTimeout(r, 600))

    const afterResizeState = await evalScript(`
      (() => ({
        dialogExists: !!document.getElementById('mobile-nav-dialog'),
        bodyOverflow: document.body.style.overflow
      }))()
    `)
    assert.strictEqual(afterResizeState.dialogExists, false, 'Drawer phải tự động unmount khi resize lên desktop')
    assert.notStrictEqual(afterResizeState.bodyOverflow, 'hidden', 'Body overflow phải được phục hồi khi resize lên desktop')
    logPass('Drawer unmount & body scroll restore khi resize lên desktop', 'dialog=false, bodyOverflow=""')

    // Quay lại di động và mở lại thành công
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
    await new Promise((r) => setTimeout(r, 500))
    await evalScript(`document.querySelector('button[aria-controls="mobile-nav-dialog"]')?.click()`)
    await new Promise((r) => setTimeout(r, 300))
    const reOpenState = await evalScript(`!!document.getElementById('mobile-nav-dialog')`)
    assert.ok(reOpenState, 'Drawer phải mở lại được sau chu trình resize')
    logPass('Drawer tái mở trên mobile sau resize', 'Thành công')

    // Đóng bằng Escape
    await evalScript(`
      (() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      })()
    `)
    await new Promise((r) => setTimeout(r, 300))
    const closedAfterEscape = await evalScript(`!document.getElementById('mobile-nav-dialog')`)
    assert.ok(closedAfterEscape, 'Drawer phải đóng khi ấn Escape')
    logPass('Drawer đóng qua phím Escape', 'Thành công')
  } catch (err) {
    logFail('Suite 3: Drawer Behavior & Resize', err)
  }

  // -------------------------------------------------------------------------
  // SUITE 4: DROPDOWN INTERACTION & A11Y (P1-4)
  // -------------------------------------------------------------------------
  console.log('\n--- SUITE 4: DROPDOWN INTERACTION (P1-4) ---')
  try {
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
    await send('Page.navigate', { url: `${BASE_URL}/` })
    await new Promise((r) => setTimeout(r, 800))

    // 1. Mở menu bằng click
    await evalScript(`document.getElementById('dropdown-trigger-services')?.click()`)
    await new Promise((r) => setTimeout(r, 400))
    const dropdownOpenedByClick = await evalScript(`!!document.getElementById('dropdown-menu-services')`)
    assert.ok(dropdownOpenedByClick, 'Dropdown Dịch vụ phải mở khi click')
    logPass('Dropdown click disclosure', 'Mở menu thành công')

    // 2. Click lại trigger không làm hỏng trạng thái
    await evalScript(`document.getElementById('dropdown-trigger-services')?.click()`)
    await new Promise((r) => setTimeout(r, 400))
    const menuAfterSecondClick = await evalScript(`!document.getElementById('dropdown-menu-services')`)
    assert.ok(menuAfterSecondClick, 'Dropdown toggle đóng đúng khi click lần 2')
    logPass('Dropdown toggle click lần 2', 'Đóng menu thành công')

    // 3. Phím Escape đóng dropdown
    await evalScript(`document.getElementById('dropdown-trigger-about')?.click()`)
    await new Promise((r) => setTimeout(r, 300))
    await evalScript(`
      (() => {
        const btn = document.getElementById('dropdown-trigger-about');
        btn?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      })()
    `)
    await new Promise((r) => setTimeout(r, 300))
    const aboutMenuClosed = await evalScript(`!document.getElementById('dropdown-menu-about')`)
    assert.ok(aboutMenuClosed, 'Dropdown phải đóng khi bấm Escape')
    logPass('Dropdown keyboard Escape', 'Đóng menu thành công')
  } catch (err) {
    logFail('Suite 4: Dropdown Interaction', err)
  }

  // -------------------------------------------------------------------------
  // SUITE 5: NAVIGATION LINKS & ACTIVE STATE (P1-3, P1-6)
  // -------------------------------------------------------------------------
  console.log('\n--- SUITE 5: NAVIGATION LINKS & ACTIVE STATE (P1-3, P1-6) ---')
  try {
    await send('Page.navigate', { url: `${BASE_URL}/` })
    await new Promise((r) => setTimeout(r, 800))

    // Kiểm tra aria-current="page" trên Trang chủ
    const homeCurrent = await evalScript(`
      (() => {
        const homeLink = document.querySelector('nav a[href="/"]');
        return homeLink?.getAttribute('aria-current');
      })()
    `)
    assert.strictEqual(homeCurrent, 'page', 'Trang chủ phải có aria-current="page" khi ở route "/"')
    logPass('Trang chủ active aria-current', 'aria-current="page"')

    // Mở dropdown Góc thú cưng để kiểm tra liên kết con trong submenu
    await evalScript(`document.getElementById('dropdown-trigger-petCorner')?.click()`)
    await new Promise((r) => setTimeout(r, 300))

    // Kiểm tra liên kết /lien-he, /dich-vu và ?cat=news tồn tại
    const navLinks = await evalScript(`
      (() => {
        const hasContact = Array.from(document.querySelectorAll('a')).some(a => a.getAttribute('href') === '/lien-he');
        const hasServices = Array.from(document.querySelectorAll('a')).some(a => a.getAttribute('href') === '/dich-vu');
        const hasNewsCat = Array.from(document.querySelectorAll('a')).some(a => a.getAttribute('href')?.includes('cat=news'));
        return { hasContact, hasServices, hasNewsCat };
      })()
    `)
    assert.ok(navLinks.hasContact, 'Phải có liên kết dẫn tới /lien-he')
    assert.ok(navLinks.hasServices, 'Phải có liên kết dẫn tới /dich-vu')
    assert.ok(navLinks.hasNewsCat, 'Tham số tin tức phải đồng bộ thành ?cat=news')
    logPass('Liên kết /lien-he, /dich-vu và ?cat=news', 'Đầy đủ trong DOM')
  } catch (err) {
    logFail('Suite 5: Navigation & Active State', err)
  }

  // -------------------------------------------------------------------------
  // SUITE 6: METADATA, TITLE, ROBOTS & HISTORY (P1-7)
  // -------------------------------------------------------------------------
  console.log('\n--- SUITE 6: ROUTE METADATA & NOINDEX (P1-7) ---')
  try {
    // 1. Trang chủ: index, follow
    await send('Page.navigate', { url: `${BASE_URL}/` })
    await new Promise((r) => setTimeout(r, 800))
    const homeRobots = await evalScript(`document.querySelector('meta[name="robots"]')?.getAttribute('content')`)
    assert.strictEqual(homeRobots, 'index, follow', 'Trang chủ phải có robots="index, follow"')
    logPass('Metadata Trang chủ', 'robots="index, follow"')

    // 2. ComingSoon: noindex, nofollow
    await send('Page.navigate', { url: `${BASE_URL}/gioi-thieu` })
    await new Promise((r) => setTimeout(r, 800))
    const wipRobots = await evalScript(`document.querySelector('meta[name="robots"]')?.getAttribute('content')`)
    const wipTitle = await evalScript(`document.title`)
    assert.strictEqual(wipRobots, 'noindex, nofollow', 'Trang ComingSoon phải có robots="noindex, nofollow"')
    assert.ok(wipTitle.includes('Về Bệnh viện Thú y Lê Sơn'), 'Title phải cập nhật đúng tên trang')
    logPass('Metadata ComingSoonView', `robots="noindex, nofollow", title="${wipTitle}"`)

    // 3. 404: noindex, nofollow
    await send('Page.navigate', { url: `${BASE_URL}/trang-khong-ton-tai` })
    await new Promise((r) => setTimeout(r, 800))
    const notFoundRobots = await evalScript(`document.querySelector('meta[name="robots"]')?.getAttribute('content')`)
    assert.strictEqual(notFoundRobots, 'noindex, nofollow', 'Trang 404 phải có robots="noindex, nofollow"')
    logPass('Metadata NotFoundPage', 'robots="noindex, nofollow"')
  } catch (err) {
    logFail('Suite 6: Route Metadata & History', err)
  }

  // -------------------------------------------------------------------------
  // SUITE 7: STATIC SEO FILES (P1-7, P1-8)
  // -------------------------------------------------------------------------
  console.log('\n--- SUITE 7: TỆP SEO TĨNH (ROBOTS.TXT, SITEMAP.XML) ---')
  try {
    const robotsTxt = fs.readFileSync(path.resolve('public/robots.txt'), 'utf8')
    assert.ok(robotsTxt.includes('Allow: /'), 'robots.txt phải Allow: /')
    assert.ok(robotsTxt.includes('Disallow: /tai-khoan/'), 'robots.txt phải Disallow: /tai-khoan/')
    assert.ok(robotsTxt.includes('Sitemap: https://bvthuyleson.vn/sitemap.xml'), 'robots.txt phải có sitemap')
    logPass('Cấu trúc public/robots.txt', 'Hợp lệ')

    const sitemapXml = fs.readFileSync(path.resolve('public/sitemap.xml'), 'utf8')
    assert.ok(sitemapXml.includes('<loc>https://bvthuyleson.vn/</loc>'), 'sitemap.xml phải chứa trang chủ')
    assert.ok(!sitemapXml.includes('/gioi-thieu'), 'sitemap.xml KHÔNG được chứa các trang ComingSoon')
    logPass('Cấu trúc public/sitemap.xml', 'Chỉ chứa trang chủ đã sẵn sàng')
  } catch (err) {
    logFail('Suite 7: Static SEO Files', err)
  }

  ws.close()

  console.log('\n===============================================================')
  console.log(`TỔNG KẾT: ${testResults.filter((t) => t.status === 'PASS').length}/${testResults.length} TEST CASES ĐẠT (100% PASS)`)
  console.log('===============================================================')
}

run().catch((err) => {
  console.error('\nLỖI CHẠY KIỂM THỬ E2E:', err)
  process.exit(1)
})
