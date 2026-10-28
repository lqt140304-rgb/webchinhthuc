# ARCHITECTURE SPIKE 01 — HARDENING 02 FIX 01 CLEANUP (DIRECTIVE 060-A): BÁO CÁO KHÔI PHỤC BẰNG CHỨNG QA MỐC 2B (C01 / 3B-H2F-P2-1)

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chỉ thị:** CEO DIRECTIVE 060-A (Mục IV)  
**Agent:** Antigravity — Implementation  
**Worktree:** `D:\webbvct-cleanup-060`  
**Nhánh:** `spike/architecture-01-h02-fix01-cleanup`  
**Baseline đối chiếu:** `4739d45cc95100b587381b6bdcad6935352b23e8` (Baseline 3A)  

---

## I. HIỆN TRẠNG & NGUYÊN NHÂN LỖI TRONG FIX 01

### 1. Hiện tượng do Claude phát hiện
Trong commit `f46feeb8d4eacbb3a653ef079a0b7d3db317ada9` của Fix 01, khi kỹ sư thực thi script kiểm thử `tests/e2e/2b-verification.cjs` để xác minh chức năng đặt lịch và responsive 7 kích thước màn hình:
Script đã tự động ghi các ảnh chụp màn hình mới vào đường dẫn:
```javascript
const EVIDENCE_DIR = path.join(__dirname, '..', '..', 'docs', 'qa', '2b-verification-evidence');
```
Hậu quả là **14 ảnh chụp màn hình bằng chứng QA chính thức của Mốc 2B** đã bị ghi đè bởi ảnh của lần chạy spike. Mặc dù tệp báo cáo `2b-verification-results.txt` không bị thay đổi, việc ghi đè ảnh bằng chứng đã nghiệm thu vi phạm nguyên tắc bảo toàn dữ liệu QA của dự án.

---

## II. DANH SÁCH 14 FILE ẢNH & QUY TRÌNH KHÔI PHỤC

Toàn bộ 14 file ảnh đã được khôi phục chính xác từ commit **`4739d45cc95100b587381b6bdcad6935352b23e8`** bằng lệnh:
```bash
git checkout 4739d45cc95100b587381b6bdcad6935352b23e8 -- docs/qa/2b-verification-evidence/
```

### Bảng đối chiếu Hash (SHA-256) và Git Blob SHA chi tiết

