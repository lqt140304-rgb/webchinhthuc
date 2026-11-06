# THIẾT KẾ KIẾN TRÚC HỆ THỐNG QUẢN LÝ BỆNH VIỆN THÚ Y LÊ SƠN (PHASE 4A)
## Single-Facility Veterinary Hospital Management System & Generic Excel Import Center Specification (v1.6.9 - Targeted Corrective Patch & Runtime Verification)

- **Dự án:** Bệnh viện Thú y Lê Sơn (`lqt140304-rgb/webchinhthuc`)
- **Mã tài liệu:** `LESON-ARCH-PHASE4A-20261103-V1.6.9`
- **Phiên bản:** 1.6.9 *(Bản vá hiệu chỉnh chính xác theo thẩm định Claude QA v1.6.8: (1) Sửa triệt để SQL rpc_import_approve_job loại bỏ truy vấn cột app.users.role không tồn tại và vai trò manager, sử dụng check_active_shift(auth.uid(), 'admin'), đồng bộ điều kiện trạng thái awaiting_approval khớp 100% với CHECK staging.import_jobs.status; sửa rpc_revoke_staff_device chỉ kiểm tra admin; sửa rpc_ensure_app_user chỉ sử dụng auth.uid() server-side loại bỏ tham số client; (2) Đồng bộ kiểm đếm CSDL 39 bảng (34 app + 4 staging + 1 audit) xuyên suốt Section III.1, ERD, RBAC Section VI.4; tách dòng RBAC riêng cho staff_device_sessions (cấm SELECT token hash/fingerprint, dùng RPC tối thiểu) và historical_loyalty_points (chỉ Admin qua endpoint bảo vệ, hỗ trợ rollback theo import_job_id); (3) Cập nhật Sổ quyết định: bổ sung quyết định độc lập D-PHONE / D-21 về nhiều khách dùng chung SĐT (P1-E Invariant), sửa lịch sử D-03, chuyển banner đóng băng thành "Đề xuất chuẩn hóa chờ Chủ dự án ban hành", phân loại minh bạch thẩm quyền nguồn xác nhận và giữ PITR DEFERRED; (4) Hoàn thiện BYOD 5 tầng: ưu tiên getUserMedia in-memory capture, ngoại lệ capture có rủi ro camera roll, thay "đảm bảo tuyệt đối" bằng "giảm thiểu rủi ro", DDL staff_device_sessions (RESTRICT, is_trusted DEFAULT FALSE), bổ sung rpc_register_staff_device, rpc_approve_staff_device, rpc_verify_staff_device, cơ chế Remote Wipe giới hạn và thu hồi session Auth; sửa Sharp/FFmpeg khử metadata đúng chuẩn; (5) Đồng bộ appointments.appointment_type CHECK ('medical', 'spa', 'vaccine', 'recheck') với rpc_create_customer_appointment; bảo vệ dòng hóa đơn tự do mặc định ẩn; sửa phép tính chi phí Production $34.50 – $40.50/tháng; làm rõ FSM validating; sửa RPO daily dump <= 24h; 92 test cases DESIGNED — NOT TESTED; NO PAID DEPLOYMENT, DOCUMENTATION UPDATE ONLY)*
- **Tác giả thiết kế:** Antigravity (Senior Product Designer & System Architect)
- **Đơn vị điều phối:** ChatGPT (CEO Điều phối)
- **Đơn vị thẩm định độc lập:** Claude (Independent QA Reviewer)
- **Ngày cập nhật:** 05/11/2026
- **Trạng thái:** **`DRAFT — AWAITING INDEPENDENT QA`** *(Bản thảo tài liệu kỹ thuật v1.6.9 hoàn thiện bàn giao để Claude QA thẩm định độc lập; DOCUMENTATION UPDATE ONLY — NO PAID DEPLOYMENT, tuyệt đối không viết mã backend, không mở project Supabase, không deploy, không merge)*

---

> [!IMPORTANT]
> ### NGUYÊN TẮC BẢO MẬT Y KHOA & KỶ LUẬT KIẾN TRÚC BẤT BIẾN (CORE ARCHITECTURAL INVARIANTS)
> 1. **Ranh giới Bảo mật Tuyệt đối — P1-D Invariant (Strict Security Boundary by Architecture):**
>    - **Schema Isolation:** Toàn bộ 32 bảng nghiệp vụ gốc chứa dữ liệu nhạy cảm nằm trong schema nội bộ **`app.*`**. Schema `app` **TUYỆT ĐỐI KHÔNG PHƠI RA POSTGREST API** (`db-schemas = "public"`). Mọi truy vấn trực tiếp từ trình duyệt tới `app.*` đều nhận phản hồi **HTTP 404 (Not Found)**.
>    - **Kiểm soát Thực thi & Phơi API (Solving S-2, T-3):** Các RPCs gọi từ client được cung cấp qua schema `public.*` dưới dạng wrapper an toàn (`SECURITY DEFINER`, `SET search_path = ''`). Toàn bộ hàm đặc quyền bị **`REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public, app FROM PUBLIC, anon;`** và chỉ cấp **`GRANT EXECUTE TO authenticated;`**.
    - **Khóa Quyền Mặc Định Toàn Cục & Tương Lai (Solving T-3):** Thực thi các lệnh:
      ```sql
      -- Khóa quyền execute mặc định toàn cục cho role postgres và các hàm mới
      ALTER DEFAULT PRIVILEGES FOR ROLE postgres REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public, app REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon;
      ```
      Triệt tiêu hoàn toàn cơ chế mặc định của PostgreSQL tự cấp EXECUTE cho `PUBLIC` và `anon` trên các hàm mới. Quy tắc kiến trúc bắt buộc: Toàn bộ 46 RPCs đều có wrapper tương ứng tại `public` và kiểm soát quyền `GRANT EXECUTE` tường minh.
>    - Cột `is_clinical_hidden = TRUE` kết hợp cờ `requires_clinical_hiding = TRUE` mặc định ẩn toàn bộ thuốc/y lệnh nội bộ; **tuyệt đối không bao giờ xuất hiện** trong bất kỳ payload API nào của khách hàng.
> 2. **Tuyệt đối Không Ràng buộc Duy nhất Số điện thoại — P1-E Invariant (No Unique Phone Constraint):**
>    - Xóa bỏ hoàn toàn chỉ mục `uq_customer_active_phone`. Hệ thống cho phép nhiều hồ sơ `app.customers` có cùng số điện thoại (phục vụ trường hợp người thân trong gia đình dùng chung số, hoặc số điện thoại bị nhà mạng tái cấp).
>    - Khóa định danh duy nhất của khách hàng là `app.customers.id` (UUID). Dữ liệu nhập từ Excel nhận diện bằng cặp `(source_system, source_customer_code)`.
>    - Số điện thoại kết hợp họ tên chỉ đóng vai trò gợi ý đối soát tại quầy tiếp tân, **tuyệt đối không dùng làm căn cứ tự động gom gộp hồ sơ**.
> 3. **Đồng nhất Định danh Tuyệt đối — G1 Invariant (Identity Alignment):**
>    - Khóa chính `app.users.id` đồng nhất 1:1 với `auth.users(id)` của Supabase Auth: `id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT`. Mọi hàm kiểm tra `auth.uid()` khớp chính xác với `app.users.id`.
> 4. **Bảo vệ Bệnh án Tuyệt đối — Triệt tiêu Xóa theo Dây chuyền — P1-C Invariant:**
>    - Triệt tiêu toàn bộ `ON DELETE CASCADE` trên các quan hệ hồ sơ lâm sàng, y lệnh, sinh hiệu, đơn thuốc, lưu viện, lịch sử phê duyệt và hóa đơn. Áp dụng **`ON DELETE RESTRICT`**.
>    - Tuyệt đối cấm thao tác DELETE hồ sơ bệnh án qua API thông thường. Bệnh án được khóa cứng (`is_locked = TRUE`) sau 24 giờ hoặc khi xuất viện; mọi bổ sung thông tin sau đó bắt buộc qua cơ chế Addendum (`app.clinical_amendments`).
> 5. **Quy tắc Kiểm tra Rollback Toàn diện theo Khách — J1 & J2 Invariants (Safe Rollback Guard):**
>    - Nhận diện đúng: Thao tác rollback là Xóa mềm (`is_deleted = TRUE`), không kích hoạt `ON DELETE RESTRICT`.
>    - Hàm `app.validate_job_rollback` duyệt toàn bộ dữ liệu phát sinh của **khách hàng thuộc job thông qua `customer_id`** (không chỉ dựa vào `import_job_id`), bao gồm: thú cưng mới tạo tại quầy, hồ sơ bệnh án, ca lưu viện, lịch hẹn, liên kết portal, và hóa đơn mới. Nếu khách đã phát sinh bất kỳ dữ liệu vận hành nào cần giữ, cấm tuyệt đối việc xóa mềm khách hàng.
>    - Gắn trigger tự động tăng `version` và cập nhật `updated_at` cho 7 bảng thực thể nhập/chỉnh sửa tại quầy (`customers`, `products`, `services`, `invoices`, `inventory_batches`, `pets`, `clinical_records`) để bắt trọn mọi chỉnh sửa thủ công và chặn đứng rollback (Solving J2, S-8).
>    - Hàm rollback thực thi khóa dòng `FOR UPDATE` trên `staging.import_jobs` để chống race condition.
> 6. **Quy trình Duyệt Bất biến & Ràng buộc Media ↔ Bản Tin — H1 & R-7 Invariants:**
>    - Quy trình 5 trạng thái: `draft` $\rightarrow$ `review` $\rightarrow$ `approved` $\rightarrow$ `published` $\rightarrow$ `revoked`.
>    - Media lưu viện chỉ được cấp phép xem khi gắn trực tiếp với **đúng bản tin y khoa đã được phát hành (`published`)** thông qua `app.inpatient_daily_media.bulletin_id`, gắn với chủ nuôi hợp lệ (`pets.customer_id`), đã được Bác sĩ duyệt (`chk_media_approval`), và qua Signed URL có thời hạn sống thống nhất **15 phút**. Tuyệt đối không chấp nhận một bản tin published khác của cùng thú cưng làm bằng chứng duyệt media.
> 7. **Quản lý Số lô Nội bộ & Không Tự sinh Hạn dùng — H7 & P2-K Invariants:**
>    - Tuyệt đối không tự sinh hạn sử dụng giả tạo. Lô hàng thiếu HSD được lưu `expiry_date = NULL` kèm `expiry_status = 'unknown'`.
>    - Tệp nhập thiếu số lô được hệ thống cấp mã theo dõi nội bộ duy nhất dạng `'UNKNOWN-' || SUBSTRING(job_id, 1, 8) || '-' || row_number` kèm `batch_number_status = 'unverified'`, chống xung đột khóa duy nhất `(product_id, batch_number)`.
>    - Các lô hàng thuộc diện theo dõi số lô bắt buộc mà chưa rõ HSD hoặc số lô đều bị khóa cách ly (`quarantined`), cấm xuất bán hoặc kê đơn tại tầng RPC.
> 8. **Quy tắc Hai Người Phê duyệt ở Mức CSDL — R-3 Invariant (Database Two-Man Rule):**
>    - Bắt buộc kiểm tra ràng buộc `CHECK (approved_by IS NULL OR approved_by <> uploaded_by)` trên bảng `staging.import_jobs`.
>    - Người tải lên tệp tuyệt đối không thể tự phê duyệt commit đợt nhập đó dù có quyền kiêm nhiệm Quản lý.
> 9. **Kỷ luật Triển khai & Hạ tầng Trung lập — N-7, N-8 & S-6 Invariants:**
>    - Bản tài liệu v1.6.5 thuần túy là đặc tả kiến trúc kỹ thuật chuẩn mực. Không lập trình backend, không mở project Supabase, không deploy, không merge nhánh, không phát sinh chi phí.
>    - Không tự ý quyết định thay Chủ dự án về nhà cung cấp đám mây (Cloudflare, Vercel, AWS). Tách rõ mục tiêu thiết kế RPO/RTO khỏi cam kết dịch vụ của nhà cung cấp.
>    - Worker 1 áp dụng chính sách **Default-Deny Outbound kèm Allowlist** chỉ cho phép kết nối tới Supabase Storage (HTTPS) và Supabase PostgreSQL (5432/6543) qua tài khoản đặc quyền tối thiểu `import_worker_role`.

---

## I. BỐI CẢNH VẬN HÀNH & PHÂN LOẠI DỮ KIỆN XÁC MINH (SOLVING N-1)

### 1. Phân loại Dữ kiện Hiện trạng (Operational Context & Traceability)
Dựa trên đối chiếu trung thực với repository `lqt140304-rgb/webchinhthuc`:
- **Địa chỉ cơ sở (D-18 CONFIRMED BY OWNER 05/11/2026):**
  - Địa chỉ đầy đủ: `101 Khuất Duy Tiến, Phường Nhân Chính, Quận Thanh Xuân, Hà Nội` `[CONFIRMED — OWNER DECISION D-18]`.
  - Đồng bộ 100% với tài liệu chiến lược SEO repo (`docs/seo-strategy.md`) và thẻ Schema.org `LocalBusiness`.
- **Hotline liên hệ & Giờ hoạt động:**
  - Hotline: `097 355 51 05` `[REPO-INHERITED, UNVERIFIED — PROJECT_BRIEF.md:32]`.
  - Khám dịch vụ & Tiêm chủng: `08:00 – 21:00` hàng ngày `[REPO-INHERITED, UNVERIFIED — PROJECT_BRIEF.md:32]`.
  - Trực cấp cứu: `24/24` xuyên đêm `[REPO-INHERITED, UNVERIFIED — PROJECT_BRIEF.md:32]`. *(Lưu ý: Tuyệt đối không khẳng định "lưu viện nội trú 24/24" khi chưa có văn bản phê duyệt của Chủ dự án).*
- **Quy mô & Cơ cấu vận hành dự kiến (Mock / Estimate — NOT VERIFIED):**
  - Đơn cơ sở (Single-facility), chưa có chi nhánh.
  - Dự kiến 10–15 lồng/chuồng lưu viện chia 3 phân khu: Chó lớn, Mèo, Khu cách ly truyền nhiễm.
  - Đội ngũ vận hành ước tính: 4–6 Bác sĩ thú y, 4–8 Điều dưỡng/Chăm sóc viên, 2–3 Tiếp tân quầy, 1–2 Quản lý.

---

## II. THỐNG NHẤT NỀN TẢNG KỸ THUẬT & RANH GIỚI BẢO MẬT (SOLVING P1-A, P1-D, P1-E, P2-O, N-3, S-2, S-6, S-11, R-4, G1, G2, G3)

### 1. Kiến trúc Tổng thể & Phân định Nền tảng (Platform Architecture)

```
+----------------------------------------------------------------------------------------------------+
|                                    CLIENT TIER (PRESENTATION LAYER)                                |
|                                                                                                    |
|  [ Public Website ]                     [ Customer Portal ]               [ Staff & Mgmt Portal ]  |
|  - Framework: React Router 7 SSG/       - Mobile-first PWA / Web Client   - Desktop-optimized Web  |
|    Prerender (Framework Mode)           - Route: /tai-khoan/*             - Route: /quan-ly/*      |
|  - Guest Booking Form (Bot Token)       - Anonymous -> Verified Account   - X-Robots-Tag: noindex  |
|  - Hosting Options: Cloudflare Pages /  - JWT authenticated                - Role-based UI + MFA    |
|    Vercel Pro / Dedicated VPS             (aal1 standard)                   (aal2 mandatory)       |
+----------------------------------------------------------------------------------------------------+
                                      |                                  |
                                      v                                  v
+----------------------------------------------------------------------------------------------------+
|                                  API GATEWAY & EDGE SURFACE LAYER                                  |
|                                                                                                    |
|  [ Neutral Serverless / API Service Options ]                                                      |
|  - Option A: Supabase Edge Functions (Deno Runtime, Singapore Region)                              |
|  - Option B: Node.js API Service trên Dedicated Worker VPS / Cloud Run                             |
|  - Tác vụ công khai: /api/booking/guest (Idempotency + Rate-limit), /api/media/signed-url           |
|  - Quản lý Bí mật: Secrets Vault / Env Vars (Zero Secrets in Client Bundle)                        |
|                                                                                                    |
|  [ Supabase PostgREST Layer ]                                                                      |
|  - db-schemas = "public" (Chỉ phơi schema public, BẢO VỆ TUYỆT ĐỐI SCHEMA app)                     |
|  - HTTP 404 cho mọi truy vấn trực tiếp vào app.*                                                   |
+----------------------------------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------------------------------+
|                                DATABASE TIER (POSTGRESQL 15+ ON SUPABASE)                          |
|                                                                                                    |
|  +-------------------------------------+   +----------------------------------------------------+  |
|  |           SCHEMA "public"           |   |                    SCHEMA "app"                    |  |
|  |  (Cổng giao tiếp được cấp phép)     |   |    (32 Bảng nghiệp vụ nội bộ - ĐÓNG KÍN 100%)      |  |
|  |                                     |   |                                                    |  |
|  |  - 8 Secure Customer Views          |   |  - Users, Roles, Shifts, Cage Zones                |  |
|  |    (security_barrier = true)        |   |  - Customers (NO UNIQUE ON PHONE - Solving P1-E),  |  |
|  |  - Public Wrappers (public.rpc_*)   |   |    Pets, Links, Consents, User Link Requests       |  |
|  |  - REVOKE EXECUTE FROM PUBLIC/anon  |   |  - Clinical Records, Vitals, Diagnoses, Orders,    |  |
|  |  - GRANT EXECUTE TO authenticated   |   |    Prescriptions, Inpatient Stays, Daily Logs,     |  |
|  |                                     |   |    Inpatient Media (bulletin_id bound),            |  |
|  |                                     |   |    Pet Medical Bulletins, Approval History, Amend. |  |
|  |                                     |   |  - Products, Services, Batches, Inventory Trans,   |  |
|  |                                     |   |    Invoices, Invoice Items, Payments               |  |
|  +-------------------------------------+   +----------------------------------------------------+  |
|                                                                                                    |
|  +-------------------------------------+   +----------------------------------------------------+  |
|  |          SCHEMA "staging"           |   |                   SCHEMA "audit"                   |  |
|  |  - import_jobs (Two-Man CHECK),     |   |  - audit_logs (Append-only, duty_context,          |  |
|  |    import_rows, import_errors,      |   |    actor_id, ip_address, changes JSONB)            |  |
|  |    import_mappings (6 entities)     |   |                                                    |  |
|  +-------------------------------------+   +----------------------------------------------------+  |
+----------------------------------------------------------------------------------------------------+
                                      ^
                                      | (Outbound Allowlist: Chỉ Supabase Storage 443 & DB 5432/6543)
+----------------------------------------------------------------------------------------------------+
|                                 ISOLATED WORKER TIER (TWO SEPARATE VPS)                            |
|                                                                                                    |
|  [ Worker Tier: D-14 APPROVED — DESIGN ONLY (1 VPS Cách Ly Container, Chưa Thuê VPS) ]          |
|  - Máy chủ: 1 vCPU, 2GB RAM (Hetzner Cloud CX22 / DigitalOcean Droplet)                            |
|  - Service 1: Import Sandbox Parser (Docker non-root 1000:1000, cgroup RAM 1.5GB, No-Internet Net) |
|  - Service 2: DR Backup Worker (Cron Systemd riêng biệt trên Host, pg_dump mã hóa GPG đẩy R2/S3)   |
|  - Tường lửa Outbound: Default-Deny + Allowlist (Chỉ Supabase Storage 443 & DB 5432/6543)          |
|  - Role DB tối thiểu: import_worker_role (Chỉ schema staging.*) / backup_role (SELECT dump-only)   |
+----------------------------------------------------------------------------------------------------+
```

---

### 2. Định danh Người dùng, Vai trò & Phiên làm việc (Solving P1-A, G1, P2-N)

#### A. Kiến trúc Định danh Thống nhất
- Toàn bộ người dùng đăng nhập (Nhân viên phòng khám và Khách hàng portal) đều được quản lý tập trung qua **Supabase Auth** (`auth.users`), mang PostgreSQL connection role `authenticated`.
- Bảng hồ sơ người dùng ứng dụng `app.users` đồng nhất khóa chính 1:1 với Supabase Auth (`id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT`).

#### B. Cơ chế Phân quyền Nhân viên Thời gian thực & Route Guard (Solving R-4)
- **Danh mục vai trò chuẩn hóa:** `'admin'`, `'doctor'`, `'nurse'`, `'receptionist'`, `'spa_staff'`.
- **Bảo vệ Cổng Quản lý `/quan-ly/*` (Solving R-4):**
  - **HTTP Header Bảo Mật:** Web server trả header `X-Robots-Tag: noindex, nofollow` cho toàn bộ các route thuộc `/quan-ly/*` và các bản triển khai staging/preview.
  - **Client-Side Route Guard (React Router 7):** Component `StaffProtectedRoute` kiểm tra phiên đăng nhập Supabase Auth, đối chiếu trạng thái `is_active = TRUE` trong `app.staff_role_assignments`, và bắt buộc mức xác thực MFA AAL2 (`auth.jwt()->>'aal' = 'aal2'`) đối với Bác sĩ và Quản lý. Mọi truy cập không đạt điều kiện đều bị chuyển hướng về `/quan-ly/dang-nhap`.

#### C. Hàm Kiểm Tra Ca Trực Thời Gian Thực — Logic Audit Chính Xác (Solving N-3, S-11)
Khắc phục triệt để lỗi kiểu dữ liệu và lỗi ghi nhận nhật ký audit sai/nhiễu:
1. Sử dụng kiểu `TIMESTAMP` (without time zone) biểu diễn chuẩn giờ địa phương Việt Nam, triệt tiêu độ lệch 7 giờ của session timezone UTC.
2. **Kiểm tra ca trực của Admin trước (Solving S-11):** Nếu Quản trị viên đang thực sự trong ca trực phân công, hàm trả về `TRUE` mà **tuyệt đối không ghi log `OFF_SHIFT_ADMIN_ACCESS`**. Chỉ khi Admin thao tác ngoài ca trực (off-shift override), hệ thống mới ghi một bản ghi audit duy nhất để kiểm soát lạm quyền.

```sql
CREATE OR REPLACE FUNCTION app.check_active_shift(
    p_user_id UUID,
    p_required_role VARCHAR(30)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_has_active_shift BOOLEAN := FALSE;
    v_is_admin BOOLEAN := FALSE;
    v_now_vn TIMESTAMP := (CLOCK_TIMESTAMP() AT TIME ZONE 'Asia/Ho_Chi_Minh');
    v_current_time TIME := v_now_vn::TIME;
    v_current_date DATE := v_now_vn::DATE;
BEGIN
    -- 1. Kiểm tra vai trò nhân viên hợp lệ
    IF NOT EXISTS (
        SELECT 1 FROM app.staff_role_assignments sra
        WHERE sra.user_id = p_user_id 
          AND (sra.role = p_required_role OR sra.role = 'admin')
          AND sra.is_active = TRUE
    ) THEN
        RETURN FALSE;
    END IF;

    -- 2. Kiểm tra xem nhân viên có đang trong ca trực phân công thực tế hay không
    SELECT EXISTS (
        SELECT 1 
        FROM app.shift_assignments sa
        JOIN app.shifts s ON s.id = sa.shift_id
        WHERE sa.user_id = p_user_id
          AND sa.is_active = TRUE
          AND (
              -- Ca trực trong ngày (VD: 08:00 đến 17:00)
              (s.start_time <= s.end_time AND sa.assignment_date = v_current_date AND v_current_time BETWEEN s.start_time AND s.end_time)
              OR
              -- Ca trực qua đêm (VD: 21:00 hôm nay đến 08:00 sáng hôm sau)
              (s.start_time > s.end_time AND (
                  (sa.assignment_date = v_current_date AND v_current_time >= s.start_time)
                  OR
                  (sa.assignment_date = v_current_date - INTERVAL '1 day' AND v_current_time <= s.end_time)
              ))
          )
    ) INTO v_has_active_shift;

    -- Nếu đang trong ca trực hợp lệ -> Cho phép thực thi ngay, không ghi log override
    IF v_has_active_shift THEN
        RETURN TRUE;
    END IF;

    -- 3. S-11 FIX: Nếu không trong ca trực nhưng là Quản trị viên (Admin) -> Cho phép vượt ca kèm ghi log Audit
    SELECT EXISTS (
        SELECT 1 FROM app.staff_role_assignments sra
        WHERE sra.user_id = p_user_id 
          AND sra.role = 'admin' 
          AND sra.is_active = TRUE
    ) INTO v_is_admin;
    
    IF v_is_admin THEN
        INSERT INTO audit.audit_logs (actor_id, action_type, target_entity, duty_context, changes)
        VALUES (
            p_user_id, 
            'OFF_SHIFT_ADMIN_ACCESS', 
            'shifts', 
            'off_shift_admin_override', 
            jsonb_build_object('required_role', p_required_role, 'timestamp_vn', v_now_vn)
        );
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$;
```

---

## III. THIẾT KẾ CƠ SỞ DỮ LIỆU CHUẨN HÓA & ERD v1.6.5 (SOLVING P1-E, H1, H2, H6, H7, N-4, S-4, S-5, S-8, R-2, R-3, R-6, R-7)

### 1. Phân Bổ Danh Mục 39 Bảng Theo 4 Schema (Kiểm đếm 100% chuẩn xác)

```
+--------------------------------------------------------------------------------------------------+
|                   TỔNG SỐ: 39 BẢNG DỮ LIỆU QUẢN LÝ (CHUẨN HÓA TOÀN DIỆN v1.6.9)                  |
+--------------------------------------------------------------------------------------------------+
| 1. Schema "app" (34 Bảng nghiệp vụ nội bộ - ĐÓNG KÍN TUYỆT ĐỐI, ZERO POSTGREST EXPOSURE):        |
|    - Nhóm 1: Định danh & Phân quyền (5 bảng): users, staff_role_assignments, cage_zones,         |
|              shifts, shift_assignments.                                                          |
|    - Nhóm 2: Hồ sơ Khách & Liên kết (5 bảng): customers (NO UNIQUE ON PHONE - P1-E), pets,       |
|              customer_user_links (with notes), user_link_requests, pet_medical_consents.         |
|    - Nhóm 3: Tiếp nhận & Đặt hẹn (3 bảng): appointments, medical_appointments,                   |
|              guest_booking_requests (with idempotency_key & auto_delete_at).                       |
|    - Nhóm 4: Bệnh án & Khám chữa bệnh (6 bảng): clinical_records, clinical_record_vitals,         |
|              clinical_diagnoses, treatment_orders, prescriptions, clinical_amendments.            |
|    - Nhóm 5: Lưu viện & Bản tin Y khoa (6 bảng): cages, inpatient_stays, inpatient_daily_logs,    |
|              inpatient_daily_media (bulletin_id bound), pet_medical_bulletins,                   |
|              bulletin_approval_history (ON DELETE RESTRICT - Solving S-8).                       |
|    - Nhóm 6: Kho Dược & Vật tư (4 bảng): products (requires_clinical_hiding auto-derived),       |
|              services (requires_clinical_hiding auto-derived), inventory_batches,                |
|              inventory_transactions (with return_receipt - Solving S-5).                         |
|    - Nhóm 7: Tài chính & Hóa đơn (3 bảng): invoices, invoice_items (is_clinical_hidden),          |
|              invoice_payments.                                                                   |
|    - Nhóm 8: Điểm Thân Thiết Lịch Sử GPet (1 bảng - D-09, V-2): historical_loyalty_points        |
|              (Lưu số dư điểm GPET cũ, khóa quy đổi, hỗ trợ rollback, Admin only).                |
|    - Nhóm 9: Quản lý Phiên Thiết bị BYOD (1 bảng - D-20, BYO-2): staff_device_sessions           |
|              (Lưu phiên thiết bị cá nhân nhân viên, RESTRICT on delete, is_trusted DEFAULT FALSE). |
|                                                                                                  |
| 2. Schema "staging" (4 Bảng vùng đệm Import Center):                                             |
|    - import_jobs (with chk_two_man_approval), import_rows, import_errors, import_mappings.        |
|                                                                                                  |
| 3. Schema "audit" (1 Bảng nhật ký bất biến):                                                    |
|    - audit_logs (vết kiểm toán tập trung, actor_id, duty_context, ip_address, changes).          |
+--------------------------------------------------------------------------------------------------+
```

---

### 2. DDL Chi Tiết Bảng Thực Thể Cốt Lõi (v1.6.5 Hardened)

#### Nhóm Định danh, Nhân sự & Phân ca (5 Bảng)
```sql
CREATE TABLE app.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
    phone_number VARCHAR(15) NULL,
    full_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.staff_role_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    role VARCHAR(30) NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'spa_staff')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    assigned_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    CONSTRAINT uq_user_role UNIQUE (user_id, role)
);

CREATE TABLE app.cage_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_code VARCHAR(20) NOT NULL UNIQUE,
    zone_name VARCHAR(100) NOT NULL,
    zone_type VARCHAR(30) NOT NULL CHECK (zone_type IN ('dog_large', 'dog_small', 'cat', 'isolation', 'recovery')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE app.shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_code VARCHAR(30) NOT NULL UNIQUE,
    shift_name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE app.shift_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    shift_id UUID NOT NULL REFERENCES app.shifts(id) ON DELETE RESTRICT,
    assignment_date DATE NOT NULL,
    assigned_cage_zone UUID NULL REFERENCES app.cage_zones(id) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    CONSTRAINT uq_user_shift_date UNIQUE (user_id, shift_id, assignment_date)
);
```

#### Nhóm Khách hàng & Thú cưng (5 Bảng - SOLVING P1-E, S-8)
```sql
CREATE TABLE app.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_system VARCHAR(30) NULL,           -- 'gpet', 'excel', 'counter', 'portal_self_registered'
    source_customer_code VARCHAR(50) NULL,    -- Mã định danh từ hệ thống cũ
    phone_number VARCHAR(15) NOT NULL,        -- KHÔNG UNIQUE (Cho phép nhiều hồ sơ dùng chung số)
    full_name VARCHAR(100) NOT NULL,
    normalized_name VARCHAR(100) NOT NULL,    -- Chuyển chữ thường, bỏ dấu phục vụ so khớp gợi ý
    address TEXT NULL,
    is_phone_archived BOOLEAN NOT NULL DEFAULT FALSE, -- Đánh dấu SĐT bị hủy/thu hồi do tái cấp
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    import_job_id UUID NULL,                  -- S-8 FIX: FK tham chiếu rõ ràng
    version INT NOT NULL DEFAULT 1,           -- Tự động tăng qua Trigger để chặn Rollback
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES app.customers(id) ON DELETE RESTRICT,
    source_system VARCHAR(30) NULL,
    source_pet_code VARCHAR(50) NULL,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(30) NOT NULL CHECK (species IN ('dog', 'cat', 'other')),
    breed VARCHAR(100) NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'unknown')),
    date_of_birth DATE NULL,
    microchip_number VARCHAR(50) NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    import_job_id UUID NULL,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.customer_user_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES app.customers(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    link_status VARCHAR(30) NOT NULL CHECK (link_status IN ('self_registered_unverified', 'pending', 'verified', 'revoked')),
    verified_by UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    verified_at TIMESTAMPTZ NULL,
    revoked_by UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    revoked_at TIMESTAMPTZ NULL,
    notes TEXT NULL,                          -- Ghi chú lịch sử liên kết / lý do thu hồi
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.user_link_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    requested_phone VARCHAR(15) NOT NULL,
    requested_full_name VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
    resolved_by UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    resolved_at TIMESTAMPTZ NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.pet_medical_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES app.customers(id) ON DELETE RESTRICT,
    pet_id UUID NOT NULL REFERENCES app.pets(id) ON DELETE RESTRICT,
    consent_type VARCHAR(50) NOT NULL CHECK (consent_type IN ('surgery', 'anesthesia', 'inpatient_treatment', 'euthanasia')),
    consent_signed_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    witness_staff_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    file_storage_path TEXT NULL,
    notes TEXT NULL
);
```

#### Nhóm Tiếp nhận & Đặt hẹn (3 Bảng - SOLVING N-6)
```sql
CREATE TABLE app.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES app.customers(id) ON DELETE RESTRICT,
    pet_id UUID NOT NULL REFERENCES app.pets(id) ON DELETE RESTRICT,
    -- V-5 FIX: Đồng bộ danh mục lịch hẹn hợp lệ giữa CSDL và RPC đặt lịch (medical, spa, vaccine, recheck)
    appointment_type VARCHAR(30) NOT NULL CHECK (appointment_type IN ('medical', 'spa', 'vaccine', 'recheck')),
    scheduled_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'awaiting_confirmation' 
           CHECK (status IN ('awaiting_confirmation', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show')),
    source VARCHAR(30) NOT NULL DEFAULT 'counter' CHECK (source IN ('counter', 'portal', 'guest_web')),
    cancellation_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.medical_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES app.appointments(id) ON DELETE RESTRICT,
    assigned_doctor_id UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    chief_complaint TEXT NOT NULL,
    triage_priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (triage_priority IN ('emergency', 'urgent', 'normal', 'low')),
    triage_notes TEXT NULL,
    checked_in_at TIMESTAMPTZ NULL
);

CREATE TABLE app.guest_booking_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idempotency_key VARCHAR(64) NULL,         -- N-6 FIX: Chống gửi đúp form từ client
    guest_name VARCHAR(100) NOT NULL,
    guest_phone VARCHAR(15) NOT NULL,
    pet_name VARCHAR(100) NOT NULL,
    species VARCHAR(30) NOT NULL CHECK (species IN ('dog', 'cat', 'other')),
    service_type VARCHAR(30) NOT NULL CHECK (service_type IN ('medical', 'spa')),
    preferred_date DATE NOT NULL,
    preferred_time_slot VARCHAR(30) NOT NULL,
    notes TEXT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'rejected', 'spam', 'cancelled')),
    bot_verified BOOLEAN NOT NULL DEFAULT FALSE,
    client_ip_hash VARCHAR(64) NOT NULL,      -- Hash SHA-256 ẩn danh IP
    processed_by UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    created_appointment_id UUID NULL REFERENCES app.appointments(id) ON DELETE SET NULL,
    auto_delete_at TIMESTAMPTZ NOT NULL DEFAULT (CLOCK_TIMESTAMP() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);
```

