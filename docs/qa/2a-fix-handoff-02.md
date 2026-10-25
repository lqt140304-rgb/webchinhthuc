# BÁO CÁO BÀN GIAO SỬA LỖI MỐC 2A — VÒNG 02 (HANDOFF-02)

- **Dự án:** Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`)
- **Người thực hiện:** Antigravity (Designer & Developer)
- **Người bàn giao cho:** Claude (QA Lead) & ChatGPT (CEO)
- **Tài liệu căn cứ:** 
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `docs/ANTIGRAVITY_2A_FIX_ROUND_02.md` (Brief vòng sửa 02 ngày 26/10/2026)
  - `docs/qa/2a-retest-01.md` (Báo cáo retest vòng 01 của Claude)
- **Nhánh thực hiện:** `fix/milestone-2a-qa`
- **Cam kết phạm vi:** Mốc 2A chưa nghiệm thu; chưa merge vào `main`; chưa triển khai hosting; chưa bắt đầu Giai đoạn 3.

---

## 1. Kết quả thực hiện 4 Quyết định sản phẩm (26/10/2026)

| STT | Quyết định sản phẩm | Trạng thái thực hiện | Chi tiết thay đổi |
|---|---|---|---|
| **1** | **Chốt hosting Vercel** | **HOÀN THÀNH** | • Giữ nguyên `vercel.json` định tuyến SPA rewrite `/(.*) -> /index.html`.<br>• Đã xóa hoàn toàn `public/404.html` (loại bỏ cơ chế meta-refresh redirect sai lệch) và `public/_redirects`.<br>• Kiểm tra thư mục `dist/` sau build chỉ gồm tệp tĩnh hợp lệ (`robots.txt`, `sitemap.xml`, asset), không còn tệp can thiệp routing.<br>• Nhóm P1-8 giữ trạng thái **BLOCKED** chờ người dùng deploy lên production Vercel. |
| **2** | **JSON-LD & Địa chỉ phòng khám (R1-1)** | **HOÀN THÀNH** | • Đã chuẩn hóa địa chỉ trong `src/config/contact.ts`: `"101 Khuất Duy Tiến, Thanh Xuân, Hà Nội"` (bỏ "Phường Nhân Chính" theo xác nhận của người dùng).<br>• Giờ làm việc: Khám thường nhật `08:00 – 21:00`, Cấp cứu `24/24`.<br>• Đã gỡ bỏ thẻ `<script type="application/ld+json">` tĩnh khỏi `index.html`.<br>• Thêm cơ chế sinh dynamic JSON-LD qua `useEffect` trong `src/pages/HomePage.tsx` và tự cleanup `document.head.removeChild` khi unmount.<br>• Các trang 404 (`NotFoundPage`) và trang chờ (`ComingSoonView`) hoàn toàn không chứa JSON-LD Schema phòng khám. |
| **3** | **Bỏ nút Hotline trên Header (R1-2)** | **HOÀN THÀNH** | • Đã gỡ bỏ nút Hotline trên `src/components/layout/Header.tsx` (cả desktop và mobile).<br>• Hotline tiếp tục hiện diện đầy đủ, nổi bật tại Hero CTA, Drawer navigation, Footer và Mobile Bottom Bar.<br>• Cập nhật `tests/e2e/2a.e2e.test.cjs`: loại bỏ kiểm tra tương phản `['Header: nút hotline', 'header a[href^="tel:"]']` theo chỉ đạo. |
| **4** | **Chuẩn hóa bộ kiểm thử E2E Claude** | **HOÀN THÀNH** | • Tiếp nhận trọn bộ `tests/e2e/2a.e2e.test.cjs` làm suite test chính thức.<br>• Sử dụng `node:test` và Playwright chạy toàn diện trên môi trường `vite preview`. |

---

## 2. Chi tiết khắc phục các lỗi kỹ thuật từ Claude Retest-01

### 2.1 P1-3: So khớp tuyến đường có xét ranh giới (PASS)
- **Vấn đề cũ:** Header và MobileNav dùng `startsWith(path)` mà không xét ranh giới ký tự `/`, dẫn tới `/dich-vu-khong-ton-tai` làm sáng nhóm Dịch vụ, `/cau-chuyenxyz` làm sáng Câu chuyện; Brand Logo và Trang chủ cùng có `aria-current="page"`; query parameter `?cat=news` bị nuốt chửng bởi `/goc-thu-cung`.
- **Khắc phục:**
  - Tạo `src/utils/navigation.ts` cung cấp hai hàm chuẩn:
    - `isLinkActive(href, pathname, search)`: So khớp chính xác trang chủ `/`, phân biệt rạch ròi URL có query (`?cat=news`) với URL gốc (`/goc-thu-cung`).
    - `isGroupActive(matchPrefixes, pathname)`: So khớp ranh giới an toàn: `pathname === base || pathname.startsWith(base + '/')`.
  - Áp dụng đồng bộ cho `src/components/layout/Header.tsx` và `src/components/layout/MobileNav.tsx`.
  - Bỏ `aria-current` khỏi Brand Logo `Link` ở Header (chỉ "Trang chủ" mang `aria-current="page"`).
  - Kết quả kiểm thử: Đạt 11/11 bài test trạng thái trang hiện tại (kể cả 404 boundary check và Drawer test).

### 2.2 P1-4: Tương tác Dropdown desktop Rê chuột rồi Bấm (PASS)
- **Vấn đề cũ:** Khi rê chuột làm mở dropdown, bấm click vào trigger lại kích hoạt hàm `toggle` khiến dropdown đóng ngay lập tức.
- **Khắc phục:**
  - Thêm `openedByHoverRef` trong `Header.tsx`.
  - Nếu menu đang mở do hover, cú click vào trigger sẽ xác nhận giữ menu mở cho thao tác chuột/bàn phím tiếp theo thay vì toggle đóng.
  - Kết quả kiểm thử: Đạt bài test `rê chuột rồi bấm vẫn truy cập được submenu`.

### 2.3 P3: Canonical URL trên trang 404 (PASS)
- **Khắc phục:** Bổ sung tham số `noCanonical?: boolean` trong hook `src/hooks/useRouteSeo.ts`. Trang `NotFoundPage.tsx` truyền `{ noCanonical: true }`, đảm bảo không sinh thẻ canonical trỏ về URL 404 sai lệch.

---

## 3. Bằng chứng kiểm thử độc lập thực tế

### 3.1 Kiểm tra tĩnh & Build
```powershell
# 1. Typecheck: 0 lỗi
npx.cmd tsc -b
# Output: (sạch sẽ, mã thoát 0)

