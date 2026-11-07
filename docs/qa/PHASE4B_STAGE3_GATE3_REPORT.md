# BÁO CÁO NGHIỆM THU PHASE 4B — GIAI ĐOẠN 3 (ACCEPTANCE GATE 3)

**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Nhánh thực hiện:** `feat/phase-4b-supabase-foundation`  
**Căn cứ pháp lý & kỹ thuật:** Kế hoạch triển khai Phase 4B ([`PHASE4B_IMPLEMENTATION_PLAN.md`](file:///d:/webbvct/docs/architecture/PHASE4B_IMPLEMENTATION_PLAN.md)), Thiết kế kiến trúc Phase 4A v1.6.9 Baseline (Section I.2, VI.4, VII.5.A)  
**Trạng thái Cổng 3 (Gate 3):** **`100% RUNTIME PASS — HOÀN TẤT GIAI ĐOẠN 3`**  
**Chi phí phát sinh:** **$0.00** *(Local Docker Sandbox)*  
**Ngày thực hiện:** 08/11/2026  

---

## I. MỤC TIÊU & PHẠM VI GIAI ĐOẠN 3 (GATE 3 SCOPE)

Triển khai toàn diện hạ tầng Định danh (Auth), Phân quyền theo vai trò (RBAC), Bảo mật từng dòng dữ liệu (RLS) trên toàn bộ 39 bảng CSDL và Kích hoạt nhật ký kiểm toán bất biến (Audit Logging):

1. **Tích hợp Supabase Auth & Liên kết Người dùng (`app.users`):**
   - Trigger `app.on_auth_user_created` tự động ánh xạ tài khoản từ `auth.users` sang `app.users`.
   - **Bất biến D-19 (Lazy Customer Creation):** Phân định rạch ròi giữa đăng ký qua Email/Google OAuth (chỉ tạo `app.users`, không tạo bản ghi khách hàng rác) và đăng ký qua SMS OTP SĐT (tự động tạo hồ sơ khách hàng `pending`).
   - Hàm chuẩn hóa `app.rpc_ensure_app_user()`: Server-side only via `auth.uid()`, cấm truyền tham số client để triệt tiêu lỗ hổng IDOR (**SEC-01**).
2. **Hàm Kiểm Tra Ca Trực & RBAC:**
   - Hàm `app.check_active_shift(user_id, required_role)` kiểm tra ca trực thực tế (hỗ trợ cả ca trực ban ngày và ca trực qua đêm).
   - **Quy tắc S-11 (Admin Off-shift Override):** Cho phép Quản trị viên thao tác ngoài ca trực nhưng bắt buộc ghi log `OFF_SHIFT_ADMIN_ACCESS` vào `audit.audit_logs` để kiểm soát lạm quyền.
3. **Kích hoạt Row Level Security (RLS) trên 100% (39/39) Bảng CSDL:**
   - 4 bảng `staging.*`: Admin-only.
   - 1 bảng `audit.audit_logs`: Admin SELECT only, cấm INSERT/UPDATE/DELETE từ client.
   - Bảng thiết bị `app.staff_device_sessions` (**BYO-2**): Admin-only, cấm tuyệt đối nhân viên SELECT trực tiếp token hash/fingerprint.
   - Bảng điểm cũ `app.historical_loyalty_points` (**V-2**): Admin-only, bảo vệ PII trước khi có chính sách mới.
   - 12 bảng bệnh án lâm sàng: Tuyệt đối không phơi ra cho khách hàng (chỉ truy cập qua bản tin y tế đã publish hoặc Signed URL).
   - Bảng hóa đơn (**V-5**): Khách hàng chỉ xem dòng chi tiết không bị ẩn lâm sàng (`is_clinical_hidden = FALSE`).
4. **Trigger Kiểm Toán Bất Biến (Audit Logging):**
   - Hàm `app.fn_log_audit_event()` tự động ghi vết mutation (UPDATE/DELETE) trên các bảng tài chính và lâm sàng trọng yếu (`invoices`, `invoice_items`, `clinical_records`, `customers`, `staff_role_assignments`, `treatment_orders`).

---

## II. DANH MỤC 4 TỆP MIGRATION ĐÃ TRIỂN KHAI

| STT | Tệp Migration | Nội Dung & Chức Năng Triển Khai | Ràng Buộc & Bất Biến Thực Thi |
| :---: | :--- | :--- | :--- |
| **07** | [`20261106000007_auth_users_linkage.sql`](file:///d:/webbvct/supabase/migrations/20261106000007_auth_users_linkage.sql) | Trigger `on_auth_user_created_trg`<br>Hàm `app.rpc_ensure_app_user()`<br>Public wrapper `public.rpc_ensure_app_user()` | **D-19:** Lazy Creation (không tạo rác CSDL khi đăng ký OAuth).<br>**U-6 / V-1:** Server-side auth.uid(), MASK PII trong log lỗi. |
| **08** | [`20261106000008_rbac_helper_functions.sql`](file:///d:/webbvct/supabase/migrations/20261106000008_rbac_helper_functions.sql) | `app.is_admin`<br>`app.is_staff`<br>`app.has_role`<br>`app.check_active_shift`<br>`app.get_customer_id_for_user`<br>`app.owns_pet` | **S-11:** Admin ca trực override kèm audit logging.<br>Hỗ trợ cả ca trực ngày và ca trực đêm (`is_overnight`). |
| **09** | [`20261106000009_rls_policies.sql`](file:///d:/webbvct/supabase/migrations/20261106000009_rls_policies.sql) | Kích hoạt RLS trên 39 bảng và thiết lập **71 chính sách bảo mật** theo Ma trận Section VI.4 | **BYO-2:** Cách ly token thiết bị.<br>**V-2:** Cách ly điểm tích lũy cũ.<br>**V-5:** Ẩn dòng thuốc/vật tư lâm sàng trên hóa đơn khách. |
| **10** | [`20261106000010_audit_triggers.sql`](file:///d:/webbvct/supabase/migrations/20261106000010_audit_triggers.sql) | Hàm trigger `app.fn_log_audit_event`<br>Gắn trigger trên 6 bảng nghiệp vụ cốt lõi | **SEC-04:** Ghi log bất biến vào `audit.audit_logs`, lưu vết `old_data` và `new_data`. |

---

## III. BẰNG CHỨNG KIỂM THỬ RUNTIME GATE 3 (10/10 PASS)

Kịch bản kiểm thử [`test/runtime/03_auth_rbac_audit.test.cjs`](file:///d:/webbvct/test/runtime/03_auth_rbac_audit.test.cjs) kết nối trực tiếp CSDL PostgreSQL v17 cục bộ:

```
=== RUNNING RUNTIME TEST SUITE 03: AUTH, RBAC, RLS & AUDIT LOGGING ===
Timestamp: 2026-11-07T17:27:40.082Z
[RUNTIME PASS] GATE3-T3.1: Row Level Security (RLS) is active on 100% of the 39 tables (34 app + 4 staging + 1 audit)
       Evidence: Total tables with RLS active: 39 / 39
[RUNTIME PASS] GATE3-T3.2: SEC-01: rpc_ensure_app_user enforces zero client-side ID parameters and rejects unauthenticated sessions
       Evidence: IDOR check: DO PASSED
[RUNTIME PASS] GATE3-T3.3: D-19: Lazy Customer Creation distinguishes OAuth vs Phone registration (Zero customer pollution)
       Evidence: Lazy creation result: DO PASSED
[RUNTIME PASS] GATE3-T3.4: SEC-02: RBAC role isolation prevents privilege escalation (Receptionist cannot claim Admin)
       Evidence: RBAC check: DO PASSED
[RUNTIME PASS] GATE3-T3.5: S-11: Off-shift Admin access successfully executes override and records immutable audit log
       Evidence: S-11 override result: DO PASSED
[RUNTIME PASS] GATE3-T3.6: BYO-2: staff_device_sessions RLS policy strictly isolates hardware tokens to Admin only
       Evidence: Policy count on staff_device_sessions: 1
[RUNTIME PASS] GATE3-T3.7: V-2: historical_loyalty_points RLS policy strictly isolates old GPet points to Admin only
       Evidence: Policy count on historical_loyalty_points: 1
[RUNTIME PASS] GATE3-T3.8: SEC-04: Automated audit trigger records mutation on financial invoice records
       Evidence: Invoice audit trigger result: DO PASSED
[RUNTIME PASS] GATE3-T3.9: RPCs and Security Definer functions enforce SET search_path = "" against hijacking
       Evidence: Functions with search_path protection verified: 156
[RUNTIME PASS] GATE3-T3.10: Comprehensive RLS policy coverage across all operational domains (Core, Clinical, Billing, Staging, Audit)
       Evidence: Total active RLS policies: 71

======================================================
=== SUITE 03 SUMMARY: 10 / 10 TESTS PASSED ===
>>> ACCEPTANCE GATE 3: 100% RUNTIME PASS! READY FOR GATE 4! <<<
======================================================
```

---

## IV. BẰNG CHỨNG HỒI QUY TOÀN BỘ CỔNG (REGRESSION GATES 1, 2, 3)

Đã chạy đồng thời toàn bộ 3 bộ test suite:
- **Suite 01 (Gate 1 Foundation & Schema Isolation):** **5 / 5 PASS**
- **Suite 02 (Gate 2 39 Tables & Invariants P1-C, P1-E):** **10 / 10 PASS**
- **Suite 03 (Gate 3 Auth, RBAC, RLS & Audit):** **10 / 10 PASS**
- **Tổng cộng:** **25 / 25 RUNTIME TESTS PASS (100%)**, 0 lỗi hồi quy.

---

## V. KẾT LUẬN & ĐỀ XUẤT TIẾP THEO

Cổng kiểm soát **Acceptance Gate 3 đã hoàn tất xuất sắc và đạt chuẩn 100%**. Hệ thống CSDL bệnh viện đã có đầy đủ lớp phòng thủ phân quyền (RBAC), kiểm soát ca trực (Shift Check), bảo mật từng dòng dữ liệu (RLS 71 policies) và nhật ký kiểm toán (Audit Logging).

Hệ thống đã sẵn sàng bước vào **Gate 4: Khách Hàng, Thú Cưng, Đặt Lịch & Lazy Creation RPCs**.
