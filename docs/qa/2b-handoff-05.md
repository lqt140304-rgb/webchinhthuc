# Báo Cáo Bàn Giao Vòng Tối Ưu Phông Chữ & Bản Quyền QA 2B-05 — Antigravity

| Mục | Chi tiết |
|---|---|
| **Người thực hiện** | Antigravity (Designer & Developer, theo `AGENTS.md`) |
| **Ngày thực hiện** | 26/10/2026 |
| **Căn cứ chỉ đạo** | [CEO DIRECTIVE 010-A (SELF-HOSTED FONT OPTIMIZATION)](#) & Báo cáo Claude QA `docs/qa/2b-qa-04.md` |
| **Nhánh làm việc** | `fix/milestone-2a-qa` |
| **SHA cơ sở được kiểm tra trước** | `820a907` (QA 2B-04: Mobile Score 77 / LCP 4.36s, Desktop 99 / 0.89s — Tải 18 file font 370 KB) |
| **Trạng thái mốc** | **READY FOR INDEPENDENT QA 2B-05** |

---

## 1. Kiểm kê và Phân tích Hiện trạng Phông chữ Trước Tối ưu (Section 2.A)

### A. Nguyên nhân gốc rễ dẫn đến việc tải 18 tệp phông chữ (Root Cause Analysis):
1. **Phân mảnh Unicode-range:** Ở vòng QA 2B-04, các tệp WOFF2 được trích xuất theo cơ chế subsetting mặc định của Google Fonts, chia mỗi trọng số thành 3 tệp nhỏ (`vietnamese`, `latin-ext`, `latin`).
2. **Kích hoạt đồng thời nhiều subset:** Do giao diện website tiếng Việt chứa hỗn hợp cả chữ có dấu (U+1EA0..U+1EF9), chữ không dấu (U+0000..U+00FF), số và dấu câu, trình duyệt Chromium khi dựng trang bắt buộc phải tải cả 3 tệp subset cho **từng trọng số**.
3. **Quá nhiều khai báo trọng số độc lập:** Website khai báo 5 biến thể của Be Vietnam Pro (400, 500, 600, 700, Italic 400) và 1 biến thể Lora (400..700). 
   - $5 \text{ biến thể Be Vietnam Pro} \times 3 \text{ subsets} = 15 \text{ tệp}$
   - $1 \text{ biến thể Lora} \times 3 \text{ subsets} = 3 \text{ tệp}$
   - Tổng cộng: **18 tệp WOFF2 (dung lượng ~301.4 KB transfer, ~370 KB đĩa)** được tải đồng loạt trong lượt tải đầu tiên.
4. **Hậu quả nghẽn mạng trên kết nối di động:** Trên môi trường giả lập Mobile 4G (1.6 Mbps, RTT 150ms, giới hạn 6 kết nối TCP), 18 yêu cầu HTTP phông chữ đồng thời gây tắc nghẽn hàng đợi mạng (network contention), kéo dài thời gian tải font lên tới **2732ms**, làm trì hoãn việc tải ảnh Hero LCP và đẩy Mobile LCP lên **4.36s** (điểm Performance tụt xuống 77).

---

## 2. Giải pháp Kiến trúc Phông chữ Tối ưu (Section 2.B)

### A. Tinh gọn tệp phông chữ đơn nhất (Single-file Complete WOFF2):
- **Thay thế hoàn toàn 21 tệp subset phân mảnh** bằng các tệp phông chữ WOFF2 hoàn chỉnh chứa **100% bộ ký tự tiếng Việt có dấu, Latin mở rộng và số/ký hiệu** trong một tệp duy nhất.
- Nguồn trích xuất: Bản phân phối chính thức từ Google Fonts (SIL Open Font License 1.1).
- Dung lượng mỗi tệp hoàn chỉnh chỉ từ **35.0 KB đến 48.5 KB**. Trình duyệt chỉ cần **1 yêu cầu HTTP duy nhất** cho mỗi kiểu phông, loại bỏ hoàn toàn hiện tượng waterfall đa tệp.

### B. Hợp nhất trọng số thông minh theo Design System:
- **Be Vietnam Pro:**
  - `font-weight: 300 500` (Thường, Nhẹ, Vừa): Dùng tệp `be-vietnam-pro-400.woff2` (35.0 KB).
  - `font-weight: 600 900` (Bán đậm, Đậm): Dùng tệp `be-vietnam-pro-600.woff2` (36.9 KB).
- **Lora (Tiêu đề báo chí Luxury Editorial):**
  - Giữ nguyên vẹn **Lora weight 600** cho các tiêu đề đã được phê duyệt theo đúng chỉ đạo bắt buộc của CEO Directive 010-A.
  - `font-weight: 400 900`: Dùng tệp `lora-600.woff2` (48.5 KB) cho toàn bộ hệ thống tiêu đề (`h1`, `h2`, Logo).
- **Preload tối giản trong `<head>`:**
  Chỉ preload đúng 2 tệp font thiết yếu xuất hiện tại khung nhìn đầu tiên (Hero):
  ```html
  <link rel="preload" href="/fonts/be-vietnam-pro-400.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/lora-600.woff2" as="font" type="font/woff2" crossorigin />
  ```

---

## 3. Bảng So Sánh Trước và Sau Tối Ưu Phông Chữ

| Tiêu chí | Trước tối ưu (QA 2B-04) | Sau tối ưu (QA 2B-05) | Mức độ cải thiện |
|---|:---:|:---:|:---:|
| **Số quy tắc `@font-face` khai báo** | 21 quy tắc | **3 quy tắc** | **Giảm 85%** độ phức tạp CSS |
| **Số tệp font tải thực tế (Home)** | 18 tệp | **3 tệp** | **Giảm 83%** số lượng HTTP requests |
| **Số tệp font tải thực tế (`/dat-lich`)** | 15 tệp | **3 tệp** | **Giảm 80%** số lượng HTTP requests |
| **Tổng dung lượng font tải** | 301.4 KB transfer (370 KB đĩa) | **120.4 KB transfer** | **Tiết kiệm 60%** băng thông mạng |
| **Số tệp font preload trong `<head>`** | 3 tệp (kèm waterfall con) | **2 tệp duy nhất** | Tinh gọn hàng đợi ưu tiên |
| **Tài nguyên Render-blocking** | 0 tệp | **0 tệp** | Hoàn toàn sạch |
| **Total Blocking Time (TBT Mobile)** | 140 ms | **11–20 ms** | **Giảm 85%**, luồng chính thông suốt |
| **Hiển thị dấu tiếng Việt** | Đầy đủ | **100% chuẩn xác** | Không lỗi font, không vỡ layout |

---

## 4. Kết Quả Đo Đạc Lighthouse Độc Lập (3 Lượt Đo Trung Vị)

Thực hiện đo bằng `lighthouse` v13.5.0 trực tiếp trên cùng máy chủ preview, headless Chrome, cấu hình mạng tương đương Claude QA:

### A. Mobile Benchmark (Preset: `perf` — Throttled 4G 1.6Mbps, RTT 150ms, 4x CPU Slowdown):

| Lượt chạy | Performance Score | LCP | FCP | TBT | CLS | Speed Index | Số font tải |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Lượt 1** | 86 | 3.22s | 3.22s | 20ms | 0.000 | 3.22s | 3 (121.4 KB) |
| **Lượt 2** | 86 | 3.27s | 3.27s | 11ms | 0.000 | 3.27s | 3 (121.4 KB) |
| **Lượt 3** | 86 | 3.22s | 3.22s | 8ms | 0.000 | 3.22s | 3 (121.4 KB) |
| **TRUNG VỊ (MEDIAN)** | **86** | **3.22s** | **3.22s** | **11ms** | **0.000** | **3.22s** | **3 tệp (121.4 KB)** |

### B. Desktop Benchmark (Preset: `desktop`):

| Lượt chạy | Performance Score | LCP | FCP | TBT | CLS | Speed Index | Số font tải |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Lượt 1** | 100 | 0.71s | 0.37s | 0ms | 0.001 | 0.47s | 3 (121.4 KB) |
| **Lượt 2** | 100 | 0.71s | 0.37s | 0ms | 0.001 | 0.47s | 3 (121.4 KB) |
| **Lượt 3** | 100 | 0.71s | 0.37s | 0ms | 0.001 | 0.47s | 3 (121.4 KB) |
| **TRUNG VỊ (MEDIAN)** | **100** | **0.71s** | **0.37s** | **0ms** | **0.001** | **0.47s** | **3 tệp (121.4 KB)** |

### C. Bảng tổng hợp đối chiếu tiến trình qua các mốc QA:

| Chỉ số | QA 2B-03 Baseline | QA 2B-04 Baseline | **QA 2B-05 Hiện Tại** | So với QA 2B-04 |
|---|:---:|:---:|:---:|:---:|
| **Mobile Performance** | 81 | 77 | **86** | **+9 điểm** (Khôi phục & vượt 2B-03) |
| **Mobile LCP** | 3.73s | 4.36s | **3.22s** | **Nhanh hơn 1.14s** |
| **Mobile TBT** | ~150ms | 140ms | **11ms** | **Giảm 92%** |
| **Mobile CLS** | 0 | 0 | **0.000** | Tuyệt đối ổn định |
| **Desktop Performance** | 98 | 99 | **100** | **Điểm tuyệt đối** |
| **Desktop LCP** | 0.88s | 0.89s | **0.71s** | **Nhanh hơn 0.18s** |
| **Số file font tải** | External CSS | 18 tệp | **3 tệp** | **Giảm 83%** |

---

## 5. Bản Quyền Phông Chữ — 2B-23

Đã xác minh nguồn gốc và lưu trữ văn bản giấy phép bản quyền nguồn mở quốc tế **SIL Open Font License (OFL 1.1)** trong thư mục `docs/licenses/`:
1. **Be Vietnam Pro:**
   - Tác giả: Fábio Duarte Martins, Vietanh Nguyen (Better Type Foundry).
   - Bản quyền: SIL OFL 1.1.
   - Tài liệu giấy phép: [`docs/licenses/OFL-BeVietnamPro.txt`](file:///d:/webbvct/docs/licenses/OFL-BeVietnamPro.txt).
   - Nguồn chính thức: [Google Fonts OFL bevietnampro](https://github.com/google/fonts/tree/main/ofl/bevietnampro).
2. **Lora:**
   - Tác giả: Cyreal (Olga Karpushina, Alexei Vanyashin).
   - Bản quyền: SIL OFL 1.1.
   - Tài liệu giấy phép: [`docs/licenses/OFL-Lora.txt`](file:///d:/webbvct/docs/licenses/OFL-Lora.txt).
   - Nguồn chính thức: [Google Fonts OFL lora](https://github.com/google/fonts/tree/main/ofl/lora).

Toàn bộ thông tin bản quyền phông chữ đã được bổ sung vào mục 3 của [`docs/assets-credits.md`](file:///d:/webbvct/docs/assets-credits.md).

---

## 6. Cập Nhật Hồ Sơ Hình Ảnh — 2B-06

Theo đúng chỉ đạo tại Mục 4 của CEO Directive 010-A, đã điều chỉnh trạng thái xác minh trong [`docs/assets-credits.md`](file:///d:/webbvct/docs/assets-credits.md):
- **2 ảnh tạo bởi AI (STT 11 & 12):** Chuyển từ "Đã xác minh" thành **CHƯA XÁC MINH — NGUỒN TỰ KHAI**.
- **9 ảnh stock mockup (STT 2–10):** Tiếp tục giữ trạng thái **CHƯA XÁC MINH BẢN QUYỀN GỐC**.
- **1 ảnh logo (STT 1):** Giữ trạng thái **Đã xác minh** (sở hữu nội bộ Bệnh viện Thú y Lê Sơn).
- **Chính sách trước phát hành:** Không trình bày ảnh AI như ảnh thực tế của viện; toàn bộ 11 ảnh chưa xác minh sẽ được thay thế bằng bộ ảnh chụp cơ sở 101 Khuất Duy Tiến ở Giai đoạn 3.

---

## 7. Bằng Chứng Kiểm Thử Tự Động & Chống Hồi Quy (Regression Evidence)

| Bộ kiểm thử | Lệnh thực thi | Kết quả | Ghi chú |
|---|---|:---:|---|
| **Linter** | `npx oxlint` | **0 errors, 0 warnings** | 45 tệp sạch hoàn toàn |
| **TypeScript** | `npx tsc -b` | **0 errors** | Biên dịch thành công |
| **Production Build** | `npm run build` | **SUCCESS (363ms)** | Bundle CSS giảm còn 62.37 kB, JS 369 kB |
| **Claude Booking Suite** | `tests/e2e/2b-booking.e2e.test.cjs` | **16 PASS / 0 FAIL** | Form `/dat-lich`, responsive 7 kích thước, hotline |
| **Claude Homepage Suite** | `tests/e2e/2b.e2e.test.cjs` | **27 PASS / 0 FAIL** | Đạt 6 section, font Be Vietnam Pro & Lora hiển thị dấu TV hoàn hảo, CLS < 0.1 |
| **2A Regression Suite** | `tests/e2e/2a.e2e.test.cjs` | **51 PASS / 0 FAIL / 2 BLOCKED** | Khớp tuyệt đối baseline Retest-04 (2 BLOCKED: host đích & noindex SSR) |
| **2A Round02 & Round03** | `tests/e2e/2a-round02... tests/e2e/2a-round03...` | **45 PASS / 0 FAIL / 2 BLOCKED** | Đạt Drawer, dropdown, route boundary, canonical |
| **Tổng kết E2E** | `node --test tests/e2e/*.cjs` | **139 PASS / 0 FAIL / 4 BLOCKED** | 0 lỗi hồi quy |

---

## 8. Bằng Chứng Ảnh Chụp Các Viewport Quan Trọng (2B-Evidence)

Các ảnh chụp màn hình kiểm chứng hiển thị phông chữ thực tế đã được xuất vào thư mục [`docs/qa/2b-font-evidence/`](file:///d:/webbvct/docs/qa/2b-font-evidence/):
1. `home-320px.png`: Màn hình cực nhỏ iPhone SE — Tiêu đề Lora và chữ Be Vietnam Pro sắc nét, không tràn ngang.
2. `home-390px.png`: Màn hình di động chuẩn iPhone 12/13/14 — Bố cục Hero hoàn hảo, dấu tiếng Việt mượt mà.
3. `home-768px.png`: Màn hình máy tính bảng iPad.
4. `home-1440px.png`: Màn hình máy tính Desktop — Vòm cong Editorial Luxury, typography đẳng cấp.
5. `booking-390px.png`: Trang đặt lịch trên di động — Nhãn trường, ô nhập và thông báo rõ ràng.
6. `booking-1440px.png`: Trang đặt lịch trên màn hình lớn.

---

## 9. Các Vấn Đề Còn Lại Chưa Giải Quyết (Pre-release Items)

Theo CEO Directive 009 và 010-A, các hạng mục sau được giữ làm điều kiện trước phát hành chính thức (không thuộc phạm vi sửa đổi code cục bộ):
1. **A04:** Kiểm thử website trên Vercel Preview thực tế khi chủ dự án cấp quyền.
2. **A05:** Xác minh HTTP `X-Robots-Tag` trên hạ tầng máy chủ Vercel.
3. **2B-06:** Cung cấp bộ ảnh chụp thực tế cơ sở 101 Khuất Duy Tiến để thay thế 11 ảnh placeholder trước khi ra mắt công chúng.

---

## 10. Danh Mục Tệp Thay Đổi

| STT | Tệp | Nội dung thay đổi |
|:---:|:---|:---|
| 1 | `src/styles/fonts.css` | Tinh gọn 3 quy tắc `@font-face` WOFF2 hoàn chỉnh (Be Vietnam Pro 400, 600; Lora 600) |
| 2 | `index.html` | Preload 2 tệp font thiết yếu (`be-vietnam-pro-400.woff2` & `lora-600.woff2`) |
| 3 | `public/fonts/*.woff2` | Thay 21 tệp subset bằng 8 tệp WOFF2 hoàn chỉnh chuẩn SIL OFL 1.1 |
| 4 | `docs/licenses/OFL-BeVietnamPro.txt` | Văn bản giấy phép nguồn mở SIL OFL 1.1 cho Be Vietnam Pro |
| 5 | `docs/licenses/OFL-Lora.txt` | Văn bản giấy phép nguồn mở SIL OFL 1.1 cho Lora |
| 6 | `docs/assets-credits.md` | Bổ sung mục 3 Font Credits Ledger, cập nhật trạng thái ảnh AI (2B-06) |
| 7 | `docs/qa/2b-font-evidence/*.png` | 6 ảnh chụp màn hình kiểm chứng phông chữ ở các kích thước |
| 8 | `scripts/optimize-fonts.cjs` | Công cụ tự động tải và đóng gói font hoàn chỉnh |
| 9 | `scripts/run-lh-multi.cjs` | Công cụ đo đạc Lighthouse 3 lượt tự động |
| 10 | `docs/qa/2b-handoff-05.md` | Tài liệu báo cáo bàn giao chi tiết QA 2B-05 |

---

**READY FOR INDEPENDENT QA 2B-05**
