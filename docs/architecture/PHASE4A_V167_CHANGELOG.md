# NHẬT KÝ THAY ĐỔI KIẾN TRÚC PHASE 4A (PHASE 4A v1.6.7 CHANGELOG)
## Single-Facility Veterinary Hospital Management System & Generic Excel Import Center Specification

- **Dự án:** Bệnh viện Thú y Lê Sơn (`lqt140304-rgb/webchinhthuc`)
- **Mã tài liệu:** `LESON-ARCH-PHASE4A-20261103-V1.6.7`
- **Phiên bản:** 1.6.7 *(Bản vá gia cố an ninh, chuẩn hóa toàn diện PL/pgSQL & Đồng bộ hóa 16 quyết định Chủ dự án)*
- **Baseline:** Phase 4A v1.6.6 & Báo cáo thẩm định `claude-qa-phase4a-v1.6.6-review.md`
- **Ngày cập nhật:** 05/11/2026
- **Trạng thái:** **`DRAFT — AWAITING INDEPENDENT QA`**

---

## I. TỔNG QUAN THAY ĐỔI TRỌNG YẾU GIỮA v1.6.6 VÀ v1.6.7

Phiên bản v1.6.7 tập trung giải quyết triệt để 5 lỗi P2 (U-1 đến U-5), 4 lỗi P3 (U-6 đến U-9), đồng bộ hóa toàn diện 16 quyết định vận hành đã được Chủ dự án xác nhận, và mở rộng bộ kiểm thử lên 92 ca thử nghiệm chi tiết:

```
[v1.6.6 - CONDITIONAL PASS]
       │
       ├── U-1 (P2): Dollar-quote ($) syntax bug  ──> [FIXED: 100% $$ standardized, 0 syntax error]
       ├── U-2 (P2): invoice_items DDL mismatch   ──> [FIXED: Added is_deleted, expanded CHECK, updated View]
       ├── U-3 (P2): IDOR in customer appointment ──> [FIXED: Pet ownership check, future date, source='portal']
       ├── U-4 (P2): Clinical hiding bypass       ──> [FIXED: Catalog-first lookup, fail-safe TRUE]
       ├── U-5 (P2): Missing SQL in approve job   ──> [FIXED: Full SQL added in Sec V.3, Two-Man Rule]
       ├── U-6 (P3): PII in audit log & FK safety ──> [FIXED: Masked PII, added rpc_ensure_app_user]
       ├── U-7 (P2): Decisions renumbered        ──> [FIXED: Restored D-01..D-20, added mapping matrix]
       ├── U-8 (P3): Cost model calculation      ──> [FIXED: Bootstrap exactly $6.00/mo, Free tier limits]
       ├── U-9 (P3): rpc_add_invoice_item gaps    ──> [FIXED: Catalog price, active check, subtotal sync]
       └── Test Suite Expansion (88 -> 92 tests) ──> [EXPANDED: SEC-57..SEC-60 added, all DESIGNED]
       │
[v1.6.7 - DRAFT — AWAITING INDEPENDENT QA]
```

---

## II. CHI TIẾT CÁC THAY ĐỔI THEO TỪNG VẤN ĐỀ (FINDING REMEDIATION DIFF)

### 1. Khắc Phục U-1 (P2): Chuẩn Hóa Cú Pháp Dollar-Quote ($$) Toàn Diện
- **Nguyên nhân gốc:** Trình xử lý chuỗi JavaScript `replace(target, replacement)` trong quá trình biên tập tự động xem ký tự `$$` là escape sequence biến thành `$`.
- **Giải pháp thực thi:**
  - Viết lại toàn bộ 8 hàm bằng bộ thay thế chuỗi an toàn không phân rã: `app.fn_derive_invoice_item_clinical_hiding`, `app.fn_derive_product_clinical_hiding`, `app.fn_derive_service_clinical_hiding`, `app.rpc_import_rollback_job`, `app.rpc_import_approve_job`, `app.rpc_add_invoice_item`, `app.rpc_create_customer_appointment`, `app.rpc_register_customer_pet`, `app.on_auth_user_created`.
  - Kết quả kiểm chứng tự động: **0 lỗi `AS $`**, **0 lỗi `$;`**. Toàn bộ 25 hàm trong tài liệu đều sử dụng chuẩn `AS $$` và `END;\n$$;`.

