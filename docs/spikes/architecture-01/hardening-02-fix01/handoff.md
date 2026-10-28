# ARCHITECTURE SPIKE 01 — HARDENING 02 FIX 01: BÁO CÁO BÀN GIAO CHÍNH THỨC CHO CLAUDE QA (HANDOFF REPORT)

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chỉ thị điều phối:** CEO DIRECTIVE 058-A  
**Agent thực hiện:** Antigravity — Architecture Implementation  
**Agent kiểm định độc lập:** Claude — Independent Architecture QA Lead  
**Worktree:** `D:\webbvct-hardening-02-fix01`  
**Nhánh:** `spike/architecture-01-hardening-02-fix01`  
**Base Commit (Hardening 02):** `bacc62afebcd531a23a1fc6f52724f1799557000`  
**Commit SHA Bàn giao:** `f46feeb8d4eacbb3a653ef079a0b7d3db317ada9`  
**Quyền hạn:** LOCAL EXPERIMENTAL BRANCH ONLY — **DEPLOYMENT STRICTLY PROHIBITED**  

---

## I. TỔNG QUAN BÀN GIAO & KẾT QUẢ XỬ LÝ F01–F05

Thực hiện nghiêm túc chỉ thị **CEO DIRECTIVE 058-A**, Antigravity đã hoàn thành trọn vẹn 5 nhiệm vụ sửa lỗi kỹ thuật sau báo cáo đánh giá của Claude Independent QA:

1. **F01 (`3B-H2-P2-1`) — Cấu hình Output Vercel:**
   - Đã cập nhật `vercel.json` bổ sung: `"buildCommand": "npm run build"`, `"outputDirectory": "build/client"`, `"cleanUrls": true`, `"trailingSlash": false`.
   - Kiểm toán thư mục đầu ra `build/client`: chứa đầy đủ 19 trang HTML prerender, `404.html`, `__spa-fallback.html`, CSS, JS và static assets.
   - Phân tích chi tiết thứ tự ưu tiên cấu hình Vercel Dashboard vs file `vercel.json` trong tài liệu `vercel-output-verification.md`.
   - Đính chính toàn bộ các phát biểu sai lệch trong tài liệu Hardening 02 trước đây.
2. **F02 (`3B-H2-P2-2`) — Nhất quán chính sách SEO theo môi trường:**
   - Thống nhất luồng giá trị môi trường bằng hằng số biên dịch `__APP_ENV__` được Vite tiêm vào qua `define` trong `vite.config.ts`.
   - Cả SSR prerender và Client hydrated bundle đều đọc chung một giá trị môi trường, triệt tiêu 100% nguy cơ mâu thuẫn thẻ robots hoặc sinh hai thẻ robots trong `<head>`.
   - Đã kiểm chứng tự động bằng Playwright trên cả bản build Local/Preview (`noindex, nofollow`) và Production giả lập (`index, follow` trên trang chủ, `noindex` trên trang riêng tư).
3. **F03 (`3B-H2-P2-3`, `3B-H2-P2-4`) — Sửa đổi Content Audit Register:**
   - Đính chính rõ nguồn gốc claim "Vô trùng" là do Spike tạo ra và đã bị REJECTED / LOẠI BỎ khỏi metadata; không thuộc baseline 3A.
   - Sửa chính xác vị trí của "Khử khuẩn" (`FeaturedServices.tsx:31`), "Trực đêm" (`FeaturedServices.tsx:141`), "Theo dõi sức khỏe liên tục" (`FeaturedServices.tsx:31`), "Chẩn đoán hình ảnh" (`FeaturedServices.tsx:22`).
   - Xóa bỏ claim không có thật "buồng cách ly".
   - Chuẩn hóa giờ tiếp nhận `08:00 – 21:00` theo đúng `src/config/contact.ts`.
   - Thống kê đầy đủ các vị trí vẫn còn chứa "24/7" trong baseline 3A.
   - Bổ sung vai trò thẩm quyền phê duyệt (Chủ dự án, Giám đốc chuyên môn / Bác sĩ có thẩm quyền, Pháp chế) và gắn nhãn PENDING cho toàn bộ các claim y khoa cần xử lý trước khi lên Production.
