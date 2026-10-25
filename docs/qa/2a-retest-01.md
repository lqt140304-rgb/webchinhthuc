# Retest 01 mốc 2A: kiểm tra độc lập của Claude

| Mục | Giá trị |
|---|---|
| Người kiểm tra | Claude (QA reviewer, theo `AGENTS.md`) |
| Ngày chạy | 25–26/10/2026 (giờ của container) |
| **SHA mã được kiểm tra** | `31e3c1eafc7ac470361c860c681d49874a3768c6`, nhánh `fix/milestone-2a-qa` |
| Đầu nhánh khi nhận bàn giao | `24e986a7f2ab5aa81ce5fca5a9d61a83f1baaf7f`. Đã xác nhận `31e3c1e..24e986a` chỉ sửa 1 dòng trong `docs/qa/2a-fix-handoff.md` |
| Baseline so sánh | `c2e5361defb0d151bf14c8153a341072060c2e42` (báo cáo QA lần 3) |
| SHA commit báo cáo này | Là commit trên nhánh `claude/2a-retest-01`, tách khỏi SHA mã ở trên. Báo cáo không tự ghi SHA của chính nó, vì giá trị đó chỉ có sau khi commit |
| Báo cáo đối chiếu | [2a-fix-handoff.md](2a-fix-handoff.md) của Antigravity, [bao-cao-kiem-tra-2A.md](bao-cao-kiem-tra-2A.md), [2a-e2e-protocol.md](2a-e2e-protocol.md) |

## 1. Kết luận

**2A chưa đạt.** Đề nghị Antigravity sửa thêm một vòng nhỏ.

- 6 trong 8 lỗi P1 đạt ở mức kiểm chứng được: P1-1, P1-2, P1-5, P1-6, P1-7 (phía client), cùng phần ghi nhận P1-8.
- **P1-4 chưa sửa.** Rê chuột rồi bấm vẫn đóng submenu.
- **P1-3 sửa chưa đủ.** Phép so khớp tuyến không xét ranh giới, nên có tới hai mục cùng là "trang hiện tại", và URL 404 có tiền tố giống tuyến thật vẫn tô nhóm điều hướng.
- **Cấu hình hosting tạo sẵn có rủi ro.** `public/404.html` (dành cho GitHub Pages) đưa mọi đường dẫn sâu về trang chủ, kể cả URL sai, nên người dùng mất trang 404 thật. Tệp này còn được đóng gói vào `dist` cho mọi host.
- **Bộ E2E 24/24 của Antigravity tái hiện được, nhưng chưa đủ để kết luận đạt.** Nó dùng `element.click()` qua JavaScript nên không bắt được P1-4. Nó dùng `sleep` cố định và đọc `robots.txt` từ đĩa thay vì qua HTTP. Nó không kiểm tra route con, Tab/Shift+Tab hay Back/Forward.

Người dùng là người quyết định nghiệm thu. 2B vẫn chờ duyệt, chưa sang giai đoạn 3.

## 2. Môi trường và lệnh

| Mục | Giá trị |
|---|---|
| Hệ điều hành | Linux 6.18.44 (container) |
| Node / npm | v22.22.0 / 10.9.4. Antigravity dùng Node v24.21.0, tài liệu ghi Node 24 |
| Trình duyệt | Chromium headless: Google Chrome for Testing 153.0.8010.12, qua thư viện `playwright` 1.63.0 có sẵn trong môi trường (không thêm vào repo) |
| Bộ chạy test | `node:test` có sẵn của Node, không dùng thêm dependency |
| Bản sao | `git archive 31e3c1e` vào thư mục tạm. `package-lock.json` trùng byte với SHA. `package.json` và lockfile không đổi so với `c2e5361` |
| Server | `vite preview` (cổng 4173), dùng cho E2E. `http-server dist -s` (cổng 4190), chỉ để **mô phỏng** logic `404.html` |
| Working tree | Sạch. Không sửa mã ứng dụng |

