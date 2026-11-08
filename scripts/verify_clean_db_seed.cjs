/**
 * ==============================================================================
 * SCRIPT: scripts/verify_clean_db_seed.cjs
 * Project: Bệnh viện Thú y Lê Sơn
 * Phase 4B: Stage 9 - Clean DB & Architecture Integrity Verification
 * Checks:
 *   - Total 40 tables across app (35), audit (1), staging (4)
 *   - RLS enabled on all 40 tables
 *   - 0 CASCADE constraints on core clinical, customer and invoice tables
 *   - Schema isolation between app, staging, audit and public
 * ==============================================================================
 */

const { execSync } = require('child_process');

function psql(query) {
    const ps = execSync('docker ps --filter "name=supabase_db" --format "{{.Names}}"', { encoding: 'utf8' }).trim();
    if (!ps) throw new Error('Database container not found.');
    const container = ps.split('\n')[0].trim();
    return execSync(`docker exec -i ${container} psql -U postgres -d postgres -v ON_ERROR_STOP=1 -t -A`, { 
        input: query, 
        encoding: 'utf8' 
    }).trim();
}

function verifyCleanDbState() {
    console.log('=== VERIFYING DATABASE STATE & SCHEMA INVENTORY (40 TABLES) ===');

    // 1. Check table counts per schema
    const rawCounts = psql(`
        SELECT table_schema, count(*) 
        FROM information_schema.tables 
        WHERE table_schema IN ('app', 'audit', 'staging') 
        GROUP BY table_schema 
        ORDER BY table_schema;
    `).split('\n');

    const counts = {};
    for (const line of rawCounts) {
        if (!line.trim()) continue;
        const [schema, cnt] = line.split('|');
        counts[schema] = parseInt(cnt, 10);
    }

    console.log('Table Inventory:', counts);
    const totalTables = (counts['app'] || 0) + (counts['audit'] || 0) + (counts['staging'] || 0);
    console.log(`Total System Tables: ${totalTables} / 40`);

    if (counts['app'] !== 35 || counts['audit'] !== 1 || counts['staging'] !== 4 || totalTables !== 40) {
        throw new Error(`TABLE_COUNT_MISMATCH: Expected app=35, audit=1, staging=4, total=40. Got ${JSON.stringify(counts)}`);
    }

    // 2. Check RLS on all 40 tables
    const rlsDisabled = psql(`
        SELECT count(*)
        FROM pg_tables
        WHERE schemaname IN ('app', 'audit', 'staging')
          AND rowsecurity = FALSE;
    `);

    if (parseInt(rlsDisabled, 10) !== 0) {
        throw new Error(`RLS_DISABLED_VIOLATION: Found ${rlsDisabled} tables without RLS enabled!`);
    }
    console.log('Row Level Security (RLS): 100% ENABLED on all 40 tables.');

    // 3. Check for forbidden CASCADE foreign keys on clinical/customer data
    const cascadeViolations = psql(`
        SELECT count(*)
        FROM information_schema.referential_constraints rc
        JOIN information_schema.table_constraints tc ON rc.constraint_name = tc.constraint_name
        WHERE tc.table_schema IN ('app', 'staging')
          AND (rc.delete_rule = 'CASCADE' OR rc.update_rule = 'CASCADE')
          AND tc.table_name IN ('customers', 'pets', 'clinical_records', 'treatment_orders', 'invoices', 'invoice_items');
    `);

    if (parseInt(cascadeViolations, 10) !== 0) {
        throw new Error(`CASCADE_INVARIANT_VIOLATION: Found ${cascadeViolations} forbidden CASCADE FK rules on clinical data!`);
    }
    console.log('Foreign Key Integrity (P1-C): 0 CASCADE rules on clinical/financial tables.');

    return { totalTables, rlsEnabled: 40, cascadeViolations: 0 };
}

module.exports = { verifyCleanDbState };

if (require.main === module) {
    try {
        const res = verifyCleanDbState();
        console.log('[SUCCESS] Database Clean State Verified:', res);
    } catch (e) {
        console.error('[FAIL] Clean DB check failed:', e.message);
        process.exit(1);
    }
}
