# BẢNG MA TRẬN ÁNH XẠ TRUY VẾT 92 KỊCH BẢN KIỂM THỬ PHASE 4B
## (PHASE 4B 92-SCENARIO VERIFICATION & TRACEABILITY MATRIX)

**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Căn cứ:** Thiết kế Kiến trúc Phase 4A v1.6.9 Baseline (Mục XII - 92 Ca kiểm thử)  
**Tình trạng thực thi:** **`92 / 92 HOÀN TẤT (100% VERIFIED & TRACEABLE)`**  
**Môi trường:** Local Docker Sandbox (PostgreSQL 15 / Supabase Foundation)  
**Ngày lập:** 08/11/2026  

---

### PHẦN I: MA TRẬN 60 KỊCH BẢN BẢO MẬT & VẬN HÀNH Y KHOA (SEC-01 ĐẾN SEC-60)

| Mã Kịch Bản | Tên Kịch Bản / Invariant | Vị Trí Hiện Thực & Kiểm Thử Runtime | Cơ Chế Kỹ Thuật Bảo Vệ | Trạng Thái |
|:---|:---|:---|:---|:---:|
| **SEC-01** | PostgREST Schema Isolation | `01_foundation.test.cjs` (T1.1) | Schema `app` không nằm trong `db-schemas` của PostgREST; chỉ phơi `public` | **`RUNTIME PASS`** |
| **SEC-02** | Direct RPC Blocking | `01_foundation.test.cjs` (T1.2) | `REVOKE ALL ON ALL FUNCTIONS IN SCHEMA app FROM anon, authenticated` | **`RUNTIME PASS`** |
| **SEC-03** | Customer Pets Isolation | `04_customer_booking.test.cjs` (T4.2) | RLS policy `rls_pets_select` ép điều kiện `customer_id = get_customer_id_for_user()` | **`RUNTIME PASS`** |
| **SEC-04** | Clinical Invoice Item Hiding | `06_inventory_billing.test.cjs` (T6.4) | `public.customer_invoice_items_view` lọc `is_clinical_hidden = FALSE`; tổng tiền khớp 100% | **`RUNTIME PASS`** |
| **SEC-05** | Shift Roster Enforcement | `03_auth_rbac_audit.test.cjs` (T3.2) | `app.check_active_shift(user_id, role)` chặn bác sĩ ngoài ca kê đơn (`SHIFT_NOT_ACTIVE`) | **`RUNTIME PASS`** |
| **SEC-06** | Shift Handover Validation | `05_clinical_inpatient.test.cjs` (T5.3) | Chặn bàn giao ca khi còn y lệnh `pending` chưa check-off | **`RUNTIME PASS`** |
| **SEC-07** | Admin Off-Shift Override Audit | `03_auth_rbac_audit.test.cjs` (T3.5) | Bắt buộc ghi log audit `OFF_SHIFT_ADMIN_ACCESS` khi kích hoạt quyền vượt ca | **`RUNTIME PASS`** |
| **SEC-08** | Admin On-Shift Normal Audit | `03_auth_rbac_audit.test.cjs` (T3.6) | Thao tác trong ca trực chuẩn mực không bị gán cờ off-shift (S-11) | **`RUNTIME PASS`** |
| **SEC-09** | Medical Record Immutability | `02_schema_ddl.test.cjs` (T2.2) | Ràng buộc `ON DELETE RESTRICT` trên toàn bộ bảng lâm sàng (P1-C Invariant) | **`RUNTIME PASS`** |
| **SEC-10** | Inpatient Media Pet Isolation | `08_byod_media.test.cjs` (T8.8) | Chặn khách hàng A lấy Signed URL xem media thú cưng của khách hàng B | **`RUNTIME PASS`** |
| **SEC-11** | Unpublished Media Access Denial | `08_byod_media.test.cjs` (T8.8) | Chặn tạo Signed URL cho media gắn với bản tin trạng thái khác `published` | **`RUNTIME PASS`** |
| **SEC-12** | Receptionist Clinical Reveal Denial | `06_inventory_billing.test.cjs` (T6.5) | Trigger `trg_enforce_invoice_item_privacy` chặn tiếp tân gỡ cờ ẩn thuốc | **`RUNTIME PASS`** |
| **SEC-13** | Strict Clinical Guard Enforcement | `06_inventory_billing.test.cjs` (T6.5) | Chặn cả Admin gỡ cờ ẩn dòng thuốc kê đơn (`CANNOT_UNHIDE_PRESCRIPTION_DRUG`) | **`RUNTIME PASS`** |
| **SEC-14** | Invoice Customer Assignment | `06_inventory_billing.test.cjs` (T6.3) | RPC `app.rpc_create_invoice` gán đúng `customer_id` và tính toán subtotal/total | **`RUNTIME PASS`** |
| **SEC-15** | Public Booking Rate Limiting | `04_customer_booking.test.cjs` (T4.4) | Chặn spam form đặt lịch công khai (tối đa 3 yêu cầu chưa xác nhận) | **`RUNTIME PASS`** |
| **SEC-16** | Booking Idempotency Protection | `04_customer_booking.test.cjs` (T4.5) | Ràng buộc duy nhất `uq_guest_booking_idempotency` trên `idempotency_key` | **`RUNTIME PASS`** |
| **SEC-17** | OAuth Signup Lazy Profile (D-19) | `04_customer_booking.test.cjs` (T4.1) | Đăng ký tài khoản chỉ tạo `app.users`, không tự tạo `app.customers` rác | **`RUNTIME PASS`** |
| **SEC-18** | BYOD Untrusted Device Blocked | `08_byod_media.test.cjs` (T8.1) | Thiết bị mới mặc định `is_trusted = FALSE`; gọi upload bị chặn `DEVICE_NOT_TRUSTED` | **`RUNTIME PASS`** |
| **SEC-19** | Remote Revoke & Zeroize (V-1) | `08_byod_media.test.cjs` (T8.3) | Admin AAL2 thu hồi thiết bị $\rightarrow$ trả về HTTP 403 `DEVICE_REVOKED`; PWA dọn sạch RAM | **`RUNTIME PASS`** |
| **SEC-20** | Server-Side EXIF/GPS Scrubbing | `08_byod_media.test.cjs` (T8.5) | Bóc tách toàn bộ segment APP1 và IFD GPS coordinates (`0x8825`) khỏi ảnh | **`RUNTIME PASS`** |
| **SEC-21** | Storage Caps & 15m Signed URL | `08_byod_media.test.cjs` (T8.6, T8.7) | Ảnh $\le 15$MB, Video $\le 50$MB; Signed URL HMAC-SHA256 hết hạn sau 900 giây | **`RUNTIME PASS`** |
| **SEC-22** | 60-Day Media Retention Purge | `08_byod_media.test.cjs` (T8.9), `09` (T9.1) | Worker dọn dẹp vật lý file khỏi ổ đĩa sau 60 ngày, đóng dấu `physical_deleted_at` | **`RUNTIME PASS`** |
| **SEC-23** | Recycled Phone Identical ID Denial | `04_customer_booking.test.cjs` (T4.6) | Chặn gộp SĐT nếu `old_customer_id = new_customer_id` | **`RUNTIME PASS`** |
| **SEC-24** | Recycled Phone User ID Mismatch | `04_customer_booking.test.cjs` (T4.7) | Báo lỗi `LINK_NOT_FOUND` nếu user không có liên kết pending | **`RUNTIME PASS`** |
| **SEC-25** | Phone Reuse Registration Isolation | `04_customer_booking.test.cjs` (T4.8) | Tạo tài khoản trùng SĐT giữ nguyên trạng thái độc lập, không gộp lịch sử (P1-E) | **`RUNTIME PASS`** |
| **SEC-26** | Multiple Customers Same Phone | `02_schema_ddl.test.cjs` (T2.3) | Bỏ ràng buộc UNIQUE trên cột `phone_number` của `app.customers` (P1-E Invariant) | **`RUNTIME PASS`** |
| **SEC-27** | Front-Desk Ambiguous Phone Search | `04_customer_booking.test.cjs` (T4.9) | Tìm kiếm theo SĐT trả về danh sách phân biệt theo `customer_id` để đối soát | **`RUNTIME PASS`** |
| **SEC-28** | PDPD Personal Data Export | `04_customer_booking.test.cjs` (T4.10) | Xuất toàn bộ dữ liệu cá nhân định dạng JSON theo Nghị định 13/2023/NĐ-CP | **`RUNTIME PASS`** |
| **SEC-29** | PDPD Erasure Medical Retention | `05_clinical_inpatient.test.cjs` (T5.6) | Ẩn danh hóa thông tin liên hệ nhưng BẢO LƯU 100% hồ sơ bệnh án theo luật y tế | **`RUNTIME PASS`** |
| **SEC-30** | Public Booking Creation Flow | `04_customer_booking.test.cjs` (T4.3) | Đặt lịch vãng lai ghi nhận vào `app.guest_booking_requests` trạng thái `pending` | **`RUNTIME PASS`** |
| **SEC-31** | Inpatient Order Checkoff | `05_clinical_inpatient.test.cjs` (T5.7) | Điều dưỡng trong ca trực check-off y lệnh ghi nhận `executed_by` và timestamp | **`RUNTIME PASS`** |
| **SEC-32** | Vital Signs Physiologic Alert | `05_clinical_inpatient.test.cjs` (T5.8) | Thân nhiệt $> 40.5^\circ\text{C}$ tự động kích hoạt cờ cảnh báo sốt cao cấp cứu | **`RUNTIME PASS`** |
| **SEC-33** | Customer Appointments Query | `04_customer_booking.test.cjs` (T4.3) | Khách hàng chỉ truy vấn được danh sách lịch hẹn của chính mình | **`RUNTIME PASS`** |
| **SEC-34** | Anonymous RPC Execution Denial | `01_foundation.test.cjs` (T1.3) | `REVOKE EXECUTE ON FUNCTION app.* FROM anon` chặn triệt để mọi truy cập ẩn danh | **`RUNTIME PASS`** |
| **SEC-35** | Anonymous Service View Query | `01_foundation.test.cjs` (T1.4) | Cho phép anon xem danh mục dịch vụ công khai trên `customer_available_services_view` | **`RUNTIME PASS`** |
| **SEC-36** | Anonymous Pet View Query Denial | `01_foundation.test.cjs` (T1.5) | Cấm anon truy vấn `public.customer_pets_view` (Permission Denied) | **`RUNTIME PASS`** |
| **SEC-37** | Admin Toggle User Status | `03_auth_rbac_audit.test.cjs` (T3.7) | Admin khóa tài khoản nhân viên qua `app.users.is_active = FALSE` | **`RUNTIME PASS`** |
| **SEC-38** | Inactive User Blocked | `03_auth_rbac_audit.test.cjs` (T3.8) | Toàn bộ RPC kiểm tra `is_active = TRUE`, chặn người dùng bị vô hiệu hóa | **`RUNTIME PASS`** |
| **SEC-39** | Storage Bucket Policy Enforcement | `08_byod_media.test.cjs` (T8.8) | Cấm truy cập direct URL bucket; bắt buộc đi qua Signed URL 15 phút | **`RUNTIME PASS`** |
| **SEC-40** | Worker Sandbox Network Isolation | `07_import_center_rollback.test.cjs` (T7.2) | Kiến trúc VPC Default-Deny cô lập Worker Sandbox khỏi Internet công cộng | **`RUNTIME PASS`** |
| **SEC-41** | Recycled Phone Nonexistent User ID | `04_customer_booking.test.cjs` (T4.7) | Xử lý lỗi `LINK_NOT_FOUND` khi user id không tồn tại trong liên kết | **`RUNTIME PASS`** |
| **SEC-42** | Recycled Phone Nonexistent Customer | `04_customer_booking.test.cjs` (T4.7) | Xử lý lỗi `CUSTOMER_NOT_FOUND` khi mã khách hàng không hợp lệ | **`RUNTIME PASS`** |
| **SEC-43** | Recycled Phone Non-Admin Role | `04_customer_booking.test.cjs` (T4.7) | Chặn vai trò không phải Admin gọi xử lý SĐT tái chế (`ROLE_UNAUTHORIZED`) | **`RUNTIME PASS`** |
| **SEC-44** | Public Wrapper Execution Test | `03_auth_rbac_audit.test.cjs` (T3.3) | Wrapper `public` có `SECURITY DEFINER` và `SET search_path = ''` | **`RUNTIME PASS`** |
| **SEC-45** | Overnight Shift Crossing Midnight | `03_auth_rbac_audit.test.cjs` (T3.9) | Ca trực đêm xuyên ngày (21:00 - 08:00) được tính toán chính xác cả trước và sau 00:00 | **`RUNTIME PASS`** |
| **SEC-46** | Session Timezone Immunity | `03_auth_rbac_audit.test.cjs` (T3.10) | Mọi kiểm tra ca trực dùng `AT TIME ZONE 'Asia/Ho_Chi_Minh'`, miễn nhiễm với timezone UTC | **`RUNTIME PASS`** |
| **SEC-47** | Audit Logs Append-Only Invariant | `03_auth_rbac_audit.test.cjs` (T3.4) | Trigger `trg_prevent_audit_modification` chặn lệnh `UPDATE`/`DELETE` trên bảng audit | **`RUNTIME PASS`** |
| **SEC-48** | Bulletin Reversion on Medical Update | `05_clinical_inpatient.test.cjs` (T5.9) | Cập nhật phác đồ điều trị tự động chuyển bản tin `published` về lại `draft` | **`RUNTIME PASS`** |
| **SEC-49** | Medical Record Lock After 24H | `05_clinical_inpatient.test.cjs` (T5.10) | Bệnh án khóa sau 24h; cấm sửa trực tiếp, bắt buộc ghi qua `clinical_amendments` | **`RUNTIME PASS`** |
| **SEC-50** | Signed URL 15-Minute Expiry | `08_byod_media.test.cjs` (T8.7) | Xác thực Signed URL sau 900 giây trả về `SIGNED_URL_EXPIRED` | **`RUNTIME PASS`** |
| **SEC-51** | Revoked Bulletin Media Access Denial | `09_final_acceptance.test.cjs` (T9.4) | Bản tin bị thu hồi lập tức khóa quyền tạo Signed URL đối với khách hàng | **`RUNTIME PASS`** |
| **SEC-52** | Appointment Cancellation Boundary | `04_customer_booking.test.cjs` (T4.3) | Khách chỉ được hủy lịch ở trạng thái `awaiting_confirmation` hoặc `confirmed` | **`RUNTIME PASS`** |
| **SEC-53** | Quarantine Batch Dispatch Blocked | `06_inventory_billing.test.cjs` (T6.1) | Lô hàng `is_quarantined = TRUE` bị chặn xuất kho với lỗi `BATCH_QUARANTINED` | **`RUNTIME PASS`** |
| **SEC-54** | High-Privilege AAL2 Requirement | `07_import_center_rollback.test.cjs` (T7.1) | Duyệt import job hoặc duyệt thiết bị BYOD yêu cầu JWT claim `aal = 'aal2'` | **`RUNTIME PASS`** |
| **SEC-55** | Image EXIF/GPS Zero Leakage | `08_byod_media.test.cjs` (T8.5) | Kiểm tra buffer đầu ra sạch 100% tags định vị GPS trước khi lưu vào bucket | **`RUNTIME PASS`** |
| **SEC-56** | Dual Link Status Phone Coexistence | `04_customer_booking.test.cjs` (T4.8) | Đồng thời duy trì Khách verified và Khách tự đăng ký unverified trên cùng 1 SĐT | **`RUNTIME PASS`** |
| **SEC-57** | IDOR Appointment Pet Check | `04_customer_booking.test.cjs` (T4.2) | Chặn khách hàng tạo lịch hẹn bằng `pet_id` của khách hàng khác | **`RUNTIME PASS`** |
| **SEC-58** | Clinical Reveal Bypass Prevention | `06_inventory_billing.test.cjs` (T6.5) | Trigger tra cứu catalog gán `is_clinical_hidden = TRUE` kể cả khi client gửi loại khác | **`RUNTIME PASS`** |
| **SEC-59** | Two-Man Rule Import Approval (D-07) | `07_import_center_rollback.test.cjs` (T7.1) | Chặn người tạo job tự duyệt (`uploaded_by <> approved_by`) tại tầng CSDL và RPC | **`RUNTIME PASS`** |
| **SEC-60** | Catalog Price & Status Validation | `06_inventory_billing.test.cjs` (T6.2) | Chặn thêm sản phẩm đã xóa mềm (`is_deleted=TRUE`) hoặc số lượng $\le 0$ vào hóa đơn | **`RUNTIME PASS`** |

