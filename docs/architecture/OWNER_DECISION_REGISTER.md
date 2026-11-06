# SỔ ĐĂNG KÝ QUYẾT ĐỊNH CHỦ DỰ ÁN (OWNER DECISION REGISTER)
## Single-Facility Veterinary Hospital Management System & Generic Excel Import Center Specification (v1.6.9 Baseline)

- **Dự án:** Bệnh viện Thú y Lê Sơn (`lqt140304-rgb/webchinhthuc`)
- **Mã tài liệu:** `LESON-ARCH-PHASE4A-20261103-V1.6.9`
- **Ngày cập nhật:** 06/11/2026
- **Đơn vị điều phối:** ChatGPT (CEO Điều phối)
- **Đơn vị thẩm định độc lập:** Claude (Independent QA Reviewer)
- **Tác giả tài liệu:** Antigravity (Senior Product Designer & System Architect)
- **Trạng thái:** **`READY FOR OWNER REVIEW`** *(Hồ sơ trình Chủ dự án nghiệm thu thiết kế; KHÔNG triển khai sản xuất, KHÔNG chi tiêu ngân sách khi chưa có lệnh riêng)*

---

> [!IMPORTANT]
> ### NGUYÊN TẮC PHÂN BIỆT TRẠNG THÁI & CHỨNG CỨ XÁC NHẬN (GOVERNANCE BASELINE)
> Tuân thủ nghiêm ngặt chỉ đạo CEO Review ngày 06/11/2026:
> 1. **`APPROVED`**: Bắt buộc phải có ngày và nguồn xác nhận có thể truy vết (tin nhắn, chỉ đạo hoặc brief chính thức từ Chủ dự án). Mục không có nguồn tuyệt đối **KHÔNG ĐƯỢC TỰ NÂNG THÀNH APPROVED**.
> 2. **`CONFIRMED — OPERATIONS`**: Đặc thù thực tế tại viện được xác nhận qua trao đổi; hệ thống hỗ trợ kỹ thuật nhưng không tự động công bố khi chưa có quy trình riêng.
> 3. **`PENDING — NOT DECIDED`**: Chủ dự án chưa chốt. Tuyệt đối **không được suy diễn** (không gọi PITR bị từ chối vĩnh viễn, không coi sao lưu hàng ngày đã duyệt, không cam kết RPO 24h khi chưa được phê duyệt).
> 4. **`PENDING VERIFICATION`**: Đang chờ đối chiếu tài liệu pháp lý / giấy phép thực tế trước khi cấu hình chính thức.
> 5. **`PROPOSED`**: Quy tắc hoặc giải pháp kỹ thuật do Antigravity đề xuất, đang chờ Bác sĩ trưởng / Chủ dự án xem xét, chưa có hiệu lực bất biến.
> 6. **Phân Định Vai Trò Kỹ Thuật CSDL vs Tên Công Việc Thực Tế:**
>    - Enum trong CSDL (`staff_role_assignments.role`) chỉ gồm 5 giá trị: `'veterinarian'`, `'cashier'`, `'spa_staff'`, `'receptionist'`, `'admin'`.
>    - Chức danh "Quản lý phòng khám" (Clinic Manager) trong thực tế vận hành được gán vai trò kỹ thuật là `'admin'`. Hệ thống tuyệt đối **không có enum `'manager'` ảo**.

---

## I. BẢNG ÁNH XẠ LỊCH SỬ MÃ QUYẾT ĐỊNH THEO TỪNG PHIÊN BẢN (VERSION EVOLUTION MATRIX)

Bảng đối chiếu minh bạch sự tiến hóa của bộ mã quyết định qua các mốc tài liệu nhằm triệt tiêu hoàn toàn sự nhầm lẫn giữa các phiên bản (Giải quyết triệt để vấn đề đổi nghĩa mã D-02, D-03, D-06, D-09):

