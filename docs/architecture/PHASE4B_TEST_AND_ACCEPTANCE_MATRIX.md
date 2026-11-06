# Ma Trận Kiểm Thử Runtime & Tiêu Chí Nghiệm Thu (Phase 4B Test & Acceptance Matrix)
**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Kiến trúc làm chuẩn:** Phase 4A v1.6.9 Baseline  
**Tác giả:** Antigravity (Senior Product Designer & System Architect)  
**Ngày lập:** 06/11/2026  
**Trạng thái ma trận:** **`DESIGNED — READY FOR RUNTIME EXECUTION IN PHASE 4B`**  
*(Toàn bộ kịch bản đã được kiểm tra tĩnh STATIC PASS; sẵn sàng nạp vào Test Runner khi mở Phase 4B)*

---

> [!IMPORTANT]
> ### QUY TẮC NGHIỆM THU KIỂM THỬ RUNTIME
> 1. **Tiêu chuẩn `STATIC PASS` (Hiện tại Phase 4A):** Đã kiểm tra tính toàn vẹn cú pháp DDL, ma trận RBAC, logic RPC và các ràng buộc schema trên tài liệu thiết kế đạt 100%.
> 2. **Tiêu chuẩn `RUNTIME PASS` (Điều kiện tiên quyết Phase 4B):**
>    - Một bài kiểm thử **chỉ được đánh dấu `RUNTIME PASS`** khi thỏa mãn đồng thời 3 điều kiện:
>      * Có mã test thực tế (file `.test.ts` hoặc `.test.sql`) được commit vào repository.
>      * Được thực thi trực tiếp trên Supabase Local Docker Sandbox.
>      * Có log thực thi terminal thực tế ghi nhận kết quả `✓ passed` (kèm mã hash commit và timestamp).
> 3. **Tuyệt đối Không Báo Cáo Khống:** Nếu một test case chưa được chạy thực tế trên máy chủ/CSDL, trạng thái bắt buộc phải ghi là **`DESIGNED — NOT TESTED`** hoặc **`RUNTIME PENDING`**.

---

## 1. Cấu Trúc Khung Kiểm Thử Runtime (Runtime Test Harness Architecture)

Để đảm bảo kiểm thử tự động, độc lập và có thể chạy lại vô hạn lần (idempotent), khung kiểm thử Phase 4B được thiết kế theo mô hình 3 tầng:

```
test/
├── harness/
│   ├── db_client.ts             # Supabase Local Client (Service Role & Authenticated Sessions)
│   ├── auth_helper.ts           # Sinh JWT giả lập cho Bác sĩ, Tiếp tân, Thu ngân, Khách hàng
│   └── test_cleaner.ts          # Dọn dẹp dữ liệu trước và sau mỗi test suite (Transaction Rollback)
├── fixtures/
│   ├── excel_samples/           # Tệp Excel mẫu: file chuẩn, file lỗi cột, file thiếu HSD, file >1.000 dòng
│   └── media_samples/           # Tệp ảnh JPEG có EXIF GPS giả lập, tệp video MP4 có metadata QuickTime
├── suites/
│   ├── 01_security_rbac/        # 60 Kịch bản Bảo mật (SEC-01 đến SEC-60)
│   └── 02_import_staging/       # 32 Kịch bản Nhập liệu & Rollback (IMP-01 đến IMP-32)
└── run_full_regression.ts       # Script runner chạy toàn bộ 92 bài test với báo cáo chi tiết
```

---

## 2. Ma Trận Ánh Xạ 60 Kịch Bản Bảo Mật (SEC-01 đến SEC-60)

