# Bảng Quản Lý Tài Sản Hình Ảnh, Phông Chữ & Bản Quyền (Asset & Font Credits Ledger)

**Dự án:** Website Bệnh viện Thú y Lê Sơn 2026  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Cập nhật lần cuối:** 26/10/2026 (Mốc 2B — Fix QA 2B-04 & Triển khai CEO Directive 010-A)  
**Quy chế phối hợp:** Theo CEO Directive 006-A, 007, 008, 009, 010-A và `AGENTS.md`

---

## 1. Nguyên tắc quản lý bản quyền hình ảnh Mốc 2A / 2B (2B-06, 2B-19, 2B-22)

1. **Bản chất của kho ảnh hiện tại:**
   - **Tất cả hình ảnh hiển thị trên website hiện tại (ngoại trừ logo chính thức của Bệnh viện) là ảnh minh họa tạm thời (Editorial Mockup / Placeholder)**, phục vụ mục đích dựng khung giao diện, thử nghiệm trải nghiệm người dùng và nghiệm thu layout Vibrant Editorial Luxury.
   - **Tuyệt đối không có hình ảnh bệnh nhân hay bác sĩ thực tế nào bị mạo danh:** Không có bác sĩ hay người chăm sóc nào trong ảnh được gán danh tính là bác sĩ thật của viện; không có ca bệnh thật nào được công bố mà chưa có sự đồng ý của chủ nuôi. Không được tự khẳng định ảnh AI là hình ảnh thực tế của Bệnh viện Lê Sơn.
   - **Phân định nhãn minh họa thực tế trên từng section (2B-19, 2B-22):**
     - **Section 1 (Editorial Hero):** Ghi chú minh họa qua thuộc tính trợ năng `alt="... (Hình ảnh minh họa)"` trên cả 3 khung ảnh (`hero-vet-care`, `hero-happy-cat`, `hero-clinic-cuddle`). Không đặt đè huy hiệu badge lên ảnh để bảo toàn tính thẩm mỹ vòm cong nghệ thuật Editorial Luxury.
     - **Section 3 (Dịch vụ tiêu biểu):** Hiển thị nhãn trực quan nổi bật `Ảnh minh họa` (cỡ chữ 12px, nền đen mờ `bg-black/75 text-white`, tương phản cao đạt chuẩn WCAG AAA > 10:1) tại góc dưới bên phải từng thẻ dịch vụ.
     - **Section 4 (Câu chuyện nổi bật):** Hiển thị huy hiệu `Câu chuyện minh họa` và disclaimer minh bạch: *"Nội dung minh họa quy trình điều trị — Chưa xuất bản ca bệnh thực tế khi chưa có xác nhận từ chủ nuôi"*.
     - **Section 5 (Góc kiến thức & Tin tức):** Hiển thị nhãn trực quan nổi bật `Ảnh minh họa` (cỡ chữ 12px, nền đen mờ `bg-black/75 text-white`) tại góc từng thẻ bài viết, kèm thông báo lưu ý biên tập cấu trúc chuyên đề y khoa.

2. **Chính sách chuyển giao và điều kiện trước phát hành (CEO Directive 009 & 010-A):**
   - Chủ dự án đã phê duyệt: Bản preview được phép dùng ảnh minh họa có quyền sử dụng hợp lệ hoặc ảnh mockup tạm thời.
   - Trước khi phát hành chính thức ra môi trường production công khai, toàn bộ 9 ảnh stock placeholder chưa xác minh bản quyền gốc và 2 ảnh AI phải được thay thế hoàn toàn bằng bộ ảnh chụp thực tế cơ sở vật chất, đội ngũ y bác sĩ tại 101 Khuất Duy Tiến, hoặc ảnh có giấy phép thương mại xác minh độc lập.
   - Trường hợp sử dụng ảnh ca bệnh điều trị thực tế, bệnh viện cần có phiếu chấp thuận bằng văn bản của chủ nuôi (Owner Consent Form).