| Mã Hiện Tại (v1.6.9) | Mã v1.6.7 / v1.6.8 | Mã Gốc v1.6.5 | Tên Quyết Định Vận Hành / Kỹ Thuật | Trạng Thái & Nguồn Gốc | Giải Trình Lịch Sử Mã & Phân Biệt Nghiệp Vụ |
| :---: | :---: | :---: | :--- | :---: | :--- |
| **D-01** | D-01 | D-01 | Backend Stack (Supabase Managed) | **`APPROVED — ARCHITECTURE ONLY`** | Duyệt kiến trúc PostgreSQL, Auth, Storage. Chưa mua gói Pro, chưa mở production. |
| **D-01-PRO** | D-01-PRO | — | Chính sách Nâng cấp Gói Supabase Pro | **`APPROVED — PROCUREMENT`** | Chỉ nâng Pro ($25/tháng) khi chứng minh nhu cầu và có phê duyệt riêng. |
| **D-02** | **D-02** | **D-02** | **Phạm vi Dữ liệu Nhập từ GPet Cũ** | **`APPROVED — DATA SCOPE`**<br>*(Nguồn: Quyết định 26/10/2026)* | **Lịch sử:** D-02 từ v1.6.5 luôn là quyết định nhập dữ liệu: **Chỉ nhập dữ liệu thương mại, lưu bệnh án GPet cũ riêng**. *(Lưu ý: Giờ mở cửa phòng khám được tách riêng thành mã `OP-HOURS`)*. |
| **OP-HOURS** | — | — | **Khung Giờ Đón Khách (08:00 – 20:00)** | **`CONFIRMED — OPERATIONS`**<br>*(Nguồn: Brief 26/10/2026)* | Xác nhận giờ mở cửa đón khách vãng lai/hẹn trước là 08:00 – 20:00. Tách độc lập khỏi mã D-02 để tránh trùng mã. |
| **D-03** | D-03-DR | D-03-DR | **Sao lưu Khắc phục Thảm họa (DR) & PITR** | **`PENDING — NOT DECIDED`**<br>*(Chủ dự án chưa quyết định)* | **Lịch sử:** Trong v1.6.5, mã D-03 từng bị gọi nhầm cho SĐT dùng chung. Từ v1.6.6+, D-03 là DR Backup/PITR. Chủ dự án **chưa chốt** mua PITR (\$100/tháng) hay duyệt backup hàng ngày; giữ backup hàng ngày làm đề xuất kỹ thuật. |
| **D-PHONE** | D-PHONE / D-21 | D-03 (v1.6.5) | **Nhiều Khách Hàng Dùng Chung Số Điện Thoại** | **`APPROVED`**<br>*(Nguồn: Chat 05/11/2026 & P1-E)* | **Lịch sử:** Gốc là D-03 tại v1.6.5. Chuẩn hóa thành D-PHONE / D-21: CSDL **CẤM UNIQUE trên `phone_number`**. Khách hàng định danh bằng UUID riêng. |
| **D-04** | D-04 | D-04 | Captcha & Chống DDOS (Cloudflare Turnstile)| **`APPROVED — SERVICE SELECTION`**<br>*(Nguồn: Chat 05/11/2026)* | Chủ dự án chọn Phương án A: Cloudflare Turnstile (\$0, tôn trọng quyền riêng tư). |
| **D-05** | D-05 | D-05 | Nhà cung cấp OTP (Zalo ZNS) | **`APPROVED — SERVICE SELECTION`**<br>*(Nguồn: Chat 05/11/2026)* | Chủ dự án duyệt gửi OTP qua Zalo ZNS (~500 OTP/tháng ~ 100.000 VNĐ, tối ưu chi phí). |
| **D-06** | **D-06** | **D-06** | **Chính sách Bảo mật MFA Cho Thao Tác Nhạy Cảm**| **`APPROVED — SECURITY POLICY`**<br>*(Nguồn: Baseline v1.6.5)* | **Lịch sử:** D-06 chuẩn là yêu cầu AAL2 cho Admin khi thực hiện thao tác nhạy cảm (rollback, duyệt import, đổi SĐT). |
| **POL-BOOKING**| — | — | **Giới Hạn Tần Suất Đặt Lịch (Tối đa 3 lịch/SĐT)**| **`APPROVED — RATE LIMIT`**<br>*(Nguồn: Đề xuất v1.6.6)* | Tách độc lập khỏi mã D-06: Chặn spam đặt lịch tối đa 3 lịch hẹn chưa hoàn tất trên 1 SĐT. |
| **D-06-INVOICE**| D-06-INVOICE| — | Ẩn Dữ Liệu Y Khoa Trên Hóa Đơn Khách Hàng | **`APPROVED — INVOICE PRIVACY`** | Dòng thuốc kê đơn, phác đồ điều trị nội bộ bắt buộc ẩn 100% đối với khách hàng. |
| **D-07** | D-07 | D-07 | Nguyên Tắc Bốn Mắt (Two-Man Rule) | **`APPROVED — GOVERNANCE`**<br>*(Nguồn: Chat 05/11/2026)* | Chủ dự án duyệt: Người tạo file Excel không được tự duyệt (`approved_by <> created_by`). |
| **D-08** | D-08 | D-08 | Cơ Chế Phân Ca Linh Hoạt | **`APPROVED — SCHEDULING`**<br>*(Nguồn: Brief 26/10/2026)* | Ca trực linh hoạt do Quản lý thiết lập; không hardcode cố định trong hệ thống. |
| **D-08-NIGHT** | D-08-NIGHT | — | Vận Hành Trực Đêm Tại Bệnh Viện | **`CONFIRMED — OPERATIONS`**<br>*(Nguồn: Chat 26/10/2026)* | Có nhân sự trực tại viện qua đêm để chăm sóc lưu viện; không công bố dịch vụ 24/24 trên website. |
| **D-09** | **D-09** | **D-09** | **Xử Lý Số Dư Điểm Tích Lũy Cũ GPet** | **`APPROVED — DATA POLICY`**<br>*(Nguồn: Chat 05/11/2026)* | **Lịch sử:** D-09 chuẩn là lưu điểm cũ vào `historical_loyalty_points`, khóa quy đổi, chờ chính sách mới. |
| **POL-DECEASED**| — | — | **Xử Lý Thú Cưng Đã Mất (`is_deceased = TRUE`)** | **`PROPOSED — PRIVACY DESIGN`** | Quy tắc đề xuất kỹ thuật: Ngừng gửi tin nhắn nhắc lịch tái khám/spa, tôn trọng cảm xúc khách hàng. |
| **D-10** | D-10 | D-10 | Thời Hạn Tự Động Xóa Video/Ảnh Lưu Viện | **`APPROVED — RETENTION POLICY`**<br>*(Nguồn: Chat 05/11/2026)* | **Xóa sau 60 ngày kể từ thời điểm upload (`uploaded_at`)**, không neo theo ngày xuất viện. |
| **D-11** | D-11 | D-11 | Rà Soát Pháp Lý Dữ Liệu Cá Nhân (NĐ 13/2023) | **`APPROVED — INTERNAL REVIEW PROCESS`**<br>*(Nguồn: Chat 05/11/2026)* | Chủ dự án duyệt: **Giao nhân sự nội bộ tự rà soát quy trình**; không thuê luật sư; không coi là đã đạt chuẩn pháp luật. |
| **D-12** | D-12 | D-12 | Hiển Thị Thông Tin Y Khoa Trên Portal | **`APPROVED — CLINICAL VISIBILITY`**<br>*(Nguồn: Baseline V1 26/10/2026)*| Khách chỉ xem bản tin chẩn đoán đã duyệt (`published`); tuyệt đối giấu thuốc và y lệnh. |
| **D-13** | D-13 | D-13 | Tối Thiểu Hóa Định Danh Khách Hàng | **`APPROVED — PRIVACY DESIGN`**<br>*(Nguồn: Chat 05/11/2026)* | Không thu thập số CCCD thô trên web portal; chỉ đối soát tại quầy khi cần. |
| **D-14** | D-14 | D-14 | **Kiến Trúc Cô Lập Máy Chủ Worker (1 VPS)** | **`APPROVED — DESIGN ONLY`**<br>*(Nguồn: Chat 05/11 & Lệnh 06/11/2026)*| **Chủ dự án chọn 1 VPS cách ly Container parser**, quyền, credential và filesystem riêng. **Chưa thuê VPS, chưa duyệt chi phí vận hành**. |
| **D-15** | D-15 | D-15 | Xử Lý Hàng Hóa Thiếu Hạn Sử Dụng | **`APPROVED — INVENTORY POLICY`**<br>*(Nguồn: Đề xuất v1.6.6)* | Không tự sinh HSD giả; gán `unknown` và cách ly (`quarantined`), cấm xuất bán/kê đơn cho đến khi kiểm kho. |
| **D-16** | D-16 | D-16 | Nơi Chạy API Backend & Quản Lý Bí Mật | **`APPROVED — ARCHITECTURE`**<br>*(Nguồn: Baseline v1.6.5)* | Chạy Supabase Edge Functions (Deno, Singapore) & Supabase Vault; không dựng server API riêng. |
| **D-17** | D-17 | D-17 | Nền Tảng Lưu Trữ Website Công Khai (Hosting) | **`APPROVED FOR EVALUATION ONLY`**<br>*(Nguồn: Brief 05/11/2026)* | Ưu tiên thử nghiệm Cloudflare Pages; **chưa duyệt cho Production, chưa duyệt mua dịch vụ trả phí**. |
| **D-18** | D-18 | D-18 | Đơn Vị Hành Chính Địa Chỉ Cơ Sở | **`PENDING VERIFICATION`**<br>*(Nguồn: Chat 05/11/2026)* | Số nhà `101 Khuất Duy Tiến` đã chốt; **đơn vị Phường đang chờ xác minh qua giấy phép kinh doanh/y tế**. |
| **D-19** | D-19 | D-19 | Cơ Chế Tạo Hồ Sơ Khách Hàng (Lazy Creation) | **`APPROVED — DESIGN`**<br>*(Nguồn: Brief 05/11/2026)* | Áp dụng triệt để 10 quy tắc Lazy Profile Creation; đăng ký OAuth chỉ tạo danh tính Auth, không tạo khách rác. |
| **D-20** | D-20 | D-20 | Chính Sách Thiết Bị Ghi Hình & Media (BYOD) | **`APPROVED WITH CONDITIONS`**<br>*(Nguồn: Brief 05/11/2026)* | Cho phép BYOD có điều kiện 4 tầng (in-memory capture, khử EXIF server, RPC trust workflow, remote wipe giới hạn). |
| **D-LINK** | D-LINK | — | Thẩm Quyền Duyệt Liên Kết Tài Khoản | **`APPROVED — SECURITY POLICY`**<br>*(Nguồn: Chat 05/11/2026)* | Tiếp tân chỉ tiếp nhận/đối soát tại quầy; thẩm quyền phê duyệt thuộc Quản lý (role Admin AAL2). |

