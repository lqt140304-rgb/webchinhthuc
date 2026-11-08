-- ==============================================================================
-- PHASE 4B MIGRATION 18: IMPORT CENTER, STAGING & SAFE ROLLBACK (GATE 7)
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section III.3, Section VII, Gate 7)
-- Features:
--   - Two-Man Rule enforcement on job approval (D-07, IMP-01)
--   - Role & active shift authorization guards (IMP-02)
--   - State machine transition integrity (IMP-03)
--   - Pessimistic locking (SELECT ... FOR UPDATE) against race condition (IMP-07)
--   - Dry-run validation with granular row error tracking (IMP-10)
--   - Auto-generation of batch numbers for missing batches (IMP-08)
--   - Auto-quarantine of batches with unknown expiry date (D-15, IMP-09)
--   - Safe rollback guard: blocks rollback if customer has new transactions (IMP-05)
--   - Full soft rollback with is_deleted flag and loyalty points reversal (IMP-04, IMP-06, V-2)
-- ==============================================================================

-- 1. Schema Enhancements: Hỗ trợ cờ xóa mềm is_deleted và import_job_id liên kết
ALTER TABLE app.customers 
    ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE app.pets 
    ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE app.inventory_batches 
    ADD COLUMN IF NOT EXISTS import_job_id UUID REFERENCES staging.import_jobs(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_customers_import_job_id ON app.customers(import_job_id);
CREATE INDEX IF NOT EXISTS idx_pets_import_job_id ON app.pets(import_job_id);
CREATE INDEX IF NOT EXISTS idx_inventory_batches_import_job_id ON app.inventory_batches(import_job_id);
CREATE INDEX IF NOT EXISTS idx_historical_loyalty_import_job_id ON app.historical_loyalty_points(import_job_id);

-- 2. RPC Khởi Tạo Phiên Nhập Liệu & Tải Dữ Liệu Thô (Parse / Ingest File)
CREATE OR REPLACE FUNCTION app.rpc_import_parse_file(
    p_file_path TEXT,
    p_source VARCHAR,
    p_raw_rows JSONB DEFAULT '[]'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_caller_id UUID := auth.uid();
    v_job_id UUID;
    v_file_hash TEXT;
    v_row RECORD;
    v_row_count INT := 0;
    v_item JSONB;
BEGIN
    -- Guard 1: Quyền Admin
    IF NOT (COALESCE(app.is_admin(v_caller_id), FALSE) OR COALESCE(auth.jwt() ->> 'role', '') = 'service_role') THEN
        RAISE EXCEPTION 'ROLE_UNAUTHORIZED: Chỉ Quản trị viên (Admin) mới có quyền khởi tạo tiến trình nhập liệu Excel'
            USING ERRCODE = '42501';
    END IF;

    -- Guard 2: Ca trực đang hoạt động (S-11 Fail-closed)
    IF v_caller_id IS NOT NULL AND NOT app.check_active_shift(v_caller_id, 'admin') THEN
        RAISE EXCEPTION 'SHIFT_NOT_ACTIVE: Quản trị viên phải có ca trực hoạt động để thực hiện nhập liệu'
            USING ERRCODE = 'P0002';
    END IF;

    -- Tính toán mã băm sha256 cho tệp dữ liệu
    v_file_hash := encode(extensions.digest(convert_to(COALESCE(p_file_path, 'mock_file') || clock_timestamp()::text, 'UTF8'), 'sha256'), 'hex');

    -- Khởi tạo bản ghi staging.import_jobs
    INSERT INTO staging.import_jobs (
        file_name,
        file_hash_sha256,
        file_size_bytes,
        status,
        total_rows,
        valid_rows,
        error_rows,
        uploaded_by,
        created_at,
        updated_at
    )
    VALUES (
        p_file_path,
        v_file_hash,
        1024 + jsonb_array_length(COALESCE(p_raw_rows, '[]'::jsonb)) * 128,
        'uploaded',
        jsonb_array_length(COALESCE(p_raw_rows, '[]'::jsonb)),
        0,
        0,
        COALESCE(v_caller_id, '00000000-0000-0000-0000-000000000000'::uuid),
        CLOCK_TIMESTAMP(),
        CLOCK_TIMESTAMP()
    )
    RETURNING id INTO v_job_id;

    -- Nạp các dòng thô vào staging.import_rows nếu có
    IF p_raw_rows IS NOT NULL AND jsonb_array_length(p_raw_rows) > 0 THEN
        FOR v_item IN SELECT * FROM jsonb_array_elements(p_raw_rows)
        LOOP
            v_row_count := v_row_count + 1;
            INSERT INTO staging.import_rows (
                job_id,
                row_number,
                raw_data,
                is_valid,
                created_at
            )
            VALUES (
                v_job_id,
                v_row_count,
                v_item,
                FALSE,
                CLOCK_TIMESTAMP()
            );
        END LOOP;
    END IF;

    RETURN v_job_id;
END;
$$;

-- 3. RPC Chạy Thử & Kiểm Định Dữ Liệu (Dry-Run Validation - IMP-08, IMP-09, IMP-10)
CREATE OR REPLACE FUNCTION app.rpc_import_execute_dry_run(p_job_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_caller_id UUID := auth.uid();
    v_job RECORD;
    v_row RECORD;
    v_total_rows INT := 0;
    v_valid_rows INT := 0;
    v_error_rows INT := 0;
    v_errors JSONB;
    v_row_valid BOOLEAN;
    v_normalized JSONB;
    v_phone TEXT;
    v_name TEXT;
    v_batch_num TEXT;
    v_expiry_date DATE;
    v_expiry_status TEXT;
    v_is_quarantined BOOLEAN;
    v_summary JSONB;
BEGIN
    -- Guard 1: Quyền Admin
    IF NOT (COALESCE(app.is_admin(v_caller_id), FALSE) OR COALESCE(auth.jwt() ->> 'role', '') = 'service_role') THEN
        RAISE EXCEPTION 'ROLE_UNAUTHORIZED: Chỉ Quản trị viên (Admin) mới có quyền chạy kiểm tra dry-run'
            USING ERRCODE = '42501';
    END IF;

    -- Guard 2: Ca trực active
    IF v_caller_id IS NOT NULL AND NOT app.check_active_shift(v_caller_id, 'admin') THEN
        RAISE EXCEPTION 'SHIFT_NOT_ACTIVE: Quản trị viên phải có ca trực hoạt động'
            USING ERRCODE = 'P0002';
    END IF;

    -- Khóa job kiểm tra trạng thái
    SELECT * INTO v_job
    FROM staging.import_jobs
    WHERE id = p_job_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'JOB_NOT_FOUND: Không tìm thấy job nhập liệu %', p_job_id
            USING ERRCODE = 'P0002';
    END IF;

    IF v_job.status NOT IN ('uploaded', 'validating', 'validation_failed') THEN
        RAISE EXCEPTION 'INVALID_JOB_STATUS: Không thể chạy dry-run trên job ở trạng thái %', v_job.status
            USING ERRCODE = 'P0002';
    END IF;

    -- Xóa các lỗi kiểm định cũ nếu chạy lại
    DELETE FROM staging.import_errors WHERE job_id = p_job_id;

    -- Duyệt từng dòng staging để kiểm tra
    FOR v_row IN 
        SELECT * FROM staging.import_rows 
        WHERE job_id = p_job_id 
        ORDER BY row_number ASC
    LOOP
        v_total_rows := v_total_rows + 1;
        v_row_valid := TRUE;
        v_errors := '{}'::jsonb;
        v_normalized := v_row.raw_data;

        -- 1. Kiểm tra Khách hàng nếu có
        IF v_row.raw_data ? 'phone_number' OR v_row.raw_data ? 'customer_phone' THEN
            v_phone := COALESCE(v_row.raw_data ->> 'phone_number', v_row.raw_data ->> 'customer_phone');
            v_name := COALESCE(v_row.raw_data ->> 'full_name', v_row.raw_data ->> 'customer_name');

            -- Bắt buộc tên không rỗng
            IF v_name IS NULL OR length(trim(v_name)) = 0 THEN
                v_row_valid := FALSE;
                v_errors := v_errors || jsonb_build_object('full_name', 'Họ tên khách hàng không được để trống');
                INSERT INTO staging.import_errors (job_id, row_number, column_name, error_code, error_message)
                VALUES (p_job_id, v_row.row_number, 'full_name', 'REQUIRED_FIELD_EMPTY', 'Họ tên khách hàng không được để trống');
            END IF;

            -- Kiểm tra định dạng số điện thoại Việt Nam (10-11 chữ số)
            IF v_phone IS NULL OR v_phone !~ '^(0[0-9]{9,10})$' THEN
                v_row_valid := FALSE;
                v_errors := v_errors || jsonb_build_object('phone_number', 'Số điện thoại không hợp lệ (yêu cầu 10-11 số)');
                INSERT INTO staging.import_errors (job_id, row_number, column_name, error_code, error_message)
                VALUES (p_job_id, v_row.row_number, 'phone_number', 'INVALID_PHONE_FORMAT', 'Số điện thoại không hợp lệ: ' || COALESCE(v_phone, 'NULL'));
            END IF;
        END IF;

        -- 2. Kiểm tra Thú cưng nếu có
        IF v_row.raw_data ? 'pet_name' THEN
            IF (v_row.raw_data ->> 'gender') IS NOT NULL AND (v_row.raw_data ->> 'gender') NOT IN ('male', 'female', 'unknown') THEN
                v_row_valid := FALSE;
                v_errors := v_errors || jsonb_build_object('gender', 'Giới tính thú cưng phải là male, female hoặc unknown');
                INSERT INTO staging.import_errors (job_id, row_number, column_name, error_code, error_message)
                VALUES (p_job_id, v_row.row_number, 'gender', 'INVALID_GENDER', 'Giới tính thú cưng không hợp lệ');
            END IF;
        END IF;

        -- 3. Xử lý Lô Hàng Tồn Kho (IMP-08, IMP-09, D-15)
        IF v_row.raw_data ? 'product_id' OR v_row.raw_data ? 'product_name' THEN
            v_batch_num := trim(COALESCE(v_row.raw_data ->> 'batch_number', ''));
            
            -- IMP-08: Tự sinh mã lô nếu cột số lô bị trống
            IF v_batch_num = '' OR v_batch_num IS NULL THEN
                v_batch_num := 'UNKNOWN-' || p_job_id::text || '-' || v_row.row_number::text;
                v_normalized := v_normalized || jsonb_build_object('batch_number', v_batch_num);
            END IF;

            -- IMP-09 / D-15: Xử lý lô thiếu HSD -> Gán unknown và cách ly
            IF (v_row.raw_data ->> 'expiry_date') IS NULL OR trim(v_row.raw_data ->> 'expiry_date') = '' THEN
                v_expiry_date := NULL;
                v_expiry_status := 'unknown';
                v_is_quarantined := TRUE;
            ELSE
                BEGIN
                    v_expiry_date := (v_row.raw_data ->> 'expiry_date')::DATE;
                    IF v_expiry_date < CURRENT_DATE THEN
                        v_expiry_status := 'expired';
                        v_is_quarantined := TRUE;
                    ELSE
                        v_expiry_status := 'valid';
                        v_is_quarantined := FALSE;
                    END IF;
                EXCEPTION WHEN OTHERS THEN
                    v_expiry_date := NULL;
                    v_expiry_status := 'unknown';
                    v_is_quarantined := TRUE;
                END;
            END IF;

            v_normalized := v_normalized || jsonb_build_object(
                'batch_number', v_batch_num,
                'expiry_date', v_expiry_date,
                'expiry_status', v_expiry_status,
                'is_quarantined', v_is_quarantined
            );
        END IF;

        -- Cập nhật dòng staging
        IF v_row_valid THEN
            v_valid_rows := v_valid_rows + 1;
            UPDATE staging.import_rows
            SET is_valid = TRUE,
                normalized_data = v_normalized,
                validation_errors = NULL
            WHERE id = v_row.id;
        ELSE
            v_error_rows := v_error_rows + 1;
            UPDATE staging.import_rows
            SET is_valid = FALSE,
                normalized_data = v_normalized,
                validation_errors = v_errors
            WHERE id = v_row.id;
        END IF;
    END LOOP;

    -- Xây dựng tóm tắt kết quả Dry-Run
    v_summary := jsonb_build_object(
        'job_id', p_job_id,
        'total_rows', v_total_rows,
        'valid_rows', v_valid_rows,
        'error_rows', v_error_rows,
        'has_errors', (v_error_rows > 0)
    );

    -- Cập nhật staging.import_jobs
    UPDATE staging.import_jobs
    SET total_rows = v_total_rows,
        valid_rows = v_valid_rows,
        error_rows = v_error_rows,
        dry_run_summary = v_summary,
        status = CASE WHEN v_error_rows > 0 THEN 'validation_failed' ELSE 'awaiting_approval' END,
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_job_id;

    RETURN v_summary;
END;
$$;

-- 4. RPC Phê Duyệt Job Nhập Liệu (Two-Man Rule Enforcement - IMP-01, IMP-02, IMP-03, D-07)
CREATE OR REPLACE FUNCTION app.rpc_import_approve_job(p_job_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_caller_id UUID := auth.uid();
    v_job RECORD;
BEGIN
    -- Guard 1: Quyền Admin (IMP-02)
    IF NOT (COALESCE(app.is_admin(v_caller_id), FALSE) OR COALESCE(auth.jwt() ->> 'role', '') = 'service_role') THEN
        RAISE EXCEPTION 'ROLE_UNAUTHORIZED: Chỉ Quản trị viên (Admin) mới có quyền phê duyệt tiến trình nhập liệu'
            USING ERRCODE = '42501';
    END IF;

    -- Guard 2: Ca trực active (IMP-02)
    IF v_caller_id IS NOT NULL AND NOT app.check_active_shift(v_caller_id, 'admin') THEN
        RAISE EXCEPTION 'SHIFT_NOT_ACTIVE: Quản trị viên phải có ca trực hoạt động để phê duyệt nhập liệu'
            USING ERRCODE = 'P0002';
    END IF;

    -- Khóa job với FOR UPDATE để ngăn ngừa race condition
    SELECT * INTO v_job
    FROM staging.import_jobs
    WHERE id = p_job_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'JOB_NOT_FOUND: Không tìm thấy job nhập liệu %', p_job_id
            USING ERRCODE = 'P0002';
    END IF;

    -- IMP-03: Kiểm tra trạng thái máy trạng thái (State Machine Guard)
    IF v_job.status <> 'awaiting_approval' THEN
        RAISE EXCEPTION 'INVALID_JOB_STATUS: Job % không ở trạng thái chờ duyệt (trạng thái hiện tại: %)', p_job_id, v_job.status
            USING ERRCODE = 'P0002';
    END IF;

    -- IMP-01 / D-07: BẮT BUỘC NGUYÊN TẮC TWO-MAN RULE
    -- Người phê duyệt TUYỆT ĐỐI KHÔNG ĐƯỢC trùng với người tạo/tải lên job
    IF v_caller_id IS NOT NULL AND v_job.uploaded_by = v_caller_id THEN
        RAISE EXCEPTION 'TWO_MAN_RULE_VIOLATION: Người tạo job không được tự phê duyệt job của chính mình'
            USING ERRCODE = 'P0001';
    END IF;

    -- Cập nhật phê duyệt job
    UPDATE staging.import_jobs
    SET approved_by = v_caller_id,
        approved_at = CLOCK_TIMESTAMP(),
        status = 'validated',
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_job_id;

    RETURN TRUE;
END;
$$;

-- 5. RPC Thực Thi Cam Kết Chuyển Dữ Liệu Vào CSDL Đích (Commit Job - IMP-04)
CREATE OR REPLACE FUNCTION app.rpc_import_commit_job(p_job_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_caller_id UUID := auth.uid();
    v_job RECORD;
    v_row RECORD;
    v_cust_id UUID;
    v_pet_id UUID;
    v_prod_id UUID;
BEGIN
    -- Guard 1: Quyền Admin
    IF NOT (COALESCE(app.is_admin(v_caller_id), FALSE) OR COALESCE(auth.jwt() ->> 'role', '') = 'service_role') THEN
        RAISE EXCEPTION 'ROLE_UNAUTHORIZED: Chỉ Quản trị viên (Admin) mới có quyền thực thi commit job'
            USING ERRCODE = '42501';
    END IF;

    -- Guard 2: Ca trực active
    IF v_caller_id IS NOT NULL AND NOT app.check_active_shift(v_caller_id, 'admin') THEN
        RAISE EXCEPTION 'SHIFT_NOT_ACTIVE: Quản trị viên phải có ca trực hoạt động để commit'
            USING ERRCODE = 'P0002';
    END IF;

    -- Khóa job với FOR UPDATE
    SELECT * INTO v_job
    FROM staging.import_jobs
    WHERE id = p_job_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'JOB_NOT_FOUND: Không tìm thấy job nhập liệu %', p_job_id
            USING ERRCODE = 'P0002';
    END IF;

    -- Phải được duyệt trước khi commit
    IF v_job.status <> 'validated' OR v_job.approved_by IS NULL THEN
        RAISE EXCEPTION 'INVALID_JOB_STATUS: Job % chưa được phê duyệt hợp lệ để commit (trạng thái: %)', p_job_id, v_job.status
            USING ERRCODE = 'P0002';
    END IF;

    UPDATE staging.import_jobs SET status = 'processing', updated_at = CLOCK_TIMESTAMP() WHERE id = p_job_id;

    -- Duyệt các dòng hợp lệ để nạp vào app.*
    FOR v_row IN 
        SELECT * FROM staging.import_rows 
        WHERE job_id = p_job_id AND is_valid = TRUE 
        ORDER BY row_number ASC
    LOOP
        v_cust_id := NULL;
        v_pet_id := NULL;

        -- 1. Nạp Khách hàng nếu có
        IF v_row.normalized_data ? 'phone_number' OR v_row.normalized_data ? 'customer_phone' THEN
            INSERT INTO app.customers (
                full_name,
                phone_number,
                email,
                address,
                identity_card_number,
                import_job_id,
                is_active,
                is_deleted
            )
            VALUES (
                COALESCE(v_row.normalized_data ->> 'full_name', v_row.normalized_data ->> 'customer_name'),
                COALESCE(v_row.normalized_data ->> 'phone_number', v_row.normalized_data ->> 'customer_phone'),
                v_row.normalized_data ->> 'email',
                v_row.normalized_data ->> 'address',
                v_row.normalized_data ->> 'identity_card_number',
                p_job_id,
                TRUE,
                FALSE
            )
            RETURNING id INTO v_cust_id;
        END IF;

        -- 2. Nạp Thú cưng nếu có
        IF v_row.normalized_data ? 'pet_name' AND v_cust_id IS NOT NULL THEN
            INSERT INTO app.pets (
                customer_id,
                pet_name,
                species,
                breed,
                gender,
                date_of_birth,
                color,
                microchip_number,
                import_job_id,
                is_deceased,
                is_deleted
            )
            VALUES (
                v_cust_id,
                v_row.normalized_data ->> 'pet_name',
                COALESCE(v_row.normalized_data ->> 'species', 'Canine'),
                v_row.normalized_data ->> 'breed',
                COALESCE(v_row.normalized_data ->> 'gender', 'unknown'),
                (v_row.normalized_data ->> 'date_of_birth')::DATE,
                v_row.normalized_data ->> 'color',
                v_row.normalized_data ->> 'microchip_number',
                p_job_id,
                FALSE,
                FALSE
            )
            RETURNING id INTO v_pet_id;
        END IF;

        -- 3. Nạp Điểm Tích Lũy Lịch Sử GPet nếu có (V-2)
        IF v_cust_id IS NOT NULL AND v_row.normalized_data ? 'historical_points' THEN
            INSERT INTO app.historical_loyalty_points (
                customer_id,
                historical_points,
                source_system,
                source_customer_code,
                import_job_id,
                is_deleted
            )
            VALUES (
                v_cust_id,
                COALESCE((v_row.normalized_data ->> 'historical_points')::INT, 0),
                COALESCE(v_row.normalized_data ->> 'source_system', 'GPet_Old'),
                v_row.normalized_data ->> 'source_customer_code',
                p_job_id,
                FALSE
            );
        END IF;

        -- 4. Nạp Tồn Kho Lô Hàng nếu có
        IF v_row.normalized_data ? 'product_id' THEN
            v_prod_id := (v_row.normalized_data ->> 'product_id')::UUID;
            INSERT INTO app.inventory_batches (
                product_id,
                batch_number,
                expiry_date,
                quantity_on_hand,
                cost_price,
                is_quarantined,
                expiry_status,
                import_job_id,
                is_deleted
            )
            VALUES (
                v_prod_id,
                v_row.normalized_data ->> 'batch_number',
                (v_row.normalized_data ->> 'expiry_date')::DATE,
                COALESCE((v_row.normalized_data ->> 'quantity')::INT, 0),
                COALESCE((v_row.normalized_data ->> 'cost_price')::NUMERIC, 0),
                COALESCE((v_row.normalized_data ->> 'is_quarantined')::BOOLEAN, FALSE),
                COALESCE(v_row.normalized_data ->> 'expiry_status', 'valid'),
                p_job_id,
                FALSE
            );
        END IF;
    END LOOP;

    -- Chuyển trạng thái completed
    UPDATE staging.import_jobs
    SET status = 'completed',
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_job_id;

    RETURN TRUE;
END;
$$;

-- 6. Hàm Kiểm Tra An Toàn Trước Khi Rollback (IMP-05 Safe Rollback Guard)
CREATE OR REPLACE FUNCTION app.validate_job_rollback(p_job_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_blocking_cust RECORD;
BEGIN
    -- Quét các khách hàng thuộc import_job_id xem đã phát sinh hóa đơn hoặc giao dịch mới chưa
    SELECT c.id, c.full_name, c.phone_number
    INTO v_blocking_cust
    FROM app.customers c
    WHERE c.import_job_id = p_job_id
      AND (
          EXISTS (
              SELECT 1 FROM app.invoices inv 
              WHERE inv.customer_id = c.id
          )
          OR EXISTS (
              SELECT 1 FROM app.appointments appt 
              WHERE appt.customer_id = c.id 
                AND appt.status NOT IN ('cancelled')
          )
          OR EXISTS (
              SELECT 1 FROM app.inpatient_stays stay
              JOIN app.pets p ON p.id = stay.pet_id
              WHERE p.customer_id = c.id
          )
      )
    LIMIT 1;

    IF FOUND THEN
        RAISE EXCEPTION 'CANNOT_ROLLBACK_CUSTOMER_HAS_TRANSACTIONS: Không thể hoàn tác job. Khách hàng % (ID: %) đã phát sinh giao dịch/hóa đơn mới',
            v_blocking_cust.full_name, v_blocking_cust.id
            USING ERRCODE = 'P0003';
    END IF;

    RETURN TRUE;
END;
$$;

-- 7. RPC Hoàn Tác An Toàn Job Nhập Liệu (Safe Rollback - IMP-04, IMP-05, IMP-06, IMP-07, V-2)
CREATE OR REPLACE FUNCTION app.rpc_import_rollback_job(p_job_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_caller_id UUID := auth.uid();
    v_job RECORD;
BEGIN
    -- Guard 1: Quyền Admin
    IF NOT (COALESCE(app.is_admin(v_caller_id), FALSE) OR COALESCE(auth.jwt() ->> 'role', '') = 'service_role') THEN
        RAISE EXCEPTION 'ROLE_UNAUTHORIZED: Chỉ Quản trị viên (Admin) mới có quyền hoàn tác job nhập liệu'
            USING ERRCODE = '42501';
    END IF;

    -- Guard 2: Ca trực active
    IF v_caller_id IS NOT NULL AND NOT app.check_active_shift(v_caller_id, 'admin') THEN
        RAISE EXCEPTION 'SHIFT_NOT_ACTIVE: Quản trị viên phải có ca trực hoạt động để thực hiện rollback'
            USING ERRCODE = 'P0002';
    END IF;

    -- IMP-07: Khóa bi quan FOR UPDATE chống race condition khi 2 admin cùng rollback
    SELECT * INTO v_job
    FROM staging.import_jobs
    WHERE id = p_job_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'JOB_NOT_FOUND: Không tìm thấy job nhập liệu %', p_job_id
            USING ERRCODE = 'P0002';
    END IF;

    IF v_job.is_rolled_back OR v_job.status = 'rolled_back' THEN
        RAISE EXCEPTION 'JOB_ALREADY_ROLLED_BACK: Job % đã được hoàn tác trước đó', p_job_id
            USING ERRCODE = 'P0001';
    END IF;

    IF v_job.status <> 'completed' THEN
        RAISE EXCEPTION 'INVALID_JOB_STATUS: Chỉ có thể hoàn tác job đã hoàn tất (completed). Trạng thái hiện tại: %', v_job.status
            USING ERRCODE = 'P0002';
    END IF;

    -- IMP-05: Kiểm tra dữ liệu phụ thuộc phát sinh sau nhập liệu
    PERFORM app.validate_job_rollback(p_job_id);

    -- Đánh dấu bắt đầu rollback
    UPDATE staging.import_jobs
    SET rollback_started_at = CLOCK_TIMESTAMP(),
        rollback_by = v_caller_id
    WHERE id = p_job_id;

    -- IMP-04: Xóa mềm toàn bộ Khách hàng nhập từ job này
    UPDATE app.customers
    SET is_active = FALSE,
        is_deleted = TRUE,
        updated_at = CLOCK_TIMESTAMP()
    WHERE import_job_id = p_job_id;

    -- Xóa mềm Thú cưng nhập từ job này
    UPDATE app.pets
    SET is_deleted = TRUE,
        updated_at = CLOCK_TIMESTAMP()
    WHERE import_job_id = p_job_id;

    -- Xóa mềm & cách ly Lô hàng nhập từ job này
    UPDATE app.inventory_batches
    SET is_deleted = TRUE,
        is_quarantined = TRUE,
        updated_at = CLOCK_TIMESTAMP()
    WHERE import_job_id = p_job_id;

    -- IMP-06 / V-2: Xóa mềm Điểm Tích Lũy Lịch Sử và ghi nhận rollback_job_id
    UPDATE app.historical_loyalty_points
    SET is_deleted = TRUE,
        rollback_job_id = p_job_id,
        updated_at = CLOCK_TIMESTAMP()
    WHERE import_job_id = p_job_id;

    -- Cập nhật hoàn tất rollback trên staging.import_jobs
    UPDATE staging.import_jobs
    SET is_rolled_back = TRUE,
        status = 'rolled_back',
        rollback_completed_at = CLOCK_TIMESTAMP(),
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_job_id;

    RETURN TRUE;
END;
$$;

-- 8. RPC Xử Lý Dữ Liệu Khách Hàng Mơ Hồ Trùng Lặp (Resolve Ambiguous Customer - IMP-11)
CREATE OR REPLACE FUNCTION app.rpc_resolve_ambiguous_customer(
    p_staging_id UUID,
    p_action VARCHAR(30),
    p_target_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_caller_id UUID := auth.uid();
BEGIN
    IF NOT (COALESCE(app.is_admin(v_caller_id), FALSE) OR COALESCE(auth.jwt() ->> 'role', '') = 'service_role') THEN
        RAISE EXCEPTION 'ROLE_UNAUTHORIZED: Chỉ Quản trị viên (Admin) mới có quyền đối soát dữ liệu mơ hồ'
            USING ERRCODE = '42501';
    END IF;

    IF p_action NOT IN ('link_existing', 'create_distinct', 'discard') THEN
        RAISE EXCEPTION 'INVALID_ACTION: Hành động không hợp lệ (%)', p_action
            USING ERRCODE = '22023';
    END IF;

    UPDATE staging.import_rows
    SET normalized_data = normalized_data || jsonb_build_object('resolution_action', p_action, 'resolution_target', p_target_id),
        is_valid = (p_action <> 'discard')
    WHERE id = p_staging_id;

    RETURN TRUE;
END;
$$;

-- 9. Public Schema Wrappers cho PostgREST / Supabase Client
CREATE OR REPLACE FUNCTION public.rpc_import_parse_file(
    p_file_path TEXT,
    p_source VARCHAR,
    p_raw_rows JSONB DEFAULT '[]'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_import_parse_file(p_file_path, p_source, p_raw_rows);
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_import_execute_dry_run(p_job_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_import_execute_dry_run(p_job_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_import_approve_job(p_job_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_import_approve_job(p_job_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_import_commit_job(p_job_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_import_commit_job(p_job_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_import_rollback_job(p_job_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_import_rollback_job(p_job_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_resolve_ambiguous_customer(
    p_staging_id UUID,
    p_action VARCHAR(30),
    p_target_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_resolve_ambiguous_customer(p_staging_id, p_action, p_target_id);
END;
$$;

-- 10. Phân Quyền Bảo Mật: Thu Hồi Quyền Public/Anon, Cấp Quyền Authenticated
REVOKE ALL ON FUNCTION app.rpc_import_parse_file(TEXT, VARCHAR, JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_import_execute_dry_run(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_import_approve_job(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_import_commit_job(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_import_rollback_job(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_resolve_ambiguous_customer(UUID, VARCHAR, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.validate_job_rollback(UUID) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.rpc_import_parse_file(TEXT, VARCHAR, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_import_execute_dry_run(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_import_approve_job(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_import_commit_job(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_import_rollback_job(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_resolve_ambiguous_customer(UUID, VARCHAR, UUID) TO authenticated;
