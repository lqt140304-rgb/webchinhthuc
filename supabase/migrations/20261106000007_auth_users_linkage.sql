-- ==============================================================================
-- PHASE 4B MIGRATION 07: AUTH USERS LINKAGE & LAZY CREATION
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section VII.5.A, Gate 3)
-- Invariants Enforced: D-19 (Lazy Creation), U-6 (PII Masking), V-1 (Server auth.uid() Only)
-- ==============================================================================

-- 1. Trigger Function: Tự động khởi tạo app.users khi có tài khoản mới trong auth.users
CREATE OR REPLACE FUNCTION app.on_auth_user_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_customer_id UUID;
    v_phone TEXT;
BEGIN
    v_phone := NEW.phone;

    -- 1. Tạo bản ghi người dùng ứng dụng trong app.users (Định danh Auth)
    INSERT INTO app.users (id, phone_number, full_name, is_active)
    VALUES (
        NEW.id,
        CASE WHEN v_phone IS NOT NULL AND v_phone <> '' THEN SUBSTRING(v_phone FROM 1 FOR 15) ELSE NULL END,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Khách hàng mới'),
        TRUE
    )
    ON CONFLICT (id) DO UPDATE
    SET phone_number = COALESCE(EXCLUDED.phone_number, app.users.phone_number),
        full_name = CASE WHEN app.users.full_name = 'Khách hàng mới' THEN EXCLUDED.full_name ELSE app.users.full_name END,
        updated_at = CLOCK_TIMESTAMP();

    -- 2. D-19 Lazy Creation: Đối với người dùng đăng ký qua Email/Google OAuth (chưa có SĐT):
    -- Hệ thống TUYỆT ĐỐI KHÔNG tạo bản ghi khách hàng rác hay liên kết rác.
    -- Chỉ khi người dùng đăng ký trực tiếp bằng Số điện thoại (SMS OTP) mới tạo hồ sơ sơ bộ:
    IF v_phone IS NOT NULL AND v_phone <> '' THEN
        INSERT INTO app.customers (
            full_name,
            phone_number,
            email,
            is_active
        )
        VALUES (
            COALESCE(NEW.raw_user_meta_data->>'full_name', 'Khách hàng mới'),
            SUBSTRING(v_phone FROM 1 FOR 15),
            NEW.email,
            TRUE
        )
        RETURNING id INTO v_customer_id;

        -- Tạo liên kết trạng thái chờ duyệt (pending)
        INSERT INTO app.customer_user_links (
            customer_id,
            user_id,
            link_status
        )
        VALUES (
            v_customer_id,
            NEW.id,
            'pending'
        );
    END IF;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- T-6 & U-6 FIX: Bắt toàn bộ lỗi ngoại lệ để KHÔNG gián đoạn Auth, MASK PII
    BEGIN
        INSERT INTO audit.audit_logs (
            table_name,
            record_id,
            action,
            new_data,
            changed_by,
            changed_at
        )
        VALUES (
            'users',
            NEW.id,
            'SECURITY_VIOLATION',
            jsonb_build_object(
                'error', SQLERRM,
                'event', 'AUTH_TRIGGER_EXCEPTION',
                'phone_masked', CASE WHEN NEW.phone IS NOT NULL THEN SUBSTRING(NEW.phone FROM 1 FOR 3) || '***' || RIGHT(NEW.phone, 3) ELSE NULL END,
                'email_domain', CASE WHEN NEW.email IS NOT NULL THEN split_part(NEW.email, '@', 2) ELSE NULL END
            ),
            NEW.id,
            CLOCK_TIMESTAMP()
        );
    EXCEPTION WHEN OTHERS THEN
        -- Fail-safe chống đứt gãy Auth
        NULL;
    END;
    RETURN NEW;
END;
$$;

-- Gắn Trigger vào bảng auth.users của Supabase
DROP TRIGGER IF EXISTS on_auth_user_created_trg ON auth.users;
CREATE TRIGGER on_auth_user_created_trg
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION app.on_auth_user_created();

-- 2. U-6 & V-1 FIX: Hàm Helper Đảm Bảo Bản Ghi app.users Luôn Tồn Tại (Server-Side Only via auth.uid())
CREATE OR REPLACE FUNCTION app.rpc_ensure_app_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_auth_user RECORD;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Người dùng chưa đăng nhập.';
    END IF;

    -- Kiểm tra nếu bản ghi app.users đã tồn tại
    IF EXISTS (SELECT 1 FROM app.users WHERE id = v_user_id) THEN
        RETURN TRUE;
    END IF;

    -- Nếu thiếu (do trigger trước đó bị lỗi hoặc delay), tự động bù từ auth.users cho chính session người dùng
    SELECT id, phone, raw_user_meta_data INTO v_auth_user FROM auth.users WHERE id = v_user_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'AUTH_USER_NOT_FOUND: Không tìm thấy tài khoản auth #%.', v_user_id;
    END IF;

    INSERT INTO app.users (id, phone_number, full_name, is_active)
    VALUES (
        v_auth_user.id,
        CASE WHEN v_auth_user.phone IS NOT NULL AND v_auth_user.phone <> '' THEN SUBSTRING(v_auth_user.phone FROM 1 FOR 15) ELSE NULL END,
        COALESCE(v_auth_user.raw_user_meta_data->>'full_name', 'Khách hàng'),
        TRUE
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN TRUE;
END;
$$;

-- 3. Wrapper Schema Public cho Client PostgREST
CREATE OR REPLACE FUNCTION public.rpc_ensure_app_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_ensure_app_user();
$$;

REVOKE ALL ON FUNCTION public.rpc_ensure_app_user() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_ensure_app_user() TO authenticated;
