-- ==============================================================================
-- MIGRATION: 20261106000019_byod_device_sessions_rpcs.sql
-- Project: Bệnh viện Thú y Lê Sơn
-- Phase 4B: Stage 8 - BYOD Device Management & Security Layer 3 & 4 (D-20, SEC-18, SEC-19)
-- Invariants Enforced:
--   - D-20 Layer 3: staff_device_sessions is_trusted DEFAULT FALSE (Pending approval)
--   - SEC-18: Non-trusted or unapproved devices strictly blocked from media submission
--   - SEC-19 / V-1: Remote revoke requires Admin with active shift + AAL2
--   - Layer 4: Client zeroize hook confirmation via rpc_confirm_device_wipe
-- ==============================================================================

-- 1. Tiến hóa cấu trúc bảng app.staff_device_sessions
ALTER TABLE app.staff_device_sessions 
    ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'pending_approval' 
        CHECK (status IN ('pending_approval', 'active', 'revoked', 'expired')),
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ NOT NULL DEFAULT (CLOCK_TIMESTAMP() + INTERVAL '30 days'),
    ADD COLUMN IF NOT EXISTS revocation_reason TEXT NULL;

-- 2. Chỉ mục tối ưu hóa tra cứu phiên hoạt động hợp lệ
CREATE INDEX IF NOT EXISTS idx_staff_device_sessions_lookup 
    ON app.staff_device_sessions(staff_id, is_trusted, status) 
    WHERE revoked_at IS NULL;

