# BÁO CÁO BÀN GIAO THIẾT KẾ GIAI ĐOẠN 3A — VÒNG SỬA 02 (PHASE 3A DESIGN HANDOFF 02)

| Hạng mục | Chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 018-A — PHASE 3A DESIGN REVISION 02** |
| **Báo cáo QA tham chiếu** | `docs/qa/3a-design-qa-01.md` (Nhánh `claude/3a-design-qa-01`, commit `f3e86ec`) |
| **Agent thực hiện** | Antigravity — Designer |
| **Agent kiểm định độc lập** | Claude — Independent QA Lead |
| **Phạm vi thực hiện** | **DESIGN ONLY — NO WEBSITE IMPLEMENTATION** (0 thay đổi trong `src/`, `package.json`, `vite.config.ts`, `vercel.json`) |

---

## 1. SẢN PHẨM BÀN GIAO (DELIVERABLES)

1. **Blueprint v2.1:** `docs/phase-3a-design-blueprint.md`
2. **Mockup trực quan tương tác độc lập (HTML/CSS/JS thuần, không tích hợp vào `src/`):**
   - Trong Repository (để Claude checkout và mở trực tiếp không bị BLOCKED): `docs/design/phase-3a-interactive-mockups.html`
   - Trong thư mục Artifact phiên làm việc trên Windows: `C:/Users/Admin/.gemini/antigravity/brain/6f5020a8-5310-41e1-a151-7821d0315e27/phase-3a-interactive-mockups.html`
3. **Báo cáo bàn giao & giải quyết từng phát hiện QA:** `docs/qa/3a-design-handoff-02.md`

---

## 2. HƯỚNG DẪN MỞ & KIỂM TRA MOCKUP TRỰC QUAN

- **Trên Windows (PowerShell / Command Prompt):**
  ```powershell
  Start-Process "d:\webbvct\docs\design\phase-3a-interactive-mockups.html"
  ```
- **Qua HTTP Server tĩnh (Phục vụ Playwright / Headless Browser của Claude QA):**
  ```bash
  npx serve . -l 4173
  # Mở URL: http://localhost:4173/docs/design/phase-3a-interactive-mockups.html
  ```
- **Tính năng kiểm thử tích hợp sẵn trên thanh công cụ đầu trang Mockup v2.1:**
  - Chuyển đổi trực tiếp 3 trang: `1. /gioi-thieu` | `2. /doi-ngu` | `3. /co-so-vat-chat`.
  - Chuyển đổi chế độ: `Mockup Trực quan` | `Wireframe Blueprint`.
  - Chuyển đổi đủ **7 mốc Viewport QA**: `1920px`, `1440px`, `1366px`, `768px`, `390px`, `360px`, `320px`.
  - Bộ mô phỏng sĩ số nhân sự trên `/doi-ngu`: Bấm thử trực tiếp `N = 1`, `N = 2`, `N = 3`, `N = 5`, `N = 7 (3+2+2)`, `N = 7 (3+3+1)`, `N = 8 (3+3+2)`.
  - Bộ lọc bộ phận chuẩn Accessibility: Ẩn/hiện bằng thuộc tính `hidden` thực sự (không làm mờ card) kèm thông báo `aria-live="polite"`.

---

## 3. BẢNG ĐỐI CHIẾU GIẢI QUYẾT TOÀN BỘ 22 PHÁT HIỆN QA (`3A-P1-1`..`3A-P3-9`)

