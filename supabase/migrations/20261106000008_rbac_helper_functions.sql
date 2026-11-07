-- ==============================================================================
-- PHASE 4B MIGRATION 08: RBAC & SHIFT VERIFICATION HELPER FUNCTIONS
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section I.2, VI.4, Gate 3)
-- Invariants Enforced: S-11 (Admin Shift Override with Audit), SEC-02, SEC-03
-- ==============================================================================

-- 1. Helper kiểm tra Quản trị viên (Admin)
CREATE OR REPLACE FUNCTION app.is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF p_user_id IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM app.staff_role_assignments
        WHERE user_id = p_user_id
          AND role = 'admin'
          AND is_active = TRUE
    );
END;
$$;

-- 2. Helper kiểm tra Nhân viên hợp lệ (Staff of any role)
CREATE OR REPLACE FUNCTION app.is_staff(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF p_user_id IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM app.staff_role_assignments
        WHERE user_id = p_user_id
          AND is_active = TRUE
    );
END;
$$;

-- 3. Helper kiểm tra Vai trò cụ thể (Specific Role or Admin)
CREATE OR REPLACE FUNCTION app.has_role(p_required_role VARCHAR(30), p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF p_user_id IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM app.staff_role_assignments
        WHERE user_id = p_user_id
          AND (role = p_required_role OR role = 'admin')
          AND is_active = TRUE
    );
END;
$$;

-- 4. S-11 FIX: Kiểm tra ca trực hoạt động thực tế kèm cơ chế Admin Override có ghi log
CREATE OR REPLACE FUNCTION app.check_active_shift(
    p_user_id UUID,
    p_required_role VARCHAR(30)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_has_active_shift BOOLEAN := FALSE;
    v_is_admin BOOLEAN := FALSE;
    v_now_vn TIMESTAMP := (CLOCK_TIMESTAMP() AT TIME ZONE 'Asia/Ho_Chi_Minh');
    v_current_time TIME := v_now_vn::TIME;
    v_current_date DATE := v_now_vn::DATE;
BEGIN
    IF p_user_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- 1. Kiểm tra vai trò nhân viên hợp lệ
    IF NOT EXISTS (
        SELECT 1 FROM app.staff_role_assignments sra
        WHERE sra.user_id = p_user_id 
          AND (sra.role = p_required_role OR sra.role = 'admin')
          AND sra.is_active = TRUE
    ) THEN
        RETURN FALSE;
    END IF;

    -- 2. Kiểm tra xem nhân viên có đang trong ca trực phân công thực tế hay không
    SELECT EXISTS (
        SELECT 1 
        FROM app.shift_assignments sa
        JOIN app.shifts s ON s.id = sa.shift_id
        WHERE sa.user_id = p_user_id
          AND sa.is_active = TRUE
          AND (
              -- Ca trực ban ngày (VD: 08:00 đến 17:00)
              (s.start_time <= s.end_time AND sa.work_date = v_current_date AND v_current_time BETWEEN s.start_time AND s.end_time)
              OR
              -- Ca trực qua đêm (VD: 21:00 hôm nay đến 08:00 sáng hôm sau)
              (s.start_time > s.end_time AND (
                  (sa.work_date = v_current_date AND v_current_time >= s.start_time)
                  OR
                  (sa.work_date = v_current_date - INTERVAL '1 day' AND v_current_time <= s.end_time)
              ))
          )
    ) INTO v_has_active_shift;

    -- Nếu đang trong ca trực hợp lệ -> Cho phép thực thi ngay, không ghi log override
    IF v_has_active_shift THEN
        RETURN TRUE;
    END IF;

    -- 3. S-11 FIX: Nếu không trong ca trực nhưng là Quản trị viên (Admin) -> Cho phép vượt ca kèm ghi log Audit
    SELECT EXISTS (
        SELECT 1 FROM app.staff_role_assignments sra
        WHERE sra.user_id = p_user_id 
          AND sra.role = 'admin' 
          AND sra.is_active = TRUE
    ) INTO v_is_admin;
    
    IF v_is_admin THEN
        INSERT INTO audit.audit_logs (
            table_name,
            record_id,
            action,
            new_data,
            changed_by,
            changed_at
        )
        VALUES (
            'shifts',
            p_user_id,
            'SECURITY_VIOLATION',
            jsonb_build_object(
                'event', 'OFF_SHIFT_ADMIN_ACCESS',
                'required_role', p_required_role,
                'duty_context', 'off_shift_admin_override',
                'timestamp_vn', v_now_vn
            ),
            p_user_id,
            CLOCK_TIMESTAMP()
        );
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$;

-- 5. Helper xác định Customer ID của người dùng Portal
CREATE OR REPLACE FUNCTION app.get_customer_id_for_user(p_user_id UUID DEFAULT auth.uid())
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_customer_id UUID;
BEGIN
    IF p_user_id IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT customer_id INTO v_customer_id
    FROM app.customer_user_links
    WHERE user_id = p_user_id
      AND link_status IN ('approved', 'pending')
    ORDER BY (link_status = 'approved') DESC, created_at DESC
    LIMIT 1;

    RETURN v_customer_id;
END;
$$;

-- 6. Helper kiểm tra quyền sở hữu Thú cưng
CREATE OR REPLACE FUNCTION app.owns_pet(p_pet_id UUID, p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF p_user_id IS NULL OR p_pet_id IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN EXISTS (
        SELECT 1 
        FROM app.pets p
        JOIN app.customer_user_links cul ON cul.customer_id = p.customer_id
        WHERE p.id = p_pet_id
          AND cul.user_id = p_user_id
          AND cul.link_status IN ('approved', 'pending')
    );
END;
$$;

-- Phân quyền thực thi: Chỉ cấp cho authenticated, cấm tuyệt đối anon / PUBLIC
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA app FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION app.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION app.is_staff(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION app.has_role(VARCHAR, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION app.check_active_shift(UUID, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION app.get_customer_id_for_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION app.owns_pet(UUID, UUID) TO authenticated;
