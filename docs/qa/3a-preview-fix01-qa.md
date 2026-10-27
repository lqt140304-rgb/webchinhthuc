# PHASE 3A PREVIEW FIX 01 — INDEPENDENT RETEST

| Mục | Chi tiết |
|---|---|
| Căn cứ | CEO Directive 034-B; báo cáo trước `docs/qa/3a-preview-qa.md` (nhánh `claude/3a-preview-qa`, commit `62cadaa`); handoff `docs/qa/3a-preview-fix01-handoff.md` |
| Agent | Claude — Independent QA Lead (READ-ONLY) |
| Ngày | 28/10/2026 |
| Nhánh | `feat/phase-3a-dev01` @ `72efb9277a06951e7811e4e0991939ec81b55ca8` (HEAD; chỉ thêm handoff so với commit code) |
| Commit code đã deploy | `4739d45cc95100b587381b6bdcad6935352b23e8` |
| Preview URL | `https://le-son-website-q5i16t9zn-lqt140304-rgb.vercel.app` |
| Deployment ID | `dpl_8XZEtH3csgeHa5cmzf5aw9hNR4EE` |
| Baseline | Commit `bbd78461…` / deployment `dpl_FysMST4wMKmGLPAFKBZvvT6H6zLZ` |
| Phương pháp | Vercel REST API (`GET`); bypass header từ biến môi trường. Token, bypass secret và cookie không ghi vào báo cáo hay bằng chứng (grep: 0) |
| Bằng chứng | `docs/qa/3a-preview-fix01-qa-evidence/`; scripts `tests/preview/` |

## Kết luận: **PASS WITH FIXES**

- **DEV01P-P1-1 (CLS 0.41): FIXED.**
  - CLS = 0 ở **24/24 lượt Lighthouse** (4 trang × mobile/desktop × 3 lượt).
  - PerformanceObserver cho kết quả tương tự ở 16 tổ hợp mạng nhanh/chậm × mobile/desktop: trang 3A tối đa 0.0003 (font desktop).
- **BUILD REPRODUCIBILITY: VERIFIED.**
  - File upload trùng từng byte với cây Git tại `4739d45`: 0 file ngoài Git, 0 file khác, không còn CRLF.
  - Build từ Git theo đúng `.vercelignore` đã commit cho ra **toàn bộ asset trùng từng byte với Preview**.
  - Ghi chú P3: build `npm run build` trên checkout đầy đủ dư 1 class không dùng (`.visible{visibility:visible}`, 28 B), vì Tailwind quét thư mục `tests/`.
- **Danh tính:** đúng project, đúng SHA, environment `preview`, READY, Vercel Authentication bật; Production không đổi; không có Git Integration.
- **Không có hồi quy.**
  - 3 trang 3A trùng **từng pixel** với Preview trước (375 và 1440).
  - Trang chủ và `/dat-lich` chỉ khác vùng nút header so với Preview 2B (đã biết từ FIX 01).
- **Còn P2:** LCP mobile 3 trang 3A là 3.2–3.5 s, chưa có preload chunk. Liên quan 2B-08.
- **Khuyến nghị:** đủ điều kiện để CEO **trình chủ dự án xem xét nghiệm thu code 3A có điều kiện**. Không phát hành công khai.

---

## 1–3. Danh tính deployment, Protection và noindex

| Trường | Giá trị |
|---|---|
| `projectId` | `prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3` (`le-son-website-qa`) |
| `meta.githubCommitSha` / `githubCommitRef` | `4739d45cc95100b587381b6bdcad6935352b23e8` / `feat/phase-3a-dev01` |
| `target` | `null` |
| `oidcTokenClaims.environment` | **`preview`** |
| `readyState` / `readySubstate` | `READY` / `STAGED` |
| `alias` / `automaticAliases` | `[]` / `[]`; không có alias Production mới |
| `source` | `cli` (`actor: antigravity`) |
| `project.targets.preview` | `dpl_8XZEtH3csgeHa5cmzf5aw9hNR4EE` |
| `project.targets.production` | `dpl_BAz378AxMw59nUafGCMDM8Hws84s` (SHA `db78738`, 26/10), **không đổi**. Danh sách deployment không có Production mới |
| Git Integration (`project.link`) | Không có |
| `ssoProtection` | `{"deploymentType":"all"}` |

