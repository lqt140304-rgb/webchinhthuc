-- ==============================================================================
-- PHASE 4B MIGRATION 11: CUSTOMER, PET & APPOINTMENT RPCs (GATE 4)
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section VII.3, VII.4, Gate 4)
-- Invariants Enforced: D-19 (Strict Lazy Creation), P1-C (RESTRICT), U-3 (IDOR Guard)
-- ==============================================================================

-- 1. RPC Đăng Ký Thú Cưng Kèm Cơ Chế Lazy Profile Creation
CREATE OR REPLACE FUNCTION app.rpc_register_customer_pet(
    p_pet_name VARCHAR(100),
    p_species VARCHAR(50),
    p_breed VARCHAR(100) DEFAULT NULL,
    p_gender VARCHAR(10) DEFAULT 'unknown',
    p_date_of_birth DATE DEFAULT NULL,
    p_customer_phone TEXT DEFAULT NULL,
    p_customer_name TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_cust_id UUID;
    v_pet_id UUID;
    v_user_phone TEXT;
    v_user_name TEXT;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Người dùng chưa đăng nhập.';
    END IF;

    IF p_pet_name IS NULL OR TRIM(p_pet_name) = '' THEN
        RAISE EXCEPTION 'INVALID_PET_NAME: Tên thú cưng không được để trống.';
    END IF;

    IF p_species IS NULL OR TRIM(p_species) = '' THEN
        RAISE EXCEPTION 'INVALID_SPECIES: Loài thú cưng không được để trống.';
    END IF;

    IF p_gender NOT IN ('male', 'female', 'unknown') THEN
        RAISE EXCEPTION 'INVALID_GENDER: Giới tính thú cưng không hợp lệ (male, female, unknown).';
    END IF;

    -- 1. Tìm hồ sơ khách hàng đã liên kết (ưu tiên approved trước)
    SELECT customer_id INTO v_cust_id
    FROM app.customer_user_links cul
    WHERE cul.user_id = v_user_id AND cul.link_status IN ('approved', 'pending')
    ORDER BY (cul.link_status = 'approved') DESC, cul.created_at ASC
    LIMIT 1;

    -- 2. D-19 Lazy Creation: Chỉ tạo app.customers khi thực sự phát sinh thao tác
    IF v_cust_id IS NULL THEN
        SELECT phone_number, full_name INTO v_user_phone, v_user_name 
        FROM app.users WHERE id = v_user_id;

        v_user_phone := COALESCE(p_customer_phone, v_user_phone);
        v_user_name := COALESCE(p_customer_name, v_user_name, 'Khách hàng trực tuyến');

        IF v_user_phone IS NULL OR TRIM(v_user_phone) = '' THEN
            RAISE EXCEPTION 'PHONE_NUMBER_REQUIRED: Đăng ký thú cưng yêu cầu cung cấp số điện thoại liên hệ.';
        END IF;

        INSERT INTO app.customers (
            full_name, phone_number, is_active
        ) VALUES (
            v_user_name, SUBSTRING(v_user_phone FROM 1 FOR 15), TRUE
        ) RETURNING id INTO v_cust_id;

        INSERT INTO app.customer_user_links (
            customer_id, user_id, link_status
        ) VALUES (
            v_cust_id, v_user_id, 'approved'
        );
    END IF;

    -- 3. Tạo bản ghi thú cưng
    INSERT INTO app.pets (
        customer_id, pet_name, species, breed, gender, date_of_birth, is_deceased
    ) VALUES (
        v_cust_id, p_pet_name, p_species, p_breed, p_gender, p_date_of_birth, FALSE
    ) RETURNING id INTO v_pet_id;

    RETURN v_pet_id;
END;
$$;

-- 2. RPC Đặt Lịch Hẹn Khách Hàng (Tích hợp Rate Limiting & IDOR Check)
CREATE OR REPLACE FUNCTION app.rpc_create_customer_appointment(
    p_pet_id UUID,
    p_appointment_type VARCHAR(30),
    p_scheduled_time TIMESTAMPTZ,
    p_symptoms_notes TEXT DEFAULT NULL,
    p_customer_phone TEXT DEFAULT NULL,
    p_customer_name TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_cust_id UUID;
    v_appt_id UUID;
    v_user_phone TEXT;
    v_user_name TEXT;
    v_pending_count INT;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Người dùng chưa đăng nhập.';
    END IF;

    -- U-3 FIX: Thời gian hẹn phải ở tương lai
    IF p_scheduled_time <= CLOCK_TIMESTAMP() THEN
        RAISE EXCEPTION 'INVALID_SCHEDULE_TIME: Thời gian đặt lịch phải ở tương lai.';
    END IF;

    -- Kiểm tra loại lịch hẹn hợp lệ khớp 100% CHECK constraint của app.appointments
    IF p_appointment_type NOT IN ('medical', 'spa', 'vaccine', 'recheck') THEN
        RAISE EXCEPTION 'INVALID_APPOINTMENT_TYPE: Loại lịch hẹn không hợp lệ (chấp nhận: medical, spa, vaccine, recheck).';
    END IF;

    -- 1. Tìm hồ sơ khách hàng đã liên kết
    SELECT customer_id INTO v_cust_id
    FROM app.customer_user_links cul
    WHERE cul.user_id = v_user_id AND cul.link_status IN ('approved', 'pending')
    ORDER BY (cul.link_status = 'approved') DESC, cul.created_at ASC
    LIMIT 1;

    -- 2. D-19 Lazy Creation nếu chưa có hồ sơ khách hàng
    IF v_cust_id IS NULL THEN
        SELECT phone_number, full_name INTO v_user_phone, v_user_name 
        FROM app.users WHERE id = v_user_id;

        v_user_phone := COALESCE(p_customer_phone, v_user_phone);
        v_user_name := COALESCE(p_customer_name, v_user_name, 'Khách hàng trực tuyến');

        IF v_user_phone IS NULL OR TRIM(v_user_phone) = '' THEN
            RAISE EXCEPTION 'PHONE_NUMBER_REQUIRED: Đặt lịch hẹn yêu cầu cung cấp số điện thoại liên hệ.';
        END IF;

        INSERT INTO app.customers (
            full_name, phone_number, is_active
        ) VALUES (
            v_user_name, SUBSTRING(v_user_phone FROM 1 FOR 15), TRUE
        ) RETURNING id INTO v_cust_id;

        INSERT INTO app.customer_user_links (
            customer_id, user_id, link_status
        ) VALUES (
            v_cust_id, v_user_id, 'approved'
        );
    END IF;

    -- 3. POL-BOOKING Rate Limiter: Tối đa 3 lịch hẹn đang chờ xử lý (pending / confirmed)
    SELECT count(*) INTO v_pending_count
    FROM app.appointments
    WHERE customer_id = v_cust_id
      AND status IN ('pending', 'confirmed');

    IF v_pending_count >= 3 THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Mỗi khách hàng chỉ được có tối đa 3 lịch hẹn đang chờ xử lý.';
    END IF;

    -- 4. U-3 FIX: Kiểm tra IDOR - Thú cưng bắt buộc phải thuộc sở hữu của khách hàng
    IF p_pet_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM app.pets 
            WHERE id = p_pet_id AND customer_id = v_cust_id AND is_deceased = FALSE
        ) THEN
            RAISE EXCEPTION 'IDOR_VIOLATION: Thú cưng #% không thuộc quyền quản lý của khách hàng.', p_pet_id;
        END IF;
    END IF;

    -- 5. Tạo lịch hẹn chính trong app.appointments
    INSERT INTO app.appointments (
        customer_id, pet_id, appointment_type, status, scheduled_time, notes
    ) VALUES (
        v_cust_id, p_pet_id, p_appointment_type, 'pending', p_scheduled_time, p_symptoms_notes
    ) RETURNING id INTO v_appt_id;

    -- Nếu là loại khám y tế (medical / recheck) và có triệu chứng, lưu vào app.medical_appointments
    IF p_appointment_type IN ('medical', 'recheck') AND p_symptoms_notes IS NOT NULL THEN
        INSERT INTO app.medical_appointments (
            appointment_id, symptoms
        ) VALUES (
            v_appt_id, p_symptoms_notes
        );
    END IF;

    RETURN v_appt_id;
END;
$$;

-- 3. RPC Yêu Cầu Liên Kết Hồ Sơ Khách Hàng (D-LINK Workflow)
CREATE OR REPLACE FUNCTION app.rpc_request_customer_link(
    p_customer_id UUID,
    p_request_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_req_id UUID;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Người dùng chưa đăng nhập.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM app.customers WHERE id = p_customer_id AND is_active = TRUE) THEN
        RAISE EXCEPTION 'CUSTOMER_NOT_FOUND: Không tìm thấy hồ sơ khách hàng để liên kết.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM app.customer_user_links 
        WHERE customer_id = p_customer_id AND user_id = v_user_id AND link_status = 'approved'
    ) THEN
        RAISE EXCEPTION 'ALREADY_LINKED: Tài khoản đã được liên kết với hồ sơ này.';
    END IF;

    INSERT INTO app.user_link_requests (
        user_id, customer_id, status, request_notes
    ) VALUES (
        v_user_id, p_customer_id, 'pending', p_request_notes
    ) RETURNING id INTO v_req_id;

    RETURN v_req_id;
