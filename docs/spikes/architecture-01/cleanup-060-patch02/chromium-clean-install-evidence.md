# Chromium Clean Install & Browser Test Execution Evidence (3B-P01-P2-2)

**Directive:** CEO Directive 064-A  
**Branch:** `spike/architecture-01-cleanup-060-patch02`  
**Execution Environment:** Windows 11 Enterprise x64 (Local Dedicated Worktree)  
**Verification Level:** `[VERIFIED BY ANTIGRAVITY (LOCAL HOST)]`  

---

## 1. System & Runtime Specifications

| Attribute | Specification | Verification Command |
|---|---|---|
| **Operating System** | Windows 11 Enterprise (Version 10.0.26100 Build 26100) x64 | `[System.Environment]::OSVersion` |
| **Node.js Runtime** | `v24.21.0` | `node -v` |
| **npm Package Manager** | `11.19.0` | `npm.cmd -v` |
| **Playwright Dependency** | `Version 1.64.1` (DevDependency in `package.json`) | `npx.cmd playwright --version` |
| **Dedicated Worktree** | `D:\webbvct-cleanup-060-patch02` | `git worktree list` |
| **Base Commit SHA** | `f337afac05f6a7b05375e196aab4448392bdfb37` | `git rev-parse HEAD` |

---

## 2. Step-by-Step Test Execution & Logs

### Step 1: Typecheck & React Router Typegen
```bash
npm.cmd run typecheck
```
- **Exit Code:** `0`
- **Output:**
  ```text
  > webbvct@0.0.0 typecheck
  > react-router typegen && tsc -b
  ```
- **Status:** PASS (0 TypeScript errors across all route modules).

---

### Step 2: Linter (Oxlint)
```bash
npm.cmd run lint
```
- **Exit Code:** `0`
- **Output:**
  ```text
  > webbvct@0.0.0 lint
  > oxlint

  Found 0 warnings and 0 errors.
  Finished in 31ms on 88 files with 115 rules using 12 threads.
  ```
- **Status:** PASS (0 errors, 0 warnings).

---

### Step 3: Production Build & SSG Prerender
```bash
npm.cmd run build
```
- **Exit Code:** `0`
- **Duration:** 1.67s
- **Output Summary:**
  ```text
  vite v8.3.5 building client environment for production...
  ✓ 2019 modules transformed.
  ✓ built in 1.24s

  vite v8.3.5 building ssr environment for production...
  ✓ 64 modules transformed.
  ✓ built in 431ms

  Prerender (html): / -> build\client\index.html
  Prerender (html): /gioi-thieu -> build\client\gioi-thieu\index.html
  Prerender (html): /doi-ngu -> build\client\doi-ngu\index.html
  Prerender (html): /co-so-vat-chat -> build\client\co-so-vat-chat\index.html
  Prerender (html): /dat-lich -> build\client\dat-lich\index.html
  Prerender (html): /dich-vu -> build\client\dich-vu\index.html
  Prerender (html): /dich-vu/kham-dieu-tri -> build\client\dich-vu\kham-dieu-tri\index.html
  Prerender (html): /dich-vu/noi-tru -> build\client\dich-vu\noi-tru\index.html
  Prerender (html): /dich-vu/spa -> build\client\dich-vu\spa\index.html
  Prerender (html): /dich-vu/cap-cuu -> build\client\dich-vu\cap-cuu\index.html
  Prerender (html): /bang-gia -> build\client\bang-gia\index.html
  Prerender (html): /cau-chuyen -> build\client\cau-chuyen\index.html
  Prerender (html): /goc-thu-cung -> build\client\goc-thu-cung\index.html
  Prerender (html): /san-pham -> build\client\san-pham\index.html
  Prerender (html): /lien-he -> build\client\lien-he\index.html
  Prerender (html): /dang-nhap -> build\client\dang-nhap\index.html
  Prerender (html): /dang-ky -> build\client\dang-ky\index.html
  Prerender (html): /tai-khoan -> build\client\tai-khoan\index.html
  Prerender (html): /404 -> build\client\404\index.html
  Prerender (html): SPA Fallback -> build\client\__spa-fallback.html
  [postbuild] Generated root 404.html: D:\webbvct-cleanup-060-patch02\build\client\404.html
  ```
- **Status:** PASS (19 static HTML routes prerendered + `404.html` + `__spa-fallback.html`).

---

### Step 4: Playwright Browser Installation Check
```bash
npm.cmd run test:install-browsers
```
- **Exit Code:** `0`
- **Output:**
  ```text
  > webbvct@0.0.0 test:install-browsers
  > playwright install chromium
  ```
- **Status:** PASS.

---

