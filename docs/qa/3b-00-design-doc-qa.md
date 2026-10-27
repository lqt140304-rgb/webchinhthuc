# PHASE 3B-00 — INDEPENDENT DESIGN DOCUMENT QA

| Mục | Chi tiết |
|---|---|
| Căn cứ | CEO Directive 038-B; `AGENTS.md` (Architecture Baseline V1); `src/styles/tokens.css`; Blueprint 3A; `docs/qa/3a-preview-fix01-qa.md` |
| Agent | Claude — Independent QA Lead (read-only, documentation review) |
| Ngày | 28/10/2026 |
| Nhánh kiểm tra | `docs/phase-3b-00` |
| Commit kiểm tra | `f8a85f1ce0fd28e3d7bb7dc8deb618c8aac1e0f4`: "docs(phase-3b): complete Phase 3B-00 documentation, blueprint, content mapping, data schema & wireframes" |
| Baseline code 3A | `4739d45cc95100b587381b6bdcad6935352b23e8` (tổ tiên trực tiếp; giữa hai commit chỉ có `72efb92` thêm handoff 3A) |
| Tài liệu đã đọc toàn văn | `docs/phase-3b/3b-00-blueprint.md`, `3b-00-content-mapping.md`, `3b-00-data-schema.md`, `3b-00-wireframe.md`, `3b-00-acceptance-criteria.md` |
| Đối chiếu code thực tế | `src/components/layout/Header.tsx`, `Footer.tsx`, `src/app/routes.tsx`, `src/components/sections/FeaturedServices.tsx`, `src/pages/BookingPage.tsx`, `src/styles/tokens.css` tại `4739d45` |
| Bằng chứng | `docs/qa/3b-00-design-doc-qa-evidence/` (diff stat, grep claim kèm số dòng) |

## Kết luận: **FAIL**

- **Phạm vi và source integrity: ĐẠT.**
  - Chỉ thêm 5 file trong `docs/phase-3b/`; 0 file ngoài `docs/`.
  - Không có deployment mới, chưa merge `main`.
  - Có khóa `/dich-vu/:slug`.
  - Price Lock đúng: không có giá công khai, thiếu giá không thành 0, FIXED/RANGE bắt buộc VERIFIED.
- **Content Integrity: FAIL, có 3 lỗi P1:**
  - Tài liệu gán chuyên môn và nhiệm vụ cho BS. Lê Thái Sơn.
  - Các claim phân khu, kíp trực và thiết bị **đã bị loại ở Giai đoạn 3A** xuất hiện lại.
  - Nhiều claim y khoa và cam kết vận hành bị nâng lên **VERIFIED mà không có bằng chứng**. Một số ghi nguồn sai sự thật, ví dụ "Cơ sở vật chất 3A đã duyệt" cho "phân khu cách ly".
- **Các lỗi P2:**
  - Taxonomy danh mục và slug không nhất quán giữa 5 tài liệu.
  - Data Schema thiếu trường nguồn và người xác minh.
  - Fixture TEST ONLY chứa claim bịa.
  - Có phụ thuộc ngoài phạm vi chưa khai báo (`/dat-lich?service=`, Header, Footer, trang chủ).
  - Acceptance Criteria tự chấm "ĐẠT" và thiếu cấp code QA.
- **Khuyến nghị:** không đề xuất nghiệm thu 3B-00 ở vòng này. Mọi lỗi đều sửa được bằng tài liệu (xem mục 12).

---

## 1. Branch và commit

- `origin/docs/phase-3b-00` @ `f8a85f1` (cha `72efb92`, ông `4739d45`). `origin/main` vẫn @ `d2a19c5`.
- File thay đổi so với `4739d45` (`diff-stat-4739d45-f8a85f1.txt`):
  - 5 file mới trong `docs/phase-3b/` (1,292 dòng).
  - `docs/qa/3a-preview-fix01-handoff.md` (commit `72efb92` của 3A).
