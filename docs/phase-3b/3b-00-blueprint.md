# HỒ SƠ THIẾT KẾ CHI TIẾT GIAI ĐOẠN 3B — PHIÊN BẢN V1.2 (PHASE 3B-00 BLUEPRINT)
## Bệnh viện Thú y Lê Sơn 2026 — Kiến Trúc Tuyến Trang Dịch Vụ & Bảng Giá Niêm Yết

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Giai đoạn** | **3B-00: DOCUMENTATION & BLUEPRINT SPECIFICATION ONLY** |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 044-A**; `AGENTS.md` (Architecture Baseline V1); `PROJECT_BRIEF.md`; Báo cáo Claude QA Fix 01 `docs/qa/3b-00-fix01-qa.md` (Commit: `b9f386b`) |
| **Mã nguồn cơ sở 3A** | Commit `4739d45cc95100b587381b6bdcad6935352b23e8` (Nghiệm thu có điều kiện) |
| **Tác giả thiết kế** | Antigravity — UX Architect & Documentation Owner |
| **Thẩm định độc lập** | Claude — Independent QA Lead |
| **Phạm vi tuyến trang** | **1. `/dich-vu`** (Trang tổng hợp dịch vụ y tế & chăm sóc)<br>**2. `/bang-gia`** (Trang biểu phí & bảng giá niêm yết tham chiếu) |
| **Giới hạn nghiêm ngặt** | **TUYỆT ĐỐI KHÔNG mở trang chi tiết `/dich-vu/:slug` trong giai đoạn này**.<br>Không sửa source code, không sửa CSS, không can thiệp dependencies, không deploy Vercel, không merge `main`. |
| **Trạng thái tài liệu** | **CHỜ CHỦ DỰ ÁN PHÊ DUYỆT (PENDING OWNER APPROVAL) — NO CODE IMPLEMENTATION** |

---

## MỤC LỤC

