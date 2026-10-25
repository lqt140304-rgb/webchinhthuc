# Antigravity — vòng sửa 02, chuẩn bị Claude retest-02

Ngày giao: 26/10/2026. Người dùng yêu cầu giao mục 6 báo cáo Claude retest-01. **2A chưa đạt; 2B chờ duyệt; chưa bắt đầu giai đoạn 3.**

## Nguồn và baseline

- [Báo cáo retest-01, đặc biệt mục 6](qa/2a-retest-01.md); bản nguồn: nhánh `claude/2a-retest-01`, commit `76e1e5c1513a7d2626cf217361ac6064aa9488b3`.
- Code đã được Claude kiểm tra: `31e3c1eafc7ac470361c860c681d49874a3768c6`. Đầu nhánh Anti khi nhận báo cáo: `24e986a7f2ab5aa81ce5fca5a9d61a83f1baaf7f`, nhánh `fix/milestone-2a-qa`; commit sau chỉ sửa dòng SHA trong báo cáo bàn giao.
- Đọc [AGENTS.md](../AGENTS.md), [PROJECT_BRIEF.md](../PROJECT_BRIEF.md), [quy trình E2E](qa/2a-e2e-protocol.md) và [brief vòng 01](ANTIGRAVITY_2A_FIX_BRIEF.md).
- Tiếp tục từ nhánh sửa của Anti; không thay code bằng toàn bộ cây nhánh Claude hoặc main vì các nhánh đó không chứa bản sửa ứng dụng vòng 01. Chỉ lấy tài liệu, bằng chứng và test liên quan. Kiểm tra thay đổi chưa commit và không ghi đè công việc khác.

## Kết luận kế thừa từ Claude

P1-1, P1-2, P1-5, P1-6 đạt; P1-7 đạt phía client, HTML gốc còn BLOCKED. Các P2 gốc đạt trong phạm vi Claude kiểm tra (DOM/CSS không thay thế thiết bị thật). P1-3 và P1-4 còn FAIL. Không gọi 24/24 test của Anti là bằng chứng đủ để nghiệm thu.

## Việc phải sửa — mục 6 của báo cáo

1. **P1-4 — hover/click:** bỏ hover mở menu hoặc phân biệt menu đang mở do hover để click không đóng trái kỳ vọng. Test bằng chuột thật qua browser automation: rê vào trigger rồi click, submenu vẫn truy cập được; kiểm tra Enter, Escape, Tab ra ngoài và trả focus.
2. **P1-3 — active route:** dùng chung hàm cho Header và MobileNav, so khớp ranh giới `p === base || p.startsWith(base + '/')` khi cần đánh dấu nhóm. Link tổng quan chỉ active khi khớp chính xác; xét query `cat=news`; bỏ aria-current khỏi logo. Chỉ một link trang hiện tại trong mỗi vùng điều hướng đang hiển thị. Phải sửa đủ sáu test FAIL của Claude và bổ sung trường hợp ranh giới cho Drawer.
3. **P1-8 — cấu hình sai:** người dùng đã chọn **Vercel**. Gỡ `public/404.html` và `public/_redirects`; chỉ giữ/rà cấu hình Vercel phù hợp SPA, không làm mất deep link, asset hoặc tệp SEO. Kiểm tra URL sai và HTTP status thật. Không tự triển khai: khi chưa có URL Vercel được phép kiểm tra, ghi phần host thật BLOCKED, không báo đã giải quyết chỉ nhờ vite preview. Đề xuất riêng phương án noindex HTML gốc/header theo route nếu cần, không áp noindex toàn site làm mất index trang chủ.
4. **R1-1 — JSON-LD:** người dùng đã xác nhận địa chỉ **101 Khuất Duy Tiến, Thanh Xuân, Hà Nội**, giờ làm việc **08:00–21:00**, cấp cứu **24/24**. Cập nhật JSON-LD và dữ liệu dùng chung đúng nội dung này; không tự thêm “Phường Nhân Chính”, không tự khẳng định Thanh Xuân là quận/phường hiện hành. Không bịa tọa độ hoặc dữ liệu xác minh bên ngoài. Ghi nguồn là xác nhận trực tiếp của người dùng ngày 26/10/2026; bỏ chú thích khẳng định có hồ sơ đăng ký đã xác minh nếu không có hồ sơ. Chỉ phát JSON-LD bệnh viện trên trang chủ phù hợp nội dung, không phát trên trang 404/trang chờ.
5. **P3:** bỏ canonical khỏi trang 404; tối ưu logo và tạo favicon phù hợp, giữ nhận diện và kiểm tra chất lượng hiển thị. Do 404.html sẽ gỡ, không cần giữ hoặc sửa cú pháp tệp đó chỉ để hỗ trợ host chưa chọn.
6. Bàn giao SHA code mới để Claude chạy **retest-02**; không tự merge main hoặc chuyển giai đoạn.