---

## II. BẢNG NGUỒN XÁC NHẬN QUYẾT ĐỊNH CHI TIẾT (DECISION PROVENANCE & EVIDENCE TABLE)

| Mã Quyết Định | Ngày Xác Nhận | Nguồn Xác Nhận Cụ Thể | Trích Dẫn Chứng Cứ Gốc / Ghi Chú Ràng Buộc |
| :---: | :---: | :--- | :--- |
| **D-01** | 05/11/2026 | Chỉ đạo Chủ dự án (User message 1) | *"Chủ dự án chấp thuận sử dụng Supabase Managed làm nền tảng backend... Không tạo project Production, không kích hoạt Pro, PITR hoặc add-on trả phí"*. |
| **D-02** | 26/10/2026 | PROJECT_BRIEF & Quy chế Repo | Chỉ nhập dữ liệu thương mại từ GPet cũ (khách hàng, sản phẩm, dịch vụ, hóa đơn, tồn kho đầu kỳ). Bệnh án lâm sàng cũ lưu kho riêng biệt. |
| **OP-HOURS** | 26/10/2026 | Brief 2A & Xác nhận vận hành | Phòng khám đón khách công khai từ 08:00 đến 20:00 hàng ngày. |
| **D-03** | 05/11/2026 & 06/11/2026 | Chỉ đạo Chủ dự án (User message 5 & Lệnh 06/11) | *"d 03 cứ giữ bản sao lưu hàng ngyaf đi"* $\rightarrow$ Lệnh 06/11: **`PENDING — NOT DECIDED`**. Chưa chốt mua PITR (\$100/tháng) hay chọn chính sách cuối; giữ sao lưu hàng ngày R2 làm đề xuất kỹ thuật. |
| **D-PHONE** | 05/11/2026 & 06/11/2026 | Chỉ đạo Chủ dự án (Quy tắc D-19 & Lệnh 06/11) | *"Cho phép nhiều hồ sơ khách dùng chung số điện thoại... UUID của auth.users và UUID customers là hai định danh khác nhau... CSDL cấm UNIQUE trên phone_number"*. |
| **D-04** | 05/11/2026 | Chỉ đạo Chủ dự án (User message 5) | *"d 04 chọn a"* $\rightarrow$ Phương án A: Cloudflare Turnstile (\$0 phụ phí, tôn trọng quyền riêng tư). |
| **D-05** | 05/11/2026 | Chỉ đạo Chủ dự án (User message 5) | *"d 05 gửi qua zalo"* $\rightarrow$ Tích hợp Zalo ZNS (~500 OTP/tháng ~ 100.000 VNĐ). |
| **D-06** | 03/11/2026 | Baseline Kiến trúc v1.6.5 | Bắt buộc xác thực đa yếu tố AAL2 cho tài khoản Admin khi thực hiện các tác vụ nhạy cảm. |
| **D-07** | 05/11/2026 | Chỉ đạo Chủ dự án (User message 5) | *"d 07 lm theo đề xuất"* $\rightarrow$ Nguyên tắc Bốn Mắt (Two-Man Rule) cứng trong CSDL: `approved_by <> created_by`. |
| **D-08** | 26/10/2026 | Quy chế Vận hành | Ca trực linh hoạt do Quản lý phân bổ theo tình hình nhân sự thực tế. |
| **D-08-NIGHT** | 26/10/2026 | Xác nhận Chủ dự án (Brief 2A) | Có nhân sự trực tại viện qua đêm để theo dõi nội trú; cấm tuyên bố dịch vụ 24/24 trên website. |
| **D-09** | 05/11/2026 | Baseline v1.6.6 | Số dư điểm tích lũy cũ GPet lưu vào `historical_loyalty_points`, khóa không cho quy đổi, chờ chính sách mới. |
| **D-10** | 05/11/2026 | Quyết định Chủ dự án | Xóa ảnh/video lưu viện sau 60 ngày kể từ thời điểm upload (`uploaded_at`). |
| **D-11** | 05/11/2026 | Chỉ đạo Chủ dự án (User message 5) | *"d 11 giao nhân sự nội bộ"* $\rightarrow$ Giao nhân sự tự rà soát quy trình; không thuê luật sư; nhãn `INTERNAL REVIEW PROCESS`. |
| **D-12** | 26/10/2026 | Architecture Baseline V1 | Khách hàng chỉ xem bản tin chẩn đoán đã duyệt (`published`); cấm hiển thị thuốc, liều lượng, y lệnh nội bộ. |
| **D-13** | 05/11/2026 | Chỉ đạo Chủ dự án | Không thu thập số CCCD thô trên web portal. |
| **D-14** | 05/11/2026 & 06/11/2026 | Chỉ đạo Chủ dự án & Lệnh CEO Gate | **Chủ dự án chọn 1 VPS cách ly Container parser**, quyền, credential và filesystem riêng. Trạng thái: **`APPROVED — DESIGN ONLY`**. Chưa thuê VPS, chưa phát sinh chi phí. |
| **D-15** | 05/11/2026 | Baseline v1.6.6 | Hàng thiếu HSD gán `expiry_status = 'unknown'`, cách ly (`quarantined`), cấm xuất bán/kê đơn. |
| **D-16** | 03/11/2026 | Baseline v1.6.5 | Chạy backend serverless qua Supabase Edge Functions (Singapore) kết hợp Supabase Vault. |
| **D-17** | 05/11/2026 | Chỉ đạo Chủ dự án (User message 1) | Ưu tiên đánh giá Cloudflare Pages. Chưa chuyển domain chính, chưa triển khai Production. |
| **D-18** | 05/11/2026 | Chỉ đạo Chủ dự án (User message 5) | *"d 18 101 khuất duy tiến..."* $\rightarrow$ Số nhà 101 Khuất Duy Tiến đã chốt; đơn vị Phường chờ đối chiếu giấy phép kinh doanh. |
| **D-19** | 05/11/2026 | Chỉ đạo Chủ dự án (User message 1) | Phê duyệt 10 quy tắc Lazy Customer Profile Creation: Đăng ký OAuth chỉ tạo danh tính Auth, không tạo khách rác. |
| **D-20** | 05/11/2026 | Chỉ đạo Chủ dự án (User message 1) | Phê duyệt BYOD với điều kiện bảo mật 4 tầng nghiêm ngặt (in-memory capture, khử EXIF server, 4 RPCs trust, remote wipe). |
| **D-LINK** | 05/11/2026 | Chỉ đạo Chủ dự án (User message 1) | Tiếp tân chỉ tiếp nhận hồ sơ tại quầy; thẩm quyền duyệt liên kết tài khoản lịch sử thuộc Quản lý/Admin AAL2. |

