# HỒ SƠ THIẾT KẾ CHI TIẾT GIAI ĐOẠN 3B — PHIÊN BẢN V1.0 (PHASE 3B-00 BLUEPRINT)
## Bệnh viện Thú y Lê Sơn 2026 — Kiến Trúc Tuyến Trang Dịch Vụ & Bảng Giá Niêm Yết

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Giai đoạn** | **3B-00: DOCUMENTATION & BLUEPRINT SPECIFICATION ONLY** |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 038-A**; `AGENTS.md` (Architecture Baseline V1); `PROJECT_BRIEF.md`; `docs/qa/3a-preview-fix01-qa.md` (Commit QA: `99a224a`) |
| **Mã nguồn cơ sở 3A** | Commit `4739d45cc95100b587381b6bdcad6935352b23e8` (Nghiệm thu có điều kiện) |
| **Tác giả thiết kế** | Antigravity — UX Architect & Design Planner |
| **Thẩm định độc lập** | Claude — Independent QA Lead |
| **Phạm vi tuyến trang** | **1. `/dich-vu`** (Trang tổng hợp dịch vụ y tế & chăm sóc)<br>**2. `/bang-gia`** (Trang biểu phí & bảng giá niêm yết tham chiếu) |
| **Giới hạn nghiêm ngặt** | **TUYỆT ĐỐI KHÔNG mở trang chi tiết `/dich-vu/:slug` trong giai đoạn này**.<br>Không sửa source code, không sửa CSS, không can thiệp dependencies, không deploy Vercel, không merge `main`. |
| **Trạng thái tài liệu** | **APPROVED FOR DOCUMENTATION ONLY — NO WEBSITE IMPLEMENTATION** |

---

## MỤC LỤC

