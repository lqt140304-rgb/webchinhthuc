# IMPLEMENTATION PLAN — BỆNH VIỆN THÚ Y LÊ SƠN 2026

Kế hoạch triển khai chia theo 5 giai đoạn nghiêm ngặt, mỗi giai đoạn kết thúc bằng mốc nghiệm thu trước khi bước sang giai đoạn tiếp theo.

---

### Giai đoạn 1: Kiến Trúc & Thiết Lập Nền Tảng (ĐÃ HOÀN TẤT & ĐƯỢC PHÊ DUYỆT)
- [x] Khảo sát & kiểm tra workspace, git repository `origin/main`.
- [x] Rà soát phân quyền `/tai-khoan/*`, loại bỏ nội dung nội bộ y khoa và chuẩn hóa lịch hẹn tái khám.
- [x] Chuẩn hóa Styling Architecture: `tokens.css` (Nguồn chân lý duy nhất) + Tailwind CSS (Layout/Responsive) + CSS Modules (Editorial/Scoped).
- [x] Hoàn thiện 100% hệ thống Design Tokens (Colors, Typography, Spacing, Containers, Breakpoints, Component States, Motion).
- [x] Xây dựng Ma trận SEO Onpage, Meta tags, Canonical, Schema.org và phương án Indexability.
- [x] Xây dựng Cỗ máy trạng thái (FSM) cho luồng Đặt lịch khám (6 trạng thái, khóa cứng confirmed phía Client).

---

### Giai đoạn 2: Thiết Lập Routing & Xây Dựng Trang Chủ

#### Mốc 2A: Routing & Bộ Khung Giao Diện (ĐÃ HOÀN TẤT & NGHIỆM THU)
- [x] Tích hợp `react-router-dom` và cấu hình hệ thống tuyến đường tập trung (`AppRoutes`).
- [x] Dựng `RootLayout` kết nối Header, Outlet, Footer, MobileNav Drawer và MobileBottomBar.
- [x] Header Desktop: Bố cục tối ưu trên Desktop 1440px & Laptop 1366px, đầy đủ navigation dropdown đa tầng, cụm Đăng nhập / Đăng ký, Hotline 24/24 và nút CTA Đặt lịch.
- [x] Mobile Navigation: Dialog semantics, focus trap, khóa cuộn body an toàn, menu accordion phân cấp.
- [x] Footer Chân Trang: Thông tin cơ sở 101 Khuất Duy Tiến, Hotline 24/24, giờ khám tham chiếu 08:00 – 21:00.
- [x] Tích hợp Logo chính thức của bệnh viện vào Header, Drawer, Footer và favicon.
- [x] Xây dựng `ComingSoonView` (tự động tiêm thẻ `noindex, nofollow`, ưu tiên hotline) và `NotFoundPage` (404 độc lập).

#### Mốc 2B: Thiết Kế & Xây Dựng 6 Section Trang Chủ (ĐÃ HOÀN TẤT — CHỜ DUYỆT)
- [x] **Section 1 (Editorial Hero):** Headline *“Khi bé không khỏe, bạn không phải lo một mình.”*, mô tả & 2 CTA, 3 khung ảnh editorial bo góc cắt khuyết nghệ thuật lấy cảm hứng từ AURA.
- [x] **Section 2 (Vì sao chọn Lê Sơn?):** Immersive split layout, ảnh thú cưng lớn cảm xúc, thẻ Bento 3 giá trị cốt lõi (Chuyên môn & Trách nhiệm, Tận tâm & Lắng nghe, Theo dõi & Chăm sóc minh bạch) + Banner tiếp nhận Cấp cứu 24/24.
- [x] **Section 3 (Dịch vụ tiêu biểu):** 3 thẻ dịch vụ trọng tâm (Khám & điều trị, Chăm sóc nội trú 24/7, Spa & Grooming thẩm mỹ), nút "Xem tất cả dịch vụ" và dải Cổng Cấp cứu 24/24 khẩn cấp.
- [x] **Section 4 (Câu chuyện nổi bật):** 1 ca phục hồi tiêu biểu, quy trình 3 giai đoạn lâm sàng, có nhãn minh họa minh bạch (không có tên thuốc hay liều lượng nội bộ).
- [x] **Section 5 (Góc kiến thức & Tin tức):** 3 thẻ bài viết tạp chí (Editorial Magazine Cards), có thông báo bản mẫu biên tập rõ ràng.
- [x] **Section 6 (Đặt lịch & Liên hệ):** Thông tin 101 Khuất Duy Tiến, Hotline 097 355 51 05, Giờ khám 08:00 – 21:00, liên kết Google Maps và biểu mẫu demo với thông báo minh bạch chưa kết nối database (không báo gửi thành công giả).
- [x] Kiểm thử toàn diện: Linter 0 errors, TypeScript 0 errors, Build 274ms, kiểm tra tràn ngang (PASS 5/5 breakpoints: 320px, 390px, 768px, 1366px, 1440px).
- [x] **DỪNG LẠI CHỜ PHÊ DUYỆT MỐC 2B TRƯỚC KHI BƯỚC VÀO GIAI ĐOẠN 3.**

---

### Giai đoạn 3: Xây Dựng Các Trang Con Chuyên Biệt (Chờ Duyệt GĐ2)
- [ ] Trang Giới thiệu (`/gioi-thieu`).
- [ ] Trang Đội ngũ (`/doi-ngu`) - Nổi bật BST Lê Thái Sơn với ảnh & bằng cấp xác minh.
- [ ] Trang Cơ sở vật chất (`/co-so-vat-chat`).
- [ ] Trang Dịch vụ & Trang chi tiết (`/dich-vu/*`).
- [ ] Trang Bảng giá dịch vụ niêm yết (`/bang-gia`).
- [ ] Trang Câu chuyện điều trị (`/cau-chuyen/*`).
- [ ] Trang Góc thú cưng & Chi tiết bài viết (`/goc-thu-cung`, `/bai-viet/:slug`).
- [ ] Trang Sản phẩm chọn lọc (`/san-pham`).
- [ ] Trang Đặt lịch khám đầy đủ (`/dat-lich`).
- [ ] **Dừng lại để duyệt trước khi sang Giai đoạn 4.**

---

### Giai đoạn 4: Tích Hợp Kỹ Thuật & Cổng Khách Hàng (Chờ Duyệt GĐ3)
- [ ] Tích hợp Form đặt lịch có kiểm tra dữ liệu và kết nối API 6 trạng thái xử lý.
- [ ] Khảo sát giải pháp xác thực (Authentication) & Database (Supabase/REST API) khi được cho phép.
- [ ] Cổng khách hàng cơ bản (`/tai-khoan/*`) tuân thủ nghiêm ngặt ma trận bảo mật và phân quyền y khoa.

---

### Giai đoạn 5: Kiểm Thử, Tối Ưu Hóa & Chuẩn Bị Bàn Giao
- [ ] Kiểm thử Responsive đa thiết bị & xử lý triệt để lỗi tràn ngang.
- [ ] Kiểm thử Accessibility (a11y): Tương phản màu, Keyboard focus navigation, thẻ ARIA.
- [ ] Tối ưu hóa hiệu năng & Core Web Vitals (LCP, CLS, INP).
- [ ] Kiểm tra SEO Onpage, Meta tags, Schema.org LocalBusiness (VeterinaryCare).
- [ ] Báo cáo QA và nghiệm thu bàn giao.