**HTTP:**

- Chưa xác thực: `/`, `/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat`, `/assets/index-BwV2i7ww.js` đều trả **302 về `vercel.com/sso-api`**.
- Có bypass: mọi route 200.

| Route | `X-Robots-Tag` |
|---|---|
| `/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat` (kể cả có `/` cuối hoặc query) | `noindex, nofollow` (`vercel.json`); meta `noindex, nofollow` |
| `/dat-lich` | `noindex, nofollow` (không đổi so với 2B) |
| `/` | `noindex` (nền tảng Preview); meta `index, follow` như 2B |
| `/khong-ton-tai-xyz` | 200 + `noindex` (nền tảng), **Soft 404 vẫn OPEN** |

## 4. CLS từng trang

**Thay đổi:** `src/app/routes.tsx`, `PageLoadingFallback` từ `min-h-[50vh]` + `aria-busy` đổi thành `min-h-screen` + `bg-[var(--color-bg-primary)]` + `role="status"` + `aria-label="Đang tải trang"`. Đã xác nhận có trong bundle Preview.

**Lighthouse** (cùng cấu hình baseline, 3 lượt):

| Trang | Mobile CLS (từng lượt) | Desktop CLS (từng lượt) | Baseline |
|---|---|---|---|
| `/gioi-thieu` | 0 / 0 / 0 | 0 / 0 / 0 | 0.411 / 0.414 |
| `/doi-ngu` | 0 / 0 / 0 | 0 / 0 / 0 | 0.411 / 0.414 |
| `/co-so-vat-chat` | 0 / 0 / 0 | 0 / 0 / 0 | 0.411 / 0.414 |
| `/` | 0 / 0 / 0 | 0 / 0 / 0 | 0 |

Trung vị CLS = 0 ở mọi trang. **0 lượt vượt ngưỡng 0.10.**

**PerformanceObserver** (`cls-preview.json`):

| Tổ hợp | Kết quả |
|---|---|
| Mobile 412 px | **0 layout shift** trên mọi trang, ở cả mạng nhanh và mạng chậm (150 ms, 1.6 Mbps) |
| Desktop 1440 px | Tổng CLS hiển thị 0 (làm tròn). Mỗi trang có 1 shift 0.0001 (`NAV`/`DIV` header khi font nạp); `/co-so-vat-chat` ở mạng chậm thêm 1 shift 0.0002. **Không còn shift của `FOOTER`** |

**Hành vi Footer khi tải** (`fallback-client-nav-412.png`, mạng 400 kbps, điều hướng client tới `/doi-ngu`):

- Fallback cao 823 px, bằng toàn viewport.
- Footer nằm ở y = 896 px, **ngoài màn hình** trong suốt thời gian chờ.
- Khi trang render, Footer chuyển xuống y = 7684 px mà không tạo shift trong viewport.
- Fallback có `role="status"` và nhãn; spinner bị tắt khi bật reduced motion.

**DEV01P-P1-1: FIXED.**

## 5. LCP và Lighthouse

Cấu hình giống baseline (`lighthouse/summary.txt`): Lighthouse 12.8.2, Chrome for Testing 153 headless; mobile mặc định (simulate, RTT 150 ms, 1.6 Mbps, CPU 4×); desktop `--preset=desktop`.

