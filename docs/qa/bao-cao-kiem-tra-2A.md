# Báo cáo QA mốc 2A, lần 3: có chạy kiểm tra thực tế

- **Website:** Bệnh viện Thú y Lê Sơn
- **Repository:** `lqt140304-rgb/webchinhthuc`
- **SHA được kiểm tra:** `c2e5361defb0d151bf14c8153a341072060c2e42` (`origin/main`)
  - Mã nguồn giống hệt `c8a58da`. Hai commit sau đó chỉ thêm `AGENTS.md` và `PROJECT_BRIEF.md`.
- **Ngày kiểm tra:** 25/10/2026
- **Người kiểm tra:** Claude (QA reviewer, theo `AGENTS.md`)
- **Thay thế:** các báo cáo lần 1 và lần 2

## 0. Môi trường và phạm vi

| Mục | Giá trị |
|---|---|
| Bản sao | `git archive c2e5361` được giải nén vào scratchpad, tách khỏi repo gốc |
| Cài đặt | `npm ci` theo lockfile. Đã xác nhận lockfile của bản sao trùng byte với lockfile tại `c2e5361`. Không thêm và không nâng phiên bản thư viện nào |
| Node / npm | v22.22.0 / 10.9.4. `docs/architecture.md` ghi Node v24, nên đây là một sai khác môi trường |
| Vite (từ lockfile) | 8.3.5 |
| Trình duyệt | Chromium headless qua Playwright 1.63.0 |
| Server | `vite preview` (có fallback SPA) và `python3 -m http.server` trên thư mục `dist` (giả lập host tĩnh không có fallback) |
| Repo gốc | Không sửa gì. `git status` sạch, nhánh `claude/dreamy-johnson-va24be` không đổi, không commit và không push |

**Trạng thái mốc, theo quyết định của người dùng:** 2A **chưa đạt, chờ sửa các lỗi trong báo cáo QA**. 2B vẫn chờ duyệt. Chưa bắt đầu giai đoạn 3.

---

## 1. Kết quả chạy lệnh

| Lệnh | Exit code | Kết quả |
|---|---|---|
| `npm ci` | 0 | Đã cài theo lockfile |
| `npx oxlint` (`npm run lint`) | **0** | Không có cảnh báo |
| `npx tsc -b` | **0** | Không có lỗi |
| `npm run build` | **0** | `index.html` 1.15 kB, CSS 51.36 kB (gzip 9.62), JS 338.45 kB (gzip 99.58), build 1.47s |
| Console error / pageerror trên 7 viewport | 0 | Không có lỗi |

Build xanh không chứng minh giao diện hay a11y đã đạt, đúng như `PROJECT_BRIEF.md` mục 7 lưu ý.

---

## 2. Kết quả kiểm tra trình duyệt theo tiêu chí ở mục 7

