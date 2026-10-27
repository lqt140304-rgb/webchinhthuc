# BÁO CÁO BÀN GIAO VÒNG SỬA TÀI LIỆU 3B-00 FIX 03 (PHASE 3B-00 FIX 03 HANDOFF)
## Bệnh viện Thú y Lê Sơn 2026 — Hoàn Thiện Triệt Để Hai Lỗi P1, Đồng Bộ Wireframe, Quản Trị DEC-12/13 & Tiêu Chí Kiểm Thử SEO

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 046-A**; Báo cáo Claude QA Fix 02 `docs/qa/3b-00-fix02-qa.md` (Nhánh: `claude/3b-00-fix02-qa`, Commit: `e0bdeec`) |
| **Agent thực hiện** | Antigravity — Documentation Owner & UX Architect |
| **Ngày bàn giao** | 28/10/2026 |
| **Nhánh làm việc** | `docs/phase-3b-00` |
| **Baseline tài liệu Fix 02**| `ddb066f16819fd451037721f8c5cba3c6b383bef` |
| **Mã nguồn cơ sở 3A** | `4739d45cc95100b587381b6bdcad6935352b23e8` (Nghiệm thu có điều kiện) |
| **Trạng thái tài liệu** | **HOÀN THÀNH TOÀN DIỆN FIX 03 — SẴN SÀNG CHO CLAUDE RETEST ĐỘC LẬP** |
| **Cam kết giới hạn** | **100% DOCUMENTATION FIX ONLY** — Tuyệt đối không can thiệp `src/`, `public/`, CSS, assets, config; Không deploy Vercel; Không merge `main`. |

---

## 1. TỔNG HỢP DANH MỤC FILE THAY ĐỔI TRONG VÒNG FIX 03

100% thay đổi nằm trong thư mục `docs/`, sử dụng tuyệt đối đường dẫn tương đối, không sửa bất kỳ dòng mã nguồn nào của ứng dụng:

| STT | File đường dẫn tương đối | Phiên bản | Nội dung thay đổi chính trong Fix 03 |
|:---:|---|:---:|---|
| **01** | [`docs/decisions/3b-dec-12-13-policy-record.md`](../decisions/3b-dec-12-13-policy-record.md) | **TẠO MỚI** | Văn bản hồ sơ chính sách ghi nhận nguyên tắc DEC-12 và DEC-13; trạng thái chuẩn xác: `POLICY ACCEPTED IN PRINCIPLE / FORMAL APPROVAL RECORD PENDING`; phân định rõ 3 thẩm quyền độc lập (Chủ trương chính sách, Xác minh chuyên môn y tế, Phê duyệt công bố bằng văn bản); ngăn chặn gán tên AI Agent vào thẩm quyền phòng khám. |
| **02** | [`docs/phase-3b/3b-00-content-evidence-gate.md`](../phase-3b/3b-00-content-evidence-gate.md) | **v1.3** | Cập nhật trạng thái DEC-12/13 thành `POLICY ACCEPTED IN PRINCIPLE / FORMAL APPROVAL RECORD PENDING`; làm rõ thứ bậc Cấp 1 phân biệt chỉ đạo trực tiếp của Chủ dự án (Owner Directives) với chỉ đạo điều phối của CEO (CEO Directives từ ChatGPT không thay thế văn bản ký của Chủ dự án); bổ sung mục kiểm tra bắt buộc tính nhất quán của Hotline/liên hệ với `HOSPITAL_CONTACT` trong `src/config/contact.ts`. |
| **03** | [`docs/phase-3b/3b-00-content-mapping.md`](../phase-3b/3b-00-content-mapping.md) | **v1.3** | **Đóng P1-2:** Hạ `DV-HERO-05` từ `VERIFIED` về `PENDING` (căn cứ `3B-DEC-12`, người duyệt `—`, ngày duyệt `—`); đồng nhất câu chữ thông báo banner; sửa tên `DV-GRP4-01` (bỏ "24/7"); làm sạch `DV-GRP1-02` (bỏ "đo sinh hiệu"); kiểm kê chính xác 68 hạng mục: **3 VERIFIED**, **64 PENDING**, **1 ILLUSTRATIVE**. |
| **04** | [`docs/phase-3b/3b-00-blueprint.md`](../phase-3b/3b-00-blueprint.md) | **v1.3** | **Đóng P1-1:** Xóa bỏ hoàn toàn số hotline sai `0988 565 056` tại §7.1.5; ràng buộc dữ liệu có cấu trúc SEO động với `HOSPITAL_CONTACT` trong `src/config/contact.ts` (`097 355 51 05`); đồng bộ hóa câu chữ Hero §4.2 với Wireframe; gỡ bỏ lời khuyên nhịn ăn chưa xác minh; gỡ bỏ "24/7" khỏi Nhóm 04; chốt yêu cầu HTTP 404 thực tế (không chấp nhận Soft 404); bổ sung kiến trúc Client-side head manager và tiêu chí kiểm thử GET raw HTML; cập nhật 14 OPEN DECISIONS (bổ sung DEC-14 về hướng nghiên cứu Framework Mode / Prerender). |
| **05** | [`docs/phase-3b/3b-00-wireframe.md`](../phase-3b/3b-00-wireframe.md) | **v1.3** | **Hoàn thiện P2-7:** Gắn nhãn `[Đề xuất / PENDING - DEC-12]` cho Hero Eyebrow, H1, Intro của cả `/dich-vu` và `/bang-gia`; thống nhất text thông báo banner; bỏ "đến khu nội trú" khỏi H1; gỡ bỏ "24/7" khỏi Nhóm 04 Desktop và Mobile; gỡ bỏ lời khuyên nhịn ăn ở Nhóm 03; gắn nhãn `[Đề xuất]` trên toàn bộ headers Nhóm 01–05 và các thẻ Mobile; đồng bộ H1 Mobile `/bang-gia`. |
| **06** | [`docs/phase-3b/3b-00-data-schema.md`](../phase-3b/3b-00-data-schema.md) | **v1.3** | Bổ sung ràng buộc bắt buộc: khi `verificationStatus === 'VERIFIED'` thì cả `ServiceCategory` và `Service` bắt buộc phải có `approvedBy !== null`, `approvedAt !== null` và `approvalReference !== null`; tham chiếu `3b-dec-12-13-policy-record.md`; gỡ bỏ lời khuyên nhịn ăn trong test fixture phẫu thuật. |
| **07** | [`docs/phase-3b/3b-00-acceptance-criteria.md`](../phase-3b/3b-00-acceptance-criteria.md) | **v1.3** | Cập nhật AC-DOC-02 (đúng 3 VERIFIED, 64 PENDING, 1 ILLUSTRATIVE); bổ sung AC-DOC-12 (Contact Consistency Gate); cập nhật AC-DOC-10 (SEO Metadata Gate bind động `HOSPITAL_CONTACT`); cập nhật AC-DOC-11 (DEC-12/13 status); cập nhật AC-COD-07 (SEO raw HTML test); AC-COD-08 (HTTP 404 thực tế); bổ sung AC-COD-09 (Dynamic contact binding); cập nhật AC-PRV-01 (CLS chuẩn $< 0.1$, benchmark $0.000$); bổ sung AC-PRV-07 (Kiểm định Scraper / Raw HTML). |
| **08** | [`docs/qa/3b-00-fix03-handoff.md`](3b-00-fix03-handoff.md) | **TẠO MỚI** | Báo cáo bàn giao chi tiết vòng sửa Fix 03 theo chỉ đạo CEO Directive 046-A. |

---

## 2. BẢNG ĐỐI CHIẾU XỬ LÝ HAI LỖI P1 TỪ CLAUDE QA FIX 02