| Trang | Mobile Perf (3 lượt) | Mobile LCP trung vị (min–max) | Baseline LCP | TBT | FCP | Desktop Perf / LCP |
|---|---|---|---|---|---|---|
| `/` | 94 (78/94/94) | **2.88 s** (2.86–3.54) | 2.86 s | 144 ms | 1.46 s | 100 / 0.73 s |
| `/gioi-thieu` | **90** (90/89/90) | 3.47 s (3.46–3.47) | 3.48 s | 135 ms | 1.53 s | **100** / 0.70 s |
| `/doi-ngu` | **91** (92/84/91) | 3.31 s (3.17–3.63) | 3.31 s | 110 ms | 1.51 s | **100** / 0.67 s |
| `/co-so-vat-chat` | **92** (92/91/92) | 3.20 s (3.17–3.31) | 3.33 s | 110 ms | 1.54 s | **100** / 0.68 s |

Đánh giá:

- **Performance tăng** từ 71–72 lên 90–92 (mobile) và từ 81 lên 100 (desktop) ở 3 trang 3A. Toàn bộ mức tăng đến từ CLS.
- **LCP không thay đổi đáng kể:** bản sửa chỉ đổi fallback, **không có preload chunk**. LCP mobile 3A vẫn 3.2–3.5 s, nên **DEV01P-P2-2 vẫn OPEN (P2)**. Không đề xuất đổi typography hay thiết kế.
- **Trang chủ không bị ảnh hưởng:** trung vị 94 / 2.88 s, tương đương baseline (2.86 s). Lượt 1 (78 / 3.54 s, TBT 457 ms) là lượt chậm do biến động host, giống mô hình đã ghi ở QA 2B-10.
- **Mạng chậm:** không phát sinh lỗi mới; fallback hoạt động, 0 shift ở mobile.
- **2B-08: OPEN.**

## 6–7. Build reproducibility và so sánh hash: **VERIFIED**

**File upload** (`GET /v6/deployments/{id}/files`, `uploaded-source-vs-git.json`):

- 293 file; **0 file ngoài Git; 0 file khác nội dung** (CRLF đã hết).
- Không upload: `.gitignore` và 10 file trong `tests/`, đúng với `.vercelignore` đã commit (thêm `dist`, `node_modules`, `tests`…).

**Build từ Git sạch** (`git archive 4739d45`, `npm ci`, `tsc -b` exit 0, `oxlint` exit 0 với 0 warning, `vite build`; `build-hashes.txt`):

| Asset | Checkout đầy đủ | Git + `.vercelignore` (đúng đầu vào deploy) | Preview | Kết quả |
|---|---|---|---|---|
| CSS | `index-BCvVG95G.css` 67,937 B, `0430a40b…` | `index-DnHgEJZY.css` 67,909 B | `index-DnHgEJZY.css` 67,909 B, `f50992e2…` | **Trùng từng byte** (cột 2 ↔ 3) |
| JS main | `index-nGP6YY4t.js` 372,153 B | `index-BwV2i7ww.js` 372,153 B | `index-BwV2i7ww.js` 372,153 B, `2aff0636…` | **Trùng từng byte** |
| 7 chunk (About, Team, Facilities, 4 editorial) | Cùng kích thước | Cùng tên và nội dung | — | **Trùng từng byte** |
| Font (6), ảnh (18), `icons.svg`, `robots.txt`, `sitemap.xml`, favicon | — | — | — | **Trùng từng byte** (41/41 file `dist/`) |
| `index.html` | — | — | +1 script `vercel.live/_next-live/feedback/feedback.js` | Bỏ script do Vercel chèn thì trùng từng byte |

Kiểm tra bổ sung:

- Class thừa `.blur` / `.filter!` của vòng trước: **0 trong CSS Preview**.
- **DEV01Q-P3-1 (P3, mới):** build trên checkout đầy đủ có thêm `.visible{visibility:visible}` (28 B). Lý do: Tailwind quét `tests/*.cjs` (có chữ "visible"), còn Vercel không nhận `tests/`.
  - Class này không phần tử nào dùng; JS chỉ khác tên hash do cascade từ tên CSS, nội dung giống sau khi chuẩn hóa tên.
  - Đề xuất: thêm `@source not "../tests";` (hoặc tương đương) để build local và build deploy luôn giống nhau.
- CSS Modules và font: giống local.
- Không còn ảnh hưởng của `dist/` cũ hay file ngoài Git.

