# BÁO CÁO BÀN GIAO VÒNG SỬA TÀI LIỆU 3B-00 FIX 02 (PHASE 3B-00 FIX 02 HANDOFF)
## Bệnh viện Thú y Lê Sơn 2026 — Chuẩn Hóa Toàn Diện Khung Kiểm Soát Bằng Chứng & Kiến Trúc Dịch Vụ 3B

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 044-A**; Báo cáo Claude QA Fix 01 `docs/qa/3b-00-fix01-qa.md` (Nhánh: `claude/3b-00-fix01-qa`, Commit: `b9f386b`) |
| **Agent thực hiện** | Antigravity — UX Architect & Documentation Owner |
| **Ngày bàn giao** | 28/10/2026 |
| **Nhánh làm việc** | `docs/phase-3b-00` |
| **Baseline tài liệu Fix 01**| `9074aa6cbffbe7c7f3b529071fd93c6216f43916` |
| **Mã nguồn cơ sở 3A** | `4739d45cc95100b587381b6bdcad6935352b23e8` (Nghiệm thu có điều kiện) |
| **Trạng thái tài liệu** | **HOÀN THÀNH TOÀN DIỆN FIX 02 — SẴN SÀNG CHO CLAUDE RETEST ĐỘC LẬP** |
| **Cam kết giới hạn** | **100% DOCUMENTATION FIX ONLY** — Tuyệt đối không can thiệp `src/`, CSS, assets, config; Không deploy Vercel; Không merge `main`. |

---

## 1. TỔNG HỢP DANH MỤC FILE THAY ĐỔI TRONG VÒNG FIX 02

Toàn bộ 100% thay đổi nằm trong thư mục `docs/`, sử dụng tuyệt đối đường dẫn tương đối (loại bỏ hoàn toàn tiền tố `file:///d:/...`):

| STT | File đường dẫn tương đối | Phiên bản | Nội dung thay đổi chính trong Fix 02 |
|:---:|---|:---:|---|
| **01** | [`docs/phase-3b/3b-00-content-evidence-gate.md`](../phase-3b/3b-00-content-evidence-gate.md) | **v1.2** | Bổ sung lược đồ thực thể Evidence Record (`contentId`, `contentVersion`, `contentText`, `evidenceSource`, `verifiedBy`, `verifiedAt`, `approvedBy`, `approvedAt`, `approvalReference`, `publicationScope`, `verificationStatus`); chuẩn hóa chính sách DEC-12 và DEC-13; làm rõ trạng thái `PROPOSED` là authoring design tag, về mặt quản trị mang giá trị pháp lý tương đương `PENDING`. |
| **02** | [`docs/phase-3b/3b-00-content-mapping.md`](../phase-3b/3b-00-content-mapping.md) | **v1.2** | Hạ toàn bộ 9 mục chưa có căn cứ văn bản (`DV-HERO-02`, `03`, `04`, `DV-GRP4-04`, `DV-NOTE-02`, `BG-HEAD-02`, `03`, `04`, `BG-PROC-01`) về `PENDING`; xóa bỏ tên AI agent khỏi cột người duyệt `verifiedBy`; kiểm kê chính xác 68 hạng mục: **4 VERIFIED**, **63 PENDING**, **1 ILLUSTRATIVE**; thay thế mọi link `file:///` bằng đường dẫn tương đối. |
| **03** | [`docs/phase-3b/3b-00-blueprint.md`](../phase-3b/3b-00-blueprint.md) | **v1.2** | Xóa cụm từ "cách ly theo dõi" tại dòng 108; trung tính hóa phương án nhân sự theo dõi y tế (xóa giả định "kíp trực"); bổ sung **Mục 7: Đặc tả SEO Metadata Gate** (`<title>`, description, canonical placeholder, Open Graph tags, robots policy, Schema.org JSON-LD rules không chứa PENDING); cập nhật 13 OPEN DECISIONS (bổ sung DEC-12 và DEC-13); thay link `file:///` bằng link tương đối. |
| **04** | [`docs/phase-3b/3b-00-wireframe.md`](../phase-3b/3b-00-wireframe.md) | **v1.2** | Gắn nhãn `[Đề xuất]` / `[Đề xuất nội dung]` lên toàn bộ các heading, card, accordion items chưa xác minh (P2-7); trung tính hóa ví dụ tìm kiếm (`ví dụ: khám tổng quát, tiêm phòng...`); gắn nhãn `[Đề xuất quy trình]` trên cả Desktop và Mobile cho Quy trình 3 bước; trung tính hóa nhân sự theo dõi y tế; loại bỏ `role="region"` dư thừa; cập nhật v1.2. |
| **05** | [`docs/phase-3b/3b-00-data-schema.md`](../phase-3b/3b-00-data-schema.md) | **v1.2** | Cập nhật ERD và từ điển dữ liệu tích hợp đầy đủ trường Evidence Record (`approvedBy`, `approvedAt`, `approvalReference`, `publicationScope`); giải thích giá trị pháp lý của `PROPOSED`; trung tính hóa 100% fixture thử nghiệm (thay `sinh hiệu`, `sát khuẩn`, `hồi tỉnh` bằng các chuỗi mô tả mẫu an toàn); cập nhật v1.2. |
| **06** | [`docs/phase-3b/3b-00-acceptance-criteria.md`](../phase-3b/3b-00-acceptance-criteria.md) | **v1.2** | Bổ sung tiêu chí AC-DOC-10 (SEO Metadata Gate) và AC-DOC-11 (Phân định thẩm quyền DEC-12/13); bổ sung AC-COD-07, AC-COD-08, AC-PRV-05, AC-PRV-06; giữ nguyên 100% trạng thái `NOT TESTED (Chờ QA)` và các giai đoạn sau; cập nhật v1.2. |
| **07** | [`docs/qa/3b-00-fix02-handoff.md`](3b-00-fix02-handoff.md) | **TẠO MỚI** | Báo cáo bàn giao chi tiết vòng sửa Fix 02 theo chỉ đạo CEO Directive 044-A. |

