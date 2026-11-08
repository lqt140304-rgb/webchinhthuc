# BÁO CÁO NGHIỆM THU PHASE 4B — GIAI ĐOẠN 8 (ACCEPTANCE GATE 8)
## QUẢN TRỊ MEDIA LƯU VIỆN, BẢO MẬT THIẾT BỊ BYOD & QUYỀN RIÊNG TƯ (D-10, D-20, SEC-18 ĐẾN SEC-22)

**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Nhánh thực hiện:** `feat/phase-4b-supabase-foundation`  
**Căn cứ pháp lý & kỹ thuật:**
- Kế hoạch triển khai Phase 4B ([`PHASE4B_IMPLEMENTATION_PLAN.md`](file:///d:/webbvct/docs/architecture/PHASE4B_IMPLEMENTATION_PLAN.md) Mục 8 - Gate 8)
- Thiết kế kiến trúc Phase 4A v1.6.9 Baseline (Mục VII.5.C, Mục VI.4, Mục XII.1)
- Các Invariants: **D-20** (Kiến trúc An ninh BYOD 5 Tầng), **SEC-18** (Chặn thiết bị chưa duyệt), **SEC-19 / V-1** (Thu hồi từ xa Admin AAL2 & Client Zeroization), **SEC-20** (Khử metadata GPS/EXIF Server-Side), **D-10 & SEC-21** (Signed URL thời hạn 15 phút), **D-10 & SEC-22** (Tự động xóa media lưu viện sau 60 ngày), **D-12** (Ranh giới bảo mật y khoa & quyền sở hữu thú cưng).  
**Trạng thái Cổng 8 (Gate 8):** **`10/10 RUNTIME PASS (100%)`**  
**Tổng kiểm thử hồi quy toàn diện (Gates 1–8):** **`75/75 RUNTIME PASS | 0 FAIL | 0 SKIP`**  
**Chi phí thực thi:** **$0.00** *(Local Docker Sandbox, không deploy Cloud, không merge main)*  
**Ngày thực hiện:** 08/11/2026  

---

## PHẦN I: KIẾN TRÚC BẢO MẬT BYOD & QUẢN TRỊ MEDIA LƯU VIỆN 5 TẦNG (D-20)

Nhằm tối ưu chi phí hạ tầng ban đầu theo quyết định của Chủ dự án (**D-20: APPROVED DEVICE POLICY**), bệnh viện không bắt buộc đầu tư máy tính bảng chuyên dụng cho từng chuồng bệnh mà cho phép nhân viên sử dụng điện thoại cá nhân (BYOD). Để kiểm soát rủi ro rò rỉ dữ liệu y khoa và tuân thủ Nghị định 13/2023/NĐ-CP (PDPD), hệ thống thiết lập **Kiến trúc Bảo mật BYOD 5 Tầng Thực Thi**:

```
+---------------------------------------------------------------------------------------------+
|                                5-LAYER BYOD ENFORCEMENT ARCHITECTURE                        |
+---------------------------------------------------------------------------------------------+
| Layer 1: In-Memory Capture        | PWA chụp trực tiếp vào RAM; hạn chế tối đa camera roll  |
| Layer 2: Server-Side Scrubbing    | Khử sạch 100% EXIF/GPS tags; video FFmpeg bitexact      |
| Layer 3: Device Trust Workflow    | Bảng staff_device_sessions; is_trusted DEFAULT FALSE;   |
|                                   | Duyệt qua Admin AAL2 (rpc_approve_staff_device)         |
| Layer 4: Remote Revoke & Zeroize  | HTTP 403 DEVICE_REVOKED; PWA xóa cache/IndexedDB;       |
|                                   | rpc_confirm_device_wipe xác nhận hoàn tất               |
| Layer 5: Storage Caps & Purge     | Ảnh <= 15MB, Video <= 50MB; Signed URL 15 phút (900s);   |
|                                   | Cron tự động xóa vĩnh viễn sau 60 ngày (D-10)           |
+---------------------------------------------------------------------------------------------+
```

### 1. Vòng Đời Kiểm Soát Thiết Bị (Device Trust Lifecycle — Layer 3 & 4)
1. **Đăng ký (`rpc_register_staff_device`):** Thiết bị mới mặc định nhận cờ `is_trusted = FALSE` và trạng thái `pending_approval`.
2. **Chặn cứng thiết bị chưa duyệt (`SEC-18`):** Mọi thao tác tải lên media từ thiết bị chưa duyệt đều bị từ chối với ngoại lệ `DEVICE_NOT_TRUSTED`.
3. **Phê duyệt AAL2 (`rpc_approve_staff_device`):** Chỉ Quản trị viên (Admin) có ca trực hiệu lực và hoàn tất xác thực đa yếu tố AAL2 (`(auth.jwt()->>'aal') = 'aal2'`) mới có quyền kích hoạt thiết bị.
4. **Thu hồi từ xa (`rpc_revoke_staff_device` — `SEC-19`):** Khi thiết bị bị mất hoặc nhân sự nghỉ việc, Admin AAL2 thu hồi phiên, gán `is_revoked = TRUE`, `is_trusted = FALSE` và yêu cầu tự hủy dữ liệu `wipe_requested = TRUE`.
5. **Zeroization Client-Side (`Layer 4`):** Khi nhận mã HTTP 403 `DEVICE_REVOKED`, client PWA xóa sạch LocalStorage, SessionStorage, IndexedDB, hủy ServiceWorker và gọi `rpc_confirm_device_wipe` ghi vết kiểm toán.

### 2. Quy Chuẩn Media Lưu Viện & Quyền Riêng Tư (Layer 5 — D-10, D-12, SEC-21)
- **Giới hạn dung lượng cứng:** Ảnh tối đa **15MB**, Video tối đa **50MB**. Các tệp vượt ngưỡng bị chặn với `FILE_SIZE_LIMIT_EXCEEDED`.
- **Signed URL 15 phút (900 giây):** Khách hàng và nhân viên truy cập media qua đường dẫn ký số HMAC-SHA256 có thời hạn sống đúng 15 phút. Khi hết hạn, RPC `rpc_verify_media_signed_url` trả về lỗi `SIGNED_URL_EXPIRED`.
- **Ranh giới bảo mật y khoa (D-12):** Khách hàng chỉ có thể tạo Signed URL cho thú cưng thuộc sở hữu của mình VÀ media đã được bác sĩ phê duyệt (`is_approved_for_customer = TRUE`) trong bản tin y khoa đã xuất bản (`published`). Mọi truy cập chéo đều bị chặn an toàn với `UNAUTHORIZED_MEDIA_ACCESS`.
- **Dọn dẹp tự động 60 ngày (D-10 & SEC-22):** Tiến trình Cron `rpc_purge_expired_inpatient_media` quét các bản ghi có `auto_delete_at <= CLOCK_TIMESTAMP()`, đánh dấu `is_purged = TRUE` và ghi log kiểm toán bất biến `MEDIA_AUTO_PURGED_60_DAYS`.

---

## PHẦN II: KẾT QUẢ KIỂM THỬ RUNTIME CỔNG 8 (10 / 10 PASS)

| Test ID | Mã Kịch Bản | Mục Tiêu & Cơ Chế Kiểm Thử | Kết Quả Thực Tế | Trạng Thái |
|:---:|:---:|---|---|:---:|
| **GATE8-T8.1** | **SEC-18 / D-20 L3** | **Untrusted Device Blocking:** Nhân viên đăng ký thiết bị mới $\rightarrow$ Nhận `is_trusted = FALSE`. Tải media bị chặn cứng với `DEVICE_NOT_TRUSTED`. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE8-T8.2** | **SEC-18 / D-20 L3** | **Admin AAL2 Approval:** Tiếp tân duyệt $\rightarrow$ Lỗi `ROLE_UNAUTHORIZED`. Admin không có AAL2 duyệt $\rightarrow$ Lỗi `MFA_REQUIRED`. Admin AAL2 duyệt $\rightarrow$ Kích hoạt `is_trusted = TRUE`, `status = 'active'`. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE8-T8.3** | **SEC-19 / D-20 L4** | **Remote Revoke:** Admin thu hồi thiết bị $\rightarrow$ Gán `is_revoked = TRUE`, `wipe_requested = TRUE`. Thao tác sau đó bị chặn với `DEVICE_REVOKED` (HTTP 403). | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE8-T8.4** | **Layer 4 Remote Wipe** | **Zeroization Confirmation:** Client hoàn tất dọn dẹp bộ nhớ RAM/IndexedDB, gọi `rpc_confirm_device_wipe` $\rightarrow$ Cập nhật `wipe_completed_at` và ghi audit log. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE8-T8.5** | **SEC-20 / D-20 L2** | **EXIF/GPS Scrubbing:** Tệp ảnh chứa tag vị trí GPS coordinate (`0x8825`) qua tiến trình xử lý server $\rightarrow$ 100% metadata GPS bị bóc tách, 0 byte vị trí tồn tại. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE8-T8.6** | **SEC-21 / D-20 L5** | **Storage Caps Enforcement:** Tải ảnh 16MB (> 15MB) $\rightarrow$ Chặn `FILE_SIZE_LIMIT_EXCEEDED`. Tải video 55MB (> 50MB) $\rightarrow$ Chặn `FILE_SIZE_LIMIT_EXCEEDED`. Tải ảnh 2MB hợp lệ trên thiết bị tin cậy $\rightarrow$ Thành công. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE8-T8.7** | **SEC-21 / D-10** | **15-Minute Signed URL TTL:** Sinh Signed URL thời hạn 900s. Xác thực ngay $\rightarrow$ Hợp lệ. Thử xác thực với mốc thời gian quá 15 phút $\rightarrow$ Chặn với `SIGNED_URL_EXPIRED`. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE8-T8.8** | **SEC-21 / D-12** | **Customer Privacy Boundary:** Khách hàng A truy cập media chưa duyệt $\rightarrow$ Chặn `UNAUTHORIZED_MEDIA_ACCESS`. Khách hàng B truy cập thú cưng của khách A $\rightarrow$ Chặn `UNAUTHORIZED_MEDIA_ACCESS`. Đúng chủ sở hữu + media đã duyệt $\rightarrow$ Nhận Signed URL thành công. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE8-T8.9** | **D-10 / SEC-22** | **60-Day Media Retention Purge:** Bản ghi media quá 60 ngày được `rpc_purge_expired_inpatient_media` dọn dẹp $\rightarrow$ Đánh dấu `is_purged = TRUE`, ghi log `MEDIA_AUTO_PURGED_60_DAYS`. Truy cập media đã xóa bị chặn `MEDIA_PURGED`. | `DO PASSED` | **`RUNTIME PASS`** |
| **GATE8-T8.10** | **Full Regression** | **Chạy kiểm thử liên hoàn Gates 1–8:** Toàn bộ 75 ca kiểm thử thực thi trên live PostgreSQL sandbox. | `75 / 75 PASS (100%)` | **`RUNTIME PASS`** |

---

## PHẦN III: BẢNG TỔNG HỢP KIỂM THỬ HỒI QUY TOÀN DIỆN (GATES 1–8)

```
==================================================================================================
PHASE 4B REGRESSION RUNTIME MATRIX (GATES 1 TO 8)
==================================================================================================
Suite 01: Kiến trúc 4 Schemas & Cô lập quyền truy cập (Isolation)      5 / 5   PASS (100%)
Suite 02: Khởi tạo 40 Bảng DDL & Bất biến quan hệ (P1-C, P1-E)        10 / 10  PASS (100%)
Suite 03: Phân quyền RBAC, Bảo vệ RLS 40/40 Bảng & Audit Log          10 / 10  PASS (100%)
Suite 04: Vòng đời Khách hàng, Thú cưng & Đặt lịch khám (Booking)     10 / 10  PASS (100%)
Suite 05: Bệnh án Lâm sàng, Điều trị Nội trú & Bản tin Y khoa         10 / 10  PASS (100%)
Suite 06: Bán hàng, Hóa đơn (Khớp tiền/Ẩn thuốc) & Quản trị Tồn kho   10 / 10  PASS (100%)
Suite 07: Trung Tâm Nhập Liệu Excel, Two-Man Rule & Safe Rollback      10 / 10  PASS (100%)
Suite 08: Thiết Bị BYOD 5 Tầng, Signed URL 15m & Purge Media 60 Ngày  10 / 10  PASS (100%)
==================================================================================================
TỔNG CỘNG LUỸ KẾ TOÀN BỘ HỆ THỐNG:                                    75 / 75  PASS (100%)
TỔNG SỐ CA THẤT BẠI (FAIL):                                                 0
TỔNG SỐ CA BỎ QUA (SKIP):                                                   0
==================================================================================================
```

---

## PHẦN IV: KHẢO SÁT & BÁO CÁO PREVIEW FRONTEND LOCALHOST

1. **Trạng thái Máy chủ Phát triển (Vite Dev Server):**
   - Đang hoạt động nền tại `http://127.0.0.1:5173/`.
2. **Hiện trạng Kết nối (Data Connection Status):**
   - **Giao diện Công Khai (Public Website):** Hoàn thiện 100% nhận diện Vibrant Editorial Luxury, 6 section trang chủ, các trang chuyên sâu (Về chúng tôi, Đội ngũ bác sĩ, Cơ sở vật chất).
   - **Form Đặt Lịch Khám (`BookingPage.tsx`):** Hiện đang chạy ở chế độ **Client-Side Simulation (Mock)** với Zod validation, hiển thị trạng thái demo và chưa gọi trực tiếp RPC `app.rpc_create_customer_appointment`. Điều này tuân thủ đúng phạm vi kiến trúc: CSDL Phase 4B đang được kiểm thử độc lập trong Docker Sandbox, chuẩn bị cho việc tích hợp frontend ở Giai đoạn 4 theo lộ trình đã chốt trong `AGENTS.md`.

---

## PHẦN V: DANH MỤC CÁC QUYẾT ĐỊNH KỸ THUẬT TIẾP TỤC GIỮ TRẠNG THÁI PENDING

1. **S-11 Admin Off-shift Override:** Tiếp tục giữ trạng thái **`PENDING OWNER APPROVAL`**. CSDL duy trì cơ chế Fail-Closed qua cờ `allow_admin_off_shift_override = FALSE` tại bảng `app.system_settings`.
2. **D-03 Chiến Lược Backup / PITR:** Tiếp tục giữ trạng thái **`PENDING OWNER APPROVAL`**; chưa cấu hình cloud tốn phí.
3. **D-18 Chuẩn Hóa Địa Chỉ Hành Chính:** Tiếp tục giữ trạng thái **`PENDING OWNER APPROVAL`**.
4. **POL-BOOKING DUAL (Chống Spam SĐT vs UUID):** Tiếp tục giữ trạng thái **`PENDING OWNER APPROVAL`**.

---

## PHẦN VI: THÔNG TIN GIT & BÀN GIAO KỸ THUẬT

- **Branch:** `feat/phase-4b-supabase-foundation`
- **File migration mới:**
  - [`supabase/migrations/20261106000019_byod_device_sessions_rpcs.sql`](file:///d:/webbvct/supabase/migrations/20261106000019_byod_device_sessions_rpcs.sql)
  - [`supabase/migrations/20261106000020_media_storage_policies.sql`](file:///d:/webbvct/supabase/migrations/20261106000020_media_storage_policies.sql)
- **File test runtime mới:** [`test/runtime/08_byod_media.test.cjs`](file:///d:/webbvct/test/runtime/08_byod_media.test.cjs)
- **Tài liệu báo cáo:** [`docs/qa/PHASE4B_STAGE8_GATE8_REPORT.md`](file:///d:/webbvct/docs/qa/PHASE4B_STAGE8_GATE8_REPORT.md)
- **Chi phí phát sinh:** **$0.00**.
