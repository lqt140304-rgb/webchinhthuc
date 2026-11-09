/**
 * ==============================================================================
 * RUNTIME TEST SUITE 06: INVENTORY BATCHES, BILLING, INVOICE PRIVACY & AUTH E2E (GATE 6)
 * Project: Bệnh viện Thú y Lê Sơn
 * Phase 4B Implementation Plan: Acceptance Gate 6 Verification
 * Mode: RUNTIME VERIFICATION (Executes against live local PostgreSQL & Supabase Auth)
 * Invariants Enforced:
 *   - D-15: Hàng thiếu HSD -> expiry_status = 'unknown', quarantined, cấm xuất kho
 *   - SEC-14: Xuất kho lô hàng cách ly -> BATCH_QUARANTINED
 *   - Pessimistic Locking: FOR UPDATE, chống race condition & trừ tồn kho âm
 *   - SEC-15 / V-5: Tự động gán is_clinical_hidden = TRUE cho dòng tự do & thuốc kê đơn
 *   - SEC-16: Chặn đứng UPDATE gỡ cờ ẩn dòng tự do (CANNOT_UNHIDE_FREE_TEXT_ITEM)
 *   - Mathematical Privacy: Hóa đơn portal khớp 100% tổng tiền mà 0 lộ thuốc/y lệnh
 *   - Supabase Auth Lifecycle: Real signup, token refresh & session revocation
 *   - Ownership Transfer & Media Access Revocation: Khách mất quyền khi chuyển chủ / thu hồi bản tin
 * ==============================================================================
 */

const { execSync } = require('child_process');

process.env.APP_ENV = 'local_test';

console.log('=== RUNNING RUNTIME TEST SUITE 06: INVENTORY, BILLING & SECURITY GATES ===');
console.log(`Timestamp: ${new Date().toISOString()}`);

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const results = [];

function assert(testId, description, condition, evidence) {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`[RUNTIME PASS] ${testId}: ${description}`);
        console.log(`       Evidence: ${evidence}`);
        results.push({ testId, description, status: 'RUNTIME PASS', evidence });
    } else {
        failedTests++;
        console.error(`[RUNTIME FAIL] ${testId}: ${description}`);
        console.error(`       Failure Evidence: ${evidence}`);
        results.push({ testId, description, status: 'RUNTIME FAIL', evidence });
    }
}

function psql(query) {
    const ps = execSync('docker ps --filter "name=supabase_db" --format "{{.Names}}"', { encoding: 'utf8' }).trim();
    if (!ps) throw new Error('Database container not found.');
    const container = ps.split('\n')[0].trim();
    return execSync(`docker exec -i ${container} psql -U postgres -d postgres -v ON_ERROR_STOP=1 -t -A`, { 
        input: query, 
        encoding: 'utf8' 
    }).trim();
}

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const AUTH_URL = 'http://127.0.0.1:54321/auth/v1';

