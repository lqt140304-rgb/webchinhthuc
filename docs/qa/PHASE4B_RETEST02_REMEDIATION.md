# BÁO CÁO KHẮC PHỤC TOÀN DIỆN CLAUDE INDEPENDENT QA RETEST-02 (PHASE 4B)

**Dự án:** Bệnh viện Thú y Lê Sơn  
**Nhánh Git:** `feat/phase-4b-supabase-foundation`  
**Phiên bản CSDL:** PostgreSQL 17.11 on x86_64-pc-linux-gnu (Supabase Local Docker Stack)  
**Ngày thực hiện:** 09/11/2026  
**Đơn vị thực hiện:** Antigravity (Designer & Developer)  
**Đơn vị thẩm định độc lập:** Claude Independent QA (Chuẩn bị Retest-03)  
**Trạng thái kết quả:** 10/10 Test Suites PASS (95/95 Test Assertions Đạt 100%, 0 Thất bại, 0 Duplicates)

---

## I. TỔNG QUAN KHẮC PHỤC THEO KẾT LUẬN RETEST-02

Trong đợt Retest-02, Claude Independent QA đã xác nhận 23 migrations của Phase 4B chạy thành công trên PostgreSQL, đồng thời thông qua các probe độc lập đã chỉ ra 1 vấn đề P1 và 3 vấn đề P2 cần hoàn thiện. Antigravity đã tiếp thu toàn bộ, thiết kế và ban hành **Migration 24 (`20261106000024_retest02_privacy_mfa_audit_hardening.sql`)** cùng bộ test runtime đối chứng thực tế.

| Mã Finding | Mức độ | Vấn đề phát hiện bởi Claude QA | Giải pháp kỹ thuật Antigravity đã thực thi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **R2-01** | **P1** | **Clinical Invoice Privacy:** Client tự truyền `is_clinical_hidden`; chưa tự động suy diễn ẩn từ danh mục; thiếu test Customer View với surgery, vaccine, lab, Rx. | Xóa quyền tự quyết của client. Trigger `trg_enforce_invoice_item_privacy` tự động gán `is_clinical_hidden = TRUE` cho mọi danh mục y tế (surgery, vaccine, lab, medical), thuốc kê đơn (Rx), vật tư tiêu hao và dòng tự do. Chặn nhân viên gỡ ẩn. Test qua `public.customer_invoice_items_view` kiểm chứng 0 dòng lâm sàng bị lộ. | **ĐÃ KHẮC PHỤC** |
| **R2-02** | **P2** | **Audit Action Check Constraint:** Ghi audit `TOGGLE_VISIBILITY` và `QUARANTINE` vi phạm `audit_logs_action_check`. | Mở rộng ràng buộc `CHECK (action = ANY(...))` trên `audit.audit_logs` bao quát đầy đủ 21 action nghiệp vụ. Kiểm thử thành công cả nhánh ghi log và nhánh từ chối. | **ĐÃ KHẮC PHỤC** |
| **R2-03** | **P2** | **MFA AAL2 trên Privileged RPCs:** Thiếu kiểm tra `auth.jwt()->>'aal' = 'aal2'` trên import approve/commit/rollback và recycled phone. | Xây dựng helper `app.check_mfa_aal2()`. Tích hợp vào toàn bộ RPC đặc quyền. Test chặn đứng AAL1 (`MFA_AAL2_REQUIRED`) và chấp thuận AAL2. | **ĐÃ KHẮC PHỤC** |
| **R2-04** | **P2** | **Two-Man Rule service_role Bypass:** `rpc_import_approve_job` cho phép `service_role` duyệt khi `approved_by = NULL`. | Bỏ hoàn toàn ngoại lệ. Bắt buộc caller phải là người dùng xác thực hợp lệ (`v_caller_id IS NOT NULL`) và khác người upload (`approved_by <> uploaded_by`). Chặn đứng mọi cố gắng bypass. | **ĐÃ KHẮC PHỤC** |
| **R2-05** | **P2** | **Ma trận 92 kịch bản:** Cần đồng bộ số liệu và phân loại lại các kịch bản thực tế đã test. | Cập nhật ma trận. Triển khai runtime test cho SEC-21..24 và SEC-41..43 tại `04_customer_booking.test.cjs` (GATE4-T4.8). Tăng số lượng `RUNTIME PASS` lên 65/92. | **ĐÃ KHẮC PHỤC** |
| **R2-06** | **P2** | **Rà soát TRUNCATE:** Bổ sung trigger chặn TRUNCATE trên bảng tài chính và audit. | Cài đặt trigger `BEFORE TRUNCATE` trên `app.invoices`, `app.invoice_items` (`FINANCIAL_LEDGER_IMMUTABLE`) và `audit.audit_logs` (`AUDIT_LOG_IMMUTABLE`). | **ĐÃ KHẮC PHỤC** |
| **R2-07** | **P2** | **Đối chiếu Phase 4A vs 4B:** Thiếu bảng so sánh cụ thể giữa kiến trúc lý thuyết và hiện thực. | Xây dựng bảng đối chiếu kiến trúc chi tiết mục IV của báo cáo này. | **ĐÃ KHẮC PHỤC** |

