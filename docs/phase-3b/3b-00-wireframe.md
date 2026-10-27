# ĐẶC TẢ WIREFRAME & TƯƠNG TÁC GIAI ĐOẠN 3B — PHIÊN BẢN V1.1 (PHASE 3B-00 WIREFRAME SPECIFICATION)
## Bệnh viện Thú y Lê Sơn 2026 — Đặc Tả Bố Cục Đa Điểm Ảnh, Accordion & Công Cụ Tra Cứu

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 042-A (Section VIII, X, XIII)**; `docs/phase-3b/3b-00-content-evidence-gate.md`; Báo cáo Claude QA `docs/qa/3b-00-design-doc-qa.md` |
| **Bản chất tài liệu** | **WIREFRAME & INTERACTION SPECIFICATION ONLY** (Đặc tả thiết kế chi tiết — Không phải mã nguồn triển khai) |
| **Giai đoạn** | **3B-00: DOCUMENTATION ONLY — KHÔNG CODE / KHÔNG MOCKUP HTML** |
| **Phạm vi** | Hai trang: **`/dich-vu`** (Tổng hợp dịch vụ) và **`/bang-gia`** (Bảng giá niêm yết) |
| **Nguyên tắc bảo toàn** | **GIỮ NGUYÊN 100% ROOTLAYOUT HIỆN HỮU** (Header, Footer, MobileNav, MobileBottomBar không thay đổi mã nguồn trong 3B-00) |
| **Trạng thái tài liệu** | **CHỜ CHỦ DỰ ÁN PHÊ DUYỆT (PENDING OWNER APPROVAL)** |

---

## 1. NGUYÊN TẮC HỆ THỐNG LƯỚI & KHUNG NHÌN (RESPONSIVE GRID SYSTEM)

Hai trang Giai đoạn 3B tuân thủ tuyệt đối quy chuẩn responsive của Public Website:

| Điểm ngắt (Viewport) | Container Max-Width | Số cột lưới (Grid) | Lề biên (Padding) | Chiều cao Header | Quy chuẩn hiển thị |
|---|---|---|---|---|---|
| **320px** (Mobile cực nhỏ) | 100% (320px) | 1 cột đơn | 16px (`px-4`) | 73px (Cố định) | Single-column stack, nút CTA full-width, touch target $\ge 44\times 44\text{px}$. |
| **375px** (Mobile chuẩn) | 100% (375px) | 1 cột đơn | 16px (`px-4`) | 73px (Cố định) | Bố cục chuẩn mobile-first, tab lọc dạng pill cuộn ngang mượt mà. |
| **768px** (Tablet đứng) | 100% (768px) | 2 cột / Split 1:1 | 24px (`px-6`) | 81px (Mở rộng) | Lưới dịch vụ 2 cột, bảng giá accordion 1 cột rộng có phân tách rõ ràng. |
| **1024px** (Laptop / Tablet ngang)| 100% (1024px) | Split 7:5 / 3 cột | 32px (`px-8`) | 81px (Mở rộng) | Asymmetric Editorial Split, thanh tab danh mục nằm ngang hoàn chỉnh. |
| **1440px** (Desktop chuẩn) | Max 1280px (`max-w-7xl`) | 12 cột kiến trúc | 32px (`px-8`) | 81px (Mở rộng) | Chuẩn tỷ lệ Vibrant Editorial Luxury, lề thoáng đãng, phân cấp số liệu lớn. |
| **1920px** (Màn hình siêu rộng) | Max 1280px (`max-w-7xl`) | Căn giữa tuyệt đối | Auto margin | 81px (Mở rộng) | Nội dung được khóa giữa khung hình, nền Ivory mở rộng hai bên. |

---

## 2. WIREFRAME CHI TIẾT TRANG `/dich-vu`

### 2.1. Bản vẽ khung hình Desktop (1440px / 1024px)

