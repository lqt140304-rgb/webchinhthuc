# SEO & INDEXABILITY STRATEGY
## Bệnh viện Thú y Lê Sơn (le-son-website 2026)

Tài liệu này xác lập quy chuẩn SEO Onpage, cấu trúc dữ liệu y tế thú y (VeterinaryCare Schema) từ các dữ liệu đã xác minh, và giải pháp kỹ thuật bảo vệ indexability.

---

### 1. Ma Trận SEO Title, Description & Canonical URL (Chỉ áp dụng cho các trang chính thức)

> [!IMPORTANT]
> **Quy định đối với các trang Coming Soon & Placeholder:**
> Toàn bộ các route đang trong quá trình xây dựng nội dung đều gắn thẻ `<meta name="robots" content="noindex, nofollow" />` và **tuyệt đối không đưa vào XML sitemap**. Chỉ đưa các trang hoàn thiện vào index.

| Tuyến Đường (Route) | Page Title (≤ 60 ký tự) | Meta Description (140 - 155 ký tự) | Canonical Pattern | Index Status |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Bệnh viện Thú y Lê Sơn — Chăm Sóc Y Tế Chuẩn Mực | Bệnh viện Thú y Lê Sơn tại 101 Khuất Duy Tiến, Hà Nội. Dịch vụ khám, nội trú, phẫu thuật và cấp cứu thú cưng 24/24 với đội ngũ nhân viên y tế tận tâm. | `https://bvthuyleson.vn/` | Index |
| `/gioi-thieu` | Về Chúng Tôi — Bệnh viện Thú y Lê Sơn | Lịch sử hình thành, triết lý chăm sóc y khoa và sứ mệnh đồng hành bảo vệ sức khỏe bé cưng của Bệnh viện Thú y Lê Sơn. | `https://bvthuyleson.vn/gioi-thieu` | Noindex (Chờ nội dung) |
| `/doi-ngu` | Đội Ngũ Bác Sĩ — Bệnh viện Thú y Lê Sơn | Giới thiệu đội ngũ bác sĩ thú y Bệnh viện Thú y Lê Sơn, phụ trách chuyên môn bởi Bác sĩ trưởng Lê Thái Sơn. | `https://bvthuyleson.vn/doi-ngu` | Noindex (Chờ nội dung) |
| `/co-so-vat-chat` | Cơ Sở Vật Chất Phòng Khám — BV Thú y Lê Sơn | Phòng khám lâm sàng, phòng phẫu thuật chuyên dụng và khu lưu trú thú cưng tại 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội. | `https://bvthuyleson.vn/co-so-vat-chat` | Noindex (Chờ nội dung) |
| `/dich-vu` | Danh Mục Dịch Vụ — BV Thú y Lê Sơn | Tổng hợp các dịch vụ khám chữa bệnh, nội trú, spa grooming và cấp cứu 24/24 cho chó mèo tại BV Thú y Lê Sơn. | `https://bvthuyleson.vn/dich-vu` | Noindex (Chờ nội dung) |
| `/dich-vu/kham-dieu-tri` | Khám & Điều Trị Thú Cưng — BV Thú y Lê Sơn | Dịch vụ thăm khám lâm sàng, chẩn đoán hình ảnh và phẫu thuật ngoại khoa cho thú cưng tại Bệnh viện Thú y Lê Sơn. | `https://bvthuyleson.vn/dich-vu/kham-dieu-tri` | Noindex (Chờ nội dung) |
| `/dich-vu/noi-tru` | Chăm Sóc Nội Trú 24/7 — BV Thú y Lê Sơn | Khu vực nội trú chuyên biệt được vệ sinh khử khuẩn định kỳ, theo dõi chỉ số sức khỏe và cập nhật thông tin định kỳ cho chủ nuôi. | `https://bvthuyleson.vn/dich-vu/noi-tru` | Noindex (Chờ nội dung) |
| `/dich-vu/spa` | Spa & Grooming Chó Mèo — BV Thú y Lê Sơn | Dịch vụ tắm dưỡng, cắt tỉa lông thẩm mỹ và chăm sóc vệ sinh thú cưng tại Bệnh viện Thú y Lê Sơn. | `https://bvthuyleson.vn/dich-vu/spa` | Noindex (Chờ nội dung) |
| `/dich-vu/cap-cuu` | Cấp Cứu Thú Cưng 24/24 — Hotline: 097 355 51 05 | Tiếp nhận cấp cứu thú cưng 24/24 tại 101 Khuất Duy Tiến, Hà Nội. Hỗ trợ kịp thời các trường hợp ngộ độc, tai nạn khẩn cấp. | `https://bvthuyleson.vn/dich-vu/cap-cuu` | Noindex (Chờ nội dung) |
| `/bang-gia` | Bảng Giá Dịch Vụ Niêm Yết — BV Thú y Lê Sơn | Minh bạch thông tin chi phí khám và dịch vụ thú cưng tại Bệnh viện Thú y Lê Sơn. | `https://bvthuyleson.vn/bang-gia` | Noindex (Chờ nội dung) |
| `/cau-chuyen` | Câu Chuyện Điều Trị — BV Thú y Lê Sơn | Ghi nhận các ca bệnh điều trị phục hồi tại Bệnh viện Thú y Lê Sơn (chỉ đăng tải khi có sự đồng ý của chủ nuôi). | `https://bvthuyleson.vn/cau-chuyen` | Noindex (Chờ nội dung) |
| `/goc-thu-cung` | Góc Thú Cưng & Cẩm Nang — BV Thú y Lê Sơn | Tổng hợp thông tin, kiến thức chăm sóc, phòng bệnh và dinh dưỡng an toàn cho thú cưng. | `https://bvthuyleson.vn/goc-thu-cung` | Noindex (Chờ nội dung) |
| `/san-pham` | Sản Phẩm Chọn Lọc — BV Thú y Lê Sơn | Sản phẩm dinh dưỡng và phụ kiện chăm sóc thú cưng được nhân viên y tế bệnh viện tư vấn. | `https://bvthuyleson.vn/san-pham` | Noindex (Chờ nội dung) |
| `/dat-lich` | Đặt Lịch Khám Thú Cưng — BV Thú y Lê Sơn | Đặt lịch khám và dịch vụ cho thú cưng trực tuyến. Nhân viên bệnh viện sẽ liên hệ để xác nhận thời gian khám phù hợp. | `https://bvthuyleson.vn/dat-lich` | Noindex (Chờ nội dung) |
| `/lien-he` | Liên Hệ — 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội | Địa chỉ, số điện thoại hotline, thông tin liên hệ và thời gian tiếp nhận bệnh của Bệnh viện Thú y Lê Sơn. | `https://bvthuyleson.vn/lien-he` | Noindex (Chờ nội dung) |