---

## II. CHI TIẾT KỸ THUẬT CÁC HẠNG MỤC SỬA ĐỔI

### 1. R2-01 (P1): Tự Động Suy Diễn Ẩn Chi Phí Lâm Sàng (Clinical Invoice Privacy)
* **Nguyên tắc cốt lõi (V-5, S-4, R2-01):** Khách hàng trên Customer Portal **tuyệt đối không được xem** các chi tiết y lệnh, thủ thuật, phẫu thuật, xét nghiệm, thuốc điều trị nội bộ hay vật tư tiêu hao. Client không có quyền can thiệp vào cờ `is_clinical_hidden`.
* **Hiện thực tại Migration 24:**
  ```sql
  CREATE OR REPLACE FUNCTION app.fn_enforce_invoice_item_privacy()
  RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
  DECLARE
      v_is_clinical BOOLEAN := FALSE;
      v_service_cat VARCHAR(50);
      v_product_cat VARCHAR(50);
      v_is_rx BOOLEAN := FALSE;
  BEGIN
      NEW.total_price := NEW.quantity * NEW.unit_price;

      -- 1. Dòng tự do (free-text: không có product_id và không có service_id) -> Bắt buộc ẩn
      IF NEW.product_id IS NULL AND NEW.service_id IS NULL THEN
          v_is_clinical := TRUE;
      END IF;

      -- 2. Kiểm tra dịch vụ (app.services):
      -- Mọi dịch vụ y tế ('medical', 'surgery', 'vaccine', 'lab') -> Lâm sàng bắt buộc ẩn!
      -- CHỈ dịch vụ 'spa' mới được phép hiển thị công khai.
      IF NEW.service_id IS NOT NULL THEN
          SELECT category INTO v_service_cat FROM app.services WHERE id = NEW.service_id;
          IF v_service_cat IS NULL OR v_service_cat <> 'spa' THEN
              v_is_clinical := TRUE;
          END IF;
      END IF;

      -- 3. Kiểm tra sản phẩm (app.products):
      -- Thuốc kê đơn (is_prescription_drug = TRUE) HOẶC danh mục y tế/dược/vật tư
      -- ('drug', 'medication', 'medicine', 'clinical', 'consumable', 'pharma', 'surgery', 'lab', 'medical')
      -- CHỈ danh mục bán lẻ phi y tế ('retail', 'spa', 'accessory', 'food', 'toy', 'cosmetic', 'grooming') mới được công khai.
      IF NEW.product_id IS NOT NULL THEN
          SELECT is_prescription_drug, LOWER(category) INTO v_is_rx, v_product_cat
          FROM app.products WHERE id = NEW.product_id;
          IF v_is_rx = TRUE OR v_product_cat IN ('drug', 'medication', 'medicine', 'clinical', 'consumable', 'pharma', 'surgery', 'lab', 'medical') THEN
              v_is_clinical := TRUE;
          ELSIF v_product_cat NOT IN ('retail', 'spa', 'accessory', 'food', 'toy', 'cosmetic', 'grooming') THEN
              v_is_clinical := TRUE;
          END IF;
      END IF;

      -- 4. Chặn nhân viên UPDATE gỡ ẩn trên dòng lâm sàng (SEC-16)
      IF TG_OP = 'UPDATE' AND OLD.is_clinical_hidden = TRUE AND NEW.is_clinical_hidden = FALSE THEN
          IF v_is_clinical = TRUE THEN
              RAISE EXCEPTION 'CANNOT_UNHIDE_CLINICAL_ITEM: Dòng mục lâm sàng tuyệt đối không được phép hiển thị cho khách hàng.'
                  USING ERRCODE = 'P0001';
          END IF;
      END IF;

      -- 5. Ép buộc chính sách: Khách/Client không quyết định được cờ ẩn
      IF v_is_clinical = TRUE THEN
          NEW.is_clinical_hidden := TRUE;
      ELSE
          NEW.is_clinical_hidden := COALESCE(NEW.is_clinical_hidden, FALSE);
      END IF;

      RETURN NEW;
  END;
  $$;
  ```
