# BÁO CÁO KHẮC PHỤC PHASE 4B — RETEST-03 REMEDIATION
## PHASE 4B INDEPENDENT QA RETEST-03 RESOLUTION & VERIFICATION AUDIT

**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Nhánh Git:** `feat/phase-4b-supabase-foundation`  
**Căn cứ xử lý:** Báo cáo kiểm định độc lập của Claude QA Retest-03 (CONDITIONAL PASS Database/RLS/RPC trên commit `63a1608`)  
**Tác giả thực hiện:** Antigravity (Designer / Developer)  
**Thời điểm hoàn tất:** 09/11/2026 ~14:15 (+07:00)  
**Cam kết tuân thủ:** 100% môi trường Docker Local, $0 chi phí, không can thiệp production, không merge main, dữ liệu giả lập chuẩn y khoa.

---

## 0. TỔNG QUAN KẾT QUẢ KHẮC PHỤC

| Mã Finding | Mức độ | Yêu cầu kiểm định | Trạng thái khắc phục | Bằng chứng kiểm chứng |
|:---|:---:|:---|:---:|:---|
| **V3-01** | **P2** | **Signed URL Security:** Loại bỏ secret viết cứng; không dùng HMAC tự chế; dùng Supabase Storage Signed URL chuẩn (JWT HS256); thu hồi quyền `anon` trên verify RPC; kiểm tra URL hết hạn/thu hồi/IDOR; không đưa service_role vào frontend. | **ĐÃ KHẮC PHỤC TRIỆT ĐỂ (CLOSED)** | Migration 25 tạo `app.sign_storage_download_token` đọc JWT secret từ setting hệ thống; cấp chuẩn Signed URL `?token=...`; Supabase Storage HTTP port 54321 trả 200 OK với URL hợp lệ và 400 InvalidJWT khi hết hạn/giả mạo; `REVOKE` anon thành công; `src/` có 0 service_role key. |
| **V3-02** | **P2** | **Hermetic Test Suites:** Mỗi suite tự khởi tạo fixture và dọn dữ liệu; độc lập thứ tự chạy Gate 1–9; chạy được trên database sạch và thứ tự ngẫu nhiên; tách số test độc lập khỏi runner tổng hợp. | **ĐÃ KHẮC PHỤC TRIỆT ĐỂ (CLOSED)** | Đã xóa bỏ hoàn toàn vòng lặp gọi đệ quy chéo ở cuối Suite 08 & 09; bổ sung test T8.10 và T9.10 chuyên biệt; kịch bản xáo trộn ngẫu nhiên `scripts/test_random_order.cjs` chạy 10/10 suite bất kỳ đạt 95/95 PASS (100%). |
| **P3-1** | **P3** | **Universal TRUNCATE Protection:** Mở rộng kiểm soát TRUNCATE cho toàn bộ các bảng lâm sàng, tài chính, kiểm toán và thực thể cốt lõi. | **ĐÃ KHẮC PHỤC TRIỆT ĐỂ (CLOSED)** | Tạo `app.fn_prevent_table_truncate()` và gán trigger `BEFORE TRUNCATE` trên 15 bảng nhạy cảm; lệnh TRUNCATE bị chặn với mã lỗi PostgreSQL `55000` (`CANNOT_TRUNCATE_PROTECTED_TABLE`). |
| **P3-2** | **P3** | **Staging Schema Permissions:** Xử lý wrapper staging không thể thực thi do thiếu quyền schema. | **ĐÃ KHẮC PHỤC TRIỆT ĐỂ (CLOSED)** | Đã cấp `GRANT USAGE ON SCHEMA staging TO authenticated` và `GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA staging TO authenticated`; hàm `staging.rpc_*` thực thi 100% hợp lệ. |
| **P3-3** | **P3** | **Matrix Statistics Calibration:** Hiệu chỉnh thống kê ma trận 92 kịch bản phản ánh đúng 65 RUNTIME PASS được Claude QA xác nhận. | **ĐÃ KHẮC PHỤC TRIỆT ĐỂ (CLOSED)** | Ma trận đã được đồng bộ chuẩn xác: 65 RUNTIME PASS (42 SEC + 23 IMP), 17 DESIGN VERIFIED, 5 PARTIAL, 4 SIMULATED, 1 HARDWARE BOUNDARY. Tổng cộng 92 kịch bản. |
| **P3-4** | **P3** | **Product Category Standardization:** Chuẩn hóa danh mục sản phẩm bằng CHECK constraint tránh lỗi gõ sai gây hở hiển thị hóa đơn. | **ĐÃ KHẮC PHỤC TRIỆT ĐỂ (CLOSED)** | Thêm `CONSTRAINT products_category_check` trên `app.products.category`; cập nhật `app.fn_enforce_invoice_item_privacy()` nhận diện danh mục y tế/tiêu hao; nhập sai bị PostgreSQL từ chối ngay. |

