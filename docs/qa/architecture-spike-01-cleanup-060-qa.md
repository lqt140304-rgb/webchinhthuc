# ARCHITECTURE SPIKE 01 — CLEANUP 060 — Independent QA (CEO Directive 060-B)

- **QA:** Claude (Independent QA Lead). Chỉ đọc Git và chạy thử trong worktree riêng; không sửa nhánh spike, không merge, không deploy.
- **Ngày:** 28/10/2026
- **Phạm vi:** chỉ hai mục: 3B-H2F-P2-1 (14 ảnh 2B bị ghi đè) và 3B-H2F-P2-2 (cài Playwright và tái lập browser test). Không mở rộng thành vòng QA kiến trúc mới (không phát hiện regression nghiêm trọng).
- **Đối chiếu:** `docs/qa/architecture-spike-01-hardening-02-fix01-qa.md` (commit `a547604`)
- **Bằng chứng:** `docs/qa/evidence/architecture-spike-01-cleanup-060/` (01–07)
- **Quy ước:** **[VERIFIED]** = Claude tự kiểm. **[SELF-REPORTED]** = chỉ có trong báo cáo của Antigravity.

## Kết luận: **BLOCKED** ở C02 · C01 và C03 **PASS** · **NOT READY FOR PREVIEW** (chờ hoàn tất điều kiện dưới đây)

| Gate | Kết quả |
|---|---|
| C01 — Evidence Integrity | **PASS** |
| C02 — Test Portability | **BLOCKED** (kèm 1 lỗi P2 đã xác nhận) |
| C03 — Scope & Regression | **PASS** |
| C04 — Preview Readiness | **NOT READY** |
| Source Integrity | **PASS về Git**; **NOT VERIFIED về hạ tầng Vercel** |

- **C01 đạt trọn vẹn:** 14 ảnh (và cả file kết quả) khôi phục đúng từng byte; script 2B không còn trỏ vào thư mục bằng chứng đã nghiệm thu.
- **C02 chưa kết luận được PASS vì hai lý do độc lập:**
  1. **Lỗi thật:** `tests/e2e/2b-verification.cjs` vẫn **chỉ chạy được trên Windows** (`spawn('cmd.exe', ['/c','npm.cmd run preview…'])`). Trên Linux/macOS script dừng ngay với `spawn cmd.exe ENOENT`. Handoff khẳng định "không hardcode, chạy mượt" là chưa đúng.
  2. **Giới hạn môi trường QA:** sandbox của Claude chặn host tải trình duyệt (`cdn.playwright.dev` → 403), nên **không chạy được browser test bằng dependency của repo**. Theo Directive 060-B: **BLOCKED**, không PASS.
- **Preview NOT READY** vì hai điều trên và vì hạ tầng Vercel không kiểm lại được. Các điều kiện còn lại của vòng trước (cấu hình output, SEO, Content Audit) không bị cleanup thay đổi.

Claude không tự tạo Preview, không deploy, không merge, không migration.

---

## 1. Branch và SHA

| Mục | Giá trị |
|---|---|
| Branch | `spike/architecture-01-h02-fix01-cleanup` |
| Commit triển khai | `b5858f3720202377a3273dea9fcb7fbb01dfcf7e` |
| HEAD | `2489439d3848b390b888101133ec0a3366075999` (commit cuối chỉ ghi SHA vào handoff) |
| Parent | `535f803808dcfb27f06b3303a5e32070c88a5aa6` (Fix 01 HEAD) ✔ |
| Baseline 3A | `4739d45cc95100b587381b6bdcad6935352b23e8` |

## 2. Source integrity

`01-source-integrity.txt`, `07-vercel-readonly.txt`