---

## 2. BẢNG ĐỐI CHIẾU XỬ LÝ TRIỆT ĐỂ LỖI P1-3 (CONTENT EVIDENCE GATE)

| Vấn đề phát hiện bởi Claude QA Fix 01 | Biện pháp kỹ thuật đã xử lý trong Fix 02 | Trạng thái sau Fix 02 |
|---|---|:---:|
| **9 dòng trong Content Mapping tự gắn VERIFIED** với lý do "Văn phong chuẩn mực", "Tôn chỉ thương hiệu", hoặc trích dẫn ngày quá khứ 26/10 cho nội dung mới viết ngày 28/10 (`DV-HERO-02`, `DV-HERO-03`, `DV-HERO-04`, `DV-GRP4-04`, `DV-NOTE-02`, `BG-HEAD-02`, `BG-HEAD-03`, `BG-HEAD-04`, `BG-PROC-01`). | - **Hạ toàn bộ 9 dòng về `PENDING`**, đặt cột Người duyệt thành `—` và Ngày duyệt thành `—`.<br>- Đối chiếu lại căn cứ: Các văn bản 26/10 chỉ duyệt thông tin phòng khám chung (Địa chỉ, Hotline, Giờ làm việc, Cấp cứu 24/24), không duyệt câu chữ marketing hay quy trình chi tiết 3B.<br>- Áp dụng nguyên tắc: Không có chữ ký duyệt văn bản cụ thể thì bắt buộc là `PENDING`. | **ĐÃ XỬ LÝ TRIỆT ĐỂ** |
| **Số liệu thống kê Mapping không khớp thực tế** (báo cáo cũ ghi 12 VERIFIED trong khi thực đếm là 13; số lượng PENDING không trùng khớp). | - Rà soát từng dòng một trên toàn bộ 68 mục của bảng Content Mapping v1.2.<br>- Phân loại chính xác: **4 mục VERIFIED** (gồm: `DV-HERO-05` Policy Banner mandated, `DV-EMG-01` Gateway 24/24 đã duyệt Mốc 2B, `DV-EMG-03` Hotline 097 355 51 05, `BG-CTA-03` Hotline 097 355 51 05), **63 mục PENDING**, **1 mục ILLUSTRATIVE**.<br>- Tổng cộng: $4 + 63 + 1 = 68$ mục, khớp 100% với bảng thống kê. | **ĐÃ XỬ LÝ TRIỆT ĐỂ** |
| **Trạng thái `PROPOSED / PENDING` chưa có trong Evidence Gate**. | - Bổ sung định nghĩa chuẩn hóa trong `3b-00-content-evidence-gate.md` §2.4: `PROPOSED` là tag phân loại thiết kế UI/UX (Authoring Design Tag), về mặt quản trị kiểm soát bằng chứng mang giá trị pháp lý tương đương `PENDING`. | **ĐÃ XỬ LÝ TRIỆT ĐỂ** |

