const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const EVIDENCE_DIR = process.env.TEST_OUTPUT_DIR || path.join(__dirname, '..', '..', 'e2e-evidence', '2b-run');
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

function waitServer(url, timeout = 10000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      http.get(url, (_res) => {
        resolve();
      }).on('error', () => {
        if (Date.now() - start > timeout) {
          reject(new Error('Server timeout waiting for ' + url));
        } else {
          setTimeout(check, 200);
        }
      });
    }
    check();
  });
}

const VIEWPORTS = [
  { width: 320, height: 568, name: '320' },
  { width: 360, height: 640, name: '360' },
  { width: 390, height: 844, name: '390' },
  { width: 768, height: 1024, name: '768' },
  { width: 1366, height: 768, name: '1366' },
  { width: 1440, height: 900, name: '1440' },
  { width: 1920, height: 1080, name: '1920' },
];

async function run() {
  const logEntries = [];
  function log(msg) {
    console.log(msg);
    logEntries.push(msg);
  }

  log('=== BẮT ĐẦU KIỂM TRA TOÀN DIỆN MỐC 2B (B01, B02, B04) ===');
  log(`Thời gian: ${new Date().toISOString()}`);

  const preview = spawn('cmd.exe', ['/c', 'npm.cmd run preview -- --port 4173'], {
    cwd: path.join(__dirname, '..', '..'),
    stdio: 'ignore',
  });

  let browser;
  try {
    await waitServer('http://localhost:4173');
    log('Server Vite preview đã sẵn sàng trên cổng 4173.');

    browser = await chromium.launch({ headless: true });

    // 1. Kiểm tra 7 Viewports và tràn ngang cho HomePage
    log('\n--- 1. Kiểm tra Responsive 7 Viewports trên Trang chủ (/) ---');
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', (err) => consoleErrors.push(err.message));

      await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      });

      assert.strictEqual(overflow, false, `Trang chủ bị tràn ngang ở viewport ${vp.name}px`);
      assert.strictEqual(consoleErrors.length, 0, `Lỗi console ở viewport ${vp.name}px: ${consoleErrors.join(', ')}`);

      const screenshotPath = path.join(EVIDENCE_DIR, `home-${vp.name}px.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      log(`  ✓ Viewport ${vp.name}px (${vp.width}x${vp.height}): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: home-${vp.name}px.png)`);

      await context.close();
    }

    // 2. Kiểm tra Section 6 trên Trang chủ (B01 & B02)
    log('\n--- 2. Kiểm tra Section 6 trên Trang chủ (B01 & B02) ---');
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

      const sec6 = page.locator('#dat-lich-va-lien-he');
      await assert.doesNotReject(sec6.waitFor({ state: 'visible' }), 'Không tìm thấy Section 6 #dat-lich-va-lien-he');

      // B01: Không được có thẻ <form> trong Section 6 trang chủ
      const formCount = await sec6.locator('form').count();
      assert.strictEqual(formCount, 0, 'Section 6 trang chủ không được chứa form đầy đủ (B01)');
      log('  ✓ B01: Section 6 trang chủ KHÔNG chứa form đầy đủ (0 <form>).');

      // B01: Phải có CTA dẫn sang /dat-lich
      const ctaBooking = sec6.locator('a[href="/dat-lich"]');
      assert.ok((await ctaBooking.count()) >= 1, 'Section 6 thiếu CTA link tới /dat-lich');
      const ctaText = await ctaBooking.first().textContent();
      log(`  ✓ B01: Có CTA dẫn sang /dat-lich: "${ctaText.trim()}"`);

      // B01: Có Hotline và địa chỉ đã xác minh
      const sec6Text = await sec6.textContent();
      assert.ok(sec6Text.includes('101 Khuất Duy Tiến, Thanh Xuân, Hà Nội'), 'Thiếu địa chỉ 101 Khuất Duy Tiến');
      assert.ok(sec6Text.includes('097 355 51 05'), 'Thiếu hotline 097 355 51 05');
      assert.ok(sec6Text.includes('08:00') && sec6Text.includes('21:00'), 'Thiếu giờ làm việc 08:00 - 21:00');
      assert.ok(sec6Text.includes('24/24'), 'Thiếu cấp cứu 24/24');
      log('  ✓ B01: Đầy đủ địa chỉ, hotline, giờ khám tham chiếu và cấp cứu 24/24.');

      // B02: Rà soát không chứa cam kết "ngày lễ" chưa xác minh
      assert.strictEqual(sec6Text.includes('ngày lễ'), false, 'Section 6 còn chứa cam kết "ngày lễ" chưa xác minh (B02)');
      log('  ✓ B02: Đã loại bỏ cam kết "ngày lễ" chưa xác minh khỏi Section 6.');

      await context.close();
    }

    // 3. Kiểm tra 7 Viewports và tràn ngang cho BookingPage (/dat-lich)
    log('\n--- 3. Kiểm tra Responsive 7 Viewports trên Trang Đặt Lịch (/dat-lich) ---');
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', (err) => consoleErrors.push(err.message));

      await page.goto('http://localhost:4173/dat-lich', { waitUntil: 'networkidle' });

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      });

      assert.strictEqual(overflow, false, `Trang /dat-lich bị tràn ngang ở viewport ${vp.name}px`);
      assert.strictEqual(consoleErrors.length, 0, `Lỗi console ở /dat-lich viewport ${vp.name}px: ${consoleErrors.join(', ')}`);

      const screenshotPath = path.join(EVIDENCE_DIR, `booking-${vp.name}px.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      log(`  ✓ Viewport ${vp.name}px (${vp.width}x${vp.height}): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: booking-${vp.name}px.png)`);

      await context.close();
    }

    // 4. Kiểm tra tương tác Biểu Mẫu Đặt Lịch Chi Tiết trên /dat-lich (B01)
    log('\n--- 4. Kiểm tra Biểu Mẫu BookingFormData & Trạng thái Thử Nghiệm (/dat-lich) ---');
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto('http://localhost:4173/dat-lich', { waitUntil: 'networkidle' });

      // Kiểm tra banner minh bạch
      const noticeText = await page.locator('text=Thông Báo Minh Bạch — Giao Diện Thử Nghiệm').textContent();
      assert.ok(noticeText, 'Thiếu banner thông báo minh bạch trên /dat-lich');
      log('  ✓ B01: Có banner thông báo minh bạch giao diện thử nghiệm, chưa kết nối DB.');

      // Kiểm tra các trường BookingFormData
      assert.ok(await page.locator('#owner-name').isVisible(), 'Thiếu input #owner-name');
      assert.ok(await page.locator('#owner-phone').isVisible(), 'Thiếu input #owner-phone');
      assert.ok(await page.locator('#pet-name').isVisible(), 'Thiếu input #pet-name');
      assert.ok(await page.locator('#pet-type').isVisible(), 'Thiếu select #pet-type');
      assert.ok(await page.locator('#service-type').isVisible(), 'Thiếu select #service-type');
      assert.ok(await page.locator('#preferred-date').isVisible(), 'Thiếu input #preferred-date');
      assert.ok(await page.locator('#preferred-timeslot').isVisible(), 'Thiếu select #preferred-timeslot');
      assert.ok(await page.locator('#symptoms-note').isVisible(), 'Thiếu textarea #symptoms-note');
      log('  ✓ B01: Đầy đủ 8 trường dữ liệu theo đặc tả BookingFormData.');

      // Thử submit form rỗng để kiểm tra client validation
      await page.locator('button[type="submit"]').click();
      const hasErrors = await page.locator('#owner-name-error, #owner-phone-error, #pet-name-error, #preferred-date-error').count();
      assert.ok(hasErrors >= 3, 'Client validation không bắt lỗi khi form rỗng');
      log(`  ✓ Client validation hoạt động chuẩn: bắt lỗi khi bỏ trống các trường bắt buộc (${hasErrors} thông báo lỗi).`);

      // Điền thông tin kiểm thử hợp lệ
      await page.fill('#owner-name', 'Nguyễn Hoàng Nam');
      await page.fill('#owner-phone', '0987654321');
      await page.fill('#pet-name', 'Bông');
      await page.selectOption('#pet-type', 'chó');
      await page.selectOption('#service-type', 'kham-tong-quat');
      await page.fill('#preferred-date', '2026-11-01');
      await page.selectOption('#preferred-timeslot', 'sang');
      await page.fill('#symptoms-note', 'Kiểm tra tổng quát và tư vấn tiêm phòng định kỳ.');

      // Submit form
      await page.locator('button[type="submit"]').click();

      // Chờ panel kết quả thử nghiệm
      await page.waitForSelector('text=Kiểm Thử Giao Diện Thành Công', { timeout: 5000 });
      const completedPanel = page.locator('text=Đã kiểm tra hợp lệ dữ liệu mẫu!');
      assert.ok(await completedPanel.isVisible(), 'Thiếu thông báo hoàn tất kiểm thử giao diện');

      // Xác nhận tính minh bạch: KHÔNG báo tạo lịch hẹn thật thành công
      const panelContent = await page.locator('#main-content').textContent();
      assert.ok(panelContent.includes('Chưa kết nối máy chủ'), 'Thiếu cảnh báo chưa kết nối máy chủ');
      assert.ok(panelContent.includes('chưa được gửi vào cơ sở dữ liệu thật'), 'Thiếu thông báo chưa gửi vào DB');
      assert.ok(panelContent.includes('chưa hình thành lịch hẹn có hiệu lực'), 'Thiếu thông báo chưa tạo lịch hẹn');
      assert.ok(panelContent.includes('Gọi hotline đặt thật: 097 355 51 05'), 'Thiếu CTA gọi hotline');
      log('  ✓ B01: Panel kết quả hoàn toàn minh bạch, không gửi dữ liệu thật, không tạo thành công giả, có CTA gọi hotline.');

      // Thử bấm "Thử lại biểu mẫu"
      await page.locator('button:has-text("Thử lại biểu mẫu")').click();
      assert.ok(await page.locator('#owner-name').isVisible(), 'Không quay lại được form khi bấm thử lại');
      log('  ✓ B01: Nút "Thử lại biểu mẫu" hoạt động chính xác, cho phép thử lại.');

      await context.close();
    }

    log('\n=== TẤT CẢ CÁC BÀI KIỂM TRA MỐC 2B ĐỀU ĐẠT (100% PASS) ===\n');
    fs.writeFileSync(path.join(EVIDENCE_DIR, '2b-verification-results.txt'), logEntries.join('\n'), 'utf8');

  } finally {
    if (browser) await browser.close();
    try {
      spawn('taskkill', ['/pid', preview.pid, '/f', '/t']);
    } catch {}
  }
}

run().catch((err) => {
  console.error('LỖI KIỂM TRA:', err);
  process.exit(1);
});
