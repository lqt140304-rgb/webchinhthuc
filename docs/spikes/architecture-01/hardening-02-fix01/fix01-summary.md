# ARCHITECTURE SPIKE 01 — HARDENING 02 FIX 01: TỔNG KẾT ĐIỀU HÀNH & KẾT QUẢ THỰC HIỆN

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chỉ thị:** CEO DIRECTIVE 058-A  
**Agent thực hiện:** Antigravity — Architecture Implementation  
**Agent kiểm định độc lập:** Claude — Independent Architecture QA Lead  
**Quyền hạn:** ISOLATED EXPERIMENTAL BRANCH ONLY — DEPLOYMENT STRICTLY PROHIBITED  
**Trạng thái:** HOÀN TẤT FIX 01 — SẴN SÀNG CHO CLAUDE QA  
**Nhánh Git:** `spike/architecture-01-hardening-02-fix01`  
**Base Commit (Hardening 02):** `bacc62afebcd531a23a1fc6f52724f1799557000`  

---

## I. MỤC TIÊU & BỐI CẢNH

Sau kết luận của Claude Independent QA tại Hardening 02 (`PASS WITH FIXES · NOT READY FOR PREVIEW`):
- Toàn bộ các lỗi P0/P1 chặn từ trước (React hydration error #418, metadata P1 vi phạm Content Lock) đã được giải quyết triệt để.
- Dự án chưa sẵn sàng cho Preview do tồn tại 5 điểm khiếm khuyết thuộc nhóm P2 (F01–F05).

Thực hiện chỉ thị **CEO DIRECTIVE 058-A**, Antigravity đã triển khai vòng sửa giới hạn phạm vi (Hardening 02 Fix 01) để xử lý dứt điểm toàn bộ 5 phát hiện:
1. **F01 (`3B-H2-P2-1`): Cấu hình Output Vercel:** Thêm đầy đủ `outputDirectory: "build/client"`, `cleanUrls: true`, `trailingSlash: false`, `buildCommand: "npm run build"` vào `vercel.json`; kiểm toán thư mục build và phân tích thứ tự ưu tiên cấu hình Vercel Dashboard vs file repo.
2. **F02 (`3B-H2-P2-2`): Nhất quán chính sách SEO theo môi trường:** Đưa biến môi trường `__APP_ENV__` vào `define` của Vite tại `vite.config.ts`, tạo nguồn giá trị môi trường build-time duy nhất và đồng nhất giữa SSR prerender và Client bundle; giải quyết triệt để lỗi xung đột thẻ robots khi build Production mô phỏng.
3. **F03 (`3B-H2-P2-3`, `3B-H2-P2-4`): Sửa đổi toàn diện Content Audit Register:** Tách bạch claim thử nghiệm của Spike ("vô trùng") khỏi claim gốc của Baseline 3A; đính chính chính xác vị trí các claim trong mã nguồn; chuẩn hóa giờ hoạt động theo `src/config/contact.ts` (`08:00 - 21:00`); bổ sung vai trò thẩm quyền xác minh và trạng thái `VERIFIED` / `PENDING` / `REJECTED`.
4. **F04 (`3B-H2-P2-5`): Xóa bỏ Hardcoded Test Paths:** Thêm `playwright` vào `devDependencies` của `package.json`; thay thế toàn bộ đường dẫn máy cá nhân `C:/Users/Admin/...` bằng chuẩn `require('playwright')`.
5. **F05: Bằng chứng kiểm thử hồi quy & QA Evidence:** Xây dựng script kiểm thử DOM tự động `test:seo-consistency`, chạy lại toàn bộ test suite (Typecheck, Lint, Build, Routing, Hydration, SEO Local, SEO Production).

---

## II. ĐỐI CHIẾU CÁC GATE CHỈ THỊ 058-A

| Gate | Tiêu chuẩn đánh giá | Trạng thái Hardening 02 | Trạng thái sau Fix 01 | Kết luận |
| --- | --- | --- | --- | --- |
| **Gate A — Rendering / SEO** | Metadata sạch, không xung đột robots giữa HTML và DOM client, Preview noindex, Production mô phỏng nhất quán | PASS (chỉ phạm vi Local, Prod còn lỗi) | **PASS LOCAL & PROD-SIMULATED** | **ĐẠT (PASS)** |
| **Gate B — Routing / Privacy** | 21/21 route parity, 404 đúng, dynamic routes đúng, không hydration error, không lộ dữ liệu | PASS LOCAL | **PASS LOCAL** (21/21 routes 200/404, 0 error #418) | **ĐẠT (PASS)** |
| **Gate C — Regression** | Clean build, typecheck, lint đạt 0 lỗi, test portable không phụ thuộc máy, không visual regression | PASS WITH FIXES (bị trừ điểm do hardcoded path) | **PASS** (Playwright trong devDependencies, oxlint 0/0, tsc 0) | **ĐẠT (PASS)** |
| **Gate D — Hosting / Social** | Cấu hình output hợp lý, sẵn sàng cho Preview, không tự ý deploy | NOT READY (thiếu outputDirectory trong vercel.json) | **READY FOR OWNER-APPROVED PREVIEW** | **SẴN SÀNG CHO PREVIEW (CHỜ OWNER PHÊ DUYỆT)** |

---

## III. TỔNG HỢP CÁC FILE THAY ĐỔI TRONG NHÁNH FIX 01

1. **`vercel.json`**: Bổ sung `buildCommand`, `outputDirectory: "build/client"`, `cleanUrls: true`, `trailingSlash: false`.
2. **`vite.config.ts`**: Thêm khối tính toán `appEnv` và tiêm `define: { '__APP_ENV__': JSON.stringify(appEnv) }`.
3. **`src/config/seo-policy.ts`**: Sử dụng `__APP_ENV__` làm nguồn dữ liệu môi trường build-time duy nhất cho cả SSR và Client runtime.
4. **`package.json`**: Thêm `playwright` vào `devDependencies`, thêm lệnh `test:seo-consistency`.
5. **`tests/spike/test-hydration-404.cjs`**: Loại bỏ đường dẫn hardcoded, dùng `require('playwright')`.
6. **`tests/e2e/2b-verification.cjs`**: Loại bỏ fallback hardcoded path, dùng `require('playwright')`.
7. **`tests/spike/test-seo-consistency.cjs`**: *(Mới)* Script kiểm thử tính đồng nhất giữa HTML tĩnh và DOM sau hydration.
8. **Thư mục báo cáo `docs/spikes/architecture-01/hardening-02-fix01/`**:
   - `fix01-summary.md`
   - `vercel-output-verification.md`
   - `seo-environment-verification.md`
   - `content-audit-corrections.md`
   - `portable-test-results.md`
   - `regression-results.md`
   - `preview-readiness.md`
   - `handoff.md`

---

## IV. BẢO ĐẢM KỶ LUẬT GIT VÀ GIỚI HẠN TRIỂN KHAI

- Nhánh thực hiện: `spike/architecture-01-hardening-02-fix01` hoàn toàn độc lập trong worktree `D:\webbvct-hardening-02-fix01`.
- Thư mục gốc `D:\webbvct` trên nhánh `docs/phase-3b-00` không bị thay đổi.
- Nhánh sản phẩm `main` và baseline 3A không bị can thiệp.
- **Tuyệt đối không thực hiện deployment:** Không chạy lệnh deploy, không chỉnh sửa project settings trên Vercel. Quyền quyết định tạo một bản Preview duy nhất thuộc về Chủ dự án.
