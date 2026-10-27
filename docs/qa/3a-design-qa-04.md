# Claude Independent QA — Phase 3A Design QA 04 (Content Integrity Retest + Visual Regression)

| Mục | Chi tiết |
|---|---|
| Căn cứ | CEO Directive 020-B (QA 3A-04), CEO Directive 020-A (tiêu chí sửa), `AGENTS.md`, `docs/qa/3a-design-qa-03.md` |
| Agent | Claude — Independent QA Lead (QA ONLY: không sửa code, không merge, không deploy) |
| Ngày | 27/10/2026 |
| Nhánh kiểm tra | `fix/milestone-2a-qa` |
| Commit kiểm tra | `b33355a545c6f38c1916f14010fca62eb77b198e` — "docs(phase-3a): content integrity fix & synchronization (Round 04)" |
| Commit trước | `2fc3387` (QA 3A-03: DESIGN FAIL) |
| Tài liệu bàn giao | `docs/qa/3a-design-handoff-04.md` (có Content Mapping Ledger, kết thúc "PHASE 3A-04 CONTENT FIX — READY FOR CLAUDE QA") |
| Phương pháp | Kiểm tra trên **chính file đã commit** (`git archive b33355a`), không dùng mockup cũ. Playwright Chromium, server tĩnh cục bộ, build sạch Vite |
| Bằng chứng | `docs/qa/3a-design-qa-04-evidence/`, scripts `tests/visual/` |

## Kết luận: **DESIGN PASS WITH FIXES**

- **Hai lỗi P1 đều FIXED** (3A-P1-2 nhân sự, V3-P1-1 cơ sở vật chất), kiểm cả nội dung ẩn, trạng thái N = 8, bộ lọc, menu mobile, chế độ Wireframe và thuộc tính `alt`/`aria-label`/`title`.
- **Không có hồi quy visual**: 0 tràn ngang, 0 chữ cắt, 0 ảnh méo trên 18 tổ hợp (3 trang × 6 viewport). Không có thay đổi CSS/layout trong vòng này.
- **Không có thay đổi ngoài phạm vi**: chỉ 3 file trong `docs/`; build hash CSS/JS trùng baseline.
- **Còn 4 lỗi P2** (chủ yếu là báo cáo bàn giao ghi sai kết quả và một số nhãn trạng thái chưa nhất quán với Blueprint) và **4 nhóm P3**. Tất cả đều sửa bằng text/tài liệu, không cần đổi layout.
- **Khuyến nghị:** đủ điều kiện để **chủ dự án xem xét duyệt thiết kế**, kèm điều kiện các P2 dưới đây được xử lý trước khi bắt đầu code Phase 3A (xem mục 9).

---

## 1. Branch và commit

- `origin/fix/milestone-2a-qa` @ `b33355a` (parent `2fc3387`). `origin/main` vẫn @ `d2a19c5`; `b33355a` **chưa được merge** vào main.
- Diff `2fc3387..b33355a`: đúng 3 file, đều trong `docs/`:
  - `docs/design/phase-3a-interactive-mockups.html` (+132/−130)
  - `docs/phase-3a-design-blueprint.md` (+18/−15, lên v2.3)
  - `docs/qa/3a-design-handoff-04.md` (mới, 155 dòng)
- Mã hóa (`encoding-check.txt`): cả 3 file decode UTF-8 strict OK, không BOM, 0 U+FFFD, 0 mojibake. **V-P1-1 không tái phát.**

## 2. Hai lỗi P1

### 2.1. 3A-P1-2 (nhân sự `/doi-ngu`): **FIXED**

Quét toàn văn mọi trạng thái người xem có thể tới (`claims04.json`) với danh sách cụm từ cấm của Directive 020-A/020-B: **0 kết quả** cho "Nội khoa", "Ngoại khoa", "hội chẩn", "phác đồ", "Kỹ thuật viên", "Nhân viên Hỗ trợ", "khép kín", "chỉ định xét nghiệm", "kíp trực", "ca trực", "bàn giao", "thân nhiệt", "khử khuẩn", "da liễu", "dự phòng", "3 bác sĩ"/"ba bác sĩ", "Bác sĩ trưởng".

