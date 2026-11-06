# DANH MỤC KIỂM TRA HỒI QUY KIẾN TRÚC PHASE 4A (REGRESSION CHECKLIST v1.6.9)
## Single-Facility Veterinary Hospital Management System & Generic Excel Import Center Specification

- **Dự án:** Bệnh viện Thú y Lê Sơn (`lqt140304-rgb/webchinhthuc`)
- **Mã tài liệu kiến trúc:** `LESON-ARCH-PHASE4A-20261103-V1.6.9`
- **Phiên bản đối chiếu:** v1.6.9 (so sánh đối chiếu với v1.6.8 và báo cáo Claude QA)
- **Ngày kiểm định:** 05/11/2026
- **Người kiểm tra:** Antigravity (Senior Product Designer & System Architect)
- **Trạng thái:** **`VERIFIED — ZERO ERRORS ON TESTABLE CRITERIA`** *(Đạt 100% tiêu chí kiểm định tự động; minh bạch phân định giữa thiết kế và kiểm thử thực tế theo đúng yêu cầu Claude QA)*

---

## I. NGUYÊN TẮC BẢO TOÀN KIẾN TRÚC & MINH BẠCH BẰNG CHỨNG

Theo chỉ đạo của Chủ dự án và nguyên tắc phối hợp `AGENTS.md`:
1. **Không tuyên bố khống:** Không tuyên bố "Zero Regression" hay "Pass" chỉ dựa trên đếm tên hàm trùng lặp. Mỗi lỗi logic đã được kiểm tra tính đúng đắn trực tiếp trong thân mã SQL/DDL.
2. **Minh bạch trạng thái kiểm thử:** Toàn bộ 92 kịch bản kiểm thử trong Mục XII được giữ nguyên trạng thái **`DESIGNED — NOT TESTED`**; không đồng nhất bản thiết kế kiến trúc với mã nguồn backend đã migrate hay kiểm thử đã chạy thực tế trên cơ sở dữ liệu production.
3. **Phân định thẩm quyền rõ ràng:** Phân biệt rõ giữa các mục Chủ dự án đã phê duyệt (`APPROVED`), các mục chờ xác minh giấy phép (`PENDING VERIFICATION`), các mục hoãn mua sắm (`DEFERRED`), và các mục đề xuất chuẩn hóa kỹ thuật (`PROPOSED`).
4. **Bảo tồn toàn diện các phân hệ đã đạt:** Schema riêng tư `app.*`, 46 RPC inventory, 8 safe views, quy tắc Two-Man Rule, Lazy Profile Creation, chính sách ẩn hóa đơn và quy trình xử lý media đều được bảo toàn 100%.

---

## II. MA TRẬN ĐỐI SOÁT HỒI QUY & KHẮC PHỤC FINDINGS (v1.6.8 vs v1.6.9)

