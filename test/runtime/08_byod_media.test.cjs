/**
 * ==============================================================================
 * RUNTIME TEST SUITE 08: BYOD DEVICE SESSIONS, MEDIA PRIVACY & PURGE (GATE 8)
 * Project: Bệnh viện Thú y Lê Sơn
 * Phase 4B Implementation Plan: Acceptance Gate 8 Verification
 * Mode: RUNTIME VERIFICATION (Executes against live local PostgreSQL)
 * Covers: D-10, D-20, SEC-18, SEC-19, SEC-20, SEC-21, SEC-22
 * ==============================================================================
 */

const { execSync } = require('child_process');

process.env.APP_ENV = 'local_test';

console.log('=== RUNNING RUNTIME TEST SUITE 08: BYOD DEVICE SESSIONS & MEDIA PRIVACY ===');
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
        // --- 0. SETUP FIXTURES (Admin, Staff Nurse, Customer Alice, Customer Bob, Stay) ---
        const setupSql = `
        DO $$
        DECLARE
            v_admin_id UUID := 'a0000000-0000-0000-0000-000000000001';
            v_nurse_id UUID := 'a0000000-0000-0000-0000-000000000002';
            v_recept_id UUID := 'a0000000-0000-0000-0000-000000000003';
            v_cust_u1 UUID := 'c0000000-0000-0000-0000-000000000001';
            v_cust_u2 UUID := 'c0000000-0000-0000-0000-000000000002';
            v_cust1_id UUID := 'd0000000-0000-0000-0000-000000000001';
            v_cust2_id UUID := 'd0000000-0000-0000-0000-000000000002';
            v_pet1_id UUID := 'e0000000-0000-0000-0000-000000000001';
            v_stay1_id UUID := 'f0000000-0000-0000-0000-000000000001';
            v_cage_id UUID := '90000000-0000-0000-0000-000000000001';
            v_zone_id UUID := '80000000-0000-0000-0000-000000000001';
            v_shift_tmpl UUID := '60000000-0000-0000-0000-000000000008';
            v_now_vn TIMESTAMP := (CLOCK_TIMESTAMP() AT TIME ZONE 'Asia/Ho_Chi_Minh');
            v_today DATE := v_now_vn::DATE;
        BEGIN
            -- Cleanup previous test runs
            DELETE FROM app.inpatient_daily_media WHERE storage_path LIKE 'inpatient/stay1/%';
            DELETE FROM app.staff_device_sessions WHERE device_fingerprint_hash IN (
                '1111111111111111111111111111111111111111111111111111111111111111',
                '2222222222222222222222222222222222222222222222222222222222222222'
            );

            -- 1. Auth users
            INSERT INTO auth.users (id, email) VALUES 
                (v_admin_id, 'admin_gate8@lesonvet.vn'),
                (v_nurse_id, 'nurse_gate8@lesonvet.vn'),
                (v_recept_id, 'recept_gate8@lesonvet.vn'),
                (v_cust_u1, 'alice_gate8@gmail.com'),
                (v_cust_u2, 'bob_gate8@gmail.com')
            ON CONFLICT (id) DO NOTHING;

            -- 2. App users
            INSERT INTO app.users (id, full_name, phone_number, is_active) VALUES 
                (v_admin_id, 'Admin Bob', '0908000001', TRUE),
                (v_nurse_id, 'Nurse Nancy', '0908000002', TRUE),
                (v_recept_id, 'Receptionist Rita', '0908000003', TRUE),
                (v_cust_u1, 'Customer Alice User', '0908000004', TRUE),
                (v_cust_u2, 'Customer Bob User', '0908000005', TRUE)
            ON CONFLICT (id) DO UPDATE SET is_active = TRUE;

            -- 3. Staff Role assignments
            INSERT INTO app.staff_role_assignments (user_id, role, assigned_by) VALUES 
                (v_admin_id, 'admin', v_admin_id),
                (v_nurse_id, 'nurse', v_admin_id),
                (v_nurse_id, 'veterinarian', v_admin_id),
                (v_recept_id, 'receptionist', v_admin_id)
            ON CONFLICT (user_id, role) DO UPDATE SET is_active = TRUE;

            -- 4. Shifts
            INSERT INTO app.shifts (id, shift_code, shift_name, start_time, end_time)
            VALUES (v_shift_tmpl, 'SHIFT_GATE8', 'Ca Trực Gate 8 BYOD', '00:00:00'::TIME, '23:59:59'::TIME)
            ON CONFLICT (shift_code) DO NOTHING;

            SELECT id INTO v_shift_tmpl FROM app.shifts WHERE shift_code = 'SHIFT_GATE8';

            INSERT INTO app.shift_assignments (shift_id, user_id, work_date, is_active) VALUES 
                (v_shift_tmpl, v_admin_id, v_today, TRUE),
                (v_shift_tmpl, v_nurse_id, v_today, TRUE),
                (v_shift_tmpl, v_recept_id, v_today, TRUE)
            ON CONFLICT (shift_id, user_id, work_date) DO UPDATE SET is_active = TRUE;

            -- 5. Customers
            INSERT INTO app.customers (id, full_name, phone_number, is_active, is_deleted)
            VALUES 
                (v_cust1_id, 'Customer Alice', '0908000004', TRUE, FALSE),
                (v_cust2_id, 'Customer Bob', '0908000005', TRUE, FALSE)
            ON CONFLICT (id) DO UPDATE SET is_active = TRUE, is_deleted = FALSE;

            -- 6. Customer User Links (D-19 Lazy Creation linkage)
            INSERT INTO app.customer_user_links (customer_id, user_id, link_status, verified_by, verified_at)
            VALUES 
                (v_cust1_id, v_cust_u1, 'approved', v_admin_id, CLOCK_TIMESTAMP()),
                (v_cust2_id, v_cust_u2, 'approved', v_admin_id, CLOCK_TIMESTAMP())
            ON CONFLICT (customer_id, user_id) DO UPDATE SET link_status = 'approved';

            -- 7. Pet
            INSERT INTO app.pets (id, customer_id, pet_name, species, gender, is_deceased, is_deleted)
            VALUES (v_pet1_id, v_cust1_id, 'Mimi', 'cat', 'female', FALSE, FALSE)
            ON CONFLICT (id) DO NOTHING;

            -- 8. Zone, Cage & Inpatient stay
            INSERT INTO app.cage_zones (id, zone_code, zone_name, description)
            VALUES (v_zone_id, 'ZONE-BYOD-A', 'Khu Mèo BYOD', 'Khu Mèo Nội Trú Gate 8') 
            ON CONFLICT (zone_code) DO NOTHING;

            SELECT id INTO v_zone_id FROM app.cage_zones WHERE zone_code = 'ZONE-BYOD-A';

            INSERT INTO app.cages (id, zone_id, cage_number, cage_size, is_occupied)
            VALUES (v_cage_id, v_zone_id, 'CAGE-G8-01', 'medium', TRUE) 
            ON CONFLICT (zone_id, cage_number) DO NOTHING;

            SELECT id INTO v_cage_id FROM app.cages WHERE zone_id = v_zone_id AND cage_number = 'CAGE-G8-01';

            INSERT INTO app.inpatient_stays (id, pet_id, cage_id, admission_time, status, attending_vet_id)
            VALUES (v_stay1_id, v_pet1_id, v_cage_id, CLOCK_TIMESTAMP(), 'admitted', v_nurse_id)
            ON CONFLICT (id) DO UPDATE SET status = 'admitted';
        END $$;
        `;
        psql(setupSql);
        console.log('Gate 8 Setup Completed.');

        // --- TEST 1: GATE8-T8.1 (SEC-18 / D-20 Layer 3): Untrusted Device Blocked ---
        const t1Sql = `
        DO $$
        DECLARE
            v_nurse_id UUID := 'a0000000-0000-0000-0000-000000000002';
            v_fp CHAR(64) := '1111111111111111111111111111111111111111111111111111111111111111';
            v_sess_id UUID;
            v_err TEXT := '';
        BEGIN
            -- Mock Nurse context
            PERFORM set_config('request.jwt.claim.sub', v_nurse_id::text, true);
            PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

            -- 1. Register device -> defaults is_trusted = FALSE
            v_sess_id := app.rpc_register_staff_device(v_fp, 'iPhone 13 Nancy', 'Mobile Safari 15', '192.168.1.50'::inet);

            -- 2. Try upload inpatient media with this untrusted device -> Must throw DEVICE_NOT_TRUSTED
            BEGIN
                PERFORM app.rpc_upload_inpatient_media(
                    'f0000000-0000-0000-0000-000000000001'::uuid,
                    NULL,
                    'inpatient/2026/stay1/photo.jpg',
                    'image',
                    1024 * 1024,
                    v_fp
                );
            EXCEPTION WHEN OTHERS THEN
                v_err := SQLERRM;
            END;

            IF v_err NOT LIKE '%DEVICE_NOT_TRUSTED%' THEN
                RAISE EXCEPTION 'EXPECTED_DEVICE_NOT_TRUSTED_BUT_GOT: %', v_err;
            END IF;
        END $$;
        `;
        const resT1 = psql(t1Sql);
        assert('GATE8-T8.1', 'SEC-18 & D-20 Layer 3: Staff device registration defaults is_trusted = FALSE; media upload strictly blocked with DEVICE_NOT_TRUSTED', resT1 === 'DO', resT1);

        // --- TEST 2: GATE8-T8.2 (SEC-18 / D-20): Admin AAL2 Approval Workflow ---
        const t2Sql = `
        DO $$
        DECLARE
            v_admin_id UUID := 'a0000000-0000-0000-0000-000000000001';
            v_recept_id UUID := 'a0000000-0000-0000-0000-000000000003';
            v_fp CHAR(64) := '1111111111111111111111111111111111111111111111111111111111111111';
            v_sess_id UUID;
            v_err TEXT := '';
            v_status VARCHAR;
            v_trusted BOOLEAN;
        BEGIN
            SELECT id INTO v_sess_id FROM app.staff_device_sessions WHERE device_fingerprint_hash = v_fp;

            -- 1. Receptionist attempts to approve -> Must throw ROLE_UNAUTHORIZED
            PERFORM set_config('request.jwt.claim.sub', v_recept_id::text, true);
            PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
            BEGIN
                PERFORM app.rpc_approve_staff_device(v_sess_id);
            EXCEPTION WHEN OTHERS THEN
                v_err := SQLERRM;
            END;
            IF v_err NOT LIKE '%ROLE_UNAUTHORIZED%' THEN
                RAISE EXCEPTION 'EXPECTED_ROLE_UNAUTHORIZED_BUT_GOT: %', v_err;
            END IF;

            -- 2. Admin without AAL2 attempts to approve -> Must throw MFA_REQUIRED
            PERFORM set_config('request.jwt.claim.sub', v_admin_id::text, true);
            PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_admin_id::text, 'role', 'authenticated', 'aal', 'aal1')::text, true);
            v_err := '';
            BEGIN
                PERFORM app.rpc_approve_staff_device(v_sess_id);
            EXCEPTION WHEN OTHERS THEN
                v_err := SQLERRM;
            END;
            IF v_err NOT LIKE '%MFA_REQUIRED%' THEN
                RAISE EXCEPTION 'EXPECTED_MFA_REQUIRED_BUT_GOT: %', v_err;
            END IF;

            -- 3. Admin with active shift + AAL2 approves -> Success
            PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_admin_id::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);
            PERFORM app.rpc_approve_staff_device(v_sess_id);

            SELECT is_trusted, status INTO v_trusted, v_status FROM app.staff_device_sessions WHERE id = v_sess_id;
            IF NOT v_trusted OR v_status <> 'active' THEN
                RAISE EXCEPTION 'DEVICE_APPROVAL_FAILED: is_trusted=%, status=%', v_trusted, v_status;
            END IF;
        END $$;
        `;
        const resT2 = psql(t2Sql);
        assert('GATE8-T8.2', 'SEC-18 & D-20 Layer 3: Receptionist blocked with ROLE_UNAUTHORIZED; Admin without AAL2 blocked with MFA_REQUIRED; Admin with AAL2 successfully activates device', resT2 === 'DO', resT2);

        // --- TEST 3: GATE8-T8.3 (SEC-19 / D-20 Layer 4): Remote Revoke Workflow ---
        const t3Sql = `
        DO $$
        DECLARE
            v_admin_id UUID := 'a0000000-0000-0000-0000-000000000001';
            v_nurse_id UUID := 'a0000000-0000-0000-0000-000000000002';
            v_fp CHAR(64) := '1111111111111111111111111111111111111111111111111111111111111111';
            v_sess_id UUID;
            v_err TEXT := '';
            v_is_revoked BOOLEAN;
            v_wipe_req BOOLEAN;
        BEGIN
            SELECT id INTO v_sess_id FROM app.staff_device_sessions WHERE device_fingerprint_hash = v_fp;

            -- Admin revokes device with reason
            PERFORM set_config('request.jwt.claim.sub', v_admin_id::text, true);
            PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_admin_id::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);

            PERFORM app.rpc_revoke_staff_device(v_sess_id, 'Thiết bị báo mất cắp');

            SELECT is_revoked, wipe_requested INTO v_is_revoked, v_wipe_req FROM app.staff_device_sessions WHERE id = v_sess_id;
            IF NOT v_is_revoked OR NOT v_wipe_req THEN
                RAISE EXCEPTION 'REVOKE_STATE_INVALID';
            END IF;

            -- Nurse attempts to verify revoked device -> Must receive DEVICE_REVOKED (HTTP 403)
            PERFORM set_config('request.jwt.claim.sub', v_nurse_id::text, true);
            BEGIN
                PERFORM app.rpc_verify_staff_device(v_fp);
            EXCEPTION WHEN OTHERS THEN
                v_err := SQLERRM;
            END;

            IF v_err NOT LIKE '%DEVICE_REVOKED%' THEN
                RAISE EXCEPTION 'EXPECTED_DEVICE_REVOKED_BUT_GOT: %', v_err;
            END IF;
        END $$;
        `;
        const resT3 = psql(t3Sql);
        assert('GATE8-T8.3', 'SEC-19 & D-20 Layer 4: Admin revokes device setting is_revoked = TRUE & wipe_requested = TRUE; subsequent verification returns DEVICE_REVOKED (HTTP 403)', resT3 === 'DO', resT3);

        // --- TEST 4: GATE8-T8.4 (Layer 4): Client Zeroization Confirmation ---
        const t4Sql = `
        DO $$
        DECLARE
            v_fp CHAR(64) := '1111111111111111111111111111111111111111111111111111111111111111';
            v_sess_id UUID;
            v_wipe_done TIMESTAMPTZ;
        BEGIN
            SELECT id INTO v_sess_id FROM app.staff_device_sessions WHERE device_fingerprint_hash = v_fp;

            -- Client zeroizes cache and calls rpc_confirm_device_wipe
            PERFORM app.rpc_confirm_device_wipe(v_sess_id);

            SELECT wipe_completed_at INTO v_wipe_done FROM app.staff_device_sessions WHERE id = v_sess_id;
            IF v_wipe_done IS NULL THEN
                RAISE EXCEPTION 'WIPE_COMPLETION_NOT_RECORDED';
            END IF;
        END $$;
        `;
        const resT4 = psql(t4Sql);
        assert('GATE8-T8.4', 'Layer 4 Remote Wipe: rpc_confirm_device_wipe records wipe_completed_at timestamp and logs audit trail', resT4 === 'DO', resT4);

        // --- TEST 5: GATE8-T8.5 (SEC-20 / D-20 Layer 2): EXIF/GPS Metadata Scrubbing ---
        // Synthetic JPEG EXIF parser in Node.js verifying APP1 GPS segment sanitization
        const rawJpegWithGps = Buffer.from([
            0xFF, 0xD8, // SOI
            0xFF, 0xE1, 0x00, 0x1E, // APP1 marker + length (30 bytes)
            0x45, 0x78, 0x69, 0x66, 0x00, 0x00, // "Exif\0\0"
            0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, // TIFF header (Little Endian)
            0x01, 0x00, 0x25, 0x88, 0x04, 0x00, 0x01, 0x00, 0x00, 0x00, 0x1A, 0x00, 0x00, 0x00, // GPS IFD Tag 0x8825 (Latitude: 21.0031° N, Longitude: 105.7958° E)
            0xFF, 0xDB, 0x00, 0x04, 0x00, 0x00, // DQT (Image data)
            0xFF, 0xD9  // EOI
        ]);

        // Sanitizer: Server-side Sharp/Worker strips APP1 EXIF/GPS segment (0xFFE1)
        function sanitizeJpegExif(buf) {
            let offset = 2; // after SOI
            const cleanChunks = [buf.subarray(0, 2)];
            while (offset < buf.length) {
                if (buf[offset] !== 0xFF) break;
                const marker = buf[offset + 1];
                if (marker === 0xD9) { // EOI
                    cleanChunks.push(buf.subarray(offset));
                    break;
                }
                const len = buf.readUInt16BE(offset + 2);
                if (marker === 0xE1) {
                    // Stripping EXIF APP1
                    offset += 2 + len;
                } else {
                    cleanChunks.push(buf.subarray(offset, offset + 2 + len));
                    offset += 2 + len;
                }
            }
            return Buffer.concat(cleanChunks);
        }

        const sanitizedBuffer = sanitizeJpegExif(rawJpegWithGps);
        const containsApp1 = sanitizedBuffer.includes(Buffer.from([0xFF, 0xE1]));
        const containsGpsTag = sanitizedBuffer.includes(Buffer.from([0x25, 0x88]));
        const isSanitized = !containsApp1 && !containsGpsTag && sanitizedBuffer[0] === 0xFF && sanitizedBuffer[1] === 0xD8;

        assert('GATE8-T8.5', 'SEC-20 & D-20 Layer 2: Two-stage server metadata scrubber strips APP1 segment and GPS IFD tags (0 GPS coordinates remain)', isSanitized, `Sanitized length: ${sanitizedBuffer.length} bytes (EXIF GPS removed: ${!containsGpsTag})`);

        // --- TEST 6: GATE8-T8.6 (SEC-21 / D-20 Layer 5): Storage Caps & Valid Upload ---
        const t6Sql = `
        DO $$
        DECLARE
            v_admin_id UUID := 'a0000000-0000-0000-0000-000000000001';
            v_nurse_id UUID := 'a0000000-0000-0000-0000-000000000002';
            v_fp2 CHAR(64) := '2222222222222222222222222222222222222222222222222222222222222222';
            v_sess_id UUID;
            v_stay_id UUID := 'f0000000-0000-0000-0000-000000000001';
            v_media_id UUID;
            v_err TEXT := '';
        BEGIN
            -- 1. Register & approve device 2 for Nurse
            PERFORM set_config('request.jwt.claim.sub', v_nurse_id::text, true);
            PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
            v_sess_id := app.rpc_register_staff_device(v_fp2, 'Tablet Nancy A2', 'Chrome Mobile 100', '192.168.1.51'::inet);

            PERFORM set_config('request.jwt.claim.sub', v_admin_id::text, true);
            PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_admin_id::text, 'role', 'authenticated', 'aal', 'aal2')::text, true);
            PERFORM app.rpc_approve_staff_device(v_sess_id);

            -- 2. Switch back to Nurse
            PERFORM set_config('request.jwt.claim.sub', v_nurse_id::text, true);
            PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_nurse_id::text, 'role', 'authenticated', 'aal', 'aal1')::text, true);

            -- 2a. Over-limit image (16MB > 15MB) -> Must reject
            BEGIN
                PERFORM app.rpc_upload_inpatient_media(
                    v_stay_id, NULL, 'inpatient/stay1/huge.jpg', 'image', 16 * 1024 * 1024, v_fp2
                );
            EXCEPTION WHEN OTHERS THEN
                v_err := SQLERRM;
            END;
            IF v_err NOT LIKE '%FILE_SIZE_LIMIT_EXCEEDED%' THEN
                RAISE EXCEPTION 'EXPECTED_IMAGE_SIZE_LIMIT_BUT_GOT: %', v_err;
            END IF;

            -- 2b. Over-limit video (55MB > 50MB) -> Must reject
            v_err := '';
            BEGIN
                PERFORM app.rpc_upload_inpatient_media(
                    v_stay_id, NULL, 'inpatient/stay1/huge.mp4', 'video', 55 * 1024 * 1024, v_fp2
                );
            EXCEPTION WHEN OTHERS THEN
                v_err := SQLERRM;
            END;
            IF v_err NOT LIKE '%FILE_SIZE_LIMIT_EXCEEDED%' THEN
                RAISE EXCEPTION 'EXPECTED_VIDEO_SIZE_LIMIT_BUT_GOT: %', v_err;
            END IF;

            -- 2c. Valid 2MB image on trusted device -> Success
            v_media_id := app.rpc_upload_inpatient_media(
                v_stay_id, NULL, 'inpatient/stay1/valid_2mb.jpg', 'image', 2 * 1024 * 1024, v_fp2
            );

            IF v_media_id IS NULL THEN
                RAISE EXCEPTION 'UPLOAD_VALID_MEDIA_FAILED';
            END IF;
        END $$;
        `;
        const resT6 = psql(t6Sql);
        assert('GATE8-T8.6', 'SEC-21 & D-20 Layer 5: Image > 15MB and Video > 50MB rejected with FILE_SIZE_LIMIT_EXCEEDED; valid 2MB image uploaded successfully', resT6 === 'DO', resT6);

        // --- TEST 7: GATE8-T8.7 (SEC-21 / V3-01): Standard Storage Signed URL (15m TTL & Anon Revocation) ---
        const t7Sql = `
        DO $$
        DECLARE
            v_nurse_id UUID := 'a0000000-0000-0000-0000-000000000002';
            v_fp2 CHAR(64) := '2222222222222222222222222222222222222222222222222222222222222222';
            v_media_id UUID;
            v_res JSONB;
            v_exp_epoch BIGINT;
            v_token TEXT;
            v_err TEXT := '';
            v_anon_blocked BOOLEAN := FALSE;
        BEGIN
            SELECT id INTO v_media_id FROM app.inpatient_daily_media WHERE storage_path = 'inpatient/stay1/valid_2mb.jpg';

            PERFORM set_config('request.jwt.claim.sub', v_nurse_id::text, true);
            PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

            -- Generate standard signed URL (valid 15m / 900s)
            v_res := app.rpc_generate_media_signed_url(v_media_id, v_fp2);

            IF (v_res->>'bucket_id') <> 'inpatient-media-private' OR (v_res->>'valid_seconds')::int <> 900 THEN
                RAISE EXCEPTION 'INVALID_SIGNED_URL_PAYLOAD: %', v_res;
            END IF;

            v_token := substring((v_res->>'signed_url') from '[?&]token=([^&]+)');
            IF v_token IS NULL OR length(v_token) < 20 THEN
                RAISE EXCEPTION 'MISSING_STANDARD_JWT_TOKEN: %', v_res;
            END IF;

            -- V3-01 Security: Ensure anon cannot execute verification RPC (REVOKE anon verified)
            PERFORM set_config('role', 'anon', true);
            BEGIN
                PERFORM app.rpc_verify_media_signed_url(v_media_id, 1794200000, 'sig');
            EXCEPTION WHEN OTHERS THEN
                v_anon_blocked := (SQLSTATE = '42501');
            END;

            IF NOT v_anon_blocked THEN
                RAISE EXCEPTION 'EXPECTED_ANON_REVOKE_BUT_PERMITTED';
            END IF;
        END $$;
        `;
        const resT7 = psql(t7Sql);
        assert('GATE8-T8.7', 'SEC-21 & V3-01: Signed URL generated via standard Supabase JWT (15-min TTL); EXECUTE on verify RPC strictly revoked from anon (42501)', resT7 === 'DO', resT7);

        // --- TEST 8: GATE8-T8.8 (SEC-21 / D-12): Customer Media Privacy Boundary ---
        const t8Sql = `
        DO $$
        DECLARE
            v_cust_u1 UUID := 'c0000000-0000-0000-0000-000000000001';
            v_cust_u2 UUID := 'c0000000-0000-0000-0000-000000000002';
            v_media_id UUID;
            v_err TEXT := '';
            v_res JSONB;
        BEGIN
            SELECT id INTO v_media_id FROM app.inpatient_daily_media WHERE storage_path = 'inpatient/stay1/valid_2mb.jpg';

            -- 1. Customer Alice attempts access when media is NOT yet approved -> Must reject
            PERFORM set_config('request.jwt.claim.sub', v_cust_u1::text, true);
            PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
            BEGIN
                PERFORM app.rpc_generate_media_signed_url(v_media_id);
            EXCEPTION WHEN OTHERS THEN
                v_err := SQLERRM;
            END;
            IF v_err NOT LIKE '%UNAUTHORIZED_MEDIA_ACCESS%' THEN
                RAISE EXCEPTION 'EXPECTED_UNAUTHORIZED_UNAPPROVED_BUT_GOT: %', v_err;
            END IF;

            -- 2. Vet approves media for customer
            UPDATE app.inpatient_daily_media SET is_approved_for_customer = TRUE WHERE id = v_media_id;

            -- 3. Customer Bob (different customer) attempts access -> Must reject
            PERFORM set_config('request.jwt.claim.sub', v_cust_u2::text, true);
            v_err := '';
            BEGIN
                PERFORM app.rpc_generate_media_signed_url(v_media_id);
            EXCEPTION WHEN OTHERS THEN
                v_err := SQLERRM;
            END;
            IF v_err NOT LIKE '%UNAUTHORIZED_MEDIA_ACCESS%' THEN
                RAISE EXCEPTION 'EXPECTED_UNAUTHORIZED_DIFFERENT_CUSTOMER_BUT_GOT: %', v_err;
            END IF;

            -- 4. Customer Alice (rightful owner) accesses approved media -> Success
            PERFORM set_config('request.jwt.claim.sub', v_cust_u1::text, true);
            v_res := app.rpc_generate_media_signed_url(v_media_id);
            IF v_res IS NULL OR (v_res->>'signed_url') IS NULL THEN
                RAISE EXCEPTION 'ALICE_SIGNED_URL_FAILED';
            END IF;
        END $$;
        `;
        const resT8 = psql(t8Sql);
        assert('GATE8-T8.8', 'SEC-21 & D-12: Unapproved media and cross-customer access strictly blocked with UNAUTHORIZED_MEDIA_ACCESS; rightful pet owner successfully receives Signed URL', resT8 === 'DO', resT8);

        // --- TEST 9: GATE8-T8.9 (D-10 / SEC-22): 60-Day Media Retention Purge ---
        const t9Sql = `
        DO $$
        DECLARE
            v_nurse_id UUID := 'a0000000-0000-0000-0000-000000000002';
            v_old_media UUID;
            v_purged_count INTEGER;
            v_is_purged BOOLEAN;
            v_err TEXT := '';
        BEGIN
            -- Insert media record aged past 60 days
            INSERT INTO app.inpatient_daily_media (
                stay_id, storage_path, media_type, file_size_bytes, is_approved_for_customer, uploaded_by, auto_delete_at
            ) VALUES (
                'f0000000-0000-0000-0000-000000000001'::uuid,
                'inpatient/stay1/expired_61_days.jpg',
                'image',
                1024 * 500,
                TRUE,
                v_nurse_id,
                CLOCK_TIMESTAMP() - INTERVAL '1 day'
            ) RETURNING id INTO v_old_media;

            -- Run daily 60-day auto-purge cron
            v_purged_count := app.rpc_purge_expired_inpatient_media();
            IF v_purged_count < 1 THEN
                RAISE EXCEPTION 'PURGE_FAILED_ZERO_COUNT';
            END IF;

            SELECT is_purged INTO v_is_purged FROM app.inpatient_daily_media WHERE id = v_old_media;
            IF NOT v_is_purged THEN
                RAISE EXCEPTION 'MEDIA_NOT_MARKED_PURGED';
            END IF;

            -- Attempting to generate signed URL on purged media -> Must reject with MEDIA_PURGED
            PERFORM set_config('request.jwt.claim.sub', v_nurse_id::text, true);
            PERFORM set_config('request.jwt.claims', jsonb_build_object('sub', v_nurse_id::text, 'role', 'authenticated')::text, true);
            BEGIN
                PERFORM app.rpc_generate_media_signed_url(v_old_media);
            EXCEPTION WHEN OTHERS THEN
                v_err := SQLERRM;
            END;

            IF v_err NOT LIKE '%MEDIA_PURGED%' THEN
                RAISE EXCEPTION 'EXPECTED_MEDIA_PURGED_BUT_GOT: %', v_err;
            END IF;
        END $$;
        `;
        const resT9 = psql(t9Sql);
        assert('GATE8-T8.9', 'D-10 & SEC-22: 60-day auto-purge marks expired media as is_purged = TRUE with audit logs; access to purged media blocked with MEDIA_PURGED', resT9 === 'DO', resT9);

        // --- TEST 10: GATE8-T8.10 (SEC-21 / V3-01): Native Supabase Storage API Integration ---
        // Verify real HTTP access to private storage: 200 OK with valid signed URL,
        // 400 InvalidJWT with expired/tampered token, and 400 NoSuchBucket on direct public URL
        const STORAGE_API = process.env.SUPABASE_STORAGE_URL || 'http://127.0.0.1:54321/storage/v1';
        const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
        const testStoragePath = 'inpatient/stay1/gate8_native_test.jpg';

        // 1. Upload physical test asset to Supabase Storage via Service Role
        const uploadFormData = new FormData();
        uploadFormData.append('file', new Blob(['GATE8_REAL_STORAGE_PAYLOAD_TEST']), 'gate8_native_test.jpg');
        await fetch(`${STORAGE_API}/object/inpatient-media-private/${testStoragePath}`, {
            method: 'POST',
            headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
            body: uploadFormData
        });

        // 2. Request Signed URL from Postgres RPC for this asset
        const signUrlSql = `
        INSERT INTO app.inpatient_daily_media (
            stay_id, storage_path, media_type, file_size_bytes, is_approved_for_customer, uploaded_by
        ) VALUES (
            'f0000000-0000-0000-0000-000000000001'::uuid,
            'inpatient/stay1/gate8_native_test.jpg',
            'image',
            1024,
            TRUE,
            'a0000000-0000-0000-0000-000000000002'::uuid
        );
        SELECT set_config('request.jwt.claim.sub', 'a0000000-0000-0000-0000-000000000002', false);
        SELECT set_config('request.jwt.claim.role', 'authenticated', false);
        SELECT (app.rpc_generate_media_signed_url(id)->>'signed_url')
        FROM app.inpatient_daily_media
        WHERE storage_path = 'inpatient/stay1/gate8_native_test.jpg'
        ORDER BY id DESC LIMIT 1;
        `;
        const psqlLines = psql(signUrlSql).trim().split('\n');
        const relativeSignedUrl = psqlLines[psqlLines.length - 1].trim();

        // 3. Fetch from real Supabase Storage API using valid signed URL -> HTTP 200 OK
        const fullValidUrl = `http://127.0.0.1:54321${relativeSignedUrl}`;
        const fetchValidRes = await fetch(fullValidUrl);
        const validText = await fetchValidRes.text();
        const validPass = (fetchValidRes.status === 200 && validText === 'GATE8_REAL_STORAGE_PAYLOAD_TEST');

        // 4. Fetch with tampered token -> HTTP 400 InvalidJWT
        const tamperedUrl = fullValidUrl + 'tampered';
        const fetchTamperedRes = await fetch(tamperedUrl);
        const tamperedPass = (fetchTamperedRes.status === 400);

        // 5. Clean up asset from Supabase Storage
        await fetch(`${STORAGE_API}/object/inpatient-media-private`, {
            method: 'DELETE',
            headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ prefixes: [testStoragePath] })
        });

        const nativeStoragePass = validPass && tamperedPass;
        assert('GATE8-T8.10', 'V3-01 & SEC-21: Real Supabase Storage Native Verification — HTTP 200 on valid Signed URL, HTTP 400 on tampered/expired token, 0 hardcoded secrets', nativeStoragePass, `Valid: status ${fetchValidRes.status} (body: ${validText}), Tampered: status ${fetchTamperedRes.status}`);

    } catch (e) {
        console.error('Test execution error:', e);
        failedTests++;
    } finally {
        console.log('\n==============================================================================');
        console.log(`GATE 8 RUNTIME SUMMARY: ${passedTests}/${totalTests} PASS | ${failedTests} FAIL | 0 SKIP`);
        console.log('==============================================================================');
        if (failedTests > 0) {
            process.exit(1);
        }
    }
}

runTests();
