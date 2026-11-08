-- ==============================================================================
-- PHASE 4B MIGRATION 15: INVENTORY BATCH MANAGEMENT & CONCURRENT DISPATCH (GATE 6)
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section III.2, VII.3, VIII.2, Gate 6)
-- Invariants Enforced:
--   - D-15: Hàng thiếu HSD: Gán expiry_status = 'unknown', khóa cách ly (is_quarantined = TRUE),
--     cấm xuất kho/kê đơn tại tầng RPC.
--   - Pessimistic Locking (SELECT ... FOR UPDATE): Chống race condition, chống trừ tồn kho trùng.
--   - SEC-14: Xuất kho lô hàng cách ly -> Bị chặn BATCH_QUARANTINED.
-- ==============================================================================

-- 1. Bổ sung cột expiry_status và nới lỏng expiry_date cho D-15
ALTER TABLE app.inventory_batches ALTER COLUMN expiry_date DROP NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'app' AND table_name = 'inventory_batches' AND column_name = 'expiry_status'
    ) THEN
        ALTER TABLE app.inventory_batches 
        ADD COLUMN expiry_status VARCHAR(20) NOT NULL DEFAULT 'valid' 
        CHECK (expiry_status IN ('valid', 'unknown', 'expired'));
    END IF;
END $$;

-- 2. Trigger Tự Động Khóa Cách Ly Hàng Thiếu HSD Hoặc Quá Hạn (D-15 Policy)
CREATE OR REPLACE FUNCTION app.fn_enforce_batch_expiry_policy()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- D-15: Nếu không rõ HSD hoặc HSD rỗng -> Buộc chuyển sang unknown và cách ly
    IF NEW.expiry_status = 'unknown' OR NEW.expiry_date IS NULL THEN
        NEW.expiry_status := 'unknown';
        NEW.is_quarantined := TRUE;
    ELSIF NEW.expiry_date < CURRENT_DATE THEN
        NEW.expiry_status := 'expired';
        NEW.is_quarantined := TRUE;
    END IF;

    NEW.updated_at := CLOCK_TIMESTAMP();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_batch_expiry_policy ON app.inventory_batches;
CREATE TRIGGER trg_enforce_batch_expiry_policy
BEFORE INSERT OR UPDATE ON app.inventory_batches
FOR EACH ROW EXECUTE FUNCTION app.fn_enforce_batch_expiry_policy();

-- 3. RPC Xuất Kho An Toàn Với Khóa Bi Quan (Pessimistic Locking - SEC-14)
CREATE OR REPLACE FUNCTION app.rpc_dispatch_inventory(
    p_batch_id UUID,
    p_quantity INT,
    p_transaction_type VARCHAR(20) DEFAULT 'EXPORT_SALE',
    p_reference_order_id UUID DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_batch RECORD;
    v_tx_id UUID;
BEGIN
    IF p_quantity <= 0 THEN
        RAISE EXCEPTION 'INVALID_QUANTITY: Số lượng xuất kho phải lớn hơn 0.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra ca trực nhân viên hợp lệ (kho/bác sĩ/điều dưỡng/thu ngân/admin)
    IF NOT app.is_staff(auth.uid()) THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Thao tác xuất kho yêu cầu nhân viên bệnh viện.'
            USING ERRCODE = '42501';
    END IF;

    -- Khóa bi quan hàng tồn kho chống Race Condition (Pessimistic Locking FOR UPDATE)
    SELECT * INTO v_batch
    FROM app.inventory_batches
    WHERE id = p_batch_id
    FOR UPDATE;

    IF v_batch.id IS NULL THEN
        RAISE EXCEPTION 'BATCH_NOT_FOUND: Lô hàng không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    -- D-15 & SEC-14 Invariant: Lô hàng bị cách ly hoặc không rõ HSD tuyệt đối cấm xuất bán/kê đơn
    IF v_batch.is_quarantined = TRUE OR v_batch.expiry_status = 'unknown' THEN
        RAISE EXCEPTION 'BATCH_QUARANTINED: Lô hàng đang bị cách ly hoặc chưa rõ hạn sử dụng (D-15). Cấm xuất kho/kê đơn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra đủ tồn kho
    IF v_batch.quantity_on_hand < p_quantity THEN
        RAISE EXCEPTION 'INSUFFICIENT_STOCK: Số lượng tồn kho không đủ để xuất kho (Hiện có: %, Yêu cầu: %).',
            v_batch.quantity_on_hand, p_quantity
            USING ERRCODE = 'P0001';
    END IF;

    -- Trừ tồn kho nguyên tử
    UPDATE app.inventory_batches
    SET quantity_on_hand = quantity_on_hand - p_quantity,
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_batch_id;

    -- Ghi nhận giao dịch xuất kho
    INSERT INTO app.inventory_transactions (
        batch_id,
        transaction_type,
        quantity,
        reference_order_id,
        performed_by,
        notes,
        created_at
    )
    VALUES (
        p_batch_id,
        p_transaction_type,
        p_quantity,
        p_reference_order_id,
        auth.uid(),
        p_notes,
        CLOCK_TIMESTAMP()
    )
    RETURNING id INTO v_tx_id;

    RETURN v_tx_id;
END;
$$;

-- 4. RPC Cách Ly Lô Hàng Khẩn Cấp (Quarantine Batch)
CREATE OR REPLACE FUNCTION app.rpc_quarantine_batch(
    p_batch_id UUID,
    p_reason TEXT DEFAULT 'Cách ly theo yêu cầu kiểm định'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF auth.uid() IS NOT NULL AND NOT app.is_staff(auth.uid()) THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Yêu cầu quyền nhân viên.'
            USING ERRCODE = '42501';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM app.inventory_batches WHERE id = p_batch_id) THEN
        RAISE EXCEPTION 'BATCH_NOT_FOUND: Lô hàng không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    UPDATE app.inventory_batches
    SET is_quarantined = TRUE,
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = p_batch_id;

    INSERT INTO audit.audit_logs (
        table_name,
        record_id,
        action,
        new_data,
        changed_by,
        changed_at
    )
    VALUES (
        'inventory_batches',
        p_batch_id,
        'QUARANTINE',
        jsonb_build_object('reason', p_reason),
        COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::UUID),
        CLOCK_TIMESTAMP()
    );

    RETURN TRUE;
