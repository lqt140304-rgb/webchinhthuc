# PHASE 3A — INDEPENDENT VERCEL PREVIEW QA

| Mục | Chi tiết |
|---|---|
| Căn cứ | CEO Directive 032-B; `docs/qa/3a-dev01-fix01-qa.md` (nhánh `claude/3a-dev01-fix01-qa`, commit `9b6661c`) |
| Agent | Claude — Independent QA Lead (READ-ONLY: không sửa code, không deploy, không promote) |
| Ngày | 27/10/2026 |
| Preview URL | `https://le-son-website-e4l44qyxb-lqt140304-rgb.vercel.app` |
| Deployment ID | `dpl_FysMST4wMKmGLPAFKBZvvT6H6zLZ` |
| Git SHA | `bbd78461c1acd3b7e8aece35b5591e13556e673e` (khớp SHA đã khóa) |
| Project | `le-son-website-qa` / `prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3` |
| Cách lấy thông tin | Vercel REST API (`GET` only) bằng `VERCEL_TOKEN`; truy cập Preview bằng header `x-vercel-protection-bypass`. Hai secret chỉ nằm trong biến môi trường; không ghi vào log, báo cáo hay bằng chứng (đã grep: 0 lần xuất hiện) |
| Đầu vào từ Antigravity | Phiên này chưa nhận handoff hoặc preflight Preview. URL và Deployment ID do Claude tự xác định qua API (deployment mới nhất của project, đúng SHA). Không dùng Preview cũ thay thế |
| Bằng chứng | `docs/qa/3a-preview-qa-evidence/`; scripts `tests/preview/`, `tests/dev01/` |

## Kết luận: **FAIL** (về nghiệm thu code 3A). Bản Preview hợp lệ và được bảo vệ đúng

- **Danh tính deployment: ĐẠT.**
  - Đúng SHA, đúng project, môi trường Preview (`oidc environment = preview`, `target = null`), READY.
  - Deployment Protection đang bật; Production không bị đụng; không có Git Integration.
- **BUILD REPRODUCIBILITY: NOT VERIFIED** so với Git checkout sạch.
  - JS giống từng byte; khác biệt chỉ là tên chunk.
  - CSS dư 418 B (2 class Tailwind): Antigravity deploy từ thư mục làm việc có sẵn `dist/` cũ và không upload `.gitignore`, nên Tailwind quét luôn bản build cũ.
  - Claude đã tái hiện đúng từng byte asset của Preview khi dựng lại theo điều kiện đó (mục 7).
  - Không ảnh hưởng hiển thị, nhưng là lỗi quy trình (**P2**).
- **P1 mới: CLS 0.41 trên cả 3 trang 3A** (mobile và desktop, 17/18 lượt Lighthouse).
  - Khung chờ `Suspense` của lazy route (`min-h-[50vh]`) làm Footer hiện lên giữa màn hình rồi bị đẩy đi khi trang tải xong.
  - Tái hiện được ở cả Preview và bản build local `bbd7846`, nên là lỗi code của DEV-01.
  - Lỗi này Claude **đã bỏ sót** ở QA DEV-01 và FIX 01, vì khi đó không đo CLS.
- **Các phần còn lại đạt:**
  - Visual, responsive và accessibility trên Preview giống hệt kết quả local FIX 01.
  - Header mobile 85 × 44 và 44 × 44.
  - Nội dung đúng Content Lock.
  - Trang chủ và `/dat-lich` chỉ khác ở vùng nút header (đúng chủ đích).
- **Vì có P1, Claude không đề xuất nghiệm thu code 3A ở vòng này.**
  - Cách sửa nhỏ, nằm trong `src/app/routes.tsx` (khung chờ không để Footer lộ ra hoặc giữ chỗ đủ cao).
  - Kèm theo: deploy lại từ checkout sạch; Claude retest nhanh sau đó.

---

## 1–5. Danh tính deployment (`deployment-*.json`, `project-*.json`, `deployments-list.json`)

