# KHUNG KIỂM SOÁT BẰNG CHỨNG NỘI DUNG GIAI ĐOẠN 3B (PHASE 3B CONTENT EVIDENCE GATE)
## Bệnh viện Thú y Lê Sơn 2026 — Quy Chuẩn Xác Minh & Khóa Nội Dung Y Khoa (Phiên bản v1.2)

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 042-A**, **CEO DIRECTIVE 044-A**; `AGENTS.md` (Architecture Baseline V1); Quyết định **DEC-12** và **DEC-13** |
| **Bản chất tài liệu** | **CONTENT VERIFICATION FRAMEWORK & EVIDENCE STANDARDS** (Quy chế kiểm soát bằng chứng nội dung) |
| **Áp dụng cho** | Toàn bộ tài liệu thiết kế, wireframe, data schema, content mapping và mã nguồn Giai đoạn 3B |
| **Trạng thái** | **POLICY APPROVED (Quy chế đã duyệt) — NỘI DUNG CỤ THỂ CẦN BẰNG CHỨNG RIÊNG** |

---

## 1. MỤC ĐÍCH & NGUYÊN TẮC CỐT LÕI

Trong lĩnh vực dịch vụ y tế thú y, thông tin công bố ra công chúng liên quan trực tiếp đến sức khỏe thú cưng, chi phí điều trị và uy tín chuyên môn của phòng khám. Quy chế **Content Evidence Gate** được thiết lập nhằm:

1. **Ngăn chặn triệt để tình trạng "tự nâng cấp thông tin" (Self-promotion / Premature Verification):** Tuyệt đối không tự gán nhãn `VERIFIED` cho các thông tin chưa có văn bản phê duyệt hoặc chưa có bằng chứng xác thực từ người có thẩm quyền.
2. **Tuân thủ nguyên tắc phân quyền xác minh và phê duyệt (Theo DEC-13):**
   - **Chủ dự án (Owner):** Thẩm quyền cao nhất, phê duyệt nội dung thương hiệu, danh mục dịch vụ, biểu phí và chính sách công bố ra công chúng.
   - **Bác sĩ phụ trách / Người chuyên môn được chỉ định:** Xác minh tính chính xác của các nội dung y khoa, quy trình kỹ thuật trong phạm vi được giao.
   - **ChatGPT (CEO):** Điều phối, rà soát, tổng hợp và đề xuất giải pháp.
   - **Antigravity (Designer / Developer):** Soạn thảo tài liệu, thiết kế giao diện và triển khai kỹ thuật theo phạm vi cho phép.
   - **Claude (Independent QA):** Độc lập thẩm định, kiểm chứng bằng chứng và kết luận chất lượng.
   - **Tuyệt đối cấm các AI (Antigravity, Claude, ChatGPT) tự đứng tên làm người xác minh hoặc người phê duyệt thông tin y tế, danh mục hoặc biểu phí của bệnh viện.**
3. **Phân định rõ ràng giữa thiết kế mô phỏng và thông tin công bố:** Mọi mock data, fixture phục vụ kiểm thử giao diện phải được cô lập, trung tính hóa và không được hiển thị như dữ liệu thật ra ngoài công chúng.
4. **Quy định phê duyệt câu chữ Hero và Heading (Theo DEC-12):** Toàn bộ tiêu đề lớn (H1), dòng phụ (Eyebrow), đoạn dẫn Hero và các câu cam kết trên `/dich-vu` và `/bang-gia` phải có văn bản phê duyệt câu chữ từ Chủ dự án trước khi được công bố chính thức. Khi chưa có văn bản duyệt cụ thể, toàn bộ câu chữ giữ nguyên trạng thái `PENDING`.

---

## 2. BA TRẠNG THÁI NỘI DUNG CHUẨN MỰC (THE 3-TIER CONTENT STATUS)

