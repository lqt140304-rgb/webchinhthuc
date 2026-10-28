# ARCHITECTURE SPIKE 01 — HARDENING 02 FIX 01 — Independent QA (CEO Directive 058-B)

- **QA:** Claude (Independent Architecture QA Lead). Chỉ đọc Git và chạy thử trong worktree riêng; không sửa nhánh spike, không merge, không deploy.
- **Ngày:** 28/10/2026
- **Đối chiếu:** `docs/qa/architecture-spike-01-hardening-02-qa.md` (commit `4b6b529`)
- **Bằng chứng:** `docs/qa/evidence/architecture-spike-01-hardening-02-fix01/` (01–15 và `scripts/`)
- **Quy ước:** **[VERIFIED]** = Claude tự kiểm. **[SELF-REPORTED]** = chỉ có trong báo cáo của Antigravity. Mọi kiểm thử HTTP là **server tĩnh cục bộ mô phỏng `vercel.json`**, không phải Vercel thật.

## Kết luận: **PASS WITH FIXES** · **READY FOR PREVIEW** (chỉ ở nghĩa: đủ điều kiện xin phép chủ dự án, kèm điều kiện)

**Không còn P0/P1.** Ba blocker của vòng trước đã đóng:

- `vercel.json` nay **thực sự có** `buildCommand`, `outputDirectory: "build/client"`, `cleanUrls`, `trailingSlash`.
- Chính sách SEO đã nhất quán: không còn hai thẻ robots mâu thuẫn ở cả ba môi trường (local, preview, production mô phỏng).
- Content Audit Register đã sửa đúng vị trí, giờ mở cửa và trạng thái "24/7".

Hồi quy: giao diện 0 pixel khác 3A, E2E 3A đạt toàn bộ (kèm bản chỉnh), axe bằng baseline, LCP mobile tốt hơn baseline.

**Điều kiện và giới hạn, cần chủ dự án biết trước khi cho phép Preview:**

1. **Nhánh làm ghi đè 14 ảnh bằng chứng QA của Mốc 2B** (`docs/qa/2b-verification-evidence/*.png`, từ commit `b53e259`). Đây là hệ quả khi chạy `tests/e2e/2b-verification.cjs`. Không ảnh hưởng mã hay hosting, nhưng **nên hoàn nguyên trước khi tạo Preview** (3B-H2F-P2-1).
2. **Ưu tiên cấu hình Vercel (Dashboard hay `vercel.json`) chưa được kiểm chứng.** Tài liệu của Antigravity khẳng định Dashboard thắng. Claude không xác nhận được và không thể kiểm trên Vercel thật: **NOT VERIFIED**. Project hiện đang là `vite` / `dist`. Cách xác định duy nhất là Preview đầu tiên. Nếu Dashboard thắng, build sẽ lỗi hoặc ra sai thư mục và **cần chủ dự án phê duyệt riêng** việc đổi project settings. Kết quả xấu nhất là một deployment lỗi, không ảnh hưởng Production.
3. **Test dựa trên Playwright không chạy ngay sau `npm ci` trên môi trường mới**: Playwright 1.64.1 mới thêm vào `devDependencies` cần tải trình duyệt (`npx playwright install`), việc này chưa có trong hướng dẫn (3B-H2F-P2-2).

Claude không tự phê duyệt migration, deployment hay 3B-01.

---

## 1. Branch và SHA

| Mục | Giá trị |
|---|---|
| Branch | `spike/architecture-01-hardening-02-fix01` |
| Commit triển khai | `f46feeb8d4eacbb3a653ef079a0b7d3db317ada9` |
| HEAD | `535f803808dcfb27f06b3303a5e32070c88a5aa6` (commit cuối chỉ ghi SHA vào handoff) |
| Parent | `bacc62afebcd531a23a1fc6f52724f1799557000` (Hardening 02) ✔ |
| Diff vs Hardening 02 | 31 file, +1125 / −15 (gồm 14 ảnh nhị phân của 2B) |

