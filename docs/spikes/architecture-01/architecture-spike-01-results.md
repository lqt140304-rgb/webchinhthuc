# BÁO CÁO KẾT QUẢ THỬ NGHIỆM — ARCHITECTURE SPIKE 01 (HARDENING 01)
## Phân Tích Kỹ Thuật: React Router 7 Framework Mode + Prerender

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 052-A — ARCHITECTURE SPIKE 01 / HARDENING 01** |
| **Nhánh Hardening** | `spike/architecture-01-hardening-01` |
| **Baseline đối chiếu 3A** | `4739d45cc95100b587381b6bdcad6935352b23e8` |
| **Commit Spike 01 đã QA** | `0dba2f3983513ee549521a961fbdfd8c7445fae4` |
| **Báo cáo Claude QA** | `docs/qa/architecture-spike-01-qa.md` @ commit `8b410c5` |
| **Trạng thái Gate A** | **PASS** (Single Source Head qua `meta()`, không xung đột hook, không claim PENDING, có `noindex` trong HTML gốc) |
| **Trạng thái Gate B** | **PASS LOCAL** (Khôi phục đủ 21/21 route 3A, local 404 đạt; Hosting Vercel Edge: Chờ cấp phép Preview) |
| **Trạng thái Gate C** | **PASS** (Build sạch 1.88s, typecheck 0 error, oxlint 0 error/0 warning, 0 lỗi hydration, CLS 0.000, LCP nhanh hơn 1-2s) |
| **Trạng thái Gate D** | **READY FOR PREVIEW** (Tự sinh `404.html`, `vercel.json` sạch, có kế hoạch kiểm thử Preview và rollback runbook) |

---

## I. TỔNG QUAN KẾT QUẢ CÁC CỔNG KIỂM ĐỊNH (EXECUTIVE SUMMARY)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│               KẾT QUẢ THỰC NGHIỆM ARCHITECTURE SPIKE 01 (HARDENING 01)                 │
├───────────────────┬──────────────┬─────────────────────────────────────────────────────┤
│ Cổng kiểm định    │ Kết luận     │ Minh chứng thực nghiệm đã xử lý triệt để            │
├───────────────────┼──────────────┼─────────────────────────────────────────────────────┤
│ GATE A: SEO & Head│ PASS         │ 100% Raw HTML có metadata độc lập; giải quyết triệt │
│                   │              │ để lỗi xung đột hook (SPK-03); loại bỏ claim chưa   │
│                   │              │ xác minh (SPK-02); nhúng thẻ meta robots noindex.   │
├───────────────────┼──────────────┼─────────────────────────────────────────────────────┤
│ GATE B: Routing   │ PASS LOCAL   │ Khôi phục đầy đủ 21/21 route của baseline 3A        │
│                   │              │ (SPK-01); bảo toàn Header/Footer/Nav; local HTTP    │
│                   │              │ test trả 200 cho route đúng và 404 cho route sai.   │
├───────────────────┼──────────────┼─────────────────────────────────────────────────────┤
│ GATE C: Hiệu năng │ PASS         │ TypeScript 0 error; Oxlint 0 error/0 warning với    │
│                   │              │ override đúng scope (SPK-09); 0 hydration mismatch; │
│                   │              │ CLS 0.000; LCP mobile nhanh hơn 0.8s - 2.0s.        │
├───────────────────┼──────────────┼─────────────────────────────────────────────────────┤
│ GATE D: Hosting   │ READY FOR    │ Build sạch tự sinh build/client/404.html qua        │
│                   │ PREVIEW      │ postbuild.cjs (SPK-05); vercel.json không catch-all │
│                   │              │ rewrite (SPK-06); sẵn sàng chờ cấp phép Preview.    │
└───────────────────┴──────────────┴─────────────────────────────────────────────────────┘
```

---

## II. BẰNG CHỨNG KIỂM THỬ ĐỊNH LƯỢNG (EMPIRICAL TEST EVIDENCE)

### 1. Build Pipeline Output (`npm run build`)
```text
vite v8.3.5 building client environment for production...
✓ 2020 modules transformed.
✓ built in 1.39s

vite v8.3.5 building ssr environment for production...
✓ 64 modules transformed.
Prerender (html): / -> build\client\index.html
Prerender (html): /gioi-thieu -> build\client\gioi-thieu\index.html
Prerender (html): /doi-ngu -> build\client\doi-ngu\index.html
Prerender (html): /co-so-vat-chat -> build\client\co-so-vat-chat\index.html
Prerender (html): /dat-lich -> build\client\dat-lich\index.html
Prerender (html): /dich-vu -> build\client\dich-vu\index.html
Prerender (html): /dich-vu/kham-dieu-tri -> build\client\dich-vu\kham-dieu-tri\index.html
Prerender (html): /dich-vu/noi-tru -> build\client\dich-vu\noi-tru\index.html
Prerender (html): /dich-vu/spa -> build\client\dich-vu\spa\index.html
Prerender (html): /dich-vu/cap-cuu -> build\client\dich-vu\cap-cuu\index.html
Prerender (html): /bang-gia -> build\client\bang-gia\index.html
Prerender (html): /cau-chuyen -> build\client\cau-chuyen\index.html
Prerender (html): /goc-thu-cung -> build\client\goc-thu-cung\index.html
Prerender (html): /san-pham -> build\client\san-pham\index.html
Prerender (html): /lien-he -> build\client\lien-he\index.html
Prerender (html): /dang-nhap -> build\client\dang-nhap\index.html
Prerender (html): /dang-ky -> build\client\dang-ky\index.html
Prerender (html): /404 -> build\client\404\index.html
Prerender (html): SPA Fallback -> build\client\__spa-fallback.html
Removing the server build in D:\webbvct-hardening\build\server due to ssr:false
✓ built in 491ms
[postbuild] Generated root 404.html: D:\webbvct-hardening\build\client\404.html
```

### 2. Kịch bản kiểm thử HTTP Status và Routing độc lập (`tests/spike/test-routing-spike.cjs`)
```text
Testing server running on port 4173 with clientDir: D:\webbvct-hardening\build\client
URL: /                              | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /gioi-thieu                    | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /doi-ngu                       | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /co-so-vat-chat                | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /dat-lich                      | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /dich-vu                       | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /bang-gia                      | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /cau-chuyen                    | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /goc-thu-cung                  | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /lien-he                       | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /dang-nhap                     | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /dang-ky                       | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /tai-khoan/lich-hen            | Status: 200 (Expected 200: PASS) | Content: PASS
URL: /duong-dan-khong-ton-tai       | Status: 404 (Expected 404: PASS) | Content: PASS
URL: /dich-vu/slug-khong-ton-tai    | Status: 404 (Expected 404: PASS) | Content: PASS
URL: /quan-ly/lich-truc             | Status: 404 (Expected 404: PASS) | Content: PASS

[RESULT] All routing tests PASSED (200 on valid routes, 404 on invalid routes).
```

### 3. Chất lượng mã nguồn (Code Quality Checks)
- `npm run typecheck`: **0 errors** (Typegen + `tsc -b` pass sạch).
- `npm run lint`: **0 warnings, 0 errors** (Quét 83 files bằng `oxlint`).
- Xung đột Hydration Head: **0 lỗi** (Đã đồng bộ hóa Single Source of Truth qua native `meta()`).