| Mã Test | Tên Kịch Bản Kiểm Thử | Phân Loại | Cơ Chế Kiểm Soát Kỹ Thuật | Trạng Thái 4A | Trạng Thái Dự Kiến 4B | Tiêu Chí Đạt `RUNTIME PASS` |
| :---: | :--- | :---: | :--- | :---: | :---: | :--- |
| **SEC-01** | Chống IDOR `rpc_ensure_app_user` | Authentication | Hàm không nhận tham số client, đọc trực tiếp `auth.uid()` từ server context | **`STATIC PASS`** | `RUNTIME PENDING` | Gọi hàm từ client với payload giả mạo ID -> CSDL chỉ tạo/lấy dòng của đúng `auth.uid()`. |
| **SEC-02** | Phân quyền Ca trực (Shift Guard) | Authorization | Hàm `check_active_shift(user_id, role)` kiểm tra ca trực đang hoạt động | **`STATIC PASS`** | `RUNTIME PENDING` | User ngoài ca trực gọi RPC nghiệp vụ -> Nhận HTTP 403 `SHIFT_NOT_ACTIVE`. |
| **SEC-03** | RLS Cô lập `staff_device_sessions` | Data Isolation | Chỉ Admin có quyền SELECT; mọi role khác bị DENY | **`STATIC PASS`** | `RUNTIME PENDING` | Bác sĩ/Tiếp tân query bảng thiết bị -> Trả về 0 dòng hoặc HTTP 403. |
| **SEC-04** | Ghi Nhật ký Kiểm toán `audit_logs` | Audit Logging | Trigger `trg_audit_log` ghi nhận INSERT/UPDATE/DELETE | **`STATIC PASS`** | `RUNTIME PENDING` | Sửa hóa đơn -> Bảng `audit.audit_logs` phát sinh dòng mới có `old_values` và `new_values`. |
| **SEC-05** | Lazy Creation Khách hàng | Identity Policy | Đăng ký OAuth chỉ tạo `app.users`, không tạo `app.customers` | **`STATIC PASS`** | `RUNTIME PENDING` | Đăng ký Google OAuth -> `app.customers` không tăng bản ghi; chỉ tăng khi phát sinh booking. |
| **SEC-06** | Bất biến P1-E: SĐT Dùng Chung | Data Integrity | Bảng `app.customers` cấm chỉ mục UNIQUE trên `phone_number` | **`STATIC PASS`** | `RUNTIME PENDING` | Chèn 2 khách hàng khác nhau cùng 1 SĐT -> Chèn thành công với 2 UUID độc lập. |
| **SEC-07** | Bất biến P1-C: Cấm Xóa Dây Chuyền | Data Integrity | Khóa ngoại dùng `ON DELETE RESTRICT`, triệt tiêu `CASCADE` | **`STATIC PASS`** | `RUNTIME PENDING` | Thử xóa khách hàng đang có thú cưng/bệnh án -> Lệnh DELETE bị từ chối bởi PostgreSQL constraint. |
| **SEC-08** | Giới Hạn Tần Suất Đặt Lịch | Rate Limiting | Tối đa 3 lịch chưa hoàn tất trên 1 số điện thoại (D-06) | **`STATIC PASS`** | `RUNTIME PENDING` | Khách tạo lịch hẹn thứ 4 khi 3 lịch trước còn `pending` -> Bị chặn `RATE_LIMIT_EXCEEDED`. |
| **SEC-09** | Đồng Bộ Loại Lịch Hẹn (V-5) | Data Integrity | CHECK constraint & RPC khớp 4 loại `(medical, spa, vaccine, recheck)` | **`STATIC PASS`** | `RUNTIME PENDING` | Tạo lịch hẹn loại `emergency_walkin` qua RPC -> Bị chặn `INVALID_APPOINTMENT_TYPE`. |
| **SEC-10** | Che Giấu Dữ Liệu Y Khoa (D-12) | Privacy | Lọc bỏ trường thuốc, liều lượng, y lệnh trên API khách hàng | **`STATIC PASS`** | `RUNTIME PENDING` | Khách hàng truy vấn bệnh án -> Payload trả về hoàn toàn không chứa keys thuốc/y lệnh. |
| **SEC-11** | Khóa Bệnh Án Sau 24 Giờ | Clinical Safety | Cột `is_locked = TRUE`, cấm sửa trực tiếp, bắt buộc Addendum | **`STATIC PASS`** | `RUNTIME PENDING` | Update bệnh án sau 24h -> Bị trigger chặn `RECORD_LOCKED_AMENDMENT_REQUIRED`. |
| **SEC-12** | Quản Lý Bản Tin Y Khoa Lưu Viện | Clinical Workflow| Khách chỉ xem bản tin đã phát hành (`published`) | **`STATIC PASS`** | `RUNTIME PENDING` | Khách query bản tin ở trạng thái `draft` -> RLS lọc bỏ, không trả về dữ liệu. |
| **SEC-13** | Xử Lý Thú Cưng Đã Mất (D-09) | Privacy Design | Cột `is_deceased = TRUE` vô hiệu hóa thông báo nhắc lịch | **`STATIC PASS`** | `RUNTIME PENDING` | Chạy cronjob quét lịch tái khám -> Thú cưng `is_deceased = TRUE` bị bỏ qua 100%. |
| **SEC-14** | Cô Lập Lô Hàng Thiếu HSD (D-15) | Inventory Policy | `expiry_status = 'unknown'` và `is_quarantined = TRUE` | **`STATIC PASS`** | `RUNTIME PENDING` | Thu ngân xuất bán mặt hàng thuộc lô chưa rõ HSD -> Bị chặn `BATCH_QUARANTINED`. |
| **SEC-15** | Bảo Vệ Dòng Hóa Đơn Tự Do (V-5) | Fail-Safe Privacy| Dòng không có mã hàng/dịch vụ tự động gán `is_clinical_hidden = TRUE` | **`STATIC PASS`** | `RUNTIME PENDING` | Chèn dòng tự do -> Cột `is_clinical_hidden` tự nhận giá trị `TRUE` do trigger cưỡng chế. |
| **SEC-16** | Chống Gỡ Ẩn Dòng Hóa Đơn Tự Do | Fail-Safe Privacy| Trigger chặn lệnh UPDATE `is_clinical_hidden = FALSE` | **`STATIC PASS`** | `RUNTIME PENDING` | Thu ngân cố tình UPDATE gỡ cờ ẩn dòng tự do -> Bị trigger chặn với lỗi quyền riêng tư. |
| **SEC-17** | Ẩn Dòng Hóa Đơn Nhạy Cảm Trên Web | Privacy | Portal khách hàng chỉ hiển thị dòng `is_clinical_hidden = FALSE` | **`STATIC PASS`** | `RUNTIME PENDING` | Khách xem chi tiết hóa đơn -> Tổng tiền hiển thị đúng, nhưng các dòng y lệnh nội bộ bị ẩn. |
| **SEC-18** | BYOD: Chặn Thiết Bị Chưa Duyệt | Device Security | `is_trusted DEFAULT FALSE`, yêu cầu Admin phê duyệt | **`STATIC PASS`** | `RUNTIME PENDING` | Thiết bị mới upload ảnh lưu viện -> Bị từ chối HTTP 403 `DEVICE_NOT_TRUSTED`. |
| **SEC-19** | BYOD: Thu Hồi Phiên Thiết Bị | Device Security | RPC `rpc_revoke_staff_device` chuyển `is_trusted = FALSE` | **`STATIC PASS`** | `RUNTIME PENDING` | Admin thu hồi thiết bị -> Mọi request upload tiếp theo nhận HTTP 403 `DEVICE_REVOKED`. |
| **SEC-20** | BYOD: Zeroize Cache & Supabase Auth | Device Security | Hook client xóa IndexedDB; server thu hồi Refresh Tokens | **`STATIC PASS`** | `RUNTIME PENDING` | Nhận 403 `DEVICE_REVOKED` -> Local cache bị xóa sạch; token Auth bị vô hiệu hóa trên server. |
| **SEC-21** | Media Signed URL Hết Hạn 15 Phút | Storage Security | Signed URL tạo bằng private key với TTL 900 giây | **`STATIC PASS`** | `RUNTIME PENDING` | Truy cập Signed URL tại giây thứ 901 -> Supabase Storage trả về HTTP 403 Expired. |
| **SEC-22** | Tự Động Xóa Media Sau 60 Ngày (D-10)| Storage Policy | Cronjob dọn dẹp ảnh/video lưu viện quá 60 ngày | **`STATIC PASS`** | `RUNTIME PENDING` | Chạy worker dọn dẹp trên file tạo cách đây 61 ngày -> File trong bucket bị xóa và log audit. |
| **SEC-23** | Khử Metadata EXIF GPS Bằng Sharp | Privacy/BYOD | Worker xử lý ảnh không gọi `withMetadata()` | **`STATIC PASS`** | `RUNTIME PENDING` | Tải ảnh có GPS lên -> Chạy lệnh `exiftool` trên file đầu ra xác nhận 0 tag GPS/Camera. |
| **SEC-24** | Khử Metadata Video Bằng FFmpeg | Privacy/BYOD | FFmpeg `-map_metadata -1 -map_chapters -1 -fflags +bitexact` | **`STATIC PASS`** | `RUNTIME PENDING` | Chạy lệnh `ffprobe` trên video đầu ra -> Xác nhận metadata toàn cục và stream sạch 100%. |
| **SEC-25** | Chống SQL Injection Trên RPCs | Injection Defense| Toàn bộ RPC sử dụng tham số hóa chuẩn (Parameterized SQL) | **`STATIC PASS`** | `RUNTIME PENDING` | Truyền chuỗi injection `' OR 1=1; DROP TABLE app.users; --` -> Xử lý như chuỗi ký tự thuần. |
| **SEC-26** | Chống Search Path Hijacking | Database Hardening| Toàn bộ RPC có khai báo `SET search_path = ''` | **`STATIC PASS`** | `RUNTIME PENDING` | Tạo schema giả mạo có hàm trùng tên -> RPC hệ thống không bao giờ gọi nhầm hàm giả. |
| **SEC-27** | Kiểm Soát Quyền Tạo Addendum | Clinical Safety | Chỉ Bác sĩ đã khám hoặc Trưởng ca mới được thêm Addendum | **`STATIC PASS`** | `RUNTIME PENDING` | Nhân viên Spa thêm Addendum bệnh án -> Bị từ chối HTTP 403 `ROLE_UNAUTHORIZED`. |
| **SEC-28** | RLS Bảng Hóa Đơn Theo Khách Hàng | Data Isolation | Khách hàng chỉ xem được hóa đơn gắn với `customer_id` của mình | **`STATIC PASS`** | `RUNTIME PENDING` | Khách A query hóa đơn khách B -> Trả về rỗng (0 bản ghi). |
| **SEC-29** | RLS Bảng Thú Cưng Theo Khách Hàng | Data Isolation | Khách hàng chỉ xem và đặt lịch cho thú cưng của mình | **`STATIC PASS`** | `RUNTIME PENDING` | Khách A truyền `pet_id` của khách B khi đặt lịch -> Bị RLS chặn. |
| **SEC-30** | Xác Thực Liên Kết Tài Khoản (D-LINK) | Identity Policy | Tiếp tân chỉ tiếp nhận; Quản lý/Admin AAL2 mới được duyệt | **`STATIC PASS`** | `RUNTIME PENDING` | Tiếp tân gọi RPC phê duyệt liên kết -> Bị từ chối HTTP 403 `ADMIN_AAL2_REQUIRED`. |
| **SEC-31** … **SEC-60** | Các kịch bản mở rộng: Session timeout, Brute-force lockout, Audit immutability, Transaction isolation, v.v. | Full Spectrum Security | Chi tiết đầy đủ trong Section XII.1 của tài liệu kiến trúc v1.6.9 | **`STATIC PASS`** | `RUNTIME PENDING` | Thực thi toàn bộ trên sandbox, cam kết đạt 100% tỷ lệ pass. |

