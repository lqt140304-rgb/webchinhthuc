# ARCHITECTURE SPIKE 01 — Independent Architecture QA (CEO Directive 049-B)

- **QA:** Claude (Independent Architecture QA Lead).
- **Phạm vi làm việc:** Claude chỉ đọc Git và chạy thử trong worktree riêng ở scratchpad (build, server tĩnh cục bộ, Chromium). Không sửa nhánh spike, không merge, không deploy, không tắt Deployment Protection.
- **Ngày:** 28/10/2026
- **Bằng chứng:** `docs/qa/evidence/architecture-spike-01/`. Gồm các file 01–11 và các script đo trong `scripts/` để chạy lại.
- **Quy ước:** **[VERIFIED]** = Claude tự kiểm bằng Git, build, HTTP hoặc trình duyệt. **[SELF-REPORTED]** = chỉ có trong báo cáo của Antigravity.

## Kết luận: **CONDITIONAL GO** (đề xuất kỹ thuật để chủ dự án xem xét)

**Kết luận chính:** React Router 7 Framework Mode với `ssr: false` + prerender **khả thi về kỹ thuật** với codebase hiện tại. Claude đã tự chứng minh:

- Mỗi route có HTML riêng, nội dung chính đọc được khi không có JavaScript.
- 0 lỗi hydration hay lỗi console.
- Giao diện giống hệt 3A (0 pixel khác trên 5 route, 2 viewport).
- CLS không đổi; FCP/LCP mobile nhanh hơn khoảng 1–2 giây trong cùng điều kiện đo.

**Nhưng bản spike chưa sẵn sàng để migration:**

1. **13 route của 3A bị mất** và trả về NotFound, gồm 4 link trên Header.
2. **Metadata chứa claim chưa xác minh** và dùng domain chưa được duyệt.
3. **Hai cơ chế quản lý head chạy chồng nhau:** title trong HTML gốc khác title sau hydration.
4. **HTTP 404 thật chỉ được chứng minh bằng một server tự viết**, và server đó mô phỏng đúng hành vi mong muốn. Hành vi trên Vercel **chưa được kiểm thử**. Cấu hình project Vercel hiện tại (`framework: vite`, `outputDirectory: dist`) cũng không khớp output mới.

Các vấn đề này chủ yếu do **phạm vi và cấu hình thử nghiệm**, không phải giới hạn của kiến trúc. Vì vậy kết luận là CONDITIONAL GO, không phải NO-GO.

Claude không tự quyết định migration, deploy hay merge, và không mở 3B-01.

---

## 1. Baseline

`4739d45cc95100b587381b6bdcad6935352b23e8` (3A, nghiệm thu có điều kiện; Preview `dpl_8XZEtH3…`).

## 2. Spike

| Mục | Giá trị |
|---|---|
| Branch | `spike/architecture-01-rr7-prerender` |
| Commit | `0dba2f3983513ee549521a961fbdfd8c7445fae4` (2026-10-28 13:13 +0700) |
| Lịch sử | 1 commit, parent đúng `4739d45` [VERIFIED] |
| Diff | 27 file, +3583 / −331: `app/` (mới), `react-router.config.ts`, `vite.config.ts`, `package.json` và lock, `tsconfig.app.json`, `.oxlintrc.json`, `.gitignore`, `tests/spike/`, `docs/spikes/` |

## 3. Scope và Source integrity

`01-source-integrity.txt`, `02-vercel-readonly.txt`

| Kiểm tra | Kết quả |
|---|---|
| Xuất phát từ đúng baseline | **PASS** [VERIFIED] |
| Không merge `main` | **PASS**: `main` = `d2a19c5`, không chứa spike [VERIFIED] |
| Không sửa nhánh 3A, nhánh tài liệu 3B-00 | **PASS**: `docs/phase-3b-00` vẫn `32b8a0a` [VERIFIED] |
| `src/`, `public/`, `index.html`, `vercel.json` | Không đổi [VERIFIED] |
| Không có Preview/Production deployment mới | **PASS**: deployment mới nhất vẫn `dpl_8XZEtH3…` / `4739d45`, tạo trước commit spike; Production vẫn `dpl_BAz378…` / `db78738` [VERIFIED qua Vercel API, read-only] |
| Không đổi domain | **PASS**: chỉ có alias `le-son-website-qa.vercel.app` [VERIFIED] |
| Không bật Git Integration | **PASS**: `project.link` trống [VERIFIED] |
| Deployment Protection | Vẫn bật (`ssoProtection: all`) [VERIFIED] |
| Worktree `D:\webbvct-spike`, "workspace chính không bị ảnh hưởng" | [SELF-REPORTED], không kiểm được từ xa |