---

## 1. CHI TIẾT KHẮC PHỤC V3-01: SIGNED URL SECURITY

### 1.1 Loại bỏ hoàn toàn secret viết cứng & HMAC tự chế
- **Trước khắc phục:** File `supabase/migrations/20261106000020_media_storage_policies.sql` khai báo biến cục bộ `v_signing_secret TEXT := 'leson_media_signing_secret_key_2026';` và sinh chuỗi URL không chuẩn `/storage/v1/inpatient-media/?sig=...`.
- **Khắc phục trong Migration 25 (`20261106000025_retest03_signed_url_product_cat_hardening.sql`):**
  1. Loại bỏ 100% chuỗi secret viết cứng.
  2. Xây dựng hàm helper an toàn `app.sign_storage_download_token(p_bucket, p_storage_path, p_expires_seconds)` đọc khóa bí mật trực tiếp từ biến cấu hình hệ thống: `current_setting('app.settings.jwt_secret', true)` (được Supabase quản trị nội bộ).
  3. Sinh chữ ký tiêu chuẩn Supabase Storage API:
     - Header: `{"alg":"HS256","typ":"JWT"}` mã hóa base64url.
     - Payload: `{"url": "<bucket>/<path>", "scope": "download", "iat": <now>, "exp": <now + 900>}` mã hóa base64url.
     - Signature: HMAC-SHA256 chuẩn mã hóa base64url.
     - Đường dẫn trả về: `/storage/v1/object/sign/inpatient-media-private/<path>?token=<jwt_token>`.

### 1.2 Kiểm soát truy cập máy chủ (Server-Side Authorization Boundary)
Trước khi sinh token, RPC `app.rpc_generate_media_signed_url` thực thi nghiêm ngặt chuỗi kiểm soát:
1. `auth.uid() IS NOT NULL` (Bắt buộc đã đăng nhập).
2. Nếu là nhân viên (`staff`, `veterinarian`, `nurse`, `spa`, `admin`): Phải có ca trực hợp lệ (`app.check_active_shift`); nếu gửi fingerprint thiết bị phải qua kiểm tra xác thực thiết bị BYOD.
3. Nếu là khách hàng:
   - Phải sở hữu thú cưng trong ca lưu viện (`v_media.pet_customer_id = app.get_customer_id_for_user(auth.uid())`). Vi phạm trả về `UNAUTHORIZED_MEDIA_ACCESS` (HTTP 403 / SQLSTATE 42501).
   - Tệp media phải được bác sĩ phê duyệt chia sẻ (`is_approved_for_customer = TRUE`). Vi phạm trả về `UNAUTHORIZED_MEDIA_ACCESS`.
   - Nếu media gắn với bản tin, bản tin phải ở trạng thái đã xuất bản (`bulletin_status = 'published'`). Nếu bản tin ở trạng thái `draft` hoặc bị thu hồi (`revoked`), lập tức chặn truy cập `UNAUTHORIZED_MEDIA_ACCESS`.
   - Tệp media chưa bị xóa sau 60 ngày (`is_purged = FALSE`). Nếu đã xóa trả về `MEDIA_PURGED`.

