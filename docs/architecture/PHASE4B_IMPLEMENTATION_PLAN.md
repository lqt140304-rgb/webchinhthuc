# Kế Hoạch Triển Khai Kỹ Thuật Phase 4B (Implementation Plan)
**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Kiến trúc làm nền tảng:** Phase 4A v1.6.9 Baseline  
**Tác giả:** Antigravity (Senior Product Designer & System Architect)  
**Ngày lập:** 06/11/2026  
**Trạng thái kế hoạch:** **`PROPOSED PLAN — AWAITING OWNER APPROVAL TO COMMENCE`**  
*(Kế hoạch chuẩn bị cho Phase 4B; TUYỆT ĐỐI CHƯA TRIỂN KHAI MÃ NGUỒN khi chưa có lệnh chính thức từ Chủ dự án)*

---

> [!IMPORTANT]
> ### NGUYÊN TẮC BẮT BUỘC TRONG TRIỂN KHAI PHASE 4B (GOVERNANCE & SAFETY BASELINE)
> 1. **Môi trường Cục bộ 100% (Local Docker Sandbox):** Toàn bộ các bước từ 1 đến 8 được thực thi trên môi trường Supabase Local CLI chạy bằng Docker trên máy phát triển. Chi phí phát sinh là **\$0.00**.
> 2. **Dữ liệu Giả lập (Synthetic / Seed Mock Data):** Tuyệt đối không sử dụng dữ liệu khách hàng thật, số điện thoại thật, hoặc hồ sơ bệnh án thật trong quá trình kiểm thử.
> 3. **Không Triển khai Sản xuất (No Production Deployment):** Không tạo Supabase Cloud Production, không mua gói trả phí (Pro, PITR, VPS, Turnstile Paid), không cấu hình domain thật cho đến khi có phê duyệt riêng.
> 4. **An Toàn Thao Tác Sandbox (Destructive Command Restrictions):**
>    - Các lệnh nguy hiểm như `supabase db reset` hoặc `supabase stop --no-backup` **CHỈ ĐƯỢC PHÉP CHẠY TRÊN DISPOSABLE LOCAL TEST SANDBOX**.
>    - Bắt buộc kiểm tra biến môi trường (`APP_ENV=local_test`) trước khi chạy các script dọn dẹp; cấm tuyệt đối chạy các lệnh này trên bất kỳ môi trường nào có dữ liệu cần bảo toàn.
>    - Tuyệt đối **không đưa thông tin bí mật (secrets, private keys, service_role key)** vào mã nguồn Git hoặc in ra log terminal.
> 5. **Chỉ Tiêu Đo Lường Thiết Kế (Measurement Targets):**
>    - Các con số như thời gian thực thi RPC $\le 50$ms, thời gian xử lý tệp Excel 1.000 dòng $\le 2$ giây, và mục tiêu RPO $\le 24$ giờ là **MỤC TIÊU ĐO LƯỜNG THIẾT KẾ (MEASUREMENT TARGETS)**, tuyệt đối không coi là cam kết bảo đảm sẵn có khi chưa kiểm chứng tải thực tế.
> 6. **Minh Bạch Trạng Thái:** Không sử dụng các từ ngữ khẳng định như `RUNTIME PASS`, `PRODUCTION READY` hay `ZERO SECURITY VULNERABILITIES` khi chưa có log chạy thực tế trên máy chủ kiểm thử. Toàn bộ kịch bản kiểm thử trong tài liệu này hiện ở trạng thái **`DESIGNED — NOT TESTED` / `RUNTIME PENDING`**.

---

## 1. Giai Đoạn 1: Supabase Local Sandbox & Migration Nền Tảng

### 1.1. Phạm vi (Scope)
- Khởi tạo môi trường phát triển cục bộ bằng Supabase CLI (`supabase init`, `supabase start`).
- Thiết lập cấu trúc thư mục migrations chuẩn PostgreSQL: `supabase/migrations/`.
- Cấu hình các extension cốt lõi: `uuid-ossp`, `pgcrypto`, `citext`.
- Thiết lập 4 schema độc lập: `public`, `app`, `staging`, `audit`.
- Cấu hình PostgREST chỉ phơi `public` (`db-schemas = "public"`), ẩn hoàn toàn `app`, `staging`, `audit`.
- **Khóa quyền mặc định toàn cục (Default Privileges Locking):**
  ```sql
  -- Khóa quyền execute mặc định cho role postgres và các hàm mới trong tương lai
  ALTER DEFAULT PRIVILEGES FOR ROLE postgres REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public, app, staging, audit REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon;
  ```

### 1.2. Migration & Code Cần Viết
- `supabase/migrations/20261106000001_foundation_schemas_extensions.sql`: Khởi tạo schemas, extensions và default privileges.
- `scripts/sandbox/setup_local_env.sh` (hoặc PowerShell): Tự động hóa kiểm tra Docker daemon, kiểm tra an toàn môi trường (`APP_ENV=local_test`) và khởi động sandbox.

### 1.3. Phụ thuộc (Dependencies)
- Docker Desktop / Docker Engine trên máy local. Supabase CLI phiên bản mới nhất.

### 1.4. Test Thực Thi (Runtime Tests)
- `test/runtime/01_foundation.test.sql` (pgTAP):
  * Kiểm tra 4 schema tồn tại.
  * Kiểm tra PostgREST endpoint `http://localhost:54321/rest/v1/app` trả về HTTP 404 (Not Found).
  * Kiểm tra default privileges không tự cấp quyền cho `anon`.

### 1.5. Cổng Nghiệm Thu Giai Đoạn 1 (Acceptance Gate 1)
- [ ] Sandbox chạy ổn định trên Docker local, không lỗi kết nối.
- [ ] Schema `app.*` được cô lập 100% khỏi PostgREST API.
- [ ] pgTAP test 01 thực thi và đạt `RUNTIME PASS`.

### 1.6. Rủi ro & Kế hoạch Rollback
- *Rủi ro:* Xung đột cổng mạng Docker (54321, 54322) với các dịch vụ local khác.
- *Rollback:* Đổi cổng trong file `supabase/config.toml`, chạy `supabase stop` an toàn và khởi động lại.