**Source integrity: PASS.**

## 4. Gate A — Rendering/SEO: **PARTIAL**

`06-prerender-html-head.txt`, `07-browser-routes-head.txt`, `11-bundle-head.txt`

| Yêu cầu | Kết quả |
|---|---|
| HTML theo route | ✔ [VERIFIED] 6 trang và `404/index.html` được prerender. Build sạch của Claude ra đúng các file như handoff |
| Nội dung chính không phụ thuộc JS | ✔ [VERIFIED] Có h1 và 3.000–7.000 ký tự nội dung trong HTML gốc |
| Title, description, canonical, OG theo route | ✔ Có, khác nhau theo route [VERIFIED]. `/dat-lich` thiếu `og:image` |
| Head của React 19 / RR7 | ✔ `meta()` + `<Meta/>` của RR7 đáp ứng đủ. **Không cần `react-helmet-async`.** Phiên bản: React 19.3.1, react-router 7.18.5 (peer `react >=18`) |
| **Metadata dùng chung sai / xung đột** | ✘ **Hook cũ `useRouteSeo` vẫn chạy** trong 6 page và ghi đè `document.title`, description, robots sau hydration. Ví dụ `/gioi-thieu`: HTML gốc "Về Bệnh Viện Thú Y Lê Sơn — Lịch Sử & Tôn Chỉ Y Khoa", sau hydration là "Về Bệnh viện Thú y Lê Sơn — Chăm Sóc Y Tế Chuẩn Mực". Crawler và người dùng thấy hai bộ metadata khác nhau |
| **Không có claim chưa xác minh** | ✘ Xem bảng dưới. Handoff ghi "chuẩn xác 100% từ Content Evidence Gate" là **không đúng** |
| Robots trong HTML gốc | ✘ Các trang 3A đang ở trạng thái noindex (bằng header `vercel.json` và `useRouteSeo` phía client), nhưng HTML prerender **không có** `<meta name="robots">`. Bản `vercel.json` đề xuất trong tài liệu spike lại bỏ các header noindex này. Nếu áp dụng, trang chưa duyệt có thể bị index |

**Claim trong metadata do spike tự viết, chưa qua Content Lock:**

| Route | Nội dung | Vấn đề |
|---|---|---|
| `/co-so-vat-chat` | "…**phòng chẩn đoán hình ảnh** và **khu vực lưu trú y tế tiện nghi**" | Claim thiết bị và phân khu đã bị gỡ ở 3A (DEC-07 còn mở) |
| `/` | "khám, điều trị, **phẫu thuật, nội trú** và cấp cứu 24/24 **uy tín**"; title "…**Chuẩn Mực**" | Phẫu thuật và nội trú đang PENDING (DEC-04/07). "Uy tín" là claim quảng cáo |
| `/doi-ngu` | "đội ngũ bác sĩ thú y **giàu kinh nghiệm**… **chuyên môn vững vàng**" | Ở 3A chỉ họ tên BS. Lê Thái Sơn được xác minh |
| `/gioi-thieu` | "hành trình thành lập, đội ngũ chuyên môn…" | Lịch sử thành lập chưa được xác minh |
| Tất cả route | canonical và og:url `https://lesonpet.vn/…` | Domain **chưa được duyệt**. `robots.txt` và `sitemap.xml` trong cùng build lại dùng `bvthuyleson.vn`. Tài liệu 3B-00 quy định dùng placeholder `[domain-chinh-thuc]` |
| 5 route | `og:image` `…/images/og-*.webp` | **0 file `og-*` tồn tại** trong `public/images`, nên ảnh chia sẻ sẽ lỗi 404 |

**Phân loại:** khả năng prerender và head của kiến trúc **đạt**. Nội dung và cấu hình head của spike **không đạt**. Đây là lỗi cấu hình thử nghiệm, nhưng sẽ thành **P1 nếu đưa nguyên trạng vào migration**.

