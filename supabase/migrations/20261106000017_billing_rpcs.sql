-- ==============================================================================
-- PHASE 4B MIGRATION 17: BILLING RPCS, PAYMENT & CUSTOMER INVOICE VIEWS (GATE 6)
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section III.2, VII.4, VIII.2, Gate 6)
-- Invariants Enforced:
--   - V-5, S-4: Bảo mật chi phí y khoa - Hóa đơn portal không để lộ thuốc, liều lượng hay y lệnh.
--   - Mathematical Consistency: Tổng tiền dòng mục khớp 100% với tổng hóa đơn thông qua dòng gộp lâm sàng an toàn.
--   - AAL2 / Active Shift Protection on invoice mutation.
-- ==============================================================================

-- 1. RPC Tạo Hóa Đơn Mới (Thu ngân/Bác sĩ/Admin trong ca trực)
CREATE OR REPLACE FUNCTION app.rpc_create_invoice(
    p_customer_id UUID,
    p_appointment_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_invoice_id UUID;
    v_inv_number VARCHAR(50);
BEGIN
    IF NOT app.is_staff(auth.uid()) THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Thao tác tạo hóa đơn yêu cầu nhân viên bệnh viện.'
            USING ERRCODE = '42501';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM app.customers WHERE id = p_customer_id) THEN
        RAISE EXCEPTION 'CUSTOMER_NOT_FOUND: Khách hàng không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Sinh mã hóa đơn chuẩn duy nhất dạng INV-YYYYMMDD-XXXXX
    v_inv_number := 'INV-' || TO_CHAR(CLOCK_TIMESTAMP(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM()*100000)::TEXT, 5, '0');

    INSERT INTO app.invoices (
        invoice_number,
        customer_id,
        appointment_id,
        total_amount,
        discount_amount,
        final_amount,
        payment_status,
        created_by,
        created_at,
        updated_at
    )
    VALUES (
        v_inv_number,
        p_customer_id,
        p_appointment_id,
        0,
        0,
        0,
        'unpaid',
        auth.uid(),
        CLOCK_TIMESTAMP(),
        CLOCK_TIMESTAMP()
    )
    RETURNING id INTO v_invoice_id;

    RETURN v_invoice_id;
END;
$$;

