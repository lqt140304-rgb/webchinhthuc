# BÁO CÁO NGHIỆM THU TỔNG THỂ PHASE 4B — CỔNG 9 (ACCEPTANCE GATE 9)
## BỘ TEST TỰ ĐỘNG TOÀN DIỆN, MA TRẬN 92 KỊCH BẢN, ĐỒNG BỘ 40 BẢNG & BẢN XEM THỬ FRONTEND

**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Nhánh thực hiện:** `feat/phase-4b-supabase-foundation`  
**Căn cứ pháp lý & kỹ thuật:**
- Chỉ đạo điều phối chấp thuận có điều kiện Gate 8 và giao việc Gate 9 của Ban Quản Trị
- Kế hoạch triển khai Phase 4B ([`PHASE4B_IMPLEMENTATION_PLAN.md`](file:///d:/webbvct/docs/architecture/PHASE4B_IMPLEMENTATION_PLAN.md) Mục 9 - Final Acceptance Gate)
- Thiết kế kiến trúc Phase 4A v1.6.9 Baseline (Mục XII - 92 Kịch bản kiểm thử SEC & IMP)  
**Trạng thái Cổng 9 (Gate 9):** **`10/10 RUNTIME PASS (100%)`**  
**Tổng kiểm thử hồi quy luỹ kế toàn hệ thống (Gates 1–9):** **`85/85 RUNTIME PASS | 0 FAIL | 0 SKIP`**  
**Độ phủ ma trận 92 kịch bản:** **`92 / 92 (100% TRACEABLE & ENFORCED)`**  
**Chi phí thực thi:** **$0.00** *(Local Docker Sandbox, không deploy Cloud, không merge main)*  
**Ngày thực hiện:** 08/11/2026  

---

## PHẦN I: KHẮC PHỤC CÁC YÊU CẦU ƯU TIÊN (P1 & P2 REMEDIATIONS)

### 1. P1 — Xóa Tệp Vật Lý Khỏi Storage Sau 60 Ngày (Physical Storage Media Purge)
- **Cơ chế thực thi:** Hệ thống không chỉ cập nhật cờ logic CSDL mà triển khai tiến trình Worker [`scripts/purge_expired_media_worker.cjs`](file:///d:/webbvct/scripts/purge_expired_media_worker.cjs) quét các media có `auto_delete_at <= CLOCK_TIMESTAMP()`.
- **Bằng chứng kiểm chứng:**
  * Tệp vật lý được tạo thực tế trên đĩa tại `storage_sandbox/inpatient-media/inpatient/gate9/physical_purge_test.jpg`.
  * Sau khi worker chạy: `fs.existsSync(file) === false` (xác nhận tệp đã biến mất hoàn toàn khỏi ổ đĩa).
  * CSDL cập nhật `physical_deleted_at = CLOCK_TIMESTAMP()`, `is_purged = TRUE`.
  * Audit log ghi nhận hành vi `DELETE` với sự kiện `PHYSICAL_STORAGE_OBJECT_DELETED`.
- **Xử lý lỗi xóa & Cơ chế thử lại (Retry & Error Handling):**
  * Mô phỏng lỗi khóa tệp/phân quyền I/O (`EACCES: permission denied`).
  * Worker ghi nhận tăng bộ đếm `purge_retry_count = 1`, lưu nguyên nhân lỗi vào `last_purge_error`, và ghi nhận log kiểm toán cảnh báo `PHYSICAL_STORAGE_DELETE_FAILED` (`SECURITY_VIOLATION`).

### 2. P1 — Thu Hồi Thiết Bị BYOD & Ranh Giới Giới Hạn PWA (Device Revocation)
- **Cơ chế thu hồi đa tầng:**
  * Admin có ca trực và AAL2 thu hồi phiên qua `app.rpc_revoke_staff_device`. CSDL lập tức gán `is_trusted = FALSE`, `is_revoked = TRUE`, `wipe_requested = TRUE`.
  * Bất kỳ yêu cầu xác thực thiết bị hoặc tải lên media nào với token/fingerprint bị thu hồi đều bị chặn cứng với HTTP 403 `DEVICE_REVOKED`.
  * Mô phỏng client PWA nhận mã lỗi, dọn sạch bộ nhớ IndexedDB/CacheStorage và gọi `app.rpc_confirm_device_wipe` ghi vết `wipe_completed_at`.
- **Tuyên bố minh bạch về giới hạn kỹ thuật PWA:**
  * **Ranh giới sandbox trình duyệt:** Client PWA chạy trên Web Browser/Service Worker **hoàn toàn không thể can thiệp hoặc xóa ảnh/video đã nằm trong Camera Roll gốc của hệ điều hành iOS/Android**.
  * **Biện pháp bù đắp quản trị:** Áp dụng luồng ưu tiên Tầng 1 (`getUserMedia()` trực tiếp vào RAM, không gọi Camera App của máy) kết hợp quy chế ký cam kết bảo mật thông tin nhân sự theo Nghị định 13/2023/NĐ-CP (PDPD).

### 3. P2 — Signed URL Thực Tế, Chuyển Chủ Thú Cưng & Thu Hồi Bản Tin
- **Thời hạn sống 900 giây:** URL tải media ký số HMAC-SHA256 chỉ có hiệu lực đúng 15 phút. Thử nghiệm xác thực với mốc thời gian quá 15 phút bị từ chối với `SIGNED_URL_EXPIRED`.
- **Thu hồi bản tin y khoa:** Khi bác sĩ chuyển trạng thái bản tin từ `published` về `draft` hoặc `revoked`, quyền tạo Signed URL của khách hàng lập tức bị hủy (`UNAUTHORIZED_MEDIA_ACCESS`).
- **Chuyển giao quyền sở hữu thú cưng:** Khi thú cưng đổi chủ (`pets.customer_id = customer_B`), chủ cũ (khách hàng A) lập tức mất toàn bộ quyền truy cập hình ảnh điều trị lưu viện trước đó (`UNAUTHORIZED_MEDIA_ACCESS`).

### 4. P2 — Khả Năng Chống Chịu Dữ Liệu (Pipeline Resilience)
- **Kiểm tra Magic Bytes:** Worker kiểm tra 4 bytes đầu của payload. Tệp giả mạo hoặc hư hỏng (corrupted payload) bị từ chối ngay lập tức, ngăn ngừa lỗi sập (crash) hoặc tràn bộ nhớ trong tiến trình FFmpeg / Sharp.

---

## PHẦN II: KẾT QUẢ KIỂM THỬ RUNTIME CỔNG 9 (10 / 10 PASS)

| Test ID | Nội Dung Kiểm Thử | Mục Tiêu & Cơ Chế Kỹ Thuật | Trạng Thái |
|:---:|---|---|:---:|
| **GATE9-T9.1** | **P1 — Physical Media Purge** | Tệp media trên ổ đĩa bị xóa thực tế; `physical_deleted_at` đóng dấu; ghi log `PHYSICAL_STORAGE_OBJECT_DELETED`. | **`RUNTIME PASS`** |
| **GATE9-T9.2** | **P1 — Purge Error & Retry** | Mô phỏng lỗi khóa I/O; tăng `purge_retry_count = 1`, lưu `last_purge_error`, ghi log `SECURITY_VIOLATION`. | **`RUNTIME PASS`** |
| **GATE9-T9.3** | **P1 — BYOD Revoke Guard** | Thu hồi thiết bị chặn tức thì RPC & Storage Upload với `DEVICE_REVOKED` (403); kích hoạt `wipe_requested`. | **`RUNTIME PASS`** |
| **GATE9-T9.4** | **P2 — Signed URL & Bulletin Revoke** | URL có thời hạn 900s; chuyển bản tin về `draft` lập tức chặn truy cập của khách hàng (`UNAUTHORIZED_MEDIA_ACCESS`). | **`RUNTIME PASS`** |
| **GATE9-T9.5** | **P2 — Pet Ownership Transfer** | Đổi chủ sở hữu thú cưng lập tức tước quyền xem media của chủ cũ theo chuẩn bảo mật y khoa D-12. | **`RUNTIME PASS`** |
| **GATE9-T9.6** | **P2 — Corrupted Media Payload** | Kiểm tra Magic Bytes loại bỏ tệp hỏng/giả mạo trước khi vào pipeline xử lý media. | **`RUNTIME PASS`** |
| **GATE9-T9.7** | **Inventory 40 Bảng Đồng Bộ** | Xác nhận đúng 40 bảng (35 app, 1 audit, 4 staging); 100% bảng kích hoạt RLS. | **`RUNTIME PASS`** |
| **GATE9-T9.8** | **P1-C Invariant (0 CASCADE)** | Xác nhận 0 ràng buộc `CASCADE` trên toàn bộ thực thể lâm sàng, khách hàng và hóa đơn. | **`RUNTIME PASS`** |
| **GATE9-T9.9** | **S-11 Fail-Closed Guard** | Kiểm tra `app.system_settings`: `allow_admin_off_shift_override = false` mặc định fail-closed an toàn. | **`RUNTIME PASS`** |
| **GATE9-T9.10**| **Full Cumulative Regression** | Chạy liên hoàn toàn bộ test suites Gates 1 đến 9 $\rightarrow$ 85 / 85 ca kiểm thử thực thi đạt 100%. | **`RUNTIME PASS`** |

---

## PHẦN III: BẢNG TỔNG HỢP KIỂM THỬ HỒI QUY TOÀN HỆ THỐNG (GATES 1–9)

```
==================================================================================================
PHASE 4B COMPLETE REGRESSION RUNTIME MATRIX (GATES 1 TO 9)
==================================================================================================
Suite 01: Kiến trúc 4 Schemas & Cô lập quyền truy cập (Isolation)      5 / 5   PASS (100%)
Suite 02: Khởi tạo 40 Bảng DDL & Bất biến quan hệ (P1-C, P1-E)        10 / 10  PASS (100%)
Suite 03: Phân quyền RBAC, Bảo vệ RLS 40/40 Bảng & Audit Log          10 / 10  PASS (100%)
Suite 04: Vòng đời Khách hàng, Thú cưng & Đặt lịch khám (Booking)     10 / 10  PASS (100%)
Suite 05: Bệnh án Lâm sàng, Điều trị Nội trú & Bản tin Y khoa         10 / 10  PASS (100%)
Suite 06: Bán hàng, Hóa đơn (Khớp tiền/Ẩn thuốc) & Quản trị Tồn kho   10 / 10  PASS (100%)
Suite 07: Trung Tâm Nhập Liệu Excel, Two-Man Rule & Safe Rollback      10 / 10  PASS (100%)
Suite 08: Thiết Bị BYOD 5 Tầng, Signed URL 15m & Purge Media 60 Ngày  10 / 10  PASS (100%)
Suite 09: Khắc Phục P1/P2, 92 Scenarios, Xóa Vật Lý & Sync 40 Bảng    10 / 10  PASS (100%)
==================================================================================================
TỔNG CỘNG LUỸ KẾ TOÀN BỘ HỆ THỐNG:                                    85 / 85  PASS (100%)
TỔNG SỐ CA THẤT BẠI (FAIL):                                                 0
TỔNG SỐ CA BỎ QUA (SKIP):                                                   0
==============================================================================
```

---

## PHẦN IV: ĐỐI CHIẾU & ÁNH XẠ MA TRẬN 92 KỊCH BẢN (TRACEABILITY)

Hệ thống đã lập tài liệu đối chiếu chi tiết tại [`docs/qa/PHASE4B_92_SCENARIOS_TRACEABILITY_MATRIX.md`](file:///d:/webbvct/docs/qa/PHASE4B_92_SCENARIOS_TRACEABILITY_MATRIX.md):
- **Phân hệ SEC (Bảo mật & Y khoa):** 60 / 60 kịch bản (`SEC-01` đến `SEC-60`) được ánh xạ trực tiếp tới các bài test runtime thuộc Suites 01–09, các trigger kiểm toán, RLS policies và RPC guards.
- **Phân hệ IMP (Xử lý & Nhập liệu Excel):** 32 / 32 kịch bản (`IMP-01` đến `IMP-32`) được ánh xạ đầy đủ tới Suite 07 (Two-Man Rule, Staging, Pessimistic Locking, Safe Rollback), Suite 06 (Khóa cách ly hàng thiếu HSD) và kiến trúc cô lập Sandbox Worker.
- **Kết luận:** **Không có bất kỳ kịch bản nào trong số 92 ca thiết kế bị bỏ sót**.

---

## PHẦN V: KIỂM ĐẾM & ĐỒNG BỘ 40 BẢNG CSDL HỆ THỐNG

Sau khi bổ sung bảng cấu hình kiểm soát ca trực `app.system_settings`, toàn bộ hệ thống CSDL chính thức bao gồm đúng **40 bảng**:

| Schema | Số Lượng Bảng | Danh Mục Bảng Thực Tế |
|:---|:---:|---|
| **`app`** | **35** | `users`, `staff_role_assignments`, `cage_zones`, `cages`, `shifts`, `shift_assignments`, `staff_device_sessions`, `customers`, `pets`, `customer_user_links`, `user_link_requests`, `guest_booking_requests`, `appointments`, `medical_appointments`, `clinical_records`, `clinical_diagnoses`, `clinical_record_vitals`, `treatment_orders`, `prescriptions`, `clinical_amendments`, `inpatient_stays`, `inpatient_daily_logs`, `inpatient_daily_media`, `pet_medical_bulletins`, `bulletin_approval_history`, `pet_medical_consents`, `products`, `services`, `inventory_batches`, `inventory_transactions`, `invoices`, `invoice_items`, `invoice_payments`, `historical_loyalty_points`, `system_settings` |
| **`audit`** | **1** | `audit_logs` (Nhật ký bất biến lưu trữ thay đổi và vi phạm an ninh) |
| **`staging`** | **4** | `import_jobs`, `import_mappings`, `import_rows`, `import_errors` |
| **TỔNG CỘNG** | **40** | **100% (40 / 40) BẢNG ĐÃ BẬT ROW LEVEL SECURITY (RLS)** |

---

## PHẦN VI: BÁO CÁO HIỆN TRẠNG PREVIEW FRONTEND & ĐỀ XUẤT TÍCH HỢP

### 1. Hiện Trạng Bản Xem Thử Localhost (`http://127.0.0.1:5173/`)
- **Máy chủ:** Vite dev server đang chạy nền liên tục tại cổng 5173 trên localhost.
- **Phân định rõ ràng giữa Mock và Backend:**
  * **Trang chủ & Các trang công khai (`/`, `/ve-chung-toi`, `/doi-ngu-bac-si`, `/co-so-vat-chat`):** 100% hiển thị giao diện chuẩn nhận diện thương hiệu Vibrant Editorial Luxury, responsive đầy đủ.
  * **Biểu mẫu Đặt lịch (`/dat-lich`):** Đang vận hành ở chế độ **Client-Side Mock Simulation** với Zod validation. Trình duyệt mô phỏng gửi dữ liệu thành công sau 400ms và hiển thị thông báo demo. **Chưa gọi RPC CSDL backend**.
  * **Phân hệ Portal (`/tai-khoan/*` và `/quan-ly/*`):** Chưa triển khai giao diện theo đúng Lộ trình Kiến trúc Baseline V1 (thuộc phạm vi Giai đoạn 4).

### 2. Đề Xuất Kế Hoạch Tích Hợp Frontend/Backend Sau Gate 9
Theo đúng phân kỳ đã được Chủ dự án duyệt trong `AGENTS.md`:
1. **Sau khi nghiệm thu xong toàn bộ Phase 4B:** Tiến hành bàn giao hồ sơ kiến trúc backend hoàn chỉnh.
2. **Giai đoạn tiếp theo (Giai đoạn 3):** Hoàn thiện nội dung các trang chuyên sâu công khai (Public Pages Phase 3).
3. **Giai đoạn 4 (Frontend Integration & Portals):**
   - Bước 4.1: Tích hợp trực tiếp form đặt lịch công khai `/dat-lich` với RPC `app.rpc_guest_create_booking` qua Cloudflare Turnstile token.
   - Bước 4.2: Xây dựng Customer Portal (`/tai-khoan/*`) kết nối với các Views an toàn (`customer_pets_view`, `customer_bulletins_view`, Signed URLs 15m).
   - Bước 4.3: Xây dựng Staff & Management Portal (`/quan-ly/*`) kết nối RPCs nghiệp vụ y tế, kê đơn, quản trị kho và trung tâm nhập liệu Excel.

---

## PHẦN VII: DANH SÁCH CÁC QUYẾT ĐỊNH DUY TRÌ TRẠNG THÁI PENDING

Tuân thủ nghiêm ngặt quy chế phân vai và chỉ đạo của Ban Điều Phối:
1. **S-11 Admin Off-shift Override:** Duy trì trạng thái **`PENDING OWNER APPROVAL`**. CSDL duy trì cơ chế Fail-Closed an toàn tuyệt đối thông qua bảng `app.system_settings`.
2. **D-03 Chiến Lược Backup / PITR:** Duy trì trạng thái **`PENDING OWNER APPROVAL`** (chỉ đề xuất Daily Backup $0, hoãn PITR trả phí).
3. **D-18 Chuẩn Hóa Địa Chỉ Hành Chính:** Duy trì trạng thái **`PENDING OWNER APPROVAL`**.
4. **POL-BOOKING DUAL (Chống Spam SĐT vs UUID):** Duy trì trạng thái **`PENDING OWNER APPROVAL`**.

---

## PHẦN VIII: DANH MỤC LỖI & VẤN ĐỀ CÒN MỞ (OPEN DEFECT REGISTER)

- **Lỗi P0 (Nghiêm trọng / Blockers):** **0**
- **Lỗi P1 (Ưu tiên cao):** **0** *(Đã khắc phục xong việc xóa file vật lý khỏi Storage và thu hồi thiết bị BYOD trong Gate 9)*
- **Lỗi P2 (Trung bình / Kiến nghị):** **0** *(Đã bổ sung kiểm tra Magic Bytes, Signed URL 900s và chuyển chủ thú cưng)*
- **Vấn đề mở duy nhất:** Chờ Chủ dự án xem xét ban hành 4 quyết định vận hành đang `PENDING` trước khi đưa hệ thống lên môi trường Production.

---

## PHẦN IX: THÔNG TIN GIT & BÀN GIAO KỸ THUẬT

- **Branch:** `feat/phase-4b-supabase-foundation`
- **Files thay đổi & bổ sung trong Gate 9:**
  - [`supabase/migrations/20261106000021_stage9_physical_purge_and_40_tables_sync.sql`](file:///d:/webbvct/supabase/migrations/20261106000021_stage9_physical_purge_and_40_tables_sync.sql)
  - [`scripts/purge_expired_media_worker.cjs`](file:///d:/webbvct/scripts/purge_expired_media_worker.cjs)
  - [`scripts/verify_clean_db_seed.cjs`](file:///d:/webbvct/scripts/verify_clean_db_seed.cjs)
  - [`test/runtime/09_final_acceptance_92_scenarios.test.cjs`](file:///d:/webbvct/test/runtime/09_final_acceptance_92_scenarios.test.cjs)
  - [`docs/qa/PHASE4B_92_SCENARIOS_TRACEABILITY_MATRIX.md`](file:///d:/webbvct/docs/qa/PHASE4B_92_SCENARIOS_TRACEABILITY_MATRIX.md)
  - [`docs/qa/PHASE4B_STAGE9_GATE9_REPORT.md`](file:///d:/webbvct/docs/qa/PHASE4B_STAGE9_GATE9_REPORT.md)
- **Chi phí phát sinh:** **$0.00**.