---

## III. CHI TIẾT 20 QUYẾT ĐỊNH CỐT LÕI (FULL REGISTER)

### D-01: Mô hình Dịch vụ Backend Cốt lõi (Backend Stack)
- **Trạng thái:** **`APPROVED — ARCHITECTURE ONLY`** *(Nguồn: Chat 05/11/2026)*
- **Phương án lựa chọn:** Supabase Managed (PostgreSQL + Auth + Storage).
- **Ràng buộc:** Giữ schema `app` riêng tư, truy cập qua wrapper API an toàn trong schema `public`. Chưa mua Supabase Pro ($25/tháng) hay bất kỳ add-on nào. Chưa mở project Production.

### D-01-PRO: Chính sách Mua gói Supabase Pro
- **Trạng thái:** **`APPROVED — PROCUREMENT POLICY`**
- **Phương án lựa chọn:** Chỉ nâng gói Pro (\$25.00/tháng) khi hệ thống chuẩn bị nghiệm thu Production và có nhu cầu tải thực tế; giai đoạn phát triển dùng Local Sandbox và Free Tier (\$0 phụ phí).

### D-02: Phạm vi Dữ liệu Nhập từ GPet Cũ
- **Trạng thái:** **`APPROVED — DATA SCOPE`** *(Nguồn: Quyết định 26/10/2026)*
- **Phương án lựa chọn:** Chỉ nhập dữ liệu thương mại từ phần mềm GPet cũ (Danh mục khách hàng, sản phẩm, dịch vụ, tồn kho đầu kỳ, lịch sử hóa đơn).
- **Ràng buộc:** Toàn bộ hồ sơ bệnh án lâm sàng cũ được lưu trữ riêng biệt dưới dạng tệp lưu trữ tra cứu nội bộ, **tuyệt đối không chuyển đổi vào cơ sở dữ liệu mới** để tránh xung đột cấu trúc.

