# TIÊU CHÍ NGHIỆM THU GIAI ĐOẠN 3B — PHIÊN BẢN V1.3 (PHASE 3B-00 ACCEPTANCE CRITERIA)
## Bệnh viện Thú y Lê Sơn 2026 — Khung Tiêu Chí Đánh Giá Phân Tầng Đa Giai Đoạn

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 046-A**; `docs/phase-3b/3b-00-content-evidence-gate.md`; `docs/decisions/3b-dec-12-13-policy-record.md`; Báo cáo Claude QA Fix 02 `docs/qa/3b-00-fix02-qa.md` (Commit: `e0bdeec`) |
| **Bản chất tài liệu** | **MULTI-TIER QA ACCEPTANCE CRITERIA FRAMEWORK** (Khung tiêu chí kiểm định độc lập phân tầng) |
| **Giai đoạn áp dụng** | Xuyên suốt từ **3B-00 (Tài liệu)** $\to$ **3B-01 (Mockup)** $\to$ **DEV-01 (Code)** $\to$ **Preview** $\to$ **Production** |
| **Trạng thái tài liệu** | **CHỜ CHỦ DỰ ÁN PHÊ DUYỆT (PENDING OWNER APPROVAL)** |

---

## 1. NGUYÊN TẮC PHÂN TẦNG TIÊU CHÍ (THE 5-TIER QA HIERARCHY)

Để đảm bảo tính khách quan và khoa học, hệ thống tiêu chí nghiệm thu được phân chia thành **5 cấp độ kiểm định độc lập**. Không một giai đoạn nào được tự ý đánh dấu PASS hoặc tự nhận đã hoàn thành các cổng kiểm thử của các giai đoạn sau:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      HỆ THỐNG KIỂM ĐỊNH 5 CẤP ĐỘ                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
[ CẤP ĐỘ 1: TÀI LIỆU ]     [ CẤP ĐỘ 2: MOCKUP ]           [ CẤP ĐỘ 3: CODE ]
Kiểm tra tính nhất quán     Kiểm tra thị giác trực quan   Kiểm tra TypeScript, Lint,
Content Lock, Schema        & tương tác HTML tĩnh         Build bundle, Unit tests, SEO
(Giai đoạn 3B-00)           (Giai đoạn 3B-01)             (Giai đoạn DEV-01)
                                    │
                                    ├───────────────────────────────┐
                                    ▼                               ▼
                           [ CẤP ĐỘ 4: PREVIEW ]          [ CẤP ĐỘ 5: PRODUCTION ]
                           Kiểm tra Vercel deployment,    Văn bản ký duyệt biểu phí,
                           CLS, SSO Protection, Noindex   ảnh thật, gỡ noindex
                           (Giai đoạn Preview QA)         (Phát hành công khai)