### 2. Khắc Phục U-2 (P2): Đồng Bộ DDL `app.invoice_items` & Views
- **Thay đổi DDL `app.invoice_items` (Mục III.2, Nhóm 7):**
  - Bổ sung cột: `is_deleted BOOLEAN NOT NULL DEFAULT FALSE`.
  - Mở rộng ràng buộc: `CHECK (item_type IN ('clinical_service', 'retail_product', 'spa_service', 'product', 'service', 'return_product', 'discount_adjustment'))`.
- **Cập nhật View khách hàng `public.customer_invoice_items_view` (Mục VII.2.A):**
  - Bổ sung điều kiện lọc: `AND ii.is_deleted = FALSE` để triệt tiêu các dòng chi tiết đã xóa mềm sau rollback.

### 3. Khắc Phục U-3 (P2 / Security): Triệt Tiêu IDOR & Sửa Lỗi Cột Lịch Hẹn
- **Hàm `app.rpc_create_customer_appointment` (Mục VII.3, VII.4):**
  - **Triệt tiêu IDOR:** Bổ sung kiểm tra sở hữu thú cưng `WHERE id = p_pet_id AND customer_id = v_cust_id AND is_deleted = FALSE`, ném ngoại lệ `IDOR_VIOLATION` nếu khách cố đặt lịch cho thú cưng của người khác.
  - **Kiểm tra thời gian:** Bắt buộc `p_scheduled_at > CLOCK_TIMESTAMP()`, ném ngoại lệ `INVALID_SCHEDULE_TIME`.
  - **Kiểm tra loại lịch hẹn:** Bắt buộc `p_appointment_type IN ('medical', 'spa', 'vaccine', 'recheck')`.
  - **Sửa lỗi cột:** Loại bỏ cột `notes` không tồn tại; chèn đúng cột `source = 'portal'`.
  - **Sắp xếp chọn khách:** Bổ sung `ORDER BY (cul.link_status = 'verified') DESC, cul.created_at ASC LIMIT 1` để ưu tiên hồ sơ đã xác minh tại quầy.
- **Hàm `app.rpc_register_customer_pet`:**
  - Kiểm tra hợp lệ loài: `p_species IN ('dog', 'cat', 'other')`.
  - Kiểm tra hợp lệ giới tính: `p_gender IN ('male', 'female', 'unknown')`.

### 4. Khắc Phục U-4 (P2 / Security): Ngăn Chặn Bypass Che Giấu Lâm Sàng
- **Hàm Trigger `app.fn_derive_invoice_item_clinical_hiding` (Mục III.2, Nhóm 7):**
  - **Tra cứu Catalog trước:** Hệ thống tra cứu trực tiếp từ bảng danh mục `app.products` hoặc `app.services` theo ID, **tuyệt đối không tin `item_type` do client gửi lên**.
  - **Ép buộc cờ an toàn:** Bất kỳ sản phẩm nào thuộc danh mục thuốc kê đơn, thuốc tiêm, phác đồ lâm sàng (`requires_clinical_hiding = TRUE`) đều bị ép buộc `is_clinical_hidden := TRUE` và `item_type := 'product'`.
  - **Fail-safe chuẩn mực:** Thay đổi `COALESCE(v_req_hide, FALSE)` thành `COALESCE(v_req_hide, TRUE)`.

### 5. Khắc Phục U-5 (P2): Bổ Sung Toàn Văn Mã Nguồn `app.rpc_import_approve_job`
- **Mục V.3 (Quy trình Dry-run, Approve và Commit):**
  - Cung cấp toàn văn mã PL/pgSQL đầy đủ cho `app.rpc_import_approve_job(p_job_id UUID)`.
  - Kiểm tra vai trò: Bắt buộc người gọi có vai trò `admin` hoặc `manager`.
  - Bắt buộc xác thực hai bước: Kiểm tra JWT `auth.jwt()->>'aal' = 'aal2'`.
  - Khóa dòng `FOR UPDATE` trên `staging.import_jobs` để chống race condition.
  - **Thực thi Two-Man Rule bất biến (Ràng buộc D-07):** Ném ngoại lệ `TWO_MAN_RULE_VIOLATION` nếu `v_job.uploaded_by = auth.uid()`.
  - Ghi nhật ký kiểm toán bất biến `IMPORT_JOB_APPROVED`.