```text
+--------------------------------------------------------------------------------------------------+
| HEADER PUBLIC: Logo Thú y Lê Sơn | Về Lê Sơn v | Dịch vụ v | Góc thú cưng v | [Đặt lịch khám]    |
+--------------------------------------------------------------------------------------------------+
| BREADCRUMB: Trang chủ / Dịch vụ                                                                  |
|                                                                                                  |
| [SECTION 1: EDITORIAL HERO]                                                                      |
| HỆ THỐNG DỊCH VỤ Y TẾ THÚ CƯNG LÊ SƠN                                                            |
| Chăm sóc chu toàn từ phòng khám đến khu nội trú (Lora 600, 48px)                                 |
|                                                                                                  |
| "Chúng tôi hiểu rằng mỗi lần thú cưng thăm khám là một lần người bạn đồng hành cần sự dịu dàng   |
|  và cẩn trọng cao nhất. Bệnh viện Thú y Lê Sơn xây dựng quy trình tiếp đón chu đáo..."           |
|                                                                                                  |
| +----------------------------------------------------------------------------------------------+ |
| | [i] THÔNG BÁO: Danh mục dịch vụ đang được chuẩn hóa theo định hướng Giai đoạn 3B. Chi tiết   | |
| |     phác đồ và chi phí cụ thể sẽ được bác sĩ trao đổi trực tiếp sau khi khám lâm sàng.       | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| [SECTION 2: QUICK CATEGORY JUMP BAR - STICKY TOP-[81PX] Ở DESKTOP]                              |
| [ Khám & Điều trị ] [ Cận lâm sàng & Xét nghiệm ] [ Phẫu thuật ] [ Nội trú 24/7 ] [ Spa ] [Cấp cứu]|
|--------------------------------------------------------------------------------------------------|
|                                                                                                  |
| [SECTION 3.1: NHÓM 01 — KHÁM & ĐIỀU TRỊ LÂM SÀNG] (#kham-dieu-tri) [Đề xuất]                     |
| +-------------------------------------------------------+ +------------------------------------+ |
| | NHÓM 01 — Y KHOA LÂM SÀNG [Đề xuất]                   | | KHUNG ẢNH MINH HỌA               | |
| | Thăm khám cẩn trọng, chẩn đoán đúng và điều trị chu   | | +--------------------------------+ | |
| | đáo                                                   | | |                                | | |
| | Quy trình kiểm tra các chỉ số sức khỏe cơ bản, lắng   | | |     [Ảnh thú cưng ấm áp]       | | |
| | nghe phản ánh từ chủ nuôi.                            | | |                                | | |
| | -- Danh mục dịch vụ dự kiến (PENDING): -------------  | | | Nhãn: Ảnh minh họa dịch vụ     | | |
| | * Khám lâm sàng tổng quát [Đề xuất danh mục]          | | +--------------------------------+ | |
| | * Tiêm phòng vaccine & phòng ký sinh trùng [Đề xuất]  | |                                    | |
| | * Điều trị bệnh lý nội khoa, tiêu hóa, hô hấp [Đề xuất| | Bác sĩ phụ trách lâm sàng:         | |
| |                                                       | | [Chờ xác nhận phân công nhân sự] | |
| | [ Tra cứu bảng giá khám & điều trị -> ]               | |                                    | |
| +-------------------------------------------------------+ +------------------------------------+ |
|                                                                                                  |
| [SECTION 3.2: NHÓM 02 — CHẨN ĐOÁN CẬN LÂM SÀNG & XÉT NGHIỆM] (#can-lam-sang) [Đề xuất]           |
| Hỗ trợ chẩn đoán nhanh chóng và chuẩn xác (Grid 3 thẻ)                                           |
| +-----------------------------+ +-----------------------------+ +------------------------------+ |
| | XÉT NGHIỆM HUYẾT HỌC & SH   | | CHẨN ĐOÁN HÌNH ẢNH          | | SOI KÍNH HIỂN VI DA          | |
| | [Đề xuất danh mục xét nghiệm| | [Đề xuất cấu hình thiết bị] | | [Đề xuất quy trình soi da]   | |
| | Hỗ trợ đánh giá các chỉ số  | | Tầm soát dị vật và đánh giá | | Hỗ trợ xác định nguyên nhân  | |
| | sức khỏe của thú cưng       | | ổ bụng, xương khớp          | | gây viêm da, nấm ngứa        | |
| | [Xem bảng giá xét nghiệm ->]| | [Xem bảng giá X-quang ->]   | | [Xem bảng giá soi da ->]     | |
| +-----------------------------+ +-----------------------------+ +------------------------------+ |
|                                                                                                  |
| [SECTION 3.3: NHÓM 03 — PHẪU THUẬT NGOẠI KHOA & TRIỆT SẢN] (#phau-thuat) [Đề xuất]               |
| +-------------------------------------------------------+ +------------------------------------+ |
| | Quy trình ngoại khoa cẩn trọng và chuẩn bị chu đáo    | | Bác sĩ ngoại khoa:                 | |
| | Tư vấn cặn kẽ về chỉ định, thời gian hồi tỉnh và      | | [Chờ phê duyệt phân công nhân sự]  | |
| | hướng dẫn chăm sóc vết thương tại nhà.                | |                                    | |
| | * Triệt sản an toàn chó mèo [Đề xuất danh mục]        | | -- Lưu ý y khoa: ----------------- | |
| | * Tiểu phẫu mô mềm & xử lý vết thương [Đề xuất]       | | Trao đổi trước với bác sĩ về tiền  | |
| | [ Xem bảng giá phẫu thuật tham chiếu -> ]             | | sử dị ứng và chuẩn bị nhịn ăn.     | |
| +-------------------------------------------------------+ +------------------------------------+ |
|                                                                                                  |
| [SECTION 3.4: NHÓM 04 — LƯU TRÚ Y TẾ NỘI TRÚ 24/7] (#noi-tru) [Đề xuất]                           |
| Không gian lưu trú yên tĩnh và chế độ theo dõi phù hợp (Lavender Container)                      |
| * Khu vực lưu trú chuyên biệt: [Chờ xác nhận cơ cấu phân khu]                                    |
| * Chế độ theo dõi: [Chờ xác nhận quy trình kíp trực nhân viên chăm sóc theo y lệnh]             |
| * Cập nhật tình hình: Thông báo tình trạng phục hồi cho chủ nuôi (không công khai y lệnh nội bộ) |
| [ Tra cứu biểu phí nội trú lưu chuồng -> ]                                                       |
|                                                                                                  |
| [SECTION 3.5: NHÓM 05 — VỆ SINH Y TẾ & SPA GROOMING] (#spa-grooming) [Đề xuất]                   |
| +-------------------------------------------------------+ +------------------------------------+ |
| | Vệ sinh êm ái, chăm sóc dịu nhẹ cho bé cưng           | | CÁC GÓI SPA ĐỀ XUẤT:               | |
| | Sử dụng các sản phẩm vệ sinh da lông phù hợp, thao    | | 1. Tắm vệ sinh tiêu chuẩn [Đề xuất]| |
| | tác nhẹ nhàng giúp thú cưng thoải mái.                | | 2. Cắt tỉa tạo hình [Đề xuất]      | |
| | [ Xem bảng giá dịch vụ spa grooming -> ]              | | 3. Tắm chăm sóc da [Đề xuất]       | |
| +-------------------------------------------------------+ +------------------------------------+ |
|                                                                                                  |
| [SECTION 4: TIẾP NHẬN CẤP CỨU KHẨN CẤP 24/24] (#cap-cuu) (Warm Orange Strip)                     |
| [!] CẤP CỨU THÚ CƯNG 24/24 TẠI 101 KHUẤT DUY TIẾN | HOTLINE: 097 355 51 05  [ GỌI CẤP CỨU NGAY ] |
|     Dấu hiệu khẩn cấp tham khảo: Khó thở, co giật, ngộ độc, tai nạn [Chờ bác sĩ xác nhận]        |
|                                                                                                  |
| [SECTION 5: HƯỚNG DẪN TRƯỚC KHI ĐƯA BÉ ĐẾN KHÁM] (Architectural Numbered Triptych - PENDING)     |
| +-----------------------------+ +-----------------------------+ +------------------------------+ |
| | 01. CHUẨN BỊ XÉT NGHIỆM     | | 02. VẬN CHUYỂN AN TOÀN      | | 03. CUNG CẤP BỆNH SỬ         | |
| | [Đề xuất hướng dẫn]         | Khuyến khích dùng lồng vận    | [Đề xuất hướng dẫn]            | |
| | Trao đổi trước với bác sĩ   | chuyển hoặc dây dắt an toàn để| Mang theo sổ theo dõi tiêm     | |
| | về việc chuẩn bị nhịn ăn    | bảo vệ thú cưng khi di chuyển | phòng hoặc đơn thuốc đang dùng | |
| +-----------------------------+ +-----------------------------+ +------------------------------+ |
|                                                                                                  |
| [SECTION 6: EDITORIAL DARK CTA] (Nền Deep Plum #421247)                                          |
| Bạn cần tư vấn dịch vụ phù hợp cho bé cưng?                                                      |
| [ ĐẶT LỊCH KHÁM ]            [ XEM BẢNG GIÁ DỊCH VỤ ]                                            |
+--------------------------------------------------------------------------------------------------+
| FOOTER PUBLIC: Địa chỉ 101 Khuất Duy Tiến | Hotline 097 355 51 05 | Bản quyền 2026 Lê Sơn        |
+--------------------------------------------------------------------------------------------------+
```

