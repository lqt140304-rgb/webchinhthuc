# ARCHITECTURE SPIKE 01 — HARDENING 02 FIX 01 CLEANUP (DIRECTIVE 060-A): BÁO CÁO BÀN GIAO CHÍNH THỨC (HANDOFF REPORT)

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chỉ thị điều phối:** CEO DIRECTIVE 060-A  
**Agent thực hiện:** Antigravity — Implementation  
**Agent kiểm định độc lập:** Claude — Independent Architecture QA Lead  
**Worktree:** `D:\webbvct-cleanup-060`  
**Nhánh Git:** `spike/architecture-01-h02-fix01-cleanup`  
**Base Commit (Fix 01):** `535f803808dcfb27f06b3303a5e32070c88a5aa6`  
**Commit SHA Bàn giao:** `b5858f3720202377a3273dea9fcb7fbb01dfcf7e`  
**Quyền hạn:** LOCAL EXPERIMENTAL BRANCH ONLY — **DEPLOYMENT STRICTLY PROHIBITED**  

---

## I. TỔNG QUAN BÀN GIAO CLEANUP

Thực hiện nghiêm túc chỉ thị **CEO DIRECTIVE 060-A**, Antigravity đã hoàn thành chính xác và giới hạn phạm vi hai nhiệm vụ cleanup P2 được Claude chỉ ra trong báo cáo QA Fix 01:

1. **Khôi phục hoàn toàn 14 ảnh bằng chứng QA Mốc 2B (`3B-H2F-P2-1`):**
   - Đã khôi phục nguyên trạng 14 tệp ảnh `.png` trong `docs/qa/2b-verification-evidence/` từ commit baseline 3A `4739d45cc95100b587381b6bdcad6935352b23e8`.
   - Kết quả đối chiếu hash: 14/14 tệp khớp 100% cả SHA-256 hash và Git blob SHA với bản gốc đã nghiệm thu.
   - Sửa đổi đường dẫn `EVIDENCE_DIR` trong `tests/e2e/2b-verification.cjs` chuyển hướng sang `e2e-evidence/2b-run` (thư mục được bảo vệ bởi `.gitignore`), triệt tiêu hoàn toàn nguy cơ ghi đè trong tương lai.
2. **Quy trình cài đặt Playwright trong môi trường sạch (`3B-H2F-P2-2`):**
   - Bổ sung lệnh tiện ích `"test:install-browsers": "playwright install chromium"` trong `package.json`.
   - Cung cấp tài liệu hướng dẫn thiết lập 4 bước chuẩn hóa trong `playwright-setup.md` cho các môi trường chạy sau `npm ci`.
   - Xác nhận bộ kiểm thử chạy mượt mà, không phụ thuộc cài đặt global, không hardcode đường dẫn máy cá nhân.

---

## II. ĐỐI CHIẾU CÁC GATE CHỈ THỊ 060-A

| Gate | Tiêu chuẩn đánh giá | Kết luận Antigravity | Bằng chứng kiểm chứng |
| --- | --- | --- | --- |
| **Gate C01 — Evidence Integrity** | 14 ảnh khôi phục chính xác; script không ghi đè evidence cũ; không mất dữ liệu QA | **PASS** | 14/14 file ảnh khớp 100% hash với baseline `4739d45`; `EVIDENCE_DIR` đã cách ly |
| **Gate C02 — Test Portability** | Setup được tài liệu hóa; Chromium được cài qua Playwright của repo; browser tests chạy thực tế | **PASS** | Script `test:install-browsers` hoạt động; `test:hydration` và `test:seo-consistency` đạt 100% |
| **Gate C03 — Scope & Regression** | Không có thay đổi runtime ngoài phạm vi; build/typecheck/lint đạt 0 lỗi; source integrity bảo toàn | **PASS** | `tsc -b` (0 errors), `oxlint` (0 errors/warnings), 20/20 routes PASS |
| **Gate C04 — Preview Readiness** | Chỉ ghi nhận "READY FOR CLAUDE QA"; không tự tuyên bố đã nghiệm thu Preview | **READY FOR CLAUDE QA** | Bảo lưu toàn bộ quyền quyết định deployment cho Chủ dự án |

---

## III. DANH SÁCH FILE THAY ĐỔI

