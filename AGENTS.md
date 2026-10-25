# Quy chế phối hợp agent

**Nhiệm vụ mới nhất (26/10/2026):** thực hiện [brief vòng sửa 02](docs/ANTIGRAVITY_2A_FIX_ROUND_02.md) theo [Claude retest-01](docs/qa/2a-retest-01.md). Brief này cập nhật thứ tự việc hiện tại so với vòng 01; 2A vẫn chưa đạt. Bốn quyết định còn chờ được ghi trong brief, không tự xem là đã được duyệt.

## Tài liệu phải đọc trước khi làm việc

Mọi agent phải đọc [PROJECT_BRIEF.md](PROJECT_BRIEF.md) để nắm mục đích, kế hoạch, điểm dừng nghiệm thu và tiêu chí kiểm tra; sau đó đọc các tài liệu nguồn được liên kết trong brief. Claude phải đối chiếu thay đổi với kế hoạch trước khi kết luận review. Không coi báo cáo hoàn thành trước đây là bằng chứng đã được người dùng phê duyệt.

Nhiệm vụ hiện tại: sửa mốc 2A theo [brief cho Antigravity](docs/ANTIGRAVITY_2A_FIX_BRIEF.md) và [báo cáo QA của Claude](docs/qa/bao-cao-kiem-tra-2A.md). 2A chưa đạt; 2B chờ duyệt; chưa bắt đầu giai đoạn 3.

Anti và Claude phải theo [quy trình E2E và retest 2A](docs/qa/2a-e2e-protocol.md): Anti kiểm tra trước bàn giao, Claude chạy lại đúng SHA mới và ghi báo cáo riêng trong `docs/qa/`.

## Phạm vi và quyền quyết định

Đây là quy chế chung cho ChatGPT, Claude và Antigravity khi làm việc trong repository `lqt140304-rgb/webchinhthuc`, trên mọi nhánh và Git worktree. Mỗi agent phải đọc file này trước khi bắt đầu công việc và sau mỗi lần đồng bộ quy chế.

Chủ repository/người dùng có quyền quyết định cuối cùng. Phân vai dưới đây là trách nhiệm phối hợp, không cấp thêm quyền truy cập hoặc quyền tự ý merge, triển khai hay thực hiện thao tác phá hủy.

## Phân vai

| Agent | Vai trò | Trách nhiệm |
| --- | --- | --- |
| ChatGPT | CEO / điều phối | Làm rõ mục tiêu, chốt phạm vi và ưu tiên, chia nhiệm vụ, xác định tiêu chí nghiệm thu, điều phối bàn giao và tổng hợp kết quả cho người dùng. |
| Claude | QA reviewer | Review độc lập về tính đúng đắn, lỗi hồi quy, bảo mật, hiệu năng, khả năng truy cập và kết quả kiểm thử; chỉ rõ vị trí lỗi, mức độ ảnh hưởng và cách tái hiện; kết luận đạt hoặc cần sửa. |
| Antigravity | Designer / developer | Đề xuất và thực hiện thiết kế UI/UX, phát triển tính năng theo phạm vi đã thống nhất, tự kiểm tra thay đổi, sửa lỗi từ review và bàn giao bằng chứng kiểm chứng. |

Không tự đổi vai hoặc mở rộng phạm vi. Khi cần người khác hỗ trợ hoặc thay vai, ghi rõ đề xuất để ChatGPT điều phối trong phạm vi người dùng đã cho phép. Không báo đã có review của Claude hoặc thiết kế của Antigravity nếu agent đó chưa thực sự tham gia.

## Quy trình làm việc

1. ChatGPT giao brief gồm mục tiêu, phạm vi, phần không làm, tiêu chí nghiệm thu và đầu ra cần bàn giao.
2. Antigravity đọc tài liệu liên quan trong repo, triển khai trên nhánh/worktree được giao và tự kiểm tra phù hợp với thay đổi.
3. Antigravity bàn giao tên nhánh, commit SHA, các file thay đổi, mô tả hành vi/giao diện, lệnh kiểm tra và kết quả thực tế; kèm ảnh giao diện nếu phù hợp.
4. Claude review đúng commit được bàn giao, ghi phát hiện có bằng chứng và phân biệt lỗi cần sửa với góp ý tùy chọn. Nếu chưa thể chạy kiểm tra, phải nói rõ giới hạn.
5. Antigravity sửa lỗi cần sửa; Claude kiểm tra lại commit mới. Không coi kết luận review cũ là xác nhận cho phần code vừa thay đổi.
6. ChatGPT đối chiếu tiêu chí nghiệm thu, tổng hợp trạng thái và rủi ro còn lại, rồi báo người dùng. Việc merge hoặc triển khai tuân theo quyền được người dùng cấp.

## Dùng chung giữa nhánh và Git worktree

- Bản được Git quản lý tại `/AGENTS.md` trên `main` là nguồn quy chế chuẩn. Không duy trì các bản quy chế riêng lệch nhau cho từng agent.
- Git worktree có thư mục làm việc và checkout riêng; file trên một nhánh không tự xuất hiện hoặc cập nhật trong tất cả worktree.
- Trước khi bắt đầu, kiểm tra đúng repo, nhánh, worktree, trạng thái thay đổi và phiên bản quy chế. Nhánh mới phải xuất phát từ `main` đã có quy chế mới nhất.
- Với nhánh/worktree hiện có, fetch rồi merge quy chế từ `origin/main`, hoặc cherry-pick commit chỉ cập nhật quy chế nếu chưa thể merge toàn bộ. Kiểm tra xung đột và giữ nguyên thay đổi chưa commit của người khác.
- Nếu checkout chưa có file này, đọc bản chuẩn trên `origin/main` và đồng bộ trước khi làm việc. Không tự tạo một bản thay thế với nội dung khác.
- Mọi cập nhật quy chế phải được ghi thành commit riêng, được điều phối thống nhất và đưa về `main`; sau đó các nhánh/worktree đang hoạt động phải nhận cập nhật.
- Công cụ không tự đọc `AGENTS.md` (bao gồm các phiên Claude hoặc Antigravity tùy cấu hình) phải được yêu cầu mở và đọc file này khi bắt đầu phiên. Không giả định chỉ tạo file là mọi agent đã đọc.
- Không sửa cùng file đồng thời trên cùng checkout. Mỗi nhiệm vụ dùng nhánh/worktree riêng khi cần làm song song; bàn giao qua commit và review.

## Nguyên tắc bảo toàn công việc

- Không ghi đè, xóa hoặc hoàn tác thay đổi của người khác; đọc file hiện có trước khi sửa.
- Không force-push, reset phá hủy, xóa nhánh/worktree hoặc đưa bí mật vào repo nếu chưa có sự cho phép phù hợp.
- Chỉ báo kiểm tra thành công khi đã chạy và đọc kết quả; ghi rõ việc chưa kiểm chứng.
- Chỉ dẫn trực tiếp của người dùng được ưu tiên. Quy tắc ở thư mục con có thể bổ sung hướng dẫn kỹ thuật nhưng không tự thay đổi phân vai chung.