* **Bằng chứng kiểm chứng thực tế (`06_inventory_billing.test.cjs` GATE6-T6.4):**
  - Tạo hóa đơn cho Khách hàng A gồm 8 dòng: Thuốc Rx, Truyền dịch cấp cứu (free-text), Phẫu thuật triệt sản (`surgery`), Tiêm phòng dại (`vaccine`), Xét nghiệm sinh hóa (`lab`), Khám lâm sàng (`medical`), Tắm spa (`spa`), Vòng cổ chuông (`retail`). Cả 8 dòng đều truyền `p_is_hidden = false`.
  - CSDL tự động gán `is_clinical_hidden = TRUE` cho 6 dòng lâm sàng; chỉ 2 dòng `spa` và `retail` có `is_clinical_hidden = FALSE`.
  - Khách hàng A truy vấn `public.customer_invoice_items_view`: Trả về đúng **2 dòng** (Spa + Vòng cổ); rò rỉ chi phí lâm sàng: **0 dòng (0%)**.
  - Thu ngân gọi `rpc_toggle_invoice_item_visibility` để cố tình mở hiển thị dòng phẫu thuật: Bị chặn đứng với lỗi `CLINICAL_RESTRICTION_CANNOT_REVEAL`.

---

### 2. R2-02 (P2): Mở Rộng Toàn Diện Ràng Buộc Kiểm Tra Hành Động Audit
* **Vấn đề cũ:** Constraint `audit_logs_action_check` chỉ cho phép 7 action cơ bản, dẫn đến lỗi khi RPC ghi action `TOGGLE_VISIBILITY` hoặc `QUARANTINE`.
* **Hiện thực tại Migration 24:**
  ```sql
  ALTER TABLE audit.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_action_check;
  ALTER TABLE audit.audit_logs ADD CONSTRAINT audit_logs_action_check 
      CHECK (action::text = ANY (ARRAY[
          'INSERT', 'UPDATE', 'DELETE',
          'SECURITY_VIOLATION', 'DATA_ROLLBACK', 'STORAGE_PURGE_FAILED', 'SYSTEM_ERROR',
          'QUARANTINE', 'TOGGLE_VISIBILITY',
          'DEVICE_REGISTERED', 'DEVICE_APPROVED', 'DEVICE_SESSION_REVOKED', 'DEVICE_WIPE_COMPLETED',
          'INPATIENT_MEDIA_UPLOADED', 'AUTH_TRIGGER_EXCEPTION', 'OFF_SHIFT_ADMIN_ACCESS',
          'PHYSICAL_STORAGE_OBJECT_DELETED', 'PHYSICAL_STORAGE_DELETE_FAILED',
          'RECYCLED_PHONE_RESOLVED', 'IMPORT_JOB_APPROVED', 'IMPORT_JOB_COMMITTED', 'IMPORT_JOB_ROLLED_BACK'
      ]::text[]));
  ```
* **Bằng chứng kiểm chứng (`06_inventory_billing.test.cjs` GATE6-T6.5):**
  - Thu ngân gọi `rpc_toggle_invoice_item_visibility` trên dòng bán lẻ: Ghi nhận thành công action `TOGGLE_VISIBILITY` vào `audit.audit_logs`.
  - Thủ kho gọi `rpc_quarantine_batch`: Ghi nhận thành công action `QUARANTINE` vào `audit.audit_logs`.

---

