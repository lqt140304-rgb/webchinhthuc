# BÁO CÁO KHẮC PHỤC TOÀN DIỆN QA MỐC 2A & 2B
## BỆNH VIỆN THÚ Y LÊ SƠN (LE-SON-WEBSITE 2026)

- **Người thực hiện:** Antigravity (Designer & Developer)
- **Người bàn giao:** ChatGPT (CEO)
- **Người nghiệm thu kỹ thuật:** Claude (QA Lead)
- **Thời gian hoàn thành:** 26/10/2026
- **Trạng thái tổng thể:** **100% LỖI ĐÃ ĐƯỢC XỬ LÝ TRIỆT ĐỂ (0 ERRORS, 0 WARNINGS, 0 OVERFLOW)**

---

## I. TỔNG QUAN KẾT QUẢ KHẮC PHỤC

Toàn bộ 16 khuyến nghị và lỗi kỹ thuật thuộc 3 cấp độ ưu tiên (P1, P2, P3) trong báo cáo QA của Claude đã được kiểm tra thực tế, xác định nguyên nhân gốc rễ và sửa đổi hoàn chỉnh bằng các giải pháp kỹ thuật chuẩn mực:

1. **Xung đột namespace Tailwind v4 và Design Tokens (P1.1):** Đã phân tách triệt để bằng prefix `--ls-*` cho container scale, border radius và spacing scale trong `tokens.css`. Utility `max-w-sm` (24rem / 384px) và `rounded-xl` (0.75rem / 12px) của Tailwind CSS v4 đã trở về giá trị chuẩn xác.
2. **Tràn ngang 320px, 1024px, 1366px (P1.2):** Sửa lỗi script đo tràn (chuyển sang so sánh nghiêm ngặt `scrollWidth <= vp.w`), tối ưu padding container (`px-2.5 sm:px-6`), ẩn linh hoạt chữ phụ subtitle trên màn hình siêu hẹp `< 380px`, và tinh chỉnh hiển thị hotline/navigation trên laptop. Kết quả đo thực tế: **100% Viewport từ 320px đến 1440px đều PASS (0px tràn)**.
3. **Active Navigation & A11y (P1.3, P2.10):** Đã bổ sung đầy đủ thuộc tính `aria-current="page"`, đường viền active dưới nav item, skip link `#main-content`, `aria-live="polite"` route change announcer và đồng bộ `document.title`/canonical URL qua hook `useRouteSeo`.
4. **Hành vi Dropdown Desktop (P1.4):** Không còn bị giật/đóng menu khi rê chuột và click; menu tự đóng khi chuyển route hoặc khi mất focus (`onBlur` / `focusout`). Hỗ trợ phím Escape và ArrowDown mở trực tiếp phần tử con đầu tiên.
5. **Mobile Drawer Unmount khi Resize (P1.5):** Bổ sung `window.matchMedia('(min-width: 1024px)')` listener. Khi phóng to màn hình, drawer unmount ngay lập tức và `document.body.style.overflow` được giải phóng.
6. **Đầy đủ liên kết kiến trúc (P1.6):** Bổ sung `/dich-vu` (Tất cả dịch vụ) và `/lien-he` (Liên hệ) vào cả Header desktop, Mobile Drawer và Footer. Đồng bộ query string `?cat=news`.
7. **Bảo vệ Indexability & Fallback SPA (P1.7, P1.8):** Thêm dynamic `<meta name="robots" content="noindex, nofollow">` cho toàn bộ các trang chưa xuất bản và trang 404; tạo `public/robots.txt`, `public/sitemap.xml`, `vercel.json`, `public/_redirects` và `public/404.html`.
8. **Độ tương phản màu WCAG AA (P2.9):** Bổ sung `--color-warm-orange-dark: #9A3412` (đạt tỉ lệ tương phản > 5.5:1 trên nền sáng), `--color-warm-orange-light: #FB923C` và `--color-plum-orchid-light: #D8B4E2` (đạt tỉ lệ > 4.8:1 trên nền tím đậm `var(--color-plum-deep)`).
9. **Cấu hình thông tin tập trung (P3.13):** Khởi tạo `src/config/contact.ts` chứa toàn bộ địa chỉ, hotline, giờ khám đã xác thực và thay thế 100% hardcoded strings.
10. **Dọn dẹp mã rác & Tài liệu hóa (P3.14, P3.15):** Xóa bỏ hoàn toàn `src/index.css` và `src/App.css`; viết lại `README.md` chuyên nghiệp.

---

## II. MA TRẬN ĐỐI CHIẾU CHI TIẾT CÁC HẠNG MỤC LỖI

