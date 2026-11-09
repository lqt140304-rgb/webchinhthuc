-- ==============================================================================
-- MIGRATION 28: RETEST-07 STORAGE PATH VALIDATION & HARDENING (V7-02)
-- Description:
--   1. Thêm CHECK constraint cho cột storage_path trong bảng app.inpatient_daily_media.
--   2. Cập nhật RPC app.rpc_upload_inpatient_media để kiểm tra storage_path nghiêm ngặt:
--      - Bắt buộc tiền tố 'inpatient/'
--      - Chặn tuyệt đối path traversal ('..'), double slashes ('//'), backslashes ('\')
--      - Chặn các ký tự mã hóa URL ('%') và ký tự đặc biệt
--      - Chỉ cho phép tập ký tự an toàn: [a-zA-Z0-9_\-\./]
--   3. Cập nhật RPC app.rpc_issue_media_signed_url để xác thực storage_path trước khi cấp quyền
--   4. Cung cấp wrapper public.rpc_upload_inpatient_media chuẩn cho PostgREST API
-- ==============================================================================

-- 1. Bổ sung ràng buộc CHECK cho app.inpatient_daily_media
ALTER TABLE app.inpatient_daily_media
DROP CONSTRAINT IF EXISTS chk_inpatient_daily_media_storage_path;

ALTER TABLE app.inpatient_daily_media
ADD CONSTRAINT chk_inpatient_daily_media_storage_path
CHECK (
    storage_path LIKE 'inpatient/%'
    AND storage_path NOT LIKE '%..%'
    AND storage_path NOT LIKE '%//%'
    AND storage_path NOT LIKE '%\%'
    AND position('%' in storage_path) = 0
    AND storage_path ~ '^inpatient/[a-zA-Z0-9_\-\./]+$'
);

-- 2. Cập nhật RPC app.rpc_upload_inpatient_media với kiểm tra đường dẫn lưu trữ nghiêm ngặt
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

    -- V7-02: Kiểm tra đường dẫn lưu trữ nghiêm ngặt (Path Traversal, Encoded, Special Chars)
    IF p_storage_path IS NULL OR
       NOT (p_storage_path LIKE 'inpatient/%') OR
       p_storage_path LIKE '%..%' OR
       p_storage_path LIKE '%//%' OR
       p_storage_path LIKE '%\%' OR
       position('%' in p_storage_path) > 0 OR
       NOT (p_storage_path ~ '^inpatient/[a-zA-Z0-9_\-\./]+$') THEN
        RAISE EXCEPTION 'INVALID_STORAGE_PATH: Đường dẫn lưu trữ không hợp lệ hoặc không an toàn'
            USING ERRCODE = '22023'; -- invalid_parameter_value
    END IF;

    -- Kiểm tra giới hạn dung lượng tệp (D-20 Layer 5 Caps)
    IF p_media_type = 'image' AND p_file_size_bytes > (15 * 1024 * 1024) THEN
        RAISE EXCEPTION 'FILE_SIZE_LIMIT_EXCEEDED: Kích thước ảnh (% bytes) vượt quá giới hạn tối đa 15MB',
            p_file_size_bytes USING ERRCODE = 'P0001';
    ELSIF p_media_type = 'video' AND p_file_size_bytes > (50 * 1024 * 1024) THEN
        RAISE EXCEPTION 'FILE_SIZE_LIMIT_EXCEEDED: Kích thước video (% bytes) vượt quá giới hạn tối đa 50MB',
            p_file_size_bytes USING ERRCODE = 'P0001';
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
            'stay_id', p_stay_id,
            'bulletin_id', p_bulletin_id,
            'storage_path', p_storage_path,
            'media_type', p_media_type,
            'file_size_bytes', p_file_size_bytes,
            'device_fingerprint_hash', p_device_fingerprint_hash
        ),
        v_staff_id
    );

    RETURN v_media_id;
END;
$$;