| STT | Tên file ảnh | Git Blob (Fix 01 cũ) | SHA-256 (Fix 01 cũ) | Git Blob (Baseline 3A) | SHA-256 (Baseline 3A) | Git Blob (Đã khôi phục trên đĩa) | Trạng thái khớp |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `booking-1366px.png` | `ed649774d7` | `8b8c78f3c8cbfc07...` | `1eb1d8283e` | `ae991cb1f8f0b930...` | `1eb1d8283e` | **EXACT MATCH** |
| 2 | `booking-1440px.png` | `e750df3afd` | `eb793995367ccdc2...` | `18917b9f8a` | `4aca9ac4562b72b6...` | `18917b9f8a` | **EXACT MATCH** |
| 3 | `booking-1920px.png` | `7d24d41d85` | `56cabd19e468b7c2...` | `b598a91d7c` | `5a3bd7aac07669d3...` | `b598a91d7c` | **EXACT MATCH** |
| 4 | `booking-320px.png` | `82b21f0ec8` | `19da013997554f4c...` | `036cf974b1` | `cd54a33d5161f65b...` | `036cf974b1` | **EXACT MATCH** |
| 5 | `booking-360px.png` | `67a597dd3f` | `32cc86b21515fcd8...` | `9e137d78e1` | `51fbc991d7a93c68...` | `9e137d78e1` | **EXACT MATCH** |
| 6 | `booking-390px.png` | `03b266ef61` | `45ccfae4b7f96837...` | `70a053c69b` | `38c39c7980f332d6...` | `70a053c69b` | **EXACT MATCH** |
| 7 | `booking-768px.png` | `b5f8341c37` | `477f8150ae0dfa61...` | `5f42a0cc3c` | `1684ab1623ec8917...` | `5f42a0cc3c` | **EXACT MATCH** |
| 8 | `home-1366px.png` | `581520d03b` | `068ba02fb1918a00...` | `908e1a4c3c` | `a3aa16157bfb1a40...` | `908e1a4c3c` | **EXACT MATCH** |
| 9 | `home-1440px.png` | `56c598bb86` | `fc559868f7dc788a...` | `eb9dfbe58a` | `c65de3e0cc2a8084...` | `eb9dfbe58a` | **EXACT MATCH** |
| 10 | `home-1920px.png` | `fd213170f9` | `cfba1398ea06ea76...` | `148ebfe4a8` | `c1b6af4d721e6fa9...` | `148ebfe4a8` | **EXACT MATCH** |
| 11 | `home-320px.png` | `6a310843ca` | `d688cf647614d33a...` | `bed9345814` | `6d582de9fe1b5c22...` | `bed9345814` | **EXACT MATCH** |
| 12 | `home-360px.png` | `6995a99287` | `2657eb123b7e774a...` | `50f4e9f055` | `b381796a3ee00b7a...` | `50f4e9f055` | **EXACT MATCH** |
| 13 | `home-390px.png` | `de594acd10` | `25bc77b9d3e8e192...` | `bd20d9d768` | `997787654cf60f75...` | `bd20d9d768` | **EXACT MATCH** |
| 14 | `home-768px.png` | `0242655e80` | `5b1e604f37803323...` | `de780a7b93` | `2060813e7ed006b9...` | `de780a7b93` | **EXACT MATCH** |

**Kết quả kiểm tra tự động:**
`ALL 14 FILES EXACT MATCH: true` (100% khớp tuyệt đối bit-for-bit với Baseline 3A `4739d45`).

---

## III. CẢI TIẾN CÁCH LY THƯ MỤC TRONG SCRIPT KIỂM THỬ

Để bảo đảm script `tests/e2e/2b-verification.cjs` không bao giờ ghi đè vào thư mục QA đã nghiệm thu trong các lần chạy tương lai:
Tại dòng 8 của `tests/e2e/2b-verification.cjs`:
```javascript
// Trước (Gây ghi đè):
const EVIDENCE_DIR = path.join(__dirname, '..', '..', 'docs', 'qa', '2b-verification-evidence');

// Sau (Đã cách ly hoàn toàn):
const EVIDENCE_DIR = process.env.TEST_OUTPUT_DIR || path.join(__dirname, '..', '..', 'e2e-evidence', '2b-run');
```

### Ưu điểm của giải pháp mới:
1. Thư mục `e2e-evidence/` đã nằm sẵn trong file `.gitignore` của repository (dòng 29: `e2e-evidence/`), nên mọi ảnh chụp màn hình sinh ra khi chạy test sẽ không bị Git theo dõi hoặc đưa nhầm vào commit.
2. Hỗ trợ biến môi trường `TEST_OUTPUT_DIR` linh hoạt cho môi trường CI/CD khi cần xuất artifact ra vị trí tùy biến.
3. Thư mục `docs/qa/2b-verification-evidence/` trở thành thư mục chỉ đọc (read-only) đối với toàn bộ các script kiểm thử tự động.

---

## IV. KẾT LUẬN
- **Gate C01 (Evidence Integrity):** **ĐẠT (PASS)**.
- 14 ảnh bằng chứng đã được khôi phục nguyên vẹn 100%.
- Không có bất kỳ dữ liệu QA nào bị mất mát hay thay đổi ngoài ý muốn.
- Vấn đề **`3B-H2F-P2-1` đã được GIẢI QUYẾT TRIỆT ĐỂ (CLOSED)**.
