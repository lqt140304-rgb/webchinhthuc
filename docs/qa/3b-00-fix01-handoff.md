# BÁO CÁO BÀN GIAO VÒNG SỬA TÀI LIỆU 3B-00 FIX 01 (PHASE 3B-00 FIX 01 HANDOFF)
## Bệnh viện Thú y Lê Sơn 2026 — Hoàn Thiện Hồ Sơ Thiết Kế Dịch Vụ & Bảng Giá

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 042-A**; Báo cáo Claude QA `docs/qa/3b-00-design-doc-qa.md` (Commit QA: `fa2dda2`) |
| **Agent thực hiện** | Antigravity — UX Architect & Documentation Owner |
| **Ngày bàn giao** | 28/10/2026 |
| **Nhánh làm việc** | `docs/phase-3b-00` |
| **Baseline trước khi sửa** | `f8a85f1ce0fd28e3d7bb7dc8deb618c8aac1e0f4` |
| **Code cơ sở 3A** | `4739d45cc95100b587381b6bdcad6935352b23e8` (Nghiệm thu có điều kiện) |
| **Trạng thái tài liệu** | **HOÀN THÀNH VÒNG SỬA TÀI LIỆU — SẴN SÀNG CHO CLAUDE RETEST ĐỘC LẬP** |
| **Cam kết phạm vi** | **100% DOCUMENTATION ONLY** — Tuyệt đối không can thiệp `src/`, CSS, assets, config; Không deploy Vercel; Không merge `main`. |

---

## 1. TỔNG HỢP DANH MỤC FILE THAY ĐỔI & FILE MỚI

Toàn bộ thay đổi nằm trọn vẹn trong thư mục `docs/`:

