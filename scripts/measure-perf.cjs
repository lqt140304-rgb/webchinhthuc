const { chromium } = require('playwright');

async function measureMobile(url, runs = 3) {
  console.log(`\n=== Measuring Mobile (${url}) over ${runs} runs ===`);
  const results = [];
  const browser = await chromium.launch();

  for (let i = 1; i <= runs; i++) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
    });
    const page = await context.newPage();

    // Emulate 4G network via Chrome DevTools Protocol (CDP)
    // 4G: 150ms RTT latency, 1.6 Mbps download (200 KB/s), 750 Kbps upload
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150, // ms
      downloadThroughput: (1.6 * 1024 * 1024) / 8, // 1.6 Mbps
      uploadThroughput: (750 * 1024) / 8 // 750 Kbps
    });
    // Emulate 4x CPU slowdown (mobile CPU)
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

    await page.goto(url, { waitUntil: 'networkidle' });
    // Allow paint entries to settle
    await page.waitForTimeout(1000);

    const metrics = await page.evaluate(() => {
      let fcp = 0;
      let lcp = 0;
      let lcpElement = '';

      const paintEntries = performance.getEntriesByType('paint');
      for (const p of paintEntries) {
        if (p.name === 'first-contentful-paint') fcp = p.startTime;
      }

      // Check buffered LCP via PerformanceObserver or entries
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            const last = entries[entries.length - 1];
            lcp = last.startTime;
            lcpElement = last.element ? (last.element.tagName + ' ' + (last.element.src || last.element.className || '')) : (last.id || last.url || '');
          }
          resolve({ fcp, lcp, lcpElement });
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // Fallback resolve after 500ms if no LCP observer event
        setTimeout(() => {
          resolve({ fcp, lcp, lcpElement });
        }, 500);
      });
    });

    console.log(`Run ${i} Mobile (Throttled 4G + 4x CPU): FCP = ${metrics.fcp.toFixed(0)}ms, LCP = ${metrics.lcp.toFixed(0)}ms | LCP Element: ${metrics.lcpElement.slice(0, 60)}`);
    results.push(metrics);
    await context.close();
  }

  await browser.close();

  results.sort((a, b) => a.lcp - b.lcp);
  const median = results[Math.floor(results.length / 2)];
  console.log(`--> Median Mobile: FCP = ${median.fcp.toFixed(0)}ms, LCP = ${median.lcp.toFixed(0)}ms (${(median.lcp / 1000).toFixed(2)}s)`);
  return median;
}

async function measureDesktop(url, runs = 3) {
  console.log(`\n=== Measuring Desktop (${url}) over ${runs} runs ===`);
  const results = [];
  const browser = await chromium.launch();

  for (let i = 1; i <= runs; i++) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      isMobile: false
    });
    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const metrics = await page.evaluate(() => {
      let fcp = 0;
      let lcp = 0;
      let lcpElement = '';

      const paintEntries = performance.getEntriesByType('paint');
      for (const p of paintEntries) {
        if (p.name === 'first-contentful-paint') fcp = p.startTime;
      }

      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            const last = entries[entries.length - 1];
            lcp = last.startTime;
            lcpElement = last.element ? (last.element.tagName + ' ' + (last.element.src || last.element.className || '')) : (last.id || last.url || '');
          }
          resolve({ fcp, lcp, lcpElement });
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        setTimeout(() => {
          resolve({ fcp, lcp, lcpElement });
        }, 500);
      });
    });

    console.log(`Run ${i} Desktop: FCP = ${metrics.fcp.toFixed(0)}ms, LCP = ${metrics.lcp.toFixed(0)}ms | LCP Element: ${metrics.lcpElement.slice(0, 60)}`);
    results.push(metrics);
    await context.close();
  }

  await browser.close();

  results.sort((a, b) => a.lcp - b.lcp);
  const median = results[Math.floor(results.length / 2)];
  console.log(`--> Median Desktop: FCP = ${median.fcp.toFixed(0)}ms, LCP = ${median.lcp.toFixed(0)}ms (${(median.lcp / 1000).toFixed(2)}s)`);
  return median;
}

async function run() {
  const url = process.env.BASE_URL || 'http://localhost:4173';
  await measureMobile(url, 3);
  await measureDesktop(url, 3);
}

run().catch(console.error);
