# Preview revision policy — local only, 2026-11-01

This policy supersedes the prior candidate's assumption that target must literally be `preview`.

## P2-1: environment evidence

Official Vercel REST v13 documentation, read 2026-11-01:
https://vercel.com/docs/rest-api/deployments/get-a-deployment-by-id-or-url
The response `target` description says null indicates a preview deployment. The page's example renders a string `"null"`; the prose specifies a null value. The gate accepts JSON null only, not string `"null"`, missing target, production, staging, arrays or other values.

For null target this project's conservative policy additionally requires explicit `customEnvironment: null` and `alias: []`. Custom environment objects or a nonempty customEnvironmentId are rejected for both null and literal preview. Missing private environment fields means NOT VERIFIED; do not manufacture them. This may reject legitimate deployments with aliases or reduced responses. Obtain authoritative owner-scoped evidence rather than loosening or editing the envelope. All existing exact deployment ID, READY, project name/ID, HTTPS origin and full SHA checks remain.

BYOC corroboration only (not evidence that this project uses BYOC):
https://vercel.com/docs/networking/bring-your-own-cloud/deploy-with-cli

An arbitrary caller-created JSON object is only a consistency fixture. Passing this gate is not proof of authenticated collection, provenance or approval. A future authorized verification needs a separately recorded owner-scoped read-only response and collection provenance. No such new deployment exists in this work.

## P2-2: Git metadata versus content

Missing or mismatched `meta.githubCommitSha` remains NOT VERIFIED / exit 2 before browser/network. A content manifest does not authorize substituting a SHA or bypassing this condition. Even matching metadata is client-associated information, not proof of the deployed bytes.

Use `git archive <full candidate SHA>` into a newly created empty staging directory. Archive staging has no .git and does not guarantee CLI Git metadata. Never promise githubCommitSha will exist, add a remote, or inject metadata to make the gate pass. This revision is local only; no GitHub/CI claim is made.

The separately hashed source manifest covers every Git-exported file, upload manifest covers every file selected by the pinned offline CLI selector, and build manifest covers build/client. They establish local content identity only. Trusted remote content comparison requires complete path/byte coverage and authenticated transport evidence bound to the new deployment; absent that, remote content provenance remains NOT VERIFIED even if local inventories match. Metadata missing/mismatch and content missing/mismatch are independent failures.

## Clean staging, required fail-closed preflight

Keep expected manifests outside staging, record their SHA256 in the approval dossier, and pin the exact CLI selector bundle hash. Run tests/build in the separate test checkout. Immediately before any separately authorized future upload, run `tests/spike/upload-preflight.cjs <stage> <expected.json> <selector-bundle>` against the exact untouched Git export. Any extra, absent, modified, symlink or generated build/typegen path stops with exit 2. Do not run builds/typegen in upload staging. This command performs no deployment.

The .vercelignore change excludes docs, build and .react-router. Docs remain in Git/reviewer history; only the source upload is reduced. Runtime app/build source does not import docs. Legacy QA scripts may write evidence into docs; that evidence stays local.

## Scope and unresolved matters

Local validation and reviewer approval do not authorize creating Preview. Old deployment provenance remains a separate NO-GO dossier: P2-9/P2-12 NOT VERIFIED; P2-15 OPEN/BLOCKED. No QA097 collector. Three historical E2E skips and inherited domain/Production noindex policy remain disclosed; no Production/domain/protection/Git Integration changes are made.
