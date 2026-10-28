# ARCHITECTURE SPIKE 01 — HARDENING 02 — Independent QA (CEO Directive 055-B)

- **QA:** Claude (Independent Architecture QA Lead). Chỉ đọc Git và chạy thử trong worktree riêng; không sửa nhánh spike, không merge, không deploy.
- **Ngày:** 28/10/2026
- **Đối chiếu:** `docs/qa/architecture-spike-01-hardening-01-qa.md` (commit `638092a`)
- **Bằng chứng:** `docs/qa/evidence/architecture-spike-01-hardening-02/` (01–15 và `scripts/`)
- **Quy ước:** **[VERIFIED]** = Claude tự kiểm. **[SELF-REPORTED]** = chỉ có trong báo cáo của Antigravity. Mọi kiểm thử HTTP là **server tĩnh cục bộ mô phỏng `vercel.json`**, không phải Vercel thật.

## Kết luận: **PASS WITH FIXES** · **NOT READY FOR PREVIEW**

**Không còn P0/P1.** Các lỗi chặn của Hardening 01 đã đóng:

- P1 metadata Content Lock: hai claim bị loại; không còn claim mới trong metadata.
- Lỗi hydration #418 trên trang 404: không còn.
- Route động và `/tai-khoan`, `/tai-khoan/`: trả đúng như baseline.
- Giao diện 0 pixel khác 3A; axe không tệ hơn baseline; CLS bằng baseline; LCP mobile nhanh hơn.

**Vẫn chưa sẵn sàng tạo Preview** vì Gate D chưa đạt:

- Tài liệu của Antigravity khẳng định `vercel.json` đã có `outputDirectory: "build/client"`, `cleanUrls`, `trailingSlash`. **File thực tế không có các khóa này.**
- Project Vercel vẫn đặt `vite` / `dist`.
- Nếu tạo Preview ngay, build sẽ ra sai thư mục.

Còn các P2 khác, đáng chú ý nhất là chính sách SEO cho Production có lỗi (xem 3B-H2-P2-2). Phần đó **chưa được kích hoạt** nên chưa gây hại ở Preview.

Claude không tự phê duyệt migration, deployment hay 3B-01.

---

## 1. Branch và SHA

| Mục | Giá trị |
|---|---|
| Branch | `spike/architecture-01-hardening-02` |
| Commit triển khai | `5e00b9ae5dadf41ef7026fac37beb0e7a34ad263` |
| HEAD | `bacc62a` (commit cuối chỉ ghi SHA vào handoff) |
| Parent | `0be4278…` (Hardening 01) ✔ |
| Diff vs Hardening 01 | 27 file, +1379 / −82 |

## 2. Source integrity: **PASS**

`01-source-integrity.txt`, `02-vercel-readonly.txt`

| Kiểm tra | Kết quả |
|---|---|
| Xuất phát đúng Hardening 01, 2 commit | ✔ [VERIFIED] |
| Không merge `main` | ✔ `main` = `d2a19c5`, không chứa H02 |
| Không sửa baseline 3A | ✔ Nhánh 3A không đổi; trong `src/` có `src/hooks/useRouteSeo.ts` (đã sửa từ H01) và `src/config/seo-policy.ts` (mới) |
| Không sửa 3B-00 | ✔ `docs/phase-3b-00` vẫn `32b8a0a` |
| Deployment mới | ✔ Không có: mới nhất vẫn `dpl_8XZEtH3…` / `4739d45` |
| Production, domain, Git Integration | ✔ Production `dpl_BAz378…` / `db78738`; không đổi domain; `project.link` trống; Deployment Protection vẫn bật |
| Cấu hình project Vercel | Không đổi: `vite` / `dist` |

## 3. H07 — Metadata & Content Lock: **PASS** cho metadata mới

`05-prerender-head-and-term-scan.txt`

| Kiểm tra | Kết quả |
|---|---|
| "vô trùng" (`/co-so-vat-chat`) và "hiện đại" (`/`) | ✔ Đã loại bỏ [VERIFIED qua build output] |
| Claim mới trong metadata | ✔ Không có. Claude quét 26 chuỗi cấm/rủi ro trên title, description và `og:*` của toàn bộ HTML build. Các trang do Hardening viết lại chỉ gồm tên bệnh viện, địa chỉ và hotline lấy từ `HOSPITAL_CONTACT` |
| HTML gốc và hydrated DOM | ✔ Nhất quán trên mọi route có prerender (title, description, robots) |
| Canonical / domain chưa duyệt | ✔ 0 canonical; 0 `lesonpet.vn` |
| OG tham chiếu file không tồn tại | ✔ 0 `og:image` / `og:url` |
| Cơ chế head chồng nhau | ✔ Không. Mỗi trang đúng 1 `<title>`, 1 `description`, 1 `robots` ở trạng thái Preview/local |
| Content Evidence Gate | Một phần, xem mục 8 |