| Hạng Mục Kiểm Tra | Tiêu Chí Bắt Buộc | Trạng Thái v1.6.8 | Trạng Thái v1.6.9 | Bằng Chứng Xác Minh Thực Tế |
| :--- | :--- | :---: | :---: | :--- |
| **V-1: Cột & Vai trò trong RPC** | Tuyệt đối không query `app.users.role`, không dùng role `manager` | **FAILED** (query `app.users.role`, kiểm tra role `manager`) | **100% PASSED** | Sửa `rpc_import_approve_job` và `rpc_revoke_staff_device` chỉ dùng `check_active_shift(..., 'admin')`. |
| **V-1: Khớp Trạng thái Import Job** | Điều kiện kiểm tra trạng thái job phải khớp với CHECK CSDL | **FAILED** (kiểm tra `dry_run_passed` không có trong CHECK) | **100% PASSED** | Sửa thành `status <> 'awaiting_approval'`, khớp 100% CHECK `staging.import_jobs.status`. |
| **V-1: Bảo Vệ rpc_ensure_app_user** | Server-side only via `auth.uid()`, cấm tham số client | **FAILED** (cho truyền `p_user_id` tùy ý) | **100% PASSED** | Xóa bỏ tham số `p_user_id`; hàm lấy trực tiếp `v_user_id := auth.uid()`. |
| **V-2: Kiểm Đếm Số Lượng Bảng** | Số bảng trong DDL phải khớp 100% với tiêu đề và ERD | **FAILED** (ghi 37 bảng nhưng DDL có 39 bảng) | **100% PASSED** | Đồng bộ chính xác **39 bảng** (34 app + 4 staging + 1 audit) tại Mục III.1, ERD, Mục VI.4. |
| **V-2: Phân Quyền Device Sessions** | Không cho nhân viên SELECT trực tiếp token hash/fingerprint | **FAILED** (gộp dòng `staff_role_assignments`) | **100% PASSED** | Tách dòng RBAC riêng cho `staff_device_sessions`: DENY mọi SELECT trực tiếp, dùng RPC tối thiểu. |
| **V-2: Phân Quyền & Rollback Điểm** | `historical_loyalty_points` có RBAC và hỗ trợ rollback | **FAILED** (thiếu dòng RBAC, không có trong rollback) | **100% PASSED** | Dòng RBAC riêng (Admin only); thêm `is_deleted` và tích hợp rollback trong `rpc_import_rollback_job`. |
| **V-3: Quyết Định SĐT Dùng Chung** | Có quyết định độc lập cho P1-E Invariant (nhiều khách cùng SĐT) | **FAILED** (không có mã quyết định độc lập) | **100% PASSED** | Bổ sung quyết định độc lập **D-PHONE / D-21** (NO UNIQUE ON PHONE). |
| **V-3: Thẩm Quyền Đóng Băng Sổ** | Không tự ý tuyên bố đóng băng vĩnh viễn vượt thẩm quyền | **FAILED** (Antigravity tự tuyên bố đóng băng) | **100% PASSED** | Đổi banner thành: "Đề xuất chuẩn hóa bộ mã chờ Chủ dự án ban hành". |
| **V-3: Phân Loại Nguồn Xác Nhận** | Minh bạch nguồn xác nhận cho từng quyết định | **FAILED** (gộp chung tất cả là APPROVED) | **100% PASSED** | Phân định rõ Chat 05/11/2026, Architecture Invariant, Deferred PITR, và Pending Verification (D-18). |
| **BYO-1: Luồng Chụp Media PWA** | Ưu tiên getUserMedia in-memory; cảnh báo rủi ro `<input capture>` | **FAILED** (khẳng định sandbox cấm tuyệt đối camera roll) | **100% PASSED** | Ưu tiên `getUserMedia()` vào RAM; ngoại lệ `<input capture>` có rủi ro camera roll cần quy chế PDPD. |
| **BYO-2: Device Trust Có Thực Thi** | `is_trusted DEFAULT FALSE`; RESTRICT on delete; đủ 4 RPCs | **FAILED** (is_trusted TRUE, CASCADE, thiếu RPC) | **100% PASSED** | DDL chuẩn hóa, thêm 4 RPCs (`register`, `approve`, `revoke`, `verify`); minh bạch giới hạn Wipe. |
| **BYO-3: Khử Metadata Server-side** | Sharp không withMetadata; FFmpeg +bitexact; tách worker | **FAILED** (Sharp gọi withMetadata, FFmpeg -c copy) | **100% PASSED** | Sharp mặc định bỏ metadata; FFmpeg `-map_chapters -1 -fflags +bitexact`; tách media worker. |
| **V-5: Đồng Bộ Loại Lịch Hẹn** | `appointments.appointment_type` CHECK khớp với RPC đặt lịch | **FAILED** (CHECK chỉ medical/spa, RPC nhận vaccine/recheck) | **100% PASSED** | CSDL mở rộng CHECK gồm `('medical', 'spa', 'vaccine', 'recheck')`, khớp 100% với RPC. |
| **V-5: Ẩn Hóa Đơn Tự Do** | Dòng hóa đơn tự do không có catalog phải mặc định ẩn | **FAILED** (cho phép client tự gán item_type hiển thị) | **100% PASSED** | Trigger `fn_derive_invoice_item_clinical_hiding`: Dòng tự do bắt buộc `is_clinical_hidden = TRUE`. |
| **V-6: Phép Tính Chi Phí** | Tổng chi phí Production phải chính xác số học | **FAILED** (ghi $34.50 – $39.50) | **100% PASSED** | Sửa thành **$34.50 – $40.50 / tháng**; cập nhật Zalo ZNS theo D-05. |
| **P3: FSM & RPO** | Giải trình `validating`; không khẳng định RPO 5m khi hoãn PITR | **FAILED** (thiếu note FSM, ghi RPO 5m PITR) | **100% PASSED** | Thêm Note FSM validating; sửa RPO Daily dump $\le 24$h, ghi rõ RPO 5m PITR không áp dụng (DEFERRED). |
| **Tính Toàn Vẹn Cú Pháp & Test** | 0 lỗi AS $, 0 duplicate definitions, 92 test cases | 100% PASSED | **100% PASSED** | 0 AS $, 0 duplicate functions/tables/views/triggers, 92 test cases `DESIGNED — NOT TESTED`. |

---

## III. MINH CHỨNG OUTPUT CHẠY SCRIPT TỰ ĐỘNG

### 1. Kết Quả Chạy `scripts/verify_v1_6_9_comprehensive.cjs`:

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

### 2. Kết Quả Chạy `scripts/find_duplicates.cjs`:

```
=== DUPLICATE FUNCTIONS ===
=== DUPLICATE TABLES ===
=== DUPLICATE VIEWS ===
=== DUPLICATE TRIGGERS ===
```

---

## IV. KẾT LUẬN & SẴN SÀNG CHO CLAUDE QA THẨM ĐỊNH

1. **Tuân thủ vai trò thiết kế:** Antigravity đã hoàn thành toàn bộ các yêu cầu hiệu chỉnh kỹ thuật được nêu trong báo cáo của Claude QA và bản giao việc của Chủ dự án. Antigravity không triển khai backend production, không merge/push, không chi tiêu ngân sách, không tự quyết định thay Chủ dự án.
2. **Sẵn sàng bàn giao:** Toàn bộ 4 tệp tài liệu kiến trúc v1.6.9, các script kiểm tra và minh chứng output đã được đồng bộ sẵn sàng để Claude QA tiến hành thẩm định độc lập theo đúng quy chế phối hợp `AGENTS.md`.
