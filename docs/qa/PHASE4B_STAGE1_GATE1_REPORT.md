# BÁO CÁO NGHIỆM THU PHASE 4B — GIAI ĐOẠN 1 (ACCEPTANCE GATE 1)

**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Nhánh thực hiện:** `feat/phase-4b-supabase-foundation`  
**Căn cứ pháp lý:** Lệnh Chủ Dự Án (07/11/2026) — *Nghiệm thu Phase 4A & Khởi động Phase 4B*  
**Trạng thái Cổng 1 (Gate 1):** **`100% RUNTIME PASS — HOÀN TẤT GIAI ĐOẠN 1`**  
**Chi phí phát sinh:** **$0.00** *(Local Docker Sandbox)*

---

## I. MỤC TIÊU & PHẠM VI GIAI ĐOẠN 1

Thực hiện đúng quy định tại Mục 1 của `PHASE4B_IMPLEMENTATION_PLAN.md`:
1. Khởi tạo môi trường Supabase Local CLI bằng Docker trên máy phát triển cục bộ (`D:\webbvct\supabase`).
2. Thiết lập 4 schema kiến trúc độc lập: `public`, `app`, `staging`, `audit`.
3. Kích hoạt 3 extensions cốt lõi: `uuid-ossp`, `pgcrypto`, `citext`.
4. Khóa quyền thực thi hàm mặc định toàn cục (`ALTER DEFAULT PRIVILEGES ... REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon`).
5. Cô lập 100% các schema nội bộ khỏi PostgREST API (PostgREST chỉ phơi `public`; mọi truy vấn trực tiếp vào `app`, `staging`, `audit` trả về HTTP 404).

---

## II. BẰNG CHỨNG KHỞI CHẠY DOCKER SANDBOX (EVIDENCE OF EXECUTION)

### 1. Trạng Thái Các Dịch Vụ Supabase Local
Chạy lệnh `npx supabase status` và `docker ps`:

```
CONTAINER ID   IMAGE                                                   PORTS                                           NAMES
387ae2b2827f   public.ecr.aws/supabase/studio:2026.11.02-sha-a05e7ec   0.0.0.0:54323->3000/tcp                         supabase_studio_webbvct
5e49e8608983   public.ecr.aws/supabase/postgres-meta:v0.100.0          8080/tcp                                        supabase_pg_meta_webbvct
5d0880c0103b   public.ecr.aws/supabase/edge-runtime:v1.77.9                                                            supabase_edge_runtime_webbvct
d1ee7e0ac6de   public.ecr.aws/supabase/storage-api:v1.88.0             5000/tcp                                        supabase_storage_webbvct
d164456c5a7e   public.ecr.aws/supabase/postgrest:v16.5                 3000/tcp                                        supabase_rest_webbvct
efc91f9c1bde   public.ecr.aws/supabase/realtime:v2.151.3               4000/tcp                                        supabase_realtime_webbvct
74b5b1dd3b82   public.ecr.aws/supabase/mailpit:v1.31.3                 0.0.0.0:54324->8025/tcp                         supabase_inbucket_webbvct
f62c9d5762d8   public.ecr.aws/supabase/gotrue:v2.197.0                 9999/tcp                                        supabase_auth_webbvct
b809cd680e60   public.ecr.aws/supabase/kong:2.8.1                      0.0.0.0:54321->8000/tcp                         supabase_kong_webbvct
9edca5d844c4   public.ecr.aws/supabase/vector:0.58.0-alpine                                                            supabase_vector_webbvct
d7dd98e05ccc   public.ecr.aws/supabase/logflare:1.50.15                0.0.0.0:54327->4000/tcp                         supabase_analytics_webbvct
2404bef9f816   public.ecr.aws/supabase/postgres:17.11.0.011            0.0.0.0:54322->5432/tcp                         supabase_db_webbvct
```

### 2. Thông Số Kết Nối Nội Bộ Sandbox (Local Mock)
- **Database URL:** `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- **PostgREST API URL:** `http://127.0.0.1:54321/rest/v1`
- **Supabase Studio:** `http://127.0.0.1:54323`
- **InBucket / Mailpit (Local OTP):** `http://127.0.0.1:54324`

---