**Còn 3 hit trong metadata của các trang ComingSoon có từ baseline 3A (không phải lỗi mới của Hardening):**

- `/dich-vu/noi-tru`: "Chăm sóc nội trú **24/7**".
- `/san-pham`: "sản phẩm **chính hãng** chọn lọc".
- Cả hai nằm sẵn trong tiêu đề/mô tả 3A và vẫn được đánh dấu `noindex`.
- Xem H-P2-6 (Content Audit).

## 4. H08 — 404 hydration: **PASS** (local)

`07-hydration-routes-browser.txt`

- **Phương pháp:**
  - Tự chạy Chromium trên server mô phỏng `vercel.json`.
  - Mở trực tiếp URL không tồn tại, URL lồng nhau, điều hướng client tới URL lạ, refresh, và nút Back.
  - Đếm lỗi console và `pageerror`.
- **Kết quả:**
  - ✔ **Không còn React #418.** Các trang 404 đều trả HTTP 404, hiển thị 404 có style, không có `pageerror`.
  - ✔ Chỉ còn dòng console "Failed to load resource: 404" do tài liệu có mã 404, là hành vi bình thường của trình duyệt.
  - ✔ Điều hướng client tới `/trang-khong-co/lop-2`, refresh, Back: đều đúng, 0 lỗi.
  - ✔ Nguyên nhân gốc đã xử lý đúng chỗ: route `static-404.tsx` bị xóa, chỉ còn `route('*')`; không phải workaround che console. Claude xác nhận bằng mã nguồn và bằng việc lỗi không còn trên 4 URL từng lỗi.
- **Giới hạn:** chưa kiểm HTTP 404 trên Vercel thật (NOT TESTED).
- **Lưu ý:** `tests/spike/test-hydration-404.cjs` của Antigravity hardcode `require('C:/Users/Admin/AppData/Roaming/npm/node_modules/playwright')` (lỗi `MODULE_NOT_FOUND` trên máy khác). Claude sửa trên **bản sao** ngoài repo, chạy được 8/8 PASS.

## 5. H09 — Route parity: **PASS**

`06-http-status.txt`, `07-hydration-routes-browser.txt`

| Route / hành vi | Baseline 3A | Hardening 02 | Kết quả |
|---|---|---|---|
| 21/21 route path | ✔ | ✔ | ✔ [Claude tự trích; Hardening 01 đã đạt, không thay đổi] |
| Direct URL / Refresh | 200 | 200 | ✔ |
| Header navigation (6 link bấm thật) | ok | ok | ✔ |
| `/cau-chuyen/:slug`, `/bai-viet/:slug` (ví dụ `/cau-chuyen/abc`) | 200 ComingSoon | **200 ComingSoon** (rewrite → `__spa-fallback.html`) | ✔ Đã sửa |
| `/tai-khoan` và `/tai-khoan/` | 200 | **200** (có prerender riêng) | ✔ Đã sửa |
| `/tai-khoan/x` | 200 | 200 | ✔ |
| `/quan-ly/*` | NotFound | **404** | ✔ khớp |
| URL không tồn tại | NotFound (200) | **404** + trang 404 | ✔ (cải thiện) |
| Layout | ComingSoon/Portal | Giống 3A | ✔ 0 pixel khác ở 5 route đối chiếu |

**Lưu ý (P3):** rewrite `/cau-chuyen/(.*)` và `/bai-viet/(.*)` trả **200 cho mọi slug**, kể cả slug không tồn tại. Với placeholder ComingSoon hiện tại thì giống baseline. Khi có nội dung thật, slug không tồn tại sẽ thành soft 404, cần được kiểm tra lại lúc đó.

## 6. H10 — SEO environment policy: **PARTIAL**

`09-production-env-simulation.txt`, `08-e2e.txt`

