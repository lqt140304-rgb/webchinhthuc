# PHASE 3B-00 FIX 02 — Independent Doc Retest (CEO Directive 044-B)

- **QA:** Claude (Independent QA Lead). Chỉ đọc và rà soát tài liệu; không sửa code hoặc tài liệu của Antigravity, không merge, không deploy, không chạm Production.
- **Ngày:** 28/10/2026
- **Bằng chứng:** `docs/qa/evidence/3b-00-fix02/` (01–07). Mọi kết luận dựa trên file đọc trực tiếp từ Git.

## Kết luận: **FAIL**. Còn 2 lỗi P1, chưa đề xuất nghiệm thu 3B-00

- **Đạt:** 9 dòng P1-3 của Fix 01 đã sửa đúng. P2-8 (AI tự duyệt) đã sửa. Thống kê Mapping khớp.
- **Không đạt:**
  1. **Lỗi P1 mới (3B00F2-P1-1):** Blueprint §7.1 ghi **hotline `0988 565 056`** là thông tin `VERIFIED` để đưa vào Schema.org. Hotline đã xác minh là **`097 355 51 05`**. Số mới này xuất hiện lần đầu ở chính `ddb066f`.
  2. **3B00-P1-3 chưa đóng hẳn:** `DV-HERO-05` vẫn là VERIFIED, ghi "Chủ dự án 2026-10-28", nhưng không có bản ghi phê duyệt nào trong repo. Hai tài liệu còn ghi hai câu chữ khác nhau cho cùng mục này.

Cả hai lỗi sửa được trong vài dòng, nhưng theo quy tắc, còn P1 thì không đề xuất nghiệm thu.

---

## 1. Branch và SHA được kiểm tra

| Mục | Giá trị |
|---|---|
| Branch | `docs/phase-3b-00` |
| Commit Fix 02 | `ddb066f16819fd451037721f8c5cba3c6b383bef` (2026-10-28 02:40 +0700) |
| Parent / baseline | `9074aa6cbffbe7c7f3b529071fd93c6216f43916` |
| Đối chiếu | `docs/qa/3b-00-fix01-qa.md` @ `b9f386b` (nhánh `claude/3b-00-fix01-qa`) |
| Handoff | `docs/qa/3b-00-fix02-handoff.md` |
| Diff | 7 file, +452 / −191, tất cả nằm trong `docs/` |

## 2. Kết quả P1-3: **PARTIAL, vẫn OPEN**

### 2.1. Chín dòng của Fix 01: **FIXED**

`03-mapping-verified.txt`

| Content ID | PENDING | Bỏ nguồn giả | Bỏ ngày không căn cứ | Có trong DEC |
|---|:-:|:-:|:-:|---|
| DV-HERO-02/03/04 | ✔ | ✔ ("Brand Identity Baseline" đã gỡ khỏi Mapping) | ✔ (`—`) | DEC-12 |
| DV-GRP4-04 | ✔ | ✔ | ✔ | (chính sách nội trú, DEC-07) |
| DV-NOTE-02 | ✔ | ✔ | ✔ | DEC-08 |
| BG-HEAD-02/03 | ✔ | ✔ | ✔ | DEC-12 |
| BG-HEAD-04 | ✔ | ✔ | ✔ | DEC-09/12 (hết mâu thuẫn với DEC-09) |
| BG-PROC-01 | ✔ | ✔ | ✔ | DEC-09 |

- Không tài liệu nào khác còn bản sao VERIFIED của 9 dòng này.
- **Tuy nhiên**, Blueprint §4.2 và Wireframe vẫn trình bày Eyebrow, H1 và đoạn dẫn của cả hai trang như nội dung chốt, không kèm nhãn (xem mục 3). Các dòng này không bị gắn VERIFIED nữa, nhưng vẫn chưa được đánh dấu là đang chờ duyệt.

### 2.2. Các dòng VERIFIED còn lại (4 dòng)

