# ARCHITECTURE SPIKE 01 — HARDENING 01 — Independent QA (CEO Directive 052-B)

- **QA:** Claude (Independent Architecture QA Lead). Chỉ đọc Git và chạy thử trong worktree riêng; không sửa nhánh spike, không merge, không deploy.
- **Ngày:** 28/10/2026
- **Đối chiếu:** `docs/qa/architecture-spike-01-qa.md` (commit `8b410c5`)
- **Bằng chứng:** `docs/qa/evidence/architecture-spike-01-hardening-01/` (01–10 và `scripts/`)
- **Quy ước:** **[VERIFIED]** = Claude tự kiểm. **[SELF-REPORTED]** = chỉ có trong báo cáo của Antigravity. Mọi kiểm thử HTTP là **server tĩnh cục bộ mô phỏng**, không phải Vercel thật.

## Kết luận: **FAIL** (còn 1 lỗi P1, sửa được trong vài dòng) · **NOT READY FOR PREVIEW**

Hardening 01 giải quyết **phần lớn** các lỗi của vòng trước:

- Đủ 21/21 route.
- Một nguồn head duy nhất; HTML gốc khớp DOM sau hydration.
- Không còn domain lạ, ảnh OG hỏng hay canonical sai.
- `404.html` được build tự động, không hardcode đường dẫn máy.
- Giao diện vẫn khớp 3A đến từng pixel, hiệu năng mobile vẫn tốt hơn baseline.

**Blocker còn lại (P1):** metadata mới của Hardening **tự thêm claim bị cấm**.

- `/co-so-vat-chat`: "môi trường **vô trùng** chuẩn y khoa" (từ này nằm trong danh sách claim đã gỡ ở 3A).
- Trang chủ: "cơ sở vật chất **hiện đại**".

Đây là lỗi nội dung của metadata, **không phải lỗi kiến trúc**. Sau khi sửa hai chuỗi này, Claude dự kiến đánh giá lại là **PASS WITH FIXES**, kèm các P2 ở mục 11.

Claude không phê duyệt migration, deployment hay 3B-01.

---

## 1. Branch và SHA

| Mục | Giá trị |
|---|---|
| Branch | `spike/architecture-01-hardening-01` |
| Commit | `0be427862fe78961f1ce6ab29db49eb86ac6cc75` (2026-10-28 14:25 +0700) |
| Parent | `0dba2f3983513ee549521a961fbdfd8c7445fae4` ✔ |
| Baseline 3A | `4739d45` (là tổ tiên) ✔ |
| Diff so với Spike | 38 file, +1186 / −966 |

## 2. Source integrity: **PASS**

`01-source-integrity.txt`, `02-vercel-readonly.txt`

| Kiểm tra | Kết quả |
|---|---|
| Xuất phát đúng Spike SHA, 1 commit | ✔ [VERIFIED] |
| Không merge `main` | ✔ `main` = `d2a19c5`, không chứa hardening |
| Không sửa baseline 3A | ✔ Nhánh 3A không đổi; trong `src/` chỉ sửa `src/hooks/useRouteSeo.ts` (có chủ đích, xem mục 4) |
| Không sửa tài liệu 3B-00 | ✔ `docs/phase-3b-00` vẫn `32b8a0a` |
| Deployment mới | ✔ Không có: mới nhất vẫn `dpl_8XZEtH3…` / `4739d45` (trước commit) |
| Production | ✔ không đổi `dpl_BAz378…` / `db78738` |
| Domain, Git Integration | ✔ không đổi (`project.link` trống); Deployment Protection vẫn bật |
| Cấu hình project Vercel | ✔ không đổi, vẫn `vite` / `dist`. Xem Gate D |
| Việc "không đụng workspace chính" | [SELF-REPORTED] |

## 3. H01 — Route parity: **PASS** (kèm 3 điểm lệch)

`06-routes-http-browser.txt`

- **Phương pháp:**
  - Claude tự trích 21 `path` từ `src/app/routes.tsx` của baseline và `app/routes.ts` của hardening.
  - Với mỗi route, tải trực tiếp bằng Chromium trên cả hai bản và so sánh trạng thái, `<title>`, h1, nội dung "Không tìm thấy".
  - Header navigation được bấm bằng chuột (client navigation).
- **Kết quả:**
  - ✔ 21/21 route có mặt. 13 route bị mất ở vòng trước đã được khôi phục.
  - ✔ Direct URL và client navigation đều đạt. Bấm 6 link Header đều đến đúng trang, không còn "Không tìm thấy".
  - ✔ Route lồng nhau (`/dich-vu/*`) đúng.
  - ✔ `/quan-ly/*` đã bị gỡ khỏi spike, khớp 3A (baseline cũng không có route này).
  - ✔ Các trang ComingSoon hiển thị đúng như baseline.