### 3. R2-03 (P2) & R2-04 (P2): Bắt Buộc MFA AAL2 & Chặn Đứng service_role Bypass Two-Man Rule
* **Xây dựng Helper Kiểm Tra AAL2:**
  ```sql
  CREATE OR REPLACE FUNCTION app.check_mfa_aal2()
  RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
  BEGIN
      IF (auth.jwt()->>'aal') IS DISTINCT FROM 'aal2' THEN
          RAISE EXCEPTION 'MFA_AAL2_REQUIRED: Thao tác đặc quyền bắt buộc phiên đăng nhập đạt cấp độ xác thực đa yếu tố AAL2 (SEC-18, R2-03).'
              USING ERRCODE = '42501';
      END IF;
      RETURN TRUE;
  END;
  $$;
  ```
* **Áp dụng bắt buộc trên các RPC đặc quyền:**
  1. `app.rpc_import_approve_job` (và alias `staging.rpc_approve_import_job`)
  2. `app.rpc_import_commit_job` (và alias `staging.rpc_commit_import_job`)
  3. `app.rpc_import_rollback_job` (và alias `staging.rpc_rollback_import_job`)
  4. `app.rpc_resolve_recycled_phone` (và alias `public.rpc_resolve_recycled_phone`)
  5. `app.rpc_approve_staff_device`
  6. `app.rpc_revoke_staff_device`
* **Loại bỏ hoàn toàn lỗ hổng Two-Man Rule service_role Bypass (R2-04):**
  ```sql
  -- Guard 1: Quyền Admin (bắt buộc caller xác định, không chấp nhận NULL kể cả service_role - R2-04)
  IF v_caller_id IS NULL OR NOT app.is_admin(v_caller_id) THEN
      RAISE EXCEPTION 'ROLE_UNAUTHORIZED: Chỉ Quản trị viên (Admin) đã xác thực mới có quyền phê duyệt tiến trình nhập liệu (R2-04)'
          USING ERRCODE = '42501';
  END IF;

  -- Guard 2: Ca trực active
  IF NOT app.check_active_shift(v_caller_id, 'admin') THEN
      RAISE EXCEPTION 'SHIFT_NOT_ACTIVE: Quản trị viên phải có ca trực hoạt động để phê duyệt nhập liệu'
          USING ERRCODE = 'P0002';
  END IF;

  -- Guard 3: Bắt buộc MFA AAL2
  PERFORM app.check_mfa_aal2();

  -- Guard 4: Two-Man Rule bất biến cứng (Người duyệt KHÁC người tải lên và cả hai phải tồn tại)
  IF v_job.uploaded_by IS NULL OR v_job.uploaded_by = v_caller_id THEN
      RAISE EXCEPTION 'TWO_MAN_RULE_VIOLATION: Người tạo job không được tự phê duyệt job của chính mình và bắt buộc hai người khác nhau (R2-04)'
          USING ERRCODE = 'P0001';
  END IF;
  ```
* **Bằng chứng kiểm chứng (`07_import_center_rollback.test.cjs` GATE7-T7.1 & GATE7-T7.2):**
  - Alice (người upload) gọi duyệt với AAL1: Bị chặn đứng với lỗi `MFA_AAL2_REQUIRED`.
  - Alice gọi duyệt với AAL2: Bị chặn đứng với lỗi `TWO_MAN_RULE_VIOLATION`.
  - `service_role` (không có context user hoặc caller = NULL) gọi duyệt: Bị chặn đứng với lỗi `ROLE_UNAUTHORIZED` / `TWO_MAN_RULE_VIOLATION` / `permission denied`. Zero bypass!
  - Admin Bob (trong ca trực + có AAL2) gọi duyệt: Phê duyệt thành công, ghi audit log `IMPORT_JOB_APPROVED`.

---