### 1. Khôi phục bằng chứng QA 2B (14 file ảnh):
- `docs/qa/2b-verification-evidence/booking-1366px.png`
- `docs/qa/2b-verification-evidence/booking-1440px.png`
- `docs/qa/2b-verification-evidence/booking-1920px.png`
- `docs/qa/2b-verification-evidence/booking-320px.png`
- `docs/qa/2b-verification-evidence/booking-360px.png`
- `docs/qa/2b-verification-evidence/booking-390px.png`
- `docs/qa/2b-verification-evidence/booking-768px.png`
- `docs/qa/2b-verification-evidence/home-1366px.png`
- `docs/qa/2b-verification-evidence/home-1440px.png`
- `docs/qa/2b-verification-evidence/home-1920px.png`
- `docs/qa/2b-verification-evidence/home-320px.png`
- `docs/qa/2b-verification-evidence/home-360px.png`
- `docs/qa/2b-verification-evidence/home-390px.png`
- `docs/qa/2b-verification-evidence/home-768px.png`

### 2. Mã nguồn & Cấu hình:
- `tests/e2e/2b-verification.cjs`: Đổi `EVIDENCE_DIR` sang `e2e-evidence/2b-run`.
- `package.json`: Thêm script `"test:install-browsers": "playwright install chromium"`.

### 3. Tài liệu báo cáo cleanup (`docs/spikes/architecture-01/hardening-02-fix01-cleanup/`):
- `cleanup-summary.md`
- `evidence-restoration.md`
- `playwright-setup.md`
- `test-results.md`
- `handoff.md`

---

## IV. BẢNG TRẠNG THÁI CÁC MỤC TỒN ĐỌNG (P0/P1/P2/P3 & NOT VERIFIED)

- **P0 / P1:** **KHÔNG CÒN (ZERO)**.
- **P2:**
  - `3B-H2F-P2-1` (Ảnh QA 2B bị ghi đè): **ĐÃ ĐÓNG (CLOSED)**.
  - `3B-H2F-P2-2` (Cài đặt Playwright trong môi trường sạch): **ĐÃ ĐÓNG (CLOSED)**.
- **Hạng mục NOT VERIFIED (Giới hạn hạ tầng):**
  - Trạng thái triển khai trên hạ tầng Vercel thật: **NOT VERIFIED** (API Vercel trả HTTP 403; chưa triển khai Preview thật).
  - Thứ tự ưu tiên cấu hình Vercel Dashboard vs `vercel.json`: **NOT VERIFIED** (cần xác nhận qua bản Preview đầu tiên nếu được Chủ dự án duyệt).
- **P3 Backlog (Bảo toàn, không can thiệp trong Cleanup 060):**
  - `3B-H2F-P3-1` (Soft-404 trên URL `/404`).
  - `3B-H2F-P3-2` (`X-Robots-Tag: noindex` cố định trong `vercel.json`).
  - `3B-H2F-P3-3` (E2E nhánh Production).
  - `3B-H2F-P3-4` (`preview-server.cjs` rộng hơn `vercel.json`).
  - `3B-H2F-P3-5` (Content Audit Register thiếu claim y khoa).
  - `3B-H2F-P3-6` (Bundle JS tăng 25%, domain placeholder trong sitemap).

---

## V. HƯỚNG DẪN CLAUDE QA KIỂM TRA ĐỘC LẬP TRÊN MÔI TRƯỜNG SẠCH

Claude có thể thực hiện kiểm tra độc lập tại nhánh `spike/architecture-01-h02-fix01-cleanup`:

```bash
# 1. Cài đặt dependencies sạch và tải Chromium binary
npm ci
npm run test:install-browsers

# 2. Kiểm tra chất lượng mã nguồn
npm run typecheck
npm run lint

# 3. Biên dịch và kiểm tra prerender
npm run build

# 4. Chạy kiểm thử định tuyến, hydration và SEO nhất quán
npm run test:routing
npm run test:hydration
npm run test:seo-consistency

# 5. Xác minh 14 ảnh bằng chứng 2B khớp 100% với baseline 3A
git diff 4739d45cc95100b587381b6bdcad6935352b23e8 docs/qa/2b-verification-evidence/
# (Kỳ vọng: Lệnh không trả về bất kỳ dòng khác biệt nào)
```

---

## VI. TUYÊN BỐ KỶ LUẬT & TÍN HIỆU ĐÓNG PHIÊN

- Antigravity khẳng định: **KHÔNG THỰC HIỆN BẤT KỲ LỆNH DEPLOYMENT NÀO**.
- Không merge vào `main`, không sửa baseline 3A, không can thiệp tài liệu 3B-00.
- Nhánh `spike/architecture-01-h02-fix01-cleanup` đã sẵn sàng để Claude QA thực hiện kiểm định độc lập.

**ARCHITECTURE SPIKE 01 — CLEANUP 060 READY FOR CLAUDE QA**
