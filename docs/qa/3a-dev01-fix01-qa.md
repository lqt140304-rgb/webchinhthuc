# PHASE 3A DEV-01 FIX 01 — INDEPENDENT QA

| Mục | Chi tiết |
|---|---|
| Căn cứ | CEO Directive 030-B; báo cáo trước `docs/qa/3a-dev01-qa.md` (nhánh `claude/3a-dev01-qa`, commit `e1cf04b`) |
| Agent | Claude — Independent QA Lead (QA ONLY) |
| Ngày | 27/10/2026 |
| Nhánh kiểm tra | `feat/phase-3a-dev01` |
| Commit kiểm tra | `bbd78461c1acd3b7e8aece35b5591e13556e673e`: "fix(phase-3a): DEV-01 fix 01 — 4 P2 issues & mobile touch targets" (1 commit trên baseline) |
| Baseline | `e1d45c99d9fa1ee13850c91367877de85e05f07a` (DEV-01 trước sửa); hồi quy Mốc 2B so với `ab443fe` |
| Bàn giao | `docs/qa/3a-dev01-fix01-handoff.md` |
| Môi trường | Cây sạch (`git archive`), `npm ci`, `vite preview` cục bộ, Playwright Chromium render thật |
| Bằng chứng | `docs/qa/3a-dev01-fix01-qa-evidence/`; scripts `tests/dev01/` (`qa-dev01.cjs`, `regress-dev01.cjs`, `ngrid.cjs`) |

## Kết luận: **PASS WITH FIXES** (chỉ còn P3, không chặn Preview)

- **Cả 4 lỗi P2 đều FIXED** khi đo trên render thật.
- **Vùng chạm header mobile: FIXED** (CTA 85 × 44, hamburger 44 × 44, header vẫn cao 73 px).
- Không có P0, không có P1, không có hồi quy nghiêm trọng.
  - Trang chủ và `/dat-lich` chỉ khác ở vùng nút CTA/hamburger của header, đúng với chủ đích sửa.
  - Phần còn lại của trang khác 0 pixel.
- **Còn 3 lỗi P3 mới:**
  - Ở 768–799 px card nhân sự xếp 1 cột, thay vì 2 cột như mockup.
  - Handoff mô tả sai bố cục ở 768 px.
  - Có 2 warning lint trong file test mới.
- **Khuyến nghị:** đề xuất CEO trình chủ dự án xem xét **cấp quyền tạo Vercel Preview**.

---

## 1. Branch và commit

- `origin/feat/phase-3a-dev01` @ `bbd7846`, cha `e1d45c9`.
- `origin/main` vẫn @ `d2a19c5`, chưa merge. Không deploy.
- 8 file thay đổi (`diff-stat-e1d45c9-bbd7846.txt`):

| File | Thay đổi | Phạm vi |
|---|---|---|
| `src/components/editorial/TeamGrid.tsx` (mới) | Lưới `flex flex-wrap justify-center` dùng chung | DEV01-P2-1 |
| `src/components/editorial/TeamMemberCard.tsx` | Độ rộng card theo breakpoint; hex cứng thay bằng token (DEV01-P3-4) | DEV01-P2-1 |
| `src/pages/TeamPage.tsx` | 3 bộ phận dùng `TeamGrid`; sửa câu "Bản mockup" | DEV01-P2-1, P2-4 |
| `src/pages/AboutPage.tsx` | Bỏ class `italic` | DEV01-P2-2 |
| `src/pages/FacilitiesPage.tsx` | Sửa 2 alt | DEV01-P2-3 |
| `src/components/layout/Header.tsx` | CTA `min-h-[44px]`; hamburger `min-w/min-h-[44px]` | DEV01-P3-1 |
| `tests/verify-fix01.cjs` (mới) | Script Playwright cục bộ (server tĩnh 127.0.0.1); không gọi dịch vụ ngoài | Hỗ trợ kiểm thử |
| `docs/qa/3a-dev01-fix01-handoff.md` (mới) | Báo cáo bàn giao | Tài liệu |

Không có thay đổi ở `src/components/sections/` (trang chủ), `BookingPage`, routing, `package.json`, lockfile, `vite.config.ts`, `vercel.json`, `public/`, Dashboard hay backend.

## 2. Bốn lỗi P2

| ID | Kết quả | Tóm tắt |
|---|---|---|
| **DEV01-P2-1** Team Grid | **FIXED** | Card cùng chiều rộng giữa 3 bộ phận ở mọi viewport; hàng cuối căn giữa; N = 1..8 đạt (mục 3). Còn 1 P3 về số cột ở 768–799 px |
| **DEV01-P2-2** Typography | **FIXED** | Mục 4 |
| **DEV01-P2-3** Alt text | **FIXED** | Mục 5 |
| **DEV01-P2-4** Nội dung Preview | **FIXED** | Mục 6 |