- **Không có** handoff 3B-00 riêng hoặc danh sách OPEN DECISIONS độc lập. Quyết định chỉ nằm ở Blueprint §7 (3 mục).
- Mã hóa: 5 file đều UTF-8 không BOM, LF, 0 U+FFFD, 0 mojibake, 0 `file:///`.

## 2. Scope compliance

| Tiêu chí | Kết quả |
|---|---|
| Chỉ 2 route `/dich-vu`, `/bang-gia` | **Đạt** (Blueprint §1.1) |
| Không có `/dich-vu/:slug` | **Đạt về đặc tả** (Blueprint §1.1, AC Gate 2). Lưu ý: code hiện có 4 route con tĩnh `/dich-vu/kham-dieu-tri`, `/noi-tru`, `/spa`, `/cap-cuu` (ComingSoon), được Header, Footer và FeaturedServices trỏ tới. Tài liệu chỉ nêu ở dạng quyết định 3B-DEC-02, chưa mô tả tác động (xem 3B00-P2-4) |
| Không mở Dashboard, backend, 3B code | **Đạt.** Data Schema §5 có định hướng Giai đoạn 4 (API, `/quan-ly/dich-vu`) nhưng ghi rõ chỉ là định hướng |
| Không thay đổi RootLayout | **Đạt về chủ đích.** Wireframe vẽ Header CTA "ĐẶT KHÁM" và Bottom Bar "GỌI HOTLINE / ĐĂNG KÝ KHÁM NGAY", khác component hiện tại ("Đặt lịch"; "Cấp cứu 24/24 / Đặt lịch khám"). Cần ghi rõ là không đổi (P3) |
| Không tạo Design System mới | **Đạt phần lớn.** Dùng token có sẵn (`--color-status-*` đã có trong `tokens.css`). Nhưng Data Schema §3 dùng class palette Tailwind (`bg-purple-100`, `bg-amber-100 text-amber-900`) và Blueprint §3 dùng `from-amber-50 to-orange-50` thay vì token (P3) |
| Không yêu cầu deploy / Production | **Đạt** |
| Không sửa source | **Đạt** (mục 9) |

## 3. Blueprint QA (từng trang)

### `/dich-vu`

| Hạng mục | Đánh giá |
|---|---|
| Route mapping / Navigation | Hợp lý: jump bar 5 anchor, link chéo sang `/bang-gia?cat=…`. **Lệch slug** với `/bang-gia` (3B00-P2-1). Anchor `#spa-grooming` khác URL Header hiện tại `/dich-vu/spa` |
| Header / Footer | Kế thừa. Việc đổi link Header, Footer và FeaturedServices sang anchor là thay đổi code Mốc 2B, chưa được nêu là phạm vi DEV (3B00-P2-4) |
| CTA đặt lịch | `/dat-lich?service=…`. **BookingPage hiện không đọc query param** và giá trị `serviceType` (`kham-dieu-tri`…) khác slug dịch vụ (`kham-tong-quat`) (3B00-P2-4) |
| Component reuse | Tốt: `EditorialDarkCTA`, `EditorialPhotoFrame`, `EditorialSlotBox`, Triptych, `PageLoadingFallback` |
| Vibrant Editorial Luxury, Lora/Be Vietnam Pro, tokens | Đúng định hướng; Lora 600 chữ đứng; màu dùng token |
| Responsive / a11y / CLS | Có đặc tả. Jump bar `sticky top-[73px]` chỉ đúng với header mobile; header ≥ 768 px cao 81 px (P3) |
| **Nội dung** | **FAIL**: mục 4 (3B00-P1-1, P1-2, P1-3) |

### `/bang-gia`

| Hạng mục | Đánh giá |
|---|---|
| Cấu trúc | Hợp lý: heading + banner chính sách, toolbar tìm kiếm và tab, accordion, quy trình 3 bước, CTA |
| Price Lock | **Tốt**: không có giá công khai; 4 trạng thái; UNAVAILABLE/CONTACT bắt buộc `null`; FIXED/RANGE chỉ hiển thị khi VERIFIED |
| Tìm kiếm / lọc / empty state / deep link | Đặc tả chi tiết: bỏ dấu tiếng Việt, AND logic, empty state cao 240 px, `?cat=&q=` |
| Accordion a11y | Theo WAI-ARIA (`aria-expanded`, `aria-controls`; Enter/Space/Arrow/Home/End) |
| CLS | 4 quy tắc (danh sách `min-h-[400px]`, accordion `grid-rows`, toolbar `h-12`, empty state giữ chỗ) |
| **Nội dung** | **FAIL**: banner "Nội dung xác minh" và cam kết chi phí (3B00-P1-3) |

