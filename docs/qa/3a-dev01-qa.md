# PHASE 3A DEV-01 — INDEPENDENT LOCAL QA

| Mục | Chi tiết |
|---|---|
| Căn cứ | CEO Directive 028-B; `AGENTS.md` (Architecture Baseline V1); Blueprint 3A v2.4; mockup đã duyệt có điều kiện; `docs/qa/3a-dev00-qa-02.md` |
| Agent | Claude — Independent QA Lead (QA ONLY: không sửa code, không merge, không deploy) |
| Ngày | 27/10/2026 |
| Nhánh kiểm tra | `feat/phase-3a-dev01` |
| Commit kiểm tra | `e1d45c99d9fa1ee13850c91367877de85e05f07a`: "feat(phase-3a): DEV-01 implement /gioi-thieu, /doi-ngu, and /co-so-vat-chat" (1 commit trên baseline) |
| Baseline | `ab443fe2654ecee234c48ab4a54b21b820fbcc9e` (DEV-00) |
| Bàn giao | `docs/qa/3a-dev01-handoff.md` ("PHASE 3A DEV-01 — READY FOR INDEPENDENT LOCAL QA") |
| Môi trường | Cây sạch từ `git archive`; `npm ci` từ lockfile; `vite preview` cục bộ; Playwright Chromium (render thật). Baseline build song song để so sánh hồi quy |
| Bằng chứng | `docs/qa/3a-dev01-qa-evidence/`; scripts `tests/dev01/qa-dev01.cjs`, `tests/dev01/regress-dev01.cjs` |

## Kết luận: **PASS WITH FIXES**

- **Không có P0, không có P1.**
  - Nội dung 3 trang bám đúng Content Lock của DEV-00.
  - Không có card VIP, không có ảnh người.
  - Không có claim bị cấm. Cả 3 route đều `noindex, nofollow`.
  - Trang chủ và `/dat-lich` giống baseline từng pixel.
- **Header mobile (V3-P3-1 / 3A04-P2-1): FIXED** trên code thật.
- **Có 4 lỗi P2 cần sửa:**
  - Lưới card nhân sự chưa đúng quy tắc đồng đều và căn giữa.
  - Câu trích dẫn dùng Lora nghiêng giả lập.
  - Alt text ảnh minh họa mô tả sai thành phân khu cơ sở.
  - Câu chữ nội bộ "Bản mockup" lộ ra trang thật.
- **Khuyến nghị:** đủ điều kiện để CEO **trình chủ dự án xem xét mở bước Preview riêng**. Nên sửa 4 lỗi P2 (đều nhỏ, trong 2 file) trước khi tạo Preview, để chủ dự án duyệt đúng bản.

---

## 1. Branch và commit

- `origin/feat/phase-3a-dev01` @ `e1d45c9`, cha trực tiếp là `ab443fe`.
- `origin/main` vẫn @ `d2a19c5`; `e1d45c9` **chưa merge**. Claude không tạo deployment.
- 14 file thay đổi (`diff-stat-ab443fe-e1d45c9.txt`):

| Nhóm | File | Phạm vi |
|---|---|---|
| Trang mới | `src/pages/AboutPage.tsx`, `TeamPage.tsx`, `FacilitiesPage.tsx` | Đúng phạm vi |
| Component mới | `src/components/editorial/` (7 file) | Đúng phạm vi |
| Routing | `src/app/routes.tsx`: thay 3 `ComingSoonView` bằng `React.lazy` + `Suspense` | Đúng phạm vi |
| Header dùng chung | `src/components/layout/Header.tsx`: breakpoint `min-[380px]` → `min-[420px]`, `shrink-0`; đổi mô tả menu "Bác sĩ trưởng Lê Thái Sơn & cộng sự" thành "Đội ngũ bác sĩ thú y & nhân sự chăm sóc" | Trong phạm vi 028-A (header mobile + claim dòng 27) |
| Tài liệu | `docs/phase-3a-design-blueprint.md`, `docs/qa/3a-dev01-handoff.md` | Đúng phạm vi |