## 3. Team Grid: số đo thực tế (`qa-dev01.json`, `ngrid.txt`)

**Dữ liệu thật trên `/doi-ngu`** (chiều rộng × chiều cao card, px):

| Viewport | Bác sĩ (N = 3) | Spa (N = 1) | Hỗ trợ (N = 2) | So với baseline `e1d45c9` |
|---|---|---|---|---|
| 320 | 288 (1 cột) | 288 | 288 | Không đổi |
| 375 | 343 (1 cột) | 343 | 343 | Không đổi |
| 768 | **348 / 348 / 348**, 1 cột, căn giữa (x = 210) | **348** | **348 / 348** | Trước: 344 / **384** / 344, card 3 lệch trái |
| 1024 | **299 / 299 / 299** | **299**, căn giữa | **299 / 299**, căn giữa | Trước: **299 / 384 / 368** |
| 1440 | 384 × 739 | 384, căn giữa | 384 × 745, căn giữa | Trước: 384 / 384 / 368 |
| 1920 | 384 | 384 | 384 | Trước: 384 / 384 / 368 |

**Mô phỏng N = 1, 2, 3, 5, 7, 8** (nhân bản card thật trong `TeamGrid` của bộ phận Bác sĩ; đo theo từng hàng):

| Viewport | Kết quả |
|---|---|
| 375 | 1 cột, 343 px, mọi N |
| 768 | 1 cột, 348 px, căn giữa (gap 186/186), mọi N |
| 800 | 2 cột × 360 px; hàng cuối lẻ căn giữa (196/196); N = 8 là 4 hàng × 2 |
| 1024 | 3 cột × 299 px; N = 5 → 3 + 2 (2 căn giữa 165/165); N = 7 → 3 + 3 + 1 (331/331); N = 8 → 3 + 3 + 2 |
| 1440 | 3 cột × 384 px; N = 1 căn giữa (416/416); N = 2 (208/208); N = 5, 7, 8 hàng cuối căn giữa |

- Trong mỗi hàng, mọi card cùng chiều rộng và chiều cao.
- **Không card nào tự phóng to.**
- **Không có card VIP:** BS. Lê Thái Sơn cùng nền, viền, bóng và kích thước, ở vị trí 2.
- Phân nhóm nhân sự giữ nguyên 3 bộ phận, kèm nhãn "(Chờ xác nhận cơ cấu)".

**DEV01F-P3-1 (P3, mới):** ở viewport 768–799 px lưới chỉ có 1 cột, trong khi mockup và Blueprint là 2 cột ở tablet.

- Nguyên nhân: `md:w-[calc((100%-1.5rem)/2)]` tính khoảng cách 1.5 rem, nhưng `TeamGrid` dùng `sm:gap-8` (2 rem). Hai card 348 px cộng khoảng cách 32 px rộng 728 px, vượt vùng chứa 720 px nên bị xuống dòng.
- Card vẫn đồng đều và căn giữa nên không chặn Preview.
- Sửa 1 dòng: đổi thành `(100%-2rem)/2`.

## 4. Typography

- Câu trích dẫn `/gioi-thieu` Section 1.2 giờ là `h2` Lora, `font-style: normal`.
- Quét toàn DOM 3 trang: **0 phần tử Lora nghiêng** ở mọi viewport.
- Font tải về giống hệt trước: Be Vietnam Pro 400/500/600/700/400i + Lora (variable 400–900). Không có font mới.
- Các section khác không đổi: diff `AboutPage.tsx` chỉ xóa đúng 1 class.

## 5. Alt text

| Khung | File ảnh (nội dung thật) | Alt hiện tại | Nhãn hiển thị |
|---|---|---|---|
| `/co-so-vat-chat` khung 01 | `article-prevention.webp` (chó lông vàng cuộn trong chăn len) | "Thú cưng nghỉ ngơi trong không gian ấm áp (ảnh minh họa)" | "Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn" |
| `/co-so-vat-chat` khung 02 | `article-nutrition.webp` (bát thức ăn hạt trên sàn gỗ) | "Chăm sóc dinh dưỡng cho thú cưng (ảnh minh họa)" | Như trên |

