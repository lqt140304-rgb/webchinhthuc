# ARCHITECTURE SPIKE 01 — CLEANUP 060 PATCH 01 — Independent QA (CEO Directive 062-B)

- **QA:** Claude (Independent QA Lead). Chỉ đọc Git và chạy thử trong worktree riêng; không sửa nhánh spike, không merge, không deploy.
- **Ngày:** 28/10/2026
- **Đối chiếu:** `docs/qa/architecture-spike-01-cleanup-060-qa.md` (commit `1726c4c`)
- **Bằng chứng:** `docs/qa/evidence/architecture-spike-01-cleanup-060-patch01/` (01–08)
- **Quy ước:** **[VERIFIED BY CLAUDE]** = Claude tự kiểm. **[SELF-REPORTED]** = chỉ có trong tài liệu của Antigravity. **BLOCKED / NOT VERIFIED** = không kiểm được, không suy đoán.

## Kết luận: **BLOCKED** (P02) · **NOT READY FOR PREVIEW**

Lỗi Windows-only đã được sửa đúng cách và Claude **đã xác nhận trên Linux** một phần quan trọng (server khởi động, dọn process, exit code khi fail, bằng chứng 2B nguyên vẹn). Nhưng:

1. **Browser test chưa chạy được bằng dependency của repo trong QA** (sandbox chặn `cdn.playwright.dev`, HTTP 403): **BLOCKED**. Kết quả chạy trên Windows của Antigravity chỉ là **SELF-REPORTED**.
2. Antigravity **đã sửa lại các assertion** của script 2B (làm yếu hơn bản gốc) dù Directive 062-A cấm. Lý do có cơ sở (assertion gốc đã cũ so với 3A, Claude đã xác nhận), và có công bố, nhưng cần CEO/chủ dự án chấp nhận.
3. Hạ tầng Vercel vẫn **NOT VERIFIED** (lần này không kết nối được API).

Không có P0/P1.

---

## 1. Branch và SHA

| Mục | Giá trị |
|---|---|
| Branch | `spike/architecture-01-cleanup-060-patch01` |
| Commit triển khai | `4e76f20b4465baf54cef6b96b20a17b41ff8d380` |
| HEAD | `f337afac05f6a7b05375e196aab4448392bdfb37` (commit cuối chỉ ghi SHA vào handoff) |
| Parent | `2489439d3848b390b888101133ec0a3366075999` (Cleanup 060 HEAD) ✔ |
| Baseline 3A | `4739d45cc95100b587381b6bdcad6935352b23e8` |

## 2. Source integrity: **PASS về Git; NOT VERIFIED về hạ tầng Vercel**

`01-source-integrity.txt`, `07-vercel-readonly.txt`

| Kiểm tra | Kết quả |
|---|---|
| Xuất phát đúng Cleanup 060 HEAD, 2 commit | ✔ [VERIFIED BY CLAUDE] |
| Không merge `main` | ✔ `main` = `d2a19c5`, không chứa Patch 01 |
| Không sửa 3A, 3B-00 | ✔ `docs/phase-3b-00` vẫn `32b8a0a`; `docs/qa` giống baseline 3A (0 file khác) |
| Runtime, SEO, `vercel.json`, `package.json`, `scripts/`, `tests/spike/` | ✔ Không đổi so với Cleanup 060 |
| File mã thay đổi | Chỉ **một**: `tests/e2e/2b-verification.cjs` (còn lại là 6 tài liệu trong `docs/spikes/.../cleanup-060-patch01/`) |
| Deployment mới, Production, Git Integration, domain, Deployment Protection | **NOT VERIFIED**: lần này API Vercel không kết nối được (lỗi SSL, không có phản hồi HTTP); lần trước trả 403. Claude không suy diễn trạng thái Vercel từ Git |

## 3. Git diff

7 file, +645 / −18: `tests/e2e/2b-verification.cjs` (+61/−18 dòng mã) và 6 tài liệu.

Thay đổi trong script:

1. **Khởi động server:** `spawn('cmd.exe', ['/c','npm.cmd run preview …'])` → `spawn(process.execPath, ['scripts/preview-server.cjs','--port','4173'])`. Đúng cách đa nền tảng: không shell, không chuỗi do người dùng cung cấp (không có nguy cơ shell injection).
2. **Dừng server:** thay `spawn('taskkill', …)` bằng hàm `killProcess` (Windows: `taskkill /pid <số> /T /F`, pid là số do `spawn` trả về; Linux/macOS: `SIGTERM` rồi `SIGKILL` sau 500 ms). Gọi trong `finally`, trên `exit`, `SIGINT`, `SIGTERM`.
3. **Sửa assertion** (xem mục 7).

## 4. P01 — Cross-platform matrix

`03-script-diff-and-assertions.txt`, `04-linux-script-run.txt`

| Hệ điều hành | Kết quả | Nguồn |
|---|---|---|
| **Linux** (Claude, Debian, Node 22.22, npm 10.9) | **PARTIAL** (xem dưới) | [VERIFIED BY CLAUDE] |
| Windows | **NOT VERIFIED bởi Claude** (Antigravity ghi chạy Windows 11, có log "100% PASS") | [SELF-REPORTED] |
| macOS | **NOT VERIFIED** (không có môi trường; Antigravity cũng ghi NOT VERIFIED) | — |

**Linux, chạy nguyên bản `node tests/e2e/2b-verification.cjs` trong worktree sạch, đã kiểm:**

- ✔ Không còn `cmd.exe`, `npm.cmd`, đường dẫn máy cá nhân trong `tests/` và `scripts/` mới (chỉ còn `taskkill` ở nhánh `win32`).
- ✔ Server khởi động được: log `Server preview đã sẵn sàng trên cổng 4173.`
- ✔ Khi test **fail** (không có trình duyệt): script báo `LỖI KIỂM TRA`, thoát với **exit 1**.
- ✔ **Dọn process:** sau khi chạy, không còn tiến trình `node … preview-server`, và cổng 4173 **trống**.
- ✔ Đầu ra ghi vào `e2e-evidence/2b-run/` (đã `.gitignore`); `git status` sạch; **15/15 file bằng chứng 2B vẫn giống baseline 3A**.

**Chưa kiểm được trên Linux:** thân bài kiểm tra trình duyệt, **exit 0 khi test đạt**, việc ghi ảnh vào thư mục đầu ra khi chạy trọn vẹn, và nhánh `SIGINT/SIGTERM` của script. Vì thế **không thể ghi PASS đa nền tảng** theo Directive.

## 5. P02 — Playwright clean install và browser tests: **BLOCKED**

`05-playwright-clean-install.txt`

| Bước | Kết quả |
|---|---|
| `npm ci` | ✔ exit 0 (132 gói) |
| Playwright của repo | ✔ 1.64.1, từ `devDependencies` |
| `npm run test:install-browsers` | **BLOCKED**: exit 1; tải `cdn.playwright.dev/builds/cft/156.0.8078.4/…` bị sandbox chặn (403 "no rule or allowlist entry allows host") |
| `npm run test:hydration` | **BLOCKED** (trình duyệt Chromium build 1248 chưa cài) |
| `npm run test:seo-consistency` | **BLOCKED** (cùng lý do) |
| E2E 2B (`2b-verification.cjs`) | **BLOCKED** ở bước trình duyệt (server và dọn dẹp đã kiểm, xem mục 4) |

- Claude **không** dùng bản sao đã chỉnh hay Playwright global để thay thế, và không cố vượt chính sách sandbox (lần trước thao tác tải thủ công đã bị từ chối).
- **Mức tin cậy của log Antigravity:** tài liệu của Antigravity phân biệt rõ môi trường (Windows [VERIFIED BY ANTIGRAVITY]; sandbox Claude [BLOCKED]; Linux CI [chỉ có quy trình]; macOS [NOT VERIFIED]) và thừa nhận lần "1,2 giây" trước có thể do trình duyệt đã có sẵn trong cache. Trung thực hơn vòng trước. Nhưng đó **vẫn là tự báo cáo**, Claude không tính vào VERIFIED.
- Tài liệu Linux có lệnh `--with-deps` và ghi chú Docker. Ví dụ ảnh Docker nêu `playwright:v1.49.0`, **không khớp** Playwright 1.64.1 của repo (P3).

