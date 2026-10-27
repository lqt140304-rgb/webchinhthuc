# PHASE 3B-00 FIX 03 — Independent Doc Retest (CEO Directive 046-B)

- **QA:** Claude (Independent QA Lead). Chỉ đọc tài liệu; không sửa code hoặc tài liệu của Antigravity, không merge, không deploy, không chạm Production.
- **Ngày:** 28/10/2026
- **Phạm vi:** Directive 046-B chỉ có tiêu đề. Claude áp dụng cùng khung retest như 044-B cho các lỗi của báo cáo Fix 02 (`e0bdeec`).
- **Bằng chứng:** `docs/qa/evidence/3b-00-fix03/` (01–07). Mọi kết luận dựa trên file đọc trực tiếp từ Git.

## Kết luận: **PASS WITH FIXES**. Không còn P0/P1

- **P1 đã đóng:** cả hai lỗi P1 của Fix 02: hotline sai trong đặc tả SEO và `DV-HERO-05` bị gắn VERIFIED không có căn cứ.
- **P2-7 (nhãn wireframe):** cơ bản đã đạt.
- **DEC-12/13:** đã ghi đúng trạng thái là "đang chờ văn bản" (`APPROVAL RECORD PENDING`).
- **Còn 2 lỗi P2 mới và một số P3.** Không lỗi nào làm sai nội dung công khai, nhưng cần xử lý **trước khi code 3B-01**.

Đề nghị CEO trình chủ dự án xem xét **nghiệm thu có điều kiện** tài liệu 3B-00. Claude **không** phê duyệt 3B-01 hay Architecture Spike 01.

---

## 1. Branch và SHA

| Mục | Giá trị |
|---|---|
| Branch | `docs/phase-3b-00` |
| Commit Fix 03 | `32b8a0a89e9a3e8a39fb284aefdd6ea342b64d7b` (2026-10-28 03:08 +0700) |
| Parent / baseline | `ddb066f16819fd451037721f8c5cba3c6b383bef` |
| Đối chiếu | `docs/qa/3b-00-fix02-qa.md` @ `e0bdeec` |
| Handoff | `docs/qa/3b-00-fix03-handoff.md` |
| Diff | 8 file, +369 / −146, tất cả trong `docs/`. Có thêm file mới `docs/decisions/3b-dec-12-13-policy-record.md` |

## 2. Retest P1

| ID | Kết quả | Bằng chứng |
|---|---|---|
| **3B00F2-P1-1** Hotline sai `0988 565 056` | **FIXED** | Số này chỉ còn xuất hiện trong câu *cấm* (Blueprint l.377, Evidence Gate l.186). §7.1.5 nay tham chiếu `HOSPITAL_CONTACT.name/address/hotlineDisplay/hotlineTel/workingHours/emergencyHours`, giá trị khớp `src/config/contact.ts` (`097 355 51 05`, `08:00 – 21:00`, `Tiếp nhận cấp cứu 24/24`). Có thêm AC-DOC-12 và AC-COD-09. Xem `03-p1-hotline.txt` |
| **3B00-P1-3** `DV-HERO-05` | **FIXED** | Đã là PENDING, nguồn ghi "3B-DEC-12", người duyệt `—`, ngày `—`. Blueprint §4.2 và Wireframe đã dùng **một** câu chữ chung, có nhãn `[Đề xuất / PENDING - DEC-12]`. `DV-HERO-05` đã nằm trong danh sách DEC-12. Xem `04-p1-3-dv-hero-05.txt` |

**Rà soát lại toàn bộ VERIFIED:**

- **Số liệu:** 68 dòng = **3 VERIFIED** + 64 PENDING + 1 ILLUSTRATIVE. Đếm lại khớp với tài liệu.
- **AI làm người duyệt:** 0 trường hợp.
- **Ba dòng VERIFIED còn lại:**
  - `DV-EMG-01`: căn cứ commit `db78738` (Production).
  - `DV-EMG-03`, `BG-CTA-03`: hotline, khớp `contact.ts`, đã nghiệm thu ở 2B.
  - Cả ba đều có căn cứ thật. Chỉ còn một điểm nhỏ về cách ghi nguồn, xem P2 mới 3B00F3-P2-2.

## 3. Retest P2-7 (nhãn wireframe): **FIXED**, còn P3

`05-label-coverage.txt`

**Đã gắn nhãn hoặc đã sửa:**

