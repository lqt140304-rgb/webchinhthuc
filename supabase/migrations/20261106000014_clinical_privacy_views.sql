-- ==============================================================================
-- PHASE 4B MIGRATION 14: CLINICAL PRIVACY VIEWS & CUSTOMER ACCESS GATES (GATE 5)
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section VI.1, D-12, D-20, SEC-10, Gate 5)
-- Invariants Enforced:
--   - SEC-10, D-12: Khách hàng chỉ xem bản tin được duyệt; tuyệt đối không xem đơn thuốc,
--     liều lượng, thời gian tiêm, lịch tiêm hoặc y lệnh nội bộ.
--   - Security Barrier Views: Phòng chống tối đa các lỗ hổng rò rỉ dữ liệu qua optimizer hints.
--   - D-20: Cấp quyền truy cập Media lưu viện qua chữ ký có thời hạn 15 phút (900s).
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. View Xem Bản Tin Sức Khỏe Cho Khách Hàng (Customer Medical Bulletins View)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.customer_bulletins_view
WITH (security_barrier = true) AS
SELECT 
    b.id,
    b.pet_id,
    p.pet_name,
    b.bulletin_title,
    b.bulletin_content,
    b.published_at,
    b.created_at
FROM app.pet_medical_bulletins b
JOIN app.pets p ON p.id = b.pet_id
WHERE b.status = 'published'
  AND app.owns_pet(b.pet_id);

GRANT SELECT ON public.customer_bulletins_view TO authenticated;

-- ------------------------------------------------------------------------------
-- 2. View Xem Danh Sách Thú Cưng Cho Khách Hàng (Customer Pets View)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.customer_pets_view
WITH (security_barrier = true) AS
SELECT 
    p.id,
    p.pet_name,
    p.species,
    p.breed,
    p.gender,
    p.date_of_birth,
    p.created_at
FROM app.pets p
WHERE app.owns_pet(p.id)
  AND p.is_deceased = FALSE;

GRANT SELECT ON public.customer_pets_view TO authenticated;

-- ------------------------------------------------------------------------------
-- 3. RPC Truy Vấn Bản Tin Y Tế Của Thú Cưng (Customer Portal Safe Function)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION app.rpc_get_pet_medical_bulletins(p_pet_id UUID)
RETURNS TABLE (
    bulletin_id UUID,
    pet_id UUID,
    bulletin_title VARCHAR(200),
    bulletin_content TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Khách hàng chỉ xem được thú cưng của chính mình (IDOR Prevention)
    IF NOT (app.owns_pet(p_pet_id) OR app.is_staff(auth.uid())) THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Bạn không sở hữu thú cưng này.'
            USING ERRCODE = '42501';
    END IF;

    -- Nếu là khách hàng -> CHỈ trả về bản tin đã phát hành (published)
    -- Tuyệt đối không trả về y lệnh, thuốc, liều tiêm (SEC-10, D-12)
    IF NOT app.is_staff(auth.uid()) THEN
        RETURN QUERY
        SELECT 
            b.id,
            b.pet_id,
            b.bulletin_title,
            b.bulletin_content,
            b.published_at,
            b.created_at
        FROM app.pet_medical_bulletins b
        WHERE b.pet_id = p_pet_id
          AND b.status = 'published'
        ORDER BY b.published_at DESC NULLS LAST;
    ELSE
        -- Nhân viên y tế có thể xem tất cả trạng thái bản tin của thú cưng
        RETURN QUERY
        SELECT 
            b.id,
            b.pet_id,
            b.bulletin_title,
            b.bulletin_content,
            b.published_at,
            b.created_at
        FROM app.pet_medical_bulletins b
        WHERE b.pet_id = p_pet_id
        ORDER BY b.created_at DESC;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_get_pet_medical_bulletins(p_pet_id UUID)
RETURNS TABLE (
    bulletin_id UUID,
    pet_id UUID,
    bulletin_title VARCHAR(200),
    bulletin_content TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT * FROM app.rpc_get_pet_medical_bulletins(p_pet_id);
$$;

REVOKE ALL ON FUNCTION app.rpc_get_pet_medical_bulletins(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_get_pet_medical_bulletins(UUID) TO authenticated;

-- ------------------------------------------------------------------------------
-- 4. RPC Yêu Cầu URL Ký Cho Media Lưu Viện (TTL 15 Phút - SEC-13, D-20)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION app.rpc_request_media_signed_url(p_media_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_media RECORD;
    v_is_staff BOOLEAN;
    v_owns_pet BOOLEAN := FALSE;
    v_signed_token TEXT;
    v_expires_in INT := 900; -- 15 phút (theo chuẩn D-20)
BEGIN
    SELECT m.*, b.status AS bulletin_status, b.pet_id
    INTO v_media
    FROM app.inpatient_daily_media m
    LEFT JOIN app.pet_medical_bulletins b ON b.id = m.bulletin_id
    WHERE m.id = p_media_id;

    IF v_media.id IS NULL THEN
        RAISE EXCEPTION 'MEDIA_NOT_FOUND: Không tìm thấy tệp phương tiện.'
            USING ERRCODE = 'P0002';
    END IF;

    v_is_staff := app.is_staff(auth.uid());

    IF v_media.pet_id IS NOT NULL THEN
        v_owns_pet := app.owns_pet(v_media.pet_id);
    END IF;

    -- Kiểm tra quyền: Nhân viên trong viện HOẶC Khách hàng sở hữu thú cưng khi media đã được duyệt và bản tin đã publish
    IF NOT (v_is_staff OR (v_owns_pet AND v_media.is_approved_for_customer = TRUE AND v_media.bulletin_status = 'published')) THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Không có quyền truy cập tệp phương tiện này.'
            USING ERRCODE = '42501';
    END IF;

    -- Giả lập ký token thời hạn 900s (Production dùng Supabase Storage Sign API)
    v_signed_token := encode(digest(p_media_id::text || auth.uid()::text || clock_timestamp()::text, 'sha256'), 'hex');

    RETURN jsonb_build_object(
        'media_id', p_media_id,
        'storage_path', v_media.storage_path,
        'signed_url', '/storage/v1/object/sign/inpatient-media/' || v_media.storage_path || '?token=' || v_signed_token,
        'expires_in_seconds', v_expires_in,
        'expires_at', CLOCK_TIMESTAMP() + (v_expires_in || ' seconds')::INTERVAL
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_request_media_signed_url(p_media_id UUID)
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_request_media_signed_url(p_media_id);
$$;

REVOKE ALL ON FUNCTION app.rpc_request_media_signed_url(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_request_media_signed_url(UUID) TO authenticated;
