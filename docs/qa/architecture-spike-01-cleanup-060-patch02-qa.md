# ARCHITECTURE SPIKE 01 — CLEANUP 060 PATCH 02 — Independent QA (CEO Directive 064-B)

- **QA:** Claude (Independent QA Lead). Chỉ đọc Git và chạy thử trong worktree riêng; không sửa nhánh spike, không merge, không deploy.
- **Ngày:** 28/10/2026
- **Đối chiếu:** `docs/qa/architecture-spike-01-cleanup-060-patch01-qa.md` (commit `d75c3f3`)
- **Bằng chứng:** `docs/qa/evidence/architecture-spike-01-cleanup-060-patch02/` (01–05)
- **Quy ước:** **VERIFIED BY CLAUDE** = Claude tự kiểm. **EXTERNAL EVIDENCE** = kết quả từ môi trường khác do Antigravity báo cáo, Claude không thể xác minh độc lập. **BLOCKED / NOT VERIFIED** = không kiểm được, không suy đoán.

## Kết luận: **BLOCKED** (Gate B) · **NOT READY FOR PREVIEW**

Patch 02 làm đúng điều CEO yêu cầu ở phần assertion. Claude tự đối chiếu từng assertion với `BookingPage.tsx` tại baseline 3A và **thấy chúng khớp nguyên văn**, không còn khớp lỏng. Không có P0/P1.

Nhưng Directive 064-B yêu cầu **chạy browser test bằng dependency của repo**, và việc này vẫn **không thực hiện được trong môi trường QA của Claude** (sandbox chặn tải Chromium). Kết quả "exit 0" trên Windows 11 chỉ là **EXTERNAL EVIDENCE do Antigravity tự báo cáo**, Claude không coi là đã xác minh độc lập. Hạ tầng Vercel vẫn **NOT VERIFIED** (API 403).

**Điểm cần CEO quyết định:** nếu CEO/chủ dự án chấp nhận log chạy thật trên máy Windows của Antigravity làm bằng chứng bên ngoài, thì các mục còn lại ở mục 11 rất ít. Quyết định này thuộc CEO, không phải Claude.

Claude không tự tạo Preview, không deploy, không merge, không migration.

---

## 1. Branch và SHA

| Mục | Giá trị |
|---|---|
| Branch | `spike/architecture-01-cleanup-060-patch02` |
| Commit triển khai | `0541f31ff7bb54814ee7cd3fd44948b6dfbcfd6c` |
| HEAD | `c0d8c67049d446f4746c3c69cb155a2a8874a2b9` (commit cuối chỉ ghi SHA vào handoff) |
| Parent | `f337afac05f6a7b05375e196aab4448392bdfb37` (Patch 01 HEAD) ✔ |
| Baseline 3A | `4739d45cc95100b587381b6bdcad6935352b23e8` |

## 2. Source integrity: **PASS về Git; NOT VERIFIED về hạ tầng Vercel**

`01-source-integrity.txt`, `05-vercel-readonly.txt`

| Kiểm tra | Kết quả |
|---|---|
| Xuất phát đúng Patch 01 HEAD, 2 commit | ✔ VERIFIED BY CLAUDE |
| Không merge `main` | ✔ `main` = `d2a19c5`, không chứa Patch 02 |
| Không sửa 3A, 3B-00 | ✔ `docs/phase-3b-00` vẫn `32b8a0a`; `docs/qa` giống baseline 3A |
| Runtime, SEO, `vercel.json`, `package.json`, `scripts/`, `tests/spike/` | ✔ Không đổi so với Patch 01 |
| File mã thay đổi | Chỉ **một**: `tests/e2e/2b-verification.cjs` (còn lại là 6 tài liệu) |
| Deployment mới, Production, Git Integration, Deployment Protection, domain | **NOT VERIFIED**: API Vercel trả HTTP 403. Không suy diễn từ Git |

## 3. Gate A — Assertion integrity: **PASS** (kiểm bằng đọc nguồn, chưa chạy được)

`02-assertion-baseline-comparison.txt`

Claude tự đối chiếu từng assertion của Patch 02 với `src/pages/BookingPage.tsx` tại `4739d45`:

