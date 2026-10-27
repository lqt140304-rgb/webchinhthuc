# BẢN GHI NHẬN NGUYÊN TẮC CHÍNH SÁCH DEC-12 VÀ DEC-13 (POLICY DECISION RECORD)
## Bệnh viện Thú y Lê Sơn 2026 — Quy Định Thẩm Quyền Phê Duyệt & Kiểm Soát Nội Dung

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Mã chính sách** | **3B-DEC-12** và **3B-DEC-13** |
| **Nguồn gốc chính sách**| Cuộc trao đổi trực tiếp giữa Chủ dự án và ChatGPT CEO (Điều phối dự án) |
| **Bản chất tài liệu** | **POLICY DECISION RECORD (Bản ghi nhận chính sách quản trị)** |
| **Trạng thái phê duyệt**| **POLICY ACCEPTED IN PRINCIPLE / FORMAL APPROVAL RECORD PENDING**<br>*(Chính sách đã được Chủ dự án đồng thuận về mặt nguyên tắc trong trao đổi điều phối; đang chờ bản ghi hoặc văn bản ký duyệt chính thức lưu vào Git repository)* |
| **Phạm vi áp dụng** | Xuyên suốt toàn bộ các giai đoạn phát triển website: 3B-00, 3B-01, DEV, Preview và Production |

---

## 1. NỘI DUNG CHÍNH SÁCH 3B-DEC-12: PHÊ DUYỆT CÂU CHỮ HERO VÀ HEADING

### 1.1. Nguyên tắc cốt lõi
Toàn bộ tiêu đề lớn (H1), dòng phụ (Eyebrow), đoạn dẫn Hero, và các câu mang tính cam kết quy trình/chi phí trên hai tuyến trang `/dich-vu` và `/bang-gia` bắt buộc phải có văn bản phê duyệt câu chữ cụ thể từ Chủ dự án trước khi được công bố chính thức ra công chúng (`VERIFIED` và `isPublished: true`).

### 1.2. Danh sách các hạng mục chịu sự chi phối của DEC-12
Toàn bộ các Content ID dưới đây được giữ nguyên trạng thái `PENDING` cho đến khi Chủ dự án ký duyệt câu chữ:
1. `DV-HERO-02`: Eyebrow trang Dịch vụ (`HỆ THỐNG DỊCH VỤ Y TẾ LÊ SƠN`)
2. `DV-HERO-03`: Tiêu đề H1 trang Dịch vụ
3. `DV-HERO-04`: Đoạn dẫn Hero trang Dịch vụ
4. `DV-HERO-05`: Editorial Policy Banner (Thông báo chuẩn hóa danh mục và phác đồ)
5. `DV-CTA-01`: Tiêu đề Editorial Dark CTA trang Dịch vụ
6. `BG-HEAD-02`: Eyebrow trang Bảng giá (`MINH BẠCH CHI PHÍ Y TẾ THÚ CƯNG`)
7. `BG-HEAD-03`: Tiêu đề H1 trang Bảng giá (`Bảng giá dịch vụ & biểu phí tham chiếu`)
8. `BG-HEAD-04`: Đoạn dẫn cam kết tư vấn chi phí trang Bảng giá
9. `BG-CTA-01`: Tiêu đề Editorial Dark CTA trang Bảng giá

### 1.3. Điều kiện chuyển trạng thái
- **Chấp thuận nguyên tắc (Policy Approval):** Không đồng nghĩa với việc câu chữ cụ thể đã được duyệt.
- Từng câu chữ cụ thể phải được đối chiếu trong biên bản hoặc chỉ đạo có lưu vết trong repo trước khi gỡ nhãn `[Đề xuất]`.

---

## 2. NỘI DUNG CHÍNH SÁCH 3B-DEC-13: PHÂN ĐỊNH THẨM QUYỀN PHÊ DUYỆT & BẢO VỆ DỮ LIỆU BỆNH VIỆN

### 2.1. Ma trận phân quyền thẩm quyền (Role-Based Authority Matrix)

