# MA TRẬN ÁNH XẠ NỘI DUNG GIAI ĐOẠN 3B — PHIÊN BẢN V1.2 (PHASE 3B-00 CONTENT MAPPING)
## Bệnh viện Thú y Lê Sơn 2026 — Kiểm Soát Tính Toàn Vẹn & Khóa Nội Dung (Content Lock)

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 042-A**, **CEO DIRECTIVE 044-A (Section III, V, VI, VII)**; Báo cáo Claude QA `docs/qa/3b-00-fix01-qa.md` (Commit: `b9f386b`); Quy chế `docs/phase-3b/3b-00-content-evidence-gate.md` |
| **Giai đoạn** | **3B-00: DOCUMENTATION ONLY — KHÔNG CODE** |
| **Phạm vi ánh xạ** | Tuyến trang `/dich-vu` và Tuyến trang `/bang-gia` |
| **Trạng thái tài liệu** | **CHỜ CHỦ DỰ ÁN PHÊ DUYỆT (PENDING OWNER APPROVAL)** |

---

## 1. NGUYÊN TẮC ÁP DỤNG CONTENT EVIDENCE GATE & QUYẾT ĐỊNH DEC-12 / DEC-13

1. **Tuân thủ DEC-12 (Quyền duyệt Hero & Heading):** Toàn bộ câu chữ Eyebrow, H1, đoạn dẫn Hero và cam kết chi phí trên `/dich-vu` và `/bang-gia` bắt buộc phải do Chủ dự án ký duyệt bằng văn bản trước khi công bố. Khi chưa có văn bản duyệt cụ thể, 100% các mục này mang trạng thái **`PENDING`**.
2. **Tuân thủ DEC-13 (Phân quyền thẩm quyền xác minh & phê duyệt):**
   - Chỉ Chủ dự án có thẩm quyền phê duyệt thương hiệu, danh mục, giá và quyết định công bố (`approvedBy`).
   - Bác sĩ chuyên môn được chỉ định xác minh tính chuẩn xác y khoa (`verifiedBy`).
   - **Tuyệt đối cấm các AI (Antigravity, Claude, ChatGPT CEO) đứng tên làm người duyệt trong bảng dữ liệu.**
   - Mọi mục chưa có văn bản phê duyệt thực tế thì các trường người duyệt và ngày duyệt phải để trống (`—`).
3. **Quy tắc bảo vệ giá (Price Lock):** 100% dịch vụ chưa có biểu phí ký duyệt mang trạng thái `UNAVAILABLE` (`Đang cập nhật biểu phí niêm yết`) hoặc `CONTACT` (`Báo giá sau khám lâm sàng`). Tuyệt đối không dùng giá giả hoặc `0 VNĐ`.

---

## 2. BẢNG ÁNH XẠ NỘI DUNG CHI TIẾT TRANG `/dich-vu` (41 HẠNG MỤC)