| Content ID | Đánh giá | Lý do |
|---|---|---|
| `DV-EMG-01` Khối Cấp cứu 24/24 | **Chấp nhận** | Khối này có sẵn trong code đã lên Production `db78738` (2026-10-26) |
| `DV-EMG-03`, `BG-CTA-03` Hotline `097 355 51 05` | **Chấp nhận** | Khớp `src/config/contact.ts` (có từ `c8a58da`, 2026-10-25), đã nghiệm thu ở 2B. Văn bản Directive 017-A không có trong repo nên ghi **NOT VERIFIED**, nhưng code đã nghiệm thu là nguồn hợp lệ |
| `DV-HERO-05` Editorial Policy Banner | **KHÔNG ĐẠT (P1)** | Xem dưới |

**Vì sao `DV-HERO-05` không đạt:**

- **Thiếu điều kiện 1 của Evidence Gate (câu chữ cụ thể):** Mapping chỉ mô tả "Thông báo danh mục chuẩn hóa 3B". Hai tài liệu lại ghi hai câu khác nhau:
  - Blueprint: *"Các dịch vụ dưới đây mô tả định hướng chuyên môn y khoa và danh mục dự kiến phục vụ tại 101 Khuất Duy Tiến. Chi phí và quy trình kỹ thuật cụ thể sẽ được bác sĩ trao đổi trực tiếp…"*
  - Wireframe: *"THÔNG BÁO: Danh mục dịch vụ đang được chuẩn hóa theo định hướng Giai đoạn 3B. Chi tiết phác đồ và chi phí cụ thể sẽ được bác sĩ trao đổi trực tiếp…"*
- **Người duyệt không có căn cứ:**
  - Fix 01 ghi "CEO / Chủ dự án (28/10/2026)". Fix 02 bỏ chữ "CEO" để hợp với DEC-13, chỉ còn "Chủ dự án 2026-10-28", nhưng **không bổ sung bằng chứng nào**.
  - Nguồn được dẫn là CEO Directive 042-A/044-A, mà theo DEC-13, ChatGPT CEO không phải người phê duyệt.
  - Repo không có bản lưu directive nào.
- **Có nội dung cần duyệt:** câu "bác sĩ trao đổi trực tiếp về chi phí" là một cam kết quy trình, cùng chủ đề với DEC-09 đang mở.

**Cách sửa:** chọn một trong hai:

- Hạ `DV-HERO-05` về PENDING và đưa vào DEC-12.
- Hoặc chốt **một** câu chữ, lưu văn bản chủ dự án duyệt câu đó vào repo, rồi ghi `approvalReference`.

## 3. Kết quả P2-7 (nhãn PENDING trong wireframe): **PARTIAL, vẫn OPEN**

`05-label-coverage.txt`

**Đã sửa:**

- H2 nhóm 3.2, 3.3, 3.4, 3.5 trên desktop.
- Bỏ "thời gian hồi tỉnh".
- Lưu ý 02/03 trên desktop và mobile.
- Header "Cận lâm sàng" trên mobile.
- Thẻ quy trình 3 bước trên desktop và mobile.
- Nội dung accordion mẫu.
- Bỏ giả định "kíp trực".

**Còn hiển thị như sự thật, không có nhãn:**