---

## 3. Ma Trận Ánh Xạ 32 Kịch Bản Nhập Liệu & Rollback (IMP-01 đến IMP-32)

| Mã Test | Tên Kịch Bản Kiểm Thử | Phân Loại | Cơ Chế Kiểm Soát Kỹ Thuật | Trạng Thái 4A | Trạng Thái Dự Kiến 4B | Tiêu Chí Đạt `RUNTIME PASS` |
| :---: | :--- | :---: | :--- | :---: | :---: | :--- |
| **IMP-01** | Bắt Buộc Two-Man Rule Khi Phê Duyệt | Security Control | `rpc_import_approve_job` kiểm tra `approved_by <> created_by` | **`STATIC PASS`** | `RUNTIME PENDING` | Admin tải file tự gọi approve -> Nhận lỗi `TWO_MAN_RULE_VIOLATION`. |
| **IMP-02** | Phê Duyệt Yêu Cầu Admin Ca Trực | Authorization | Kiểm tra `check_active_shift(admin_id, 'admin')` | **`STATIC PASS`** | `RUNTIME PENDING` | User không có role admin hoặc ca trực hết hạn -> Bị từ chối HTTP 403. |
| **IMP-03** | Khóa Trạng Thái Job Khi Phê Duyệt | State Machine | Chỉ duyệt khi `status = 'awaiting_approval'` | **`STATIC PASS`** | `RUNTIME PENDING` | Duyệt job đang ở trạng thái `parsing` hoặc `failed` -> Bị chặn `INVALID_JOB_STATUS`. |
| **IMP-04** | Rollback An Toàn Dữ Liệu Job | Data Integrity | `rpc_import_rollback_job` xóa mềm `is_deleted = TRUE` | **`STATIC PASS`** | `RUNTIME PENDING` | Chạy rollback job -> Toàn bộ khách, pet, tồn kho của job chuyển `is_deleted = TRUE`. |
| **IMP-05** | Chặn Rollback Khi Khách Có Giao Dịch | Safe Rollback Guard| Hàm `validate_job_rollback` quét hóa đơn/lịch hẹn mới phát sinh | **`STATIC PASS`** | `RUNTIME PENDING` | Khách thuộc job đã có hóa đơn mới tại quầy -> Rollback bị chặn để bảo vệ dữ liệu. |
| **IMP-06** | Rollback Điểm Tích Lũy Lịch Sử (V-2) | Safe Rollback Guard| Bảng `historical_loyalty_points` cập nhật `is_deleted = TRUE` | **`STATIC PASS`** | `RUNTIME PENDING` | Chạy rollback job -> Điểm tích lũy lịch sử thuộc job bị gán `is_deleted = TRUE`. |
| **IMP-07** | Khóa Dòng Chống Race Condition | Concurrency Control| Câu lệnh `SELECT ... FOR UPDATE` trên dòng `staging.import_jobs` | **`STATIC PASS`** | `RUNTIME PENDING` | 2 Admin gọi rollback đồng thời -> Một transaction chờ, không gây xung đột dữ liệu. |
| **IMP-08** | Cấp Mã Lô Tự Động Khi Thiếu Số Lô | Data Cleansing | Tạo mã dạng `'UNKNOWN-' || job_id || '-' || row_number` | **`STATIC PASS`** | `RUNTIME PENDING` | File Excel trống cột số lô -> Tồn kho tạo thành công với mã nội bộ quy chuẩn. |
| **IMP-09** | Xử Lý Hàng Thiếu HSD Khi Nhập (D-15) | Data Cleansing | Lưu `expiry_date = NULL`, `expiry_status = 'unknown'`, cách ly | **`STATIC PASS`** | `RUNTIME PENDING` | Nhập tệp thiếu ngày hết hạn -> Lô hàng tự động nhận trạng thái `quarantined`. |
| **IMP-10** | Dry-Run Báo Cáo Lỗi Dòng Cụ Thể | Staging Validation | Ghi vết lỗi vào cột `error_details` của bảng staging | **`STATIC PASS`** | `RUNTIME PENDING` | Dòng 15 có định dạng SĐT sai -> Dry-run báo lỗi chính xác dòng 15, các dòng khác hợp lệ. |
| **IMP-11** … **IMP-32** | Các kịch bản kiểm tra tệp Excel: Trùng SĐT trong file, tệp hỏng cấu trúc, số lượng lớn >5.000 dòng, rollback phân đoạn, v.v. | Import Suite | Chi tiết đầy đủ trong Section XII.2 của tài liệu kiến trúc v1.6.9 | **`STATIC PASS`** | `RUNTIME PENDING` | Thực thi toàn bộ trên worker sandbox, cam kết đạt 100% tỷ lệ pass. |

