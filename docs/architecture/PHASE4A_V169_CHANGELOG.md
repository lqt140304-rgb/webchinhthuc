# NHẬT KÝ THAY ĐỔI KIẾN TRÚC PHASE 4A (PHASE 4A v1.6.9 CHANGELOG)
## Single-Facility Veterinary Hospital Management System & Generic Excel Import Center Specification

- **Dự án:** Bệnh viện Thú y Lê Sơn (`lqt140304-rgb/webchinhthuc`)
- **Mã tài liệu kiến trúc:** `LESON-ARCH-PHASE4A-20261103-V1.6.9`
- **Phiên bản:** 1.6.9 *(Bản vá hiệu chỉnh chính xác theo thẩm định Claude QA v1.6.8)*
- **Baseline đối chiếu:** Phase 4A v1.6.8 & Báo cáo thẩm định `claude-qa-phase4a-v1.6.8-review.md`
- **Ngày cập nhật:** 05/11/2026
- **Trạng thái:** **`DRAFT — AWAITING INDEPENDENT QA`** *(Tài liệu đặc tả kiến trúc bàn giao độc lập cho Claude QA thẩm định; DOCUMENTATION ONLY — NO PAID DEPLOYMENT)*

---

## I. TỔNG QUAN BẢN VÁ HIỆU CHỈNH v1.6.9

Phiên bản v1.6.9 tiếp thu 100% các phát hiện từ báo cáo thẩm định độc lập `claude-qa-phase4a-v1.6.8-review.md` của Claude QA, khắc phục triệt để các lỗi logic CSDL, đồng bộ số lượng bảng thực tế, chuẩn hóa quy trình phân quyền và sổ quyết định theo đúng thẩm quyền:

```
+-------------------------------------------------------------------------------------------------+
|                                 PHASE 4A v1.6.9 TARGETED PATCHES                                |
+-------------------------------------------------------------------------------------------------+
| Patch 1: SQL Runtime Fixes (V-1)   | Sửa rpc_import_approve_job (bỏ users.role, bỏ manager,     |
|                                    | khớp status awaiting_approval); sửa revoke & ensure_user.   |
|------------------------------------+------------------------------------------------------------|
| Patch 2: 39 Tables & RBAC (V-2)    | Đồng bộ 39 bảng (34 app + 4 staging + 1 audit); tách dòng  |
|                                    | RBAC cho staff_device_sessions & historical_loyalty_points. |
|------------------------------------+------------------------------------------------------------|
| Patch 3: Decision Register (V-3)   | Thêm D-PHONE / D-21; sửa D-03; đổi banner sang Đề xuất     |
|                                    | chuẩn hóa chờ Chủ dự án ban hành; thêm nguồn xác nhận.     |
|------------------------------------+------------------------------------------------------------|
| Patch 4: BYOD Enforcement (BYO)    | Ưu tiên getUserMedia in-memory; Sharp không withMetadata;  |
|                                    | DDL session RESTRICT, is_trusted FALSE; 4 RPCs quản lý.   |
|------------------------------------+------------------------------------------------------------|
| Patch 5: V-5, V-6 & P3 Minor Fixes | appointments CHECK (medical, spa, vaccine, recheck); ẩn    |
|                                    | invoice tự do; tính đúng $34.50–$40.50; giải trình FSM.    |
+-------------------------------------------------------------------------------------------------+
```

---

## II. CHI TIẾT CÁC THAY ĐỔI KỸ THUẬT & TRUY VẾT DÒNG MÃ

### 1. V-1 — Sửa SQL Không Thể Hoạt Động (Chặn Nghiệm Thu)
- **`app.rpc_import_approve_job` (Mục V.6):**
  * Loại bỏ hoàn toàn câu lệnh `SELECT role INTO v_user_role FROM app.users` (cột `role` không tồn tại trong `app.users`).
  * Loại bỏ kiểm tra vai trò `manager` (vai trò kỹ thuật không tồn tại trong CSDL); thay bằng hàm kiểm tra chuẩn `IF NOT app.check_active_shift(v_actor_id, 'admin') THEN ...` (nhân sự quản lý được phân quyền role `admin` trong `staff_role_assignments`).
  * Sửa điều kiện kiểm tra trạng thái từ `v_job.status <> 'dry_run_passed'` thành `v_job.status <> 'awaiting_approval'`, khớp 100% với danh mục trạng thái hợp lệ trong ràng buộc `staging.import_jobs.status CHECK`.
  * Bổ sung đặc tả pseudocode và luồng trạng thái cho `rpc_import_parse_file`, `rpc_import_execute_dry_run`, `rpc_import_commit_job`.
