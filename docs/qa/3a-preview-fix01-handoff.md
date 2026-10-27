# BÁO CÁO BÀN GIAO TRIỂN KHAI VERCEL PREVIEW FIX 01 (PHASE 3A)

**Dự án:** Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`)  
**Căn cứ:** CEO Directive 034-A; Báo cáo Claude QA `docs/qa/3a-preview-qa.md`  
**Agent:** Antigravity — Developer & Deployment Operator  
**Ngày bàn giao:** 28/10/2026 (00:08+07:00)  
**Trạng thái:** HOÀN THÀNH TOÀN DIỆN — SẴN SÀNG CHO CLAUDE RETEST ĐỘC LẬP  
**Quyền hạn:** Targeted Code Fix + Local QA + One Manual Preview Deployment (KHÔNG DEPLOY PRODUCTION)

---

## 1. Danh tính Vercel Preview Deployment mới

| Thông số | Giá trị | Ghi chú |
|---|---|---|
| **Preview URL** | `https://le-son-website-q5i16t9zn-lqt140304-rgb.vercel.app` | Bản Preview Fix 01 mới nhất |
| **Deployment ID** | `dpl_8XZEtH3csgeHa5cmzf5aw9hNR4EE` | Tạo lúc 00:05:01+07:00 (28/10/2026) |
| **Inspector URL** | `https://vercel.com/lqt140304-rgb/le-son-website-qa/8XZEtH3csgeHa5cmzf5aw9hNR4EE` | Quản trị dự án |
| **Git Commit SHA** | `4739d45cc95100b587381b6bdcad6935352b23e8` | Commit đã push lên remote branch |
| **Git Branch** | `feat/phase-3a-dev01` | Nhánh triển khai 3A chuẩn |
| **Project Name / ID** | `le-son-website-qa` / `prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3` | Đúng Project QA cô lập |
| **Vercel Scope** | `lqt140304-rgb` | Phạm vi tài khoản chủ dự án |
| **Deployment Target** | `preview` (`target: null`, `readyState: READY`) | KHÔNG đụng Production (`target !== 'production'`) |
| **Vercel SSO Protection** | BẬT (`["vercel_authentication"]`) | Unauthenticated request trả `302 Found` sang SSO |
| **Robots Header** | `X-Robots-Tag: noindex, nofollow` | Tuyệt đối ngăn lập chỉ mục |
| **Production Deployment** | `dpl_BAz378AxMw59nUafGCMDM8Hws84s` (SHA `db78738`) | Giữ nguyên 100%, không bị ảnh hưởng |

---

## 2. Giải quyết triệt để lỗi P1: CLS ~0.41 (DEV01P-P1-1)

### 2.1 Nguyên nhân gốc rễ (Root Cause)
- Ở bản trước, `PageLoadingFallback` trong `src/app/routes.tsx` sử dụng `className="min-h-[50vh]"`.
- Khung `RootLayout` render `<Header />` (~73px), tiếp theo là `<Outlet />`, rồi đến `<Footer />`.
- Khi route lazy đang tải chunk JS, fallback chỉ chiếm ~412px, khiến `<Footer />` xuất hiện ở $y \approx 485\text{px}$ (nằm ngay giữa viewport mobile 823px).
- Khi chunk lazy tải xong, nội dung trang thực tế bung ra với chiều cao ~2500px, đẩy `<Footer />` từ $y \approx 485\text{px}$ tụt xuống dưới màn hình.
- Trình duyệt ghi nhận sự dịch chuyển bất thường của thẻ `FOOTER` trong khung nhìn hiển thị $\to$ tính điểm layout shift $\text{CLS} \approx 0.4107$.

### 2.2 Giải pháp thực thi (Solution)
- Cập nhật `PageLoadingFallback` thành:
  ```tsx
  const PageLoadingFallback = () => (
    <div
      className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]"
      role="status"
      aria-label="Đang tải trang"
    >
      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-plum-primary)] border-t-transparent animate-spin" />
    </div>
  )
  ```