### 2.2. Bản vẽ khung hình Mobile (375px / 320px)

```text
+-----------------------------------+
| [=] Logo Lê Sơn       [Đặt lịch]  | (Header 73px cố định - Giữ nguyên component Mốc 2B)
+-----------------------------------+
| Trang chủ / Dịch vụ               |
|                                   |
| HỆ THỐNG DỊCH VỤ Y TẾ LÊ SƠN      |
| Chăm sóc chu toàn từ              |
| phòng khám đến nội trú            |
| (Lora 600, 28px)                  |
|                                   |
| [i] Thông báo chuẩn hóa danh mục  |
|                                   |
| [TAB NHẢY CUỘN NGANG - STICKY TOP-[73PX]]
| [Khám điều trị] [Cận lâm sàng] .. |
|-----------------------------------|
|                                   |
| [NHÓM 01: KHÁM & ĐIỀU TRỊ]        |
| Thăm khám cẩn trọng               |
|                                   |
| [Khung ảnh minh họa tỉ lệ 16:9]   |
|                                   |
| * Khám tổng quát [Đề xuất]        |
| * Tiêm phòng vaccine [Đề xuất]    |
| * Điều trị nội khoa [Đề xuất]     |
|                                   |
| Bác sĩ phụ trách:                 |
| [Chờ xác nhận phân công nhân sự]  |
|                                   |
| [ Tra cứu bảng giá khám -> ]      |
|-----------------------------------|
|                                   |
| [NHÓM 02: CẬN LÂM SÀNG & XN]      |
| * Thẻ 1: Xét nghiệm huyết học/SH  |
| * Thẻ 2: Chẩn đoán hình ảnh       |
| * Thẻ 3: Soi kính hiển vi da      |
| [ Xem bảng giá xét nghiệm -> ]    |
|-----------------------------------|
|                                   |
| [NHÓM 03: PHẪU THUẬT NGOẠI KHOA]  |
| Quy trình cẩn trọng, chuẩn bị kỹ  |
| * Triệt sản an toàn [Đề xuất]     |
| * Tiểu phẫu mô mềm [Đề xuất]      |
| [ Xem bảng giá phẫu thuật -> ]    |
|-----------------------------------|
|                                   |
| [NHÓM 04: NỘI TRÚ Y TẾ 24/7]      |
| (Khung Lavender bo tròn)          |
| * Phân khu: [Chờ xác nhận]        |
| * Kíp trực: [Chờ xác nhận]        |
| * Cập nhật định kỳ cho chủ nuôi   |
| [ Tra cứu biểu phí nội trú -> ]   |
|-----------------------------------|
|                                   |
| [NHÓM 05: SPA GROOMING]           |
| Vệ sinh êm ái, chăm sóc dịu nhẹ   |
| * Gói tắm vệ sinh [Đề xuất]       |
| * Cắt tỉa tạo hình [Đề xuất]      |
| [ Xem bảng giá spa grooming -> ]  |
|-----------------------------------|
|                                   |
| [CẤP CỨU KHẨN CẤP 24/24]          |
| Hotline: 097 355 51 05            |
| [ GỌI CẤP CỨU NGAY ] (Full-width) |
|-----------------------------------|
|                                   |
| [LƯU Ý TRƯỚC KHI ĐẾN KHÁM]        |
| 01. Chuẩn bị xét nghiệm [Đề xuất] |
| 02. Vận chuyển an toàn lồng/dây   |
| 03. Cung cấp sổ tiêm chủng        |
|-----------------------------------|
|                                   |
| [DARK CTA CHUYỂN TIẾP]            |
| Tư vấn dịch vụ phù hợp cho bé?    |
| [ ĐẶT LỊCH KHÁM ]                 |
| [ XEM BẢNG GIÁ DỊCH VỤ ]          |
+-----------------------------------+
| FOOTER PUBLIC (Giữ nguyên)        |
+-----------------------------------+
| [Cấp cứu 24/24] [Đặt lịch khám]   | (MobileBottomBar 56px - Giữ nguyên component)
+-----------------------------------+
```

