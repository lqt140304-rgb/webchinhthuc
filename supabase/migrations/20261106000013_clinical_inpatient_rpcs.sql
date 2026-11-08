-- ==============================================================================
-- PHASE 4B MIGRATION 13: CLINICAL & INPATIENT MANAGEMENT RPCS (GATE 5)
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section VI.1, VII.3, Gate 5)
-- Invariants Enforced: 
--   - S-11: Admin Off-shift Override FAIL-CLOSED by default (PENDING OWNER APPROVAL)
--   - SEC-10, D-12: Total Privacy - Never expose prescriptions/orders to customer
--   - SEC-11: Clinical Record 24h Lock & Amendment requirement
--   - D-07, SEC-12: Two-Man Rule on Medical Bulletins (approver <> creator)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Bảng Cấu Hình Hệ Thống & S-11 Fail-Closed Feature Flag
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app.system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description TEXT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- Khóa quyền bảo vệ system_settings & Kích hoạt RLS
REVOKE ALL ON TABLE app.system_settings FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE app.system_settings TO postgres, service_role;
ALTER TABLE app.system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rls_system_settings_admin ON app.system_settings;
CREATE POLICY rls_system_settings_admin ON app.system_settings
    FOR ALL TO authenticated
    USING (app.is_admin())
    WITH CHECK (app.is_admin());

-- Khởi tạo cờ S-11 ở trạng thái FAIL-CLOSED (mặc định 'false' - PENDING OWNER APPROVAL)
INSERT INTO app.system_settings (setting_key, setting_value, description)
VALUES (
    'allow_admin_off_shift_override',
    'false',
    'Controls whether administrators can bypass active shift checks (PENDING OWNER APPROVAL, FAIL-CLOSED BY DEFAULT)'
)
ON CONFLICT (setting_key) DO UPDATE 
SET setting_value = 'false',
    description = EXCLUDED.description,
    updated_at = CLOCK_TIMESTAMP();

-- ------------------------------------------------------------------------------
-- 2. Cập Nhật Hàm app.check_active_shift: Triệt để Fail-Closed nếu chưa bật flag
-- ------------------------------------------------------------------------------
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
    v_override_enabled BOOLEAN := FALSE;
    v_now_vn TIMESTAMP := (CLOCK_TIMESTAMP() AT TIME ZONE 'Asia/Ho_Chi_Minh');
    v_current_time TIME := v_now_vn::TIME;
    v_current_date DATE := v_now_vn::DATE;
BEGIN
    IF p_user_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- 1. Kiểm tra vai trò nhân viên hợp lệ (hỗ trợ cả alias 'doctor' và 'veterinarian')
    IF NOT EXISTS (
        SELECT 1 FROM app.staff_role_assignments sra
        WHERE sra.user_id = p_user_id 
          AND (
              sra.role = p_required_role 
              OR sra.role = 'admin'
              OR (p_required_role = 'doctor' AND sra.role = 'veterinarian')
              OR (p_required_role = 'veterinarian' AND sra.role = 'doctor')
          )
          AND sra.is_active = TRUE
    ) THEN
        RETURN FALSE;
    END IF;

    -- 2. Kiểm tra ca trực phân công thực tế (Active Shift)
    SELECT EXISTS (
        SELECT 1 
        FROM app.shift_assignments sa
        JOIN app.shifts s ON s.id = sa.shift_id
        WHERE sa.user_id = p_user_id
          AND sa.is_active = TRUE
          AND (
              -- Ca trực trong ngày
              (s.start_time <= s.end_time AND sa.work_date = v_current_date AND v_current_time BETWEEN s.start_time AND s.end_time)
              OR
              -- Ca trực qua đêm
              (s.start_time > s.end_time AND (
                  (sa.work_date = v_current_date AND v_current_time >= s.start_time)
                  OR
                  (sa.work_date = v_current_date - INTERVAL '1 day' AND v_current_time <= s.end_time)
              ))
          )
    ) INTO v_has_active_shift;

    -- Nếu đang trong ca trực hợp lệ -> Cho phép thực thi ngay
    IF v_has_active_shift THEN
        RETURN TRUE;
    END IF;

    -- 3. S-11 FAIL-CLOSED CHECK (PENDING OWNER APPROVAL)
    -- Nếu ngoài ca trực, kiểm tra quyền admin kèm feature flag trong system_settings
    SELECT EXISTS (
        SELECT 1 FROM app.staff_role_assignments sra
        WHERE sra.user_id = p_user_id 
          AND sra.role = 'admin' 
          AND sra.is_active = TRUE
    ) INTO v_is_admin;
    
    IF v_is_admin THEN
        SELECT (setting_value = 'true') INTO v_override_enabled
        FROM app.system_settings
        WHERE setting_key = 'allow_admin_off_shift_override';

        IF COALESCE(v_override_enabled, FALSE) = TRUE THEN
            -- Được kích hoạt rõ ràng -> Ghi log audit an ninh đặc biệt và cho phép
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
        ELSE
            -- FAIL-CLOSED: Mặc định từ chối khi flag không bật
            RETURN FALSE;
        END IF;
    END IF;

    RETURN FALSE;
