# ARCHITECTURE DECISION RECORD (ADR)
# ADR-20261103: DUY TRÌ KIẾN TRÚC SSG + SPA FALLBACK CHO DYNAMIC ROUTES TRONG GIAI ĐOẠN PHÁT TRIỂN NỘI BỘ

- **Mã định danh:** `ADR-20261103-ROUTING-HTTP404`
- **Dự án:** Bệnh viện Thú y Lê Sơn (`lqt140304-rgb/webchinhthuc`)
- **Trạng thái:** **PROPOSED — AWAITING OWNER APPROVAL** *(Chờ Chủ dự án xem xét và phê duyệt)*
- **Tác giả đề xuất:** Antigravity (Senior Product Designer & Frontend Developer)
- **Đơn vị phối hợp & Review:** ChatGPT (CEO Điều phối), Claude (Independent QA Reviewer)
- **Ngày lập:** 03/11/2026
- **Phiên bản:** 1.1 *(Hiệu chỉnh toàn diện theo 6 nhận xét đánh giá của Claude QA)*
- **Baseline Git SHA:** `7829a7226552e345382e39f2a7ab5539f92e85ca`
- **Nhánh áp dụng:** `antigravity/public-content-batch3b-20261102`
- **Tài liệu tham chiếu:**
  - `ROUTING_HTTP404_TECHNICAL_SPIKE_REPORT.md` *(Báo cáo thực nghiệm kỹ thuật của Antigravity)*
  - `claude-qa-adr-http404-review.md` *(Đánh giá QA của Claude đối với bản thảo ADR)*
  - `docs/spikes/architecture-01/hardening-02/hydration-404-analysis.md` *(Phân tích lỗi Hydration #418 tại Hardening 02)*

---

## 1. Ngữ cảnh & Vấn đề Kỹ thuật (Context & Problem Statement)

Trong kiến trúc hiện hành của dự án Bệnh viện Thú y Lê Sơn (React Router 7 Framework Mode, Static Site Generation `ssr: false`):

### 1.1. Phân bổ 19 Route Prerender Tĩnh
Trong file cấu hình `react-router.config.ts`, hàm `prerender()` chỉ định danh sách cố định gồm **19 static routes**:
- 5 trang giới thiệu & liên hệ: `/`, `/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat`, `/lien-he`.
- 6 trang dịch vụ y tế & bảng giá: `/dich-vu`, `/dich-vu/kham-dieu-tri`, `/dich-vu/noi-tru`, `/dich-vu/spa`, `/dich-vu/cap-cuu`, `/bang-gia`.
- 3 trang danh mục & thông tin: `/cau-chuyen`, `/goc-thu-cung`, `/san-pham`.
- 4 trang đặt lịch & cổng tài khoản: `/dat-lich`, `/dang-nhap`, `/dang-ky`, `/tai-khoan`.
- 1 trang lỗi tĩnh dùng chung: `/404` (kết xuất ra tập tin `build/client/404.html`).

Tất cả 19 route này được biên dịch trước thành các file HTML tĩnh độc lập (`build/client/<route>/index.html`), nạp ở chế độ SSG (`isSpaMode: false`), tải nhanh và không phát sinh lỗi hydration mismatch.

### 1.2. Cơ chế SPA Fallback cho các Dynamic Routes
Các nhóm route động chứa tham số đường dẫn:
- `/cau-chuyen/:slug` (Chi tiết câu chuyện điều trị)
- `/bai-viet/:slug` (Chi tiết bài viết cẩm nang thú cưng)
- `/tai-khoan/*` (Cổng quản lý hồ sơ khách hàng)

Do không nằm trong danh sách 19 route prerender cố định, các route này được cấu hình rewrite nội bộ sang file vỏ SPA:
```json
"rewrites": [
  { "source": "/tai-khoan/(.*)", "destination": "/__spa-fallback" },
  { "source": "/cau-chuyen/(.*)", "destination": "/__spa-fallback" },
  { "source": "/bai-viet/(.*)", "destination": "/__spa-fallback" }
]
```
Máy chủ phân phát file vỏ tĩnh `build/client/__spa-fallback.html` (`isSpaMode: true`). Tại trình duyệt, bundle JavaScript của React Router khởi động, trích xuất tham số slug từ thanh địa chỉ và kết xuất component chi tiết ở chế độ Single Page Application (SPA).

### 1.3. Hiện tượng Soft-404 đối với các Dynamic Slug không tồn tại
Khi người dùng hoặc bot truy cập trực tiếp một slug không tồn tại (ví dụ: `GET /cau-chuyen/slug-khong-ton-tai` hoặc `GET /bai-viet/slug-khong-ton-tai`):
- Biểu thức chính quy rewrite khớp với đường dẫn, máy chủ phân phát file tĩnh `__spa-fallback.html`.
- Theo đặc tả HTTP tiêu chuẩn của web server/CDN, thao tác rewrite phục vụ file tĩnh nội bộ luôn trả về **mã trạng thái HTTP 200 OK**.
- Trình duyệt nạp JavaScript client, đối chiếu slug trong bộ dữ liệu mock (`MOCK_STORIES` / `MOCK_ARTICLES`). Khi không tìm thấy dữ liệu, client render component `<NotFoundPage />`.
- **Kết quả thực tế:** Giao diện hiển thị đúng thông báo lỗi 404, tiêu đề trang là `404 — Không tìm thấy trang | Bệnh viện Thú y Lê Sơn`, thẻ meta chứa `robots: "noindex, nofollow"`, nhưng mã trạng thái HTTP mạng ban đầu lại là **HTTP 200**. Đây là hiện tượng **Soft-404**.

### 1.4. Nguyên tắc Trung lập về Nền tảng Hosting
Cấu hình hiện tại được mô hình hóa và kiểm thử theo quy chuẩn của file `vercel.json` phục vụ môi trường kiểm thử nội bộ. Tuy nhiên, kiến trúc dự án duy trì tính **hoàn toàn trung lập về nền tảng hosting**:
- Production hosting chính thức có thể là Vercel, Cloudflare Pages / Workers, AWS Amplify, Netlify hoặc hạ tầng tự quản lý tùy theo quyết định cuối cùng của Chủ dự án.
- Mọi nhận định về hành vi routing, rewrite và phản hồi HTTP trong tài liệu này phản ánh mô hình kiểm thử hiện hành và **bắt buộc phải được kiểm tra lại trên môi trường hosting đích thực tế được phê duyệt**.

---

## 2. Kết quả Thử nghiệm Kỹ thuật & Các Giả thuyết (Spike Findings & Hypotheses)

### 2.1. Thử nghiệm Phương án Prerender 31 Route + Gỡ Wildcard Rewrite
- **Cách tiến hành:** Bổ sung toàn bộ 12 dynamic slug mẫu (6 câu chuyện + 6 bài viết) vào hàm `prerender()` trong `react-router.config.ts`, đồng thời gỡ bỏ quy tắc rewrite trong cấu hình hosting để máy chủ trả về file tĩnh `404.html` cho bất kỳ slug nào không có file tĩnh sẵn.
- **Hiện tượng ghi nhận qua đo lường thực nghiệm (Playwright):**
  - Mã trạng thái HTTP trả về 404 thật; giao diện hiển thị đúng trang 404.
  - Tuy nhiên, trong console trình duyệt ghi nhận phát sinh lỗi **`Minified React error #418` (Hydration Mismatch)** trên mỗi lượt truy cập trực tiếp (goto) và tải lại trang (reload) đối với slug không tồn tại.
- **Giả thuyết kỹ thuật về nguyên nhân lỗi:**
  - *Giả thuyết 1 (Route Module ID Mismatch):* File tĩnh tải về là `404.html` (được prerender từ module `routes/not-found.tsx`). Trong khi đó, thanh địa chỉ là `/cau-chuyen/slug-khong-ton-tai`, khiến Client Router so khớp với `routes/story-detail.tsx`. Sự sai lệch giữa route module ID tĩnh và route module client có thể kích hoạt cơ chế hydration bailout.
  - *Giả thuyết 2 (Markup Stream & Preload Module Mismatch):* Cấu trúc thẻ `<head>` của `404.html` chứa các thẻ `modulepreload` và dữ liệu stream đặc thù của `routes/not-found`. Khi client tải module `routes/story-detail` và tiến hành so khớp Virtual DOM với SSR DOM có sẵn, sự bất đồng nhất về cấu trúc phần tử đã dẫn đến lỗi React #418.
  - *Kết luận thực nghiệm:* Dù chưa cô lập tuyệt đối 100% cơ chế nội tại của React, hiện tượng lỗi #418 đã được tái hiện ổn định trong môi trường test Playwright và vi phạm trực tiếp assertion kiểm thử hồi quy: `assert.deepEqual(errors, [], 'browser errors including hydration #418')`.

### 2.2. Đánh giá Phương án Server-Side Rendering (SSR) / Edge Middleware
> [!NOTE]
> **ĐÁNH DẤU TÌNH TRẠNG: HYPOTHESIS / NOT TESTED**  
> *(Đây là giả thuyết kiến trúc lý thuyết, chưa qua kiểm thử thực tế trên hệ thống)*

- **Mô tả giả thuyết:** Bật `ssr: true` hoặc sử dụng Edge Middleware (Cloudflare Workers / Vercel Edge Functions) để kiểm tra tính hợp lệ của slug tại tầng máy chủ trước khi phục vụ HTML:
  - Nếu slug tồn tại: Trả về HTTP 200 kèm HTML render sẵn.
  - Nếu slug không tồn tại: Chủ động trả về phản hồi **HTTP 404 thật** kèm SSR ErrorBoundary đồng bộ.
- **Kỳ vọng lý thuyết:** Phương án này về mặt lý thuyết có khả năng cung cấp HTTP 404 thực tế đồng thời loại trừ lỗi hydration do server và client cùng chung một trạng thái lỗi.
- **Yêu cầu bắt buộc trước khi áp dụng:**
  - Do chưa từng được kiểm thử thực tế trong dự án, phương án này **bắt buộc phải có một Technical Spike độc lập** để đo lường và đánh giá:
    1. Mã trạng thái HTTP và tính tương thích hydration của React Router 7 SSR khi throw 404 Response.
    2. Độ trễ khởi động lạnh (Cold-start latency) của Serverless / Edge Function.
    3. Mức độ phức tạp khi kết nối với backend API y tế và cơ sở dữ liệu thực.
    4. Chi phí hạ tầng vận hành (Serverless invocations quota / billing).

---

## 3. Quyết định Đề xuất (Proposed Decision)

> [!IMPORTANT]
> **ĐỀ XUẤT CỦA ANTIGRAVITY:**  
> **TẠM THỜI GIỮ NGUYÊN CẤU HÌNH SSG (19 STATIC PRERENDER ROUTES) + SPA FALLBACK TRONG GIAI ĐOẠN PHÁT TRIỂN NỘI BỘ HIỆN TẠI.**

### Chi tiết các điểm quyết định:

1. **Giữ nguyên cấu hình kỹ thuật hiện tại:**
   - Tiếp tục duy trì **19 static routes prerender** trong `react-router.config.ts`.
   - Tiếp tục duy trì **3 quy tắc rewrite SPA fallback** (`/tai-khoan/(.*)`, `/cau-chuyen/(.*)`, `/bai-viet/(.*)`) trong cấu hình hosting.
   - Không can thiệp hoặc sửa đổi cấu hình routing trên nhánh sản phẩm `antigravity/public-content-batch3b-20261102` trong đợt này.

2. **Đánh giá đúng mức về tác động SEO của Soft-404:**
   - Việc trang slug sai trả về mã HTTP 200 kèm thẻ meta `noindex, nofollow` và header `X-Robots-Tag: noindex, nofollow` là giải pháp giảm thiểu tạm thời, **không đồng nghĩa và không thể thay thế hoàn toàn cho mã trạng thái HTTP 404 chuẩn**.
   - Các công cụ tìm kiếm vẫn ghi nhận các trang này là Soft-404 nếu thu thập dữ liệu. Trong giai đoạn phát triển nội bộ và staging preview, toàn bộ domain đang được gắn cờ `noindex`, do đó nguy cơ lập chỉ mục công khai được kiểm soát.
   - Tuy nhiên, hiện tượng Soft-404 là một vấn đề kỹ thuật còn tồn đọng **bắt buộc phải được giải quyết triệt để trước khi phát hành chính thức (Public Launch)**.

3. **Bắt buộc đánh giá lại trước khi phát hành công khai (Mandatory Re-assessment):**
   - Quyết định duy trì SSG + SPA fallback chỉ có hiệu lực trong phạm vi **giai đoạn phát triển nội bộ (Internal Development / Staging)**.
   - Dự án **bắt buộc phải tổ chức đánh giá lại toàn diện** cơ chế xử lý HTTP 404 trước thời điểm:
     - Gỡ bỏ cờ `noindex, nofollow` để bật chỉ mục tìm kiếm công khai (SEO Indexing).
     - Phát hành chính thức website lên môi trường Production (Public Launch).

---

## 4. Cổng Kiểm Soát Phát Hành Chính Thức (Production Release Gate)

Để đảm bảo tính nghiêm ngặt về chất lượng sản phẩm trước khi ra mắt công chúng, việc xử lý HTTP 404 thực tế được xác lập thành một tiêu chí bắt buộc trong **Release Gate** của dự án:

> [!CAUTION]
> ### TIÊU CHÍ BẮT BUỘC TRONG PRODUCTION RELEASE GATE
> 1. **Mã HTTP 404 thực cho Dynamic Slugs:** Tất cả các dynamic slug không tồn tại tại Câu chuyện (`/cau-chuyen/:slug`), Bài viết (`/bai-viet/:slug`) và Cổng khách hàng (`/tai-khoan/*`) khi truy cập trực tiếp bằng HTTP GET đều phải nhận được mã trạng thái **HTTP 404 thực sự** từ máy chủ/edge.
> 2. **Mã HTTP 404 thực cho Catch-all URLs:** Bất kỳ đường dẫn ngẫu nhiên nào không tồn tại trên toàn site phải trả về mã trạng thái **HTTP 404 thực sự**.
> 3. **Tuyệt đối sạch lỗi Console & Hydration:** Không phát sinh bất kỳ lỗi runtime, warning hoặc lỗi hydration mismatch nào (bao gồm cả React Error #418 / #423) khi truy cập trực tiếp (direct access) hoặc tải lại trang (reload/F5).
> 4. **Kiểm thử tự động trên Hosting Đích:** Bộ kiểm thử tự động phải được thực thi và vượt qua 100% trên chính **môi trường hosting production được phê duyệt** (kiểm thử từ xa thực tế, không chỉ dựa vào simulator cục bộ).
> 5. **Kiểm tra Responsive trên 7 Viewports:** Giao diện 404 và toàn bộ trang công khai phải được kiểm tra hiển thị không tràn ngang, đạt kích thước touch target tối thiểu 44x44px trên **7 viewports tiêu chuẩn** (320px, 360px, 390px, 768px, 1366px, 1440px, 1920px).
> 6. **Điều kiện bật SEO Indexing:** **Tuyệt đối không gỡ bỏ `noindex, nofollow`** và không cho phép bot tìm kiếm index website trước khi hoàn thành đầy đủ các tiêu chí Release Gate trên và được Chủ dự án nghiệm thu nội dung thực tế.

---

## 5. Phạm vi của các Bộ Kiểm Thử Tự Động Hiện Hành

Dự án tiếp tục duy trì hai bộ kiểm thử hồi quy tự động độc lập với phân định rõ ràng về phạm vi chức năng:

1. **Bộ kiểm thử Hợp đồng Định tuyến (`tests/spike/test-vercel-routing.cjs`):**
   - *Mục tiêu:* Kiểm tra tính hợp lệ của cấu hình hosting, sự tồn tại của 19 file prerender tĩnh, 3 quy tắc rewrite SPA fallback, header bảo mật `X-Robots-Tag: noindex, nofollow`, cờ `isSpaMode` trong ngữ cảnh Router, và phát hiện lỗi console/hydration mismatch khi điều hướng direct/reload.
   - *Phạm vi hiển thị:* Chạy ở kích thước viewport mặc định của trình duyệt headless.

2. **Bộ kiểm thử Giao diện & Độ tương thích Đa kích thước (`tests/spike/test-public-pages-phase1.cjs`):**
   - *Mục tiêu:* Kiểm tra toàn vẹn cấu trúc DOM, tính duy nhất của thẻ `<main id="main-content">`, tiêu đề `H1`, tiêu đề Document Title chuẩn `404 — Không tìm thấy trang | Bệnh viện Thú y Lê Sơn`, liên kết hotline cấp cứu `tel:0973555105`, thẻ meta SEO, FAQ accordion accessibility, và Product modal focus trap.
   - *Phạm vi hiển thị:* Bắt buộc lặp qua và xác minh tính tương thích responsive trên **7 viewports tiêu chuẩn**:
     - Mobile XS: `320px`
     - Mobile Android: `360px`
     - Mobile Modern: `390px`
     - Tablet Portrait: `768px`
     - Laptop Standard: `1366px`
     - Desktop Standard: `1440px`
     - Desktop Full HD: `1920px`

---

## 6. Bảng So sánh Hệ quả Kỹ thuật (Consequences Matrix)

| Tiêu chí Đánh giá | Phương án Baseline Hiện tại (ADR Đề xuất) | Phương án Prerender 31 Route (Đã thử nghiệm & Bác bỏ) | Phương án SSR / Edge Gateway *(HYPOTHESIS / NOT TESTED)* |
| :--- | :--- | :--- | :--- |
| **HTTP Status slug sai** | 200 (Soft-404) | 404 thật | *Kỳ vọng lý thuyết: 404 thật* |
| **Giao diện 404 (UI/UX)** | Hiển thị 404 chuẩn, nút home, hotline | Hiển thị 404 chuẩn | *Kỳ vọng lý thuyết: Hiển thị 404 chuẩn* |
| **Lỗi Hydration Console** | **0 lỗi (Đã xác minh thực tế)** | **Phát sinh React Error #418** ❌ | *Kỳ vọng lý thuyết: 0 lỗi (Cần spike)* |
| **Tương thích Test Suites** | **100% PASS (10/10 suites)** | **FAIL** test assertion & console check | *Cần cập nhật test suite môi trường* |
| **Tác động SEO giai đoạn này** | Tạm thời kiểm soát qua `noindex` | Đạt chuẩn qua HTTP 404 | *Kỳ vọng lý thuyết: Đạt chuẩn* |
| **Khả năng mở rộng CMS** | Tốt (Thêm slug không cần sửa build) | Kém (Mỗi slug mới phải rebuild tĩnh) | *Tối ưu cho cơ sở dữ liệu động* |
| **Độ phức tạp hạ tầng** | 0 (Hosting tĩnh thuần túy) | 0 (Hosting tĩnh thuần túy) | *Cao (Cần runtime, adapter, cache)* |
| **Chi phí vận hành** | 0 VNĐ (CDN tĩnh) | 0 VNĐ (CDN tĩnh) | *Có phát sinh chi phí serverless/edge* |
| **Mức độ an toàn Giai đoạn 3** | **Tuyệt đối an toàn (Không rủi ro)** | Rủi ro cao gây lỗi hydration | *Chưa sẵn sàng triển khai* |

---

## 7. Quy trình Phê duyệt & Các bước Tiếp theo

1. **Bàn giao tài liệu:** Antigravity lập bản hiệu chỉnh ADR này và bàn giao tới Chủ dự án (Project Owner) và CEO Điều phối (ChatGPT).
2. **Quyền quyết định tối cao:** Trạng thái văn bản là **PROPOSED — AWAITING OWNER APPROVAL**. Chỉ có Chủ dự án mới có quyền chuyển trạng thái sang **ACCEPTED** hoặc yêu cầu điều chỉnh thêm.
3. **Kỷ luật dự án:**
   - Tuyệt đối không tự ý sửa cấu hình hosting hay routing khi chưa có phê duyệt.
   - Không deploy, không merge vào nhánh `main`.
   - Không mở giai đoạn phát triển mới khi chưa hoàn thành nghiệm thu.
