-- ==============================================================================
-- PHASE 4B MIGRATION 16: INVOICE ITEM PRIVACY TRIGGERS & TOTAL SYNC (GATE 6)
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section III.2, VII.4, V-5, S-4, Gate 6)
-- Invariants Enforced:
--   - V-5 Fail-safe: Tự động gán is_clinical_hidden = TRUE cho mọi dòng tự do
--     (product_id IS NULL AND service_id IS NULL) và thuốc kê đơn.
--   - SEC-16: Chặn đứng thao tác UPDATE gỡ cờ ẩn dòng tự do hoặc thuốc (CANNOT_UNHIDE_FREE_TEXT_ITEM).
--   - Auto-Sync: Tự động tính toán total_price và đồng bộ tổng tiền hóa đơn (total_amount, final_amount).
-- ==============================================================================

-- 1. Trigger Thực Thi Quyền Riêng Tư Mục Hóa Đơn (V-5 Invariant)
CREATE OR REPLACE FUNCTION app.fn_enforce_invoice_item_privacy()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_is_rx BOOLEAN := FALSE;
BEGIN
    -- 1. Tự động tính toán tổng giá dòng mục
    NEW.total_price := NEW.quantity * NEW.unit_price;

    -- 2. Kiểm tra nếu sản phẩm là thuốc kê đơn
    IF NEW.product_id IS NOT NULL THEN
        SELECT is_prescription_drug INTO v_is_rx
        FROM app.products
        WHERE id = NEW.product_id;
    END IF;

    -- 3. SEC-16 Invariant: Chặn thao tác UPDATE cố tình gỡ cờ ẩn trên dòng tự do hoặc thuốc kê đơn
    IF TG_OP = 'UPDATE' THEN
        IF OLD.is_clinical_hidden = TRUE AND NEW.is_clinical_hidden = FALSE THEN
            IF (OLD.product_id IS NULL AND OLD.service_id IS NULL) OR (v_is_rx = TRUE) THEN
                RAISE EXCEPTION 'CANNOT_UNHIDE_FREE_TEXT_ITEM: Dòng mục tự do hoặc thuốc kê đơn tuyệt đối không được phép hiển thị công khai cho khách hàng (V-5, S-4).'
                    USING ERRCODE = 'P0001';
            END IF;
        END IF;
    END IF;

    -- 4. V-5 Fail-safe: Dòng tự do (không có product_id và không có service_id)
    -- hoặc thuốc kê đơn buộc phải có cờ is_clinical_hidden = TRUE
    IF (NEW.product_id IS NULL AND NEW.service_id IS NULL) OR (v_is_rx = TRUE) THEN
        NEW.is_clinical_hidden := TRUE;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_invoice_item_privacy ON app.invoice_items;
CREATE TRIGGER trg_enforce_invoice_item_privacy
BEFORE INSERT OR UPDATE ON app.invoice_items
FOR EACH ROW EXECUTE FUNCTION app.fn_enforce_invoice_item_privacy();

-- 2. Trigger Tự Động Đồng Bộ Tổng Tiền Hóa Đơn (Invoice Total Auto-Sync)
CREATE OR REPLACE FUNCTION app.fn_sync_invoice_totals()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_invoice_id UUID;
    v_new_total NUMERIC(12,2);
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_invoice_id := OLD.invoice_id;
    ELSE
        v_invoice_id := NEW.invoice_id;
    END IF;

    -- Tính tổng giá trị tất cả dòng mục trong hóa đơn
    SELECT COALESCE(SUM(total_price), 0)
    INTO v_new_total
    FROM app.invoice_items
    WHERE invoice_id = v_invoice_id;

    -- Cập nhật tổng tiền hóa đơn
    UPDATE app.invoices
    SET total_amount = v_new_total,
        final_amount = GREATEST(0, v_new_total - discount_amount),
        updated_at = CLOCK_TIMESTAMP()
    WHERE id = v_invoice_id;

    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_invoice_totals ON app.invoice_items;
CREATE TRIGGER trg_sync_invoice_totals
AFTER INSERT OR UPDATE OR DELETE ON app.invoice_items
FOR EACH ROW EXECUTE FUNCTION app.fn_sync_invoice_totals();