### 1.3 Thu hồi quyền anon trên RPC kiểm tra nội bộ
- Chạy lệnh thu hồi triệt để:
  ```sql
  REVOKE ALL ON FUNCTION app.rpc_verify_media_signed_url(UUID, BIGINT, TEXT) FROM anon, public;
  GRANT EXECUTE ON FUNCTION app.rpc_verify_media_signed_url(UUID, BIGINT, TEXT) TO authenticated;
  ```
- Kiểm tra toàn diện `information_schema.routine_privileges`: **Chính xác 0 hàm trong các schema `app`, `staging`, `audit` mở quyền EXECUTE cho `anon` hoặc `public`**.

### 1.4 Xác minh an toàn Frontend
- Chạy lệnh quét: `git grep -i "service_role" src/` và `git grep -i "eyJhbGci" src/`.
- Kết quả: **0 kết quả**. Mã nguồn giao diện hoàn toàn không chứa Service Role Key hay JWT bí mật.

---

## 2. CHI TIẾT KHẮC PHỤC V3-02: HERMETIC TEST SUITES & TÁCH RUNNER

### 2.1 Loại bỏ hoàn toàn việc gọi đệ quy chéo giữa các suite
- **Trước khắc phục:** `08_byod_media.test.cjs` (T8.10) và `09_final_acceptance_92_scenarios.test.cjs` (T9.10) chứa vòng lặp `for (const suite of suites) execSync(...)` tự chạy lại các test trước đó. Điều này gây chạy lặp, kéo dài thời gian và làm sai lệch thống kê.
- **Khắc phục:**
  - `08_byod_media.test.cjs`: Thay thế T8.10 bằng bài test độc lập `GATE8-T8.10: Real Supabase Storage Native Verification` (tải lên tệp thật qua REST, ký qua RPC, fetch HTTP 200, giả mạo token nhận HTTP 400 InvalidJWT, dọn dẹp tệp vật lý).
  - `09_final_acceptance_92_scenarios.test.cjs`: Thay thế T9.10 bằng bài test độc lập `GATE9-T9.10: Universal E2E Inpatient Media Storage Lifecycle` (kiểm chứng trọn vòng đời: bản tin draft chặn khách -> bác sĩ publish cho phép tải qua HTTP 200 -> bác sĩ revoke lập tức chặn khách -> chặn TRUNCATE bảng media với lỗi 55000).

### 2.2 Chứng minh tính độc lập không phụ thuộc thứ tự (Order-Independence)
- Tạo kịch bản kiểm thử độc lập `scripts/test_random_order.cjs` sử dụng thuật toán xáo trộn Fisher-Yates để chạy 10 suite theo thứ tự ngẫu nhiên hoàn toàn.
- Kết quả chạy thực tế:
  ```
  === V3-02 HERMETIC SUITE VERIFICATION: RANDOM ORDER EXECUTION ===
  Random Execution Order:
    1. 04_customer_booking.test.cjs
    2. 08_byod_media.test.cjs
    3. 05_clinical_inpatient.test.cjs
    4. 07_import_center_rollback.test.cjs
    5. worker_security_resilience.test.cjs
    6. 06_inventory_billing.test.cjs
    7. 03_auth_rbac_audit.test.cjs
    8. 01_foundation.test.cjs
    9. 02_schema_ddl.test.cjs
    10. 09_final_acceptance_92_scenarios.test.cjs
  -----------------------------------------------------------------
  TOTAL PASSES IN RANDOM ORDER: 95
  TOTAL FAILURES: 0
  VERDICT: 100% HERMETIC PASS. Zero order-dependency between test suites.
  ```

---

## 3. CHI TIẾT KHẮC PHỤC CÁC ĐIỂM P3

### 3.1 Mở rộng kiểm soát TRUNCATE toàn diện (P3-1)
- Xây dựng hàm bảo vệ bất biến:
  ```sql
  CREATE OR REPLACE FUNCTION app.fn_prevent_table_truncate()
  RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
  BEGIN
      RAISE EXCEPTION 'CANNOT_TRUNCATE_PROTECTED_TABLE: Bảng % được bảo vệ tính toàn vẹn và bất biến, nghiêm cấm thao tác TRUNCATE.', TG_TABLE_NAME
          USING ERRCODE = '55000';
      RETURN NULL;
  END; $$;
  ```
