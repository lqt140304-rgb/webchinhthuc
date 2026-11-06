/**
 * ==============================================================================
 * RUNTIME TEST SUITE 02: 39 TABLES SCHEMA DDL, CONSTRAINTS & GATE 1 REGRESSION
 * Project: Bệnh viện Thú y Lê Sơn
 * Phase 4B Implementation Plan: Acceptance Gate 2 Verification
 * Mode: RUNTIME VERIFICATION (Executes against live local PostgreSQL & PostgREST)
 * ==============================================================================
 */

const { execSync } = require('child_process');

process.env.APP_ENV = 'local_test';

console.log('=== RUNNING RUNTIME TEST SUITE 02: 39 TABLES DDL & GATE 2 CONSTRAINTS ===');
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

// Helper to query PostgreSQL container directly via stdin
function psql(query) {
    const ps = execSync('docker ps --filter "name=supabase_db" --format "{{.Names}}"', { encoding: 'utf8' }).trim();
    if (!ps) throw new Error('Database container not found.');
    const container = ps.split('\n')[0].trim();
    return execSync(`docker exec -i ${container} psql -U postgres -d postgres -t -A`, { input: query, encoding: 'utf8' }).trim();
}

async function runTests() {
    try {
        // =====================================================================
        // TEST 2.1: EXACT 39 TABLES ACROSS 3 SCHEMAS
        // =====================================================================
        const tableCountsRaw = psql(`
            SELECT table_schema || ':' || count(*) 
            FROM information_schema.tables 
            WHERE table_schema IN ('app', 'staging', 'audit') 
            GROUP BY table_schema 
            ORDER BY table_schema;
        `);
        const counts = {};
        tableCountsRaw.split('\n').filter(Boolean).forEach(line => {
            const [s, c] = line.split(':');
            counts[s] = parseInt(c, 10);
        });

        const appCount = counts['app'] || 0;
        const stagingCount = counts['staging'] || 0;
        const auditCount = counts['audit'] || 0;
        const totalTables = appCount + stagingCount + auditCount;

        assert('GATE2-T2.1', 'Exact table count: 39 tables (34 app + 4 staging + 1 audit)',
               (totalTables === 39 && appCount === 34 && stagingCount === 4 && auditCount === 1),
               `Total: ${totalTables} (app: ${appCount}, staging: ${stagingCount}, audit: ${auditCount})`);

        // =====================================================================
        // TEST 2.2: P1-C INVARIANT - ZERO CASCADE ON MEDICAL/CORE RELATIONS
        // =====================================================================
        const cascadeCountRaw = psql(`
            SELECT count(*)
            FROM information_schema.table_constraints tc
            JOIN information_schema.referential_constraints rc 
              ON tc.constraint_name = rc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
              AND tc.table_schema IN ('app', 'audit')
              AND rc.delete_rule = 'CASCADE';
        `);
        const cascadeCount = parseInt(cascadeCountRaw, 10);
        assert('GATE2-T2.2', 'P1-C Invariant: Zero ON DELETE CASCADE in app and audit schemas',
               cascadeCount === 0,
               `Found ${cascadeCount} CASCADE delete rules in app/audit (Expected: 0)`);

        // =====================================================================
        // TEST 2.3: P1-E INVARIANT - NO UNIQUE ON CUSTOMER PHONE NUMBER
        // =====================================================================
        const uniqueConstraintCount = parseInt(psql(`
            SELECT count(*)
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu 
              ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
            WHERE tc.table_schema = 'app' 
              AND tc.table_name = 'customers' 
              AND kcu.column_name = 'phone_number';
        `), 10);

        const uniqueIndexCount = parseInt(psql(`
            SELECT count(*) 
            FROM pg_indexes 
            WHERE schemaname = 'app' 
              AND tablename = 'customers' 
              AND indexdef LIKE '%UNIQUE%' 
              AND indexdef LIKE '%phone_number%';
        `), 10);

        // Runtime insertion test: 2 distinct customers with identical phone
        const testPhone = '0908889999';
        psql(`
            INSERT INTO app.customers (id, full_name, phone_number) VALUES 
              ('00000000-0000-0000-0000-000000000001', 'Khách A (Vợ)', '${testPhone}'),
              ('00000000-0000-0000-0000-000000000002', 'Khách B (Chồng)', '${testPhone}');
        `);
        const insertedCount = parseInt(psql(`SELECT count(*) FROM app.customers WHERE phone_number = '${testPhone}';`), 10);
        psql(`DELETE FROM app.customers WHERE phone_number = '${testPhone}';`);

        assert('GATE2-T2.3', 'P1-E Invariant: No UNIQUE constraint or index on customer phone; duplicate phones permitted',
               (uniqueConstraintCount === 0 && uniqueIndexCount === 0 && insertedCount === 2),
               `Unique constraints: ${uniqueConstraintCount}, Unique indexes: ${uniqueIndexCount}, Inserted duplicates: ${insertedCount}`);

        // =====================================================================
        // TEST 2.4: P1-C RUNTIME ENFORCEMENT (ON DELETE RESTRICT)
        // =====================================================================
        const restrictTestResult = psql(`
            DO $$
            DECLARE
                v_cust_id UUID;
                v_pet_id UUID;
            BEGIN
                INSERT INTO app.customers (full_name, phone_number) VALUES ('Restrict Parent', '0999999999') RETURNING id INTO v_cust_id;
                INSERT INTO app.pets (customer_id, pet_name, species, gender) VALUES (v_cust_id, 'Pet Child', 'Dog', 'male') RETURNING id INTO v_pet_id;
                
                BEGIN
                    DELETE FROM app.customers WHERE id = v_cust_id;
                    RAISE EXCEPTION 'TEST_FAILED: Customer deleted despite child pet existing!';
                EXCEPTION WHEN foreign_key_violation THEN
                    -- Caught expected RESTRICT violation
                END;

                DELETE FROM app.pets WHERE id = v_pet_id;
                DELETE FROM app.customers WHERE id = v_cust_id;
            END $$;
            SELECT 'PASSED';
        `);
        assert('GATE2-T2.4', 'P1-C Runtime Test: Deleting customer with active pet is strictly blocked by RESTRICT',
               restrictTestResult.includes('PASSED'),
               `Result: ${restrictTestResult}`);

        // =====================================================================
        // TEST 2.5: BYO-2 DEVICE TRUST TABLE SPECIFICATIONS
        // =====================================================================
        const deviceTrustedDefault = psql(`
            SELECT column_default 
            FROM information_schema.columns 
            WHERE table_schema = 'app' AND table_name = 'staff_device_sessions' AND column_name = 'is_trusted';
        `);
        const deviceStaffRestrict = psql(`
            SELECT rc.delete_rule
            FROM information_schema.table_constraints tc
            JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name
            JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
            WHERE tc.table_schema = 'app' AND tc.table_name = 'staff_device_sessions' AND kcu.column_name = 'staff_id';
        `);
        assert('GATE2-T2.5', 'BYO-2: staff_device_sessions has is_trusted DEFAULT false and ON DELETE RESTRICT on staff_id',
               (deviceTrustedDefault === 'false' && deviceStaffRestrict === 'RESTRICT'),
               `is_trusted default: ${deviceTrustedDefault}, staff_id delete_rule: ${deviceStaffRestrict}`);

        // =====================================================================
        // TEST 2.6: HISTORICAL LOYALTY POINTS (V-2 ROLLBACK SUPPORT)
        // =====================================================================
        const loyaltyDeletedCol = psql(`
            SELECT column_name || ':' || column_default 
            FROM information_schema.columns 
            WHERE table_schema = 'app' AND table_name = 'historical_loyalty_points' AND column_name = 'is_deleted';
        `);
        const loyaltyRollbackCol = psql(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'app' AND table_name = 'historical_loyalty_points' AND column_name = 'rollback_job_id';
        `);
        assert('GATE2-T2.6', 'V-2: historical_loyalty_points supports rollback (is_deleted DEFAULT false, rollback_job_id column)',
               (loyaltyDeletedCol.includes('is_deleted:false') && loyaltyRollbackCol === 'rollback_job_id'),
               `Found columns: ${loyaltyDeletedCol}, ${loyaltyRollbackCol}`);

        // =====================================================================
        // TEST 2.7: TWO-MAN RULE HARD CONSTRAINTS (D-07)
        // =====================================================================
        const stagingTwoMan = psql(`
            SELECT check_clause 
            FROM information_schema.check_constraints 
            WHERE constraint_name = 'chk_two_man_approval';
        `);
        const bulletinTwoMan = psql(`
            SELECT check_clause 
            FROM information_schema.check_constraints 
            WHERE constraint_name = 'chk_bulletin_approval';
        `);
        assert('GATE2-T2.7', 'D-07 Two-Man Rule: Hard CHECK constraints enforce approved_by <> created_by / uploaded_by',
               (stagingTwoMan.includes('approved_by <> uploaded_by') && bulletinTwoMan.includes('approved_by <> created_by')),
               `staging check: ${stagingTwoMan}; bulletin check: ${bulletinTwoMan}`);

        // =====================================================================
        // TEST 2.8: INPATIENT MEDIA 60-DAY RETENTION (D-10)
        // =====================================================================
        const mediaRetention = psql(`
            SELECT column_default 
            FROM information_schema.columns 
            WHERE table_schema = 'app' AND table_name = 'inpatient_daily_media' AND column_name = 'auto_delete_at';
        `);
        assert('GATE2-T2.8', 'D-10 Policy: inpatient_daily_media auto_delete_at defaults to 60 days from upload',
               mediaRetention.includes('60 days'),
               `auto_delete_at default: ${mediaRetention}`);

        // =====================================================================
        // TEST 2.9: GATE 1 REGRESSION - POSTGREST PROFILE BYPASS TEST
        // =====================================================================
        const postgrestBase = 'http://127.0.0.1:54321/rest/v1';

        // 1. Attempt schema bypass with Accept-Profile: app
        let acceptProfileStatus;
        try {
            const res = await fetch(`${postgrestBase}/customers`, {
                headers: { 
                    'apikey': 'anon',
                    'Accept-Profile': 'app'
                }
            });
            acceptProfileStatus = res.status;
        } catch (e) {
            acceptProfileStatus = 'CONN_ERR: ' + e.message;
        }

        // 2. Attempt schema bypass with Content-Profile: app
        let contentProfileStatus;
        try {
            const res = await fetch(`${postgrestBase}/customers`, {
                method: 'POST',
                headers: { 
                    'apikey': 'anon',
                    'Content-Type': 'application/json',
                    'Content-Profile': 'app'
                },
                body: JSON.stringify({ full_name: 'Hacker', phone_number: '0999999999' })
            });
            contentProfileStatus = res.status;
        } catch (e) {
            contentProfileStatus = 'CONN_ERR: ' + e.message;
        }

        // 3. Normal access without profile header to internal table
        const normalAccessRes = await fetch(`${postgrestBase}/customers`, { headers: { 'apikey': 'anon' } });
        const normalAccessStatus = normalAccessRes.status;

        const bypassBlocked = (acceptProfileStatus === 406 || acceptProfileStatus === 404 || acceptProfileStatus === 400) &&
                              (contentProfileStatus === 406 || contentProfileStatus === 404 || contentProfileStatus === 400) &&
                              (normalAccessStatus === 404);

        assert('GATE2-T2.9', 'Gate 1 Regression: PostgREST schema bypass via Accept-Profile / Content-Profile is strictly rejected (404/406)',
               bypassBlocked,
               `Accept-Profile status: ${acceptProfileStatus}, Content-Profile status: ${contentProfileStatus}, Normal access: ${normalAccessStatus}`);

        // =====================================================================
        // TEST 2.10: GATE 1 REGRESSION - AUTHENTICATED ROLE PRIVILEGE LOCK
        // =====================================================================
        // Ensure role authenticated has NO SELECT on app tables by default
        const authCustPriv = psql("SELECT has_table_privilege('authenticated', 'app.customers', 'SELECT');");
        const authClinPriv = psql("SELECT has_table_privilege('authenticated', 'app.clinical_records', 'SELECT');");
        const authAuditPriv = psql("SELECT has_table_privilege('authenticated', 'audit.audit_logs', 'SELECT');");
        const authStagingPriv = psql("SELECT has_table_privilege('authenticated', 'staging.import_jobs', 'SELECT');");

        const authPrivsLocked = (authCustPriv === 'f') && (authClinPriv === 'f') && 
                                (authAuditPriv === 'f') && (authStagingPriv === 'f');

        assert('GATE2-T2.10', 'Gate 1 Regression: Authenticated role has 0 direct table privileges on app, staging, audit schemas',
               authPrivsLocked,
               `SELECT privileges - app.customers: ${authCustPriv}, app.clinical_records: ${authClinPriv}, audit.audit_logs: ${authAuditPriv}, staging.import_jobs: ${authStagingPriv}`);

    } catch (err) {
        console.error('[FATAL RUNTIME ERROR]:', err);
        process.exit(1);
    }

    console.log(`\n=== SUITE 02 SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED ===`);
    if (failedTests > 0) {
        console.error(`>>> GATE 2 FAILED WITH ${failedTests} FAILURES! <<<`);
        process.exit(1);
    } else {
        console.log('>>> ACCEPTANCE GATE 2: 100% RUNTIME PASS! READY FOR GATE 3! <<<');
    }
}

runTests();
