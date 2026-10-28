# Regression Test Results & Evidence Integrity Verification

**Directive:** CEO Directive 062-A  
**Branch:** `spike/architecture-01-cleanup-060-patch01`  
**Base Commit:** `2489439d3848b390b888101133ec0a3366075999`  
**Baseline 3A:** `4739d45cc95100b587381b6bdcad6935352b23e8`  

---

## 1. Full Test Matrix & Execution Evidence

All verification commands were executed within the isolated worktree `D:\webbvct-cleanup-060-patch01`:

| Test Command | Purpose | Result | Detailed Output |
|---|---|---|---|
| `npm run typecheck` | TypeScript Compiler & React Router Typegen | **PASS (0 errors)** | Checked across all route modules and application code. |
| `npm run lint` | Oxlint Static Analysis | **PASS (0 warnings, 0 errors)** | 88 files audited with 115 rules in 24ms. |
| `npm run build` | React Router Build + Prerender SSG + Postbuild | **PASS (exit 0)** | 19 static HTML routes generated, client assets bundled, `404.html` and `__spa-fallback.html` emitted. |
| `npm run test:routing` | Route parity & HTTP status codes | **PASS (20/20 routes)** | All 17 valid public/private routes return 200; 3 invalid routes return 404. |
| `npm run test:hydration` | React error #418 & console error audit | **PASS (8/8 routes)** | Headless Chromium verified zero hydration mismatches, zero console errors on 404s and dynamic routes. |
| `npm run test:seo-consistency` | Raw vs hydrated DOM robots directive audit | **PASS (5/5 checks)** | Consistent `noindex, nofollow` verified in raw HTML, hydrated DOM, and across soft/hard navigation. |
| `node tests/e2e/2b-verification.cjs` | Cross-platform Milestone 2B verification | **PASS (100%)** | 14 responsive viewports (Home + Booking), Section 6 contact audit, Booking form validation & honest test panel. |

---

## 2. Gate C01 — Evidence Integrity Verification

To guarantee that the restored Milestone 2B evidence files in `docs/qa/2b-verification-evidence/` were not modified or overwritten during test runs:

### Verification Command
```bash
git diff 4739d45cc95100b587381b6bdcad6935352b23e8 -- docs/qa/2b-verification-evidence
```

### Output
```text
(0 diff output)
```

### SHA-256 Hash Audit (All 15 Files Identical to Baseline 3A)
| File Name | Blob SHA (Baseline 3A) | Blob SHA (Current) | Match Status |
|---|---|---|---|
| `home-320px.png` | `b99e7f...` | `b99e7f...` | **MATCH (100%)** |
| `home-360px.png` | `10041f...` | `10041f...` | **MATCH (100%)** |
| `home-390px.png` | `b18c01...` | `b18c01...` | **MATCH (100%)** |
| `home-768px.png` | `5c179d...` | `5c179d...` | **MATCH (100%)** |
| `home-1366px.png` | `61ce88...` | `61ce88...` | **MATCH (100%)** |
| `home-1440px.png` | `eb9dfb...` | `eb9dfb...` | **MATCH (100%)** |
| `home-1920px.png` | `ce9c3c...` | `ce9c3c...` | **MATCH (100%)** |
| `booking-320px.png` | `1b4bf1...` | `1b4bf1...` | **MATCH (100%)** |
| `booking-360px.png` | `75319e...` | `75319e...` | **MATCH (100%)** |
| `booking-390px.png` | `829a28...` | `829a28...` | **MATCH (100%)** |
| `booking-768px.png` | `8c4e0f...` | `8c4e0f...` | **MATCH (100%)** |
| `booking-1366px.png` | `ea898b...` | `ea898b...` | **MATCH (100%)** |
| `booking-1440px.png` | `b8fb49...` | `b8fb49...` | **MATCH (100%)** |
| `booking-1920px.png` | `d7088d...` | `d7088d...` | **MATCH (100%)** |
| `2b-verification-results.txt` | `a16314...` | `a16314...` | **MATCH (100%)** |

All new test screenshots were stored in `e2e-evidence/2b-run/` which is ignored by `.gitignore` and never committed.

---

## 3. P3 Backlog Status Assessment

| Issue ID | Description | Status in Patch 01 |
|---|---|---|
| **3B-C060-P3-1** | Handoff/test-results self-reporting without OS qualification | **RESOLVED:** Complete environment matrix provided in `playwright-clean-install-results.md` distinguishing `VERIFIED (Windows)`, `BLOCKED (Claude Sandbox)`, and `UNVERIFIED (macOS)`. |
| **3B-C060-P3-2** | Hardcoded local paths in legacy spike scripts (`tests/measure-cls.cjs` -> `D:/webbvct/dist`, `scripts/test-and-capture-2b.mjs`) | **TRACKED IN BACKLOG:** Identified as legacy spike measurement tools. Out of scope for Directive 062-A (which strictly limits changes to `2b-verification.cjs`). Retained for post-spike cleanup. |
| **3B-C060-P3-3** | P3 items from QA Fix 01 (`/404` returns 200 in local preview, fixed headers, `preview-server.cjs` breadth vs `vercel.json`) | **TRACKED IN BACKLOG:** Kept in backlog per Directive 062-A scope boundary ("Không mở rộng sang các P3 ngoài phạm vi"). |
