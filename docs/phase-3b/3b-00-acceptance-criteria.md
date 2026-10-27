# TIÊU CHÍ NGHIỆM THU GIAI ĐOẠN 3B — PHIÊN BẢN V1.0 (PHASE 3B-00 ACCEPTANCE CRITERIA)
## Bệnh viện Thú y Lê Sơn 2026 — Tiêu Chí Đánh Giá Thiết Kế, Kiểm Thử & Điều Kiện Phát Hành

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 038-A (Section IX & X)**; `AGENTS.md` (Architecture Baseline V1) |
| **Bản chất tài liệu** | **QA ACCEPTANCE CRITERIA & VERIFICATION PROTOCOL** (Khung tiêu chí kiểm định độc lập) |
| **Giai đoạn** | **3B-00: DOCUMENTATION ONLY — KHÔNG CODE / KHÔNG DEPLOY** |
| **Đơn vị thẩm định** | Claude — Independent QA Lead |

---

## 1. MƯỜI LĂM (15) CỔNG KIỂM TRA ĐẠT CHUẨN (CORE ACCEPTANCE GATES)

Mọi đánh giá QA độc lập đối với Giai đoạn 3B phải dựa trên 15 tiêu chí có thể kiểm chứng bằng công cụ định lượng:

| STT | Cổng kiểm tra (Gate) | Tiêu chí đánh giá PASS | Phương pháp kiểm chứng | Đánh giá 3B-00 |
|---|---|---|---|---|
| **1** | **Giới hạn phạm vi 2 tuyến đường** | Chỉ tồn tại đúng hai tuyến đường: `/dich-vu` và `/bang-gia`. Không phát sinh bất kỳ tuyến đường con nào ngoài phạm vi. | Kiểm tra Sitemap và Routes. | **ĐẠT (Đặc tả chuẩn)** |
| **2** | **Không mở trang chi tiết `/dich-vu/:slug`** | Tuyệt đối không tạo file, route hoặc mockup cho trang chi tiết dịch vụ. Các liên kết chi tiết dẫn về anchor trên `/dich-vu`. | Quét cây route & sitemap. | **ĐẠT (Đã khóa phạm vi)** |
| **3** | **Không tự tạo giá / Không giá giả** | Không xuất hiện bất kỳ con số tiền tệ tự bịa đặt nào trên giao diện công khai. Không hiển thị `0 VNĐ` cho dữ liệu thiếu. | Quét text render & biểu phí. | **ĐẠT (Quy chuẩn Price Lock)** |
| **4** | **Không khẳng định claim PENDING là sự thật** | Mọi nội dung chưa xác minh về phác đồ, danh mục chi tiết đều có nhãn trung tính `[Đề xuất]` hoặc `[Dự kiến]`. | Kiểm tra Content Mapping & Text. | **ĐẠT (Tuân thủ Content Lock)** |
| **5** | **Trạng thái hiển thị trung tính khi thiếu thông tin** | Dịch vụ chưa có giá bắt buộc mang nhãn `Đang cập nhật biểu phí niêm yết` hoặc `Báo giá sau khám lâm sàng`. | Kiểm tra trạng thái `ServicePrice`. | **ĐẠT (Đặc tả 4 trạng thái giá)** |
| **6** | **Khả năng điều khiển Accordion & Tab bằng bàn phím** | Hỗ trợ đầy đủ phím `Enter`, `Space`, `ArrowDown`, `ArrowUp`, `Home`, `End`. Có thuộc tính `aria-expanded`, `aria-controls`. | Test tương tác bàn phím (WAI-ARIA). | **ĐẠT (Đặc tả chi tiết)** |
| **7** | **Đặc tả đầy đủ Tìm kiếm & Empty State** | Có đặc tả ô search, lọc kết quả, giao diện khi không tìm thấy kết quả và nút xóa bộ lọc. Không để layout bị sập. | Kiểm tra kịch bản tìm kiếm rỗng. | **ĐẠT (Đặc tả chi tiết)** |
| **8** | **Tương thích toàn diện 6 Viewports** | Bố cục chuẩn xác trên 320px, 375px, 768px, 1024px, 1440px, 1920px. Không có lỗi tràn ngang (zero horizontal overflow). | Playwright viewport snapshot. | **ĐẠT (Ma trận 6 điểm ngắt)** |
| **9** | **Vùng chạm tối thiểu $44 \times 44\text{px}$** | Mọi nút bấm, tab lọc, hàng accordion trigger đạt kích thước tối thiểu $\ge 44\times 44\text{px}$ trên thiết bị di động. | Playwright bounding box check. | **ĐẠT (Ma trận vùng chạm)** |
| **10**| **Hỗ trợ giảm thiểu chuyển động (Reduced Motion)** | Khi bật `prefers-reduced-motion`, toàn bộ animation accordion và cuộn mượt chuyển sang tức thì (`duration: 0.01ms`). | CSS Media query evaluation. | **ĐẠT (Đặc tả chuyển động)** |
| **11**| **Không phát sinh CLS mới ($\text{CLS} \le 0.10$)** | Container danh sách bảng giá có `min-height` cố định, fallback route `min-h-screen`, CLS trên mọi trang đạt $\approx 0.000$. | Đo đạc PerformanceObserver. | **ĐẠT (Kế thừa giải pháp 3A)** |
| **12**| **Bảo toàn hiệu năng Trang chủ & Bundle isolation** | Dùng `React.lazy()` cô lập `/dich-vu` và `/bang-gia`. Không tải kèm module dashboard hoặc thư viện nặng vào bundle trang chủ. | Bundle analyzer & Vite chunk check. | **ĐẠT (Kiến trúc phân tách)** |
| **13**| **Không hồi quy Giai đoạn 3A và Mốc 2B** | 6 section Trang chủ, trang `/dat-lich`, và 3 trang 3A (`/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat`) giữ nguyên 100%. | Pixel diff & text integrity. | **ĐẠT (Không can thiệp code cũ)** |
| **14**| **Không thay đổi Dashboard Portal** | Không đụng chạm tới `/tai-khoan/*` hoặc `/quan-ly/*`. Giữ nguyên ranh giới phân vùng theo Architecture Baseline V1. | Kiểm tra routing & imports. | **ĐẠT (Cô lập tuyệt đối)** |
| **15**| **Bảo toàn chế độ bảo vệ Preview & Noindex** | Bản Preview giữ nguyên `X-Robots-Tag: noindex, nofollow`, Vercel SSO Authentication. Không mở index ra công chúng. | HTTP Response Header test. | **ĐẠT (Nguyên tắc bảo vệ)** |

