# KẾ HOẠCH NGHIÊN CỨU & THỬ NGHIỆM KIẾN TRÚC — ARCHITECTURE SPIKE 01
## Đánh Giá Khả Năng Chuyển Đổi Sang React Router 7 Framework Mode & Prerender

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 049-A** — Architecture Spike 01 |
| **Agent thực hiện** | Antigravity — Architecture Research & Implementation |
| **Thẩm quyền** | **ISOLATED LOCAL EXPERIMENT ONLY** (Thử nghiệm cục bộ cách ly — Không triển khai Production) |
| **Trạng thái** | **OWNER APPROVED FOR SPIKE — NO DEPLOYMENT** |
| **Mã nguồn cơ sở (Baseline)** | Commit `4739d45cc95100b587381b6bdcad6935352b23e8` (Mốc 3A nghiệm thu có điều kiện) |
| **Môi trường cách ly** | Git Worktree: `D:\webbvct-spike` trên nhánh `spike/architecture-01-rr7-prerender` |
| **Ngày lập kế hoạch** | 28/10/2026 |

---

## 1. MỤC TIÊU NGHIÊN CỨU (MISSION OBJECTIVES)

Nhiệm vụ trọng tâm của Architecture Spike 01 là đánh giá thực nghiệm tính khả thi, ưu nhược điểm, chi phí chuyển đổi và rủi ro kỹ thuật khi nâng cấp kiến trúc website:

- **Kiến trúc hiện tại:** Vite SPA + React Router 7 Library Mode (Client-Side Rendering thuần túy).
- **Kiến trúc mục tiêu thử nghiệm:** React Router 7 Framework Mode + Build-Time Prerendering (`ssr: false` với SPA Fallback).

Mục tiêu định lượng cần chứng minh:
1. Xác định liệu kiến trúc mới có giải quyết dứt điểm các hạn chế cốt lõi về **SEO, Open Graph Metadata và Soft 404** của website công khai hay không.
2. Đảm bảo toàn bộ trải nghiệm người dùng, tương tác mượt mà của React 19 và các design tokens hiện hữu được bảo toàn nguyên vẹn.
3. Bảo vệ tuyệt đối tính riêng tư của hai cổng nội bộ: **Customer Portal** (`/tai-khoan/*`) và **Staff Portal** (`/quan-ly/*`) — không rò rỉ dữ liệu y khoa hoặc khách hàng vào mã HTML tĩnh.

---

## 2. NGUYÊN TẮC CÁCH LY & NGUỒN CHÂN LÝ (SOURCE OF TRUTH & ISOLATION)

### 2.1. Nguồn chân lý
- Repository chính thức: `lqt140304-rgb/webchinhthuc`.
- Baseline xuất phát: `4739d45cc95100b587381b6bdcad6935352b23e8` (chứa đầy đủ 3 trang 3A `/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat` và bản vá CLS min-h-screen fallback).
- Tài liệu quản trị: `AGENTS.md` và `Architecture Baseline V1`.

### 2.2. Chiến lược cách ly Git
- Sử dụng **Git Worktree độc lập** tại thư mục `D:\webbvct-spike` liên kết với nhánh `spike/architecture-01-rr7-prerender`.
- Thư mục gốc `D:\webbvct` (nhánh `docs/phase-3b-00`) được giữ nguyên 100% sạch sẽ, không bị xáo trộn lockfile hay cấu hình.
- Mọi thay đổi `package.json`, cấu hình Vite, route manifest và thử nghiệm build chỉ diễn ra trong worktree cách ly.
- **Cam kết:** Không commit vào nhánh `main`, không merge, không cherry-pick vào các nhánh sản phẩm, không deploy lên Vercel.

---

## 3. PHẠM VI THỬ NGHIỆM (EXPERIMENT SCOPE)

### 3.1. Public Website (Website Công khai)
- Trang chủ: `/` (kiểm tra đầy đủ 6 sections hiện hữu).
- Trang giới thiệu: `/gioi-thieu`.
- Trang đội ngũ: `/doi-ngu`.
- Trang cơ sở vật chất: `/co-so-vat-chat`.
- Trang đặt lịch: `/dat-lich`.
- Tuyến đường kiểm thử SEO chuyên biệt: `/spike-seo-test` (đo lường `<title>`, meta description, thẻ Open Graph, canonical link và nội dung bài viết không qua JavaScript).

### 3.2. Private Applications (Cổng riêng tư)
- Cổng khách hàng: `/tai-khoan/*`.
- Cổng nhân viên & quản lý: `/quan-ly/*`.
- Thử nghiệm duy trì mô hình SPA Client-only; xác minh mã HTML không sinh dữ liệu nhạy cảm ở build-time; gắn cờ `noindex, nofollow`.

### 3.3. Invalid Routes (Tuyến đường không hợp lệ)
- URL công khai không tồn tại (ví dụ: `/duong-dan-khong-ton-tai`).
- URL sâu không tồn tại (ví dụ: `/dich-vu/slug-khong-ton-tai`).
- Tuyến đường tĩnh `/404`.
- Đo lường mã trạng thái HTTP thực tế (200 vs 404).

---

## 4. MA TRẬN 4 CỔNG KIỂM THỬ (THE 4-GATE EVALUATION FRAMEWORK)

| Cổng kiểm định | Trọng tâm đánh giá | Tiêu chí kết luận |
|---|---|---|
| **GATE A: Rendering & SEO** | Kiểm tra mã HTML ban đầu (Raw HTML) không cần thực thi JavaScript | Phải có `<title>`, meta description, canonical, Open Graph và nội dung ngữ nghĩa độc lập theo từng route. |
| **GATE B: Routing & Privacy** | Khả năng điều hướng client, nested refresh, bảo vệ Private Portal và mã HTTP 404 thực | Đạt chuẩn local; ghi nhận `PARTIAL` đối với Vercel Production do chưa được phép deploy xác minh edge rewrite. |
| **GATE C: Performance & Regression** | Build reproducible, TypeScript/Linter, bundle size, CSS integrity, CLS $\le 0.1$ | Không suy giảm hiệu năng so với baseline 3A, không lỗi hydration nghiêm trọng, linter 0 error. |
| **GATE D: Hosting & Social Preview** | Phân tích cấu hình Vercel, Zalo/Facebook bot scraper, Deployment Protection | Phân tích lý thuyết và thiết kế cấu hình; ghi nhận `PARTIAL / NOT TESTED` do không deploy thật. |

---

## 5. ĐIỀU KIỆN DỪNG & BÀN GIAO (STOP CONDITIONS & HANDOFF)

1. **Dừng và báo cáo ngay nếu:**
   - Phát hiện xung đột phụ thuộc không thể giải quyết với React 19 hoặc Tailwind v4.
   - Phát hiện nguy cơ rò rỉ dữ liệu hoặc phá vỡ cấu trúc RootLayout.
   - Đòi hỏi phải deploy Vercel để tiếp tục.
2. **Đầu ra bàn giao:**
   - Toàn bộ kết quả, số liệu đo đạc thực nghiệm, bảng đối chiếu và phân tích chi phí được ghi nhận tại thư mục `docs/spikes/architecture-01/`.
   - Kết thúc với tín hiệu: `ARCHITECTURE SPIKE 01 — READY FOR INDEPENDENT QA`.
