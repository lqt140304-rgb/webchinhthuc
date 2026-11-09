const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { cleanDatabase } = require('./clean_database.cjs');

const testDir = path.resolve(__dirname, '../test/runtime');
const migrationsDir = path.resolve(__dirname, '../supabase/migrations');

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

function computeFileHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

function getEnvironmentVersions() {
    const env = {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        postgresVersion: 'UNKNOWN',
        dockerContainers: []
    };

    try {
        const ps = execSync('docker ps --filter "name=supabase_db" --format "{{.Names}}"', { encoding: 'utf8' }).trim();
        if (ps) {
            const container = ps.split('\n')[0].trim();
            env.postgresVersion = execSync(`docker exec ${container} psql -U postgres -d postgres -t -A -c "SELECT version();"`, { encoding: 'utf8' }).trim();
        }
    } catch (e) {
        env.postgresVersion = `Error reading postgres version: ${e.message}`;
    }

    try {
        const dockerPs = execSync('docker ps --format "{{.Names}}\t{{.Image}}\t{{.Status}}"', { encoding: 'utf8' }).trim();
        env.dockerContainers = dockerPs.split('\n').filter(Boolean).map(line => {
            const [names, image, status] = line.split('\t');
            return { names, image, status };
        });
    } catch (e) {
        env.dockerContainers = [{ error: e.message }];
    }

    return env;
}

function getFileHashes() {
    const migrationHashes = {};
    const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    for (const file of migrationFiles) {
        migrationHashes[file] = computeFileHash(path.join(migrationsDir, file));
    }

    const testHashes = {};
    for (const file of suites) {
        testHashes[file] = computeFileHash(path.join(testDir, file));
    }

    return {
        migrations: migrationHashes,
        testSuites: testHashes
    };
}

function shuffle(array) {
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
        const suiteStart = Date.now();
        let stdout = '';
        let stderr = '';
        let exitCode = 0;
        let suitePassed = 0;
        let suiteFailed = 0;
        let errMessage = null;

        try {
            stdout = execSync(`node ${fullPath}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
            const passMatches = stdout.match(/\[RUNTIME PASS\]/g) || [];
            const failMatches = stdout.match(/\[RUNTIME FAIL\]/g) || [];
            suitePassed = passMatches.length;
            suiteFailed = failMatches.length;

            console.log(`[PASS] ${suite.padEnd(45)}: ${suitePassed} PASS, ${suiteFailed} FAIL (${((Date.now() - suiteStart) / 1000).toFixed(2)}s)`);
            passedCount += suitePassed;
            failedCount += suiteFailed;
        } catch (err) {
            exitCode = err.status || 1;
            stdout = err.stdout ? err.stdout.toString() : '';
            stderr = err.stderr ? err.stderr.toString() : '';
            errMessage = err.message;

            const passMatches = stdout.match(/\[RUNTIME PASS\]/g) || [];
            const failMatches = stdout.match(/\[RUNTIME FAIL\]/g) || [];
            suitePassed = passMatches.length;
            suiteFailed = failMatches.length + 1; // Count failure

            console.error(`[FAIL] ${suite.padEnd(45)}: EXCEPTION: ${err.message} (${((Date.now() - suiteStart) / 1000).toFixed(2)}s)`);
            passedCount += suitePassed;
            failedCount += suiteFailed;
        }

        const duration = ((Date.now() - suiteStart) / 1000).toFixed(2);
        runLogs.push({
            suite,
            passed: suitePassed,
            failed: suiteFailed,
            durationSeconds: parseFloat(duration),
            exitCode,
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            error: errMessage
        });
    }

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`RESULT: ${passedCount} PASS, ${failedCount} FAIL (Duration: ${totalDuration}s)`);

    return {
        runName,
        order: suiteList,
        passedCount,
        failedCount,
        durationSeconds: parseFloat(totalDuration),
        exitCode: failedCount === 0 ? 0 : 1,
        suites: runLogs
    };
}

async function main() {
    console.log('##############################################################################');
    console.log('# PHASE 4B: HERMETIC MULTI-ORDER CLEAN DATABASE VERIFICATION PROBE (V6-02)   #');
    console.log('##############################################################################');
    const commitSha = getCommitSha();
    const timestamp = new Date().toISOString();
    console.log(`Git Commit SHA: ${commitSha}`);
    console.log(`Timestamp: ${timestamp}`);

    console.log('\n--- Environment Information ---');
    const environment = getEnvironmentVersions();
    console.log(`Node.js: ${environment.nodeVersion}`);
    console.log(`PostgreSQL: ${environment.postgresVersion}`);
    console.log(`Docker Containers: ${environment.dockerContainers.length} active`);

    console.log('\n--- Hashing Migrations and Test Suites ---');
    const checksums = getFileHashes();
    console.log(`Computed SHA-256 for ${Object.keys(checksums.migrations).length} migrations and ${Object.keys(checksums.testSuites).length} test suites.`);

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
    console.log('FINAL MULTI-ORDER VERIFICATION SUMMARY (V6-02 HERMETIC TEST AUDIT)');
    console.log('==============================================================================');

    let allPassed = true;
    let grandTotalPassed = 0;
    let grandTotalFailed = 0;

    for (const r of allRuns) {
        console.log(`* ${r.runName}: ${r.passedCount}/95 PASS, ${r.failedCount} FAIL | Exit Code: ${r.exitCode} | Time: ${r.durationSeconds}s`);
        grandTotalPassed += r.passedCount;
        grandTotalFailed += r.failedCount;
        if (r.exitCode !== 0 || r.passedCount !== 95) {
            allPassed = false;
        }
    }

    console.log('------------------------------------------------------------------------------');
    console.log(`GRAND TOTAL: ${grandTotalPassed}/${95 * 4} Assertions PASS, ${grandTotalFailed} FAIL across 4 pristine runs.`);
    if (allPassed) {
        console.log('VERDICT: 100% HERMETIC PASS ACROSS ALL 4 RUNS ON PRISTINE CLEAN DATABASE.');
        console.log('All test suites are fully self-contained and strictly order-independent.');
    } else {
        console.error('VERDICT: FAILED. Order-dependency or missing fixtures detected.');
    }

    // Save report json
    const reportPath = path.join(__dirname, '../docs/qa/HERMETIC_MULTI_ORDER_REPORT.json');
    const reportData = {
        meta: {
            title: 'Phase 4B Hermetic Multi-Order Clean Database Verification (V6-02)',
            commitSha,
            timestamp,
            grandTotalAssertionsPassed: grandTotalPassed,
            grandTotalAssertionsExpected: 95 * 4,
            verdict: allPassed ? '100% PASS' : 'FAIL'
        },
        environment,
        checksums,
        runs: allRuns
    };

    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2), 'utf8');
    console.log(`Detailed verification report with raw logs written to: ${reportPath}`);

    if (!allPassed) {
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Fatal error during multi-order verification:', err);
    process.exit(1);
});
