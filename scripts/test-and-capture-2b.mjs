import fs from 'node:fs'
import path from 'node:path'

async function run() {
  const outputDir = path.resolve('screenshots')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const brainDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\6f5020a8-5310-41e1-a151-7821d0315e27'

  const targetsRes = await fetch('http://localhost:9222/json/list')
  const targets = await targetsRes.json()
  const pageTarget = targets.find((t) => t.type === 'page')
  if (!pageTarget) {
    throw new Error('No page target found on Chrome remote debugging port')
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

  // 1. Kiểm tra tràn ngang chuẩn xác (Strict Viewport Width Check)
  const viewports = [
    { w: 320, h: 568, name: 'mobile-320' },
    { w: 375, h: 667, name: 'mobile-375' },
    { w: 390, h: 844, name: 'mobile-390' },
    { w: 768, h: 1024, name: 'tablet-768' },
    { w: 1024, h: 768, name: 'laptop-1024' },
    { w: 1366, h: 768, name: 'laptop-1366' },
    { w: 1440, h: 900, name: 'desktop-1440' },
  ]

  console.log('\n======================================================')
  console.log('KIỂM TRA TRÀN NGANG CHUẨN XÁC (STRICT HORIZONTAL OVERFLOW)')
  console.log('======================================================')

  let hasAnyOverflow = false

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
          const targetWidth = ${vp.w};
          const maxScroll = Math.max(bodyWidth, htmlWidth);
          const hasOverflow = maxScroll > targetWidth;

          let offenders = [];
          if (hasOverflow) {
            const allElements = Array.from(document.querySelectorAll('*'));
            offenders = allElements
              .filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.right > targetWidth + 1;
              })
              .map(el => ({
                tag: el.tagName.toLowerCase(),
                id: el.id,
                className: el.className ? String(el.className).substring(0, 50) : '',
                right: Math.round(el.getBoundingClientRect().right),
                width: Math.round(el.getBoundingClientRect().width)
              }))
              .slice(0, 5);
          }

          return {
            targetWidth,
            bodyWidth,
            htmlWidth,
            hasOverflow,
            offenders
          };
        })()
      `,
      returnByValue: true,
    })

    const data = evalResult.result.value
    if (data.hasOverflow) {
      hasAnyOverflow = true
      console.log(`[FAIL] Viewport ${vp.w}px (${vp.name}): target=${data.targetWidth}px, body=${data.bodyWidth}px, html=${data.htmlWidth}px (Tràn ${data.htmlWidth - data.targetWidth}px)`)
      console.log('       Phần tử gây tràn:', JSON.stringify(data.offenders, null, 2))
    } else {
      console.log(`[PASS] Viewport ${vp.w}px (${vp.name}): scrollWidth=${data.htmlWidth}px <= ${vp.w}px (Hoàn toàn khớp)`)
    }
  }

  if (hasAnyOverflow) {
    console.error('\n[CẢNH BÁO LỚN] Phát hiện tràn ngang trên một hoặc nhiều viewport!')
  } else {
    console.log('\n[TUYỆT VỜI] 100% Viewport từ 320px đến 1440px không bị tràn ngang!')
  }

  // 2. Kiểm tra Drawer unmount & body overflow khi resize màn hình
  console.log('\n======================================================')
  console.log('KIỂM TRA DRAWER UNMOUNT & BODY OVERFLOW TRÊN RESIZE')
  console.log('======================================================')

  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  })
  await send('Page.navigate', { url: 'http://localhost:4173/' })
  await new Promise((r) => setTimeout(r, 1000))

  // Mở drawer
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('button[aria-controls="mobile-nav-dialog"]');
        if (btn) btn.click();
      })()
    `,
  })
  await new Promise((r) => setTimeout(r, 400))

  const drawerOpenState = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const dialog = document.getElementById('mobile-nav-dialog');
        const bodyOverflow = document.body.style.overflow;
        return { isDialogPresent: !!dialog, bodyOverflow };
      })()
    `,
    returnByValue: true,
  })
  console.log('Trạng thái sau khi mở drawer:', drawerOpenState.result.value)

  // Resize lên desktop 1024px
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1024,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await new Promise((r) => setTimeout(r, 500))

  const drawerAfterResize = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const dialog = document.getElementById('mobile-nav-dialog');
        const bodyOverflow = document.body.style.overflow;
        return { isDialogPresent: !!dialog, bodyOverflow };
      })()
    `,
    returnByValue: true,
  })
  console.log('Trạng thái sau khi resize lên 1024px:', drawerAfterResize.result.value)
  if (!drawerAfterResize.result.value.isDialogPresent && drawerAfterResize.result.value.bodyOverflow !== 'hidden') {
    console.log('[PASS] Drawer tự động unmount và body overflow được phục hồi!')
  } else {
    console.log('[FAIL] Drawer chưa được unmount đúng cách hoặc body overflow còn kẹt hidden')
  }

  // 3. Chụp ảnh kiểm thử
  console.log('\n======================================================')
  console.log('CHỤP ẢNH GIAO DIỆN KIỂM THỬ ĐÃ SỬA')
  console.log('======================================================')

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
    const buf = Buffer.from(data, 'base64')
    fs.writeFileSync(path.join(outputDir, filename), buf)
    try {
      fs.writeFileSync(path.join(brainDir, filename), buf)
    } catch {
      // Ignore if brainDir write fails
    }
    console.log(`Đã lưu ảnh chụp: ${filename}`)
  }

  // 320px
  await capture('m2b-mobile-320.png', 320, 568)

  // 390px
  await capture('m2b-mobile-390.png', 390, 844)

  // 768px
  await capture('m2b-tablet-768.png', 768, 1024)

  // 1366px
  await capture('m2b-laptop-1366.png', 1366, 768)

  // 1440px Hero
  await capture('m2b-sec1-hero-1440.png', 1440, 900)

  // 1440px Booking & Contact
  await capture('m2b-sec6-booking-1440.png', 1440, 900, async (sendFn) => {
    await sendFn('Runtime.evaluate', {
      expression: `document.getElementById('dat-lich-va-lien-he')?.scrollIntoView({ behavior: 'instant' });`,
    })
  })

  ws.close()
  console.log('\nHoàn tất toàn bộ chuỗi kiểm thử!')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
