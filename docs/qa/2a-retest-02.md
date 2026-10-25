# Retest 02 mốc 2A: kiểm tra độc lập của Claude

| Mục | Giá trị |
|---|---|
| Người kiểm tra | Claude (QA reviewer, theo `AGENTS.md`) |
| Ngày chạy | 26/10/2026 |
| **SHA mã được kiểm tra** | `4b269d97f6f94515e2af95f421cdfc1dfe690859`, nhánh `fix/milestone-2a-qa` |
| Đầu nhánh khi nhận bàn giao | `5ac4d880f9c37c89df21e9385128606d69724320`. Đã xác nhận `4b269d9..5ac4d88` chỉ sửa `docs/qa/2a-fix-handoff-02.md` (2 dòng thêm, 1 dòng xóa) |
| SHA mã của lần trước | `31e3c1eafc7ac470361c860c681d49874a3768c6` ([retest-01](2a-retest-01.md)) |
| Nhánh báo cáo | `claude/2a-retest-02`, tạo từ `main` `cd889c8`. Không chứa mã ứng dụng. SHA của commit báo cáo tách khỏi SHA mã ở trên và không tự ghi vào đây |
| Căn cứ | [Brief vòng sửa 02](../ANTIGRAVITY_2A_FIX_ROUND_02.md), [2a-fix-handoff-02.md](https://github.com/lqt140304-rgb/webchinhthuc/blob/5ac4d880f9c37c89df21e9385128606d69724320/docs/qa/2a-fix-handoff-02.md) (trên nhánh của Antigravity), [quy trình E2E](2a-e2e-protocol.md) |

## 1. Kết luận

**Khuyến nghị: 2A đạt các tiêu chí P1 kiểm chứng được trong môi trường này.** Người dùng là người quyết định nghiệm thu.

- **Đóng:** P1-3 và P1-4 (FAIL ở retest-01) đã PASS, kể cả các test bổ sung của vòng này: ranh giới tuyến trong Drawer, luồng chuột thật vào tới submenu.
- **Bốn quyết định ngày 26/10 đã được thực hiện và kiểm chứng:**
  - Chỉ còn cấu hình Vercel.
  - JSON-LD chỉ có trên trang chủ, dùng đúng dữ liệu đã xác nhận.
  - Header không còn hotline.
  - Dùng bộ E2E của Claude.
- **Còn mở (P3, không chặn):**
  - Logo và favicon chưa tối ưu, dù brief vòng 02 mục 5 có yêu cầu. Antigravity không nhắc mục này trong báo cáo bàn giao.
  - Ở `/cau-chuyen/<slug>`, Drawer không đánh dấu "Câu chuyện" là mục hiện tại, trong khi desktop có.
  - URL có query (UTM) hoặc dấu `/` ở cuối làm mất `aria-current`.
- **Vẫn BLOCKED, không coi là đã đạt:**
  - Kiểm tra trên host Vercel thật (chưa có URL được phép).
  - noindex trong HTML gốc của trang chờ.

  Brief yêu cầu Antigravity đề xuất phương án noindex ở HTML gốc hoặc header, nhưng báo cáo bàn giao chưa có. Tôi đề xuất một phương án ở mục 4.3.

2B vẫn chờ duyệt riêng, chưa sang giai đoạn 3.

## 2. Môi trường và lệnh

| Mục | Giá trị |
|---|---|
| Hệ điều hành | Linux 6.18.44 (container) |
| Node / npm | v22.22.0 / 10.9.4. Antigravity dùng Node 24, tài liệu ghi Node 24 |
| Trình duyệt | Google Chrome for Testing 153.0.8010.12, qua thư viện `playwright` 1.63.0 có sẵn trong môi trường. Không thêm dependency vào repo |
| Bản sao | `git archive 4b269d9` vào thư mục tạm. Lockfile trùng byte với SHA. `package.json` và lockfile không đổi so với `c2e5361` |
| Server | `vite preview` (cổng 4173) cho SHA đích. Cổng 4174 cho `31e3c1e`, chỉ dùng để chứng minh test bắt được lỗi |

| Lệnh | Exit | Kết quả |
|---|---|---|
| `npm ci` | 0 | |
| `npx oxlint` | 0 | [lint-4b269d9.txt](2a-retest-02-evidence/lint-4b269d9.txt) |
| `npx tsc -b` | 0 | [tsc-4b269d9.txt](2a-retest-02-evidence/tsc-4b269d9.txt) |
| `npm run build` | 0 | `index.html` 1.15 kB, CSS 54.68 kB, JS 348.66 kB. `dist/` không còn `404.html` hay `_redirects`. [build-4b269d9.txt](2a-retest-02-evidence/build-4b269d9.txt) |
| `node --test tests/e2e/2a.e2e.test.cjs tests/e2e/2a-round02.e2e.test.cjs` (có `APP_DIR`) | 1 | **78 test: 74 pass, 2 fail (đều P3), 2 skip (BLOCKED)**. 0 lỗi console. [log](2a-retest-02-evidence/e2e-claude-4b269d9.txt), [TAP](2a-retest-02-evidence/e2e-claude-4b269d9.tap) |
| Chỉ tính bộ chuẩn `2a.e2e.test.cjs` | | **53 test: 51 pass, 0 fail, 2 skip**. Khớp số Antigravity báo |
| Chạy lặp lại cùng lệnh | 1 | Y hệt: 74 / 2 / 2, cùng 2 test FAIL. [log](2a-retest-02-evidence/e2e-claude-4b269d9-repeat.txt) |
| `2a-round02.e2e.test.cjs` trên SHA cũ `31e3c1e` | 1 | 25 test: 10 pass, **15 fail**. Chứng minh các test mới bắt được đúng lỗi đã sửa. [log](2a-retest-02-evidence/e2e-round02-on-31e3c1e.txt) |

**Cách chạy lại:**

```bash
BASE_URL=http://localhost:4173 APP_DIR=<bản sao đúng SHA đã build> EVIDENCE_DIR=./ev \
  node --test tests/e2e/2a.e2e.test.cjs tests/e2e/2a-round02.e2e.test.cjs
# Khi có URL Vercel được phép kiểm tra: thêm HOST_URL=https://<preview-or-prod>
```

### Thay đổi bộ test so với retest-01

- **`tests/e2e/2a.e2e.test.cjs`:** nhận đúng thay đổi một dòng của Antigravity, bỏ phép đo tương phản `header a[href^="tel:"]` theo quyết định 3. Đã đối chiếu: so với `76e1e5c` chỉ khác đúng dòng này, không assertion nào khác bị nới lỏng.
- **Mới: `tests/e2e/2a-round02.e2e.test.cjs`, 25 test:**

  | Nhóm | Số test | Nội dung |
  |---|---|---|
  | Drawer | 11 | Đúng một mục hiện tại; ranh giới tuyến ở 4 URL 404 |
  | Dropdown | 2 | Luồng chuột đầy đủ |
  | Header | 4 | Không còn `tel:` ở 4 viewport, vẫn có lối gọi |
  | JSON-LD | 3 | Nội dung, HTML gốc, vòng đời qua Back/Forward |
  | Canonical | 1 | Không có ở 404 |
  | Cấu hình Vercel và `dist/` | 2 | |
  | Logo và favicon | 1 | |
  | Lỗi console | 1 | |

## 3. Đối chiếu từng mã lỗi

| ID | Retest-01 | Retest-02 | Kỳ vọng / Thực tế | Bằng chứng |
|---|---|---|---|---|
| P1-1 | PASS | **PASS** | Ở 320px (thường và `isMobile`): `innerWidth` 320, không tràn, nút Menu nằm trọn và mở được Drawer | [p1-1-header-320.png](2a-retest-02-evidence/p1-1-header-320.png) |
| RESP | PASS | **PASS** | Trang chủ, ComingSoon và 404 ở 5 viewport: 15/15 không tràn | [resp-notFound-320](2a-retest-02-evidence/resp-notFound-320.png), [resp-home-768](2a-retest-02-evidence/resp-home-768.png) |
| P1-2 | PASS | **PASS** | ComingSoon và 404 ≤ 800px ở 1440px. Drawer ≤ 480px ở 768px | [coming-soon-1440](2a-retest-02-evidence/p1-2-coming-soon-1440.png), [drawer-768](2a-retest-02-evidence/p1-2-drawer-768.png) |
| P1-3 | **FAIL** | **PASS** | Ở `/` chỉ "Trang chủ" có `aria-current` (logo đã bỏ). Dropdown có đúng một mục ở `/dich-vu/spa`, `/dich-vu`, `/goc-thu-cung`, `?cat=news`. Ba URL 404 trên desktop và bốn URL 404 trong Drawer không tô mục hay nhóm nào. Drawer có đúng một mục ở 6 tuyến. Còn P3: R2-1 và R2-2 ở mục 4.1 | `measurements*.json` |
| P1-4 | **FAIL** | **PASS** | Rê chuột rồi bấm: submenu vẫn mở. Di chuột vào "Spa" rồi bấm: tới `/dich-vu/spa`, submenu đóng. Bấm lần hai thì đóng; rời chuột thì đóng. Bàn phím: Enter, Escape, trả focus và Tab ra ngoài đều đạt | [p1-4-hover-click-1280.png](2a-retest-02-evidence/p1-4-hover-click-1280.png) |
| P1-5 | PASS | **PASS** | Đổi 900px → 1180px: Drawer đóng, cuộn được, không giữ focus. Quay lại mobile mở được | [p1-5-resize-1180.png](2a-retest-02-evidence/p1-5-resize-1180.png) |
| Drawer | PASS | **PASS** | Focus trap hai chiều, Escape, trả focus, khôi phục cuộn, chọn link thì đóng | [drawer-open-390.png](2a-retest-02-evidence/drawer-open-390.png) |
| P1-6 | PASS | **PASS** | Có `/lien-he` và `/dich-vu`, dùng `?cat=news`, ComingSoon có CTA. Hotline: xem dòng Quyết định 3 | |
| P1-7 | PASS phía client | **PASS phía client, BLOCKED ở HTML gốc** | Title và noindex đúng qua chuyển trang, Back/Forward và 404. `robots.txt` và `sitemap.xml` đúng qua HTTP. HTML gốc của trang chờ không có noindex (mục 4.3) | |
| P1-8 | BLOCKED, có rủi ro | **BLOCKED (host thật)** | Rủi ro của retest-01 đã xử lý: `public/404.html` và `_redirects` đã gỡ, `dist/` không còn hai tệp này, đường dẫn sâu giữ nguyên URL. `vercel.json` có một rewrite `/(.*)` về `/index.html`, không có redirect về trang chủ. Chưa chạy trên Vercel | measurements id `R2-D1` |
| Quyết định 3 (bỏ hotline Header) | | **PASS** | Header có 0 link `tel:` ở 320, 768, 1366 và 1536px. Vẫn có lối gọi: ở 320px là thanh dưới đáy; ở 768px là Hero và thanh dưới đáy; ở 1366/1536px là Hero. Drawer có hotline (dưới 1024px), Footer có 2 link | measurements id `R2-D3` |
| R1-1 JSON-LD | Phát hiện mới | **PASS** | HTML gốc không còn JSON-LD tĩnh. Trang chủ có đúng một `VeterinaryCare`: `streetAddress` "101 Khuất Duy Tiến", locality "Thanh Xuân", region "Hà Nội", giờ 08:00–21:00, điện thoại khớp hotline. Không còn "Nhân Chính", "Phường" hay "Quận" trong JSON-LD lẫn chữ hiển thị. Vòng đời: trang chủ 1, trang chờ 0, 404 0, về trang chủ 1 (không nhân đôi), Back 0, Forward 1 | measurements id `R2-R1-1*` |
| P3 canonical 404 | Phát hiện | **PASS** | 404 không có canonical, cả khi vào thẳng lẫn khi đi từ trang chờ có canonical. Trang chủ có đúng một canonical `https://bvthuyleson.vn/` | |
| P2-1 đến P2-5, giảm chuyển động | PASS | **PASS** | Tương phản ≥ 4.5:1 ở 4 điểm còn lại. Tab rời dropdown thì đóng. Có focus và thông báo khi chuyển trang. Không còn lớp CSS vô hiệu. Có safe-area | |
| P3 logo và favicon | NOT FIXED | **FAIL (P3)** | `logo.png` nặng 376,788 byte, hiển thị chỉ 44px, và vẫn là favicon (`index.html` dòng 5). Ngưỡng QA đặt: logo ≤ 100 KB, favicon ≤ 50 KB | measurements id `R2-P3-logo` |
| Lỗi console | 0 | **0** | | |

## 4. Phát hiện còn lại

### 4.1 P3, không chặn nghiệm thu

| ID | Mô tả | Tái hiện | Hướng sửa |
|---|---|---|---|
| R2-1 | Drawer và desktop không nhất quán ở trang chi tiết câu chuyện | Ở `/cau-chuyen/abc`: desktop có `aria-current` trên "Câu chuyện", Drawer thì không có mục nào. Lý do: `MobileNav.tsx:310` dùng `checkActive('/cau-chuyen')`, khớp chính xác, còn Header dùng `isGroupActive` | Chọn một quy ước và áp cho cả hai. Gợi ý: trên trang chi tiết dùng `aria-current="true"` hoặc chỉ tô bằng style cho mục cha, còn `aria-current="page"` để dành cho trang khớp chính xác |
| R2-2 | Query hoặc dấu `/` ở cuối làm mất `aria-current` | Ở `/dich-vu/spa?utm_source=facebook` và `/dich-vu/spa/`: trang hiển thị đúng nhưng không mục nào có `aria-current`. Ở `/?utm_source=zalo` thì vẫn đúng. Nguyên nhân: `src/utils/navigation.ts:22` trả `false` khi URL có query mà link không có. [probe-edge-cases.json](2a-retest-02-evidence/probe-edge-cases.json) | Chỉ so query với link có query (trường hợp `cat`). Còn lại bỏ qua query và chuẩn hóa dấu `/` ở cuối trước khi so |
| R2-3 | Logo và favicon chưa tối ưu (brief vòng 02 mục 5) | Xem bảng ở mục 3 | Xuất logo khoảng 96–128px (WebP hoặc PNG đã nén). Tạo favicon riêng (32/48px, `apple-touch-icon` 180px). Giữ ảnh gốc làm nguồn |

### 4.2 Hosting Vercel (BLOCKED)

- **Đã kiểm, không cần host thật:**
  - Chỉ còn `vercel.json`, không có cấu hình cho host khác.
  - Rewrite catch-all về `/index.html`, không có redirect.
  - `dist/` không có tệp can thiệp định tuyến.
  - Trên `vite preview`, đường dẫn sâu giữ nguyên URL, và `/404.html` không còn trả về trang chuyển hướng.
- **Chưa kiểm được:** HTTP status thật, F5 trên tuyến con, asset và `robots.txt`/`sitemap.xml` trên Vercel. Theo hành vi đã công bố của Vercel, tệp tĩnh có sẵn được phục vụ trước rewrite. Hệ quả là URL sai sẽ trả 200 (soft 404), chỉ được giảm nhẹ bằng noindex phía client.
- **Khi người dùng cho phép một URL preview Vercel**, chạy nhóm P1-8 bằng `HOST_URL=<url>`.

### 4.3 noindex trong HTML gốc: đề xuất (cần người dùng duyệt)

Antigravity chưa nộp đề xuất mà brief yêu cầu. Vì đã chốt Vercel, có thể đặt header `X-Robots-Tag: noindex, nofollow` theo tuyến trong `vercel.json` (khóa `headers`), chỉ cho các tiền tố trang chờ và tài khoản:

- `/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat`
- `/dich-vu/*`, `/bang-gia`
- `/cau-chuyen/*`, `/goc-thu-cung/*`, `/bai-viet/*`
- `/san-pham`, `/dat-lich`, `/lien-he`
- `/dang-nhap`, `/dang-ky`, `/tai-khoan/*`

Cách này:

- **Không** áp noindex cho `/`, `robots.txt`, `sitemap.xml` hay asset.
- Không cần prerender.
- Chỉ kiểm chứng được trên Vercel thật, qua header HTTP.

Mỗi khi một trang chính thức ra mắt, phải gỡ tiền tố tương ứng khỏi danh sách. URL sai (404) vẫn trả 200 nếu không có prerender. Đây là giới hạn của SPA, cần ghi nhận khi duyệt.

## 5. Đánh giá báo cáo bàn giao của Antigravity

| Tuyên bố trong `2a-fix-handoff-02.md` | Kiểm chứng |
|---|---|
| Bộ chuẩn đạt 51 pass, 0 fail, 2 skip | **Đúng**: tái hiện được 51/0/2 trên Linux, Node 22 |
| P1-3 đạt 11/11, kể cả Drawer | Đúng với các test đang có. Tuy vậy brief yêu cầu **bổ sung test ranh giới cho Drawer**, mà Antigravity không thêm test nào. Tôi đã bổ sung 11 test Drawer: 10 đạt, 1 lộ ra R2-1 |
| P1-4 đạt nhờ `openedByHoverRef` | Đúng, kể cả luồng chuột đầy đủ |
| Gỡ `404.html` và `_redirects`, giữ `vercel.json` | Đúng |
| JSON-LD động chỉ trên trang chủ, có dọn dẹp | Đúng, kể cả Back/Forward và không nhân đôi |
| Bỏ hotline Header, giữ ở Hero, Drawer, Footer và thanh dưới đáy | Đúng |
| Bỏ canonical ở 404 | Đúng |
| Mục 5 brief: tối ưu logo và favicon | **Không làm và không nhắc tới** trong báo cáo bàn giao |
| Đề xuất noindex ở HTML gốc hoặc header | **Không có** |

## 6. Việc tiếp theo

1. **Người dùng hoặc ChatGPT:** quyết định có nghiệm thu 2A với các P3 (R2-1, R2-2, R2-3) và hai mục BLOCKED (host thật, noindex ở HTML gốc) hay không. Nếu nghiệm thu, nên ghi rõ các mục này là việc còn mở.
2. **Antigravity**, nếu được giao:
   - Sửa R2-1, R2-2, R2-3.
   - Nếu được duyệt, thêm header `X-Robots-Tag` theo mục 4.3.

   Khi đó cập nhật bộ test tương ứng: bỏ nhãn kỳ vọng P3 khi đã sửa, và thêm kiểm tra header khi có `HOST_URL`.
3. **Khi có URL preview Vercel được phép:** Claude chạy nhóm P1-8 và kiểm tra header.
4. **Sau 2A**, review riêng 2B trước giai đoạn 3.

## 7. Chưa kiểm chứng

- Vercel thật: HTTP status, F5, asset, header (BLOCKED).
- noindex ở HTML gốc (BLOCKED, chờ duyệt mục 4.3).
- Thiết bị thật (iOS Safari, Android), trình đọc màn hình thật (NVDA, VoiceOver).
- QA chi tiết 6 section 2B (mới kiểm hồi quy tràn ngang và độ rộng).
- Lighthouse, Core Web Vitals.
- Thiết bị cảm ứng ở khoảng ≥ 1024px (iPad ngang) với dropdown hover/click.