## 6. P03 — Evidence & regression: **PASS**

`02-evidence-hash-comparison.txt`, `06-typecheck-lint-build.txt`

| Hạng mục | Kết quả |
|---|---|
| 15/15 file bằng chứng 2B giống baseline 3A | ✔ Theo Git blob SHA và SHA-256, ở HEAD Patch 01 và sau khi chạy script |
| Script không ghi đè evidence cũ | ✔ Đầu ra mặc định `e2e-evidence/2b-run` |
| Typecheck | ✔ 0 lỗi |
| Lint | ✔ exit 0 |
| Build | ✔ exit 0, 19 trang prerender |
| Thay đổi runtime/SEO/`vercel.json` | ✔ Không có |
| P0/P1 mới | ✔ Không |

## 7. Assertion bị thay đổi: **cần CEO/chủ dự án chấp nhận**

`03-script-diff-and-assertions.txt`

Directive 062-A ghi: *"Giữ nguyên hành vi test… Không bỏ hoặc nới assertions để đạt PASS."* Patch 01 đã sửa các assertion ở mục 4 của script (`/dat-lich`):

| Assertion gốc | Bản mới | Claude xác nhận |
|---|---|---|
| Banner `Thông Báo Minh Bạch — Giao Diện Thử Nghiệm` | `Thông Báo Minh Bạch` (khớp một phần) | Chuỗi gốc **không còn** trong 3A; 3A hiển thị "…Giao Diện Đang Trong Giai Đoạn Thử Nghiệm" (`BookingPage.tsx:155`) |
| `selectOption('#service-type','kham-tong-quat')` | `kham-dieu-tri` | `kham-tong-quat` **không có** trong 3A; có `kham-dieu-tri` |
| Ngày hẹn cố định `2026-11-01` | ngày hiện tại + 3 | Hợp lý (tránh ngày đã qua) |
| 4 chuỗi kết quả (`Kiểm Thử Giao Diện Thành Công`, `Chưa kết nối máy chủ`, `chưa được gửi vào cơ sở dữ liệu thật`, `Gọi hotline đặt thật: 097 355 51 05`) | `[role="status"]` hiển thị; chứa `chưa được gửi` và `097 355 51 05` | Các chuỗi gốc **không còn** trong 3A; 3A hiển thị "Thông tin bạn nhập chưa được gửi đến bệnh viện." |

- **Đánh giá:** assertion gốc đã **lỗi thời so với 3A** (Claude tự đối chiếu `BookingPage.tsx` tại `4739d45`), nên không thể giữ nguyên mà vẫn chạy được. Antigravity **đã công bố** thay đổi này trong `cross-platform-test-evidence.md`. Đây không phải che giấu.
- **Nhưng:** bản mới **yếu hơn**. Có thể chặt hơn bằng cách khớp nguyên văn chuỗi thật của 3A (ví dụ "Thông tin bạn nhập chưa được gửi đến bệnh viện." và liên kết `tel:` của hotline). Việc sửa vượt phạm vi P01 và vi phạm câu chữ của directive, nên **cần CEO/chủ dự án chấp nhận** (3B-P01-P2-1). Claude không thể kiểm thân bài mới vì BLOCKED.

## 8. Vercel read-only: **NOT VERIFIED**

`07-vercel-readonly.txt`, `08-checklist-precedence-claims.txt`

- Lần này `api.vercel.com` không trả phản hồi (lỗi SSL); lần trước HTTP 403. Không đọc được Project ID, framework preset, build/output settings, Deployment Protection, Production deployment, Git Integration, domain.
- Checklist của Antigravity (`vercel-readonly-checklist.md`) là **tài liệu hướng dẫn**, nêu rằng `vercel.json` đã khai báo `buildCommand` và `outputDirectory`. Phần này **đúng với file** `vercel.json` (đã kiểm ở QA Fix 01). Nó **chưa trả lời** việc cài đặt trên Dashboard có ghi đè `vercel.json` hay không; chỉ Preview thật mới xác định được.

