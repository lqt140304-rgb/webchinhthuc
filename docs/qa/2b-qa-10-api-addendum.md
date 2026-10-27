# QA 2B-10, phụ lục: xác minh deployment bằng Vercel REST API (Claude)

| Mục | Giá trị |
|---|---|
| Người kiểm tra | Claude (Independent QA Lead) |
| Căn cứ | CEO Directive 015-B, mục II; [QA 2B-10](2b-qa-10.md) mục 2 |
| Ngày đo | 27/10/2026, khoảng 10:00 UTC |
| Phương thức | Chỉ gọi `GET` tới `https://api.vercel.com`, token đọc từ biến môi trường `VERCEL_TOKEN`. Không gọi API ghi, sửa hay xóa nào. Không in token ra log hay file |
| Team | `team_JRJ3QbFNxjCkt551nl0Frolb` (slug `lqt140304-rgb`, plan `hobby`), lấy từ `ownerId`/`team` của deployment. `GET /v2/teams` trả **403** vì token chỉ có phạm vi một team, không có quyền liệt kê team; điều này không ảnh hưởng các mục dưới |
| Bằng chứng | JSON đã lọc theo danh sách trường cho phép (đã bỏ email, env, secret bypass): [deployment](2b-qa-10-evidence/api/deployment-dpl_HvyLw6.json), [project](2b-qa-10-evidence/api/project-prj_wZg6.json), [danh sách deployment](2b-qa-10-evidence/api/deployments-list.json) |

## 1. Kết luận

| Hạng mục | Kết luận |
|---|---|
| `target=preview`, READY | **VERIFIED** |
| Đúng project `le-son-website-qa` | **VERIFIED** |
| Deployment Protection bật | **VERIFIED** (Vercel Authentication, phạm vi `all`) |
| Không có Git Integration ngoài ý muốn | **VERIFIED** |
| Không có Production deployment ngoài ý muốn | **VERIFIED**. Chỉ có 1 Production, là deployment đầu tiên của project |
| Commit của deployment là `d3c32dd` | **VERIFIED** (metadata do CLI gắn; trùng với kết quả so hash ở QA 2B-10 mục 3) |

Có **2 Preview chưa được ghi trong bàn giao** (`dpl_3F22pW…`, `dpl_62NFAP…`). Cả hai đều là Preview tạo bằng CLI, không phải lỗi; chỉ cần ghi nhận (xem mục 4).

Mục "Xác minh deployment bằng Vercel API" của QA 2B-10 chuyển từ **NOT VERIFIED** sang **VERIFIED**. Các mục còn mở khác của QA 2B-10 (Soft 404, 2B-08, 2B-06, SEO Production) không thay đổi.

## 2. Deployment `dpl_HvyLw6bGTrDuNxJV3xeSSt6yimyC`

Endpoint: `GET /v13/deployments/dpl_HvyLw6bGTrDuNxJV3xeSSt6yimyC`, HTTP 200.

| Trường JSON | Giá trị | Đánh giá |
|---|---|---|
| `projectId` | `prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3` | Đúng |
| `name` | `le-son-website-qa` | Đúng |
| `target` | `null` | Là Preview, không phải `"production"` |
| `oidcTokenClaims.environment` | `preview` | Xác nhận thêm là Preview |
| `readyState` / `readySubstate` | `READY` / `STAGED` | Ready, chưa được promote |
| `url` | `le-son-website-jcml07jh0-lqt140304-rgb.vercel.app` | Khớp bàn giao |
| `createdAt` / `ready` | `1793093065032` (09:24:25 UTC) / `1793093073844` (09:24:33 UTC), ngày 27/10/2026 | |
| `source` | `cli` | Tạo bằng Vercel CLI, không phải Git |
| `meta.githubCommitSha` | `d3c32dd7aef8644149646139de470b8a99fda10d` | Khớp SHA dự kiến |
| `meta.githubCommitRef` / `meta.actor` | `HEAD` / `antigravity` | CLI chạy trên một checkout tách nhánh (detached HEAD) |
| `alias` / `automaticAliases` | `[]` / `[]` | Không gắn alias Production |
| `public` | `false` | |

Ghi chú: `meta.githubDeployment = "1"` và các trường `githubCommit*` là metadata Git mà CLI tự gắn khi chạy trong một repo Git. Trường này không có nghĩa là deployment được tạo bởi Git Integration; nguồn tạo là `source = cli`.

## 3. Project `prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3`

Endpoint: `GET /v9/projects/prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3`, HTTP 200.

