# SITEMAP, ROUTING & ACCESS CONTROL ARCHITECTURE
## Bệnh viện Thú y Lê Sơn (le-son-website 2026)

---

### 1. Kiến Trúc Tuyến Đường & Phân Nhóm Chức Năng (20 Tuyến Trang)

```
/ (Trang chủ - 6 Section Editorial Luxury)
├── /gioi-thieu (Giới thiệu, lịch sử hình thành & triết lý điều trị)
├── /doi-ngu (Đội ngũ bác sĩ, nổi bật BST Lê Thái Sơn)
├── /co-so-vat-chat (Hệ thống phòng khám, phòng phẫu thuật vô trùng, khu lưu trú)
├── /dich-vu (Tổng quan danh mục dịch vụ thú y)
│   ├── /dich-vu/kham-dieu-tri (Khám lâm sàng, chẩn đoán hình ảnh, xét nghiệm)
│   ├── /dich-vu/noi-tru (Chăm sóc nội trú 24/7 & báo cáo phục hồi)
│   ├── /dich-vu/spa (Vệ sinh y tế, tắm trị liệu, cắt tỉa grooming)
│   └── /dich-vu/cap-cuu (Cấp cứu khẩn cấp 24/24 & đường dây nóng)
├── /bang-gia (Bảng niêm yết chi phí dịch vụ công khai, minh bạch)
├── /cau-chuyen (Kho lưu trữ hành trình điều trị tiêu biểu)
│   └── /cau-chuyen/:slug (Chi tiết ca điều trị phục hồi - chỉ ca bệnh đã xác minh)
├── /goc-thu-cung (Chuyên mục cẩm nang & tin tức thú cưng)
│   └── /bai-viet/:slug (Chi tiết bài viết kiến thức chăm sóc, dinh dưỡng, phòng bệnh)
├── /san-pham (Editorial Product Gallery - dinh dưỡng & phụ kiện y tế chọn lọc)
├── /dat-lich (Form tiếp nhận lịch khám đa bước, kiểm tra dữ liệu nghiêm ngặt)
├── /lien-he (Thông tin liên hệ, bản đồ 101 Khuất Duy Tiến, hotline 24/24)
├── /dang-nhap (Đăng nhập tài khoản khách hàng)
├── /dang-ky (Đăng ký tài khoản hồ sơ thú cưng)
└── /tai-khoan/* (Cổng thông tin khách hàng - kiểm soát phân quyền nghiêm ngặt)
    ├── /tai-khoan/ho-so (Hồ sơ thú cưng được phép hiển thị)
    ├── /tai-khoan/lich-hen (Lịch hẹn khám của tài khoản)
    ├── /tai-khoan/tai-kham (Lịch hẹn tái khám & tiêm chủng dự kiến do bác sĩ chỉ định)
    ├── /tai-khoan/bao-cao-suc-khoe (Báo cáo sức khỏe tóm tắt được duyệt chia sẻ)
    ├── /tai-khoan/nhat-ky-noi-tru (Nhật ký & video nội trú được duyệt công khai)
    └── /tai-khoan/don-hang (Lịch sử đơn hàng sản phẩm)
```

---

### 2. Ma Trận Phân Quyền Cổng Khách Hàng (`/tai-khoan/*`)

Để đảm bảo an toàn y khoa, bảo mật dữ liệu cá nhân theo tiêu chuẩn y tế và ngăn chặn rò rỉ y lệnh nghiệp vụ, phân quyền dữ liệu được quy định rõ ràng:

#### A. Dữ liệu KHÁCH HÀNG ĐƯỢC PHÉP TRUY CẬP:
1. **Thông tin hồ sơ thú cưng được phép hiển thị:** Tên bé, giống loài, ngày sinh/tuổi ước tính, cân nặng gần nhất, ảnh đại diện, mã định danh thú cưng (Pet ID).
2. **Lịch hẹn của tài khoản:** Danh sách các lượt đặt hẹn khám/spa (thời gian, cơ sở, dịch vụ đăng ký, trạng thái tiếp nhận từ bệnh viện).
3. **Lịch hẹn tái khám / Tiêm chủng dự kiến:** Chỉ hiển thị ngày hẹn dự kiến và mục đích tái khám do bác sĩ điều trị chỉ định trong kết luận khám và đã được phê duyệt công khai cho khách hàng. *(Đã loại bỏ cơ chế "nhắc lịch tiêm" tự động mơ hồ không qua bác sĩ xác nhận).*
4. **Báo cáo sức khỏe được phép chia sẻ:** Bản tóm tắt tình trạng lâm sàng xuất viện, dặn dò chăm sóc tại nhà, hướng dẫn dinh dưỡng được bác sĩ ký duyệt hiển thị cho chủ nuôi.
5. **Nhật ký & Video nội trú được phép công khai:** Các bản cập nhật trạng thái tổng quan (ăn uống, vận động, vệ sinh) và video clip ngắn đã được kiểm duyệt trước khi tải lên.
6. **Lịch sử mua sắm:** Danh mục các sản phẩm dinh dưỡng, thực phẩm chức năng, phụ kiện đã mua kèm hóa đơn điện tử.