| Kiểm tra | Kết quả |
|---|---|
| Xuất phát đúng Fix 01 HEAD, 2 commit | ✔ [VERIFIED] |
| Không merge `main` | ✔ `main` = `d2a19c5`, không chứa cleanup |
| Không sửa 3A / 3B-00 | ✔ `src/`, `public/`, `app/`, `docs/phase-3b*` không đổi; `docs/phase-3b-00` vẫn `32b8a0a` |
| Runtime, `vercel.json`, `vite.config.ts`, `react-router.config.ts`, `tests/spike/` | ✔ **Không đổi** so với Fix 01 |
| Thay đổi ngoài tài liệu cleanup và 14 ảnh | Chỉ hai file: `package.json` (+1 script) và `tests/e2e/2b-verification.cjs` (1 dòng) |
| Deployment do cleanup tạo ra, Production, Git Integration, Deployment Protection | **NOT VERIFIED**: API Vercel vẫn trả **HTTP 403** (token không còn quyền vào scope). Từ Git: cleanup không đổi cấu hình deploy |

## 3. Danh sách file thay đổi (so với Fix 01)

21 file, +455 / −2:

- 14 ảnh `docs/qa/2b-verification-evidence/*.png` (khôi phục).
- `package.json`: thêm `"test:install-browsers": "playwright install chromium"`.
- `tests/e2e/2b-verification.cjs`: `EVIDENCE_DIR` đổi từ `docs/qa/2b-verification-evidence` sang `process.env.TEST_OUTPUT_DIR || e2e-evidence/2b-run`.
- 5 tài liệu trong `docs/spikes/architecture-01/hardening-02-fix01-cleanup/` (summary, evidence-restoration, playwright-setup, test-results, handoff).

## 4. C01 — Hash comparison 14 ảnh: **PASS**

`02-evidence-hash-comparison.txt`

- **Phương pháp:** với từng file trong `docs/qa/2b-verification-evidence/` của baseline 3A, so **Git blob SHA** và **SHA-256 nội dung** giữa baseline `4739d45`, Fix 01 `535f803` và cleanup `2489439`.
- **Kết quả:** **15/15 file giống hệt baseline** (14 ảnh + `2b-verification-results.txt`), cả blob SHA lẫn SHA-256. Cùng tên file, không thiếu, không thừa (15 = 15).
- Ví dụ: `home-1440px.png` blob `eb9dfbe58abc…` (3A) → `56c598bb869c…` (bản bị ghi đè ở Fix 01) → `eb9dfbe58abc…` (cleanup).
- Không file nào khác trong `docs/qa/` khác baseline (0 file).
- Claude tự so, không dựa vào bảng hash của Antigravity. Ảnh nguồn không bị sửa để test đạt.

## 5. Script isolation verification: **PASS** (có điều kiện chạy được)

`03-script-diff-and-portability.txt`, `04-repo-dependency-browser-runs.txt`

- ✔ `EVIDENCE_DIR` mặc định nay là `e2e-evidence/2b-run`, đã được `.gitignore` bảo vệ (xác nhận bằng `git check-ignore`); có thể đổi qua `TEST_OUTPUT_DIR`. Không còn đường dẫn nào trỏ tới `docs/qa/2b-verification-evidence`.
- ✔ **Kiểm bằng chạy thật:** Claude chạy nguyên bản `node tests/e2e/2b-verification.cjs` trong worktree sạch. Script tạo `e2e-evidence/2b-run/` rồi dừng (lỗi ở mục 7). Sau lần chạy, `git status` sạch và **15/15 file bằng chứng 2B vẫn giống baseline**.
- **Giới hạn:** do script dừng sớm nên **chưa thấy được việc ghi ảnh** vào thư mục mới; đã xác nhận bằng đọc mã (các lệnh `screenshot` và `writeFileSync` đều dùng `EVIDENCE_DIR` mới).

## 6. C02 — Playwright clean setup: **BLOCKED**

`05-playwright-clean-setup.txt`

