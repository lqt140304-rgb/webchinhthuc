/**
 * ==============================================================================
 * REAL SUPABASE LOCAL STACK VERIFICATION PROBE (RETEST-04 READINESS)
 * Project: Bệnh viện Thú y Lê Sơn
 * Phase 4B: Verification of PostgREST HTTP, Supabase Storage, Auth/GoTrue & RLS
 * ==============================================================================
 */

const { execSync } = require('child_process');
const crypto = require('crypto');

const BASE_URL = 'http://127.0.0.1:54321';
const REST_URL = `${BASE_URL}/rest/v1`;
const AUTH_URL = `${BASE_URL}/auth/v1`;
const STORAGE_URL = `${BASE_URL}/storage/v1`;

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A_error_mock_key_only_for_local_testing_sample';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
const JWT_SECRET = 'super-secret-jwt-token-with-at-least-32-characters-long';

function psql(sql) {
    return execSync('docker exec -i supabase_db_webbvct psql -U postgres -d postgres -v ON_ERROR_STOP=1 -t -A', {
        input: sql,
        encoding: 'utf8'
    }).trim();
}

function createTestJwt(userId, role = 'authenticated', aal = 'aal1') {
    const now = Math.floor(Date.now() / 1000);
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
        sub: userId,
        role,
        aal,
        iss: 'supabase-demo',
        iat: now,
        exp: now + 3600
    })).toString('base64url');
    const sig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
    return `${header}.${payload}.${sig}`;
}

