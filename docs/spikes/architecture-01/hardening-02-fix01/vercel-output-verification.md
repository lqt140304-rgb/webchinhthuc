# ARCHITECTURE SPIKE 01 — HARDENING 02 FIX 01: XÁC MINH CẤU HÌNH OUTPUT VERCEL & PHÂN TÍCH ƯU TIÊN THIẾT LẬP (F01 / 3B-H2-P2-1)

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chỉ thị:** CEO DIRECTIVE 058-A (Mục IV)  
**Agent:** Antigravity — Architecture Implementation  
**Worktree:** `D:\webbvct-hardening-02-fix01`  
**Nhánh:** `spike/architecture-01-hardening-02-fix01`  

---

## I. HIỆN TRẠNG VÀ ĐÍNH CHÍNH TÀI LIỆU CŨ

### 1. Khiếm khuyết tại Hardening 02 do Claude phát hiện
Trong báo cáo Hardening 02, ba tài liệu (`vercel-readiness.md`, `hardening-02-summary.md`, `handoff.md`) đã tuyên bố rằng file `vercel.json` đã được bổ sung đầy đủ các khóa:
```json
"buildCommand": "npm run build",
"outputDirectory": "build/client",
"cleanUrls": true,
"trailingSlash": false
```
Tuy nhiên, khi Claude QA kiểm tra thực tế mã nguồn tại commit `5e00b9a` và `bacc62a`, file `vercel.json` chỉ chứa phần `headers` và `rewrites`, hoàn toàn thiếu các thuộc tính định hình output trên!

Đồng thời, project Vercel hiện tại của dự án (`le-son-website`) đang cấu hình theo preset Vite với thư mục output mặc định là `dist`. Nếu tiến hành deploy ngay từ commit cũ, Vercel sẽ tìm kiếm thư mục `dist` (không tồn tại trong React Router 7 build) dẫn đến lỗi deploy thất bại ngay lập tức!

### 2. Đính chính tài liệu chính thức
Antigravity đính chính công khai:
- **Tuyên bố trong tài liệu Hardening 02 là KHÔNG CHÍNH XÁC so với source code thực tế lúc đó.**
- Không bao giờ được phép báo cáo một tính năng/cấu hình đã hoàn tất khi chưa kiểm tra diff thực tế trong Git.
- Mọi thử nghiệm hiện tại chỉ được xác nhận **PASS LOCAL**, chưa từng được xác minh trên Vercel hosting thật.

---

## II. CẤU HÌNH THỰC TẾ ĐÃ TRIỂN KHAI TRONG FIX 01