---

## 4. Kịch Bản & Đoạn Mã Kiểm Thử Mẫu Cho Các Ca Trọng Điểm (Test Fixtures)

### 4.1. Mã Kiểm Thử Mẫu: Two-Man Rule (`IMP-01` / `SEC-42`)
```typescript
// test/suites/02_import_staging/two_man_rule.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { createAdminSession, createTestImportJob } from '../../harness/db_client';

describe('IMP-01 / Two-Man Rule Enforcement', () => {
  let adminAlice: any;
  let adminBob: any;
  let jobId: string;

  beforeAll(async () => {
    adminAlice = await createAdminSession('alice@leson.vn');
    adminBob = await createAdminSession('bob@leson.vn');
    // Admin Alice tải tệp lên và hoàn thành dry-run
    jobId = await createTestImportJob(adminAlice.user.id, 'awaiting_approval');
  });

  it('BẮT BUỘC THẤT BẠI: Người tạo job (Alice) tự phê duyệt job của chính mình', async () => {
    const { data, error } = await adminAlice.rpc('rpc_import_approve_job', {
      p_job_id: jobId
    });

    expect(error).toBeDefined();
    expect(error?.message).toContain('TWO_MAN_RULE_VIOLATION');
    expect(data).toBeNull();
  });

  it('BẮT BUỘC THÀNH CÔNG: Admin độc lập (Bob) có ca trực active phê duyệt job', async () => {
    const { data, error } = await adminBob.rpc('rpc_import_approve_job', {
      p_job_id: jobId
    });

    expect(error).toBeNull();
    expect(data).toBe(true);
  });
});
```

