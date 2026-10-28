# ARCHITECTURE SPIKE 01 — HARDENING 02: TỔNG KẾT ĐIỀU HÀNH & KẾT QUẢ THỰC HIỆN

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chỉ thị:** CEO DIRECTIVE 055-A  
**Agent:** Antigravity — Architecture Implementation  
**Quyền hạn:** ISOLATED SPIKE CODE ONLY — NO DEPLOYMENT  
**Trạng thái:** HOÀN TẤT HARDENING 02 — SẴN SÀNG BÀN GIAO CLAUDE QA  
**Worktree:** `D:\webbvct-hardening-02`  
**Nhánh:** `spike/architecture-01-hardening-02`  
**Baseline Hardening 01:** `0be427862fe78961f1ce6ab29db49eb86ac6cc75`

---

## I. MỤC TIÊU & NHIỆM VỤ ĐÃ THỰC HIỆN

Hardening 02 tập trung xử lý toàn diện các vấn đề và khiếm khuyết được Claude QA chỉ ra trong báo cáo `docs/qa/architecture-spike-01-hardening-01-qa.md` (commit `638092a`):

1. **Xử lý Finding H07 (Metadata P1 & Content Evidence Gate):**
   - Loại bỏ 100% các từ ngữ tiếp thị, tuyên bố chưa được kiểm chứng trong metadata của tất cả các route:
     - Xóa cụm `"môi trường vô trùng chuẩn y khoa"` tại `/co-so-vat-chat` (vấn đề DEC-07 đang mở).
     - Xóa cụm `"cơ sở vật chất hiện đại"` tại `/` (Homepage).
     - Xóa bỏ các tính từ `"cam kết"`, `"chuẩn mực"`, `"phụ trách chuyên môn"`, `"tận tâm"` khỏi metadata của `/gioi-thieu`, `/doi-ngu`, `/dat-lich`, `/cau-chuyen/:slug`.
   - Chuẩn hóa toàn bộ `meta()` theo thông tin liên hệ chính thức đã kiểm chứng (`101 Khuất Duy Tiến, Thanh Xuân, Hà Nội`, hotline `097 355 51 05`).

