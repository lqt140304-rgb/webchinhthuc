-- ==============================================================================
-- PHASE 4B MIGRATION 24: RETEST-02 REMEDIATION (PRIVACY, AUDIT, MFA AAL2, TWO-MAN RULE, TRUNCATE)
-- Project: Bệnh viện Thú y Lê Sơn
-- Remediates:
--   - R2-01 P1: Clinical Invoice Privacy (Auto-infer hidden, default-deny on all clinical services/Rx, block cashier unhiding)
--   - R2-02 P2: Audit Action Check Constraint Expansion (TOGGLE_VISIBILITY, QUARANTINE, RECYCLED_PHONE_RESOLVED, etc.)
--   - R2-03 P2: Enforce MFA AAL2 on privileged RPCs (import approve/commit/rollback, recycled phone, BYOD device)
--   - R2-04 P2: Strict Two-Man Rule Guard (service_role cannot bypass with NULL or same uploader)
--   - R2-06 P2: BEFORE TRUNCATE triggers on app.invoices, app.invoice_items, audit.audit_logs
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. MỞ RỘNG RÀNG BUỘC KIỂM TRA HÀNH ĐỘNG AUDIT (R2-02 P2)
-- ------------------------------------------------------------------------------
ALTER TABLE audit.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_action_check;
ALTER TABLE audit.audit_logs ADD CONSTRAINT audit_logs_action_check 
    CHECK (action::text = ANY (ARRAY[
        'INSERT',
        'UPDATE',
        'DELETE',
        'SECURITY_VIOLATION',
        'DATA_ROLLBACK',
        'STORAGE_PURGE_FAILED',
        'SYSTEM_ERROR',
        'QUARANTINE',
        'TOGGLE_VISIBILITY',
        'DEVICE_REGISTERED',
        'DEVICE_APPROVED',
        'DEVICE_SESSION_REVOKED',
        'DEVICE_WIPE_COMPLETED',
        'INPATIENT_MEDIA_UPLOADED',
        'AUTH_TRIGGER_EXCEPTION',
        'OFF_SHIFT_ADMIN_ACCESS',
        'PHYSICAL_STORAGE_OBJECT_DELETED',
        'PHYSICAL_STORAGE_DELETE_FAILED',
        'RECYCLED_PHONE_RESOLVED',
        'IMPORT_JOB_APPROVED',
        'IMPORT_JOB_COMMITTED',
        'IMPORT_JOB_ROLLED_BACK'
    ]::text[]));

-- ------------------------------------------------------------------------------
-- 2. HÀM KIỂM TRA BẮT BUỘC XÁC THỰC HAI BƯỚC MFA AAL2 (R2-03 P2)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION app.check_mfa_aal2()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF (auth.jwt()->>'aal') IS DISTINCT FROM 'aal2' THEN
        RAISE EXCEPTION 'MFA_AAL2_REQUIRED: Thao tác đặc quyền bắt buộc phiên đăng nhập đạt cấp độ xác thực đa yếu tố AAL2 (SEC-18, R2-03).'
            USING ERRCODE = '42501';
    END IF;
    RETURN TRUE;
END;
$$;

-- ------------------------------------------------------------------------------
-- 3. BẢO MẬT QUYỀN RIÊNG TƯ DÒNG MỤC HÓA ĐƠN (R2-01 P1 - CLINICAL INVOICE PRIVACY)
-- Tự động suy diễn trạng thái ẩn từ danh mục; cấm client quyết định; cấm nhân viên mở hiển thị dịch vụ y tế/thuốc Rx
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION app.fn_enforce_invoice_item_privacy()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_is_clinical BOOLEAN := FALSE;
    v_service_cat VARCHAR(50);
    v_product_cat VARCHAR(50);
    v_is_rx BOOLEAN := FALSE;