### OP-HOURS: Khung Giờ Hoạt Động Của Bệnh Viện
- **Trạng thái:** **`CONFIRMED — OPERATIONS`** *(Nguồn: Brief 26/10/2026)*
- **Phương án lựa chọn:** Khung giờ mở cửa đón tiếp khách hàng công khai tại bệnh viện: **08:00 – 20:00 hàng ngày**.

### D-03: Chính sách Sao lưu Khắc phục Thảm họa (DR) & PITR (Mã gốc v1.6.5: D-03-DR)
- **Trạng thái:** **`PENDING — NOT DECIDED`** *(Chủ dự án chưa quyết định)*
- **Phương án đề xuất (Technical Proposal):** Đề xuất duy trì giải pháp sao lưu hàng ngày (`pg_dump` mã hóa GPG 4096-bit đẩy lên Cloudflare R2, đề xuất mục tiêu RPO $\le 24$ giờ, $0 phụ phí phát sinh).
- **Ràng buộc & Làm rõ theo chỉ đạo CEO Gate (06/11/2026):**
  * Chủ dự án **chưa chốt** mua PITR hay chọn chính sách sao lưu cuối cùng.
  * **Tuyệt đối không ghi:** PITR bị từ chối vĩnh viễn, sao lưu hằng ngày đã được chủ dự án phê duyệt, hoặc RPO 24 giờ là cam kết được chấp thuận.
  * Giữ giải pháp sao lưu định kỳ hàng ngày làm **phương án đề xuất kỹ thuật**, chờ Chủ dự án phê duyệt riêng. Gói Supabase PITR ($100/tháng) chưa quyết định mua.

### D-PHONE / D-21: Chính Sách Nhiều Khách Hàng Dùng Chung Số Điện Thoại (P1-E Invariant)
- **Trạng thái:** **`APPROVED`** *(Nguồn: Chat 05/11/2026 & P1-E Invariant)*
- **Phương án lựa chọn:** Cho phép nhiều hồ sơ khách hàng khác nhau dùng chung một số điện thoại liên lạc (vợ chồng, thành viên gia đình, người chăm hộ, chủ cũ - chủ mới khi chuyển giao thú cưng).
- **Ràng buộc bắt buộc (Bất biến P1-E):**
  * Mỗi khách hàng được định danh bằng UUID duy nhất (`app.customers.id`).
  * CSDL tuyệt đối **KHÔNG đặt ràng buộc duy nhất (NO UNIQUE CONSTRAINT)** trên cột `phone_number` của bảng `app.customers`.
  * Không bao giờ tự động gom gộp hồ sơ, không tự động liên kết tài khoản portal hay hóa đơn chỉ dựa vào số điện thoại khi chưa có quy trình đối soát xác minh tại quầy (`app.user_link_requests`).