---

## 3. WIREFRAME CHI TIẾT TRANG `/bang-gia`

### 3.1. Bản vẽ khung hình Desktop (1440px / 1024px)

```text
+--------------------------------------------------------------------------------------------------+
| HEADER PUBLIC: Logo Thú y Lê Sơn | Về Lê Sơn v | Dịch vụ v | Góc thú cưng v | [Đặt lịch khám]    |
+--------------------------------------------------------------------------------------------------+
| BREADCRUMB: Trang chủ / Dịch vụ / Bảng giá niêm yết                                              |
|                                                                                                  |
| [SECTION 1: PAGE HEADING & DISCLAIMER BANNER]                                                    |
| MINH BẠCH CHI PHÍ Y TẾ THÚ CƯNG                                                                  |
| Bảng giá dịch vụ & biểu phí tham chiếu (Lora 600, 48px)                                          |
| "Bệnh viện Thú y Lê Sơn hướng tới sự minh bạch và rõ ràng trong tư vấn chi phí..."               |
|                                                                                                  |
| +----------------------------------------------------------------------------------------------+ |
| | [i] NGUYÊN TẮC BIẾN ĐỘNG GIÁ Y KHOA [Đề xuất quy chế]:                                       | |
| |     1. Chi phí y tế có thể thay đổi tùy thuộc vào cân nặng, giống loài và diễn biến ca bệnh. | |
| |     2. Bác sĩ luôn trao đổi và giải thích dự toán chi phí trước khi can thiệp.               | |
| |     3. Chính sách phụ phí ngoài giờ y tế (nếu có) sẽ được thông báo cụ thể khi tiếp nhận.    | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| [SECTION 2: TOOLBAR TÌM KIẾM & PHÂN LOẠI] (h-12 cố định)                                         |
| +----------------------------------------------------------------------------------------------+ |
| | [Search Icon] Tìm tên dịch vụ, xét nghiệm, gói spa (ví dụ: siêu âm, triệt sản...)       [x]  | |
| +----------------------------------------------------------------------------------------------+ |
| [ (o) Tất cả ] [ Khám & Điều trị ] [ Cận lâm sàng ] [ Phẫu thuật ] [ Nội trú ] [ Spa & Grooming ]|
|                                                                                                  |
| [SECTION 3: BẢNG GIÁ ACCORDION CÓ CẤU TRÚC] (Container min-h-[400px])                            |
|                                                                                                  |
| == NHÓM: KHÁM & ĐIỀU TRỊ LÂM SÀNG [Đề xuất] ==================================================== |
| +----------------------------------------------------------------------------------------------+ |
| | [v] Khám lâm sàng tổng quát ban đầu                 | Đơn vị: Lần | [ Đang cập nhật biểu phí ] | |
| |----------------------------------------------------------------------------------------------| |
| |     Nội dung bao gồm: Đo thân nhiệt, nghe tim phổi, kiểm tra niêm mạc, kiểm tra cân nặng.   | |
| |     Lưu ý y khoa: Áp dụng cho lần khám đầu tiên hoặc khám định kỳ tổng quát.                 | |
| |     Thông báo: Biểu phí chính thức đang được phòng khám đối chiếu ban hành.                  | |
| |     [ Đặt lịch khám -> ]                                                                     | |
| +----------------------------------------------------------------------------------------------+ |
| | [>] Tái khám theo hẹn của bác sĩ                    | Đơn vị: Lần | [ Đang cập nhật biểu phí ] | |
| +----------------------------------------------------------------------------------------------+ |
| | [>] Cấp cứu ngoài giờ y tế (21:00 – 08:00)          | Đơn vị: Ca  | [ Báo giá sau khám ]       | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| == NHÓM: CHẨN ĐOÁN CẬN LÂM SÀNG & XÉT NGHIỆM [Đề xuất] ========================================= |
| +----------------------------------------------------------------------------------------------+ |
| | [>] Xét nghiệm huyết học tổng quát (18 chỉ số máu)  | Đơn vị: Mẫu | [ Đang cập nhật biểu phí ] | |
| +----------------------------------------------------------------------------------------------+ |
| | [>] Chụp X-quang kỹ thuật số                        | Đơn vị: Phim| [ Đang cập nhật biểu phí ] | |
| +----------------------------------------------------------------------------------------------+ |
| | [>] Siêu âm ổ bụng tổng quát tầm soát               | Đơn vị: Lần | [ Đang cập nhật biểu phí ] | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| == NHÓM: PHẪU THUẬT NGOẠI KHOA & TRIỆT SẢN [Đề xuất] =========================================== |
| +----------------------------------------------------------------------------------------------+ |
| | [>] Triệt sản an toàn chó mèo                       | Đơn vị: Ca  | [ Đang cập nhật biểu phí ] | |
| +----------------------------------------------------------------------------------------------+ |
| | [>] Phẫu thuật mô mềm & xử lý vết thương hở         | Đơn vị: Ca  | [ Báo giá sau khám ]       | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| [SECTION 4: QUY TRÌNH TIẾP NHẬN BÁO GIÁ MINH BẠCH 3 BƯỚC]                                        |
| +-----------------------------+ +-----------------------------+ +------------------------------+ |
| | BƯỚC 01: THĂM KHÁM LÂM SÀNG | | BƯỚC 02: DỰ TOÁN CHI TIẾT   | | BƯỚC 03: ĐỒNG THUẬN ĐIỀU TRỊ | |
| | Bác sĩ khám và đánh giá tình| | Giải thích rõ dự toán chi   | | Chỉ tiến hành can thiệp khi  | |
| | trạng thể chất thực tế      | | phí trước khi can thiệp     | | chủ nuôi đã hiểu và đồng thuận|
| +-----------------------------+ +-----------------------------+ +------------------------------+ |
|                                                                                                  |
| [SECTION 5: EDITORIAL DARK CTA]                                                                  |
| Bạn cần tư vấn chi phí cụ thể cho trường hợp của bé?                                             |
| [ ĐĂNG KÝ LỊCH KHÁM NGAY ]     [ GỌI TƯ VẤN: 097 355 51 05 ]                                     |
+--------------------------------------------------------------------------------------------------+
| FOOTER PUBLIC: 101 Khuất Duy Tiến | Hotline 097 355 51 05                                        |
+--------------------------------------------------------------------------------------------------+
```

