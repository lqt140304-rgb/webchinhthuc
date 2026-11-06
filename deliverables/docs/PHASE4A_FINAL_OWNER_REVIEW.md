# Báo Cáo Tổng Kết Phase 4A & Trình Duyệt Chủ Dự Án (Owner Review)
**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Kiến trúc:** Phase 4A v1.6.9 Baseline  
**Tác giả:** Antigravity (Senior Product Designer & System Architect)  
**Đơn vị phối hợp:** ChatGPT (CEO Điều phối), Claude (QA độc lập tiền kiểm)  
**Ngày lập:** 06/11/2026  
**Trạng thái tài liệu:** **`PHASE 4A — READY FOR OWNER REVIEW`** *(Hồ sơ trình Chủ dự án nghiệm thu thiết kế; CHƯA bắt đầu Phase 4B)*

---

> [!IMPORTANT]
> ### NGUYÊN TẮC PHÂN BIỆT TRẠNG THÁI KIỂM THỬ & MINH BẠCH BẰNG CHỨNG (GOVERNANCE BASELINE)
> Tuân thủ chỉ đạo của CEO Review & Chủ dự án ngày 06/11/2026:
> 1. **Kết quả kiểm toán tĩnh 26/26 là báo cáo nội bộ của Antigravity** trên văn bản thiết kế và cú pháp DDL/SQL; **không được coi là chứng nhận backend đang hoạt động runtime**.
> 2. **Toàn bộ 92 ca kiểm thử (60 SEC, 32 IMP)** mang nhãn trung thực **`DESIGNED — NOT TESTED`**; chưa có bất kỳ ca nào đạt `RUNTIME PASS` vì chưa có môi trường thực thi.
> 3. **Các chỉ tiêu kỹ thuật** (RPC $\le 50$ms, parse Excel 1.000 dòng $\le 2$s, RPO $\le 24$h) là **mục tiêu đo lường thiết kế (Measurement Targets)**, tuyệt đối không tuyên bố là bảo đảm sẵn có khi chưa kiểm chứng tải thực tế.
> 4. **Trạng thái phê duyệt:**
>    - **`APPROVED`**: Bắt buộc có ngày và nguồn xác nhận cụ thể (tin nhắn, chỉ đạo hoặc brief từ Chủ dự án). Mục không có nguồn không tự nâng thành APPROVED.
>    - **`PENDING — NOT DECIDED`**: Chưa quyết định, tuyệt đối không suy diễn (không coi backup hàng ngày đã duyệt, không coi PITR bị từ chối vĩnh viễn, không cam kết RPO 24h).
>    - **`PENDING VERIFICATION`**: Đang chờ đối chiếu giấy phép / hồ sơ thực tế.
>    - **`PROPOSED`**: Quy tắc đề xuất kỹ thuật, chưa phải bất biến nghiệp vụ đã ký duyệt.

---

## 1. Tổng Quan Kết Quả Nghiệm Thu Thiết Kế Phase 4A

Hồ sơ thiết kế kiến trúc Phase 4A v1.6.9 đã hoàn thành việc chuẩn hóa toàn diện các ranh giới kỹ thuật:

1. **Phân rã Ranh giới Schema Cô lập (P1-D Invariant):**
   - Đạt chuẩn kiểm tra tĩnh tài liệu (**`STATIC PASS`**).
   - Toàn bộ 34 bảng nghiệp vụ cốt lõi nằm trong schema nội bộ `app.*`, cấm phơi ra PostgREST API (trả về HTTP 404).
   - Truy cập từ client bắt buộc thông qua các wrapper RPCs an toàn tại `public.*` với cờ `SECURITY DEFINER` và `SET search_path = ''`.
   - Cột `is_clinical_hidden = TRUE` kết hợp cờ `requires_clinical_hiding = TRUE` mặc định ẩn toàn bộ thuốc/y lệnh nội bộ; tự động gán ẩn cho mọi dòng tự do không có mã danh mục.