### D-04: Nhà cung cấp Captcha & Chống DDOS
- **Trạng thái:** **`APPROVED — SERVICE SELECTION`** *(Nguồn: Chat 05/11/2026)*
- **Phương án lựa chọn:** **Chọn Phương án A — Cloudflare Turnstile** ($0 phụ phí, bảo vệ quyền riêng tư, không yêu cầu người dùng giải đố captcha hình ảnh).

### D-05: Nhà cung cấp SMS OTP Brandname
- **Trạng thái:** **`APPROVED — SERVICE SELECTION`** *(Nguồn: Chat 05/11/2026)*
- **Phương án lựa chọn:** Sử dụng **Zalo ZNS (Zalo Notification Service qua Zalo OA của bệnh viện)** làm kênh gửi mã xác thực OTP chính thức khi lên Production (~250 - 400 VNĐ/tin, tiết kiệm 60-70% so với SMS Brandname truyền thống).
- **Ràng buộc:** Môi trường phát triển và kiểm thử nội bộ sử dụng Local Mock OTP / Test Phone Numbers (\$0 phụ phí).

### D-06: Chính sách Bảo mật MFA Theo Hành động Nhạy cảm
- **Trạng thái:** **`APPROVED — SECURITY POLICY`** *(Nguồn: Baseline v1.6.5)*
- **Phương án lựa chọn:** Bắt buộc xác thực đa yếu tố AAL2 (Authenticator App TOTP) đối với tài khoản Admin khi thực hiện các hành vi nhạy cảm: duyệt import dữ liệu lớn (`rpc_import_approve_job`), rollback dữ liệu (`rpc_import_rollback_job`), thu hồi thiết bị nhân viên (`rpc_revoke_staff_device`), và xử lý số điện thoại tái cấp (`rpc_resolve_recycled_phone`).

### POL-BOOKING: Giới Hạn Tần Suất Đặt Lịch Chống Spam
- **Trạng thái:** **`APPROVED — RATE LIMIT`** *(Nguồn: Đề xuất v1.6.6)*
- **Phương án lựa chọn:** Giới hạn mỗi số điện thoại chỉ được có tối đa **3 lịch hẹn đang ở trạng thái chờ khám** (`pending`). Chặn đứng hành vi spam lịch ảo từ các bot tự động.

### D-06-INVOICE: Hiển thị Dòng Bán lẻ / Spa & Che giấu Y khoa
- **Trạng thái:** **`APPROVED — INVOICE VISIBILITY`**
- **Phương án lựa chọn:** Hóa đơn trên portal khách hàng chỉ hiển thị các mặt hàng bán lẻ an toàn (thức ăn, phụ kiện) và dịch vụ spa làm đẹp.
- **Ràng buộc:** Cấm tuyệt đối 100% hiển thị tên thuốc điều trị kê đơn, thuốc tiêm, liều lượng, hay phác đồ nội bộ trên tài khoản khách hàng.

### D-07: Quy tắc Hai Người Phê duyệt Đợt Nhập (Two-Man Rule)
- **Trạng thái:** **`APPROVED — GOVERNANCE POLICY`** *(Nguồn: Chat 05/11/2026)*
- **Phương án lựa chọn:** Áp dụng nguyên tắc Bốn Mắt (Two-Man Rule) trực tiếp ở tầng CSDL: Người tải tệp Excel lên không được phép tự phê duyệt job nhập liệu (`approved_by <> created_by`). Yêu cầu tài khoản Admin độc lập có ca trực active và MFA AAL2 phê duyệt.

### D-08: Cơ chế Phân ca & Quản lý Ca trực
- **Trạng thái:** **`APPROVED — SCHEDULING DESIGN`** *(Nguồn: Brief 26/10/2026)*
- **Phương án lựa chọn:** Ca trực linh hoạt do Quản lý thiết lập theo lịch tuần/tháng thực tế; không hardcode ca cố định 08-14/14-21/21-08 trong mã nguồn để bảo đảm thích ứng linh hoạt.

### D-08-NIGHT: Vận hành Trực Đêm tại Bệnh viện
- **Trạng thái:** **`CONFIRMED — OPERATIONS`** *(Nguồn: Chat 26/10/2026)*
- **Phương án lựa chọn:** Bệnh viện có nhân sự trực tại viện qua đêm để chăm sóc ca lưu viện và theo dõi thú cưng nặng.
- **Ràng buộc:** **Tuyệt đối không tuyên bố dịch vụ cấp cứu 24/24 trên website công khai** để tránh hiểu lầm khách hàng vãng lai mang thú cưng đến khám ngoài giờ không báo trước.

### D-09: Chính sách Xử lý Số dư Điểm Tích lũy Cũ
- **Trạng thái:** **`APPROVED — DATA POLICY`** *(Nguồn: Chat 05/11/2026)*
- **Phương án lựa chọn:** Lưu trữ bền vững số dư điểm cũ từ GPet vào bảng `app.historical_loyalty_points` để ghi nhận quyền lợi lịch sử của khách hàng.
- **Ràng buộc:** Khóa không cho phép tự động quy đổi thành voucher hoặc tiền giảm giá trên hệ thống mới; chờ chính sách chăm sóc khách hàng mới từ Ban Giám đốc.

