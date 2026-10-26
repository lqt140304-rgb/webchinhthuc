# Bảng Quản Lý Tài Sản Hình Ảnh & Bản Quyền (Asset Credits Ledger)

**Dự án:** Website Bệnh viện Thú y Lê Sơn 2026  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Cập nhật lần cuối:** 26/10/2026 (Mốc 2B — Fix QA 2B-03 & Chuẩn bị 2B-04 theo CEO Directive 008, 009)  
**Quy chế:** Theo CEO Directive 006-A, 007, 008, 009 và `AGENTS.md`

---

## 1. Nguyên tắc quản lý bản quyền hình ảnh Mốc 2A / 2B

1. **Bản chất của kho ảnh hiện tại:**
   - **Tất cả hình ảnh hiển thị trên website hiện tại (ngoại trừ logo chính thức của Bệnh viện) là ảnh minh họa tạm thời (Editorial Mockup / Placeholder)**, phục vụ mục đích dựng khung giao diện, thử nghiệm trải nghiệm người dùng và nghiệm thu layout Vibrant Editorial Luxury.
   - **Tuyệt đối không có hình ảnh bệnh nhân hay bác sĩ thực tế nào bị mạo danh:** Không có bác sĩ hay người chăm sóc nào trong ảnh được gán danh tính là bác sĩ thật của viện; không có ca bệnh thật nào được công bố mà chưa có sự đồng ý của chủ nuôi.
   - **Phân định nhãn minh họa thực tế trên từng section (2B-19, 2B-22):**
     - **Section 1 (Editorial Hero):** Ghi chú minh họa qua thuộc tính trợ năng `alt="... (Hình ảnh minh họa)"` trên cả 3 khung ảnh (`hero-vet-care`, `hero-happy-cat`, `hero-clinic-cuddle`). Không đặt đè huy hiệu badge lên ảnh để bảo toàn tính thẩm mỹ vòm cong nghệ thuật Editorial Luxury.
     - **Section 3 (Dịch vụ tiêu biểu):** Hiển thị nhãn trực quan nổi bật `Ảnh minh họa` (cỡ chữ 12px, nền đen mờ `bg-black/75 text-white`, tương phản cao đạt chuẩn WCAG AAA) tại góc dưới bên phải từng thẻ dịch vụ.
     - **Section 4 (Câu chuyện nổi bật):** Hiển thị huy hiệu `Câu chuyện minh họa` và disclaimer minh bạch: *"Nội dung minh họa quy trình điều trị — Chưa xuất bản ca bệnh thực tế khi chưa có xác nhận từ chủ nuôi"*.
     - **Section 5 (Góc kiến thức & Tin tức):** Hiển thị nhãn trực quan nổi bật `Ảnh minh họa` (cỡ chữ 12px, nền đen mờ `bg-black/75 text-white`) tại góc từng thẻ bài viết, kèm thông báo lưu ý biên tập cấu trúc chuyên đề y khoa.

2. **Chính sách chuyển giao và điều kiện trước phát hành (CEO Directive 009):**
   - Chủ dự án đã phê duyệt: Bản preview được phép dùng ảnh minh họa có quyền sử dụng hợp lệ hoặc ảnh mockup tạm thời.
   - Trước khi phát hành chính thức ra môi trường production công khai, toàn bộ 9 ảnh stock placeholder chưa xác minh bản quyền gốc phải được thay thế hoàn toàn bằng bộ ảnh chụp thực tế cơ sở vật chất, đội ngũ y bác sĩ tại 101 Khuất Duy Tiến, hoặc ảnh có giấy phép thương mại xác minh được.
   - Trường hợp sử dụng ảnh ca bệnh điều trị thực tế, bệnh viện cần có phiếu chấp thuận bằng văn bản của chủ nuôi (Owner Consent Form).

---

## 2. Bảng kê chi tiết 12 tài sản hình ảnh (`public/images/`)

> **Ghi chú dọn dẹp tài nguyên (2B-21):** Toàn bộ các tệp `.jpg` cũ không còn được tham chiếu trong mã nguồn đã được xóa hoàn toàn khỏi repository. Mọi hình ảnh triển khai hiện tại 100% sử dụng định dạng WebP tối ưu đa độ phân giải hoặc PNG thương hiệu.