#### Nhóm Hồ sơ Lâm sàng & Khám chữa bệnh (6 Bảng)
```sql
CREATE TABLE app.clinical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES app.pets(id) ON DELETE RESTRICT,
    appointment_id UUID NULL REFERENCES app.appointments(id) ON DELETE RESTRICT,
    attending_doctor_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    visit_date TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    chief_complaint TEXT NOT NULL,
    clinical_notes TEXT NOT NULL,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    locked_at TIMESTAMPTZ NULL,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.clinical_record_vitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinical_record_id UUID NOT NULL REFERENCES app.clinical_records(id) ON DELETE RESTRICT,
    weight_kg NUMERIC(5,2) NULL,
    temperature_c NUMERIC(4,2) NULL,
    heart_rate_bpm INT NULL,
    respiratory_rate_bpm INT NULL,
    mucous_membrane VARCHAR(50) NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.clinical_diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinical_record_id UUID NOT NULL REFERENCES app.clinical_records(id) ON DELETE RESTRICT,
    diagnosis_code VARCHAR(50) NULL,
    diagnosis_name VARCHAR(255) NOT NULL,
    prognosis VARCHAR(50) NULL,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE app.treatment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinical_record_id UUID NOT NULL REFERENCES app.clinical_records(id) ON DELETE RESTRICT,
    prescribed_by_doctor_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    order_type VARCHAR(30) NOT NULL CHECK (order_type IN ('medication', 'procedure', 'test', 'fluid')),
    order_description TEXT NOT NULL,
    dosage_instructions TEXT NOT NULL,
    is_executed BOOLEAN NOT NULL DEFAULT FALSE,
    executed_by_nurse_id UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    executed_at TIMESTAMPTZ NULL,
    execution_notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinical_record_id UUID NOT NULL REFERENCES app.clinical_records(id) ON DELETE RESTRICT,
    prescribed_by_doctor_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    instructions TEXT NOT NULL,
    is_dispensed BOOLEAN NOT NULL DEFAULT FALSE,
    dispensed_by UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    dispensed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.clinical_amendments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinical_record_id UUID NOT NULL REFERENCES app.clinical_records(id) ON DELETE RESTRICT,
    amended_by_doctor_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    amendment_reason TEXT NOT NULL,
    amended_content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);
```

#### Nhóm Lưu viện & Bản tin Y khoa (6 Bảng - SOLVING H1, R-2, R-7, S-8)
```sql
CREATE TABLE app.cages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cage_zone_id UUID NOT NULL REFERENCES app.cage_zones(id) ON DELETE RESTRICT,
    cage_code VARCHAR(30) NOT NULL UNIQUE,
    cage_size VARCHAR(20) NOT NULL CHECK (cage_size IN ('small', 'medium', 'large', 'run')),
    is_operational BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE app.inpatient_stays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES app.pets(id) ON DELETE RESTRICT,
    cage_id UUID NOT NULL REFERENCES app.cages(id) ON DELETE RESTRICT,
    admission_date TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    discharge_date TIMESTAMPTZ NULL,
    attending_doctor_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    admission_reason TEXT NOT NULL,
    discharge_summary TEXT NULL,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.inpatient_daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inpatient_stay_id UUID NOT NULL REFERENCES app.inpatient_stays(id) ON DELETE RESTRICT,
    logged_by_nurse_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    food_intake VARCHAR(50) NOT NULL,
    water_intake VARCHAR(50) NOT NULL,
    urination VARCHAR(50) NOT NULL,
    defecation VARCHAR(50) NOT NULL,
    mental_state VARCHAR(50) NOT NULL,
    weight_kg NUMERIC(5,2) NULL,
    temperature_c NUMERIC(4,2) NULL,
    care_notes TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.pet_medical_bulletins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES app.pets(id) ON DELETE RESTRICT,
    inpatient_stay_id UUID NULL REFERENCES app.inpatient_stays(id) ON DELETE RESTRICT,
    status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published', 'revoked')),
    title VARCHAR(200) NOT NULL,
    public_content TEXT NOT NULL,             -- Chỉ tóm tắt ngôn từ thân thiện, KHÔNG chứa tên hoạt chất / y lệnh
    doctor_notes TEXT NULL,                   -- Ghi chú nội bộ
    created_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    approved_by UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    approved_at TIMESTAMPTZ NULL,
    published_at TIMESTAMPTZ NULL,
    revoked_at TIMESTAMPTZ NULL,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.inpatient_daily_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inpatient_stay_id UUID NOT NULL REFERENCES app.inpatient_stays(id) ON DELETE RESTRICT,
    bulletin_id UUID NULL REFERENCES app.pet_medical_bulletins(id) ON DELETE SET NULL, -- R-7 FIX: Ràng buộc trực tiếp với bản tin
    uploaded_by_user_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    storage_path TEXT NOT NULL,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video')),
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    approved_by_doctor_id UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    approved_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    CONSTRAINT chk_media_approval CHECK (
        (is_approved = FALSE AND approved_by_doctor_id IS NULL AND approved_at IS NULL) OR
        (is_approved = TRUE AND approved_by_doctor_id IS NOT NULL AND approved_at IS NOT NULL)
    )
);

CREATE TABLE app.bulletin_approval_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- S-8 FIX: Triệt tiêu CASCADE, thay bằng ON DELETE RESTRICT bảo vệ lịch sử phê duyệt y khoa
    bulletin_id UUID NOT NULL REFERENCES app.pet_medical_bulletins(id) ON DELETE RESTRICT,
    action VARCHAR(30) NOT NULL CHECK (action IN ('submitted_for_review', 'approved', 'published', 'revoked', 'reset_to_draft')),
    performed_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    duty_context VARCHAR(30) NOT NULL DEFAULT 'on_shift',
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);
```

#### Nhóm Kho Dược, Vật tư & Hóa đơn (7 Bảng - SOLVING N-4, N-5, S-4, S-5, P2-K, P2-M)
```sql
CREATE TABLE app.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_system VARCHAR(30) NULL,
    source_sku VARCHAR(50) NULL,
    barcode VARCHAR(50) NULL,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Thuốc', 'Vaccine', 'Dinh dưỡng', 'Vật tư y tế', 'Phụ kiện', 'Thức ăn', 'Vệ sinh & Chăm sóc', 'Khác')),
    unit VARCHAR(30) NOT NULL,
    retail_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    requires_batch_tracking BOOLEAN NOT NULL DEFAULT FALSE,
    -- S-4 / T-4 FIX: Mặc định TRUE cho thuốc/vật tư y tế; suy diễn FALSE cho bán lẻ qua Trigger
    requires_clinical_hiding BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,        -- T-2 FIX: Hỗ trợ Safe Rollback & Re-import
    import_job_id UUID NULL,
    rollback_job_id UUID NULL,                -- S-5 FIX: Hỗ trợ Safe Rollback
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_system VARCHAR(30) NULL,
    source_service_code VARCHAR(50) NULL,
    service_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Khám & Điều trị', 'Phẫu thuật', 'Tiêm phòng', 'Xét nghiệm & Chẩn đoán hình ảnh', 'Lưu viện', 'Spa - Làm đẹp', 'Khác')),
    standard_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    -- S-4 / T-4 FIX: Mặc định TRUE cho dịch vụ y khoa; suy diễn FALSE cho Spa qua Trigger
    requires_clinical_hiding BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,        -- T-2 FIX: Hỗ trợ Safe Rollback & Re-import
    import_job_id UUID NULL,
    rollback_job_id UUID NULL,                -- S-5 FIX: Hỗ trợ Safe Rollback
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.inventory_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES app.products(id) ON DELETE RESTRICT,
    batch_number VARCHAR(50) NOT NULL,        -- Nếu thiếu trong file nhập, sinh mã nội bộ UNKNOWN-<job>-<row>
    batch_number_status VARCHAR(20) NOT NULL DEFAULT 'verified' CHECK (batch_number_status IN ('verified', 'unverified')),
    expiry_date DATE NULL,                    -- Cho phép NULL nếu không có trong file gốc, tuyệt đối không bịa
    expiry_status VARCHAR(20) NOT NULL DEFAULT 'valid' CHECK (expiry_status IN ('valid', 'near_expiry', 'expired', 'unknown')),
    quantity_on_hand NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    initial_quantity NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'near_expiry', 'expired', 'quarantined', 'depleted')),
    import_job_id UUID NULL,
    rollback_job_id UUID NULL,                -- S-5 FIX: Hỗ trợ Safe Rollback
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    CONSTRAINT uq_product_batch UNIQUE (product_id, batch_number)
);

CREATE TABLE app.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES app.inventory_batches(id) ON DELETE RESTRICT,
    -- S-5 FIX: Bổ sung 'return_receipt' cho giao dịch nhập hàng hoàn trả từ khách
    transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN ('import_receipt', 'sale_dispatch', 'medical_use', 'import_rollback', 'inventory_adjustment', 'quarantine_transfer', 'return_receipt')),
    quantity NUMERIC(10,2) NOT NULL,
    reference_id UUID NULL,                   -- ID hóa đơn hoặc ID lượt khám
    performed_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_system VARCHAR(30) NULL,
    source_invoice_code VARCHAR(50) NULL,
    customer_id UUID NULL REFERENCES app.customers(id) ON DELETE RESTRICT, -- N-5: Cho phép NULL tạm thời nếu thiếu mã khách
    appointment_id UUID NULL REFERENCES app.appointments(id) ON DELETE RESTRICT,
    invoice_date TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    subtotal_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00, -- N-5: Bổ sung subtotal đối soát
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partially_paid', 'paid', 'refunded', 'cancelled')),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    import_job_id UUID NULL,
    rollback_job_id UUID NULL,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES app.invoices(id) ON DELETE RESTRICT,
    item_type VARCHAR(30) NOT NULL CHECK (item_type IN ('clinical_service', 'retail_product', 'spa_service', 'product', 'service', 'return_product', 'discount_adjustment')), -- U-2 FIX
    product_id UUID NULL REFERENCES app.products(id) ON DELETE RESTRICT,
    service_id UUID NULL REFERENCES app.services(id) ON DELETE RESTRICT,
    item_name VARCHAR(255) NOT NULL,
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1.00,
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    is_clinical_hidden BOOLEAN NOT NULL DEFAULT TRUE, -- Mặc định ẩn dòng thuốc kê đơn/vật tư điều trị
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,        -- U-2 FIX: Hỗ trợ Safe Rollback & đồng bộ hóa đơn
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE app.invoice_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES app.invoices(id) ON DELETE RESTRICT,
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'credit_card', 'e_wallet', 'legacy_import')),
    amount_paid NUMERIC(12,2) NOT NULL,
    paid_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    received_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    reference_code VARCHAR(100) NULL,
    notes TEXT NULL
);

-- D-09 FIX: Bảng Lưu Trữ Bền Vững Số Dư Điểm Tích Lũy GPet Lịch Sử (Không Bị Xóa Sau 14 Ngày)
CREATE TABLE app.historical_loyalty_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NULL REFERENCES app.customers(id) ON DELETE SET NULL,
    source_system VARCHAR(30) NOT NULL DEFAULT 'gpet',
    source_customer_code VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255) NULL,
    customer_phone VARCHAR(50) NULL,
    accumulated_points NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    import_job_id UUID NULL REFERENCES staging.import_jobs(id) ON DELETE SET NULL,
    rollback_job_id UUID NULL REFERENCES staging.import_jobs(id) ON DELETE SET NULL, -- V-2 FIX: Hỗ trợ Safe Rollback
    is_locked BOOLEAN NOT NULL DEFAULT TRUE, -- D-09: Khóa số dư, tuyệt đối không tự động quy đổi voucher
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE, -- V-2 FIX: Xóa mềm khi hoàn tác đợt nhập dữ liệu
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    CONSTRAINT uq_historical_loyalty_points UNIQUE (source_system, source_customer_code)
);

-- T-4 & U-4 FIX: Hàm & Trigger Tự Động Suy Diễn Che Giấu Dữ Liệu Lâm Sàng (Tra Cứu Catalog Trước, Chống Bypass)
CREATE OR REPLACE FUNCTION app.fn_derive_invoice_item_clinical_hiding()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_req_hide BOOLEAN := TRUE;
    v_category VARCHAR(50);
BEGIN
    -- U-4 FIX: Kiểm tra trực tiếp catalog sản phẩm/dịch vụ TRƯỚC, không tin item_type do client gửi lên
    IF NEW.product_id IS NOT NULL THEN
        SELECT requires_clinical_hiding, category INTO v_req_hide, v_category
        FROM app.products WHERE id = NEW.product_id;

        -- Fail-safe: Nếu là thuốc/vật tư y tế, is_clinical_hidden BẮT BUỘC là TRUE
        NEW.is_clinical_hidden := COALESCE(v_req_hide, TRUE);
        IF v_category IN ('Phụ kiện', 'Thức ăn', 'Vệ sinh & Chăm sóc', 'Dinh dưỡng') THEN
            NEW.item_type := 'retail_product';
        ELSE
            NEW.item_type := 'product';
        END IF;

    ELSIF NEW.service_id IS NOT NULL THEN
        SELECT requires_clinical_hiding, category INTO v_req_hide, v_category
        FROM app.services WHERE id = NEW.service_id;

        NEW.is_clinical_hidden := COALESCE(v_req_hide, TRUE);
        IF v_category = 'Spa - Làm đẹp' THEN
            NEW.item_type := 'spa_service';
        ELSE
            NEW.item_type := 'clinical_service';
        END IF;

    -- Dòng chiết khấu hoặc hoàn trả theo giao dịch bán lẻ
    ELSIF NEW.item_type IN ('return_product', 'discount_adjustment') THEN
        NEW.is_clinical_hidden := FALSE;
    ELSE
        -- V-5 / Fail-safe tuyệt đối: Mọi dòng tự do không có catalog product/service bắt buộc mặc định ẩn (is_clinical_hidden = TRUE)
        -- Ngăn chặn triệt để nguy cơ bypass qua item_type từ client khi không có sản phẩm/dịch vụ từ catalog
        NEW.is_clinical_hidden := TRUE;
    END IF;

    -- Bảo vệ cờ is_clinical_hidden khi UPDATE trực tiếp qua REST API (chỉ cho phép qua RPC đặc quyền)
    IF TG_OP = 'UPDATE' THEN
        IF NEW.is_clinical_hidden IS DISTINCT FROM OLD.is_clinical_hidden 
           AND current_setting('app.allow_visibility_toggle', true) IS DISTINCT FROM 'on' THEN
            NEW.is_clinical_hidden := OLD.is_clinical_hidden;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_invoice_item_clinical_hiding
BEFORE INSERT OR UPDATE ON app.invoice_items
FOR EACH ROW EXECUTE FUNCTION app.fn_derive_invoice_item_clinical_hiding();

CREATE OR REPLACE FUNCTION app.fn_derive_product_clinical_hiding()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.category IN ('Phụ kiện', 'Thức ăn', 'Vệ sinh & Chăm sóc', 'Dinh dưỡng') THEN
        NEW.requires_clinical_hiding := FALSE;
    ELSE
        NEW.requires_clinical_hiding := TRUE; -- Thuốc, Vaccine, Vật tư y tế, Khác
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_derive_product_clinical_hiding
BEFORE INSERT OR UPDATE OF category ON app.products
FOR EACH ROW EXECUTE FUNCTION app.fn_derive_product_clinical_hiding();

CREATE OR REPLACE FUNCTION app.fn_derive_service_clinical_hiding()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.category = 'Spa - Làm đẹp' THEN
        NEW.requires_clinical_hiding := FALSE;
    ELSE
        NEW.requires_clinical_hiding := TRUE; -- Khám, Phẫu thuật, Tiêm phòng, Xét nghiệm, Lưu viện, Khác
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_derive_service_clinical_hiding
BEFORE INSERT OR UPDATE OF category ON app.services
FOR EACH ROW EXECUTE FUNCTION app.fn_derive_service_clinical_hiding();
```

#### Nhóm Staging Import Center (4 Bảng - SOLVING R-3, N-2, S-8)
```sql
CREATE TABLE staging.import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_hash_sha256 VARCHAR(64) NOT NULL,
    source_system VARCHAR(30) NOT NULL,       -- 'gpet', 'generic_excel', 'generic_csv'
    target_entity VARCHAR(30) NOT NULL,       -- 'customers', 'products', 'services', 'inventory', 'invoices'
    total_rows INT NOT NULL DEFAULT 0,
    valid_rows INT NOT NULL DEFAULT 0,
    error_rows INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'uploaded' 
           CHECK (status IN ('uploaded', 'parsing', 'parsed', 'validating', 'validated', 'awaiting_approval', 'approved', 'committing', 'committed', 'rolled_back', 'failed', 'cancelled')),
    uploaded_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    approved_by UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    approved_at TIMESTAMPTZ NULL,
    committed_at TIMESTAMPTZ NULL,
    rolled_back_at TIMESTAMPTZ NULL,
    cancelled_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    -- R-3 FIX: Ràng buộc Two-Man Rule tại mức CSDL (Người duyệt bắt buộc khác người tải lên)
    CONSTRAINT chk_two_man_approval CHECK (
        approved_by IS NULL OR approved_by <> uploaded_by
    )
);

-- S-8 FIX: Khai báo Foreign Key rõ ràng cho các bảng nghiệp vụ tham chiếu staging.import_jobs
ALTER TABLE app.customers ADD CONSTRAINT fk_customers_import_job FOREIGN KEY (import_job_id) REFERENCES staging.import_jobs(id) ON DELETE SET NULL;
ALTER TABLE app.pets ADD CONSTRAINT fk_pets_import_job FOREIGN KEY (import_job_id) REFERENCES staging.import_jobs(id) ON DELETE SET NULL;
ALTER TABLE app.products ADD CONSTRAINT fk_products_import_job FOREIGN KEY (import_job_id) REFERENCES staging.import_jobs(id) ON DELETE SET NULL;
ALTER TABLE app.services ADD CONSTRAINT fk_services_import_job FOREIGN KEY (import_job_id) REFERENCES staging.import_jobs(id) ON DELETE SET NULL;
ALTER TABLE app.inventory_batches ADD CONSTRAINT fk_batches_import_job FOREIGN KEY (import_job_id) REFERENCES staging.import_jobs(id) ON DELETE SET NULL;
ALTER TABLE app.invoices ADD CONSTRAINT fk_invoices_import_job FOREIGN KEY (import_job_id) REFERENCES staging.import_jobs(id) ON DELETE SET NULL;

CREATE TABLE staging.import_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_job_id UUID NOT NULL REFERENCES staging.import_jobs(id) ON DELETE CASCADE,
    row_index INT NOT NULL,
    raw_data JSONB NOT NULL,
    parsed_data JSONB NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'valid', 'error', 'skipped')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE staging.import_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_job_id UUID NOT NULL REFERENCES staging.import_jobs(id) ON DELETE CASCADE,
    row_index INT NOT NULL,
    column_name VARCHAR(100) NOT NULL,
    error_code VARCHAR(50) NOT NULL,
    error_message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'error' CHECK (severity IN ('error', 'warning')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE staging.import_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_system VARCHAR(30) NOT NULL,
    entity_type VARCHAR(30) NOT NULL,
    mapping_profile_name VARCHAR(100) NOT NULL,
    column_mappings JSONB NOT NULL,           -- Cấu trúc: {"Tên KH": "full_name", "Số ĐT": "phone_number"}
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    CONSTRAINT uq_mapping_profile UNIQUE (source_system, entity_type, mapping_profile_name)
);

CREATE TABLE audit.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL,         -- 'LOGIN', 'MFA_VERIFY', 'IMPORT_COMMIT', 'IMPORT_ROLLBACK', 'MEDIA_APPROVE'
    target_entity VARCHAR(50) NOT NULL,
    target_id UUID NULL,
    duty_context VARCHAR(30) NULL,            -- 'on_shift', 'emergency_override', 'off_shift_admin_override'
    ip_address_hash VARCHAR(64) NULL,         -- SHA-256 ẩn danh
    changes JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);
```

---

### 3. Triggers Tự Động Tăng Version & Updated_At (Solving J2, S-8)

```sql
-- S-8 FIX: Bỏ SECURITY DEFINER không cần thiết trên trigger function
CREATE OR REPLACE FUNCTION app.fn_increment_version_and_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.version := COALESCE(OLD.version, 1) + 1;
    NEW.updated_at := CLOCK_TIMESTAMP();
    RETURN NEW;
END;
$$;

-- Gắn Trigger cho các bảng nghiệp vụ cốt lõi
CREATE TRIGGER trg_customers_version
BEFORE UPDATE ON app.customers
FOR EACH ROW EXECUTE FUNCTION app.fn_increment_version_and_updated_at();

CREATE TRIGGER trg_products_version
BEFORE UPDATE ON app.products
FOR EACH ROW EXECUTE FUNCTION app.fn_increment_version_and_updated_at();

CREATE TRIGGER trg_services_version
BEFORE UPDATE ON app.services
FOR EACH ROW EXECUTE FUNCTION app.fn_increment_version_and_updated_at();

CREATE TRIGGER trg_invoices_version
BEFORE UPDATE ON app.invoices
FOR EACH ROW EXECUTE FUNCTION app.fn_increment_version_and_updated_at();

CREATE TRIGGER trg_inventory_batches_version
BEFORE UPDATE ON app.inventory_batches
FOR EACH ROW EXECUTE FUNCTION app.fn_increment_version_and_updated_at();

CREATE TRIGGER trg_pets_version
BEFORE UPDATE ON app.pets
FOR EACH ROW EXECUTE FUNCTION app.fn_increment_version_and_updated_at();

CREATE TRIGGER trg_clinical_records_version
BEFORE UPDATE ON app.clinical_records
FOR EACH ROW EXECUTE FUNCTION app.fn_increment_version_and_updated_at();
```

---

### 4. Danh Mục 12 Partial Indexes Bắt Buộc (11 Unique + 1 Non-Unique Tra Cứu — Solving P1-E, H3, R-3, N-6, S-8)
Hệ thống định nghĩa 12 chỉ mục một phần (partial indexes) phục vụ ràng buộc toàn vẹn và tối ưu hiệu năng: gồm **11 Partial Unique Indexes** và **1 Partial Non-Unique Index** (`idx_customers_phone_lookup`) tối ưu hóa tra cứu số điện thoại mà không ép UNIQUE (triệt để tuân thủ P1-E và S-8).

```sql
-- 1. Chỉ duy nhất 1 liên kết pending giữa 1 customer và 1 user
CREATE UNIQUE INDEX uq_customer_user_pending 
ON app.customer_user_links (customer_id, user_id) 
WHERE (link_status = 'pending');

-- 2. Chỉ duy nhất 1 liên kết verified giữa 1 customer và 1 user
CREATE UNIQUE INDEX uq_customer_user_verified 
ON app.customer_user_links (customer_id, user_id) 
WHERE (link_status = 'verified');

-- 3. CHỈ MỤC TRA CỨU SĐT KHÔNG UNIQUE (SOLVING P1-E: Cho phép người thân dùng chung số / số tái cấp)
CREATE INDEX idx_customers_phone_lookup 
ON app.customers (phone_number) 
WHERE (is_deleted = FALSE);

-- 4. Mã khách hàng theo nguồn duy nhất (T-2 FIX: Loại trừ bản ghi đã xóa mềm để cho phép import lại sau rollback)
CREATE UNIQUE INDEX uq_customer_source_code 
ON app.customers (source_system, source_customer_code) 
WHERE (source_customer_code IS NOT NULL AND is_deleted = FALSE);

-- 5. Mã thú cưng theo nguồn duy nhất (T-2 FIX: Loại trừ bản ghi đã xóa mềm để cho phép import lại sau rollback)
CREATE UNIQUE INDEX uq_pet_source_code 
ON app.pets (source_system, source_pet_code) 
WHERE (source_pet_code IS NOT NULL AND is_deleted = FALSE);

-- 6. Mỗi chuồng chỉ có tối đa 1 lượt nội trú đang hoạt động
CREATE UNIQUE INDEX uq_active_cage_occupancy 
ON app.inpatient_stays (cage_id) 
WHERE (discharge_date IS NULL);

-- 7. Mỗi thú cưng chỉ có tối đa 1 lượt nội trú đang hoạt động
CREATE UNIQUE INDEX uq_active_pet_inpatient 
ON app.inpatient_stays (pet_id) 
WHERE (discharge_date IS NULL);

-- 8. Mã SKU sản phẩm duy nhất theo nguồn (T-2 FIX: Loại trừ bản ghi đã xóa mềm để cho phép import lại sau rollback)
CREATE UNIQUE INDEX uq_product_source_sku 
ON app.products (source_system, source_sku) 
WHERE (source_sku IS NOT NULL AND is_deleted = FALSE);

-- 9. Mỗi thú cưng chỉ có tối đa 1 bản tin y khoa draft hoặc review đang chờ duyệt
CREATE UNIQUE INDEX uq_pet_pending_bulletin 
ON app.pet_medical_bulletins (pet_id) 
WHERE (status IN ('draft', 'review'));

-- 10. Mã hóa đơn duy nhất theo nguồn (T-2 FIX: Loại trừ bản ghi đã xóa mềm để cho phép import lại sau rollback)
CREATE UNIQUE INDEX uq_invoice_source_code 
ON app.invoices (source_system, source_invoice_code) 
WHERE (source_invoice_code IS NOT NULL AND is_deleted = FALSE);

-- 11. Checksum tệp import duy nhất cho các job đang xử lý hoặc thành công (R-3 FIX: Cho phép retry khi failed/cancelled)
CREATE UNIQUE INDEX uq_import_job_checksum_active 
ON staging.import_jobs (file_hash_sha256) 
WHERE (status NOT IN ('failed', 'cancelled', 'rolled_back'));

-- 12. Idempotency Key duy nhất cho yêu cầu đặt lịch khách vãng lai (N-6 FIX: Chống gửi đúp form)
CREATE UNIQUE INDEX uq_guest_booking_idempotency 
ON app.guest_booking_requests (idempotency_key) 
WHERE (idempotency_key IS NOT NULL);
```

---
## IV. XỬ LÝ DỮ LIỆU NHẬP KHÔNG GHÉP KHÁCH BẰNG SỐ ĐIỆN THOẠI (SOLVING P1-B, P1-E, G5, H3, G16)

### 1. Phân Định Rạch Ròi 3 Phân Hệ Nghiệp Vụ Độc Lập
Để giải quyết dứt điểm các lỗi logic P1-B và P1-E, hệ thống phân định tuyệt đối ranh giới giữa 3 luồng tiếp nhận:

| Phân hệ Nghiệp vụ | Bảng Dữ liệu Quản lý | Đối tượng Thực hiện | Ràng buộc Xác thực & Bảo mật |
| :--- | :--- | :--- | :--- |
| **1. Lịch hẹn Khám Y khoa** | `app.appointments` + `app.medical_appointments` | Tiếp tân quầy hoặc Khách hàng Portal | Bắt buộc chọn Thú cưng cụ thể; có Bác sĩ phụ trách, phân loại Triage lâm sàng và liên kết trực tiếp vào Hồ sơ bệnh án. |
| **2. Dịch vụ Spa & Làm đẹp** | `app.appointments` (`appointment_type = 'spa'`) | Tiếp tân hoặc Nhân viên Spa | Phục vụ tắm, tỉa lông, vệ sinh; **tuyệt đối không tạo hồ sơ bệnh án y khoa**, không cấp phát thuốc kê đơn. |
| **3. Yêu cầu Đặt hẹn Web Công khai** | `app.guest_booking_requests` | Khách vãng lai trên Internet | Là dữ liệu tiền kiểm tra (staging request); bắt buộc xác thực Bot Token & Idempotency; tự động xóa sau 30 ngày (chỉ xóa các yêu cầu đã xử lý hoặc rác). Tiếp tân phải gọi điện xác minh trước khi tạo Lịch hẹn chính thức. |

---

### 2. Thuật Toán Nhận Diện Khách Hàng Không Ghép Nối Bằng Số Điện Thoại (Solving P1-E, G5)

#### A. Phân Tích Rủi Ro Nghiệp Vụ Y Tế
Trong thực tế xã hội tại Việt Nam:
1. **Dùng chung số điện thoại:** Vợ chồng, bố mẹ - con cái, hoặc bạn cùng phòng trọ thường đăng ký chung một số điện thoại khi đưa các thú cưng khác nhau đi khám hoặc mua đồ phụ kiện tại phòng khám.
2. **Số điện thoại bị nhà mạng tái cấp (Recycled Phone Numbers):** Khách hàng cũ bỏ số sau 3–6 tháng; nhà mạng thu hồi và phát hành lại cho chủ thuê bao mới. Nếu hệ thống tự động gom gộp theo SĐT, toàn bộ lịch sử khám bệnh, hóa đơn và thông tin thú cưng của chủ cũ sẽ bị rò rỉ cho chủ thuê bao mới.
3. **Trùng lặp tên gọi:** Khách hàng khác nhau có thể trùng tên hoặc viết tắt khác nhau trong tệp Excel kế thừa.

#### B. Quy Tắc Định Danh Bất Biến (P1-E Invariant)
1. **Khóa Định Danh Duy Nhất:** Khách hàng được định danh duy nhất bởi **`app.customers.id` (UUID)**. Đối với dữ liệu nhập từ Excel/hệ thống cũ, cặp `(source_system, source_customer_code)` là khóa duy nhất theo nguồn.
2. **Số điện thoại KHÔNG PHẢI Khóa Duy Nhất:** Xóa bỏ chỉ mục duy nhất trên số điện thoại. Cho phép nhiều hàng trong `app.customers` có cùng số điện thoại.
3. **SĐT + Họ tên chỉ là Gợi ý Đối soát:** Khi nhập tệp hoặc tiếp nhận tại quầy, hệ thống so khớp SĐT và họ tên đã chuẩn hóa (`normalized_name`) để **cảnh báo và gợi ý** cho nhân viên, tuyệt đối không tự động sáp nhập dữ liệu.
4. **Tách Biệt Tuyệt Đối Tài Khoản Portal:** Tài khoản đăng ký trên website (`auth.users` / `app.users`) không tự động liên kết với bất kỳ hồ sơ khách hàng nào trong `app.customers`, kể cả khi số điện thoại trùng khớp hoàn toàn.

---

## V. ĐẶC TẢ CHI TIẾT GENERIC EXCEL/CSV IMPORT CENTER (SOLVING P1-C, H2, H3, H7, J1, J2, G4, N-2, N-5, S-5, S-6, S-7, R-1, R-3, P2-K)

### 1. Kiến Trúc An Toàn Tệp Tải Lên & Worker Sandbox Thực Tế (Solving N-2, S-6, S-7)

Để khắc phục triệt để các rủi ro an ninh tệp và xác lập mô hình mạng thực tế:

```
[ Client Upload (.xlsx / .csv) ]
                |
                v
+----------------------------------------------------------------------------------------------------+
| LỚP 1: KIỂM TRA ĐẦU VÀO TẠI EDGE / GATEWAY (PRE-FLIGHT VALIDATION)                                 |
| - Kiểm tra Kích thước: Max 10MB per file.                                                          |
| - Kiểm tra Phần mở rộng: Chỉ cho phép .xlsx, .csv (CHẶN TUYỆT ĐỐI .xlsm, .xlsb, .xltm, .exe).      |
| - Kiểm tra MIME Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv  |
| - Kiểm tra Magic Bytes:                                                                            |
|   * XLSX: Bắt buộc 4 bytes đầu là "50 4B 03 04" (PK Zip Header chuẩn).                            |
|   * CSV: Plaintext UTF-8 / UTF-16 có BOM hợp lệ.                                                  |
+----------------------------------------------------------------------------------------------------+
                | (Nếu hợp lệ -> Lưu tạm vào Private Sandbox Volume)
                v
+----------------------------------------------------------------------------------------------------+
| LỚP 2: CÔ LẬP TIẾN TRÌNH PARSER (ISOLATED WORKER 1 SANDBOX - SOLVING S-6)                          |
| - Firewall Outbound: DEFAULT-DENY OUTBOUND KÈM ALLOWLIST CHỈ ĐỊNH (Solving S-6):                   |
|   * Chỉ cho phép kết nối tới: <project-ref>.supabase.co:443 (Storage) và db.*:5432/6543 (Postgres).|
|   * CHẶN HOÀN TOÀN MỌI KẾT NỐI INTERNET RA NGOÀI KHÁC (Chống rò rỉ dữ liệu qua C2 / Exfiltration).  |
| - Least-Privilege Database Role: Kết nối qua 'import_worker_role' CHỈ CÓ QUYỀN TRÊN SCHEMA staging |
|   (REVOKE ALL ON app, audit, public FROM import_worker_role).                                      |
| - cgroup Resource Cap: Giới hạn 1.5GB RAM, 1 vCPU, Timeout 60 giây per job.                       |
| - Anti-ZIP Bomb: Kiểm tra tỷ lệ giải nén không vượt quá 1:20 (Max 200MB uncompressed).             |
| - Anti-XXE: Parser XML cấu hình cấm External DTD (disallow-doctype-decl = true).                   |
| - Anti-Macro: Quét cấu trúc ZIP, nếu phát hiện luồng "vbaProject.bin" -> LẬP TỨC HỦY VÀ BÁO ĐỘNG.   |
| - Giới hạn Kích thước Bảng tính: Tối đa 10 sheets per workbook, tối đa 10,000 dòng per job.       |
+----------------------------------------------------------------------------------------------------+
                | (Phân tích cú pháp dữ liệu từng dòng thô)
                v
+----------------------------------------------------------------------------------------------------+
| LỚP 3: KHỬ NHIỄM NỘI DUNG THEO THỨ TỰ CHUẨN XÁC (SOLVING S-7)                                      |
| - THỨ TỰ XỬ LÝ (Solving S-7):                                                                      |
|   1. Bước 1: Parse và validate các cột kiểu số (quantity, price) và số điện thoại (+84...).        |
|      BẢO TOÀN NGUYÊN VẸN SỐ LƯỢNG ÂM (VD: -2 cho dòng trả hàng) và SỐ ĐT QUỐC TẾ (+8497...).        |
|   2. Bước 2: CHỈ ÁP DỤNG KHỬ FORMULA INJECTION cho các cột TEXT TỰ DO (full_name, address, notes)  |
|      bắt đầu bằng '=', '+', '-', '@', '\t', '\r' -> tự động chèn tiền tố nháy đơn "'" trước khi ghi |
|      vào staging.import_rows.raw_data JSONB.                                                       |
| - Che giấu PII trong Báo cáo Lỗi: Số điện thoại bị che (091****678), địa chỉ bị ẩn số nhà.        |
+----------------------------------------------------------------------------------------------------+
```

---

### 2. Từ Điển Ánh Xạ Cột Chuẩn Hóa Cho 6 Phân Hệ (Mapping Dictionary - Solving R-1)