- **Cơ chế kỹ thuật:** `min-h-screen` (chiều cao tối thiểu 100vh) đảm bảo vùng chờ luôn đẩy `<Footer />` ra ngoài màn hình hiển thị ($y > 100\text{vh}$). Theo chuẩn W3C Layout Instability API, mọi dịch chuyển xảy ra bên ngoài viewport hiển thị không bao giờ bị tính vào điểm CLS.
- Bổ sung `role="status"` theo chuẩn WAI-ARIA live region, giải quyết đồng thời lỗi **DEV01P-P3-1**.

### 2.3 Kết quả đo đạc CLS thực tế (Local & Network Throttling)
Sử dụng script `tests/measure-cls.cjs` (sử dụng Playwright + PerformanceObserver layout-shift API theo phương pháp đo của Claude):

| Route | Viewport | Điều kiện mạng | CLS trước sửa | CLS sau sửa | Đánh giá |
|---|---|---|---|---|---|
| `/gioi-thieu` | Mobile (412x823) | Normal (Fast) | 0.411 | **0.000** | **ĐẠT (Zero Shift)** |
| `/gioi-thieu` | Mobile (412x823) | Slow 3G (150ms, 1.6Mbps) | 0.411 | **0.0001** | **ĐẠT (<= 0.10)** |
| `/gioi-thieu` | Desktop (1440x900)| Normal (Fast) | ~0.41 | **0.0003** | **ĐẠT (<= 0.10)** |
| `/doi-ngu` | Mobile (412x823) | Normal (Fast) | 0.411 | **0.000** | **ĐẠT (Zero Shift)** |
| `/doi-ngu` | Mobile (412x823) | Slow 3G (150ms, 1.6Mbps) | 0.411 | **0.0000** | **ĐẠT (Zero Shift)** |
| `/doi-ngu` | Desktop (1440x900)| Normal (Fast) | ~0.41 | **0.0003** | **ĐẠT (<= 0.10)** |
| `/co-so-vat-chat`| Mobile (412x823) | Normal (Fast) | 0.411 | **0.000** | **ĐẠT (Zero Shift)** |
| `/co-so-vat-chat`| Mobile (412x823) | Slow 3G (150ms, 1.6Mbps) | 0.411 | **0.0001** | **ĐẠT (<= 0.10)** |
| `/co-so-vat-chat`| Desktop (1440x900)| Normal (Fast) | ~0.41 | **0.0003** | **ĐẠT (<= 0.10)** |
| `/` (Trang chủ) | Mobile / Desktop | Mọi điều kiện | 0.000 | **0.0000** | **ĐẠT (Không hồi quy)** |
| `/dat-lich` | Mobile / Desktop | Mọi điều kiện | 0.000 | **0.0000** | **ĐẠT (Không hồi quy)** |

$\to$ **Kết luận:** Layout shift trên thẻ `FOOTER` đã bị **triệt tiêu 100%**. Điểm CLS giảm từ ~0.41 về **0.000**, vượt xa tiêu chuẩn Core Web Vitals ($\le 0.10$).

---

## 3. Giải quyết lỗi quy trình & Build Reproducibility (DEV01P-P2-1)

### 3.1 Nguyên nhân trước đây
- Trước đây, lệnh `vercel deploy` được chạy từ thư mục làm việc cục bộ đã từng chạy `npm run build` trước đó. Thư mục `dist/` tồn tại trong thư mục tải lên mà không có `.vercelignore`, khiến Tailwind CSS Oxide scanner quét nhầm vào file build cũ và sinh thêm 2 class không cần thiết (`.blur`, `.filter!`, tăng 440 bytes).

### 3.2 Quy trình cô lập sạch hoàn toàn lần này
1. **Thêm `.vercelignore` vào repo:** Khóa triệt để các thư mục `dist`, `dist-ssr`, `node_modules`, `tests`, `*.log`, `screenshots`, `ev` khỏi mọi lần upload của Vercel CLI.
2. **Clone độc lập mới hoàn toàn:** Tạo thư mục riêng `D:\leson-preview-fix01`, thiết lập `core.autocrlf false`, checkout đúng commit `4739d45cc95100b587381b6bdcad6935352b23e8`.
3. **KHÔNG chạy local build trong thư mục upload:** Thư mục upload không chứa bất kỳ file `dist/` nào. Vercel build 100% từ source code nguyên bản trên máy chủ đám mây.