| Tiêu chí | Kết quả đo | Đánh giá |
|---|---|---|
| Tràn ngang ở 320px (viewport thường) | `innerWidth` 320, `scrollWidth` **368**. Cụm phải của Header nằm ở 189..368px, nút Menu ở **328..368px** | **KHÔNG ĐẠT** |
| 320px khi giả lập mobile | `innerWidth` bị nới thành **369**, trùng con số Antigravity báo là "PASS" | **KHÔNG ĐẠT**. Phép đo cũ sai |
| 390, 768, 1366, 1440px | `scrollWidth` bằng đúng viewport, không có phần tử tràn | Đạt |
| Drawer: mở, focus vào nút đóng | Có `role=dialog`, `aria-modal`. Focus vào "Đóng menu điều hướng" | Đạt |
| Drawer: focus trap | Bấm Tab 40 lần và Shift+Tab 40 lần, focus không thoát ra ngoài | Đạt |
| Drawer: Escape, trả focus, khôi phục cuộn | Drawer đóng, focus về nút Menu, `overflow` được khôi phục, vị trí cuộn giữ ở 1500 | Đạt |
| Drawer: chuyển trang qua link | Drawer đóng, vào đúng `/dich-vu/spa`, cuộn lên đầu, `overflow` được khôi phục | Đạt |
| Drawer: đổi kích thước từ 900 lên 1180px khi đang mở | Drawer ẩn nhưng `body.overflow` vẫn là `hidden`; cuộn chuột không làm trang di chuyển (`scrollY` vẫn 0) | **KHÔNG ĐẠT** |
| Dropdown: rê chuột rồi bấm | Rê chuột: `aria-expanded=true`. Bấm: `false`, menu biến mất | **KHÔNG ĐẠT** |
| Dropdown: bàn phím | Mũi tên xuống lần 1 mở menu, lần 2 focus "Khám & điều trị", Escape đóng và trả focus về nút | Đạt |
| Dropdown: Tab rời khỏi menu | Focus đã sang "Câu chuyện" mà menu vẫn mở | Chưa đạt (P2) |
| Trạng thái điều hướng | Có **0** phần tử `aria-current`. Ở `/dich-vu/spa` và `/cau-chuyen/abc`, mọi mục đều có font-weight 500 | **KHÔNG ĐẠT** |
| noindex trên trang chờ | `/` không có thẻ → `/gioi-thieu` có noindex → `/bang-gia` có noindex → về `/` thẻ bị gỡ → Back về `/bang-gia` có noindex lại | Đạt ở phía client |
| noindex trong HTML gốc | `/gioi-thieu` trả về HTML **không có** thẻ robots | **KHÔNG ĐẠT** |
| Trang 404 | Đúng nội dung, nhưng **không có** noindex. `title` giống trang chủ | **KHÔNG ĐẠT** |
| `document.title` theo tuyến | Mọi tuyến dùng chung một title | **KHÔNG ĐẠT** |
| `robots.txt`, `sitemap.xml` | Không tồn tại. Server trả về HTML của SPA | **KHÔNG ĐẠT** |
| Mở thẳng URL trên host tĩnh | `/` trả 200. `/gioi-thieu`, `/dich-vu/spa`, `/abc` trả **404 của server** | **KHÔNG ĐẠT** với GitHub Pages hoặc host không có fallback |
| Link tới `/lien-he` | **0** link trên toàn trang | **KHÔNG ĐẠT** |
| Link tới `/dich-vu` | Chỉ có 1 link, ở section 2B ("Xem tất cả dịch vụ") | Chưa đạt |
| `?tab=news` | Hiển thị đúng trang chờ "Góc thú cưng", tham số bị bỏ qua | Lệch tài liệu (`?cat=news`) |
| Thanh hành động dưới đáy (390px) | `position: fixed`, cao 57px, `padding-bottom` 10px, không có safe-area. Footer có `pb-24` nên không bị che | Đạt một phần |
| Giảm chuyển động | Có `prefers-reduced-motion: reduce`: transition của header là 0.00001s | Đạt |
| Ảnh | 13 ảnh. Sau khi chờ lazy-load đủ, toàn bộ tải được và đều có `alt` | Đạt |
| Tương phản màu | Xem lỗi P2-1 | **KHÔNG ĐẠT** |

**Ảnh chụp** nằm tại `/tmp/claude-0/-home-user-webchinhthuc/1900487a-6900-57f5-abbe-3137ea7f2a0f/scratchpad/qa/shots/`:

| Nhóm | Tệp |
|---|---|
| Trang chủ, phần đầu | `home-top-{320,320-mobile,390,390-mobile,768,1366,1440}.png` |
| Trang chủ, toàn trang | `home-full-{320,390,768,1366,1440}.png` |
| Header 320px | `header-320.png` |
| Drawer | `drawer-open-390.png`, `drawer-open-768.png`, `drawer-resized-1180.png` |
| Dropdown và trạng thái nav | `dropdown-after-hover-click-1280.png`, `nav-active-dichvu-spa-1280.png` |
| Trang chờ và 404 | `coming-soon-1440.png`, `404-1440.png`, `static-host-deeplink-gioi-thieu.png` |
| Khác | `footer-bottombar-390.png`, `article-card-1366.png` |

Dữ liệu đo thô nằm ở `qa/qa-result.json`. Script kiểm tra: `qa/qa.js` và `qa/qa2.js`.

---

## 3. Tám lỗi P1

### P1-1. Nút Menu bị đẩy ra ngoài màn hình ở 320px, nên không thể điều hướng

