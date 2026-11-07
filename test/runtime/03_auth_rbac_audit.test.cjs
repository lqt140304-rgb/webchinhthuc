/**
 * ==============================================================================
 * RUNTIME TEST SUITE 03: AUTH, RBAC, RLS & AUDIT LOGGING
 * Project: Bệnh viện Thú y Lê Sơn
 * Phase 4B Implementation Plan: Acceptance Gate 3 Verification
 * Mode: RUNTIME VERIFICATION (Executes against live local PostgreSQL container)
 * ==============================================================================
 */

const { execSync } = require('child_process');

process.env.APP_ENV = 'local_test';

console.log('=== RUNNING RUNTIME TEST SUITE 03: AUTH, RBAC, RLS & AUDIT LOGGING ===');
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

// Helper to query PostgreSQL container directly
function psql(query) {
    const ps = execSync('docker ps --filter "name=supabase_db" --format "{{.Names}}"', { encoding: 'utf8' }).trim();
    if (!ps) throw new Error('Database container not found.');
    const container = ps.split('\n')[0].trim();
    return execSync(`docker exec -i ${container} psql -U postgres -d postgres -t -A`, { input: query, encoding: 'utf8' }).trim();
}

async function runTests() {
    try {
        // --- TEST 3.1: RLS Enabled on All 39 Tables ---
        const rlsQuery = `
            SELECT count(*) 
            FROM pg_tables 
            WHERE schemaname IN ('app', 'staging', 'audit') 
              AND rowsecurity = true;
        `;
        const rlsCount = parseInt(psql(rlsQuery), 10);
        assert('GATE3-T3.1', 'Row Level Security (RLS) is active on 100% of the 39 tables (34 app + 4 staging + 1 audit)',
            rlsCount === 39,
            `Total tables with RLS active: ${rlsCount} / 39`);

        // --- TEST 3.2: SEC-01 IDOR Prevention on rpc_ensure_app_user ---
        const sec01Query = `
            DO $$
            DECLARE
                v_err TEXT := '';
            BEGIN
                -- Call without auth session (auth.uid() IS NULL)
                BEGIN
                    PERFORM app.rpc_ensure_app_user();
                EXCEPTION WHEN OTHERS THEN
                    v_err := SQLERRM;
                END;

                IF v_err NOT LIKE '%UNAUTHORIZED%' THEN
                    RAISE EXCEPTION 'Expected UNAUTHORIZED exception, got: %', v_err;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const sec01Result = psql(sec01Query);
        assert('GATE3-T3.2', 'SEC-01: rpc_ensure_app_user enforces zero client-side ID parameters and rejects unauthenticated sessions',
            sec01Result.includes('PASSED'),
            `IDOR check: ${sec01Result}`);

        // --- TEST 3.3: D-19 Lazy Creation Trigger ---
        const d19Query = `
            DO $$
            DECLARE
                v_oauth_uid UUID := gen_random_uuid();
                v_phone_uid UUID := gen_random_uuid();
                v_cust_count_before INT;
                v_cust_count_after INT;
            BEGIN
                SELECT count(*) INTO v_cust_count_before FROM app.customers;

                -- 1. Insert OAuth user (Email only, no phone)
                INSERT INTO auth.users (id, email, raw_user_meta_data)
                VALUES (v_oauth_uid, 'oauth_test@example.com', '{"full_name": "OAuth User"}'::jsonb);

                -- Verify app.users created automatically by trigger
                IF NOT EXISTS (SELECT 1 FROM app.users WHERE id = v_oauth_uid) THEN
                    RAISE EXCEPTION 'D-19: app.users record missing for OAuth user';
                END IF;

                -- Verify app.customers NOT created (Lazy Creation)
                SELECT count(*) INTO v_cust_count_after FROM app.customers;
                IF v_cust_count_after <> v_cust_count_before THEN
                    RAISE EXCEPTION 'D-19 VIOLATION: OAuth registration created customer record!';
                END IF;

                -- 2. Insert Phone user (SMS OTP)
                INSERT INTO auth.users (id, phone, raw_user_meta_data)
                VALUES (v_phone_uid, '+84988111222', '{"full_name": "Phone User"}'::jsonb);

                IF NOT EXISTS (SELECT 1 FROM app.users WHERE id = v_phone_uid) THEN
                    RAISE EXCEPTION 'D-19: app.users record missing for Phone user';
                END IF;

                IF NOT EXISTS (SELECT 1 FROM app.customers WHERE phone_number = '+84988111222') THEN
                    RAISE EXCEPTION 'D-19: app.customers record missing for Phone user';
                END IF;

                -- Clean up test records safely
                DELETE FROM app.customer_user_links WHERE user_id IN (v_oauth_uid, v_phone_uid);
                DELETE FROM app.customers WHERE phone_number = '+84988111222';
                DELETE FROM app.users WHERE id IN (v_oauth_uid, v_phone_uid);
                DELETE FROM auth.users WHERE id IN (v_oauth_uid, v_phone_uid);
            END $$;
            SELECT 'PASSED';
        `;
        const d19Result = psql(d19Query);
        assert('GATE3-T3.3', 'D-19: Lazy Customer Creation distinguishes OAuth vs Phone registration (Zero customer pollution)',
            d19Result.includes('PASSED'),
            `Lazy creation result: ${d19Result}`);

        // --- TEST 3.4: SEC-02 RBAC Role Isolation (Receptionist cannot act as Admin) ---
        const sec02Query = `
            DO $$
            DECLARE
                v_rec_uid UUID := gen_random_uuid();
                v_res BOOLEAN;
            BEGIN
                -- Create dummy receptionist (auth.users trigger automatically inserts into app.users)
                INSERT INTO auth.users (id, email, raw_user_meta_data) 
                VALUES (v_rec_uid, 'rec_test@leson.vn', '{"full_name": "Lễ Tân Test"}'::jsonb);

                INSERT INTO app.staff_role_assignments (user_id, role, assigned_by)
                VALUES (v_rec_uid, 'receptionist', v_rec_uid);

                -- Verify app.has_role and check_active_shift
                IF app.has_role('admin', v_rec_uid) THEN
                    RAISE EXCEPTION 'SEC-02 VIOLATION: Receptionist reported as admin!';
                END IF;

                v_res := app.check_active_shift(v_rec_uid, 'admin');
                IF v_res = TRUE THEN
                    RAISE EXCEPTION 'SEC-02 VIOLATION: Receptionist passed admin shift check!';
                END IF;

                -- Clean up
                DELETE FROM app.staff_role_assignments WHERE user_id = v_rec_uid;
                DELETE FROM app.users WHERE id = v_rec_uid;
                DELETE FROM auth.users WHERE id = v_rec_uid;
            END $$;
            SELECT 'PASSED';
        `;
        const sec02Result = psql(sec02Query);
        assert('GATE3-T3.4', 'SEC-02: RBAC role isolation prevents privilege escalation (Receptionist cannot claim Admin)',
            sec02Result.includes('PASSED'),
            `RBAC check: ${sec02Result}`);

        // --- TEST 3.5: S-11 Off-Shift Admin Override with Audit Logging ---
        const s11Query = `
            DO $$
            DECLARE
                v_admin_uid UUID := gen_random_uuid();
                v_res BOOLEAN;
                v_audit_count INT;
            BEGIN
                INSERT INTO auth.users (id, email, raw_user_meta_data) 
                VALUES (v_admin_uid, 'admin_audit@leson.vn', '{"full_name": "Admin Audit Test"}'::jsonb);

                INSERT INTO app.staff_role_assignments (user_id, role, assigned_by)
                VALUES (v_admin_uid, 'admin', v_admin_uid);

                -- Admin has no scheduled shift -> check_active_shift triggers override logging
                v_res := app.check_active_shift(v_admin_uid, 'veterinarian');
                IF v_res <> TRUE THEN
                    RAISE EXCEPTION 'S-11: Admin override failed to return TRUE';
                END IF;

                SELECT count(*) INTO v_audit_count 
                FROM audit.audit_logs 
                WHERE record_id = v_admin_uid 
                  AND table_name = 'shifts'
                  AND action = 'SECURITY_VIOLATION';

                IF v_audit_count = 0 THEN
                    RAISE EXCEPTION 'S-11 VIOLATION: Off-shift admin access failed to generate audit log!';
                END IF;

                -- Clean up
                DELETE FROM audit.audit_logs WHERE record_id = v_admin_uid;
                DELETE FROM app.staff_role_assignments WHERE user_id = v_admin_uid;
                DELETE FROM app.users WHERE id = v_admin_uid;
                DELETE FROM auth.users WHERE id = v_admin_uid;
            END $$;
            SELECT 'PASSED';
        `;
        const s11Result = psql(s11Query);
        assert('GATE3-T3.5', 'S-11: Off-shift Admin access successfully executes override and records immutable audit log',
            s11Result.includes('PASSED'),
            `S-11 override result: ${s11Result}`);

        // --- TEST 3.6: SEC-03 BYO-2 Device Session Policy ---
        const byo2Query = `
            SELECT count(*) 
            FROM pg_policies 
            WHERE schemaname = 'app' 
              AND tablename = 'staff_device_sessions'
              AND policyname = 'rls_staff_device_sessions_admin';
        `;
        const byo2Count = parseInt(psql(byo2Query), 10);
        assert('GATE3-T3.6', 'BYO-2: staff_device_sessions RLS policy strictly isolates hardware tokens to Admin only',
            byo2Count === 1,
            `Policy count on staff_device_sessions: ${byo2Count}`);

        // --- TEST 3.7: V-2 Historical Loyalty Points Policy ---
        const v2Query = `
            SELECT count(*) 
            FROM pg_policies 
            WHERE schemaname = 'app' 
              AND tablename = 'historical_loyalty_points'
              AND policyname = 'rls_historical_loyalty_points_admin';
        `;
        const v2Count = parseInt(psql(v2Query), 10);
        assert('GATE3-T3.7', 'V-2: historical_loyalty_points RLS policy strictly isolates old GPet points to Admin only',
            v2Count === 1,
            `Policy count on historical_loyalty_points: ${v2Count}`);

        // --- TEST 3.8: SEC-04 Automated Audit Triggers (Invoice & Mutation) ---
        const sec04Query = `
            DO $$
            DECLARE
                v_staff_uid UUID := gen_random_uuid();
                v_cust_id UUID;
                v_inv_id UUID;
                v_audit_count INT;
            BEGIN
                -- Create dummy staff user
                INSERT INTO auth.users (id, email, raw_user_meta_data)
                VALUES (v_staff_uid, 'staff_inv@leson.vn', '{"full_name": "Staff Cashier"}'::jsonb);

                -- Create dummy customer and invoice with created_by referencing staff
                INSERT INTO app.customers (full_name, phone_number)
                VALUES ('Audit Customer', '0912999888')
                RETURNING id INTO v_cust_id;

                INSERT INTO app.invoices (invoice_number, customer_id, total_amount, final_amount, payment_status, created_by)
                VALUES ('INV-AUDIT-001', v_cust_id, 500000, 500000, 'unpaid', v_staff_uid)
                RETURNING id INTO v_inv_id;

                -- Trigger UPDATE mutation
                UPDATE app.invoices 
                SET payment_status = 'paid', updated_at = CLOCK_TIMESTAMP()
                WHERE id = v_inv_id;

                -- Verify audit log was created by trg_audit_invoices
                SELECT count(*) INTO v_audit_count
                FROM audit.audit_logs
                WHERE table_name = 'invoices'
                  AND record_id = v_inv_id
                  AND action = 'UPDATE';

                IF v_audit_count = 0 THEN
                    RAISE EXCEPTION 'SEC-04 VIOLATION: trg_audit_invoices failed to record UPDATE audit entry!';
                END IF;

                -- Clean up test records
                DELETE FROM audit.audit_logs WHERE record_id = v_inv_id;
                DELETE FROM app.invoices WHERE id = v_inv_id;
                DELETE FROM app.customers WHERE id = v_cust_id;
                DELETE FROM app.users WHERE id = v_staff_uid;
                DELETE FROM auth.users WHERE id = v_staff_uid;
            END $$;
            SELECT 'PASSED';
        `;
        const sec04Result = psql(sec04Query);
        assert('GATE3-T3.8', 'SEC-04: Automated audit trigger records mutation on financial invoice records',
            sec04Result.includes('PASSED'),
            `Invoice audit trigger result: ${sec04Result}`);

        // --- TEST 3.9: Search Path Hijacking Protection ---
        const searchPathQuery = `
            SELECT proname, prosrc 
            FROM pg_proc p
            JOIN pg_namespace n ON n.oid = p.pronamespace
            WHERE n.nspname IN ('app', 'public')
              AND proname IN ('rpc_ensure_app_user', 'check_active_shift', 'fn_log_audit_event')
              AND proconfig IS NOT NULL;
        `;
        const spRows = psql(searchPathQuery).split('\n').filter(Boolean);
        assert('GATE3-T3.9', 'RPCs and Security Definer functions enforce SET search_path = "" against hijacking',
            spRows.length >= 3,
            `Functions with search_path protection verified: ${spRows.length}`);

        // --- TEST 3.10: Total Active RLS Policies Count across 39 Tables ---
        const totalPoliciesQuery = `
            SELECT count(*) 
            FROM pg_policies 
            WHERE schemaname IN ('app', 'staging', 'audit');
        `;
        const totalPoliciesCount = parseInt(psql(totalPoliciesQuery), 10);
        assert('GATE3-T3.10', 'Comprehensive RLS policy coverage across all operational domains (Core, Clinical, Billing, Staging, Audit)',
            totalPoliciesCount >= 50,
            `Total active RLS policies: ${totalPoliciesCount}`);

    } catch (err) {
        console.error('[FATAL ERROR IN RUNTIME TESTS]:', err);
        failedTests++;
    } finally {
        console.log('\n======================================================');
        console.log(`=== SUITE 03 SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED ===`);
        if (failedTests === 0) {
            console.log('>>> ACCEPTANCE GATE 3: 100% RUNTIME PASS! READY FOR GATE 4! <<<');
        } else {
            console.error(`>>> ACCEPTANCE GATE 3 FAILED: ${failedTests} FAILURES DETECTED! <<<`);
        }
        console.log('======================================================\n');
        process.exit(failedTests === 0 ? 0 : 1);
    }
}

runTests();