| STT | Tên file WebP / PNG | Vị trí sử dụng trên Web | Nguồn gốc / Công cụ tạo lập | Tác giả / Chủ sở hữu | Giấy phép / Điều khoản sử dụng | Trạng thái xác minh | Ghi chú & Phương án thay thế ở Giai đoạn 3 |
|:---:|:---|:---|:---|:---|:---|:---:|:---|
| 1 | `logo.png` | Header, Footer, Favicon | Chủ dự án cung cấp | Bệnh viện Thú y Lê Sơn | Sở hữu nội bộ bệnh viện | **Đã xác minh** | Tài sản thương hiệu chính thức duy nhất đã được xác minh đầy đủ. |
| 2 | `hero-vet-care.webp`<br>(+ `hero-vet-care-400w.webp`, `800w`) | Section 1 (Hero Frame 1 - LCP Mobile) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Phân định minh họa qua `alt` text: `(Hình ảnh minh họa)`. Sẽ thay bằng ảnh bác sĩ Lê Sơn thăm khám thật ở GĐ3. |
| 3 | `hero-happy-cat.webp`<br>(+ `hero-happy-cat-400w.webp`, `800w`) | Section 1 (Hero Frame 2 - Vòm cong LCP Desktop) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Phục vụ hiệu ứng vòm cong Editorial Luxury. Phân định qua `alt` text. Sẽ thay bằng ảnh mèo cưng tại phòng khám ở GĐ3. |
| 4 | `hero-clinic-cuddle.webp`<br>(+ `hero-clinic-cuddle-400w.webp`, `800w`) | Section 1 (Hero Frame 3) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Minh họa sự gắn kết và an tâm. Phân định qua `alt` text. Sẽ thay bằng ảnh khoảnh khắc thực tế tại viện ở GĐ3. |
| 5 | `why-pet-companion.webp` | Section 2 (Vì sao chọn Lê Sơn) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Minh họa góc tiếp đón thân thiện. Sẽ thay bằng ảnh sảnh đón 101 Khuất Duy Tiến ở GĐ3. |
| 6 | `service-exam.webp` | Section 3 (Khám & Điều Trị) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Có nhãn trực quan "Ảnh minh họa" (12px, tương phản cao). Sẽ thay bằng ảnh phòng khám lâm sàng cơ sở thật ở GĐ3. |
| 7 | `service-inpatient.webp` | Section 3 (Chăm Sóc Nội Trú 24/7) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Có nhãn trực quan "Ảnh minh họa" (12px, tương phản cao). Sẽ thay bằng ảnh khu nội trú thực tế tại 101 Khuất Duy Tiến ở GĐ3. |
| 8 | `service-spa.webp` | Section 3 (Spa & Grooming) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Có nhãn trực quan "Ảnh minh họa" (12px, tương phản cao). Sẽ thay bằng ảnh phòng Spa & Grooming cơ sở thật ở GĐ3. |
| 9 | `story-recovery.webp` | Section 4 (Câu chuyện nổi bật) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Có huy hiệu "Câu chuyện minh họa" và disclaimer. Sẽ thay bằng ca bệnh thật có sự đồng ý của chủ nuôi ở GĐ3. |
| 10 | `article-nutrition.webp` | Section 5 (Bài 1: Dinh dưỡng) | Ảnh stock tĩnh vật thức ăn | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Ảnh bát thức ăn sạch sẽ, không có nhãn hiệu thương mại, có nhãn trực quan "Ảnh minh họa" (12px). |
| 11 | `article-prevention.webp` | Section 5 (Bài 2: Phòng bệnh hô hấp) | Tạo lập bởi AI (Google Imagen 3 via Antigravity image-generator subagent) | Tạo lập nội bộ dự án | Điều khoản dịch vụ Google Generative AI (sử dụng phi độc quyền cho sản phẩm) | **Đã xác minh nguồn gốc tạo lập (AI)** | Chú chó lông vàng ấm áp trong nhà, hoàn toàn sạch logo bên thứ ba. Có nhãn trực quan "Ảnh minh họa" (12px). |
| 12 | `article-firstaid.webp` | Section 5 (Bài 3: Sơ cứu hóc dị vật) | Tạo lập bởi AI (Google Imagen 3 via Antigravity image-generator subagent, prompt kiểm tra khoang miệng hóc dị vật) | Tạo lập nội bộ dự án | Điều khoản dịch vụ Google Generative AI (sử dụng phi độc quyền cho sản phẩm) | **Đã xác minh nguồn gốc tạo lập (AI)** | Đúng chủ đề sơ cứu hóc dị vật/khoang miệng (2B-16), hoàn toàn sạch logo bên thứ ba. Có nhãn trực quan "Ảnh minh họa" (12px). |

---

## 3. Danh mục kiểm tra chuyển giao cho Chủ dự án trước khi phát hành Production (Pre-release)

1. [x] **Chính sách ảnh chính thức (CEO Directive 009):** Chủ dự án đã phê duyệt chính sách sử dụng ảnh minh họa cho preview và yêu cầu thay thế toàn bộ ảnh chưa xác minh trước khi phát hành.
2. [ ] **Bộ ảnh chụp thực tế cơ sở 101 Khuất Duy Tiến:** Cung cấp ảnh chụp chất lượng cao thay thế 9 tệp stock placeholder (STT 2–10).
3. [ ] **Ảnh chân dung & hồ sơ bác sĩ:** Cung cấp ảnh chụp blouse trắng chuẩn y khoa kèm chứng chỉ hành nghề đã công chứng (dành cho Giai đoạn 3).
4. [ ] **Thỏa thuận bản quyền ca bệnh (Owner Consent Form):** Thu thập văn bản chấp thuận của chủ nuôi trước khi xuất bản hình ảnh/tên thú cưng thực tế.