Tập tin `vercel.json` đã được cập nhật chính xác và đầy đủ tại nhánh `spike/architecture-01-hardening-02-fix01`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "build/client",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/tai-khoan/(.*)",
      "destination": "/__spa-fallback.html"
    },
    {
      "source": "/cau-chuyen/(.*)",
      "destination": "/__spa-fallback.html"
    },
    {
      "source": "/bai-viet/(.*)",
      "destination": "/__spa-fallback.html"
    }
  ]
}
```

---

## III. ĐÁNH GIÁ CÁC THUỘC TÍNH ĐỊNH TUYẾN (`cleanUrls` & `trailingSlash`)

1. **`outputDirectory: "build/client"`**:
   - React Router 7 Framework Mode khi build với `ssr: false` sẽ kết xuất toàn bộ assets, HTML prerendered và fallback vào thư mục `build/client`.
   - Khóa này chỉ định rõ cho Vercel biết thư mục phân phối tĩnh, ngăn Vercel tìm kiếm thư mục mặc định `dist`.
2. **`cleanUrls: true`**:
   - Đảm bảo các route prerendered tĩnh (như `gioi-thieu/index.html`) được phân phối trực tiếp dưới dạng URL sạch `/gioi-thieu` mà không bị lộ đuôi `.html`.
3. **`trailingSlash: false`**:
   - Chuẩn hóa điều hướng về dạng không có dấu gạch chéo cuối (`/gioi-thieu`), tránh trùng lặp nội dung.
   - Đối với các route dynamic SPA rewrite (như `/tai-khoan/(.*)`), việc truy cập `/tai-khoan/` được rewrite về `/__spa-fallback.html` và hiển thị mượt mà.

---

## IV. KIỂM TOÁN TỆP ĐẦU RA THỰC TẾ TRONG `build/client`

Sau khi thực thi lệnh `npm run build`, thư mục `build/client` được kiểm tra chứa đầy đủ 100% các thành phần yêu cầu:
- **Tập tin HTML prerendered tĩnh (19 routes):**
  - `index.html` (Homepage)
  - `gioi-thieu/index.html`, `doi-ngu/index.html`, `co-so-vat-chat/index.html`, `dat-lich/index.html`
  - `dich-vu/index.html`, `dich-vu/kham-dieu-tri/index.html`, `dich-vu/noi-tru/index.html`, `dich-vu/spa/index.html`, `dich-vu/cap-cuu/index.html`
  - `bang-gia/index.html`, `cau-chuyen/index.html`, `goc-thu-cung/index.html`, `san-pham/index.html`, `lien-he/index.html`
  - `dang-nhap/index.html`, `dang-ky/index.html`
  - `tai-khoan/index.html`
  - `404/index.html`
- **Tập tin phục vụ lỗi 404 cấp gốc:** `404.html` (do postbuild script sinh tự động từ `404/index.html`).
- **Tập tin vỏ tải SPA Fallback:** `__spa-fallback.html` (chứa script `isSpaMode: true` phục vụ các slug động).
- **Thư mục tài nguyên tĩnh:** `assets/*.js`, `assets/*.css` với content hash chống xung đột cache.

---

## V. PHÂN TÍCH THỨ TỰ ƯU TIÊN CẤU HÌNH VERCEL (PROJECT-SETTING PRECEDENCE)

Trên nền tảng Vercel:
1. **Mức ưu tiên 1 (Cao nhất):** Thiết lập thủ công trong Dashboard Vercel (Project Settings -> Build & Development Settings). Nếu tại Dashboard, mục "Output Directory" đang được bật nút "Override" và gán giá trị cứng là `dist`, Vercel sẽ bỏ qua giá trị `build/client` trong `vercel.json`!
2. **Mức ưu tiên 2:** File cấu hình `vercel.json` trong repository.
3. **Mức ưu tiên 3 (Thấp nhất):** Cấu hình mặc định của Framework Preset (Preset "Vite" mặc định output là `dist`, Preset "Other" hoặc "React Router" mặc định theo framework).

### Yêu cầu bắt buộc trước khi tạo Preview:
Để đảm bảo bản Preview hoạt động chính xác mà không phá vỡ cấu hình của nhánh chính:
- **Khuyến nghị 1:** Khi chạy lệnh tạo Preview qua Vercel CLI (nếu được chủ dự án phê duyệt), không thay đổi cấu hình chung của toàn bộ project trên Dashboard để tránh ảnh hưởng đến các bản deploy khác của 3A.
- **Khuyến nghị 2:** Nếu Vercel Project Dashboard có thiết lập override cứng cho `dist`, Chủ dự án hoặc Operator cần kiểm tra bằng lệnh:
  `npx vercel project inspect`
  hoặc gỡ bỏ override trong dashboard để Vercel đọc theo `vercel.json` của nhánh hiện tại.

---

## VI. QUY TRÌNH ROLLBACK CẤU HÌNH

Nếu cấu hình trên gặp trục trặc khi deploy:
1. File `vercel.json` có thể được khôi phục về trạng thái ban đầu của baseline 3A chỉ bằng 1 lệnh git:
   ```bash
   git checkout 4739d45cc95100b587381b6bdcad6935352b23e8 -- vercel.json
   ```
2. Không có bất kỳ thay đổi nào làm biến đổi project settings của Vercel trên cloud, bảo đảm độ an toàn 100%.