### 4. R2-06 (P2): Bảo Vệ Toàn Diện Truncate Trên Bảng Tài Chính & Audit Logs
* Cài đặt trigger `BEFORE TRUNCATE` trên `app.invoices`, `app.invoice_items` và `audit.audit_logs`:
  ```sql
  CREATE OR REPLACE FUNCTION app.fn_prevent_financial_truncate()
  RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
  BEGIN
      RAISE EXCEPTION 'FINANCIAL_LEDGER_IMMUTABLE: Thao tác TRUNCATE trên sổ cái hóa đơn/chi phí bị cấm tuyệt đối.'
          USING ERRCODE = 'P0001';
  END;
  $$;

  CREATE TRIGGER trg_prevent_invoices_truncate
  BEFORE TRUNCATE ON app.invoices FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_financial_truncate();

  CREATE TRIGGER trg_prevent_invoice_items_truncate
  BEFORE TRUNCATE ON app.invoice_items FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_financial_truncate();

  CREATE OR REPLACE FUNCTION audit.fn_prevent_audit_truncate()
  RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
  BEGIN
      RAISE EXCEPTION 'AUDIT_LOG_IMMUTABLE: Thao tác TRUNCATE trên bảng nhật ký kiểm toán bị cấm tuyệt đối.'
          USING ERRCODE = 'P0001';
  END;
  $$;

  CREATE TRIGGER trg_prevent_audit_logs_truncate
  BEFORE TRUNCATE ON audit.audit_logs FOR EACH STATEMENT EXECUTE FUNCTION audit.fn_prevent_audit_truncate();
  ```
* **Bằng chứng kiểm chứng (`06_inventory_billing.test.cjs` GATE6-T6.5):**
  - Lệnh `TRUNCATE app.invoice_items` ném exception `FINANCIAL_LEDGER_IMMUTABLE`.
  - Lệnh `TRUNCATE audit.audit_logs` ném exception `AUDIT_LOG_IMMUTABLE`.

---

### 5. Triển Khai & Kiểm Thử RPC Giải Quyết SĐT Tái Cấp (`rpc_resolve_recycled_phone`)
* Khắc phục trọn vẹn nhóm kịch bản SEC-21..24 và SEC-41..43 tại `app.rpc_resolve_recycled_phone`:
  - **SEC-21 / SEC-43:** Tiếp tân gọi -> Bị chặn với lỗi `ROLE_UNAUTHORIZED`.
  - **SEC-22:** Admin gọi với AAL1 -> Bị chặn với lỗi `MFA_AAL2_REQUIRED`.
  - **SEC-23:** Admin truyền `p_old_customer_id = p_new_customer_id` -> Bị chặn với lỗi `INVALID_ARGUMENTS`.
  - **SEC-42:** Admin truyền mã khách hàng không tồn tại -> Bị chặn với lỗi `CUSTOMER_NOT_FOUND`.
  - **SEC-24 / SEC-41:** Admin truyền user ID không có liên kết pending -> Bị chặn với lỗi `LINK_NOT_FOUND`.
  - **Hợp lệ:** Admin có ca trực + AAL2 gọi: Thu hồi toàn bộ liên kết của khách cũ (`link_status = 'unlinked'`), duyệt liên kết cho khách mới (`link_status = 'approved'`), ghi nhận audit bất biến `RECYCLED_PHONE_RESOLVED`.
* **Bằng chứng kiểm chứng (`04_customer_booking.test.cjs` GATE4-T4.8):** 100% kiểm thử runtime pass.

---

## III. BẰNG CHỨNG THỰC THI TOÀN BỘ 10 TEST SUITES (EXACT COUNTING)

Kết quả chạy thực tế qua bộ test runner tự động `scripts/run_all_runtime_suites.cjs` trên PostgreSQL 17.11 container:

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

Kiểm tra định danh và tính độc nhất qua `scripts/count_exact_tests.cjs`:
```
=== EXACT MACHINE COUNT OF RUNTIME TEST SUITES ===
Suite: 01_foundation.test.cjs                        -> 5 tests
Suite: 02_schema_ddl.test.cjs                        -> 10 tests
Suite: 03_auth_rbac_audit.test.cjs                   -> 10 tests
Suite: 04_customer_booking.test.cjs                  -> 10 tests
Suite: 05_clinical_inpatient.test.cjs                -> 10 tests
Suite: 06_inventory_billing.test.cjs                 -> 10 tests
Suite: 07_import_center_rollback.test.cjs            -> 10 tests
Suite: 08_byod_media.test.cjs                        -> 10 tests
Suite: 09_final_acceptance_92_scenarios.test.cjs     -> 10 tests
Suite: worker_security_resilience.test.cjs           -> 10 tests
--------------------------------------------------
GRAND TOTAL UNIQUE ASSERTIONS: 95

✓ All test IDs are completely unique. Zero duplicates.
```

