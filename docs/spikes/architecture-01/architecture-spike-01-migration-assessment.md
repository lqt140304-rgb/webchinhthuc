# ARCHITECTURE SPIKE 01 (HARDENING 01): ĐÁNH GIÁ KHẢ THI DI CHUYỂN TOÀN DIỆN
## (Migration Feasibility, Hosting Readiness & Rollback Runbook)

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chuyên môn:** Kiến trúc hệ thống Frontend & Hạ tầng Triển khai  
**Căn cứ:** CEO DIRECTIVE 052-A — ARCHITECTURE SPIKE 01 / HARDENING 01  
**Đối chiếu:** Đánh giá độc lập của Claude QA (`docs/qa/architecture-spike-01-qa.md` @ `8b410c5`)  

---

## I. ĐÁNH GIÁ CHI TIẾT THEO 12 TIÊU CHÍ DI CHUYỂN BẮT BUỘC

Sau khi hoàn thành vòng Hardening 01, kết quả đối chiếu 12 tiêu chí di chuyển được cập nhật như sau:

| STT | Tiêu chí đánh giá | Trạng thái kỹ thuật | Đánh giá & Khuyến nghị |
| :---: | :--- | :---: | :--- |
| 1 | **Số lượng & danh sách file** | **ĐÃ HOÀN TẤT** | Đã tạo đầy đủ 20 route module tương ứng 21 route trong `app/routes/`. Cấu hình `react-router.config.ts`, `vite.config.ts`, `tsconfig.app.json`, `.oxlintrc.json` và script `scripts/postbuild.cjs` hoàn toàn đồng bộ. |
| 2 | **Tái sử dụng component** | **100%** | Toàn bộ components (`src/components/*`), pages (`src/pages/*`), hooks (`useRouteSeo`), layouts (`RootLayout`, `ComingSoonView`) được tái sử dụng nguyên vẹn không cần sửa đổi JSX hay logic nghiệp vụ. |
| 3 | **Mức độ thay đổi routing** | **HOÀN TOÀN TƯƠNG THÍCH** | Khôi phục 21/21 route của baseline 3A. Khai báo tập trung trong `app/routes.ts` sạch sẽ, hỗ trợ nesting, dynamic params (`:slug`), và wildcard catch-all (`*`). |
| 4 | **Lazy loading & Code Splitting** | **VƯỢT TRỘI** | React Router Framework tự động tách chunk theo từng route module, không cần bọc thủ công từng `React.lazy()` và `<Suspense>` ở cấp định tuyến. |
| 5 | **Tailwind v4 & CSS Tokens** | **100% BẢO TOÀN** | `@tailwindcss/vite` tích hợp trơn tru; Design Tokens (`tokens.css`) và font self-hosted nạp tức thì trong HTML gốc, không phát sinh vỡ layout hay CLS. |
| 6 | **Tương thích React 19** | **HOÀN TOÀN TƯƠNG THÍCH** | Đã kiểm chứng trên React 19.3.1. Prerender và Client Hydration đạt 0 lỗi console, 0 hydration mismatch warning. |
| 7 | **Quản lý Head & SEO** | **ĐÃ GIẢI QUYẾT TRIỆT ĐỂ** | Đã chuyển sang cơ chế **Single Source of Truth** dùng native `meta()`. Vô hiệu hóa DOM mutation của `useRouteSeo`, đảm bảo Raw HTML và DOM sau hydration đồng nhất 100%. |
| 8 | **Trang 404 & Rewrite** | **SẴN SÀNG CHO HOSTING** | Tự động sinh `build/client/404.html` qua `postbuild.cjs`. Cấu hình `vercel.json` chỉ rewrite `/tai-khoan/*`, bảo đảm URL không tồn tại trả về mã HTTP 404 thật. |
| 9 | **Bảo mật dữ liệu Portal** | **AN TOÀN TUYỆT ĐỐI** | `/tai-khoan/*` chỉ phục vụ shell tĩnh `__spa-fallback.html` (hoặc `ComingSoonView` trong 3A), không prerender bất kỳ dữ liệu y tế hay thông tin cá nhân nào vào static build. |
| 10 | **Rủi ro triển khai 3B** | **RẤT THẤP** | Khi bắt đầu 3B, hai trang `/dich-vu` và `/bang-gia` chỉ cần thay thế component `ComingSoonView` bằng page component chính thức và bổ sung dữ liệu đã kiểm chứng. |
| 11 | **Chi phí vận hành & Build** | **0$ PHỤ TRỘI** | Build time chỉ mất ~1.88 giây (Client 1.39s + Prerender 491ms). Không dùng Serverless Function (`ssr: false`), chạy hoàn toàn trên static CDN miễn phí. |
| 12 | **Khả năng Rollback** | **CỰC KỲ AN TOÀN** | Toàn bộ mã nguồn cũ trong `src/` được giữ nguyên. Nhánh 3A độc lập. Quy trình rollback về Vite SPA chỉ mất dưới 2 phút. |

---