| Lệnh | Exit | Ghi chú |
|---|---|---|
| `npm ci` | 0 | |
| `npx oxlint` | 0 | [lint-31e3c1e.log](2a-retest-01-evidence/lint-31e3c1e.txt) |
| `npx tsc -b` | 0 | [tsc-31e3c1e.log](2a-retest-01-evidence/tsc-31e3c1e.txt) |
| `npm run build` | 0 | `index.html` 2.30 kB, CSS 54.87 kB, JS 346.33 kB. [build-31e3c1e.log](2a-retest-01-evidence/build-31e3c1e.txt) |
| E2E của Claude: `tests/e2e/2a.e2e.test.cjs` | **1** | **53 test: 44 pass, 7 fail, 2 skip (BLOCKED)**, 0 lỗi console. [log](2a-retest-01-evidence/e2e-claude-31e3c1e.txt), [TAP](2a-retest-01-evidence/e2e-claude-31e3c1e.tap), [số đo](2a-retest-01-evidence/measurements.json) |
| Cùng bộ E2E trên baseline `c2e5361` | 1 | 53 test: 21 pass, **30 fail**, 2 skip. Xác nhận bộ test bắt được lỗi gốc. [log](2a-retest-01-evidence/e2e-claude-baseline-c2e5361.txt) |
| E2E của Antigravity: `scripts/qa/run-e2e-2a.mjs`, chạy lại nguyên trạng qua CDP 9222 | 0 | 24/24 PASS, tái hiện được. [log](2a-retest-01-evidence/e2e-anti-rerun-31e3c1e.txt) |
| Mô phỏng `404.html`: `tests/e2e/hosting-404html-sim.cjs` | **1** | 3/3 đường dẫn sâu bị đưa về `/`. [kết quả](2a-retest-01-evidence/hosting-404html-sim.json) |

**Cách chạy lại** từ nhánh này:

```bash
tests/e2e/run-2a-e2e.sh <SHA> <thư-mục-tạm> [thư-mục-evidence]   # npm ci, lint, build, preview, E2E
# hoặc chạy trực tiếp trên một preview đang chạy:
BASE_URL=http://localhost:4173 EVIDENCE_DIR=./ev node --test tests/e2e/2a.e2e.test.cjs
# Khi host đích đã chốt, chạy thêm nhóm P1-8:
HOST_URL=https://<host> BASE_URL=... node --test tests/e2e/2a.e2e.test.cjs
```

**Lưu ý về độ tin cậy của bộ test:**

- Trong lần chạy đầu, test P1-7 đọc title ngay khi URL đổi, trước khi `useEffect` chạy, nên báo sai title. Tôi đã sửa test để chờ đúng trạng thái, không dùng sleep cố định. Sau đó chạy lại 5 lần liền, cả 5 lần đều PASS. **Lỗi lúc đầu thuộc về test, không thuộc về ứng dụng.**
- Tôi cũng sửa hai selector cũ không còn khớp cấu trúc mới:
  - Ô mô tả trong dropdown dùng cho test tương phản.
  - Accordion trong Drawer.

  Từ giờ, selector không khớp sẽ làm test báo FAIL, không còn bị bỏ qua.

## 3. Đối chiếu từng mã lỗi

Mã lỗi giữ theo [báo cáo gốc](bao-cao-kiem-tra-2A.md). Cột "Mã của Antigravity" dùng cách đánh số trong `2a-fix-handoff.md`.

### P1