### 1.7. Chi Phí Dự Kiến: **\$0.00**.

---

## 2. Giai Đoạn 2: Schema, Bảng & Khóa Ngoại (39 Bảng)

### 2.1. Phạm vi (Scope)
- Triển khai toàn bộ DDL của 39 bảng theo đúng kiến trúc Phase 4A v1.6.9:
  * 34 bảng trong schema `app.*` (bao gồm `staff_device_sessions` và `historical_loyalty_points`).
  * 4 bảng trong schema `staging.*` (`import_jobs`, `staging_customers`, `staging_pets`, `staging_inventory`).
  * 1 bảng trong schema `audit.*` (`audit_logs`).
- Thiết lập toàn bộ các ràng buộc khóa chính, khóa ngoại `ON DELETE RESTRICT` (triệt tiêu `ON DELETE CASCADE` theo P1-C), CHECK constraints, và chỉ mục tối ưu.
- Thực thi nghiêm ngặt bất biến P1-E: **CẤM UNIQUE trên cột `phone_number`** của `app.customers`.

### 2.2. Migration & Code Cần Viết
- `supabase/migrations/20261106000002_ddl_audit_schema.sql`: Bảng `audit.audit_logs`.
- `supabase/migrations/20261106000003_ddl_staging_schema.sql`: 4 bảng staging và CHECK status.
- `supabase/migrations/20261106000004_ddl_app_core_entities.sql`: `app.users`, `app.customers`, `app.pets`, `app.staff_role_assignments`, `app.staff_device_sessions`.
- `supabase/migrations/20261106000005_ddl_app_clinical_inpatient.sql`: `clinical_records`, `inpatient_admissions`, `prescriptions`, `vital_signs`, `treatment_orders`, `inpatient_daily_media`.
- `supabase/migrations/20261106000006_ddl_app_inventory_billing.sql`: `product_categories`, `service_categories`, `products`, `services`, `inventory_batches`, `invoices`, `invoice_items`, `historical_loyalty_points`.

### 2.3. Phụ thuộc (Dependencies): Hoàn thành Gate 1.

### 2.4. Test Thực Thi (Runtime Tests)
- `test/runtime/02_schema_ddl.test.sql`:
  * Đếm chính xác: 34 bảng `app`, 4 bảng `staging`, 1 bảng `audit` (Tổng: 39 bảng).
  * Kiểm tra không có bất kỳ ràng buộc `CASCADE` nào trên quan hệ lâm sàng/khách hàng.
  * Thử chèn 2 khách hàng khác nhau cùng 1 số điện thoại -> Bắt buộc thành công (P1-E Invariant).
  * Thử xóa một nhân viên đang có thiết bị -> Bị chặn bởi `RESTRICT` (P1-C Invariant).

### 2.5. Cổng Nghiệm Thu Giai Đoạn 2 (Acceptance Gate 2)
- [ ] Đủ 39 bảng được tạo thành công trên local PostgreSQL.
- [ ] Xác nhận 0 ràng buộc `CASCADE` trên dữ liệu y khoa.
- [ ] 02_schema_ddl test thực thi và đạt `RUNTIME PASS`.

### 2.6. Rủi ro & Kế hoạch Rollback
- *Rủi ro:* Lỗi thứ tự phụ thuộc khóa ngoại.
- *Rollback:* Sử dụng transaction ddl có kiểm soát hoặc `supabase db reset` trên test sandbox.

### 2.7. Chi Phí Dự Kiến: **\$0.00**.

---

## 3. Giai Đoạn 3: Auth, RBAC, RLS / RPC & Audit Logging

### 3.1. Phạm vi (Scope)
- Tích hợp Supabase Auth với bảng `app.users` thông qua trigger `on_auth_user_created` và hàm `app.rpc_ensure_app_user()`.
- Thiết lập ma trận phân quyền RBAC 39 dòng trong CSDL: Bác sĩ, Thu ngân, Spa, Tiếp tân, Admin.
- Kích hoạt RLS (Row Level Security) trên toàn bộ các bảng; xây dựng các wrapper RPCs `SECURITY DEFINER` an toàn tại schema `public`.
- Thiết lập Trigger ghi nhật ký kiểm toán bất biến `audit.audit_logs`.

### 3.2. Migration & Code Cần Viết
- `supabase/migrations/20261106000007_auth_users_linkage.sql`:
  * Hàm `app.rpc_ensure_app_user()`: 0 tham số client, lấy `auth.uid()` từ context.
- `supabase/migrations/20261106000008_rbac_helper_functions.sql`:
  * Hàm `app.check_active_shift(user_id, required_role)`.
- `supabase/migrations/20261106000009_rls_policies.sql`: RLS trên 39 bảng theo Ma trận Section VI.4.
- `supabase/migrations/20261106000010_audit_triggers.sql`: Function `app.fn_log_audit_event()`.

### 3.3. Phụ thuộc (Dependencies): Hoàn thành Gate 2.

### 3.4. Test Thực Thi (Runtime Tests)
- `test/runtime/03_auth_rbac_audit.test.ts`:
  * **SEC-01:** Thử truyền ID tùy ý vào `rpc_ensure_app_user()` -> Xác nhận không thể IDOR.
  * **SEC-02:** User role Tiếp tân gọi RPC Admin -> Nhận HTTP 403 `ROLE_UNAUTHORIZED`.
  * **SEC-03:** Gọi `SELECT * FROM app.staff_device_sessions` bằng tài khoản thường -> Bị chặn bởi RLS.
  * **SEC-04:** Chỉnh sửa hóa đơn -> Kiểm tra dòng log xuất hiện trong `audit.audit_logs`.

### 3.5. Cổng Nghiệm Thu Giai Đoạn 3 (Acceptance Gate 3)
- [ ] JWT role không thể vượt qua `check_active_shift`.
- [ ] Toàn bộ RPCs có `SET search_path = ''` chống search-path hijacking.
- [ ] 03_auth_rbac_audit test thực thi và đạt `RUNTIME PASS`.

### 3.6. Rủi ro & Kế hoạch Rollback
- *Rủi ro:* RLS policy gây đệ quy vô hạn.
- *Rollback:* Tách helper kiểm tra quyền thành hàm `SECURITY DEFINER` riêng biệt.