| Phân hệ Thực thể | Tên Cột Thường Gặp Trong File Nguồn | Kiểu Dữ Liệu | Trường CSDL Đích (`app.*`) | Ràng buộc Xác thực & Quy tắc Nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- |
| **1. Khách Hàng** | Mã KH, Mã khách, Customer Code | String (Max 50) | `source_customer_code` | Tùy chọn; duy nhất theo nguồn cùng job. |
| | Tên khách, Họ tên, Tên chủ nuôi | String (Max 100) | `full_name` | **Bắt buộc**; tự động sinh `normalized_name`. |
| | Điện thoại, Số ĐT, SĐT, Phone | String (Max 15) | `phone_number` | **Bắt buộc**; chuẩn hóa định dạng số điện thoại VN (10 chữ số). |
| | Địa chỉ, Nơi ở, Address | String | `address` | Tùy chọn; che giấu trong báo cáo lỗi xuất file. |
| **2. Thú Cưng** | Tên thú cưng, Tên Pet, Tên con | String (Max 100) | `pets.name` | **Bắt buộc**; không rỗng. |
| | Giống loài, Loài, Species | String (30) | `pets.species` | **Bắt buộc**; ánh xạ về `'dog'`, `'cat'`, hoặc `'other'`. |
| | Giống, Breed | String (100) | `pets.breed` | Tùy chọn (VD: Poodle, Corgi, Mèo Anh lông ngắn). |
| | Giới tính, Gender | String (10) | `pets.gender` | Ánh xạ về `'male'`, `'female'`, `'unknown'`. |
| | Ngày sinh, Tuổi, DOB | Date (YYYY-MM-DD)| `pets.date_of_birth` | Tùy chọn; ngày sinh không được ở tương lai. |
| **3. Sản Phẩm** | Mã SKU, Mã vạch, Barcode | String (Max 50) | `source_sku` | **Bắt buộc**; duy nhất theo nguồn. |
| | Tên sản phẩm, Tên thuốc | String (Max 255) | `product_name` | **Bắt buộc**; không rỗng. |
| | Phân loại, Nhóm hàng, Loại SP | String (50) | `category` | **Bắt buộc**; tự động suy diễn `requires_clinical_hiding`. |
| | Đơn vị tính, ĐVT, Unit | String (Max 30) | `unit` | **Bắt buộc** (Viên, Hộp, Ống, Chai, Gói, Cái). |
| | Giá bán, Đơn giá bán | Numeric (12,2) | `retail_price` | **Bắt buộc**; giá trị $\ge 0$. |
| | Theo dõi lô, Cần số lô (Y/N) | Boolean | `requires_batch_tracking` | Mặc định TRUE cho thuốc/vaccine; FALSE cho phụ kiện. |
| **4. Dịch Vụ** | Mã DV, Mã dịch vụ | String (Max 50) | `source_service_code` | **Bắt buộc**; duy nhất theo nguồn. |
| | Tên dịch vụ | String (Max 255) | `service_name` | **Bắt buộc**; không rỗng. |
| | Nhóm dịch vụ, Loại DV | String (50) | `category` | **Bắt buộc**; tự động suy diễn `requires_clinical_hiding`. |
| | Giá chuẩn, Đơn giá | Numeric (12,2) | `standard_price` | **Bắt buộc**; giá trị $\ge 0$. |
| **5. Tồn Kho** | Mã SKU | String (Max 50) | `product_id` (via SKU) | **Bắt buộc**; phải tham chiếu đến sản phẩm hợp lệ. |
| | Số lô, Lô sản xuất, Batch | String (Max 50) | `batch_number` | Nếu thiếu: sinh mã `'UNKNOWN-<job>-<row>'`. |
| | Hạn dùng, HSD, Expiry Date | Date (YYYY-MM-DD)| `expiry_date` | Nếu thiếu: gán `NULL` kèm `expiry_status = 'unknown'`. |
| | Số lượng tồn, Số lượng nhập | Numeric (10,2) | `initial_quantity` | **Bắt buộc**; số lượng nhập $\ge 0$. |
| **6. Hóa Đơn** | Mã hóa đơn, Số HĐ, Invoice No | String (Max 50) | `source_invoice_code` | **Bắt buộc**; duy nhất theo nguồn. |
| | Ngày lập, Ngày HĐ, Date | Timestamptz | `invoice_date` | **Bắt buộc**; không được vượt quá ngày hiện tại. |
| | Mã khách hàng, SĐT khách | String (Max 50) | `customer_id` | Nếu không tìm thấy: đưa vào `STAGING_AMBIGUOUS_INVOICE`. |
| | Tiền hàng, Tổng tiền trước giảm | Numeric (12,2) | `subtotal_amount` | **Bắt buộc**; đối soát toán học với chi tiết dòng. |
| | Giảm giá, Chiết khấu | Numeric (12,2) | `discount_amount` | Tùy chọn; mặc định 0. |
| | Tổng thanh toán, Thành tiền | Numeric (12,2) | `total_amount` | Bắt buộc đối soát: `total_amount = subtotal - discount`. |
| | Chi tiết dòng, Tên món, Mã SP | String / Array | `invoice_items` | Hỗ trợ dòng bán lẻ và dòng trả hàng (Return Item). |

---

### 3. Quy Tắc Nghiệp Vụ Hóa Đơn Nhập Liệu & Đối Soát Toán Học (Solving N-5)

1. **Đối Soát Toán Học Bắt Buộc (Math Reconciliation):**
   Mỗi hóa đơn trong tệp nhập phải vượt qua công thức kiểm tra:
   $$\text{total\_amount} = \text{subtotal\_amount} - \text{discount\_amount}$$
   $$\text{subtotal\_amount} = \sum (\text{quantity} \times \text{unit\_price})$$
   Nếu độ lệch toán học vượt quá $1.000\text{ đ}$ (sai số làm tròn), dòng hóa đơn lập tức bị đánh dấu lỗi `INVOICE_TOTAL_MISMATCH` và giữ lại ở hàng đợi staging.
2. **Quy Tắc All-or-Nothing Theo Từng Hóa Đơn:**
   Nếu một hóa đơn có 5 dòng chi tiết, trong đó có 1 dòng tham chiếu đến sản phẩm không xác định được SKU, **toàn bộ hóa đơn đó bị tạm dừng**, không chèn một nửa dòng thành công.
3. **Hỗ Trợ Dòng Trả Hàng & Hoàn Tiền (Return Lines):**
   Hệ thống hỗ trợ dòng trả hàng với `item_type = 'return_product'` hoặc `quantity < 0`. Khi ghi nhận dòng này, tổng tiền hóa đơn được giảm trừ tương ứng và thẻ kho được ghi nhận giao dịch `transaction_type = 'return_receipt'`.
4. **Hóa Đơn Không Rõ Danh Tính Khách Hàng (Ambiguous Customers):**
   Nếu hóa đơn trong tệp nguồn không có mã khách hàng hoặc số điện thoại không khớp với bất kỳ ai, hóa đơn được lưu trữ với `customer_id = NULL` và đưa vào giao diện đối soát để Tiếp tân gán thủ công qua RPC `rpc_assign_invoice_customer`.
5. **Trạng Thái Thanh Toán Mặc Định:**
   Nếu tệp nhập không có cột thể hiện thời gian và hình thức thanh toán thực tế, hệ thống **mặc định gán trạng thái `unpaid`**, tuyệt đối không tự bịa thông tin thanh toán.

---

### 4. Xử Lý Số Lô Nội Bộ & Hạn Dùng Kho Dược Trung Thực (Solving H7, P2-K)

1. **Xử lý Thiếu Số Lô:** Hệ thống tự động sinh mã theo dõi nội bộ duy nhất dạng `'UNKNOWN-' || SUBSTRING(p_job_id::TEXT, 1, 8) || '-' || LPAD(p_row_index::TEXT, 4, '0')` kèm `batch_number_status = 'unverified'`, chống xung đột ràng buộc `UNIQUE (product_id, batch_number)`.
2. **Xử lý Thiếu Hạn Sử Dụng:** Lưu trữ `expiry_date = NULL` kèm `expiry_status = 'unknown'`.
3. **Rào Chắn Khóa Cách Ly:** Mọi lô hàng thiếu HSD hoặc chưa xác minh số lô tự động nhận trạng thái `status = 'quarantined'`. RPC xuất kho `rpc_dispatch_inventory` từ chối xuất bán nếu lô hàng chưa được kiểm đếm và giải phóng cách ly qua `rpc_verify_inventory_batch`.

---

### 5. Hàm Kiểm Tra Điều Kiện Hoàn Tác (`app.validate_job_rollback` - Solving H2, J1, J2)

```sql
CREATE OR REPLACE FUNCTION app.validate_job_rollback(p_job_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_clinical_count INT := 0;
    v_stays_count INT := 0;
    v_active_appointments_count INT := 0;
    v_active_links_count INT := 0;
    v_new_invoices_count INT := 0;
    v_stock_consumed_count INT := 0;
    v_modified_records_count INT := 0;
    v_consents_count INT := 0;
    v_errors JSONB := '[]'::jsonb;
BEGIN
    -- 1. Chốt chặn 1 (J1 Fix): Kiểm tra hồ sơ bệnh án lâm sàng gắn với BẤT KỲ thú cưng nào của khách thuộc job
    SELECT COUNT(*) INTO v_clinical_count
    FROM app.clinical_records cr
    JOIN app.pets p ON p.id = cr.pet_id
    JOIN app.customers c ON c.id = p.customer_id
    WHERE c.import_job_id = p_job_id OR p.import_job_id = p_job_id;

    IF v_clinical_count > 0 THEN
        v_errors := v_errors || jsonb_build_object(
            'code', 'CLINICAL_RECORDS_EXIST',
            'count', v_clinical_count,
            'message', 'Đã phát sinh hồ sơ bệnh án khám chữa bệnh gắn với khách hàng hoặc thú cưng trong đợt nhập.'
        );
    END IF;

    -- 2. Chốt chặn 2 (J1 Fix): Kiểm tra ca lưu viện nội trú gắn với thú cưng của khách thuộc job
    SELECT COUNT(*) INTO v_stays_count
    FROM app.inpatient_stays s
    JOIN app.pets p ON p.id = s.pet_id
    JOIN app.customers c ON c.id = p.customer_id
    WHERE c.import_job_id = p_job_id OR p.import_job_id = p_job_id;

    IF v_stays_count > 0 THEN
        v_errors := v_errors || jsonb_build_object(
            'code', 'INPATIENT_STAYS_EXIST',
            'count', v_stays_count,
            'message', 'Đã phát sinh lượt lưu viện nội trú gắn với khách hàng hoặc thú cưng trong đợt nhập.'
        );
    END IF;

    -- 3. Chốt chặn 3: Kiểm tra lịch hẹn chưa hoàn tất của khách thuộc job
    SELECT COUNT(*) INTO v_active_appointments_count
    FROM app.appointments a
    JOIN app.customers c ON c.id = a.customer_id
    WHERE (c.import_job_id = p_job_id OR a.customer_id IN (SELECT id FROM app.customers WHERE import_job_id = p_job_id))
      AND a.status NOT IN ('cancelled', 'no_show');

    IF v_active_appointments_count > 0 THEN
        v_errors := v_errors || jsonb_build_object(
            'code', 'ACTIVE_APPOINTMENTS_EXIST',
            'count', v_active_appointments_count,
            'message', 'Có khách hàng trong đợt nhập đang có lịch hẹn khám chưa hoàn tất.'
        );
    END IF;

    -- 4. Chốt chặn 4: Kiểm tra tài khoản Portal đã liên kết của khách thuộc job
    SELECT COUNT(*) INTO v_active_links_count
    FROM app.customer_user_links cul
    JOIN app.customers c ON c.id = cul.customer_id
    WHERE c.import_job_id = p_job_id AND cul.link_status IN ('verified', 'pending');

    IF v_active_links_count > 0 THEN
        v_errors := v_errors || jsonb_build_object(
            'code', 'ACTIVE_USER_LINKS_EXIST',
            'count', v_active_links_count,
            'message', 'Khách hàng trong đợt nhập đã kích hoạt tài khoản Cổng khách hàng.'
        );
    END IF;

    -- 5. Chốt chặn 5 (J1 Fix): Kiểm tra hóa đơn mới phát sinh tại quầy của khách thuộc job
    SELECT COUNT(*) INTO v_new_invoices_count
    FROM app.invoices inv
    JOIN app.customers c ON c.id = inv.customer_id
    WHERE c.import_job_id = p_job_id AND (inv.import_job_id IS DISTINCT FROM p_job_id);

    IF v_new_invoices_count > 0 THEN
        v_errors := v_errors || jsonb_build_object(
            'code', 'NEW_INVOICES_EXIST',
            'count', v_new_invoices_count,
            'message', 'Khách hàng trong đợt nhập đã phát sinh hóa đơn giao dịch mới tại phòng khám.'
        );
    END IF;

    -- 6. Chốt chặn 6: Kiểm tra phiếu đồng thuận y khoa đã ký
    SELECT COUNT(*) INTO v_consents_count
    FROM app.pet_medical_consents pmc
    JOIN app.customers c ON c.id = pmc.customer_id
    WHERE c.import_job_id = p_job_id;

    IF v_consents_count > 0 THEN
        v_errors := v_errors || jsonb_build_object(
            'code', 'MEDICAL_CONSENTS_EXIST',
            'count', v_consents_count,
            'message', 'Khách hàng trong đợt nhập đã ký giấy cam kết / đồng thuận y khoa.'
        );
    END IF;

    -- 7. Chốt chặn 7: Kiểm tra tồn kho đã bị xuất tiêu hao lâm sàng hoặc bán lẻ
    SELECT COUNT(*) INTO v_stock_consumed_count
    FROM app.inventory_transactions it
    JOIN app.inventory_batches ib ON ib.id = it.batch_id
    WHERE ib.import_job_id = p_job_id AND it.transaction_type IN ('sale_dispatch', 'medical_use');

    IF v_stock_consumed_count > 0 THEN
        v_errors := v_errors || jsonb_build_object(
            'code', 'STOCK_ALREADY_CONSUMED',
            'count', v_stock_consumed_count,
            'message', 'Lô kho nhập về đã phát sinh giao dịch xuất thuốc điều trị hoặc bán hàng.'
        );
    END IF;

    -- 8. Chốt chặn 8 (J2 Fix): Kiểm tra dữ liệu bị chỉnh sửa thủ công sau import (version > 1)
    SELECT COUNT(*) INTO v_modified_records_count
    FROM (
        SELECT id FROM app.invoices WHERE import_job_id = p_job_id AND version > 1
        UNION ALL
        SELECT id FROM app.products WHERE import_job_id = p_job_id AND version > 1
        UNION ALL
        SELECT id FROM app.services WHERE import_job_id = p_job_id AND version > 1
        UNION ALL
        SELECT id FROM app.customers WHERE import_job_id = p_job_id AND version > 1
        UNION ALL
        SELECT id FROM app.pets WHERE import_job_id = p_job_id AND version > 1
        UNION ALL
        SELECT id FROM app.inventory_batches WHERE import_job_id = p_job_id AND version > 1
    ) sub;

    IF v_modified_records_count > 0 THEN
        v_errors := v_errors || jsonb_build_object(
            'code', 'RECORDS_MODIFIED_MANUALLY',
            'count', v_modified_records_count,
            'message', 'Đã có bản ghi bị nhân viên chỉnh sửa thông tin sau khi import (version > 1).'
        );
    END IF;

    -- Tổng kết quyết định
    IF jsonb_array_length(v_errors) > 0 THEN
        RETURN jsonb_build_object('can_rollback', FALSE, 'blocking_reasons', v_errors);
    ELSE
        RETURN jsonb_build_object('can_rollback', TRUE, 'blocking_reasons', '[]'::jsonb);
    END IF;
END;
$$;
```

---

### 6. Thực Thi Hoàn Tác An Toàn — Full SQL Implementation (Solving S-5)

RPC `app.rpc_import_rollback_job` thực thi quy trình hoàn tác nguyên tử "Tất cả hoặc không", hỗ trợ đầy đủ các thực thể Khách hàng, Thú cưng, Sản phẩm, Dịch vụ, Tồn kho và Hóa đơn:

```sql
CREATE OR REPLACE FUNCTION app.rpc_import_rollback_job(p_job_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_validation JSONB;
    v_batch RECORD;
BEGIN
    -- 1. Yêu cầu quyền Quản trị viên (Admin) có MFA AAL2
    IF NOT app.check_active_shift(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Chỉ Quản trị viên mới có quyền hoàn tác đợt nhập dữ liệu.';
    END IF;

    IF (auth.jwt()->>'aal') IS DISTINCT FROM 'aal2' THEN
        RAISE EXCEPTION 'MFA_REQUIRED: Thao tác Rollback bắt buộc xác thực hai bước AAL2.';
    END IF;

    -- 2. S-5 FIX: Khóa dòng Job bằng FOR UPDATE trong cùng Transaction để chống Race Condition
    PERFORM 1 FROM staging.import_jobs WHERE id = p_job_id AND status = 'committed' FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'JOB_NOT_COMMITTED: Đợt nhập không tồn tại hoặc chưa ở trạng thái committed.';
    END IF;

    -- 3. Gọi hàm kiểm tra 8 chốt chặn an toàn
    v_validation := app.validate_job_rollback(p_job_id);
    IF (v_validation->>'can_rollback')::BOOLEAN = FALSE THEN
        RAISE EXCEPTION 'ROLLBACK_BLOCKED: Giao dịch hoàn tác bị hủy bỏ do phát sinh dữ liệu lâm sàng/vận hành: %', v_validation->'blocking_reasons';
    END IF;

    -- 4. S-5 FIX: Thực thi hoàn tác an toàn theo từng loại thực thể:
    -- A. Hóa đơn: Xóa mềm và ghi nhận mã rollback
    UPDATE app.invoices 
    SET is_deleted = TRUE, rollback_job_id = p_job_id, updated_at = CLOCK_TIMESTAMP()
    WHERE import_job_id = p_job_id;

    -- B. Tồn kho: Chèn thẻ kho đối ứng 'import_rollback' cho các lô còn tồn (>0) và chuyển lô sang 'depleted'
    -- T-5 FIX: Kiểm tra quantity_on_hand > 0 để tránh chèn giao dịch -0 vô nghĩa
    FOR v_batch IN SELECT id, quantity_on_hand FROM app.inventory_batches WHERE import_job_id = p_job_id LOOP
        IF v_batch.quantity_on_hand > 0 THEN
            INSERT INTO app.inventory_transactions (batch_id, transaction_type, quantity, performed_by, notes)
            VALUES (v_batch.id, 'import_rollback', -v_batch.quantity_on_hand, auth.uid(), 'Hoàn tác tự động theo Job #' || p_job_id);
        END IF;

        UPDATE app.inventory_batches 
        SET quantity_on_hand = 0, status = 'depleted', rollback_job_id = p_job_id, updated_at = CLOCK_TIMESTAMP()
        WHERE id = v_batch.id;
    END LOOP;

    -- C. Khách hàng & Thú cưng: Xóa mềm an toàn
    UPDATE app.pets 
    SET is_deleted = TRUE, updated_at = CLOCK_TIMESTAMP()
    WHERE import_job_id = p_job_id;

    UPDATE app.customers 
    SET is_deleted = TRUE, updated_at = CLOCK_TIMESTAMP()
    WHERE import_job_id = p_job_id;

    -- D. Chi tiết hóa đơn: Xóa mềm đồng bộ với hóa đơn cha
    UPDATE app.invoice_items
    SET is_deleted = TRUE, updated_at = CLOCK_TIMESTAMP()
    WHERE invoice_id IN (SELECT id FROM app.invoices WHERE import_job_id = p_job_id);

    -- E. Sản phẩm & Dịch vụ: Xóa mềm (is_deleted = TRUE, is_active = FALSE) để cho phép import lại cùng SKU (T-2 FIX)
    UPDATE app.products 
    SET is_deleted = TRUE, is_active = FALSE, rollback_job_id = p_job_id, updated_at = CLOCK_TIMESTAMP()
    WHERE import_job_id = p_job_id;

    UPDATE app.services 
    SET is_deleted = TRUE, is_active = FALSE, rollback_job_id = p_job_id, updated_at = CLOCK_TIMESTAMP()
    WHERE import_job_id = p_job_id;

    -- F. V-2 FIX: Điểm tích lũy lịch sử GPet: Xóa mềm an toàn và ghi nhận rollback_job_id
    UPDATE app.historical_loyalty_points
    SET is_deleted = TRUE, rollback_job_id = p_job_id, updated_at = CLOCK_TIMESTAMP()
    WHERE import_job_id = p_job_id;

    -- 5. Cập nhật trạng thái Job
    UPDATE staging.import_jobs 
    SET status = 'rolled_back', rolled_back_at = CLOCK_TIMESTAMP()
    WHERE id = p_job_id;

    -- 6. Ghi nhật ký kiểm toán bất biến
    INSERT INTO audit.audit_logs (actor_id, action_type, target_entity, target_id, duty_context, changes)
    VALUES (
        auth.uid(),
        'IMPORT_ROLLBACK',
        'import_jobs',
        p_job_id,
        'on_shift',
        jsonb_build_object('job_id', p_job_id, 'rolled_back_at', CLOCK_TIMESTAMP())
    );

    RETURN TRUE;
END;
$$;

-- U-5 FIX: Mã SQL Đầy Đủ Cho RPC Duyệt Đợt Nhập Dữ Liệu (Two-Man Rule & Admin AAL2)
-- V-1 & V-7 FIX: Đặc tả Quy trình Nhập liệu & Full SQL Hàm Phê Duyệt Đợt Nhập (Chuẩn hóa Two-Man Rule, Admin AAL2 & Status Transition)
-- 1. Hàm Phân Tích Tệp & Chuyển Đổi Vùng Đệm (rpc_import_parse_file Pseudocode / Specification):
--    - Worker sandbox phân tích tệp Excel/CSV từ Storage, kiểm tra magic bytes, giải nén không vượt quá 50MB.
--    - Chuyển đổi dòng tệp vào staging.import_rows, ghi nhận lỗi định dạng vào staging.import_errors.
--    - Cập nhật staging.import_jobs: status chuyển từ 'uploaded' -> 'parsing' -> 'parsed' (hoặc 'failed' nếu lỗi tệp nghiêm trọng).
--
-- 2. Hàm Chạy Thử Nghiệm Kiểm Tra Hợp Lệ (rpc_import_execute_dry_run Pseudocode / Specification):
--    - Quét toàn bộ staging.import_rows: đối soát mã danh mục (catalog), kiểm tra trùng lặp, tính toàn vẹn khóa ngoại.
--    - Cập nhật staging.import_jobs: status chuyển từ 'parsed' -> 'validating' -> 'validated'.
--    - Nếu 100% dòng hợp lệ hoặc không có lỗi chặn (blocking errors): chuyển status sang 'awaiting_approval' (Sẵn sàng chờ phê duyệt).
--
-- 3. Full SQL Hàm Phê Duyệt Đợt Nhập (rpc_import_approve_job):
CREATE OR REPLACE FUNCTION app.rpc_import_approve_job(
    p_job_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_job RECORD;
    v_actor_id UUID;
BEGIN
    v_actor_id := auth.uid();
    IF v_actor_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Người dùng chưa đăng nhập.';
    END IF;

    -- 1. V-1 FIX: Kiểm tra quyền Quản trị viên (Admin) qua bảng phân quyền staff_role_assignments
    -- Nhân sự "Quản lý phòng khám" được ánh xạ vào vai trò kỹ thuật 'admin' trong staff_role_assignments
    IF NOT app.check_active_shift(v_actor_id, 'admin') THEN
        RAISE EXCEPTION 'FORBIDDEN: Chỉ Quản trị viên trong ca trực hiệu lực mới có quyền phê duyệt đợt nhập dữ liệu.';
    END IF;

    -- 2. Bắt buộc xác thực hai bước AAL2 (Ràng buộc D-06)
    IF (auth.jwt()->>'aal') IS DISTINCT FROM 'aal2' THEN
        RAISE EXCEPTION 'MFA_REQUIRED: Thao tác phê duyệt đợt nhập bắt buộc xác thực hai bước AAL2.';
    END IF;

    -- 3. Khóa dòng Job và kiểm tra trạng thái hợp lệ
    SELECT * INTO v_job FROM staging.import_jobs WHERE id = p_job_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'JOB_NOT_FOUND: Không tìm thấy đợt nhập #%.', p_job_id;
    END IF;

    -- V-1 FIX: Đồng bộ điều kiện kiểm tra trạng thái khớp 100% với ràng buộc CHECK staging.import_jobs.status
    IF v_job.status <> 'awaiting_approval' THEN
        RAISE EXCEPTION 'INVALID_JOB_STATUS: Đợt nhập phải ở trạng thái chờ duyệt (awaiting_approval) mới được duyệt (trạng thái hiện tại: %).', v_job.status;
    END IF;

    -- 4. Thực thi Two-Man Rule bất biến tại CSDL (Ràng buộc D-07 & chk_two_man_approval)
    IF v_job.uploaded_by = v_actor_id THEN
        RAISE EXCEPTION 'TWO_MAN_RULE_VIOLATION: Người phê duyệt (%) không được trùng với người tải lên đợt nhập (%).', v_actor_id, v_job.uploaded_by;
    END IF;

    -- 5. Cập nhật trạng thái duyệt thành công
    UPDATE staging.import_jobs
    SET status = 'approved',
        approved_by = v_actor_id,
        approved_at = CLOCK_TIMESTAMP()
    WHERE id = p_job_id;

    -- 6. Ghi nhật ký kiểm toán bất biến
    INSERT INTO audit.audit_logs (actor_id, action_type, target_entity, target_id, duty_context, changes)
    VALUES (
        v_actor_id,
        'IMPORT_JOB_APPROVED',
        'import_jobs',
        p_job_id,
        'on_shift',
        jsonb_build_object(
            'job_id', p_job_id,
            'uploaded_by', v_job.uploaded_by,
            'approved_by', v_actor_id,
            'approved_at', CLOCK_TIMESTAMP()
        )
    );

    RETURN TRUE;
END;
$$;

-- 4. Hàm Chốt Dữ Liệu Vào Bảng Nghiệp Vụ Chính Thức (rpc_import_commit_job Pseudocode / Specification):
--    - Yêu cầu Quản trị viên (Admin) có MFA AAL2.
--    - Khóa staging.import_jobs FOR UPDATE; kiểm tra status = 'approved'.
--    - Cập nhật status = 'committing'.
--    - Đọc staging.import_rows và chèn nguyên tử vào các bảng app.* tương ứng (customers, products, services, inventory, invoices, historical_loyalty_points).
--    - Cập nhật status = 'committed', committed_at = CLOCK_TIMESTAMP(). Ghi nhật ký kiểm toán bất biến.

```

---

### 7. Bốn Màn Hình Giao Diện Generic Import Center (UI Wireframes)

#### Màn hình 1: File Upload & Auto-Mapping Preview
```
+----------------------------------------------------------------------------------------------------+
| TRUNG TÂM NHẬP DỮ LIỆU EXCEL / CSV - BỆNH VIỆN THÚ Y LÊ SƠN                                        |
+----------------------------------------------------------------------------------------------------+
| 1. TẢI LÊN TỆP NGUỒN (KIỂM TRA AN NINH: MAX 10MB, CẤM MACRO .XLSM, MAGIC BYTES 50 4B 03 04)       |
|    [ Kéo thả tệp .xlsx hoặc .csv vào đây ] Hoặc [ Chọn tệp từ máy tính ]                           |
|    Tệp đã chọn: DanhSachKhachHang_2026.xlsx (Kích thước: 1.4 MB - 1,250 dòng)                     |
|    Hệ thống nguồn: [ Generic Excel v ]    Thực thể đích: [ Khách hàng & Thú cưng v ]              |
|                                                                                                    |
| 2. CẤU HÌNH ÁNH XẠ CỘT (COLUMN MAPPING)                                                            |
|    Hồ sơ ánh xạ: [ Mẫu mặc định Khách hàng Lê Sơn v ]   [ Lưu thành mẫu mới ]                     |
|    +-----------------------------+-----------------------+-----------------------+---------------+  |
|    | Cột trong Tệp Excel         | Kiểu Dữ Liệu Phát Hiện| Trường CSDL Đích      | Trạng Thái    |  |
|    +-----------------------------+-----------------------+-----------------------+---------------+  |
|    | Mã KH cũ                    | Văn bản (String)      | source_customer_code  | [ Đã khớp v ] |  |
|    | Tên chủ nuôi                | Văn bản (String)      | full_name             | [ Đã khớp v ] |  |
|    | Điện thoại                  | Số điện thoại (Phone) | phone_number          | [ Đã khớp v ] |  |
|    | Địa chỉ                     | Văn bản (String)      | address               | [ Đã khớp v ] |  |
|    | Tên thú cưng                | Văn bản (String)      | pets.name             | [ Đã khớp v ] |  |
|    | Giống loài                  | Văn bản (Chó/Mèo)     | pets.species          | [ Đã khớp v ] |  |
|    +-----------------------------+-----------------------+-----------------------+---------------+  |
|    [ Huỷ bỏ ]                                                  [ Tiếp tục: Chạy Kiểm Tra (Dry-run) ]|
+----------------------------------------------------------------------------------------------------+
```

#### Màn hình 2: Dry-run Validation & Error Inspector
```
+----------------------------------------------------------------------------------------------------+
| KẾT QUẢ KIỂM TRA DỮ LIỆU (DRY-RUN VALIDATION) - JOB #JOB-8841                                      |
+----------------------------------------------------------------------------------------------------+
| Tổng số dòng: 1,250  | Hợp lệ: 1,242 dòng (99.3%) | Cảnh báo: 5 dòng | Lỗi chặn: 3 dòng            |
| Trạng thái: [ YÊU CẦU SỬA LỖI TRƯỚC KHI DUYỆT ]                                                   |
|                                                                                                    |
| DANH SÁCH CHI TIẾT LỖI DỮ LIỆU (PII MASKED):                                                       |
| +------+--------------+-----------------------+----------------------------------+---------------+  |
| | Dòng | Cột          | Giá Trị Gốc (Ẩn danh) | Mô Tả Lỗi / Cảnh Báo             | Mức Độ        |  |
| +------+--------------+-----------------------+----------------------------------+---------------+  |
| | 42   | phone_number | "0912-***-XYZ"        | Sai định dạng số điện thoại VN   | [ LỖI CHẶN ]  |  |
| | 108  | species      | "Chuột túi"           | Loài không hỗ trợ (chỉ chó/mèo)  | [ LỖI CHẶN ]  |  |
| | 255  | phone_number | "0988***655" (Trùng)  | Trùng SĐT với Nguyễn Văn A (D.12)| [ CẢNH BÁO ]  |  |
| | 312  | date_of_birth| "31/02/2023"          | Ngày sinh không hợp lệ           | [ LỖI CHẶN ]  |  |
| +------+--------------+-----------------------+----------------------------------+---------------+  |
| [ Tải tệp Excel báo cáo lỗi (3 dòng) ]              [ Bỏ qua 3 dòng lỗi & Tiếp tục với 1,247 dòng ]|
+----------------------------------------------------------------------------------------------------+
```

#### Màn hình 3: Multi-Party Approval & Conflict Resolution
```
+----------------------------------------------------------------------------------------------------+
| PHÊ DUYỆT ĐỢT NHẬP DỮ LIỆU & XỬ LÝ XUNG ĐỘT (JOB #JOB-8841)                                        |
+----------------------------------------------------------------------------------------------------+
| Người tải lên: Nguyễn Văn B (Tiếp tân) vào lúc 09:15 05/11/2026                                    |
| Quy tắc Hai người phê duyệt (Two-Man Rule): Bắt buộc Quản lý hoặc Bác sĩ trưởng phê duyệt          |
| (Ràng buộc CSDL: Người duyệt bắt buộc khác người tải lên - chk_two_man_approval)                   |
|                                                                                                    |
| HÀNG ĐỢI XỬ LÝ KHÁCH HÀNG CÙNG SĐT NHƯNG KHÁC HỌ TÊN (5 trường hợp):                               |
| Trường hợp 1/5:                                                                                    |
| SĐT: 0988.***.655                                                                                  |
| - Hồ sơ trong CSDL hiện tại: Trần Thị B (Mã: KH-00129) - 1 Thú cưng (Chó Poodle Milu)              |
| - Bản ghi mới trong tệp:   Lê Hoàng C (Mã nguồn: GP-9941) - 1 Thú cưng (Mèo Anh Miu)               |
|                                                                                                    |
| Lựa chọn xử lý:                                                                                    |
| (•) [KHUYẾN NGHỊ - P1-E] TẠO HỒ SƠ KHÁCH MỚI RIÊNG BIỆT (Cho phép 2 khách độc lập dùng chung SĐT)  |
| ( ) Gộp mèo Miu vào hồ sơ của Trần Thị B (Yêu cầu xác nhận văn bản từ chủ nuôi tại quầy)           |
|                                                                                                    |
| [ ] Tôi đã đối soát kỹ lưỡng và chịu trách nhiệm pháp lý về tính xác thực của đợt dữ liệu này.    |
|                                                                                                    |
| [ Từ chối đợt nhập ]                                    [ PHÊ DUYỆT & TIẾN HÀNH COMMIT (MFA AAL2) ]|
+----------------------------------------------------------------------------------------------------+
```

#### Màn hình 4: Post-Import Reconciliation & Rollback Center
```
+----------------------------------------------------------------------------------------------------+
| ĐỐI SOÁT SAU NHẬP & TRUNG TÂM HOÀN TÁC (RECONCILIATION & ROLLBACK)                                 |
+----------------------------------------------------------------------------------------------------+
| Mã Job: JOB-8841  | Trạng thái: [ COMMITTED VÀO CSDL VẬN HÀNH ]                                    |
| Thời gian hoàn thành: 09:30 05/11/2026  | Người duyệt: Bs. Lê Sơn (Quản lý)                        |
|                                                                                                    |
| KẾT QUẢ ĐỐI SOÁT THỰC THỂ CSDL:                                                                    |
| - Khách hàng mới tạo: 1,247 hồ sơ (origin = 'excel')                                               |
| - Thú cưng mới tạo:   1,310 hồ sơ                                                                  |
| - Hóa đơn lịch sử:    4,520 hóa đơn (Đã đối soát toán học khớp subtotal - discount = total)         |
|                                                                                                    |
| KIỂM TRA ĐIỀU KIỆN AN TOÀN HOÀN TÁC (SAFE ROLLBACK GUARD):                                         |
| [v] Chốt 1: Bệnh án phát sinh sau nhập:   0 hồ sơ (Đạt điều kiện)                                  |
| [v] Chốt 2: Lượt lưu viện phát sinh:      0 ca    (Đạt điều kiện)                                  |
| [v] Chốt 3: Lịch hẹn đang hoạt động:      0 lịch  (Đạt điều kiện)                                  |
| [v] Chốt 4: Tài khoản Portal liên kết:    0 link  (Đạt điều kiện)                                  |
| [v] Chốt 5: Chỉnh sửa thủ công sau nhập:  0 bản ghi (version = 1)                                  |
|                                                                                                    |
| CẢNH BÁO: Thao tác Hoàn tác sẽ xóa mềm toàn bộ 1,247 khách hàng và dữ liệu đi kèm của Job này.     |
| [ XUẤT BÁO CÁO ĐỐI SOÁT PDF ]                              [ YÊU CẦU HOÀN TÁC ĐỢT NHẬP (ROLLBACK) ]|
+----------------------------------------------------------------------------------------------------+
```

---

## VI. KHÔI PHỤC WORKFLOW DUYỆT BẤT BIẾN, INPATIENT MEDIA & CHECK-OFF Y LỆNH (SOLVING H1, R-5, R-7, S-8, S-9, G3, G7, G11, G16)

### 1. Cỗ Máy Trạng Thái 5 Bước của Bản Tin Y Khoa & Lịch Sử Phê Duyệt
Quy trình phát hành bản tin cập nhật tình hình thú cưng cho khách hàng tuân thủ nghiêm ngặt 5 trạng thái bất biến:

$$\text{Draft} \xrightarrow{\text{Yêu cầu duyệt}} \text{Review} \xrightarrow{\text{Bác sĩ duyệt}} \text{Approved} \xrightarrow{\text{Phát hành}} \text{Published} \xrightarrow{\text{Thu hồi khẩn cấp}} \text{Revoked}$$

- Bảng `app.bulletin_approval_history` lưu vết bất biến mọi lượt chuyển trạng thái (ràng buộc `ON DELETE RESTRICT` - Solving S-8).
- **Quy tắc Trả về Draft:** Nếu bản tin đang ở trạng thái `approved` hoặc `published` mà có bất kỳ thao tác chỉnh sửa nội dung y khoa nào, Trigger hệ thống **tự động hạ trạng thái về `draft`**, xóa dấu thời gian phê duyệt và bắt buộc Bác sĩ phải duyệt lại từ đầu.