## 5. Gate B — Routing/Privacy: **PARTIAL**

`07-browser-routes-head.txt`, `10-routing-404.txt`

| Yêu cầu | Kết quả |
|---|---|
| Route hợp lệ, truy cập trực tiếp, refresh (6 route đã port) | ✔ [VERIFIED] HTTP 200, render đúng, 0 lỗi console |
| **Route của 3A** | ✘ [VERIFIED] **13 route bị mất**: `/dich-vu`, `/dich-vu/kham-dieu-tri`, `/dich-vu/noi-tru`, `/dich-vu/spa`, `/dich-vu/cap-cuu`, `/bang-gia`, `/cau-chuyen`, `/cau-chuyen/:slug`, `/goc-thu-cung`, `/bai-viet/:slug`, `/san-pham`, `/lien-he`, `/dang-nhap`, `/dang-ky`. Bấm link trên Header tới `/cau-chuyen`, `/lien-he`, `/dang-nhap`, `/dang-ky` đều ra "Không tìm thấy trang". Test "`/dich-vu/slug-khong-ton-tai` → 404" đạt chỉ vì **toàn bộ `/dich-vu` không còn tồn tại** |
| Nested routes | Một phần: `/tai-khoan/*`, `/quan-ly/*` hoạt động phía client |
| HTTP 404 thật | ✘/NOT TESTED trên hosting. Bằng chứng duy nhất là `tests/spike/test-routing-spike.cjs`, một **server tự viết theo đúng hành vi mong muốn**. Script này hardcode đường dẫn `D:/webbvct-spike`, nên không chạy được ở máy khác, và **copy `404/index.html` thành `404.html` lúc chạy test**. Bước build **không** tạo `404.html` [VERIFIED]. Theo yêu cầu của directive: **không đánh dấu Hosting 404 PASS** |
| SPA fallback | ✔ `__spa-fallback.html` (2,2 kB), không có dữ liệu, không có `loaderData` [VERIFIED] |
| Dashboard routing | ✘ Một phần. `/tai-khoan/*` của 3A (ComingSoonView) bị thay bằng placeholder hiển thị chữ kỹ thuật "[Architecture Spike 01 Check]…". Route mới `/quan-ly/*` hiện tiêu đề "Staff & Management Portal" công khai. Cả hai portal nằm **trong layout public** (Header/Footer công khai), trái AGENTS.md (cần `CustomerLayout` và `StaffLayout` riêng). Mức spike thì chấp nhận được, nhưng phải thiết kế lại khi migration |
| Lộ dữ liệu | ✔ Không có dữ liệu nào trong HTML tĩnh (chưa có dữ liệu thật để lộ) |
| Noindex | Một phần: portal và 404 có `noindex` trong meta; trang public đang PENDING thì không (xem Gate A) |

## 6. Gate C — Performance/Regression: **PARTIAL**

`03-spike-build.log`, `04-typecheck-lint.txt`, `05-baseline-build.log`, `08-perf-cls-lcp.txt`, `09-visual-diff.txt`, `11-bundle-head.txt`

| Hạng mục | Kết quả |
|---|---|
| Clean build (`npm ci` + `react-router build`) | **PASS** [VERIFIED]. Có 4 cảnh báo future-flag của RR v8 và cảnh báo "`envFile` deprecated" |
| Typecheck (`react-router typegen && tsc -b`) | **PASS**, 0 lỗi [VERIFIED] |
| Lint (oxlint) | **PASS**, exit 0. Lưu ý: spike **tắt** rule `react/only-export-components` toàn repo thay vì chỉ cho thư mục `app/routes` |
| Console / hydration | **PASS**: 0 lỗi, 0 cảnh báo trên 40 lần tải (20 route × 2 bản) [VERIFIED] |
| CLS mobile | **PASS**: bằng baseline (0,0000; `/dat-lich` 0,0010 ở cả hai) |
| LCP mobile | **PASS / cải thiện**, xem mục 8 |
| Visual (desktop 1440, mobile 412) | **PASS**: 0 pixel khác trên 5 route chung [VERIFIED]. Lần chụp đầu có sai lệch do lazy-image; đã chụp lại có cuộn hết trang, kết quả 0 |
| Bundle | **PARTIAL**: JS tải ở trang chủ **131,5 kB gzip / 16 file**, so với baseline **105,4 kB / 1 file** (+25%). Handoff ghi "+10,5 kB" là thấp hơn thực tế. HTML trang chủ 74 kB so với 1,6 kB |
| Navigation | **FAIL** với 13 route bị mất (Gate B) |
| Accessibility | Một phần: `lang="vi"`, 1 h1, skip-link có trong HTML gốc. **Chưa chạy axe/screen reader (NOT TESTED)** |
| CSS consistency | **PASS** qua visual diff. Tailwind v4 và token giữ nguyên |
| Responsive | **PASS** ở 412 và 1440. Chưa đo 320/768/1024 (NOT TESTED) |

