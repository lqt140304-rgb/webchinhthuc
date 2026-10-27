# HỒ SƠ THIẾT KẾ CHI TIẾT GIAI ĐOẠN 3A (PHASE 3A DESIGN BLUEPRINT)
## Bệnh viện Thú y Lê Sơn 2026 — Vibrant Editorial Luxury & Chuẩn Mực Y Khoa

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 017-A — PHASE 3A DESIGN ONLY**, `AGENTS.md` (Architecture Baseline V1), `PROJECT_BRIEF.md`, `docs/design-system.md` |
| **Tác giả thiết kế** | Antigravity — Designer & Developer |
| **Đơn vị thẩm định độc lập** | Claude — Independent QA Reviewer |
| **Phạm vi 3 tuyến trang** | 1. `/gioi-thieu` (Giới thiệu bệnh viện)<br>2. `/doi-ngu` (Đội ngũ)<br>3. `/co-so-vat-chat` (Cơ sở vật chất) |
| **Trạng thái phê duyệt** | **APPROVED FOR DESIGN — NOT IMPLEMENTATION** (Chưa triển khai vào mã nguồn ứng dụng) |
| **Mockup trực quan đính kèm** | Interactive HTML Design Studio (`phase-3a-interactive-mockups.html` trong thư mục Artifacts) |

---

