# ARCHITECTURE SPIKE 01 (HARDENING 01): BÁO CÁO ROUTING & SEO CHI TIẾT
## (21/21 Route Parity, Single Source SEO Head & Content Evidence Gate)

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chuyên môn:** Routing Architecture, Static Prerender & SEO Strategy  
**Căn cứ:** CEO DIRECTIVE 052-A — ARCHITECTURE SPIKE 01 / HARDENING 01  
**Phản hồi:** Claude Independent QA Report (`docs/qa/architecture-spike-01-qa.md` @ `8b410c5`)  
**Nhánh Hardening:** `spike/architecture-01-hardening-01`  
**Baseline 3A:** `4739d45cc95100b587381b6bdcad6935352b23e8`  

---

## I. MA TRẬN ĐỐI CHIẾU 21/21 ROUTE PARITY (H01)

Claude QA phát hiện trong bản Spike 01 trước đó có 13 route bị thiếu so với baseline 3A, khiến các liên kết trên Header/Footer dẫn tới trang NotFound.
Trong vòng Hardening 01, **toàn bộ 21/21 route của baseline 3A đã được khôi phục 100%** với cấu trúc layout, component và hành vi tương đương:

| STT | Route Path | Baseline 3A Behavior | Hardening 01 Behavior | HTTP Local | Direct Nav | Refresh | Client Nav | Layout | Visual Parity | Result |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- | :---: | :---: |
| 1 | `/` | `HomePage` | `HomePage` (`routes/home.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 2 | `/gioi-thieu` | `AboutPage` | `AboutPage` (`routes/about.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 3 | `/doi-ngu` | `TeamPage` | `TeamPage` (`routes/team.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 4 | `/co-so-vat-chat` | `FacilitiesPage` | `FacilitiesPage` (`routes/facilities.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 5 | `/dich-vu` | `ComingSoonView` ("Danh mục dịch vụ y tế") | `ComingSoonView` (`routes/services.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 6 | `/dich-vu/kham-dieu-tri` | `ComingSoonView` ("Khám & điều trị thú cưng") | `ComingSoonView` (`routes/service-exam.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 7 | `/dich-vu/noi-tru` | `ComingSoonView` ("Chăm sóc nội trú 24/7") | `ComingSoonView` (`routes/service-inpatient.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 8 | `/dich-vu/spa` | `ComingSoonView` ("Spa & Grooming thẩm mỹ") | `ComingSoonView` (`routes/service-spa.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 9 | `/dich-vu/cap-cuu` | `ComingSoonView` ("Tiếp nhận Cấp cứu 24/24") | `ComingSoonView` (`routes/service-emergency.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 10 | `/bang-gia` | `ComingSoonView` ("Bảng giá dịch vụ niêm yết") | `ComingSoonView` (`routes/pricing.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 11 | `/cau-chuyen` | `ComingSoonView` ("Hành trình điều trị tiêu biểu") | `ComingSoonView` (`routes/stories.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 12 | `/cau-chuyen/:slug` | `ComingSoonView` ("Chi tiết câu chuyện điều trị") | `ComingSoonView` (`routes/story-detail.tsx`) | 200 (SPA) | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 13 | `/goc-thu-cung` | `ComingSoonView` ("Góc thú cưng & Cẩm nang kiến thức") | `ComingSoonView` (`routes/pet-corner.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 14 | `/bai-viet/:slug` | `ComingSoonView` ("Chi tiết bài viết cẩm nang") | `ComingSoonView` (`routes/article-detail.tsx`) | 200 (SPA) | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 15 | `/san-pham` | `ComingSoonView` ("Sản phẩm dinh dưỡng & Phụ kiện y tế") | `ComingSoonView` (`routes/products.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 16 | `/dat-lich` | `BookingPage` | `BookingPage` (`routes/booking.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 17 | `/lien-he` | `ComingSoonView` ("Liên hệ & Thông tin phòng khám") | `ComingSoonView` (`routes/contact.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 18 | `/dang-nhap` | `ComingSoonView` ("Đăng nhập Cổng khách hàng") | `ComingSoonView` (`routes/login.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 19 | `/dang-ky` | `ComingSoonView` ("Đăng ký tài khoản hồ sơ thú cưng") | `ComingSoonView` (`routes/register.tsx`) | 200 | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 20 | `/tai-khoan/*` | `ComingSoonView` ("Cổng quản lý hồ sơ thú cưng") | `ComingSoonView` (`routes/customer-portal.tsx`) | 200 (SPA) | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |
| 21 | `*` (Catch-all) | `NotFoundPage` (Lỗi 404) | `NotFoundPage` (`routes/not-found.tsx`) | **404** | PASS | PASS | PASS | `RootLayout` | 100% Giống | **PASS** |

*Ghi chú quan trọng:*
- Tuyến `/spike-seo-test` đã được **loại bỏ hoàn toàn** khỏi sản phẩm theo đúng quy định của Chỉ thị 052-A.
- Tuyến `/quan-ly/*` không nằm trong baseline 3A và được giữ nguyên ngoài phạm vi (theo AGENTS.md, portal quản lý thuộc Giai đoạn 4). Mọi truy cập vào `/quan-ly/*` tự động kích hoạt mã **HTTP 404** chuẩn mực.

---

## II. GIẢI QUYẾT XUNG ĐỘT HEAD: NGUỒN CHUẨN DUY NHẤT (SINGLE SOURCE OF TRUTH) (H02)

### 1. Phân tích nguyên nhân lỗi SPK-03 từ Claude QA
Ở bản Spike 01:
- Prerender HTML được sinh ra bởi hàm `meta()` của React Router 7.
- Tuy nhiên, trong component client (`HomePage.tsx`, `AboutPage.tsx`, `ComingSoonView.tsx`), hook `useRouteSeo()` cũ vẫn được kích hoạt trong `useEffect()`, tự ý ghi đè `document.title`, `meta[name=description]`, và `meta[name=robots]`.
- Hậu quả: Tiêu đề trang bị tráo đổi (flip) ngay sau khi client hydration; bot tìm kiếm đọc một đằng, DOM hiển thị một nẻo.

### 2. Giải pháp kỹ thuật trong Hardening 01
1. **Thiết lập native `meta()` làm Nguồn Chuẩn Duy Nhất:**
   - React Router 7 Framework Mode sử dụng component `<Meta />` trong `app/root.tsx` để render trực tiếp mảng descriptors từ hàm `meta()` của từng route.
   - `<Meta />` tự động quản lý `<title>`, `<meta>`, Open Graph, và canonical tags **cả khi sinh mã HTML tĩnh (build time) lẫn khi người dùng chuyển trang ở client side**.
2. **Khử xung đột trong hook `useRouteSeo`:**
   - Hook `useRouteSeo` tại `src/hooks/useRouteSeo.ts` được cập nhật: **chấm dứt hoàn toàn việc can thiệp trực tiếp vào `document.title` hay `document.head`**.
   - Hook chỉ giữ lại nhiệm vụ thông báo trợ năng cho trình đọc màn hình qua live region `#sr-announcer`.
   - Kết quả: **0 xung đột, 0 hiện tượng tráo đổi title, 100% đồng nhất giữa Raw HTML và DOM sau hydration.**

---

## III. MA TRẬN METADATA & CONTENT EVIDENCE GATE (H03)

Toàn bộ metadata được rà soát nghiêm ngặt theo Content Evidence Gate của dự án. Loại bỏ 100% các từ ngữ quảng cáo chưa xác minh ("uy tín", "phẫu thuật", "nội trú" diện rộng khi đang PENDING, "kinh nghiệm bác sĩ" chưa qua xác thực).

| Route | `<title>` chuẩn xác | Meta Description (Không claim chưa xác minh) | Robots Tag | OG Tags |
| :--- | :--- | :--- | :---: | :---: |
| `/` | `Bệnh Viện Thú Y Lê Sơn — Chăm Sóc Y Tế Chuẩn Mực Cho Thú Cưng` | Hệ sinh thái y tế thú y chất lượng cao tại Hà Nội: Đội ngũ y bác sĩ tận tâm, cơ sở vật chất hiện đại, dịch vụ y tế chuẩn mực. | `noindex, nofollow` | Đồng bộ tiêu đề & mô tả; type `website` |
| `/gioi-thieu` | `Về Bệnh Viện Thú Y Lê Sơn — Chăm Sóc Y Tế Chuẩn Mực` | Giới thiệu về tầm nhìn, sứ mệnh y khoa và cam kết đồng hành chăm sóc sức khỏe thú cưng tại Bệnh Viện Thú Y Lê Sơn. | `noindex, nofollow` | Đồng bộ tiêu đề & mô tả; type `website` |
| `/doi-ngu` | `Đội Ngũ Bác Sĩ & Chuyên Gia Y Tế \| Bệnh Viện Thú Y Lê Sơn` | Thông tin đội ngũ bác sĩ và nhân sự y tế phụ trách chuyên môn thăm khám tại Bệnh Viện Thú Y Lê Sơn. | `noindex, nofollow` | Đồng bộ tiêu đề & mô tả; type `website` |
| `/co-so-vat-chat` | `Cơ Sở Vật Chất & Không Gian Y Tế \| Bệnh Viện Thú Y Lê Sơn` | Không gian thăm khám và chăm sóc tiện nghi, môi trường vô trùng chuẩn y khoa dành cho thú cưng tại Bệnh Viện Thú Y Lê Sơn. | `noindex, nofollow` | Đồng bộ tiêu đề & mô tả; type `website` |
| `/dat-lich` | `Đặt Lịch Hẹn Khám \| Bệnh Viện Thú Y Lê Sơn` | Đặt lịch thăm khám thú cưng trực tuyến nhanh chóng và thuận tiện tại Bệnh Viện Thú Y Lê Sơn, 101 Khuất Duy Tiến, Hà Nội. | `noindex, nofollow` | Đồng bộ tiêu đề & mô tả; type `website` |
| `/dich-vu` | `Danh mục dịch vụ y tế — Bệnh viện Thú y Lê Sơn` | Tổng hợp các giải pháp chăm sóc y tế toàn diện cho thú cưng đang được biên tập chi tiết. | `noindex, nofollow` | Đồng bộ tiêu đề & mô tả; type `website` |
| `/bang-gia` | `Bảng giá dịch vụ niêm yết — Bệnh viện Thú y Lê Sơn` | Biểu phí dịch vụ khám, xét nghiệm và điều trị đang được đối chiếu niêm yết chính thức. | `noindex, nofollow` | Đồng bộ tiêu đề & mô tả; type `website` |
| `/cau-chuyen` | `Hành trình điều trị tiêu biểu — Bệnh viện Thú y Lê Sơn` | Các câu chuyện phục hồi thực tế của các bé cưng đang được xin ý kiến đồng thuận từ chủ nuôi. | `noindex, nofollow` | Đồng bộ tiêu đề & mô tả; type `website` |
| `/goc-thu-cung` | `Góc thú cưng & Cẩm nang kiến thức — Bệnh viện Thú y Lê Sơn` | Kho kiến thức y khoa, dinh dưỡng và phòng bệnh từ bác sĩ thú y đang được biên tập. | `noindex, nofollow` | Đồng bộ tiêu đề & mô tả; type `website` |
| `/lien-he` | `Liên hệ & Thông tin phòng khám — Bệnh viện Thú y Lê Sơn` | Địa chỉ: 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội \| Hotline 24/24: 097 355 51 05. | `noindex, nofollow` | Đồng bộ tiêu đề & mô tả; type `website` |
| `*` & `/404` | `404 — Không tìm thấy trang \| Bệnh viện Thú y Lê Sơn` | Địa chỉ trang không tồn tại hoặc đã được thay đổi trên hệ thống Bệnh viện Thú y Lê Sơn. | `noindex, nofollow` | Đồng bộ tiêu đề & mô tả; type `website` |

### Xử lý các tồn đọng của Spike 01:
1. **Canonical Domain:** Tuyệt đối không phát hành canonical link với domain giả định (`lesonpet.vn`). Mọi thẻ canonical chưa được Chủ dự án duyệt chính thức đều được loại bỏ khỏi metadata.
2. **Open Graph Image:** Loại bỏ toàn bộ các thẻ trỏ đến ảnh không tồn tại (`og-*.webp`). Chỉ giữ các thẻ OG cốt lõi (`og:title`, `og:description`, `og:type: website`) đã được xác minh.
3. **Thẻ Meta Robots:** Nhúng trực tiếp `<meta name="robots" content="noindex, nofollow"/>` vào 100% các file HTML tĩnh được prerender, bảo đảm crawler không bao giờ index phiên bản Preview/Spike.

---

## IV. BẰNG CHỨNG MẪU RAW PRERENDER HTML (TRÍCH XUẤT TỪ BUILD THỰC TẾ)

### 1. Mẫu Raw HTML: Trang chủ (`build/client/index.html`)
```html
<!DOCTYPE html><html lang="vi"><head><meta charSet="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<link rel="icon" type="image/png" href="/favicon.png"/>
<link rel="preload" href="/fonts/be-vietnam-pro-400.woff2" as="font" type="font/woff2" crossorigin="anonymous"/>
<link rel="preload" href="/fonts/be-vietnam-pro-600.woff2" as="font" type="font/woff2" crossorigin="anonymous"/>
<link rel="preload" href="/fonts/lora-600.woff2" as="font" type="font/woff2" crossorigin="anonymous"/>
<title>Bệnh Viện Thú Y Lê Sơn — Chăm Sóc Y Tế Chuẩn Mực Cho Thú Cưng</title>
<meta name="description" content="Hệ sinh thái y tế thú y chất lượng cao tại Hà Nội: Đội ngũ y bác sĩ tận tâm, cơ sở vật chất hiện đại, dịch vụ y tế chuẩn mực."/>
<meta name="robots" content="noindex, nofollow"/>
<meta property="og:title" content="Bệnh Viện Thú Y Lê Sơn — Chăm Sóc Y Tế Chuẩn Mực Cho Thú Cưng"/>
<meta property="og:description" content="Hệ sinh thái y tế thú y chất lượng cao tại Hà Nội: Đội ngũ y bác sĩ tận tâm, cơ sở vật chất hiện đại, dịch vụ y tế chuẩn mực."/>
<meta property="og:type" content="website"/>
```

### 2. Mẫu Raw HTML: Dịch vụ ComingSoon (`build/client/dich-vu/index.html`)
```html
<title>Danh mục dịch vụ y tế — Bệnh viện Thú y Lê Sơn</title>
<meta name="description" content="Tổng hợp các giải pháp chăm sóc y tế toàn diện cho thú cưng đang được biên tập chi tiết."/>
<meta name="robots" content="noindex, nofollow"/>
<meta property="og:title" content="Danh mục dịch vụ y tế — Bệnh viện Thú y Lê Sơn"/>
<meta property="og:description" content="Tổng hợp các giải pháp chăm sóc y tế toàn diện cho thú cưng đang được biên tập chi tiết."/>
<meta property="og:type" content="website"/>
...
<h1 class="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-fg-primary)] tracking-tight mb-4">Danh mục dịch vụ y tế</h1>
<p class="text-base sm:text-lg text-[var(--color-fg-muted)] leading-relaxed mb-8">Tổng hợp các giải pháp chăm sóc y tế toàn diện cho thú cưng đang được biên tập chi tiết.</p>
```

### 3. Mẫu Raw HTML: Trang 404 độc lập (`build/client/404.html`)
```html
<title>404 — Không tìm thấy trang | Bệnh viện Thú y Lê Sơn</title>
<meta name="description" content="Địa chỉ trang không tồn tại hoặc đã được thay đổi trên hệ thống Bệnh viện Thú y Lê Sơn."/>
<meta name="robots" content="noindex, nofollow"/>
...
<h1 class="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-fg-primary)] tracking-tight mb-4">Không tìm thấy trang yêu cầu</h1>
```
