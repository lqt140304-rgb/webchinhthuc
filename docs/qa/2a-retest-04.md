# Retest 04 mốc 2A: kiểm tra độc lập của Claude

| Mục | Giá trị |
|---|---|
| Người kiểm tra | Claude (Independent QA reviewer, theo `AGENTS.md`) |
| Ngày chạy | 26/10/2026 |
| **SHA mã được kiểm tra** | `39a5835e411be69bdc01f89a72341d85f9f6e73b`, nhánh `fix/milestone-2a-qa` |
| Đầu nhánh khi nhận bàn giao | `2d9b12fa8ee80313bdabf0de11666a0a46c31f1a`. Đã xác nhận `39a5835..2d9b12f` chỉ thêm 1 dòng trong `docs/qa/2a-fix-handoff-03.md` |
| SHA mã lần trước | `cd0e68e` ([retest-03](https://github.com/lqt140304-rgb/webchinhthuc/blob/claude/2a-retest-03/docs/qa/2a-retest-03.md)) |
| Nhánh báo cáo | `claude/2a-retest-04`, tạo từ `claude/2a-retest-03` (`fb257d0`). Không chứa mã ứng dụng. SHA của commit báo cáo tách khỏi SHA mã |
| Phạm vi | Kiểm R3-1, R3-2, R3-3 của retest-03 và hồi quy toàn bộ 2A |

## 1. Kết luận

**Bước 1 của mốc 2A đạt: không còn lỗi P1, P2 hay P3 nào mở.** Chỉ còn hai mục BLOCKED cần điều kiện bên ngoài: A04 (kiểm trên Vercel thật) và A05 (noindex từ HTML gốc).

- Chạy **100 test: 98 đạt, 0 trượt, 2 skip (BLOCKED)**, 0 lỗi console. Chạy lặp lại cho kết quả y hệt.
- R3-1, R3-2 và R3-3 đều đã đóng (mục 3).
- Mã ứng dụng không đổi so với `cd0e68e`. Thay đổi duy nhất ngoài tài liệu là chuyển `logo-original.png` ra khỏi `public/`. Tệp JS và CSS sau build có cùng hash (`index-DN8Y49p2.js`, `index-CMYfpOoH.css`).

Theo "Quyết định và thứ tự làm việc" ngày 26/10/2026, 2A đủ điều kiện **đề xuất nghiệm thu có điều kiện**, kèm hai mục BLOCKED còn mở. Chỉ chủ dự án có quyền nghiệm thu. Bước tiếp theo là 2B (B01, B02, B04).

## 2. Môi trường và lệnh

| Mục | Giá trị |
|---|---|
| Hệ điều hành / Node / npm | Linux 6.18.44 (container) / v22.22.0 / 10.9.4 |
| Trình duyệt | Google Chrome for Testing 153.0.8010.12, qua `playwright` 1.63.0 có sẵn trong môi trường |
| Bản sao | `git archive 39a5835`. Lockfile trùng byte. `package.json` và lockfile không đổi so với `c2e5361` |
| Server | `vite preview` cổng 4173 |

| Lệnh | Exit | Kết quả |
|---|---|---|
| `npm ci` / `npx oxlint` / `npx tsc -b` | 0 / 0 / 0 | [lint](2a-retest-04-evidence/lint-39a5835.txt), [tsc](2a-retest-04-evidence/tsc-39a5835.txt) |
| `npm run build` | 0 | CSS 54.68 kB, JS 348.93 kB, giống hệt `cd0e68e`. `dist/images/` chỉ còn `logo.png`. [build](2a-retest-04-evidence/build-39a5835.txt) |
| `node --test tests/e2e/2a.e2e.test.cjs tests/e2e/2a-round02.e2e.test.cjs tests/e2e/2a-round03.e2e.test.cjs` (có `APP_DIR`) | **0** | **100 test: 98 đạt, 0 trượt, 2 skip**. [log](2a-retest-04-evidence/e2e-claude-39a5835.txt), [TAP](2a-retest-04-evidence/e2e-claude-39a5835.tap), [số đo](2a-retest-04-evidence/measurements.json) |
| Chạy lặp lại | **0** | 98 / 0 / 2. [log](2a-retest-04-evidence/e2e-claude-39a5835-repeat.txt) |
| Đối chiếu git các tệp của Claude và vị trí logo | | [git-verification.txt](2a-retest-04-evidence/git-verification.txt) |

Bộ test không đổi so với retest-03. Bản trong `39a5835` trùng hoàn toàn với `fb257d0`.

## 3. Đối chiếu từng mã việc

| ID | Retest-03 | Retest-04 | Kỳ vọng / Thực tế |
|---|---|---|---|
| R3-1 logo gốc trong `dist/` | FAIL (P3) | **PASS** | `logo-original.png` (376,788 byte) đã chuyển sang `design/source/`. `dist/` không còn tệp này, mã không tham chiếu tới nó. Test `ảnh logo gốc không được tham chiếu và không nằm trong dist/` đạt |
| R3-2 ghi đè bằng chứng retest-02 | FAIL (P2) | **PASS** | `git diff 0988eb2 39a5835 -- docs/qa/2a-retest-02.md docs/qa/2a-retest-02-evidence` rỗng: khôi phục đúng bản gốc, không còn tệp thừa. Kết quả của Antigravity đã chuyển sang `docs/qa/2a-fix-03-evidence/` (28 tệp). Các tệp retest-03 của Claude chép vào nhánh này cũng trùng khớp `fb257d0` |
| R3-3 ghi sai nguồn kết quả | FAIL (P2) | **PASS** | `implementation-plan.md` đã tách "Antigravity tự kiểm 76/78 trên `cd0e68e`" khỏi "Claude retest-03 xác nhận", đồng thời khôi phục danh sách hạng mục đã triển khai. Còn hai lỗi ghi chép nhỏ, xem mục 4 |
| A01, A02, A03 | PASS | **PASS** | Hồi quy đạt: 22 test round 03 |
| 2A: P1-1 đến P1-8, P2, quyết định 1–3, R1-1 | PASS | **PASS** | Hồi quy đạt: 76 test của bộ chuẩn và round 02 |
| A04 Vercel thật | BLOCKED | **BLOCKED** | Chưa có URL preview được phép |
| A05 noindex HTML gốc | BLOCKED | **BLOCKED** | HTML gốc của trang chờ vẫn không có thẻ robots. Phương án `X-Robots-Tag` (retest-02 mục 4.3) đang chờ duyệt |

## 4. Góp ý tùy chọn, không chặn

Hai lỗi ghi chép nhỏ trong `docs/implementation-plan.md` (dòng 34–40), nên sửa khi tài liệu được cập nhật lần sau:

- Dòng "Bộ mở rộng round 03 (100 tests)" ghi sai. Round 03 có 22 test; 100 là tổng của cả ba bộ.
- Tài liệu ghi R3-1 và R3-2 là "đã đóng" ngay trong commit sửa, trước khi Claude kiểm. Retest-04 này xác nhận cả hai đã đóng thật, nên về nội dung là đúng. Lần sau, nên ghi "chờ Claude kiểm" cho tới khi có báo cáo retest.

## 5. Việc tiếp theo

1. **ChatGPT hoặc chủ dự án:** quyết định nghiệm thu có điều kiện cho 2A, với A04 và A05 vẫn mở. Duyệt đưa Architecture Baseline V1 (nhánh `docs/architecture-baseline-v1`) vào `main`. Duyệt phương án A05. Cấp URL preview Vercel cho A04.
2. **Bước 2:** Antigravity xử lý B01 (form đầy đủ chuyển về `/dat-lich`) và B02. Claude QA 2B (B04) theo MASTER PROMPT ở 1920, 1440, 1366, 768, 390, 360 và 320px, có Lighthouse.

## 6. Chưa kiểm chứng

- Vercel thật (A04), noindex HTML gốc (A05).
- Thiết bị thật, trình đọc màn hình thật.
- QA chi tiết 6 section 2B (Bước 2).
