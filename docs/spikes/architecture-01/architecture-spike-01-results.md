# BÁO CÁO KẾT QUẢ THỬ NGHIỆM — ARCHITECTURE SPIKE 01
## Phân Tích Thực Nghiệm: React Router 7 Framework Mode + Prerender

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 049-A** |
| **Nhánh Spike** | `spike/architecture-01-rr7-prerender` |
| **Baseline đối chiếu** | `4739d45cc95100b587381b6bdcad6935352b23e8` |
| **Trạng thái Gate A** | **PASS** (100% Raw HTML có đầy đủ metadata và nội dung độc lập theo route) |
| **Trạng thái Gate B** | **PARTIAL** (Local Routing Simulator: PASS; Live Vercel Edge: Chờ thẩm định thực tế) |
| **Trạng thái Gate C** | **PASS** (Build thành công, Typecheck 0 error, Oxlint 0 error/0 warning, Bundle cân bằng) |
| **Trạng thái Gate D** | **PARTIAL / NOT TESTED** (Phân tích cấu hình hoàn thành; Chưa deploy Vercel theo quy chế) |

---

## 1. TỔNG QUAN KẾT QUẢ CÁC CỔNG KIỂM ĐỊNH (EXECUTIVE SUMMARY)

```text
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                     KẾT QUẢ THỰC NGHIỆM ARCHITECTURE SPIKE 01                         │
├───────────────────┬──────────────┬────────────────────────────────────────────────────┤
│ Cổng kiểm định    │ Kết luận     │ Minh chứng thực nghiệm                             │
├───────────────────┼──────────────┼────────────────────────────────────────────────────┤
│ GATE A: SEO & HTML│ PASS         │ 7 file HTML tĩnh sinh ra độc lập, tiêu đề riêng,   │
│                   │              │ meta description riêng, Open Graph riêng, h1/p có  │
│                   │              │ mặt ngay trong HTML gốc không cần JavaScript.      │
├───────────────────┼──────────────┼────────────────────────────────────────────────────┤
│ GATE B: Routing   │ PARTIAL      │ Simulator máy chủ local: HTTP 200 cho trang tĩnh,  │
│                   │              │ HTTP 200 SPA fallback cho /tai-khoan, HTTP 404 thực│
│                   │              │ cho URL sai. Trên Vercel cần cấu hình rewrites mới.│
├───────────────────┼──────────────┼────────────────────────────────────────────────────┤
│ GATE C: Hiệu năng │ PASS         │ Build 1.22s + Prerender 0.4s. Oxlint: 0 error /    │
│                   │              │ 0 warning (85 files). TypeScript: 0 error.         │
│                   │              │ Tận dụng 100% component 3A không cần viết lại.     │
├───────────────────┼──────────────┼────────────────────────────────────────────────────┤
│ GATE D: Hosting   │ PARTIAL /    │ Không thực hiện deploy. Đã phân tích kiến trúc     │
│                   │ NOT TESTED   │ vercel.json và phương án xử lý Soft 404.           │
└───────────────────┴──────────────┴────────────────────────────────────────────────────┘
```

---

## 2. KẾT QUẢ CHI TIẾT GATE A — RENDERING & SEO

### 2.1. Phân biệt bản chất kiến trúc
- **Build-Time Prerendering (`ssr: false`):** Trong quá trình chạy lệnh `react-router build`, Node.js thực thi các route trong danh sách `prerender()` để kết xuất thành các tệp tin HTML tĩnh hoàn chỉnh đặt tại thư mục `build/client/<path>/index.html`.
- **Hoàn toàn KHÔNG phải Runtime SSR:** Sau khi hoàn thành build, toàn bộ thư mục `build/server/` được tự động dọn dẹp và xóa bỏ (`Removing the server build due to ssr:false`). Khi vận hành trên máy chủ web hoặc CDN (Vercel), hệ thống là một **Static Site thuần túy**, không tiêu tốn tài nguyên serverless function và không có độ trễ khởi động lạnh (Cold Start = 0ms).
- **Client-Side Hydration:** Khi người dùng truy cập trang, trình duyệt hiển thị ngay lập tức mã HTML tĩnh ngữ nghĩa và các thẻ meta. Sau đó các bundle nhỏ của React Router tải nền và "bù nước" (hydrate) để kích hoạt tương tác client-side mà không gây chớp giật giao diện.

### 2.2. Bằng chứng kiểm tra Raw HTML không có JavaScript