---

## 3. BẢNG ĐỐI CHIẾU XỬ LÝ 3 LỖI P2 TỪ CLAUDE QA FIX 01

| Mã lỗi | Mô tả phát hiện | Biện pháp kỹ thuật đã khắc phục trong vòng Fix 02 | File tài liệu liên quan | Đánh giá |
|---|---|---|---|:---:|
| **3B00F-P2-7** | **Wireframe thiếu nhãn PENDING ở nhiều vị trí**: H2 nhóm 3.2, "thời gian hồi tỉnh", H2 nhóm 3.4, "sản phẩm vệ sinh", Lưu ý 02-03, header nhóm mobile, thẻ quy trình /bang-gia, accordion demo viết như sự thật. | - Thêm nhãn `[Đề xuất]` / `[Đề xuất nội dung]` vào toàn bộ H2 nhóm 3.2, 3.4, 3.5 và các mô tả đi kèm.<br>- Gỡ bỏ giả định "thời gian hồi tỉnh", thay bằng "Tư vấn về chỉ định và hướng dẫn chăm sóc thú cưng".<br>- Bổ sung `[Đề xuất hướng dẫn]` cho Lưu ý 02 và 03.<br>- Đồng bộ nhãn `[Đề xuất]` trên header mobile Cận lâm sàng & Xét nghiệm.<br>- Gắn `[Đề xuất quy trình]` cho cả 3 bước quy trình báo giá trên desktop và mobile.<br>- Gắn nhãn `[Đề xuất minh họa]` cho nội dung accordion mẫu ban đầu. | `3b-00-wireframe.md` | **ĐÃ XỬ LÝ TRIỆT ĐỂ** |
| **3B00F-P2-8** | **Tự duyệt (Self-approval)**: Antigravity đứng tên người duyệt ở 8 dòng VERIFIED. | - Gỡ bỏ 100% tên Antigravity khỏi cột Người duyệt `verifiedBy` và `approvedBy` trên tất cả các bảng.<br>- Ban hành chính sách **DEC-13**: Quy định AI Agent (Antigravity, Claude, ChatGPT CEO) chỉ là công cụ soạn thảo/QA, tuyệt đối không được gán thẩm quyền duyệt phòng khám.<br>- Người duyệt chỉ bao gồm: Chủ dự án (chính sách, thương hiệu, giá, công bố) và Bác sĩ chuyên môn (quy trình y tế). | `3b-00-content-evidence-gate.md`<br>`3b-00-content-mapping.md`<br>`3b-00-data-schema.md` | **ĐÃ XỬ LÝ TRIỆT ĐỂ** |
| **3B00F-P2-9** | **Thiếu đặc tả SEO Metadata Gate**: Chưa có `<title>`, description, canonical, OG tags, robots policy và chính sách Schema.org / JSON-LD cho 2 tuyến đường. | - Bổ sung toàn diện **Mục 7: Đặc tả SEO Metadata Gate** vào `3b-00-blueprint.md`.<br>- Đặc tả chi tiết từng thẻ meta cho `/dich-vu` và `/bang-gia` (Title, Description $< 160$ ký tự, Canonical URL dạng placeholder `https://[domain-chinh-thuc]/...`, OG tags, OG Image $1200 \times 630\text{px}$).<br>- Quy định nghiêm ngặt Schema.org JSON-LD: **Tuyệt đối KHÔNG đưa dịch vụ PENDING hoặc giá chưa xác minh vào cấu trúc `Offer`**.<br>- Quy định xử lý HTTP 404 cho các route ngoài phạm vi (`/dich-vu/:slug`).<br>- Bổ sung tiêu chí AC-DOC-10, AC-COD-07, AC-COD-08, AC-PRV-05, AC-PRV-06 vào Acceptance Criteria. | `3b-00-blueprint.md`<br>`3b-00-acceptance-criteria.md` | **ĐÃ XỬ LÝ TRIỆT ĐỂ** |

