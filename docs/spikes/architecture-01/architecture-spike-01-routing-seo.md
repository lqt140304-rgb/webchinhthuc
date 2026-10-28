# CHUYÊN ĐỀ KIẾN TRÚC ĐIỀU HƯỚNG & SEO — ARCHITECTURE SPIKE 01
## Cơ Chế Routing, Open Graph Metadata & Giải Pháp Xử Lý Triệt Để Soft 404

| Hạng mục | Thông tin chi tiết |
| :--- | :--- |
| **Dự án** | Website Bệnh viện Thú y Lê Sơn 2026 (`lqt140304-rgb/webchinhthuc`) |
| **Căn cứ chỉ đạo** | **CEO DIRECTIVE 049-A** — Gate A & Gate B Evaluation |
| **Nhánh Spike** | `spike/architecture-01-rr7-prerender` |
| **Chủ đề** | Quản trị thẻ Head, Khả năng đọc của Zalo/Facebook Bot và Cơ chế HTTP 404 |

---

## 1. SO SÁNH CƠ CHẾ ĐIỀU HƯỚNG & QUẢN TRỊ METADATA

### 1.1. Kiến trúc hiện tại: Vite SPA (React Router 7 Library Mode)

```text
Trình duyệt / Bot gửi GET /gioi-thieu
          │
          ▼
   [ Vercel Edge ]  ──(Quy tắc rewrite toàn cục /(.*))──► Trả về /dist/index.html (Mã HTTP 200)
          │
          ▼
   Nội dung HTML nhận được:
   - <title>: "Bệnh viện Thú y Lê Sơn — Chăm Sóc Y Tế Thú Cưng Chuẩn Mực" (Cố định của Trang chủ)
   - <meta description>: Mô tả chung của Trang chủ
   - <body>: <div id="root"></div> (RỖNG HOÀN TOÀN)
          │
          ▼
   Trình duyệt tải xong bundle JS -> Thực thi React -> Hook useRouteSeo chạy trong useEffect
   -> Sửa đổi document.title trên client sau khi trang đã render xong!
```

> [!WARNING] Hệ quả tiêu cực trên Vite SPA
> 1. **Mạng xã hội (Zalo, Facebook):** Bot cào dữ liệu không chạy JavaScript. Khi người dùng chia sẻ link `/gioi-thieu` hoặc `/doi-ngu`, ảnh thumbnail và tiêu đề xem trước luôn hiển thị thông tin chung của Trang chủ hoặc rỗng.
> 2. **SEO Google:** Mặc dù Googlebot có thể render JS, nhưng quá trình này bị đẩy vào hàng đợi trễ (two-wave indexing), gây bất lợi lớn cho thứ hạng tìm kiếm địa phương.
> 3. **Soft 404:** Bất kỳ đường dẫn rác nào (ví dụ: `/khong-ton-tai`) đều được Vercel trả về `index.html` với mã HTTP 200 OK. Sau đó React mới vẽ trang 404 trên giao diện. Các công cụ tìm kiếm coi đây là lỗi Soft 404 nghiêm trọng.

---

### 1.2. Kiến trúc thử nghiệm: React Router 7 Framework Mode + Prerender

```text
Trình duyệt / Bot gửi GET /gioi-thieu
          │
          ▼
   [ Vercel Edge ]  ──(Khớp tệp tin tĩnh build/client/gioi-thieu/index.html)──► Trả về mã HTTP 200
          │
          ▼
   Nội dung HTML nhận được:
   - <title>: "Về Bệnh Viện Thú Y Lê Sơn — Lịch Sử & Tôn Chỉ Y Khoa"
   - <meta description>: "Tìm hiểu hành trình thành lập, đội ngũ chuyên môn..."
   - <meta property="og:title">: Đúng tiêu đề trang Giới thiệu
   - <meta property="og:image">: https://lesonpet.vn/images/og-about.webp
   - <link rel="canonical">: https://lesonpet.vn/gioi-thieu
   - <body>: Toàn bộ nội dung Header, Breadcrumb, Hero, Câu chuyện, Triết lý, Footer
          │
          ▼
   Trình duyệt hiển thị ngay lập tức (0ms trễ JS) -> Bundle JS bù nước kích hoạt menu và dialog.
```

---

## 2. QUẢN TRỊ THẺ HEAD BẰNG HÀM `meta()` CỦA ROUTE MODULE

Trong React Router 7 Framework Mode, mỗi tệp tin route xuất bản một hàm `meta()` độc lập. Hàm này được Node.js thực thi tại thời điểm build để tiêm trực tiếp vào thẻ `<head>` của từng tệp HTML tĩnh:

```tsx
// app/routes/about.tsx
export function meta() {
  return [
    { title: 'Về Bệnh Viện Thú Y Lê Sơn — Lịch Sử & Tôn Chỉ Y Khoa' },
    {
      name: 'description',
      content:
        'Tìm hiểu hành trình thành lập, đội ngũ chuyên môn và tôn chỉ phụng sự sự sống của Bệnh viện Thú y Lê Sơn tại 101 Khuất Duy Tiến, Hà Nội.',
    },
    { property: 'og:title', content: 'Về Bệnh Viện Thú Y Lê Sơn — Lịch Sử & Tôn Chỉ Y Khoa' },
    {
      property: 'og:description',
      content:
        'Tìm hiểu hành trình thành lập, đội ngũ chuyên môn và tôn chỉ phụng sự sự sống của Bệnh viện Thú y Lê Sơn tại 101 Khuất Duy Tiến, Hà Nội.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://lesonpet.vn/gioi-thieu' },
    { property: 'og:image', content: 'https://lesonpet.vn/images/og-about.webp' },
    { tagName: 'link', rel: 'canonical', href: 'https://lesonpet.vn/gioi-thieu' },
  ]
}
```

