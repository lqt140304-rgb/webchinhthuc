# KHUNG KIỂM SOÁT BẰNG CHỨNG NỘI DUNG GIAI ĐOẠN 3B (PHASE 3B CONTENT EVIDENCE GATE)
## Bệnh viện Thú y Lê Sơn 2026 — Quy Chuẩn Xác Minh & Khóa Nội Dung Y Khoa

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 042-A (Section VI)**; `AGENTS.md` (Architecture Baseline V1) |
| **Bản chất tài liệu** | **CONTENT VERIFICATION FRAMEWORK & EVIDENCE STANDARDS** (Quy chế kiểm soát bằng chứng nội dung) |
| **Áp dụng cho** | Toàn bộ tài liệu thiết kế, wireframe, data schema, content mapping và mã nguồn Giai đoạn 3B |
| **Trạng thái** | **ĐỀ XUẤT NGUYÊN TẮC — CHỜ CHỦ DỰ ÁN PHÊ DUYỆT CHÍNH THỨC** |

---

## 1. MỤC ĐÍCH & NGUYÊN TẮC CỐT LÕI

Trong lĩnh vực dịch vụ y tế thú y, thông tin công bố ra công chúng liên quan trực tiếp đến sức khỏe thú cưng, chi phí điều trị và uy tín chuyên môn của phòng khám. Quy chế **Content Evidence Gate** được thiết lập nhằm:

1. **Ngăn chặn triệt để tình trạng "tự nâng cấp thông tin" (Self-promotion / Premature Verification):** Tuyệt đối không tự gán nhãn `VERIFIED` cho các thông tin chưa có văn bản phê duyệt hoặc chưa có bằng chứng xác thực từ người có thẩm quyền.
2. **Bảo vệ danh tính và trách nhiệm của nhân sự thật:** Không tự gán chức danh, chuyên khoa, ca mổ, kỹ thuật gây mê hay trách nhiệm pháp lý cho cá nhân bác sĩ (đặc biệt là BS. Lê Thái Sơn) khi chưa có văn bản xác nhận bằng văn bản từ chủ dự án.
3. **Phân định rõ ràng giữa thiết kế mô phỏng và thông tin công bố:** Mọi mock data, fixture phục vụ kiểm thử giao diện phải được cô lập, trung tính hóa và không được hiển thị như dữ liệu thật ra ngoài công chúng.

---

## 2. BA TRẠNG THÁI NỘI DUNG CHUẨN MỰC (THE 3-TIER CONTENT STATUS)

Mọi dòng nội dung, dịch vụ, biểu phí, tuyên bố y khoa hoặc thông số kỹ thuật trên website bắt buộc phải thuộc về đúng một trong ba trạng thái:

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
- **Định nghĩa:** Thông tin đã được kiểm chứng bằng văn bản chính thức, được người có thẩm quyền ký duyệt và cho phép công bố công khai.
- **Tiêu chuẩn bắt buộc để đạt `VERIFIED`:** Một nội dung CHỈ ĐƯỢC PHÉP mang nhãn `VERIFIED` khi thỏa mãn đồng thời cả 5 điều kiện:
  1. *Nội dung được xác minh cụ thể:* Chuỗi ký tự, thông số, địa chỉ, hotline rõ ràng.
  2. *Nguồn bằng chứng xác thực:* Biên bản họp, chỉ đạo CEO, commit Git đã nghiệm thu hoặc giấy phép hoạt động cụ thể.
  3. *Chủ thể xác minh / phê duyệt:* Ghi rõ họ tên và vai trò (ví dụ: "Chủ dự án", không ghi chung chung "Phòng khám").
  4. *Ngày xác minh:* Thời điểm phê duyệt bằng văn bản (định dạng YYYY-MM-DD).
  5. *Phạm vi công bố được cho phép:* Ghi rõ được công bố ở đâu (ví dụ: "Toàn bộ Public Website").
- **Nếu thiếu bất kỳ 1 trong 5 yếu tố trên $\to$ BẮT BUỘC PHẢI LÀ `PENDING`.**

