# ARCHITECTURE SPIKE 01 — HARDENING 02 FIX 01 CLEANUP (DIRECTIVE 060-A): BÁO CÁO KẾT QUẢ KIỂM THỬ HỒI QUY & BẢO TOÀN DỮ LIỆU (TEST RESULTS)

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chỉ thị:** CEO DIRECTIVE 060-A (Mục VI)  
**Agent:** Antigravity — Implementation  
**Worktree:** `D:\webbvct-cleanup-060`  
**Nhánh:** `spike/architecture-01-h02-fix01-cleanup`  

---

## I. MA TRẬN KẾT QUẢ KIỂM THỬ TỰ ĐỘNG

| Hạng mục kiểm thử | Lệnh thực thi | Phạm vi kiểm tra | Kết quả thực tế | Trạng thái |
| --- | --- | --- | --- | --- |
| **Typecheck** | `npm run typecheck` | 88 file TypeScript | Found 0 errors | **PASS** |
| **Linter** | `npm run lint` | 88 file, 115 rules | 0 warnings, 0 errors | **PASS** |
| **Biên dịch & Prerender** | `npm run build` | 19 routes tĩnh + fallback + 404 | Hoàn thành trong 2.16s | **PASS** |
| **Định tuyến HTTP** | `npm run test:routing` | 20 kịch bản URL (200/404) | 20/20 kịch bản đạt chuẩn | **PASS** |
| **Hydration & 404** | `npm run test:hydration` | 8 route phức tạp (Playwright) | 8/8 CLEAN (0 errors, 0 #418) | **PASS** |
| **Nhất quán SEO** | `npm run test:seo-consistency` | Local & Prod (Direct + Refresh) | Đúng 1 thẻ robots, 0 xung đột | **PASS** |
| **Cài đặt Browser** | `npm run test:install-browsers` | Tải Chromium binary | Hoàn tất trong 1.2s | **PASS** |
| **Khôi phục ảnh 2B** | Node.js hash verify | 14 ảnh bằng chứng QA 2B | 14/14 khớp 100% baseline 3A | **PASS** |

---

## II. BẰNG CHỨNG BẢO TOÀN DỮ LIỆU QA SAU KHI CHẠY KIỂM THỬ

Nhằm chứng minh rằng việc sửa đổi `EVIDENCE_DIR` trong `tests/e2e/2b-verification.cjs` đã thực sự bảo vệ các tệp ảnh QA, Antigravity đã chạy kịch bản kiểm tra trước và sau:

### 1. Hash của 14 ảnh bằng chứng QA 2B trên đĩa hiện tại:
```text
| File | Disk SHA-256 | Baseline 3A SHA-256 | Match? |
|---|---|---|---|
| booking-1366px.png | ae991cb1f8f0b930... | ae991cb1f8f0b930... | MATCH |
| booking-1440px.png | 4aca9ac4562b72b6... | 4aca9ac4562b72b6... | MATCH |
| booking-1920px.png | 5a3bd7aac07669d3... | 5a3bd7aac07669d3... | MATCH |
| booking-320px.png | cd54a33d5161f65b... | cd54a33d5161f65b... | MATCH |
| booking-360px.png | 51fbc991d7a93c68... | 51fbc991d7a93c68... | MATCH |
| booking-390px.png | 38c39c7980f332d6... | 38c39c7980f332d6... | MATCH |
| booking-768px.png | 1684ab1623ec8917... | 1684ab1623ec8917... | MATCH |
| home-1366px.png | a3aa16157bfb1a40... | a3aa16157bfb1a40... | MATCH |
| home-1440px.png | c65de3e0cc2a8084... | c65de3e0cc2a8084... | MATCH |
| home-1920px.png | c1b6af4d721e6fa9... | c1b6af4d721e6fa9... | MATCH |
| home-320px.png | 6d582de9fe1b5c22... | 6d582de9fe1b5c22... | MATCH |
| home-360px.png | b381796a3ee00b7a... | b381796a3ee00b7a... | MATCH |
| home-390px.png | 997787654cf60f75... | 997787654cf60f75... | MATCH |
| home-768px.png | 2060813e7ed006b9... | 2060813e7ed006b9... | MATCH |
```

### 2. Xác minh thư mục đích mới:
- Khi chạy script kiểm thử, toàn bộ ảnh mới được lưu trữ tại `e2e-evidence/2b-run/` (thư mục được bảo vệ bởi `.gitignore`).
- Thư mục `docs/qa/2b-verification-evidence/` được giữ nguyên vẹn 100%, không bị sửa đổi hay ghi đè.

---

## III. DUY TRÌ DANH MỤC P3 BACKLOG (SCOPE CONTROL)

Tuân thủ nghiêm ngặt chỉ thị Mục VII của CEO Directive 060-A, Antigravity **không mở rộng phạm vi** sang bất kỳ mục P3 nào trong đợt cleanup này:
- Vấn đề soft-404 đối với URL `/404`: Giữ nguyên backlog.
- Vấn đề header `X-Robots-Tag` trên Vercel: Giữ nguyên backlog (được xử lý khi có tên miền chính thức).
- Vấn đề domain placeholder `bvthuyleson.vn` trong sitemap/robots: Giữ nguyên backlog.
- Tăng dung lượng bundle JS (+25%): Giữ nguyên backlog.
- Các cảnh báo future flag và `envFile`: Giữ nguyên backlog.

---

## IV. KẾT LUẬN
- **Gate C03 (Scope & Regression):** **ĐẠT (PASS)**.
- Hệ thống không có bất kỳ thay đổi runtime ngoài dự kiến nào.
- Toàn bộ bằng chứng QA và tính khả chuyển kiểm thử đã đạt tiêu chuẩn bàn giao cao nhất.
