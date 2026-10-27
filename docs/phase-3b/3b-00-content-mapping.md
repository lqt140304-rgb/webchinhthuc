# MA TRẬN ÁNH XẠ NỘI DUNG GIAI ĐOẠN 3B — PHIÊN BẢN V1.0 (PHASE 3B-00 CONTENT MAPPING)
## Bệnh viện Thú y Lê Sơn 2026 — Kiểm Soát Tính Toàn Vẹn & Khóa Nội Dung (Content Lock)

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 038-A (Section VI)**; `AGENTS.md` (Architecture Baseline V1) |
| **Giai đoạn** | **3B-00: DOCUMENTATION ONLY — KHÔNG CODE** |
| **Phạm vi ánh xạ** | Tuyến trang `/dich-vu` và Tuyến trang `/bang-gia` |
| **Mục đích** | Rà soát từng trường thông tin, xác định nguồn chứng cứ, phân loại trạng thái xác minh và thiết lập quy tắc hiển thị trung tính khi chưa có dữ liệu thật. |

---

## 1. NGUYÊN TẮC PHÂN LOẠI & QUY TẮC HIỂN THỊ (CONTENT LOCK RULES)

Toàn bộ nội dung trong Giai đoạn 3B được phân loại nghiêm ngặt vào một trong ba trạng thái:

1. **`VERIFIED` (ĐÃ XÁC MINH):**
   - Đã được chủ dự án phê duyệt chính thức bằng văn bản, có cơ sở pháp lý hoặc đã được nghiệm thu tại các mốc trước.
   - *Quy tắc hiển thị:* Hiển thị chính thức, không cần nhãn bảo lưu.
2. **`PENDING` (CHỜ XÁC MINH):**
   - Nội dung giả định, danh mục dự kiến, các dịch vụ chuyên môn cần đối chiếu với bác sĩ phụ trách trước khi công bố.
   - *Quy tắc hiển thị:* Hiển thị dưới dạng thông tin tham khảo kèm nhãn rõ ràng: `[Đề xuất]`, `[Chờ xác nhận danh mục]` hoặc `[Dự kiến]`. Tuyệt đối không khẳng định như một sự thật đã hoàn tất.
3. **`ILLUSTRATIVE` (MINH HỌA THIẾT KẾ):**
   - Hình ảnh, icon, sơ đồ hỗ trợ trực quan.
   - *Quy tắc hiển thị:* Bắt buộc gắn watermark hoặc nhãn trực quan: `Ảnh minh họa dịch vụ`. Tuyệt đối không sử dụng ảnh stock có người mặc áo blouse/đồng phục y tế để tránh mạo nhận bác sĩ của bệnh viện.
4. **QUY TẮC BẢO VỆ GIÁ (PRICE LOCK RULE):**
   - **Tuyệt đối không tự bịa đặt số tiền.**
   - **Không sử dụng số tiền 0 VNĐ** để thay thế cho giá bị thiếu.
   - **Không dùng mock data tiền giả trong giao diện công khai.**
   - Các dịch vụ chưa có giá niêm yết bắt buộc phải mang trạng thái `UNAVAILABLE` (`Đang cập nhật biểu phí niêm yết`) hoặc `CONTACT` (`Báo giá sau khám lâm sàng`).

---

## 2. BẢNG ÁNH XẠ NỘI DUNG CHI TIẾT TRANG `/dich-vu`

