# BÁO CÁO ĐIỀU PHỐI DỰ ÁN — HOÀN TẤT PHASE 4A & ĐỀ XUẤT MỞ PHASE 4B
**Kính gửi:** ChatGPT (CEO Điều phối Dự án) & Chủ dự án (Project Owner)  
**Người lập:** Antigravity (Senior Product Designer & System Architect)  
**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Kiến trúc chuẩn:** Phase 4A v1.6.9 Baseline  
**Ngày lập:** 06/11/2026  
**Trạng thái báo cáo:** **`PHASE 4A — READY FOR OWNER REVIEW`** *(Dừng toàn bộ thao tác, chờ phê duyệt trước khi mở Phase 4B)*

---

## 1. Mục Đích Báo Cáo

Báo cáo này cung cấp cho CEO (ChatGPT) bức tranh toàn cảnh về tình trạng kỹ thuật, sự đồng thuận của Chủ dự án, kết quả tự kiểm toán QA độc lập, cùng toàn bộ hồ sơ nghiệm thu Phase 4A và kế hoạch chuyển giao sang Phase 4B để CEO tổng hợp, điều phối và trình Chủ dự án phê duyệt.

---

## 2. Tóm Tắt Kết Quả Hoàn Tất Phase 4A (v1.6.9 Baseline)

Toàn bộ các phát hiện kỹ thuật tồn đọng từ các vòng review trước (Claude QA v1.6.8) đã được khắc phục triệt để và thẩm định tự động:

1. **Khắc Phục 100% Lỗi Logic SQL & Bảo Vệ Ranh Giới (V-1):**
   - Hàm duyệt nhập liệu `rpc_import_approve_job`: Xóa bỏ hoàn toàn truy vấn cột `role` không tồn tại trong `app.users`, xóa bỏ vai trò `'manager'` không có trong enum CSDL, thay thế bằng hàm chuẩn `check_active_shift(v_admin_id, 'admin')`, kiểm tra trạng thái khớp CHECK constraint `status = 'awaiting_approval'`, cưỡng chế tuyệt đối nguyên tắc Bốn Mắt (Two-Man Rule: người tạo job không được tự duyệt).
   - Hàm thu hồi thiết bị `rpc_revoke_staff_device`: Chỉ cho phép Admin có ca trực active và xác thực 2 lớp AAL2 (`aal2`).
   - Hàm đảm bảo danh tính `rpc_ensure_app_user()`: Triệt tiêu hoàn toàn rủi ro IDOR bằng cách không nhận tham số từ client, đọc trực tiếp `auth.uid()` từ server context.
2. **Đồng Bộ Kiểm Đếm CSDL 39 Bảng & Phân Quyền RBAC (V-2):**
   - DDL, sơ đồ Mục III.1 và Ma trận RBAC đồng bộ chuẩn xác **39 bảng** (34 bảng `app.*`, 4 bảng `staging.*`, 1 bảng `audit.*`).
   - Bảng thiết bị `app.staff_device_sessions` được tách riêng dòng RBAC Admin Only (mọi role khác DENY) nhằm bảo vệ `session_token_hash` và `device_fingerprint`.
   - Bảng điểm tích lũy lịch sử `app.historical_loyalty_points` bổ sung cờ `is_deleted` và `rollback_job_id`, tích hợp vào hàm rollback an toàn `rpc_import_rollback_job`.
3. **Mô Hình Thiết Bị BYOD 4 Tầng Toàn Diện (D-20 / BYO-1 đến BYO-3):**
   - Tầng 1: PWA in-memory capture qua `navigator.mediaDevices.getUserMedia()`, không ghi vào Camera Roll cá nhân; minh bạch rủi ro fallback `<input capture>` và thiết lập chính sách PDPD nội bộ.
   - Tầng 2: Sharp khử EXIF mặc định (không gọi `.withMetadata()`); FFmpeg dùng cờ bitexact `-map_metadata -1 -map_chapters -1 -fflags +bitexact`.
   - Tầng 3: DDL `staff_device_sessions` (`is_trusted DEFAULT FALSE`, `staff_id ON DELETE RESTRICT`), đủ 4 RPCs quản lý vòng đời thiết bị.
   - Tầng 4: Minh bạch giới hạn Remote Wipe client (cần mạng); bổ sung cơ chế Server-side thu hồi Supabase Auth Refresh Tokens và phiên JWT 1 giờ.
