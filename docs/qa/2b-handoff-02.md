# Báo Cáo Bàn Giao Vòng Sửa QA 2B-02 — Antigravity

| Mục | Chi tiết |
|---|---|
| **Người thực hiện** | Antigravity (Designer & Developer, theo `AGENTS.md`) |
| **Ngày thực hiện** | 26/10/2026 |
| **Căn cứ chỉ đạo** | [CEO DIRECTIVE 006-A (FIX QA 2B-01)](#) & Báo cáo Claude QA `docs/qa/2b-qa-01.md` |
| **Nhánh làm việc** | `fix/milestone-2a-qa` |
| **SHA cơ sở được kiểm tra trước** | `56a3526` (Kết luận: PASS WITH FIXES) |
| **Trạng thái mốc** | **READY FOR CLAUDE QA 2B-02 — PENDING INDEPENDENT REVIEW** |

---

## 1. Tóm tắt giải quyết toàn bộ 11 hạng mục QA (2B-01 đến 2B-11)

### 2B-01 — Khắc phục cam kết chưa xác minh tại Section 6 (`BookingContactSection.tsx`)
- **Vấn đề trước:** Thẻ đặt lịch tại Section 6 chứa các cam kết dịch vụ chưa xác minh: *"Tiếp nhận ưu tiên"*, *"Chuẩn bị trước y án"* (dùng sai thuật ngữ pháp lý y khoa), *"Bác sĩ chuyên khoa"*.
- **Xử lý:** Thay thế 100% bằng 3 gạch đầu dòng mô tả trung thực quy trình tiếp nhận và hướng dẫn chuẩn bị:
  1. **Chủ động khung giờ:** Đề xuất trước thời gian thuận tiện nhất cho bạn và bé cưng.
  2. **Thông tin ban đầu:** Ghi nhận trước tình trạng sức khỏe và nhu cầu thăm khám của bé.
  3. **Chuẩn bị chu đáo:** Hướng dẫn những lưu ý cần thiết trước khi đưa thú cưng đến khám.

---

### 2B-02 — Chuẩn hóa danh mục dịch vụ & Khung giờ mong muốn tại `/dat-lich` (`BookingPage.tsx`)
- **Vấn đề trước:** Select dịch vụ tự đưa vào các dịch vụ chưa được phê duyệt (`tiem-phong`, `xet-nghiem`). Khung giờ hẹn giả định các slot trống cố định của viện.
- **Xử lý:**
  - Đồng bộ danh mục dịch vụ với 4 nhóm dịch vụ cốt lõi đã phê duyệt từ Section 3:
    1. Khám & Điều trị nội khoa (`kham-dieu-tri`)
    2. Chăm sóc nội trú 24/7 (`noi-tru`)
    3. Spa & Thẩm mỹ y khoa (`spa`)
    4. Cấp cứu & Phẫu thuật (`cap-cuu`)
    5. Nhu cầu thăm khám khác (trao đổi trực tiếp) (`khac`)
  - Chuyển khung giờ sang dạng **thời gian đề xuất tham khảo** trong khung giờ hoạt động 08:00 – 21:00 (Sáng: 08:00 – 12:00, Chiều: 12:00 – 17:00, Tối: 17:00 – 21:00, hoặc Linh hoạt). Bổ sung ghi chú rõ ràng: *"Khung giờ đề xuất tham khảo, phòng khám sẽ liên hệ xác nhận giờ hẹn chính xác."*

---

### 2B-03 — Minh bạch phản hồi Form & Loại bỏ thuật ngữ kỹ thuật (`BookingPage.tsx`)
- **Vấn đề trước:** Panel kết quả hiển thị dấu tick xanh và chữ "thành công", kèm thuật ngữ kỹ thuật như `BookingFormData`, `client`, `cơ sở dữ liệu`.
- **Xử lý:**
  - Loại bỏ hoàn toàn icon tick xanh (`CheckCircle2`) và từ ngữ thành công giả. Thay bằng icon thông tin trung tính (`Info`) màu hổ phách/tím nhã nhặn.
  - Sử dụng thông điệp chính xác theo chỉ đạo CEO Directive 006-A:
    > **“Thông tin bạn nhập chưa được gửi đến bệnh viện. Để đặt lịch khám, vui lòng gọi 097 355 51 05.”**
  - Bổ sung `role="status"` và `aria-live="polite"` cho panel kết quả để đảm bảo hỗ trợ trợ năng hoàn hảo cho screen reader.
  - Loại bỏ toàn bộ thuật ngữ kỹ thuật (`BookingFormData`, `client`, `API`, `database`, `cơ sở dữ liệu`) khỏi cả banner đầu trang lẫn panel sau gửi. Diễn đạt hoàn toàn bằng tiếng Việt thân thiện, minh bạch.

---

### 2B-04 — Chỉnh sửa ảnh và chú thích Hero Frame 1 (`HeroSection.tsx`)
- **Vấn đề trước:** Ảnh Frame 1 (`hero-vet-care.jpg`) chụp người chăm sóc tại nhà nhưng alt text và caption lại ghi *"Bác sĩ thăm khám lâm sàng"*.
- **Xử lý:**
  - Tag phân loại đổi từ *"Lâm Sàng"* thành *"Chăm Sóc"*.
  - Tiêu đề khung đổi thành *"Ân cần vỗ về & thấu hiểu thú cưng"*.
  - Alt text đổi thành: `"Chăm sóc và vỗ về thú cưng ân cần (Hình ảnh minh họa)"`.
  - Cấu trúc 3 khung ảnh Editorial Luxury được giữ nguyên vẹn.

---

### 2B-05 — Thay thế ảnh bài viết dính logo thương hiệu (`public/images/`)
- **Vấn đề trước:** Ảnh bài viết 2 (`article-prevention.jpg`) dính logo thương hiệu `chewy.com`; ảnh bài viết 3 dính logo đồ chơi `Champion`.
- **Xử lý:**
  - Tạo mới và thay thế cả 2 hình ảnh bằng ảnh chất lượng cao chuẩn phong cách nhiếp ảnh Editorial (tỉ lệ 3:2), ánh sáng tự nhiên ấm áp, **hoàn toàn sạch logo bên thứ ba**:
    - `public/images/article-prevention.jpg`: Chú chó lông vàng nghỉ ngơi ấm áp bên thảm len trong phòng khách mùa đông.
    - `public/images/article-firstaid.jpg`: Người chăm sóc ân cần kiểm tra bàn chân bé cún bên cạnh hộp cứu thương gia đình.

---

### 2B-06 — Thiết lập Hồ sơ nguồn ảnh & Quản lý bản quyền (`docs/assets-credits.md`)
- **Xử lý:** Đã lập bảng quản lý tài sản hình ảnh toàn diện tại `docs/assets-credits.md` cho toàn bộ 12 tệp ảnh trong `public/images/`, bao gồm: tên file, vị trí hiển thị, xuất xứ, đơn vị sở hữu, điều khoản bản quyền, tình trạng xác minh và kế hoạch bàn giao ảnh thực tế ở Giai đoạn 3.

---

### 2B-07 — Nhất quán nhãn Section 4 Câu chuyện nổi bật (`HighlightStory.tsx`)
- **Vấn đề trước:** Huy hiệu trên ảnh ghi *"Ca bệnh tiêu biểu"* mâu thuẫn với disclaimer *"Nội dung minh họa"*.
- **Xử lý:** Thay thế nhãn thành **"Câu chuyện minh họa"**, giữ nguyên quy trình điều trị 3 giai đoạn mô phỏng phục hồi lâm sàng.

---

### 2B-08 — Tối ưu LCP trên thiết bị di động (`HeroSection.tsx`)
- **Xử lý:**
  - Bổ sung `fetchPriority="high"` và `loading="eager"` duy nhất cho Frame 1 (phần tử LCP trên mobile).
  - Khai báo kích thước thực tế `width={1200}` và `height={800}` cho tất cả các khung ảnh Hero, loại bỏ hiện tượng Layout Shift (CLS).
  - Đặt `loading="lazy"` và `decoding="async"` cho Frame 2 và Frame 3.

---

### 2B-09 — Vòng chỉ báo Focus trên mọi trường form (`BookingPage.module.css`)
- **Xử lý:** Khai báo quy tắc CSS chuyên biệt `.fieldInput:focus`, `.fieldSelect:focus`, `.fieldTextarea:focus` với `outline: 2px solid var(--color-plum-primary)` và `box-shadow` nổi bật, vượt qua 100% bài kiểm tra focus tự động của Playwright.

---

### 2B-10 — Tự động Focus vào trường lỗi đầu tiên khi gửi form rỗng (`BookingPage.tsx`)
- **Xử lý:** Trong hàm `validate()`, nếu có lỗi, hệ thống ngay lập tức gán `aria-invalid="true"` và gọi `.focus()` vào trường lỗi đầu tiên (`owner-name`, `owner-phone`, `pet-name`, hoặc `preferred-date`), đồng thời liên kết đầy đủ `aria-describedby` tới thông báo lỗi tương ứng.

---

### 2B-11 — Bảo toàn Kiến trúc Baseline V1
- **Xử lý:**
  - Baseline kiến trúc V1 (`RootLayout`, `/tai-khoan/*`, `/quan-ly/*`) đã được fast-forward đưa vào `main` tại commit `d2a19c5` và giữ nguyên trạng.
  - Tuyệt đối không phát sinh code dashboard hoặc route Giai đoạn 3 ngoài phạm vi.
  - Cấu hình `vercel.json` định tuyến `X-Robots-Tag: noindex, nofollow` cho toàn bộ các trang chờ và portal theo đúng phê duyệt của Chủ dự án.

---

## 2. Bằng chứng kiểm thử tự động độc lập (E2E Test Results)

### A. Kiểm tra tĩnh & Build
- `npx oxlint`: **0 errors, 0 warnings** (32 files, 116 rules).
- `npx tsc -b`: **0 errors**.
- `npm run build`: **Success in 342ms** (Chunks sạch, không lỗi bundling).

### B. Bộ kiểm thử Claude Booking (`tests/e2e/2b-booking.e2e.test.cjs`)
- **Kết quả:** **16 PASS / 0 FAIL / 0 ERRORS** (Thời gian chạy: 25.9s).
  - Nhãn và aria-label: PASS.
  - Form rỗng & focus trường lỗi đầu tiên: PASS.
  - Chặn SĐT không hợp lệ: PASS.
  - Ngày hẹn không cho chọn quá khứ: PASS.
  - Gửi dữ liệu mẫu: Không báo thành công giả, có hotline, nói rõ chưa gửi: PASS.
  - Focus ring nhìn thấy trên mọi trường: PASS.
  - Metadata & 1 h1: PASS.
  - Responsive 7 kích thước (320, 360, 390, 768, 1366, 1440, 1920px): PASS (0 tràn ngang).
  - Tương phản chữ WCAG AA: PASS.
  - Không có console error / pageerror: PASS.

### C. Bộ kiểm thử Claude 6 Section Trang chủ (`tests/e2e/2b.e2e.test.cjs`)
- **Kết quả:** **27 PASS / 0 FAIL / 0 ERRORS** (Thời gian chạy: 68.9s).
  - Cấu trúc 6 section đúng thứ tự, không có Bác sĩ trưởng: PASS.
  - Nội dung từng Section 1–6 (CTA, hotline, địa chỉ, giờ khám, chỉ đường, không form ở trang chủ): PASS.
  - Responsive 7 kích thước (320, 360, 390, 768, 1366, 1440, 1920px): PASS (ảnh không méo, chữ không cắt, không tràn).
  - Ảnh, font Lora & Be Vietnam Pro tải tốt, hiển thị dấu tiếng Việt đầy đủ: PASS.
  - Không có nút chết hoặc link dẫn tới 404: PASS.
  - Trợ năng & tương phản WCAG AA: PASS.
  - CLS < 0.1 ở cả 390px và 1440px: PASS.
  - Không có console error: PASS.

### D. Bộ kiểm thử hồi quy Mốc 2A (`tests/e2e/2a.e2e.test.cjs`)
- **Kết quả:** **51 PASS / 0 FAIL / 2 BLOCKED** (Trùng khớp tuyệt đối với baseline nghiệm thu Claude Retest-04, không phát sinh bất kỳ lỗi hồi quy nào).

---

## 3. Danh mục tệp bàn giao

| STT | Tệp thay đổi | Mục đích |
|:---:|:---|:---|
| 1 | `src/components/sections/BookingContactSection.tsx` | 2B-01: Bỏ cam kết chưa xác minh, chuẩn hóa nội dung tiếp nhận |
| 2 | `src/components/sections/HeroSection.tsx` | 2B-04 & 2B-08: Chuẩn hóa alt/caption Frame 1, tối ưu LCP mobile |
| 3 | `src/components/sections/HighlightStory.tsx` | 2B-07: Đổi nhãn thành "Câu chuyện minh họa" |
| 4 | `src/pages/BookingPage.tsx` | 2B-02, 2B-03, 2B-10: Dịch vụ chuẩn, thời gian đề xuất, phản hồi minh bạch, focus lỗi |
| 5 | `src/pages/BookingPage.module.css` | 2B-09: Vòng chỉ báo focus WCAG |
| 6 | `public/images/article-prevention.jpg` | 2B-05: Ảnh mới sạch logo `chewy.com` |
| 7 | `public/images/article-firstaid.jpg` | 2B-05: Ảnh mới sạch logo `Champion` |
| 8 | `docs/assets-credits.md` | 2B-06: Hồ sơ nguồn ảnh và ghi công bản quyền 12 tệp ảnh |
| 9 | `docs/qa/2b-handoff-02.md` | Tài liệu báo cáo bàn giao vòng sửa 2B-02 |
| 10 | `.gitignore` | Bổ sung bỏ qua thư mục artifacts tạm `ev/` và `e2e-evidence/` |

---

## 4. Tín hiệu sẵn sàng cho QA

Mọi thay đổi đã được tự kiểm tra nghiêm ngặt bằng chính bộ script E2E của Claude.

**READY FOR CLAUDE QA 2B-02 — PENDING INDEPENDENT REVIEW**
