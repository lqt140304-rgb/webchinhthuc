# ARCHITECTURE SPIKE 01 — HARDENING 02: PHÂN TÍCH CHUYÊN SÂU LỖI HYDRATION #418 TRÊN TRANG 404 & GIẢI PHÁP TRIỆT ĐỂ

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chỉ thị:** CEO DIRECTIVE 055-A (Mục V — Hydration 404 Deep-Dive)  
**Agent:** Antigravity — Architecture Implementation  
**Worktree:** `D:\webbvct-hardening-02`  
**Nhánh:** `spike/architecture-01-hardening-02`  

---

## I. HIỆN TƯỢNG VÀ NGUYÊN NHÂN GỐC TRONG HARDENING 01

### 1. Hiện tượng ghi nhận từ Claude QA (Finding H08)
Trong bài đánh giá Hardening 01, Claude ghi nhận khi truy cập trực tiếp bằng HTTP GET vào các đường dẫn không tồn tại (ví dụ: `/khong-ton-tai`, `/quan-ly/lich-truc`, `/dich-vu/slug-khong-ton-tai`):
- Máy chủ tĩnh trả về file `404.html` (render đúng nội dung trang 404).
- Tuy nhiên, trên DevTools Console xuất hiện lỗi nghiêm trọng của React 19:
  ```text
  Error: Minified React error #418; visit https://react.dev/errors/418 for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
  ```
- Đồng thời, khi truy cập các route động như `/cau-chuyen/ca-dieu-tri-01` hoặc `/bai-viet/cham-soc-mua-mua`, máy chủ tĩnh không tìm thấy file HTML nên rơi vào `404.html`, sau đó JavaScript client cố gắng render `StoryDetailRoute`, tạo ra sự xung đột cây DOM SSR và Client DOM cực kỳ nghiêm trọng, dẫn đến lỗi hydration crash.

### 2. Phân tích mã nguồn và nguyên nhân kỹ thuật cốt lõi
React Error #418 là lỗi **Hydration Mismatch** trong React 19: Cấu trúc HTML được render từ phía server (SSR/Prerender) không trùng khớp với cấu trúc cây Virtual DOM mà React tạo ra trong lần render đầu tiên tại client.

Sau khi mổ xẻ mã nguồn cấu hình router tại Hardening 01, nguyên nhân gốc rễ được xác định như sau:

#### A. Xung đột Route Module ID giữa Static Prerender và Client Router:
Trong file `app/routes.ts` của Hardening 01, Antigravity đã cấu hình hai route riêng biệt:
```ts
// Hardening 01 (Lỗi kiến trúc):
route('404', 'routes/static-404.tsx'),
// ...
route('*', 'routes/not-found.tsx'),
```
- Khi thực thi lệnh build prerender: React Router 7 biên dịch đường dẫn tĩnh `/404` sử dụng component `routes/static-404.tsx` (có nội bộ Route ID là `routes/static-404`). Tập tin HTML kết quả được lưu tại `build/client/404.html`.
- Khi người dùng hoặc bot truy cập URL không hợp lệ (ví dụ: `GET /khong-ton-tai`): Máy chủ tĩnh phân phát nội dung của `404.html`.
- Trình duyệt tải file JavaScript client của React Router 7. Client Router phân tích URL hiện tại trên thanh địa chỉ là `/khong-ton-tai`.
- Client Router so khớp URL `/khong-ton-tai` với bảng định tuyến và xác định nó khớp với rule `route('*', 'routes/not-found.tsx')` (Route ID là `routes/not-found`).
- **Điểm gãy:** React 19 Hydration phát hiện HTML trên trang mang dấu vết hydration của Route `routes/static-404`, trong khi Client Router đang cố gắng mount Route `routes/not-found`. Do Route ID và cây Component khác nhau, React 19 lập tức phát sinh **Minified React Error #418** và buộc phải hủy bỏ hydration để render lại từ đầu (client-side recovery)!

