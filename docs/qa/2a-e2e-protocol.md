# Hướng dẫn E2E và kiểm tra lại mốc 2A

Cập nhật 26/10/2026 theo yêu cầu người dùng. Áp dụng cho Antigravity trước bàn giao và Claude khi review lại. Đọc cùng [AGENTS.md](../../AGENTS.md), [brief sửa lỗi](../ANTIGRAVITY_2A_FIX_BRIEF.md) và [báo cáo gốc](bao-cao-kiem-tra-2A.md).

## 1. Trách nhiệm và nơi ghi kết quả

| Người thực hiện | Đầu ra trong repo |
| --- | --- |
| Antigravity | `docs/qa/2a-fix-handoff.md`; ảnh sau sửa tại `docs/qa/2a-fix-evidence/` |
| Claude | `docs/qa/2a-retest-01.md`; ảnh kiểm tra độc lập tại `docs/qa/2a-retest-01-evidence/` |

Các đường dẫn này là đầu ra cần tạo khi thực sự kiểm tra, chưa phải báo cáo đã tồn tại. Lần retest tiếp theo dùng `02`, `03`...; không ghi đè báo cáo gốc hoặc kết quả của agent khác. Anti trả lời từng ID P1/P2/P3 trong file bàn giao; Claude đối chiếu từng ID trong file retest của mình.

Anti push nhánh sửa, cung cấp SHA code đích và cách chạy test. Claude checkout/bản sao đúng SHA đó rồi chạy lại độc lập; không chỉ đọc kết quả PASS của Anti. Nếu chỉ có báo cáo chưa có code push, ghi rõ chưa thể retest.

## 2. Phạm vi E2E bắt buộc

Ưu tiên Playwright cho bộ kiểm tra tự động có assertion, có thể chạy lại. Script chỉ chụp ảnh hoặc log số đo chưa đủ để gọi là bộ E2E đạt. Giữ script/spec kiểm tra dùng chung trong repo (gợi ý `tests/e2e/` hoặc `scripts/qa/`), ghi lệnh chạy chính xác trong báo cáo.

| Luồng | Assertion tối thiểu |
| --- | --- |
| Header 320px | Viewport CSS thực đúng 320px, không tự nới rộng; không tràn ngang; Menu hiển thị, bounding box nằm trọn trong viewport, bấm được và mở Drawer |
| Responsive | Trang chủ, ComingSoon và 404 không tràn/mất nội dung ở 320, 390, 768, 1366, 1440px; lưu viewport yêu cầu và số đo thực |
| Drawer | Mở, focus đầu vào, Tab/Shift+Tab không thoát dialog, Escape đóng và trả focus; đóng qua link và phục hồi cuộn; mở ở 900 rồi resize lên 1180 phải gỡ khóa cuộn/focus trap ẩn, trở lại mobile vẫn dùng được |
| Dropdown | Hover rồi click không làm mất khả năng truy cập submenu; click, bàn phím và Escape hoạt động nhất quán; Tab rời nhóm thì đóng; không giữ focus trong phần tử ẩn |
| Điều hướng | Link Liên hệ/tổng quan Dịch vụ tồn tại và vào đúng route; trạng thái hiện tại và ARIA đúng trên desktop/Drawer; kiểm tra cả route con và query tin tức đã thống nhất |
| Meta và lịch sử | Title/noindex đúng khi vào trang chờ, 404, về trang chủ và Back/Forward; không còn meta cũ trên route mới |
| Tệp SEO | robots.txt và sitemap.xml trả đúng nội dung/Content-Type phù hợp, không phải HTML của SPA; XML hợp lệ và chỉ chứa URL đủ điều kiện |
| Host đích | Khi đã chốt host: mở thẳng/F5 route con, tải asset và URL sai; ghi HTTP status. Chưa chốt host thì ghi BLOCKED cho phần này, không coi chạy trên vite preview là đã kiểm chứng triển khai |

E2E metadata DOM không chứng minh HTML gốc có noindex; ghi riêng kiểm tra response HTML/header và giới hạn client rendering. E2E không thay thế xem ảnh, đo tương phản hay thử trình đọc màn hình/thiết bị thật. Không đưa đặt lịch thật, đăng nhập thật hoặc backend giai đoạn 4 vào phạm vi khi các trang vẫn là demo.

## 3. Môi trường và công cụ

- Chạy trên bản build của đúng SHA, ghi Node/npm, hệ điều hành, browser/version, viewport, loại server và base URL. Ghi rõ kiểm tra trên vite preview hay host đích.
- Có thể dùng `npm ci` theo lockfile trong bản sao kiểm tra. Ưu tiên Playwright/browser có sẵn; nếu thiếu, có thể cài công cụ kiểm tra vào scratchpad tách riêng, ghi phiên bản và cách chạy. Không tự thêm/nâng dependency ứng dụng hoặc sửa package/lockfile. Muốn đưa dependency test mới vào repo phải nêu đề xuất riêng.
- Test phải tự thất bại khi assertion không đạt; không ép PASS, không dùng sleep cố định thay cho chờ trạng thái, không gọi retry thành bằng chứng không có lỗi chập chờn. Nếu thiếu công cụ, mạng hoặc browser, báo BLOCKED và nguyên nhân, không gọi kiểm tra tay là E2E tự động.

## 4. Báo cáo tối thiểu của cả hai bên

1. Nhánh, SHA code đã kiểm tra, trạng thái working tree, môi trường và lệnh chạy (lint, build, E2E).
2. Bảng test case/ID lỗi: PASS, FAIL, BLOCKED hoặc NOT RUN; expected/actual và liên kết ảnh/log phù hợp.
3. Số test đã chạy/đạt/trượt/bỏ qua, lỗi console/pageerror nếu có. Không gộp test bỏ qua hoặc BLOCKED vào PASS.
4. Mã test/script để chạy lại, vị trí artifact và ảnh tại các viewport yêu cầu. Không commit node_modules, browser binaries, secrets hoặc artifact lớn không cần thiết.
5. Phần chưa kiểm chứng: host, iOS/Android thật, screen reader và QA chi tiết 2B; kết luận riêng từng phần.

Claude tạo báo cáo retest và bàn giao cho người dùng trên nhánh review riêng nếu được phép commit/push; nếu phiên Claude vẫn có chỉ dẫn trực tiếp cấm commit/push, giữ nguyên giới hạn đó, xuất file báo cáo cho người dùng đưa lên repo. Không merge code sửa vào main. ChatGPT tổng hợp kết quả; người dùng quyết định nghiệm thu. Không chuyển sang giai đoạn 3 khi 2A chưa được duyệt và 2B còn chờ review.