---

### 2. Phê Duyệt Media Lưu Viện & Ràng Buộc Đúng Bản Tin (Solving H1, R-7, S-9)

Hàm `app.authorize_media_access` sử dụng `auth.uid()` trực tiếp (Solving S-9) và bắt buộc media phải gắn với **đúng bản tin y khoa đã được phát hành (`published`)** (Solving R-7):

```sql
CREATE OR REPLACE FUNCTION app.authorize_media_access(p_media_id UUID)
RETURNS TABLE (
    authorized BOOLEAN,
    storage_path TEXT,
    signed_url_ttl_seconds INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_media RECORD;
    v_is_staff BOOLEAN := FALSE;
    v_is_owner BOOLEAN := FALSE;
    v_bulletin_published BOOLEAN := FALSE;
    v_caller_id UUID := auth.uid(); -- S-9 FIX: Sử dụng auth.uid() trực tiếp từ JWT, không tin tham số client
BEGIN
    IF v_caller_id IS NULL THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, 0;
        RETURN;
    END IF;

    -- 1. Lấy thông tin tệp media, ca lưu viện và bản tin đính kèm
    SELECT 
        m.id, 
        m.storage_path, 
        m.is_approved, 
        m.approved_by_doctor_id,
        m.bulletin_id,
        s.pet_id,
        p.customer_id
    INTO v_media
    FROM app.inpatient_daily_media m
    JOIN app.inpatient_stays s ON s.id = m.inpatient_stay_id
    JOIN app.pets p ON p.id = s.pet_id
    WHERE m.id = p_media_id;

    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, 0;
        RETURN;
    END IF;

    -- 2. Kiểm tra xem người gọi có phải nhân viên y tế đang có ca trực
    SELECT (
        app.check_active_shift(v_caller_id, 'doctor') OR 
        app.check_active_shift(v_caller_id, 'nurse') OR
        app.check_active_shift(v_caller_id, 'admin')
    ) INTO v_is_staff;

    IF v_is_staff THEN
        -- S-9: Ghi audit log khi nhân viên y tế truy cập media bệnh nhân
        INSERT INTO audit.audit_logs (actor_id, action_type, target_entity, target_id, duty_context)
        VALUES (v_caller_id, 'STAFF_VIEW_MEDIA', 'inpatient_daily_media', p_media_id, 'on_shift');

        RETURN QUERY SELECT TRUE, v_media.storage_path, 900; -- 15 phút (900 giây)
        RETURN;
    END IF;

    -- 3. Kiểm tra xem người gọi có phải chủ nuôi hợp lệ của đúng thú cưng
    SELECT EXISTS (
        SELECT 1 
        FROM app.customer_user_links cul
        WHERE cul.customer_id = v_media.customer_id
          AND cul.user_id = v_caller_id
          AND cul.link_status = 'verified'
    ) INTO v_is_owner;

    IF NOT v_is_owner THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, 0;
        RETURN;
    END IF;

    -- 4. Bắt buộc: Media phải được Bác sĩ phê duyệt chính thức (chk_media_approval)
    IF NOT v_media.is_approved OR v_media.approved_by_doctor_id IS NULL THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, 0;
        RETURN;
    END IF;

    -- 5. R-7 FIX: Media BẮT BUỘC phải gắn trực tiếp với bản tin y khoa (bulletin_id IS NOT NULL)
    IF v_media.bulletin_id IS NULL THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, 0;
        RETURN;
    END IF;

    -- 6. R-7 FIX: Bản tin đính kèm BẮT BUỘC phải đang ở trạng thái 'published' và cùng thú cưng
    SELECT EXISTS (
        SELECT 1 
        FROM app.pet_medical_bulletins b
        WHERE b.id = v_media.bulletin_id
          AND b.pet_id = v_media.pet_id
          AND b.status = 'published'
    ) INTO v_bulletin_published;

    IF NOT v_bulletin_published THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, 0;
        RETURN;
    END IF;

    -- 7. Đủ toàn bộ điều kiện: Cấp quyền xem qua Signed URL 15 phút
    RETURN QUERY SELECT TRUE, v_media.storage_path, 900;
END;
$$;
```

---

### 3. Check-off Y Lệnh Điều Trị — Full SQL Implementation (Solving G3, R-5)

```sql
CREATE OR REPLACE FUNCTION app.rpc_checkoff_treatment_order(
    p_order_id UUID,
    p_execution_notes TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_order RECORD;
BEGIN
    -- 1. Kiểm tra Điều dưỡng đang trong ca trực hiệu lực
    IF NOT app.check_active_shift(auth.uid(), 'nurse') AND NOT app.check_active_shift(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'SHIFT_REQUIRED: Điều dưỡng phải trong ca trực hiệu lực để check-off y lệnh.';
    END IF;

    -- 2. Khóa dòng y lệnh bằng FOR UPDATE
    SELECT id, is_executed, clinical_record_id
    INTO v_order
    FROM app.treatment_orders
    WHERE id = p_order_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'ORDER_NOT_FOUND: Không tìm thấy y lệnh điều trị.';
    END IF;

    IF v_order.is_executed THEN
        RAISE EXCEPTION 'ORDER_ALREADY_EXECUTED: Y lệnh này đã được thực thi trước đó, không thể check-off lại.';
    END IF;

    -- 3. Cập nhật trạng thái thực thi thời gian thực
    UPDATE app.treatment_orders
    SET is_executed = TRUE,
        executed_by_nurse_id = auth.uid(),
        executed_at = CLOCK_TIMESTAMP(),
        execution_notes = p_execution_notes
    WHERE id = p_order_id;

    -- 4. Ghi vết kiểm toán
    INSERT INTO audit.audit_logs (actor_id, action_type, target_entity, target_id, duty_context, changes)
    VALUES (
        auth.uid(),
        'CHECKOFF_TREATMENT_ORDER',
        'treatment_orders',
        p_order_id,
        'on_shift',
        jsonb_build_object('execution_notes', p_execution_notes, 'executed_at', CLOCK_TIMESTAMP())
    );

    RETURN TRUE;
END;
$$;

```

> [!NOTE]
> **Quy trình Kiểm soát Phê duyệt Hai Người (Two-Man Rule / Dual Approval — Solving D-07):**
> Nhằm bảo đảm tính toàn vẹn dữ liệu và phân tách trách nhiệm (Separation of Duties), thao tác phê duyệt đợt nhập dữ liệu Excel (`import_jobs`) bắt buộc tuân thủ nguyên tắc Two-Man Rule ở tầng CSDL (`approved_by <> uploaded_by`) kết hợp bắt buộc vai trò Quản lý/Quản trị viên và xác thực hai bước AAL2. Hàm triển khai chuẩn mực duy nhất được đặc tả chi tiết tại **Mục V.6 (`app.rpc_import_approve_job`)**.

---

### 4. Ma Trận Phân Quyền RBAC 39 Bảng Dữ Liệu

| Bảng CSDL (39 Bảng - V-2 FIX) | Anon (Public) | Customer (Portal) | Receptionist | Nurse | Doctor | Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `app.users` | DENY | SELF (View) | SELECT | SELECT | SELECT | ALL |
| `app.staff_role_assignments` | DENY | DENY | SELECT | SELECT | SELECT | ALL |
| `app.staff_device_sessions` *(BYO-2)* | DENY | DENY | DENY | DENY | DENY | ALL (Admin only) |
| `app.shifts`, `shift_assignments`, `cage_zones` | DENY | DENY | SELECT | SELF (View) | SELF (View) | ALL |
| `app.customers`, `pets` | DENY | VIA SECURE VIEW | SELECT / INSERT | SELECT | SELECT | ALL |
| `app.customer_user_links`, `user_link_requests` | DENY | SELF (Pending) | SELECT / VERIFY | SELECT | SELECT | ALL |
| `app.pet_medical_consents` | DENY | DENY | SELECT | SELECT | INSERT | ALL |
| `app.appointments`, `medical_appointments` | DENY | SELF (Book/View) | SELECT / INSERT | SELECT | SELECT | ALL |
| `app.guest_booking_requests` | INSERT (Idempotent) | DENY | SELECT / PROCESS | DENY | DENY | ALL |
| `app.clinical_records`, `vitals`, `diagnoses` | DENY | DENY | DENY | SELECT (Active) | SELECT / INSERT | ALL |
| `app.treatment_orders`, `prescriptions` | DENY | DENY | DENY | SELECT / EXECUTE | SELECT / INSERT | ALL |
| `app.clinical_amendments` | DENY | DENY | DENY | DENY | SELECT / INSERT | ALL |
| `app.cages`, `inpatient_stays`, `daily_logs` | DENY | DENY | SELECT | SELECT / LOG | SELECT / INSERT | ALL |
| `app.inpatient_daily_media` | DENY | VIA SIGNED URL | DENY | INSERT (Upload) | SELECT / APPROVE | ALL |
| `app.pet_medical_bulletins`, `approval_history` | DENY | VIA SECURE VIEW | SELECT | SELECT | DRAFT / PUBLISH | ALL |
| `app.products`, `services` | DENY | VIA SECURE VIEW | SELECT | SELECT | SELECT | ALL |
| `app.inventory_batches`, `transactions` | DENY | DENY | SELECT | SELECT | SELECT | ALL |
| `app.invoices`, `invoice_items`, `payments` | DENY | VIA SECURE VIEW | SELECT / INSERT | DENY | DENY | ALL |
| `app.historical_loyalty_points` *(V-2)* | DENY | DENY | DENY | DENY | DENY | ALL (Admin only) |
| `staging.*` (4 bảng) | DENY | DENY | DENY | DENY | DENY | ALL (Admin) |
| `audit.audit_logs` | DENY | DENY | DENY | DENY | DENY | SELECT (Audit) |

> [!NOTE]
> **Quy Tắc Bảo Vệ Phân Quyền Bổ Sung (V-2 & BYO-2 Invariants):**
> 1. **`app.staff_device_sessions`:** Nhân viên tuyệt đối không được cấp quyền `SELECT` trực tiếp bảng này qua PostgREST API nhằm ngăn chặn triệt để nguy cơ trích xuất `session_token_hash` và `device_fingerprint`. Trạng thái phiên thiết bị chỉ được kiểm chứng gián tiếp thông qua hàm kiểm tra tối thiểu `app.rpc_verify_staff_device`.
> 2. **`app.historical_loyalty_points`:** Dữ liệu điểm tích lũy cũ GPet được bảo vệ nghiêm ngặt: mặc định từ chối (`DENY`) toàn bộ truy cập từ khách hàng và nhân viên thông thường, chỉ Quản trị viên (`admin`) mới có quyền truy cập qua endpoint quản trị được bảo vệ; không phơi PII ra ngoài cho đến khi Chủ dự án phê duyệt chính sách tích điểm mới.

---

## VII. XÁC THỰC, KÍCH HOẠT & CỔNG KHÁCH HÀNG TOÀN DIỆN (KHÔI PHỤC TRỌN VẸN — SOLVING S-1, S-2, S-3, S-4)

### 1. Tám Views An Toàn Trong Schema `public` (Customer Safe Views)
Toàn bộ 8 views đều được cấu hình `WITH (security_barrier = true)` và đồng bộ bộ lọc `c.is_deleted = FALSE`:

```sql
-- 1. View Hồ sơ Khách hàng
CREATE OR REPLACE VIEW public.customer_profile_view
WITH (security_barrier = true) AS
SELECT c.id AS customer_id, c.full_name, c.phone_number, c.address, cul.link_status
FROM app.customers c
JOIN app.customer_user_links cul ON cul.customer_id = c.id
WHERE cul.user_id = auth.uid() AND cul.link_status = 'verified' AND c.is_deleted = FALSE;

-- 2. View Danh sách Thú cưng
CREATE OR REPLACE VIEW public.customer_pets_view
WITH (security_barrier = true) AS
SELECT p.id AS pet_id, p.name, p.species, p.breed, p.gender, p.date_of_birth, p.microchip_number
FROM app.pets p
JOIN app.customers c ON c.id = p.customer_id
JOIN app.customer_user_links cul ON cul.customer_id = c.id
WHERE cul.user_id = auth.uid() AND cul.link_status = 'verified' AND p.is_deleted = FALSE AND c.is_deleted = FALSE;

-- 3. View Lịch hẹn Khám & Spa
CREATE OR REPLACE VIEW public.customer_appointments_view
WITH (security_barrier = true) AS
SELECT a.id AS appointment_id, a.pet_id, p.name AS pet_name, a.appointment_type, a.scheduled_at, a.status
FROM app.appointments a
JOIN app.pets p ON p.id = a.pet_id
JOIN app.customers c ON c.id = a.customer_id
JOIN app.customer_user_links cul ON cul.customer_id = c.id
WHERE cul.user_id = auth.uid() AND cul.link_status = 'verified' AND c.is_deleted = FALSE;

-- 4. View Bản tin Sức khỏe & Cập nhật Lưu viện (Chỉ xem bản tin 'published')
CREATE OR REPLACE VIEW public.customer_medical_bulletins_view
WITH (security_barrier = true) AS
SELECT b.id AS bulletin_id, b.pet_id, p.name AS pet_name, b.title, b.public_content, b.published_at
FROM app.pet_medical_bulletins b
JOIN app.pets p ON p.id = b.pet_id
JOIN app.customers c ON c.id = p.customer_id
JOIN app.customer_user_links cul ON cul.customer_id = c.id
WHERE cul.user_id = auth.uid() AND cul.link_status = 'verified' AND b.status = 'published' AND c.is_deleted = FALSE;

-- 5. View Media Lưu viện (Chỉ xem ảnh/video đã được duyệt và gắn đúng bản tin published)
CREATE OR REPLACE VIEW public.customer_inpatient_media_view
WITH (security_barrier = true) AS
SELECT m.id AS media_id, m.inpatient_stay_id, s.pet_id, p.name AS pet_name, m.media_type, m.created_at
FROM app.inpatient_daily_media m
JOIN app.inpatient_stays s ON s.id = m.inpatient_stay_id
JOIN app.pets p ON p.id = s.pet_id
JOIN app.customers c ON c.id = p.customer_id
JOIN app.customer_user_links cul ON cul.customer_id = c.id
JOIN app.pet_medical_bulletins b ON b.id = m.bulletin_id
WHERE cul.user_id = auth.uid() 
  AND cul.link_status = 'verified' 
  AND m.is_approved = TRUE 
  AND b.status = 'published'
  AND c.is_deleted = FALSE;

-- 6. View Hóa đơn Thanh toán
CREATE OR REPLACE VIEW public.customer_invoices_view
WITH (security_barrier = true) AS
SELECT inv.id AS invoice_id, inv.invoice_date, inv.total_amount, inv.status
FROM app.invoices inv
JOIN app.customers c ON c.id = inv.customer_id
JOIN app.customer_user_links cul ON cul.customer_id = c.id
WHERE cul.user_id = auth.uid() AND cul.link_status = 'verified' AND inv.is_deleted = FALSE AND c.is_deleted = FALSE;

-- 7. View Chi tiết Dòng Hóa đơn (TRIỆT TIÊU DÒNG THUỐC KÊ ĐƠN: is_clinical_hidden = FALSE)
CREATE OR REPLACE VIEW public.customer_invoice_items_view
WITH (security_barrier = true) AS
SELECT ii.id AS item_id, ii.invoice_id, ii.item_name, ii.quantity, ii.unit_price, ii.total_price
FROM app.invoice_items ii
JOIN app.invoices inv ON inv.id = ii.invoice_id
JOIN app.customers c ON c.id = inv.customer_id
JOIN app.customer_user_links cul ON cul.customer_id = c.id
WHERE cul.user_id = auth.uid() 
  AND cul.link_status = 'verified' 
  AND ii.is_clinical_hidden = FALSE 
  AND ii.is_deleted = FALSE -- U-2 FIX: Lọc bỏ dòng chi tiết hóa đơn đã xóa mềm
  AND inv.is_deleted = FALSE 
  AND c.is_deleted = FALSE;

-- 8. View Danh mục Dịch vụ Công khai
CREATE OR REPLACE VIEW public.customer_available_services_view
WITH (security_barrier = true) AS
SELECT s.id AS service_id, s.service_name, s.category, s.standard_price
FROM app.services s
WHERE s.is_active = TRUE;
```

---

### 2. Kiến Trúc Phân Quyền & Wrapper API Schema `public` (Solving S-2)

Để tuân thủ tuyệt đối nguyên tắc Schema Isolation (schema `app` không phơi ra PostgREST) và khắc phục hành vi mặc định của PostgreSQL:

#### A. Thu Hồi Toàn Bộ Quyền Mặc Định (REVOKE ALL FROM PUBLIC / anon)
```sql
-- 1. Thu hồi quyền EXECUTE mặc định trên toàn bộ schema public và app
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA app FROM PUBLIC, anon;

-- T-3 FIX: Khóa quyền mặc định toàn cục và theo schema cho role postgres
ALTER DEFAULT PRIVILEGES FOR ROLE postgres REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public, app REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon;

-- 2. Thu hồi quyền SELECT/INSERT/UPDATE/DELETE trên các schema nội bộ
REVOKE ALL ON ALL TABLES IN SCHEMA app FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA staging FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA audit FROM PUBLIC, anon, authenticated;

-- 3. Cấp quyền truy cập tối thiểu trên schema public
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 4. Cấp quyền SELECT trên các Views an toàn cho role 'authenticated'
GRANT SELECT ON public.customer_profile_view TO authenticated;
GRANT SELECT ON public.customer_pets_view TO authenticated;
GRANT SELECT ON public.customer_appointments_view TO authenticated;
GRANT SELECT ON public.customer_medical_bulletins_view TO authenticated;
GRANT SELECT ON public.customer_inpatient_media_view TO authenticated;
GRANT SELECT ON public.customer_invoices_view TO authenticated;
GRANT SELECT ON public.customer_invoice_items_view TO authenticated;

-- View danh mục dịch vụ công khai cho phép cả khách vãng lai (anon) tra cứu giá
GRANT SELECT ON public.customer_available_services_view TO anon, authenticated;
```

#### B. Wrapper Mỏng Trong Schema `public` Cho Client Gọi PostgREST
Mỗi hàm nghiệp vụ nội bộ trong `app.*` được tạo một hàm wrapper tương ứng trong `public.*` với kiểm soát quyền hạn nghiêm ngặt:

```sql
-- Wrapper công khai cho checkoff y lệnh
CREATE OR REPLACE FUNCTION public.rpc_checkoff_treatment_order(
    p_order_id UUID,
    p_execution_notes TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_checkoff_treatment_order(p_order_id, p_execution_notes);
END;
$$;

-- Wrapper công khai cho toggle hiển thị hóa đơn
CREATE OR REPLACE FUNCTION public.rpc_toggle_invoice_item_visibility(
    p_invoice_item_id UUID,
    p_is_hidden BOOLEAN,
    p_reason TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_toggle_invoice_item_visibility(p_invoice_item_id, p_is_hidden, p_reason);
END;
$$;

-- Wrapper công khai cho xử lý số điện thoại tái cấp
CREATE OR REPLACE FUNCTION public.rpc_resolve_recycled_phone(
    p_old_customer_id UUID,
    p_new_customer_id UUID,
    p_new_user_id UUID,
    p_notes TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_resolve_recycled_phone(p_old_customer_id, p_new_customer_id, p_new_user_id, p_notes);
END;
$$;

-- Wrapper công khai cho gán hóa đơn mơ hồ khách
CREATE OR REPLACE FUNCTION public.rpc_assign_invoice_customer(
    p_invoice_id UUID,
    p_customer_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_assign_invoice_customer(p_invoice_id, p_customer_id);
END;
$$;

-- Wrapper công khai cho cấp quyền xem media lưu viện (S-9: Không nhận p_user_id từ client)
CREATE OR REPLACE FUNCTION public.rpc_request_media_signed_url(p_media_id UUID)
RETURNS TABLE (
    authorized BOOLEAN,
    storage_path TEXT,
    signed_url_ttl_seconds INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY SELECT * FROM app.authorize_media_access(p_media_id);
END;
$$;

-- CẤP QUYỀN THỰC THI CHO AUTHENTICATED USERS (CHẶN ĐỨNG ANON)
GRANT EXECUTE ON FUNCTION public.rpc_checkoff_treatment_order TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_toggle_invoice_item_visibility TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_resolve_recycled_phone TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_assign_invoice_customer TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_request_media_signed_url TO authenticated;
```

---

### 3. Danh Mục Toàn Diện API Khách Hàng & API Nhân Viên (Khôi phục S-1, P2-L)

Hệ thống phân định rạch ròi giữa **API Backend Cốt lõi (Phase 4A)** và **Giao diện Người dùng Tương tác (Phase 4B)**:

| Phân nhóm Nghiệp vụ | Danh mục RPCs Backend Cốt lõi (Hoàn thiện Đặc tả Phase 4A) | Thành phần UI Tương tác (Triển khai Phase 4B) |
| :--- | :--- | :--- |
| **API Khách hàng** | 1. `rpc_get_customer_profile()`<br>2. `rpc_get_customer_pets()`<br>3. `rpc_register_customer_pet(p_name, ...)`<br>4. `rpc_create_customer_appointment(p_pet_id, ...)`<br>5. `rpc_cancel_customer_appointment(p_appt_id, ...)`<br>6. `rpc_get_pet_medical_bulletins(p_pet_id)`<br>7. `rpc_request_media_signed_url(p_media_id)`<br>8. `rpc_request_user_link(p_phone, p_name)` | - Mobile Customer Portal PWA.<br>- Form tự khai báo thú cưng.<br>- Trình đặt lịch hẹn trực tuyến.<br>- Gallery xem ảnh/video lưu viện. |
| **Tiếp nhận & Tiếp đón** | 9. `rpc_checkin_appointment(p_appointment_id)`<br>10. `rpc_create_counter_customer(p_phone, p_name, ...)`<br>11. `rpc_create_counter_pet(p_cust_id, p_name, ...)`<br>12. `rpc_resolve_recycled_phone(p_old_id, p_new_id, ...)`<br>13. `rpc_verify_user_link(p_link_id)` | - Wizard tiếp đón bệnh nhân tại quầy tiếp tân.<br>- Modal đối soát CCCD & SĐT chính chủ. |
| **Khám bệnh & Y lệnh** | 14. `rpc_create_clinical_record(p_pet_id, ...)`<br>15. `rpc_update_clinical_record(p_rec_id, ...)`<br>16. `rpc_create_treatment_order(p_rec_id, ...)`<br>17. `rpc_checkoff_treatment_order(p_order_id, ...)`<br>18. `rpc_lock_clinical_record(p_rec_id)`<br>19. `rpc_create_clinical_amendment(p_rec_id, ...)` | - Smart Triage phân loại mức độ cấp cứu.<br>- Form nhập bệnh án điện tử hỗ trợ phím tắt.<br>- Bảng checklist y lệnh điều dưỡng thời gian thực. |
| **Lưu viện & Bản tin** | 20. `rpc_create_inpatient_stay(p_pet_id, p_cage_id, ...)`<br>21. `rpc_record_inpatient_daily_log(p_stay_id, ...)`<br>22. `rpc_create_daily_media(p_stay_id, p_path, ...)`<br>23. `rpc_approve_daily_media(p_media_id)`<br>24. `rpc_revoke_daily_media(p_media_id)`<br>25. `rpc_create_medical_bulletin(p_pet_id, ...)`<br>26. `rpc_submit_bulletin_for_review(p_bulletin_id)`<br>27. `rpc_approve_medical_bulletin(p_bulletin_id)`<br>28. `rpc_publish_medical_bulletin(p_bulletin_id)`<br>29. `rpc_revoke_medical_bulletin(p_bulletin_id)` | - Sơ đồ phân bổ lồng chuồng động (Dynamic Bed Allocation Grid).<br>- Trình soạn thảo bản tin y khoa thân thiện.<br>- Gallery duyệt ảnh/video lưu viện tập trung. |
| **Kho Dược & Vật tư** | 30. `rpc_dispatch_inventory(p_batch_id, p_qty, ...)`<br>31. `rpc_receive_inventory_batch(p_prod_id, ...)`<br>32. `rpc_verify_inventory_batch(p_batch_id, ...)`<br>33. `rpc_quarantine_batch(p_batch_id, p_reason)` | - Bảng quản lý kho dược trực quan kèm cảnh báo HSD màu (Đỏ/Vàng/Xanh).<br>- Máy quét mã vạch xuất/nhập kho. |
| **Thu ngân & Hóa đơn** | 34. `rpc_create_invoice(p_cust_id, p_appt_id)`<br>35. `rpc_add_invoice_item(p_inv_id, p_prod_id, ...)`<br>36. `rpc_toggle_invoice_item_visibility(p_item_id, ...)`<br>37. `rpc_process_invoice_payment(p_inv_id, ...)`<br>38. `rpc_assign_invoice_customer(p_inv_id, ...)` | - Màn hình POS thu ngân chạm cảm ứng.<br>- Tích hợp cổng thanh toán VietQR / ZaloPay. |
| **Ca trực & Nhân sự** | 39. `rpc_assign_staff_shift(p_user_id, p_shift_id, ...)`<br>40. `rpc_check_active_shift(p_user_id, p_role)` | - Lịch phân ca nhân viên dạng kéo thả (Roster Calendar). |
| **Trung tâm Nhập liệu** | 41. `rpc_import_parse_file(p_file_path, ...)`<br>42. `rpc_import_execute_dry_run(p_job_id)`<br>43. `rpc_import_approve_job(p_job_id)`<br>44. `rpc_import_commit_job(p_job_id)`<br>45. `rpc_import_rollback_job(p_job_id)`<br>46. `rpc_resolve_ambiguous_customer(p_row_id, ...)` | - Giao diện kéo thả tệp Excel, thanh tiến trình import và đối soát 4 màn hình. |

---

### 4. Full SQL Implementations Cho Các RPC Nghiệp Vụ Cốt Lõi (Solving S-3, S-4, N-5, D-19, U-3, U-4, U-9)

#### A. RPC Mở/Ẩn Dòng Hóa Đơn — Hardened với AAL2 & Cờ Phân Loại CSDL (Solving S-4)
```sql
CREATE OR REPLACE FUNCTION app.rpc_toggle_invoice_item_visibility(
    p_invoice_item_id UUID,
    p_is_hidden BOOLEAN,
    p_reason TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_item RECORD;
    v_is_doctor BOOLEAN := FALSE;
    v_is_staff BOOLEAN := FALSE;
BEGIN
    -- 1. Kiểm tra người gọi có phải nhân viên phòng khám đang hoạt động
    SELECT EXISTS (
        SELECT 1 FROM app.staff_role_assignments sra
        WHERE sra.user_id = auth.uid() AND sra.is_active = TRUE
    ) INTO v_is_staff;

    IF NOT v_is_staff THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Người gọi không phải nhân viên phòng khám đang hoạt động.';
    END IF;

    -- 2. Khóa dòng hóa đơn bằng FOR UPDATE và kiểm tra trạng thái chốt sổ
    SELECT 
        ii.id, 
        ii.invoice_id,
        ii.item_type, 
        ii.is_clinical_hidden,
        COALESCE(p.requires_clinical_hiding, s.requires_clinical_hiding, TRUE) AS requires_clinical_hiding,
        inv.status AS invoice_status
    INTO v_item
    FROM app.invoice_items ii
    JOIN app.invoices inv ON inv.id = ii.invoice_id
    LEFT JOIN app.products p ON p.id = ii.product_id
    LEFT JOIN app.services s ON s.id = ii.service_id
    WHERE ii.id = p_invoice_item_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'ITEM_NOT_FOUND: Không tìm thấy dòng chi phí.';
    END IF;

    IF v_item.invoice_status IN ('paid', 'refunded', 'cancelled') THEN
        RAISE EXCEPTION 'INVOICE_LOCKED: Không thể thay đổi trạng thái hiển thị của hóa đơn đã thanh toán hoặc đã chốt.';
    END IF;

    -- 3. S-4 FIX: Rào chắn lâm sàng dựa trên cờ requires_clinical_hiding
    IF p_is_hidden = FALSE AND v_item.requires_clinical_hiding = TRUE THEN
        RAISE EXCEPTION 'CLINICAL_RESTRICTION_CANNOT_REVEAL: Không được phép mở hiển thị thuốc kê đơn, thuốc tiêm, xét nghiệm hoặc y lệnh điều trị nội bộ theo PROJECT_BRIEF.md:75.';
    END IF;

    -- 4. Bắt buộc xác thực hai bước AAL2 và kiểm tra ca trực
    IF (auth.jwt()->>'aal') IS DISTINCT FROM 'aal2' THEN
        RAISE EXCEPTION 'MFA_REQUIRED: Thao tác thay đổi hiển thị hóa đơn bắt buộc xác thực hai bước AAL2.';
    END IF;

    IF NOT app.check_active_shift(auth.uid(), 'receptionist') AND NOT app.check_active_shift(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'SHIFT_REQUIRED: Nhân viên phải trong ca trực hiệu lực để thao tác hóa đơn.';
    END IF;

    -- 5. Thực thi cập nhật
    UPDATE app.invoice_items
    SET is_clinical_hidden = p_is_hidden,
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_invoice_item_id;

    -- 6. Ghi vết kiểm toán
    INSERT INTO audit.audit_logs (actor_id, action_type, target_entity, target_id, duty_context, changes)
    VALUES (
        auth.uid(),
        'TOGGLE_INVOICE_ITEM_VISIBILITY',
        'invoice_items',
        p_invoice_item_id,
        'on_shift',
        jsonb_build_object('is_hidden', p_is_hidden, 'reason', p_reason)
    );

    RETURN TRUE;
END;
$$;
```

#### B. RPC Xử Lý Số Điện Thoại Tái Cấp — Sửa Toàn Diện Logic (Solving S-3)
```sql
CREATE OR REPLACE FUNCTION app.rpc_resolve_recycled_phone(
    p_old_customer_id UUID,
    p_new_customer_id UUID,
    p_new_user_id UUID,       -- S-3 FIX: Xác định cụ thể user_id mới cần xác minh
    p_notes TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_link_updated INT := 0;
BEGIN
    -- 1. S-3 FIX: Bắt buộc Quản lý (Admin) và xác thực hai bước AAL2
    IF NOT app.check_active_shift(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Chỉ Quản trị viên mới có quyền xử lý số điện thoại tái cấp.';
    END IF;

    IF (auth.jwt()->>'aal') IS DISTINCT FROM 'aal2' THEN
        RAISE EXCEPTION 'MFA_REQUIRED: Thao tác tái cấp số điện thoại bắt buộc xác thực hai bước AAL2.';
    END IF;

    -- 2. S-3 FIX: Kiểm tra hai hồ sơ khách hàng phải khác nhau và đang tồn tại
    IF p_old_customer_id = p_new_customer_id THEN
        RAISE EXCEPTION 'INVALID_ARGUMENTS: Hồ sơ khách cũ và khách mới không được trùng nhau.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM app.customers WHERE id = p_old_customer_id AND is_deleted = FALSE) OR
       NOT EXISTS (SELECT 1 FROM app.customers WHERE id = p_new_customer_id AND is_deleted = FALSE) THEN
        RAISE EXCEPTION 'CUSTOMER_NOT_FOUND: Một trong hai hồ sơ khách hàng không tồn tại hoặc đã bị xóa.';
    END IF;

    -- 3. Đánh dấu SĐT trên hồ sơ cũ là đã thu hồi mà KHÔNG nối chuỗi làm tràn VARCHAR(15)
    UPDATE app.customers
    SET is_phone_archived = TRUE,
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_old_customer_id;

    -- 4. S-3 FIX: Thu hồi liên kết cũ an toàn bằng CONCAT_WS chống NULL
    UPDATE app.customer_user_links
    SET link_status = 'revoked',
        revoked_by = auth.uid(),
        revoked_at = CLOCK_TIMESTAMP(),
        notes = CONCAT_WS(' | ', notes, 'Thu hồi do số điện thoại bị nhà mạng tái cấp: ' || COALESCE(p_notes, 'N/A'))
    WHERE customer_id = p_old_customer_id AND link_status IN ('verified', 'pending');

    -- 5. S-3 FIX: Nâng cấp liên kết cho ĐÚNG user_id mới từ trạng thái unverified/pending
    UPDATE app.customer_user_links
    SET link_status = 'verified',
        verified_by = auth.uid(),
        verified_at = CLOCK_TIMESTAMP(),
        notes = CONCAT_WS(' | ', notes, 'Xác minh chính chủ mới sau khi đối soát tại quầy: ' || COALESCE(p_notes, 'N/A'))
    WHERE customer_id = p_new_customer_id 
      AND user_id = p_new_user_id 
      AND link_status IN ('self_registered_unverified', 'pending');

    GET DIAGNOSTICS v_link_updated = ROW_COUNT;
    IF v_link_updated = 0 THEN
        RAISE EXCEPTION 'LINK_NOT_FOUND: Không tìm thấy liên kết hợp lệ của người dùng mới để xác minh.';
    END IF;

    -- 6. Ghi nhật ký kiểm toán
    INSERT INTO audit.audit_logs (actor_id, action_type, target_entity, target_id, duty_context, changes)
    VALUES (
        auth.uid(),
        'RESOLVE_RECYCLED_PHONE',
        'customers',
        p_new_customer_id,
        'on_shift',
        jsonb_build_object('old_customer_id', p_old_customer_id, 'new_user_id', p_new_user_id, 'notes', p_notes)
    );

    RETURN TRUE;
END;
$$;
```

#### C. RPC Gán Hóa Đơn Cho Khách Hàng Đối Soát (Solving N-5)
```sql
CREATE OR REPLACE FUNCTION app.rpc_assign_invoice_customer(
    p_invoice_id UUID,
    p_customer_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NOT app.check_active_shift(auth.uid(), 'receptionist') AND NOT app.check_active_shift(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Yêu cầu ca trực Tiếp tân hoặc Quản trị viên.';
    END IF;

    UPDATE app.invoices
    SET customer_id = p_customer_id,
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_invoice_id AND customer_id IS NULL;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'INVOICE_NOT_ELIGIBLE: Hóa đơn không tồn tại hoặc đã được gán khách hàng trước đó.';
    END IF;

    INSERT INTO audit.audit_logs (actor_id, action_type, target_entity, target_id, duty_context, changes)
    VALUES (
        auth.uid(),
        'ASSIGN_INVOICE_CUSTOMER',
        'invoices',
        p_invoice_id,
        'on_shift',
        jsonb_build_object('assigned_customer_id', p_customer_id)
    );

    RETURN TRUE;
END;
$$;
```

#### D. RPC Thêm Dòng Chi Tiết Hóa Đơn & Tra Cứu Catalog (Solving U-4, U-9)

