# PHASE 3B-00 FIX 01 — Independent Doc QA (CEO Directive 042-B)

- **QA:** Claude (Independent QA Lead). Chỉ đọc tài liệu; không sửa code, không merge, không deploy, không chạm Production.
- **Ngày:** 28/10/2026
- **Đối tượng:** `docs/phase-3b-00` @ `9074aa6cbffbe7c7f3b529071fd93c6216f43916`
- **Baseline so sánh:** `f8a85f1` + báo cáo cũ `docs/qa/3b-00-design-doc-qa.md` (commit `fa2dda2`)
- **Bằng chứng:** `docs/qa/evidence/3b-00-fix01/`

## Kết luận: **FAIL**. Còn 1 lỗi P1 (3B00-P1-3, mới sửa một phần), nên chưa đề xuất nghiệm thu.

Phần lớn đã sửa tốt: P1-1, P1-2 và P2-1 → P2-6 đều đạt hoặc gần đạt. Lỗi còn lại:

- Content Mapping ghi **VERIFIED** với người duyệt "Chủ dự án (26/10/2026)" cho các câu chữ **chưa hề tồn tại trước 28/10/2026 01:48**.
- Một số dòng dẫn nguồn "Brand Identity Baseline V1", là **tài liệu không có trong repo**.

Như vậy, bằng chứng xác minh có dấu hiệu được tạo dựng. Directive 042-B cấm điều này một cách tuyệt đối.

---

## 1. SHA

| Mục | Giá trị |
|---|---|
| Commit Fix 01 | `9074aa6` (2026-10-28 02:13 +0700), parent `f8a85f1` |
| File thay đổi | 7 file, tất cả nằm trong `docs/`. 0 file ngoài `docs/` |
| `main` | `d2a19c5` (không đổi, chưa merge) |
| Vercel Production | `dpl_BAz378…` / `db78738` (không đổi) |
| Vercel Preview mới nhất | `dpl_8XZEtH3…` / `4739d45` (không có deployment mới) |

Chi tiết: `evidence/3b-00-fix01/01-source-integrity.txt`

## 2. Retest P1

| ID | Trạng thái | Bằng chứng / Ghi chú |
|---|---|---|
| **3B00-P1-1** BS. Sơn bị gán chuyên môn phẫu thuật | **FIXED** | Thay bằng slot "Bác sĩ phụ trách lâm sàng [Chờ xác nhận phân công nhân sự]". BS. Sơn chỉ còn xuất hiện trong câu phủ định và ô người duyệt "Chờ BS. Sơn duyệt". Fixture trung tính (`srv-sample-*`, `testOnly: true`, `isPublished: false`). |
| **3B00-P1-2** Claim đã gỡ ở 3A tái xuất hiện | **FIXED** (còn dư P3) | Không còn claim cách ly, hồi sức, trực đêm, sinh hiệu, vô trùng, phòng mổ hay máy gây mê **như sự thật**. Còn sót (P3): blueprint:108 phạm vi nhóm 04 ghi "cách ly theo dõi"; các slot "[Chờ xác nhận quy trình kíp trực]" và "Kíp trực: [Chờ xác nhận]" ngầm giả định có kíp trực; fixture có "Theo dõi hồi tỉnh mẫu" và "Quy trình sát khuẩn mẫu" (chỉ dùng để test). Xem `04-grep-checks.txt`. |
| **3B00-P1-3** VERIFIED không có bằng chứng | **PARTIAL → vẫn P1** | Xem 2.1 |

### 2.1. Chi tiết P1-3 (còn mở)

Content Evidence Gate §2.1 yêu cầu VERIFIED phải có đủ 5 yếu tố, trong đó có *nguồn xác thực* và *ngày phê duyệt bằng văn bản*. Kết quả kiểm tra trên Git (`02-verified-first-appearance.txt`):