*Lỗi nghiêm trọng nhất trong đợt này.*

- **Vị trí:** `src/components/layout/Header.tsx:127-318`.
  - Cụm phải `div.flex.items-center.gap-2…` (dòng 270) chứa nút hotline (ẩn dưới 640px), nút `Đặt lịch khám` có `whitespace-nowrap` (dòng 300-306) và nút Menu (dòng 309-318).
  - Kết hợp với `body{overflow-x:hidden}` ở `src/styles/globals.css:22`, phần tràn bị cắt mất.
- **Tái hiện:** mở `/` ở viewport 320×568.
  - Cụm phải nằm ở 189..368px, nút Menu ở 328..368px, tức hoàn toàn ngoài màn hình.
  - `document.elementFromPoint(310, 40)` trả về link CTA, không phải nút Menu.
  - Ảnh: `header-320.png` chỉ thấy logo và "Đặt lịch khám", không có nút Menu.
- **Ảnh hưởng:** trên điện thoại 320px (iPhone SE thế hệ 1, một số máy Android nhỏ, hoặc trình duyệt phóng to 200% trên máy 640px), người dùng **không mở được menu và không vào được trang nào** ngoài trang chủ. Thanh dưới đáy chỉ có gọi điện và đặt lịch. Ngoài ra kiểm tra QA cũ đã báo PASS sai.
- **Hướng sửa:**
  - Dưới khoảng 380px, ẩn dòng "BỆNH VIỆN THÚ Y" hoặc thu nhỏ khối chữ thương hiệu.
  - Trên Header mobile, đổi nút "Đặt lịch khám" thành nút chỉ có icon kèm `aria-label`, hoặc bỏ hẳn vì thanh dưới đáy đã có CTA này.
  - Cho nút Menu `shrink-0` và đặt nó trước CTA theo thứ tự ưu tiên.
  - Sửa `scripts/test-and-capture-2b.mjs:70-74` để so `scrollWidth` với `vp.w` chứ không phải `window.innerWidth`, và kiểm tra thêm việc nút Menu nằm trong viewport.
- **Chưa kiểm chứng:** máy thật, và chế độ phóng to văn bản của hệ điều hành.

### P1-2. Token trùng namespace Tailwind làm sai `max-w-*` và `rounded-*`

- **Vị trí:** `src/styles/tokens.css:109-130` khai báo `--container-sm..2xl` và `--radius-xs..2xl` trong `:root`, ngoài `@theme`.
- **Bằng chứng từ build:**
  - Trong `dist/assets/index-*.css`, giá trị mặc định `--container-sm:24rem` nằm trong `@layer theme > :root,:host`.
  - Bản ghi đè `--container-sm:640px` nằm ở `:root` **không thuộc layer nào**, nên luôn thắng.
  - Tiện ích được sinh ra là `.max-w-sm{max-width:var(--container-sm)}` và `.rounded-xl{border-radius:var(--radius-xl)}`.
- **Tái hiện và số đo:**
  - Ở `/gioi-thieu` 1440px, khung ComingSoon có `max-width: 1440px` (mong đợi 672px). Phụ đề kéo dài **1376px** trên một dòng.
  - Trang 404 có `max-width: 1280px` (mong đợi 576px).
  - Drawer ở 768px rộng **640px** (mong đợi 384px).
  - CTA có `border-radius: 24px` (mong đợi 12px; tài liệu ghi 10px).
  - Ảnh: `coming-soon-1440.png`, `drawer-open-768.png`.
- **Ảnh hưởng:** sai bố cục trên toàn site. Dòng chữ quá dài làm giảm khả năng đọc. Drawer che gần hết màn hình tablet. Độ bo góc lệch design system. Mọi `max-w-*` và `rounded-*` của 2B cũng bị ảnh hưởng.
- **Hướng sửa:**
  - Đổi tên các token sang namespace riêng, ví dụ `--ls-container-*` và `--ls-radius-*`.
  - Nếu muốn Tailwind dùng thang riêng, khai báo trong `@theme` bằng tên tiện ích chủ ý, ví dụ `--radius-btn: 10px`, rồi dùng `rounded-btn`.
  - Sau khi sửa, chụp lại 3 màn trên.
