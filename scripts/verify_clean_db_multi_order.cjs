const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { cleanDatabase } = require('./clean_database.cjs');

const testDir = path.resolve(__dirname, '../test/runtime');
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

function getCommitSha() {
    try {
        return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch {
        return 'UNKNOWN';
    }
}

function shuffle(array, seed = Math.random()) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function runSuiteList(runName, suiteList) {
    console.log(`\n==============================================================================`);
    console.log(`RUN: ${runName}`);
    console.log(`Resetting database to 100% clean pristine state...`);
    cleanDatabase();
    console.log(`Execution Order:`);
    suiteList.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
    console.log(`------------------------------------------------------------------------------`);

    let passedCount = 0;
    let failedCount = 0;
    const runLogs = [];

    const startTime = Date.now();
    for (const suite of suiteList) {
        const fullPath = path.join(testDir, suite);
        try {
            const output = execSync(`node ${fullPath}`, { encoding: 'utf8', stdio: 'pipe' });
            const passMatches = output.match(/\[RUNTIME PASS\]/g) || [];
            const failMatches = output.match(/\[RUNTIME FAIL\]/g) || [];

            console.log(`[PASS] ${suite.padEnd(45)}: ${passMatches.length} PASS, ${failMatches.length} FAIL`);
            passedCount += passMatches.length;
            failedCount += failMatches.length;
            runLogs.push({ suite, passed: passMatches.length, failed: failMatches.length, error: null });
        } catch (err) {
            console.error(`[FAIL] ${suite.padEnd(45)}: EXCEPTION: ${err.message}`);
            failedCount++;
            runLogs.push({ suite, passed: 0, failed: 1, error: err.message });
        }
    }
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`RESULT: ${passedCount} PASS, ${failedCount} FAIL (Duration: ${duration}s)`);

    return {
        runName,
        order: suiteList,
        passedCount,
        failedCount,
        durationSeconds: duration,
        exitCode: failedCount === 0 ? 0 : 1,
        details: runLogs
    };
}

async function main() {
    console.log('##############################################################################');
    console.log('# PHASE 4B: HERMETIC MULTI-ORDER CLEAN DATABASE VERIFICATION PROBE (V4-03)   #');
    console.log('##############################################################################');
    const commitSha = getCommitSha();
    console.log(`Git Commit SHA: ${commitSha}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);

    const allRuns = [];

    // 1. Official Order (01..09 + worker) on Clean DB
    const officialRun = runSuiteList('RUN 1: OFFICIAL ORDER (01 -> 10) ON CLEAN DB', suites);
    allRuns.push(officialRun);

    // 2. Random Shuffled Order 1 on Clean DB
    const random1 = shuffle(suites);
    const run2 = runSuiteList('RUN 2: RANDOM ORDER #1 ON CLEAN DB', random1);
    allRuns.push(run2);

    // 3. Random Shuffled Order 2 on Clean DB
    const random2 = shuffle(suites);
    const run3 = runSuiteList('RUN 3: RANDOM ORDER #2 ON CLEAN DB', random2);
    allRuns.push(run3);

    // 4. Random Shuffled Order 3 on Clean DB
    const random3 = shuffle(suites);
    const run4 = runSuiteList('RUN 4: RANDOM ORDER #3 ON CLEAN DB', random3);
    allRuns.push(run4);

    console.log('\n==============================================================================');
    console.log('FINAL MULTI-ORDER VERIFICATION SUMMARY (V4-03 HERMETIC TEST AUDIT)');
    console.log('==============================================================================');

    let allPassed = true;
    for (const r of allRuns) {
        console.log(`* ${r.runName}: ${r.passedCount}/95 PASS, ${r.failedCount} FAIL | Exit Code: ${r.exitCode} | Time: ${r.durationSeconds}s`);
        if (r.exitCode !== 0 || r.passedCount !== 95) {
            allPassed = false;
        }
    }

    console.log('------------------------------------------------------------------------------');
    if (allPassed) {
        console.log('VERDICT: 100% HERMETIC PASS ACROSS ALL 4 RUNS ON PRISTINE CLEAN DATABASE.');
        console.log('All test suites are fully self-contained and strictly order-independent.');
    } else {
        console.error('VERDICT: FAILED. Order-dependency or missing fixtures detected.');
        process.exit(1);
    }

    // Save report json
    const reportPath = path.join(__dirname, '../docs/qa/HERMETIC_MULTI_ORDER_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify({ commitSha, timestamp: new Date().toISOString(), allRuns }, null, 2), 'utf8');
    console.log(`Detailed verification report written to: ${reportPath}`);
}

main().catch(err => {
    console.error('Fatal error during multi-order verification:', err);
    process.exit(1);
});
