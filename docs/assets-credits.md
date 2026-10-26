# Bảng Quản Lý Tài Sản Ảnh & Ghi Công Bản Quyền (Asset Credits Ledger)

**Dự án:** Website Bệnh viện Thú y Lê Sơn 2026  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Cập nhật lần cuối:** 26/10/2026 (Mốc 2B — Fix QA 2B-01)  
**Quy chế:** Theo CEO Directive 006-A (mục 2B-06) và `AGENTS.md`

---

## 1. Nguyên tắc quản lý bản quyền hình ảnh

1. **Giai đoạn Mốc 2A / 2B:**
   - Toàn bộ hình ảnh sử dụng trên giao diện công khai hiện tại là **ảnh minh họa (placeholder/editorial showcase)** hoặc **ảnh do AI tạo lập bản quyền sạch**, phục vụ việc hoàn thiện layout chuẩn Vibrant Editorial Luxury và nghiệm thu cấu trúc UX/UI.
   - **Tuyệt đối không sử dụng** hình ảnh chứa logo, watermark hoặc nhãn hiệu của bên thứ ba (đã khắc phục triệt để logo `chewy.com` và `Champion` tại 2B-05).
   - Website có disclaimer minh bạch tại các section có ca bệnh/bài viết mẫu: *"Nội dung và hình ảnh minh họa — Chưa xuất bản dữ liệu thực tế khi chưa có xác nhận từ chủ nuôi/chủ dự án"*.

2. **Chuyển giao sang Giai đoạn 3 (Chuyên sâu công khai):**
   - Chủ dự án sẽ cung cấp bộ ảnh chụp thực tế tại cơ sở 101 Khuất Duy Tiến (ảnh cơ sở vật chất, phòng phẫu thuật, phòng lưu trú, chân dung đội ngũ bác sĩ).
   - Mọi ảnh do khách hàng cung cấp (chủ nuôi đồng ý chia sẻ ca bệnh) phải có văn bản hoặc bằng chứng thỏa thuận quyền sử dụng hình ảnh.

---

## 2. Danh mục chi tiết 12 tài sản hình ảnh (`public/images/`)

