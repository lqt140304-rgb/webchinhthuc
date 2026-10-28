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

let previewProcess = null;

function killProcess(proc) {
  if (!proc || proc.killed) return;
  try {
    if (process.platform === 'win32') {
      try {
        const { execSync } = require('child_process');
        execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' });
      } catch {
        proc.kill('SIGKILL');
      }
    } else {
      proc.kill('SIGTERM');
      setTimeout(() => {
        try {
          if (!proc.killed) proc.kill('SIGKILL');
        } catch {}
      }, 500);
    }
  } catch {
    try {
      proc.kill();
    } catch {}
  }
}

function cleanup() {
  if (previewProcess) {
    killProcess(previewProcess);
    previewProcess = null;
  }
}

process.on('SIGINT', () => { cleanup(); process.exit(130); });
process.on('SIGTERM', () => { cleanup(); process.exit(143); });
process.on('exit', () => { cleanup(); });

async function run() {
  const logEntries = [];
  function log(msg) {
    console.log(msg);
    logEntries.push(msg);
  }

  log('=== BẮT ĐẦU KIỂM TRA TOÀN DIỆN MỐC 2B (B01, B02, B04) ===');
  log(`Thời gian: ${new Date().toISOString()}`);

  const previewScript = path.join(__dirname, '..', '..', 'scripts', 'preview-server.cjs');
  const preview = spawn(process.execPath, [previewScript, '--port', '4173'], {
    cwd: path.join(__dirname, '..', '..'),
    stdio: 'ignore',
  });
  previewProcess = preview;

  let browser;
  try {
    await waitServer('http://localhost:4173');
    log('Server preview đã sẵn sàng trên cổng 4173.');

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

      // A. Banner đặt lịch (khớp chính xác 100% baseline 3A BookingPage.tsx)
      const bannerTitle = page.locator('strong:has-text("Thông Báo Minh Bạch — Giao Diện Đang Trong Giai Đoạn Thử Nghiệm")');
      await assert.doesNotReject(bannerTitle.waitFor({ state: 'visible' }), 'Thiếu tiêu đề banner thông báo minh bạch trên /dat-lich');

      const bannerDesc = page.locator('text=Biểu mẫu dưới đây đang trong giai đoạn thử nghiệm giao diện. Bệnh viện chưa tiếp nhận thông tin đăng ký tự động qua website.');
      assert.ok(await bannerDesc.isVisible(), 'Thiếu nội dung mô tả banner thử nghiệm');

      const bannerCallout = page.locator('text=Để đặt hẹn khám có hiệu lực ngay, xin quý khách vui lòng liên hệ trực tiếp hotline:');
      assert.ok(await bannerCallout.isVisible(), 'Thiếu thông tin hướng dẫn hotline trong banner');

      const bannerHotlineLink = page.locator('div.rounded-2xl.bg-amber-50 a[href="tel:0973555105"]');
      assert.ok(await bannerHotlineLink.isVisible(), 'Thiếu liên kết hotline tel:0973555105 trong banner');
      assert.strictEqual((await bannerHotlineLink.textContent()).trim(), '097 355 51 05', 'Số hotline hiển thị trong banner không khớp');
      log('  ✓ B01: Banner thông báo minh bạch khớp 100% baseline 3A (tiêu đề, nội dung, hotline và href tel).');

      // B. Kiểm tra các trường BookingFormData
      assert.ok(await page.locator('#owner-name').isVisible(), 'Thiếu input #owner-name');
      assert.ok(await page.locator('#owner-phone').isVisible(), 'Thiếu input #owner-phone');
      assert.ok(await page.locator('#pet-name').isVisible(), 'Thiếu input #pet-name');
      assert.ok(await page.locator('#pet-type').isVisible(), 'Thiếu select #pet-type');
      assert.ok(await page.locator('#service-type').isVisible(), 'Thiếu select #service-type');
      assert.ok(await page.locator('#preferred-date').isVisible(), 'Thiếu input #preferred-date');
      assert.ok(await page.locator('#preferred-timeslot').isVisible(), 'Thiếu select #preferred-timeslot');
      assert.ok(await page.locator('#symptoms-note').isVisible(), 'Thiếu textarea #symptoms-note');
      log('  ✓ B01: Đầy đủ 8 trường dữ liệu theo đặc tả BookingFormData.');

      // C. Submit form rỗng để kiểm tra client validation
      await page.locator('button[type="submit"]').click();
      const errorCount = await page.locator('#owner-name-error, #owner-phone-error, #pet-name-error, #preferred-date-error').count();
      assert.strictEqual(errorCount, 4, 'Client validation phải hiển thị đầy đủ 4 thông báo lỗi bắt buộc');
      assert.strictEqual(await page.locator('#owner-name').getAttribute('aria-invalid'), 'true', 'Trường lỗi đầu tiên phải có aria-invalid="true"');
      log(`  ✓ Client validation hoạt động chuẩn: bắt lỗi và hiển thị đầy đủ ${errorCount}/4 thông báo lỗi bắt buộc.`);

      // D. Điền thông tin kiểm thử hợp lệ (ngày động tương lai, chọn option kham-dieu-tri)
      const d = new Date(Date.now() + 864e5 * 3);
      const futureDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      await page.fill('#owner-name', 'Nguyễn Hoàng Nam');
      assert.strictEqual(await page.locator('#owner-name').inputValue(), 'Nguyễn Hoàng Nam');

      await page.fill('#owner-phone', '0987654321');
      assert.strictEqual(await page.locator('#owner-phone').inputValue(), '0987654321');

      await page.fill('#pet-name', 'Bông');
      assert.strictEqual(await page.locator('#pet-name').inputValue(), 'Bông');

      await page.selectOption('#pet-type', 'chó');
      assert.strictEqual(await page.locator('#pet-type').inputValue(), 'chó');

      // Xác minh option kham-dieu-tri tồn tại trong baseline 3A
      const optKhamDieuTri = page.locator('#service-type option[value="kham-dieu-tri"]');
      assert.strictEqual(await optKhamDieuTri.count(), 1, 'Thiếu option kham-dieu-tri trong select #service-type');
      assert.strictEqual((await optKhamDieuTri.textContent()).trim(), 'Khám & điều trị', 'Nội dung option kham-dieu-tri không khớp');
      await page.selectOption('#service-type', 'kham-dieu-tri');
      assert.strictEqual(await page.locator('#service-type').inputValue(), 'kham-dieu-tri', 'Chưa chọn đúng option kham-dieu-tri');

      await page.fill('#preferred-date', futureDate);
      assert.strictEqual(await page.locator('#preferred-date').inputValue(), futureDate, 'Giá trị ngày hẹn #preferred-date không khớp');

      await page.selectOption('#preferred-timeslot', 'sang');
      assert.strictEqual(await page.locator('#preferred-timeslot').inputValue(), 'sang');

      await page.fill('#symptoms-note', 'Kiểm tra tổng quát và tư vấn tiêm phòng định kỳ.');
      assert.strictEqual(await page.locator('#symptoms-note').inputValue(), 'Kiểm tra tổng quát và tư vấn tiêm phòng định kỳ.');
      log('  ✓ B01: Đã điền và xác minh giá trị 8 trường hợp lệ (ngày tương lai động, option kham-dieu-tri).');

      // E. Submit form và xác minh panel kết quả thử nghiệm minh bạch
      await page.locator('button[type="submit"]').click();

      // Chờ panel role="status"
      const statusPanel = page.locator('div[role="status"][aria-live="polite"]');
      await assert.doesNotReject(statusPanel.waitFor({ state: 'visible', timeout: 5000 }), 'Thiếu panel role="status" sau khi submit');

      // 1. Badge Giao Diện Thử Nghiệm
      const badge = statusPanel.locator('span:has-text("Giao Diện Thử Nghiệm")');
      assert.ok(await badge.isVisible(), 'Thiếu badge Giao Diện Thử Nghiệm');

      // 2. Tiêu đề nguyên văn baseline 3A: "Thông tin bạn nhập chưa được gửi đến bệnh viện."
      const panelTitle = statusPanel.locator('h2');
      assert.strictEqual((await panelTitle.textContent()).trim(), 'Thông tin bạn nhập chưa được gửi đến bệnh viện.', 'Tiêu đề thông báo sau gửi không khớp');

      // 3. Nội dung hướng dẫn nguyên văn baseline 3A
      const panelDesc = statusPanel.locator('p:has-text("Để đặt lịch khám, vui lòng gọi")');
      assert.ok(await panelDesc.isVisible(), 'Thiếu đoạn hướng dẫn gọi hotline');
      assert.ok((await panelDesc.textContent()).includes('097 355 51 05'), 'Thiếu hotline 097 355 51 05 trong đoạn hướng dẫn');

      // 4. CTA nút gọi hotline nguyên văn baseline 3A
      const hotlineBtn = statusPanel.locator('a[href="tel:0973555105"]');
      assert.ok(await hotlineBtn.isVisible(), 'Thiếu CTA hotline tel:0973555105');
      assert.strictEqual((await hotlineBtn.textContent()).trim(), 'Gọi hotline: 097 355 51 05', 'Nội dung CTA hotline không khớp');

      // 5. Nút "Thử lại biểu mẫu"
      const retryBtn = statusPanel.locator('button:has-text("Thử lại biểu mẫu")');
      assert.ok(await retryBtn.isVisible(), 'Thiếu nút Thử lại biểu mẫu');
      log('  ✓ B01: Panel kết quả minh bạch 100% khớp baseline 3A (tiêu đề, badge, hotline 097 355 51 05, href tel:0973555105).');

      // F. Thử bấm "Thử lại biểu mẫu" và xác minh quay lại form
      await retryBtn.click();
      assert.ok(await page.locator('#owner-name').isVisible(), 'Không quay lại được form khi bấm thử lại');
      assert.ok(await page.locator('button[type="submit"]').isVisible(), 'Nút submit không hiển thị sau khi thử lại');
      assert.strictEqual(await statusPanel.count(), 0, 'Panel trạng thái vẫn còn hiển thị sau khi bấm thử lại');
      log('  ✓ B01: Nút "Thử lại biểu mẫu" hoạt động chính xác, đóng panel kết quả và quay lại form.');

      await context.close();
    }

    log('\n=== TẤT CẢ CÁC BÀI KIỂM TRA MỐC 2B ĐỀU ĐẠT (100% PASS) ===\n');
    fs.writeFileSync(path.join(EVIDENCE_DIR, '2b-verification-results.txt'), logEntries.join('\n'), 'utf8');

  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
    cleanup();
  }
}

run().catch((err) => {
  console.error('LỖI KIỂM TRA:', err);
  process.exit(1);
});