- **Không có thay đổi** ở `src/components/sections/` (6 section trang chủ), `BookingPage`, `package.json`, lockfile, `vite.config.ts`, `vercel.json`, `public/`, Dashboard hay backend.
- Không có refactor ngoài chỉ đạo.

## 2. Architecture

| Hạng mục | Kết quả |
|---|---|
| 3 route `/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat` | Có; nằm trong `RootLayout` công khai (Header, `main`, Footer dùng chung) |
| Design tokens | Dùng `var(--color-*)` của `tokens.css`; không thêm hệ màu mới. Riêng nền monogram dùng hex cứng `#F8F2F9`/`#EFE4F2` (chính là giá trị Lavender của Blueprint; P3) |
| Component reuse | 7 component editorial dùng chung cho 3 trang; tái dùng `useRouteSeo`, `HOSPITAL_CONTACT` |
| Lazy loading | 3 chunk riêng: `AboutPage` 13.7 kB, `TeamPage` 14.0 kB, `FacilitiesPage` 15.5 kB, cùng 4 chunk component dùng chung. Không chunk nào được import tĩnh vào bundle chính |
| Bundle chính | `index-*.js` 369,954 → 372,055 B (+2.1 kB do `lazy`/`Suspense` và fallback); CSS 61,365 → 67,851 B (class Tailwind mới). Chấp nhận được; 2B-08 (LCP mobile) vẫn OPEN, cần đo lại ở Preview |
| Dashboard / backend / Phase 3B | Không đụng, không thêm |

## 3. TypeScript, lint, build (tái hiện trong môi trường sạch)

| Lệnh | Kết quả |
|---|---|
| `npm ci` | 51 package từ lockfile, OK |
| `npx tsc -b` | exit 0, 0 lỗi |
| `npx oxlint` | exit 0 |
| `vite build` | OK. Tên file và kích thước **trùng khớp** với handoff: `index-OmL1EhSF.css` 67.85 kB, `index-BasVjfIT.js` 372.05 kB, `AboutPage--xMfhaGN.js`, `TeamPage-DjwogvDo.js`, `FacilitiesPage-Byql37O2.js` (`build-e1d45c9.txt`) |

## 4. Routing (local `vite preview`)

| Kiểm tra | Kết quả |
|---|---|
| Truy cập trực tiếp 3 route | HTTP 200, render đúng `h1` |
| Reload | HTTP 200, `h1`, title và robots giữ nguyên |
| Điều hướng nội bộ | CTA `/dat-lich`, `tel:0973555105`, link `/doi-ngu` và `/co-so-vat-chat` từ `/gioi-thieu`, Google Maps (`target=_blank rel=noopener`) |
| Metadata | Title riêng cho từng trang; meta description có; canonical `https://bvthuyleson.vn/<route>`; **robots `noindex, nofollow` cả 3 trang** |
| Route khác | `/`, `/dat-lich`, `/dich-vu`, `/bang-gia`, `/lien-he`, `/goc-thu-cung`, 404: title, robots, canonical và nội dung **giống hệt baseline** (`regress.json`). Trang chủ vẫn `index, follow` |
| Soft 404 | Vẫn trả 200 cho route lạ (giữ nguyên, ngoài phạm vi) |

Ghi chú: kết quả SEO là kết quả local. **Không** dùng để đánh giá SEO Production.

## 5. Visual fidelity từng trang

Đã so sánh ảnh chụp render thật của DEV-01 với mockup DEV-00 cạnh nhau (`screens/cmp-*.jpg`).