1. [Mục 1: Sitemap & Cấu Trúc Điều Hướng Giai Đoạn 3B](#1-muc-1-sitemap--cau-truc-dieu-huong-giai-doan-3b)
2. [Mục 2: Định Hướng Nghệ Thuật "Vibrant Editorial Luxury" & Hệ Thống Token](#2-muc-2-dinh-huong-nghe-thuat-vibrant-editorial-luxury--he-thong-token)
3. [Mục 3: Taxonomy Chuẩn Hóa Duy Nhất Cho Giai Đoạn 3B](#3-muc-3-taxonomy-chuan-hoa-duy-nhat-cho-giai-doan-3b)
4. [Mục 4: Đặc Tả Chi Tiết Tuyến Trang `/dich-vu`](#4-muc-4-dac-ta-chi-tiet-tuyen-trang-dich-vu)
5. [Mục 5: Đặc Tả Chi Tiết Tuyến Trang `/bang-gia`](#5-muc-5-dac-ta-chi-tiet-tuyen-trang-bang-gia)
6. [Mục 6: Kiến Trúc Cô Lập Bundle, Hiệu Năng & Ngăn Ngừa CLS](#6-muc-6-kien-truc-co-lap-bundle-hieu-nang--ngan-ngua-cls)
7. [Mục 7: Đặc Tả SEO Metadata Gate Cho Hai Tuyến Đường](#7-muc-7-dac-ta-seo-metadata-gate-cho-hai-tuyen-duong)
8. [Mục 8: Khung Kiểm Soát Bằng Chứng & Khóa Nội Dung (Content Lock)](#8-muc-8-khung-kiem-soat-bang-chung--khoa-noi-dung-content-lock)
9. [Mục 9: Danh Mục Phụ Thuộc Ngoài Phạm Vi (Out-of-Scope Dependencies)](#9-muc-9-danh-muc-phu-thuoc-ngoai-pham-vi-out-of-scope-dependencies)
10. [Mục 10: Danh Mục 13 Quyết Định Mở Cần Chủ Dự Án Phê Duyệt (OPEN DECISIONS)](#10-muc-10-danh-muc-13-quyet-dinh-mo-can-chu-du-an-phe-duyet-open-decisions)

---

## 1. MỤC 1: SITEMAP & CẤU TRÚC ĐIỀU HƯỚNG GIAI ĐOẠN 3B

### 1.1. Phạm vi tuyến đường trong Giai đoạn 3B
Giai đoạn 3B chỉ bao gồm đúng **hai (02) tuyến đường công khai**:
- `/dich-vu`: Trang tổng quan toàn bộ hệ thống giải pháp y tế, xét nghiệm, phẫu thuật, chăm sóc nội trú và spa grooming.
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
├── /dat-lich (Đích đến chuyển đổi cho CTA chính của 3B — Giữ nguyên component Mốc 2B)
│
└── [NGOÀI PHẠM VI 3B — KHÓA TUYỆT ĐỐI]:
    ├── /dich-vu/:slug (Chưa triển khai — Chờ phê duyệt ở giai đoạn sau)
    ├── /cau-chuyen & /cau-chuyen/:slug (Giai đoạn sau)
    ├── /goc-thu-cung & /bai-viet/:slug (Giai đoạn sau)
    ├── /san-pham (Giai đoạn sau)
    ├── /tai-khoan/* (Customer Portal — Giai đoạn 4)
    └── /quan-ly/* (Staff Portal — Giai đoạn 4)
```

### 1.2. Mối liên kết điều hướng hiện hữu và phương án mặc định không sửa code
1. **Liên kết hiện hữu trên Website (Mốc 2B):**
   - Header hiện đang trỏ tới `/dich-vu` (mục "Tất cả dịch vụ"), `/bang-gia` (mục "Bảng giá niêm yết"), và 4 route con tĩnh dạng placeholder: `/dich-vu/kham-dieu-tri`, `/dich-vu/noi-tru`, `/dich-vu/spa`, `/dich-vu/cap-cuu`.
   - Trang chủ Section 3 (`FeaturedServices`): Nút "Xem tất cả dịch vụ" trỏ về `/dich-vu`.
   - Footer: Liên kết trỏ về `/dich-vu` và `/bang-gia`.
2. **Phương án mặc định (Zero Code Modification):**
   - Giữ nguyên 100% mã nguồn Header, Footer, và 4 route ComingSoon con trong giai đoạn 3B-00.
   - Đề xuất chuyển 4 liên kết con sang anchor thẻ neo (`/dich-vu#kham-dieu-tri`, v.v.) được ghi nhận chính thức là **OPEN DECISION 3B-DEC-02**, chỉ triển khai khi chủ dự án phê duyệt nhiệm vụ cập nhật điều hướng riêng.

---

## 2. MỤC 2: ĐỊNH HƯỚNG NGHỆ THUẬT "VIBRANT EDITORIAL LUXURY" & HỆ THỐNG TOKEN

### 2.1. Ngôn ngữ thiết kế nhất quán
Hai trang Giai đoạn 3B tiếp tục kế thừa tuyệt đối nhận diện thương hiệu **Vibrant Editorial Luxury**:
- **Không biến trang Dịch vụ thành Dashboard:** Tránh bố cục thẻ vụn vặt, tránh icon ma trận vô hồn. Bố cục mang phong cách tạp chí y khoa cao cấp (*Medical Journal Spread*), kết hợp dải tiêu đề ấn tượng, đường phân cách hairline thanh lịch và khoảng trắng thở rộng rãi.
- **Trang Bảng giá tối ưu công năng nhưng chuẩn mực thẩm mỹ:** Thiết kế theo phong cách *Architectural Ledger* — bảng biểu tối giản, trang nhã, đường kẻ mảnh tinh tế, font số liệu rõ nét, dễ tra cứu trên màn hình nhỏ mà không cần zoom.

### 2.2. Kế thừa Design Tokens chuẩn (`src/styles/tokens.css`)
- **Typography:**
  - Tiêu đề chính (`h1`, `h2`, `h3`): Phông `Lora 600` (SemiBold, tự lưu trữ, `font-style: normal`). **Tuyệt đối không sử dụng Lora in nghiêng** để chống lỗi synthetic oblique.
  - Văn bản, nhãn, dữ liệu, bảng tra cứu: Phông `Be Vietnam Pro` (`400` cho nội dung, `500` cho metadata, `600` cho CTA/tiêu đề cột bảng giá, `700` cho số hotline).
- **Màu sắc theo đúng Token CSS (Không dùng class màu Tailwind tùy tiện):**
  - **Màu nền:** Ivory ấm (`var(--color-bg-primary)`: `#FBF7F1`) cho nền chính; Lavender phớt (`var(--color-bg-secondary)`: `#F8F2F9`) cho khối phụ; Trắng (`var(--color-bg-card)`: `#FFFFFF`) cho hàng bảng giá.
  - **Màu chữ:** Plum đậm (`var(--color-plum-deep)`: `#421247`) cho tiêu đề; Mận đen (`var(--color-fg-primary)`: `#1A0A1C`) cho thân bài; Muted Plum (`var(--color-fg-muted)`: `#554157`) đạt độ tương phản WCAG AA $> 4.5:1$.
  - **Màu nhấn y tế & cấp cứu:** Plum chủ đạo (`var(--color-plum-primary)`: `#5A1E5E`) cho CTA dịch vụ; Warm Orange (`var(--color-warm-orange)`: `#C2560C`) dành riêng cho cảnh báo cấp cứu khẩn cấp 24/24.
- **Semantic Status Tokens cho Bảng giá:**
  - `FIXED` / `RANGE` (Đã niêm yết): Nền `var(--color-status-success-bg)` (`#F0FDF4`), viền `var(--color-status-success-border)` (`#86EFAC`), chữ `var(--color-status-success-text)` (`#166534`).
  - `CONTACT` (Báo giá theo ca bệnh): Nền `var(--color-status-warning-bg)` (`#FFFBEB`), viền `var(--color-status-warning-border)` (`#FCD34D`), chữ `var(--color-status-warning-text)` (`#92400E`).
  - `UNAVAILABLE` (Đang cập nhật biểu phí): Nền `var(--color-bg-secondary)` (`#F8F2F9`), viền `var(--color-border-medium)` (`rgba(90, 30, 94, 0.22)`), chữ `var(--color-plum-primary)` (`#5A1E5E`).
- **Touch Target & Phản hồi tương tác:**
  - Mọi nút bấm, tab lọc, tiêu đề accordion đạt kích thước vùng chạm tối thiểu **$44 \times 44\text{px}$** trên mọi thiết bị di động.
  - Hiệu ứng chuyển trạng thái nhẹ nhàng (`transition: 200ms cubic-bezier(0.16, 1, 0.3, 1)`), hỗ trợ đầy đủ `prefers-reduced-motion`.

---

## 3. MỤC 3: TAXONOMY CHUẨN HÓA DUY NHẤT CHO GIAI ĐOẠN 3B

Nhằm khắc phục triệt để lỗi lệch nhóm và lệch slug giữa các trang (3B00-P2-1), tài liệu thiết lập một **bộ danh mục chuẩn hóa duy nhất** gồm 5 nhóm dịch vụ được đề xuất sử dụng đồng bộ trên `/dich-vu`, `/bang-gia`, Content Mapping và Data Schema:

| STT | Category ID | URL Slug | Tên nhóm danh mục đề xuất | Phạm vi chuyên môn dự kiến | Trạng thái xác minh |
|:---:|---|---|---|---|---|
| **01** | `cat-kham-dieu-tri` | `kham-dieu-tri` | **Khám & Điều trị lâm sàng** | Khám tổng quát, sàng lọc, tiêm phòng, điều trị nội khoa | `PROPOSED / PENDING` |
| **02** | `cat-can-lam-sang` | `can-lam-sang` | **Chẩn đoán cận lâm sàng & Xét nghiệm** | Xét nghiệm huyết học, sinh hóa, X-quang, siêu âm, soi da | `PROPOSED / PENDING` |
| **03** | `cat-phau-thuat` | `phau-thuat` | **Phẫu thuật ngoại khoa & Triệt sản** | Triệt sản an toàn chó mèo, tiểu phẫu, xử lý vết thương | `PROPOSED / PENDING` |
| **04** | `cat-noi-tru` | `noi-tru` | **Chăm sóc nội trú y tế 24/7** | Lưu trú chăm sóc y tế theo dõi [Chờ xác nhận danh mục] | `PROPOSED / PENDING` |
| **05** | `cat-spa-grooming` | `spa-grooming` | **Vệ sinh y tế & Spa Grooming** | Tắm vệ sinh tiêu chuẩn, cắt tỉa thẩm mỹ, tắm trị liệu da | `PROPOSED / PENDING` |

*Ghi chú quan trọng:* 
- Khối **Tiếp nhận Cấp cứu 24/24** được xác định là **Dải thông tin khẩn cấp / Gateway Bar** với thẻ neo `#cap-cuu`, không xếp vào nhóm danh mục biểu phí thương mại thông thường.
- Cả 5 nhóm danh mục trên mang trạng thái **`PROPOSED / PENDING`** và được ghi nhận chính thức tại **OPEN DECISION 3B-DEC-05** để chờ chủ dự án phê duyệt trước khi code.
- Tuyệt đối không hardcode số lượng dịch vụ cố định (ví dụ: "Tất cả (24)") trên giao diện khi chưa có dữ liệu thật.

---

## 4. MỤC 4: ĐẶC TẢ CHI TIẾT TUYẾN TRANG `/dich-vu`

### 4.1. Cấu trúc tổng thể
Trang `/dich-vu` gồm **6 khu vực nội dung (sections)** được bố trí theo dòng chảy thông tin:

```text
Trang /dich-vu
│
├── Section 1: Editorial Hero & Service Mission Anchor
├── Section 2: Quick Category Jump Bar (Thanh nhảy danh mục nhanh)
├── Section 3: Năm Khối Dịch Vụ Cốt Lõi (Core Service Groups)
│   ├── Khối 3.1: Khám & Điều trị lâm sàng (#kham-dieu-tri)
│   ├── Khối 3.2: Chẩn đoán cận lâm sàng & Xét nghiệm (#can-lam-sang)
│   ├── Khối 3.3: Phẫu thuật ngoại khoa & Triệt sản (#phau-thuat)
│   ├── Khối 3.4: Chăm sóc nội trú y tế 24/7 (#noi-tru)
│   └── Khối 3.5: Vệ sinh y tế & Spa Grooming (#spa-grooming)
├── Section 4: Dải Tiếp Nhận Cấp Cứu Khẩn Cấp 24/24 (#cap-cuu)
├── Section 5: Hướng Dẫn & Lưu Ý Trước Khi Đưa Bé Đến Khám
└── Section 6: Editorial Dark CTA — Chuyển Tiếp Sang Bảng Giá & Đặt Lịch
```

### 4.2. Chi tiết từng Section trên `/dich-vu`

#### Section 1: Editorial Hero & Service Mission Anchor
- **Breadcrumb:** `Trang chủ` (`/`) `/` `Dịch vụ` (`aria-current="page"`).
- **Tiêu đề Eyebrow:** `HỆ THỐNG DỊCH VỤ Y TẾ THÚ CƯNG LÊ SƠN`.
- **Heading H1 (Lora 600):** `Chăm sóc chu toàn từ phòng khám đến khu nội trú`.
- **Đoạn dẫn chính:**
  > *"Chúng tôi hiểu rằng mỗi lần thú cưng thăm khám là một lần người bạn đồng hành cần sự dịu dàng và cẩn trọng cao nhất. Bệnh viện Thú y Lê Sơn xây dựng quy trình tiếp đón chu đáo và phác đồ điều trị được tư vấn minh bạch cùng chủ nuôi."*
- **Banner chính sách biên tập (Editorial Policy Banner):**
  - Nhãn: `[Thông báo chuẩn hóa danh mục]`
  - Nội dung: *"Các dịch vụ dưới đây mô tả định hướng chuyên môn y khoa và danh mục dự kiến phục vụ tại 101 Khuất Duy Tiến. Chi phí và quy trình kỹ thuật cụ thể sẽ được bác sĩ trao đổi trực tiếp sau khi thăm khám lâm sàng."*

#### Section 2: Quick Category Jump Bar (Thanh nhảy danh mục nhanh)
- Thanh tab tĩnh dạng pill bo góc nhẹ (`rounded-xl`), có cơ chế dính khi cuộn (`sticky`):
  - Offset vị trí dính: `top-[73px]` trên thiết bị di động (< 768px), `top-[81px]` trên máy tính bảng và máy tính để bàn ($\ge 768\text{px}$).
  - 6 thẻ neo: `#kham-dieu-tri`, `#can-lam-sang`, `#phau-thuat`, `#noi-tru`, `#spa-grooming`, `#cap-cuu`.
- Hỗ trợ cuộn mượt (`scroll-behavior: smooth`) và chuyển đổi tức thì khi người dùng bật `prefers-reduced-motion`.

#### Section 3: Năm Khối Dịch Vụ Cốt Lõi

##### Khối 3.1: Khám & Điều Trị Lâm Sàng (`#kham-dieu-tri`)
- **Bố cục:** *Asymmetric Editorial Split 7/5*.
- **Cột thông tin (7/12 cột):**
  - Nhãn phân nhóm: `NHÓM 01 — Y KHOA LÂM SÀNG`
  - Tiêu đề H2: `Thăm khám cẩn trọng, chẩn đoán đúng và điều trị chu đáo`
  - Mô tả: Quy trình kiểm tra các chỉ số sức khỏe cơ bản, lắng nghe phản ánh từ chủ nuôi và tư vấn phương án chăm sóc phù hợp.
  - **Danh mục dịch vụ dự kiến (dạng Hairline List — PENDING):**
    - *Khám lâm sàng tổng quát & sàng lọc sức khỏe định kỳ.* `[Đề xuất danh mục]`
    - *Tiêm phòng vaccine & phòng ngừa ký sinh trùng.* `[Đề xuất danh mục]`
    - *Điều trị bệnh lý nội khoa, tiêu hóa, hô hấp, da liễu.* `[Đề xuất danh mục]`
  - Bác sĩ phụ trách: `Bác sĩ phụ trách lâm sàng [Chờ xác nhận phân công nhân sự]`.
  - Liên kết phụ trợ: `Tra cứu bảng giá khám & điều trị ->` (`/bang-gia?cat=kham-dieu-tri`).
- **Cột minh họa (5/12 cột):**
  - Khung ảnh Editorial Photo Frame với ảnh chụp mèo/chó được chăm sóc dịu dàng.
  - Nhãn bắt buộc: `Ảnh minh họa dịch vụ — không chụp nhân sự không xác định`.

##### Khối 3.2: Chẩn Đoán Cận Lâm Sàng & Xét Nghiệm (`#can-lam-sang`)
- **Bố cục:** *Architectural Grid 3 cột*.
- **Nội dung (PENDING — Chờ xác nhận cấu hình thiết bị thực tế):**
  - Nhãn phân nhóm: `NHÓM 02 — CHẨN ĐOÁN CẬN LÂM SÀNG & XÉT NGHIỆM`
  - Tiêu đề H2: `Hỗ trợ chẩn đoán nhanh chóng và chuẩn xác`
  - 3 thẻ tính năng chuyên môn (Editorial Slot Box):
    - *Xét nghiệm huyết học & sinh hóa:* Hỗ trợ đánh giá các chỉ số sức khỏe của thú cưng. `[Đề xuất danh mục xét nghiệm]`
    - *Chẩn đoán hình ảnh (X-quang / Siêu âm):* Tầm soát dị vật và hỗ trợ đánh giá ổ bụng, xương khớp. `[Đề xuất cấu hình thiết bị]`
    - *Xét nghiệm ký sinh trùng & soi da:* Hỗ trợ xác định các nguyên nhân gây viêm da, nấm ngứa. `[Đề xuất quy trình chẩn đoán]`
  - Liên kết phụ trợ: `Xem bảng giá xét nghiệm tham chiếu ->` (`/bang-gia?cat=can-lam-sang`).

##### Khối 3.3: Phẫu Thuật Ngoại Khoa & Triệt Sản (`#phau-thuat`)
- **Bố cục:** *Editorial Split 6/6*.
- **Nội dung (PENDING — Chờ phê duyệt quy chuẩn ngoại khoa):**
  - Nhãn phân nhóm: `NHÓM 03 — PHẪU THUẬT & CAN THIỆP NGOẠI KHOA`
  - Tiêu đề H2: `Quy trình ngoại khoa cẩn trọng và chuẩn bị chu đáo`
  - Mô tả: Mọi can thiệp ngoại khoa đều được tư vấn cặn kẽ về chỉ định, thời gian hồi tỉnh và hướng dẫn chăm sóc vết thương tại nhà.
  - Danh mục dự kiến: Triệt sản an toàn chó mèo, xử lý vết thương hở, tiểu phẫu mô mềm.
  - Nhân sự thực hiện: `Bác sĩ ngoại khoa [Chờ phê duyệt phân công nhân sự]`. *(Tuyệt đối không tự gán tên BS. Sơn khi chưa có văn bản phê duyệt phạm vi trách nhiệm)*.
  - Liên kết phụ trợ: `Xem bảng giá phẫu thuật tham chiếu ->` (`/bang-gia?cat=phau-thuat`).

##### Khối 3.4: Chăm Sóc Nội Trú Y Tế 24/7 (`#noi-tru`)
- **Bố cục:** *Lavender Full-width Container*.
- **Nội dung (PENDING — Chờ xác nhận quy chuẩn vận hành cơ sở):**
  - Nhãn phân nhóm: `NHÓM 04 — LƯU TRÚ Y TẾ NỘI TRÚ`
  - Tiêu đề H2: `Không gian lưu trú yên tĩnh và chế độ theo dõi phù hợp`
  - Các định hướng vận hành đề xuất:
    - *Khu vực lưu trú chuyên biệt:* Bố trí không gian phù hợp cho từng đối tượng thú cưng. `[Chờ xác nhận cơ cấu phân khu]`
    - *Chế độ theo dõi:* Đội ngũ nhân viên hỗ trợ chăm sóc, cho ăn và theo dõi theo y lệnh. `[Chờ xác nhận phương án nhân sự theo dõi y tế]`
    - *Cập nhật tình hình:* Thông báo tình trạng phục hồi cho chủ nuôi. *(Không công khai y lệnh nghiệp vụ nội bộ trên cổng khách hàng).*
  - Liên kết phụ trợ: `Xem biểu phí nội trú lưu chuồng ->` (`/bang-gia?cat=noi-tru`).

##### Khối 3.5: Vệ Sinh Y Tế & Spa Grooming (`#spa-grooming`)
- **Bố cục:** *Editorial Split 6/6*.
- **Nội dung (PENDING):**
  - Nhãn phân nhóm: `NHÓM 05 — SPA & CHĂM SÓC THẨM MỸ`
  - Tiêu đề H2: `Vệ sinh êm ái, chăm sóc dịu nhẹ cho bé cưng`
  - Mô tả: Sử dụng các sản phẩm vệ sinh da lông phù hợp, thao tác nhẹ nhàng giúp thú cưng thoải mái.
  - Các gói dịch vụ đề xuất: Tắm vệ sinh tiêu chuẩn, Cắt tỉa tạo hình, Tắm chăm sóc da theo tư vấn.
  - Liên kết phụ trợ: `Xem bảng giá dịch vụ spa grooming ->` (`/bang-gia?cat=spa-grooming`).

#### Section 4: Dải Tiếp Nhận Cấp Cứu Khẩn Cấp 24/24 (`#cap-cuu`)
- **Phong cách:** Kế thừa dải Cấp cứu Warm Orange đã nghiệm thu tại Section 3 Trang chủ.
- **Nội dung:**
  - Biểu tượng `ShieldAlert` màu cam ấm nổi bật trên nền gradient ấm.
  - Tiêu đề: `Tiếp nhận Cấp Cứu Thú Cưng 24/24 tại 101 Khuất Duy Tiến`.
  - Dấu hiệu khẩn tham khảo: Khó thở, co giật, nuốt dị vật, chấn thương hoặc xuất huyết. `[Thông tin hướng dẫn tham khảo — Chờ bác sĩ xác nhận]`
  - Nút gọi khẩn trực tiếp: `Gọi Cấp cứu: 097 355 51 05` (`tel:0973555105`).

#### Section 5: Hướng Dẫn & Lưu Ý Trước Khi Đưa Bé Đến Khám
- **Bố cục:** *Architectural Numbered Triptych 01–03*.
- **Nội dung (PENDING — Khuyến cáo y khoa tham khảo, chờ bác sĩ ký duyệt):**
  1. *Lưu ý 01 — Chuẩn bị trước khi xét nghiệm hoặc can thiệp:* Nên trao đổi trước với bác sĩ về việc nhịn ăn/uống nếu có chỉ định xét nghiệm sinh hóa hoặc can thiệp đặc thù. `[Đề xuất hướng dẫn]`
  2. *Lưu ý 02 — Vận chuyển an toàn:* Khuyến khích sử dụng lồng vận chuyển chuyên dụng hoặc dây dắt an toàn để bảo vệ thú cưng khi di chuyển và tại phòng chờ.
  3. *Lưu ý 03 — Cung cấp thông tin sức khỏe:* Mang theo sổ theo dõi tiêm phòng hoặc thông tin thuốc/thức ăn bé đang sử dụng để hỗ trợ bác sĩ nắm bắt bệnh sử.

#### Section 6: Editorial Dark CTA — Chuyển Tiếp Sang Bảng Giá & Đặt Lịch
- **Phong cách:** Component `EditorialDarkCTA` trên nền Deep Plum (`--color-bg-dark: #421247`).
- **Nội dung:**
  - Tiêu đề: `Bạn cần tư vấn dịch vụ phù hợp cho bé?`
  - Mô tả: `Đội ngũ Bệnh viện Thú y Lê Sơn luôn sẵn sàng lắng nghe tình trạng của bé và hỗ trợ giải đáp thắc mắc chu đáo.`
  - Cặp nút hành động:
    - Nút 1 (Primary Plum/White): `Đặt lịch khám` trỏ sang `/dat-lich`.
    - Nút 2 (Outline White): `Xem bảng giá dịch vụ` trỏ sang `/bang-gia`.

---

## 5. MỤC 5: ĐẶC TẢ CHI TIẾT TUYẾN TRANG `/bang-gia`

### 5.1. Định hướng trải nghiệm & Nguyên tắc bảo vệ giá
Trang `/bang-gia` được thiết kế theo các nguyên tắc minh bạch:
1. **Tuyệt đối không hiển thị giá giả:** Mọi dịch vụ chưa có biểu phí chính thức được ký duyệt phải hiển thị trạng thái `UNAVAILABLE` (`Đang cập nhật biểu phí niêm yết`) hoặc `CONTACT` (`Báo giá sau khám lâm sàng`).
2. **Không dùng `0 VNĐ` cho dữ liệu thiếu:** Không đồng nhất thiếu giá với miễn phí.
3. **Tra cứu tức thời & Không giật layout (Zero CLS):** Khung chứa bảng giá có `min-height` cố định, chuyển tab không làm co sập trang.

```text
Trang /bang-gia
│
├── Section 1: Page Heading & Price Policy Disclaimer Banner
├── Section 2: Search & Filter Toolbar (Tìm kiếm & 5 Tab danh mục chuẩn)
├── Section 3: Bảng Biểu Phí Dạng Accordion Có Cấu Trúc (Structured Price Accordion)
│   ├── Nhóm 1: Khám & Điều trị lâm sàng (cat-kham-dieu-tri)
│   ├── Nhóm 2: Chẩn đoán cận lâm sàng & Xét nghiệm (cat-can-lam-sang)
│   ├── Nhóm 3: Phẫu thuật ngoại khoa & Triệt sản (cat-phau-thuat)
│   ├── Nhóm 4: Chăm sóc nội trú y tế 24/7 (cat-noi-tru)
│   └── Nhóm 5: Vệ sinh y tế & Spa Grooming (cat-spa-grooming)
├── Section 4: Hướng Dẫn Quy Trình Tiếp Nhận & Báo Giá Minh Bạch (3 Bước)
└── Section 5: Editorial Dark CTA — Đặt Hẹn & Tư Vấn Chi Phí
```

### 5.2. Chi tiết từng Section trên `/bang-gia`

#### Section 1: Page Heading & Price Policy Disclaimer Banner
- **Breadcrumb:** `Trang chủ` (`/`) `/` `Dịch vụ` (`/dich-vu`) `/` `Bảng giá niêm yết` (`aria-current="page"`).
- **Tiêu đề Eyebrow:** `MINH BẠCH CHI PHÍ Y TẾ THÚ CƯNG`.
- **Heading H1 (Lora 600):** `Bảng giá dịch vụ & biểu phí tham chiếu`.
- **Đoạn dẫn chính:**
  > *"Bệnh viện Thú y Lê Sơn hướng tới sự minh bạch và rõ ràng trong tư vấn chi phí. Chúng tôi khuyến khích chủ nuôi trao đổi cặn kẽ cùng bác sĩ để lựa chọn phương án chăm sóc phù hợp nhất cho thú cưng."*
- **Banner quy định biến động giá y khoa (Price Policy Banner):**
  - Khung viền mỏng theo Token CSS (`border border-[var(--color-border-medium)] bg-[var(--color-bg-secondary)]`).
  - Biểu tượng thông tin `Info`.
  - **Nội dung định hướng (PENDING — Chờ chủ dự án phê duyệt quy chế):**
    - *"1. Chi phí y tế có thể thay đổi tùy thuộc vào cân nặng, giống loài và mức độ diễn biến thực tế của ca bệnh."*
    - *"2. Bác sĩ luôn trao đổi phương án và giải thích chi tiết các khoản dự toán trước khi thực hiện can thiệp chuyên sâu hoặc tiếp nhận nội trú."*
    - *"3. Chính sách phụ phí ngoài giờ y tế (nếu có) sẽ được thông báo cụ thể khi tiếp nhận cấp cứu đêm hoặc ngày lễ."*

#### Section 2: Search & Filter Toolbar (Tìm kiếm & 5 Tab danh mục chuẩn)
- **Thanh tìm kiếm (Accessible Search Input):**
  - Ô nhập liệu dạng thanh mảnh, bo góc nhẹ (`rounded-xl`), có icon kính lúp (`Search`), nút xóa nhanh (`X`) khi có chữ.
  - Placeholder: `Tìm tên dịch vụ, xét nghiệm, gói spa (ví dụ: siêu âm, triệt sản...)...` *(Đã bỏ chữ "giá" khỏi placeholder theo góp ý P3)*.
  - Nhãn ẩn hỗ trợ đọc màn hình: `aria-label="Tìm kiếm dịch vụ trong bảng giá"`.
  - Cơ chế tìm kiếm: Khớp chuỗi không dấu (chữ thường, chữ hoa tiếng Việt), quét qua tên dịch vụ, mô tả và tên danh mục.
- **Thanh phân loại 5 Tab chuẩn (Category Filter Tabs):**
  - Danh sách tab dạng horizontal scrollable pills trên mobile:
    1. `Tất cả` (`all`)
    2. `Khám & Điều trị` (`kham-dieu-tri`)
    3. `Xét nghiệm & Cận lâm sàng` (`can-lam-sang`)
    4. `Phẫu thuật & Triệt sản` (`phau-thuat`)
    5. `Nội trú 24/7` (`noi-tru`)
    6. `Spa & Grooming` (`spa-grooming`)
  - Không hardcode số lượng dịch vụ cố định; hiển thị số đếm động từ dữ liệu hoặc ẩn số đếm khi chưa có biểu phí chính thức.
  - Trạng thái Active: Nền Plum (`var(--color-plum-primary)`), chữ trắng.
  - Trạng thái Inactive: Nền trắng (`var(--color-bg-card)`), viền mảnh (`var(--color-border-medium)`), chữ `var(--color-fg-muted)`.

#### Section 3: Bảng Biểu Phí Dạng Accordion Có Cấu Trúc
Bảng giá được chia thành 5 nhóm danh mục chuẩn. Mỗi dịch vụ là một hàng accordion tương tác (`ServicePriceRow`):
- **Cấu trúc hàng hiển thị tóm tắt (Accordion Trigger Header):**
  - Cột 1 (Trái): Tên dịch vụ (Be Vietnam Pro 600, 15px) + Nhãn nhóm danh mục nhỏ.
  - Cột 2 (Giữa): Đơn vị tính (Ví dụ: `Lần`, `Ngày`, `Ca`).
  - Cột 3 (Phải): Badge trạng thái giá trung tính:
    - Nếu `UNAVAILABLE`: Badge tím nhạt `Đang cập nhật biểu phí niêm yết`.
    - Nếu `CONTACT`: Badge hổ phách `Báo giá sau khám lâm sàng`.
    - Nếu `FIXED` (khi có văn bản duyệt): `[Số tiền niêm yết] VNĐ`.
    - Nếu `RANGE` (khi có văn bản duyệt): `[Giá sàn] – [Giá trần] VNĐ`.
  - Icon mũi tên xoay `ChevronDown` báo hiệu trạng thái mở rộng.
- **Cấu trúc nội dung mở rộng (Accordion Panel Content):**
  - Khi bung mở:
    - *Nội dung bao gồm:* Mô tả tóm tắt các bước thực hiện cơ bản.
    - *Lưu ý y khoa:* Ghi chú điều kiện chuẩn bị hoặc yếu tố ảnh hưởng.
    - *Thông báo minh bạch:* *"Biểu phí chính thức đang được phòng khám đối chiếu ban hành. Quý khách vui lòng liên hệ hotline 097 355 51 05 hoặc đặt lịch để được bác sĩ thông báo dự toán chi phí cụ thể."*
    - *Nút hành động:* Nút nhỏ `Đặt lịch khám` trỏ sang `/dat-lich`.

#### Section 4: Hướng Dẫn Quy Trình Tiếp Nhận & Báo Giá Minh Bạch
- **Bố cục:** *Architectural Hairline Ledger 3 Bước (01 — 02 — 03)*:
  - `Bước 01 — Thăm khám & Đánh giá lâm sàng:` Bác sĩ kiểm tra tình trạng thực tế của bé và lắng nghe phản ánh từ chủ nuôi.
  - `Bước 02 — Tư vấn phác đồ & Giải thích dự toán chi phí:` Đưa ra các phương án điều trị cần thiết, giải thích mục đích từng chỉ định và thông báo chi phí dự toán.
  - `Bước 03 — Thực hiện theo thỏa thuận đồng thuận:` Phòng khám chỉ tiến hành can thiệp y tế khi có sự thống nhất của chủ nuôi. Mọi phát sinh (nếu có) đều được trao đổi trước.

#### Section 5: Editorial Dark CTA — Đặt Hẹn & Tư Vấn Chi Phí
- Khối CTA nền Deep Plum (`--color-bg-dark: #421247`):
  - Tiêu đề: `Bạn cần tư vấn chi phí cụ thể cho trường hợp của bé?`
  - Mô tả: `Liên hệ hotline hoặc gửi thông tin để được đội ngũ phòng khám hỗ trợ trao đổi sơ bộ tình trạng và hướng dẫn chuẩn bị.`
  - Nút chính: `Đăng ký lịch khám ngay` (`/dat-lich`) & Nút gọi: `Hotline: 097 355 51 05` (`tel:0973555105`).

---

## 6. MỤC 6: KIẾN TRÚC CÔ LẬP BUNDLE, HIỆU NĂNG & NGĂN NGỪA CLS

### 6.1. Phân tách Bundle theo Architecture Baseline V1
- Hai trang `/dich-vu` và `/bang-gia` thuộc **Public Website**, được phân tách bundle độc lập bằng `React.lazy()`:
  ```tsx
  const ServicesPage = lazy(() => import('@/pages/ServicesPage'))
  const PricingPage = lazy(() => import('@/pages/PricingPage'))
  ```
- **Cô lập hoàn toàn khỏi Portal nội bộ:** Tuyệt đối không import bất kỳ component hay logic nào của `/tai-khoan/*` (Customer Portal) hoặc `/quan-ly/*` (Staff Portal) vào bundle của 3B.
- Giữ nguyên `PageLoadingFallback` với `min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]` và `role="status"` đã được nghiệm thu tại DEV-01 Fix 01 nhằm bảo đảm **CLS = 0.000**.

### 6.2. Biện pháp kỹ thuật loại trừ triệt để CLS trên `/bang-gia`
1. **Khung chứa danh sách có `min-height` dự phòng:** Vùng danh sách dịch vụ luôn giữ chiều cao tối thiểu (`min-h-[400px]`), tránh hiện tượng Footer bị giật lên vị trí giữa màn hình rồi bị đẩy xuống.
2. **Animation Accordion chuyển đổi mượt:** Chuyển động đóng/mở panel dùng `max-height` hoặc CSS Grid transition có kiểm soát, không thay đổi kích thước container bên ngoài.
3. **Thanh tìm kiếm cố định kích thước:** Chiều cao Toolbar được định hình bằng hằng số cố định (`h-12` = 48px).
4. **Trạng thái không có kết quả (Empty State) giữ chỗ cân đối:** Khung thông báo không tìm thấy kết quả có chiều cao tối thiểu **240px** (`min-h-[240px]`).

---

## 7. MỤC 7: ĐẶC TẢ SEO METADATA GATE CHO HAI TUYẾN ĐƯỜNG (/dich-vu & /bang-gia)

Để đáp ứng tiêu chuẩn SEO kỹ thuật và tuân thủ nguyên tắc kiểm soát bằng chứng (Content Evidence Gate & 3B00F-P2-9), toàn bộ thẻ meta tiêu đề, mô tả, chỉ dẫn robot và cấu trúc dữ liệu schema.org phải được quy hoạch chặt chẽ trước khi triển khai:

### 7.1. Nguyên tắc quản trị Metadata Gate
1. **Khóa nội dung Meta Description:** Tuyệt đối không đưa các tuyên bố chuyên môn chưa được xác minh (như máy gây mê khí dung, khu cách ly, phẫu thuật chuyên sâu khi chưa duyệt) hoặc các mức giá chưa niêm yết vào thẻ `<meta name="description">` và `<meta property="og:description">`.
2. **Chính sách Canonical URL:** Trong giai đoạn phát triển và preview, canonical URL sử dụng định dạng placeholder tiêu chuẩn:
   - `/dich-vu`: `https://[domain-chinh-thuc]/dich-vu`
   - `/bang-gia`: `https://[domain-chinh-thuc]/bang-gia`
   *(Domain chính thức sẽ được cấu hình khi chủ dự án chốt tên miền triển khai).*
3. **Chính sách Robots Indexing:**
   - Môi trường Preview / Staging: Bắt buộc cấu hình `<meta name="robots" content="noindex, nofollow" />` để tránh lập chỉ mục dữ liệu dự thảo.
   - Môi trường Production: Chỉ kích hoạt `<meta name="robots" content="index, follow" />` sau khi toàn bộ dữ liệu đạt `VERIFIED` và được chủ dự án nghiệm thu.
4. **Bảo vệ bản quyền & Nguồn gốc OG Image:** Thẻ `og:image` sử dụng ảnh nhận diện thương hiệu chuẩn kích thước $1200 \times 630\text{px}$ có sẵn trong asset Mốc 2A/2B hoặc logo đồ họa thương hiệu, không dùng ảnh chụp phòng mổ/trang thiết bị chưa xác minh nguồn gốc.
5. **Chính sách Schema.org / JSON-LD:**
   - Tuyệt đối **KHÔNG** đưa các dịch vụ đang ở trạng thái `PROPOSED / PENDING` vào cấu trúc `Offer` hoặc `priceSpecification` của Schema.org.
   - Chỉ tích hợp Schema.org `MedicalBusiness` / `MedicalWebPage` với các thông tin đã `VERIFIED` (Địa chỉ 101 Khuất Duy Tiến, Hotline 0988 565 056, Giờ mở cửa 08:00 – 21:00, Tiếp nhận cấp cứu 24/24).
   - Biểu phí chỉ được xuất bản vào Schema.org `OfferCatalog` khi dịch vụ đạt trạng thái `FIXED` hoặc `RANGE` kèm văn bản phê duyệt từ chủ dự án.
6. **Xử lý mã phản hồi HTTP 404 cho tuyến đường ngoài phạm vi:**
   - Các tuyến con như `/dich-vu/:slug` chưa được phép mở. Mọi yêu cầu truy cập vào đường dẫn không tồn tại phải trả về trang HTTP 404 Not Found (hoặc chuyển tiếp ComingSoon theo kiến trúc đã duyệt), tuyệt đối không trả trang trống hoặc HTTP 200 không nội dung.

### 7.2. Đặc tả Metadata chi tiết cho Tuyến Đường `/dich-vu`

| Thuộc tính Meta | Giá trị đặc tả | Trạng thái xác minh |
|---|---|---|
| `<title>` | `Dịch Vụ Y Tế & Chăm Sóc Thú Cưng | Bệnh Viện Thú Y Lê Sơn Hà Nội` | `PROPOSED / PENDING` |
| `meta[name="description"]` | `Tổng quan hệ sinh thái dịch vụ thú y tại Lê Sơn: Khám điều trị lâm sàng, xét nghiệm cận lâm sàng, ngoại khoa, nội trú y tế và spa grooming tiêu chuẩn.` | `PROPOSED / PENDING` (Độ dài: 158 ký tự) |
| `link[rel="canonical"]` | `https://[domain-chinh-thuc]/dich-vu` | `PROPOSED` |
| `meta[property="og:title"]` | `Dịch Vụ Y Tế & Chăm Sóc Thú Cưng | Bệnh Viện Thú Y Lê Sơn` | `PROPOSED / PENDING` |
| `meta[property="og:description"]` | `Hệ thống giải pháp y tế thú cưng chuẩn mực, tận tâm và minh bạch tại 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội.` | `PROPOSED / PENDING` |
| `meta[property="og:image"]` | `https://[domain-chinh-thuc]/assets/og-dich-vu.jpg` ($1200 \times 630\text{px}$) | `PROPOSED` |
| `meta[property="og:type"]` | `website` | `VERIFIED` |

### 7.3. Đặc tả Metadata chi tiết cho Tuyến Đường `/bang-gia`

| Thuộc tính Meta | Giá trị đặc tả | Trạng thái xác minh |
|---|---|---|
| `<title>` | `Bảng Giá Dịch Vụ Niêm Yết Tham Chiếu | Bệnh Viện Thú Y Lê Sơn` | `PROPOSED / PENDING` |
| `meta[name="description"]` | `Tra cứu biểu phí và bảng giá dịch vụ thú y tham chiếu tại Bệnh viện Thú y Lê Sơn. Minh bạch chi phí, tư vấn rõ ràng và đồng hành tận tâm.` | `PROPOSED / PENDING` (Độ dài: 151 ký tự) |
| `link[rel="canonical"]` | `https://[domain-chinh-thuc]/bang-gia` | `PROPOSED` |
| `meta[property="og:title"]` | `Bảng Giá Dịch Vụ Niêm Yết | Bệnh Viện Thú Y Lê Sơn` | `PROPOSED / PENDING` |
| `meta[property="og:description"]` | `Minh bạch biểu phí khám chữa bệnh, chẩn đoán, nội trú và chăm sóc thú cưng tại 101 Khuất Duy Tiến, Hà Nội.` | `PROPOSED / PENDING` |
| `meta[property="og:image"]` | `https://[domain-chinh-thuc]/assets/og-bang-gia.jpg` ($1200 \times 630\text{px}$) | `PROPOSED` |
| `meta[property="og:type"]` | `website` | `VERIFIED` |

---

## 8. MỤC 8: KHUNG KIỂM SOÁT BẰNG CHỨNG & KHÓA NỘI DUNG (CONTENT LOCK)

Tuân thủ nghiêm ngặt quy chế tại [`3b-00-content-evidence-gate.md`](3b-00-content-evidence-gate.md):
- **Gỡ bỏ toàn bộ gán chuyên môn:** Không gán chức danh ngoại khoa, kíp mổ hay máy gây mê cho BS. Lê Thái Sơn khi chưa có văn bản phê duyệt.
- **Loại bỏ toàn bộ claim 3A đã bác bỏ:** Không công bố "khu cách ly", "khu hồi sức riêng", "trực đêm", "theo dõi sinh hiệu", "phòng mổ vô trùng", "máy gây mê" như sự thật đã hoàn tất.
- **Không tự nâng VERIFIED:** Mọi mục thiếu bằng chứng văn bản cụ thể đều giữ nguyên trạng thái `PENDING`.
- **Áp dụng DEC-12 & DEC-13:** Mọi câu chữ tiêu đề, đoạn dẫn thương hiệu chỉ được chuyển thành `VERIFIED` khi có văn bản phê duyệt của chủ dự án; AI agent không tự xưng là người duyệt dữ liệu y tế.

---

## 9. MỤC 9: DANH MỤC PHỤ THUỘC NGOÀI PHẠM VI (OUT-OF-SCOPE DEPENDENCIES)

Các tính năng hoặc liên kết liên quan đến các thành phần ngoài phạm vi 3B-00 được ghi nhận rõ ràng:

| STT | Phụ thuộc | Hiện trạng trong Codebase (Mốc 2B/3A) | Tác động nếu triển khai | Phương án mặc định an toàn (3B-00) |
|:---:|---|---|---|---|
| **01** | Tham số query `?service=` trên `/dat-lich` | `BookingPage.tsx` hiện tại không đọc `location.search` hoặc `serviceType` từ URL query. | Cần sửa `BookingPage.tsx` (Mã nguồn Mốc 2B đang đóng băng). | **Mặc định:** CTA chỉ điều hướng đơn thuần về `/dat-lich` không kèm query. Tính năng pre-fill là đề xuất nâng cấp tương lai. |
| **02** | Điều hướng menu Header con | Header hiện có 4 link trỏ về 4 route con ComingSoon `/dich-vu/*`. | Cần sửa `Header.tsx` (Component Mốc 2B). | **Mặc định:** Giữ nguyên Header và 4 route ComingSoon. Đưa vào OPEN DECISION 3B-DEC-02. |
| **03** | Footer link & Section 3 Trang chủ | Footer và Section 3 Trang chủ hiện có các nút trỏ về `/dich-vu/*`. | Cần sửa `Footer.tsx` và `FeaturedServices.tsx` (Mốc 2B). | **Mặc định:** Giữ nguyên toàn bộ mã nguồn Footer và Trang chủ. |

---

## 10. MỤC 10: DANH MỤC 13 QUYẾT ĐỊNH MỞ CẦN CHỦ DỰ ÁN PHÊ DUYỆT (OPEN DECISIONS)

Dưới đây là danh sách 13 quyết định mở được tổng hợp đầy đủ theo yêu cầu của CEO Directive 042-A, Directive 044-A và khuyến nghị QA của Claude:

1. **3B-DEC-01 (Phương thức công bố biểu phí):** Chủ dự án muốn cung cấp ngay biểu phí rút gọn có mức giá thật cho một số dịch vụ cơ bản trong bản Preview đầu tiên, hay giữ toàn bộ danh mục ở trạng thái `UNAVAILABLE` / `CONTACT`?
2. **3B-DEC-02 (Điều hướng 4 route con `/dich-vu/*` hiện hữu):** Chủ dự án muốn giữ nguyên 4 trang ComingSoon hiện tại, hay cho phép Antigravity sửa Header/Footer để chuyển hướng các mục con này thành anchor link (`#kham-dieu-tri`, `#noi-tru`...) trên trang `/dich-vu` trong một nhiệm vụ riêng?
3. **3B-DEC-03 (Chính sách phụ phí cấp cứu ngoài giờ/ngày lễ):** Phòng khám có áp dụng phụ phí phục vụ cấp cứu ngoài giờ y tế (21:00 – 08:00) hoặc ngày lễ hay không; nếu có thì mức phụ phí và khung giờ cụ thể là bao nhiêu?
4. **3B-DEC-04 (Danh mục dịch vụ kỹ thuật thực tế):** Phê duyệt danh sách chính thức các dịch vụ được phép công bố (đặc biệt là phẫu thuật, triệt sản, tiêm phòng, xét nghiệm máu, X-quang, siêu âm, soi da).
5. **3B-DEC-05 (Taxonomy chuẩn hóa 5 nhóm):** Phê duyệt bộ 5 nhóm danh mục chuẩn hóa (`kham-dieu-tri`, `can-lam-sang`, `phau-thuat`, `noi-tru`, `spa-grooming`) để sử dụng thống nhất trên toàn hệ thống.
6. **3B-DEC-06 (Vai trò chuyên môn của BS. Lê Thái Sơn trên 3B):** Chủ dự án có muốn công bố phạm vi phụ trách chuyên môn cụ thể của BS. Lê Thái Sơn trên trang Dịch vụ hay không, hay chỉ giữ họ tên ở vai trò người sáng lập / đại diện chung?
7. **3B-DEC-07 (Quy chuẩn cơ sở vật chất & nội trú được phép công bố):** Xác nhận các thông tin cơ sở vật chất và trang thiết bị thực tế tại 101 Khuất Duy Tiến được phép đưa vào nội dung công khai.
8. **3B-DEC-08 (Lời khuyên y khoa trước khám):** Chủ dự án và Bác sĩ có duyệt các nội dung hướng dẫn chuẩn bị (nhịn ăn trước xét nghiệm/mổ, lồng vận chuyển an toàn, sổ tiêm phòng) để công bố công khai hay không?
9. **3B-DEC-09 (Cam kết tư vấn chi phí):** Xác nhận câu chữ cam kết giải thích dự toán chi phí trước khi can thiệp và nguyên tắc trao đổi phát sinh.
10. **3B-DEC-10 (Tham số `?service=` trên BookingPage):** Chủ dự án có cho phép mở nhánh sửa `BookingPage.tsx` để nhận tham số tự động chọn dịch vụ từ bảng giá hay không?
11. **3B-DEC-11 (Phân tầng giá theo cân nặng & Gói Spa Grooming):** Phòng khám có áp dụng biểu phí theo các nấc cân nặng thú cưng đối với dịch vụ spa và nội trú hay không; nếu có thì các mốc cân nặng cụ thể là gì?
12. **3B-DEC-12 (Phê duyệt văn bản cho tiêu đề và câu dẫn Hero/Heading 3B):** Chủ dự án phê duyệt bằng văn bản cho câu chữ Hero, Eyebrow và Heading của hai tuyến trang `/dich-vu` (`DV-HERO-02/03/04`) và `/bang-gia` (`BG-HEAD-02/03/04`) trước khi chuyển từ `PENDING` sang `VERIFIED`.
13. **3B-DEC-13 (Quy ước thẩm quyền người duyệt & quản lý nguồn bằng chứng):** Quy ước rõ ràng phân quyền: Chủ dự án duyệt thương hiệu, dịch vụ, biểu phí; Bác sĩ phụ trách duyệt quy trình y khoa; các AI Agent (Antigravity, Claude, ChatGPT CEO) là công cụ soạn thảo/QA, tuyệt đối không đứng tên `verifiedBy` / `approvedBy` cho dữ liệu thực tế phòng khám. Toàn bộ CEO Directives và biên bản duyệt văn bản được lưu trữ trong Git repo để làm nguồn căn cứ bằng chứng.

---

**KẾT THÚC BẢN THIẾT KẾ CHI TIẾT 3B-00 (BLUEPRINT V1.2)**
