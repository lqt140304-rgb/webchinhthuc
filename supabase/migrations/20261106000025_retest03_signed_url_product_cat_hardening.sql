-- ==============================================================================
-- MIGRATION: 20261106000025_retest03_signed_url_product_cat_hardening.sql
-- Project: Bệnh viện Thú y Lê Sơn
-- Phase 4B: Retest-03 Remediation (V3-01, V3-02, P3 Polish)
-- Invariants Enforced:
--   1. V3-01: Standard Supabase Storage Signed URLs (Zero hardcoded secrets, HS256 base64url JWT)
--   2. V3-01: Revoke anon from app.rpc_verify_media_signed_url & internal verification routines
--   3. P3: Universal TRUNCATE protection across all sensitive clinical, financial & audit tables
--   4. P3: Strict category CHECK constraint on app.products (anti-typo invoice privacy)
--   5. P3: GRANT USAGE ON SCHEMA staging TO authenticated for staging wrappers
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CHUẨN HÓA DANH MỤC SẢN PHẨM & CẬP NHẬT TRIGGER TỰ SUY DIỄN HÓA ĐƠN (P3)
-- ------------------------------------------------------------------------------
ALTER TABLE app.products
    DROP CONSTRAINT IF EXISTS products_category_check;

ALTER TABLE app.products
    ADD CONSTRAINT products_category_check
    CHECK (category IN (
        -- Nhóm lâm sàng / y tế / bắt buộc ẩn (Clinical / Hidden)
        'pharmacy', 'drug', 'medication', 'medicine', 'clinical', 'consumable',
        'pharma', 'surgery', 'lab', 'medical', 'vaccine', 'spa_supply',
        -- Nhóm bán lẻ / spa / công khai nếu non-Rx (Retail / Shareable)
        'retail', 'spa', 'accessory', 'food', 'toy', 'cosmetic', 'grooming'
    ));

-- Cập nhật hàm tự suy diễn quyền riêng tư dòng hóa đơn
CREATE OR REPLACE FUNCTION app.fn_enforce_invoice_item_privacy()
RETURNS trigger
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
    -- 1. Tính toán tổng giá dòng mục
    NEW.total_price := NEW.quantity * NEW.unit_price;

    -- 2. Dòng tự do (free-text: không có product_id và service_id) -> Bắt buộc ẩn
    IF NEW.product_id IS NULL AND NEW.service_id IS NULL THEN
        v_is_clinical := TRUE;
    END IF;

    -- 3. Kiểm tra dịch vụ (services):
    -- Chỉ category 'spa' mới được phép hiển thị cho khách hàng; mọi category y tế đều là lâm sàng
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
    -- Chỉ sản phẩm bán lẻ/spa thông thường (non-Rx) mới được hiển thị
    IF NEW.product_id IS NOT NULL THEN
        SELECT is_prescription_drug, LOWER(category)
        INTO v_is_rx, v_product_cat
        FROM app.products
        WHERE id = NEW.product_id;

        IF v_is_rx = TRUE OR v_product_cat IN (
            'pharmacy', 'drug', 'medication', 'medicine', 'clinical', 'consumable',
            'pharma', 'surgery', 'lab', 'medical', 'vaccine', 'spa_supply'
        ) THEN
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
    IF v_is_clinical = TRUE THEN
        NEW.is_clinical_hidden := TRUE;
    ELSE
        NEW.is_clinical_hidden := COALESCE(NEW.is_clinical_hidden, FALSE);
    END IF;

    RETURN NEW;
END;
$$;

-- ------------------------------------------------------------------------------
-- 2. V3-01: CHUẨN HÓA SIGNED URL SUPABASE STORAGE (KHÔNG HARDCODE SECRET)
-- ------------------------------------------------------------------------------

