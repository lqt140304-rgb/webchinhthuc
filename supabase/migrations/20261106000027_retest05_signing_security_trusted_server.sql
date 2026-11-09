-- ==============================================================================
-- MIGRATION: 20261106000027_retest05_signing_security_trusted_server.sql
-- Project: Bệnh viện Thú y Lê Sơn
-- Phase 4B: Retest-05 Remediation (V5-01 Signing Security & Trusted Server Component)
-- Invariants Enforced:
--   1. V5-01: Loại bỏ 100% việc ký URL media bằng JWT secret chung bên trong SQL
--   2. V5-01: Thu hồi và DROP hàm ký nội bộ app.sign_storage_download_token & app.rpc_verify_media_signed_url
--   3. V5-01: Chuẩn hóa 2-Tier Architecture:
--             - Tier 1 (Postgres RPC Authorization Gate): Kiểm tra quyền sở hữu thú cưng,
--               bác sĩ phê duyệt, bản tin published, ca trực nhân viên & phiên thiết bị BYOD tin cậy.
--               Trả về Authorization Grant với storage_path và bucket_id đã được chứng thực.
--             - Tier 2 (Trusted Server Component): Nhận Authorization Grant và gọi
--               Supabase Storage API (POST /storage/v1/object/sign) bằng Service Role an toàn.
--   4. Không lộ Service Role Key hay JWT Secret ra frontend.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. DROP CÁC HÀM KÝ NỘI BỘ VÀ XÁC THỰC HMAC TRONG SQL (V5-01)
-- ------------------------------------------------------------------------------
REVOKE ALL ON FUNCTION app.sign_storage_download_token(TEXT, TEXT, INT) FROM authenticated, anon, public;
DROP FUNCTION IF EXISTS app.sign_storage_download_token(TEXT, TEXT, INT);

REVOKE ALL ON FUNCTION app.rpc_verify_media_signed_url(UUID, BIGINT, TEXT) FROM authenticated, anon, public;
DROP FUNCTION IF EXISTS app.rpc_verify_media_signed_url(UUID, BIGINT, TEXT);

-- ------------------------------------------------------------------------------
-- 2. CẬP NHẬT RPC app.rpc_generate_media_signed_url THÀNH AUTHORIZATION GATE
--    (Không sinh token bằng HMAC hay secret trong SQL, chỉ cấp Authorization Grant)
-- ------------------------------------------------------------------------------
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

    -- V5-01: Trả về Authorization Grant an toàn cho Trusted Server Component
    -- Tuyệt đối KHÔNG giả lập ký JWT trong SQL bằng secret chung
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

-- ------------------------------------------------------------------------------
-- 3. CẬP NHẬT PUBLIC WRAPPER public.rpc_request_media_signed_url
-- ------------------------------------------------------------------------------
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

-- Cấp quyền thực thi cho authenticated; thu hồi khỏi anon và public
REVOKE EXECUTE ON FUNCTION public.rpc_request_media_signed_url(UUID, CHAR(64)) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_request_media_signed_url(UUID, CHAR(64)) TO authenticated;

REVOKE EXECUTE ON FUNCTION app.rpc_generate_media_signed_url(UUID, CHAR(64)) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION app.rpc_generate_media_signed_url(UUID, CHAR(64)) TO authenticated;
