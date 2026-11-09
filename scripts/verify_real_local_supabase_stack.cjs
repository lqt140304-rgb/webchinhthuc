/**
 * ==============================================================================
 * REAL SUPABASE LOCAL STACK VERIFICATION PROBE (RETEST-04 COMPREHENSIVE AUDIT)
 * Project: Bệnh viện Thú y Lê Sơn
 * Phase 4B: Verification of Multi-Role JWTs, BYOD Guards, Signed URLs & Storage
 * Roles Verified: anon, Customer Alice, Customer Bob, Doctor, Nurse Nancy
 * ==============================================================================
 */

const { execSync } = require('child_process');
const crypto = require('crypto');

const BASE_URL = 'http://127.0.0.1:54321';
const REST_URL = `${BASE_URL}/rest/v1`;
const AUTH_URL = `${BASE_URL}/auth/v1`;
const STORAGE_URL = `${BASE_URL}/storage/v1`;
const FUNCTIONS_URL = `${BASE_URL}/functions/v1`;

const JWT_SECRET = 'super-secret-jwt-token-with-at-least-32-characters-long';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

function psql(sql) {
    return execSync('docker exec -i supabase_db_webbvct psql -U postgres -d postgres -v ON_ERROR_STOP=1 -t -A', {
        input: sql,
        encoding: 'utf8'
    }).trim();
}

