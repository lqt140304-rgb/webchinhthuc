-- ==============================================================================
-- PHASE 4B MIGRATION 06: INVENTORY, BILLING & LOYALTY DDL
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section III.2, Gate 2)
-- Table Count: 8 inventory, billing & loyalty tables
-- Invariants Enforced: P1-C (RESTRICT), V-2 (Soft Delete Rollback for Loyalty), V-5 (Clinical Item Hide)
-- ==============================================================================

-- 27. Danh mục sản phẩm / thuốc / vật tư
CREATE TABLE IF NOT EXISTS app.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) NOT NULL UNIQUE,
    product_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    is_prescription_drug BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 28. Danh mục dịch vụ khám & spa
CREATE TABLE IF NOT EXISTS app.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_code VARCHAR(50) NOT NULL UNIQUE,
    service_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('medical', 'spa', 'vaccine', 'surgery', 'lab')),
    base_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 29. Quản lý lô nhập kho & hạn dùng
CREATE TABLE IF NOT EXISTS app.inventory_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES app.products(id) ON DELETE RESTRICT,
    batch_number VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    quantity_on_hand INT NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
    cost_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    is_quarantined BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    CONSTRAINT uq_product_batch UNIQUE (product_id, batch_number)
);

-- 30. Giao dịch xuất / nhập kho
CREATE TABLE IF NOT EXISTS app.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES app.inventory_batches(id) ON DELETE RESTRICT,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('IMPORT', 'EXPORT_TREATMENT', 'EXPORT_SALE', 'DISCARD', 'ADJUSTMENT')),
    quantity INT NOT NULL,
    reference_order_id UUID NULL,
    performed_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 31. Hóa đơn bán hàng & viện phí
CREATE TABLE IF NOT EXISTS app.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES app.customers(id) ON DELETE RESTRICT,
    appointment_id UUID NULL REFERENCES app.appointments(id) ON DELETE RESTRICT,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    final_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partially_paid', 'paid', 'refunded')),
    created_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 32. Chi tiết mục hóa đơn (V-5: Hỗ trợ cờ ẩn y lệnh/thuốc is_clinical_hidden)
CREATE TABLE IF NOT EXISTS app.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES app.invoices(id) ON DELETE RESTRICT,
    product_id UUID NULL REFERENCES app.products(id) ON DELETE RESTRICT,
    service_id UUID NULL REFERENCES app.services(id) ON DELETE RESTRICT,
    item_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    is_clinical_hidden BOOLEAN NOT NULL DEFAULT FALSE, -- V-5 Fail-safe
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 33. Thanh toán hóa đơn
CREATE TABLE IF NOT EXISTS app.invoice_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES app.invoices(id) ON DELETE RESTRICT,
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'credit_card', 'zalo_pay')),
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    transaction_reference VARCHAR(100) NULL,
    received_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- 34. Điểm tích lũy cũ GPet nhập lịch sử (V-2: Hỗ trợ is_deleted và rollback_job_id để hoàn tác an toàn)
CREATE TABLE IF NOT EXISTS app.historical_loyalty_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES app.customers(id) ON DELETE RESTRICT,
    historical_points INT NOT NULL DEFAULT 0,
    source_system VARCHAR(50) NOT NULL DEFAULT 'GPet_Old',
    source_customer_code VARCHAR(100) NULL,
    import_job_id UUID NULL REFERENCES staging.import_jobs(id) ON DELETE SET NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE, -- V-2: Cờ xóa mềm khi rollback
    rollback_job_id UUID NULL REFERENCES staging.import_jobs(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    CONSTRAINT uq_historical_loyalty UNIQUE (customer_id, source_system)
);

-- Chỉ mục hiệu năng
CREATE INDEX IF NOT EXISTS idx_inventory_batches_prod ON app.inventory_batches(product_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON app.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON app.invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON app.invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_historical_loyalty_cust ON app.historical_loyalty_points(customer_id);

-- Khóa quyền bảo mật: Cấm toàn bộ truy cập từ PUBLIC/anon/authenticated
REVOKE ALL ON TABLE app.products FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.services FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.inventory_batches FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.inventory_transactions FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.invoices FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.invoice_items FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.invoice_payments FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE app.historical_loyalty_points FROM PUBLIC, anon, authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA app TO postgres, service_role;
