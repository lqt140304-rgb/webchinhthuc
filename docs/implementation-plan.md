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

Cập nhật 26/10/2026 (Theo Báo cáo Retest-02 của Claude & Quyết định điều phối của CEO):
- **Trạng thái kiểm thử:** 76/78 test PASS (bộ chuẩn 51/51 pass, bộ mở rộng 25/25 pass sau khi sửa A01–A03, 0 console error, 2 test skip do BLOCKED).
- **Các tiêu chí P1 đã hoàn thành & kiểm chứng:** Khung layout, responsive không tràn ngang ở 5 viewports, active route có xét ranh giới, dropdown hover-click chuột/bàn phím, Drawer focus trap/khóa cuộn, JSON-LD động, bỏ hotline Header (Quyết định 3), Vercel rewrite (Quyết định 1).
- **Các lỗi P3 đã khắc phục:**
  - A01: Đồng nhất trạng thái mục Câu chuyện giữa Desktop và Drawer ở trang chi tiết (`/cau-chuyen/:slug`).
  - A02: Xử lý query không liên quan (UTM) và dấu `/` cuối khi nhận diện mục hiện tại.
  - A03: Tối ưu logo (`logo.png` ~27 KB <= 100 KB) và tạo favicon riêng (`favicon.png` ~3.7 KB <= 50 KB).
- **Hai mục BLOCKED ghi nhận mở (chờ điều kiện trước phát hành):**
  - A04: Kiểm tra trên host Vercel thật (chờ URL preview được cấp phép).
  - A05: Bảo vệ indexability của trang chờ từ phản hồi HTTP ban đầu (chờ chốt phương án header `X-Robots-Tag` trên host thật).

#### Mốc 2B: Thiết Kế & Xây Dựng 6 Section Trang Chủ (ĐÃ TRIỂN KHAI — CHỜ REVIEW CHI TIẾT)
- [x] **Section 1 (Editorial Hero):** Headline *“Khi bé không khỏe, bạn không phải lo một mình.”*, mô tả & 2 CTA, 3 khung ảnh editorial bo góc cắt khuyết nghệ thuật lấy cảm hứng từ AURA.
- [x] **Section 2 (Vì sao chọn Lê Sơn?):** Immersive split layout, ảnh thú cưng lớn cảm xúc, thẻ Bento 3 giá trị cốt lõi (Chuyên môn & Trách nhiệm, Tận tâm & Lắng nghe, Theo dõi & Chăm sóc minh bạch) + Banner tiếp nhận Cấp cứu 24/24.
- [x] **Section 3 (Dịch vụ tiêu biểu):** 3 thẻ dịch vụ trọng tâm (Khám & điều trị, Chăm sóc nội trú 24/7, Spa & Grooming thẩm mỹ), nút "Xem tất cả dịch vụ" và dải Cổng Cấp cứu 24/24 khẩn cấp.
- [x] **Section 4 (Câu chuyện nổi bật):** 1 ca phục hồi tiêu biểu, quy trình 3 giai đoạn lâm sàng, có nhãn minh họa minh bạch (không có tên thuốc hay liều lượng nội bộ).
- [x] **Section 5 (Góc kiến thức & Tin tức):** 3 thẻ bài viết tạp chí (Editorial Magazine Cards), có thông báo bản mẫu biên tập rõ ràng.
- [x] **Section 6 (Đặt lịch & Liên hệ):** Thông tin 101 Khuất Duy Tiến, Hotline 097 355 51 05, Giờ khám 08:00 – 21:00, liên kết Google Maps và biểu mẫu demo với thông báo minh bạch chưa kết nối database (không báo gửi thành công giả).
- [ ] **Việc tiếp theo (Bước 2):** Xử lý B01 (chuyển form đầy đủ về `/dat-lich`, section 6 tập trung CTA/liên hệ), B02 (xác nhận cam kết trực ngày lễ) và bàn giao cho Claude review chi tiết độc lập 6 section 2B.
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