- **Lệch so với 3A** (xem mục 11):
  - `/cau-chuyen/:slug` và `/bai-viet/:slug`: mở trực tiếp URL **trả 404** (HTTP 404, HTML 404), sau đó client chuyển sang giao diện ComingSoon. Baseline trả 200 ComingSoon. Nguyên nhân: không có rewrite cho hai mẫu động này.
  - `/tai-khoan` (không có dấu `/` đuôi): rewrite `/tai-khoan/(.*)` không khớp, nên trả **404**. Baseline `/tai-khoan/*` khớp cả hai.
  - Mọi lần tải 404 đều gây **lỗi hydration** (xem mục 6).

## 4. H02 — SEO head: **PASS** (một nguồn duy nhất, nhất quán)

`05-prerender-head.txt`, `06-routes-http-browser.txt`

| Yêu cầu | Kết quả |
|---|---|
| Chỉ một nguồn metadata | ✔ `meta()` của từng route. `useRouteSeo` được thu gọn: chỉ còn cập nhật vùng thông báo `#sr-announcer`, không chạm `<head>` [VERIFIED, đọc mã] |
| Title và description: HTML gốc so với DOM sau hydration | ✔ Khớp trên mọi route (chỉ khác ở mã hóa `&amp;`); 0 route bị ghi đè |
| Canonical, `og:url`, `og:image` | ✔ Đã **bỏ** (0 xuất hiện). Không còn `lesonpet.vn`; không còn ảnh OG trỏ file không tồn tại |
| Robots trong HTML gốc | ✔ `noindex, nofollow` có trong HTML gốc của tất cả 17 trang đã prerender, kể cả `404.html` |
| Metadata sai giữa route | ✔ Không có: mỗi route có title/description riêng |
| React 19 | ✔ React 19.3.1, react-router 7.18.5; không cần `react-helmet-async` |
| `robots.txt`, `sitemap.xml` | **Còn** dùng `bvthuyleson.vn`, domain chưa được chủ dự án duyệt (có từ baseline 3A, không phải lỗi mới; ghi P3) |

**Đánh đổi cần chủ dự án biết:** bỏ canonical và OG là hợp lý khi chưa có domain, nhưng khi đó chưa có social preview thật. Phải bổ sung trước khi mở index.

## 5. H03 — Content Evidence Gate: **FAIL** (1 lỗi P1 mới)

`10-content-gate.txt`

**Lỗi mới do Hardening tự viết trong metadata:**

| Route | Chuỗi | Vi phạm |
|---|---|---|
| `/co-so-vat-chat` (title, description, og) | "**môi trường vô trùng chuẩn y khoa**" | Claim cơ sở vật chất bị cấm ở 3A; DEC-07 còn mở; 3B-00 liệt kê rõ từ này |
| `/` | "**cơ sở vật chất hiện đại**… dịch vụ y tế chuẩn mực… hệ sinh thái y tế chất lượng cao" | Claim chất lượng/thiết bị chưa được xác minh |
| `/` | "Đội ngũ y bác sĩ tận tâm" | Mức độ nhẹ, mô tả thái độ, chưa có căn cứ |
| `/gioi-thieu` | "tầm nhìn, sứ mệnh y khoa và **cam kết** đồng hành" | Từ "cam kết" chưa được duyệt (nhẹ) |
| `/doi-ngu` | "đội ngũ bác sĩ và nhân sự y tế **phụ trách chuyên môn**" | Chuyên môn chưa được xác minh (nhẹ) |

**Đã sạch:** các claim của vòng trước ("giàu kinh nghiệm", "uy tín", "phòng chẩn đoán hình ảnh", "khu lưu trú tiện nghi") đã được gỡ khỏi metadata. Giá và dịch vụ chưa duyệt không xuất hiện. Không có Schema.org JSON-LD trong build (0), nên chưa có rủi ro Offer. Hotline `097 355 51 05` lấy từ `HOSPITAL_CONTACT` ✔.

**Vấn đề của baseline 3A, không phải do Hardening, nhưng cần ghi nhận (prerender làm nó hiện ra trong HTML gốc cho crawler):**