| Tiêu chí 020-B | Kết quả | Bằng chứng (text hiển thị) |
|---|---|---|
| Không gán chuyên khoa/nhiệm vụ cho BS. Lê Thái Sơn | ĐẠT | "BS. Lê Thái Sơn / Bác sĩ Thú y / [Phạm vi chuyên môn & phụ trách — Chờ cập nhật hồ sơ thực tế]. / Lĩnh vực: [Chờ cập nhật]" |
| Không mô tả chuyên môn cho bác sĩ khác | ĐẠT | Mọi card khác: "[Bác sĩ Thú y — Dữ liệu mô phỏng] / [Chức danh chuyên môn: Chờ xác minh] / [Phạm vi phụ trách chuyên môn — Chờ cập nhật hồ sơ thực tế]" |
| Không trình bày 3 bác sĩ như sĩ số đã xác minh | ĐẠT | Khung "[KHUNG MÔ PHỎNG KIỂM THỬ GIAO DIỆN]: Sĩ số và danh sách nhân sự thực tế đang chờ Chủ dự án cung cấp" ngay đầu bộ phận |
| Không tự đặt vị trí kỹ thuật viên / nhân viên hỗ trợ | ĐẠT (còn P2 nhỏ, xem 3A04-P2-4) | Card hỗ trợ: "[Nhân viên Chăm sóc nội trú — Dữ liệu mô phỏng]", "[Nhân viên Tiếp đón & Hỗ trợ — Dữ liệu mô phỏng]", "[Chức danh: Chờ xác minh]", "Nhiệm vụ: [Chờ phân công]" |
| Không mô tả quy trình trực/hội chẩn/bàn giao | ĐẠT | Banner "[QUY TRÌNH PHỐI HỢP ĐỀ XUẤT]…đang chờ Chủ dự án xác nhận"; bước 02, 03 có tiền tố "[Đề xuất]:"; bước 01 chỉ dùng dữ liệu đã xác minh (địa chỉ, giờ, hotline) |

Lưới và card: 0 ảnh người trên `/doi-ngu` (3A-P1-1 không tái phát); card BS. Lê Thái Sơn ở vị trí 2, cùng nền/viền/bóng/kích thước với card khác (không có card VIP).

### 2.2. V3-P1-1 (cơ sở vật chất `/co-so-vat-chat`): **FIXED**

0 kết quả cho "cách ly", "hồi sức", "phân luồng", "thoáng đãng", "tách biệt", "đèn sưởi", "sinh hiệu", "monitor", "Bồn tắm", "Mindray", "phẫu thuật", "sạch khuẩn", "vô khuẩn" trong mọi trạng thái hiển thị, menu mobile, chế độ Wireframe và thuộc tính.

| Section | Text hiện tại | Đánh giá |
|---|---|---|
| 3.2 Tiếp đón | "Không gian tiếp nhận thông tin và hướng dẫn ban đầu cho chủ nuôi cùng thú cưng tại cơ sở 101 Khuất Duy Tiến." | Trung tính |
| 3.2 Nội trú | "Khu vực phục vụ nhu cầu lưu trú và chăm sóc thú cưng theo dịch vụ Nội trú 24/7 của bệnh viện." | Bám dịch vụ đã xác nhận |
| 3.2 Spa | "Khu vực phục vụ các dịch vụ tắm, cắt tỉa và chăm sóc vệ sinh cho thú cưng." | Không còn "tách biệt khỏi khu điều trị" |
| 3.3 Thiết bị | "[Trang thiết bị cận lâm sàng — Chờ xác nhận]" | Slot |
| 3.4 Thiết bị nội trú | "[Trang thiết bị hỗ trợ chăm sóc — Chờ xác nhận]… sẽ được công bố sau khi kiểm định" | Hết mâu thuẫn với slot |
| 3.5 Cấp cứu | "…gọi trực tiếp Hotline 097 355 51 05 để được hỗ trợ hướng dẫn kịp thời." | Không còn "kíp trực" |