---

## 4. XỬ LÝ CÁC PHÁT HIỆN P3

- **3B00F-P3-1 (Đường dẫn tuyệt đối `file:///d:/webbvct/...`):** Quét sạch 100% các file trong `docs/`, chuyển toàn bộ liên kết sang định dạng đường dẫn tương đối chuẩn của Git/Markdown (ví dụ: `3b-00-content-evidence-gate.md`).
- **3B00F-P3-2 (Từ khóa "cách ly theo dõi" tại dòng 108 Blueprint):** Đã sửa thành "Lưu trú chăm sóc y tế theo dõi [Chờ xác nhận danh mục]".
- **3B00F-P3-3 (Giả định "kíp trực"):** Đã thay thế các slot `[Chờ xác nhận quy trình kíp trực]` và `Kíp trực: [Chờ xác nhận]` thành `[Chờ xác nhận phương án nhân sự theo dõi y tế]`.
- **3B00F-P3-4 (Placeholder tìm kiếm "siêu âm"):** Đã trung tính hóa placeholder ô tìm kiếm từ `ví dụ: siêu âm, triệt sản...` thành `ví dụ: khám tổng quát, tiêm phòng...` để không tạo kỳ vọng trước khi DEC-04 được chốt.
- **3B00F-P3-5 (Chuẩn hóa định dạng ngày):** Toàn bộ ngày tháng trong bảng và schema được chuẩn hóa sang định dạng ISO 8601 (`YYYY-MM-DD`).
- **3B00F-P3-6 (Trung tính hóa sâu Fixtures mẫu):** Thay thế các cụm từ "sinh hiệu", "sát khuẩn", "hồi tỉnh" trong test fixtures bằng các chuỗi mô tả mẫu an toàn (`['Thao tác vệ sinh cơ bản mẫu', 'Chăm sóc theo dõi mẫu']`).

---

## 5. ÁP DỤNG DEC-12 VÀ DEC-13 & DANH SÁCH 13 QUYẾT ĐỊNH MỞ (OPEN DECISIONS)

Toàn bộ 13 quyết định mở đã được tích hợp đầy đủ vào Mục 10 của `3b-00-blueprint.md`:

| Mã quyết định | Tên quyết định | Nội dung & Thẩm quyền phê duyệt | Trạng thái hiện tại |
|---|---|---|:---:|
| **3B-DEC-01** | Phương thức công bố biểu phí | Cung cấp biểu phí rút gọn hay giữ toàn bộ `UNAVAILABLE` / `CONTACT`? | Chờ Chủ dự án quyết định |
| **3B-DEC-02** | Điều hướng 4 route con ComingSoon | Giữ nguyên ComingSoon hay cho phép chuyển thành anchor link trong nhiệm vụ riêng? | Chờ Chủ dự án quyết định |
| **3B-DEC-03** | Chính sách phụ phí ngoài giờ/ngày lễ | Có áp dụng phụ phí trực cấp cứu đêm (21:00 – 08:00) không và mức phí là bao nhiêu? | Chờ Chủ dự án quyết định |
| **3B-DEC-04** | Danh mục dịch vụ kỹ thuật thực tế | Phê duyệt danh sách chính thức các dịch vụ được công bố (phẫu thuật, triệt sản, X-quang...). | Chờ Chủ dự án & BS. Sơn |
| **3B-DEC-05** | Taxonomy chuẩn hóa 5 nhóm | Phê duyệt bộ 5 nhóm chuẩn (`kham-dieu-tri`, `can-lam-sang`, `phau-thuat`, `noi-tru`, `spa-grooming`). | Chờ Chủ dự án phê duyệt |
| **3B-DEC-06** | Vai trò chuyên môn BS. Lê Thái Sơn | Có công bố phạm vi phụ trách chuyên môn cụ thể hay chỉ giữ vai trò người sáng lập? | Chờ Chủ dự án quyết định |
| **3B-DEC-07** | Cơ sở vật chất & nội trú công bố | Xác nhận các thiết bị và cơ sở vật chất thực tế tại 101 Khuất Duy Tiến được công bố. | Chờ Chủ dự án xác nhận |
| **3B-DEC-08** | Lời khuyên y khoa trước khám | Phê duyệt nội dung hướng dẫn chuẩn bị (nhịn ăn, lồng vận chuyển, sổ tiêm phòng). | Chờ Chủ dự án & BS. Sơn |
| **3B-DEC-09** | Cam kết tư vấn chi phí | Phê duyệt câu chữ cam kết giải thích dự toán chi phí trước khi can thiệp. | Chờ Chủ dự án phê duyệt |
| **3B-DEC-10** | Tham số `?service=` trên BookingPage | Cho phép mở nhánh sửa `BookingPage.tsx` hay giữ nguyên điều hướng đơn thuần? | Chờ Chủ dự án quyết định |
| **3B-DEC-11** | Phân tầng giá theo cân nặng | Xác định các nấc cân nặng cho dịch vụ spa grooming và nội trú lưu chuồng. | Chờ Chủ dự án ban hành |
| **3B-DEC-12** | Phê duyệt văn bản Hero & Heading 3B | Chủ dự án phê duyệt bằng văn bản cho câu chữ Hero/Heading (`DV-HERO-02/03/04`, `BG-HEAD-02/03/04`) trước khi chuyển `VERIFIED`. | Chờ Chủ dự án ký duyệt |
| **3B-DEC-13** | Quy ước thẩm quyền người duyệt | Quy ước Chủ dự án và Bác sĩ là người duyệt duy nhất; cấm AI Agent tự duyệt; lưu văn bản chỉ đạo trong Git repo. | **ĐÃ THIẾT LẬP NGUYÊN TẮC** |