| STT | Tên file | Vị trí sử dụng | Nguồn / Xuất xứ | Tác giả / Đơn vị sở hữu | Điều khoản sử dụng & Ghi công | Tình trạng xác minh | Ghi chú & Hành động chuyển giao |
|:---:|:---|:---|:---|:---|:---|:---:|:---|
| 1 | `logo.png` | Header, Footer, Favicon | Chủ dự án cung cấp | Bệnh viện Thú y Lê Sơn | Sở hữu nội bộ dự án | **Đã xác minh** | Tài sản thương hiệu chính thức của bệnh viện. |
| 2 | `hero-vet-care.jpg` | Section 1 (Hero Frame 1) | Unsplash / Editorial Collection | Nhiếp ảnh gia độc lập (Pexels/Unsplash) | Giấy phép miễn phí thương mại (Unsplash/Pexels License) | **Minh họa tạm thời** | Không mô tả là "bác sĩ lâm sàng". Sẽ thay bằng ảnh bác sĩ Lê Sơn thực tế ở Giai đoạn 3. |
| 3 | `hero-happy-cat.jpg` | Section 1 (Hero Frame 2 - Vòm cong) | Unsplash / Pet Wellness | Nhiếp ảnh gia tự do | Giấy phép miễn phí thương mại | **Minh họa tạm thời** | Phục vụ hiệu ứng vòm cong Editorial Luxury. |
| 4 | `hero-clinic-cuddle.jpg` | Section 1 (Hero Frame 3) | Pexels / Editorial Pet Care | Nhiếp ảnh gia tự do | Giấy phép miễn phí thương mại | **Minh họa tạm thời** | Thể hiện sự gắn kết và an tâm đồng hành. |
| 5 | `why-pet-companion.jpg` | Section 2 (Vì sao chọn Lê Sơn) | Stock Editorial Showcase | Studio nhiếp ảnh thú cưng | Giấy phép biên tập / Demo dự án | **Minh họa tạm thời** | Minh họa góc tiếp đón thân thiện. Sẽ thay bằng ảnh sảnh đón 101 Khuất Duy Tiến ở Giai đoạn 3. |
| 6 | `service-exam.jpg` | Section 3 (Khám & Điều trị nội khoa) | Stock Vet Clinical | Phòng khám mẫu / Stock | Giấy phép biên tập / Demo dự án | **Minh họa tạm thời** | Sẽ thay bằng ảnh phòng khám chuyên khoa thực tế tại cơ sở ở Giai đoạn 3. |
| 7 | `service-inpatient.jpg` | Section 3 (Chăm sóc nội trú 24/7) | Stock Pet Inpatient | Khách sạn thú cưng / Lưu trú mẫu | Giấy phép biên tập / Demo dự án | **Minh họa tạm thời** | Sẽ thay bằng ảnh khu nội trú thực tế tại Lê Sơn ở Giai đoạn 3. |
| 8 | `service-spa.jpg` | Section 3 (Spa & Thẩm mỹ y khoa) | Stock Pet Grooming | Grooming Studio mẫu | Giấy phép biên tập / Demo dự án | **Minh họa tạm thời** | Sẽ thay bằng ảnh phòng Spa & Trị liệu da lông tại cơ sở ở Giai đoạn 3. |
| 9 | `story-recovery.jpg` | Section 4 (Câu chuyện nổi bật) | Unsplash / Happy Dog Recovery | Nhiếp ảnh gia tự do | Giấy phép miễn phí thương mại | **Minh họa tạm thời** | Có nhãn "Câu chuyện minh họa". Sẽ thay bằng ảnh ca bệnh thực tế được chủ nuôi phê duyệt. |
| 10 | `article-nutrition.jpg` | Section 5 (Bài 1: Dinh dưỡng) | Stock Healthy Pet Food | Chuyên gia dinh dưỡng / Stock | Giấy phép miễn phí thương mại | **Minh họa tạm thời** | Ảnh bát thức ăn dinh dưỡng sạch sẽ, không có nhãn hiệu thương mại. |
| 11 | `article-prevention.jpg` | Section 5 (Bài 2: Phòng bệnh giao mùa) | AI Generated (Imagen 3 / Midjourney editorial style) | Antigravity AI Generator | Sở hữu tạo tác nội bộ dự án, không vướng bản quyền bên thứ ba | **Đã xác minh (Thay mới 2B-05)** | Đã loại bỏ hoàn toàn ảnh cũ có logo `chewy.com`. Ảnh mới chụp chú chó lông vàng ấm áp trong nhà. |
| 12 | `article-firstaid.jpg` | Section 5 (Bài 3: Sơ cứu khẩn cấp) | AI Generated (Imagen 3 / Midjourney editorial style) | Antigravity AI Generator | Sở hữu tạo tác nội bộ dự án, không vướng bản quyền bên thứ ba | **Đã xác minh (Thay mới 2B-05)** | Đã loại bỏ hoàn toàn ảnh cũ có logo đồ chơi `Champion`. Ảnh mới chụp chăm sóc bàn chân cún cưng cùng hộp cứu thương. |

---

## 3. Danh sách kiểm tra cần chủ dự án bổ sung trước khi phát hành Production

1. [ ] **Bộ ảnh chụp thực tế cơ sở:** Cung cấp ảnh có độ phân giải cao (tối thiểu 1920x1080) chụp mặt tiền 101 Khuất Duy Tiến, phòng tiếp đón, phòng khám, phòng mổ và khu lưu trú.
2. [ ] **Ảnh chân dung bác sĩ (Giai đoạn 3):** Ảnh chụp blouse trắng chuẩn y khoa của đội ngũ bác sĩ kèm chứng chỉ hành nghề đã được xác minh.
3. [ ] **Thỏa thuận bản quyền ca bệnh thực tế:** Mẫu phiếu chấp thuận (Owner Consent Form) có chữ ký chủ nuôi khi đưa hình ảnh/tên thú cưng lên chuyên mục Câu chuyện hồi phục.
4. [ ] **Giấy phép ảnh thương mại (nếu dùng stock mua bản quyền):** Lưu trữ hóa đơn hoặc chứng chỉ bản quyền (Shutterstock/iStock/Getty) vào kho lưu trữ nội bộ dự án nếu quyết định mua stock thay vì chụp thực tế.