| Kiểm tra | Kết quả |
|---|---|
| Local/Spike noindex | ✔ HTML gốc và DOM sau hydration đều `noindex, nofollow` |
| Preview noindex trong HTML gốc | ✔ Build với `VERCEL_ENV=preview` → `noindex, nofollow` cho mọi trang |
| Production tự kích hoạt | ✔ Không. `vercel.json` vẫn đặt `X-Robots-Tag: noindex` cho **mọi** đường dẫn |
| Canonical dùng domain chưa duyệt | ✔ Không |
| Preview Authentication | ✔ Không bị tắt (Deployment Protection vẫn `all`) |
| Private routes không lộ dữ liệu | ✔ `__spa-fallback.html` 2,2 kB, không có dữ liệu |
| Test tự động | ✔ `npm run test:seo` đạt. Lưu ý: chỉ là unit test hàm chính sách, không phải kiểm thử trên build |
| **Lỗi chính sách cho Production** | ✘ **3B-H2-P2-2:** Claude build với `VERCEL_ENV=production` rồi mở bằng Chromium. HTML gốc của `/` ghi `index, follow`, nhưng sau hydration trang có **hai thẻ robots mâu thuẫn**: `index, follow` **và** `noindex, nofollow`. Nguyên nhân: `getAppEnvironment()` đọc `process.env.VERCEL_ENV` lúc build, nhưng trình duyệt chỉ đọc `VITE_VERCEL_ENV`, nên client luôn là "local". Khi chủ dự án mở Production, trang chủ sẽ bị đặt noindex mâu thuẫn |

Noindex là biện pháp SEO, **không phải** biện pháp bảo mật. Bảo mật dữ liệu dựa vào việc không prerender dữ liệu riêng tư, và Deployment Protection.

## 7. H11 — Vercel readiness: **NOT READY**

`03-build.log`, `14-vercel-config-and-paths.txt`

| Hạng mục | Kết quả |
|---|---|
| Clean build | ✔ `npm ci` + build thành công; 19 trang prerender + `__spa-fallback.html` |
| Output structure, `404.html`, asset paths | ✔ `build/client/404.html` do `postbuild.cjs` sinh; đường dẫn tương đối |
| Catch-all gây soft 404 | ✔ Không có rewrite catch-all; chỉ 3 rewrite hẹp |
| **`outputDirectory`** | ✘ **3B-H2-P2-1:** `vercel.json` thực tế **không có** `outputDirectory`, `cleanUrls` hay `trailingSlash`, trong khi `handoff.md`, `hardening-02-summary.md` và `vercel-readiness.md` đều khẳng định đã thêm. Project Vercel đang là `vite` / `dist` |
| Rollback plan | Có tài liệu (`vercel-readiness.md`), nhưng dựa trên cấu hình chưa tồn tại |
| Hosting thật | **NOT TESTED** |

## 8. H12 — Regression: **PASS** (kèm lưu ý E2E)

`04-typecheck-lint.txt`, `08-e2e.txt`, `10-perf.txt`, `11-visual-diff.txt`, `12-axe.txt`, `13-bundle.txt`

| Hạng mục | Kết quả |
|---|---|
| Typecheck | ✔ 0 lỗi |
| Lint | ✔ exit 0 |
| Hydration / console | ✔ 0 lỗi trên 20 route; trang 404 chỉ có dòng "Failed to load resource" |
| **E2E** (4 bộ 3A: 2a, round02, round03, 2b) | Bộ test **đã được Antigravity chỉnh** chạy trên H02: 52/52, 24/24, 21/21, 27/27 (không fail) |
| **Test bị chỉnh** | 3 test được sửa kỳ vọng thành "nếu `VERCEL_ENV=production` thì index, nếu không thì noindex". Đây là điều chỉnh có cơ sở cho Preview, **không phải bỏ test**. Nhưng nhánh `production` **không bao giờ được chạy** (không đặt `VERCEL_ENV` khi chạy test). Khi Claude chạy bản **gốc** (3A) trên build Production: 2a và 2b vẫn fail 1 test mỗi bộ (thiếu canonical, robots) |
| Visual diff (desktop 1440, mobile 412) | ✔ **0 pixel khác** trên 10 ảnh. Phương pháp: chụp toàn trang sau khi cuộn hết, tắt animation, ngưỡng 16/255 |
| CLS | ✔ Bằng baseline |
| Mobile LCP | ✔ Cải thiện (bảng dưới) |
| Responsive | ✔ 320, 412, 1440 (axe); visual 412 và 1440. 768/1024: NOT TESTED |
| **Accessibility (axe-core 4.10.2, WCAG 2 A/AA, 8 route × 3 viewport)** | ✔ **Giống baseline**: 3 rule vi phạm (`color-contrast` ×3 node) ở `/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat`, đều có sẵn ở 3A. Hardening không thêm lỗi nào. Chưa kiểm bằng screen reader (NOT TESTED) |
| Bundle | ⚠ JS trang chủ **132,3 kB gzip / 19 file** so với **105,4 kB / 1 file** (+25%); HTML 74 kB so với 1,6 kB |