- **Chưa kiểm chứng:** chưa rà ảnh hưởng chi tiết lên từng section 2B.

### P1-3. Không có trạng thái "trang hiện tại" trong điều hướng

- **Vị trí:** `Header.tsx:155-266`. Chỉ có so sánh đúng bằng `pathname === '/'` và `=== '/cau-chuyen'`. Nút nhóm dropdown chỉ đổi kiểu khi `isOpen`. `MobileNav.tsx` không có trạng thái này.
- **Tái hiện:** ở 1280px mở `/dich-vu/spa` hoặc `/cau-chuyen/abc`.
  - Có 0 phần tử `[aria-current]`.
  - Cả 5 mục điều hướng đều có `font-weight: 500`, không mục nào được nhấn mạnh.
  - Ảnh: `nav-active-dichvu-spa-1280.png`.
- **Ảnh hưởng:** người dùng không biết mình đang ở mục nào. Trình đọc màn hình không thông báo trang hiện tại. Không đạt tiêu chí "trạng thái điều hướng" của 2A.
- **Hướng sửa:**
  - Dùng `NavLink` (có `aria-current="page"` tự động) cho các link đơn.
  - Với nhóm dropdown, tính `group.items.some(i => pathname.startsWith(i.href.split('?')[0]))` để tô nút nhóm.
  - "Câu chuyện" so khớp theo `startsWith('/cau-chuyen')`.
  - Áp dụng tương tự trong Drawer, và tự mở sẵn nhóm chứa trang hiện tại.

### P1-4. Rê chuột rồi bấm vào nút dropdown thì menu đóng lại

- **Vị trí:** `Header.tsx:176` (`onMouseEnter` mở menu) và `Header.tsx:188` (`onClick` đảo trạng thái).
- **Tái hiện:** ở 1280px, rê chuột vào "Dịch vụ".
  - Lúc này `aria-expanded="true"`.
  - Bấm vào nút: `aria-expanded="false"`, menu bị gỡ khỏi DOM.
  - Ảnh: `dropdown-after-hover-click-1280.png`.
- **Ảnh hưởng:** thao tác tự nhiên nhất với chuột là rê rồi bấm, nhưng nó lại đóng menu. Người dùng có thể nghĩ menu bị hỏng.
- **Hướng sửa:** bỏ mở bằng hover, chỉ mở bằng click và bàn phím theo mẫu disclosure. Nếu vẫn giữ hover, thì `onClick` phải luôn mở (`setActiveDropdown(group.id)`) khi menu đang mở do hover, và chỉ đóng bằng click lần hai, bấm ra ngoài hoặc Escape.

### P1-5. Đổi kích thước lên ≥1024px khi Drawer mở thì trang bị khóa cuộn

- **Vị trí:**
  - `MobileNav.tsx:100` chỉ ẩn bằng CSS (`lg:hidden`), trong khi `isOpen` vẫn `true`.
  - Effect ở `MobileNav.tsx:25-50` giữ `body.style.overflow = 'hidden'`.
  - Trình bắt phím ở `:53-91` vẫn hoạt động.
- **Tái hiện:** mở `/` ở 900×800, bấm Menu, đổi viewport sang 1180×800, rồi cuộn chuột.
  - `body.style.overflow` vẫn là `"hidden"`, Drawer không hiển thị, `scrollY` vẫn 0.
  - Ảnh: `drawer-resized-1180.png`.
- **Ảnh hưởng:** iPad xoay sang ngang, hoặc người dùng desktop phóng to/thu nhỏ cửa sổ, sẽ thấy trang "đơ", không cuộn được và không có nút nào để thoát. Chỉ bấm Escape mới gỡ được, mà người dùng không biết điều đó.
- **Hướng sửa:** trong `RootLayout`, theo dõi `matchMedia('(min-width: 1024px)')` và gọi `setMobileMenuOpen(false)` khi điều kiện khớp. Đồng thời thêm `aria-expanded={mobileMenuOpen}` và `aria-controls` cho nút Menu, vì hiện cả hai đều là `null`.

### P1-6. Thiếu lối vào một số tuyến, và tài liệu lệch với mã