| Mã lỗi | Mô tả phát hiện của Claude QA | Biện pháp kỹ thuật đã xử lý trong Fix 03 | File tài liệu liên quan | Kết quả thẩm định |
|---|---|---|---|:---:|
| **P1-1** | **Hotline sai trong cấu trúc SEO Schema.org**: Tại dòng 367 Blueprint §7.1.5 xuất hiện số `0988 565 056` mâu thuẫn hoàn toàn với hotline chuẩn `097 355 51 05` (quy định tại `src/config/contact.ts` và Directive 017-A). | - **Xóa bỏ hoàn toàn số điện thoại hardcoded sai lệch** khỏi Mục 7.1.5 của `3b-00-blueprint.md`.<br>- **Ràng buộc động 100% dữ liệu Schema.org LocalBusiness**: Bắt buộc trường `telephone` phải import và trích xuất trực tiếp từ hằng số `HOSPITAL_CONTACT.hotlineDisplay` / `HOSPITAL_CONTACT.hotlineTel` trong file mã nguồn chuẩn `src/config/contact.ts`.<br>- Bổ sung tiêu chí nghiệm thu **AC-DOC-12** (Contact Consistency Gate) và **AC-COD-09** (Dynamic Contact Binding) vào Acceptance Criteria.<br>- Rà soát toàn bộ repo: Hiện tại 0% tài liệu còn sót lại số điện thoại sai, ngoại trừ điều khoản cấm rõ ràng trong Evidence Gate. | `3b-00-blueprint.md` §7.1.5<br>`3b-00-acceptance-criteria.md`<br>`3b-00-content-evidence-gate.md` | **ĐÃ ĐÓNG TRIỆT ĐỂ** |
| **P1-2** | **`DV-HERO-05` tự gắn VERIFIED không có căn cứ**: Trích dẫn Directive 042-A/044-A nhưng ChatGPT CEO không phải Owner; repo chưa có văn bản phê duyệt câu chữ cụ thể của Chủ dự án; mâu thuẫn câu chữ giữa Blueprint, Wireframe và Content Mapping; mâu thuẫn DEC-09 chưa đóng. | - **Hạ ngay `DV-HERO-05` từ `VERIFIED` về `PENDING`** trong `3b-00-content-mapping.md`.<br>- Cập nhật căn cứ: `3B-DEC-12 (Chủ trương chính sách)`, người duyệt: `—`, ngày duyệt: `—`.<br>- **Thống nhất tuyệt đối một phiên bản câu chữ duy nhất** trên cả 3 tài liệu: *"Danh mục dịch vụ và biểu phí đang được đối chiếu hoàn thiện. Mọi phác đồ can thiệp và dự toán chi phí cụ thể sẽ được bác sĩ trao đổi trực tiếp khi tiếp nhận thăm khám thú cưng."*<br>- Giữ nguyên quyết định **DEC-09 ở trạng thái MỞ (OPEN)**, không đóng khi chưa có văn bản phê duyệt của Chủ dự án.<br>- Lập văn bản hồ sơ chính sách [`docs/decisions/3b-dec-12-13-policy-record.md`](../decisions/3b-dec-12-13-policy-record.md) ghi nhận trạng thái: `POLICY ACCEPTED IN PRINCIPLE / FORMAL APPROVAL RECORD PENDING`. | `3b-00-content-mapping.md`<br>`3b-00-blueprint.md` §4.2, §10<br>`3b-00-wireframe.md` §2.1, §2.2<br>`docs/decisions/3b-dec-12-13-policy-record.md` | **ĐÃ ĐÓNG TRIỆT ĐỂ** |

---

## 3. BẢNG ĐỐI CHIẾU XỬ LÝ LỖI P2-7 (ĐỒNG BỘ WIREFRAME)

| Vị trí phát hiện còn thiếu nhãn trong Fix 02 | Biện pháp kỹ thuật đã xử lý trong Fix 03 | Trạng thái sau Fix 03 |
|---|---|:---:|
| **Hero Eyebrow, H1, Intro của `/dich-vu` (Desktop & Mobile)** chưa có nhãn `[Đề xuất]`. Cụm từ "đến khu nội trú" trong H1 gợi ý phạm vi chưa xác thực. | - Thêm nhãn `[Đề xuất / PENDING - DEC-12]` cho cả Eyebrow, H1 và Intro.<br>- Rút gọn H1 thành: *"Hệ thống chăm sóc sức khỏe thú cưng tận tâm"* (bỏ cụm từ "đến khu nội trú / đến nội trú"). | **ĐÃ XỬ LÝ HOÀN TOÀN** |
| **Nhóm 01 (Khám & Điều trị):** Cụm từ "chẩn đoán đúng" mang tính khẳng định cam kết chuyên môn. | - Bỏ cụm từ "chẩn đoán đúng", chuẩn hóa thành: `[Đề xuất] Thăm khám cẩn trọng, điều trị chu đáo`. | **ĐÃ XỬ LÝ HOÀN TOÀN** |
| **Nhóm 03 (Phẫu thuật ngoại khoa):** Lời khuyên "chuẩn bị nhịn ăn" chưa được bác sĩ phụ trách xác nhận (DEC-08 mở). | - Gỡ bỏ hoàn toàn hướng dẫn nhịn ăn cụ thể.<br>- Thay bằng: `Trao đổi trước với bác sĩ về tiền sử dị ứng và lưu ý chăm sóc [Đề xuất - Chờ bác sĩ xác nhận]`. Đồng bộ trong cả Wireframe, Blueprint và Schema Fixture. | **ĐÃ XỬ LÝ HOÀN TOÀN** |
| **Nhóm 04 (Lưu trú y tế nội trú):** Tiêu đề vẫn mang hậu tố "24/7" trên Desktop và Mobile trong khi DEC-07 đang MỞ. | - Xóa bỏ toàn bộ chữ "24/7" khỏi tiêu đề Nhóm 04.<br>- Đổi tên thành: `NHÓM 04 — LƯU TRÚ Y TẾ NỘI TRÚ [Đề xuất]`.<br>- Thanh Jump Bar đổi từ `[ Nội trú 24/7 ]` sang `[ Lưu trú nội trú ]`.<br>- Ghi rõ trạng thái chờ xác nhận phương án phân khu, nhân sự và quy trình công bố theo DEC-07. | **ĐÃ XỬ LÝ HOÀN TOÀN** |
| **Header các nhóm dịch vụ trên Mobile** (Nhóm 01, 02, 03, 04, 05 và các Thẻ con 1–3) thiếu nhãn đề xuất. | - Thêm đầy đủ nhãn `[Đề xuất]` vào toàn bộ header các nhóm 01–05 và các thẻ con trên bản vẽ Mobile. | **ĐÃ XỬ LÝ HOÀN TOÀN** |
| **Trang `/bang-gia` (Desktop & Mobile):** Hero Eyebrow, H1, Intro thiếu nhãn; H1 Mobile lệch câu chữ với Desktop. | - Bổ sung nhãn `[Đề xuất / PENDING - DEC-12]` cho Eyebrow, H1, Intro của `/bang-gia`.<br>- Đồng bộ H1 Mobile khớp với Desktop: `BẢNG GIÁ DỊCH VỤ NIÊM YẾT [Đề xuất]`.<br>- Tab lọc đổi từ `[ Nội trú ]` sang `[ Lưu trú nội trú ]`.<br>- Accordion item lưu ý y khoa gắn rõ: `[Đề xuất áp dụng]`.<br>- Quy trình 3 bước gắn nhãn: `[Đề xuất quy trình - DEC-09]`. | **ĐÃ XỬ LÝ HOÀN TOÀN** |