1. [Mục 1: Sitemap & Cấu Trúc Điều Hướng Giai Đoạn 3B](#1-muc-1-sitemap--cau-truc-dieu-huong-giai-doan-3b)
2. [Mục 2: Định Hướng Nghệ Thuật "Vibrant Editorial Luxury" & Hệ Thống Token](#2-muc-2-dinh-huong-nghe-thuat-vibrant-editorial-luxury--he-thong-token)
3. [Mục 3: Đặc Tả Chi Tiết Tuyến Trang `/dich-vu`](#3-muc-3-dac-ta-chi-tiet-tuyen-trang-dich-vu)
4. [Mục 4: Đặc Tả Chi Tiết Tuyến Trang `/bang-gia`](#4-muc-4-dac-ta-chi-tiet-tuyen-trang-bang-gia)
5. [Mục 5: Kiến Trúc Cô Lập Bundle, Hiệu Năng & Ngăn Ngừa CLS](#5-muc-5-kien-truc-co-lap-bundle-hieu-nang--ngan-ngua-cls)
6. [Mục 6: Ma Trận Trạng Thái Dữ Liệu & Quy Tắc Khóa Nội Dung (Content Lock)](#6-muc-6-ma-tran-trang-thai-du-lieu--quy-tac-khoa-noi-dung-content-lock)
7. [Mục 7: Danh Mục Quyết Định Cần Chủ Dự Án Phê Duyệt Trước DEV-01](#7-muc-7-danh-muc-quyet-dinh-can-chu-du-an-phe-duyet-truoc-dev-01)

---

## 1. MỤC 1: SITEMAP & CẤU TRÚC ĐIỀU HƯỚNG GIAI ĐOẠN 3B

### 1.1. Phạm vi tuyến đường trong Giai đoạn 3B
Giai đoạn 3B chỉ bao gồm đúng **hai (02) tuyến đường công khai**:
- `/dich-vu`: Trang tổng quan toàn bộ hệ thống giải pháp y tế, chăm sóc nội trú, spa grooming và cấp cứu 24/24.
- `/bang-gia`: Trang công khai minh bạch nguyên tắc biểu phí, công cụ tra cứu dịch vụ và bảng giá tham chiếu.

```text
Public Website (RootLayout: Header + #main-content + Footer + MobileBottomBar)
│
├── / (Trang chủ — Giữ nguyên 100% 6 section đã nghiệm thu Mốc 2A/2B)
│
├── /gioi-thieu (Mốc 3A — Nghiệm thu có điều kiện)
├── /doi-ngu (Mốc 3A — Nghiệm thu có điều kiện)
├── /co-so-vat-chat (Mốc 3A — Nghiệm thu có điều kiện)
│
├── [PHẠM VI GIAI ĐOẠN 3B]:
│   ├── /dich-vu (Trang tổng hợp dịch vụ y tế)
│   └── /bang-gia (Trang bảng giá dịch vụ niêm yết)
│
├── /dat-lich (Đích đến chuyển đổi cho toàn bộ CTA của 3B)
│
└── [NGOÀI PHẠM VI 3B — KHÓA TUYỆT ĐỐI]:
    ├── /dich-vu/:slug (Chưa triển khai — Chờ phê duyệt ở giai đoạn sau)
    ├── /cau-chuyen & /cau-chuyen/:slug (Giai đoạn sau)
    ├── /goc-thu-cung & /bai-viet/:slug (Giai đoạn sau)
    ├── /san-pham (Giai đoạn sau)
    ├── /tai-khoan/* (Customer Portal — Giai đoạn 4)
    └── /quan-ly/* (Staff Portal — Giai đoạn 4)
```

### 1.2. Mối liên kết điều hướng (Incoming & Outgoing Topology)
1. **Từ Header:**
   - Menu desktop `Dịch vụ` (Dropdown):
     - `Tất cả dịch vụ` $\to$ Liên kết đến `/dich-vu`.
     - `Bảng giá niêm yết` $\to$ Liên kết đến `/bang-gia`.
     - Các mục con chi tiết (Khám điều trị, Nội trú, Spa, Cấp cứu): Trong giai đoạn 3B-00, xác định các thẻ neo (anchor link) trực tiếp vào các nhóm section trên `/dich-vu` (ví dụ: `/dich-vu#kham-dieu-tri`, `/dich-vu#noi-tru`, `/dich-vu#spa`, `/dich-vu#cap-cuu`) thay vì dẫn về trang rỗng.
   - Mobile Navigation Drawer: Nhóm accordion `Dịch vụ` trỏ tới `/dich-vu` và `/bang-gia`.
2. **Từ Trang chủ (`/`):**
   - Section 3 (`FeaturedServices`): Nút "Xem tất cả dịch vụ" $\to$ trỏ về `/dich-vu`.
   - Các card dịch vụ tiêu biểu $\to$ trỏ về nhóm dịch vụ tương ứng trên `/dich-vu`.
   - Thanh Cấp cứu 24/24 $\to$ liên kết gọi hotline trực tiếp `097 355 51 05` và nút quy trình neo về `/dich-vu#cap-cuu`.
3. **Từ Footer:**
   - Nhóm liên kết "Dịch vụ y tế" & "Bảng giá niêm yết" $\to$ trỏ chính xác về `/dich-vu` và `/bang-gia`.
4. **Giữa `/dich-vu` và `/bang-gia`:**
   - Trên `/dich-vu`: Tại mỗi nhóm dịch vụ và thanh CTA cuối trang đều có liên kết đối ứng: *"Xem bảng giá tham chiếu dịch vụ này"* $\to$ trỏ sang `/bang-gia?cat=[category-slug]`.
   - Trên `/bang-gia`: Tại tiêu đề và từng dòng accordion có liên kết: *"Xem chi tiết mô tả dịch vụ"* $\to$ cuộn hoặc dẫn về nhóm nội dung trên `/dich-vu`.
5. **Hướng chuyển đổi về `/dat-lich`:**
   - Mọi nút CTA chính trên cả hai trang đều điều hướng về `/dat-lich` với query parameter định hướng dịch vụ (ví dụ: `/dat-lich?service=kham-tong-quat`).

---

## 2. MỤC 2: ĐỊNH HƯỚNG NGHỆ THUẬT "VIBRANT EDITORIAL LUXURY" & HỆ THỐNG TOKEN

### 2.1. Ngôn ngữ thiết kế nhất quán
Hai trang Giai đoạn 3B tiếp tục kế thừa tuyệt đối nhận diện thương hiệu **Vibrant Editorial Luxury**:
- **Không biến trang Dịch vụ thành Dashboard:** Tránh bố cục thẻ vụn vặt, tránh icon ma trận vô hồn. Bố cục mang phong cách tạp chí y khoa cao cấp (*Medical Journal Spread*), kết hợp dải tiêu đề ấn tượng, đường phân cách hairline thanh lịch và khoảng trắng thở rộng rãi.
- **Trang Bảng giá tối ưu công năng nhưng chuẩn mực thẩm mỹ:** Khác với các bảng giá thương mại đại trà hoặc trang thương mại điện tử, Bảng giá Thú y Lê Sơn được thiết kế theo phong cách *Architectural Ledger* — bảng biểu tối giản, trang nhã, đường kẻ mảnh tinh tế, font số liệu rõ nét, dễ tra cứu trên màn hình nhỏ mà không cần zoom.

### 2.2. Kế thừa Design Tokens chuẩn (`src/styles/tokens.css`)
- **Typography:**
  - Tiêu đề chính (`h1`, `h2`, `h3`): Phông `Lora 600` (SemiBold, tự lưu trữ, `font-style: normal`). **Tuyệt đối không sử dụng Lora in nghiêng** để chống lỗi synthetic oblique.
  - Văn bản, nhãn, dữ liệu, bảng tra cứu: Phông `Be Vietnam Pro` (`400` cho nội dung, `500` cho metadata, `600` cho CTA/tiêu đề cột bảng giá, `700` cho số hotline và giá).
- **Màu sắc thương hiệu:**
  - **Màu nền:** Ivory ấm (`--color-bg-primary`: `#FBF7F1`) cho nền chính; Lavender phớt (`--color-bg-secondary`: `#F8F2F9`) cho các khối ghi chú quy trình và dải filter; Trắng tuyệt đối (`--color-bg-card`: `#FFFFFF`) cho các hàng bảng giá và khối accordion nổi.
  - **Màu chữ:** Plum đậm (`--color-plum-deep`: `#421247`) cho tiêu đề; Mận đen (`--color-fg-primary`: `#1A0A1C`) cho thân bài; Muted Plum (`--color-fg-muted`: `#554157`) đạt độ tương phản WCAG AA $> 4.5:1$ trên nền Ivory.
  - **Màu nhấn y tế & cấp cứu:** Plum chủ đạo (`--color-plum-primary`: `#5A1E5E`) cho CTA dịch vụ; Warm Orange (`--color-warm-orange`: `#C2560C`) dành riêng cho cảnh báo cấp cứu khẩn cấp 24/24.
- **Semantic Status Tokens cho Bảng giá:**
  - `FIXED` / `RANGE` (Đã niêm yết): Nền xanh ngọc nhạt (`--color-status-success-bg: #F0FDF4`), viền `#86EFAC`, chữ `#166534`.
  - `CONTACT` (Báo giá theo ca bệnh): Nền hổ phách nhạt (`--color-status-warning-bg: #FFFBEB`), viền `#FCD34D`, chữ `#92400E`.
  - `UNAVAILABLE` (Đang cập nhật biểu phí): Nền tím nhạt lavender (`#F3E8F5`), viền `rgba(90, 30, 94, 0.20)`, chữ `--color-plum-primary` (`#5A1E5E`).
- **Touch Target & Phản hồi tương tác:**
  - Mọi nút bấm, tab lọc, tiêu đề accordion đạt kích thước vùng chạm tối thiểu **$44 \times 44\text{px}$** trên mọi thiết bị di động.
  - Hiệu ứng chuyển trạng thái nhẹ nhàng (`transition: 200ms cubic-bezier(0.16, 1, 0.3, 1)`), hỗ trợ đầy đủ `prefers-reduced-motion`.

---

## 3. MỤC 3: ĐẶC TẢ CHI TIẾT TUYẾN TRANG `/dich-vu`

### 3.1. Phong cách & Cấu trúc trang
Trang `/dich-vu` là bức tranh toàn cảnh về năng lực y khoa và tinh thần phụng sự của Bệnh viện Thú y Lê Sơn. Trang gồm **6 khu vực nội dung (sections)** được bố trí theo dòng chảy tâm lý chủ nuôi:

```text
Trang /dich-vu
│
├── Section 1: Editorial Hero & Service Mission Anchor
├── Section 2: Quick Category Navigation Strip (Thanh nhảy danh mục nhanh)
├── Section 3: Bốn Khối Dịch Vụ Cốt Lõi (Core Medical Service Groups)
│   ├── Nhóm 1: Khám Lâm Sàng & Điều Trị Chuyên Sâu
│   ├── Nhóm 2: Chẩn Đoán Cận Lâm Sàng & Xét Nghiệm
│   ├── Nhóm 3: Chăm Sóc Nội Trú Y Tế 24/7
│   └── Nhóm 4: Vệ Sinh Y Tế & Spa Grooming Dịu Nhẹ
├── Section 4: Dải Tiếp Nhận Cấp Cứu Khẩn Cấp 24/24
├── Section 5: Hướng Dẫn & Lưu Ý Trước Khi Đưa Bé Đến Khám
└── Section 6: Editorial Dark CTA — Chuyển Tiếp Sang Bảng Giá & Đặt Lịch
```

### 3.2. Chi tiết từng Section trên `/dich-vu`

#### Section 1: Editorial Hero & Service Mission Anchor
- **Breadcrumb:** `Trang chủ` (`/`) `/` `Dịch vụ` (`aria-current="page"`).
- **Tiêu đề Eyebrow:** `HỆ THỐNG DỊCH VỤ Y TẾ THÚ CƯNG LÊ SƠN`.
- **Heading H1 (Lora 600):** `Chăm sóc chu toàn từ phòng khám đến khu nội trú`.
- **Đoạn dẫn chính (Be Vietnam Pro 400, 16px/24px):**
  > *"Chúng tôi hiểu rằng mỗi lần thú cưng thăm khám là một lần người bạn đồng hành cần sự dịu dàng và chuẩn xác cao nhất. Bệnh viện Thú y Lê Sơn xây dựng quy trình tiếp đón chu đáo, môi trường khử khuẩn an toàn và phác đồ điều trị được tư vấn minh bạch cùng chủ nuôi."*
- **Banner chính sách biên tập (Editorial Policy Banner):**
  - Nhãn: `[Thông báo chuẩn hóa danh mục]`
  - Nội dung: *"Các dịch vụ dưới đây mô tả năng lực y khoa và các dịch vụ thực tế phục vụ tại 101 Khuất Duy Tiến. Chi phí và quy trình kỹ thuật chi tiết sẽ được bác sĩ trao đổi cụ thể sau khi thăm khám lâm sàng."*

#### Section 2: Quick Category Navigation Strip (Thanh nhảy danh mục nhanh)
- Thanh tab tĩnh dạng pill bo góc nhẹ (`rounded-xl`), dính nhẹ dưới header trên mobile khi cuộn (`sticky top-[73px]`):
  - `Khám & Điều trị` (`#kham-dieu-tri`)
  - `Cận lâm sàng & Xét nghiệm` (`#can-lam-sang`)
  - `Nội trú 24/7` (`#noi-tru`)
  - `Spa Grooming` (`#spa-grooming`)
  - `Cấp cứu 24/24` (`#cap-cuu`)
- Hỗ trợ cuộn mượt (`scroll-behavior: smooth`) và cập nhật active indicator dựa trên `IntersectionObserver`.

#### Section 3: Bốn Khối Dịch Vụ Cốt Lõi (Core Medical Service Groups)

##### Nhóm 3.1: Khám Lâm Sàng & Phẫu Thuật Điều Trị (`#kham-dieu-tri`)
- **Bố cục:** *Asymmetric Editorial Split 7/5*.
- **Cột thông tin (7/12 cột):**
  - Nhãn phân nhóm: `NHÓM 01 — Y KHOA LÂM SÀNG`
  - Tiêu đề H2: `Thăm khám kỹ lưỡng, chẩn đoán đúng và điều trị tận gốc`
  - Mô tả: Quy trình thăm khám cẩn trọng từng chỉ số sinh tồn (thân nhiệt, nhịp tim, niêm mạc, kiểm tra cơ quan vận động). Bác sĩ giải thích cặn kẽ nguyên nhân và phác đồ dự kiến.
  - **Danh sách dịch vụ thành phần (dạng Hairline List):**
    1. *Khám lâm sàng tổng quát & sàng lọc sức khỏe định kỳ.* [VERIFIED]
    2. *Tiêm phòng vaccine & phòng ngừa ký sinh trùng nội/ngoại.* [VERIFIED]
    3. *Phẫu thuật ngoại khoa mô mềm & triệt sản an toàn.* [VERIFIED — Bác sĩ Sơn phụ trách]
    4. *Điều trị các bệnh lý nội khoa, tiêu hóa, hô hấp, da liễu.* [PENDING — Chuẩn hóa phác đồ]
  - Liên kết phụ trợ: `Tra cứu bảng giá khám & phẫu thuật ->` (`/bang-gia?cat=kham-dieu-tri`).
- **Cột minh họa (5/12 cột):**
  - Khung ảnh Editorial Photo Frame với ảnh chụp mèo/chó đang được thăm khám nhẹ nhàng.
  - Nhãn ảnh: `Ảnh minh họa dịch vụ khám lâm sàng — không chụp nhân sự không xác định`.

##### Nhóm 3.2: Chẩn Đoán Cận Lâm Sàng & Xét Nghiệm (`#can-lam-sang`)
- **Bố cục:** *Architectural Grid 3 cột*.
- **Nội dung:**
  - Nhãn phân nhóm: `NHÓM 02 — CHẨN ĐOÁN HÌNH ẢNH & XÉT NGHIỆM`
  - Tiêu đề H2: `Hỗ trợ chẩn đoán nhanh chóng và chuẩn xác`
  - 3 thẻ tính năng chuyên môn (Editorial Slot Box):
    - *Xét nghiệm huyết học & sinh hóa máu:* Kiểm tra chức năng gan, thận, đường huyết, điện giải. [Đề xuất cấu hình xét nghiệm]
    - *Chẩn đoán hình ảnh kỹ thuật số (X-quang / Siêu âm):* Tầm soát dị vật tiêu hóa, kiểm tra tổn thương xương khớp và ổ bụng. [Đề xuất cấu hình thiết bị]
    - *Xét nghiệm ký sinh trùng & soi da:* Xác định nguyên nhân viêm da, nấm, ghẻ vi thể. [Đề xuất quy trình]
  - Liên kết phụ trợ: `Xem bảng giá xét nghiệm tham chiếu ->` (`/bang-gia?cat=xet-nghiem`).

##### Nhóm 3.3: Chăm Sóc Nội Trú Y Tế 24/7 (`#noi-tru`)
- **Bố cục:** *Lavender Full-width Container*.
- **Nội dung:**
  - Nhãn phân nhóm: `NHÓM 03 — LƯU TRÚ Y TẾ CHUYÊN BIỆT`
  - Tiêu đề H2: `Khu nội trú yên tĩnh, kiểm soát lây nhiễm nghiêm ngặt`
  - Nguyên tắc vận hành:
    - *Phân khu cách ly:* Khu nội trú bệnh truyền nhiễm tách biệt tuyệt đối khỏi khu hồi sức sau mổ và khu thú cưng khỏe mạnh.
    - *Theo dõi liên tục:* Đội ngũ trực đêm theo dõi sinh hiệu, hỗ trợ truyền dịch và cấp thuốc đúng giờ.
    - *Cập nhật tình hình:* Thông báo định kỳ tình trạng ăn uống, bài tiết và phục hồi cho chủ nuôi. *(Không hiển thị y lệnh nội bộ trên cổng khách hàng).*
  - Liên kết phụ trợ: `Xem biểu phí nội trú lưu chuồng ->` (`/bang-gia?cat=noi-tru`).

##### Nhóm 3.4: Vệ Sinh Y Tế & Spa Grooming (`#spa-grooming`)
- **Bố cục:** *Editorial Split 6/6*.
- **Nội dung:**
  - Nhãn phân nhóm: `NHÓM 04 — SPA & CHĂM SÓC THẨM MỸ`
  - Tiêu đề H2: `Vệ sinh êm ái, làm đẹp dịu nhẹ cho bé cưng`
  - Mô tả: Sử dụng các dòng sữa tắm trị liệu phù hợp từng loại da lông. Quy trình vệ sinh móng, tai, vắt tuyến hôi thực hiện cẩn trọng, không gây căng thẳng tâm lý cho thú cưng.
  - Các gói dịch vụ: Tắm vệ sinh tiêu chuẩn, Cắt tỉa tạo hình thẩm mỹ, Tắm trị liệu nấm/ve rận theo chỉ định bác sĩ.
  - Liên kết phụ trợ: `Xem bảng giá dịch vụ spa grooming ->` (`/bang-gia?cat=spa`).

#### Section 4: Dải Tiếp Nhận Cấp Cứu Khẩn Cấp 24/24 (`#cap-cuu`)
- **Phong cách:** Kế thừa dải Cấp cứu Warm Orange đã nghiệm thu tại Section 3 Trang chủ.
- **Nội dung:**
  - Biểu tượng `ShieldAlert` màu cam ấm nổi bật trên nền gradient `from-amber-50 to-orange-50`.
  - Tiêu đề: `Tiếp nhận Cấp Cứu Thú Cưng 24/24 tại 101 Khuất Duy Tiến`.
  - Hướng dẫn dấu hiệu khẩn cấp: Khó thở, co giật, nuốt dị vật, ngộ độc, chấn thương giao thông hoặc xuất huyết.
  - Nút bấm trực tiếp: `Gọi Cấp cứu: 097 355 51 05` (`tel:0973555105`).

#### Section 5: Hướng Dẫn & Lưu Ý Trước Khi Đưa Bé Đến Khám
- **Bố cục:** *Architectural Numbered Triptych 01–03*.
- **Mục đích y khoa:** Giúp chủ nuôi chuẩn bị tốt nhất, đảm bảo tính chính xác của xét nghiệm và an toàn khi di chuyển:
  1. *Lưu ý 01 — Nhịn ăn đối với xét nghiệm máu hoặc phẫu thuật:* Khuyến cáo nhịn ăn từ 6–8 tiếng trước khi làm xét nghiệm sinh hóa máu hoặc phẫu thuật gây mê (trừ trường hợp khẩn cấp).
  2. *Lưu ý 02 — Vận chuyển an toàn:* Sử dụng lồng vận chuyển (cát/chó nhỏ) hoặc dây xích an toàn để tránh thú cưng hoảng sợ, chạy thoát hoặc va chạm với các bé khác tại phòng chờ.
  3. *Lưu ý 03 — Mang theo sổ y bạ & thông tin thuốc:* Cung cấp lịch sử tiêm phòng, sổ tiêm hoặc các loại thuốc/thực phẩm thú cưng đang dùng để bác sĩ có dữ liệu chẩn đoán nhanh chóng.

#### Section 6: Editorial Dark CTA — Chuyển Tiếp Sang Bảng Giá & Đặt Lịch
- **Phong cách:** Kế thừa component `EditorialDarkCTA` trên nền Deep Plum (`--color-bg-dark: #421247`).
- **Nội dung:**
  - Tiêu đề: `Bạn cần tư vấn dịch vụ phù hợp cho bé?`
  - Mô tả: `Đội ngũ Bệnh viện Thú y Lê Sơn luôn sẵn sàng lắng nghe tình trạng của bé và hỗ trợ sắp xếp lịch khám chu đáo nhất.`
  - Cặp nút hành động:
    - Nút 1 (Primary Plum/White): `Đặt lịch khám online` trỏ sang `/dat-lich`.
    - Nút 2 (Outline White): `Xem bảng giá dịch vụ` trỏ sang `/bang-gia`.

---

## 4. MỤC 4: ĐẶC TẢ CHI TIẾT TUYẾN TRANG `/bang-gia`

### 4.1. Định hướng trải nghiệm (UX Philosophy)
Trang `/bang-gia` là công cụ minh bạch thông tin cốt lõi giúp chủ nuôi an tâm trước khi đưa thú cưng đi khám. Thiết kế tuân thủ các nguyên tắc:
1. **Minh bạch và thực tế:** Y tế thú y có tính chất cá thể hóa cao (tùy thuộc cân nặng, độ tuổi, mức độ nhiễm khuẩn). Do đó bảng giá cần giải thích rõ bản chất chi phí tham chiếu, tránh tạo cam kết cứng nhắc gây tranh chấp.
2. **Không giá giả — Không số liệu mô phỏng công khai:** Tuyệt đối không đưa số tiền tự bịa đặt vào giao diện. Các mục chưa có số liệu được hiển thị dưới nhãn trung tính `Đang cập nhật biểu phí niêm yết` hoặc `Báo giá sau khám lâm sàng`.
3. **Tra cứu siêu tốc & Lọc thông minh:** Cho phép tìm kiếm tức thời bằng thanh search và tab lọc danh mục không tải lại trang.

```text
Trang /bang-gia
│
├── Section 1: Page Heading & Price Policy Disclaimer Banner
├── Section 2: Search & Filter Toolbar (Tìm kiếm & Tab danh mục)
├── Section 3: Bảng Biểu Phí Dạng Accordion Có Cấu Trúc (Structured Price Accordion)
│   ├── Nhóm 1: Khám Lâm Sàng & Thủ Thuật Cơ Bản
│   ├── Nhóm 2: Cận Lâm Sàng, Chẩn Đoán Hình Ảnh & Xét Nghiệm
│   ├── Nhóm 3: Phẫu Thuật Ngoại Khoa & Triệt Sản
│   ├── Nhóm 4: Chăm Sóc Nội Trú Y Tế 24/7
│   └── Nhóm 5: Dịch Vụ Vệ Sinh & Spa Grooming
├── Section 4: Hướng Dẫn Quy Trình Tiếp Nhận & Báo Giá Minh Bạch (3 Bước)
└── Section 5: Editorial Dark CTA — Đặt Hẹn & Tư Vấn Chi Phí
```

### 4.2. Chi tiết từng Section trên `/bang-gia`

#### Section 1: Page Heading & Price Policy Disclaimer Banner
- **Breadcrumb:** `Trang chủ` (`/`) `/` `Dịch vụ` (`/dich-vu`) `/` `Bảng giá niêm yết` (`aria-current="page"`).
- **Tiêu đề Eyebrow:** `MINH BẠCH CHI PHÍ Y TẾ THÚ CƯNG`.
- **Heading H1 (Lora 600):** `Bảng giá dịch vụ & biểu phí tham chiếu`.
- **Đoạn dẫn chính:**
  > *"Bệnh viện Thú y Lê Sơn cam kết thông báo rõ ràng mọi chi phí dự kiến trước khi tiến hành điều trị. Chúng tôi tôn trọng quyền đồng thuận của chủ nuôi đối với từng bước trong phác đồ y khoa."*
- **Banner quy định biến động giá y khoa (Price Policy Banner):**
  - Khung viền mảnh màu Lavender/Border-medium, nền Ivory ấm (`bg-amber-50/60 border-amber-200/80`).
  - Biểu tượng thông tin `Info`.
  - **Nội dung xác minh:**
    - *"1. Chi phí y tế có thể thay đổi tùy theo cân nặng, giống loài, tiền sử bệnh và mức độ nghiêm trọng thực tế của ca bệnh."*
    - *"2. Bác sĩ luôn trao đổi cặn kẽ và lập phiếu dự toán chi phí trước khi thực hiện phẫu thuật, can thiệp chuyên sâu hoặc tiếp nhận nội trú."*
    - *"3. Dịch vụ cấp cứu đêm và ngày lễ có thể áp dụng phụ phí phục vụ ngoài giờ y tế theo quy chế phòng khám."*

#### Section 2: Search & Filter Toolbar (Tìm kiếm & Tab danh mục)
- **Thanh tìm kiếm (Accessible Search Input):**
  - Ô nhập liệu dạng thanh mảnh, bo góc nhẹ (`rounded-xl`), có icon kính lúp (`Search`), nút xóa nhanh (`X`) khi có chữ.
  - Placeholder: `Tìm tên dịch vụ, xét nghiệm, gói spa (ví dụ: siêu âm, triệt sản, tắm dưỡng...)...`
  - Nhãn ẩn hỗ trợ đọc màn hình: `aria-label="Tìm kiếm dịch vụ trong bảng giá"`.
  - Cơ chế tìm kiếm: Khớp chuỗi không dấu (chữ thường, chữ hoa tiếng Việt), lọc đồng thời theo tên và mô tả dịch vụ.
- **Thanh phân loại (Category Filter Tabs):**
  - Danh sách tab dạng horizontal scrollable pills trên mobile:
    1. `Tất cả dịch vụ` (`all`)
    2. `Khám & Thủ thuật` (`kham-thu-thuat`)
    3. `Xét nghiệm & Cận lâm sàng` (`xet-nghiem`)
    4. `Phẫu thuật ngoại khoa` (`phau-thuat`)
    5. `Nội trú 24/7` (`noi-tru`)
    6. `Spa & Grooming` (`spa`)
  - Hiển thị số lượng mục khớp điều kiện bên cạnh tab (ví dụ: `Khám & Thủ thuật (4)`).
  - Trạng thái Active: Nền Plum (`--color-plum-primary`), chữ trắng, viền rõ.
  - Trạng thái Inactive: Nền trắng (`--color-bg-card`), viền mảnh (`--color-border-medium`), chữ `--color-fg-muted`.

#### Section 3: Bảng Biểu Phí Dạng Accordion Có Cấu Trúc
Bảng giá được chia thành các nhóm danh mục. Mỗi dịch vụ là một hàng accordion tương tác (`ServicePriceRow`):
- **Cấu trúc hàng hiển thị tóm tắt (Accordion Trigger Header):**
  - Cột 1 (Trái): Tên dịch vụ (Be Vietnam Pro 600, 15px) + Nhãn phân loại nhỏ.
  - Cột 2 (Giữa): Đơn vị tính (Ví dụ: `Lần`, `Ngày`, `Ca`).
  - Cột 3 (Phải): Khung hiển thị giá / Trạng thái giá:
    - Nếu `FIXED`: Hiển thị số tiền kèm `VNĐ` (Ví dụ: `150.000 VNĐ`). *(Chỉ hiển thị khi có dữ liệu thật đã xác minh)*.
    - Nếu `RANGE`: Hiển thị khoảng giá (Ví dụ: `300.000 – 600.000 VNĐ`). *(Chỉ hiển thị khi có dữ liệu thật đã xác minh)*.
    - Nếu `CONTACT`: Badge hổ phách `Báo giá sau khám lâm sàng`.
    - Nếu `UNAVAILABLE`: Badge tím nhạt `Đang cập nhật biểu phí niêm yết`.
  - Icon mũi tên xoay `ChevronDown` báo hiệu trạng thái mở rộng.
- **Cấu trúc nội dung mở rộng (Accordion Panel Content):**
  - Khi người dùng click hoặc ấn phím Space/Enter, panel bung mở:
    - *Bao gồm trong dịch vụ:* Mô tả chi tiết những bước thực hiện trong dịch vụ (Ví dụ: đo sinh hiệu, tư vấn dinh dưỡng, sổ khám bệnh).
    - *Ghi chú y khoa & điều kiện áp dụng:* Lưu ý cân nặng, chế độ theo dõi sau thủ thuật.
    - *Nút hành động nhanh:* Nút nhỏ `Đặt lịch dịch vụ này` trỏ sang `/dat-lich?service=[service-slug]`.

#### Section 4: Hướng Dẫn Quy Trình Tiếp Nhận & Báo Giá Minh Bạch
- **Bố cục:** *Architectural Hairline Ledger 3 Bước (01 — 02 — 03)*:
  - `Bước 01 — Thăm khám & Khảo sát lâm sàng:` Bác sĩ tiến hành kiểm tra tổng quát thể trạng của bé và lắng nghe phản ánh từ chủ nuôi.
  - `Bước 02 — Tư vấn phác đồ & Báo giá chi tiết:` Đưa ra các phương án điều trị cần thiết, giải thích mục đích từng chỉ định và cung cấp bảng dự toán chi phí trọn gói.
  - `Bước 03 — Thực hiện điều trị theo đồng thuận:` Bệnh viện chỉ tiến hành các thủ thuật y tế khi có sự thống nhất hoàn toàn của chủ nuôi. Không phát sinh chi phí ngoài dự toán nếu không có trao đổi trước.

#### Section 5: Editorial Dark CTA — Đặt Hẹn & Tư Vấn Chi Phí
- Khối CTA nền Deep Plum (`--color-bg-dark: #421247`) tiếp sức cho chủ nuôi:
  - Tiêu đề: `Bạn cần tư vấn chi phí cụ thể cho trường hợp của bé?`
  - Mô tả: `Liên hệ hotline hoặc gửi thông tin để được bác sĩ trực trao đổi sơ bộ tình trạng và hướng dẫn chuẩn bị.`
  - Nút chính: `Đăng ký lịch khám ngay` (`/dat-lich`) & Nút gọi: `Hotline: 097 355 51 05` (`tel:0973555105`).

---

## 5. MỤC 5: KIẾN TRÚC CÔ LẬP BUNDLE, HIỆU NĂNG & NGĂN NGỪA CLS

### 5.1. Kiến trúc phân tách Bundle theo Architecture Baseline V1
- Theo quy chế `AGENTS.md`, hai trang `/dich-vu` và `/bang-gia` thuộc **Public Website**, được phân tách bundle độc lập bằng `React.lazy()`:
  ```tsx
  const ServicesPage = lazy(() => import('@/pages/ServicesPage'))
  const PricingPage = lazy(() => import('@/pages/PricingPage'))
  ```
- **Cô lập hoàn toàn khỏi Portal nội bộ:** Tuyệt đối không import bất kỳ component hay logic nào của `/tai-khoan/*` (Customer Portal) hoặc `/quan-ly/*` (Staff Portal) vào bundle của 3B.
- Giữ nguyên `PageLoadingFallback` với `min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]` và `role="status"` đã được nghiệm thu tại DEV-01 Fix 01 nhằm bảo đảm **CLS = 0.000**.

### 5.2. Biện pháp kỹ thuật loại trừ triệt để CLS trên `/bang-gia`
Trang bảng giá có đặc thù tương tác lọc và tìm kiếm động dễ gây dịch chuyển bố cục (layout shift). Blueprint đặt ra 4 quy tắc chống CLS:
1. **Khung chứa danh sách có `min-height` dự phòng:** Khi lọc hoặc tìm kiếm, vùng danh sách dịch vụ luôn giữ một chiều cao tối thiểu (`min-h-[400px]`), tránh hiện tượng Footer bị giật lên vị trí giữa màn hình rồi bị đẩy xuống.
2. **Animation Accordion dùng CSS Grid Frac / Max-Height có kiểm soát:** Chuyển động đóng/mở panel dùng `grid-template-rows: 0fr -> 1fr` hoặc `max-height` mượt mà, không thay đổi padding của container bên ngoài.
3. **Thanh tìm kiếm và tabs cố định kích thước:** Chiều cao của Toolbar tìm kiếm được định hình bằng hằng số cố định (`h-12` = 48px), không co giãn khi nhập liệu.
4. **Trạng thái không có kết quả (Empty State) giữ chỗ cân đối:** Khung thông báo không tìm thấy kết quả có chiều cao tương đương 3 hàng bảng giá (~240px), không làm biến dạng khoảng cách đến Section tiếp theo.

---

## 6. MỤC 6: MA TRẬN TRẠNG THÁI DỮ LIỆU & QUY TẮC KHÓA NỘI DUNG (CONTENT LOCK)

Bảo toàn tính trung thực thông tin theo nguyên tắc: **Không biến dữ liệu thiết kế/mô phỏng thành dữ liệu thật khi chưa có phê duyệt.**

| Phân loại nội dung | Trạng thái xác minh | Quy tắc hiển thị trên giao diện công khai | Nguồn kiểm chứng / Căn cứ |
|---|---|---|---|
| **Tên bệnh viện, địa chỉ, hotline, giờ mở cửa** | **VERIFIED** | Hiển thị chính thức: `101 Khuất Duy Tiến`, `097 355 51 05`, `08:00 – 21:00`, `Cấp cứu 24/24` | Trực tiếp chủ dự án xác nhận ngày 26/10/2026 |
| **Bác sĩ phụ trách chuyên môn (BS. Lê Thái Sơn)** | **VERIFIED** (Họ tên) | Hiển thị chính thức họ tên. Chức danh/bằng cấp giữ ở mức PENDING nếu chưa nộp văn bằng. | Chủ dự án xác nhận |
| **4 Nhóm dịch vụ chính (Khám, Cận lâm sàng, Nội trú, Spa)** | **VERIFIED** (Định hướng) | Hiển thị như 4 giải pháp chăm sóc sức khỏe chính của phòng khám. | Homepage Section 3 đã nghiệm thu |
| **Danh mục dịch vụ kỹ thuật chi tiết** | **PENDING** | Hiển thị kèm nhãn: `[Danh mục chuẩn hóa theo hướng dẫn bác sĩ]`. | Chờ chủ dự án & BS. Sơn đối chiếu danh mục |
| **Giá tiền cụ thể (Số VNĐ)** | **PENDING / UNAVAILABLE** | **TUYỆT ĐỐI KHÔNG HIỂN THỊ SỐ TIỀN MÔ PHỎNG**. Hiển thị nhãn trung tính: `Đang cập nhật biểu phí niêm yết` hoặc `Báo giá sau khám lâm sàng`. | Chờ chủ dự án ban hành biểu phí chính thức |
| **Hình ảnh minh họa dịch vụ** | **ILLUSTRATIVE** | Chỉ dùng ảnh thú cưng/không gian ấm áp. Bắt buộc có nhãn `Ảnh minh họa dịch vụ`. Tuyệt đối không dùng ảnh stock người mặc áo blouse. | Quy định AP-1 & Claude QA 3A |
| **Cam kết y khoa, phác đồ điều trị** | **PENDING** | Không đưa ra tuyên bố tuyệt đối ("chữa khỏi 100%", "thiết bị hiện đại nhất"). Chỉ dùng ngôn ngữ trách nhiệm và cẩn trọng y khoa. | Quy tắc an toàn y tế |

---

## 7. MỤC 7: DANH MỤC QUYẾT ĐỊNH CẦN CHỦ DỰ ÁN PHÊ DUYỆT TRƯỚC DEV-01

Trước khi Antigravity được cấp quyền chuyển sang giai đoạn lập trình (DEV-01), chủ dự án cần cho ý kiến phê duyệt đối với các quyết định sau:

1. **Quyết định 3B-DEC-01 (Biểu phí tham chiếu):** Chủ dự án muốn cung cấp một bảng giá niêm yết rút gọn gồm các dịch vụ cơ bản đã có giá cố định (ví dụ: công khám, tiêm vaccine dại, tắm spa theo cân nặng), hay tiếp tục giữ trạng thái `Đang cập nhật biểu phí niêm yết` / `Báo giá sau khám` cho toàn bộ danh mục trong bản Preview đầu tiên?
2. **Quyết định 3B-DEC-02 (Điều hướng dịch vụ con):** Thống nhất phương án điều hướng các mục con của menu Header (`/dich-vu/kham-dieu-tri`, `/dich-vu/noi-tru`...) nhảy trực tiếp về các thẻ neo tương ứng trên `/dich-vu` (`/dich-vu#kham-dieu-tri`) thay vì giữ trang `ComingSoonView` riêng lẻ.
3. **Quyết định 3B-DEC-03 (Chính sách giá ngoài giờ cấp cứu):** Xác nhận có đưa dòng ghi chú về phụ phí phục vụ cấp cứu đêm/ngày lễ vào bảng giá hay không.

---

**KẾT THÚC BẢN THIẾT KẾ CHI TIẾT 3B-00 (BLUEPRINT V1.0)**
