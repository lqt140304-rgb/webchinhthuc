-- ==============================================================================
-- PHASE 4B MIGRATION 05: CLINICAL & INPATIENT DDL
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section III.2, Gate 2)
-- Table Count: 12 clinical & inpatient tables
-- Invariants Enforced: P1-C (RESTRICT), D-07 (Two-Man), D-10 (60-Day Media Retention), D-12 (Medical Privacy)
-- ==============================================================================

-- 15. Bệnh án lâm sàng
CREATE TABLE IF NOT EXISTS app.clinical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES app.pets(id) ON DELETE RESTRICT,
    veterinarian_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    chief_complaint TEXT NOT NULL,
    clinical_notes TEXT NULL,
    weight_kg NUMERIC(5,2) NULL,
    temperature_c NUMERIC(4,1) NULL,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    locked_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 16. Chỉ số sinh hiệu chi tiết
CREATE TABLE IF NOT EXISTS app.clinical_record_vitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id UUID NOT NULL REFERENCES app.clinical_records(id) ON DELETE RESTRICT,
    heart_rate_bpm INT NULL,
    respiratory_rate_bpm INT NULL,
    mucous_membrane VARCHAR(50) NULL,
    capillary_refill_time_sec NUMERIC(3,1) NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    recorded_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT
);

-- 17. Chẩn đoán lâm sàng (D-12: Chỉ hiển thị cho khách khi đã duyệt is_published_to_customer = TRUE)
CREATE TABLE IF NOT EXISTS app.clinical_diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id UUID NOT NULL REFERENCES app.clinical_records(id) ON DELETE RESTRICT,
    diagnosis_code VARCHAR(50) NULL,
    diagnosis_name TEXT NOT NULL,
    diagnosis_type VARCHAR(20) NOT NULL CHECK (diagnosis_type IN ('preliminary', 'differential', 'confirmed')),
    is_published_to_customer BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ NULL,
    published_by UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 18. Y lệnh điều trị nội bộ (D-12: Mặc định ẩn hoàn toàn khỏi portal khách hàng)
CREATE TABLE IF NOT EXISTS app.treatment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id UUID NOT NULL REFERENCES app.clinical_records(id) ON DELETE RESTRICT,
    order_type VARCHAR(30) NOT NULL CHECK (order_type IN ('medication', 'fluid', 'procedure', 'diet', 'lab')),
    description TEXT NOT NULL,
    dosage VARCHAR(100) NULL,
    route VARCHAR(50) NULL,
    frequency VARCHAR(50) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ordered' CHECK (status IN ('ordered', 'in_progress', 'completed', 'discontinued')),
    ordered_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    executed_by UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    executed_at TIMESTAMPTZ NULL,
    is_internal_only BOOLEAN NOT NULL DEFAULT TRUE, -- D-12: Ẩn y lệnh nội bộ
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 19. Đơn thuốc nội trú & ngoại trú (D-12: Thuốc tiêm, liều lượng nội bộ tuyệt đối ẩn khỏi khách)
CREATE TABLE IF NOT EXISTS app.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id UUID NOT NULL REFERENCES app.clinical_records(id) ON DELETE RESTRICT,
    prescribed_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    notes TEXT NULL,
    is_internal_only BOOLEAN NOT NULL DEFAULT TRUE, -- D-12: Y lệnh thuốc nội bộ
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 20. Tu chỉnh hồ sơ bệnh án
CREATE TABLE IF NOT EXISTS app.clinical_amendments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id UUID NOT NULL REFERENCES app.clinical_records(id) ON DELETE RESTRICT,
    amended_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    reason TEXT NOT NULL,
    amended_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 21. Quản lý chuồng lưu trú
CREATE TABLE IF NOT EXISTS app.cages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID NOT NULL REFERENCES app.cage_zones(id) ON DELETE RESTRICT,
    cage_number VARCHAR(20) NOT NULL,
    cage_size VARCHAR(20) NOT NULL CHECK (cage_size IN ('small', 'medium', 'large', 'isolation')),
    is_occupied BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    CONSTRAINT uq_zone_cage UNIQUE (zone_id, cage_number)
);