```sql
-- T-4 FIX: Full SQL Thêm Dòng Chi Tiết Hóa Đơn & Tự Động Áp Dụng Cờ Che Giấu Lâm Sàng
CREATE OR REPLACE FUNCTION app.rpc_add_invoice_item(
    p_invoice_id UUID,
    p_item_type VARCHAR(30),
    p_item_name VARCHAR(255),
    p_quantity NUMERIC(10,2),
    p_unit_price NUMERIC(12,2) DEFAULT NULL,
    p_product_id UUID DEFAULT NULL,
    p_service_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_item_id UUID;
    v_inv_status VARCHAR(30);
    v_standard_price NUMERIC(12,2);
    v_final_price NUMERIC(12,2);
    v_subtotal NUMERIC(12,2);
BEGIN
    -- 1. Kiểm tra quyền nhân viên trong ca trực
    IF NOT (app.check_active_shift(auth.uid(), 'receptionist') OR app.check_active_shift(auth.uid(), 'doctor') OR app.check_active_shift(auth.uid(), 'admin')) THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Người gọi không có quyền thao tác lập hóa đơn.';
    END IF;

    -- U-9 FIX: Kiểm tra số lượng hợp lệ
    IF p_quantity <= 0 AND p_item_type NOT IN ('return_product', 'discount_adjustment') THEN
        RAISE EXCEPTION 'INVALID_QUANTITY: Số lượng mặt hàng phải lớn hơn 0.';
    END IF;

    -- 2. Kiểm tra hóa đơn chưa chốt
    SELECT status INTO v_inv_status FROM app.invoices WHERE id = p_invoice_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'INVOICE_NOT_FOUND: Không tìm thấy hóa đơn #%.', p_invoice_id;
    END IF;
    IF v_inv_status IN ('paid', 'cancelled', 'refunded') THEN
        RAISE EXCEPTION 'INVOICE_LOCKED: Hóa đơn đã khóa, không thể thêm dòng mới.';
    END IF;

    -- U-9 FIX: Tra cứu đơn giá catalog và kiểm tra thực thể active/not deleted
    IF p_product_id IS NOT NULL THEN
        SELECT retail_price INTO v_standard_price 
        FROM app.products 
        WHERE id = p_product_id AND is_active = TRUE AND is_deleted = FALSE;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'PRODUCT_NOT_AVAILABLE: Sản phẩm không tồn tại hoặc đã ngừng kinh doanh.';
        END IF;
    ELSIF p_service_id IS NOT NULL THEN
        SELECT standard_price INTO v_standard_price 
        FROM app.services 
        WHERE id = p_service_id AND is_active = TRUE AND is_deleted = FALSE;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'SERVICE_NOT_AVAILABLE: Dịch vụ không tồn tại hoặc đã ngừng hoạt động.';
        END IF;
    END IF;

    v_final_price := COALESCE(p_unit_price, v_standard_price, 0.00);

    -- 3. Chèn dòng chi tiết (Trigger trg_invoice_item_clinical_hiding sẽ tự động suy diễn is_clinical_hidden từ catalog)
    INSERT INTO app.invoice_items (
        invoice_id, item_type, product_id, service_id, item_name, quantity, unit_price, total_price, is_deleted
    ) VALUES (
        p_invoice_id, p_item_type, p_product_id, p_service_id, p_item_name, p_quantity, v_final_price, (p_quantity * v_final_price), FALSE
    ) RETURNING id INTO v_item_id;

    -- U-9 FIX: Cập nhật đồng bộ subtotal_amount và total_amount trên hóa đơn
    SELECT COALESCE(SUM(total_price), 0) INTO v_subtotal
    FROM app.invoice_items 
    WHERE invoice_id = p_invoice_id AND is_deleted = FALSE;

    UPDATE app.invoices
    SET subtotal_amount = v_subtotal,
        total_amount = v_subtotal - COALESCE(discount_amount, 0.00),
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_invoice_id;

    RETURN v_item_id;
END;
$$;
```

#### E. RPC Đặt Lịch Hẹn Khách Hàng Kèm Cơ Chế Tạo Hồ Sơ Khách Lười (Solving D-19, U-3)

```sql
-- D-19 / T-6 FIX: Full SQL Đặt Lịch Khách Hàng Có Cơ Chế Tạo Hồ Sơ Khách Lười (Lazy Profile Creation)
CREATE OR REPLACE FUNCTION app.rpc_create_customer_appointment(
    p_pet_id UUID,
    p_appointment_type VARCHAR(50),
    p_scheduled_at TIMESTAMPTZ,
    p_customer_phone TEXT DEFAULT NULL,
    p_customer_name TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_cust_id UUID;
    v_appt_id UUID;
    v_user_phone TEXT;
    v_user_name TEXT;
BEGIN
    -- U-3 FIX: Kiểm tra thời gian đặt lịch phải ở tương lai
    IF p_scheduled_at <= CLOCK_TIMESTAMP() THEN
        RAISE EXCEPTION 'INVALID_SCHEDULE_TIME: Thời gian đặt lịch phải ở tương lai.';
    END IF;

    -- U-3 / V-5 FIX: Kiểm tra loại lịch hẹn hợp lệ khớp 100% với ràng buộc CSDL app.appointments
    -- Bốn danh mục dịch vụ đặt lịch chuẩn: medical (Khám bệnh), spa (Làm đẹp/tắm tỉa), vaccine (Tiêm phòng), recheck (Tái khám)
    IF p_appointment_type NOT IN ('medical', 'spa', 'vaccine', 'recheck') THEN
        RAISE EXCEPTION 'INVALID_APPOINTMENT_TYPE: Loại lịch hẹn không hợp lệ (chỉ chấp nhận: medical, spa, vaccine, recheck).';
    END IF;

    -- 1. U-3 FIX: Tìm hồ sơ khách hàng có thứ tự ưu tiên verified trước
    SELECT customer_id INTO v_cust_id
    FROM app.customer_user_links cul
    WHERE cul.user_id = auth.uid() AND cul.link_status IN ('verified', 'self_registered_unverified')
    ORDER BY (cul.link_status = 'verified') DESC, cul.created_at ASC
    LIMIT 1;

    -- 2. D-19 Lazy Creation: Nếu người dùng chưa có hồ sơ khách hàng
    IF v_cust_id IS NULL THEN
        SELECT phone_number, full_name INTO v_user_phone, v_user_name FROM app.users WHERE id = auth.uid();
        v_user_phone := COALESCE(p_customer_phone, v_user_phone);
        v_user_name := COALESCE(p_customer_name, v_user_name, 'Khách hàng trực tuyến');

        IF v_user_phone IS NULL OR v_user_phone = '' THEN
            RAISE EXCEPTION 'PHONE_NUMBER_REQUIRED: Đặt lịch lần đầu yêu cầu cung cấp số điện thoại liên lạc.';
        END IF;

        -- Tạo hồ sơ khách hàng mới (Độc lập 100% với hồ sơ nhập Excel trùng SĐT - Solving P1-E & D-19)
        INSERT INTO app.customers (
            source_system, phone_number, full_name, normalized_name, is_phone_archived, is_deleted
        ) VALUES (
            'portal_self_registered', v_user_phone, v_user_name, LOWER(v_user_name), FALSE, FALSE
        ) RETURNING id INTO v_cust_id;

        INSERT INTO app.customer_user_links (
            customer_id, user_id, link_status, notes
        ) VALUES (
            v_cust_id, auth.uid(), 'self_registered_unverified', 'Tạo hồ sơ lười khi đặt lịch hẹn đầu tiên (D-19).'
        );
    END IF;

    -- 3. U-3 FIX: Kiểm tra IDOR - Thú cưng bắt buộc phải thuộc quyền sở hữu của khách hàng
    IF p_pet_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM app.pets 
            WHERE id = p_pet_id AND customer_id = v_cust_id AND is_deleted = FALSE
        ) THEN
            RAISE EXCEPTION 'IDOR_VIOLATION: Thú cưng #% không thuộc quyền quản lý của khách hàng.', p_pet_id;
        END IF;
    END IF;

    -- 4. U-3 FIX: Chèn lịch hẹn chuẩn xác với đúng cột source='portal' (bỏ cột notes không tồn tại)
    INSERT INTO app.appointments (
        customer_id, pet_id, appointment_type, scheduled_at, status, source
    ) VALUES (
        v_cust_id, p_pet_id, p_appointment_type, p_scheduled_at, 'awaiting_confirmation', 'portal'
    ) RETURNING id INTO v_appt_id;

    RETURN v_appt_id;
END;
$$;
```

#### F. RPC Đăng Ký Thú Cưng Khách Hàng Kèm Cơ Chế Lazy Creation (Solving D-19, U-3)

```sql
-- D-19 / T-6 FIX: Full SQL Đăng Ký Thú Cưng Khách Hàng Kèm Cơ Chế Lazy Creation
CREATE OR REPLACE FUNCTION app.rpc_register_customer_pet(
    p_name VARCHAR(100),
    p_species VARCHAR(30),
    p_breed VARCHAR(100) DEFAULT NULL,
    p_gender VARCHAR(10) DEFAULT 'unknown',
    p_date_of_birth DATE DEFAULT NULL,
    p_customer_phone TEXT DEFAULT NULL,
    p_customer_name TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_cust_id UUID;
    v_pet_id UUID;
    v_user_phone TEXT;
    v_user_name TEXT;
BEGIN
    -- U-3 FIX: Kiểm tra hợp lệ loài và giới tính trước khi thao tác
    IF p_species NOT IN ('dog', 'cat', 'other') THEN
        RAISE EXCEPTION 'INVALID_SPECIES: Loài thú cưng không hợp lệ (chỉ chấp nhận: dog, cat, other).';
    END IF;

    IF p_gender NOT IN ('male', 'female', 'unknown') THEN
        RAISE EXCEPTION 'INVALID_GENDER: Giới tính thú cưng không hợp lệ (male, female, unknown).';
    END IF;

    -- 1. Tìm hồ sơ khách hàng đã liên kết với ưu tiên verified
    SELECT customer_id INTO v_cust_id
    FROM app.customer_user_links cul
    WHERE cul.user_id = auth.uid() AND cul.link_status IN ('verified', 'self_registered_unverified')
    ORDER BY (cul.link_status = 'verified') DESC, cul.created_at ASC
    LIMIT 1;

    -- 2. D-19 Lazy Creation nếu chưa có hồ sơ
    IF v_cust_id IS NULL THEN
        SELECT phone_number, full_name INTO v_user_phone, v_user_name FROM app.users WHERE id = auth.uid();
        v_user_phone := COALESCE(p_customer_phone, v_user_phone);
        v_user_name := COALESCE(p_customer_name, v_user_name, 'Khách hàng trực tuyến');

        IF v_user_phone IS NULL OR v_user_phone = '' THEN
            RAISE EXCEPTION 'PHONE_NUMBER_REQUIRED: Đăng ký thú cưng yêu cầu cung cấp số điện thoại liên lạc.';
        END IF;

        INSERT INTO app.customers (
            source_system, phone_number, full_name, normalized_name, is_phone_archived, is_deleted
        ) VALUES (
            'portal_self_registered', v_user_phone, v_user_name, LOWER(v_user_name), FALSE, FALSE
        ) RETURNING id INTO v_cust_id;

        INSERT INTO app.customer_user_links (
            customer_id, user_id, link_status, notes
        ) VALUES (
            v_cust_id, auth.uid(), 'self_registered_unverified', 'Tạo hồ sơ lười khi đăng ký thú cưng đầu tiên (D-19).'
        );
    END IF;

    -- 3. Tạo thú cưng
    INSERT INTO app.pets (
        customer_id, name, species, breed, gender, date_of_birth, is_deleted
    ) VALUES (
        v_cust_id, p_name, p_species, p_breed, p_gender, p_date_of_birth, FALSE
    ) RETURNING id INTO v_pet_id;

    RETURN v_pet_id;
END;
$$;
```

---

### 5. Quy Trình Đăng Ký, Đăng Nhập, Anti-Enumeration & Quản Trị Media (Khôi phục S-1)

#### A. Trigger Tạo Tài Khoản Khách Hàng Tự Đăng Ký (`app.on_auth_user_created`)
Khắc phục tình trạng tạo rác CSDL và hỗ trợ cả đăng ký SĐT lẫn đăng ký bằng Email/Google không có SĐT:

```sql
CREATE OR REPLACE FUNCTION app.on_auth_user_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_customer_id UUID;
    v_phone TEXT; -- T-6 FIX: Dùng TEXT để tránh tràn E.164 (+84... có thể vượt 15 ký tự)
BEGIN
    v_phone := NEW.phone;

    -- 1. Tạo bản ghi người dùng ứng dụng trong app.users (Định danh Auth)
    INSERT INTO app.users (id, phone_number, full_name, is_active)
    VALUES (
        NEW.id,
        v_phone,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Khách hàng mới'),
        TRUE
    );

    -- 2. D-19 Lazy Creation: Đối với người dùng đăng ký qua Email/Google OAuth (chưa có SĐT):
    -- Hệ thống TUYỆT ĐỐI KHÔNG tạo bản ghi khách hàng rác hay liên kết rác.
    -- Chỉ khi người dùng đăng ký trực tiếp bằng Số điện thoại (SMS OTP) mới tạo hồ sơ sơ bộ:
    IF v_phone IS NOT NULL AND v_phone <> '' THEN
        INSERT INTO app.customers (
            source_system,
            phone_number,
            full_name,
            normalized_name,
            is_phone_archived,
            is_deleted
        )
        VALUES (
            'portal_self_registered',
            v_phone,
            COALESCE(NEW.raw_user_meta_data->>'full_name', 'Khách hàng mới'),
            LOWER(COALESCE(NEW.raw_user_meta_data->>'full_name', 'khach hang moi')),
            FALSE,
            FALSE
        )
        RETURNING id INTO v_customer_id;

        -- Tạo liên kết trạng thái chưa xác minh (self_registered_unverified)
        INSERT INTO app.customer_user_links (
            customer_id,
            user_id,
            link_status,
            notes
        )
        VALUES (
            v_customer_id,
            NEW.id,
            'self_registered_unverified',
            'Tài khoản tự đăng ký qua Web Portal; chưa xác minh đối soát tại quầy.'
        );
    END IF;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- T-6 & U-6 FIX: Bắt toàn bộ lỗi ngoại lệ để KHÔNG gián đoạn Auth, MASK PII (không ghi SĐT/email thô vào audit)
    INSERT INTO audit.audit_logs (actor_id, action_type, target_entity, target_id, duty_context, changes)
    VALUES (
        NEW.id,
        'AUTH_TRIGGER_EXCEPTION',
        'users',
        NEW.id,
        'system',
        jsonb_build_object(
            'error', SQLERRM,
            'phone_masked', CASE WHEN NEW.phone IS NOT NULL THEN SUBSTRING(NEW.phone FROM 1 FOR 3) || '***' || RIGHT(NEW.phone, 3) ELSE NULL END,
            'email_domain', CASE WHEN NEW.email IS NOT NULL THEN split_part(NEW.email, '@', 2) ELSE NULL END
        )
    );
    RETURN NEW;
END;
$$;

-- U-6 FIX: Hàm Helper Đảm Bảo Bản Ghi app.users Luôn Tồn Tại (Tránh Lỗi FK Khi Trigger Gặp Exception)
-- V-1 FIX: Hàm Helper Đảm Bảo Bản Ghi app.users Luôn Tồn Tại (Server-Side Only via auth.uid(), Cấm Tham Số Client)
CREATE OR REPLACE FUNCTION app.rpc_ensure_app_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_auth_user RECORD;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Người dùng chưa đăng nhập.';
    END IF;

    -- Kiểm tra nếu bản ghi app.users đã tồn tại
    IF EXISTS (SELECT 1 FROM app.users WHERE id = v_user_id) THEN
        RETURN TRUE;
    END IF;

    -- Nếu thiếu (do trigger trước đó bị lỗi), tự động bù từ auth.users cho chính session người dùng
    SELECT id, phone, raw_user_meta_data INTO v_auth_user FROM auth.users WHERE id = v_user_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'AUTH_USER_NOT_FOUND: Không tìm thấy tài khoản auth #%.', v_user_id;
    END IF;

    INSERT INTO app.users (id, phone_number, full_name, is_active)
    VALUES (
        v_auth_user.id,
        v_auth_user.phone,
        COALESCE(v_auth_user.raw_user_meta_data->>'full_name', 'Khách hàng'),
        TRUE
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN TRUE;
END;
$$;

-- Gắn Trigger vào bảng auth.users của Supabase
CREATE TRIGGER on_auth_user_created_trg
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION app.on_auth_user_created();
```

#### B. Phản Hồi Đồng Nhất & Giới Hạn Tần Suất OTP (Anti-Enumeration & Rate Limiting)
1. **Phản Hồi Đồng Nhất (Anti-Enumeration):**
   - Khi người dùng nhập SĐT để đăng ký tài khoản portal: Dù SĐT đó đã có trong hồ sơ phòng khám hay chưa, hệ thống luôn trả về cùng thông điệp: *"Mã xác thực OTP đã được gửi tới số điện thoại của bạn"*.
   - Thời gian phản hồi được cố tình làm trễ ngẫu nhiên (jittering 300–500ms) để triệt tiêu tấn công dò quét dựa trên thời gian đo lường (Timing Attack).
2. **Kiểm Soát Tần Suất Gửi OTP (OTP Rate Limiting):**
   - Tối đa **3 yêu cầu OTP / 10 phút** trên cùng một số điện thoại.
   - Nhập sai OTP quá 5 lần liên tiếp sẽ tạm khóa gửi OTP trên số điện thoại đó trong **60 phút**.

#### C. Chính Sách Thiết Bị BYOD & Vòng Đời Tệp Media Lưu Viện (Solving D-10, D-20, T-8, BYO-1, BYO-2, BYO-3)

Nhằm tối ưu chi phí hạ tầng ban đầu theo quyết định của Chủ dự án (**D-20: APPROVED DEVICE POLICY**), bệnh viện không bắt buộc đầu tư dàn máy tính bảng chuyên dụng cho từng buồng bệnh mà cho phép điều dưỡng/bác sĩ sử dụng điện thoại thông minh cá nhân (BYOD - Bring Your Own Device). Tuy nhiên, để **giảm thiểu và kiểm soát rủi ro rò rỉ dữ liệu y khoa**, vị trí phòng khám và tuân thủ Nghị định 13/2023/NĐ-CP (PDPD), hệ thống thiết lập **Kiến trúc Bảo mật BYOD 5 Tầng Thực Thi (5-Layer BYOD Enforcement Architecture)**:

```
+---------------------------------------------------------------------------------------------+
|                                5-LAYER BYOD ENFORCEMENT ARCHITECTURE                        |
+---------------------------------------------------------------------------------------------+
| Layer 1: In-Memory Capture        | Ưu tiên getUserMedia() trực tiếp vào RAM; Ngoại lệ      |
|                                   | <input capture> có rủi ro camera roll cần quy chế PDPD. |
|-----------------------------------+---------------------------------------------------------|
| Layer 2: Two-Stage EXIF Scrubbing | Server-side là chuẩn mực: Sharp không withMetadata()    |
|                                   | cho ảnh; FFmpeg +bitexact cho video; Client canvas phụ. |
|-----------------------------------+---------------------------------------------------------|
| Layer 3: Device Session Binding   | DDL app.staff_device_sessions (RESTRICT on delete);     |
|                                   | is_trusted DEFAULT FALSE; RPC đăng ký, duyệt & verify.  |
|-----------------------------------+---------------------------------------------------------|
| Layer 4: Remote Wipe & Zeroize    | Khi nhận 403 DEVICE_REVOKED: PWA xóa IndexedDB, cache;   |
|                                   | Supabase Auth thu hồi refresh token; phiên JWT ngắn.    |
|-----------------------------------+---------------------------------------------------------|
| Layer 5: Storage Caps & Purge     | Ảnh <= 15MB, Video <= 50MB/60s; Signed URL 15 phút;     |
|                                   | Cron tự động xóa vĩnh viễn sau 60 ngày từ uploaded_at.  |
+---------------------------------------------------------------------------------------------+
```

##### 1. Tầng 1: PWA In-Memory Capture — Luồng Ưu Tiên & Kiểm Soát Ngoại Lệ (BYO-1)
- **Luồng Chuẩn Ưu Tiên (Golden Path — In-Memory Capture):**
  * Ứng dụng Staff Web App (PWA) kích hoạt camera trực tiếp thông qua API chuẩn trình duyệt: `navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })`.
  * Khung hình video hiển thị trực tiếp trên thẻ HTML5 `<video>`. Khi nhân viên bấm chụp, ứng dụng vẽ khung hình lên `<canvas>` ẩn và xuất trực tiếp thành `Blob` / `ArrayBuffer` trong bộ nhớ RAM.
  * **Đặc tính an toàn:** Luồng này hoàn toàn không kích hoạt Camera App của hệ điều hành, do đó **giảm thiểu tối đa nguy cơ ảnh bị tự động lưu vào Camera Roll / Google Photos / iCloud Photos cá nhân**. Dữ liệu media chỉ tồn tại tạm thời trong RAM và bị giải phóng ngay sau khi upload thành công hoặc khi đóng phiên chụp.
- **Luồng Ngoại Lệ (Fallback & Exception Handling):**
  * Trong trường hợp thiết bị không hỗ trợ `getUserMedia` hoặc nhân viên chọn tải tệp qua thẻ `<input type="file" accept="image/*,video/*" capture="environment">`: Hệ điều hành sẽ mở ứng dụng Camera gốc hoặc trình duyệt tệp.
  * **Cảnh báo rủi ro minh bạch:** Trong luồng ngoại lệ này, **ảnh gốc có rủi ro cao nằm lại trong bộ sưu tập ảnh cá nhân của thiết bị**. Hệ thống không hứa hẹn "PWA có thể xóa được ảnh gốc trong thư viện máy". Bắt buộc áp dụng biện pháp quản trị nhân sự: Nhân viên ký cam kết bảo mật PDPD, quy định trách nhiệm tự xóa bản gốc sau ca trực, và kiểm tra thực tế hành vi lưu trữ trên phần cứng iOS/Android ở Phase 4B (`NOT TESTED ON PHYSICAL HARDWARE`).
- **Bảo Vệ Dữ Liệu Cá Nhân (PDPD Compliance):**
  * Media thú cưng lưu viện có thể vô tình ghi lại hình ảnh nhân viên, bác sĩ hoặc không gian phòng khám (thuộc phạm vi dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP). Bác sĩ có trách nhiệm kiểm duyệt trước khi xuất bản bản tin (`pet_medical_bulletins`), và Cron worker tự động xóa vĩnh viễn tệp sau đúng 60 ngày kể từ thời điểm tải lên.

##### 2. Tầng 2: Quy Trình Khử Nhiễm Siêu Dữ Liệu 2 Tầng (Server-Side SSoT — BYO-3)
- **Nguyên tắc cốt lõi:** Khử siêu dữ liệu tại Server Worker là **nguồn chuẩn mực duy nhất (Single Source of Truth)**; việc khử EXIF tại Client (HTML5 Canvas redraw) chỉ đóng vai trò hỗ trợ phòng vệ theo chiều sâu (Defense-in-Depth).
- **Khử Nhiễm Ảnh Tĩnh (JPEG, PNG $\le 15$MB):**
  * Trong Node.js / Worker Sandbox, thư viện Sharp mặc định loại bỏ toàn bộ metadata EXIF/GPS khi không gọi `.withMetadata()`.
  * **Đoạn mã Worker chuẩn mực:**
    ```javascript
    // Sharp mặc định loại bỏ toàn bộ EXIF/GPS tags khi không gọi withMetadata()
    await sharp(inputBuffer)
      .rotate() // Tự động xoay hình theo Orientation tag trước khi tag bị xóa
      .toFile(outputPath); // Output hoàn toàn sạch 100% EXIF/GPS/Device metadata
    ```
  * **Kịch bản kiểm chứng:** Chạy kiểm tra tự động đầu ra bằng công cụ `exiftool -all= -json outputPath` xác nhận 0 metadata tags tồn tại.
- **Khử Nhiễm Video Ngắn (MP4 $\le 50$MB, thời lượng $\le 60$ giây):**
  * **Lệnh FFmpeg chuẩn mực:**
    ```bash
    ffmpeg -i input.mp4 -map_metadata -1 -map_chapters -1 -fflags +bitexact -c:v copy -c:a copy -t 60 sanitized_output.mp4
    ```
  * Loại bỏ triệt để metadata toàn cục (`-map_metadata -1`), metadata chapter (`-map_chapters -1`), áp dụng cờ bitexact (`-fflags +bitexact`) nhằm xóa các atom định vị QuickTime location / GPS tracks, và cắt cứng thời lượng tối đa 60 giây.
  * **Kịch bản kiểm chứng:** Chạy kiểm tra tự động bằng `ffprobe -show_format -show_streams sanitized_output.mp4` xác nhận không còn dữ liệu vị trí địa lý.
  * **Phân bổ tài nguyên máy chủ:** Khâu xử lý video đòi hỏi tài nguyên CPU, do đó được thiết kế chạy trên tiến trình Worker riêng biệt có giới hạn tài nguyên cgroup, không dùng chung với tiến trình phân tích tệp Excel 10MB để tránh nghẽn CPU.

##### 3. Tầng 3: Quản Lý Phiên Thiết Bị BYOD & DDL `app.staff_device_sessions` (BYO-2)
Hệ thống thiết lập cơ chế kiểm soát thiết bị có thực thi (Device Trust Workflow): Thiết bị mới mặc định **chưa được tin cậy** (`is_trusted = FALSE`) và bắt buộc phải được Quản trị viên phê duyệt trước khi được phép gửi media:

```sql
-- DDL Bảng Quản Lý Phiên Thiết Bị BYOD Nhân Viên (Solving D-20, BYO-2, SEC-20)
CREATE TABLE IF NOT EXISTS app.staff_device_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT, -- P1-C Invariant: Không xóa cascade dữ liệu kiểm toán
    device_fingerprint TEXT NOT NULL,
    device_name VARCHAR(100),
    device_type VARCHAR(20) DEFAULT 'byod_mobile' CHECK (device_type IN ('byod_mobile', 'hospital_tablet', 'desktop')),
    session_token_hash TEXT NOT NULL UNIQUE,
    is_trusted BOOLEAN NOT NULL DEFAULT FALSE, -- BYO-2 FIX: Mặc định FALSE; thiết bị mới phải được Quản trị viên duyệt
    status VARCHAR(30) NOT NULL DEFAULT 'pending_approval' 
           CHECK (status IN ('pending_approval', 'active', 'revoked', 'expired')),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (CLOCK_TIMESTAMP() + INTERVAL '30 days'),
    revoked_at TIMESTAMPTZ,
    revoked_by UUID REFERENCES app.users(id) ON DELETE RESTRICT,
    revocation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- Chỉ mục tối ưu hóa tra cứu phiên hoạt động hợp lệ
CREATE INDEX IF NOT EXISTS idx_staff_device_sessions_lookup 
ON app.staff_device_sessions(staff_id, is_trusted, status) 
WHERE revoked_at IS NULL;

-- 1. RPC Đăng Ký Thiết Bị BYOD Mới Từ Staff Client (Device Registration)
CREATE OR REPLACE FUNCTION app.rpc_register_staff_device(
    p_device_fingerprint TEXT,
    p_device_name VARCHAR(100)
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_staff_id UUID := auth.uid();
    v_session_id UUID;
    v_token_hash TEXT;
BEGIN
    IF v_staff_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Người dùng chưa đăng nhập.';
    END IF;

    -- Kiểm tra nhân viên có tài khoản active
    IF NOT EXISTS (SELECT 1 FROM app.users WHERE id = v_staff_id AND is_active = TRUE) THEN
        RAISE EXCEPTION 'FORBIDDEN: Tài khoản nhân viên không hoạt động.';
    END IF;

    -- Tạo mã băm phiên thiết bị duy nhất
    v_token_hash := encode(sha256((v_staff_id::text || p_device_fingerprint || CLOCK_TIMESTAMP()::text)::bytea), 'hex');

    INSERT INTO app.staff_device_sessions (
        staff_id, device_fingerprint, device_name, session_token_hash, is_trusted, status
    ) VALUES (
        v_staff_id, p_device_fingerprint, p_device_name, v_token_hash, FALSE, 'pending_approval'
    ) RETURNING id INTO v_session_id;

    -- Ghi nhật ký kiểm toán
    INSERT INTO audit.audit_logs (actor_id, action_type, target_entity, target_id, duty_context, changes)
    VALUES (
        v_staff_id, 'DEVICE_REGISTERED', 'staff_device_sessions', v_session_id, 'on_shift',
        jsonb_build_object('device_name', p_device_name, 'status', 'pending_approval')
    );

    RETURN v_session_id;
END;
$$;

-- 2. RPC Phê Duyệt Thiết Bị BYOD (Admin AAL2 Approval)
CREATE OR REPLACE FUNCTION app.rpc_approve_staff_device(
    p_session_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
BEGIN
    IF NOT app.check_active_shift(v_admin_id, 'admin') THEN
        RAISE EXCEPTION 'FORBIDDEN: Chỉ Quản trị viên trong ca trực hiệu lực mới có quyền phê duyệt thiết bị.';
    END IF;

    IF (auth.jwt()->>'aal') IS DISTINCT FROM 'aal2' THEN
        RAISE EXCEPTION 'MFA_REQUIRED: Thao tác phê duyệt thiết bị yêu cầu xác thực hai bước AAL2.';
    END IF;

    UPDATE app.staff_device_sessions
    SET is_trusted = TRUE, status = 'active', last_active_at = CLOCK_TIMESTAMP()
    WHERE id = p_session_id AND status = 'pending_approval';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SESSION_NOT_FOUND_OR_INVALID: Phiên thiết bị không tồn tại hoặc không ở trạng thái chờ duyệt.';
    END IF;

    INSERT INTO audit.audit_logs (actor_id, action_type, target_entity, target_id, duty_context, changes)
    VALUES (
        v_admin_id, 'DEVICE_APPROVED', 'staff_device_sessions', p_session_id, 'on_shift',
        jsonb_build_object('approved_by', v_admin_id, 'approved_at', CLOCK_TIMESTAMP())
    );

    RETURN TRUE;
END;
$$;

-- 3. RPC Thu Hồi Quyền Truy Cập Thiết Bị BYOD (Remote Revoke BYOD Device — V-1 FIX: Admin AAL2)
CREATE OR REPLACE FUNCTION app.rpc_revoke_staff_device(
    p_session_id UUID,
    p_reason TEXT DEFAULT 'Offboarding or Device Reported Lost'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
BEGIN
    -- V-1 FIX: Kiểm tra quyền Quản trị viên (Admin) qua bảng phân quyền staff_role_assignments
    IF NOT app.check_active_shift(v_admin_id, 'admin') THEN
        RAISE EXCEPTION 'FORBIDDEN: Chỉ Quản trị viên trong ca trực hiệu lực mới có quyền thu hồi thiết bị.';
    END IF;

    IF (auth.jwt()->>'aal') IS DISTINCT FROM 'aal2' THEN
        RAISE EXCEPTION 'MFA_REQUIRED: Thao tác thu hồi thiết bị yêu cầu xác thực hai bước AAL2.';
    END IF;

    -- Đánh dấu thu hồi phiên thiết bị
    UPDATE app.staff_device_sessions
    SET is_trusted = FALSE,
        status = 'revoked',
        revoked_at = CLOCK_TIMESTAMP(),
        revoked_by = v_admin_id,
        revocation_reason = p_reason
    WHERE id = p_session_id AND revoked_at IS NULL;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SESSION_NOT_FOUND_OR_ALREADY_REVOKED: Phiên thiết bị không tồn tại hoặc đã bị thu hồi trước đó.';
    END IF;

    -- Ghi vết kiểm toán bất biến
    INSERT INTO audit.audit_logs (actor_id, action_type, target_entity, target_id, duty_context, changes)
    VALUES (
        v_admin_id,
        'DEVICE_SESSION_REVOKED',
        'staff_device_sessions',
        p_session_id,
        'on_shift',
        jsonb_build_object('reason', p_reason, 'revoked_at', CLOCK_TIMESTAMP())
    );

    RETURN TRUE;
END;
$$;

-- 4. RPC Kiểm Tra Phiên Thiết Bị Trước Khi Nhận Upload Media (Device Verification Guard)
CREATE OR REPLACE FUNCTION app.rpc_verify_staff_device(
    p_session_token_hash TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_session RECORD;
BEGIN
    SELECT * INTO v_session
    FROM app.staff_device_sessions
    WHERE session_token_hash = p_session_token_hash;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'DEVICE_NOT_REGISTERED: Thiết bị chưa được đăng ký trong hệ thống (HTTP 403).';
    END IF;

    IF v_session.revoked_at IS NOT NULL OR v_session.status = 'revoked' THEN
        RAISE EXCEPTION 'DEVICE_REVOKED: Thiết bị đã bị thu hồi quyền truy cập (HTTP 403).';
    END IF;

    IF NOT v_session.is_trusted OR v_session.status <> 'active' THEN
        RAISE EXCEPTION 'DEVICE_NOT_TRUSTED: Thiết bị chưa được Quản trị viên phê duyệt tin cậy (HTTP 403).';
    END IF;

    IF v_session.expires_at < CLOCK_TIMESTAMP() THEN
        RAISE EXCEPTION 'SESSION_EXPIRED: Phiên làm việc của thiết bị đã hết hạn (HTTP 401).';
    END IF;

    -- Cập nhật thời điểm hoạt động gần nhất
    UPDATE app.staff_device_sessions
    SET last_active_at = CLOCK_TIMESTAMP()
    WHERE id = v_session.id;

    RETURN TRUE;
END;
$$;
```

##### 4. Tầng 4: Cơ Chế Remote Wipe, Giới Hạn Thực Tế & Thu Hồi Auth Session (BYO-2)
- **Giới Hạn Kỹ Thuật Minh Bạch Của Remote Wipe:**
  * Cơ chế Remote Wipe phía client chỉ hoạt động **khi thiết bị có kết nối mạng (online) và nhận được mã lỗi HTTP 403 `DEVICE_REVOKED`** từ server.
  * Client PWA **hoàn toàn không thể xóa tệp ảnh gốc nếu ảnh đã nằm trong Camera Roll của hệ điều hành** (do ranh giới sandbox bảo mật của trình duyệt di động).
- **Cơ Chế Bù Đắp An Ninh Đa Tầng:**
  * Khi thu hồi thiết bị, Quản trị viên đồng thời kích hoạt thu hồi toàn bộ Refresh Token của nhân viên trên Supabase Auth (`supabase.auth.admin.signOut(staff_id)`).
  * Cấu hình thời hạn JWT Access Token ngắn (1 giờ). Khi token hết hạn, thiết bị offline không thể tiếp tục gửi bất kỳ request nào.
  * Khi thiết bị online trở lại, bất kỳ request nào tới hệ thống đều nhận mã HTTP 403 `DEVICE_REVOKED`, lập tức kích hoạt hook tự hủy dữ liệu cục bộ:

```javascript
// PWA Zeroization Hook - Kích hoạt khi bị thu hồi phiên thiết bị
async function executeLocalDeviceZeroization() {
    try {
        // 1. Xóa toàn bộ IndexedDB chứa bản nháp media và dữ liệu bệnh nhân tạm
        const dbs = await window.indexedDB.databases?.() || [];
        for (const db of dbs) {
            if (db.name) window.indexedDB.deleteDatabase(db.name);
        }

        // 2. Dọn sạch bộ nhớ CacheStorage của ServiceWorker
        const cacheKeys = await caches.keys();
        for (const key of cacheKeys) {
            await caches.delete(key);
        }

        // 3. Xóa sạch LocalStorage và SessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // 4. Hủy đăng ký Service Worker và chuyển hướng về màn hình khóa
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const reg of registrations) await reg.unregister();
        }
    } finally {
        window.location.replace('/quan-ly/khoa-thiet-bi?reason=device_revoked');
    }
}
```

