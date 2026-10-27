# Design QA 3A-03: retest có mục tiêu (Claude)

| Mục | Giá trị |
|---|---|
| Người kiểm tra | Claude (Independent QA Lead). Chỉ làm QA, không sửa code |
| Căn cứ | CEO Directive 019-B; `AGENTS.md`; [QA 3A-01](https://github.com/lqt140304-rgb/webchinhthuc/blob/claude/3a-design-qa-01/docs/qa/3a-design-qa-01.md); [QA 3A-02](https://github.com/lqt140304-rgb/webchinhthuc/blob/claude/3a-design-qa-02/docs/qa/3a-design-qa-02.md); `docs/qa/3a-design-handoff-03.md`. **Claude chưa nhận được văn bản CEO Directive 019-A** cũng như quyết định mới của chủ dự án |
| **Branch / commit** | `fix/milestone-2a-qa` @ **`2fc3387ceaa3f34c54d19f08abc37aed104a6788`** |
| Thay đổi so với `f6b689b` | Chỉ 3 file: `docs/design/phase-3a-interactive-mockups.html`, `docs/phase-3a-design-blueprint.md` (v2.2), `docs/qa/3a-design-handoff-03.md` |
| File được đánh giá | **Chính file `docs/design/phase-3a-interactive-mockups.html` trong commit `2fc3387`**, mở qua HTTP tĩnh bằng Chromium 153. **Không** dùng bản phục hồi trong scratchpad của QA 3A-02 |
| Ngày | 27/10/2026 |

## 1. Kết luận: **DESIGN FAIL** (vòng này). **Không đề xuất chủ dự án duyệt**

| Hạng mục | Kết luận |
|---|---|
| **V-P1-1** (UTF-8) | **FIXED** |
| **Visual QA** (bố cục, responsive, menu mobile, focus) | **PASS WITH FIXES**: xem được, đẹp, nhất quán |
| **Hai lỗi P1 cũ** | **3A-P1-1: không tái phát. 3A-P1-2: TÁI PHÁT (REGRESSED)** |
| **Content accuracy** | **FAIL.** Mockup lại trình bày cơ cấu nhân sự, chuyên khoa và phân khu hoặc thiết bị chưa xác minh **như sự thật** |
| Blueprint QA (v2.2) | PASS WITH FIXES. Blueprint **không** chứa các khẳng định nói trên, tức là **mockup và Blueprint không còn khớp nhau** |
| Accessibility | PASS WITH FIXES |
| Asset provenance | **PARTIAL.** Bảng kê minh bạch nhưng vẫn thiếu dữ liệu nguồn |
| Regression website | **Không có** thay đổi source; build giữ nguyên hash |

**Nguyên nhân chính:** khi xử lý V-P2-2 (gỡ ghi chú QA), vòng sửa đã gỡ luôn các khung "chờ xác minh", rồi điền nội dung tự soạn vào chỗ đó. Kết quả là lỗi danh tính và thông tin bệnh viện mà QA 3A-01 và 3A-02 đã đóng lại xuất hiện trở lại.

Directive 019-B mục 8 yêu cầu chỉ đề xuất trình chủ dự án khi "không còn P1" và "không có sai lệch danh tính hoặc thông tin bệnh viện nghiêm trọng". Vòng này **chưa đạt** điều kiện đó.

Phần visual đã đạt; chỉ cần khôi phục các slot trung tính (ước tính chỉ sửa text), sau đó Claude kiểm lại nhanh.

## 2. Lỗi P1

| ID | Mức | Trạng thái | Vấn đề | Bằng chứng | Đề xuất |
|---|---|---|---|---|---|
| **3A-P1-2** | **P1** | **REGRESSED (OPEN)** | Trang `/doi-ngu` lại ấn định **chuyên môn, nhiệm vụ và cơ cấu nhân sự chưa xác minh** (chi tiết ngay dưới bảng) | [ảnh card bác sĩ](3a-design-qa-03-evidence/screens/claim-doi-ngu-cards-1440.jpg), [toàn trang 1440](3a-design-qa-03-evidence/screens/doi-ngu-1440.jpg), [visible-claims-2fc3387.json](3a-design-qa-03-evidence/visible-claims-2fc3387.json) | Khôi phục slot trung tính như bản `f6b689b`: "[Chức danh — chờ xác minh]", "[Phạm vi công việc — chờ chủ dự án cung cấp]". Card BS. Lê Thái Sơn chỉ ghi tên và chức danh đã được chủ dự án xác nhận. Bỏ các dòng "Lĩnh vực" và "Nhiệm vụ" tự soạn |
| **V3-P1-1** | **P1** | **OPEN (mới)** | Trang `/co-so-vat-chat` mô tả **phân khu và thiết bị chưa xác minh như đã có thật** (chi tiết ngay dưới bảng). Trái với Directive 019-B mục 3 và 018-B mục V.3 ("không mô tả phòng, khu vực hoặc thiết bị chưa xác minh như sự thật") và với chính Blueprint v2.2 | [ảnh gallery](3a-design-qa-03-evidence/screens/claim-co-so-gallery-1440.jpg), [toàn trang 1440](3a-design-qa-03-evidence/screens/co-so-vat-chat-1440.jpg), [visible-claims-2fc3387.json](3a-design-qa-03-evidence/visible-claims-2fc3387.json) | Chỉ nêu tên phân khu chức năng của các dịch vụ đã xác nhận (tiếp đón, khám, nội trú 24/7, Spa & Grooming). Mọi mô tả về cách ly, hồi sức, thiết bị, phân luồng hay "kíp trực" phải để trong slot "chờ chủ dự án xác nhận" |

**Chi tiết 3A-P1-2: nội dung tự soạn trên trang `/doi-ngu`**

- **Card BS. Lê Thái Sơn (người thật):**
  - "Bác sĩ phụ trách hoạt động thăm khám lâm sàng, **hội chẩn** và định hướng phác đồ điều trị".
  - "**Lĩnh vực: Khám lâm sàng, Nội khoa & Ngoại khoa**".
- **Card bác sĩ #01:** "Phụ trách thăm khám tổng quát, **tư vấn dinh dưỡng và chăm sóc dự phòng**".
- **Card bác sĩ #03:** "Phụ trách **theo dõi điều trị nội trú, chăm sóc phục hồi**", và "Lĩnh vực: Khám nội trú & Theo dõi điều trị". Nghĩa là trang đã ngầm khẳng định có 3 bác sĩ với phân công khác nhau.
- **Spa & Grooming:** "Chức danh: Chuyên viên Grooming… theo dõi dấu hiệu da liễu ban đầu".
- **Bộ phận hỗ trợ:**
  - Có hẳn các vị trí "**Kỹ thuật viên Nội trú** — theo dõi chế độ ăn uống, thân nhiệt…" và "**Nhân viên Hỗ trợ** — điều phối lịch hẹn".
  - Mô tả bộ phận: "khử khuẩn khu lưu chuồng và hỗ trợ tiếp đón".
  - Ở bản `f6b689b`, tên bộ phận này còn là "[Chờ xác nhận tên bộ phận]".
- **Quy trình phối hợp:** "Quy trình phối hợp **khép kín**…", "Bác sĩ trực tiếp thăm khám, **chỉ định xét nghiệm**…", "bàn giao thông tin theo dõi giữa các **kíp trực**". Chỉ còn badge nhỏ "Bản thảo đề xuất quy trình"; các đánh dấu "[Đề xuất — Chờ chủ dự án xác nhận]" ở từng bước đã bị xóa.

**Chi tiết V3-P1-1: mô tả phân khu và thiết bị trên `/co-so-vat-chat`**

- "Không gian sảnh đón tiếp **thoáng đãng, phân luồng** tiếp nhận khám thường quy và cấp cứu".
- "Ô lưu chuồng và **khu vực hồi sức** theo dõi".
- "Khu vực lưu chuồng **cách ly**".
- "Phân khu chăm sóc vệ sinh da lông **tách biệt khỏi khu vực điều trị lâm sàng**".
- "Bồn tắm vệ sinh và bàn cắt tỉa tạo kiểu".
- "Thiết bị hỗ trợ theo dõi & chăm sóc: **Hệ thống đèn sưởi ấm, thiết bị theo dõi sinh hiệu**…". Câu này mâu thuẫn ngay với slot bên dưới, vốn ghi danh mục thiết bị "sẽ được công bố sau khi kiểm định".
- "gọi Hotline… để **kíp trực** chuẩn bị đón tiếp".

**3A-P1-1: không tái phát.** Trang `/doi-ngu` có **0 thẻ `<img>`**. Mọi chân dung đều là monogram ("BS", "LTS", "SG", "CS", "HT") trên khung 4:5 kèm nhãn "Khung ảnh chân dung — Đang cập nhật ảnh thực tế" ([menu-a11y.json](3a-design-qa-03-evidence/menu-a11y.json), mục `teamImgs`).

## 3. Retest V-P1-1: UTF-8

| Kiểm tra | Kết quả | Bằng chứng |
|---|---|---|
| Mã hóa | UTF-8, không BOM; decode strict thành công; `<meta charset="UTF-8">` | [encoding-check.txt](3a-design-qa-03-evidence/encoding-check.txt) |
| Dấu hiệu mojibake | Có 0 chuỗi lỗi thật. Máy quét bắt được 2 chữ "Â" nhưng đây là chữ đúng ("CÂU", "NHÂN") trong ghi chú và chú thích. Không có U+FFFD, không có "?" thay dấu, không có dấu tổ hợp rời | Như trên |
| Tiếng Việt trên ba trang | 1,829 ký tự có dấu trong phần chữ hiển thị. Tiêu đề, menu, CTA, chú thích, nhãn ảnh và footer đều đọc đúng trên trình duyệt ở mọi viewport | Ảnh chụp, mục 5 |
| Nội dung câu chữ có bị mất hay đổi nghĩa khi sửa mã hóa | **Không.** Các câu then chốt còn nguyên: H1 "Nơi sự cẩn trọng y khoa song hành cùng lòng thấu cảm.", "101 Khuất Duy Tiến, Thanh Xuân, Hà Nội", "097 355 51 05", "08:00 – 21:00", "Tiếp nhận cấp cứu 24/24", nhãn "Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn". Nội dung có thay đổi ở chỗ khác, nhưng đó là do chỉnh sửa có chủ ý (xem mục 2), không phải do lỗi mã hóa | [encoding-check.txt](3a-design-qa-03-evidence/encoding-check.txt) |
| Đường dẫn máy cá nhân `file:///d:/` | 0 (đã xóa) | Như trên |

**V-P1-1: FIXED.**

## 4. Retest các lỗi P2 và P3 của QA 3A-02

| ID | Trạng thái | Bằng chứng |
|---|---|---|
| **AP-1** Bảng nguồn ảnh | **PARTIAL** | Blueprint v2.2 mục 7 đã có bảng 11 cột, ghi đúng trạng thái: `article-prevention` "UNVERIFIED — tự khai AI", `article-nutrition` "UNVERIFIED — stock", production "KHÔNG". Nhưng **vẫn thiếu nguồn cụ thể**: chỉ ghi "Unsplash/Pexels mockup placeholder", "Chưa xác định tác giả gốc", "Giấy phép miễn phí nền tảng stock". Vị trí dùng ghi lệch: `article-prevention` thực tế là ảnh Hero `/gioi-thieu`, bảng ghi "Section 1.2" (mục 8) |
| **AP-2 / 2B-29** | **FIXED trong 3A; 2B-29 OPEN** | Mockup không còn tham chiếu `why-pet-companion.webp`; chỉ dùng `article-prevention`, `article-nutrition`, `logo`. Trang chủ: `src/components/sections/WhyChooseUs.tsx` **không bị sửa** (không có diff trong `src/`). 2B-29 đã có trong sổ rủi ro (Blueprint 9.1), chờ CEO giao việc |
| **V-P2-2** Ghi chú QA lẫn vào nội dung | **PARTIAL** | Đã gỡ mã QA ("3A-P1-1", "verified = false"…). Còn sót: bộ mô phỏng "N = 1 … N = 8" vẫn nằm trong nội dung trang `/doi-ngu`; vùng `aria-live` vẫn đọc "(các bộ phận khác đã ẩn bằng **thuộc tính hidden**)". **Quan trọng:** cách sửa đã gây ra 3A-P1-2 và V3-P1-1. Đúng ra phải giữ slot "chờ xác minh" trung tính, chỉ gỡ mã QA |
| V-P3-1 Menu mobile | **FIXED** | Nút hamburger 40×44 px, `aria-expanded` chuyển false → true, `aria-controls="p3a-mobile-drawer"`, nhãn "Menu điều hướng". Drawer có 6 mục. Phím Escape đóng drawer và trả focus về nút. Bấm "Đội ngũ" trong drawer chuyển đúng trang ([ảnh](3a-design-qa-03-evidence/screens/mobile-menu-open-375.jpg), [menu-a11y.json](3a-design-qa-03-evidence/menu-a11y.json)) |
| V-P3-2 Nhãn ảnh đè chữ | **FIXED** | Frame #04 không còn đè chữ ở 320 và 375 px ([320](3a-design-qa-03-evidence/screens/co-so-vat-chat-320.jpg)) |
| V-P3-3 Focus và breadcrumb | **FIXED** | Focus `2px solid` màu plum, offset 2 px, trên nút menu, CTA và link khi Tab. Breadcrumb "Trang chủ" cao 44 px. Còn một phần tử của thanh công cụ studio có `outline: none` (công cụ review, không thuộc trang) |
| V-P3-4 H1 Cơ sở vật chất | **FIXED** | "Không gian thăm khám và quy hoạch các phân khu chức năng." Nhưng phần thân trang đã phát sinh V3-P1-1 |
| V-P3-5 Chiều cao card | **FIXED trong hàng** | 0 hàng có card lệch chiều rộng hoặc chiều cao, ở mọi N và viewport 375–1440. Giữa các hàng vẫn khác nhau (809 / 782 px), chấp nhận được ([team-grid-matrix.txt](3a-design-qa-03-evidence/team-grid-matrix.txt)) |
| 3A-P2-1 (từ 3A-01) Nguyên tắc phục vụ | **PARTIAL (thoái lui)** | Section vẫn có badge "Bản thảo đề xuất định hướng chăm sóc". Nhưng các đánh dấu "[Chờ Chủ dự án xác nhận]" ở từng dòng đã bị xóa, và câu chữ trở thành khẳng định: "Khu vực lưu trú **được vệ sinh định kỳ** và cập nhật tình hình sức khỏe thường xuyên", "Thông tin bệnh án… **chỉ chia sẻ trực tiếp** cho đúng chủ nuôi". Mức **P2** |
| 3A-P2-8 (từ 3A-01) Quy trình phối hợp | **PARTIAL (thoái lui)** | Như mục 2 ("khép kín", "kíp trực"); chỉ còn badge "Bản thảo". Gộp vào 3A-P1-2 |
| 3A-P2-11 (từ 3A-01) Thiết bị và phòng | **REGRESSED** | Gộp vào V3-P1-1 |

## 5. Visual QA trên file bàn giao

**Phương pháp:** dùng viewport thật của trình duyệt, kết hợp chế độ viewport tương ứng của studio (mốc 1024 đã được bổ sung), cho 3 trang × 6 viewport. Chụp toàn trang và đo bằng script ([visual3a.json](3a-design-qa-03-evidence/visual3a.json)).

| Kiểm tra | Kết quả |
|---|---|
| Tràn ngang | **0 px** ở cả 18 tổ hợp |
| Chữ bị cắt, ảnh méo, ảnh lỗi | 0 / 0 / 0 |
| `h1` và heading | 1 `h1` mỗi trang; không nhảy bậc heading |
| Font | Be Vietnam Pro 400, 500, 600, 700, italic 400 thật; Lora 600; không có Lora italic |
| Crop ảnh | Ảnh `object-fit: cover` không méo; nhãn ảnh nằm gọn trong khung |
| Thứ bậc thị giác, khoảng trắng, nhịp editorial | Tốt và nhất quán với trang chủ: Hero 7/5, dải metadata, pull-quote, triptych 01–03, ledger I–IV, dải CTA Deep Plum |
| Menu mobile, CTA | Đạt (mục 4). Ở 375 px, nút "Đặt lịch khám" trên header xuống 2 dòng, và dòng "BỆNH VIỆN THÚ Y" dưới logo cũng xuống dòng (V3-P3-1) |
| Keyboard focus | Đạt (mục 4) |
| Reduced motion | `transition-duration` về 0 s khi `prefers-reduced-motion: reduce` |
| Card nhân sự | Đồng chiều rộng ở mọi N (1, 2, 3, 5, 7, 8) và mọi viewport. Hàng cuối căn giữa, card lẻ không bị phóng to |
| Không có card VIP | Đạt về hình thức: 3 card bác sĩ cùng nền, viền, bóng, kích thước 410×809 px, heading 22.08 px cùng màu. **Nhưng** card BS. Lê Thái Sơn là card duy nhất có chức danh và mô tả chuyên môn đầy đủ, trong khi các card khác là placeholder. Đây là mức nổi bật về nội dung, thuộc 3A-P1-2 |

Ảnh chụp: [/gioi-thieu 1440](3a-design-qa-03-evidence/screens/gioi-thieu-1440.jpg), [/gioi-thieu 768](3a-design-qa-03-evidence/screens/gioi-thieu-768.jpg), [/gioi-thieu 375](3a-design-qa-03-evidence/screens/gioi-thieu-375.jpg), [/doi-ngu 1920](3a-design-qa-03-evidence/screens/doi-ngu-1920.jpg), [/doi-ngu 1440](3a-design-qa-03-evidence/screens/doi-ngu-1440.jpg), [/doi-ngu 1024](3a-design-qa-03-evidence/screens/doi-ngu-1024.jpg), [/doi-ngu 375](3a-design-qa-03-evidence/screens/doi-ngu-375.jpg), [/co-so-vat-chat 1440](3a-design-qa-03-evidence/screens/co-so-vat-chat-1440.jpg), [/co-so-vat-chat 375](3a-design-qa-03-evidence/screens/co-so-vat-chat-375.jpg), [/co-so-vat-chat 320](3a-design-qa-03-evidence/screens/co-so-vat-chat-320.jpg).

**Lỗi P3 mới:**

| ID | Mức | Vấn đề | Đề xuất |
|---|---|---|---|
| V3-P3-1 | P3 | Header ở 375 px chật: nút CTA xuống 2 dòng, dòng phụ dưới logo xuống dòng | Rút gọn CTA trên mobile (ví dụ "Đặt lịch") hoặc ẩn dòng phụ dưới logo ở ≤ 390 px |
| V3-P3-2 | P3 | Bộ mô phỏng "N = …" và câu thông báo "thuộc tính hidden" nằm trong nội dung trang | Chuyển bộ mô phỏng lên thanh công cụ studio; viết lại câu thông báo cho người dùng thật ("Đang hiển thị: Bộ phận Bác sĩ Thú y") |
| V3-P3-3 | P3 | Blueprint mục 9.1 lặp nguyên đoạn R-3A-05/2B-29 hai lần; bảng nguồn ảnh ghi sai vị trí dùng của `article-prevention` | Sửa lại tài liệu |

## 6. Bảng tài sản hình ảnh

| Tài sản | Nguồn | Tác giả | Quyền sử dụng | Trạng thái xác minh | Dùng trên Preview | Dùng trên Production | Còn thiếu |
|---|---|---|---|---|---|---|---|
| `logo.png` | Chủ dự án cung cấp | Bệnh viện Thú y Lê Sơn | Sở hữu nội bộ | Đã xác minh (theo xác nhận của chủ dự án) | Có | Có | |
| 6 file WOFF2 (Be Vietnam Pro, Lora) | Google Fonts OFL | "The … Project Authors" (theo metadata font). Tên cá nhân trong bảng **chưa được Claude kiểm** | SIL OFL 1.1 (`docs/licenses/`) | Đã xác minh (metadata và giấy phép, QA 2B-05/06) | Có | Có | |
| Monogram và SVG nội tuyến | Antigravity tự vẽ trong mockup | Dự án | Nội bộ | Chấp nhận | Có | Có | |
| `article-prevention.webp` | AI (Google Imagen 3), nguồn **tự khai** | Antigravity | Điều khoản Google Generative AI (chưa được chủ dự án kiểm) | **CHƯA XÁC MINH** | Có, kèm nhãn | **Không** | Log hoặc prompt tạo ảnh; xác nhận điều khoản sử dụng thương mại |
| `article-nutrition.webp` | Stock, "Unsplash/Pexels" không rõ | **Không rõ** | **Không rõ** | **CHƯA XÁC MINH** | Có, kèm nhãn | **Không** | URL gốc, tác giả, giấy phép |
| `why-pet-companion.webp` | Stock không rõ, **có logo Champion** | Không rõ | Không rõ | **CHƯA XÁC MINH**, kèm logo bên thứ ba | Không dùng ở 3A | **Không** | Thay ảnh trên trang chủ (**2B-29**, cần CEO giao việc riêng) |

Mockup được phép dùng placeholder trung tính. **Điều kiện về nguồn ảnh trước phát hành (2B-06) giữ nguyên.** Kết luận nguồn ảnh: **chưa đạt** cho production.

## 7. Regression website

| Kiểm tra | Kết quả |
|---|---|
| Source website (`src/`, `public/`, `index.html`) | **Không đổi** (`git diff f6b689b 2fc3387` chỉ có 3 file trong `docs/`) |
| Sáu section trang chủ, Routing, RootLayout | Không đổi (không có diff trong `src/`) |
| Build config (`vite.config.ts`, `tsconfig*`, `package*.json`, `vercel.json`) | Không đổi |
| Build | Hash vẫn là CSS `ca6de747…` và JS `10f187c6…` ([build-hash-2fc3387.txt](3a-design-qa-03-evidence/build-hash-2fc3387.txt)) |
| Merge vào `main` | Không. `origin/main` vẫn ở `d2a19c5` |
| Deployment mới do vòng thiết kế | **Chưa xác minh được trong phiên này** (không có `VERCEL_TOKEN`). Thay đổi chỉ nằm trong `docs/`, và báo cáo bàn giao không nhắc tới deployment. Nếu cần xác nhận chắc chắn, dùng lại API addendum của QA 2B-10 |

**Điều kiện Mốc 2B giữ nguyên:**

- Soft 404: OPEN
- LCP mobile (2B-08): OPEN
- Nguồn ảnh (2B-06): PENDING
- SEO Production: chưa kiểm
- 2B-29 (logo Champion): OPEN

## 8. Đề xuất về duyệt thiết kế

**Chưa đề xuất trình chủ dự án duyệt.** Để đạt ở vòng sau, Antigravity cần:

1. **Khôi phục slot trung tính** cho mọi thông tin về nhân sự (`/doi-ngu`), nguyên tắc phục vụ (`/gioi-thieu`), phân khu và thiết bị (`/co-so-vat-chat`). Giữ nguyên phần visual đã đạt; chỉ thay text.
2. **Đồng bộ mockup với Blueprint v2.2.** Blueprint hiện không có các khẳng định trên, nên lấy Blueprint làm chuẩn.
3. Xử lý V3-P3-1 và V3-P3-2 (tùy chọn), cùng phần còn thiếu của AP-1.

Claude sẽ kiểm lại bằng cùng bộ script (mã hóa, `visible-claims`, ma trận lưới, menu và a11y, visual 6 viewport).

Claude không tự duyệt thiết kế, không sửa mã nguồn, không merge, không deploy.

**PHASE 3A DESIGN — PENDING OWNER APPROVAL**