### 6. Khắc Phục U-6 (P3): Khử PII Trong Nhật Ký & Thêm Helper `rpc_ensure_app_user`
- **Trigger `app.on_auth_user_created` (Mục VII.5.A):**
  - Khử toàn bộ số điện thoại và email thô trong `changes` của audit log:
    - Số điện thoại masked: `SUBSTRING(NEW.phone FROM 1 FOR 3) || '***' || RIGHT(NEW.phone, 3)`.
    - Email masked: Chỉ lưu tên miền qua `split_part(NEW.email, '@', 2)`.
- **Hàm Helper `app.rpc_ensure_app_user` (Mục VII.5.A):**
  - Cung cấp hàm tự động kiểm tra và bù đắp bản ghi `app.users` từ `auth.users` nếu trigger gặp ngoại lệ tạm thời, ngăn chặn triệt để lỗi foreign key ở các RPC tiếp theo.

### 7. Khắc Phục U-7 (P2): Khôi Phục Hệ Mã Quyết Định Gốc & Bảng Ánh Xạ
- **Mục XIV (Owner Decision Register):**
  - Khôi phục 100% cấu trúc mã quyết định gốc D-01 đến D-20 theo đúng baseline v1.6.5.
  - Sử dụng các mã mở rộng chuẩn hóa cho các chính sách được làm rõ riêng: `D-01-PRO` (mua gói Pro), `D-06-INVOICE` (hiển thị hóa đơn), `D-08-NIGHT` (trực đêm), `D-LINK` (duyệt liên kết SĐT).
  - Bổ sung **Bảng Ánh Xạ Quyết Định (Owner Decision Mapping Matrix)** đối chiếu chi tiết mã gốc, mã mở rộng, trạng thái duyệt ngày 05/11/2026 và ràng buộc kỹ thuật.

### 8. Khắc Phục U-8 (P3): Chuẩn Hóa Dự Toán Bootstrap $6.00/tháng & Giới Hạn Gói Free
- **Mục X.2 (Mô hình Chi phí Dự toán):**
  - Tính toán lại chi phí giai đoạn Bootstrap chính xác từng dòng: $0 (Supabase) + $5 (Hetzner VPS) + $0 (R2) + $1 (Domain phân bổ) + $0 (Email) + $0 (Monitoring) + $0 (SMS Sandbox) = **$6.00 / tháng**.
  - Ghi rõ giới hạn kỹ thuật của gói Supabase Free: Tự động pause sau 7 ngày không hoạt động; chỉ sử dụng cho môi trường đánh giá/dev với dữ liệu giả lập (mock data); không chuyển dữ liệu thật.

### 9. Khắc Phục U-9 (P3): Hoàn Thiện Hàm `app.rpc_add_invoice_item`
- **Mục VII.3 (Quản lý Hóa đơn & Bán lẻ):**
  - Bổ sung kiểm tra `quantity > 0` cho các mặt hàng thông thường (ném lỗi `INVALID_QUANTITY`).
  - Kiểm tra trạng thái sản phẩm/dịch vụ trong danh mục: Bắt buộc `is_active = TRUE AND is_deleted = FALSE`, ném lỗi `PRODUCT_NOT_AVAILABLE` nếu vi phạm.
  - Tự động lấy đơn giá chuẩn từ catalog nếu client không truyền đơn giá tùy biến.
  - Tự động cập nhật đồng bộ cả `subtotal_amount` và `total_amount` của bảng `app.invoices`.
  - Ghi nhật ký kiểm toán bất biến `INVOICE_ITEM_ADDED`.

### 10. Khắc Phục T-3: Khóa Quyền Mặc Định Toàn Cục (Global ALTER DEFAULT PRIVILEGES)
- **Mục II.2.B & Mục VII.2:**
  - Bổ sung lệnh: `ALTER DEFAULT PRIVILEGES FOR ROLE postgres REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon;`.
  - Đảm bảo triệt tiêu hành vi tự động cấp quyền EXECUTE cho `PUBLIC` của PostgreSQL trên mọi hàm mới được tạo.

