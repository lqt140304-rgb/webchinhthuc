# Cross-Platform Execution, Process Lifecycle & Regression Verification

**Directive:** CEO Directive 064-A  
**Branch:** `spike/architecture-01-cleanup-060-patch02`  
**Base Commit:** `f337afac05f6a7b05375e196aab4448392bdfb37`  
**Baseline 3A:** `4739d45cc95100b587381b6bdcad6935352b23e8`  

---

## 1. Cross-Platform Lifecycle & Process Cleanup Status

In Patch 01 QA (`docs/qa/architecture-spike-01-cleanup-060-patch01-qa.md`), Claude verified on Linux:
```text
Linux, chạy nguyên bản node tests/e2e/2b-verification.cjs trong worktree sạch, đã kiểm:
- ✔ Không còn cmd.exe, npm.cmd, đường dẫn máy cá nhân trong tests/ và scripts/ mới.
- ✔ Server khởi động được: log "Server preview đã sẵn sàng trên cổng 4173."
- ✔ Khi test fail (không có trình duyệt): script báo LỖI KIỂM TRA, thoát với exit 1.
- ✔ Dọn process: sau khi chạy, không còn tiến trình node … preview-server, và cổng 4173 trống.
- ✔ Đầu ra ghi vào e2e-evidence/2b-run/ (đã .gitignore); git status sạch; 15/15 file bằng chứng 2B vẫn giống baseline 3A.
```

### Combined Cross-Platform Matrix

| Capability / Check | Windows 11 Host | Linux (Claude QA Sandbox) | macOS |
|---|---|---|---|
| **Server Spawning** | `process.execPath` running `scripts/preview-server.cjs` (PASS) | `process.execPath` running `scripts/preview-server.cjs` (PASS [VERIFIED BY CLAUDE]) | POSIX compliant by design |
| **Shell Independence** | Zero `cmd.exe` or `npm.cmd` invocations (PASS) | Zero shell invocations (PASS [VERIFIED BY CLAUDE]) | Zero shell invocations |
| **Exit Code on Failure** | Exit code `1` (PASS) | Exit code `1` (PASS [VERIFIED BY CLAUDE]) | Expected `1` |
| **Exit Code on Success** | Exit code `0` (PASS) | *(Pending Chromium download)* | Expected `0` |
| **Process Termination** | `killProcess` uses `taskkill /pid ... /T /F` with fallback `SIGKILL` (PASS) | `killProcess` uses `SIGTERM` with fallback `SIGKILL` (PASS [VERIFIED BY CLAUDE]) | Uses `SIGTERM` with `SIGKILL` fallback |
| **Port 4173 Release** | Sockets in `TimeWait`, 0 listening processes (PASS) | Port 4173 freed, 0 listening processes (PASS [VERIFIED BY CLAUDE]) | Standard OS socket teardown |
| **Evidence Isolation** | Writes strictly to `e2e-evidence/2b-run/` (PASS) | Writes strictly to `e2e-evidence/2b-run/` (PASS [VERIFIED BY CLAUDE]) | Writes to `e2e-evidence/2b-run/` |

---

## 2. Regression Test Results Summary

| Test Suite | Command | Result | Verification Standard |
|---|---|---|---|
| **TypeScript Typecheck** | `npm.cmd run typecheck` | **PASS (0 errors)** | React Router Typegen + `tsc -b` |
| **Code Style & Linting** | `npm.cmd run lint` | **PASS (0 errors, 0 warnings)** | Oxlint 88 files in 31ms |
| **Prerender SSG Build** | `npm.cmd run build` | **PASS (exit 0)** | 19 static HTML routes + `404.html` + `__spa-fallback.html` |
| **Hydration 418 Check** | `npm.cmd run test:hydration` | **PASS (8/8 routes)** | Headless Chromium, zero console errors |
| **SEO Consistency Check** | `npm.cmd run test:seo-consistency` | **PASS (5/5 checks)** | Headless Chromium, consistent `noindex, nofollow` |
| **Milestone 2B E2E** | `node tests/e2e/2b-verification.cjs` | **PASS (100%)** | 14 viewports + tightened 3A assertions |

---

## 3. Evidence Integrity Audit

All 15 Milestone 2B accepted evidence files were audited against Baseline 3A (`4739d45cc95100b587381b6bdcad6935352b23e8`):
```bash
git diff 4739d45cc95100b587381b6bdcad6935352b23e8 -- docs/qa/2b-verification-evidence
```
**Diff Output: 0 bytes (100% bit-for-bit identical).**

---

## 4. P3 Backlog Status Tracking

| Issue ID | Description | Status in Patch 02 |
|---|---|---|
| **3B-P01-P3-1** | Log chạy không kèm đối chiếu hash/ảnh | **RESOLVED:** Complete execution logs and evidence directory verification provided. |
| **3B-P01-P3-2** | Docker Playwright tag example in docs | **RESOLVED:** Updated to `v1.64.1` to match `package.json`. |
| **3B-P01-P3-3** | `exit 0` and process lifecycle verification | **VERIFIED:** Windows execution confirmed exit code `0` upon test completion; port 4173 cleanly freed. |
| **3B-P01-P3-4** | P3 items from QA Fix 01 (`/404` status code 200 in local preview, fixed headers) | **TRACKED IN BACKLOG:** Preserved in backlog per CEO Directive 064-A scope boundary. |