Ưu điểm vượt trội:
- **Loại bỏ phụ thuộc thư viện ngoài:** Không cần cài đặt `react-helmet-async` hay quản lý HelmetProvider.
- **Tính tĩnh tuyệt đối:** Không lo lắng về rò rỉ bộ nhớ (memory leak) trên SSR hoặc render sai lệch thứ tự.

---

## 3. CƠ CHẾ BẢO VỆ DỮ LIỆU RIÊNG TƯ (PRIVATE APPLICATION SPA FALLBACK)

Theo quy chế Architecture Baseline V1, hai khu vực quản trị nội bộ:
1. **Customer Portal:** `/tai-khoan/*`
2. **Staff & Management Portal:** `/quan-ly/*`

Các trang này đòi hỏi bảo mật nghiêm ngặt, tuyệt đối không được để lộ cấu trúc dữ liệu y khoa hoặc thông tin khách hàng ra ngoài các file tĩnh.

### Giải pháp kỹ thuật được kiểm chứng trong Spike:
Trong `react-router.config.ts`, danh sách `prerender()` **chỉ bao gồm các public routes**:
```ts
prerender: ['/', '/gioi-thieu', '/doi-ngu', '/co-so-vat-chat', '/dat-lich', '/404']
```

- Các route `/tai-khoan/*` và `/quan-ly/*` **KHÔNG** nằm trong danh sách prerender.
- React Router 7 tự động tạo một tệp tin tĩnh đặc biệt: `build/client/__spa-fallback.html`.
- Tệp tin này là một vỏ rỗng bảo mật (chỉ có thẻ `<head>`, font preloads, CSS và script loader).
- Khi người dùng truy cập `/tai-khoan/lich-hen`, máy chủ phục vụ file `__spa-fallback.html`. Mã JavaScript trên client sẽ kiểm tra token xác thực, gọi API backend có kiểm soát quyền và hiển thị dashboard.
- **Kết quả kiểm chứng:** Quét mã nguồn `__spa-fallback.html` xác nhận: **0 byte** dữ liệu khách hàng hoặc y lệnh bị lọt vào static bundle.

---

## 4. GIẢI PHÁP XỬ LÝ TRIỆT ĐỂ SOFT 404 TRÊN HẠ TẦNG VERCEL

### 4.1. Nguyên nhân gốc rễ của lỗi Soft 404 hiện tại
Trong tệp tin `vercel.json` hiện tại của nhánh chính:
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```
Quy tắc regex `/(.*)` chuyển hướng **tất cả** mọi request không khớp file tĩnh về `index.html`. Với Vercel, khi rewrite khớp đích đến, Vercel trả về mã trạng thái **HTTP 200 OK**.

### 4.2. Cấu hình Vercel tối ưu cho React Router 7 Framework Mode
Để vừa hỗ trợ SPA cho các portal nội bộ, vừa trả về **HTTP 404 thật** cho các URL sai, cấu hình `vercel.json` được thiết kế lại như sau:

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(tai-khoan|quan-ly)/(.*)",
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
      "source": "/tai-khoan/(.*)",
      "destination": "/__spa-fallback.html"
    },
    {
      "source": "/quan-ly/(.*)",
      "destination": "/__spa-fallback.html"
    }
  ]
}
```

### Cơ chế xử lý của Vercel với cấu hình mới:
1. **Người dùng truy cập `/gioi-thieu`:** Vercel tìm thấy static file `build/client/gioi-thieu/index.html` $\to$ Phục vụ ngay lập tức với mã **HTTP 200 OK**.
2. **Khách hàng truy cập `/tai-khoan/ho-so`:** Khớp quy tắc rewrite $\to$ Phục vụ `__spa-fallback.html` với mã **HTTP 200 OK** kèm header `X-Robots-Tag: noindex, nofollow`.
3. **Bot/Người dùng truy cập `/duong-dan-khong-ton-tai`:**
   - Không khớp bất kỳ static file nào trong `build/client/`.
   - Không khớp quy tắc rewrite `/tai-khoan/` hay `/quan-ly/`.
   - Vercel tự động tìm tệp tin `404.html` ở thư mục gốc của bản build $\to$ Phục vụ trang báo lỗi và trả về mã trạng thái chuẩn xác: **HTTP 404 Not Found**!

> [!IMPORTANT] Đánh giá Gate B
> Bằng cách tạo sẵn tệp `404.html` từ route `/404` và loại bỏ rewrite toàn cục `/(.*)`, kiến trúc mới cho phép giải quyết triệt để lỗi Soft 404 mà vẫn duy trì toàn vẹn tính năng SPA của hai cổng nội bộ.