Ghi chú: cụm "quy trình vệ sinh định kỳ" vẫn còn nhưng nằm trong slot "[Quy chuẩn khu nội trú]: … sẽ được cập nhật theo cơ sở thực tế", không phải khẳng định. Chấp nhận.

### 2.3. `/gioi-thieu`: **FIXED (3A-P2-1)**

- Banner "[ĐỀ XUẤT NỘI DUNG]: Bốn định hướng chăm sóc dưới đây là bản thảo đề xuất, đang chờ Chủ dự án xác nhận nguyên tắc vận hành thực tế."
- Cả 4 dòng mở đầu "[Đề xuất 0x]" và "[Đề xuất định hướng]:". "được vệ sinh định kỳ" và "chỉ chia sẻ trực tiếp" đã bị bỏ.
- **Không có cam kết mới thay thế**: các câu thay thế ("Khu vực lưu trú được duy trì ngăn nắp…", "…chỉ trao đổi trực tiếp với gia đình của bé") đều nằm trong khung đề xuất.
- Section 1.3 (3 giá trị) giữ nguyên nội dung đã nghiệm thu từ `WhyChooseUs.tsx` ở Mốc 2B; không phải claim mới.

## 3. Tính nhất quán Blueprint v2.3 ↔ Content Mapping ↔ mockup

Kết quả chung: **nhất quán về các claim P1**; Blueprint body (mục 2.1–2.3) không có claim nào bị loại ở 020-A (các cụm còn xuất hiện chỉ nằm trong bảng mapping QA, lịch sử lỗi hoặc câu phủ định). Mockup không có claim mới ngoài Blueprint. Ghi chú nội bộ `.p3a-wf-note` chỉ hiện ở chế độ Wireframe (0 hiển thị ở chế độ Mockup).

Các điểm lệch:

| ID | Mức | Vị trí | Blueprint v2.3 | Mapping / Handoff | Mockup thực tế |
|---|---|---|---|---|---|
| **3A04-P2-3** | P2 | `/doi-ngu` card BS. Lê Thái Sơn, chức danh | 2.2: "`[Chức danh: Bác sĩ Thú y — Chờ Chủ dự án xác nhận cách ghi chức danh công bố]`" | Mapping: "**VERIFIED** (Tên & Chức danh Bác sĩ)"; nhưng Handoff §4 mục 2 lại ghi danh xưng này **đang chờ xác nhận** | "Bác sĩ Thú y" không có nhãn chờ. Trạng thái bị **nâng lên VERIFIED thiếu căn cứ** |
| **3A04-P2-4** | P2 | `/doi-ngu` cơ cấu bộ phận | 2.3: Spa & Grooming và Chăm sóc/Hỗ trợ đều kèm "`[Cơ cấu & số lượng nhân sự: Chờ xác nhận]`"; bộ lọc có "(Chờ xác nhận)"; Quyết định 9.2 (tách/gộp bộ phận) chưa có | Mapping: Spa "PENDING" | Bộ lọc bỏ "(Chờ xác nhận)"; bộ phận Spa không có nhãn chờ ("[Bộ phận Spa & Grooming phục vụ dịch vụ tắm vệ sinh…]"); lead hero ghi "được tổ chức theo từng bộ phận thực tế"; tag card "Chăm sóc Nội trú", "Tiếp đón & Hỗ trợ" không có ngoặc |
| 3A04-P3-2 | P3 | `/doi-ngu` 2.4 | Wireframe 3.2.C: "Bước 01 → … → Bước 04 (Hướng dẫn theo dõi)" | Handoff §1 và Blueprint 8.0A ghi "quy trình **4 bước**"; Mapping ghi "Ba cột triptych bước 01–03" | **3 bước** |
| 3A04-P3-2 | P3 | `/co-so-vat-chat` 3.2 | 2.3: gallery **3 khung** (Tiếp đón, Khám, Spa) | Mapping: "Gallery **4** phân khu" | **4 khung** (thêm Nội trú 24/7) |
| 3A04-P3-2 | P3 | `/doi-ngu` hero lead | "…Mỗi thành viên đều có vai trò rõ ràng và phối hợp chặt chẽ…" | — | Câu khác: "…được tổ chức theo từng bộ phận thực tế. Mọi thành viên được giới thiệu trên cùng một quy chuẩn thẻ…" |

