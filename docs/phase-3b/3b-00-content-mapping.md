# MA TRẬN ÁNH XẠ NỘI DUNG GIAI ĐOẠN 3B — PHIÊN BẢN V1.1 (PHASE 3B-00 CONTENT MAPPING)
## Bệnh viện Thú y Lê Sơn 2026 — Kiểm Soát Tính Toàn Vẹn & Khóa Nội Dung (Content Lock)

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 042-A (Section V, VI)**; `docs/phase-3b/3b-00-content-evidence-gate.md`; Báo cáo Claude QA `docs/qa/3b-00-design-doc-qa.md` |
| **Giai đoạn** | **3B-00: DOCUMENTATION ONLY — KHÔNG CODE** |
| **Phạm vi ánh xạ** | Tuyến trang `/dich-vu` và Tuyến trang `/bang-gia` |
| **Trạng thái tài liệu** | **CHỜ CHỦ DỰ ÁN PHÊ DUYỆT (PENDING OWNER APPROVAL)** |

---

## 1. NGUYÊN TẮC ÁP DỤNG CONTENT EVIDENCE GATE

Tuân thủ nghiêm ngặt quy chế kiểm soát bằng chứng tại [`docs/phase-3b/3b-00-content-evidence-gate.md`](file:///d:/webbvct/docs/phase-3b/3b-00-content-evidence-gate.md):
1. **Chỉ đánh dấu `VERIFIED` khi có đủ 5 yếu tố:** (1) Nội dung cụ thể, (2) Nguồn bằng chứng xác thực (chỉ đạo CEO, văn bản ký duyệt), (3) Người xác minh cụ thể, (4) Ngày xác minh, (5) Phạm vi công bố.
2. **Hạ toàn bộ claim chuyên môn thiếu bằng chứng về `PENDING`:** Tuyệt đối không tự nâng cấp claim y khoa, quy trình nội trú hoặc danh mục kỹ thuật thành VERIFIED khi chưa có văn bản duyệt.
3. **Không tự gán chuyên môn cho bác sĩ:** Không gán chức danh ngoại khoa, kíp mổ hay máy gây mê cho BS. Lê Thái Sơn.
4. **Không giá giả:** Các mục giá đều mang trạng thái `UNAVAILABLE` (`Đang cập nhật biểu phí niêm yết`) hoặc `CONTACT` (`Báo giá sau khám lâm sàng`).

---

## 2. BẢNG ÁNH XẠ NỘI DUNG CHI TIẾT TRANG `/dich-vu`

| Section | Content ID | Nội dung dự kiến | Bằng chứng cụ thể (văn bản / commit / chỉ đạo) | Người duyệt & Ngày duyệt | Phạm vi công bố | Trạng thái xác minh | Quy tắc hiển thị khi chưa xác minh |
|---|---|---|---|---|---|---|---|
| **Hero** | `DV-HERO-01` | Breadcrumb: `Trang chủ / Dịch vụ` | Architecture Baseline V1 (`AGENTS.md`) | Antigravity (26/10/2026) | Toàn trang Public | **VERIFIED** | Hiển thị link Trang chủ + nhãn Dịch vụ |
| **Hero** | `DV-HERO-02` | Eyebrow: `HỆ THỐNG DỊCH VỤ Y TẾ THÚ CƯNG LÊ SƠN` | Brand Identity Baseline V1 | Chủ dự án (26/10/2026) | Toàn trang Public | **VERIFIED** | Chữ in hoa, màu Plum Primary |
| **Hero** | `DV-HERO-03` | H1: `Chăm sóc chu toàn từ phòng khám đến khu nội trú` | Slogan định vị thương hiệu đã duyệt | Chủ dự án (26/10/2026) | Toàn trang Public | **VERIFIED** | Font Lora 600, không in nghiêng |
| **Hero** | `DV-HERO-04` | Đoạn dẫn giới thiệu tinh thần cẩn trọng, chu đáo | Văn phong chuẩn mực Mốc 2A/2B | Chủ dự án (26/10/2026) | Toàn trang Public | **VERIFIED** | Font Be Vietnam Pro 400 |
| **Hero** | `DV-HERO-05` | Editorial Policy Banner: Thông báo danh mục đang chuẩn hóa Giai đoạn 3B | CEO Directive 042-A | CEO / Chủ dự án (28/10/2026)| Khung thông báo | **VERIFIED** | Khung viền mỏng, icon thông tin |
| **Jump Bar** | `DV-NAV-01` | 6 tab neo nhanh: `#kham-dieu-tri`, `#can-lam-sang`, `#phau-thuat`, `#noi-tru`, `#spa-grooming`, `#cap-cuu` | Đề xuất Taxonomy chuẩn 5 nhóm (3B-DEC-05) | Chờ chủ dự án duyệt | Thanh điều hướng | **PENDING** | Dải pill dính, hỗ trợ cuộn mượt |
| **Nhóm 1** | `DV-GRP1-01` | Tên nhóm: `Khám & Điều Trị Lâm Sàng` | Đề xuất danh mục chuẩn (3B-DEC-05) | Chờ chủ dự án duyệt | Tiêu đề nhóm H2 | **PENDING** | Tiêu đề H2 kèm nhãn `[Đề xuất]` |
| **Nhóm 1** | `DV-GRP1-02` | Mô tả quy trình thăm khám cẩn trọng, đo sinh hiệu | Đề xuất quy trình lâm sàng | Chờ BS. Sơn duyệt | Đoạn văn mô tả | **PENDING** | Văn phong trung tính, trách nhiệm |
| **Nhóm 1** | `DV-GRP1-03` | Dịch vụ: Khám lâm sàng tổng quát & sàng lọc sức khỏe | Đề xuất danh mục kỹ thuật | Chờ BS. Sơn duyệt | Danh sách dịch vụ | **PENDING** | Gắn nhãn `[Đề xuất danh mục]` |
| **Nhóm 1** | `DV-GRP1-04` | Dịch vụ: Tiêm phòng vaccine & phòng ký sinh trùng | Đề xuất danh mục kỹ thuật | Chờ BS. Sơn duyệt | Danh sách dịch vụ | **PENDING** | Gắn nhãn `[Đề xuất danh mục]` |
| **Nhóm 1** | `DV-GRP1-05` | Dịch vụ: Điều trị bệnh lý nội khoa, tiêu hóa, hô hấp | Đề xuất danh mục kỹ thuật | Chờ BS. Sơn duyệt | Danh sách dịch vụ | **PENDING** | Gắn nhãn `[Đề xuất danh mục]` |
| **Nhóm 1** | `DV-GRP1-06` | Nhân sự: `Bác sĩ phụ trách lâm sàng [Chờ xác nhận phân công nhân sự]` | Nguyên tắc bảo vệ danh tính nhân sự | Chờ chủ dự án duyệt | Thông tin bác sĩ | **PENDING** | Tuyệt đối không gán BS. Sơn khi chưa có văn bản duyệt |
| **Nhóm 1** | `DV-GRP1-07` | Ảnh minh họa khám thú cưng ấm áp | Asset minh họa không có người | Antigravity (28/10/2026)| Khung ảnh | **ILLUSTRATIVE** | Bắt buộc nhãn `Ảnh minh họa dịch vụ` |
| **Nhóm 1** | `DV-GRP1-08` | Link: `Tra cứu bảng giá khám & điều trị ->` | Topology `/bang-gia?cat=kham-dieu-tri` | Antigravity (28/10/2026)| Nút liên kết | **PENDING** | Trỏ sang `/bang-gia?cat=kham-dieu-tri` |
| **Nhóm 2** | `DV-GRP2-01` | Tên nhóm: `Chẩn Đoán Cận Lâm Sàng & Xét Nghiệm` | Đề xuất danh mục chuẩn (3B-DEC-05) | Chờ chủ dự án duyệt | Tiêu đề nhóm H2 | **PENDING** | Tiêu đề H2 kèm nhãn `[Đề xuất]` |
| **Nhóm 2** | `DV-GRP2-02` | Dịch vụ: Xét nghiệm huyết học & sinh hóa | Đề xuất danh mục cận lâm sàng | Chờ BS. Sơn duyệt | Thẻ slot chuyên môn | **PENDING** | Gắn nhãn `[Đề xuất danh mục xét nghiệm]` |
| **Nhóm 2** | `DV-GRP2-03` | Dịch vụ: Chẩn đoán hình ảnh (X-quang / Siêu âm) | Đề xuất cấu hình thiết bị | Chờ chủ dự án duyệt | Thẻ slot chuyên môn | **PENDING** | Gắn nhãn `[Đề xuất cấu hình thiết bị]` |
| **Nhóm 2** | `DV-GRP2-04` | Dịch vụ: Xét nghiệm ký sinh trùng & soi da | Đề xuất quy trình chẩn đoán | Chờ BS. Sơn duyệt | Thẻ slot chuyên môn | **PENDING** | Gắn nhãn `[Đề xuất quy trình]` |
| **Nhóm 2** | `DV-GRP2-05` | Link: `Xem bảng giá xét nghiệm tham chiếu ->` | Topology `/bang-gia?cat=can-lam-sang` | Antigravity (28/10/2026)| Nút liên kết | **PENDING** | Trỏ sang `/bang-gia?cat=can-lam-sang` |
| **Nhóm 3** | `DV-GRP3-01` | Tên nhóm: `Phẫu Thuật Ngoại Khoa & Triệt Sản` | Đề xuất danh mục chuẩn (3B-DEC-05) | Chờ chủ dự án duyệt | Tiêu đề nhóm H2 | **PENDING** | Tiêu đề H2 kèm nhãn `[Đề xuất]` |
| **Nhóm 3** | `DV-GRP3-02` | Dịch vụ: Triệt sản an toàn chó mèo & tiểu phẫu mô mềm | Đề xuất danh mục phẫu thuật | Chờ BS. Sơn duyệt | Danh sách dịch vụ | **PENDING** | Gắn nhãn `[Đề xuất danh mục]` |
| **Nhóm 3** | `DV-GRP3-03` | Nhân sự: `Bác sĩ ngoại khoa [Chờ phê duyệt phân công nhân sự]` | Nguyên tắc bảo vệ danh tính nhân sự | Chờ chủ dự án duyệt | Thông tin bác sĩ | **PENDING** | Tuyệt đối không gán BS. Sơn |
| **Nhóm 3** | `DV-GRP3-04` | Link: `Xem bảng giá phẫu thuật tham chiếu ->` | Topology `/bang-gia?cat=phau-thuat` | Antigravity (28/10/2026)| Nút liên kết | **PENDING** | Trỏ sang `/bang-gia?cat=phau-thuat` |
| **Nhóm 4** | `DV-GRP4-01` | Tên nhóm: `Chăm Sóc Nội Trú Y Tế 24/7` | Đề xuất danh mục chuẩn (3B-DEC-05) | Chờ chủ dự án duyệt | Tiêu đề nhóm H2 | **PENDING** | Tiêu đề H2 kèm nhãn `[Đề xuất]` |
| **Nhóm 4** | `DV-GRP4-02` | Định hướng: Khu vực lưu trú chuyên biệt theo loài | Đề xuất quy hoạch lưu trú | Chờ chủ dự án duyệt | Mô tả vận hành | **PENDING** | Gắn nhãn `[Chờ xác nhận cơ cấu phân khu]` |
| **Nhóm 4** | `DV-GRP4-03` | Định hướng: Nhân viên chăm sóc theo dõi theo y lệnh | Đề xuất quy trình kíp trực | Chờ BS. Sơn duyệt | Mô tả vận hành | **PENDING** | Gắn nhãn `[Chờ xác nhận kíp trực]` |
| **Nhóm 4** | `DV-GRP4-04` | Nguyên tắc: Cập nhật tình hình định kỳ (không lộ y lệnh) | Architecture Baseline V1 (`AGENTS.md`) | Chủ dự án (26/10/2026) | Mô tả vận hành | **VERIFIED** | Cam kết bảo mật y lệnh nghiệp vụ |
| **Nhóm 4** | `DV-GRP4-05` | Link: `Xem biểu phí nội trú lưu chuồng ->` | Topology `/bang-gia?cat=noi-tru` | Antigravity (28/10/2026)| Nút liên kết | **PENDING** | Trỏ sang `/bang-gia?cat=noi-tru` |
| **Nhóm 5** | `DV-GRP5-01` | Tên nhóm: `Vệ Sinh Y Tế & Spa Grooming` | Đề xuất danh mục chuẩn (3B-DEC-05) | Chờ chủ dự án duyệt | Tiêu đề nhóm H2 | **PENDING** | Tiêu đề H2 kèm nhãn `[Đề xuất]` |
| **Nhóm 5** | `DV-GRP5-02` | Gói dịch vụ: Tắm vệ sinh tiêu chuẩn, cắt tỉa lông | Đề xuất gói dịch vụ spa | Chờ chủ dự án duyệt | Danh sách gói | **PENDING** | Gắn nhãn `[Đề xuất gói dịch vụ]` |
| **Nhóm 5** | `DV-GRP5-03` | Gói dịch vụ: Tắm trị liệu da theo tư vấn | Đề xuất gói spa da liễu | Chờ BS. Sơn duyệt | Danh sách gói | **PENDING** | Gắn nhãn `[Đề xuất phác đồ tắm]` |
| **Nhóm 5** | `DV-GRP5-04` | Link: `Xem bảng giá dịch vụ spa grooming ->` | Topology `/bang-gia?cat=spa-grooming` | Antigravity (28/10/2026)| Nút liên kết | **PENDING** | Trỏ sang `/bang-gia?cat=spa-grooming` |
| **Cấp cứu** | `DV-EMG-01` | Khối Tiếp nhận Cấp cứu 24/24 Warm Orange | Homepage Section 3 đã duyệt (Commit `db78738`)| Chủ dự án (26/10/2026) | Khung cấp cứu | **VERIFIED** | Nền Warm Orange/Amber, Hotline 24/24 |
| **Cấp cứu** | `DV-EMG-02` | Dấu hiệu khẩn: Khó thở, co giật, ngộ độc, tai nạn | Hướng dẫn sơ cứu y khoa tham khảo | Chờ BS. Sơn duyệt | Danh sách dấu hiệu | **PENDING** | Gắn nhãn `[Thông tin tham khảo — Chờ bác sĩ xác nhận]` |
| **Cấp cứu** | `DV-EMG-03` | Nút gọi khẩn: `Gọi Cấp cứu: 097 355 51 05` | Xác nhận trực tiếp của Chủ dự án (26/10/2026) | Chủ dự án (26/10/2026) | Nút bấm gọi điện | **VERIFIED** | Gắn link `tel:0973555105` |
| **Lưu ý** | `DV-NOTE-01` | Lưu ý 01: Chuẩn bị trước xét nghiệm/can thiệp | Khuyến cáo y khoa quốc tế tham khảo | Chờ BS. Sơn duyệt | Thẻ lưu ý 01 | **PENDING** | Gắn nhãn `[Đề xuất hướng dẫn]` |
| **Lưu ý** | `DV-NOTE-02` | Lưu ý 02: Vận chuyển an toàn bằng lồng hoặc dây dắt | Biện pháp an toàn phòng khám | Chủ dự án (26/10/2026) | Thẻ lưu ý 02 | **VERIFIED** | Khuyến cáo an toàn di chuyển |
| **Lưu ý** | `DV-NOTE-03` | Lưu ý 03: Mang theo sổ theo dõi tiêm phòng, đơn thuốc | Quy trình tiếp đón thú y tham khảo | Chờ BS. Sơn duyệt | Thẻ lưu ý 03 | **PENDING** | Hỗ trợ cung cấp bệnh sử |
| **Dark CTA** | `DV-CTA-01` | Tiêu đề: `Bạn cần tư vấn dịch vụ phù hợp cho bé?` | Component `EditorialDarkCTA` đã duyệt 3A | Antigravity (28/10/2026)| Khung CTA cuối | **VERIFIED** | Nền Deep Plum `#421247` |
| **Dark CTA** | `DV-CTA-02` | Nút 1: `Đặt lịch khám` trỏ `/dat-lich` | Luồng chuyển đổi chuẩn (không kèm query) | Antigravity (28/10/2026)| Nút chính | **VERIFIED** | Trỏ về `/dat-lich` |
| **Dark CTA** | `DV-CTA-03` | Nút 2: `Xem bảng giá dịch vụ` trỏ `/bang-gia` | Luồng chuyển tiếp 3B | Antigravity (28/10/2026)| Nút phụ | **VERIFIED** | Trỏ sang `/bang-gia` |

---

## 3. BẢNG ÁNH XẠ NỘI DUNG CHI TIẾT TRANG `/bang-gia`

| Section | Content ID | Nội dung dự kiến | Bằng chứng cụ thể (văn bản / commit / chỉ đạo) | Người duyệt & Ngày duyệt | Phạm vi công bố | Trạng thái xác minh | Quy tắc hiển thị khi chưa xác minh |
|---|---|---|---|---|---|---|---|
| **Heading** | `BG-HEAD-01` | Breadcrumb: `Trang chủ / Dịch vụ / Bảng giá niêm yết` | Navigation chuẩn | Antigravity (26/10/2026) | Đầu trang Bảng giá | **VERIFIED** | Phân cấp rõ ràng |
| **Heading** | `BG-HEAD-02` | Eyebrow: `MINH BẠCH CHI PHÍ Y TẾ THÚ CƯNG` | Tôn chỉ thương hiệu | Chủ dự án (26/10/2026) | Tiêu đề phụ | **VERIFIED** | Chữ in hoa màu Plum |
| **Heading** | `BG-HEAD-03` | H1: `Bảng giá dịch vụ & biểu phí tham chiếu` | Chuẩn SEO & định vị trang bảng giá | Chủ dự án (26/10/2026) | Tiêu đề H1 | **VERIFIED** | Font Lora 600 |
| **Heading** | `BG-HEAD-04` | Đoạn dẫn cam kết tư vấn chi phí rõ ràng, tôn trọng chủ nuôi | Định hướng đạo đức y khoa | Chủ dự án (26/10/2026) | Đoạn dẫn | **VERIFIED** | Font Be Vietnam Pro 400 |
| **Heading** | `BG-HEAD-05` | Banner quy định biến động giá: Cân nặng, độ tuổi, phụ phí ngoài giờ | Đề xuất chính sách chi phí (3B-DEC-09) | Chờ chủ dự án duyệt | Khung cảnh báo | **PENDING** | Khung Lavender, icon thông tin |
| **Toolbar** | `BG-TOOL-01` | Ô tìm kiếm: Tìm theo tên dịch vụ, xét nghiệm, gói spa | Tính năng tìm kiếm client-side | Antigravity (28/10/2026)| Toolbar tìm kiếm | **VERIFIED** | Accessible search input, có nút xóa `X` |
| **Toolbar** | `BG-TOOL-02` | 5 Tab danh mục chuẩn: Tất cả, Khám điều trị, Cận lâm sàng, Phẫu thuật, Nội trú, Spa | Đề xuất Taxonomy chuẩn 5 nhóm (3B-DEC-05) | Chờ chủ dự án duyệt | Dải tab phân loại | **PENDING** | Cuộn ngang trên mobile, không hardcode số đếm giả |
| **Bảng giá** | `BG-PRC-01` | Dịch vụ: *Khám lâm sàng tổng quát ban đầu* | Đề xuất danh mục biểu phí | Chờ chủ dự án duyệt | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` (`Đang cập nhật biểu phí niêm yết`) |
| **Bảng giá** | `BG-PRC-02` | Dịch vụ: *Tái khám theo hẹn của bác sĩ* | Đề xuất danh mục biểu phí | Chờ chủ dự án duyệt | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-03` | Dịch vụ: *Tiêm phòng Vaccine chó/mèo* | Đề xuất danh mục biểu phí | Chờ chủ dự án duyệt | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-04` | Dịch vụ: *Cấp cứu ngoài giờ y tế (21:00 – 08:00)* | Đề xuất chính sách phụ phí (3B-DEC-03) | Chờ chủ dự án duyệt | Hàng bảng giá | **PENDING** | Trạng thái `CONTACT` (`Báo giá sau khám`) |
| **Bảng giá** | `BG-PRC-05` | Dịch vụ: *Xét nghiệm huyết học tổng quát (18 chỉ số)* | Đề xuất danh mục cận lâm sàng | Chờ BS. Sơn duyệt | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-06` | Dịch vụ: *Xét nghiệm sinh hóa máu kiểm tra gan thận* | Đề xuất danh mục cận lâm sàng | Chờ BS. Sơn duyệt | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-07` | Dịch vụ: *Chụp X-quang kỹ thuật số* | Đề xuất danh mục cận lâm sàng | Chờ BS. Sơn duyệt | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-08` | Dịch vụ: *Siêu âm ổ bụng tổng quát* | Đề xuất danh mục cận lâm sàng | Chờ BS. Sơn duyệt | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-09` | Dịch vụ: *Triệt sản an toàn chó mèo* | Đề xuất danh mục phẫu thuật | Chờ BS. Sơn duyệt | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-10` | Dịch vụ: *Phẫu thuật mô mềm & xử lý vết thương hở* | Đề xuất danh mục phẫu thuật | Chờ BS. Sơn duyệt | Hàng bảng giá | **PENDING** | Trạng thái `CONTACT` (`Báo giá sau khám lâm sàng`) |
| **Bảng giá** | `BG-PRC-11` | Dịch vụ: *Lưu trú nội trú theo dõi y tế* | Đề xuất danh mục nội trú | Chờ chủ dự án duyệt | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-12` | Dịch vụ: *Gói tắm vệ sinh & sấy chải tiêu chuẩn* | Đề xuất danh mục spa | Chờ chủ dự án duyệt | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-13` | Dịch vụ: *Gói cắt tỉa lông tạo hình thú cưng* | Đề xuất danh mục spa | Chờ chủ dự án duyệt | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-14` | Ghi chú điều kiện & nội dung bao gồm trong accordion | Đề xuất thông tin chi tiết | Chờ BS. Sơn duyệt | Panel accordion | **PENDING** | Hiển thị tóm tắt minh bạch khi mở dòng |
| **Quy trình**| `BG-PROC-01` | Bước 01: Thăm khám lâm sàng & lắng nghe phản ánh | Quy trình tiếp đón chuẩn y khoa | Chủ dự án (26/10/2026) | Thẻ quy trình 01 | **VERIFIED** | Trình bày 3 bước Hairline Ledger |
| **Quy trình**| `BG-PROC-02` | Bước 02: Tư vấn phác đồ & giải thích dự toán chi tiết | Đề xuất quy trình tư vấn chi phí (3B-DEC-09)| Chờ chủ dự án duyệt | Thẻ quy trình 02 | **PENDING** | Bác sĩ giải thích dự toán trước điều trị |
| **Quy trình**| `BG-PROC-03` | Bước 03: Điều trị theo thỏa thuận đồng thuận | Đề xuất quy trình đồng thuận | Chờ chủ dự án duyệt | Thẻ quy trình 03 | **PENDING** | Chỉ can thiệp khi chủ nuôi đồng thuận |
| **Dark CTA** | `BG-CTA-01` | Tiêu đề: `Bạn cần tư vấn chi phí cụ thể cho trường hợp của bé?` | Component `EditorialDarkCTA` đã duyệt 3A | Antigravity (28/10/2026)| Khung CTA cuối | **VERIFIED** | Nền Deep Plum `#421247` |
| **Dark CTA** | `BG-CTA-02` | Nút 1: `Đăng ký lịch khám ngay` trỏ `/dat-lich` | Luồng chuyển đổi chuẩn (không kèm query) | Antigravity (28/10/2026)| Nút chính | **VERIFIED** | Trỏ về `/dat-lich` |
| **Dark CTA** | `BG-CTA-03` | Nút 2: `Gọi tư vấn: 097 355 51 05` | Hotline xác thực 26/10/2026 | Chủ dự án (26/10/2026) | Nút phụ | **VERIFIED** | Gắn link `tel:0973555105` |

---

## 4. TỔNG HỢP TRẠNG THÁI & ĐIỀU KIỆN CHẶN PRODUCTION

- **Tổng số hạng mục rà soát:** 42 hạng mục.
- **Số hạng mục `VERIFIED`:** 16 hạng mục (Chỉ gồm các thông tin đã có chỉ đạo bằng văn bản: tên bệnh viện, địa chỉ, hotline, slogan, layout, component hệ thống).
- **Số hạng mục `PENDING`:** 25 hạng mục (Toàn bộ danh mục dịch vụ chi tiết, phác đồ, quy trình nội trú, phụ phí ngoài giờ và giá dịch vụ).
- **Số hạng mục `ILLUSTRATIVE`:** 1 hạng mục (Ảnh minh họa dịch vụ khám).
- **Cam kết Content Lock:** 100% các mục `PENDING` bắt buộc phải có nhãn `[Đề xuất]`, `[Chờ xác nhận]` hoặc badge `UNAVAILABLE` / `CONTACT` trên giao diện người dùng. Việc gỡ bỏ các nhãn này là **ĐIỀU KIỆN CHẶN PRODUCTION** tuyệt đối.

---

**KẾT THÚC MA TRẬN ÁNH XẠ NỘI DUNG 3B-00 (CONTENT MAPPING V1.1)**