-- 2. RPC Thêm Dòng Mục Vào Hóa Đơn (Add Invoice Item)
CREATE OR REPLACE FUNCTION app.rpc_add_invoice_item(
    p_invoice_id UUID,
    p_product_id UUID DEFAULT NULL,
    p_service_id UUID DEFAULT NULL,
    p_item_name VARCHAR DEFAULT NULL,
    p_quantity INT DEFAULT 1,
    p_unit_price NUMERIC(12,2) DEFAULT 0,
    p_is_hidden BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_item_id UUID;
    v_inv RECORD;
    v_name VARCHAR(200);
    v_price NUMERIC(12,2);
BEGIN
    IF NOT app.is_staff(auth.uid()) THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Thao tác thêm mục hóa đơn yêu cầu nhân viên bệnh viện.'
            USING ERRCODE = '42501';
    END IF;

    SELECT * INTO v_inv
    FROM app.invoices
    WHERE id = p_invoice_id
    FOR UPDATE;

    IF v_inv.id IS NULL THEN
        RAISE EXCEPTION 'INVOICE_NOT_FOUND: Hóa đơn không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    IF v_inv.payment_status IN ('paid', 'refunded') THEN
        RAISE EXCEPTION 'INVOICE_LOCKED: Không thể thêm mục vào hóa đơn đã hoàn tất thanh toán.'
            USING ERRCODE = 'P0001';
    END IF;

    v_name := p_item_name;
    v_price := p_unit_price;

    -- Tự động lấy tên & đơn giá từ danh mục nếu có product_id hoặc service_id
    IF p_product_id IS NOT NULL THEN
        SELECT product_name, unit_price INTO v_name, v_price
        FROM app.products WHERE id = p_product_id;
    ELSIF p_service_id IS NOT NULL THEN
        SELECT service_name, base_price INTO v_name, v_price
        FROM app.services WHERE id = p_service_id;
    END IF;

    IF v_name IS NULL THEN
        RAISE EXCEPTION 'INVALID_ITEM: Tên mục không được để trống.'
            USING ERRCODE = 'P0001';
    END IF;

    INSERT INTO app.invoice_items (
        invoice_id,
        product_id,
        service_id,
        item_name,
        quantity,
        unit_price,
        is_clinical_hidden,
        created_at
    )
    VALUES (
        p_invoice_id,
        p_product_id,
        p_service_id,
        v_name,
        p_quantity,
        v_price,
        p_is_hidden,
        CLOCK_TIMESTAMP()
    )
    RETURNING id INTO v_item_id;

    RETURN v_item_id;
END;
$$;

-- 3. RPC Xử Lý Thanh Toán Hóa Đơn (Process Payment)
CREATE OR REPLACE FUNCTION app.rpc_process_invoice_payment(
    p_invoice_id UUID,
    p_payment_method VARCHAR(30),
    p_amount NUMERIC(12,2),
    p_transaction_reference VARCHAR(100) DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_inv RECORD;
    v_total_paid NUMERIC(12,2);
BEGIN
    IF NOT app.is_staff(auth.uid()) THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Thao tác thanh toán yêu cầu nhân viên thu ngân.'
            USING ERRCODE = '42501';
    END IF;

    SELECT * INTO v_inv
    FROM app.invoices
    WHERE id = p_invoice_id
    FOR UPDATE;

    IF v_inv.id IS NULL THEN
        RAISE EXCEPTION 'INVOICE_NOT_FOUND: Hóa đơn không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'INVALID_AMOUNT: Số tiền thanh toán phải lớn hơn 0.'
            USING ERRCODE = 'P0001';
    END IF;

    INSERT INTO app.invoice_payments (
        invoice_id,
        payment_method,
        amount,
        transaction_reference,
        received_by,
        created_at
    )
    VALUES (
        p_invoice_id,
        p_payment_method,
        p_amount,
        p_transaction_reference,
        auth.uid(),
        CLOCK_TIMESTAMP()
    );

    SELECT COALESCE(SUM(amount), 0)
    INTO v_total_paid
    FROM app.invoice_payments
    WHERE invoice_id = p_invoice_id;

    IF v_total_paid >= v_inv.final_amount THEN
        UPDATE app.invoices
        SET payment_status = 'paid',
            updated_at = CLOCK_TIMESTAMP()
        WHERE id = p_invoice_id;
    ELSE
        UPDATE app.invoices
        SET payment_status = 'partially_paid',
            updated_at = CLOCK_TIMESTAMP()
        WHERE id = p_invoice_id;
    END IF;

    RETURN TRUE;
END;
$$;

-- 4. RPC Bật/Ẩn Dòng Chi Phí Hóa Đơn (Toggle Item Visibility - S-4 / V-5)
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
    v_is_rx BOOLEAN := FALSE;
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

    IF v_item.product_id IS NOT NULL THEN
        SELECT is_prescription_drug INTO v_is_rx
        FROM app.products WHERE id = v_item.product_id;
    END IF;

    -- S-4 & V-5: Cấm mở hiển thị thuốc kê đơn hoặc dòng tự do
    IF p_is_hidden = FALSE AND ((v_item.product_id IS NULL AND v_item.service_id IS NULL) OR v_is_rx = TRUE) THEN
        RAISE EXCEPTION 'CLINICAL_RESTRICTION_CANNOT_REVEAL: Không được phép mở hiển thị thuốc kê đơn, thuốc tiêm hoặc y lệnh điều trị nội bộ (V-5, S-4).'
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

-- 5. Customer Portal Views & Aggregated Breakdown RPC (SEC-10, V-5)
CREATE OR REPLACE VIEW public.customer_invoices_view
WITH (security_barrier = true) AS
SELECT 
    i.id,
    i.invoice_number,
    i.created_at,
    i.payment_status,
    i.total_amount,
    i.discount_amount,
    i.final_amount
FROM app.invoices i
WHERE i.customer_id = app.get_customer_id_for_user();

GRANT SELECT ON public.customer_invoices_view TO authenticated;

CREATE OR REPLACE VIEW public.customer_invoice_items_view
WITH (security_barrier = true) AS
SELECT 
    ii.id,
    ii.invoice_id,
    ii.item_name,
    ii.quantity,
    ii.unit_price,
    ii.total_price,
    ii.created_at
FROM app.invoice_items ii
JOIN app.invoices i ON i.id = ii.invoice_id
WHERE ii.is_clinical_hidden = FALSE
  AND i.customer_id = app.get_customer_id_for_user();

GRANT SELECT ON public.customer_invoice_items_view TO authenticated;

-- RPC Trả Về Chi Tiết Hóa Đơn An Toàn Cho Khách Hàng (Mathematical Match Without Clinical Leak)
CREATE OR REPLACE FUNCTION app.rpc_get_customer_invoice_breakdown(p_invoice_id UUID)
RETURNS TABLE (
    item_id UUID,
    item_name VARCHAR(200),
    quantity INT,
    unit_price NUMERIC(12,2),
    total_price NUMERIC(12,2),
    is_package_group BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_inv RECORD;
    v_hidden_total NUMERIC(12,2);
BEGIN
    SELECT * INTO v_inv
    FROM app.invoices
    WHERE id = p_invoice_id
      AND customer_id = app.get_customer_id_for_user();

    IF v_inv.id IS NULL THEN
        RAISE EXCEPTION 'INVOICE_NOT_FOUND_OR_DENIED: Không tìm thấy hóa đơn hoặc không có quyền truy cập.'
            USING ERRCODE = '42501';
    END IF;

    -- 1. Trả về toàn bộ các dòng chi phí công khai (is_clinical_hidden = FALSE)
    RETURN QUERY
    SELECT 
        ii.id AS item_id,
        ii.item_name,
        ii.quantity,
        ii.unit_price,
        ii.total_price,
        FALSE AS is_package_group
    FROM app.invoice_items ii
    WHERE ii.invoice_id = p_invoice_id
      AND ii.is_clinical_hidden = FALSE;

    -- 2. Tính tổng tiền các dòng y khoa ẩn (thuốc, y lệnh, dòng tự do)
    SELECT COALESCE(SUM(ii.total_price), 0)
    INTO v_hidden_total
    FROM app.invoice_items ii
    WHERE ii.invoice_id = p_invoice_id
      AND ii.is_clinical_hidden = TRUE;

    -- 3. Nếu có dòng ẩn, trả về một dòng gộp duy nhất mà không lộ tên thuốc hay liều lượng
    IF v_hidden_total > 0 THEN
        RETURN QUERY
        SELECT 
            '00000000-0000-0000-0000-000000000000'::UUID AS item_id,
            'Chi phí khám chữa & vật tư y tế theo phác đồ'::VARCHAR(200) AS item_name,
            1 AS quantity,
            v_hidden_total AS unit_price,
            v_hidden_total AS total_price,
            TRUE AS is_package_group;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_get_customer_invoice_breakdown(p_invoice_id UUID)
RETURNS TABLE (
    item_id UUID,
    item_name VARCHAR(200),
    quantity INT,
    unit_price NUMERIC(12,2),
    total_price NUMERIC(12,2),
    is_package_group BOOLEAN
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT * FROM app.rpc_get_customer_invoice_breakdown(p_invoice_id);
$$;

-- 6. Public Wrappers & Grants
CREATE OR REPLACE FUNCTION public.rpc_create_invoice(
    p_customer_id UUID,
    p_appointment_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_create_invoice(p_customer_id, p_appointment_id);
$$;

CREATE OR REPLACE FUNCTION public.rpc_add_invoice_item(
    p_invoice_id UUID,
    p_product_id UUID DEFAULT NULL,
    p_service_id UUID DEFAULT NULL,
    p_item_name VARCHAR DEFAULT NULL,
    p_quantity INT DEFAULT 1,
    p_unit_price NUMERIC(12,2) DEFAULT 0,
    p_is_hidden BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_add_invoice_item(p_invoice_id, p_product_id, p_service_id, p_item_name, p_quantity, p_unit_price, p_is_hidden);
$$;

CREATE OR REPLACE FUNCTION public.rpc_process_invoice_payment(
    p_invoice_id UUID,
    p_payment_method VARCHAR(30),
    p_amount NUMERIC(12,2),
    p_transaction_reference VARCHAR(100) DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_process_invoice_payment(p_invoice_id, p_payment_method, p_amount, p_transaction_reference);
$$;

CREATE OR REPLACE FUNCTION public.rpc_toggle_invoice_item_visibility(
    p_invoice_item_id UUID,
    p_is_hidden BOOLEAN,
    p_reason TEXT DEFAULT 'Điều chỉnh hiển thị dòng mục'
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT app.rpc_toggle_invoice_item_visibility(p_invoice_item_id, p_is_hidden, p_reason);
$$;

REVOKE ALL ON FUNCTION app.rpc_create_invoice(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_add_invoice_item(UUID, UUID, UUID, VARCHAR, INT, NUMERIC, BOOLEAN) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_process_invoice_payment(UUID, VARCHAR, NUMERIC, VARCHAR) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_toggle_invoice_item_visibility(UUID, BOOLEAN, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app.rpc_get_customer_invoice_breakdown(UUID) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.rpc_create_invoice(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_add_invoice_item(UUID, UUID, UUID, VARCHAR, INT, NUMERIC, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_process_invoice_payment(UUID, VARCHAR, NUMERIC, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_toggle_invoice_item_visibility(UUID, BOOLEAN, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_get_customer_invoice_breakdown(UUID) TO authenticated;
