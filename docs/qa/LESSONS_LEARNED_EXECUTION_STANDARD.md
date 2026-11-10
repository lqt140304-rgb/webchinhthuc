# TIÊU CHUẨN KỸ THUẬT & BÀI HỌC KINH NGHIỆM THỰC THI (GOLDEN EXECUTION STANDARD)
## Bài học thực tế từ thành công vượt bậc của Phase 4B Retest-07

- **Dự án:** Hệ thống Quản trị & Bệnh viện Thú y Lê Sơn (`lqt140304-rgb/webchinhthuc`)
- **Đối tượng áp dụng:** Antigravity (Developer / Designer), Claude (QA Reviewer), ChatGPT (Điều phối)
- **Cơ sở thực tiễn:** Quá trình nghiệm thu toàn diện Phase 4B (Retest-01 -> Retest-07)
- **Trạng thái:** Golden Standard — Áp dụng bắt buộc cho tất cả các Phase tiếp theo (Phase 4C, Phase 5, Phase 6)

---

## 1. NGUYÊN TẮC VÀNG VỀ TÍNH TOÀN VẸN BẰNG CHỨNG (CRYPTOGRAPHIC EVIDENCE RIGOR)

> **"Không có bằng chứng máy đo độc lập thì không có nghiệm thu."**

1. **Quy tắc Clean Working Tree (Không bao giờ chạy nghiệm thu trên mã bẩn):**
   - Trước khi chạy bất kỳ test runner nào, toàn bộ mã nguồn, tệp migration, cấu hình và tệp test phải được commit sạch sẽ vào Git.
   - Mọi runner kiểm thử chính thức (`verify_clean_db_multi_order.cjs`, v.v.) **bắt buộc phải có guard kiểm tra `git status --porcelain`**. Nếu phát hiện còn file thay đổi chưa commit, runner **phải từ chối thực thi ngay lập tức (Fail-Closed)**.

2. **Đối chiếu Commit SHA 1:1 (Hash Matching):**
   - Runner phải lấy đúng commit SHA hiện tại (`git rev-parse HEAD`) tại thời điểm kiểm thử.
   - Tính toán và lưu trữ mã băm SHA-256 của từng tệp mã nguồn/migration/test suite tương ứng với đúng commit đó.
   - Tuyệt đối không sử dụng lại kết quả kiểm thử cũ hoặc số liệu tổng hợp khi checksum mã nguồn đã thay đổi.

3. **Lưu trữ Raw Machine Logs:**
   - Báo cáo kiểm chứng không chỉ đưa ra số đếm `PASS` chung chung, mà phải lưu trữ chi tiết:
     - Phiên bản môi trường: Node.js, PostgreSQL version, danh sách container Docker đang hoạt động.
     - Thời gian chạy từng suite, exit code của từng process.
     - Raw stdout và stderr của từng lượt chạy vào tệp JSON báo cáo (`HERMETIC_MULTI_ORDER_REPORT.json`).

---

## 2. NGUYÊN TẮC KIỂM THỬ ĐA THỨ TỰ TRÊN CƠ SỞ DỮ LIỆU SẠCH (HERMETIC MULTI-ORDER VERIFICATION)

> **"Một test suite chỉ đạt chuẩn khi nó có thể chạy độc lập, bất kỳ lúc nào, theo bất kỳ thứ tự nào."**

1. **Tự túc Fixture 100% (Hermetic Self-Containment):**
   - Tuyệt đối không để một test suite phụ thuộc ngầm vào dữ liệu do test suite trước tạo ra.
   - Mỗi suite phải tự tạo các fixture cần thiết cho mình và xử lý idempotent (sử dụng `ON CONFLICT DO NOTHING / UPDATE`).

2. **Thử nghiệm Đa thứ tự (Multi-Order Verification Protocol):**
   - Mỗi lần nghiệm thu phải thực thi ít nhất 4 vòng chạy:
     - **Vòng 1:** Thứ tự tuần tự chính thức (Gate 1 -> Gate 10).
     - **Vòng 2, 3, 4:** 3 thứ tự xáo trộn ngẫu nhiên hoàn toàn (Randomized Shuffled Orders).
   - Trước mỗi vòng chạy, database phải được reset về trạng thái trắng nguyên bản 100% (`cleanDatabase()`).
   - Tiêu chuẩn nghiệm thu: **100% Assertions PASS across ALL runs** (e.g. 380/380 PASS), 0 FAIL, 0 SKIP.

---

## 3. NGUYÊN TẮC BẢO MẬT ĐA TẦNG & BÁM SÁT KIẾN TRÚC (DEFENSE-IN-DEPTH & BASELINE ALIGNMENT)