| Trường | Giá trị | Đánh giá |
|---|---|---|
| `id` / `url` | `dpl_FysMST4wMKmGLPAFKBZvvT6H6zLZ` / `le-son-website-e4l44qyxb-lqt140304-rgb.vercel.app` | — |
| `projectId` / `name` | `prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3` / `le-son-website-qa` | Đúng project |
| `meta.githubCommitSha` | `bbd78461c1acd3b7e8aece35b5591e13556e673e` | Khớp SHA đã khóa |
| `meta.githubCommitRef` | `HEAD` (CLI deploy, `actor: antigravity`) | — |
| `target` | `null` | Không phải Production |
| `oidcTokenClaims.environment` | `preview` | **Xác nhận Preview** (không chỉ dựa vào dạng URL) |
| `project.targets.preview.id` | `dpl_FysMST4wMKmGLPAFKBZvvT6H6zLZ` | Deployment Preview hiện hành của project |
| `readyState` / `readySubstate` | `READY` / `STAGED` | Sẵn sàng; không promote |
| `alias` / `automaticAliases` | `[]` / `[]` | Không gắn alias hay domain |
| `source` | `cli` | Không qua Git Integration |
| Project `link` (Git Integration) | **Không có** | Git Integration không kết nối |
| `ssoProtection` | `{"deploymentType":"all"}` | Vercel Authentication bật cho mọi deployment |
| `protectionBypass` | 1 khóa, scope `automation-bypass` | Dùng cho QA |
| Production hiện hành | `dpl_BAz378AxMw59nUafGCMDM8Hws84s`, SHA `db78738`, tạo 26/10 | **Không đổi**; không có Production deployment mới trong lần triển khai này |
| Build settings | `npm run build`, output `dist`, framework vite, Node 24.x | Như các vòng 2B |

## 6. Deployment Protection và HTTP

**Chưa xác thực:** `/`, `/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat` và `/assets/index-*.js` đều trả **302** về `https://vercel.com/sso-api?...` (Vercel Authentication), kèm `x-robots-tag: noindex` của nền tảng.

**Có bypass:**

| Route | HTTP | `X-Robots-Tag` | Nguồn noindex |
|---|---|---|---|
| `/` | 200 | `noindex` | Nền tảng Preview (trang chủ không có rule trong `vercel.json`; meta là `index, follow`) |
| `/gioi-thieu`, `/gioi-thieu/` | 200 | `noindex, nofollow` | `vercel.json` (rule có từ Mốc 2B) |
| `/doi-ngu`, `/doi-ngu/` | 200 | `noindex, nofollow` | `vercel.json` |
| `/co-so-vat-chat`, `/co-so-vat-chat/` | 200 | `noindex, nofollow` | `vercel.json` |
| `/dat-lich` | 200 | `noindex, nofollow` | `vercel.json` (không đổi so với 2B) |
| `/doi-ngu?utm_source=qa&x=1`, `/gioi-thieu?ref=test` | 200 | `noindex, nofollow` | `vercel.json` |
| `/khong-ton-tai-xyz` | **200** | `noindex` | Nền tảng. **Soft 404 vẫn OPEN** |
| `/robots.txt`, `/sitemap.xml` | 200 | `noindex` | Nền tảng |

- Meta robots trong app: 3 trang 3A là `noindex, nofollow` (kể cả sau reload).
- Canonical không có dấu `/` cuối, nên `/gioi-thieu/` trỏ về `/gioi-thieu`.
- Kết quả SEO Preview **không** được dùng làm bằng chứng SEO Production.

## 7. Build reproducibility: **NOT VERIFIED** (so với Git sạch)

**Bước kiểm tra:**

1. Từ `git archive bbd7846`:
   - `npm ci`, `tsc -b` exit 0.
   - `oxlint` exit 0, kèm 2 warning trong `tests/verify-fix01.cjs`.
   - `vite build`.
2. Tải mọi file của Preview qua bypass và so từng byte.
3. Liệt kê file nguồn đã upload (`GET /v6/deployments/{id}/files`) và đối chiếu với cây Git (`uploaded-source-vs-git.json`).