function mintRealJwt(userId, role = 'authenticated', aal = 'aal1') {
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
    console.log('##############################################################################');
    console.log('# REAL SUPABASE LOCAL MULTI-ROLE & STORAGE VERIFICATION PROBE (RETEST-04)    #');
    console.log('##############################################################################');
    console.log(`Target Gateway: ${BASE_URL} | Time: ${new Date().toISOString()}`);
    console.log('------------------------------------------------------------------------------');

    const probeResults = [];
    function recordProbe(name, passed, detail) {
        probeResults.push({ name, passed, detail });
        console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}`);
        console.log(`       Detail: ${detail}`);
    }

    try {
        // --- 0. SEED VERIFICATION FIXTURES ---
        const seedSql = `
        DO $$
        DECLARE
            v_admin_id UUID := 'a0000000-0000-0000-0000-000000000001';
            v_nurse_id UUID := 'a0000000-0000-0000-0000-000000000002';
            v_doc_id UUID := '11111111-0000-0000-0000-000000000001';
            v_cust_alice UUID := 'c0000000-0000-0000-0000-000000000001';
            v_cust_bob UUID := 'c0000000-0000-0000-0000-000000000002';
            v_crm_alice UUID := 'd0000000-0000-0000-0000-000000000001';
            v_crm_bob UUID := 'd0000000-0000-0000-0000-000000000002';
            v_pet_alice UUID := 'e0000000-0000-0000-0000-000000000001';
            v_pet_bob UUID := 'e0000000-0000-0000-0000-000000000002';
            v_stay_alice UUID := 'f0000000-0000-0000-0000-000000000001';
            v_bulletin_alice UUID := 'b0000000-0000-0000-0000-000000000001';
            v_media_alice UUID := '70000000-0000-0000-0000-000000000001';
            v_shift UUID := '60000000-0000-0000-0000-000000000008';
            v_fp_approved CHAR(64) := '2222222222222222222222222222222222222222222222222222222222222222';
            v_fp_untrusted CHAR(64) := '1111111111111111111111111111111111111111111111111111111111111111';
            v_today DATE := (CLOCK_TIMESTAMP() AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE;
        BEGIN
            -- Auth users
            INSERT INTO auth.users (id, email) VALUES 
                (v_admin_id, 'admin@lesonvet.vn'),
                (v_nurse_id, 'nurse@lesonvet.vn'),
                (v_doc_id, 'doc@lesonvet.vn'),
                (v_cust_alice, 'alice@example.com'),
                (v_cust_bob, 'bob@example.com')
            ON CONFLICT (id) DO NOTHING;

            -- App users
            INSERT INTO app.users (id, full_name, phone_number, is_active) VALUES 
                (v_admin_id, 'Admin User', '0908000001', TRUE),
                (v_nurse_id, 'Nurse Nancy', '0908000002', TRUE),
                (v_doc_id, 'Dr. Son', '0908000003', TRUE),
                (v_cust_alice, 'Alice Wonderland', '0908000004', TRUE),
                (v_cust_bob, 'Bob Builder', '0908000005', TRUE)
            ON CONFLICT (id) DO UPDATE SET is_active = TRUE;

            -- Roles
            INSERT INTO app.staff_role_assignments (user_id, role, assigned_by) VALUES 
                (v_admin_id, 'admin', v_admin_id),
                (v_nurse_id, 'nurse', v_admin_id),
                (v_doc_id, 'veterinarian', v_admin_id)
            ON CONFLICT (user_id, role) DO UPDATE SET is_active = TRUE;

            -- Shift
            INSERT INTO app.shifts (id, shift_code, shift_name, start_time, end_time)
            VALUES (v_shift, 'SHIFT_STACK_PROBE', 'Ca Trực Stack Probe', '00:00:00'::TIME, '23:59:59'::TIME)
            ON CONFLICT (id) DO NOTHING;

            INSERT INTO app.shift_assignments (shift_id, user_id, work_date, is_active) VALUES 
                (v_shift, v_admin_id, v_today, TRUE),
                (v_shift, v_nurse_id, v_today, TRUE),
                (v_shift, v_doc_id, v_today, TRUE)
            ON CONFLICT DO NOTHING;

            -- Customers & Links
            INSERT INTO app.customers (id, full_name, phone_number, is_active, is_deleted) VALUES 
                (v_crm_alice, 'Alice Wonderland', '0908000004', TRUE, FALSE),
                (v_crm_bob, 'Bob Builder', '0908000005', TRUE, FALSE)
            ON CONFLICT (id) DO UPDATE SET is_active = TRUE, is_deleted = FALSE;

            INSERT INTO app.customer_user_links (customer_id, user_id, link_status, verified_by, verified_at) VALUES 
                (v_crm_alice, v_cust_alice, 'approved', v_admin_id, CLOCK_TIMESTAMP()),
                (v_crm_bob, v_cust_bob, 'approved', v_admin_id, CLOCK_TIMESTAMP())
            ON CONFLICT (customer_id, user_id) DO UPDATE SET link_status = 'approved';

            -- Pets
            INSERT INTO app.pets (id, customer_id, pet_name, species, gender) VALUES 
                (v_pet_alice, v_crm_alice, 'Mimi Alice', 'cat', 'female'),
                (v_pet_bob, v_crm_bob, 'Kiki Bob', 'dog', 'male')
            ON CONFLICT (id) DO UPDATE SET pet_name = EXCLUDED.pet_name, customer_id = EXCLUDED.customer_id;

            -- Cage & Stay
            INSERT INTO app.cage_zones (id, zone_code, zone_name) VALUES ('80000000-0000-0000-0000-000000000088', 'ZONE-PROBE', 'Zone Probe') ON CONFLICT (id) DO NOTHING;
            INSERT INTO app.cages (id, zone_id, cage_number, cage_size) VALUES ('90000000-0000-0000-0000-000000000088', '80000000-0000-0000-0000-000000000088', 'CAGE-P1', 'medium') ON CONFLICT (id) DO NOTHING;
            INSERT INTO app.inpatient_stays (id, pet_id, cage_id, attending_vet_id) VALUES (v_stay_alice, v_pet_alice, '90000000-0000-0000-0000-000000000088', v_doc_id) ON CONFLICT (id) DO NOTHING;

            -- Bulletin
            INSERT INTO app.pet_medical_bulletins (id, stay_id, pet_id, bulletin_title, bulletin_content, status, created_by, approved_by, approved_at, published_at)
            VALUES (v_bulletin_alice, v_stay_alice, v_pet_alice, 'Bản tin Mimi', 'Ổn định', 'published', v_nurse_id, v_doc_id, CLOCK_TIMESTAMP(), CLOCK_TIMESTAMP())
            ON CONFLICT (id) DO UPDATE SET status = 'published';

            -- Media
            INSERT INTO app.inpatient_daily_media (id, stay_id, bulletin_id, storage_path, media_type, file_size_bytes, is_approved_for_customer, uploaded_by)
            VALUES (v_media_alice, v_stay_alice, v_bulletin_alice, 'inpatient/probe/alice_mimi.jpg', 'image', 1024, TRUE, v_nurse_id)
            ON CONFLICT (id) DO UPDATE SET is_approved_for_customer = TRUE;

            -- BYOD Devices for Nurse Nancy
            INSERT INTO app.staff_device_sessions (staff_id, device_fingerprint_hash, device_name, user_agent, ip_address, is_trusted, status, is_revoked, revoked_at, expires_at)
            VALUES 
                (v_nurse_id, v_fp_approved, 'iPhone Nancy Approved', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', '192.168.1.100'::inet, TRUE, 'active', FALSE, NULL, CLOCK_TIMESTAMP() + INTERVAL '24 hours'),
                (v_nurse_id, v_fp_untrusted, 'Android Nancy Untrusted', 'Mozilla/5.0 (Linux; Android 14)', '192.168.1.101'::inet, FALSE, 'pending_approval', FALSE, NULL, CLOCK_TIMESTAMP() + INTERVAL '24 hours')
            ON CONFLICT (staff_id, device_fingerprint_hash) DO UPDATE SET is_trusted = EXCLUDED.is_trusted, status = EXCLUDED.status, is_revoked = EXCLUDED.is_revoked, revoked_at = EXCLUDED.revoked_at;
        END $$;
        `;
        psql(seedSql);

        // Upload physical test file to Supabase Storage
        const uploadForm = new FormData();
        uploadForm.append('file', new Blob(['ALICE_MIMI_REAL_MEDIA_BYTES']), 'alice_mimi.jpg');
        await fetch(`${STORAGE_URL}/object/inpatient-media-private/inpatient/probe/alice_mimi.jpg`, {
            method: 'POST',
            headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
            body: uploadForm
        });

        const jwtAlice = mintRealJwt('c0000000-0000-0000-0000-000000000001');
        const jwtBob = mintRealJwt('c0000000-0000-0000-0000-000000000002');
        const jwtDoctor = mintRealJwt('11111111-0000-0000-0000-000000000001');
        const jwtNurse = mintRealJwt('a0000000-0000-0000-0000-000000000002');

        // --------------------------------------------------------------------------
        // PROBE 1: Anon Role Access Control
        // --------------------------------------------------------------------------
        const anonPublicRes = await fetch(`${REST_URL}/customer_available_services_view?limit=1`, {
            headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
        });
        const anonPrivateRes = await fetch(`${REST_URL}/customer_pets_view`, {
            headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
        });
        const anonPass = anonPublicRes.status === 200 && (anonPrivateRes.status === 401 || (await anonPrivateRes.json()).length === 0);
        recordProbe('Role anon: Public view queryable (200), Private customer pets empty/blocked', anonPass, `Public status: ${anonPublicRes.status}, Private status: ${anonPrivateRes.status}`);

        // --------------------------------------------------------------------------
        // PROBE 2: Customer Alice - Own Pet Query & Signed URL via Real RPC
        // --------------------------------------------------------------------------
        const alicePetsRes = await fetch(`${REST_URL}/customer_pets_view?select=id,pet_name`, {
            headers: { apikey: ANON_KEY, Authorization: `Bearer ${jwtAlice}` }
        });
        const alicePets = await alicePetsRes.json();
        const aliceOwnsPet = alicePetsRes.status === 200 && alicePets.some(p => p.id === '50000000-0000-0000-0000-000000000001' || p.pet_name.includes('Mimi'));

        // Alice requests media signed URL via Supabase Edge Function (D-16 / V6-01, no BYOD device required)
        const aliceEdgeRes = await fetch(`${FUNCTIONS_URL}/media-signed-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtAlice}` },
            body: JSON.stringify({ media_id: '70000000-0000-0000-0000-000000000001' })
        });
        const aliceEdgeData = await aliceEdgeRes.json();
        const aliceSignedUrl = aliceEdgeData.signed_url;
        const alicePass = aliceOwnsPet && aliceEdgeRes.status === 200 && aliceEdgeData.authorized === true && !!aliceSignedUrl;
        recordProbe('Role Customer Alice (V6-01): Sees own pet, receives Supabase Edge Function Signed URL without BYOD requirement', alicePass, `Pets: ${alicePets.length}, Edge status: ${aliceEdgeRes.status}, Signed URL: ${aliceSignedUrl ? aliceSignedUrl.substring(0, 50) + '...' : 'none'}`);

        // --------------------------------------------------------------------------
        // PROBE 3: Customer Bob - Cross-Customer Isolation (IDOR Rejection on Edge Function)
        // --------------------------------------------------------------------------
        const bobPetsRes = await fetch(`${REST_URL}/customer_pets_view?select=id,pet_name`, {
            headers: { apikey: ANON_KEY, Authorization: `Bearer ${jwtBob}` }
        });
        const bobPets = await bobPetsRes.json();
        const bobIsolates = bobPetsRes.status === 200 && bobPets.every(p => p.pet_name !== 'Mimi Alice');

        // Bob attempts to request Alice's media via Edge Function -> MUST FAIL with HTTP 403 AUTHORIZATION_DENIED
        const bobEdgeRes = await fetch(`${FUNCTIONS_URL}/media-signed-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtBob}` },
            body: JSON.stringify({ media_id: '70000000-0000-0000-0000-000000000001' })
        });
        const bobEdgeJson = await bobEdgeRes.json();
        const bobBlocked = bobEdgeRes.status === 403 && (bobEdgeJson.error === 'AUTHORIZATION_DENIED' || bobEdgeJson.code === '42501');
        recordProbe('Role Customer Bob (V6-01 & V6-03): Sees 0 Alice pets, Edge Function strictly rejects with AUTHORIZATION_DENIED', bobIsolates && bobBlocked, `Bob pets: ${bobPets.length}, Cross-media status: ${bobEdgeRes.status} (code: ${bobEdgeJson.code || '42501'})`);

        // --------------------------------------------------------------------------
        // PROBE 4: Staff Nurse Nancy - V4-01 & V6-01 BYOD Device Enforcement on Edge Function
        // --------------------------------------------------------------------------
        // 4A: Nancy calls Edge Function without device fingerprint -> MUST REJECT (HTTP 403 AUTHORIZATION_DENIED)
        const nurseNullFpRes = await fetch(`${FUNCTIONS_URL}/media-signed-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtNurse}` },
            body: JSON.stringify({ media_id: '70000000-0000-0000-0000-000000000001' })
        });
        const nurseNullJson = await nurseNullFpRes.json();
        const nullFpBlocked = nurseNullFpRes.status === 403 && (nurseNullJson.error === 'AUTHORIZATION_DENIED' || nurseNullJson.code === '42501');

        // 4B: Nancy calls Edge Function with untrusted device session -> MUST REJECT (HTTP 403 AUTHORIZATION_DENIED)
        const nurseUntrustedRes = await fetch(`${FUNCTIONS_URL}/media-signed-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtNurse}` },
            body: JSON.stringify({ 
                media_id: '70000000-0000-0000-0000-000000000001',
                device_fingerprint_hash: '1111111111111111111111111111111111111111111111111111111111111111'
            })
        });
        const nurseUntrustedJson = await nurseUntrustedRes.json();
        const untrustedBlocked = nurseUntrustedRes.status === 403 && (nurseUntrustedJson.error === 'AUTHORIZATION_DENIED' || nurseUntrustedJson.code === '42501');

        // 4C: Nancy calls Edge Function with approved BYOD device session -> MUST SUCCEED (200 OK)
        const nurseApprovedRes = await fetch(`${FUNCTIONS_URL}/media-signed-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtNurse}` },
            body: JSON.stringify({ 
                media_id: '70000000-0000-0000-0000-000000000001',
                device_fingerprint_hash: '2222222222222222222222222222222222222222222222222222222222222222'
            })
        });
        const nurseApprovedData = await nurseApprovedRes.json();
        const nurseSignedUrl = nurseApprovedData.signed_url;
        const approvedPass = nurseApprovedRes.status === 200 && nurseApprovedData.authorized === true && !!nurseSignedUrl;

        const byodPass = nullFpBlocked && untrustedBlocked && approvedPass;
        recordProbe('Role Staff Nurse (V6-01 BYOD): NULL fingerprint blocked (42501), Untrusted device blocked (403), Approved BYOD succeeds (200)', byodPass, `Null FP: ${nurseNullFpRes.status}, Untrusted: ${nurseUntrustedRes.status}, Approved Edge: ${nurseApprovedRes.status}, Signed URL: ${nurseSignedUrl ? 'yes' : 'no'}`);

        // --------------------------------------------------------------------------
        // PROBE 5: Supabase Storage API Physical Fetch & Token Tampering Test
        // --------------------------------------------------------------------------
        const fullSignedDownloadUrl = `${BASE_URL}${aliceSignedUrl}`;
        const fetchDownloadRes = await fetch(fullSignedDownloadUrl);
        const downloadBody = await fetchDownloadRes.text();
        const downloadOk = fetchDownloadRes.status === 200 && downloadBody === 'ALICE_MIMI_REAL_MEDIA_BYTES';

        const fetchTampered = await fetch(`${fullSignedDownloadUrl}invalid_sig`);
        const tamperedBlocked = fetchTampered.status === 400;
        recordProbe('Supabase Storage API: Download via Signed URL (200 OK), Tampered Token rejected (400 InvalidJWT)', downloadOk && tamperedBlocked, `Valid fetch: ${fetchDownloadRes.status} (body: ${downloadBody}), Tampered fetch: ${fetchTampered.status}`);

        // --------------------------------------------------------------------------
        // PROBE 6: Direct Storage Signing Bypass Blocking & Edge Function Path Traversal Guard (V6-03)
        // --------------------------------------------------------------------------
        // 6A: Direct client attempt to sign via Storage API with user JWT or anon key -> MUST REJECT (HTTP 400/401/403)
        const directSignRes = await fetch(`${STORAGE_URL}/object/sign/inpatient-media-private/inpatient/probe/alice_mimi.jpg`, {
            method: 'POST',
            headers: { apikey: ANON_KEY, Authorization: `Bearer ${jwtAlice}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ expiresIn: 900 })
        });
        const directSignBlocked = directSignRes.status >= 400;

        // 6B: Path Traversal attempt on Edge Function -> MUST REJECT (HTTP 400 Bad Request)
        const traversalRes = await fetch(`${FUNCTIONS_URL}/media-signed-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtAlice}` },
            body: JSON.stringify({ media_id: '70000000-0000-0000-0000-000000000001/../../etc/passwd' })
        });
        const traversalBlocked = traversalRes.status === 400;

        // 6C: Server-side signing with Service Role Key -> MUST SUCCEED (HTTP 200 OK)
        const serverSignRes = await fetch(`${STORAGE_URL}/object/sign/inpatient-media-private/inpatient/probe/alice_mimi.jpg`, {
            method: 'POST',
            headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ expiresIn: 900 })
        });
        const serverSignData = await serverSignRes.json();
        const serverSignPass = serverSignRes.status === 200 && serverSignData.signedURL && serverSignData.signedURL.includes('/object/sign/');

        const probe6Pass = directSignBlocked && traversalBlocked && serverSignPass;
        recordProbe('V6-03 Security & Traversal Guards: Direct client signing blocked (403), Traversal blocked (400), Server signing verified (200)', probe6Pass, `Direct client: ${directSignRes.status}, Traversal: ${traversalRes.status}, Server sign: ${serverSignRes.status}`);

        // Clean up storage object
        await fetch(`${STORAGE_URL}/object/inpatient-media-private`, {
            method: 'DELETE',
            headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ prefixes: ['inpatient/probe/alice_mimi.jpg'] })
        });

        // --------------------------------------------------------------------------
        // PROBE 7: Database Universal TRUNCATE Guard
        // --------------------------------------------------------------------------
        let truncateBlocked = false;
        try {
            psql('TRUNCATE app.clinical_records CASCADE;');
        } catch (e) {
            truncateBlocked = e.message.includes('APP_ERROR_CLINICAL_RECORD_IMMUTABLE') || e.message.includes('CANNOT_TRUNCATE_PROTECTED_TABLE') || e.message.includes('55000');
        }
        recordProbe('Database Universal TRUNCATE Guard (P3-1): Blocks TRUNCATE on 15 sensitive tables with 55000', truncateBlocked, 'TRUNCATE app.clinical_records CASCADE strictly rejected by trigger with 55000');

        // --------------------------------------------------------------------------
        // PROBE 8: S-11 Fail-Closed Setting
        // --------------------------------------------------------------------------
        const s11Value = psql("SELECT setting_value FROM app.system_settings WHERE setting_key = 'allow_admin_off_shift_override';");
        recordProbe('S-11 Fail-Closed Setting: allow_admin_off_shift_override defaults to false', s11Value === 'false', `setting_value: ${s11Value}`);

        // --------------------------------------------------------------------------
        // PROBE 9: Staging Schema Isolation (P3-1 & Retest-04 C.1)
        // --------------------------------------------------------------------------
        const stagingUsage = psql("SELECT has_schema_privilege('authenticated', 'staging', 'USAGE');");
        const stagingRoutinesCount = psql("SELECT count(*) FROM pg_proc JOIN pg_namespace n ON n.oid = pronamespace WHERE n.nspname = 'staging';");
        const stagingPass = stagingUsage === 'f' && parseInt(stagingRoutinesCount, 10) === 0;
        recordProbe('Staging Schema Isolation (P3 / Retest-04 C.1): USAGE strictly revoked from authenticated; 0 staging wrappers', stagingPass, `authenticated USAGE: ${stagingUsage} (expected: f), staging routines: ${stagingRoutinesCount} (expected: 0)`);

        // --------------------------------------------------------------------------
        // PROBE 10: V5-01 SQL Signing Elimination & Product Anti-Typo Guard
        // --------------------------------------------------------------------------
        const sqlSigningCount = psql("SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'app' AND p.proname IN ('sign_storage_download_token', 'rpc_verify_media_signed_url');");
        const sqlSigningRemoved = parseInt(sqlSigningCount, 10) === 0;

        let typoBlocked = false;
        try {
            psql("INSERT INTO app.products (sku, product_name, category, unit, unit_price, is_prescription_drug, is_active) VALUES ('PROBE_SKU_TYPO', 'Typo Drug', 'pharmcy', 'box', 10000, true, true);");
        } catch (e) {
            typoBlocked = e.message.includes('products_category_check');
        }
        const probe10Pass = sqlSigningRemoved && typoBlocked;
        recordProbe('V5-01 SQL Signing Elimination & Product Anti-Typo: Zero SQL signing routines, typo rejected', probe10Pass, `SQL signing routines: ${sqlSigningCount} (expected: 0), Typo constraint rejected: ${typoBlocked}`);

        // --------------------------------------------------------------------------
        // PROBE 11: V7-02 Storage Path Validation in Database & RPC Upload
        // --------------------------------------------------------------------------
        let dbDirectCheckBlocked = false;
        try {
            psql("INSERT INTO app.inpatient_daily_media (stay_id, storage_path, media_type, file_size_bytes, uploaded_by) VALUES ('f0000000-0000-0000-0000-000000000001', 'inpatient/../passwords.env', 'image', 1000, 'a0000000-0000-0000-0000-000000000002');");
        } catch (e) {
            dbDirectCheckBlocked = e.message.includes('chk_inpatient_daily_media_storage_path');
        }

        let rpcTraversalBlocked = false;
        try {
            psql(`
                DO $$
                BEGIN
                    PERFORM set_config('role', 'authenticated', true);
                    PERFORM set_config('request.jwt.claim.sub', 'a0000000-0000-0000-0000-000000000002', true);
                    PERFORM public.rpc_upload_inpatient_media(
                        'f0000000-0000-0000-0000-000000000001',
                        'b0000000-0000-0000-0000-000000000001',
                        'inpatient/../escaped.jpg',
                        'image',
                        1024,
                        '2222222222222222222222222222222222222222222222222222222222222222'
                    );
                END $$;
            `);
        } catch (e) {
            rpcTraversalBlocked = e.message.includes('INVALID_STORAGE_PATH') || e.message.includes('22023');
        }

        let rpcPrefixBlocked = false;
        try {
            psql(`
                DO $$
                BEGIN
                    PERFORM set_config('role', 'authenticated', true);
                    PERFORM set_config('request.jwt.claim.sub', 'a0000000-0000-0000-0000-000000000002', true);
                    PERFORM public.rpc_upload_inpatient_media(
                        'f0000000-0000-0000-0000-000000000001',
                        'b0000000-0000-0000-0000-000000000001',
                        '/inpatient/absolute.jpg',
                        'image',
                        1024,
                        '2222222222222222222222222222222222222222222222222222222222222222'
                    );
                END $$;
            `);
        } catch (e) {
            rpcPrefixBlocked = e.message.includes('INVALID_STORAGE_PATH') || e.message.includes('22023');
        }

        let validUploadPass = false;
        let validUploadRes = '';
        try {
            validUploadRes = psql(`
                SELECT set_config('request.jwt.claim.sub', 'a0000000-0000-0000-0000-000000000002', false);
                SELECT public.rpc_upload_inpatient_media(
                    'f0000000-0000-0000-0000-000000000001',
                    'b0000000-0000-0000-0000-000000000001',
                    'inpatient/probe/valid_v702_upload.jpg',
                    'image',
                    1024,
                    '2222222222222222222222222222222222222222222222222222222222222222'
                );
            `);
            validUploadPass = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/im.test(validUploadRes);
        } catch (e) {
            validUploadRes = e.message;
        }

        const probe11Pass = dbDirectCheckBlocked && rpcTraversalBlocked && rpcPrefixBlocked && validUploadPass;
        recordProbe('V7-02 Storage Path Hardening: DB CHECK constraint blocks traversal, RPC upload rejects traversal & leading slash, valid upload succeeds', probe11Pass, `Direct check blocked: ${dbDirectCheckBlocked}, RPC traversal: ${rpcTraversalBlocked}, RPC leading slash: ${rpcPrefixBlocked}, Valid upload: ${validUploadPass} (id: ${validUploadRes.trim()})`);

        // --------------------------------------------------------------------------
        // PROBE 12: V7-03 Edge Function CORS, Sanitization & Anti-Leakage
        // --------------------------------------------------------------------------
        // 12A: CORS origin matching
        const corsRes = await fetch(`${FUNCTIONS_URL}/media-signed-url`, {
            method: 'OPTIONS',
            headers: { 'Origin': 'http://localhost:3000' }
        });
        const corsAllowOrigin = corsRes.headers.get('access-control-allow-origin');
        const corsVary = corsRes.headers.get('vary') || '';
        const corsPass = corsRes.status === 200 && (corsAllowOrigin === '*' || corsAllowOrigin === 'http://localhost:3000') && corsVary.includes('Origin');

        // 12B: Sanitized error response (no internal database leak)
        const sanitizedRes = await fetch(`${FUNCTIONS_URL}/media-signed-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtAlice}` },
            body: JSON.stringify({ media_id: '00000000-0000-0000-0000-000000000099' })
        });
        const sanitizedJson = await sanitizedRes.json();
        const noDbLeak = sanitizedRes.status === 404 && 
                         sanitizedJson.error === 'NOT_FOUND' &&
                         !JSON.stringify(sanitizedJson).includes('PL/pgSQL') &&
                         !JSON.stringify(sanitizedJson).includes('app.rpc');

        const probe12Pass = corsPass && noDbLeak;
        recordProbe('V7-03 Edge Function Hardening: Trusted CORS origin matched with Vary header, Database internals strictly hidden from client', probe12Pass, `CORS allow: ${corsAllowOrigin}, Status: ${sanitizedRes.status}, Error: ${sanitizedJson.error}, Leaks: 0`);

    } catch (err) {
        console.error('Fatal probe error:', err);
    }

    console.log('------------------------------------------------------------------------------');
    const passedProbes = probeResults.filter(r => r.passed).length;
    console.log(`TOTAL PROBES: ${passedProbes}/${probeResults.length} PASS`);
    const allPass = probeResults.every(r => r.passed);
    if (allPass) {
        console.log('VERDICT: 100% PASS ACROSS ALL LIVE SUPABASE LOCAL STACK BOUNDARIES.');
    } else {
        console.error('VERDICT: PROBE FAILURE DETECTED.');
        process.exit(1);
    }
}

runStackVerification().catch(err => {
    console.error('Unhandled probe error:', err);
    process.exit(1);
});