- Alt mô tả đúng nội dung ảnh, khớp mockup và trang `/gioi-thieu`.
- Không còn alt mô tả ảnh thành phân khu cơ sở; không có thông tin y tế tự suy đoán.
- Gallery vẫn giữ `figure`/`figcaption`; tiêu đề phân khu nằm trong `figcaption`, tách khỏi alt.
- **AP-1 vẫn PARTIAL.** Hai ảnh vẫn UNVERIFIED và không đạt điều kiện phát hành Production.

## 6. Nội dung Preview

- Câu "Bản mockup hiện hiển thị…" **không còn** (đã quét toàn văn: 0 lần "mockup").
- Câu thay thế:
  - Nhãn: "DỮ LIỆU NHÂN SỰ ĐANG CẬP NHẬT".
  - Nội dung: "Sĩ số và danh sách nhân sự thực tế đang chờ Chủ dự án xác nhận. Các thẻ dưới đây hiện là dữ liệu mẫu trung tính để phục vụ hiển thị bố cục."
  - Không tạo claim mới, giữ trạng thái chờ.
- Placeholder và trạng thái PENDING được giữ: `/doi-ngu` có 29 nhãn "Chờ…" và 5 "Dữ liệu mô phỏng"; quét các cụm từ bị cấm cho 0 kết quả.
- **Các nhãn nội bộ còn lại là rào cản trước Production** (đếm trên text render):

| Trang | "Chủ dự án" | "Dữ liệu mô phỏng" / "dữ liệu mẫu" | "Bản thiết kế sơ bộ" | "Bản thảo đề xuất" / "[Đề xuất" | Nhãn "Chờ…" |
|---|---|---|---|---|---|
| `/gioi-thieu` | 2 | 0 | 0 | 1 / 8 | 0 |
| `/doi-ngu` | 4 | 5 / 1 | 1 | 1 / 4 | 29 |
| `/co-so-vat-chat` | 4 | 0 | 1 | 0 | 7 |

Các nhãn này phù hợp cho Preview nội bộ có `noindex` và Deployment Protection. Phải thay bằng dữ liệu thật hoặc ẩn trước khi gỡ `noindex`.

## 7. Header mobile và touch targets

| Viewport | CTA (rộng × cao) | Hamburger | Phụ đề logo | Header | Tràn |
|---|---|---|---|---|---|
| 320 / 360 / 375 / 390 / 414 | "Đặt lịch" 85 × **44** | **44 × 44** | ẩn | 73 px | 0 |
| 420 / 430 | "Đặt lịch khám" 120 × 44 | 44 × 44 | hiện | 73 px | 0 |
| 768 | 130 × 44 | 44 × 44 | hiện | 81 px | 0 |

- Menu mobile: `aria-expanded`/`aria-controls` đúng; dialog mở, Escape đóng và trả focus; chọn `/doi-ngu` chuyển trang và đóng menu.
- **Desktop:** CTA cao 40 → 44 px. Khác biệt nhỏ, nằm gọn trong header; chiều cao header không đổi (`screens/diff-home-1440.jpg`).
- Link nav desktop (38 px) và link logo (93 × 36) vẫn < 44 px. Lỗi này có từ Mốc 2B, ngoài phạm vi mobile. Ghi P3 để theo dõi.

## 8. TypeScript, lint, build (môi trường sạch)

| Lệnh | Kết quả |
|---|---|
| `npm ci` | OK (lockfile không đổi) |
| `npx tsc -b` | exit 0 |
| `npx oxlint` | exit 0; **2 warning** `no-unused-vars` trong `tests/verify-fix01.cjs` (dòng 63–64), không ảnh hưởng `src/` (DEV01F-P3-3) |
| `vite build` | OK: `index-Ctt7gNji.css` 67.96 kB, `index-Djndo7MH.js` 372.12 kB, `AboutPage` 13.65 kB, `TeamPage` 13.95 kB, `FacilitiesPage` 15.54 kB (`build-bbd7846.txt`) |

## 9. Responsive và accessibility (3 trang × 320/375/768/1024/1440/1920)

| Tiêu chí | Kết quả |
|---|---|
| Tràn ngang / chữ cắt / ảnh méo | 0 / 0 / 0. Một kết quả "cắt" là vùng `sr-only` của bộ lọc, đúng thiết kế |
| `h1` / heading | 1 mỗi trang; không nhảy cấp |
| Tap target trong `main` và header mobile | Chỉ còn link logo 93 × 36 (có từ trước) |
| Bộ lọc bàn phím | Tab, Shift+Tab, Enter, Space; `aria-pressed` đúng; bộ phận gỡ khỏi DOM khi lọc |
| `aria-live` | `polite`; đọc "Đang hiển thị: Bộ phận Spa & Grooming (Chờ xác nhận)." |
| Focus | 2 px plum trên link và nút |
| Reduced motion | transition/animation tối đa 0.01 ms |
| Console | 0 error, 0 warning trên 18 tổ hợp |
| Điều hướng / reload | 3 route 200, reload giữ `h1`, title, robots `noindex, nofollow` |
| Visual fidelity | Giữ như DEV-01; sửa đúng 3 điểm lệch đã báo (lưới, chữ nghiêng, alt). Riêng 768–799 px lệch số cột (DEV01F-P3-1) |