| Vị trí | Thay đổi |
|---|---|
| Hero và Heading của cả hai trang (desktop và mobile) | Gắn nhãn `[Đề xuất / PENDING - DEC-12]` |
| H1 `/dich-vu` | Bỏ cụm "đến khu nội trú" |
| Nhóm 01 | Bỏ "chẩn đoán đúng" |
| Nhóm 03 | Bỏ lời khuyên nhịn ăn |
| Nhóm 04 | Bỏ "24/7" (desktop, mobile, jump bar, tab); "Cập nhật tình hình" gắn `[Chờ xác nhận… DEC-07]` |
| Header Nhóm 01–05 và các thẻ trên mobile | Gắn nhãn |
| Accordion | Gắn nhãn |
| Quy trình 3 bước | Gắn nhãn |

**Blueprint §4 đã đồng bộ:**

- Không còn "hồi tỉnh", "yên tĩnh", "da lông".
- Placeholder tìm kiếm đã đổi sang "khám tổng quát, tiêm phòng".

**Còn sót (P3):** xem mục 7.

## 4. Retest P2-8 (attribution): **FIXED**

- Không có AI nào đứng tên người duyệt trong Mapping, Schema hay Policy record.
- Không có attribution nào cho bác sĩ.
- Policy record ghi rõ ma trận vai trò và cấm AI tự duyệt.

## 5. Retest P2-9 (SEO Metadata): **FIXED ở mức tài liệu**, kèm 1 P2 mới

| Hạng mục | Kết quả |
|---|---|
| Title, Description, Canonical, OG | ✔ Tất cả là PENDING; độ dài description đã sửa đúng (150 / 137) |
| Structured data | ✔ Lấy dữ liệu từ `HOSPITAL_CONTACT`; không đưa PENDING hay giá chưa duyệt vào `Offer` |
| Chiến lược head trong SPA | ✔ Đã nêu: quản lý head phía client; prerender / React Router Framework Mode ghi tại DEC-14 với trạng thái `RESEARCH DIRECTION SELECTED / IMPLEMENTATION NOT APPROVED`. Claude không coi Spike 01 là đã được duyệt |
| HTML gốc | ✔ AC-COD-07 và AC-PRV-07: kiểm bằng `curl` / raw GET |
| 404 | ✔ về mặt đặc tả (cấm soft 404). Nhưng hiện **không làm được** nếu không sửa config, xem 3B00F3-P2-1 |
| CLS | ✔ < 0,1 (mục tiêu 0,000) |
| LCP, console errors | ✔ AC-PRV-05, AC-COD-07 |

## 6. DEC-12, DEC-13, DEC-14

| Yêu cầu | Kết quả |
|---|---|
| DEC-12: chính sách đã ghi nhận; câu chữ cụ thể không bị coi là đã duyệt | ✔ Policy record §1.3 ghi "Policy Approval không đồng nghĩa câu chữ đã duyệt" |
| DEC-12: danh sách Content ID | ✔ 9 mục, gồm cả `DV-HERO-05`, `DV-CTA-01`, `BG-CTA-01` |
| DEC-13: vai trò; phân biệt policy, verification, publication | ✔ Policy record §2.1–2.2 |
| DEC-13: không tự tạo bản ghi phê duyệt | ✔ Trạng thái ghi `POLICY ACCEPTED IN PRINCIPLE / FORMAL APPROVAL RECORD PENDING`. Đã bỏ "POLICY APPROVED" và "ĐÃ THIẾT LẬP" |
| DEC-13: nguồn và ngày cho phê duyệt hợp lệ | Một phần. Câu "Chủ dự án đã đồng thuận về mặt nguyên tắc trong trao đổi điều phối" là **NOT VERIFIED**: repo không có bản ghi. Cần chủ dự án xác nhận (mục 12) |
| DEC-14 | ✔ Mở đúng cách, chưa được phép triển khai |

## 7. P3

| Mục | Kết quả |
|---|---|
| Link cục bộ `file:///` | ✔ 0 |
| Số liệu Mapping | ✔ 68 = 3 + 64 + 1 |
| Ngày | ✔ YYYY-MM-DD |
| PROPOSED | ✔ |
| "cách ly theo dõi" | ✔ Đã bỏ |
| Data Schema | ✔ `evidenceSource`, `approvedBy`, `approvedAt`, `approvalReference` bắt buộc khi VERIFIED. Lưu ý: điều này mâu thuẫn với dữ liệu hiện có, xem P2-2 |
| Acceptance Criteria | ✔ CLS, raw HTML, 404, contact binding |