- **`app.rpc_revoke_staff_device` (Mục VII.5.C):**
  * Loại bỏ kiểm tra vai trò `manager`; chỉ kiểm tra `check_active_shift(v_admin_id, 'admin')` kết hợp xác thực hai bước MFA AAL2.
- **`app.rpc_ensure_app_user` (Mục VII.5.A):**
  * Xóa bỏ tham số `p_user_id UUID DEFAULT auth.uid()`; hàm chỉ khai báo `app.rpc_ensure_app_user()` không nhận tham số từ client.
  * Lấy `v_user_id := auth.uid()` trực tiếp từ phiên xác thực server-side, triệt tiêu hoàn toàn nguy cơ IDOR hay mạo danh ID.

---

### 2. V-2 — Đồng Bộ Kiểm Đếm 39 Bảng Dữ Liệu & Phân Quyền RBAC
- **Kiểm đếm DDL thực tế:**
  * Schema `app`: **34 bảng** (gồm 32 bảng nghiệp vụ ban đầu + `app.historical_loyalty_points` + `app.staff_device_sessions`).
  * Schema `staging`: **4 bảng** (`import_jobs`, `import_rows`, `import_errors`, `import_mappings`).
  * Schema `audit`: **1 bảng** (`audit_logs`).
  * **Tổng cộng: 39 Bảng dữ liệu.**
- **Đồng bộ hóa tài liệu:**
  * Sửa tiêu đề và sơ đồ phân bổ Mục III.1 thành 39 bảng.
  * Sửa tiêu đề và ma trận Mục VI.4 thành Ma trận phân quyền RBAC 39 bảng.
- **Tách dòng RBAC chuyên biệt:**
  * `app.staff_device_sessions`: Cấu hình `DENY` mọi quyền `SELECT` trực tiếp qua REST API (tránh lộ `session_token_hash` và `device_fingerprint`). Nhân viên chỉ kiểm tra trạng thái phiên qua RPC `app.rpc_verify_staff_device`.
  * `app.historical_loyalty_points`: Cấu hình `DENY` đối với khách hàng và nhân viên thông thường, chỉ Admin được truy cập qua endpoint bảo vệ.
- **Hỗ trợ Safe Rollback cho Điểm Tích Lũy:**
  * Thêm cột `is_deleted BOOLEAN NOT NULL DEFAULT FALSE` và `rollback_job_id UUID NULL` vào `app.historical_loyalty_points`.
  * Bổ sung bước hoàn tác điểm trong `app.rpc_import_rollback_job`: `UPDATE app.historical_loyalty_points SET is_deleted = TRUE, rollback_job_id = p_job_id WHERE import_job_id = p_job_id`.

---

### 3. V-3 — Sổ Đăng Ký Quyết Định & Phân Định Thẩm Quyền
- **Bổ sung Quyết định Độc lập D-PHONE / D-21:**
  * Tên: **Chính sách nhiều hồ sơ khách hàng cùng số điện thoại (P1-E Architecture Invariant)**.
  * Nội dung: Mỗi khách hàng có UUID riêng (`app.customers.id`); CSDL CẤM UNIQUE trên `phone_number`; không tự động gom gộp/liên kết tài khoản portal theo SĐT.
  * Trạng thái: `PROPOSED — ARCHITECTURE INVARIANT (PENDING OWNER CONFIRMATION)`.
- **Sửa Lịch Sử Mã D-03:**
  * Làm rõ trong v1.6.5 D-03 là chính sách Số điện thoại dùng chung; mã phiếu sao lưu là D-03-DR.
  * Trạng thái: Duy trì giải pháp sao lưu hàng ngày pg_dump + R2 là `APPROVED (Daily Dump)`, gói PITR $100/tháng là `DEFERRED / NOT DECIDED`.