**Kết quả:**

| Hạng mục | Git sạch (local) | Preview | So sánh |
|---|---|---|---|
| `index.html` | refs `index-Djndo7MH.js`, `index-Ctt7gNji.css` | refs `index-DA-wL_jZ.js`, `index-hcyqGPvN.css` + script `vercel.live/_next-live/feedback/feedback.js` | Khác tên asset; script feedback do Vercel chèn ở Preview (không thuộc app) |
| JS (main + 7 chunk) | 372,129 B, … | 372,129 B, … | **Giống từng byte sau khi chuẩn hóa tên chunk** |
| CSS | 67,969 B | **68,387 B** | Preview dư `.blur{…}` và `.filter\!{…}` |
| Font (6 file), ảnh (18 file), `robots.txt`, `sitemap.xml`, `favicon` | — | — | **Giống từng byte** |
| `icons.svg` | LF | CRLF | Chỉ khác ký tự xuống dòng |

**Nguyên nhân (đã chứng minh):**

- **File upload ngoài Git:** gói upload có **42 file không thuộc Git**, toàn bộ là thư mục `dist/` cũ trên máy Antigravity.
- **Thiếu `.gitignore`:** gói upload **không có `.gitignore`**.
- **CRLF:** 36 file khác Git chỉ do CRLF (Windows checkout); đã kiểm từng file, **0 khác biệt nội dung thật**.
- **Cơ chế:** Tailwind v4 tự dò source theo `.gitignore`. Thiếu file này, Tailwind quét cả `dist/assets/*.js` cũ (có chuỗi `blur` của React), nên sinh thêm 2 class.
- **Tái hiện:**
  - Git sạch + `dist/` cũ + bỏ `.gitignore` cho ra CSS `index-hcyqGPvN.css` 68,387 B.
  - Toàn bộ JS/CSS **trùng từng byte với Preview**.
  - Chỉ bỏ `.gitignore` hoặc chỉ thêm `dist/` thì không tái hiện được.

**Ảnh hưởng:** 2 class dư không được phần tử nào sử dụng, nên không đổi giao diện. Tuy vậy, bản deploy **không tái lập được từ Git** và phụ thuộc trạng thái máy cục bộ. **DEV01P-P2-1 (P2).**

**Đề xuất:** deploy từ bản clone sạch, hoặc thêm `.vercelignore` loại `dist/`, `node_modules/`, `.env*`. Vòng sau có thể xác minh byte-to-byte.

CSS Modules và font: tên class CSS Modules (`_frameLeft_od511_19`…) giống local; font WOFF2 giống từng byte.

## 8. Routing và SEO

Xem mục 6. Ngoài ra:

- Truy cập trực tiếp và reload 3 trang 3A đều 200, giữ `h1`, title và robots.
- Điều hướng từ menu mobile tới `/doi-ngu` hoạt động.
- Title, robots và canonical của `/`, `/dat-lich`, `/dich-vu`, `/bang-gia`, `/lien-he`, `/goc-thu-cung`, 404 **giống hệt** Preview Mốc 2B đã nghiệm thu (`dpl_HvyLw6bGTrDuNxJV3xeSSt6yimyC`, SHA `d3c32dd`; `regress.json`).

## 9. Visual QA ba trang (Preview, 320/375/768/1024/1440/1920)

Toàn bộ kết quả `qa-preview.json` **trùng với kết quả local FIX 01**:

| Kiểm tra | Kết quả |
|---|---|
| Tràn ngang / cắt chữ / ảnh méo | 0 / 0 / 0 trên 18 tổ hợp |
| `h1` / heading | 1 mỗi trang, không nhảy cấp |
| `/gioi-thieu` | Lora chữ đứng; 0 phần tử Lora nghiêng; lịch sử là slot chờ; 4 nguyên tắc là "[Đề xuất]"; CTA `/dat-lich`, `tel:`, link sang `/doi-ngu` và `/co-so-vat-chat` |
| `/doi-ngu` | Card 288 / 343 / 348 / 299 / 384 / 384 px (320 → 1920), **đồng nhất giữa 3 bộ phận**. Mô phỏng N = 1..8 trên Preview **trùng từng dòng** với local (`ngrid.txt`). Không có card VIP; BS. Lê Thái Sơn ở vị trí 2, cùng style. Nhãn "(Chờ xác nhận cơ cấu)", "Dữ liệu mô phỏng" giữ nguyên |
| Lưới 768–799 px | **OPEN (P3, DEV01F-P3-1)**: 1 cột 348 px căn giữa. Không xấu hơn baseline FIX 01 |
| `/co-so-vat-chat` | 4 khung gallery; alt đúng nội dung ảnh ("Thú cưng nghỉ ngơi…", "Chăm sóc dinh dưỡng…"); nhãn "Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn"; thiết bị và phân khu là slot chờ |

## 10–11. Accessibility và header mobile

| Kiểm tra | Kết quả |
|---|---|
| CTA mobile 320–414 | **85 × 44** ("Đặt lịch", 1 dòng), khớp FIX 01 |
| Hamburger | **44 × 44**, khớp FIX 01 |
| Header | Cao 73 px (mobile), 81 px (768); không tràn, không chồng chéo |
| Header desktop | Chỉ vùng CTA khác Preview 2B (cao 40 → 44 px, đúng chủ đích FIX 01) |
| Menu mobile | Dialog `aria-modal`, `aria-expanded`/`aria-controls`; Escape đóng và trả focus; chọn link chuyển trang và đóng menu |
| Bộ lọc | Tab, Shift+Tab, Enter, Space; `aria-pressed`; `aria-live` đọc "Đang hiển thị: Bộ phận Spa & Grooming (Chờ xác nhận)." |
| Focus | 2 px plum |
| Reduced motion | transition/animation tối đa 0.01 ms |
| Console | 0 error, 0 warning (18 tổ hợp) |
| Ghi chú | Khung chờ `PageLoadingFallback` là `div` có `aria-label` nhưng không có `role`, nên nhãn có thể không được đọc. Gom vào cùng lần sửa P1 (P3) |

## 12. Lighthouse và LCP

**Cấu hình:**

- Lighthouse 12.8.2, Chrome for Testing 153 headless.
- Mobile: mặc định (simulate, RTT 150 ms, 1.6 Mbps, CPU chậm 4×). Desktop: `--preset=desktop`.
- Chỉ đo category performance; header bypass truyền qua `--extra-headers`, đã gỡ khỏi file JSON lưu lại.
- 3 lượt mỗi trang × chế độ (`lighthouse/summary.txt`).

| Trang | Chế độ | Performance (3 lượt) | LCP trung vị (min–max) | CLS | TBT trung vị | FCP |
|---|---|---|---|---|---|---|
| `/` | mobile | **92** (82/92/95) | **2.86 s** (2.86–3.54) | 0 | 186 ms | 1.57 s |
| `/` | desktop | 100 | 0.73 s | 0 | 10 ms | 0.43 s |
| `/gioi-thieu` | mobile | 71 (71/68/71) | 3.48 s (3.48–3.76) | **0.411** | 114 ms | 1.56 s |
| `/gioi-thieu` | desktop | 81 | 0.73 s | **0.414** | 0 | 0.43 s |
| `/doi-ngu` | mobile | 72 (72/81/72) | 3.31 s (3.31–3.60) | **0.411** / 0 / **0.411** | 124 ms | 1.54 s |
| `/doi-ngu` | desktop | 81 | 0.71 s | **0.414** | 0 | 0.40 s |
| `/co-so-vat-chat` | mobile | 72 (72/72/70) | 3.33 s (3.31–3.33) | **0.411** | 120 ms | 1.54 s |
| `/co-so-vat-chat` | desktop | 81 | 0.72 s | **0.414** | 0 | 0.37 s |

Một lượt chạy thử trước đó cho trang chủ mobile ra 86 / 2.96 s. File của lượt này bị ghi đè nên không nằm trong bảng.

**So sánh với Mốc 2B:**

