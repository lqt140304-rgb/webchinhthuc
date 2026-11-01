# Patch 03.1 — QA test hardening

Scope: P2-2 and P2-3 from Claude QA 073. Keep Patch03 rewrites unchanged.
Local model results do not prove Vercel Edge behavior (P2-1/P2-4 remain open).

`npm run test:vercel-routing` runs helper regression tests and the HTTP/browser suite.
Build first. Local headers are resolved from matching `vercel.json` header rules;
only the repository's two current source patterns are supported. Unknown patterns fail.

## Approved remote run (not performed for this patch)

Use only after separate authorization for the exact Preview. Keep Deployment Protection on.
Obtain fresh read-only deployment metadata through the Vercel connector and save the
inner deployment object (with `id`, `url`, `readyState`, `target`, `project.name`,
`project.id`, and `meta.githubCommitSha`) outside the repo. This caller-provided metadata is
checked for consistency, not independently authenticated by this test.
Review provenance before using its results as evidence.

Set these environment variables in the runner:

- `BASE_URL`: immutable HTTPS deployment origin; an optional trailing slash is normalized.
- `EXPECTED_DEPLOYMENT_ID`: exact deployment ID approved for this run; required and matched.
- `EXPECTED_COMMIT_SHA`: full 40-character SHA independently verified for that deployment.
- `DEPLOYMENT_EVIDENCE_FILE`: path to that saved Vercel API deployment object.
- `PLAYWRIGHT_STORAGE_STATE`: optional path to a Playwright session exported after lawful,
  user-controlled login. Never place the session file in git or handoff artifacts.
- `QA_EVIDENCE_FILE`: optional path outside the repo for sanitized JSON results.

Run `npm run test:vercel-routing`. No forms are submitted.
After QA074, the test only accepts READY metadata with explicit `target: "preview"` (null/absent/production fail closed) for project `le-son-website-qa`
with ID `prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3`, matching
the immutable URL and expected SHA. It skips all local build-file assertions in remote mode.
It records deployment ID/SHA, selected response headers, status and body SHA-256,
never cookies, storage state, tokens or full HTML. It does not create access tokens,
bypass protection, log in, push or deploy.

SSO redirects/401/403/authentication pages stop with exit 2 and verdict BLOCKED;
assertion failures exit 1. External main-document navigation is blocked as well.
Missing, unreadable, malformed or inconsistent deployment evidence stops before any
browser/network access with exit 2 and verdict `NOT VERIFIED`. This includes an
absent/null/production target; no deployment is inferred to be Preview from its URL.
`test-preview-evidence-gate.cjs` exercises the actual runner with networking and
browser spawning disabled. Caller metadata remains a consistency check only;
passing local regression tests does not verify any deployed Preview or provenance.
A valid existing session is used by both HTTP preflight and browser navigation.
Expired or missing access requires user authentication outside the test.

Remote PASS covers only the seven direct/reload cases; it does not establish
19 prerender routes, responsive UI, all trailing-slash semantics or complete SEO.
Local PASS is explicitly labeled as a model, not Edge verification.

## Review handoff

No Claude/Antigravity execution is claimed for Patch03.1. Codex implemented these
authorized test changes. Independent Claude review remains outstanding.
