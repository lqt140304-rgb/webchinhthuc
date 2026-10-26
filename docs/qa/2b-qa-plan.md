# Kế hoạch QA B04 (mốc 2B) và tiêu chí đánh giá A05

- **Người lập:** Claude (Independent QA Lead)
- **Ngày:** 26/10/2026
- **Căn cứ:** CEO Directive 004; MASTER PROMPT (mục VII, XII); "Quyết định và thứ tự làm việc" 26/10/2026 (B01–B04, A05); Architecture Baseline V1
- **Trạng thái:** tài liệu chuẩn bị. **Đây chưa phải kết quả QA B04.** B04 chỉ chạy trên SHA mới sau khi Antigravity xong B01/B02, và sau khi chủ dự án duyệt nghiệm thu có điều kiện 2A.
- Kết luận Retest-04 cho SHA `39a5835` giữ nguyên.

## 1. Tiêu chí đánh giá phương án A05 (trước khi triển khai)

Antigravity chưa nộp phương án A05. Khi có phương án, Claude sẽ đánh giá theo 6 tiêu chí.

**1. Phủ đúng tuyến.** Trang chờ, `/tai-khoan/*`, `/quan-ly/*`, `/dang-nhap`, `/dang-ky` phải nhận `X-Robots-Tag: noindex` ngay từ phản hồi HTTP đầu tiên. Gồm cả **tuyến gốc**, tuyến con và dấu `/` ở cuối. Ví dụ: `/dich-vu`, `/dich-vu/`, `/dich-vu/spa`.

**2. Không noindex nhầm.** Các tệp sau tuyệt đối không bị noindex: `/`, `robots.txt`, `sitemap.xml`, favicon, ảnh, `/assets/*`. Không dùng noindex cho toàn site (CEO Directive 004).

**3. Không phá SPA.** Rewrite `/(.*)` → `/index.html` phải giữ nguyên.

**4. Có quy trình gỡ.** Khi một trang chính thức ra mắt, phải gỡ tuyến đó khỏi danh sách header trong cùng commit. Nếu header vẫn noindex mà thẻ meta trong trang là `index`, công cụ tìm kiếm sẽ theo noindex.

**5. Quyết định riêng về soft 404.** URL không tồn tại vẫn trả HTTP 200 trên SPA. Chủ dự án chọn một trong hai:
- **Danh sách chặn:** chỉ noindex các tuyến đã liệt kê. URL sai vẫn có thể bị index.
- **Danh sách cho phép:** noindex mọi đường dẫn trừ `/` và tệp tĩnh. URL sai cũng được noindex, nhưng mỗi trang ra mắt phải được thêm vào danh sách cho phép.

**6. Kiểm chứng hai lớp.**
- Kiểm tĩnh bằng `tests/e2e/a05-vercel-headers.test.cjs`: mô phỏng cách Vercel so khớp `source` bằng `path-to-regexp` v6. Có 29 tuyến phải noindex, 7 tuyến không được noindex, và 1 mục ghi nhận quyết định soft 404.
- Kiểm thật trên Vercel preview qua header HTTP (A04).

Đã thử công cụ kiểm tĩnh với ba cấu hình:

| Cấu hình | Kết quả | Ý nghĩa |
|---|---|---|
| Mẫu đúng | 38/38 đạt | Công cụ chấp nhận cấu hình đúng |
| Mẫu sai | 7 trượt | Bắt được lỗi noindex toàn site làm noindex `/`, `robots.txt`, asset |
| `39a5835` | 30 trượt | Đúng thực tế, vì chưa áp A05 |

**Lưu ý:** công cụ chỉ mô phỏng. Kết luận cuối cùng vẫn phải dựa trên header thật của Vercel.

## 2. Phạm vi QA B04

Kiểm trên đúng SHA mới, ở 7 kích thước: 320, 360, 390, 768, 1366, 1440 và 1920px.

Ba bộ test 2A (100 test) chạy lại làm hồi quy.