| Vị trí (wireframe @ddb066f) | Nội dung | Content ID / DEC |
|---|---|---|
| l.42–46, 135–137 (Hero `/dich-vu`, desktop và mobile) | Eyebrow, H1 "Chăm sóc chu toàn… đến khu nội trú", đoạn dẫn | DV-HERO-02/03/04, DEC-12. H1 còn ngầm khẳng định có "khu nội trú" (DEC-07) |
| l.225–227, 298 (Heading `/bang-gia`) | Eyebrow, H1, đoạn dẫn "hướng tới sự minh bạch… tư vấn chi phí". Mobile ghi câu khác ("BẢNG GIÁ DỊCH VỤ NIÊM YẾT") | BG-HEAD-02/03/04, DEC-09/12 |
| l.60–63 (Nhóm 01, desktop) | "Thăm khám cẩn trọng, **chẩn đoán đúng**…", "Quy trình kiểm tra các chỉ số sức khỏe cơ bản…" | DV-GRP1-02 |
| l.88–89 (Nhóm 03, desktop) | "Lưu ý y khoa: Trao đổi trước với bác sĩ về tiền sử dị ứng và chuẩn bị nhịn ăn" | Lời khuyên y khoa (DEC-08), **không có Content ID** |
| l.96, 179 | "Cập nhật tình hình: Thông báo tình trạng phục hồi cho chủ nuôi" / "Cập nhật định kỳ cho chủ nuôi" | DV-GRP4-04 (vừa bị hạ về PENDING) |
| l.54, 175 | Tab "Nội trú 24/7", header mobile "NỘI TRÚ Y TẾ 24/7" | DV-GRP4-01. "24/7" ngầm khẳng định có theo dõi xuyên đêm, cùng dạng với claim "trực đêm" đã gỡ ở 3A (DEC-07) |
| l.146–184 (mobile `/dich-vu`) | Header Nhóm 01, 02, 03, 04, 05; "Thăm khám cẩn trọng"; "Quy trình cẩn trọng, chuẩn bị kỹ"; "Vệ sinh êm ái…"; Thẻ 1–3 của Nhóm 02 | DV-GRP*-01/02. Bản desktop đã có nhãn, bản mobile chưa |
| l.249 (accordion) | "Lưu ý y khoa: Áp dụng cho lần khám đầu tiên…" | BG-PRC-14 |
| l.120, 283 | Tiêu đề Dark CTA | DV-CTA-01, BG-CTA-01 (rủi ro thấp, P3) |

**Blueprint §4 chưa được đồng bộ** với wireframe. Handoff ghi đã xử lý, nhưng Blueprint vẫn còn các câu cũ:

- "thời gian hồi tỉnh" (l.192).
- H2 "Không gian lưu trú **yên tĩnh**…" (l.201).
- "sản phẩm vệ sinh da lông" (l.213).
- Placeholder "ví dụ: **siêu âm**, triệt sản" (l.285).
- Lưu ý 02 và 03 không có nhãn (l.229–230).
- Hero của cả hai trang không có nhãn (l.144–147, 270–272).

Blueprint là bản đặc tả chính, nên dev làm theo Blueprint sẽ đưa lại các câu này lên UI.

## 4. Kết quả P2-8 (attribution): **FIXED**, còn một lưu ý

- **Đạt:**
  - Không còn tên Antigravity, Claude hay ChatGPT trong cột người duyệt của Mapping và Schema.
  - Schema ghi rõ "AI agent không được tự gán".
  - Mọi dòng PENDING đều có người duyệt và ngày là `—`.
- **Không có attribution cho bác sĩ:** BS. Sơn chỉ xuất hiện ở ô "chờ duyệt" và trong câu phủ định. Không có `verifiedBy` nào mang tên bác sĩ.
- **Lưu ý (thuộc P1-3):** "Chủ dự án" xuất hiện ở 4 dòng VERIFIED. Ba dòng có căn cứ là code đã nghiệm thu. Dòng `DV-HERO-05` không có căn cứ (mục 2.2).

## 5. Kết quả P2-9 (SEO Metadata): **PARTIAL**, có 1 lỗi P1

`04-hotline-mismatch.txt`, `06-seo-checks.txt`

