/**
 * ==============================================================================
 * SCRIPT: scripts/purge_expired_media_worker.cjs
 * Project: Bệnh viện Thú y Lê Sơn
 * Phase 4B: Stage 9 Priority Remediation - Physical Media Purge Worker (P1)
 * Enforces:
 *   - Physical deletion of media objects from storage disk/bucket after 60 days
 *   - Object existence verification after deletion
 *   - Retry handling and error recording
 *   - Immutable audit logging in audit.audit_logs via app.rpc_record_physical_media_deletion
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
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

const STORAGE_ROOT = path.join(__dirname, '..', 'storage_sandbox', 'inpatient-media');

async function runPurgeWorker(simulateErrorPath = null) {
    console.log('[PURGE WORKER] Starting 60-day physical storage purge cycle...');
    if (!fs.existsSync(STORAGE_ROOT)) {
        fs.mkdirSync(STORAGE_ROOT, { recursive: true });
    }

    // 1. Query expired media requiring physical purge
    const queryExpiredSql = `
        SELECT jsonb_agg(jsonb_build_object(
            'id', id,
            'storage_path', storage_path,
            'retry_count', purge_retry_count
        ))
        FROM app.inpatient_daily_media
        WHERE auto_delete_at <= CLOCK_TIMESTAMP() 
          AND physical_deleted_at IS NULL;
    `;
    const rawExpired = psql(queryExpiredSql);
    let items = [];
    try {
        if (rawExpired && rawExpired !== '') {
            items = JSON.parse(rawExpired);
        }
    } catch (e) {
        items = [];
    }

    if (!items || items.length === 0) {
        console.log('[PURGE WORKER] No expired media objects pending physical deletion.');
        return { scanned: 0, deleted: 0, errors: 0 };
    }

    console.log(`[PURGE WORKER] Found ${items.length} expired media objects pending deletion.`);
    let deletedCount = 0;
    let errorCount = 0;

    for (const item of items) {
        const filePath = path.join(STORAGE_ROOT, item.storage_path);
        try {
            // Error simulation injection for testing retry mechanism
            if (simulateErrorPath && item.storage_path.includes(simulateErrorPath)) {
                throw new Error('EACCES: permission denied, simulated storage I/O lock');
            }

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Verify object physically does not exist
            if (fs.existsSync(filePath)) {
                throw new Error('VERIFICATION_FAILED: File still exists on storage disk after deletion attempt');
            }

            // Record successful physical purge in DB & Audit log
            psql(`SELECT app.rpc_record_physical_media_deletion('${item.id}'::uuid, true);`);
            deletedCount++;
            console.log(`  [DELETED] Object physically removed: ${item.storage_path}`);
        } catch (err) {
            errorCount++;
            console.error(`  [ERROR] Failed to purge ${item.storage_path}: ${err.message}`);
            const escapedErr = err.message.replace(/'/g, "''");
            psql(`SELECT app.rpc_record_physical_media_deletion('${item.id}'::uuid, false, '${escapedErr}');`);
        }
    }

    console.log(`[PURGE WORKER] Cycle complete. Scanned: ${items.length}, Deleted: ${deletedCount}, Errors: ${errorCount}`);
    return { scanned: items.length, deleted: deletedCount, errors: errorCount };
}

module.exports = { runPurgeWorker, STORAGE_ROOT };

if (require.main === module) {
    runPurgeWorker().catch(console.error);
}