### 3.7. Chi Phí Dự Kiến: **\$0.00**.

---

## 4. Giai Đoạn 4: Khách Hàng, Thú Cưng, Đặt Lịch & Lazy Creation

### 4.1. Phạm vi (Scope)
- Thực thi triệt để 10 quy tắc **Lazy Customer Profile Creation** (D-19): Đăng ký OAuth chỉ tạo `app.users`, không tạo `app.customers`.
- RPC quản lý hồ sơ thú cưng `app.rpc_register_customer_pet`.
- RPC đặt lịch hẹn `app.rpc_create_customer_appointment`: Đồng bộ 4 loại `('medical', 'spa', 'vaccine', 'recheck')` và rate limit tối đa 3 lịch chưa hoàn tất / SĐT (POL-BOOKING).
- Quy trình yêu cầu liên kết hồ sơ lịch sử `app.user_link_requests` (D-LINK).

### 4.2. Migration & Code Cần Viết
- `supabase/migrations/20261106000011_customer_pet_rpcs.sql`: RPCs đặt lịch và thú cưng.
- `supabase/migrations/20261106000012_rate_limiter_booking.sql`: Logic kiểm soát tối đa 3 lịch hẹn chưa hoàn tất.

### 4.3. Phụ thuộc (Dependencies): Hoàn thành Gate 3.

### 4.4. Test Thực Thi (Runtime Tests)
- `test/runtime/04_customer_booking.test.ts`:
  * **SEC-05:** Khách hàng đăng ký OAuth mới -> `app.customers` không tăng bản ghi rác.
  * **SEC-06:** Khách hàng A truy vấn thú cưng khách hàng B -> Bị RLS chặn.
  * **SEC-07:** Khách hàng đặt lịch hẹn loại không hợp lệ -> Bị chặn bởi CHECK constraint.
  * **SEC-08:** Khách hàng đặt lịch hẹn thứ 4 liên tiếp -> Bị chặn `RATE_LIMIT_EXCEEDED`.

### 4.5. Cổng Nghiệm Thu Giai Đoạn 4 (Acceptance Gate 4)
- [ ] Lazy Creation hoạt động chính xác theo 10 quy tắc D-19.
- [ ] Khách hàng nhiều hồ sơ cùng SĐT không bị đè dữ liệu.
- [ ] 04_customer_booking test thực thi và đạt `RUNTIME PASS`.

### 4.6. Rủi ro & Kế hoạch Rollback
- *Rủi ro:* Trùng lịch hẹn bác sĩ.
- *Rollback:* Thêm chỉ mục loại trừ `EXCLUDE USING GIST` trên khoảng thời gian hẹn.

### 4.7. Chi Phí Dự Kiến: **\$0.00**.

---

## 5. Giai Đoạn 5: Bệnh Án, Y Lệnh & Dữ Liệu Nội Trú

### 5.1. Phạm vi (Scope)
- Khởi tạo bệnh án lâm sàng `app.clinical_records` và quản lý chu kỳ sống (D-12):
  * Khóa bệnh án sau 24 giờ (`PROPOSED CLINICAL RULE`) và cơ chế Addendum qua `app.clinical_amendments`.
- Y lệnh điều trị `app.treatment_orders`, sinh hiệu `app.vital_signs`, đơn thuốc `app.prescriptions`.
- Quản lý ca lưu viện `app.inpatient_admissions` và bản tin y khoa hàng ngày `app.inpatient_bulletins`.
- Áp dụng nguyên tắc che giấu y khoa nhạy cảm: Khách hàng chỉ xem bản tin đã phát hành (`published`), tuyệt đối không xem thuốc, liều lượng, hay y lệnh nội bộ.

### 5.2. Migration & Code Cần Viết
- `supabase/migrations/20261106000013_clinical_inpatient_rpcs.sql`: RPCs tạo bệnh án, khóa bệnh án, tạo bản tin.
- `supabase/migrations/20261106000014_clinical_privacy_views.sql`: Wrapper an toàn cấp dữ liệu cho portal khách hàng.

### 5.3. Phụ thuộc (Dependencies): Hoàn thành Gate 4.

### 5.4. Test Thực Thi (Runtime Tests)
- `test/runtime/05_clinical_inpatient.test.ts`:
  * **SEC-10:** Khách hàng query bệnh án -> Hoàn toàn không nhận được trường thuốc/y lệnh.
  * **SEC-11:** Sửa đổi bệnh án đã khóa -> Bị trigger chặn `RECORD_LOCKED_AMENDMENT_REQUIRED`.
  * **SEC-12:** Khách hàng truy cập bản tin `draft` -> Bị RLS lọc bỏ.

### 5.5. Cổng Nghiệm Thu Giai Đoạn 5 (Acceptance Gate 5)
- [ ] Không có bất kỳ rò rỉ thuốc/y lệnh nội bộ nào sang API của khách hàng.
- [ ] Bệnh án khóa đúng quy trình và ghi vết sửa đổi minh bạch.
- [ ] 05_clinical_inpatient test thực thi và đạt `RUNTIME PASS`.

### 5.6. Rủi ro & Kế hoạch Rollback
- *Rủi ro:* Y lệnh khẩn cấp bị nghẽn khi ca trực gián đoạn.
- *Rollback:* Thiết lập chế độ Emergency Override có ghi log audit đặc biệt.

### 5.7. Chi Phí Dự Kiến: **\$0.00**.

---

## 6. Giai Đoạn 6: Bán Hàng, Hóa Đơn & Quản Trị Tồn Kho

### 6.1. Phạm vi (Scope)
- Quản lý danh mục hàng hóa, dịch vụ (`products`, `services`).
- Quản trị tồn kho theo lô `app.inventory_batches`:
  * Xử lý hàng thiếu HSD theo D-15: gán `expiry_status = 'unknown'`, trạng thái `quarantined`, cấm xuất bán.
  * Cấp mã lô nội bộ tự động dạng `'UNKNOWN-' || job_id || '-' || row_number`.
