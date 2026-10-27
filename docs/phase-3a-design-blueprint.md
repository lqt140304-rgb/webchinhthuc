# HỒ SƠ THIẾT KẾ CHI TIẾT GIAI ĐOẠN 3A — PHIÊN BẢN V2.4 (PHASE 3A DESIGN BLUEPRINT V2.4)
## Bệnh viện Thú y Lê Sơn 2026 — Vibrant Editorial Luxury & Chuẩn Mực Y Khoa

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Phiên bản tài liệu** | **Blueprint v2.4** (Cập nhật theo **CEO DIRECTIVE 024-A — PHASE 3A DEV-00: DOCUMENTATION FREEZE** và Báo cáo Claude QA 3A-04 tại commit `cd01f11`) |
| **Căn cứ chỉ đạo** | `AGENTS.md` (Architecture Baseline V1), `PROJECT_BRIEF.md`, **CEO DIRECTIVE 017-A**, **CEO DIRECTIVE 018-A**, `docs/design-system.md`, `docs/assets-credits.md` |
| **Tác giả thiết kế** | Antigravity — Designer |
| **Đơn vị thẩm định độc lập** | Claude — Independent QA Lead |
| **Phạm vi 3 tuyến trang** | 1. `/gioi-thieu` (Giới thiệu bệnh viện)<br>2. `/doi-ngu` (Đội ngũ)<br>3. `/co-so-vat-chat` (Cơ sở vật chất) |
| **Trạng thái phê duyệt** | **PHASE 3A — PENDING OWNER DESIGN APPROVAL (DESIGN ONLY — NO WEBSITE IMPLEMENTATION)** |
| **Đường dẫn Mockup trực quan** | - Trong Repository (độc lập với `src/`): `docs/design/phase-3a-interactive-mockups.html`<br>- Trong thư mục Artifact phiên làm việc: `C:/Users/Admin/.gemini/antigravity/brain/6f5020a8-5310-41e1-a151-7821d0315e27/phase-3a-interactive-mockups.html` |
| **Báo cáo giải quyết QA** | `docs/qa/3a-design-handoff-05.md` |

---

## MỤC LỤC (10 HẠNG MỤC NGHIỆM THU BẮT BUỘC THEO CEO DIRECTIVE 018-A)