| Tuyến đường kiểm thử | File HTML sinh ra | Thẻ `<title>` thực tế trong mã nguồn | Meta Description thực tế | Thẻ Open Graph & Canonical |
|---|---|---|---|---|
| `/` (Trang chủ) | `build/client/index.html` | Bệnh viện Thú y Lê Sơn — Chăm Sóc Y Tế Thú Cưng Chuẩn Mực | Bệnh viện Thú y Lê Sơn - Địa chỉ khám, điều trị, phẫu thuật, nội trú và cấp cứu thú cưng 24/24... | `og:type=website`, `og:image=og-home.webp`, `canonical=https://lesonpet.vn/` |
| `/gioi-thieu` | `build/client/gioi-thieu/index.html` | Về Bệnh Viện Thú Y Lê Sơn — Lịch Sử & Tôn Chỉ Y Khoa | Tìm hiểu hành trình thành lập, đội ngũ chuyên môn và tôn chỉ phụng sự sự sống... | `og:type=website`, `og:image=og-about.webp`, `canonical=https://lesonpet.vn/gioi-thieu` |
| `/doi-ngu` | `build/client/doi-ngu/index.html` | Đội Ngũ Bác Sĩ & Chuyên Gia Y Tế — Bệnh Viện Thú Y Lê Sơn | Gặp gỡ đội ngũ bác sĩ thú y giàu kinh nghiệm, tận tâm và chuyên môn vững vàng... | `og:type=website`, `og:image=og-team.webp`, `canonical=https://lesonpet.vn/doi-ngu` |
| `/co-so-vat-chat` | `build/client/co-so-vat-chat/index.html` | Cơ Sở Vật Chất & Không Gian Khám Chữa — Bệnh Viện Thú Y Lê Sơn | Hệ thống cơ sở vật chất, phòng khám, phòng chẩn đoán hình ảnh và khu vực lưu trú y tế tiện nghi... | `og:type=website`, `og:image=og-facilities.webp`, `canonical=https://lesonpet.vn/co-so-vat-chat` |
| `/spike-seo-test` | `build/client/spike-seo-test/index.html` | Thử Nghiệm Kiến Trúc SEO — Architecture Spike 01 | Trang thử nghiệm kỹ thuật đánh giá khả năng sinh mã HTML tĩnh và SEO metadata độc lập... | `og:type=article`, `og:image=og-spike.webp`, `canonical=https://lesonpet.vn/spike-seo-test` |
| `/dat-lich` | `build/client/dat-lich/index.html` | Đặt Lịch Khám & Tư Vấn Y Tế Thú Cưng — Bệnh Viện Thú Y Lê Sơn | Đăng ký lịch khám trực tuyến tại Bệnh viện Thú y Lê Sơn 101 Khuất Duy Tiến... | `og:type=website`, `canonical=https://lesonpet.vn/dat-lich` |
| `/404` | `build/client/404/index.html` | 404 — Không Tìm Thấy Trang | Bệnh Viện Thú Y Lê Sơn | *(Không có)* | `meta[name=robots]="noindex, nofollow"` |

> [!NOTE] Kết luận Gate A
> **ĐẠT (PASS)**. Toàn bộ các thẻ tiêu đề, mô tả và Open Graph đều hiển thị chính xác theo từng trang ngay trong mã nguồn HTML thô. Trình thu thập dữ liệu (bot của Google, Facebook, Zalo) có thể đọc trọn vẹn dữ liệu mà không cần chạy JavaScript.

---

## 3. KẾT QUẢ CHI TIẾT GATE B — ROUTING & PRIVACY

### 3.1. Kết quả kiểm thử thực nghiệm trên Local Routing Simulator

Lệnh kiểm thử đã chạy thực tế trên nhánh Spike:
```bash
node tests/spike/test-routing-spike.cjs
```

Kết quả trả về nguyên bản từ terminal:
```text
Testing server running on port 4173...
URL: /                              | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /gioi-thieu                    | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /doi-ngu                       | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /co-so-vat-chat                | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /spike-seo-test                | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /tai-khoan/lich-hen            | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /quan-ly/lich-truc             | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /duong-dan-khong-ton-tai       | Status: 404 (Expected 404: PASS) | Content: PASS
URL: /dich-vu/slug-khong-ton-tai    | Status: 404 (Expected 404: PASS) | Content: PASS
```

### 3.2. Đánh giá tính riêng tư của Customer Portal & Staff Portal
- Tập tin `build/client/__spa-fallback.html` đóng vai trò là vỏ ứng dụng SPA rỗng (chỉ có thẻ `<head>`, font preloads và script khởi tạo).
- Khi người dùng truy cập các đường dẫn `/tai-khoan/*` hoặc `/quan-ly/*`, máy chủ trả về file fallback này.
- **Bảo mật tuyệt đối:** Hoàn toàn **0 byte** dữ liệu bệnh án, tên thú cưng, lịch sử khám hay y lệnh của bác sĩ xuất hiện trong file HTML tĩnh lúc build. Việc lấy dữ liệu sẽ do client-side API thực hiện sau khi xác thực danh tính người dùng (đúng chuẩn Architecture Baseline V1).

