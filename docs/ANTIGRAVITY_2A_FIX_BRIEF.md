# Giao việc Antigravity — sửa mốc 2A sau QA

Ngày giao: 26/10/2026. Người dùng đã yêu cầu ChatGPT lưu hồ sơ QA, cập nhật trạng thái và tạo brief này. Đây là nhiệm vụ sửa lỗi; chưa cho phép bắt đầu giai đoạn 3 hoặc triển khai website.

## 1. Mục tiêu và tài liệu phải đọc

Khắc phục các lỗi của bộ khung đa trang, giữ định hướng thiết kế đã thống nhất và bàn giao cho Claude kiểm tra lại. **2A chưa đạt; 2B vẫn chờ duyệt.**

Đọc theo thứ tự: [AGENTS.md](../AGENTS.md), [PROJECT_BRIEF.md](../PROJECT_BRIEF.md), [báo cáo Claude lần 3](qa/bao-cao-kiem-tra-2A.md), [ảnh bằng chứng](qa/README.md), rồi các tài liệu thiết kế/kiến trúc được brief dẫn tới.

Báo cáo review SHA `c2e5361defb0d151bf14c8153a341072060c2e42`. Đây là baseline, không phải SHA sau sửa. Các số dòng và nhận định trong báo cáo phải đối chiếu lại với mã hiện tại. Không áp dụng máy móc đoạn code gợi ý khi nó làm sai hành vi hoặc thiết kế.

## 2. Cách bắt đầu và giới hạn phạm vi

- Kiểm tra repo, nhánh, HEAD và thay đổi chưa commit. Đọc thay đổi mới trên `origin/main` trước khi sửa; dùng nhánh sửa riêng, gợi ý `fix/milestone-2a-qa`, không đè công việc trong `D:\\webbvct` hoặc checkout khác.
- Đồng bộ tài liệu theo AGENTS.md. Không reset, force-push hoặc tự merge code sửa vào main. Bàn giao nhánh và SHA cho Claude review trước.
- Có thể cài dependencies đã khóa bằng `npm ci` trong checkout/bản sao dùng kiểm tra. Không tự thêm/nâng dependency hoặc đổi lockfile để sửa các lỗi này; ưu tiên CSS/API sẵn có.
- Không xây trang con giai đoạn 3, backend, auth hoặc database; giữ form demo trung thực. Không tự thay thông tin bệnh viện chưa xác minh.
- Không tự chọn host hoặc triển khai. P1-8 phụ thuộc quyết định hosting; ghi rõ phần bị chặn và hoàn thành các mục độc lập trước.

## 3. Danh sách sửa và điều kiện xác nhận

Các ID giữ nguyên theo báo cáo Claude để hai agent đối chiếu. Thứ tự dưới đây ưu tiên lỗi chặn sử dụng và lỗi ảnh hưởng toàn site.

| Thứ tự / ID | Công việc | Điều kiện để đề nghị đóng lỗi |
| --- | --- | --- |
| 1 — P1-1 | Sửa Header mobile để Menu luôn hiện và bấm được; sửa script QA đo đúng viewport | Ở 320px, `innerWidth` đúng 320, `scrollWidth` không vượt viewport yêu cầu; toàn bộ nút Menu nằm trong viewport và mở được Drawer. Không chỉ che tràn bằng overflow. Chụp 320 và 390px |
| 2 — P1-2 | Xử lý namespace token container/radius xung đột Tailwind; cập nhật tất cả nơi tham chiếu và tài liệu liên quan | Giá trị computed khớp thiết kế chủ ý; ComingSoon/404 có chiều rộng dễ đọc, Drawer tablet có chiều rộng đúng chủ ý; không mặc định coi thang Tailwind là thiết kế đã duyệt. Chụp ComingSoon 1440, 404, Drawer 768; rà hồi quy cả sáu section 2B |
| 3 — P1-5 | Đóng Drawer thật khi vượt breakpoint desktop, dọn effect khóa cuộn và phím; bổ sung trạng thái ARIA của trigger | Mở ở 900, đổi sang 1180: Drawer đóng, cuộn được, không còn focus trap ẩn; quay lại mobile mở được. Kiểm tra Escape, trả focus, chuyển route và khôi phục style cuộn |
| 4 — P1-4 | Sửa xung đột hover/click của dropdown | Rê rồi click vẫn truy cập được submenu; click, bàn phím, Escape và click ngoài có hành vi nhất quán. Ưu tiên mẫu disclosure đơn giản |
| 5 — P1-3 | Thể hiện trang hiện tại và nhóm chứa route trên desktop/mobile | Link hiện tại có `aria-current` phù hợp; nhóm đang chứa route được tô rõ; kiểm tra `/`, `/dich-vu/spa`, `/cau-chuyen/abc`. So khớp theo ranh giới route, tránh startsWith nhận nhầm tiền tố; không gán nhiều link là trang hiện tại |
| 6 — P1-6 | Thêm lối vào Liên hệ và tổng quan Dịch vụ; thống nhất tham số tin tức; CTA ComingSoon; hotline mobile | Có đường tới `/lien-he` và `/dich-vu` trong điều hướng dùng chung; mặc định thống nhất `cat=news` theo sitemap, cập nhật nơi đang dùng `tab`. Trang chờ chưa cần xây bộ lọc tin tức. Có CTA liên hệ/đặt lịch an toàn và hotline dễ tìm, không làm tái phát tràn 320px |
| 7 — P1-7 | Title/meta theo route, noindex 404, robots.txt/sitemap.xml và tài liệu giới hạn rendering | Kiểm tra DOM sau navigation/Back; kiểm tra file tĩnh được phục vụ đúng nội dung, không trả HTML SPA. Sitemap hiện chỉ có trang chủ. Phân biệt metadata client với HTML gốc; robots.txt không phải biện pháp bảo mật và không đảm bảo loại URL khỏi index. Chưa tuyên bố đã giải quyết noindex trong HTML gốc nếu chưa có phương án host/prerender được duyệt |
| 8 — P1-8 | Ghi nhận yêu cầu fallback theo host đích | Chưa chọn host: giữ trạng thái chờ quyết định, không tự thêm cấu hình cho nhiều host. Khi host được chốt, cấu hình và kiểm tra mở thẳng/F5 route con, asset và URL sai; ghi HTTP status thật. Không coi server cố ý thiếu rewrite là bằng chứng host đích chắc chắn hỏng |

