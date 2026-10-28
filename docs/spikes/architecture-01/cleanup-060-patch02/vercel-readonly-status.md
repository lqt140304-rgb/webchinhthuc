# Vercel Read-Only Verification Status (P04)

**Directive:** CEO Directive 064-A  
**Target Project:** `le-son-website-qa`  
**Target Project ID:** `prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3`  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Current Verification Status:** `[NOT VERIFIED (API UNREACHABLE / 403)]`  

---

## 1. Remote API Connectivity Status

In Claude Independent QA Cleanup 060 Patch 01 (`docs/qa/architecture-spike-01-cleanup-060-patch01-qa.md`), Claude verified:
```text
Lần này api.vercel.com không trả phản hồi (lỗi SSL); lần trước HTTP 403.
Không đọc được Project ID, framework preset, build/output settings, Deployment Protection, Production deployment, Git Integration, domain.
```

In accordance with CEO Directive 064-A Section VII:
- Antigravity does **not** possess, request, or commit Vercel API tokens or deploy keys.
- Antigravity does **not** attempt any unauthorized or speculative queries.
- Remote Vercel infrastructure is officially marked as **`NOT VERIFIED (API UNREACHABLE / 403)`**.

---

## 2. In-Repository Configuration Compliance (`vercel.json`)

While remote cloud settings cannot be queried via API without administrative credentials, the repository-level configuration is strictly declared in `vercel.json` (verified at commit `f337afa`):

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

### Technical Alignment:
1. **Build Command:** `"buildCommand": "npm run build"` guarantees that Vercel executes React Router build followed by `scripts/postbuild.cjs` (which generates root `404.html`).
2. **Output Directory:** `"outputDirectory": "build/client"` matches the exact output directory of React Router 7 Prerender SSG mode.
3. **Clean URLs:** `"cleanUrls": true` ensures clean path resolution (e.g., `/gioi-thieu` -> `gioi-thieu/index.html`).
4. **Dynamic Rewrites:** Unprerendered dynamic routes route to `__spa-fallback.html`, preserving client-side React routing.
5. **Custom 404:** Non-existent routes serve `404.html` with HTTP 404 status.

---

## 3. Recommended Actions for Project Owner / CEO

When the Project Owner reviews the Vercel dashboard (`https://vercel.com/`):
1. Confirm that **Framework Preset** is set to `Other` or `Vite`.
2. Confirm that **Build & Development Settings** do not override `buildCommand` or `outputDirectory` with invalid paths.
3. Confirm that **Deployment Protection** (password or Vercel SSO) is enabled on all Preview deployments.
4. Confirm that **Production Branch** remains `main`.
5. Under **Environment Variables**, verify `APP_ENV=preview` for the Preview environment.