---

## 2. Bảng kê chi tiết 12 tài sản hình ảnh (`public/images/`)

> **Ghi chú dọn dẹp tài nguyên (2B-21):** Toàn bộ các tệp `.jpg` cũ không còn được tham chiếu trong mã nguồn đã được xóa hoàn toàn khỏi repository. Mọi hình ảnh triển khai hiện tại 100% sử dụng định dạng WebP tối ưu đa độ phân giải hoặc PNG thương hiệu.

| STT | Tên file WebP / PNG | Vị trí sử dụng trên Web | Nguồn gốc / Công cụ tạo lập | Tác giả / Chủ sở hữu | Giấy phép / Điều khoản sử dụng | Trạng thái xác minh (CEO Directive 010-A) | Ghi chú & Phương án thay thế ở Giai đoạn 3 |
|:---:|:---|:---|:---|:---|:---|:---:|:---|
| 1 | `logo.png` | Header, Footer, Favicon | Chủ dự án cung cấp | Bệnh viện Thú y Lê Sơn | Sở hữu nội bộ bệnh viện | **Đã xác minh** | Tài sản thương hiệu chính thức duy nhất đã được xác minh đầy đủ. |
| 2 | `hero-vet-care.webp`<br>(+ `hero-vet-care-400w.webp`, `800w`) | Section 1 (Hero Frame 1 - LCP Mobile) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **CHƯA XÁC MINH BẢN QUYỀN GỐC** | Phân định minh họa qua `alt` text: `(Hình ảnh minh họa)`. Sẽ thay bằng ảnh bác sĩ Lê Sơn thăm khám thật ở GĐ3. |
| 3 | `hero-happy-cat.webp`<br>(+ `hero-happy-cat-400w.webp`, `800w`) | Section 1 (Hero Frame 2 - Vòm cong LCP Desktop) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **CHƯA XÁC MINH BẢN QUYỀN GỐC** | Phục vụ hiệu ứng vòm cong Editorial Luxury. Phân định qua `alt` text. Sẽ thay bằng ảnh mèo cưng tại phòng khám ở GĐ3. |
| 4 | `hero-clinic-cuddle.webp`<br>(+ `hero-clinic-cuddle-400w.webp`, `800w`) | Section 1 (Hero Frame 3) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **CHƯA XÁC MINH BẢN QUYỀN GỐC** | Minh họa sự gắn kết và an tâm. Phân định qua `alt` text. Sẽ thay bằng ảnh khoảnh khắc thực tế tại viện ở GĐ3. |
| 5 | `why-pet-companion.webp` | Section 2 (Vì sao chọn Lê Sơn) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **CHƯA XÁC MINH BẢN QUYỀN GỐC** | Minh họa góc tiếp đón thân thiện. Sẽ thay bằng ảnh sảnh đón 101 Khuất Duy Tiến ở GĐ3. |
| 6 | `service-exam.webp` | Section 3 (Khám & Điều Trị) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **CHƯA XÁC MINH BẢN QUYỀN GỐC** | Có nhãn trực quan "Ảnh minh họa" (12px, tương phản cao). Sẽ thay bằng ảnh phòng khám lâm sàng cơ sở thật ở GĐ3. |
| 7 | `service-inpatient.webp` | Section 3 (Chăm Sóc Nội Trú 24/7) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **CHƯA XÁC MINH BẢN QUYỀN GỐC** | Có nhãn trực quan "Ảnh minh họa" (12px, tương phản cao). Sẽ thay bằng ảnh khu nội trú thực tế tại 101 Khuất Duy Tiến ở GĐ3. |
| 8 | `service-spa.webp` | Section 3 (Spa & Grooming) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **CHƯA XÁC MINH BẢN QUYỀN GỐC** | Có nhãn trực quan "Ảnh minh họa" (12px, tương phản cao). Sẽ thay bằng ảnh phòng Spa & Grooming cơ sở thật ở GĐ3. |
| 9 | `story-recovery.webp` | Section 4 (Câu chuyện nổi bật) | Ảnh stock mẫu (Mockup placeholder) | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **CHƯA XÁC MINH BẢN QUYỀN GỐC** | Có huy hiệu "Câu chuyện minh họa" và disclaimer. Sẽ thay bằng ca bệnh thật có sự đồng ý của chủ nuôi ở GĐ3. |
| 10 | `article-nutrition.webp` | Section 5 (Bài 1: Dinh dưỡng) | Ảnh stock tĩnh vật thức ăn | Chưa xác định tác giả gốc | Tạm thời dùng làm mockup dựng khung UI | **CHƯA XÁC MINH BẢN QUYỀN GỐC** | Ảnh bát thức ăn sạch sẽ, không có nhãn hiệu thương mại, có nhãn trực quan "Ảnh minh họa" (12px). |
| 11 | `article-prevention.webp` | Section 5 (Bài 2: Phòng bệnh hô hấp) | Tạo lập bởi AI (Google Imagen 3 via Antigravity image-generator subagent) | Tạo lập nội bộ dự án | Điều khoản dịch vụ Google Generative AI (sử dụng phi độc quyền cho sản phẩm) | **CHƯA XÁC MINH — NGUỒN TỰ KHAI** | Chú chó lông vàng ấm áp trong nhà, hoàn toàn sạch logo bên thứ ba. Có nhãn trực quan "Ảnh minh họa" (12px). Thay thế trước phát hành. |
| 12 | `article-firstaid.webp` | Section 5 (Bài 3: Sơ cứu hóc dị vật) | Tạo lập bởi AI (Google Imagen 3 via Antigravity image-generator subagent, prompt kiểm tra khoang miệng hóc dị vật) | Tạo lập nội bộ dự án | Điều khoản dịch vụ Google Generative AI (sử dụng phi độc quyền cho sản phẩm) | **CHƯA XÁC MINH — NGUỒN TỰ KHAI** | Đúng chủ đề sơ cứu hóc dị vật/khoang miệng (2B-16), hoàn toàn sạch logo bên thứ ba. Có nhãn trực quan "Ảnh minh họa" (12px). Thay thế trước phát hành. |