```

---

## 2. MA TRẬN TIÊU CHÍ CHI TIẾT TỪNG CẤP ĐỘ

### Cấp độ 1: Tiêu chí Nghiệm thu Tài liệu Thiết kế (Documentation QA Gate — 3B-00)

| Mã ID | Mục tiêu kiểm tra | Điều kiện PASS định lượng | Bằng chứng cần kiểm | Trách nhiệm | Trạng thái thẩm định |
|---|---|---|---|---|---|
| **AC-DOC-01** | Giới hạn phạm vi 2 tuyến đường | Chỉ đặc tả đúng hai tuyến đường: `/dich-vu` và `/bang-gia`. Không phát sinh tuyến chi tiết `/dich-vu/:slug`. | Kiểm tra Sitemap & Blueprint §1. | Antigravity / Claude | **NOT TESTED (Chờ QA)** |
| **AC-DOC-02** | Phân loại Content Evidence Gate | 100% các mục trong Content Mapping được phân loại chính xác: Đúng 3 VERIFIED (`DV-EMG-01`, `DV-EMG-03`, `BG-CTA-03`), 64 PENDING, 1 ILLUSTRATIVE (tổng 68 mục). Các mục VERIFIED có đủ 5 yếu tố theo Content Evidence Gate. | Quét bảng Content Mapping. | Antigravity / Claude | **NOT TESTED (Chờ QA)** |
| **AC-DOC-03** | Bảo vệ danh tính Bác sĩ | 0 trường hợp tự gán chuyên khoa phẫu thuật, kíp mổ hay máy gây mê cho BS. Lê Thái Sơn khi chưa có văn bản duyệt. | Grep `"Lê Thái Sơn"`, `"BS. Sơn"`. | Antigravity / Claude | **NOT TESTED (Chờ QA)** |
| **AC-DOC-04** | Ngăn claim 3A tái xuất hiện | 0 trường hợp khẳng định sự thật về: "phân khu cách ly", "phòng mổ vô trùng", "trực đêm", "theo dõi sinh hiệu", "máy gây mê". | Grep các từ khóa cơ sở vật chất. | Antigravity / Claude | **NOT TESTED (Chờ QA)** |
| **AC-DOC-05** | Quy tắc bảo vệ giá (Price Lock) | Không có giá giả, không dùng `0 VNĐ`, các dịch vụ chưa có giá bắt buộc mang nhãn `UNAVAILABLE` hoặc `CONTACT`. | Kiểm tra Data Schema & Wireframe. | Antigravity / Claude | **NOT TESTED (Chờ QA)** |
| **AC-DOC-06** | Thống nhất Taxonomy & Slug | Sử dụng cùng 5 nhóm danh mục và cùng bộ slug trên cả 5 tài liệu 3B (`kham-dieu-tri`, `can-lam-sang`, `phau-thuat`, `noi-tru`, `spa-grooming`). | Đối chiếu chéo 5 file tài liệu. | Antigravity / Claude | **NOT TESTED (Chờ QA)** |
| **AC-DOC-07** | Trung tính hóa Fixture | Fixtures có cờ `testOnly: true`, `isPublished: false`, 0 tên người thật, 0 thiết bị tự tạo, dùng placeholder `[Số tiền niêm yết]`. | Quét file `3b-00-data-schema.md`. | Antigravity / Claude | **NOT TESTED (Chờ QA)** |
| **AC-DOC-08** | Khai báo phụ thuộc ngoài phạm vi | Liệt kê đầy đủ 3 phụ thuộc ngoài phạm vi (`?service=` trên BookingPage, menu Header, liên kết Footer/Home) thành OPEN DECISIONS. | Kiểm tra Blueprint §9. | Antigravity / Claude | **NOT TESTED (Chờ QA)** |
| **AC-DOC-09** | Danh mục OPEN DECISIONS | Đầy đủ ít nhất 14 quyết định mở cần chủ dự án phê duyệt trước khi code (kèm DEC-12, DEC-13 và DEC-14). | Kiểm tra Blueprint §10. | Antigravity / Claude | **NOT TESTED (Chờ QA)** |
| **AC-DOC-10** | Đặc tả SEO Metadata Gate | Đặc tả SEO Metadata Gate không chứa hotline hardcoded; bắt buộc ràng buộc động với `HOSPITAL_CONTACT` trong `src/config/contact.ts`. Tiêu đề, meta description (150 & 137 ký tự), canonical, OG tags, Schema.org LocalBusiness khớp tuyệt đối. | Kiểm tra Blueprint §7. | Antigravity / Claude | **NOT TESTED (Chờ QA)** |
| **AC-DOC-11** | Phân định thẩm quyền (DEC-12/13)| DEC-12 và DEC-13 mang trạng thái `POLICY ACCEPTED IN PRINCIPLE / FORMAL APPROVAL RECORD PENDING`. Phân định rõ 3 quyền (Policy, Verification, Publication). 0 trường hợp AI Agent đứng tên người duyệt trong `verifiedBy` / `approvedBy`. | Quét trường `verifiedBy` trong Mapping và Schema. | Antigravity / Claude | **NOT TESTED (Chờ QA)** |
| **AC-DOC-12** | Nhất quán dữ liệu liên hệ | 100% dữ liệu liên hệ (hotline `097 355 51 05`, địa chỉ `101 Khuất Duy Tiến`, email, giờ mở cửa) trong tài liệu, wireframe, metadata, schema và fixtures khớp tuyệt đối với `HOSPITAL_CONTACT` tại `src/config/contact.ts`. Tuyệt đối không xuất hiện số điện thoại lạ. | Đối chiếu với `src/config/contact.ts`. | Antigravity / Claude | **NOT TESTED (Chờ QA)** |

### Cấp độ 2: Tiêu chí Nghiệm thu Thiết kế & Mockup Trực Quan (Design & Mockup QA Gate — 3B-01)

| Mã ID | Mục tiêu kiểm tra | Điều kiện PASS định lượng | Bằng chứng cần kiểm | Trách nhiệm | Trạng thái thẩm định |
|---|---|---|---|---|---|
| **AC-DES-01** | Trực quan hóa đầy đủ 2 trang | Mockup HTML độc lập hiển thị đầy đủ giao diện desktop và mobile cho `/dich-vu` và `/bang-gia`. | Mở file `phase-3b-mockup.html`. | Antigravity / Claude | **NOT TESTED (Giai đoạn sau)** |
| **AC-DES-02** | Nhãn PENDING trên Mockup | 100% các mục PENDING trên mockup trực quan đều có nhãn `[Đề xuất]`, `[Chờ xác nhận]` hoặc badge `UNAVAILABLE` / `CONTACT`. | Kiểm tra trực quan trên mockup. | Antigravity / Claude | **NOT TESTED (Giai đoạn sau)** |
| **AC-DES-03** | Khung ảnh minh họa | Mọi ảnh minh họa đều có nhãn `Ảnh minh họa dịch vụ`. Không có ảnh stock người mặc áo blouse y tế. | Quét ảnh trên mockup. | Antigravity / Claude | **NOT TESTED (Giai đoạn sau)** |
| **AC-DES-04** | Responsive 6 Viewports | Kiểm tra visual hiển thị hoàn hảo ở 320px, 375px, 768px, 1024px, 1440px, 1920px. Không tràn ngang (overflow = 0). | Playwright visual diff. | Antigravity / Claude | **NOT TESTED (Giai đoạn sau)** |

### Cấp độ 3: Tiêu chí Nghiệm thu Mã Nguồn Triển Khai (Code QA Gate — DEV-01)

| Mã ID | Mục tiêu kiểm tra | Điều kiện PASS định lượng | Bằng chứng cần kiểm | Trách nhiệm | Trạng thái thẩm định |
|---|---|---|---|---|---|
| **AC-COD-01** | TypeScript & Build | `npm run build` (`tsc -b && vite build`) hoàn thành thành công với mã thoát 0, không có warning TypeScript. | Terminal build output log. | Antigravity / Claude | **NOT TESTED (Giai đoạn sau)** |
| **AC-COD-02** | Linter & Code Quality | `npm run lint` (`oxlint`) đạt **0 errors, 0 warnings** trên toàn bộ codebase. | Terminal lint output log. | Antigravity / Claude | **NOT TESTED (Giai đoạn sau)** |
| **AC-COD-03** | Phân tách Bundle (Lazy Loading) | `/dich-vu` và `/bang-gia` được tách thành các dynamic chunks riêng biệt thông qua `React.lazy()`. Không làm phình bundle trang chủ. | Kiểm tra danh sách chunk `dist/`. | Antigravity / Claude | **NOT TESTED (Giai đoạn sau)** |
| **AC-COD-04** | WAI-ARIA Accordion | Hỗ trợ đầy đủ phím `Enter`, `Space`, `ArrowDown`, `ArrowUp`, `Home`, `End`. Có thuộc tính `aria-expanded`, `aria-controls`. | Playwright keyboard interaction test. | Antigravity / Claude | **NOT TESTED (Giai đoạn sau)** |
| **AC-COD-05** | Vùng chạm Touch Target | 100% nút bấm, tab lọc, hàng accordion trigger đạt kích thước tối thiểu $\ge 44\times 44\text{px}$ trên thiết bị di động. | Playwright bounding box audit. | Antigravity / Claude | **NOT TESTED (Giai đoạn sau)** |
| **AC-COD-06** | Hỗ trợ Reduced Motion | Khi kích hoạt `prefers-reduced-motion`, toàn bộ animation accordion và cuộn trang chuyển sang tức thì (`duration: 0.01ms`). | CSS Media query evaluation test. | Antigravity / Claude | **NOT TESTED (Giai đoạn sau)** |
| **AC-COD-07** | Triển khai SEO Metadata & Raw HTML Gate | Thẻ `<title>`, description, canonical, OG tags được chèn đúng chuẩn semantic HTML. Kiểm thử bằng lệnh `curl` / raw HTTP GET không qua JavaScript phải thấy thẻ meta hoặc có giải pháp SSR/Prerender (DEC-14). 0 console errors khi tải trang. | DOM inspection & raw HTML scraper test. | Antigravity / Claude | **NOT TESTED (Giai đoạn sau)** |
| **AC-COD-08** | Bảo vệ tuyến đường & HTTP 404 thực | Mọi đường dẫn con không hỗ trợ như `/dich-vu/:slug`, `/bang-gia/:slug` phải trả về mã trạng thái HTTP 404 thực tế (không chấp nhận Soft 404 mã 200). Không gây crash ứng dụng React. | HTTP status & Navigation test. | Antigravity / Claude | **NOT TESTED (Giai đoạn sau)** |
| **AC-COD-09** | Dynamic Contact Binding | Toàn bộ dữ liệu liên hệ (hotline, địa chỉ, giờ hoạt động) trên trang `/dich-vu` và `/bang-gia` phải được bind động từ `HOSPITAL_CONTACT` trong `src/config/contact.ts`; không được hardcode chuỗi số điện thoại trong component. | Code audit `src/pages/`. | Antigravity / Claude | **NOT TESTED (Giai đoạn sau)** |

### Cấp độ 4: Tiêu chí Nghiệm thu Bản Triển Khai Kiểm Thử (Preview QA Gate)

| Mã ID | Mục tiêu kiểm tra | Điều kiện PASS định lượng | Bằng chứng cần kiểm | Trách nhiệm | Trạng thái thẩm định |
|---|---|---|---|---|---|
| **AC-PRV-01** | Chỉ số CLS (Cumulative Layout Shift) | CLS đạt $< 0.1$ (chuẩn Core Web Vitals của Google; benchmark mục tiêu $0.000$) trên cả 2 trang ở cả môi trường mobile (412px) và desktop (1440px) dưới điều kiện mạng nhanh và chậm. | PerformanceObserver & Lighthouse. | Claude QA | **NOT TESTED (Giai đoạn sau)** |
| **AC-PRV-02** | Bảo vệ Deployment & Noindex | Deployment có cờ `target: null`, Vercel SSO Authentication bật (`302 Found`), header `X-Robots-Tag: noindex, nofollow`. | HTTP Header response test. | Claude QA | **NOT TESTED (Giai đoạn sau)** |
| **AC-PRV-03** | Build Reproducibility | Toàn bộ asset build trên máy chủ Vercel khớp byte-for-byte với bản build cục bộ từ git checkout sạch. | Hash so sánh sha256 từng chunk. | Claude QA | **NOT TESTED (Giai đoạn sau)** |
| **AC-PRV-04** | Zero Regression Mốc 2A/2B/3A | Trang chủ 6 sections, trang `/dat-lich` và 3 trang 3A giữ nguyên 100% layout, pixel diff và chức năng. | Pixel diff snapshot comparison. | Claude QA | **NOT TESTED (Giai đoạn sau)** |
| **AC-PRV-05** | Hiệu năng Core Web Vitals | LCP mobile $\le 2.5\text{s}$, FID/INP $\le 200\text{ms}$, 0 console errors trên Chrome DevTools. | Lighthouse & Web Vitals report. | Claude QA | **NOT TESTED (Giai đoạn sau)** |
| **AC-PRV-06** | Kiểm định Schema.org JSON-LD | 0 phần tử `Offer` nào chứa mức giá chưa xác minh hoặc dịch vụ `PENDING`. Dữ liệu cấu trúc hợp lệ với Schema Validator. | Google Rich Results Test tool. | Claude QA | **NOT TESTED (Giai đoạn sau)** |
| **AC-PRV-07** | Kiểm định Scraper / Raw HTML Trực tiếp | Dùng lệnh `curl` hoặc HTTP Client gửi GET request trực tiếp tới URL preview Vercel: Phải trả về tiêu đề và mô tả SEO hợp lệ hoặc xác minh cơ chế render theo DEC-14. | Raw HTTP GET response inspection. | Claude QA | **NOT TESTED (Giai đoạn sau)** |

### Cấp độ 5: Điều Kiện Tiên Quyết Phát Hành Chính Thức (Production Release Gate)

| Mã ID | Mục tiêu kiểm tra | Điều kiện PASS định lượng | Bằng chứng cần kiểm | Trách nhiệm | Trạng thái thẩm định |
|---|---|---|---|---|---|
| **AC-PRD-01** | Văn bản Biểu phí chính thức | Có văn bản bảng giá niêm yết chính thức có chữ ký và dấu mộc của Bệnh viện Thú y Lê Sơn. | File PDF văn bản ký duyệt. | Chủ dự án | **NOT TESTED (Chờ quyết định)**|
| **AC-PRD-02** | Gỡ bỏ toàn bộ nhãn PENDING | 100% các nhãn `[Đề xuất]`, `[Chờ xác nhận]` và `UNAVAILABLE` được thay thế bằng dữ liệu thật đã xác minh. | Quét toàn bộ DOM render. | Chủ dự án / Claude | **NOT TESTED (Chờ quyết định)**|
| **AC-PRD-03** | Bản quyền hình ảnh thực tế | Có văn bản bàn giao và cấp phép sử dụng hình ảnh thực tế tại 101 Khuất Duy Tiến (thay thế 100% ảnh minh họa). | Hợp đồng / Giấy phép bản quyền. | Chủ dự án | **NOT TESTED (Chờ quyết định)**|
| **AC-PRD-04** | Phê duyệt mở Production | Chủ dự án ký lệnh chính thức cho phép gỡ `noindex`, merge vào nhánh `main` và deploy lên Production domain. | Quyết định bằng văn bản của Owner. | Chủ dự án | **NOT TESTED (Chờ quyết định)**|

---

## 3. SỔ THEO DÕI CÁC TỒN ĐỌNG KỸ THUẬT NGOÀI PHẠM VI 3B-00 (BACKLOG REGISTRY)

Các tồn đọng dưới đây được ghi nhận chính thức theo Mục X của CEO Directive 042-A và **KHÔNG LÀM ĐIỀU KIỆN CHẶN** việc nghiệm thu tài liệu Giai đoạn 3B-00:

| Mã tồn đọng | Nội dung tồn đọng | Trạng thái | Kế hoạch xử lý |
|---|---|---|---|
| **DEV01P-P2-2** | LCP mobile 3 trang 3A đạt 3.2–3.5s (do chunk lazy chưa có preload) | **OPEN** | Sẽ xử lý preload chunk trong giai đoạn tối ưu hiệu năng toàn trang. |
| **2B-08** | LCP mobile Trang chủ phụ thuộc hình ảnh | **OPEN** | Tiếp tục tinh chỉnh trong đợt tối ưu hiệu năng tổng thể. |
| **Soft 404** | Route không tồn tại trả về mã HTTP 200 thay vì 404 thật | **OPEN** | Thuộc cấu hình server / edge router khi bàn giao hạ tầng. |
| **2B-06** | Xác minh quyền sở hữu và bản quyền ảnh chụp cơ sở vật chất | **PENDING** | Chờ chủ dự án cung cấp ảnh chụp thực tế và giấy phép bản quyền. |
| **2B-29** | Logo Champion trong ảnh `why-pet-companion.webp` | **OPEN** | Đã khóa (frozen) theo chỉ đạo, không tự ý can thiệp. |
| **SEO Production** | Kiểm thử index và structured data trên môi trường Production | **PENDING** | Chỉ kiểm tra khi có quyết định phát hành công khai chính thức. |
| **DEV01F-P3-1** | Lưới tablet 768–799px hiển thị 1 cột | **OPEN** | Gom xử lý cùng đợt tinh chỉnh responsive giao diện. |
| **DEV01Q-P3-1** | Class `.visible` dư khi chạy build trên checkout đầy đủ | **OPEN** | Đã xử lý cô lập bằng `.vercelignore` khi upload. |
| **Footer Phrase** | Cụm từ "phẫu thuật ngoại khoa" trong Footer | **PENDING** | Chờ xác minh giấy phép phẫu thuật chính thức từ phòng khám. |

---

**KẾT THÚC BẢNG TIÊU CHÍ NGHIỆM THU PHÂN TẦNG 3B-00 (ACCEPTANCE CRITERIA V1.3)**