| Hạng mục | Kết quả |
|---|---|
| Clean install | ✔ `npm ci` exit 0, 132 gói |
| Phiên bản Playwright | ✔ 1.64.1, từ `devDependencies` của repo (không global) |
| Hardcoded path trong test mới | ✔ Không còn `C:/Users/...` trong `tests/spike/` và `2b-verification.cjs` |
| `npm run test:install-browsers` | **BLOCKED / NOT VERIFIED.** Exit 1: tải `https://cdn.playwright.dev/builds/cft/156.0.8078.4/linux64/chrome-linux64.zip` bị sandbox chặn (HTTP 403, "no rule or allowlist entry allows host"). Không phải lỗi của repo; chỉ kiểm được rằng lệnh gọi đúng `playwright install chromium` |
| Cách thay thế | Claude thử tải một bản Chromium từ host khác để cài thủ công; **harness QA từ chối** thao tác tải và chạy mã ngoài, và Claude **không** cố vượt qua |
| Tài liệu `playwright-setup.md` | Có hướng dẫn 4 bước; tự nêu rằng browser test chưa chạy được trên "máy sạch" cho tới khi cài trình duyệt |

## 7. Browser test results: **BLOCKED** (kèm lỗi P2 thật)

`04-repo-dependency-browser-runs.txt`

Chạy nguyên bản, bằng Playwright của repo, trong worktree sạch (không sửa test, không bản sao):

| Lệnh | Kết quả |
|---|---|
| `node tests/e2e/2b-verification.cjs` | ✘ **FAIL: `spawn cmd.exe ENOENT`** (exit 1). Script khởi động server bằng `cmd.exe` và `npm.cmd`, chỉ có trên Windows |
| `npm run test:hydration` | **BLOCKED**: "Executable doesn't exist" (trình duyệt Chromium build 1248 chưa cài) |
| `npm run test:seo-consistency` | **BLOCKED**: cùng lý do |
| `npm run test:routing`, `test:seo` | Không cần trình duyệt, đạt ở vòng trước, không đổi |

- **Lỗi P2 mới (3B-C060-P2-1):** `2b-verification.cjs` hardcode `cmd.exe`/`npm.cmd`. Khẳng định "không hardcode đường dẫn máy cá nhân" của handoff chỉ đúng với đường dẫn Playwright; script vẫn không chạy được ngoài Windows. Dù trình duyệt có sẵn, **E2E 2B vẫn không chạy được** trên Linux hay CI.
- **So với vòng trước:** hydration và SEO consistency đã được Claude chạy ở QA Fix 01 bằng **bản sao nguyên văn** với Playwright có sẵn của sandbox (đều đạt). Theo Directive 060-B, kết quả đó **không** được tính là PASS bằng dependency của repo.
- **E2E 2B** (`tests/e2e/2b.e2e.test.cjs`, bản chuẩn đã chạy ở vòng trước) và `2b-verification.cjs` là hai file khác nhau; chưa chạy được file thứ hai ở bất kỳ môi trường nào của Claude.

## 8. Regression & scope: **PASS**

`06-typecheck-lint-build.txt`

| Hạng mục | Kết quả |
|---|---|
| Typecheck | ✔ 0 lỗi |
| Lint | ✔ exit 0 |
| Build | ✔ exit 0, 19 trang prerender, `404.html`, `__spa-fallback.html` |
| Git diff | ✔ Chỉ như mục 3; không thay đổi runtime, SEO policy, `vercel.json` |
| 3A/3B-00 | ✔ Không đổi |
| Route parity, hydration, SEO, LCP/CLS | Không đo lại: không có thay đổi runtime (đúng phạm vi Directive); kết quả QA Fix 01 vẫn áp dụng |

## 9. Gate C01–C04

| Gate | Kết quả | Căn cứ |
|---|---|---|
| C01 — Evidence Integrity | **PASS** | 15/15 file giống baseline theo blob SHA và SHA-256; script không còn trỏ vào thư mục đã nghiệm thu |
| C02 — Test Portability | **BLOCKED** | Không chạy được browser test bằng dependency của repo trong QA; lỗi thật ở `2b-verification.cjs` (Windows-only) |
| C03 — Scope & Regression | **PASS** | Chỉ 2 file mã thay đổi; typecheck, lint, build đạt |
| C04 — Preview Readiness | **NOT READY** | Xem mục 12 |
| Source Integrity | **PASS (Git)** / **NOT VERIFIED (Vercel)** | API 403 |

