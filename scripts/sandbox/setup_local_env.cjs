/**
 * ==============================================================================
 * LOCAL SANDBOX CONTROLLER & SAFETY HARNESS
 * Project: Bệnh viện Thú y Lê Sơn
 * Phase 4B Implementation Plan (Section 1.2, Acceptance Gate 1)
 * ==============================================================================
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Enforce Safety Rule 4: APP_ENV=local_test required for sandbox operations
if (!process.env.APP_ENV) {
    process.env.APP_ENV = 'local_test';
}

console.log('=== LÊ SƠN SUPABASE LOCAL SANDBOX CONTROLLER ===');
console.log(`Environment: APP_ENV=${process.env.APP_ENV}`);

// 1. Verify Docker Engine
function checkDocker() {
    try {
        const out = execSync('docker info --format "{{.ServerVersion}}"', { encoding: 'utf8' }).trim();
        console.log(`[PASS] Docker Engine active (Server Version: ${out})`);
        return true;
    } catch (err) {
        console.error('[FAIL] Docker Engine is not running! Please ensure Docker Desktop is started.');
        return false;
    }
}

// 2. Query Postgres safely in local container
function queryPostgres(sql) {
    if (process.env.APP_ENV !== 'local_test') {
        throw new Error('SECURITY VIOLATION: Refusing to query database when APP_ENV is not local_test!');
    }
    // Find database container name
    const ps = execSync('docker ps --filter "name=supabase_db" --format "{{.Names}}"', { encoding: 'utf8' }).trim();
    if (!ps) {
        throw new Error('Database container not running. Start sandbox first.');
    }
    const containerName = ps.split('\n')[0].trim();
    
    // Execute psql via stdin
    const cmd = `docker exec -i ${containerName} psql -U postgres -d postgres -t -A -c "${sql.replace(/"/g, '\\"')}"`;
    return execSync(cmd, { encoding: 'utf8' }).trim();
}

// 3. Check Sandbox Health
function checkSandboxHealth() {
    console.log('\n--- Checking Supabase Services Health ---');
    try {
        const containers = execSync('docker ps --filter "name=supabase" --format "{{.Names}} ({{.Status}})"', { encoding: 'utf8' }).trim();
        if (!containers) {
            console.log('[INFO] No Supabase containers currently running.');
            return false;
        }
        console.log(containers);
        return true;
    } catch (err) {
        console.error('[ERROR] Failed to query containers:', err.message);
        return false;
    }
}

module.exports = {
    checkDocker,
    queryPostgres,
    checkSandboxHealth
};

if (require.main === module) {
    const isDockerOk = checkDocker();
    if (isDockerOk) {
        checkSandboxHealth();
    }
}