##### 5. Tầng 5: Giới Hạn Tệp, Signed URL 15 Phút & Tự Động Xóa Sau 60 Ngày (Solving D-10, T-8)
- **Giới hạn dung lượng và độ dài:** Ảnh tĩnh tối đa 15MB; video ngắn tối đa 50MB và thời lượng không quá 60 giây. Mọi tệp vượt quá ngưỡng bị từ chối ngay tại biên HTTP edge.
- **Truy cập qua Signed URL 15 Phút:** Cả khách hàng (xem bản tin nội trú) và nhân viên chỉ được cấp Signed URL có hiệu lực đúng **15 phút (900 giây)** sinh bởi Edge Function `createSignedUrl(storage_path, 900)`. Tuyệt đối không phơi `storage_path` công khai.
- **Vòng đời tự động xóa sau 60 ngày từ thời điểm tải lên (D-10):** Cron job worker chạy định kỳ lúc 02:00 sáng mỗi ngày, truy vấn các tệp trong bucket `inpatient-media-private` có `uploaded_at < NOW() - INTERVAL '60 days'`, thực hiện lệnh xóa vật lý trên Storage và cập nhật `is_purged = TRUE` trong CSDL kèm ghi nhật ký kiểm toán.

---

## VIII. ĐẶC TẢ PHÂN HỆ BOOKING & CƠ MÁY TRẠNG THÁI BASELINE (SOLVING G6, N-6, P3-6, P3-7)

### 1. Phân Định Giữa FSM Form Frontend và FSM Lịch Hẹn Backend (Solving N-6)
Để đồng bộ với tài liệu baseline `docs/architecture.md` mà vẫn bảo đảm quy trình vận hành CSDL phòng khám, hệ thống phân định rõ:

```
A. FRONTEND BOOKING FORM FSM (Tương tác Người dùng Web Công khai):
   [ idle ] ---> [ validating ] ---> [ submitting ] ---> [ received ] (Thành công -> Chuyển vào staging/app.guest_booking_requests)
                       |                     |
                       +---------------------+---------> [ failed ]   (Lỗi mạng / Hết hạn token / Validation lỗi)

> [!NOTE]
> **Làm rõ Trạng thái `validating` so với Baseline `docs/architecture.md` (P3 Clarification):**
> Trong tài liệu baseline `docs/architecture.md`, FSM biểu mẫu đặt lịch công khai được tóm tắt ở 4 trạng thái cốt lõi: `idle` → `submitting` → `received` / `failed` (trong đó các bước kiểm tra hợp lệ được gộp bên trong pha `idle`). Bản thiết kế Phase 4A v1.6.9 tách riêng bước chuyển tiếp trung gian `[ validating ]` trên trình duyệt (thực thi kiểm tra Zod client schema và xác thực Cloudflare Turnstile token) nhằm tối ưu trải nghiệm giao diện người dùng trước khi gửi payload lên server (`submitting`). Sự làm rõ này bảo toàn 100% ngữ nghĩa của baseline và phản ánh chính xác tương tác frontend thực tế.

B. BACKEND APPOINTMENT FSM (Quản lý Vận hành Y tế & Spa trong CSDL):
   [ awaiting_confirmation ] ---> [ confirmed ] ---> [ checked_in ] ---> [ in_progress ] ---> [ completed ]
              |                        |                   |
              +------------------------+-------------------+-----------------------------> [ cancelled / no_show ]
```

---

### 2. Idempotency Key, Giới Hạn Tần Suất & Dọn Dẹp An Toàn (Solving N-6)

1. **Khóa Chống Gửi Trùng Lặp (Idempotency Key):**
   - Client form web tự sinh mã UUIDv4 `idempotency_key` lưu tại Session Storage khi người dùng mở form.
   - Khi gửi request, khóa này được chèn vào bảng `app.guest_booking_requests`. Chỉ mục `uq_guest_booking_idempotency` ngăn chặn hoàn toàn việc người dùng nhấp đúp (double-click) hoặc mạng chập chờn gửi trùng 2 yêu cầu đặt lịch giống nhau.
2. **Kiểm Soát Tần Suất (Rate Limiting):**
   - Giới hạn tối đa **3 yêu cầu / 10 phút** trên cùng một địa chỉ IP (dựa trên `client_ip_hash`).
   - Giới hạn tối đa **3 yêu cầu / ngày** trên cùng một số điện thoại để chống hành vi spam quấy rối tiếp tân.
3. **Tiến Trình Dọn Dẹp Tự Động An Toàn (Safe Auto-delete Worker):**
   - Cron worker hàng đêm **chỉ xóa các yêu cầu đã xử lý hoặc bị từ chối/rác**, **TUYỆT ĐỐI KHÔNG XÓA YÊU CẦU ĐANG CHỜ (`pending`)**:
     ```sql
     DELETE FROM app.guest_booking_requests 
     WHERE auto_delete_at <= CLOCK_TIMESTAMP()
       AND status IN ('processed', 'rejected', 'spam', 'cancelled');
     ```
   - Các yêu cầu có `status = 'pending'` quá 30 ngày được giữ nguyên và tự động đẩy cảnh báo khẩn cấp lên bảng điều khiển của Tiếp tân trưởng để xử lý tồn đọng.

---

## IX. PHƯƠNG ÁN SAO LƯU & PHỤC HỒI THẢM HỌA (SOLVING H8, G13, G15, N-7, N-8, S-6)

### 1. Kiến Trúc Cô Lập Worker Trên 1 VPS Containerized (Solving H8, S-6, D-14: APPROVED — DESIGN ONLY)
Chủ dự án đã chính thức phê duyệt thiết kế **1 VPS cách ly bằng Container và phân quyền tách biệt** (`D-14: APPROVED — DESIGN ONLY`). Chủ dự án chọn phương án 1 VPS với Container cách ly parser, quyền, credential và filesystem riêng biệt, bảo vệ dữ liệu sao lưu khỏi môi trường xử lý file không tin cậy. Lưu ý: Chưa phê duyệt thuê VPS hoặc phát sinh chi phí vận hành:

| Thành phần Kỹ thuật | Đặc tả Kiến trúc Cô lập Trên 1 VPS ($5.00/tháng - Hetzner CX22 / DigitalOcean Droplet) |
| :--- | :--- |
| **Cấu hình Phần cứng Host** | 1 vCPU, 2GB RAM, 25GB NVMe SSD, hệ điều hành Ubuntu 24.04 LTS Minimal. |
| **Service 1: Parser & Media Sandbox** | - Chạy trong Docker Container riêng biệt với quyền phi-root (`user: 1000:1000`), cờ bảo mật `security_opt: ["no-new-privileges:true"]`, `read_only: true` (chỉ mount tmpfs tại `/tmp`).<br>- **Tuyệt đối không mount thông tin xác thực sao lưu:** Thư mục chứa khóa GPG (`/etc/leson-backup/`) và R2 credentials (`~/.aws/`) tuyệt đối không được mount vào Parser/Media Container.<br>- Mạng Docker Bridge cô lập: **Không có Default Gateway ra Internet công cộng**.<br>- Cấu hình cgroup: Giới hạn nghiêm ngặt bộ nhớ tiến trình $\le 1.5$GB RAM, tự động kill an toàn nếu bị tấn công DoS/ZIP bomb.<br>- Tường lửa Outbound Host: Chỉ Allowlist địa chỉ IP/Domain của Supabase Storage (HTTPS 443) và Supabase DB (TCP 5432/6543).<br>- Tài khoản DB: Kết nối qua `import_worker_role` chỉ có quyền trên schema `staging.*`, cấm chạm `app.*` hay `audit.*`. |
| **Service 2: DR Backup Worker** | - Chạy dưới dạng Systemd Timer / Cron Service độc lập trên Host (không nằm trong Parser Container).<br>- Chạy `pg_dump` hàng ngày vào 02:00 sáng, mã hóa bất đối xứng qua GPG 4096-bit.<br>- Đẩy bản sao lưu mã hóa lên Cloudflare R2 / AWS S3 qua IAM hạn chế duy nhất quyền `PutObject` (`s3:PutObject` only).<br>- Tệp cấu hình bí mật và Private Key được phân quyền `chmod 600`, sở hữu bởi người dùng hệ thống riêng (`backup-svc`). |
| **Phân tích Rủi ro Shared-Host** | - **Rủi ro:** Hai tiến trình dùng chung Linux Kernel trên cùng 1 VPS; nếu xảy ra lỗ hổng Kernel Privilege Escalation hoặc Container Escape từ Parser, kẻ tấn công có thể truy cập host.<br>- **Biện pháp giảm thiểu:** Docker cấu hình `--cap-drop=ALL`, `--security-opt=no-new-privileges`, `read-only` root filesystem cho Parser; khóa bí mật sao lưu được mã hóa và cô lập trong namespace riêng.<br>- **Cam kết vận hành:** Chưa kích hoạt hoặc thuê VPS thật cho đến khi có lệnh triển khai chính thức. |

---

### 2. Kế Hoạch Sao Lưu Đa Tầng & Tính Trung Thực Của RPO/RTO (Solving N-8)
1. **Mục Tiêu Thiết Kế RPO / RTO (Design Targets - Chưa phải cam kết nhà cung cấp):**
   - **Mục tiêu RPO (Recovery Point Objective):** **$\le 24$ giờ** với giải pháp sao lưu định kỳ hàng ngày (Daily Encrypted Dump). Chỉ tiêu RPO $\le 5$ phút của Supabase PITR hiện **không áp dụng** do gói PITR $100/tháng chưa được phê duyệt/kích hoạt (quyết định PITR đang ở trạng thái DEFERRED / NOT DECIDED nhằm tối ưu chi phí).
   - **Mục tiêu RTO (Recovery Time Objective):** $15 - 30$ phút với khôi phục tại chỗ hoặc $2 - 4$ giờ khi tái thiết lập từ bản dump mã hóa offsite.
2. **Sao Lưu Tại Chỗ & Chính Sách PITR (D-03: PENDING — NOT DECIDED / ĐỀ XUẤT KỸ THUẬT):**
   - Supabase Pro Plan cung cấp mặc định 7 ngày bản sao lưu hàng ngày (Daily Backup).
   - **Làm rõ tình trạng quyết định theo chỉ đạo của Chủ dự án (06/11/2026):** Chủ dự án **chưa chốt** mua PITR hay chọn chính sách sao lưu cuối cùng. Tài liệu không ghi PITR bị từ chối vĩnh viễn, không ghi sao lưu hằng ngày đã được chủ dự án phê duyệt, và không ghi RPO 24 giờ là cam kết được chấp thuận. Đội ngũ giữ giải pháp sao lưu định kỳ hàng ngày (`pg_dump` mã hóa GPG đẩy lên Cloudflare R2, RPO đề xuất $\le 24$ giờ, $0 phụ phí phát sinh) làm **phương án kỹ thuật đề xuất**, chờ Chủ dự án phê duyệt riêng. Gói PITR trả phí ($100/tháng) ở trạng thái chưa quyết định mua.
3. **Sao Lưu Ngoài Địa Điểm (Offsite Encrypted Backup - Solving H8):**
   - Máy chủ Worker 2 chạy `pg_dump` vào 02:00 sáng hàng ngày.
   - Mã hóa bất đối xứng bằng khóa công khai GPG 4096-bit trước khi truyền. Khóa giải mã bí mật được lưu ngoại tuyến (Key Escrow policy).
   - Tải bản dump đã mã hóa lên Cloudflare R2 / AWS S3 (độc lập hoàn toàn với hạ tầng Supabase).

---

## X. DỰ TOÁN CHI PHÍ HẠ TẦNG & TÙY CHỌN VẬN HÀNH (SOLVING H8, G13, P2-O, N-7, N-8, D-01, D-17)

### 1. Kế Hoạch Đánh Giá Cloudflare Pages & Bảng So Sánh Trung Lập (Solving D-17, T-9)
Chủ dự án **ưu tiên đánh giá Cloudflare Pages trước** cho frontend React Router 7/Vite (`D-17: APPROVED FOR EVALUATION — NOT PRODUCTION`). Hệ thống xây dựng khung kiểm chứng kỹ thuật:

1. **Khung Đánh Giá Khả Thi Cloudflare Pages (React Router 7 Framework Mode):**
   - **Tương thích Client-side Routing:** Cấu hình tệp `_routes.json` hoặc tệp chuyển hướng `_redirects` (`/* /index.html 200`) để bảo đảm các route SPA `/tai-khoan/*` và `/quan-ly/*` không bị lỗi HTTP 404 khi người dùng tải lại trang.
   - **Static Assets & Edge Caching:** Kiểm tra tốc độ phân phối các tệp bundle JS/CSS đã tối ưu của Vite trên mạng lưới CDN toàn cầu của Cloudflare.
   - **Bảo Vệ Biến Môi Trường:** Kiểm tra khả năng chèn biến môi trường an toàn tại Cloudflare Dashboard (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) mà không làm lộ secret ra client.
   - **Bảo Vệ Form Khách Vãng Lai:** Đánh giá việc tích hợp Cloudflare Turnstile miễn phí cho Guest Booking Form thay thế reCAPTCHA.
   - **Kiểm Chứng Điều Khoản Thương Mại:** Rà soát điều khoản dịch vụ (ToS) của gói Cloudflare Pages Free đối với website doanh nghiệp/phòng khám thương mại để bảo đảm tính hợp lệ pháp lý.
2. **Bảng So Sánh Các Tùy Chọn Hạ Tầng Trung Lập (Solving T-9):**

| Thành phần | Ứng viên 1 | Ứng viên 2 | Ghi chú & Trạng thái Phê duyệt |
| :--- | :--- | :--- | :--- |
| **Public Web Hosting** | Cloudflare Pages (CDN toàn cầu, $0/tháng) | Vercel Pro ($20/tháng) | `[D-17: ƯU TIÊN ĐÁNH GIÁ CLOUDFLARE PAGES]` |
| **Hạ tầng CSDL & Auth** | Supabase Managed (Singapore, tối ưu chi phí) | Self-hosted Supabase trên Dedicated VPS ($40/tháng) | `[D-01: APPROVED — ARCHITECTURE ONLY]` |
| **Worker Xử lý Dữ liệu** | 2 VPS độc lập ($10/tháng) | 1 VPS cách ly Container ($5/tháng) | `[D-14: APPROVED — DESIGN ONLY (Chưa thuê VPS)]` |
| **Lưu trữ Sao lưu Offsite**| Cloudflare R2 ($0.50/tháng cho 10-50GB) | AWS S3 Standard ($1.20/tháng) | R2 miễn phí băng thông tải về (Egress) |

---

### 2. Dự Toán Chi Phí Hàng Tháng — Phân Tầng Tối Ưu Theo Chỉ Đạo Chủ Dự Án (Solving D-01, N-8)
Chủ dự án chỉ đạo: *"các quyết định của tôi supabase có thể mua nhưng mua bản tối ưu chi phí"*. Hệ thống phân định rõ 2 phương án ngân sách:

| Khoản mục chi phí | Giai đoạn Đánh giá & Dev (Bootstrap / Tối ưu Chi phí) | Giai đoạn Vận hành Sản xuất (Production Baseline) | Tính chất & Ghi chú (U-8 FIX, D-01-PRO) |
| :--- | :---: | :---: | :--- |
| **Backend & CSDL (Supabase)** | **$0.00** *(Free Tier)* | **$25.00** *(Pro Plan)* | **D-01-PRO:** Chỉ nâng Pro khi có nhu cầu chứng minh & duyệt riêng; Free tier tự pause sau 7 ngày, chỉ dùng dữ liệu giả lập |
| **Máy chủ Worker Xử lý (D-14)**| **$5.00** *(1 VPS Containerized Hetzner CX22)* | **$5.00** *(1 VPS Containerized duy nhất theo D-14)* | Tiết kiệm chi phí, cô lập bằng Docker non-root |
| **Lưu trữ Offsite Backup** | **$0.00** *(Cloudflare R2 Free Tier 10GB)* | **$0.50** *(Cloudflare R2 ~20GB dữ liệu nén)* | Biến đổi theo dung lượng dump thực tế |
| **Tên miền phòng khám** | **$1.00** *(Phân bổ ~$12/năm cho nhà đăng ký VN)* | **$1.00** *(Phân bổ ~$12/năm)* | Cố định phân bổ |
| **Email Giao dịch** | **$0.00** *(Resend Free 3.000 email/tháng)* | **$0.00 – $3.00** *(Resend Starter nếu vượt hạn mức)* | Biến đổi theo lưu lượng giao dịch |
| **Giám sát & Error Logging**| **$0.00** *(Sentry Developer / BetterStack Free)* | **$0.00** *(Gói Free duy trì đầy đủ tính năng cốt lõi)*| Cố định miễn phí |
| **SMS OTP Brandname (D-05)** | **$0.00** *(Dùng số test / tài khoản sandbox)* | **$3.00 – $6.00** *(Zalo ZNS ~500 OTP/tháng theo D-05)* | Biến đổi theo lưu lượng khách hàng thật |
| **TỔNG CHI PHÍ HÀNG THÁNG** | **$6.00 / tháng** | **$34.50 – $40.50 / tháng** | **V-6 FIX:** Phép tính số học chuẩn xác (25 + 5 + 0.5 + 1 + 0~3 + 0 + 3~6 = $34.50 – $40.50/tháng; đây là dự toán tham chiếu kiến trúc, không phải ngân sách đã duyệt) |

---

## XI. RÀ SOÁT PHÁP LÝ BẢO VỆ DỮ LIỆU CÁ NHÂN (PDPD COMPLIANCE - SOLVING G14)

### 1. Phân Định Vai Trò Pháp Lý Theo Nghị Định 13/2023/NĐ-CP
- **Bên Kiểm soát Dữ liệu Cá nhân (Data Controller):** Bệnh viện Thú y Lê Sơn.
- **Bên Xử lý Dữ liệu Cá nhân (Data Processor):** Supabase Inc. (Lưu trữ CSDL), Cloudflare Inc. (CDN & DNS), Hetzner/DigitalOcean (Máy chủ Worker), eSMS/Zalo (Đơn vị viễn thông gửi OTP).

---

### 2. Thỏa Thuận Xử Lý Dữ Liệu (DPA) & Lưu Chuyển Dữ Liệu Xuyên Biên Giới
- Trước khi đưa hệ thống vào vận hành chính thức với dữ liệu thật của khách hàng, Bệnh viện Thú y Lê Sơn ký thỏa thuận DPA tiêu chuẩn với Supabase Inc.
- Lập Hồ sơ Đánh giá Tác động Chuyển Dữ liệu Cá nhân ra Nước ngoài gửi Bộ Công an (A05) theo quy định tại Điều 25 Nghị định 13/2023/NĐ-CP.

---

### 3. Cơ Chế Thu Thập Chấp Thuận Rõ Ràng (Explicit Consent)
- Form đặt lịch và màn hình đăng ký tài khoản bắt buộc có Checkbox:
  *"Tôi đồng ý để Bệnh viện Thú y Lê Sơn thu thập và xử lý số điện thoại, họ tên nhằm mục đích quản lý hồ sơ khám chữa bệnh thú cưng và nhận thông báo theo Chính sách Bảo vệ Dữ liệu Cá nhân"*.
- Không sử dụng ô đánh dấu sẵn (No pre-ticked box).

---

### 4. Quyền Của Chủ Thể Dữ Liệu & Ngoại Lệ Lưu Trữ Bệnh Án
1. **Quyền Được Rút Lại Chấp Thuận & Quyền Xóa Dữ Liệu (Right to Erasure):**
   - Khách hàng có quyền yêu cầu xóa tài khoản portal và thông tin liên lạc cá nhân.
2. **Ngoại Lệ Pháp Lý Bắt Buộc Đối Với Hồ Sơ Bệnh Án:**
   - Căn cứ quy định của Luật Thú y và Luật Khám bệnh, chữa bệnh về lưu trữ hồ sơ dịch tễ: Các dữ liệu lâm sàng, chẩn đoán, y lệnh và nhật ký điều trị **KHÔNG ĐƯỢC PHÉP XÓA BỎ** theo yêu cầu cá nhân. Khi khách hàng thực hiện quyền xóa, hệ thống chỉ ẩn/ẩn danh hóa thông tin cá nhân của chủ nuôi (`anonymize`), toàn bộ dữ liệu chuyên môn thú y vẫn được lưu trữ phục vụ quản lý nhà nước và dịch tễ học.

---

## XII. BỘ KỊCH BẢN KIỂM THỬ BẢO MẬT & IMPORT TOÀN DIỆN (TEST SUITE - 92 CASES)

> **LƯU Ý QUAN TRỌNG:** Toàn bộ 92 kịch bản kiểm thử dưới đây được thiết lập ở trạng thái **`DESIGNED — NOT TESTED`** (Đã thiết kế đặc tả kiểm thử chi tiết, đồng bộ 100% với mã lỗi, tên hàm, cấu trúc cột CSDL và ràng buộc bất biến; chưa thực thi do chưa triển khai hạ tầng thực tế).

### 1. Phân Hệ Bảo Mật, Phân Quyền & Vận Hành Y Khoa (SEC-01 Đến SEC-56)

| Mã Test | Danh mục / Finding | Thiết lập (Setup) | Thao tác (Action) | Kết quả kỳ vọng | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **SEC-01** | PostgREST Schema Isolation | Client dùng PostgREST query `GET /app/pets` | Gửi request trực tiếp tới schema `app` | HTTP 404 Not Found do schema `app` không nằm trong `db-schemas` | DESIGNED — NOT TESTED |
| **SEC-02** | Direct RPC Blocking | Client ẩn danh/portal gọi `POST /rpc/app.rpc_*` | Gửi request gọi trực tiếp hàm nội bộ schema `app` | Bị từ chối: Permission Denied | DESIGNED — NOT TESTED |
| **SEC-03** | Customer Pets Isolation | Khách hàng A đăng nhập gọi `public.customer_pets_view` | Truy vấn danh sách thú cưng | Chỉ trả về thú cưng có `customer_id` liên kết với tài khoản Khách A | DESIGNED — NOT TESTED |
| **SEC-04** | Clinical Invoice Item Hiding | Khách hàng A xem hóa đơn có dòng thuốc điều trị lâm sàng | Gọi `customer_invoice_items_view` | Dòng thuốc bị ẩn hoàn toàn (`is_clinical_hidden = TRUE`); tổng tiền `total_amount` vẫn toàn vẹn | DESIGNED — NOT TESTED |
| **SEC-05** | Shift Roster Enforcement | Bác sĩ ngoài ca trực cố gắng kê đơn | Gọi `rpc_create_treatment_order` | Bị từ chối với lỗi `APP_ERROR_OFF_SHIFT_RESTRICTED` | DESIGNED — NOT TESTED |
| **SEC-06** | Shift Handover Validation | Điều dưỡng ca trước chưa check-off hết y lệnh | Gọi bàn giao ca trực | Báo lỗi còn y lệnh tồn đọng, chặn bàn giao ca | DESIGNED — NOT TESTED |
| **SEC-07** | Admin Off-Shift Override Audit | Quản trị viên truy cập ngoài ca trực | Thực hiện cập nhật bảng kê dịch vụ | Thành công nhưng hệ thống tự động ghi log cảnh báo `OFF_SHIFT_ADMIN_ACCESS` | DESIGNED — NOT TESTED |
| **SEC-08** | Admin On-Shift Normal Audit | Quản trị viên truy cập đúng trong ca trực hợp lệ | Thực hiện cập nhật bảng kê dịch vụ | Thành công, KHÔNG ghi log `OFF_SHIFT_ADMIN_ACCESS` (S-11) | DESIGNED — NOT TESTED |
| **SEC-09** | Medical Record Immutability | Nhân viên cố gắng gọi lệnh `DELETE FROM app.clinical_records` | Chạy lệnh xóa hồ sơ bệnh án | Bị chặn bởi FK `ON DELETE RESTRICT`, không thể xóa | DESIGNED — NOT TESTED |
| **SEC-10** | Inpatient Media Pet Isolation | Khách hàng A cố gắng xem ảnh thú cưng B | Gọi `rpc_request_media_signed_url` với `media_id` của B | Trả về lỗi 403 Forbidden hoặc từ chối truy cập | DESIGNED — NOT TESTED |
| **SEC-11** | Unpublished Media Access Denial | Khách hàng A gọi token xem ảnh thú cưng chưa duyệt | Gọi `rpc_request_media_signed_url` với bản tin `is_published = FALSE` | Bị từ chối quyền truy cập (S-9) | DESIGNED — NOT TESTED |
| **SEC-12** | Receptionist Clinical Reveal Denial | Tiếp tân gọi mở dòng thuốc kê đơn cho khách xem | Gọi `rpc_toggle_invoice_item_visibility` trên dòng thuốc | Bị từ chối với lỗi `CLINICAL_RESTRICTION_CANNOT_REVEAL` (S-4, T-4) | DESIGNED — NOT TESTED |
| **SEC-13** | Strict Clinical Guard Enforcement | Bác sĩ hoặc Admin cố gắng mở dòng thuốc kê đơn cho khách | Gọi `rpc_toggle_invoice_item_visibility` trên dòng có `requires_clinical_hiding = TRUE` | Bị từ chối với lỗi `CLINICAL_RESTRICTION_CANNOT_REVEAL` (T-4 Policy) | DESIGNED — NOT TESTED |
| **SEC-14** | Invoice Customer Assignment | Tiếp tân gán khách hàng vào hóa đơn chưa chốt | Gọi `rpc_assign_invoice_customer` | Cập nhật thành công `customer_id` và ghi vết kiểm toán | DESIGNED — NOT TESTED |
| **SEC-15** | Public Booking Rate Limiting | Bot gửi liên tục 10 request đặt lịch trong 1 phút | Gửi POST tới form booking công khai | Bị Gateway chặn với mã lỗi HTTP 429 Too Many Requests | DESIGNED — NOT TESTED |
| **SEC-16** | Booking Idempotency Protection | Người dùng nhấp đúp (double-click) nút Đặt lịch | Client gửi 2 request với cùng 1 `idempotency_key` | Chỉ 1 bản ghi được tạo; request thứ 2 trả về kết quả request 1 (N-6) | DESIGNED — NOT TESTED |
| **SEC-17** | OAuth Signup Lazy Profile | Người dùng đăng ký tài khoản portal qua Google OAuth | Auth user được tạo thành công | Hệ thống KHÔNG tạo hồ sơ khách hàng rác; chờ cập nhật SĐT tại quầy (S-1, D-19) | DESIGNED — NOT TESTED |
| **SEC-18** | Anti-Enumeration Timing Protection | Kẻ xấu dò quét SĐT qua form đăng ký portal | Nhập SĐT đã có và SĐT chưa có trong CSDL | Cả 2 trường hợp đều trả về thông điệp giống nhau với độ trễ ngẫu nhiên 300-500ms | DESIGNED — NOT TESTED |
| **SEC-19** | OTP Abuse Lockout | Nhập sai OTP 5 lần liên tiếp | Gửi request xác thực OTP sai | Số điện thoại bị tạm khóa gửi OTP trong 60 phút | DESIGNED — NOT TESTED |
| **SEC-20** | BYOD PWA Session Verification, Trust Workflow & Remote Wipe | Thiết bị BYOD chưa đăng ký, chưa duyệt (is_trusted=FALSE), token hết hạn, hoặc bị thu hồi | Gọi upload media lưu viện | Bị từ chối (403 DEVICE_NOT_TRUSTED / DEVICE_REVOKED); PWA kích hoạt dọn sạch cache/IndexedDB; Supabase Auth thu hồi refresh token | DESIGNED — NOT TESTED |
| **SEC-21** | Recycled Phone Non-Admin Denial | Khách hàng hoặc Tiếp tân gọi RPC giải quyết SĐT tái chế | Gọi `rpc_resolve_recycled_phone` | Bị từ chối với lỗi `UNAUTHORIZED: Chỉ Quản trị viên mới có quyền...` (S-3) | DESIGNED — NOT TESTED |
| **SEC-22** | Recycled Phone MFA AAL2 Requirement | Admin chưa xác thực MFA AAL2 gọi giải quyết SĐT tái chế | Gọi `rpc_resolve_recycled_phone` với JWT AAL1 | Bị từ chối với lỗi `MFA_REQUIRED` (S-3) | DESIGNED — NOT TESTED |
| **SEC-23** | Recycled Phone Identical ID Denial | Admin gọi giải quyết SĐT tái chế với ID cũ = ID mới | Truyền `p_old_customer_id = p_new_customer_id` | Bị từ chối với lỗi `INVALID_ARGUMENTS` (S-3) | DESIGNED — NOT TESTED |
| **SEC-24** | Recycled Phone User ID Mismatch | Admin gọi giải quyết SĐT tái chế với `p_new_user_id` không khớp | Truyền ID người dùng không có liên kết pending | Bị từ chối với lỗi `LINK_NOT_FOUND` (S-3) | DESIGNED — NOT TESTED |
| **SEC-25** | Phone Reuse Registration Isolation | Khách hàng đăng ký portal với SĐT trùng khách cũ Excel | Thực hiện đăng ký tài khoản qua web | Tạo hồ sơ `self_registered_unverified`, KHÔNG tự động gộp lịch sử (P1-E) | DESIGNED — NOT TESTED |
| **SEC-26** | Multiple Customers Same Phone | Import 2 khách hàng khác tên nhưng trùng SĐT | Thực hiện commit đợt import | Tạo 2 bản ghi `customers` riêng biệt, phân biệt bằng `customer_id` (P1-E) | DESIGNED — NOT TESTED |
| **SEC-27** | Front-Desk Ambiguous Phone Search | Tiếp tân tìm kiếm khách hàng theo SĐT có 2 hồ sơ trùng | Gọi tìm kiếm tại màn hình tiếp tân | Hiển thị 2 dòng kết quả kèm họ tên và thú cưng để tiếp tân đối soát thủ công | DESIGNED — NOT TESTED |
| **SEC-28** | PDPD Personal Data Export | Khách hàng yêu cầu trích xuất toàn bộ dữ liệu cá nhân | Gọi RPC trích xuất dữ liệu cá nhân | Trả về tệp JSON chứa đầy đủ thông tin theo Điều 14 Nghị định 13 | DESIGNED — NOT TESTED |
| **SEC-29** | PDPD Right to Erasure Medical Guard | Khách hàng yêu cầu xóa vĩnh viễn dữ liệu | Gọi RPC yêu cầu xóa dữ liệu | Ẩn danh hóa thông tin liên hệ, BẢO LƯU bệnh án thú y theo luật | DESIGNED — NOT TESTED |
| **SEC-30** | Public Booking Creation Flow | Khách hàng vãng lai gửi form đặt lịch | Gọi `rpc_guest_create_booking` | Tạo bản ghi `app.guest_booking_requests` với trạng thái `pending` | DESIGNED — NOT TESTED |
| **SEC-31** | Inpatient Order Checkoff | Điều dưỡng trong ca trực tích hoàn thành y lệnh nội trú | Gọi `rpc_checkoff_treatment_order` | Ghi nhận `executed_by_nurse_id`, thời gian và cập nhật tiến trình điều trị | DESIGNED — NOT TESTED |
| **SEC-32** | Vital Signs Physiologic Alert | Điều dưỡng ghi nhận thân nhiệt thú cưng $>40.5^circ	ext{C}$ | Gọi RPC ghi nhận chỉ số sinh hiệu | Lưu chỉ số sinh tồn và tự động kích hoạt cờ cảnh báo sốt cao cấp cứu | DESIGNED — NOT TESTED |
| **SEC-33** | Customer Appointments Query | Khách hàng truy vấn lịch hẹn của mình qua public wrapper | Gọi `public.rpc_get_customer_appointments` | Trả về danh sách lịch hẹn hợp lệ của chính khách hàng (S-2) | DESIGNED — NOT TESTED |
| **SEC-34** | Anonymous RPC Execution Denial | Người dùng ẩn danh (role `anon`) gọi RPC nội bộ | Gọi `public.rpc_get_customer_profile` | Bị từ chối: Permission Denied do đã REVOKE từ anon (S-2, T-3) | DESIGNED — NOT TESTED |
| **SEC-35** | Anonymous Service View Query | Khách truy cập web công khai xem bảng giá dịch vụ | Truy vấn `public.customer_available_services_view` | Thành công, trả về danh mục dịch vụ công khai (S-2) | DESIGNED — NOT TESTED |
| **SEC-36** | Anonymous Pet View Query Denial | Khách truy cập ẩn danh cố gắng xem view thú cưng | Truy vấn `public.customer_pets_view` | Bị từ chối: Permission Denied (S-2) | DESIGNED — NOT TESTED |
| **SEC-37** | Admin Toggle User Status | Quản trị viên vô hiệu hóa tài khoản nhân viên vi phạm | Gọi `rpc_admin_toggle_user_status` | Khóa tài khoản thành công, cập nhật `app.users.is_active = FALSE` | DESIGNED — NOT TESTED |
| **SEC-38** | Inactive User Blocked | Nhân viên đã bị khóa tài khoản cố gắng gọi bất kỳ RPC nào | Gửi request có JWT của tài khoản inactive | Toàn bộ RPC trả về lỗi `USER_INACTIVE_OR_SUSPENDED` | DESIGNED — NOT TESTED |
| **SEC-39** | Storage Bucket Policy Enforcement | Khách hàng truy cập trực tiếp URL tệp ảnh lưu viện | Gửi GET tới tệp trên bucket `inpatient-media-private` | Bị chặn bởi Supabase Storage Policy; chỉ xem được qua Signed URL hợp lệ | DESIGNED — NOT TESTED |
| **SEC-40** | Worker 1 Outbound Allowlist | Worker 1 cố gắng kết nối tới Internet công cộng | Chạy lệnh kết nối HTTP tới IP bên ngoài | Bị tường lửa VPC chặn (Default-Deny); kết nối tới Supabase Storage (443) và Postgres (5432) thành công; tài khoản `import_worker_role` bị từ chối SELECT trên `app.clinical_records` (S-6) | DESIGNED — NOT TESTED |
| **SEC-41** | Recycled Phone Nonexistent User ID | Admin giải quyết SĐT với ID người dùng không tồn tại | Truyền `p_new_user_id` ngẫu nhiên | Bị từ chối với ngoại lệ `LINK_NOT_FOUND` (S-3) | DESIGNED — NOT TESTED |
| **SEC-42** | Recycled Phone Nonexistent Customer | Admin giải quyết SĐT với mã khách hàng không tồn tại | Truyền `p_old_customer_id` không tồn tại | Bị từ chối với ngoại lệ `CUSTOMER_NOT_FOUND` (S-3) | DESIGNED — NOT TESTED |
| **SEC-43** | Recycled Phone Non-Admin Role | Nhân viên quầy thu ngân gọi giải quyết SĐT tái chế | Gọi `rpc_resolve_recycled_phone` với vai trò `receptionist` | Bị từ chối với lỗi `UNAUTHORIZED` (S-3) | DESIGNED — NOT TESTED |
| **SEC-44** | Public Wrapper Execution Test | Người dùng authenticated gọi wrapper công khai | Gọi `public.rpc_create_customer_appointment` và gọi trực tiếp `app.rpc_create_customer_appointment` | Wrapper công khai thực thi thành công; gọi trực tiếp schema `app` bị từ chối quyền (S-2, T-3) | DESIGNED — NOT TESTED |
| **SEC-45** | Overnight Shift Crossing Midnight | Bác sĩ trực ca đêm từ 21:00 đến 08:00 sáng hôm sau | Kiểm tra tại thời điểm 23:30 và 02:30 sáng | Hàm `check_active_shift` trả về TRUE tại cả 2 thời điểm (T-1) | DESIGNED — NOT TESTED |
| **SEC-46** | Session Timezone Immunity | Client kết nối với session timezone UTC | Gọi `check_active_shift` tại 14:00 giờ Việt Nam (07:00 UTC) | Đối soát đúng 14:00 theo `Asia/Ho_Chi_Minh`, không bị lệch 7 giờ (T-1) | DESIGNED — NOT TESTED |
| **SEC-47** | Audit Logs Append-Only Invariant | Nhân viên cố gắng sửa hoặc xóa dòng trong `audit.audit_logs` | Chạy lệnh `UPDATE` hoặc `DELETE` trên bảng audit | Bị trigger chặn với lỗi `AUDIT_LOG_IMMUTABLE` (T-1) | DESIGNED — NOT TESTED |
| **SEC-48** | Bulletin Reversion on Medical Update | Bác sĩ cập nhật phác đồ điều trị cho thú cưng | Chạy `rpc_update_clinical_record` trên ca có bản tin `published` | Bản tin y khoa tự động chuyển trạng thái về `draft` (T-1) | DESIGNED — NOT TESTED |
| **SEC-49** | Medical Record Lock After 24H | Nhân viên cố gắng sửa bệnh án đã khóa sau 24 giờ | Chạy lệnh cập nhật bệnh án có `is_locked = TRUE` | Bị từ chối; bắt buộc bổ sung qua `app.clinical_amendments` (T-1) | DESIGNED — NOT TESTED |
| **SEC-50** | Signed URL 15-Minute Expiry | Khách hàng dùng Signed URL sau 16 phút kể từ khi sinh mã | Tải ảnh từ URL Signed | Nhận phản hồi HTTP 403 Forbidden / Signature Expired (T-1, T-8) | DESIGNED — NOT TESTED |
| **SEC-51** | Revoked Bulletin Media Access Denial | Khách hàng cố gắng xem ảnh của bản tin đã bị thu hồi | Gọi lấy Signed URL cho bản tin có status `revoked` | Bị từ chối quyền truy cập (T-1) | DESIGNED — NOT TESTED |
| **SEC-52** | Appointment Cancellation Boundary | Khách hàng hủy lịch hẹn đang khám (`in_progress`) | Gọi `rpc_cancel_customer_appointment` | Bị từ chối: FSM chỉ cho phép hủy khi `awaiting_confirmation` hoặc `confirmed` (T-1) | DESIGNED — NOT TESTED |
| **SEC-53** | Quarantine Batch Dispatch Blocked | Bác sĩ kê đơn thuốc từ lô hàng cách ly (`quarantined`) | Gọi `rpc_dispatch_inventory` | Bị chặn với lỗi `BATCH_NOT_CLEARED_FOR_DISPATCH` (T-1) | DESIGNED — NOT TESTED |
| **SEC-54** | High-Privilege AAL2 Requirement | Nhân viên khóa bệnh án hoặc duyệt import với AAL1 | Gọi hàm đặc quyền khi chưa hoàn thành xác thực TOTP | Bị từ chối với lỗi `MFA_REQUIRED` (T-1) | DESIGNED — NOT TESTED |
| **SEC-55** | Image EXIF/GPS Zero Leakage | Tải ảnh chụp từ điện thoại có tọa độ GPS lên Worker | Chạy tiến trình khử siêu dữ liệu | Tệp kết quả lưu trong Storage không còn bất kỳ byte dữ liệu EXIF/GPS nào (T-1, T-8) | DESIGNED — NOT TESTED |
| **SEC-56** | Dual Link Status Phone Coexistence | Khách A có liên kết `verified`, Khách B đăng ký portal trùng SĐT | Khách B hoàn tất đăng ký web | CSDL duy trì 2 bản ghi riêng biệt: Khách A (`verified`) và Khách B (`self_registered_unverified`), không gộp (T-1, P1-E) | DESIGNED — NOT TESTED |
| **SEC-57** | IDOR Appointment Pet Check | Khách A đăng nhập gọi `rpc_create_customer_appointment` với `p_pet_id` thuộc Khách B | Thực hiện tạo lịch hẹn cho thú cưng người khác | Bị từ chối với ngoại lệ `IDOR_VIOLATION: Thú cưng #... không thuộc quyền quản lý của khách hàng` (U-3) | DESIGNED — NOT TESTED |
| **SEC-58** | Clinical Reveal Bypass Prevention | Tiếp tân/Client gọi `rpc_add_invoice_item` với `item_type = 'retail_product'` trỏ tới `product_id` là thuốc/vaccine | Thêm dòng chi tiết hóa đơn | Trigger tra cứu catalog trước, ép buộc `is_clinical_hidden = TRUE` và `item_type = 'product'`; View khách không hiển thị (U-4, D-12) | DESIGNED — NOT TESTED |
| **SEC-59** | Two-Man Rule Import Approval Enforcement | Người tải lên đợt nhập (`uploaded_by`) gọi `rpc_import_approve_job(p_job_id)` | Cố gắng tự duyệt đợt nhập của chính mình | Bị từ chối với lỗi `TWO_MAN_RULE_VIOLATION`; nếu người duyệt khác thiếu AAL2 báo `MFA_REQUIRED` (U-5, D-07) | DESIGNED — NOT TESTED |
| **SEC-60** | Catalog Price & Status Validation in Invoice | Nhân viên gọi `rpc_add_invoice_item` với sản phẩm bị xóa mềm (`is_deleted=TRUE`) hoặc `quantity <= 0` | Cố gắng thêm dòng hàng không hợp lệ | Bị từ chối với lỗi `INVALID_QUANTITY` hoặc `PRODUCT_NOT_AVAILABLE`; dòng hợp lệ cập nhật đồng bộ cả subtotal và total (U-9) | DESIGNED — NOT TESTED |