| Section | Content ID | Nội dung dự kiến | Bằng chứng cụ thể (văn bản / commit / chỉ đạo) | Người duyệt | Ngày duyệt (YYYY-MM-DD) | Phạm vi công bố | Trạng thái xác minh | Quy tắc hiển thị khi chưa xác minh |
|---|---|---|---|---|---|---|---|---|
| **Hero** | `DV-HERO-01` | Breadcrumb: `Trang chủ / Dịch vụ` | Đề xuất cấu trúc navigation 3B | — | — | Toàn trang Public | **PENDING** | Thể hiện link Trang chủ và text Dịch vụ |
| **Hero** | `DV-HERO-02` | Eyebrow: `HỆ THỐNG DỊCH VỤ Y TẾ THÚ CƯNG LÊ SƠN` | Đề xuất tiêu đề phụ thương hiệu (3B-DEC-12) | — | — | Đầu trang Dịch vụ | **PENDING** | Chờ Chủ dự án duyệt câu chữ theo DEC-12 |
| **Hero** | `DV-HERO-03` | H1: `Chăm sóc chu toàn từ phòng khám đến khu nội trú` | Đề xuất Slogan định vị thương hiệu (3B-DEC-12) | — | — | Tiêu đề chính H1 | **PENDING** | Chờ Chủ dự án duyệt câu chữ theo DEC-12 |
| **Hero** | `DV-HERO-04` | Đoạn dẫn giới thiệu tinh thần cẩn trọng, chu đáo | Đề xuất văn phong giới thiệu (3B-DEC-12) | — | — | Đoạn dẫn Hero | **PENDING** | Chờ Chủ dự án duyệt câu chữ theo DEC-12 |
| **Hero** | `DV-HERO-05` | Editorial Policy Banner: Thông báo danh mục chuẩn hóa 3B | Chỉ đạo bắt buộc tại CEO Directive 042-A / 044-A | Chủ dự án | 2026-10-28 | Khung thông báo | **VERIFIED** | Khung viền mỏng, biểu tượng thông tin |
| **Jump Bar** | `DV-NAV-01` | 6 tab neo nhanh: `#kham-dieu-tri`, `#can-lam-sang`... | Đề xuất Taxonomy chuẩn 5 nhóm (3B-DEC-05) | — | — | Thanh điều hướng | **PENDING** | Dải pill dính, cuộn mượt |
| **Nhóm 1** | `DV-GRP1-01` | Tên nhóm 01: `Khám & Điều Trị Lâm Sàng` | Đề xuất danh mục chuẩn (3B-DEC-05) | — | — | Tiêu đề nhóm H2 | **PENDING** | Tiêu đề H2 kèm nhãn `[Đề xuất]` |
| **Nhóm 1** | `DV-GRP1-02` | Mô tả quy trình thăm khám cẩn trọng, đo sinh hiệu | Đề xuất quy trình lâm sàng | — | — | Đoạn văn mô tả | **PENDING** | Văn phong trung tính, trách nhiệm |
| **Nhóm 1** | `DV-GRP1-03` | Dịch vụ: Khám lâm sàng tổng quát & sàng lọc sức khỏe | Đề xuất danh mục kỹ thuật (3B-DEC-04) | — | — | Danh sách dịch vụ | **PENDING** | Gắn nhãn `[Đề xuất danh mục]` |
| **Nhóm 1** | `DV-GRP1-04` | Dịch vụ: Tiêm phòng vaccine & phòng ký sinh trùng | Đề xuất danh mục kỹ thuật (3B-DEC-04) | — | — | Danh sách dịch vụ | **PENDING** | Gắn nhãn `[Đề xuất danh mục]` |
| **Nhóm 1** | `DV-GRP1-05` | Dịch vụ: Điều trị bệnh lý nội khoa, tiêu hóa, hô hấp | Đề xuất danh mục kỹ thuật (3B-DEC-04) | — | — | Danh sách dịch vụ | **PENDING** | Gắn nhãn `[Đề xuất danh mục]` |
| **Nhóm 1** | `DV-GRP1-06` | Nhân sự: `Bác sĩ phụ trách lâm sàng [Chờ xác nhận]` | Nguyên tắc bảo vệ danh tính nhân sự (3B-DEC-06) | — | — | Thông tin bác sĩ | **PENDING** | Tuyệt đối không gán tên khi chưa có duyệt |
| **Nhóm 1** | `DV-GRP1-07` | Ảnh minh họa khám thú cưng ấm áp | Asset minh họa không có người | — | — | Khung ảnh | **ILLUSTRATIVE** | Bắt buộc nhãn `Ảnh minh họa dịch vụ` |
| **Nhóm 1** | `DV-GRP1-08` | Link: `Tra cứu bảng giá khám & điều trị ->` | Đề xuất điều hướng sang bảng giá | — | — | Nút liên kết | **PENDING** | Trỏ sang `/bang-gia?cat=kham-dieu-tri` |
| **Nhóm 2** | `DV-GRP2-01` | Tên nhóm 02: `Chẩn Đoán Cận Lâm Sàng & Xét Nghiệm` | Đề xuất danh mục chuẩn (3B-DEC-05) | — | — | Tiêu đề nhóm H2 | **PENDING** | Tiêu đề H2 kèm nhãn `[Đề xuất]` |
| **Nhóm 2** | `DV-GRP2-02` | Dịch vụ: Xét nghiệm huyết học & sinh hóa | Đề xuất danh mục cận lâm sàng (3B-DEC-04) | — | — | Thẻ slot chuyên môn | **PENDING** | Gắn nhãn `[Đề xuất danh mục xét nghiệm]` |
| **Nhóm 2** | `DV-GRP2-03` | Dịch vụ: Chẩn đoán hình ảnh (X-quang / Siêu âm) | Đề xuất cấu hình thiết bị (3B-DEC-07) | — | — | Thẻ slot chuyên môn | **PENDING** | Gắn nhãn `[Đề xuất cấu hình thiết bị]` |
| **Nhóm 2** | `DV-GRP2-04` | Dịch vụ: Xét nghiệm ký sinh trùng & soi da | Đề xuất quy trình chẩn đoán (3B-DEC-04) | — | — | Thẻ slot chuyên môn | **PENDING** | Gắn nhãn `[Đề xuất quy trình]` |
| **Nhóm 2** | `DV-GRP2-05` | Link: `Xem bảng giá xét nghiệm tham chiếu ->` | Đề xuất điều hướng sang bảng giá | — | — | Nút liên kết | **PENDING** | Trỏ sang `/bang-gia?cat=can-lam-sang` |
| **Nhóm 3** | `DV-GRP3-01` | Tên nhóm 03: `Phẫu Thuật Ngoại Khoa & Triệt Sản` | Đề xuất danh mục chuẩn (3B-DEC-05) | — | — | Tiêu đề nhóm H2 | **PENDING** | Tiêu đề H2 kèm nhãn `[Đề xuất]` |
| **Nhóm 3** | `DV-GRP3-02` | Dịch vụ: Triệt sản an toàn chó mèo & tiểu phẫu mô mềm | Đề xuất danh mục phẫu thuật (3B-DEC-04) | — | — | Danh sách dịch vụ | **PENDING** | Gắn nhãn `[Đề xuất danh mục]` |
| **Nhóm 3** | `DV-GRP3-03` | Nhân sự: `Bác sĩ ngoại khoa [Chờ phê duyệt]` | Nguyên tắc bảo vệ danh tính nhân sự (3B-DEC-06) | — | — | Thông tin bác sĩ | **PENDING** | Tuyệt đối không gán tên bác sĩ |
| **Nhóm 3** | `DV-GRP3-04` | Link: `Xem bảng giá phẫu thuật tham chiếu ->` | Đề xuất điều hướng sang bảng giá | — | — | Nút liên kết | **PENDING** | Trỏ sang `/bang-gia?cat=phau-thuat` |
| **Nhóm 4** | `DV-GRP4-01` | Tên nhóm 04: `Chăm Sóc Nội Trú Y Tế 24/7` | Đề xuất danh mục chuẩn (3B-DEC-05) | — | — | Tiêu đề nhóm H2 | **PENDING** | Tiêu đề H2 kèm nhãn `[Đề xuất]` |
| **Nhóm 4** | `DV-GRP4-02` | Định hướng: Khu vực lưu trú chuyên biệt theo loài | Đề xuất quy hoạch lưu trú (3B-DEC-07) | — | — | Mô tả vận hành | **PENDING** | Gắn nhãn `[Chờ xác nhận cơ cấu phân khu]` |
| **Nhóm 4** | `DV-GRP4-03` | Định hướng: Nhân viên chăm sóc theo dõi theo y lệnh | Đề xuất phương án nhân sự theo dõi (3B-DEC-07)| — | — | Mô tả vận hành | **PENDING** | Gắn nhãn `[Chờ xác nhận nhân sự theo dõi]` |
| **Nhóm 4** | `DV-GRP4-04` | Nguyên tắc: Cập nhật tình hình định kỳ (không lộ y lệnh) | Đề xuất chính sách bảo mật thông tin nội trú | — | — | Mô tả vận hành | **PENDING** | Chờ Chủ dự án duyệt chính sách công bố |
| **Nhóm 4** | `DV-GRP4-05` | Link: `Xem biểu phí nội trú lưu chuồng ->` | Đề xuất điều hướng sang bảng giá | — | — | Nút liên kết | **PENDING** | Trỏ sang `/bang-gia?cat=noi-tru` |
| **Nhóm 5** | `DV-GRP5-01` | Tên nhóm 05: `Vệ Sinh Y Tế & Spa Grooming` | Đề xuất danh mục chuẩn (3B-DEC-05) | — | — | Tiêu đề nhóm H2 | **PENDING** | Tiêu đề H2 kèm nhãn `[Đề xuất]` |
| **Nhóm 5** | `DV-GRP5-02` | Gói dịch vụ: Tắm vệ sinh tiêu chuẩn, cắt tỉa lông | Đề xuất gói dịch vụ spa (3B-DEC-04, 3B-DEC-11)| — | — | Danh sách gói | **PENDING** | Gắn nhãn `[Đề xuất gói dịch vụ]` |
| **Nhóm 5** | `DV-GRP5-03` | Gói dịch vụ: Tắm trị liệu da theo tư vấn | Đề xuất gói spa da liễu (3B-DEC-04) | — | — | Danh sách gói | **PENDING** | Gắn nhãn `[Đề xuất phác đồ tắm]` |
| **Nhóm 5** | `DV-GRP5-04` | Link: `Xem bảng giá dịch vụ spa grooming ->` | Đề xuất điều hướng sang bảng giá | — | — | Nút liên kết | **PENDING** | Trỏ sang `/bang-gia?cat=spa-grooming` |
| **Cấp cứu** | `DV-EMG-01` | Khối Tiếp nhận Cấp cứu 24/24 Warm Orange | Homepage Section 3 đã duyệt (Commit `db78738`) | Chủ dự án | 2026-10-26 | Khung cấp cứu | **VERIFIED** | Nền Warm Orange/Amber, Hotline 24/24 |
| **Cấp cứu** | `DV-EMG-02` | Dấu hiệu khẩn: Khó thở, co giật, ngộ độc, tai nạn | Hướng dẫn sơ cứu y khoa tham khảo (3B-DEC-08) | — | — | Danh sách dấu hiệu | **PENDING** | Gắn nhãn `[Tham khảo — Chờ bác sĩ duyệt]` |
| **Cấp cứu** | `DV-EMG-03` | Nút gọi khẩn: `Gọi Cấp cứu: 097 355 51 05` | Xác nhận trực tiếp của Chủ dự án (Directive 017-A) | Chủ dự án | 2026-10-26 | Nút bấm gọi điện | **VERIFIED** | Gắn link `tel:0973555105` |
| **Lưu ý** | `DV-NOTE-01` | Lưu ý 01: Chuẩn bị trước xét nghiệm/can thiệp | Khuyến cáo y khoa quốc tế tham khảo (3B-DEC-08) | — | — | Thẻ lưu ý 01 | **PENDING** | Gắn nhãn `[Đề xuất hướng dẫn]` |
| **Lưu ý** | `DV-NOTE-02` | Lưu ý 02: Vận chuyển an toàn bằng lồng hoặc dây dắt | Đề xuất hướng dẫn an toàn phòng khám (3B-DEC-08)| — | — | Thẻ lưu ý 02 | **PENDING** | Chờ Bác sĩ / Chủ dự án duyệt |
| **Lưu ý** | `DV-NOTE-03` | Lưu ý 03: Mang theo sổ theo dõi tiêm phòng, đơn thuốc | Đề xuất tiếp nhận bệnh sử (3B-DEC-08) | — | — | Thẻ lưu ý 03 | **PENDING** | Gắn nhãn `[Đề xuất hướng dẫn]` |
| **Dark CTA** | `DV-CTA-01` | Tiêu đề: `Bạn cần tư vấn dịch vụ phù hợp cho bé?` | Đề xuất câu chữ CTA cuối trang (3B-DEC-12) | — | — | Khung CTA cuối | **PENDING** | Chờ Chủ dự án duyệt câu chữ |
| **Dark CTA** | `DV-CTA-02` | Nút 1: `Đặt lịch khám` trỏ `/dat-lich` | Luồng chuyển đổi chuẩn (không kèm query) | — | — | Nút chính | **PENDING** | Chờ duyệt luồng chuyển đổi |
| **Dark CTA** | `DV-CTA-03` | Nút 2: `Xem bảng giá dịch vụ` trỏ `/bang-gia` | Luồng chuyển tiếp 3B | — | — | Nút phụ | **PENDING** | Trỏ sang `/bang-gia` |

