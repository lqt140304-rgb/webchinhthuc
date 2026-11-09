import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * CORS Hardening (V7-03):
 * Matches Origin header against allowed origin whitelist.
 * Returns appropriate Access-Control headers with Vary: Origin.
 */
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:54321",
  "http://127.0.0.1:54321",
];

const envAllowed = Deno.env.get("ALLOWED_ORIGIN");
if (envAllowed) {
  ALLOWED_ORIGINS.push(envAllowed);
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin");
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Content-Type": "application/json",
  };

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  } else if (!origin) {
    // Non-browser or probe clients without Origin header
    headers["Access-Control-Allow-Origin"] = "*";
  } else {
    // Untrusted origins get localhost:3000 or no allow-origin
    headers["Access-Control-Allow-Origin"] = "http://localhost:3000";
    headers["Vary"] = "Origin";
  }

  return headers;
}

/**
 * Strict Path Traversal & Safe Storage Path Validation (V7-02, V7-03):
 * Enforces:
 *   1. Must strictly start with 'inpatient/'
 *   2. Rejects any traversal sequences ('..', '//', leading '/', '\', '\0')
 *   3. Rejects URL-encoded characters ('%'), unicode homoglyphs, non-ASCII
 *   4. Segment-by-segment validation: each path segment must match ^[a-zA-Z0-9_\-\.]+$
 */
export function validateSafeStoragePath(path: string): boolean {
  if (!path || typeof path !== "string") return false;

  // 1. Enforce expected storage prefix
  if (!path.startsWith("inpatient/")) {
    return false;
  }

  // 2. Reject prohibited characters: traversal, double-slashes, backslashes, nulls, percent-encoding
  if (
    path.includes("..") ||
    path.includes("//") ||
    path.includes("\\") ||
    path.includes("\0") ||
    path.includes("%")
  ) {
    return false;
  }

  // 3. Reject fullwidth slashes, homoglyphs, or non-printable ASCII
  // Whitelist: strictly ASCII alphanumeric, underscore, hyphen, dot, and slash
  const safeRegex = /^inpatient\/[a-zA-Z0-9_\-\.\/]+$/;
  if (!safeRegex.test(path)) {
    return false;
  }

  // 4. Segment-by-segment check
  const segments = path.split("/");
  if (segments.length < 2) return false;

  for (const seg of segments) {
    if (!seg || seg === "." || seg === ".." || !/^[a-zA-Z0-9_\-\.]+$/.test(seg)) {
      return false;
    }
  }

  return true;
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "METHOD_NOT_ALLOWED",
        message: "Only POST requests are supported",
      }),
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    // 1. Read environment variables (Never expose to client or log)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "http://kong:8000";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceRoleKey) {
      console.error("[CRITICAL] Missing SUPABASE_SERVICE_ROLE_KEY in environment");
      return new Response(
        JSON.stringify({
          error: "INTERNAL_ERROR",
          message: "Internal server configuration error",
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    // 2. Validate Authorization Header (User JWT)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({
          error: "UNAUTHORIZED",
          message: "Missing or invalid Authorization header",
        }),
        { status: 401, headers: corsHeaders }
      );
    }
    const userJwt = authHeader.replace("Bearer ", "").trim();

    // 3. Parse and validate Request Body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({
          error: "BAD_REQUEST",
          message: "Invalid JSON request body",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { media_id, device_fingerprint_hash } = body || {};
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!media_id || !uuidRegex.test(media_id)) {
      return new Response(
        JSON.stringify({
          error: "BAD_REQUEST",
          message: "Invalid media_id UUID",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (device_fingerprint_hash) {
      const hex64Regex = /^[0-9a-fA-F]{64}$/;
      if (!hex64Regex.test(device_fingerprint_hash)) {
        return new Response(
          JSON.stringify({
            error: "BAD_REQUEST",
            message: "Invalid device_fingerprint_hash: must be 64-char hex string",
          }),
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // 4. Tier 1: Database Authorization Gate via PostgREST RPC
    // Pass user's JWT so PostgreSQL evaluates auth.uid(), active shifts, BYOD, pet ownership, and published status
    const rpcPayload: Record<string, string> = { p_media_id: media_id };
    if (device_fingerprint_hash) {
      rpcPayload.p_device_fingerprint_hash = device_fingerprint_hash;
    }

    const dbRes = await fetch(
      `${supabaseUrl}/rest/v1/rpc/rpc_request_media_signed_url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${userJwt}`,
        },
        body: JSON.stringify(rpcPayload),
      }
    );

    const dbData = await dbRes.json().catch(() => ({}));
    if (!dbRes.ok) {
      // V7-03: Generic sanitized error response (Never leak internal database errors or stack traces)
      const isNotFound =
        dbData.code === "P0002" ||
        (typeof dbData.message === "string" && dbData.message.includes("MEDIA_NOT_FOUND"));
      const status = isNotFound ? 404 : (dbRes.status === 400 ? 403 : dbRes.status);
      const safeErrorCode = isNotFound ? "NOT_FOUND" : "AUTHORIZATION_DENIED";
      const safeMessage = isNotFound
        ? "Requested media item not found"
        : "Media access denied by database authorization gate";

      return new Response(
        JSON.stringify({
          error: safeErrorCode,
          code: dbData.code || "42501",
          message: safeMessage,
        }),
        { status, headers: corsHeaders }
      );
    }

    if (!dbData.authorized || !dbData.storage_path) {
      return new Response(
        JSON.stringify({
          error: "FORBIDDEN",
          message: "Database rejected authorization grant",
        }),
        { status: 403, headers: corsHeaders }
      );
    }

    // 5. Anti Path-Traversal & Safe Storage Path Verification (V7-02, V7-03)
    const storagePath = dbData.storage_path;
    const bucketId = dbData.bucket_id || "inpatient-media-private";

    if (!validateSafeStoragePath(storagePath)) {
      console.warn(`[SECURITY] Unsafe storage path detected: ${storagePath}`);
      return new Response(
        JSON.stringify({
          error: "SECURITY_VIOLATION",
          message: "Path traversal or unsafe storage path detected",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 6. Tier 2: Supabase Storage API Direct Signing (TTL: 900 seconds)
    const signRes = await fetch(
      `${supabaseUrl}/storage/v1/object/sign/${bucketId}/${storagePath}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({ expiresIn: 900 }),
      }
    );

    const signData = await signRes.json().catch(() => ({}));
    if (!signRes.ok || !signData.signedURL) {
      console.error("[STORAGE_ERROR] Supabase Storage signing returned:", signData);
      return new Response(
        JSON.stringify({
          error: "SIGNING_FAILED",
          message: "Storage provider signing failed",
        }),
        { status: 502, headers: corsHeaders }
      );
    }

    const relativeSignedUrl = signData.signedURL.startsWith("/storage/v1")
      ? signData.signedURL
      : `/storage/v1${signData.signedURL}`;

    return new Response(
      JSON.stringify({
        authorized: true,
        media_id,
        bucket_id: bucketId,
        storage_path: storagePath,
        signed_url: relativeSignedUrl,
        expires_at: new Date(Date.now() + 900 * 1000).toISOString(),
        valid_seconds: 900,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    // V7-03: Never leak internal error message or stack trace to client
    console.error("[INTERNAL_ERROR] media-signed-url uncaught exception:", err);
    return new Response(
      JSON.stringify({
        error: "INTERNAL_ERROR",
        message: "An internal server error occurred",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
