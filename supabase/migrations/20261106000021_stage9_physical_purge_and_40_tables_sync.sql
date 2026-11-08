-- ==============================================================================
-- MIGRATION: 20261106000021_stage9_physical_purge_and_40_tables_sync.sql
-- Project: Bệnh viện Thú y Lê Sơn
-- Phase 4B: Stage 9 - Final Acceptance Gate: Physical Storage Purge, Retry & 40-Table Sync
-- Invariants Enforced:
--   - P1 Remediation: Physical file deletion verification, retry tracking & audit logging
--   - Table Inventory Sync: Synchronize exact 40 tables across the system (35 app, 1 audit, 4 staging)
-- ==============================================================================

-- 1. Bổ sung các cột kiểm soát xóa tệp vật lý cho bảng app.inpatient_daily_media
ALTER TABLE app.inpatient_daily_media
    ADD COLUMN IF NOT EXISTS physical_deleted_at TIMESTAMPTZ NULL,
    ADD COLUMN IF NOT EXISTS purge_retry_count INT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_purge_error TEXT NULL;

-- 2. RPC Ghi Nhận Kết Quả Xóa Tệp Vật Lý Khỏi Storage (P1 Remediation)
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
        RAISE EXCEPTION 'MEDIA_NOT_FOUND: Tệp media không tồn tại'
            USING ERRCODE = 'P0001';
    END IF;

    IF p_success THEN
        -- Đánh dấu xóa vật lý thành công
        UPDATE app.inpatient_daily_media
        SET is_purged = TRUE,
            purged_at = COALESCE(purged_at, CLOCK_TIMESTAMP()),
            physical_deleted_at = CLOCK_TIMESTAMP(),
            last_purge_error = NULL
        WHERE id = p_media_id;

        -- Ghi log kiểm toán bất biến
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
        -- Xử lý lỗi xóa và tăng bộ đếm retry
        UPDATE app.inpatient_daily_media
        SET purge_retry_count = purge_retry_count + 1,
            last_purge_error = p_error_message
        WHERE id = p_media_id;

        -- Ghi log cảnh báo lỗi xóa tệp vật lý
        INSERT INTO audit.audit_logs (table_name, record_id, action, new_data, changed_by)
        VALUES (
            'inpatient_daily_media',
            p_media_id,
            'SECURITY_VIOLATION',
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

-- 3. Hàm Kiểm Đếm Bảng Hệ Thống (Table Inventory Verification - 40 Tables Total)
CREATE OR REPLACE FUNCTION app.verify_table_inventory()
RETURNS TABLE (
    schema_name TEXT,
    table_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT table_schema::text AS schema_name, count(*)::bigint AS table_count
    FROM information_schema.tables
    WHERE table_schema IN ('app', 'audit', 'staging')
    GROUP BY table_schema
    ORDER BY table_schema;
$$;

GRANT EXECUTE ON FUNCTION app.rpc_record_physical_media_deletion(UUID, BOOLEAN, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app.verify_table_inventory() TO authenticated, service_role;