| Hạng mục | Kết quả |
|---|---|
| Title (2 route) | Có, PENDING ✔ |
| Description | Có, PENDING ✔. Độ dài tự ghi sai: 158 → thực tế **150**; 151 → thực tế **137** (P3). Nội dung liệt kê ngoại khoa, nội trú; đoạn "minh bạch chi phí, tư vấn rõ ràng" thuộc DEC-09 nhưng đã là PENDING nên chấp nhận |
| Canonical | Placeholder `https://[domain-chinh-thuc]/…` ✔ |
| OG title, description, type | Có ✔. `og:type` ghi "VERIFIED" là giá trị kỹ thuật, nên tách khỏi trạng thái nội dung (P3) |
| OG image | Mới ghi đường dẫn dự kiến `og-*.jpg`. Ảnh chưa có, nguồn ảnh chưa xác định (DEC) ✔ ở mức tài liệu |
| Robots | Preview dùng `noindex, nofollow`; Production chỉ bật index sau khi chủ dự án nghiệm thu ✔ |
| **Structured data** | Quy tắc tốt: không đưa PENDING vào `Offer`. **Nhưng danh sách "đã VERIFIED" ghi `Hotline 0988 565 056`** ✘ → **3B00F2-P1-1**. Giờ mở cửa 08:00–21:00 và cấp cứu 24/24 khớp `contact.ts` ✔ |
| Verification gate | AC-DOC-10 và AC-PRV-06 (Rich Results Test) ✔ |
| **HTML gốc / prerender** | **Chưa có** ✘. Site là SPA (Vite). Tài liệu chưa nêu cách đặt title và meta theo route (React 19 `<title>`, prerender, hay chỉ áp dụng client-side). Cũng chưa có tiêu chí kiểm tra HTML gốc hoặc nội dung crawler nhận được (P2) |
| 404 | §7.1.6 và AC-COD-08 ✔. Nhưng câu "404 **hoặc** ComingSoon" để ngỏ; cần chốt một hành vi và mã HTTP (P3) |
| LCP | AC-PRV-05: ≤ 2,5 s ✔ |
| CLS | AC-PRV-01: ≤ 0,001, quá chặt, chưa đổi (P3) |
| Console errors | AC-COD-07 và AC-PRV-05 ✔ |

**3B00F2-P1-1 (mới):**

- **Hiện trạng:** `docs/phase-3b/3b-00-blueprint.md:367` ghi *"Chỉ tích hợp Schema.org `MedicalBusiness` … với các thông tin đã `VERIFIED` (… Hotline 0988 565 056 …)"*.
- **Đối chiếu:**
  - `0988 565 056` chỉ có ở commit này (`git log -S`).
  - Hotline thật là `097 355 51 05` (`contact.ts`; Mapping DV-EMG-03 và BG-CTA-03).
- **Rủi ro:** nếu dev chép nguyên văn, Google và khách hàng sẽ nhận **sai số điện thoại cấp cứu** của bệnh viện.
- **Cách sửa:** thay bằng tham chiếu tới `HOSPITAL_CONTACT` trong `src/config/contact.ts` (không ghi cứng số).

Không yêu cầu SEO phải chạy trong vòng này, và việc đặc tả SEO không có nghĩa Architecture Spike 01 đã được duyệt.

## 6. DEC-12 và DEC-13

| Yêu cầu | Kết quả |
|---|---|
| DEC-12: ghi nhận chính sách duyệt Hero/Heading | ✔ (Evidence Gate §1.4, Mapping §1, Blueprint §10) |
| DEC-12: không coi câu chữ là đã duyệt | ✔ trong Mapping; ✘ trong Blueprint và Wireframe (mục 3) |
| DEC-12: có danh sách Content ID | ✔ `DV-HERO-02/03/04`, `BG-HEAD-02/03/04`. **Thiếu** `DV-HERO-05` và các tiêu đề CTA `DV-CTA-01`, `BG-CTA-01`, dù Mapping ghi chúng phụ thuộc DEC-12 |
| DEC-13: vai trò rõ ràng | ✔ Có tách Chủ dự án (`approvedBy`), Bác sĩ (`verifiedBy`) và AI (soạn thảo / QA) |
| DEC-13: phân biệt technical review và content approval | ✔ Evidence Record §3.3 (`verifiedBy` khác `approvedBy`) |
| DEC-13: không tự tạo bản ghi phê duyệt | ✘ Một phần. Header Evidence Gate tự ghi **"POLICY APPROVED (Quy chế đã duyệt)"**; handoff ghi DEC-13 "**ĐÃ THIẾT LẬP NGUYÊN TẮC**"; Evidence Gate §4 xếp "DEC-12, DEC-13 trong Directive 044-A" vào nhóm **Owner Directives**. Repo không có bản ghi chủ dự án duyệt → **NOT VERIFIED** (P2) |
| DEC-13: nguồn và ngày cho phê duyệt hợp lệ; lưu directive vào repo | ✘ DEC-13 tự đặt yêu cầu "lưu CEO Directives trong Git", nhưng **chưa có file directive nào** trong repo (P2) |