| STT | File đường dẫn | Loại thao tác | Nội dung thay đổi chính |
|:---:|---|---|---|
| **01** | [`docs/phase-3b/3b-00-content-evidence-gate.md`](file:///d:/webbvct/docs/phase-3b/3b-00-content-evidence-gate.md) | **TẠO MỚI** | Thiết lập Khung kiểm soát bằng chứng nội dung (Content Evidence Gate), 3 trạng thái chuẩn (`VERIFIED`, `PENDING`, `ILLUSTRATIVE`), quy chuẩn nguồn bằng chứng, quy trình chuyển trạng thái, điều kiện chặn Production và checklist tự kiểm tra. |
| **02** | [`docs/phase-3b/3b-00-blueprint.md`](file:///d:/webbvct/docs/phase-3b/3b-00-blueprint.md) | **CẬP NHẬT (v1.1)** | Xóa bỏ toàn bộ gán chuyên môn cho BS. Sơn; xóa toàn bộ claim cơ sở vật chất cũ; thống nhất taxonomy 5 nhóm danh mục; dùng token CSS; sửa offset sticky; khai báo 3 phụ thuộc ngoài phạm vi; bổ sung đầy đủ 11 OPEN DECISIONS; sửa dẫn chiếu commit QA sang `fa2dda2`. |
| **03** | [`docs/phase-3b/3b-00-content-mapping.md`](file:///d:/webbvct/docs/phase-3b/3b-00-content-mapping.md) | **CẬP NHẬT (v1.1)** | Bổ sung cột bằng chứng, người duyệt, ngày duyệt, phạm vi công bố; hạ toàn bộ claim chuyên môn và quy trình thiếu bằng chứng về `PENDING`; gỡ bỏ BS. Sơn khỏi phẫu thuật; đồng bộ taxonomy 5 nhóm chuẩn. |
| **04** | [`docs/phase-3b/3b-00-data-schema.md`](file:///d:/webbvct/docs/phase-3b/3b-00-data-schema.md) | **CẬP NHẬT (v1.1)** | Bổ sung trường bằng chứng (`evidenceSource`, `verifiedBy`, `verifiedAt`, `publicationApproval`) trên cả 3 thực thể; trung tính hóa 100% fixture (0 tên người thật, 0 thiết bị tự tạo, dùng placeholder `[Số tiền niêm yết]`); bổ sung xử lý tên dài, danh mục trống, phân tầng giá theo cân nặng. |
| **05** | [`docs/phase-3b/3b-00-wireframe.md`](file:///d:/webbvct/docs/phase-3b/3b-00-wireframe.md) | **CẬP NHẬT (v1.1)** | Đồng bộ taxonomy 5 nhóm và slug; khớp text Header CTA ("Đặt lịch khám") và Bottom Bar ("Cấp cứu 24/24 / Đặt lịch khám"); bỏ chữ "giá" khỏi ô tìm kiếm; bỏ số đếm cứng; sửa offset sticky; bổ sung wireframe Skeleton Loading và Empty State; bỏ `role="region"` dư thừa. |
| **06** | [`docs/phase-3b/3b-00-acceptance-criteria.md`](file:///d:/webbvct/docs/phase-3b/3b-00-acceptance-criteria.md) | **CẬP NHẬT (v1.1)** | Xóa bỏ toàn bộ trạng thái tự chấm "ĐẠT/PASS"; thiết lập Khung kiểm định 5 cấp độ (Tài liệu $\to$ Mockup $\to$ Code $\to$ Preview $\to$ Production); đặt mặc định `NOT TESTED (Chờ QA)` cho tất cả tiêu chí. |
| **07** | [`docs/qa/3b-00-fix01-handoff.md`](file:///d:/webbvct/docs/qa/3b-00-fix01-handoff.md) | **TẠO MỚI** | Báo cáo bàn giao chi tiết vòng sửa Fix 01 theo đúng yêu cầu CEO Directive 042-A. |

---

## 2. BẢNG ĐỐI CHIẾU XỬ LÝ 3 LỖI P1 TỪ CLAUDE QA

| Mã lỗi | Mô tả phát hiện của Claude | Biện pháp kỹ thuật đã khắc phục trong vòng Fix 01 | File tài liệu liên quan | Đánh giá |
|---|---|---|---|---|
| **3B00-P1-1** | Tự gán BS. Lê Thái Sơn phụ trách phẫu thuật ngoại khoa, phác đồ điều trị và thiết bị gây mê mà không có bằng chứng phê duyệt. | - Gỡ bỏ 100% việc gán chuyên khoa phẫu thuật, kíp mổ hay thiết bị cho BS. Sơn.<br>- Chuyển nhân sự phụ trách sang placeholder trung tính: `Bác sĩ phụ trách lâm sàng [Chờ xác nhận phân công nhân sự]`, `Bác sĩ ngoại khoa [Chờ phê duyệt phân công nhân sự]`.<br>- Trong Data Schema: Gỡ bỏ toàn bộ tên BS. Sơn khỏi fixture kỹ thuật mẫu. | `3b-00-blueprint.md`<br>`3b-00-content-mapping.md`<br>`3b-00-data-schema.md`<br>`3b-00-wireframe.md` | **ĐÃ XỬ LÝ TRIỆT ĐỂ** |
| **3B00-P1-2** | Tái xuất hiện các claim cơ sở vật chất đã bị loại ở 3A ("khu cách ly", "khu hồi sức riêng", "trực đêm", "theo dõi sinh hiệu", "phòng mổ vô trùng", "máy gây mê bay hơi", "áp lực dương"). | - Quét và loại bỏ toàn bộ các claim trên khỏi tư cách là sự thật đã hoàn tất.<br>- Chuyển đổi thành các slot chờ trung tính: `[Chờ xác nhận cơ cấu phân khu]`, `[Chờ xác nhận kíp trực]`, `[Đề xuất danh mục thiết bị]`.<br>- Sửa nguồn trích dẫn sai trong Content Mapping (xóa bỏ dòng "Cơ sở vật chất 3A đã duyệt" cho khu cách ly). | `3b-00-blueprint.md`<br>`3b-00-content-mapping.md`<br>`3b-00-data-schema.md`<br>`3b-00-wireframe.md` | **ĐÃ XỬ LÝ TRIỆT ĐỂ** |
| **3B00-P1-3** | Tự nâng cấp các claim chuyên môn thành `VERIFIED` mà không có bằng chứng (như "điều trị tận gốc", "không phát sinh chi phí ngoài dự toán", "nhịn ăn 6-8 tiếng", "dấu hiệu cấp cứu", "phụ phí cấp cứu ngoài giờ"). | - Áp dụng nghiêm ngặt `Content Evidence Gate`: Mọi mục `VERIFIED` bắt buộc có đủ 5 yếu tố.<br>- Xóa bỏ cụm từ "điều trị tận gốc" khỏi tiêu đề; xóa cam kết tuyệt đối "không phát sinh ngoài dự toán".<br>- Hạ toàn bộ các khuyến cáo y khoa, dấu hiệu cấp cứu, quy trình báo giá và phụ phí ngoài giờ về trạng thái `PENDING` [Đề xuất hướng dẫn — Chờ bác sĩ / chủ dự án duyệt]. | `3b-00-content-evidence-gate.md`<br>`3b-00-blueprint.md`<br>`3b-00-content-mapping.md` | **ĐÃ XỬ LÝ TRIỆT ĐỂ** |

---

## 3. BẢNG ĐỐI CHIẾU XỬ LÝ 6 LỖI P2 TỪ CLAUDE QA

| Mã lỗi | Mô tả phát hiện | Biện pháp kỹ thuật đã khắc phục trong vòng Fix 01 | File tài liệu liên quan | Đánh giá |
|---|---|---|---|---|
| **3B00-P2-1** | Taxonomy danh mục và slug không nhất quán (4 nhóm trên Dịch vụ vs 5 nhóm trên Bảng giá; tab "Tất cả (24)" lệch 15 dịch vụ). | - Thiết lập bộ 5 nhóm danh mục chuẩn hóa duy nhất dùng chung cho toàn bộ tài liệu 3B: `kham-dieu-tri`, `can-lam-sang`, `phau-thuat`, `noi-tru`, `spa-grooming`.<br>- Đưa nhóm Cấp cứu 24/24 thành Dải thông tin khẩn cấp / Gateway `#cap-cuu`.<br>- Bỏ số đếm cứng giả định trên wireframe; đưa taxonomy 5 nhóm vào OPEN DECISION 3B-DEC-05. | `3b-00-blueprint.md`<br>`3b-00-content-mapping.md`<br>`3b-00-data-schema.md`<br>`3b-00-wireframe.md` | **ĐÃ XỬ LÝ TRIỆT ĐỂ** |
| **3B00-P2-2** | Data Schema thiếu trường nguồn, người xác minh; thiếu quy tắc PENDING ↔ `isPublished`; ngày hiệu lực giả; chưa mô tả phân tầng giá và trường hợp biên. | - Bổ sung các trường `evidenceSource`, `verifiedBy`, `verifiedAt`, `publicationApproval` vào cả 3 thực thể.<br>- Đặc tả quy tắc ràng buộc: unverified chỉ hiển thị trên Preview kèm nhãn PENDING, ẩn hoàn toàn trên Production.<br>- Chuyển `effectiveDate` sang `null` (không dùng ngày giả).<br>- Bổ sung mô hình phân tầng giá theo cân nặng `WeightTierPrice`, xử lý tên dịch vụ dài và danh mục trống. | `3b-00-data-schema.md` | **ĐÃ XỬ LÝ TRIỆT ĐỂ** |
| **3B00-P2-3** | Fixture TEST ONLY chứa claim bịa gắn với người thật và thiết bị; ví dụ giá cụ thể "150.000 VNĐ", "300.000 – 600.000 VNĐ" dễ bị chép vào code. | - Trung tính hóa 100% dữ liệu fixture: đổi ID và tên thành mẫu chung (`srv-sample-exam-01`, `srv-sample-surgery-02`), gỡ bỏ hoàn toàn tên BS. Sơn và máy gây mê.<br>- Thay thế mọi số tiền cụ thể bằng placeholder `[Số tiền niêm yết] VNĐ`.<br>- Đặt cờ `testOnly: true`, `isPublished: false`. | `3b-00-data-schema.md`<br>`3b-00-blueprint.md` | **ĐÃ XỬ LÝ TRIỆT ĐỂ** |
| **3B00-P2-4** | Phụ thuộc ngoài phạm vi chưa khai báo: `/dat-lich?service=`, đổi menu Header con sang anchor, sửa Footer và Section 3 Trang chủ. | - Thiết lập bảng danh mục "Phụ thuộc ngoài phạm vi" riêng biệt.<br>- Quy định phương án mặc định: Giữ nguyên 100% Header, Footer, Trang chủ và BookingPage; CTA chỉ điều hướng đơn thuần về `/dat-lich` (không query).<br>- Đưa việc pre-fill query và cập nhật menu vào OPEN DECISIONS để chủ dự án xem xét. | `3b-00-blueprint.md` (§8)<br>`3b-00-wireframe.md` | **ĐÃ XỬ LÝ TRIỆT ĐỂ** |
| **3B00-P2-5** | Acceptance Criteria tự chấm "ĐẠT" 15/15; thiếu phân tầng kiểm định Code/Preview QA. | - Xóa bỏ toàn bộ trạng thái tự chấm PASS/ĐẠT.<br>- Tái cấu trúc thành Khung kiểm định 5 cấp độ độc lập (Tài liệu $\to$ Mockup $\to$ Code $\to$ Preview $\to$ Production).<br>- Đặt mặc định `NOT TESTED (Chờ QA)` cho tất cả các cổng kiểm tra kèm ngưỡng đo lường định lượng. | `3b-00-acceptance-criteria.md` | **ĐÃ XỬ LÝ TRIỆT ĐỂ** |
| **3B00-P2-6** | Thiếu handoff 3B-00 riêng; thiếu danh mục OPEN DECISIONS đầy đủ; tiêu đề tự ghi "APPROVED". | - Lập báo cáo handoff chi tiết tại `docs/qa/3b-00-fix01-handoff.md`.<br>- Thay đổi toàn bộ tiêu đề tài liệu thành `CHỜ CHỦ DỰ ÁN PHÊ DUYỆT (PENDING OWNER APPROVAL)`.<br>- Tổng hợp danh mục đầy đủ 11 OPEN DECISIONS theo yêu cầu của CEO Directive 042-A. | Toàn bộ các file tài liệu | **ĐÃ XỬ LÝ TRIỆT ĐỂ** |

---

## 4. XỬ LÝ CÁC PHÁT HIỆN P3

- **3B00-P3-1 (Dẫn chiếu commit QA):** Đã sửa toàn bộ trích dẫn trong header Blueprint và Mapping từ mã giả `99a224a` sang commit SHA thực tế: `fa2dda2` (nhánh `claude/3b-00-design-doc-qa`).
- **3B00-P3-2 (Text Header / Bottom Bar trong Wireframe):** Đã khớp chính xác với component thực tế trên codebase: Header CTA là `[Đặt lịch]` / `[Đặt lịch khám]`, Bottom Bar là `[Cấp cứu 24/24] [Đặt lịch khám]`. Ghi chú rõ: RootLayout giữ nguyên 100%.
- **3B00-P3-3 (Màu ngoài Token):** Đã thay thế các class màu Tailwind tùy tiện (`bg-purple-100`, `bg-amber-100`) bằng token CSS chuẩn trong `tokens.css` (`var(--color-status-warning-bg)`, `var(--color-bg-secondary)`, `var(--color-border-medium)`).
- **3B00-P3-4 (Offset Sticky Jump Bar):** Đã quy định rõ ràng: `top-[73px]` trên mobile (< 768px, do Header 73px) và `top-[81px]` trên tablet/desktop ($\ge 768\text{px}$, do Header 81px).
- **3B00-P3-5 (Chi tiết Wireframe & Accessibility):** Đã xóa chữ "giá" khỏi search placeholder; lược bỏ `role="region"` dư thừa ở panel con; bổ sung wireframe Skeleton Loading và Empty State; làm rõ đơn vị đo lường y tế (`Lần`, `Mẫu`, `Phim`, `Ca`, `Ngày`).

---

## 5. BẢNG TỔNG HỢP 11 QUYẾT ĐỊNH MỞ CẦN CHỦ DỰ ÁN PHÊ DUYỆT (OPEN DECISIONS)

| Mã quyết định | Nội dung quyết định mở | Đề xuất của Antigravity | Thẩm quyền quyết định |
|---|---|---|---|
| **3B-DEC-01** | **Phương thức công bố biểu phí:** Có cung cấp biểu phí rút gọn gồm các dịch vụ cơ bản đã có giá thật trong bản Preview đầu tiên không, hay giữ toàn bộ `UNAVAILABLE` / `CONTACT`? | Giữ `UNAVAILABLE` / `CONTACT` cho đến khi chủ dự án có biểu phí ký duyệt chính thức. | **Chủ dự án quyết định** |
| **3B-DEC-02** | **Điều hướng 4 route con `/dich-vu/*` hiện hữu:** Giữ nguyên 4 trang ComingSoon, hay cho phép sửa Header/Footer để chuyển thành anchor link (`#kham-dieu-tri`, `#noi-tru`...) trên trang `/dich-vu`? | Giữ nguyên 4 route ComingSoon trong 3B-00. Đề xuất cấp quyền cập nhật Header/Footer trong một nhiệm vụ riêng. | **Chủ dự án quyết định** |
| **3B-DEC-03** | **Chính sách phụ phí cấp cứu ngoài giờ/ngày lễ:** Phòng khám có áp dụng phụ phí cấp cứu đêm (21:00 – 08:00) hoặc ngày lễ không; nếu có thì mức phí là bao nhiêu? | Chưa công bố phụ phí khi chưa có quy chế được duyệt; hiển thị `Báo giá sau khám` hoặc tư vấn trực tiếp qua hotline. | **Chủ dự án quyết định** |
| **3B-DEC-04** | **Danh mục dịch vụ kỹ thuật thực tế:** Phê duyệt danh sách chính thức các dịch vụ được phép công bố (phẫu thuật, triệt sản, vaccine, xét nghiệm máu, X-quang, siêu âm, soi da). | Antigravity đề xuất danh mục dự kiến tại Content Mapping v1.1, chờ Bác sĩ và Chủ dự án đối chiếu. | **Chủ dự án & BS. Sơn** |
| **3B-DEC-05** | **Taxonomy chuẩn hóa 5 nhóm:** Phê duyệt bộ 5 nhóm danh mục chuẩn (`kham-dieu-tri`, `can-lam-sang`, `phau-thuat`, `noi-tru`, `spa-grooming`) dùng chung cho toàn hệ thống. | Áp dụng thống nhất 5 nhóm danh mục này để loại bỏ xung đột giữa Dịch vụ và Bảng giá. | **Chủ dự án quyết định** |
| **3B-DEC-06** | **Vai trò chuyên môn của BS. Lê Thái Sơn:** Có công bố phạm vi phụ trách chuyên môn cụ thể của BS. Sơn trên trang Dịch vụ hay không, hay chỉ giữ họ tên ở vai trò người sáng lập? | Giữ chức danh PENDING và sử dụng placeholder trung tính cho đến khi có văn bằng/quyết định phân công chính thức. | **Chủ dự án quyết định** |
| **3B-DEC-07** | **Quy chuẩn cơ sở vật chất & nội trú được công bố:** Xác nhận các thông tin cơ sở vật chất và trang thiết bị thực tế tại 101 Khuất Duy Tiến được đưa vào nội dung công khai. | Giữ nguyên trạng thái `[Chờ xác nhận cơ cấu phân khu]` và `[Chờ xác nhận kíp trực]`, không tự tạo thông tin. | **Chủ dự án quyết định** |
| **3B-DEC-08** | **Lời khuyên y khoa trước khám:** Chủ dự án và Bác sĩ có duyệt nội dung hướng dẫn chuẩn bị (nhịn ăn, lồng vận chuyển an toàn, sổ tiêm phòng) để công bố công khai không? | Đề xuất giữ dưới dạng `[Thông tin tham khảo]` cho đến khi có chữ ký duyệt của bác sĩ phụ trách. | **Chủ dự án & BS. Sơn** |
| **3B-DEC-09** | **Cam kết tư vấn chi phí:** Xác nhận câu chữ cam kết giải thích dự toán chi phí trước khi can thiệp và nguyên tắc trao đổi phát sinh. | Sử dụng ngôn ngữ cẩn trọng: "Bác sĩ giải thích dự toán chi phí trước khi can thiệp y tế theo đồng thuận của chủ nuôi". | **Chủ dự án quyết định** |
| **3B-DEC-10** | **Tham số `?service=` trên BookingPage:** Chủ dự án có cho phép mở nhánh sửa `BookingPage.tsx` (Mốc 2B) để nhận tham số tự động chọn dịch vụ từ bảng giá không? | Mặc định không sửa `BookingPage.tsx` (CTA chỉ chuyển hướng thuần túy). Đề xuất nâng cấp khi mở lại Mốc 2B. | **Chủ dự án quyết định** |
| **3B-DEC-11** | **Phân tầng giá theo cân nặng & Gói Spa:** Phòng khám có áp dụng biểu phí theo nấc cân nặng cho dịch vụ spa và nội trú không; nếu có thì các mốc cân nặng là gì? | Data Schema đã thiết kế sẵn mô hình `WeightTierPrice`, sẵn sàng tiếp nhận khi chủ dự án ban hành biểu phí. | **Chủ dự án quyết định** |

---

## 6. XÁC NHẬN BẢO TOÀN HỆ THỐNG (ZERO REGRESSION CONFIRMATION)

- **Xác nhận không sửa source code:** Toàn bộ thư mục `src/`, `public/`, `tests/` và các file cấu hình giữ nguyên 100%, không có bất kỳ thay đổi nào.
- **Xác nhận không deploy, không merge:** Không chạy lệnh `vercel deploy`, không thay đổi project Vercel, không merge vào nhánh `main`.
- **Bảo toàn Mốc 2A, 2B và 3A:** Mã nguồn và bản Preview đã nghiệm thu của Mốc 2A/2B và Mốc 3A hoàn toàn được bảo vệ nguyên vẹn.

---

**PHASE 3B-00 FIX 01 — READY FOR CLAUDE TARGETED RETEST**