### 3.2. Bản vẽ khung hình Mobile (375px / 320px)

```text
+-----------------------------------+
| [=] Logo Lê Sơn       [Đặt lịch]  | (Header 73px - Giữ nguyên)
+-----------------------------------+
| Trang chủ / Dịch vụ / Bảng giá    |
|                                   |
| BẢNG GIÁ DỊCH VỤ NIÊM YẾT         |
| Minh bạch chi phí y tế            |
| (Lora 600, 26px)                  |
|                                   |
| [i] Cảnh báo biến động giá y khoa |
|-----------------------------------|
|                                   |
| [Ô TÌM KIẾM NHANH DỊCH VỤ]        |
| [Q] Tìm tên dịch vụ...        [x] |
|                                   |
| [DẢI TAB DANH MỤC CUỘN NGANG]     |
| [Tất cả] [Khám] [Cận lâm sàng] .. |
|-----------------------------------|
|                                   |
| -- KHÁM & ĐIỀU TRỊ [Đề xuất] ---- |
| +-------------------------------+ |
| | Khám tổng quát ban đầu    [v] | | (Touch target row 56px)
| | Đơn vị: Lần                   | |
| | [ Đang cập nhật biểu phí ]    | |
| | - - - - - - - - - - - - - - - | |
| | Nội dung: Đo sinh hiệu cơ bản | |
| | Thông báo: Biểu phí đang cập  | |
| | nhật niêm yết chính thức.     | |
| | [ Đặt lịch khám -> ]          | |
| +-------------------------------+ |
| +-------------------------------+ |
| | Tái khám theo hẹn         [>] | |
| | Đơn vị: Lần                   | |
| | [ Đang cập nhật biểu phí ]    | |
| +-------------------------------+ |
| +-------------------------------+ |
| | Cấp cứu ngoài giờ y tế    [>] | |
| | Đơn vị: Ca                    | |
| | [ Báo giá sau khám ]          | |
| +-------------------------------+ |
|                                   |
| -- CẬN LÂM SÀNG & XÉT NGHIỆM ---- |
| +-------------------------------+ |
| | Xét nghiệm máu tổng quát  [>] | |
| | Đơn vị: Mẫu                   | |
| | [ Đang cập nhật biểu phí ]    | |
| +-------------------------------+ |
|                                   |
| [QUY TRÌNH BÁO GIÁ 3 BƯỚC]        |
| 01. Thăm khám lâm sàng            |
| 02. Dự toán chi phí chi tiết      |
| 03. Điều trị theo đồng thuận      |
|-----------------------------------|
|                                   |
| [DARK CTA CHUYỂN ĐỔI]             |
| Cần tư vấn chi phí cụ thể?        |
| [ ĐĂNG KÝ LỊCH KHÁM NGAY ]        |
| [ GỌI TƯ VẤN: 097 355 51 05 ]     |
+-----------------------------------+
| FOOTER PUBLIC (Giữ nguyên)        |
+-----------------------------------+
| [Cấp cứu 24/24] [Đặt lịch khám]   | (Bottom Bar 56px - Giữ nguyên)
+-----------------------------------+
```

