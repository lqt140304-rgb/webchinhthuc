# Design QA 3A-02: Blueprint v2.1 và mockup trực quan (Claude)

| Mục | Giá trị |
|---|---|
| Người kiểm tra | Claude (Independent QA Lead). Chỉ làm QA, không triển khai |
| Căn cứ | CEO Directive 018-B; `AGENTS.md` (Architecture Baseline V1); [QA 3A-01](https://github.com/lqt140304-rgb/webchinhthuc/blob/claude/3a-design-qa-01/docs/qa/3a-design-qa-01.md); `docs/qa/3a-design-handoff-02.md`. Claude **chưa nhận được văn bản CEO Directive 018-A** |
| Nhánh / commit | `fix/milestone-2a-qa` @ `f6b689b`. Chỉ có 3 file thay đổi: `docs/phase-3a-design-blueprint.md` (v2.1), `docs/design/phase-3a-interactive-mockups.html`, `docs/qa/3a-design-handoff-02.md` |
| Đã nhận theo Directive mục I | Branch và commit ✔; Blueprint v2.1 ✔; mockup ✔ (nhưng hỏng mã hóa, xem V-P1-1); hướng dẫn mở ✔; bảng đối chiếu QA 3A-01 ✔; bảng nguồn ảnh ✔ (Blueprint mục 7, còn thiếu, xem AP-1) |
| Ngày | 27/10/2026 |

## 1. Kết luận: **DESIGN PASS WITH FIXES**. **Chưa đề xuất chủ dự án duyệt**

| Hạng mục | Kết luận |
|---|---|
| **Blueprint QA** | **PASS WITH FIXES** |
| **Visual QA** | **FAIL trên file được bàn giao** (V-P1-1: toàn bộ tiếng Việt hiển thị lỗi mã hóa). **PASS WITH FIXES trên bản phục hồi chẩn đoán**, dùng để đánh giá bố cục |
| **P1 regression** (3A-P1-1, 3A-P1-2) | **FIXED**, có bằng chứng trong Blueprint và mockup |
| **P2 disposition** | 9/11 FIXED, 1 PARTIAL, 1 PARTIAL kèm phát hiện mới (mục 7) |
| **Content accuracy** | PASS WITH FIXES. Các cam kết chưa xác minh đã đóng khung "đề xuất"; còn lẫn ghi chú QA vào nội dung trang (V-P2-2) |
| **Design consistency** | PASS. Ba trang cùng ngôn ngữ thiết kế với trang chủ |
| **Accessibility review** | PASS WITH FIXES. Bộ lọc dùng `hidden` kèm `aria-live`, phím Enter hoạt động; vòng focus mảnh, mục breadcrumb quá nhỏ |
| **Asset provenance** | **NOT MET.** Ảnh stock chưa có nguồn và giấy phép; ảnh `why-pet-companion.webp` có **logo Champion** nhưng bảng ghi là sạch (AP-1, AP-2) |
| Regression website | **Không có.** Không file nào trong `src/`, `public/`, `index.html`, `vercel.json` hay `package*.json` thay đổi. Build tại `f6b689b` vẫn cho đúng hash CSS `ca6de747…` và JS `10f187c6…` ([bằng chứng](3a-design-qa-02-evidence/build-hash-f6b689b.txt)) |

Directive yêu cầu không đề xuất duyệt khi còn P1. Vì còn **V-P1-1** (mockup bàn giao không đọc được), Claude **chưa đề xuất chủ dự án duyệt thiết kế**.

Sau khi Antigravity sửa V-P1-1 (lưu lại file đúng UTF-8) và xử lý AP-2 (thay hoặc ghi nhận ảnh có logo), Claude chỉ cần kiểm lại nhanh.

## 2. Phát hiện mới

| ID | Mức | Vấn đề | Bằng chứng | Đề xuất |
|---|---|---|---|---|
| **V-P1-1** | **P1** | File mockup trong repo bị **hỏng mã hóa (mojibake)**. Chuỗi UTF-8 đã bị đọc như Windows-1252 rồi lưu lại thành UTF-8: 280 dòng bị ảnh hưởng, gồm toàn bộ tiêu đề, menu và nội dung tiếng Việt ("Bá»‡nh viá»‡n ThÃº y LÃª SÆ¡n"). Chủ dự án mở file từ repo sẽ không đọc được nội dung, nên không thể duyệt typography hay nội dung | [ảnh mockup gốc](3a-design-qa-02-evidence/screens/00-original-delivered-mojibake-1440.jpg), [phân tích](3a-design-qa-02-evidence/encoding-analysis.txt) | Lưu lại file từ bản gốc dưới dạng **UTF-8 không BOM**, không chuyển qua PowerShell `Set-Content` hay `Out-File` với mã hóa mặc định; `.gitattributes` đã đặt `eol=lf` nhưng không sửa được mã hóa. Có thể kiểm bằng cách mở file và xem `<title>` |
| **AP-2** | **P2** | `public/images/why-pet-companion.webp` có **logo thương hiệu Champion** rõ trên áo của chó. Ảnh này được dùng 2 lần trong mockup 3A, và **đang dùng trên trang chủ Mốc 2B** (`WhyChooseUs.tsx:30`). Bảng nguồn ảnh của Blueprint v2.1 mục 7 không nhắc tới logo này. **Claude đã bỏ sót lỗi này ở các vòng QA 2B** (2B-05 "logo bên thứ ba" từng được đóng) | [ảnh cắt logo](3a-design-qa-02-evidence/screens/why-pet-companion-champion-logo-crop.jpg), [/co-so-vat-chat 1440](3a-design-qa-02-evidence/screens/repaired-co-so-vat-chat-1440.jpg) | Thay ảnh trong mockup và **mở lại một mục cho trang chủ 2B (2B-29, P2)**: thay ảnh hoặc làm mờ logo. Không tự sửa code; chờ CEO giao việc |
| AP-1 | P2 | Bảng nguồn ảnh (Blueprint mục 7) chỉ ghi "ảnh stock thú cưng thân thiện" hoặc "ảnh stock tĩnh vật", **không có URL, tác giả hay giấy phép**. Directive 018-B mục V.1 yêu cầu ảnh minh họa phải có thông tin nguồn và quyền sử dụng rõ ràng. Ảnh AI `article-prevention.webp` vẫn chỉ có nguồn tự khai (2B-06) | Blueprint mục 7, dòng 4–6 | Bổ sung nguồn và giấy phép, hoặc thay bằng ảnh có giấy phép kiểm chứng được. Tới lúc đó, ghi trạng thái **CHƯA XÁC MINH** ngay trong bảng của mục 7 |
| V-P2-2 | P2 | Mockup trộn **ghi chú QA hoặc kỹ thuật vào nội dung trang**: "(Đã khắc phục 3A-P1-1 & 3A-P1-2)", "Thực thi quy tắc… (3A-P2-4)", "Fix 3A-P2-6: Ẩn/Hiện bằng thuộc tính `hidden`", "verified = false", "Thẻ BS. Lê Thái Sơn được đặt ở vị trí trung tính (Thẻ #2)". Chủ dự án khó hình dung trang thật sẽ trông thế nào | [/doi-ngu 1440](3a-design-qa-02-evidence/screens/repaired-doi-ngu-1440.jpg) | Tách ghi chú ra lớp riêng, ví dụ nút "Hiện ghi chú QA" trên thanh công cụ, để nội dung trang chỉ còn chữ dành cho người dùng thật |
| V-P3-1 | P3 | Ở mobile, mockup ẩn menu nhưng không có nút mở menu (hamburger), nên không thể điều hướng giữa các trang. Website thật đã có `MobileNav`, đây là lỗi độ trung thực của mockup | [/gioi-thieu 375](3a-design-qa-02-evidence/screens/repaired-gioi-thieu-375.jpg) | Thêm nút menu, hoặc ghi rõ "dùng `MobileNav` hiện có" |
| V-P3-2 | P3 | Ở mobile, nhãn "Ảnh minh họa…" đè lên dòng chữ của khung placeholder #04 trên `/co-so-vat-chat`. Khung #04 không có ảnh nhưng vẫn gắn nhãn ảnh minh họa | [/co-so-vat-chat 375](3a-design-qa-02-evidence/screens/repaired-co-so-vat-chat-375.jpg) | Bỏ nhãn trên khung trống, hoặc thêm khoảng đệm |
| V-P3-3 | P3 | Vòng focus là mặc định của trình duyệt (`auto 1px`), trong khi Blueprint quy định 2 px solid. Link breadcrumb "Trang chủ" chỉ cao 20 px | [a11y](3a-design-qa-02-evidence/a11y-interaction.txt) | Dùng `--color-focus-ring` 2 px. Tăng vùng chạm của breadcrumb lên ít nhất 24 px |
| V-P3-4 | P3 | H1 `/co-so-vat-chat` "Không gian thăm khám **sạch sẽ, bố trí rõ ràng**" vẫn là mô tả cơ sở thật chưa xác minh, dù nhẹ hơn nhiều so với "sạch khuẩn" | [/co-so-vat-chat 1440](3a-design-qa-02-evidence/screens/repaired-co-so-vat-chat-1440.jpg) | Chấp nhận được trên preview. Chủ dự án xác nhận khi có ảnh thật |
| V-P3-5 | P3 | Chiều cao card bằng nhau **trong cùng một hàng**, nhưng khác nhau giữa các hàng và các bộ phận (866, 805, 782 px ở 1440) vì độ dài chữ khác nhau | [ma trận lưới](3a-design-qa-02-evidence/team-grid-matrix.txt) | Chấp nhận được. Nếu muốn đồng đều tuyệt đối thì dùng `grid-auto-rows: 1fr` cho cả bộ phận |

## 3. Kiểm tra lại hai lỗi P1 cũ

| ID | Kết quả | Bằng chứng |
|---|---|---|
| **3A-P1-1** Ảnh người khác gán cho tên thật | **FIXED** | Mockup `/doi-ngu`: cả 3 card bác sĩ, card Spa và 2 card Chăm sóc đều dùng **monogram** ("BS", "LTS", "SG", "CS") trên khung 4:5 trống, kèm nhãn "Chưa có ảnh thực tế — Khung chân dung 4:5 chờ duyệt". **Trên `/doi-ngu` không có `<img>` nào** ([ảnh chụp](3a-design-qa-02-evidence/screens/repaired-doi-ngu-1440.jpg)). Blueprint mục 7, dòng 3. Ảnh có người mặc đồng phục (`hero-vet-care`, `hero-clinic-cuddle`, `service-exam`, `service-spa`) đã bị loại khỏi cả 3 trang |
| **3A-P1-2** Tự đặt cơ cấu nhân sự | **FIXED** | Mọi trường đều là slot trung tính: "[Họ và tên Bác sĩ #01 — Chờ danh sách xác minh]", "[Chức danh chuyên môn — Chờ xác minh]", "Vai trò kiêm nhiệm: [Chỉ hiển thị nếu có dữ liệu xác minh]". **Không còn** chuyên khoa "Ngoại khoa", lịch trực hay kiêm nhiệm "Nội trú 24/7". Bộ phận 02 và 03 ghi rõ "Placeholder chờ xác nhận cơ cấu"; bộ phận 03 ghi "Bộ phận: [Chờ xác nhận tên bộ phận]". Card BS. Lê Thái Sơn chỉ có tên thật; chức danh để "[Chờ Chủ dự án xác nhận cách ghi]". Các card #04–#08 ghi rõ là "Khung mô phỏng… Kiểm thử lưới" |

## 4. Trang `/doi-ngu`

| Tiêu chí của Directive 018-B mục III | Kết quả | Bằng chứng |
|---|---|---|
| Phân nhóm theo bộ phận thật, hoặc nhóm trung tính | **Đạt.** Bác sĩ Thú y; Spa & Grooming (chờ xác nhận); Chăm sóc & Hỗ trợ vận hành (chờ xác nhận tên) | Mockup |
| Không có card VIP | **Đạt.** CDP đo 3 card bác sĩ: cùng nền `#fff`, cùng viền, cùng bóng, cùng 410×866 px, tiêu đề cùng 22.08 px | [a11y-interaction.txt](3a-design-qa-02-evidence/a11y-interaction.txt) |
| Không tự xếp bác sĩ trưởng lên đầu | **Đạt về hiển thị:** BS. Lê Thái Sơn ở vị trí #2. Nhưng cố định ở vị trí #2 vẫn là quyết định dựa trên chức vụ; Blueprint đã chuyển câu hỏi thứ tự cho chủ dự án (mục 9.2, Quyết định 2: A–Z hay theo danh sách) | Blueprint 9.2 |
| Card đồng đều | **Đạt về chiều rộng** ở mọi N và mọi viewport. Chiều cao bằng nhau trong một hàng; khác giữa các hàng (V-P3-5) | [team-grid-matrix.txt](3a-design-qa-02-evidence/team-grid-matrix.txt) |
| Không nhân đôi người kiêm nhiệm | **Đạt.** Một hồ sơ cho mỗi người; kiêm nhiệm hiển thị trong cùng card | Mockup |
| Không gộp bộ phận sai thực tế | **Đạt.** Spa & Grooming là section riêng, kể cả khi N = 1 | Mockup |
| Lưới khi N = 1, 2, 3, 5, 7 và nhiều hơn | **Đạt.** Desktop: N = 1 căn giữa (435/435); N = 2 căn giữa; N = 3 đủ hàng; N = 5 là 3 + 2 căn giữa; N = 7 là 3 + 2 + 2 hoặc 3 + 3 + 1 căn giữa; N = 8 là 3 + 3 + 2 căn giữa. Tablet 768: 2 cột, card lẻ căn giữa **cùng chiều rộng 348 px, không bị phóng to**. Mobile 375: 1 cột, 343 px | [team-grid-matrix.txt](3a-design-qa-02-evidence/team-grid-matrix.txt) |
| Bộ lọc dùng được bằng bàn phím và trình đọc màn hình | **Đạt.** Dùng `<button>` gốc; Enter kích hoạt được; nhóm khác bị ẩn bằng `hidden` (0 phần tử Tab tới được bên trong); `aria-pressed`; `role="status" aria-live="polite"` cập nhật nội dung | [a11y-interaction.txt](3a-design-qa-02-evidence/a11y-interaction.txt) |
| Không dùng quy trình chưa xác minh | **Đạt.** Section 2.4 đóng khung "Quy trình phối hợp đề xuất — Chờ Chủ dự án xác nhận", rút còn 3 bước; chỉ bước 01 dùng dữ liệu đã xác minh (giờ khám, hotline, cấp cứu 24/24) | [ảnh](3a-design-qa-02-evidence/screens/repaired-doi-ngu-1440.jpg) |
| Thứ bậc ngầm qua màu sắc hoặc mức nổi bật | **Không còn** về màu sắc và kích thước. Card BS. Lê Thái Sơn có chữ mô tả khác các card khác ("Hồ sơ có tên thật…") vì là ghi chú QA (V-P2-2) | |

## 5. Trang `/gioi-thieu`

- **Không tự khẳng định cam kết vận hành chưa xác minh.** Đạt. Bốn nguyên tắc nằm trong khung "Đề xuất nội dung — Chờ chủ dự án xác nhận quy trình thực tế", mỗi dòng kèm "[Chờ Chủ dự án xác nhận]".
- **Không dùng ảnh bác sĩ stock.** Đạt. Hero dùng `article-prevention.webp` (chó trong chăn len, ảnh AI); Section 4 dùng ảnh chó (xem AP-2 về logo).
- **Giữ art direction đã duyệt.** Đạt:
  - Hero 7/5 với khung bo góc AURA.
  - Dải metadata 3 cột kẻ chỉ.
  - Pull-quote Lora 600 có thanh viền trái.
  - Triptych 01–03 trên nền Lavender, ledger I–IV, hai card pathway và dải CTA Deep Plum.
  - Nhịp Ivory và Lavender rõ ràng ([ảnh 1440](3a-design-qa-02-evidence/screens/repaired-gioi-thieu-1440.jpg)).
- **Không dựng lịch sử, thành tựu hay tỷ lệ thành công.** Đạt. Slot "Lịch sử hình thành… Chờ chủ dự án cung cấp" ghi rõ không tự suy diễn năm thành lập hay số ca.

## 6. Trang `/co-so-vat-chat`

| Tiêu chí | Kết quả |
|---|---|
| Ảnh minh họa có nguồn và quyền sử dụng rõ ràng | **Chưa đạt** (AP-1, AP-2) |
| Nhãn hiển thị trực tiếp trên ảnh | **Đạt.** Mỗi ảnh có nhãn "Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn", có banner chính sách ảnh ở đầu trang, `alt` kèm "(ảnh minh họa)" |
| Không mô tả phòng, khu hay thiết bị chưa xác minh như sự thật | **Đạt.** Thiết bị dùng slot "[Thiết bị xét nghiệm — chờ xác minh]" và "[Thiết bị chẩn đoán hình ảnh — chờ xác minh]", **không có tên hãng**. "Không gian thực hiện Thủ thuật / Can thiệp điều trị" kèm "[Phân khu chức năng — chờ chủ dự án xác nhận]: Không tự khẳng định cơ sở có phòng phẫu thuật tách biệt" |
| Không còn "sạch khuẩn" | **Đạt.** H1 mới: "Không gian thăm khám sạch sẽ, bố trí rõ ràng…" (V-P3-4) |
| Không có ảnh bệnh nhân hay hồ sơ nhạy cảm | **Đạt** |
| **Điều kiện ảnh thật trước khi phát hành** | **Bắt buộc (gate).** Banner và Blueprint ghi rõ phải thay bằng ảnh thật tại 101 Khuất Duy Tiến đã được duyệt, tối thiểu 4 ảnh, trước khi công bố hoặc cho index. Điều kiện này giữ nguyên, **không đóng** |

## 7. Đối chiếu từng lỗi của QA 3A-01

| ID | Mức | Kết quả | Bằng chứng | Ảnh hưởng tới Design Approval |
|---|---|---|---|---|
| 3A-P1-1 | P1 | **FIXED** | Mục 3 | Không còn chặn |
| 3A-P1-2 | P1 | **FIXED** | Mục 3 | Không còn chặn |
| 3A-P2-1 | P2 | **FIXED** | `/gioi-thieu` Section 4 đóng khung "Đề xuất" | Không |
| 3A-P2-2 | P2 | **PARTIAL** | Không còn ảnh người mặc blouse; nhưng ảnh thay thế `why-pet-companion` có logo Champion (AP-2) | Cần xử lý AP-2 |
| 3A-P2-3 | P2 | **FIXED (chờ quyết định)** | BS. Lê Thái Sơn ở vị trí #2; quy tắc thứ tự chuyển cho chủ dự án (9.2, Quyết định 2) | Chủ dự án chọn A–Z hoặc theo danh sách |
| 3A-P2-4 | P2 | **FIXED** | Spa & Grooming là section riêng khi N = 1 | Không |
| 3A-P2-5 | P2 | **FIXED** | Ma trận đo thực tế (mục 4) | Không |
| 3A-P2-6 | P2 | **FIXED** | `hidden` kèm `aria-live`, kiểm bằng bàn phím | Không |
| 3A-P2-7 | P2 | **PARTIAL** (chờ giai đoạn code) | Blueprint 4.2 liệt kê 6 vị trí; chưa sửa vì chưa được chạm vào code | Không chặn duyệt thiết kế. Bắt buộc sửa khi code |
| 3A-P2-8 | P2 | **FIXED** | `/doi-ngu` Section 2.4 đóng khung "Đề xuất" | Không |
| 3A-P2-9 | P2 | **FIXED** | Banner gate về ảnh thật | Gate trước phát hành giữ nguyên |
| 3A-P2-10 | P2 | **FIXED** | Không còn "sạch khuẩn" | Không |
| 3A-P2-11 | P2 | **FIXED** | Slot trung tính, không tên hãng, không khẳng định phòng phẫu thuật | Không |
| 3A-P3-1 | P3 | **FIXED** | Dải CTA cuối trang đã rút gọn | Không |
| 3A-P3-2 | P3 | **FIXED** | Breadcrumb "Về Lê Sơn" là text tĩnh | Không |
| 3A-P3-3 | P3 | **FIXED** | Không còn line-clamp; chiều cao cân bằng trong hàng | Không |
| 3A-P3-4 | P3 | **FIXED** | Quy tắc ẩn khi `verified = false` | Không |
| 3A-P3-5 | P3 | **FIXED** | Quy tắc đồng ý về quyền riêng tư trong Blueprint mục 6 và 9.1 | Không |
| 3A-P3-6 | P3 | **FIXED** | Bảng tương phản (Blueprint 5.2) dùng số đã tính lại | Không |
| 3A-P3-7 | P3 | **FIXED** | Thanh công cụ có đủ 7 viewport. Tuy vậy, chế độ viewport của studio chỉ giới hạn `max-width`; **không có mốc 1024**. Claude đã kiểm thêm bằng viewport thật của trình duyệt | Không |
| 3A-P3-8 | P3 | **FIXED** | `alt` kèm "(ảnh minh họa)" | Không |
| 3A-P3-9 | P3 | **FIXED** | Trạng thái "PENDING OWNER DESIGN APPROVAL" | Không |

## 8. Visual QA: phương pháp và kết quả

**Phương pháp:**

- Mở mockup qua HTTP tĩnh bằng Chromium 153 (Playwright), với viewport thật **320, 375, 768, 1024, 1440, 1920** px kết hợp chế độ viewport của studio.
- Chụp toàn trang cho cả 3 trang ở mọi kích thước; đo tràn ngang, chữ bị cắt, ảnh méo, heading, font, vùng chạm và kích thước card.
- Do V-P1-1, phần đánh giá bố cục và typography thực hiện trên **bản phục hồi mã hóa** (đảo ngược Windows-1252 → UTF-8, không mất ký tự nào). Bản này nằm trong scratchpad của Claude, **không đưa vào repo**. File được bàn giao chỉ chụp làm bằng chứng lỗi.

| Kiểm tra (3 trang × 6 viewport) | Kết quả |
|---|---|
| Tràn ngang | **0 px** ở mọi trang và viewport |
| Chữ bị cắt (overflow hoặc ellipsis) | 0 |
| Ảnh lỗi hoặc méo | 0 |
| `h1` / thứ bậc heading | 1 `h1` mỗi trang; không nhảy bậc heading |
| Font thực tế | Be Vietnam Pro 400, 500, 600, 700, italic 400 thật; Lora 600; không có Lora italic. Font tải đúng qua đường dẫn tương đối `../../public/fonts/`. Sáu tham chiếu `file:///d:/webbvct/…` là đường dẫn máy cá nhân, trình duyệt chặn (vô hại nhưng nên xóa) |
| Cỡ chữ nhỏ nhất | 11.52 px (nhãn, badge) |
| Reduced motion | `prefers-reduced-motion: reduce` đưa transition và animation về 0 s (đã đo trên card) |
| Lỗi console | Chỉ có 6 lỗi chặn `file:///d:/…` font (xem trên) |
| Typography, nhịp editorial, khoảng trắng | Tốt. Lora 600 cho tiêu đề lớn rất cân đối; khoảng trắng rộng; Ivory, Lavender và Deep Plum xen kẽ; ảnh lớn bo góc AURA đồng nhất với trang chủ |
| Header, Footer, CTA | Nhất quán: CTA chính Plum, CTA hotline màu cam; mobile có thanh cố định Hotline và Đặt lịch. Mockup thiếu nút mở menu trên mobile (V-P3-1) |

Ảnh chụp: [/gioi-thieu 1440](3a-design-qa-02-evidence/screens/repaired-gioi-thieu-1440.jpg), [/gioi-thieu 375](3a-design-qa-02-evidence/screens/repaired-gioi-thieu-375.jpg), [/doi-ngu 1440](3a-design-qa-02-evidence/screens/repaired-doi-ngu-1440.jpg), [/doi-ngu 768](3a-design-qa-02-evidence/screens/repaired-doi-ngu-768.jpg), [/doi-ngu 375](3a-design-qa-02-evidence/screens/repaired-doi-ngu-375.jpg), [/co-so-vat-chat 1440](3a-design-qa-02-evidence/screens/repaired-co-so-vat-chat-1440.jpg), [/co-so-vat-chat 375](3a-design-qa-02-evidence/screens/repaired-co-so-vat-chat-375.jpg), [/co-so-vat-chat 320](3a-design-qa-02-evidence/screens/repaired-co-so-vat-chat-320.jpg).

Dữ liệu đo: [visual3a.json](3a-design-qa-02-evidence/visual3a.json).

## 9. Mốc 2B: điều kiện trước phát hành (không thay đổi, không tự đóng)

- Soft 404: **OPEN**
- LCP mobile (2B-08): **OPEN**
- Nguồn ảnh (2B-06): **PENDING**
- SEO Production: **chưa kiểm**
- **Mới: 2B-29 (P2):** ảnh trang chủ `why-pet-companion.webp` có logo Champion (AP-2). Claude đã bỏ sót lỗi này ở QA 2B-02 đến 2B-10

## 10. Việc tiếp theo

1. **Antigravity:**
   - Lưu lại mockup đúng UTF-8 (V-P1-1).
   - Thay ảnh có logo trong mockup (AP-2).
   - Bổ sung nguồn ảnh hoặc ghi "chưa xác minh" (AP-1).
   - Tách ghi chú QA khỏi nội dung trang (V-P2-2).
   - P3 tùy chọn.
2. **CEO:** giao việc xử lý 2B-29 cho trang chủ (ngoài phạm vi 3A).
3. **Chủ dự án:** chuẩn bị 5 quyết định ở Blueprint mục 9.2.
4. **Claude:** kiểm lại nhanh file mockup mới (mã hóa, ảnh, ghi chú) bằng cùng script; nếu đạt thì đề xuất chủ dự án duyệt.

Claude không sửa mã nguồn, không merge, không deploy.

**PHASE 3A DESIGN — PENDING OWNER APPROVAL**