| Mã | Hạng mục kiểm tra | Phân loại | Tình trạng | Giải pháp kỹ thuật đã áp dụng | Tệp tin thay đổi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **P1.1** | Xung đột namespace Tailwind v4 và Design Tokens | Lỗi nghiêm trọng | **ĐÃ KHẮC PHỤC** | Đổi tên toàn bộ custom container, radius, space thành `--ls-container-*`, `--ls-radius-*`, `--ls-space-*`. Kiểm tra file build xác nhận Tailwind v4 sinh đúng `.max-w-sm { max-width: 24rem }`, `.rounded-xl { border-radius: .75rem }`. | `src/styles/tokens.css`, `*.module.css` |
| **P1.2** | Tràn ngang viewport di động 320px & script đo sai | Lỗi nghiêm trọng | **ĐÃ KHẮC PHỤC** | Sửa script đo tràn so sánh trực tiếp với `vp.w`. Giảm padding Header di động xuống `px-2.5`, nút CTA tự co chữ "Đặt lịch" trên màn hình `< 380px`, ẩn subtitle logo khi màn hình hẹp. | `scripts/test-and-capture-2b.mjs`, `Header.tsx`, `HeroSection.tsx` |
| **P1.3** | Thiếu active state và `aria-current="page"` | Tiêu chuẩn WCAG | **ĐÃ KHẮC PHỤC** | Thêm logic phát hiện URL đang truy cập cho Trang chủ, Câu chuyện, Liên hệ và các nhóm Dropdown; gắn `aria-current="page"` cho link active. | `Header.tsx`, `MobileNav.tsx`, `RootLayout.tsx` |
| **P1.4** | Lỗi tương tác dropdown hover/click/keyboard | UX / Tiêu chuẩn A11y | **ĐÃ KHẮC PHỤC** | Đóng menu khi mất focus (`onBlur`), click không gây đóng menu nếu đang rê chuột; phím ArrowDown focus ngay link đầu tiên, Escape đóng và trả focus. | `Header.tsx` |
| **P1.5** | Mobile Drawer kẹt body overflow khi resize màn hình | Lỗi logic DOM | **ĐÃ KHẮC PHỤC** | Lắng nghe `matchMedia('(min-width: 1024px)')` để kích hoạt `onClose()`, phục hồi `document.body.style.overflow = ''`. | `MobileNav.tsx` |
| **P1.6** | Thiếu các liên kết `/dich-vu` và `/lien-he` | Kiến trúc sitemap | **ĐÃ KHẮC PHỤC** | Bổ sung "Tất cả dịch vụ" (`/dich-vu`) và "Liên hệ" (`/lien-he`) trên Header, Drawer và Footer; cập nhật query `?cat=news`. | `Header.tsx`, `MobileNav.tsx`, `Footer.tsx` |
| **P1.7** | Bảo vệ Indexability các trang Coming Soon & 404 | Chuẩn SEO | **ĐÃ KHẮC PHỤC** | Tạo hook `useRouteSeo` cập nhật tự động `<meta name="robots" content="noindex, nofollow">` và link canonical chuẩn; thêm 2 nút điều hướng trên ComingSoonView. | `src/hooks/useRouteSeo.ts`, `ComingSoonView.tsx`, `NotFoundPage.tsx` |
| **P1.8** | Thiếu cấu hình rewrite SPA và file SEO tĩnh | Lỗi định tuyến hosting | **ĐÃ KHẮC PHỤC** | Tạo `public/robots.txt`, `public/sitemap.xml`, `vercel.json`, `public/_redirects` và `public/404.html`. | `public/`, `vercel.json` |
| **P2.8** | Kiểm soát hiển thị Đăng nhập/Đăng ký trên laptop | Bố cục Responsive | **ĐÃ KHẮC PHỤC** | Đảm bảo cụm Đăng nhập / Đăng ký hiển thị liên tục từ 1024px trở lên; ẩn hotline trên dải 1024px-1439px để tránh tranh chấp không gian. | `Header.tsx` |
| **P2.9** | Độ tương phản màu chữ chưa đạt chuẩn WCAG AA | Tiêu chuẩn WCAG | **ĐÃ KHẮC PHỤC** | Bổ sung `--color-warm-orange-dark: #9A3412` trên nền sáng; bổ sung `--color-warm-orange-light: #FB923C` và `--color-plum-orchid-light: #D8B4E2` trên nền tối Deep Plum. | `tokens.css`, `Header.tsx`, `Footer.tsx`, `BookingContactSection.tsx` |
| **P2.10** | Thiếu Skip to content và live announcer | Tiêu chuẩn WCAG | **ĐÃ KHẮC PHỤC** | Bổ sung thẻ `<a href="#main-content">` ẩn/hiện khi focus, vùng `div#sr-announcer` với `aria-live="polite"`, tự động chuyển focus vào `<main id="main-content" tabIndex={-1}>`. | `RootLayout.tsx`, `useRouteSeo.ts` |
| **P2.11** | Utility Tailwind không tồn tại (`active:scale-98`, v.v.) | Quy chuẩn CSS | **ĐÃ KHẮC PHỤC** | Sửa `active:scale-98` thành `active:scale-[0.98]`; sửa `py-0.2` thành `py-0.5`; loại bỏ các class transition lạ. | Toàn bộ các component `src/` |
| **P2.12** | Thanh tác vụ di động chưa hỗ trợ safe-area iPhone | Tương thích thiết bị | **ĐÃ KHẮC PHỤC** | Cấu hình `paddingBottom: max(0.625rem, env(safe-area-inset-bottom, 0px))` trên `MobileBottomBar`. | `MobileNav.tsx` |
| **P3.13** | Phân tán thông tin liên hệ phòng khám | Khả năng bảo trì | **ĐÃ KHẮC PHỤC** | Tập trung hóa trong `src/config/contact.ts` với đầy đủ tên, địa chỉ, hotline, giờ làm việc, link bản đồ. | `src/config/contact.ts` và các views |
| **P3.14** | README.md mặc định của Vite template | Hồ sơ dự án | **ĐÃ KHẮC PHỤC** | Viết lại `README.md` chuyên nghiệp với đầy đủ cấu trúc thư mục, kiến trúc styling, và lệnh vận hành. | `README.md` |
| **P3.15** | Tệp tin CSS thừa không sử dụng | Tối ưu mã nguồn | **ĐÃ KHẮC PHỤC** | Đã xóa vĩnh viễn `src/index.css` và `src/App.css`. | `src/index.css`, `src/App.css` |