-- 22. Quản lý đợt nội trú
CREATE TABLE IF NOT EXISTS app.inpatient_stays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES app.pets(id) ON DELETE RESTRICT,
    cage_id UUID NOT NULL REFERENCES app.cages(id) ON DELETE RESTRICT,
    admission_record_id UUID NULL REFERENCES app.clinical_records(id) ON DELETE RESTRICT,
    admission_time TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    discharge_time TIMESTAMPTZ NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'admitted' CHECK (status IN ('admitted', 'treating', 'recovered', 'discharged', 'deceased')),
    attending_vet_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    daily_rate NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 23. Nhật ký theo dõi nội trú hàng ngày
CREATE TABLE IF NOT EXISTS app.inpatient_daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stay_id UUID NOT NULL REFERENCES app.inpatient_stays(id) ON DELETE RESTRICT,
    logged_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5,2) NULL,
    temperature_c NUMERIC(4,1) NULL,
    diet_status VARCHAR(50) NULL,
    mental_state VARCHAR(50) NULL,
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 24. Bản tin cập nhật sức khỏe gửi khách (D-07 Two-Man Rule cứng: approved_by <> created_by)
CREATE TABLE IF NOT EXISTS app.pet_medical_bulletins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES app.pets(id) ON DELETE RESTRICT,
    stay_id UUID NULL REFERENCES app.inpatient_stays(id) ON DELETE RESTRICT,
    bulletin_title VARCHAR(200) NOT NULL,
    bulletin_content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'published')),
    created_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    approved_by UUID NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    approved_at TIMESTAMPTZ NULL,
    published_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    CONSTRAINT chk_bulletin_approval CHECK (approved_by IS NULL OR approved_by <> created_by)
);

-- 25. Media hàng ngày nội trú (D-10: Tự động đánh dấu xóa sau 60 ngày kể từ lúc upload)
CREATE TABLE IF NOT EXISTS app.inpatient_daily_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stay_id UUID NOT NULL REFERENCES app.inpatient_stays(id) ON DELETE RESTRICT,
    bulletin_id UUID NULL REFERENCES app.pet_medical_bulletins(id) ON DELETE SET NULL,
    storage_path TEXT NOT NULL,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video')),
    is_approved_for_customer BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    auto_delete_at TIMESTAMPTZ NOT NULL DEFAULT (CLOCK_TIMESTAMP() + INTERVAL '60 days')
);

-- 26. Lịch sử phê duyệt bản tin y tế
CREATE TABLE IF NOT EXISTS app.bulletin_approval_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bulletin_id UUID NOT NULL REFERENCES app.pet_medical_bulletins(id) ON DELETE RESTRICT,
    action VARCHAR(20) NOT NULL CHECK (action IN ('SUBMIT', 'APPROVE', 'REJECT', 'PUBLISH', 'REVOKE')),
    actor_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    review_notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- Chỉ mục hiệu năng
CREATE INDEX IF NOT EXISTS idx_clinical_records_pet ON app.clinical_records(pet_id);
CREATE INDEX IF NOT EXISTS idx_clinical_records_vet ON app.clinical_records(veterinarian_id);
CREATE INDEX IF NOT EXISTS idx_treatment_orders_record ON app.treatment_orders(record_id);
CREATE INDEX IF NOT EXISTS idx_inpatient_stays_pet ON app.inpatient_stays(pet_id);
CREATE INDEX IF NOT EXISTS idx_inpatient_stays_status ON app.inpatient_stays(status);
CREATE INDEX IF NOT EXISTS idx_bulletins_pet ON app.pet_medical_bulletins(pet_id);
CREATE INDEX IF NOT EXISTS idx_daily_media_stay ON app.inpatient_daily_media(stay_id);
CREATE INDEX IF NOT EXISTS idx_daily_media_delete_at ON app.inpatient_daily_media(auto_delete_at);

-- Khóa quyền bảo mật: Cấm toàn bộ truy cập từ PUBLIC/anon/authenticated
REVOKE ALL ON TABLE app.clinical_records FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.clinical_record_vitals FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.clinical_diagnoses FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.treatment_orders FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.prescriptions FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.clinical_amendments FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.cages FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.inpatient_stays FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.inpatient_daily_logs FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.pet_medical_bulletins FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.inpatient_daily_media FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.bulletin_approval_history FROM PUBLIC, anon, authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA app TO postgres, service_role;
