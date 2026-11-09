const { execSync } = require('child_process');

function cleanDatabase() {
    const cleanSql = `
    SET session_replication_role = 'replica';

    -- 1. Audit & Staging
    DELETE FROM audit.audit_logs;
    DELETE FROM staging.import_errors;
    DELETE FROM staging.import_rows;
    DELETE FROM staging.import_mappings;
    DELETE FROM staging.import_jobs;

    -- 2. Inpatient & Bulletins
    DELETE FROM app.bulletin_approval_history;
    DELETE FROM app.inpatient_daily_media;
    DELETE FROM app.pet_medical_bulletins;
    DELETE FROM app.inpatient_daily_logs;
    DELETE FROM app.inpatient_stays;
    DELETE FROM app.cages;
    DELETE FROM app.cage_zones;

    -- 3. Clinical & Invoices
    DELETE FROM app.pet_medical_consents;
    DELETE FROM app.clinical_amendments;
    DELETE FROM app.clinical_diagnoses;
    DELETE FROM app.clinical_record_vitals;
    DELETE FROM app.prescriptions;
    DELETE FROM app.treatment_orders;
    DELETE FROM app.clinical_records;

    DELETE FROM app.invoice_items;
    DELETE FROM app.invoice_payments;
    DELETE FROM app.invoices;
    DELETE FROM app.inventory_transactions;
    DELETE FROM app.inventory_batches;
    DELETE FROM app.products;
    DELETE FROM app.services;

    -- 4. Appointments & Customers
    DELETE FROM app.medical_appointments;
    DELETE FROM app.appointments;
    DELETE FROM app.guest_booking_requests;
    DELETE FROM app.historical_loyalty_points;
    DELETE FROM app.pets;
    DELETE FROM app.user_link_requests;
    DELETE FROM app.customer_user_links;
    DELETE FROM app.customers;

    -- 5. Staff, Sessions, Users & Auth
    DELETE FROM app.staff_device_sessions;
    DELETE FROM app.shift_assignments;
    DELETE FROM app.shifts;
    DELETE FROM app.staff_role_assignments;
    DELETE FROM app.users;
    DELETE FROM auth.users;

    SET session_replication_role = 'origin';

    -- 6. Ensure default system settings
    INSERT INTO app.system_settings (setting_key, setting_value, description)
    VALUES ('allow_admin_off_shift_override', 'false', 'Fail-closed default for S-11')
    ON CONFLICT (setting_key) DO UPDATE SET setting_value = 'false';
    `;

    const ps = execSync('docker ps --filter "name=supabase_db" --format "{{.Names}}"', { encoding: 'utf8' }).trim();
    if (!ps) throw new Error('Database container not found.');
    const container = ps.split('\n')[0].trim();

    execSync(`docker exec -i ${container} psql -U postgres -d postgres -v ON_ERROR_STOP=1 -t -A`, {
        input: cleanSql,
        encoding: 'utf8'
    });
}

module.exports = { cleanDatabase };

if (require.main === module) {
    cleanDatabase();
    console.log('[SUCCESS] Database reset to 100% pristine clean state.');
}
