-- ==============================================================================
-- PHASE 4B MIGRATION 10: AUTOMATED AUDIT LOGGING TRIGGERS
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section III.1, Gate 3)
-- Invariants Enforced: SEC-04 (Immutable Audit Logging on Critical Financial & Clinical Entities)
-- ==============================================================================

-- 1. Hàm Trigger Ghi Nhật Ký Kiểm Toán Tự Động
CREATE OR REPLACE FUNCTION app.fn_log_audit_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_actor_id UUID := auth.uid();
    v_record_id UUID;
    v_old_data JSONB := NULL;
    v_new_data JSONB := NULL;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_record_id := OLD.id;
        v_old_data := to_jsonb(OLD);
    ELSIF TG_OP = 'UPDATE' THEN
        v_record_id := NEW.id;
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'INSERT' THEN
        v_record_id := NEW.id;
        v_new_data := to_jsonb(NEW);
    END IF;

    INSERT INTO audit.audit_logs (
        table_name,
        record_id,
        action,
        old_data,
        new_data,
        changed_by,
        changed_at
    )
    VALUES (
        TG_TABLE_NAME,
        v_record_id,
        TG_OP,
        v_old_data,
        v_new_data,
        v_actor_id,
        CLOCK_TIMESTAMP()
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Fail-safe chống chặn giao dịch nghiệp vụ nhưng in cảnh báo ra log hệ thống
    RAISE WARNING 'Audit logging failed for table % op %: %', TG_TABLE_NAME, TG_OP, SQLERRM;
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

-- 2. Gắn Trigger vào các bảng tài chính & lâm sàng trọng yếu
DROP TRIGGER IF EXISTS trg_audit_invoices ON app.invoices;
CREATE TRIGGER trg_audit_invoices
AFTER UPDATE OR DELETE ON app.invoices
FOR EACH ROW EXECUTE FUNCTION app.fn_log_audit_event();

DROP TRIGGER IF EXISTS trg_audit_invoice_items ON app.invoice_items;
CREATE TRIGGER trg_audit_invoice_items
AFTER INSERT OR UPDATE OR DELETE ON app.invoice_items
FOR EACH ROW EXECUTE FUNCTION app.fn_log_audit_event();

DROP TRIGGER IF EXISTS trg_audit_clinical_records ON app.clinical_records;
CREATE TRIGGER trg_audit_clinical_records
AFTER UPDATE OR DELETE ON app.clinical_records
FOR EACH ROW EXECUTE FUNCTION app.fn_log_audit_event();

DROP TRIGGER IF EXISTS trg_audit_customers ON app.customers;
CREATE TRIGGER trg_audit_customers
AFTER UPDATE OR DELETE ON app.customers
FOR EACH ROW EXECUTE FUNCTION app.fn_log_audit_event();

DROP TRIGGER IF EXISTS trg_audit_staff_roles ON app.staff_role_assignments;
CREATE TRIGGER trg_audit_staff_roles
AFTER INSERT OR UPDATE OR DELETE ON app.staff_role_assignments
FOR EACH ROW EXECUTE FUNCTION app.fn_log_audit_event();

DROP TRIGGER IF EXISTS trg_audit_treatment_orders ON app.treatment_orders;
CREATE TRIGGER trg_audit_treatment_orders
AFTER UPDATE OR DELETE ON app.treatment_orders
FOR EACH ROW EXECUTE FUNCTION app.fn_log_audit_event();