## 2. Source integrity: **PASS** (kèm 1 ngoại lệ P2)

`01-source-integrity.txt`, `02-vercel-readonly.txt`

| Kiểm tra | Kết quả |
|---|---|
| Xuất phát đúng Hardening 02 HEAD, 2 commit | ✔ [VERIFIED] |
| Không merge `main` | ✔ `main` = `d2a19c5`, không chứa Fix 01 |
| Không sửa baseline 3A (`src/`, `public/`, `index.html`, `AGENTS.md`) | ✔ Chỉ có `src/config/seo-policy.ts` (đã tồn tại từ H02) và `src/hooks/useRouteSeo.ts` (từ H01) khác baseline |
| Không sửa 3B-00 | ✔ `docs/phase-3b-00` vẫn `32b8a0a`; Fix 01 không đụng `docs/phase-3b*` |
| Deployment mới | ✔ Không có: mới nhất vẫn `dpl_8XZEtH3…` / `4739d45` |
| Production, domain, Git Integration | ✔ Production `dpl_BAz378…` / `db78738`; `project.link` trống |
| Deployment Protection | ✔ Vẫn bật (`ssoProtection: all`) |
| Project settings Vercel | Không đổi: `vite` / `dist` |
| **Bằng chứng QA Mốc 2B bị ghi đè** | ✘ **3B-H2F-P2-1:** 14 ảnh trong `docs/qa/2b-verification-evidence/` thay đổi (ví dụ `home-1366px.png` 2,72 MB → 1,95 MB). Nguyên nhân: script `2b-verification.cjs` ghi thẳng vào thư mục này. Không sửa mã baseline nhưng làm hỏng hồ sơ bằng chứng đã nghiệm thu |

## 3. F01 — Vercel output: **PARTIAL** (nguồn đạt; hosting NOT TESTED)

`03-vercel-config.txt`, `04-build.log`, `05-typecheck-lint-install.txt`

| Hạng mục | Kết quả |
|---|---|
| `outputDirectory` có trong source | ✔ [VERIFIED] `vercel.json` có `buildCommand: "npm run build"`, `outputDirectory: "build/client"`, `cleanUrls: true`, `trailingSlash: false` |
| `build/client` được tạo sau clean build | ✔ `npm ci` (132 gói) + `npm run build` đều exit 0. Có `404.html`, `__spa-fallback.html`, 19 trang prerender, assets, fonts, images |
| Tài liệu khớp file thực tế | ✔ Fix 01 đã đính chính. Các khẳng định `outputDirectory`, `cleanUrls` nay đúng |
| Rewrites | ✔ 3 rewrite hẹp: `/tai-khoan/(.*)`, `/cau-chuyen/(.*)`, `/bai-viet/(.*)` → `/__spa-fallback.html`. Không có catch-all |
| Nguy cơ Soft 404 | Một phần: URL lạ trả 404 trên mô phỏng ✔. **Nhưng** `/404` và `/404.html` trả **200** vì `404/index.html` được prerender (3B-H2F-P3-1) |
| **Project settings `vite`/`dist` có bị `vercel.json` ghi đè không** | **NOT VERIFIED.** Tài liệu của Antigravity ghi Dashboard có ưu tiên cao nhất. Claude không có bằng chứng để khẳng định chiều ngược lại. Chỉ Preview thật mới trả lời được |
| Có cần đổi project settings khi tạo Preview | **Có thể.** Nếu Dashboard thắng: đổi Output Directory (hoặc gỡ override) trên **project dùng chung**, tác động mọi deployment, **cần chủ dự án phê duyệt riêng** |
| Rollback | Có tài liệu (`vercel-output-verification.md`): thay đổi chỉ nằm trong repo, không đổi project settings |
| Hosting thật | **NOT TESTED** |

## 4. F02 — SEO environment: **PASS**

`06-seo-environment-matrix.txt`

Claude build ba lần (`VERCEL_ENV` không đặt, `preview`, `production`) và so HTML gốc với DOM sau hydration:

| Môi trường | HTML gốc `/` | DOM sau hydration `/` | Trang khác, `/tai-khoan`, 404 | Canonical | `og:image`/`og:url` |
|---|---|---|---|---|---|
| Local | `noindex, nofollow` | 1 thẻ, **cùng giá trị** | `noindex, nofollow` | 0 | 0 |
| Preview | `noindex, nofollow` | 1 thẻ, cùng giá trị | `noindex, nofollow` | 0 | 0 |
| Production (mô phỏng) | `index, follow` | **1 thẻ, `index, follow`** | `noindex, nofollow` | 0 | 0 |

- ✔ **Không còn robots conflict.** `npm run test:seo-consistency` (chạy nguyên bản) đạt trên cả ba build. Nguyên nhân gốc đã sửa: hằng số `__APP_ENV__` do Vite tiêm lúc build, dùng chung cho prerender và client.
- ✔ Preview luôn noindex; không canonical domain chưa duyệt; Production chưa được tự kích hoạt.
- **Header `X-Robots-Tag`:** `vercel.json` đặt `noindex, nofollow` **cố định** cho mọi đường dẫn, kể cả Production. Hệ quả: **không thể index nhầm**, nhưng với build Production sẽ có **meta `index` kèm header `noindex`**, hai chính sách trái nhau. Khi mở Production phải đổi cấu hình này (3B-H2F-P3-2).
- **"Test thực sự chạy Production branch":**
  - `test:seo-consistency` chỉ kiểm theo build hiện có và **không tự build ở chế độ Production**; Claude phải build thủ công mới thấy được.
  - Khi chạy các bộ E2E chỉnh của Antigravity với `VERCEL_ENV=production` trên build Production: `2a` đạt 52/52, nhưng `2a-round02` fail 1 và `2b` fail 1, vì nhánh Production vẫn đòi canonical `bvthuyleson.vn` trong khi chính sách cố ý không phát canonical khi chưa duyệt domain (3B-H2F-P3-3).

Noindex là biện pháp SEO, **không phải** biện pháp bảo mật.

## 5. F03 — Content Audit: **PASS** (kèm lưu ý nhỏ)

`15-content-audit-check.txt`

Claude đối chiếu register với source tại Fix 01:

| Mục kiểm tra | Kết quả |
|---|---|
| Vị trí claim | ✔ Đúng: các dòng trích (`FeaturedServices.tsx:22,29,31,141`; `Footer.tsx:30,105`; `Header.tsx:38`; `MobileNav.tsx:272`; `AboutPage.tsx:276`; `BookingPage.tsx:202,455`; `FacilitiesPage.tsx:15,34,101,204,216`; `routes.tsx:159`) khớp nội dung |
| "Vô trùng" | ✔ Đính chính: không có ở 3A, do Spike tự thêm, đã REJECTED |
| "Cách ly" | ✔ Đã xóa khỏi register |
| Giờ tiếp nhận | ✔ `08:00 – 21:00`, khớp `contact.ts` |
| "24/7" | ✔ Ghi nhận đúng: còn trong Header, Footer, MobileNav và nhiều trang |
| Claim bị bỏ sót ở vòng trước | ✔ Đã thêm "theo dõi chỉ số sức khỏe liên tục" |
| Vai trò xác minh | ✔ Có cột vai trò: Chủ dự án, Bác sĩ/Giám đốc chuyên môn, Pháp chế. Không có tên cá nhân hay phê duyệt giả |
| Trạng thái | ✔ PENDING cho claim y khoa; không tự đánh dấu VERIFIED ngoài giờ mở cửa |
| Không tự sửa nội dung chính thức | ✔ Không có thay đổi trong `src/` ngoài `seo-policy.ts` |

**Lưu ý (P3):**