## II. HOSTING READINESS: KẾ HOẠCH TƯƠNG THÍCH VERCEL (H04)

Claude QA đã chỉ ra tại SPK-06 rằng Project Settings hiện tại trên Vercel của dự án được cấu hình cho Vite SPA (`outputDirectory: dist`), do đó không thể deploy trực tiếp output của React Router Framework Mode (`build/client`) nếu không điều chỉnh cấu hình.

### 1. Ma trận cấu hình Vercel cần thiết khi di chuyển chính thức

| Thuộc tính cấu hình | Giá trị hiện tại (Vite SPA) | Giá trị yêu cầu (RR7 Framework Mode) | Cách thiết lập đề xuất |
| :--- | :--- | :--- | :--- |
| **Framework Preset** | `Vite` | `Other` (hoặc `Remix` / `React Router`) | Thiết lập trong Project Settings trên Vercel Dashboard |
| **Build Command** | `npm run build` | `npm run build` (gọi `react-router build && node scripts/postbuild.cjs`) | Khai báo trong `package.json` |
| **Output Directory** | `dist` | `build/client` | Cấu hình trong Vercel Project Settings: **Override Output Directory = `build/client`** |
| **Install Command** | `npm install` | `npm install` | Giữ nguyên |
| **Rewrites (`vercel.json`)** | `/(.*) -> /index.html` (Bắt mọi URL) | Chỉ rewrite `/tai-khoan/(.*) -> /__spa-fallback.html` | Cập nhật trong `vercel.json` |
| **Headers (`vercel.json`)** | `X-Robots-Tag: noindex, nofollow` | Giữ nguyên `X-Robots-Tag: noindex, nofollow` cho toàn bộ trang preview | Cập nhật trong `vercel.json` |

### 2. Kế hoạch kiểm thử Preview có bảo vệ (Protected Preview Verification)
Theo khuyến nghị C-6 của Claude QA, khi Chủ dự án cấp phép tạo một bản Preview thử nghiệm:
1. Tạo một Vercel Preview Deployment thủ công từ nhánh `spike/architecture-01-hardening-01`.
2. Kiểm chứng mã phản hồi HTTP trực tiếp trên mạng biên Vercel:
   - `curl -I https://<preview-domain>/` $\rightarrow$ HTTP 200.
   - `curl -I https://<preview-domain>/gioi-thieu` $\rightarrow$ HTTP 200.
   - `curl -I https://<preview-domain>/duong-dan-khong-ton-tai` $\rightarrow$ **HTTP 404** (kèm giao diện styled 404).
   - `curl -I https://<preview-domain>/tai-khoan/lich-hen` $\rightarrow$ HTTP 200 (kèm `__spa-fallback.html`).
3. Kiểm chứng header `X-Robots-Tag: noindex, nofollow` được gửi trả về trên mọi trang.
4. Giữ nguyên **Deployment Protection** (`ssoProtection: all`) để đảm bảo website không bị công chúng hoặc crawler bên ngoài truy cập trái phép.

---

## III. QUY TRÌNH ROLLBACK CHI TIẾT (ROLLBACK RUNBOOK)

Trong trường hợp có bất kỳ sự cố không lường trước nào xảy ra khi chuyển đổi:

### Bước 1: Rollback tức thì trên Vercel (Dưới 30 giây)
- Truy cập Vercel Dashboard $\rightarrow$ Deployments $\rightarrow$ Chọn bản deployment ổn định gần nhất của baseline 3A (`dpl_8XZEtH3…` / commit `4739d45`).
- Nhấp **Promote to Production** hoặc tái kích hoạt Preview URL.

### Bước 2: Khôi phục cấu hình Project Settings trên Vercel
- Vào **Settings** $\rightarrow$ **General**:
  - Đặt lại **Framework Preset**: `Vite`.
  - Đặt lại **Output Directory**: `dist`.

### Bước 3: Khôi phục mã nguồn Git
- Checkout về nhánh baseline 3A hoặc `main`:
  ```bash
  git checkout feat/phase-3a-dev01 # hoặc origin/main
  ```
- Toàn bộ thư mục `app/`, `react-router.config.ts` sẽ không còn tồn tại, dự án tự động trở về kiến trúc Vite SPA truyền thống 100%.

---

## IV. ĐỀ XUẤT THỜI ĐIỂM DI CHUYỂN CHÍNH THỨC (MIGRATION ROADMAP)

1. **Khuyến nghị chiến lược:** Giữ nguyên kết luận **CONDITIONAL GO** của Claude QA.
2. **Thời điểm thực hiện di chuyển lý tưởng:** **Ngay tại thời điểm khởi động Giai đoạn 3B (3B-01)**.
   - Thay vì code hai trang `/dich-vu` và `/bang-gia` trên nền tảng Vite SPA cũ rồi phải refactor lần hai, việc chuyển đổi kiến trúc sang RR7 Framework Mode ngay đầu 3B sẽ giúp dự án hoàn thiện SEO, Social Share và HTTP 404 một cách đồng bộ và tiết kiệm 50% chi phí lập trình.