### POL-DECEASED: Xử Lý Thú Cưng Đã Mất
- **Trạng thái:** **`PROPOSED — PRIVACY DESIGN`** *(Quy tắc đề xuất kỹ thuật)*
- **Phương án lựa chọn:** Khi thú cưng qua đời, hồ sơ được gán cờ `is_deceased = TRUE`. Hệ thống tự động loại trừ khỏi mọi chiến dịch marketing, nhắc lịch tiêm phòng, hay tin nhắn tự động nhằm tôn trọng cảm xúc của chủ nuôi.

### D-10: Thời hạn Tự động Xóa Video/Ảnh Nội trú
- **Trạng thái:** **`APPROVED — RETENTION POLICY`** *(Nguồn: Chat 05/11/2026)*
- **Phương án lựa chọn:** Tự động xóa vĩnh viễn video và ảnh lưu viện trên Storage sau **60 ngày kể từ thời điểm tải lên (`uploaded_at`)** nhằm tối ưu hóa dung lượng lưu trữ.

### D-11: Khung Pháp lý Bảo vệ Dữ liệu (PDPD - Nghị định 13/2023)
- **Trạng thái:** **`APPROVED — INTERNAL REVIEW PROCESS`** *(Nguồn: Chat 05/11/2026)*
- **Phương án lựa chọn:** Giao nhân sự nội bộ tự rà soát quy trình quản lý dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP; không thuê đơn vị tư vấn luật bên ngoài.
- **Ràng buộc:** Nhãn trạng thái thể hiện rõ đây là **quy trình tự rà soát nội bộ**, không được coi là chứng nhận đã đạt chuẩn tuân thủ pháp luật hoàn tất.

### D-12: Hiển thị Thông tin Y khoa trên Portal Khách hàng
- **Trạng thái:** **`APPROVED — CUSTOMER CLINICAL VISIBILITY`** *(Nguồn: Baseline V1 26/10/2026)*
- **Phương án lựa chọn:** Khách hàng chỉ được xem các bản tin y khoa và chẩn đoán tổng quan đã được Bác sĩ phê duyệt phát hành (`published`).
- **Ràng buộc:** Tuyệt đối không hiển thị tên thuốc nội bộ, liều lượng, giờ tiêm, phác đồ điều trị hay y lệnh nội bộ.

### D-13: Tối Thiểu Hóa Thu Thập Định Danh Khách Hàng
- **Trạng thái:** **`APPROVED — PRIVACY DESIGN`** *(Nguồn: Chat 05/11/2026)*
- **Phương án lựa chọn:** Tuyệt đối không thu thập số CCCD thô trên web portal; định danh trực tuyến dựa trên SĐT + Họ tên + Tên thú cưng.
- **Ràng buộc:** Xác minh CCCD chỉ thực hiện trực tiếp tại quầy tiếp tân khi khách hàng yêu cầu liên kết hồ sơ lịch sử phức tạp.

### D-14: Kiến Trúc Cô Lập Máy Chủ Worker
- **Trạng thái:** **`APPROVED — DESIGN ONLY`** *(Nguồn: Chat 05/11 & Lệnh 06/11/2026)*
- **Phương án lựa chọn:** 1 VPS (dự toán thiết kế $5.00/tháng - Hetzner CX22 / DigitalOcean) cách ly bằng Docker Container phi-root (`user: 1000:1000`).
- **Nội dung phê duyệt thiết kế:**
  * Chủ dự án chọn phương án 1 VPS.
  * Container cách ly parser xử lý file không tin cậy.
  * Quyền, credential và filesystem riêng biệt cho từng service.
  * Bảo vệ dữ liệu sao lưu khỏi môi trường xử lý file không tin cậy: Service sao lưu chạy độc lập bên ngoài Container parser với quyền và credential offsite riêng; Parser Container không có Default Gateway ra Internet, tường lửa chỉ Allowlist IP Supabase.
- **Ràng buộc:** **Chưa phê duyệt thuê VPS hoặc phát sinh chi phí vận hành.** Không được tự ý thuê server hoặc kích hoạt VPS trước khi có phê duyệt riêng.

### D-15: Chính sách Xử Lý Hạn Sử Dụng Thiếu
- **Trạng thái:** **`APPROVED — INVENTORY POLICY`** *(Nguồn: Đề xuất v1.6.6)*
- **Phương án lựa chọn:** Tuyệt đối không tự sinh HSD giả tạo; gán trạng thái `unknown` và đưa vào diện cách ly (`quarantined`), cấm xuất bán cho đến khi kiểm kho thực tế.

### D-16: Nơi Chạy Máy Chủ API & Quản Lý Bí Mật
- **Trạng thái:** **`APPROVED — ARCHITECTURE`** *(Nguồn: Baseline v1.6.5)*
- **Phương án lựa chọn:** Supabase Edge Functions (Deno, Singapore, $0 phụ phí) kết hợp Supabase Vault để quản trị secret keys.
- **Ràng buộc:** Không dựng Node.js API Service riêng biệt trên VPS.