| Trang | Bố cục / nội dung so với mockup | Sai khác |
|---|---|---|
| `/gioi-thieu` | Đủ 5 section đúng thứ tự: hero 7/5 có ảnh, dải 3 thông tin, câu chuyện kèm slot, triptych 3 giá trị, ledger 4 đề xuất kèm ảnh, 2 thẻ điều hướng và CTA tối | **DEV01-P2-2:** câu trích dẫn Section 1.2 bị **Lora nghiêng giả lập** (class `italic` trên `h2` serif; dự án không tải Lora italic). Mockup và Blueprint 2.1 yêu cầu "Lora 600, kiểu chữ đứng `normal`". Dải thông tin hiển thị dạng 3 thẻ thay vì 3 cột kẻ chỉ (P3, chấp nhận được) |
| `/doi-ngu` | Hero, banner, bộ lọc 4 nút, 3 bộ phận, triptych 3 bước, CTA: đúng nội dung mockup | **DEV01-P2-1:** lưới card (mục 6) |
| `/co-so-vat-chat` | Hero, banner chính sách ảnh, gallery 4 khung (7/5 + 6/6), ledger 3 hạng mục, 2 khối nội trú, khối chỉ đường nền tối có Google Maps | **DEV01-P2-3:** alt text (mục 8) |

Chung:

- **Typography:** Lora (variable 400–900) cho heading và Be Vietnam Pro 400/500/600/700/400i cho body, tải từ font tự host. Ngoài câu trích dẫn nêu trên, không có Lora nghiêng nào khác.
- **Màu:** đúng token plum, orange, lavender, ivory.
- **Ảnh:** `object-fit: cover`, không méo; tỷ lệ khung 4:5, 16:10, 4:3 đúng như thiết kế.
- **Header và Footer:** là component dùng chung, không đổi ngoài header mobile.
- **Console:** 0 error, 0 warning trên 18 tổ hợp.

## 6. Responsive (3 trang × 320/375/768/1024/1440/1920)

| Tiêu chí | Kết quả |
|---|---|
| Tràn ngang | 0/18 |
| Chữ bị cắt | 0 (một kết quả là vùng `sr-only` của bộ lọc, đúng thiết kế) |
| Ảnh méo | 0 |
| `h1` | 1 mỗi trang; không nhảy cấp heading |
| Tap target trong `main` | 0 phần tử < 44 px (nút lọc, CTA, breadcrumb đều ≥ 44 px) |

**DEV01-P2-1: lưới card nhân sự chưa đạt quy tắc "đồng đều tuyệt đối" và "hàng cuối căn giữa"** (Blueprint 2.2 quy tắc 6, 8, 9; mockup đã đạt):

| Viewport | Bác sĩ (N = 3) | Spa (N = 1) | Hỗ trợ (N = 2) |
|---|---|---|---|
| 768 | 344 × 738; **card thứ 3 nằm lệch trái một mình** (x = 24), không căn giữa | **384** × 746 | 344 × 696 |
| 1024 | **299** × 701 | **384** × 746 | **368** × 726 |
| 1440 / 1920 | 384 × 740 | 384 × 746 | **368** × 726 |

- Nguyên nhân: mỗi bộ phận dùng một cách dựng khác nhau (`grid-cols-3`, `max-w-sm`, `max-w-3xl` hai cột).
- Hệ quả:
  - Card Spa duy nhất **rộng hơn card bác sĩ** 85 px ở 1024 px.
  - Ở 768 px hàng cuối không căn giữa.
- Code cũng chưa có quy tắc lưới tổng quát cho N = 1..8 như Blueprint 3.2: dữ liệu và số cột đang cố định.
- Đề xuất sửa: một component lưới dùng chung với độ rộng card cố định (ví dụ `flex flex-wrap justify-center` và `basis` theo breakpoint), áp dụng cho cả 3 bộ phận.

## 7. Accessibility và tương tác

| Kiểm tra | Kết quả |
|---|---|
| Bộ lọc bằng bàn phím | Tab, Shift+Tab di chuyển giữa 4 nút; Enter và Space chọn. `aria-pressed` cập nhật đúng; bộ phận không chọn được gỡ khỏi DOM (không làm mờ) |
| `aria-live` | `role=status`, `aria-live=polite`, đọc: "Đang hiển thị: Bộ phận Spa & Grooming (Chờ xác nhận)." Có nghĩa, **kèm nhãn chờ** (DEV00-P3-5 FIXED), không có thuật ngữ kỹ thuật |
| Focus | Vòng focus 2 px plum trên mọi link và nút (breadcrumb dùng ring `focus-visible`) |
| Mobile menu (375) | Nút `aria-expanded` false→true, `aria-controls="mobile-nav-dialog"`; `role=dialog aria-modal`; focus vào trong dialog; Escape đóng và trả focus về nút; mục "Về Lê Sơn" có đủ 3 route mới; chọn `/doi-ngu` chuyển trang và đóng menu |
| Reduced motion | transition/animation tối đa 0.01 ms (`globals.css`); spinner fallback cũng bị tắt |
| Alt text | Có trên mọi ảnh; ảnh monogram `aria-hidden`. Riêng ảnh trang cơ sở vật chất bị sai mô tả (DEV01-P2-3) |
| Semantics | Breadcrumb `nav aria-label` + `aria-current=page`; banner `role=region` có nhãn; card `article`; gallery `figure`/`figcaption` |