| Section | Content ID | Nội dung dự kiến | Evidence / Nguồn tham chiếu | Trạng thái xác minh | Chủ thể xác minh | Quy tắc hiển thị khi chưa xác minh |
|---|---|---|---|---|---|---|
| **Hero** | `DV-HERO-01` | Breadcrumb: `Trang chủ / Dịch vụ` | Kiến trúc Navigation chuẩn | **VERIFIED** | Antigravity | Hiển thị link Trang chủ + nhãn Dịch vụ hiện tại |
| **Hero** | `DV-HERO-02` | Eyebrow: `HỆ THỐNG DỊCH VỤ Y TẾ THÚ CƯNG LÊ SƠN` | Brand Identity Baseline V1 | **VERIFIED** | Chủ dự án | Hiển thị chữ in hoa, màu Plum Primary |
| **Hero** | `DV-HERO-03` | H1: `Chăm sóc chu toàn từ phòng khám đến khu nội trú` | Slogan & Định vị thương hiệu | **VERIFIED** | Chủ dự án | Font Lora 600, không in nghiêng |
| **Hero** | `DV-HERO-04` | Đoạn dẫn giới thiệu tinh thần tận tâm, quy trình khử khuẩn, đồng thuận chủ nuôi | Văn phong chuẩn mực Mốc 2A/2B | **VERIFIED** | Chủ dự án | Font Be Vietnam Pro 400 |
| **Hero** | `DV-HERO-05` | Editorial Policy Banner: Thông báo danh mục đang chuẩn hóa theo định hướng Giai đoạn 3B | Yêu cầu minh bạch thông tin | **VERIFIED** | CEO Directive 038-A | Khung viền mỏng, biểu tượng thông tin |
| **Jump Bar** | `DV-NAV-01` | 5 tab neo nhanh: Khám điều trị, Cận lâm sàng, Nội trú, Spa, Cấp cứu | Sitemap cấu trúc dịch vụ | **VERIFIED** | CEO Directive 038-A | Thanh pill bo góc nhẹ, nhảy mượt tới anchor |
| **Nhóm 1** | `DV-GRP1-01` | Tên nhóm: `Khám Lâm Sàng & Điều Trị Chuyên Sâu` | Homepage Section 3 đã duyệt | **VERIFIED** | Chủ dự án | Tiêu đề H2 Lora 600 |
| **Nhóm 1** | `DV-GRP1-02` | Mô tả quy trình đo sinh hiệu, giải thích nguyên nhân, tư vấn phác đồ | Chuẩn y khoa phòng khám | **PENDING** | BS. Lê Thái Sơn | Giữ văn phong trung tính, trách nhiệm |
| **Nhóm 1** | `DV-GRP1-03` | Dịch vụ: Khám lâm sàng tổng quát & sàng lọc sức khỏe | Dịch vụ cơ bản của bệnh viện | **VERIFIED** | Chủ dự án | Hiển thị danh mục chính |
| **Nhóm 1** | `DV-GRP1-04` | Dịch vụ: Tiêm phòng vaccine & phòng ký sinh trùng | Dịch vụ cơ bản của bệnh viện | **VERIFIED** | Chủ dự án | Hiển thị danh mục chính |
| **Nhóm 1** | `DV-GRP1-05` | Dịch vụ: Phẫu thuật ngoại khoa mô mềm & triệt sản an toàn | Chuyên môn BS. Lê Thái Sơn | **VERIFIED** | Chủ dự án | Hiển thị rõ trách nhiệm chuyên môn |
| **Nhóm 1** | `DV-GRP1-06` | Dịch vụ: Điều trị bệnh lý nội khoa, tiêu hóa, hô hấp | Dịch vụ phổ biến thú y | **PENDING** | BS. Lê Thái Sơn | Gắn nhãn `[Chuẩn hóa phác đồ]` |
| **Nhóm 1** | `DV-GRP1-07` | Ảnh minh họa khám thú cưng | Asset minh họa không có người | **ILLUSTRATIVE** | Antigravity | Bắt buộc nhãn `Ảnh minh họa dịch vụ` |
| **Nhóm 1** | `DV-GRP1-08` | Link liên kết: `Tra cứu bảng giá khám & phẫu thuật ->` | Topology `/bang-gia` | **VERIFIED** | Antigravity | Trỏ sang `/bang-gia?cat=kham-dieu-tri` |
| **Nhóm 2** | `DV-GRP2-01` | Tên nhóm: `Chẩn Đoán Cận Lâm Sàng & Xét Nghiệm` | Năng lực chẩn đoán hình ảnh | **VERIFIED** | Chủ dự án | Tiêu đề H2 Lora 600 |
| **Nhóm 2** | `DV-GRP2-02` | Dịch vụ: Xét nghiệm huyết học & sinh hóa máu | Danh mục cận lâm sàng | **PENDING** | BS. Lê Thái Sơn | Gắn nhãn `[Cấu hình danh mục xét nghiệm]` |
| **Nhóm 2** | `DV-GRP2-03` | Dịch vụ: Chẩn đoán hình ảnh X-quang & Siêu âm kỹ thuật số | Năng lực thiết bị chẩn đoán | **PENDING** | BS. Lê Thái Sơn | Gắn nhãn `[Cấu hình thiết bị kiểm tra]` |
| **Nhóm 2** | `DV-GRP2-04` | Dịch vụ: Soi kính hiển vi da & tìm ký sinh trùng | Kỹ thuật chẩn đoán da liễu | **PENDING** | BS. Lê Thái Sơn | Gắn nhãn `[Quy trình chẩn đoán]` |
| **Nhóm 2** | `DV-GRP2-05` | Link liên kết: `Xem bảng giá xét nghiệm tham chiếu ->` | Topology `/bang-gia` | **VERIFIED** | Antigravity | Trỏ sang `/bang-gia?cat=xet-nghiem` |
| **Nhóm 3** | `DV-GRP3-01` | Tên nhóm: `Chăm Sóc Nội Trú Y Tế 24/7` | Homepage Section 3 đã duyệt | **VERIFIED** | Chủ dự án | Tiêu đề H2 Lora 600 |
| **Nhóm 3** | `DV-GRP3-02` | Nguyên tắc: Phân khu cách ly lây nhiễm nghiêm ngặt | Cơ sở vật chất 3A đã duyệt | **VERIFIED** | BS. Lê Thái Sơn | Trình bày nguyên tắc an toàn |
| **Nhóm 3** | `DV-GRP3-03` | Nguyên tắc: Đội ngũ theo dõi sinh hiệu, truyền dịch đúng giờ | Quy trình vận hành nội trú | **PENDING** | BS. Lê Thái Sơn | Gắn nhãn `[Đề xuất quy chuẩn nội trú]` |
| **Nhóm 3** | `DV-GRP3-04` | Nguyên tắc: Báo cáo tình hình bé định kỳ (không lộ y lệnh) | Architecture Baseline V1 | **VERIFIED** | Chủ dự án | Cam kết cập nhật không vi phạm bảo mật |
| **Nhóm 3** | `DV-GRP3-05` | Link liên kết: `Xem biểu phí nội trú lưu chuồng ->` | Topology `/bang-gia` | **VERIFIED** | Antigravity | Trỏ sang `/bang-gia?cat=noi-tru` |
| **Nhóm 4** | `DV-GRP4-01` | Tên nhóm: `Vệ Sinh Y Tế & Spa Grooming Dịu Nhẹ` | Homepage Section 3 đã duyệt | **VERIFIED** | Chủ dự án | Tiêu đề H2 Lora 600 |
| **Nhóm 4** | `DV-GRP4-02` | Gói dịch vụ: Tắm vệ sinh tiêu chuẩn, sấy chải, móng tai | Dịch vụ spa thú y cơ bản | **PENDING** | Chủ dự án | Gắn nhãn `[Quy cách gói dịch vụ]` |
| **Nhóm 4** | `DV-GRP4-03` | Gói dịch vụ: Cắt tỉa lông tạo hình thẩm mỹ | Dịch vụ grooming thẩm mỹ | **PENDING** | Chủ dự án | Gắn nhãn `[Quy cách gói dịch vụ]` |
| **Nhóm 4** | `DV-GRP4-04` | Gói dịch vụ: Tắm trị liệu viêm da/nấm theo chỉ định bác sĩ | Dịch vụ spa y tế đặc thù | **PENDING** | BS. Lê Thái Sơn | Gắn nhãn `[Phác đồ tắm trị liệu y tế]` |
| **Nhóm 4** | `DV-GRP4-05` | Link liên kết: `Xem bảng giá dịch vụ spa grooming ->` | Topology `/bang-gia` | **VERIFIED** | Antigravity | Trỏ sang `/bang-gia?cat=spa` |
| **Cấp cứu** | `DV-EMG-01` | Khối Tiếp nhận Cấp cứu 24/24 Warm Orange | Homepage Section 3 đã duyệt | **VERIFIED** | Chủ dự án | Nền Warm Orange/Amber, Hotline 24/24 |
| **Cấp cứu** | `DV-EMG-02` | Dấu hiệu khẩn: Khó thở, co giật, ngộ độc, dị vật, tai nạn | Hướng dẫn sơ cấp cứu y khoa | **VERIFIED** | BS. Lê Thái Sơn | Liệt kê rõ các triệu chứng nguy cấp |
| **Cấp cứu** | `DV-EMG-03` | Nút gọi khẩn: `Gọi Cấp cứu: 097 355 51 05` | Hotline xác thực 26/10 | **VERIFIED** | Chủ dự án | Gắn link `tel:0973555105` |
| **Lưu ý** | `DV-NOTE-01` | Lưu ý 01: Nhịn ăn 6-8h trước xét nghiệm sinh hóa / phẫu thuật | Khuyến cáo y khoa quốc tế | **VERIFIED** | BS. Lê Thái Sơn | Khung thẻ kiến trúc 01 |
| **Lưu ý** | `DV-NOTE-02` | Lưu ý 02: Vận chuyển an toàn bằng lồng hoặc dây dắt | Biện pháp an toàn phòng khám | **VERIFIED** | Chủ dự án | Khung thẻ kiến trúc 02 |
| **Lưu ý** | `DV-NOTE-03` | Lưu ý 03: Mang theo sổ tiêm chủng & thuốc đang dùng | Quy trình tiếp đón thú y | **VERIFIED** | BS. Lê Thái Sơn | Khung thẻ kiến trúc 03 |
| **Dark CTA** | `DV-CTA-01` | Tiêu đề: `Bạn cần tư vấn dịch vụ phù hợp cho bé?` | Component EditorialDarkCTA | **VERIFIED** | Antigravity | Nền Deep Plum `#421247` |
| **Dark CTA** | `DV-CTA-02` | Nút 1: `Đặt lịch khám online` trỏ `/dat-lich` | Luồng chuyển đổi chuẩn | **VERIFIED** | Antigravity | Nút chính Plum Primary |
| **Dark CTA** | `DV-CTA-03` | Nút 2: `Xem bảng giá dịch vụ` trỏ `/bang-gia` | Luồng chuyển tiếp 3B | **VERIFIED** | Antigravity | Nút phụ viền trắng |

