# ARCHITECTURE SPIKE 01 — HARDENING 02: BÁO CÁO BÀN GIAO KIỂM THỬ ĐỘC LẬP (HANDOFF REPORT FOR CLAUDE QA)

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chỉ thị điều phối:** CEO DIRECTIVE 055-A  
**Agent thực hiện:** Antigravity — Architecture Implementation  
**Agent kiểm định độc lập:** Claude — Independent QA Reviewer  
**Worktree:** `D:\webbvct-hardening-02`  
**Nhánh:** `spike/architecture-01-hardening-02`  
**Base Commit (Hardening 01):** `0be427862fe78961f1ce6ab29db49eb86ac6cc75`  
**Commit SHA Bàn giao:** *(Cập nhật theo commit mới)*  
**Quyền hạn:** LOCAL SPIKE CODE ONLY — DEPLOYMENT STRICTLY PROHIBITED  

---

## I. TỔNG QUAN BÀN GIAO

Kính gửi Agent Claude (Independent QA Reviewer) và CEO,

Thực hiện nghiêm túc chỉ thị **CEO DIRECTIVE 055-A**, Antigravity đã hoàn thành toàn diện vòng sửa kỹ thuật **Hardening 02** cho Architecture Spike 01 (chuyển đổi Vite SPA sang React Router 7 Framework Mode kết hợp Static Prerender).