BEGIN
    -- 1. Tự động tính toán tổng giá dòng mục
    NEW.total_price := NEW.quantity * NEW.unit_price;

    -- 2. Dòng tự do (free-text: không có cả product_id và service_id) -> Bắt buộc ẩn
    IF NEW.product_id IS NULL AND NEW.service_id IS NULL THEN
        v_is_clinical := TRUE;
    END IF;

    -- 3. Kiểm tra dịch vụ (services):
    -- Mọi category y tế: medical, surgery, vaccine, lab -> Đều là lâm sàng (bắt buộc ẩn)
    -- Chỉ category 'spa' mới được phép hiển thị cho khách hàng
    IF NEW.service_id IS NOT NULL THEN
        SELECT category INTO v_service_cat
        FROM app.services
        WHERE id = NEW.service_id;

        IF v_service_cat IS NULL OR v_service_cat <> 'spa' THEN
            v_is_clinical := TRUE;
        END IF;
    END IF;

    -- 4. Kiểm tra sản phẩm (products):
    -- Thuốc kê đơn (is_prescription_drug = TRUE) HOẶC category y tế/dược/tiêu hao
    -- Chỉ sản phẩm bán lẻ/spa thông thường mới được xem xét công khai
    IF NEW.product_id IS NOT NULL THEN
        SELECT is_prescription_drug, LOWER(category)
        INTO v_is_rx, v_product_cat
        FROM app.products
        WHERE id = NEW.product_id;

        IF v_is_rx = TRUE OR v_product_cat IN ('drug', 'medication', 'medicine', 'clinical', 'consumable', 'pharma', 'surgery', 'lab', 'medical') THEN
            v_is_clinical := TRUE;
        ELSIF v_product_cat NOT IN ('retail', 'spa', 'accessory', 'food', 'toy', 'cosmetic', 'grooming') THEN
            v_is_clinical := TRUE;
        END IF;
    END IF;

    -- 5. SEC-16 & R2-01: Chặn đứng thao tác UPDATE cố tình gỡ cờ ẩn trên dòng mục lâm sàng
    IF TG_OP = 'UPDATE' THEN
        IF OLD.is_clinical_hidden = TRUE AND NEW.is_clinical_hidden = FALSE THEN
            IF v_is_clinical = TRUE THEN
                RAISE EXCEPTION 'CANNOT_UNHIDE_CLINICAL_ITEM: Dòng mục lâm sàng, phẫu thuật, xét nghiệm, tiêm phòng, vật tư hoặc thuốc điều trị tuyệt đối không được phép hiển thị cho khách hàng (V-5, S-4, R2-01).'
                    USING ERRCODE = 'P0001';
            END IF;
        END IF;
    END IF;

    -- 6. Áp dụng quy tắc tự suy diễn (Auto-inferred Backend Policy):
    -- Nếu là mục lâm sàng, buộc cờ is_clinical_hidden = TRUE bất kể client truyền vào giá trị gì
    IF v_is_clinical = TRUE THEN
        NEW.is_clinical_hidden := TRUE;
    ELSE
        NEW.is_clinical_hidden := COALESCE(NEW.is_clinical_hidden, FALSE);
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_invoice_item_privacy ON app.invoice_items;
CREATE TRIGGER trg_enforce_invoice_item_privacy
BEFORE INSERT OR UPDATE ON app.invoice_items
FOR EACH ROW EXECUTE FUNCTION app.fn_enforce_invoice_item_privacy();

