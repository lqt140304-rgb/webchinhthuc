# BÁO CÁO NGHIỆM THU PHASE 4B — GIAI ĐOẠN 7 (ACCEPTANCE GATE 7)
## TRUNG TÂM NHẬP LIỆU EXCEL (IMPORT CENTER), STAGING & ROLLBACK AN TOÀN

**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Nhánh thực hiện:** `feat/phase-4b-supabase-foundation`  
**Căn cứ pháp lý & kỹ thuật:**
- Kế hoạch triển khai Phase 4B ([`PHASE4B_IMPLEMENTATION_PLAN.md`](file:///d:/webbvct/docs/architecture/PHASE4B_IMPLEMENTATION_PLAN.md) Mục 7 - Gate 7)
- Thiết kế kiến trúc Phase 4A v1.6.9 Baseline (Section III.3, VII, VIII, XII.2)
- Các Invariants: **D-07 & SEC-42** (Two-Man Rule trên phê duyệt job nhập liệu), **IMP-01..IMP-10** (Vòng đời Staging & Rollback an toàn), **Pessimistic Locking** (`SELECT ... FOR UPDATE`), **V-2** (Hoàn tác điểm tích lũy lịch sử), **IMP-05** (`validate_job_rollback`), **IMP-08** (Tự sinh mã lô), **IMP-09 / D-15** (Cách ly hàng thiếu HSD khi nhập).  
**Trạng thái Cổng 7 (Gate 7):** **`10/10 RUNTIME PASS (100%)`**  
**Tổng kiểm thử hồi quy toàn diện (Gates 1–7):** **`65/65 RUNTIME PASS | 0 FAIL | 0 SKIP`**  
**Chi phí thực thi:** **$0.00** *(Local Docker Sandbox, không deploy Cloud, không merge main)*  
**Ngày thực hiện:** 08/11/2026  

---

## PHẦN I: KIẾN TRÚC TRUNG TÂM NHẬP LIỆU (IMPORT CENTER) & CƠ CHẾ AN TOÀN

### 1. Quy Trình 5 Bước Nghiêm Ngặt
Hệ thống xử lý tệp Excel qua schema cách ly [`staging.*`](file:///d:/webbvct/supabase/migrations/20261106000003_ddl_staging_schema.sql) theo chu trình bảo mật khép kín:
$$\text{Upload (Tải lên)} \longrightarrow \text{Parse (Tách dòng)} \longrightarrow \text{Dry-Run (Kiểm tra ảo)} \longrightarrow \text{Awaiting Approval (Chờ duyệt)} \longrightarrow \text{Commit (Cam kết)}$$

### 2. Nguyên Tắc Phê Duyệt Kép Two-Man Rule (D-07, SEC-42, IMP-01)
- **Ràng buộc cứng tại CSDL:** Bảng `staging.import_jobs` cài đặt ràng buộc:
  ```sql
  CONSTRAINT chk_two_man_approval CHECK (approved_by IS NULL OR approved_by <> uploaded_by)
  ```
- **Ràng buộc tại tầng RPC (`app.rpc_import_approve_job`):**
  ```sql
  IF v_caller_id IS NOT NULL AND v_job.uploaded_by = v_caller_id THEN
      RAISE EXCEPTION 'TWO_MAN_RULE_VIOLATION: Người tạo job không được tự phê duyệt job của chính mình'
          USING ERRCODE = 'P0001';
  END IF;
  ```
- Quản trị viên tải tệp lên tuyệt đối không thể tự cấp quyền đưa dữ liệu vào hệ thống chính thức. Phải có Quản trị viên độc lập thứ hai có ca trực đang hoạt động xác nhận.

### 3. Cơ Chế Hoàn Tác An Toàn (Safe Rollback Guard - IMP-05)
- Hàm kiểm định độc lập [`app.validate_job_rollback(p_job_id)`](file:///d:/webbvct/supabase/migrations/20261106000018_import_center_rpcs.sql):
  Quét toàn bộ khách hàng và thú cưng thuộc job nhập liệu. Nếu bất kỳ khách hàng nào đã phát sinh giao dịch mới (hóa đơn tại quầy, lịch hẹn khám, lưu viện điều trị):
  $$\text{Lập tức chặn lệnh Rollback với lỗi } \texttt{CANNOT\_ROLLBACK\_CUSTOMER\_HAS\_TRANSACTIONS}$$
  Điều này bảo vệ tính toàn vẹn dữ liệu kế toán và lịch sử điều trị, không làm mất giao dịch thực tế của phòng khám.

### 4. Xóa Mềm Toàn Diện (Soft Rollback & Loyalty Reversal - IMP-04, IMP-06, V-2)
- Khi Rollback được chấp thuận:
  1. `app.customers`: Cập nhật `is_active = FALSE`, `is_deleted = TRUE`.
  2. `app.pets`: Cập nhật `is_deleted = TRUE`.
  3. `app.inventory_batches`: Cập nhật `is_deleted = TRUE`, `is_quarantined = TRUE` (ngăn xuất kho).
  4. `app.historical_loyalty_points`: Cập nhật `is_deleted = TRUE`, ghi vết `rollback_job_id = p_job_id`.
  5. `staging.import_jobs`: Cập nhật `is_rolled_back = TRUE`, `status = 'rolled_back'`, ghi nhận `rollback_completed_at` và `rollback_by`.
- Không sử dụng lệnh `DELETE` vật lý, bảo toàn nguyên tắc bất biến **P1-C** và lịch sử kiểm toán.

### 5. Khóa Bi Quan Chống Race Condition (Pessimistic Locking - IMP-07)
- Cả hai RPC phê duyệt (`rpc_import_approve_job`) và hoàn tác (`rpc_import_rollback_job`) đều sử dụng:
  ```sql
  SELECT * INTO v_job FROM staging.import_jobs WHERE id = p_job_id FOR UPDATE;
  ```
- Nếu hai Quản trị viên đồng thời gửi yêu cầu hoàn tác, transaction thứ hai sẽ bị khóa chờ và sau đó nhận lỗi `JOB_ALREADY_ROLLED_BACK`.

---

## PHẦN II: KẾT QUẢ KIỂM THỬ RUNTIME CỔNG 7 (10 / 10 PASS)

| Test ID | Mã Kịch Bản | Mục Tiêu & Cơ Chế Kiểm Thử | Kết Quả Thực Tế | Trạng Thái |
|:---:|:---:|---|---|:---:|
| **GATE7-T7.1** | **IMP-01 / D-07** | **Two-Man Rule Enforcement:** Admin Alice tạo job nhập liệu, tự gọi `rpc_import_approve_job` $\rightarrow$ Bị chặn cứng với `TWO_MAN_RULE_VIOLATION`. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE7-T7.2** | **IMP-02** | **Shift & Role Authorization:** Tiếp tân gọi duyệt job $\rightarrow$ Bị từ chối `ROLE_UNAUTHORIZED`. Admin Charlie ngoài ca trực gọi duyệt job $\rightarrow$ Bị từ chối `SHIFT_NOT_ACTIVE`. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE7-T7.3** | **IMP-03** | **State Machine Guard:** Không cho phép duyệt job ở trạng thái `uploaded` hoặc `validation_failed` (`INVALID_JOB_STATUS`). Admin Bob độc lập phê duyệt job ở trạng thái `awaiting_approval` thành công $\rightarrow$ Chuyển `status = 'validated'`. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE7-T7.4** | **IMP-04** | **Safe Commit & Soft Rollback:** Commit chuyển dữ liệu vào `app.customers`, `app.pets`. Rollback chuyển toàn bộ dữ liệu thuộc job sang `is_deleted = TRUE`, `is_active = FALSE`. Job chuyển `status = 'rolled_back'`. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE7-T7.5** | **IMP-05** | **Safe Rollback Guard:** Khách hàng thuộc job phát sinh hóa đơn mới tại quầy $\rightarrow$ Gọi rollback bị chặn an toàn với `CANNOT_ROLLBACK_CUSTOMER_HAS_TRANSACTIONS`. Dữ liệu khách hàng không bị xóa nhầm. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE7-T7.6** | **IMP-06 / V-2** | **Historical Loyalty Points Reversal:** Hoàn tác job nhập liệu tự động cập nhật `app.historical_loyalty_points.is_deleted = TRUE` và ghi vết `rollback_job_id = p_job_id`. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE7-T7.7** | **IMP-07** | **Pessimistic Locking & Double Rollback:** Khóa `SELECT ... FOR UPDATE` bảo vệ tiến trình. Lệnh rollback lần thứ hai trên job đã hoàn tác bị từ chối với `JOB_ALREADY_ROLLED_BACK`. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE7-T7.8** | **IMP-08** | **Auto-Generation of Batch Number:** File Excel thiếu cột số lô $\rightarrow$ Hệ thống tự động sinh mã quy chuẩn `UNKNOWN-{job_id}-{row_number}` và commit thành công vào `app.inventory_batches`. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE7-T7.9** | **IMP-09 / D-15** | **Unknown Expiry Handling & Auto-Quarantine:** File Excel thiếu ngày hết hạn $\rightarrow$ Tự động gán `expiry_date = NULL`, `expiry_status = 'unknown'`, và kích hoạt cờ cách ly `is_quarantined = TRUE`. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE7-T7.10** | **IMP-10** | **Granular Dry-Run Row Error Tracking:** Tệp kiểm thử 3 dòng (1 dòng chuẩn, 1 dòng sai định dạng SĐT, 1 dòng rỗng họ tên). Dry-run chỉ ra chính xác lỗi Dòng 2 (`INVALID_PHONE_FORMAT`) và Dòng 3 (`REQUIRED_FIELD_EMPTY`) trong `staging.import_errors`. | `DO PASSED` | **`RUNTIME PASS`** |

---

## PHẦN III: BẢNG TỔNG HỢP KIỂM THỬ HỒI QUY TOÀN DIỆN (GATES 1–7)

Tất cả các bài kiểm thử từ Cổng 1 đến Cổng 7 được chạy liên hoàn trên live PostgreSQL sandbox:

```
==================================================================================================
PHASE 4B REGRESSION RUNTIME MATRIX (GATES 1 TO 7)
==================================================================================================
Suite 01: Kiến trúc 4 Schemas & Cô lập quyền truy cập (Isolation)      5 / 5   PASS (100%)
Suite 02: Khởi tạo 40 Bảng DDL & Bất biến quan hệ (P1-C, P1-E)        10 / 10  PASS (100%)
Suite 03: Phân quyền RBAC, Bảo vệ RLS 40/40 Bảng & Audit Log          10 / 10  PASS (100%)
Suite 04: Vòng đời Khách hàng, Thú cưng & Đặt lịch khám (Booking)     10 / 10  PASS (100%)
Suite 05: Bệnh án Lâm sàng, Điều trị Nội trú & Bản tin Y khoa         10 / 10  PASS (100%)
Suite 06: Bán hàng, Hóa đơn (Khớp tiền/Ẩn thuốc) & Quản trị Tồn kho   10 / 10  PASS (100%)
Suite 07: Trung Tâm Nhập Liệu Excel, Two-Man Rule & Safe Rollback      10 / 10  PASS (100%)
==================================================================================================
TỔNG CỘNG LUỸ KẾ TOÀN BỘ HỆ THỐNG:                                    65 / 65  PASS (100%)
TỔNG SỐ CA THẤT BẠI (FAIL):                                                 0
TỔNG SỐ CA BỎ QUA (SKIP):                                                   0
==================================================================================================
```

---

## PHẦN IV: DANH MỤC CÁC QUYẾT ĐỊNH KỸ THUẬT TIẾP TỤC GIỮ TRẠNG THÁI PENDING

Tuân thủ nghiêm ngặt chỉ đạo của Ban Điều Phối và Chủ dự án:
1. **S-11 Admin Off-shift Override:** Tiếp tục giữ trạng thái **`PENDING OWNER APPROVAL`**. CSDL duy trì cơ chế Fail-Closed qua cờ `allow_admin_off_shift_override = FALSE` tại bảng `app.system_settings`.
2. **D-03 Chiến Lược Backup / PITR:** Tiếp tục giữ trạng thái **`PENDING OWNER APPROVAL`**; chưa cấu hình dịch vụ cloud có phí.
3. **D-18 Chuẩn Hóa Địa Chỉ Hành Chính:** Tiếp tục giữ trạng thái **`PENDING OWNER APPROVAL`**.
4. **POL-BOOKING DUAL (Chống Spam SĐT vs UUID):** Tiếp tục giữ trạng thái **`PENDING OWNER APPROVAL`**.

---

## PHẦN V: THÔNG TIN GIT & BÀN GIAO KỸ THUẬT

- **Branch:** `feat/phase-4b-supabase-foundation`
- **File migration mới:** [`supabase/migrations/20261106000018_import_center_rpcs.sql`](file:///d:/webbvct/supabase/migrations/20261106000018_import_center_rpcs.sql)
- **File test runtime mới:** [`test/runtime/07_import_center_rollback.test.cjs`](file:///d:/webbvct/test/runtime/07_import_center_rollback.test.cjs)
- **Tài liệu báo cáo:** [`docs/qa/PHASE4B_STAGE7_GATE7_REPORT.md`](file:///d:/webbvct/docs/qa/PHASE4B_STAGE7_GATE7_REPORT.md)
- **Chi phí phát sinh:** **$0.00**.

---

## PHẦN VI: ĐỀ XUẤT BƯỚC TIẾP THEO

Kính trình Ban Điều Phối & Quản Trị xem xét nghiệm thu Cổng 7 và cho phép Antigravity tiếp tục tiến hành **Phase 4B — Gate 8: Quản trị Media, Thiết bị BYOD & Bảo mật Quyền riêng tư (Storage RLS, Signed URL 15 phút, Khử metadata GPS EXIF/Video, Thu hồi phiên thiết bị)**.