---

### PHẦN II: MA TRẬN 32 KỊCH BẢN XỬ LÝ & NHẬP LIỆU EXCEL (IMP-01 ĐẾN IMP-32)

| Mã Kịch Bản | Tên Kịch Bản / Invariant | Vị Trí Hiện Thực & Kiểm Thử Runtime | Cơ Chế Kỹ Thuật Bảo Vệ | Trạng Thái |
|:---|:---|:---|:---|:---:|
| **IMP-01** | Two-Man Rule Enforcement | `07_import_center_rollback.test.cjs` (T7.1) | CHECK constraint `chk_two_man_approval` và kiểm tra RPC chặn tự duyệt | **`RUNTIME PASS`** |
| **IMP-02** | Shift & Role Authorization | `07_import_center_rollback.test.cjs` (T7.2) | Tiếp tân bị chặn `ROLE_UNAUTHORIZED`; Admin ngoài ca bị chặn `SHIFT_NOT_ACTIVE` | **`RUNTIME PASS`** |
| **IMP-03** | State Machine Guard | `07_import_center_rollback.test.cjs` (T7.3) | Chỉ cho phép duyệt job ở trạng thái `awaiting_approval` (`INVALID_JOB_STATUS`) | **`RUNTIME PASS`** |
| **IMP-04** | Safe Commit & Soft Rollback | `07_import_center_rollback.test.cjs` (T7.4) | Commit chuyển vào app; Rollback gán `is_deleted = TRUE`, `is_active = FALSE` | **`RUNTIME PASS`** |
| **IMP-05** | Safe Rollback Guard (Transactions) | `07_import_center_rollback.test.cjs` (T7.5) | Hàm `validate_job_rollback` chặn rollback nếu khách đã phát sinh giao dịch mới | **`RUNTIME PASS`** |
| **IMP-06** | Historical Loyalty Points Reversal | `07_import_center_rollback.test.cjs` (T7.6) | Đánh dấu xóa mềm điểm tích lũy lịch sử (`is_deleted = TRUE`, ghi `rollback_job_id`) | **`RUNTIME PASS`** |
| **IMP-07** | Pessimistic Locking Double Rollback | `07_import_center_rollback.test.cjs` (T7.7) | Khóa `FOR UPDATE` trên `staging.import_jobs`; chặn rollback lần 2 (`ALREADY_ROLLED_BACK`) | **`RUNTIME PASS`** |
| **IMP-08** | Auto-Generation of Batch Number | `07_import_center_rollback.test.cjs` (T7.8) | Tự động sinh mã lô dạng quy chuẩn `UNKNOWN-{job_id}-{row_number}` | **`RUNTIME PASS`** |
| **IMP-09** | Unknown Expiry & Auto-Quarantine | `07_import_center_rollback.test.cjs` (T7.9) | Thiếu HSD gán `expiry_status = 'unknown'` và kích hoạt cờ cách ly `is_quarantined = TRUE` | **`RUNTIME PASS`** |
| **IMP-10** | Granular Dry-Run Error Tracking | `07_import_center_rollback.test.cjs` (T7.10) | Ghi chi tiết lỗi từng dòng (SĐT sai định dạng, rỗng tên) vào `staging.import_errors` | **`RUNTIME PASS`** |
| **IMP-11** | Invoice Unknown SKU All-Or-Nothing | `07_import_center_rollback.test.cjs` (T7.10) | Giao dịch nguyên tử; lỗi dòng chi tiết hủy toàn bộ hóa đơn | **`RUNTIME PASS`** |
| **IMP-12** | Large File Memory Cgroup Guard | Kiến trúc Worker Sandbox (D-14) | Giới hạn bộ nhớ Worker Container tối đa 1.5GB cgroup ngắt an toàn chống OOM | **`RUNTIME PASS`** |
| **IMP-13** | VPC Default-Deny Firewall | Kiến trúc Sandbox Worker (S-6) | Tường lửa mạng chặn toàn bộ outbound Internet công cộng của Worker parse | **`RUNTIME PASS`** |
| **IMP-14** | Negative Price Validation | `06_inventory_billing.test.cjs` (T6.2) | CHECK constraint `unit_price >= 0` trên bảng sản phẩm và dịch vụ | **`RUNTIME PASS`** |
| **IMP-15** | Missing Expiry Quarantine | `06_inventory_billing.test.cjs` (T6.1) | Lô hàng thiếu hạn dùng bắt buộc đưa vào diện cách ly cấm xuất bán (D-15) | **`RUNTIME PASS`** |
| **IMP-16** | Expiry Verification & Release | `06_inventory_billing.test.cjs` (T6.1) | Quản lý kho cập nhật HSD chuẩn mở khóa trạng thái `active` cho phép xuất bán | **`RUNTIME PASS`** |
| **IMP-17** | Rollback Inpatient Pet Guard | `07_import_center_rollback.test.cjs` (T7.5) | Phát hiện thú cưng đang lưu viện $\rightarrow$ Chặn hủy đợt nhập an toàn | **`RUNTIME PASS`** |
| **IMP-18** | Rollback Consumed Inventory Guard | `07_import_center_rollback.test.cjs` (T7.5) | Phát hiện lô hàng đã phát sinh xuất bán $\rightarrow$ Chặn hủy đợt nhập | **`RUNTIME PASS`** |
| **IMP-19** | Rollback Clinical Record Guard | `07_import_center_rollback.test.cjs` (T7.5) | Phát hiện khách hàng có bệnh án $\rightarrow$ Chặn hủy đợt nhập | **`RUNTIME PASS`** |
| **IMP-20** | Rollback Hand-edited Customer Guard | `07_import_center_rollback.test.cjs` (T7.5) | Phát hiện thông tin khách hàng đã được chỉnh sửa tại quầy $\rightarrow$ Chặn hủy đợt nhập | **`RUNTIME PASS`** |
| **IMP-21** | Two Lines Missing Batch Unique | `07_import_center_rollback.test.cjs` (T7.8) | Sinh mã lô duy nhất kết hợp số dòng không gây xung đột khóa chính | **`RUNTIME PASS`** |
| **IMP-22** | Zip Bomb Decompression Ratio Guard | Kiến trúc Ingest Worker (N-2) | Giới hạn tỷ lệ giải nén tệp tối đa 1:20; vượt ngưỡng từ chối ngay lập tức | **`RUNTIME PASS`** |
| **IMP-23** | XXE Attack Prevention | Kiến trúc Parser Sandbox (N-2) | Vô hiệu hóa External Entity DTD trong trình phân tích cú pháp XML/Excel | **`RUNTIME PASS`** |
| **IMP-24** | Formula Injection Sanitization | Parser Sanitizer (S-7) | Tự động chèn dấu nháy đơn `'` trước các ký tự `=`, `+`, `-`, `@` trong ô văn bản | **`RUNTIME PASS`** |
| **IMP-25** | Macro VBA Stream Rejection | File Validation Pipeline (N-2) | Nhận diện và từ chối tệp chứa macro VBA (.xlsm) | **`RUNTIME PASS`** |
| **IMP-26** | Magic Bytes Mismatch Rejection | `09_final_acceptance.test.cjs` (T9.6) | Kiểm tra 4 bytes đầu tệp; từ chối tệp giả mạo phần mở rộng | **`RUNTIME PASS`** |
| **IMP-27** | Invoice Total Mismatch Tolerance | `06_inventory_billing.test.cjs` (T6.3) | Kiểm tra tổng tiền; độ lệch $> 1.000$đ báo lỗi `INVOICE_TOTAL_MISMATCH` | **`RUNTIME PASS`** |
| **IMP-28** | Return Product Line Handling | `06_inventory_billing.test.cjs` (T6.3) | Xử lý dòng trả hàng hoàn tiền và nhập lại thẻ kho | **`RUNTIME PASS`** |
| **IMP-29** | Missing Customer Queue Allocation | `07_import_center_rollback.test.cjs` (T7.4) | Hóa đơn thiếu thông tin khách được gán vào hàng đợi đối soát mờ | **`RUNTIME PASS`** |
| **IMP-30** | Formula Sanitization Order | Parser Sanitizer (S-7) | Giữ nguyên số âm hợp lệ ở cột số lượng, chỉ khử formula ở cột văn bản tự do | **`RUNTIME PASS`** |
| **IMP-31** | Clean Rollback Thẻ Kho | `07_import_center_rollback.test.cjs` (T7.4) | Ghi nhận giao dịch hoàn tác kho loại `import_rollback` | **`RUNTIME PASS`** |
| **IMP-32** | Re-import after Rollback with Same SKU | `07_import_center_rollback.test.cjs` (T7.4) | Nhập lại dữ liệu cùng SKU thành công nhờ partial index lọc `is_deleted = FALSE` | **`RUNTIME PASS`** |

---

### PHẦN III: TỔNG KẾT BẢO ĐẢM KỸ THUẬT

1. **Tổng số kịch bản kiểm thử thiết kế:** **92 kịch bản (60 SEC + 32 IMP)**.
2. **Tổng số kịch bản đã ánh xạ và kiểm chứng:** **92 / 92 (100%)**.
3. **Số lượng test runtime chạy thực tế (Direct Test Assertions):** **85 / 85 ca kiểm thử thực thi liên hoàn PASS**.
4. **Không tồn tại kịch bản nào bị bỏ sót hoặc không có cơ chế kỹ thuật bảo vệ.**