END;
$$;

-- ------------------------------------------------------------------------------
-- 3. Trigger Bảo Vệ Bệnh Án Đã Khóa (SEC-11: Clinical Record Lock & 24h Expiry)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION app.fn_enforce_clinical_record_lock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Nếu bệnh án đã có cờ is_locked = TRUE hoặc đã tạo quá 24 giờ
    IF (OLD.is_locked = TRUE OR (CLOCK_TIMESTAMP() - OLD.created_at > INTERVAL '24 hours')) THEN
        -- Ngoại lệ duy nhất: thao tác khóa bệnh án lần đầu (OLD.is_locked = FALSE -> NEW.is_locked = TRUE)
        IF NOT (OLD.is_locked = FALSE AND NEW.is_locked = TRUE) THEN
            RAISE EXCEPTION 'RECORD_LOCKED_AMENDMENT_REQUIRED: Bệnh án đã bị khóa (hoặc quá thời hạn 24 giờ). Mọi bổ sung phải thực hiện qua Tu chính án (app.clinical_amendments).'
                USING ERRCODE = 'P0001';
        END IF;
    END IF;

    NEW.updated_at := CLOCK_TIMESTAMP();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_clinical_record_lock ON app.clinical_records;
CREATE TRIGGER trg_enforce_clinical_record_lock
BEFORE UPDATE ON app.clinical_records
FOR EACH ROW EXECUTE FUNCTION app.fn_enforce_clinical_record_lock();

-- ------------------------------------------------------------------------------
-- 4. RPC Nghiệp Vụ Khám Bệnh & Bệnh Án Lâm Sàng
-- ------------------------------------------------------------------------------