- Trang chủ: "vệ sinh **khử khuẩn** định kỳ", "đội ngũ y tế **trực đêm**" (`FeaturedServices.tsx`).
- `/co-so-vat-chat`: "chẩn đoán hình ảnh" (`FacilitiesPage.tsx`).
- Trang chủ: câu chuyện ca bệnh ở `HighlightStory.tsx`.
- Cụm "24/7" có ở 8 file nguồn.
- Các nội dung này đã tồn tại ở 3A; Claude không nâng thành lỗi mới của Hardening. Khi prerender, nội dung trở thành **HTML tĩnh mà crawler đọc được**, nên nên xử lý trước khi mở index.

## 6. H04 — 404 & hosting kỹ thuật: **PARTIAL**

`03-build.log`, `06-routes-http-browser.txt`

| Hạng mục | Kết quả |
|---|---|
| Clean build tạo `404.html` | ✔ [VERIFIED] `scripts/postbuild.cjs` sinh `build/client/404.html`; build chạy `react-router build && node scripts/postbuild.cjs` |
| Không hardcode đường dẫn máy | ✔ Test và postbuild dùng đường dẫn tương đối. Trên máy Claude, `tests/spike/test-routing-spike.cjs` chạy được và đạt toàn bộ |
| 404 cục bộ trả HTTP 404 | ✔ Trên server mô phỏng (cùng quy tắc `vercel.json`): `/khong-ton-tai`, `/quan-ly/x`, `/dich-vu/x` đều 404 với trang 404 có style |
| Route hợp lệ không lỗi | ✔ 17 route prerender + `/tai-khoan/*` trả 200 |
| `vercel.json` không catch-all sai | ✔ Đã bỏ rewrite `/(.*) → /index.html`. Chỉ còn rewrite `/tai-khoan/(.*) → /__spa-fallback.html` |
| Robots/noindex không bị mất | ✔ Header `X-Robots-Tag: noindex, nofollow` cho mọi đường dẫn + meta trong HTML gốc |
| **Lỗi hydration trên mọi trang 404** | ✘ [VERIFIED, lặp lại ở 4 URL] Khi mở `/khong-ton-tai`, `/quan-ly/x`, `/cau-chuyen/abc`, `/bai-viet/xyz`: **React error #418** (hydration mismatch) trong console. Trang phục hồi bằng render phía client, nhưng đây là lỗi console người dùng có thể thấy. Nguyên nhân khả dĩ: HTML 404 được prerender từ route `/404`, còn client khớp route `*` hoặc `:slug` khác. Claude không xác định nguyên nhân gốc |
| Production index | ✘ Header noindex `/(.*)` áp cho **mọi** đường dẫn, kể cả Production. Khi mở index (3B-01 trở đi) bắt buộc đổi cấu hình theo môi trường. Chưa có cơ chế theo môi trường được nêu |
| Hosting thật | **NOT TESTED**: không có deployment |

## 7. H05 — Performance & regression: **PASS** (kèm lưu ý)

`04-typecheck-lint.txt`, `07-perf.txt`, `08-visual-diff.txt`, `09-e2e.txt`

| Hạng mục | Kết quả |
|---|---|
| Clean build (`npm ci` + build) | ✔ PASS |
| Typecheck | ✔ 0 lỗi |
| Lint (oxlint) | ✔ exit 0. Rule `only-export-components` nay chỉ tắt cho `app/routes/**` (đã thu hẹp, đúng yêu cầu vòng trước) |
| Console / hydration | ✔ 0 lỗi trên 17 route hợp lệ. ✘ Lỗi #418 trên trang 404 (mục 6) |
| **E2E 3A** (4 bộ: 2a, round02, round03, 2b) | 2a: 51/52 pass; round02: 23/24; round03: 21/21; 2b: 26/27 (baseline: 100% pass). **3 test fail**, đều liên quan đến việc Hardening cố ý đặt `noindex` cho trang chủ và bỏ canonical: "trang chủ không được có noindex", "trang chủ có canonical gốc", "robots index". Đây là **thay đổi chính sách có chủ đích**, không phải lỗi giao diện, nhưng bộ test 3A cần cập nhật hoặc cần chế độ theo môi trường |
| Visual diff (desktop 1440, mobile 412) | ✔ **0 pixel khác** trên 5 route chung. Phương pháp: chụp toàn trang sau khi cuộn hết để ảnh lazy tải xong, tắt animation, ngưỡng 16/255 |
| CLS | ✔ Bằng baseline (0,0000; `/dat-lich` 0,0010 ở cả hai) |
| LCP/FCP mobile | ✔ Cải thiện, xem bảng |
| Responsive | ✔ 412 và 1440. 320/768/1024: NOT TESTED |
| Accessibility | NOT TESTED (chưa chạy axe/screen reader). Có `lang="vi"`, 1 h1, skip-link trong HTML gốc [VERIFIED ở vòng trước] |