### D-17: Nhà Cung Cấp Lưu Trữ Website Công Khai (Hosting)
- **Trạng thái:** **`APPROVED FOR EVALUATION ONLY`** *(Nguồn: Brief 05/11/2026)*
- **Phương án lựa chọn:** Ưu tiên đánh giá Cloudflare Pages (tương thích React Router 7/Vite SPA, CDN toàn cầu, Turnstile tích hợp, $0 phụ phí).
- **Ràng buộc:** Chưa phê duyệt chính thức cho Production; chưa mua tài khoản Vercel Pro ($20/tháng).

### D-18: Xác Nhận Đơn Vị Hành Chính Địa Chỉ Cơ Sở
- **Trạng thái:** **`PENDING VERIFICATION — ADDRESS & SEO`** *(Nguồn: Chat 05/11/2026 / Chờ đối chiếu Giấy phép)*
- **Phương án lựa chọn:** Địa chỉ cơ sở số nhà `101 Khuất Duy Tiến` đã được nêu trong chat; đơn vị hành chính Phường (Nhân Chính / Thanh Xuân Bắc) đang được đối chiếu với giấy phép hành nghề y tế / đăng ký kinh doanh thực tế.
- **Ràng buộc:** Tạm thời sử dụng địa chỉ repo (`docs/seo-strategy.md`) cho cấu hình kỹ thuật, nhưng không tự đóng dấu APPROVED hoàn toàn cho đến khi có bản sao giấy phép chính thức từ Chủ dự án.

### D-19: Cơ Chế Tạo Hồ Sơ Khách Khi Đăng Ký (Lazy Creation)
- **Trạng thái:** **`APPROVED — DESIGN`** *(Nguồn: Brief 05/11/2026)*
- **Phương án lựa chọn:** Áp dụng triệt để 10 quy tắc Lazy Customer Profile Creation: Đăng ký Auth bằng OAuth/Email chỉ tạo bản ghi `app.users`, không tạo bản ghi `app.customers` rác; chỉ tạo hồ sơ khi thực sự phát sinh giao dịch đặt lịch/khám chữa tại quầy.

### D-20: Chính Sách Thiết Bị Ghi Hình & Media (BYOD)
- **Trạng thái:** **`APPROVED WITH CONDITIONS`** *(Nguồn: Brief 05/11/2026)*
- **Phương án lựa chọn:** Cho phép nhân viên dùng điện thoại cá nhân (BYOD) tải ảnh/video qua ứng dụng Web PWA chuyên dụng của bệnh viện.
- **Ràng buộc:** Tuân thủ triệt để Kiến trúc Bảo mật BYOD 4 Tầng: (1) In-memory capture qua `getUserMedia()`, giảm thiểu ghi vào Camera Roll cá nhân; (2) Khử EXIF/GPS server-side bằng Sharp và FFmpeg bitexact; (3) Ràng buộc phiên thiết bị qua bảng `app.staff_device_sessions` với `is_trusted DEFAULT FALSE` và 4 RPCs quản lý vòng đời; (4) Xử lý mã lỗi `403 DEVICE_REVOKED`, zeroize cache cục bộ, server-side thu hồi Refresh Tokens Auth.

### D-LINK: Thẩm quyền Phê duyệt Liên kết Tài khoản Khách hàng
- **Trạng thái:** **`APPROVED — SECURITY POLICY`** *(Nguồn: Chat 05/11/2026)*
- **Phương án lựa chọn:** Tiếp tân chỉ tiếp nhận và lập phiếu yêu cầu đối soát tại quầy (`app.user_link_requests`); thẩm quyền phê duyệt thuộc về Quản lý (role Admin có MFA AAL2 qua RPC `app.rpc_resolve_recycled_phone`).

---

## IV. PHÂN BIỆT RANH GIỚI VAI TRÒ KỸ THUẬT VÀ QUY TẮC ĐỀ XUẤT (PROPOSED RULES)

1. **Ranh Giới Vai Trò Kỹ Thuật `admin` vs Chức Danh "Quản Lý":**
   - Trong CSDL PostgreSQL, bảng `app.staff_role_assignments` có ràng buộc CHECK nghiêm ngặt:
     ```sql
     CHECK (role IN ('veterinarian', 'cashier', 'spa_staff', 'receptionist', 'admin'))
     ```
   - Chức danh "Quản lý phòng khám" (Clinic Manager) trong thực tế vận hành được gán vai trò kỹ thuật là `'admin'`. Hệ thống tuyệt đối **không tồn tại enum `'manager'`**.
2. **Quy Tắc Khóa Bệnh Án Sau 24 Giờ (`PROPOSED CLINICAL RULE`):**
   - Đề xuất kỹ thuật: Bệnh án tự động khóa cứng (`is_locked = TRUE`) sau 24 giờ kể từ thời điểm tạo hoặc khi xuất viện; mọi chỉnh sửa sau đó bắt buộc thực hiện qua Addendum (`app.clinical_amendments`).
   - Quy tắc này mang nhãn **`PROPOSED`**, đang chờ Bác sĩ trưởng / Chủ dự án chuẩn hóa quy trình trước khi kích hoạt chính thức.