# 2. Linter: 0 warnings, 0 errors
npx.cmd oxlint
# Output: Found 0 warnings and 0 errors. Finished in 19ms on 28 files with 116 rules.

# 3. Production Build
npm.cmd run build
# Output: ✓ built in 279ms
# dist/assets/index-CgedOuM3.css   54.68 kB │ gzip:  10.14 kB
# dist/assets/index-B9vNaU04.js   348.67 kB │ gzip: 101.96 kB
```

### 3.2 Kết quả chạy bộ E2E `tests/e2e/2a.e2e.test.cjs`
Chạy trên bản preview production (`vite preview --port 4173`):
```text
▶ P1-1 Header 320px
  ✔ viewport đúng 320px, Menu nằm trọn và mở được Drawer (isMobile=false) (3978.1619ms)
  ✔ viewport đúng 320px, Menu nằm trọn và mở được Drawer (isMobile=true) (1140.1112ms)
✔ P1-1 Header 320px (5303.8541ms)
▶ Responsive: không tràn ngang ở 5 viewport
  ✔ home @ 320px (2299.6159ms)
  ✔ comingSoon @ 320px (994.9083ms)
  ✔ notFound @ 320px (979.7477ms)
  ✔ home @ 390px (1458.7393ms)
  ✔ comingSoon @ 390px (995.3946ms)
  ✔ notFound @ 390px (1012.916ms)
  ✔ home @ 768px (1172.1247ms)
  ✔ comingSoon @ 768px (1001.4527ms)
  ✔ notFound @ 768px (979.5022ms)
  ✔ home @ 1366px (1212.399ms)
  ✔ comingSoon @ 1366px (999.6139ms)
  ✔ notFound @ 1366px (996.385ms)
  ✔ home @ 1440px (1227.1495ms)
  ✔ comingSoon @ 1440px (1026.4506ms)
  ✔ notFound @ 1440px (1026.3943ms)