Placeholder: thống nhất trong mockup (mẫu "[… — Dữ liệu mô phỏng]", "[Chức danh: Chờ xác minh]", "[Chờ cập nhật]"); khác chữ so với Blueprint 2.2 ("[Họ và tên Bác sĩ — Chờ danh sách xác minh]") nhưng cùng ý nghĩa. Không xem là lỗi.

## 4. Visual regression

Script `visual3a` (`visual3a.json`, 18 ảnh chụp): 3 trang × {320, 375, 768, 1024, 1440, 1920}.

| Tiêu chí | Kết quả |
|---|---|
| Tràn ngang | 0/18 |
| Chữ bị cắt | 0 |
| Ảnh méo | 0 |
| `h1` | đúng 1 trên mỗi trang |
| Font | Be Vietnam Pro 400/500/600/700/400i + Lora 600 (không Lora nghiêng) |
| Card nhân sự (`team-grid-matrix.txt`) | N = 1, 2, 3, 5, 7 (cân đối), 7 (chuẩn), 8 tại 1440/1024/768/375: **cùng chiều rộng và cùng chiều cao trong mỗi hàng**; hàng cuối căn giữa đối xứng (lệch ≤ 1 px); không phóng to card lẻ |
| Card VIP | Không: BS. Lê Thái Sơn cùng nền `#FFF`, viền, bóng, kích thước 410×780 với card khác |
| Menu mobile | Hamburger 40×44, `aria-expanded` false→true→false, `aria-controls`, Escape đóng và trả focus, chuyển trang qua drawer OK |
| Focus / breadcrumb | Vòng focus 2 px solid; link breadcrumb cao 44 px |
| Reduced motion | `animation-duration` 0s |
| UTF-8 | Không tái phát |
| Layout ngoài phạm vi | **Không có**: mọi hunk diff nằm sau dòng 1258 (markup nội dung); khối CSS không đổi. Thay đổi cấu trúc duy nhất là gỡ bộ nút mô phỏng N |

Ở 375 px, card 1 cột cao 712–736 px tùy nội dung. Đây là hành vi bình thường của lưới 1 cột, không phải lỗi.

## 5. P2 và P3 còn mở