| Mã QA | Mức | Nội dung phát hiện trong `3a-design-qa-01.md` | Cách giải quyết trong Blueprint v2.1 & Mockup v2.1 | Trạng thái |
| :---: | :---: | :--- | :--- | :---: |
| **3A-P1-1** | **P1** | Gắn ảnh stock có mặt người thật dưới tên thật `"BS. Lê Thái Sơn"` (sai danh tính). | Gỡ bỏ 100% ảnh người (stock/AI) khỏi mọi card nhân sự trên `/doi-ngu`. Thay bằng **Monogram / Khung chân dung trống `4:5`** trên nền Lavender nhạt kèm nhãn `Chưa có ảnh thực tế — Khung chân dung 4:5 chờ duyệt`. | **FIXED** |
| **3A-P1-2** | **P1** | Tự ấn định cơ cấu nhân sự chưa xác minh (3 bác sĩ, Ngoại khoa & Cấp cứu, kiêm nhiệm Nội trú 24/7, lễ tân/điều dưỡng). | Xóa toàn bộ số lượng mặc định, chuyên khoa tự đặt, lịch trực và kiêm nhiệm chưa xác minh. Thay bằng các **Slot trung tính** (`[Chức danh chuyên môn — Chờ xác minh]`, `[Vai trò kiêm nhiệm: Chỉ hiển thị nếu có dữ liệu xác minh]`). | **FIXED** |
| **3A-P2-1** | **P2** | Bốn nguyên tắc phục vụ trên `/gioi-thieu` chưa xác minh nhưng viết như cam kết đang áp dụng. | Đóng khung toàn bộ Section 1.4 bằng nhãn `[ĐỀ XUẤT NỘI DUNG — CHỜ CHỦ DỰ ÁN XÁC NHẬN QUY TRÌNH THỰC TẾ]` và viết lại theo văn phong đề xuất chờ duyệt. | **FIXED** |
| **3A-P2-2** | **P2** | Ảnh Hero `/gioi-thieu` dùng ảnh stock có người mặc áo blouse dễ bị hiểu nhầm là nhân sự thật. | Loại bỏ hoàn toàn mọi ảnh có người mặc áo blouse khỏi cả 3 trang trong Mockup v2.1; chỉ dùng ảnh thú cưng ấm áp kèm nhãn `Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn`. | **FIXED** |
| **3A-P2-3** | **P2** | Luôn đặt `BS. Lê Thái Sơn` ở Thẻ 1 tạo thứ bậc ngầm theo chức vụ. | Bỏ quy tắc xếp đầu theo chức vụ; đặt thẻ `BS. Lê Thái Sơn` ở vị trí trung tính (Thẻ #2) trong Wireframe & Mockup v2.1. | **FIXED** |
| **3A-P2-4** | **P2** | Tự gộp `"Spa & Grooming và Điều dưỡng"` thành 1 section để cân đối lưới có thể sai thực tế. | Bỏ quy tắc gộp bộ phận khi $N=1$. Tách riêng từng bộ phận thực tế; khi $N=1$ hiển thị **1 card căn giữa giữ đúng chiều rộng chuẩn**. | **FIXED** |
| **3A-P2-5** | **P2** | Tablet khi $N=5$ dùng thẻ ngang khác dạng card; chưa định nghĩa quy tắc cho $N \ge 7$. | Thiết lập quy tắc lưới đồng nhất cho $N = 1, 2, 3, 4, 5, 6, 7$ và $N \ge 7$: mọi card trên cả Desktop lẫn Tablet đều giữ kiểu card dọc `4:5` đồng kích thước 100%, hàng cuối căn giữa đối xứng (hỗ trợ cả `3+2+2` và `3+3+1` cho $N=7$), không phóng to card lẻ. | **FIXED** |
| **3A-P2-6** | **P2** | Bộ lọc làm mờ card không thuộc nhóm chọn, vẫn đọc và `Tab` tới được. | Bỏ cơ chế làm mờ; dùng thuộc tính **`hidden` (`display: none`)** để ẩn thực sự các nhóm không được chọn, kèm `aria-pressed="true/false"` và `role="status" aria-live="polite"`. | **FIXED** |
| **3A-P2-7** | **P2** | Cụm từ `"Bác sĩ trưởng Lê Thái Sơn"` / `"nổi bật BST"` còn sót ở 6 file trong repo. | Kiểm kê đầy đủ cả 6 vị trí (`Header.tsx:27`, `routes.tsx:31`, `types/index.ts:34`, `seo-strategy.md:18`, `sitemap.md:11`, `implementation-plan.md:70`) tại Mục 4.2 của Blueprint v2.1 để cập nhật đồng loạt khi được phép sửa code. | **PARTIAL (Chờ pha code)** |
| **3A-P2-8** | **P2** | Quy trình phối hợp 4 bước trên `/doi-ngu` chứa cam kết vận hành chưa xác minh. | Đóng khung Section 2.4 bằng nhãn `[QUY TRÌNH PHỐI HỢP ĐỀ XUẤT — CHỜ CHỦ DỰ ÁN XÁC NHẬN VẬN HÀNH THỰC TẾ]` và lược bỏ các khẳng định chưa có nguồn. | **FIXED** |
| **3A-P2-9** | **P2** | Trang `/co-so-vat-chat` cần quy tắc phát hành rõ ràng về ảnh thật vs ảnh minh họa. | Áp dụng đúng Directive 018-A Mục IV.C: gắn nhãn `"Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn"` trên từng ảnh và thiết lập **Pre-release Gate** (chỉ mở index công khai khi có ảnh thật được Chủ dự án duyệt; đề xuất thiết kế $\ge 4$ ảnh thật). | **FIXED** |
| **3A-P2-10** | **P2** | Cụm từ `"sạch khuẩn"` trong H1 `/co-so-vat-chat` là tuyên bố chưa có căn cứ. | Loại bỏ hoàn toàn cụm từ `"sạch khuẩn"` trong cả Blueprint v2.1 và Mockup v2.1. | **FIXED** |
| **3A-P2-11** | **P2** | Slot thiết bị vẫn ghi `"(VD: Mindray)"` và tự khẳng định có phòng phẫu thuật riêng. | Đổi thành slot trung tính `[Thiết bị xét nghiệm — chờ xác minh]`, `[Thiết bị chẩn đoán hình ảnh — chờ xác minh]` và `[Phân khu chức năng — chờ Chủ dự án xác nhận]` (không nêu tên hãng hay phòng phẫu thuật riêng khi chưa xác nhận). | **FIXED** |
| **3A-P3-1** | **P3** | Dải thông tin lặp lại ở Hero và CTA cuối trang `/gioi-thieu`. | Giữ dải 3 cột ở Hero, rút gọn dải CTA cuối trang. | **FIXED** |
| **3A-P3-2** | **P3** | Breadcrumb `"Về Lê Sơn"` là nhóm menu không có URL riêng. | Render `"Về Lê Sơn"` bằng `<span>` tĩnh, không đặt thẻ `<a>`. | **FIXED** |
| **3A-P3-3** | **P3** | Yêu cầu "cùng số dòng mô tả" dễ dẫn tới `line-clamp` cắt chữ. | Bỏ giới hạn số dòng; cân chiều cao bằng CSS Grid/Flex `stretch`. | **FIXED** |
| **3A-P3-4** | **P3** | Dòng `[Bằng cấp / Chứng chỉ: Chờ xác minh]` không nên hiển thị khi publish. | Quy định ẩn hoàn toàn trường này khi xuất bản nếu `verified === false`. | **FIXED** |
| **3A-P3-5** | **P3** | Ảnh thật chụp cơ sở có thể lọt khách hàng hoặc hồ sơ bệnh án. | Bổ sung quy tắc kiểm duyệt quyền riêng tư và `Owner Consent Form` vào Mục 6 & Mục 9.1. | **FIXED** |
| **3A-P3-6** | **P3** | Sai số bảng độ tương phản WCAG 2.1 ở mục 8.2. | Cập nhật chính xác toàn bộ tỷ lệ tương phản theo `contrast-check.txt` tại Mục 5.2 của Blueprint v2.1. | **FIXED** |
| **3A-P3-7** | **P3** | Mockup thiếu nút chọn viewport `360px` và `1920px`. | Bổ sung đủ 7 mốc viewport (`1920`, `1440`, `1366`, `768`, `390`, `360`, `320`) trên thanh công cụ Mockup v2.1. | **FIXED** |
| **3A-P3-8** | **P3** | Hậu tố `alt` quá dài lặp lại ở mọi ảnh. | Rút gọn hậu tố `alt` thành `"(ảnh minh họa)"` kèm banner giải thích chung ở đầu trang. | **FIXED** |
| **3A-P3-9** | **P3** | Trạng thái ghi `"APPROVED FOR DESIGN"` dễ gây hiểu nhầm. | Đổi thành `"PHASE 3A — PENDING OWNER DESIGN APPROVAL (DESIGN ONLY — NO WEBSITE IMPLEMENTATION)"`. | **FIXED** |

---

## 4. KIỂM CHỨNG BẢO TOÀN BUNDLE BUILD (R-3A-02 VERIFICATION)

Đã chạy `npm run build` sau khi thêm `docs/phase-3a-design-blueprint.md`, `docs/design/phase-3a-interactive-mockups.html` và `docs/qa/3a-design-handoff-02.md`:
- `dist/assets/index-vrX09Urw.css` (`61.36 kB` — SHA-256: `ca6de747195a5550d80dc7ea59cc7ea8a43c51a9b77c07d596e79ffbefe66d87`) — **Khớp 100% với baseline Mốc 2B (`d3c32dd`)**.
- `dist/assets/index-CvVwFN8Z.js` (`369.95 kB` — SHA-256: `10f187c6990780a5a4417928e9ab313db068caffce0e988233b07cadba8be234`) — **Khớp 100% với baseline Mốc 2B (`d3c32dd`)**.
- Đã dọn sạch thư mục tạm `dist/` sau khi kiểm chứng.

---

**PHASE 3A DESIGN V2.1 READY FOR CLAUDE QA 3A-02**
