# Bảng Quản Lý Tài Sản Hình Ảnh & Bản Quyền (Asset Credits Ledger)

**Dự án:** Website Bệnh viện Thú y Lê Sơn 2026  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Cập nhật lần cuối:** 26/10/2026 (Mốc 2B — Fix QA 2B-02 theo CEO Directive 007)  
**Quy chế:** Theo CEO Directive 006-A, 007 và `AGENTS.md`

---

## 1. Nguyên tắc quản lý bản quyền hình ảnh Mốc 2A / 2B

1. **Bản chất của kho ảnh hiện tại:**
   - **Tất cả hình ảnh hiển thị trên website hiện tại (ngoại trừ logo chính thức của Bệnh viện) là ảnh minh họa tạm thời (Editorial Mockup / Placeholder)**, phục vụ mục đích dựng khung giao diện, thử nghiệm trải nghiệm người dùng và nghiệm thu layout Vibrant Editorial Luxury.
   - **Tuyệt đối không có hình ảnh bệnh nhân hay bác sĩ thực tế nào bị mạo danh:** Không có bác sĩ hay người chăm sóc nào trong ảnh được gán danh tính là bác sĩ thật của viện; không có ca bệnh thật nào được công bố mà chưa có sự đồng ý của chủ nuôi.
   - **Ghi chú minh họa trên giao diện:** Các section có hình ảnh (Section 1 Hero, Section 3 Dịch vụ tiêu biểu, Section 4 Câu chuyện nổi bật, Section 5 Góc kiến thức) đều có nhãn hiển thị trực tiếp *"Ảnh minh họa"* hoặc *"Câu chuyện minh họa"*, cùng disclaimer rõ ràng về việc thẩm định nội dung.

2. **Chính sách chuyển giao sang Giai đoạn 3 (Chuyên sâu công khai):**
   - Chủ dự án sẽ cung cấp bộ ảnh chụp thực tế tại cơ sở 101 Khuất Duy Tiến (mặt tiền, sảnh đón, phòng khám, phòng mổ, khu nội trú, chân dung đội ngũ y bác sĩ).
   - Bộ ảnh chụp thật này sẽ thay thế toàn bộ 9 ảnh stock mockup hiện tại.
   - Trường hợp sử dụng ảnh ca bệnh điều trị thực tế, bệnh viện cần có phiếu chấp thuận bằng văn bản của chủ nuôi (Owner Consent Form).

---

## 2. Bảng kê chi tiết 12 tài sản hình ảnh (`public/images/`)

