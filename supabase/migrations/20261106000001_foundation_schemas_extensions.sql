-- ==============================================================================
-- PHASE 4B MIGRATION 01: FOUNDATION SCHEMAS, EXTENSIONS & DEFAULT PRIVILEGES
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section III.1, Section III.2, Gate 1)
-- Environment: Local Docker Sandbox ($0.00)
-- ==============================================================================

-- 1. EXTENSIONS
-- Đảm bảo các extension cốt lõi được cài đặt trong schema extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA extensions;

-- 2. SCHEMAS
-- Thiết lập 4 schema độc lập theo kiến trúc Phase 4A v1.6.9:
-- - public: Chứa public wrappers, views, và hàm RPC công khai (schema duy nhất phơi qua PostgREST)
-- - app: Chứa toàn bộ 34 bảng nghiệp vụ cốt lõi (ẩn hoàn toàn khỏi PostgREST, truy cập nội bộ)
-- - staging: Chứa 4 bảng staging phục vụ import dữ liệu Excel cũ (ẩn hoàn toàn khỏi PostgREST)
-- - audit: Chứa bảng audit.audit_logs bất biến (ẩn hoàn toàn khỏi PostgREST)
CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS staging;
CREATE SCHEMA IF NOT EXISTS audit;

-- 3. SCHEMA PERMISSIONS & ISOLATION
-- Thu hồi toàn bộ quyền USAGE trên các schema nội bộ khỏi PUBLIC, anon và authenticated
REVOKE ALL ON SCHEMA app FROM PUBLIC, anon, authenticated;
REVOKE ALL ON SCHEMA staging FROM PUBLIC, anon, authenticated;
REVOKE ALL ON SCHEMA audit FROM PUBLIC, anon, authenticated;

-- Cấp quyền USAGE trên schema nội bộ chỉ cho postgres (DB Owner) và service_role (Backend Internal)
GRANT USAGE ON SCHEMA app TO postgres, service_role;
GRANT USAGE ON SCHEMA staging TO postgres, service_role;
GRANT USAGE ON SCHEMA audit TO postgres, service_role;

-- Schema public được cấp USAGE cho anon và authenticated để truy cập qua PostgREST API
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 4. GLOBAL DEFAULT PRIVILEGES LOCKING
-- Khóa quyền execute mặc định cho role postgres và các hàm mới trong tương lai
-- Ngăn chặn triệt để lỗ hổng PostgREST tự động phơi hàm mới cho PUBLIC/anon
ALTER DEFAULT PRIVILEGES FOR ROLE postgres REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA app REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA staging REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon;

-- Khóa quyền truy cập mặc định trên bảng mới cho PUBLIC/anon trong các schema nội bộ
ALTER DEFAULT PRIVILEGES IN SCHEMA app REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA staging REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;

-- Khóa quyền truy cập mặc định trên sequences mới
ALTER DEFAULT PRIVILEGES IN SCHEMA app REVOKE ALL ON SEQUENCES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA staging REVOKE ALL ON SEQUENCES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit REVOKE ALL ON SEQUENCES FROM PUBLIC, anon, authenticated;

-- ==============================================================================
-- END OF MIGRATION 20261106000001_foundation_schemas_extensions.sql
-- ==============================================================================
