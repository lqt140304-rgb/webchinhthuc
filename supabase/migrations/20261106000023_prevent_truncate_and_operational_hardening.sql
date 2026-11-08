-- ==============================================================================
-- MIGRATION: 20261106000023_prevent_truncate_and_operational_hardening.sql
-- Project: Bệnh viện Thú y Lê Sơn
-- Phase 4B: Retest 01 Remediation - TRUNCATE Prevention & Purge Audit Action Hardening
-- ==============================================================================

-- 1. Chặn lệnh TRUNCATE trên toàn bộ bảng lâm sàng & bệnh án (P1-5 & 4.2 Invariant)
CREATE OR REPLACE FUNCTION app.fn_prevent_clinical_record_truncate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RAISE EXCEPTION 'APP_ERROR_CLINICAL_RECORD_IMMUTABLE: Thao tác TRUNCATE trên bảng hồ sơ y khoa bị cấm tuyệt đối (Immutability Invariant)'
        USING ERRCODE = 'P0001';
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_clinical_record_truncate ON app.clinical_records;
CREATE TRIGGER trg_prevent_clinical_record_truncate
BEFORE TRUNCATE ON app.clinical_records
FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_clinical_record_truncate();

DROP TRIGGER IF EXISTS trg_prevent_prescriptions_truncate ON app.prescriptions;
CREATE TRIGGER trg_prevent_prescriptions_truncate
BEFORE TRUNCATE ON app.prescriptions
FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_clinical_record_truncate();

DROP TRIGGER IF EXISTS trg_prevent_inpatient_stays_truncate ON app.inpatient_stays;
CREATE TRIGGER trg_prevent_inpatient_stays_truncate
BEFORE TRUNCATE ON app.inpatient_stays
FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_clinical_record_truncate();

DROP TRIGGER IF EXISTS trg_prevent_inpatient_daily_logs_truncate ON app.inpatient_daily_logs;
CREATE TRIGGER trg_prevent_inpatient_daily_logs_truncate
BEFORE TRUNCATE ON app.inpatient_daily_logs
FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_clinical_record_truncate();

-- Thu hồi quyền TRUNCATE trên tất cả các bảng schema app đối với PUBLIC, anon, authenticated
REVOKE TRUNCATE ON ALL TABLES IN SCHEMA app FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON ALL TABLES IN SCHEMA staging FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE ON ALL TABLES IN SCHEMA audit FROM PUBLIC, anon, authenticated;

-- 2. Mở rộng audit_logs_action_check để phân biệt lỗi vận hành hạ tầng (STORAGE_PURGE_FAILED, SYSTEM_ERROR) với vi phạm bảo mật (P2-5 & 4.3)
ALTER TABLE audit.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_action_check;
ALTER TABLE audit.audit_logs ADD CONSTRAINT audit_logs_action_check 
    CHECK (action::text = ANY (ARRAY['INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying, 'SECURITY_VIOLATION'::character varying, 'DATA_ROLLBACK'::character varying, 'STORAGE_PURGE_FAILED'::character varying, 'SYSTEM_ERROR'::character varying]::text[]));

-- 3. Cập nhật hàm rpc_record_physical_media_deletion: ghi action 'STORAGE_PURGE_FAILED' thay cho 'SECURITY_VIOLATION' (P2-5 & 4.3)
CREATE OR REPLACE FUNCTION app.rpc_record_physical_media_deletion(
    p_media_id UUID,
    p_success BOOLEAN,
    p_error_message TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_media RECORD;
BEGIN
    SELECT * INTO v_media
    FROM app.inpatient_daily_media
    WHERE id = p_media_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'MEDIA_NOT_FOUND: Không tìm thấy tệp media %', p_media_id
            USING ERRCODE = 'P0002';
    END IF;

    IF p_success THEN
        UPDATE app.inpatient_daily_media
        SET is_purged = TRUE,
            purged_at = COALESCE(purged_at, CLOCK_TIMESTAMP()),
            physical_deleted_at = CLOCK_TIMESTAMP(),
            last_purge_error = NULL
        WHERE id = p_media_id;

        INSERT INTO audit.audit_logs (table_name, record_id, action, new_data, changed_by)
        VALUES (
            'inpatient_daily_media',
            p_media_id,
            'DELETE',
            jsonb_build_object(
                'event', 'PHYSICAL_STORAGE_OBJECT_DELETED',
                'storage_path', v_media.storage_path,
                'stay_id', v_media.stay_id,
                'physical_deleted_at', CLOCK_TIMESTAMP(),
                'status', 'verified_deleted_from_disk'
            ),
            NULL
        );
    ELSE
        UPDATE app.inpatient_daily_media
        SET purge_retry_count = purge_retry_count + 1,
            last_purge_error = p_error_message
        WHERE id = p_media_id;

        -- Ghi log lỗi vận hành hạ tầng lưu trữ (STORAGE_PURGE_FAILED, không phải vi phạm bảo mật người dùng)
        INSERT INTO audit.audit_logs (table_name, record_id, action, new_data, changed_by)
        VALUES (
            'inpatient_daily_media',
            p_media_id,
            'STORAGE_PURGE_FAILED',
            jsonb_build_object(
                'event', 'PHYSICAL_STORAGE_DELETE_FAILED',
                'storage_path', v_media.storage_path,
                'retry_count', v_media.purge_retry_count + 1,
                'error', p_error_message,
                'timestamp', CLOCK_TIMESTAMP()
            ),
            NULL
        );
    END IF;

    RETURN TRUE;
END;
$$;