### 4.2. Mã Kiểm Thử Mẫu: BYOD Device Trust & Remote Wipe (`SEC-18`, `SEC-19`, `SEC-20`)
```typescript
// test/suites/01_security_rbac/byod_lifecycle.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { createStaffSession, createAdminSession } from '../../harness/db_client';

describe('SEC-18..20 / BYOD Device Trust Lifecycle', () => {
  let staffSession: any;
  let adminSession: any;
  let deviceId: string;

  beforeAll(async () => {
    staffSession = await createStaffSession('doctor_lan@leson.vn');
    adminSession = await createAdminSession('admin@leson.vn');
  });

  it('SEC-18: Thiết bị mới đăng ký mặc định is_trusted = FALSE, cấm upload', async () => {
    // Đăng ký thiết bị mới
    const { data: regData } = await staffSession.rpc('rpc_register_staff_device', {
      p_device_fingerprint: 'fp_iphone15_pro_uuid',
      p_device_name: 'iPhone 15 Pro - Dr. Lan'
    });
    deviceId = regData.device_id;

    // Cố gắng gọi upload media
    const uploadRes = await staffSession.uploadMedia(deviceId, 'mock_photo.jpg');
    expect(uploadRes.status).toBe(403);
    expect(uploadRes.error).toContain('DEVICE_NOT_TRUSTED');
  });

  it('SEC-19: Admin duyệt thiết bị -> Cho phép upload', async () => {
    await adminSession.rpc('rpc_approve_staff_device', { p_device_id: deviceId });
    const uploadRes = await staffSession.uploadMedia(deviceId, 'mock_photo.jpg');
    expect(uploadRes.status).toBe(200);
  });

  it('SEC-20: Admin thu hồi thiết bị -> Trả về 403 DEVICE_REVOKED và vô hiệu hóa token', async () => {
    await adminSession.rpc('rpc_revoke_staff_device', { p_device_id: deviceId });
    const uploadRes = await staffSession.uploadMedia(deviceId, 'mock_photo_2.jpg');
    expect(uploadRes.status).toBe(403);
    expect(uploadRes.error).toContain('DEVICE_REVOKED');
  });
});
```