## Bốn quyết định đã chốt ngày 26/10/2026

| Quyết định | Chỉ dẫn thực hiện |
| --- | --- |
| Host | **Vercel**. Giữ cấu hình đúng Vercel; gỡ 404.html/_redirects dành cho host khác. Chọn host không phải cho phép deploy |
| JSON-LD | Dùng địa chỉ **101 Khuất Duy Tiến, Thanh Xuân, Hà Nội**; giờ **08:00–21:00**, cấp cứu **24/24**, theo xác nhận người dùng. Không thêm tên phường/quận chưa được xác nhận; kiểm tra dữ liệu hiển thị và schema khớp nhau |
| Hotline Header | **Bỏ hotline trên Header** theo lựa chọn người dùng. Không bỏ hotline ở Drawer, Hero, Footer hoặc thanh hành động mobile; xác nhận vẫn có lối gọi dễ tìm. Đây là thay đổi yêu cầu so với sitemap cũ, phải cập nhật tài liệu và test liên quan có lý do |
| Bộ E2E chuẩn | **Dùng `tests/e2e/2a.e2e.test.cjs` của Claude** làm bộ chuẩn cho Anti và retest-02, lấy từ commit `76e1e5c`. Không thêm dependencies ứng dụng. Bộ cũ của Anti chỉ là kiểm tra bổ sung |

Các lựa chọn này thay thế trạng thái chờ trong phiên bản brief trước. Cần xác nhận hành vi bằng test sau sửa, không coi quyết định sản phẩm là bằng chứng PASS.

## E2E và bàn giao vòng 02

- Bộ Claude tại commit `76e1e5c`: `tests/e2e/2a.e2e.test.cjs`, `tests/e2e/hosting-404html-sim.cjs`, `tests/e2e/run-2a-e2e.sh`. Có thể lấy riêng các tệp này để kiểm tra; không merge toàn bộ nhánh review. Playwright có thể cài tách trong môi trường kiểm tra; không tự sửa package.json/lockfile.
- Chạy lint, build và các test độc lập. Không giảm assertion để biến lỗi thành PASS. Dùng thao tác chuột/bàn phím thật, chờ trạng thái thay sleep cố định; đọc robots/sitemap qua HTTP, kiểm Back/Forward, Tab/Shift+Tab, route con/query, ranh giới route và 15 tổ hợp responsive.
- Khi public/404.html được gỡ, test mô phỏng GitHub Pages cũ không còn áp dụng, ghi rõ lý do; không coi tệp đã gỡ là test bị lỗi ứng dụng hoặc bằng chứng Vercel PASS. Chạy kiểm tra Vercel qua HOST_URL khi có URL được phép; nếu chưa có thì host thật vẫn BLOCKED. Không buộc tổng số test phải giữ đúng 53 nếu có thay đổi có lý do. Chỉ cập nhật assertion liên quan yêu cầu mới (hotline Header/host/JSON-LD), giữ nguyên các assertion bắt P1-3/P1-4 và mở rộng Drawer; ghi diff test để Claude review.
- Lưu `docs/qa/2a-fix-handoff-02.md`, ảnh/log tại `docs/qa/2a-fix-02-evidence/`. Giữ báo cáo vòng 01, trả lời từng ID và bốn quyết định đang chờ; ghi nhánh, SHA code đích, môi trường, lệnh, pass/fail/skip và giới hạn. SHA commit tài liệu tách khỏi SHA code đã chạy.
- Push nhánh sửa, bàn giao đường dẫn báo cáo và SHA mới cho người dùng/ChatGPT để giao Claude. Claude ghi `docs/qa/2a-retest-02.md`, ảnh/log tại `docs/qa/2a-retest-02-evidence/`, trên nhánh review riêng `claude/2a-retest-02` theo quyền người dùng đã cấp cho quy trình review; nếu phiên Claude có giới hạn mới thì tuân thủ giới hạn đó. Không sửa ứng dụng, không force-push và không merge main.
