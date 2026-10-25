# Mục đích và kế hoạch dự án — Bệnh viện Thú y Lê Sơn

## 1. Cách sử dụng và nguồn thông tin

ChatGPT, Claude và Antigravity phải đọc tài liệu này cùng [AGENTS.md](AGENTS.md) trước khi giao việc, triển khai hoặc review. Mục tiêu là giữ đúng định hướng dự án khi chuyển agent, nhánh hoặc Git worktree.

Bản tổng hợp ngày 25/10/2026 dựa trên các tài liệu đã có trong repo tại commit `dee5c16a839cbe648e318545dda3fecffd5cc15b` và chỉ dẫn phân vai của người dùng. Đây là bản tóm tắt định hướng và kế hoạch hiện có, không phải kế hoạch xây dựng mới hay xác nhận nghiệm thu.

Lịch sử cuộc trò chuyện “Chọn model Antigravity” truy xuất được chỉ chứa một phần nội dung; các câu trả lời cũ hiển thị dưới dạng tham chiếu và nội dung file đính kèm không được trả về đầy đủ. Vì vậy, tài liệu này không khẳng định đã khôi phục toàn bộ yêu cầu gốc. Các chi tiết chưa có bằng chứng phải được xác nhận trước khi triển khai hoặc công bố.

## 2. Mục đích sản phẩm

Xây dựng website đa trang cho **Bệnh viện Thú y Lê Sơn**, độc lập với repository cũ theo báo cáo hiện có, phục vụ chủ nuôi thú cưng và thể hiện nhận diện chuyên nghiệp, ấm áp, đáng tin cậy.

Từ sitemap, thiết kế và kế hoạch trong repo, mục tiêu sử dụng được tổng hợp như sau:
- Giúp chủ nuôi hiểu bệnh viện, đội ngũ, cơ sở vật chất, dịch vụ và chi phí.
- Giúp khách tìm nhanh hotline, đường đi và gửi yêu cầu đặt lịch; phân biệt rõ yêu cầu đã tiếp nhận với lịch khám đã được xác nhận.
- Trình bày câu chuyện điều trị và kiến thức chăm sóc có nguồn, minh bạch nội dung minh họa.
- Ở giai đoạn sau, cung cấp cổng khách hàng để xem dữ liệu thú cưng, lịch hẹn và thông tin được duyệt chia sẻ, bảo vệ dữ liệu nội bộ và dữ liệu của khách hàng khác.

Thành công không chỉ là giao diện đẹp: website phải điều hướng được, dùng được trên di động và bàn phím, không tạo thông tin y khoa hay trạng thái đặt lịch giả, và hoàn thành từng mốc có nghiệm thu.

## 3. Định hướng thiết kế và các ràng buộc cần giữ

Theo [design-system.md](docs/design-system.md):
- Phong cách **Vibrant Editorial Luxury**: bố cục editorial, ảnh lớn giàu cảm xúc, Bento và khung ảnh bất đối xứng; cảm hứng AURA được mô tả cho Hero trong kế hoạch.
- Màu chủ đạo Plum, nền Ivory/Lavender; Warm Orange dành cho cấp cứu và hotline.
- Font tiếng Việt **Be Vietnam Pro** và **Lora**.
- Dùng `src/styles/tokens.css` làm nguồn design token; Tailwind cho layout/responsive, CSS Modules cho thành phần editorial và hiệu ứng riêng.
- Chuyển động có chọn lọc, tôn trọng `prefers-reduced-motion`; không tự thêm thư viện animation nặng.

Nội dung hành chính đang được tài liệu repo sử dụng: **101 Khuất Duy Tiến**, hotline **097 355 51 05**, giờ khám tham chiếu **08:00–21:00**, cấp cứu **24/24**. Đây là dữ liệu kế thừa từ repo, chưa được tái xác minh bên ngoài trong lần tổng hợp này. Không tự sửa hoặc thêm tuyên bố “chuẩn quốc tế”, bằng cấp, số năm kinh nghiệm, số liệu hài lòng, giá hay ca bệnh thật khi chưa có nguồn được duyệt.

## 4. Phạm vi và lộ trình 5 giai đoạn

Nguồn tiến độ chi tiết: [implementation-plan.md](docs/implementation-plan.md). Trạng thái dưới đây là trạng thái được tài liệu ghi nhận, không thay cho review độc lập.