---

## 4. ĐẶC TẢ TƯƠNG TÁC ACCORDION (ACCORDION INTERACTION SPECS)

### 4.1. Trạng thái mặc định & Khả năng mở rộng
- **Khi mới tải trang:** Dòng đầu tiên của nhóm danh mục đầu tiên **mở sẵn** (`expanded: true`) nhằm làm mẫu tương tác trực quan. Toàn bộ các dòng còn lại ở trạng thái đóng (`expanded: false`).
- **Cho phép mở nhiều dòng (Multi-expansion):** Người dùng có thể mở cùng lúc nhiều dòng dịch vụ khác nhau để so sánh nội dung đi kèm giữa các dịch vụ.
- Cung cấp nút tiện ích nhỏ ở đầu bảng: `[ Mở tất cả ]` / `[ Thu gọn tất cả ]`.

### 4.2. Hiển thị khi thiếu giá (Missing Price Behavior)
- Khi `priceStatus = 'UNAVAILABLE'`: Cột giá hiển thị badge tím nhạt `Đang cập nhật biểu phí niêm yết`.
- Khi `priceStatus = 'CONTACT'`: Cột giá hiển thị badge hổ phách `Báo giá sau khám lâm sàng`.
- Trong panel mở rộng: Hiển thị thông báo rõ ràng: *"Biểu phí chính thức đang được phòng khám đối chiếu ban hành. Quý khách vui lòng liên hệ hotline 097 355 51 05 hoặc đặt lịch để được bác sĩ thông báo dự toán chi phí cụ thể."*