---

## 3. BẢNG ÁNH XẠ NỘI DUNG CHI TIẾT TRANG `/bang-gia`

| Section | Content ID | Nội dung dự kiến | Evidence / Nguồn tham chiếu | Trạng thái xác minh | Chủ thể xác minh | Quy tắc hiển thị khi chưa xác minh |
|---|---|---|---|---|---|---|
| **Heading** | `BG-HEAD-01` | Breadcrumb: `Trang chủ / Dịch vụ / Bảng giá niêm yết` | Navigation chuẩn | **VERIFIED** | Antigravity | Thể hiện phân cấp rõ ràng |
| **Heading** | `BG-HEAD-02` | Eyebrow: `MINH BẠCH CHI PHÍ Y TẾ THÚ CƯNG` | Tôn chỉ thương hiệu | **VERIFIED** | Chủ dự án | Chữ in hoa màu Plum |
| **Heading** | `BG-HEAD-03` | H1: `Bảng giá dịch vụ & biểu phí tham chiếu` | Chuẩn SEO & định vị bảng giá | **VERIFIED** | Chủ dự án | Font Lora 600 |
| **Heading** | `BG-HEAD-04` | Đoạn dẫn cam kết báo giá trước điều trị, không chi phí ẩn | Cam kết đạo đức y khoa | **VERIFIED** | Chủ dự án | Font Be Vietnam Pro 400 |
| **Heading** | `BG-HEAD-05` | Banner quy định biến động giá: Cân nặng, độ tuổi, cấp cứu đêm | Quy chế vận hành y tế | **VERIFIED** | Chủ dự án | Khung cảnh báo màu hổ phách/amber |
| **Toolbar** | `BG-TOOL-01` | Ô tìm kiếm: Tìm theo tên dịch vụ, xét nghiệm, gói spa | Tính năng tìm kiếm tức thời | **VERIFIED** | Antigravity | Accessible search input, có nút clear `X` |
| **Toolbar** | `BG-TOOL-02` | 6 Tab phân loại: Tất cả, Khám & Thủ thuật, Xét nghiệm, Phẫu thuật, Nội trú, Spa | Cấu trúc phân nhóm dịch vụ | **VERIFIED** | CEO Directive 038-A | Dải pill cuộn ngang trên mobile, hiển thị số đếm |
| **Bảng giá** | `BG-PRC-01` | Dịch vụ: *Khám lâm sàng tổng quát ban đầu* | Dịch vụ thường trực | **PENDING** | Chủ dự án & BS. Sơn | Hiển thị trạng thái `UNAVAILABLE` hoặc `CONTACT` |
| **Bảng giá** | `BG-PRC-02` | Dịch vụ: *Tái khám theo hẹn của bác sĩ* | Quy trình tái khám | **PENDING** | Chủ dự án & BS. Sơn | Hiển thị trạng thái `UNAVAILABLE` hoặc `CONTACT` |
| **Bảng giá** | `BG-PRC-03` | Dịch vụ: *Tiêm phòng Vaccine phòng bệnh chó/mèo* | Dịch vụ dự phòng | **PENDING** | Chủ dự án & BS. Sơn | Hiển thị trạng thái `UNAVAILABLE` hoặc `CONTACT` |
| **Bảng giá** | `BG-PRC-04` | Dịch vụ: *Cấp cứu ngoài giờ y tế (21:00 – 08:00)* | Dịch vụ khẩn cấp 24/24 | **PENDING** | Chủ dự án | Gắn nhãn phụ phí ngoài giờ chờ phê duyệt |
| **Bảng giá** | `BG-PRC-05` | Dịch vụ: *Xét nghiệm huyết học tổng quát 18 chỉ số* | Kỹ thuật cận lâm sàng | **PENDING** | BS. Lê Thái Sơn | Hiển thị trạng thái `UNAVAILABLE` hoặc `CONTACT` |
| **Bảng giá** | `BG-PRC-06` | Dịch vụ: *Xét nghiệm sinh hóa máu kiểm tra gan thận* | Kỹ thuật cận lâm sàng | **PENDING** | BS. Lê Thái Sơn | Hiển thị trạng thái `UNAVAILABLE` hoặc `CONTACT` |
| **Bảng giá** | `BG-PRC-07` | Dịch vụ: *Chụp X-quang kỹ thuật số (1 tư thế)* | Kỹ thuật cận lâm sàng | **PENDING** | BS. Lê Thái Sơn | Hiển thị trạng thái `UNAVAILABLE` hoặc `CONTACT` |
| **Bảng giá** | `BG-PRC-08` | Dịch vụ: *Siêu âm ổ bụng tổng quát* | Kỹ thuật cận lâm sàng | **PENDING** | BS. Lê Thái Sơn | Hiển thị trạng thái `UNAVAILABLE` hoặc `CONTACT` |
| **Bảng giá** | `BG-PRC-09` | Dịch vụ: *Triệt sản an toàn (Mèo đực / Mèo cái)* | Phẫu thuật thường quy | **PENDING** | BS. Lê Thái Sơn | Hiển thị trạng thái `UNAVAILABLE` hoặc `CONTACT` |
| **Bảng giá** | `BG-PRC-10` | Dịch vụ: *Triệt sản an toàn (Chó đực / Chó cái theo cân nặng)* | Phẫu thuật thường quy | **PENDING** | BS. Lê Thái Sơn | Hiển thị trạng thái `UNAVAILABLE` hoặc `CONTACT` |
| **Bảng giá** | `BG-PRC-11` | Dịch vụ: *Phẫu thuật mô mềm & xử lý vết thương hở* | Phẫu thuật ngoại khoa | **PENDING** | BS. Lê Thái Sơn | Hiển thị trạng thái `CONTACT` (`Báo giá sau khám`) |
| **Bảng giá** | `BG-PRC-12` | Dịch vụ: *Lưu trú nội trú theo dõi y tế (Mèo)* | Biểu phí nội trú 24/7 | **PENDING** | Chủ dự án | Hiển thị trạng thái `UNAVAILABLE` hoặc `CONTACT` |
| **Bảng giá** | `BG-PRC-13` | Dịch vụ: *Lưu trú nội trú theo dõi y tế (Chó theo cân nặng)* | Biểu phí nội trú 24/7 | **PENDING** | Chủ dự án | Hiển thị trạng thái `UNAVAILABLE` hoặc `CONTACT` |
| **Bảng giá** | `BG-PRC-14` | Dịch vụ: *Gói tắm vệ sinh & sấy chải tiêu chuẩn* | Dịch vụ spa thẩm mỹ | **PENDING** | Chủ dự án | Hiển thị trạng thái `UNAVAILABLE` hoặc `CONTACT` |
| **Bảng giá** | `BG-PRC-15` | Dịch vụ: *Gói cắt tỉa lông tạo hình thú cưng* | Dịch vụ spa thẩm mỹ | **PENDING** | Chủ dự án | Hiển thị trạng thái `UNAVAILABLE` hoặc `CONTACT` |
| **Bảng giá** | `BG-PRC-16` | Ghi chú điều kiện & nội dung bao gồm trong từng dịch vụ | Thông tin chi tiết accordion | **PENDING** | BS. Sơn & Chủ dự án | Hiển thị tóm tắt minh bạch khi mở accordion |
| **Quy trình**| `BG-PROC-01` | Bước 01: Thăm khám lâm sàng & lắng nghe phản ánh | Quy trình báo giá chuẩn | **VERIFIED** | Chủ dự án | Trình bày 3 bước Hairline Ledger |
| **Quy trình**| `BG-PROC-02` | Bước 02: Tư vấn phác đồ & lập dự toán chi tiết | Quy trình báo giá chuẩn | **VERIFIED** | Chủ dự án | Cam kết không phát sinh ngoài dự toán |
| **Quy trình**| `BG-PROC-03` | Bước 03: Điều trị theo thỏa thuận đồng thuận | Đạo đức hành nghề y | **VERIFIED** | Chủ dự án | Chủ nuôi toàn quyền quyết định phác đồ |
| **Dark CTA** | `BG-CTA-01` | Tiêu đề: `Bạn cần tư vấn chi phí cụ thể cho trường hợp của bé?` | Component EditorialDarkCTA | **VERIFIED** | Antigravity | Nền Deep Plum `#421247` |
| **Dark CTA** | `BG-CTA-02` | Nút 1: `Đăng ký lịch khám ngay` trỏ `/dat-lich` | Luồng chuyển đổi chuẩn | **VERIFIED** | Antigravity | Nút chính Plum Primary |
| **Dark CTA** | `BG-CTA-03` | Nút 2: `Gọi tư vấn: 097 355 51 05` (`tel:0973555105`) | Hotline xác thực 26/10 | **VERIFIED** | Chủ dự án | Nút phụ viền trắng |

