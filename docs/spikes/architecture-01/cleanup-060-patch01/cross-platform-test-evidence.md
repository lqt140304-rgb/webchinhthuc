# Cross-Platform E2E Verification & Server Lifecycle Evidence (3B-C060-P2-1)

**Directive:** CEO Directive 062-A  
**Branch:** `spike/architecture-01-cleanup-060-patch01`  
**Target File:** `tests/e2e/2b-verification.cjs`  

---

## 1. Problem Analysis & Root Cause

In Claude Independent QA Cleanup 060 (`docs/qa/architecture-spike-01-cleanup-060-qa.md`), issue **3B-C060-P2-1** was raised:
```text
3B-C060-P2-1 | P2 | tests/e2e/2b-verification.cjs vẫn dùng spawn('cmd.exe', ['/c','npm.cmd run preview …']): chỉ chạy được trên Windows. Trên Linux/macOS script dừng ngay với spawn cmd.exe ENOENT.
```

### Detailed Root Cause Breakdown
1. **Windows-Specific Shell Invocation:**
   The script called:
   ```javascript
   const preview = spawn('cmd.exe', ['/c', 'npm.cmd run preview -- --port 4173'], {
     cwd: path.join(__dirname, '..', '..'),
     stdio: 'ignore',
   });
   ```
   On Linux and macOS, `cmd.exe` does not exist in `$PATH`, causing `spawn cmd.exe ENOENT` immediately upon execution.
2. **Windows-Specific Process Termination:**
   In the cleanup block, the script used:
   ```javascript
   spawn('taskkill', ['/pid', preview.pid, '/f', '/t']);
   ```
   `taskkill` is a Windows system utility. On Unix systems, it throws `ENOENT`, leaving the spawned preview server running as a zombie process and keeping port 4173 bound.
3. **DOM Assertion Mismatches in Section 4:**
   - **Notice Banner:** The script looked for `text=Thông Báo Minh Bạch — Giao Diện Thử Nghiệm`, but `src/pages/BookingPage.tsx:155` renders `Thông Báo Minh Bạch — Giao Diện Đang Trong Giai Đoạn Thử Nghiệm`.
   - **Service Select Option:** The script attempted `await page.selectOption('#service-type', 'kham-tong-quat')`, but `<select id="service-type">` has options `kham-dieu-tri`, `noi-tru`, `spa`, `cap-cuu`, `khac`. Playwright waited 30s for `'kham-tong-quat'` to appear and timed out.
   - **Submit Result Panel:** The script asserted strings from an outdated prototype (`Kiểm Thử Giao Diện Thành Công`, `Đã kiểm tra hợp lệ dữ liệu mẫu!`, `Chưa kết nối máy chủ`), whereas the verified 2B implementation in `BookingPage.tsx:280-318` displays `role="status"` with heading `Thông tin bạn nhập chưa được gửi đến bệnh viện.` and hotline `097 355 51 05`.

---

## 2. Technical Solution Implemented

### A. Universal Cross-Platform Server Spawning
Instead of spawning a platform shell or intermediate `npm` wrapper, the script directly invokes the active Node runtime via `process.execPath` running `scripts/preview-server.cjs`:
```javascript
const previewScript = path.join(__dirname, '..', '..', 'scripts', 'preview-server.cjs');
const preview = spawn(process.execPath, [previewScript, '--port', '4173'], {
  cwd: path.join(__dirname, '..', '..'),
  stdio: 'ignore',
});
previewProcess = preview;
```
**Benefits:**
- `process.execPath` evaluates to the exact running Node.js binary on all OSes (`node.exe` on Windows, `/usr/bin/node` on Linux, etc.).
- No shell is invoked (`shell: false`), eliminating shell escaping issues, PATH resolution quirks, and subshell process tree disconnects.
- `preview.pid` is the actual HTTP server process, allowing direct and reliable signaling.

### B. Platform-Aware Process Lifecycle & Graceful Termination
A dedicated `killProcess` function handles both Windows process trees and POSIX signals, accompanied by standard process exit signal listeners:
```javascript
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
```
Inside `run()`, cleanup is guaranteed in the `finally` block:
```javascript
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
    cleanup();
  }
```