**Đo mobile** (Chromium/Playwright, server tĩnh cục bộ, mobile 412×823 DPR 2,625, CPU 4×, RTT 150 ms, 1,6 Mbps, tắt cache, 3 lần/route, lấy trung vị; script `scripts/perf.cjs`). Chỉ so sánh tương đối, không phải số trên CDN:

| Route | LCP baseline | LCP hardening | FCP baseline | FCP hardening | KB tải về |
|---|---|---|---|---|---|
| `/` | 4176 | **2904** | 4176 | 2904 | 845 → 986 |
| `/gioi-thieu` | 4976 | **4236** | 3812 | 2116 | 853 → 837 |
| `/doi-ngu` | 4140 | **2268** | 3772 | 2268 | 788 → 777 |
| `/co-so-vat-chat` | 4172 | **2120** | 3792 | 2120 | 915 → 897 |
| `/dat-lich` | 4020 | **2076** | 4020 | 2076 | 733 → 739 |

## 8. Visual regression

Xem mục 7: 0 pixel khác trên 10 ảnh chụp. Các trang ComingSoon, 404 và `/tai-khoan/*` chưa so pixel (NOT TESTED), chỉ kiểm tiêu đề và nội dung.

## 9. Dashboard/privacy: **PASS** ở mức spike

- `/quan-ly/*` đã bị gỡ khỏi routes, khớp 3A. Không còn tiêu đề portal nội bộ công khai.
- `/tai-khoan/*` dùng đúng `ComingSoonView` như 3A, không còn chữ kỹ thuật của spike.
- `__spa-fallback.html` (2,2 kB) không chứa dữ liệu hay `loaderData` [VERIFIED].
- `ssr: false`; không có server build (bị xóa sau build).
- Portal vẫn nằm trong layout public, đúng như 3A hiện tại (3A chưa có CustomerLayout); thiết kế layout riêng thuộc Giai đoạn 4.

## 10. Hosting readiness (Gate D): **NOT READY / NOT TESTED**

| Hạng mục | Đánh giá |
|---|---|
| Output build | ✘ Project Vercel đang đặt `framework: vite`, `outputDirectory: dist`; hardening ra `build/client` và `vercel.json` **không** khai báo `outputDirectory`. Cần đổi project settings hoặc thêm `outputDirectory` vào cấu hình khi chủ dự án cho phép |
| Rewrites | ✔ Không catch-all. Còn thiếu rewrite cho `/tai-khoan` (không dấu `/`), `/cau-chuyen/:slug`, `/bai-viet/:slug` |
| HTTP 404 | NOT TESTED trên Vercel thật; chỉ kiểm bằng server mô phỏng |
| Robots, canonical, OG | Robots ✔ (noindex toàn bộ); canonical/OG đã bỏ ✔ |
| Deployment Protection | Đang bật cho mọi deployment. Crawler mạng xã hội không đọc được Preview có bảo vệ, nên không kiểm social preview |
| Rollback | Khả thi (Vercel instant rollback + nhánh 3A). Cần ghi lại việc đổi lại project settings |

## 11. Phân loại P0/P1/P2/P3

| ID | Mức | Nội dung |
|---|---|---|
| **H-P1-1** | **P1** | Metadata mới có claim bị cấm: "môi trường **vô trùng** chuẩn y khoa" (`/co-so-vat-chat`), "cơ sở vật chất **hiện đại**" (`/`). Cách sửa: dùng mô tả trung tính (tên trang, địa chỉ, hotline từ `HOSPITAL_CONTACT`) và chạy lại grep Content Lock |
| H-P2-1 | P2 | React error #418 (hydration mismatch) trên **mọi trang 404** |
| H-P2-2 | P2 | `/cau-chuyen/:slug`, `/bai-viet/:slug` mở trực tiếp trả 404 rồi chuyển sang ComingSoon (baseline: 200); `/tai-khoan` không có `/` đuôi trả 404 |
| H-P2-3 | P2 | 3 test E2E 3A fail vì noindex/canonical ở trang chủ; cần cập nhật test hoặc cấu hình theo môi trường |
| H-P2-4 | P2 | `vercel.json` đặt noindex toàn bộ đường dẫn, không tách theo Preview/Production |
| H-P2-5 | P2 | Cấu hình project Vercel (`vite`/`dist`) không khớp output `build/client` |
| H-P2-6 | P2 | Claim ở nội dung baseline 3A ("khử khuẩn", "trực đêm", "chẩn đoán hình ảnh", "24/7") nay nằm trong HTML gốc, crawler đọc được. Cần xử lý ở nguồn trước khi mở index |
| H-P3-1 | P3 | `sitemap.xml`, `robots.txt` dùng `bvthuyleson.vn` (domain chưa duyệt); sitemap chỉ có `/` |
| H-P3-2 | P3 | Cụm "cam kết", "phụ trách chuyên môn", "tận tâm" trong metadata `/gioi-thieu`, `/doi-ngu`, `/` |
| H-P3-3 | P3 | Chưa có JSON-LD; chưa có canonical/OG (có chủ đích) |
| H-P3-4 | P3 | Handoff của Antigravity còn nhiều khẳng định chưa được kiểm chứng ("100% đạt", số liệu hiệu năng) |
| H-P3-5 | P3 | Cảnh báo future-flag React Router v8; cảnh báo `envFile` deprecated |