| ID | Mã của Antigravity | Trạng thái | Kỳ vọng / Thực tế | Bằng chứng |
|---|---|---|---|---|
| P1-1 | P1-1 | **PASS** | Ở 320px (cả viewport thường lẫn `isMobile`): `innerWidth` 320, `scrollWidth` ≤ 320. Nút Menu nằm trọn trong màn hình và mở được Drawer. CTA thu gọn thành "Đặt lịch" | [p1-1-header-320.png](2a-retest-01-evidence/p1-1-header-320.png) |
| RESP | Suite 2 | **PASS** | Trang chủ, ComingSoon và 404 ở 320, 390, 768, 1366 và 1440px: 15/15 không tràn, `innerWidth` đúng bằng viewport yêu cầu | [resp-comingSoon-320](2a-retest-01-evidence/resp-comingSoon-320.png), [resp-notFound-320](2a-retest-01-evidence/resp-notFound-320.png), [resp-home-768](2a-retest-01-evidence/resp-home-768.png) |
| P1-2 | P1-2 | **PASS** | ComingSoon ở 1440px: khung và phụ đề ≤ 800px. Trang 404 ≤ 800px. Drawer ở 768px ≤ 480px. Build có `--container-sm:24rem` và `--radius-xl:.75rem`. Hồi quy 2B: không tràn ở 5 viewport. Chưa đối chiếu chi tiết thiết kế từng section | [coming-soon-1440](2a-retest-01-evidence/p1-2-coming-soon-1440.png), [404-1440](2a-retest-01-evidence/p1-2-404-1440.png), [drawer-768](2a-retest-01-evidence/p1-2-drawer-768.png) |
| P1-3 | P1-3 | **FAIL** | Xem chi tiết ở mục 4.1. Có 6 test FAIL: hai `aria-current` ở `/`, hai mục trong dropdown ở `/dich-vu/spa`, mục tin tức không phải trang hiện tại ở `?cat=news`, và 3 URL 404 có tiền tố giống tuyến thật vẫn tô nhóm. Phần đạt: nhóm "Dịch vụ" và "Câu chuyện" được tô đúng; Drawer đánh dấu Spa đúng | `measurements.json`, id `P1-3` |
| P1-4 | P1-4 | **FAIL** | Kỳ vọng: rê chuột rồi bấm vẫn mở submenu. Thực tế: `aria-expanded` sau khi rê là `true`, sau khi bấm là `false`, submenu biến mất. Bàn phím (Enter, Escape, trả focus) thì đạt | [p1-4-hover-click-1280.png](2a-retest-01-evidence/p1-4-hover-click-1280.png) |
| P1-5 | P1-5 | **PASS** | Mở ở 900px rồi đổi sang 1180px: Drawer đóng, `overflow` được gỡ, cuộn được, Tab không bị giữ trong phần tử ẩn. Quay lại 390px vẫn mở được. Nút Menu có `aria-expanded` và `aria-controls` hợp lệ | [p1-5-resize-1180.png](2a-retest-01-evidence/p1-5-resize-1180.png) |
| Drawer | Suite 3 | **PASS** | Tab ×30 và Shift+Tab ×30 không thoát dialog. Escape đóng, trả focus về nút Menu, khôi phục `overflow` và vị trí cuộn. Chọn link thì Drawer đóng và chuyển đúng tuyến | [drawer-open-390.png](2a-retest-01-evidence/drawer-open-390.png) |
| P1-6 | P1-6 | **PASS** | Có link `/lien-he` và `/dich-vu` ở desktop và trong Drawer; bấm `/lien-he` đến đúng tuyến. Link tin tức dùng `?cat=news`, không còn `?tab=`. ComingSoon có CTA "Xem thông tin Liên hệ". Ở 390px có hotline hiển thị trong màn hình đầu | e2e log |
| P1-7 | P1-7 | **PASS ở phía client, BLOCKED ở HTML gốc** | Title riêng theo tuyến; noindex đúng qua chuyển trang, về trang chủ, Back/Forward và 404. `robots.txt` trả `text/plain` có đủ 3 dòng Disallow. `sitemap.xml` hợp lệ, chỉ chứa `/`. HTML gốc của `/gioi-thieu` **không có** noindex (xem mục 4.3) | `measurements.json`, id `P1-7` |
| P1-8 | P1-8 | **BLOCKED, có rủi ro** | Chưa chốt host nên chưa kiểm được trên host đích. Các tệp tạo sẵn có vấn đề, xem mục 4.2 | [hosting-404html-sim.json](2a-retest-01-evidence/hosting-404html-sim.json) |

### P2 và P3

| ID gốc | Mã của Antigravity | Trạng thái | Ghi chú |
|---|---|---|---|
| P2-1 Tương phản | P2-9 | **PASS** | Đo bằng màu computed, có tính cả nền nhiều lớp. Footer phụ đề 8.19:1. Hotline Footer 5.77:1. Link Cấp cứu 6.58:1. Hotline Header 6.85:1. Mô tả dropdown 9.19:1 |
| P2-2 Tab rời dropdown | trong P1-4 | **PASS** | Sau khi Tab qua hết, submenu đóng |
| P2-3 Focus và thông báo khi chuyển trang | P2-10 | **PASS (DOM)** | Focus vào `main#main-content`, có `aria-live` thông báo. Chưa thử với trình đọc màn hình thật |
| P2-4 Lớp CSS không có hiệu ứng | P2-11 | **PASS** | Không còn `animate-in`, `fade-in`, `slide-in-*` hay `py-0.2` trong DOM, kể cả Drawer và dropdown |
| P2-5 Safe-area | P2-12 | **PASS (CSS)** | Inline style có `env(safe-area-inset-bottom)`. Chưa thử trên iPhone thật |
| Giảm chuyển động | | **PASS** | |
| P3 Gom dữ liệu liên hệ | P3-13 | **PASS (đọc mã)** | `src/config/contact.ts`. Lưu ý: chú thích trong tệp ghi "Sourced from verified hospital registration data", nhưng chưa có bằng chứng xác minh trong repo |
| P3 README và tệp mồ côi | P3-14, P3-15 | **PASS** | |
| P3 Tối ưu logo và favicon | | **NOT FIXED** | `public/images/logo.png` vẫn nặng 376,788 byte và vẫn dùng làm favicon. Antigravity không nhận mục này |
| P3 Xác nhận địa chỉ và giờ khám | | **BLOCKED (nội dung)** | Chờ chủ bệnh viện xác nhận. Xem thêm mục 4.4 về JSON-LD |