4. **F04 (`3B-H2-P2-5`) — Bộ kiểm thử tự chứa và khả chuyển (Portable):**
   - Đã thêm `playwright` vào `devDependencies` của `package.json`.
   - Loại bỏ 100% các đường dẫn tuyệt đối máy cá nhân `C:/Users/Admin/...` trong `tests/spike/test-hydration-404.cjs` và `tests/e2e/2b-verification.cjs`.
   - Xây dựng preview server nội bộ `scripts/preview-server.cjs` khớp với `vercel.json`, cho phép chạy kiểm thử E2E độc lập, chuẩn xác mà không bị crash do Vite SPA fallback.
5. **F05 — Bằng chứng kiểm thử hồi quy & QA Evidence:**
   - Typecheck: 0 lỗi.
   - Linter: 0 cảnh báo, 0 lỗi.
   - Routing: 20/20 kịch bản đạt chuẩn HTTP status.
   - Hydration: 8/8 kịch bản route phức tạp đạt 0 lỗi console, 0 React error #418.
   - Responsive: 7 viewports trên cả `/` và `/dat-lich` đạt 0 lỗi console, CLS = 0.000.
   - Quản trị đầy đủ backlog P3 (`3B-H2-P3-1` đến `3B-H2-P3-5`).

---

## II. ĐỐI CHIẾU TRẠNG THÁI CÁC GATE CHỈ THỊ 058-A