| ID | Mức | Trạng thái | Nội dung |
|---|---|---|---|
| **3A04-P2-1** | P2 | NEW | **Handoff ghi sai: V3-P3-1 "FIXED" nhưng không có thay đổi.** Handoff và Blueprint 8.0A ghi đã rút CTA thành "Đặt lịch" và đặt `white-space: nowrap; 0.62rem` cho `.p3a-header-cta` / `.p3a-logo-subtitle`. Thực tế hai class này **không tồn tại** trong mockup, khối CSS không đổi. Đo được ở 320/360/390: nút vẫn là "Đặt lịch khám", xuống **2 dòng** (cao 56 px); dòng phụ "Bệnh viện Thú y" xuống 2 dòng (cao 36 px). Xem `screens/header-390.jpg` |
| **3A04-P2-2** | P2 | NEW | **Handoff ghi sai về bộ mô phỏng N.** Handoff ghi "chuyển các nút mô phỏng N = 1..8 lên thanh công cụ Reviewer Deck", nhưng thanh Studio không có nút N nào; bộ nút đã bị **xóa hẳn** (hàm `setTeamCount` còn nhưng không được gọi). Hệ quả: V-P2-2 đạt (không còn trong nội dung trang), nhưng chủ dự án **không còn xem được** các trạng thái N = 1..8 trong mockup; Claude chỉ kiểm được qua JS |
| **3A04-P2-3** | P2 | NEW | Chức danh BS. Lê Thái Sơn bị đánh dấu VERIFIED trong mapping trong khi Blueprint và Handoff §4 vẫn để chờ (mục 3) |
| **3A04-P2-4** | P2 | NEW | Cơ cấu bộ phận (Spa & Grooming, tag vai trò hỗ trợ, lead "bộ phận thực tế") chưa gắn nhãn chờ như Blueprint 2.3 yêu cầu (mục 3) |
| V-P2-2 | P2 | **FIXED** (về nội dung) | Không còn "N = …" trong trang. `aria-live="polite"` đọc: "Đang hiển thị: Bộ phận Bác sĩ Thú y." / "…Spa & Grooming." / "…Chăm sóc & Hỗ trợ vận hành." / "…Tất cả các bộ phận." **Không còn thuật ngữ kỹ thuật**. Xem 3A04-P2-2 về tài liệu |
| V3-P3-1 | P3 | **OPEN** | Header mobile chật (như trên) |
| V3-P3-3 | P3 | FIXED | Đoạn R-3A-05 trùng đã xóa; vị trí `article-prevention.webp` đã sửa |
| 3A04-P3-1 | P3 | NEW | `filterDept()` thêm class `p3a-is-active` mà không gỡ, nên sau vài lần lọc cả 4 nút mang class này. Không ảnh hưởng hiển thị vì CSS dựa vào `aria-pressed` (đúng), nhưng là code nhiễu cần dọn khi implement |
| 3A04-P3-2 | P3 | NEW | Lệch số bước quy trình (4 ↔ 3) và số khung gallery (3 ↔ 4) giữa Blueprint, Handoff và mockup (mục 3) |
| 3A04-P3-3 | P3 | NEW | Tài liệu: Blueprint có **3 heading "## 8. MỤC 8"**; Blueprint còn 5 và Handoff 4 link `file:///d:/…`/`C:/Users/…` (máy cục bộ, không mở được từ repo); nhãn Studio vẫn ghi "v2.1" |
| 3A04-P3-4 | P3 | NEW | Câu chữ nên trung tính hơn: "Lịch thăm khám: [Theo lịch phân công tại viện]" trên card BS. Lê Thái Sơn; "[Phân khu chức năng]: Quy cách **phòng can thiệp điều trị** sẽ được cập nhật…" (ngầm định có phòng này); tiêu đề "Quy hoạch các phân khu tại cơ sở" |

## 6. Asset provenance

| Mục | Kết quả |
|---|---|
| Ảnh dùng trong mockup | `article-prevention.webp` (2 lần), `article-nutrition.webp` (2 lần), `logo.png`; card nhân sự và khung 3, 4 của gallery dùng SVG/monogram nội tuyến |
| AP-1 | **PARTIAL, giữ nguyên**: `article-prevention` "CHƯA XÁC MINH BẢN QUYỀN GỐC (UNVERIFIED — TỰ KHAI AI)", `article-nutrition` "UNVERIFIED — STOCK", không có URL/tác giả/giấy phép. **Không bị nâng lên VERIFIED** (đạt yêu cầu 020-B). Cột "Cho phép phát hành" = KHÔNG |
| Nhãn minh họa | Mỗi khung ảnh có "Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn"; khung SVG ghi "Khung sơ đồ kiến trúc — Chờ ảnh thực tế" |
| Ảnh người | 0 ảnh người trên cả 3 trang |
| **2B-29** (logo Champion) | **OPEN, giữ riêng.** Đã gỡ khỏi 3A; `src/components/sections/WhyChooseUs.tsx:30` vẫn dùng `/images/why-pet-companion.webp` trên trang chủ. Không tự đóng; vòng này không yêu cầu sửa source trang chủ |

## 7. Source diff, routing, build