---

## IV. BẢNG ĐỐI CHIẾU KHÁC BIỆT KIẾN TRÚC PHASE 4A VÀ PHASE 4B (R2-07)

Dưới đây là bảng đối chiếu chi tiết giữa **Đặc tả Thiết kế Phase 4A (Baseline v1.6.9)** và **Hiện thực Nền tảng Supabase Phase 4B (Sau Khắc Phục Retest-02)**:

| Trục Kiến Trúc | Đặc Tả Thiết Kế Phase 4A (v1.6.9) | Hiện Thực Thực Tế Phase 4B (Sau Retest-02) | Phân Tích Khác Biệt & Lý Do Kỹ Thuật |
| :--- | :--- | :--- | :--- |
| **Tổng số bảng CSDL** | Quy hoạch khái niệm 39 bảng (`app`: 34, `staging`: 4, `audit`: 1). | Đồng bộ hóa chính xác **40 bảng** (`app`: 35, `staging`: 4, `audit`: 1). | Bổ sung bảng `app.historical_loyalty_points` để quản lý điểm tích lũy lịch sử và hoàn tác nhập liệu (V-2), tách biệt khỏi bảng loyalty vận hành. |
| **Bất biến Bệnh án (Immutability)** | Đề xuất RLS chặn DELETE trên bệnh án. | Hardened cấp CSDL: Cài đặt trigger `trg_prevent_clinical_record_delete` chặn DELETE, cùng triggers `BEFORE TRUNCATE` trên toàn bộ bảng lâm sàng. | Ngăn chặn việc bypass RLS bởi superuser/table owner hoặc lỗi quản trị viên thực thi TRUNCATE/DELETE. |
| **Quyền Riêng Tư Hóa Đơn (V-5 / R2-01)** | Dự kiến cờ `is_clinical_hidden` cho phép nhân viên chọn hoặc gán cho thuốc/free-text. | **Auto-inferred Backend Policy:** Xóa quyền tự quyết của client. Trigger tự động phát hiện danh mục lâm sàng (`medical`, `surgery`, `vaccine`, `lab`), thuốc Rx, vật tư để ép `is_clinical_hidden = TRUE`. Chặn đứng mọi nỗ lực gỡ ẩn. | Khắc phục triệt để rủi ro nhân viên thu ngân vô tình hoặc cố ý để lộ thuốc tiêm, phác đồ điều trị cho khách hàng portal. |
| **Two-Man Rule (D-07 / R2-04)** | Quy định nguyên tắc 2 người duyệt import (`approved_by <> uploaded_by`). | Cơ chế bất biến kép: Ràng buộc CHECK `chk_two_man_approval` trong bảng `staging.import_jobs` VÀ kiểm tra trong RPC. **Cấm tuyệt đối mọi ngoại lệ `service_role`**; bắt buộc caller xác định và khác uploader. | Loại bỏ hoàn toàn vector tấn công leo quyền hoặc tự động duyệt không kiểm soát qua service role. |
| **Bảo Mật MFA (SEC-18 / R2-03)** | Nêu yêu cầu xác thực AAL2 cho các hành vi quản trị nhạy cảm. | Xây dựng helper tập trung `app.check_mfa_aal2()` và áp dụng bắt buộc cho: duyệt/commit/rollback import, thu hồi/phê duyệt thiết bị BYOD, giải quyết SĐT tái cấp. | Đảm bảo tính nhất quán của cơ chế kiểm tra đa yếu tố JWT Supabase, từ chối AAL1 với mã lỗi chuẩn `MFA_AAL2_REQUIRED`. |
| **Thanh Trừng Phương Tiện (D-10 / P1)** | Đề xuất xóa mềm sau 60 ngày (`auto_delete_at`). | Xây dựng worker thanh trừng vật lý 2 lớp: Gọi REST API Supabase Storage (`DELETE /object/inpatient-media-private`) và xóa tệp đĩa vật lý (`fs.unlinkSync`), có cơ chế retry và ghi log `STORAGE_PURGE_FAILED`. | Đảm bảo tuân thủ quyền được lãng quên và tối ưu chi phí lưu trữ đám mây thực tế. |
| **Quản Lý Thiết Bị BYOD (D-20)** | Mô hình 4 lớp bảo mật thiết bị nhân viên. | Triển khai hoàn chỉnh: Bảng `app.staff_device_sessions`, SHA-256 fingerprinting, TTL trượt 30 ngày, phê duyệt AAL2, remote revoke tức thời và cấm tải ảnh từ thiết bị chưa tin cậy (`DEVICE_NOT_TRUSTED`). | Đạt tiêu chuẩn Zero-Trust cho nhân sự y tế sử dụng thiết bị cá nhân tại bệnh viện. |
| **Bảo Vệ Sổ Cái Tài Chính & Audit (R2-06)** | RLS cấm sửa/xóa audit log. | Cài đặt trigger `BEFORE TRUNCATE` trên `app.invoices`, `app.invoice_items` và `audit.audit_logs`. | Đảm bảo tính toàn vẹn sổ cái tài chính và nhật ký pháp lý không thể bị xóa trắng bằng một câu lệnh DDL. |