- **Vị trí:**
  - `Header.tsx:18-48` (`navGroups`), `MobileNav.tsx:146-327` và `Footer.tsx:46-115` đều không có `/lien-he`.
  - `/dich-vu` chỉ có trong section 2B.
  - `Header.tsx:44` và `MobileNav.tsx:292` dùng `?tab=news`, còn `docs/sitemap.md` mục 3 ghi `?cat=news`.
  - `ComingSoonView.tsx:63-84` chỉ có nút gọi hotline và "Quay lại Trang chủ", trong khi `docs/sitemap.md` mục 4 yêu cầu nút "Liên hệ tư vấn / Đặt lịch".
  - `Header.tsx:292` ẩn hotline dưới 640px, trong khi sitemap mục 3 yêu cầu thanh trên cùng mobile có hotline.
- **Tái hiện:**
  - Ở 1366px, `document.querySelectorAll('a[href="/lien-he"]').length` bằng **0**.
  - `a[href="/dich-vu"]` chỉ có 1 link, "Xem tất cả dịch vụ" trong section.
  - `/goc-thu-cung?tab=news` cho cùng nội dung với `/goc-thu-cung`.
- **Ảnh hưởng:** tuyến `/lien-he` có trong sitemap và router nhưng người dùng không tìm thấy. Điều hướng lệch đặc tả, nên khi làm giai đoạn 3 dễ phát sinh link sai.
- **Hướng sửa:**
  - Thêm "Liên hệ" vào Header (desktop và Drawer) và Footer.
  - Thêm "Tất cả dịch vụ" (`/dich-vu`) vào đầu dropdown Dịch vụ.
  - Thống nhất `cat` hay `tab` rồi cập nhật cả mã lẫn tài liệu.
  - Thêm nút "Liên hệ / Đặt lịch" vào ComingSoonView.
  - Với hotline trên thanh trên cùng mobile, hoặc hiển thị lại (dạng icon), hoặc ghi rõ trong tài liệu là đã chuyển xuống thanh dưới đáy.

### P1-7. SEO và noindex chỉ đúng ở phía client

- **Vị trí:**
  - `ComingSoonView.tsx:14-37`: logic gắn và gỡ noindex **chạy đúng** (đã đo, xem mục 2).
  - `index.html`: không có thẻ robots, không có canonical, chỉ có một `<title>`.
  - `src/pages/NotFoundPage.tsx`: không gắn noindex.
  - `public/`: không có `robots.txt` và `sitemap.xml`.
- **Tái hiện:**
  - `curl /gioi-thieu` trả về HTML không có `name="robots"`.
  - `/abc-khong-co` không có thẻ robots, và `document.title` vẫn là title của trang chủ.
  - `/robots.txt` trả về HTML của SPA.
  - Mọi tuyến đều có title "Bệnh viện Thú y Lê Sơn — Chăm Sóc Y Tế Thú Cưng Chuẩn Mực".
- **Ảnh hưởng:**
  - Crawler không chạy JavaScript có thể index các trang chờ. Googlebot có render JavaScript nhưng có độ trễ.
  - 404 thành soft 404 có thể bị index.
  - Title trùng nhau trên 20 tuyến, trái với ma trận trong `docs/seo-strategy.md`.
  - Thiếu robots.txt nên `/tai-khoan/`, `/dang-nhap` và `/dang-ky` không bị chặn như tài liệu quy định.
- **Hướng sửa:**
  - Thêm `title` (và `description` nếu cần) vào props hoặc route meta, rồi set `document.title` trong mỗi trang. React 19 hỗ trợ render `<title>` và `<meta>` ngay trong component.
  - `NotFoundPage` gắn `noindex`.
  - Thêm `public/robots.txt` đúng như `docs/seo-strategy.md` mục 3, và `public/sitemap.xml` chỉ chứa `/`.
  - Ghi rõ trong tài liệu rằng noindex là phía client. Nếu cần chắc chắn, lên kế hoạch prerender hoặc header `X-Robots-Tag` ở host.

### P1-8. Chưa có fallback SPA, nên mở thẳng hoặc tải lại trang con sẽ lỗi trên host tĩnh