- Quản lý hóa đơn `app.invoices` và dòng hóa đơn `app.invoice_items`:
  * Trigger bảo vệ quyền riêng tư `trg_enforce_invoice_item_privacy` (V-5): Tự động gán `is_clinical_hidden = TRUE` cho mọi dòng tự do không có `product_id` hoặc `service_id`.
  * Chặn thao tác UPDATE gỡ cờ ẩn dòng tự do trái phép.
- Quản lý điểm tích lũy lịch sử `app.historical_loyalty_points` (có cờ xóa mềm `is_deleted` và `rollback_job_id`).

### 6.2. Migration & Code Cần Viết
- `supabase/migrations/20261106000015_inventory_batch_management.sql`: Trigger kiểm tra HSD trước khi xuất kho.
- `supabase/migrations/20261106000016_invoice_item_privacy_triggers.sql`: Trigger `trg_enforce_invoice_item_privacy`.
- `supabase/migrations/20261106000017_billing_rpcs.sql`: RPCs thanh toán và tạo dòng hóa đơn.

### 6.3. Phụ thuộc (Dependencies): Hoàn thành Gate 4 và Gate 5.

### 6.4. Test Thực Thi (Runtime Tests)
- `test/runtime/06_inventory_billing.test.ts`:
  * **SEC-14:** Xuất kho lô hàng `is_quarantined = TRUE` -> Bị chặn `BATCH_QUARANTINED`.
  * **SEC-15:** Thêm dòng hóa đơn tự do -> Tự động nhận `is_clinical_hidden = TRUE`.
  * **SEC-16:** UPDATE sửa `is_clinical_hidden = FALSE` trên dòng tự do -> Bị trigger chặn `CANNOT_UNHIDE_FREE_TEXT_ITEM`.

### 6.5. Cổng Nghiệm Thu Giai Đoạn 6 (Acceptance Gate 6)
- [ ] Hàng thiếu HSD được cô lập tuyệt đối, không xuất kho nhầm.
- [ ] Dòng hóa đơn tự do được bảo vệ fail-safe 100%.
- [ ] 06_inventory_billing test thực thi và đạt `RUNTIME PASS`.

### 6.6. Rủi ro & Kế hoạch Rollback
- *Rủi ro:* Race condition khi trừ tồn kho đồng thời.
- *Rollback:* Áp dụng khóa bi quan `SELECT ... FOR UPDATE` trên dòng lô hàng.

### 6.7. Chi Phí Dự Kiến: **\$0.00**.

---

## 7. Giai Đoạn 7: Trung Tâm Nhập Liệu Excel (Import Center), Staging & Rollback

### 7.1. Phạm vi (Scope)
- Xây dựng luồng xử lý tệp Excel generic tại schema `staging.*` qua 5 bước: `upload` $\rightarrow$ `parse` $\rightarrow$ `dry_run` $\rightarrow$ `awaiting_approval` $\rightarrow$ `commit`.
- Thực thi nghiêm ngặt nguyên tắc **Two-Man Rule (D-07)** trong RPC `app.rpc_import_approve_job`: Chặn người tạo job tự duyệt (`approved_by <> created_by`), yêu cầu Admin AAL2.
- Hàm Rollback an toàn `app.rpc_import_rollback_job`:
  * Khóa `FOR UPDATE` trên `staging.import_jobs` chống race condition.
  * Kiểm tra dữ liệu phát sinh của khách hàng (`app.validate_job_rollback`), cấm xóa mềm khách nếu đã phát sinh giao dịch mới.
  * Xóa mềm toàn diện dữ liệu thuộc job, bao gồm cả `historical_loyalty_points`.

### 7.2. Migration & Code Cần Viết
- `supabase/migrations/20261106000018_import_center_rpcs.sql`: RPCs parse, dry-run, approve, commit, rollback.

### 7.3. Phụ thuộc (Dependencies): Hoàn thành Gate 2 và Gate 6.

### 7.4. Test Thực Thi (Runtime Tests)
- `test/runtime/07_import_center_rollback.test.ts`:
  * **IMP-01:** Admin tạo job tự gọi approve -> Nhận lỗi `TWO_MAN_RULE_VIOLATION`.
  * **IMP-02:** User không có role admin hoặc ca trực hết hạn -> Bị từ chối HTTP 403.
  * **IMP-03:** Gọi approve trên job khác trạng thái `awaiting_approval` -> Bị chặn `INVALID_JOB_STATUS`.
  * **IMP-04:** Chạy Rollback trên job đã commit -> Toàn bộ dữ liệu của job chuyển `is_deleted = TRUE` (kể cả điểm lịch sử).
  * **IMP-05:** Khách hàng thuộc job đã có hóa đơn mới -> Rollback bị chặn an toàn.

### 7.5. Cổng Nghiệm Thu Giai Đoạn 7 (Acceptance Gate 7)
- [ ] Two-Man Rule thực thi 100% bằng kiểm tra CSDL runtime.
- [ ] Rollback hoạt động nhất quán, bảo toàn tính toàn vẹn dữ liệu.
- [ ] 07_import_center_rollback test thực thi và đạt `RUNTIME PASS`.

### 7.6. Rủi ro & Kế hoạch Rollback
- *Rủi ro:* Tệp Excel lớn gây timeout kết nối.
- *Rollback:* Chia nhỏ tệp thành các batch 500 dòng trong quá trình parse tại Worker Container (D-14).

### 7.7. Chi Phí Dự Kiến: **\$0.00**.

---

## 8. Giai Đoạn 8: Quản Trị Media, Thiết Bị BYOD & Bảo Mật Quyền Riêng Tư

### 8.1. Phạm vi (Scope)
- Triển khai mô hình bảo mật BYOD 4 Tầng (D-20):
  * Tầng 1: PWA capture trong bộ nhớ RAM qua `getUserMedia()`, giảm thiểu ghi vào Camera Roll.
  * Tầng 2: Worker khử sạch metadata EXIF/GPS bằng Sharp (mặc định không gọi `withMetadata()`) và FFmpeg bitexact.
  * Tầng 3: Bảng `app.staff_device_sessions` với `is_trusted DEFAULT FALSE`. Bốn RPCs quản lý vòng đời thiết bị: `rpc_register_staff_device`, `rpc_approve_staff_device`, `rpc_revoke_staff_device` (Admin AAL2), `rpc_verify_staff_device`.
  * Tầng 4: Xử lý lỗi `403 DEVICE_REVOKED`, zeroize cache cục bộ, server-side thu hồi Supabase Auth Refresh Tokens.