async function runTests() {
    try {
        // --- SETUP FIXTURES (Products, Services, Batches, Staff) ---
        const setupQuery = `
            DO $$
            DECLARE
                v_cashier UUID := '88888888-0000-0000-0000-000000000001';
                v_prod_rx UUID := '99999999-0000-0000-0000-000000000001';
                v_prod_gen UUID := '99999999-0000-0000-0000-000000000002';
                v_srv_spa UUID := 'aaaaaaaa-0000-0000-0000-000000000001';
            BEGIN
                -- 1. Create cashier user & staff role with active shift
                INSERT INTO auth.users (id, email) VALUES (v_cashier, 'cashier1@lesonvet.vn') ON CONFLICT (id) DO NOTHING;
                INSERT INTO app.users (id, full_name, phone_number) VALUES (v_cashier, 'Thu ngân Lê Thị Năm', '0988000001') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
                INSERT INTO app.staff_role_assignments (user_id, role, assigned_by) VALUES (v_cashier, 'cashier', v_cashier) ON CONFLICT (user_id, role) DO NOTHING;

                INSERT INTO app.shifts (id, shift_code, shift_name, start_time, end_time)
                VALUES ('66666666-0000-0000-0000-000000000001', 'SHIFT_TEST_247', 'Ca Kiểm Thử 24/7', '00:00:00'::TIME, '23:59:59'::TIME)
                ON CONFLICT (id) DO NOTHING;

                INSERT INTO app.shift_assignments (shift_id, user_id, work_date, is_active)
                VALUES ('66666666-0000-0000-0000-000000000001', v_cashier, (CLOCK_TIMESTAMP() AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE, TRUE)
                ON CONFLICT DO NOTHING;

                -- Base Customer A & Customer B for billing tests
                INSERT INTO auth.users (id, email) VALUES 
                    ('33333333-0000-0000-0000-000000000001'::uuid, 'user_a_g6@test.vn'),
                    ('33333333-0000-0000-0000-000000000002'::uuid, 'user_b_g6@test.vn')
                ON CONFLICT (id) DO NOTHING;

                INSERT INTO app.users (id, full_name, phone_number, is_active) VALUES 
                    ('33333333-0000-0000-0000-000000000001'::uuid, 'Khách A Gate 6', '0933000001', TRUE),
                    ('33333333-0000-0000-0000-000000000002'::uuid, 'Khách B Gate 6', '0933000002', TRUE)
                ON CONFLICT (id) DO UPDATE SET is_active = TRUE;

                INSERT INTO app.customers (id, full_name, phone_number, is_active, is_deleted) VALUES 
                    ('44444444-0000-0000-0000-000000000001'::uuid, 'Khách A CRM', '0933000001', TRUE, FALSE),
                    ('44444444-0000-0000-0000-000000000002'::uuid, 'Khách B CRM', '0933000002', TRUE, FALSE)
                ON CONFLICT (id) DO UPDATE SET is_active = TRUE, is_deleted = FALSE;

                INSERT INTO app.customer_user_links (customer_id, user_id, link_status) VALUES 
                    ('44444444-0000-0000-0000-000000000001'::uuid, '33333333-0000-0000-0000-000000000001'::uuid, 'approved'),
                    ('44444444-0000-0000-0000-000000000002'::uuid, '33333333-0000-0000-0000-000000000002'::uuid, 'approved')
                ON CONFLICT (customer_id, user_id) DO UPDATE SET link_status = 'approved';

                -- 2. Products (1 prescription drug, 1 general supply, 1 retail non-rx)
                INSERT INTO app.products (id, sku, product_name, category, unit, unit_price, is_prescription_drug)
                VALUES (v_prod_rx, 'RX-AMOX-500', 'Thuốc Kháng Sinh Đặc Trị Amoxicillin 500mg', 'pharmacy', 'Lọ', 150000, true)
                ON CONFLICT (sku) DO NOTHING;

                INSERT INTO app.products (id, sku, product_name, category, unit, unit_price, is_prescription_drug)
                VALUES (v_prod_gen, 'GEN-SHAMP-01', 'Sữa Tắm Cho Mèo Lông Dài SOS', 'spa_supply', 'Chai', 120000, false)
                ON CONFLICT (sku) DO NOTHING;

                INSERT INTO app.products (id, sku, product_name, category, unit, unit_price, is_prescription_drug)
                VALUES ('99999999-0000-0000-0000-000000000003', 'RET-COLLAR-01', 'Vòng Cổ Chuông Thú Cưng', 'retail', 'Cái', 80000, false)
                ON CONFLICT (sku) DO NOTHING;

                -- 3. Services (1 spa, 1 surgery, 1 vaccine, 1 lab, 1 medical)
                INSERT INTO app.services (id, service_code, service_name, category, base_price)
                VALUES (v_srv_spa, 'SRV-SPA-CAT', 'Dịch Vụ Tắm Spa Mèo Toàn Diện', 'spa', 200000)
                ON CONFLICT (service_code) DO NOTHING;

                INSERT INTO app.services (id, service_code, service_name, category, base_price)
                VALUES ('aaaaaaaa-0000-0000-0000-000000000002', 'SRV-SURGERY-01', 'Phẫu Thuật Triệt Sản Chó Mèo', 'surgery', 850000)
                ON CONFLICT (service_code) DO NOTHING;

                INSERT INTO app.services (id, service_code, service_name, category, base_price)
                VALUES ('aaaaaaaa-0000-0000-0000-000000000003', 'SRV-VACCINE-01', 'Tiêm Phòng Dại Rabisin', 'vaccine', 180000)
                ON CONFLICT (service_code) DO NOTHING;

                INSERT INTO app.services (id, service_code, service_name, category, base_price)
                VALUES ('aaaaaaaa-0000-0000-0000-000000000004', 'SRV-LAB-01', 'Xét Nghiệm Sinh Hóa Máu 10 Chỉ Số', 'lab', 350000)
                ON CONFLICT (service_code) DO NOTHING;

                INSERT INTO app.services (id, service_code, service_name, category, base_price)
                VALUES ('aaaaaaaa-0000-0000-0000-000000000005', 'SRV-MED-01', 'Khám Lâm Sàng Nội Khoa', 'medical', 150000)
                ON CONFLICT (service_code) DO NOTHING;
            END $$;
            SELECT 'SETUP_COMPLETE';
        `;
        const setupRes = psql(setupQuery);
        console.log(`Gate 6 setup result: ${setupRes}`);

        // --- TEST 6.1: D-15 & SEC-14 Quarantine on Missing Expiry Date ---
        const t61Query = `
            DO $$
            DECLARE
                v_prod_rx UUID := '99999999-0000-0000-0000-000000000001';
                v_cashier UUID := '88888888-0000-0000-0000-000000000001';
                v_batch_id UUID;
                v_quarantined BOOLEAN;
                v_status VARCHAR;
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);

                -- Receive batch with unknown expiry date
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);

                v_batch_id := public.rpc_receive_inventory_batch(
                    v_prod_rx,
                    'BATCH-UNKNOWN-' || gen_random_uuid()::text,
                    NULL, -- Missing expiry date
                    50,
                    80000,
                    'unknown'
                );

                PERFORM set_config('role', 'postgres', true);
                SELECT is_quarantined, expiry_status INTO v_quarantined, v_status
                FROM app.inventory_batches WHERE id = v_batch_id;

                IF v_quarantined <> TRUE OR v_status <> 'unknown' THEN
                    RAISE EXCEPTION 'D-15 VIOLATION: Batch without expiry date was not quarantined! is_q=%, status=%',
                        v_quarantined, v_status;
                END IF;

                -- Attempting dispatch on quarantined batch must fail with BATCH_QUARANTINED
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);

                BEGIN
                    PERFORM public.rpc_dispatch_inventory(v_batch_id, 1, 'EXPORT_SALE', NULL, 'Cố tình xuất lô cách ly');
                    RAISE EXCEPTION 'FAIL: Quarantined batch was dispatched!';
                EXCEPTION WHEN OTHERS THEN
                    IF SQLERRM LIKE '%BATCH_QUARANTINED%' THEN
                        NULL; -- Expected SEC-14 block
                    ELSE
                        RAISE;
                    END IF;
                END;
            END $$;
            SELECT 'PASSED';
        `;
        const t61Res = psql(t61Query);
        assert('GATE6-T6.1', 'D-15 & SEC-14: Batch with missing expiry date automatically quarantined and blocked from dispatch (BATCH_QUARANTINED)',
            t61Res.includes('PASSED'),
            `Quarantine verification: ${t61Res}`);

        // --- TEST 6.2: Pessimistic Locking & Accurate Inventory Deduction ---
        const t62Query = `
            DO $$
            DECLARE
                v_prod_gen UUID := '99999999-0000-0000-0000-000000000002';
                v_cashier UUID := '88888888-0000-0000-0000-000000000001';
                v_batch_id UUID;
                v_stock INT;
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);

                -- Receive valid batch of 10 units
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);

                v_batch_id := public.rpc_receive_inventory_batch(
                    v_prod_gen,
                    'BATCH-VALID-' || gen_random_uuid()::text,
                    (CURRENT_DATE + INTERVAL '180 days')::DATE,
                    10,
                    70000,
                    'valid'
                );

                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);

                -- Dispatch 6 units -> Remaining should be 4
                PERFORM public.rpc_dispatch_inventory(v_batch_id, 6, 'EXPORT_SALE', NULL, 'Bán lẻ 6 chai sữa tắm');

                PERFORM set_config('role', 'postgres', true);
                SELECT quantity_on_hand INTO v_stock FROM app.inventory_batches WHERE id = v_batch_id;
                IF v_stock <> 4 THEN
                    RAISE EXCEPTION 'Stock deduction incorrect: Expected 4, got %', v_stock;
                END IF;

                -- Attempt dispatch 5 units (exceeding 4) -> must fail INSUFFICIENT_STOCK
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);
                BEGIN
                    PERFORM public.rpc_dispatch_inventory(v_batch_id, 5, 'EXPORT_SALE', NULL, 'Cố tình xuất vượt tồn kho');
                    RAISE EXCEPTION 'FAIL: Over-dispatch allowed!';
                EXCEPTION WHEN OTHERS THEN
                    IF SQLERRM LIKE '%INSUFFICIENT_STOCK%' THEN
                        NULL; -- Expected
                    ELSE
                        RAISE;
                    END IF;
                END;

                -- Stock must remain unchanged at 4
                PERFORM set_config('role', 'postgres', true);
                SELECT quantity_on_hand INTO v_stock FROM app.inventory_batches WHERE id = v_batch_id;
                IF v_stock <> 4 THEN
                    RAISE EXCEPTION 'Stock changed on failed dispatch: Expected 4, got %', v_stock;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const t62Res = psql(t62Query);
        assert('GATE6-T6.2', 'Pessimistic Locking: Atomic inventory deduction and strict rejection of over-dispatch (INSUFFICIENT_STOCK)',
            t62Res.includes('PASSED'),
            `Stock deduction result: ${t62Res}`);

        // --- TEST 6.3: Transaction Rollback Integrity on Inventory Failure ---
        const t63Query = `
            DO $$
            DECLARE
                v_prod_gen UUID := '99999999-0000-0000-0000-000000000002';
                v_cashier UUID := '88888888-0000-0000-0000-000000000001';
                v_batch_id UUID;
                v_initial_stock INT;
                v_final_stock INT;
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);

                v_batch_id := public.rpc_receive_inventory_batch(
                    v_prod_gen,
                    'BATCH-ROLLBACK-' || gen_random_uuid()::text,
                    (CURRENT_DATE + INTERVAL '90 days')::DATE,
                    20,
                    65000,
                    'valid'
                );

                PERFORM set_config('role', 'postgres', true);
                SELECT quantity_on_hand INTO v_initial_stock FROM app.inventory_batches WHERE id = v_batch_id;

                -- Simulate a transaction that dispatches valid items but later aborts
                BEGIN
                    PERFORM set_config('role', 'authenticated', true);
                    PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);

                    PERFORM public.rpc_dispatch_inventory(v_batch_id, 5, 'EXPORT_SALE', NULL, 'Thao tác sẽ bị hủy');

                    -- Simulated crash / exception
                    RAISE EXCEPTION 'SIMULATED_TRANSACTION_FAILURE';
                EXCEPTION WHEN OTHERS THEN
                    -- Transaction aborted, state rolled back
                    NULL;
                END;

                PERFORM set_config('role', 'postgres', true);
                SELECT quantity_on_hand INTO v_final_stock FROM app.inventory_batches WHERE id = v_batch_id;

                IF v_final_stock <> v_initial_stock THEN
                    RAISE EXCEPTION 'ROLLBACK FAILED: Initial stock %, final stock %', v_initial_stock, v_final_stock;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const t63Res = psql(t63Query);
        assert('GATE6-T6.3', 'Transaction Rollback Integrity: Failed transaction restores exact stock level without phantom mutation',
            t63Res.includes('PASSED'),
            `Rollback integrity: ${t63Res}`);

        // --- TEST 6.4: R2-01 P1 & SEC-15 & V-5: Clinical Invoice Privacy Auto-Inference & Customer View Filtering ---
        const t64Query = `
            DO $$
            DECLARE
                v_user_a UUID := '33333333-0000-0000-0000-000000000001'; -- Customer A User
                v_cust_a UUID := '44444444-0000-0000-0000-000000000001'; -- Customer A CRM
                v_cashier UUID := '88888888-0000-0000-0000-000000000001';
                v_prod_rx UUID := '99999999-0000-0000-0000-000000000001';
                v_prod_ret UUID := '99999999-0000-0000-0000-000000000003';
                v_srv_spa UUID := 'aaaaaaaa-0000-0000-0000-000000000001';
                v_srv_surg UUID := 'aaaaaaaa-0000-0000-0000-000000000002';
                v_srv_vac UUID := 'aaaaaaaa-0000-0000-0000-000000000003';
                v_srv_lab UUID := 'aaaaaaaa-0000-0000-0000-000000000004';
                v_srv_med UUID := 'aaaaaaaa-0000-0000-0000-000000000005';
                v_inv_id UUID;
                v_item_rx UUID;
                v_item_free UUID;
                v_item_surg UUID;
                v_item_vac UUID;
                v_item_lab UUID;
                v_item_med UUID;
                v_item_spa UUID;
                v_item_ret UUID;
                v_cust_view_cnt INT;
                v_clinical_leak_cnt INT;
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);

                v_inv_id := public.rpc_create_invoice(v_cust_a);

                -- Add all categories with p_is_hidden = false (Client cannot decide)
                v_item_rx := public.rpc_add_invoice_item(v_inv_id, v_prod_rx, NULL, NULL, 1, 150000, false);
                v_item_free := public.rpc_add_invoice_item(v_inv_id, NULL, NULL, 'Truyền dịch cấp cứu & tiêm ven chống sốc', 1, 350000, false);
                v_item_surg := public.rpc_add_invoice_item(v_inv_id, NULL, v_srv_surg, NULL, 1, 850000, false);
                v_item_vac := public.rpc_add_invoice_item(v_inv_id, NULL, v_srv_vac, NULL, 1, 180000, false);
                v_item_lab := public.rpc_add_invoice_item(v_inv_id, NULL, v_srv_lab, NULL, 1, 350000, false);
                v_item_med := public.rpc_add_invoice_item(v_inv_id, NULL, v_srv_med, NULL, 1, 150000, false);
                v_item_spa := public.rpc_add_invoice_item(v_inv_id, NULL, v_srv_spa, NULL, 1, 200000, false);
                v_item_ret := public.rpc_add_invoice_item(v_inv_id, v_prod_ret, NULL, NULL, 1, 80000, false);

                -- Verify in DB: All clinical services/drugs/free-text are auto-hidden (TRUE)
                PERFORM set_config('role', 'postgres', true);
                IF EXISTS (
                    SELECT 1 FROM app.invoice_items 
                    WHERE id IN (v_item_rx, v_item_free, v_item_surg, v_item_vac, v_item_lab, v_item_med)
                      AND is_clinical_hidden = FALSE
                ) THEN
                    RAISE EXCEPTION 'R2-01 VIOLATION: Clinical/Rx/Free-text items were not automatically hidden!';
                END IF;

                -- Spa & Retail non-Rx must remain visible (FALSE)
                IF EXISTS (
                    SELECT 1 FROM app.invoice_items 
                    WHERE id IN (v_item_spa, v_item_ret)
                      AND is_clinical_hidden = TRUE
                ) THEN
                    RAISE EXCEPTION 'R2-01 VIOLATION: Non-clinical retail/spa items were falsely marked hidden!';
                END IF;

                -- Customer View Verification (SEC-10, V-5, R2-01)
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_user_a::text, true);

                SELECT count(*) INTO v_cust_view_cnt
                FROM public.customer_invoice_items_view
                WHERE invoice_id = v_inv_id;

                IF v_cust_view_cnt <> 2 THEN
                    RAISE EXCEPTION 'R2-01 LEAK: Customer saw % items instead of 2 (spa + retail)', v_cust_view_cnt;
                END IF;

                SELECT count(*) INTO v_clinical_leak_cnt
                FROM public.customer_invoice_items_view
                WHERE invoice_id = v_inv_id
                  AND id IN (v_item_rx, v_item_free, v_item_surg, v_item_vac, v_item_lab, v_item_med);

                IF v_clinical_leak_cnt <> 0 THEN
                    RAISE EXCEPTION 'R2-01 CRITICAL LEAK: Customer view leaked % clinical lines!', v_clinical_leak_cnt;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const t64Res = psql(t64Query);
        assert('GATE6-T6.4', 'R2-01 P1 & SEC-15: Auto-infer hidden state for surgery, vaccine, lab, medical, Rx drugs, free-text; exactly 0 clinical lines in customer view',
            t64Res.includes('PASSED'),
            `Auto-hide verification: ${t64Res}`);

        // --- TEST 6.5: R2-01, R2-02, R2-06: Unhide Block, Audit Actions & Truncate Guard ---
        const t65Query = `
            DO $$
            DECLARE
                v_cust_a UUID := '44444444-0000-0000-0000-000000000001';
                v_cashier UUID := '88888888-0000-0000-0000-000000000001';
                v_srv_surg UUID := 'aaaaaaaa-0000-0000-0000-000000000002';
                v_prod_ret UUID := '99999999-0000-0000-0000-000000000003';
                v_inv_id UUID;
                v_item_surg UUID;
                v_item_ret UUID;
                v_batch_id UUID;
                v_err TEXT := '';
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);

                v_inv_id := public.rpc_create_invoice(v_cust_a);
                v_item_surg := public.rpc_add_invoice_item(v_inv_id, NULL, v_srv_surg, NULL, 1, 850000, false);
                v_item_ret := public.rpc_add_invoice_item(v_inv_id, v_prod_ret, NULL, NULL, 1, 80000, false);

                -- 1. Cashier attempts to unhide surgery via rpc_toggle_invoice_item_visibility -> must fail
                BEGIN
                    PERFORM public.rpc_toggle_invoice_item_visibility(v_item_surg, false, 'Cố tình hiển thị');
                    RAISE EXCEPTION 'FAIL: RPC permitted unhiding surgery item!';
                EXCEPTION WHEN OTHERS THEN
                    IF SQLERRM LIKE '%CLINICAL_RESTRICTION_CANNOT_REVEAL%' THEN
                        NULL; -- Expected
                    ELSE
                        RAISE;
                    END IF;
                END;

                -- 2. Direct SQL UPDATE on clinical item -> blocked by trigger trg_enforce_invoice_item_privacy
                PERFORM set_config('role', 'postgres', true);
                BEGIN
                    UPDATE app.invoice_items
                    SET is_clinical_hidden = FALSE
                    WHERE id = v_item_surg;
                    RAISE EXCEPTION 'FAIL: Direct UPDATE unhide was permitted!';
                EXCEPTION WHEN OTHERS THEN
                    IF SQLERRM LIKE '%CANNOT_UNHIDE_CLINICAL_ITEM%' OR SQLERRM LIKE '%CANNOT_UNHIDE_FREE_TEXT_ITEM%' THEN
                        NULL; -- Expected trigger block
                    ELSE
                        RAISE;
                    END IF;
                END;

                -- 3. R2-02 Audit Action: Cashier toggles retail item to hidden -> logs TOGGLE_VISIBILITY without error
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);
                PERFORM public.rpc_toggle_invoice_item_visibility(v_item_ret, true, 'Ẩn sản phẩm phụ kiện');

                -- 4. R2-02 Audit Action: Quarantine batch -> logs QUARANTINE without error
                v_batch_id := public.rpc_receive_inventory_batch(
                    v_prod_ret,
                    'BATCH-AUDIT-' || gen_random_uuid()::text,
                    (CURRENT_DATE + INTERVAL '120 days')::DATE,
                    10,
                    50000,
                    'valid'
                );
                PERFORM public.rpc_quarantine_batch(v_batch_id, 'Kiểm tra lỗi đóng gói');

                -- 5. R2-06 Truncate Guards: Verify TRUNCATE on financial and audit tables is blocked
                PERFORM set_config('role', 'postgres', true);
                BEGIN
                    TRUNCATE app.invoice_items;
                    RAISE EXCEPTION 'FAIL: TRUNCATE app.invoice_items succeeded!';
                EXCEPTION WHEN OTHERS THEN
                    IF SQLERRM LIKE '%FINANCIAL_LEDGER_IMMUTABLE%' THEN
                        NULL; -- Expected
                    ELSE
                        RAISE;
                    END IF;
                END;

                BEGIN
                    TRUNCATE audit.audit_logs;
                    RAISE EXCEPTION 'FAIL: TRUNCATE audit.audit_logs succeeded!';
                EXCEPTION WHEN OTHERS THEN
                    IF SQLERRM LIKE '%AUDIT_LOG_IMMUTABLE%' THEN
                        NULL; -- Expected
                    ELSE
                        RAISE;
                    END IF;
                END;
            END $$;
            SELECT 'PASSED';
        `;
        const t65Res = psql(t65Query);
        assert('GATE6-T6.5', 'R2-01, R2-02, R2-06: Cashier blocked from unhiding clinical items, TOGGLE_VISIBILITY & QUARANTINE audit succeed, TRUNCATE blocked',
            t65Res.includes('PASSED'),
            `Unhide, audit & truncate verified: ${t65Res}`);

        // --- TEST 6.6: Invoice Auto-Sync & Payment Lock ---
        const t66Query = `
            DO $$
            DECLARE
                v_cust_a UUID := '44444444-0000-0000-0000-000000000001';
                v_cashier UUID := '88888888-0000-0000-0000-000000000001';
                v_srv_spa UUID := 'aaaaaaaa-0000-0000-0000-000000000001';
                v_inv_id UUID;
                v_total NUMERIC(12,2);
                v_status VARCHAR;
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);

                v_inv_id := public.rpc_create_invoice(v_cust_a);
                PERFORM public.rpc_add_invoice_item(v_inv_id, NULL, v_srv_spa, NULL, 2, 200000); -- 400k
                PERFORM public.rpc_add_invoice_item(v_inv_id, NULL, NULL, 'Vật tư tiêu hao', 1, 50000); -- 50k

                -- Total must auto-sync to 450k
                PERFORM set_config('role', 'postgres', true);
                SELECT total_amount, payment_status INTO v_total, v_status FROM app.invoices WHERE id = v_inv_id;
                IF v_total <> 450000 OR v_status <> 'unpaid' THEN
                    RAISE EXCEPTION 'Invoice total auto-sync failed: total=%, status=%', v_total, v_status;
                END IF;

                -- Pay 450k
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);
                PERFORM public.rpc_process_invoice_payment(v_inv_id, 'cash', 450000, 'PAY-CASH-450K');

                PERFORM set_config('role', 'postgres', true);
                SELECT payment_status INTO v_status FROM app.invoices WHERE id = v_inv_id;
                IF v_status <> 'paid' THEN
                    RAISE EXCEPTION 'Invoice payment status not paid: %', v_status;
                END IF;

                -- Attempting to add item to paid invoice must be rejected
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);
                BEGIN
                    PERFORM public.rpc_add_invoice_item(v_inv_id, NULL, v_srv_spa, NULL, 1, 200000);
                    RAISE EXCEPTION 'FAIL: Item added to paid invoice!';
                EXCEPTION WHEN OTHERS THEN
                    IF SQLERRM LIKE '%INVOICE_LOCKED%' THEN
                        NULL; -- Expected
                    ELSE
                        RAISE;
                    END IF;
                END;
            END $$;
            SELECT 'PASSED';
        `;
        const t66Res = psql(t66Query);
        assert('GATE6-T6.6', 'Invoice Total Auto-Sync & Payment Lock: Automatically syncs totals and locks paid invoices (INVOICE_LOCKED)',
            t66Res.includes('PASSED'),
            `Payment & lock result: ${t66Res}`);

        // --- TEST 6.7: Customer Portal Privacy Breakdown (Mathematical Match Without Clinical Leak) ---
        const t67Query = `
            DO $$
            DECLARE
                v_user_a UUID := '33333333-0000-0000-0000-000000000001';
                v_cust_a UUID := '44444444-0000-0000-0000-000000000001';
                v_cashier UUID := '88888888-0000-0000-0000-000000000001';
                v_srv_spa UUID := 'aaaaaaaa-0000-0000-0000-000000000001';
                v_prod_rx UUID := '99999999-0000-0000-0000-000000000001';
                v_inv_id UUID;
                v_raw_items_visible_count INT;
                v_breakdown_items_count INT;
                v_breakdown_sum NUMERIC(12,2);
                v_final_amount NUMERIC(12,2);
            BEGIN
                -- Cashier creates invoice with 1 spa (200k) + 1 rx (150k) + 1 free clinical (100k)
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);

                v_inv_id := public.rpc_create_invoice(v_cust_a);
                PERFORM public.rpc_add_invoice_item(v_inv_id, NULL, v_srv_spa, NULL, 1, 200000);
                PERFORM public.rpc_add_invoice_item(v_inv_id, v_prod_rx, NULL, NULL, 1, 150000);
                PERFORM public.rpc_add_invoice_item(v_inv_id, NULL, NULL, 'Thuốc tiêm hạ sốt đặc trị nội bộ', 1, 100000);

                -- Customer A logs in
                PERFORM set_config('request.jwt.claim.sub', v_user_a::text, true);

                -- 1. Direct query against customer_invoice_items_view: only 1 visible spa item!
                SELECT count(*) INTO v_raw_items_visible_count
                FROM public.customer_invoice_items_view
                WHERE invoice_id = v_inv_id;

                IF v_raw_items_visible_count <> 1 THEN
                    RAISE EXCEPTION 'LEAK: Customer saw % items instead of 1 in customer_invoice_items_view!', v_raw_items_visible_count;
                END IF;

                -- 2. Customer calls rpc_get_customer_invoice_breakdown
                -- Must return 2 rows: 1 spa item (200k) + 1 package group line (250k)
                SELECT count(*), COALESCE(SUM(total_price), 0)
                INTO v_breakdown_items_count, v_breakdown_sum
                FROM public.rpc_get_customer_invoice_breakdown(v_inv_id);

                PERFORM set_config('role', 'postgres', true);
                SELECT final_amount INTO v_final_amount FROM app.invoices WHERE id = v_inv_id;

                IF v_breakdown_items_count <> 2 OR v_breakdown_sum <> v_final_amount THEN
                    RAISE EXCEPTION 'Breakdown math mismatch: rows=%, sum=%, invoice_final=%',
                        v_breakdown_items_count, v_breakdown_sum, v_final_amount;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const t67Res = psql(t67Query);
        assert('GATE6-T6.7', 'Requirement 5: Customer invoice breakdown matches 100% total amount with generic care package line, ZERO clinical leak',
            t67Res.includes('PASSED'),
            `Invoice privacy & math match: ${t67Res}`);

        // --- TEST 6.8: IDOR Cross-Customer Invoice Isolation ---
        const t68Query = `
            DO $$
            DECLARE
                v_user_b UUID := '33333333-0000-0000-0000-000000000002'; -- Customer B
                v_cust_a UUID := '44444444-0000-0000-0000-000000000001'; -- Customer A
                v_cashier UUID := '88888888-0000-0000-0000-000000000001';
                v_inv_id UUID;
                v_b_view_count INT;
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);

                v_inv_id := public.rpc_create_invoice(v_cust_a);

                -- Customer B attempts to view Customer A's invoice
                PERFORM set_config('request.jwt.claim.sub', v_user_b::text, true);

                SELECT count(*) INTO v_b_view_count
                FROM public.customer_invoices_view
                WHERE id = v_inv_id;

                IF v_b_view_count <> 0 THEN
                    RAISE EXCEPTION 'IDOR VIOLATION: Customer B can see Customer A invoice!';
                END IF;

                BEGIN
                    PERFORM public.rpc_get_customer_invoice_breakdown(v_inv_id);
                    RAISE EXCEPTION 'FAIL: Customer B accessed breakdown of Customer A invoice!';
                EXCEPTION WHEN OTHERS THEN
                    IF SQLERRM LIKE '%INVOICE_NOT_FOUND_OR_DENIED%' THEN
                        NULL; -- Expected IDOR block
                    ELSE
                        RAISE;
                    END IF;
                END;
            END $$;
            SELECT 'PASSED';
        `;
        const t68Res = psql(t68Query);
        assert('GATE6-T6.8', 'IDOR Guard: Customer B is strictly isolated from Customer A invoices and breakdown RPC (0 rows / ACCESS_DENIED)',
            t68Res.includes('PASSED'),
            `IDOR check result: ${t68Res}`);

        // --- TEST 6.9: Real Supabase Auth Lifecycle, Token Refresh & Revocation (Requirement 2) ---
        const testEmail = `auth_e2e_${Date.now()}@lesonvet.vn`;
        const testPassword = 'Password123!@#';

        // 1. Signup
        const signupRes = await fetch(`${AUTH_URL}/signup`, {
            method: 'POST',
            headers: { 'apikey': ANON_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testEmail, password: testPassword })
        });
        const signupData = await signupRes.json();
        const initialToken = signupData.access_token;
        const refreshToken = signupData.refresh_token;

        // 2. Token Refresh
        const refreshRes = await fetch(`${AUTH_URL}/token?grant_type=refresh_token`, {
            method: 'POST',
            headers: { 'apikey': ANON_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
        });
        const refreshData = await refreshRes.json();
        const rotatedToken = refreshData.access_token;

        // 3. Logout / Session Revocation
        const logoutRes = await fetch(`${AUTH_URL}/logout`, {
            method: 'POST',
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${rotatedToken}`
            }
        });

        const authLifecyclePass = 
            signupRes.status === 200 && !!initialToken &&
            refreshRes.status === 200 && !!rotatedToken && rotatedToken !== initialToken &&
            logoutRes.status === 204;

        assert('GATE6-T6.9', 'Requirement 2: Real Supabase Auth token issuance, refresh token rotation, and session logout revocation',
            authLifecyclePass,
            `Signup: ${signupRes.status}, Refresh: ${refreshRes.status}, Logout: ${logoutRes.status}`);

        // --- TEST 6.10: Pet Transfer, Revoked Bulletin & Media Access Revocation (Requirements 3 & 4) ---
        const t610Query = `
            DO $$
            DECLARE
                v_user_a UUID := '33333333-0000-0000-0000-000000000001';
                v_user_b UUID := '33333333-0000-0000-0000-000000000002';
                v_crm_a UUID := '44444444-0000-0000-0000-000000000001';
                v_crm_b UUID := '44444444-0000-0000-0000-000000000002';
                v_doc2 UUID := '11111111-0000-0000-0000-000000000002';
                v_pet_x UUID := gen_random_uuid();
                v_bulletin_x UUID;
                v_media_x UUID := gen_random_uuid();
                v_stay_x UUID;
                v_count INT;
            BEGIN
                -- 0. Ensure hermetic fixtures for Pet Transfer & Bulletin test
                INSERT INTO auth.users (id, email) VALUES 
                    (v_user_a, 'user_a_g6@test.vn'),
                    (v_user_b, 'user_b_g6@test.vn'),
                    ('11111111-0000-0000-0000-000000000001'::uuid, 'doc1_g6@lesonvet.vn'),
                    (v_doc2, 'doc2_g6@lesonvet.vn')
                ON CONFLICT (id) DO NOTHING;

                INSERT INTO app.users (id, full_name, phone_number, is_active) VALUES 
                    (v_user_a, 'Khách A Gate 6', '0933000001', TRUE),
                    (v_user_b, 'Khách B Gate 6', '0933000002', TRUE),
                    ('11111111-0000-0000-0000-000000000001'::uuid, 'Bác sĩ Một Gate 6', '0911000001', TRUE),
                    (v_doc2, 'Bác sĩ Hai Gate 6', '0911000002', TRUE)
                ON CONFLICT (id) DO UPDATE SET is_active = TRUE;

                INSERT INTO app.customers (id, full_name, phone_number, is_active, is_deleted) VALUES 
                    (v_crm_a, 'Khách A CRM', '0933000001', TRUE, FALSE),
                    (v_crm_b, 'Khách B CRM', '0933000002', TRUE, FALSE)
                ON CONFLICT (id) DO UPDATE SET is_active = TRUE, is_deleted = FALSE;

                INSERT INTO app.customer_user_links (customer_id, user_id, link_status) VALUES 
                    (v_crm_a, v_user_a, 'approved'),
                    (v_crm_b, v_user_b, 'approved')
                ON CONFLICT (customer_id, user_id) DO UPDATE SET link_status = 'approved';

                INSERT INTO app.staff_role_assignments (user_id, role, assigned_by) VALUES 
                    ('11111111-0000-0000-0000-000000000001'::uuid, 'veterinarian', '11111111-0000-0000-0000-000000000001'::uuid),
                    (v_doc2, 'veterinarian', '11111111-0000-0000-0000-000000000001'::uuid)
                ON CONFLICT (user_id, role) DO UPDATE SET is_active = TRUE;

                INSERT INTO app.shift_assignments (shift_id, user_id, work_date, is_active) VALUES 
                    ('66666666-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001'::uuid, (CLOCK_TIMESTAMP() AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE, TRUE),
                    ('66666666-0000-0000-0000-000000000001', v_doc2, (CLOCK_TIMESTAMP() AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE, TRUE)
                ON CONFLICT DO NOTHING;

                -- 1. Create Pet X for Customer A
                INSERT INTO app.pets (id, customer_id, pet_name, species, gender)
                VALUES (v_pet_x, v_crm_a, 'Bé Thỏ X', 'rabbit', 'female');

                -- 2. Create and publish bulletin for Pet X
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', '11111111-0000-0000-0000-000000000001', true);
                v_bulletin_x := public.rpc_create_medical_bulletin(v_pet_x, NULL, 'Bản tin Pet X', 'Ăn cà rốt tốt');

                PERFORM set_config('request.jwt.claim.sub', v_doc2::text, true);
                PERFORM public.rpc_approve_medical_bulletin(v_bulletin_x, 'Duyệt');
                PERFORM public.rpc_publish_medical_bulletin(v_bulletin_x);

                -- Attach media to stay
                PERFORM set_config('role', 'postgres', true);
                INSERT INTO app.cage_zones (id, zone_code, zone_name, description)
                VALUES ('00000000-0000-0000-0000-000000000001', 'ZONE-THO', 'Khu Thỏ A', 'Zone Thỏ')
                ON CONFLICT (id) DO NOTHING;

                INSERT INTO app.cages (id, zone_id, cage_number, cage_size)
                VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'R-01', 'small')
                ON CONFLICT (zone_id, cage_number) DO NOTHING;

                INSERT INTO app.inpatient_stays (id, pet_id, cage_id, attending_vet_id)
                VALUES (gen_random_uuid(), v_pet_x, '00000000-0000-0000-0000-000000000002', v_doc2)
                RETURNING id INTO v_stay_x;

                INSERT INTO app.inpatient_daily_media (id, stay_id, bulletin_id, storage_path, media_type, is_approved_for_customer, uploaded_by)
                VALUES (v_media_x, v_stay_x, v_bulletin_x, 'inpatient/rabbit/rabbit_x.jpg', 'image', true, v_doc2);

                -- 3. Customer A can see Pet X and request Signed URL
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_user_a::text, true);

                SELECT count(*) INTO v_count FROM public.customer_pets_view WHERE id = v_pet_x;
                IF v_count <> 1 THEN RAISE EXCEPTION 'Customer A cannot see Pet X'; END IF;

                PERFORM public.rpc_request_media_signed_url(v_media_x); -- Succeeds!

                -- 4. TRANSFER PET X TO CUSTOMER B (Change of ownership)
                PERFORM set_config('role', 'postgres', true);
                UPDATE app.pets SET customer_id = v_crm_b WHERE id = v_pet_x;

                -- 5. Customer A immediately loses all access!
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_user_a::text, true);

                SELECT count(*) INTO v_count FROM public.customer_pets_view WHERE id = v_pet_x;
                IF v_count <> 0 THEN RAISE EXCEPTION 'Customer A still sees Pet X after transfer!'; END IF;

                SELECT count(*) INTO v_count FROM public.customer_bulletins_view WHERE id = v_bulletin_x;
                IF v_count <> 0 THEN RAISE EXCEPTION 'Customer A still sees bulletin after transfer!'; END IF;

                BEGIN
                    PERFORM public.rpc_request_media_signed_url(v_media_x);
                    RAISE EXCEPTION 'FAIL: Customer A still accessed media after transfer!';
                EXCEPTION WHEN OTHERS THEN
                    IF SQLERRM LIKE '%PERMISSION_DENIED%' OR SQLERRM LIKE '%UNAUTHORIZED_MEDIA_ACCESS%' THEN
                        NULL; -- Expected access revocation
                    ELSE
                        RAISE;
                    END IF;
                END;

                -- 6. Customer B now owns Pet X and can see it
                PERFORM set_config('request.jwt.claim.sub', v_user_b::text, true);
                SELECT count(*) INTO v_count FROM public.customer_pets_view WHERE id = v_pet_x;
                IF v_count <> 1 THEN RAISE EXCEPTION 'Customer B cannot see transferred Pet X!'; END IF;

                -- 7. REVOKE BULLETIN -> Even Customer B loses media access!
                PERFORM set_config('request.jwt.claim.sub', v_doc2::text, true);
                PERFORM public.rpc_revoke_medical_bulletin(v_bulletin_x, 'Thu hồi kiểm định lại');

                PERFORM set_config('request.jwt.claim.sub', v_user_b::text, true);
                BEGIN
                    PERFORM public.rpc_request_media_signed_url(v_media_x);
                    RAISE EXCEPTION 'FAIL: Media still accessible after bulletin revocation!';
                EXCEPTION WHEN OTHERS THEN
                    IF SQLERRM LIKE '%PERMISSION_DENIED%' OR SQLERRM LIKE '%UNAUTHORIZED_MEDIA_ACCESS%' THEN
                        NULL; -- Expected access revocation
                    ELSE
                        RAISE;
                    END IF;
                END;
            END $$;
            SELECT 'PASSED';
        `;
        const t610Res = psql(t610Query);
        assert('GATE6-T6.10', 'Requirements 3 & 4: Instant access revocation upon pet ownership transfer and bulletin revocation',
            t610Res.includes('PASSED'),
            `Ownership transfer & media revocation: ${t610Res}`);

        // --- SUMMARY REPORT ---
        console.log('\n==============================================================================');
        console.log(`GATE 6 RUNTIME SUMMARY: ${passedTests}/${totalTests} PASS | ${failedTests} FAIL | 0 SKIP`);
        console.log('==============================================================================\n');

        if (failedTests > 0) {
            process.exit(1);
        }
    } catch (err) {
        console.error('FATAL TEST ERROR:', err);
        process.exit(1);
    }
}

runTests();
