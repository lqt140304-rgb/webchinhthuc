-- ==============================================================================
-- MIGRATION: 20261106000020_media_storage_policies.sql
-- Project: Bệnh viện Thú y Lê Sơn
-- Phase 4B: Stage 8 - Media Storage Policies, Signed URL 15m & Retention Purge (D-10, D-20, SEC-20, SEC-21, SEC-22)
-- Invariants Enforced:
--   - D-20 Layer 5: Image cap <= 15MB, Video cap <= 50MB (FILE_SIZE_LIMIT_EXCEEDED)
--   - SEC-21: Signed URL time-to-live strictly 15 minutes (900 seconds)
--   - D-10: Inpatient media auto_delete_at default +60 days; purge worker removes expired media
--   - D-12 & SEC-21: Customer media access strictly validated against pet ownership & published bulletins
-- ==============================================================================

-- 1. Tiến hóa bảng app.inpatient_daily_media
ALTER TABLE app.inpatient_daily_media 
    ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_purged BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS purged_at TIMESTAMPTZ NULL,
    ADD COLUMN IF NOT EXISTS device_session_id UUID NULL REFERENCES app.staff_device_sessions(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_daily_media_purged 
    ON app.inpatient_daily_media(is_purged, auto_delete_at);

-- 2. RPC Tải Lên Media Lưu Viện Kèm Kiểm Soát Thiết Bị & Dung Lượng (SEC-18, SEC-20, D-20)
CREATE OR REPLACE FUNCTION app.rpc_upload_inpatient_media(
    p_stay_id UUID,
    p_bulletin_id UUID,
    p_storage_path TEXT,
    p_media_type VARCHAR(20),
    p_file_size_bytes BIGINT,
    p_device_fingerprint_hash CHAR(64)
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_staff_id UUID := auth.uid();
    v_session_id UUID;
    v_media_id UUID;
BEGIN
    IF v_staff_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Người dùng chưa đăng nhập'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra nhân viên có ca trực hợp lệ
    IF NOT (
        app.check_active_shift(v_staff_id, 'staff') OR 
        app.check_active_shift(v_staff_id, 'veterinarian') OR 
        app.check_active_shift(v_staff_id, 'nurse') OR 
        app.check_active_shift(v_staff_id, 'spa') OR 
        app.check_active_shift(v_staff_id, 'admin')
    ) THEN
        RAISE EXCEPTION 'SHIFT_NOT_ACTIVE: Nhân viên không có ca trực hợp lệ'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra thiết bị BYOD (D-20 Layer 3 Guard)
    PERFORM app.rpc_verify_staff_device(p_device_fingerprint_hash);

    SELECT id INTO v_session_id
    FROM app.staff_device_sessions
    WHERE staff_id = v_staff_id AND device_fingerprint_hash = p_device_fingerprint_hash;

    -- Kiểm tra giới hạn dung lượng tệp (D-20 Layer 5 Caps)
    IF p_media_type = 'image' AND p_file_size_bytes > (15 * 1024 * 1024) THEN
        RAISE EXCEPTION 'FILE_SIZE_LIMIT_EXCEEDED: Kích thước ảnh (% bytes) vượt quá giới hạn tối đa 15MB'
            , p_file_size_bytes USING ERRCODE = 'P0001';
    ELSIF p_media_type = 'video' AND p_file_size_bytes > (50 * 1024 * 1024) THEN
        RAISE EXCEPTION 'FILE_SIZE_LIMIT_EXCEEDED: Kích thước video (% bytes) vượt quá giới hạn tối đa 50MB'
            , p_file_size_bytes USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra ca lưu viện tồn tại
    IF NOT EXISTS (SELECT 1 FROM app.inpatient_stays WHERE id = p_stay_id) THEN
        RAISE EXCEPTION 'STAY_NOT_FOUND: Ca lưu viện không tồn tại'
            USING ERRCODE = 'P0001';
    END IF;

    -- Chèn bản ghi media (D-10: Mặc định auto_delete_at = 60 ngày)
    INSERT INTO app.inpatient_daily_media (
        stay_id,
        bulletin_id,
        storage_path,
        media_type,
        file_size_bytes,
        device_session_id,
        is_approved_for_customer,
        uploaded_by,
        auto_delete_at
    ) VALUES (
        p_stay_id,
        p_bulletin_id,
        p_storage_path,
        p_media_type,
        p_file_size_bytes,
        v_session_id,
        FALSE,
        v_staff_id,
        CLOCK_TIMESTAMP() + INTERVAL '60 days'
    ) RETURNING id INTO v_media_id;

    -- Ghi nhật ký kiểm toán bất biến
    INSERT INTO audit.audit_logs (table_name, record_id, action, new_data, changed_by)
    VALUES (
        'inpatient_daily_media',
        v_media_id,
        'INSERT',
        jsonb_build_object(
            'event', 'INPATIENT_MEDIA_UPLOADED',
            'stay_id', p_stay_id,
            'media_type', p_media_type,
            'file_size_bytes', p_file_size_bytes,
            'storage_path', p_storage_path,
            'device_session_id', v_session_id
        ),
        v_staff_id
    );

    RETURN v_media_id;
END;
$$;

-- 3. RPC Sinh Signed URL Thời Hạn 15 Phút (SEC-21, D-10, D-12)
CREATE OR REPLACE FUNCTION app.rpc_generate_media_signed_url(
    p_media_id UUID,
    p_device_fingerprint_hash CHAR(64) DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_caller_id UUID := auth.uid();
    v_media RECORD;
    v_customer_id UUID;
    v_is_staff BOOLEAN := FALSE;
    v_expires_at TIMESTAMPTZ;
    v_signature TEXT;
    v_signing_secret TEXT := 'leson_media_signing_secret_key_2026';
BEGIN
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Người dùng chưa đăng nhập'
            USING ERRCODE = 'P0001';
    END IF;

    -- Lấy thông tin tệp media
    SELECT m.*, s.pet_id, p.customer_id AS pet_customer_id, b.status AS bulletin_status
    INTO v_media
    FROM app.inpatient_daily_media m
    JOIN app.inpatient_stays s ON m.stay_id = s.id
    JOIN app.pets p ON s.pet_id = p.id
    LEFT JOIN app.pet_medical_bulletins b ON m.bulletin_id = b.id
    WHERE m.id = p_media_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'MEDIA_NOT_FOUND: Tệp media không tồn tại'
            USING ERRCODE = 'P0001';
    END IF;

    IF v_media.is_purged THEN
        RAISE EXCEPTION 'MEDIA_PURGED: Tệp media đã bị xóa sau 60 ngày theo quy định D-10'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra nếu caller là nhân viên trực
    IF app.check_active_shift(v_caller_id, 'staff') OR 
       app.check_active_shift(v_caller_id, 'veterinarian') OR 
       app.check_active_shift(v_caller_id, 'admin') THEN
        v_is_staff := TRUE;
        -- Nhân viên phải xác thực thiết bị nếu truyền fingerprint
        IF p_device_fingerprint_hash IS NOT NULL THEN
            PERFORM app.rpc_verify_staff_device(p_device_fingerprint_hash);
        END IF;
    END IF;

    -- Nếu không phải nhân viên, kiểm tra quyền khách hàng (D-12 Medical Privacy Boundary)
    IF NOT v_is_staff THEN
        v_customer_id := app.get_customer_id_for_user(v_caller_id);

        IF v_customer_id IS NULL THEN
            RAISE EXCEPTION 'UNAUTHORIZED_MEDIA_ACCESS: Người dùng không phải là khách hàng hợp lệ'
                USING ERRCODE = 'P0001';
        END IF;

        -- Khách chỉ được xem thú cưng của mình
        IF v_media.pet_customer_id <> v_customer_id THEN
            RAISE EXCEPTION 'UNAUTHORIZED_MEDIA_ACCESS: Khách hàng không sở hữu thú cưng này'
                USING ERRCODE = 'P0001';
        END IF;

        -- Media phải được bác sĩ phê duyệt
        IF NOT v_media.is_approved_for_customer THEN
            RAISE EXCEPTION 'UNAUTHORIZED_MEDIA_ACCESS: Tệp media chưa được bác sĩ phê duyệt chia sẻ'
                USING ERRCODE = 'P0001';
        END IF;

        -- Nếu gắn bản tin, bản tin phải ở trạng thái published
        IF v_media.bulletin_id IS NOT NULL AND v_media.bulletin_status <> 'published' THEN
            RAISE EXCEPTION 'UNAUTHORIZED_MEDIA_ACCESS: Bản tin đính kèm chưa được xuất bản'
                USING ERRCODE = 'P0001';
        END IF;
    END IF;

    -- Tạo Signed URL có hiệu lực đúng 15 phút (900 giây) (SEC-21)
    v_expires_at := CLOCK_TIMESTAMP() + INTERVAL '15 minutes';
    v_signature := encode(
        extensions.hmac((p_media_id::text || ':' || extract(epoch from v_expires_at)::bigint::text)::bytea, v_signing_secret::bytea, 'sha256'),
        'hex'
    );

    RETURN jsonb_build_object(
        'media_id', p_media_id,
        'signed_url', '/storage/v1/inpatient-media/' || p_media_id || '?expires=' || extract(epoch from v_expires_at)::bigint || '&sig=' || v_signature,
        'storage_path', v_media.storage_path,
        'media_type', v_media.media_type,
        'expires_at', v_expires_at,
        'valid_seconds', 900
    );
END;
$$;

-- 4. RPC Xác Thực Signed URL Khi Tải Media (SEC-21 Verification)
CREATE OR REPLACE FUNCTION app.rpc_verify_media_signed_url(
    p_media_id UUID,
    p_expires_epoch BIGINT,
    p_signature TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_media RECORD;
    v_current_epoch BIGINT := extract(epoch from CLOCK_TIMESTAMP())::bigint;
    v_signing_secret TEXT := 'leson_media_signing_secret_key_2026';
    v_expected_sig TEXT;
BEGIN
    -- Kiểm tra thời hạn 15 phút (SEC-21)
    IF v_current_epoch > p_expires_epoch THEN
        RAISE EXCEPTION 'SIGNED_URL_EXPIRED: Đường dẫn tải media đã hết hạn (15 phút)'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra tính toàn vẹn chữ ký HMAC
    v_expected_sig := encode(
        extensions.hmac((p_media_id::text || ':' || p_expires_epoch::text)::bytea, v_signing_secret::bytea, 'sha256'),
        'hex'
    );

    IF p_signature <> v_expected_sig THEN
        RAISE EXCEPTION 'INVALID_SIGNATURE: Chữ ký xác thực URL không hợp lệ'
            USING ERRCODE = 'P0001';
    END IF;

    SELECT * INTO v_media
    FROM app.inpatient_daily_media
    WHERE id = p_media_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'MEDIA_NOT_FOUND: Tệp media không tồn tại'
            USING ERRCODE = 'P0001';
    END IF;

    IF v_media.is_purged THEN
        RAISE EXCEPTION 'MEDIA_PURGED: Tệp media đã bị xóa vĩnh viễn'
            USING ERRCODE = 'P0001';
    END IF;

    RETURN jsonb_build_object(
        'id', v_media.id,
        'storage_path', v_media.storage_path,
        'media_type', v_media.media_type,
        'file_size_bytes', v_media.file_size_bytes,
        'status', 'verified'
    );
END;
$$;

-- 5. RPC Dọn Dẹp Định Kỳ Media Quá Hạn 60 Ngày (D-10, SEC-22 Auto-Purge)
CREATE OR REPLACE FUNCTION app.rpc_purge_expired_inpatient_media()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_purged_count INTEGER := 0;
    v_rec RECORD;
BEGIN
    FOR v_rec IN 
        SELECT id, storage_path, stay_id 
        FROM app.inpatient_daily_media 
        WHERE auto_delete_at <= CLOCK_TIMESTAMP() AND is_purged = FALSE
        FOR UPDATE
    LOOP
        UPDATE app.inpatient_daily_media
        SET is_purged = TRUE,
            purged_at = CLOCK_TIMESTAMP()
        WHERE id = v_rec.id;

        -- Ghi log kiểm toán sự kiện xóa định kỳ D-10
        INSERT INTO audit.audit_logs (table_name, record_id, action, new_data, changed_by)
        VALUES (
            'inpatient_daily_media',
            v_rec.id,
            'DELETE',
            jsonb_build_object(
                'event', 'MEDIA_AUTO_PURGED_60_DAYS',
                'reason', 'D-10 60-day retention expired',
                'storage_path', v_rec.storage_path,
                'stay_id', v_rec.stay_id,
                'purged_at', CLOCK_TIMESTAMP()
            ),
            NULL
        );

        v_purged_count := v_purged_count + 1;
    END LOOP;

    RETURN v_purged_count;
END;
$$;

-- Cấp quyền thực thi
GRANT EXECUTE ON FUNCTION app.rpc_upload_inpatient_media(UUID, UUID, TEXT, VARCHAR(20), BIGINT, CHAR(64)) TO authenticated;
GRANT EXECUTE ON FUNCTION app.rpc_generate_media_signed_url(UUID, CHAR(64)) TO authenticated;
GRANT EXECUTE ON FUNCTION app.rpc_verify_media_signed_url(UUID, BIGINT, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION app.rpc_purge_expired_inpatient_media() TO authenticated;
