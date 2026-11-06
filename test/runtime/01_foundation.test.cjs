/**
 * ==============================================================================
 * RUNTIME TEST SUITE 01: FOUNDATION SCHEMAS & ISOLATION
 * Project: Bệnh viện Thú y Lê Sơn
 * Phase 4B Implementation Plan: Acceptance Gate 1 Verification
 * Mode: RUNTIME VERIFICATION (Executes against live local PostgreSQL & PostgREST)
 * ==============================================================================
 */

const { execSync } = require('child_process');

process.env.APP_ENV = 'local_test';

console.log('=== RUNNING RUNTIME TEST SUITE 01: FOUNDATION SCHEMAS & ISOLATION ===');
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
        // --- TEST 1.1: Schemas Existence ---
        const schemasRaw = psql("SELECT schema_name FROM information_schema.schemata WHERE schema_name IN ('public', 'app', 'staging', 'audit') ORDER BY schema_name;");
        const schemas = schemasRaw.split('\n').filter(Boolean);
        const has4Schemas = schemas.length === 4 && 
                            schemas.includes('public') && 
                            schemas.includes('app') && 
                            schemas.includes('staging') && 
                            schemas.includes('audit');
        assert('GATE1-T1.1', 'All 4 architectural schemas exist in PostgreSQL (public, app, staging, audit)', 
               has4Schemas, `Found schemas: [${schemas.join(', ')}]`);

        // --- TEST 1.2: Core Extensions ---
        const extsRaw = psql("SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto', 'citext') ORDER BY extname;");
        const exts = extsRaw.split('\n').filter(Boolean);
        const has3Exts = exts.length === 3 && 
                         exts.includes('uuid-ossp') && 
                         exts.includes('pgcrypto') && 
                         exts.includes('citext');
        assert('GATE1-T1.2', 'Core PostgreSQL extensions installed (uuid-ossp, pgcrypto, citext)', 
               has3Exts, `Installed extensions: [${exts.join(', ')}]`);

        // --- TEST 1.3: Schema USAGE Permissions ---
        // Ensure app, staging, audit do NOT have USAGE granted to anon or PUBLIC
        const appUsage = psql("SELECT has_schema_privilege('anon', 'app', 'USAGE');");
        const stagingUsage = psql("SELECT has_schema_privilege('anon', 'staging', 'USAGE');");
        const auditUsage = psql("SELECT has_schema_privilege('anon', 'audit', 'USAGE');");
        const appPublicUsage = psql("SELECT has_schema_privilege('public', 'app', 'USAGE');");
        const isolationOk = (appUsage === 'f') && (stagingUsage === 'f') && (auditUsage === 'f') && (appPublicUsage === 'f');
        assert('GATE1-T1.3', 'Internal schemas (app, staging, audit) are strictly denied USAGE from anon and PUBLIC',
               isolationOk, `anon USAGE - app: ${appUsage}, staging: ${stagingUsage}, audit: ${auditUsage}; public USAGE - app: ${appPublicUsage}`);

        // --- TEST 1.4: PostgREST HTTP Isolation (HTTP 404 on Internal Schemas) ---
        const postgrestBase = 'http://127.0.0.1:54321/rest/v1';
        
        let appStatus, stagingStatus, auditStatus;
        try {
            const resApp = await fetch(`${postgrestBase}/app`, { headers: { 'apikey': 'anon' } });
            appStatus = resApp.status;
        } catch (e) {
            appStatus = 'CONN_ERROR: ' + e.message;
        }

        try {
            const resStaging = await fetch(`${postgrestBase}/staging`, { headers: { 'apikey': 'anon' } });
            stagingStatus = resStaging.status;
        } catch (e) {
            stagingStatus = 'CONN_ERROR: ' + e.message;
        }

        try {
            const resAudit = await fetch(`${postgrestBase}/audit`, { headers: { 'apikey': 'anon' } });
            auditStatus = resAudit.status;
        } catch (e) {
            auditStatus = 'CONN_ERROR: ' + e.message;
        }

        const is404 = (appStatus === 404) && (stagingStatus === 404) && (auditStatus === 404);
        assert('GATE1-T1.4', 'PostgREST API returns HTTP 404 for internal schemas (/app, /staging, /audit)',
               is404, `HTTP status codes - /app: ${appStatus}, /staging: ${stagingStatus}, /audit: ${auditStatus}`);

        // --- TEST 1.5: Default Privileges Locked ---
        // Dynamically create test functions in app and public to verify default execution revocation
        psql("CREATE OR REPLACE FUNCTION app.__test_gate1_fn() RETURNS int LANGUAGE sql AS 'SELECT 1;';");
        psql("CREATE OR REPLACE FUNCTION public.__test_gate1_pub_fn() RETURNS int LANGUAGE sql AS 'SELECT 2;';");

        const anonAppExec = psql("SELECT has_function_privilege('anon', 'app.__test_gate1_fn()', 'EXECUTE');");
        const publicAppExec = psql("SELECT has_function_privilege('public', 'app.__test_gate1_fn()', 'EXECUTE');");
        const anonPubExec = psql("SELECT has_function_privilege('anon', 'public.__test_gate1_pub_fn()', 'EXECUTE');");
        const pubPubExec = psql("SELECT has_function_privilege('public', 'public.__test_gate1_pub_fn()', 'EXECUTE');");

        psql("DROP FUNCTION IF EXISTS app.__test_gate1_fn();");
        psql("DROP FUNCTION IF EXISTS public.__test_gate1_pub_fn();");

        const defaultPrivsLocked = (anonAppExec === 'f') && (publicAppExec === 'f') && 
                                   (anonPubExec === 'f') && (pubPubExec === 'f');

        assert('GATE1-T1.5', 'Default function execution privilege strictly revoked from anon & PUBLIC',
               defaultPrivsLocked, 
               `app exec: (anon=${anonAppExec}, public=${publicAppExec}); public exec: (anon=${anonPubExec}, public=${pubPubExec})`);

    } catch (err) {
        console.error('[FATAL RUNTIME ERROR]:', err);
        process.exit(1);
    }

    console.log(`\n=== SUITE 01 SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED ===`);
    if (failedTests > 0) {
        console.error(`>>> GATE 1 FAILED WITH ${failedTests} FAILURES! <<<`);
        process.exit(1);
    } else {
        console.log('>>> ACCEPTANCE GATE 1: 100% RUNTIME PASS! READY FOR GATE 2! <<<');
    }
}

runTests();