---

## 3. BẢNG ÁNH XẠ NỘI DUNG CHI TIẾT TRANG `/bang-gia` (27 HẠNG MỤC)

| Section | Content ID | Nội dung dự kiến | Bằng chứng cụ thể (văn bản / commit / chỉ đạo) | Người duyệt | Ngày duyệt (YYYY-MM-DD) | Phạm vi công bố | Trạng thái xác minh | Quy tắc hiển thị khi chưa xác minh |
|---|---|---|---|---|---|---|---|---|
| **Heading** | `BG-HEAD-01` | Breadcrumb: `Trang chủ / Dịch vụ / Bảng giá niêm yết` | Đề xuất cấu trúc navigation 3B | — | — | Đầu trang Bảng giá | **PENDING** | Thể hiện phân cấp rõ ràng |
| **Heading** | `BG-HEAD-02` | Eyebrow: `MINH BẠCH CHI PHÍ Y TẾ THÚ CƯNG` | Đề xuất tiêu đề phụ thương hiệu (3B-DEC-12) | — | — | Tiêu đề phụ | **PENDING** | Chờ Chủ dự án duyệt câu chữ theo DEC-12 |
| **Heading** | `BG-HEAD-03` | H1: `Bảng giá dịch vụ & biểu phí tham chiếu` | Đề xuất tiêu đề H1 bảng giá (3B-DEC-12) | — | — | Tiêu đề H1 | **PENDING** | Chờ Chủ dự án duyệt câu chữ theo DEC-12 |
| **Heading** | `BG-HEAD-04` | Đoạn dẫn cam kết tư vấn chi phí rõ ràng, tôn trọng chủ nuôi | Đề xuất định hướng tư vấn chi phí (3B-DEC-09/12)| — | — | Đoạn dẫn | **PENDING** | Chờ Chủ dự án duyệt cam kết theo DEC-09 |
| **Heading** | `BG-HEAD-05` | Banner quy định biến động giá: Cân nặng, độ tuổi... | Đề xuất chính sách chi phí (3B-DEC-03, 3B-DEC-09)| — | — | Khung cảnh báo | **PENDING** | Khung Lavender, icon thông tin |
| **Toolbar** | `BG-TOOL-01` | Ô tìm kiếm: Tìm theo tên dịch vụ, xét nghiệm, gói spa | Đề xuất tính năng tìm kiếm client-side | — | — | Toolbar tìm kiếm | **PENDING** | Accessible search input, có nút xóa `X` |
| **Toolbar** | `BG-TOOL-02` | 5 Tab danh mục chuẩn: Tất cả, Khám, Cận lâm sàng... | Đề xuất Taxonomy chuẩn 5 nhóm (3B-DEC-05) | — | — | Dải tab phân loại | **PENDING** | Cuộn ngang trên mobile, không số đếm giả |
| **Bảng giá** | `BG-PRC-01` | Dịch vụ: *Khám lâm sàng tổng quát ban đầu* | Đề xuất danh mục biểu phí (3B-DEC-01) | — | — | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-02` | Dịch vụ: *Tái khám theo hẹn của bác sĩ* | Đề xuất danh mục biểu phí (3B-DEC-01) | — | — | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-03` | Dịch vụ: *Tiêm phòng Vaccine chó/mèo* | Đề xuất danh mục biểu phí (3B-DEC-01) | — | — | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-04` | Dịch vụ: *Cấp cứu ngoài giờ y tế (21:00 – 08:00)* | Đề xuất chính sách phụ phí (3B-DEC-03) | — | — | Hàng bảng giá | **PENDING** | Trạng thái `CONTACT` (`Báo giá sau khám`) |
| **Bảng giá** | `BG-PRC-05` | Dịch vụ: *Xét nghiệm huyết học tổng quát (18 chỉ số)* | Đề xuất danh mục cận lâm sàng (3B-DEC-01) | — | — | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-06` | Dịch vụ: *Xét nghiệm sinh hóa máu kiểm tra gan thận* | Đề xuất danh mục cận lâm sàng (3B-DEC-01) | — | — | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-07` | Dịch vụ: *Chụp X-quang kỹ thuật số* | Đề xuất danh mục cận lâm sàng (3B-DEC-01) | — | — | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-08` | Dịch vụ: *Siêu âm ổ bụng tổng quát* | Đề xuất danh mục cận lâm sàng (3B-DEC-01) | — | — | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-09` | Dịch vụ: *Triệt sản an toàn chó mèo* | Đề xuất danh mục phẫu thuật (3B-DEC-01) | — | — | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-10` | Dịch vụ: *Phẫu thuật mô mềm & xử lý vết thương hở* | Đề xuất danh mục phẫu thuật (3B-DEC-01) | — | — | Hàng bảng giá | **PENDING** | Trạng thái `CONTACT` (`Báo giá sau khám`) |
| **Bảng giá** | `BG-PRC-11` | Dịch vụ: *Lưu trú nội trú theo dõi y tế* | Đề xuất danh mục nội trú (3B-DEC-01, 3B-DEC-11)| — | — | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-12` | Dịch vụ: *Gói tắm vệ sinh & sấy chải tiêu chuẩn* | Đề xuất danh mục spa (3B-DEC-01, 3B-DEC-11) | — | — | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-13` | Dịch vụ: *Gói cắt tỉa lông tạo hình thú cưng* | Đề xuất danh mục spa (3B-DEC-01, 3B-DEC-11) | — | — | Hàng bảng giá | **PENDING** | Trạng thái `UNAVAILABLE` |
| **Bảng giá** | `BG-PRC-14` | Ghi chú điều kiện & nội dung bao gồm trong accordion | Đề xuất thông tin chi tiết dịch vụ | — | — | Panel accordion | **PENDING** | Hiển thị tóm tắt minh bạch khi mở dòng |
| **Quy trình**| `BG-PROC-01` | Bước 01: Thăm khám lâm sàng & đánh giá thể trạng | Đề xuất quy trình báo giá (3B-DEC-09) | — | — | Thẻ quy trình 01 | **PENDING** | Chờ Chủ dự án duyệt quy trình theo DEC-09 |
| **Quy trình**| `BG-PROC-02` | Bước 02: Tư vấn phác đồ & giải thích dự toán chi tiết | Đề xuất quy trình báo giá (3B-DEC-09) | — | — | Thẻ quy trình 02 | **PENDING** | Chờ Chủ dự án duyệt quy trình theo DEC-09 |
| **Quy trình**| `BG-PROC-03` | Bước 03: Điều trị theo thỏa thuận đồng thuận | Đề xuất quy trình báo giá (3B-DEC-09) | — | — | Thẻ quy trình 03 | **PENDING** | Chờ Chủ dự án duyệt quy trình theo DEC-09 |
| **Dark CTA** | `BG-CTA-01` | Tiêu đề: `Bạn cần tư vấn chi phí cụ thể cho trường hợp của bé?` | Đề xuất câu chữ CTA cuối trang (3B-DEC-12) | — | — | Khung CTA cuối | **PENDING** | Chờ Chủ dự án duyệt câu chữ |
| **Dark CTA** | `BG-CTA-02` | Nút 1: `Đăng ký lịch khám ngay` trỏ `/dat-lich` | Luồng chuyển đổi chuẩn (không kèm query) | — | — | Nút chính | **PENDING** | Chờ duyệt luồng chuyển đổi |
| **Dark CTA** | `BG-CTA-03` | Nút 2: `Gọi tư vấn: 097 355 51 05` | Xác nhận trực tiếp của Chủ dự án (Directive 017-A) | Chủ dự án | 2026-10-26 | Nút phụ | **VERIFIED** | Gắn link `tel:0973555105` |