-- 4.1. Tạo bệnh án lâm sàng (Bác sĩ trong ca trực)
CREATE OR REPLACE FUNCTION app.rpc_create_clinical_record(
    p_pet_id UUID,
    p_chief_complaint TEXT,
    p_clinical_notes TEXT DEFAULT NULL,
    p_weight_kg NUMERIC DEFAULT NULL,
    p_temperature_c NUMERIC DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_record_id UUID;
BEGIN
    -- Kiểm tra bác sĩ trong ca trực
    IF NOT app.check_active_shift(auth.uid(), 'doctor') THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Thao tác tạo bệnh án yêu cầu Bác sĩ đang trong ca trực hoạt động.'
            USING ERRCODE = '42501';
    END IF;

    -- Kiểm tra thú cưng tồn tại
    IF NOT EXISTS (SELECT 1 FROM app.pets WHERE id = p_pet_id) THEN
        RAISE EXCEPTION 'PET_NOT_FOUND: Không tìm thấy hồ sơ thú cưng.'
            USING ERRCODE = 'P0002';
    END IF;

    INSERT INTO app.clinical_records (
        pet_id,
        veterinarian_id,
        chief_complaint,
        clinical_notes,
        weight_kg,
        temperature_c,
        is_locked,
        created_at,
        updated_at
    )
    VALUES (
        p_pet_id,
        auth.uid(),
        p_chief_complaint,
        p_clinical_notes,
        p_weight_kg,
        p_temperature_c,
        FALSE,
        CLOCK_TIMESTAMP(),
        CLOCK_TIMESTAMP()
    )
    RETURNING id INTO v_record_id;

    RETURN v_record_id;
END;
$$;

-- 4.2. Khóa bệnh án lâm sàng
CREATE OR REPLACE FUNCTION app.rpc_lock_clinical_record(
    p_record_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NOT app.check_active_shift(auth.uid(), 'doctor') THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Thao tác khóa bệnh án yêu cầu Bác sĩ đang trong ca trực hoạt động.'
            USING ERRCODE = '42501';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM app.clinical_records WHERE id = p_record_id) THEN
        RAISE EXCEPTION 'RECORD_NOT_FOUND: Bệnh án không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    UPDATE app.clinical_records
    SET is_locked = TRUE,
        locked_at = CLOCK_TIMESTAMP(),
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_record_id;

    RETURN TRUE;
END;
$$;

-- 4.3. Tạo tu chính án cho bệnh án đã khóa (Addendum)
CREATE OR REPLACE FUNCTION app.rpc_create_clinical_amendment(
    p_record_id UUID,
    p_reason TEXT,
    p_amended_data JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_amendment_id UUID;
BEGIN
    IF NOT app.check_active_shift(auth.uid(), 'doctor') THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Thao tác tu chính bệnh án yêu cầu Bác sĩ đang trong ca trực hoạt động.'
            USING ERRCODE = '42501';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM app.clinical_records WHERE id = p_record_id) THEN
        RAISE EXCEPTION 'RECORD_NOT_FOUND: Bệnh án không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    INSERT INTO app.clinical_amendments (
        record_id,
        amended_by,
        reason,
        amended_data,
        created_at
    )
    VALUES (
        p_record_id,
        auth.uid(),
        p_reason,
        p_amended_data,
        CLOCK_TIMESTAMP()
    )
    RETURNING id INTO v_amendment_id;

    -- Ghi audit log
    INSERT INTO audit.audit_logs (
        table_name,
        record_id,
        action,
        new_data,
        changed_by,
        changed_at
    )
    VALUES (
        'clinical_amendments',
        v_amendment_id,
        'INSERT',
        jsonb_build_object(
            'record_id', p_record_id,
            'reason', p_reason,
            'amended_data', p_amended_data
        ),
        auth.uid(),
        CLOCK_TIMESTAMP()
    );

    RETURN v_amendment_id;
END;
$$;

