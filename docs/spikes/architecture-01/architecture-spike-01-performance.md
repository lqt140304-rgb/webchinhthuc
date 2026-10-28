# ARCHITECTURE SPIKE 01 (HARDENING 01): BÁO CÁO HIỆU NĂNG & CODE QUALITY
## (Empirical Build Metrics, Bundle Analysis, CWV & Linter Hardening)

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chuyên môn:** Hiệu năng Web, Core Web Vitals (CWV) & Tối ưu hóa Bundle  
**Căn cứ:** CEO DIRECTIVE 052-A — ARCHITECTURE SPIKE 01 / HARDENING 01  
**Đối chiếu:** Dữ liệu đo lường độc lập từ Claude QA (`docs/qa/architecture-spike-01-qa.md` @ `8b410c5`)  

---

## I. ĐO LƯỜNG VÀ SO SÁNH HIỆU NĂNG THỰC TẾ

### 1. Thời gian nạp trang và Core Web Vitals (Dữ liệu Claude QA đo trên Chromium)
*Phương pháp đo:* Chromium (Playwright), server tĩnh cục bộ, thiết bị di động chuẩn Mobile 412×823 (DPR 2.625, CPU throttling 4×, RTT 150ms, băng thông 1.6 Mbps, tắt cache, trung vị 3 lần đo liên tiếp).

| Route | Baseline 3A LCP | Hardening 01 LCP | Mức độ cải thiện LCP | Baseline FCP | Hardening 01 FCP | CLS (Cả hai bản) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `/` (Trang chủ) | 3884 ms | **2920 ms** | **Nhanh hơn ~964 ms** | 3884 ms | **2920 ms** | **0.000** / **0.000** |
| `/gioi-thieu` | 4968 ms | **4180 ms** | **Nhanh hơn ~788 ms** | 3764 ms | **2148 ms** | **0.000** / **0.000** |
| `/doi-ngu` | 4176 ms | **2308 ms** | **Nhanh hơn ~1868 ms** | 3800 ms | **2308 ms** | **0.000** / **0.000** |
| `/co-so-vat-chat` | 4152 ms | **2148 ms** | **Nhanh hơn ~2004 ms** | 3760 ms | **2148 ms** | **0.000** / **0.000** |
| `/dat-lich` | 3836 ms | **2088 ms** | **Nhanh hơn ~1748 ms** | 3836 ms | **2088 ms** | **0.001** / **0.001** |

*Đánh giá chuyên môn:*
- LCP và FCP trên thiết bị di động mô phỏng mạng yếu được **cải thiện từ 0.8 đến 2.0 giây**. Nguyên nhân cốt lõi là do HTML ngữ nghĩa và cấu trúc nội dung đã được sinh sẵn (prerendered) tại thời điểm build; trình duyệt không phải chờ tải toàn bộ JS bundle rồi mới bắt đầu dựng DOM như trong kiến trúc Vite SPA truyền thống.
- Chỉ số **Cumulative Layout Shift (CLS)** duy trì ở mức hoàn hảo: **0.000** trên 4/5 route và **0.001** trên `/dat-lich`, hoàn toàn thỏa mãn tiêu chuẩn khắt khe $\le 0.1$ của Google Core Web Vitals.

---

## II. PHÂN TÍCH DUNG LƯỢNG BUNDLE (BUNDLE ANALYSIS)

### 1. Chi tiết phân rã tài nguyên từ `npm run build` thực tế
- **Client Build Time:** 1.39s
- **Prerender Execution Time:** 491ms (cho toàn bộ 18 files tĩnh)
- **CSS Bundle:**
  - `assets/root-m3OLWqwW.css`: **58.98 kB** (gzip: 10.63 kB) — chứa đầy đủ Design Tokens, Typography và Tailwind v4 classes.
  - `assets/home-C1OD8_RG.css`: **7.22 kB** (gzip: 1.34 kB).
  - `assets/booking-u0vZS9bh.css`: **1.81 kB** (gzip: 0.72 kB).
  - **Tổng CSS:** ~68.0 kB (tương đương 100% với baseline 3A).
- **JavaScript Bundle:**
  - `entry.client`: **214.79 kB** (gzip: 67.22 kB).
  - `jsx-runtime`: **129.15 kB** (gzip: 42.58 kB).
  - Route modules (`home`, `about`, `team`, `facilities`, `booking`, `ComingSoonView`): từ **0.7 kB đến 41.0 kB**.
  - **Tổng JS trang chủ khi nạp ban đầu:** ~131.5 kB gzip (tăng khoảng 26 kB gzip so với baseline Vite SPA 105.4 kB).
  - *Lý do tăng dung lượng:* React Router Framework Mode bao gồm client runtime định tuyến, prefetching và hydration logic của framework. Đổi lại, trang web nhận được khả năng hiển thị HTML tức thì và tốc độ LCP nhanh hơn gần 1 giây.

---

## III. KHẮC PHỤC TRIỆT ĐỂ CÁC VẤN ĐỀ CODE QUALITY (SPK-09)

Trong vòng Hardening 01, toàn bộ các điểm Claude QA góp ý tại SPK-09 đã được giải quyết:

1. **Khắc phục cấu hình Oxlint (`.oxlintrc.json`):**
   - Không tắt rule `react/only-export-components` trên toàn bộ repository nữa.
   - Sử dụng cơ chế `overrides` chuẩn để chỉ vô hiệu hóa rule này trên các file thuộc `app/routes/**` (nơi React Router bắt buộc phải xuất đồng thời component và hàm `meta()`).
   - Kết quả: `oxlint` quét toàn bộ 83 files trong repo và đạt **0 warnings, 0 errors**.
2. **Chuẩn hóa `package.json` và Quản lý Phụ thuộc:**
   - Đưa `@react-router/dev` về đúng nhóm `devDependencies`.
   - Giữ `@react-router/node` duy nhất trong `dependencies` để phục vụ prerender runtime của `@react-router/dev`.
   - Loại bỏ hoàn toàn package `@vitejs/plugin-react` dư thừa.
   - Sửa lệnh `npm run preview` thành: `"preview": "vite preview --outDir build/client"` để phục vụ trực tiếp output của React Router Framework Mode.
3. **Quy trình Build Tự động hóa (`scripts/postbuild.cjs`):**
   - Viết kịch bản Node.js đa nền tảng (không hardcode đường dẫn Windows) tự động sao chép `build/client/404/index.html` thành `build/client/404.html` ngay sau khi `react-router build` hoàn tất.
   - Đảm bảo bất kỳ môi trường CI/CD hoặc clean build nào (`npm run build`) cũng tự động sinh ra file `404.html` mà không phụ thuộc vào script kiểm thử.