---

## 4. BẢNG THỐNG KÊ CHÍNH XÁC & ĐIỀU KIỆN CHẶN PRODUCTION

### 4.1. Bảng số liệu thống kê thực tế (Đối chiếu 100% khớp bảng dữ liệu)
- **Tổng số hạng mục kiểm soát:** **68 hạng mục** (Trang `/dich-vu`: 41 hạng mục; Trang `/bang-gia`: 27 hạng mục).
- **Số hạng mục `VERIFIED`:** **4 hạng mục** (Chỉ gồm các thông tin đã có chỉ đạo bằng văn bản hoặc kế thừa từ Mốc 2B: `DV-HERO-05`, `DV-EMG-01`, `DV-EMG-03`, `BG-CTA-03`).
- **Số hạng mục `PENDING`:** **63 hạng mục** (Toàn bộ câu chữ Hero/Heading theo DEC-12, danh mục dịch vụ theo DEC-04/05, quy trình nội trú/thiết bị theo DEC-07, lời khuyên y khoa theo DEC-08, cam kết chi phí theo DEC-09 và biểu phí dịch vụ theo DEC-01).
- **Số hạng mục `ILLUSTRATIVE`:** **1 hạng mục** (`DV-GRP1-07` — Khung ảnh minh họa khám thú cưng).
- **Tổng cộng:** $4 + 63 + 1 = 68$ hạng mục (Chính xác 100%, không sai lệch).

### 4.2. Điều kiện chặn phát hành Production
- 100% các mục `PENDING` bắt buộc phải có nhãn `[Đề xuất]`, `[Chờ xác nhận]` hoặc badge `UNAVAILABLE` / `CONTACT` trên giao diện người dùng. Việc gỡ bỏ các nhãn này là **ĐIỀU KIỆN CHẶN PRODUCTION** tuyệt đối.

---

**KẾT THÚC MA TRẬN ÁNH XẠ NỘI DUNG 3B-00 (CONTENT MAPPING V1.2)**