- Còn bỏ sót "đảm bảo tiêu chuẩn y khoa nghiêm ngặt" (`FeaturedServices.tsx:61`).
- "Giờ tiếp nhận 08:00 – 21:00" ghi VERIFIED với nguồn "User 26/10". Bằng chứng duy nhất trong repo là ghi chú trong `contact.ts` (chưa có file chỉ đạo).
- Register ghi "Tiếp nhận cấp cứu 24/24" là PENDING, trong khi Content Mapping 3B-00 (`DV-EMG-01`, `DV-EMG-03`) đánh dấu VERIFIED. Hai tài liệu mâu thuẫn; cần chủ dự án chốt.

Phân loại: (1) lỗi metadata mới của Spike: đã sạch; (2) nội dung cũ của 3A: khử khuẩn, trực đêm, theo dõi liên tục, chẩn đoán hình ảnh, nội trú 24/7, chính hãng; (3) cần chủ dự án/bác sĩ duyệt trước Production: toàn bộ nhóm (2).

## 6. F04 — Test portability: **PARTIAL**

`09-test-portability.txt`

| Hạng mục | Kết quả |
|---|---|
| Đường dẫn Playwright toàn cục hardcode | ✔ Đã bỏ trong `test-hydration-404.cjs` và `2b-verification.cjs`; `rg` không còn `C:/Users/...` trong `tests/` và `scripts/`. Còn sót ở `tests/measure-cls.cjs` (`D:/webbvct/dist`) và `scripts/test-and-capture-2b.mjs` (đường dẫn `.gemini`) — mã cũ không thuộc bộ test mới (P3) |
| Dependencies | ✔ `playwright ^1.64.1` đã vào `devDependencies` |
| Clean install | ✔ `npm ci` 132 gói, exit 0 |
| Chạy trong worktree sạch | ✘ **3B-H2F-P2-2:** `npm run test:hydration` và `test:seo-consistency` báo "Executable doesn't exist" vì Playwright 1.64.1 cần Chromium build mới, phải chạy `npx playwright install`. Lệnh này chưa có trong hướng dẫn. Sandbox của Claude chặn tải trình duyệt nên **không tái lập được bằng bản cài của repo** |
| Cách Claude chạy | Chạy **bản sao nguyên văn** của đúng các file test, với Playwright đã cài sẵn trong sandbox (qua `NODE_PATH`). Không sửa dòng nào. Kết quả ở mục 8 |
| Không cần chỉnh test bằng tay | ✔ (trong phạm vi cách chạy ở trên) |
| Test bị bỏ qua để đạt PASS | Không có test bị skip mới; 3 test E2E 3A đã được chỉnh kỳ vọng theo môi trường từ vòng trước (có cơ sở, đã nêu ở QA Hardening 02) |
| `scripts/preview-server.cjs` | ✘ **3B-H2F-P3-4:** khớp tiền tố (`startsWith`) nên **rộng hơn** `vercel.json`. `/tai-khoanabc` và `/cau-chuyenabc` trả 200 trên server này, trong khi theo `vercel.json` (regex `/tai-khoan/(.*)`) sẽ là 404. Nó cũng không mô phỏng `cleanUrls`/`trailingSlash`. Bằng chứng từ server này không phản ánh hoàn toàn Vercel |

## 7. F05 — Regression: **PASS**

`07-http-status.txt`, `08-browser-routes-hydration.txt`, `10-e2e.txt`, `11-perf.txt`, `12-visual-diff.txt`, `13-axe.txt`, `14-bundle.txt`