---

### 2. Cấu Trúc Schema.org Xác Thực (VeterinaryCare LocalBusiness)

Chỉ sử dụng dữ liệu hành chính đã xác minh, loại bỏ hoàn toàn tọa độ giả định:
```json
{
  "@context": "https://schema.org",
  "@type": "VeterinaryCare",
  "name": "Bệnh viện Thú y Lê Sơn",
  "url": "https://bvthuyleson.vn",
  "telephone": "+84973555105",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "101 Khuất Duy Tiến, Phường Nhân Chính",
    "addressLocality": "Quận Thanh Xuân",
    "addressRegion": "Hà Nội",
    "addressCountry": "VN"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "21:00",
      "description": "Giờ khám tham chiếu"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59",
      "description": "Cấp cứu 24/24"
    }
  ]
}
```

---

### 3. XML Sitemap & Robots Cấu Hình

- **Cấu hình `robots.txt`:**
```
User-agent: *
Allow: /
Disallow: /tai-khoan/
Disallow: /dang-nhap
Disallow: /dang-ky

Sitemap: https://bvthuyleson.vn/sitemap.xml
```

- **Quy tắc sitemap.xml:**
Chỉ bao gồm trang `/` ở giai đoạn này. Các trang Coming Soon tuyệt đối **không** được đưa vào file XML sitemap để tránh tạo lỗi soft 404 cho Googlebot.