Tất cả các vấn đề và khiếm khuyết được chỉ ra trong báo cáo QA Hardening 01 (`docs/qa/architecture-spike-01-hardening-01-qa.md` @ commit `638092a`) đã được xử lý triệt để:
1. **Finding H07 (P1 Metadata Claims):** Đã xóa bỏ 100% các từ ngữ tiếp thị, tuyên bố y khoa chưa kiểm chứng (`vô trùng`, `hiện đại`, `cam kết`, `chuẩn mực`, `phụ trách chuyên môn`, `tận tâm`). Metadata được chuẩn hóa hoàn toàn theo thông tin thực tế đã xác nhận (`101 Khuất Duy Tiến, Thanh Xuân, Hà Nội`, hotline `097 355 51 05`).
2. **Finding H08 (P1 React Hydration Error #418):** Đã xóa bỏ hoàn toàn `app/routes/static-404.tsx`. Thống nhất một route duy nhất `app/routes/not-found.tsx` cho cả prerender tĩnh `/404` và catch-all client `*`. Xóa bỏ 100% mismatch Route Module ID.
3. **Finding H09 (P2 Route Parity & Dynamic Routes):** Cấu hình rewrites đưa các route tham số động (`/cau-chuyen/:slug`, `/bai-viet/:slug`, `/tai-khoan/*`) về `/__spa-fallback.html` (SPA mode thuần túy), trả về HTTP 200, hiển thị đúng component và đạt 0 lỗi console/hydration mismatch. Thêm `/tai-khoan` vào static prerender.
4. **Finding H10 (P2 SEO Policy by Environment):** Xây dựng module trung tâm `src/config/seo-policy.ts`. Môi trường Local/Spike và Vercel Preview luôn phát `noindex, nofollow` và không phát canonical domain giả định. Môi trường Production tương lai chỉ cho phép index trang chủ (`/`) khi có tên miền chính thức.
5. **Finding H11 (P2 Vercel Readiness & Rollback):** Tinh chỉnh `vercel.json` với `outputDirectory: "build/client"`, `cleanUrls: true`, `trailingSlash: false`, postbuild copy `404.html`, và lập sẵn Rollback Runbook chi tiết.
6. **Finding H12 (P2 E2E Adaptation & Test Suite):** Điều chỉnh 3 test assertion cũ trong bộ E2E tương thích với chính sách noindex môi trường thử nghiệm; bổ sung 4 script kiểm thử tự động nội bộ.

---

## II. ĐỐI CHIẾU CÁC GATE CHỈ THỊ 055-A

| Gate | Tiêu chuẩn đánh giá | Trạng thái | Ghi chú từ Developer |
| --- | --- | --- | --- |
| **Gate A** | Build prerender nội bộ hoàn tất, typecheck và lint đạt 0 lỗi | **PASS** | `npm run typecheck` 0 lỗi; `npm run lint` 0 lỗi; build 1.88s sinh 13 trang prerender. |
| **Gate B** | Phục vụ HTTP 404 chuẩn, route động hoạt động không lỗi hydration | **PASS LOCAL** | Đã triệt tiêu lỗi #418; 21/21 route kiểm chứng bằng Playwright đạt 0 lỗi. *Vercel Preview chờ Owner duyệt.* |
| **Gate C** | Metadata sạch, loại bỏ 100% claim chưa xác minh, tuân thủ Content Lock | **PASS** | 0 từ ngữ cấm trong metadata; Section X Content Audit Register đã ghi nhận đầy đủ các claim y tế baseline 3A. |
| **Gate D** | Không hồi quy giao diện, CLS = 0.000, sẵn sàng cho Preview độc lập | **READY FOR PREVIEW** | CLS = 0.000 trên toàn bộ trang; không tự ý deploy khi chưa có lệnh. |

---

## III. DANH SÁCH FILE THAY ĐỔI & THÊM MỚI

### 1. File mã nguồn & cấu hình đã chỉnh sửa:
- `app/routes.ts`: Bỏ route `404`, giữ duy nhất `route('*', 'routes/not-found.tsx')`.
- `app/routes/static-404.tsx`: **ĐÃ XÓA (DELETED)**.
- `app/routes/home.tsx`: Chuẩn hóa metadata, tích hợp `seo-policy.ts`.
- `app/routes/about.tsx`: Chuẩn hóa metadata, tích hợp `seo-policy.ts`.
- `app/routes/team.tsx`: Chuẩn hóa metadata, tích hợp `seo-policy.ts`.
- `app/routes/facilities.tsx`: Xóa cụm `"vô trùng"`, chuẩn hóa metadata, tích hợp `seo-policy.ts`.
- `app/routes/booking.tsx`: Chuẩn hóa metadata, tích hợp `seo-policy.ts`.
- `app/routes/story-detail.tsx`: Chuẩn hóa metadata, tích hợp `seo-policy.ts`.
- `react-router.config.ts`: Thêm `'/tai-khoan'` vào danh sách tĩnh prerender.
- `vercel.json`: Bổ sung rewrites cho route tham số động về `/__spa-fallback.html`.
- `package.json`: Cập nhật hook postbuild, bổ sung các test scripts (`test:routing`, `test:hydration`, `test:seo`).
- `src/config/seo-policy.ts`: **MỚI (NEW)** — Quản trị chính sách SEO theo môi trường.

### 2. File kiểm thử tự động:
- `tests/spike/test-hydration-404.cjs`: **MỚI (NEW)** — Kiểm thử Playwright console errors & React #418.
- `tests/spike/test-seo-policy.cjs`: **MỚI (NEW)** — Kiểm thử đơn vị chính sách SEO 3 môi trường.
- `tests/spike/verify-html-head.cjs`: **MỚI (NEW)** — Kiểm toán thẻ head trong HTML build tĩnh.
- `tests/spike/test-routing-spike.cjs`: Cập nhật kịch bản 20 route.
- `tests/e2e/2a-round02.e2e.test.cjs`: Cập nhật assertion canonical/noindex.
- `tests/e2e/2a.e2e.test.cjs`: Cập nhật assertion noindex.
- `tests/e2e/2b.e2e.test.cjs`: Cập nhật assertion noindex.

### 3. File tài liệu báo cáo (`docs/spikes/architecture-01/hardening-02/`):
- `hardening-02-summary.md`
- `route-parity-matrix.md`
- `metadata-content-audit.md`
- `hydration-404-analysis.md`
- `seo-environment-policy.md`
- `vercel-readiness.md`
- `regression-performance.md`
- `handoff.md`

---

## IV. HƯỚNG DẪN THỰC THI KIỂM THỬ DÀNH CHO CLAUDE QA

Claude có thể thực hiện kiểm thử độc lập trực tiếp trong Git worktree bằng các lệnh tiêu chuẩn sau:

### Bước 1: Kiểm tra chất lượng mã nguồn
```bash
npm run typecheck
npm run lint
```
*Kỳ vọng:* TypeScript không có lỗi (`Found 0 errors`), ESLint không có lỗi hoặc cảnh báo.

### Bước 2: Kiểm tra biên dịch và Prerender tĩnh
```bash
npm run build
```
*Kỳ vọng:* Biên dịch thành công trong khoảng ~1.8 - 2.0 giây; 13 route được prerender; file `build/client/404.html` được tự động copy qua postbuild.

### Bước 3: Chạy bộ kiểm thử định tuyến và HTTP Status
```bash
npm run test:routing
```
*Kỳ vọng:* 20/20 kịch bản URL đạt HTTP 200 cho trang hợp lệ/dynamic SPA fallback và HTTP 404 cho trang không tồn tại.

### Bước 4: Chạy bộ kiểm thử Hydration và Console Error (Playwright)
```bash
npm run test:hydration
```
*Kỳ vọng:* 8/8 kịch bản (bao gồm các URL 404, dynamic stories, portal routes) đạt **Clean (0 errors)**, hoàn toàn không có Minified React Error #418.

### Bước 5: Kiểm tra chính sách SEO
```bash
npm run test:seo
node tests/spike/verify-html-head.cjs
```
*Kỳ vọng:* Tất cả các trang đều có `robots: noindex, nofollow` trong môi trường local/preview; không xuất hiện bất kỳ từ ngữ tiếp thị vi phạm nào.

---

## V. TUYÊN BỐ PHÂN VAI VÀ KỶ LUẬT

Theo đúng quy định tại `AGENTS.md`:
- Antigravity chỉ đóng vai trò Designer & Developer, chịu trách nhiệm thiết kế, lập trình và cung cấp bằng chứng kỹ thuật.
- Tuyệt đối không tự ý deploy lên Vercel Preview hoặc Production.
- Kính chuyển toàn bộ kết quả để Claude thực hiện Independent QA Review.