## 8. Visual regression (Preview, 320/375/768/1024/1440/1920)

- Mọi chỉ số trong `qa-preview.json` (tràn ngang, cắt chữ, ảnh méo, `h1`, heading, tap target, Lora nghiêng, font, alt) **giống hệt** Preview trước.
- 0 lỗi console.
- **Pixel diff toàn trang** (đã ép tải hết ảnh lazy) giữa `dpl_FysMST4` và `dpl_8XZEtH3`: `/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat` ở 375 và 1440 đều **0 pixel khác**. Bố cục không đổi, chỉ khung chờ (fallback) thay đổi.
- Card nhân sự: 288 / 343 / 348 / 299 / 384 / 384 px, đồng nhất giữa 3 bộ phận. Mô phỏng N = 1..8 trùng từng dòng với vòng trước (`ngrid.txt`). Không có card VIP.
- Lưới 768–799 px vẫn 1 cột: **DEV01F-P3-1 OPEN** (không xấu hơn baseline).

## 9. Accessibility

| Kiểm tra | Kết quả |
|---|---|
| Header mobile | CTA 85 × 44, hamburger 44 × 44, header 73 px, 0 tràn (320–430) |
| Menu mobile | Dialog, `aria-expanded`; Escape đóng và trả focus; điều hướng `/doi-ngu` OK |
| Bộ lọc | Bàn phím OK; `aria-live` "Đang hiển thị: … (Chờ xác nhận)." |
| Focus / reduced motion | 2 px; transition/animation tối đa 0.01 ms |
| Trạng thái tải | `role="status"` + `aria-label="Đang tải trang"` (DEV01P-P3-1 **FIXED**) |
| Alt | "Thú cưng nghỉ ngơi trong không gian ấm áp (ảnh minh họa)", "Chăm sóc dinh dưỡng cho thú cưng (ảnh minh họa)" |

## 10. Content integrity

- Text và thuộc tính render giống vòng trước.
- 0 cụm từ bị cấm; ngoại lệ là "phẫu thuật ngoại khoa" trong Footer, có từ Mốc 2B.
- Chỉ họ tên BS. Lê Thái Sơn là VERIFIED. Chức danh, lĩnh vực, lịch và cơ cấu bộ phận đều PENDING hoặc mô phỏng.
- 0 ảnh người. Thiết bị và phân khu là slot chờ.
- Ảnh minh họa có nhãn và vẫn **UNVERIFIED (AP-1 PARTIAL)**.
- Các nhãn nội bộ ("Chủ dự án", "Dữ liệu mô phỏng", "Bản thiết kế sơ bộ", "[Đề xuất]", "Chờ…") **là điều kiện chặn Production**.
- Handoff ghi "Card BS. Lê Thái Sơn: VERIFIED". Đúng hơn là chỉ họ tên VERIFIED; chức danh vẫn PENDING, đúng như trang hiển thị (P3 về câu chữ).

## 11. Regression trang chủ và Mốc 2B

| Kiểm tra | Kết quả |
|---|---|
| `/` 6 section | Text, SEO và robots giống Preview 2B (`dpl_HvyLw6`). Pixel diff chỉ vùng nút header: 375 px (229, 14)–(356, 60); 1440 px (1169, 18)–(1329, 64) |
| `/dat-lich` | Như trên; booking demo không đổi |
| `/dich-vu`, `/bang-gia`, `/lien-he`, `/goc-thu-cung`, 404 | Giống hệt |
| Header / Footer / font / navigation | Không đổi so với Preview trước |
| Còn mở | Soft 404; 2B-08; 2B-06; SEO Production chưa kiểm; 2B-29 (logo Champion); Footer "phẫu thuật ngoại khoa" |

## Source integrity (`bbd7846..72efb92`)