Mọi dòng nội dung, dịch vụ, biểu phí, tuyên bố y khoa hoặc thông số kỹ thuật trên website bắt buộc phải thuộc về đúng một trong ba trạng thái pháp lý:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      HỆ THỐNG PHÂN LOẠI 3 TRẠNG THÁI                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
  [ VERIFIED ]                 [ PENDING ]                [ ILLUSTRATIVE ]
 Đã có văn bản phê            Chưa có bằng chứng           Hình ảnh/Sơ đồ
 duyệt từ chủ dự án           xác thực chính thức          minh họa thiết kế
 (Được công bố)               (Hiển thị trung tính)        (Gắn nhãn bắt buộc)
```

### 2.1. Trạng thái `VERIFIED` (ĐÃ XÁC MINH ĐẦY ĐỦ)
- **Định nghĩa:** Thông tin đã được kiểm chứng bằng văn bản chính thức từ Chủ dự án hoặc văn bản chuyên môn có chữ ký của Bác sĩ phụ trách, được phê duyệt cho phép công bố công khai.
- **Tiêu chuẩn bắt buộc để đạt `VERIFIED`:** Một nội dung CHỈ ĐƯỢC PHÉP mang nhãn `VERIFIED` khi thỏa mãn đồng thời cả 5 điều kiện:
  1. *Nội dung được xác minh cụ thể:* Chuỗi ký tự, thông số, địa chỉ, hotline rõ ràng.
  2. *Nguồn bằng chứng xác thực:* Biên bản họp, chỉ đạo CEO, commit Git đã nghiệm thu hoặc giấy phép hoạt động cụ thể còn hiệu lực.
  3. *Chủ thể xác minh / phê duyệt:* Ghi rõ họ tên và vai trò (ví dụ: "Chủ dự án", không ghi chung chung "Phòng khám" và tuyệt đối không ghi tên các AI agent).
  4. *Ngày xác minh:* Thời điểm phê duyệt bằng văn bản thực tế (định dạng `YYYY-MM-DD`).
  5. *Phạm vi công bố được cho phép:* Ghi rõ phạm vi được công bố (ví dụ: "Toàn bộ Public Website").
- **Nếu thiếu bất kỳ 1 trong 5 yếu tố trên $\to$ BẮT BUỘC PHẢI LÀ `PENDING`.**

### 2.2. Trạng thái `PENDING` (CHỜ XÁC MINH / ĐỀ XUẤT)
- **Định nghĩa:** Danh mục dịch vụ dự kiến, phác đồ điều trị, lời khuyên y khoa, quy trình nội trú, câu chữ Hero hoặc mức giá đang trong quá trình chuẩn hóa hoặc chờ chủ dự án/bác sĩ phê duyệt.
- **Làm rõ về nhãn `PROPOSED`:** Trong tài liệu kỹ thuật, nhãn `PROPOSED` (Đề xuất) chỉ là một thẻ phân loại phụ của nhóm thiết kế để đánh dấu các phương án kiến trúc đang trình duyệt (ví dụ: đề xuất bộ 5 nhóm danh mục). **Về mặt pháp lý và quản trị bằng chứng, toàn bộ các mục `PROPOSED` đều trực thuộc trạng thái `PENDING`.**
- **Quy tắc hiển thị trên giao diện:**
  - Không trình bày như một khẳng định sự thật đã hoàn tất.
  - Phải có nhãn trung tính đi kèm: `[Đề xuất]`, `[Chờ xác nhận danh mục]`, `[Dự kiến]`.
  - Đối với biểu phí: Hiển thị trạng thái `UNAVAILABLE` (`Đang cập nhật biểu phí niêm yết`) hoặc `CONTACT` (`Báo giá sau khám lâm sàng`).
  - Trong wireframe và mockup: Thể hiện dưới dạng placeholder hoặc khung chờ trung tính.

### 2.3. Trạng thái `ILLUSTRATIVE` (HÌNH ẢNH / DỮ LIỆU MINH HỌA)
- **Định nghĩa:** Ảnh chụp thú cưng, icon minh họa, cấu trúc bảng giá phục vụ kiểm thử trực quan.
- **Quy tắc hiển thị:**
  - Bắt buộc gắn nhãn hoặc watermark: `Ảnh minh họa — không phải cơ sở thực tế`.
  - Tuyệt đối không dùng ảnh stock người mặc áo blouse/đồng phục y tế để tránh người xem hiểu nhầm là bác sĩ thật của bệnh viện.
  - Dữ liệu thử nghiệm (fixtures) phải dùng tên và mã giả định trung tính, không gắn với thương hiệu hay người thật.

---

## 3. CẤU TRÚC BẢN GHI PHÊ DUYỆT BẰNG CHỨNG (EVIDENCE RECORD SCHEMA)

Để chuẩn hóa việc lưu trữ và đối chiếu bằng chứng cho từng phần tử nội dung, mọi mục dữ liệu trong hệ thống phải ánh xạ theo cấu trúc bản ghi chuẩn (Evidence Record):

```typescript
export interface ContentEvidenceRecord {
  /** Mã định danh phần tử nội dung (ví dụ: DV-HERO-01, BG-PRC-01) */
  contentId: string