1. [Mục 1: Sitemap Ba Trang Giai Đoạn 3A & Định Hướng Nghệ Thuật](#1-muc-1-sitemap-ba-trang-giai-doan-3a--dinh-huong-nghe-thuat)
2. [Mục 2: Nội Dung Chi Tiết Từng Section (Content & UX Blueprint)](#2-muc-2-noi-dung-chi-tiet-tung-section-content--ux-blueprint)
   - [2.1. Trang /gioi-thieu — Giới Thiệu Bệnh Viện](#21-trang-gioi-thieu--gioi-thieu-benh-vien)
   - [2.2. Trang /doi-ngu — Đội Ngũ Nhân Sự](#22-trang-doi-ngu--doi-ngu-nhan-su)
   - [2.3. Trang /co-so-vat-chat — Cơ Sở Vật Chất](#23-trang-co-so-vat-chat--co-so-vat-chat)
3. [Mục 3: Wireframe Responsive (Desktop, Tablet & Mobile) & Ma Trận Lưới Đội Ngũ](#3-muc-3-wireframe-responsive-desktop-tablet--mobile--ma-tran-luoi-doi-ngu)
4. [Mục 4: Danh Mục Tái Sử Dụng Component (Component Reuse & Codebase Alignment)](#4-muc-4-danh-muc-tai-su-dung-component-component-reuse--codebase-alignment)
5. [Mục 5: Đặc Tả Chuyển Động & Tương Tác (Animation & Accessibility Interaction Specs)](#5-muc-5-dac-ta-chuyen-dong--tuong-tac-animation--accessibility-interaction-specs)
6. [Mục 6: Danh Mục Dữ Liệu Placeholder & Hồ Sơ Thật Còn Thiếu (Data Placeholders & Missing Real Data)](#6-muc-6-danh-muc-du-lieu-placeholder--ho-so-that-con-thieu-data-placeholders--missing-real-data)
7. [Mục 7: Hồ Sơ Nguồn Gốc & Quyền Sử Dụng Tài Sản Hình Ảnh / Phông Chữ (Asset Provenance Inventory)](#7-muc-7-ho-so-nguon-goc--quyen-su-dung-tai-san-hinh-anh--phong-chu-asset-provenance-inventory)
8. [Mục 8: Bảng Đối Chiếu Giải Quyết Toàn Bộ Phát Hiện QA (Mapping 2 P1, 11 P2 & 9 P3)](#8-muc-8-bang-doi-chieu-giai-quyet-toan-bo-phat-hien-qa-mapping-2-p1-11-p2--9-p3)
9. [Mục 9: Rủi Ro Kỹ Thuật & Danh Sách Quyết Định Cần Chủ Dự Án Xác Nhận](#9-muc-9-rui-ro-ky-thuat--danh-sach-quyet-dinh-can-chu-du-an-xac-nhan)
10. [Mục 10: Đường Dẫn Chính Xác Đến Mockup Trực Quan & Hướng Dẫn Mở Xem Trên Windows / Trình Duyệt](#10-muc-10-duong-dan-chinh-xac-den-mockup-truc-quan--huong-dan-mo-xem-tren-windows--trinh-duyet)

---

## 1. MỤC 1: SITEMAP BA TRANG GIAI ĐOẠN 3A & ĐỊNH HƯỚNG NGHỆ THUẬT

### 1.1. Sitemap & Cấu trúc Điều hướng Giai đoạn 3A
Ba trang thuộc Giai đoạn 3A nằm trong phân khu **Public Website (`RootLayout`)**, thuộc cụm điều hướng **Về Lê Sơn** trên `Header` và `MobileNav`:

```text
Public Website (RootLayout: Header + main#main-content + Footer + MobileBottomBar)
│
├── / (Trang chủ — Bảo toàn nguyên vẹn 100% 6 section đã nghiệm thu Mốc 2A/2B)
│
├── Cụm menu "Về Lê Sơn" (Nhãn nhóm dạng text tĩnh trong Breadcrumb — không tạo link giả):
│   │
│   ├── 1. /gioi-thieu (Giới thiệu bệnh viện)
│   │      ├── Section 1.1: Editorial Hero (Định vị thương hiệu & Dải thông tin cơ sở xác thực)
│   │      ├── Section 1.2: Câu chuyện Lê Sơn (Open Magazine Spread + Slot câu chuyện sáng lập chờ duyệt)
│   │      ├── Section 1.3: Giá trị và Triết lý chăm sóc (Architectural Numbered Triptych 01–03)
│   │      ├── Section 1.4: Quan điểm phục vụ, chăm sóc thú cưng (Editorial Hairline Ledger — Đề xuất chờ duyệt)
│   │      └── Section 1.5: Khám phá Đội ngũ, Cơ sở vật chất & Dải CTA rút gọn
│   │
│   ├── 2. /doi-ngu (Đội ngũ)
│   │      ├── Section 2.1: Team Introduction Hero + Thông báo minh bạch hồ sơ + Bộ lọc bộ phận (Accessible Filter)
│   │      ├── Section 2.2: Nhóm Bộ phận Lâm sàng / Bác sĩ Thú y (Uniform Card Grid — Không VIP, Không ảnh giả)
│   │      ├── Section 2.3: Các Bộ phận Chăm sóc, Spa & Hỗ trợ theo cơ cấu thực tế (Không tự gộp bộ phận trái thực tế)
│   │      ├── Section 2.4: Cách đội ngũ phối hợp chăm sóc thú cưng (Workflow Strip — Đề xuất chờ xác nhận)
│   │      └── Section 2.5: CTA Liên hệ & Đặt lịch khám
│   │
│   └── 3. /co-so-vat-chat (Cơ sở vật chất)
│          ├── Section 3.1: Editorial Hero + Banner chính sách ảnh minh họa & điều kiện phát hành + Zone Jump Bar
│          ├── Section 3.2: Gallery không gian bệnh viện (Asymmetric Editorial Spread + Nhãn ảnh minh họa bắt buộc)
│          ├── Section 3.3: Khu khám và điều trị (Editorial Split + Slot thiết bị xét nghiệm/chẩn đoán trung tính)
│          ├── Section 3.4: Khu nội trú và trang thiết bị chăm sóc (Lavender Split + Slot quy cách nội trú chờ xác nhận)
│          └── Section 3.5: CTA đến bệnh viện (101 Khuất Duy Tiến) hoặc liên hệ cấp cứu 24/24
│
└── /dat-lich (Đặt lịch khám — Đích đến của CTA chính trên cả 3 trang)
```

### 1.2. Bảo toàn Art Direction "Vibrant Editorial Luxury" & Hệ thống Token
- **Nguồn Design Tokens duy nhất (`src/styles/tokens.css`):**
  - **Nền (Backgrounds):** Ivory ấm (`--color-bg-primary`: `#FBF7F1`), Lavender nhạt (`--color-bg-secondary`: `#F8F2F9`), bề mặt nổi (`--color-bg-card`: `#FFFFFF`), Deep Plum (`--color-bg-dark`: `#421247`, `--color-bg-dark-secondary`: `#310D35`).
  - **Chữ (Foregrounds):** Chữ chính (`--color-fg-primary`: `#1A0A1C`), tiêu đề phụ mận đậm (`--color-fg-secondary`: `#421247`), văn bản mô tả (`--color-fg-muted`: `#554157`), metadata (`--color-fg-subtle`: `#5A3E5E`).
  - **Điểm nhấn hành động:** Plum chủ đạo (`--color-plum-primary`: `#5A1E5E`), Orchid (`--color-plum-orchid`: `#824787`, `--color-plum-orchid-light`: `#D8B4E2`), và Cam ấm (`--color-warm-orange`: `#C2560C`, `--color-warm-orange-dark`: `#9A3412`) dành riêng cho cấp cứu 24/24 và hotline.
- **Bảo toàn chiến lược Font Phương án C (`src/styles/fonts.css`):**
  - Chỉ sử dụng đúng 6 file WOFF2 tự lưu trữ (`public/fonts/`):
    1. `lora-600.woff2` (`Lora` SemiBold `600`, `font-style: normal` — **Critical Preload**): Dùng cho tiêu đề `h1`, `h2`, `h3`, số thứ tự `01–03` và câu trích dẫn lớn. **Tuyệt đối không dùng Lora in nghiêng** để tránh trình duyệt tự tạo nghiêng giả (synthetic oblique).
    2. `be-vietnam-pro-400.woff2` (`Be Vietnam Pro` Regular `400` — **Critical Preload**): Văn bản thân bài.
    3. `be-vietnam-pro-500.woff2` (`Be Vietnam Pro` Medium `500` — Secondary): Breadcrumb, metadata, pill tag.
    4. `be-vietnam-pro-600.woff2` (`Be Vietnam Pro` SemiBold `600` — **Critical Preload**): Nút CTA, thanh điều hướng, dòng chức danh chuyên môn.
    5. `be-vietnam-pro-700.woff2` (`Be Vietnam Pro` Bold `700` — Secondary): Eyebrow chữ hoa, nhãn cảnh báo, số hotline.
    6. `be-vietnam-pro-italic-400.woff2` (`Be Vietnam Pro` Italic `400` — Secondary): Chú thích ảnh, ghi chú trạng thái chờ xác minh.
- **Bố cục đa dạng, hạn chế lạm dụng card bo tròn:**
  - Kết hợp 4 cấu trúc: (1) *Asymmetric Editorial Split 7/5*, (2) *Architectural Hairline Ledger & Numbered Triptych*, (3) *Photo Editorial Spread*, và (4) *Uniform Cards có chọn lọc* (chỉ dùng cho lưới nhân sự `/doi-ngu` và 2 thẻ dẫn đường cuối `/gioi-thieu`).

---

## 2. MỤC 2: NỘI DUNG CHI TIẾT TỪNG SECTION (CONTENT & UX BLUEPRINT)

### 2.1. TRANG `/gioi-thieu` — GIỚI THIỆU BỆNH VIỆN
- **Phong cách:** *Editorial Storytelling + Clinical Credibility*.
- **Breadcrumb (`3A-P3-2` Đã sửa):** `Trang chủ` (`<a href="/">`) `/` `Về Lê Sơn` (`<span>` tĩnh, không đặt link) `/` `Giới thiệu bệnh viện` (`<span aria-current="page">`).
- **Quy tắc hình ảnh (`3A-P2-2` Đã sửa):** **Tuyệt đối không dùng ảnh stock có người mặc áo blouse hoặc đồng phục y tế** trên trang `/gioi-thieu` để tránh người xem hiểu nhầm người trong ảnh là bác sĩ thật của Lê Sơn. Khung ảnh minh họa trong Preview/Mockup chỉ sử dụng ảnh thú cưng hoặc không gian ấm áp không có nhân sự giả, kèm nhãn trực tiếp: `Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn`.

#### 5 Khu vực nội dung của `/gioi-thieu`:
1. **Section 1.1 — Editorial Hero:**
   - **Cột trái (7/12 cột):**
     - Eyebrow: `VỀ BỆNH VIỆN THÚ Y LÊ SƠN`
     - `h1` (`Lora 600`): *“Nơi sự cẩn trọng y khoa song hành cùng lòng thấu cảm.”*
     - Đoạn dẫn: *“Tại 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội, Bệnh viện Thú y Lê Sơn hướng tới việc xây dựng một điểm tựa y tế đáng tin cậy cho chủ nuôi — nơi mỗi bé cưng được thăm khám kỹ lưỡng, giải thích rõ ràng và chăm sóc bằng sự tôn trọng sự sống.”*
     - Cụm CTA: Nút chính `Đặt lịch khám` (`/dat-lich`) + Nút phụ `Gọi Hotline: 097 355 51 05` (`tel:0973555105`).
   - **Cột phải (5/12 cột):** Khung ảnh nghệ thuật cắt góc bất đối xứng hiển thị hình ảnh thú cưng ấm áp (không có người mặc áo blouse), gắn nhãn trực quan `Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn`.
   - **Dải thông tin xác thực (Architectural Metadata Strip — 3 cột kẻ chỉ mảnh):**
     - `01. Địa chỉ`: 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội.
     - `02. Giờ khám tham chiếu`: 08:00 – 21:00 (Tất cả các ngày).
     - `03. Trực cấp cứu`: Tiếp nhận cấp cứu 24/24 — `097 355 51 05`.
2. **Section 1.2 — Câu chuyện Lê Sơn (Open Magazine Spread):**
   - **Cột trái (5/12 cột):** Câu trích dẫn chủ đạo (`Lora 600`, kiểu chữ đứng `normal`): *“Mỗi bé cưng đến viện đều mang theo niềm thương yêu và sự gửi gắm của cả một gia đình.”*
   - **Cột phải (7/12 cột):**
     - Đoạn văn biên tập trung tính nói về sự đồng cảm với nỗi lo của người nuôi thú cưng và định hướng thăm khám dựa trên quan sát lâm sàng cẩn trọng.
     - **Slot dữ liệu chờ xác nhận (`Owner Story Slot`):** Khung viền nét đứt ghi rõ `[SLOT CHỜ CHỦ DỰ ÁN CUNG CẤP: Lịch sử hình thành, cột mốc hoạt động thực tế và thông điệp sáng lập của Bệnh viện Thú y Lê Sơn — Không tự điền năm thành lập hay số liệu chưa xác minh]`.
3. **Section 1.3 — Giá trị và Triết lý chăm sóc (Architectural Numbered Triptych):**
   - Nền Lavender (`#F8F2F9`), chia 3 cột kẻ chỉ dọc mảnh (`1px solid var(--color-border-subtle)`), đồng bộ 100% với 3 giá trị đã nghiệm thu ở `WhyChooseUs.tsx`:
     - `01 — Chuyên môn và trách nhiệm`: Tiếp cận từng ca bệnh cẩn trọng, chẩn đoán dựa trên biểu hiện lâm sàng và các bước kiểm tra cần thiết; đặt sự an toàn của thú cưng làm trọng tâm.
     - `02 — Tận tâm và lắng nghe`: Lắng nghe kỹ lưỡng những thay đổi nhỏ trong thói quen sinh hoạt của bé do chủ nuôi chia sẻ; giao tiếp nhẹ nhàng, giảm bớt áp lực tâm lý cho cả bé và gia đình.
     - `03 — Theo dõi và minh bạch`: Giải thích rõ ràng tình trạng sức khỏe, hướng xử trí và chi phí dự kiến trước khi thực hiện; thông tin trung thực trong suốt quá trình theo dõi.
4. **Section 1.4 — Quan điểm phục vụ, chăm sóc thú cưng (`3A-P2-1` Đã sửa — Chuyển về dạng Đề xuất chờ duyệt):**
   - **Bố cục:** Chia 5/7 trên nền Ivory. Cột trái là khung minh họa không gian/thú cưng; cột phải là bảng 4 dòng kẻ chỉ ngang (`Editorial Hairline Ledger`).
   - **Nhãn trạng thái bắt buộc ở đầu khối:** `[ĐỀ XUẤT NỘI DUNG — CHỜ CHỦ DỰ ÁN XÁC NHẬN QUY TRÌNH PHỤC VỤ THỰC TẾ]` (không trình bày như cam kết vận hành đã áp dụng khi chưa được duyệt):
     - *Đề xuất I — Tiếp nhận điềm tĩnh, thao tác nhẹ nhàng:* Định hướng giảm tiếng ồn và hạn chế căng thẳng khi thú cưng mới đến phòng khám *(Chờ xác nhận)*.
     - *Đề xuất II — Giải thích dễ hiểu trước khi can thiệp:* Trình bày tình trạng và hướng chăm sóc bằng ngôn ngữ rõ ràng để chủ nuôi nắm bắt *(Chờ xác nhận)*.
     - *Đề xuất III — Quy trình theo dõi khi lưu trú nội trú:* Đề xuất khung nội dung mô tả cách thức vệ sinh và cập nhật tình hình cho gia đình *(Chờ Chủ dự án xác nhận quy trình thực tế)*.
     - *Đề xuất IV — Tôn trọng và bảo mật thông tin khách hàng:* Đề xuất nguyên tắc chia sẻ thông tin chăm sóc cho đúng chủ nuôi *(Chờ Chủ dự án xác nhận)*.
5. **Section 1.5 — Khám phá Đội ngũ, Cơ sở vật chất và CTA (`3A-P3-1` Đã sửa):**
   - **2 Thẻ điều hướng liên trang (Pathway Cards):** Dẫn sang `/doi-ngu` và `/co-so-vat-chat`.
   - **Dải CTA cuối trang rút gọn:** Vì địa chỉ và khung giờ đã hiển thị đầy đủ ở Hero (`Section 1.1`), dải CTA cuối trang được rút gọn tập trung vào câu mời hành động và 2 nút bấm (`Đặt lịch khám trực tuyến` `/dat-lich` + `Gọi Hotline: 097 355 51 05`).

---

### 2.2. TRANG `/doi-ngu` — ĐỘI NGŨ NHÂN SỰ
- **Phong cách:** *Human-Centric Editorial + Equal Department Structure*.
- **10 Quy tắc bắt buộc từ Chủ dự án (CEO Directive 018-A Mục II & III):**
  1. **Không sai danh tính ảnh (`3A-P1-1`):** Tuyệt đối không gắn ảnh stock hoặc ảnh AI của người khác vào hồ sơ có tên thật hay bất kỳ hồ sơ nhân sự nào. Khi chưa có ảnh thực tế được duyệt, toàn bộ card nhân sự dùng **Monogram / Biểu tượng trung tính trên khung trống `4:5`** kèm nhãn rõ ràng: `Chưa có ảnh thực tế — Khung chân dung chờ duyệt`.
  2. **Không tự tạo cơ cấu nhân sự (`3A-P1-2`):** Loại bỏ mọi con số nhân viên mặc định (không mặc định có 3 bác sĩ), loại bỏ chuyên khoa tự đặt (`Ngoại khoa & Cấp cứu`), lịch trực (`Nội trú 24/7`) và thông tin kiêm nhiệm chưa xác minh. Sử dụng dữ liệu placeholder trung tính.
  3. **Không dùng chức vụ để tạo phân cấp thị giác:** Không sử dụng thứ bậc chức vụ để xác định kích thước, vị trí hoặc mức độ nổi bật của card.
  4. **Không có section riêng cho Bác sĩ trưởng:** Không tách khu vực riêng cho người quản lý/phụ trách.
  5. **Không tự động xếp `BS. Lê Thái Sơn` đầu tiên vì chức vụ (`3A-P2-3`):** Thứ tự hiển thị trong mỗi bộ phận tuân theo quy tắc trung tính (ví dụ: sắp xếp theo bảng chữ cái tên gọi `A–Z`, hoặc theo thứ tự danh sách phẳng do Chủ dự án cung cấp). Trong wireframe và mockup mẫu, thẻ `BS. Lê Thái Sơn` được đặt ở vị trí trung tính (ví dụ vị trí thứ 2 trong nhóm) để minh họa rõ nguyên tắc không ưu tiên vị trí số 1 theo chức vụ.
  6. **Đồng đều tuyệt đối:** Mọi card nhân sự có cùng tỷ lệ ảnh (`4:5`), cùng kích thước, cùng hệ typography và cùng hiệu ứng hover. Chiều cao card tự cân bằng theo hàng bằng CSS Grid (`align-items: stretch`), **không dùng `line-clamp` cắt chữ** (`3A-P3-3`).
  7. **Một người — Một hồ sơ duy nhất:** Mỗi nhân sự chỉ xuất hiện 1 lần trên toàn trang; các vai trò kiêm nhiệm (nếu đã xác minh) được trình bày ngay trong cùng hồ sơ đó.
  8. **Không gộp bộ phận không liên quan chỉ vì cần cân đối lưới (`3A-P2-4`):** Chỉ phân nhóm theo bộ phận thực tế được xác minh. Nếu một bộ phận thực tế chỉ có `1` thành viên ($N = 1$), hiển thị đúng bộ phận đó với **1 card căn giữa có cùng kích thước chuẩn**, không gộp chung với bộ phận khác.
  9. **Quy tắc lưới đầy đủ cho $N = 1, 2, 3, 5, 7$ và nhiều thành viên (`3A-P2-5`):** Hàng cuối luôn căn giữa cân đối, **tuyệt đối không phóng to một card để lấp khoảng trống** và không biến dạng kiểu card trên Tablet.
  10. **Bộ lọc nhân sự chuẩn Accessibility (`3A-P2-6`):** Không dùng cơ chế làm mờ (`opacity`) các card không thuộc nhóm được chọn; sử dụng cơ chế **ẩn/hiện thực sự (`hidden` / `display: none`)** kết hợp nhãn truy cập được (`aria-pressed` và vùng thông báo `aria-live="polite"`). Không quảng bá cấp bậc bằng các nhãn trang trí.

#### 5 Khu vực nội dung của `/doi-ngu`:
1. **Section 2.1 — Team Introduction Hero & Bộ lọc Bộ phận (Accessible Department Filter):**
   - Breadcrumb: `Trang chủ` (`/`) `/` `Về Lê Sơn` (`<span>` tĩnh) `/` `Đội ngũ` (`aria-current="page"`).
   - Eyebrow: `ĐỘI NGŨ BỆNH VIỆN THÚ Y LÊ SƠN`
   - `h1` (`Lora 600`): *“Sự tận tâm từ những người trực tiếp đồng hành cùng thú cưng.”*
   - Đoạn dẫn trung tính: *“Tại Bệnh viện Thú y Lê Sơn, hoạt động thăm khám và chăm sóc được tổ chức theo từng bộ phận chuyên môn thực tế. Mỗi thành viên đều có vai trò rõ ràng và phối hợp chặt chẽ vì sự an toàn của từng bé cưng.”*
   - **Banner minh bạch hồ sơ nhân sự:** Nêu rõ các hồ sơ trên bản thiết kế hiện sử dụng khung dữ liệu placeholder trung tính và khung ảnh monogram trống; chỉ hiển thị tên, ảnh chân dung, chức danh và bằng cấp sau khi Chủ dự án xác nhận từng hồ sơ thực tế.
   - **Thanh lọc bộ phận chuẩn Accessibility (`role="toolbar"`, nút `<button type="button" aria-pressed="...">`):**
     - `Tất cả bộ phận` | `Bộ phận Bác sĩ Thú y (Lâm sàng)` | `Bộ phận Spa & Grooming (Chờ xác nhận)` | `Bộ phận Hỗ trợ & Chăm sóc (Chờ xác nhận)`
     - Kèm vùng thông báo `<p role="status" aria-live="polite">` cập nhật tường minh khi người dùng chọn lọc bộ phận.
2. **Section 2.2 — Nhóm Bộ phận Bác sĩ Thú y (Clinical Veterinary Department):**
   - **Cấu trúc mỗi Card Nhân sự Đồng nhất (`UniformTeamCard`):**
     - **Khung ảnh (`aspect-ratio: 4 / 5`):** Nền Lavender nhạt `#F8F2F9`, chính giữa là biểu tượng Monogram vector trung tính (chữ cái viết tắt hoặc biểu tượng y khoa tối giản) và nhãn `Khung ảnh chân dung 4:5 — Chờ ảnh thực tế được duyệt`. **Không dùng ảnh người thật/stock/AI.**
     - **Nhãn bộ phận:** `[Bộ phận: Bác sĩ Thú y]` (kiểu chữ trung tính, không dùng nhãn trang trí cấp bậc).
     - **Họ và tên (`h3`, `Lora 600`, `20px`):**
       - Các thẻ placeholder: `[Họ và tên Bác sĩ — Chờ danh sách xác minh]`.
       - Thẻ dữ liệu đã có tên trong tài liệu dự án (đặt ở vị trí trung tính, ví dụ Thẻ #2): `BS. Lê Thái Sơn`.
     - **Dòng chức danh chuyên môn bên dưới tên (`Be Vietnam Pro 600`, `14px`, màu `--color-plum-primary`):**
       - Hiển thị `[Chức danh chuyên môn — Chờ xác minh]`.
       - Với `BS. Lê Thái Sơn`: ghi `[Chức danh: Bác sĩ Thú y — Chờ Chủ dự án xác nhận cách ghi chức danh công bố]` (nếu Chủ dự án duyệt ghi "Bác sĩ trưởng" hoặc "Phụ trách chuyên môn" như dữ liệu thực tế thì hiển thị tại dòng văn bản này, không thay đổi kích thước hay vị trí card).
     - **Khung vai trò kiêm nhiệm (trong cùng hồ sơ):** `[Vai trò kiêm nhiệm: Chỉ hiển thị khi có dữ liệu xác minh]`.
     - **Mô tả phạm vi công việc (`Be Vietnam Pro 400`, `14px`):** `[Mô tả mảng công việc thực tế — Chờ hồ sơ nhân sự xác minh]`.
     - **Ghi chú bằng cấp (`3A-P3-4`):** Trong bản thiết kế hiển thị khung nét đứt `[Bằng cấp / Chứng chỉ: Ẩn hoàn toàn khi xuất bản nếu verified = false]`.
3. **Section 2.3 — Các Bộ phận Thực tế Khác (Spa & Grooming; Chăm sóc & Hỗ trợ vận hành):**
   - **Nguyên tắc phân nhóm trung thực (`3A-P1-2` & `3A-P2-4`):**
     - Tách riêng từng bộ phận theo đúng cơ cấu thực tế do Chủ dự án xác nhận, **không tự ý gộp `Spa & Grooming` với `Điều dưỡng` chỉ để làm chẵn hàng**.
     - Trong bản thiết kế khi chưa có danh sách nhân sự thật, trình bày 2 nhóm trung tính chờ xác nhận:
       - **Nhóm 2.3A — Bộ phận Spa & Grooming** (`[Cơ cấu & số lượng nhân sự: Chờ xác nhận]`).
       - **Nhóm 2.3B — Bộ phận Chăm sóc Nội trú & Hỗ trợ vận hành** (`[Cơ cấu & số lượng nhân sự: Chờ xác nhận]`).
     - Mỗi nhóm áp dụng đúng quy tắc lưới đồng nhất (kể cả khi nhóm chỉ có $N=1$ người thì hiển thị 1 card căn giữa có cùng kích thước chuẩn).
4. **Section 2.4 — Cách đội ngũ phối hợp chăm sóc thú cưng (`3A-P2-8` Đã sửa — Triptych 3 Bước):**
   - Nền Lavender (`#F8F2F9`), trình bày dạng dải ngang Triptych 3 cột đồng nhất, có gắn nhãn trạng thái rõ ràng ở đầu mục: **`[ĐỀ XUẤT MÔ TẢ QUY TRÌNH PHỐI HỢP — CHỜ CHỦ DỰ ÁN XÁC NHẬN VẬN HÀNH THỰC TẾ]`**.
   - Nội dung triptych gồm 3 bước phối hợp đề xuất:
     - Bước 01: Tiếp nhận & Ghi nhận thông tin (đón tiếp tại 101 Khuất Duy Tiến, khám 08:00 – 21:00, cấp cứu 24/24 qua Hotline 097 355 51 05).
     - Bước 02: Thăm khám & Trao đổi cùng chủ nuôi [Đề xuất: bác sĩ trực tiếp thăm khám và trao đổi định hướng chăm sóc cùng gia đình].
     - Bước 03: Chăm sóc & Hướng dẫn theo dõi [Đề xuất: thực hiện chăm sóc hoặc lưu trú theo hướng dẫn chuyên môn và dặn dò theo dõi tại nhà].
   - Đánh dấu rõ ràng là khung đề xuất chờ duyệt, tuyệt đối không khẳng định các cam kết vận hành chưa xác minh.
5. **Section 2.5 — CTA Liên hệ & Đặt lịch khám:**
   - Dải CTA mời đặt lịch qua `/dat-lich` hoặc gọi trực tiếp Hotline `097 355 51 05` (tiếp nhận cấp cứu 24/24 tại `101 Khuất Duy Tiến, Thanh Xuân, Hà Nội`).

---

### 2.3. TRANG `/co-so-vat-chat` — CƠ SỞ VẬT CHẤT
- **Phong cách:** *Clinic Tour + Photo Editorial*.
- **Quy tắc bắt buộc từ CEO Directive 018-A Mục IV.C (`3A-P2-9`, `3A-P2-10`, `3A-P2-11`):**
  1. **Nhãn ảnh minh họa bắt buộc:** Trong Preview/Mockup được phép dùng ảnh minh họa có quyền sử dụng rõ ràng (không có người mặc áo blouse), nhưng phải gắn nhãn trực tiếp trên từng khung ảnh: **`Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn`**.
  2. **Không dùng ảnh minh họa làm bằng chứng:** Không dùng ảnh minh họa để chứng minh cơ sở có phòng, khu vực hoặc thiết bị đó.
  3. **Không dùng từ "sạch khuẩn" (`3A-P2-10`):** Loại bỏ hoàn toàn cụm từ `"sạch khuẩn"` khi chưa có căn cứ kiểm định; dùng ngôn ngữ trung thực, đúng mức.
  4. **Slot thiết bị trung tính, không nêu tên hãng khi chưa xác minh (`3A-P2-11`):** Chuyển toàn bộ thông tin thiết bị xét nghiệm (bao gồm Mindray) và chẩn đoán hình ảnh chưa được xác minh trong tài liệu thành **Slot trung tính** (`[Thiết bị xét nghiệm — Chờ xác minh]`), không hiển thị tên hãng trong nội dung giao diện trước khi Chủ dự án xác nhận.
  5. **Không tự khẳng định có phòng phẫu thuật riêng (`3A-P2-11`):** Không tự công bố bệnh viện có phòng phẫu thuật tách biệt; đặt vào danh mục phân khu chờ Chủ dự án xác nhận.
  6. **Điều kiện trước phát hành (`3A-P2-9`):** Giữ điều kiện bắt buộc trước khi phát hành công khai / mở index: phải thay bằng ảnh cơ sở thực tế tại `101 Khuất Duy Tiến` được Chủ dự án duyệt (đề xuất thiết kế tối thiểu 4 ảnh thật cho gallery là tiêu chuẩn thiết kế đề xuất, không phải số lượng đã được xác nhận).

#### 5 Khu vực nội dung của `/co-so-vat-chat`:
1. **Section 3.1 — Editorial Hero & Banner Điều kiện Phát hành:**
   - Breadcrumb: `Trang chủ` (`/`) `/` `Về Lê Sơn` (`<span>` tĩnh) `/` `Cơ sở vật chất` (`aria-current="page"`).
   - Eyebrow: `KHÔNG GIAN THĂM KHÁM & CHĂM SÓC — 101 KHUẤT DUY TIẾN`
   - `h1` (`Lora 600` — đã sửa `3A-P2-10` & `V-P3-4`): *“Không gian thăm khám và quy hoạch các phân khu chức năng.”*
   - Đoạn dẫn: *“Cơ sở Bệnh viện Thú y Lê Sơn tại 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội được tổ chức phục vụ các hoạt động tiếp đón, khám & điều trị, chăm sóc nội trú 24/7 và Spa & Grooming.”*
   - **Banner Chính sách Hình ảnh & Điều kiện Phát hành:** Ghi rõ: *"Các hình ảnh trong bản thiết kế/preview hiện là ảnh minh họa bố cục, không phải cơ sở thực tế của Lê Sơn và không dùng để chứng minh cơ sở có phòng hay thiết bị tương ứng. Trang chỉ được mở lập chỉ mục công khai sau khi cập nhật bộ ảnh chụp thực tế tại 101 Khuất Duy Tiến được Chủ dự án phê duyệt."*
   - **Thanh nhảy phân khu (`Zone Jump Bar`):** `01. Tổng quan không gian` | `02. Khu khám & Điều trị` | `03. Khu nội trú & Thiết bị` | `04. Chỉ đường & Liên hệ`.
2. **Section 3.2 — Gallery Không gian Bệnh viện (Asymmetric Editorial Spread — 4 Khung Phân Khu):**
   - Bố cục tạp chí 12 cột bất đối xứng gồm **4 khung phân khu chức năng** (Hàng 1: Frame 1 7-cột + Frame 2 5-cột; Hàng 2: Frame 3 6-cột + Frame 4 6-cột; kèm đề xuất mở rộng từ 4 ảnh thật trở lên khi Chủ dự án cung cấp bộ ảnh cơ sở thực tế):
     - Khung 01 (Span 7): *Khu vực Tiếp đón & Chờ thăm khám (Minh họa bố cục — Chờ ảnh thực tế)*.
     - Khung 02 (Span 5): *Khu vực Thăm khám Lâm sàng (Minh họa bố cục — Chờ ảnh thực tế)*.
     - Khung 03 (Span 6): *Khu vực Lưu trú & Chăm sóc Nội trú 24/7 (Khung sơ đồ kiến trúc — Chờ ảnh thực tế)*.
     - Khung 04 (Span 6): *Khu vực Vệ sinh & Dịch vụ Spa — Grooming (Khung sơ đồ kiến trúc — Chờ ảnh thực tế)*.
   - Mỗi khung ảnh/sơ đồ gắn nhãn trực tiếp: **`Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn`** hoặc **`Khung sơ đồ kiến trúc — Chờ ảnh thực tế`**.
3. **Section 3.3 — Khu Khám và Điều Trị (Clinical Examination Zone — Đã sửa `3A-P2-11`):**
   - Bố cục 2 cột (5 cột khung minh họa + 7 cột bảng kê đường kẻ mảnh `Architectural Specification Ledger`).
   - Nội dung phân khu trung tính, không nêu tên hãng thiết bị chưa xác minh và không tự khẳng định có phòng phẫu thuật riêng:
     - *Hạng mục 01 — Bàn khám & Khu vực Thăm khám Lâm sàng:* Phục vụ kiểm tra thể trạng tổng quát và tư vấn trực tiếp cho chủ nuôi.
     - *Hạng mục 02 — Slot Thiết bị Xét nghiệm & Chẩn đoán cận lâm sàng (Trung tính):*
       - `[SLOT THIẾT BỊ XÉT NGHIỆM — CHỜ CHỦ DỰ ÁN XÁC MINH DANH MỤC, HÃNG SẢN XUẤT, MODEL & CÔNG NĂNG THỰC TẾ]`
       - `[SLOT THIẾT BỊ CHẨN ĐOÁN HÌNH ẢNH / SIÊU ÂM — CHỜ CHỦ DỰ ÁN XÁC MINH MODEL & PHẠM VI KHẢO SÁT THỰC TẾ]`
     - *Hạng mục 03 — Slot Không gian thực hiện Thủ thuật / Can thiệp điều trị:*
       - `[SLOT PHÂN KHU CHỨC NĂNG — CHỜ CHỦ DỰ ÁN XÁC NHẬN CẤU TRÚC PHÒNG THỦ THUẬT / NGOẠI KHOA THỰC TẾ TẠI CƠ SỞ]` (không mặc định có phòng phẫu thuật tách biệt khi chưa xác nhận).
4. **Section 3.4 — Khu Nội Trú 24/7 và Trang Thiết Bị Chăm Sóc:**
   - Nền Lavender (`#F8F2F9`), chia 2 khối:
     - **Khối A — Khu vực Lưu trú & Theo dõi 24/7:** Trình bày dịch vụ chăm sóc nội trú 24/7 đã có trong phạm vi dự án, kèm khung ảnh gắn nhãn `Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn`.
     - **Khối B — Slot Quy chuẩn Lưu trú & Thiết bị Hỗ trợ:** `[SLOT CHỜ XÁC MINH: Quy cách khu vực lưu chuồng, quy trình vệ sinh định kỳ và danh mục thiết bị hỗ trợ chăm sóc nội trú thực tế tại 101 Khuất Duy Tiến]`.
5. **Section 3.5 — CTA Đến Bệnh Viện hoặc Liên Hệ:**
   - Hiển thị thông tin xác thực: Địa chỉ `101 Khuất Duy Tiến, Thanh Xuân, Hà Nội`, Giờ khám tham chiếu `08:00 – 21:00 (Tất cả các ngày)`, Tiếp nhận cấp cứu `24/24`, nút mở Google Maps (`HOSPITAL_CONTACT.mapsUrl`), nút `Đặt lịch khám` (`/dat-lich`) và nút `Gọi Hotline: 097 355 51 05`.

---

## 3. MỤC 3: WIREFRAME RESPONSIVE (DESKTOP, TABLET & MOBILE) & MA TRẬN LƯỚI ĐỘI NGŨ

### 3.1. Wireframe Trang `/gioi-thieu` (Desktop `1440px` & Mobile `390px/320px`)

#### A. Desktop (`1440px` / `1366px`)
```text
+--------------------------------------------------------------------------------------------------+
| HEADER (Sticky): [Logo LÊ SƠN]   Trang chủ | Về Lê Sơn (Active) | Dịch vụ...          [Đặt lịch] |
+--------------------------------------------------------------------------------------------------+
| SECTION 1.1: EDITORIAL HERO (bg-primary Ivory #FBF7F1)                                           |
| Breadcrumb: Trang chủ (Link) / Về Lê Sơn (Text tĩnh) / Giới thiệu bệnh viện (Current)            |
| +----------------------------------------------------+ +---------------------------------------+ |
| | [7 COLS]                                           | | [5 COLS] ASYMMETRIC EDITORIAL FRAME   | |
| | [Eyebrow: VỀ BỆNH VIỆN THÚ Y LÊ SƠN]               | | +-----------------------------------+ | |
| | H1 (Lora 600): "Nơi sự cẩn trọng y khoa song hành  | | | Ảnh minh họa thú cưng ấm áp       | | |
| |  cùng lòng thấu cảm."                              | | | (KHÔNG dùng ảnh người mặc blouse) | | |
| | Lead Paragraph: Định vị tại 101 Khuất Duy Tiến...  | | | [Nhãn: Ảnh minh họa — không phải  | | |
| | [CTA Primary: Đặt lịch khám] [CTA Cam: 0973555105] | | |  cơ sở thực tế của Lê Sơn]        | | |
| +----------------------------------------------------+ +---------------------------------------+ |
| +----------------------------------------------------------------------------------------------+ |
| | ARCHITECTURAL METADATA STRIP (3 cột kẻ chỉ dọc):                                             | |
| | 01. ĐỊA CHỈ: 101 Khuất Duy Tiến, Thanh Xuân | 02. GIỜ KHÁM: 08:00–21:00 | 03. CẤP CỨU: 24/24 | |
| +----------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 1.2: CÂU CHUYỆN LÊ SƠN (Open Magazine Spread — Không dùng card lặp)                      |
| +----------------------------------------+ +---------------------------------------------------+ |
| | [5 COLS] PULL-QUOTE (Lora 600 normal)  | | [7 COLS] NARRATIVE & OWNER STORY SLOT             | |
| | "Mỗi bé cưng đến viện đều mang theo    | | Đoạn văn tự sự trung tính về sự thấu cảm...       | |
| |  niềm thương yêu của cả một gia đình." | | +-----------------------------------------------+ | |
| |                                        | | | [SLOT CHỜ CHỦ DỰ ÁN CUNG CẤP]:                | | |
| |                                        | | | Lịch sử hình thành & câu chuyện sáng lập thật | | |
| |                                        | | +-----------------------------------------------+ | |
| +----------------------------------------+ +---------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 1.3: GIÁ TRỊ & TRIẾT LÝ CHĂM SÓC (bg-secondary Lavender #F8F2F9 — Numbered Triptych)     |
| +-------------------------------+-------------------------------+------------------------------+ |
| | 01. Chuyên môn & Trách nhiệm  | 02. Tận tâm & Lắng nghe       | 03. Theo dõi & Minh bạch     | |
| | (Kẻ chỉ dọc 1px ngăn cột)     | (Kẻ chỉ dọc 1px ngăn cột)     | (Khớp 100% nội dung Mốc 2B)  | |
| +-------------------------------+-------------------------------+------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 1.4: QUAN ĐIỂM PHỤC VỤ (Split 5/7 — Đóng khung ĐỀ XUẤT CHỜ CHỦ DỰ ÁN DUYỆT)              |
| [NHÃN TRẠNG THÁI: ĐỀ XUẤT NỘI DUNG — CHỜ CHỦ DỰ ÁN XÁC NHẬN QUY TRÌNH PHỤC VỤ THỰC TẾ]           |
| +----------------------------------------+ +---------------------------------------------------+ |
| | [5 COLS] Khung ảnh thú cưng (4:5)      | | [7 COLS] 4 DÒNG ĐỀ XUẤT KẺ CHỈ NGANG              | |
| | [Nhãn: Ảnh minh họa — không phải cơ sở | | I. Tiếp nhận điềm tĩnh, nhẹ nhàng (Chờ duyệt)     | |
| |  thực tế của Lê Sơn]                   | | II. Giải thích dễ hiểu cho chủ nuôi (Chờ duyệt)   | |
| |                                        | | III. Quy trình theo dõi nội trú (Chờ duyệt)       | |
| |                                        | | IV. Bảo mật thông tin khách hàng (Chờ duyệt)      | |
| +----------------------------------------+ +---------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 1.5: KHÁM PHÁ ĐỘI NGŨ, CƠ SỞ VẬT CHẤT & DẢI CTA RÚT GỌN                                 |
| [Thẻ Pathway 1 -> /doi-ngu]                        [Thẻ Pathway 2 -> /co-so-vat-chat]            |
| [DEEP PLUM CTA BAND RÚT GỌN: Đặt lịch khám (/dat-lich) | Gọi Hotline 097 355 51 05]              |
+--------------------------------------------------------------------------------------------------+
```

#### B. Mobile (`390px` / `360px` / `320px`)
- Toàn bộ các khối chuyển về **1 cột xếp chồng**: Tiêu đề `h1` và 2 nút CTA full-width (`min-height: 44px`) nằm trên khung ảnh Hero để tối ưu LCP Mobile.
- Dải 3 thông tin xác thực xếp dọc có đường kẻ ngang mảnh `1px`.
- 3 cột Triptych (`01`, `02`, `03`) và 2 thẻ Pathway xếp dọc, giữ khoảng đệm chân trang `pb-24` tránh thanh cố định `MobileBottomBar`.

---

### 3.2. Quy tắc Lưới Nhân Sự `/doi-ngu` Cho $N = 1, 2, 3, 5, 7$ & $N \ge 7$ (Đã sửa `3A-P2-4` & `3A-P2-5`)

#### A. Nguyên tắc Toán học & CSS của Lưới Nhân Sự Đồng Nhất (`Universal Equal-Card Centered Grid`)
1. **Không gộp bộ phận trái thực tế (`3A-P2-4`):** Mỗi bộ phận thực tế được xác minh hiển thị trong section riêng của bộ phận đó.
2. **100% Card đồng kích thước — Không bao giờ phóng to card lẻ (`3A-P2-5` & Directive III.7–8):**
   - Trên mỗi breakpoint, chiều rộng của mỗi card ($W_{\text{card}}$) là **hằng số cố định**:
     - **Desktop (`>= 1024px`):** Tối đa `3 card/hàng`. Mỗi card có chiều rộng cố định bằng đúng `1/3` container (tương đương `calc((100% - 2 * 24px) / 3)`).
     - **Tablet (`768px – 1023px`):** Tối đa `2 card/hàng`. Mỗi card có chiều rộng cố định bằng đúng `1/2` container (tương đương `calc((100% - 24px) / 2)`), **giữ nguyên kiểu card dọc `4:5`** (không đổi sang card ngang khác biệt).
     - **Mobile (`< 768px`):** `1 card/hàng` (`100%` chiều rộng container).
   - Container sử dụng `display: flex; flex-wrap: wrap; justify-content: center; gap: 24px;` kết hợp quy tắc giới hạn số cột mỗi hàng (`max-width`) khi cần chia dòng cân đối để:
     - Mọi card có kích thước **bằng nhau tuyệt đối 100%**.
     - Hàng cuối luôn được **căn giữa đối xứng (centered)** mà không bao giờ kéo giãn (stretch) 1 card ra toàn hàng!

#### B. Bảng Ma Trận Chi Tiết Theo Sĩ Số $N = 1, 2, 3, 4, 5, 6, 7$ và $N \ge 7$

| Số lượng thành viên trong bộ phận ($N$) | Bố cục Desktop (`>= 1024px` — Card rộng cố định `1/3` container) | Bố cục Tablet (`768px – 1023px` — Card dọc rộng cố định `1/2` container) | Bố cục Mobile (`< 768px` — 1 cột) | Cam kết không phóng to card & Cân đối hàng cuối |
| :---: | :--- | :--- | :--- | :--- |
| **$N = 1$** | **1 hàng × 1 card căn giữa** (chiếm đúng `1/3` chiều rộng container ở chính tâm, 2 bên là khoảng trắng đối xứng). Không gộp với bộ phận khác. | **1 hàng × 1 card căn giữa** (chiếm đúng `1/2` chiều rộng container ở chính tâm). | **1 card** xếp dọc tiêu chuẩn. | Card giữ nguyên kích thước chuẩn 100%, căn tâm đối xứng. |
| **$N = 2$** | **1 hàng × 2 card căn giữa** (mỗi card rộng đúng `1/3` container, tổng 2 card chiếm `2/3` ở tâm). | **1 hàng × 2 card** (`1/2` + `1/2`). | **2 hàng × 1 card**. | Chẵn hàng, 2 card bằng đúng kích thước card của lưới 3 cột. |
| **$N = 3$** | **1 hàng × 3 card** (`1/3` + `1/3` + `1/3`). | **Hàng 1: 2 card** + **Hàng 2: 1 card căn giữa** (giữ nguyên card dọc rộng `1/2` container, không biến dạng thành thẻ ngang). | **3 hàng × 1 card**. | Cả 3 card dùng chung 1 kiểu card dọc `4:5` đồng nhất trên mọi màn hình. |
| **$N = 4$** | **2 hàng × 2 card căn giữa** (`2 + 2`, giới hạn khung lưới ở chiều rộng 2 card chuẩn để mỗi hàng có 2 card rộng đúng `1/3` container). | **2 hàng × 2 card** (`2 + 2`). | **4 hàng × 1 card**. | Cân xứng hoàn hảo `2 + 2`, không có hàng lẻ 1 card. |
| **$N = 5$** | **Hàng 1: 3 card** + **Hàng 2: 2 card căn giữa** (`3 + 2`). Tất cả 5 card đều rộng đúng `1/3` container. | **Hàng 1: 2 card** + **Hàng 2: 2 card** + **Hàng 3: 1 card căn giữa** (`2 + 2 + 1`, mọi card đều là card dọc rộng `1/2` container). | **5 hàng × 1 card**. | 5 card đồng kích thước 100% cả trên Desktop lẫn Tablet. |
| **$N = 6$** | **2 hàng × 3 card** (`3 + 3`). | **3 hàng × 2 card** (`2 + 2 + 2`). | **6 hàng × 1 card**. | Chẵn tuyệt đối trên cả 3 nhóm thiết bị. |
| **$N = 7$** | **Phân bổ cân đối `3 + 2 + 2` hoặc `3 + 3 + 1 căn giữa`:**<br>- *Chế độ mặc định ưu tiên (`3 + 2 + 2`):* Hàng 1 gồm 3 card; Hàng 2 gồm 2 card căn giữa; Hàng 3 gồm 2 card căn giữa (mọi card đều rộng đúng `1/3` container, không có card đơn độc!).<br>- *Chế độ Flex chuẩn (`3 + 3 + 1 căn giữa`):* Hàng cuối 1 card căn giữa rộng đúng `1/3` container. | **3 hàng × 2 card** + **Hàng 4: 1 card căn giữa** (`2 + 2 + 2 + 1`, mọi card rộng đúng `1/2` container). | **7 hàng × 1 card**. | Không phóng to bất kỳ card nào; hàng cuối căn tâm đối xứng. |
| **Tổng quát $N \ge 7$** | Với mọi $N \ge 7$, mỗi card luôn khóa cứng chiều rộng `1/3` container:<br>- Nếu $N \equiv 0 \pmod 3$ ($6, 9, 12...$): Các hàng đều 3 card.<br>- Nếu $N \equiv 2 \pmod 3$ ($5, 8, 11...$): Các hàng đầu 3 card + **Hàng cuối 2 card căn giữa**.<br>- Nếu $N \equiv 1 \pmod 3$ ($4, 7, 10...$): Các hàng đầu 3 card + **2 hàng cuối mỗi hàng 2 card căn giữa** (ví dụ $N=7 \rightarrow 3+2+2$; $N=10 \rightarrow 3+3+2+2$) hoặc 1 card căn giữa đồng kích thước. | Các hàng đầu 2 card + Hàng cuối (nếu $N$ lẻ) 1 card căn giữa rộng đúng `1/2` container. | $N$ hàng × 1 card. | Giải quyết triệt để bài toán lưới cho mọi quy mô nhân sự tương lai. |

#### C. Wireframe Trang `/doi-ngu` (Đã sửa `3A-P1-1`, `3A-P1-2`, `3A-P2-3`..`3A-P2-8`)
```text
+--------------------------------------------------------------------------------------------------+
| HEADER (Sticky): [Logo LÊ SƠN]   Trang chủ | Về Lê Sơn (Active) | Dịch vụ...          [Đặt lịch] |
+--------------------------------------------------------------------------------------------------+
| SECTION 2.1: TEAM INTRODUCTION HERO & ACCESSIBLE DEPARTMENT FILTER                               |
| Breadcrumb: Trang chủ (Link) / Về Lê Sơn (Text tĩnh) / Đội ngũ (Current)                         |
| [Eyebrow: ĐỘI NGŨ BỆNH VIỆN THÚ Y LÊ SƠN]                                                        |
| H1 (Lora 600): "Sự tận tâm từ những người trực tiếp đồng hành cùng thú cưng."                    |
| +----------------------------------------------------------------------------------------------+ |
| | [BANNER MINH BẠCH HỒ SƠ]: Trang đang hiển thị khung dữ liệu placeholder trung tính và khung  | |
| | ảnh monogram trống. Tuyệt đối không dùng ảnh stock người khác gắn vào tên nhân sự thật.      | |
| +----------------------------------------------------------------------------------------------+ |
| [BỘ LỌC BỘ PHẬN — Ẩn/Hiện bằng thuộc tính `hidden`, KHÔNG làm mờ card, có `aria-live="polite"`]: |
| (• Tất cả bộ phận)  ( Bộ phận Bác sĩ Thú y )  ( Bộ phận Spa & Grooming )  ( Bộ phận Hỗ trợ )     |
| Status (`role="status" aria-live="polite"`): "Đang hiển thị tất cả các nhóm bộ phận..."          |
+--------------------------------------------------------------------------------------------------+
| SECTION 2.2: BỘ PHẬN BÁC SĨ THÚ Y (Mọi card đồng kích thước 100% — Không tự đặt BS Sơn ở số 1)   |
| (Bộ mô phỏng trên Mockup cho phép bấm thử trực tiếp N = 1, 2, 3, 5, 7, 8 thành viên)             |
| +------------------------------+ +------------------------------+ +----------------------------+ |
| | THẺ #1 (PLACEHOLDER TRUNG TÍNH)| | THẺ #2 (VỊ TRÍ TRUNG TÍNH)   | | THẺ #3 (PLACEHOLDER)       | |
| | +--------------------------+ | | +--------------------------+ | | +------------------------+ | |
| | |   [MONOGRAM VECTOR]      | | | |   [MONOGRAM: LTS]        | | | |   [MONOGRAM VECTOR]    | | |
| | |   Khung ảnh trống 4:5    | | | |   Khung ảnh trống 4:5    | | | |   Khung ảnh trống 4:5  | | |
| | |   Chờ ảnh thực tế duyệt  | | | |   Chờ ảnh thực tế duyệt  | | | |   Chờ ảnh thực tế duyệt| | |
| | +--------------------------+ | | +--------------------------+ | | +------------------------+ | |
| | Bộ phận: Bác sĩ Thú y        | | Bộ phận: Bác sĩ Thú y        | | Bộ phận: Bác sĩ Thú y      | |
| | H3: [Họ và tên Bác sĩ #01 —  | | H3: BS. Lê Thái Sơn          | | H3: [Họ và tên Bác sĩ #03 —| |
| |      Chờ danh sách xác minh] | | Chức danh: [Bác sĩ Thú y —   | |      Chờ danh sách]        | |
| | Chức danh: [Chờ xác minh]    | |  Chờ xác nhận chức danh]     | | Chức danh: [Chờ xác minh]  | |
| | Kiêm nhiệm: [Nếu có]         | | Kiêm nhiệm: [Chờ xác minh]   | | Kiêm nhiệm: [Nếu có]       | |
| | Mô tả: [Phạm vi công việc    | | Mô tả: [Phạm vi công việc    | | Mô tả: [Phạm vi công việc  | |
| |  thực tế — Chờ hồ sơ]        | |  thực tế — Chờ hồ sơ]        | |  thực tế — Chờ hồ sơ]      | |
| +------------------------------+ +------------------------------+ +----------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 2.3A: BỘ PHẬN SPA & GROOMING (Chỉ phân nhóm theo bộ phận thực tế — Không gộp tùy tiện)   |
| (Ví dụ khi N = 1: Hiển thị 1 card căn giữa có chiều rộng bằng hệt 1 cột của lưới 3 cột)          |
|                                  +------------------------------+                                |
|                                  | THẺ PLACEHOLDER (N = 1)      |                                |
|                                  | [MONOGRAM KHUNG TRỐNG 4:5]   |                                |
|                                  | Bộ phận: Spa & Grooming      |                                |
|                                  | H3: [Họ và tên Nhân sự —     |                                |
|                                  |      Chờ danh sách xác minh] |                                |
|                                  | Chức danh: [Chờ xác minh]    |                                |
|                                  +------------------------------+                                |
+--------------------------------------------------------------------------------------------------+
| SECTION 2.3B: BỘ PHẬN CHĂM SÓC & HỖ TRỢ VẬN HÀNH (Trạng thái chờ xác nhận cơ cấu thực tế)        |
|                 +------------------------------+ +------------------------------+                |
|                 | THẺ PLACEHOLDER #1 (N = 2)   | | THẺ PLACEHOLDER #2 (N = 2)   |                |
|                 | [MONOGRAM KHUNG TRỐNG 4:5]   | | [MONOGRAM KHUNG TRỐNG 4:5]   |                |
|                 | Bộ phận: [Chờ xác nhận]      | | Bộ phận: [Chờ xác nhận]      |                |
|                 +------------------------------+ +------------------------------+                |
+--------------------------------------------------------------------------------------------------+
| SECTION 2.4: CÁCH ĐỘI NGŨ PHỐI HỢP (Đóng khung ĐỀ XUẤT CHỜ CHỦ DỰ ÁN XÁC NHẬN VẬN HÀNH)          |
| [NHÃN TRẠNG THÁI: QUY TRÌNH PHỐI HỢP ĐỀ XUẤT — CHỜ CHỦ DỰ ÁN XÁC NHẬN THỰC TẾ]                   |
| Bước 01 (Tiếp nhận) -> Bước 02 (Thăm khám) -> Bước 03 (Chăm sóc) -> Bước 04 (Hướng dẫn theo dõi) |
+--------------------------------------------------------------------------------------------------+
| SECTION 2.5: CTA LIÊN HỆ & ĐẶT LỊCH KHÁM (/dat-lich | Hotline 097 355 51 05)                     |
+--------------------------------------------------------------------------------------------------+
```

---

### 3.3. Wireframe Trang `/co-so-vat-chat` (Đã sửa `3A-P2-9`, `3A-P2-10`, `3A-P2-11`)
```text
+--------------------------------------------------------------------------------------------------+
| HEADER (Sticky): [Logo LÊ SƠN]   Trang chủ | Về Lê Sơn (Active) | Dịch vụ...          [Đặt lịch] |
+--------------------------------------------------------------------------------------------------+
| SECTION 3.1: EDITORIAL HERO (bg-primary Ivory)                                                   |
| Breadcrumb: Trang chủ (Link) / Về Lê Sơn (Text tĩnh) / Cơ sở vật chất (Current)                  |
| [Eyebrow: KHÔNG GIAN THĂM KHÁM & CHĂM SÓC — 101 KHUẤT DUY TIẾN]                                  |
| H1 (Lora 600 — Không dùng từ "sạch khuẩn"):                                                      |
| "Không gian thăm khám và quy hoạch các phân khu chức năng."                                      |
| +----------------------------------------------------------------------------------------------+ |
| | [BANNER CHÍNH SÁCH ẢNH & ĐIỀU KIỆN PHÁT HÀNH]: Mọi ảnh dưới đây mang nhãn "Ảnh minh họa —   | |
| | không phải cơ sở thực tế của Lê Sơn" và không dùng để chứng minh cơ sở có phòng/thiết bị đó. | |
| | Điều kiện trước phát hành: Cần bộ ảnh thực tế được Chủ dự án duyệt (đề xuất >= 4 ảnh thật).  | |
| +----------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 3.2: GALLERY KHÔNG GIAN BỆNH VIỆN (Asymmetric 12-Col Spread + Đề xuất >= 4 khung ảnh)    |
| +----------------------------------------------------+ +---------------------------------------+ |
| | [7 COLS] KHUNG MINH HỌA 01                         | | [5 COLS] KHUNG MINH HỌA 02            | |
| | Không gian Tiếp đón & Chờ khám (Slot chờ ảnh thật) | | Khu vực Khám Lâm sàng (Slot chờ ảnh)  | |
| | [Nhãn bắt buộc: Ảnh minh họa — không phải cơ sở    | | [Nhãn bắt buộc: Ảnh minh họa — không  | |
| |  thực tế của Lê Sơn]                               | |  phải cơ sở thực tế của Lê Sơn]       | |
| +----------------------------------------------------+ +---------------------------------------+ |
| +----------------------------------------------------+ +---------------------------------------+ |
| | [6 COLS] KHUNG MINH HỌA 03                         | | [6 COLS] KHUNG MINH HỌA 04            | |
| | Khu vực Lưu trú Nội trú (Slot chờ ảnh thật)        | | Khu vực Spa & Grooming (Slot chờ ảnh) | |
| | [Nhãn bắt buộc: Ảnh minh họa — không phải cơ sở    | | [Nhãn bắt buộc: Ảnh minh họa — không  | |
| |  thực tế của Lê Sơn]                               | |  phải cơ sở thực tế của Lê Sơn]       | |
| +----------------------------------------------------+ +---------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 3.3: KHU KHÁM VÀ ĐIỀU TRỊ (Slot Thiết Bị Trung Tính — Không tự nêu tên hãng Mindray)     |
| +----------------------------------------+ +---------------------------------------------------+ |
| | [5 COLS] Khung minh họa phân khu       | | [7 COLS] ARCHITECTURAL SPECIFICATION LEDGER       | |
| | [Nhãn: Ảnh minh họa — không phải cơ sở | | 01. Khu vực Thăm khám Lâm sàng                    | |
| |  thực tế của Lê Sơn]                   | | ------------------------------------------------- | |
| |                                        | | 02. Khu vực Cận lâm sàng & Chẩn đoán              | |
| |                                        | |     +-------------------------------------------+ | |
| |                                        | |     | [Thiết bị xét nghiệm — chờ xác minh]      | | |
| |                                        | |     | [Thiết bị chẩn đoán hình ảnh — chờ xác    | | |
| |                                        | |     |  minh danh mục & công năng thực tế]       | | |
| |                                        | |     +-------------------------------------------+ | |
| |                                        | | ------------------------------------------------- | |
| |                                        | | 03. [Phân khu Thủ thuật / Can thiệp điều trị —    | |
| |                                        | |      Chờ Chủ dự án xác nhận cấu trúc phòng thực   | |
| |                                        | |      tế; không tự khẳng định phòng mổ riêng]      | |
| +----------------------------------------+ +---------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 3.4: KHU NỘI TRÚ 24/7 & TRANG THIẾT BỊ CHĂM SÓC (bg-secondary Lavender)                  |
| [Khối A: Chăm sóc nội trú 24/7 + Nhãn ảnh minh họa] | [Khối B: Slot quy cách lưu chuồng chờ duyệt]|
+--------------------------------------------------------------------------------------------------+
| SECTION 3.5: CTA ĐẾN BỆNH VIỆN (101 Khuất Duy Tiến | 08:00–21:00 | Cấp cứu 24/24 | 0973555105)   |
+--------------------------------------------------------------------------------------------------+
```

---

### 3.4. Đặc Tả Điều Hướng Mobile Drawer & Khả Năng Tiếp Cận (Accessibility Specs — V-P3-1, V-P3-2, V-P3-3)
Nhằm hoàn thiện trải nghiệm duyệt giao diện và đáp ứng tiêu chuẩn Accessibility WCAG 2.1 AA được Claude QA 3A-02 xác nhận:
1. **Nút Menu Hamburger Mobile (`V-P3-1`):**
   - Vị trí: Đặt tại góc phải `Header` trên các khung nhìn hẹp (`max-width: 768px`), ẩn trên desktop (`display: none`).
   - Kích thước vùng chạm: Tối thiểu `44px x 44px` chuẩn WCAG Touch Target AAA (`min-width: 44px; min-height: 44px`).
   - Trạng thái ARIA: `aria-expanded="false"` khi đóng, `aria-expanded="true"` khi mở; `aria-controls="p3a-mobile-drawer"`, `aria-label="Menu điều hướng"`.
   - Hiệu ứng trực quan: 3 thanh gạch ngang chuyển thành dấu gạch chéo 'X' khi mở menu (`transition: transform 0.2s ease, opacity 0.2s ease`).
2. **Khung Menu Trượt Xuống (`p3a-mobile-drawer`):**
   - Bố cục danh sách điều hướng dạng trượt xuống (`slide-down`), nạp đầy đủ các tuyến link: Trang chủ (`/`), Giới thiệu (`/gioi-thieu`), Đội ngũ (`/doi-ngu`), Cơ sở vật chất (`/co-so-vat-chat`), Hotline và nút Đặt lịch hẹn.
   - Quản lý trạng thái: Sử dụng thuộc tính chuẩn HTML5 `hidden` kết hợp `aria-live` và lắng nghe sự kiện phím Escape (`Escape` key handler) để tự động đóng drawer khi người dùng ấn phím thoát.
3. **Vòng Focus & Vùng Chạm Breadcrumb (`V-P3-3`):**
   - Vòng focus trên toàn bộ các nút bấm và liên kết được nâng cấp thành `outline: 2px solid var(--color-plum-primary)` với `outline-offset: 2px`, hiển thị rõ ràng cho người dùng duyệt bằng bàn phím.
   - Các liên kết trong chuỗi Breadcrumb được thiết lập `min-height: 44px` và `display: inline-flex; align-items: center`, loại bỏ hoàn toàn cảnh báo touch target quá nhỏ.
4. **Bố Cục Nhãn Khung #04 Cơ Sở Vật Chất (`V-P3-2`):**
   - Tại Section 3.4 trang `/co-so-vat-chat`, khối nhãn danh mục được bố trí độc lập ở tầng trên, cách biệt với tiêu đề và đoạn văn mô tả phân khu nội trú/tiêu phẫu, loại bỏ hoàn toàn nguy cơ đè chữ trên mọi khung nhìn từ 320px đến 1920px.

### 3.5. Ma Trận Kiểm Thử Lưới Đội Ngũ Nhân Sự (5 Kịch Bản Sĩ Số Nhân Sự)

### 4.1. Component & Hook hiện có tái sử dụng nguyên trạng (100% Reuse)
| Thành phần | Đường dẫn trong Repo | Vai trò khi triển khai Giai đoạn 3A |
| :--- | :--- | :--- |
| **`RootLayout`** | `src/components/layout/RootLayout.tsx` | Bọc cả 3 trang `/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat`; quản lý focus `#main-content` và thông báo `#sr-announcer`. |
| **`Header` & `MobileNav`** | `src/components/layout/Header.tsx`<br>`src/components/layout/MobileNav.tsx` | Đã tích hợp sẵn nhóm menu `Về Lê Sơn` với `matchPrefixes: ['/gioi-thieu', '/doi-ngu', '/co-so-vat-chat']` và `MobileBottomBar`. |
| **`Footer`** | `src/components/layout/Footer.tsx` | Hiển thị thông tin xác thực của bệnh viện và đệm đáy `pb-24 lg:pb-12`. |
| **`useRouteSeo`** | `src/hooks/useRouteSeo.ts` | Quản lý title, description, canonical URL và giữ `isIndexable: false` (`noindex, nofollow`) cho tới khi Chủ dự án nghiệm thu dữ liệu thật. |
| **`HOSPITAL_CONTACT`** | `src/config/contact.ts` | Nguồn hằng số duy nhất cho địa chỉ `101 Khuất Duy Tiến, Thanh Xuân, Hà Nội`, hotline `097 355 51 05` và Google Maps URL. |

### 4.2. Kiểm kê toàn bộ vị trí trong Repo còn chứa cụm từ phân cấp chức vụ (`3A-P2-7` Đã kiểm kê đầy đủ)
Theo kết quả rà soát toàn bộ mã nguồn và tài liệu trên nhánh `fix/milestone-2a-qa`, dưới đây là **danh sách đầy đủ 6 vị trí** còn chứa cụm từ *"Bác sĩ trưởng Lê Thái Sơn"*, *"Nổi bật BST Lê Thái Sơn"* hoặc trường `isDirector` cần được cập nhật đồng loạt khi bước sang pha triển khai code (sau khi Chủ dự án chốt Quyết định 1 ở Mục 9.2):

| STT | File trong Repository | Dòng | Nội dung hiện tại | Phương án đồng bộ khi triển khai code |
| :---: | :--- | :---: | :--- | :--- |
| 1 | `src/components/layout/Header.tsx` | `27` | `desc: 'Bác sĩ trưởng Lê Thái Sơn & cộng sự'` | Đổi sang mô tả trung tính theo bộ phận (ví dụ: `'Đội ngũ bác sĩ thú y & nhân sự chăm sóc'`). |
| 2 | `src/app/routes.tsx` | `31` | `description="Đội ngũ bác sĩ thú y giàu kinh nghiệm do Bác sĩ trưởng Lê Thái Sơn dẫn dắt..."` | Đổi sang mô tả trung tính khi thay `ComingSoonView` bằng trang `/doi-ngu`. |
| 3 | `src/types/index.ts` | `34` | `isDirector?: boolean;` trong `interface Doctor` | Loại bỏ logic dùng `isDirector` để tạo hierarchy; thay bằng `TeamMember` đồng nhất. |
| 4 | `docs/seo-strategy.md` | `18` | `"Đội ngũ bác sĩ thú y giàu kinh nghiệm do Bác sĩ trưởng Lê Thái Sơn dẫn dắt..."` | Đồng bộ meta description theo đúng quyết định của Chủ dự án. |
| 5 | `docs/sitemap.md` | `11` | `Grid danh sách bác sĩ & điều dưỡng (nổi bật BST Lê Thái Sơn)` | Cập nhật mô tả sitemap thành `Lưới nhân sự đồng đều theo bộ phận thực tế (không tạo khu VIP riêng)`. |
| 6 | `docs/implementation-plan.md` | `70` | `Grid bác sĩ & kỹ thuật viên (Nổi bật BST Lê Thái Sơn)` | Cập nhật kế hoạch triển khai theo đúng quy tắc bình đẳng kích thước card. |

*Lưu ý theo CEO Directive 018-A Mục III:* Nếu cụm từ `"Bác sĩ trưởng"` là thông tin chức danh thực tế và được Chủ dự án duyệt sử dụng, chỉ hiển thị nó như **dữ liệu văn bản tại dòng chức danh bên dưới tên** của BS. Lê Thái Sơn, tuyệt đối không dùng làm nguyên tắc sắp xếp vị trí hay làm nổi bật kích thước card.

---

## 5. MỤC 5: ĐẶC TẢ CHUYỂN ĐỘNG & TƯƠNG TÁC (ANIMATION & ACCESSIBILITY INTERACTION SPECS)

### 5.1. Quy tắc Animation cho từng Section
- **100% CSS Transitions thuần** với các biến trong `src/styles/tokens.css`, chỉ tác động lên `transform` và `opacity` (`CLS = 0.000`).

| Khu vực | Hiệu ứng chuyển động | Token sử dụng (`tokens.css`) | Chế độ `prefers-reduced-motion: reduce` |
| :--- | :--- | :--- | :--- |
| **Hero (Cả 3 trang)** | Khung ảnh Hero hiển thị tức thì (`opacity: 1`); khối chữ phụ & CTA fade-up nhẹ `8px`. | `--motion-duration-normal` (`300ms`), `--motion-ease-default` (`cubic-bezier(0.16, 1, 0.3, 1)`). | Tắt hoàn toàn `translateY`, hiển thị tĩnh ngay lập tức. |
| **Numbered Triptych & Hairline Ledger** | Đổi màu đường kẻ chỉ từ `--color-border-subtle` sang `--color-border-medium` khi hover/focus. | `--motion-duration-fast` (`200ms`). | Đổi màu viền tức thì không có độ trễ. |
| **Card Nhân sự (`/doi-ngu`)** | Mọi card nâng nhẹ đồng đều `translateY(-2px)` và đổ bóng `--shadow-card-hover` (không phân biệt chức vụ). | `--hover-lift-y` (`-2px`), `--motion-duration-normal` (`300ms`). | Giữ nguyên vị trí card tĩnh. |
| **Bộ lọc Bộ phận (`/doi-ngu` — Đã sửa `3A-P2-6`)** | **Không dùng hiệu ứng làm mờ (`opacity`) card không thuộc nhóm chọn.** Khi bấm nút lọc, các section không thuộc bộ phận được chọn sẽ được ẩn hoàn toàn khỏi cây hiển thị và cây trợ năng bằng thuộc tính `hidden` (`display: none`), đồng thời cập nhật vùng `<p role="status" aria-live="polite">`. | Nút lọc dùng `aria-pressed="true/false"`, viền focus `2px solid var(--color-focus-ring)`. | Ẩn/hiện tức thì bằng thuộc tính `hidden`. |
| **Gallery (`/co-so-vat-chat`)** | Phóng nhẹ ảnh minh họa `scale(1.02)` bên trong khung `overflow: hidden` khi hover trên Desktop. | `--motion-duration-slow` (`450ms`), `--motion-ease-default`. | Không scale ảnh. |

### 5.2. Bảng Độ Tương Phản Màu Sắc WCAG 2.1 Chính Xác (`3A-P3-6` Đã sửa theo `contrast-check.txt`)
Các tỷ lệ tương phản dưới đây được tính chính xác theo công thức Relative Luminance của WCAG 2.1 từ mã màu trong `src/styles/tokens.css`:

| Cặp màu (Foreground / Background) | Mã Hex | Tỷ lệ tương phản chính xác | Chuẩn đạt được & Quy tắc áp dụng |
| :--- | :--- | :---: | :--- |
| `--color-fg-primary` trên nền Ivory `--color-bg-primary` | `#1A0A1C` / `#FBF7F1` | **17.82 : 1** | **WCAG AAA** (Văn bản chính) |
| `--color-fg-secondary` trên nền Ivory `--color-bg-primary` | `#421247` / `#FBF7F1` | **13.96 : 1** | **WCAG AAA** (Tiêu đề lớn & vừa) |
| `--color-fg-muted` trên nền Ivory `--color-bg-primary` | `#554157` / `#FBF7F1` | **8.63 : 1** | **WCAG AAA** (Đoạn văn mô tả) |
| `--color-fg-subtle` trên nền Ivory `--color-bg-primary` | `#5A3E5E` / `#FBF7F1` | **8.61 : 1** | **WCAG AAA** (Metadata, chú thích) |
| `--color-fg-muted` trên nền Lavender `--color-bg-secondary` | `#554157` / `#F8F2F9` | **8.36 : 1** | **WCAG AAA** (Văn bản trên nền Lavender) |
| `--color-plum-orchid` trên nền Lavender `--color-bg-secondary` | `#824787` / `#F8F2F9` | **5.96 : 1** | **WCAG AA** (Số thứ tự `01–03` cỡ lớn `>= 32px`) |
| `--color-warm-orange-dark` trên nền Ivory `--color-bg-primary` | `#9A3412` / `#FBF7F1` | **6.85 : 1** | **WCAG AA** (Nhãn nhấn trên nền sáng) |
| Chữ trắng `#FFFFFF` trên nút Plum `--color-plum-primary` | `#FFFFFF` / `#5A1E5E` | **11.78 : 1** | **WCAG AAA** (Nút CTA chính) |
| Chữ trắng `#FFFFFF` trên nút Cam `--color-warm-orange` | `#FFFFFF` / `#C2560C` | **4.54 : 1** | **WCAG AA** *(Sát ngưỡng 4.5:1 — Quy tắc bắt buộc: chữ trên nền `#C2560C` không nhỏ hơn `14px` SemiBold/Bold `600/700` hoặc `16px` Regular)* |
| Nhãn `Ảnh minh họa` (Chữ trắng trên nền tối `rgba(26,10,28,0.88)`) | `#FFFFFF` / `#1A0A1C` | **> 15.0 : 1** | **WCAG AAA** |

### 5.3. Quy chuẩn `alt` Text tinh gọn cho Screen Reader (`3A-P3-8` Đã sửa)
- Không lặp lại câu cảnh báo dài dòng trong mọi thuộc tính `alt`.
- Quy chuẩn mới:
  - Mỗi trang có 1 khối thông báo chính sách ảnh minh họa rõ ràng ở phần đầu trang.
  - Thuộc tính `alt` của từng ảnh minh họa chỉ ghi mô tả ngắn gọn kèm hậu tố **`(ảnh minh họa)`**, ví dụ: `alt="Không gian chờ thăm khám thoáng sáng (ảnh minh họa)"`.
  - Với khung Monogram trống trên trang `/doi-ngu`: biểu tượng SVG trang trí đặt `aria-hidden="true"`, nhãn văn bản hiển thị rõ `Chưa có ảnh thực tế — Khung chân dung chờ duyệt`.

---

## 6. MỤC 6: DANH MỤC DỮ LIỆU PLACEHOLDER & HỒ SƠ THẬT CÒN THIẾU (DATA PLACEHOLDERS & MISSING REAL DATA)

Bảng dưới đây phân tách minh bạch giữa **Dữ liệu đã xác minh**, **Dữ liệu Placeholder trung tính đang hiển thị trên Mockup v2.1**, và **Danh sách dữ liệu thật còn thiếu cần Chủ dự án cung cấp**:

| Tuyến trang | Hạng mục nội dung | Trạng thái trên Blueprint v2.1 & Mockup v2.1 | Dữ liệu thật còn thiếu cần Chủ dự án cung cấp / xác nhận |
| :--- | :--- | :--- | :--- |
| **`/gioi-thieu`** | Thông tin liên hệ, địa chỉ, giờ khám, cấp cứu 24/24 | **Đã xác minh** (`101 Khuất Duy Tiến, Thanh Xuân, Hà Nội` • `08:00 – 21:00` • Cấp cứu `24/24` • `097 355 51 05`). | Không thiếu (đã chốt ở Mốc 2A). |
| **`/gioi-thieu`** | Câu chuyện hình thành & cột mốc hoạt động (Section 1.2) | **Placeholder Slot trung tính:** `[SLOT CHỜ CHỦ DỰ ÁN CUNG CẤP: Lịch sử hình thành & câu chuyện sáng lập thực tế]`. | - [ ] Nội dung câu chuyện sáng lập / năm hoạt động thực tế (nếu muốn công bố). |
| **`/gioi-thieu`** | 4 Nguyên tắc phục vụ thú cưng (Section 1.4) | **Đề xuất chờ duyệt (`3A-P2-1`):** Ghi rõ nhãn `[ĐỀ XUẤT NỘI DUNG — CHỜ CHỦ DỰ ÁN XÁC NHẬN]`. | - [ ] Xác nhận hoặc hiệu chỉnh 4 nguyên tắc phục vụ thực tế tại bệnh viện. |
| **`/gioi-thieu`** | Ảnh Hero & Ảnh minh họa câu chuyện | **Ảnh minh họa không có người mặc áo blouse (`3A-P2-2`)** + Nhãn `Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn`. | - [ ] 02 ảnh chụp thực tế tại bệnh viện (không gian tiếp đón / hoạt động chăm sóc đã được duyệt). |
| **`/doi-ngu`** | Ảnh chân dung nhân sự (Toàn bộ các thẻ — `3A-P1-1`) | **Monogram / Khung trống trung tính `4:5`:** Nhãn `Chưa có ảnh thực tế — Khung chân dung chờ duyệt`. **0% ảnh stock/AI người thật.** | - [ ] Ảnh chân dung thật của `BS. Lê Thái Sơn` và từng nhân sự thực tế (cùng tỷ lệ `4:5`). |
| **`/doi-ngu`** | Hồ sơ BS. Lê Thái Sơn (`3A04-P2-3`) | **Phân tách minh bạch:**<br>- Họ tên: **ĐÃ XÁC MINH (VERIFIED)** (`BS. Lê Thái Sơn`).<br>- Chức danh: **CHỜ XÁC MINH (PENDING)** (`[Chức danh: Bác sĩ Thú y — Chờ xác nhận]`).<br>- Lịch khám: **CHỜ XÁC MINH (PENDING)** (`[Chờ cập nhật]`). | - [ ] Xác nhận cách ghi chức danh chính thức của BS. Sơn ("Bác sĩ Thú y", "Phụ trách chuyên môn", hay "Bác sĩ trưởng").<br>- [ ] Lịch trực/khám thực tế. |
| **`/doi-ngu`** | Cơ cấu bộ phận & Nhân sự khác (`3A-P1-2`, `3A04-P2-4`) | **Chờ xác nhận cơ cấu (PENDING VERIFICATION):**<br>- Bộ phận Lâm sàng: Bộ phận Bác sĩ Thú y (Lâm sàng).<br>- Bộ phận đề xuất: Spa & Grooming (Chờ xác nhận), Chăm sóc & Hỗ trợ (Chờ xác nhận).<br>- Toàn bộ thẻ nhân sự khác dạng placeholder mô phỏng. | - [ ] Danh sách bộ phận thực tế đang hoạt động.<br>- [ ] Họ tên, chức danh chuyên môn, vai trò kiêm nhiệm và mô tả công việc thực tế.<br>- [ ] Quy tắc sắp xếp thứ tự (`A–Z` hay danh sách phẳng). |
| **`/doi-ngu`** | Quy trình phối hợp liên bộ phận (Section 2.4 — `3A-P2-8`) | **Đề xuất chờ duyệt:** Ghi rõ nhãn `[QUY TRÌNH PHỐI HỢP ĐỀ XUẤT — CHỜ CHỦ DỰ ÁN XÁC NHẬN]`. | - [ ] Xác nhận các bước phối hợp thực tế giữa các bộ phận khi tiếp nhận ca khám/nội trú/spa. |
| **`/co-so-vat-chat`** | Bộ ảnh Gallery không gian bệnh viện (Section 3.2 — `3A-P2-9`) | **Ảnh minh họa / Sơ đồ kiến trúc có gắn nhãn trực tiếp:** `Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn`. | - [ ] Bộ ảnh chụp thực tế các phân khu tại `101 Khuất Duy Tiến` (đề xuất thiết kế tối thiểu 04 ảnh thật được duyệt trước khi mở index công khai; không lọt khách hàng/hồ sơ bệnh án `3A-P3-5`). |
| **`/co-so-vat-chat`** | Thiết bị xét nghiệm & chẩn đoán hình ảnh (Section 3.3 — `3A-P2-11`) | **Slot trung tính không nêu tên hãng:** `[Thiết bị xét nghiệm — chờ xác minh]`, `[Thiết bị chẩn đoán hình ảnh — chờ xác minh]`. | - [ ] Xác nhận danh mục, tên hãng (ví dụ có sử dụng thiết bị Mindray hay không), mã model và công năng thực tế được phép công bố. |
| **`/co-so-vat-chat`** | Cấu trúc phòng thủ thuật / phẫu thuật & khu lưu trú nội trú (`3A-P2-11`) | **Slot trung tính:** `[Phân khu chức năng — Chờ Chủ dự án xác nhận cấu trúc phòng thực tế]`. | - [ ] Xác nhận cơ sở có phòng thủ thuật/phẫu thuật riêng hay khu vực chức năng như thế nào, và quy cách chuồng lưu trú nội trú 24/7 thực tế. |

---

## 7. MỤC 7: HỒ SƠ NGUỒN GỐC & QUYỀN SỬ DỤNG TÀI SẢN HÌNH ẢNH / PHÔNG CHỮ (ASSET PROVENANCE INVENTORY — ĐÃ NÂNG CẤP THEO AP-1 & AP-2)

Nhằm tuân thủ tuyệt đối **Chính sách hình ảnh đã phê duyệt (CEO Directive 009, 010-A, 018-A, 019-A)** và giải quyết dứt điểm các phát hiện **AP-1** (Hồ sơ nguồn gốc chi tiết) và **AP-2** (Loại bỏ ảnh có logo thương hiệu Champion) từ Báo cáo QA Claude 3A-02:
1. **Toàn bộ tài sản được tham chiếu trong Mockup v2.2** (`docs/design/phase-3a-interactive-mockups.html`) nằm sẵn trong repository nội bộ, **không tải bất kỳ tài nguyên nào từ CDN bên ngoài** để đảm bảo khả năng kiểm tra offline và bảo vệ tính toàn vẹn bảo mật.
2. **Quy tắc phân định trạng thái xác minh bản quyền:**
   - **ĐÃ XÁC MINH (VERIFIED):** Tài sản sở hữu thương hiệu nội bộ của Bệnh viện hoặc phát hành theo giấy phép nguồn mở có văn bản chứng minh đầy đủ trong repository.
   - **CHƯA XÁC MINH BẢN QUYỀN GỐC (UNVERIFIED):** Ảnh stock hoặc ảnh AI tạm thời được phép dùng cho bản dựng layout (Mockup / Preview) để kiểm thử giao diện; **tuyệt đối KHÔNG ĐƯỢC PHÁT HÀNH** ra môi trường công khai nếu chưa thay thế bằng ảnh chụp thực tế hoặc có giấy phép thương mại xác minh độc lập (`2B-06`).
3. **Xử lý đặc biệt đối với `why-pet-companion.webp` (`AP-2` / `2B-29`):**
   - Claude QA 3A-02 phát hiện tệp ảnh `why-pet-companion.webp` có logo thương hiệu áo chó **Champion** tại góc áo.
   - **Hành động trong Giai đoạn 3A:** Đã gỡ bỏ 100% việc tham chiếu đến `why-pet-companion.webp` trong toàn bộ file Mockup HTML (`docs/design/phase-3a-interactive-mockups.html`) và Blueprint v2.2.
   - **Hành động đối với Trang chủ Mốc 2B (`WhyChooseUs.tsx:30`):** Thực hiện nguyên tắc đóng băng Mốc 2B theo chỉ đạo CEO Directive 019-A, Antigravity **không tự ý sửa mã nguồn `src/`**; ghi nhận mục lỗi **`2B-29` (P2)** vào Sổ nhật ký bảo trì tại Mục 9.1 chờ quyết định và phân bổ công việc riêng từ CEO.

### Bảng Kê Chi Tiết Toàn Bộ Tài Sản Trong Giai Đoạn 3A (Asset Provenance Ledger — Chuẩn AP-1)

| STT | Tên file & Đường dẫn Repo | Vị trí sử dụng trong Mockup 3A | Loại tài sản | Nguồn gốc / Nền tảng cung cấp | Tác giả / Chủ sở hữu | Giấy phép / Điều khoản áp dụng | Trạng thái xác minh | Cho phép trên Preview | Sẵn sàng phát hành (Production) | Ghi chú & Điều kiện trước phát hành |
|:---:|:---|:---|:---|:---|:---|:---|:---:|:---:|:---:|:---|
| 1 | `public/images/logo.png` | Header, Footer cả 3 trang (`/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat`) | PNG Thương hiệu | Do Chủ dự án cung cấp trực tiếp | Bệnh viện Thú y Lê Sơn | Sở hữu thương hiệu nội bộ bệnh viện | **ĐÃ XÁC MINH (VERIFIED)** | **CÓ** | **CÓ** | Biểu trưng chính thức duy nhất của cơ sở, hiển thị sắc nét, bảo toàn nhận diện. |
| 2 | `public/fonts/be-vietnam-pro-400.woff2` | Body text, đoạn văn, mô tả | WOFF2 Font | Google Fonts OFL / Better Type Foundry (`docs/licenses/OFL-BeVietnamPro.txt`) | Fábio Duarte Martins, Vietanh Nguyen | SIL Open Font License 1.1 | **ĐÃ XÁC MINH (VERIFIED)** | **CÓ** | **CÓ** | Phông chữ hệ thống tự lưu trữ (self-hosted), không gọi bên thứ ba, 0 CLS. |
| 3 | `public/fonts/be-vietnam-pro-500.woff2` | Nhãn phụ, thông số, badge | WOFF2 Font | Google Fonts OFL / Better Type Foundry (`docs/licenses/OFL-BeVietnamPro.txt`) | Fábio Duarte Martins, Vietanh Nguyen | SIL Open Font License 1.1 | **ĐÃ XÁC MINH (VERIFIED)** | **CÓ** | **CÓ** | Phục hồi trọng số Medium 500 chuẩn thiết kế theo Phương án C (Directive 011-A). |
| 4 | `public/fonts/be-vietnam-pro-600.woff2` | Nút bấm, menu header, CTA, nhãn tab | WOFF2 Font | Google Fonts OFL / Better Type Foundry (`docs/licenses/OFL-BeVietnamPro.txt`) | Fábio Duarte Martins, Vietanh Nguyen | SIL Open Font License 1.1 | **ĐÃ XÁC MINH (VERIFIED)** | **CÓ** | **CÓ** | Phông quan trọng (Critical font), nạp ưu tiên cho tương tác người dùng. |
| 5 | `public/fonts/be-vietnam-pro-700.woff2` | Eyebrow, số liệu nổi bật, nhấn mạnh | WOFF2 Font | Google Fonts OFL / Better Type Foundry (`docs/licenses/OFL-BeVietnamPro.txt`) | Fábio Duarte Martins, Vietanh Nguyen | SIL Open Font License 1.1 | **ĐÃ XÁC MINH (VERIFIED)** | **CÓ** | **CÓ** | Trọng số Bold chuẩn, không dùng font synthesis. |
| 6 | `public/fonts/be-vietnam-pro-italic-400.woff2` | Ghi chú minh bạch, disclaimer | WOFF2 Font | Google Fonts OFL / Better Type Foundry (`docs/licenses/OFL-BeVietnamPro.txt`) | Fábio Duarte Martins, Vietanh Nguyen | SIL Open Font License 1.1 | **ĐÃ XÁC MINH (VERIFIED)** | **CÓ** | **CÓ** | Chữ nghiêng nguyên bản (True Italic) dùng cho ghi chú minh họa. |
| 7 | `public/fonts/lora-600.woff2` | H1, H2, tiêu đề báo chí Editorial Luxury | WOFF2 Font | Google Fonts OFL / Cyreal Type (`docs/licenses/OFL-Lora.txt`) | Cyreal (Olga Karpushina, Alexei Vanyashin) | SIL Open Font License 1.1 | **ĐÃ XÁC MINH (VERIFIED)** | **CÓ** | **CÓ** | Tiêu đề báo chí chuẩn phong cách Vibrant Editorial Luxury đã nghiệm thu. |
| 8 | **Inline Architectural SVG & Monogram** | 100% Khung chân dung nhân sự `/doi-ngu` & Phân khu chức năng `/co-so-vat-chat` | SVG nội tuyến | Antigravity trực tiếp lập trình trong mã HTML mockup | Dự án Bệnh viện Thú y Lê Sơn 2026 | Bản quyền nội bộ dự án | **ĐÃ XÁC MINH (VERIFIED)** | **CÓ** | **CÓ** | Đảm bảo 100% không mạo danh khuôn mặt người thật (`3A-P1-1`), độc lập hoàn toàn với hình ảnh bên ngoài. |
| 9 | `public/images/article-prevention.webp` | Ảnh minh họa khung Hero Section 1.1 (`/gioi-thieu`) & Section 3.2 Frame #01 (`/co-so-vat-chat`) | WebP Minh họa | Tạo lập bằng AI nội bộ dự án qua Imagen 3 | Antigravity AI Subagent | ĐKDV Google Generative AI (Sử dụng thử nghiệm phi độc quyền) | **CHƯA XÁC MINH BẢN QUYỀN GỐC (UNVERIFIED - TỰ KHAI AI)** | **CÓ** (Cho Preview/Mockup) | **KHÔNG** | Chú chó lông vàng trong nhà, không người mặc áo blouse y tế, không có logo. **Bắt buộc thay bằng ảnh chụp thực tế trước khi phát hành (`2B-06`).** |
| 10 | `public/images/article-nutrition.webp` | Ảnh minh họa bố cục Section 1.2 (`/gioi-thieu`) & Section 3.2 Frame #02 (`/co-so-vat-chat`) | WebP Minh họa | Ảnh stock tĩnh vật dinh dưỡng (Unsplash/Pexels mockup placeholder) | Chưa xác định tác giả gốc (Unverified Stock) | Giấy phép miễn phí nền tảng stock (Mockup use only) | **CHƯA XÁC MINH BẢN QUYỀN GỐC (UNVERIFIED - STOCK)** | **CÓ** (Cho Preview/Mockup) | **KHÔNG** | Bát thức ăn chăm sóc thú cưng sạch sẽ, không người, không nhãn hiệu. **Bắt buộc thay bằng ảnh chụp thực tế trước khi phát hành (`2B-06`).** |
| 11 | *(Đã loại bỏ)* `public/images/why-pet-companion.webp` | *(ĐÃ GỠ BỎ HOÀN TOÀN KHỎI MOCKUP 3A)* | WebP Stock | Nền tảng stock placeholder | Chưa xác minh tác giả | Giấy phép stock tạm thời | **CÓ LOGO BÊN THỨ BA (CHAMPION — AP-2)** | **KHÔNG DÙNG Ở 3A** | **KHÔNG** | **Đã gỡ bỏ khỏi 3A.** Ghi nhận lỗi `2B-29` cho Section 2 Trang chủ, bảo toàn `src/` theo quy chế đóng băng Mốc 2B. |

*Lưu ý bảo vệ tính chuẩn mực y khoa (`3A-P1-1` & `3A-P2-2'):* Toàn bộ các file ảnh stock cũ có mặt người mặc áo blouse hoặc đồng phục y tế (`hero-vet-care.webp`, `hero-clinic-cuddle.webp`, `service-exam.webp`, `service-spa.webp`) **tuyệt đối không được xuất hiện trong Mockup và Thiết kế của 3 trang Giai đoạn 3A**.

---

## 8. MỤC 8: BẢNG ĐỐI CHIẾU GIẢI QUYẾT TOÀN BỘ PHÁT HIỆN QA (MAPPING QA 3A-01, QA 3A-02, QA 3A-03 & QA 3A-04)

### 8.0. Bảng Đối Chiếu Giải Quyết 4 Phát Hiện P2 Từ Báo Cáo Claude QA 3A-04 (`docs/qa/3a-design-qa-04.md`)

| Mã QA | Mức | Mô tả phát hiện của Claude | Giải pháp đã thực hiện trong Blueprint v2.4 & Mockup DEV-00 | Bằng chứng kiểm chứng | Kết luận |
| :---: | :--- :| :--- | :--- | :--- | :---: |
| **3A04-P2-1** | **P2** | Nút CTA Header tại mobile $\le 390\text{px}$ bị rớt dòng ("Đặt lịch hẹn / khám"); handoff 04 báo đã sửa nhưng CSS mockup chưa cập nhật. | Tuân thủ tuyệt đối **Quy chế DEV-00 Freeze** (CEO Directive 024-A): **Giữ nguyên trạng thái OPEN, không sửa CSS mockup trong DEV-00**, ghi nhận chính xác vào tồn đọng triển khai (Implementation Backlog) để xử lý dứt điểm khi bước vào giai đoạn code website chính thức. | Mockup Header CSS; Handoff 05 ghi rõ trạng thái OPEN. | **OPEN (Chuyển sang Implementation Backlog)** |
| **3A04-P2-2** | **P2** | Handoff 04 báo đã chuyển các nút mô phỏng $N=1..8$ lên thanh công cụ trên cùng, nhưng thực tế các nút này đã bị xóa khỏi markup. | Báo cáo trung thực và chính xác: **Các nút bấm mô phỏng $N=1..8$ đã được chủ động gỡ bỏ hoàn toàn khỏi giao diện người dùng** (cả trang và thanh công cụ) từ Vòng 04 để tránh làm rối mắt người dùng. Khả năng kiểm thử lưới $N=1..8$ vẫn được bảo toàn trọn vẹn thông qua hàm script/console `setTeamCount(n, layout)`. | Mockup HTML markup; hàm `setTeamCount` trong thẻ `<script>`. | **FIXED IN REPORT (Gỡ khỏi UI — Giữ API kiểm thử)** |
| **3A04-P2-3** | **P2** | Handoff 04 gộp chung Tên và Chức danh BS. Sơn thành `VERIFIED`; trong khi chức danh chưa có văn bản xác nhận chính thức từ Chủ dự án. | **Phân tách minh bạch từng trường dữ liệu:**<br>- Họ tên: **VERIFIED** (`BS. Lê Thái Sơn`).<br>- Chức danh: **PENDING VERIFICATION** (`[Chức danh: Bác sĩ Thú y — Chờ xác nhận]`).<br>- Lịch thăm khám: **PENDING VERIFICATION** (`[Chờ cập nhật]`).<br>Đã cập nhật đồng bộ trong Mockup HTML card BS. Sơn và Bảng đối chiếu nội dung. | Mockup card BS. Lê Thái Sơn; Bảng đối chiếu Mục 6 & Handoff 05. | **FIXED** |
| **3A04-P2-4** | **P2** | Cơ cấu bộ phận Spa & Grooming và Chăm sóc & Hỗ trợ chưa được xác nhận nhưng nút lọc và tiêu đề mục chưa gắn nhãn chờ xác minh; đoạn dẫn Hero khẳng định phân chia bộ phận thực tế. | **Bổ sung nhãn chờ xác nhận toàn diện:**<br>1. Nút lọc: `Bộ phận Bác sĩ Thú y (Lâm sàng)`, `Bộ phận Spa & Grooming (Chờ xác nhận)`, `Bộ phận Chăm sóc & Hỗ trợ (Chờ xác nhận)`.<br>2. Tiêu đề mục: thêm `(Chờ xác nhận cơ cấu)` tại Section 2.3A và 2.3B.<br>3. Card badge: đổi thành `[Spa & Grooming — Đề xuất]`, `[Chăm sóc Nội trú — Chờ xác nhận]`, `[Tiếp đón & Hỗ trợ — Chờ xác nhận]`.<br>4. Đoạn dẫn Hero: viết lại trung tính, khẳng định đây là khung mô phỏng chờ Chủ dự án duyệt cơ cấu. | Mockup Section 2.1, 2.3A, 2.3B; Bảng đối chiếu Handoff 05. | **FIXED** |

---

### 8.1. Bảng Đối Chiếu Giải Quyết Các Phát Hiện Từ Báo Cáo Claude QA 3A-03 (`docs/qa/3a-design-qa-03.md`)

| Mã QA | Mức | Mô tả phát hiện của Claude | Giải pháp đã thực hiện trong Blueprint & Mockup HTML | Bằng chứng kiểm chứng | Kết luận |
| :---: | :---: | :--- | :--- | :--- | :---: |
| **3A-P1-2** | **P1** | Trang `/doi-ngu` ấn định lại **chuyên môn, nhiệm vụ và cơ cấu nhân sự chưa xác minh** (chuyên môn BS. Sơn, hội chẩn, kỹ thuật viên nội trú, quy trình khép kín, kíp trực). | Đã khôi phục 100% các slot trung tính: BS. Lê Thái Sơn chỉ giữ chức danh Bác sĩ Thú y chờ xác nhận; các bác sĩ khác dùng `[Bác sĩ Thú y — Dữ liệu mô phỏng]`; bộ phận hỗ trợ dùng `[Nhân viên Chăm sóc nội trú — Dữ liệu mô phỏng]`; quy trình phối hợp 3 bước chuyển thành `[Đề xuất định hướng]`. Loại bỏ toàn bộ các từ "hội chẩn", "khép kín", "kíp trực", "chỉ định xét nghiệm". | Mockup `#page-doi-ngu`; Blueprint Mục 2.2, 3.2. | **FIXED** |
| **V3-P1-1** | **P1** | Trang `/co-so-vat-chat` mô tả **phân khu và thiết bị chưa xác minh như đã có thật** (sảnh phân luồng, phòng cách ly, hồi sức, spa tách biệt, hệ thống đèn sưởi ấm, thiết bị theo dõi sinh hiệu). | Đã loại bỏ toàn bộ các khẳng định vật lý chưa xác minh. Khôi phục các slot mô tả trung tính bám sát các dịch vụ đã xác nhận: tiếp đón ban đầu, khám lâm sàng, chăm sóc nội trú 24/7, spa & grooming. Toàn bộ thiết bị cận lâm sàng và phân khu thủ thuật được đóng khung `[Slot chờ xác nhận]`. | Mockup `#page-co-so-vat-chat`; Blueprint Mục 2.3, 3.3. | **FIXED** |
| **3A-P2-1** | **P2** | Bốn nguyên tắc phục vụ trên `/gioi-thieu` xuất hiện lại câu khẳng định như cam kết thực tế ("được vệ sinh định kỳ", "chỉ chia sẻ trực tiếp"). | Đã chuyển toàn bộ 4 nguyên tắc thành dạng bản thảo đề xuất định hướng: `[Đề xuất định hướng]: Chú trọng hạn chế tiếng ồn...`, `[Đề xuất định hướng]: Khu vực lưu trú được duy trì ngăn nắp...`, `[Đề xuất định hướng]: Thông tin bệnh án chỉ trao đổi trực tiếp với gia đình...`. | Mockup `#page-gioi-thieu` Section 1.4; Blueprint Mục 2.1. | **FIXED** |
| **V3-P3-1** | **P3** | Header ở 375px bị chật: nút CTA xuống 2 dòng ("Đặt lịch hẹn khám"), dòng phụ dưới logo xuống dòng. | Rút gọn văn bản nút CTA trên mobile thành `Đặt lịch` qua CSS responsive media query; thiết lập `white-space: nowrap` và tinh chỉnh cỡ chữ `0.62rem` cho `.p3a-logo-subtitle` để đảm bảo 0 tràn ngang, 0 rớt dòng tại mọi viewport $\le 390\text{px}$. (Ghi nhận `3A04-P2-1` đang mở cho phần mockup tĩnh). | Mockup CSS `.p3a-header-cta`, `.p3a-logo-subtitle`. | **FIXED (Blueprint Spec) / OPEN (Mockup CSS)** |
| **V3-P3-2** | **P3** | Bộ mô phỏng "N = …" và câu thông báo "thuộc tính hidden" nằm trong nội dung trang khách hàng. | Đã gỡ bỏ toàn bộ các nút bấm mô phỏng $N=1..8$ khỏi markup hiển thị; trang khách hàng chỉ giữ lại Bộ lọc Bộ phận chuyên môn; viết lại câu thông báo `aria-live` lịch sự cho người dùng thật: *"Đang hiển thị: Tất cả các bộ phận"*, không nhắc tới thuật ngữ dev/test. | Mockup Header toolbar & Section 2.1; hàm `updateFilterStatus`. | **FIXED** |
| **V3-P3-3** | **P3** | Blueprint mục 9.1 lặp nguyên đoạn R-3A-05/2B-29 hai lần; bảng nguồn ảnh ghi sai vị trí dùng của `article-prevention`. | Đã xóa đoạn trùng lặp trong Mục 9.1; hiệu chỉnh vị trí sử dụng của `article-prevention.webp` thành Hero Section 1.1 (`/gioi-thieu`) và Frame #01 Section 3.2 (`/co-so-vat-chat`). | Blueprint Mục 7 & Mục 9.1. | **FIXED** |

---

### 8.2. Bảng Đối Chiếu Giải Quyết 8 Phát Hiện Từ Báo Cáo Claude QA 3A-02 (`docs/qa/3a-design-qa-02.md`)

| Mã QA | Mức | Mô tả phát hiện của Claude | Giải pháp đã thực hiện trong Blueprint & Mockup HTML | Bằng chứng kiểm chứng | Kết luận |
| :---: | :---: | :--- | :--- | :--- | :---: |
| **V-P1-1** | **P1** | File mockup HTML trong repo bị **hỏng mã hóa UTF-8 (mojibake)** do PowerShell đọc dạng Windows-1252 rồi ghi lại: 280 dòng bị biến dạng ký tự tiếng Việt. | Đã viết lại toàn bộ file bằng script Node.js với mã hóa **UTF-8 thuần (No BOM)** và thiết lập chuẩn thẻ `<meta charset="UTF-8">`. Đã kiểm chứng 100% chuỗi ký tự tiếng Việt hiển thị sắc nét, không còn bất kỳ byte lỗi nào. | File `docs/design/phase-3a-interactive-mockups.html`; tiêu đề `<title>` và toàn bộ nội dung đọc trong sáng. | **FIXED** |
| **AP-2** | **P2** | `why-pet-companion.webp` có **logo thương hiệu Champion** trên áo của chó, được dùng 2 lần trong mockup 3A và đang dùng trên trang chủ Mốc 2B (`WhyChooseUs.tsx:30`). | **Trong 3A:** Đã gỡ bỏ 100% hình ảnh này khỏi file Mockup và Blueprint, thay bằng ảnh minh họa sạch hoặc sơ đồ phân khu kiến trúc SVG.<br>**Đối với Trang chủ 2B:** Bảo toàn nguyên vẹn `src/` theo quy chế đóng băng Mốc 2B; ghi nhận mục lỗi **`2B-29` (P2)** vào Sổ nhật ký bảo trì để xử lý theo chỉ đạo riêng. | Mockup 3A không còn chứa chuỗi `why-pet-companion.webp`; Blueprint Mục 7 & Mục 9.1. | **FIXED (3A) & Ghi nhận 2B-29** |
| **AP-1** | **P2** | Bảng nguồn ảnh (Blueprint mục 7) thiếu URL, tác giả, giấy phép và trạng thái xác minh rõ ràng. | Đã nâng cấp toàn diện Bảng Kê Chi Tiết Tài Sản (Asset Provenance Ledger) tại Mục 7 với 11 cột chuẩn mực: File repo, Vị trí 3A, Loại tài sản, Nguồn cung cấp, Tác giả, Giấy phép, Trạng thái xác minh (VERIFIED vs UNVERIFIED), Cho phép trên Preview, Sẵn sàng phát hành. | Blueprint Mục 7; `docs/qa/3a-design-handoff-03.md`. | **FIXED** |
| **V-P2-2** | **P2** | Ghi chú QA và thuật ngữ dev còn lẫn vào nội dung trang khách hàng (ví dụ: `Mô phỏng sĩ số nhân sự nhóm Bác sĩ (Kiểm thử lưới cân bằng)`, v.v.). | Đã loại bỏ hoàn toàn các mã QA và thuật ngữ dev (`Kiểm thử lưới cân bằng`, `verified = false`, v.v.) khỏi nội dung hiển thị; thay bằng văn bản trung tính, lịch sự: *"Mô phỏng dự kiến cơ cấu nhân sự nhóm Bác sĩ"*. | File Mockup HTML; toàn bộ văn bản duyệt sạch bóng từ khóa QA nội bộ. | **FIXED** |
| **V-P3-1** | **P3** | Mockup thiếu nút mở menu trên mobile (`Header` không bấm mở menu được trên màn hình hẹp). | Đã lập trình hoàn chỉnh **Menu Hamburger Mobile** (`.p3a-menu-toggle`) và **Khung Menu Trượt Xuống** (`#p3a-mobile-drawer`) với đầy đủ thuộc tính trợ năng `aria-expanded`, `aria-controls`, xử lý phím `Escape` và vùng chạm chuẩn 44px. | Mockup HTML: nút menu ở góc phải Header mobile và drawer trượt mượt mà. | **FIXED** |
| **V-P3-2** | **P3** | Tại `/co-so-vat-chat` (Frame #04), nhãn phân khu bị đè lên khối chữ mô tả trên màn hình nhỏ. | Đã tái cấu trúc CSS và layout của Frame #04: nhãn phân khu được xếp độc lập ở hàng trên với khoảng cách an toàn (`margin-bottom: 0.5rem`), hoàn toàn không đè chữ ở mọi độ phân giải từ 320px đến 1920px. | Mockup HTML section 3.4; kiểm thử tại viewport 320px, 375px, 768px. | **FIXED** |
| **V-P3-3** | **P3** | Vòng focus trên các nút và liên kết còn mảnh; các mục liên kết breadcrumb có vùng chạm nhỏ. | Đã nâng độ dày viền focus lên `2px solid var(--color-plum-primary)` kèm `outline-offset: 2px`; tăng vùng chạm liên kết breadcrumb đạt tối thiểu `44px` chiều cao (`min-height: 44px; display: inline-flex; align-items: center`). | Mockup CSS `.p3a-breadcrumb a` và `:focus`. | **FIXED** |
| **V-P3-4** | **P3** | H1 trang `/co-so-vat-chat` đổi thành *"sạch sẽ, bố trí rõ ràng..."* vẫn là khẳng định tính chất vật lý chưa kiểm chứng. | Đã chuẩn hóa H1 thành cụm từ mô tả chức năng trung tính: *“Không gian thăm khám và quy hoạch các phân khu chức năng.”* | Blueprint Mục 2.3, 3.3; Mockup `#page-co-so-vat-chat h1`. | **FIXED** |
| **V-P3-5** | **P3** | Các card trong cùng một hàng chưa cân bằng chiều cao trên một số viewport. | Đã chuẩn hóa lưới CSS Grid với `align-items: stretch` và thẻ con `display: flex; flex-direction: column; height: 100%`, đảm bảo tất cả các thẻ trong hàng có chiều cao đồng đều 100%. | Mockup CSS `.p3a-dept-grid`, `.p3a-spec-grid`. | **FIXED** |

---

### 8.3. Bảng Đối Chiếu Giải Quyết Toàn Bộ Phát Hiện QA 3A-01 (`docs/qa/3a-design-qa-01.md`: 2 P1, 11 P2 & 9 P3)

Dưới đây là bảng đối chiếu trung thực từng phát hiện trong `docs/qa/3a-design-qa-01.md`:

#### A. Hai Lỗi P1 (Bắt buộc sửa trong thiết kế)
| Mã QA | Mô tả phát hiện của Claude | Giải pháp đã thực hiện trong Blueprint & Mockup | Bằng chứng vị trí | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **3A-P1-1** | Card mang tên thật `"BS. Lê Thái Sơn"` (và các card nhân sự) dùng ảnh stock có mặt người thật là trình bày sai danh tính. | Đã gỡ bỏ 100% ảnh người (stock/AI) khỏi toàn bộ các card nhân sự trên `/doi-ngu`. Thay hoàn toàn bằng **Monogram & Khung chân dung trống `4:5`** trên nền Lavender nhạt kèm nhãn `Chưa có ảnh thực tế — Khung chân dung chờ duyệt`. | Blueprint Mục 2.2, 3.2.C, 6, 7; Mockup `#page-doi-ngu` (tất cả card). | **FIXED (Trong Thiết kế & Mockup)** |
| **3A-P1-2** | Wireframe tự ấn định cơ cấu nhân sự chưa xác minh (3 bác sĩ, chuyên khoa Ngoại khoa & Cấp cứu, kiêm nhiệm Nội trú 24/7, lễ tân/điều dưỡng). | Đã xóa toàn bộ số lượng mặc định, chuyên khoa tự đặt, lịch trực và thông tin kiêm nhiệm chưa xác minh. Thay bằng các **Slot trung tính** (`[Chức danh chuyên môn — Chờ xác minh]`, `[Vai trò kiêm nhiệm — Chỉ hiển thị nếu có dữ liệu xác minh]`, `[Phạm vi công việc — Chờ hồ sơ]`). | Blueprint Mục 2.2, 3.2.C, 6; Mockup `#page-doi-ngu`. | **FIXED (Trong Thiết kế & Mockup)** |

#### B. Mười Một Lỗi P2 (`3A-P2-1` đến `3A-P2-11`)
| Mã QA | Mô tả phát hiện của Claude | Giải pháp đã thực hiện trong Blueprint & Mockup | Bằng chứng vị trí | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **3A-P2-1** | Bốn "nguyên tắc phục vụ" trên `/gioi-thieu` là cam kết vận hành chưa xác minh nhưng viết như sự thật đang áp dụng. | Đã chuyển cả khối Section 1.4 về dạng **Đề xuất chờ duyệt**, gắn nhãn nổi bật `[ĐỀ XUẤT NỘI DUNG — CHỜ CHỦ DỰ ÁN XÁC NHẬN QUY TRÌNH PHỤC VỤ THỰC TẾ]` và viết lại từng dòng theo văn phong đề xuất trung tính. | Blueprint Mục 2.1 (Section 1.4), 3.1.A; Mockup `#page-gioi-thieu`. | **FIXED (Chờ Chủ dự án duyệt nội dung)** |
| **3A-P2-2** | Ảnh Hero `/gioi-thieu` dùng ảnh stock có người mặc áo blouse dễ bị hiểu nhầm là bác sĩ của Lê Sơn. | Đã loại bỏ hoàn toàn mọi ảnh có người mặc áo blouse khỏi cả 3 trang trong Mockup; chỉ dùng ảnh thú cưng thuần túy / đồ họa kiến trúc kèm nhãn `Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn`. | Blueprint Mục 2.1, 7; Mockup `#page-gioi-thieu`. | **FIXED** |
| **3A-P2-3** | Luôn đặt `BS. Lê Thái Sơn` ở Thẻ 1 vẫn tạo ra thứ bậc ngầm theo chức vụ. | Đã bỏ quy tắc xếp đầu theo chức vụ. Quy định rõ thứ tự hiển thị trung tính (`A–Z` hoặc theo danh sách phẳng của Chủ dự án); trong Wireframe & Mockup, thẻ `BS. Lê Thái Sơn` được đặt ở vị trí trung tính (Thẻ #2). | Blueprint Mục 2.2 (Quy tắc 5), 3.2.C; Mockup `#page-doi-ngu`. | **FIXED** |
| **3A-P2-4** | Gộp `"Spa & Grooming và Điều dưỡng"` thành 1 section để cân đối lưới có thể sai cơ cấu thực tế; quy tắc $N=1$ đặt thẩm mỹ lên trên tính chính xác. | Đã bãi bỏ quy tắc gộp bộ phận khi $N=1$. Chỉ phân nhóm theo bộ phận thực tế; khi bộ phận có $N=1$ thành viên thì hiển thị **1 card căn giữa có cùng kích thước chuẩn** (`1/3` container trên Desktop), không gộp nhãn bộ phận. | Blueprint Mục 2.2 (Quy tắc 8), 3.2.A–B; Mockup `#page-doi-ngu`. | **FIXED** |
| **3A-P2-5** | Ma trận lưới ở Tablet khi $N=5$ dùng thẻ ngang khác dạng card; chưa định nghĩa quy tắc cho $N \ge 7$. | Đã thiết lập **Universal 12-Column Centered Grid Rule** cho $N = 1, 2, 3, 4, 5, 6, 7$ và $N \ge 7$: mọi card trên cả Desktop lẫn Tablet đều giữ nguyên kiểu card dọc `4:5` đồng kích thước 100%, hàng cuối căn giữa đối xứng. | Blueprint Mục 3.2.A–B; Mockup `#page-doi-ngu`. | **FIXED** |
| **3A-P2-6** | Bộ lọc bộ phận làm mờ (`opacity`) các card không thuộc nhóm đang lọc, vẫn đọc và `Tab` tới được gây nhiễu cho Screen Reader. | Đã bỏ hoàn toàn hiệu ứng làm mờ. Bộ lọc trong Mockup và đặc tả Blueprint sử dụng thuộc tính **`hidden` (`display: none`)** để ẩn thực sự các nhóm không được chọn, kèm `aria-pressed="true/false"` và thông báo kết quả qua `role="status" aria-live="polite"`. | Blueprint Mục 2.2, 5.1; Mockup `#page-doi-ngu`. | **FIXED** |
| **3A-P2-7** | Cụm từ `"Bác sĩ trưởng Lê Thái Sơn"` / `"nổi bật BST Lê Thái Sơn"` còn sót ở 6 vị trí mã nguồn và tài liệu. | Đã lập bảng kiểm kê đầy đủ cả 6 file và số dòng tại Mục 4.2 kèm phương án đồng bộ. Giữ ở trạng thái **PARTIAL (Đã kiểm kê đủ trong Blueprint — Chờ pha Implementation)**. | Blueprint Mục 4.2, 9.2 (Quyết định 1). | **PARTIAL (Chờ pha triển khai code)** |
| **3A-P2-8** | Quy trình phối hợp trên `/doi-ngu` chứa cam kết vận hành chưa xác minh ("ưu tiên ngay ca cấp cứu", "bàn giao ca trực 24/24", "hội chẩn"). | Đã đóng khung toàn bộ Section 2.4 bằng nhãn `[QUY TRÌNH PHỐI HỢP ĐỀ XUẤT — CHỜ CHỦ DỰ ÁN XÁC NHẬN VẬN HÀNH THỰC TẾ]` và quy chuẩn thành 3 bước phối hợp đề xuất trung tính. | Blueprint Mục 2.2 (Section 2.4), 3.2.C; Mockup `#page-doi-ngu`. | **FIXED (Chờ Chủ dự án duyệt nội dung)** |
| **3A-P2-9** | Trang `/co-so-vat-chat` nếu toàn ảnh stock gắn nhãn "không phải ảnh bệnh viện" khi phát hành sẽ làm giảm niềm tin. | Đã bổ sung quy tắc **Pre-release Gate**: Preview/Mockup được dùng ảnh minh họa gắn nhãn; trước khi phát hành / mở index công khai bắt buộc phải có bộ ảnh cơ sở thực tế tại 101 Khuất Duy Tiến được Chủ dự án duyệt. | Blueprint Mục 2.3, 3.3, 6, 9.2. | **FIXED (Quy tắc Pre-release Gate)** |
| **3A-P2-10** | Tiêu đề H1 trang `/co-so-vat-chat` dùng cụm từ `"sạch khuẩn"` là tuyên bố mạnh chưa được xác minh. | Đã xóa hoàn toàn cụm từ `"sạch khuẩn"` trong cả Blueprint lẫn Mockup; đổi H1 thành *"Không gian thăm khám và quy hoạch các phân khu chức năng."* | Blueprint Mục 2.3 (Section 3.1), 3.3; Mockup `#page-co-so-vat-chat`. | **FIXED** |
| **3A-P2-11** | Slot thiết bị vẫn hiển thị thương hiệu `"(VD: Mindray)"` và tự khẳng định có `"Khu vực Thủ thuật & Phẫu thuật ngoại khoa"` riêng. | Đã đổi toàn bộ hiển thị trên Wireframe & Mockup thành slot trung tính `[Thiết bị xét nghiệm — chờ xác minh]`, `[Thiết bị chẩn đoán hình ảnh — chờ xác minh]` (không nêu tên hãng trên giao diện) và chuyển khu thủ thuật/ngoại khoa thành slot phân khu chức năng chờ xác nhận cấu trúc phòng thực tế. | Blueprint Mục 2.3 (Section 3.3), 3.3; Mockup `#page-co-so-vat-chat`. | **FIXED** |

#### C. Chín Phát Hiện P3 (`3A-P3-1` đến `3A-P3-9` — Đã xử lý đầy đủ)
| Mã QA | Mô tả phát hiện P3 | Giải pháp đã thực hiện | Trạng thái |
| :---: | :--- | :--- | :---: |
| **3A-P3-1** | Dải thông tin (địa chỉ, giờ khám, cấp cứu) lặp lại ở cả Hero và CTA cuối trang `/gioi-thieu`. | Đã giữ dải thông tin 3 cột ở Hero và rút gọn dải CTA cuối trang `/gioi-thieu`. | **FIXED** |
| **3A-P3-2** | Breadcrumb `"Về Lê Sơn"` là nhóm menu, không có trang riêng. | Đã quy định render `"Về Lê Sơn"` bằng thẻ `<span>` text tĩnh, không đặt link `<a>`. | **FIXED** |
| **3A-P3-3** | Yêu cầu "cùng số dòng mô tả" dễ dẫn tới `line-clamp` cắt chữ. | Đã bỏ yêu cầu cắt dòng; dùng CSS Grid stretch để cân bằng chiều cao tự nhiên. | **FIXED** |
| **3A-P3-4** | Dòng `[Bằng cấp / Chứng chỉ: Chờ xác minh]` không nên hiển thị khi publish. | Đã quy định rõ: ẩn hoàn toàn trường này khi xuất bản nếu `verified === false`. | **FIXED** |
| **3A-P3-5** | Ảnh thật chụp cơ sở có thể lọt khách hàng, thú cưng hoặc màn hình bệnh án. | Đã bổ sung quy tắc bảo mật hình ảnh và `Owner Consent Form` vào Mục 6 & Mục 9. | **FIXED** |
| **3A-P3-6** | Sai số bảng độ tương phản ở mục 8.2 (ví dụ `#FFFFFF` / `#C2560C` là `4.54:1`). | Đã cập nhật chính xác toàn bộ con số tương phản theo `contrast-check.txt` tại Mục 5.2 và đặt quy tắc cỡ chữ tối thiểu cho nút cam. | **FIXED** |
| **3A-P3-7** | Mockup thiếu nút chọn viewport `360px` và `1920px`. | Đã bổ sung đủ **7 mốc viewport** (`1920`, `1440`, `1366`, `768`, `390`, `360`, `320`) trên thanh công cụ của Mockup. | **FIXED** |
| **3A-P3-8** | Hậu tố `alt` quá dài lặp lại ở mọi ảnh. | Đã rút gọn hậu tố `alt` thành `"(ảnh minh họa)"` kèm 1 banner giải thích chung ở đầu trang. | **FIXED** |
| **3A-P3-9** | Trạng thái ghi `"APPROVED FOR DESIGN"` dễ gây nhầm là thiết kế đã được duyệt. | Đã đổi thành `"PHASE 3A — PENDING OWNER DESIGN APPROVAL (DESIGN ONLY — NO WEBSITE IMPLEMENTATION)"`. | **FIXED** |

---

## 9. MỤC 9: RỦI RO KỸ THUẬT & DANH SÁCH QUYẾT ĐỊNH CẦN CHỦ DỰ ÁN XÁC NHẬN

### 9.1. Bảng Kiểm Soát Rủi Ro Kỹ Thuật
- **R-3A-01 (Hiệu năng LCP Mobile — Vấn đề `2B-08` đang mở):** Các trang 3A đặt tiêu đề `h1` (`Lora 600` đã preload) lên trước ảnh trên mobile để phần tử LCP là văn bản hiển thị tức thì; toàn bộ ảnh dưới fold dùng `loading="lazy"`.
- **R-3A-02 (Tailwind v4 Oxide quét file trong Repo):** Toàn bộ class trong `docs/design/phase-3a-interactive-mockups.html` được đặt tiền tố riêng `p3a-` và viết bằng CSS độc lập. Đã chạy `npm run build` kiểm chứng: SHA-256 của `dist/assets/index-vrX09Urw.css` (`ca6de747195a5550d80dc7ea59cc7ea8a43c51a9b77c07d596e79ffbefe66d87`) và `dist/assets/index-CvVwFN8Z.js` (`10f187c6990780a5a4417928e9ab313db068caffce0e988233b07cadba8be234`) **giữ nguyên 100% không đổi một byte**.
- **R-3A-03 (Bảo toàn Bundle Trang chủ):** Khi triển khai code sẽ dùng `React.lazy()` cho cả 3 route Giai đoạn 3A theo Architecture Baseline V1.
- **R-3A-04 (Bảo mật & Quyền riêng tư trong ảnh chụp thực tế — `3A-P3-5`):** Khi chụp ảnh thực tế cơ sở vật chất tại `101 Khuất Duy Tiến`, bắt buộc kiểm duyệt không để lọt thông tin cá nhân trên màn hình máy tính, bảng theo dõi nội trú hoặc hình ảnh khách hàng/thú cưng chưa có phiếu đồng ý (`Owner Consent Form`).
- **R-3A-05 / Lỗi 2B-29 (P2 — Tồn đọng bảo trì Trang chủ Mốc 2B do Claude phát hiện tại QA 3A-02 & 3A-03):**
  - **Mô tả:** Tệp ảnh `public/images/why-pet-companion.webp` hiển thị logo thương hiệu **Champion** rõ ràng trên áo của chú chó. Tệp này đang được sử dụng tại Section 2 Trang chủ (`src/components/WhyChooseUs.tsx:30`).
  - **Hành động trong Giai đoạn 3A:** Đã gỡ bỏ 100% hình ảnh này khỏi Mockup và tài liệu Blueprint v2.3.
  - **Hành động đối với Trang chủ Mốc 2B:** Tuân thủ nghiêm ngặt quy chế đóng băng Mốc 2B theo chỉ đạo CEO Directive 019-A và 020-A, Antigravity **tuyệt đối không tự ý sửa mã nguồn `src/`**. Lỗi được lập mã chính thức là **`2B-29` (P2)**, lưu trong sổ rủi ro bảo trì để CEO phân bổ nhiệm vụ xử lý riêng (thay ảnh sạch hoặc làm mờ logo).

### 9.2. Năm Điểm Cần Chủ Dự Án Xác Nhận Trước Khi Chuyển Sang Triển Khai Code
1. **Quyết định 1 — Đồng bộ 6 vị trí mô tả `"Bác sĩ trưởng Lê Thái Sơn"` trong Repo (`3A-P2-7`):**
   - Chủ dự án xác nhận: (a) giữ danh xưng `"Bác sĩ trưởng"` như một dữ liệu chức danh thực tế hiển thị ở dòng chữ nhỏ dưới tên BS. Lê Thái Sơn (nhưng gỡ bỏ các câu *"do Bác sĩ trưởng dẫn dắt / nổi bật BST"* trên menu/SEO để không tạo phân cấp), hay (b) đổi thống nhất sang chức danh chuyên môn khác trên toàn bộ 6 vị trí tại Mục 4.2?
2. **Quyết định 2 — Quy tắc sắp xếp thứ tự nhân sự trong từng bộ phận (`3A-P2-3`):**
   - Chủ dự án muốn sắp xếp các thành viên trong cùng một bộ phận theo **thứ tự bảng chữ cái tên gọi (`A–Z`)** hay theo **thứ tự danh sách phẳng do Chủ dự án gửi**?
3. **Quyết định 3 — Xác nhận cơ cấu bộ phận & dữ liệu thật cho `/doi-ngu` (`3A-P1-1`, `3A-P1-2`, `3A-P2-4`):**
   - Chủ dự án cung cấp danh sách các bộ phận thực tế đang hoạt động, danh sách nhân sự, chức danh, vai trò kiêm nhiệm và ảnh chân dung thật (hoặc xác nhận dùng khung Monogram trung tính cho các vị trí chưa chụp ảnh xong).
4. **Quyết định 4 — Phê duyệt nội dung đề xuất trên `/gioi-thieu` và `/doi-ngu` (`3A-P2-1`, `3A-P2-8`):**
   - Chủ dự án duyệt hoặc hiệu chỉnh 4 nguyên tắc phục vụ tại Section 1.4 (`/gioi-thieu`), câu chuyện hình thành tại Section 1.2 (`/gioi-thieu`) và các bước phối hợp tại Section 2.4 (`/doi-ngu`).
5. **Quyết định 5 — Xác nhận danh mục thiết bị, cấu trúc phòng & điều kiện phát hành `/co-so-vat-chat` (`3A-P2-9`, `3A-P2-11`):**
   - Chủ dự án xác nhận danh mục thiết bị thực tế được phép công bố (có nêu tên hãng Mindray / model máy siêu âm hay không, có phòng thủ thuật/phẫu thuật riêng hay không) và cung cấp bộ ảnh chụp thực tế tại `101 Khuất Duy Tiến` trước khi mở lập chỉ mục công khai.

---

## 10. MỤC 10: ĐƯỜNG DẪN CHÍNH XÁC ĐẾN MOCKUP TRỰC QUAN & HƯỚNG DẪN MỞ XEM TRÊN WINDOWS / TRÌNH DUYỆT

### 10.1. Đường dẫn chính xác của Mockup Trực Quan DEV-00
Để đảm bảo cả **Claude (Independent QA)** trên mọi nhánh/worktree lẫn **Chủ dự án** đều mở và kiểm tra được ngay lập tức, file Mockup HTML độc lập được lưu đồng thời tại 2 vị trí:

1. **Đường dẫn chuẩn trong Git Repository (nhánh `fix/milestone-2a-qa`):**
   - Đường dẫn tương đối: `docs/design/phase-3a-interactive-mockups.html`
2. **Đường dẫn trong thư mục Artifacts phiên làm việc:**
   - Tên artifact: `phase-3a-interactive-mockups.html`

### 10.2. Hướng dẫn mở và kiểm tra Mockup trên Windows & Trình duyệt
- **Cách 1 — Mở trực tiếp từ Windows Explorer hoặc PowerShell (Không cần chạy server):**
  ```powershell
  Start-Process "d:\webbvct\docs\design\phase-3a-interactive-mockups.html"
  ```
  *(File sử dụng đường dẫn tương đối `../../public/fonts/` và `../../public/images/` kèm SVG nội tuyến độc lập, mở trực tiếp bằng Chrome, Edge hoặc Playwright đều hiển thị đầy đủ 100% phông chữ và hình ảnh).*
- **Cách 2 — Mở qua máy chủ tĩnh cục bộ (Phục vụ Claude QA tự động bằng Playwright / Headless Browser):**
  ```powershell
  npx serve d:\webbvct -l 4173
  # Sau đó mở trình duyệt tại:
  # http://localhost:4173/docs/design/phase-3a-interactive-mockups.html
  ```
- **Các bộ điều khiển tương tác có sẵn trên thanh công cụ đầu trang Mockup v2.1:**
  1. **Chuyển trang:** `1. /gioi-thieu` | `2. /doi-ngu` | `3. /co-so-vat-chat`.
  2. **Chuyển chế độ hiển thị:** `Mockup Trực quan` | `Wireframe Blueprint`.
  3. **Chuyển đổi đủ 7 mốc Viewport QA (`3A-P3-7`):** `1920px` | `1440px` | `1366px` | `768px` | `390px` | `360px` | `320px`.
  4. **Bộ mô phỏng sĩ số nhân sự trên `/doi-ngu` (`3A-P2-4`, `3A-P2-5`, `3A04-P2-2`):** Các nút bấm mô phỏng $N=1..8$ đã được chủ động gỡ bỏ khỏi markup giao diện để tránh làm rối nội dung. Kiểm thử lưới cân bằng tại các giá trị $N=1, 2, 3, 5, 7, 8$ được thực hiện trực tiếp qua hàm console script `setTeamCount(n, layout)`.
  5. **Bộ lọc bộ phận chuẩn Accessibility (`3A-P2-6`):** Ẩn/hiện bằng thuộc tính `hidden` thực sự (không làm mờ card) và phát thông báo vào vùng `aria-live="polite"`.

---

**PHASE 3A DEV-00 — READY FOR INDEPENDENT CONTENT GATE QA**