---

## 3. Bảng kê bản quyền phông chữ tự lưu trữ (Font Credits Ledger — 2B-23)

> Toàn bộ phông chữ tự lưu trữ (self-hosted) trong thư mục `public/fonts/` được phát hành theo giấy phép bản quyền nguồn mở quốc tế **SIL Open Font License (OFL 1.1)**, cho phép sử dụng, nhúng và phân phối miễn phí trong các sản phẩm thương mại và phi thương mại. Tài liệu giấy phép chi tiết được lưu trữ tại `docs/licenses/`.

| STT | Tên họ phông chữ | File WOFF2 triển khai | Dung lượng | Tác giả / Đơn vị thiết kế | Nguồn chính thức & Kho lưu trữ | Giấy phép bản quyền | Trạng thái xác minh | Phạm vi sử dụng trên Website |
|:---:|:---|:---|:---:|:---|:---|:---:|:---:|:---|
| 1 | **Be Vietnam Pro** (Regular 400) | `be-vietnam-pro-400.woff2` | 35.0 KB | Fábio Duarte Martins, Vietanh Nguyen | [Google Fonts OFL Repo](https://github.com/google/fonts/tree/main/ofl/bevietnampro) / [Better Type Foundry](https://github.com/bettertypefoundry/be-vietnam-pro) | SIL OFL 1.1 ([`OFL-BeVietnamPro.txt`](licenses/OFL-BeVietnamPro.txt)) | **Đã xác minh (SIL OFL 1.1)** | Toàn bộ văn bản thân trang (Body text, paragraphs, form labels, inputs, badges). Preloaded trong `<head>`. |
| 2 | **Be Vietnam Pro** (SemiBold 600) | `be-vietnam-pro-600.woff2` | 36.9 KB | Fábio Duarte Martins, Vietanh Nguyen | [Google Fonts OFL Repo](https://github.com/google/fonts/tree/main/ofl/bevietnampro) / [Better Type Foundry](https://github.com/bettertypefoundry/be-vietnam-pro) | SIL OFL 1.1 ([`OFL-BeVietnamPro.txt`](licenses/OFL-BeVietnamPro.txt)) | **Đã xác minh (SIL OFL 1.1)** | Nhãn nút bấm (Buttons, CTA), liên kết điều hướng Menu, tiêu đề phụ và văn bản in đậm (600–700). |
| 3 | **Lora** (SemiBold 600) | `lora-600.woff2` | 48.5 KB | Cyreal (Olga Karpushina, Alexei Vanyashin) | [Google Fonts OFL Repo](https://github.com/google/fonts/tree/main/ofl/lora) / [Cyreal Lora](https://github.com/cyrealtype/Lora-Cyrillic) | SIL OFL 1.1 ([`OFL-Lora.txt`](licenses/OFL-Lora.txt)) | **Đã xác minh (SIL OFL 1.1)** | Tiêu đề báo chí chuẩn Editorial Luxury (Hero `h1`, Section titles `h2`, thẻ thương hiệu logo "LÊ SƠN"). Preloaded trong `<head>`. |

### Kiến trúc tối ưu hóa phân phối phông chữ (2B-08):
- **Số quy tắc `@font-face` khai báo:** Đúng **3 quy tắc** trong [`src/styles/fonts.css`](file:///d:/webbvct/src/styles/fonts.css).
- **Số tệp phông chữ thực tế tải:** Đúng **3 tệp** trên cả trang chủ `/` và trang `/dat-lich`.
- **Tổng dung lượng phông chữ tải:** **120.4 KB** (giảm 60% so với 301.4 KB của vòng QA trước; giảm 83% số lượng HTTP requests từ 18 tệp xuống 3 tệp).
- **Tài nguyên chặn hiển thị (Render-blocking):** **0 tệp** (loại bỏ hoàn toàn stylesheet Google Fonts ngoại vi).
- **Bảo toàn hiển thị:** Đầy đủ 100% dấu thanh tiếng Việt (ă, â, đ, ê, ô, ơ, ư, sắc, huyền, hỏi, ngã, nặng) không lỗi font hay layout shift (CLS = 0).

---

## 4. Danh mục kiểm tra chuyển giao cho Chủ dự án trước khi phát hành Production (Pre-release)

1. [x] **Chính sách ảnh chính thức (CEO Directive 009 & 010-A):** Chủ dự án đã phê duyệt chính sách sử dụng ảnh minh họa cho preview và yêu cầu thay thế toàn bộ ảnh chưa xác minh trước khi phát hành.
2. [x] **Bản quyền phông chữ tự lưu trữ (2B-23):** Hoàn tất xác minh giấy phép nguồn mở SIL OFL 1.1 cho Be Vietnam Pro và Lora, lưu trữ file bản quyền gốc trong `docs/licenses/`.
3. [ ] **Bộ ảnh chụp thực tế cơ sở 101 Khuất Duy Tiến:** Cung cấp ảnh chụp chất lượng cao thay thế 9 tệp stock placeholder (STT 2–10) và 2 tệp ảnh AI (STT 11, 12).
4. [ ] **Ảnh chân dung & hồ sơ bác sĩ:** Cung cấp ảnh chụp blouse trắng chuẩn y khoa kèm chứng chỉ hành nghề đã công chứng (dành cho Giai đoạn 3).
5. [ ] **Thỏa thuận bản quyền ca bệnh (Owner Consent Form):** Thu thập văn bản chấp thuận của chủ nuôi trước khi xuất bản hình ảnh/tên thú cưng thực tế.