## 4. Phát hiện chi tiết

### 4.1 P1-3: so khớp tuyến không xét ranh giới (FAIL)

**Vị trí:**

- `src/components/layout/Header.tsx:137-140`: `isCurrentPath` dùng `location.pathname.startsWith(path)`.
- `Header.tsx:188`: `isGroupActive` dùng `startsWith(prefix)`.
- `Header.tsx:150` và `:175`: logo và "Trang chủ" đều đặt `aria-current`.
- `src/components/layout/MobileNav.tsx:117-120`: `isCurrent` có cùng kiểu so khớp. Phần Drawer mới kiểm bằng đọc mã, E2E chưa phủ trường hợp ranh giới.

**Tái hiện ở 1280px (mở dropdown bằng Enter):**

| URL | Kỳ vọng | Thực tế |
|---|---|---|
| `/` | Chỉ "Trang chủ" có `aria-current` | Logo **và** "Trang chủ" đều có `aria-current` |
| `/dich-vu/spa` | Trong dropdown chỉ `/dich-vu/spa` có `aria-current` | `["/dich-vu", "/dich-vu/spa"]` |
| `/goc-thu-cung?cat=news` | Mục tin tức có `aria-current` | Chỉ `["/goc-thu-cung"]` có. Phần query bị bỏ qua, mục tin tức không bao giờ được đánh dấu |
| `/dich-vu-khong-ton-tai` | Trang 404, không tô nhóm nào | Nhóm "Dịch vụ" được tô (màu `rgb(90,30,94)`, weight 600) |
| `/cau-chuyenxyz` | Trang 404, không tô mục nào | "Câu chuyện" có `aria-current="page"` |
| `/gioi-thieu-abc` | Trang 404, không tô nhóm nào | Nhóm "Về Lê Sơn" được tô |

**Ảnh hưởng:** trình đọc màn hình đọc hai mục cùng là trang hiện tại. Trang 404 lại hiển thị như thể người dùng đang ở một mục có thật. Brief sửa lỗi (mục 3, dòng P1-3) đã yêu cầu rõ phải "so khớp theo ranh giới route, tránh startsWith nhận nhầm tiền tố; không gán nhiều link là trang hiện tại".

**Hướng sửa:**

- Viết hàm so khớp dạng `p === base || p.startsWith(base + '/')`.
- Mục "Tất cả dịch vụ" (`/dich-vu`) và "Kiến thức chăm sóc" (`/goc-thu-cung`) chỉ được là trang hiện tại khi khớp chính xác, đồng thời phải xét cả query (`cat=news`).
- Bỏ `aria-current` khỏi logo.
- Dùng chung một hàm này cho Header và MobileNav.

### 4.2 P1-8: cấu hình hosting tạo sẵn khi chưa chọn host (BLOCKED, có rủi ro)

Brief sửa lỗi ghi: *"Chưa chọn host: giữ trạng thái chờ quyết định, không tự thêm cấu hình cho nhiều host."* Ở SHA này, Antigravity đã thêm cùng lúc `vercel.json`, `public/_redirects` và `public/404.html`. Hai tệp sau được build chép vào `dist` và sẽ có mặt trên **mọi** host.