---

### 2. Phân Hệ Xử Lý & Import Dữ Liệu (IMP-01 Đến IMP-32)

| Mã Test | Danh mục / Finding | Thiết lập (Setup) | Thao tác (Action) | Kết quả kỳ vọng | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **IMP-01** | Tệp khách hàng hợp lệ chuẩn | Tệp Excel có 100 khách hàng đầy đủ thông tin | Tải lên và chạy parser | 100 dòng vào staging thành công, không có lỗi định dạng | DESIGNED — NOT TESTED |
| **IMP-02** | Khách hàng trùng SĐT khác tên | Tệp có 2 dòng cùng SĐT nhưng 2 họ tên khác nhau | Chạy Dry-run | Hệ thống nhận diện 2 khách riêng biệt, không gộp và không báo lỗi | DESIGNED — NOT TESTED |
| **IMP-03** | Khách hàng thiếu SĐT | Tệp có 10 dòng không có SĐT nhưng có tên và mã | Chạy Dry-run | Hệ thống chấp nhận, lưu `phone = NULL`, định danh bằng mã nguồn | DESIGNED — NOT TESTED |
| **IMP-04** | Thú cưng mồ côi (Thiếu chủ) | Tệp thú cưng tham chiếu đến mã khách hàng không có | Chạy Dry-run | Đánh dấu cảnh báo `MISSING_OWNER_REFERENCE`, cho phép sửa tại UI | DESIGNED — NOT TESTED |
| **IMP-05** | Nhập danh mục dịch vụ chuẩn | Tệp Excel danh mục 50 dịch vụ khám và spa | Chạy commit đợt nhập | Tạo đầy đủ 50 dịch vụ trong `app.services` | DESIGNED — NOT TESTED |
| **IMP-06** | Dịch vụ trùng mã SKU trong tệp | Tệp danh mục có 2 dòng trùng mã SKU | Chạy Dry-run | Báo lỗi xung đột SKU nội bộ tệp tại bước kiểm tra tính hợp lệ | DESIGNED — NOT TESTED |
| **IMP-07** | Dịch vụ đã tồn tại trong CSDL | Tệp có mã SKU đã có sẵn trong bảng nghiệp vụ | Chạy Dry-run | Hiển thị cảnh báo cập nhật (upsert) hoặc bỏ qua tùy cấu hình | DESIGNED — NOT TESTED |
| **IMP-08** | Nhập tồn kho có số lô và HSD | Tệp tồn kho dược có đầy đủ số lô và ngày hết hạn | Commit đợt nhập | Tạo bản ghi `inventory_batches` và thẻ kho `import_receipt` | DESIGNED — NOT TESTED |
| **IMP-09** | Tồn kho thiếu số lô | Tệp tồn kho thiếu cột số lô | Chạy Dry-run | Tự động sinh mã lô định danh `UNKNOWN-<job>-<row>` (IMP-21) | DESIGNED — NOT TESTED |
| **IMP-10** | Tệp sản phẩm thiếu mã SKU | Tệp sản phẩm có 2 dòng thiếu mã SKU | Chạy Dry-run | Nhận diện lỗi cảnh báo và cho phép người dùng sửa trực tiếp trên UI | DESIGNED — NOT TESTED |
| **IMP-11** | Hóa đơn tham chiếu mã SP lạ | Hóa đơn có chi tiết dòng tham chiếu đến SKU không có | Chạy Dry-run | Áp dụng quy tắc All-or-nothing cho hóa đơn -> Chặn cả hóa đơn | DESIGNED — NOT TESTED |
| **IMP-12** | Parser tệp dung lượng lớn | Tệp Excel kích thước lớn vượt ngưỡng | Parser chạy trong Worker | Giới hạn bộ nhớ cgroup 1.5GB tự động ngắt an toàn nếu quá tải | DESIGNED — NOT TESTED |
| **IMP-13** | Tường lửa Sandbox Worker | Kiểm tra kết nối mạng của Sandbox Worker | Chạy tiến trình parse | Tường lửa VPC chặn toàn bộ kết nối ra Internet công cộng (S-6) | DESIGNED — NOT TESTED |
| **IMP-14** | Dịch vụ có giá âm | Tệp danh mục dịch vụ có đơn giá là số âm | Chạy Dry-run | Trình kiểm tra nghiệp vụ chặn dòng dữ liệu, yêu cầu giá $\ge 0$ | DESIGNED — NOT TESTED |
| **IMP-15** | Thuốc thiếu hạn sử dụng | Tệp kho dược thiếu hạn sử dụng cho kháng sinh | Commit đợt nhập | Lưu `expiry_date = NULL`, gán `expiry_status = 'unknown'`, khóa cách ly | DESIGNED — NOT TESTED |
| **IMP-16** | Xác minh HSD cho thuốc cách ly | Quản lý kho nhập HSD chuẩn qua RPC | Gọi RPC cập nhật HSD | Chuyển trạng thái lô sang `active`, mở khóa cho phép kê đơn | DESIGNED — NOT TESTED |
| **IMP-17** | Rollback khi có thú cưng nội trú | Thú cưng trong đợt nhập đang lưu viện nội trú | Gọi `rpc_import_rollback_job` | Hàm `app.validate_job_rollback` phát hiện vi phạm -> Hủy Rollback | DESIGNED — NOT TESTED |
| **IMP-18** | Rollback khi lô thuốc đã xuất bán | Lô thuốc trong đợt nhập đã phát sinh xuất bán lẻ | Gọi `rpc_import_rollback_job` | Phát hiện giao dịch thẻ kho tiêu hao -> Hủy giao dịch Rollback | DESIGNED — NOT TESTED |
| **IMP-19** | Rollback khi thú cưng có bệnh án | Thú cưng tạo tại quầy sau import phát sinh bệnh án | Gọi `rpc_import_rollback_job` | Kiểm tra qua `customer_id` phát hiện bệnh án -> Chặn Rollback (J1) | DESIGNED — NOT TESTED |
| **IMP-20** | Rollback khi khách hàng đã sửa tay | Nhân viên sửa tay thông tin khách hàng tại quầy | Gọi `rpc_import_rollback_job` | `version = 2`; hàm kiểm tra phát hiện vi phạm -> Chặn Rollback (J2) | DESIGNED — NOT TESTED |
| **IMP-21** | Hai dòng thiếu số lô cùng sản phẩm | Nhập 2 dòng cùng sản phẩm đều thiếu số lô | Commit đợt nhập | Sinh 2 mã duy nhất `UNKNOWN-<job>-<row>` -> Không xung đột khóa | DESIGNED — NOT TESTED |
| **IMP-22** | Tải lên tệp ZIP Bomb | Tệp Excel có tỷ lệ giải nén vượt 1:20 | Tải lên Parser Sandbox | Phát hiện tỷ lệ vượt ngưỡng -> Từ chối xử lý ngay lập tức (N-2) | DESIGNED — NOT TESTED |
| **IMP-23** | Tệp Excel chứa tấn công XXE | Tệp Excel chứa External Entity DTD | Parser XML xử lý | External Entity đã bị vô hiệu hóa -> Chặn đứng mã độc (N-2) | DESIGNED — NOT TESTED |
| **IMP-24** | Khử Formula Injection an toàn | Tệp có ô số lượng `-2` và ô ghi chú `=cmd` | Parser xử lý | Parse số trước -> Giữ nguyên `-2`; cột văn bản tự do chèn `' =cmd` (S-7) | DESIGNED — NOT TESTED |
| **IMP-25** | Tệp chứa macro độc hại | Tải lên tệp `.xlsm` chứa luồng VBA | Tải lên hệ thống | Bộ kiểm tra định dạng phát hiện -> Từ chối và ghi log cảnh báo (N-2) | DESIGNED — NOT TESTED |
| **IMP-26** | Tệp giả mạo đuôi mở rộng | Tệp đuôi `.xlsx` nhưng mang Magic Bytes khác | Gửi qua Gateway | Kiểm tra 4 bytes đầu không khớp `50 4B 03 04` -> Hủy với mã 400 (N-2) | DESIGNED — NOT TESTED |
| **IMP-27** | Hóa đơn lệch tổng tiền chi tiết | Hóa đơn có tổng tiền lệch tổng chi tiết dòng | Chạy Dry-run | Phát hiện độ lệch $>1.000$đ -> Báo lỗi `INVOICE_TOTAL_MISMATCH` (N-5) | DESIGNED — NOT TESTED |
| **IMP-28** | Hóa đơn chứa dòng trả hàng | Hóa đơn chứa dòng trả hàng (`return_product`) | Commit đợt nhập | Giảm trừ tổng tiền và tạo thẻ kho hoàn trả `return_receipt` (S-5, N-5) | DESIGNED — NOT TESTED |
| **IMP-29** | Hóa đơn thiếu khách hàng | Tệp hóa đơn không có thông tin khách hàng | Commit đợt nhập | Lưu `customer_id = NULL`, chuyển vào hàng đợi đối soát mờ (N-5) | DESIGNED — NOT TESTED |
| **IMP-30** | Thứ tự khử Formula Injection chuẩn | Tệp chứa số lượng `-5`, SĐT `+84988123456`, ghi chú `=SUM(A1:A10)` | Parser xử lý dữ liệu | Cột số lượng và SĐT giữ nguyên; ô ghi chú được đổi thành `'=SUM(A1:A10)` (S-7) | DESIGNED — NOT TESTED |
| **IMP-31** | Rollback thành công hoàn trả kho | Đợt nhập vật tư kho hợp lệ chưa phát sinh tiêu hao | Gọi `rpc_import_rollback_job` | Tạo thẻ kho `import_rollback`, khóa mềm lô hàng, cập nhật job `rolled_back` (S-5, T-1) | DESIGNED — NOT TESTED |
| **IMP-32** | Rollback xong import lại cùng SKU | Đợt nhập bị lỗi đã rollback hoàn tất (`is_deleted = TRUE`) | Tải lại tệp đã sửa mang cùng mã SKU và mã khách | Nhập thành công 100%, không bị lỗi duplicate key do index lọc `is_deleted = FALSE` (T-2) | DESIGNED — NOT TESTED |

---

## XIII. BẢNG TRUY VẾT QA ĐỘC LẬP TOÀN DIỆN & TRUNG THỰC (HONEST QA TRACEABILITY MATRIX v1.6.9)

> **CAM KẾT MINH BẠCH & TRUY VẾT DÒNG CODE THỰC TẾ:** Toàn bộ các phát hiện từ các đợt đánh giá độc lập của Claude QA (từ P1-A..P1-E, S-1..S-11, T-1..T-10, U-1..U-9, 3 Nhiệm vụ v1.6.8 đến toàn bộ Finding V-1..V-6, BYO-1..BYO-3 v1.6.9) đều được đối chiếu trực tiếp với vị trí phân mục, đoạn mã SQL/DDL và mã kịch bản kiểm thử trong tài liệu này. Trạng thái `CLOSED` chỉ được xác nhận khi có giải pháp kỹ thuật cụ thể và bằng chứng đối soát thực tế trong tài liệu.

### 1. Bảng Khắc Phục Toàn Diện Các Finding Từ Claude QA v1.6.8 (V-1 Đến V-6 & BYOD)

| Mã Finding | Phân Loại | Vấn Đề Thẩm Định Claude QA v1.6.8 | Giải Pháp Kiến Trúc & Kỹ Thuật v1.6.9 | Vị Trí Đối Chiếu Thực Tế | Trạng Thái v1.6.9 |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **V-1** | **BLOCKER (P2)** | **SQL Không Thể Hoạt Động:**<br>- `rpc_import_approve_job` query `app.users.role` (không có cột này), kiểm tra role `manager` (không tồn tại), kiểm tra `dry_run_passed` (CHECK không có).<br>- `rpc_revoke_staff_device` kiểm tra `manager` không tồn tại.<br>- `rpc_ensure_app_user` nhận tham số client tùy ý. | - Viết lại `rpc_import_approve_job`: Dùng `check_active_shift(auth.uid(), 'admin')`, kiểm tra `status = 'awaiting_approval'` khớp 100% CHECK `staging.import_jobs`.<br>- Sửa `rpc_revoke_staff_device` chỉ kiểm tra admin AAL2.<br>- Sửa `rpc_ensure_app_user` không nhận tham số, chỉ dùng `auth.uid()` server-side. | Mục V.6, Mục VII.5.C, Mục VII.5.A | **CLOSED (RESOLVED IN V1.6.9)** |
| **V-2** | **HIGH (P2)** | **Đếm Sai Số Bảng & Quyền RBAC:**<br>- Tài liệu ghi 37 bảng nhưng DDL thực tế có 39 bảng (34 app + 4 staging + 1 audit).<br>- `staff_device_sessions` bị gộp dòng staff_role_assignments (lộ token/fingerprint).<br>- `historical_loyalty_points` thiếu dòng RBAC và không có trong rollback. | - Cập nhật 39 bảng xuyên suốt Mục III.1, ERD, Mục VI.4.<br>- Tách dòng RBAC riêng cho `staff_device_sessions` (DENY mọi SELECT trực tiếp, kiểm tra qua RPC tối thiểu).<br>- Tách dòng RBAC riêng cho `historical_loyalty_points` (Admin only); thêm `is_deleted` và hỗ trợ rollback trong `rpc_import_rollback_job`. | Mục III.1, Mục III.2, Mục V.3, Mục VI.4 | **CLOSED (RESOLVED IN V1.6.9)** |
| **V-3** | **HIGH (P2)** | **Sổ Quyết Định & Nguồn Xác Nhận:**<br>- D-03 bị gán là PITR mã gốc v1.6.5 (v1.6.5 D-03 là SĐT).<br>- Thiếu quyết định về nhiều khách dùng chung SĐT (P1-E Invariant).<br>- Antigravity tự tuyên bố "đóng băng vĩnh viễn" vượt thẩm quyền. | - Thêm quyết định độc lập **D-PHONE / D-21** về nhiều khách cùng SĐT (NO UNIQUE ON PHONE).<br>- Sửa lịch sử D-03; phân biệt rõ Daily Backup $0 với PITR trả phí (DEFERRED).<br>- Đổi banner đóng băng thành "Đề xuất chuẩn hóa chờ Chủ dự án ban hành".<br>- Bổ sung cột "Nguồn xác nhận" phân định: Chat 05/11/2026, Repo-inherited, Deferred. | Mục XIV.1, Mục XIV.2, `OWNER_DECISION_REGISTER.md` | **CLOSED (RESOLVED IN V1.6.9)** |
| **BYO-1** | **MEDIUM (P2)** | **Tầng 1 BYOD Tự Mâu Thuẫn:** `<input capture>` mở Camera app gốc thường lưu ảnh vào Camera Roll. Khẳng định "sandbox cấm tuyệt đối" là sai thực tế. | - Ưu tiên Luồng Chuẩn: `getUserMedia()` trực tiếp vào RAM, không qua Camera app gốc.<br>- Luồng ngoại lệ: `<input capture>` có rủi ro camera roll, áp dụng quy trình nhân sự PDPD.<br>- Thay "đảm bảo tuyệt đối" bằng "giảm thiểu rủi ro"; đánh dấu test thiết bị thật Phase 4B. | Mục VII.5.C.1 | **CLOSED (RESOLVED IN V1.6.9)** |
| **BYO-2** | **MEDIUM (P2)** | **Tầng 3–4 Thiếu Thực Thi:** Thiếu RPC đăng ký/duyệt/verify thiết bị; `is_trusted DEFAULT TRUE` tự tin cậy; `CASCADE` on delete; Remote Wipe không chạy offline và không xóa camera roll. | - Đổi `is_trusted DEFAULT FALSE`, đổi `ON DELETE RESTRICT`.<br>- Bổ sung đầy đủ 4 RPCs: `rpc_register_staff_device`, `rpc_approve_staff_device`, `rpc_revoke_staff_device`, `rpc_verify_staff_device`.<br>- Minh bạch giới hạn Remote Wipe: bổ sung thu hồi Refresh Token trên Supabase Auth, JWT 1h.<br>- Mở rộng kịch bản kiểm thử SEC-20. | Mục VII.5.C.3, Mục VII.5.C.4, Mục XII.1 (SEC-20) | **CLOSED (RESOLVED IN V1.6.9)** |
| **BYO-3** | **LOW (P3)** | **Khử Metadata Server-side:** Gọi `sharp.withMetadata()` có thể giữ lại metadata; FFmpeg `-c copy` có thể sót atom QuickTime/stream metadata. | - Sharp: Không gọi `.withMetadata()` (mặc định xóa sạch metadata), thêm xoay orientation, test `exiftool` output.<br>- FFmpeg: Thêm `-map_chapters -1 -fflags +bitexact`, test `ffprobe` output.<br>- Tách worker xử lý video khỏi worker Excel 10MB. | Mục VII.5.C.2 | **CLOSED (RESOLVED IN V1.6.9)** |
| **V-5** | **MEDIUM (P2)** | **Lệch Loại Lịch Hẹn & Hóa Đơn Tự Do:**<br>- `rpc_create_customer_appointment` nhận `vaccine`, `recheck` nhưng CHECK table chỉ `('medical', 'spa')` -> Lỗi CSDL.<br>- Dòng invoice tự do không có catalog có thể bypass che giấu lâm sàng. | - Đồng bộ CHECK `app.appointments.appointment_type IN ('medical', 'spa', 'vaccine', 'recheck')` khớp 100% với RPC.<br>- Trigger `fn_derive_invoice_item_clinical_hiding`: Dòng tự do không có catalog bắt buộc mặc định ẩn (`is_clinical_hidden = TRUE`); chặn UPDATE trực tiếp qua API. | Mục III.2, Mục VII.4.E | **CLOSED (RESOLVED IN V1.6.9)** |
| **V-6** | **LOW (P3)** | **Phép Tính Chi Phí Sai Số Học:** Tổng chi phí Production ghi $34.50 – $39.50 nhưng cộng các số hạng là $34.50 – $40.50; SMS ghi eSMS thay vì Zalo ZNS. | - Sửa tổng Production đúng số học: **$34.50 – $40.50 / tháng**.<br>- Cập nhật dòng SMS OTP thành **Zalo ZNS theo D-05**.<br>- Ghi rõ đây là dự toán tham chiếu kiến trúc, không phải ngân sách đã duyệt. | Mục X (Bảng chi phí) | **CLOSED (RESOLVED IN V1.6.9)** |
| **P3 Khác**| **LOW (P3)** | **FSM validating & RPO:**<br>- FSM frontend thêm `validating` khác baseline.<br>- RPO $\le 5$ phút ghi nhận khi PITR chưa duyệt. | - Thêm Note giải trình: `validating` là bước trung gian Zod/Turnstile trên client làm rõ cho baseline `docs/architecture.md`.<br>- Sửa RPO daily dump $\le 24$h; ghi rõ RPO 5m PITR không áp dụng vì PITR DEFERRED. | Mục VIII.1, Mục IX.2 | **CLOSED (RESOLVED IN V1.6.9)** |

---

### 2. Bảng Truy Vết Ba Nhiệm Vụ Trọng Tâm v1.6.8 (Three Core Objectives Traceability Matrix)

| Mã Nhiệm Vụ | Phân Loại | Mục Tiêu & Vấn Đề Xử Lý Trong v1.6.8 | Giải Pháp Kiến Trúc & Kỹ Thuật Đã Thực Hiện | Vị Trí Đối Chiếu Thực Tế | Kiểm Chứng & Verification | Trạng Thái v1.6.8 |
| :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **V168-OBJ-1** | **ARCH / SQL** | **Hợp Nhất SQL Bị Trùng & Chuyển RPC Nghiệp Vụ Về Đúng Phân Hệ:**<br>- Trùng lặp `app.rpc_import_approve_job` tại Mục V.6 và VI.3.<br>- Trùng lặp `app.rpc_ensure_app_user` tại Mục V.6 và VII.5.A.<br>- Đặt nhầm 3 RPCs nghiệp vụ (`rpc_add_invoice_item`, `rpc_create_customer_appointment`, `rpc_register_customer_pet`) trong Mục V.6. | - Loại bỏ hoàn toàn bản trùng `rpc_import_approve_job` khỏi Mục VI.3, giữ định nghĩa duy nhất chuẩn mực tại Mục V.6.<br>- Loại bỏ bản trùng `rpc_ensure_app_user` khỏi Mục V.6, giữ định nghĩa chuẩn mực duy nhất tại Mục VII.5.A.<br>- Di chuyển toàn bộ 3 RPCs nghiệp vụ sang Mục VII.4 (mục D, E, F) đúng ranh giới kiến trúc phân hệ.<br>- Bảo đảm mỗi hàm PL/pgSQL có đúng 1 định nghĩa duy nhất toàn bộ tài liệu. | Mục V.6, Mục VI.3, Mục VII.4, Mục VII.5.A | Script `find_duplicates.cjs` trả về 0 duplicate functions, 0 duplicate tables, 0 duplicate views, 0 duplicate triggers | **CLOSED (RESOLVED IN V1.6.8)** |
| **V168-OBJ-2** | **GOVERNANCE** | **Đóng Băng Vĩnh Viễn Sổ Đăng Ký Quyết Định (Freeze Decision Register):**<br>- Tránh tình trạng đánh số lại hoặc hạ cấp quyết định đã được Chủ dự án chốt.<br>- Giữ bất biến 20 mã quyết định gốc D-01..D-20 và 4 mã mở rộng. | - Kích hoạt Banner Thông Báo Đóng Băng Vĩnh Viễn tại Mục XIV.1 và tài liệu độc lập `OWNER_DECISION_REGISTER.md`.<br>- Toàn bộ 24/24 mã quyết định giữ nguyên trạng thái 100% CLOSED (`APPROVED` hoặc `CONFIRMED`).<br>- Quy định bất biến: Tuyệt đối không thay đổi mã số, không đánh số lại. Mọi quyết định mới trong tương lai bắt đầu từ mã **D-21**. | Mục XIV.1, Mục XIV.2, `OWNER_DECISION_REGISTER.md` | Đối chiếu 24/24 mã quyết định khớp 100% với biên bản Chủ dự án xác nhận ngày 05/11/2026 | **CLOSED (RESOLVED IN V1.6.8)** |
| **V168-OBJ-3** | **SECURITY / BYOD** | **Hoàn Thiện Kiến Trúc An Ninh BYOD 5 Lớp (Solving D-20):**<br>- Cho phép nhân viên dùng điện thoại cá nhân chụp ảnh/quay video thú cưng lưu viện nhưng phải ngăn chặn rò rỉ hình ảnh và tuân thủ PDPD. | - Xây dựng kiến trúc 5 tầng hoàn chỉnh: (1) In-memory capture qua HTML5 PWA, cấm ghi vào thư viện máy; (2) Khử EXIF/GPS 2 tầng (Canvas client + Sharp/FFmpeg worker); (3) DDL bảng `app.staff_device_sessions` và RPC `app.rpc_revoke_staff_device` (Admin AAL2); (4) Hook PWA Remote Wipe zeroize sạch cache/IndexedDB khi bị thu hồi phiên; (5) Giới hạn kích thước ảnh $\le 15$MB, video $\le 50$MB/60s, Signed URL 15m, auto-purge 60 ngày.<br>- Cập nhật kịch bản kiểm thử SEC-20. | Mục VII.5.C, Mục VI.4, Mục XII.1 (SEC-20) | SEC-20 (DESIGNED — NOT TESTED), DDL & RPC biên dịch chuẩn không lỗi | **CLOSED (RESOLVED IN V1.6.8)** |

---

### 3. Bảng Khắc Phục Các Finding Từ Claude QA v1.6.6 (U-1 Đến U-9)

| Mã Finding | Phân loại | Tóm tắt Vấn đề Phát hiện trong v1.6.6 | Giải pháp Khắc phục Triệt để trong v1.6.7 | Vị trí Đối chiếu Thực tế | Test Case Xác minh | Trạng thái v1.6.7 |
| :--- | :---: | :--- | :--- | :--- | :---: | :---: |
| **U-1** | **P2** | **Ký hiệu Dollar-Quote bị hỏng:** 8 hàm dùng `AS $` / `$;` thay vì `$$` do lỗi xử lý chuỗi JavaScript. | Thay thế 100% cú pháp bằng chuỗi định danh `AS $$` và `END;\n$$;`. Kiểm tra tự động 0 lỗi `AS $`. | Mục III.2, Mục V.3, Mục VII.3, Mục VII.5 | SEC-05, 12, 13, 31, 57..60 | **CLOSED (RESOLVED IN V1.6.7)** |
| **U-2** | **P2** | **DDL `invoice_items` không khớp trigger/RPC:** Thiếu cột `is_deleted`; CHECK `item_type` thiếu các giá trị mới; view khách chưa lọc `is_deleted`. | Thêm cột `is_deleted BOOLEAN NOT NULL DEFAULT FALSE` vào `app.invoice_items`; mở rộng CHECK gồm cả 7 loại; cập nhật `customer_invoice_items_view` có `ii.is_deleted = FALSE`. | Mục III.2 (Nhóm 7), Mục VII.2.A | SEC-04, IMP-31, 32 | **CLOSED (RESOLVED IN V1.6.7)** |
| **U-3** | **P2 / SEC** | **Lỗ hổng IDOR & lỗi cột trong `rpc_create_customer_appointment`:** Khách đặt lịch cho thú cưng người khác; dùng cột `notes` không tồn tại; thiếu `ORDER BY` khi chọn khách; thiếu kiểm tra loài/giới tính thú cưng. | Bổ sung chốt chặn `WHERE id = p_pet_id AND customer_id = v_cust_id`; kiểm tra ngày tương lai và loại lịch hẹn; chèn đúng cột `source = 'portal'` (bỏ `notes`); thêm `ORDER BY (link_status = 'verified') DESC`; kiểm tra `p_species` và `p_gender` trong `rpc_register_customer_pet`. | Mục VII.3, Mục VII.4 | SEC-57, SEC-16, SEC-17 | **CLOSED (RESOLVED IN V1.6.7)** |
| **U-4** | **P2 / SEC** | **Nguy cơ Bypass Che giấu Lâm sàng qua `item_type`:** Client gửi `item_type = 'retail_product'` kèm ID thuốc điều trị có thể vượt mặt rào chắn; `COALESCE` dùng `FALSE` ngược nguyên tắc fail-safe. | Viết lại trigger `fn_derive_invoice_item_clinical_hiding`: Tra cứu catalog sản phẩm/dịch vụ **TRƯỚC**, tuyệt đối không tin client; ép buộc `is_clinical_hidden := TRUE` cho toàn bộ thuốc/vật tư y tế; áp dụng fail-safe `COALESCE(..., TRUE)`. | Mục III.2 (Nhóm 7) | SEC-58, SEC-12, SEC-13 | **CLOSED (RESOLVED IN V1.6.7)** |
| **U-5** | **P2** | **Thiếu SQL cho `rpc_import_approve_job`:** Bảng XIII v1.6.6 ghi đã bổ sung nhưng trong thân tài liệu chỉ có tên hàm. | Cung cấp toàn văn mã nguồn PL/pgSQL đầy đủ cho `app.rpc_import_approve_job` với kiểm tra vai trò Quản lý/Admin, bắt buộc MFA AAL2, và thực thi Two-Man Rule bất biến (`uploaded_by <> auth.uid()`). | Mục V.3 | SEC-59, IMP-18 | **CLOSED (RESOLVED IN V1.6.7)** |
| **U-6** | **P3** | **Ghi PII vào Audit Log & Lỗi FK `app.users`:** Trigger đăng ký ghi thô phone/email vào audit log; lỗi trigger khiến người dùng thiếu `app.users`. | Mask số điện thoại (`+84***789`) và tách domain email (`split_part`) trong audit log; bổ sung hàm helper `app.rpc_ensure_app_user` tự động bù bản ghi thiếu để không bao giờ nghẽn RPC tiếp theo. | Mục VII.5.A | SEC-17, SEC-18 | **CLOSED (RESOLVED IN V1.6.7)** |
| **U-7** | **P2** | **Sổ Quyết Định Bị Đánh Số Lại:** Mã D-01..D-20 trong v1.6.6 bị lệch so với v1.6.5 và các quyết định Chủ dự án đã phê duyệt. | Khôi phục 100% cấu trúc mã quyết định gốc D-01..D-20 theo đúng baseline v1.6.5; sử dụng các mã mở rộng có định danh chuẩn (`D-01-PRO`, `D-06-INVOICE`, `D-08-NIGHT`, `D-LINK`); lập Bảng Ánh Xạ Quyết Định chi tiết. | Mục XIV.1, Mục XIV.2 | — | **CLOSED (RESOLVED IN V1.6.7)** |
| **U-8** | **P3** | **Tính Toán Chi Phí & Giới Hạn Gói Free:** Cột Bootstrap cộng sai thành $6-$9; thiếu cảnh báo Supabase Free tự pause và chỉ dùng dữ liệu giả lập. | Tính toán lại chi phí Bootstrap chính xác là **$6.00/tháng** (0+5+0+1+0+0+0); bổ sung cảnh báo bắt buộc: Supabase Free chỉ dùng cho môi trường đánh giá/dev với dữ liệu giả lập (mock data); chỉ nâng Pro ($25) khi được duyệt riêng. | Mục X.2 | — | **CLOSED (RESOLVED IN V1.6.7)** |
| **U-9** | **P3** | **Hoàn Thiện Hàm `rpc_add_invoice_item`:** Đơn vị giá tin client; thiếu kiểm tra sản phẩm active/deleted; thiếu kiểm tra quantity âm; không cập nhật subtotal. | Hoàn thiện SQL: Tra cứu đơn giá catalog nếu client không truyền; kiểm tra `is_active = TRUE AND is_deleted = FALSE`; chặn `quantity <= 0` cho hàng thông thường; tự động cập nhật đồng bộ cả `subtotal_amount` và `total_amount` của hóa đơn; ghi log kiểm toán. | Mục VII.3 | SEC-60 | **CLOSED (RESOLVED IN V1.6.7)** |