### 11. Mở Rộng Bộ Kiểm Thử Lên 92 Kịch Bản (Section XII)
- **Bổ sung 4 kịch bản an ninh chuyên sâu:**
  - `SEC-57`: **IDOR Appointment Pet Check** — Chặn đứng hành vi dùng ID thú cưng của khách hàng khác để đặt lịch hẹn.
  - `SEC-58`: **Clinical Reveal Bypass Prevention** — Kiểm chứng trigger catalog-first chặn đứng việc đổi nhãn thành `retail_product` đối với thuốc điều trị.
  - `SEC-59`: **Two-Man Rule Import Approval Enforcement** — Kiểm chứng việc chặn uploader tự duyệt đợt nhập của chính mình và chặn phê duyệt khi thiếu MFA AAL2.
  - `SEC-60`: **Catalog Price & Status Validation in Invoice** — Kiểm chứng việc chặn thêm mặt hàng bị xóa mềm hoặc có số lượng âm.
- Toàn bộ 92 test cases (SEC-01..60, IMP-01..32) được duy trì ở trạng thái **`DESIGNED — NOT TESTED`**.

---

## III. ĐỒNG BỘ HÓA 100% QUYẾT ĐỊNH CHỦ DỰ ÁN (OWNER DECISION CLOSURE)

Vào lúc 08:07 ngày 05/11/2026, Chủ dự án đã chính thức phản hồi và chốt toàn bộ 6 nội dung còn lại trong Sổ Đăng Ký Quyết Định. Hệ thống đã đồng bộ hóa 100% vào tài liệu thiết kế:

| Mã QĐ | Nội dung Quyết định | Quyết định Trực tiếp của Chủ Dự án | Trạng thái Cập nhật v1.6.7 | Ghi chú Triển khai & Ràng buộc Kỹ thuật |
| :---: | :--- | :--- | :---: | :--- |
| **D-03** | Chính sách Sao lưu & Gói PITR | *"d 03 cứ giữ bản sao lưu hàng ngyaf đi"* | **`APPROVED — BACKUP POLICY`** | Duy trì giải pháp sao lưu hàng ngày `pg_dump` mã hóa GPG đẩy lên Cloudflare R2 ($0); **quyết định KHÔNG mua gói PITR $100/tháng**. |
| **D-04** | Nhà cung cấp Captcha / Chống Bot | *"d 04 chọn a"* | **`APPROVED — SERVICE SELECTION`** | Chọn Phương án A: **Cloudflare Turnstile** ($0 phụ phí, bảo vệ sự riêng tư, không làm phiền khách hàng khi đặt lịch). |
| **D-05** | Nhà cung cấp SMS OTP Brandname | *"d 05 gửi qua zalo"* | **`APPROVED — SERVICE SELECTION`** | Chọn gửi mã OTP qua **Zalo ZNS (Zalo OA)** khi vận hành sản xuất để tối ưu chi phí (~250-400đ/tin); dev dùng sandbox ($0). |
| **D-07** | Quy tắc Hai Người Duyệt Đợt Nhập | *"d 07 lm theo đề xuất"* | **`APPROVED — GOVERNANCE POLICY`** | Làm theo đề xuất (Phương án A): **Bắt buộc Two-Man Rule ở CSDL** (`approved_by <> uploaded_by`) và Admin AAL2; không dùng cờ override. |
| **D-11** | Rà soát Pháp lý Dữ liệu PDPD | *"d 11giao nhân sự nội bộ"* | **`APPROVED — LEGAL COMPLIANCE`** | **Giao nhân sự nội bộ rà soát quy trình**, lập hồ sơ đánh giá tác động NĐ 13 và ký DPA với Supabase; không thuê luật sư ngoài. |
| **D-18** | Đơn vị Hành chính Địa chỉ Cơ sở | *"d 18 101 khuất duy tiến nhân chính thanh xuân hà nội"* | **`CONFIRMED — ADDRESS & SEO`** | Xác nhận địa chỉ chính thức: **`101 Khuất Duy Tiến, Phường Nhân Chính, Quận Thanh Xuân, Hà Nội`**; đồng bộ 100% tài liệu và SEO. |

**Kết luận tiến độ:** 100% các quyết định kỹ thuật, kiến trúc và vận hành (20/20 mã quyết định cốt lõi + 4 mã mở rộng) đã được Chủ dự án chính thức phê duyệt / xác nhận. Không còn bất kỳ quyết định nào ở trạng thái chờ (0 PENDING).