2. **Kiểm đếm Cơ sở Dữ liệu & Khóa Ngoại:**
   - Đạt chuẩn kiểm tra tĩnh cú pháp (**`STATIC PASS`**).
   - Đồng bộ nhất quán chính xác **39 bảng** xuyên suốt Mục III.1, ERD và Ma trận RBAC:
     * **34 bảng schema `app.*`**: Bao gồm đầy đủ `historical_loyalty_points` (có cờ xóa mềm và liên kết rollback) và `staff_device_sessions` (phân quyền riêng biệt cho Admin).
     * **4 bảng schema `staging.*`**: Phục vụ Trung tâm Nhập liệu Excel (`import_jobs`, `staging_customers`, `staging_pets`, `staging_inventory`).
     * **1 bảng schema `audit.*`**: Nhật ký kiểm toán bất biến `audit_logs`.
   - Cú pháp hàm PostgreSQL: **0 lỗi `AS $` đơn**, 22 khối hàm dùng chuẩn `AS $$ ... $$;`.
   - **0 định nghĩa trùng lặp** (0 duplicate table, 0 duplicate function, 0 duplicate trigger, 0 duplicate view).
3. **Cơ chế Nhập liệu & Rollback An toàn (J1 & J2 Invariants):**
   - Đạt chuẩn kiểm tra tĩnh logic (**`STATIC PASS`**).
   - Quy tắc Two-Man Rule được bảo vệ cứng trong hàm `rpc_import_approve_job` (chặn người tạo tự duyệt, yêu cầu ca trực active của Admin có MFA AAL2).
   - Rollback mềm an toàn qua `rpc_import_rollback_job`: kiểm tra toàn bộ dữ liệu phát sinh của khách hàng, khóa dòng `FOR UPDATE` chống race condition, tích hợp rollback bảng điểm lịch sử `historical_loyalty_points`.
4. **Mô hình Thiết bị BYOD 4 Tầng (D-20):**
   - Đạt chuẩn kiểm tra tĩnh đặc tả (**`STATIC PASS`**).
   - Tầng 1: Ưu tiên `navigator.mediaDevices.getUserMedia()` giữ ảnh trong RAM; minh bạch rủi ro lưu vào Camera Roll nếu dùng fallback file input.
   - Tầng 2: Sharp khử EXIF mặc định (không gọi `withMetadata()`); FFmpeg dùng `-map_chapters -1 -fflags +bitexact`.
   - Tầng 3: DDL `staff_device_sessions` với `is_trusted DEFAULT FALSE`, `staff_id ON DELETE RESTRICT`, 4 RPCs quản lý vòng đời thiết bị.
   - Tầng 4: Minh bạch giới hạn client-side Remote Wipe (cần mạng, không thể xóa tệp ngoài vùng sandbox ứng dụng hoặc khi máy offline); bù đắp bằng cơ chế Server-side thu hồi Supabase Auth Refresh Tokens và phiên JWT 1 giờ.
5. **Bộ Kiểm Thử Toàn Diện:**
   - Trạng thái: **`DESIGNED — NOT TESTED`** (92 / 92 ca kiểm thử).
   - Gồm 60 kịch bản Bảo mật (`SEC-01` đến `SEC-60`) và 32 kịch bản Nhập liệu (`IMP-01` đến `IMP-32`).

---

## 2. Bảng Tổng Hợp Trạng Thái Quyết Định Chủ Dự Án (Có Nguồn Xác Nhận)