| Giai đoạn/mốc | Đầu ra và phạm vi | Trạng thái theo kế hoạch hiện có |
| --- | --- | --- |
| 1 — Nền tảng | Kiến trúc, design tokens, sitemap/phân quyền, SEO, mô hình trạng thái đặt lịch | Ghi nhận đã hoàn tất và được phê duyệt |
| 2A — Khung đa trang | Routing tập trung, RootLayout, Header/Footer, menu desktop/mobile, logo, ComingSoon và 404 | **Chưa đạt — chờ sửa sau review QA của Claude** |
| 2B — Trang chủ | Sáu section theo bảng bên dưới; responsive và kiểm tra tương tác | Ghi nhận đã hoàn tất, **chờ duyệt** |
| 3 — Trang con | Giới thiệu, đội ngũ, cơ sở vật chất, dịch vụ/chi tiết, bảng giá, câu chuyện/chi tiết, góc thú cưng/bài viết, sản phẩm, đặt lịch đầy đủ; đối chiếu thêm trang liên hệ trong sitemap | Chỉ bắt đầu sau khi giai đoạn 2 được duyệt; dừng duyệt trước giai đoạn 4 |
| 4 — Tích hợp và cổng khách hàng | Form có API, kiểm tra dữ liệu, xác thực/database khi được cho phép, các trang tài khoản theo ma trận phân quyền | Chờ duyệt giai đoạn 3 và quyết định giải pháp tích hợp |
| 5 — QA và bàn giao | Responsive, a11y, hiệu năng/Core Web Vitals, SEO, báo cáo QA và nghiệm thu | Chưa có bằng chứng hoàn thành trong nguồn đã đọc |

### Sáu section trang chủ của mốc 2B

| Section | Nội dung cần giữ |
| --- | --- |
| 1 — Hero | “Khi bé không khỏe, bạn không phải lo một mình.”; mô tả, hai CTA và ba khung ảnh editorial |
| 2 — Vì sao chọn Lê Sơn | Chuyên môn & Trách nhiệm; Tận tâm & Lắng nghe; Theo dõi & Chăm sóc minh bạch; banner cấp cứu |
| 3 — Dịch vụ tiêu biểu | Khám & điều trị, nội trú 24/7, Spa & Grooming; liên kết tất cả dịch vụ và cấp cứu |
| 4 — Câu chuyện nổi bật | Hành trình phục hồi minh họa, ba giai đoạn; nhãn minh họa rõ ràng, không lộ y lệnh nội bộ |
| 5 — Góc kiến thức & Tin tức | Ba thẻ bài viết editorial, phân biệt bản mẫu với nội dung chính thức |
| 6 — Đặt lịch & Liên hệ | Địa chỉ, hotline, giờ khám, bản đồ; form demo phải thông báo chưa kết nối và không báo gửi thành công giả |

**Điểm dừng hiện tại:** không suy diễn “đã push code” thành “đã được duyệt”. Báo cáo mốc 2B nói đã hoàn thành và sẵn sàng cho giai đoạn 3, nhưng kế hoạch yêu cầu dừng chờ phê duyệt. Cần có kết luận review và quyết định của người dùng trước khi mở giai đoạn tiếp theo.

## 5. Các quy tắc nghiệp vụ không được làm sai

### Đặt lịch

Theo [architecture.md](docs/architecture.md), luồng có sáu trạng thái: `idle`, `submitting`, `failed`, `received`, `awaiting_confirmation`, `confirmed`.

- Kiểm tra dữ liệu trước khi gửi; ngăn gửi trùng khi đang xử lý; giữ dữ liệu khi lỗi.
- Sau API tiếp nhận thành công, chỉ thông báo đã nhận yêu cầu và nhân viên sẽ liên hệ xác nhận thời gian phù hợp.
- Client không tự chuyển sang `confirmed` sau khi bấm gửi. Chỉ hiển thị xác nhận chính thức từ backend sau quy trình xác nhận của bệnh viện.
- Khi chưa tích hợp API/database, giữ thông báo demo minh bạch và hướng khách tới hotline.

### Cổng khách hàng

Theo [sitemap.md](docs/sitemap.md), chỉ hiển thị hồ sơ thú cưng, lịch hẹn, lịch tái khám/tiêm chủng do bác sĩ chỉ định, báo cáo sức khỏe, nhật ký/video nội trú được duyệt chia sẻ và lịch sử đơn hàng theo quyền của tài khoản.

Không đưa tên thuốc nội bộ, liều lượng, thời điểm/kỹ thuật tiêm, y lệnh, ghi chú nghiệp vụ, audit log hoặc dữ liệu của khách hàng khác ra cổng khách hàng. Kiểm tra phân quyền ở backend, không chỉ ẩn thành phần trên giao diện.

### Điều hướng, nội dung và SEO

- Route đã quy hoạch nhưng chưa có nội dung dùng ComingSoon với điều hướng an toàn và hotline; URL không tồn tại dùng trang 404 riêng.
- Trang chờ có `noindex, nofollow`; chỉ đưa trang đủ điều kiện vào sitemap XML. Theo chiến lược hiện có, giai đoạn này sitemap XML chỉ gồm trang chủ.
- Metadata, canonical và schema theo [seo-strategy.md](docs/seo-strategy.md); không tự bịa tọa độ, thông tin bệnh viện hoặc thành tích.
- Đội ngũ, bảng giá, ảnh cơ sở và ca bệnh chính thức cần nguồn được duyệt; nội dung mẫu phải có nhãn.

## 6. Công việc cụ thể tiếp theo cho từng vai