-- Cập nhật RPC Toggle Visibility để chặn mở hiển thị các dòng mục lâm sàng
CREATE OR REPLACE FUNCTION app.rpc_toggle_invoice_item_visibility(
    p_invoice_item_id UUID,
    p_is_hidden BOOLEAN,
    p_reason TEXT DEFAULT 'Điều chỉnh hiển thị dòng mục'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_item RECORD;
    v_service_cat VARCHAR(50);
    v_product_cat VARCHAR(50);
    v_is_rx BOOLEAN := FALSE;
    v_is_clinical BOOLEAN := FALSE;
BEGIN
    IF NOT app.is_staff(auth.uid()) THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Thao tác yêu cầu quyền nhân viên.'
            USING ERRCODE = '42501';
    END IF;

    SELECT ii.*, inv.payment_status
    INTO v_item
    FROM app.invoice_items ii
    JOIN app.invoices inv ON inv.id = ii.invoice_id
    WHERE ii.id = p_invoice_item_id
    FOR UPDATE;

    IF v_item.id IS NULL THEN
        RAISE EXCEPTION 'ITEM_NOT_FOUND: Không tìm thấy dòng chi phí.'
            USING ERRCODE = 'P0002';
    END IF;

    IF v_item.payment_status IN ('paid', 'refunded') THEN
        RAISE EXCEPTION 'INVOICE_LOCKED: Hóa đơn đã thanh toán, không thể thay đổi hiển thị.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra bản chất lâm sàng
    IF v_item.product_id IS NULL AND v_item.service_id IS NULL THEN
        v_is_clinical := TRUE;
    END IF;

    IF v_item.service_id IS NOT NULL THEN
        SELECT category INTO v_service_cat FROM app.services WHERE id = v_item.service_id;
        IF v_service_cat IS NULL OR v_service_cat <> 'spa' THEN
            v_is_clinical := TRUE;
        END IF;
    END IF;

    IF v_item.product_id IS NOT NULL THEN
        SELECT is_prescription_drug, LOWER(category) INTO v_is_rx, v_product_cat
        FROM app.products WHERE id = v_item.product_id;
        IF v_is_rx = TRUE OR v_product_cat IN ('drug', 'medication', 'medicine', 'clinical', 'consumable', 'pharma', 'surgery', 'lab', 'medical') THEN
            v_is_clinical := TRUE;
        ELSIF v_product_cat NOT IN ('retail', 'spa', 'accessory', 'food', 'toy', 'cosmetic', 'grooming') THEN
            v_is_clinical := TRUE;
        END IF;
    END IF;

    -- S-4 & V-5 & R2-01: Cấm mở hiển thị dòng mục lâm sàng, phẫu thuật, xét nghiệm, tiêm phòng, thuốc Rx
    IF p_is_hidden = FALSE AND v_is_clinical = TRUE THEN
        RAISE EXCEPTION 'CLINICAL_RESTRICTION_CANNOT_REVEAL: Không được phép mở hiển thị dịch vụ y tế, phẫu thuật, xét nghiệm, tiêm phòng, vật tư hoặc thuốc điều trị nội bộ (V-5, S-4, R2-01).'
            USING ERRCODE = 'P0001';
    END IF;

    UPDATE app.invoice_items
    SET is_clinical_hidden = p_is_hidden
    WHERE id = p_invoice_item_id;

    INSERT INTO audit.audit_logs (
        table_name,
        record_id,
        action,
        new_data,
        changed_by,
        changed_at
    )
    VALUES (
        'invoice_items',
        p_invoice_item_id,
        'TOGGLE_VISIBILITY',
        jsonb_build_object('is_hidden', p_is_hidden, 'reason', p_reason),
        auth.uid(),
        CLOCK_TIMESTAMP()
    );

    RETURN TRUE;
END;
$$;

-- ------------------------------------------------------------------------------
-- 4. BẢO MẬT QUY TRÌNH DUYỆT NHẬP LIỆU: TWO-MAN RULE & MFA AAL2 (R2-03, R2-04)
-- Không cho phép service_role tự vượt Two-Man Rule; bắt buộc MFA AAL2
-- ------------------------------------------------------------------------------
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
    -- Guard 1: Quyền Admin (bắt buộc caller xác định, không chấp nhận NULL kể cả service_role - R2-04)
    IF v_caller_id IS NULL OR NOT app.is_admin(v_caller_id) THEN
        RAISE EXCEPTION 'ROLE_UNAUTHORIZED: Chỉ Quản trị viên (Admin) đã xác thực mới có quyền phê duyệt tiến trình nhập liệu (R2-04)'
            USING ERRCODE = '42501';
    END IF;

    -- Guard 2: Ca trực active (IMP-02)
    IF NOT app.check_active_shift(v_caller_id, 'admin') THEN
        RAISE EXCEPTION 'SHIFT_NOT_ACTIVE: Quản trị viên phải có ca trực hoạt động để phê duyệt nhập liệu'
            USING ERRCODE = 'P0002';
    END IF;

    -- Guard 3: MFA AAL2 (R2-03)
    PERFORM app.check_mfa_aal2();

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

    -- IMP-01 / D-07 / R2-04: BẮT BUỘC NGUYÊN TẮC TWO-MAN RULE KHÔNG NGOẠI LỆ
    -- Người phê duyệt TUYỆT ĐỐI KHÔNG ĐƯỢC trùng với người tạo/tải lên job
    IF v_job.uploaded_by IS NULL OR v_job.uploaded_by = v_caller_id THEN
        RAISE EXCEPTION 'TWO_MAN_RULE_VIOLATION: Người tạo job không được tự phê duyệt job của chính mình và bắt buộc hai người khác nhau (R2-04)'
            USING ERRCODE = 'P0001';
    END IF;

    -- Cập nhật phê duyệt job
    UPDATE staging.import_jobs
    SET approved_by = v_caller_id,
        approved_at = CLOCK_TIMESTAMP(),
        status = 'validated',
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_job_id;

    -- Ghi nhật ký kiểm toán
    INSERT INTO audit.audit_logs (table_name, record_id, action, new_data, changed_by)
    VALUES (
        'import_jobs',
        p_job_id,
        'IMPORT_JOB_APPROVED',
        jsonb_build_object('job_id', p_job_id, 'approved_by', v_caller_id, 'approved_at', CLOCK_TIMESTAMP()),
        v_caller_id
    );

    RETURN TRUE;
END;
$$;

-- Commit job: Bắt buộc MFA AAL2
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
    IF v_caller_id IS NULL OR NOT app.is_admin(v_caller_id) THEN
        RAISE EXCEPTION 'ROLE_UNAUTHORIZED: Chỉ Quản trị viên (Admin) đã xác thực mới có quyền thực thi commit job'
            USING ERRCODE = '42501';
    END IF;

    -- Guard 2: Ca trực active
    IF NOT app.check_active_shift(v_caller_id, 'admin') THEN
        RAISE EXCEPTION 'SHIFT_NOT_ACTIVE: Quản trị viên phải có ca trực hoạt động để commit'
            USING ERRCODE = 'P0002';
    END IF;

    -- Guard 3: MFA AAL2 (R2-03)
    PERFORM app.check_mfa_aal2();

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
                is_active
            )
            VALUES (
                COALESCE(v_row.normalized_data ->> 'full_name', v_row.normalized_data ->> 'customer_name'),
                COALESCE(v_row.normalized_data ->> 'phone_number', v_row.normalized_data ->> 'customer_phone'),
                v_row.normalized_data ->> 'email',
                v_row.normalized_data ->> 'address',
                v_row.normalized_data ->> 'identity_card_number',
                p_job_id,
                TRUE
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
                import_job_id
            )
            VALUES (
                v_cust_id,
                v_row.normalized_data ->> 'pet_name',
                COALESCE(v_row.normalized_data ->> 'species', 'Chó'),
                v_row.normalized_data ->> 'breed',
                COALESCE(v_row.normalized_data ->> 'gender', 'unknown'),
                (v_row.normalized_data ->> 'date_of_birth')::DATE,
                v_row.normalized_data ->> 'color',
                v_row.normalized_data ->> 'microchip_number',
                p_job_id
            )
            RETURNING id INTO v_pet_id;
        END IF;

        -- 3. Nạp Điểm Tích Lũy Lịch Sử nếu có
        IF v_row.normalized_data ? 'historical_points' AND v_cust_id IS NOT NULL THEN
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

    UPDATE staging.import_jobs
    SET status = 'completed',
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_job_id;

    INSERT INTO audit.audit_logs (table_name, record_id, action, new_data, changed_by)
    VALUES (
        'import_jobs',
        p_job_id,
        'IMPORT_JOB_COMMITTED',
        jsonb_build_object('job_id', p_job_id, 'committed_by', v_caller_id, 'committed_at', CLOCK_TIMESTAMP()),
        v_caller_id
    );

    RETURN TRUE;