## 8. Content integrity

Đã quét text render của 3 trang (kể cả 4 trạng thái bộ lọc), thuộc tính `alt`/`aria-label`/`title`, title và meta. Kết quả **0 lần xuất hiện** cho mọi cụm từ bị cấm: "Nội/Ngoại khoa", "hội chẩn", "phác đồ", "Kỹ thuật viên", "Nhân viên Hỗ trợ", "khép kín", "kíp trực", "bàn giao", "cách ly", "hồi sức", "phân luồng", "tách biệt", "đèn sưởi", "sinh hiệu", "Mindray", "phòng mổ", "sạch khuẩn", "Bác sĩ trưởng", "3 bác sĩ", "năm kinh nghiệm", "giải thưởng", "chứng nhận", "hàng đầu", "số 1".

| Trang | Kết quả |
|---|---|
| `/gioi-thieu` | Không có lịch sử thành lập tự tạo (slot "sẽ được cập nhật chính thức sau khi Chủ dự án xác nhận"); không có thành tích hay chứng nhận; 4 nguyên tắc đều "[Đề xuất 0x]" kèm banner đề xuất; 3 giá trị lấy từ trang chủ đã nghiệm thu |
| `/doi-ngu` | Không có card VIP hay section riêng; BS. Lê Thái Sơn ở vị trí 2, cùng style card. Chức danh "[Chức danh: Bác sĩ Thú y — Chờ xác nhận]", lĩnh vực và lịch "[Chờ cập nhật]". Các card khác "[… — Dữ liệu mô phỏng]". Sĩ số có khung "chờ Chủ dự án cung cấp". Bộ phận Spa và Hỗ trợ có "(Chờ xác nhận cơ cấu)". Quy trình là "[Đề xuất]". 0 ảnh người |
| `/co-so-vat-chat` | Không khẳng định phân khu; thiết bị và phân khu là slot "Chờ xác nhận"; không có model thiết bị; banner ghi rõ trang chỉ xuất bản khi có ảnh thật |
| Header | Mô tả menu "Bác sĩ trưởng Lê Thái Sơn & cộng sự" đã được thay bằng mô tả trung tính |

Lỗi tìm thấy:

- **DEV01-P2-3 (alt text khẳng định ảnh minh họa là phân khu cơ sở):** `src/pages/FacilitiesPage.tsx`, gallery khung 01 và 02.
  - Ảnh chó cuộn chăn có alt "Không gian tiếp đón và chờ thăm khám (ảnh minh họa)".
  - Ảnh bát thức ăn có alt "Khu vực thăm khám lâm sàng (ảnh minh họa)".
  - Người dùng trình đọc màn hình sẽ nghe ảnh được mô tả là khu vực của bệnh viện, trái quy tắc Blueprint 2.3 "không dùng ảnh minh họa để chứng minh cơ sở có phòng, khu vực…".
  - Mockup dùng alt mô tả đúng nội dung ảnh ("Thú cưng nghỉ ngơi trong không gian ấm áp", "Chăm sóc dinh dưỡng cho thú cưng"). Sửa bằng cách dùng lại alt của mockup.