**Đo mobile** (Chromium/Playwright, server tĩnh cục bộ, 412×823 DPR 2,625, CPU 4×, RTT 150 ms, 1,6 Mbps, tắt cache, 3 lần/route, lấy trung vị; script `scripts/perf.cjs`; chỉ so sánh tương đối):

| Route | LCP baseline | LCP H02 | FCP baseline | FCP H02 |
|---|---|---|---|---|
| `/` | 4012 ms | **2952** | 4012 | 2952 |
| `/gioi-thieu` | 5024 | **4260** | 3836 | 2120 |
| `/doi-ngu` | 4172 | **2204** | 3772 | 2204 |
| `/co-so-vat-chat` | 4152 | **2144** | 3840 | 2144 |
| `/dat-lich` | 3896 | **2096** | 3896 | 2096 |

## 9. Content Audit Register (Antigravity): **PARTIAL — có thông tin sai**

`15-content-audit-check.txt`

Mục đích đúng: tách claim khỏi metadata công khai, ghi điều kiện để được index. Nhưng Claude đối chiếu với source 3A thì phát hiện **register ghi sai thực tế**:

| Register ghi | Source 3A thực tế |
|---|---|
| "Vô trùng" nằm trong `facilities.tsx` (mô tả phòng mổ) | **Không có** trong source 3A; chuỗi này do chính metadata Hardening 01 thêm vào |
| "Khử khuẩn", "buồng cách ly" ở `facilities.tsx` | "khử khuẩn" nằm ở `FeaturedServices.tsx` (trang chủ); "cách ly" **không tồn tại** |
| "Trực đêm" ở `facilities.tsx` | Nằm ở `FeaturedServices.tsx` |
| Giờ tiếp nhận chính thức "08:00 – 20:00" | `HOSPITAL_CONTACT`: **08:00 – 21:00** (sai giờ) |
| "24/7 đã loại khỏi Header/Footer" | Header, Footer và MobileNav **vẫn còn** "Chăm sóc nội trú 24/7" |
| Gate C "PASS 100%, không một tuyên bố chưa xác thực nào lọt vào dữ liệu có thể lập chỉ mục" | Metadata mới đạt; nhưng các trang prerender của 3A vẫn chứa claim trong HTML gốc (xem dưới) |

Ngoài ra register **chưa** nêu: ai có thẩm quyền xác minh từng claim theo vai trò (Chủ dự án/Bác sĩ, theo DEC-13), và vẫn thiếu một số claim có thật như "theo dõi chỉ số sức khỏe liên tục". Không thấy phê duyệt giả và không có nội dung chính thức nào bị tự sửa.

**Phân loại claim:**

1. **Lỗi metadata mới của Spike:** đã sạch.
2. **Nội dung cũ của 3A:** "khử khuẩn định kỳ", "theo dõi chỉ số sức khỏe liên tục", "đội ngũ y tế trực đêm" (`FeaturedServices.tsx`); "chẩn đoán hình ảnh" (`FacilitiesPage`); "nội trú 24/7" (Header/Footer/MobileNav, metadata của `/dich-vu/noi-tru`); "chính hãng" (`/san-pham`).
3. **Cần chủ dự án/bác sĩ duyệt trước Production:** toàn bộ nhóm 2, theo DEC-04/07/08. Claude không đánh giá các nội dung này là VERIFIED. Prerender làm các claim này nằm trong HTML gốc mà crawler đọc được.

## 10. HTTP status matrix (server mô phỏng `vercel.json`)

`06-http-status.txt`

| URL | Status |
|---|---|
| `/`, `/gioi-thieu`, `/dich-vu`, `/dich-vu/noi-tru`, `/bang-gia`, `/cau-chuyen`, `/lien-he`, `/dang-nhap` | 200 |
| `/cau-chuyen/abc`, `/bai-viet/xyz` | 200 (SPA fallback) |
| `/tai-khoan`, `/tai-khoan/`, `/tai-khoan/x` | 200 |
| `/quan-ly/x`, `/khong-ton-tai`, `/a/b/c` | **404** |

## 11. P0/P1/P2/P3

