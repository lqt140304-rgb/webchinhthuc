import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Validates that storage path is strictly within permitted namespace
 * and contains NO path traversal patterns (.., //, \, \0, leading /)
 */
function validateSafeStoragePath(path: string): boolean {
  if (!path || typeof path !== "string") return false;
  if (
    path.includes("..") ||
    path.includes("//") ||
    path.startsWith("/") ||
    path.includes("\\") ||
    path.includes("\0")
  ) {
    return false;
  }
  // Enforce expected storage prefix
  if (!path.startsWith("inpatient/")) {
    return false;
  }
  const safeRegex = /^[a-zA-Z0-9_\-\.\/]+$/;
  return safeRegex.test(path);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Read environment variables (Never expose to client or log)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "http://kong:8000";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceRoleKey) {
      return new Response(
        JSON.stringify({
          error: "CONFIG_ERROR",
          message: "Server misconfiguration: missing service role key",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
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
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
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
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
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
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (device_fingerprint_hash) {
      const hex64Regex = /^[0-9a-fA-F]{64}$/;
      if (!hex64Regex.test(device_fingerprint_hash)) {
        return new Response(
          JSON.stringify({
            error: "BAD_REQUEST",
            message:
              "Invalid device_fingerprint_hash: must be 64-char hex string",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
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
      const status = dbRes.status === 400 ? 403 : dbRes.status;
      return new Response(
        JSON.stringify({
          error: "AUTHORIZATION_DENIED",
          code: dbData.code || "42501",
          message:
            dbData.message ||
            "Media access denied by database authorization gate",
        }),
        {
          status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!dbData.authorized || !dbData.storage_path) {
      return new Response(
        JSON.stringify({
          error: "FORBIDDEN",
          message: "Database rejected authorization grant",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 5. Anti Path-Traversal & Safe Storage Path Verification
    const storagePath = dbData.storage_path;
    const bucketId = dbData.bucket_id || "inpatient-media-private";

    if (!validateSafeStoragePath(storagePath)) {
      return new Response(
        JSON.stringify({
          error: "SECURITY_VIOLATION",
          message: "Path traversal or unsafe storage path detected",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
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
      return new Response(
        JSON.stringify({
          error: "SIGNING_FAILED",
          message:
            signData.message || "Supabase Storage signing failed",
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
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
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "INTERNAL_ERROR",
        message: (err as Error).message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