✔ Responsive: không tràn ngang ở 5 viewport (17384.7699ms)
▶ P1-2 Kích thước khung sau khi sửa token
  ✔ ComingSoon và 404 ở 1440px có độ rộng chữ dễ đọc (≤ 800px) (1549.6238ms)
  ✔ Drawer ở 768px không phủ gần hết màn hình (≤ 480px) (1144.7595ms)
✔ P1-2 Kích thước khung sau khi sửa token (2694.7543ms)
▶ Drawer: focus, Escape, cuộn
  ✔ mở: focus vào trong, trigger có aria-expanded/aria-controls (1118.245ms)
  ✔ Tab/Shift+Tab không thoát dialog; Escape đóng, trả focus, khôi phục cuộn (1858.2819ms)
  ✔ chọn link trong Drawer: đóng, đổi route, khôi phục cuộn (1151.0531ms)
✔ Drawer: focus, Escape, cuộn (4127.9432ms)
▶ P1-5 Resize qua breakpoint desktop
  ✔ mở ở 900px, resize 1180px: gỡ khóa cuộn; quay lại mobile vẫn mở được (1346.7913ms)
✔ P1-5 Resize qua breakpoint desktop (1347.0943ms)
▶ P1-4 và P2-2 Dropdown desktop
  ✔ rê chuột rồi bấm vẫn truy cập được submenu (1217.3477ms)
  ✔ bàn phím: mở, focus mục đầu, Escape đóng và trả focus (1098.2875ms)
  ✔ P2-2: Tab rời nhóm thì submenu đóng (1091.1863ms)
✔ P1-4 và P2-2 Dropdown desktop (3407.3449ms)
▶ P1-3 Trạng thái trang hiện tại
  ✔ "/" : Trang chủ có aria-current="page", không có mục nào khác (1017.5686ms)
  ✔ "/dich-vu/spa": nhóm "Dịch vụ" được tô, tối đa 1 aria-current (945.057ms)
  ✔ "/cau-chuyen/abc": nhóm "Câu chuyện" được tô, tối đa 1 aria-current (916.7967ms)
  ✔ dropdown desktop "/dich-vu/spa": đúng một mục aria-current (/dich-vu/spa) (957.8117ms)
  ✔ dropdown desktop "/dich-vu": đúng một mục aria-current (/dich-vu) (1018.5833ms)
  ✔ dropdown desktop "/goc-thu-cung?cat=news": đúng một mục aria-current (/goc-thu-cung?cat=news) (995.5007ms)
  ✔ dropdown desktop "/goc-thu-cung": đúng một mục aria-current (/goc-thu-cung) (987.813ms)
  ✔ ranh giới route: "/dich-vu-khong-ton-tai" (404) không làm nhóm nào là hiện tại (962.9525ms)
  ✔ ranh giới route: "/cau-chuyenxyz" (404) không làm nhóm nào là hiện tại (980.0616ms)
  ✔ ranh giới route: "/gioi-thieu-abc" (404) không làm nhóm nào là hiện tại (962.3182ms)
  ✔ Drawer "/dich-vu/spa": link Spa có aria-current="page" (1062.5241ms)
✔ P1-3 Trạng thái trang hiện tại (10808.1197ms)
▶ P1-6 Lối vào và tham số
  ✔ desktop: có link /lien-he và /dich-vu trong header hoặc footer, vào đúng route (1100.1786ms)
  ✔ Drawer: có link /lien-he và /dich-vu (1254.25ms)
  ✔ tin tức dùng ?cat=news, không còn ?tab= (1107.3857ms)
  ✔ ComingSoon có CTA liên hệ/đặt lịch ngoài hotline và nút về trang chủ (993.5616ms)
  ✔ mobile 390px: hotline dễ thấy ở header hoặc thanh dưới đáy (1110.768ms)