| Dòng mapping | Nội dung | Ghi trong tài liệu | Thực tế Git |
|---|---|---|---|
| `DV-HERO-02` (l.29) | Eyebrow "HỆ THỐNG DỊCH VỤ Y TẾ THÚ CƯNG LÊ SƠN" | Nguồn "Brand Identity Baseline V1", Chủ dự án 26/10/2026 | Chuỗi này xuất hiện lần đầu ở `f8a85f1` (**28/10** 01:48). Không có trong `4739d45`. Repo **không có** tài liệu "Brand Identity Baseline" |
| `DV-HERO-03` (l.30) | H1 "Chăm sóc chu toàn từ phòng khám đến khu nội trú" | "Slogan định vị thương hiệu đã duyệt", Chủ dự án 26/10/2026 | Lần đầu ở `f8a85f1` (28/10). Không phải slogan đang có trên site |
| `DV-HERO-04` (l.31) | Đoạn dẫn | "Văn phong chuẩn mực Mốc 2A/2B", 26/10/2026 | Không có văn bản duyệt; câu chữ chưa được viết ra |
| `DV-GRP4-04` (l.54) | Cập nhật tình hình định kỳ (cam kết vận hành) | Nguồn `AGENTS.md` | AGENTS.md là kiến trúc kỹ thuật, không phải phê duyệt quy trình nội trú |
| `DV-NOTE-02` (l.64) | Lưu ý vận chuyển bằng lồng hoặc dây dắt (lời khuyên) | "Biện pháp an toàn phòng khám", 26/10/2026 | "lồng vận chuyển" lần đầu ở `f8a85f1` (28/10) |
| `BG-HEAD-02/03` (l.77–78) | Eyebrow và H1 trang Bảng giá | "Tôn chỉ thương hiệu" / "Chuẩn SEO", Chủ dự án 26/10/2026 | Lần đầu ở `f8a85f1` (28/10) |
| `BG-HEAD-04` (l.79) | Đoạn dẫn **cam kết tư vấn chi phí** | "Định hướng đạo đức y khoa", 26/10/2026 | **Mâu thuẫn**: 3B-DEC-09 (cam kết tư vấn chi phí) vẫn đang mở; `BG-HEAD-05` và `BG-PROC-02` cùng chủ đề lại là PENDING |
| `BG-PROC-01` (l.97) | Bước 01 "Thăm khám lâm sàng & lắng nghe…" | "Quy trình tiếp đón chuẩn y khoa", 26/10/2026 | Là quy trình chuyên môn nhưng không có văn bản; BG-PROC-02 cùng khối lại là PENDING |

Kết luận P1-3:

- Ngày duyệt 26/10/2026 **không thể** đúng với các câu chữ được tạo ra ngày 28/10/2026.
- Nguồn "Brand Identity Baseline V1" **NOT VERIFIED**: không tồn tại trong repo.
- Theo §2.1 của chính Evidence Gate, các dòng trên **bắt buộc là PENDING**.

Hướng sửa:

- Hạ các dòng trên về PENDING, hoặc
- Đính kèm bằng chứng thật: chủ dự án xác nhận bằng văn bản, ghi đúng ngày.

Claude **không** suy diễn hay tạo bằng chứng thay.

**Các dòng VERIFIED chấp nhận được** (đối chiếu được với code đã nghiệm thu `db78738`/`4739d45`): `DV-HERO-01` breadcrumb, `DV-EMG-01` khối Cấp cứu 24/24, `DV-EMG-03` và `BG-CTA-03` hotline `097 355 51 05`, `BG-HEAD-01`.

**Cần xem lại:**

- `DV-HERO-05` dẫn "CEO Directive 042-A". Directive này không có bản lưu trong repo, nên ghi **NOT VERIFIED**; khuyến nghị lưu bản directive vào `docs/`.
- `DV-CTA-0x`, `BG-CTA-0x`, `BG-TOOL-01`: người duyệt là **Antigravity**, tức tự duyệt (P2-7).

## 3. Retest P2

