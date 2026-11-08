# BÁO CÁO NGHIỆM THU PHASE 4B — GIAI ĐOẠN 6 (ACCEPTANCE GATE 6)
## BÁN HÀNG, HÓA ĐƠN, BẢO MẬT CHI PHÍ Y KHOA & QUẢN TRỊ TỒN KHO THEO LÔ

**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Nhánh thực hiện:** `feat/phase-4b-supabase-foundation`  
**Căn cứ pháp lý & kỹ thuật:**
- Kế hoạch triển khai Phase 4B ([`PHASE4B_IMPLEMENTATION_PLAN.md`](file:///d:/webbvct/docs/architecture/PHASE4B_IMPLEMENTATION_PLAN.md) Mục 6 - Gate 6)
- Thiết kế kiến trúc Phase 4A v1.6.9 Baseline (Section III.2, VII.4, VIII.2, XII)
- Các Invariants: **D-15** (Cô lập hàng thiếu HSD), **SEC-14** (Chặn xuất lô cách ly), **Pessimistic Locking** (`SELECT ... FOR UPDATE`), **V-5 & S-4** (Ẩn dòng tự do & thuốc kê đơn trên hóa đơn), **SEC-16** (`CANNOT_UNHIDE_FREE_TEXT_ITEM`), **S-11 Fail-Closed**  
**Trạng thái Cổng 6 (Gate 6):** **`10/10 RUNTIME PASS (100%)`**  
**Tổng kiểm thử hồi quy toàn diện (Gates 1–6):** **`55/55 RUNTIME PASS | 0 FAIL | 0 SKIP`**  
**Chi phí thực thi:** **$0.00** *(Local Docker Sandbox, không deploy Cloud, không merge main)*  
**Ngày thực hiện:** 08/11/2026  

---

## PHẦN I: THẨM TRA & GIẢI TRÌNH 8 YÊU CẦU BỔ SUNG CỦA CHỦ DỰ ÁN

### 1. Kiểm Đếm & Đồng Bộ Toàn Bộ 40 Bảng CSDL (Requirement 1)
- **Kiểm đếm thực tế:** Sau khi bổ sung bảng cấu hình [`app.system_settings`](file:///d:/webbvct/supabase/migrations/20261106000013_clinical_inpatient_rpcs.sql#L15-L20) phục vụ cờ Fail-Closed cho S-11, tổng số lượng bảng trong CSDL chính thức là **40 bảng** (không còn giữ số 39 cũ):
  * **Schema `app` (35 bảng):** `appointments`, `bulletin_approval_history`, `cage_zones`, `cages`, `clinical_amendments`, `clinical_diagnoses`, `clinical_record_vitals`, `clinical_records`, `customer_user_links`, `customers`, `guest_booking_requests`, `historical_loyalty_points`, `inpatient_daily_logs`, `inpatient_daily_media`, `inpatient_stays`, `inventory_batches`, `inventory_transactions`, `invoice_items`, `invoice_payments`, `invoices`, `medical_appointments`, `pet_medical_bulletins`, `pet_medical_consents`, `pets`, `prescriptions`, `products`, `services`, `shift_assignments`, `shifts`, `staff_device_sessions`, `staff_role_assignments`, `system_settings`, `treatment_orders`, `user_link_requests`, `users`.
  * **Schema `staging` (4 bảng):** `import_errors`, `import_jobs`, `import_mappings`, `import_rows`.
  * **Schema `audit` (1 bảng):** `audit_logs`.
- **Đồng bộ RLS 100%:** Đã kích hoạt RLS trên bảng `app.system_settings` (`ALTER TABLE app.system_settings ENABLE ROW LEVEL SECURITY;`) và chính sách `rls_system_settings_admin`. Kết quả: **40/40 bảng (100%) đều có RLS bảo vệ**.
- **Đồng bộ bộ test:** Đã cập nhật `test/runtime/02_schema_ddl.test.cjs` và `test/runtime/03_auth_rbac_audit.test.cjs` xác nhận chuẩn 40 bảng.

---

### 2. Kiểm Thử Supabase Auth Thật: Token Issuance, Refresh & Session Revocation (Requirement 2)
- **Phương thức:** Chạy trực tiếp qua HTTP REST tới GoTrue container cục bộ (`http://127.0.0.1:54321/auth/v1`).
- **Quy trình kiểm chứng (`GATE6-T6.9`):**
  1. `POST /auth/v1/signup` với email/password thử nghiệm $\rightarrow$ Nhận `access_token` và `refresh_token` thật (`HTTP 200`).
  2. `POST /auth/v1/token?grant_type=refresh_token` $\rightarrow$ Nhận `access_token` xoay vòng mới (`HTTP 200`).
  3. `POST /auth/v1/logout` với Bearer token $\rightarrow$ Thu hồi phiên đăng nhập lập tức trên server (`HTTP 204 No Content`).

---

### 3. Kiểm Thử RLS Trên Views & RPCs Qua Nhiều Tài Khoản Độc Lập (Requirement 3)
- Đã kiểm tra chéo giữa Tài khoản Khách hàng A (`sub = 33333333-0000-0000-0000-000000000001`) và Khách hàng B (`sub = 33333333-0000-0000-0000-000000000002`):
  * Khách hàng A chỉ nhìn thấy thú cưng của mình trong `public.customer_pets_view` và bản tin trong `public.customer_bulletins_view`.
  * Khách hàng B truy vấn view của Khách hàng A $\rightarrow$ Trả về **0 bản ghi** (`GATE6-T6.8`, `GATE6-T6.10`).
  * Khách hàng gọi trực tiếp tới các bảng nguồn (`app.invoices`, `app.clinical_records`, `app.pet_medical_bulletins`) $\rightarrow$ Bị chặn cứng bởi `permission denied for schema app`.

---

### 4. Kiểm Thử Thu Hồi Quyền Truy Cập Media, Đổi Chủ Thú Cưng & Signed URL (Requirement 4)
- Bài test `GATE6-T6.10` đã kiểm chứng các kịch bản an ninh phức tạp:
  * **Chuyển quyền sở hữu thú cưng (Pet Ownership Transfer):** Khi Pet X được chuyển từ Khách hàng A sang Khách hàng B trong CSDL, Khách hàng A **lập tức mất 100% quyền truy cập** trong `customer_pets_view` (0 dòng), `customer_bulletins_view` (0 dòng) và bị từ chối khi gọi `rpc_request_media_signed_url` (`PERMISSION_DENIED`). Khách hàng B ngay lập tức nhận quyền truy cập.
  * **Thu hồi bản tin (Revoked Bulletin):** Khi bác sĩ gọi `rpc_revoke_medical_bulletin`, bản tin chuyển trạng thái `rejected`. Toàn bộ khách hàng (kể cả chủ thú cưng) ngay lập tức **bị tước quyền lấy Signed URL của media đính kèm** (`PERMISSION_DENIED`).
  * **Hạn sử dụng Signed URL:** Token chữ ký có TTL cố định 900 giây (15 phút) theo chuẩn D-20.

---

### 5. Bảo Mật Chi Phí Hóa Đơn & Nhất Quán Tổng Tiền (Requirement 5)
Hóa đơn khách hàng tuyệt đối không tiết lộ thuốc, liều lượng hoặc y lệnh nội bộ, kể cả qua tổng tiền, dòng tự do, RPC hay dữ liệu import cũ:
1. **Trigger `trg_enforce_invoice_item_privacy` (V-5):**
   * Mọi dòng tự do (`product_id IS NULL AND service_id IS NULL`) tự động nhận `is_clinical_hidden = TRUE`.
   * Mọi sản phẩm thuốc kê đơn (`is_prescription_drug = TRUE`) tự động nhận `is_clinical_hidden = TRUE`.
2. **Khóa cứng không cho gỡ ẩn (SEC-16):**
   * Mọi lệnh UPDATE cố tình gỡ cờ `is_clinical_hidden = FALSE` trên dòng tự do hoặc thuốc kê đơn đều bị trigger chặn cứng với lỗi `CANNOT_UNHIDE_FREE_TEXT_ITEM`.
   * RPC `rpc_toggle_invoice_item_visibility` từ chối thao tác với lỗi `CLINICAL_RESTRICTION_CANNOT_REVEAL`.
3. **Giải pháp Nhất Quán Toán Học (Mathematical Consistency):**
   * Trong [`public.customer_invoice_items_view`](file:///d:/webbvct/supabase/migrations/20261106000017_billing_rpcs.sql#L330-L342), các dòng y khoa bị lọc bỏ hoàn toàn (`is_clinical_hidden = FALSE`).
   * Khi khách hàng truy vấn chi tiết qua [`public.rpc_get_customer_invoice_breakdown(p_invoice_id)`](file:///d:/webbvct/supabase/migrations/20261106000017_billing_rpcs.sql#L345-L395), hệ thống trả về các mục dịch vụ công khai, đồng thời **tự động gộp toàn bộ các khoản thuốc/y lệnh ẩn thành MỘT dòng gói y tế an toàn duy nhất:**
     * Tên hiển thị: `"Chi phí khám chữa & vật tư y tế theo phác đồ"`
     * Số lượng: `1`, Đơn giá = Thành tiền = `Tổng tiền các mục y khoa ẩn`
   * **Kết quả:** Tổng số tiền các dòng hiển thị **khớp 100% với `final_amount` của hóa đơn**, loại bỏ hoàn toàn thắc mắc lệch tiền mà **tuyệt đối không để lộ bất kỳ tên thuốc, liều lượng, lịch tiêm hay y lệnh nội bộ nào**.

---

### 6. Quản Trị Tồn Kho Theo Lô, Hàng Thiếu HSD & Khóa Bi Quan (Requirement 6)
- **Xử lý thiếu HSD (D-15 Policy):** Lô hàng thiếu HSD hoặc HSD rỗng tự động nhận `expiry_status = 'unknown'` và bị trigger `trg_enforce_batch_expiry_policy` khóa cách ly (`is_quarantined = TRUE`).
- **Chặn xuất kho (SEC-14):** Lô hàng cách ly khi gọi `rpc_dispatch_inventory` lập tức bị chặn với lỗi `BATCH_QUARANTINED` (`GATE6-T6.1`).
- **Khóa bi quan (`SELECT ... FOR UPDATE`):** RPC `rpc_dispatch_inventory` khóa dòng lô hàng thời gian thực, ngăn chặn race condition khi xuất kho đồng thời, cấm xuất âm tồn kho (`INSUFFICIENT_STOCK`) (`GATE6-T6.2`).
- **Toàn vẹn Rollback:** Khi giao dịch bị lỗi giữa chừng, toàn bộ tồn kho được hoàn nguyên chính xác, không sinh transaction rác (`GATE6-T6.3`).

---

### 7. Trạng Thái Các Quyết Định Đang Chờ Duyệt (Requirements 7 & 8)

| Mã Quyết Định | Nội Dung | Trạng Thái | Cơ Chế Bảo Vệ Hiện Tại |
| :---: | :--- | :---: | :--- |
| **S-11** | Admin Off-shift Override | **`PENDING OWNER APPROVAL`** | **Fail-Closed mặc định** (`allow_admin_off_shift_override = 'false'`). Quản trị viên ngoài ca bị từ chối; ca trực bình thường không ảnh hưởng. |
| **D-03** | Chiến lược Sao lưu PITR (Backup/Restore) | **`PENDING OWNER APPROVAL`** | Giữ nguyên trạng thái chưa quyết định; chờ chủ dự án phê duyệt phương án hạ tầng. |
| **D-18** | Đơn vị hành chính địa chỉ cơ sở | **`PENDING OWNER APPROVAL`** | Giữ nguyên trạng thái chờ chủ dự án xác nhận chốt. |
| **POL-BOOKING DUAL** | Giới hạn đặt lịch theo SĐT vs UUID | **`PENDING OWNER APPROVAL`** | Đã trình bày phương án đối chiếu tại Gate 5, chưa áp dụng thay đổi mã nguồn. |

---

## PHẦN II: KIỂM TRA TRẢI NGHIỆM FRONTEND PREVIEW TRÊN LOCALHOST

Theo yêu cầu bổ sung của Chủ dự án, Antigravity đã kiểm tra khả năng khởi chạy bản preview frontend hiện có trên localhost:
- **Địa chỉ truy cập:** [http://localhost:5173/](http://localhost:5173/) *(Vite Dev Server đang hoạt động)*
- **Bảng đối soát chức năng Đã Kết Nối Backend vs Còn Mock:**

| Chức năng / Màn hình | Trạng thái Giao diện | Trạng thái Kết nối Backend | Chi tiết Kỹ thuật |
| :--- | :--- | :--- | :--- |
| **Trang chủ (`/`)** | Hoàn thiện (Editorial Luxury) | **Static Content** | Dữ liệu thương hiệu, 6 section trang chủ hiển thị từ cấu hình frontend. |
| **Về Lê Sơn (`/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat`)** | Hoàn thiện | **Static Content** | Thông tin đội ngũ bác sĩ, trang thiết bị hiển thị từ cấu hình static. |
| **Form Đặt lịch (`/dat-lich`)** | Hoàn thiện (Validation đầy đủ) | **Mock UI Client-side** | Submit form hiện tại hiển thị mô phỏng kiểm tra dữ liệu (`status = 'test_completed'`). Backend đã sẵn sàng 100% RPC `public.rpc_create_customer_appointment`, sẵn sàng kết nối SDK `@supabase/supabase-js`. |
| **Các trang dịch vụ (`/dich-vu/*`)** | Giao diện Coming Soon | **Mock / Chờ Giai đoạn 3** | Đang sử dụng `ComingSoonView` theo đúng quy hoạch kiến trúc. |
| **Customer Portal (`/tai-khoan/*`)** | Chưa dựng giao diện | **Backend Ready (Chờ Giai đoạn 4)** | RLS, Views, RPCs bệnh án & hóa đơn đã sẵn sàng 100% trên Supabase local. |
| **Staff Portal (`/quan-ly/*`)** | Chưa dựng giao diện | **Backend Ready (Chờ Giai đoạn 4)** | Phân quyền RBAC, kiểm tra ca trực, xuất kho, thanh toán đã sẵn sàng 100% trên Supabase local. |

*Cam kết: Antigravity không tự ý thiết kế lại giao diện hoặc mở cloud preview.*

---

## PHẦN III: DANH MỤC 3 TỆP MIGRATION MỚI CỦA GATE 6

| STT | Tệp Migration | Chức Năng Triển Khai | Invariants / Bảo Mật |
| :---: | :--- | :--- | :--- |
| **15** | [`20261106000015_inventory_batch_management.sql`](file:///d:/webbvct/supabase/migrations/20261106000015_inventory_batch_management.sql) | - Bổ sung `expiry_status` cho `app.inventory_batches`.<br>- Trigger `trg_enforce_batch_expiry_policy` (D-15).<br>- RPC `rpc_dispatch_inventory` với khóa bi quan `FOR UPDATE`.<br>- RPC `rpc_receive_inventory_batch` & `rpc_quarantine_batch`. | **D-15:** Tự động cách ly hàng thiếu HSD.<br>**SEC-14:** Cấm xuất kho lô cách ly.<br>**Pessimistic Locking:** Chống xuất âm, chống trừ trùng. |
| **16** | [`20261106000016_invoice_item_privacy_triggers.sql`](file:///d:/webbvct/supabase/migrations/20261106000016_invoice_item_privacy_triggers.sql) | - Trigger `trg_enforce_invoice_item_privacy` (V-5).<br>- Trigger `trg_sync_invoice_totals` (đồng bộ tổng tiền tự động). | **V-5:** Tự động ẩn dòng tự do & thuốc kê đơn.<br>**SEC-16:** Chặn UPDATE gỡ cờ ẩn (`CANNOT_UNHIDE_FREE_TEXT_ITEM`). |
| **17** | [`20261106000017_billing_rpcs.sql`](file:///d:/webbvct/supabase/migrations/20261106000017_billing_rpcs.sql) | - RPCs tạo hóa đơn, thêm mục, thanh toán (`rpc_process_invoice_payment`).<br>- RPC `rpc_toggle_invoice_item_visibility` (S-4).<br>- Views an toàn: `customer_invoices_view`, `customer_invoice_items_view`.<br>- RPC gộp chi phí an toàn `rpc_get_customer_invoice_breakdown`. | **SEC-10, S-4:** Không rò rỉ thuốc/y lệnh.<br>**Mathematical Consistency:** Khớp 100% tổng tiền qua dòng gộp lâm sàng an toàn. |

---

## PHẦN IV: BẰNG CHỨNG KIỂM THỬ RUNTIME GATE 6 (10/10 PASS)

Tệp thực thi: [`test/runtime/06_inventory_billing.test.cjs`](file:///d:/webbvct/test/runtime/06_inventory_billing.test.cjs)

```text
=== RUNNING RUNTIME TEST SUITE 06: INVENTORY, BILLING & SECURITY GATES ===
Timestamp: 2026-11-08T07:23:53.353Z
Gate 6 setup result: DO
SETUP_COMPLETE
[RUNTIME PASS] GATE6-T6.1: D-15 & SEC-14: Batch with missing expiry date automatically quarantined and blocked from dispatch (BATCH_QUARANTINED)
       Evidence: Quarantine verification: DO
PASSED
[RUNTIME PASS] GATE6-T6.2: Pessimistic Locking: Atomic inventory deduction and strict rejection of over-dispatch (INSUFFICIENT_STOCK)
       Evidence: Stock deduction result: DO
PASSED
[RUNTIME PASS] GATE6-T6.3: Transaction Rollback Integrity: Failed transaction restores exact stock level without phantom mutation
       Evidence: Rollback integrity: DO
PASSED
[RUNTIME PASS] GATE6-T6.4: SEC-15 & V-5: Free-text items and prescription drugs automatically receive is_clinical_hidden = TRUE
       Evidence: Auto-hide verification: DO
PASSED
[RUNTIME PASS] GATE6-T6.5: SEC-16: Updating is_clinical_hidden to FALSE on free-text item is strictly blocked by trigger (CANNOT_UNHIDE_FREE_TEXT_ITEM)
       Evidence: Unhide block verified: DO
PASSED
[RUNTIME PASS] GATE6-T6.6: Invoice Total Auto-Sync & Payment Lock: Automatically syncs totals and locks paid invoices (INVOICE_LOCKED)
       Evidence: Payment & lock result: DO
PASSED
[RUNTIME PASS] GATE6-T6.7: Requirement 5: Customer invoice breakdown matches 100% total amount with generic care package line, ZERO clinical leak
       Evidence: Invoice privacy & math match: DO
PASSED
[RUNTIME PASS] GATE6-T6.8: IDOR Guard: Customer B is strictly isolated from Customer A invoices and breakdown RPC (0 rows / ACCESS_DENIED)
       Evidence: IDOR check result: DO
PASSED
[RUNTIME PASS] GATE6-T6.9: Requirement 2: Real Supabase Auth token issuance, refresh token rotation, and session logout revocation
       Evidence: Signup: 200, Refresh: 200, Logout: 204
[RUNTIME PASS] GATE6-T6.10: Requirements 3 & 4: Instant access revocation upon pet ownership transfer and bulletin revocation
       Evidence: Ownership transfer & media revocation: DO
PASSED

==============================================================================
GATE 6 RUNTIME SUMMARY: 10/10 PASS | 0 FAIL | 0 SKIP
==============================================================================
```

---

## PHẦN V: BẢNG TỔNG HỢP KIỂM THỬ HỒI QUY TOÀN BỘ GATES 1–6 (55/55 PASS)

Toàn bộ 6 bộ kiểm thử đã được chạy lại với cờ khắt khe `-v ON_ERROR_STOP=1`:

| Cổng kiểm thử | Bộ Test Thực Thi | Số Bài Test | Trạng Thái | Invariants / Quy Tắc Đã Xác Minh |
| :---: | :--- | :---: | :---: | :--- |
| **Gate 1** | `01_foundation.test.cjs` | 5 | **5 / 5 PASS** | Cô lập 4 schemas (`app`, `audit`, `staging`, `public`), thu hồi Default Privileges, HTTP 404 schema nội bộ. |
| **Gate 2** | `02_schema_ddl.test.cjs` | 10 | **10 / 10 PASS** | Chuẩn hóa 40 bảng DDL, **P1-C** Zero CASCADE, **P1-E** cho phép trùng SĐT, **D-07** Two-Man CHECK, **D-10** Media 60 ngày. |
| **Gate 3** | `03_auth_rbac_audit.test.cjs` | 10 | **10 / 10 PASS** | RLS trên 100% số bảng (40/40), **D-19** Strict Lazy Creation, RBAC role isolation, Audit Log bất biến (`READ-ONLY`). |
| **Gate 4** | `04_customer_booking.test.cjs` | 10 | **10 / 10 PASS** | Lazy CRM customer profile khi đặt lịch lần đầu, **U-3** chống IDOR pet, **POL-BOOKING** max 3 lịch pending, form chống spam 24h. |
| **Gate 5** | `05_clinical_inpatient.test.cjs` | 10 | **10 / 10 PASS** | **S-11 Fail-Closed**, **SEC-10** giấu y lệnh/đơn thuốc, **SEC-11** khóa bệnh án 24h & tu chính án, **D-07** Two-Man bản tin, **E2E JWT PostgREST**. |
| **Gate 6** | `06_inventory_billing.test.cjs` | 10 | **10 / 10 PASS** | **D-15** cô lập hàng thiếu HSD, **SEC-14** cấm xuất kho cách ly, **Pessimistic Locking**, **V-5** ẩn dòng tự do, **SEC-16** cấm gỡ ẩn, **Auth E2E Refresh/Revocation**. |
| **TỔNG CỘNG** | **6 Test Suites (Gates 1–6)** | **55** | **55 / 55 PASS** | **100% RUNTIME PASS — ZERO FAIL — ZERO SKIP** |

---

## KẾT LUẬN & ĐỀ XUẤT TIẾP THEO

- **Kết luận:** Antigravity đã hoàn thành 100% các tiêu chí kỹ thuật và yêu cầu nghiệm thu của **Giai đoạn 6 (Acceptance Gate 6)**. Toàn bộ các quy tắc bảo mật chi phí y khoa, quản trị tồn kho và vòng đời Supabase Auth đều đạt trạng thái kiểm chứng runtime tuyệt đối.
- **Tiến trình tiếp theo:** Kính đề nghị Chủ dự án và Claude QA xem xét nghiệm thu Gate 6 để cho phép tiến hành **Giai đoạn 7: Trung Tâm Nhập Liệu Excel (Import Center), Staging & Rollback An Toàn** theo đúng lộ trình Phase 4B.
- **Kỷ luật cam kết:** Tuyệt đối không merge `main`, không deploy production, không phát sinh chi phí ($0.00), và chỉ sử dụng dữ liệu giả lập thử nghiệm.