- **Chuyển Đổi Banner Đóng Băng:**
  * Bỏ tuyên bố "Antigravity đóng băng vĩnh viễn" vượt thẩm quyền; thay bằng: **`ĐỀ XUẤT CHUẨN HÓA BỘ MÃ QUYẾT ĐỊNH (PROPOSED DECISION REGISTER BASELINE v1.6.9) — CHỜ CHỦ DỰ ÁN BAN HÀNH`**.
- **Chuẩn hóa Trạng thái D-11 & D-18:**
  * D-11 đổi thành `APPROVED — INTERNAL REVIEW PROCESS` (phê duyệt quy trình tự rà soát nội bộ, chưa phải xác nhận đã đạt chuẩn pháp luật).
  * D-18 đổi thành `PENDING VERIFICATION — ADDRESS & SEO` (địa chỉ 101 Khuất Duy Tiến đã nêu trong chat; đơn vị hành chính Phường đang chờ xác minh qua giấy phép).
- **Thêm Cột Nguồn Xác Nhận:** Phân định minh bạch giữa Chat 05/11/2026, Repo-inherited / Architecture Invariant, và Deferred.

---

### 4. BYO-1, BYO-2, BYO-3 — Hoàn Thiện Kiến Trúc Bảo Mật BYOD
- **BYO-1 (Luồng Chụp Media):**
  * Luồng chuẩn: Ưu tiên `navigator.mediaDevices.getUserMedia()` đọc video stream trực tiếp vào RAM, không gọi Camera App của hệ điều hành, giảm thiểu tối đa nguy cơ ảnh lưu vào Camera Roll.
  * Luồng ngoại lệ: `<input type="file" capture>` có rủi ro ảnh gốc nằm trong thư viện máy cá nhân; bắt buộc áp dụng cam kết PDPD và quy chế nhân sự tự xóa ảnh; đánh dấu test phần cứng thật Phase 4B.
  * Thay "đảm bảo tuyệt đối" bằng "giảm thiểu và kiểm soát rủi ro".
- **BYO-2 (Thực Thi Device Trust):**
  * `app.staff_device_sessions`: Đổi `is_trusted DEFAULT FALSE` (mặc định chưa tin cậy), đổi `staff_id ON DELETE RESTRICT` (P1-C Invariant).
  * Bổ sung 4 RPCs quản lý: `rpc_register_staff_device`, `rpc_approve_staff_device`, `rpc_revoke_staff_device`, `rpc_verify_staff_device`.
  * Minh bạch giới hạn Remote Wipe: Chỉ chạy khi online và không thể xóa ảnh trong camera roll; bù đắp bằng thu hồi Refresh Token trên Supabase Auth (`signOut`), JWT hạn ngắn 1h.
  * Mở rộng kịch bản kiểm thử SEC-20.
- **BYO-3 (Khử Metadata Chuẩn Mực):**
  * Sharp: Không gọi `.withMetadata()` (mặc định xóa sạch metadata), thêm xoay orientation, kiểm chứng bằng `exiftool`.
  * FFmpeg: Bổ sung `-map_chapters -1 -fflags +bitexact`, kiểm chứng bằng `ffprobe`.
  * Tách worker xử lý video khỏi worker phân tích Excel 10MB.

---

### 5. V-5, V-6 & Các Điểm Hiệu Chỉnh Khác
- **V-5: Đồng bộ loại lịch hẹn & hóa đơn tự do:**
  * Sửa ràng buộc CSDL: `app.appointments.appointment_type CHECK (appointment_type IN ('medical', 'spa', 'vaccine', 'recheck'))`, khớp 100% với `rpc_create_customer_appointment`.
  * Trigger `fn_derive_invoice_item_clinical_hiding`: Mọi dòng hóa đơn tự do không có liên kết catalog product/service bắt buộc mặc định ẩn (`is_clinical_hidden = TRUE`); chặn can thiệp UPDATE trực tiếp qua API.
- **V-6: Sửa phép tính chi phí Production:**
  * Sửa tổng chi phí Production thành: **`$34.50 – $40.50 / tháng`** (25 + 5 + 0.5 + 1 + 0~3 + 0 + 3~6).
  * Cập nhật dòng SMS OTP: `Zalo ZNS ~500 OTP/tháng theo D-05`.
  * Ghi rõ đây là dự toán tham chiếu kiến trúc, không phải ngân sách đã phê duyệt chi tiêu.