---

## 4. QUẢN TRỊ QUYẾT ĐỊNH CHÍNH SÁCH DEC-12 & DEC-13

Để giải quyết tận gốc rủi ro quản trị được chỉ ra trong báo cáo QA:
1. **Tạo lập văn bản hồ sơ chính sách độc lập:**
   - File: [`docs/decisions/3b-dec-12-13-policy-record.md`](../decisions/3b-dec-12-13-policy-record.md)
   - Trạng thái chuẩn xác: **`POLICY ACCEPTED IN PRINCIPLE / FORMAL APPROVAL RECORD PENDING`**.
   - Không bịa đặt chữ ký, ngày phê duyệt hoặc số hiệu văn bản khi Chủ dự án chưa ký phát hành.
2. **Phân định rõ 3 thẩm quyền tách biệt:**
   - **Chủ trương chính sách (Policy Approval):** Người dùng/Chủ dự án chấp thuận về mặt nguyên tắc thiết kế.
   - **Xác minh chuyên môn (Clinical Verification):** Bác sĩ phụ trách chuyên môn ký xác nhận (`verifiedBy`), không gán cho AI agent hay CEO điều phối.
   - **Phê duyệt công bố bằng văn bản (Publication Approval):** Chủ dự án ký duyệt chính thức (`approvedBy`), lưu văn bản vào repository trước khi chuyển sang `VERIFIED`.
3. **Quy tắc tuyệt đối:** AI Agent (Antigravity, Claude, ChatGPT) chỉ là công cụ soạn thảo/QA, tuyệt đối không được tự ý đứng tên người duyệt trong dữ liệu.

---

## 5. HOÀN THIỆN TIÊU CHÍ KIỂM THỬ SEO & KIẾN TRÚC CLIENT-SIDE (P2-9 & ARCHITECTURE SPIKE 01)

1. **Làm rõ kiến trúc hiển thị SEO cho SPA:**
   - Công nghệ quản lý thẻ head phía client: `react-helmet-async`.
   - Mục đích: Đảm bảo tiêu đề, meta description, canonical, OG tags được cập nhật linh hoạt theo từng trang client-side.
2. **Tiêu chuẩn kiểm thử Raw HTML Scraper Gate:**
   - Bổ sung yêu cầu trong AC-COD-07 và AC-PRV-07: Khi kiểm thử bằng lệnh `curl` hoặc scraper HTTP GET trực tiếp không thông qua trình thông dịch JavaScript, nếu công cụ tìm kiếm không thực thi JS thì các thẻ meta cơ bản phải có cơ chế hỗ trợ phù hợp.
