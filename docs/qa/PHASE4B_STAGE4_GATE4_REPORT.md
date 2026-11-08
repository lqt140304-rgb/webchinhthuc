# BÁO CÁO NGHIỆM THU PHASE 4B — GIAI ĐOẠN 4 (ACCEPTANCE GATE 4)
## KÈM BÁO CÁO GIẢI TRÌNH CÁC VẤN ĐỀ TỒN ĐỌNG GATE 3 THEO REVIEW CHỦ DỰ ÁN

**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Nhánh thực hiện:** `feat/phase-4b-supabase-foundation`  
**Căn cứ pháp lý & kỹ thuật:** Kế hoạch triển khai Phase 4B ([`PHASE4B_IMPLEMENTATION_PLAN.md`](file:///d:/webbvct/docs/architecture/PHASE4B_IMPLEMENTATION_PLAN.md)), Thiết kế kiến trúc Phase 4A v1.6.9 Baseline (Section VII.3, VII.4, VIII.2)  
**Trạng thái Cổng 4 (Gate 4):** **`100% RUNTIME PASS — HOÀN TẤT GIAI ĐOẠN 4`**  
**Chi phí phát sinh:** **$0.00** *(Local Docker Sandbox)*  
**Ngày thực hiện:** 08/11/2026  

---

## PHẦN I: BÁO CÁO GIẢI TRÌNH CÁC VẤN ĐỀ TỒN ĐỌNG GATE 3 THEO YÊU CẦU REVIEW

### 1. Đối chiếu Quyết định D-19 (Cơ chế Tạo Hồ Sơ Khách Hàng - Lazy Creation)
- **Vấn đề phát hiện:** Trong thiết kế sơ bộ trước đây (Mục VII.5.A), trigger `on_auth_user_created` từng phân nhánh: đăng ký bằng Email thì không tạo khách, nhưng nếu có SĐT (SMS OTP) thì tự chèn một dòng vào `app.customers`. Điều này xung đột với tinh thần **D-19 Strict Lazy Creation** được Chủ dự án chốt trong `OWNER_DECISION_REGISTER.md`: *"Đăng ký Auth chỉ tạo danh tính app.users, không tạo khách rác; chỉ tạo hồ sơ khi thực sự phát sinh giao dịch đặt lịch/khám chữa tại quầy"*.
- **Hành động khắc phục:** Đã chuẩn hóa lại trigger `app.on_auth_user_created()` tại migration `20261106000007_auth_users_linkage.sql`: **100% mọi hình thức đăng ký (Email, Google OAuth hay SMS OTP) CHỈ tạo bản ghi định danh `app.users`**. Hồ sơ `app.customers` tuyệt đối không được tạo sớm; nó chỉ được khởi tạo lười (lazy) khi người dùng thực sự gọi RPC đặt lịch hẹn (`public.rpc_create_customer_appointment`), đăng ký thú cưng (`public.rpc_register_customer_pet`) hoặc được lễ tân lập hồ sơ tại quầy.
- **Kiểm chứng runtime:** Bài test `GATE4-T4.1` (SEC-05) xác nhận chèn tài khoản có SĐT vào `auth.users` nhưng số lượng bản ghi `app.customers` tăng đúng bằng **0**.

### 2. Thẩm tra Cơ chế S-11 (Admin Off-Shift Override)
- **Nguồn gốc lịch sử:** S-11 xuất phát từ đợt review **Claude QA v1.6.4** (Finding S-11: *"Phân biệt truy cập Admin đúng ca vs trái ca: chỉ ghi nhận log cảnh báo khi Admin truy cập ngoài ca trực"*).
- **Thẩm quyền phê duyệt:** Đối chiếu [`OWNER_DECISION_REGISTER.md`](file:///d:/webbvct/docs/architecture/OWNER_DECISION_REGISTER.md), S-11 **KHÔNG NẰM TRONG 24 QUYẾT ĐỊNH CỐT LÕI ĐƯỢC CHỦ DỰ ÁN BAN HÀNH CHÍNH THỨC**. Nó thuộc danh mục **`PROPOSED TECHNICAL / CLINICAL RULES`** (Quy tắc kỹ thuật / lâm sàng đề xuất chờ thẩm định).
- **Kết luận:** Báo cáo ghi nhận rõ: Cơ chế Admin Off-shift Override là cơ chế kỹ thuật đề xuất nhằm hỗ trợ cấp cứu y khoa ban đêm có ghi vết kiểm toán, **chưa được coi là quy định pháp lý chính thức đã được Chủ dự án ký duyệt**. Trạng thái giữ nguyên là `PROPOSED RULE - PENDING FORMAL OWNER SIGNOFF`.

### 3. Bổ sung Kiểm thử RLS Thực tế Bằng Context Phiên (JWT Session)
- Đã nâng cấp `test/runtime/03_auth_rbac_audit.test.cjs` bổ sung kiểm thử phiên thực tế qua `set_config('role', 'authenticated')` và `set_config('request.jwt.claim.sub', ...)`:
  * Khách hàng A truy vấn thú cưng Khách hàng B $\rightarrow$ Nhận **0 bản ghi** (`GATE3-T3.6`).
  * Khách hàng truy vấn trực tiếp bảng `app.clinical_records` $\rightarrow$ Bị chặn hoàn toàn bởi **P1-D Invariant** (`permission denied for schema app`).
  * Khách hàng truy vấn `app.staff_device_sessions` $\rightarrow$ Bị chặn hoàn toàn bởi chính sách RLS BYO-2.

### 4. Kiểm tra Nhân sự Kiêm nhiệm, Thu hồi Role & Khóa Tài khoản
- Bài test `GATE3-T3.7` kiểm chứng:
  * Nhân viên được phân công đồng thời 2 vai trò (`veterinarian` + `receptionist`) được hệ thống nhận diện chính xác cả 2 vai trò qua `app.has_role()`.
  * Khi thu hồi vai trò (`app.staff_role_assignments.is_active = FALSE`), quyền của vai trò bị thu hồi lập tức mất hiệu lực thời gian thực.

### 5. Kiểm tra RPC, SECURITY DEFINER & Search Path
- Toàn bộ 156 hàm/RPCs trong hệ thống đều trang bị **`SET search_path = ''`** chống tấn công Search Path Hijacking (`GATE3-T3.10`).
- Schema nội bộ `app` bị **`REVOKE USAGE`** từ role `authenticated` và `anon`. Người dùng bắt buộc phải đi qua các wrapper an toàn tại schema `public` (`public.rpc_*`).

### 6. Bảo vệ Nhật Ký Kiểm Toán (Audit Log Immutability)
- Bảng `audit.audit_logs` bị thu hồi toàn bộ quyền ghi từ client (`REVOKE ALL FROM authenticated, anon`).
- Bài test `GATE3-T3.9` xác nhận người dùng xác thực cố gắng chạy lệnh `DELETE FROM audit.audit_logs` lập tức nhận lỗi **`permission denied for table audit_logs`**.

---

## PHẦN II: KẾT QUẢ NGHIỆM THU GATE 4 (KHÁCH HÀNG, THÚ CƯNG & ĐẶT LỊCH)

### 1. Phạm Vi Triển Khai
1. **RPC Đăng Ký Thú Cưng (`app.rpc_register_customer_pet`):**
   * Cho phép khách hàng đăng ký thú cưng (`pet_name`, `species`, `breed`, `gender`, `date_of_birth`).
   * Tự động tạo hồ sơ khách hàng liên kết (`app.customers`) nếu người dùng chưa có hồ sơ (D-19 Lazy Creation).
2. **RPC Đặt Lịch Hẹn Khách Hàng (`app.rpc_create_customer_appointment`):**
   * Hỗ trợ 4 loại dịch vụ chuẩn: `medical` (Khám bệnh), `spa` (Làm đẹp/tắm tỉa), `vaccine` (Tiêm phòng), `recheck` (Tái khám).
   * **Bảo vệ chống IDOR (U-3):** Kiểm tra chặt chẽ quyền sở hữu thú cưng; người dùng không thể chọn thú cưng của người khác.
   * **Bảo vệ thời gian hẹn:** Bắt buộc thời gian hẹn ở tương lai.
   * **Kiểm soát tần suất POL-BOOKING:** Tối đa 3 lịch hẹn đang chờ xử lý (`pending` hoặc `confirmed`) trên mỗi khách hàng.
3. **RPC Yêu Cầu Liên Kết Hồ Sơ Cũ (`app.rpc_request_customer_link`):**
   * Cho phép khách hàng gửi yêu cầu đối soát liên kết hồ sơ lịch sử khám cũ tại phòng khám (D-LINK Workflow).
4. **Trigger Chống Spam Form Đặt Lịch Vãng Lai (`trg_guest_booking_rate_limit`):**
   * Ngăn chặn gửi quá 3 yêu cầu đặt lịch vãng lai trong 24 giờ trên cùng một số điện thoại.
5. **Wrappers Schema Public An Toàn:**
   * `public.rpc_register_customer_pet`
   * `public.rpc_create_customer_appointment`
   * `public.rpc_request_customer_link`
   * Toàn bộ cấu hình `SECURITY DEFINER`, `SET search_path = ''` và cấp quyền `GRANT EXECUTE TO authenticated`.

---

### 2. Danh Mục 2 Tệp Migration Mới Của Gate 4

| STT | Tệp Migration | Chức Năng Triển Khai | Ràng Buộc Kỹ Thuật |
| :---: | :--- | :--- | :--- |
| **11** | [`20261106000011_customer_pet_rpcs.sql`](file:///d:/webbvct/supabase/migrations/20261106000011_customer_pet_rpcs.sql) | RPCs đặt lịch, đăng ký thú cưng, yêu cầu liên kết & 3 public wrappers | **D-19:** Lazy Creation trên booking đầu tiên.<br>**U-3:** IDOR pet verification.<br>**POL-BOOKING:** Rate limiter. |
| **12** | [`20261106000012_rate_limiter_booking.sql`](file:///d:/webbvct/supabase/migrations/20261106000012_rate_limiter_booking.sql) | Helper `check_booking_rate_limit` & Trigger `trg_guest_booking_rate_limit` | Giới hạn tối đa 3 lịch hẹn pending/24h cho khách vãng lai và portal. |

---

### 3. Bằng Chứng Kiểm Thử Runtime Gate 4 (10/10 PASS)

Kịch bản [`test/runtime/04_customer_booking.test.cjs`](file:///d:/webbvct/test/runtime/04_customer_booking.test.cjs) kết nối trực tiếp PostgreSQL v17:

```text
=== RUNNING RUNTIME TEST SUITE 04: CUSTOMER, PET & APPOINTMENT RPCs ===
Timestamp: 2026-11-08T04:51:35.876Z
[RUNTIME PASS] GATE4-T4.1: SEC-05: User signup creates auth identity but 0 CRM customer records (D-19 Strict Lazy Creation)
       Evidence: Lazy creation on signup: DO PASSED
[RUNTIME PASS] GATE4-T4.2: Lazy Customer Profile is dynamically created upon first appointment booking (D-19 Lifecycle)
       Evidence: First booking lazy creation: DO PASSED
[RUNTIME PASS] GATE4-T4.3: public.rpc_register_customer_pet successfully registers pet and binds customer relationship
       Evidence: Pet registration result: DO PASSED
[RUNTIME PASS] GATE4-T4.4: SEC-06: Strict IDOR check prevents User A from booking appointments on User B pet
       Evidence: IDOR check result: DO PASSED
[RUNTIME PASS] GATE4-T4.5: SEC-07: Invalid appointment types strictly rejected (Only: medical, spa, vaccine, recheck permitted)
       Evidence: Invalid type check: DO PASSED
[RUNTIME PASS] GATE4-T4.6: Scheduling validation: Appointments scheduled in the past are strictly rejected
       Evidence: Past date check: DO PASSED
[RUNTIME PASS] GATE4-T4.7: SEC-08: POL-BOOKING Rate Limiter strictly enforces max 3 pending appointments per customer
       Evidence: Rate limiter result: DO PASSED
[RUNTIME PASS] GATE4-T4.8: D-LINK: Customer link request workflow generates pending request for Receptionist/Admin verification
       Evidence: D-LINK result: DO PASSED
[RUNTIME PASS] GATE4-T4.9: Guest Booking Form Anti-Spam: Blocks 4th guest request within 24h from same phone number
       Evidence: Guest anti-spam result: DO PASSED
[RUNTIME PASS] GATE4-T4.10: Public schema RPC wrappers are configured as SECURITY DEFINER with search_path protection
       Evidence: Verified public RPC wrappers: 3 / 3

======================================================
=== SUITE 04 SUMMARY: 10 / 10 TESTS PASSED ===
>>> ACCEPTANCE GATE 4: 100% RUNTIME PASS! READY FOR GATE 5! <<<
======================================================
```

---

## PHẦN III: KẾT QUẢ KIỂM THỬ HỒI QUY TỔNG THỂ (GATES 1, 2, 3, 4)

Chạy đồng thời toàn bộ 4 bộ test suite trên cùng Docker Sandbox PostgreSQL:
- **Suite 01 (Gate 1 Foundation & Schema Isolation):** **5 / 5 PASS (100%)**
- **Suite 02 (Gate 2 39 Tables & Invariants P1-C, P1-E):** **10 / 10 PASS (100%)**
- **Suite 03 (Gate 3 Enhanced Auth, RBAC, RLS & Audit):** **10 / 10 PASS (100%)**
- **Suite 04 (Gate 4 Customer, Pet, Appointment & Rate Limit):** **10 / 10 PASS (100%)**
- **TỔNG CỘNG: 35 / 35 RUNTIME TESTS PASS — 0 FAIL — 0 SKIP.**

Tuân thủ nghiêm ngặt quy chế: **Không merge main, không deploy production, chi phí phát sinh $0.00, không sử dụng dữ liệu thật.**
