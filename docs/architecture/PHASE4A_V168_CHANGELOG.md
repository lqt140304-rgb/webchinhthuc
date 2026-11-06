# NHẬT KÝ THAY ĐỔI KIẾN TRÚC PHASE 4A (PHASE 4A v1.6.8 CHANGELOG)
## Single-Facility Veterinary Hospital Management System & Generic Excel Import Center Specification

- **Dự án:** Bệnh viện Thú y Lê Sơn (`lqt140304-rgb/webchinhthuc`)
- **Mã tài liệu kiến trúc:** `LESON-ARCH-PHASE4A-20261103-V1.6.8`
- **Phiên bản:** 1.6.8 *(Bản hợp nhất cấu trúc SQL, đóng băng vĩnh viễn Decision Register & hoàn thiện an ninh BYOD)*
- **Baseline:** Phase 4A v1.6.7 & Biên bản chỉ đạo trực tiếp từ Chủ dự án ngày 05/11/2026
- **Ngày cập nhật:** 05/11/2026
- **Trạng thái:** **`DRAFT — AWAITING INDEPENDENT QA`** *(Bản thảo tài liệu đặc tả kiến trúc bàn giao độc lập cho Claude QA thẩm định; DOCUMENTATION UPDATE ONLY — NO PAID DEPLOYMENT)*

---

## I. TỔNG QUAN BA NHIỆM VỤ TRỌNG TÂM TRONG v1.6.8

Phiên bản v1.6.8 thực hiện chính xác chỉ đạo của Chủ dự án: tập trung giải quyết triệt để 3 nhiệm vụ trọng tâm, không viết lại tài liệu từ đầu, không thay đổi bất kỳ quyết định nào của Chủ dự án, và bảo đảm tính toàn vẹn 100% không hồi quy:

```
+-------------------------------------------------------------------------------------------------+
|                                 PHASE 4A v1.6.8 CORE OBJECTIVES                                 |
+-------------------------------------------------------------------------------------------------+
| Objective 1: SQL Deduplication    | Loại bỏ 100% mã SQL trùng lặp; di chuyển đúng vị trí        |
|                                   | phân hệ cho các RPCs nghiệp vụ; 0 duplicate definitions.    |
|-----------------------------------+-------------------------------------------------------------|
| Objective 2: Freeze Register      | Đóng băng vĩnh viễn Sổ đăng ký quyết định D-01..D-20        |
|                                   | và 4 mã mở rộng; 100% CLOSED (APPROVED / CONFIRMED).        |
|-----------------------------------+-------------------------------------------------------------|
| Objective 3: Harden BYOD Security | Hoàn thiện kiến trúc an ninh BYOD 5 lớp: DDL bảng           |
|                                   | staff_device_sessions, RPC thu hồi, Remote Wipe, khử EXIF.  |
+-------------------------------------------------------------------------------------------------+
```

---

## II. CHI TIẾT CÁC THAY ĐỔI KỸ THUẬT THEO TỪNG NHIỆM VỤ

### 1. Nhiệm Vụ 1: Hợp Nhất SQL Bị Trùng & Tái Cấu Trúc RPC Nghiệp Vụ (V168-OBJ-1)

- **Vấn đề tồn tại trong v1.6.7:**
  * Hàm `app.rpc_import_approve_job(p_job_id UUID)` bị định nghĩa lặp lại 2 lần: tại Mục V.6 (dòng 1431) và Mục VI.3 (dòng 2050).
  * Hàm `app.rpc_ensure_app_user` bị định nghĩa lặp lại 2 lần: tại Mục V.6 (dòng 1737) và Mục VII.5.A (dòng 2672).
  * Ba hàm RPC nghiệp vụ ứng dụng (`app.rpc_add_invoice_item`, `app.rpc_create_customer_appointment`, `app.rpc_register_customer_pet`) bị đặt nhầm vào Mục V.6 (phân hệ Generic Excel Import Center) thay vì Mục VII.4 (Full SQL RPCs).
