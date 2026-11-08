# DANH MỤC GỐC 92 KỊCH BẢN KIỂM THỬ PHASE 4A v1.6.9 (CANONICAL CATALOG)
## BỆNH VIỆN THÚ Y LÊ SƠN — KIẾN TRÚC VẬN HÀNH & BẢO MẬT DỮ LIỆU CSDL

> **Nguồn chuẩn:** Kiến trúc Phase 4A v1.6.9 Baseline (Mục XII: 60 SEC + 32 IMP)  
> **Repository:** `lqt140304-rgb/webchinhthuc`  
> **Trạng thái:** Nguồn đối chiếu chuẩn mực duy nhất cho kiểm toán Phase 4B & QA Independent Reviews.

---

### PHẦN I: DANH MỤC 60 KỊCH BẢN BẢO MẬT & VẬN HÀNH Y KHOA (SEC-01 ĐẾN SEC-60)

| Mã | Tên kịch bản | Phân hệ / Tiêu chuẩn | Kỳ vọng kiến trúc & Ngưỡng an ninh |
|:---|:---|:---|:---|
| **SEC-01** | PostgREST Schema Isolation | Database Hardening | API Gateway chỉ phơi bày schema `public`; các schema `app`, `staging`, `audit` trả về 404 Not Found. |
| **SEC-02** | Direct Function Execution Denial | Privileges & Roles | Quyền EXECUTE các hàm trong `app.*` bị thu hồi khỏi `anon` và `PUBLIC`; chỉ gọi qua wrapper RPC public được cấp phép. |
| **SEC-03** | Customer Pets Data Isolation | Multi-Tenant RLS | Khách hàng A chỉ xem được thú cưng do chính mình sở hữu qua `customer_id = app.get_customer_id_for_user()`. |
| **SEC-04** | Clinical Invoice Item Hiding | Medical Privacy (D-12) | Khách hàng tra cứu hóa đơn không bao giờ nhìn thấy thuốc kê đơn, liều lượng, y lệnh nội bộ (`is_clinical_hidden = TRUE`). |
| **SEC-05** | Shift Roster Enforcement | Clinical Governance | Bác sĩ chỉ được phép kê đơn, tạo bệnh án khi đang trong ca trực hoạt động (`app.check_active_shift`). |
| **SEC-06** | Shift Handover Validation | Clinical Governance | Điều dưỡng bàn giao ca trực khi còn y lệnh nội trú `pending` bắt buộc bị cảnh báo/chặn. |
| **SEC-07** | Admin Off-Shift Override Fail-Closed | Governance (S-11) | Mặc định cơ chế can thiệp ngoài ca của Quản trị viên ở trạng thái FAIL-CLOSED (`false`, PENDING CHỦ DỰ ÁN DUYỆT). |
| **SEC-08** | Admin On-Shift Normal Audit | Audit Logging | Quản trị viên thao tác trong ca trực chuẩn mực không bị gán nhãn vi phạm an ninh ngoài ca. |
| **SEC-09** | Medical Record Immutability | Medical Safety (P1-C) | Bệnh án đã tạo là bất biến vĩnh viễn; cấm tuyệt đối mọi thao tác `DELETE` và `TRUNCATE`. |
| **SEC-10** | Inpatient Media Multi-Tenant Isolation | Storage Privacy | Khách hàng chỉ truy cập được hình ảnh lưu viện của thú cưng mình; cấm truy cập chéo thú cưng khác. |
| **SEC-11** | Unpublished Bulletin Media Denial | Storage Privacy | Hình ảnh bản tin chưa được Bác sĩ duyệt (`draft`/`pending`) không cấp Presigned URL cho khách hàng. |
| **SEC-12** | Receptionist Clinical Reveal Denial | Privacy Enforcement | Tiếp tân/Thu ngân không thể mở cờ hiển thị thuốc lâm sàng (`is_clinical_hidden`) trên hóa đơn. |
| **SEC-13** | Strict Clinical Guard Enforcement | Privacy Enforcement | Toàn bộ nhân viên, kể cả Bác sĩ/Admin, bị chặn gỡ cờ ẩn đối với thuốc kê đơn và dòng tự do lâm sàng. |
| **SEC-14** | Invoice Customer Re-assignment Guard | Financial Integrity | Gán khách hàng vào hóa đơn vãng lai phải đồng bộ số liệu tổng, cập nhật audit và khóa hóa đơn. |
| **SEC-15** | Public Booking Rate Limiting | Anti-Abuse (D-02) | Biểu mẫu đặt lịch công khai giới hạn tối đa 3 yêu cầu/24h trên một số điện thoại; chặn lượt thứ 4. |
| **SEC-16** | Booking Idempotency Protection | Idempotency | Ngăn ngừa việc gửi trùng lặp (double click) thông qua Unique Partial Index trên `idempotency_key`. |
| **SEC-17** | Lazy Customer Profile on OAuth Signup | Identity Policy (D-19) | Người dùng đăng ký qua OAuth Google/Apple chỉ tạo tài khoản Auth, không tự động sinh hồ sơ CRM rác. |
| **SEC-18** | Anti-Enumeration Timing Protection | Auth Security | Kiểm tra số điện thoại tồn tại trả về thông điệp trung tính và độ trễ đồng nhất (300-500ms). |
| **SEC-19** | OTP Abuse Lockout Protection | Anti-Brute Force | Nhập sai OTP 5 lần liên tiếp kích hoạt khóa gửi OTP tạm thời trong 60 phút. |
| **SEC-20** | BYOD PWA Device Trust & Remote Wipe | Mobile Security (D-20) | Thu hồi thiết bị nhân viên vô hiệu hóa phiên tức thì; PWA xóa cache cục bộ; ranh giới Camera Roll thuộc OS Sandbox. |
| **SEC-21** | Recycled Phone Non-Admin Resolution Denial | Identity Security | Khách hàng và tiếp tân không được phép tự ý giải quyết tranh chấp SĐT tái chế; bắt buộc Admin xử lý. |
| **SEC-22** | Recycled Phone Resolution MFA AAL2 | Privileged Operations | Thao tác giải quyết SĐT tái chế bắt buộc phiên đăng nhập của Admin đạt cấp độ xác thực đa yếu tố AAL2. |
| **SEC-23** | Recycled Phone Identical ID Denial | Identity Invariants | Chặn việc giải quyết SĐT khi ID khách hàng cũ trùng với ID khách hàng mới. |
| **SEC-24** | Recycled Phone Unlinked User Denial | Identity Invariants | Chặn việc giải quyết SĐT cho user không có liên kết chờ duyệt (`pending`) trong hệ thống. |
| **SEC-25** | Phone Reuse Registration Isolation | Data Architecture (P1-E)| Hai khách hàng dùng chung số điện thoại duy trì hai hồ sơ CRM độc lập hoàn toàn. |
| **SEC-26** | Multi-Customer Same Phone Invariant | Data Architecture (P1-E)| Không đặt ràng buộc duy nhất (UNIQUE) trên cột số điện thoại của bảng `app.customers`. |
| **SEC-27** | Front-Desk Ambiguous Phone Search | Front-Desk Workflow | Tiếp tân tìm kiếm theo số điện thoại có nhiều hồ sơ được trả về danh sách phân biệt rõ ràng. |
| **SEC-28** | PDPD Personal Data Export (JSON) | Compliance (NĐ 13/2023)| Khách hàng yêu cầu trích xuất dữ liệu cá nhân được xuất file định dạng JSON chuẩn mực. |
| **SEC-29** | PDPD Right to Erasure Medical Retention | Compliance (NĐ 13/2023)| Yêu cầu xóa dữ liệu cá nhân chỉ ẩn danh hóa PII, bảo lưu 100% hồ sơ bệnh án theo Luật Khám chữa bệnh. |
| **SEC-30** | Public Booking Guest Request Storage | Booking Pipeline | Đặt lịch từ khách vãng lai được lưu trữ an toàn tại `app.guest_booking_requests` chờ tiếp tân tiếp nhận. |
| **SEC-31** | Inpatient Order Nursing Checkoff | Clinical Audit | Điều dưỡng thực hiện y lệnh nội trú được ghi nhận định danh và timestamp thực tế vào nhật ký. |
| **SEC-32** | Vital Signs Physiologic Alert | Clinical Safety | Ghi nhận thân nhiệt thú cưng vượt ngưỡng sinh lý (> 40.5°C) tự động kích hoạt cờ cảnh báo lâm sàng. |
| **SEC-33** | Prescription Dispensing Verification | Pharmacy Governance | Thuốc kê đơn chỉ được xuất kho khi đơn thuốc ở trạng thái đã ký duyệt (`signed`). |
| **SEC-34** | Anonymous Clinical Inspection Block | Zero-Trust Defense | Khách vãng lai (`anon`) truy vấn trực tiếp bảng bệnh án bị chặn đứng bởi PostgREST và RLS. |
| **SEC-35** | Public Services Directory View | Public Catalog | Danh mục dịch vụ khám và giá tham chiếu được phục vụ qua view công khai với `security_invoker = true`. |
| **SEC-36** | Anonymous Table Write Block | Schema Integrity | Quyền INSERT/UPDATE/DELETE trên mọi bảng nội bộ bị từ chối triệt để đối với vai trò `anon`. |
| **SEC-37** | JWT Token Expiration Enforcement | Session Security | Phiên làm việc hết hạn token không thể tiếp tục thực thi các hàm RPC nghiệp vụ. |
| **SEC-38** | Revoked BYOD Storage Upload Denial | Storage Policy | Thiết bị đã bị thu hồi (`revoked`) cố tình gửi request upload trực tiếp lên Storage bị chặn đứng. |
| **SEC-39** | Storage Bucket Private Configuration | Storage Hardening | Bucket `inpatient-media-private` cấu hình riêng tư hoàn toàn, cấm truy cập trực tiếp không có token. |
| **SEC-40** | Worker Sandbox Outbound Network Isolation | Infrastructure Defense | Tiến trình import worker chạy trong môi trường mạng cách ly (`internal: true`), chặn mọi kết nối ra ngoài. |
| **SEC-41** | Recycled Phone Audit Log Verification | Audit Logging | Quá trình giải quyết SĐT tái chế ghi nhận đầy đủ lịch sử thay đổi vào `audit.audit_logs`. |
| **SEC-42** | Recycled Phone Customer De-linking | Identity Governance | User cũ bị gỡ bỏ liên kết ngay khi Admin chấp thuận chuyển giao số điện thoại cho chủ mới. |
| **SEC-43** | Clinical Record Amendment Immutability | Medical Safety | Bản tu chính bệnh án (Addendum) đã tạo không thể bị xóa hoặc sửa đổi nội dung. |
| **SEC-44** | Treatment Order Medical Authorization | Clinical Governance | Y lệnh điều trị chỉ có thể được ban hành bởi Bác sĩ điều trị phụ trách ca bệnh. |
| **SEC-45** | Front-Desk Service Price Tampering Block | Financial Integrity | Tiếp tân tạo hóa đơn dịch vụ không thể tự ý sửa đổi đơn giá dịch vụ niêm yết. |
| **SEC-46** | Inventory Stock Underflow Prevention | Inventory Safety | Xuất kho thuốc vượt quá số lượng tồn khả dụng bị chặn đứng bởi Check Constraint `quantity >= 0`. |
| **SEC-47** | Expired Batch Dispensing Block | Pharmacy Safety | Xuất kho lô thuốc đã quá hạn sử dụng (`expiry_date < CURRENT_DATE`) bị chặn tự động. |
| **SEC-48** | Unverified Batch Quarantine Isolation | Inventory Safety (D-15) | Lô hàng nhập khẩu chưa rõ hạn dùng được cách ly tự động với tiền tố mã `'UNKNOWN-'`. |
| **SEC-49** | Signed URL Time-To-Live Boundary | Storage Security | Presigned URL truy cập media lưu viện có thời gian sống chính xác 900 giây (15 phút). |
| **SEC-50** | Expired Signed URL Access Denial | Storage Security | Truy cập Presigned URL sau 900 giây bị Storage Server trả về HTTP 403 Forbidden. |
| **SEC-51** | Bulletin Revocation Real-Time Access Cut | Media Privacy | Bản tin y khoa bị thu hồi (`revoked`) ngay lập tức vô hiệu hóa khả năng xem ảnh của chủ nuôi. |
| **SEC-52** | Pet Ownership Transfer Media Revocation | Privacy (D-12) | Thú cưng được chuyển nhượng chủ mới ngay lập tức thu hồi quyền xem ảnh lưu viện của chủ cũ. |
| **SEC-53** | Physical Media File Purge After 60 Days | Data Lifecycle (D-10) | Tệp ảnh/video lưu viện quá 60 ngày bị xóa vật lý hoàn toàn khỏi Storage disk và API. |
| **SEC-54** | Physical Purge Error Retry & Audit Log | System Resilience | Lỗi I/O khi xóa tệp vật lý được ghi nhận vào `purge_retry_count` và lưu log `STORAGE_PURGE_FAILED`. |
| **SEC-55** | Image Metadata (EXIF) Stripping | Privacy Protection | Ảnh thú cưng tải lên được bóc tách 100% tọa độ GPS và thông tin thiết bị qua pipeline Sharp. |
| **SEC-56** | Video Metadata Sanitization | Privacy Protection | Video lưu viện được xử lý qua FFmpeg bitexact để loại bỏ metadata và thông tin nhạy cảm. |
| **SEC-57** | Corrupted Media Payload Rejection | Pipeline Resilience | Tệp ảnh/video bị hỏng header hoặc đứt đoạn bị từ chối trước khi đi vào xử lý FFmpeg/Sharp. |
| **SEC-58** | Media Upload Magic Byte Validation | File Gateway | Tệp tải lên được kiểm tra 4 byte đầu tiên; chỉ chấp nhận đúng định dạng JPEG/PNG/MP4 thực tế. |
| **SEC-59** | Search Path Injection Immunity | Database Defense | 100% hàm RPC và Trigger có khai báo tường minh `SET search_path = ''`. |
| **SEC-60** | Database Reset Deterministic Verification | System Reproducibility| Khởi tạo lại CSDL từ migration 01 đến 23 diễn ra trơn tru, cấu trúc 40 bảng đạt 100% RLS. |