## III. TỆP MIGRATION NỀN TẢNG ĐÃ TRIỂN KHAI

Tệp migration: [`supabase/migrations/20261106000001_foundation_schemas_extensions.sql`](file:///D:/webbvct/supabase/migrations/20261106000001_foundation_schemas_extensions.sql)  
- **Dung lượng:** 2.8 KB  
- **Nội dung chính:**
  * Kích hoạt `uuid-ossp`, `pgcrypto`, `citext` trong schema `extensions`.
  * Khởi tạo `app`, `staging`, `audit`.
  * Thu hồi `REVOKE ALL ON SCHEMA app, staging, audit FROM PUBLIC, anon, authenticated`.
  * Thiết lập khóa quyền toàn cục `ALTER DEFAULT PRIVILEGES FOR ROLE postgres REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon`.

---

## IV. KẾT QUẢ KIỂM THỬ THỰC THI (RUNTIME PASS: 5/5)

Đã chạy kiểm thử tự động trực tiếp trên CSDL PostgreSQL và PostgREST container thông qua script [`test/runtime/01_foundation.test.cjs`](file:///D:/webbvct/test/runtime/01_foundation.test.cjs):

```
=== RUNNING RUNTIME TEST SUITE 01: FOUNDATION SCHEMAS & ISOLATION ===
Timestamp: 2026-11-06T18:35:33.242Z
[RUNTIME PASS] GATE1-T1.1: All 4 architectural schemas exist in PostgreSQL (public, app, staging, audit)
       Evidence: Found schemas: [app, audit, public, staging]
[RUNTIME PASS] GATE1-T1.2: Core PostgreSQL extensions installed (uuid-ossp, pgcrypto, citext)
       Evidence: Installed extensions: [citext, pgcrypto, uuid-ossp]
[RUNTIME PASS] GATE1-T1.3: Internal schemas (app, staging, audit) are strictly denied USAGE from anon and PUBLIC
       Evidence: anon USAGE - app: f, staging: f, audit: f; public USAGE - app: f
[RUNTIME PASS] GATE1-T1.4: PostgREST API returns HTTP 404 for internal schemas (/app, /staging, /audit)
       Evidence: HTTP status codes - /app: 404, /staging: 404, /audit: 404
[RUNTIME PASS] GATE1-T1.5: Default function execution privilege strictly revoked from anon & PUBLIC
       Evidence: app exec: (anon=f, public=f); public exec: (anon=f, public=f)

=== SUITE 01 SUMMARY: 5 / 5 TESTS PASSED ===
>>> ACCEPTANCE GATE 1: 100% RUNTIME PASS! READY FOR GATE 2! <<<
```

---

## V. VẤN ĐỀ PHÁT SINH & HƯỚNG KHẮC PHỤC

1. **Vấn đề:** Khi khởi chạy lần đầu, Docker Desktop ở trạng thái dừng, named pipe `//./pipe/dockerDesktopLinuxEngine` không phản hồi.  
   **Khắc phục:** Antigravity đã tự động kích hoạt tiến trình nền `Docker Desktop.exe`, chờ engine WSL2 khởi động hoàn tất (Engine version 29.9.2), sau đó kết nối thông suốt.
2. **Vấn đề:** Test case ban đầu của default ACL đếm số dòng trong `pg_default_acl` thay vì kiểm tra quyền thực tế.  
   **Khắc phục:** Viết lại test case GATE1-T1.5 theo đúng chuẩn kiểm thử động: Tạo hàm thử nghiệm động trong `app` và `public`, sau đó gọi `has_function_privilege('anon', fn, 'EXECUTE')` để xác thực hàm mới tạo bị từ chối quyền thực thi 100% đối với `anon` và `PUBLIC`.

---

## VI. KẾT LUẬN & SẴN SÀNG CHUYỂN GIAI ĐOẠN 2

Cổng nghiệm thu **Acceptance Gate 1** đã hoàn tất với **100% RUNTIME PASS**.  
Antigravity sẵn sàng triển khai tiếp **Giai đoạn 2: Khởi tạo 39 Bảng Dữ Liệu & Ràng Buộc Khóa Ngoại (Gate 2)** theo đúng ủy quyền của Chủ dự án.