  /** Phiên bản nội dung (ví dụ: v1.0, v1.1) để đối chiếu khi có thay đổi câu chữ */
  contentVersion: string

  /** Nội dung văn bản hiển thị dự kiến */
  contentText: string

  /** Nguồn bằng chứng cụ thể (Chỉ đạo CEO, biên bản họp, tài liệu pháp lý) */
  evidenceSource: string | null

  /** Chủ thể xác minh chuyên môn (Bác sĩ phụ trách hoặc chuyên gia được chỉ định) */
  verifiedBy: string | null

  /** Thời điểm xác minh chuyên môn (định dạng YYYY-MM-DD) */
  verifiedAt: string | null

  /** Chủ thể phê duyệt công bố (Chủ dự án / Người đại diện pháp luật) */
  approvedBy: string | null

  /** Thời điểm phê duyệt công bố (định dạng YYYY-MM-DD) */
  approvedAt: string | null

  /** Số văn bản hoặc mã quyết định phê duyệt chính thức */
  approvalReference: string | null

  /** Phạm vi được phép công bố (ví dụ: "Public Website", "Nội bộ", "Chưa công bố") */
  publicationScope: string | null

  /** Trạng thái xác minh cốt lõi */
  verificationStatus: 'VERIFIED' | 'PENDING' | 'ILLUSTRATIVE'
}
```

### Các nguyên tắc quản trị Evidence Record:
1. **Không tạo dữ liệu người duyệt giả:** Nếu chưa có văn bản phê duyệt, các trường `verifiedBy`, `verifiedAt`, `approvedBy`, `approvedAt`, `approvalReference` bắt buộc phải là `null`.
2. **Gắn liền với phiên bản câu chữ:** Khi một câu chữ hoặc thông số thay đổi đáng kể, `contentVersion` phải được tăng lên và bản ghi chuyển về `PENDING` để được xác minh lại.
3. **Phân biệt xác minh chuyên môn và phê duyệt công bố:** Bác sĩ xác minh phác đồ (`verifiedBy`) không tự động đồng nghĩa với việc nội dung được phép công bố ra ngoài; quyền công bố (`approvedBy`) thuộc về Chủ dự án theo DEC-13.

---

## 4. TIÊU CHUẨN NGUỒN BẰNG CHỨNG (EVIDENCE SOURCE STANDARDS)

Để tránh việc trích dẫn sai sự thật hoặc dẫn nguồn tài liệu không tồn tại trong repo, nguồn bằng chứng phải tuân theo thứ bậc pháp lý:

| Cấp độ | Loại nguồn bằng chứng | Mức độ tin cậy | Ví dụ nguồn hợp lệ trong Repo |
|:---:|---|---|---|
| **Cấp 1** | **Chỉ đạo trực tiếp của Chủ dự án (Owner Directives)** | Cao nhất | Xác nhận địa chỉ, hotline, giờ làm việc trong Directive 017-A/018-A (26/10/2026). Quyết định DEC-12, DEC-13 trong Directive 044-A. |
| **Cấp 2** | **Văn bản chuyên môn có chữ ký (Signed Medical Docs)** | Cao nhất y khoa | Danh mục dịch vụ có chữ ký của Bác sĩ phụ trách; Bảng giá niêm yết có dấu phòng khám. |
| **Cấp 3** | **Commit Git đã được nghiệm thu chính thức (Accepted Commits)** | Giá trị kỹ thuật | Commit code 3A `4739d45` được nghiệm thu có điều kiện (chỉ xác nhận layout/code, không tự mở rộng sang claim chuyên môn mới). |
| **KHÔNG HỢP LỆ** | **Tài liệu không có trong repo, tài liệu nháp cũ, suy đoán AI** | **VÔ GIÁ TRỊ** | Nguồn không tồn tại như "Brand Identity Baseline V1", mockup cũ, câu trả lời tự sinh của AI. |

---

## 5. QUY TRÌNH CHUYỂN TRẠNG THÁI: `PENDING` $\to$ `VERIFIED`

Một mục nội dung chỉ được chuyển từ `PENDING` sang `VERIFIED` theo quy trình 4 bước:

```text
[BƯỚC 1: ĐỀ XUẤT] ──> [BƯỚC 2: CUNG CẤP BẰNG CHỨNG] ──> [BƯỚC 3: PHÊ DUYỆT] ──> [BƯỚC 4: CẬP NHẬT]
Antigravity lập danh   Chủ dự án / Bác sĩ cung cấp       Chủ dự án ký duyệt       Cập nhật Mapping,
mục PENDING kèm        văn bản, biểu phí có chữ ký       văn bản ban hành         gỡ nhãn [Đề xuất],
slot chờ trung tính    hoặc quyết định phê duyệt         (Theo DEC-12/13)         chuyển VERIFIED
```

- **Bước 1 (Đề xuất):** Antigravity liệt kê danh mục dịch vụ, câu chữ Hero hoặc biểu phí ở trạng thái `PENDING` kèm câu hỏi cụ thể trong danh sách OPEN DECISIONS.
- **Bước 2 (Cung cấp bằng chứng):** Chủ dự án hoặc Bác sĩ phụ trách cung cấp văn bản, biểu phí chính thức hoặc quyết định bằng văn bản được lưu vào repo.
- **Bước 3 (Phê duyệt công bố):** Chủ dự án xác nhận bằng văn bản cho phép công bố nội dung đó trên website (tuân thủ DEC-12 và DEC-13).
- **Bước 4 (Cập nhật):** Antigravity cập nhật vào Content Mapping, hoàn thiện đầy đủ các trường của `ContentEvidenceRecord` và chỉ khi đó mới gỡ bỏ nhãn `[Đề xuất]`.

---

## 6. QUY TẮC SỬ DỤNG DỮ LIỆU THỬ NGHIỆM (FIXTURES & TEST-ONLY DATA)

Các bộ dữ liệu mẫu dùng cho unit test, integration test hoặc Playwright test phải tuân thủ:

1. **Định danh trung tính:** Sử dụng các tên giả định chung: `srv-sample-exam-01`, `srv-sample-surgery-02`.
2. **Không dùng tên người thật:** Tuyệt đối không đưa tên `BS. Lê Thái Sơn` hay bất kỳ nhân sự thật nào vào fixture mô tả phẫu thuật hoặc kỹ thuật y tế chưa xác minh.
3. **Không dùng giá tiền cụ thể:** Không dùng các con số như `150.000 VNĐ` hay `300.000 – 600.000 VNĐ` trong ví dụ minh họa. Sử dụng ký hiệu placeholder: `[Số tiền niêm yết] VNĐ`.
4. **Cờ cô lập bắt buộc:** Mọi fixture phải có cờ `testOnly: true` và `isPublished: false`.

---

## 7. ĐIỀU KIỆN CHẶN PHÁT HÀNH PRODUCTION (PRODUCTION BLOCKING GATES)

Trước khi website được phép gỡ `noindex` và triển khai ra môi trường Production chính thức, hệ thống phải vượt qua các điều kiện chặn nghiêm ngặt:

- ❌ **CHẶN NẾU:** Còn bất kỳ dịch vụ nào mang giá bịa đặt hoặc số tiền mô phỏng.
- ❌ **CHẶN NẾU:** Còn bất kỳ claim nào về "phòng mổ vô trùng", "khu hồi sức", "khu cách ly", "trực đêm", "theo dõi sinh hiệu" mà chưa có văn bản xác nhận năng lực thực tế tại 101 Khuất Duy Tiến.
- ❌ **CHẶN NẾU:** Còn gắn chuyên môn phẫu thuật/điều trị cho bác sĩ mà chưa có văn bằng/chứng chỉ hành nghề được duyệt công bố.
- ❌ **CHẶN NẾU:** Còn sử dụng các từ ngữ tuyệt đối hóa: "chữa khỏi 100%", "điều trị tận gốc", "không phát sinh chi phí".
- ❌ **CHẶN NẾU:** Còn tồn tại nhãn `[Đề xuất]`, `[Chờ xác nhận]` hoặc `UNAVAILABLE` trên các dịch vụ chính mà chưa có quyết định xử lý hiển thị từ chủ dự án.
- ❌ **CHẶN NẾU:** Còn thiếu quyết định phê duyệt văn bản của Chủ dự án đối với câu chữ Hero và Heading theo **DEC-12**.

---

## 8. CHECKLIST TỰ KIỂM TRA TRƯỚC KHI BÀN GIAO QA (SELF-AUDIT CHECKLIST)

Mỗi khi hoàn thành một vòng tài liệu hoặc code, Antigravity phải tự rà soát theo bảng kiểm tra sau:

- [ ] **Grep tên bác sĩ:** Tìm kiếm `"Lê Thái Sơn"` hoặc `"BS. Sơn"` $\to$ Xác nhận không xuất hiện trong mô tả phẫu thuật, gây mê, điều trị nội khoa hoặc fixture khi chưa có bằng chứng.
- [ ] **Grep từ khóa cơ sở vật chất:** Tìm kiếm `"cách ly"`, `"vô trùng"`, `"hồi sức"`, `"gây mê"`, `"sinh hiệu"`, `"trực đêm"` $\to$ Xác nhận 100% các từ này đều nằm trong slot `[Chờ xác nhận]` hoặc `[Đề xuất]`, không xuất hiện như sự thật đã hoàn tất.
- [ ] **Grep từ ngữ tuyệt đối:** Tìm kiếm `"tận gốc"`, `"không phát sinh"`, `"100%"` $\to$ Xác nhận 0 kết quả trong nội dung hiển thị của toàn bộ tài liệu.
- [ ] **Rà soát cột VERIFIED & người duyệt:** Kiểm tra từng dòng `VERIFIED` trong Content Mapping $\to$ Đảm bảo có đầy đủ bằng chứng cụ thể và người duyệt là Chủ dự án hoặc Bác sĩ, tuyệt đối không có tên các AI agent (Antigravity, Claude, ChatGPT CEO).
- [ ] **Kiểm tra DEC-12:** Đảm bảo toàn bộ câu chữ Hero và Heading đều ở trạng thái `PENDING` chờ chủ dự án phê duyệt văn bản.
- [ ] **Kiểm tra tính nhất quán danh mục:** Xác nhận 5 nhóm danh mục và slug giống hệt nhau trên cả 5 tài liệu 3B.
- [ ] **Rà soát Acceptance Criteria:** Xác nhận không có dòng nào tự đánh dấu `ĐẠT` hoặc `PASS`. Toàn bộ để `NOT TESTED`.

---

**KẾT THÚC QUY CHẾ CONTENT EVIDENCE GATE V1.2**
