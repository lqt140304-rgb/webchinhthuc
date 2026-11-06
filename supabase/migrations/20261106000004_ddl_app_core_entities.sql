-- ==============================================================================
-- PHASE 4B MIGRATION 04: APP CORE ENTITIES DDL
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section III.2, Gate 2)
-- Table Count: 14 core tables
-- Invariants Enforced: P1-C (RESTRICT), P1-E (No UNIQUE on customer phone), BYO-2 (Device Trust)
-- ==============================================================================

-- 1. Người dùng ứng dụng nội bộ & khách hàng
CREATE TABLE IF NOT EXISTS app.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
    phone_number VARCHAR(15) NULL,
    full_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 2. Phân công vai trò kỹ thuật nhân sự
CREATE TABLE IF NOT EXISTS app.staff_role_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    role VARCHAR(30) NOT NULL CHECK (role IN ('veterinarian', 'doctor', 'nurse', 'cashier', 'spa_staff', 'receptionist', 'admin')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    assigned_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    CONSTRAINT uq_user_role UNIQUE (user_id, role)
);

-- 3. Phân khu lưu chuồng
CREATE TABLE IF NOT EXISTS app.cage_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_code VARCHAR(20) NOT NULL UNIQUE,
    zone_name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 4. Định nghĩa ca làm việc
CREATE TABLE IF NOT EXISTS app.shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_code VARCHAR(20) NOT NULL UNIQUE,
    shift_name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_overnight BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 5. Phân ca trực nhân sự
CREATE TABLE IF NOT EXISTS app.shift_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_id UUID NOT NULL REFERENCES app.shifts(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    work_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    CONSTRAINT uq_shift_user_date UNIQUE (shift_id, user_id, work_date)
);

-- 6. Hồ sơ khách hàng bệnh viện (P1-E Invariant: CẤM UNIQUE trên phone_number)
CREATE TABLE IF NOT EXISTS app.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL, -- P1-E: CẤM UNIQUE! Cho phép nhiều khách chung SĐT
    email VARCHAR(255) NULL,
    address TEXT NULL,
    identity_card_number VARCHAR(20) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    import_job_id UUID NULL REFERENCES staging.import_jobs(id) ON DELETE SET NULL
);

-- 7. Hồ sơ thú cưng (P1-C: ON DELETE RESTRICT bảo vệ dữ liệu y khoa)
CREATE TABLE IF NOT EXISTS app.pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES app.customers(id) ON DELETE RESTRICT,
    pet_name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100) NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'unknown')),
    date_of_birth DATE NULL,
    color VARCHAR(50) NULL,
    microchip_number VARCHAR(50) NULL,
    is_deceased BOOLEAN NOT NULL DEFAULT FALSE, -- POL-DECEASED
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    import_job_id UUID NULL REFERENCES staging.import_jobs(id) ON DELETE SET NULL
);

-- 8. Liên kết tài khoản khách hàng với hồ sơ thực tế
CREATE TABLE IF NOT EXISTS app.customer_user_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES app.customers(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    link_status VARCHAR(20) NOT NULL CHECK (link_status IN ('pending', 'approved', 'rejected', 'unlinked')),
    verified_by UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    verified_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    CONSTRAINT uq_customer_user UNIQUE (customer_id, user_id)
);

-- 9. Yêu cầu liên kết tài khoản portal
CREATE TABLE IF NOT EXISTS app.user_link_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES app.customers(id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    request_notes TEXT NULL,
    reviewed_by UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    reviewed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 10. Cam kết y khoa thú cưng
CREATE TABLE IF NOT EXISTS app.pet_medical_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES app.pets(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES app.customers(id) ON DELETE RESTRICT,
    consent_type VARCHAR(50) NOT NULL,
    is_granted BOOLEAN NOT NULL DEFAULT FALSE,
    granted_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 11. Quản lý lịch hẹn
CREATE TABLE IF NOT EXISTS app.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES app.customers(id) ON DELETE RESTRICT,
    pet_id UUID NULL REFERENCES app.pets(id) ON DELETE RESTRICT,
    appointment_type VARCHAR(30) NOT NULL CHECK (appointment_type IN ('medical', 'spa', 'vaccine', 'recheck')),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    scheduled_time TIMESTAMPTZ NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 12. Chi tiết lịch hẹn khám bệnh
CREATE TABLE IF NOT EXISTS app.medical_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES app.appointments(id) ON DELETE RESTRICT,
    symptoms TEXT NULL,
    doctor_id UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 13. Yêu cầu đặt lịch từ khách vãng lai
CREATE TABLE IF NOT EXISTS app.guest_booking_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    pet_name VARCHAR(100) NOT NULL,
    service_type VARCHAR(30) NOT NULL CHECK (service_type IN ('medical', 'spa', 'vaccine', 'recheck')),
    preferred_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 14. Quản lý thiết bị BYOD nhân viên (BYO-2 & D-20 Policy)
CREATE TABLE IF NOT EXISTS app.staff_device_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    device_fingerprint_hash CHAR(64) NOT NULL,
    device_name VARCHAR(100) NOT NULL,
    user_agent TEXT NOT NULL,
    ip_address INET NOT NULL,
    is_trusted BOOLEAN NOT NULL DEFAULT FALSE, -- Mặc định chưa tin cậy
    approved_by UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    approved_at TIMESTAMPTZ NULL,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_by UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    revoked_at TIMESTAMPTZ NULL,
    wipe_requested BOOLEAN NOT NULL DEFAULT FALSE,
    wipe_completed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    CONSTRAINT uq_staff_device UNIQUE (staff_id, device_fingerprint_hash)
);

-- Chỉ mục hiệu năng
CREATE INDEX IF NOT EXISTS idx_customers_phone ON app.customers(phone_number);
CREATE INDEX IF NOT EXISTS idx_pets_customer ON app.pets(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON app.appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_time ON app.appointments(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_staff_devices_staff ON app.staff_device_sessions(staff_id);

-- Khóa quyền bảo mật: Cấm toàn bộ truy cập từ PUBLIC/anon/authenticated
REVOKE ALL ON TABLE app.users FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.staff_role_assignments FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.cage_zones FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.shifts FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.shift_assignments FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.customers FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.pets FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.customer_user_links FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.user_link_requests FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.pet_medical_consents FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.appointments FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.medical_appointments FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.guest_booking_requests FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.staff_device_sessions FROM PUBLIC, anon, authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA app TO postgres, service_role;