### 3.3. Lý do ghi nhận Gate B là PARTIAL
Theo chỉ đạo bắt buộc tại Mục VI của CEO Directive 049-A:
- Trên môi trường cục bộ, simulator đã chứng minh routing và HTTP 404 hoạt động chính xác.
- Tuy nhiên, trên hạ tầng Vercel Production thực tế, nếu cấu hình `vercel.json` có quy tắc rewrite toàn cục `/(.*) -> /index.html`, máy chủ Vercel vẫn có thể trả về mã HTTP 200 (Soft 404).
- Do Antigravity **chưa được cấp quyền deploy lên Vercel** trong vòng Spike này để kiểm chứng hành vi edge router thật, Gate B được ghi nhận chuẩn mực là **PARTIAL**.

---

## 4. KẾT QUẢ CHI TIẾT GATE C — PERFORMANCE & REGRESSION

### 4.1. Khả năng tương thích mã nguồn 3A hiện hữu
- **Tái sử dụng 100% components:** Toàn bộ Header, Footer, MobileNav, RootLayout, EditorialPhotoFrame, EditorialDarkCTA, EditorialSlotBox, HomePage, AboutPage, TeamPage, FacilitiesPage, BookingPage đều hoạt động trơn tru mà không cần sửa đổi mã JSX hay CSS.
- **Hệ thống Design Tokens & Tailwind v4:** Plugin `@tailwindcss/vite` tích hợp hoàn hảo với plugin `reactRouter()` trong Vite. Toàn bộ các biến màu CSS `tokens.css` và font chữ `@font-face` tự host đều được áp dụng đồng nhất.

### 4.2. Chất lượng mã nguồn & Type Safety
- **Linter (`oxlint`):** Chạy trên **85 tệp tin** $\to$ **0 errors, 0 warnings** (thời gian thực thi: 23ms).
- **TypeScript (`tsc -b`):** Trình biên dịch TypeScript 6.0.3 hoàn thành thành công với **0 lỗi cú pháp / 0 lỗi kiểu**.

### 4.3. So sánh Bundle Size giữa Vite SPA và React Router 7 Framework Mode

| Hạng mục | Vite SPA Baseline (`4739d45`) | RR7 Framework Mode Spike (`32b8a0a`) | Nhận xét & Đánh giá |
|---|---|---|---|
| **Mã HTML ban đầu (`index.html`)** | 1.57 kB (vỏ rỗng `<div id="root"></div>`) | 33.20 kB (HTML ngữ nghĩa đầy đủ 6 sections) | Raw HTML lớn hơn vì chứa đầy đủ nội dung để bot đọc và hiển thị ngay lập tức (LCP/FCP nhanh hơn). |
| **CSS toàn cục chính** | 67.93 kB (`index-BCvVG95G.css`) | 59.96 kB (`root-C5esYQcZ.css`) | Tách nhỏ CSS theo route: `home.css` (7.22 kB), `booking.css` (1.81 kB). |
| **Runtime JS nén Gzip (Trang chủ)**| ~107.0 kB gzip | ~117.5 kB gzip (tổng entry + runtime + layout + home) | Chênh lệch ~10.5 kB gzip do bổ sung router context và cơ chế bù nước (hydration engine). |
| **Thời gian Build** | 404ms (client build duy nhất) | 1.22s (client) + 369ms (prerender) = ~1.6s | Tăng thêm ~1.2s build time do Node.js phải render tĩnh 7 trang tại build time. Hoàn toàn chấp nhận được. |

---

## 5. KẾT QUẢ CHI TIẾT GATE D — HOSTING & SOCIAL PREVIEW

- **Trạng thái thực tế:** **PARTIAL / NOT TESTED**.
- **Tuân thủ quy chế:** Không thực hiện bất kỳ lệnh `vercel deploy`, `vercel --prod`, không thay đổi thiết lập DNS hoặc tắt Vercel SSO Authentication.
- **Phân tích lý thuyết:**
  * Facebook và Zalo crawlers không thực thi JavaScript. Khi người dùng chia sẻ link `/gioi-thieu`, bot gửi GET request trực tiếp.
  * Với kiến trúc Prerender đã chứng minh ở Gate A, bot sẽ nhận được đúng thẻ `og:title`, `og:description`, `og:image` và URL canonical tương ứng của trang, loại bỏ triệt để lỗi hiển thị metadata chung của trang chủ.
  * Chi tiết giải pháp hosting và cấu hình `vercel.json` tối ưu được trình bày chi tiết tại tài liệu chuyên đề `architecture-spike-01-routing-seo.md`.
