# IMPLEMENTATION PLAN — BỆNH VIỆN THÚ Y LÊ SƠN 2026

Kế hoạch triển khai chia theo 5 giai đoạn nghiêm ngặt, mỗi giai đoạn kết thúc bằng mốc nghiệm thu trước khi bước sang giai đoạn tiếp theo.

---

### Giai đoạn 1: Kiến Trúc & Thiết Lập Nền Tảng (ĐÃ HOÀN TẤT & ĐƯỢC PHÊ DUYỆT)
- [x] Khảo sát & kiểm tra workspace, git repository `origin/main`.
- [x] Rà soát phân quyền `/tai-khoan/*`, loại bỏ nội dung nội bộ y khoa và chuẩn hóa lịch hẹn tái khám.
- [x] Chuẩn hóa Styling Architecture: `tokens.css` (Nguồn chân lý duy nhất) + Tailwind CSS (Layout/Responsive) + CSS Modules (Editorial/Scoped).
- [x] Hoàn thiện hệ thống Design Tokens (Colors, Typography, Spacing, Containers, Breakpoints, Component States, Motion).
- [x] Xây dựng Ma trận SEO Onpage, Meta tags, Canonical, Schema.org và phương án Indexability.
- [x] Xây dựng Cỗ máy trạng thái (FSM) cho luồng Đặt lịch khám (6 trạng thái, khóa cứng confirmed phía Client).

---

### Giai đoạn 2: Thiết Lập Routing & Xây Dựng Trang Chủ

#### Mốc 2A: Routing & Bộ Khung Giao Diện (ĐÃ NGHIỆM THU CÓ ĐIỀU KIỆN — SHA `39a5835`)

**1. Các hạng mục đã triển khai:**
- [x] Tích hợp `react-router-dom` và cấu hình hệ thống tuyến đường tập trung (`AppRoutes`).
- [x] Dựng `RootLayout` kết nối Header, Outlet, Footer, MobileNav Drawer và MobileBottomBar.
- [x] Header Desktop: Bố cục tối ưu trên Desktop 1440px & Laptop 1366px, đầy đủ navigation dropdown đa tầng, cụm Đăng nhập / Đăng ký, nút CTA Đặt lịch (đã bỏ hotline Header theo Quyết định 3).
- [x] Mobile Navigation: Dialog semantics, focus trap, khóa cuộn body an toàn, menu accordion phân cấp.
- [x] Footer Chân Trang: Thông tin cơ sở 101 Khuất Duy Tiến, Hotline 24/24 (097 355 51 05), giờ khám tham chiếu 08:00 – 21:00.
- [x] Tối ưu hóa Logo chính thức của bệnh viện (`logo.png` ~27.2 KB ≤ 100 KB) và Favicon riêng (`favicon.png` ~3.7 KB ≤ 50 KB). Cách ly ảnh gốc độ phân giải cao vào `design/source/logo-original.png` (không đưa vào bundle `dist/`).
- [x] Xây dựng `ComingSoonView` (tự động tiêm thẻ `noindex, nofollow`, ưu tiên hotline) và `NotFoundPage` (404 độc lập, `noCanonical`).
- [x] Dynamic JSON-LD VeterinaryCare trên trang chủ, tự cleanup khi unmount.
- [x] Cấu hình `vercel.json` SPA rewrite chuẩn, loại bỏ các file cấu hình đa host cũ (`404.html`, `_redirects`).

**2. Trạng thái kiểm chứng (Claude Retest-04 xác nhận 98 PASS / 0 FAIL / 2 BLOCKED):**
- **Đóng hoàn toàn các lỗi P1, P2, P3:**
  - A01 (R2-1): Đồng nhất trạng thái mục Câu chuyện giữa Desktop và Drawer ở trang chi tiết (`/cau-chuyen/:slug`).
  - A02 (R2-2): Xử lý query không liên quan (UTM, fbclid...) và dấu `/` cuối khi nhận diện mục hiện tại.
  - A03 (R2-3): Tối ưu logo Header và tạo favicon riêng.
  - R3-1: Cách ly ảnh logo gốc khỏi thư mục `public/`.
  - R3-2: Khôi phục bằng chứng gốc của Claude trong `docs/qa/2a-retest-02-evidence/`.
  - R3-3: Chuẩn hóa trích dẫn nguồn số liệu trong kế hoạch.
- **Hai mục BLOCKED giữ lại làm điều kiện trước phát hành:**
  - A04: Kiểm tra trên host Vercel thật (chờ URL preview được cấp phép).
  - A05: Cấu hình `X-Robots-Tag: noindex, nofollow` theo tuyến đường trong `vercel.json`.
- **Kết luận:** Chủ dự án đã nghiệm thu có điều kiện Mốc 2A theo CEO Directive 005-A.

