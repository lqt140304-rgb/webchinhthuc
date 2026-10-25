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
3. **P1-8 — cấu hình sai:** gỡ `public/404.html` đang làm mất deep link, cùng cấu hình host tạo sẵn chưa được chọn (`public/_redirects`, `vercel.json`), khôi phục trạng thái trung lập theo brief vòng 01. Không tự chọn host hoặc triển khai. Nếu người dùng chốt host sau đó, chỉ thêm cấu hình phù hợp quyết định mới và kiểm tra qua HOST_URL. Chưa có host: ghi BLOCKED, không báo đã giải quyết HTTP fallback/noindex HTML gốc.
4. **R1-1 — JSON-LD:** cần xử lý trước nghiệm thu nhưng phụ thuộc quyết định nội dung ở mục dưới. Không gọi dữ liệu địa chỉ/giờ khám là đã xác minh, không tự xác nhận thay chủ bệnh viện. Khi tạm gỡ được duyệt, thực sự loại JSON-LD khỏi HTML xuất bản, không chỉ thêm chú thích “chờ duyệt”.
5. **P3:** bỏ canonical khỏi trang 404; tối ưu logo và tạo favicon phù hợp, giữ nhận diện và kiểm tra chất lượng hiển thị. Do 404.html sẽ gỡ, không cần giữ hoặc sửa cú pháp tệp đó chỉ để hỗ trợ host chưa chọn.
6. Bàn giao SHA code mới để Claude chạy **retest-02**; không tự merge main hoặc chuyển giai đoạn.

## Bốn quyết định đang chờ người dùng

| Quyết định | Tình trạng và tác động |
| --- | --- |
| Host: Vercel/Netlify/Cloudflare Pages/GitHub Pages hoặc chưa chốt | Chưa có lựa chọn được xác nhận. Gỡ cấu hình tạo sẵn sai như trên; giữ kiểm tra host BLOCKED |
| JSON-LD địa chỉ/giờ khám | Đề xuất tạm gỡ đến khi có dữ liệu được chủ bệnh viện xác minh. Chờ quyết định trước khi thay đổi; lỗi R1-1 vẫn mở |
| Hotline Header desktop | Chọn luôn có nút gọi (có thể thu gọn) hoặc giữ hành vi hiện tại. Chờ quyết định; không đổi bố cục phần này theo suy đoán |
| Bộ E2E chuẩn | Đề xuất dùng `tests/e2e/2a.e2e.test.cjs` từ commit Claude nêu trên. Chờ phê duyệt việc chọn làm chuẩn. Trong thời gian chờ vẫn dùng các ca test của Claude để tái hiện và xác nhận P1-3/P1-4; không tự đổi dependencies ứng dụng |

Các quyết định chờ không chặn sửa P1-3, P1-4, gỡ cấu hình host sai và các P3 độc lập. Ghi rõ các mục chờ trong bàn giao, không tự coi là PASS.

## E2E và bàn giao vòng 02

- Bộ Claude tại commit `76e1e5c`: `tests/e2e/2a.e2e.test.cjs`, `tests/e2e/hosting-404html-sim.cjs`, `tests/e2e/run-2a-e2e.sh`. Có thể lấy riêng các tệp này để kiểm tra; không merge toàn bộ nhánh review. Playwright có thể cài tách trong môi trường kiểm tra; không tự sửa package.json/lockfile.
- Chạy lint, build và các test độc lập. Không giảm assertion để biến lỗi thành PASS. Dùng thao tác chuột/bàn phím thật, chờ trạng thái thay sleep cố định; đọc robots/sitemap qua HTTP, kiểm Back/Forward, Tab/Shift+Tab, route con/query, ranh giới route và 15 tổ hợp responsive.
- Khi public/404.html được gỡ và chưa chọn host, ghi test mô phỏng cũ là không còn áp dụng kèm lý do, không báo đã PASS trên host thật. Ghi riêng test host BLOCKED; không buộc tổng số test phải giữ đúng 53 nếu có thay đổi có lý do.
- Lưu `docs/qa/2a-fix-handoff-02.md`, ảnh/log tại `docs/qa/2a-fix-02-evidence/`. Giữ báo cáo vòng 01, trả lời từng ID và bốn quyết định đang chờ; ghi nhánh, SHA code đích, môi trường, lệnh, pass/fail/skip và giới hạn. SHA commit tài liệu tách khỏi SHA code đã chạy.
- Push nhánh sửa, bàn giao đường dẫn báo cáo và SHA mới cho người dùng/ChatGPT để giao Claude. Claude ghi `docs/qa/2a-retest-02.md`, ảnh/log tại `docs/qa/2a-retest-02-evidence/`, trên nhánh review riêng `claude/2a-retest-02` theo quyền người dùng đã cấp cho quy trình review; nếu phiên Claude có giới hạn mới thì tuân thủ giới hạn đó. Không sửa ứng dụng, không force-push và không merge main.