## 4. Content Integrity: **FAIL**

### 3B00-P1-1: Gán chuyên môn và nhiệm vụ cho BS. Lê Thái Sơn (tái phát dạng 3A-P1-2)

| Vị trí | Nội dung |
|---|---|
| Blueprint dòng 159 | "*Phẫu thuật ngoại khoa mô mềm & triệt sản an toàn.* **[VERIFIED — Bác sĩ Sơn phụ trách]**" |
| Content Mapping dòng 49 (`DV-GRP1-05`) | Nguồn "Chuyên môn BS. Lê Thái Sơn", trạng thái **VERIFIED** |
| Wireframe dòng 66 | "**BS. Lê Thái Sơn phụ trách phẫu thuật ngoại khoa và phác đồ điều trị lâm sàng chính quy.**" (không có nhãn chờ) |
| Data Schema dòng 220 (fixture) | "Thực hiện bởi BS. Lê Thái Sơn với hệ thống máy gây mê bay hơi và khử khuẩn áp lực dương." |

Ở 3A, chỉ **họ tên** BS. Lê Thái Sơn là VERIFIED; chức danh, chuyên môn và phạm vi phụ trách đều PENDING (`docs/qa/3a-preview-fix01-qa.md` §10). Blueprint §6 của chính tài liệu này cũng ghi "Chức danh/bằng cấp giữ ở mức PENDING". Không có bằng chứng nào cho việc BS. Sơn phụ trách phẫu thuật.

### 3B00-P1-2: Claim phân khu, kíp trực và thiết bị đã bị loại ở 3A xuất hiện lại (tái phát V3-P1-1)

| Vị trí | Nội dung |
|---|---|
| Blueprint dòng 183 | "*Phân khu **cách ly**:* Khu nội trú bệnh truyền nhiễm **tách biệt** tuyệt đối khỏi khu **hồi sức** sau mổ…" |
| Content Mapping dòng 59 (`DV-GRP3-02`) | "Phân khu cách ly lây nhiễm nghiêm ngặt", nguồn "**Cơ sở vật chất 3A đã duyệt**", **VERIFIED**. **Sai sự thật**: 3A đã gỡ chính claim này (V3-P1-1); trang `/co-so-vat-chat` hiện là slot "[Phân khu chức năng — Chờ Chủ dự án xác nhận]" |
| Blueprint dòng 184; Wireframe dòng 85, 160 | "Đội ngũ **trực đêm** theo dõi **sinh hiệu**, hỗ trợ truyền dịch…"; "**Bác sĩ & điều dưỡng trực đêm**…" (wireframe không có nhãn) |
| Blueprint dòng 134; Mapping dòng 42 (`DV-HERO-04` **VERIFIED**) | "môi trường **khử khuẩn** an toàn" |
| Blueprint dòng 173; Wireframe dòng 77–79, 151, 246; Mapping dòng 53 (`DV-GRP2-01` **VERIFIED**, nguồn "Năng lực chẩn đoán hình ảnh") | Tên nhóm "Chẩn đoán cận lâm sàng", thiết bị **X-quang kỹ thuật số / Siêu âm**. Ở 3A, thiết bị cận lâm sàng là slot "Chờ xác nhận" |
| Data Schema dòng 219–220 (fixture) | "phòng mổ vô trùng", "máy gây mê bay hơi", "khử khuẩn áp lực dương" |

### 3B00-P1-3: Claim y khoa và cam kết bị nâng lên VERIFIED không có bằng chứng; wireframe hiển thị PENDING như sự thật