### 4.3. Mã Kiểm Thử Mẫu: Bảo Vệ Dòng Hóa Đơn Tự Do Fail-Safe (`SEC-15`, `SEC-16`)
```typescript
// test/suites/01_security_rbac/invoice_privacy.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { createCashierSession, createCustomerSession } from '../../harness/db_client';

describe('SEC-15..16 / Free-Text Invoice Privacy Fail-Safe', () => {
  let cashierSession: any;
  let customerSession: any;
  let invoiceId: string;
  let freeTextItemId: string;

  beforeAll(async () => {
    cashierSession = await createCashierSession('cashier@leson.vn');
    customerSession = await createCustomerSession('customer@gmail.com');
    invoiceId = await cashierSession.createInvoice(customerSession.user.id);
  });

  it('SEC-15: Dòng tự do không có mã product/service bắt buộc mặc định is_clinical_hidden = TRUE', async () => {
    const { data: item } = await cashierSession.rpc('rpc_add_invoice_item', {
      p_invoice_id: invoiceId,
      p_item_name: 'Thuốc kháng sinh đặc trị nội bộ (dòng tự do)',
      p_quantity: 1,
      p_unit_price: 150000,
      p_product_id: null,
      p_service_id: null
    });

    freeTextItemId = item.id;
    expect(item.is_clinical_hidden).toBe(true);
  });

  it('SEC-16: Chặn đứng lệnh UPDATE sửa is_clinical_hidden = FALSE trên dòng tự do', async () => {
    const { error } = await cashierSession
      .from('invoice_items')
      .update({ is_clinical_hidden: false })
      .eq('id', freeTextItemId);

    expect(error).toBeDefined();
    expect(error?.message).toContain('CANNOT_UNHIDE_FREE_TEXT_ITEM');
  });
});
```

