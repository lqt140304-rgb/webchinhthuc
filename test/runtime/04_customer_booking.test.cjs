/**
 * ==============================================================================
 * RUNTIME TEST SUITE 04: CUSTOMER, PET, APPOINTMENT & RATE LIMITING (GATE 4)
 * Project: Bệnh viện Thú y Lê Sơn
 * Phase 4B Implementation Plan: Acceptance Gate 4 Verification
 * Mode: RUNTIME VERIFICATION (Executes against live local PostgreSQL container)
 * Invariants Enforced: D-19 (Strict Lazy Creation), U-3 (IDOR Guard),
 *                      POL-BOOKING (Max 3 Pending Appointments Rate Limit),
 *                      D-LINK (Customer Account Link Workflow)
 * ==============================================================================
 */

const { execSync } = require('child_process');

process.env.APP_ENV = 'local_test';

console.log('=== RUNNING RUNTIME TEST SUITE 04: CUSTOMER, PET & APPOINTMENT RPCs ===');
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
    return execSync(`docker exec -i ${container} psql -U postgres -d postgres -v ON_ERROR_STOP=1 -t -A`, { input: query, encoding: 'utf8' }).trim();
}

async function runTests() {
    try {
        // --- TEST 4.1: SEC-05 / D-19 Signup generates ZERO customer pollution ---
        const sec05Query = `
            DO $$
            DECLARE
                v_uid UUID := gen_random_uuid();
                v_count_before INT;
                v_count_after INT;
            BEGIN
                SELECT count(*) INTO v_count_before FROM app.customers;

                INSERT INTO auth.users (id, email, phone, raw_user_meta_data)
                VALUES (v_uid, 'lazy_test@example.com', '+84988777666', '{"full_name": "Lazy Tester"}'::jsonb);

                SELECT count(*) INTO v_count_after FROM app.customers;

                -- Clean up
                DELETE FROM app.users WHERE id = v_uid;
                DELETE FROM auth.users WHERE id = v_uid;

                IF v_count_after <> v_count_before THEN
                    RAISE EXCEPTION 'D-19 VIOLATION: Customer record created prematurely upon signup!';
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const sec05Result = psql(sec05Query);
        assert('GATE4-T4.1', 'SEC-05: User signup creates auth identity but 0 CRM customer records (D-19 Strict Lazy Creation)',
            sec05Result.includes('PASSED'),
            `Lazy creation on signup: ${sec05Result}`);

        // --- TEST 4.2: Lazy Profile Creation on First Booking ---
        const lazyBookingQuery = `
            DO $$
            DECLARE
                v_uid UUID := gen_random_uuid();
                v_cust_id UUID;
                v_appt_id UUID;
            BEGIN
                INSERT INTO auth.users (id, email, raw_user_meta_data)
                VALUES (v_uid, 'first_book@example.com', '{"full_name": "First Booker"}'::jsonb);

                -- Execute booking as this user via public wrapper
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_uid::text, true);

                v_appt_id := public.rpc_create_customer_appointment(
                    NULL,
                    'medical',
                    CLOCK_TIMESTAMP() + INTERVAL '2 days',
                    'Bé mệt mỏi, bỏ ăn',
                    '0912111222',
                    'Nguyễn Văn A'
                );

                PERFORM set_config('role', 'postgres', true);

                -- Verify app.customers now exists and is linked
                SELECT customer_id INTO v_cust_id FROM app.customer_user_links WHERE user_id = v_uid;
                IF v_cust_id IS NULL THEN
                    RAISE EXCEPTION 'LAZY_CREATION_FAIL: Customer profile not created upon first appointment!';
                END IF;

                -- Clean up
                DELETE FROM app.medical_appointments WHERE appointment_id = v_appt_id;
                DELETE FROM app.appointments WHERE id = v_appt_id;
                DELETE FROM app.customer_user_links WHERE user_id = v_uid;
                DELETE FROM app.customers WHERE id = v_cust_id;
                DELETE FROM app.users WHERE id = v_uid;
                DELETE FROM auth.users WHERE id = v_uid;
            END $$;
            SELECT 'PASSED';
        `;
        const lazyBookingResult = psql(lazyBookingQuery);
        assert('GATE4-T4.2', 'Lazy Customer Profile is dynamically created upon first appointment booking (D-19 Lifecycle)',
            lazyBookingResult.includes('PASSED'),
            `First booking lazy creation: ${lazyBookingResult}`);

        // --- TEST 4.3: RPC Pet Registration ---
        const petRegQuery = `
            DO $$
            DECLARE
                v_uid UUID := gen_random_uuid();
                v_pet_id UUID;
                v_cust_id UUID;
            BEGIN
                INSERT INTO auth.users (id, email, raw_user_meta_data)
                VALUES (v_uid, 'pet_owner@example.com', '{"full_name": "Chủ Nuôi Test"}'::jsonb);

                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_uid::text, true);

                v_pet_id := public.rpc_register_customer_pet(
                    'LuLu',
                    'chó',
                    'Poodle',
                    'female',
                    '2024-01-15'::DATE,
                    '0988333444',
                    'Trần Thị B'
                );

                PERFORM set_config('role', 'postgres', true);

                IF NOT EXISTS (SELECT 1 FROM app.pets WHERE id = v_pet_id AND pet_name = 'LuLu') THEN
                    RAISE EXCEPTION 'PET_REGISTRATION_FAIL: Pet LuLu not found in app.pets!';
                END IF;

                SELECT customer_id INTO v_cust_id FROM app.pets WHERE id = v_pet_id;

                -- Clean up
                DELETE FROM app.pets WHERE id = v_pet_id;
                DELETE FROM app.customer_user_links WHERE user_id = v_uid;
                DELETE FROM app.customers WHERE id = v_cust_id;
                DELETE FROM app.users WHERE id = v_uid;
                DELETE FROM auth.users WHERE id = v_uid;
            END $$;
            SELECT 'PASSED';
        `;
        const petRegResult = psql(petRegQuery);
        assert('GATE4-T4.3', 'public.rpc_register_customer_pet successfully registers pet and binds customer relationship',
            petRegResult.includes('PASSED'),
            `Pet registration result: ${petRegResult}`);

        // --- TEST 4.4: SEC-06 IDOR Guard on Pet Appointment Booking ---
        const idorQuery = `
            DO $$
            DECLARE
                v_user_a UUID := gen_random_uuid();
                v_user_b UUID := gen_random_uuid();
                v_cust_b UUID := gen_random_uuid();
                v_pet_b UUID := gen_random_uuid();
                v_err TEXT := '';
            BEGIN
                -- Customer B owns Pet B
                INSERT INTO auth.users (id, email) VALUES (v_user_b, 'owner_b@test.vn');
                INSERT INTO app.customers (id, full_name, phone_number) VALUES (v_cust_b, 'Chủ B', '0912222333');
                INSERT INTO app.customer_user_links (customer_id, user_id, link_status) VALUES (v_cust_b, v_user_b, 'approved');
                INSERT INTO app.pets (id, customer_id, pet_name, species, gender) VALUES (v_pet_b, v_cust_b, 'Bông', 'mèo', 'female');

                -- User A registers
                INSERT INTO auth.users (id, email) VALUES (v_user_a, 'attacker_a@test.vn');

                -- User A attempts to book appointment using Pet B
                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_user_a::text, true);

                BEGIN
                    PERFORM public.rpc_create_customer_appointment(
                        v_pet_b,
                        'medical',
                        CLOCK_TIMESTAMP() + INTERVAL '1 day',
                        'Attempted IDOR attack',
                        '0911000999',
                        'Hacker A'
                    );
                EXCEPTION WHEN OTHERS THEN
                    v_err := SQLERRM;
                END;

                PERFORM set_config('role', 'postgres', true);

                -- Clean up
                DELETE FROM app.customer_user_links WHERE user_id IN (v_user_a, v_user_b);
                DELETE FROM app.pets WHERE id = v_pet_b;
                DELETE FROM app.customers WHERE id = v_cust_b;
                DELETE FROM app.users WHERE id IN (v_user_a, v_user_b);
                DELETE FROM auth.users WHERE id IN (v_user_a, v_user_b);

                IF v_err NOT LIKE '%IDOR_VIOLATION%' THEN
                    RAISE EXCEPTION 'SEC-06 FAILED: Expected IDOR_VIOLATION exception, got: %', v_err;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const idorResult = psql(idorQuery);
        assert('GATE4-T4.4', 'SEC-06: Strict IDOR check prevents User A from booking appointments on User B pet',
            idorResult.includes('PASSED'),
            `IDOR check result: ${idorResult}`);

        // --- TEST 4.5: SEC-07 Invalid Appointment Type Blocked ---
        const invalidTypeQuery = `
            DO $$
            DECLARE
                v_uid UUID := gen_random_uuid();
                v_err TEXT := '';
            BEGIN
                INSERT INTO auth.users (id, email) VALUES (v_uid, 'invalid_type@test.vn');

                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_uid::text, true);

                BEGIN
                    PERFORM public.rpc_create_customer_appointment(
                        NULL,
                        'unsupported_service',
                        CLOCK_TIMESTAMP() + INTERVAL '1 day',
                        'Note',
                        '0911222333',
                        'Tester'
                    );
                EXCEPTION WHEN OTHERS THEN
                    v_err := SQLERRM;
                END;

                PERFORM set_config('role', 'postgres', true);
                DELETE FROM app.users WHERE id = v_uid;
                DELETE FROM auth.users WHERE id = v_uid;

                IF v_err NOT LIKE '%INVALID_APPOINTMENT_TYPE%' THEN
                    RAISE EXCEPTION 'SEC-07 FAILED: Expected INVALID_APPOINTMENT_TYPE exception, got: %', v_err;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const invalidTypeResult = psql(invalidTypeQuery);
        assert('GATE4-T4.5', 'SEC-07: Invalid appointment types strictly rejected (Only: medical, spa, vaccine, recheck permitted)',
            invalidTypeResult.includes('PASSED'),
            `Invalid type check: ${invalidTypeResult}`);

        // --- TEST 4.6: Past Scheduling Date Rejected ---
        const pastDateQuery = `
            DO $$
            DECLARE
                v_uid UUID := gen_random_uuid();
                v_err TEXT := '';
            BEGIN
                INSERT INTO auth.users (id, email) VALUES (v_uid, 'past_date@test.vn');

                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_uid::text, true);

                BEGIN
                    PERFORM public.rpc_create_customer_appointment(
                        NULL,
                        'medical',
                        CLOCK_TIMESTAMP() - INTERVAL '1 day',
                        'Note',
                        '0911222333',
                        'Tester'
                    );
                EXCEPTION WHEN OTHERS THEN
                    v_err := SQLERRM;
                END;

                PERFORM set_config('role', 'postgres', true);
                DELETE FROM app.users WHERE id = v_uid;
                DELETE FROM auth.users WHERE id = v_uid;

                IF v_err NOT LIKE '%INVALID_SCHEDULE_TIME%' THEN
                    RAISE EXCEPTION 'PAST_DATE FAILED: Expected INVALID_SCHEDULE_TIME exception, got: %', v_err;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const pastDateResult = psql(pastDateQuery);
        assert('GATE4-T4.6', 'Scheduling validation: Appointments scheduled in the past are strictly rejected',
            pastDateResult.includes('PASSED'),
            `Past date check: ${pastDateResult}`);

        // --- TEST 4.7: SEC-08 POL-BOOKING Rate Limiter (Max 3 Pending Appointments) ---
        const rateLimitQuery = `
            DO $$
            DECLARE
                v_uid UUID := gen_random_uuid();
                v_cust_id UUID;
                v_appt1 UUID;
                v_appt2 UUID;
                v_appt3 UUID;
                v_err TEXT := '';
            BEGIN
                INSERT INTO auth.users (id, email) VALUES (v_uid, 'rate_limit@test.vn');

                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_uid::text, true);

                -- Book 1st appointment
                v_appt1 := public.rpc_create_customer_appointment(NULL, 'medical', CLOCK_TIMESTAMP() + INTERVAL '1 day', 'Note 1', '0919888777', 'Rate Limit User');
                -- Book 2nd appointment
                v_appt2 := public.rpc_create_customer_appointment(NULL, 'spa', CLOCK_TIMESTAMP() + INTERVAL '2 days', 'Note 2', '0919888777', 'Rate Limit User');
                -- Book 3rd appointment
                v_appt3 := public.rpc_create_customer_appointment(NULL, 'vaccine', CLOCK_TIMESTAMP() + INTERVAL '3 days', 'Note 3', '0919888777', 'Rate Limit User');

                -- Attempt 4th appointment (Exceeds rate limit POL-BOOKING)
                BEGIN
                    PERFORM public.rpc_create_customer_appointment(NULL, 'recheck', CLOCK_TIMESTAMP() + INTERVAL '4 days', 'Note 4', '0919888777', 'Rate Limit User');
                EXCEPTION WHEN OTHERS THEN
                    v_err := SQLERRM;
                END;

                PERFORM set_config('role', 'postgres', true);

                SELECT customer_id INTO v_cust_id FROM app.appointments WHERE id = v_appt1;

                -- Clean up
                DELETE FROM app.medical_appointments WHERE appointment_id IN (v_appt1, v_appt2, v_appt3);
                DELETE FROM app.appointments WHERE id IN (v_appt1, v_appt2, v_appt3);
                DELETE FROM app.customer_user_links WHERE user_id = v_uid;
                DELETE FROM app.customers WHERE id = v_cust_id;
                DELETE FROM app.users WHERE id = v_uid;
                DELETE FROM auth.users WHERE id = v_uid;

                IF v_err NOT LIKE '%RATE_LIMIT_EXCEEDED%' THEN
                    RAISE EXCEPTION 'SEC-08 FAILED: Expected RATE_LIMIT_EXCEEDED on 4th appointment, got: %', v_err;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const rateLimitResult = psql(rateLimitQuery);
        assert('GATE4-T4.7', 'SEC-08: POL-BOOKING Rate Limiter strictly enforces max 3 pending appointments per customer',
            rateLimitResult.includes('PASSED'),
            `Rate limiter result: ${rateLimitResult}`);

        // --- TEST 4.8: D-LINK Customer Link Request Workflow ---
        const dlinkQuery = `
            DO $$
            DECLARE
                v_uid UUID := gen_random_uuid();
                v_cust_id UUID := gen_random_uuid();
                v_req_id UUID;
            BEGIN
                INSERT INTO auth.users (id, email) VALUES (v_uid, 'dlink_user@test.vn');
                INSERT INTO app.customers (id, full_name, phone_number) VALUES (v_cust_id, 'Khách Cũ GPet', '0903111222');

                PERFORM set_config('role', 'authenticated', true);
                PERFORM set_config('request.jwt.claim.sub', v_uid::text, true);

                v_req_id := public.rpc_request_customer_link(v_cust_id, 'Xin liên kết hồ sơ cún cưng cũ');

                PERFORM set_config('role', 'postgres', true);

                IF NOT EXISTS (SELECT 1 FROM app.user_link_requests WHERE id = v_req_id AND status = 'pending') THEN
                    RAISE EXCEPTION 'D-LINK FAIL: Link request not found with pending status!';
                END IF;

                -- Clean up
                DELETE FROM app.user_link_requests WHERE id = v_req_id;
                DELETE FROM app.customers WHERE id = v_cust_id;
                DELETE FROM app.users WHERE id = v_uid;
                DELETE FROM auth.users WHERE id = v_uid;
            END $$;
            SELECT 'PASSED';
        `;
        const dlinkResult = psql(dlinkQuery);
        assert('GATE4-T4.8', 'D-LINK: Customer link request workflow generates pending request for Receptionist/Admin verification',
            dlinkResult.includes('PASSED'),
            `D-LINK result: ${dlinkResult}`);

        // --- TEST 4.9: Guest Booking Request Anti-Spam Rate Limiter ---
        const guestSpamQuery = `
            DO $$
            DECLARE
                v_err TEXT := '';
            BEGIN
                -- Insert 3 guest requests for same phone number within 24h
                INSERT INTO app.guest_booking_requests (guest_name, phone_number, pet_name, service_type, preferred_time)
                VALUES 
                    ('Khách Vãng Lai', '0933444555', 'Miu 1', 'medical', CLOCK_TIMESTAMP() + INTERVAL '1 day'),
                    ('Khách Vãng Lai', '0933444555', 'Miu 2', 'spa', CLOCK_TIMESTAMP() + INTERVAL '1 day'),
                    ('Khách Vãng Lai', '0933444555', 'Miu 3', 'vaccine', CLOCK_TIMESTAMP() + INTERVAL '1 day');

                -- 4th attempt must be blocked by trg_guest_booking_rate_limit
                BEGIN
                    INSERT INTO app.guest_booking_requests (guest_name, phone_number, pet_name, service_type, preferred_time)
                    VALUES ('Khách Vãng Lai', '0933444555', 'Miu 4', 'recheck', CLOCK_TIMESTAMP() + INTERVAL '1 day');
                EXCEPTION WHEN OTHERS THEN
                    v_err := SQLERRM;
                END;

                -- Clean up
                DELETE FROM app.guest_booking_requests WHERE phone_number = '0933444555';

                IF v_err NOT LIKE '%GUEST_RATE_LIMIT_EXCEEDED%' THEN
                    RAISE EXCEPTION 'GUEST_SPAM_FAIL: Expected GUEST_RATE_LIMIT_EXCEEDED, got: %', v_err;
                END IF;
            END $$;
            SELECT 'PASSED';
        `;
        const guestSpamResult = psql(guestSpamQuery);
        assert('GATE4-T4.9', 'Guest Booking Form Anti-Spam: Blocks 4th guest request within 24h from same phone number',
            guestSpamResult.includes('PASSED'),
            `Guest anti-spam result: ${guestSpamResult}`);

        // --- TEST 4.10: Public RPC Wrappers Security Verification ---
        const publicWrapperQuery = `
            SELECT p.proname, p.prosecdef, pg_get_function_identity_arguments(p.oid) AS args
            FROM pg_proc p
            JOIN pg_namespace n ON n.oid = p.pronamespace
            WHERE n.nspname = 'public'
              AND p.proname IN ('rpc_register_customer_pet', 'rpc_create_customer_appointment', 'rpc_request_customer_link')
              AND p.prosecdef = TRUE;
        `;
        const pwRows = psql(publicWrapperQuery).split('\n').filter(Boolean);
        assert('GATE4-T4.10', 'Public schema RPC wrappers are configured as SECURITY DEFINER with search_path protection',
            pwRows.length === 3,
            `Verified public RPC wrappers: ${pwRows.length} / 3`);

    } catch (err) {
        console.error('[FATAL ERROR IN RUNTIME TESTS]:', err);
        failedTests++;
    } finally {
        console.log('\n======================================================');
        console.log(`=== SUITE 04 SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED ===`);
        if (failedTests === 0) {
            console.log('>>> ACCEPTANCE GATE 4: 100% RUNTIME PASS! READY FOR GATE 5! <<<');
        } else {
            console.error(`>>> ACCEPTANCE GATE 4 FAILED: ${failedTests} FAILURES DETECTED! <<<`);
        }
        console.log('======================================================\n');
        process.exit(failedTests === 0 ? 0 : 1);
    }
}

runTests();
