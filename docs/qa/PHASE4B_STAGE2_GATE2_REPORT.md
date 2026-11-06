# BÁO CÁO NGHIỆM THU PHASE 4B — GIAI ĐOẠN 2 (ACCEPTANCE GATE 2)

**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Nhánh thực hiện:** `feat/phase-4b-supabase-foundation`  
**Căn cứ pháp lý:** *Chỉ đạo Chủ dự án — Nghiệm thu Gate 1 & Khởi động Gate 2* (07/11/2026)  
**Trạng thái Cổng 2 (Gate 2):** **`100% RUNTIME PASS — HOÀN TẤT GIAI ĐOẠN 2`**  
**Chi phí phát sinh:** **$0.00** *(Local Docker Sandbox)*

---

## I. MỤC TIÊU & PHẠM VI GIAI ĐOẠN 2

Triển khai toàn bộ cấu trúc DDL của **39 bảng dữ liệu** theo đúng thiết kế kiến trúc Phase 4A v1.6.9, bảo vệ tuyệt đối các bất biến lâm sàng và thực thi kiểm thử hồi quy bảo mật:

1. Triển khai đầy đủ **39 bảng**: 34 bảng `app.*`, 4 bảng `staging.*`, 1 bảng `audit.*`.
2. Bảo vệ dữ liệu y khoa theo **Bất biến P1-C**: Triệt tiêu toàn bộ `ON DELETE CASCADE`, áp dụng `ON DELETE RESTRICT`.
3. Bảo vệ mô hình đa khách hàng theo **Bất biến P1-E (D-PHONE)**: CSDL **CẤM UNIQUE** trên `phone_number` của khách hàng.
4. Bảo vệ bảng thiết bị nhân viên (**BYO-2 & D-20**): `is_trusted` mặc định `FALSE`, khóa ngoại `RESTRICT`.
5. Hỗ trợ hoàn tác điểm tích lũy cũ (**V-2**): Bảng `app.historical_loyalty_points` trang bị cờ `is_deleted` và `rollback_job_id`.
6. Thực thi quy tắc Bốn Mắt (**D-07 Two-Man Rule**): Ràng buộc CHECK cứng ngăn người tạo tự duyệt dữ liệu import và bản tin y tế.
7. Chính sách lưu trữ media (**D-10**): Cột `auto_delete_at` mặc định 60 ngày tính từ thời điểm tải lên.
8. Kiểm thử hồi quy Gate 1 (Regression Tests): Ngăn chặn bypass PostgREST qua `Accept-Profile`/`Content-Profile`, khóa quyền `authenticated`, và kiểm tra Docker port binding.

---

## II. DANH MỤC 39 BẢNG & 5 TỆP MIGRATION ĐÃ TRIỂN KHAI

Toàn bộ 39 bảng đã được áp dụng tự động thông qua quy trình `npx supabase db reset` (Replay sạch từ cơ sở dữ liệu trắng):