**Số liệu trong `architecture-spike-01-performance.md` của Antigravity:**

- Phần LCP/FCP chỉ là **phân tích lý thuyết**, không có phương pháp đo.
- Bảng so sánh ghi SHA spike là `32b8a0a`, thực ra là commit tài liệu 3B-00.
- Tài liệu nói có preload Hero WebP, nhưng `app/root.tsx` chỉ preload font.

Claude **không** dùng các số này.

## 7. Gate D — Hosting/Social: **NOT TESTED**, đã thấy blocker cấu hình

`02-vercel-readonly.txt`, `10-routing-404.txt`

| Hạng mục | Đánh giá |
|---|---|
| Output build | ✘ Project Vercel hiện đặt `framework: vite`, `outputDirectory: dist`. Spike ra `build/client`. Deploy nguyên trạng sẽ sai output hoặc build lỗi; phải đổi project settings hoặc thêm cấu hình |
| Routing / Rewrites | ✘ `vercel.json` hiện tại rewrite `/(.*) → /index.html`. Với spike, `index.html` là **trang chủ đã prerender**. Mọi URL lạ sẽ nhận HTML trang chủ với mã 200, rồi client đổi sang NotFound: vẫn là soft 404, thêm nhấp nháy nội dung. Bản `vercel.json` đề xuất (chỉ nằm trong tài liệu) chưa được áp dụng hay kiểm thử |
| HTTP 404 | NOT TESTED. Build không có `404.html` ở root, nên nếu Vercel trả 404, người dùng sẽ thấy trang 404 mặc định của Vercel, không phải trang 404 có style |
| Robots | ✘ Cấu hình đề xuất bỏ các header noindex hiện có (Gate A) |
| Canonical / OG | ✘ Domain chưa duyệt; ảnh OG không tồn tại |
| Deployment Protection | Đang bật cho mọi deployment. **Crawler mạng xã hội không đọc được Preview đang bảo vệ**, nên chưa kiểm được social preview thật |
| Rollback | Khả thi: Vercel instant rollback về deployment trước, và nhánh 3A còn nguyên. Nhưng chưa có runbook đổi lại project settings (framework/output) khi rollback |

Gate D **không thể PASS** khi chưa có deployment do chủ dự án cấp phép riêng. Gate D chưa kiểm thử **không** có nghĩa spike thất bại.

## 8. Performance evidence

`08-perf-cls-lcp.txt`

**Phương pháp:**

- Chromium (Playwright), server tĩnh cục bộ cho cả hai bản build.
- Mobile 412×823, DPR 2,625, CPU 4×, RTT 150 ms, 1,6 Mbps, tắt cache.
- 3 lần mỗi route, lấy trung vị.
- LCP/FCP/CLS đo bằng PerformanceObserver.

Số này chỉ dùng **so sánh tương đối**, không phải số trên CDN thật.

| Route | Baseline LCP | Spike LCP | Baseline FCP | Spike FCP | CLS (cả hai) |
|---|---|---|---|---|---|
| `/` | 3884 ms | **2920 ms** | 3884 | 2920 | 0 / 0 |
| `/gioi-thieu` | 4968 ms | **4180 ms** | 3764 | 2148 | 0 / 0 |
| `/doi-ngu` | 4176 ms | **2308 ms** | 3800 | 2308 | 0 / 0 |
| `/co-so-vat-chat` | 4152 ms | **2148 ms** | 3760 | 2148 | 0 / 0 |
| `/dat-lich` | 3836 ms | **2088 ms** | 3836 | 2088 | 0,001 / 0,001 |

