-- ==============================================================================
-- MIGRATION 26: RETEST-04 BYOD STRICT DEVICE CHECK & STAGING CLEANUP
-- Project: Bệnh viện Thú y Lê Sơn
-- Phase 4B Remediation: V4-01 (BYOD Signed URL Bypass Fix) & P3 (Staging Cleanup)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. P3: LOẠI BỎ CÁC WRAPPER STAGING DƯ THỪA & THU HỒI USAGE TRÊN SCHEMA STAGING
-- ------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS staging.rpc_approve_import_job(UUID);
DROP FUNCTION IF EXISTS staging.rpc_commit_import_job(UUID);
DROP FUNCTION IF EXISTS staging.rpc_rollback_import_job(UUID);

-- Thu hồi quyền truy cập schema staging từ authenticated, anon, public
REVOKE ALL ON SCHEMA staging FROM authenticated, anon, public;
REVOKE ALL ON ALL TABLES IN SCHEMA staging FROM authenticated, anon, public;
REVOKE ALL ON ALL ROUTINES IN SCHEMA staging FROM authenticated, anon, public;

-- Chỉ cấp quyền cho postgres và service_role
GRANT USAGE ON SCHEMA staging TO postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA staging TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA staging TO postgres, service_role;

-- ------------------------------------------------------------------------------
-- 2. V4-01: BẢO VỆ ĐƯỜNG DẪN XEM MEDIA BẰNG KIỂM TRA PHIÊN THIẾT BỊ BYOD Ở SERVER
-- ------------------------------------------------------------------------------

-- Cập nhật RPC app.rpc_generate_media_signed_url:
-- 1. Nếu là nhân viên: Bắt buộc truyền fingerprint thiết bị hợp lệ (không cho phép NULL để bypass).
--    Xác thực phiên thiết bị qua app.rpc_verify_staff_device (kiểm tra staff_id, is_trusted, status, is_revoked, expires_at).
-- 2. Nếu là khách hàng: Kiểm tra quyền độc lập (sở hữu thú cưng, bác sĩ duyệt chia sẻ, bản tin y khoa đã xuất bản).
--    Khách hàng không bị bắt buộc dùng cơ chế BYOD của nhân viên.
--    Tuyệt đối chặn khách hàng xem media chưa gắn bản tin hoặc bản tin chưa xuất bản.
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
    v_now TIMESTAMPTZ := clock_timestamp();
    v_expires_at TIMESTAMPTZ := v_now + INTERVAL '15 minutes';
    v_token TEXT;
    v_signed_url TEXT;
BEGIN
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Người dùng chưa đăng nhập'
            USING ERRCODE = 'P0001';
    END IF;

    -- Lấy thông tin tệp media và bản tin đính kèm
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
       app.check_active_shift(v_caller_id, 'nurse') OR 
       app.check_active_shift(v_caller_id, 'spa') OR 
       app.check_active_shift(v_caller_id, 'admin') THEN
        v_is_staff := TRUE;

        -- V4-01: Nhân viên bắt buộc phải cung cấp fingerprint thiết bị BYOD hợp lệ khi truy cập media
        IF p_device_fingerprint_hash IS NULL OR trim(p_device_fingerprint_hash) = '' THEN
            RAISE EXCEPTION 'DEVICE_FINGERPRINT_REQUIRED: Nhân viên truy cập media lưu viện bắt buộc phải định danh thiết bị BYOD (D-20 Layer 3 Guard)'
                USING ERRCODE = '42501';
        END IF;

        -- Xác thực phiên thiết bị tin cậy trên máy chủ (kiểm tra sở hữu staff_id = auth.uid(), is_trusted, status = active, chưa thu hồi, chưa hết hạn)
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

    -- Sinh standard Supabase Storage Token thời hạn đúng 900 giây (15 phút)
    v_token := app.sign_storage_download_token('inpatient-media-private', v_media.storage_path, 900);
    v_signed_url := '/storage/v1/object/sign/inpatient-media-private/' || v_media.storage_path || '?token=' || v_token;

    RETURN jsonb_build_object(
        'authorized', TRUE,
        'media_id', p_media_id,
        'bucket_id', 'inpatient-media-private',
        'storage_path', v_media.storage_path,
        'signed_url', v_signed_url,
        'media_type', v_media.media_type,
        'expires_at', v_expires_at,
        'valid_seconds', 900
    );
END;
$$;

-- Xóa các signature cũ nhận 1 tham số để tránh lỗi đa hình nhập nhằng (ambiguous function call)
DROP FUNCTION IF EXISTS public.rpc_request_media_signed_url(UUID);
DROP FUNCTION IF EXISTS app.rpc_request_media_signed_url(UUID);

-- Cập nhật app.rpc_request_media_signed_url hỗ trợ fingerprint thiết bị BYOD
CREATE OR REPLACE FUNCTION app.rpc_request_media_signed_url(
    p_media_id UUID,
    p_device_fingerprint_hash CHAR(64) DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_generate_media_signed_url(p_media_id, p_device_fingerprint_hash);
END;
$$;

-- Cập nhật public.rpc_request_media_signed_url chuyển tiếp đúng fingerprint thiết bị
CREATE OR REPLACE FUNCTION public.rpc_request_media_signed_url(
    p_media_id UUID,
    p_device_fingerprint_hash CHAR(64) DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_generate_media_signed_url(p_media_id, p_device_fingerprint_hash);
END;
$$;

-- Phân quyền EXECUTE nghiêm ngặt: Chỉ authenticated mới được gọi
REVOKE ALL ON FUNCTION app.rpc_generate_media_signed_url(UUID, CHAR(64)) FROM anon, public;
GRANT EXECUTE ON FUNCTION app.rpc_generate_media_signed_url(UUID, CHAR(64)) TO authenticated;

REVOKE ALL ON FUNCTION app.rpc_request_media_signed_url(UUID, CHAR(64)) FROM anon, public;
GRANT EXECUTE ON FUNCTION app.rpc_request_media_signed_url(UUID, CHAR(64)) TO authenticated;

REVOKE ALL ON FUNCTION public.rpc_request_media_signed_url(UUID, CHAR(64)) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.rpc_request_media_signed_url(UUID, CHAR(64)) TO authenticated;