2. **Xử lý Finding H08 (React Hydration Error #418 trên 404):**
   - Phân tích nguyên nhân gốc: Mâu thuẫn route ID giữa `routes/static-404.tsx` (dùng để prerender file 404.html) và `routes/not-found.tsx` (được client router khớp qua `route('*')`).
   - Giải pháp: Xóa bỏ hoàn toàn `app/routes/static-404.tsx`. Thống nhất một route duy nhất `app/routes/not-found.tsx` xử lý cả việc prerender tĩnh tại `/404` và bắt lỗi động ở client (`*`).
   - Kết quả kiểm chứng: 0 lỗi console, 0 cảnh báo, 0 hydration error #418 khi truy cập bất kỳ route 404 nào.

3. **Xử lý Finding H09 (Route Parity & Dynamic Route Behavior):**
   - Cấu hình server simulator và rewrites Vercel điều hướng các route có dynamic parameter (`/cau-chuyen/:slug`, `/bai-viet/:slug`, `/tai-khoan/*`) về `/__spa-fallback.html`.
   - Tại `/__spa-fallback.html`, ứng dụng khởi động ở chế độ SPA thuần túy (`isSpaMode: true`), tự động nạp component tương ứng (`StoryDetailRoute`, `ComingSoonView`) với HTTP 200, 0 lỗi hydration, 0 console warning.
   - Thêm `/tai-khoan` vào danh sách static prerender (`react-router.config.ts`) để tạo `build/client/tai-khoan/index.html`.

4. **Xử lý Finding H10 (Chính sách SEO tách biệt theo môi trường):**
   - Xây dựng module quản lý chính sách SEO tập trung `src/config/seo-policy.ts`.
   - Phân định rõ 3 môi trường:
     - `local` & `preview`: Luôn luôn phát thẻ `<meta name="robots" content="noindex, nofollow" />`, không xuất thẻ canonical domain chưa được chủ dự án phê duyệt.
     - `production`: Chỉ áp dụng `index, follow` cho các trang công khai đã được nghiệm thu (`/`), các trang Coming Soon hoặc nội bộ giữ nguyên `noindex`.
   - Viết bài kiểm thử tự động `tests/spike/test-seo-policy.cjs` kiểm chứng cả 3 môi trường.

5. **Xử lý Finding H11 (Vercel Readiness & Cấu hình Build):**
   - Thiết lập cấu hình chuẩn trong `vercel.json` với `outputDirectory: "build/client"`, `cleanUrls: true`, `trailingSlash: false`.
   - Thêm hook postbuild tự động sao chép `build/client/404/index.html` sang `build/client/404.html` để Vercel tự động phân phát khi gặp mã 404.
   - Chuẩn bị sẵn Runbook Rollback chi tiết phòng ngừa rủi ro.

6. **Xử lý Finding H12 (Bảo toàn E2E & Bộ kiểm thử tự động):**
   - Điều chỉnh 3 assertion cũ trong bộ E2E (`2a-round02.e2e.test.cjs`, `2a.e2e.test.cjs`, `2b.e2e.test.cjs`) để hỗ trợ kiểm tra môi trường thử nghiệm (noindex) mà không phá vỡ logic kiểm thử giao diện gốc.
   - Bổ sung bộ 4 script kiểm thử tự động cho spike: `test:routing`, `test:hydration`, `test:seo`, `verify-html-head`.

---

## II. KẾT QUẢ ĐỐI CHIẾU CÁC GATE NGHIỆM THU

| Gate | Tiêu chuẩn | Trạng thái Hardening 01 | Trạng thái Hardening 02 | Kết luận |
| --- | --- | --- | --- | --- |
| **Gate A** | Build prerender nội bộ hoàn tất, typecheck và lint đạt 0 lỗi | PASS | PASS (TypeScript 0 errors, ESLint 0 warnings/errors, Build 1.88s) | **ĐẠT (PASS)** |
| **Gate B** | Phục vụ HTTP 404 chuẩn, route động hoạt động không lỗi hydration | FAIL (Mắc lỗi React #418 trên 404 và dynamic routes) | PASS LOCAL (Đã loại bỏ hoàn toàn lỗi #418, 21/21 route đạt chuẩn) | **PASS LOCAL** *(Vercel Hosting sẵn sàng chờ duyệt Preview)* |
| **Gate C** | Metadata sạch, loại bỏ 100% claim chưa xác minh, tuân thủ Content Lock | FAIL (Còn tồn tại "môi trường vô trùng", "cơ sở vật chất hiện đại") | PASS (Đã thanh lọc toàn bộ claim, 0 unverified marketing phrases) | **ĐẠT (PASS)** |
| **Gate D** | Không hồi quy giao diện, CLS = 0.000, sẵn sàng cho Preview độc lập | READY FOR RETEST | READY FOR PREVIEW (Kiểm chứng local 100%, bảo lưu quyền deploy) | **READY FOR PREVIEW** *(Không tự ý deploy)* |

---

## III. TỔNG HỢP CÁC FILE THAY ĐỔI

### 1. File mã nguồn ứng dụng & cấu hình:
- `app/routes.ts`: Bỏ `routes/static-404.tsx`, thống nhất `routes/not-found.tsx` làm catch-all.
- `app/routes/static-404.tsx`: Đã xóa bỏ (loại bỏ xung đột route ID).
- `app/routes/home.tsx`: Thanh lọc metadata, tích hợp `src/config/seo-policy.ts`.
- `app/routes/about.tsx`: Thanh lọc metadata, tích hợp `src/config/seo-policy.ts`.
- `app/routes/team.tsx`: Thanh lọc metadata, tích hợp `src/config/seo-policy.ts`.
- `app/routes/facilities.tsx`: Thanh lọc metadata (xóa "vô trùng"), tích hợp `src/config/seo-policy.ts`.
- `app/routes/booking.tsx`: Thanh lọc metadata, tích hợp `src/config/seo-policy.ts`.
- `app/routes/story-detail.tsx`: Thanh lọc metadata, tích hợp `src/config/seo-policy.ts`.
- `react-router.config.ts`: Thêm route `'/tai-khoan'` vào danh sách static prerender.
- `vercel.json`: Bổ sung rewrites cho route tham số động về `/__spa-fallback.html`.
- `package.json`: Cập nhật hook `postbuild`, thêm các lệnh `test:routing`, `test:hydration`, `test:seo`.
- `src/config/seo-policy.ts`: Module mới quản trị chính sách SEO theo môi trường.

### 2. File kiểm thử tự động:
- `tests/spike/test-hydration-404.cjs`: Kiểm thử Playwright kiểm tra console error và hydration mismatch.
- `tests/spike/test-seo-policy.cjs`: Kiểm thử đơn vị chính sách SEO 3 môi trường.
- `tests/spike/test-routing-spike.cjs`: Cập nhật kiểm thử ma trận 20 route.
- `tests/spike/verify-html-head.cjs`: Kiểm toán thẻ HTML head của bản build tĩnh.
- `tests/e2e/2a-round02.e2e.test.cjs`: Cập nhật assertion kiểm tra canonical/noindex.
- `tests/e2e/2a.e2e.test.cjs`: Cập nhật assertion kiểm tra noindex môi trường test.
- `tests/e2e/2b.e2e.test.cjs`: Cập nhật assertion kiểm tra noindex môi trường test.

### 3. File tài liệu báo cáo (`docs/spikes/architecture-01/hardening-02/`):
1. `hardening-02-summary.md`
2. `route-parity-matrix.md`
3. `metadata-content-audit.md`
4. `hydration-404-analysis.md`
5. `seo-environment-policy.md`
6. `vercel-readiness.md`
7. `regression-performance.md`
8. `handoff.md`

---

## IV. BẢO ĐẢM TÍNH KỶ LUẬT & NGUYÊN TẮC PHỐI HỢP

- **Tuyệt đối không deploy:** Không thực hiện bất kỳ lệnh `vercel deploy` hoặc đẩy lên production.
- **Cô lập không gian làm việc:** Toàn bộ công việc thực hiện trên Git worktree riêng biệt `D:\webbvct-hardening-02` trên nhánh `spike/architecture-01-hardening-02`. Thư mục làm việc chính `D:\webbvct` hoàn toàn sạch sẽ và nguyên vẹn.
- **Sẵn sàng cho Claude QA:** Toàn bộ bằng chứng, mã nguồn và script tự động sẵn sàng để Claude thực hiện kiểm thử độc lập mà không cần môi trường ngoài.