END;
$$;

-- Rollback job: Bắt buộc MFA AAL2
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
    IF v_caller_id IS NULL OR NOT app.is_admin(v_caller_id) THEN
        RAISE EXCEPTION 'ROLE_UNAUTHORIZED: Chỉ Quản trị viên (Admin) đã xác thực mới có quyền thực thi rollback job'
            USING ERRCODE = '42501';
    END IF;

    -- Guard 2: Ca trực active
    IF NOT app.check_active_shift(v_caller_id, 'admin') THEN
        RAISE EXCEPTION 'SHIFT_NOT_ACTIVE: Quản trị viên phải có ca trực hoạt động để rollback'
            USING ERRCODE = 'P0002';
    END IF;

    -- Guard 3: MFA AAL2 (R2-03)
    PERFORM app.check_mfa_aal2();

    -- Khóa job với FOR UPDATE
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

    INSERT INTO audit.audit_logs (table_name, record_id, action, new_data, changed_by)
    VALUES (
        'import_jobs',
        p_job_id,
        'IMPORT_JOB_ROLLED_BACK',
        jsonb_build_object('job_id', p_job_id, 'rolled_back_by', v_caller_id, 'rolled_back_at', CLOCK_TIMESTAMP()),
        v_caller_id
    );

    RETURN TRUE;
