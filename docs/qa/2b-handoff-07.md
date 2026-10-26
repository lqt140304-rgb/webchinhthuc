# Báo Cáo Bàn Giao Vercel Preview Readiness & Sửa 2B-28 (QA 2B-07) — Antigravity

| Mục | Chi tiết |
|---|---|
| **Người thực hiện** | Antigravity (Designer & Developer, theo `AGENTS.md`) |
| **Ngày thực hiện** | 26/10/2026 |
| **Căn cứ chỉ đạo** | [CEO DIRECTIVE 012-A (VERCEL PREVIEW READINESS)](#) & Báo cáo Claude QA `docs/qa/2b-qa-06.md` |
| **Nhánh làm việc** | `fix/milestone-2a-qa` |
| **SHA cơ sở được kiểm tra trước** | `b8d5dd2` (QA 2B-06: Mobile 86 / LCP 3.76s, Desktop 99 / LCP 0.85s — Lỗi 2B-28) |
| **Trạng thái mốc** | **READY FOR VERCEL INDEPENDENT QA** |

---

## 1. Kết Quả Sửa Lỗi 2B-28 (`scripts/optimize-fonts.cjs`)

### A. Vấn đề phát hiện bởi Claude QA 2B-06:
- Tệp `scripts/optimize-fonts.cjs` còn chứa định nghĩa và logic tải cho 2 tệp phông đã xóa (`lora-400.woff2` và `lora-700.woff2`).
- Nếu chạy script này, nó sẽ tự động ghi đè tệp `src/styles/fonts.css` về cấu hình 8 quy tắc cũ, phá vỡ Phương án C (Tiered Loading Strategy) đã được duyệt và làm hỏng kết quả PASS của lỗi 2B-25.
- Tệp `scripts/download-fonts.cjs` cũ vẫn còn mã tải 21 subset phân mảnh từ Google Fonts.

### B. Giải pháp kỹ thuật đã triển khai:
1. **Đồng bộ hóa 100% với Phương án C đã duyệt:**
   - Cập nhật danh sách `fontFiles` trong [`scripts/optimize-fonts.cjs`](file:///d:/webbvct/scripts/optimize-fonts.cjs) chỉ gồm đúng 6 tệp phông WOFF2 đơn nhất hoàn chỉnh:
     1. `be-vietnam-pro-400.woff2` (Critical — Regular 400)
     2. `be-vietnam-pro-500.woff2` (Secondary — True Weight 500)
     3. `be-vietnam-pro-600.woff2` (Critical — SemiBold 600)
     4. `be-vietnam-pro-700.woff2` (Secondary — True Weight 700)
     5. `be-vietnam-pro-italic-400.woff2` (Secondary — True Italic 400)
     6. `lora-600.woff2` (Critical — Approved Editorial Headings 400 900)
2. **Tính bất biến & idempotent:**
   - Script kiểm tra các tệp phông đã tồn tại hợp lệ trên đĩa, không tải lại nếu không có cờ `--force`.
   - Script tự động dọn dẹp các tệp phông không được duyệt nếu phát hiện trong `public/fonts/`.
   - Nội dung CSS sinh ra khớp chính xác tuyệt đối với [`src/styles/fonts.css`](file:///d:/webbvct/src/styles/fonts.css).
3. **Vô hiệu hóa an toàn `scripts/download-fonts.cjs`:**
   - Thay thế toàn bộ mã nguồn cũ bằng wrapper phát cảnh báo `DEPRECATED` và chuyển tiếp an toàn sang gọi `scripts/optimize-fonts.cjs`.
4. **Bằng chứng kiểm chứng trước / sau:**
   - Chạy thử nghiệm nhiều lần: `node scripts/optimize-fonts.cjs` và `node scripts/download-fonts.cjs`.
   - Lệnh `git diff src/styles/fonts.css public/fonts/` trả về **0 thay đổi** (hoàn toàn sạch sẽ, bảo toàn 100% typography 2B-25).

---

## 2. Chuẩn Bị Vercel Preview (Nhiệm Vụ 2)

### A. Kiểm tra cấu hình triển khai Repository:
1. **Framework Preset:** `Vite`
2. **Build Command:** `npm run build` (`tsc -b && vite build`) — Thành công trong **362ms**.
3. **Output Directory:** `dist`
4. **Cấu hình SPA Fallback (`vercel.json`):**
   ```json
   "rewrites": [
     {
       "source": "/(.*)",
       "destination": "/index.html"
     }
   ]
   ```
   Đảm bảo tất cả các tuyến đường công khai (`/`, `/dat-lich`, `/dich-vu/*`, `/bai-viet/*`, v.v.) tải được trực tiếp và khi refresh (F5).
5. **Không ghi dữ liệu thật:**
   - Form `/dat-lich` hoạt động hoàn toàn ở client-side demo, không có kết nối backend, không gửi POST request ra ngoài.
   - Không chứa bất kỳ API keys, secrets hay dữ liệu cá nhân (PII), bệnh án thật nào trong repo.

### B. Trạng thái Vercel Deployment (A04):
- **Trạng thái:** **BLOCKED — CHỜ CHỦ DỰ ÁN LIÊN KẾT DỰ ÁN VERCEL**.
- **Căn cứ phân vai (`AGENTS.md` & CEO Directive 012-A):**
  - Antigravity là Designer & Developer, không nắm giữ tài khoản Vercel, token triển khai hay quyền cấu hình domain của Chủ dự án.
  - Repository hiện tại chưa liên kết Vercel Project (chưa có `.vercel`).
  - Tuyệt đối không tự ý khẳng định đã deploy khi chưa có URL thực tế từ Chủ dự án.

### C. Hướng dẫn các bước để Chủ dự án liên kết và kích hoạt Vercel Preview:
1. Đăng nhập vào [Vercel Dashboard](https://vercel.com).
2. Chọn **Add New...** -> **Project** -> Chọn Git Repository: `lqt140304-rgb/webchinhthuc`.
3. Kiểm tra cấu hình Project Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Nhấn **Deploy** (hoặc chọn nhánh `fix/milestone-2a-qa` để tạo Preview Deployment).
5. Sau khi Vercel build xong, sao chép URL Preview (dạng `https://webchinhthuc-git-fix-milestone-2a-qa-*.vercel.app`) và cung cấp cho Claude để chạy kiểm tra A04 trên host thật.

---

## 3. Đánh Giá Hạng Mục A05 — HTTP noindex

Theo đúng yêu cầu phân định của CEO Directive 012-A:

### A. Cơ chế bảo vệ của Vercel Preview Deployment:
- Mọi bản Preview Deployment trên nhánh thử nghiệm (không phải nhánh Production `main`) đều được Vercel tự động bảo vệ bằng header `X-Robots-Tag: noindex` (hoặc cấu hình Vercel Authentication / Deployment Protection), ngăn chặn hoàn toàn việc Google lập chỉ mục bản nháp.

### B. Cấu hình noindex theo từng tuyến đường trên Production (`vercel.json`):
- Để bảo vệ website khi phát hành chính thức mà **không áp dụng noindex toàn trang**:
  - **Tuyến đường nhận `X-Robots-Tag: noindex, nofollow`:**
    1. Tuyến đang chờ xuất bản: `/(gioi-thieu|doi-ngu|co-so-vat-chat|bang-gia|san-pham|dat-lich|lien-he|dang-nhap|dang-ky)` và `/:path*`.
    2. Cổng thông tin & nội dung sâu: `/(dich-vu|cau-chuyen|goc-thu-cung|bai-viet|tai-khoan|quan-ly)` và `/:path*`.
  - **Tuyến đường KHÔNG bị noindex:**
    - Trang chủ `/` (bảo toàn SEO khi ra mắt).
    - `robots.txt`, `sitemap.xml`.
    - Tài nguyên tĩnh: `/assets/*`, `/images/*`, `/fonts/*`.

### C. Trường hợp URL không tồn tại (Soft 404):
- **Hiện trạng kỹ thuật SPA tĩnh:** Với cấu hình rewrite `/(.*) -> /index.html` thuần túy trên Vercel, máy chủ web trả về HTTP 200 kèm `index.html`.
- **Cơ chế bảo vệ hiện tại:** Phía client, component [`src/pages/NotFoundPage.tsx`](file:///d:/webbvct/src/pages/NotFoundPage.tsx) tự động kích hoạt `useRouteSeo()` để:
  - Thêm thẻ `<meta name="robots" content="noindex, nofollow" />`.
  - Gỡ bỏ thẻ `<link rel="canonical">`.
  - Hiển thị thông báo 404 thân thiện và nút quay về Trang chủ.
- **Đề xuất phương án nâng cao (nếu yêu cầu mã trạng thái HTTP 404 từ server):**
  - Tích hợp **Vercel Edge Middleware** (`middleware.ts`) ở Giai đoạn 4: Đối chiếu URL với danh sách route hợp lệ; nếu không khớp, trả về phản hồi với HTTP Status `404` và header `X-Robots-Tag: noindex, nofollow` trước khi render.

---

## 4. Kết Quả Kiểm Thử Tự Động Trước Bàn Giao

| Bộ kiểm thử | Lệnh thực hiện | Kết quả thực tế | Ghi chú |
|---|---|:---:|---|
| **Linter** | `npx oxlint` | **0 errors, 0 warnings** | 41 files kiểm tra |
| **TypeScript** | `npx tsc -b` | **0 errors** | Kiểm tra kiểu chặt chẽ |
| **Production Build** | `npm run build` | **Thành công (362ms)** | CSS: 61.36 kB, JS: 369.95 kB |
| **Typography Verification** | `node scripts/verify-typography.cjs` | **100% PASS** | 6 trọng số thật (400, 500, 600, 700, Italic, Lora 600) |
| **E2E 2B Booking** | `node --test tests/e2e/2b-booking.e2e.test.cjs` | **16 PASS / 0 FAIL** | Nghiệm thu form `/dat-lich` |
| **E2E 2B Core** | `node --test tests/e2e/2b.e2e.test.cjs` | **27 PASS / 0 FAIL** | 6 section trang chủ, responsive, a11y |
| **E2E 2A Regression** | `node --test tests/e2e/2a.e2e.test.cjs` | **51 PASS / 0 FAIL / 2 BLOCKED** | 2 BLOCKED là A04 & A05 (host pre-release) |
| **E2E 2A R2 & R3** | `node --test tests/e2e/2a-round02.e2e.test.cjs tests/e2e/2a-round03.e2e.test.cjs` | **45 PASS / 0 FAIL / 2 BLOCKED** | 2 BLOCKED là host đích và APP_DIR |
| **Console Errors** | Ghi nhận qua Playwright | **0 errors / 0 pageerrors** | Toàn bộ quy trình sạch lỗi console |

---

## 5. Danh Sách Tệp Đã Thay Đổi Trong Vòng Này

1. [`scripts/optimize-fonts.cjs`](file:///d:/webbvct/scripts/optimize-fonts.cjs): Đồng bộ hóa danh sách 6 phông duyệt Phương án C, xử lý triệt để 2B-28.
2. [`scripts/download-fonts.cjs`](file:///d:/webbvct/scripts/download-fonts.cjs): Vô hiệu hóa an toàn, chuyển tiếp sang `optimize-fonts.cjs`.
3. [`docs/qa/2b-handoff-07.md`](file:///d:/webbvct/docs/qa/2b-handoff-07.md): Báo cáo bàn giao chi tiết cho QA 2B-07.

---

## 6. Kết Luận & Tín Hiệu Bàn Giao

- Lỗi **2B-28** đã được xử lý triệt để, có bằng chứng đối chiếu trước/sau.
- Cấu hình Vercel Preview và A05 đã sẵn sàng 100% trong repo.
- Chờ Chủ dự án liên kết project trên Vercel để lấy Preview URL thực tế.

**Tín hiệu bàn giao:** **READY FOR VERCEL INDEPENDENT QA**
