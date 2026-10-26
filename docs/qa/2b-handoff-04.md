# Báo Cáo Bàn Giao Vòng Sửa Tối Ưu Cuối QA 2B-04 — Antigravity

| Mục | Chi tiết |
|---|---|
| **Người thực hiện** | Antigravity (Designer & Developer, theo `AGENTS.md`) |
| **Ngày thực hiện** | 26/10/2026 |
| **Căn cứ chỉ đạo** | [CEO DIRECTIVE 008 (MILESTONE 2B FINAL OPTIMIZATION)](#), [CEO DIRECTIVE 009 (OWNER DECISION CONFIRMATION)](#) & Báo cáo Claude QA `docs/qa/2b-qa-03.md` |
| **Nhánh làm việc** | `fix/milestone-2a-qa` |
| **SHA cơ sở được kiểm tra trước** | `4c824c4` (Kết luận Claude QA 2B-03: PASS WITH FIXES — Baseline Mobile 81 / LCP 3.73s, Desktop 98 / LCP 0.88s) |
| **Trạng thái mốc** | **READY FOR CLAUDE QA 2B-04 — PENDING INDEPENDENT REVIEW**<br>**MILESTONE 2B — PENDING QA 2B-04** |

---

## 1. Tóm tắt giải quyết toàn bộ các hạng mục theo CEO Directive 008 & 009

### A. Ưu tiên số 1: Sửa 2B-08 — Triệt tiêu tài nguyên chặn hiển thị (Render-blocking Resources) & Tối ưu LCP Mobile
- **Phân tích nguyên nhân gốc rễ (Root Cause):**
  - Tại QA 2B-03, Claude ghi nhận thời gian tải ảnh `hero-vet-care-400w.webp` chỉ mất ~100ms (12.4 KB), nhưng LCP Mobile vẫn ở mức 3.73s và FCP ở mức 3.21s.
  - Nguyên nhân chính là thẻ `<link rel="stylesheet">` đồng bộ tới Google Fonts (`fonts.googleapis.com/css2?...`). Trình duyệt bị chặn hiển thị hoàn toàn (render-blocking) trong lúc thiết lập 2 kết nối TLS/DNS ngoại vi (`fonts.googleapis.com` và `fonts.gstatic.com`), tải và phân tích tệp CSS ngoại vi, gây độ trễ tĩnh lên tới 1.81s trên kết nối giả lập 4G.
- **Biện pháp xử lý triệt để:**
  1. **Tự lưu trữ phông chữ nội bộ (Self-hosted WOFF2):**
     - Đã tải và lưu trữ toàn bộ các biến thể font cần thiết của **Be Vietnam Pro** (Regular 400, Medium 500, SemiBold 600, Bold 700, Italic 400) và **Lora** (Normal 400..700, Italic 400..700) trực tiếp trong thư mục `public/fonts/` (tổng cộng 21 tệp WOFF2, dung lượng ~365 KB).
     - Định nghĩa `@font-face` chuẩn xác trong `src/styles/fonts.css` với `font-display: swap;` và các dải `unicode-range` hỗ trợ 100% đầy đủ dấu thanh tiếng Việt (`vietnamese`), ký tự mở rộng (`latin-ext`) và ký tự cơ bản (`latin`).
     - Tích hợp `@import "./fonts.css";` trực tiếp vào bundle CSS nội bộ của website.
     - Tuân thủ giấy phép nguồn mở quốc tế **SIL Open Font License (OFL 1.1)** cho cả hai họ phông chữ.
  2. **Gỡ bỏ hoàn toàn kết nối ngoại vi chặn render:**
     - Đã xóa sạch thẻ `<link rel="preconnect">` và `<link rel="stylesheet">` tới `fonts.googleapis.com` trong `index.html`.
     - Giảm số lượng tài nguyên chặn hiển thị ngoại vi về **0**.
  3. **Preload tài nguyên phông chữ quan trọng trong `<head>`:**
     - Bổ sung 3 chỉ thị preload cho các biến thể phông chữ xuất hiện ngay ở màn hình đầu:
       ```html
       <link rel="preload" href="/fonts/be-vietnam-pro-normal-400-vietnamese.woff2" as="font" type="font/woff2" crossorigin />
       <link rel="preload" href="/fonts/be-vietnam-pro-normal-400-latin.woff2" as="font" type="font/woff2" crossorigin />
       <link rel="preload" href="/fonts/lora-normal-400700-vietnamese.woff2" as="font" type="font/woff2" crossorigin />
       ```
     - Nhờ `font-display: swap;` kết hợp preload cùng origin, văn bản được hiển thị ngay lập tức không giật layout, loại bỏ FOUC và loại bỏ 100% độ trễ mạng ngoại vi.
  4. **Kết quả đo đạc thực nghiệm (3 lượt Mobile giả lập 4G + 4x CPU Throttling & 3 lượt Desktop):**
     - **Mobile Throttled (390x844, 4G 1.6Mbps, RTT 150ms, 4x CPU Slowdown):**
       - Lượt 1: FCP = 1916ms, LCP = 1916ms
       - Lượt 2: FCP = 1868ms, LCP = 1868ms
       - Lượt 3: FCP = 1896ms, LCP = 1896ms
       - **Trung vị Mobile LCP: 1.90s (1896ms)** — **Đạt mục tiêu ≤ 2.5s** của CEO Directive 008 (giảm 1.83s, tức giảm ~50% so với baseline 3.73s của QA 2B-03).
     - **Desktop (1440x900):**
       - Lượt 1: FCP = 208ms, LCP = 208ms
       - Lượt 2: FCP = 192ms, LCP = 192ms
       - Lượt 3: FCP = 184ms, LCP = 184ms
       - **Trung vị Desktop LCP: 0.19s (192ms)** — Cực nhanh, vượt trội so với baseline 0.88s của QA 2B-03.

---

### B. Xử lý các hạng mục P3 theo CEO Directive 008

#### 1. Sửa 2B-20 — Ưu tiên tải đúng ảnh LCP theo từng viewport
- **Vấn đề trước:** Frame 1 Hero (`hero-vet-care`) có `fetchPriority="high"`, nhưng Frame 2 (`hero-happy-cat`) — vốn là phần tử trung tâm vòm cong lớn nhất và là ứng viên LCP chính trên desktop — chưa được chỉ định mức độ ưu tiên cao.
- **Xử lý:**
  - Bổ sung `fetchPriority="high"` trên Frame 2 trong `HeroSection.tsx`.
  - Giữ nguyên `loading="eager"` và `decoding="async"` trên toàn bộ 3 khung ảnh Hero.

#### 2. Sửa 2B-21 — Dọn dẹp tài nguyên JPEG không sử dụng
- **Vấn đề trước:** Toàn bộ component và trang đã chuyển sang sử dụng WebP và `logo.png`, nhưng trong `public/images/` vẫn còn tồn đọng 11 tệp `.jpg` cũ không được tham chiếu, chiếm dung lượng ~1.25 MB.
- **Xử lý:**
  - Đã rà soát toàn bộ cây mã nguồn (`src/`, `index.html`, `public/`, test suites), xác minh không còn bất kỳ dòng code nào tham chiếu tới `.jpg`.
  - Đã xóa sạch 11 tệp JPEG cũ bằng `git rm`:
    `article-firstaid.jpg`, `article-nutrition.jpg`, `article-prevention.jpg`, `hero-clinic-cuddle.jpg`, `hero-happy-cat.jpg`, `hero-vet-care.jpg`, `service-exam.jpg`, `service-inpatient.jpg`, `service-spa.jpg`, `story-recovery.jpg`, `why-pet-companion.jpg`.
  - Tổng dung lượng thư mục `public/images/` sau dọn dẹp giảm xuống còn **~650 KB**, giúp gói build deploy gọn gàng, tiết kiệm băng thông Vercel.

#### 3. Sửa 2B-22 — Tăng khả năng đọc và độ tương phản của nhãn minh họa
- **Vấn đề trước:** Nhãn "Ảnh minh họa" trên các thẻ bài viết và dịch vụ có kích thước `text-[10px]` với nền `bg-black/60`, hơi nhỏ và độ tương phản chưa tối ưu khi đặt trên các nền ảnh phức tạp.
- **Xử lý:**
  - Nâng cấp kích thước chữ lên `text-xs` (12px), tăng độ đậm `font-medium`, padding `px-2.5 py-1 rounded-md`.
  - Sử dụng nền đen mờ đậm hơn `bg-black/75 text-white backdrop-blur-xs shadow-xs`, đạt tỷ lệ tương phản vượt trội > 10:1 (chuẩn WCAG AAA).
  - Áp dụng đồng bộ trên cả Section 3 (Dịch vụ tiêu biểu) và Section 5 (Góc kiến thức).

#### 4. Sửa 2B-19 & 2B-06 — Đồng bộ hồ sơ nguồn ảnh (`docs/assets-credits.md`)
- **Vấn đề trước:** Hồ sơ ghi chung rằng Hero có nhãn minh họa trên giao diện, trong khi thực tế Hero phân định qua `alt` text; một số mục stock chưa giải thích rõ phương án Giai đoạn 3.
- **Xử lý:**
  - Đồng bộ chi tiết trong `docs/assets-credits.md`:
    - Section 1 (Hero): Ghi chú minh họa qua thuộc tính trợ năng `alt="... (Hình ảnh minh họa)"` trên cả 3 frame để giữ trọn vẹn bố cục nghệ thuật vòm cong Editorial Luxury.
    - Section 3 & 5: Hiển thị nhãn trực quan `Ảnh minh họa` (12px, nền đen mờ tương phản cao).
    - Section 4: Hiển thị huy hiệu `Câu chuyện minh họa` và disclaimer minh bạch.
  - Giữ nguyên trạng thái **CHƯA XÁC MINH BẢN QUYỀN GỐC** cho 9 ảnh stock mockup theo đúng chỉ đạo của CEO Directive 008/009 ("Không tự ghi trạng thái đã xác minh nếu chưa có bằng chứng").
  - Ghi nhận 2 ảnh AI tạo bởi Google Imagen 3 qua công cụ Antigravity image-generator subagent với mô tả prompt cụ thể, tuân thủ điều khoản thương mại phi độc quyền của Google Generative AI ToS.
  - Ghi nhận 1 ảnh `logo.png` thuộc sở hữu chính thức của Bệnh viện Thú y Lê Sơn.
  - Bổ sung điều kiện trước phát hành: Toàn bộ 9 ảnh stock placeholder phải được thay thế bằng ảnh chụp thực tế tại 101 Khuất Duy Tiến trước khi phát hành production.

#### 5. Nit — Thống nhất mô tả tiếp nhận cấp cứu tại Header
- **Vấn đề:** Trong `src/components/layout/Header.tsx`, mô tả dịch vụ cấp cứu ghi *"Tiếp nhận xử lý khẩn cấp 24/7"* trong khi tiêu đề là *"Cấp cứu 24/24"*.
- **Xử lý:**
  - Đồng bộ thành *"Tiếp nhận xử lý khẩn cấp 24/24"*.
  - Tại `FeaturedServices.tsx`, dải cấp cứu cũng đồng bộ huy hiệu thành `24/24`.

---

## 2. Bằng chứng kiểm thử tự động (E2E Test Results)

Mọi thay đổi đã được kiểm tra nghiêm ngặt bằng 100% bộ kiểm thử tự động của Claude trên bản preview build:

| Bộ kiểm thử | Lệnh thực thi | Kết quả | Chi tiết & Ghi chú |
|---|---|:---:|---|
| **Linter** | `npx oxlint` | **0 errors, 0 warnings** | 35 tệp sạch hoàn toàn, 116 quy tắc |
| **TypeScript** | `npx tsc -b` | **0 errors** | Biên dịch thành công, không có lỗi kiểu |
| **Production Build** | `npm run build` | **SUCCESS (370ms)** | Bundle tối ưu, HTML inject chuẩn, WOFF2 sao chép tự động |
| **Claude Booking Suite** | `tests/e2e/2b-booking.e2e.test.cjs` | **16 PASS / 0 FAIL** | Toàn bộ form `/dat-lich`, responsive 7 màn hình, không thông báo tiếp nhận giả |
| **Claude Homepage Suite** | `tests/e2e/2b.e2e.test.cjs` | **27 PASS / 0 FAIL** | Đạt 6 section, không form ở trang chủ, font Be Vietnam Pro & Lora hiển thị dấu TV chuẩn, CLS < 0.1, WCAG AA |
| **2A Regression Suite** | `tests/e2e/2a.e2e.test.cjs` | **51 PASS / 0 FAIL / 2 BLOCKED** | Trùng khớp tuyệt đối baseline Retest-04 (2 BLOCKED: host đích & noindex SSR) |
| **2A Round02 & Round03** | `tests/e2e/2a-round02... tests/e2e/2a-round03...` | **45 PASS / 0 FAIL / 2 BLOCKED** | Đạt Drawer, dropdown, canonical, logo nét, route boundary |
| **Tổng cộng các bộ E2E** | `node --test tests/e2e/*.cjs` | **139 PASS / 0 FAIL / 4 BLOCKED** | **100% PASS trên tất cả các ca kiểm thử khả thi cục bộ** |

---

## 3. Danh mục tệp thay đổi

| STT | Tệp thay đổi | Mục đích |
|:---:|:---|:---|
| 1 | `index.html` | 2B-08: Gỡ Google Fonts CSS render-blocking, thêm preload 3 tệp WOFF2 quan trọng |
| 2 | `src/styles/fonts.css` | 2B-08: Khai báo `@font-face` cho Be Vietnam Pro & Lora với `font-display: swap;` |
| 3 | `src/styles/globals.css` | 2B-08: `@import "./fonts.css";` vào bundle CSS chung |
| 4 | `public/fonts/*.woff2` | 2B-08: 21 tệp phông chữ WOFF2 tự lưu trữ (Latin, Latin-ext, Vietnamese) |
| 5 | `src/components/sections/HeroSection.tsx` | 2B-20: Thêm `fetchPriority="high"` cho Frame 2 (desktop LCP candidate) |
| 6 | `src/components/sections/EditorialKnowledge.tsx` | 2B-22: Tăng độ tương phản và cỡ chữ nhãn "Ảnh minh họa" (12px, nền đen mờ 75%) |
| 7 | `src/components/sections/FeaturedServices.tsx` | 2B-22 & Nit: Nâng cấp nhãn minh họa (12px), đồng bộ huy hiệu cấp cứu `24/24` |
| 8 | `src/components/layout/Header.tsx` | Nit: Đồng bộ mô tả dịch vụ cấp cứu thành *"Tiếp nhận xử lý khẩn cấp 24/24"* |
| 9 | `public/images/*.jpg` | 2B-21: Xóa 11 tệp JPEG cũ không còn được tham chiếu (giảm 1.25 MB) |
| 10 | `docs/assets-credits.md` | 2B-19 & 2B-06: Bảng quản lý bản quyền ảnh đồng bộ, giữ nguyên CHƯA XÁC MINH |
| 11 | `scripts/download-fonts.cjs` | Công cụ tự động tải và tạo `@font-face` WOFF2 phục vụ duy trì dự án |
| 12 | `scripts/measure-perf.cjs` | Công cụ tự động đo lường hiệu năng FCP/LCP qua CDP throttling 4G |
| 13 | `docs/qa/2b-handoff-04.md` | Tài liệu báo cáo bàn giao hoàn thiện vòng sửa tối ưu cuối QA 2B-04 |

---

## 4. Tín hiệu sẵn sàng cho Independent QA Lead (Claude)

Toàn bộ các yêu cầu của CEO Directive 008 và 009 đã được triển khai hoàn tất, kiểm tra kỹ lưỡng và đạt 100% tiêu chí kỹ thuật:
- **Mobile LCP:** Đạt **1.90s** (mục tiêu ≤ 2.5s).
- **Desktop LCP:** Đạt **0.19s**.
- **Render-blocking CSS:** Đã triệt tiêu hoàn toàn tài nguyên phông chữ ngoại vi.
- **Tài nguyên:** Dọn sạch 1.25 MB JPEG thừa, toàn bộ tài sản ảnh là WebP đa độ phân giải.
- **E2E:** 139 PASS / 0 FAIL.

**READY FOR CLAUDE QA 2B-04 — PENDING INDEPENDENT REVIEW**  
**MILESTONE 2B — PENDING QA 2B-04**