END;
$$;

-- ==============================================================================
-- 4. PUBLIC SCHEMA SAFE WRAPPERS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.rpc_register_customer_pet(
    p_pet_name VARCHAR(100),
    p_species VARCHAR(50),
    p_breed VARCHAR(100) DEFAULT NULL,
    p_gender VARCHAR(10) DEFAULT 'unknown',
    p_date_of_birth DATE DEFAULT NULL,
    p_customer_phone TEXT DEFAULT NULL,
    p_customer_name TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_register_customer_pet(p_pet_name, p_species, p_breed, p_gender, p_date_of_birth, p_customer_phone, p_customer_name);
$$;

CREATE OR REPLACE FUNCTION public.rpc_create_customer_appointment(
    p_pet_id UUID,
    p_appointment_type VARCHAR(30),
    p_scheduled_time TIMESTAMPTZ,
    p_symptoms_notes TEXT DEFAULT NULL,
    p_customer_phone TEXT DEFAULT NULL,
    p_customer_name TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_create_customer_appointment(p_pet_id, p_appointment_type, p_scheduled_time, p_symptoms_notes, p_customer_phone, p_customer_name);
$$;

CREATE OR REPLACE FUNCTION public.rpc_request_customer_link(
    p_customer_id UUID,
    p_request_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_request_customer_link(p_customer_id, p_request_notes);
$$;

-- Phân quyền: Cấm triệt để anon/PUBLIC, chỉ cho phép authenticated
REVOKE ALL ON FUNCTION public.rpc_register_customer_pet(VARCHAR, VARCHAR, VARCHAR, VARCHAR, DATE, TEXT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.rpc_create_customer_appointment(UUID, VARCHAR, TIMESTAMPTZ, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.rpc_request_customer_link(UUID, TEXT) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.rpc_register_customer_pet(VARCHAR, VARCHAR, VARCHAR, VARCHAR, DATE, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_create_customer_appointment(UUID, VARCHAR, TIMESTAMPTZ, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_request_customer_link(UUID, TEXT) TO authenticated;