### 2.2. Trạng thái `PENDING` (CHỜ XÁC MINH CHUYÊN MÔN / DỮ LIỆU)
- **Định nghĩa:** Danh mục dịch vụ dự kiến, phác đồ điều trị, lời khuyên y khoa, quy trình nội trú hoặc mức giá đang trong quá trình chuẩn hóa.
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

## 3. TIÊU CHUẨN NGUỒN BẰNG CHỨNG (EVIDENCE SOURCE STANDARDS)

Để tránh việc trích dẫn sai sự thật (như ghi "Cơ sở vật chất 3A đã duyệt" cho một nội dung mà 3A thực tế để `PENDING`), nguồn bằng chứng phải tuân theo thứ bậc pháp lý:

| Cấp độ | Loại nguồn bằng chứng | Mức độ tin cậy | Ví dụ nguồn hợp lệ |
|:---:|---|---|---|
| **Cấp 1** | **Chỉ đạo trực tiếp của Chủ dự án (Owner Directives)** | Cao nhất | Xác nhận địa chỉ, hotline, giờ làm việc trong Directive 017-A/018-A (26/10/2026). |
| **Cấp 2** | **Văn bản chuyên môn có chữ ký (Signed Medical Docs)** | Cao nhất y khoa | Danh mục dịch vụ có chữ ký của BS. Lê Thái Sơn; Bảng giá niêm yết có dấu phòng khám. |
| **Cấp 3** | **Commit Git đã được nghiệm thu chính thức (Accepted Commits)** | Giá trị kỹ thuật | Commit code 3A `4739d45` được nghiệm thu có điều kiện (chỉ xác nhận layout/code, không tự mở rộng sang claim chuyên môn mới). |
| **KHÔNG HỢP LỆ** | **Tài liệu nháp cũ, mockup chưa duyệt, suy đoán cá nhân** | **VÔ GIÁ TRỊ** | Mockup HTML cũ, ý tưởng từ brief chưa duyệt, nội dung thảo luận nội bộ chưa thành văn bản. |

---

## 4. QUY TRÌNH CHUYỂN TRẠNG THÁI: `PENDING` $\to$ `VERIFIED`

Một mục nội dung chỉ được chuyển từ `PENDING` sang `VERIFIED` theo quy trình 4 bước:

```text
[BƯỚC 1: ĐỀ XUẤT] ──> [BƯỚC 2: CUNG CẤP BẰNG CHỨNG] ──> [BƯỚC 3: PHÊ DUYỆT] ──> [BƯỚC 4: CẬP NHẬT]
Antigravity lập danh   Chủ dự án / Bác sĩ cung cấp       Chủ dự án ký duyệt       Cập nhật Mapping,
mục PENDING kèm        văn bản, biểu phí có chữ ký       văn bản ban hành         gỡ nhãn [Đề xuất],
slot chờ trung tính    hoặc quyết định phê duyệt                                  chuyển VERIFIED
```

- **Bước 1 (Đề xuất):** Antigravity liệt kê danh mục dịch vụ, quy trình hoặc biểu phí ở trạng thái `PENDING` kèm câu hỏi cụ thể trong danh sách OPEN DECISIONS.
- **Bước 2 (Cung cấp bằng chứng):** Chủ dự án hoặc Bác sĩ phụ trách cung cấp văn bản, biểu phí chính thức hoặc quyết định bằng văn bản.
- **Bước 3 (Phê duyệt):** Chủ dự án xác nhận bằng văn bản cho phép công bố nội dung đó trên website.
- **Bước 4 (Cập nhật):** Antigravity cập nhật vào Content Mapping, điền đầy đủ 5 trường thông tin (nội dung, nguồn, người duyệt, ngày duyệt, phạm vi) và chỉ khi đó mới gỡ bỏ nhãn `[Đề xuất]`.

---

## 5. QUY TẮC SỬ DỤNG DỮ LIỆU THỬ NGHIỆM (FIXTURES & TEST-ONLY DATA)

Nhằm đảm bảo an toàn, các bộ dữ liệu mẫu dùng cho unit test, integration test hoặc Playwright test phải tuân thủ:

1. **Định danh trung tính:** Sử dụng các tên giả định chung: `Dịch vụ thử nghiệm A`, `Gói khám mẫu B`, `srv-sample-01`.
2. **Không dùng tên người thật:** Tuyệt đối không đưa tên `BS. Lê Thái Sơn` hay bất kỳ nhân sự thật nào vào fixture mô tả phẫu thuật hoặc kỹ thuật y tế chưa xác minh.
3. **Không dùng giá thật hoặc giá cụ thể dễ gây nhầm lẫn:** Không dùng các con số như `150.000 VNĐ` hay `300.000 – 600.000 VNĐ` trong ví dụ minh họa công khai. Sử dụng ký hiệu placeholder: `[Số tiền niêm yết] VNĐ` hoặc `[Mức phí tham chiếu]`.
4. **Cờ cô lập:** Mọi fixture phải có cờ `testOnly: true` và `isPublished: false`.

---

## 6. ĐIỀU KIỆN CHẶN PHÁT HÀNH PRODUCTION (PRODUCTION BLOCKING GATES)

Trước khi website được phép gỡ `noindex` và triển khai ra môi trường Production chính thức, hệ thống phải vượt qua các điều kiện chặn nghiêm ngặt:

- ❌ **CHẶN NẾU:** Còn bất kỳ dịch vụ nào mang giá bịa đặt hoặc số tiền mô phỏng.
- ❌ **CHẶN NẾU:** Còn bất kỳ claim nào về "phòng mổ vô trùng", "khu hồi sức", "khu cách ly", "trực đêm", "theo dõi sinh hiệu" mà chưa có văn bản xác nhận năng lực thực tế tại 101 Khuất Duy Tiến.
- ❌ **CHẶN NẾU:** Còn gắn chuyên môn phẫu thuật/điều trị cho bác sĩ mà chưa có văn bằng/chứng chỉ hành nghề được duyệt công bố.
- ❌ **CHẶN NẾU:** Còn sử dụng các từ ngữ tuyệt đối hóa: "chữa khỏi 100%", "điều trị tận gốc", "không phát sinh chi phí".
- ❌ **CHẶN NẾU:** Còn tồn tại nhãn `[Đề xuất]`, `[Chờ xác nhận]` hoặc `UNAVAILABLE` trên các dịch vụ chính mà chưa có quyết định xử lý hiển thị từ chủ dự án.

---

## 7. CHECKLIST TỰ KIỂM TRA TRƯỚC KHI BÀN GIAO QA (SELF-AUDIT CHECKLIST)

Mỗi khi hoàn thành một vòng tài liệu hoặc code, Antigravity phải tự rà soát theo bảng kiểm tra sau:

- [ ] **Grep tên bác sĩ:** Tìm kiếm `"Lê Thái Sơn"` hoặc `"BS. Sơn"` $\to$ Xác nhận không xuất hiện trong mô tả phẫu thuật, gây mê, điều trị nội khoa hoặc fixture khi chưa có bằng chứng.
- [ ] **Grep từ khóa cơ sở vật chất:** Tìm kiếm `"cách ly"`, `"vô trùng"`, `"hồi sức"`, `"gây mê"`, `"sinh hiệu"`, `"trực đêm"` $\to$ Xác nhận 100% các từ này đều nằm trong slot `[Chờ xác nhận]` hoặc `[Đề xuất]`, không xuất hiện như sự thật đã hoàn tất.
- [ ] **Grep từ ngữ tuyệt đối:** Tìm kiếm `"tận gốc"`, `"không phát sinh"`, `"100%"` $\to$ Xác nhận 0 kết quả trên toàn bộ tài liệu.
- [ ] **Rà soát cột VERIFIED:** Kiểm tra từng dòng `VERIFIED` trong Content Mapping $\to$ Đảm bảo có đầy đủ 5 trường: Nội dung, Nguồn, Người duyệt, Ngày duyệt, Phạm vi. Thiếu một trường phải hạ về `PENDING`.
- [ ] **Kiểm tra tính nhất quán danh mục:** Xác nhận số lượng nhóm danh mục và slug giống hệt nhau trên cả 5 tài liệu 3B.
- [ ] **Rà soát Acceptance Criteria:** Xác nhận không có dòng nào tự đánh dấu `ĐẠT` hoặc `PASS`. Toàn bộ để `NOT TESTED`.

---

**KẾT THÚC QUY CHẾ CONTENT EVIDENCE GATE V1.0**