### 4.3. WAI-ARIA & Điều khiển bàn phím (Keyboard Navigation)
- Cấu trúc HTML semantic chuẩn:
  - Container nhóm accordion có `role="region"` và `aria-label="Tên nhóm danh mục"`.
  - Nút bấm trigger có `id="accordion-trigger-[id]"`, `aria-expanded="true/false"`, `aria-controls="accordion-panel-[id]"`.
  - Panel mở rộng có `id="accordion-panel-[id]"` và `aria-labelledby="accordion-trigger-[id]"` *(đã lược bỏ `role="region"` dư thừa ở panel con theo góp ý QA)*.
- Phím tắt điều khiển: `Enter` / `Space` để toggle; `ArrowDown` / `ArrowUp` chuyển dòng; `Home` / `End` nhảy đầu / cuối bảng giá.

---

## 5. ĐẶC TẢ TÌM KIẾM, SKELETON LOADING & EMPTY STATES

### 5.1. Bộ máy tìm kiếm client-side
- Quét chuỗi đồng thời trên: Tên dịch vụ, Mô tả ngắn, Tên nhóm danh mục.
- Tự động chuẩn hóa tiếng Việt không dấu (chữ thường, chữ hoa).
- **Compound Filtering (Tìm kiếm kết hợp Tab):** Tìm trong phạm vi tab đang chọn. Nếu không có kết quả, cung cấp nút chuyển nhanh sang tìm kiếm trên Tất cả danh mục.
- **Đồng bộ URL Query Parameter:** Đồng bộ `?cat=[slug]&q=[keyword]` qua `history.replaceState` mà không reload trang.

### 5.2. Wireframe Trạng thái Không có kết quả (Empty State)

