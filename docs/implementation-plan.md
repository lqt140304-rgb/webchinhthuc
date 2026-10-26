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

#### Mốc 2A: Routing & Bộ Khung Giao Diện (ĐÃ ĐẠT TIÊU CHÍ ĐỀ XUẤT NGHIỆM THU CÓ ĐIỀU KIỆN)

**1. Các hạng mục đã triển khai:**
- [x] Tích hợp `react-router-dom` và cấu hình hệ thống tuyến đường tập trung (`AppRoutes`).
- [x] Dựng `RootLayout` kết nối Header, Outlet, Footer, MobileNav Drawer và MobileBottomBar.
- [x] Header Desktop: Bố cục tối ưu trên Desktop 1440px & Laptop 1366px, đầy đủ navigation dropdown đa tầng, cụm Đăng nhập / Đăng ký, nút CTA Đặt lịch (đã bỏ hotline Header theo Quyết định 3).
- [x] Mobile Navigation: Dialog semantics, focus trap, khóa cuộn body an toàn, menu accordion phân cấp.
- [x] Footer Chân Trang: Thông tin cơ sở 101 Khuất Duy Tiến, Hotline 24/24, giờ khám tham chiếu 08:00 – 21:00.
- [x] Tối ưu hóa Logo chính thức của bệnh viện (`logo.png` ~27.2 KB ≤ 100 KB) và Favicon riêng (`favicon.png` ~3.7 KB ≤ 50 KB). Cách ly ảnh gốc độ phân giải cao vào `design/source/logo-original.png` (không đưa vào bundle `dist/`).
- [x] Xây dựng `ComingSoonView` (tự động tiêm thẻ `noindex, nofollow`, ưu tiên hotline) và `NotFoundPage` (404 độc lập, `noCanonical`).
- [x] Dynamic JSON-LD VeterinaryCare trên trang chủ, tự cleanup khi unmount.
- [x] Cấu hình `vercel.json` SPA rewrite chuẩn, loại bỏ các file cấu hình đa host cũ (`404.html`, `_redirects`).

**2. Trạng thái kiểm chứng (Đối chiếu giữa Báo cáo Retest-02, Retest-03 của Claude và Báo cáo Handoff của Antigravity):**
- **Bộ chuẩn và round 02:** Antigravity tự kiểm trên `cd0e68e` đạt 76/78 test (2 BLOCKED). Claude retest-03 xác nhận đạt 76/78 test, đóng hoàn toàn các lỗi P1 cũ và 2 lỗi P3 của retest-02.
- **Bộ mở rộng round 03 (100 tests):** Claude retest-03 ghi nhận 97/100 test đạt. Lỗi P3 duy nhất còn lại (R3-1 logo-original trong dist/) đã được xử lý bằng cách chuyển file ra ngoài thư mục `public/`.
- **Đã đóng các lỗi P3:**
  - A01 (R2-1): Đồng nhất trạng thái mục Câu chuyện giữa Desktop và Drawer ở trang chi tiết (`/cau-chuyen/:slug`).
  - A02 (R2-2): Xử lý query không liên quan (UTM, fbclid...) và dấu `/` cuối khi nhận diện mục hiện tại.
  - A03 (R2-3): Tối ưu logo Header và tạo favicon riêng.
  - R3-1: Cách ly ảnh logo gốc khỏi thư mục `public/`.
  - R3-2: Khôi phục bằng chứng gốc của Claude trong `docs/qa/2a-retest-02-evidence/`.
- **Hai mục BLOCKED ghi nhận mở (chờ điều kiện trước phát hành):**
  - A04: Kiểm tra trên host Vercel thật (chờ URL preview được cấp phép).
  - A05: Bảo vệ indexability của trang chờ từ phản hồi HTTP ban đầu (chờ duyệt phương án header `X-Robots-Tag` trên host thật).