## 7. P3

| Mục | Kết quả |
|---|---|
| Link `file:///` | **FIXED** (0 kết quả trong tài liệu 3B) |
| Số liệu Mapping | **FIXED**: 68 = 4 VERIFIED + 63 PENDING + 1 ILLUSTRATIVE, đếm lại khớp. Handoff tả sai báo cáo cũ ("báo cáo cũ ghi 12 VERIFIED, thực đếm 13"); thực tế báo cáo ghi 16 tự khai và 21 thực đếm (P3) |
| Ngày | **FIXED**: Mapping dùng YYYY-MM-DD |
| PROPOSED | **FIXED**: định nghĩa là tag thiết kế, có giá trị tương đương PENDING |
| "cách ly theo dõi" | **FIXED** trong Blueprint l.108 |
| Data Schema gap | **FIXED** phần lớn (`approvedBy`, `approvedAt`, `approvalReference`, `publicationScope`; fixture đã trung tính). Còn: `approvedBy` và `approvalReference` chưa bắt buộc khi Category/Service là VERIFIED (chỉ PriceItem có ràng buộc) |
| Acceptance Criteria gap | **FIXED** phần lớn (SEO, 404, LCP, console, JSON-LD). Còn: tiêu chí HTML gốc/prerender; CLS ≤ 0,001 |

## 8. Content Evidence Gate (v1.2)

- **Tốt:**
  - Có Evidence Record schema với `contentVersion` (đổi câu chữ thì quay về PENDING).
  - Có quy tắc trường người duyệt phải `null` khi chưa duyệt.
  - Có quy tắc tách xác minh chuyên môn khỏi phê duyệt công bố.
  - Có điều kiện chặn Production theo DEC-12.
- **Chưa tốt:**
  - Header tự ghi "POLICY APPROVED" mà không có căn cứ.
  - CEO directive bị xếp vào "Owner Directives", trái với DEC-13.
  - Chính Mapping vi phạm điều kiện 1 ở dòng `DV-HERO-05`.

## 9. Tính nhất quán tài liệu

| Cặp tài liệu | Lệch |
|---|---|
| Blueprint §4 ↔ Wireframe | Wireframe đã sửa câu chữ và nhãn, Blueprint chưa (mục 3) |
| Blueprint ↔ Wireframe (banner DV-HERO-05) | Hai câu khác nhau |
| Wireframe desktop ↔ mobile (`/bang-gia`) | H1 và Eyebrow khác nhau |
| Blueprint §7 ↔ Mapping / `contact.ts` | Hotline khác nhau (P1) |
| Handoff ↔ thực tế | Handoff ghi "ĐÃ XỬ LÝ TRIỆT ĐỂ" cho P2-7 và P3-4 (placeholder), nhưng Blueprint còn câu cũ |
| Taxonomy 5 nhóm và slug | Khớp ✔ |

## 10. Source integrity

`01-source-integrity.txt`, `02-vercel-readonly.txt`

| Kiểm tra | Kết quả |
|---|---|
| Chỉ thay đổi trong `docs/` | **PASS** (7 file) |
| Không đổi `src/`, `public/`, package, config | **PASS** (diff rỗng) |
| Không merge `main` | **PASS** (`main` = `d2a19c5`) |
| Không deploy Vercel | **PASS**: deployment mới nhất vẫn là `dpl_8XZEtH3…` / `4739d45` (17:05Z), trước `ddb066f` |
| Không Git Integration | **PASS**: `project.link` trống (đọc qua API, read-only) |
| Production không đổi | **PASS**: `dpl_BAz378…` / `db78738` |
| Văn bản CEO Directive 017-A, 042-A, 044-A | **NOT VERIFIED**: không có trong repo |