| Vị trí | Vấn đề |
|---|---|
| Blueprint dòng 154; Wireframe dòng 59, 137 | Tiêu đề "…và **điều trị tận gốc**": hứa hẹn kết quả điều trị, trái chính Blueprint §6 ("Không đưa ra tuyên bố tuyệt đối") |
| Mapping dòng 45, 58, 63, 68; Blueprint dòng 339 | "4 nhóm dịch vụ VERIFIED — **Homepage Section 3 đã nghiệm thu**". `FeaturedServices.tsx` chỉ có **3** dịch vụ (Khám & Điều trị, Nội trú 24/7, Spa & Grooming) và dải cấp cứu. **Không có nhóm "Cận lâm sàng"** |
| Mapping dòng 48 (`DV-GRP1-04`) | Tiêm phòng vaccine **VERIFIED**, nguồn "Dịch vụ cơ bản của bệnh viện" (không có văn bản) |
| Mapping dòng 69, 71 (`DV-EMG-02`, `DV-NOTE-01`) | Dấu hiệu cấp cứu và "**nhịn ăn 6–8 h**" **VERIFIED** bởi "BS. Lê Thái Sơn", nguồn "Khuyến cáo y khoa quốc tế". Đây là lời khuyên y khoa; chưa có xác nhận của bác sĩ |
| Mapping dòng 87, 108; Blueprint dòng 253, 301 | "không chi phí ẩn", "**Không phát sinh chi phí ngoài dự toán**", "cam kết thông báo rõ ràng mọi chi phí dự kiến": cam kết vận hành **VERIFIED** không có nguồn |
| Blueprint dòng 257–260; Mapping dòng 88 (`BG-HEAD-05` VERIFIED); Wireframe dòng 218 | Banner ghi "**Nội dung xác minh**", gồm "phụ phí ngoài giờ… theo quy chế phòng khám". **Mâu thuẫn** với Blueprint dòng 353 (3B-DEC-03 vẫn chờ quyết định) và Mapping dòng 94, 121 (phụ phí "chờ phê duyệt") |
| Wireframe dòng 61–70, 84–86, 146–163, 225, 244 | Mapping ghi PENDING cho phác đồ, xét nghiệm, quy chuẩn nội trú, gói spa, nhưng **wireframe hiển thị không có nhãn `[Đề xuất]`/`[Chờ…]`**, ví dụ "Phân tích 18 chỉ số máu", "Tắm trị liệu da liễu kê đơn". Trái chính quy tắc Mapping §1.2 |
| Wireframe dòng 358 | "Biểu phí… đang được **hội đồng chuyên môn** đối chiếu": tự đặt ra một tổ chức |
| Toàn bộ Mapping | Cột "Chủ thể xác minh" ghi "Chủ dự án" hoặc "BS. Lê Thái Sơn" cho các dòng VERIFIED, nhưng **không có ngày, văn bản hay đường dẫn bằng chứng** |

Các điểm đạt:

- Ảnh minh họa có nhãn; cấm ảnh người mặc blouse.
- Thông tin liên hệ (địa chỉ, hotline, giờ, 24/24) VERIFIED, khớp với các mốc trước.
- Danh sách 15 dòng bảng giá đều PENDING, giá UNAVAILABLE hoặc CONTACT.
- Mapping §4 liệt kê điều kiện Production.

## 5. Data Schema

