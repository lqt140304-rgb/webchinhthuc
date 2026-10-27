# BÁO CÁO BÀN GIAO THIẾT KẾ GIAI ĐOẠN 3A — VÒNG SỬA 03 (PHASE 3A DESIGN HANDOFF 03)

| Hạng mục | Chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 019-A — PHASE 3A DESIGN FIX 03** |
| **Báo cáo QA tham chiếu** | `docs/qa/3a-design-qa-02.md` (Nhánh `claude/3a-design-qa-02`, commit `ad75c8c`) |
| **Agent thực hiện** | Antigravity — Designer |
| **Agent kiểm định độc lập** | Claude — Independent QA Lead |
| **Phạm vi thực hiện** | **DESIGN ONLY — NO WEBSITE IMPLEMENTATION** (0 thay đổi trong `src/`, `public/`, `package.json`, `vite.config.ts`, `vercel.json`) |
| **Trạng thái bàn giao** | **PHASE 3A DESIGN 03 — READY FOR CLAUDE VISUAL RETEST** |

---

## 1. TỔNG QUAN KẾT QUẢ VÒNG SỬA 03 (EXECUTIVE SUMMARY)

Theo chỉ đạo tại **CEO Directive 019-A**, Antigravity đã hoàn thành việc khắc phục triệt để toàn bộ 8 phát hiện (gồm 1 lỗi P1, 3 lỗi P2 và 4 góp ý P3) từ Báo cáo QA độc lập Claude 3A-02:
1. **Khắc phục triệt để lỗi P1 Mojibake (`V-P1-1`):** Toàn bộ file mockup trực quan `docs/design/phase-3a-interactive-mockups.html` được ghi lại bằng script Node.js với mã hóa **UTF-8 thuần (No BOM)** và khai báo chuẩn `<meta charset="UTF-8">`. Đã kiểm chứng 100% văn bản tiếng Việt hiển thị sắc nét, trong sáng, hoàn toàn sạch bóng các ký tự lỗi mã hóa.
2. **Khắc phục vấn đề bản quyền ảnh (`AP-2` & `AP-1`):**
   - `AP-2`: Loại bỏ hoàn toàn hình ảnh `why-pet-companion.webp` (chứa logo thương hiệu áo chó Champion) khỏi Mockup 3A và Blueprint v2.2.
   - `AP-2 / 2B-29`: Tuyệt đối không can thiệp vào `src/components/WhyChooseUs.tsx:30` nhằm giữ vững nguyên tắc đóng băng Mốc 2B; ghi nhận mã lỗi bảo trì **`2B-29` (P2)** vào Sổ nhật ký bảo trì tại Mục 9.1 chờ CEO phân bổ nhiệm vụ xử lý riêng.
   - `AP-1`: Nâng cấp Bảng kê nguồn gốc tài sản (Asset Provenance Inventory) tại Mục 7 của Blueprint v2.2 thành bảng 11 cột chuẩn mực, phân định rõ ràng giữa tài sản ĐÃ XÁC MINH (VERIFIED) và CHƯA XÁC MINH (UNVERIFIED - chỉ cho phép trên Preview, cấm phát hành Production).