## 9. P0/P1/P2/P3

| ID | Mức | Nội dung |
|---|---|---|
| — | P0/P1 | **Không có** |
| 3B-P01-P2-1 | P2 | Assertion của script 2B được sửa và yếu hơn bản gốc, vượt phạm vi 062-A; lý do có cơ sở (lỗi thời so với 3A) và đã công bố, nhưng cần chấp nhận chính thức; nên siết lại bằng chuỗi nguyên văn của 3A |
| 3B-P01-P2-2 | P2 | Chưa có bằng chứng **độc lập** cho clean install và browser tests (hydration, seo-consistency, 2B) bằng dependency của repo. Cần một lần chạy ở môi trường cho phép tải Chromium (CI hoặc máy được phép) |
| 3B-P01-P3-1 | P3 | Bằng chứng Windows chỉ là tự báo cáo; log chạy không kèm hash/ảnh để đối chiếu |
| 3B-P01-P3-2 | P3 | Ví dụ Docker `playwright:v1.49.0` không khớp Playwright 1.64.1 của repo |
| 3B-P01-P3-3 | P3 | Nhánh `SIGINT/SIGTERM` và `exit 0` của script chưa được kiểm; `2b-verification-results.txt` đã nghiệm thu mô tả hành vi cũ của script |
| 3B-P01-P3-4 | P3 | Các P3 cũ ngoài phạm vi (xem QA Fix 01) chưa xử lý, đúng như Directive |

## 10. Remaining blockers

1. **Browser tests chưa được xác minh độc lập** (P02): chạy được khi có môi trường tải được Chromium.
2. **Chấp nhận thay đổi assertion** (3B-P01-P2-1).
3. **Vercel read-only chưa kiểm được** (API không kết nối).

## 11. Gate P01–P04

| Gate | Kết quả |
|---|---|
| P01 — Cross-platform | **PARTIAL** (Linux: server, dọn process, exit 1 khi fail, evidence nguyên vẹn đã kiểm; Windows self-reported; macOS NOT VERIFIED; thân bài test chưa chạy) |
| P02 — Browser Reproducibility | **BLOCKED** |
| P03 — Scope Integrity | **PASS** (chỉ 1 file mã, không đổi runtime/SEO/Vercel config; kèm P2 assertion) |
| P04 — Preview Readiness | **NOT READY** |
| Source Integrity | **PASS (Git)** / **NOT VERIFIED (Vercel)** |

## 12. Preview readiness và verdict

- **Verdict: BLOCKED.** Không có P0/P1. Đã tiến bộ so với Cleanup 060: lỗi `cmd.exe` đã sửa và được xác nhận trên Linux.
- **NOT READY FOR PREVIEW.** Điều kiện để chuyển sang READY:
  1. Một lần chạy sạch `npm ci` → `npm run test:install-browsers` → `test:hydration` → `test:seo-consistency` → `node tests/e2e/2b-verification.cjs` trên môi trường tải được Chromium, có log (OS, Node/npm, Playwright, exit code, hash evidence trước/sau). Claude sẽ chạy lại khi môi trường cho phép, hoặc CEO chấp nhận log do bên thứ hai kiểm.
  2. CEO/chủ dự án chấp nhận (hoặc yêu cầu siết lại) thay đổi assertion.
  3. Xác minh Vercel read-only (cấp lại quyền token hoặc chủ dự án xác nhận).
  4. Chủ dự án cấp phép riêng cho **một** Preview có bảo vệ.
- READY chỉ có nghĩa đủ điều kiện xin phép chủ dự án, không phải quyền triển khai.

Claude không tự tạo Preview, không deploy, không merge, không migration, không sửa 3A/3B-00.

**ARCHITECTURE SPIKE 01 — CLEANUP 060 PATCH 01 PENDING OWNER DECISION**