## MỤC LỤC
1. [Định Hướng Nghệ Thuật & Nguyên Tắc Bảo Toàn Hệ Thống](#1-dinh-huong-nghe-thuat--nguyen-tac-bao-toan-he-thong)
2. [Deliverable 1: Content & UX Blueprint Cho Từng Trang](#2-deliverable-1-content--ux-blueprint-cho-tung-trang)
   - [2.1. Trang /gioi-thieu — Giới Thiệu Bệnh Viện](#21-trang-gioi-thieu--gioi-thieu-benh-vien)
   - [2.2. Trang /doi-ngu — Đội Ngũ Nhân Sự & Chuyên Môn](#22-trang-doi-ngu--doi-ngu-nhan-su--chuyen-mon)
   - [2.3. Trang /co-so-vat-chat — Cơ Sở Vật Chất & Trang Thiết Bị](#23-trang-co-so-vat-chat--co-so-vat-chat--trang-thiet-bi)
3. [Deliverable 2: Wireframe Chi Tiết Desktop, Tablet & Mobile](#3-deliverable-2-wireframe-chi-tiet-desktop-tablet--mobile)
   - [3.1. Wireframe Trang /gioi-thieu](#31-wireframe-trang-gioi-thieu)
   - [3.2. Wireframe Trang /doi-ngu & Ma Trận Lưới Tự Cân Bằng](#32-wireframe-trang-doi-ngu--ma-tran-luoi-tu-can-bang)
   - [3.3. Wireframe Trang /co-so-vat-chat](#33-wireframe-trang-co-so-vat-chat)
4. [Deliverable 3: Đặc Tả Mockup Trực Quan (Visual Design Specification)](#4-deliverable-3-dac-ta-mockup-truc-quan-visual-design-specification)
5. [Deliverable 4: Danh Mục Component Hiện Có & Quy Chuẩn Mở Rộng](#5-deliverable-4-danh-muc-component-hien-co--quy-chuan-mo-rong)
6. [Deliverable 5: Đề Xuất Animation & Tương Tác Cho Từng Section](#6-deliverable-5-de-xuat-animation--tuong-tac-cho-tung-section)
7. [Deliverable 6: Danh Sách Thông Tin, Ảnh & Hồ Sơ Cần Chủ Dự Án Cung Cấp](#7-deliverable-6-danh-sach-thong-tin-anh--ho-so-can-chu-du-an-cung-cap)
8. [Deliverable 7: Tiêu Chí Responsive & Khả Năng Tiếp Cận (WCAG 2.1 AA)](#8-deliverable-7-tieu-chi-responsive--kha-nang-tiep-can-wcag-21-aa)
9. [Deliverable 8: Rủi Ro Triển Khai & Các Điểm Cần Quyết Định](#9-deliverable-8-rui-ro-trien-khai--cac-diem-can-quyet-dinh)

---

## 1. ĐỊNH HƯỚNG NGHỆ THUẬT & NGUYÊN TẮC BẢO TOÀN HỆ THỐNG

### 1.1. Bảo toàn Kiến trúc Baseline V1 & Mốc 2A/2B
- **Giữ nguyên 100% Public Website hiện hữu:** Toàn bộ 3 trang thuộc Giai đoạn 3A nằm bên trong `RootLayout` công khai (`Header`, `MobileNav`, `main#main-content`, `Footer`, `MobileBottomBar`), kế thừa trọn vẹn nhận diện **Vibrant Editorial Luxury + Premium Veterinary**.
- **Bảo toàn tuyệt đối 6 Section Trang chủ:** Không thay đổi cấu trúc, nội dung hay style của 6 section Trang chủ đã nghiệm thu có điều kiện.
- **Độc lập với 2 Portal Giai đoạn 4:** Không pha trộn giao diện dạng bảng điều khiển (dashboard) vào 3 trang thông tin công khai này.

### 1.2. Hệ màu, Typography & Nhịp điệu Thị giác (Visual Rhythm)
- **Nguồn Design Tokens duy nhất (`src/styles/tokens.css`):**
  - **Nền (Backgrounds):** Nền giấy ấm Ivory (`--color-bg-primary`: `#FBF7F1`), nền phân vùng Lavender nhạt (`--color-bg-secondary`: `#F8F2F9`), bề mặt nổi (`--color-bg-card`: `#FFFFFF`), nền nhấn chiều sâu Deep Plum (`--color-bg-dark`: `#421247`, `--color-bg-dark-secondary`: `#310D35`).
  - **Chữ & Tương phản (Foregrounds):** Chữ chính (`--color-fg-primary`: `#1A0A1C` — tương phản `17.4:1` trên Ivory), tiêu đề mận đậm (`--color-fg-secondary`: `#421247`), văn bản mô tả (`--color-fg-muted`: `#554157` — tương phản `8.2:1` trên Ivory), metadata (`--color-fg-subtle`: `#5A3E5E` — tương phản `7.6:1` trên Ivory).
  - **Điểm nhấn hành động:** Plum chủ đạo (`--color-plum-primary`: `#5A1E5E`), Orchid phụ trợ (`--color-plum-orchid`: `#824787`, `--color-plum-orchid-light`: `#D8B4E2`), và Cam ấm khẩn cấp (`--color-warm-orange`: `#C2560C`, `--color-warm-orange-dark`: `#9A3412`, `--color-warm-orange-light`: `#FB923C`) dành riêng cho cấp cứu 24/24 và hotline.
- **Bảo toàn chiến lược Font Phương án C (`src/styles/fonts.css` — Lỗi 2B-25 đã đóng):**
  - Sử dụng đúng 6 file WOFF2 tự lưu trữ (self-hosted):
    1. `Lora` SemiBold `600` (`lora-600.woff2` — Critical Preload): Dùng cho mọi tiêu đề `h1`, `h2`, `h3`, số thứ tự editorial lớn và câu trích dẫn chủ đạo. **Lưu ý kỹ thuật:** Vì dự án chỉ nạp `lora-600.woff2` kiểu đứng (`normal`), thiết kế **không dùng Lora in nghiêng** để tránh trình duyệt tự tạo chữ nghiêng giả (synthetic oblique).
    2. `Be Vietnam Pro` Regular `400` (`be-vietnam-pro-400.woff2` — Critical Preload): Văn bản thân bài, đoạn mô tả.
    3. `Be Vietnam Pro` Medium `500` (`be-vietnam-pro-500.woff2` — Secondary): Nhãn phụ, breadcrumb, metadata, pill tag chuyên môn.
    4. `Be Vietnam Pro` SemiBold `600` (`be-vietnam-pro-600.woff2` — Critical Preload): Nút bấm CTA, điều hướng, chức danh nhân sự, tiêu đề mục nhỏ.
    5. `Be Vietnam Pro` Bold `700` (`be-vietnam-pro-700.woff2` — Secondary): Eyebrow chữ hoa (`uppercase`), nhãn trạng thái, số hotline.
    6. `Be Vietnam Pro` Italic `400` (`be-vietnam-pro-italic-400.woff2` — Secondary): Ghi chú nguồn minh họa, chú thích ảnh, disclaimer.
- **Chống đơn điệu & Hạn chế lạm dụng Card bo tròn:**
  - Thực thi nghiêm túc chỉ đạo Art Direction: *"Lưới editorial hiện đại, ảnh lớn, khoảng trắng có chủ đích. Hạn chế card lặp và bo tròn quá nhiều."*
  - Thay vì đóng khung mọi đoạn văn vào các thẻ trắng bo tròn giống hệt nhau, thiết kế đan xen 4 kiểu cấu trúc:
    1. **Asymmetric Editorial Split (Chia cột bất đối xứng 7/5 hoặc 5/7):** Đặt chữ trực tiếp trên nền giấy ấm Ivory kết hợp khung ảnh lớn cắt góc nghệ thuật (`2.25rem 0.75rem 2.25rem 0.75rem` kế thừa từ `HeroSection.module.css`).
    2. **Architectural Hairline Ledger (Bảng kẻ chỉ mảnh tạp chí):** Dùng đường kẻ ngang/dọc `1px solid var(--color-border-subtle)` cùng số thứ tự serif lớn (`01`, `02`, `03`) trên nền mở, tạo cảm giác trang báo cao cấp và thoáng đãng.
    3. **Photo Editorial Spread (Bố cục ảnh tạp chí):** Kết hợp 1 khung ảnh chủ đạo cỡ lớn và 2 khung ảnh cận cảnh có chú thích biên tập.
    4. **Structured Uniform Cards (Thẻ chuẩn hóa có chọn lọc):** Chỉ dùng card đóng khung khi thật sự cần phân tách các thực thể đồng cấp (như thẻ nhân sự trên `/doi-ngu` hoặc thẻ điều hướng liên trang).

### 1.3. Ranh giới nghiêm ngặt giữa Dữ liệu Xác minh & Khung Nội dung Chờ duyệt
| Phân loại | Dữ liệu được phép hiển thị như thông tin chính thức | Nội dung tuyệt đối KHÔNG tự bịa (Đặt vào Slot chờ xác minh) |
| :--- | :--- | :--- |
| **Thông tin chung** | - Tên: **Bệnh viện Thú y Lê Sơn**<br>- Địa chỉ: **101 Khuất Duy Tiến, Thanh Xuân, Hà Nội**<br>- Hotline: **097 355 51 05** (`tel:0973555105`)<br>- Giờ khám tham chiếu: **08:00 – 21:00 (Tất cả các ngày)**<br>- Cấp cứu: **Tiếp nhận cấp cứu 24/24**<br>- 4 nhóm dịch vụ: Khám & điều trị, Nội trú 24/7, Spa & Grooming, Cấp cứu 24/24 | - Năm thành lập cụ thể, lịch sử mở rộng chưa xác minh<br>- Số lượng ca khám/phẫu thuật, tỷ lệ thành công, số năm kinh nghiệm<br>- Giải thưởng, chứng nhận quốc tế chưa có hồ sơ<br>- Cam kết thời gian phản hồi cố định chưa được duyệt |
| **Trang `/doi-ngu`** | - Cấu trúc bộ phận thực tế (Bác sĩ thú y; Spa & Grooming; Điều dưỡng & Hỗ trợ vận hành)<br>- Tên nhân sự đã có trong tài liệu gốc: **BS. Lê Thái Sơn** | - Hồ sơ nhân sự giả định, tên bác sĩ/kỹ thuật viên tự đặt<br>- Bằng cấp, trường đào tạo, chứng chỉ hành nghề, số năm kinh nghiệm khi chưa có bản xác nhận từ chủ dự án |
| **Trang `/co-so-vat-chat`** | - Không gian phục vụ các dịch vụ đã xác nhận tại 101 Khuất Duy Tiến: Khu tiếp đón, khu khám & điều trị, khu nội trú 24/7, khu Spa & Grooming | - Thông số kỹ thuật cụ thể của máy xét nghiệm Mindray, model máy siêu âm/X-quang, áp lực phòng mổ, vật liệu chuồng khi chưa xác minh thực tế<br>- Không trình bày ảnh minh họa/placeholder như ảnh chụp thật tại bệnh viện |

---

## 2. DELIVERABLE 1: CONTENT & UX BLUEPRINT CHO TỪNG TRANG

### 2.1. TRANG `/gioi-thieu` — GIỚI THIỆU BỆNH VIỆN
- **Phong cách chủ đạo:** *Editorial Storytelling + Clinical Credibility* (Kể chuyện giàu cảm xúc kết hợp sự điềm tĩnh, chuẩn mực của y khoa thú y).
- **Mục tiêu UX:** Giúp chủ nuôi hiểu rõ "Bệnh viện Thú y Lê Sơn là ai, làm việc theo nguyên tắc nào và chăm sóc thú cưng ra sao", từ đó xây dựng niềm tin trước khi xem Đội ngũ, Cơ sở vật chất hoặc Đặt lịch khám.
- **Luồng điều hướng & SEO:**
  - Breadcrumb: `Trang chủ` (`/`) ➔ `Về Lê Sơn` ➔ `Giới thiệu bệnh viện` (`aria-current="page"`).
  - SEO Hook: `useRouteSeo` với `title: "Về Chúng Tôi — Bệnh viện Thú y Lê Sơn"`, giữ `isIndexable: false` khi còn khung nội dung/ảnh chờ duyệt.

#### Cấu trúc 5 Khu vực (5 Sections) của `/gioi-thieu`:

1. **Khu vực 1 — Editorial Hero (Định vị thương hiệu & Điểm tựa y tế):**
   - **Bố cục:** Lưới 12 cột bất đối xứng (7 cột nội dung bên trái + 5 cột cụm 2 khung ảnh editorial cắt góc nghệ thuật bên phải), phía dưới là dải thông tin xác thực kẻ chỉ mảnh (`Architectural Metadata Strip`).
   - **Thông điệp chính:**
     - Eyebrow: `VỀ BỆNH VIỆN THÚ Y LÊ SƠN`
     - Tiêu đề `h1` (Lora 600): *“Nơi sự cẩn trọng y khoa song hành cùng lòng thấu cảm.”*
     - Đoạn dẫn (Lead paragraph): *“Tại 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội, Bệnh viện Thú y Lê Sơn được xây dựng với mong muốn trở thành điểm tựa y tế đáng tin cậy cho chủ nuôi — nơi mỗi bé cưng đều được thăm khám kỹ lưỡng, giải thích minh bạch và chăm sóc bằng sự tôn trọng sự sống.”*
   - **Dải thông tin xác thực (3 cột kẻ chỉ dọc):**
     - `Địa chỉ cơ sở`: 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội.
     - `Khung giờ khám tham chiếu`: 08:00 – 21:00 (Tất cả các ngày).
     - `Trực cấp cứu`: Tiếp nhận cấp cứu 24/24 — Hotline `097 355 51 05`.
   - **CTA trên Hero:** Nút chính `Đặt lịch khám` (`/dat-lich`) + Nút phụ `Liên hệ Hotline: 097 355 51 05` (`tel:0973555105`).
   - **Quy tắc ảnh:** Khung ảnh minh họa sự gắn kết giữa bác sĩ và thú cưng, gắn nhãn rõ ràng `Ảnh minh họa — Chờ cập nhật ảnh thực tế bệnh viện`.

2. **Khu vực 2 — Câu chuyện Lê Sơn (Editorial Narrative Spread):**
   - **Bố cục:** Bố cục tạp chí mở (Open Magazine Spread) trên nền Ivory (`--color-bg-primary`), **không đóng khung card**. Cột trái (5 cột) là câu trích dẫn chủ đạo cỡ lớn (`Lora 600`) và hộp trạng thái hồ sơ; cột phải (7 cột) là mạch văn tự sự chia 2 đoạn rõ ràng kèm 1 khung ảnh ngang tỷ lệ `16:10`.
   - **Nội dung cốt lõi:**
     - Tập trung vào sự đồng cảm với nỗi lo của người nuôi thú cưng khi bé có biểu hiện bất thường, và lý do Lê Sơn đề cao việc lắng nghe bệnh sử, quan sát lâm sàng cẩn trọng trước mọi can thiệp.
     - **Khung dữ liệu chờ xác minh (`Owner Story Slot`):** Dành sẵn một khối thông tin có nhãn `[Mốc hình thành & Câu chuyện sáng lập — Chờ Chủ dự án cung cấp nội dung xác thực]`, tuyệt đối không tự điền năm thành lập hay số liệu giả định.

3. **Khu vực 3 — Giá trị và Triết lý chăm sóc (Architectural Numbered Triptych):**
   - **Bố cục:** Nền Lavender nhạt (`--color-bg-secondary`) có viền trên/dưới mảnh. Chia làm 3 cột ngăn cách bằng đường kẻ dọc mảnh (`1px solid var(--color-border-subtle)`), đầu mỗi cột là số thứ tự `01`, `02`, `03` bằng font `Lora 600` cỡ lớn màu Orchid (`--color-plum-orchid`) — **thay thế hoàn toàn kiểu 3 thẻ bo tròn lặp lại**.
   - **3 Giá trị cốt lõi (đồng bộ nhất quán với Mốc 2B):**
     - `01 — Chuyên môn và trách nhiệm`: Tiếp cận từng ca bệnh cẩn trọng, chẩn đoán dựa trên biểu hiện lâm sàng và các bước kiểm tra cần thiết; đặt sự an toàn của thú cưng làm trọng tâm.
     - `02 — Tận tâm và lắng nghe`: Lắng nghe kỹ lưỡng những thay đổi nhỏ trong thói quen sinh hoạt của bé do chủ nuôi chia sẻ; giao tiếp nhẹ nhàng, giảm bớt áp lực tâm lý cho cả bé và gia đình.
     - `03 — Theo dõi và minh bạch`: Giải thích rõ ràng tình trạng sức khỏe, hướng xử trí và chi phí dự kiến trước khi thực hiện; thông tin trung thực trong suốt quá trình theo dõi.

4. **Khu vực 4 — Quan điểm phục vụ, chăm sóc thú cưng (Care Principles in Practice):**
   - **Bố cục:** Bố cục 12 cột bất đối xứng: Cột trái (5 cột) là khung ảnh dọc lớn (`aspect-ratio: 4/5`) kèm chú thích biên tập; cột phải (7 cột) là **Danh mục 4 nguyên tắc phục vụ** trình bày dạng dòng kẻ ngang tạp chí (`Editorial Accordion / Ledger Rows`), không dùng hộp card rời rạc:
     - *Nguyên tắc 1 — Tiếp nhận điềm tĩnh, thao tác nhẹ nhàng:* Hạn chế tiếng ồn và các tác động gây hoảng sợ khi bé mới đến phòng khám.
     - *Nguyên tắc 2 — Giải thích dễ hiểu cho chủ nuôi:* Trình bày tình trạng và hướng chăm sóc bằng ngôn ngữ rõ ràng, giúp chủ nuôi chủ động phối hợp tại nhà.
     - *Nguyên tắc 3 — Chăm sóc nội trú có theo dõi sát sao:* Vệ sinh khử khuẩn định kỳ khu lưu trú, theo dõi ăn uống, sinh hoạt và cập nhật tình hình cho gia đình.
     - *Nguyên tắc 4 — Bảo mật thông tin điều trị:* Chỉ chia sẻ các báo cáo sức khỏe và hướng dẫn chăm sóc đã được bác sĩ duyệt cho đúng chủ nuôi.

5. **Khu vực 5 — Khám phá Đội ngũ, Cơ sở vật chất và CTA:**
   - **Bố cục:**
     - Phần trên: **2 Thẻ Chuyển Tiếp Chuyên Trang (Editorial Pathway Portals)** dẫn sang `/doi-ngu` (*"Tìm hiểu đội ngũ bác sĩ & nhân sự chăm sóc"*) và `/co-so-vat-chat` (*"Tham quan không gian phòng khám & khu nội trú"*).
     - Phần dưới: **Dải CTA Deep Plum (`--color-plum-deep`)** hiển thị địa chỉ `101 Khuất Duy Tiến, Thanh Xuân, Hà Nội`, giờ khám `08:00 – 21:00`, cấp cứu `24/24`, nút `Đặt lịch khám trực tuyến` (`/dat-lich`) và nút `Gọi Hotline: 097 355 51 05`.

---

### 2.2. TRANG `/doi-ngu` — ĐỘI NGŨ NHÂN SỰ & CHUYÊN MÔN
- **Phong cách chủ đạo:** *Human-Centric Editorial + Equal Department Organization* (Tôn vinh con người và sự phối hợp đồng đội, bình đẳng về thị giác).
- **Quyết định đặc biệt của Chủ dự án — Quy tắc bắt buộc 100%:**
  1. **Tổ chức theo bộ phận thực tế, KHÔNG theo cấp bậc:** Phân chia theo nhóm công việc chuyên môn thực tế tại bệnh viện, không xếp tầng trên/dưới theo chức vụ quản lý.
  2. **Đồng đều tuyệt đối trong cùng nhóm:** Mọi thành viên trong cùng bộ phận có **cùng kích thước khung ảnh (`aspect-ratio: 4 / 5`), cùng kích thước card, cùng cỡ chữ tên, cùng số dòng mô tả và cùng kiểu viền/đổ bóng**.
  3. **Không làm riêng một section lớn dành cho Bác sĩ trưởng:** Bác sĩ phụ trách chuyên môn (`BS. Lê Thái Sơn`) nằm chung trong lưới **Đội ngũ Bác sĩ** với kích thước card bằng hệt các bác sĩ khác.
  4. **Không tạo hiệu ứng VIP hoặc visual hierarchy vì chức vụ:** Không gắn vương miện, không viền vàng, không đổi màu nền card, không làm card to gấp đôi. Chức danh (ví dụ: *Bác sĩ Thú y — Phụ trách chuyên môn*) chỉ ghi ở dòng chức danh tiêu chuẩn bên dưới tên.
  5. **Hỗ trợ nhân sự kiêm nhiệm — Không lặp lại cùng một người:** Mỗi nhân sự có một mã định danh duy nhất (`id`) và **chỉ xuất hiện 1 lần trên trang** tại bộ phận chính. Các công việc kiêm nhiệm được gắn bằng **Tag kiêm nhiệm (`Kiêm nhiệm: ...`)** ngay trên card đó.
  6. **Gom nhóm hợp lý bộ phận ít người:** Nếu một bộ phận thực tế chỉ có 1 nhân sự (ví dụ 1 chuyên viên Grooming và 1 nhân sự Điều dưỡng/Hỗ trợ), thiết kế gom vào một khu vực chung (**"Bộ phận Spa & Grooming và Điều dưỡng Chăm sóc"**) với nhãn bộ phận rõ ràng trên từng card để tạo thành lưới 2 cột cân đối, tuyệt đối không để 1 card đứng trơ trọi thành 1 section riêng.
  7. **Cân đối trên cả Desktop, Tablet và Mobile:** Áp dụng **Ma trận lưới tự cân bằng (Adaptive Zero-Orphan Grid Matrix)** để không bao giờ xảy ra tình trạng card lẻ thiếu cân đối.

#### Cấu trúc 5 Khu vực (5 Sections) của `/doi-ngu`:

1. **Khu vực 1 — Team Introduction Hero & Thanh Điều Hướng Bộ Phận:**
   - **Bố cục:** Tiêu đề tạp chí kết hợp dải thông báo minh bạch về hồ sơ nhân sự và thanh nhảy nhanh / lọc theo bộ phận thực tế (`Department Filter / Jump Bar`).
   - **Thông điệp chính:**
     - Breadcrumb: `Trang chủ` ➔ `Về Lê Sơn` ➔ `Đội ngũ`
     - Eyebrow: `ĐỘI NGŨ BỆNH VIỆN THÚ Y LÊ SƠN`
     - Tiêu đề `h1` (Lora 600): *“Sự tận tâm từ những người trực tiếp đồng hành cùng bé cưng.”*
     - Đoạn dẫn: *“Mỗi ca thăm khám, mỗi đêm trực nội trú hay mỗi buổi chăm sóc vệ sinh đều là sự phối hợp nhịp nhàng giữa các bộ phận chuyên môn tại Lê Sơn — nơi mọi thành viên cùng chia sẻ một chuẩn mực trách nhiệm.”*
   - **Banner minh bạch dữ liệu (Data Authenticity Notice):** Thông báo rõ các khung nhân sự mẫu trên bản thiết kế đang chờ cập nhật danh sách, ảnh chân dung và chứng chỉ đã xác minh từ bệnh viện.
   - **Thanh điều hướng bộ phận (Touch target ≥ 44px):**
     - `Tất cả bộ phận` | `Đội ngũ Bác sĩ` | `Spa, Grooming & Điều dưỡng` | `Quy trình phối hợp`

2. **Khu vực 2 — Đội ngũ Bác sĩ (Veterinary Medical Department):**
   - **Vai trò bộ phận:** Phụ trách khám lâm sàng, chẩn đoán, điều trị nội/ngoại khoa, theo dõi phác đồ nội trú và tiếp nhận cấp cứu 24/24.
   - **Quy chuẩn Card Nhân Sự Đồng Đều (`UniformTeamCard`):**
     - **Tỷ lệ ảnh:** `4 : 5` dọc, bo góc trên theo card, có nhãn `Ảnh minh họa — Chờ ảnh nhân sự thực tế`.
     - **Dòng 1 — Bộ phận chính & Tag kiêm nhiệm:** Ví dụ `[Bộ phận: Bác sĩ Thú y]` + Tag phụ `[Kiêm nhiệm: Chẩn đoán & Nội trú]` (nếu có).
     - **Dòng 2 — Họ và tên (`h3`, Lora 600, `20px`):**
       - Thẻ 1 hiển thị: `BS. Lê Thái Sơn` (nhân sự đã được ghi nhận trong tài liệu gốc của dự án).
       - Các thẻ còn lại hiển thị khung cấu trúc chuẩn: `[Họ và tên Bác sĩ — Chờ hồ sơ xác minh]` (tuyệt đối không tự bịa tên giả hay bằng cấp giả).
     - **Dòng 3 — Chức danh bên dưới tên (`Be Vietnam Pro 600`, `14px`, màu `--color-plum-primary`):** Ví dụ *Bác sĩ Thú y — Phụ trách chuyên môn* (trên thẻ BS. Lê Thái Sơn) và *Bác sĩ Thú y — Khám & Điều trị lâm sàng* (trên các thẻ bác sĩ khác). Cỡ chữ và vị trí hoàn toàn như nhau.
     - **Dòng 4 — Mô tả công việc & phạm vi phụ trách (`Be Vietnam Pro 400`, `14px`, màu `--color-fg-muted`):** Tóm tắt công việc thực tế (3 dòng đồng đều), kèm khung `[Bằng cấp / Chứng chỉ hành nghề: Chờ xác minh]`.
     - **Dòng 5 — Nhãn mảng công việc thực tế (Footer Pills):** Tối đa 3 nhãn ngắn gọn (`Khám lâm sàng`, `Theo dõi nội trú`, `Trực cấp cứu`).

3. **Khu vực 3 — Bộ phận Spa & Grooming và các Bộ phận Thực tế Khác:**
   - **Nguyên tắc tổ chức:**
     - Nếu bộ phận `Spa & Grooming` và bộ phận `Điều dưỡng / Hỗ trợ chăm sóc nội trú & Tiếp đón` mỗi bên có từ 2 nhân sự trở lên: hiển thị thành các cụm bộ phận cân đối.
     - Nếu mỗi bộ phận chỉ có 1 nhân sự (hoặc ít người): gom chung vào khu vực **“Bộ phận Spa & Grooming và Điều dưỡng Chăm sóc”** để tạo thành lưới chẵn (2 hoặc 4 thẻ đồng đều), mỗi thẻ ghi rõ nhãn bộ phận và vai trò kiêm nhiệm (ví dụ: *Chuyên viên Spa & Grooming — Kiêm hỗ trợ vệ sinh y tế*, *Điều dưỡng chăm sóc nội trú — Kiêm hỗ trợ tiếp nhận*).
   - **Quy chuẩn hiển thị:** Dùng **cùng một component `UniformTeamCard`**, cùng tỷ lệ ảnh `4:5` và cùng kích thước chữ như khu vực Bác sĩ.

4. **Khu vực 4 — Cách đội ngũ phối hợp (Cross-Functional Care Workflow):**
   - **Bố cục:** Trình bày dạng **Dải Quy Trình Ngang 4 Chặng (Architectural Workflow Strip)** trên nền Lavender (`--color-bg-secondary`), nối liền bằng đường kẻ trục thời gian — không lặp lại kiểu card nhân sự:
     - **Chặng 01 — Tiếp nhận & Ghi nhận ban đầu:** Lắng nghe triệu chứng từ chủ nuôi, kiểm tra tình trạng chung và ưu tiên ngay cho các ca cấp cứu khẩn cấp.
     - **Chặng 02 — Thăm khám & Trao đổi chuyên môn:** Bác sĩ trực tiếp khám lâm sàng, phối hợp kiểm tra cận lâm sàng (khi cần thiết) và giải thích rõ cho chủ nuôi.
     - **Chặng 03 — Chăm sóc điều trị / Lưu trú / Grooming:** Phối hợp giữa bác sĩ và bộ phận điều dưỡng/chăm sóc để thực hiện đúng hướng xử trí và giữ vệ sinh khử khuẩn.
     - **Chặng 04 — Bàn giao ca trực & Hướng dẫn tại nhà:** Bàn giao đầy đủ thông tin giữa các ca trực 24/24 và dặn dò chi tiết cách theo dõi bé sau khi về nhà.

5. **Khu vực 5 — CTA Liên hệ & Đặt lịch khám:**
   - **Bố cục:** Khung CTA hai cột cân đối: hướng dẫn chủ nuôi đặt lịch hẹn khám trước qua `/dat-lich` hoặc gọi trực tiếp Hotline `097 355 51 05` (tiếp nhận 24/24 tại `101 Khuất Duy Tiến, Thanh Xuân, Hà Nội`).

---

### 2.3. TRANG `/co-so-vat-chat` — CƠ SỞ VẬT CHẤT & TRANG THIẾT BỊ
- **Phong cách chủ đạo:** *Clinic Tour + Photo Editorial* (Tham quan không gian bệnh viện qua bố cục ảnh báo chí kết hợp bảng thông tin kỹ thuật minh bạch).
- **Quy tắc bắt buộc từ CEO Directive 017-A:**
  1. Ảnh cơ sở vật chất khi công bố chính thức như hình ảnh của Lê Sơn **bắt buộc phải là ảnh chụp thật tại 101 Khuất Duy Tiến đã được Chủ dự án duyệt**.
  2. Trong bản thiết kế và mockup, mọi hình ảnh placeholder đều phải gắn nhãn nổi bật: **`Ảnh minh họa bố cục — Không phải ảnh thực tế tại bệnh viện`**.
  3. **Chỉ mô tả thiết bị Mindray, máy siêu âm và các chức năng cụ thể khi đã xác minh model và khả năng thực tế.** Trên blueprint và mockup, các vị trí này được thiết kế thành **Khung thông số chờ xác minh (`Equipment Verification Slot`)** để Chủ dự án duyệt và điền đúng model thật.

#### Cấu trúc 5 Khu vực (5 Sections) của `/co-so-vat-chat`:

1. **Khu vực 1 — Editorial Hero (Clinic Tour Introduction):**
   - **Bố cục:** Tiêu đề lớn kết hợp khung thông tin địa điểm xác thực (`101 Khuất Duy Tiến, Thanh Xuân, Hà Nội`) và thanh điều hướng nhanh qua 4 phân khu không gian (`Zone Jump Bar`).
   - **Thông điệp chính:**
     - Breadcrumb: `Trang chủ` ➔ `Về Lê Sơn` ➔ `Cơ sở vật chất`
     - Eyebrow: `KHÔNG GIAN Y TẾ & TRANG THIẾT BỊ`
     - Tiêu đề `h1` (Lora 600): *“Không gian thăm khám sạch khuẩn, tổ chức khoa học vì sự an toàn của thú cưng.”*
     - Đoạn dẫn: *“Cơ sở Bệnh viện Thú y Lê Sơn tại 101 Khuất Duy Tiến được bố trí phân khu rõ ràng giữa khu vực tiếp đón, phòng khám lâm sàng, khu chăm sóc nội trú 24/7 và khu vệ sinh Spa & Grooming.”*
   - **Banner minh bạch hình ảnh (Mandatory Photo Policy Banner):** Nêu rõ các khung hình trong bản thiết kế hiện là ảnh minh họa bố cục (placeholder), không phải ảnh thực tế của bệnh viện; sẽ được thay bằng ảnh chụp thật tại cơ sở trước khi xuất bản.

2. **Khu vực 2 — Gallery Không gian Bệnh viện (Photo Editorial Spread):**
   - **Bố cục:** Lưới ảnh tạp chí bất đối xứng 12 cột (**Asymmetric Editorial Gallery**):
     - **Khung chính (7 cột, cao 2 hàng):** Không gian tiếp đón & khu vực chờ thăm khám.
     - **Khung phụ 1 (5 cột, hàng trên):** Không gian phòng khám & tư vấn chủ nuôi.
     - **Khung phụ 2 (5 cột, hàng dưới):** Không gian Spa & Grooming vệ sinh y tế.
   - **Đặc tả hiển thị:** Mỗi khung ảnh đều có (1) Nhãn phân khu góc trên trái, (2) Huy hiệu bắt buộc `Ảnh minh họa — Không phải ảnh bệnh viện` góc dưới phải (nền tối, tương phản WCAG AAA > 10:1), và (3) Chú thích biên tập bên dưới giải thích mục đích công năng của từng khu vực.

3. **Khu vực 3 — Khu Khám và Điều Trị (Clinical Examination & Diagnostic Zone):**
   - **Bố cục:** Bố cục tạp chí 2 cột (Cột trái: Khung ảnh lớn + Quy chuẩn vệ sinh; Cột phải: Bảng kê phân khu chức năng với đường kẻ chỉ mảnh `Architectural Specification Ledger` — không lạm dụng card nhỏ).
   - **Nội dung chức năng:**
     - *Bàn khám & Khu vực thăm khám lâm sàng:* Nơi thực hiện kiểm tra thể trạng tổng quát, nghe tim phổi, kiểm tra da lông, tai mắt và tư vấn trực tiếp cho chủ nuôi.
     - *Khu vực Chẩn đoán & Xét nghiệm:*
       - Hiển thị mô tả tổng quan phục vụ chẩn đoán cận lâm sàng.
       - **Khung chờ xác minh (`Mindray / Ultrasound Verification Slot`):** Thiết kế sẵn bảng thông số có nhãn trạng thái `[CHỜ CHỦ DỰ ÁN XÁC MINH MODEL & CHỨC NĂNG THỰC TẾ]` dành cho:
         1. Hệ thống máy xét nghiệm (ví dụ: thiết bị Mindray — cần xác nhận đúng mã model và các chỉ số xét nghiệm thực tế tại viện).
         2. Thiết bị siêu âm / chẩn đoán hình ảnh (cần xác nhận đúng dòng máy và phạm vi khảo sát thực tế).
     - *Khu vực Thủ thuật & Phẫu thuật ngoại khoa:* Phục vụ các ca xử lý vết thương, can thiệp ngoại khoa theo chỉ định của bác sĩ (kèm slot xác minh danh mục thiết bị hỗ trợ theo dõi).

4. **Khu vực 4 — Khu Nội Trú 24/7 và Trang Thiết Bị Chăm Sóc (Inpatient & Recovery Zone):**
   - **Bố cục:** Chia 2 khối đối xứng theo chiều ngang trên nền Lavender (`--color-bg-secondary`):
     - **Khối A — Khu vực Lưu trú & Theo dõi 24/7:** Mô tả quy trình vệ sinh khử khuẩn định kỳ, bố trí chuồng lưu trú thông thoáng, theo dõi chỉ số sức khỏe, chế độ ăn uống phục hồi và cập nhật tình hình định kỳ cho chủ nuôi (đồng bộ 100% với mô tả dịch vụ Nội trú 24/7 đã duyệt).
     - **Khối B — Bảng Quy chuẩn Vệ sinh & Thiết bị Hỗ trợ Nội trú:** Liệt kê quy trình làm sạch bề mặt, khử khuẩn giữa các lượt lưu trú, kèm slot `[Chờ xác minh số lượng/quy cách chuồng lưu trú & thiết bị hỗ trợ sưởi/theo dõi thực tế]`.

5. **Khu vực 5 — CTA Đến Bệnh Viện / Liên Hệ (Visit & Direction Guide):**
   - **Bố cục:** Thẻ hướng dẫn lộ trình & liên hệ trực tiếp (kế thừa ngôn ngữ thiết kế của `BookingContactSection`):
     - Cột trái (Deep Plum): Địa chỉ chính xác `101 Khuất Duy Tiến, Thanh Xuân, Hà Nội`, Giờ khám tham chiếu `08:00 – 21:00 (Tất cả các ngày)`, Tiếp nhận cấp cứu `24/24`, Hotline `097 355 51 05` và liên kết mở bản đồ Google Maps (`HOSPITAL_CONTACT.mapsUrl`).
     - Cột phải (Ivory/Card): Lời mời đặt lịch hẹn trước qua `/dat-lich` để bệnh viện chuẩn bị đón tiếp chu đáo, kèm lưu ý cấp cứu 24/24 không cần đặt lịch trước.

---

## 3. DELIVERABLE 2: WIREFRAME CHI TIẾT DESKTOP, TABLET & MOBILE

### 3.1. Wireframe Trang `/gioi-thieu`

#### A. Desktop (`1440px` / `1366px` — Container `max-w-7xl`, Grid 12 cột)
```text
+--------------------------------------------------------------------------------------------------+
| HEADER (Sticky, h-20): [Logo LÊ SƠN]   Trang chủ | Về Lê Sơn (Active) | Dịch vụ...   [Đặt lịch] |
+--------------------------------------------------------------------------------------------------+
| SECTION 1: EDITORIAL HERO (bg-primary Ivory #FBF7F1, py-16 md:py-24)                             |
| Breadcrumb: Trang chủ / Về Lê Sơn / Giới thiệu bệnh viện                                         |
| +----------------------------------------------------+ +---------------------------------------+ |
| | [7 COLS]                                           | | [5 COLS] ASYMMETRIC DUAL FRAMES       | |
| | [Eyebrow Badge: VỀ BỆNH VIỆN THÚ Y LÊ SƠN]         | | +-------------------+ +-------------+ | |
| | H1 (Lora 600, 48px-56px):                          | | | Khung ảnh chính   | | Khung phụ   | | |
| | "Nơi sự cẩn trọng y khoa song hành cùng            | | | (Tỷ lệ 4:5,       | | (Tỷ lệ 4:5, | | |
| |  lòng thấu cảm."                                   | | |  bo góc AURA)     | |  lệch nhịp) | | |
| | Lead Paragraph (Be Vietnam Pro 400, 18px):         | | | [Nhãn: Ảnh        | | [Nhãn: Ảnh  | | |
| | Mô tả định vị tại 101 Khuất Duy Tiến...            | | |  minh họa]        | |  minh họa]  | | |
| | [CTA Primary: Đặt lịch khám] [CTA Cam: 0973555105] | | +-------------------+ +-------------+ | |
| +----------------------------------------------------+ +---------------------------------------+ |
| +----------------------------------------------------------------------------------------------+ |
| | ARCHITECTURAL METADATA STRIP (Border-y 1px subtle, 3 cột kẻ chỉ dọc):                        | |
| | 01. ĐỊA CHỈ: 101 Khuất Duy Tiến, Thanh Xuân | 02. GIỜ KHÁM: 08:00–21:00 | 03. CẤP CỨU: 24/24 | |
| +----------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 2: CÂU CHUYỆN LÊ SƠN (bg-primary Ivory, Open Magazine Spread — KHÔNG DÙNG CARD LẶP)      |
| +----------------------------------------+ +---------------------------------------------------+ |
| | [5 COLS] EDITORIAL PULL-QUOTE          | | [7 COLS] NARRATIVE PROSE & VERIFICATION SLOT      | |
| | Eyebrow: CÂU CHUYỆN LÊ SƠN             | | Đoạn 1: Sự thấu hiểu nỗi lo của người nuôi...     | |
| | H2 (Lora 600, 36px):                   | | Đoạn 2: Nguyên tắc thăm khám cẩn trọng, giải      | |
| | "Mỗi bé cưng đến viện đều mang theo    | | thích rõ ràng và đồng hành chu đáo...             | |
| |  niềm thương yêu của cả một gia đình." | | +-----------------------------------------------+ | |
| | Đường kẻ chỉ dọc 2px màu Plum Primary  | | | [SLOT CHỜ CHỦ DỰ ÁN XÁC NHẬN]:                | | |
| | Ghi chú trích dẫn biên tập             | | | Mốc hình thành & câu chuyện sáng lập thực tế  | | |
| |                                        | | +-----------------------------------------------+ | |
| |                                        | | [Khung ảnh ngang 16:10 + Nhãn: Ảnh minh họa]      | |
| +----------------------------------------+ +---------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 3: GIÁ TRỊ & TRIẾT LÝ CHĂM SÓC (bg-secondary Lavender #F8F2F9, Architectural Triptych)   |
| Header: [TRIẾT LÝ HOẠT ĐỘNG] — H2: "Ba trụ cột làm nên chuẩn mực chăm sóc tại Lê Sơn"            |
| +-------------------------------+-------------------------------+------------------------------+ |
| | 01 (Lora 600, 40px, Orchid)   | 02 (Lora 600, 40px, Orchid)   | 03 (Lora 600, 40px, Orchid)  | |
| | H3: Chuyên môn & Trách nhiệm  | H3: Tận tâm & Lắng nghe       | H3: Theo dõi & Minh bạch     | |
| | (Kẻ chỉ dọc 1px ngăn cột)     | (Kẻ chỉ dọc 1px ngăn cột)     | Chẩn đoán rõ ràng, thông tin | |
| | Thăm khám dựa trên căn cứ     | Lắng nghe kỹ biểu hiện nhỏ    | trung thực về liệu trình và  | |
| | khoa học, đặt an toàn lên đầu | nhất, giảm căng thẳng cho bé  | chi phí trước khi thực hiện  | |
| +-------------------------------+-------------------------------+------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 4: QUAN ĐIỂM PHỤC VỤ & CHĂM SÓC THÚ CƯNG (bg-primary Ivory, Split 5/7)                   |
| +----------------------------------------+ +---------------------------------------------------+ |
| | [5 COLS] PORTRAIT VISUAL (4:5)         | | [7 COLS] 4 NGUYÊN TẮC PHỤC VỤ (KẺ CHỈ NGANG)      | |
| | Khung ảnh dọc bo góc 32px              | | ------------------------------------------------- | |
| | [Nhãn: Ảnh minh họa]                   | | 1. Tiếp nhận điềm tĩnh, thao tác nhẹ nhàng        | |
| | Chú thích: Môi trường thăm khám        | | ------------------------------------------------- | |
| | tôn trọng cảm xúc của thú cưng         | | 2. Giải thích dễ hiểu, đồng hành cùng chủ nuôi    | |
| |                                        | | ------------------------------------------------- | |
| |                                        | | 3. Chăm sóc nội trú 24/7 vệ sinh & sát sao        | |
| |                                        | | ------------------------------------------------- | |
| |                                        | | 4. Bảo mật thông tin & tôn trọng quyền riêng tư   | |
| +----------------------------------------+ +---------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 5: KHÁM PHÁ ĐỘI NGŨ, CƠ SỞ VẬT CHẤT & CTA                                               |
| +------------------------------------------------+ +-------------------------------------------+ |
| | PATHWAY 1 -> /doi-ngu                          | | PATHWAY 2 -> /co-so-vat-chat              | |
| | H3: Khám phá Đội ngũ Bác sĩ & Nhân sự          | | H3: Tham quan Cơ sở vật chất & Thiết bị   | |
| | Tìm hiểu các bộ phận chuyên môn ->             | | Xem không gian khám & nội trú 24/7 ->     | |
| +------------------------------------------------+ +-------------------------------------------+ |
| +----------------------------------------------------------------------------------------------+ |
| | DEEP PLUM CTA BAND (#421247): 101 Khuất Duy Tiến | 08:00–21:00 | Cấp cứu 24/24               | |
| | [Nút Primary: Đặt lịch khám (/dat-lich)]     [Nút Warm Orange: Gọi 097 355 51 05]            | |
| +----------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
```

#### B. Mobile (`390px` / `320px` — 1 cột xếp chồng mạch lạc)
```text
+----------------------------------------+
| [Logo LÊ SƠN]          [Icon Menu >=44]|
+----------------------------------------+
| Breadcrumb: Trang chủ / Giới thiệu     |
| [Eyebrow: VỀ BỆNH VIỆN THÚ Y LÊ SƠN]   |
| H1 (Lora 600, 30px):                   |
| "Nơi sự cẩn trọng y khoa song hành     |
|  cùng lòng thấu cảm."                  |
| Đoạn dẫn ngắn gọn, dễ đọc...           |
| [Nút Full-width: Đặt lịch khám]        |
| [Nút Full-width: Gọi 097 355 51 05]    |
| +------------------------------------+ |
| | Khung ảnh chính (Tỷ lệ 4:3 mobile) | |
| | [Nhãn: Ảnh minh họa]               | |
| +------------------------------------+ |
| +------------------------------------+ |
| | Dải 3 thông tin xếp dọc (1px rule) | |
| +------------------------------------+ |
+----------------------------------------+
| SECTION 2: CÂU CHUYỆN LÊ SƠN           |
| Pull-quote (Lora 600, 22px, viền trái) |
| Nội dung tự sự + Khung chờ xác nhận    |
| [Khung ảnh 16:10 + Nhãn minh họa]      |
+----------------------------------------+
| SECTION 3: 3 GIÁ TRỊ (Xếp dọc, kẻ ngang)|
| 01. Chuyên môn & Trách nhiệm           |
| -------------------------------------- |
| 02. Tận tâm & Lắng nghe                |
| -------------------------------------- |
| 03. Theo dõi & Minh bạch               |
+----------------------------------------+
| SECTION 4: 4 QUAN ĐIỂM PHỤC VỤ         |
| [Ảnh 4:3] + 4 dòng nguyên tắc kẻ chỉ   |
+----------------------------------------+
| SECTION 5: PATHWAYS & CTA              |
| [Thẻ dẫn sang /doi-ngu]                |
| [Thẻ dẫn sang /co-so-vat-chat]         |
| [Banner Deep Plum CTA + Hotline]       |
+----------------------------------------+
| FOOTER (Có đệm đáy pb-24 tránh che)    |
+----------------------------------------+
| FIXED BOTTOM BAR: [Hotline] [Đặt lịch] |
+----------------------------------------+
```

---

### 3.2. Wireframe Trang `/doi-ngu` & Ma Trận Lưới Tự Cân Bằng

#### A. Giải pháp kỹ thuật cho Quyết định đặc biệt của Chủ dự án (Adaptive Zero-Orphan Grid Matrix)
Để đảm bảo **không bao giờ xuất hiện card lẻ thiếu cân đối** dù số lượng nhân sự thực tế ($N$) của từng bộ phận là bao nhiêu sau khi Chủ dự án cung cấp danh sách, thiết kế quy định ma trận bố cục tự động theo $N$:

| Sĩ số bộ phận ($N$) | Quy tắc xử lý nhóm & Bố cục Desktop (`>= 1024px`) | Bố cục Tablet (`768px - 1023px`) | Bố cục Mobile (`< 768px`) | Đánh giá độ cân đối |
| :---: | :--- | :--- | :--- | :--- |
| **$N = 1$** | **Gom nhóm hợp lý:** Không tạo section 1 người đơn độc; gộp với bộ phận phối hợp gần nhất (ví dụ: *Spa & Grooming và Điều dưỡng Hỗ trợ*) để đạt $N \ge 2$, phân biệt bằng badge bộ phận trên card. | Lưới 2 cột cân đối | 1 cột dọc đồng nhất | **0 card lẻ** (Tránh hoàn toàn section đơn độc) |
| **$N = 2$** | Lưới **2 cột cân giữa** (giới hạn độ rộng khối 2 cột để kích thước mỗi card bằng hệt card trong lưới 3 cột). | Lưới **2 cột** (1 hàng x 2 card) | 1 cột dọc đồng nhất | **Chẵn 100%** (1 hàng x 2 card) |
| **$N = 3$** | Lưới **3 cột tiêu chuẩn** (1 hàng x 3 card đồng đều). | **1 cột thẻ ngang (Horizontal Editorial Card: ảnh 4:5 bên trái + thông tin bên phải)** để cả 3 thẻ xếp chồng đồng bộ, tránh lỗi 2+1 trên Tablet! | 1 cột dọc đồng nhất | **Chẵn 100%** trên mọi thiết bị |
| **$N = 4$** | Lưới **2x2 cân đối** (2 hàng x 2 card, giữ độ rộng card chuẩn) hoặc **4 cột đồng đều**. Ưu tiên **2x2 căn giữa** để ảnh chân dung lớn và rõ nét. | Lưới **2x2** (2 hàng x 2 card) | 1 cột dọc đồng nhất | **Chẵn 100%** (2 hàng x 2 card) |
| **$N = 5$** | Lưới **12-column Flex/Grid đối xứng**: Hàng 1 gồm 3 card (mỗi card chiếm 4/12 cột); Hàng 2 gồm 2 card (mỗi card chiếm 4/12 cột, căn giữa bằng khoảng trống 2/12 cột hai bên). Tất cả 5 card có kích thước **bằng nhau tuyệt đối 100%**! | Lưới 2 cột cho 4 card đầu + 1 cột ngang cân đối hoặc dùng chế độ thẻ ngang đồng bộ | 1 cột dọc đồng nhất | **100% đồng kích thước**, đối xứng trục giữa |
| **$N = 6$** | Lưới **3x2 tiêu chuẩn** (2 hàng x 3 card). | Lưới **2x3** (3 hàng x 2 card). | 1 cột dọc đồng nhất | **Chẵn 100%** trên mọi thiết bị |

#### B. Desktop Wireframe Trang `/doi-ngu` (`1440px` / `1366px`)
```text
+--------------------------------------------------------------------------------------------------+
| HEADER (Sticky): [Logo LÊ SƠN]   Trang chủ | Về Lê Sơn (Active) | Dịch vụ...          [Đặt lịch] |
+--------------------------------------------------------------------------------------------------+
| SECTION 1: TEAM INTRODUCTION HERO (bg-primary Ivory)                                             |
| Breadcrumb: Trang chủ / Về Lê Sơn / Đội ngũ                                                      |
| [Eyebrow: ĐỘI NGŨ NHÂN SỰ & CHUYÊN MÔN]                                                          |
| H1 (Lora 600): "Sự tận tâm từ những người trực tiếp đồng hành cùng bé cưng."                     |
| Lead Text: Tổ chức theo bộ phận chuyên môn thực tế, phối hợp chặt chẽ vì sự an toàn của bé.      |
| +----------------------------------------------------------------------------------------------+ |
| | [BANNER MINH BẠCH HỒ SƠ]: Hồ sơ chi tiết, ảnh chân dung thực tế và chứng chỉ hành nghề đang   | |
| | ở trạng thái khung mẫu thiết kế — Chỉ công bố thông tin nhân sự sau khi Chủ dự án phê duyệt. | |
| +----------------------------------------------------------------------------------------------+ |
| [JUMP / FILTER BAR (Touch >= 44px)]: (Tất cả bộ phận) | (Đội ngũ Bác sĩ) | (Spa & Điều dưỡng)    |
+--------------------------------------------------------------------------------------------------+
| SECTION 2: BỘ PHẬN BÁC SĨ THÚ Y (Tất cả card CÙNG KÍCH THƯỚC 100% — KHÔNG CÓ VIP SECTION)        |
| Header: [BỘ PHẬN KHÁM & ĐIỀU TRỊ] — H2: "Đội ngũ Bác sĩ Thú y"                                   |
| +------------------------------+ +------------------------------+ +----------------------------+ |
| | [ẢNH TỶ LỆ 4:5 ĐỒNG NHẤT]    | | [ẢNH TỶ LỆ 4:5 ĐỒNG NHẤT]    | | [ẢNH TỶ LỆ 4:5 ĐỒNG NHẤT]  | |
| | [Nhãn: Ảnh minh họa mẫu]     | | [Nhãn: Ảnh minh họa mẫu]     | | [Nhãn: Ảnh minh họa mẫu]   | |
| | ---------------------------- | | ---------------------------- | | -------------------------- | |
| | [Bộ phận: Bác sĩ Thú y]      | | [Bộ phận: Bác sĩ Thú y]      | | [Bộ phận: Bác sĩ Thú y]    | |
| | [Kiêm nhiệm: Nội trú 24/7]   | | [Kiêm nhiệm: Chẩn đoán]      | |                            | |
| | H3: BS. Lê Thái Sơn          | | H3: [Họ tên Bác sĩ —         | | H3: [Họ tên Bác sĩ —       | |
| | Chức danh: Bác sĩ Thú y —    | |      Chờ hồ sơ xác minh]     | |      Chờ hồ sơ xác minh]   | |
| | Phụ trách chuyên môn         | | Chức danh: Bác sĩ Thú y —    | | Chức danh: Bác sĩ Thú y —  | |
| | (Không làm card lớn/VIP)     | | Khám & Điều trị lâm sàng     | | Ngoại khoa & Cấp cứu       | |
| | Mô tả: [Khung thông tin      | | Mô tả: [Khung thông tin      | | Mô tả: [Khung thông tin    | |
| | chuyên môn chờ xác minh]     | | chuyên môn chờ xác minh]     | | chuyên môn chờ xác minh]   | |
| | [Khám lâm sàng] [Nội trú]    | | [Nội khoa] [Chẩn đoán]       | | [Ngoại khoa] [Cấp cứu]     | |
| +------------------------------+ +------------------------------+ +----------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 3: SPA & GROOMING VÀ BỘ PHẬN ĐIỀU DƯỠNG / HỖ TRỢ THỰC TẾ (Gom nhóm hợp lý, lưới cân đối) |
| Header: [CHĂM SÓC & HỖ TRỢ LÂM SÀNG] — H2: "Bộ phận Spa & Grooming và Điều dưỡng Chăm sóc"       |
| (Căn giữa lưới 2 cột hoặc 3 cột tùy sĩ số N, kích thước mỗi card BẰNG HỆT card Bác sĩ ở trên)    |
|                 +------------------------------+ +------------------------------+                |
|                 | [ẢNH TỶ LỆ 4:5 ĐỒNG NHẤT]    | | [ẢNH TỶ LỆ 4:5 ĐỒNG NHẤT]    |                |
|                 | [Nhãn: Ảnh minh họa mẫu]     | | [Nhãn: Ảnh minh họa mẫu]     |                |
|                 | ---------------------------- | | ---------------------------- |                |
|                 | [Bộ phận: Spa & Grooming]    | | [Bộ phận: Điều dưỡng nội trú]|                |
|                 | [Kiêm nhiệm: Vệ sinh y tế]   | | [Kiêm nhiệm: Tiếp nhận]      |                |
|                 | H3: [Nhân sự Spa & Grooming  | | H3: [Nhân sự Điều dưỡng —    |                |
|                 |      — Chờ hồ sơ xác minh]   | |      Chờ hồ sơ xác minh]     |                |
|                 | Chức danh: Chuyên viên       | | Chức danh: Điều dưỡng chăm   |                |
|                 | Grooming & Chăm sóc da lông  | | sóc nội trú & Hỗ trợ khám    |                |
|                 | [Tắm dưỡng] [Cắt tỉa vệ sinh]| | [Lưu trú 24/7] [Hỗ trợ khám] |                |
|                 +------------------------------+ +------------------------------+                |
+--------------------------------------------------------------------------------------------------+
| SECTION 4: CÁCH ĐỘI NGŨ PHỐI HỢP (bg-secondary Lavender — Architectural 4-Step Strip)            |
| Header: [PHỐI HỢP LIÊN BỘ PHẬN] — H2: "Quy trình phối hợp đồng bộ vì sự an tâm của chủ nuôi"     |
| +----------------------+ +----------------------+ +----------------------+ +-------------------+ |
| | BƯỚC 01              | | BƯỚC 02              | | BƯỚC 03              | | BƯỚC 04           | |
| | Tiếp nhận & Phân loại| | Khám & Hội chẩn      | | Chăm sóc & Theo dõi  | | Bàn giao ca 24/24 | |
| | Ghi nhận triệu chứng,| | Bác sĩ thăm khám,    | | Phối hợp Bác sĩ -    | | Bàn giao giữa các | |
| | ưu tiên cấp cứu ngay | | giải thích minh bạch | | Điều dưỡng - Grooming| | ca trực & dặn dò  | |
| +----------------------+ +----------------------+ +----------------------+ +-------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 5: CTA LIÊN HỆ & ĐẶT LỊCH                                                                |
| [Đặt lịch khám trực tuyến (/dat-lich)]  |  [Gọi Hotline tư vấn & cấp cứu 24/24: 097 355 51 05]   |
+--------------------------------------------------------------------------------------------------+
```

---

### 3.3. Wireframe Trang `/co-so-vat-chat`

#### A. Desktop (`1440px` / `1366px` — Clinic Tour + Photo Editorial)
```text
+--------------------------------------------------------------------------------------------------+
| HEADER (Sticky): [Logo LÊ SƠN]   Trang chủ | Về Lê Sơn (Active) | Dịch vụ...          [Đặt lịch] |
+--------------------------------------------------------------------------------------------------+
| SECTION 1: EDITORIAL HERO (bg-primary Ivory)                                                     |
| Breadcrumb: Trang chủ / Về Lê Sơn / Cơ sở vật chất                                               |
| [Eyebrow: CƠ SỞ VẬT CHẤT & TRANG THIẾT BỊ — 101 KHUẤT DUY TIẾN]                                  |
| H1 (Lora 600): "Không gian thăm khám sạch khuẩn, tổ chức khoa học vì sự an toàn của thú cưng."   |
| +----------------------------------------------------------------------------------------------+ |
| | [BANNER QUY CHUẨN HÌNH ẢNH & THIẾT BỊ]: Hình ảnh trong bản thiết kế là ảnh minh họa bố cục,  | |
| | KHÔNG phải ảnh thực tế tại bệnh viện. Thông tin máy móc chuyên sâu chỉ hiển thị khi xác minh.| |
| +----------------------------------------------------------------------------------------------+ |
| [ZONE JUMP BAR]: 01. Không gian chung | 02. Khu khám & Điều trị | 03. Khu nội trú & Thiết bị     |
+--------------------------------------------------------------------------------------------------+
| SECTION 2: GALLERY KHÔNG GIAN BỆNH VIỆN (Asymmetric 12-Col Photo Editorial Spread)               |
| +----------------------------------------------------+ +---------------------------------------+ |
| | [7 COLS, SPAN 2 ROWS] KHUNG ẢNH CHỦ ĐẠO            | | [5 COLS, ROW 1] KHUNG ẢNH PHỤ 1       | |
| | Khu vực Tiếp đón & Không gian Chờ khám             | | Khu vực Phòng khám Lâm sàng           | |
| | [Badge: Phân khu 01]                               | | [Nhãn bắt buộc: Ảnh minh họa bố cục — | |
| | [Nhãn bắt buộc: Ảnh minh họa bố cục —              | |  Không phải ảnh thực tế bệnh viện]    | |
| |  Không phải ảnh thực tế tại bệnh viện]             | +---------------------------------------+ |
| | Chú thích: Bố trí thông thoáng, thuận tiện tiếp    | +---------------------------------------+ |
| | nhận thăm khám hàng ngày và cấp cứu 24/24          | | [5 COLS, ROW 2] KHUNG ẢNH PHỤ 2       | |
| |                                                    | | Khu vực Vệ sinh Y tế, Spa & Grooming  | |
| |                                                    | | [Nhãn bắt buộc: Ảnh minh họa bố cục]  | |
| +----------------------------------------------------+ +---------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 3: KHU KHÁM VÀ ĐIỀU TRỊ (Editorial Split 5/7 + Equipment Verification Slots)             |
| +----------------------------------------+ +---------------------------------------------------+ |
| | [5 COLS] KHUNG ẢNH & QUY CHUẨN VỆ SINH | | [7 COLS] ARCHITECTURAL SPECIFICATION LEDGER       | |
| | [Ảnh minh họa khu vực khám lâm sàng]   | | 01. Khu vực Thăm khám Lâm sàng                    | |
| | [Nhãn: Ảnh minh họa — Không phải ảnh   | |     Kiểm tra tổng quát, tư vấn phác đồ minh bạch  | |
| |  thực tế tại bệnh viện]                | | ------------------------------------------------- | |
| | Hộp thông tin: Vệ sinh khử khuẩn bề    | | 02. Khu vực Chẩn đoán & Xét nghiệm cận lâm sàng   | |
| | mặt định kỳ giữa các lượt thăm khám    | |     +-------------------------------------------+ | |
| |                                        | |     | [SLOT CHỜ XÁC MINH THIẾT BỊ]:             | | |
| |                                        | |     | - Thiết bị xét nghiệm (VD: Mindray): Chờ  | | |
| |                                        | |     |   xác nhận đúng mã model & chỉ số thực tế | | |
| |                                        | |     | - Máy siêu âm / Chẩn đoán hình ảnh: Chờ   | | |
| |                                        | |     |   xác nhận model & phạm vi khảo sát       | | |
| |                                        | |     +-------------------------------------------+ | |
| |                                        | | ------------------------------------------------- | |
| |                                        | | 03. Khu vực Thủ thuật & Ngoại khoa                | |
| |                                        | |     Thực hiện thủ thuật theo chỉ định bác sĩ      | |
| +----------------------------------------+ +---------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 4: KHU NỘI TRÚ 24/7 VÀ TRANG THIẾT BỊ CHĂM SÓC (bg-secondary Lavender)                  |
| +------------------------------------------------+ +-------------------------------------------+ |
| | KHỐI A: KHU VỰC LƯU TRÚ & THEO DÕI 24/7        | | KHỐI B: QUY CHUẨN VỆ SINH & THIẾT BỊ      | |
| | [Ảnh minh họa khu nội trú + Nhãn bắt buộc]     | | - Vệ sinh khử khuẩn định kỳ khu lưu chuồng| |
| | - Chăm sóc nội trú 24/7 có theo dõi liên tục   | | - Theo dõi ăn uống, thân nhiệt & sinh hoạt| |
| | - Cập nhật tình hình định kỳ cho chủ nuôi      | | - [SLOT CHỜ XÁC MINH]: Quy cách phân khu  | |
| | - Chế độ dinh dưỡng phục hồi theo hướng dẫn    | |   chuồng lưu trú & thiết bị hỗ trợ thực tế| |
| +------------------------------------------------+ +-------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 5: CTA ĐẾN BỆNH VIỆN / LIÊN HỆ (101 Khuất Duy Tiến, Thanh Xuân, Hà Nội)                 |
| +----------------------------------------+ +---------------------------------------------------+ |
| | [5 COLS] THÔNG TIN CƠ SỞ XÁC THỰC      | | [7 COLS] HƯỚNG DẪN ĐẾN VIỆN & ĐẶT LỊCH            | |
| | - Địa chỉ: 101 Khuất Duy Tiến,         | | H3: Chủ động đặt lịch hoặc liên hệ trực tiếp      | |
| |   Thanh Xuân, Hà Nội                   | | - Đặt lịch trước qua /dat-lich để giảm chờ đợi    | |
| | - Giờ khám: 08:00 – 21:00              | | - Cấp cứu 24/24 tiếp nhận ngay không cần hẹn trước| |
| | - Cấp cứu: Tiếp nhận 24/24             | | [Nút Primary: Đặt lịch khám (/dat-lich)]          | |
| | [Mở bản đồ Google Maps]                | | [Nút Warm Orange: Gọi Hotline 097 355 51 05]      | |
| +----------------------------------------+ +---------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
```

#### B. Mobile (`390px` / `320px`)
- Toàn bộ lưới Bento 12 cột của Gallery không gian chuyển về **1 cột xếp chồng theo thứ tự ưu tiên**: Khung tiếp đón (`aspect-ratio: 4/3`) ➔ Khung phòng khám (`aspect-ratio: 16/10`) ➔ Khung Spa & Grooming (`aspect-ratio: 16/10`).
- Nhãn `Ảnh minh họa — Không phải ảnh bệnh viện` luôn nằm gọn góc dưới phải với cỡ chữ `11px`, không che khuất chủ thể chính và không tràn ngang ở màn hình `320px`.
- Thanh điều hướng phân khu (`Zone Jump Bar`) hỗ trợ cuộn ngang mượt (`overflow-x: auto`) với chiều cao nút chạm `44px`.

---

## 4. DELIVERABLE 3: ĐẶC TẢ MOCKUP TRỰC QUAN (VISUAL DESIGN SPECIFICATION)

Bản thiết kế trực quan có thể xem và tương tác trực tiếp đã được đóng gói độc lập tại file artifact:
- **Đường dẫn Artifact:** `phase-3a-interactive-mockups.html` (trong thư mục Artifacts của phiên làm việc).
- **Các tính năng trực quan được tích hợp sẵn trong Mockup Studio:**
  1. **Chuyển đổi trực tiếp giữa 3 trang:**
     - Tab 1: `/gioi-thieu` (5 khu vực chuẩn Editorial Storytelling + Clinical Credibility).
     - Tab 2: `/doi-ngu` (5 khu vực chuẩn bình đẳng nhân sự theo bộ phận thực tế, không VIP hierarchy).
     - Tab 3: `/co-so-vat-chat` (5 khu vực chuẩn Clinic Tour + Photo Editorial kèm Slot xác minh thiết bị Mindray/siêu âm).
  2. **Bộ mô phỏng trực tiếp Ma trận lưới `/doi-ngu` (Interactive Team Count & Filter Simulator):**
     - Cho phép bấm thử nghiệm thay đổi sĩ số nhóm Bác sĩ ($N = 2, 3, 4, 5, 6$) và lọc theo bộ phận để kiểm chứng trực quan: mọi card luôn giữ kích thước bằng nhau 100%, nhân sự kiêm nhiệm hiển thị bằng badge không bị lặp thẻ, và hàng cuối luôn cân đối.
  3. **Chuyển đổi chế độ Wireframe / High-Fidelity Mockup:**
     - Cho phép bật/tắt chế độ xem khung xương kiến trúc (`Wireframe Blueprint Mode`) và chế độ giao diện hoàn thiện (`Editorial Luxury Mockup Mode`).
  4. **Chuyển đổi 5 kích thước Viewport:**
     - `1440px` (Desktop) | `1366px` (Laptop) | `768px` (Tablet) | `390px` (Mobile) | `320px` (Small Mobile).
  5. **Tuân thủ tuyệt đối Font & Asset nội bộ:**
     - Nạp trực tiếp 6 file WOFF2 từ `public/fonts/` (không gọi Google Fonts bên ngoài, không dùng Lora italic giả) và ảnh WebP minh họa có gắn nhãn cảnh báo rõ ràng.

---

## 5. DELIVERABLE 4: DANH MỤC COMPONENT HIỆN CÓ & QUY CHUẨN MỞ RỘNG

Đối chiếu trực tiếp với mã nguồn hiện tại của repository tại commit `d3c32dd`:

### 5.1. Các Component & Hook hiện có tái sử dụng nguyên trạng (100% Reuse)
| Thành phần | File trong Repo | Cách tái sử dụng ở Giai đoạn 3A |
| :--- | :--- | :--- |
| **`RootLayout`** | `src/components/layout/RootLayout.tsx` | Bao bọc cả 3 trang `/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat`. Tự động cuộn lên đầu trang, chuyển focus vào `#main-content` và phát thông báo vào `#sr-announcer`. |
| **`Header`** | `src/components/layout/Header.tsx` | Menu nhóm `Về Lê Sơn` (`id: 'about'`, `matchPrefixes: ['/gioi-thieu', '/doi-ngu', '/co-so-vat-chat']`) đã hỗ trợ sẵn trạng thái active cho cả 3 trang và `aria-current="page"` cho từng mục con. |
| **`MobileNav` & `MobileBottomBar`** | `src/components/layout/MobileNav.tsx` | Accordion `Về Lê Sơn` trên di động đã nối sẵn 3 link `/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat` kèm thanh cố định chân màn hình (`Gọi 24/24` + `Đặt lịch khám`). |
| **`Footer`** | `src/components/layout/Footer.tsx` | Giữ nguyên 100% thông tin địa chỉ `101 Khuất Duy Tiến`, hotline `097 355 51 05`, giờ khám `08:00 – 21:00` và đệm đáy `pb-24 lg:pb-12`. |
| **`useRouteSeo`** | `src/hooks/useRouteSeo.ts` | Gắn tiêu đề, meta description, canonical URL và `meta name="robots"` (`noindex, nofollow` khi còn nội dung mẫu, chuyển sang `index, follow` khi Chủ dự án nghiệm thu nội dung thật). |
| **`HOSPITAL_CONTACT`** | `src/config/contact.ts` | Nguồn dữ liệu duy nhất cho tên bệnh viện, địa chỉ, hotline, link `tel:` và link Google Maps trên cả 3 trang. |

### 5.2. Các Pattern CSS Modules hiện có có thể kế thừa
| Pattern thiết kế | Nguồn tham chiếu hiện tại | Ứng dụng vào Giai đoạn 3A |
| :--- | :--- | :--- |
| **Khung ảnh cắt góc Editorial (`frameLeft`, `frameRight`)** | `src/components/sections/HeroSection.module.css` | Tái sử dụng kiểu bo góc bất đối xứng (`2.25rem 0.75rem 2.25rem 0.75rem`) cho cụm ảnh Hero của `/gioi-thieu` và `/co-so-vat-chat`. |
| **Thẻ thông tin & Banner Cấp cứu (`bentoCard`, `emergencyBanner`)** | `src/components/sections/WhyChooseUs.module.css` | Tái sử dụng cho khối thông tin liên hệ và dải CTA cuối trang của cả 3 trang. |
| **Nhãn ảnh minh họa tương phản cao (`IllustrationBadge`)** | `src/components/sections/FeaturedServices.tsx` & `EditorialKnowledge.tsx` | Áp dụng thống nhất cho mọi ảnh placeholder trên 3 trang (nền tối mờ, chữ trắng `12px`, tương phản > 10:1). |
| **Breadcrumb & Header Pattern** | `src/pages/BookingPage.tsx` & `BookingPage.module.css` | Kế thừa cấu trúc `<nav aria-label="Breadcrumb">` giúp đồng bộ trải nghiệm điều hướng trang con. |

### 5.3. Phát hiện kỹ thuật & Đề xuất chuẩn hóa khi bước sang pha Implementation (Sau khi duyệt)
1. **Chuẩn hóa `src/components/ui/Button.tsx`:**
   - *Hiện trạng:* File `src/components/ui/Button.tsx` hiện tại là file khởi tạo ban đầu (đang chứa màu `bg-blue-600`, `bg-slate-900` không thuộc bảng màu thương hiệu) và chưa được các section 2B sử dụng.
   - *Đề xuất cho pha code:* Khi được phép triển khai code Giai đoạn 3A, cập nhật `Button.tsx` sang sử dụng đúng biến trong `tokens.css` (`--btn-primary-bg`, `--btn-emergency-bg`, `--btn-outline-border`) hoặc dùng component `EditorialCTA` đồng nhất.
2. **Cập nhật kiểu dữ liệu nhân sự trong `src/types/index.ts`:**
   - *Hiện trạng:* `interface Doctor` trong `src/types/index.ts` (dòng 30–39) đang có trường `isDirector?: boolean`.
   - *Đề xuất cho pha code:* Để tuân thủ triệt để quyết định của Chủ dự án (*"Tổ chức nhân sự theo bộ phận thực tế, không theo cấp bậc; không tạo visual hierarchy chỉ vì chức vụ; hỗ trợ nhân sự kiêm nhiệm"*), khi triển khai code sẽ định nghĩa cấu trúc dữ liệu `TeamMember`:
     - `id: string` (Định danh duy nhất — chống lặp thẻ)
     - `name: string`
     - `roleTitle: string` (Chức danh hiển thị bên dưới tên)
     - `primaryDepartment: 'veterinary' | 'care_support'` (Bộ phận chính để phân nhóm section)
     - `departmentLabel: string` (Nhãn bộ phận thực tế: *Bác sĩ Thú y*, *Spa & Grooming*, *Điều dưỡng nội trú*...)
     - `concurrentRoles?: string[]` (Danh sách vai trò kiêm nhiệm hiển thị dưới dạng badge phụ)
     - `responsibilities: string[]` (Các mảng công việc thực tế)
     - `verified: boolean` (Cờ xác minh hồ sơ từ Chủ dự án)

---

## 6. DELIVERABLE 5: ĐỀ XUẤT ANIMATION & TƯƠNG TÁC CHO TỪNG SECTION

Toàn bộ hiệu ứng chuyển động tuân thủ nghiêm ngặt quy định: **100% CSS Transitions / Keyframes thuần kết hợp các biến trong `src/styles/tokens.css`, không cài đặt thư viện JS animation bên ngoài, chỉ tác động lên `transform` và `opacity` để đạt 60fps và CLS = 0.000.**

| Trang / Khu vực | Hiệu ứng đề xuất | Thuộc tính & Token sử dụng (`tokens.css`) | Xử lý `prefers-reduced-motion: reduce` |
| :--- | :--- | :--- | :--- |
| **1. Hero của cả 3 trang** | Fade-up nhẹ cho khối chữ và khung ảnh khi trang vừa hiển thị (không làm trễ ảnh LCP). | - Khung ảnh LCP: **Hiển thị tức thì (`opacity: 1`)** để tối ưu chỉ số LCP.<br>- Khối phụ đề & CTA: `transform: translateY(10px) -> 0`, thời lượng `--motion-duration-normal` (`300ms`), đường cong `--motion-ease-default` (`cubic-bezier(0.16, 1, 0.3, 1)`). | Tắt hoàn toàn dịch chuyển `translateY`, hiển thị tĩnh ngay lập tức (`transition: none`). |
| **2. Khối Câu chuyện & Triết lý (`/gioi-thieu`)** | Hiệu ứng nổi nhẹ đường viền và số thứ tự `01, 02, 03` khi di chuột qua từng cột giá trị. | - Đổi màu đường kẻ chỉ từ `--color-border-subtle` sang `--color-border-medium` trong `--motion-duration-fast` (`200ms`). | Giữ đổi màu viền tĩnh khi focus/hover, không có thời gian trễ. |
| **3. Lưới Thẻ Nhân Sự (`/doi-ngu`)** | - **Hover card:** Nâng nhẹ đồng đều cho mọi thành viên (không phân biệt chức vụ).<br>- **Chuyển bộ phận (Filter):** Làm mờ nhẹ các thẻ không thuộc bộ phận đang lọc hoặc cuộn mượt đến nhóm tương ứng. | - Card hover: `transform: translateY(var(--hover-lift-y))` (`-2px`), `box-shadow: var(--shadow-card-hover)`, thời lượng `--motion-duration-normal` (`300ms`).<br>- Ảnh trong card: `transform: scale(1.02)` trong `--motion-duration-slow` (`450ms`). | Không nâng card, không phóng ảnh khi hover; chuyển đổi bộ lọc hoặc cuộn trang diễn ra tức thì (`behavior: 'auto'`). |
| **4. Gallery & Phân khu (`/co-so-vat-chat`)** | Zoom nhẹ khung ảnh (`scale(1.03)`) khi hover tương tự `HeroSection.module.css` và làm rõ thanh chú thích. | - Ảnh: `transition: transform var(--motion-duration-slow) var(--motion-ease-default)`.<br>- Nút chuyển phân khu: `--motion-duration-fast` (`200ms`). | Giữ nguyên khung ảnh tĩnh 100%, không scale. |
| **5. Dải Quy trình & CTA cuối trang** | Phản hồi xúc giác khi nhấn nút CTA (`active` press state) và vòng focus rõ nét khi điều hướng bằng bàn phím (`Tab`). | - Nút bấm: Hover `--motion-duration-fast` (`200ms`), khi nhấn giữ hạ nhẹ độ cao.<br>- Focus ring: `outline: 2px solid var(--color-focus-ring)`, `outline-offset: var(--focus-ring-offset)`. | Giữ nguyên vòng focus `2px` rõ nét phục vụ người dùng bàn phím. |

---

## 7. DELIVERABLE 6: DANH SÁCH THÔNG TIN, ẢNH & HỒ SƠ CẦN CHỦ DỰ ÁN CUNG CẤP

Để chuyển các khung placeholder sang nội dung chính thức được phép lập chỉ mục (index) trên công cụ tìm kiếm, kính đề nghị Chủ dự án cung cấp hoặc xác nhận các hạng mục sau:

### A. Danh mục cần cung cấp cho trang `/gioi-thieu`
1. **Câu chuyện hình thành & Định hướng thực tế:**
   - [ ] Đoạn giới thiệu chính thức về quá trình hình thành Bệnh viện Thú y Lê Sơn (nếu Chủ dự án muốn nêu năm bắt đầu hoạt động hoặc cột mốc cụ thể; nếu không, giữ mạch văn tập trung vào triết lý chăm sóc hiện tại).
   - [ ] Xác nhận 4 nguyên tắc phục vụ thực tế tại cơ sở `101 Khuất Duy Tiến` (quy trình đón tiếp, cách thức thông báo tình hình thú cưng nội trú cho chủ nuôi).
2. **Hình ảnh cho `/gioi-thieu`:**
   - [ ] **02 ảnh chụp thực tế tại bệnh viện** (hoặc xác nhận tiếp tục dùng ảnh minh họa có gắn nhãn trong giai đoạn Preview): (1) Ảnh bác sĩ đang thăm khám/chăm sóc thú cưng, (2) Ảnh tổng quan không gian tiếp đón của bệnh viện.

### B. Danh mục cần cung cấp cho trang `/doi-ngu`
1. **Danh sách nhân sự theo bộ phận thực tế:**
   - [ ] Danh sách họ tên, chức danh hiển thị bên dưới tên, bộ phận chính (`Bác sĩ thú y`, `Spa & Grooming`, `Điều dưỡng / Hỗ trợ...`) và **các vai trò kiêm nhiệm** (nếu một người phụ trách nhiều mảng).
   - [ ] Mô tả ngắn (2–3 câu) về mảng công việc phụ trách thực tế của từng thành viên (bao gồm thông tin xác thực cho `BS. Lê Thái Sơn` và các cộng sự).
   - [ ] Thông tin bằng cấp / trường đào tạo / chứng chỉ hành nghề (chỉ ghi những thông tin Chủ dự án muốn công bố và đã xác minh).
2. **Ảnh chân dung đồng bộ:**
   - [ ] Ảnh chân dung của từng thành viên theo **cùng một quy cách chụp** (khuyến nghị tỷ lệ dọc `4:5`, trang phục làm việc thực tế tại viện, ánh sáng đồng đều) để đảm bảo khi ghép lên lưới các card có sự hài hòa tuyệt đối.

### C. Danh mục cần cung cấp cho trang `/co-so-vat-chat`
1. **Bộ ảnh chụp thực tế tại `101 Khuất Duy Tiến, Thanh Xuân, Hà Nội`:**
   - [ ] Tối thiểu **04 – 06 ảnh thật** chụp các phân khu: (1) Mặt tiền & Sảnh tiếp đón, (2) Phòng khám lâm sàng, (3) Khu vực máy móc chẩn đoán/xét nghiệm, (4) Phòng thủ thuật/phẫu thuật, (5) Khu vực chuồng lưu trú nội trú 24/7, (6) Khu vực Spa & Grooming.
2. **Xác nhận danh mục & model trang thiết bị y tế thực tế:**
   - [ ] **Thiết bị xét nghiệm (Mindray / hãng khác):** Xác nhận tên thiết bị, mã model chính xác (ví dụ model máy xét nghiệm huyết học, máy sinh hóa) và các loại xét nghiệm thực tế đang thực hiện tại viện.
   - [ ] **Máy siêu âm & Chẩn đoán hình ảnh:** Xác nhận loại máy siêu âm (đen trắng hay Doppler màu, model cụ thể) và có trang bị máy X-quang tại cơ sở hay không.
   - [ ] **Trang thiết bị khu phẫu thuật & nội trú:** Xác nhận các thiết bị hiện có (monitor theo dõi, máy gây mê, đèn mổ, quy cách chuồng lưu trú, khu cách ly) để mô tả đúng 100% khả năng thực tế.

---

## 8. DELIVERABLE 7: TIÊU CHÍ RESPONSIVE & KHẢ NĂNG TIẾP CẬN (WCAG 2.1 AA)

### 8.1. Tiêu chí Responsive trên 7 kích thước màn hình chuẩn
Thiết kế của cả 3 trang được kiểm soát chặt chẽ trên đúng 7 mốc viewport trong quy trình QA của dự án:
- **`320px` & `360px` (Mobile nhỏ):**
  - Toàn bộ lưới chuyển về 1 cột; padding ngang `16px`; tiêu đề `h1` thu gọn về `28px–30px` (`1.75rem–1.875rem`), không đứt chữ tiếng Việt, **không tràn ngang (`scrollWidth <= clientWidth`)**.
  - Các nút bấm CTA xếp dọc chiếm 100% chiều rộng, chiều cao tối thiểu `44px`.
  - Nhãn `Ảnh minh họa` co chữ linh hoạt, không đè lên tiêu đề phụ.
- **`390px` (Mobile tiêu chuẩn):**
  - Thanh nhảy phân khu (`Department / Zone Jump Bar`) cho phép cuộn ngang mượt mà với vùng chạm `44px`.
  - Đệm chân trang (`Footer`) luôn giữ khoảng cách an toàn cho thanh cố định `MobileBottomBar`.
- **`768px` (Tablet dọc):**
  - Áp dụng ma trận lưới tự cân bằng trên `/doi-ngu`: Nhóm 2 hoặc 4 người hiển thị 2 cột (`2x1`, `2x2`); nhóm 3 người hiển thị dạng thẻ ngang toàn chiều rộng (Horizontal Card) để không bị lẻ 1 card ở hàng cuối.
- **`1366px`, `1440px` & `1920px` (Laptop & Desktop):**
  - Khung nội dung chính giới hạn ở container chuẩn của hệ thống (`1280px`), căn giữa màn hình với khoảng trắng biên rộng rãi.
  - Hình ảnh luôn có thuộc tính `width`, `height` và `aspect-ratio` tường minh để khóa cứng khung hình trước khi tải xong, giữ `CLS = 0.000`.

### 8.2. Tiêu chí Khả năng Tiếp cận (Accessibility — WCAG 2.1 AA/AAA)
1. **Độ tương phản màu sắc đã kiểm chứng (Verified Color Contrast):**
   - Chữ chính `#1A0A1C` trên nền Ivory `#FBF7F1`: **17.4 : 1** (Đạt chuẩn AAA).
   - Chữ tiêu đề `#421247` trên nền Ivory `#FBF7F1`: **11.8 : 1** (Đạt chuẩn AAA).
   - Chữ mô tả `--color-fg-muted` (`#554157`) trên nền Ivory `#FBF7F1`: **8.2 : 1** (Đạt chuẩn AAA).
   - Chữ phụ `--color-fg-subtle` (`#5A3E5E`) trên nền Ivory `#FBF7F1`: **7.6 : 1** (Đạt chuẩn AAA).
   - Chữ nhấn cam đậm `--color-warm-orange-dark` (`#9A3412`) trên nền Ivory `#FBF7F1`: **6.7 : 1** (Đạt chuẩn AA/AAA).
   - Chữ trắng `#FFFFFF` trên nút Plum `#5A1E5E`: **9.9 : 1** (Đạt chuẩn AAA).
   - Chữ trắng `#FFFFFF` trên nút Cam `#C2560C`: **4.65 : 1** (Đạt chuẩn AA).
   - Nhãn `Ảnh minh họa` (chữ trắng `#FFFFFF` trên nền đen mờ `rgba(0,0,0,0.78)`): **> 12 : 1** (Đạt chuẩn AAA).
2. **Cấu trúc ngữ nghĩa & Hỗ trợ trình đọc màn hình (Screen Reader & Keyboard):**
   - Mỗi trang có duy nhất một thẻ `<h1>`; các khu vực con tuân thủ đúng thứ bậc `<h2>` ➔ `<h3>`, không nhảy bậc heading.
   - Mọi hình ảnh placeholder đều có thuộc tính `alt` mô tả rõ nội dung kèm hậu tố `(Hình ảnh minh họa — Không phải ảnh thực tế tại bệnh viện)`.
   - Các nút lọc bộ phận trên `/doi-ngu` sử dụng `<button type="button">` với thuộc tính `aria-pressed="true/false"`, hỗ trợ điều hướng đầy đủ bằng phím `Tab`, `Enter` và `Space`.

---

## 9. DELIVERABLE 8: RỦI RO TRIỂN KHAI & CÁC ĐIỂM CẦN QUYẾT ĐỊNH

### 9.1. Bảng Phân Tích Rủi Ro Kỹ Thuật & Biện Pháp Kiểm Soát

| Mã rủi ro | Mô tả rủi ro kỹ thuật | Mức độ | Giải pháp kiểm soát trong thiết kế & khi triển khai |
| :---: | :--- | :---: | :--- |
| **R-3A-01** | **Suy giảm LCP trên Mobile khi thêm trang nhiều ảnh (`/co-so-vat-chat`, `/doi-ngu`):** Hiện tại LCP mobile trang chủ trên Vercel Preview đang ở mức `2.86s–2.88s` (mục tiêu `<= 2.5s`, vấn đề `2B-08` đang mở). Nếu các trang 3A đặt ảnh Hero quá nặng hoặc không lazy-load gallery dưới fold sẽ làm tăng LCP. | **Cao (P2)** | - **Hero của `/doi-ngu` và `/co-so-vat-chat` ưu tiên Typography-first:** Phần đầu trang (Above the fold trên mobile `390px`) hiển thị ngay tiêu đề `h1` (`Lora 600` đã được preload sẵn) và đoạn dẫn, giúp phần tử LCP trên mobile là **khối văn bản `h1`** (hiển thị gần như tức thì mà không phải chờ tải ảnh mạng 4G chậm).<br>- Mọi ảnh dưới fold bắt buộc dùng `loading="lazy"`, `decoding="async"`, định dạng WebP đa kích thước (`400w`, `800w`, `1200w`). |
| **R-3A-02** | **Tailwind v4 Oxide quét nhầm từ khóa trong tài liệu Markdown (`docs/*.md`):** Trình biên dịch `@tailwindcss/vite` mặc định quét mọi file văn bản trong repo; nếu tài liệu thiết kế chứa các chuỗi giống tên class mới sẽ làm thay đổi file CSS build. | **Trung bình (P2)** | - Trong tài liệu thiết kế này, không viết các chuỗi utility lạ chưa có trong `src/`.<br>- Khi được phép chạm vào code ở giai đoạn triển khai, khai báo giới hạn phạm vi quét của Tailwind v4 chỉ nằm trong thư mục `src/` và `index.html`. |
| **R-3A-03** | **Tăng kích thước JS Bundle tải ban đầu của Trang chủ:** Nếu import tĩnh 3 trang mới vào `src/app/routes.tsx`, người dùng vào trang chủ `/` cũng phải tải thêm code của 3 trang 3A, làm tăng Total Blocking Time (TBT). | **Cao (P2)** | - Áp dụng `React.lazy()` và `<Suspense>` cho cả 3 route `/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat` theo đúng định hướng của Architecture Baseline V1, giữ nguyên dung lượng bundle trang chủ. |
| **R-3A-04** | **Lệch bố cục khi danh sách nhân sự thực tế thay đổi số lượng:** Nếu dùng cứng 1 kiểu lưới 3 cột, khi bộ phận có 2 hoặc 4 người sẽ bị trống cột. | **Trung bình (P2)** | - Áp dụng hàm tính lớp lưới tự động theo số lượng phần tử `getBalancedGridClass(count)` dựa trên Ma trận Mục 3.2 (tự động chọn lưới 2 cột căn giữa cho $N=2,4$; 3 cột cho $N=3,6$; lưới 12 cột đối xứng 3+2 cho $N=5$). |
| **R-3A-05** | **Rủi ro công bố nhầm thông số thiết bị hoặc ảnh mẫu:** Nếu triển khai khi Chủ dự án mới cung cấp một phần thông tin (ví dụ: có ảnh phòng khám nhưng chưa xác nhận xong model máy xét nghiệm Mindray). | **Cao (P1/P2)** | - Thiết kế theo cơ chế **Data-Driven Conditional Rendering**: Phần tử nào có `verified: false` sẽ chỉ hiển thị mô tả chung hoặc nhãn minh họa rõ ràng; chỉ khi `verified: true` mới hiển thị tên model và tháo nhãn placeholder. Giữ `noindex, nofollow` cho đến khi toàn trang được duyệt. |

### 9.2. Các Điểm Cần Chủ Dự Án & CEO Quyết Định Trước Khi Triển Khai Code

1. **Quyết định 1 — Đồng bộ câu mô tả phụ của mục `/doi-ngu` trên Header & SEO Metadata:**
   - *Hiện trạng trong mã nguồn Mốc 2A:* Tại `src/components/layout/Header.tsx` (dòng 27), `src/app/routes.tsx` (dòng 31) và `docs/seo-strategy.md` (dòng 18), mô tả ngắn của đường dẫn `/doi-ngu` đang ghi: *"Bác sĩ trưởng Lê Thái Sơn & cộng sự"*.
   - *Câu hỏi xin ý kiến:* Để nhất quán 100% với quyết định đặc biệt của Chủ dự án tại Directive 017-A (*"Tổ chức nhân sự theo bộ phận thực tế, không theo cấp bậc; không tạo visual hierarchy chỉ vì chức vụ"*), Chủ dự án có muốn giữ nguyên câu mô tả ngắn trên menu dropdown hiện tại hay đổi sang *"Đội ngũ bác sĩ thú y, chăm sóc & điều dưỡng"* khi bước vào pha triển khai code?
2. **Quyết định 2 — Cách thức tổ chức các bộ phận ngoài Bác sĩ trên `/doi-ngu`:**
   - Trong bản thiết kế, các bộ phận `Spa & Grooming` và `Điều dưỡng / Hỗ trợ chăm sóc nội trú` đang được gom thành một khu vực cân đối (**Section 3: Bộ phận Spa & Grooming và Điều dưỡng Chăm sóc**). Khi Chủ dự án cung cấp danh sách nhân sự thực tế, nếu mỗi bộ phận có từ 2–3 người trở lên, Chủ dự án muốn tách thành 2 section riêng hay giữ chung trong 1 section có tab lọc nhanh?
3. **Quyết định 3 — Phương án nội dung khi triển khai code Giai đoạn 3A:**
   - Chủ dự án muốn cung cấp ngay bộ hồ sơ nhân sự thật, ảnh cơ sở vật chất thật tại `101 Khuất Duy Tiến` và model máy Mindray/siêu âm trước khi Antigravity viết code Giai đoạn 3A, hay cho phép triển khai trước khung giao diện với các Slot minh họa có gắn nhãn rõ ràng (giữ `noindex, nofollow`) rồi thay dữ liệu thật sau?

---

**PHASE 3A DESIGN READY FOR INDEPENDENT REVIEW**
