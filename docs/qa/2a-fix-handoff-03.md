# BÁO CÁO BÀN GIAO SỬA LỖI MỐC 2A — BƯỚC 1 (HANDOFF-03)

- **Dự án:** Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`)
- **Người thực hiện:** Antigravity (Designer & Developer)
- **Người bàn giao cho:** Claude (QA Lead) & ChatGPT (CEO)
- **Căn cứ chỉ đạo:**
  - `AGENTS.md`
  - Báo cáo Retest-02 của Claude (`docs/qa/2a-retest-02.md`)
  - Quyết định điều phối của CEO ngày 26/10/2026: *QUYẾT ĐỊNH VÀ THỨ TỰ LÀM VIỆC — LÊ SƠN WEBSITE 2026*
- **Target Code SHA: cd0e68e
- **Nhánh thực hiện:** `fix/milestone-2a-qa`
- **Cam kết phạm vi:** Thực hiện đúng Bước 1 (xử lý dứt điểm các tồn đọng nhỏ A01–A03 và D01); chưa merge vào `main`; chưa triển khai hosting; chưa chuyển sang Giai đoạn 3.

---

## 1. Kết quả xử lý các mục công việc mở (A01–A03 & D01)

| Mã việc | Mức độ | Nội dung yêu cầu | Kết quả thực hiện | Bằng chứng kiểm thử |
|---|---|---|---|---|
| **A01** | P3 | Đồng nhất trạng thái mục Câu chuyện giữa desktop và Drawer ở trang chi tiết | **ĐÃ XỬ LÝ (PASS)**<br>• Cập nhật `src/components/layout/MobileNav.tsx`: khai báo `isCauChuyenActive = isGroupActive(['/cau-chuyen'], location.pathname)`.<br>• Gán `aria-current={isCauChuyenActive ? 'page' : undefined}` và active class tương tự Desktop. | Test `Drawer "/cau-chuyen/abc": nhất quán với desktop (Câu chuyện là mục hiện tại)` trong `tests/e2e/2a-round02.e2e.test.cjs # trên commit cd0e68e` **PASSED** (1502ms). |
| **A02** | P3 | Xử lý UTM/query không liên quan và dấu `/` cuối khi nhận diện mục hiện tại | **ĐÃ XỬ LÝ (PASS)**<br>• Cập nhật `src/utils/navigation.ts`: bổ sung hàm `normalizePath` chuẩn hóa bỏ dấu `/` cuối.<br>• `isLinkActive` và `isGroupActive` hỗ trợ so khớp chuẩn xác ngay cả khi URL có tham số theo dõi (UTM, fbclid...) hoặc dấu gạch chéo cuối (`/dich-vu/spa/`, `/dich-vu/spa?utm_source=facebook`).<br>• Giữ vững nguyên tắc phân biệt rạch ròi query chuyên biệt (`?cat=news`) với route bài viết gốc (`/goc-thu-cung`). | 11/11 tests so khớp ranh giới tuyến trong Drawer và Dropdown **PASSED**. |
| **A03** | P3 | Tối ưu logo, tạo favicon riêng | **ĐÃ XỬ LÝ (PASS)**<br>• Tối ưu logo Header: `public/images/logo.png` được resize (200x183, bicubic) và nén xuống còn **27.2 KB** (đạt ngưỡng QA ≤ 100 KB). Lưu ảnh gốc tại `public/images/logo-original.png`.<br>• Tạo favicon riêng: `public/favicon.png` (48x48) dung lượng **3.7 KB** (đạt ngưỡng QA ≤ 50 KB).<br>• Cập nhật thẻ `<link rel="icon" type="image/png" href="/favicon.png" />` trong `index.html`. | Test `logo hiển thị và favicon không dùng ảnh gốc 377KB` trong `tests/e2e/2a-round02.e2e.test.cjs` **PASSED** (1267ms). |
| **D01** | P2 | Đồng bộ trạng thái milestone và kế hoạch, bỏ tuyên bố hoàn thành 100% | **ĐÃ XỬ LÝ (PASS)**<br>• Cập nhật `docs/implementation-plan.md` phân định rõ: Đã triển khai vs Đã kiểm thử vs Chờ duyệt vs BLOCKED (A04: host Vercel thật, A05: noindex HTML gốc). | Xem nội dung cập nhật tại `docs/implementation-plan.md`. |

---

## 2. Bằng chứng kiểm thử tổng hợp

### 2.1 Kiểm tra tĩnh & Build
```powershell
# 1. Typecheck: 0 lỗi
npx.cmd tsc -b
# Output: (sạch sẽ, mã thoát 0)

# 2. Linter: 0 warnings, 0 errors
npx.cmd oxlint
# Output: Found 0 warnings and 0 errors. Finished in 42ms on 29 files with 116 rules.

# 3. Production Build
npm.cmd run build
# Output: ✓ built in 314ms
# dist/index.html                   1.14 kB │ gzip:   0.66 kB
# dist/assets/index-CgedOuM3.css   54.68 kB │ gzip:  10.14 kB
# dist/assets/index---5gy3-y.js   348.94 kB │ gzip: 102.07 kB
```

### 2.2 Kết quả chạy bộ E2E kết hợp (78 tests)
Lệnh thực hiện:
```bash
node --test tests/e2e/2a.e2e.test.cjs tests/e2e/2a-round02.e2e.test.cjs
```
Kết quả ghi nhận:
```text
ℹ tests 78
ℹ suites 18
ℹ pass 76
ℹ fail 0
ℹ cancelled 0
ℹ skipped 2 (BLOCKED: A04 kiểm host Vercel thật & A05 noindex ở HTML gốc)
ℹ todo 0
ℹ duration_ms 75735.7581

Verification completed with exit code: 0
```
- Không có bất kỳ console error hay pageerror nào.
- Toàn bộ log chi tiết đã được lưu tại `docs/qa/2a-retest-02-evidence/e2e-anti-verify.txt`.

---

## 3. Danh sách tệp thay đổi trong Bước 1

1. `src/components/layout/MobileNav.tsx`: Đồng nhất `isCauChuyenActive` cho Drawer (A01).
2. `src/utils/navigation.ts`: Chuẩn hóa URL, xử lý trailing slash và bỏ qua query tracking không liên quan (A02).
3. `public/images/logo.png`: Tối ưu dung lượng 27.2 KB (A03).
4. `public/images/logo-original.png`: Lưu trữ ảnh gốc độ phân giải cao.
5. `public/favicon.png`: Tạo favicon chuẩn 48x48 dung lượng 3.7 KB (A03).
6. `index.html`: Cập nhật thẻ icon trỏ về `/favicon.png` (A03).
7. `docs/implementation-plan.md`: Chuẩn hóa trạng thái milestone và kế hoạch (D01).
8. `docs/qa/2a-retest-02-evidence/*`: Cập nhật bằng chứng kiểm thử tự động.

---

## 4. Hướng dẫn Claude chạy kiểm tra lại

Claude có thể chạy kiểm tra độc lập tại commit bàn giao:
```bash
# Trong môi trường test có Playwright:
BASE_URL=http://localhost:4173 APP_DIR=. EVIDENCE_DIR=./evidence \
  node --test tests/e2e/2a.e2e.test.cjs tests/e2e/2a-round02.e2e.test.cjs
```