## 4. P2 và P3

- Xử lý P2 trong cùng đợt sửa bộ khung: tương phản chữ theo nền computed thực, đóng dropdown khi focus rời nhóm, focus/thông báo khi chuyển trang, lớp animation không tồn tại và `py-0.2`, safe-area thanh hành động. Dùng CSS sẵn có hoặc bỏ lớp vô hiệu; không cài plugin animation chỉ để khớp class cũ.
- Không đổi đường dẫn trang khiến focus mất, không gọi focus vào phần tử đã ẩn khi đổi breakpoint. Ghi rõ phần chưa thử bằng screen reader/thiết bị thật.
- P3 làm sau P1/P2: gom dữ liệu liên hệ, tối ưu ảnh logo và favicon, rà tệp mồ côi trước khi xóa, cập nhật README/môi trường. Không sửa địa chỉ/giờ khám theo suy đoán; mục nào cần chủ bệnh viện xác nhận thì giữ chờ.
- Giữ nguyên báo cáo QA và ảnh trước sửa. Báo cáo mốc 2B cũ là hồ sơ lịch sử, không phải kết luận hiện hành; không dùng nó để tuyên bố nghiệm thu.

## 5. Kiểm tra và đầu ra bắt buộc

**E2E bắt buộc:** thực hiện [hướng dẫn E2E và retest](qa/2a-e2e-protocol.md). Anti chạy trước bàn giao; Claude chạy lại độc lập trên đúng SHA code mới. Báo cáo Anti dùng `docs/qa/2a-fix-handoff.md`; báo cáo Claude dùng `docs/qa/2a-retest-01.md` và tăng số ở các lần sau. Không coi lint/build hoặc ảnh chụp riêng lẻ là thay thế E2E.

1. Chạy `npm run lint`, `npm run build`; ghi Node/npm và kết quả thực tế. Không báo đạt phần chưa chạy.
2. Kiểm tra trang chủ, ComingSoon, 404 ở 320, 390, 768, 1366, 1440px. Ghi viewport yêu cầu, `innerWidth`, `clientWidth`, `scrollWidth` và vị trí Menu; phát hiện mobile viewport tự nới rộng thay vì báo PASS giả.
3. Kiểm tra tương tác theo các ID bên trên, gồm focus trap hai chiều, Escape, trả focus, resize qua 1024px, scroll restore, dropdown hover/click/Tab, active route, meta qua navigation và Back.
4. Kiểm tra computed max-width/radius và ảnh hồi quy cả trang chủ vì sửa token có ảnh hưởng 2B. Đo lại tương phản; không suy ra a11y đạt chỉ từ build.
5. Lưu báo cáo mới, gợi ý `docs/qa/2a-fix-handoff.md`, có bảng từng P1/P2/P3: đã sửa/chờ/chưa kiểm chứng; file thay đổi, bằng chứng trước/sau, nhánh và SHA code được kiểm tra, môi trường, lệnh/kết quả, ảnh và giới hạn. Báo cáo thêm sau commit code phải ghi rõ SHA code đích; không dùng một SHA tự tham chiếu chưa tồn tại.
6. Push nhánh sửa và gửi đường dẫn cùng SHA cho người dùng để giao Claude. Không tự tuyên bố được Claude duyệt, không tự merge/deploy và không sang giai đoạn 3.

## 6. Nghiệm thu

Claude chạy lại trên đúng SHA mới và kết luận từng phát hiện; ID nào còn phụ thuộc hosting/nội dung phải ghi rõ, không âm thầm coi đã đóng. Việc giảm mức ưu tiên hoặc chấp nhận rủi ro cần được ChatGPT tổng hợp cho người dùng quyết định. Chỉ người dùng quyết định nghiệm thu 2A; sau đó vẫn phải review riêng 2B trước giai đoạn 3.