| Kiểm tra | Kết quả |
|---|---|
| Khóa định danh | Có: `cat-[slug]`, `srv-[slug]`, `prc-[serviceId]-[unit]`. Lưu ý `prc-srv-…` lặp tiền tố, và 1 dịch vụ nhiều giá cùng `unit` sẽ trùng khóa |
| Liên kết | `Service.categoryId → ServiceCategory.id`; `ServicePrice.serviceId → Service.id` (1:N) |
| Thiếu giá ≠ 0 | **Đạt**: UNAVAILABLE/CONTACT bắt buộc `amount/rangeMin/rangeMax = null`; cấm `amount = 0` |
| Không giá mẫu công khai | **Đạt**: fixture đều `null`, có nhãn TEST ONLY, đặt ở `tests/fixtures/` và ghi "không import vào production bundle" |
| FIXED/RANGE/CONTACT/UNAVAILABLE | Nhất quán; FIXED/RANGE bắt buộc `verificationStatus = VERIFIED`; RANGE yêu cầu `rangeMin < rangeMax` |
| Quy tắc xác minh và công bố | **Thiếu**: không có quy tắc giữa `Service.verificationStatus = PENDING` và `isPublished`. Fixture có `PENDING` + `isPublished: true` nhưng không nói UI phải gắn nhãn chờ |
| Thời gian và **nguồn** | Có `effectiveDate`, `updatedAt`. **Không có trường nguồn hay người xác minh** (`verifiedBy`, `verifiedAt`, `evidenceRef`) cho Category, Service, Price, trong khi 038-B yêu cầu "có cập nhật thời gian và nguồn" |
| `effectiveDate` | Bắt buộc cả khi UNAVAILABLE; fixture dùng ngày giả `2026-11-01` |
| Nhất quán nội bộ | ER ghi `int amount` (không null) và `verificationStatus` có `ILLUSTRATIVE`; bảng ghi `number \| null` và chỉ `VERIFIED \| PENDING`. Đơn vị `Mẫu`, `Phim` (wireframe) không có trong danh sách `unit` |
| Đa mức giá | Không có trường phân tầng (loài, cân nặng) dù Mapping §4 nêu "<5 kg, 5–10 kg…" và có các dòng "Chó theo cân nặng" |
| Edge case | Dịch vụ chưa xác minh / có tên chưa có giá / giá chờ / FIXED / RANGE: có quy tắc. **Tên dài:** chỉ có giới hạn 150 ký tự, chưa có quy tắc hiển thị (wrap, truncate). **Danh mục trống:** chưa đặc tả (ẩn tab? hiện tab "(0)"?). **Không kết quả:** có (Wireframe §5.4) |
| Fixture | **Chứa claim bịa** (3B00-P2-3) |
| Mức phức tạp | Phù hợp 3B (3 thực thể, dữ liệu tĩnh). Phần API Giai đoạn 4 không ảnh hưởng 3B |

## 6. Wireframe và UX (đánh giá đặc tả, **chưa có render**)

Đây là đặc tả văn bản. Claude **không** kết luận responsive thực tế đã PASS.

| Hạng mục | Đánh giá |
|---|---|
| 6 viewport | Có bảng lưới 320–1920 và bản vẽ desktop và mobile cho 2 trang. 768/1024 chỉ mô tả trong bảng, không có bản vẽ riêng |
| `/dich-vu` gọn gàng | Bố cục hợp lý, nhưng 6 section kèm danh sách dài; nội dung cần làm lại theo mục 4 |
| `/bang-gia` tối ưu tra cứu | Tốt: search, tab có số đếm, accordion nhiều dòng, nút "Mở hoặc thu gọn tất cả" |
| Trạng thái tương tác | Active/inactive tab; accordion expanded/collapsed; empty state. **Thiếu loading/error** (dữ liệu tĩnh thì nên ghi rõ "không áp dụng") |
| Tìm kiếm | Đặc tả đủ (trường, bỏ dấu, AND, deep link). Lỗi nhỏ: `?q=sieu-am` dùng gạch nối, cần nói rõ có đổi `-` thành khoảng trắng; placeholder mobile "Tìm tên dịch vụ, giá…" nhưng không tìm theo giá |
| Touch target | Ma trận đủ. Mâu thuẫn: tab "Auto × 38 px" nhưng lại nói "≥ 44 px" |
| Focus / bàn phím / reduced motion | Có đặc tả; reduced motion tắt transition và scroll mượt |
| Layout shift | Có quy tắc. Lưu ý: tự mở dòng đầu khi lọc sẽ đổi chiều cao danh sách; vẫn trong container `min-h`, cần đo khi code |
| Số liệu | Tab ghi "Tất cả (24)", "Khám (5)", "XN (6)", "Phẫu thuật (4)" (dòng 225, 292) nhưng Mapping chỉ có **15** dịch vụ |
| ARIA | Mỗi nhóm `role=region` và mỗi panel cũng `role=region`: quá nhiều landmark khi có 15–24 dòng. Nên bỏ `role=region` ở panel |