- **Vị trí:** thư mục gốc và `public/`. Không có `vercel.json`, `_redirects` hay `404.html`. `docs/architecture.md` liệt kê cả GitHub Pages, Vercel và Cloudflare Pages.
- **Tái hiện:** phục vụ `dist/` bằng một static server không có fallback.
  - `/` trả 200.
  - `/gioi-thieu`, `/dich-vu/spa` và `/abc` trả **404 của server**, không phải ComingSoonView hay trang 404 của app.
  - Ảnh: `static-host-deeplink-gioi-thieu.png`.
  - `vite preview` có fallback nên không lộ lỗi này. Bảng QA của Antigravity chỉ chạy trên `vite preview`.
- **Ảnh hưởng:** link chia sẻ, bookmark, bấm F5 hay kết quả Google trỏ tới trang con sẽ hỏng ngay khi triển khai lên GitHub Pages hoặc Vercel nếu không cấu hình thêm.
- **Hướng sửa:** chốt nền tảng triển khai (thuộc quyết định của người dùng hoặc ChatGPT), rồi thêm cấu hình tương ứng:
  - Vercel: `vercel.json` với `{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}`.
  - Netlify: `_redirects` với `/* /index.html 200`.
  - GitHub Pages: sao chép `index.html` thành `404.html` lúc build. Lưu ý cách này trả HTTP 404 cho mọi trang con.
  - Cloudflare Pages: mặc định tự fallback khi không có `404.html`.
- **Chưa kiểm chứng:** chưa triển khai lên host thật.

---

## 4. Lỗi P2 và P3 (đã cập nhật theo số đo)

- **P2-1. Tương phản màu không đạt WCAG AA (4.5:1 cho chữ nhỏ)**, đo bằng màu computed trên trình duyệt:

  | Vị trí | Màu chữ / nền | Tỉ lệ |
  |---|---|---|
  | Footer, dòng chữ 10px màu orchid | `rgb(130,71,135)` trên `rgb(66,18,71)` | **2.27:1** |
  | Footer, link "Cấp cứu" 12px | `rgb(194,86,12)` trên plum | **3.29:1** |
  | Mô tả trong dropdown, 11px | `rgb(155,135,158)` trên trắng | **3.31:1** |
  | Nút hotline 12px trên Header | Cam trên nền ivory 95% | Script không phân tích được màu nền dạng `oklab`. Tính tay khoảng 4.2:1 |

  Số hotline 14px ở Footer nằm trên nền `white/5` phủ lên plum, nên tỉ lệ thực tế khoảng 3.3:1. Số 4.62 trong file JSON là do phân tích sai màu nền, không dùng được.
- **P2-2. Dropdown vẫn mở khi Tab rời khỏi nó.** Đã đo: focus đã ở "Câu chuyện" mà `aria-expanded` vẫn là `true`. Nên thêm xử lý `onBlur`/`focusout`. Ngoài ra `role="menu"` không phù hợp cho điều hướng trang, nên dùng mẫu disclosure.
- **P2-3. Chuyển trang không dời focus và không có thông báo cho trình đọc màn hình.** Đã xác nhận bằng mã. Chưa thử với trình đọc màn hình thật.
- **P2-4. Có lớp CSS không sinh ra hiệu ứng.**
  - `animate-in`, `fade-in`, `slide-in-*` **không có** trong CSS build, nên hiệu ứng mở Drawer và dropdown không chạy.
  - `active:scale-98` **có** sinh ra (Tailwind v4 chấp nhận số bất kỳ), nên tôi rút lại nhận định ở báo cáo trước rằng lớp này không hợp lệ.
  - `py-0.2` không có trong CSS build.
- **P2-5. Thanh dưới đáy không tính vùng an toàn của iPhone.** `padding-bottom` là 10px, không dùng `env(safe-area-inset-bottom)`. Chưa thử trên iOS thật, kể cả việc khóa cuộn bằng `overflow:hidden` trên iOS Safari.
- **P3:**
  - Hotline bị chép cứng ở 12 chỗ.
  - Địa chỉ, giờ khám và đơn vị hành chính sau sắp xếp năm 2025 cần chủ bệnh viện xác nhận.
  - `logo.png` nặng 377KB nhưng chỉ hiển thị 44px và còn dùng làm favicon.
  - `src/index.css` và `src/App.css` là tệp mồ côi.
  - `README.md` vẫn là nội dung mặc định của Vite.
  - Môi trường kiểm tra là Node 22, trong khi tài liệu ghi Node 24.
