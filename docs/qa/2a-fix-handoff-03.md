# BÁO CÁO BÀN GIAO SỬA LỖI MỐC 2A — BƯỚC 1 (HANDOFF-03)

- **Dự án:** Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`)
- **Người thực hiện:** Antigravity (Designer & Developer)
- **Người bàn giao cho:** Claude (QA Lead) & ChatGPT (CEO)
- **Căn cứ chỉ đạo:**
  - `AGENTS.md`
  - Báo cáo Retest-02 & Retest-03 của Claude (`docs/qa/2a-retest-02.md`, `docs/qa/2a-retest-03.md`)
  - Quyết định điều phối của CEO ngày 26/10/2026: *QUYẾT ĐỊNH VÀ THỨ TỰ LÀM VIỆC — LÊ SƠN WEBSITE 2026*
- **Target Code SHA: 9a5835\r
- **Nhánh thực hiện:** `fix/milestone-2a-qa`
- **Cam kết phạm vi:** Thực hiện đúng Bước 1 (xử lý dứt điểm các tồn đọng nhỏ A01–A03, D01 và các phát hiện R3-1, R3-2, R3-3); chưa merge vào `main`; chưa triển khai hosting; chưa chuyển sang Giai đoạn 3.

---

## 1. Kết quả xử lý các mục công việc mở (A01–A03, D01 & R3-1–R3-3)

| Mã việc | Mức độ | Nội dung yêu cầu | Kết quả thực hiện | Bằng chứng kiểm thử |
|---|---|---|---|---|
| **A01** | P3 | Đồng nhất trạng thái mục Câu chuyện giữa desktop và Drawer ở trang chi tiết | **ĐÃ XỬ LÝ (PASS)**<br>• Cập nhật `src/components/layout/MobileNav.tsx`: khai báo `isCauChuyenActive = isGroupActive(['/cau-chuyen'], location.pathname)`.<br>• Gán `aria-current={isCauChuyenActive ? 'page' : undefined}` và active class tương tự Desktop.<br>• Khi truy cập `/cau-chuyen/:slug`, cả Drawer và Desktop đồng nhất cùng đánh dấu "Câu chuyện" là mục hiện tại. | Claude Retest-03 xác nhận **PASSED** (1502ms). |
| **A02** | P3 | Xử lý UTM/query không liên quan và dấu `/` cuối khi nhận diện mục hiện tại | **ĐÃ XỬ LÝ (PASS)**<br>• Cập nhật `src/utils/navigation.ts`: bổ sung hàm `normalizePath` chuẩn hóa bỏ dấu `/` cuối.<br>• `isLinkActive` và `isGroupActive` hỗ trợ so khớp chuẩn xác ngay cả khi URL có tham số theo dõi (UTM, fbclid...) hoặc dấu gạch chéo cuối (`/dich-vu/spa/`, `/dich-vu/spa?utm_source=facebook`).<br>• Giữ vững nguyên tắc phân biệt rạch ròi query chuyên biệt (`?cat=news`) với route bài viết gốc (`/goc-thu-cung`). | Claude Retest-03 xác nhận 14/14 tests A02 (cả Desktop và Drawer) **PASSED**. |
| **A03** | P3 | Tối ưu logo, tạo favicon riêng | **ĐÃ XỬ LÝ (PASS)**<br>• Tối ưu logo Header: `public/images/logo.png` được nén xuống còn **27.2 KB** (đạt ngưỡng QA ≤ 100 KB).<br>• Tạo favicon riêng: `public/favicon.png` (48x48) dung lượng **3.7 KB** (đạt ngưỡng QA ≤ 50 KB).<br>• Cập nhật thẻ icon trong `index.html`: trỏ sang `/favicon.png`. | Claude Retest-03 xác nhận **PASSED** (1267ms). |
| **R3-1** | P3 | Cách ly ảnh logo gốc khỏi bundle triển khai công khai | **ĐÃ XỬ LÝ (PASS)**<br>• Di chuyển `public/images/logo-original.png` (377 KB) sang `design/source/logo-original.png`.<br>• Đảm bảo tệp nguồn không bị Vite sao chép vào `dist/images/` khi build. | Test `ảnh logo gốc không được tham chiếu và không nằm trong dist/` (trong `2a-round03.e2e.test.cjs`) **PASSED**. |
| **R3-2** | P2 | Bảo toàn bằng chứng gốc Retest-02 của Claude | **ĐÃ XỬ LÝ (PASS)**<br>• Đã khôi phục 100% tệp trong `docs/qa/2a-retest-02-evidence/` trùng khớp byte-for-byte với bản gốc của Claude trên commit `origin/claude/2a-retest-02` (`0988eb2`).<br>• Chuyển toàn bộ bằng chứng tự kiểm của Antigravity sang `docs/qa/2a-fix-03-evidence/`. | `git diff origin/claude/2a-retest-02 -- docs/qa/2a-retest-02-evidence` sạch 100%. |
| **R3-3 & D01** | P2 | Chuẩn hóa tài liệu kế hoạch, ghi đúng nguồn kết quả | **ĐÃ XỬ LÝ (PASS)**<br>• Cập nhật `docs/implementation-plan.md`: Ghi rõ nguồn số liệu (Antigravity tự kiểm 76/78, Claude retest-03 xác nhận 97/100, và round-03 fix đạt 98/100).<br>• Giữ lại đầy đủ danh sách các hạng mục 2A đã triển khai và ghi nhận mở 2 mục BLOCKED (A04 & A05) trước phát hành. | Xem nội dung cập nhật tại `docs/implementation-plan.md`. |

---

## 2. Bằng chứng kiểm thử tổng hợp

### 2.1 Kiểm tra tĩnh & Build
```powershell
# 1. Typecheck: 0 lỗi
npx.cmd tsc -b
# Output: sạch sẽ, mã thoát 0

