# PHASE 3A DEV-00 CONTENT GATE QA

| Mục | Chi tiết |
|---|---|
| Căn cứ | CEO Directive 024-B (QA), CEO Directive 024-A (DEV-00 Documentation Freeze), `AGENTS.md` (Architecture Baseline V1), `docs/qa/3a-design-qa-04.md` |
| Agent | Claude — Independent QA Lead (QA ONLY) |
| Ngày | 27/10/2026 |
| Nhánh kiểm tra | `fix/milestone-2a-qa` |
| Commit kiểm tra | `c68ac149f3af60cd90e1e10c6f88e22c8451bcf2`: "docs(phase-3a): DEV-00 documentation freeze & handoff integrity fix" |
| Baseline so sánh | `b33355a545c6f38c1916f14010fca62eb77b198e` (QA 3A-04) |
| Bàn giao | `docs/qa/3a-design-handoff-05.md` ("PHASE 3A DEV-00 — READY FOR INDEPENDENT CONTENT GATE QA"), Blueprint v2.4, mockup đã cập nhật |
| Phương pháp | Kiểm tra trên file đã commit (`git archive c68ac14`), **không** dựa vào mô tả trong handoff. Có công cụ render: Playwright Chromium, server tĩnh cục bộ, build sạch Vite |
| Bằng chứng | `docs/qa/3a-dev00-qa-evidence/` |

## Kết luận: **PASS WITH FIXES**

- **Cả bốn lỗi P2 của QA 3A-04 đã được xử lý đúng phạm vi DEV-00** trên mockup, Content Mapping và handoff 05.
- **Không có P1 nào về tính chính xác nội dung.**
- **Không có hồi quy visual.** Không có thay đổi nào ngoài `docs/`; build hash trùng baseline.
- **Còn 1 lỗi P2 mới:** Blueprint v2.4 mục 2.2 chưa đồng bộ đoạn dẫn `/doi-ngu`, mà Blueprint là spec cho DEV-01. Còn một số lỗi P3 về tài liệu.
- **Khuyến nghị:** đủ điều kiện **đề xuất chủ dự án xem xét mở DEV-01**, kèm điều kiện sửa DEV00-P2-1 (chỉ sửa một đoạn tài liệu) trước hoặc trong commit đầu tiên của DEV-01. Claude không tự khởi động DEV-01.

---

## 1. Branch và commit

- `origin/fix/milestone-2a-qa` @ `c68ac14`, parent `b33355a`. `origin/main` vẫn @ `d2a19c5`; `c68ac14` **chưa merge** vào main.
- Diff `b33355a..c68ac14` (`diff-stat-b33355a-c68ac14.txt`), 4 file, đều trong `docs/`:
  - `docs/design/phase-3a-interactive-mockups.html` (+13/−13): chỉ sửa text
  - `docs/phase-3a-design-blueprint.md` (+66/−56): lên v2.4
  - `docs/qa/3a-design-handoff-04.md` (+4/−4): chỉ sửa link
  - `docs/qa/3a-design-handoff-05.md` (mới, 105 dòng)

## 2. Kết quả bốn lỗi P2

| ID | Kết quả | Bằng chứng trên file đã commit |
|---|---|---|
| **3A04-P2-1** Header mobile | **PASS** (về báo cáo); **lỗi visual vẫn OPEN** | Handoff 05 §1.1 và Blueprint 8.0 ghi "**OPEN** (Đã đưa vào Implementation Backlog)", không còn khẳng định FIXED. Đo lại ở 320/360/390: nút vẫn "Đặt lịch khám", xuống 2 dòng (cao 56 px); dòng phụ "Bệnh viện Thú y" xuống 2 dòng (`screens/header-390.jpg`). Giữ OPEN để xử lý khi implementation được duyệt. Phần ghi chép còn sót xem DEV00-P3-2 |
| **3A04-P2-2** Bộ mô phỏng N | **PASS** | Handoff 05 và Blueprint 8.0, 10.2 thừa nhận các nút N = 1..8 "đã được chủ động gỡ bỏ… (cả trang và thanh công cụ)", chỉ còn hàm `setTeamCount()`. Mockup thực tế: **không có** nút "N = …" nào (`menu-a11y.json`: `simulatorPanel.present = false`); hàm vẫn chạy được (`team-grid-matrix.txt`). Không yêu cầu phục hồi |
| **3A04-P2-3** VERIFIED/PENDING | **PASS** | Xem bảng từng trường bên dưới |
| **3A04-P2-4** Nhãn bộ phận | **PASS trên mockup**; Blueprint còn sót (DEV00-P2-1) | Bộ lọc: "Bộ phận Bác sĩ Thú y (Lâm sàng)", "Bộ phận Spa & Grooming (Chờ xác nhận)", "Bộ phận Chăm sóc & Hỗ trợ (Chờ xác nhận)". Tiêu đề: "Bộ phận Spa & Grooming (Chờ xác nhận cơ cấu)", "Bộ phận Chăm sóc & Hỗ trợ vận hành (Chờ xác nhận cơ cấu)". Tag card: "[Spa & Grooming — Đề xuất]", "[Chăm sóc Nội trú — Chờ xác nhận]", "[Tiếp đón & Hỗ trợ — Chờ xác nhận]". Đoạn dẫn mockup: "Các bộ phận và thẻ nhân sự dưới đây hiện là khung mô phỏng giao diện, chờ Chủ dự án xác nhận cơ cấu thực tế." Không có bộ phận hay vị trí mới. Không có thứ bậc thị giác: card BS. Lê Thái Sơn 410×780, cùng nền, viền và bóng với các card khác, ở vị trí 2 |