| STT | Tệp Migration | Bảng Khởi Tạo | Ràng Buộc & Chính Sách Cốt Lõi |
| :---: | :--- | :--- | :--- |
| **02** | [`20261106000002_ddl_audit_schema.sql`](file:///D:/webbvct/supabase/migrations/20261106000002_ddl_audit_schema.sql) | 1. `audit.audit_logs` | Ghi log bất biến, cấm ghi từ client, chỉ cho phép `postgres` và `service_role`. |
| **03** | [`20261106000003_ddl_staging_schema.sql`](file:///D:/webbvct/supabase/migrations/20261106000003_ddl_staging_schema.sql) | 2. `staging.import_jobs`<br>3. `staging.import_rows`<br>4. `staging.import_errors`<br>5. `staging.import_mappings` | CHECK trạng thái 9 bước; **D-07 Two-Man Rule:** `CHECK (approved_by IS NULL OR approved_by <> uploaded_by)`. |
| **04** | [`20261106000004_ddl_app_core_entities.sql`](file:///D:/webbvct/supabase/migrations/20261106000004_ddl_app_core_entities.sql) | 6. `app.users`<br>7. `app.staff_role_assignments`<br>8. `app.cage_zones`<br>9. `app.shifts`<br>10. `app.shift_assignments`<br>11. `app.customers`<br>12. `app.pets`<br>13. `app.customer_user_links`<br>14. `app.user_link_requests`<br>15. `app.pet_medical_consents`<br>16. `app.appointments`<br>17. `app.medical_appointments`<br>18. `app.guest_booking_requests`<br>19. `app.staff_device_sessions` | **P1-E:** Cột `customers.phone_number` không có UNIQUE constraint hay UNIQUE index.<br>**P1-C:** Khóa ngoại `pets(customer_id)` có `ON DELETE RESTRICT`.<br>**BYO-2:** `staff_device_sessions.is_trusted` mặc định `FALSE`, `staff_id` có `RESTRICT`. |
| **05** | [`20261106000005_ddl_app_clinical_inpatient.sql`](file:///D:/webbvct/supabase/migrations/20261106000005_ddl_app_clinical_inpatient.sql) | 20. `app.clinical_records`<br>21. `app.clinical_record_vitals`<br>22. `app.clinical_diagnoses`<br>23. `app.treatment_orders`<br>24. `app.prescriptions`<br>25. `app.clinical_amendments`<br>26. `app.cages`<br>27. `app.inpatient_stays`<br>28. `app.inpatient_daily_logs`<br>29. `app.pet_medical_bulletins`<br>30. `app.inpatient_daily_media`<br>31. `app.bulletin_approval_history` | **P1-C:** 100% quan hệ y khoa lâm sàng áp dụng `ON DELETE RESTRICT`.<br>**D-12:** `treatment_orders` và `prescriptions` có `is_internal_only = TRUE`.<br>**D-07:** `pet_medical_bulletins` có `CHECK (approved_by IS NULL OR approved_by <> created_by)`.<br>**D-10:** `inpatient_daily_media.auto_delete_at` mặc định 60 ngày từ upload. |
| **06** | [`20261106000006_ddl_app_inventory_billing.sql`](file:///D:/webbvct/supabase/migrations/20261106000006_ddl_app_inventory_billing.sql) | 32. `app.products`<br>33. `app.services`<br>34. `app.inventory_batches`<br>35. `app.inventory_transactions`<br>36. `app.invoices`<br>37. `app.invoice_items`<br>38. `app.invoice_payments`<br>39. `app.historical_loyalty_points` | **V-5:** `invoice_items` hỗ trợ cờ ẩn lâm sàng `is_clinical_hidden`.<br>**V-2:** `historical_loyalty_points` có `is_deleted` và `rollback_job_id` phục vụ hoàn tác an toàn. |

---

## III. BẰNG CHỨNG KIỂM THỬ THỰC THI RUNTIME (10/10 PASS — 0 FAIL — 0 SKIP)

Đã chạy kiểm thử tự động toàn diện qua script [`test/runtime/02_schema_ddl.test.cjs`](file:///D:/webbvct/test/runtime/02_schema_ddl.test.cjs) kết nối trực tiếp CSDL PostgreSQL v17 và PostgREST container:

```
=== RUNNING RUNTIME TEST SUITE 02: 39 TABLES DDL & GATE 2 CONSTRAINTS ===
Timestamp: 2026-11-06T19:00:03.565Z
[RUNTIME PASS] GATE2-T2.1: Exact table count: 39 tables (34 app + 4 staging + 1 audit)
       Evidence: Total: 39 (app: 34, staging: 4, audit: 1)
[RUNTIME PASS] GATE2-T2.2: P1-C Invariant: Zero ON DELETE CASCADE in app and audit schemas
       Evidence: Found 0 CASCADE delete rules in app/audit (Expected: 0)
[RUNTIME PASS] GATE2-T2.3: P1-E Invariant: No UNIQUE constraint or index on customer phone; duplicate phones permitted
       Evidence: Unique constraints: 0, Unique indexes: 0, Inserted duplicates: 2
[RUNTIME PASS] GATE2-T2.4: P1-C Runtime Test: Deleting customer with active pet is strictly blocked by RESTRICT
       Evidence: Result: DO / PASSED (foreign_key_violation caught as expected)
[RUNTIME PASS] GATE2-T2.5: BYO-2: staff_device_sessions has is_trusted DEFAULT false and ON DELETE RESTRICT on staff_id
       Evidence: is_trusted default: false, staff_id delete_rule: RESTRICT
[RUNTIME PASS] GATE2-T2.6: V-2: historical_loyalty_points supports rollback (is_deleted DEFAULT false, rollback_job_id column)
       Evidence: Found columns: is_deleted:false, rollback_job_id
[RUNTIME PASS] GATE2-T2.7: D-07 Two-Man Rule: Hard CHECK constraints enforce approved_by <> created_by / uploaded_by
       Evidence: staging check: ((approved_by IS NULL) OR (approved_by <> uploaded_by)); bulletin check: ((approved_by IS NULL) OR (approved_by <> created_by))
[RUNTIME PASS] GATE2-T2.8: D-10 Policy: inpatient_daily_media auto_delete_at defaults to 60 days from upload
       Evidence: auto_delete_at default: (clock_timestamp() + '60 days'::interval)
[RUNTIME PASS] GATE2-T2.9: Gate 1 Regression: PostgREST schema bypass via Accept-Profile / Content-Profile is strictly rejected (404/406)
       Evidence: Accept-Profile status: 406, Content-Profile status: 406, Normal access: 404
[RUNTIME PASS] GATE2-T2.10: Gate 1 Regression: Authenticated role has 0 direct table privileges on app, staging, audit schemas
       Evidence: SELECT privileges - app.customers: f, app.clinical_records: f, audit.audit_logs: f, staging.import_jobs: f

=== SUITE 02 SUMMARY: 10 / 10 TESTS PASSED ===
>>> ACCEPTANCE GATE 2: 100% RUNTIME PASS! READY FOR GATE 3! <<<
```

---

## IV. BẰNG CHỨNG HỒI QUY GATE 1 (GATE 1 REGRESSION PROOF)

1. **Bảo Vệ Bằng Tiêu Đề Schema PostgREST (Profile Bypass Protection):**
   - Khi gửi HTTP request có header `Accept-Profile: app` hoặc `Content-Profile: app`, PostgREST lập tức trả về **HTTP 406 Not Acceptable** do schema `app` không nằm trong danh sách phơi bày cấu hình (`schemas = ["public", "graphql_public"]`).
   - Mọi truy vấn trực tiếp không header đến các bảng nội bộ (ví dụ `/rest/v1/customers`, `/rest/v1/clinical_records`) đều trả về **HTTP 404 Not Found**.
2. **Khóa Quyền Role `authenticated`:**
   - Đã cấu hình `auto_expose_new_tables = false` trong `supabase/config.toml`.
   - Kết quả truy vấn hàm quyền hệ thống `has_table_privilege('authenticated', table, 'SELECT')` đều trả về `f` (FALSE) trên toàn bộ các bảng trong `app`, `staging`, `audit`.
3. **Rà Soát Port Binding Docker:**
   - Các cổng được gán rõ ràng: `54321` (Kong), `54322` (PostgreSQL), `54323` (Studio), `54324` (Mailpit). Toàn bộ nằm trên stack Docker cục bộ của máy phát triển, không có kết nối ra internet bên ngoài.

---

## V. VẤN ĐỀ PHÁT SINH & HƯỚNG XỬ LÝ TRONG GIAI ĐOẠN 2

1. **Cấu hình tự động phơi bảng mới:** Mặc định của Supabase CLI có thể tự cấp quyền Data API cho bảng mới nếu không có cờ chặn. Antigravity đã bật rõ ràng cấu hình `auto_expose_new_tables = false` trong `supabase/config.toml` và áp dụng lệnh thu hồi quyền (`REVOKE ALL`) trong từng migration.
2. **Kiểm tra bypass HTTP Headers:** Đã bổ sung 2 trường hợp kiểm thử tự động sử dụng `fetch` với `Accept-Profile: app` (GET) và `Content-Profile: app` (POST) để đảm bảo PostgREST từ chối cả 2 hướng tấn công chuyển đổi schema.

---

## VI. KẾT LUẬN & ĐỀ XUẤT CHUYỂN GIAI ĐOẠN 3

Toàn bộ tiêu chí nghiệm thu của **Acceptance Gate 2** đã hoàn tất xuất sắc với **100% RUNTIME PASS (10/10 tests)**.

Antigravity đề xuất tiếp tục triển khai **Phase 4B — Giai đoạn 3: Auth, RBAC, RLS/RPC & Audit (Acceptance Gate 3)** theo đúng kế hoạch kỹ thuật đã được Chủ dự án phê duyệt.