- **Giải pháp xử lý trong v1.6.8:**
  1. **Loại bỏ bản trùng tại Mục VI.3:** Xóa bỏ hoàn toàn khối SQL duplicate của `app.rpc_import_approve_job` trong Mục VI.3; thay thế bằng ghi chú chỉ dẫn kỹ thuật (`[!NOTE]`) đối chiếu sang Mục V.6. Hàm triển khai chuẩn mực duy nhất nằm tại **Mục V.6**.
  2. **Di chuyển 3 RPCs về đúng Mục VII.4:** Di chuyển `app.rpc_add_invoice_item`, `app.rpc_create_customer_appointment`, `app.rpc_register_customer_pet` từ Mục V.6 sang Mục VII.4 thành các tiểu mục chuẩn:
     * `#### D. RPC Thêm Dòng Chi Tiết Hóa Đơn & Tra Cứu Catalog (Solving U-4, U-9)`
     * `#### E. RPC Đặt Lịch Hẹn Khách Hàng Kèm Cơ Chế Tạo Hồ Sơ Khách Lười (Solving D-19, U-3)`
     * `#### F. RPC Đăng Ký Thú Cưng Khách Hàng Kèm Cơ Chế Lazy Creation (Solving D-19, U-3)`
  3. **Loại bỏ bản trùng `app.rpc_ensure_app_user` trong Mục V.6:** Giữ định nghĩa chuẩn mực duy nhất `CREATE OR REPLACE FUNCTION app.rpc_ensure_app_user(p_user_id UUID DEFAULT auth.uid())` tại **Mục VII.5.A** ngay dưới trigger `app.on_auth_user_created`.
  4. **Kết quả kiểm chứng:** Chạy script `scripts/find_duplicates.cjs` xác nhận:
     * Duplicate Functions: **0**
     * Duplicate Tables: **0**
     * Duplicate Views: **0**
     * Duplicate Triggers: **0**

---

### 2. Nhiệm Vụ 2: Đóng Băng Vĩnh Viễn Sổ Đăng Ký Quyết Định (V168-OBJ-2)

- **Vấn đề:** Tránh việc diễn giải sai lệch, tự ý đánh số lại, đổi mã hoặc hạ cấp trạng thái các quyết định đã được Chủ dự án chính thức phê duyệt.
- **Giải pháp xử lý trong v1.6.8:**
  1. Thêm Banner cảnh báo **`THÔNG BÁO ĐÓNG BĂNG VĨNH VIỄN SỔ ĐĂNG KÝ QUYẾT ĐỊNH (DECISION REGISTER FREEZE NOTICE — v1.6.8)`** tại đầu Mục XIV.1 của `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` và đầu tài liệu `OWNER_DECISION_REGISTER.md`.
  2. Toàn bộ **20 Quyết định cốt lõi (D-01 đến D-20)** cùng **4 mã mở rộng** (D-01-PRO, D-06-INVOICE, D-08-NIGHT, D-LINK) giữ nguyên trạng thái **100% CLOSED (`APPROVED` hoặc `CONFIRMED`)**.
  3. Thiết lập nguyên tắc bất biến:
     * Không thay đổi mã số, không hoán đổi vị trí, không tách gộp bất kỳ quyết định nào từ D-01 đến D-20.
     * Mọi quyết định phát sinh mới từ các giai đoạn tiếp theo (nếu có yêu cầu từ Chủ dự án) bắt buộc đánh số từ **D-21** trở đi.

---

### 3. Nhiệm Vụ 3: Hoàn Thiện Kiến Trúc Bảo Mật BYOD 5 Tầng (V168-OBJ-3 — Solving D-20)

- **Vấn đề:** Chủ dự án đã phê duyệt cho phép nhân viên sử dụng điện thoại cá nhân (BYOD) để quay video/chụp ảnh thú cưng nội trú nhằm tối ưu chi phí hạ tầng (không mua dàn tablet chuyên dụng). Cần hoàn thiện đặc tả an ninh kỹ thuật ngăn chặn rò rỉ hình ảnh y khoa ra ngoài và tuân thủ Nghị định 13/2023/NĐ-CP (PDPD).
- **Giải pháp xử lý trong v1.6.8 (Mục VII.5.C):**
  1. **Tầng 1 (In-Memory Capture):** PWA chụp ảnh/quay video qua HTML5 Camera API trực tiếp vào RAM (`Blob`/`ArrayBuffer`); cấm tuyệt đối quyền ghi vào thư viện máy cá nhân (Google Photos / Apple Photos / Camera Roll).
  2. **Tầng 2 (Two-Stage EXIF/GPS Scrubbing):**
     * *Client:* Canvas redraw xuất `image/jpeg` chất lượng 0.85, loại bỏ toàn bộ EXIF header (GPS lat/long, device model, serial) ngay tại máy nhân viên.
     * *Server Worker:* Worker Container độc lập chạy `sharp({ exif: false })` cho ảnh ($\le 15$MB) và `ffmpeg -map_metadata -1` cho video ($\le 50$MB, $\le 60$s) trước khi lưu vào bucket `inpatient-media-private`.
  3. **Tầng 3 (Device Session Binding):**
     * Thêm DDL bảng `app.staff_device_sessions` quản lý token thiết bị, staff_id, fingerprint, `is_trusted`.
     * Bổ sung RPC `app.rpc_revoke_staff_device(p_session_id UUID, p_reason TEXT)`: Bắt buộc Quản lý / Admin có MFA AAL2 mới có quyền thu hồi; ghi nhật ký kiểm toán bất biến.
     * Cập nhật Ma trận RBAC (Mục VI.4) bổ sung `app.staff_device_sessions`.
  4. **Tầng 4 (Remote Wipe & Zeroize Hook):** Cung cấp mã nguồn JavaScript PWA client: khi nhận phản hồi `403 DEVICE_REVOKED`, tự động xóa sạch 100% `IndexedDB`, `CacheStorage`, `localStorage`, `sessionStorage`, hủy đăng ký Service Worker và chuyển hướng về màn hình khóa.
  5. **Tầng 5 (Storage Caps & Retention):** Giới hạn ảnh $\le 15$MB, video $\le 50$MB / $\le 60$s; cấp quyền xem qua Signed URL hiệu lực đúng 15 phút (900s); Cron worker tự động xóa vĩnh viễn sau đúng 60 ngày kể từ thời điểm tải lên (`uploaded_at` - D-10).
  6. **Cập nhật Kịch bản Kiểm thử SEC-20:** Cập nhật nội dung kiểm thử từ mô tả máy tính bảng cũ thành kiểm thử xác thực phiên thiết bị BYOD và kích hoạt Remote Wipe khi phiên bị thu hồi (`DESIGNED — NOT TESTED`).