async function runStackVerification() {
    console.log('=== REAL SUPABASE LOCAL STACK VERIFICATION PROBE ===');
    console.log(`Target: ${BASE_URL} | Time: ${new Date().toISOString()}`);
    console.log('----------------------------------------------------');

    const probeResults = [];
    function recordProbe(name, passed, detail) {
        probeResults.push({ name, passed, detail });
        console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}: ${detail}`);
    }

    try {
        // 1. PostgREST Schema Isolation
        const directAppRes = await fetch(`${REST_URL}/app/pets`, {
            headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` }
        });
        recordProbe('PostgREST Schema Isolation (/app/pets)', directAppRes.status === 404, `HTTP status ${directAppRes.status} (404 expected)`);

        // 2. PostgREST Public Active Services Query
        const servicesRes = await fetch(`${REST_URL}/customer_available_services_view?select=id,service_name,category,base_price`, {
            headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` }
        });
        const servicesData = await servicesRes.json();
        recordProbe('PostgREST Query Services (Public View)', servicesRes.status === 200 && Array.isArray(servicesData), `Status: ${servicesRes.status}, rows returned: ${servicesData.length}`);

        // 3. Supabase Auth/GoTrue Health Check
        const authHealthRes = await fetch(`${AUTH_URL}/health`);
        const authHealthJson = await authHealthRes.json();
        recordProbe('GoTrue /auth/v1/health', authHealthRes.status === 200, `Status: ${authHealthRes.status}, version: ${authHealthJson.version || 'active'}`);

        // 4. Supabase Storage: Direct Private Access Blocked
        const directStorageRes = await fetch(`${STORAGE_URL}/object/public/inpatient-media-private/secret.jpg`);
        recordProbe('Storage Private Bucket Direct Block', directStorageRes.status === 400 || directStorageRes.status === 404, `Status: ${directStorageRes.status} (Bucket not found / NoSuchBucket)`);

        // 5. Supabase Storage: Upload, Standard Sign, Fetch, Expired Check, Purge
        const testAssetPath = 'inpatient/probe/stack_verify.txt';
        const uploadForm = new FormData();
        uploadForm.append('file', new Blob(['STACK_PROBE_REAL_BYTES']), 'stack_verify.txt');
        const uploadRes = await fetch(`${STORAGE_URL}/object/inpatient-media-private/${testAssetPath}`, {
            method: 'POST',
            headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
            body: uploadForm
        });
        recordProbe('Storage API Physical Upload', uploadRes.status === 200, `Upload status: ${uploadRes.status}`);

        // Sign asset via standard Postgres RPC
        const signSql = `
        DO $$
        DECLARE
            v_media_id UUID;
            v_nurse_id UUID := 'a0000000-0000-0000-0000-000000000002';
        BEGIN
            INSERT INTO app.inpatient_daily_media (
                stay_id, storage_path, media_type, file_size_bytes, is_approved_for_customer, uploaded_by
            ) VALUES (
                'f0000000-0000-0000-0000-000000000001'::uuid,
                'inpatient/probe/stack_verify.txt',
                'image',
                100,
                TRUE,
                v_nurse_id
            );
        END $$;
        SELECT set_config('request.jwt.claim.sub', 'a0000000-0000-0000-0000-000000000002', false);
        SELECT set_config('request.jwt.claim.role', 'authenticated', false);
        SELECT (app.rpc_generate_media_signed_url(id)->>'signed_url')
        FROM app.inpatient_daily_media
        WHERE storage_path = 'inpatient/probe/stack_verify.txt'
        ORDER BY id DESC LIMIT 1;
        `;
        const signLines = psql(signSql).trim().split('\n');
        const signedUrlPath = signLines[signLines.length - 1].trim();

        const fetchSignedRes = await fetch(`${BASE_URL}${signedUrlPath}`);
        const signedContent = await fetchSignedRes.text();
        recordProbe('Storage API Download via Signed URL', fetchSignedRes.status === 200 && signedContent === 'STACK_PROBE_REAL_BYTES', `Status: ${fetchSignedRes.status}, content: ${signedContent}`);

        // Fetch with tampered token
        const fetchTamperedRes = await fetch(`${BASE_URL}${signedUrlPath}tampered`);
        recordProbe('Storage API Tampered Token Rejection', fetchTamperedRes.status === 400, `Tampered status: ${fetchTamperedRes.status} (InvalidJWT)`);

        // Clean up storage object
        await fetch(`${STORAGE_URL}/object/inpatient-media-private`, {
            method: 'DELETE',
            headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ prefixes: [testAssetPath] })
        });

        // 6. Database Immutability TRUNCATE Check
        let truncateBlocked = false;
        try {
            psql('TRUNCATE app.clinical_records CASCADE;');
        } catch (e) {
            truncateBlocked = e.message.includes('APP_ERROR_CLINICAL_RECORD_IMMUTABLE') || e.message.includes('CANNOT_TRUNCATE_PROTECTED_TABLE') || e.message.includes('55000');
        }
        recordProbe('Database Universal TRUNCATE Guard', truncateBlocked, 'TRUNCATE app.clinical_records CASCADE strictly blocked with 55000 / IMMUTABLE');

        // 7. S-11 Fail-Closed Setting
        const s11Value = psql("SELECT setting_value FROM app.system_settings WHERE setting_key = 'allow_admin_off_shift_override';");
        recordProbe('S-11 Fail-Closed Default', s11Value === 'false', `setting_value: ${s11Value}`);

        // 8. R2-01 Privacy Auto-Inference & Category Check
        let typoBlocked = false;
        try {
            psql("INSERT INTO app.products (sku, product_name, category, unit, unit_price, is_prescription_drug, is_active) VALUES ('PROBE_SKU', 'Probe Drug', 'pharmcy', 'box', 10000, true, true);");
        } catch (e) {
            typoBlocked = e.message.includes('products_category_check');
        }
        recordProbe('Product Category Check Constraint (Anti-Typo)', typoBlocked, 'Invalid category "pharmcy" rejected by products_category_check');

        // 9. Anon Revocation on Verification RPC
        let anonBlocked = false;
        try {
            psql("SET ROLE anon; SELECT app.rpc_verify_media_signed_url('00000000-0000-0000-0000-000000000001'::uuid, 1794200000, 'sig');");
        } catch (e) {
            anonBlocked = e.message.includes('42501') || e.message.includes('permission denied');
        }
        recordProbe('Anon Revoked on Verify RPC (V3-01)', anonBlocked, 'Role anon blocked with 42501 permission denied');

        // 10. Staging USAGE Permission (P3)
        const stagingUsage = psql("SELECT has_schema_privilege('authenticated', 'staging', 'USAGE');");
        recordProbe('Staging Schema USAGE for authenticated (P3)', stagingUsage === 't', `has_schema_privilege: ${stagingUsage}`);

    } catch (err) {
        console.error('Fatal probe error:', err);
    }

    console.log('----------------------------------------------------');
    const allPass = probeResults.every(r => r.passed);
    console.log(`PROBE SUMMARY: ${probeResults.filter(r => r.passed).length}/${probeResults.length} PROBES PASS`);
    if (allPass) {
        console.log('ALL LOCAL STACK BOUNDARIES VERIFIED SUCCESSFULLY.');
    } else {
        process.exit(1);
    }
}

runStackVerification();
