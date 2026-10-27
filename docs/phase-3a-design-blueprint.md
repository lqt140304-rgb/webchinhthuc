# THIẾT KẾ CHI TIẾT GIAI ĐOẠN 3A (PHASE 3A DESIGN BLUEPRINT)
## Bệnh viện Thú y Lê Sơn 2026 — Kiến trúc Editorial Luxury & Chuyên Môn Y Khoa
**Tài liệu:** Đồ án thiết kế Content & UX Blueprint, Wireframe, Component Inventory, Animation, Checklist & Rủi ro  
**Căn cứ:** CEO DIRECTIVE 017-A & Architecture Baseline V1  
**Phạm vi:** 3 trang chuyên sâu công khai:  
1. `/gioi-thieu` — Giới thiệu bệnh viện  
2. `/doi-ngu` — Đội ngũ bác sĩ & chuyên môn  
3. `/co-so-vat-chat` — Cơ sở vật chất & trang thiết bị  
**Trạng thái:** APPROVED FOR DESIGN — STRICTLY NO IMPLEMENTATION IN SOURCE CODE  

---

## MỤC LỤC
1. [Nguyên Tắc Chỉ Đạo & Quy Chuẩn Thiết Kế](#1-nguyen-tac-chi-dao--quy-chuan-thiet-ke)
2. [Content & UX Blueprint Chi Tiết Từng Trang](#2-content--ux-blueprint-chi-tiet-tung-trang)
   - [Trang /gioi-thieu](#a-trang-gioi-thieu--ve-benh-vien-thu-y-le-son)
   - [Trang /doi-ngu](#b-trang-doi-ngu--doi-ngu-bac-si--chuyen-mon)
   - [Trang /co-so-vat-chat](#c-trang-co-so-vat-chat--co-so-vat-chat--trang-thiet-bi)
3. [Wireframe Cấu Trúc Desktop & Mobile](#3-wireframe-cau-truc-desktop--mobile)
4. [Tái Sử Dụng Thành Phần (Component Inventory)](#4-tai-su-dung-thanh-phan-component-inventory)
5. [Đặc Tả Chuyển Động & Animation Từng Section](#5-dac-ta-chuyen-dong--animation-tung-section)
6. [Checklist Hồ Sơ, Dữ Liệu & Hình Ảnh Cần Chủ Dự Án Cung Cấp](#6-checklist-ho-so-du-lieu--hinh-anh-can-chu-du-an-cung-cap)
7. [Tiêu Chuẩn Responsive, Typography & Khả Năng Tiếp Cận (A11y)](#7-tieu-chuan-responsive-typography--kha-nang-tiep-can-a11y)
8. [Phân Tích Rủi Ro Kỹ Thuật & Các Quyết Định Cần Phê Duyệt](#8-phan-tich-rui-ro-ky-thuat--cac-quyet-dinh-can-phe-duyet)

---

## 1. NGUYÊN TẮC CHỈ ĐẠO & QUY CHUẨN THIẾT KẾ

### A. Ràng buộc bảo toàn tuyệt đối:
- **Public Website:** Giữ nguyên 100% nhận diện **Vibrant Editorial Luxury**, `RootLayout` đồng bộ, Header/Footer công khai và trọn vẹn **sáu section Trang chủ** đã được nghiệm thu có điều kiện trong Mốc 2A & 2B.
- **Không can thiệp mã nguồn:** Tuyệt đối không chỉnh sửa thư mục `src/`, không tạo route mới trong `App.tsx`, không chỉnh sửa `package.json` hoặc cấu hình Vercel trong lượt này. Toàn bộ bản thiết kế được bàn giao dưới dạng tài liệu đặc tả và Mockup độc lập.
- **Tính xác thực thông tin:** Nghiêm cấm tự tạo số năm kinh nghiệm, lịch sử hình thành giả định, số ca điều trị, chứng nhận quốc tế hoặc hồ sơ bác sĩ khi chưa có văn bản xác minh của chủ dự án. Mọi hình ảnh mẫu bắt buộc gắn nhãn minh họa rõ ràng.

### B. Chỉ đạo đặc biệt của Chủ dự án đối với trang `/doi-ngu`:
- **Bình đẳng chuyên môn & Tổ chức theo bộ phận thực tế:** Tổ chức nhân sự theo bộ phận làm việc thực tế, **không theo cấp bậc hành chính**.
- **Kích thước card & visual hierarchy đồng nhất:** Mọi thành viên trong cùng nhóm có kích thước khung ảnh, kích thước card, kiểu chữ và cách thể hiện hoàn toàn đồng đều.
- **Không tạo hiệu ứng VIP:** Tuyệt đối không dành riêng section nổi bật vượt trội hay hiệu ứng hào quang cho bác sĩ trưởng. Chức danh phụ trách chuyên môn (nếu có) được ghi chú tinh tế bằng nhãn phụ bên dưới tên, không làm lệch bố cục.
- **Nhân sự kiêm nhiệm:** Sử dụng hệ thống badge chuyên môn phụ; tránh lặp lại cùng một nhân sự trên nhiều thẻ khác nhau gây loãng thông tin.
- **Bố cục lưới cân bằng:** Tránh tình trạng bộ phận chỉ có 1 người tạo ra section cô lập; nhóm hợp lý các bộ phận nhỏ để đạt lưới cân đối (2x2 hoặc 3x3 trên desktop, 2 cột hoặc 1 cột liền mạch trên mobile).

---

## 2. CONTENT & UX BLUEPRINT CHI TIẾT TỪNG TRANG

```
                                  KIẾN TRÚC GIAI ĐOẠN 3A
                                             │
      ┌──────────────────────────────────────┼──────────────────────────────────────┐
      ▼                                      ▼                                      ▼
[ /gioi-thieu ]                        [ /doi-ngu ]                       [ /co-so-vat-chat ]
Editorial Storytelling                 Team Human Equality                Clinic Tour & Tech
5 Section liên hoàn:                   5 Section cân bằng:                5 Section trải nghiệm:
1. Editorial Hero                      1. Team Hero                       1. Clinic Hero
2. Câu chuyện Lê Sơn                   2. Đội ngũ Bác sĩ thú y            2. Không gian tiếp đón & bento
3. Giá trị & Triết lý                  3. Spa Grooming & Chăm sóc         3. Khu khám & Cận lâm sàng
4. Quan điểm phục vụ                   4. Quy trình phối hợp đội ngũ      4. Phẫu thuật & Nội trú 24/7
5. Chuyển tiếp & CTA                   5. CTA Tư vấn & Đặt lịch           5. CTA Chỉ đường & Ghé thăm
```

---

### A. TRANG `/gioi-thieu` — VỀ BỆNH VIỆN THÚ Y LÊ SƠN

* **Định vị & Phong cách:** *Editorial Storytelling + Clinical Credibility*. Sự kết hợp hài hòa giữa chất văn báo chí ấm áp, nhân văn và sự nghiêm cẩn, khoa học của một bệnh viện thú y chuẩn mực.
* **Cấu trúc 5 Section:**

#### Section 1: Editorial Hero
* **Mục tiêu:** Tạo ấn tượng đầu tiên sang trọng, ấm cúng và truyền tải thông điệp nhân văn cốt lõi ngay từ giây đầu tiên.
* **Nội dung:**
  - Category Eyebrow: `VỀ BỆNH VIỆN THÚ Y LÊ SƠN — CHĂM SÓC CHUẨN MỰC TỪ NĂM 2026`
  - Headline (Lora Serif 48px/36px): *"Hơn cả một phòng khám — Nơi tình yêu thương hòa cùng chuẩn mực y khoa."*
  - Lead Paragraph (Be Vietnam Pro 18px): *"Tại 101 Khuất Duy Tiến, chúng tôi xây dựng một điểm tựa y tế vững vàng cho thú cưng và gia đình bạn. Nơi mỗi tiếng sủa, tiếng rên nhẹ của các bé đều được lắng nghe bằng cả tấm lòng và được xử lý bằng phác đồ khoa học chính xác nhất."*
  - Action Anchors: Nút `Khám phá câu chuyện` (cuộn mượt xuống Section 2) và Nút `Đặt hẹn tư vấn` (`/dat-lich`).
* **Visual Layout:** Cột trái là typography báo chí tinh tế; cột phải là cụm ảnh đôi cắt khuyết (Dual Editorial Frame) chụp khoảnh khắc bác sĩ đang khám tai cho một bé cún với ánh mắt ân cần (kèm nhãn minh họa).
* **Information Strip:** Dải 3 thông tin hành chính xác minh:
  - Giờ khám tiêu chuẩn: `08:00 – 21:00 hàng ngày`
  - Cấp cứu khẩn cấp: `24/24 luôn sẵn sàng`
  - Vị trí: `101 Khuất Duy Tiến, Thanh Xuân, Hà Nội`

#### Section 2: Câu Chuyện Lê Sơn (The Journey & Mission)
* **Mục tiêu:** Chia sẻ lý do hình thành và sứ mệnh mà bệnh viện theo đuổi, tạo sự đồng cảm sâu sắc với chủ nuôi.
* **Nội dung:**
  - Tag: `HÀNH TRÌNH TÂM HUYẾT`
  - Title: *"Khởi nguồn từ trăn trở: Làm sao để thú cưng bớt đau đớn và chủ nuôi bớt lo âu?"*
  - Đoạn văn 1: *"Những người làm việc tại Lê Sơn cũng là những người nuôi chó, nuôi mèo. Chúng tôi hiểu cảm giác hoang mang tột cùng khi đêm muộn thú cưng bỏ ăn, nôn mửa hoặc gặp chấn thương bất ngờ. Giữa muôn vàn thông tin chưa kiểm chứng, chủ nuôi cần một nơi có thể tin tưởng tuyệt đối vào chẩn đoán của bác sĩ."*
  - Đoạn văn 2: *"Bệnh viện Thú y Lê Sơn ra đời không phải để trở thành một cơ sở thương mại hào nhoáng, mà là một mái nhà y khoa ấm áp — nơi đặt sự an toàn sinh mạng của thú cưng lên trên hết, bảo vệ quyền lợi và sự bình an của mỗi gia đình."*
* **Visual Layout:** Layout Z-pattern so le; trích dẫn lớn kiểu kéo trích (Pull Quote) nổi bật bằng font Lora 28px in nghiêng: *"Chúng tôi không xem việc chữa bệnh là một dịch vụ, mà là một lời hứa danh dự của người thầy thuốc đối với một sinh linh vô điều kiện."*

#### Section 3: Giá Trị Cốt Lõi & Triết Lý Y Khoa (Core Values)
* **Mục tiêu:** Khẳng định 3 nguyên tắc bất di bất dịch trong mọi chỉ định chuyên môn.
* **3 Khung Trụ Cột (3-Column Balanced Bento):**
  1. **Chuẩn Mực Lâm Sàng (Clinical Rigor):**
     - Biểu tượng: Stethoscope / Shield biểu trưng cho sự chuẩn xác.
     - Diễn giải: Khám lâm sàng toàn diện, chỉ định xét nghiệm dựa trên bằng chứng khoa học, không kê đơn lạm dụng kháng sinh hoặc thuốc bổ không cần thiết.
  2. **Y Đức & Thấu Cảm (Empathetic Care):**
     - Biểu tượng: Heart & Paw kết hợp.
     - Diễn giải: Thực hành phương pháp Fear-Free (giảm thiểu stress tối đa). Dành thời gian vỗ về, ổn định tâm lý cho thú cưng trước khi can thiệp y tế; kiên nhẫn và nhẹ nhàng trong từng thao tác.
  3. **Minh Bạch Tuyệt Đối (Radical Transparency):**
     - Biểu tượng: Document & Eye minh bạch.
     - Diễn giải: Giải thích chi tiết tình trạng bệnh án, phân tích ưu nhược điểm của từng phương án điều trị và thông báo dự toán chi phí rõ ràng trước khi thực hiện.

#### Section 4: Quan Điểm Phục Vụ & Môi Trường Y Tế Thân Thiện
* **Mục tiêu:** Mô tả sinh động cách bệnh viện vận hành thực tế vì sự an tâm của thú cưng.
* **4 Khối Cam Kết Hành Động (2x2 Grid):**
  - **Phân luồng an toàn Chó & Mèo:** Khu vực chờ và phòng khám riêng biệt, triệt tiêu tiếng sủa gây hoảng loạn cho mèo, hạn chế xung đột mùi và căng thẳng giác quan.
  - **Giám sát nội trú 24/7:** Kíp bác sĩ và điều dưỡng túc trực liên tục bên giường bệnh, theo dõi sát sao từng nhịp thở, dịch truyền và diễn biến sinh hiệu.
  - **Nhật ký cập nhật minh bạch:** Chia sẻ hình ảnh và tình trạng phục hồi hàng ngày cho chủ nuôi qua tin nhắn hoặc cổng tra cứu khi bé phải lưu viện.
  - **Đồng hành sức khỏe trọn đời:** Lưu trữ hồ sơ tiêm chủng, lịch tái khám và tư vấn chế độ dinh dưỡng phòng bệnh dài hạn phù hợp với từng thể trạng.

#### Section 5: Khám Phá Chuyên Sâu & Kêu Gọi Hành Động (CTA Pathways)
* **Mục tiêu:** Điều hướng mạch lạc sang các trang thành phần khác của Phase 3A và khép lại bằng hành động đặt lịch.
* **2 Thẻ Chuyển Hướng Lớn (Editorial Pathway Cards):**
  - Card A: `Gặp Gỡ Đội Ngũ Bác Sĩ & Chuyên Viên` ➔ Ảnh tập thể ấm áp, tóm tắt tinh thần đồng đội ➔ Link sang `/doi-ngu`.
  - Card B: `Tham Quan Không Gian Y Tế & Thiết Bị` ➔ Ảnh phòng khám sạch khuẩn, trang thiết bị hiện đại ➔ Link sang `/co-so-vat-chat`.
* **CTA Banner Cuối Trang:** Nền Deep Plum trang trọng, thông tin Hotline cấp cứu `097 355 51 05` và nút `Đặt Lịch Khám Trực Tiếp`.

---

### B. TRANG `/doi-ngu` — ĐỘI NGŨ BÁC SĨ & CHUYÊN MÔN

* **Định vị & Phong cách:** *Human-Centric Editorial + Professional Equality*. Tôn vinh con người làm trọng tâm, nhấn mạnh tinh thần làm việc nhóm và trách nhiệm đồng đều.
* **Cấu trúc 5 Section:**

#### Section 1: Team Introduction Hero
* **Headline:** *"Những trái tim tận tụy vì sức khỏe và sự an bình của thú cưng."*
* **Lead Text:** *"Tại Lê Sơn, chúng tôi tin rằng thiết bị hiện đại chỉ là công cụ hỗ trợ. Yếu tố quyết định sự phục hồi của các bé chính là sự thấu hiểu, đôi bàn tay chuẩn xác và lòng trắc ẩn của đội ngũ y bác sĩ, kỹ thuật viên làm việc cùng nhau như một thể thống nhất."*
* **Department Anchor Nav (Thanh trượt chuyển bộ phận):**  
  `[Tất cả thành viên]` | `[Bác sĩ Thú y]` | `[Spa, Grooming & Điều dưỡng]` | `[Cách chúng tôi phối hợp]`

#### Section 2: Đội Ngũ Bác Sĩ Thú Y (Veterinary Medical Team)
* **Quy chuẩn hiển thị:**
  - Lưới **3 cột cân đối trên Desktop (1280px - 1440px)**, **2 cột trên Tablet (768px)**, **1 cột liền mạch trên Mobile (390px)**.
  - **Tất cả các thẻ có kích thước khung ảnh (Aspect Ratio 4:5), độ cao card, padding và cỡ chữ HOÀN TOÀN GIỐNG NHAU.**
  - Không phân biệt bác sĩ trưởng hay bác sĩ điều trị về mặt thị giác.
* **Cấu trúc Card Bác Sĩ Chuẩn (Card Anatomy):**
  - **Khung ảnh (Photo frame):** Tỷ lệ 4:5, ảnh chụp chân dung blouse y tế chuẩn mực trên nền trung tính ấm, góc chụp bán thân chuyên nghiệp. Nhãn mờ góc dưới: `Ảnh minh họa nhân sự mẫu`.
  - **Họ tên thành viên (Lora Serif 20px, `--color-plum-deep`):** Ví dụ: *BST Lê Thái Sơn*, *BST Nguyễn Minh Anh*, *BST Trần Hải Đăng*...
  - **Chức danh / Trách nhiệm lâm sàng (Be Vietnam Pro 14px, `--color-plum-primary`):**  
    - Ghi nhận vai trò phụ trách hoặc định hướng chuyên môn (ví dụ: *Bác sĩ Thú y / Phụ trách Chuyên môn & Ngoại khoa*, *Bác sĩ Thú y / Nội khoa & Chẩn đoán hình ảnh*...).
  - **Tag kiêm nhiệm (Concurrent Role Badge):** Nếu nhân sự kiêm nhiệm nhiều vai trò (ví dụ: vừa khám ngoại trú vừa phụ trách đào tạo sơ cấp cứu), thể hiện bằng 1 badge nhỏ thanh nhã màu Lavender viền mận nhạt `Kiêm nhiệm: Hồi sức cấp cứu` thay vì tạo card thứ 2.
  - **Tóm tắt chuyên môn (Be Vietnam Pro 14px, `--color-fg-muted`, tối đa 3 dòng):** Tóm tắt lĩnh vực điều trị chuyên sâu, phương châm làm việc với thú cưng (dựa trên thông tin được duyệt).
  - **Pill tags chuyên môn lâm sàng:** Danh sách 3 tag nhỏ ở chân card: `[Phẫu thuật mô mềm]`, `[Nội trú 24/7]`, `[Hồi sức cấp cứu]`.

#### Section 3: Đội Ngũ Spa, Grooming & Điều Dưỡng (Care & Nursing Support)
* **Quy chuẩn nhóm bộ phận:**  
  Để tránh tình trạng các bộ phận có ít nhân sự (1–2 người) bị cô lập trên trang, gom nhóm hợp lý thành cụm **"Chăm Sóc Thẩm Mỹ & Điều Dưỡng Hỗ Trợ Lâm Sàng"** để tạo thành lưới **4 thẻ cân đối (2x2 trên Desktop, 2x2 trên Tablet, 1 cột trên Mobile)**.
* **Cấu trúc Card:** Kích thước, bố cục và tỷ lệ ảnh hoàn toàn đồng dạng với Section Bác sĩ, thể hiện triết lý bình đẳng và tôn trọng mọi mắt xích trong chuỗi chăm sóc.
* **Nội dung thẻ:**
  - Chuyên viên Spa & Grooming y tế: Kỹ thuật tắm trị liệu da liễu, vệ sinh tai móng an toàn, cắt tỉa thẩm mỹ không gây áp lực tinh thần cho thú cưng.
  - Kỹ thuật viên & Điều dưỡng thú y: Chuẩn bị phòng mổ, hỗ trợ chăm sóc nội trú thâu đêm, theo dõi dịch truyền và hỗ trợ vận động hồi phục.

#### Section 4: Cách Đội Ngũ Phối Hợp Vì Thú Cưng (Care Coordination Workflow)
* **Mục tiêu:** Thể hiện sức mạnh tập thể và quy trình làm việc chuẩn mực, chứng minh tại sao thú cưng được chăm sóc an toàn nhất khi có cả một tập thể cùng theo dõi.
* **3 Giai Đoạn Phối Hợp Liên Khoa (Horizontal Stepper Layout):**
  - **Bước 1: Tiếp Nhận & Phân Loại Lâm Sàng (Triage):** Điều dưỡng tiếp đón ghi nhận triệu chứng sơ bộ, bác sĩ thăm khám và quyết định mức độ ưu tiên cấp cứu hoặc khám thường.
  - **Bước 2: Hội Chẩn & Thống Nhất Phác Đồ:** Các bác sĩ nội khoa, ngoại khoa và chẩn đoán hình ảnh cùng xem xét kết quả siêu âm/xét nghiệm, lựa chọn phác đồ can thiệp an toàn và tiết kiệm nhất cho chủ nuôi.
  - **Bước 3: Bàn Giao Ca Trực Khép Kín:** Giao ban chi tiết tình trạng từng bé giữa kíp trực ngày và đêm; nhật ký điều trị được ghi nhận liên tục, không đứt đoạn thông tin.

#### Section 5: Kêu Gọi Hành Động (CTA)
* **Nội dung:** *"Bạn muốn trao đổi trực tiếp với bác sĩ về tình trạng của bé?"*
* **Nút hành động:** `Đặt Lịch Khám Cùng Bác Sĩ` (`/dat-lich`) và Hotline trực tiếp `097 355 51 05`.

---

### C. TRANG `/co-so-vat-chat` — CƠ SỞ VẬT CHẤT & TRANG THIẾT BỊ

* **Định vị & Phong cách:** *Clinic Tour + Photo Editorial*. Giới thiệu trực quan, minh bạch không gian thực tế tại 101 Khuất Duy Tiến, mang lại sự tin cậy tuyệt đối về điều kiện vô trùng và tiện nghi y tế.
* **Cấu trúc 5 Section:**

#### Section 1: Editorial Hero
* **Headline:** *"Không gian y tế chuẩn mực, kiến tạo vì sự an tâm và thoải mái của thú cưng."*
* **Lead Text:** *"Tọa lạc tại 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội, Bệnh viện Thú y Lê Sơn được quy hoạch đồng bộ với sảnh đón tiếp phân luồng, hệ thống phòng khám sạch khuẩn, phòng phẫu thuật vô trùng và khu nội trú chăm sóc 24/7."*
* **Tour Quick Filters:** `[Sảnh đón tiếp & Chờ]` | `[Phòng Khám & Chẩn đoán]` | `[Phòng Phẫu thuật]` | `[Khu Nội trú 24/7]`

#### Section 2: Tổng Quan Không Gian Tiếp Đón (Bento Photo Gallery)
* **Mục tiêu:** Dẫn dắt người xem như đang bước vào chuyến tham quan trực tiếp tại bệnh viện.
* **Layout Asymmetric Bento (Desktop 1440px):**
  - **Ô lớn (Primary Hero Bento, chiếm 60% chiều rộng):** Ảnh sảnh tiếp đón rộng rãi, sàn chống trượt, ánh sáng tự nhiên chan hòa, bàn đón tiếp trang nhã với sắc mận Deep Plum chủ đạo.
  - **Ô phụ trên (Stacked Bento 1, chiếm 40% chiều rộng):** Khu vực ngồi chờ riêng biệt dành cho mèo (Cat-friendly waiting nook) yên tĩnh, tránh tầm mắt chó.
  - **Ô phụ dưới (Stacked Bento 2, chiếm 40% chiều rộng):** Quầy dược phẩm và các sản phẩm dinh dưỡng y tế chính hãng được bài trí ngăn nắp.
* **Nhãn ghi chú:** Mọi ảnh đều có nhãn tinh tế: `Ảnh phối cảnh không gian y tế minh họa mẫu` (sẽ được thay thế bằng bộ ảnh chụp chính thức sau khi chủ dự án bàn giao).

#### Section 3: Khu Khám & Chẩn Đoán Hình Ảnh (Diagnostic & Treatment Wing)
* **Bố cục:** 2 cụm chi tiết so le kết hợp giữa ảnh chụp không gian và danh mục thiết bị thực tế:
  1. **Phòng Khám Lâm Sàng Riêng Biệt:**
     - Bàn khám inox y tế có nâng hạ thủy lực êm ái, giảm độ rung giật khiến thú cưng hoảng sợ.
     - Đèn khám chuyên dụng và hệ thống đèn cực tím (UV) khử khuẩn không khí giữa các lượt khám.
  2. **Khu Chẩn Đoán Cận Lâm Sàng & Xét Nghiệm:**
     - Máy siêu âm Doppler màu chuyên dụng cho thú y (khảo sát tim mạch, ổ bụng, thai kỳ).
     - Máy chụp X-quang kỹ thuật số cao tần cho kết quả chẩn đoán hình ảnh nhanh chóng trong 30 giây với liều bức xạ tối thiểu.
     - *Lưu ý kỹ thuật:* Các thông tin máy xét nghiệm sinh hóa tự động Mindray chỉ ghi chú tính năng chung, chờ chủ dự án xác nhận mã model chính xác trước khi công bố thông số kỹ thuật.

#### Section 4: Phòng Phẫu Thuật Vô Trùng & Khu Lưu Trú 24/7 (Surgical & Inpatient Wing)
* **Phòng Phẫu Thuật Vô Trùng Khép Kín:**
  - Hệ thống đèn mổ ánh sáng lạnh chuyên dụng không tạo bóng đổ.
  - Máy gây mê bay hơi Isoflurane tích hợp máy tạo oxy y tế, đảm bảo an toàn gây mê tối đa cho các ca phẫu thuật phức tạp hoặc thú cưng lớn tuổi.
  - Hệ thống Monitor theo dõi sinh hiệu đa thông số (nhịp tim, nồng độ oxy trong máu SpO2, huyết áp động mạch, thân nhiệt liên tục).
  - Tủ hấp sấy tiệt trùng nhiệt độ cao Autoclave cho dụng cụ phẫu thuật theo chu trình khép kín.
* **Khu Lưu Trú & Điều Trị Nội Trú 24/7:**
  - Hệ thống lồng lưu trú inox 304 tiêu chuẩn bệnh viện, phân tách riêng biệt khu chó và khu mèo.
  - Phân khu cách ly riêng có áp lực âm dành cho các ca bệnh truyền nhiễm, triệt tiêu nguy cơ lây nhiễm chéo.
  - Điều hòa nhiệt độ và hệ thống đèn sưởi ấm mùa đông, giữ thân nhiệt ổn định cho thú cưng hồi sức.
  - Camera giám sát từng ngăn lồng, kết nối trực tiếp với bàn trực điều dưỡng 24/24.

#### Section 5: Kêu Gọi Hành Động & Hướng Dẫn Ghé Thăm (Visit Us CTA)
* **Mục tiêu:** Mời chủ nuôi ghé thăm thực tế hoặc đặt hẹn khám trước để được chuẩn bị đón tiếp tốt nhất.
* **Bố cục:** Thẻ lớn chia 2 cột:
  - Cột trái: Hướng dẫn địa chỉ `101 Khuất Duy Tiến, Thanh Xuân, Hà Nội`, chỉ dẫn đường đi, khu vực đỗ xe máy/ô tô thuận tiện, hotline hỗ trợ `097 355 51 05`.
  - Cột phải: Form tra cứu nhanh lộ trình hoặc Nút chuyển sang Google Maps kèm nút `Đặt Lịch Khám Chuẩn Bị Trước`.

---

## 3. WIREFRAME CẤU TRÚC DESKTOP & MOBILE

### A. Wireframe Trang `/gioi-thieu`

#### Desktop Viewport (1440px / Container 1280px):
```
┌────────────────────────────────────────────────────────────────────────┐
│ [HEADER: Logo Lê Sơn ────── Menu Điều Hướng ────── Đăng nhập ── [Đặt lịch] ]│
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 1: EDITORIAL HERO                                              │
│ ┌───────────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ [VỀ BỆNH VIỆN THÚ Y LÊ SƠN]   │ │ ┌────────────────┐ ┌───────────┐ │ │
│ │ Hơn cả một phòng khám — Nơi   │ │ │ Ảnh Bác Sĩ     │ │ Ảnh Không │ │ │
│ │ tình yêu thương hòa cùng      │ │ │ Khám Bệnh      │ │ Gian Y Tế │ │ │
│ │ chuẩn mực y khoa.             │ │ │ (Frame 1)      │ │ (Frame 2) │ │ │
│ │ [Lead text mô tả ấm áp...]    │ │ └────────────────┘ └───────────┘ │ │
│ │ [Khám phá câu chuyện] [Đặt hẹn] │ └──────────────────────────────────┘ │
│ └───────────────────────────────┘                                      │
│ [Strip: Giờ khám 08:00-21:00  •  Cấp cứu 24/24  •  101 Khuất Duy Tiến] │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 2: CÂU CHUYỆN LÊ SƠN (Z-PATTERN)                               │
│ ┌───────────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ Pull Quote Lora Nghiêng:      │ │ Ảnh Giao Ban Chuyên Môn          │ │
│ │ "Chúng tôi không xem việc     │ │ (Minh họa không gian trao đổi)   │ │
│ │ chữa bệnh là một dịch vụ, mà  │ │                                  │ │
│ │ là lời hứa danh dự..."        │ │                                  │ │
│ │ [Đoạn văn tự sự sứ mệnh...]   │ │                                  │ │
│ └───────────────────────────────┘ └──────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 3: GIÁ TRỊ CỐT LÕI (3-COLUMN BALANCED BENTO)                   │
│ ┌───────────────────┐ ┌───────────────────┐ ┌────────────────────────┐ │
│ │ CHUẨN MỰC LÂM SÀNG│ │ Y ĐỨC & THẤU CẢM  │ │ MINH BẠCH TUYỆT ĐỐI    │ │
│ │ Chuẩn hóa phác đồ,│ │ Fear-Free handling│ │ Minh bạch bệnh án,     │ │
│ │ dựa trên chứng cứ │ │ Dịu dàng, kiên nhẫn│ │ Chi phí báo trước      │ │
│ └───────────────────┘ └───────────────────┘ └────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 4: QUAN ĐIỂM PHỤC VỤ (2x2 GRID)                                │
│ ┌───────────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ Phân luồng Chó & Mèo riêng    │ │ Giám sát nội trú 24/7 thâu đêm   │ │
│ ├───────────────────────────────┼──────────────────────────────────┤ │
│ │ Nhật ký hình ảnh gửi chủ nuôi │ │ Đồng hành sức khỏe trọn đời      │ │
│ └───────────────────────────────┘ └──────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 5: KHÁM PHÁ CHUYÊN SÂU & CTA                                   │
│ ┌───────────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ [ĐỘI NGŨ BÁC SĨ]              │ │ [CƠ SỞ VẬT CHẤT]                 │ │
│ │ Gặp gỡ những bàn tay tận tâm  │ │ Khám phá phòng mổ, nội trú       │ │
│ │ [Xem đội ngũ ->]              │ │ [Xem cơ sở vật chất ->]          │ │
│ └───────────────────────────────┘ └──────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ CTA: Cần tư vấn y tế? Hotline: 097 355 51 05  [Đặt Lịch Khám Ngay] │ │
│ └────────────────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ [FOOTER: Địa chỉ 101 Khuất Duy Tiến ──── Giờ khám ──── Điều hướng]    │
└────────────────────────────────────────────────────────────────────────┘
```

#### Mobile Viewport (390px):
```
┌──────────────────────────────────────┐
│ [Logo]       [Hotline 24/24]   [Menu]│
├──────────────────────────────────────┤
│ SECTION 1: HERO (MOBILE)             │
│ [VỀ BỆNH VIỆN THÚ Y LÊ SƠN]          │
│ Hơn cả một phòng khám...             │
│ ┌──────────────────────────────────┐ │
│ │ Ảnh Hero Mobile (Aspect 4:3)     │ │
│ └──────────────────────────────────┘ │
│ [Lead text ngắn gọn, dễ đọc]         │
│ [Đặt Lịch Hẹn]  [Khám Phá]           │
│ ┌──────────────────────────────────┐ │
│ │ 08:00-21:00 • 24/24 • 101 KDT    │ │
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ SECTION 2: CÂU CHUYỆN (STACKED)      │
│ "Chúng tôi không xem việc chữa bệnh  │
│ là một dịch vụ..."                   │
│ ┌──────────────────────────────────┐ │
│ │ Ảnh Giao Ban (Full-width card)   │ │
│ └──────────────────────────────────┘ │
│ [Nội dung sứ mệnh súc tích]          │
├──────────────────────────────────────┤
│ SECTION 3: GIÁ TRỊ (1-COL STACKED)   │
│ ┌──────────────────────────────────┐ │
│ │ 1. Chuẩn mực lâm sàng            │ │
│ ├──────────────────────────────────┤ │
│ │ 2. Y đức & Thấu cảm              │ │
│ ├──────────────────────────────────┤ │
│ │ 3. Minh bạch tuyệt đối           │ │
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ SECTION 4: QUAN ĐIỂM (1-COL STACKED) │
│ • Phân luồng an toàn Chó & Mèo       │
│ • Giám sát nội trú 24/7              │
│ • Cập nhật nhật ký hàng ngày         │
│ • Đồng hành phòng bệnh trọn đời      │
├──────────────────────────────────────┤
│ SECTION 5: ĐIỀU HƯỚNG & CTA          │
│ [Thẻ 1: Khám phá Đội ngũ Bác sĩ]     │
│ [Thẻ 2: Tham quan Cơ sở vật chất]    │
│ ┌──────────────────────────────────┐ │
│ │ Hotline 24/24: 097 355 51 05     │ │
│ │ [Đặt Lịch Khám]                  │ │
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ [FOOTER RÚT GỌN]                     │
├──────────────────────────────────────┤
│ [FLOATING BAR: Gọi 24/24 | Đặt lịch] │
└──────────────────────────────────────┘
```

---

### B. Wireframe Trang `/doi-ngu`

#### Desktop Viewport (1440px): Lưới 3 cột đồng nhất tuyệt đối cho Bác sĩ; Lưới 2x2 cho Grooming & Hỗ trợ
```
┌────────────────────────────────────────────────────────────────────────┐
│ [HEADER: Giữ nguyên RootLayout]                                        │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 1: TEAM HERO                                                   │
│ "Những trái tim tận tụy vì sức khỏe thú cưng của bạn."                 │
│ [Thanh phân loại: Tất cả • Bác sĩ thú y • Spa & Hỗ trợ • Quy trình]    │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 2: BÁC SĨ THÚ Y (3 CỘT ĐỒNG ĐỀU — KHÔNG CÓ VIP CARD)          │
│ ┌───────────────────┐ ┌───────────────────┐ ┌────────────────────────┐ │
│ │ [Ảnh 4:5 Bác sĩ A]│ │ [Ảnh 4:5 Bác sĩ B]│ │ [Ảnh 4:5 Bác sĩ C]     │ │
│ │ BST Lê Thái Sơn   │ │ BST Nguyễn M. Anh │ │ BST Trần Hải Đăng      │ │
│ │ Phụ trách Ch.Môn  │ │ Nội khoa & Ch.Đoán│ │ Ngoại khoa & Phẫu thuật│ │
│ │ [Tag: Hồi sức]    │ │ [Tag: Da liễu]    │ │ [Tag: Gây mê an toàn]  │ │
│ │ [Mô tả 2-3 dòng]  │ │ [Mô tả 2-3 dòng]  │ │ [Mô tả 2-3 dòng]       │ │
│ │ [Pills: Nội trú..]│ │ [Pills: Siêu âm..]│ │ [Pills: Mô mềm..]     │ │
│ └───────────────────┘ └───────────────────┘ └────────────────────────┘ │
│ ┌───────────────────┐ ┌───────────────────┐ ┌────────────────────────┐ │
│ │ [Ảnh 4:5 Bác sĩ D]│ │ [Ảnh 4:5 Bác sĩ E]│ │ [Ảnh 4:5 Bác sĩ F]     │ │
│ │ BST Phạm Thu Hà   │ │ BST Vũ Hoàng Nam  │ │ BST Đỗ Mai Linh        │ │
│ │ Khám & Điều trị   │ │ Bác sĩ Nội trú    │ │ Chẩn đoán xét nghiệm   │ │
│ └───────────────────┘ └───────────────────┘ └────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 3: SPA GROOMING & HỖ TRỢ ĐIỀU DƯỠNG (LƯỚI 2x2 CÂN ĐỐI)        │
│ ┌───────────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ [Ảnh 4:5] Chuyên viên Grooming│ │ [Ảnh 4:5] Điều dưỡng trưởng      │ │
│ │ Chăm sóc thẩm mỹ & Vệ sinh y tế│ │ Hỗ trợ phẫu thuật & Khử khuẩn   │ │
│ ├───────────────────────────────┼──────────────────────────────────┤ │
│ │ [Ảnh 4:5] Kỹ thuật viên Spa   │ │ [Ảnh 4:5] Chăm sóc khách hàng    │ │
│ │ Tắm trị liệu da liễu          │ │ Hỗ trợ hồ sơ & Đón tiếp          │ │
│ └───────────────────────────────┘ └──────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 4: QUY TRÌNH PHỐI HỢP LIÊN KHOA (3 BƯỚC)                      │
│ [Bước 1: Tiếp nhận Triage] ─> [Bước 2: Hội chẩn đa khoa] ─> [Bước 3: Giao ban 24/7] │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 5: CTA ĐẶT LỊCH GẶP BÁC SĨ                                     │
│ [Cần tư vấn trực tiếp từ bác sĩ chuyên khoa? 097 355 51 05 | Đặt hẹn]   │
└────────────────────────────────────────────────────────────────────────┘
```

#### Mobile Viewport (390px):
- Section Bác sĩ xếp 1 cột liền mạch (Single column linear), mỗi card hiển thị đầy đủ thông tin, khoảng đệm giữa các card là 20px, kích thước ảnh chiếm toàn bộ chiều rộng bên trong card, đảm bảo không có card lẻ lệch pha.
- Section Grooming & Hỗ trợ bố trí tương đồng.
- Nút gọi hotline và đặt lịch cố định chân màn hình (Floating Action Bar).

---

### C. Wireframe Trang `/co-so-vat-chat`

#### Desktop Viewport (1440px):
```
┌────────────────────────────────────────────────────────────────────────┐
│ [HEADER: Giữ nguyên RootLayout]                                        │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 1: CLINIC TOUR HERO                                            │
│ "Không gian y tế chuẩn mực, kiến tạo vì sự an tâm của thú cưng."       │
│ [Quick Jump: Sảnh tiếp đón • Phòng khám • Phòng phẫu thuật • Nội trú] │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 2: SẢNH TIẾP ĐÓN & BENTO WALKTHROUGH                           │
│ ┌───────────────────────────────────────┬────────────────────────────┐ │
│ │                                       │ [Ảnh Bento 2: Cat-Friendly]│ │
│ │ [Ảnh Lớn 60%: Sảnh Đón Tiếp Rộng Rãi] │ Góc chờ riêng cho mèo      │ │
│ │ Sàn chống trượt, thông gió tươi       ├────────────────────────────┤ │
│ │ Không gian thân thiện                 │ [Ảnh Bento 3: Quầy Dược]   │ │
│ │                                       │ Dược phẩm & Dinh dưỡng     │ │
│ └───────────────────────────────────────┴────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 3: KHU KHÁM & CHẨN ĐOÁN CẬN LÂM SÀNG                           │
│ ┌───────────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ [Ảnh Phòng Khám Lâm Sàng]     │ │ [Đặc tả trang thiết bị]          │ │
│ │ Bàn khám nâng hạ thủy lực     │ │ • Máy siêu âm màu Doppler        │ │
│ │ Đèn UV tiệt trùng giữa các ca │ │ • Máy chụp X-quang kỹ thuật số   │ │
│ │                               │ │ • Máy xét nghiệm huyết học       │ │
│ └───────────────────────────────┘ └──────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 4: PHẪU THUẬT VÔ TRÙNG & NỘI TRÚ 24/7                          │
│ ┌───────────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ [PHÒNG PHẪU THUẬT VÔ TRÙNG]   │ │ [KHU NỘI TRÚ 24/7 KHÉP KÍN]      │ │
│ │ • Máy gây mê Isoflurane       │ │ • Lồng lưu trú inox 304 chuẩn y tế│ │
│ │ • Đèn mổ ánh sáng lạnh        │ │ • Khu cách ly riêng biệt bệnh lây│ │
│ │ • Monitor đa thông số SpO2    │ │ • Điều hòa & Đèn sưởi ấm         │ │
│ │ • Nồi hấp sấy tiệt trùng      │ │ • Camera giám sát từng ngăn lồng │ │
│ └───────────────────────────────┘ └──────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 5: CHỈ ĐƯỜNG & CTA GHÉ THĂM                                    │
│ ┌───────────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ 101 Khuất Duy Tiến, Hà Nội    │ │ Bản đồ trực quan / Google Maps   │ │
│ │ Có chỗ đỗ xe máy & ô tô       │ │                                  │ │
│ │ Hotline 24/24: 097 355 51 05  │ │ [Xem trên Google Maps]           │ │
│ │ [Đặt lịch hẹn trước]          │ │                                  │ │
│ └───────────────────────────────┘ └──────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. TÁI SỬ DỤNG THÀNH PHẦN (COMPONENT INVENTORY)

Để đảm bảo hiệu năng cao, giảm kích thước bundle và duy trì tính nhất quán 100% với Mốc 2A & 2B, các trang 3A sẽ tái sử dụng tối đa các component và kiểu dáng đã được thẩm định:

| Tên Component / Pattern | Vị trí hiện tại trong Repo | Ứng dụng trong Giai đoạn 3A | Ghi chú & Tùy biến |
|---|---|---|---|
| **`RootLayout`** | `src/components/layout/RootLayout.tsx` | Khung bao bọc toàn bộ 3 trang | Giữ nguyên Header, Footer, Hotline bar |
| **`Header` & `MobileNav`** | `src/components/layout/Header.tsx`, `MobileNav.tsx` | Điều hướng đầu trang & Drawer menu | Giữ nguyên dropdown "Về Lê Sơn", active state |
| **`Footer`** | `src/components/layout/Footer.tsx` | Chân trang thông tin & hotline | Tái sử dụng 100% |
| **`Button`** | `src/components/ui/Button.tsx` | Toàn bộ CTA, anchor button | Dùng variant `primary` (Plum) và `emergency` (Warm Orange) |
| **`SectionContainer`** | Pattern từ các section mốc 2B | Khung bao chuẩn (`max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8`) | Đảm bảo đồng bộ padding và căn lề |
| **`Badge / Pill Tag`** | Pattern từ `HighlightStory.tsx` / `FeaturedServices.tsx` | Tag chuyên môn, nhãn minh họa ảnh | Dùng lớp `bg-[var(--color-bg-secondary)] text-[var(--color-plum-primary)]` |
| **`Bento Card Pattern`** | `src/components/sections/WhyChooseUs.tsx` | Thẻ Giá trị cốt lõi, Thẻ Không gian | Kế thừa viền subtle, shadow nhẹ và hover lift |
| **`Unverified Photo Badge`** | Pattern từ `HighlightStory.tsx` | Gắn vào mọi ảnh mẫu của Phase 3A | `bg-black/75 text-white backdrop-blur-xs text-xs px-2.5 py-1 rounded-md` |

---

## 5. ĐẶC TẢ CHUYỂN ĐỘNG & ANIMATION TỪNG SECTION

Tuân thủ nghiêm ngặt chuẩn CSS Tokens và quy định không dùng thư viện JS animation nặng:

1. **Hiệu ứng Fade-in & Slight-rise theo Section:**
   - Thuộc tính: `opacity: 0 -> 1`, `transform: translateY(16px) -> translateY(0)`.
   - Thời lượng: `--motion-duration-slow` (450ms).
   - Đường cong chuyển động: `--motion-ease-default` (`cubic-bezier(0.16, 1, 0.3, 1)`).
   - Kích hoạt: Sử dụng CSS `@keyframes` hoặc `IntersectionObserver` thuần khi section vào 15% viewport.

2. **Hiệu ứng Hover Card (Team Member & Bento Frame):**
   - Thuộc tính: `transform: translateY(-4px)`, `box-shadow: var(--shadow-card-hover)`.
   - Thời lượng: `--motion-duration-fast` (200ms).
   - Easing: `--motion-ease-default`.
   - Chú ý: Hình ảnh bên trong có thể scale nhẹ `transform: scale(1.02)` trong thời gian `--motion-duration-normal` (300ms) để tạo chiều sâu thị giác.

3. **Hiệu ứng Accordion / Stepper (Quy trình phối hợp):**
   - Mở rộng mượt mà bằng CSS Grid `grid-template-rows: 0fr -> 1fr`.
   - Thời lượng: `--motion-duration-normal` (300ms).

4. **Bảo toàn Khả năng Tiếp cận (A11y - Reduced Motion):**
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```
   Triệt tiêu hoàn toàn chuyển động khi người dùng kích hoạt cài đặt giảm chuyển động trên hệ điều hành.

---

## 6. CHECKLIST HỒ SƠ, DỮ LIỆU & HÌNH ẢNH CẦN CHỦ DỰ ÁN CUNG CẤP

Để chuẩn bị cho việc triển khai code ở các lượt sau mà không vi phạm nguyên tắc "không tự tạo thông tin", Antigravity lập danh mục cụ thể các dữ liệu cần Chủ dự án cung cấp:

### A. Đối với trang `/gioi-thieu`:
- [ ] Tóm tắt ngắn gọn thông điệp của Ban lãnh đạo / Sáng lập viên (1–2 đoạn văn).
- [ ] Xác nhận năm bắt đầu hoạt động chính thức hoặc các mốc phát triển đáng nhớ (nếu muốn công bố).
- [ ] 02 ảnh chụp thực tế chất lượng cao: Bác sĩ tương tác nhẹ nhàng với thú cưng và không gian làm việc chung.

### B. Đối với trang `/doi-ngu`:
- [ ] Danh sách nhân sự chính thức cần hiển thị trên website, phân nhóm theo 2 bộ phận:
  - Bác sĩ thú y (Họ tên, chức danh chuyên môn, lĩnh vực điều trị trọng tâm, các vai trò kiêm nhiệm nếu có).
  - Nhân sự Spa, Grooming & Điều dưỡng hỗ trợ (Họ tên, vai trò cụ thể).
- [ ] Bộ ảnh chân dung chuyên nghiệp của từng thành viên:
  - Phông nền ấm hoặc trung tính đồng nhất.
  - Tỷ lệ khung ảnh 4:5 hoặc 3:4, góc chụp bán thân, độ phân giải tối thiểu 800x1000px.
- [ ] Xác nhận cách gọi chức danh chuẩn y tế (ví dụ: *Bác sĩ Thú y*, *Chuyên viên Grooming Y tế*, *Điều dưỡng Trưởng*).

### C. Đối với trang `/co-so-vat-chat`:
- [ ] Bộ ảnh chụp thực tế tại cơ sở `101 Khuất Duy Tiến`:
  - 01 ảnh mặt tiền / sảnh tiếp đón rộng rãi.
  - 01 ảnh phòng chờ / khu vực tiếp đón khách hàng.
  - 01 ảnh phòng khám lâm sàng.
  - 01 ảnh phòng phẫu thuật vô trùng.
  - 01 ảnh khu nội trú / chuồng lưu bệnh 24/7.
- [ ] Xác nhận thông số và thương hiệu thiết bị cận lâm sàng:
  - Model máy xét nghiệm máu / sinh hóa (Mindray hay thương hiệu khác, mã model chính xác).
  - Hãng sản xuất máy siêu âm và máy X-quang kỹ thuật số.

---

## 7. TIÊU CHUẨN RESPONSIVE, TYPOGRAPHY & KHẢ NĂNG TIẾP CẬN (A11Y)

1. **Thử nghiệm Viewport Đa Kích Thước:**
   - `320px` (Màn hình điện thoại siêu nhỏ): Không tràn viền, cỡ chữ tiêu đề co giãn linh hoạt bằng `clamp()` hoặc media query, touch target tối thiểu 44x44px.
   - `390px` (iPhone tiêu chuẩn): Lưới 1 cột thông thoáng, hình ảnh sắc nét.
   - `768px` (iPad / Tablet dọc): Lưới 2 cột cân đối cho đội ngũ bác sĩ và bento.
   - `1366px` (Laptop phổ thông): Container chuẩn `1280px`, lề biên 40px mỗi bên.
   - `1440px - 1920px` (Desktop lớn): Giữ container trung tâm, khoảng trắng có chủ đích, không kéo dãn ảnh gây vỡ hạt.

2. **Bảo Toàn Typography & Font Loading:**
   - Tiêu đề H1, H2, H3: Font `Lora` 600 self-hosted WOFF2.
   - Đoạn văn, nhãn, menu, button: Font `Be Vietnam Pro` (weights 400, 500, 600, 700) self-hosted.
   - Không tự động kích hoạt font synthesis; giữ nguyên chiến lược tải font tối ưu của Phương án C.

3. **Tiêu Chuẩn Tiếp Cận (WCAG 2.1 AA):**
   - Độ tương phản chữ (Contrast Ratio): Văn bản chính `#1A0A1C` trên nền `#FBF7F1` đạt tỷ lệ `14.8:1` (Vượt xa chuẩn AAA `7:1`).
   - Văn bản phụ `#68546B` trên nền `#FBF7F1` đạt tỷ lệ `5.6:1` (Vượt chuẩn AA `4.5:1`).
   - Mọi nút bấm, link chuyển tiếp đều có thuộc tính `aria-label` và trạng thái `:focus-visible` với outline rõ ràng 2px.

---

## 8. PHÂN TÍCH RỦI RO KỸ THUẬT & CÁC QUYẾT ĐỊNH CẦN PHÊ DUYỆT

| Mã Rủi Ro | Phân Tích & Ảnh Hưởng | Biện Pháp Kiểm Soát & Giải Pháp Đề Xuất |
|---|---|---|
| **R-3A-01** | **Dung lượng ảnh trang Cơ sở vật chất làm chậm LCP:** Trang có nhiều ảnh lớn có nguy cơ kéo tụt điểm Lighthouse Mobile LCP. | - Áp dụng định dạng WebP với responsive `srcset` (400w, 800w, 1200w).<br>- Chỉ preload 1 ảnh Hero LCP duy nhất bằng `fetchpriority="high"`.<br>- Toàn bộ ảnh Gallery bên dưới áp dụng `loading="lazy"` và `decoding="async"`. |
| **R-3A-02** | **Lệch pha card đội ngũ trên mobile khi có thành viên lẻ:** Nếu số lượng bác sĩ là số lẻ (ví dụ 5 người), lưới 2 cột mobile sẽ thừa 1 card đơn độc. | - Trên mobile chuyển sang layout 1 cột liền mạch hoặc thiết kế card cuối dạng compact banner.<br>- Thống nhất số lượng nhân sự hiển thị chẵn theo bộ phận. |
| **R-3A-03** | **Kích thước bundle JavaScript tăng khi thêm 3 trang:** Tải toàn bộ mã 3 trang vào bundle ban đầu sẽ làm chậm First Load. | - Áp dụng `React.lazy()` chia nhỏ route độc lập (`code-splitting`).<br>- Trang chỉ tải bundle JS tương ứng khi người dùng điều hướng tới. |
| **R-3A-04** | **Trùng lặp nhân sự kiêm nhiệm:** Bác sĩ vừa khám vừa phụ trách kỹ thuật dễ bị lặp 2 lần trên trang. | - Tuân thủ nghiêm ngặt chỉ đạo: Dùng badge kiêm nhiệm trong 1 card duy nhất. |

---

## 9. KẾT LUẬN & ĐỀ NGHỊ

Bản thiết kế Phase 3A tuân thủ toàn diện các ràng buộc của **CEO DIRECTIVE 017-A**, kế thừa hệ thống Design System chuẩn mực, bảo toàn nguyên vẹn mã nguồn và sáu section trang chủ hiện tại.

Kính trình ChatGPT CEO và Claude QA xem xét đánh giá độc lập.

---

**PHASE 3A DESIGN READY FOR INDEPENDENT REVIEW**