- **Giải trình Frontend FSM (Mục VIII.1):**
  * Thêm Note làm rõ trạng thái `[ validating ]` là bước trung gian Zod/Turnstile trên client, làm rõ cơ chế của baseline `docs/architecture.md`.
- **Chỉ tiêu RPO (Mục IX.2):**
  * Sửa RPO Daily Dump thành **$\le 24$ giờ**; ghi rõ RPO $\le 5$ phút của PITR hiện **không áp dụng** do gói PITR $100/tháng đang ở trạng thái DEFERRED.

---

## III. BẢNG TỔNG HỢP TRUY VẾT TỆP THAY ĐỔI

| Tệp Thay Đổi | Phân Mục | Nội Dung Hiệu Chỉnh v1.6.9 |
| :--- | :--- | :--- |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Header | Cập nhật phiên bản v1.6.9; mô tả chi tiết 5 nhóm bản vá. |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục III.1 | Cập nhật tiêu đề và sơ đồ phân bổ 39 bảng (34 app + 4 staging + 1 audit). |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục III.2 | Mở rộng CHECK `appointments.appointment_type`; thêm `is_deleted` vào `historical_loyalty_points`; khóa ẩn dòng hóa đơn tự do. |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục V.3 | Bổ sung hoàn tác điểm tích lũy trong `rpc_import_rollback_job`. |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục V.6 | Viết lại `rpc_import_approve_job` (admin AAL2, status awaiting_approval, Two-Man); bổ sung pseudocode import workflow. |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục VI.4 | Cập nhật ma trận RBAC 39 bảng; tách dòng riêng cho `staff_device_sessions` và `historical_loyalty_points`. |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục VII.4.E | Khớp kiểm tra `rpc_create_customer_appointment` với 4 loại lịch hẹn. |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục VII.5.A | Viết lại `rpc_ensure_app_user` không tham số, dùng `auth.uid()` server-side. |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục VII.5.C | Hoàn thiện kiến trúc BYOD 5 tầng có thực thi (BYO-1, BYO-2, BYO-3). |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục VIII.1 | Thêm Note giải trình trạng thái `[ validating ]` so với baseline. |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục IX.1 & IX.2 | Chi tiết hóa cô lập 1 VPS (không mount backup keys); sửa RPO $\le 24$h. |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục X | Sửa tổng chi phí Production thành $34.50 – $40.50/tháng; Zalo ZNS. |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục XII.1 | Mở rộng kịch bản kiểm thử SEC-20 cho BYOD trust workflow. |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục XIII | Bổ sung Bảng truy vết khắc phục Finding Claude QA v1.6.8. |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục XIV | Đổi banner Đề xuất chuẩn hóa chờ duyệt; sửa D-03, D-11, D-18; thêm D-PHONE / D-21. |
| `OWNER_DECISION_REGISTER.md` | Toàn bộ | Cập nhật v1.6.9, đổi banner, sửa D-03/D-11/D-18, thêm D-PHONE / D-21 và nguồn xác nhận. |

---

## IV. BẰNG CHỨNG KIỂM CHỨNG TỰ ĐỘNG (VERIFICATION EVIDENCE)

- **Lệnh kiểm tra:** `node scripts/verify_v1_6_9_comprehensive.cjs`
- **Kết quả thực tế:**
  ```
  === COMPREHENSIVE VERIFICATION FOR PHASE 4A v1.6.9 ===
  File length (bytes): 255053
  Total lines: 3412
  Dollar quote syntax: AS $ count = 0, $; count = 0
  Total tables defined in DDL: 39
    app tables: 34 (expected 34)
    staging tables: 4 (expected 4)
    audit tables: 1 (expected 1)
  Total SEC tests: 60
  Total IMP tests: 32
  Total Test Suite Cases: 92
  Tests marked DESIGNED — NOT TESTED: 92 / 92
  Duplicate functions count: 0
  Duplicate tables count: 0
  Duplicate views count: 0
  Duplicate triggers count: 0

  === VERIFICATION RESULT ===
  >>> 100% PASSED! ALL v1.6.9 CRITERIA VERIFIED WITH ZERO ERRORS! <<<
  ```
- **Lệnh kiểm tra trùng lặp:** `node scripts/find_duplicates.cjs`
  * Duplicate Functions: **0**
  * Duplicate Tables: **0**
  * Duplicate Views: **0**
  * Duplicate Triggers: **0**