---

## V. CẬP NHẬT MA TRẬN 92 KỊCH BẢN (R2-05)

Sau khi bổ sung kiểm thử runtime cho nhóm kịch bản SĐT tái cấp (SEC-21..24, SEC-41..43) tại `04_customer_booking.test.cjs` (GATE4-T4.8):

* **Tổng số kịch bản:** 92 (60 SEC + 32 IMP)
* **Kịch bản RUNTIME PASS:** **65 / 92 (70.6%)** (Tăng từ 60 lên 65)
  - SEC RUNTIME PASS: 42 / 60
  - IMP RUNTIME PASS: 23 / 32
* **Kịch bản DESIGN VERIFIED:** **17 / 92 (18.5%)** (Giảm từ 22 xuống 17)
  - SEC DESIGN VERIFIED: 11 / 60
  - IMP DESIGN VERIFIED: 6 / 32
* **Kịch bản PARTIAL (Cần tích hợp frontend/network bên ngoài):** **5 / 92 (5.4%)**
* **Kịch bản SIMULATED (Giả lập môi trường container/IO):** **4 / 92 (4.3%)**
* **Kịch bản HARDWARE BOUNDARY (Cần thiết bị phần cứng thật):** **1 / 92 (1.1%)**
* **Kịch bản FAILED:** **0 / 92 (0%)**

---

## VI. HƯỚNG DẪN TÁI HIỆN CHO CLAUDE QA RETEST-03

Toàn bộ môi trường đã được chuẩn hóa để Claude Independent QA có thể tái hiện độc lập trên bất kỳ máy trạm chạy Docker nào:

```bash
# 1. Fetch nhánh và checkout commit mới nhất
git fetch origin feat/phase-4b-supabase-foundation
git checkout feat/phase-4b-supabase-foundation

# 2. Khởi tạo / kiểm tra trạng thái CSDL (Đảm bảo 40 bảng đã sẵn sàng)
node scripts/verify_clean_db_seed.cjs

# 3. Chạy toàn bộ 10 test suites độc lập
node scripts/run_all_runtime_suites.cjs

# 4. Kiểm tra đếm số lượng assertion máy tính
node scripts/count_exact_tests.cjs

# 5. Kiểm tra thống kê ma trận kịch bản
node scripts/count_matrix.cjs
```

---

## VII. KẾT LUẬN & ĐỀ NGHỊ

1. **Khắc phục trọn vẹn 100% findings Retest-02:** Cả 1 finding P1 (R2-01) và 3 findings P2 (R2-02, R2-03, R2-04) cùng các yêu cầu R2-05..07 đều đã được giải quyết bằng mã nguồn CSDL thực tế (`20261106000024_retest02_privacy_mfa_audit_hardening.sql`) và kiểm chứng bằng test suites runtime.
2. **Cam kết ranh giới dự án:** Toàn bộ công việc thực hiện trên sandbox Docker cục bộ, không dùng dữ liệu thật, không merge main, không triển khai production, chi phí phát sinh \$0.
3. **Bàn giao:** Toàn bộ thay đổi đã được commit và sẵn sàng push lên remote `origin/feat/phase-4b-supabase-foundation` để chuyển giao cho Claude Independent QA thực hiện **Retest-03**.