#### B. Thiếu cơ chế SPA Rewrite cho các tham số động:
- Các route động như `/cau-chuyen/:slug` không thể prerender trước tất cả các slug khả dĩ nếu không có dữ liệu tĩnh cố định.
- Trên máy chủ tĩnh, khi không có cấu hình rewrite cho các đường dẫn này, request bị xem là không tồn tại và trả về `404.html`.
- Nhưng khi JavaScript client nạp vào, nó nhận ra đây là URL hợp lệ của `StoryDetailRoute` (`routes/story-detail.tsx`). Cố gắng hydrate một cây DOM của trang chi tiết vào cấu trúc HTML của trang 404 gây ra hydration crash thảm khốc.

---

## II. GIẢI PHÁP TRIỆT ĐỂ ĐÃ THỰC THI TRONG HARDENING 02

Để xóa bỏ hoàn toàn lỗi #418 và bảo đảm tính toàn vẹn 100% của kiến trúc, Antigravity đã thực hiện giải pháp 3 lớp:

### 1. Hợp nhất thành Một Route NotFound Duy Nhất (Single Unified NotFound Route)
- **Xóa bỏ hoàn toàn tập tin `app/routes/static-404.tsx`**.
- Trong `app/routes.ts`, chỉ duy trì một route bắt lỗi duy nhất:
  ```ts
  // app/routes.ts
  route('*', 'routes/not-found.tsx'),
  ```
- Trong `react-router.config.ts`, tiếp tục prerender URL tĩnh `'/404'`:
  ```ts
  async prerender() {
    return [
      '/',
      '/gioi-thieu',
      '/doi-ngu',
      '/co-so-vat-chat',
      '/dat-lich',
      '/dich-vu',
      '/bang-gia',
      '/cau-chuyen',
      '/bai-viet',
      '/chinh-sach',
      '/khieu-nai',
      '/tai-khoan',
      '/404', // Khớp trực tiếp với route('*', 'routes/not-found.tsx')
    ];
  }
  ```
- **Hiệu quả:** Cả quá trình prerender trang 404 và quá trình client khớp URL không tồn tại (`*`) đều dùng chung 100% Route Module ID (`routes/not-found`) và chung một component cây DOM. React 19 hydrate hoàn hảo mà không gặp bất kỳ sự sai lệch nào.

### 2. Thiết lập cơ chế SPA Rewrite cho các Route Động (`__spa-fallback.html`)
- React Router 7 khi build sinh ra tập tin `build/client/__spa-fallback.html` dành riêng cho chế độ SPA thuần túy. Trong tập tin này:
  ```html
  <script>window.__reactRouterContext = { ..., isSpaMode: true };</script>
  ```
  Tập tin này không chứa DOM SSR tĩnh của một trang cụ thể mà đóng vai trò là vỏ nạp SPA (shell loader).
- Cấu hình rewrites trong `vercel.json` và máy chủ simulator nội bộ:
  ```json
  {
    "rewrites": [
      { "source": "/tai-khoan/(.*)", "destination": "/__spa-fallback.html" },
      { "source": "/cau-chuyen/(.*)", "destination": "/__spa-fallback.html" },
      { "source": "/bai-viet/(.*)", "destination": "/__spa-fallback.html" }
    ]
  }
  ```
- Khi truy cập trực tiếp các route động: Máy chủ trả về HTTP 200 kèm `__spa-fallback.html`. Client React Router khởi động ở chế độ SPA, tự động kết xuất component mong muốn (`StoryDetailRoute`, `ComingSoonView`) mà không cần hydrate đè lên bất kỳ DOM tĩnh nào, loại bỏ hoàn toàn khả năng xảy ra lỗi mismatch.

### 3. Tự động hóa tạo `404.html` qua Postbuild Script
- Sau khi React Router prerender xong, postbuild script trong `package.json` tự động sao chép:
  `build/client/404/index.html` -> `build/client/404.html`
