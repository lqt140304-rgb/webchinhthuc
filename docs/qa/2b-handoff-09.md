# Báo Cáo Bàn Giao Sửa A05-F1 & Vercel Preview Build (QA 2B-09) — Antigravity

| Mục | Chi tiết |
|---|---|
| **Người thực hiện** | Antigravity (Designer & Developer, theo `AGENTS.md`) |
| **Ngày thực hiện** | 27/10/2026 |
| **Căn cứ chỉ đạo** | [CEO DIRECTIVE 014-A (A05 FIX & REPRODUCIBLE PREVIEW BUILD)](#) & Báo cáo Claude QA `docs/qa/2b-qa-08.md` |
| **Nhánh làm việc** | `fix/milestone-2a-qa` |
| **SHA nguồn commit** | [`d3c32dd7aef8644149646139de470b8a99fda10d`](https://github.com/lqt140304-rgb/webchinhthuc/commit/d3c32dd7aef8644149646139de470b8a99fda10d) (ngắn gọn: `d3c32dd`) |
| **Vercel Project** | `le-son-website-qa` (Project ID: `prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3`) |
| **Vercel Deployment ID** | `dpl_2ESmyhuAmLUMrS1wsPRzJXaQMUhS` |
| **Vercel Preview URL** | `https://le-son-website-ndk3p1kb2-lqt140304-rgb.vercel.app` |
| **Trạng thái deployment** | `target: preview`, `status: ● Ready` |
| **Trạng thái mốc** | **READY FOR CLAUDE QA 2B-09** |

---

## 1. Phân Tích Nguyên Nhân Gốc Rễ Lỗi A05-F1

### A. Hiện tượng thực tế trên Vercel Preview (QA 2B-08):
- Khi truy cập URL không có dấu gạch chéo cuối (ví dụ `/gioi-thieu`, `/dich-vu`), Vercel trả về đúng header cấu hình từ `vercel.json`: `X-Robots-Tag: noindex, nofollow`.
- Tuy nhiên, khi truy cập các URL có dấu gạch chéo cuối (`/gioi-thieu/`, `/dat-lich/`, `/dich-vu/spa/`, `/tai-khoan/`, `/tai-khoan/ho-so/`, `/quan-ly/`), phản hồi HTTP chỉ mang header mặc định của nền tảng Preview (`X-Robots-Tag: noindex`), hoàn toàn thiếu `nofollow` từ `vercel.json`.

### B. Nguyên nhân kỹ thuật tại tầng định tuyến Vercel:
Trong `vercel.json` trước đây, các quy tắc được khai báo bằng:
```json
"source": "/(gioi-thieu|...)/:path*"
"source": "/(gioi-thieu|...)"
```
Khi Vercel CLI biên dịch `vercel.json` sang file cấu hình thực thi nội bộ `.vercel/output/config.json`, nó tạo ra biểu thức chính quy (regex):
```regex
Rule 1: ^(?:/(gioi-thieu|...))(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?$
Rule 2: ^(?:/(gioi-thieu|...))$
```
- Đối với `/gioi-thieu/`:
  - Rule 2 thất bại vì yêu cầu kết thúc chuỗi ngay sau tên route (`$`), không cho phép dấu `/`.
  - Rule 1 thất bại vì phần `(?:/((?:[^/]+?)...))` bắt buộc sau dấu `/` phải có ít nhất một ký tự không phải slash (`[^/]+?`). Chuỗi rỗng sau `/` khiến regex không khớp!
- Đối với subpath có dấu gạch chéo cuối như `/dich-vu/spa/`:
  - Rule 1 yêu cầu sau `/spa` kết thúc chuỗi, không chấp nhận dấu `/` ở cuối.
- Kết quả: Tất cả các URL có dấu gạch chéo cuối đều trượt khỏi danh sách header rules của `vercel.json`!

---

## 2. Giải Pháp Kỹ Thuật Đã Triển Khai Trong `vercel.json`

Cập nhật cấu hình định tuyến trong [`vercel.json`](file:///d:/webbvct/vercel.json) sử dụng cú pháp wildcard tương thích hoàn toàn với trình biên dịch Vercel:

```json
{
  "headers": [
    {
      "source": "/(gioi-thieu|doi-ngu|co-so-vat-chat|bang-gia|san-pham|dat-lich|lien-he|dang-nhap|dang-ky)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    },
    {
      "source": "/(gioi-thieu|doi-ngu|co-so-vat-chat|bang-gia|san-pham|dat-lich|lien-he|dang-nhap|dang-ky)/(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    },
    {
      "source": "/(dich-vu|cau-chuyen|goc-thu-cung|bai-viet|tai-khoan|quan-ly)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    },
    {
      "source": "/(dich-vu|cau-chuyen|goc-thu-cung|bai-viet|tai-khoan|quan-ly)/(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Cơ chế hoạt động:
Khi biên dịch sang `.vercel/output/config.json`, quy tắc `/(.*)` sinh ra regex:
`^(?:/(gioi-thieu|...))(?:/(.*))$`
Biểu thức `(?:/(.*))` khớp hoàn hảo:
1. Trường hợp có dấu gạch chéo cuối đơn lẻ: `/gioi-thieu/` (`.*` là rỗng).
2. Trường hợp subpath không có slash: `/dich-vu/spa` (`.*` là `spa`).
3. Trường hợp subpath có slash cuối: `/dich-vu/spa/` (`.*` là `spa/`).
4. Trường hợp đường dẫn sâu: `/tai-khoan/ho-so/`, `/quan-ly/lich-hen/`.
5. Trường hợp kèm query param: `/gioi-thieu/?utm=1`, `/dich-vu/spa/?fbclid=abc`.

---

## 3. Bằng Chứng Kiểm Tra HTTP Headers Thực Tế Trên Live Vercel Preview

Đã kiểm tra trực tiếp qua `vercel curl -I` tới deployment ID `dpl_2ESmyhuAmLUMrS1wsPRzJXaQMUhS`:

| URL trên Live Preview | HTTP Status | Header `X-Robots-Tag` thực tế | Đánh giá |
|---|:---:|:---:|:---:|
| `https://le-son-website-ndk3p1kb2-lqt140304-rgb.vercel.app/` | `200 OK` | `noindex` (nền tảng preview) | **Đạt** (Trang chủ không nhận noindex, nofollow) |
| `https://le-son-website-ndk3p1kb2-lqt140304-rgb.vercel.app/gioi-thieu` | `200 OK` | **`noindex, nofollow`** | **Đạt** |
| `https://le-son-website-ndk3p1kb2-lqt140304-rgb.vercel.app/gioi-thieu/` | `200 OK` | **`noindex, nofollow`** | **ĐÃ SỬA A05-F1 (PASS)** |
| `https://le-son-website-ndk3p1kb2-lqt140304-rgb.vercel.app/dich-vu/spa/` | `200 OK` | **`noindex, nofollow`** | **ĐÃ SỬA A05-F1 (PASS)** |
| `https://le-son-website-ndk3p1kb2-lqt140304-rgb.vercel.app/tai-khoan/` | `200 OK` | **`noindex, nofollow`** | **ĐÃ SỬA A05-F1 (PASS)** |
| `https://le-son-website-ndk3p1kb2-lqt140304-rgb.vercel.app/tai-khoan/ho-so/` | `200 OK` | **`noindex, nofollow`** | **ĐÃ SỬA A05-F1 (PASS)** |
| `https://le-son-website-ndk3p1kb2-lqt140304-rgb.vercel.app/quan-ly/` | `200 OK` | **`noindex, nofollow`** | **ĐÃ SỬA A05-F1 (PASS)** |
| `https://le-son-website-ndk3p1kb2-lqt140304-rgb.vercel.app/dang-nhap/` | `200 OK` | **`noindex, nofollow`** | **ĐÃ SỬA A05-F1 (PASS)** |
| `https://le-son-website-ndk3p1kb2-lqt140304-rgb.vercel.app/gioi-thieu/?utm=1` | `200 OK` | **`noindex, nofollow`** | **ĐÃ SỬA A05-F1 (PASS)** |
| `https://le-son-website-ndk3p1kb2-lqt140304-rgb.vercel.app/khong-ton-tai` | `200 OK` | `noindex` (nền tảng preview) | **Đạt** (Soft 404 client-side, không chặn nhầm) |

*(Đã chạy kiểm thử 51 trường hợp URL trên script `scripts/test-a05-matrix.cjs`, đạt 51/51 PASS)*.

---

## 4. Chuẩn Hóa Git Line Endings (`.gitattributes`)

Tạo tệp [`.gitattributes`](file:///d:/webbvct/.gitattributes) ở thư mục gốc repository để giải quyết dứt điểm sự sai lệch hash giữa môi trường Windows và Linux CI (vấn đề được Claude chỉ ra ở Mục 2 của QA 2B-08):
- Tự động chuẩn hóa toàn bộ tệp mã nguồn và văn bản (`.html`, `.css`, `.js`, `.ts`, `.tsx`, `.json`, `.md`, `.svg`, `.xml`, v.v.) về chuẩn ký tự xuống dòng `LF` (`eol=lf`).
- Khai báo tường minh tất cả các định dạng tài sản nhị phân (`.png`, `.jpg`, `.webp`, `.ico`, `.woff`, `.woff2`) là `binary`, tuyệt đối không làm biến đổi bất kỳ byte nhị phân nào.
- Tuân thủ quy định: Không thực hiện normalize ồ ạt gây diff lớn ngoài ý muốn trong repository.

---

## 5. Thông Tin Bản Build & Triển Khai Vercel Preview (Nhiệm Vụ 2 & Mục V)

### A. Vercel Metadata (`vercel inspect`):
```text
General:
  id:           dpl_2ESmyhuAmLUMrS1wsPRzJXaQMUhS
  name:         le-son-website-qa
  target:       preview
  status:       ● Ready
  url:          https://le-son-website-ndk3p1kb2-lqt140304-rgb.vercel.app
  created:      Tue Oct 27 2026 15:02:44 GMT+0700
  build time:   10s

Build Machine:
  cores:        2 vCPU
  memory:       8192 MiB
```

### B. Asset phục vụ thực tế trên Live Preview:
- **JavaScript Bundle:** `/assets/index-6fCRVFyl.js` — Dung lượng: **369.957 bytes** (369.95 kB).
- **CSS Bundle:** `/assets/index-DlOxlv3G.css` — Dung lượng: **62.455 bytes** (62.45 kB).
- **Phông chữ tự lưu trữ:** 6 tệp WOFF2 (Be Vietnam Pro 400, 500, 600, 700, Italic 400, Lora 600) nguyên bản, 100% tiếng Việt có dấu.

---

## 6. Kết Quả Kiểm Thử Tự Động Trước Khi Bàn Giao

| Bộ kiểm thử | Lệnh thực hiện | Kết quả thực tế | Ghi chú |
|---|---|:---:|---|
| **Linter** | `npx oxlint` | **0 errors, 0 warnings** | 42 files kiểm tra |
| **TypeScript** | `npx tsc -b` | **0 errors** | Type check sạch sẽ |
| **Production Build** | `npm run build` | **Thành công (345ms)** | Bundle CSS: 61.36 kB, JS: 369.95 kB |
| **A05 Header Matrix** | `node scripts/test-a05-matrix.cjs` | **51 PASS / 0 FAIL** | 100% các biến thể slash & query |
| **Typography Verification** | `node scripts/verify-typography.cjs` | **100% PASS** | Đầy đủ 6 trọng số phông thật |
| **E2E 2B Booking** | `node --test tests/e2e/2b-booking.e2e.test.cjs` | **16 PASS / 0 FAIL** | Toàn bộ chức năng form |
| **E2E 2B Core** | `node --test tests/e2e/2b.e2e.test.cjs` | **27 PASS / 0 FAIL** | 6 section trang chủ, responsive |
| **E2E 2A Regression** | `node --test tests/e2e/2a.e2e.test.cjs` | **51 PASS / 0 FAIL / 2 BLOCKED** | 2 BLOCKED là host pre-release |
| **E2E 2A R2 & R3** | `node --test tests/e2e/2a-round02... tests/e2e/2a-round03...` | **45 PASS / 0 FAIL / 2 BLOCKED** | Host đích & APP_DIR |
| **Console Errors** | Ghi nhận qua Playwright | **0 errors / 0 pageerrors** | Toàn bộ quy trình sạch lỗi |

---

## 7. Danh Sách Tệp Đã Thay Đổi

1. [`.gitattributes`](file:///d:/webbvct/.gitattributes): Thiết lập chuẩn hóa xuống dòng `LF` và bảo toàn asset binary.
2. [`.gitignore`](file:///d:/webbvct/.gitignore): Thêm `.vercel` và `.env*` bảo mật môi trường.
3. [`vercel.json`](file:///d:/webbvct/vercel.json): Cập nhật quy tắc định tuyến header bao phủ 100% trailing slash và subpaths.
4. [`scripts/test-a05-matrix.cjs`](file:///d:/webbvct/scripts/test-a05-matrix.cjs): Script kiểm tra ma trận header 51 URL.
5. [`docs/qa/2b-handoff-09.md`](file:///d:/webbvct/docs/qa/2b-handoff-09.md): Báo cáo bàn giao chi tiết QA 2B-09.

---

## 8. Kết Luận & Tín Hiệu Bàn Giao

- Lỗi **A05-F1** đã được khắc phục hoàn toàn trên cả cấu hình cục bộ và máy chủ Vercel Live Preview thực tế.
- Tệp `.gitattributes` đã chuẩn hóa quy tắc line endings `LF`.
- Bản Vercel Preview mới đã triển khai thành công (`target=preview`, `status=Ready`).
- Bàn giao SHA và Preview URL cho Independent QA Lead Claude kiểm định độc lập.

**Tín hiệu bàn giao:** **READY FOR CLAUDE QA 2B-09**