## 11. Vấn đề mới

| ID | Mức | Nội dung |
|---|---|---|
| **3B00F2-P1-1** | **P1** | Hotline sai `0988 565 056` được ghi là VERIFIED cho Schema.org (Blueprint l.367) |
| **3B00-P1-3** (còn lại) | **P1** | `DV-HERO-05`: VERIFIED không có bản ghi chủ dự án duyệt, câu chữ không thống nhất |
| 3B00F2-P2-1 | P2 | P2-7 còn sót: Hero/Heading, mobile `/dich-vu`, lời khuyên nhịn ăn không có Content ID, "Nội trú 24/7", DV-GRP4-04 |
| 3B00F2-P2-2 | P2 | Blueprint §4 chưa đồng bộ với Wireframe v1.2 |
| 3B00F2-P2-3 | P2 | Tự ghi "POLICY APPROVED" và "ĐÃ THIẾT LẬP" cho Evidence Gate và DEC-13; directive chưa được lưu vào repo |
| 3B00F2-P2-4 | P2 | SEO thiếu chiến lược head theo route trong SPA và tiêu chí kiểm tra HTML gốc |
| 3B00F2-P3-x | P3 | Độ dài description; `og:type` ghi "VERIFIED"; "404 hoặc ComingSoon"; CLS ≤ 0,001; mô tả sai báo cáo cũ trong handoff; `approvalReference` chưa bắt buộc cho Category/Service |

## 12. OPEN DECISIONS

- **Danh sách hiện có:** 13 mục (DEC-01 → DEC-13).
- **Cần chủ dự án xác nhận thêm:**
  - **DEC-12 và DEC-13:** chủ dự án có chính thức duyệt hai chính sách này không, và văn bản duyệt được lưu ở đâu. Chỉ khi có văn bản mới được ghi "Approved".
  - **DEC-12:** bổ sung `DV-HERO-05`, `DV-CTA-01`, `BG-CTA-01` vào danh sách chờ duyệt.
  - **DEC-07:** có được dùng cụm "Nội trú 24/7" và "khu nội trú" không.
  - **DEC-14 (đề xuất):** chiến lược SEO cho SPA: chỉ client-side, hay prerender hai route. Quyết định này ảnh hưởng tới Architecture Spike.

## 13. Đề xuất nghiệm thu

- **Verdict: FAIL.** Còn 2 lỗi P1, nên **không** đề xuất nghiệm thu 3B-00.
- Phạm vi Fix 03 rất hẹp, chỉ sửa tài liệu:
  1. Sửa hotline ở Blueprint §7.1: tham chiếu `HOSPITAL_CONTACT`, đúng số `097 355 51 05`.
  2. Hạ `DV-HERO-05` về PENDING, hoặc lưu văn bản chủ dự án duyệt một câu chữ duy nhất.
  3. Đồng bộ Blueprint §4 với Wireframe; gắn nhãn đủ các chỗ ở mục 3.
  4. Gỡ "POLICY APPROVED" và "ĐÃ THIẾT LẬP" nếu chưa có văn bản; lưu các directive vào `docs/directives/`.
  5. Bổ sung tiêu chí SEO cho HTML gốc/prerender, và chọn một hành vi 404.
- Nếu Fix 03 xử lý xong hai P1, Claude dự kiến có thể đánh giá **PASS WITH FIXES**, với các P2/P3 còn lại chuyển thành điều kiện.
- Claude **không** phê duyệt 3B-01 hay Architecture Spike 01, và không tự khởi động bước sau.

**PHASE 3B-00 FIX 02 — PENDING OWNER ACCEPTANCE**