| Trường JSON | Giá trị | Đánh giá |
|---|---|---|
| `name` / `framework` | `le-son-website-qa` / `vite` | Đúng |
| `link` | **Không có** | Project không kết nối repo Git, tức là không có Git Integration |
| `gitProviderOptions.createDeployments` | `disabled` | Cơ chế tạo deployment từ Git cũng đang tắt |
| `ssoProtection` | `{"deploymentType": "all"}` | **Vercel Authentication bật cho mọi deployment**, gồm cả Production |
| `passwordProtection` / `trustedIps` | Không có | Không dùng hai cơ chế này |
| `protectionBypass` | 1 khóa, scope `automation-bypass` | Đây là secret Claude dùng trong QA 2B-10. Giá trị không được lưu. Cần thu hồi sau QA |
| `live` | `false` | |
| `targets.production.id` | `dpl_BAz378AxMw59nUafGCMDM8Hws84s`, `readySubstate = PROMOTED` | Production hiện tại (xem mục 4) |
| `targets.production.alias` | `le-son-website-qa.vercel.app` | Alias Production. Vì `ssoProtection = all` nên alias này cũng yêu cầu đăng nhập |
| `targets.production.meta.githubCommitSha` | `db78738df347ce368e5c7738c1f351485e07f348` | Commit cũ (2B-28), không phải `d3c32dd` |

## 4. Mọi deployment của project

Endpoint: `GET /v6/deployments?projectId=prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3&limit=50&teamId=team_JRJ3QbFNxjCkt551nl0Frolb`, HTTP 200. `pagination.count = 6`, `next = null`, tức là đã lấy đủ danh sách.

| `uid` | `target` | `readyState` | `createdAt` (UTC) | `source` | Commit | Ghi nhận trước đây |
|---|---|---|---|---|---|---|
| `dpl_HvyLw6bGTrDuNxJV3xeSSt6yimyC` | `null` (preview) | READY | 27/10 09:24:25 | cli | `d3c32dd` | QA 2B-10 |
| `dpl_62NFAPXdtN8bfwZN8xsgo6SMg1Lx` | `null` (preview) | READY | 27/10 09:20:08 | cli | `d3c32dd` | **Chưa được ghi** |
| `dpl_2ESmyhuAmLUMrS1wsPRzJXaQMUhS` | `null` (preview) | READY | 27/10 08:02:15 | cli | `7d07a29` | QA 2B-09 |
| `dpl_3F22pWx1VVJhKjEsDJTc8yE2Gxaf` | `null` (preview) | READY | 27/10 07:57:09 | cli | `d3c32dd` | **Chưa được ghi** |
| `dpl_AepowyGh3A4iCrd47AQ9i2XoN4Xe` | `null` (preview) | READY | 26/10 16:17:06 | cli | `db78738` | QA 2B-08 |
| `dpl_BAz378AxMw59nUafGCMDM8Hws84s` | **`production`** | READY (PROMOTED) | 26/10 16:13:43 | cli | `db78738` | Deployment đầu tiên của project |

Nhận xét:

- **Production:** chỉ có **một** Production deployment, `dpl_BAz378…`. Đây là deployment sớm nhất của project, tạo 3 phút trước Preview `dpl_Aepowy…` ở cùng commit `db78738`. Không có Production nào được tạo sau đó. Claude không có văn bản Directive 013; QA 2B-08 có trích dẫn Directive 013 nhưng không ghi ID Production. Vì vậy, việc `dpl_BAz378…` đúng là deployment Directive 013 nhắc tới được suy ra từ thứ tự thời gian, chưa đối chiếu được với văn bản.
- **Git Integration:** cả 6 deployment đều có `source = cli`. Project không có `link`. Không có deployment nào được tạo từ Git.
- **Ba Preview cần kiểm** (`dpl_Aepowy…`, `dpl_2ESmyh…`, `dpl_HvyLw6…`): đều có `target = null`, tức là Preview. **Đạt.**
- **Hai Preview chưa có trong bàn giao:** `dpl_3F22pW…` và `dpl_62NFAP…` đều build từ `d3c32dd` bằng CLI, actor `antigravity`. Có thể đây là các lần deploy thử trước khi chốt `dpl_HvyLw6…` (deployment cuối có `forced = true` trong `latestDeployments`). Không phải lỗi bảo mật, vì cả hai đều là Preview và đều nằm sau Vercel Authentication. Đề nghị Antigravity ghi rõ trong bàn giao sau hoặc xóa các Preview thừa. Claude không xóa.
- Thứ tự commit hợp lệ: `d3c32dd` (07:56 UTC) có trước `7d07a29` (08:02 UTC, chỉ sửa tài liệu). Vì vậy `dpl_3F22pW…` lúc 07:57 build từ `d3c32dd` là hợp lý.

## 5. Rủi ro và việc cần làm

| # | Nội dung | Người làm |
|---|---|---|
| 1 | Production `le-son-website-qa.vercel.app` đang phục vụ commit cũ `db78738`, được Vercel Authentication bảo vệ. Production chưa được kiểm (đúng chỉ đạo); không coi là bản phát hành | Người dùng / CEO quyết định |
| 2 | Ghi nhận hoặc dọn 2 Preview thừa `dpl_3F22pW…`, `dpl_62NFAP…` | Antigravity, sau khi được duyệt |
| 3 | Thu hồi secret `automation-bypass` và `VERCEL_TOKEN` sau khi QA xong | Người dùng |

Claude không có thẩm quyền nghiệm thu; quyết định thuộc người dùng.