- **DEV01-P2-4 (câu chữ nội bộ lộ ra trang thật):** `src/pages/TeamPage.tsx`, slot Section 2.2 ghi "**Bản mockup** hiện hiển thị các thẻ mẫu trung tính để kiểm thử quy tắc lưới cân bằng."
  - Đây là ngôn ngữ của bản mockup, không phù hợp cho trang website.
  - Rộng hơn: các nhãn "Bản thiết kế sơ bộ", "Chủ dự án", "Dữ liệu mô phỏng", "[… — Chờ …]" phù hợp cho Preview nội bộ, nhưng **là điều kiện chặn phát hành Production**: phải thay bằng dữ liệu thật hoặc ẩn trước khi gỡ `noindex`.
  - Đề xuất: đổi "Bản mockup" thành "Trang" (hoặc "Bản xem trước") ngay; ghi điều kiện chặn phát hành vào handoff.

## 9. Nguồn ảnh

| Ảnh | Dùng tại | Trạng thái (`docs/assets-credits.md`, Blueprint 7) |
|---|---|---|
| `article-prevention.webp` | `/gioi-thieu` hero; `/co-so-vat-chat` khung 01 | **UNVERIFIED** (AI, tự khai) |
| `article-nutrition.webp` | `/gioi-thieu` 1.4; `/co-so-vat-chat` khung 02 | **UNVERIFIED** (stock, chưa rõ tác giả) |
| Khung 03, 04 `/co-so-vat-chat`; monogram | — | Không có ảnh (gradient/monogram) |

- Mọi khung ảnh có nhãn "Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn" hoặc "Khung sơ đồ kiến trúc — Chờ ảnh thực tế".
- 0 ảnh người. Không dùng `why-pet-companion.webp` (logo Champion).
- **AP-1 vẫn PARTIAL.** Ảnh UNVERIFIED **không đạt điều kiện phát hành Production**; chỉ dùng cho Preview.
- Handoff ghi sai: dùng `article-firstaid-choking.webp` ở `/gioi-thieu` 1.2 và gallery khung 02. Thực tế file này **không tồn tại** và không được dùng (DEV01-P3-3).

## 10. Header mobile

**V3-P3-1 / 3A04-P2-1: FIXED** (đo trên trang chủ và `/doi-ngu`):

| Viewport | CTA | Cao CTA | Phụ đề logo | Cao header | Tràn |
|---|---|---|---|---|---|
| 320 / 360 / 375 / 390 / 400 / 414 | "Đặt lịch" (1 dòng) | 28 px | ẩn | 73 px | 0 |
| 420 / 430 | "Đặt lịch khám" (1 dòng) | 28 px | hiện, 1 dòng | 73 px | 0 |
| 768 | "Đặt lịch khám" | 32 px | hiện | 81 px | 0 |

Thay đổi này cũng áp dụng cho header trang chủ ở 380–419 px: phụ đề ẩn, CTA rút gọn. Đây là thay đổi chủ đích. Ở 375 và 1440 px trang chủ không đổi pixel nào.

**DEV01-P3-1 (có từ trước):** các phần tử header nhỏ hơn 44 px: CTA mobile cao 28 px, nút hamburger 36 × 36, link nav desktop cao 38 px. Không do DEV-01 gây ra, nhưng Header đã được sửa trong vòng này nên nên nâng vùng chạm lên ≥ 44 px khi có chỉ đạo.

## 11. Regression Mốc 2B

| Kiểm tra | Kết quả |
|---|---|
| 6 section trang chủ | Source không đổi; DOM text, title, robots, canonical giống baseline; ảnh chụp toàn trang ở 375 và 1440 **khác 0 pixel** |
| `/dat-lich` (booking demo) | Source không đổi; render giống baseline 0 pixel; không có hành vi xác nhận giả mới |
| SEO route khác | Giống baseline |
| Dashboard | Không đụng |
| Soft 404 | OPEN (không sửa; ngoài phạm vi) |
| 2B-29 (logo Champion, `WhyChooseUs.tsx:30`) | OPEN (không sửa) |
| 2B-08 (LCP mobile) | OPEN; bundle chính +2.1 kB, cần đo ở Preview |
| 2B-06 (ảnh thật / nguồn ảnh) | PENDING |
| SEO Production | Chưa kiểm |
| Ghi nhận có từ trước (ngoài phạm vi) | Footer dùng chung ghi "cung cấp dịch vụ thăm khám lâm sàng, **phẫu thuật ngoại khoa**…". Câu này giống baseline, nhưng khác nguyên tắc của 3A "không tự khẳng định có phòng phẫu thuật". Báo để CEO quyết định, không thuộc DEV-01 |

