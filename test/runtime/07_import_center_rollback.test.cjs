/**
 * ==============================================================================
 * RUNTIME TEST SUITE 07: IMPORT CENTER, STAGING & SAFE ROLLBACK (GATE 7)
 * Project: Bệnh viện Thú y Lê Sơn
 * Phase 4B Implementation Plan: Acceptance Gate 7 Verification
 * Mode: RUNTIME VERIFICATION (Executes against live local PostgreSQL)
 * Covers: IMP-01 through IMP-10, D-07, D-15, V-2, SEC-42
 * ==============================================================================
 */

const { execSync } = require('child_process');

process.env.APP_ENV = 'local_test';

console.log('=== RUNNING RUNTIME TEST SUITE 07: IMPORT CENTER, STAGING & ROLLBACK GATES ===');
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

async function runTests() {
    try {
        // --- SETUP FIXTURES (Admin Alice, Admin Bob, Admin Off-shift Charlie, Receptionist, Product) ---
        const setupQuery = `
            DO $$
            DECLARE
                v_alice UUID := '77777777-0000-0000-0000-000000000071';
                v_bob UUID := '77777777-0000-0000-0000-000000000072';
                v_charlie_off UUID := '77777777-0000-0000-0000-000000000073';
                v_receptionist UUID := '88888888-0000-0000-0000-000000000074';
                v_cashier UUID := '88888888-0000-0000-0000-000000000001';
                v_prod UUID := '99999999-0000-0000-0000-000000000005';
                v_shift UUID := '66666666-0000-0000-0000-000000000001';
                v_now_vn TIMESTAMP := (CLOCK_TIMESTAMP() AT TIME ZONE 'Asia/Ho_Chi_Minh');
                v_today DATE := v_now_vn::DATE;
            BEGIN
                -- 1. Auth & App Users
                INSERT INTO auth.users (id, email) VALUES (v_alice, 'alice7@lesonvet.vn') ON CONFLICT (id) DO NOTHING;
                INSERT INTO auth.users (id, email) VALUES (v_bob, 'bob7@lesonvet.vn') ON CONFLICT (id) DO NOTHING;
                INSERT INTO auth.users (id, email) VALUES (v_charlie_off, 'charlie7@lesonvet.vn') ON CONFLICT (id) DO NOTHING;
                INSERT INTO auth.users (id, email) VALUES (v_receptionist, 'rec7@lesonvet.vn') ON CONFLICT (id) DO NOTHING;
                INSERT INTO auth.users (id, email) VALUES (v_cashier, 'cashier7@lesonvet.vn') ON CONFLICT (id) DO NOTHING;

                INSERT INTO app.users (id, full_name, phone_number) VALUES (v_alice, 'Quản trị viên Alice', '0977000001') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
                INSERT INTO app.users (id, full_name, phone_number) VALUES (v_bob, 'Quản trị viên Bob', '0977000002') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
                INSERT INTO app.users (id, full_name, phone_number) VALUES (v_charlie_off, 'Quản trị viên Charlie Ngoài Ca', '0977000003') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
                INSERT INTO app.users (id, full_name, phone_number) VALUES (v_receptionist, 'Tiếp tân Mai Hoa', '0988000002') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
                INSERT INTO app.users (id, full_name, phone_number) VALUES (v_cashier, 'Thu ngân Lê Thị Năm', '0988000001') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

                -- 2. Staff Roles
                INSERT INTO app.staff_role_assignments (user_id, role, assigned_by) VALUES (v_alice, 'admin', v_alice) ON CONFLICT (user_id, role) DO NOTHING;
                INSERT INTO app.staff_role_assignments (user_id, role, assigned_by) VALUES (v_bob, 'admin', v_alice) ON CONFLICT (user_id, role) DO NOTHING;
                INSERT INTO app.staff_role_assignments (user_id, role, assigned_by) VALUES (v_charlie_off, 'admin', v_alice) ON CONFLICT (user_id, role) DO NOTHING;
                INSERT INTO app.staff_role_assignments (user_id, role, assigned_by) VALUES (v_receptionist, 'receptionist', v_alice) ON CONFLICT (user_id, role) DO NOTHING;
                INSERT INTO app.staff_role_assignments (user_id, role, assigned_by) VALUES (v_cashier, 'cashier', v_alice) ON CONFLICT (user_id, role) DO NOTHING;

                -- 3. Shifts (Alice and Bob have active shifts today; Charlie does NOT have active shift)
                INSERT INTO app.shifts (id, shift_code, shift_name, start_time, end_time)
                VALUES (v_shift, 'TEST_ALLDAY', 'Ca Kiểm Thử 24/7', '00:00:00'::TIME, '23:59:59'::TIME)
                ON CONFLICT (id) DO NOTHING;

                INSERT INTO app.shift_assignments (shift_id, user_id, work_date, is_active) VALUES (v_shift, v_alice, v_today, true) ON CONFLICT DO NOTHING;
                INSERT INTO app.shift_assignments (shift_id, user_id, work_date, is_active) VALUES (v_shift, v_bob, v_today, true) ON CONFLICT DO NOTHING;
                INSERT INTO app.shift_assignments (shift_id, user_id, work_date, is_active) VALUES (v_shift, v_receptionist, v_today, true) ON CONFLICT DO NOTHING;
                INSERT INTO app.shift_assignments (shift_id, user_id, work_date, is_active) VALUES (v_shift, v_cashier, v_today, true) ON CONFLICT DO NOTHING;

                -- 4. Test Product for Inventory Batches
                INSERT INTO app.products (id, sku, product_name, category, unit, unit_price, is_prescription_drug)
                VALUES (v_prod, 'SUP-TEST-IMPORT', 'Vật Tư Nhập Khẩu Kiểm Thử Gate 7', 'consumable', 'Cái', 85000, false)
                ON CONFLICT (sku) DO NOTHING;
            END $$;
            SELECT 'SETUP_COMPLETE';
        `;
        const setupRes = psql(setupQuery);
        console.log(`Gate 7 setup result: ${setupRes}`);

        // =====================================================================
        // TEST 7.1: IMP-01 & D-07 Two-Man Rule Enforcement
        // Admin Alice creates job, Alice tries to approve own job -> Blocked!
        // =====================================================================
        const t71Query = `
            DO $$
            DECLARE
                v_alice UUID := '77777777-0000-0000-0000-000000000071';
                v_job_id UUID;
                v_err_msg TEXT := '';
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_alice::text, true);

                -- Alice creates job
                v_job_id := public.rpc_import_parse_file(
                    'customers_two_man.xlsx',
                    'excel_customer',
                    '[{"full_name": "Nguyen Van Test 1", "phone_number": "0912345678"}]'::jsonb
                );

                -- Alice dry runs
                PERFORM public.rpc_import_execute_dry_run(v_job_id);

                -- 1. Alice with AAL1 attempts approval -> must fail with MFA_AAL2_REQUIRED (R2-03)
                PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_alice::text, 'role', 'authenticated', 'aal', 'aal1')::text, true);
                BEGIN
                    PERFORM public.rpc_import_approve_job(v_job_id);
                    RAISE EXCEPTION 'AAL1_SHOULD_HAVE_FAILED';
                EXCEPTION WHEN OTHERS THEN
                    v_err_msg := SQLERRM;
                END;
                IF v_err_msg NOT LIKE '%MFA_AAL2_REQUIRED%' THEN
                    RAISE EXCEPTION 'Expected MFA_AAL2_REQUIRED for AAL1 caller, got: %', v_err_msg;
                END IF;

                -- 2. Alice with AAL2 attempts self-approval -> must fail with TWO_MAN_RULE_VIOLATION (IMP-01)
                PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_alice::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);
                BEGIN
                    PERFORM public.rpc_import_approve_job(v_job_id);
                    RAISE EXCEPTION 'SELF_APPROVAL_SHOULD_HAVE_FAILED';
                EXCEPTION WHEN OTHERS THEN
                    v_err_msg := SQLERRM;
                END;
                IF v_err_msg NOT LIKE '%TWO_MAN_RULE_VIOLATION%' THEN
                    RAISE EXCEPTION 'Expected TWO_MAN_RULE_VIOLATION error, but received: %', v_err_msg;
                END IF;

                -- 3. service_role or unauthenticated attempts to bypass Two-Man Rule -> must fail (R2-04)
                PERFORM set_config('role', 'service_role', true);
                PERFORM set_config('request.jwt.claim.sub', '', true);
                PERFORM set_config('request.jwt.claims', jsonb_build_object('role', 'service_role')::text, true);
                BEGIN
                    PERFORM public.rpc_import_approve_job(v_job_id);
                    RAISE EXCEPTION 'SERVICE_ROLE_BYPASS_SHOULD_HAVE_FAILED';
                EXCEPTION WHEN OTHERS THEN
                    v_err_msg := SQLERRM;
                END;
                IF v_err_msg NOT LIKE '%ROLE_UNAUTHORIZED%' AND v_err_msg NOT LIKE '%TWO_MAN_RULE_VIOLATION%' AND v_err_msg NOT LIKE '%permission denied%' THEN
                    RAISE EXCEPTION 'Expected ROLE_UNAUTHORIZED or TWO_MAN_RULE_VIOLATION, got: %', v_err_msg;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const t71Res = psql(t71Query);
        assert('GATE7-T7.1', 'IMP-01 & D-07: Two-Man Rule strictly blocks creator from self-approving import job (TWO_MAN_RULE_VIOLATION)',
               t71Res.includes('PASSED'), t71Res);

        // =====================================================================
        // TEST 7.2: IMP-02 Shift & Role Authorization
        // Receptionist and off-shift Admin Charlie are blocked from approving
        // =====================================================================
        const t72Query = `
            DO $$
            DECLARE
                v_alice UUID := '77777777-0000-0000-0000-000000000071';
                v_charlie_off UUID := '77777777-0000-0000-0000-000000000073';
                v_receptionist UUID := '88888888-0000-0000-0000-000000000074';
                v_cashier UUID := '88888888-0000-0000-0000-000000000001';
                v_job_id UUID;
                v_err_rec TEXT := '';
                v_err_off TEXT := '';
            BEGIN
                -- Alice creates job in awaiting_approval
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_alice::text, true);

                v_job_id := public.rpc_import_parse_file(
                    'customers_auth_test.xlsx',
                    'excel_customer',
                    '[{"full_name": "Test Auth", "phone_number": "0912345679"}]'::jsonb
                );
                PERFORM public.rpc_import_execute_dry_run(v_job_id);

                -- 1. Receptionist tries to approve -> ROLE_UNAUTHORIZED
                PERFORM set_config('request.jwt.claim.sub', v_receptionist::text, true);
                BEGIN
                    PERFORM public.rpc_import_approve_job(v_job_id);
                    RAISE EXCEPTION 'RECEPTIONIST_SHOULD_HAVE_FAILED';
                EXCEPTION WHEN OTHERS THEN
                    v_err_rec := SQLERRM;
                END;

                IF v_err_rec NOT LIKE '%ROLE_UNAUTHORIZED%' THEN
                    RAISE EXCEPTION 'Expected ROLE_UNAUTHORIZED for receptionist, got: %', v_err_rec;
                END IF;

                -- 2. Off-shift Admin Charlie tries to approve -> SHIFT_NOT_ACTIVE
                PERFORM set_config('request.jwt.claim.sub', v_charlie_off::text, true);
                PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_charlie_off::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);
                BEGIN
                    PERFORM public.rpc_import_approve_job(v_job_id);
                    RAISE EXCEPTION 'OFF_SHIFT_SHOULD_HAVE_FAILED';
                EXCEPTION WHEN OTHERS THEN
                    v_err_off := SQLERRM;
                END;

                IF v_err_off NOT LIKE '%SHIFT_NOT_ACTIVE%' THEN
                    RAISE EXCEPTION 'Expected SHIFT_NOT_ACTIVE for off-shift admin, got: %', v_err_off;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const t72Res = psql(t72Query);
        assert('GATE7-T7.2', 'IMP-02: Non-admin role blocked with ROLE_UNAUTHORIZED; Off-shift Admin blocked with SHIFT_NOT_ACTIVE',
               t72Res.includes('PASSED'), t72Res);

        // =====================================================================
        // TEST 7.3: IMP-03 State Machine Guard
        // Cannot approve job in 'uploaded' or 'failed' status; Independent Admin Bob succeeds
        // =====================================================================
        const t73Query = `
            DO $$
            DECLARE
                v_alice UUID := '77777777-0000-0000-0000-000000000071';
                v_bob UUID := '77777777-0000-0000-0000-000000000072';
                v_job_id UUID;
                v_err_state TEXT := '';
                v_status VARCHAR;
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_alice::text, true);

                -- Alice creates job (status = 'uploaded')
                v_job_id := public.rpc_import_parse_file(
                    'customers_state_machine.xlsx',
                    'excel_customer',
                    '[{"full_name": "State Customer", "phone_number": "0912345680"}]'::jsonb
                );

                -- Bob tries to approve before dry-run (status is 'uploaded', not 'awaiting_approval')
                PERFORM set_config('request.jwt.claim.sub', v_bob::text, true);
                PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_bob::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);
                BEGIN
                    PERFORM public.rpc_import_approve_job(v_job_id);
                    RAISE EXCEPTION 'SHOULD_FAIL_INVALID_STATE';
                EXCEPTION WHEN OTHERS THEN
                    v_err_state := SQLERRM;
                END;

                IF v_err_state NOT LIKE '%INVALID_JOB_STATUS%' THEN
                    RAISE EXCEPTION 'Expected INVALID_JOB_STATUS, got: %', v_err_state;
                END IF;

                -- Alice runs dry-run -> status becomes 'awaiting_approval'
                PERFORM set_config('request.jwt.claim.sub', v_alice::text, true);
                PERFORM public.rpc_import_execute_dry_run(v_job_id);

                -- Bob now approves successfully
                PERFORM set_config('request.jwt.claim.sub', v_bob::text, true);
                PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_bob::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);
                PERFORM public.rpc_import_approve_job(v_job_id);

                -- Reset to postgres to inspect staging.import_jobs
                PERFORM set_config('role', 'postgres', true);
                SELECT status INTO v_status FROM staging.import_jobs WHERE id = v_job_id;
                IF v_status <> 'validated' THEN
                    RAISE EXCEPTION 'Expected status validated after approval, got %', v_status;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const t73Res = psql(t73Query);
        assert('GATE7-T7.3', 'IMP-03: Approval blocked on invalid job states (INVALID_JOB_STATUS); Independent Admin Bob approves valid job',
               t73Res.includes('PASSED'), t73Res);

        // =====================================================================
        // TEST 7.4: IMP-04 Safe Ingestion & Rollback of Committed Job
        // Commit inserts records; Rollback marks is_deleted = TRUE & is_active = FALSE
        // =====================================================================
        const t74Query = `
            DO $$
            DECLARE
                v_alice UUID := '77777777-0000-0000-0000-000000000071';
                v_bob UUID := '77777777-0000-0000-0000-000000000072';
                v_job_id UUID;
                v_cust_active BOOLEAN;
                v_cust_deleted BOOLEAN;
                v_pet_deleted BOOLEAN;
                v_job_rolled_back BOOLEAN;
                v_job_status VARCHAR;
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_alice::text, true);

                -- Alice uploads customer + pet
                v_job_id := public.rpc_import_parse_file(
                    'customers_rollback_test.xlsx',
                    'excel_customer',
                    '[{"full_name": "Khach Hang Rollback T4", "phone_number": "0912345681", "pet_name": "Meo Mun", "species": "Feline", "gender": "male"}]'::jsonb
                );
                PERFORM public.rpc_import_execute_dry_run(v_job_id);

                -- Bob approves and commits
                PERFORM set_config('request.jwt.claim.sub', v_bob::text, true);
                PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_bob::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);
                PERFORM public.rpc_import_approve_job(v_job_id);
                PERFORM public.rpc_import_commit_job(v_job_id);

                -- Reset role to postgres to verify inserted records directly
                PERFORM set_config('role', 'postgres', true);
                SELECT is_active, is_deleted INTO v_cust_active, v_cust_deleted 
                FROM app.customers WHERE import_job_id = v_job_id;

                SELECT is_deleted INTO v_pet_deleted 
                FROM app.pets WHERE import_job_id = v_job_id;

                IF NOT v_cust_active OR v_cust_deleted OR v_pet_deleted THEN
                    RAISE EXCEPTION 'Initial commit record state incorrect: cust_active=%, cust_del=%, pet_del=%', 
                        v_cust_active, v_cust_deleted, v_pet_deleted;
                END IF;

                -- Bob executes rollback
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_bob::text, true);
                PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_bob::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);
                PERFORM public.rpc_import_rollback_job(v_job_id);

                -- Reset role to postgres to verify soft deletion
                PERFORM set_config('role', 'postgres', true);
                SELECT is_active, is_deleted INTO v_cust_active, v_cust_deleted 
                FROM app.customers WHERE import_job_id = v_job_id;

                SELECT is_deleted INTO v_pet_deleted 
                FROM app.pets WHERE import_job_id = v_job_id;

                SELECT is_rolled_back, status INTO v_job_rolled_back, v_job_status 
                FROM staging.import_jobs WHERE id = v_job_id;

                IF v_cust_active OR NOT v_cust_deleted OR NOT v_pet_deleted OR NOT v_job_rolled_back OR v_job_status <> 'rolled_back' THEN
                    RAISE EXCEPTION 'Rollback failed to soft-delete: cust_active=%, cust_del=%, pet_del=%, rolled_back=%, status=%',
                        v_cust_active, v_cust_deleted, v_pet_deleted, v_job_rolled_back, v_job_status;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const t74Res = psql(t74Query);
        assert('GATE7-T7.4', 'IMP-04: Commit ingests data; Rollback performs comprehensive soft deletion (is_deleted = TRUE, is_active = FALSE)',
               t74Res.includes('PASSED'), t74Res);

        // =====================================================================
        // TEST 7.5: IMP-05 Safe Rollback Guard
        // Blocks rollback when customer has new transactions/invoices
        // =====================================================================
        const t75Query = `
            DO $$
            DECLARE
                v_alice UUID := '77777777-0000-0000-0000-000000000071';
                v_bob UUID := '77777777-0000-0000-0000-000000000072';
                v_cashier UUID := '88888888-0000-0000-0000-000000000001';
                v_job_id UUID;
                v_cust_id UUID;
                v_inv_id UUID;
                v_err_rollback TEXT := '';
                v_cust_deleted BOOLEAN;
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_alice::text, true);

                -- Alice uploads customer
                v_job_id := public.rpc_import_parse_file(
                    'customers_protected.xlsx',
                    'excel_customer',
                    '[{"full_name": "Khach Hang Co Giao Dich Mua Hang", "phone_number": "0912345682"}]'::jsonb
                );
                PERFORM public.rpc_import_execute_dry_run(v_job_id);

                -- Bob approves & commits
                PERFORM set_config('request.jwt.claim.sub', v_bob::text, true);
                PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_bob::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);
                PERFORM public.rpc_import_approve_job(v_job_id);
                PERFORM public.rpc_import_commit_job(v_job_id);

                -- Reset to postgres to read customer id
                PERFORM set_config('role', 'postgres', true);
                SELECT id INTO v_cust_id FROM app.customers WHERE import_job_id = v_job_id;

                -- Customer incurs a new invoice at clinic counter
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_cashier::text, true);
                v_inv_id := public.rpc_create_invoice(v_cust_id, NULL);

                -- Bob attempts to rollback the import job
                PERFORM set_config('request.jwt.claim.sub', v_bob::text, true);
                PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_bob::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);
                BEGIN
                    PERFORM public.rpc_import_rollback_job(v_job_id);
                    RAISE EXCEPTION 'ROLLBACK_SHOULD_HAVE_BEEN_BLOCKED';
                EXCEPTION WHEN OTHERS THEN
                    v_err_rollback := SQLERRM;
                END;

                IF v_err_rollback NOT LIKE '%CANNOT_ROLLBACK_CUSTOMER_HAS_TRANSACTIONS%' THEN
                    RAISE EXCEPTION 'Expected CANNOT_ROLLBACK_CUSTOMER_HAS_TRANSACTIONS, got: %', v_err_rollback;
                END IF;

                -- Reset to postgres to verify customer remains active and undeleted
                PERFORM set_config('role', 'postgres', true);
                SELECT is_deleted INTO v_cust_deleted FROM app.customers WHERE id = v_cust_id;
                IF v_cust_deleted THEN
                    RAISE EXCEPTION 'Customer was wrongfully soft-deleted despite rollback rejection!';
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const t75Res = psql(t75Query);
        assert('GATE7-T7.5', 'IMP-05: validate_job_rollback strictly blocks rollback if customer incurred subsequent transactions (CANNOT_ROLLBACK_CUSTOMER_HAS_TRANSACTIONS)',
               t75Res.includes('PASSED'), t75Res);

        // =====================================================================
        // TEST 7.6: IMP-06 & V-2 Historical Loyalty Points Reversal
        // Rollback sets is_deleted = TRUE and records rollback_job_id on loyalty points
        // =====================================================================
        const t76Query = `
            DO $$
            DECLARE
                v_alice UUID := '77777777-0000-0000-0000-000000000071';
                v_bob UUID := '77777777-0000-0000-0000-000000000072';
                v_job_id UUID;
                v_points_deleted BOOLEAN;
                v_rollback_id UUID;
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_alice::text, true);

                -- Alice uploads customer with historical loyalty points
                v_job_id := public.rpc_import_parse_file(
                    'customers_loyalty_test.xlsx',
                    'excel_customer',
                    '[{"full_name": "Khach Hang Diem Thuong", "phone_number": "0912345683", "historical_points": 750, "source_customer_code": "GPET-OLD-750"}]'::jsonb
                );
                PERFORM public.rpc_import_execute_dry_run(v_job_id);

                -- Bob approves & commits
                PERFORM set_config('request.jwt.claim.sub', v_bob::text, true);
                PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_bob::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);
                PERFORM public.rpc_import_approve_job(v_job_id);
                PERFORM public.rpc_import_commit_job(v_job_id);

                -- Reset to postgres to verify loyalty points record inserted
                PERFORM set_config('role', 'postgres', true);
                SELECT is_deleted, rollback_job_id INTO v_points_deleted, v_rollback_id
                FROM app.historical_loyalty_points WHERE import_job_id = v_job_id;

                IF v_points_deleted OR v_rollback_id IS NOT NULL THEN
                    RAISE EXCEPTION 'Loyalty points initially corrupt: deleted=%, rollback_id=%', v_points_deleted, v_rollback_id;
                END IF;

                -- Bob executes rollback
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_bob::text, true);
                PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_bob::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);
                PERFORM public.rpc_import_rollback_job(v_job_id);

                -- Reset to postgres to verify points reversal
                PERFORM set_config('role', 'postgres', true);
                SELECT is_deleted, rollback_job_id INTO v_points_deleted, v_rollback_id
                FROM app.historical_loyalty_points WHERE import_job_id = v_job_id;

                IF NOT v_points_deleted OR v_rollback_id <> v_job_id THEN
                    RAISE EXCEPTION 'Loyalty points rollback failed: is_deleted=%, rollback_id=%', v_points_deleted, v_rollback_id;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const t76Res = psql(t76Query);
        assert('GATE7-T7.6', 'IMP-06 & V-2: Rollback reverses historical loyalty points (is_deleted = TRUE, rollback_job_id recorded)',
               t76Res.includes('PASSED'), t76Res);

        // =====================================================================
        // TEST 7.7: IMP-07 Pessimistic Locking & Double Rollback Protection
        // Second rollback attempt throws JOB_ALREADY_ROLLED_BACK
        // =====================================================================
        const t77Query = `
            DO $$
            DECLARE
                v_alice UUID := '77777777-0000-0000-0000-000000000071';
                v_bob UUID := '77777777-0000-0000-0000-000000000072';
                v_job_id UUID;
                v_err_double TEXT := '';
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_alice::text, true);

                v_job_id := public.rpc_import_parse_file(
                    'customers_double_rb.xlsx',
                    'excel_customer',
                    '[{"full_name": "Test Double Rollback", "phone_number": "0912345684"}]'::jsonb
                );
                PERFORM public.rpc_import_execute_dry_run(v_job_id);

                PERFORM set_config('request.jwt.claim.sub', v_bob::text, true);
                PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_bob::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);
                PERFORM public.rpc_import_approve_job(v_job_id);
                PERFORM public.rpc_import_commit_job(v_job_id);

                -- First rollback succeeds
                PERFORM public.rpc_import_rollback_job(v_job_id);

                -- Second rollback fails with JOB_ALREADY_ROLLED_BACK
                BEGIN
                    PERFORM public.rpc_import_rollback_job(v_job_id);
                    RAISE EXCEPTION 'DOUBLE_ROLLBACK_SHOULD_HAVE_FAILED';
                EXCEPTION WHEN OTHERS THEN
                    v_err_double := SQLERRM;
                END;

                IF v_err_double NOT LIKE '%JOB_ALREADY_ROLLED_BACK%' THEN
                    RAISE EXCEPTION 'Expected JOB_ALREADY_ROLLED_BACK, got: %', v_err_double;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const t77Res = psql(t77Query);
        assert('GATE7-T7.7', 'IMP-07: Pessimistic locking protects rollback from duplicate execution (JOB_ALREADY_ROLLED_BACK)',
               t77Res.includes('PASSED'), t77Res);

        // =====================================================================
        // TEST 7.8: IMP-08 Auto-Generation of Batch Number for Missing Lô Hàng
        // Empty batch_number receives generated 'UNKNOWN-{job_id}-{row}'
        // =====================================================================
        const t78Query = `
            DO $$
            DECLARE
                v_alice UUID := '77777777-0000-0000-0000-000000000071';
                v_bob UUID := '77777777-0000-0000-0000-000000000072';
                v_prod UUID := '99999999-0000-0000-0000-000000000005';
                v_job_id UUID;
                v_expected_batch TEXT;
                v_actual_batch TEXT;
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_alice::text, true);

                -- Alice imports inventory item with EMPTY batch_number
                v_job_id := public.rpc_import_parse_file(
                    'inventory_missing_batch.xlsx',
                    'excel_inventory',
                    jsonb_build_array(
                        jsonb_build_object(
                            'product_id', v_prod,
                            'batch_number', '',
                            'expiry_date', (CURRENT_DATE + INTERVAL '120 days')::text,
                            'quantity', 15,
                            'cost_price', 50000
                        )
                    )
                );
                PERFORM public.rpc_import_execute_dry_run(v_job_id);

                v_expected_batch := 'UNKNOWN-' || v_job_id::text || '-1';

                -- Bob approves & commits
                PERFORM set_config('request.jwt.claim.sub', v_bob::text, true);
                PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_bob::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);
                PERFORM public.rpc_import_approve_job(v_job_id);
                PERFORM public.rpc_import_commit_job(v_job_id);

                -- Reset to postgres to read batch record
                PERFORM set_config('role', 'postgres', true);
                SELECT batch_number INTO v_actual_batch
                FROM app.inventory_batches
                WHERE import_job_id = v_job_id;

                IF v_actual_batch <> v_expected_batch THEN
                    RAISE EXCEPTION 'Batch generation failed: expected %, got %', v_expected_batch, v_actual_batch;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const t78Res = psql(t78Query);
        assert('GATE7-T7.8', 'IMP-08: Missing batch number auto-generated in format UNKNOWN-{job_id}-{row_number}',
               t78Res.includes('PASSED'), t78Res);

        // =====================================================================
        // TEST 7.9: IMP-09 & D-15 Unknown Expiry Handling & Auto-Quarantine
        // Missing expiry_date receives expiry_status = 'unknown' and is_quarantined = TRUE
        // =====================================================================
        const t79Query = `
            DO $$
            DECLARE
                v_alice UUID := '77777777-0000-0000-0000-000000000071';
                v_bob UUID := '77777777-0000-0000-0000-000000000072';
                v_prod UUID := '99999999-0000-0000-0000-000000000005';
                v_job_id UUID;
                v_quarantined BOOLEAN;
                v_status VARCHAR;
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_alice::text, true);

                -- Alice imports inventory item with NULL expiry_date
                v_job_id := public.rpc_import_parse_file(
                    'inventory_missing_expiry.xlsx',
                    'excel_inventory',
                    jsonb_build_array(
                        jsonb_build_object(
                            'product_id', v_prod,
                            'batch_number', 'BATCH-EXP-TEST-' || gen_random_uuid()::text,
                            'expiry_date', null,
                            'quantity', 20,
                            'cost_price', 60000
                        )
                    )
                );
                PERFORM public.rpc_import_execute_dry_run(v_job_id);

                -- Bob approves & commits
                PERFORM set_config('request.jwt.claim.sub', v_bob::text, true);
                PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_bob::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);
                PERFORM public.rpc_import_approve_job(v_job_id);
                PERFORM public.rpc_import_commit_job(v_job_id);

                -- Reset to postgres to read batch
                PERFORM set_config('role', 'postgres', true);
                SELECT is_quarantined, expiry_status INTO v_quarantined, v_status
                FROM app.inventory_batches
                WHERE import_job_id = v_job_id;

                IF NOT v_quarantined OR v_status <> 'unknown' THEN
                    RAISE EXCEPTION 'Auto-quarantine failed: is_quarantined=%, expiry_status=%', v_quarantined, v_status;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const t79Res = psql(t79Query);
        assert('GATE7-T7.9', 'IMP-09 & D-15: Missing expiry date automatically quarantined (expiry_status = unknown, is_quarantined = TRUE)',
               t79Res.includes('PASSED'), t79Res);

        // =====================================================================
        // TEST 7.10: IMP-10 Granular Dry-Run Row Error Tracking
        // Reports exact error row numbers and error details; sets validation_failed
        // =====================================================================
        const t710Query = `
            DO $$
            DECLARE
                v_alice UUID := '77777777-0000-0000-0000-000000000071';
                v_job_id UUID;
                v_summary JSONB;
                v_total INT;
                v_valid INT;
                v_error INT;
                v_err_count INT;
                v_row2_err TEXT;
                v_row3_err TEXT;
            BEGIN
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_alice::text, true);

                -- 3 rows: Row 1 valid; Row 2 invalid phone; Row 3 empty name
                v_job_id := public.rpc_import_parse_file(
                    'customers_mixed_validation.xlsx',
                    'excel_customer',
                    jsonb_build_array(
                        jsonb_build_object('full_name', 'Hop Le 1', 'phone_number', '0912345685'),
                        jsonb_build_object('full_name', 'Loi SĐT 2', 'phone_number', '099INVALID'),
                        jsonb_build_object('full_name', '', 'phone_number', '0912345686')
                    )
                );

                v_summary := public.rpc_import_execute_dry_run(v_job_id);

                v_total := (v_summary ->> 'total_rows')::INT;
                v_valid := (v_summary ->> 'valid_rows')::INT;
                v_error := (v_summary ->> 'error_rows')::INT;

                IF v_total <> 3 OR v_valid <> 1 OR v_error <> 2 THEN
                    RAISE EXCEPTION 'Dry run counts wrong: total=%, valid=%, error=%', v_total, v_valid, v_error;
                END IF;

                -- Reset to postgres to inspect staging.import_errors
                PERFORM set_config('role', 'postgres', true);
                SELECT error_code INTO v_row2_err FROM staging.import_errors WHERE job_id = v_job_id AND row_number = 2;
                SELECT error_code INTO v_row3_err FROM staging.import_errors WHERE job_id = v_job_id AND row_number = 3;

                IF v_row2_err <> 'INVALID_PHONE_FORMAT' OR v_row3_err <> 'REQUIRED_FIELD_EMPTY' THEN
                    RAISE EXCEPTION 'Detailed error tracking failed: row2=%, row3=%', v_row2_err, v_row3_err;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const t710Res = psql(t710Query);
        assert('GATE7-T7.10', 'IMP-10: Dry-run provides granular row error tracking in staging.import_errors (Row 2: INVALID_PHONE_FORMAT, Row 3: REQUIRED_FIELD_EMPTY)',
               t710Res.includes('PASSED'), t710Res);

    } catch (err) {
        console.error('[FATAL RUNTIME ERROR IN SUITE 07]:', err);
        failedTests++;
    }

    console.log('\n==============================================================================');
    console.log(`GATE 7 RUNTIME SUMMARY: ${passedTests}/${totalTests} PASS | ${failedTests} FAIL | 0 SKIP`);
    console.log('==============================================================================');

    if (failedTests > 0) {
        process.exit(1);
    }
}

runTests();
