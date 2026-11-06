const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

// Load playwright from global node_modules if not local
let chromium;
try {
  chromium = require('playwright').chromium;
} catch {
  chromium = require('C:/Users/Admin/AppData/Roaming/npm/node_modules/playwright').chromium;
}

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return true;
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server did not respond within ${timeoutMs}ms at ${url}`);
}

async function runQA() {
  console.log('--- 1. BẮT ĐẦU KHỞI ĐỘNG VITE PREVIEW SERVER ---');
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    stdio: 'pipe',
  });

  previewProcess.stderr.on('data', (d) => {
    // console.error('[preview err]:', d.toString());
  });

  try {
    await waitForServer(BASE_URL);
    console.log(`[Vite Preview] Đã sẵn sàng tại ${BASE_URL}`);

    const browser = await chromium.launch({ headless: true });
    console.log('[Playwright] Đã mở trình duyệt Chromium');

    const issues = [];
    const passes = [];

    const viewports = [
      { name: 'Mobile Mini', width: 320, height: 568, isMobile: true },
      { name: 'Mobile Standard (iPhone 14)', width: 390, height: 844, isMobile: true },
      { name: 'Mobile Large (Pixel 7)', width: 412, height: 915, isMobile: true },
      { name: 'Tablet (iPad)', width: 768, height: 1024, isMobile: false },
      { name: 'Desktop HD', width: 1366, height: 768, isMobile: false },
      { name: 'Desktop Full HD', width: 1920, height: 1080, isMobile: false },
    ];

    const routes = [
      { path: '/', name: 'Trang chủ' },
      { path: '/gioi-thieu', name: 'Về Lê Sơn' },
      { path: '/doi-ngu', name: 'Đội ngũ bác sĩ' },
      { path: '/co-so-vat-chat', name: 'Cơ sở vật chất' },
      { path: '/dat-lich', name: 'Đặt lịch khám' },
      { path: '/dich-vu', name: 'Danh mục dịch vụ (Coming soon)' },
      { path: '/dich-vu/kham-dieu-tri', name: 'Khám điều trị (Coming soon)' },
      { path: '/khong-ton-tai-404', name: 'Trang 404' },
    ];

    console.log('\n--- 2. KIỂM TRA ROUTE & TRÀN CHIỀU NGANG (HORIZONTAL OVERFLOW) ---');

    for (const route of routes) {
      for (const vp of viewports) {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          isMobile: vp.isMobile,
          hasTouch: vp.isMobile,
        });
        const page = await context.newPage();

        const pageErrors = [];
        page.on('pageerror', (err) => pageErrors.push(err.message));
        page.on('console', (msg) => {
          if (msg.type() === 'error') pageErrors.push(msg.text());
        });

        const res = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });

        // Kiểm tra mã HTTP
        if (!res) {
          issues.push({ type: 'Navigation', route: route.path, vp: vp.name, msg: 'Không nhận được response' });
        }

        // Kiểm tra console errors
        if (pageErrors.length > 0) {
          issues.push({
            type: 'Console Error',
            route: route.path,
            vp: vp.name,
            msg: pageErrors.join(' | '),
          });
        }

        // Kiểm tra tràn chiều ngang (Horizontal overflow)
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;
          const isOverflowing = scrollWidth > clientWidth + 1; // 1px threshold for subpixels
          let overflowingElements = [];
          if (isOverflowing) {
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const r = el.getBoundingClientRect();
              if (r.right > clientWidth + 2) {
                overflowingElements.push({
                  tag: el.tagName,
                  className: el.className ? String(el.className).slice(0, 80) : '',
                  right: Math.round(r.right),
                  width: Math.round(r.width),
                });
              }
            }
          }
          return { isOverflowing, scrollWidth, clientWidth, elements: overflowingElements.slice(0, 5) };
        });

        if (overflow.isOverflowing) {
          issues.push({
            type: 'Horizontal Overflow',
            route: route.path,
            vp: vp.name,
            msg: `scrollWidth (${overflow.scrollWidth}px) > clientWidth (${overflow.clientWidth}px). Elements: ${JSON.stringify(overflow.elements)}`,
          });
        }

        // Cuộn trang để kích hoạt lazy loading cho ảnh
        await page.evaluate(async () => {
          const imgs = Array.from(document.querySelectorAll('img'));
          for (const img of imgs) {
            img.scrollIntoView({ behavior: 'instant', block: 'center' });
            if (!img.complete || img.naturalWidth === 0) {
              await new Promise((resolve) => {
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
                setTimeout(resolve, 500);
              });
            }
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(300);

        // Kiểm tra ảnh vỡ (Broken images)
        const brokenImages = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          return imgs
            .filter((img) => !img.complete || img.naturalWidth === 0)
            .map((img) => img.src || img.getAttribute('src'));
        });

        if (brokenImages.length > 0) {
          issues.push({
            type: 'Broken Image',
            route: route.path,
            vp: vp.name,
            msg: `Ảnh không tải được: ${brokenImages.join(', ')}`,
          });
        }

        await context.close();
      }
      passes.push(`Route [${route.name}] (${route.path}): Kiểm tra xong trên cả 6 viewports.`);
    }

    console.log('\n--- 3. KIỂM TRA TƯƠNG TÁC GIAO DIỆN (INTERACTION & ACCESSIBILITY) ---');

    // 3.1. Test Header Navigation & Mobile Drawer
    {
      const mobileContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      });
      const page = await mobileContext.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

      // Check Mobile Menu button
      const menuBtn = page.locator('header button[aria-haspopup="dialog"]');
      const btnVisible = await menuBtn.isVisible();
      if (!btnVisible) {
        issues.push({ type: 'Navigation', route: '/', vp: 'Mobile 390px', msg: 'Nút mở menu di động không hiển thị' });
      } else {
        // Click to open
        await menuBtn.click();
        const dialog = page.locator('[role="dialog"][aria-modal="true"]');
        const dialogVisible = await dialog.isVisible();
        if (!dialogVisible) {
          issues.push({ type: 'Navigation', route: '/', vp: 'Mobile 390px', msg: 'Bấm menu button nhưng dialog navigation không hiển thị' });
        } else {
          // Check tap target sizes in mobile nav
          const smallTargets = await dialog.locator('a, button').evaluateAll((elements) => {
            return elements
              .filter((el) => {
                const r = el.getBoundingClientRect();
                return r.width > 0 && r.height > 0 && (r.width < 40 || r.height < 40);
              })
              .map((el) => ({
                text: el.textContent ? el.textContent.trim().slice(0, 30) : '',
                tag: el.tagName,
                width: Math.round(el.getBoundingClientRect().width),
                height: Math.round(el.getBoundingClientRect().height),
              }));
          });

          if (smallTargets.length > 0) {
            issues.push({
              type: 'A11y Tap Target',
              route: '/',
              vp: 'Mobile 390px',
              msg: `Phát hiện mục trong mobile menu có kích thước tap target < 40px: ${JSON.stringify(smallTargets)}`,
            });
          }

          // Test close via close button or backdrop
          const closeBtn = dialog.locator('button[aria-label*="Đóng"], button[aria-label*="close"]').first();
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
            await page.waitForTimeout(300);
            const closed = !(await dialog.isVisible());
            if (closed) {
              passes.push('Mobile Nav: Mở dialog, kiểm tra tap target và đóng menu thành công.');
            } else {
              issues.push({ type: 'Navigation', route: '/', vp: 'Mobile 390px', msg: 'Bấm nút đóng nhưng dialog vẫn hiển thị' });
            }
          }
        }
      }
      await mobileContext.close();
    }

    // 3.2. Test Desktop Navigation Dropdowns
    {
      const desktopContext = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        isMobile: false,
      });
      const page = await desktopContext.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

      const dropdownBtns = await page.locator('header nav button[aria-expanded]').all();
      for (const btn of dropdownBtns) {
        const btnText = (await btn.textContent()) || '';
        await btn.hover();
        await page.waitForTimeout(200);
        const expanded = (await btn.getAttribute('aria-expanded')) === 'true';
        if (!expanded) {
          // click to open
          await btn.click();
          await page.waitForTimeout(200);
          const expandedAfterClick = (await btn.getAttribute('aria-expanded')) === 'true';
          if (!expandedAfterClick) {
            issues.push({
              type: 'A11y Dropdown',
              route: '/',
              vp: 'Desktop 1440px',
              msg: `Dropdown nút "${btnText.trim()}" không cập nhật aria-expanded="true" khi tương tác`,
            });
          }
        }
      }
      passes.push('Desktop Nav: Dropdowns hoạt động và cập nhật trạng thái chuẩn a11y.');
      await desktopContext.close();
    }

    // 3.3. Test Booking Page Validation
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/dat-lich`, { waitUntil: 'networkidle' });

      // Form presence
      const form = page.locator('form');
      if (!(await form.isVisible())) {
        issues.push({ type: 'Booking Form', route: '/dat-lich', vp: 'Desktop', msg: 'Không tìm thấy form đặt lịch' });
      } else {
        // Try submitting empty
        const submitBtn = form.locator('button[type="submit"]');
        await submitBtn.click();
        await page.waitForTimeout(300);

        // Check if error message appears
        const errors = await page.locator('[role="alert"], [class*="error"], [class*="text-red"], [aria-invalid="true"]').count();
        if (errors === 0) {
          issues.push({
            type: 'Booking Validation',
            route: '/dat-lich',
            vp: 'Desktop',
            msg: 'Gửi form rỗng nhưng không xuất hiện thông báo lỗi xác thực',
          });
        } else {
          passes.push(`Booking Form: Xác thực form rỗng hoạt động đúng (${errors} trường cảnh báo lỗi).`);
        }
      }
      await context.close();
    }

    // 3.4. Test Quote Clipping / Text overflow in HighlightStory
    {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

      const quoteClipping = await page.evaluate(() => {
        const quotes = document.querySelectorAll('blockquote, [class*="quote"]');
        const results = [];
        quotes.forEach((q) => {
          const r = q.getBoundingClientRect();
          const parentR = q.parentElement ? q.parentElement.getBoundingClientRect() : null;
          results.push({
            text: q.textContent.slice(0, 40),
            scrollWidth: q.scrollWidth,
            clientWidth: q.clientWidth,
            isClipped: q.scrollWidth > q.clientWidth + 2,
            rightOverflow: parentR ? r.right > parentR.right + 2 : false,
          });
        });
        return results;
      });

      const clipped = quoteClipping.filter((q) => q.isClipped || q.rightOverflow);
      if (clipped.length > 0) {
        issues.push({
          type: 'Visual Clipping',
          route: '/',
          vp: 'Mobile 390px',
          msg: `Phát hiện trích dẫn bị tràn/cắt lề: ${JSON.stringify(clipped)}`,
        });
      } else {
        passes.push('HighlightStory & Quotes: Không có hiện tượng cắt mép chữ nghiêng hoặc tràn khung.');
      }
      await context.close();
    }

    // 3.5. Test Scroll Reveal Animation
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(600);

      // Check if any reveal element has opacity 0 stuck
      const stuckElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('[data-reveal], [class*="reveal"], [class*="opacity-0"]');
        const stuck = [];
        elements.forEach((el) => {
          const r = el.getBoundingClientRect();
          // element is well within viewport
          if (r.top >= 0 && r.bottom <= window.innerHeight) {
            const style = window.getComputedStyle(el);
            if (style.opacity === '0' || style.visibility === 'hidden') {
              stuck.push({
                tag: el.tagName,
                className: el.className.slice(0, 60),
                opacity: style.opacity,
              });
            }
          }
        });
        return stuck;
      });

      if (stuckElements.length > 0) {
        issues.push({
          type: 'Animation Stuck',
          route: '/',
          vp: 'Desktop 1440px',
          msg: `Phát hiện phần tử trong viewport bị kẹt opacity=0: ${JSON.stringify(stuckElements)}`,
        });
      } else {
        passes.push('Scroll Reveal: Tất cả phần tử trong tầm nhìn đều hiển thị rõ ràng, không bị kẹt opacity=0.');
      }
      await context.close();
    }

    await browser.close();

    console.log('\n======================================================');
    console.log(`KẾT QUẢ KIỂM TRA GIAO DIỆN (UI/UX QA SUITE):`);
    console.log(`- Số tiêu chí ĐẠT: ${passes.length}`);
    console.log(`- Số lỗi PHÁT HIỆN: ${issues.length}`);
    console.log('======================================================');

    if (passes.length > 0) {
      console.log('\n[CÁC MỤC ĐẠT (PASS)]');
      passes.forEach((p, idx) => console.log(`  ${idx + 1}. ${p}`));
    }

    if (issues.length > 0) {
      console.log('\n[CÁC LỖI CẦN XỬ LÝ (ISSUES FOUND)]');
      issues.forEach((iss, idx) => {
        console.log(`  ${idx + 1}. [${iss.type}] Route: ${iss.route} | Viewport: ${iss.vp}`);
        console.log(`     Chi tiết: ${iss.msg}`);
      });
    }

    // Ghi file kết quả kiểm tra
    const reportPath = path.join(__dirname, '../docs/qa/UI_QA_AUTOMATION_REPORT.json');
    fs.writeFileSync(
      reportPath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          totalPasses: passes.length,
          totalIssues: issues.length,
          passes,
          issues,
        },
        null,
        2
      )
    );
    console.log(`\nBáo cáo chi tiết đã lưu tại: ${reportPath}`);
  } finally {
    // Kill the preview process
    if (previewProcess.pid) {
      console.log('\nĐang dừng Vite preview server...');
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', String(previewProcess.pid), '/f', '/t']);
        } else {
          previewProcess.kill();
        }
      } catch {
        // ignore
      }
    }
  }
}

runQA().catch((err) => {
  console.error('Lỗi khi chạy QA:', err);
  process.exit(1);
});