1. **ChatGPT — CEO:** điều phối sửa mốc 2A theo [giao việc cho Anti](docs/ANTIGRAVITY_2A_FIX_BRIEF.md) và [báo cáo QA của Claude](docs/qa/bao-cao-kiem-tra-2A.md); chưa chuyển sang giai đoạn 3. Sau khi sửa và review lại 2A, tiếp tục nghiệm thu riêng 2B.
2. **Claude — QA reviewer:** đọc các nguồn ở mục 8, kiểm tra mốc 2A/2B trên commit được giao, lập báo cáo lỗi có vị trí, cách tái hiện và mức độ ảnh hưởng. Kiểm chứng riêng các tuyên bố trong báo cáo cũ.
3. **Antigravity — designer/developer:** sửa các lỗi cần sửa trong phạm vi mốc đang xét, giữ định hướng thiết kế và ràng buộc nghiệp vụ, bàn giao commit mới và kết quả kiểm tra.
4. **Claude:** review lại thay đổi; **ChatGPT:** tổng hợp kết luận cho người dùng quyết định nghiệm thu.
5. Chỉ sau khi được duyệt mới chia nhiệm vụ giai đoạn 3; mỗi trang cần nguồn nội dung, trạng thái triển khai và tiêu chí nghiệm thu riêng.

## 7. Tiêu chí Claude cần kiểm tra trước khi đề xuất nghiệm thu

- Đúng định hướng thiết kế, đầy đủ khung đa trang và sáu section; nội dung/CTA phù hợp kế hoạch.
- Menu, dropdown, drawer, liên kết và 404 hoạt động; bàn phím, focus trap, Escape, trả focus và khóa/khôi phục cuộn được kiểm tra thực tế.
- Không tràn ngang hoặc mất nội dung tại **320, 390, 768, 1366, 1440px**; ghi lại viewport thực tế, không chỉ tên bài test.
- Chạy `npm run lint` và `npm run build` trên đúng commit, ghi kết quả thực tế; build đã bao gồm TypeScript theo `package.json`.
- Kiểm tra ảnh/logo, tương phản, focus và giảm chuyển động; không dùng kết quả build để suy ra UI/a11y đã đạt.
- Form demo không tạo xác nhận giả; ca mẫu/bài mẫu có nhãn; không có dữ liệu nội bộ hoặc tuyên bố thiếu nguồn.
- Trang chờ và metadata tuân thủ chiến lược SEO.
- Báo cáo ghi commit, môi trường, kiểm tra đã chạy, lỗi còn lại và phần chưa kiểm chứng.

**Lưu ý về bằng chứng cũ:** [milestone-2b-report.md](docs/milestone-2b-report.md) ghi PASS cho bài test “320px” nhưng số đo `innerWidth` là **369px**. Kết quả đó chưa chứng minh bố cục đạt ở 320px; Claude cần chạy lại đúng viewport. Toàn bộ PASS trong báo cáo là kết quả được báo cáo trước đây, chưa được tái chạy trong lần tạo tài liệu này.

## 8. Thứ tự đọc bắt buộc và cách cập nhật

**Cập nhật 26/10/2026:** Báo cáo QA lần 3 của Claude tại SHA `c2e5361` kết luận 2A chưa đạt, ghi nhận 8 lỗi P1 cùng các lỗi P2/P3. Đây là báo cáo do người dùng cung cấp, chưa được ChatGPT chạy lại kiểm thử. Trạng thái 2A ở trên thay thế ghi nhận nghiệm thu cũ. Đọc [báo cáo QA](docs/qa/bao-cao-kiem-tra-2A.md), [ảnh bằng chứng](docs/qa/README.md) và [file giao việc sửa](docs/ANTIGRAVITY_2A_FIX_BRIEF.md) trước khi tiếp tục. 2B vẫn chờ duyệt; chưa bắt đầu giai đoạn 3.

1. [AGENTS.md](AGENTS.md) — phân vai, quyền quyết định, phối hợp worktree.
2. [PROJECT_BRIEF.md](PROJECT_BRIEF.md) — mục đích, kế hoạch và tiêu chí tổng hợp này.
3. [docs/implementation-plan.md](docs/implementation-plan.md) — đầu việc, tiến độ và điểm dừng nghiệm thu.
4. [docs/design-system.md](docs/design-system.md) — định hướng hình ảnh và token.
5. [docs/sitemap.md](docs/sitemap.md) — route và ma trận phân quyền.
6. [docs/architecture.md](docs/architecture.md) — kiến trúc và FSM đặt lịch.
7. [docs/seo-strategy.md](docs/seo-strategy.md) — SEO và indexability.
8. [docs/milestone-2b-report.md](docs/milestone-2b-report.md) — báo cáo để đối chiếu với code và kiểm chứng.

Chỉ dẫn trực tiếp và quyết định mới của người dùng được ưu tiên. Khi có mâu thuẫn chưa được giải quyết giữa tài liệu, ghi rõ để ChatGPT điều phối, không tự chọn cách làm làm thay đổi mục tiêu. Cập nhật brief và kế hoạch trong cùng đợt thay đổi khi phạm vi hoặc trạng thái nghiệm thu đổi; đồng bộ qua Git theo AGENTS.md. File được tạo không có nghĩa Claude hoặc Antigravity đã thực sự đọc.