| Nhóm | Kiểm tra | Cách kiểm |
|---|---|---|
| Cấu trúc | Đúng 6 section, đúng thứ tự; không có section Bác sĩ trưởng | Tự động |
| Section 1 | Headline chính xác, CTA `/dat-lich` và gọi hotline, ba khung ảnh | Tự động, xem ảnh |
| Section 2 | Ba giá trị, lối cấp cứu 24/24 | Tự động |
| Section 3 | Đúng 3 dịch vụ, "Xem tất cả dịch vụ", lối cấp cứu | Tự động |
| Section 4 | Một câu chuyện, nhãn minh họa, CTA "Đọc câu chuyện". Đích tới trang chi tiết là B03, thuộc Giai đoạn 3 | Tự động |
| Section 5 | 2–3 bài, nhãn bản mẫu, link `/bai-viet/:slug` | Tự động |
| Section 6 | CTA, hotline, giờ khám, địa chỉ, chỉ đường; **không có form** (B01) | Tự động |
| `/dat-lich` (B01) | Form có nhãn, có kiểm tra dữ liệu, không báo thành công giả; vòng focus | Tự động |
| Responsive | Không tràn ngang; ảnh không méo; chữ không bị cắt; nút không nằm ngoài màn hình | Tự động, ảnh toàn trang 7 kích thước |
| Ảnh, font | Ảnh tải được và có alt; Be Vietnam Pro và Lora tải, đủ dấu tiếng Việt | Tự động |
| Liên kết | Không có `href="#"`; link nội bộ không dẫn tới 404 | Tự động |
| Accessibility | Vòng focus; tương phản AA (chữ trên ảnh hoặc gradient phải xem bằng mắt); giảm chuyển động | Tự động, xem bằng mắt |
| Hiệu năng | CLS < 0.1 ở 390 và 1440px. Lighthouse mobile và desktop, 3 lượt, lấy trung vị | Tự động |
| SEO | Title, description, canonical, `lang=vi`, trang chủ không noindex | Tự động |
| Dữ liệu | Số liệu, tuyên bố "chuẩn quốc tế", đơn vị hành chính chưa xác nhận, cam kết ngày lễ (B02) | Tự động (heuristic), xem bằng mắt |
| UI/UX | Bố cục Editorial, so với mô tả AURA, hover, CTA nổi bật, cảm ứng ở tablet ngang | Xem ảnh. Không có mẫu AURA thì ghi chưa kiểm chứng |

**Công cụ** (không thêm dependency vào repo):
- `tests/e2e/2b.e2e.test.cjs`: 27 test.
- `tests/perf/lighthouse-2b.sh`: Lighthouse 12.8.2, cài trong thư mục kiểm tra riêng.
- `tests/e2e/a05-vercel-headers.test.cjs`.

**Lệnh chạy:**

```bash
BASE_URL=http://localhost:4173 EVIDENCE_DIR=./ev node --test tests/e2e/2b.e2e.test.cjs
LIGHTHOUSE_DIR=<thư mục có lighthouse> tests/perf/lighthouse-2b.sh http://localhost:4173/ ./ev/lh
APP_DIR=<bản sao> PATH_TO_REGEXP=<thư mục có path-to-regexp v6> node --test tests/e2e/a05-vercel-headers.test.cjs
```

## 3. Chạy thử trên `39a5835` (chỉ để hiệu chỉnh, không phải kết luận)

Bộ 2B: **27 test, 23 đạt, 4 trượt**, cả 4 đều đúng dự kiến:

| Test trượt | Nguyên nhân | Mục |
|---|---|---|
| Section 6 còn form | Chưa làm B01 | B01 |
| `/dat-lich` chưa có form | Chưa làm B01 | B01 |
| Có câu "… ngày lễ" ở Section 6 | Chưa xác minh | B02 |
| Ô nhập và ô chọn trong form không có vòng focus | **Phát hiện sớm.** Lỗi sẽ đi theo form sang `/dat-lich`, nên sửa cùng B01 | B01 |

Lighthouse 1 lượt, chỉ để thử script; B04 sẽ đo 3 lượt:

| Cấu hình | Performance | LCP | Phần tử LCP |
|---|---|---|---|
| Mobile | 72 | 5.1 s | Ảnh Hero |
| Desktop | 96 | 1.2 s | Ảnh Hero |

Accessibility, Best Practices và SEO đều 100; CLS 0. Lighthouse gợi ý tiết kiệm khoảng 244 KiB nhờ định dạng ảnh hiện đại, và khoảng 277 KiB nhờ ảnh theo kích thước màn hình. Đây là gợi ý để Antigravity cân nhắc, chưa phải lỗi.

Môi trường: `vite preview` cục bộ qua proxy, không phải Vercel.

## 4. Cần nhận khi giao B04

- Nhánh và **SHA mã** sau khi xong B01/B02, kèm báo cáo bàn giao.
- Kết quả B02 từ chủ dự án: cam kết ngày lễ, quyền sử dụng ảnh.
- Ảnh mẫu AURA, nếu muốn so sát Hero.
- URL preview Vercel, nếu có. Khi có, Lighthouse và A05 sẽ đo trên host thật.