## 10. P0/P1/P2/P3

| ID | Mức | Nội dung |
|---|---|---|
| — | P0/P1 | **Không có** |
| **3B-C060-P2-1** | P2 | `tests/e2e/2b-verification.cjs` vẫn dùng `spawn('cmd.exe', ['/c','npm.cmd run preview …'])`: **chỉ chạy được trên Windows**. Cách sửa: dùng `spawn('npm', ['run','preview','--','--port','4173'])` (hoặc `node scripts/preview-server.cjs --port …`), kèm `shell` cho Windows nếu cần |
| 3B-C060-P2-2 | P2 | Browser test (hydration, seo-consistency, 2B) vẫn **chưa được xác nhận chạy từ clean install** ở môi trường ngoài máy Antigravity; cần một lần chạy trên máy/CI có tải được trình duyệt (gồm `npm run test:install-browsers`) |
| 3B-C060-P3-1 | P3 | Handoff/test-results tự chấm C02 "PASS" và "script `test:install-browsers` hoạt động, hoàn tất trong 1,2 giây" (có thể là do trình duyệt đã có sẵn trên máy Antigravity); tự khẳng định "chạy mượt, không hardcode" không đúng với `cmd.exe` |
| 3B-C060-P3-2 | P3 | Còn đường dẫn máy ở mã cũ: `tests/measure-cls.cjs` (`D:/webbvct/dist`), `scripts/test-and-capture-2b.mjs` |
| 3B-C060-P3-3 | P3 | Các mục P3 của QA Fix 01 chưa được xử lý trong cleanup (ngoài phạm vi): `/404` trả 200, header noindex cố định, `preview-server.cjs` rộng hơn `vercel.json`, v.v. |

## 11. NOT VERIFIED

- Trạng thái deployment, Production, Git Integration, Deployment Protection, project settings Vercel (API 403).
- Kết quả của `npm run test:install-browsers` ngoài máy Antigravity (host tải bị chặn trong sandbox QA).
- Việc script 2B ghi ảnh vào `e2e-evidence/2b-run/` khi chạy trọn vẹn (script dừng ở `cmd.exe`; chỉ xác nhận bằng đọc mã).
- Hosting thật, HTTP 404, rewrite, header, social preview (không thuộc phạm vi cleanup, vẫn NOT TESTED).
- Tài liệu hướng dẫn ngày 28/10 cho `playwright install` có đủ cho Linux CI (`--with-deps`) hay không.

## 12. Final verdict và Preview readiness

- **Verdict: BLOCKED** (C02). C01 và C03 đạt. Không có P0/P1.
- **NOT READY FOR PREVIEW.** Điều kiện để chuyển sang READY:
  1. Sửa `2b-verification.cjs` cho chạy được ngoài Windows (3B-C060-P2-1).
  2. Một lần chạy sạch `npm ci` → `npm run test:install-browsers` → `test:hydration` → `test:seo-consistency` → E2E 2B, trên môi trường tải được trình duyệt, có log đính kèm. Claude có thể chạy lại khi môi trường cho phép tải trình duyệt, hoặc chủ dự án chấp nhận log từ máy khác.
  3. Xác minh lại hạ tầng Vercel (token cần cấp lại quyền, hoặc chủ dự án xác nhận).
  4. Chủ dự án cấp phép riêng cho **một** Preview có bảo vệ.
- C01 (ảnh bằng chứng) **đã xong** và không cần làm lại.

**Preview readiness chỉ là điều kiện xin phép chủ dự án, không phải quyền triển khai.**

**ARCHITECTURE SPIKE 01 — CLEANUP 060 PENDING OWNER DECISION**