#### Mốc 2B: Thiết Kế & Xây Dựng 6 Section Trang Chủ & Trang Đặt Lịch (HOÀN TẤT — SẴN SÀNG CHO QA ĐỘC LẬP)
- [x] **Section 1 (Editorial Hero):** Headline *“Khi bé không khỏe, bạn không phải lo một mình.”*, mô tả & 2 CTA, 3 khung ảnh editorial bo góc cắt khuyết nghệ thuật.
- [x] **Section 2 (Vì sao chọn Lê Sơn?):** Immersive split layout, ảnh thú cưng lớn cảm xúc, thẻ Bento 3 giá trị cốt lõi + Banner tiếp nhận Cấp cứu 24/24.
- [x] **Section 3 (Dịch vụ tiêu biểu):** 3 thẻ dịch vụ trọng tâm, nút "Xem tất cả dịch vụ" và dải Cổng Cấp cứu 24/24 khẩn cấp.
- [x] **Section 4 (Câu chuyện nổi bật):** 1 ca phục hồi tiêu biểu, quy trình 3 giai đoạn lâm sàng, có nhãn minh họa minh bạch (không có tên thuốc hay liều lượng nội bộ).
- [x] **Section 5 (Góc kiến thức & Tin tức):** 3 thẻ bài viết tạp chí, có thông báo bản mẫu biên tập rõ ràng.
- [x] **Nhiệm vụ B01 (Điều chỉnh Section 6 & Trang Đặt Lịch):**
  - Section 6 trên Trang chủ: Loại bỏ form đầy đủ, chỉ gồm lời kêu gọi, địa chỉ 101 Khuất Duy Tiến, hotline 097 355 51 05, giờ khám 08:00 – 21:00, cấp cứu 24/24 và nút CTA nổi bật dẫn tới `/dat-lich`.
  - Tuyến đường `/dat-lich` (`BookingPage`): Xây dựng trang chuyên biệt đầy đủ 8 trường dữ liệu theo `BookingFormData`, có client validation chuẩn, banner minh bạch giao diện thử nghiệm, panel kết quả trung thực không báo thành công giả, có CTA gọi hotline đặt thật và nút thử lại biểu mẫu.
- [x] **Nhiệm vụ B02 (Rà soát nội dung & bản quyền ảnh):**
  - Đã loại bỏ cam kết "ngày lễ" chưa xác minh tại Section 6.
  - Toàn bộ 6 section đều dùng nhãn minh họa rõ ràng, không tạo số liệu lâm sàng hoặc đánh giá giả.
  - Xác nhận nguồn ảnh placeholder (Unsplash Editorial) chờ thay thế bằng ảnh thực tế phòng khám ở Giai đoạn 3.
- [x] **Nhiệm vụ B04 (Kiểm tra nghiệm thu):**
  - Lint: 0 warnings, 0 errors (`npx oxlint`).
  - TypeScript: 0 errors (`npx tsc -b`).
  - Production build: Thành công, JS 368.11 kB, CSS 59.04 kB.
  - Hồi quy 2A: Bộ 100 test E2E đạt 98 PASS / 0 FAIL / 2 SKIP (BLOCKED A04/A05).
  - Responsive: Đạt 100% tại 7 kích thước màn hình (320, 360, 390, 768, 1366, 1440, 1920px) cho cả Trang chủ và Trang Đặt lịch. 0 tràn ngang, 0 console error. Đã chụp và lưu 14 ảnh fullpage tại `docs/qa/2b-verification-evidence/`.
- [ ] **DỪNG LẠI CHỜ PHÊ DUYỆT MỐC 2B TỪ CHỦ DỰ ÁN TRƯỚC KHI BƯỚC VÀO GIAI ĐOẠN 3.**

---

### Giai đoạn 3: Xây Dựng Các Trang Con Chuyên Biệt (Chờ Duyệt GĐ2)
- [ ] Trang Giới thiệu (`/gioi-thieu`).
- [ ] Trang Đội ngũ (`/doi-ngu`) - Nổi bật BST Lê Thái Sơn với ảnh & bằng cấp xác minh.
- [ ] Trang Cơ sở vật chất (`/co-so-vat-chat`).
- [ ] Trang Chi tiết Dịch vụ (`/dich-vu/*`).
- [ ] Trang Bảng giá niêm yết (`/bang-gia`).
- [ ] Trang Chi tiết Câu chuyện điều trị (`/cau-chuyen/*`).
- [ ] Trang Góc thú cưng & Bài viết (`/goc-thu-cung/*`, `/bai-viet/*`).
- [ ] Trang Danh mục Sản phẩm y tế (`/san-pham`).
- [ ] Trang Liên hệ độc lập (`/lien-he`).

---

### Giai đoạn 4: Tích Hợp Hệ Thống & Cổng Quản Lý (Chờ Duyệt GĐ3)
- [ ] Kiến trúc Dashboard độc lập theo Addendum 01 & Architecture Baseline V1:
  - Cổng Khách hàng (`/tai-khoan/*` - `CustomerLayout`).
  - Cổng Quản lý Nghiệp vụ (`/quan-ly/*` - `StaffLayout`).
- [ ] Kết nối API backend cho hệ thống Đặt lịch khám (6 trạng thái FSM).
- [ ] Xác thực người dùng và phân quyền RBAC.

---

### Giai đoạn 5: Tối Ưu Toàn Diện, QA & Bàn Giao Production
- [ ] Kiểm toán Core Web Vitals & Lighthouse.
- [ ] Kiểm tra khả năng tiếp cận WCAG 2.1 AA trên thiết bị thật.
- [ ] Báo cáo nghiệm thu tổng thể và bàn giao mã nguồn.