-- Helper nội bộ: Ký standard Supabase Storage Token (HS256 base64url JWT)
-- Secret được đọc an toàn từ setting runtime app.settings.jwt_secret của Supabase
CREATE OR REPLACE FUNCTION app.sign_storage_download_token(
    p_bucket TEXT,
    p_storage_path TEXT,
    p_expires_seconds INT DEFAULT 900
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_secret TEXT := current_setting('app.settings.jwt_secret', true);
    v_header TEXT;
    v_payload TEXT;
    v_msg TEXT;
    v_sig TEXT;
    v_now BIGINT := extract(epoch from clock_timestamp())::bigint;
    v_exp BIGINT := v_now + p_expires_seconds;
    v_full_path TEXT := p_bucket || '/' || p_storage_path;
BEGIN
    IF v_secret IS NULL OR v_secret = '' THEN
        RAISE EXCEPTION 'STORAGE_SECRET_UNAVAILABLE: Không thể đọc JWT secret của Supabase'
            USING ERRCODE = 'P0001';
    END IF;

    -- 1. Base64url Header
    v_header := translate(encode(convert_to('{"alg":"HS256","typ":"JWT"}', 'utf8'), 'base64'), E'+/=\n', '-_');

    -- 2. Base64url Payload (Format chuẩn Supabase Storage API)
    v_payload := translate(encode(convert_to(json_build_object(
        'url', v_full_path,
        'scope', 'download',
        'iat', v_now,
        'exp', v_exp
    )::text, 'utf8'), 'base64'), E'+/=\n', '-_');

    -- 3. HMAC-SHA256 Signature
    v_msg := v_header || '.' || v_payload;
    v_sig := translate(encode(extensions.hmac(v_msg::bytea, v_secret::bytea, 'sha256'), 'base64'), E'+/=\n', '-_');

    RETURN v_msg || '.' || v_sig;
END;
$$;

REVOKE ALL ON FUNCTION app.sign_storage_download_token(TEXT, TEXT, INT) FROM anon, public;
GRANT EXECUTE ON FUNCTION app.sign_storage_download_token(TEXT, TEXT, INT) TO authenticated;

-- Cập nhật RPC app.rpc_generate_media_signed_url: Không còn HMAC tự chế, không hardcode secret
CREATE OR REPLACE FUNCTION app.rpc_generate_media_signed_url(
    p_media_id UUID,
    p_device_fingerprint_hash CHAR(64) DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_caller_id UUID := auth.uid();
    v_media RECORD;
    v_customer_id UUID;
    v_is_staff BOOLEAN := FALSE;
    v_now TIMESTAMPTZ := clock_timestamp();
    v_expires_at TIMESTAMPTZ := v_now + INTERVAL '15 minutes';
    v_token TEXT;
    v_signed_url TEXT;
BEGIN
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Người dùng chưa đăng nhập'
            USING ERRCODE = 'P0001';
    END IF;

    -- Lấy thông tin tệp media
    SELECT m.*, s.pet_id, p.customer_id AS pet_customer_id, b.status AS bulletin_status
    INTO v_media
    FROM app.inpatient_daily_media m
    JOIN app.inpatient_stays s ON m.stay_id = s.id
    JOIN app.pets p ON s.pet_id = p.id
    LEFT JOIN app.pet_medical_bulletins b ON m.bulletin_id = b.id
    WHERE m.id = p_media_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'MEDIA_NOT_FOUND: Tệp media không tồn tại'
            USING ERRCODE = 'P0001';
    END IF;

    IF v_media.is_purged THEN
        RAISE EXCEPTION 'MEDIA_PURGED: Tệp media đã bị xóa sau 60 ngày theo quy định D-10'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra nếu caller là nhân viên trực
    IF app.check_active_shift(v_caller_id, 'staff') OR 
       app.check_active_shift(v_caller_id, 'veterinarian') OR 
       app.check_active_shift(v_caller_id, 'nurse') OR 
       app.check_active_shift(v_caller_id, 'spa') OR 
       app.check_active_shift(v_caller_id, 'admin') THEN
        v_is_staff := TRUE;
        -- Nhân viên phải xác thực thiết bị nếu truyền fingerprint
        IF p_device_fingerprint_hash IS NOT NULL THEN
            PERFORM app.rpc_verify_staff_device(p_device_fingerprint_hash);
        END IF;
    END IF;

    -- Nếu không phải nhân viên, kiểm tra quyền khách hàng (D-12 Medical Privacy Boundary)
    IF NOT v_is_staff THEN
        v_customer_id := app.get_customer_id_for_user(v_caller_id);

        IF v_customer_id IS NULL THEN
            RAISE EXCEPTION 'UNAUTHORIZED_MEDIA_ACCESS: Người dùng không phải là khách hàng hợp lệ'
                USING ERRCODE = '42501';
        END IF;

        -- Khách chỉ được xem thú cưng của mình
        IF v_media.pet_customer_id <> v_customer_id THEN
            RAISE EXCEPTION 'UNAUTHORIZED_MEDIA_ACCESS: Khách hàng không sở hữu thú cưng này'
                USING ERRCODE = '42501';
        END IF;

        -- Media phải được bác sĩ phê duyệt
        IF NOT v_media.is_approved_for_customer THEN
            RAISE EXCEPTION 'UNAUTHORIZED_MEDIA_ACCESS: Tệp media chưa được bác sĩ phê duyệt chia sẻ'
                USING ERRCODE = '42501';
        END IF;

        -- Nếu gắn bản tin, bản tin phải ở trạng thái published
        IF v_media.bulletin_id IS NOT NULL AND v_media.bulletin_status <> 'published' THEN
            RAISE EXCEPTION 'UNAUTHORIZED_MEDIA_ACCESS: Bản tin đính kèm chưa được xuất bản'
                USING ERRCODE = '42501';
        END IF;
    END IF;

    -- Sinh standard Supabase Storage Token thời hạn đúng 900 giây (15 phút)
    v_token := app.sign_storage_download_token('inpatient-media-private', v_media.storage_path, 900);
    v_signed_url := '/storage/v1/object/sign/inpatient-media-private/' || v_media.storage_path || '?token=' || v_token;

    RETURN jsonb_build_object(
        'media_id', p_media_id,
        'bucket_id', 'inpatient-media-private',
        'storage_path', v_media.storage_path,
        'signed_url', v_signed_url,
        'media_type', v_media.media_type,
        'expires_at', v_expires_at,
        'valid_seconds', 900
    );
END;
$$;

-- Cập nhật app.rpc_request_media_signed_url và public wrapper
CREATE OR REPLACE FUNCTION app.rpc_request_media_signed_url(p_media_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN app.rpc_generate_media_signed_url(p_media_id, NULL);
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_request_media_signed_url(p_media_id UUID)
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_generate_media_signed_url(p_media_id, NULL);
$$;

-- Thu hồi quyền EXECUTE anon trên app.rpc_verify_media_signed_url (V3-01)
REVOKE ALL ON FUNCTION app.rpc_verify_media_signed_url(UUID, BIGINT, TEXT) FROM anon, public;
GRANT EXECUTE ON FUNCTION app.rpc_verify_media_signed_url(UUID, BIGINT, TEXT) TO authenticated;

-- Đảm bảo quyền EXECUTE các RPC media chỉ cấp cho authenticated
GRANT EXECUTE ON FUNCTION app.rpc_generate_media_signed_url(UUID, CHAR(64)) TO authenticated;
GRANT EXECUTE ON FUNCTION app.rpc_request_media_signed_url(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_request_media_signed_url(UUID) TO authenticated;
REVOKE ALL ON FUNCTION public.rpc_request_media_signed_url(UUID) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.rpc_request_media_signed_url(UUID) TO authenticated;

-- ------------------------------------------------------------------------------
-- 3. MỞ RỘNG KIỂM SOÁT TRUNCATE CHO TOÀN BỘ CÁC BẢNG LÂM SÀNG & TÀI CHÍNH (P3)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app.fn_prevent_table_truncate()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RAISE EXCEPTION 'CANNOT_TRUNCATE_PROTECTED_TABLE: Bảng % được bảo vệ tính toàn vẹn và bất biến, nghiêm cấm thao tác TRUNCATE.', TG_TABLE_NAME
        USING ERRCODE = '55000';
    RETURN NULL;
END;
$$;

-- 1. Clinical records
DROP TRIGGER IF EXISTS trg_prevent_clinical_records_truncate ON app.clinical_records;
CREATE TRIGGER trg_prevent_clinical_records_truncate
    BEFORE TRUNCATE ON app.clinical_records
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

-- 2. Prescriptions
DROP TRIGGER IF EXISTS trg_prevent_prescriptions_truncate ON app.prescriptions;
CREATE TRIGGER trg_prevent_prescriptions_truncate
    BEFORE TRUNCATE ON app.prescriptions
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

DROP TRIGGER IF EXISTS trg_prevent_clinical_amendments_truncate ON app.clinical_amendments;
CREATE TRIGGER trg_prevent_clinical_amendments_truncate
    BEFORE TRUNCATE ON app.clinical_amendments
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

DROP TRIGGER IF EXISTS trg_prevent_medical_consents_truncate ON app.pet_medical_consents;
CREATE TRIGGER trg_prevent_medical_consents_truncate
    BEFORE TRUNCATE ON app.pet_medical_consents
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

-- 3. Inpatient stays & media & bulletins & logs
DROP TRIGGER IF EXISTS trg_prevent_inpatient_stays_truncate ON app.inpatient_stays;
CREATE TRIGGER trg_prevent_inpatient_stays_truncate
    BEFORE TRUNCATE ON app.inpatient_stays
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

DROP TRIGGER IF EXISTS trg_prevent_inpatient_media_truncate ON app.inpatient_daily_media;
CREATE TRIGGER trg_prevent_inpatient_media_truncate
    BEFORE TRUNCATE ON app.inpatient_daily_media
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

DROP TRIGGER IF EXISTS trg_prevent_pet_bulletins_truncate ON app.pet_medical_bulletins;
CREATE TRIGGER trg_prevent_pet_bulletins_truncate
    BEFORE TRUNCATE ON app.pet_medical_bulletins
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

DROP TRIGGER IF EXISTS trg_prevent_inpatient_logs_truncate ON app.inpatient_daily_logs;
CREATE TRIGGER trg_prevent_inpatient_logs_truncate
    BEFORE TRUNCATE ON app.inpatient_daily_logs
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

-- 4. Clinical diagnostics & vitals & orders
DROP TRIGGER IF EXISTS trg_prevent_clinical_vitals_truncate ON app.clinical_record_vitals;
CREATE TRIGGER trg_prevent_clinical_vitals_truncate
    BEFORE TRUNCATE ON app.clinical_record_vitals
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

DROP TRIGGER IF EXISTS trg_prevent_clinical_diagnoses_truncate ON app.clinical_diagnoses;
CREATE TRIGGER trg_prevent_clinical_diagnoses_truncate
    BEFORE TRUNCATE ON app.clinical_diagnoses
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

DROP TRIGGER IF EXISTS trg_prevent_treatment_orders_truncate ON app.treatment_orders;
CREATE TRIGGER trg_prevent_treatment_orders_truncate
    BEFORE TRUNCATE ON app.treatment_orders
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

-- 5. Appointments & payments & inventory batches
DROP TRIGGER IF EXISTS trg_prevent_med_appointments_truncate ON app.medical_appointments;
CREATE TRIGGER trg_prevent_med_appointments_truncate
    BEFORE TRUNCATE ON app.medical_appointments
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

DROP TRIGGER IF EXISTS trg_prevent_invoice_payments_truncate ON app.invoice_payments;
CREATE TRIGGER trg_prevent_invoice_payments_truncate
    BEFORE TRUNCATE ON app.invoice_payments
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

DROP TRIGGER IF EXISTS trg_prevent_inventory_batches_truncate ON app.inventory_batches;
CREATE TRIGGER trg_prevent_inventory_batches_truncate
    BEFORE TRUNCATE ON app.inventory_batches
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

-- 6. Inventory transactions
DROP TRIGGER IF EXISTS trg_prevent_inventory_trans_truncate ON app.inventory_transactions;
CREATE TRIGGER trg_prevent_inventory_trans_truncate
    BEFORE TRUNCATE ON app.inventory_transactions
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

-- 7. Master entities (Pets & Customers)
DROP TRIGGER IF EXISTS trg_prevent_pets_truncate ON app.pets;
CREATE TRIGGER trg_prevent_pets_truncate
    BEFORE TRUNCATE ON app.pets
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

DROP TRIGGER IF EXISTS trg_prevent_customers_truncate ON app.customers;
CREATE TRIGGER trg_prevent_customers_truncate
    BEFORE TRUNCATE ON app.customers
    FOR EACH STATEMENT EXECUTE FUNCTION app.fn_prevent_table_truncate();

-- Thu hồi quyền TRUNCATE triệt để trên toàn bộ schema app, audit, staging từ non-superuser
REVOKE TRUNCATE ON ALL TABLES IN SCHEMA app FROM authenticated, anon, public;
REVOKE TRUNCATE ON ALL TABLES IN SCHEMA audit FROM authenticated, anon, public;
REVOKE TRUNCATE ON ALL TABLES IN SCHEMA staging FROM authenticated, anon, public;

-- ------------------------------------------------------------------------------
-- 4. CẤP QUYỀN USAGE SCHEMA STAGING CHO AUTHENTICATED (P3)
-- ------------------------------------------------------------------------------
GRANT USAGE ON SCHEMA staging TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA staging TO authenticated;

-- Đảm bảo service_role có quyền đọc các view công khai
GRANT SELECT ON ALL TABLES IN SCHEMA public TO service_role;
