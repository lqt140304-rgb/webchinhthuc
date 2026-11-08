# BÁO CÁO NGHIỆM THU PHASE 4B — GIAI ĐOẠN 5 (ACCEPTANCE GATE 5)
## BỆNH ÁN LÂM SÀNG, Y LỆNH NỘI BỘ, LƯU VIỆN, BẢN TIN Y TẾ & KIỂM THỬ E2E POSTGREST

**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Nhánh thực hiện:** `feat/phase-4b-supabase-foundation`  
**Căn cứ pháp lý & kỹ thuật:**
- Kế hoạch triển khai Phase 4B ([`PHASE4B_IMPLEMENTATION_PLAN.md`](file:///d:/webbvct/docs/architecture/PHASE4B_IMPLEMENTATION_PLAN.md) Mục 5 - Gate 5)
- Thiết kế kiến trúc Phase 4A v1.6.9 Baseline (Section VI.1, VII.3, VIII.2, XII)
- Các Invariants: **S-11 Fail-Closed**, **SEC-10 / D-12** (Bảo mật y khoa), **SEC-11** (Khóa bệnh án 24h & Tu chính án), **SEC-12 / D-07** (Nguyên tắc hai người duyệt bản tin), **D-20** (Cấp quyền xem media 15 phút)  
**Trạng thái Cổng 5 (Gate 5):** **`10/10 RUNTIME PASS — HOÀN TẤT GIAI ĐOẠN 5`**  
**Tổng kiểm thử hồi quy tích lũy (Gates 1–5):** **`45/45 RUNTIME PASS | 0 FAIL | 0 SKIP`**  
**Chi phí phát sinh:** **$0.00** *(Local Docker Sandbox)*  
**Ngày thực hiện:** 08/11/2026  

---

## PHẦN I: GIẢI TRÌNH 3 YÊU CẦU ĐẶC BIỆT CỦA CHỦ DỰ ÁN

### 1. Cơ chế S-11 Admin Off-shift Override: Giữ Trạng Thái PENDING & Triển Khai Fail-Closed Mặc Định
- **Trạng thái phê duyệt:** Tiếp tục giữ nguyên trạng thái **`PENDING OWNER APPROVAL`** trong Sổ Đăng Ký Quyết Định. Cơ chế này không được coi là quyền vận hành đã phê duyệt.
- **Giải pháp Fail-Closed bảo vệ:** 
  * Khởi tạo bảng cấu hình hệ thống `app.system_settings(setting_key, setting_value)` với cờ `allow_admin_off_shift_override = 'false'`.
  * Hàm `app.check_active_shift(p_user_id, p_required_role)` được cập nhật: nếu quản trị viên truy cập ngoài ca trực, hệ thống kiểm tra cờ này. Vì mặc định là `'false'`, hệ thống lập tức **từ chối truy cập (Fail-Closed)**.
  * Khi quản trị viên hoặc nhân viên y tế đang trong ca trực được phân công hợp lệ (`v_has_active_shift = TRUE`), quyền vận hành hoạt động 100% bình thường, không ghi log vi phạm và không bị cản trở.
- **Bằng chứng kiểm chứng:** Bài test `GATE5-T5.10` (Step A) xác nhận quản trị viên ngoài ca bị từ chối (`v_can_act = FALSE`), đảm bảo an toàn tuyệt đối.

---

### 2. Báo Cáo Đối Chiếu Quy Tắc Chống Spam Đặt Lịch: Số Điện Thoại vs Customer UUID
Theo yêu cầu thẩm tra sự khác biệt nghiệp vụ giữa hai đối tượng đặt lịch, Antigravity báo cáo chi tiết như sau:

| Tiêu chí đối chiếu | Luồng Portal Khách Hàng (`app.appointments`) | Luồng Khách Vãng Lai (`app.guest_booking_requests`) |
| :--- | :--- | :--- |
| **Khóa định danh kiểm soát** | `customer_id` (UUID duy nhất của hồ sơ khách) | `phone_number` (Số điện thoại nhập trên form công khai) |
| **Quy tắc rate limit** | Tối đa 3 lịch hẹn đang ở trạng thái `pending` hoặc `confirmed` trên mỗi hồ sơ khách | Tối đa 3 yêu cầu đặt lịch vãng lai trong vòng 24 giờ trên cùng một số điện thoại |
| **Hành vi khi vi phạm** | Báo lỗi `RATE_LIMIT_EXCEEDED` qua RPC | Trigger `trg_guest_booking_rate_limit` chặn với thông báo hướng dẫn gọi hotline |
| **Góc nhìn nghiệp vụ & Rủi ro** | **Nguy cơ spam:** Theo nguyên tắc P1-E, hệ thống cho phép nhiều hồ sơ khách dùng chung một SĐT (vợ/chồng/người thân). Nếu kẻ xấu tạo nhiều tài khoản email/auth, họ có thể đặt 3 lịch cho mỗi tài khoản dù cùng 1 SĐT.<br>**Trải nghiệm người dùng:** Nếu áp rate limit theo SĐT trên Portal, khi người chồng đã đặt 3 lịch cho chó của mình, người vợ dùng chung SĐT sẽ bị chặn đặt lịch cho mèo. | **Nguy cơ spam:** Khách vãng lai chưa có tài khoản, kẻ xấu có thể dùng script spam hàng trăm lịch hẹn làm nghẽn tổng đài.<br>**Giải pháp:** Giới hạn theo SĐT và cửa sổ thời gian 24h là bắt buộc và tối ưu nhất cho web form công khai. |
| **Đề xuất kỹ thuật (Chờ Chủ dự án duyệt)** | **Phương án A (Khuyến nghị):** Áp dụng cơ chế kép cho Portal: Giới hạn tối đa 3 lịch pending/hồ sơ khách AND tối đa 5 lịch pending/SĐT trên toàn hệ thống trong 24h.<br>**Phương án B:** Giữ nguyên kiểm tra theo `customer_id` trên Portal, tăng cường bảo vệ bằng CAPTCHA (Cloudflare Turnstile) khi đặt lịch.<br>*Lưu ý: Báo cáo này để xin ý kiến chỉ đạo, Antigravity KHÔNG tự ý ghi APPROVED.* |

---

### 3. Kiểm Thử End-to-End Qua Supabase Auth & PostgREST Bằng Real Test JWTs
- **Phương pháp thực hiện:** Không chỉ dừng lại ở việc dùng `set_config` mô phỏng phiên trong PostgreSQL, Antigravity đã tạo chữ ký điện tử HMAC-SHA256 (HS256) chuẩn định dạng JWT của Supabase sử dụng `JWT_SECRET` cục bộ (`super-secret-jwt-token-with-at-least-32-characters-long`).
- **Các phiên người dùng thử nghiệm thực:**
  * JWT Bác sĩ (`sub = 11111111-0000-0000-0000-000000000001`, `role = authenticated`)
  * JWT Khách hàng A (`sub = 33333333-0000-0000-0000-000000000001`, `role = authenticated`)
  * JWT Khách hàng B (`sub = 33333333-0000-0000-0000-000000000002`, `role = authenticated`)
- **Kết quả kiểm thử REST qua HTTP thực tế (`GATE5-T5.10`):**
  * Gửi HTTP `GET http://127.0.0.1:54321/rest/v1/customer_bulletins_view` mang JWT Khách hàng A $\rightarrow$ Trả về đúng bản tin y tế của thú cưng Khách hàng A (`HTTP 200, count = 2`).
  * Gửi cùng request trên mang JWT Khách hàng B $\rightarrow$ Trả về mảng rỗng `[]` (`HTTP 200, count = 0`), cô lập IDOR hoàn toàn.
  * Khách hàng gửi HTTP `GET http://127.0.0.1:54321/rest/v1/clinical_records` truy vấn trộm bảng bệnh án lâm sàng $\rightarrow$ PostgREST lập tức trả về **`HTTP 404 / 401 Not Found`** vì schema `app` bị cô lập triệt để khỏi API schema.

---

## PHẦN II: CHI TIẾT TRIỂN KHAI GIAI ĐOẠN 5 (ACCEPTANCE GATE 5)

### 1. Danh Mục Các Tệp Migration Mới Của Gate 5

| STT | Tệp Migration | Chức Năng Triển Khai | Invariant / Quy Tắc Bảo Mật |
| :---: | :--- | :--- | :--- |
| **13** | [`20261106000013_clinical_inpatient_rpcs.sql`](file:///d:/webbvct/supabase/migrations/20261106000013_clinical_inpatient_rpcs.sql) | - Bảng `app.system_settings` & S-11 Fail-Closed.<br>- Trigger `trg_enforce_clinical_record_lock` (khóa sau 24h).<br>- RPCs tạo bệnh án, khóa bệnh án, tu chính án, y lệnh điều trị, check-off y lệnh, bản tin y tế (Two-Man Rule).<br>- 10 Public Wrappers chuẩn `SECURITY DEFINER`. | **S-11:** Mặc định từ chối vượt quyền.<br>**SEC-11:** Chặn UPDATE trực tiếp bệnh án đã khóa, bắt buộc dùng tu chính án.<br>**D-07:** Cấm người tạo bản tin tự phê duyệt (`approved_by <> created_by`).<br>**SEC-10:** Y lệnh nội bộ mặc định `is_internal_only = TRUE`. |
| **14** | [`20261106000014_clinical_privacy_views.sql`](file:///d:/webbvct/supabase/migrations/20261106000014_clinical_privacy_views.sql) | - View `public.customer_bulletins_view` (`security_barrier = true`).<br>- View `public.customer_pets_view` (`security_barrier = true`).<br>- RPC `public.rpc_get_pet_medical_bulletins`.<br>- RPC `public.rpc_request_media_signed_url` (TTL 900s). | **SEC-10, D-12:** Loại bỏ hoàn toàn cột đơn thuốc, liều lượng, lịch tiêm khỏi portal khách.<br>**D-20:** Ký URL cấp quyền xem ảnh/video lưu viện trong 15 phút, chặn rò rỉ lâu dài. |

---

### 2. Danh Mục 10 RPCs Y Khoa & Quản Trị Bản Tin Lưu Viện

1. `public.rpc_create_clinical_record(p_pet_id, p_chief_complaint, p_clinical_notes, p_weight_kg, p_temperature_c)`: Bác sĩ trong ca trực tạo bệnh án.
2. `public.rpc_lock_clinical_record(p_record_id)`: Bác sĩ/Admin khóa bệnh án sau khi hoàn tất khám.
3. `public.rpc_create_clinical_amendment(p_record_id, p_reason, p_amended_data)`: Bác sĩ tạo phụ lục tu chính án cho bệnh án đã khóa (kèm ghi log audit).
4. `public.rpc_create_treatment_order(p_record_id, p_order_type, p_description, p_dosage, p_route, p_frequency)`: Bác sĩ ra y lệnh điều trị nội bộ (`is_internal_only = TRUE`).
5. `public.rpc_checkoff_treatment_order(p_order_id, p_execution_notes)`: Điều dưỡng trong ca trực check-off y lệnh đã tiêm/truyền/cho uống thuốc (kèm audit log).
6. `public.rpc_create_medical_bulletin(p_pet_id, p_stay_id, p_title, p_content)`: Nhân viên y tế tạo bản tin sức khỏe lưu viện (khởi tạo ở trạng thái `draft`).
7. `public.rpc_submit_bulletin_for_review(p_bulletin_id)`: Chuyển bản tin sang trạng thái `pending_approval`.
8. `public.rpc_approve_medical_bulletin(p_bulletin_id, p_review_notes)`: Bác sĩ độc lập trong ca trực thẩm định bản tin; **thực thi Two-Man Rule D-07 (chặn tự duyệt)**.
9. `public.rpc_publish_medical_bulletin(p_bulletin_id)`: Bác sĩ phát hành bản tin tới cổng thông tin khách hàng (`status = published`).
10. `public.rpc_revoke_medical_bulletin(p_bulletin_id, p_reason)`: Thu hồi bản tin khi phát hiện thông tin chưa chính xác.

---

## PHẦN III: BẰNG CHỨNG THỰC THI KIỂM THỬ RUNTIME GATE 5 (10/10 PASS)

Tệp thực thi: [`test/runtime/05_clinical_inpatient.test.cjs`](file:///d:/webbvct/test/runtime/05_clinical_inpatient.test.cjs)  
Cơ chế kiểm soát: Chạy trực tiếp qua container Docker cục bộ với cờ `-v ON_ERROR_STOP=1`.

```text
=== RUNNING RUNTIME TEST SUITE 05: CLINICAL RECORDS & INPATIENT GATES ===
Timestamp: 2026-11-08T05:13:58.463Z
Setup fixtures result: DO
SETUP_COMPLETE
[RUNTIME PASS] GATE5-T5.1: Doctor on active shift successfully creates clinical record via rpc_create_clinical_record
       Evidence: Created record result: DO
PASSED
[RUNTIME PASS] GATE5-T5.2: Non-doctor customer is blocked with PERMISSION_DENIED when attempting to create clinical record
       Evidence: Non-doctor blocked result: DO
PASSED
[RUNTIME PASS] GATE5-T5.3: SEC-11: Direct modification of locked clinical record is blocked by trigger (RECORD_LOCKED_AMENDMENT_REQUIRED)
       Evidence: Lock trigger verification: DO
PASSED
[RUNTIME PASS] GATE5-T5.4: Clinical amendment (Addendum) created for locked record with audit log verification
       Evidence: Amendment & audit verified: DO
PASSED
[RUNTIME PASS] GATE5-T5.5: Doctor creates internal treatment order (is_internal_only = TRUE) & Nurse checks off with audit log
       Evidence: Treatment order execution: DO
PASSED
[RUNTIME PASS] GATE5-T5.6: SEC-10: Customer querying clinical records, orders, and prescriptions receives 0 rows (No leak)
       Evidence: Direct clinical privacy: DO
PASSED
[RUNTIME PASS] GATE5-T5.7: SEC-12: Draft bulletins are completely isolated from Customer Portal View (0 rows)
       Evidence: Draft bulletin isolation: DO
PASSED
[RUNTIME PASS] GATE5-T5.8: D-07 Two-Man Rule: Creator cannot self-approve; independent doctor on shift approves successfully
       Evidence: Two-Man Rule test: DO
PASSED
[RUNTIME PASS] GATE5-T5.9: Published bulletin visible to pet owner Customer A, completely hidden from non-owner Customer B (IDOR guard)
       Evidence: Multi-tenant IDOR isolation: DO
PASSED
[RUNTIME PASS] GATE5-T5.10: S-11 Fail-Closed verified + PostgREST HTTP E2E with real signed JWTs (Customer A receives bulletin, Customer B receives 0 rows, internal tables denied)
       Evidence: S11: DO
PASSED, CustA HTTP count: 2, CustB HTTP count: 0, Leak status: 404

==============================================================================
GATE 5 RUNTIME SUMMARY: 10/10 PASS | 0 FAIL | 0 SKIP
==============================================================================
```

---

## PHẦN IV: BẢNG TỔNG HỢP KIỂM THỬ HỒI QUY TOÀN BỘ CÁC CỔNG (GATES 1–5)

Toàn bộ 5 bộ kiểm thử đã được chạy lại đồng loạt trên commit mới nhất với chế độ khắt khe `ON_ERROR_STOP=1`:

| Cổng kiểm thử | Bộ Test Thực Thi | Số Bài Test | Trạng Thái | Invariants / Bảo Mật Đã Xác Minh |
| :---: | :--- | :---: | :---: | :--- |
| **Gate 1** | `01_foundation.test.cjs` | 5 | **5 / 5 PASS** | Cô lập 4 schemas (`app`, `audit`, `staging`, `public`), thu hồi Default Privileges, HTTP 404 cho schema nội bộ. |
| **Gate 2** | `02_schema_ddl.test.cjs` | 10 | **10 / 10 PASS** | 39 bảng DDL + `system_settings`, **P1-C** Zero CASCADE, **P1-E** cho phép trùng SĐT, **D-07** Two-Man CHECK, **D-10** Media 60 ngày. |
| **Gate 3** | `03_auth_rbac_audit.test.cjs` | 10 | **10 / 10 PASS** | RLS trên 100% số bảng, **D-19** Lazy Creation không tạo khách sớm, phân quyền RBAC, Audit Log bất biến (`READ-ONLY`). |
| **Gate 4** | `04_customer_booking.test.cjs` | 10 | **10 / 10 PASS** | Lazy CRM customer profile khi đặt lịch lần đầu, **U-3** chống IDOR pet, **POL-BOOKING** tối đa 3 lịch pending, form chống spam 24h. |
| **Gate 5** | `05_clinical_inpatient.test.cjs` | 10 | **10 / 10 PASS** | **S-11 Fail-Closed**, **SEC-10** giấu y lệnh/đơn thuốc, **SEC-11** khóa bệnh án 24h, **D-07** Two-Man bản tin, **E2E JWT PostgREST**. |
| **TỔNG CỘNG** | **5 Test Suites (Gates 1–5)** | **45** | **45 / 45 PASS** | **100% RUNTIME PASS — ZERO FAIL — ZERO SKIP** |

---

## PHẦN V: DANH SÁCH CÁC VẤN ĐỀ VẪN ĐANG PENDING CHỜ CHỦ DỰ ÁN DUYỆT

Để đảm bảo tính minh bạch và tuân thủ kỷ luật dự án, dưới đây là danh sách toàn bộ các vấn đề kỹ thuật/nghiệp vụ đang ở trạng thái **PENDING OWNER APPROVAL**:

| Mã Vấn Đề | Nội Dung Vấn Đề | Trạng Thái Hiện Tại | Tác Động Kỹ Thuật / Giải Pháp Tạm Thời |
| :---: | :--- | :---: | :--- |
| **S-11** | **Admin Off-shift Override:** Cho phép Quản trị viên vượt quyền ca trực để xử lý cấp cứu ban đêm. | **`PENDING OWNER APPROVAL`** | Đã triển khai cơ chế **Fail-Closed mặc định** (`allow_admin_off_shift_override = 'false'`). Quản trị viên ngoài ca bị từ chối; ca trực bình thường không bị ảnh hưởng. |
| **D-17** | **Nhà cung cấp hosting Website công khai:** Cloudflare Pages vs Vercel Pro. | **`PENDING OWNER APPROVAL`** | Chỉ thử nghiệm cục bộ, chưa cấu hình domain hay ký hợp đồng hosting đám mây thương mại. |
| **D-14** | **Kiến trúc máy chủ Worker tách rời:** Thuê 1 VPS chạy Parser và DR Backup. | **`APPROVED — DESIGN ONLY`** | Chỉ thiết kế container biệt lập, chưa thuê VPS, phát sinh $0.00. |
| **POL-BOOKING DUAL** | **Quy tắc chống spam đặt lịch theo SĐT vs Customer UUID:** Nguy cơ spam multi-account từ cùng 1 SĐT trên Portal. | **`PROPOSAL PENDING REVIEW`** | Đã trình bày phương án đối chiếu và 2 kịch bản xử lý tại Phần I.2 của báo cáo này; chưa áp dụng thay đổi mã nguồn. |

---

## KẾT LUẬN & ĐỀ XUẤT TIẾP THEO

- **Kết luận:** Antigravity đã hoàn thành 100% mục tiêu của **Giai đoạn 5 (Acceptance Gate 5)**. Toàn bộ các quy tắc bảo mật y khoa nhạy cảm (SEC-10, SEC-11, SEC-12, D-07, D-12, D-20) và cơ chế Fail-Closed của S-11 đã được kiểm chứng bằng runtime và PostgREST HTTP REST API thực tế với real signed JWTs.
- **Tiến trình tiếp theo:** Kính đề nghị Chủ dự án và Claude QA xem xét kết quả nghiệm thu Gate 5 để cho phép tiến hành **Giai đoạn 6: Bán Hàng, Hóa Đơn & Quản Trị Tồn Kho** theo đúng lộ trình Phase 4B.
- **Kỷ luật cam kết:** Tuyệt đối không merge `main`, không deploy production, không phát sinh chi phí ($0.00), và chỉ sử dụng dữ liệu giả lập thử nghiệm.
