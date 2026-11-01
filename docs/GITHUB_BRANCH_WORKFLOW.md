# LÊ SƠN — GITHUB BRANCH WORKFLOW
## Phụ lục Master Prompt V2.0 — Quy trình Antigravity / Claude / Work

### I. Mục tiêu

Chuẩn hóa quy trình phát triển website Bệnh viện Thú y Lê Sơn bằng Git Worktree kết hợp GitHub.

Từ thời điểm áp dụng phụ lục này, ưu tiên GitHub làm nơi trao đổi mã nguồn giữa các AI thay cho chuyển file ZIP/patch thủ công.

Không xây dựng lại repository hoặc thay đổi kiến trúc.

Repository:

`https://github.com/lqt140304-rgb/webchinhthuc`

### II. Phân công

**Antigravity — Developer**

- Tiếp tục thiết kế và viết frontend trong worktree riêng.
- Commit các thay đổi có phạm vi rõ ràng.
- Chạy kiểm thử local.
- Khi qua các điều kiện an toàn, push đúng nhánh phát triển được giao lên GitHub.
- Bàn giao full commit SHA cho Claude.
- Nhận báo cáo QA và sửa lỗi trên cùng nhánh.

**Claude — Independent QA**

- Đọc code trực tiếp từ GitHub theo full SHA.
- Review diff so với commit đã QA trước đó.
- Kiểm tra Master Prompt V2.0.
- Chạy lint, build, typecheck, routing, accessibility, E2E khi môi trường cho phép.
- Báo cáo P0/P1/P2/P3.
- Không sửa trực tiếp nhánh Antigravity.
- Không tự merge.

**Work / Codex — Technical Operations**

- Kiểm tra cấu hình Git, worktree và trạng thái repository.
- Xác minh điều kiện push an toàn.
- Kiểm tra ảnh hưởng Git Integration và CI/CD.
- Hỗ trợ quản lý branch, commit và báo cáo.
- Không thay đổi Production hoặc cấu hình hosting khi chưa được duyệt.

**ChatGPT — Project Manager**

- Phân công, tổng hợp và theo dõi tiến độ.
- Đối chiếu Master Prompt V2.0.
- Xác định điều kiện nghiệm thu.
- Đề xuất merge khi Claude QA đạt và chủ dự án phê duyệt.

### III. Nhánh phát triển

Repository chính:

`lqt140304-rgb/webchinhthuc`

Nhánh Antigravity:

`antigravity/public-pages-603-20261101`

Nhánh QA:

`claude/qa-public-pages-603-20261101`

Baseline QA:

`603b2322814111ce5297b3f1c05979de72835d3f`

Commit sản phẩm đã review:

`e6915e0441fdf83937cdfc2f00d289fd1528c062`

Không tự tạo nhánh trùng hoặc ghi đè lịch sử đã tồn tại.

Nhánh QA chỉ chứa test, QA scripts và báo cáo khi được giao.

### IV. Điều kiện bắt buộc trước lần push đầu tiên

**Không thực hiện push cho tới khi tất cả điều kiện sau đã được xác minh.**

1. Xác minh Git remote thực tế trỏ về đúng repository.
2. Xác minh branch đang checkout là branch Antigravity được giao.
3. Kiểm tra thay đổi chưa commit và lịch sử commit dự định push.
4. Kiểm tra secret, API key, token, tài khoản, dữ liệu khách hàng và bệnh án.
5. Kiểm tra không có tài liệu nội bộ nhạy cảm trong lịch sử commit sẽ được công bố.
6. Xác nhận nhánh được push không tự động kích hoạt Vercel Hobby deployment.
7. Kiểm tra GitHub Actions hoặc webhook có thể chạy khi push.
8. Xác minh không có bước CI/CD phát sinh chi phí chưa được phê duyệt.
9. Đảm bảo không thay đổi Production, domain, SSO hoặc Git Integration.
10. Không tạo Preview Vercel/Cloudflare ngoài phạm vi được phê duyệt.

Nếu không thể xác minh một trong các điều kiện quan trọng, báo **BLOCKED** và dừng trước push.

Không tự tắt Git Integration, sửa Vercel Project hoặc workflow chỉ để vượt qua điều kiện này.

### V. Quy trình Antigravity

Trước mỗi commit, thực hiện:

- Kiểm tra `git status`.
- Đối chiếu Master Prompt V2.0.
- Chỉ sửa các file thuộc phạm vi nhiệm vụ.
- Chạy lint, build, typecheck và các bài kiểm thử liên quan.
- Kiểm tra diff và dữ liệu nhạy cảm.
- Commit local với thông điệp rõ ràng.