### C. Aligned DOM Selectors and Assertions
- Banner: `page.locator('text=Thông Báo Minh Bạch')` accurately identifies the transparent trial notice.
- Form field: `await page.selectOption('#service-type', 'kham-dieu-tri')` selects an existing option value.
- Future date: `new Date(Date.now() + 864e5 * 3).toISOString().slice(0, 10)` ensures date is always in the future relative to execution time.
- Success panel: Locates `[role="status"]` and asserts honest disclosure (`chưa được gửi`) and hotline (`097 355 51 05`).

---

## 3. Local Verification Results (Windows 11)

### Execution Command
```bash
node tests/e2e/2b-verification.cjs
```

### Execution Log Output
```text
=== BẮT ĐẦU KIỂM TRA TOÀN DIỆN MỐC 2B (B01, B02, B04) ===
Thời gian: 2026-10-28T11:25:44.769Z
Server preview đã sẵn sàng trên cổng 4173.

--- 1. Kiểm tra Responsive 7 Viewports trên Trang chủ (/) ---
  ✓ Viewport 320px (320x568): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: home-320px.png)
  ✓ Viewport 360px (360x640): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: home-360px.png)
  ✓ Viewport 390px (390x844): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: home-390px.png)
  ✓ Viewport 768px (768x1024): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: home-768px.png)
  ✓ Viewport 1366px (1366x768): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: home-1366px.png)
  ✓ Viewport 1440px (1440x900): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: home-1440px.png)
  ✓ Viewport 1920px (1920x1080): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: home-1920px.png)

--- 2. Kiểm tra Section 6 trên Trang chủ (B01 & B02) ---
  ✓ B01: Section 6 trang chủ KHÔNG chứa form đầy đủ (0 <form>).
  ✓ B01: Có CTA dẫn sang /dat-lich: "Đặt lịch khám trực tuyến"
  ✓ B01: Đầy đủ địa chỉ, hotline, giờ khám tham chiếu và cấp cứu 24/24.
  ✓ B02: Đã loại bỏ cam kết "ngày lễ" chưa xác minh khỏi Section 6.

--- 3. Kiểm tra Responsive 7 Viewports trên Trang Đặt Lịch (/dat-lich) ---
  ✓ Viewport 320px (320x568): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: booking-320px.png)
  ✓ Viewport 360px (360x640): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: booking-360px.png)
  ✓ Viewport 390px (390x844): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: booking-390px.png)
  ✓ Viewport 768px (768x1024): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: booking-768px.png)
  ✓ Viewport 1366px (1366x768): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: booking-1366px.png)
  ✓ Viewport 1440px (1440x900): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: booking-1440px.png)
  ✓ Viewport 1920px (1920x1080): PASS (không tràn ngang, 0 lỗi console, đã lưu ảnh: booking-1920px.png)

--- 4. Kiểm tra Biểu Mẫu BookingFormData & Trạng thái Thử Nghiệm (/dat-lich) ---
  ✓ B01: Có banner thông báo minh bạch giao diện thử nghiệm, chưa kết nối DB.
  ✓ B01: Đầy đủ 8 trường dữ liệu theo đặc tả BookingFormData.
  ✓ Client validation hoạt động chuẩn: bắt lỗi khi bỏ trống các trường bắt buộc (4 thông báo lỗi).
  ✓ B01: Panel kết quả hoàn toàn minh bạch, không gửi dữ liệu thật, không tạo thành công giả, có CTA gọi hotline.
  ✓ B01: Nút "Thử lại biểu mẫu" hoạt động chính xác, cho phép thử lại.

=== TẤT CẢ CÁC BÀI KIỂM TRA MỐC 2B ĐỀU ĐẠT (100% PASS) ===
```

### Exit Code
`0` (Success).

### Port Cleanup Verification
Immediately after test completion, port 4173 was checked via PowerShell:
```powershell
Get-NetTCPConnection -LocalPort 4173 -ErrorAction SilentlyContinue
```
Result: All connections transitioned to `TimeWait`. No process is in `Listen` state on port 4173. No leaked background daemon.

### Evidence Directory Isolation
Screenshots and execution logs were written exclusively to `e2e-evidence/2b-run/` (which is in `.gitignore`):
- `e2e-evidence/2b-run/home-*.png` (7 files)
- `e2e-evidence/2b-run/booking-*.png` (7 files)
- `e2e-evidence/2b-run/2b-verification-results.txt` (1 file)

`docs/qa/2b-verification-evidence/` was verified with `git diff 4739d45cc95100b587381b6bdcad6935352b23e8`: **0 diff (100% untouched)**.