- Trang chủ mobile (trung vị 92 / 2.86 s) tương đương QA 2B-10 (gộp 8 lượt 91 / 2.87 s) và 2B-09 (93 / 2.88 s). **Không hồi quy.**
- **2B-08 vẫn OPEN:** chưa đạt LCP ≤ 2.5 s ổn định.

**DEV01P-P1-1 (P1): CLS 0.41 trên 3 trang 3A.**

- **Lighthouse:** phần tử dịch chuyển là `footer` (điểm 0.4138 ở desktop); trang chủ CLS = 0.
- **PerformanceObserver** (`cls-preview.json`, viewport 412 px):
  - Cả 3 trang có **1 layout shift 0.4107**, nguồn `FOOTER y 485 → 0`, ở cả mạng nhanh và mạng chậm.
  - Tái hiện **y hệt trên build local `bbd7846`** (`cls-local-bbd7846.json`).
- **Nguyên nhân:** `src/app/routes.tsx` bọc 3 trang bằng `<Suspense fallback={<PageLoadingFallback />}>`, với fallback `min-h-[50vh]`.
  - Trong lúc tải chunk, Footer hiện ngay giữa viewport.
  - Khi trang render, Footer bị đẩy xuống, tạo shift lớn.
- **Mức:** CLS 0.41 vượt ngưỡng "kém" (> 0.25) của Core Web Vitals; lặp lại ổn định 17/18 lượt; người dùng thấy Footer nháy lên rồi biến mất ở lần tải đầu. Đây là hồi quy mới do DEV-01, nên chặn nghiệm thu code.
- **Hướng sửa (Antigravity quyết định cách làm):**
  - Fallback chiếm ít nhất toàn bộ chiều cao viewport (ví dụ `min-h-screen`), hoặc không hiển thị Footer khi đang chờ.
  - Hoặc preload chunk trang (`modulepreload` hoặc import sớm khi vào route).
  - Sau khi sửa, kiểm lại CLS ≤ 0.1.

**DEV01P-P2-2 (P2): LCP mobile 3 trang 3A là 3.3–3.5 s** (trang chủ 2.86 s).

- LCP là chữ (`h1` hoặc đoạn dẫn) hoặc ảnh hero, chỉ render sau khi tải xong chunk lazy (thêm một vòng request).
- Liên quan tới 2B-08; xử lý cùng P1 bằng preload chunk sẽ cải thiện.
- Không đề xuất đổi typography hay hình ảnh.

## 13. Regression Mốc 2B

| Kiểm tra | Kết quả |
|---|---|
| Trang chủ 6 section | Text, SEO và robots giống Preview 2B. Pixel diff toàn trang (đã chờ tải hết ảnh lazy) chỉ khác vùng nút header: 375 px bbox (229, 14)–(356, 60); 1440 px bbox (1169, 18)–(1329, 64). Lần chụp đầu có 2 vùng khác do ảnh lazy chưa tải xong; lần chụp lại xác nhận không phải hồi quy |
| `/dat-lich` | Như trên; booking demo không đổi, vẫn trung thực |
| Header / Footer / font / navigation | Header chỉ đổi vùng chạm (đúng chủ đích); Footer giống hệt; font giống từng byte |
| Nội dung nội bộ công khai | Trang chủ không có. 3 trang 3A có nhãn Preview (mục 14) |
| Còn mở | Soft 404 OPEN; 2B-08 OPEN; 2B-06 PENDING; SEO Production chưa kiểm; 2B-29 OPEN (logo Champion vẫn ở `why-pet-companion.webp`, giống từng byte); Footer "phẫu thuật ngoại khoa" chờ xác minh |

## 14. Nguồn ảnh và content integrity