Dung lượng tải về: trang chủ 980 kB so với 845 kB (+16%); các route khác tương đương.

## 9. SEO evidence

Xem mục 4 và `06-prerender-html-head.txt` (title, meta, canonical, h1, độ dài nội dung không cần JS cho từng file HTML).

## 10. Routing/404 evidence

Xem mục 5 và `10-routing-404.txt`. Claude kiểm HTTP status bằng curl trên 3 chế độ server:

| Chế độ server | Kết quả |
|---|---|
| Baseline SPA | 200 cho mọi URL |
| Spike + SPA fallback | 200 cho mọi URL |
| Spike strict | 404 cho **mọi URL không được prerender**, kể cả 13 route 3A bị mất và `/tai-khoan/x` |

Hành vi trên Vercel thật **chưa xác định**.

## 11. Dashboard/privacy risks

1. **Layout:** portal cần layout riêng ngoài `public-layout`. Spike đặt `tai-khoan/*` và `quan-ly/*` trong layout public.
2. **Tách bundle:** portal và public cần tách bundle. Route module của RR7 đã tự tách theo route, nên đáp ứng tinh thần `React.lazy()` của AGENTS.md. Cần kiểm lại khi có dashboard thật.
3. **Phạm vi dashboard:** không đưa dashboard vào trước Giai đoạn 4 (AGENTS.md). `/quan-ly/*` hiện là placeholder công khai; trước khi migration nên giữ ComingSoon như 3A.
4. **Dữ liệu cá nhân:** không prerender dữ liệu cá nhân (`ssr: false`, portal chỉ chạy client). Không yêu cầu Supabase Auth ở Spike.

## 12. Migration cost: **ACCEPTABLE** (trung bình)

| Tiêu chí | Đánh giá |
|---|---|
| 1. Độ phức tạp | Trung bình. Phải chuyển 21 route của `src/app/routes.tsx` sang route module; bỏ `src/main.tsx`, `src/App.tsx`, `index.html` gốc; gộp `useRouteSeo` vào `meta()`; đổi Vercel project settings và `vercel.json` |
| 2. File bị ảnh hưởng | `app/**` (mới), `src/app/routes.tsx`, `src/main.tsx`, `src/App.tsx`, `src/hooks/useRouteSeo.ts` và 6+ page dùng hook này, `vite.config.ts`, `package.json`, `tsconfig.app.json`, `vercel.json`, Vercel project settings, bộ E2E (đường dẫn build `dist` → `build/client`) |
| 3. Tái sử dụng UI | Cao: 0 thay đổi JSX/CSS, 0 pixel khác [VERIFIED] |
| 4. Rủi ro regression 3A | Trung bình. Rủi ro chính là route parity và head; kiểm được bằng E2E và visual diff đã có |
| 5. Rủi ro dashboard | Thấp ở giai đoạn này. Cần layout riêng |
| 6. Rủi ro SEO/404 | Trung bình. Phụ thuộc cấu hình Vercel chưa được kiểm thử |
| 7. Chi phí vận hành | Không tăng: vẫn là static, không có serverless function (`ssr: false`) [VERIFIED: server build bị xóa] |
| 8. Rollback | Khả thi (Vercel rollback cộng nhánh 3A). Cần runbook cho project settings |
| 9. Tác động tới 3B-01 | Nếu chọn migration, nên làm **trước hoặc ở đầu** 3B-01 để `/dich-vu` và `/bang-gia` viết thẳng dưới dạng route module, khỏi refactor lần hai |
| 10. Giải pháp ít thay đổi hơn | Có: **giữ Vite SPA + prerender lúc build** (script prerender riêng dùng `react-dom/server` + `StaticRouter` cho vài route public, cộng `vercel.json` liệt kê route hợp lệ để có 404). Ưu: không đổi entry hay router. Nhược: tự viết và tự bảo trì cơ chế head/prerender, và vẫn còn hai cơ chế head. Với kết quả đo ở trên, RR7 `ssr: false` **không rủi ro hơn đáng kể** và là cơ chế chính thức của React Router. Claude **không** coi Framework Mode là lựa chọn mặc định. Đề nghị chủ dự án so sánh hai phương án qua điều kiện C-1 → C-6 dưới đây |

## 13. Open issues