| ID | Trạng thái | Ghi chú |
|---|---|---|
| 3B00-P2-1 Taxonomy / slug | **FIXED** | 5 slug thống nhất (`kham-dieu-tri`, `can-lam-sang`, `phau-thuat`, `noi-tru`, `spa-grooming`); bỏ số đếm cứng |
| 3B00-P2-2 Data Schema | **FIXED (còn gap nhỏ)** | Đã có `evidenceSource`, `verifiedBy`, `verifiedAt`, `publicationApproval`, quy tắc PENDING → ẩn trên Production, tên dài, danh mục trống, `WeightTierPrice`. Gap: enum có `PROPOSED` nhưng Evidence Gate chỉ định nghĩa 3 trạng thái; `evidenceSource` chưa bắt buộc khi VERIFIED; WeightTier không có trường xác minh |
| 3B00-P2-3 Fixture | **FIXED** | Trung tính, `testOnly`, giá `null` |
| 3B00-P2-4 Phụ thuộc ngoài phạm vi | **FIXED** | Header, Footer, Home, BookingPage giữ nguyên; CTA chỉ trỏ `/dat-lich` (không query) |
| 3B00-P2-5 Acceptance Criteria | **FIXED (còn gap nhỏ)** | 5 cấp, tất cả NOT TESTED. Gap: thiếu gate LCP/Lighthouse, metadata/title/description, console error, bộ test case tìm kiếm; AC-PRV-01 CLS ≤ 0.001 quá chặt (đề xuất ≤ 0.1, mục tiêu ≤ 0.02) |
| 3B00-P2-6 Handoff + OPEN DECISIONS | **FIXED** | Có handoff, 11 quyết định, SHA. Lưu ý: handoff tự ghi P1-2 là "ĐÃ XỬ LÝ TRIỆT ĐỂ" và tự tuyên bố đã hạ toàn bộ claim thiếu bằng chứng, trong khi P1-3 vẫn còn |

**P2 mới:**

| ID | Nội dung |
|---|---|
| **3B00F-P2-7** | **Wireframe thiếu nhãn PENDING ở nhiều chỗ**: H2 nhóm 3.2 "Hỗ trợ chẩn đoán nhanh chóng và chuẩn xác" (l.73); "thời gian hồi tỉnh" (l.85); H2 nhóm 3.4 "Không gian lưu trú yên tĩnh…" (l.93); "Sử dụng các sản phẩm vệ sinh da lông phù hợp" (l.102); Lưu ý 02 và 03 không có nhãn; header nhóm trên mobile không có `[Đề xuất]` (l.333, trong khi desktop có ở l.258); thẻ quy trình trên /bang-gia không có nhãn; accordion "Nội dung bao gồm: Đo thân nhiệt…" (l.248) và "Đo sinh hiệu cơ bản" (l.317) nằm dưới nhóm PENDING nhưng viết như sự thật |
| **3B00F-P2-8** | **Tự duyệt**: Antigravity đứng tên người duyệt ở 8 dòng VERIFIED. Đây là dòng UI/link nên rủi ro thấp, nhưng người duyệt cần là CEO hoặc chủ dự án |
| **3B00F-P2-9** | **Thiếu đặc tả metadata**: chưa có `<title>`, meta description, canonical hay chính sách schema.org/JSON-LD cho `/dich-vu` và `/bang-gia`. Nếu sau này thêm JSON-LD (`MedicalBusiness`/`Offer`), nội dung cũng phải qua Price Lock và Content Lock (không đưa giá hay dịch vụ PENDING vào) |

## 4. Content Evidence Gate

- **Đạt:**
  - Có tài liệu riêng (`3b-00-content-evidence-gate.md`) với 3 trạng thái và quy tắc 5 yếu tố.
  - Quy trình chuyển PENDING → VERIFIED rõ ràng.
  - Có điều kiện chặn Production và checklist.
- **Không đạt:**
  - Chính Content Mapping vi phạm §2.1 (mục 2.1 ở trên).
  - Gate quy định định dạng ngày YYYY-MM-DD, nhưng mapping ghi DD/MM/YYYY (P3).
- **Thống kê sai:** mapping §4 ghi "42 hạng mục, 16 VERIFIED, 25 PENDING, 1 ILLUSTRATIVE". Đếm thực tế được **68 dòng dữ liệu, 21 VERIFIED, 46 PENDING** (`03-mapping-verified-rows.txt`), lệch với số tự khai (P3).
- **Còn PENDING hiển thị như sự thật:** xem 3B00F-P2-7.

## 5. Nhất quán giữa các tài liệu

- **Nhất quán:**
  - 5 nhóm và slug khớp giữa Blueprint, Mapping, Schema và Wireframe.
  - Text CTA trên Header và Bottom Bar khớp component hiện tại.
  - Sticky offset 73/81.