3. **Định hướng nghiên cứu DEC-14 (Architecture Spike 01):**
   - Đã đưa vào Blueprint §10 quyết định mở **3B-DEC-14: Nghiên cứu hướng Prerender / React Router Framework Mode**.
   - Trạng thái được ghi rõ: **`RESEARCH DIRECTION SELECTED / IMPLEMENTATION NOT APPROVED`**.
   - Cam kết: Không thực hiện bất kỳ thay đổi kiến trúc hoặc di chuyển framework nào trong phạm vi Giai đoạn 3B-00.
4. **Bảo vệ tuyến đường & HTTP 404 thực tế (No Soft 404):**
   - AC-COD-08 quy định rõ: Các đường dẫn ngoài phạm vi (`/dich-vu/:slug`, `/bang-gia/:slug`) phải trả về mã trạng thái HTTP 404 thực tế tại tầng routing/server edge, không chấp nhận lỗi Soft 404 trả về HTTP 200.
5. **Điều chỉnh chỉ số CLS thực tế:**
   - AC-PRV-01 đã được điều chỉnh từ con số phi thực tế $\le 0.001$ thành **$\text{CLS} < 0.1$** (chuẩn Good của Google Core Web Vitals), đồng thời giữ mục tiêu benchmark $0.000$ như kết quả thực tế đã đạt được ở Mốc 2A/2B/3A.

---

## 6. KẾT QUẢ KIỂM KÊ DỮ LIỆU CONTENT MAPPING V1.3

Thực hiện kiểm kê tự động độc lập bằng script Node.js trên file `3b-00-content-mapping.md`:

```bash
node -e "const fs = require('fs'); const content = fs.readFileSync('docs/phase-3b/3b-00-content-mapping.md', 'utf8'); const lines = content.split('\n').filter(l => l.includes('`DV-') || l.includes('`BG-')); const counts = {}; lines.forEach(l => { const cols = l.split('|'); const status = cols[8] ? cols[8].trim().replace(/\*/g, '') : 'UNKNOWN'; counts[status] = (counts[status] || 0) + 1; }); console.log(counts);"
# Kết quả: { PENDING: 64, ILLUSTRATIVE: 1, VERIFIED: 3 }
```

- **Tổng số hạng mục:** **68 hạng mục**.
- **Số hạng mục `VERIFIED`:** **Đúng 3 hạng mục** (100% kế thừa từ Mốc 2A/2B đã được Chủ dự án duyệt tại Directive 017-A):
  1. `DV-EMG-01`: Cấp cứu thú cưng 24/24 tại 101 Khuất Duy Tiến.
  2. `DV-EMG-03`: Nút gọi hotline cấp cứu `097 355 51 05`.
  3. `BG-CTA-03`: Nút gọi tư vấn hotline `097 355 51 05`.
- **Số hạng mục `PENDING`:** **64 hạng mục** (bao gồm `DV-HERO-05` vừa hạ trạng thái).
- **Số hạng mục `ILLUSTRATIVE`:** **1 hạng mục** (`DV-GRP1-07` — Khung ảnh minh họa khám thú cưng).
- **Số người duyệt không hợp lệ:** **0** (không có tên AI Agent trong cột người duyệt).

---

## 7. BẢNG TỰ KIỂM TRA ĐỐI CHIẾU (SELF-AUDIT CHECKLIST)

- [x] **Zero Code Changes:** 100% thay đổi nằm trong `docs/`. Thư mục `src/`, `public/`, `package.json`, cấu hình Tailwind/Vite hoàn toàn nguyên vẹn.
- [x] **Zero Deployment:** Không chạy lệnh `vercel`, không tạo preview deployment mới.
- [x] **Zero Merge:** Không thao tác merge vào nhánh `main`.
- [x] **Zero Hardcoded Wrong Phone Numbers:** Không còn bất kỳ số điện thoại `0988 565 056` nào tồn tại trong tài liệu ngoài điều khoản cấm.
- [x] **Consistent Contact Info:** 100% thông tin liên hệ được đối chiếu trực tiếp với `HOSPITAL_CONTACT` trong `src/config/contact.ts`.
- [x] **Zero Phantom Approvers:** Không gán Antigravity, Claude, ChatGPT CEO vào người duyệt phòng khám.
- [x] **Taxonomy Consistency:** 5 nhóm danh mục và bộ slug (`kham-dieu-tri`, `can-lam-sang`, `phau-thuat`, `noi-tru`, `spa-grooming`) đồng nhất 100% trên cả 5 tài liệu.
- [x] **Relative Links:** 100% liên kết tài liệu là đường dẫn tương đối chuẩn của Git.

---

**PHASE 3B-00 FIX 03 — READY FOR CLAUDE QA**