3. **Loại bỏ thuật ngữ dev và mã QA khỏi nội dung khách hàng (`V-P2-2`):** Rà soát và gỡ bỏ toàn bộ các chuỗi mã QA (`3A-P1-1`, `verified = false`, `Kiểm thử lưới cân bằng`, v.v.) khỏi nội dung hiển thị; đổi tiêu đề banner thành văn bản trung tính, chuyên nghiệp: *"Mô phỏng dự kiến cơ cấu nhân sự nhóm Bác sĩ"*.
4. **Hoàn thiện các chi tiết thị giác và khả năng tiếp cận (`V-P3-1` đến `V-P3-5`):**
   - `V-P3-1`: Lập trình nút Hamburger (`.p3a-menu-toggle`) và Khung Menu Mobile Drawer (`#p3a-mobile-drawer`) với đầy đủ thuộc tính trợ năng `aria-expanded`, `aria-controls`, phím `Escape`, touch target $\ge 44\text{px}$.
   - `V-P3-2`: Tách biệt nhãn phân khu và khối mô tả tại Frame #04 `/co-so-vat-chat`, loại bỏ hoàn toàn hiện tượng đè chữ trên mọi khung nhìn 320px–1920px.
   - `V-P3-3`: Nâng độ dày vòng focus lên `2px solid var(--color-plum-primary)` kèm offset 2px; tăng vùng chạm liên kết breadcrumb đạt chiều cao tối thiểu `44px`.
   - `V-P3-4`: Chuẩn hóa tiêu đề H1 trang `/co-so-vat-chat` thành câu mô tả chức năng trung tính: *“Không gian thăm khám và quy hoạch các phân khu chức năng.”*
   - `V-P3-5`: Chuẩn hóa lưới CSS Grid và `align-items: stretch` giúp các thẻ trong cùng một hàng có chiều cao cân bằng 100%.
   - Bổ sung nút viewport `1024px` trên thanh công cụ reviewer và dọn dẹp các đường dẫn cá nhân `file:///d:/...` trong `@font-face`.
5. **Bảo toàn Bundle Build 100% (R-3A-02):** Chạy kiểm chứng `npm run build`: SHA-256 của `dist/assets/index-vrX09Urw.css` (`ca6de747...`) và `dist/assets/index-CvVwFN8Z.js` (`10f187c6...`) hoàn toàn không đổi một byte so với baseline Mốc 2B (`d3c32dd`).

---

## 2. SẢN PHẨM BÀN GIAO (DELIVERABLES)

1. **Hồ sơ Thiết kế Blueprint v2.2:** `docs/phase-3a-design-blueprint.md`
2. **Mockup trực quan tương tác (HTML/CSS/JS thuần, độc lập hoàn toàn với `src/`):**
   - Trong Git Repository: `docs/design/phase-3a-interactive-mockups.html`
   - Trong thư mục Artifact phiên làm việc: `C:\Users\Admin\.gemini\antigravity\brain\6f5020a8-5310-41e1-a151-7821d0315e27\phase-3a-interactive-mockups.html`
3. **Báo cáo Bàn giao Thiết kế Vòng sửa 03:** `docs/qa/3a-design-handoff-03.md`

---

## 3. HƯỚNG DẪN MỞ & KIỂM TRA MOCKUP TRỰC QUAN

- **Trên Windows (PowerShell / Command Prompt):**
  ```powershell
  Start-Process "d:\webbvct\docs\design\phase-3a-interactive-mockups.html"
  ```
- **Qua HTTP Server tĩnh (Phục vụ Playwright / Headless Browser của Claude QA):**
  ```bash
  npx serve . -l 4173
  # Mở URL: http://localhost:4173/docs/design/phase-3a-interactive-mockups.html
  ```
- **Tính năng kiểm thử tích hợp sẵn trên thanh công cụ đầu trang:**
  - Chuyển đổi trực tiếp 3 trang: `1. /gioi-thieu` | `2. /doi-ngu` | `3. /co-so-vat-chat`.
  - Chuyển đổi chế độ hiển thị: `Mockup Trực quan` | `Wireframe Blueprint`.
  - Chuyển đổi đủ **8 mốc Viewport QA**: `1920px`, `1440px`, `1366px`, `1024px` (mới bổ sung), `768px`, `390px`, `360px`, `320px`.
  - Nút Menu Hamburger Mobile trên Header (hoạt động tại viewports $\le 768\text{px}$).
  - Bộ mô phỏng sĩ số nhân sự trên `/doi-ngu`: `N = 1`, `N = 2`, `N = 3`, `N = 5`, `N = 7 (3+2+2)`, `N = 7 (3+3+1)`, `N = 8 (3+3+2)`.
  - Bộ lọc bộ phận: Ẩn/hiện bằng thuộc tính `hidden` thực sự kết hợp `aria-live="polite"`.

---

## 4. BẢNG ĐỐI CHIẾU GIẢI QUYẾT TOÀN BỘ 8 PHÁT HIỆN TỪ CLAUDE QA 3A-02

