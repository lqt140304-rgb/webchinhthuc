# Vercel Read-Only Verification Checklist (P03)

**Directive:** CEO Directive 062-A  
**Target Project:** `le-son-website-qa`  
**Target Project ID:** `prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3`  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Scope:** READ-ONLY VERIFICATION ONLY — NO DEPLOYMENT — NO SECRETS IN GIT  

---

## 1. Context & Objective

In QA Cleanup 060, Claude reported:
```text
Source Integrity | PASS về Git; NOT VERIFIED về hạ tầng Vercel (API Vercel vẫn trả HTTP 403)
```
Neither Claude nor Antigravity has (or should have) elevated credentials to mutate or trigger production deployments in the repository. To enable the Project Owner and CEO to verify the Vercel staging configuration cleanly without risking configuration drift or accidental deployments, this document specifies a comprehensive **Read-Only Verification Checklist**.

---

## 2. Checklist for Vercel Project Settings

### A. General & Project Identity
- [ ] **Project Name:** `le-son-website-qa`
- [ ] **Project ID:** `prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3`
- [ ] **Git Repository Linked:** `lqt140304-rgb/webchinhthuc`
- [ ] **Production Branch:** Must remain `main`. Experimental spike branches (`spike/*`) must NEVER be configured as the production branch.

### B. Build and Output Settings
*(Dashboard: Settings -> General -> Build & Development Settings)*
- [ ] **Framework Preset:** `Other` (or `Vite`).
- [ ] **Build Command:** Overridden to `npm run build` (or left empty if relying on `vercel.json`).
  *Note: `vercel.json` in repository already specifies `"buildCommand": "npm run build"`.*
- [ ] **Output Directory:** Overridden to `build/client` (or left empty if relying on `vercel.json`).
  *Note: `vercel.json` specifies `"outputDirectory": "build/client"`. This is critical: Vite + React Router Prerender outputs to `build/client`, NOT `dist`.*
- [ ] **Install Command:** `npm install` or `npm ci`.
- [ ] **Root Directory:** `./` (repository root).

### C. Repository `vercel.json` Compliance
Check that repository root `vercel.json` contains:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build/client",
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    { "source": "/tai-khoan/:match*", "destination": "/__spa-fallback.html" },
    { "source": "/cau-chuyen/:slug", "destination": "/__spa-fallback.html" },
    { "source": "/bai-viet/:slug", "destination": "/__spa-fallback.html" },
    { "source": "/:path*", "destination": "/404.html" }
  ]
}
```
- [ ] `cleanUrls: true` ensures clean URLs like `/gioi-thieu` resolve to `/gioi-thieu/index.html`.
- [ ] `trailingSlash: false` prevents duplicate canonical URLs and redirect loops.
- [ ] Dynamic rewrites route unprerendered client-side paths to `__spa-fallback.html`.
- [ ] Unmatched paths fallback to `404.html` with HTTP 404 status.

### D. Security & Deployment Protection
*(Dashboard: Settings -> Deployment Protection)*
- [ ] **Vercel Authentication or Password Protection:** **ENABLED** on Preview deployments.
  *Rationale: Ensures search engine crawlers (Googlebot, Bingbot) and public visitors cannot access staging/spike builds prior to official milestone acceptance.*
- [ ] **Preview Comments:** Optional (disabled or team-only).

### E. Environment Variables
*(Dashboard: Settings -> Environment Variables)*
- [ ] **Preview Environment:**
  - `APP_ENV`: `preview` (triggers Vite injection of `__APP_ENV__ = 'preview'`, enforcing `<meta name="robots" content="noindex, nofollow">` in hydrated DOM).
- [ ] **Production Environment (if ever deployed):**
  - Should remain unconfigured or restricted until official Phase 4 release.

---

## 3. Read-Only Verification Procedures (Non-Mutating)

The Project Owner or CEO can verify settings using either the Vercel Web Dashboard or read-only CLI commands.

### Option 1: Web Dashboard Inspection
1. Navigate to: `https://vercel.com/` -> Select Team -> `le-son-website-qa`.
2. Open **Settings -> General**: verify Framework Preset, Build Command (`npm run build`), Output Directory (`build/client`).
3. Open **Settings -> Git**: verify Production Branch is `main`.
4. Open **Settings -> Deployment Protection**: verify protection is active on Previews.
5. Open **Settings -> Environment Variables**: verify `APP_ENV=preview` for Preview scope.

### Option 2: CLI Inspection (Owner/Admin Token Required)
Run inspection commands in a terminal without initiating builds:
```bash
# List project details (Read-only)
vercel project ls

# Inspect specific project without modifying
vercel inspect le-son-website-qa

# Verify env variables for project
vercel env ls
```

---

## 4. Strict Safety Guardrails

- **NO AUTO-DEPLOY ON PUSH:** The repository does not trigger automatic deployment upon commit pushes.
- **NO DEPLOYMENT CALLS:** Antigravity does not execute `vercel`, `vercel deploy`, `vercel --prod`, or any deployment command.
- **NO CREDENTIAL COMMITS:** No Vercel API tokens, secrets, or sensitive environment files are committed to Git.