END;
$$;

-- 5. RPC Nhập Kho Lô Hàng Mới (Receive Inventory Batch)
CREATE OR REPLACE FUNCTION app.rpc_receive_inventory_batch(
    p_product_id UUID,
    p_batch_number VARCHAR(100),
    p_expiry_date DATE,
    p_quantity INT,
    p_cost_price NUMERIC(12,2) DEFAULT 0,
    p_expiry_status VARCHAR(20) DEFAULT 'valid'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_batch_id UUID;
    v_quarantined BOOLEAN := FALSE;
    v_actor UUID;
BEGIN
    IF auth.uid() IS NOT NULL AND NOT app.is_staff(auth.uid()) THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Yêu cầu quyền nhân viên.'
            USING ERRCODE = '42501';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM app.products WHERE id = p_product_id) THEN
        RAISE EXCEPTION 'PRODUCT_NOT_FOUND: Sản phẩm không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    IF p_quantity <= 0 THEN
        RAISE EXCEPTION 'INVALID_QUANTITY: Số lượng nhập phải lớn hơn 0.'
            USING ERRCODE = 'P0001';
    END IF;

    IF p_expiry_status = 'unknown' OR p_expiry_date IS NULL OR (p_expiry_date < CURRENT_DATE) THEN
        v_quarantined := TRUE;
    END IF;

    INSERT INTO app.inventory_batches (
        product_id,
        batch_number,
        expiry_date,
        quantity_on_hand,
        cost_price,
        is_quarantined,
        expiry_status,
        created_at,
        updated_at
    )
    VALUES (
        p_product_id,
        p_batch_number,
        p_expiry_date,
        p_quantity,
        p_cost_price,
        v_quarantined,
        p_expiry_status,
        CLOCK_TIMESTAMP(),
        CLOCK_TIMESTAMP()
    )
    ON CONFLICT (product_id, batch_number) DO UPDATE
    SET quantity_on_hand = app.inventory_batches.quantity_on_hand + EXCLUDED.quantity_on_hand,
        cost_price = EXCLUDED.cost_price,
        updated_at = CLOCK_TIMESTAMP()
    RETURNING id INTO v_batch_id;

    -- Lấy actor hợp lệ
    v_actor := auth.uid();
    IF v_actor IS NULL THEN
        SELECT user_id INTO v_actor FROM app.staff_role_assignments WHERE is_active = TRUE LIMIT 1;
        IF v_actor IS NULL THEN
            SELECT id INTO v_actor FROM app.users LIMIT 1;
        END IF;
    END IF;

    -- Ghi nhận giao dịch nhập kho
    INSERT INTO app.inventory_transactions (
        batch_id,
        transaction_type,
        quantity,
        performed_by,
        notes,
        created_at
    )
    VALUES (
        v_batch_id,
        'IMPORT',
        p_quantity,
        v_actor,
        'Nhập lô hàng mới vào kho',
        CLOCK_TIMESTAMP()
    );

    RETURN v_batch_id;
END;
$$;

-- 6. Public Wrappers (SECURITY DEFINER, SET search_path = '')
CREATE OR REPLACE FUNCTION public.rpc_dispatch_inventory(
    p_batch_id UUID,
    p_quantity INT,
    p_transaction_type VARCHAR(20) DEFAULT 'EXPORT_SALE',
    p_reference_order_id UUID DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_dispatch_inventory(p_batch_id, p_quantity, p_transaction_type, p_reference_order_id, p_notes);
$$;

CREATE OR REPLACE FUNCTION public.rpc_quarantine_batch(
    p_batch_id UUID,
    p_reason TEXT DEFAULT 'Cách ly theo yêu cầu kiểm định'
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_quarantine_batch(p_batch_id, p_reason);
$$;

CREATE OR REPLACE FUNCTION public.rpc_receive_inventory_batch(
    p_product_id UUID,
    p_batch_number VARCHAR(100),
    p_expiry_date DATE,
    p_quantity INT,
    p_cost_price NUMERIC(12,2) DEFAULT 0,
    p_expiry_status VARCHAR(20) DEFAULT 'valid'
)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_receive_inventory_batch(p_product_id, p_batch_number, p_expiry_date, p_quantity, p_cost_price, p_expiry_status);
$$;

REVOKE ALL ON FUNCTION app.rpc_dispatch_inventory(UUID, INT, VARCHAR, UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_quarantine_batch(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_receive_inventory_batch(UUID, VARCHAR, DATE, INT, NUMERIC, VARCHAR) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.rpc_dispatch_inventory(UUID, INT, VARCHAR, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_quarantine_batch(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_receive_inventory_batch(UUID, VARCHAR, DATE, INT, NUMERIC, VARCHAR) TO authenticated;