---

## III. BẰNG CHỨNG THỰC NGHIỆM TỪ HEADLESS CHROME AUTOMATION

Kết quả chạy thực tế của script `node scripts/test-and-capture-2b.mjs` kết nối trực tiếp cổng Chrome DevTools Protocol (CDP 9222):

```text
======================================================
KIỂM TRA TRÀN NGANG CHUẨN XÁC (STRICT HORIZONTAL OVERFLOW)
======================================================
[PASS] Viewport 320px (mobile-320):   scrollWidth=320px <= 320px (Hoàn toàn khớp)
[PASS] Viewport 375px (mobile-375):   scrollWidth=375px <= 375px (Hoàn toàn khớp)
[PASS] Viewport 390px (mobile-390):   scrollWidth=390px <= 390px (Hoàn toàn khớp)
[PASS] Viewport 768px (tablet-768):   scrollWidth=753px <= 768px (Hoàn toàn khớp)
[PASS] Viewport 1024px (laptop-1024): scrollWidth=1009px <= 1024px (Hoàn toàn khớp)
[PASS] Viewport 1366px (laptop-1366): scrollWidth=1351px <= 1366px (Hoàn toàn khớp)
[PASS] Viewport 1440px (desktop-1440):scrollWidth=1425px <= 1440px (Hoàn toàn khớp)

[TUYỆT VỜI] 100% Viewport từ 320px đến 1440px không bị tràn ngang!

======================================================
KIỂM TRA DRAWER UNMOUNT & BODY OVERFLOW TRÊN RESIZE
======================================================
Trạng thái sau khi mở drawer: { isDialogPresent: true, bodyOverflow: 'hidden' }
Trạng thái sau khi resize lên 1024px: { isDialogPresent: false, bodyOverflow: '' }
[PASS] Drawer tự động unmount và body overflow được phục hồi!
```

### Kết quả kiểm tra biên dịch và chất lượng tĩnh:
- **`npx tsc -b`:** Exit code `0` (0 lỗi).
- **`npx oxlint`:** Exit code `0` (`Found 0 warnings and 0 errors`).
- **`npm run build`:** Đóng gói thành công trong 325ms; chunk CSS đạt 54.58 kB (gzip: 10.12 kB).

---

## IV. BẢN ĐỒ ẢNH CHỤP KIỂM THỬ (SCREENSHOTS ARTIFACTS)

Các ảnh chụp màn hình kiểm thử đã được cập nhật và lưu tại thư mục artifacts:
- `m2b-mobile-320.png`: Giao diện di động siêu hẹp 320px (khớp hoàn toàn, không vỡ layout).
- `m2b-mobile-390.png`: Giao diện iPhone di động 390px.
- `m2b-tablet-768.png`: Giao diện iPad/Tablet 768px.
- `m2b-laptop-1366.png`: Giao diện Laptop 1366px (cân đối, không tràn navigation).
- `m2b-sec1-hero-1440.png`: Section Hero nghệ thuật chuẩn AURA 1440px.
- `m2b-sec6-booking-1440.png`: Section Đặt lịch khám & Liên hệ minh bạch 1440px.

---

## V. ĐỀ XUẤT NGHIỆM THU

Kính chuyển **Claude (QA Lead)** và **ChatGPT (CEO)** rà soát và phê duyệt báo cáo kỹ thuật này để hoàn tất thủ tục nghiệm thu toàn diện Mốc 2A & 2B, chuẩn bị lệnh commit/push vào repository chính thức.