- Quản lý vòng đời Media lưu viện:
  * Signed URL thời hạn sống 15 phút.
  * Kiểm tra chặt chẽ media gắn với bản tin y khoa đã phát hành (`published`) của đúng thú cưng.
  * Script tự động xóa media lưu viện sau 60 ngày theo D-10.

### 8.2. Migration & Code Cần Viết
- `supabase/migrations/20261106000019_byod_device_sessions_rpcs.sql`: 4 RPCs quản lý thiết bị BYOD.
- `supabase/migrations/20261106000020_media_storage_policies.sql`: Storage RLS policies và Signed URL 15 phút.

### 8.3. Phụ thuộc (Dependencies): Hoàn thành Gate 3 và Gate 5.

### 8.4. Test Thực Thi (Runtime Tests)
- `test/runtime/08_byod_media.test.ts`:
  * **SEC-18:** Thiết bị chưa duyệt (`is_trusted = FALSE`) upload ảnh -> Nhận HTTP 403 `DEVICE_NOT_TRUSTED`.
  * **SEC-19:** Thiết bị bị thu hồi phiên -> Nhận HTTP 403 `DEVICE_REVOKED`.
  * **SEC-20:** File ảnh upload chứa EXIF GPS -> Sau khi qua worker xử lý, xác nhận 100% tags GPS bị loại bỏ.
  * **SEC-21:** Truy cập Signed URL sau 15 phút -> Trả về HTTP 403 Expired.
  * **SEC-22:** Video lưu viện quá 60 ngày -> Tự động bị dọn dẹp khỏi storage bucket.

### 8.5. Cổng Nghiệm Thu Giai Đoạn 8 (Acceptance Gate 8)
- [ ] Thiết bị chưa duyệt hoặc bị thu hồi không thể upload media.
- [ ] Ảnh/video phục vụ lưu viện hoàn toàn sạch vị trí GPS.
- [ ] 08_byod_media test thực thi và đạt `RUNTIME PASS`.

### 8.6. Rủi ro & Kế hoạch Rollback
- *Rủi ro:* Trình duyệt điện thoại cũ không hỗ trợ WebRTC.
- *Rollback:* Fallback file input kèm cảnh báo người dùng xóa ảnh khỏi Camera Roll cá nhân theo quy định PDPD nội bộ.

### 8.7. Chi Phí Dự Kiến: **\$0.00**.

---

## 9. Giai Đoạn 9: Bộ Test Tự Động Toàn Diện, Kiểm Tra Tích Hợp & Báo Cáo Nghiệm Thu Phase 4B

### 9.1. Phạm vi (Scope)
- Tích hợp toàn bộ 92 kịch bản kiểm thử (60 SEC và 32 IMP) vào một bộ test runner tự động thống nhất (Vitest / pgTAP).
- Chạy toàn bộ test suite từ đầu đến cuối trên cơ sở dữ liệu sạch (Clean DB Seed).
- Đo đạc các chỉ tiêu hiệu năng theo mục tiêu thiết kế (Measurement Targets):
  * Thời gian phản hồi RPC mục tiêu: $\le 50$ms.
  * Thời gian parse tệp Excel 1.000 dòng mục tiêu: $\le 2$ giây.
  * RPO đề xuất theo bản sao lưu hàng ngày: $\le 24$ giờ.
- Lập Báo cáo Nghiệm thu Runtime Phase 4B kèm log terminal thực tế bàn giao Chủ dự án và ChatGPT điều phối.

### 9.2. Migration & Code Cần Viết
- `test/seed/synthetic_seed_data.sql`: Dữ liệu mẫu giả lập hoàn chỉnh.
- `test/run_full_regression_suite.ts`: Script điều phối chạy toàn bộ 92 ca kiểm thử.
- `docs/qa/phase4b-runtime-verification-report.md`: Báo cáo kết quả chạy thực tế.

### 9.3. Phụ thuộc (Dependencies): Hoàn thành đầy đủ các Gate từ 1 đến 8.

### 9.4. Cổng Nghiệm Thu Cuối Cùng Phase 4B (Final Acceptance Gate)
- [ ] **100% (92 / 92) ca kiểm thử thực thi và đạt trạng thái `RUNTIME PASS`**.
- [ ] Log thực thi terminal nguyên bản được lưu trữ minh bạch.
- [ ] 0 rò rỉ dữ liệu y khoa hoặc lỗi bảo mật ranh giới.
- [ ] Báo cáo nghiệm thu Phase 4B được lập và trình Chủ dự án phê duyệt.

### 9.5. Chi Phí Dự Kiến: **\$0.00** (Chạy trên môi trường local sandbox).

---

## 10. Ma Trận Toàn Diện 51 API & RPCs Backend Cốt Lõi (Comprehensive API Matrix)

Bảng kê chi tiết toàn bộ 46 RPCs nghiệp vụ + 4 RPCs BYOD + 1 hàm khởi tạo danh tính:

| STT | Tên Hàm / RPC | Schema | Chữ Ký Tham Số (Signature) | Vai Trò Cho Phép | Mức AAL | Cơ Chế Bảo Vệ (Guards) | Cấp Quyền (Grants) | Kịch Bản Test Ánh Xạ |
| :---: | :--- | :---: | :--- | :---: | :---: | :--- | :--- | :---: |
| 1 | `rpc_ensure_app_user` | `app` | `()` $\rightarrow$ `UUID` | `authenticated` | AAL1 | 0 client params; đọc `auth.uid()` từ server context | `GRANT EXECUTE TO authenticated` | **SEC-01** |
| 2 | `rpc_get_customer_profile` | `public` | `()` $\rightarrow$ `JSONB` | `customer`, `admin` | AAL1 | `auth.uid() = user_id`; Lazy Profile check | `GRANT EXECUTE TO authenticated` | **SEC-05** |
| 3 | `rpc_get_customer_pets` | `public` | `()` $\rightarrow$ `SETOF JSONB` | `customer`, `admin` | AAL1 | Lọc theo `pets.customer_id = auth.uid()` | `GRANT EXECUTE TO authenticated` | **SEC-29** |
| 4 | `rpc_register_customer_pet` | `public` | `(p_name TEXT, p_species TEXT, p_breed TEXT, p_gender TEXT, p_dob DATE)` $\rightarrow$ `UUID` | `customer`, `admin` | AAL1 | Tự động gán `customer_id` theo `auth.uid()` | `GRANT EXECUTE TO authenticated` | **SEC-29** |
| 5 | `rpc_create_customer_appointment`| `public` | `(p_pet_id UUID, p_type VARCHAR, p_time TIMESTAMPTZ, p_notes TEXT)` $\rightarrow$ `UUID` | `customer`, `admin` | AAL1 | CHECK 4 loại `('medical','spa','vaccine','recheck')`; Rate limit max 3 | `GRANT EXECUTE TO authenticated` | **SEC-08, SEC-09, V-5** |
| 6 | `rpc_cancel_customer_appointment`| `public` | `(p_appointment_id UUID, p_reason TEXT)` $\rightarrow$ `BOOLEAN` | `customer`, `admin` | AAL1 | Chỉ hủy lịch thuộc sở hữu và đang ở trạng thái `pending` | `GRANT EXECUTE TO authenticated` | **SEC-08** |
| 7 | `rpc_get_pet_medical_bulletins` | `public` | `(p_pet_id UUID)` $\rightarrow$ `SETOF JSONB` | `customer`, `admin` | AAL1 | Kiểm tra chủ nuôi; chỉ trả về bản tin `published` | `GRANT EXECUTE TO authenticated` | **SEC-10, SEC-12** |
| 8 | `rpc_request_media_signed_url` | `public` | `(p_media_id UUID)` $\rightarrow$ `TEXT` | `customer`, `staff`, `admin` | AAL1 | `authorize_media_access(p_media_id)`; TTL 15 phút | `GRANT EXECUTE TO authenticated` | **SEC-21** |
| 9 | `rpc_request_user_link` | `public` | `(p_phone VARCHAR, p_customer_name TEXT)` $\rightarrow$ `UUID` | `customer` | AAL1 | Tạo phiếu `app.user_link_requests`; chống brute-force | `GRANT EXECUTE TO authenticated` | **SEC-30, D-LINK** |
| 10 | `rpc_checkin_appointment` | `app` | `(p_appointment_id UUID)` $\rightarrow$ `BOOLEAN` | `receptionist`, `admin` | AAL1 | `check_active_shift(uid, 'receptionist')` | `GRANT EXECUTE TO authenticated` | **SEC-02** |
| 11 | `rpc_create_counter_customer` | `app` | `(p_phone VARCHAR, p_full_name TEXT, p_address TEXT)` $\rightarrow$ `UUID` | `receptionist`, `cashier`, `admin` | AAL1 | `check_active_shift`; Bất biến P1-E không bắt UNIQUE SĐT | `GRANT EXECUTE TO authenticated` | **SEC-06, P1-E** |
| 12 | `rpc_create_counter_pet` | `app` | `(p_customer_id UUID, p_name TEXT, p_species TEXT, p_breed TEXT, p_gender TEXT)` $\rightarrow$ `UUID` | `receptionist`, `veterinarian`, `admin` | AAL1 | `check_active_shift` | `GRANT EXECUTE TO authenticated` | **SEC-29** |
| 13 | `rpc_resolve_recycled_phone` | `public` | `(p_old_id UUID, p_new_id UUID, p_phone VARCHAR, p_notes TEXT)` $\rightarrow$ `BOOLEAN` | `admin` | AAL2 | `check_active_shift(uid, 'admin')` + MFA AAL2 | `GRANT EXECUTE TO authenticated` | **SEC-06, SEC-30** |
| 14 | `rpc_verify_user_link` | `app` | `(p_link_id UUID, p_approved BOOLEAN, p_notes TEXT)` $\rightarrow$ `BOOLEAN` | `admin` | AAL2 | `check_active_shift(uid, 'admin')` + MFA AAL2 (D-LINK) | `GRANT EXECUTE TO authenticated` | **SEC-30, D-LINK** |
| 15 | `rpc_create_clinical_record` | `app` | `(p_pet_id UUID, p_chief_complaint TEXT, p_diagnosis TEXT, p_notes TEXT)` $\rightarrow$ `UUID` | `veterinarian`, `admin` | AAL1 | `check_active_shift(uid, 'veterinarian')` | `GRANT EXECUTE TO authenticated` | **SEC-10** |
| 16 | `rpc_update_clinical_record` | `app` | `(p_record_id UUID, p_diagnosis TEXT, p_notes TEXT)` $\rightarrow$ `BOOLEAN` | `veterinarian`, `admin` | AAL1 | `check_active_shift`; kiểm tra `is_locked = FALSE` | `GRANT EXECUTE TO authenticated` | **SEC-11** |
| 17 | `rpc_create_treatment_order` | `app` | `(p_record_id UUID, p_type VARCHAR, p_details TEXT, p_dosage TEXT)` $\rightarrow$ `UUID` | `veterinarian`, `admin` | AAL1 | `check_active_shift` | `GRANT EXECUTE TO authenticated` | **SEC-10** |
| 18 | `rpc_checkoff_treatment_order` | `public` | `(p_order_id UUID, p_notes TEXT)` $\rightarrow$ `BOOLEAN` | `veterinarian`, `admin` | AAL1 | `check_active_shift`; kiểm tra y lệnh chưa bị khóa (S-7) | `GRANT EXECUTE TO authenticated` | **SEC-10, S-7** |
| 19 | `rpc_lock_clinical_record` | `app` | `(p_record_id UUID)` $\rightarrow$ `BOOLEAN` | `veterinarian`, `admin` | AAL1 | `check_active_shift`; gán `is_locked = TRUE` | `GRANT EXECUTE TO authenticated` | **SEC-11** |
| 20 | `rpc_create_clinical_amendment` | `app` | `(p_record_id UUID, p_notes TEXT)` $\rightarrow$ `UUID` | `veterinarian`, `admin` | AAL1 | `check_active_shift`; tạo Addendum khi hồ sơ đã khóa | `GRANT EXECUTE TO authenticated` | **SEC-27** |
| 21 | `rpc_create_inpatient_stay` | `app` | `(p_pet_id UUID, p_cage_id UUID, p_reason TEXT)` $\rightarrow$ `UUID` | `veterinarian`, `admin` | AAL1 | `check_active_shift` | `GRANT EXECUTE TO authenticated` | **SEC-12** |
| 22 | `rpc_record_inpatient_daily_log` | `app` | `(p_stay_id UUID, p_notes TEXT, p_weight NUMERIC, p_temp NUMERIC)` $\rightarrow$ `UUID` | `veterinarian`, `admin` | AAL1 | `check_active_shift` | `GRANT EXECUTE TO authenticated` | **SEC-12** |
| 23 | `rpc_create_daily_media` | `app` | `(p_stay_id UUID, p_path TEXT, p_type VARCHAR)` $\rightarrow$ `UUID` | `veterinarian`, `admin` | AAL1 | Kiểm tra thiết bị BYOD tin cậy (`is_trusted = TRUE`) | `GRANT EXECUTE TO authenticated` | **SEC-18** |
| 24 | `rpc_approve_daily_media` | `app` | `(p_media_id UUID)` $\rightarrow$ `BOOLEAN` | `veterinarian`, `admin` | AAL1 | `check_active_shift(uid, 'veterinarian')` (H1) | `GRANT EXECUTE TO authenticated` | **SEC-12, H1** |
| 25 | `rpc_revoke_daily_media` | `app` | `(p_media_id UUID, p_reason TEXT)` $\rightarrow$ `BOOLEAN` | `veterinarian`, `admin` | AAL1 | `check_active_shift`; chuyển trạng thái `revoked` | `GRANT EXECUTE TO authenticated` | **SEC-12** |
| 26 | `rpc_create_medical_bulletin` | `app` | `(p_pet_id UUID, p_stay_id UUID, p_title TEXT, p_content TEXT)` $\rightarrow$ `UUID` | `veterinarian`, `admin` | AAL1 | `check_active_shift`; trạng thái ban đầu `draft` | `GRANT EXECUTE TO authenticated` | **SEC-12** |
| 27 | `rpc_submit_bulletin_for_review`| `app` | `(p_bulletin_id UUID)` $\rightarrow$ `BOOLEAN` | `veterinarian`, `admin` | AAL1 | `check_active_shift`; chuyển `review` | `GRANT EXECUTE TO authenticated` | **SEC-12** |
| 28 | `rpc_approve_medical_bulletin` | `app` | `(p_bulletin_id UUID)` $\rightarrow$ `BOOLEAN` | `veterinarian`, `admin` | AAL1 | `check_active_shift`; chuyển `approved` | `GRANT EXECUTE TO authenticated` | **SEC-12** |
| 29 | `rpc_publish_medical_bulletin` | `app` | `(p_bulletin_id UUID)` $\rightarrow$ `BOOLEAN` | `veterinarian`, `admin` | AAL1 | `check_active_shift`; chuyển `published` (hiển thị portal) | `GRANT EXECUTE TO authenticated` | **SEC-10, SEC-12** |
| 30 | `rpc_revoke_medical_bulletin` | `app` | `(p_bulletin_id UUID, p_reason TEXT)` $\rightarrow$ `BOOLEAN` | `veterinarian`, `admin` | AAL1 | `check_active_shift`; chuyển `revoked` (ẩn khỏi portal) | `GRANT EXECUTE TO authenticated` | **SEC-12** |
| 31 | `rpc_dispatch_inventory` | `app` | `(p_batch_id UUID, p_qty INTEGER, p_reason TEXT)` $\rightarrow$ `BOOLEAN` | `cashier`, `veterinarian`, `admin` | AAL1 | Kiểm tra không bị cách ly và HSD còn hiệu lực (D-15) | `GRANT EXECUTE TO authenticated` | **SEC-14, D-15** |
| 32 | `rpc_receive_inventory_batch` | `app` | `(p_prod_id UUID, p_batch_num VARCHAR, p_expiry DATE, p_qty INT, p_cost NUMERIC)` $\rightarrow$ `UUID` | `cashier`, `admin` | AAL1 | `check_active_shift`; tự sinh mã UNKNOWN nếu thiếu số lô | `GRANT EXECUTE TO authenticated` | **SEC-14** |
| 33 | `rpc_verify_inventory_batch` | `app` | `(p_batch_id UUID)` $\rightarrow$ `BOOLEAN` | `admin` | AAL1 | `check_active_shift(uid, 'admin')` | `GRANT EXECUTE TO authenticated` | **SEC-14** |
| 34 | `rpc_quarantine_batch` | `app` | `(p_batch_id UUID, p_reason TEXT)` $\rightarrow$ `BOOLEAN` | `cashier`, `admin` | AAL1 | Gán `is_quarantined = TRUE`, khóa xuất bán | `GRANT EXECUTE TO authenticated` | **SEC-14** |
| 35 | `rpc_create_invoice` | `app` | `(p_cust_id UUID, p_appt_id UUID)` $\rightarrow$ `UUID` | `cashier`, `admin` | AAL1 | `check_active_shift(uid, 'cashier')` | `GRANT EXECUTE TO authenticated` | **SEC-28** |
| 36 | `rpc_add_invoice_item` | `app` | `(p_inv_id UUID, p_prod_id UUID, p_serv_id UUID, p_name TEXT, p_qty INT, p_price NUMERIC)` $\rightarrow$ `UUID` | `cashier`, `admin` | AAL1 | Trigger fail-safe: dòng tự do tự nhận `is_clinical_hidden = TRUE` | `GRANT EXECUTE TO authenticated` | **SEC-15, SEC-16, V-5** |
| 37 | `rpc_toggle_invoice_item_visibility`| `public` | `(p_item_id UUID, p_is_hidden BOOLEAN, p_reason TEXT)` $\rightarrow$ `BOOLEAN` | `admin` | AAL2 | Cấm gỡ ẩn dòng tự do không có catalog; Admin AAL2 | `GRANT EXECUTE TO authenticated` | **SEC-16** |
| 38 | `rpc_process_invoice_payment` | `app` | `(p_inv_id UUID, p_method VARCHAR, p_amount NUMERIC)` $\rightarrow$ `BOOLEAN` | `cashier`, `admin` | AAL1 | `check_active_shift`; chuyển trạng thái `paid` | `GRANT EXECUTE TO authenticated` | **SEC-28** |
| 39 | `rpc_assign_invoice_customer` | `public` | `(p_inv_id UUID, p_cust_id UUID)` $\rightarrow$ `BOOLEAN` | `admin` | AAL2 | `check_active_shift(uid, 'admin')` + MFA AAL2 | `GRANT EXECUTE TO authenticated` | **SEC-28** |
| 40 | `rpc_assign_staff_shift` | `app` | `(p_user_id UUID, p_role VARCHAR, p_start TIMESTAMPTZ, p_end TIMESTAMPTZ)` $\rightarrow$ `UUID` | `admin` | AAL1 | `check_active_shift(uid, 'admin')` | `GRANT EXECUTE TO authenticated` | **SEC-02** |
| 41 | `check_active_shift` | `app` | `(p_user_id UUID, p_role VARCHAR)` $\rightarrow$ `BOOLEAN` | Internal | N/A | Hàm bảo vệ nội bộ, gọi từ các RPC guards | `REVOKE ALL FROM PUBLIC, anon` | **SEC-02** |
| 42 | `rpc_import_parse_file` | `app` | `(p_file_path TEXT, p_source VARCHAR)` $\rightarrow$ `UUID` | `admin` | AAL1 | Thực thi trên Worker Container cách ly (D-14) | `GRANT EXECUTE TO authenticated` | **IMP-01** |
| 43 | `rpc_import_execute_dry_run` | `app` | `(p_job_id UUID)` $\rightarrow$ `JSONB` | `admin` | AAL1 | Kiểm tra dữ liệu staging, gán `awaiting_approval` | `GRANT EXECUTE TO authenticated` | **IMP-10** |
| 44 | `rpc_import_approve_job` | `app` | `(p_job_id UUID)` $\rightarrow$ `BOOLEAN` | `admin` | AAL2 | **Two-Man Rule (`approved_by <> created_by`)**, Admin AAL2, status `awaiting_approval` | `GRANT EXECUTE TO authenticated` | **IMP-01, IMP-02, IMP-03, V-1** |
| 45 | `rpc_import_commit_job` | `app` | `(p_job_id UUID)` $\rightarrow$ `BOOLEAN` | `admin` | AAL2 | Chuyển dữ liệu staging sang `app.*`, cập nhật trạng thái `completed` | `GRANT EXECUTE TO authenticated` | **IMP-04** |
| 46 | `rpc_import_rollback_job` | `app` | `(p_job_id UUID)` $\rightarrow$ `BOOLEAN` | `admin` | AAL2 | `validate_job_rollback`; khóa `FOR UPDATE`; rollback mềm cả `historical_loyalty_points` | `GRANT EXECUTE TO authenticated` | **IMP-04, IMP-05, IMP-06, V-2** |
| 47 | `rpc_resolve_ambiguous_customer`| `app` | `(p_staging_id UUID, p_action VARCHAR, p_target_id UUID)` $\rightarrow$ `BOOLEAN` | `admin` | AAL2 | Đối soát bản ghi khách hàng trùng lặp / mơ hồ | `GRANT EXECUTE TO authenticated` | **IMP-11** |
| 48 | `rpc_register_staff_device` | `app` | `(p_fingerprint VARCHAR, p_name TEXT)` $\rightarrow$ `UUID` | `staff`, `admin` | AAL1 | Mặc định gán `is_trusted = FALSE` | `GRANT EXECUTE TO authenticated` | **SEC-18, BYO-2** |
| 49 | `rpc_approve_staff_device` | `app` | `(p_device_id UUID)` $\rightarrow$ `BOOLEAN` | `admin` | AAL2 | Admin AAL2 duyệt thiết bị (`is_trusted = TRUE`) | `GRANT EXECUTE TO authenticated` | **SEC-18, SEC-19, BYO-2** |
| 50 | `rpc_revoke_staff_device` | `app` | `(p_device_id UUID, p_reason TEXT)` $\rightarrow$ `BOOLEAN` | `admin` | AAL2 | Admin AAL2 thu hồi thiết bị, gán `revoked_at` | `GRANT EXECUTE TO authenticated` | **SEC-19, SEC-20, V-1** |
| 51 | `rpc_verify_staff_device` | `app` | `(p_device_id UUID, p_token_hash VARCHAR)` $\rightarrow$ `BOOLEAN` | Internal | N/A | Hàm bảo vệ upload media; kiểm tra phiên hợp lệ và trusted | `REVOKE ALL FROM PUBLIC, anon` | **SEC-18, SEC-20, BYO-2** |

