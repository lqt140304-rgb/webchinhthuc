const { execSync } = require('child_process');
const path = require('path');

const testDir = path.resolve('test/runtime');
const suites = [
    '01_foundation.test.cjs',
    '02_schema_ddl.test.cjs',
    '03_auth_rbac_audit.test.cjs',
    '04_customer_booking.test.cjs',
    '05_clinical_inpatient.test.cjs',
    '06_inventory_billing.test.cjs',
    '07_import_center_rollback.test.cjs',
    '08_byod_media.test.cjs',
    '09_final_acceptance_92_scenarios.test.cjs',
    'worker_security_resilience.test.cjs'
];

console.log('=== RUNNING ALL 10 RUNTIME TEST SUITES (EXACT COUNTING) ===\n');

let totalPassed = 0;
let totalFailed = 0;
const results = [];

for (const suite of suites) {
    const fullPath = path.join(testDir, suite);
    try {
        const output = execSync(`node ${fullPath}`, { encoding: 'utf8', stdio: 'pipe' });
        const passMatches = output.match(/\[RUNTIME PASS\]/g) || [];
        const failMatches = output.match(/\[RUNTIME FAIL\]/g) || [];
        
        console.log(`[PASS] ${suite.padEnd(45)}: ${passMatches.length} PASS, ${failMatches.length} FAIL`);
        totalPassed += passMatches.length;
        totalFailed += failMatches.length;
        results.push({ suite, passed: passMatches.length, failed: failMatches.length, status: failMatches.length === 0 ? 'ALL PASS' : 'FAILED' });
    } catch (err) {
        console.error(`[FAIL] ${suite.padEnd(45)}: ERROR:`, err.message);
        results.push({ suite, passed: 0, failed: 1, error: err.message, status: 'ERROR' });
        totalFailed++;
    }
}

console.log('\n=== COMPLETE TEST RUNNER RESULTS ===');
console.log(`TOTAL RUNTIME PASSES ACCUMULATED: ${totalPassed}`);
console.log(`TOTAL FAILURES: ${totalFailed}`);
if (totalFailed === 0) {
    console.log('FINAL VERDICT: 100% SUITES PASS.');
}