## 7. Acceptance Criteria

| Kiểm tra | Kết quả |
|---|---|
| Cụ thể, kiểm thử được | 15 gate phần lớn có phương pháp (Playwright, PerformanceObserver, header test) |
| Ngưỡng PASS/FAIL | Có cho CLS ≤ 0.10, 44 × 44, overflow 0. **Thiếu ngưỡng** cho Gate 12 ("không tải thư viện nặng": cần ngưỡng kB hoặc danh sách chunk), Lighthouse/LCP, lỗi console, a11y (axe) |
| **Tự chấm "ĐẠT"** | Cột "Đánh giá 3B-00" ghi **ĐẠT cho cả 15 gate**, kể cả Gate 4 ("Không khẳng định claim PENDING là sự thật"), vốn đang vi phạm (mục 4), và Gate 8, 9, 11, 13, 15, vốn chỉ kiểm được khi có code hoặc Preview. Tác giả không được tự chấm; cột này nên đổi thành "Áp dụng ở: Design / Code / Preview / Production" |
| Phân cấp nghiệm thu | Chỉ có **Cấp A (tài liệu)** và **Cấp B (Production)**. **Thiếu cấp Code/Preview QA** (DEV-01, Preview) như yêu cầu 038-B |
| Gate còn thiếu | Danh sách cụm từ bị cấm (kế thừa 3A); độ phủ Content Mapping (mỗi claim hiển thị phải có Content ID); kịch bản search (bỏ dấu, AND, empty, deep link); kiểm tra fixture TEST ONLY không vào bundle; ràng buộc schema (FIXED ⇒ VERIFIED, không `0`); `/dat-lich?service=` hoạt động |
| Không phụ thuộc dữ liệu chưa xác minh | Đạt: gate dựa trên trạng thái placeholder |
| Backlog | Liệt kê đúng các mục mở. Câu "2B-08 đã có giải pháp preload…" nên ghi là OPEN, không khẳng định đã có giải pháp |

## 8. Documentation consistency

| ID | Mâu thuẫn |
|---|---|
| **3B00-P2-1** | **Taxonomy và slug.** Có 4 bộ slug khác nhau giữa các tài liệu: (1) `/dich-vu` dùng anchor `kham-dieu-tri`, `can-lam-sang`, `noi-tru`, `spa-grooming`, `cap-cuu`; (2) tab `/bang-gia` dùng `kham-thu-thuat`, `xet-nghiem`, `phau-thuat`, `noi-tru`, `spa` (5 nhóm, có "Phẫu thuật" riêng); (3) link chéo `?cat=kham-dieu-tri` không tồn tại ở `/bang-gia`; (4) Schema dùng `kham-dieu-tri`, `xet-nghiem`, `noi-tru`, `spa`, và fixture xếp phẫu thuật vào `cat-kham-dieu-tri` |
| | Tên nhóm 1 có 3 phiên bản: "Khám Lâm Sàng & **Phẫu Thuật** Điều Trị" (Blueprint dòng 150), "Khám Lâm Sàng & Điều Trị **Chuyên Sâu**" (Blueprint dòng 118, Mapping), "Y khoa lâm sàng & điều trị" (Wireframe) |
| | Số dịch vụ: tab "(24)" so với 15 dòng Mapping |
| | Phụ phí ngoài giờ: "Nội dung xác minh" (Blueprint) so với "chờ phê duyệt" (Mapping, 3B-DEC-03) |
| | `DV-GRP3-02` VERIFIED "Cơ sở vật chất 3A đã duyệt" so với trang 3A thực tế |
| | Tiêu đề Blueprint "**APPROVED** FOR DOCUMENTATION ONLY" (dòng 14) là tự tuyên bố đã duyệt (cùng loại 3A-P3-9) |
| | Blueprint dẫn "`docs/qa/3a-preview-fix01-qa.md` (Commit QA: `99a224a`)": commit này **không tồn tại**. Báo cáo thật là `d05bf0c` trên `claude/3a-preview-fix01-qa` |