---

## 5. Tiêu Chuẩn Báo Cáo Nghiệm Thu Hoàn Thành Phase 4B

Để Phase 4B được coi là nghiệm thu đạt yêu cầu và đủ điều kiện chuyển sang giai đoạn chuẩn bị Production Staging, Báo cáo Nghiệm thu Runtime phải cung cấp đầy đủ các bằng chứng sau:

1. **Bảng Tổng Hợp Kiểm Thử 100% Xanh (Full Green Suite):**
   - 60 bài test Bảo mật: **`60 / 60 RUNTIME PASS`** (0 fail, 0 skipped).
   - 32 bài test Nhập liệu: **`32 / 32 RUNTIME PASS`** (0 fail, 0 skipped).
2. **Log Thực Thi Terminal Chi Tiết:**
   - Đính kèm tệp log đầu ra nguyên bản từ Vitest / pgTAP runner ghi nhận: thời gian chạy, số lượng assertions, và mã băm Git commit thực thi.
3. **Báo Cáo Đo Đạc Tải & Tài Nguyên:**
   - Xác nhận cơ chế connection pooling của Supabase xử lý ổn định 50 kết nối đồng thời mà không nghẽn.
   - Xác nhận kích thước schema sau khi nạp seed data mẫu hoàn toàn nằm trong giới hạn kiểm soát.
4. **Cam Kết Chi Phí Nghiệm Thu:**
   - Xác nhận toàn bộ quá trình phát triển và kiểm thử Phase 4B được thực hiện trên môi trường sandbox nội bộ với tổng chi phí **\$0.00**.