### Step 5: Hydration & Dynamic 404 Playwright Audit
```bash
npm.cmd run test:hydration
```
- **Exit Code:** `0`
- **Output:**
  ```text
  > webbvct@0.0.0 test:hydration
  > node tests/spike/test-hydration-404.cjs

  Testing Hydration & Console Errors with Playwright Chromium...
  URL: /khong-ton-tai               | HTTP: 404 | H1: Không tìm thấy trang yêu cầu   | Hydration 418: CLEAN | Result: PASS
  URL: /quan-ly/lich-truc           | HTTP: 404 | H1: Không tìm thấy trang yêu cầu   | Hydration 418: CLEAN | Result: PASS
  URL: /dich-vu/slug-khong-ton-tai  | HTTP: 404 | H1: Không tìm thấy trang yêu cầu   | Hydration 418: CLEAN | Result: PASS
  URL: /cau-chuyen/ca-dieu-tri-01   | HTTP: 200 | H1: Chi tiết câu chuyện điều trị   | Hydration 418: CLEAN | Result: PASS
  URL: /bai-viet/cham-soc-mua-mua   | HTTP: 200 | H1: Chi tiết bài viết cẩm nang     | Hydration 418: CLEAN | Result: PASS
  URL: /tai-khoan                   | HTTP: 200 | H1: Cổng quản lý hồ sơ thú cưng    | Hydration 418: CLEAN | Result: PASS
  URL: /tai-khoan/                  | HTTP: 200 | H1: Cổng quản lý hồ sơ thú cưng    | Hydration 418: CLEAN | Result: PASS
  URL: /tai-khoan/lich-hen          | HTTP: 200 | H1: Cổng quản lý hồ sơ thú cưng    | Hydration 418: CLEAN | Result: PASS

  [PASS] All 404 and Dynamic Route hydration tests PASSED with 0 errors.
  ```
- **Status:** PASS (8/8 routes clean, zero React error #418).

---

### Step 6: SEO Consistency Playwright Audit
```bash
npm.cmd run test:seo-consistency
```
- **Exit Code:** `0`
- **Output:**
  ```text
  > webbvct@0.0.0 test:seo-consistency
  > node tests/spike/test-seo-consistency.cjs

  === STARTING SEO ENVIRONMENT CONSISTENCY TEST ===
  [1] Auditing Raw Prerendered HTML Files...
    Raw index.html robots directive: "noindex, nofollow"
    Raw gioi-thieu/index.html robots directive: "noindex, nofollow"
  [2] Auditing Hydrated DOM in Browser (Direct URL)...
    Hydrated index.html robots tags count: 1
    Hydrated index.html robots content: ["noindex, nofollow"]
  [3] Auditing Hydrated DOM after Browser Refresh...
    Refreshed index.html robots content: ["noindex, nofollow"] (PASS)
  [4] Auditing Hydrated DOM on /gioi-thieu...
    Hydrated /gioi-thieu robots content: ["noindex, nofollow"] (PASS)
  [5] Auditing Hydrated DOM on Private Route (/tai-khoan)...
    Hydrated /tai-khoan robots content: ["noindex, nofollow"] (PASS)

  === ALL SEO ENVIRONMENT CONSISTENCY TESTS PASSED! ===
  ```
- **Status:** PASS (5/5 checks clean).

---

### Step 7: Tightened Milestone 2B E2E Verification
```bash
node tests/e2e/2b-verification.cjs
```
- **Exit Code:** `0`
- **Output:**
  ```text
  === BẮT ĐẦU KIỂM TRA TOÀN DIỆN MỐC 2B (B01, B02, B04) ===
  Thời gian: 2026-10-28T11:42:44.647Z
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
    ✓ B01: Banner thông báo minh bạch khớp 100% baseline 3A (tiêu đề, nội dung, hotline và href tel).
    ✓ B01: Đầy đủ 8 trường dữ liệu theo đặc tả BookingFormData.
    ✓ Client validation hoạt động chuẩn: bắt lỗi và hiển thị đầy đủ 4/4 thông báo lỗi bắt buộc.
    ✓ B01: Đã điền và xác minh giá trị 8 trường hợp lệ (ngày tương lai động, option kham-dieu-tri).
    ✓ B01: Panel kết quả minh bạch 100% khớp baseline 3A (tiêu đề, badge, hotline 097 355 51 05, href tel:0973555105).
    ✓ B01: Nút "Thử lại biểu mẫu" hoạt động chính xác, đóng panel kết quả và quay lại form.

  === TẤT CẢ CÁC BÀI KIỂM TRA MỐC 2B ĐỀU ĐẠT (100% PASS) ===
  ```
- **Status:** PASS (100%).

---

## 3. Server Process Cleanup Verification

Immediately after test completion, port 4173 was inspected via PowerShell:
```powershell
Get-NetTCPConnection -LocalPort 4173 -ErrorAction SilentlyContinue
```
Output:
```text
LocalAddress    LocalPort  RemoteAddress  RemotePort  State
------------    ---------  -------------  ----------  -----
::1             4173       ::1            55104       TimeWait
```
Result: All sockets transitioned to `TimeWait`. There is **zero process listening on port 4173**. No background Node processes leaked.

---

## 4. Evidence Integrity Hash Verification

To guarantee that Milestone 2B accepted evidence files were never touched:
```bash
git diff 4739d45cc95100b587381b6bdcad6935352b23e8 -- docs/qa/2b-verification-evidence
```
Result: **0 diff output (15/15 files identical to baseline 3A)**.

---

## 5. Linux CI Clean-Install Specifications (Playwright 1.64.1)

To address Claude's P3 note regarding Docker tags matching repository dependencies:
- In `package.json`, the repository declares `"playwright": "^1.64.1"`.
- Official Playwright image matching this version: `mcr.microsoft.com/playwright:v1.64.1-noble` (or `-jammy`).
- On standard Linux CI (GitHub Actions `ubuntu-latest`), use:
  ```bash
  npm ci
  npx playwright install --with-deps chromium
  npm run build
  npm run test:hydration
  npm run test:seo-consistency
  node tests/e2e/2b-verification.cjs
  ```
- If running inside a container without internet access to `cdn.playwright.dev`, the host runner or Docker cache must provide the browser binaries in `~/.cache/ms-playwright/`.