Sau khi điều kiện an toàn lần đầu được xác nhận và chủ dự án cho phép push nhánh này, Antigravity có thể sử dụng:

`git push -u origin antigravity/public-pages-603-20261101`

Những lần sau chỉ push cùng nhánh theo chính sách được duyệt, không tự force push hoặc thay đổi nhánh đích.

Bàn giao cho Claude:

- Repository.
- Branch.
- Full commit SHA.
- Parent SHA.
- Diff summary.
- Kết quả test.
- Những điểm cần review.

### VI. Quy trình Claude QA

Claude truy cập GitHub và đọc đúng commit SHA Antigravity bàn giao.

Không QA dựa vào tên branch nếu HEAD đã thay đổi.

Trước review:

- Xác minh commit tồn tại.
- Xác minh repository đúng.
- Kiểm tra diff so với commit đã review.
- Xác định file thay đổi.
- Đọc các phần liên quan của Master Prompt V2.0.

Chạy kiểm thử trên đúng commit khi môi trường hỗ trợ.

Mỗi finding cần có:

- Mức P0/P1/P2/P3.
- File và dòng.
- Bước tái hiện.
- Actual và Expected.
- Tác động.
- Đề xuất sửa.

Nếu không thể checkout hoặc chạy test, ghi rõ NOT TESTED; không suy diễn từ log Antigravity.

Bàn giao verdict:

- PASS.
- CONDITIONAL PASS.
- BLOCKED.

Không tự nghiệm thu hoặc merge.

### VII. Quy trình sửa lỗi

Khi Claude phát hiện lỗi:

1. Claude bàn giao báo cáo QA.
2. Antigravity sửa trên đúng nhánh phát triển.
3. Antigravity commit và push commit mới sau khi kiểm tra an toàn.
4. Claude review diff giữa SHA cũ và mới.
5. Claude retest các khu vực bị ảnh hưởng và regression gates cần thiết.
6. ChatGPT tổng hợp trạng thái.
7. Chủ dự án phê duyệt nghiệm thu hoặc yêu cầu sửa thêm.

Không tạo ZIP/patch cho mỗi vòng nếu GitHub đã truy cập được.

### VIII. Điều kiện merge

Chỉ đề xuất merge khi:

- Không còn P0/P1.
- Các P2 thuộc phạm vi phát hành đã được giải quyết hoặc có quyết định chấp nhận rủi ro rõ ràng.
- Build/lint/typecheck đạt.
- E2E và regression được báo cáo minh bạch.
- Nội dung công khai đã được duyệt.
- Không chứa secret hoặc dữ liệu nhạy cảm.
- Không có nguy cơ deployment ngoài ý muốn.
- Chủ dự án phê duyệt merge rõ ràng.

Không tự merge vào `main`.

### IX. Công việc hiện tại

Tiếp tục sửa finding **P2-1** của Claude đối với bản `e6915e04…`.

Antigravity:

- Bỏ các khẳng định địa lý chưa được xác nhận.
- Bỏ cam kết hướng dẫn sơ cứu qua điện thoại chưa được xác nhận.
- Kiểm tra metadata trang Cấp cứu.
- Sửa P3 vùng chạm hotline và nội dung sơ cứu còn lại nếu thuộc phạm vi.
- Commit local.
- Chỉ push sau khi điều kiện lần đầu ở Mục IV đạt.

Claude:

- Đọc commit mới trên GitHub.
- Review đúng SHA.
- Kiểm tra P2-1 và các P3 bị ảnh hưởng.
- Chạy regression gates cần thiết.
- Dừng sau báo cáo.

### X. Những hành động bị cấm

- Push trực tiếp `main`.
- Force push.
- Tự merge.
- Xóa branch/worktree.
- Reset phá hủy dữ liệu.
- Deploy Production hoặc Preview ngoài phạm vi.
- Tự sửa cấu hình Vercel/Cloudflare.
- Dùng API trả phí chưa được duyệt.
- Đưa secret, dữ liệu bệnh án hoặc khách hàng lên repository.
- Coi QA PASS là phê duyệt triển khai.

### XI. Quy tắc hiệu lực

Phụ lục này cập nhật **phương thức bàn giao mã nguồn** của Master Prompt V2.0.

Những ràng buộc kỹ thuật, thiết kế, nghiệp vụ, bảo mật và phê duyệt khác vẫn giữ nguyên.

Quyền push nhánh phát triển chỉ có hiệu lực sau khi hoàn thành các điều kiện an toàn và được chủ dự án cho phép.