| Tệp | Đánh giá | Mức độ |
|---|---|---|
| `public/404.html` | **Lỗi, đã tái hiện bằng mô phỏng.** Tệp gán `sessionStorage.redirect = location.href` rồi dùng `meta refresh` chuyển về `/`. **Không có mã nào đọc `sessionStorage.redirect`** (`git grep` trong `src` không có kết quả). Mô phỏng bằng server tĩnh trả `404.html` cho đường dẫn không có tệp: `/gioi-thieu`, `/dich-vu/spa` và `/khong-ton-tai` đều trả **404** trước, rồi dừng lại ở `/` hiển thị trang chủ (3/3). Trên GitHub Pages, nghĩa là mọi link chia sẻ, F5 hay URL sai đều về trang chủ, và trang 404 của app không bao giờ hiện. Thẻ `<meta …></meta>` còn sai cú pháp. | Cao nếu chọn GitHub Pages |
| `public/404.html` trên Cloudflare Pages | **Chưa kiểm chứng.** Theo tài liệu Cloudflare Pages, khi `dist` có `404.html` ở gốc, Pages không còn mặc định coi dự án là SPA. Còn phụ thuộc vào việc `_redirects` có được áp dụng không. Cần thử khi chốt host | Rủi ro |
| `public/_redirects` (`/* /index.html 200`) | Cú pháp đúng cho Netlify. Netlify phục vụ tệp có sẵn trước, nên `robots.txt`, `sitemap.xml` và asset không bị ảnh hưởng. Mọi URL sai trả 200 (soft 404), chỉ được giảm nhẹ bằng noindex phía client. Chưa chạy trên Netlify | Chấp nhận được nếu chọn Netlify |
| `vercel.json` (rewrite `/(.*)` về `/index.html`) | Vercel ưu tiên tệp tĩnh trước rewrite, nên `robots.txt` và asset vẫn đúng. URL sai trả 200 (soft 404). Chưa chạy trên Vercel | Chấp nhận được nếu chọn Vercel |

**Đề nghị:**

- Gỡ `public/404.html` (và `_redirects`/`vercel.json` không dùng tới) cho tới khi người dùng chốt host, đúng như brief.
- Khi đã chốt host, chỉ giữ cấu hình của host đó.
- Nếu chọn GitHub Pages, phải có mã đọc `sessionStorage.redirect` trong `main.tsx` để khôi phục URL, rồi chạy nhóm P1-8 với `HOST_URL`.

### 4.3 P1-7: giới hạn của noindex phía client

- **Phía client đạt.** `useRouteSeo` đặt title, description, robots và canonical theo tuyến:
  - Trang chủ: `index, follow`.
  - Trang chờ và 404: `noindex, nofollow`.

  Kết quả đúng qua chuyển trang, về trang chủ và Back/Forward, 5/5 lần chạy.
- **HTML gốc không có thẻ robots.** Request `/gioi-thieu` trả về HTML chỉ có metadata của `index.html`. Crawler không chạy JavaScript, hoặc chạy chậm, sẽ thấy trang chờ như một trang có thể index. Test tương ứng ghi **BLOCKED**: cần phương án prerender hoặc header `X-Robots-Tag` tại host đã được duyệt. Không coi đây là đã giải quyết.
- **Canonical chỉ có ở phía client.** Trang 404 và trang chờ vừa noindex vừa có canonical trỏ về chính URL đó. Hai tín hiệu này mâu thuẫn ở mức nhẹ (P3). Với trang 404, canonical trỏ tới URL sai, nên bỏ.
- `robots.txt` **không phải biện pháp bảo mật**. Các trang `/tai-khoan/*` hiện chỉ là trang chờ, chưa có phân quyền. Ẩn trên giao diện hay chặn bằng `robots.txt` không bảo vệ dữ liệu.

### 4.4 Phát hiện mới ngoài 8 lỗi P1

| ID mới | Mức | Mô tả |
|---|---|---|
| R1-1 | P2 | `index.html:13-45` thêm JSON-LD `VeterinaryCare` **tĩnh trên mọi tuyến**, kể cả trang chờ và 404. JSON-LD có địa chỉ "Phường Nhân Chính, Quận Thanh Xuân" và giờ khám 08:00–21:00. `PROJECT_BRIEF.md` mục 3 ghi đây là dữ liệu kế thừa, chưa được xác minh lại. Cần chủ bệnh viện xác nhận (kể cả đơn vị hành chính sau đợt sắp xếp năm 2025) trước khi công bố dữ liệu có cấu trúc |
| R1-2 | P3 | Ở desktop 1440px có thanh cuộn (`clientWidth` khoảng 1425px), hotline trên Header bị ẩn, vì Antigravity ẩn hotline trong khoảng 1024–1439px. Hotline vẫn có ở Hero và Footer, nên không chặn sử dụng. Cần ChatGPT/người dùng chốt có giữ hotline trên Header desktop không |

## 5. Đánh giá độ đầy đủ của bộ E2E của Antigravity

Tôi chạy lại `scripts/qa/run-e2e-2a.mjs` nguyên trạng, kết quả 24/24 PASS và exit 0. So với [quy trình E2E](2a-e2e-protocol.md):