-- 3. Cập nhật RPC app.rpc_issue_media_signed_url để kiểm tra an toàn storage_path
CREATE OR REPLACE FUNCTION app.rpc_issue_media_signed_url(
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
    v_is_staff BOOLEAN;
    v_expires_at TIMESTAMPTZ := CLOCK_TIMESTAMP() + INTERVAL '900 seconds';
BEGIN
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Yêu cầu đăng nhập'
            USING ERRCODE = '42501';
    END IF;

    -- Lấy thông tin media, stay, bulletin và pet
    SELECT 
        m.id,
        m.storage_path,
        m.media_type,
        m.is_approved_for_customer,
        m.is_purged,
        s.pet_id,
        p.customer_id AS pet_customer_id,
        b.status AS bulletin_status,
        m.bulletin_id
    INTO v_media
    FROM app.inpatient_daily_media m
    JOIN app.inpatient_stays s ON s.id = m.stay_id
    JOIN app.pets p ON p.id = s.pet_id
    LEFT JOIN app.pet_medical_bulletins b ON b.id = m.bulletin_id
    WHERE m.id = p_media_id;

    IF v_media.id IS NULL THEN
        RAISE EXCEPTION 'MEDIA_NOT_FOUND: Không tìm thấy tệp media'
            USING ERRCODE = 'P0002';
    END IF;

    -- V7-02: Kiểm tra tính toàn vẹn của storage_path trong CSDL trước khi cấp quyền
    IF v_media.storage_path IS NULL OR
       NOT (v_media.storage_path LIKE 'inpatient/%') OR
       v_media.storage_path LIKE '%..%' OR
       v_media.storage_path LIKE '%//%' OR
       v_media.storage_path LIKE '%\%' OR
       position('%' in v_media.storage_path) > 0 OR
       NOT (v_media.storage_path ~ '^inpatient/[a-zA-Z0-9_\-\./]+$') THEN
        RAISE EXCEPTION 'CORRUPT_STORAGE_PATH: Đường dẫn lưu trữ media không hợp lệ hoặc không an toàn'
            USING ERRCODE = '22023';
    END IF;

    IF v_media.is_purged THEN
        RAISE EXCEPTION 'MEDIA_PURGED: Tệp media đã bị thu hồi hoặc xóa theo chính sách lưu trữ'
            USING ERRCODE = '42501';
    END IF;

    -- Xác định vai trò của caller
    v_is_staff := (
        app.check_active_shift(v_caller_id, 'staff') OR 
        app.check_active_shift(v_caller_id, 'veterinarian') OR 
        app.check_active_shift(v_caller_id, 'nurse') OR 
        app.check_active_shift(v_caller_id, 'spa') OR 
        app.check_active_shift(v_caller_id, 'admin')
    );

    -- V4-01: Nếu là nhân viên, bắt buộc phải có device_fingerprint_hash hợp lệ và phiên tin cậy
    IF v_is_staff THEN
        IF p_device_fingerprint_hash IS NULL OR trim(p_device_fingerprint_hash) = '' THEN
            RAISE EXCEPTION 'DEVICE_FINGERPRINT_REQUIRED: Nhân viên truy cập media lưu viện bắt buộc phải định danh thiết bị BYOD (D-20 Layer 3 Guard)'
                USING ERRCODE = '42501';
        END IF;

        PERFORM app.rpc_verify_staff_device(p_device_fingerprint_hash);
    END IF;

    -- Nếu không phải nhân viên, kiểm tra quyền khách hàng (D-12 Medical Privacy Boundary)
    IF NOT v_is_staff THEN
        v_customer_id := app.get_customer_id_for_user(v_caller_id);

        IF v_customer_id IS NULL THEN
            RAISE EXCEPTION 'UNAUTHORIZED_MEDIA_ACCESS: Người dùng không phải là khách hàng hợp lệ'
                USING ERRCODE = '42501';
        END IF;

        -- Khách chỉ được xem thú cưng của mình
        IF v_media.pet_customer_id <> v_customer_id THEN
            RAISE EXCEPTION 'UNAUTHORIZED_MEDIA_ACCESS: Khách hàng không sở hữu thú cưng này'
                USING ERRCODE = '42501';
        END IF;

        -- Media phải được bác sĩ phê duyệt
        IF NOT v_media.is_approved_for_customer THEN
            RAISE EXCEPTION 'UNAUTHORIZED_MEDIA_ACCESS: Tệp media chưa được bác sĩ phê duyệt chia sẻ'
                USING ERRCODE = '42501';
        END IF;

        -- V4-01 Item 6: Khách hàng bắt buộc media phải được gắn vào bản tin y khoa đã xuất bản (published)
        IF v_media.bulletin_id IS NULL OR v_media.bulletin_status <> 'published' THEN
            RAISE EXCEPTION 'UNAUTHORIZED_MEDIA_ACCESS: Khách hàng chỉ được xem media đã gắn vào bản tin y khoa xuất bản (published)'
                USING ERRCODE = '42501';
        END IF;
    END IF;

    -- Trả về Authorization Grant an toàn cho Trusted Server Component
    RETURN jsonb_build_object(
        'authorized', TRUE,
        'media_id', p_media_id,
        'bucket_id', 'inpatient-media-private',
        'storage_path', v_media.storage_path,
        'media_type', v_media.media_type,
        'expires_at', v_expires_at,
        'valid_seconds', 900
    );
END;
$$;

-- 4. Public wrapper cho rpc_upload_inpatient_media
CREATE OR REPLACE FUNCTION public.rpc_upload_inpatient_media(
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
BEGIN
    RETURN app.rpc_upload_inpatient_media(
        p_stay_id,
        p_bulletin_id,
        p_storage_path,
        p_media_type,
        p_file_size_bytes,
        p_device_fingerprint_hash
    );
END;
$$;

-- Đảm bảo quyền EXECUTE được cấp đúng
GRANT EXECUTE ON FUNCTION app.rpc_upload_inpatient_media(UUID, UUID, TEXT, VARCHAR, BIGINT, CHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION app.rpc_issue_media_signed_url(UUID, CHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_upload_inpatient_media(UUID, UUID, TEXT, VARCHAR, BIGINT, CHAR) TO authenticated;