## 9. Source integrity

| Kiểm tra | Kết quả |
|---|---|
| Chỉ `docs/` | **Đạt**: `git diff --name-only 4739d45 f8a85f1` chỉ trả về file `docs/` |
| `src/`, assets, dependencies, config | Không đổi |
| Deployment | Không có deployment mới (Vercel API: mới nhất vẫn là `dpl_8XZEtH3…` / `4739d45`) |
| Merge `main` / Git Integration / Production | Không / không (đã kiểm ở QA 3A) / không |

## 10. Danh sách lỗi

| ID | Mức | Nội dung |
|---|---|---|
| — | P0 | Không có |
| **3B00-P1-1** | **P1** | Gán chuyên môn và nhiệm vụ phẫu thuật cho BS. Lê Thái Sơn (Blueprint dòng 159, Mapping dòng 49, Wireframe dòng 66, fixture dòng 220) |
| **3B00-P1-2** | **P1** | Claim phân khu cách ly, hồi sức, trực đêm, sinh hiệu, khử khuẩn, phòng mổ vô trùng, thiết bị X-quang/siêu âm và gây mê trình bày như sự thật; Mapping ghi nguồn sai "Cơ sở vật chất 3A đã duyệt" |
| **3B00-P1-3** | **P1** | Claim y khoa và cam kết VERIFIED không bằng chứng ("điều trị tận gốc", nhịn ăn 6–8 h, dấu hiệu cấp cứu, "không phát sinh ngoài dự toán", banner "Nội dung xác minh" có phụ phí); "4 nhóm VERIFIED — Homepage Section 3" sai; wireframe bỏ nhãn PENDING; "hội đồng chuyên môn" |
| 3B00-P2-1 | P2 | Taxonomy, slug, tên nhóm và số đếm không nhất quán (mục 8) |
| 3B00-P2-2 | P2 | Data Schema thiếu trường nguồn và người xác minh; thiếu quy tắc PENDING ↔ `isPublished`; `effectiveDate` giả; không có phân tầng giá; mâu thuẫn ER và bảng; chưa đặc tả danh mục trống và tên dài |
| 3B00-P2-3 | P2 | Fixture TEST ONLY chứa claim bịa gắn với người thật và thiết bị (dòng 196–220), `isPublished: true`; ví dụ giá cụ thể "150.000 VNĐ", "300.000 – 600.000 VNĐ" trong Blueprint và Schema dễ bị chép vào UI. Nên dùng `[số tiền] VNĐ` |
| 3B00-P2-4 | P2 | Phụ thuộc ngoài phạm vi chưa khai báo: (a) `/dat-lich?service=` cần sửa `BookingPage` (đóng băng 2B; hiện không đọc query, slug lệch `serviceType`); (b) đổi link Header, Footer, FeaturedServices (trang chủ 2B) và xử lý 4 route ComingSoon `/dich-vu/*` hiện có |
| 3B00-P2-5 | P2 | Acceptance Criteria tự chấm "ĐẠT" 15/15; thiếu cấp Code/Preview QA; thiếu ngưỡng và gate (mục 7) |
| 3B00-P2-6 | P2 | Thiếu handoff 3B-00 và danh sách OPEN DECISIONS đầy đủ (chỉ 3 quyết định); tiêu đề tự ghi "APPROVED" |
| 3B00-P3-1 | P3 | Dẫn chiếu commit QA không tồn tại `99a224a` |
| 3B00-P3-2 | P3 | Wireframe Header và Bottom Bar khác component hiện tại; cần ghi "không đổi RootLayout" |
| 3B00-P3-3 | P3 | Màu ngoài token (`bg-purple-100`, `amber-100/900`, `from-amber-50 to-orange-50`) |
| 3B00-P3-4 | P3 | `sticky top-[73px]` sai ở ≥ 768 px (header 81 px) |
| 3B00-P3-5 | P3 | `?q=sieu-am`; placeholder "giá"; tab 38 px và ≥ 44 px mâu thuẫn; `role=region` dư ở panel; thiếu ghi chú loading/error; đơn vị `Mẫu`/`Phim` |

