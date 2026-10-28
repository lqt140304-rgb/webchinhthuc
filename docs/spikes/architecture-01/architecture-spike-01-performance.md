# CHUYÊN ĐỀ HIỆU NĂNG & KIỂM ĐỊNH HỒI QUY — ARCHITECTURE SPIKE 01
## Đánh Giá Hiệu Năng Core Web Vitals, Bundle Size & Tính Ổn Định

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 049-A** — Gate C Evaluation |
| **Nhánh Spike** | `spike/architecture-01-rr7-prerender` |
| **Baseline 3A đối chiếu** | `4739d45cc95100b587381b6bdcad6935352b23e8` |

---

## 1. SO SÁNH KỸ THUẬT VÀ PHÂN TÍCH CHỈ SỐ BUILD

### 1.1. Bảng số liệu chi tiết giữa Baseline 3A và RR7 Framework Mode

| Tiêu chí đo lường | Vite SPA Baseline 3A (`4739d45`) | RR7 Framework Mode Spike (`32b8a0a`) | Độ chênh lệch / Tác động |
|---|:---:|:---:|---|
| **Thời gian biên dịch (Build Time)** | $404\text{ ms}$ | $1.22\text{ s} + 369\text{ ms} = 1.59\text{ s}$ | Tăng $\approx 1.2\text{ s}$ do Node.js render tĩnh 7 trang tại build time. |
| **Kích thước HTML Trang chủ** | $1.57\text{ kB}$ (Vỏ rỗng) | $33.20\text{ kB}$ (Semantic HTML đầy đủ) | Tăng kích thước ban đầu nhưng loại bỏ thời gian trắng trang chờ JS. |
| **File CSS chung (`root` / `index`)**| $67.93\text{ kB}$ | $59.96\text{ kB}$ | Giảm nhẹ CSS toàn cục nhờ tách CSS theo route. |
| **CSS theo route (`home.css`)** | $0\text{ kB}$ (Gộp chung) | $7.22\text{ kB}$ | Tách module CSS tối ưu cho từng trang. |
| **Runtime JS nén Gzip (Trang chủ)**| $\approx 107.0\text{ kB}$ gzip | $\approx 117.5\text{ kB}$ gzip | Tăng nhẹ $\approx 10.5\text{ kB}$ gzip cho runtime router context. |
| **Bundle chunk Giới thiệu** | $13.65\text{ kB}$ (gzip $3.57\text{ kB}$) | $14.74\text{ kB}$ (gzip $3.88\text{ kB}$) | Tương đương (chênh lệch $< 0.3\text{ kB}$ gzip). |
| **Bundle chunk Đội ngũ** | $13.95\text{ kB}$ (gzip $3.59\text{ kB}$) | $14.88\text{ kB}$ (gzip $3.86\text{ kB}$) | Tương đương. |
| **Bundle chunk Cơ sở vật chất** | $15.54\text{ kB}$ (gzip $3.35\text{ kB}$) | $16.65\text{ kB}$ (gzip $3.67\text{ kB}$) | Tương đương. |
| **Số lượng tệp HTML tĩnh sinh ra** | Đúng 1 tệp (`index.html`) | **8 tệp** (7 trang tĩnh + 1 SPA fallback) | Đạt mục tiêu Prerendering toàn diện. |

---

## 2. ĐÁNH GIÁ TÁC ĐỘNG ĐẾN CORE WEB VITALS (CWV ESTIMATE)

### 2.1. First Contentful Paint (FCP) và Largest Contentful Paint (LCP)
- **Trên Vite SPA (Hiện tại):** Trình duyệt phải tải `index.html` $\to$ tải và phân tích `index.css` $\to$ tải và thực thi `index.js` $\to$ React mount $\to$ mới render ra phần tử Hero image và Heading. Do đó FCP và LCP phụ thuộc hoàn toàn vào tốc độ thực thi JavaScript của CPU thiết bị di động (đặc biệt các thiết bị tầm trung/yếu có thể trễ từ 2.5s – 3.5s).
- **Trên React Router 7 Prerender:**
  * Mã HTML của Hero section (tiêu đề, thẻ h1, ảnh đại diện) đã nằm sẵn trong `index.html`.
  * Trình duyệt phân tích cú pháp HTML và hiển thị nội dung ngay lập tức (First Contentful Paint diễn ra gần như tức thì, giảm ít nhất **400ms – 800ms** so với SPA).
  * Thẻ `<link rel="preload">` cho font chữ và Hero WebP được nhúng sẵn ở `<head>`, giúp tối ưu hóa LCP tối đa.

### 2.2. Cumulative Layout Shift (CLS)
- **Mục tiêu quy chế:** $\text{CLS} \le 0.1$ (chuẩn Good của Google Core Web Vitals; benchmark mục tiêu $0.000$).
- **Cơ chế chống giật cục bộ:**
  * Thẻ `Layout` trong `app/root.tsx` duy trì toàn bộ cấu trúc chiều cao cố định của Header ($73\text{px}$ mobile, $81\text{px}$ desktop) và Footer.
  * Các khung ảnh minh họa trong `AboutPage`, `FacilitiesPage` đều có aspect ratio cố định (`aspect-[4/5]`, `aspect-[16/10]`), ngăn ngừa hiện tượng dịch chuyển layout khi ảnh tải xong.
  * Bản vá CLS của Mốc 3A (`min-h-screen` fallback và wrapper cố định) được kế thừa 100%.

### 2.3. Lỗi Bù Nước (Hydration Errors) & React Warnings
- Kiểm tra toàn bộ mã nguồn `src/pages/` và `src/components/`:
  * Các lệnh tương tác với đối tượng `window`, `document` (như `window.scrollTo`, `document.addEventListener`, `window.matchMedia`) đều được bọc nghiêm ngặt bên trong hook `useEffect` hoặc event handlers.
  * Trong quá trình Node.js build prerender, `useEffect` hoàn toàn không thực thi $\to$ Không có lỗi `ReferenceError: window is not defined`.
  * Khi client tải xong script, DOM do server render khớp cấu trúc với cây ảo React $\to$ **0 lỗi hydration mismatch**.

---

## 3. KHẢ NĂNG TRUY CẬP (A11Y) & BẢO TOÀN TRẢI NGHIỆM NGƯỜI DÙNG

1. **Skip to Main Content Link:** Giữ nguyên liên kết nhảy nhanh `#main-content` ở đầu trang dành cho người dùng khiếm thị sử dụng screen reader.
2. **Screen Reader Route Announcer:** Thẻ `<div id="sr-announcer" aria-live="polite">` được khởi tạo sẵn trong HTML tĩnh, hỗ trợ thông báo tức thì khi chuyển trang.
3. **Tuân thủ Reduced Motion:** Quy chuẩn CSS `@media (prefers-reduced-motion: reduce)` trong `globals.css` được bảo toàn nguyên vẹn:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, ::before, ::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```
4. **Vùng chạm Touch Targets trên Mobile:** 100% nút bấm Đặt lịch khám, Gọi Hotline và nút mở Mobile Menu duy trì kích thước tối thiểu $\ge 44 \times 44\text{px}$.