| Hạng mục | Kết quả |
|---|---|
| Typecheck | ✔ 0 lỗi |
| Lint | ✔ exit 0 |
| Clean build + prerender | ✔ 19 trang prerender + `__spa-fallback.html` + `404.html` |
| Route parity 21/21 | ✔ Bấm thật 6 link Header; 20 URL tải trực tiếp, 0 lỗi console (loại trừ dòng "Failed to load resource" do chính mã 404) |
| Dynamic slug | ✔ `/cau-chuyen/abc`, `/bai-viet/xyz` → 200 ComingSoon như 3A. Đây là **route pattern hợp lệ**; slug không tồn tại chưa phân biệt được (placeholder, như baseline) |
| `/tai-khoan` và `/tai-khoan/` | ✔ 200. Lưu ý: với `trailingSlash: false` trên Vercel thật, `/tai-khoan/` có thể bị 308 về `/tai-khoan` (NOT TESTED) |
| 404 local | ✔ Trả HTTP 404 có style |
| React #418 | ✔ Không có |
| Lộ dữ liệu | ✔ Không: `__spa-fallback.html` 2,2 kB, không dữ liệu |
| Visual (desktop 1440, mobile 412) | ✔ **0 pixel khác** 3A trên 10 ảnh (chụp toàn trang sau khi cuộn hết, tắt animation, ngưỡng 16/255) |
| CLS | ✔ Bằng baseline |
| Axe (WCAG 2 A/AA, 8 route × 320/412/1440) | ✔ Bằng baseline: 3 lỗi `color-contrast` có sẵn từ 3A, không thêm lỗi |
| Bundle | ⚠ JS trang chủ 132,1 kB gzip / 19 file so với 105,4 kB / 1 file (+25%), không đổi so với H02 |

**E2E 3A (4 bộ, bản đã chỉnh) trên build local/preview:** 2a 52/52, round02 24/24, round03 21/21, 2b 27/27. Cùng điều kiện khi chạy bản gốc: xem QA Hardening 02 (còn 3 test lệch do chính sách noindex).

**Mobile** (Chromium/Playwright, 412×823, DPR 2,625, CPU 4×, RTT 150 ms, 1,6 Mbps, tắt cache, 3 lần/route, trung vị; chỉ so sánh tương đối):

| Route | LCP baseline | LCP Fix 01 | FCP baseline | FCP Fix 01 |
|---|---|---|---|---|
| `/` | 3944 ms | **2928** | 3944 | 2928 |
| `/gioi-thieu` | 5064 | **4256** | 3860 | 2140 |
| `/doi-ngu` | 4160 | **2196** | 3796 | 2196 |
| `/co-so-vat-chat` | 4220 | **2132** | 3816 | 2132 |
| `/dat-lich` | 3900 | **2096** | 3900 | 2096 |

## 8. Hydration và HTTP status

**`test:hydration` (bản sao nguyên văn, 8 URL):** 8/8 PASS, `Hydration 418: CLEAN` (URL lạ, URL lồng nhau, slug, `/tai-khoan`, `/tai-khoan/`, `/tai-khoan/lich-hen`).

**Ma trận HTTP** (server mô phỏng đúng `vercel.json`):

| URL | Status |
|---|---|
| `/`, `/dich-vu`, `/bang-gia`, `/cau-chuyen`, `/tai-khoan`, `/tai-khoan/`, `/tai-khoan/x`, `/cau-chuyen/abc`, `/bai-viet/xyz` | 200 |
| `/404`, `/404.html` | **200** (P3) |
| `/dich-vu/zzz`, `/quan-ly/x`, `/khong-ton-tai`, `/a/b/c`, `/tai-khoanabc`, `/cau-chuyenabc` | 404 |

## 9. Gate A/B/C/D

| Gate | Kết luận |
|---|---|
| A — Rendering/SEO | **PASS** (local, preview, production mô phỏng) |
| B — Routing/Privacy (local) | **PASS** |
| C — Regression | **PASS** |
| D — Hosting/Social | **READY** (chỉ có nghĩa đủ điều kiện xin phép Preview; **chưa** kiểm Vercel thật; ưu tiên cấu hình NOT VERIFIED) |
| Source Integrity | **PASS** (1 ngoại lệ P2: ảnh bằng chứng 2B bị ghi đè) |

## 10. P0/P1/P2/P3