- Quét text render, `alt`, `aria-label`, title và meta: **0** cụm từ bị cấm. Ngoại lệ là "phẫu thuật" trong Footer (có từ Mốc 2B).
- Nhân sự: chỉ tên BS. Lê Thái Sơn là VERIFIED; chức danh, lĩnh vực, lịch và các thẻ khác đều PENDING hoặc mô phỏng. Bộ phận có "(Chờ xác nhận cơ cấu)".
- Cam kết phục vụ, quy trình, câu chuyện sáng lập, thiết bị và phân khu: tất cả là "[Đề xuất]" hoặc slot "Chờ…".
- Ảnh: `article-prevention.webp` (AI, tự khai) và `article-nutrition.webp` (stock) **UNVERIFIED**; **AP-1 PARTIAL**.
- **Phân biệt hai loại điều kiện:**
  - *Nghiệm thu code và giao diện Preview:* các nhãn PENDING, mô phỏng và Preview là **đúng yêu cầu**.
  - *Phát hành công khai:* **chưa đủ điều kiện**. Cần dữ liệu nhân sự, ảnh, thiết bị và phân khu thật; giấy phép ảnh; gỡ toàn bộ nhãn nội bộ ("Chủ dự án", "Dữ liệu mô phỏng", "Bản thiết kế sơ bộ", "[Đề xuất]"); xử lý Soft 404, 2B-29 và câu Footer.

## 15. Danh sách lỗi

| ID | Mức | Nội dung |
|---|---|---|
| — | P0 | Không có |
| **DEV01P-P1-1** | **P1** | CLS 0.41 trên `/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat` (mobile và desktop) do Suspense fallback `min-h-[50vh]` làm Footer dịch chuyển (`src/app/routes.tsx`) |
| DEV01P-P2-1 | P2 | Build Preview không tái lập từ Git: upload kèm `dist/` cũ, thiếu `.gitignore`, nên CSS dư 418 B; file nguồn CRLF |
| DEV01P-P2-2 | P2 | LCP mobile 3 trang 3A 3.3–3.5 s do chunk lazy (liên quan 2B-08) |
| DEV01F-P3-1 | P3 | Lưới 1 cột ở 768–799 px (OPEN từ FIX 01) |
| DEV01P-P3-1 | P3 | `PageLoadingFallback` dùng `aria-label` mà không có `role` |
| DEV01F-P3-3 | P3 | 2 warning lint trong `tests/verify-fix01.cjs` |
| DEV01P-P3-2 | P3 | Chưa có handoff hoặc preflight Preview trong repo; Claude tự xác định deployment qua API |
| DEV01-P3-1/2/5 | P3 | Như báo cáo FIX 01 (nav desktop 38 px, dải thông tin `/gioi-thieu`, mô tả menu) |

## 16. Điều kiện trước Production

1. Sửa DEV01P-P1-1, deploy lại từ checkout sạch (DEV01P-P2-1), rồi để Claude retest: CLS, byte-to-byte, Lighthouse.
2. Dữ liệu thật thay cho mọi placeholder và nhãn nội bộ trên 3 trang 3A.
3. Ảnh cơ sở thật và giấy phép ảnh (AP-1, 2B-06).
4. Soft 404, 2B-08, 2B-29, câu Footer "phẫu thuật ngoại khoa".
5. Kiểm SEO Production riêng (không dựa trên Preview).
6. Chủ dự án phê duyệt riêng việc gỡ `noindex`, merge `main` và deploy Production.

## 17. Khuyến nghị

- **Không đề xuất nghiệm thu code 3A ở vòng này** do DEV01P-P1-1.
- Bản Preview hiện tại hợp lệ: đúng SHA, đúng project, đúng môi trường Preview, có Vercel Authentication và noindex. Chủ dự án có thể dùng bản này để **xem giao diện và nội dung**.
- Đề nghị CEO giao Antigravity:
  1. Sửa fallback lazy route và cân nhắc preload chunk.
  2. Deploy Preview mới từ bản clone sạch (có `.gitignore` hoặc `.vercelignore`).
  3. Gom các P3 nhỏ nếu muốn.
- Claude sẽ retest có mục tiêu: CLS, Lighthouse, byte-to-byte, hồi quy nhanh.
- Claude không cho phép Production, không merge `main`, không chuyển Giai đoạn 3B.

---

**PHASE 3A PREVIEW QA — PENDING OWNER ACCEPTANCE**