| ID | Mức nếu migration nguyên trạng | Nội dung |
|---|---|---|
| SPK-01 | **P1** | 13 route 3A bị mất; link Header ra 404 |
| SPK-02 | **P1** | Metadata có claim chưa xác minh; domain canonical chưa duyệt; ảnh OG không tồn tại |
| SPK-03 | **P1** | `useRouteSeo` ghi đè head do `meta()` sinh ra; HTML gốc khác DOM sau hydration |
| SPK-04 | P2 | Thiếu robots trong HTML gốc của trang PENDING; cấu hình `vercel.json` đề xuất bỏ header noindex |
| SPK-05 | P2 | Không có `404.html` trong build; test 404 không chạy được ở nơi khác và tự mô phỏng kết quả mong muốn |
| SPK-06 | P2 | Vercel project settings (`vite` / `dist`) và rewrite toàn cục không tương thích output mới |
| SPK-07 | P2 | Portal nằm trong layout public; `/quan-ly/*` lộ tiêu đề nội bộ; placeholder có chữ kỹ thuật |
| SPK-08 | P3 | JS trang chủ +25% gzip; handoff ghi thấp hơn thực tế |
| SPK-09 | P3 | Tắt `react/only-export-components` toàn repo; `@react-router/dev` nằm ở `dependencies`; `@react-router/node` khai báo ở cả hai nhóm; `isbot`, `@react-router/node` không cần khi `ssr: false`; `@vitejs/plugin-react` còn sót; script `preview` (`vite preview`) không còn đúng |
| SPK-10 | P3 | Handoff và tài liệu có các ý không đúng: "chuẩn xác 100% Content Evidence Gate", "render CustomerLayout", "bổ sung tailwindcss" (đã có sẵn), SHA `32b8a0a`, preload Hero |
| SPK-11 | NOT TESTED | Vercel thật, social crawler, axe, viewport 320/768/1024 |

## 14. Recommendation

**Đề nghị chủ dự án xem xét chọn RR7 Framework Mode (`ssr: false` + prerender) làm hướng kiến trúc, với điều kiện:**

- **C-1:** Route parity 21/21 với 3A, chạy lại bộ E2E 3A và visual diff.
- **C-2:** Một nguồn head duy nhất (`meta()`); bỏ hoặc vô hiệu `useRouteSeo` trên các route đã chuyển.
- **C-3:** Metadata tuân thủ Content Evidence Gate:
  - không có claim PENDING;
  - domain dùng placeholder cho đến khi chủ dự án chốt;
  - ảnh OG có thật, hoặc bỏ thẻ.
- **C-4:** `noindex` nằm ngay trong HTML gốc của các trang chưa được duyệt public; giữ nguyên header noindex.
- **C-5:** Build tạo ra `404.html`. Viết lại `vercel.json` theo danh sách route hợp lệ. Test 404 phải chạy được trong repo, không phụ thuộc đường dẫn máy.
- **C-6:** Kiểm thử trên **một Preview có bảo vệ**, do chủ dự án cấp phép riêng:
  - HTTP status (200/404);
  - header robots;
  - output dir;
  - rollback.

  Social preview chỉ kiểm được khi có URL công khai được chủ dự án cho phép.

**Nếu chủ dự án muốn rủi ro thấp nhất trong ngắn hạn:** giữ Vite SPA cho 3B-01, chỉ thêm metadata phía client, và lùi migration lại. Đổi lại, sẽ chưa có SEO/social preview thật cho tới khi migration.

## 15. Kết luận

| Gate | Kết luận |
|---|---|
| A — Rendering/SEO | **PARTIAL** (kiến trúc PASS; nội dung và head của spike FAIL) |
| B — Routing/Privacy | **PARTIAL** |
| C — Performance/Regression | **PARTIAL** (build, type, hydration, CLS, LCP, visual PASS; route regression FAIL) |
| D — Hosting/Social | **NOT TESTED** (đã thấy blocker cấu hình) |
| Migration Cost | **ACCEPTABLE** |
| Source Integrity | **PASS** |

**Khuyến nghị tổng thể: CONDITIONAL GO.** Đây là đề xuất kỹ thuật cho chủ dự án. Claude không tự phê duyệt migration, deploy, merge hay mở 3B-01.

**ARCHITECTURE SPIKE 01 — PENDING OWNER ARCHITECTURE DECISION**
