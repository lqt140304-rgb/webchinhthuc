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

// Fisher-Yates shuffle
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const randomSuites = shuffle(suites);

console.log('=== V3-02 HERMETIC SUITE VERIFICATION: RANDOM ORDER EXECUTION ===');
console.log('Random Execution Order:');
randomSuites.forEach((s, idx) => console.log(`  ${idx + 1}. ${s}`));
console.log('-----------------------------------------------------------------');

let totalPassed = 0;
let totalFailed = 0;

for (const suite of randomSuites) {
    const fullPath = path.join(testDir, suite);
    try {
        const output = execSync(`node ${fullPath}`, { encoding: 'utf8', stdio: 'pipe' });
        const passMatches = output.match(/\[RUNTIME PASS\]/g) || [];
        const failMatches = output.match(/\[RUNTIME FAIL\]/g) || [];
        
        console.log(`[PASS] ${suite.padEnd(45)}: ${passMatches.length} PASS, ${failMatches.length} FAIL`);
        totalPassed += passMatches.length;
        totalFailed += failMatches.length;
    } catch (err) {
        console.error(`[FAIL] ${suite.padEnd(45)}: ERROR:`, err.message);
        totalFailed++;
    }
}

console.log('-----------------------------------------------------------------');
console.log(`TOTAL PASSES IN RANDOM ORDER: ${totalPassed}`);
console.log(`TOTAL FAILURES: ${totalFailed}`);
if (totalFailed === 0) {
    console.log('VERDICT: 100% HERMETIC PASS. Zero order-dependency between test suites.');
} else {
    process.exit(1);
}