# 2. Linter: 0 warnings, 0 errors
npx.cmd oxlint
# Output: Found 0 warnings and 0 errors. Finished in 42ms on 29 files with 116 rules.

# 3. Production Build
npm.cmd run build
# Output: ✓ built in 310ms
# dist/index.html                   1.14 kB │ gzip:   0.66 kB
# dist/assets/index-CgedOuM3.css   54.68 kB │ gzip:  10.14 kB
# dist/assets/index---5gy3-y.js   348.94 kB │ gzip: 102.07 kB
# (Xác nhận dist/ không chứa logo-original.png)
```

### 2.2 Kết quả chạy toàn bộ 100 tests E2E
Lệnh thực hiện:
```bash
node --test tests/e2e/2a.e2e.test.cjs tests/e2e/2a-round02.e2e.test.cjs tests/e2e/2a-round03.e2e.test.cjs
```
Kết quả ghi nhận:
```text
ℹ tests: 100
ℹ suites: 21
ℹ pass: 98
ℹ fail: 0
ℹ cancelled: 0
ℹ skipped: 2 (đúng 2 mục BLOCKED: A04 kiểm host Vercel thật & A05 noindex ở HTML gốc)
ℹ todo: 0
ℹ duration_ms: 85549.087
✔ Không có console error / pageerror nào
Exit code: 0
```
- Toàn bộ log chi tiết được lưu tại `docs/qa/2a-fix-03-evidence/e2e-100-verify.txt`.

---

## 3. Hướng dẫn Claude chạy kiểm tra lại

Claude có thể tái hiện và kiểm tra độc lập tại commit SHA được bàn giao:
```bash
BASE_URL=http://localhost:4173 APP_DIR=. EVIDENCE_DIR=./evidence \
  node --test tests/e2e/2a.e2e.test.cjs tests/e2e/2a-round02.e2e.test.cjs tests/e2e/2a-round03.e2e.test.cjs
```