| File | Thay đổi | Phạm vi |
|---|---|---|
| `src/app/routes.tsx` | Fallback (+2/−2) | CLS (P1) và a11y (P3) |
| `.vercelignore` (mới) | Loại `dist`, `node_modules`, `tests`… khỏi upload | Build reproducibility (P2) |
| `.gitattributes` | `+ .vercelignore text eol=lf` | Hỗ trợ |
| `tests/measure-cls.cjs` (mới) | Đo CLS cục bộ (server 127.0.0.1); không gọi dịch vụ ngoài | Test |
| `tests/verify-fix01.cjs` | Xóa 2 biến thừa | Lint (P3) |
| `docs/qa/3a-preview-fix01-handoff.md` (mới) | Handoff | Tài liệu |

- Không refactor.
- Không đụng Dashboard, backend hay 3B; không sửa 2B-29.
- Không merge `main` (`main` @ `d2a19c5`); không có Production deployment; không có Git Integration.

## 12. Danh sách lỗi

| ID | Mức | Trạng thái |
|---|---|---|
| DEV01P-P1-1 (CLS 0.41) | P1 | **FIXED** |
| DEV01P-P2-1 (build không tái lập) | P2 | **FIXED** (VERIFIED) |
| DEV01P-P2-2 (LCP mobile 3A 3.2–3.5 s) | P2 | **OPEN** (chưa preload chunk; liên quan 2B-08) |
| DEV01P-P3-1 (fallback thiếu `role`) | P3 | **FIXED** |
| DEV01F-P3-3 (lint warning) | P3 | **FIXED** (oxlint 0 warning) |
| DEV01P-P3-2 (thiếu handoff Preview) | P3 | **FIXED** |
| DEV01Q-P3-1 (`.visible` dư khi build checkout đầy đủ) | P3 | NEW |
| DEV01F-P3-1 (lưới 768–799 px 1 cột) | P3 | OPEN |
| DEV01Q-P3-2 (câu chữ handoff) | P3 | NEW. Handoff ghi `X-Robots-Tag: noindex, nofollow` chung, nhưng `/` chỉ có `noindex` của nền tảng; ghi "BS. Lê Thái Sơn VERIFIED" (chỉ họ tên) |
| DEV01-P3-1/2/5 | P3 | OPEN (nav desktop 38 px, dải thông tin, mô tả menu) |

**P0: không có. P1: không còn.**

## 13. Điều kiện trước Production

1. Dữ liệu thật thay cho mọi placeholder và nhãn nội bộ ở 3 trang 3A (nhân sự, chức danh, ảnh, cơ cấu, quy trình, thiết bị, phân khu, câu chuyện, nguyên tắc).
2. Ảnh cơ sở thật và giấy phép ảnh (AP-1, 2B-06).
3. Soft 404, 2B-08 / DEV01P-P2-2 (LCP mobile), 2B-29, câu Footer "phẫu thuật ngoại khoa".
4. Kiểm SEO Production riêng.
5. Chủ dự án phê duyệt riêng việc gỡ `noindex`, merge `main` và deploy Production.

## 14. Khuyến nghị nghiệm thu code 3A

| Điều kiện (034-B) | Kết quả |
|---|---|
| Không còn P0/P1 | Đạt |
| CLS đạt yêu cầu | Đạt (0 ở 24/24 lượt) |
| Build reproducibility VERIFIED | Đạt |
| Đúng Preview, không Production | Đạt |
| Không hồi quy nghiêm trọng | Đạt |
| Vấn đề chưa xác minh ghi nhận minh bạch | Đạt |

**Claude đề nghị ChatGPT CEO trình chủ dự án xem xét nghiệm thu code 3A có điều kiện**, tức là nghiệm thu mã nguồn và giao diện trên Preview `dpl_8XZEtH3csgeHa5cmzf5aw9hNR4EE` / SHA `4739d45`, kèm:

- DEV01P-P2-2 (LCP mobile 3A) và các P3 được đưa vào backlog.
- Không gỡ `noindex`, không merge `main`, không deploy Production cho tới khi đủ các điều kiện ở mục 13.

Claude không sửa code, không deploy, không merge, không chuyển Giai đoạn 3B.

---

**PHASE 3A PREVIEW FIX 01 — PENDING OWNER ACCEPTANCE**