---

## 11. Bảng Tổng Hợp Chi Phí Kỹ Thuật Phase 4B

| Hạng Mục Kỹ Thuật | Môi Trường Thực Thi | Chi Phí Dự Kiến | Ghi Chú Kỷ Luật |
| :--- | :---: | :---: | :--- |
| Khởi tạo CSDL & Migration (1 đến 8) | Local Docker Sandbox | **\$0.00** | Chạy trên máy dev nội bộ |
| Bộ Dữ Liệu Kiểm Thử (Seed Mock Data)| Local Docker Sandbox | **\$0.00** | Dữ liệu nhân tạo 100%, không dùng data thật |
| Chạy Toàn Bộ 92 Bài Test Runtime | Local Docker Sandbox | **\$0.00** | Vitest / pgTAP runner |
| Worker Container Xử Lý File (D-14) | Local Docker Sandbox | **\$0.00** | Không thuê VPS cloud |
| Thử Nghiệm Cloudflare Pages (D-17) | Cloudflare Free Tier | **\$0.00** | Chưa trỏ domain thật, chưa mua gói |
| **TỔNG CHI PHÍ PHASE 4B SANDBOX** | **Nội Bộ / Local** | **\$0.00** | **TUYỆT ĐỐI KHÔNG PHÁT SINH CHI PHÍ NGÂN SÁCH** |