| Mã QA | Mức | Phát hiện trong `3a-design-qa-02.md` | Giải pháp đã thực hiện trong Blueprint v2.2 & Mockup HTML | Bằng chứng kiểm chứng | Kết luận |
| :---: | :---: | :--- | :--- | :--- | :---: |
| **V-P1-1** | **P1** | File mockup bị **hỏng mã hóa UTF-8 (mojibake)** do PowerShell đọc dạng Windows-1252 rồi ghi lại: 280 dòng bị lỗi hiển thị tiếng Việt. | Đã tạo lại toàn bộ file bằng script Node.js với mã hóa **UTF-8 chuẩn (No BOM)** và thẻ `<meta charset="UTF-8">`. Đã kiểm chứng toàn bộ chuỗi tiếng Việt hiển thị chính xác 100%, 0 ký tự lỗi. | `docs/design/phase-3a-interactive-mockups.html`; thẻ `<title>` và toàn bộ body text đọc rõ ràng, trong sáng. | **FIXED** |
| **AP-2** | **P2** | `why-pet-companion.webp` có **logo thương hiệu Champion** trên áo của chó, dùng 2 lần trong mockup 3A và đang dùng trên trang chủ 2B (`WhyChooseUs.tsx:30`). | **Trong 3A:** Gỡ bỏ 100% hình ảnh này khỏi Mockup và Blueprint v2.2, thay bằng hình ảnh minh họa sạch hoặc khung phân khu kiến trúc SVG.<br>**Đối với Trang chủ 2B:** Giữ nguyên không sửa `src/` theo chỉ đạo đóng băng Mốc 2B; ghi nhận mã lỗi bảo trì **`2B-29` (P2)** vào Sổ nhật ký bảo trì Mục 9.1. | File Mockup HTML không còn tham chiếu `why-pet-companion.webp`; Blueprint Mục 7 & 9.1. | **FIXED (3A) & Ghi nhận 2B-29** |
| **AP-1** | **P2** | Bảng nguồn ảnh (Blueprint mục 7) thiếu URL, tác giả, giấy phép và trạng thái xác minh rõ ràng. | Đã nâng cấp toàn diện Bảng Kê Chi Tiết Tài Sản (Asset Provenance Ledger) tại Mục 7 thành bảng 11 cột đầy đủ: Tên file repo, Vị trí sử dụng 3A, Phân loại, Nguồn cung cấp / Nền tảng, Tác giả, Giấy phép, Trạng thái xác minh (VERIFIED vs UNVERIFIED), Cho phép trên Preview, Sẵn sàng phát hành. | `docs/phase-3a-design-blueprint.md` Mục 7. | **FIXED** |
| **V-P2-2** | **P2** | Ghi chú QA và thuật ngữ dev còn lẫn vào nội dung trang khách hàng (ví dụ: `Mô phỏng sĩ số nhân sự nhóm Bác sĩ (Kiểm thử lưới cân bằng)`). | Đã rà soát và loại bỏ toàn bộ các mã QA và thuật ngữ dev khỏi nội dung hiển thị; thay bằng văn bản trung tính, chuyên nghiệp: *"Mô phỏng dự kiến cơ cấu nhân sự nhóm Bác sĩ"*. | File Mockup HTML: toàn bộ nội dung hiển thị không còn thuật ngữ dev hay mã QA. | **FIXED** |
| **V-P3-1** | **P3** | Mockup thiếu nút mở menu trên mobile (`Header` không bấm mở menu được trên màn hình hẹp). | Đã lập trình hoàn chỉnh **Menu Hamburger Mobile** (`.p3a-menu-toggle`) và **Khung Menu Trượt Xuống** (`#p3a-mobile-drawer`) với đầy đủ thuộc tính trợ năng `aria-expanded`, `aria-controls`, xử lý phím `Escape` và vùng chạm chuẩn 44px. | Mockup HTML: nút menu ở góc phải Header mobile và drawer trượt mượt mà. | **FIXED** |
| **V-P3-2** | **P3** | Tại `/co-so-vat-chat` (Frame #04), nhãn phân khu bị đè lên khối chữ mô tả trên màn hình nhỏ. | Đã tái cấu trúc CSS và layout của Frame #04: nhãn phân khu được xếp độc lập ở hàng trên với khoảng cách an toàn (`margin-bottom: 0.5rem`), hoàn toàn không đè chữ ở mọi độ phân giải từ 320px đến 1920px. | Mockup HTML section 3.4; kiểm thử tại viewport 320px, 375px, 768px. | **FIXED** |
| **V-P3-3** | **P3** | Vòng focus trên các nút và liên kết còn mảnh; các mục liên kết breadcrumb có vùng chạm nhỏ. | Đã nâng độ dày viền focus lên `2px solid var(--color-plum-primary)` kèm `outline-offset: 2px`; tăng vùng chạm liên kết breadcrumb đạt tối thiểu `44px` chiều cao (`min-height: 44px; display: inline-flex; align-items: center`). | Mockup CSS `.p3a-breadcrumb a` và `:focus`. | **FIXED** |
| **V-P3-4** | **P3** | H1 trang `/co-so-vat-chat` đổi thành *"sạch sẽ, bố trí rõ ràng..."* vẫn là khẳng định tính chất vật lý chưa kiểm chứng. | Đã chuẩn hóa H1 thành cụm từ mô tả chức năng trung tính: *“Không gian thăm khám và quy hoạch các phân khu chức năng.”* | Blueprint Mục 2.3, 3.3; Mockup `#page-co-so-vat-chat h1`. | **FIXED** |
| **V-P3-5** | **P3** | Các card trong cùng một hàng chưa cân bằng chiều cao trên một số viewport. | Đã chuẩn hóa lưới CSS Grid với `align-items: stretch` và thẻ con `display: flex; flex-direction: column; height: 100%`, đảm bảo tất cả các thẻ trong hàng có chiều cao đồng đều 100%. | Mockup CSS `.p3a-dept-grid`, `.p3a-spec-grid`. | **FIXED** |

---

## 5. KIỂM CHỨNG BẢO TOÀN BUNDLE BUILD (R-3A-02 VERIFICATION)

Đã thực hiện kiểm chứng bản build độc lập qua lệnh `npm run build` sau khi cập nhật toàn bộ tài liệu và file mockup:
```text
dist/index.html                   1.57 kB │ gzip:   0.79 kB
dist/assets/index-vrX09Urw.css   61.36 kB │ gzip:  11.12 kB
dist/assets/index-CvVwFN8Z.js   369.95 kB │ gzip: 105.92 kB
```

**Bảng mã băm SHA-256 thực tế so sánh với Baseline Mốc 2B (`d3c32dd`):**
| File tài sản trong `dist/` | Dung lượng | SHA-256 thực tế đo được | SHA-256 Baseline Claude QA 2B-09 / 3A-02 | Kết luận bảo toàn |
| :--- | :---: | :--- | :--- | :---: |
| `index-vrX09Urw.css` | 61.36 kB | `ca6de747195a5550d80dc7ea59cc7ea8a43c51a9b77c07d596e79ffbefe66d87` | `ca6de747195a5550d80dc7ea59cc7ea8a43c51a9b77c07d596e79ffbefe66d87` | **KHỚP 100%** |
| `index-CvVwFN8Z.js` | 369.95 kB | `10f187c6990780a5a4417928e9ab313db068caffce0e988233b07cadba8be234` | `10f187c6990780a5a4417928e9ab313db068caffce0e988233b07cadba8be234` | **KHỚP 100%** |

- Thư mục tạm `dist/` đã được dọn sạch hoàn toàn sau khi kiểm chứng.
- Git tree giữ nguyên trạng thái trong sạch tuyệt đối: **0 file trong `src/`, `public/`, `package.json`, `vite.config.ts`, `vercel.json` bị thay đổi**.

---

## 6. DANH SÁCH TÀI LIỆU & FILE BÀN GIAO ĐỢT 3A-03

1. `docs/phase-3a-design-blueprint.md` (Blueprint v2.2)
2. `docs/design/phase-3a-interactive-mockups.html` (Mockup HTML tương tác sạch UTF-8)
3. `docs/qa/3a-design-handoff-03.md` (Báo cáo bàn giao này)

---

PHASE 3A DESIGN 03 — READY FOR CLAUDE VISUAL RETEST