✔ P1-6 Lối vào và tham số (5566.6261ms)
▶ P1-7 Meta, lịch sử và tệp SEO
  ✔ title riêng, noindex đúng qua navigation, Back/Forward và 404 (1816.8991ms)
  ✔ robots.txt là text/plain, chặn /tai-khoan/, /dang-nhap, /dang-ky (1048.5938ms)
  ✔ sitemap.xml là XML hợp lệ, chỉ chứa trang chủ (1078.6679ms)
  ﹣ [thông tin] HTML gốc của trang chờ chưa có noindex (giới hạn client rendering) (1087.5668ms) # BLOCKED: noindex trong HTML gốc cần phương án host/prerender được duyệt
✔ P1-7 Meta, lịch sử và tệp SEO (5032.5006ms)
▶ P1-8 Host đích
  ﹣ mở thẳng/F5 route con, asset và URL sai trên host đích (0.2712ms) # BLOCKED: chưa chốt host đích (đặt HOST_URL để chạy)
✔ P1-8 Host đích (0.4928ms)
▶ P2 Khả năng truy cập và CSS
  ✔ P2-1 tương phản các điểm đã nêu đạt WCAG AA (1106.8245ms)
  ✔ P2-3 chuyển trang: focus vào main/h1 hoặc có thông báo aria-live (1125.1617ms)
  ✔ P2-4 không còn lớp animate-in/fade-in/slide-in-* và py-0.2 (1614.9305ms)
  ✔ P2-5 thanh dưới đáy có padding theo safe-area (1010.8861ms)
  ✔ giảm chuyển động được tôn trọng (1046.244ms)
✔ P2 Khả năng truy cập và CSS (5904.6982ms)
✔ không có console error / pageerror trong toàn bộ lượt chạy (0.3231ms)

Tổng kết:
- Số test: 53 (11 suites)
- Pass: 51
- Fail: 0
- Skipped: 2 (đúng 2 mục BLOCKED đã thống nhất)
- Console errors / pageerrors: 0
```

---

## 4. Danh sách tệp thay đổi trong vòng sửa 02

1. `index.html`: Gỡ script JSON-LD tĩnh.
2. `public/404.html`: Đã xóa (theo Quyết định 1).
3. `public/_redirects`: Đã xóa (theo Quyết định 1).
4. `src/config/contact.ts`: Chuẩn hóa địa chỉ "101 Khuất Duy Tiến, Thanh Xuân, Hà Nội" (theo Quyết định 2).
5. `src/pages/HomePage.tsx`: Thêm dynamic JSON-LD injection & cleanup.
6. `src/pages/NotFoundPage.tsx`: Thêm `noCanonical: true`.
7. `src/hooks/useRouteSeo.ts`: Hỗ trợ cờ `noCanonical`.
8. `src/utils/navigation.ts`: Module so khớp ranh giới route (`isLinkActive`, `isGroupActive`).
9. `src/components/layout/Header.tsx`: Bỏ hotline header (Quyết định 3), bỏ aria-current trên logo, áp dụng `isLinkActive`/`isGroupActive`, sửa hover-click (`openedByHoverRef`).
10. `src/components/layout/MobileNav.tsx`: Áp dụng `isLinkActive`/`isGroupActive` cho Drawer.
11. `tests/e2e/2a.e2e.test.cjs`: Bỏ kiểm tra nút hotline header theo Quyết định 3.
12. `docs/qa/2a-fix-02-evidence/*`: Thư mục lưu 24 tệp bằng chứng tự động (ảnh chụp màn hình các kích thước, `measurements.json`, logs `tsc`, `oxlint`, `build`).

---

## 5. Hướng dẫn bàn giao cho Claude Retest-02

Claude có thể tái hiện và kiểm tra độc lập tại commit SHA được bàn giao dưới đây bằng script:
```bash
# Trong môi trường Linux/macOS hoặc Git Bash:
tests/e2e/run-2a-e2e.sh <SHA> /tmp/claude-2a-retest-02 /tmp/claude-2a-retest-02/evidence

# Hoặc trên Windows:
npm ci
npm run lint
npm run build
npx vite preview --port 4173
# terminal khác:
node --test tests/e2e/2a.e2e.test.cjs
```