**P3 còn lại / mới:**

1. **Lời khuyên nhịn ăn:** Blueprint DEC-08 (l.445) ghi "khuyến cáo nhịn ăn **tạm thời gỡ bỏ**", nhưng Lưu ý 01 vẫn còn câu "trao đổi… về việc nhịn ăn" (Blueprint l.232, Wireframe l.118). Câu này có nhãn `[Đề xuất hướng dẫn]` nên không hiển thị như sự thật, nhưng tài liệu tự mâu thuẫn. Handoff ghi đã gỡ ở cả ba nơi.
2. **Mobile `/bang-gia`:** dùng "BẢNG GIÁ DỊCH VỤ NIÊM YẾT / Minh bạch chi phí y tế", khác desktop và Mapping ("MINH BẠCH CHI PHÍ Y TẾ THÚ CƯNG / Bảng giá dịch vụ & biểu phí tham chiếu"). Handoff ghi đã đồng bộ. Dòng eyebrow mobile (l.305) không có nhãn riêng.
3. **Tiêu đề Dark CTA** (`DV-CTA-01`, `BG-CTA-01`, đã thuộc DEC-12) chưa có nhãn trong wireframe (l.122, 207, 289). Câu chữ cũng lệch với Mapping ("…cho bé **cưng**?").
4. **Mobile `/dich-vu`:** H1 rút gọn ("Chăm sóc sức khỏe thú cưng tận tâm"), khác desktop và Mapping.
5. **Nhãn banner giá:** `[Đề xuất quy chế - DEC-12]` (l.236, 310), trong khi Blueprint và Mapping gắn với DEC-09.
6. **Blueprint Section 5:** Lưu ý 02 và 03 không có nhãn riêng (cả section đã ghi PENDING).
7. **Thư viện quản lý head:** blueprint đề xuất `react-helmet-async`. Dự án dùng React 19, vốn hỗ trợ sẵn `<title>`/`<meta>` trong component. Cần kiểm tra tính tương thích peer dependency trước khi chọn (**NOT VERIFIED**; việc này thuộc Spike, chưa phải lỗi tài liệu).

## 8. Content Evidence Gate (v1.3)

- **Đạt:**
  - Đã ghi rõ CEO Directive (ChatGPT) không thay thế văn bản của chủ dự án.
  - Có checklist hotline.
  - Có điều kiện chặn Production theo DEC-12.
  - Trạng thái đã ghi trung thực.
- **Mâu thuẫn nhỏ:** Cấp 1 ghi "Owner Directives **có trong repo** … Directive 017-A/018-A", nhưng 017-A và 018-A **không có trong repo** (thuộc P2-2).

## 9. Tính nhất quán

| Kiểm tra | Kết quả |
|---|---|
| Blueprint ↔ Wireframe ↔ Mapping: Hero, banner, Nhóm 04, hotline | ✔ Khớp |
| Taxonomy 5 nhóm và slug | ✔ Khớp |
| Còn lệch | Các mục P3-1 đến P3-5 ở trên |

## 10. Source integrity

`01-source-integrity.txt`, `02-vercel-readonly.txt`

| Kiểm tra | Kết quả |
|---|---|
| Chỉ thay đổi trong `docs/` | **PASS** (8 file) |
| Không đổi source, assets, package, config (`vercel.json`, `vite.config.ts`, `index.html`…) | **PASS** (diff rỗng) |
| Không merge `main` | **PASS** (`main` = `d2a19c5`) |
| Không deploy Vercel | **PASS**: deployment mới nhất vẫn là `dpl_8XZEtH3…` / `4739d45`, tạo trước `32b8a0a` |
| Không Git Integration | **PASS**: `project.link` trống (API read-only) |
| Production không đổi | **PASS**: `dpl_BAz378…` / `db78738` |
| Văn bản Directive 017-A, 018-A, 042-A, 044-A, 046-A | **NOT VERIFIED**: không có trong repo |

## 11. Vấn đề mới

### 3B00F3-P2-1: yêu cầu 404 thật và chính sách robots cần sửa `vercel.json`, nhưng chưa khai báo phụ thuộc

`06-seo-404-config.txt`

- **Hiện trạng:**
  - `vercel.json` (không đổi từ 2B) có `rewrites: /(.*) → /index.html`. Mọi đường dẫn đều trả **HTTP 200**.
  - `NotFoundPage` của React vì vậy là một soft 404.