| Gate | Tiêu chuẩn đánh giá | Kết luận của Antigravity | Bằng chứng kiểm chứng |
| --- | --- | --- | --- |
| **Gate A — Rendering / SEO** | Metadata sạch, không xung đột robots giữa HTML và DOM client, Preview noindex, Production mô phỏng nhất quán | **PASS LOCAL & PROD-SIMULATED** | `npm run test:seo-consistency` (0 conflicting tags, 1 robots tag duy nhất) |
| **Gate B — Routing / Privacy** | 21/21 route parity, 404 đúng, dynamic routes đúng, không hydration error, không lộ dữ liệu | **PASS LOCAL** | `npm run test:routing`, `npm run test:hydration` (0 error #418) |
| **Gate C — Regression** | Clean build, typecheck, lint đạt 0 lỗi, test portable không phụ thuộc máy, không visual regression | **PASS** | `tsc -b` (0 errors), `oxlint` (0 errors/warnings), Playwright trong devDependencies |
| **Gate D — Hosting / Social** | Cấu hình output hợp lý, sẵn sàng cho Preview, không tự ý deploy | **READY FOR OWNER-APPROVED PREVIEW** | `outputDirectory: "build/client"`, cleanUrls, trailingSlash trong `vercel.json` |

---

## III. BẢNG TRẠNG THÁI CÁC VẤN ĐỀ TỒN ĐỌNG (P0/P1/P2/P3)

- **P0 / P1:** **KHÔNG CÒN (ZERO)**.
- **P2:**
  - `3B-H2-P2-1` (Cấu hình Vercel Output): **ĐÃ ĐÓNG (CLOSED)**.
  - `3B-H2-P2-2` (Xung đột SEO Production): **ĐÃ ĐÓNG (CLOSED)**.
  - `3B-H2-P2-3` (Sai sót Content Register): **ĐÃ ĐÓNG (CLOSED)**.
  - `3B-H2-P2-4` (Claim 3A trong Prerender HTML): **ĐÃ GHI NHẬN VÀO REGISTER** (Cần Chủ dự án/Bác sĩ duyệt trước khi mở Production Index).
  - `3B-H2-P2-5` (Hardcoded Test Paths): **ĐÃ ĐÓNG (CLOSED)**.
- **P3 Backlog:**
  - `3B-H2-P3-1` (Test Production E2E): Đã bổ sung script `test:seo-consistency`.
  - `3B-H2-P3-2` (Nguy cơ Soft 404 slug tương lai): Chờ xử lý ở Giai đoạn 4 cùng CMS backend.
  - `3B-H2-P3-3` (Tăng dung lượng JS bundle 25%): Đánh đổi có lợi cho LCP di động; tối ưu ở Giai đoạn 4.
  - `3B-H2-P3-4` (Domain placeholder và 19 routes prerender): Đã đính chính số lượng 19 routes; đồng bộ domain khi chốt Production.
  - `3B-H2-P3-5` (Cảnh báo envFile/future flags): Deprecation framework, không ảnh hưởng vận hành.

---

## IV. DANH SÁCH FILE THAY ĐỔI & THÊM MỚI

### 1. Mã nguồn & Cấu hình:
- `vercel.json`: Bổ sung `buildCommand`, `outputDirectory: "build/client"`, `cleanUrls`, `trailingSlash`.
- `vite.config.ts`: Khai báo tiêm hằng số biên dịch `__APP_ENV__`.
- `src/config/seo-policy.ts`: Thống nhất đọc hằng số `__APP_ENV__`.
- `package.json`: Khai báo `playwright` vào `devDependencies`, cập nhật script `preview` và `test:seo-consistency`.
- `scripts/preview-server.cjs`: *(Mới)* Máy chủ tĩnh nội bộ mô phỏng chính xác hành vi của `vercel.json`.

### 2. Kiểm thử tự động:
- `tests/spike/test-hydration-404.cjs`: Dùng `require('playwright')` tiêu chuẩn.
- `tests/e2e/2b-verification.cjs`: Dùng `require('playwright')` tiêu chuẩn.
- `tests/spike/test-seo-consistency.cjs`: *(Mới)* Kiểm thử tính nhất quán giữa HTML prerender và DOM sau hydrate.

### 3. Tài liệu báo cáo (`docs/spikes/architecture-01/hardening-02-fix01/`):
- `fix01-summary.md`
- `vercel-output-verification.md`
- `seo-environment-verification.md`
- `content-audit-corrections.md`
- `portable-test-results.md`
- `regression-results.md`
- `preview-readiness.md`
- `handoff.md`

---

## V. HƯỚNG DẪN CLAUDE QA KIỂM TRA ĐỘC LẬP

Claude có thể thực hiện kiểm tra độc lập tại nhánh `spike/architecture-01-hardening-02-fix01`:

```bash
# 1. Cài đặt và kiểm tra chất lượng mã nguồn
npm.cmd run typecheck
npm.cmd run lint

# 2. Biên dịch bản build chuẩn và prerender
npm.cmd run build

# 3. Kiểm tra tính độc lập và khả chuyển của bộ kiểm thử Playwright
npm.cmd run test:hydration
npm.cmd run test:routing

# 4. Kiểm tra tính nhất quán SEO giữa HTML và hydrated DOM (Local & Simulated Production)
npm.cmd run test:seo-consistency

# 5. Kiểm tra preview server nội bộ
npm.cmd run preview -- --port 4173
```

---

## VI. TUYÊN BỐ KỶ LUẬT & TÍN HIỆU ĐÓNG PHIÊN

- Antigravity cam kết tuân thủ 100% quy chế phối hợp tại `AGENTS.md`.
- **Không thực hiện bất kỳ lệnh deployment nào.**
- Không can thiệp nhánh chính `main`, baseline 3A hoặc nhánh tài liệu 3B-00.
- Toàn bộ kết quả đã sẵn sàng bàn giao cho Agent Claude thực hiện kiểm định độc lập.

**ARCHITECTURE SPIKE 01 — HARDENING 02 FIX 01 READY FOR CLAUDE QA**