| Kiểm tra | Kết quả |
|---|---|
| File ngoài `docs/` trong `2fc3387..b33355a` | **0** |
| `src/`, routing (`src/app/routes.tsx`), `vite.config.ts`, `package.json`, `vercel.json` | Không đổi |
| Code 3A trong `src/` | Không có |
| Merge vào `main` | Không (`main` @ `d2a19c5`) |
| Deploy | Claude không tạo deployment; vòng này không yêu cầu kiểm Preview |
| Build sạch tại `b33355a` | `index-vrX09Urw.css` sha256 `ca6de747…fe66d87` (61,365 B); `index-CvVwFN8Z.js` sha256 `10f187c6…be234` (369,954 B): **trùng baseline** |

## 8. Thông tin thật còn thiếu (chờ chủ dự án)

1. Danh sách nhân sự thật: họ tên, chức danh, bộ phận, bằng cấp/chứng chỉ, ảnh chân dung 4:5 đã duyệt.
2. Cách ghi chức danh công bố của BS. Lê Thái Sơn ("Bác sĩ Thú y" / "Phụ trách chuyên môn" / khác).
3. Cơ cấu bộ phận thật (tách/gộp Spa & Grooming, chăm sóc nội trú, tiếp đón) và quy tắc thứ tự card.
4. Duyệt câu chuyện sáng lập (1.2) và 4 nguyên tắc phục vụ (1.4).
5. Quy trình phối hợp thực tế (2.4).
6. Danh mục thiết bị được phép công bố; sơ đồ phân khu thực tế (có/không phòng thủ thuật).
7. Bộ ảnh thật cơ sở 101 Khuất Duy Tiến (đề xuất ≥ 4 ảnh) trước khi mở index (2B-06).
8. Nguồn/giấy phép ảnh minh họa (AP-1), nếu tiếp tục dùng ở Preview.
9. Quyết định xử lý 2B-29 trên trang chủ.

## 9. Khuyến nghị về Design Approval

Đối chiếu 4 điều kiện của Directive 020-B:

| Điều kiện | Kết quả |
|---|---|
| Không còn P1 | **Đạt**: 3A-P1-2 và V3-P1-1 FIXED |
| Visual không hồi quy đáng kể | **Đạt**: 0 lỗi trên 18 tổ hợp; không đổi layout |
| Blueprint và mockup nhất quán | **Đạt cơ bản**: claim P1 khớp; còn 2 P2 về nhãn trạng thái (3A04-P2-3, P2-4) và lệch P3 về số bước/số khung |
| Thông tin chưa xác minh xử lý minh bạch | **Đạt**: banner, slot, nhãn "Dữ liệu mô phỏng", nhãn ảnh minh họa đầy đủ |

**Claude đề nghị chủ dự án xem xét duyệt thiết kế Phase 3A** (bố cục, visual, cấu trúc nội dung và cơ chế placeholder), kèm các điều kiện:

1. **Trước khi code 3A**, Antigravity sửa text/tài liệu: 3A04-P2-3, 3A04-P2-4, cập nhật Handoff cho đúng thực tế (3A04-P2-1, P2-2), và đồng bộ số bước/số khung (P3-2). Không cần đổi layout.
2. V3-P3-1 (header mobile) xử lý ở bước implement, hoặc sửa mockup nếu chủ dự án muốn xem trước.
3. Chủ dự án nên lưu ý: báo cáo bàn giao vòng này có **2 mục ghi "FIXED" không đúng thực tế**. QA khuyến nghị Antigravity đối chiếu từng claim trong handoff với file thật trước khi bàn giao.
4. Duyệt thiết kế **không** đồng nghĩa với duyệt nội dung: mọi placeholder ở mục 8 vẫn PENDING và phải có dữ liệu thật trước khi phát hành. Trang `/co-so-vat-chat` vẫn không được mở index khi chưa có ảnh thật.

Claude không tự phê duyệt, không nghiệm thu, không sửa source website.

### Trạng thái Mốc 2B (không tự đóng)

- Soft 404: OPEN
- LCP mobile (2B-08): OPEN
- 2B-06 (ảnh thật / nguồn ảnh): PENDING
- SEO Production: chưa kiểm
- 2B-29 (logo Champion): OPEN

---

**PHASE 3A DESIGN — PENDING OWNER APPROVAL**