1. **Bám sát Quyết định Kiến trúc (Architecture Decisions):**
   - Tuyệt đối không tự ý dựng các service hoặc server ngoài lề phá vỡ baseline đã chốt.
   - Khi áp dụng **D-16**: Toàn bộ logic server-side nhạy cảm chuyển sang Supabase Edge Functions chạy trên Deno/Edge Runtime, tích hợp trực tiếp qua Kong Gateway.

2. **Xác thực Hai Lớp (Two-Tier Authorization Gate):**
   - **Tầng 1 (Authorization Gate):** Ủy quyền hoàn toàn bằng PostgreSQL PostgREST RPC bằng chính JWT của caller. Database thực thi toàn bộ ma trận phân quyền: RBAC, ca trực (Shift), thiết bị tin cậy (BYOD Session), quyền riêng tư khách hàng (Customer Pet Ownership), và trạng thái bản tin y khoa (`published`).
   - **Tầng 2 (Storage Signing Gate):** Chỉ khi Tầng 1 trả về ủy quyền hợp lệ, Edge Function mới sử dụng `service_role` nội bộ để cấp Signed URL ngắn hạn từ Supabase Storage API.

3. **Nguyên tắc "Zero Secrets in Frontend":**
   - Frontend và client tuyệt đối không bao giờ được nắm giữ Service Role Key hay secret nội bộ.
   - Client trực tiếp gọi Storage API để ký URL phải bị chặn hoàn toàn (HTTP 400/403).

4. **Chống Path Traversal Tuyệt Đối ở Mọi Cấp:**
   - **Cấp Database:** Ràng buộc CHECK constraint `chk_inpatient_daily_media_storage_path` trên bảng dữ liệu.
   - **Cấp RPC:** Kiểm tra tham số đầu vào trong stored procedures, từ chối `..`, `//`, `\`, leading `/`, `%` URL-encoding, và ký tự null byte.
   - **Cấp Edge Runtime:** Kiểm tra segment-by-segment bằng whitelist ký tự ASCII an toàn `[a-zA-Z0-9_\-\./]`.

5. **Che Giấu Tuyệt Đối Lỗi Nội Bộ (Error Sanitization / Zero Leaks):**
   - Phản hồi từ server/Edge Function cho client phải được khử khuẩn: trả về mã lỗi chung như `NOT_FOUND` (404) hoặc `AUTHORIZATION_DENIED` (403).
   - Tuyệt đối không để lộ mã lỗi PL/pgSQL, tên bảng, tên hàm hay stack trace nội bộ cho client.
   - Header CORS phải kiểm tra whitelist domain tin cậy và luôn đính kèm `Vary: Origin`.

---

## 4. NGUYÊN TẮC KIỂM THỬ TRÊN LIVE LOCAL STACK THẬT (REAL DOCKER CONTAINERS)

1. Không dùng mock giả định môi trường khi có thể kiểm thử trực tiếp trên local Docker.
2. Kiểm tra qua đúng các cổng gateway và dịch vụ thật:
   - Kong Gateway: `54321`
   - PostgREST Data API: `3000`
   - GoTrue Auth: `9999`
   - Supabase Storage: `5000`
   - Supabase Edge Runtime: `8081`
3. Tạo JWT thật bằng đúng JWT secret của local stack cho từng vai trò người dùng (`anon`, Customer Alice, Customer Bob, Staff Nurse, Doctor, Admin) để kiểm chứng thực tế:
   - Thử nghiệm truy cập chéo dữ liệu (IDOR Probe).
   - Thử nghiệm thiết bị BYOD chưa duyệt hoặc bị thu hồi (Revocation Probe).
   - Thử nghiệm tải tệp tin thật từ Storage qua Signed URL và kiểm tra token bị giả mạo.

---

## 5. NGUYÊN TẮC BÀN GIAO & PHỐI HỢP GIỮA CÁC AGENT (COLLABORATION PROTOCOL)

1. **Phân định rõ ràng Commit:**
   - Commit mã nguồn & test (`Target Code Commit`) được tạo và kiểm chứng sạch sẽ trước.
   - Commit báo cáo & tài liệu (`Documentation Commit`) ghi nhận kết quả và đẩy lên remote branch.
2. **Nội dung bàn giao bắt buộc phải có:**
   - Tên nhánh và Commit SHA chính xác.
   - Bảng ma trận đối chiếu trạng thái trước/sau (P1: 0, P2: 0, P3: 0).
   - Hướng dẫn reviewer độc lập (Claude) các lệnh chạy tái hiện 1:1 đơn giản, rõ ràng.
   - Cam kết tuân thủ giới hạn: $0 chi phí, không deploy cloud production, không merge main khi chưa có lệnh từ CEO/User, không dùng dữ liệu khách hàng thật.

---
*Văn bản này được Antigravity đúc kết từ thành công của Phase 4B Retest-07 và sẽ được áp dụng làm quy chuẩn tối cao cho toàn bộ quá trình phát triển tiếp theo.*