| Yêu cầu của quy trình | Bộ của Antigravity | Hệ quả |
|---|---|---|
| Thao tác giống người dùng | Dùng `element.click()` và `dispatchEvent(KeyboardEvent)` trong trang, không có bước rê chuột hay bấm phím thật | **Bỏ sót P1-4**: lỗi rê chuột rồi bấm không thể lộ ra |
| Không dùng sleep cố định | Có 27 lệnh `setTimeout` (300–1000ms) | Dễ chập chờn, trái quy trình mục 3 |
| Responsive cho trang chủ, ComingSoon và 404 ở 5 viewport | ComingSoon và 404 chỉ đo ở 1440px. Ở 768/1366/1440px có thanh cuộn nên `scrollWidth` < viewport, không lộ được việc tự nới viewport | Thiếu 8 tổ hợp |
| Drawer: Tab/Shift+Tab, trả focus, khôi phục cuộn | Chỉ kiểm Escape đóng Drawer | Thiếu kiểm tra focus trap |
| Trạng thái hiện tại ở route con và query tin tức | Chỉ kiểm `aria-current` của "Trang chủ" ở `/`, và không phát hiện logo cũng có `aria-current` | **Bỏ sót P1-3** |
| Meta qua Back/Forward | Không có | |
| `robots.txt` và `sitemap.xml` qua HTTP, đúng Content-Type | Đọc tệp `public/` từ đĩa bằng `fs.readFileSync` | Không chứng minh được tệp có được phục vụ đúng |
| Dừng khi lỗi | Ném lỗi ở FAIL đầu tiên rồi `exit 1` | Các suite sau không chạy, không có tổng số trượt/bỏ qua |
| Phụ thuộc môi trường | Cần Chrome mở sẵn cổng CDP 9222. `BASE_URL` gán cứng | |

**Đề nghị:** dùng [tests/e2e/2a.e2e.test.cjs](../../tests/e2e/2a.e2e.test.cjs) (53 test, assertion qua `node:test`, thao tác chuột và bàn phím thật qua Playwright), hoặc nâng cấp bộ hiện có cho tương đương. Khi muốn đưa `@playwright/test` vào repo thì đề xuất riêng.

## 6. Danh sách sửa cho Antigravity

1. **P1-4:** bỏ việc đảo trạng thái khi bấm nếu menu đang mở do rê chuột, hoặc bỏ hẳn mở bằng hover. Phải đạt test "rê chuột rồi bấm vẫn truy cập được submenu".
2. **P1-3:** so khớp tuyến theo ranh giới (`=== base` hoặc `startsWith(base + '/')`). "Tất cả dịch vụ" và "Kiến thức chăm sóc" chỉ khớp chính xác và có xét query `cat=news`. Bỏ `aria-current` khỏi logo. Dùng chung một hàm cho Header và MobileNav. Phải đạt 6 test P1-3 đang FAIL.
3. **P1-8:** gỡ `public/404.html` (và các cấu hình host không dùng) cho tới khi chốt host. Nếu giữ phương án GitHub Pages, phải có mã khôi phục `sessionStorage.redirect`, và `tests/e2e/hosting-404html-sim.cjs` phải exit 0.
4. **R1-1:** tạm gỡ JSON-LD hoặc gắn cờ chờ xác nhận, cho tới khi chủ bệnh viện duyệt địa chỉ và giờ khám.
5. **P3:** bỏ canonical ở trang 404; tối ưu logo và favicon; sửa thẻ `<meta>` sai cú pháp nếu còn giữ `404.html`.
6. Bàn giao SHA mới. Claude sẽ chạy `2a-retest-02` bằng cùng bộ test.

## 7. Chưa kiểm chứng

- **Host đích:** BLOCKED. Chỉ có mô phỏng `404.html` trên server tĩnh. Chưa chạy trên Vercel, Netlify, Cloudflare Pages hay GitHub Pages thật.
- **noindex trong HTML gốc:** BLOCKED, cần phương án prerender hoặc header được duyệt.
- **Thiết bị thật:** iOS Safari, Android, vùng safe-area thật và khóa cuộn trên iOS.
- **Trình đọc màn hình thật:** NVDA, VoiceOver.
- **QA chi tiết 6 section 2B:** chỉ kiểm hồi quy tràn ngang và độ rộng sau khi sửa token.
- **Lighthouse và Core Web Vitals.**
- **Môi trường Node:** Node 22, khác Node 24 ghi trong tài liệu. Lint và build vẫn xanh.