#### Mốc 2B: Thiết Kế & Xây Dựng 6 Section Trang Chủ (ĐÃ TRIỂN KHAI — CHỜ REVIEW CHI TIẾT)
- [x] **Section 1 (Editorial Hero):** Headline *“Khi bé không khỏe, bạn không phải lo một mình.”*, mô tả & 2 CTA, 3 khung ảnh editorial bo góc cắt khuyết nghệ thuật lấy cảm hứng từ AURA.
- [x] **Section 2 (Vì sao chọn Lê Sơn?):** Immersive split layout, ảnh thú cưng lớn cảm xúc, thẻ Bento 3 giá trị cốt lõi (Chuyên môn & Trách nhiệm, Tận tâm & Lắng nghe, Theo dõi & Chăm sóc minh bạch) + Banner tiếp nhận Cấp cứu 24/24.
- [x] **Section 3 (Dịch vụ tiêu biểu):** 3 thẻ dịch vụ trọng tâm (Khám & điều trị, Chăm sóc nội trú 24/7, Spa & Grooming thẩm mỹ), nút "Xem tất cả dịch vụ" và dải Cổng Cấp cứu 24/24 khẩn cấp.
- [x] **Section 4 (Câu chuyện nổi bật):** 1 ca phục hồi tiêu biểu, quy trình 3 giai đoạn lâm sàng, có nhãn minh họa minh bạch (không có tên thuốc hay liều lượng nội bộ).
- [x] **Section 5 (Góc kiến thức & Tin tức):** 3 thẻ bài viết tạp chí (Editorial Magazine Cards), có thông báo bản mẫu biên tập rõ ràng.
- [x] **Section 6 (Đặt lịch & Liên hệ):** Thông tin 101 Khuất Duy Tiến, Hotline 097 355 51 05, Giờ khám 08:00 – 21:00, liên kết Google Maps và biểu mẫu demo với thông báo minh bạch chưa kết nối database (không báo gửi thành công giả).
- [ ] **Việc tiếp theo (Bước 2):** Xử lý B01 (chuyển form đầy đủ về `/dat-lich`, section 6 tập trung CTA/liên hệ), B02 (xác nhận cam kết trực ngày lễ) và bàn giao cho Claude review chi tiết độc lập 6 section 2B theo ma trận 7 kích thước.
- [ ] **DỪNG LẠI CHỜ PHÊ DUYỆT MỐC 2B TRƯỚC KHI BƯỚC VÀO GIAI ĐOẠN 3.**

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

### Giai đoạn 4: Tích Hợp Kỹ Thuật & Cổng Khách Hàng / Cổng Nội Bộ (Chờ Duyệt GĐ3)
- [ ] Tích hợp Form đặt lịch có kiểm tra dữ liệu và kết nối API 6 trạng thái xử lý.
- [ ] Khảo sát giải pháp xác thực (Authentication) & Database (Supabase/REST API) khi được cho phép.
- [ ] Cổng khách hàng cơ bản (`/tai-khoan/*`) dạng Customer Dashboard mobile-first tuân thủ nghiêm ngặt ma trận bảo mật và phân quyền y khoa (không lộ thuốc/y lệnh nội bộ).
- [ ] Cổng quản lý nội bộ (`/quan-ly/*`) dạng Operational Dashboard cho Bác sĩ, Spa, Quản lý theo Addendum 01 đã phê duyệt.

---

### Giai đoạn 5: Kiểm Thử, Tối Ưu Hóa & Chuẩn Bị Bàn Giao
- [ ] Đóng các mục BLOCKED A04 & A05 trên host Vercel thật khi có URL được cấp phép.
- [ ] Kiểm thử Responsive đa thiết bị & xử lý triệt để lỗi tràn ngang.
- [ ] Kiểm thử Accessibility (a11y): Tương phản màu, Keyboard focus navigation, thẻ ARIA.
- [ ] Tối ưu hóa hiệu năng & Core Web Vitals (LCP, CLS, INP).
- [ ] Kiểm tra SEO Onpage, Meta tags, Schema.org LocalBusiness (VeterinaryCare).
- [ ] Báo cáo QA và nghiệm thu bàn giao chính thức.