## 11. OPEN DECISIONS cần chủ dự án chốt

Blueprint §7 có 3 quyết định. Claude đề nghị bổ sung thành danh sách đầy đủ:

1. **3B-DEC-01** Biểu phí: cung cấp bảng giá rút gọn có giá thật, hay giữ toàn bộ UNAVAILABLE/CONTACT ở Preview đầu.
2. **3B-DEC-02** Điều hướng: chuyển 4 route `/dich-vu/*` hiện có sang anchor. Việc này đồng nghĩa với việc sửa Header, Footer và FeaturedServices của trang chủ (Mốc 2B), và quyết định số phận 4 route ComingSoon.
3. **3B-DEC-03** Phụ phí ngoài giờ/ngày lễ: có công bố không; nếu có thì khung giờ nào.
4. **Danh mục dịch vụ thật** (tên chuẩn, nhóm, có hay không): đặc biệt phẫu thuật, triệt sản, tiêm phòng, xét nghiệm, X-quang, siêu âm, soi da.
5. **Taxonomy chuẩn duy nhất:** 4 hay 5 nhóm, phẫu thuật có tách nhóm riêng không; slug chuẩn dùng chung cho `/dich-vu`, `/bang-gia` và Schema.
6. **Vai trò BS. Lê Thái Sơn** trên 2 trang (nếu có): chức danh và phạm vi phụ trách đã xác nhận.
7. **Quy chuẩn nội trú** (phân khu, nhân sự trực, theo dõi) và **thiết bị** được phép công bố.
8. **Lời khuyên y khoa** (nhịn ăn, dấu hiệu cấp cứu, chuẩn bị trước khám): bác sĩ duyệt nội dung, hay bỏ khỏi trang.
9. **Cam kết chi phí** ("báo giá trước điều trị", "không phát sinh ngoài dự toán"): có áp dụng thật không.
10. **`/dat-lich?service=`**: có cho phép sửa `BookingPage` (Mốc 2B) để nhận tham số không.
11. **Gói spa và phân tầng theo cân nặng:** có hay không.

## 12. Khuyến nghị bước tiếp theo

- **Không đề xuất nghiệm thu 3B-00 ở vòng này** do 3B00-P1-1, P1-2 và P1-3.
- Đề nghị CEO giao Antigravity **chỉ sửa tài liệu** (3B-00 Fix 01):
  1. Áp dụng Content Lock của 3A: gỡ mọi gán chuyên môn cho BS. Lê Thái Sơn; gỡ claim cách ly, hồi sức, trực đêm, sinh hiệu, khử khuẩn, vô trùng và thiết bị; chuyển thành slot "[Chờ xác nhận]".
  2. Chuyển các dòng VERIFIED không có bằng chứng về PENDING. Thêm cột "Bằng chứng (văn bản, ngày)" vào Mapping; chỉ dữ liệu có bằng chứng mới được VERIFIED.
  3. Gắn nhãn PENDING trực tiếp trong wireframe; bỏ "điều trị tận gốc", "hội đồng chuyên môn" và chữ "Nội dung xác minh".
  4. Thống nhất một taxonomy và slug, cùng số đếm.
  5. Bổ sung schema: `verifiedBy`, `verifiedAt`, `evidenceRef`; quy tắc PENDING ↔ `isPublished`; phân tầng giá; danh mục trống; tên dài. Trung tính hóa fixture và thay ví dụ giá bằng placeholder.
  6. Acceptance Criteria: bỏ cột tự chấm; thêm cấp Code/Preview QA, các gate và ngưỡng còn thiếu.
  7. Lập handoff 3B-00 kèm danh sách OPEN DECISIONS ở mục 11; bỏ chữ "APPROVED"; sửa dẫn chiếu `99a224a`.
- Claude sẽ retest có mục tiêu sau khi có commit mới. Claude không tự phê duyệt bước 3B-01.

---

**PHASE 3B-00 — PENDING OWNER ACCEPTANCE**