- **Tài liệu:** bảng ở mục 4 của `PROJECT_BRIEF.md` ghi 2A "đã hoàn tất và nghiệm thu". Cần sửa thành **"Chưa đạt — chờ sửa các lỗi trong báo cáo QA"** theo quyết định của người dùng. `docs/implementation-plan.md` cũng cần cập nhật tương tự.

### Điểm đã đạt

- Lint, tsc và build đều xanh. Không có lỗi console.
- Không tràn ngang ở 390, 768, 1366 và 1440px.
- Drawer: focus trap, Escape, trả focus, khôi phục cuộn và đóng khi chuyển trang đều chạy đúng.
- Dropdown dùng bàn phím (mũi tên xuống, Escape, trả focus) chạy đúng.
- Vòng đời noindex trên trang chờ đúng ở phía client, kể cả khi dùng nút Back.
- Hỗ trợ `prefers-reduced-motion`.
- 13 ảnh tải được và đều có `alt`.
- Form đặt lịch hiển thị trung thực là bản mẫu và hướng người dùng gọi hotline. **Đây không phải tính năng đã hoạt động.**
- `/dang-nhap`, `/dang-ky` và `/tai-khoan/*` chỉ là trang chờ, chưa có phân quyền. Ẩn trên giao diện không phải là bảo vệ dữ liệu.

---

## 5. Chưa kiểm chứng

- Thiết bị thật: iOS Safari, Android Chrome, vùng an toàn, khóa cuộn trên iOS.
- Trình đọc màn hình thật: NVDA, VoiceOver.
- Triển khai trên host thật và HTTP status thật của trang 404.
- Lighthouse, Core Web Vitals và hiệu năng ảnh.
- Kiểm tra chi tiết từng section 2B (ngoài phạm vi 2A). Chỉ ghi nhận rằng lỗi P1-2 ảnh hưởng toàn site.
- Các thay đổi chưa push trong `D:\webbvct` sau SHA `c2e5361`.

---

## 6. Danh sách sửa để chuyển cho Antigravity, theo thứ tự ưu tiên

1. **P1-1:** sửa Header ở 320px để nút Menu luôn nằm trong viewport. Sửa script QA để so với `vp.w` và kiểm tra vị trí nút Menu.
2. **P1-2:** đổi tên `--container-*` và `--radius-*` trong `tokens.css`. Chụp lại ComingSoon 1440px, 404 và Drawer 768px.
3. **P1-5:** tự đóng Drawer khi màn hình đạt ≥1024px. Thêm `aria-expanded` và `aria-controls` cho nút Menu.
4. **P1-4:** sửa xung đột giữa hover và click của dropdown.
5. **P1-3:** dùng `NavLink`, `aria-current` và tô nhóm theo `startsWith`, cho cả desktop và Drawer.
6. **P1-6:** thêm link `/lien-he` và `/dich-vu`. Thống nhất `cat`/`tab`. Thêm CTA vào ComingSoon. Xử lý hotline trên thanh trên cùng mobile.
7. **P1-7:** title theo tuyến, noindex cho trang 404, `robots.txt` và `sitemap.xml`, ghi chú về noindex phía client.
8. **P1-8:** chốt host rồi thêm cấu hình fallback SPA. Kiểm tra lại bằng static server không có fallback.
9. **P2:** tương phản, `focusout` cho dropdown, quản lý focus khi chuyển trang, plugin animate (hoặc bỏ các lớp đó) và sửa `py-0.2`, safe-area.
10. **P3 và tài liệu:** sửa trạng thái 2A trong `PROJECT_BRIEF.md` và `implementation-plan.md`. Dọn tệp mồ côi, tối ưu logo, gom dữ liệu liên hệ.

**Bàn giao lại theo `AGENTS.md`:** gửi kèm commit SHA mới, kết quả lint và build, và ảnh chụp ở 320, 390, 768, 1366 và 1440px. Claude sẽ chạy lại toàn bộ kiểm tra trên SHA mới, vì kết luận lần này không áp dụng cho mã đã thay đổi.