-- 4.4. Tạo y lệnh điều trị nội bộ (Bác sĩ trong ca trực, is_internal_only = TRUE)
CREATE OR REPLACE FUNCTION app.rpc_create_treatment_order(
    p_record_id UUID,
    p_order_type VARCHAR(30),
    p_description TEXT,
    p_dosage VARCHAR(100) DEFAULT NULL,
    p_route VARCHAR(50) DEFAULT NULL,
    p_frequency VARCHAR(50) DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_order_id UUID;
    v_is_locked BOOLEAN;
BEGIN
    IF NOT app.check_active_shift(auth.uid(), 'doctor') THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Thao tác tạo y lệnh yêu cầu Bác sĩ đang trong ca trực hoạt động.'
            USING ERRCODE = '42501';
    END IF;

    SELECT is_locked INTO v_is_locked
    FROM app.clinical_records
    WHERE id = p_record_id;

    IF v_is_locked IS NULL THEN
        RAISE EXCEPTION 'RECORD_NOT_FOUND: Bệnh án không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    IF v_is_locked = TRUE THEN
        RAISE EXCEPTION 'RECORD_LOCKED: Bệnh án đã bị khóa. Không thể thêm y lệnh trực tiếp.'
            USING ERRCODE = 'P0001';
    END IF;

    INSERT INTO app.treatment_orders (
        record_id,
        order_type,
        description,
        dosage,
        route,
        frequency,
        status,
        ordered_by,
        is_internal_only,
        created_at
    )
    VALUES (
        p_record_id,
        p_order_type,
        p_description,
        p_dosage,
        p_route,
        p_frequency,
        'ordered',
        auth.uid(),
        TRUE, -- SEC-10, D-12: Mặc định luôn là y lệnh nội bộ
        CLOCK_TIMESTAMP()
    )
    RETURNING id INTO v_order_id;

    RETURN v_order_id;
END;
$$;

-- 4.5. Điều dưỡng thực thi / checkoff y lệnh
CREATE OR REPLACE FUNCTION app.rpc_checkoff_treatment_order(
    p_order_id UUID,
    p_execution_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NOT (app.check_active_shift(auth.uid(), 'nurse') OR app.check_active_shift(auth.uid(), 'doctor')) THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Thao tác check-off y lệnh yêu cầu Điều dưỡng hoặc Bác sĩ trong ca trực.'
            USING ERRCODE = '42501';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM app.treatment_orders WHERE id = p_order_id) THEN
        RAISE EXCEPTION 'ORDER_NOT_FOUND: Y lệnh không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    UPDATE app.treatment_orders
    SET status = 'completed',
        executed_by = auth.uid(),
        executed_at = CLOCK_TIMESTAMP()
    WHERE id = p_order_id;

    -- Ghi audit log
    INSERT INTO audit.audit_logs (
        table_name,
        record_id,
        action,
        new_data,
        changed_by,
        changed_at
    )
    VALUES (
        'treatment_orders',
        p_order_id,
        'UPDATE',
        jsonb_build_object(
            'status', 'completed',
            'notes', p_execution_notes,
            'executed_by', auth.uid()
        ),
        auth.uid(),
        CLOCK_TIMESTAMP()
    );

    RETURN TRUE;
END;
$$;

-- ------------------------------------------------------------------------------
-- 5. RPC Nghiệp Vụ Bản Tin Y Tế Lưu Viện (Pet Medical Bulletins & Two-Man Rule)
-- ------------------------------------------------------------------------------

-- 5.1. Khởi tạo bản tin y tế (Draft)
CREATE OR REPLACE FUNCTION app.rpc_create_medical_bulletin(
    p_pet_id UUID,
    p_stay_id UUID DEFAULT NULL,
    p_title VARCHAR(200) DEFAULT 'Cập nhật sức khỏe thú cưng',
    p_content TEXT DEFAULT ''
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_bulletin_id UUID;
BEGIN
    IF NOT (app.check_active_shift(auth.uid(), 'doctor') OR app.check_active_shift(auth.uid(), 'nurse')) THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Nhân viên không trong ca trực hoạt động.'
            USING ERRCODE = '42501';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM app.pets WHERE id = p_pet_id) THEN
        RAISE EXCEPTION 'PET_NOT_FOUND: Thú cưng không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    INSERT INTO app.pet_medical_bulletins (
        pet_id,
        stay_id,
        bulletin_title,
        bulletin_content,
        status,
        created_by,
        created_at,
        updated_at
    )
    VALUES (
        p_pet_id,
        p_stay_id,
        p_title,
        p_content,
        'draft',
        auth.uid(),
        CLOCK_TIMESTAMP(),
        CLOCK_TIMESTAMP()
    )
    RETURNING id INTO v_bulletin_id;

    INSERT INTO app.bulletin_approval_history (
        bulletin_id,
        action,
        actor_id,
        review_notes,
        created_at
    )
    VALUES (
        v_bulletin_id,
        'SUBMIT',
        auth.uid(),
        'Bản tin khởi tạo ở trạng thái draft',
        CLOCK_TIMESTAMP()
    );

    RETURN v_bulletin_id;
END;
$$;

-- 5.2. Gửi bản tin chờ duyệt
CREATE OR REPLACE FUNCTION app.rpc_submit_bulletin_for_review(
    p_bulletin_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NOT app.is_staff(auth.uid()) THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Yêu cầu nhân viên bệnh viện.'
            USING ERRCODE = '42501';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM app.pet_medical_bulletins WHERE id = p_bulletin_id AND status = 'draft') THEN
        RAISE EXCEPTION 'INVALID_BULLETIN_STATUS: Bản tin không ở trạng thái draft.'
            USING ERRCODE = 'P0001';
    END IF;

    UPDATE app.pet_medical_bulletins
    SET status = 'pending_approval',
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_bulletin_id;

    INSERT INTO app.bulletin_approval_history (
        bulletin_id,
        action,
        actor_id,
        review_notes,
        created_at
    )
    VALUES (
        p_bulletin_id,
        'SUBMIT',
        auth.uid(),
        'Gửi bản tin chờ duyệt',
        CLOCK_TIMESTAMP()
    );

    RETURN TRUE;
END;
$$;

