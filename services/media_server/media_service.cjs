/**
 * ==============================================================================
 * BỆNH VIỆN THÚ Y LÊ SƠN — TRUSTED MEDIA SERVER SERVICE (PHASE 4B / V5-01)
 * ==============================================================================
 * Architecture: 2-Tier Secure Media Authorization & Signing (Zero Secrets in SQL / Zero Service Key in Frontend)
 *
 * Tier 1 (Database Authorization Gate):
 *   - Verifies caller session via PostgREST RPC `rpc_request_media_signed_url`.
 *   - Enforces:
 *     * Active shift and approved BYOD device session for staff.
 *     * Pet ownership, doctor approval, and published bulletin status for customers.
 *     * 60-day media purge immutability.
 *
 * Tier 2 (Trusted Server Component):
 *   - Upon receiving the valid Authorization Grant from PostgreSQL, requests
 *     the cryptographic Signed URL directly from the Supabase Storage API
 *     (POST /storage/v1/object/sign/<bucket>/<path>) using the server-side Service Role Key.
 *   - Exposes zero service secrets to frontend clients.
 *   - Eliminates custom/synthesized HMAC signing inside database PL/pgSQL.
 * ==============================================================================
 */

async function issueMediaSignedUrl({
    supabaseUrl = 'http://127.0.0.1:54321',
    serviceRoleKey,
    userToken,
    mediaId,
    deviceFingerprintHash = null,
    expiresIn = 900
}) {
    if (!serviceRoleKey) {
        throw new Error('CONFIG_ERROR: serviceRoleKey is required for trusted server component');
    }
    if (!userToken) {
        throw new Error('AUTH_ERROR: userToken is required to establish user authorization context');
    }
    if (!mediaId) {
        throw new Error('ARG_ERROR: mediaId is required');
    }

    // --------------------------------------------------------------------------
    // TIER 1: Database Authorization Gate via PostgREST RPC
    // --------------------------------------------------------------------------
    const rpcPayload = { p_media_id: mediaId };
    if (deviceFingerprintHash) {
        rpcPayload.p_device_fingerprint_hash = deviceFingerprintHash;
    }

    const authGateRes = await fetch(`${supabaseUrl}/rest/v1/rpc/rpc_request_media_signed_url`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(rpcPayload)
    });

    const gateData = await authGateRes.json().catch(() => ({}));
    if (!authGateRes.ok) {
        const err = new Error(gateData.message || `DB authorization failed with HTTP ${authGateRes.status}`);
        err.status = authGateRes.status;
        err.code = gateData.code;
        err.details = gateData;
        throw err;
    }

    if (!gateData.authorized || !gateData.storage_path) {
        throw new Error('UNAUTHORIZED: Database authorization gate rejected media access');
    }

    // --------------------------------------------------------------------------
    // TIER 2: Supabase Storage API Direct Signing
    // --------------------------------------------------------------------------
    const bucket = gateData.bucket_id || 'inpatient-media-private';
    const storagePath = gateData.storage_path;

    const signRes = await fetch(`${supabaseUrl}/storage/v1/object/sign/${bucket}/${storagePath}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({ expiresIn })
    });

    const signData = await signRes.json().catch(() => ({}));
    if (!signRes.ok || !signData.signedURL) {
        const err = new Error(signData.message || `Supabase Storage signing failed with HTTP ${signRes.status}`);
        err.status = signRes.status;
        err.details = signData;
        throw err;
    }

    const normalizedSignedUrl = signData.signedURL.startsWith('/storage/v1') 
        ? signData.signedURL 
        : `/storage/v1${signData.signedURL}`;

    return {
        authorized: true,
        media_id: mediaId,
        bucket_id: bucket,
        storage_path: storagePath,
        signed_url: normalizedSignedUrl,
        expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
        valid_seconds: expiresIn
    };
}

module.exports = {
    issueMediaSignedUrl
};