- Khi Vercel hoặc máy chủ tĩnh phát hiện URL không khớp bất kỳ file tĩnh nào và không khớp rewrite, nó sẽ phân phát `build/client/404.html` với mã trạng thái HTTP 404 chuẩn của web.

---

## III. BẰNG CHỨNG KIỂM CHỨNG TỰ ĐỘNG BẰNG PLAYWRIGHT

Tập tin kiểm thử `tests/spike/test-hydration-404.cjs` đã được xây dựng và chạy trực tiếp bằng Playwright Chromium headless. Script lắng nghe sự kiện `console` (log, warn, error) và sự kiện `pageerror` (unhandled exceptions).

### Kết quả chạy thực tế:
```text
=== STARTING PLAYWRIGHT HYDRATION & 404 VERIFICATION ===
Server listening on http://127.0.0.1:4173

Testing: http://127.0.0.1:4173/khong-ton-tai
  HTTP Status: 404
  Page Title: 404 — Không tìm thấy trang | Bệnh viện Thú y Lê Sơn
  Heading: 404 - Không tìm thấy trang
  Console Errors: 0
  Hydration 418: CLEAN (0 errors)

Testing: http://127.0.0.1:4173/quan-ly/lich-truc
  HTTP Status: 404
  Page Title: 404 — Không tìm thấy trang | Bệnh viện Thú y Lê Sơn
  Heading: 404 - Không tìm thấy trang
  Console Errors: 0
  Hydration 418: CLEAN (0 errors)

Testing: http://127.0.0.1:4173/dich-vu/slug-khong-ton-tai
  HTTP Status: 404
  Page Title: 404 — Không tìm thấy trang | Bệnh viện Thú y Lê Sơn
  Heading: 404 - Không tìm thấy trang
  Console Errors: 0
  Hydration 418: CLEAN (0 errors)

Testing: http://127.0.0.1:4173/cau-chuyen/ca-dieu-tri-01
  HTTP Status: 200
  Page Title: Chi Tiết Câu Chuyện Điều Trị | Bệnh viện Thú y Lê Sơn
  Console Errors: 0
  Hydration 418: CLEAN (0 errors)

Testing: http://127.0.0.1:4173/bai-viet/cham-soc-mua-mua
  HTTP Status: 200
  Page Title: Bài Viết | Bệnh viện Thú y Lê Sơn
  Console Errors: 0
  Hydration 418: CLEAN (0 errors)

Testing: http://127.0.0.1:4173/tai-khoan
  HTTP Status: 200
  Page Title: Cổng quản lý hồ sơ thú cưng — Bệnh viện Thú y Lê Sơn
  Console Errors: 0
  Hydration 418: CLEAN (0 errors)

Testing: http://127.0.0.1:4173/tai-khoan/
  HTTP Status: 200
  Page Title: Cổng quản lý hồ sơ thú cưng — Bệnh viện Thú y Lê Sơn
  Console Errors: 0
  Hydration 418: CLEAN (0 errors)

Testing: http://127.0.0.1:4173/tai-khoan/lich-hen
  HTTP Status: 200
  Page Title: Cổng quản lý hồ sơ thú cưng — Bệnh viện Thú y Lê Sơn
  Console Errors: 0
  Hydration 418: CLEAN (0 errors)

=== ALL HYDRATION & 404 TESTS PASSED! ZERO REACT 418 ERRORS DETECTED. ===
```

### Kết luận:
Lỗi React Hydration Error #418 đã được **GIẢI QUYẾT TRIỆT ĐỂ (CLOSED)**. Mọi kịch bản từ 404 động, dynamic slug đến portal route đều phản hồi mượt mà, sạch bóng lỗi console, bảo đảm trải nghiệm người dùng hoàn hảo và tiêu chuẩn kỹ thuật khắt khe.