---

## 6. BẢNG TỰ KIỂM TRA CHẤT LƯỢNG HỒ SƠ TÀI LIỆU (SELF-AUDIT CHECKLIST)

- [x] **Không có liên kết `file:///`:** Đã quét toàn bộ repository, 100% liên kết là đường dẫn tương đối.
- [x] **Không có AI tự duyệt:** Cột `verifiedBy` và `approvedBy` không còn bất kỳ tên nào của Antigravity, Claude, hoặc ChatGPT.
- [x] **Không có claim bịa về BS. Sơn:** Tên BS. Sơn chỉ xuất hiện trong phần lưu ý phủ định và vai trò người duyệt (chờ duyệt).
- [x] **Không có claim cơ sở vật chất 3A đã bác bỏ:** Đã loại trừ hoàn toàn "khu cách ly", "khu hồi sức riêng", "trực đêm", "theo dõi sinh hiệu", "phòng mổ vô trùng", "máy gây mê" khỏi tư cách sự thật.
- [x] **Khóa biểu phí 100%:** Không có mức giá giả, không dùng 0 VNĐ, fixture hoàn toàn trung tính.
- [x] **Thống nhất Taxonomy 5 nhóm:** Khớp 100% ID và Slug trên cả Blueprint, Mapping, Schema, Wireframe và Acceptance Criteria.
- [x] **Tiêu chí nghiệm thu khách quan:** 100% tiêu chí mang trạng thái `NOT TESTED (Chờ QA)` hoặc `NOT TESTED (Giai đoạn sau)`.
- [x] **Phạm vi nghiêm ngặt:** Chỉ đặc tả `/dich-vu` và `/bang-gia`. Không mở `/dich-vu/:slug`.
- [x] **Zero Code Change:** Không chỉnh sửa bất kỳ dòng mã nào trong `src/`, `public/`, `tests/` hay file cấu hình.

---

## 7. XÁC NHẬN BẢO TOÀN HỆ THỐNG (ZERO REGRESSION CONFIRMATION)

- **Không can thiệp source website:** 0 file code bị thay đổi trong vòng sửa này.
- **Không deployment Vercel:** Không thực hiện bất kỳ lệnh deploy nào.
- **Không merge `main`:** Toàn bộ công việc được thực hiện và lưu trữ an toàn trên nhánh `docs/phase-3b-00`.
- **Bảo toàn Mốc 2A, 2B và 3A:** Toàn bộ thành quả đã nghiệm thu của các mốc trước được bảo vệ nguyên vẹn.

---

**PHASE 3B-00 FIX 02 — READY FOR INDEPENDENT RETEST**