END;
$$;

-- Staging & Public Aliases for Import RPCs
CREATE OR REPLACE FUNCTION staging.rpc_approve_import_job(p_job_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_import_approve_job(p_job_id);
END;
$$;

CREATE OR REPLACE FUNCTION staging.rpc_commit_import_job(p_job_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_import_commit_job(p_job_id);
END;
$$;

CREATE OR REPLACE FUNCTION staging.rpc_rollback_import_job(p_job_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_import_rollback_job(p_job_id);
END;
$$;

GRANT EXECUTE ON FUNCTION staging.rpc_approve_import_job(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION staging.rpc_commit_import_job(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION staging.rpc_rollback_import_job(UUID) TO authenticated;

-- ------------------------------------------------------------------------------
-- 5. RPC XỬ LÝ SỐ ĐIỆN THOẠI TÁI CẤP (RECYCLED PHONE) — BẮT BUỘC MFA AAL2 (R2-03)
-- Kịch bản SEC-21, SEC-22, SEC-23, SEC-24, SEC-41, SEC-42, SEC-43
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION app.rpc_resolve_recycled_phone(
    p_old_customer_id UUID,
    p_new_customer_id UUID,
    p_new_user_id UUID,
    p_notes TEXT DEFAULT 'Tái cấp số điện thoại'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_link_updated INT := 0;
BEGIN
    -- 1. SEC-21 & SEC-43: Bắt buộc Quản lý (Admin) có ca trực hoạt động
    IF NOT app.check_active_shift(v_admin_id, 'admin') THEN
        RAISE EXCEPTION 'ROLE_UNAUTHORIZED: Chỉ Quản trị viên trong ca trực hoạt động mới có quyền giải quyết SĐT tái cấp'
            USING ERRCODE = '42501';
    END IF;

    -- 2. SEC-22 & R2-03: Bắt buộc xác thực đa yếu tố AAL2
    PERFORM app.check_mfa_aal2();

    -- 3. SEC-23: Chặn nếu old_customer_id = new_customer_id
    IF p_old_customer_id = p_new_customer_id THEN
        RAISE EXCEPTION 'INVALID_ARGUMENTS: Hồ sơ khách cũ và khách mới không được trùng nhau (SEC-23)'
            USING ERRCODE = 'P0001';
    END IF;

    -- 4. SEC-42: Kiểm tra cả hai khách hàng tồn tại
    IF NOT EXISTS (SELECT 1 FROM app.customers WHERE id = p_old_customer_id) OR
       NOT EXISTS (SELECT 1 FROM app.customers WHERE id = p_new_customer_id) THEN
        RAISE EXCEPTION 'CUSTOMER_NOT_FOUND: Một trong hai hồ sơ khách hàng không tồn tại (SEC-42)'
            USING ERRCODE = 'P0002';
    END IF;

    -- 5. SEC-24 & SEC-41: Kiểm tra liên kết của user_id mới với new_customer_id tồn tại và đang pending
    IF NOT EXISTS (
        SELECT 1 FROM app.customer_user_links 
        WHERE customer_id = p_new_customer_id AND user_id = p_new_user_id AND link_status = 'pending'
    ) THEN
        RAISE EXCEPTION 'LINK_NOT_FOUND: Không tìm thấy liên kết chờ duyệt (pending) của người dùng mới (SEC-24, SEC-41)'
            USING ERRCODE = 'P0002';
    END IF;

    -- 6. SEC-42: Thu hồi toàn bộ liên kết approved/pending của khách cũ (chuyển sang unlinked)
    UPDATE app.customer_user_links
    SET link_status = 'unlinked'
    WHERE customer_id = p_old_customer_id AND link_status IN ('approved', 'pending');

    -- 7. Duyệt liên kết cho khách mới
    UPDATE app.customer_user_links
    SET link_status = 'approved',
        verified_by = v_admin_id,
        verified_at = CLOCK_TIMESTAMP()
    WHERE customer_id = p_new_customer_id 
      AND user_id = p_new_user_id 
      AND link_status = 'pending';

    -- 8. SEC-41: Ghi nhận nhật ký kiểm toán bất biến
    INSERT INTO audit.audit_logs (
        table_name,
        record_id,
        action,
        new_data,
        changed_by,
        changed_at
    )
    VALUES (
        'customers',
        p_new_customer_id,
        'RECYCLED_PHONE_RESOLVED',
        jsonb_build_object(
            'old_customer_id', p_old_customer_id,
            'new_customer_id', p_new_customer_id,
            'new_user_id', p_new_user_id,
            'notes', p_notes,
            'resolved_by', v_admin_id
        ),
        v_admin_id,
        CLOCK_TIMESTAMP()
    );

    RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_resolve_recycled_phone(
    p_old_customer_id UUID,
    p_new_customer_id UUID,
    p_new_user_id UUID,
    p_notes TEXT DEFAULT 'Tái cấp số điện thoại'
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_resolve_recycled_phone(p_old_customer_id, p_new_customer_id, p_new_user_id, p_notes);
$$;

REVOKE ALL ON FUNCTION app.rpc_resolve_recycled_phone(UUID, UUID, UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_resolve_recycled_phone(UUID, UUID, UUID, TEXT) TO authenticated;

-- ------------------------------------------------------------------------------
-- 6. CHẶN LỆNH TRUNCATE TRÊN HÓA ĐƠN & AUDIT LOGS (R2-06 P2)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION app.fn_prevent_financial_truncate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RAISE EXCEPTION 'FINANCIAL_LEDGER_IMMUTABLE: Thao tác TRUNCATE trên sổ cái hóa đơn/chi phí bị cấm tuyệt đối (Immutability Invariant).'
        USING ERRCODE = 'P0001';
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_invoices_truncate ON app.invoices;
CREATE TRIGGER trg_prevent_invoices_truncate
BEFORE TRUNCATE ON app.invoices
FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_financial_truncate();

DROP TRIGGER IF EXISTS trg_prevent_invoice_items_truncate ON app.invoice_items;
CREATE TRIGGER trg_prevent_invoice_items_truncate
BEFORE TRUNCATE ON app.invoice_items
FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_financial_truncate();

CREATE OR REPLACE FUNCTION audit.fn_prevent_audit_truncate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RAISE EXCEPTION 'AUDIT_LOG_IMMUTABLE: Thao tác TRUNCATE trên bảng nhật ký kiểm toán bị cấm tuyệt đối (Immutability Invariant).'
        USING ERRCODE = 'P0001';
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_audit_logs_truncate ON audit.audit_logs;
CREATE TRIGGER trg_prevent_audit_logs_truncate
BEFORE TRUNCATE ON audit.audit_logs
FOR EACH STATEMENT EXECUTE FUNCTION audit.fn_prevent_audit_truncate();
