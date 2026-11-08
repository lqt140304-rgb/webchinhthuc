# BIÊN BẢN BÀN GIAO TOÀN DIỆN PHASE 4B (BẢN KHẮC PHỤC CLAUDE QA)
## (PHASE 4B FINAL HANDOVER & REMEDIATION DOSSIER)

**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Nhánh Git:** `feat/phase-4b-supabase-foundation`  
**Ngày bàn giao:** 08/11/2026 23:50:00 +07:00  
**Bên bàn giao:** Antigravity (Designer / Developer)  
**Bên tiếp nhận:** Claude Independent QA, CEO Điều phối (ChatGPT) & Chủ dự án  

---

### I. TÓM TẮT KHẮC PHỤC FINDINGS CLAUDE QA

Antigravity đã tiếp thu nghiêm túc và hoàn tất 100% các yêu cầu khắc phục từ đợt review độc lập của Claude QA:

1. **Khắc phục P0 — S-11 Fail-Closed:**
   - Đã tách kiểm thử GATE3-T3.5 thành 2 nhánh: Nhánh mặc định bắt buộc trả về `FALSE` (chặn ngoài ca); nhánh override bật cờ `true` trả về `TRUE` và ghi nhận nhật ký `SECURITY_VIOLATION` (`OFF_SHIFT_ADMIN_ACCESS`). Đảm bảo cấu hình sau test được khôi phục về `false`.
2. **Khắc phục P1.1 — View Security Invoker & Cấp Quyền:**
   - Tạo migration `20261106000022_prevent_clinical_record_delete_and_view_invoker.sql` áp dụng `security_invoker = true` trên toàn bộ 4 views bảo mật.
   - Bổ sung view `public.customer_available_services_view` cấp quyền `anon` và `authenticated`.
3. **Khắc phục P1.2 — Chặn DELETE trực tiếp Bệnh án (P1-C Invariant):**
   - Đặt trigger `trg_prevent_clinical_record_delete` chặn đứng mọi lệnh `DELETE FROM app.clinical_records` với ngoại lệ `APP_ERROR_CLINICAL_RECORD_IMMUTABLE`.
   - Bổ sung assertion kiểm thử thực tế trong `05_clinical_inpatient.test.cjs` (GATE5-T5.3).
4. **Khắc phục P1.3 — Chuẩn hóa 4 bảng Staging (Generic Staging P1-B):**
   - Rà soát và đồng bộ tài liệu chính xác 4 bảng: `staging.import_jobs`, `staging.import_rows`, `staging.import_errors`, `staging.import_mappings`.
5. **Khắc phục P1.4 — Worker Purge gọi Supabase Storage REST API:**
   - Cập nhật `scripts/purge_expired_media_worker.cjs` gọi `DELETE` qua REST API của Supabase Storage, kiểm tra NoSuchKey và audit log.
6. **Khắc phục P1.5 — Đóng gói Ingest Worker & Docker Compose Sandbox:**
   - Tạo module thực thi `services/import_worker/src/ingest_pipeline.cjs` và Docker Sandbox (`docker-compose.worker.yml`) với cgroup memory 1.5GB (D-14) và mạng nội bộ cô lập Default-Deny (S-6 / SEC-40).
7. **Khắc phục P1.6 & P1.7 — Đếm đúng số lượng test & Hiệu chỉnh Ma trận 92 kịch bản:**
   - Xác định chính xác **84 test assertions độc lập**, loại bỏ việc đếm trùng runner hồi quy.
   - Hiệu chỉnh ma trận: 71 `RUNTIME PASS`, 20 `DESIGN VERIFIED`, 1 `HARDWARE BOUNDARY`.
8. **Khắc phục P1.8 — Minh bạch hóa Sao lưu và Frontend:**
   - Xác nhận sao lưu local là thủ công (`pg_dump`), giữ D-03 PENDING cho cloud PITR.
   - Xác nhận Frontend local hiện tại là 100% Mock / Static, chưa kết nối backend portal theo đúng lộ trình Architecture Baseline V1.