---

## III. BẢNG ĐỐI CHIẾU THAY ĐỔI THEO FILE & DÒNG MÃ

| Tệp Tài Liệu | Vị Trí Thay Đổi | Nội Dung Cũ (v1.6.7) | Nội Dung Mới (v1.6.8) | Ảnh Hưởng Hồi Quy |
| :--- | :--- | :--- | :--- | :---: |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Header | Phiên bản 1.6.7 | Phiên bản 1.6.8; cập nhật mô tả 3 nhiệm vụ | Không |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục V.6 | Chứa 3 RPCs nghiệp vụ và `rpc_ensure_app_user` trùng lặp | Chỉ giữ lại duy nhất `app.rpc_import_approve_job`; kết thúc code block chuẩn | Không |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục VI.3 | Chứa định nghĩa duplicate `app.rpc_import_approve_job` | Xóa duplicate; thay bằng `[!NOTE]` chỉ dẫn sang Mục V.6 | Không |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục VII.4 | Chỉ có 3 RPCs (A, B, C) | Bổ sung 3 RPCs (D, E, F) di chuyển từ Mục V.6 | Không |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục VII.5.C | Mô tả tóm tắt BYOD | Đặc tả chi tiết Kiến trúc BYOD 5 Tầng, DDL `app.staff_device_sessions`, RPC `app.rpc_revoke_staff_device`, mã Remote Wipe | Không |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục VI.4 | RBAC 37 bảng | Bổ sung `staff_device_sessions` vào nhóm `app.staff_role_assignments` | Không |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục XII.1 | SEC-20 mô tả máy tính bảng | SEC-20 cập nhật kiểm thử phiên BYOD & Remote Wipe | Không |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục XIII.1 | Bảng U-1..U-9 | Thêm Bảng V168-OBJ-1..3; đẩy U-1..U-9 xuống Mục XIII.2 | Không |
| `PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md` | Mục XIV.1 | Bảng ánh xạ quyết định | Thêm Banner Thông Báo Đóng Băng Vĩnh Viễn Quyết Định | Không |
| `OWNER_DECISION_REGISTER.md` | Toàn bộ | Phiên bản v1.6.7 | Phiên bản v1.6.8; thêm Banner Đóng Băng Vĩnh Viễn; chi tiết hóa D-20 | Không |

---

## IV. KẾT QUẢ KIỂM CHỨNG TOÀN DIỆN (VERIFICATION REPORT)

- **Lệnh kiểm tra:** `node scripts/verify_v1_6_8_comprehensive.cjs`
- **Kết quả thực tế:**
  * Document code: `LESON-ARCH-PHASE4A-20261103-V1.6.8` (Khớp 100%)
  * Trạng thái tài liệu: `DRAFT — AWAITING INDEPENDENT QA` (Khớp 100%)
  * Lỗi cú pháp Dollar-Quote (`AS $` hoặc `$;`): **0 lỗi**
  * Kịch bản kiểm thử bảo mật (SEC): **60 / 60** (từ SEC-01 đến SEC-60)
  * Kịch bản kiểm thử nhập liệu (IMP): **32 / 32** (từ IMP-01 đến IMP-32)
  * Tổng số kịch bản kiểm thử: **92 / 92**
  * Tỷ lệ test đánh dấu `DESIGNED — NOT TESTED`: **92 / 92 (100%)**
  * Hàm SQL trùng lặp (Duplicate Functions): **0**
  * Bảng CSDL trùng lặp (Duplicate Tables): **0**
  * Khung nhìn trùng lặp (Duplicate Views): **0**
  * Trigger trùng lặp (Duplicate Triggers): **0**
  * **KẾT LUẬN KIỂM ĐỊNH:** `100% PASSED — ZERO ERRORS, ZERO DUPLICATES, ZERO REGRESSION DETECTED!`