| Yêu cầu | Kết quả |
|---|---|
| Banner đúng nội dung | ✔ Tiêu đề "Thông Báo Minh Bạch — Giao Diện Đang Trong Giai Đoạn Thử Nghiệm", đoạn mô tả và câu hướng dẫn hotline đều **khớp nguyên văn** với 3A (mỗi chuỗi xuất hiện đúng 1 lần ở 3A và có trong script) |
| Service option đúng value | ✔ `option[value="kham-dieu-tri"]` tồn tại đúng 1 phần tử, nội dung "Khám & điều trị"; giá trị `kham-tong-quat` cũ đã bỏ |
| Ngày hẹn hợp lệ | ✔ Ngày hôm nay + 3, định dạng theo giờ địa phương (`YYYY-MM-DD`), có kiểm giá trị đã điền |
| Thông báo sau submit | ✔ Panel `div[role="status"][aria-live="polite"]`; badge "Giao Diện Thử Nghiệm"; `h2` so **bằng** "Thông tin bạn nhập chưa được gửi đến bệnh viện." (`strictEqual`, nguyên văn 3A) |
| Hotline đúng | ✔ `097 355 51 05` khớp `HOSPITAL_CONTACT` |
| Liên kết `tel:` | ✔ `a[href="tel:0973555105"]` trong banner và trong panel; chữ của nút so bằng "Gọi hotline: 097 355 51 05" (khớp `<span>Gọi hotline: …</span>`) |
| Validation | ✔ Form rỗng phải có **đúng 4** thông báo lỗi (`#owner-name-error`, `#owner-phone-error`, `#pet-name-error`, `#preferred-date-error`; cả 4 id có trong 3A) và `aria-invalid="true"` ở `#owner-name` |
| Quay lại sau "Thử lại biểu mẫu" | ✔ Form hiện lại, panel `status` biến mất (`count === 0`) |
| Không bỏ assertion | ✔ Số `assert.` tăng 27 → **48** (Patch 01 → Patch 02); 0 lệnh mock, chặn route, hay skip |
| Không có chuỗi `cmd.exe`/`npm.cmd` | ✔ |

**Hạn chế còn lại (P3):**

- Một số locator khớp chuỗi con (`text=…`, `:has-text(...)`), nhưng nội dung dùng là **cả câu** của 3A. Riêng đoạn hướng dẫn ở panel (`p:has-text("Để đặt lịch khám, vui lòng gọi")`) chỉ khớp phần đầu câu, nhưng có kiểm thêm hotline.
- Locator banner dựa vào tên class Tailwind (`div.rounded-2xl.bg-amber-50`), dễ gãy nếu giao diện đổi class.
- Claude chưa chạy được thân bài này, nên chưa loại trừ hoàn toàn lỗi runtime (ví dụ locator không tìm thấy phần tử); đánh giá dựa trên đọc mã và đối chiếu 3A.

Không phát hiện false positive rõ ràng.

## 4. Gate B — Browser reproducibility: **BLOCKED**

`03-browser-tests-qa-sandbox.txt`

Chạy nguyên bản, bằng Playwright của repo, trong worktree sạch (không sửa test, không bản sao, không global):

| Bước | Kết quả |
|---|---|
| `npm ci` | ✔ exit 0 (Node 22.22.0, npm 10.9.4, Playwright 1.64.1) |
| `npm run test:install-browsers` | **BLOCKED**: exit 1; `cdn.playwright.dev` bị sandbox chặn (HTTP 403, "no rule or allowlist entry") |
| `npm run test:hydration` | **BLOCKED**: exit 1, "Executable doesn't exist" (cần Chromium build 1248; sandbox có 1243) |
| `npm run test:seo-consistency` | **BLOCKED**: exit 1, cùng lý do |
| `node tests/e2e/2b-verification.cjs` | **BLOCKED** ở bước trình duyệt: exit 1 (server đã khởi động và đã dọn trước đó) |

Claude không tìm cách vượt chính sách sandbox và không cài trình duyệt thủ công.

**EXTERNAL EVIDENCE từ Antigravity** (`04-external-evidence-claims.txt`):

- Windows 11, Node 24.21.0, Playwright 1.64.1; tự ghi nhãn `[VERIFIED BY ANTIGRAVITY (LOCAL HOST)]`.
- Báo cáo exit 0 cho typecheck, lint, build, install, hydration (8/8), seo-consistency (5/5) và `2b-verification.cjs` (14 viewport và Section 4 với assertion đã siết).
- Mức tin cậy: chi tiết và nhất quán với những gì Claude thấy (cùng danh sách 8 URL, cùng thông điệp), có nêu rõ môi trường và giới hạn. Nhưng đây là log do chính bên viết mã tạo ra, không có hash/ảnh để đối chiếu, nên Claude **không** tính là VERIFIED BY CLAUDE.
- Lưu ý: tài liệu ghi base commit của lần chạy là `f337afa` (Patch 01), chứ không phải commit Patch 02; cần làm rõ lần chạy ứng với commit nào.

## 5. Gate C — Portability & regression: **PARTIAL** (phần kiểm được đều đạt)