---

### 4. Bảng Truy Vết Các Nhóm Finding T-1 Đến T-10 Từ Claude QA v1.6.5

| Mã Finding | Mức độ | Trạng thái v1.6.5 | Tóm tắt Giải pháp Khắc phục Toàn diện v1.6.7 | Vị trí Đối chiếu v1.6.7 | Test Case Xác minh | Trạng thái v1.6.7 |
| :--- | :---: | :---: | :--- | :--- | :---: | :---: |
| **T-1** | **HIGH** | PARTIAL | **Bộ Test Matrix Hoàn Thiện (92 Test Cases):** Khôi phục toàn bộ các kịch bản kiểm thử chuyên sâu (ca đêm 23:30/02:30, session UTC, audit append-only, revert draft, locked record, Signed URL 15m, revoked media, cancel in_progress, quarantine block, AAL2, EXIF zero leakage, dual status phone); bổ sung SEC-57..60 kiểm thử IDOR, bypass lâm sàng, Two-Man và catalog price. | Mục XII.1, XII.2 | SEC-01..60, IMP-01..32 | **CLOSED (RESOLVED IN V1.6.7)** |
| **T-2** | **HIGH** | PARTIAL | **Hỗ Trợ Re-import Sau Rollback:** Thêm `is_deleted` cho cả `products`, `services`, `invoice_items`; 4 partial unique indexes nguồn có điều kiện `WHERE is_deleted = FALSE`; rollback đánh dấu `is_deleted = TRUE` cho phép import lại cùng SKU/mã. | Mục III.2, Mục III.4, Mục V.3 | IMP-32, IMP-31 | **CLOSED (RESOLVED IN V1.6.7)** |
| **T-3** | **HIGH** | PARTIAL | **Khóa Quyền Mặc Định Toàn Cục & Schema:** Thực thi `ALTER DEFAULT PRIVILEGES FOR ROLE postgres REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon;` và `IN SCHEMA public, app`; bắt buộc toàn bộ RPC phải có wrapper tại schema `public` và kiểm soát GRANT tường minh. | Mục II.2.B, Mục VII.2 | SEC-02, 34, 44 | **CLOSED (RESOLVED IN V1.6.7)** |
| **T-4** | **HIGH** | PARTIAL | **Hiển Thị Hóa Đơn An Toàn & Khóa Y Khoa:** Tra cứu catalog trước khi gán cờ che giấu lâm sàng; phân định an toàn bán lẻ/spa; cấm 100% hiển thị thuốc kê đơn cho khách; có SQL `rpc_add_invoice_item` đầy đủ. | Mục III.2, Mục VII.3, Mục VII.4 | SEC-04, 12, 13, 58, 60 | **CLOSED (RESOLVED IN V1.6.7)** |
| **T-5** | **MEDIUM** | PARTIAL | **Chi Tiết Thực Thi Rollback & Two-Man Rule:** Kiểm tra `quantity_on_hand > 0` chống chèn giao dịch thẻ kho -0; xóa mềm chi tiết hóa đơn; có SQL đầy đủ cho `app.rpc_import_approve_job` kiểm tra Admin AAL2 và `uploaded_by <> auth.uid()`. | Mục V.3 | SEC-59, IMP-18, 31 | **CLOSED (RESOLVED IN V1.6.7)** |
| **T-6** | **MEDIUM** | CLOSED | **An Toàn Trigger Đăng Ký & Lazy Profile:** Dùng `TEXT` cho số điện thoại chống tràn E.164; bọc khối `EXCEPTION WHEN OTHERS THEN` không chặn Auth; mask PII trong audit log; có helper `rpc_ensure_app_user`; có SQL đặt lịch và đăng ký thú cưng lazy. | Mục VII.4, Mục VII.5.A | SEC-17, 30, 57 | **CLOSED (RESOLVED IN V1.6.7)** |
| **T-7** | **MEDIUM** | CLOSED | **Phân Tách Vai Trò SĐT Tái Cấp:** Tiếp tân tiếp nhận và lập yêu cầu đối soát tại quầy (`user_link_requests`); chỉ Quản trị viên (Admin) có MFA AAL2 mới được quyền thực thi `rpc_resolve_recycled_phone`; không thu CCCD thô (D-13). | Mục VII.3, Mục VII.4.B | SEC-21..24, 43 | **CLOSED (RESOLVED IN V1.6.7)** |
| **T-8** | **MEDIUM** | CLOSED | **Chuẩn Hóa Quản Trị Media Lưu Viện:** Cấu hình thời hạn Signed URL chính xác 15 phút (900s); xử lý ảnh ($le 15$MB) và video ngắn ($le 60$s, $le 50$MB); thống nhất mốc 60 ngày tự động xóa tính từ ngày tải lên (`uploaded_at`) theo đúng quyết định D-10 của Chủ dự án. | Mục VI.2, Mục VII.5.C | SEC-10, 11, 50, 55 | **CLOSED (RESOLVED IN V1.6.7)** |
| **T-9** | **LOW** | CLOSED | **Chuẩn Hóa Nhãn Hạ Tầng Trung Lập & Chi Phí:** Nhãn "Ứng viên 1" và "Ứng viên 2"; kế hoạch đánh giá Cloudflare Pages (D-17); chuẩn hóa dự toán Bootstrap $6.00/tháng và Production $34.50-$39.50/tháng; nêu rõ chính sách không mua Pro/PITR khi chưa duyệt. | Mục X.1, Mục X.2 | — | **CLOSED (RESOLVED IN V1.6.7)** |
| **T-10** | **LOW** | CLOSED | **Thống Nhất Tham Chiếu & Số Lượng RPCs:** Đồng bộ danh mục 46 RPCs (8 Khách hàng + 38 Nhân viên) kèm wrapper schema `public` và phân quyền rõ ràng. | Mục VII.3, Mục XIII | — | **CLOSED (RESOLVED IN V1.6.7)** |

---

### 3. Bảng Khắc Phục Các Finding S-1 Đến S-11 Từ Claude QA v1.6.4

| Mã Finding | Mức độ | Trạng thái v1.6.4 | Tóm tắt Giải pháp Khắc phục Thực tế | Vị trí Đối chiếu v1.6.7 | Test Case Xác minh | Trạng thái v1.6.7 |
| :--- | :---: | :---: | :--- | :--- | :---: | :---: |
| **S-1** | **HIGH** | CLOSED | **Khôi phục toàn bộ Mục VII:** Phục hồi 8 RPCs Khách hàng, 38 RPCs Nhân viên, Trigger đăng ký tài khoản, Anti-enumeration, Rate limiting và Media governance pipeline. | Mục VII.1..VII.5 | SEC-17..20, 33..38 | **CLOSED** |
| **S-2** | **HIGH** | CLOSED | **Quyền thực thi RPC & Bảo vệ Schema nội bộ:** Bổ sung khối lệnh `REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public, app FROM PUBLIC, anon;` và `GRANT EXECUTE ON FUNCTION public.rpc_* TO authenticated;`. | Mục II.2.B, Mục VII.2 | SEC-02, 34 | **CLOSED** |
| **S-3** | **HIGH** | CLOSED | **Quy trình SĐT Tái cấp An toàn:** Đặc tả chi tiết `rpc_resolve_recycled_phone` với 5 bước kiểm tra: quyền Admin, AAL2, ID cũ <> mới, xác minh pending, cập nhật `is_phone_archived`. | Mục VII.4.B | SEC-21..24 | **CLOSED** |
| **S-4** | **HIGH** | CLOSED | **Chính sách Ẩn/Hiện Chi tiết Hóa đơn:** Mặc định `is_clinical_hidden = TRUE` cho dòng thuốc; cấm 100% hiển thị thuốc kê đơn cho khách. | Mục III.2, Mục VII.3 | SEC-04, 12, 13, 58 | **CLOSED** |
| **S-5** | **HIGH** | CLOSED | **Chống Race Condition trong Rollback:** Khóa dòng `FOR UPDATE` trên `staging.import_jobs` và `app.invoices`. | Mục V.3 | IMP-18, 31 | **CLOSED** |
| **S-6** | **HIGH** | CLOSED | **Làm rõ Ranh giới Hạ tầng Worker:** Trình bày chi tiết kiến trúc 1 VPS Containerized non-root ($5/tháng) theo quyết định D-14 của Chủ dự án. | Mục IX.1, Mục X.2 | — | **CLOSED** |
| **S-7** | **MEDIUM** | CLOSED | **Cơ chế Khóa Y lệnh Nội trú:** Bổ sung kiểm tra y lệnh chưa khóa (`is_locked = FALSE`) trước khi checkoff. | Mục VII.3 | SEC-48 | **CLOSED** |
| **S-8** | **MEDIUM** | CLOSED | **Trigger Tăng Version Khi Sửa Thủ Công:** Gắn trigger `trg_bump_version_customers/products/services/invoices` tăng `version` và cập nhật `updated_at`. | Mục III.2 | IMP-25, 26 | **CLOSED** |
| **S-9** | **MEDIUM** | CLOSED | **Ràng buộc Media với Bản tin Đã duyệt:** Chặn cấp Signed URL cho bản tin chưa publish hoặc đã thu hồi. | Mục VI.2, Mục VII.5.C | SEC-11, 49, 51 | **CLOSED** |
| **S-10** | **LOW** | CLOSED | **Đồng bộ Định danh app.users ↔ auth.users:** Khóa chính `app.users.id` tham chiếu trực tiếp `auth.users(id)`. | Mục III.1 | SEC-39 | **CLOSED** |
| **S-11** | **LOW** | CLOSED | **Phân biệt Truy cập Admin Đúng ca vs Trái ca:** Chỉ ghi nhận log cảnh báo khi Admin truy cập ngoài ca trực. | Mục VII.3 | SEC-07, 08 | **CLOSED** |

---

### 4. Bảng Bảo Toàn 5 Trụ Cột Bất Biến (P1-A Đến P1-E Invariants)

| Trụ Cột | Mức độ | Định chế Bất biến | Cơ chế Bảo vệ Kỹ thuật Thực tế | Vị trí Đối chiếu v1.6.7 | Test Case Xác minh | Trạng thái v1.6.7 |
| :--- | :---: | :---: | :--- | :--- | :---: | :---: |
| **P1-A** | **CRITICAL** | CLOSED | **Không nhập bệnh án cũ từ GPet:** Dữ liệu lâm sàng cũ được lưu trữ tách biệt hoàn toàn; chỉ nhập dữ liệu danh mục thương mại. | Mục I.2, Mục V.1 | IMP-13, 14 | **CLOSED** |
| **P1-B** | **CRITICAL** | CLOSED | **Import Center độc lập định dạng:** Kiến trúc Generic Staging với cấu trúc JSONB chuẩn hóa, không phụ thuộc phần mềm nguồn. | Mục V.2 | IMP-01..12 | **CLOSED** |
| **P1-C** | **CRITICAL** | CLOSED | **Bảo vệ bệnh án không xóa dây chuyền:** Toàn bộ bảng lâm sàng, y lệnh, nội trú, thẻ kho đều dùng `ON DELETE RESTRICT`; Kiểm tra 8 chốt chặn trước khi rollback. | Mục III.2, Mục V.3 | SEC-09, IMP-17..20 | **CLOSED** |
| **P1-D** | **CRITICAL** | CLOSED | **Ranh giới bảo mật Schema:** Bảng nghiệp vụ đặt tại schema `app`; Schema `public` chỉ chứa view an toàn và wrapper RPC; Khách hàng không truy cập trực tiếp bảng gốc. | Mục II.2.B, Mục VII.2 | SEC-01..04, 34..36 | **CLOSED** |
| **P1-E** | **CRITICAL** | CLOSED | **Không Unique Số Điện Thoại Khách:** Xóa bỏ chỉ mục duy nhất trên SĐT; Cho phép nhiều hồ sơ khách hàng dùng chung SĐT; Liên kết tài khoản portal độc lập với hồ sơ Excel. | Mục III.2, Mục III.4 | SEC-25, 26, 56 | **CLOSED** |

---

## XIV. DANH SÁCH 20 QUYẾT ĐỊNH CỐT LÕI CẦN CHỦ DỰ ÁN DUYỆT (OWNER DECISION REGISTER)

### 1. Bảng Ánh Xạ Quyết Định Chủ Dự Án (Owner Decision Mapping Matrix)

> [!IMPORTANT]
> ### ĐỀ XUẤT CHUẨN HÓA BỘ MÃ QUYẾT ĐỊNH (PROPOSED DECISION REGISTER BASELINE v1.6.9)
> - **Mục đích:** Đồng bộ hóa danh mục 20 quyết định vận hành cốt lõi (D-01 đến D-20), các mã mở rộng và mã mới **D-PHONE / D-21** (Chính sách nhiều khách hàng cùng số điện thoại - P1-E Invariant) nhằm phục vụ quản trị dự án minh bạch giữa Chủ dự án, ChatGPT điều phối, Antigravity và Claude QA.
> - **Phân định thẩm quyền:** Toàn bộ bảng đăng ký này là **bản đề xuất chuẩn hóa kỹ thuật chờ Chủ dự án (hoặc ChatGPT điều phối) chính thức ký duyệt/ban hành**. Antigravity tuyệt đối không tự đóng băng, không tự phê duyệt thay Chủ dự án.
> - **Phân loại trạng thái minh bạch:** Tách biệt rõ ràng giữa các mục đã được Chủ dự án duyệt (`APPROVED`), các mục chờ xác minh giấy phép (`PENDING VERIFICATION`), các mục đề xuất kỹ thuật (`PROPOSED`), và các khoản chi trả phí đang hoãn (`DEFERRED`).

> **MỤC ĐÍCH ÁNH XẠ (SOLVING U-7, V168-OBJ-2 & V-3):** Bảng này đối chiếu mã quyết định hiện tại, mã lịch sử (v1.6.5), tên quyết định, trạng thái thẩm quyền, nguồn xác nhận (Chat 05/11/2026, Repo-inherited hoặc Deferred) và ràng buộc kỹ thuật bắt buộc.

| Mã Gốc (v1.6.5) | Mã Mở Rộng v1.6.7 | Tên Quyết Định Vận Hành / Kỹ Thuật | Trạng Thái Phê Duyệt Cập Nhật (05/11/2026) | Ghi Chú & Ràng Buộc Kiến Trúc Bắt Buộc |
| :---: | :---: | :--- | :---: | :--- |
| **D-01** | **D-01** | Mô hình Dịch vụ Backend Cốt lõi (Supabase Managed) | **`APPROVED — ARCHITECTURE ONLY`** | Duyệt hướng kiến trúc Supabase PostgreSQL, Auth, Storage. **Tuyệt đối chưa mua gói trả phí hay mở project production.** |
| — | **D-01-PRO** | Chính sách Nâng cấp Gói Supabase Pro | **`APPROVED — PROCUREMENT POLICY`** | Chỉ nâng Pro ($25/tháng) khi chứng minh nhu cầu và có phê duyệt riêng. Giai đoạn dev dùng Free tier + dữ liệu giả lập. |
| **D-02** | **D-02** | Phạm vi Dữ liệu Nhập từ GPet cũ | **`APPROVED — DATA SCOPE`** | Chỉ nhập dữ liệu thương mại (khách, sản phẩm, dịch vụ, tồn đầu kỳ, hóa đơn); bệnh án cũ lưu riêng, không chuyển đổi. |
| **D-03** | D-03-DR *(Mã gốc v1.6.5 là SĐT)* | Chính sách Sao lưu Khắc phục Thảm họa (DR) & PITR | **`PENDING — NOT DECIDED`**<br>*(Đề xuất kỹ thuật: Sao lưu hàng ngày; PITR chưa quyết định)* | Chủ dự án chưa chốt mua PITR hay chọn chính sách sao lưu cuối cùng. Giữ đề xuất sao lưu hàng ngày (`pg_dump` GPG đẩy lên R2, $0) chờ duyệt; không cam kết RPO 24h khi chưa được phê duyệt. |
| **D-PHONE** | **D-03 (v1.6.5)** | Chính sách Nhiều Hồ Sơ Khách Hàng Cùng Số Điện Thoại | **`APPROVED`**<br>*(Nguồn: P1-E Invariant & Xác nhận Chủ dự án 06/11/2026)* | Mỗi khách có UUID riêng; **CSDL CẤM UNIQUE trên phone_number**; không tự động gom gộp/liên kết tài khoản/hóa đơn theo SĐT. |
| **D-04** | **D-04** | Nhà cung cấp Captcha & Chống Tấn Công DDOS | **`APPROVED — SERVICE SELECTION`** | Chủ dự án chọn Phương án A: **Cloudflare Turnstile** ($0, bảo vệ quyền riêng tư, không làm phiền người dùng). |
| **D-05** | **D-05** | Nhà cung cấp SMS OTP Brandname | **`APPROVED — SERVICE SELECTION`** | Chủ dự án chọn **Zalo ZNS (Zalo OA)** cho môi trường sản xuất để tối ưu chi phí (~250-400đ/tin); dev dùng sandbox/test numbers ($0). |
| **D-06** | **D-06** | Chính sách Bảo mật MFA Theo Hành động Nhạy cảm | **`APPROVED — SECURITY POLICY`** | Bắt buộc AAL2 cho Manager/Admin khi thực hiện hành động nhạy cảm (rollback, duyệt import, liên kết SĐT tái cấp). |
| — | **D-06-INVOICE**| Hiển thị Dòng Bán lẻ / Spa & Che giấu Y khoa | **`APPROVED — INVOICE VISIBILITY`** | Hiện dòng bán lẻ/spa an toàn; **cấm tuyệt đối 100% hiển thị thuốc kê đơn, thuốc tiêm, phác đồ điều trị nội bộ cho khách.** |
| **D-07** | **D-07** | Quy tắc Hai Người Phê duyệt Đợt Nhập (Two-Man Rule)| **`APPROVED — GOVERNANCE POLICY`** | Chủ dự án chọn làm theo đề xuất: **Bắt buộc Two-Man Rule ở CSDL** (`approved_by <> uploaded_by`) và Admin AAL2; không dùng cờ override. |
| **D-08** | **D-08** | Cơ chế Phân ca & Quản lý Ca trực | **`APPROVED — SCHEDULING DESIGN`** | Ca trực linh hoạt do Quản lý thiết lập theo lịch thực tế; không hardcode ca cố định 08-14/14-21/21-08. |
| — | **D-08-NIGHT** | Vận hành Trực Đêm tại Bệnh viện | **`CONFIRMED — OPERATIONS`** | **Có người trực tại viện qua đêm**; chưa có khung giờ cố định; tuyệt đối chưa tuyên bố dịch vụ 24/24 trên website. |
| **D-09** | **D-09** | Chính sách Xử lý Số dư Điểm Tích lũy Cũ | **`APPROVED — DATA POLICY`** | Lưu bền vững trong `app.historical_loyalty_points`; khóa không cho tự quy đổi voucher; chờ chính sách mới. |
| **D-10** | **D-10** | Thời hạn Tự động Xóa Video/Ảnh Nội trú | **`APPROVED — RETENTION POLICY`** | **Xóa sau 60 ngày kể từ thời điểm tải lên (`uploaded_at`)**, không neo theo ngày xuất viện. |
| **D-11** | **D-11** | Rà soát Tuân thủ Pháp lý PDPD (Nghị định 13/2023) | **`APPROVED — INTERNAL REVIEW PROCESS`**<br>*(Nguồn: Chat 05/11/2026)* | Chủ dự án chọn: **Giao nhân sự nội bộ tự rà soát quy trình**, chưa đưa dữ liệu thật vào hệ thống khi chưa hoàn tất; không coi là đã đạt chuẩn pháp luật. |
| **D-12** | **D-12** | Hiển thị Thông tin Y khoa trên Portal Khách hàng | **`APPROVED — CUSTOMER CLINICAL VISIBILITY`** | Chỉ cho xem chẩn đoán/bản tin đã Bác sĩ duyệt (`published`); tuyệt đối giấu thuốc và y lệnh. |
| **D-13** | **D-13** | Tối thiểu hóa Thu thập Định danh Khách hàng | **`APPROVED — PRIVACY DESIGN`** | Không thu thập số CCCD thô trên portal; chỉ đối soát tại quầy khi cần. |
| **D-14** | **D-14** | Kiến trúc Cô lập Máy chủ Worker (1 VPS Container) | **`APPROVED — DESIGN ONLY`**<br>*(Nguồn: Xác nhận Chủ dự án 06/11/2026)* | 1 VPS; Container cách ly parser; quyền, credential, filesystem riêng; bảo vệ dữ liệu sao lưu. Chưa phê duyệt thuê VPS hoặc chi phí vận hành. |
| **D-15** | **D-15** | Chính sách Xử lý Mặt hàng Thiếu Hạn Sử Dụng | **`APPROVED — INVENTORY POLICY`** | Không tự sinh HSD; gán `unknown` và khóa cách ly (`quarantined`) cho đến khi thủ kho xác minh. |
| **D-16** | **D-16** | Nơi Chạy API Backend & Quản lý Bí mật | **`APPROVED — ARCHITECTURE`** | Supabase Edge Functions & Vault ($0 phụ phí, Singapore region); không chạy VPS API riêng. |
| **D-17** | **D-17** | Nền tảng Lưu trữ Website Công Khai (Hosting) | **`APPROVED FOR EVALUATION ONLY`** | Ưu tiên thử nghiệm Cloudflare Pages; chưa chốt cho Production; chưa duyệt dịch vụ trả phí. |
| **D-18** | **D-18** | Xác nhận Đơn vị Hành chính Địa chỉ Cơ sở | **`PENDING VERIFICATION — ADDRESS & SEO`**<br>*(Nguồn: Chat 05/11/2026 / Chờ GP)* | Địa chỉ số nhà `101 Khuất Duy Tiến` đã nêu trong chat; **đơn vị hành chính Phường đang chờ xác minh qua giấy phép hành nghề / hồ sơ ĐKKD** thực tế. |
| **D-19** | **D-19** | Cơ chế Tạo Hồ sơ Khách Hàng (Lazy Creation) | **`APPROVED — DESIGN`** | Áp dụng triệt để 10 quy tắc Lazy Profile Creation; không tạo khách rác khi đăng ký Auth. |
| **D-20** | **D-20** | Chính sách Thiết bị Ghi hình & Media (BYOD) | **`APPROVED — DEVICE POLICY`** | Cho phép điện thoại cá nhân với điều kiện: upload qua Web/PWA, khử EXIF/GPS, không lưu bản cá nhân. |
| — | **D-LINK** | Thẩm quyền Phê duyệt Liên kết Tài khoản Khách hàng| **`APPROVED — SECURITY POLICY`** | Tiếp tân chỉ tiếp nhận/đối soát tại quầy; thẩm quyền duyệt `rpc_resolve_recycled_phone` thuộc Quản lý (AAL2). |

---

### 2. Chi Tiết 20 Quyết Định Cốt Lõi Vận Hành & Kỹ Thuật (Owner Decision Register)

| Mã QĐ | Tên Quyết Định Vận Hành / Kỹ Thuật | Phương Án A (Kiến trúc Đề xuất) | Phương Án B (Phương Án Thay Thế) | Trạng Thái Phê Duyệt Cập Nhật (05/11/2026) |
| :--- | :--- | :--- | :--- | :---: |
| **D-01** | **Mô hình Dịch vụ Backend Cốt lõi** | **Supabase Managed (PostgreSQL + Auth + Storage):** Tối ưu chi phí, tích hợp sẵn RLS, Auth AAL2, Storage RLS, miễn phí chi phí vận hành hạ tầng CSDL ban đầu. | Tự dựng PostgreSQL + MinIO + Keycloak trên máy chủ riêng (VPS/Dedicated Server). | **`[APPROVED — ARCHITECTURE ONLY]`**<br>*(Chấp thuận hướng kiến trúc; tuyệt đối chưa mua dịch vụ trả phí)* |
| **D-02** | **Phạm vi Dữ liệu Nhập từ GPet Cũ** | **Chỉ nhập dữ liệu thương mại:** Khách hàng, sản phẩm, dịch vụ, tồn kho đầu kỳ và hóa đơn lịch sử; **lưu trữ bệnh án cũ riêng biệt**, không convert sang hệ thống mới. | Cố gắng chuyển đổi bệnh án cũ vào bảng lâm sàng mới (nguy cơ sai lệch y khoa nghiêm trọng). | **`[APPROVED — DATA SCOPE]`**<br>*(Chỉ nhập thương mại; giữ kho lưu bệnh án cũ riêng biệt)* |
| **D-03** | **Chính sách Sao lưu & Phục hồi Điểm Thời gian (PITR)** | Đề xuất dùng `pg_dump` hàng ngày mã hóa GPG đẩy lên R2 ($0), RPO đề xuất $\le 24$h (Chờ Chủ dự án duyệt). | Mua thêm gói Supabase PITR tua lại theo giây ($100/tháng). Chưa quyết định. | `[PENDING — NOT DECIDED]`<br>*(Đề xuất sao lưu hàng ngày; PITR chưa duyệt)* |
| **D-04** | **Nhà cung cấp Dịch vụ Captcha / Anti-Bot** | **Cloudflare Turnstile:** Miễn phí ($0), bảo vệ sự riêng tư người dùng, không bắt người dùng giải câu đố hình ảnh phiền toái. | Google reCAPTCHA v3 / hCaptcha (có rủi ro chi phí khi vượt hạn mức hoặc giảm trải nghiệm). | **`[APPROVED — SERVICE SELECTION]`**<br>*(Chủ dự án chính thức chọn Phương án A - Cloudflare Turnstile)* |
| **D-05** | **Nhà cung cấp SMS OTP Brandname** | **Ưu tiên gửi mã xác thực qua Zalo ZNS (Zalo OA):** Tiết kiệm chi phí (~250-400đ/tin); dev dùng số test sandbox ($0). | SMS Brandname Viễn thông truyền thống qua eSMS (chi phí ~600-800đ/tin). | **`[APPROVED — SERVICE SELECTION]`**<br>*(Chủ dự án chọn gửi qua Zalo ZNS cho môi trường sản xuất)* |
| **D-06** | **Chính sách Bảo mật MFA Theo Hành động Nhạy cảm** | **Bắt buộc MFA (TOTP AAL2) cho Quản lý & thao tác nhạy cảm:** Bắt buộc khi phê duyệt đợt nhập dữ liệu, rollback, giải quyết SĐT tái cấp; mở rộng dần theo lộ trình. | Bắt buộc MFA cho 100% nhân viên trên mọi thao tác ngay từ ngày đầu. | **`[APPROVED — SECURITY POLICY]`**<br>*(Bắt buộc cho Quản lý và các hành động nhạy cảm)* |
| **D-07** | **Quy tắc Duyệt Đợt Nhập (Two-Man Rule)** | **Bắt buộc 2 người (Làm theo đề xuất):** Ràng buộc CSDL cấm người tải lên tự phê duyệt commit đợt nhập đó (`approved_by <> uploaded_by`) và Admin AAL2. | Cho phép Chủ cơ sở có cờ Override khẩn cấp tự duyệt trong giai đoạn đầu chuyển đổi. | **`[APPROVED — GOVERNANCE POLICY]`**<br>*(Chủ dự án chốt làm theo đề xuất: bắt buộc 2 người, không override)* |
| **D-08** | **Cấu hình Ca trực & Ca đêm Vượt ngày** | **Ca linh hoạt do Quản lý thiết lập theo lịch thực tế:** Hỗ trợ ca đêm vượt nửa đêm; phân công linh hoạt qua `app.shifts` và `app.shift_assignments`. | Áp đặt cứng 3 ca trực cố định: 08-14, 14-21, 21-08. | **`[APPROVED — SCHEDULING DESIGN]`**<br>*(Ca linh hoạt theo lịch thực tế; không hardcode)* |
| **D-09** | **Nhập Điểm Tích Lũy từ Hệ thống Cũ** | **Lưu trữ bền vững trong bảng chuyên dụng:** Lưu toàn bộ số dư điểm cũ vào `app.historical_loyalty_points`, khóa cứng `is_locked = TRUE`; chờ chính sách mới, không tự quy đổi voucher. | Quy đổi điểm cũ sang mã giảm giá hoặc tiền mặt theo một tỷ lệ cố định ngay khi nhập. | **`[APPROVED — DATA POLICY]`**<br>*(Lưu bền vững lịch sử; khóa không cho tự quy đổi)* |
| **D-10** | **Thời hạn Tự động Xóa Staging & Media** | Xóa tệp staging sau 14 ngày; **xóa video/ảnh nội trú sau 60 ngày kể từ thời điểm tải lên (`uploaded_at`)**; chạy Cron Worker dọn dẹp hàng ngày. | Lưu trữ vĩnh viễn toàn bộ tệp staging và video trên Cloud Storage lạnh (tốn chi phí tích lũy). | **`[APPROVED — RETENTION POLICY]`**<br>*(Xóa sau 60 ngày tính từ uploaded_at)* |
| **D-11** | **Khung Pháp lý Bảo vệ Dữ liệu (PDPD - Nghị định 13/2023)** | **Giao nhân sự nội bộ rà soát:** Lập Hồ sơ Đánh giá Tác động Chuyển Dữ liệu ra Nước ngoài theo NĐ 13 và ký DPA với Supabase; bảo lưu bệnh án thú y. | Thuê đơn vị tư vấn luật bên ngoài để thẩm tra toàn diện. | **`[APPROVED — LEGAL COMPLIANCE]`**<br>*(Chủ dự án chốt giao nhân sự nội bộ rà soát, không thuê ngoài)* |
| **D-12** | **Hiển thị Nội dung Y khoa cho Khách Hàng** | **Chỉ cho khách xem chẩn đoán/bản tin đã Bác sĩ duyệt (`published`):** Khóa tuyệt đối 100% hiển thị thuốc kê đơn, thuốc tiêm, liều lượng, y lệnh lâm sàng cho khách. | Mở rộng cho khách xem tên hoạt chất thuốc bổ trợ xuất viện. | **`[APPROVED — CUSTOMER CLINICAL VISIBILITY]`**<br>*(Khóa tuyệt đối thuốc; chỉ xem chẩn đoán đã duyệt)* |
| **D-13** | **Tối Thiểu Hóa Thu Thập Định Danh** | **Không thu thập số CCCD thô trên cổng trực tuyến:** Chỉ dùng SĐT + Họ tên + Tên thú cưng; xác minh đối soát tại quầy khi cần. | Yêu cầu nhập số CCCD để tăng tính đối soát tại quầy. | **`[APPROVED — PRIVACY DESIGN]`**<br>*(Không thu thập CCCD thô trên portal)* |
| **D-14** | **Kiến Trúc Cô Lập Máy Chủ Worker** | **1 VPS cách ly parser trong Container, quyền/credential/filesystem riêng, bảo vệ dữ liệu sao lưu (APPROVED — DESIGN ONLY):** Chưa phê duyệt thuê VPS hoặc chi phí vận hành. | Tách riêng 2 VPS độc lập vật lý ($10.00/tháng). Không chọn. | `[APPROVED — DESIGN ONLY]`<br>*(Xác nhận ngày 06/11/2026)* |
| **D-15** | **Chính sách Xử Lý Hạn Sử Dụng Thiếu** | **Tuyệt đối không tự sinh HSD:** Gán trạng thái `unknown` và khóa cách ly (`quarantined`), cấm xuất bán/kê đơn cho đến khi Thủ kho xác minh thực tế. | Tự động gán HSD tạm thời 1 năm để giải phóng hàng nhanh. | **`[APPROVED — INVENTORY POLICY]`**<br>*(Gán unknown & khóa cách ly; không tự sinh HSD)* |
| **D-16** | **Nơi Chạy Máy Chủ API & Quản Lý Bí Mật** | **Supabase Edge Functions & Vault (Deno, Singapore):** $0 phụ phí, tích hợp Vault bảo mật, gần người dùng Việt Nam (~30ms latency). | Triển khai Node.js API Service riêng biệt trên máy chủ Worker VPS hoặc Cloud Run. | **`[APPROVED — ARCHITECTURE]`**<br>*(Edge Functions & Vault $0; không dựng API server riêng)* |
| **D-17** | **Nhà Cung Cấp Lưu Trữ Website Công Khai (Hosting)** | **Ưu tiên đánh giá Cloudflare Pages:** Tương thích React Router 7/Vite SPA, CDN toàn cầu, Turnstile tích hợp, $0 phụ phí. | Nâng cấp tài khoản Vercel Pro ($20/tháng) để tuân thủ chính sách thương mại. | **`[APPROVED FOR EVALUATION ONLY]`**<br>*(Ưu tiên đánh giá Cloudflare Pages; chưa chốt production)* |
| **D-18** | **Xác Nhận Đơn Vị Hành Chính Địa Chỉ Cơ Sở** | **`101 Khuất Duy Tiến, Phường Nhân Chính, Quận Thanh Xuân, Hà Nội`:** Đồng bộ 100% với tài liệu SEO (`docs/seo-strategy.md`) và thẻ Schema.org. | Giữ nguyên hiển thị rút gọn `101 Khuất Duy Tiến, Thanh Xuân, Hà Nội`. | **`[CONFIRMED — ADDRESS & SEO]`**<br>*(Chủ dự án xác nhận chính thức: Phường Nhân Chính)* |
| **D-19** | **Cơ Chế Tạo Hồ Sơ Khách Khi Đăng Ký** | **Áp dụng triệt để 10 quy tắc Lazy Customer Profile Creation:** Đăng ký OAuth/Email chỉ tạo Auth identity; chỉ tạo `customers` khi thực sự phát sinh nghiệp vụ tại quầy/đặt lịch. | Tự động tạo hồ sơ khách hàng ngay khi đăng ký tài khoản portal. | **`[APPROVED — DESIGN]`**<br>*(Chủ dự án chính thức phê duyệt Lazy Profile Creation)* |
| **D-20** | **Chính Sách Thiết Bị Ghi Hình & Media** | **Cho phép nhân viên dùng điện thoại cá nhân (BYOD) đáp ứng quy chuẩn an toàn:** Chụp qua Web PWA chuyên dụng, tự động khử EXIF/GPS, không lưu bản cá nhân trên máy, tự động xóa sau 60 ngày. | Bắt buộc trang bị máy tính bảng chuyên dụng của bệnh viện cho toàn bộ nhân viên. | **`[APPROVED — DEVICE POLICY]`**<br>*(Cho phép BYOD an toàn qua PWA; khử EXIF/GPS)* |
| **D-PHONE** | **Nhiều Hồ Sơ Khách Cùng Số Điện Thoại** | **Cho phép nhiều khách hàng dùng chung một số điện thoại (P1-E Invariant):** CSDL không đặt ràng buộc duy nhất trên cột `phone_number`. Liên kết lịch sử do quản lý duyệt (D-LINK). | Bắt buộc 1 SĐT chỉ ứng với 1 khách hàng duy nhất. | **`[APPROVED BY OWNER]`**<br>*(Xác nhận ngày 06/11/2026)* |
