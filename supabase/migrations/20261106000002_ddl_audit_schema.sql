-- ==============================================================================
-- PHASE 4B MIGRATION 02: AUDIT LOGS DDL
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section III.1, Gate 2)
-- Table Count: 1 (audit.audit_logs)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS audit.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(30) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'SECURITY_VIOLATION', 'DATA_ROLLBACK')),
    old_data JSONB NULL,
    new_data JSONB NULL,
    changed_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    ip_address INET NULL,
    user_agent TEXT NULL
);

-- Chỉ mục tối ưu truy vấn giám sát an ninh
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit.audit_logs (table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_at ON audit.audit_logs (changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_by ON audit.audit_logs (changed_by);

-- Phân quyền bảo mật: CẤM tuyệt đối mọi quyền ghi từ PUBLIC/anon/authenticated
REVOKE ALL ON TABLE audit.audit_logs FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE audit.audit_logs TO postgres;
GRANT INSERT ON TABLE audit.audit_logs TO postgres, service_role;