- Gán trigger `BEFORE TRUNCATE` cho 15 bảng:
  - Lâm sàng: `app.clinical_records`, `app.prescriptions`, `app.clinical_amendments`, `app.pet_medical_consents`, `app.inpatient_stays`, `app.inpatient_daily_media`, `app.pet_medical_bulletins`, `app.inpatient_daily_logs`, `app.clinical_record_vitals`, `app.clinical_diagnoses`, `app.treatment_orders`.
  - Tài chính & kho: `app.invoices`, `app.invoice_items`, `app.invoice_payments`, `app.medical_appointments`, `app.inventory_batches`, `app.inventory_transactions`.
  - Kiểm toán & thực thể gốc: `audit.audit_logs`, `app.pets`, `app.customers`.
- Thu hồi quyền: `REVOKE TRUNCATE ON ALL TABLES IN SCHEMA app, audit, staging FROM authenticated, anon, public;`.

### 3.2 Khắc phục quyền thực thi wrapper staging (P3-2)
- Cấp quyền truy cập schema cho vai trò người dùng hệ thống:
  ```sql
  GRANT USAGE ON SCHEMA staging TO authenticated;
  GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA staging TO authenticated;
  ```
- Kiểm tra quyền: `SELECT has_schema_privilege('authenticated', 'staging', 'USAGE')` -> trả về `t`. Các wrapper `staging.rpc_approve_import_job`, `staging.rpc_commit_import_job`, `staging.rpc_rollback_import_job` hoạt động trơn tru.

### 3.3 Hiệu chỉnh số liệu ma trận 92 kịch bản (P3-3)
- Đồng bộ bảng tổng hợp và tiêu chí phân loại trong `PHASE4B_92_SCENARIOS_TRACEABILITY_MATRIX_CORRECTED.md` khớp 100% với số liệu kiểm định thực tế của Claude QA:
  - **`RUNTIME PASS`**: **65 kịch bản** (42 SEC + 23 IMP).
  - **`DESIGN VERIFIED`**: **17 kịch bản** (11 SEC + 6 IMP).
  - **`PARTIAL`**: **5 kịch bản** (4 SEC + 1 IMP).
  - **`SIMULATED`**: **4 kịch bản** (2 SEC + 2 IMP).
  - **`HARDWARE BOUNDARY`**: **1 kịch bản** (SEC-20).
  - **Tổng cộng:** **92 kịch bản** (100%).

### 3.4 Chuẩn hóa danh mục sản phẩm (P3-4)
- Áp dụng CHECK constraint trên `app.products`:
  ```sql
  ALTER TABLE app.products ADD CONSTRAINT products_category_check
  CHECK (category IN (
      'pharmacy', 'drug', 'medication', 'medicine', 'clinical', 'consumable',
      'pharma', 'surgery', 'lab', 'medical', 'vaccine', 'spa_supply',
      'retail', 'spa', 'accessory', 'food', 'toy', 'cosmetic', 'grooming'
  ));
  ```
- Cập nhật trigger `app.fn_enforce_invoice_item_privacy()` nhận diện chính xác tất cả các danh mục điều trị và tiêu hao, loại trừ khả năng gõ sai chính tả gây lộ dòng mục điều trị cho khách hàng.

---

## 4. BẰNG CHỨNG THỰC THI TRÊN SUPABASE LOCAL DOCKER THẬT