## 12. Open issues

- Hosting: output dir, rewrite còn thiếu, 404 thật trên Vercel, noindex theo môi trường.
- Cập nhật bộ E2E (đường dẫn build `build/client`; kỳ vọng index/canonical theo môi trường).
- Axe, viewport 320/768/1024, screen reader: NOT TESTED.
- Domain chính thức, ảnh OG và canonical: chờ chủ dự án chốt.

## 13. Migration recommendation

| Tiêu chí | Đánh giá |
|---|---|
| Chi phí | Vừa. Khối lượng chính đã làm trong Spike (21 route module + config); còn việc sửa metadata, 404 hydration, cấu hình Vercel, cập nhật E2E |
| File ảnh hưởng | `app/**`, `react-router.config.ts`, `vite.config.ts`, `package.json`, `tsconfig.app.json`, `vercel.json`, `scripts/postbuild.cjs`, `src/hooks/useRouteSeo.ts`, bộ E2E, project settings Vercel. Không đổi `src/pages`, component, CSS (0 pixel khác) |
| Rủi ro dashboard | Thấp ở giai đoạn này |
| Rủi ro SEO | Trung bình; phụ thuộc domain, OG, nội dung baseline |
| Rủi ro Vercel | Trung bình cho tới khi có Preview kiểm thử |
| Rollback | Khả thi |
| Tác động 3B-01 | Nếu chọn migration, nên chốt **trước** 3B-01 để `/dich-vu` và `/bang-gia` viết thẳng bằng route module |
| **Phương án Vite SPA** | Vẫn là phương án **ít thay đổi nhất**. Hardening cho thấy Framework Mode **không** làm hỏng giao diện hay hiệu năng và cải thiện LCP mobile, nhưng đổi lại thêm 3 chủ đề phải quản lý (404 hydration, noindex theo môi trường, cấu hình Vercel). Claude **không** coi Framework Mode là lựa chọn mặc định; quyết định thuộc chủ dự án |

**Khuyến nghị:** **không đề xuất migration** ở trạng thái hiện tại vì còn P1. Sau khi sửa H-P1-1 và xử lý H-P2-1 → H-P2-5, Claude sẽ retest. Nếu đạt, có thể đề xuất chủ dự án cho phép **một** Vercel Preview có bảo vệ.

## 14. Preview recommendation: **NOT READY FOR PREVIEW**

Điều kiện để chuyển sang READY:

1. Sửa H-P1-1 (metadata không có claim bị cấm).
2. Sửa lỗi hydration #418 trên 404.
3. Cấu hình `outputDirectory` và rewrite đủ (`/tai-khoan`, `:slug`) hoặc ghi rõ hành vi chấp nhận.
4. Chạy lại E2E 3A với kỳ vọng đã cập nhật.
5. Chủ dự án cấp phép riêng cho **một** Preview, bật Deployment Protection như hiện tại.

## 15. Ma trận QA

| Gate | Kết luận |
|---|---|
| A — Rendering/SEO | **PARTIAL** (head, hydration, route, robots, canonical/OG đạt; **claim bị cấm trong metadata → FAIL nội dung**) |
| B — Routing/Privacy (local) | **PARTIAL** (21/21 route và riêng tư đạt; #418 và 3 lệch route) |
| C — Performance/Regression | **PASS** (kèm 3 test E2E cần cập nhật; axe NOT TESTED) |
| D — Hosting/Social | **NOT READY / NOT TESTED** |
| Source Integrity | **PASS** |

**Kết luận cuối: FAIL (còn 1 P1) · NOT READY FOR PREVIEW.**

Claude không tự phê duyệt migration, deployment hay 3B-01.

**ARCHITECTURE SPIKE 01 HARDENING 01 — PENDING OWNER DECISION**