---

### PHẦN II: DANH MỤC 32 KỊCH BẢN NHẬP LIỆU EXCEL & ROLLBACK (IMP-01 ĐẾN IMP-32)

| Mã | Tên kịch bản | Phân hệ / Tiêu chuẩn | Kỳ vọng kiến trúc & Ngưỡng an ninh |
|:---|:---|:---|:---|
| **IMP-01** | Two-Man Rule Import Approval | Governance Guard | Người tải file lên (`uploaded_by`) không thể tự phê duyệt commit (`approved_by <> uploaded_by`). |
| **IMP-02** | Active Shift Required for Import Approval | Authorization | Admin chỉ được phê duyệt commit job nhập liệu khi đang trong ca trực hoạt động. |
| **IMP-03** | State Machine Job Approval Lock | Workflow Integrity | Chỉ những job ở trạng thái `awaiting_approval` mới được phép thực thi commit vào bảng chính. |
| **IMP-04** | Soft Rollback with Traceability | Data Integrity | Thao tác rollback thực hiện xóa mềm an toàn (`is_deleted = TRUE`) có ghi nhận mã `import_job_id`. |
| **IMP-05** | Rollback Block on New Transactions | Safe Rollback Guard | Khách hàng import đã phát sinh hóa đơn hoặc bệnh án mới sau import bị chặn rollback tự động. |
| **IMP-06** | Historical Loyalty Rollback | Safe Rollback Guard | Điểm tích lũy lịch sử nhập từ file cũ được khấu trừ hoàn trả chính xác khi rollback job. |
| **IMP-07** | Pessimistic Locking Against Race Condition | Concurrency Defense | Sử dụng `SELECT ... FOR UPDATE` trên dòng job để ngăn chặn 2 admin bấm duyệt song song. |
| **IMP-08** | Automatic Batch Code Assignment | Data Cleansing | Hàng hóa nhập kho thiếu mã lô được hệ thống tự động sinh mã `'UNKNOWN-' || job_id`. |
| **IMP-09** | Missing Expiry Quarantine Flagging | Inventory Safety (D-15)| Thuốc nhập khẩu không có ngày hết hạn được tự động gắn cờ cách ly `is_quarantined = TRUE`. |
| **IMP-10** | Dry-Run Per-Row Error Reporting | Staging Validation | Chế độ chạy thử kiểm tra toàn bộ file và xuất chi tiết lỗi đến từng số dòng và tên cột. |
| **IMP-11** | Zero Partial Commit on Validation Failure | Atomicity Defense | Bất kỳ dòng dữ liệu nào vi phạm quy tắc nghiệp vụ sẽ dừng commit toàn bộ file (All-or-Nothing). |
| **IMP-12** | Worker Memory Cgroup Out-of-Memory Guard | Resource Isolation | Tiến trình worker giới hạn bộ nhớ 1.5GB; chặn các payload bất thường trước khi gây crash máy chủ. |
| **IMP-13** | Outbound Network Isolation Sandbox | Sandbox Hardening | Container worker cấu hình mạng nội bộ (`internal: true`), cấm mọi kết nối socket ra ngoài Internet. |
| **IMP-14** | Phone Number Formatting Harmonization | Data Cleansing | Chuẩn hóa số điện thoại về định dạng E.164 (`+84...`) hoặc 10 chữ số chuẩn trước khi nạp CRM. |
| **IMP-15** | Customer Duplicate Detection (Same Phone) | CRM Data Quality | Phát hiện khách hàng trùng số điện thoại với dữ liệu hiện có và đưa vào nhánh xử lý phân biệt. |
| **IMP-16** | Pet Customer Association Validation | Relational Integrity | Thú cưng trong file import bắt buộc liên kết chính xác với ID khách hàng trong cùng đợt nạp. |
| **IMP-17** | Medical History Import Immutability | Clinical Integrity | Bệnh án lịch sử nhập từ hệ thống cũ vào `clinical_records` được khóa ngay lập tức (`is_locked = TRUE`).|
| **IMP-18** | Product SKU Collision Handling | Catalog Integrity | Trùng mã SKU hàng hóa với danh mục hiện tại kích hoạt cập nhật thông tin hoặc báo lỗi tùy cấu hình.|
| **IMP-19** | Negative Inventory Adjustment Block | Inventory Integrity | Số lượng tồn kho nhập vào không được phép mang giá trị âm (`quantity >= 0`). |
| **IMP-20** | Large File Staging Ingestion (>5,000 rows) | Scalability | Xử lý file dữ liệu lớn theo từng chunk (mỗi đợt 500 dòng) để tối ưu I/O và bộ nhớ CSDL. |
| **IMP-21** | Corrupted Excel File Header Rejection | File Gateway | Tệp tin Excel bị hỏng cấu trúc tệp ZIP OpenXML bị từ chối ngay tại cổng kiểm tra ban đầu. |
| **IMP-22** | Zip Bomb Compression Ratio Rejection | Anti-DoS Protection | Tệp Excel có tỷ lệ nén bất thường (> 20:1) bị từ chối trước khi giải nén để chống cạn kiệt đĩa. |
| **IMP-23** | XML External Entity (XXE) Injection Block | Parser Hardening | Trình phân tích OpenXML cấu hình cấm triệt để nạp DTD và thực thể ngoài (`disallow-doctype-decl`). |
| **IMP-24** | CSV / Excel Formula Injection Sanitization | Data Sanitization | Tự động thêm dấu nháy đơn (`'`) vào các ô dữ liệu bắt đầu bằng `=`, `+`, `-`, `@`, `\t`, `\r`. |
| **IMP-25** | Embedded VBA Macro Stream Rejection | Anti-Malware Defense | Tệp Excel có chứa macro nhúng (`_VBA_PROJECT`) bị từ chối nhập vào hệ thống bệnh viện. |
| **IMP-26** | File Extension Spoofing Detection | File Gateway | Tệp đổi đuôi giả mạo (ví dụ: file PDF/EXE đổi tên thành `.xlsx`) bị phát hiện qua 4 Magic Bytes đầu. |
| **IMP-27** | Staging Job Status Transition Integrity | State Machine | Trạng thái job chuyển dịch tuần tự: `uploaded` -> `validated` -> `awaiting_approval` -> `completed`.|
| **IMP-28** | Staging Error Audit Log Retention | Audit Integrity | Toàn bộ lỗi phát hiện trong quá trình tiền kiểm tra được ghi nhận đầy đủ vào `staging.import_errors`.|
| **IMP-29** | Worker Crash State Recovery | Fault Tolerance | Nếu container worker bị gián đoạn giữa chừng, trạng thái job được đánh dấu `failed` để xử lý lại. |
| **IMP-30** | Formula Injection Order of Precedence | Data Sanitization | Bảo toàn số âm hợp lệ (`-5`) và số điện thoại (`+84...`), chỉ vô hiệu hóa công thức thực sự. |
| **IMP-31** | Inventory Reversal Stock Card Creation | Inventory Accounting | Khi rollback job nhập kho, hệ thống tự động sinh thẻ kho đối ứng ghi nhận xuất hoàn kho an toàn. |
| **IMP-32** | Re-Import With Same SKU After Rollback | Inventory Resilience | Sau khi rollback, việc import lại cùng mã SKU đó thành công trơn tru nhờ Partial Unique Index. |