```text
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|                                       [ Icon Kính Lúp X ]                                        |
|                                                                                                  |
|                                  Không tìm thấy dịch vụ phù hợp                                  |
|         Không có dịch vụ nào khớp với từ khóa "[query]". Quý khách vui lòng kiểm tra lại         |
|                     chính tả hoặc thử tìm kiếm bằng từ khóa ngắn gọn hơn.                        |
|                                                                                                  |
|                    [ Xóa bộ lọc tìm kiếm ]       [ Liên hệ tư vấn trực tiếp ]                    |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
(Khung giữ chỗ cố định min-h-[240px] để triệt tiêu hoàn toàn Layout Shift)
```

### 5.3. Wireframe Khung chờ Tải dữ liệu (Skeleton Loading State)

```text
+--------------------------------------------------------------------------------------------------+
| [ Skeleton Bar: Tìm kiếm w-full h-12 rounded-xl animate-pulse bg-slate-200 ]                     |
|                                                                                                  |
| [ Skeleton Tabs: 5 pill tabs h-10 w-24 rounded-full animate-pulse bg-slate-200 ]                 |
|                                                                                                  |
| +----------------------------------------------------------------------------------------------+ |
| | [ Skeleton Row 1: h-14 w-full rounded-xl animate-pulse bg-slate-100 mb-3 ]                  | |
| +----------------------------------------------------------------------------------------------+ |
| | [ Skeleton Row 2: h-14 w-full rounded-xl animate-pulse bg-slate-100 mb-3 ]                  | |
| +----------------------------------------------------------------------------------------------+ |
| | [ Skeleton Row 3: h-14 w-full rounded-xl animate-pulse bg-slate-100 mb-3 ]                  | |
| +----------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
```

---

## 6. MA TRẬN VÙNG CHẠM & TRUY CẬP (TOUCH TARGET MATRIX)

| Thành phần tương tác | Kích thước hiển thị | Vùng đệm chạm (Touch Target) | Quy chuẩn kiểm tra |
|---|---|---|---|
| **Header Hamburger Button** | $44 \times 44\text{px}$ | $44 \times 44\text{px}$ | ĐẠT chuẩn WCAG AA |
| **Header CTA Đặt lịch (Mobile)**| $85 \times 44\text{px}$ | $85 \times 44\text{px}$ | ĐẠT chuẩn WCAG AA |
| **Tab phân loại danh mục (Mobile)**| Auto width $\times 44\text{px}$ | Đệm padding `py-2.5 px-4` $\to \ge 44\text{px}$ | ĐẠT chuẩn WCAG AA |
| **Ô nhập liệu tìm kiếm (Input)**| $100\% \times 48\text{px}$ | $100\% \times 48\text{px}$ | ĐẠT chuẩn WCAG AA |
| **Nút xóa tìm kiếm (Nút X)** | $24 \times 24\text{px}$ (Icon) | $44 \times 44\text{px}$ (Button bao bọc) | ĐẠT chuẩn WCAG AA |
| **Hàng Accordion Header (Trigger)**| $100\% \times 56\text{px}$ | $100\% \times 56\text{px}$ | ĐẠT chuẩn WCAG AA |
| **Nút Đặt lịch con trong panel**| Auto $\times 44\text{px}$ | Đệm `py-2.5 px-4` $\to 44\text{px}$ | ĐẠT chuẩn WCAG AA |
| **Nút Gọi Hotline Cấp cứu** | $100\% \times 48\text{px}$ (Mobile)| $100\% \times 48\text{px}$ | ĐẠT chuẩn WCAG AA |
| **Mobile Bottom Bar Buttons** | $50\% \times 56\text{px}$ | $50\% \times 56\text{px}$ | ĐẠT chuẩn WCAG AA |

---

## 7. HỖ TRỢ GIẢM THIỂU CHUYỂN ĐỘNG (REDUCED MOTION COMPLIANCE)

Khi hệ điều hành kích hoạt chế độ `prefers-reduced-motion: reduce`:
- Toàn bộ hiệu ứng bung mở accordion chuyển từ transition co giãn sang **hiển thị tức thì (`transition: none !important`)**.
- Icon mũi tên `ChevronDown` đổi hướng ngay lập tức, không xoay góc.
- Hiệu ứng cuộn mượt (`scroll-behavior: smooth`) của thanh Jump Bar chuyển sang cuộn tức thì (`scroll-behavior: auto`).

---

**KẾT THÚC ĐẶC TẢ WIREFRAME & TƯƠNG TÁC 3B-00 (WIREFRAME SPECIFICATION V1.1)**