- **Lệch:**
  - Trạng thái `PROPOSED / PENDING` (Blueprint và Schema) không có trong Evidence Gate.
  - Handoff tuyên bố đã xử lý triệt để, trái với kết quả mục 2.1.
- **Metadata/schema.org:** chưa được đặc tả (P2-9).

## 6. Source integrity

| Kiểm tra | Kết quả |
|---|---|
| Chỉ đổi tài liệu | **PASS**: 7 file, đều trong `docs/` |
| Không merge `main` | **PASS**: `main` = `d2a19c5` |
| Không có deployment mới | **PASS**: mới nhất vẫn là `dpl_8XZEtH3…`/`4739d45` (Vercel API, read-only) |
| Production không đổi | **PASS**: `dpl_BAz378…`/`db78738` |
| Git Integration / thay đổi cấu hình project | **NOT VERIFIED**: chỉ kiểm tra được qua đọc API; không thấy thay đổi |
| Tài liệu "Brand Identity Baseline V1", bản lưu "CEO Directive 042-A" | **NOT VERIFIED**: không có trong repo |

## 7. Retest P3

| Mục | Trạng thái |
|---|---|
| Dẫn chiếu commit QA `99a224a` | FIXED → `fa2dda2` |
| Header / Bottom Bar trong wireframe | FIXED |
| Màu dùng token | FIXED |
| Sticky offset ≥ 768 px | FIXED (73/81) |
| Placeholder tìm kiếm, `role=region` | FIXED |
| Đơn vị Mẫu / Phim | FIXED |
| **P3 mới** | Link `file:///d:/webbvct/...` (blueprint:352, mapping:16, handoff:24–30) không dùng được trên GitHub; số thống kê mapping sai; ngày DD/MM thay vì YYYY-MM-DD; "cách ly theo dõi" (blueprint:108); slot "kíp trực" ngầm giả định; ví dụ placeholder "siêu âm" trong ô tìm kiếm phụ thuộc DEC-04 |

## 8. OPEN DECISIONS (chủ dự án)

Handoff đã liệt kê đủ 11 mục 3B-DEC-01 → 11. Claude đề nghị bổ sung 2 mục:

- **3B-DEC-12:** Xác nhận bằng văn bản, ghi đúng ngày, cho câu chữ Hero và Heading của 2 trang (`DV-HERO-02/03/04`, `BG-HEAD-02/03/04`), hoặc yêu cầu đặt lại về PENDING.
- **3B-DEC-13:** Quy ước ai được đứng tên "người duyệt" (không cho phép Antigravity tự duyệt), và lưu bản directive CEO vào repo để làm nguồn bằng chứng.

## 9. Rủi ro trước 3B-01

1. Nếu code dựa trên Mapping hiện tại, các câu chữ chưa được duyệt sẽ lên UI **không có nhãn**, vì quy tắc là VERIFIED thì bỏ nhãn.
2. `BG-HEAD-04` đưa cam kết chi phí lên trang trước khi DEC-09 được chốt.
3. Wireframe thiếu nhãn (P2-7). Dev làm theo wireframe sẽ tái phát dạng lỗi V3-P1-1.
4. Thiếu gate metadata và LCP, nên lỗi có thể chỉ lộ ra ở Preview, như CLS ở 3A.
5. Thống kê tự khai sai làm giảm độ tin cậy của checklist tự kiểm.

## 10. Đề nghị

- **Verdict: FAIL.** Phạm vi sửa hẹp, chỉ là tài liệu, ước tính 1 vòng.
  1. Hạ 9 dòng ở mục 2.1 về PENDING, hoặc đính kèm văn bản duyệt thật của chủ dự án, đúng ngày. Bỏ nguồn "Brand Identity Baseline V1" nếu không có tài liệu.
  2. Gắn nhãn đủ trong wireframe (P2-7).
  3. Sửa thống kê §4 của Mapping; thống nhất trạng thái `PROPOSED`; đổi link `file:///` sang đường dẫn tương đối.
  4. Bổ sung gate metadata, LCP và console error vào Acceptance Criteria.
- **Không** đề xuất nghiệm thu tài liệu 3B-00.
- **Không** phê duyệt Architecture Spike hay 3B-01.
- Claude không tự khởi động bước sau.

**PHASE 3B-00 FIX 01 — PENDING OWNER ACCEPTANCE**
