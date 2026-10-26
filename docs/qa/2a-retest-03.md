# Retest 03 mốc 2A: kiểm tra độc lập của Claude

| Mục | Giá trị |
|---|---|
| Người kiểm tra | Claude (Independent QA reviewer, theo `AGENTS.md`) |
| Ngày chạy | 26/10/2026 |
| **SHA mã được kiểm tra** | `cd0e68e`, nhánh `fix/milestone-2a-qa` |
| Đầu nhánh khi nhận bàn giao | `2dc6368`. Đã xác nhận `cd0e68e..2dc6368` chỉ sửa `docs/qa/2a-fix-handoff-03.md` |
| SHA mã lần trước | `4b269d97f6f94515e2af95f421cdfc1dfe690859` ([retest-02](https://github.com/lqt140304-rgb/webchinhthuc/blob/claude/2a-retest-02/docs/qa/2a-retest-02.md)) |
| Nhánh báo cáo | `claude/2a-retest-03`, tạo từ `claude/2a-retest-02` (`0988eb2`, vốn tạo từ `main` `cd889c8`) để giữ nguyên bộ test. Không chứa mã ứng dụng. SHA của commit báo cáo tách khỏi SHA mã |
| Căn cứ | "Quyết định và thứ tự làm việc" ngày 26/10/2026 (A01–A03, D01), `2a-fix-handoff-03.md`, [quy trình E2E](2a-e2e-protocol.md), MASTER PROMPT, Architecture Baseline V1 (nhánh `docs/architecture-baseline-v1`) |

## 1. Kết luận

**A01, A02 và A03 đạt. Bước 1 đủ điều kiện đóng, kèm hai việc nhỏ cần làm.**

- Chạy **100 test: 97 đạt, 1 trượt (P3), 2 BLOCKED**. Không có lỗi console. Chạy lặp lại cho kết quả y hệt.
- Bộ chuẩn và bộ round 02 (78 test) cho **76 đạt, 0 trượt, 2 BLOCKED**, khớp số Antigravity báo. Hai lỗi P3 của retest-02 đã đóng.
- Thêm bộ round 03 (22 test) để kiểm A01–A03 kỹ hơn: query UTM/fbclid, dấu `/` ở cuối, `?cat=news` đi kèm UTM, độ nét logo. Kết quả 21 đạt, 1 trượt.
- **Còn mở:**
  - **R3-1 (P3):** ảnh logo gốc 377 KB vẫn được triển khai công khai.
  - **R3-2 (P2, quy trình):** commit `cd0e68e` ghi đè bằng chứng retest-02 của Claude.
  - **R3-3 (P2, tài liệu):** D01 ghi kết quả của Antigravity như thể là kết quả của Claude.
- **A04 và A05 vẫn BLOCKED**, không thay đổi so với retest-02.

Chỉ chủ dự án có quyền nghiệm thu. 2B vẫn chờ review riêng ở Bước 2.

## 2. Môi trường và lệnh

| Mục | Giá trị |
|---|---|
| Hệ điều hành / Node / npm | Linux 6.18.44 (container) / v22.22.0 / 10.9.4. Antigravity dùng Node 24 |
| Trình duyệt | Google Chrome for Testing 153.0.8010.12, qua `playwright` 1.63.0 có sẵn trong môi trường |
| Bản sao | `git archive cd0e68e`. Lockfile trùng byte. `package.json` và lockfile không đổi so với `c2e5361` |
| Server | `vite preview` cổng 4173 (`cd0e68e`) và 4174 (`4b269d9`, chỉ dùng để chứng minh test bắt được lỗi) |

| Lệnh | Exit | Kết quả |
|---|---|---|
| `npm ci` / `npx oxlint` / `npx tsc -b` | 0 / 0 / 0 | [lint](2a-retest-03-evidence/lint-cd0e68e.txt), [tsc](2a-retest-03-evidence/tsc-cd0e68e.txt) |
| `npm run build` | 0 | CSS 54.68 kB, JS 348.93 kB. [build](2a-retest-03-evidence/build-cd0e68e.txt) |
| `node --test tests/e2e/2a.e2e.test.cjs tests/e2e/2a-round02.e2e.test.cjs tests/e2e/2a-round03.e2e.test.cjs` (có `APP_DIR`) | 1 | **100 test: 97 đạt, 1 trượt, 2 skip (BLOCKED)**. [log](2a-retest-03-evidence/e2e-claude-cd0e68e.txt), [TAP](2a-retest-03-evidence/e2e-claude-cd0e68e.tap) |
| Chạy lặp lại | 1 | Y hệt 97 / 1 / 2. [log](2a-retest-03-evidence/e2e-claude-cd0e68e-repeat.txt) |
| `2a-round03.e2e.test.cjs` trên `4b269d9` | 1 | 22 test: 4 đạt, **18 trượt**. Chứng minh test bắt đúng các lỗi đã sửa. [log](2a-retest-03-evidence/e2e-round03-on-4b269d9.txt) |

**Bộ test:**
- `2a.e2e.test.cjs` và `2a-round02.e2e.test.cjs` giữ nguyên bản `0988eb2`. Đã đối chiếu: bản trong `cd0e68e` trùng hoàn toàn, Antigravity không sửa assertion nào.
- Thêm `tests/e2e/2a-round03.e2e.test.cjs`, gồm 22 test:

  | Nhóm | Số test |
  |---|---|
  | A02, desktop | 7 |
  | A02, Drawer | 7 |
  | Trang chủ có query | 1 |
  | Trang 404 có dấu `/` hoặc query | 1 |
  | A01 | 3 |
  | A03 | 2 |
  | Lỗi console | 1 |

## 3. Đối chiếu từng mã việc

| ID | Retest-02 | Retest-03 | Kỳ vọng / Thực tế | Bằng chứng |
|---|---|---|---|---|
| A01 (R2-1) | FAIL (P3) | **PASS** | Ở `/cau-chuyen`, `/cau-chuyen/abc` và `/cau-chuyen/abc/`: cả desktop lẫn Drawer đều chỉ có `/cau-chuyen` mang `aria-current`. Các URL 404 có tiền tố giống (`/cau-chuyenxyz`) vẫn không tô mục nào | measurements id `A01` |
| A02 (R2-2) | FAIL (P3) | **PASS** | 7 URL × 2 vùng (desktop, Drawer) đều đúng mục, nhóm được tô: `/dich-vu/spa?utm_source=facebook`, `/dich-vu/spa/`, `/dich-vu/spa/?fbclid=abc`, `/dich-vu?utm_medium=cpc`, `/goc-thu-cung?cat=news&utm_source=zalo` (mục Tin tức), `/goc-thu-cung?utm_source=zalo`, `/goc-thu-cung/`. Trang chủ có query: chỉ "Trang chủ". Trang 404 có dấu `/` hoặc query: không tô mục nào | measurements id `A02-*` |
| A03 (R2-3) | FAIL (P3) | **PASS** | `logo.png` 27,288 byte, ảnh gốc 200 px cho cỡ hiển thị 44–48 px (đủ nét ở màn hình 4×). Favicon riêng `/favicon.png` 48×48, 3,770 byte, `image/png`. Còn R3-1 | measurements id `A03` |
| D01 | | **PASS có lỗi** | `implementation-plan.md` đã phân biệt triển khai, kiểm thử, chờ duyệt và BLOCKED, bỏ tuyên bố "100%". Còn R3-3 | |
| Hồi quy 2A (P1-1 đến P1-8, P2, quyết định 1–3, R1-1) | PASS | **PASS** | Toàn bộ 76 test của bộ chuẩn và round 02 đạt | e2e log |
| A04 Vercel thật | BLOCKED | **BLOCKED** | Chưa có URL preview được phép | |
| A05 noindex HTML gốc | BLOCKED | **BLOCKED** | HTML gốc của trang chờ vẫn không có thẻ robots. Phương án `X-Robots-Tag` trong retest-02 mục 4.3 đang chờ duyệt | |

## 4. Phát hiện còn mở

### R3-1 (P3): ảnh logo gốc được triển khai công khai

- **Vị trí:** `public/images/logo-original.png` (376,788 byte). Vite chép nguyên vào `dist/images/`, nên ảnh này sẽ lên Vercel. Không mã nào tham chiếu tới nó.
- **Ảnh hưởng:** tăng dung lượng triển khai và để lộ một tệp nguồn không dùng tới. Không ảnh hưởng tốc độ tải trang.
- **Sửa:** chuyển tệp ra ngoài `public/`, ví dụ `design/source/logo-original.png`. Test `ảnh logo gốc không được tham chiếu và không nằm trong dist/` sẽ chuyển sang đạt.

### R3-2 (P2, quy trình): bằng chứng retest-02 của Claude bị ghi đè trên nhánh của Antigravity

- **Vị trí:** commit `cd0e68e` sửa 10 tệp và thêm 16 tệp trong `docs/qa/2a-retest-02-evidence/`:
  - `measurements.json` và `measurements-round02.json` bị thay bằng số liệu chạy trên mã mới. Ví dụ `logoBytes` đổi 376,788 → 27,288 và `/cau-chuyen/abc` đổi `[]` → `["/cau-chuyen"]`.
  - 8 ảnh bị chụp lại.
  - Thêm 15 ảnh và tệp `e2e-anti-verify.txt`.
- **Ảnh hưởng:** báo cáo retest-02 mô tả SHA `4b269d9`, nhưng bằng chứng đi kèm trên nhánh `fix/milestone-2a-qa` lại thuộc SHA `cd0e68e`. Nếu merge nhánh này, hồ sơ QA sẽ tự mâu thuẫn. Việc này trái `2a-e2e-protocol.md` mục 1 ("không ghi đè báo cáo gốc hoặc kết quả của agent khác"). Bản gốc vẫn còn nguyên trên `claude/2a-retest-02` (`0988eb2`).
- **Sửa:** khôi phục `docs/qa/2a-retest-02-evidence/` về đúng bản `0988eb2` và xóa các tệp đã thêm. Kết quả chạy của Antigravity chuyển sang `docs/qa/2a-fix-03-evidence/`. Khi chạy test, đặt `EVIDENCE_DIR` vào thư mục của chính mình.

### R3-3 (P2, tài liệu): D01 ghi sai nguồn kết quả

- **Vị trí:** `docs/implementation-plan.md`, mục Mốc 2A. Tài liệu viết "Cập nhật 26/10/2026 (Theo Báo cáo Retest-02 của Claude …): 76/78 test PASS … bộ mở rộng 25/25 pass sau khi sửa A01–A03".
- **Thực tế:**
  - Retest-02 của Claude (trên `4b269d9`) kết luận 74 đạt, 2 lỗi P3.
  - Con số 76/78 là Antigravity tự chạy trên `cd0e68e`.
  - Claude xác nhận 76/78 ở retest-03 này, kèm bộ round 03.
- **Sửa:**
  - Ghi đúng nguồn: "Antigravity tự kiểm 76/78 trên `cd0e68e`; Claude retest-03 xác nhận 97/100, 1 P3, 2 BLOCKED".
  - Nên giữ lại danh sách các hạng mục 2A đã triển khai, đã bị xóa trong lần cập nhật này, để phân biệt "đã triển khai" và "đã kiểm thử" đúng yêu cầu D01.

### Ghi chú không chặn

- **`isLinkActive` xử lý `?cat=news` bằng nhánh viết cứng cho tuyến `/goc-thu-cung`** (`src/utils/navigation.ts`). Cách này chạy đúng, nhưng khi thêm danh mục mới (ví dụ `?cat=dinh-duong`) phải nhớ sửa hàm. Có thể tính "link gốc không active khi một link anh em có query khớp" dựa trên danh sách mục trong nhóm.
- **Architecture Baseline V1 chưa vào `main`.** Nó chỉ nằm ở nhánh `docs/architecture-baseline-v1` (`d2a19c5`), trong khi `AGENTS.md` quy định bản chuẩn là bản trên `main`. Theo baseline, `robots.txt` nên bổ sung `Disallow: /quan-ly/` khi triển khai Staff Portal ở giai đoạn 4. Việc này không chặn 2A.

## 5. Việc tiếp theo

1. **Antigravity:** sửa R3-1, R3-2, R3-3. Đây là việc nhỏ, không đổi giao diện, và bàn giao SHA mới. Claude kiểm lại bằng cùng bộ 100 test, cộng việc đối chiếu `docs/qa/2a-retest-02-evidence/` với `0988eb2`.
2. **Chủ dự án hoặc ChatGPT:**
   - Duyệt đưa Architecture Baseline V1 vào `main`.
   - Duyệt phương án A05.
   - Cấp URL preview Vercel cho A04.
3. **Bước 2:** Antigravity xử lý B01 và B02; Claude QA 2B theo MASTER PROMPT ở 1920, 1440, 1366, 768, 390, 360 và 320px, có Lighthouse (đã cài trong môi trường kiểm tra, không thêm vào repo).

## 6. Chưa kiểm chứng

- Vercel thật (A04), noindex HTML gốc (A05).
- Thiết bị thật, trình đọc màn hình thật.
- QA chi tiết 6 section 2B (Bước 2).
- Hiển thị favicon trên các trình duyệt hoặc hệ điều hành khác Chromium. Mới kiểm dung lượng, kiểu tệp và kích thước 48×48; chưa có bộ favicon cho Apple (`apple-touch-icon`).