---

## 4. BẢNG THEO DÕI NỘI DUNG CHỜ XÁC MINH TRƯỚC PHÁT HÀNH PRODUCTION

Để đưa hai trang `/dich-vu` và `/bang-gia` từ giai đoạn Preview sang phát hành Production chính thức, danh mục thông tin sau bắt buộc phải có tài liệu ký duyệt từ Chủ dự án và Bác sĩ phụ trách:

1. **Hồ sơ Biểu phí chính thức:** File bảng giá niêm yết có chữ ký duyệt của Chủ dự án (bao gồm mức giá cố định, khoảng giá theo cân nặng hoặc công thức tính).
2. **Quy định phụ phí ngoài giờ:** Mức phụ phí và khung giờ áp dụng ngoài giờ y tế (hiện đề xuất khung 21:00 – 08:00 sáng hôm sau).
3. **Danh mục gói dịch vụ Spa Grooming:** Quy chuẩn phân loại cân nặng thú cưng (ví dụ: <5kg, 5–10kg, 10–20kg, >20kg) và danh sách dịch vụ đi kèm trong gói.
4. **Bản quyền hình ảnh dịch vụ thực tế:** Thay thế toàn bộ ảnh minh họa bằng ảnh chụp phòng khám, khu nội trú và trang thiết bị thực tế tại 101 Khuất Duy Tiến kèm văn bản cấp quyền sử dụng hình ảnh (AP-1).

---

**KẾT THÚC MA TRẬN ÁNH XẠ NỘI DUNG 3B-00 (CONTENT MAPPING V1.0)**