4. **Bảo Vệ Dữ Liệu Y Khoa & Dòng Hóa Đơn Tự Do Fail-Safe (V-5):**
   - Ràng buộc CHECK `appointments.appointment_type` khớp 100% với RPC khách đặt lịch đủ 4 loại: `('medical', 'spa', 'vaccine', 'recheck')`.
   - Trigger `trg_enforce_invoice_item_privacy` áp dụng fail-safe tuyệt đối: Mọi dòng tự do không có mã danh mục bắt buộc tự nhận `is_clinical_hidden = TRUE`; chặn lệnh UPDATE gỡ cờ ẩn trái phép.
5. **Minh Bạch Số Học Chi Phí & Kênh OTP (V-6):**
   - Chuẩn hóa phép tính chi phí dự toán Production: $25 + 5 + 0.5 + 1 + (0\dots3) + 0 + (3\dots6) = \mathbf{\$34.50 – \$40.50 / \text{tháng}}$.
   - Kênh OTP cập nhật duy nhất Zalo ZNS (~500 OTP/tháng ~ 100.000 VNĐ) tuân thủ quyết định D-05.

---

## 3. Kết Quả Kiểm Toán Tự Động (Static QA Suite)

Hệ thống script kiểm định tự động nội bộ đã được thực thi và xác nhận:
- `scripts/deep_qa_audit_v169.cjs`: **26 / 26 Tiêu chí Kiểm toán Chuyên sâu ĐẠT 100% (PASS)**.
- `scripts/verify_v1_6_9_comprehensive.cjs`: **100% PASSED** (0 lỗi cú pháp `AS $` đơn, 22 hàm chuẩn `AS $$ ... $$;`).
- `scripts/find_duplicates.cjs`: **0 định nghĩa trùng lặp** (0 duplicate table, 0 duplicate function, 0 duplicate trigger, 0 duplicate view).
- Toàn bộ 92 kịch bản kiểm thử (60 SEC + 32 IMP) được bảo toàn nguyên vẹn với nhãn trung thực **`DESIGNED — NOT TESTED`**.
- Chi tiết log chạy terminal đã được lưu tại: [docs/architecture/VERIFICATION_RUN_OUTPUT_v169.txt](file:///D:/webbvct/docs/architecture/VERIFICATION_RUN_OUTPUT_v169.txt).

---

## 4. Tình Trạng Sổ Quyết Định Chủ Dự Án (D-01 đến D-21)

Sổ Quyết định ([OWNER_DECISION_REGISTER.md](file:///D:/webbvct/docs/architecture/OWNER_DECISION_REGISTER.md)) đã được đồng bộ chính xác theo các chỉ đạo mới nhất:

### A. Các Quyết Định Đã Được Chủ Dự Án Xác Nhận (APPROVED):
- **`D-01`**: Supabase Managed (`APPROVED — ARCHITECTURE ONLY` — Chưa mua Pro, chưa tạo production project).
- **`D-02`**: Khung giờ đón khách 08:00 – 20:00 (`APPROVED — SCHEDULE`).
- **`D-04`**: Cloudflare Turnstile \$0 (`APPROVED — SERVICE SELECTION`).
- **`D-05`**: Gửi OTP qua Zalo ZNS (`APPROVED — SERVICE SELECTION`).
- **`D-06`**: Tối đa 3 lịch hẹn chưa xong / SĐT (`APPROVED — SECURITY POLICY`).
- **`D-07`**: Two-Man Rule cho file Excel lớn (`APPROVED — SECURITY POLICY`).
- **`D-08`**: Ca linh hoạt, có nhân sự trực đêm tại viện (`APPROVED — OPERATIONS`).
- **`D-09`**: Thú cưng đã mất `is_deceased = TRUE`, chặn marketing nhắc lịch (`APPROVED — PRIVACY DESIGN`).
- **`D-10`**: Tự động xóa media lưu viện sau 60 ngày (`APPROVED — STORAGE POLICY`).
- **`D-11`**: Tự rà soát pháp lý nội bộ theo Nghị định 13/2023 (`APPROVED — INTERNAL REVIEW PROCESS`).
- **`D-12`**: Khách xem chẩn đoán đã duyệt; ẩn tuyệt đối thuốc, liều lượng, y lệnh nội bộ (`APPROVED — CLINICAL VISIBILITY`).
- **`D-13`**: Không thu thập số CCCD thô trên web portal (`APPROVED — PRIVACY DESIGN`).
- **`D-14`**: **Thiết kế 1 VPS cách ly Container parser (`APPROVED — DESIGN ONLY` — Chưa thuê VPS hay chi phí vận hành)**.
- **`D-15`**: Hàng thiếu HSD gán `unknown`, cách ly cấm xuất bán (`APPROVED — INVENTORY POLICY`).
- **`D-16`**: Chạy API trên Supabase Edge Functions Singapore (`APPROVED — ARCHITECTURE`).
- **`D-17`**: Ưu tiên đánh giá Cloudflare Pages SPA (`APPROVED FOR EVALUATION ONLY` — Chưa duyệt Production).
- **`D-19`**: Quy trình Lazy Customer Profile Creation 10 quy tắc (`APPROVED — DESIGN`).
- **`D-20`**: Cho phép BYOD có điều kiện bảo mật 4 tầng nghiêm ngặt (`APPROVED WITH CONDITIONS`).
- **`D-PHONE / D-21`**: **Cho phép nhiều khách hàng dùng chung số điện thoại (`APPROVED` — CSDL cấm đặt UNIQUE trên `phone_number` theo Bất biến P1-E)**.
- **`D-LINK`**: Quản lý/Admin AAL2 duyệt liên kết hồ sơ lịch sử, tiếp tân chỉ tiếp nhận (`APPROVED — SECURITY POLICY`).

### B. Các Quyết Định Cần CEO Điều Phối Với Chủ Dự Án (PENDING / DEFERRED):
1. **`D-03` — Chính sách Sao lưu Khắc phục Thảm họa & PITR (`PENDING — NOT DECIDED`):**
   - Chủ dự án chưa chốt mua PITR hay chọn chính sách sao lưu cuối cùng.
   - Tài liệu kỹ thuật **không ghi** PITR bị từ chối vĩnh viễn, **không ghi** sao lưu hàng ngày đã được duyệt, và **không ghi** cam kết RPO 24 giờ.
   - Kỹ thuật giữ giải pháp sao lưu hàng ngày `pg_dump` GPG lên R2 (\$0, RPO đề xuất $\le 24$h) làm **phương án đề xuất (Proposal)** chờ Chủ dự án quyết định.
2. **`D-18` — Đơn Vị Hành Chính Địa Chỉ Cơ Sở (`PENDING VERIFICATION`):**
   - Số nhà `101 Khuất Duy Tiến, Thanh Xuân, Hà Nội` đã chốt.
   - Đơn vị Phường (Nhân Chính / Thanh Xuân Bắc) đang chờ Chủ dự án đối chiếu giấy phép kinh doanh/y tế để cấu hình SEO Schema.

---

## 5. Kế Hoạch Chuẩn Bị Cho Phase 4B & Kỷ Luật Tài Chính

### A. Kỷ Luật Tuyệt Đối:
- **Chi phí đã tiêu tốn tại Phase 4A: $\mathbf{\$0.00}$.**
- Chưa tạo project cloud, chưa thuê VPS, chưa kích hoạt dịch vụ trả phí, chưa đụng chạm dữ liệu khách hàng thật.
- Đội ngũ Antigravity **dừng toàn bộ thao tác tại đây**, không tự ý viết mã Phase 4B cho đến khi có lệnh chính thức từ Chủ dự án thông qua CEO điều phối.

### B. Lộ Trình 9 Giai Đoạn Sẵn Sàng Triển Khai (Local Docker Sandbox - \$0.00):
Đã được lập kế hoạch chi tiết tại [PHASE4B_IMPLEMENTATION_PLAN.md](file:///D:/webbvct/docs/architecture/PHASE4B_IMPLEMENTATION_PLAN.md):
1. **Giai đoạn 1:** Supabase local sandbox, schema app/staging/audit, extensions, khóa quyền mặc định.
2. **Giai đoạn 2:** DDL 39 bảng, khóa ngoại `ON DELETE RESTRICT` (P1-C), cấm UNIQUE trên SĐT (P1-E).
3. **Giai đoạn 3:** Auth linkage (`rpc_ensure_app_user` 0 param), RBAC ca trực, RLS, audit logging.
4. **Giai đoạn 4:** Customer identity (Lazy Creation D-19), Pet, Booking (4 loại lịch V-5, rate-limit D-06).
5. **Giai đoạn 5:** Bệnh án khóa 24h, Addendum, y lệnh nội trú, ẩn thuốc/y lệnh nội bộ (D-12).
6. **Giai đoạn 6:** Quản trị kho theo lô (D-15), fail-safe ẩn dòng hóa đơn tự do (V-5), bảng điểm lịch sử.
7. **Giai đoạn 7:** Import Center 5 bước, Two-Man Rule (D-07), Safe Rollback J1/J2 (`validate_job_rollback`).
8. **Giai đoạn 8:** BYOD 4 tầng (D-20), khử EXIF Sharp/FFmpeg, RPC trust workflow, Remote Wipe.
9. **Giai đoạn 9:** Chạy toàn bộ 92 bài test tự động (Vitest/pgTAP) -> Chuyển 100% sang `RUNTIME PASS`.

---

## 6. Danh Mục Hồ Sơ Kỹ Thuật Đã Đồng Bộ & Sẵn Sàng Bàn Giao

Toàn bộ 9 tài liệu kỹ thuật đã được đồng bộ chuẩn mã băm MD5 xuyên suốt 6 vị trí và đóng gói vào file ZIP:

| Tên Tài Liệu | Đường Dẫn Repository | Dung Lượng & Mã Băm MD5 |
| :--- | :--- | :---: |
| **Báo Cáo Trình Duyệt Chủ Dự Án** | [PHASE4A_FINAL_OWNER_REVIEW.md](file:///D:/webbvct/docs/architecture/PHASE4A_FINAL_OWNER_REVIEW.md) | 14.935 bytes (`d4d96fa7...`) |
| **Kế Hoạch Triển Khai Phase 4B** | [PHASE4B_IMPLEMENTATION_PLAN.md](file:///D:/webbvct/docs/architecture/PHASE4B_IMPLEMENTATION_PLAN.md) | 27.148 bytes (`dc5d6ac4...`) |
| **Ma Trận Test & Nghiệm Thu Runtime** | [PHASE4B_TEST_AND_ACCEPTANCE_MATRIX.md](file:///D:/webbvct/docs/architecture/PHASE4B_TEST_AND_ACCEPTANCE_MATRIX.md) | 21.913 bytes (`020cff28...`) |
| **Tài Liệu Kiến Trúc v1.6.9 Baseline** | [PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md](file:///D:/webbvct/docs/architecture/PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md) | 255.504 bytes (`7e695a6a...`) |
| **Sổ Quyết Định Chủ Dự Án (D-01..D-21)**| [OWNER_DECISION_REGISTER.md](file:///D:/webbvct/docs/architecture/OWNER_DECISION_REGISTER.md) | 24.494 bytes (`c092790a...`) |
| **Báo Cáo Kiểm Toán QA Độc Lập** | [qa-phase4a-v1.6.9-review.md](file:///D:/webbvct/docs/qa/qa-phase4a-v1.6.9-review.md) | 20.635 bytes |
| **Bằng Chứng Test Tự Động Live** | [VERIFICATION_RUN_OUTPUT_v169.txt](file:///D:/webbvct/docs/architecture/VERIFICATION_RUN_OUTPUT_v169.txt) | 5.357 bytes |
| **Nhật Ký Thay Đổi v1.6.9** | [PHASE4A_V169_CHANGELOG.md](file:///D:/webbvct/docs/architecture/PHASE4A_V169_CHANGELOG.md) | 14.356 bytes |
| **Bảng Kiểm Tra Hồi Quy 17 Điểm** | [PHASE4A_V169_REGRESSION_CHECKLIST.md](file:///D:/webbvct/docs/architecture/PHASE4A_V169_REGRESSION_CHECKLIST.md) | 8.834 bytes |

### Gói ZIP Phân Phối Trọn Gói:
- **Desktop:** `C:\Users\Admin\Desktop\LeSon-Phase4A-v1.6.9-Deliverables.zip` *(126.009 bytes)*
- **Downloads:** `C:\Users\Admin\Downloads\LeSon-Phase4A-v1.6.9-Deliverables.zip` *(126.009 bytes)*
- **File Báo cáo CEO độc lập trên Desktop:** `C:\Users\Admin\Desktop\BAO_CAO_TRINH_CEO_PHASE4A.md`

---

## 7. Kiến Nghị Hành Động Dành Cho CEO (ChatGPT)

Kính đề nghị CEO (ChatGPT):
1. **Tổng hợp và trình Chủ dự án phê duyệt nghiệm thu Phase 4A** trên cơ sở tài liệu [PHASE4A_FINAL_OWNER_REVIEW.md](file:///D:/webbvct/docs/architecture/PHASE4A_FINAL_OWNER_REVIEW.md).
2. **Xin ý kiến quyết định của Chủ dự án về 2 mục còn mở:**
   - Quyết định chính sách sao lưu `D-03` (Chấp thuận đề xuất sao lưu định kỳ hàng ngày R2 \$0, hay tiếp tục hoãn).
   - Quyết định đơn vị Phường của địa chỉ `D-18` sau khi kiểm tra giấy phép.
3. **Phê duyệt lệnh mở Phase 4B:** Sau khi Chủ dự án nghiệm thu Phase 4A, cấp quyền cho Antigravity bắt đầu khởi tạo môi trường Supabase Local Docker sandbox theo đúng [Kế Hoạch Triển Khai Phase 4B](file:///D:/webbvct/docs/architecture/PHASE4B_IMPLEMENTATION_PLAN.md).