| Hạng mục | Kết quả |
|---|---|
| Không còn Windows-only startup | ✔ `cmd.exe`, `npm.cmd` không còn; server chạy bằng `process.execPath` |
| Khởi động server trên Linux | ✔ VERIFIED BY CLAUDE (xem Patch 01 và chạy lại ở vòng này) |
| Dọn process | ✔ Sau mỗi lần chạy: cổng 4173 trống, không còn process `preview-server` |
| Exit code khi FAIL | ✔ exit 1 |
| Exit code khi PASS | **NOT VERIFIED** (cần trình duyệt) |
| `SIGINT/SIGTERM`, macOS | NOT VERIFIED |
| Đầu ra riêng | ✔ `e2e-evidence/2b-run/` (đã `.gitignore`); `git status` sạch sau khi chạy |
| 15/15 file bằng chứng 2B giống baseline 3A | ✔ VERIFIED BY CLAUDE, sau khi chạy các lệnh trên |
| Typecheck | ✔ exit 0 |
| Lint | ✔ exit 0 |
| Build | ✔ exit 0, 19 trang prerender |
| Thay đổi runtime, SEO, Vercel config | ✔ Không |
| P0/P1 mới | ✔ Không |
| Visual/performance | Không đo lại (runtime không đổi) |

## 6. Gate D — Vercel read-only: **NOT VERIFIED**

`05-vercel-readonly.txt`

API trả **HTTP 403** (token không còn quyền vào scope). Không đọc được Project ID, framework preset, build/output settings, Deployment Protection, Production deployment, Git Integration, domain. Tài liệu `vercel-readonly-status.md` của Antigravity cũng ghi NOT VERIFIED và chỉ là checklist cho người có quyền. Không thay đổi cấu hình, không deploy.

## 7. P0/P1/P2/P3

| ID | Mức | Nội dung |
|---|---|---|
| — | P0/P1 | **Không có** |
| 3B-P02-P2-1 | P2 | Browser tests (hydration, seo-consistency, 2B e2e) chưa có xác minh **độc lập** bằng dependency của repo; chỉ có log tự báo cáo trên Windows |
| 3B-P02-P3-1 | P3 | Locator banner phụ thuộc class Tailwind; một vài locator khớp chuỗi con |
| 3B-P02-P3-2 | P3 | Log Windows ghi base `f337afa` thay vì commit Patch 02; không kèm hash evidence trước/sau |
| 3B-P02-P3-3 | P3 | `SIGINT/SIGTERM`, `exit 0`, macOS chưa kiểm |
| 3B-P02-P3-4 | P3 | Các P3 cũ ngoài phạm vi (xem QA Fix 01) chưa xử lý |

## 8. Remaining blockers

1. **Xác minh độc lập browser test:** cần môi trường tải được Chromium (CI hoặc máy được phép), hoặc CEO chấp nhận bằng chứng ngoài.
2. **Vercel read-only:** cần cấp lại quyền token hoặc chủ dự án xác nhận.

## 9. Gate tổng hợp

| Gate | Kết quả |
|---|---|
| A — Assertion Integrity | **PASS** (đối chiếu nguồn) |
| B — Browser Reproducibility | **BLOCKED** |
| C — Portability & Regression | **PARTIAL** |
| D — Vercel read-only | **NOT VERIFIED** |
| Source Integrity | **PASS (Git)** / **NOT VERIFIED (Vercel)** |

## 10. Final verdict và Preview readiness

- **Verdict: BLOCKED.** Không có P0/P1. Phần việc được yêu cầu ở Patch 02 (siết assertion) đã đạt theo đối chiếu 3A.
- **NOT READY FOR PREVIEW.** Điều kiện để chuyển sang READY, chọn một:
  - **(a)** Một lần chạy sạch do Claude hoặc bên độc lập khác thực hiện ở môi trường tải được Chromium, với `npm ci` → `npm run test:install-browsers` → `test:hydration` → `test:seo-consistency` → `node tests/e2e/2b-verification.cjs`, có log, exit code, hash evidence trước/sau; **hoặc**
  - **(b)** CEO/chủ dự án ghi nhận chính thức việc chấp nhận log chạy ngoài môi trường QA (EXTERNAL EVIDENCE) và nêu rõ nguồn.
  - Cả hai trường hợp đều cần xác minh Vercel read-only (cấp lại quyền token hoặc chủ dự án xác nhận) và chủ dự án cấp phép riêng cho **một** Preview có bảo vệ.
- READY chỉ có nghĩa đủ điều kiện để CEO xin phép chủ dự án tạo Preview, không phải quyền triển khai.

Claude không tự tạo Preview, không deploy, không merge, không migration, không sửa 3A/3B-00.

**ARCHITECTURE SPIKE 01 — CLEANUP 060 PATCH 02 PENDING OWNER DECISION**
