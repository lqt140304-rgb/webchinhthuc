# ĐẶC TẢ WIREFRAME & TƯƠNG TÁC GIAI ĐOẠN 3B — PHIÊN BẢN V1.0 (PHASE 3B-00 WIREFRAME SPECIFICATION)
## Bệnh viện Thú y Lê Sơn 2026 — Đặc Tả Bố Cục Đa Điểm Ảnh, Accordion & Công Cụ Tra Cứu

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 038-A (Section VIII)**; `AGENTS.md` (Architecture Baseline V1) |
| **Bản chất tài liệu** | **WIREFRAME & INTERACTION SPECIFICATION ONLY** (Đặc tả thiết kế chi tiết — Không phải mã nguồn triển khai) |
| **Giai đoạn** | **3B-00: DOCUMENTATION ONLY — KHÔNG CODE / KHÔNG MOCKUP HTML** |
| **Phạm vi** | Hai trang: **`/dich-vu`** (Tổng hợp dịch vụ) và **`/bang-gia`** (Bảng giá niêm yết) |
| **Ma trận 6 Viewports** | **320px** (Mobile nhỏ), **375px** (Mobile chuẩn), **768px** (Tablet đứng), **1024px** (Laptop nhỏ/Tablet ngang), **1440px** (Desktop chuẩn), **1920px** (Màn hình lớn) |

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
| HEADER PUBLIC: Logo Thú y Lê Sơn | Về Lê Sơn v | Dịch vụ v | Góc thú cưng v | [ĐẶT LỊCH KHÁM]    |
+--------------------------------------------------------------------------------------------------+
| BREADCRUMB: Trang chủ / Dịch vụ                                                                  |
|                                                                                                  |
| [SECTION 1: EDITORIAL HERO]                                                                      |
| HỆ THỐNG DỊCH VỤ Y TẾ THÚ CƯNG LÊ SƠN                                                            |
| Chăm sóc chu toàn từ phòng khám đến khu nội trú (Lora 600, 48px)                                 |
|                                                                                                  |
| "Chúng tôi hiểu rằng mỗi lần thú cưng thăm khám là một lần người bạn đồng hành cần sự dịu dàng   |
|  và chuẩn xác cao nhất. Bệnh viện Thú y Lê Sơn xây dựng quy trình tiếp đón chu đáo..."           |
|                                                                                                  |
| +----------------------------------------------------------------------------------------------+ |
| | [i] THÔNG BÁO: Danh mục dịch vụ đang được chuẩn hóa theo định hướng Giai đoạn 3B. Chi tiết   | |
| |     phác đồ và chi phí cụ thể sẽ được bác sĩ trao đổi trực tiếp sau khi khám lâm sàng.       | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| [SECTION 2: JUMP BAR]                                                                            |
| [ (o) Khám & Điều trị ] [ Cận lâm sàng & Xét nghiệm ] [ Nội trú 24/7 ] [ Spa Grooming ] [Cấp cứu]|
|--------------------------------------------------------------------------------------------------|
|                                                                                                  |
| [SECTION 3.1: NHÓM 01 — Y KHOA LÂM SÀNG & ĐIỀU TRỊ] (#kham-dieu-tri)                             |
| +-------------------------------------------------------+ +------------------------------------+ |
| | NHÓM 01 — Y KHOA LÂM SÀNG                             | | KHUNG ẢNH MINH HỌA               | |
| | Thăm khám kỹ lưỡng, chẩn đoán đúng và điều trị tận gốc| | +--------------------------------+ | |
| |                                                       | | |                                | | |
| | Quy trình đo sinh hiệu, nghe tim phổi và giải thích   | | |     [Ảnh thú cưng ấm áp]       | | |
| | cặn kẽ phác đồ điều trị cho chủ nuôi.                 | | |                                | | |
| |                                                       | | | Nhãn: Ảnh minh họa dịch vụ     | | |
| | -- Danh mục dịch vụ thành phần: -------------------   | | +--------------------------------+ | |
| | * Khám lâm sàng tổng quát & sàng lọc định kỳ          | |                                    | |
| | * Tiêm phòng vaccine & phòng ký sinh trùng            | | BS. Lê Thái Sơn phụ trách phẫu     | |
| | * Phẫu thuật ngoại khoa mô mềm & triệt sản an toàn    | | thuật ngoại khoa và phác đồ điều   | |
| | * Điều trị nội khoa, tiêu hóa, hô hấp, da liễu       | | trị lâm sàng chính quy.            | |
| |                                                       | |                                    | |
| | [ Tra cứu bảng giá khám & phẫu thuật -> ]             | |                                    | |
| +-------------------------------------------------------+ +------------------------------------+ |
|                                                                                                  |
| [SECTION 3.2: NHÓM 02 — CHẨN ĐOÁN CẬN LÂM SÀNG & XÉT NGHIỆM] (#can-lam-sang)                      |
| Hỗ trợ chẩn đoán nhanh chóng và chuẩn xác (Grid 3 thẻ)                                           |
| +-----------------------------+ +-----------------------------+ +------------------------------+ |
| | XÉT NGHIỆM HUYẾT HỌC & SH   | | CHẨN ĐOÁN HÌNH ẢNH KỸ THUẬT | | SOI KÍNH HIỂN VI DA & KST    | |
| | Phân tích 18 chỉ số máu,    | | X-quang kỹ thuật số & Siêu  | | Tầm soát nấm da, ghẻ Demodex | |
| | đánh giá chức năng gan thận | | âm ổ bụng tầm soát dị vật   | | và ký sinh trùng đường máu   | |
| | [Xem bảng giá xét nghiệm ->]| | [Xem bảng giá X-quang ->]   | | [Xem bảng giá soi da ->]     | |
| +-----------------------------+ +-----------------------------+ +------------------------------+ |
|                                                                                                  |
| [SECTION 3.3: NHÓM 03 — LƯU TRÚ Y TẾ NỘI TRÚ 24/7] (#noi-tru)                                    |
| Khu nội trú yên tĩnh, kiểm soát lây nhiễm nghiêm ngặt (Lavender Container)                       |
| * Phân khu cách ly tuyệt đối bệnh truyền nhiễm và khu hồi sức sau phẫu thuật                     |
| * Bác sĩ & điều dưỡng trực đêm theo dõi sinh hiệu, truyền dịch và cấp thuốc đúng cữ              |
| * Báo cáo tình hình bé định kỳ cho chủ nuôi (không công khai y lệnh nghiệp vụ nội bộ)            |
| [ Tra cứu biểu phí nội trú lưu chuồng -> ]                                                       |
|                                                                                                  |
| [SECTION 3.4: NHÓM 04 — VỆ SINH Y TẾ & SPA GROOMING] (#spa-grooming)                             |
| +-------------------------------------------------------+ +------------------------------------+ |
| | Vệ sinh êm ái, làm đẹp dịu nhẹ cho bé cưng            | | CÁC GÓI DỊCH VỤ SPA TIÊU BIỂU:   | |
| | Sử dụng sữa tắm dưỡng da chuyên dụng, hạn chế căng    | | 1. Tắm vệ sinh & sấy chải        | |
| | thẳng tối đa cho thú cưng trong suốt quá trình làm spa| | 2. Cắt tỉa tạo hình thẩm mỹ      | |
| | [ Xem bảng giá dịch vụ spa grooming -> ]              | | 3. Tắm trị liệu da liễu kê đơn   | |
| +-------------------------------------------------------+ +------------------------------------+ |
|                                                                                                  |
| [SECTION 4: TIẾP NHẬN CẤP CỨU KHẨN CẤP 24/24] (Warm Orange Strip)                                |
| [!] CẤP CỨU THÚ CƯNG 24/24 TẠI 101 KHUẤT DUY TIẾN | HOTLINE: 097 355 51 05  [ GỌI CẤP CỨU NGAY ] |
|     Tiếp nhận xuyên đêm các ca khó thở, co giật, ngộ độc, nuốt dị vật, tai nạn                   |
|                                                                                                  |
| [SECTION 5: HƯỚNG DẪN TRƯỚC KHI ĐƯA BÉ ĐẾN KHÁM] (Architectural Numbered Triptych)               |
| +-----------------------------+ +-----------------------------+ +------------------------------+ |
| | 01. NHỊN ĂN TRƯỚC XN/MỔ     | | 02. VẬN CHUYỂN AN TOÀN      | | 03. MANG THEO SỔ TIÊM CHỦNG  | |
| | Nhịn ăn 6-8h nếu cần xét    | | Dùng lồng vận chuyển chuyên | | Cung cấp lịch sử tiêm phòng  | |
| | nghiệm sinh hóa hoặc mổ     | | dụng hoặc dây dắt an toàn   | | và các loại thuốc đang dùng  | |
| +-----------------------------+ +-----------------------------+ +------------------------------+ |
|                                                                                                  |
| [SECTION 6: EDITORIAL DARK CTA] (Nền Deep Plum #421247)                                          |
| Bạn cần tư vấn dịch vụ phù hợp cho bé cưng?                                                      |
| [ ĐẶT LỊCH KHÁM ONLINE ]     [ XEM BẢNG GIÁ DỊCH VỤ ]                                            |
+--------------------------------------------------------------------------------------------------+
| FOOTER PUBLIC: Địa chỉ 101 Khuất Duy Tiến | Hotline 097 355 51 05 | Bản quyền 2026 Lê Sơn        |
+--------------------------------------------------------------------------------------------------+
```

### 2.2. Bản vẽ khung hình Mobile (375px / 320px)

```text
+-----------------------------------+
| [=] Logo Lê Sơn       [ĐẶT KHÁM]  | (Header 73px cố định)
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
| [TAB NHẢY CUỘN NGANG - STICKY]    |
| [Khám điều trị] [Xét nghiệm] [..] |
|-----------------------------------|
|                                   |
| [NHÓM 01: Y KHOA LÂM SÀNG]        |
| Thăm khám kỹ lưỡng,               |
| chẩn đoán tận gốc                 |
|                                   |
| [Khung ảnh minh họa tỉ lệ 16:9]   |
|                                   |
| * Khám lâm sàng tổng quát         |
| * Tiêm phòng vaccine định kỳ      |
| * Phẫu thuật mô mềm & triệt sản   |
| * Điều trị nội khoa chuyên sâu    |
|                                   |
| [ Tra cứu bảng giá khám -> ]      |
|-----------------------------------|
|                                   |
| [NHÓM 02: CẬN LÂM SÀNG & XN]      |
| * Thẻ 1: Xét nghiệm huyết học/SH  |
| * Thẻ 2: X-quang & Siêu âm        |
| * Thẻ 3: Soi kính hiển vi da      |
|                                   |
| [ Xem bảng giá xét nghiệm -> ]    |
|-----------------------------------|
|                                   |
| [NHÓM 03: NỘI TRÚ Y TẾ 24/7]      |
| (Khung Lavender bo tròn)          |
| * Phân khu cách ly lây nhiễm      |
| * Bác sĩ & điều dưỡng trực đêm    |
| * Cập nhật tình hình định kỳ      |
|                                   |
| [ Tra cứu biểu phí nội trú -> ]   |
|-----------------------------------|
|                                   |
| [NHÓM 04: SPA GROOMING]           |
| Vệ sinh êm ái, làm đẹp dịu nhẹ    |
| * Gói tắm vệ sinh tiêu chuẩn      |
| * Cắt tỉa tạo hình thẩm mỹ        |
| * Tắm trị liệu da liễu            |
|                                   |
| [ Xem bảng giá spa grooming -> ]  |
|-----------------------------------|
|                                   |
| [CẤP CỨU KHẨN CẤP 24/24]          |
| Hotline: 097 355 51 05            |
| [ GỌI CẤP CỨU NGAY ] (Full-width) |
|-----------------------------------|
|                                   |
| [LƯU Ý TRƯỚC KHI ĐẾN KHÁM]        |
| 01. Nhịn ăn 6-8h trước mổ/XN      |
| 02. Vận chuyển an toàn bằng lồng  |
| 03. Mang theo sổ tiêm chủng       |
|-----------------------------------|
|                                   |
| [DARK CTA CHUYỂN TIẾP]            |
| Tư vấn dịch vụ phù hợp cho bé?    |
| [ ĐẶT LỊCH KHÁM ONLINE ]          |
| [ XEM BẢNG GIÁ DỊCH VỤ ]          |
+-----------------------------------+
| FOOTER PUBLIC (Thu gọn)           |
+-----------------------------------+
| [HOTLINE: 097 355 51 05] [ĐẶT LỊCH| (Mobile Bottom Bar)
+-----------------------------------+
```

---

## 3. WIREFRAME CHI TIẾT TRANG `/bang-gia`

### 3.1. Bản vẽ khung hình Desktop (1440px / 1024px)

```text
+--------------------------------------------------------------------------------------------------+
| HEADER PUBLIC: Logo Thú y Lê Sơn | Về Lê Sơn v | Dịch vụ v | Góc thú cưng v | [ĐẶT LỊCH KHÁM]    |
+--------------------------------------------------------------------------------------------------+
| BREADCRUMB: Trang chủ / Dịch vụ / Bảng giá niêm yết                                              |
|                                                                                                  |
| [SECTION 1: PAGE HEADING & DISCLAIMER BANNER]                                                    |
| MINH BẠCH CHI PHÍ Y TẾ THÚ CƯNG                                                                  |
| Bảng giá dịch vụ & biểu phí tham chiếu (Lora 600, 48px)                                          |
| "Bệnh viện Thú y Lê Sơn cam kết thông báo rõ ràng mọi chi phí dự kiến trước khi tiến hành..."    |
|                                                                                                  |
| +----------------------------------------------------------------------------------------------+ |
| | [i] NGUYÊN TẮC BIẾN ĐỘNG GIÁ Y KHOA:                                                         | |
| |     1. Chi phí y tế có thể thay đổi tùy thuộc vào cân nặng, giống loài và mức độ ca bệnh.    | |
| |     2. Bác sĩ luôn trao đổi và lập dự toán chi phí trước khi phẫu thuật hoặc điều trị.      | |
| |     3. Dịch vụ cấp cứu đêm và ngày lễ có thể áp dụng phụ phí phục vụ ngoài giờ y tế.         | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| [SECTION 2: TOOLBAR TÌM KIẾM & PHÂN LOẠI]                                                        |
| +----------------------------------------------------------------------------------------------+ |
| | [Search Icon] Tìm tên dịch vụ, xét nghiệm, gói spa (ví dụ: siêu âm, triệt sản...)       [x]  | |
| +----------------------------------------------------------------------------------------------+ |
| [ (o) Tất cả (24) ] [ Khám & Thủ thuật (5) ] [ Xét nghiệm (6) ] [ Phẫu thuật (4) ] [Nội trú][Spa]|
|                                                                                                  |
| [SECTION 3: BẢNG GIÁ ACCORDION CÓ CẤU TRÚC] (Container min-h-[400px])                            |
|                                                                                                  |
| == NHÓM: KHÁM LÂM SÀNG & THỦ THUẬT CƠ BẢN ====================================================== |
| +----------------------------------------------------------------------------------------------+ |
| | [v] Khám lâm sàng tổng quát ban đầu                 | Đơn vị: Lần | [ Đang cập nhật biểu phí ] | |
| |----------------------------------------------------------------------------------------------| |
| |     Nội dung bao gồm: Đo thân nhiệt, nghe tim phổi, kiểm tra niêm mạc, kiểm tra cân nặng.   | |
| |     Ghi chú y khoa: Áp dụng cho lần khám đầu tiên hoặc khám định kỳ tổng quát.               | |
| |     [ Đặt lịch dịch vụ này -> ]                                                              | |
| +----------------------------------------------------------------------------------------------+ |
| | [>] Tái khám theo hẹn của bác sĩ                    | Đơn vị: Lần | [ Đang cập nhật biểu phí ] | |
| +----------------------------------------------------------------------------------------------+ |
| | [>] Cấp cứu ngoài giờ y tế (21:00 – 08:00)          | Đơn vị: Ca  | [ Báo giá sau khám ]       | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| == NHÓM: XÉT NGHIỆM & CHẨN ĐOÁN CẬN LÂM SÀNG =================================================== |
| +----------------------------------------------------------------------------------------------+ |
| | [>] Xét nghiệm huyết học tổng quát (18 chỉ số máu)  | Đơn vị: Mẫu | [ Đang cập nhật biểu phí ] | |
| +----------------------------------------------------------------------------------------------+ |
| | [>] Chụp X-quang kỹ thuật số (1 tư thế)             | Đơn vị: Phim| [ Đang cập nhật biểu phí ] | |
| +----------------------------------------------------------------------------------------------+ |
| | [>] Siêu âm ổ bụng tổng quát tầm soát               | Đơn vị: Lần | [ Đang cập nhật biểu phí ] | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| == NHÓM: PHẪU THUẬT NGOẠI KHOA & TRIỆT SẢN ===================================================== |
| +----------------------------------------------------------------------------------------------+ |
| | [>] Triệt sản mèo đực tiêu chuẩn                    | Đơn vị: Ca  | [ Đang cập nhật biểu phí ] | |
| +----------------------------------------------------------------------------------------------+ |
| | [>] Phẫu thuật mô mềm & xử lý vết thương hở         | Đơn vị: Ca  | [ Báo giá sau khám ]       | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| [SECTION 4: QUY TRÌNH TIẾP NHẬN BÁO GIÁ MINH BẠCH 3 BƯỚC]                                        |
| +-----------------------------+ +-----------------------------+ +------------------------------+ |
| | BƯỚC 01: THĂM KHÁM LÂM SÀNG | | BƯỚC 02: DỰ TOÁN CHI TIẾT   | | BƯỚC 03: ĐỒNG THUẬN ĐIỀU TRỊ | |
| | Bác sĩ khám và đánh giá tình| | Lập bảng dự toán chi phí rõ | | Chỉ tiến hành can thiệp khi  | |
| | trạng thể chất thực tế của bé| ràng, giải thích từng hạng mục| chủ nuôi đã hiểu và đồng thuận | |
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
| [=] Logo Lê Sơn       [ĐẶT KHÁM]  | (Header 73px)
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
| [Q] Tìm tên dịch vụ, giá...   [x] |
|                                   |
| [DẢI TAB DANH MỤC CUỘN NGANG]     |
| [Tất cả(24)] [Khám(5)] [XN(6)]... |
|-----------------------------------|
|                                   |
| -- KHÁM & THỦ THUẬT ------------- |
| +-------------------------------+ |
| | Khám tổng quát ban đầu    [v] | | (Touch target row 56px)
| | Đơn vị: Lần                   | |
| | [ Đang cập nhật biểu phí ]    | |
| | - - - - - - - - - - - - - - - | |
| | Nội dung: Đo sinh hiệu, tim   | |
| | phổi, niêm mạc, cân nặng.     | |
| | [ Đặt lịch dịch vụ này -> ]   | |
| +-------------------------------+ |
| +-------------------------------+ |
| | Tái khám theo hẹn         [>] | |
| | Đơn vị: Lần                   | |
| | [ Đang cập nhật biểu phí ]    | |
| +-------------------------------+ |
| +-------------------------------+ |
| | Cấp cứu ngoài giờ 24/24   [>] | |
| | Đơn vị: Ca                    | |
| | [ Báo giá sau khám ]          | |
| +-------------------------------+ |
|                                   |
| -- XÉT NGHIỆM & CẬN LÂM SÀNG ---- |
| +-------------------------------+ |
| | Xét nghiệm máu 18 chỉ số  [>] | |
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
| FOOTER PUBLIC                     |
+-----------------------------------+
| [GỌI HOTLINE] [ĐĂNG KÝ KHÁM NGAY] | (Bottom Bar 56px)
+-----------------------------------+
```

---

## 4. ĐẶC TẢ TƯƠNG TÁC ACCORDION (ACCORDION INTERACTION SPECS)

Thành phần `ServicePriceAccordion` trên trang `/bang-gia` được quy chuẩn nghiêm ngặt:

### 4.1. Trạng thái mặc định (Default State)
- **Khi mới tải trang:** Dòng đầu tiên của nhóm danh mục đầu tiên **mở sẵn** (`expanded: true`) nhằm làm mẫu tương tác trực quan cho người dùng nhận biết hàng bảng giá có thể bung ra xem chi tiết. Toàn bộ các dòng còn lại ở trạng thái đóng (`expanded: false`).
- **Khi lọc danh mục hoặc tìm kiếm:** Dòng đầu tiên của danh sách kết quả lọc tự động mở, các dòng còn lại đóng.

### 4.2. Khả năng mở nhiều dòng đồng thời (Multi-row Expansion)
- **Cho phép mở nhiều dòng (Multi-expansion):** Người dùng có thể mở cùng lúc nhiều dòng dịch vụ khác nhau để so sánh nội dung đi kèm và điều kiện y khoa giữa các gói dịch vụ (ví dụ: so sánh giữa *Khám tổng quát* và *Tái khám*, hoặc *Gói tắm vệ sinh* và *Tắm trị liệu*).
- Không tự động thu gọn dòng khác khi click mở một dòng mới.
- Cung cấp nút tiện ích nhỏ ở đầu bảng: `[ Mở tất cả ]` / `[ Thu gọn tất cả ]`.

### 4.3. Hiển thị khi thiếu giá (Missing Price Behavior)
- Khi `priceStatus = 'UNAVAILABLE'`, cột giá hiển thị badge: `Đang cập nhật biểu phí niêm yết`.
- Khi `priceStatus = 'CONTACT'`, cột giá hiển thị badge: `Báo giá sau khám lâm sàng`.
- Trong panel mở rộng, hiển thị thông báo rõ ràng: *"Biểu phí chính thức đang được hội đồng chuyên môn đối chiếu ban hành. Quý khách vui lòng liên hệ hotline 097 355 51 05 hoặc đặt lịch để được bác sĩ thông báo dự toán chi phí chính xác nhất."*

### 4.4. Trải nghiệm trên thiết bị di động (Mobile Behavior)
- Kích thước hàng accordion: Chiều cao tối thiểu vùng chạm là **56px** (vượt chuẩn $44\text{px}$).
- Nút mũi tên xoay `ChevronDown` có kích thước tối thiểu $24 \times 24\text{px}$ đặt trong hộp chạm $44 \times 44\text{px}$.
- Khi mở dòng, nếu phần nội dung chi tiết bị tràn xuống dưới màn hình, hệ thống cuộn mượt nhẹ (`scrollIntoView({ behavior: 'smooth', block: 'nearest' })`) để người dùng đọc trọn vẹn thông tin.

### 4.5. Khả năng tiếp cận & Điều khiển bàn phím (WAI-ARIA Accessibility)
Tuân thủ đầy đủ chuẩn **W3C WAI-ARIA Accordion Pattern**:
- **Cấu trúc HTML semantic:**
  ```html
  <div class="service-accordion-group" role="region" aria-label="Khám & Thủ thuật">
    <!-- Trigger Header -->
    <h3>
      <button
        id="accordion-trigger-srv-kham-tong-quat"
        aria-expanded="true"
        aria-controls="accordion-panel-srv-kham-tong-quat"
        class="w-full flex items-center justify-between min-h-[56px] ..."
      >
        <span class="font-semibold text-left">Khám lâm sàng tổng quát ban đầu</span>
        <span class="badge ...">Đang cập nhật biểu phí niêm yết</span>
        <svg class="chevron transition-transform duration-200 rotate-180 ..." aria-hidden="true" />
      </button>
    </h3>
    <!-- Expandable Panel -->
    <div
      id="accordion-panel-srv-kham-tong-quat"
      role="region"
      aria-labelledby="accordion-trigger-srv-kham-tong-quat"
      class="accordion-content ..."
    >
      <p>Nội dung bao gồm trong dịch vụ...</p>
    </div>
  </div>
  ```
- **Phím tắt điều khiển (Keyboard Handlers):**
  - `Enter` hoặc `Space`: Đóng/Mở dòng accordion đang focus.
  - `ArrowDown`: Chuyển focus đến trigger của dòng tiếp theo.
  - `ArrowUp`: Chuyển focus đến trigger của dòng phía trước.
  - `Home`: Nhảy focus về dòng đầu tiên trong bảng giá.
  - `End`: Nhảy focus về dòng cuối cùng trong bảng giá.

---

## 5. ĐẶC TẢ TÌM KIẾM & LỌC DANH MỤC (SEARCH & FILTER SPECS)

### 5.1. Trường dữ liệu được tìm kiếm (Queried Fields)
Bộ máy tìm kiếm client-side thực hiện quét chuỗi đồng thời trên 4 trường dữ liệu của `Service`:
1. `name` (Tên dịch vụ kỹ thuật, ví dụ: "Siêu âm ổ bụng").
2. `shortDescription` (Mô tả tóm tắt).
3. `includedFeatures` (Các hạng mục đi kèm).
4. `categoryName` (Tên nhóm danh mục trực thuộc).

### 5.2. Chuẩn hóa chuỗi tiếng Việt (Vietnamese String Normalization)
- Tự động chuyển đổi chuỗi tìm kiếm và chuỗi nguồn sang chữ thường (`toLowerCase()`).
- Loại bỏ dấu tiếng Việt (ví dụ: gõ `"sieu am"` vẫn tìm ra `"Siêu âm"`; gõ `"triet san"` vẫn tìm ra `"Triệt sản"`).
- Khử khoảng trắng thừa đầu cuối (`trim()`).

### 5.3. Tương tác phối hợp giữa Ô tìm kiếm và Tab danh mục (Compound Filtering)
Cơ chế lọc hoạt động theo logic giao nhau (**AND Logic**):
- **Trường hợp 1:** Đang chọn Tab `Xét nghiệm` và gõ `"máu"` $\to$ Chỉ hiển thị các xét nghiệm máu thuộc nhóm Xét nghiệm.
- **Trường hợp 2:** Đang chọn Tab `Nội trú` nhưng gõ `"siêu âm"` (không có trong nội trú) $\to$ Hiển thị thông báo: *"Không tìm thấy dịch vụ 'siêu âm' trong mục Nội trú. Bạn có muốn tìm trong [Tất cả dịch vụ (1)]?"* kèm nút bấm chuyển tab tự động.

### 5.4. Giao diện khi không có kết quả (Empty State UI)
- Khi tìm kiếm hoặc lọc không có kết quả nào thỏa mãn, hiển thị khối thông báo trung tính:
  - Icon: `SearchX` hoặc `FileQuestion` màu Muted Plum.
  - Tiêu đề: `Không tìm thấy dịch vụ phù hợp`.
  - Mô tả: `Không có dịch vụ nào khớp với từ khóa "[query]". Quý khách vui lòng kiểm tra lại chính tả hoặc thử tìm kiếm bằng từ khóa ngắn hơn.`
  - Nút bấm khắc phục:
    - Nút 1: `Xóa bộ lọc tìm kiếm` (Reset ô input và chuyển về tab Tất cả).
    - Nút 2: `Liên hệ tư vấn trực tiếp` trỏ tới hotline `tel:0973555105`.
  - Khung giữ chỗ có chiều cao tối thiểu **240px** (`min-h-[240px]`) để triệt tiêu hiện tượng giật layout (zero CLS).

### 5.5. Đồng bộ URL Query Parameter (URL Deep Linking)
- Khi người dùng gõ từ khóa hoặc chuyển tab, URL tự động cập nhật query parameter tương ứng thông qua `history.replaceState` (không gây reload trang):
  - `?cat=xet-nghiem`
  - `?q=sieu-am`
  - `?cat=xet-nghiem&q=mau`
- Khi người dùng gửi link này cho bạn bè hoặc mở từ tab mới, trang `/bang-gia` tự động đọc query parameters từ URL và kích hoạt trạng thái lọc tương ứng ngay khi render lần đầu.

---

## 6. MA TRẬN VÙNG CHẠM & KHẢ NĂNG TRUY CẬP (TOUCH TARGET & ACCESSIBILITY MATRIX)

Bảo đảm 100% phần tử tương tác đạt chuẩn WCAG 2.2 Level AA ($\ge 44\times 44\text{px}$):

| Thành phần tương tác | Kích thước hiển thị | Vùng đệm chạm (Touch Target) | Quy chuẩn kiểm tra |
|---|---|---|---|
| **Header Hamburger Button** | $44 \times 44\text{px}$ | $44 \times 44\text{px}$ (Đã kiểm chứng FIX 01) | ĐẠT chuẩn WCAG |
| **Header CTA Đặt lịch (Mobile)**| $85 \times 44\text{px}$ | $85 \times 44\text{px}$ (Đã kiểm chứng FIX 01) | ĐẠT chuẩn WCAG |
| **Tab phân loại danh mục (Mobile)**| Auto width $\times 38\text{px}$ | Đệm padding `py-2.5 px-4` $\to \ge 44\text{px}$ chiều cao | ĐẠT chuẩn WCAG |
| **Ô nhập liệu tìm kiếm (Input)**| $100\% \times 48\text{px}$ | $100\% \times 48\text{px}$ | ĐẠT chuẩn WCAG |
| **Nút xóa tìm kiếm (Nút X)** | $24 \times 24\text{px}$ (Icon) | $44 \times 44\text{px}$ (Thẻ button bao bọc) | ĐẠT chuẩn WCAG |
| **Hàng Accordion Header (Trigger)**| $100\% \times 56\text{px}$ | $100\% \times 56\text{px}$ | ĐẠT chuẩn WCAG |
| **Nút Đặt lịch con trong panel**| Auto $\times 36\text{px}$ | Đệm `py-2 px-3.5` $\to 44\text{px}$ | ĐẠT chuẩn WCAG |
| **Nút Gọi Hotline Cấp cứu** | $100\% \times 48\text{px}$ (Mobile)| $100\% \times 48\text{px}$ | ĐẠT chuẩn WCAG |
| **Mobile Bottom Bar Buttons** | $50\% \times 56\text{px}$ | $50\% \times 56\text{px}$ | ĐẠT chuẩn WCAG |

---

## 7. HỖ TRỢ GIẢM THIỂU CHUYỂN ĐỘNG (REDUCED MOTION COMPLIANCE)

Khi hệ điều hành kích hoạt chế độ `prefers-reduced-motion: reduce`:
- Toàn bộ hiệu ứng bung mở accordion chuyển từ transition co giãn sang **hiển thị tức thì (`transition: none !important`)**.
- Icon mũi tên `ChevronDown` đổi hướng ngay lập tức, không xoay góc.
- Hiệu ứng cuộn mượt (`scroll-behavior: smooth`) của thanh Jump Bar chuyển sang cuộn tức thì (`scroll-behavior: auto`).

---

**KẾT THÚC ĐẶC TẢ WIREFRAME & TƯƠNG TÁC 3B-00 (WIREFRAME SPECIFICATION V1.0)**