#### B. Dữ liệu TUYỆT ĐỐI KHÔNG ĐƯỢC HIỂN THỊ cho khách hàng:
- ❌ **Tên thuốc điều trị nội bộ:** Hoạt chất y khoa đặc trị chỉ lưu hành nội bộ bệnh viện.
- ❌ **Liều lượng và nồng độ thuốc:** Tránh chủ nuôi tự ý ghi chép, sao chép hoặc tự mua thuốc điều trị sai quy cách gây nguy hiểm cho tính mạng thú cưng.
- ❌ **Thời điểm tiêm thuốc cụ thể & kỹ thuật tiêm:** Quy trình thực hiện của điều dưỡng/kỹ thuật viên thú y.
- ❌ **Y lệnh nội bộ & Ghi chú nghiệp vụ:** Các chỉ định hội chẩn, nhận định nội bộ giữa các bác sĩ.
- ❌ **Nhật ký thao tác hệ thống (Audit logs):** Thời gian chỉnh sửa bệnh án, tài khoản nhân viên thao tác.
- ❌ **Dữ liệu của khách hàng khác:** Tuyệt đối cô lập dữ liệu theo `user_id` và `pet_id`, ngăn chặn hoàn toàn lỗi phân quyền ngang (IDOR).

---

### 3. Header & Navigation Structure

#### Desktop Header:
- **Logo (Trái):** Biểu tượng & Chữ thương hiệu *Bệnh viện Thú y Lê Sơn*.
- **Cụm Menu (Giữa):**
  - `Trang chủ` (`/`)
  - `Về Lê Sơn` (Dropdown):
    - Giới thiệu (`/gioi-thieu`)
    - Đội ngũ bác sĩ (`/doi-ngu`)
    - Cơ sở vật chất (`/co-so-vat-chat`)
  - `Dịch vụ` (Dropdown):
    - Khám & điều trị (`/dich-vu/kham-dieu-tri`)
    - Nội trú (`/dich-vu/noi-tru`)
    - Spa & Grooming (`/dich-vu/spa`)
    - Cấp cứu 24/24 (`/dich-vu/cap-cuu` - Có badge Warm Orange nổi bật)
    - Bảng giá (`/bang-gia`)
  - `Câu chuyện` (`/cau-chuyen`)
  - `Góc thú cưng` (Dropdown):
    - Kiến thức chăm sóc (`/goc-thu-cung`)
    - Tin tức hoạt động (`/goc-thu-cung?cat=news`)
    - Sản phẩm chọn lọc (`/san-pham`)
- **Cụm Hành Động (Phải):**
  - Đăng nhập (`/dang-nhap`) | Đăng ký (`/dang-ky`)
  - **Nút CTA chính:** `Đặt lịch khám` (`/dat-lich`)

#### Mobile Navigation & Quick Actions:
- **Top Bar:** Logo + Hotline Cấp cứu 24/24 (`tel:0973555105`) + Nút mở Drawer điều hướng.
- **Drawer Menu:** Accordion phân cấp, hỗ trợ đóng nhanh bằng phím ESC và nút đóng.
- **Floating Bottom Bar:** Nút Gọi Hotline và Nút Đặt lịch khám gắn cố định chân màn hình trên thiết bị di động.

---

### 4. Quản Lý Route Trống & Ngăn Ngừa Liên Kết Chết (Dead-link Prevention)

Các route thuộc Giai đoạn 3 khi chưa xây dựng nội dung chính thức sẽ được điều hướng về một **Editorial Placeholder Component (`ComingSoonView`)** đồng bộ chuẩn thương hiệu:
- Giữ nguyên Header, Footer và thanh Hotline.
- Hiển thị thông điệp trang trọng: *"Trang đang được hoàn thiện nội dung chính thức theo tiêu chuẩn Bệnh viện Thú y Lê Sơn"*.
- Cung cấp 2 nút điều hướng an toàn: `Quay lại Trang chủ` và `Liên hệ tư vấn / Đặt lịch`.
- Tuyệt đối không để xảy ra màn hình trắng, lỗi console hoặc mã lỗi 404 gãy đối với các tuyến đường trong sitemap.