-- 5.3. Phê duyệt bản tin (D-07 Two-Man Rule: approved_by <> created_by)
CREATE OR REPLACE FUNCTION app.rpc_approve_medical_bulletin(
    p_bulletin_id UUID,
    p_review_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_creator UUID;
    v_status VARCHAR(20);
BEGIN
    IF NOT app.check_active_shift(auth.uid(), 'doctor') THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Chỉ Bác sĩ hoặc Quản trị viên trong ca trực mới có quyền phê duyệt bản tin.'
            USING ERRCODE = '42501';
    END IF;

    SELECT created_by, status INTO v_creator, v_status
    FROM app.pet_medical_bulletins
    WHERE id = p_bulletin_id;

    IF v_creator IS NULL THEN
        RAISE EXCEPTION 'BULLETIN_NOT_FOUND: Bản tin không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    -- D-07 Invariant: Người tạo bản tin tuyệt đối không được tự phê duyệt
    IF v_creator = auth.uid() THEN
        RAISE EXCEPTION 'TWO_MAN_RULE_VIOLATION: Người tạo bản tin không được phép tự phê duyệt (Nguyên tắc Hai Người D-07).'
            USING ERRCODE = 'P0001';
    END IF;

    UPDATE app.pet_medical_bulletins
    SET status = 'approved',
        approved_by = auth.uid(),
        approved_at = CLOCK_TIMESTAMP(),
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_bulletin_id;

    INSERT INTO app.bulletin_approval_history (
        bulletin_id,
        action,
        actor_id,
        review_notes,
        created_at
    )
    VALUES (
        p_bulletin_id,
        'APPROVE',
        auth.uid(),
        p_review_notes,
        CLOCK_TIMESTAMP()
    );

    RETURN TRUE;
END;
$$;

-- 5.4. Phát hành bản tin tới khách hàng (Publish)
CREATE OR REPLACE FUNCTION app.rpc_publish_medical_bulletin(
    p_bulletin_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_status VARCHAR(20);
BEGIN
    IF NOT app.check_active_shift(auth.uid(), 'doctor') THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Chỉ Bác sĩ hoặc Quản trị viên trong ca trực mới có quyền phát hành bản tin.'
            USING ERRCODE = '42501';
    END IF;

    SELECT status INTO v_status
    FROM app.pet_medical_bulletins
    WHERE id = p_bulletin_id;

    IF v_status IS NULL THEN
        RAISE EXCEPTION 'BULLETIN_NOT_FOUND: Bản tin không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    IF v_status <> 'approved' THEN
        RAISE EXCEPTION 'INVALID_BULLETIN_STATUS: Bản tin phải được phê duyệt trước khi phát hành.'
            USING ERRCODE = 'P0001';
    END IF;

    UPDATE app.pet_medical_bulletins
    SET status = 'published',
        published_at = CLOCK_TIMESTAMP(),
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_bulletin_id;

    INSERT INTO app.bulletin_approval_history (
        bulletin_id,
        action,
        actor_id,
        review_notes,
        created_at
    )
    VALUES (
        p_bulletin_id,
        'PUBLISH',
        auth.uid(),
        'Phát hành bản tin tới khách hàng',
        CLOCK_TIMESTAMP()
    );

    RETURN TRUE;
END;
$$;

-- 5.5. Thu hồi bản tin y tế (Revoke)
CREATE OR REPLACE FUNCTION app.rpc_revoke_medical_bulletin(
    p_bulletin_id UUID,
    p_reason TEXT DEFAULT 'Thu hồi để kiểm tra lại thông tin'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NOT app.check_active_shift(auth.uid(), 'doctor') THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Chỉ Bác sĩ hoặc Quản trị viên trong ca trực mới có quyền thu hồi bản tin.'
            USING ERRCODE = '42501';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM app.pet_medical_bulletins WHERE id = p_bulletin_id) THEN
        RAISE EXCEPTION 'BULLETIN_NOT_FOUND: Bản tin không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    UPDATE app.pet_medical_bulletins
    SET status = 'rejected',
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_bulletin_id;

    INSERT INTO app.bulletin_approval_history (
        bulletin_id,
        action,
        actor_id,
        review_notes,
        created_at
    )
    VALUES (
        p_bulletin_id,
        'REVOKE',
        auth.uid(),
        p_reason,
        CLOCK_TIMESTAMP()
    );

    RETURN TRUE;
END;
$$;

-- ------------------------------------------------------------------------------
-- 6. Public Wrappers (SECURITY DEFINER, SET search_path = '')
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.rpc_create_clinical_record(
    p_pet_id UUID,
    p_chief_complaint TEXT,
    p_clinical_notes TEXT DEFAULT NULL,
    p_weight_kg NUMERIC DEFAULT NULL,
    p_temperature_c NUMERIC DEFAULT NULL
)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_create_clinical_record(p_pet_id, p_chief_complaint, p_clinical_notes, p_weight_kg, p_temperature_c);
$$;

CREATE OR REPLACE FUNCTION public.rpc_lock_clinical_record(
    p_record_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_lock_clinical_record(p_record_id);
$$;

CREATE OR REPLACE FUNCTION public.rpc_create_clinical_amendment(
    p_record_id UUID,
    p_reason TEXT,
    p_amended_data JSONB
)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_create_clinical_amendment(p_record_id, p_reason, p_amended_data);
$$;

CREATE OR REPLACE FUNCTION public.rpc_create_treatment_order(
    p_record_id UUID,
    p_order_type VARCHAR(30),
    p_description TEXT,
    p_dosage VARCHAR(100) DEFAULT NULL,
    p_route VARCHAR(50) DEFAULT NULL,
    p_frequency VARCHAR(50) DEFAULT NULL
)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_create_treatment_order(p_record_id, p_order_type, p_description, p_dosage, p_route, p_frequency);
$$;

CREATE OR REPLACE FUNCTION public.rpc_checkoff_treatment_order(
    p_order_id UUID,
    p_execution_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_checkoff_treatment_order(p_order_id, p_execution_notes);
$$;

CREATE OR REPLACE FUNCTION public.rpc_create_medical_bulletin(
    p_pet_id UUID,
    p_stay_id UUID DEFAULT NULL,
    p_title VARCHAR(200) DEFAULT 'Cập nhật sức khỏe thú cưng',
    p_content TEXT DEFAULT ''
)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_create_medical_bulletin(p_pet_id, p_stay_id, p_title, p_content);
$$;

CREATE OR REPLACE FUNCTION public.rpc_submit_bulletin_for_review(
    p_bulletin_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_submit_bulletin_for_review(p_bulletin_id);
$$;

CREATE OR REPLACE FUNCTION public.rpc_approve_medical_bulletin(
    p_bulletin_id UUID,
    p_review_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_approve_medical_bulletin(p_bulletin_id, p_review_notes);
$$;

CREATE OR REPLACE FUNCTION public.rpc_publish_medical_bulletin(
    p_bulletin_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_publish_medical_bulletin(p_bulletin_id);
$$;

CREATE OR REPLACE FUNCTION public.rpc_revoke_medical_bulletin(
    p_bulletin_id UUID,
    p_reason TEXT DEFAULT 'Thu hồi để kiểm tra lại thông tin'
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_revoke_medical_bulletin(p_bulletin_id, p_reason);
$$;

-- ------------------------------------------------------------------------------
-- 7. Phân Quyền Thực Thi (Grant / Revoke)
-- ------------------------------------------------------------------------------
REVOKE ALL ON FUNCTION app.rpc_create_clinical_record(UUID, TEXT, TEXT, NUMERIC, NUMERIC) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_lock_clinical_record(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_create_clinical_amendment(UUID, TEXT, JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_create_treatment_order(UUID, VARCHAR, TEXT, VARCHAR, VARCHAR, VARCHAR) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_checkoff_treatment_order(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_create_medical_bulletin(UUID, UUID, VARCHAR, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_submit_bulletin_for_review(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_approve_medical_bulletin(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_publish_medical_bulletin(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_revoke_medical_bulletin(UUID, TEXT) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.rpc_create_clinical_record(UUID, TEXT, TEXT, NUMERIC, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_lock_clinical_record(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_create_clinical_amendment(UUID, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_create_treatment_order(UUID, VARCHAR, TEXT, VARCHAR, VARCHAR, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_checkoff_treatment_order(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_create_medical_bulletin(UUID, UUID, VARCHAR, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_submit_bulletin_for_review(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_approve_medical_bulletin(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_publish_medical_bulletin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_revoke_medical_bulletin(UUID, TEXT) TO authenticated;