| ID | Mức | Nội dung |
|---|---|---|
| — | P0/P1 | **Không có** |
| **3B-H2-P2-1** | P2 | `vercel.json` thiếu `outputDirectory`, `cleanUrls`, `trailingSlash`, trong khi 3 tài liệu khẳng định đã có; project Vercel vẫn `vite`/`dist`. **Chặn Preview.** Cách sửa: thêm `outputDirectory` (hoặc chủ dự án đổi project settings), và đính chính tài liệu |
| **3B-H2-P2-2** | P2 | Chính sách SEO cho Production sai: client luôn là "local", gây hai thẻ robots mâu thuẫn khi build Production. Chưa kích hoạt nên chưa gây hại. Cần sửa trước khi mở index (ví dụ đọc môi trường từ một giá trị inject lúc build, dùng chung cho server và client) |
| 3B-H2-P2-3 | P2 | Content Audit Register ghi sai vị trí, giờ mở cửa và trạng thái "24/7 đã gỡ"; thiếu cột vai trò xác minh |
| 3B-H2-P2-4 | P2 | Claim cũ của 3A (khử khuẩn, trực đêm, chẩn đoán hình ảnh, nội trú 24/7, chính hãng) nằm trong HTML prerender; cần chủ dự án/bác sĩ xử lý ở nguồn trước Production |
| 3B-H2-P2-5 | P2 | `test-hydration-404.cjs` (và vài script cũ) hardcode đường dẫn máy `C:/Users/Admin/...`, lặp lại lỗi đã được nêu ở H01 |
| 3B-H2-P3-1 | P3 | Test E2E đã chỉnh có nhánh `production` chưa bao giờ được chạy |
| 3B-H2-P3-2 | P3 | Rewrite `/cau-chuyen/(.*)`, `/bai-viet/(.*)` trả 200 cho mọi slug (soft 404 khi có nội dung thật) |
| 3B-H2-P3-3 | P3 | JS trang chủ +25% gzip (132 kB, 19 file); handoff không nêu số này |
| 3B-H2-P3-4 | P3 | `robots.txt`/`sitemap.xml` vẫn dùng `bvthuyleson.vn` (domain chưa duyệt, có từ 3A); handoff nói "13 trang prerender" nhưng thực tế 19 |
| 3B-H2-P3-5 | P3 | Cảnh báo future-flag React Router v8; cảnh báo `envFile` deprecated |

## 12. Remaining blockers

1. 3B-H2-P2-1: cấu hình output Vercel (chặn Preview).
2. 3B-H2-P2-2: chính sách SEO Production (chặn việc mở index, không chặn Preview).
3. Chủ dự án/bác sĩ duyệt nội dung 3A (3B-H2-P2-4).
4. Hosting thật: HTTP 404, rewrite, social preview: **NOT TESTED**.

## 13. Migration recommendation

- **Kỹ thuật:** Hardening 02 chứng minh Framework Mode `ssr: false` + prerender chạy đúng với codebase 3A: route parity, hydration, giao diện, hiệu năng, axe.
- **Điều kiện còn lại** để đề xuất migration:
  1. Sửa vài mục P2 ở trên (chủ yếu là cấu hình).
  2. Kết quả kiểm thử hosting thật trên một Preview.
- **Đánh đổi:** thêm 25% JS và việc tự quản lý cấu hình Vercel/robots theo môi trường. Giữ Vite SPA vẫn là phương án ít thay đổi nhất, và chưa có SEO/social preview thật cho tới khi migration. Quyết định thuộc chủ dự án.
- **3B-01:** nếu chọn migration, nên làm trước khi viết `/dich-vu` và `/bang-gia`.

## 14. Preview recommendation: **NOT READY FOR PREVIEW**

Chỉ còn một blocker thật sự: cấu hình output Vercel.

Điều kiện để chuyển sang READY:

1. Thêm `outputDirectory: "build/client"` vào `vercel.json` (hoặc chủ dự án đổi project settings) và đính chính tài liệu.
2. Xác nhận bằng lần build sạch.
3. Chủ dự án cấp phép riêng cho **một** Preview, giữ Deployment Protection bật.
4. Sau Preview, Claude kiểm HTTP 404, rewrite và header trên URL thật bằng quyền được bảo vệ; social preview chỉ kiểm được khi có URL công khai được cho phép.

## 15. Ma trận QA

| Gate | Kết luận |
|---|---|
| A — Rendering/SEO | **PASS** cho phạm vi Local/Preview (chính sách Production chưa được kích hoạt và còn lỗi, xem P2-2) |
| B — Routing/Privacy (local) | **PASS** |
| C — Performance/Regression | **PASS** |
| D — Hosting/Social | **NOT READY** (cấu hình output; chưa kiểm hosting thật) |
| Source Integrity | **PASS** |

**Kết luận cuối: PASS WITH FIXES · NOT READY FOR PREVIEW.**

Claude không tự phê duyệt migration, deployment hay 3B-01.

**ARCHITECTURE SPIKE 01 — HARDENING 02 PENDING OWNER DECISION**
