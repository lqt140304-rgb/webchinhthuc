# Báo Cáo Bàn Giao Clean Git Preview Deployment (QA 2B-10) — Antigravity

| Mục | Chi tiết |
|---|---|
| **Người thực hiện** | Antigravity (Designer & Developer, theo `AGENTS.md`) |
| **Ngày thực hiện** | 27/10/2026 |
| **Căn cứ chỉ đạo** | [CEO DIRECTIVE 015-A (CLEAN GIT PREVIEW DEPLOYMENT)](#) & Báo cáo Claude QA `docs/qa/2b-qa-09.md` |
| **Nhánh làm việc** | `fix/milestone-2a-qa` |
| **SHA commit triển khai** | [`d3c32dd7aef8644149646139de470b8a99fda10d`](https://github.com/lqt140304-rgb/webchinhthuc/commit/d3c32dd7aef8644149646139de470b8a99fda10d) (ngắn gọn: `d3c32dd`) |
| **Vercel Project** | `le-son-website-qa` (Project ID: `prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3`) |
| **Vercel Deployment ID** | `dpl_HvyLw6bGTrDuNxJV3xeSSt6yimyC` |
| **Vercel Preview URL** | `https://le-son-website-jcml07jh0-lqt140304-rgb.vercel.app` |
| **Inspector URL** | `https://vercel.com/lqt140304-rgb/le-son-website-qa/HvyLw6bGTrDuNxJV3xeSSt6yimyC` |
| **Trạng thái deployment** | `target: preview`, `status: ● Ready` |
| **Tín hiệu kết thúc** | **CLEAN PREVIEW READY FOR CLAUDE QA 2B-10** |

---

## 1. Mục Tiêu & Bối Cảnh Thực Hiện

Trong báo cáo độc lập Claude QA 2B-09 (`docs/qa/2b-qa-09.md`), Claude đã xác nhận:
- **A04 & A05-F1:** PASS (mọi URL có/không có dấu `/` cuối đều nhận đúng header bảo vệ).
- **2B-25 Typography:** PASS (hiển thị đúng 6 biến thể font thật).
- **2B-28 Font Script:** PASS (giữ nguyên cấu hình Phương án C).
- **Phát hiện lỗi BR-1 (Build Reproducibility — P2):** Bản deploy Preview trước đó được tải lên từ thư mục làm việc cục bộ có 4/7 file `*.module.css` giữ ký tự CRLF và Tailwind quét các file tạm không thuộc Git, dẫn đến hash file JS và CSS khác biệt với bản build chuẩn từ Git sạch.

Chủ dự án và CEO đã ban hành **CEO DIRECTIVE 015-A**, yêu cầu Antigravity thiết lập môi trường clone Git hoàn toàn sạch và tạo một bản Vercel Preview mới có thể kiểm chứng 100% khớp hash byte-for-byte với Git SHA `d3c32dd`.

---

## 2. Quy Trình Triển Khai Git Sạch (Clean Git Clone & Deployment)

### Bước 1: Khởi tạo Clone hoàn toàn mới với cấu hình ép chuẩn LF
Để triệt tiêu hiện tượng Windows tự động chuyển đổi sang CRLF qua biến `core.autocrlf`, toàn bộ repo được clone vào thư mục cô lập:
```cmd
git clone -c core.autocrlf=false -c core.eol=lf https://github.com/lqt140304-rgb/webchinhthuc.git d:\webbvct-clean
```

### Bước 2: Checkout detached HEAD tại đúng commit `d3c32dd`
```cmd
cd /d d:\webbvct-clean
git checkout d3c32dd7aef8644149646139de470b8a99fda10d
git rev-parse HEAD
# Output: d3c32dd7aef8644149646139de470b8a99fda10d
```

### Bước 3: Kiểm kê ký tự xuống dòng (Line Endings)
Chạy script kiểm tra quét toàn bộ 103 file mã nguồn và cấu hình trong `d:\webbvct-clean`:
- **Kết quả:** `0 CRLF files out of 103 text files scanned` (100% file là LF nguyên bản).
- `git status --porcelain`: Rỗng hoàn toàn.

### Bước 4: Kiểm tra tính toàn vẹn nhị phân (Binary Integrity)
Xác nhận 6 file WOFF2 trong `public/fonts/` khớp tuyệt đối kích thước nhị phân:
- `be-vietnam-pro-400.woff2`: 35,824 bytes
- `be-vietnam-pro-500.woff2`: 37,600 bytes
- `be-vietnam-pro-600.woff2`: 37,776 bytes
- `be-vietnam-pro-700.woff2`: 38,560 bytes
- `be-vietnam-pro-italic-400.woff2`: 36,208 bytes
- `lora-600.woff2`: 49,712 bytes

### Bước 5: Cài đặt và build kiểm chứng cục bộ
```cmd
npm ci
npx tsc -b
npx oxlint
npm run build
```
- `tsc -b`: 0 lỗi.
- `oxlint`: 0 warnings, 0 errors trên 42 files.
- Kết quả build cục bộ:
  - `dist/assets/index-CvVwFN8Z.js` (369.95 kB, SHA-256: `10f187c6990780a5a4417928e9ab313db068caffce0e988233b07cadba8be234`)
  - `dist/assets/index-vrX09Urw.css` (61.36 kB, SHA-256: `ca6de747195a5550d80dc7ea59cc7ea8a43c51a9b77c07d596e79ffbefe66d87`)

### Bước 6: Loại bỏ thư mục `dist` trước khi tải lên Vercel
Phân tích kỹ thuật của Antigravity phát hiện: Nếu thư mục `dist/` tồn tại khi chạy `vercel deploy`, Vercel CLI sẽ tải cả `dist/` lên máy chủ build, và Tailwind v4 sẽ quét ngược lại các file css trong `dist/`, nhận diện nhầm các hàm CSS hiệu ứng làm mờ trong bundle cũ thành tiện ích CSS bổ sung.
- Antigravity đã xóa sạch `dist/` và `.env.local` trước khi upload.
- Số lượng file tải lên Vercel: Đúng chính xác **280 file** thuộc Git (không thừa bất kỳ file tạm hay file build cũ nào).

### Bước 7: Triển khai Vercel Preview với cờ `--force`
```cmd
npx vercel link --project le-son-website-qa --yes
npx vercel --force
```
- Cờ `--force` đảm bảo Vercel **bỏ qua toàn bộ build cache cũ** (`Skipping build cache, deployment was triggered without cache`).
- Vercel build trực tiếp trên máy chủ Linux từ đúng 280 file nguồn Git sạch.

---

## 3. Bằng Chứng Đối Chiếu Hash Nhị Phân (Build Reproducibility - 100% MATCH)

### A. Nhật ký build máy chủ Vercel (`dpl_HvyLw6bGTrDuNxJV3xeSSt6yimyC`):
```text
2026-10-27T09:24:25.698Z  Skipping build cache, deployment was triggered without cache.
2026-10-27T09:24:26.035Z  Downloading 280 deployment files...
...
2026-10-27T09:24:32.539Z  vite v8.3.5 building client environment for production...
2026-10-27T09:24:32.549Z  transforming...
2026-10-27T09:24:32.932Z  ✓ 1965 modules transformed.
2026-10-27T09:24:32.977Z  rendering chunks...
2026-10-27T09:24:33.032Z  computing gzip size...
2026-10-27T09:24:33.037Z  dist/index.html                   1.57 kB │ gzip:   0.79 kB
2026-10-27T09:24:33.038Z  dist/assets/index-vrX09Urw.css   61.36 kB │ gzip:  11.12 kB
2026-10-27T09:24:33.038Z  dist/assets/index-CvVwFN8Z.js   369.95 kB │ gzip: 105.92 kB
2026-10-27T09:24:33.039Z  ✓ built in 499ms
```

### B. Bảng đối chiếu Hash SHA-256 thực tế tải về từ live Preview:

| Tài nguyên | Kỳ vọng Claude QA 2B-09 | Thực tế tải về từ Vercel Live Preview | Kết luận |
|---|---|---|---|
| **JS Bundle** | `index-CvVwFN8Z.js`<br>Dung lượng: 369,950–369,954 bytes<br>SHA-256: `10f187c6990780a5a4417928e9ab313db068caffce0e988233b07cadba8be234` | `index-CvVwFN8Z.js`<br>Dung lượng: 369,954 bytes<br>SHA-256: `10f187c6990780a5a4417928e9ab313db068caffce0e988233b07cadba8be234` | **100% MATCH** |
| **CSS Bundle** | `index-vrX09Urw.css`<br>Dung lượng: 61,360–61,365 bytes<br>SHA-256: `ca6de747195a5550d80dc7ea59cc7ea8a43c51a9b77c07d596e79ffbefe66d87` | `index-vrX09Urw.css`<br>Dung lượng: 61,365 bytes<br>SHA-256: `ca6de747195a5550d80dc7ea59cc7ea8a43c51a9b77c07d596e79ffbefe66d87` | **100% MATCH** |

**Kết luận:** Vấn đề BR-1 đã được giải quyết triệt để. Bản Preview `dpl_HvyLw6bGTrDuNxJV3xeSSt6yimyC` hoàn toàn tái lập và đồng nhất với mã nguồn Git SHA `d3c32dd`.

---

## 4. Xác Minh Trực Tiếp Header HTTP Trên Live Preview

Kiểm tra bằng `vercel curl <URL> -I` trên bản Preview mới:

| Tuyến đường (URL) | HTTP Status | Giá trị `X-Robots-Tag` | Ý nghĩa bảo mật & SEO |
|---|---|---|---|
| `/` | `200 OK` | `noindex` | Tầng Preview platform bảo vệ toàn bộ trang, không lộ ra Google Search |
| `/gioi-thieu/` | `200 OK` | `noindex, nofollow` | Khớp quy tắc `vercel.json` (A05-F1 PASS) |
| `/dich-vu/spa/` | `200 OK` | `noindex, nofollow` | Khớp quy tắc `vercel.json` (A05-F1 PASS) |
| `/tai-khoan/` | `200 OK` | `noindex, nofollow` | Khớp quy tắc `vercel.json` (A05-F1 PASS) |
| `/quan-ly/` | `200 OK` | `noindex, nofollow` | Khớp quy tắc `vercel.json` (A05-F1 PASS) |

---

## 5. Trạng Thái Tuân Thủ Thiết Kế & Quy Hoạch

1. **Nhận diện thiết kế Vibrant Editorial Luxury:** Bảo toàn 100% đầy đủ 6 section trang chủ (Hero, Vì sao chọn Lê Sơn, Dịch vụ tiêu biểu, Câu chuyện nổi bật, Góc kiến thức & Tin tức, Đặt lịch & Liên hệ).
2. **Typography (Phương án C):** Giữ nguyên vẹn 6 file WOFF2 self-hosted chuẩn Tiếng Việt; không tải dư thừa biến thể.
3. **Chính sách ảnh (2B-06):** Giữ nguyên trạng thái chưa xác minh (unverified) và ghi chú minh họa theo chỉ đạo CEO Directive 009 & 015-A; không phát hành công khai.
4. **Phân định ba khu vực:** Giữ nguyên quy chuẩn tuyến `/tai-khoan/*` (Customer Portal) và `/quan-ly/*` (Staff Portal); không lộ mã nguồn hay module dashboard vào bundle hiện tại.

---

## 6. Lệnh Đối Chiếu Dành Cho Claude QA

Claude có thể kiểm tra trực tiếp bản deploy này qua các lệnh:
```bash
# 1. Kiểm tra trạng thái deploy
npx vercel inspect le-son-website-jcml07jh0-lqt140304-rgb.vercel.app

# 2. Kiểm tra header HTTP thật qua proxy/bypass
curl -s -I -H "x-vercel-protection-bypass: <SECRET>" https://le-son-website-jcml07jh0-lqt140304-rgb.vercel.app/gioi-thieu/

# 3. Chạy script đối chiếu sha của Claude
tests/vercel/verify-deploy-sha.sh https://le-son-website-jcml07jh0-lqt140304-rgb.vercel.app
```

---

**CLEAN PREVIEW READY FOR CLAUDE QA 2B-10**