| Vai trò | Chủ thể | Thẩm quyền thực tế | Giới hạn nghiêm ngặt |
|---|---|---|---|
| **Chủ dự án (Owner)** | Đại diện Bệnh viện Thú y Lê Sơn | Thẩm quyền cao nhất: phê duyệt tôn chỉ thương hiệu, danh mục dịch vụ công bố, biểu phí niêm yết, các chính sách tài chính và lệnh phát hành Production. | Duy nhất Chủ dự án có quyền ký duyệt trường `approvedBy` cho dữ liệu công khai. |
| **Bác sĩ phụ trách lâm sàng** | Bác sĩ thú y được chỉ định | Thẩm quyền chuyên môn y tế: xác minh phác đồ kỹ thuật, điều kiện vệ sinh, hướng dẫn chăm sóc y tế và phạm vi cận lâm sàng. | Bác sĩ ký duyệt trường `verifiedBy` cho nội dung y khoa; không tự ý quyết định chính sách giá. |
| **ChatGPT (CEO Điều phối)** | Agent AI | Điều phối dự án, soạn thảo chỉ đạo, tổng hợp kết quả, quản lý tiến độ và rủi ro. | **TUYỆT ĐỐI KHÔNG** tự đứng tên phê duyệt thông tin thực tế của phòng khám. |
| **Claude (Independent QA)** | Agent AI | Thẩm tra độc lập, rà soát tính nhất quán, phát hiện lỗi hồi quy, kiểm chứng bằng chứng Git. | **TUYỆT ĐỐI KHÔNG** tự đóng vai trò phê duyệt nghiệp vụ thay Chủ dự án. |
| **Antigravity (Design & Dev)** | Agent AI | Soạn thảo tài liệu thiết kế, wireframe, schema logic, lập trình mã nguồn và kiểm thử. | **TUYỆT ĐỐI KHÔNG** tự xác minh hoặc tự phê duyệt bất kỳ thông tin nào của phòng khám. |

### 2.2. Phân định rõ 3 cấp độ phê duyệt
1. **Policy Approval (Chấp thuận nguyên tắc quản trị):** Xác lập khung quy chế hoạt động giữa các agent và chủ dự án.
2. **Content Verification (Xác minh tính đúng đắn chuyên môn):** Bác sĩ phụ trách rà soát tính khoa học và thực tế y khoa.
3. **Publication Approval (Phê duyệt xuất bản ra công chúng):** Chủ dự án ký duyệt cho phép dữ liệu xuất hiện trên website chính thức.

### 2.3. Quy định về bằng chứng lưu trữ trong Git
- Mọi phê duyệt chỉ được coi là có căn cứ khi có văn bản, biên bản cuộc họp, email xác nhận hoặc chỉ đạo có lưu vết truy xuất được trong Git repository.
- Tuyệt đối không tự bịa đặt số hiệu công văn, ngày ký duyệt giả hoặc trích dẫn các tài liệu không tồn tại trong repo (như "Brand Identity Baseline V1").
- Khi chưa có bản ghi văn bản lưu trong repo, mọi trường `verifiedBy`, `verifiedAt`, `approvedBy`, `approvedAt`, `approvalReference` bắt buộc phải là `null`.

---

## 3. KẾ HOẠCH HÀNH ĐỘNG ĐÓNG BẢN GHI PHÊ DUYỆT (NEXT STEPS)
1. Trong cuộc làm việc tiếp theo, CEO ChatGPT sẽ trình văn bản tổng hợp câu chữ Hero/Heading và các quyết định mở cho Chủ dự án ký duyệt chính thức.
2. Bản ký scan hoặc văn bản xác nhận bằng văn bản sẽ được lưu vào thư mục `docs/directives/` hoặc `docs/decisions/` để làm căn cứ bằng chứng Cấp 1 hợp lệ.
3. Chỉ sau khi bản ghi đó được commit vào repo, các mục liên quan mới được phép chuyển sang trạng thái `VERIFIED`.

---

**BẢN GHI NHẬN NGUYÊN TẮC QUẢN TRỊ — LƯU HỒ SƠ 3B-00 FIX 03**