| ID | Mức | Nội dung |
|---|---|---|
| — | P0/P1 | **Không có** |
| **3B-H2F-P2-1** | P2 | Chạy `2b-verification.cjs` ghi đè 14 ảnh bằng chứng QA Mốc 2B (`docs/qa/2b-verification-evidence/`). Cách sửa: hoàn nguyên 14 file về bản của `4739d45`, và đổi `EVIDENCE_DIR` của script sang thư mục mới |
| **3B-H2F-P2-2** | P2 | `playwright@^1.64.1` mới thêm cần `npx playwright install`; chưa có trong hướng dẫn. Test trình duyệt không chạy được ngay sau `npm ci` ở môi trường mới. Đề nghị ghi vào handoff và `README`/script |
| 3B-H2F-P3-1 | P3 | `/404` và `/404.html` trả 200 vì prerender `404/index.html` (soft-404 cho đúng URL này) |
| 3B-H2F-P3-2 | P3 | `vercel.json` đặt `X-Robots-Tag: noindex` cố định, trái với meta `index` của build Production; phải tách theo môi trường khi mở index |
| 3B-H2F-P3-3 | P3 | Nhánh "production" trong E2E đòi canonical `bvthuyleson.vn`, trái chính sách (không canonical khi chưa duyệt domain); chưa có script tự build ở chế độ Production |
| 3B-H2F-P3-4 | P3 | `preview-server.cjs` rộng hơn `vercel.json` (`/tai-khoanabc` → 200) và không mô phỏng `cleanUrls`/`trailingSlash` |
| 3B-H2F-P3-5 | P3 | Content Audit Register còn thiếu "tiêu chuẩn y khoa nghiêm ngặt" (`FeaturedServices.tsx:61`); mâu thuẫn trạng thái "cấp cứu 24/24" với Content Mapping 3B-00 |
| 3B-H2F-P3-6 | P3 | JS trang chủ +25% gzip; `robots.txt`/`sitemap.xml` còn dùng `bvthuyleson.vn` (domain chưa duyệt); còn đường dẫn máy ở `tests/measure-cls.cjs`, `scripts/test-and-capture-2b.mjs` (mã cũ) |

## 11. Preview blockers

**Không có blocker kỹ thuật bắt buộc** để *xin phép* Preview. Điều kiện nên làm trước:

1. Hoàn nguyên 14 ảnh 2B (P2-1). Việc này tạo commit mới; Preview nên lấy từ commit sau khi hoàn nguyên.
2. Ghi bước `npx playwright install` vào hướng dẫn (P2-2).
3. Chủ dự án quyết định có cho **đổi project settings Vercel dùng chung** nếu Dashboard ghi đè `vercel.json` hay không (xem mục 12).

## 12. Hosting limitations

- Chưa có deployment: HTTP 404, rewrite, header, `cleanUrls`, `trailingSlash`, thứ tự ưu tiên cấu hình đều **NOT TESTED**.
- Preview được bảo vệ bởi Deployment Protection: social crawler không đọc được, nên **không kiểm được social preview**; ảnh OG hiện cũng chưa có.
- Cách tạo Preview (chủ dự án quyết định): Claude không tạo Preview, không đổi project settings, không tắt Deployment Protection.

## 13. Migration recommendation

- **Kỹ thuật:** Framework Mode `ssr: false` + prerender đạt mọi tiêu chí local: route parity, hydration, SEO theo môi trường, giao diện, axe, hiệu năng.
- **Nên làm:** xin phép **một** Preview có bảo vệ để kiểm tra phần còn lại (hosting thật). Sau đó đánh giá migration.
- **Đánh đổi:** JS +25% và cấu hình theo môi trường phải quản lý. Giữ Vite SPA vẫn là phương án ít thay đổi nhất. Quyết định thuộc chủ dự án.
- **3B-01:** nếu chọn migration, làm trước khi viết `/dich-vu` và `/bang-gia`.

## 14. Kết luận cuối

**PASS WITH FIXES · READY FOR PREVIEW** (đủ điều kiện xin phép, không phải đã được phép).

Claude không tự phê duyệt migration, deployment hay 3B-01.

**ARCHITECTURE SPIKE 01 — HARDENING 02 FIX 01 PENDING OWNER DECISION**