## 10. Regression

So sánh với `ab443fe` (Mốc 2B / DEV-00) bằng `regress.json` và pixel diff:

| Route | Kết quả |
|---|---|
| `/` (6 section) | DOM text, title, robots, canonical giống hệt. Pixel diff chỉ nằm trong vùng nút header: 375 px bbox (229, 14)–(356, 60); 1440 px bbox (1169, 18)–(1329, 64). Phần còn lại của trang khác 0 pixel |
| `/dat-lich` | Như trên; form booking demo không đổi |
| `/dich-vu`, `/bang-gia`, `/lien-he`, `/goc-thu-cung`, 404 | Title, robots, canonical và nội dung giống hệt |

## 11. Source integrity

| Kiểm tra | Kết quả |
|---|---|
| File ngoài phạm vi | Không có. `tests/verify-fix01.cjs` là test cục bộ, chấp nhận được |
| Backend / Dashboard / Phase 3B | Không |
| 2B-29 | Không sửa (`WhyChooseUs.tsx:30` vẫn dùng `why-pet-companion.webp`) |
| Merge main / deploy / Git Integration / Production | Không |

## 12. Tồn đọng trước Production

| ID | Mức | Nội dung |
|---|---|---|
| DEV01F-P3-1 | P3 | Lưới 1 cột ở 768–799 px (sửa `(100%-1.5rem)/2` → `(100%-2rem)/2`) |
| DEV01F-P3-2 | P3 | Handoff ghi ở 768 px "card 3 căn giữa ở hàng 2, tâm khớp hàng 1", trong khi thực tế là 1 cột. Handoff DEV-01 cũ vẫn có mô tả sai ảnh `article-firstaid-choking.webp` |
| DEV01F-P3-3 | P3 | 2 warning lint trong `tests/verify-fix01.cjs` |
| DEV01-P3-1 (phần desktop) | P3 | Nav desktop 38 px, link logo 36 px (có từ trước) |
| DEV01-P3-2 | P3 | Dải thông tin `/gioi-thieu` dạng thẻ thay vì cột kẻ chỉ |
| DEV01-P3-5 | P3 | Mô tả menu "Lịch sử & triết lý…", "trang thiết bị chuyên dụng" (có từ trước) |
| Nhãn nội bộ / placeholder | Chặn Production | Mục 6 |
| AP-1 / 2B-06 | Chặn Production | Ảnh UNVERIFIED; cần ảnh thật và giấy phép |
| Footer "phẫu thuật ngoại khoa" | Chờ CEO | Có từ Mốc 2B, trái nguyên tắc 3A |
| Soft 404 | OPEN | Giữ nguyên |
| 2B-08 LCP mobile | OPEN | Đo lại trên Preview (bundle chính 372.12 kB) |
| SEO Production | Chưa kiểm | Kết quả local không thay thế |
| 2B-29 | OPEN | Logo Champion trang chủ |

Đã đóng ở vòng này: DEV01-P2-1, DEV01-P2-2, DEV01-P2-3, DEV01-P2-4, DEV01-P3-1 (mobile), DEV01-P3-4 (hex cứng thay bằng token).

## 13. Khuyến nghị về Vercel Preview

Bốn P2 đã FIXED; không có P0/P1; không có hồi quy nghiêm trọng; build, typecheck và lint tái hiện được; không sửa ngoài phạm vi.

**Claude đề nghị ChatGPT CEO trình chủ dự án xem xét cấp quyền tạo Vercel Preview**, với điều kiện:

1. Preview giữ `noindex` (meta và `X-Robots-Tag`) và Deployment Protection; không gắn domain Production; không đổi Git Integration.
2. Có thể gom DEV01F-P3-1 (1 dòng CSS) và DEV01F-P3-3 vào commit trước Preview; không bắt buộc.
3. Trên Preview, Claude sẽ kiểm: header thực tế, LCP mobile (2B-08), header SEO và SHA triển khai.
4. Không phát hành Production khi còn các mục chặn ở mục 12.

Claude không tự phê duyệt deployment, không sửa code, không merge.

---

**PHASE 3A DEV-01 — PENDING OWNER PREVIEW APPROVAL**