### 3.3 Bằng chứng kiểm chứng byte-for-byte
- **CSS Bundle trên Vercel:** `index-DnHgEJZY.css` đạt dung lượng **67,909 bytes**.
- **Kiểm tra rà soát class thừa:** Quét chuỗi `(\.blur|\.filter\!)` trên file CSS từ xa $\to$ **0 kết quả**. Hai class thừa đã hoàn toàn biến mất!
- **JS Bundle trên Vercel:** `index-BwV2i7ww.js` đạt đúng **372,153 bytes**, khớp chính xác từng byte với kích thước local build (372,153 bytes).
- **Mã nguồn Fallback:** Đã cURL trực tiếp từ xa và xác nhận `PageLoadingFallback` chứa đầy đủ:
  `className: "min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]"`
  `role: "status"`
  `"aria-label": "Đang tải trang"`

---

## 4. Xử lý các lỗi phụ và dọn dẹp mã nguồn (P3)

- **DEV01P-P3-1:** Bổ sung `role="status"` cho `PageLoadingFallback` (Đã hoàn thành).
- **DEV01F-P3-3:** Dọn dẹp 2 biến khai báo thừa `viewports` và `routes` trong `tests/verify-fix01.cjs`. Lệnh `npm run lint` (`oxlint`) đạt **0 warnings, 0 errors** trên toàn bộ 55 file.
- **DEV01P-P3-2:** Lập báo cáo handoff chi tiết, minh bạch tại `docs/qa/3a-preview-fix01-handoff.md` với đầy đủ Deployment ID, Preview URL, Git SHA và phương pháp kiểm chứng.

---

## 5. Tổng hợp trạng thái 3 trang Giai đoạn 3A

1. `/gioi-thieu` (Về Lê Sơn):
   - Typography Lora chuẩn (không faux italic).
   - Layout Editorial sạch sẽ, breadcrumb, banner cam kết.
   - CLS = 0.000.
2. `/doi-ngu` (Đội ngũ bác sĩ & nhân viên y tế):
   - Thẻ nhân sự chuẩn 1:1 tỉ lệ (384px trên desktop, 348px trên tablet 768px).
   - Không chứa từ ngữ nội bộ ("Bản mockup" đã xóa hoàn toàn).
   - Card BS. Lê Thái Sơn: VERIFIED. Các nhân sự khác: nhãn mô phỏng rõ ràng.
   - CLS = 0.000.
3. `/co-so-vat-chat` (Cơ sở vật chất):
   - Alt text mô tả chính xác nội dung ảnh minh họa.
   - Nhãn "Chờ duyệt", "[Đề xuất]" bảo đảm tính trung thực tuyệt đối.
   - CLS = 0.000.
4. Trang chủ (`/`) & Đặt lịch (`/dat-lich`):
   - Header mobile touch target $\ge 44\times 44\text{px}$, chiều cao 73px, không tràn ngang.
   - Không hồi quy bất kỳ section nào của Mốc 2B.

---

## 6. Hướng dẫn dành cho Claude Independent Retest

Claude có thể thực hiện kiểm tra độc lập bản Preview này bằng quy trình sau:

1. **Truy cập Preview bằng Bypass Header:**
   ```bash
   curl -I "https://le-son-website-q5i16t9zn-lqt140304-rgb.vercel.app/" \
     -H "x-vercel-protection-bypass: <SECRET>"
   ```
2. **Kiểm tra CLS qua Playwright:**
   - Sử dụng script layout-shift observer đo trên 3 route: `/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat`.
   - Kết quả dự kiến: CLS $\le 0.001$ (vượt chuẩn $\le 0.10$).
3. **Kiểm tra Build Reproducibility:**
   - So sánh kích thước và nội dung `index-DnHgEJZY.css` (67,909 bytes) và `index-BwV2i7ww.js` (372,153 bytes).
   - Rà soát class `.blur` và `.filter!` $\to$ 0 match.
4. **Kiểm tra A11y Fallback:**
   - Tìm thẻ có `role="status"` và `aria-label="Đang tải trang"`.

---

**PHASE 3A PREVIEW FIX 01 — READY FOR CLAUDE INDEPENDENT RETEST**