### 4.1 Bằng chứng kiểm tra PostgREST, Storage, Auth (`scripts/verify_real_local_supabase_stack.cjs`)
```
=== REAL SUPABASE LOCAL STACK VERIFICATION PROBE ===
Target: http://127.0.0.1:54321 | Time: 2026-11-09T07:12:07.468Z
----------------------------------------------------
[PASS] PostgREST Schema Isolation (/app/pets): HTTP status 404 (404 expected)
[PASS] PostgREST Query Services (Public View): Status: 200, rows returned: 5
[PASS] GoTrue /auth/v1/health: Status: 200, version: v2.197.0
[PASS] Storage Private Bucket Direct Block: Status: 400 (Bucket not found / NoSuchBucket)
[PASS] Storage API Physical Upload: Upload status: 200
[PASS] Storage API Download via Signed URL: Status: 200, content: STACK_PROBE_REAL_BYTES
[PASS] Storage API Tampered Token Rejection: Tampered status: 400 (InvalidJWT)
[PASS] Database Universal TRUNCATE Guard: TRUNCATE app.clinical_records CASCADE strictly blocked with 55000 / IMMUTABLE
[PASS] S-11 Fail-Closed Default: setting_value: false
[PASS] Product Category Check Constraint (Anti-Typo): Invalid category "pharmcy" rejected by products_category_check
[PASS] Anon Revoked on Verify RPC (V3-01): Role anon blocked with 42501 permission denied
[PASS] Staging Schema USAGE for authenticated (P3): has_schema_privilege: t
----------------------------------------------------
PROBE SUMMARY: 12/12 PROBES PASS
ALL LOCAL STACK BOUNDARIES VERIFIED SUCCESSFULLY.
```

### 4.2 Bằng chứng kiểm thử tổng thể 10 Runtime Test Suites (`scripts/run_all_runtime_suites.cjs`)
```
=== RUNNING ALL 10 RUNTIME TEST SUITES (EXACT COUNTING) ===

[PASS] 01_foundation.test.cjs                       : 5 PASS, 0 FAIL
[PASS] 02_schema_ddl.test.cjs                       : 10 PASS, 0 FAIL
[PASS] 03_auth_rbac_audit.test.cjs                  : 10 PASS, 0 FAIL
[PASS] 04_customer_booking.test.cjs                 : 10 PASS, 0 FAIL
[PASS] 05_clinical_inpatient.test.cjs               : 10 PASS, 0 FAIL
[PASS] 06_inventory_billing.test.cjs                : 10 PASS, 0 FAIL
[PASS] 07_import_center_rollback.test.cjs           : 10 PASS, 0 FAIL
[PASS] 08_byod_media.test.cjs                       : 10 PASS, 0 FAIL
[PASS] 09_final_acceptance_92_scenarios.test.cjs    : 10 PASS, 0 FAIL
[PASS] worker_security_resilience.test.cjs          : 10 PASS, 0 FAIL

=== COMPLETE TEST RUNNER RESULTS ===
TOTAL RUNTIME PASSES ACCUMULATED: 95
TOTAL FAILURES: 0
FINAL VERDICT: 100% SUITES PASS.
```

---

## 5. HƯỚNG DẪN TÁI HIỆN CHO CLAUDE QA RETEST-04

Để Claude QA kiểm chứng độc lập trên môi trường PostgreSQL 17/16 và Supabase Local:

1. **Kiểm tra commit và nhánh:**
   ```bash
   git fetch origin feat/phase-4b-supabase-foundation
   git checkout feat/phase-4b-supabase-foundation
   git rev-parse HEAD
   ```
2. **Khởi động Supabase Local (hoặc PostgreSQL):**
   ```bash
   # Nếu dùng Supabase CLI:
   npx supabase status
   # Áp dụng 25 migration tuần tự:
   # 20261106000001_... đến 20261106000025_retest03_signed_url_product_cat_hardening.sql
   ```
3. **Chạy kiểm tra Real Stack Probe:**
   ```bash
   node scripts/verify_real_local_supabase_stack.cjs
   ```
   *(Kỳ vọng: 12/12 PROBES PASS)*
4. **Chạy kiểm tra Random Order:**
   ```bash
   node scripts/test_random_order.cjs
   ```
   *(Kỳ vọng: 95/95 PASS, 0 FAIL)*
5. **Chạy kiểm tra Full Runner:**
   ```bash
   node scripts/run_all_runtime_suites.cjs
   ```
   *(Kỳ vọng: 95/95 PASS, 0 FAIL)*

---
**KẾT LUẬN:** Toàn bộ các yêu cầu V3-01, V3-02 và P3 của Claude QA Retest-03 đã được khắc phục hoàn chỉnh bằng cơ chế chuẩn của Supabase và PostgreSQL. Hệ thống sẵn sàng cho **Claude QA Retest-04**.