## 12. Danh sách lỗi

| ID | Mức | Vị trí | Nội dung |
|---|---|---|---|
| — | P0 | — | Không có |
| — | P1 | — | Không có |
| **DEV01-P2-1** | P2 | `src/pages/TeamPage.tsx` (lưới 3 bộ phận) | Card không cùng kích thước giữa các bộ phận (299/384/368 px ở 1024); card thứ 3 lệch trái ở 768; chưa có quy tắc lưới N = 1..8 |
| **DEV01-P2-2** | P2 | `src/pages/AboutPage.tsx` Section 1.2 (`h2 … italic`) | Lora nghiêng giả lập; spec yêu cầu chữ đứng |
| **DEV01-P2-3** | P2 | `src/pages/FacilitiesPage.tsx` khung 01, 02 | Alt text mô tả ảnh minh họa thành phân khu cơ sở |
| **DEV01-P2-4** | P2 | `src/pages/TeamPage.tsx` slot Section 2.2 | "Bản mockup…" trên trang thật; các nhãn nội bộ là điều kiện chặn Production |
| DEV01-P3-1 | P3 | `Header.tsx` (có từ trước) | Vùng chạm CTA 28 px, hamburger 36 px, nav desktop 38 px |
| DEV01-P3-2 | P3 | `AboutPage.tsx` | Dải thông tin dạng thẻ thay vì 3 cột kẻ chỉ như mockup |
| DEV01-P3-3 | P3 | `docs/qa/3a-dev01-handoff.md` | Ghi sai ảnh `article-firstaid-choking.webp` (không tồn tại); ghi `aria-live` "thông báo số lượng card" (thực tế đọc tên bộ phận); ghi Section 1.2 có ảnh (thực tế không có) |
| DEV01-P3-4 | P3 | `TeamMemberCard.tsx` | Hex cứng `#F8F2F9`/`#EFE4F2` thay vì token |
| DEV01-P3-5 | P3 | `Header.tsx` (có từ trước) | Mô tả menu "Lịch sử & triết lý…", "Phòng khám & trang thiết bị chuyên dụng" ngầm nhắc nội dung chưa có hoặc chưa xác minh |

Các mục trước đã đóng ở vòng này: V3-P3-1 / 3A04-P2-1 **FIXED**; DEV00-P3-5 (`aria-live`) **FIXED**; 3A04-P3-1 (class bộ lọc) **N/A** (code React mới không còn lỗi này); Blueprint 8.1 dòng V3-P3-1 đã cập nhật đúng thực tế.

## 13. Khuyến nghị về Preview

- Không có P0/P1.
- Build, typecheck và lint tái hiện được trong môi trường sạch.
- Không có hồi quy Mốc 2B; không sửa ngoài phạm vi.

**Claude đề nghị ChatGPT CEO trình chủ dự án xem xét mở bước Preview riêng**, với khuyến nghị:

1. Antigravity sửa DEV01-P2-1 … P2-4 trước khi tạo Preview (chỉ trong `TeamPage.tsx`, `AboutPage.tsx`, `FacilitiesPage.tsx`), rồi Claude retest nhanh.
2. Preview giữ `noindex` (cả meta và header `X-Robots-Tag`) và Deployment Protection. Đo lại LCP mobile (2B-08) trên Preview.
3. **Không phát hành Production** khi còn: dữ liệu nhân sự, ảnh và cơ sở vật chất PENDING; ảnh UNVERIFIED (AP-1 / 2B-06); nhãn nội bộ (DEV01-P2-4); Soft 404; 2B-29.

Claude không sửa source, không deploy, không merge.

---

**PHASE 3A DEV-01 — PENDING OWNER PREVIEW APPROVAL**