-- 3. RPC Đăng Ký Thiết Bị BYOD Mới (Device Registration - D-20 Layer 3)
CREATE OR REPLACE FUNCTION app.rpc_register_staff_device(
    p_device_fingerprint_hash CHAR(64),
    p_device_name VARCHAR(100),
    p_user_agent TEXT,
    p_ip_address INET
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_staff_id UUID := auth.uid();
    v_session_id UUID;
    v_existing RECORD;
BEGIN
    IF v_staff_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Người dùng chưa đăng nhập'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra nhân viên có tồn tại và đang hoạt động
    IF NOT EXISTS (SELECT 1 FROM app.users WHERE id = v_staff_id AND is_active = TRUE) THEN
        RAISE EXCEPTION 'FORBIDDEN: Tài khoản nhân viên không hoạt động hoặc không tồn tại'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra thiết bị đã từng đăng ký chưa
    SELECT * INTO v_existing 
    FROM app.staff_device_sessions 
    WHERE staff_id = v_staff_id AND device_fingerprint_hash = p_device_fingerprint_hash;

    IF FOUND THEN
        IF v_existing.is_revoked OR v_existing.status = 'revoked' THEN
            RAISE EXCEPTION 'DEVICE_PREVIOUSLY_REVOKED: Thiết bị này đã bị thu hồi quyền truy cập, vui lòng liên hệ Admin'
                USING ERRCODE = 'P0001';
        END IF;

        -- Cập nhật thông tin phiên và gia hạn
        UPDATE app.staff_device_sessions
        SET device_name = p_device_name,
            user_agent = p_user_agent,
            ip_address = p_ip_address,
            last_active_at = CLOCK_TIMESTAMP(),
            expires_at = CLOCK_TIMESTAMP() + INTERVAL '30 days'
        WHERE id = v_existing.id
        RETURNING id INTO v_session_id;

        RETURN v_session_id;
    END IF;

    -- Đăng ký thiết bị mới: Mặc định is_trusted = FALSE, status = 'pending_approval' (D-20 Layer 3)
    INSERT INTO app.staff_device_sessions (
        staff_id,
        device_fingerprint_hash,
        device_name,
        user_agent,
        ip_address,
        is_trusted,
        status,
        expires_at
    ) VALUES (
        v_staff_id,
        p_device_fingerprint_hash,
        p_device_name,
        p_user_agent,
        p_ip_address,
        FALSE,
        'pending_approval',
        CLOCK_TIMESTAMP() + INTERVAL '30 days'
    ) RETURNING id INTO v_session_id;

    -- Ghi nhật ký kiểm toán bất biến
    INSERT INTO audit.audit_logs (table_name, record_id, action, new_data, changed_by)
    VALUES (
        'staff_device_sessions',
        v_session_id,
        'INSERT',
        jsonb_build_object(
            'event', 'DEVICE_REGISTERED',
            'device_name', p_device_name,
            'fingerprint', p_device_fingerprint_hash,
            'status', 'pending_approval',
            'is_trusted', FALSE
        ),
        v_staff_id
    );

    RETURN v_session_id;
END;
$$;

-- 4. RPC Phê Duyệt Thiết Bị BYOD (Admin AAL2 Approval - SEC-18)
CREATE OR REPLACE FUNCTION app.rpc_approve_staff_device(
    p_session_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
BEGIN
    -- Kiểm tra quyền Admin có ca trực hiệu lực
    IF NOT app.check_active_shift(v_admin_id, 'admin') THEN
        RAISE EXCEPTION 'ROLE_UNAUTHORIZED: Chỉ Quản trị viên trong ca trực hiệu lực mới có quyền phê duyệt thiết bị'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra cấp độ xác thực AAL2 (MFA)
    IF (auth.jwt()->>'aal') IS DISTINCT FROM 'aal2' THEN
        RAISE EXCEPTION 'MFA_REQUIRED: Thao tác phê duyệt thiết bị yêu cầu xác thực hai bước AAL2'
            USING ERRCODE = 'P0001';
    END IF;

    UPDATE app.staff_device_sessions
    SET is_trusted = TRUE,
        status = 'active',
        approved_by = v_admin_id,
        approved_at = CLOCK_TIMESTAMP(),
        last_active_at = CLOCK_TIMESTAMP()
    WHERE id = p_session_id AND status = 'pending_approval' AND is_revoked = FALSE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SESSION_NOT_FOUND_OR_INVALID: Phiên thiết bị không tồn tại hoặc không ở trạng thái chờ duyệt'
            USING ERRCODE = 'P0001';
    END IF;

    -- Ghi nhật ký kiểm toán bất biến
    INSERT INTO audit.audit_logs (table_name, record_id, action, new_data, changed_by)
    VALUES (
        'staff_device_sessions',
        p_session_id,
        'UPDATE',
        jsonb_build_object('event', 'DEVICE_APPROVED', 'approved_by', v_admin_id, 'approved_at', CLOCK_TIMESTAMP()),
        v_admin_id
    );

    RETURN TRUE;
END;
$$;

-- 5. RPC Thu Hồi Quyền Truy Cập Thiết Bị BYOD (Remote Revoke - SEC-19 / V-1)
CREATE OR REPLACE FUNCTION app.rpc_revoke_staff_device(
    p_session_id UUID,
    p_reason TEXT DEFAULT 'Offboarding or Device Reported Lost'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
BEGIN
    -- Kiểm tra quyền Admin trong ca trực
    IF NOT app.check_active_shift(v_admin_id, 'admin') THEN
        RAISE EXCEPTION 'ROLE_UNAUTHORIZED: Chỉ Quản trị viên trong ca trực hiệu lực mới có quyền thu hồi thiết bị'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra AAL2
    IF (auth.jwt()->>'aal') IS DISTINCT FROM 'aal2' THEN
        RAISE EXCEPTION 'MFA_REQUIRED: Thao tác thu hồi thiết bị yêu cầu xác thực hai bước AAL2'
            USING ERRCODE = 'P0001';
    END IF;

    UPDATE app.staff_device_sessions
    SET is_trusted = FALSE,
        status = 'revoked',
        is_revoked = TRUE,
        revoked_by = v_admin_id,
        revoked_at = CLOCK_TIMESTAMP(),
        revocation_reason = p_reason,
        wipe_requested = TRUE
    WHERE id = p_session_id AND is_revoked = FALSE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SESSION_NOT_FOUND_OR_ALREADY_REVOKED: Phiên thiết bị không tồn tại hoặc đã bị thu hồi trước đó'
            USING ERRCODE = 'P0001';
    END IF;

    -- Ghi nhật ký kiểm toán bất biến
    INSERT INTO audit.audit_logs (table_name, record_id, action, new_data, changed_by)
    VALUES (
        'staff_device_sessions',
        p_session_id,
        'UPDATE',
        jsonb_build_object(
            'event', 'DEVICE_SESSION_REVOKED',
            'revoked_by', v_admin_id,
            'reason', p_reason,
            'revoked_at', CLOCK_TIMESTAMP(),
            'wipe_requested', TRUE
        ),
        v_admin_id
    );

    RETURN TRUE;
END;
$$;

-- 6. RPC Xác Minh Thiết Bị Trước Khi Thao Tác (Device Verification Guard - SEC-18, SEC-19)
CREATE OR REPLACE FUNCTION app.rpc_verify_staff_device(
    p_device_fingerprint_hash CHAR(64)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_staff_id UUID := auth.uid();
    v_session RECORD;
BEGIN
    IF v_staff_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Người dùng chưa đăng nhập'
            USING ERRCODE = 'P0001';
    END IF;

    SELECT * INTO v_session
    FROM app.staff_device_sessions
    WHERE staff_id = v_staff_id AND device_fingerprint_hash = p_device_fingerprint_hash;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'DEVICE_NOT_REGISTERED: Thiết bị chưa được đăng ký trong hệ thống'
            USING ERRCODE = 'P0001';
    END IF;

    IF v_session.is_revoked OR v_session.status = 'revoked' THEN
        RAISE EXCEPTION 'DEVICE_REVOKED: Thiết bị đã bị thu hồi quyền truy cập (HTTP 403)'
            USING ERRCODE = 'P0001';
    END IF;

    IF NOT v_session.is_trusted OR v_session.status <> 'active' THEN
        RAISE EXCEPTION 'DEVICE_NOT_TRUSTED: Thiết bị chưa được Quản trị viên phê duyệt tin cậy (HTTP 403)'
            USING ERRCODE = 'P0001';
    END IF;

    IF v_session.expires_at < CLOCK_TIMESTAMP() THEN
        RAISE EXCEPTION 'SESSION_EXPIRED: Phiên làm việc của thiết bị đã hết hạn (HTTP 401)'
            USING ERRCODE = 'P0001';
    END IF;

    -- Cập nhật thời điểm hoạt động gần nhất
    UPDATE app.staff_device_sessions
    SET last_active_at = CLOCK_TIMESTAMP()
    WHERE id = v_session.id;

    RETURN TRUE;
END;
$$;

-- 7. RPC Xác Nhận Hoàn Tất Zeroization / Remote Wipe Trên Thiết Bị (Layer 4)
CREATE OR REPLACE FUNCTION app.rpc_confirm_device_wipe(
    p_session_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_caller_id UUID := auth.uid();
BEGIN
    UPDATE app.staff_device_sessions
    SET wipe_completed_at = CLOCK_TIMESTAMP()
    WHERE id = p_session_id AND wipe_requested = TRUE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'WIPE_REQUEST_NOT_FOUND: Phiên thiết bị không có yêu cầu xóa dữ liệu đang chờ'
            USING ERRCODE = 'P0001';
    END IF;

    INSERT INTO audit.audit_logs (table_name, record_id, action, new_data, changed_by)
    VALUES (
        'staff_device_sessions',
        p_session_id,
        'UPDATE',
        jsonb_build_object('event', 'DEVICE_WIPE_COMPLETED', 'wipe_completed_at', CLOCK_TIMESTAMP()),
        v_caller_id
    );

    RETURN TRUE;
END;
$$;

-- Cấp quyền thực thi các RPC cho authenticated
GRANT EXECUTE ON FUNCTION app.rpc_register_staff_device(CHAR(64), VARCHAR(100), TEXT, INET) TO authenticated;
GRANT EXECUTE ON FUNCTION app.rpc_approve_staff_device(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION app.rpc_revoke_staff_device(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION app.rpc_verify_staff_device(CHAR(64)) TO authenticated;
GRANT EXECUTE ON FUNCTION app.rpc_confirm_device_wipe(UUID) TO authenticated;