- **Hệ quả 1:** AC-COD-08 ("HTTP 404 thực tế từ server / edge, không chấp nhận soft 404") **không thể đạt** nếu chỉ sửa code trang. Phải sửa `vercel.json` (danh sách rewrite theo route, hoặc trang 404 tĩnh) hoặc chọn prerender theo DEC-14.
- **Hệ quả 2:** `vercel.json` đang gắn `X-Robots-Tag: noindex, nofollow` cho `/dich-vu` và `/bang-gia` trên **mọi môi trường**. Chính sách §7.1.3 ("Production bật index sau khi nghiệm thu") cũng cần sửa file này.
- **Vấn đề:** Blueprint §9 (Phụ thuộc ngoài phạm vi) mới liệt kê BookingPage, Header, Footer/Home, **chưa có `vercel.json`**.
- **Đề nghị:** thêm phụ thuộc thứ 4 (`vercel.json`, cấu hình deploy) vào §9 và một OPEN DECISION, hoặc gộp vào DEC-14. Ghi rõ AC-COD-08 phụ thuộc quyết định này.

### 3B00F3-P2-2: quy tắc bằng chứng mới mâu thuẫn với 3 dòng VERIFIED hiện có

`04-p1-3-dv-hero-05.txt`

- **Mâu thuẫn 1 (nguồn trong repo):**
  - Policy record §2.3 và Evidence Gate Cấp 1 yêu cầu bằng chứng "lưu vết trong Git repo".
  - `DV-EMG-03` và `BG-CTA-03` lại dẫn nguồn "Directive 017-A", vốn không có trong repo.
- **Mâu thuẫn 2 (trường bắt buộc):**
  - Data Schema v1.3 bắt buộc `verifiedBy` (bác sĩ) và `approvalReference` cho **mọi** bản ghi VERIFIED.
  - Hotline và khối cấp cứu là thông tin liên hệ, không cần bác sĩ xác minh, và Mapping cũng không có các trường đó.
  - Nếu code 3B-01 áp đúng ràng buộc này, chính 3 dòng VERIFIED sẽ không hợp lệ.
- **Đề nghị:**
  - Đổi `evidenceSource` của 3 dòng sang căn cứ có trong repo: `src/config/contact.ts`, commit `db78738` (Production 2B).
  - Chỉ bắt buộc `verifiedBy` cho nội dung y khoa.
  - Hoặc lưu bản Directive 017-A vào `docs/directives/`.

### P3

Xem mục 7, các mục 1 đến 7.

## 12. OPEN DECISIONS

- **Danh sách hiện có:** 14 mục (DEC-01 → DEC-14).
- **Đề nghị chủ dự án:**
  1. **DEC-12/13:** xác nhận có đồng thuận về nguyên tắc không, và cho lưu một bản xác nhận ngắn vào `docs/decisions/`. Đây là điều kiện để đổi trạng thái từ "Approval record pending" sang "Approved".
  2. **Phụ thuộc `vercel.json`** (P2-1): cho phép sửa cấu hình deploy để có 404 thật và robots theo môi trường, hoặc chấp nhận soft 404 cho đến khi có quyết định DEC-14.
  3. **Căn cứ hotline:** chấp nhận `src/config/contact.ts` và mốc 2B đã nghiệm thu làm nguồn bằng chứng cho 3 dòng VERIFIED.
  4. **DEC-01 → DEC-11:** vẫn mở. Phải chốt trước khi đưa nội dung thật lên; không bắt buộc chốt trước khi code khung giao diện.

## 13. Đề xuất nghiệm thu

- **Verdict: PASS WITH FIXES.** Không còn P0/P1.
- Đề nghị **CEO trình chủ dự án xem xét nghiệm thu có điều kiện** tài liệu 3B-00, với các điều kiện:
  1. Xử lý 3B00F3-P2-1 và P2-2 trước, hoặc ngay đầu 3B-01 (chỉ sửa tài liệu).
  2. Dọn các P3-1 đến P3-6 trong cùng lần sửa đó.
  3. Mọi dòng PENDING giữ nguyên nhãn trên UI cho đến khi có văn bản duyệt (điều kiện chặn Production đã ghi trong Evidence Gate).
- Claude **không** tự phê duyệt 3B-01 hay Architecture Spike 01, và không tự khởi động bước sau.

**PHASE 3B-00 FIX 03 — PENDING OWNER ACCEPTANCE**