| STT | Tên file gốc & WebP | Vị trí sử dụng trên Web | Nguồn gốc / Công cụ tạo lập | Tác giả / Chủ sở hữu | Giấy phép / Điều khoản sử dụng | Trạng thái xác minh | Ghi chú & Phương án thay thế ở Giai đoạn 3 |
|:---:|:---|:---|:---|:---|:---|:---:|:---|
| 1 | `logo.png` | Header, Footer, Favicon | Chủ dự án cung cấp | Bệnh viện Thú y Lê Sơn | Sở hữu nội bộ bệnh viện | **Đã xác minh** | Tài sản thương hiệu chính thức duy nhất đã được xác minh đầy đủ. |
| 2 | `hero-vet-care.webp`<br>(+ `hero-vet-care-400w.webp`, `800w`) | Section 1 (Hero Frame 1) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Mô tả là người chăm sóc vỗ về thú cưng (Ảnh minh họa). Sẽ thay bằng ảnh bác sĩ Lê Sơn thăm khám thật ở GĐ3. |
| 3 | `hero-happy-cat.webp`<br>(+ `hero-happy-cat-400w.webp`, `800w`) | Section 1 (Hero Frame 2 - Vòm cong) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Phục vụ hiệu ứng vòm cong Editorial Luxury. Sẽ thay bằng ảnh mèo cưng tại phòng khám ở GĐ3. |
| 4 | `hero-clinic-cuddle.webp`<br>(+ `hero-clinic-cuddle-400w.webp`, `800w`) | Section 1 (Hero Frame 3) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Minh họa sự gắn kết và an tâm. Sẽ thay bằng ảnh khoảnh khắc thực tế tại viện ở GĐ3. |
| 5 | `why-pet-companion.webp` | Section 2 (Vì sao chọn Lê Sơn) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Minh họa góc tiếp đón thân thiện. Sẽ thay bằng ảnh sảnh đón 101 Khuất Duy Tiến ở GĐ3. |
| 6 | `service-exam.webp` | Section 3 (Khám & Điều Trị) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Có nhãn "Ảnh minh họa". Sẽ thay bằng ảnh phòng khám lâm sàng cơ sở thật ở GĐ3. |
| 7 | `service-inpatient.webp` | Section 3 (Chăm Sóc Nội Trú 24/7) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Có nhãn "Ảnh minh họa". Sẽ thay bằng ảnh khu nội trú thực tế tại 101 Khuất Duy Tiến ở GĐ3. |
| 8 | `service-spa.webp` | Section 3 (Spa & Grooming) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Có nhãn "Ảnh minh họa". Sẽ thay bằng ảnh phòng Spa & Grooming cơ sở thật ở GĐ3. |
| 9 | `story-recovery.webp` | Section 4 (Câu chuyện nổi bật) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Có huy hiệu "Câu chuyện minh họa" và disclaimer. Sẽ thay bằng ca bệnh thật có sự đồng ý của chủ nuôi ở GĐ3. |
| 10 | `article-nutrition.webp` | Section 5 (Bài 1: Dinh dưỡng) | Ảnh stock tĩnh vật thức ăn | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **Chưa xác minh bản quyền gốc** | Ảnh bát thức ăn sạch sẽ, không có nhãn hiệu thương mại, có nhãn "Ảnh minh họa". |
| 11 | `article-prevention.webp` | Section 5 (Bài 2: Phòng bệnh hô hấp) | Tạo lập bởi AI (Google Imagen 3 via Antigravity image-generator subagent) | Tạo lập nội bộ dự án | Điều khoản dịch vụ Google Generative AI (sử dụng phi độc quyền cho sản phẩm) | **Đã xác minh nguồn gốc tạo lập (AI)** | Chú chó lông vàng ấm áp trong nhà, hoàn toàn sạch logo bên thứ ba. Có nhãn "Ảnh minh họa". |
| 12 | `article-firstaid.webp` | Section 5 (Bài 3: Sơ cứu hóc dị vật) | Tạo lập bởi AI (Google Imagen 3 via Antigravity image-generator subagent, prompt kiểm tra khoang miệng hóc dị vật) | Tạo lập nội bộ dự án | Điều khoản dịch vụ Google Generative AI (sử dụng phi độc quyền cho sản phẩm) | **Đã xác minh nguồn gốc tạo lập (AI)** | Đúng chủ đề sơ cứu hóc dị vật/khoang miệng (2B-16), hoàn toàn sạch logo bên thứ ba. Có nhãn "Ảnh minh họa". |

---

## 3. Danh mục kiểm tra chuyển giao cho Chủ dự án trước khi phát hành Production

1. [ ] **Chính sách ảnh chính thức:** Chủ dự án chốt chính sách (chỉ dùng ảnh minh họa trong giai đoạn nghiệm thu giao diện, hay cần thay toàn bộ trước khi công bố ra công chúng).
2. [ ] **Bộ ảnh chụp thực tế cơ sở 101 Khuất Duy Tiến:** Cung cấp ảnh chụp chất lượng cao thay thế 9 tệp stock placeholder (STT 2–10).
3. [ ] **Ảnh chân dung & hồ sơ bác sĩ:** Cung cấp ảnh chụp blouse trắng chuẩn y khoa kèm chứng chỉ hành nghề đã công chứng (dành cho Giai đoạn 3).
4. [ ] **Thỏa thuận bản quyền ca bệnh (Owner Consent Form):** Thu thập văn bản chấp thuận của chủ nuôi trước khi xuất bản hình ảnh/tên thú cưng thực tế.
