import fs from 'node:fs'
import path from 'node:path'

async function run() {
  const outputDir = path.resolve('screenshots')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Lấy danh sách targets từ Chrome
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

  async function capture(filename, width, height, url, setupFn = null) {
    console.log(`Capturing ${filename} (${width}x${height}) at ${url}...`)
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768,
    })

    await send('Page.navigate', { url })
    // Đợi tải trang
    await new Promise((r) => setTimeout(r, 1200))

    if (setupFn) {
      await setupFn(send)
      await new Promise((r) => setTimeout(r, 600))
    }

    const { data } = await send('Page.captureScreenshot', { format: 'png' })
    const filePath = path.join(outputDir, filename)
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'))
    console.log(`Saved: ${filePath} (${data.length} chars)`)
  }

  // 1. Header Desktop 1440px
  await capture('header-desktop-1440.png', 1440, 900, 'http://localhost:4173/')

  // 2. Header Laptop 1366px
  await capture('header-laptop-1366.png', 1366, 768, 'http://localhost:4173/')

  // 3. Mobile Menu 390px (Mở drawer)
  await capture('mobile-menu-390.png', 390, 844, 'http://localhost:4173/', async (sendFn) => {
    // Click vào hamburger button
    await sendFn('Runtime.evaluate', {
      expression: `
        const btn = document.querySelector('button[aria-label="Mở menu điều hướng trên thiết bị di động"]');
        if (btn) btn.click();
      `,
    })
  })

  // 4. Footer Desktop 1440px
  await capture('footer-desktop.png', 1440, 900, 'http://localhost:4173/', async (sendFn) => {
    await sendFn('Runtime.evaluate', {
      expression: `window.scrollTo(0, document.body.scrollHeight);`,
    })
  })

  // 5. Footer Mobile 390px
  await capture('footer-mobile.png', 390, 844, 'http://localhost:4173/', async (sendFn) => {
    await sendFn('Runtime.evaluate', {
      expression: `window.scrollTo(0, document.body.scrollHeight);`,
    })
  })

  // 6. Trang Coming Soon
  await capture('coming-soon.png', 1440, 900, 'http://localhost:4173/gioi-thieu')

  ws.close()
  console.log('All screenshots captured successfully!')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
