import fs from 'node:fs'
import path from 'node:path'

async function run() {
  const outputDir = path.resolve('screenshots')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const targetsRes = await fetch('http://localhost:9222/json/list')
  const targets = await targetsRes.json()
  const pageTarget = targets.find((t) => t.type === 'page')
  if (!pageTarget) {
    throw new Error('No page target found')
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

  // 1. Kiểm tra tràn ngang (Horizontal overflow test) tại 5 kích thước
  const viewports = [
    { w: 320, h: 568, name: 'mobile-320' },
    { w: 390, h: 844, name: 'mobile-390' },
    { w: 768, h: 1024, name: 'tablet-768' },
    { w: 1366, h: 768, name: 'laptop-1366' },
    { w: 1440, h: 900, name: 'desktop-1440' },
  ]

  console.log('\n--- KIỂM TRA TRÀN NGANG (HORIZONTAL OVERFLOW TEST) ---')
  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 1,
      mobile: vp.w < 768,
    })
    await send('Page.navigate', { url: 'http://localhost:4173/' })
    await new Promise((r) => setTimeout(r, 1000))

    const evalResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const bodyWidth = document.body.scrollWidth;
          const htmlWidth = document.documentElement.scrollWidth;
          const innerWidth = window.innerWidth;
          const overflow = Math.max(bodyWidth, htmlWidth) > innerWidth;
          return {
            innerWidth,
            bodyWidth,
            htmlWidth,
            overflow
          };
        })()
      `,
      returnByValue: true,
    })

    const data = evalResult.result.value
    console.log(`Viewport ${vp.w}px (${vp.name}): window=${data.innerWidth}px, scrollWidth=${data.htmlWidth}px -> Overflow: ${data.overflow ? 'FAIL' : 'PASS (Không tràn)'}`)
  }

  // 2. Chụp ảnh các section và các kích thước chính
  async function capture(filename, width, height, setupFn = null) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768,
    })
    await send('Page.navigate', { url: 'http://localhost:4173/' })
    await new Promise((r) => setTimeout(r, 1200))

    if (setupFn) {
      await setupFn(send)
      await new Promise((r) => setTimeout(r, 600))
    }

    const { data } = await send('Page.captureScreenshot', { format: 'png' })
    const filePath = path.join(outputDir, filename)
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'))
    console.log(`Saved screenshot: ${filename}`)
  }

  console.log('\n--- CHỤP ẢNH GIAO DIỆN KIỂM THỬ ---')
  // Section 1: Hero
  await capture('m2b-sec1-hero-1440.png', 1440, 900)

  // Section 2: Vì sao chọn Lê Sơn
  await capture('m2b-sec2-whychoose-1440.png', 1440, 900, async (sendFn) => {
    await sendFn('Runtime.evaluate', {
      expression: `document.getElementById('vi-sao-chon-le-son')?.scrollIntoView({ behavior: 'instant' });`,
    })
  })

  // Section 3: Dịch vụ tiêu biểu
  await capture('m2b-sec3-services-1440.png', 1440, 900, async (sendFn) => {
    await sendFn('Runtime.evaluate', {
      expression: `document.getElementById('dich-vu-tieu-bieu')?.scrollIntoView({ behavior: 'instant' });`,
    })
  })

  // Section 4: Câu chuyện điều trị
  await capture('m2b-sec4-story-1440.png', 1440, 900, async (sendFn) => {
    await sendFn('Runtime.evaluate', {
      expression: `document.getElementById('cau-chuyen-noi-bat')?.scrollIntoView({ behavior: 'instant' });`,
    })
  })

  // Section 5: Góc kiến thức
  await capture('m2b-sec5-knowledge-1440.png', 1440, 900, async (sendFn) => {
    await sendFn('Runtime.evaluate', {
      expression: `document.getElementById('goc-kien-thuc')?.scrollIntoView({ behavior: 'instant' });`,
    })
  })

  // Section 6: Đặt lịch & liên hệ
  await capture('m2b-sec6-booking-1440.png', 1440, 900, async (sendFn) => {
    await sendFn('Runtime.evaluate', {
      expression: `document.getElementById('dat-lich-va-lien-he')?.scrollIntoView({ behavior: 'instant' });`,
    })
  })

  // Viewport Laptop 1366px
  await capture('m2b-laptop-1366.png', 1366, 768)

  // Viewport Tablet 768px
  await capture('m2b-tablet-768.png', 768, 1024)

  // Viewport Mobile 390px
  await capture('m2b-mobile-390.png', 390, 844)

  // Viewport Mobile 320px
  await capture('m2b-mobile-320.png', 320, 568)

  ws.close()
  console.log('\nHoàn tất toàn bộ kiểm thử và chụp ảnh Mốc 2B!')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