Bảng đối chiếu đồng bộ chính xác với [OWNER_DECISION_REGISTER.md](file:///D:/webbvct/docs/architecture/OWNER_DECISION_REGISTER.md):

| Mã Quyết Định | Tên Quyết Định | Trạng Thái Hiện Tại | Ngày & Nguồn Xác Nhận | Tóm Tắt Nội Dung Đã Xác Nhận / Ràng Buộc Kỹ Thuật |
| :---: | :--- | :---: | :---: | :--- |
| **D-01** | Backend Stack (Supabase Managed) | **`APPROVED — ARCHITECTURE ONLY`** | 05/11/2026 (User message 1) | Duyệt kiến trúc Supabase PostgreSQL, Auth, Storage, Edge Functions. **Chưa duyệt mua Pro Plan (\$25/tháng), chưa tạo production project**. |
| **D-01-PRO** | Chính sách Mua gói Supabase Pro | **`APPROVED — PROCUREMENT`** | 03/11/2026 (Baseline v1.6.5) | Chỉ nâng Pro (\$25/tháng) khi chứng minh nhu cầu và có phê duyệt riêng. Giai đoạn dev dùng Free tier / Local Sandbox. |
| **D-02** | **Phạm vi Dữ liệu Nhập từ GPet Cũ** | **`APPROVED — DATA SCOPE`** | 26/10/2026 (PROJECT_BRIEF) | **Chỉ nhập dữ liệu thương mại** (khách, hàng hóa, dịch vụ, tồn kho đầu kỳ, hóa đơn); bệnh án lâm sàng cũ lưu riêng, không chuyển đổi. |
| **OP-HOURS** | **Khung Giờ Đón Khách Phòng Khám** | **`CONFIRMED — OPERATIONS`** | 26/10/2026 (Brief 2A) | Khung giờ mở cửa công khai đón khách tại viện: **08:00 – 20:00 hàng ngày**. Tách riêng khỏi mã D-02 nhập liệu. |
| **D-03** | **Sao lưu Khắc phục Thảm họa (DR) & PITR** | **`PENDING — NOT DECIDED`** | 06/11/2026 (Lệnh CEO Gate) | **Chủ dự án chưa chốt mua PITR hay chọn chính sách sao lưu cuối cùng.** Giữ giải pháp sao lưu hàng ngày R2 (\$0, RPO đề xuất $\le 24$h) làm **đề xuất kỹ thuật chờ duyệt**. PITR (\$100/tháng) chưa quyết định mua. |
| **D-PHONE** | **Nhiều Khách Hàng Dùng Chung SĐT** | **`APPROVED`** | 05/11/2026 (User msg 1 & 5) | Mỗi khách có UUID riêng (`app.customers.id`); **CSDL cấm tuyệt đối đặt UNIQUE trên cột `phone_number`** (Bất biến P1-E). Không tự động gom gộp tài khoản. |
| **D-04** | Captcha & Chống DDOS | **`APPROVED — SERVICE SELECTION`** | 05/11/2026 ("d 04 chọn a") | Chọn Cloudflare Turnstile (\$0, tôn trọng quyền riêng tư khách hàng). |
| **D-05** | Kênh Gửi Mã Xác Thực OTP | **`APPROVED — SERVICE SELECTION`** | 05/11/2026 ("d 05 gửi qua zalo") | Chọn gửi OTP qua Zalo ZNS (~500 OTP/tháng ~ 100.000 VNĐ, rẻ hơn SMS Brandname 3 lần). Dev dùng test numbers (\$0). |
| **D-06** | **Chính sách Bảo mật MFA Nhạy Cảm** | **`APPROVED — SECURITY POLICY`** | 03/11/2026 (Baseline v1.6.5) | Bắt buộc MFA AAL2 cho tài khoản Admin khi thực hiện thao tác nhạy cảm (rollback, duyệt import, đổi SĐT). |
| **POL-BOOKING**| **Giới Hạn Tần Suất Đặt Lịch Chống Spam**| **`APPROVED — RATE LIMIT`** | 05/11/2026 (Đề xuất v1.6.6) | Tối đa 3 lịch hẹn chưa hoàn tất / SĐT; chặn spam tự động qua Redis/Upstash hoặc PostgreSQL rate limiter. Tách độc lập khỏi mã D-06 MFA. |
| **D-06-INVOICE**| Ẩn Dữ Liệu Y Khoa Trên Hóa Đơn Khách | **`APPROVED — INVOICE PRIVACY`** | 03/11/2026 (Baseline v1.6.5) | Cấm tuyệt đối 100% hiển thị thuốc kê đơn, thuốc tiêm, phác đồ điều trị nội bộ cho khách. |
| **D-07** | Phê Duyệt Tệp Nhập Dữ Liệu Lớn | **`APPROVED — GOVERNANCE`** | 05/11/2026 ("d 07 lm theo đề xuất")| Áp dụng nguyên tắc Bốn Mắt (Two-Man Rule) cứng ở CSDL: `approved_by <> created_by`; yêu cầu Admin AAL2 có ca trực active. |
| **D-08** | Cơ Chế Phân Ca Linh Hoạt | **`APPROVED — SCHEDULING`** | 26/10/2026 (Brief 2A) | Ca trực linh hoạt do Quản lý thiết lập theo lịch thực tế; không hardcode ca cố định trong hệ thống. |
| **D-08-NIGHT** | Cơ Chế Trực Đêm Tại Bệnh Viện | **`CONFIRMED — OPERATIONS`** | 26/10/2026 (Brief 2A) | Có nhân sự trực tại viện qua đêm để chăm sóc ca lưu viện/cấp cứu; không công bố dịch vụ 24/24 trên website công khai. |
| **D-09** | **Xử Lý Số Dư Điểm Tích Lũy Cũ GPet** | **`APPROVED — DATA POLICY`** | 05/11/2026 (User message 1) | Lưu bền vững trong `app.historical_loyalty_points`; khóa không cho tự quy đổi voucher; chờ chính sách mới. |
| **POL-DECEASED**| **Xử Lý Thú Cưng Đã Mất** | **`PROPOSED — PRIVACY DESIGN`** | 05/11/2026 (Đề xuất kỹ thuật)| Gán cờ `is_deceased = TRUE`, loại trừ khỏi marketing nhắc lịch. Đang chờ Ban Giám đốc chuẩn hóa quy trình. |
| **D-10** | Thời Gian Lưu Trữ Media Lưu Viện | **`APPROVED — RETENTION POLICY`** | 05/11/2026 (User message 1) | **Xóa sau 60 ngày kể từ thời điểm upload (`uploaded_at`)**, không neo theo ngày xuất viện. |
| **D-11** | Đánh Giá Tuân Thủ Pháp Lý Dữ Liệu | **`APPROVED — INTERNAL REVIEW PROCESS`**| 05/11/2026 ("d 11 giao nhân sự nội bộ")| Tự rà soát nội bộ quy trình quản lý dữ liệu cá nhân (Nghị định 13/2023); không thuê luật sư ngoài; không coi là đã đạt chuẩn pháp lý. |
| **D-12** | Hiển Thị Y Khoa Trên Portal | **`APPROVED — CLINICAL VISIBILITY`** | 26/10/2026 (Architecture Baseline V1)| Khách chỉ xem bản tin chẩn đoán đã duyệt (`published`); **tuyệt đối không xem thuốc, liều lượng, y lệnh nội bộ**. |
| **D-13** | Tối Thiểu Hóa Định Danh Khách | **`APPROVED — PRIVACY DESIGN`** | 05/11/2026 (User message 1) | Không thu thập số CCCD thô trên web portal; chỉ thu thập tại quầy khi có yêu cầu nghiệp vụ phức tạp. |
| **D-14** | **Kiến Trúc Cô Lập Máy Chủ Worker** | **`APPROVED — DESIGN ONLY`** | 05/11 & 06/11/2026 (Lệnh CEO Gate)| **Duyệt thiết kế 1 VPS cách ly Container parser**, quyền, credential và filesystem riêng biệt, bảo vệ dữ liệu sao lưu. **Chưa duyệt thuê VPS hay chi phí vận hành**. |
| **D-15** | Xử Lý Hàng Hóa Thiếu Hạn Sử Dụng | **`APPROVED — INVENTORY POLICY`** | 05/11/2026 (Đề xuất v1.6.6) | Không tự sinh HSD giả; gán `unknown` và cách ly (`quarantined`), cấm xuất bán/kê đơn cho đến khi thủ kho xác minh. |
| **D-16** | Nơi Chạy API Backend & Bí Mật | **`APPROVED — ARCHITECTURE`** | 03/11/2026 (Baseline v1.6.5) | Supabase Edge Functions (Deno, Singapore) kết hợp Supabase Vault; không dựng Node.js server riêng trên VPS. |
| **D-17** | Hosting Website Công Khai | **`APPROVED FOR EVALUATION ONLY`** | 05/11/2026 (User message 1) | Ưu tiên đánh giá Cloudflare Pages (tương thích React Router 7/Vite SPA, \$0); **chưa duyệt triển khai Production**. |
| **D-18** | Đơn Vị Hành Chính Địa Chỉ Cơ Sở | **`PENDING VERIFICATION`** | 05/11/2026 ("d 18 101 khuất duy tiến...")| Địa chỉ `101 Khuất Duy Tiến` đã chốt; đơn vị Phường (Nhân Chính / Thanh Xuân Bắc) đang chờ đối chiếu giấy phép kinh doanh/y tế. |
| **D-19** | Cơ Chế Tạo Hồ Sơ Khách Hàng | **`APPROVED — DESIGN`** | 05/11/2026 (User message 1) | Áp dụng triệt để 10 quy tắc **Lazy Customer Profile Creation**: Đăng ký OAuth chỉ tạo danh tính Auth, không tạo `customers` rác; chỉ tạo hồ sơ khi có giao dịch thực tế. |
| **D-20** | Thiết Bị Ghi Hình & Media (BYOD) | **`APPROVED WITH CONDITIONS`** | 05/11/2026 (User message 1) | Cho phép dùng điện thoại cá nhân (BYOD) có điều kiện bảo mật nghiêm ngặt 4 tầng (in-memory capture, khử EXIF server-side, RPC trust workflow, remote wipe giới hạn). |
| **D-LINK** | Thẩm Quyền Phê Duyệt Liên Kết | **`APPROVED — SECURITY POLICY`** | 05/11/2026 (User message 1) | Tiếp tân chỉ tiếp nhận hồ sơ tại quầy; thẩm quyền phê duyệt liên kết tài khoản portal với lịch sử cũ thuộc về Quản lý (role Admin có MFA AAL2). |

---

## 3. Phân Định Ranh Giới Vai Trò CSDL & Quy Tắc Đề Xuất (Proposed Rules)

1. **Ranh Giới Vai Trò Kỹ Thuật `admin` vs Chức Danh "Quản Lý":**
   - Trong CSDL PostgreSQL, bảng `app.staff_role_assignments` có ràng buộc CHECK nghiêm ngặt:
     ```sql
     CHECK (role IN ('veterinarian', 'cashier', 'spa_staff', 'receptionist', 'admin'))
     ```
   - Chức danh "Quản lý phòng khám" (Clinic Manager) trong thực tế vận hành được gán vai trò kỹ thuật là `'admin'`. Hệ thống tuyệt đối **không tồn tại enum `'manager'` ảo**.
2. **Quy Tắc Khóa Bệnh Án Sau 24 Giờ (`PROPOSED CLINICAL RULE`):**
   - Đề xuất kỹ thuật: Bệnh án tự động khóa cứng (`is_locked = TRUE`) sau 24 giờ kể từ thời điểm tạo hoặc khi xuất viện; mọi chỉnh sửa sau đó bắt buộc thực hiện qua Addendum (`app.clinical_amendments`).
   - Quy tắc này mang nhãn **`PROPOSED`**, đang chờ Bác sĩ trưởng / Chủ dự án chuẩn hóa quy trình trước khi kích hoạt chính thức.
3. **Quy Tắc Tiếp Đón Khách Vãng Lai & Phân Bổ Lồng Chuồng (`PROPOSED WORKFLOW`):**
   - Các quy trình tiếp đón và gán lồng chuồng động là đề xuất thiết kế, sẽ được thử nghiệm trên sandbox và điều chỉnh theo thực tế vận hành.

---

## 4. Các Quyết Định Cần Chủ Dự Án Phê Duyệt Hoặc Xác Nhận

Để hoàn tất dứt điểm Phase 4A và chuẩn bị cho Phase 4B, kính trình Chủ dự án xem xét và cho ý kiến về 3 nội dung trọng tâm:

### 1. Phê Duyệt Ban Hành Sổ Quyết Định (`OWNER_DECISION_REGISTER.md`)
- Ký duyệt đề xuất chuẩn hóa bộ mã quyết định với đầy đủ nguồn chứng cứ có thể đối chiếu.
- Đặc biệt xác nhận chính thức:
  * `D-14`: Duyệt thiết kế 1 VPS cách ly container parser (`APPROVED — DESIGN ONLY`), chưa thuê máy chủ.
  * `D-PHONE / D-21`: Cho phép nhiều khách hàng dùng chung số điện thoại (`APPROVED`), bảo vệ bất biến P1-E.
  * `D-19`: Quy trình Lazy Creation khi người dùng đăng ký tài khoản (`APPROVED`).

### 2. Định Hướng Chính Sách Sao Lưu & PITR (`D-03`)
- Hiện tại tài liệu kỹ thuật đang để trạng thái **`PENDING — NOT DECIDED`**.
- Đội ngũ kỹ thuật đề xuất giải pháp sao lưu định kỳ hàng ngày bằng `pg_dump` mã hóa GPG 4096-bit đẩy lên Cloudflare R2 (\$0 phụ phí, mục tiêu RPO đề xuất $\le 24$ giờ).
- Gói Supabase PITR tua lại theo giây (\$100/tháng) đang tạm hoãn để tiết kiệm ngân sách.
- **Xin ý kiến Chủ dự án:** Chủ dự án có chấp thuận đề xuất sao lưu định kỳ hàng ngày (\$0) để chuyển trạng thái `D-03` sang `APPROVED — BACKUP POLICY` hay muốn tiếp tục giữ `PENDING` đánh giá thêm?

### 3. Xác Minh Đơn Vị Hành Chính Địa Chỉ Cơ Sở (`D-18`)
- Cơ sở phòng khám tại số **101 Khuất Duy Tiến, Quận Thanh Xuân, Hà Nội**.
- Đơn vị Phường đang chờ Chủ dự án đối chiếu với Giấy phép Đăng ký Kinh doanh hoặc Chứng chỉ hành nghề thú y (thuộc **Phường Nhân Chính** hay **Phường Thanh Xuân Bắc**) để chốt chính xác cho cấu hình SEO Schema LocalBusiness và chân trang website.

---

## 5. Minh Bạch Chi Phí & Kỷ Luật Triển Khai Tuyệt Đối

1. **Chi Phí Thực Tế Đã Tiêu Tốn Tại Phase 4A: $\mathbf{\$0.00}$ (Không đồng).**
   - Không mua Supabase Pro (\$25/tháng) hay PITR (\$100/tháng).
   - Không thuê VPS (\$5.00/tháng).
   - Không mua Vercel Pro (\$20/tháng).
   - Không kích hoạt bất kỳ add-on trả phí nào của Cloudflare.
   - Không mua dịch vụ SMS Brandname hay nạp tiền Zalo ZNS.
2. **Dự Toán Chi Phí Khi Vận Hành Production (Tương lai):**
   - Đã được chuẩn hóa số học chính xác: $\mathbf{\$34.50 – \$40.50 / \text{tháng}}$ (gồm Supabase Pro \$25, Worker VPS \$5, Backup R2 \$0.50, Domain \$1, WAF \$0–\$3, Zalo ZNS \$3–\$6).
   - Hạn mức này **chỉ mang tính dự toán thiết kế**, hoàn toàn chưa kích hoạt.
3. **Kỷ Luật Dữ Liệu:**
   - 100% dữ liệu thiết kế và thử nghiệm là **dữ liệu giả lập (synthetic/mock data)**.
   - Tuyệt đối không chạm vào, không chuyển đổi dữ liệu khách hàng hoặc bệnh án thật khi chưa có phê duyệt riêng.

---

## 6. Kết Luận & Điểm Dừng Nghiệm Thu

Hồ sơ thiết kế kiến trúc Phase 4A v1.6.9 đã đạt trạng thái hoàn thiện toàn diện về mặt kỹ thuật, logic DDL/SQL, bảo vệ bất biến y khoa và phân định quyền hạn.

**Trạng thái hiện tại: `PHASE 4A — READY FOR OWNER REVIEW`.**

Đội ngũ Antigravity **dừng toàn bộ thao tác tại đây** và không tự ý bắt đầu viết code Phase 4B cho đến khi nhận được sự phê duyệt chính thức từ Chủ dự án thông qua Phiếu Yêu Cầu Phê Duyệt [PHASE4A_OWNER_APPROVAL_REQUEST.md](file:///D:/webbvct/docs/architecture/PHASE4A_OWNER_APPROVAL_REQUEST.md).