### Trạng thái từng trường thông tin nhân sự (3A04-P2-3)

| Card | Trường | Mockup | Mapping (handoff 05) / Blueprint | Căn cứ | Đánh giá |
|---|---|---|---|---|---|
| BS. Lê Thái Sơn | Họ tên | "BS. Lê Thái Sơn" | VERIFIED | Tên có trong tài liệu dự án và source đã nghiệm thu | Hợp lý |
| | Chức danh | "[Chức danh: Bác sĩ Thú y — Chờ xác nhận]" | PENDING | Chưa có quyết định về cách ghi chức danh (Blueprint 9.2) | Đúng |
| | Phạm vi phụ trách | "[Phạm vi chuyên môn & phụ trách — Chờ cập nhật hồ sơ thực tế]" | PENDING | — | Đúng |
| | Lĩnh vực / chuyên môn | "[Chờ cập nhật]" | PENDING | — | Đúng |
| | Lịch khám | "[Chờ cập nhật]" (trước đây là "[Theo lịch phân công tại viện]") | PENDING | — | Đúng |
| Bác sĩ khác (#1, #3–#8) | Mọi trường | "[Bác sĩ Thú y — Dữ liệu mô phỏng]", "[Chức danh chuyên môn: Chờ xác minh]", "[Chờ cập nhật]" | ILLUSTRATIVE | — | Đúng |
| Spa / Chăm sóc / Tiếp đón | Mọi trường | "… — Dữ liệu mô phỏng", "[Chức danh: Chờ xác minh]", "[Chờ phân công]" | PENDING | — | Đúng |

Blueprint 6 và 8.0 tách đúng các trường như trên. Không còn trường nào được gắn VERIFIED mà thiếu căn cứ.

## 3. Blueprint–mockup consistency

Đã kiểm cả nội dung tĩnh và các trạng thái tương tác: N = 8, 4 trạng thái bộ lọc, menu mobile, chế độ Wireframe, `aria-live`, thuộc tính `alt`/`aria-label`/`title` (`claims04.json`).

| Điểm đối chiếu | Kết quả |
|---|---|
| Số bước quy trình | Mockup **3 bước**; Blueprint 2.2 (Section 2.4) **3 bước**; handoff 05 **3 bước**. **Còn sót:** wireframe Blueprint 3.2.C, dòng 375 vẫn là "Bước 01 → Bước 02 → Bước 03 → **Bước 04** (Hướng dẫn theo dõi)" (DEV00-P3-1) |
| Số khung gallery | Mockup **4**; Blueprint 2.3 **4** (Khung 01–04); wireframe 3.3 **4**; handoff 05 **4**: **Khớp** |
| Heading và numbering | Blueprint còn **một** "## 8. MỤC 8" với 8.0–8.3: **Đã sửa**. Riêng 4.1, 4.2 không có heading "## 4." cha (đã như vậy từ trước; P3) |
| Liên kết file | 0 link `file:///` trong cả 4 file. **Còn sót:** Blueprint dòng 13 còn đường dẫn `C:/Users/Admin/.gemini/antigravity/…`; mục 10.2 còn 2 lệnh dùng `d:\webbvct` (DEV00-P3-3). Handoff 05 ghi "Loại bỏ 100%…" chỉ đúng với `file:///` |
| Trạng thái từng claim | Khớp trên mockup và handoff 05. **Ngoại lệ:** đoạn dẫn `/doi-ngu` trong Blueprint (DEV00-P2-1) |
| Danh sách FIXED/OPEN/PARTIAL | Handoff 05 và Blueprint 8.0 đúng: P2-1 OPEN, P2-2 "FIXED IN REPORT", P2-3 FIXED, P2-4 FIXED. **Còn sót:** Blueprint 8.1, dòng V3-P3-1 ghi "FIXED (Blueprint Spec) / OPEN (Mockup CSS)" nhưng dẫn chứng là "Mockup CSS `.p3a-header-cta`, `.p3a-logo-subtitle`", hai class không tồn tại. Handoff 04 vẫn giữ nguyên các câu FIXED sai mà không có ghi chú đính chính (DEV00-P3-2) |

### Lỗi mới

**DEV00-P2-1 (P2): Blueprint v2.4 §2.2 chưa đồng bộ đoạn dẫn `/doi-ngu`.**

- File `docs/phase-3a-design-blueprint.md`, mục 2.2, Section 2.1, "Đoạn dẫn trung tính" (khoảng dòng 151), vẫn ghi:
  > "Tại Bệnh viện Thú y Lê Sơn, hoạt động thăm khám và chăm sóc được tổ chức theo từng bộ phận chuyên môn **thực tế**. Mỗi thành viên đều có **vai trò rõ ràng và phối hợp chặt chẽ** vì sự an toàn của từng bé cưng."
- Mockup đã viết lại: "…Các bộ phận và thẻ nhân sự dưới đây hiện là khung mô phỏng giao diện, chờ Chủ dự án xác nhận cơ cấu thực tế."
- Handoff 05 ghi mục này "KHỚP 100%", điều này không đúng.
- Câu trong Blueprint khẳng định cơ cấu và cách phối hợp chưa được xác minh. Blueprint lại là spec mà DEV-01 sẽ code theo, nên phải sửa trước khi implement.
- Cách sửa: chép đúng câu của mockup vào Blueprint.

## 4. Content Integrity Gate

Quét toàn văn mọi trạng thái cho thấy **0 kết quả** cho tất cả cụm từ bị cấm từ 020-A/024-A: "Nội/Ngoại khoa", "hội chẩn", "phác đồ", "Kỹ thuật viên", "Nhân viên Hỗ trợ", "khép kín", "chỉ định xét nghiệm", "kíp trực", "ca trực", "bàn giao", "cách ly", "hồi sức", "phân luồng", "tách biệt", "đèn sưởi", "sinh hiệu", "monitor", "Mindray", "phẫu thuật", "sạch khuẩn", "Bác sĩ trưởng", "3 bác sĩ".

| Nhóm | Trạng thái hiển thị | Đánh giá |
|---|---|---|
| Nhân sự | Mục 2 | **ĐẠT** |
| Cơ cấu bộ phận | Mockup gắn nhãn chờ đầy đủ; `aria-live` đọc "Đang hiển thị: Bộ phận Spa & Grooming." nhưng không kèm "(Chờ xác nhận)" (DEV00-P3-5) | **ĐẠT**, còn P2 ở Blueprint (DEV00-P2-1) |
| Thiết bị | "[Trang thiết bị cận lâm sàng — Chờ xác nhận]", "[Trang thiết bị hỗ trợ chăm sóc — Chờ xác nhận]" | **ĐẠT** |
| Phân khu | "[Phân khu chức năng — Chờ Chủ dự án xác nhận]: Sơ đồ phân khu chức năng thực tế sẽ được cập nhật… theo khảo sát mặt bằng". Không còn ngầm định có "phòng can thiệp điều trị" (3A04-P3-4 đã sửa) | **ĐẠT** |
| Quy trình | Banner đề xuất; bước 02, 03 là "[Đề xuất]"; bước 01 chỉ dùng dữ liệu đã xác minh | **ĐẠT** |
| Cam kết chăm sóc (`/gioi-thieu` 1.4) | Banner "[ĐỀ XUẤT NỘI DUNG]" và 4 dòng "[Đề xuất 0x]" | **ĐẠT** |
| Câu chuyện thành lập | "[Thông tin lịch sử hình thành]: … sẽ được cập nhật chính thức sau khi Chủ dự án xác nhận" | **ĐẠT** |
| 3 giá trị (`/gioi-thieu` 1.3) | Lấy nguyên từ `WhyChooseUs.tsx` đã nghiệm thu ở Mốc 2B | **ĐẠT** |
| Hình ảnh | 0 ảnh người; mọi khung ảnh có nhãn "Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn"; khung SVG ghi "Khung sơ đồ kiến trúc — Chờ ảnh thực tế" | **ĐẠT** |
| Giấy phép ảnh (AP-1) | `article-prevention.webp` "UNVERIFIED — TỰ KHAI AI", `article-nutrition.webp` "UNVERIFIED — STOCK", không có URL/tác giả/giấy phép. **Không bị tự nâng lên** | **PARTIAL** (giữ nguyên, không tự PASS) |

Ghi chú: "quy trình vệ sinh định kỳ" chỉ xuất hiện trong slot "[Quy chuẩn khu nội trú]: … sẽ được cập nhật theo cơ sở thực tế". Đây không phải khẳng định.

## 5. Design Freeze

| Kiểm tra | Kết quả |
|---|---|
| Thay đổi layout | **Không có.** Mọi hunk diff mockup nằm từ dòng 1425 trở đi (markup); khối `<style>` không đổi. Chỉ sửa text của 9 phần tử |
| Hệ quả của nhãn dài hơn | Ở 320 px, 3 nút lọc xuống 2 dòng (246×52 px), không cắt chữ, không tràn (`screens/filter-320.jpg`). Đây là hệ quả của việc thêm nhãn, chấp nhận được |
| 3 trang × 6 viewport (320/375/768/1024/1440/1920) | 0 tràn ngang, 0 chữ cắt, 0 ảnh méo, 0 tap target < 44 px, đúng 1 `h1` mỗi trang, không nhảy cấp heading (`visual3a.json`) |
| Card nhân sự | N = 1, 2, 3, 5, 7 (cân đối), 7 (chuẩn), 8 × 1440/1024/768/375: cùng chiều rộng, cùng chiều cao trong mỗi hàng (≥ 768), hàng cuối căn giữa lệch ≤ 1 px: **0 hàng lỗi** (`team-grid-matrix.txt`) |
| Card VIP | Không có |
| Font / màu | Be Vietnam Pro 400/500/600/700/400i + Lora 600; CSS không đổi nên màu không đổi |
| UTF-8 | 4 file decode strict OK, không BOM, 0 U+FFFD, 0 mojibake (`encoding-check.txt`) |
| Menu mobile | Hamburger 40×44, `aria-expanded` false→true→false, Escape đóng và trả focus, chuyển trang qua drawer OK |
| Focus / breadcrumb | Vòng focus 2 px solid; link breadcrumb 44 px |
| Reduced motion | `animation-duration` 0s |

## 6. Source integrity

| Kiểm tra | Kết quả |
|---|---|
| File ngoài `docs/` trong `b33355a..c68ac14` | **0** |
| `src/`, routing, `public/`, `package.json`, `vite.config.ts`, `vercel.json` | Không đổi |
| Code 3A | Không có |
| Merge main | Không (`main` @ `d2a19c5`) |
| Deployment | DEV-00 không có deployment nào trong phạm vi Claude kiểm tra được; Claude không tạo deployment |
| Build sạch @ `c68ac14` | CSS `index-vrX09Urw.css` sha256 `ca6de747…fe66d87` (61,365 B); JS `index-CvVwFN8Z.js` sha256 `10f187c6…be234` (369,954 B): **trùng baseline** (`build-hash-c68ac14.txt`) |

## 7. Các vấn đề còn OPEN/PARTIAL

| ID | Mức | Trạng thái | Nội dung / vị trí cần sửa |
|---|---|---|---|
| **DEV00-P2-1** | P2 | NEW, OPEN | Blueprint §2.2, đoạn dẫn `/doi-ngu` (khoảng dòng 151): thay bằng câu của mockup. Sửa thêm dòng mapping tương ứng trong handoff 05 |
| V3-P3-1 / 3A04-P2-1 (visual) | P3 | OPEN, backlog | Header mobile ≤ 390 px: CTA và dòng phụ xuống 2 dòng. Xử lý ở DEV-01 |
| DEV00-P3-1 | P3 | NEW | Blueprint dòng 375 (wireframe 3.2.C): bỏ "→ Bước 04 (Hướng dẫn theo dõi)" |
| DEV00-P3-2 | P3 | NEW | Blueprint 8.1, dòng V3-P3-1: dẫn chứng trỏ tới class CSS không tồn tại, nên ghi là "spec cho DEV-01" thay vì "FIXED". `docs/qa/3a-design-handoff-04.md` các dòng 35–36, 55, 108 vẫn ghi V3-P3-1 đã sửa và N "chuyển lên Reviewer Deck": nên thêm ghi chú đính chính trỏ tới handoff 05. Handoff 05 và Blueprint 8.0 trích nhầm nhãn nút là "Đặt lịch hẹn / khám" (thực tế "Đặt lịch khám") |
| DEV00-P3-3 | P3 | NEW | Blueprint dòng 13: `C:/Users/Admin/.gemini/…`; mục 10.2: `d:\webbvct` (2 lệnh). Nên thay bằng đường dẫn tương đối trong repo |
| DEV00-P3-4 | P3 | NEW | Nhãn phiên bản cũ: Studio badge "v2.1"; Blueprint 10.2 "Mockup v2.1" và "7 mốc viewport" (mockup có 8, gồm 1024); bảng 3A-P3-7 cũng thiếu 1024; mục 6 ghi "Blueprint v2.1 & Mockup v2.1". Handoff 05 ghi "Toolbar lọc 3 nhóm" (thực tế 4 nút, gồm "Tất cả") |
| DEV00-P3-5 | P3 | NEW | `aria-live` chỉ đọc tên bộ phận, không kèm "(Chờ xác nhận)" như nhãn nút. Nên đồng bộ khi implement |
| 3A04-P3-1 | P3 | OPEN | `filterDept()` thêm class `p3a-is-active` mà không gỡ (không ảnh hưởng hiển thị). Dọn khi implement |
| 3A04-P3-4 | P3 | **FIXED** | "phòng can thiệp điều trị" và "Theo lịch phân công tại viện" đã được trung tính hóa |
| AP-1 | P2 | PARTIAL | Ảnh minh họa chưa có nguồn/giấy phép; không phát hành |
| 2B-29 | P2 | OPEN | `src/components/sections/WhyChooseUs.tsx:30` vẫn dùng `why-pet-companion.webp` (logo Champion). Giữ riêng, không tự đóng |
| Mốc 2B | — | Giữ nguyên | Soft 404 OPEN; LCP mobile 2B-08 OPEN; 2B-06 PENDING; SEO Production chưa kiểm |

Thông tin thật còn thiếu (không đổi so với QA 3A-04): danh sách nhân sự, chức danh và ảnh thật; cách ghi chức danh BS. Lê Thái Sơn; cơ cấu bộ phận và thứ tự card; duyệt câu chuyện sáng lập và 4 nguyên tắc; quy trình phối hợp thực tế; danh mục thiết bị và sơ đồ phân khu; ảnh cơ sở thật trước khi mở index; giấy phép ảnh; hướng xử lý 2B-29.

## 8. Khuyến nghị về việc mở DEV-01

| Điều kiện của Directive 024-B | Kết quả |
|---|---|
| Bốn P2 của DEV-00 đã xử lý đúng phạm vi | **Đạt** (mục 2) |
| Không còn P1 về tính chính xác nội dung | **Đạt** |
| Blueprint, mockup và handoff không mâu thuẫn nghiêm trọng | **Đạt có điều kiện**: còn 1 P2 (một đoạn văn trong Blueprint) và vài P3 về tài liệu; không có mâu thuẫn nào về claim P1 |
| Không phát sinh hồi quy visual | **Đạt** |
| Không sửa source website | **Đạt** |

**Claude đề nghị ChatGPT CEO trình chủ dự án xem xét phê duyệt mở DEV-01**, với điều kiện:

1. Sửa DEV00-P2-1 (chỉ sửa tài liệu) trước khi code, hoặc trong commit đầu tiên của DEV-01, để spec không chứa claim chưa xác minh.
2. Gom các P3 tài liệu (DEV00-P3-1 … P3-4) vào cùng lần sửa đó. Nên thêm ghi chú đính chính vào handoff 04.
3. DEV-01 phải xử lý V3-P3-1 (header mobile), DEV00-P3-5 và 3A04-P3-1 trong code, và giữ toàn bộ placeholder và nhãn trạng thái như mockup DEV-00.
4. Không phát hành 3 trang 3A (hoặc phát hành với `noindex`) khi các dữ liệu ở mục 7 còn PENDING. `/co-so-vat-chat` chưa mở index khi chưa có ảnh thật.

Claude không tự khởi động DEV-01, không phê duyệt, không sửa source website.

---

**PHASE 3A DEV-00 — PENDING OWNER IMPLEMENTATION APPROVAL**
