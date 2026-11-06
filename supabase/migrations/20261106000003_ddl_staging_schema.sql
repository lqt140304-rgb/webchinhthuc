-- ==============================================================================
-- PHASE 4B MIGRATION 03: STAGING SCHEMA DDL
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section III.1, Section III.3, Gate 2)
-- Table Count: 4 (import_jobs, import_rows, import_errors, import_mappings)
-- ==============================================================================

-- 1. Bảng quản lý tiến trình import dữ liệu
CREATE TABLE IF NOT EXISTS staging.import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_hash_sha256 CHAR(64) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN (
        'uploaded', 'validating', 'validated', 'validation_failed', 
        'awaiting_approval', 'processing', 'completed', 'failed', 'rolled_back'
    )),
    total_rows INT NOT NULL DEFAULT 0,
    valid_rows INT NOT NULL DEFAULT 0,
    error_rows INT NOT NULL DEFAULT 0,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    dry_run_summary JSONB NULL,
    approved_by UUID NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    approved_at TIMESTAMPTZ NULL,
    rollback_started_at TIMESTAMPTZ NULL,
    rollback_completed_at TIMESTAMPTZ NULL,
    rollback_by UUID NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    is_rolled_back BOOLEAN NOT NULL DEFAULT FALSE,
    -- D-07 Bất biến Two-Man Rule cứng trong CSDL: Người duyệt bắt buộc phải khác người tải lên
    CONSTRAINT chk_two_man_approval CHECK (approved_by IS NULL OR approved_by <> uploaded_by)
);

-- 2. Bảng dữ liệu dòng thô
CREATE TABLE IF NOT EXISTS staging.import_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES staging.import_jobs(id) ON DELETE CASCADE,
    row_number INT NOT NULL,
    raw_data JSONB NOT NULL,
    normalized_data JSONB NULL,
    is_valid BOOLEAN NOT NULL DEFAULT FALSE,
    validation_errors JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 3. Bảng chi tiết lỗi kiểm định
CREATE TABLE IF NOT EXISTS staging.import_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES staging.import_jobs(id) ON DELETE CASCADE,
    row_number INT NOT NULL,
    column_name VARCHAR(100) NULL,
    error_code VARCHAR(50) NOT NULL,
    error_message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 4. Bảng ánh xạ cột dữ liệu Excel
CREATE TABLE IF NOT EXISTS staging.import_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mapping_name VARCHAR(100) NOT NULL UNIQUE,
    target_entity VARCHAR(50) NOT NULL CHECK (target_entity IN ('customer', 'pet', 'inventory', 'invoice')),
    column_mappings JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- Chỉ mục tối ưu
CREATE INDEX IF NOT EXISTS idx_staging_import_jobs_status ON staging.import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_staging_import_rows_job ON staging.import_rows(job_id, is_valid);
CREATE INDEX IF NOT EXISTS idx_staging_import_errors_job ON staging.import_errors(job_id);

-- Khóa quyền bảo mật: Chỉ cho phép postgres và service_role truy cập
REVOKE ALL ON TABLE staging.import_jobs FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE staging.import_rows FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE staging.import_errors FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE staging.import_mappings FROM PUBLIC, anon, authenticated;

GRANT ALL ON TABLE staging.import_jobs TO postgres, service_role;
GRANT ALL ON TABLE staging.import_rows TO postgres, service_role;
GRANT ALL ON TABLE staging.import_errors TO postgres, service_role;
GRANT ALL ON TABLE staging.import_mappings TO postgres, service_role;