---

## 2. PHÂN ĐỊNH HAI CẤP ĐỘ NGHIỆM THU (ACCEPTANCE LEVELS)

Nhằm đảm bảo quy trình rõ ràng, minh bạch giữa các vòng công việc, tài liệu phân định rõ hai cấp độ nghiệm thu:

### Cấp độ A: Nghiệm thu Thiết kế & Tài liệu Giai đoạn 3B-00 (Hiện tại)
- **Điều kiện PASS:**
  1. Đầy đủ 5 tài liệu thành phần trong thư mục `docs/phase-3b/`:
     - `3b-00-blueprint.md`
     - `3b-00-content-mapping.md`
     - `3b-00-data-schema.md`
     - `3b-00-wireframe.md`
     - `3b-00-acceptance-criteria.md`
  2. Tuyệt đối không can thiệp vào mã nguồn website (`src/`), assets hay cấu hình dependencies.
  3. Không thực hiện lệnh triển khai (deploy), không merge `main`.
  4. Nội dung thiết kế phản ánh trung thực trạng thái xác minh, bảo vệ tính trung thực y khoa.

### Cấp độ B: Nghiệm thu Phát hành Production (Tương lai — Phải có phê duyệt riêng từ Chủ dự án)
- **Điều kiện tiên quyết trước khi phát hành công chúng:**
  1. Chủ dự án và Bác sĩ chuyên môn ký duyệt văn bản Biểu phí chính thức.
  2. Thay thế toàn bộ nhãn `[Đề xuất]`, `[Dự kiến]`, `UNAVAILABLE` bằng số liệu giá và danh mục đã được xác minh.
  3. Có văn bản bản quyền và quyền sử dụng hình ảnh thực tế (AP-1, 2B-06).
  4. Giải quyết các tồn đọng kỹ thuật cốt lõi (Soft 404, LCP mobile).
  5. Chủ dự án phê duyệt riêng lệnh gỡ `noindex`, merge vào `main` và deploy Production.

---

## 3. DANH MỤC CÁC VẤN ĐỀ TỒN ĐỌNG KHÔNG THUỘC PHẠM VI 3B-00 (BACKLOG REGISTRY)

Tuân thủ nghiêm ngặt **Mục X của CEO Directive 038-A**, các vấn đề dưới đây được ghi nhận chính thức vào sổ tồn đọng (backlog) và **KHÔNG LÀM ĐIỀU KIỆN CHẶN** việc hoàn thành tài liệu 3B-00:

| Mã tồn đọng | Vấn đề tồn đọng | Trạng thái hiện tại | Hướng xử lý theo lộ trình |
|---|---|---|---|
| **DEV01P-P2-2** | LCP mobile 3 trang 3A đạt 3.2–3.5s (chưa có preload chunk) | **OPEN** | Sẽ tối ưu hóa kèm việc xử lý tải trước (preload/prefetch) trong giai đoạn tối ưu hiệu năng toàn trang. |
| **2B-08** | LCP mobile Trang chủ phụ thuộc hình ảnh | **OPEN** | Đã có giải pháp preload thẻ `hero-vet-care-400w.webp`, tiếp tục tinh chỉnh trong giai đoạn tối ưu. |
| **Soft 404** | Route không tồn tại trả về mã HTTP 200 thay vì 404 thật | **OPEN** | Thuộc về cấu hình máy chủ web / edge rewrite trong giai đoạn bàn giao hạ tầng. |
| **2B-06** | Xác minh quyền sở hữu và bản quyền ảnh chụp cơ sở vật chất | **PENDING** | Chờ chủ dự án cung cấp ảnh chụp cơ sở thực tế và văn bản giấy phép. |
| **2B-29** | Logo Champion trong ảnh `why-pet-companion.webp` | **OPEN** | Đã khóa (frozen) theo chỉ đạo, không tự ý chỉnh sửa ảnh gốc. |
| **SEO Production** | Kiểm thử lập chỉ mục và schema SEO trên môi trường Production | **PENDING** | Chỉ kiểm tra khi có quyết định phát hành công khai chính thức từ chủ dự án. |
| **DEV01F-P3-1** | Lưới tablet 768–799px hiển thị 1 cột | **OPEN** | Sẽ gom sửa cùng các tinh chỉnh responsive khác. |
| **DEV01Q-P3-1** | Class `.visible` dư khi chạy build trên checkout đầy đủ | **OPEN** | Do Tailwind quét thư mục `tests/`, đã được loại trừ khi upload qua `.vercelignore`. |
| **Footer Phrase** | Cụm từ "phẫu thuật ngoại khoa" trong Footer | **PENDING** | Chờ xác minh giấy phép phẫu thuật chính thức từ phòng khám. |

---

**KẾT THÚC BẢNG TIÊU CHÍ NGHIỆM THU 3B-00 (ACCEPTANCE CRITERIA V1.0)**