---

### II. HƯỚNG DẪN TÁI HIỆN BẰNG CHỨNG ĐỘC LẬP (REPRODUCIBILITY GUIDE)

Claude QA hoặc CEO có thể chạy lại độc lập từng bộ kiểm thử trên Docker Sandbox theo quy trình sau:

#### 1. Kiểm tra trạng thái container CSDL
```powershell
docker ps --filter "name=supabase_db_webbvct"
```

#### 2. Chạy từng test suite độc lập (Tất cả phải đạt RUNTIME PASS)
```powershell
# Suite 01: Nền tảng schema & cô lập PostgREST (5 tests)
node test/runtime/01_foundation.test.cjs

# Suite 02: DDL 40 bảng & ràng buộc không xóa bệnh án (10 tests)
node test/runtime/02_schema_ddl.test.cjs

# Suite 03: Auth RBAC, S-11 Fail-Closed & Audit Log (10 tests)
node test/runtime/03_auth_rbac_audit.test.cjs

# Suite 04: Đặt lịch vãng lai, IDOR thú cưng & Rate limit (10 tests)
node test/runtime/04_customer_booking.test.cjs

# Suite 05: Lâm sàng, Chặn DELETE bệnh án & Two-man rule (10 tests)
node test/runtime/05_clinical_inpatient.test.cjs

# Suite 06: Bán hàng, Kho theo lô & Ẩn dòng thuốc (10 tests)
node test/runtime/06_inventory_billing.test.cjs

# Suite 07: Import Center, Two-man rule & Rollback (10 tests)
node test/runtime/07_import_center_rollback.test.cjs

# Suite 08: BYOD thiết bị, Signed URL 15m & EXIF (10 tests)
node test/runtime/08_byod_media.test.cjs

# Suite 09: Nghiệm thu cuối, Xóa Storage vật lý & Hồi quy Gates 1-9 (10 tests)
node test/runtime/09_final_acceptance_92_scenarios.test.cjs

# Worker Security Suite: Cgroup 1.5GB OOM, VPC Default-Deny, Zip bomb, XXE, Macro (10 tests)
node test/runtime/worker_security_resilience.test.cjs
```

#### 3. Chạy kiểm tra Worker Purge vật lý
```powershell
node -e "const { runPurgeWorker } = require('./scripts/purge_expired_media_worker.cjs'); runPurgeWorker().then(console.log);"
```

---

### III. HỒ SƠ TÀI LIỆU BÀN GIAO ĐÃ CẬP NHẬT

1. [PHASE4B_FINAL_EVIDENCE_AUDIT.md](file:///d:/webbvct/docs/qa/PHASE4B_FINAL_EVIDENCE_AUDIT.md)
2. [PHASE4B_92_SCENARIOS_TRACEABILITY_MATRIX_CORRECTED.md](file:///d:/webbvct/docs/qa/PHASE4B_92_SCENARIOS_TRACEABILITY_MATRIX_CORRECTED.md)
3. [NEXT_PHASE_FRONTEND_INTEGRATION_PLAN.md](file:///d:/webbvct/docs/architecture/NEXT_PHASE_FRONTEND_INTEGRATION_PLAN.md)
4. [PHASE4B_FINAL_HANDOVER.md](file:///d:/webbvct/docs/qa/PHASE4B_FINAL_HANDOVER.md)

---

### IV. CAM KẾT QUẢN TRỊ DỰ ÁN

- Không tự ý merge vào `main` hay push remote.
- Không phát sinh bất kỳ chi phí nào ($0 chi phí).
- Duy trì 4 quyết định S-11, D-03, D-18, POL-BOOKING DUAL ở trạng thái PENDING OWNER APPROVAL.
- Kính chuyển toàn bộ hồ sơ để Claude Independent QA thực hiện retest độc lập.
