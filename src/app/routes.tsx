import { Routes, Route } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { ComingSoonView } from '@/components/layout/ComingSoonView'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Trang chủ */}
        <Route path="/" element={<HomePage />} />

        {/* Khối Về Lê Sơn */}
        <Route
          path="/gioi-thieu"
          element={
            <ComingSoonView
              title="Về Bệnh viện Thú y Lê Sơn"
              subtitle="Lịch sử hình thành, triết lý y khoa và hành trình đồng hành cùng sức khỏe thú cưng đang được chuẩn hóa nội dung."
            />
          }
        />
        <Route
          path="/doi-ngu"
          element={
            <ComingSoonView
              title="Đội ngũ bác sĩ & chuyên môn"
              subtitle="Hồ sơ Bác sĩ trưởng Lê Thái Sơn và đội ngũ kỹ thuật viên đang được xác thực trước khi công khai."
            />
          }
        />
        <Route
          path="/co-so-vat-chat"
          element={
            <ComingSoonView
              title="Cơ sở vật chất & Trang thiết bị"
              subtitle="Hình ảnh thực tế hệ thống phòng khám, phòng mổ và khu lưu trú tại 101 Khuất Duy Tiến đang được chụp và cập nhật."
            />
          }
        />

        {/* Khối Dịch vụ */}
        <Route
          path="/dich-vu"
          element={
            <ComingSoonView
              title="Danh mục dịch vụ y tế"
              subtitle="Tổng hợp các giải pháp chăm sóc y tế toàn diện cho thú cưng đang được biên tập chi tiết."
            />
          }
        />
        <Route
          path="/dich-vu/kham-dieu-tri"
          element={
            <ComingSoonView
              title="Khám & điều trị thú cưng"
              subtitle="Quy trình khám lâm sàng, chẩn đoán cận lâm sàng và phác đồ điều trị đang được chuẩn hóa."
            />
          }
        />
        <Route
          path="/dich-vu/noi-tru"
          element={
            <ComingSoonView
              title="Chăm sóc nội trú 24/7"
              subtitle="Quy trình chăm sóc lưu chuồng và chính sách cập nhật tình hình bé nội trú đang được xác nhận."
            />
          }
        />
        <Route
          path="/dich-vu/spa"
          element={
            <ComingSoonView
              title="Spa & Grooming thẩm mỹ"
              subtitle="Các gói vệ sinh, tắm trị liệu và tạo hình thú cưng đang được biên tập bảng thông số."
            />
          }
        />
        <Route
          path="/dich-vu/cap-cuu"
          element={
            <ComingSoonView
              title="Tiếp nhận Cấp cứu 24/24"
              subtitle="Quy trình hướng dẫn sơ cứu khẩn cấp và đường dây nóng 097 355 51 05 luôn sẵn sàng phục vụ."
            />
          }
        />
        <Route
          path="/bang-gia"
          element={
            <ComingSoonView
              title="Bảng giá dịch vụ niêm yết"
              subtitle="Biểu phí dịch vụ khám, xét nghiệm và điều trị đang được đối chiếu niêm yết chính thức."
            />
          }
        />

        {/* Câu chuyện điều trị */}
        <Route
          path="/cau-chuyen"
          element={
            <ComingSoonView
              title="Hành trình điều trị tiêu biểu"
              subtitle="Các câu chuyện phục hồi thực tế của các bé cưng đang được xin ý kiến đồng thuận từ chủ nuôi."
            />
          }
        />
        <Route
          path="/cau-chuyen/:slug"
          element={
            <ComingSoonView
              title="Chi tiết câu chuyện điều trị"
              subtitle="Nội dung ca bệnh đang được chuẩn bị theo chuẩn y khoa không công khai y lệnh bảo mật."
            />
          }
        />

        {/* Góc thú cưng & bài viết */}
        <Route
          path="/goc-thu-cung"
          element={
            <ComingSoonView
              title="Góc thú cưng & Cẩm nang kiến thức"
              subtitle="Kho kiến thức y khoa, dinh dưỡng và phòng bệnh từ bác sĩ thú y đang được biên tập."
            />
          }
        />
        <Route
          path="/bai-viet/:slug"
          element={
            <ComingSoonView
              title="Chi tiết bài viết cẩm nang"
              subtitle="Bài viết đang được rà soát nội dung trước khi xuất bản."
            />
          }
        />

        {/* Sản phẩm chọn lọc */}
        <Route
          path="/san-pham"
          element={
            <ComingSoonView
              title="Sản phẩm dinh dưỡng & Phụ kiện y tế"
              subtitle="Danh mục sản phẩm chính hãng chọn lọc đang được cập nhật tồn kho và mô tả công dụng."
            />
          }
        />

        {/* Đặt lịch & Liên hệ */}
        <Route
          path="/dat-lich"
          element={
            <ComingSoonView
              title="Đặt lịch khám trực tuyến"
              subtitle="Form đặt lịch thông minh với 6 trạng thái xử lý đang được hoàn thiện ở Giai đoạn 4. Quý khách vui lòng gọi hotline 097 355 51 05 để đặt hẹn ngay."
            />
          }
        />
        <Route
          path="/lien-he"
          element={
            <ComingSoonView
              title="Liên hệ & Thông tin phòng khám"
              subtitle="Địa chỉ: 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội | Hotline 24/24: 097 355 51 05."
            />
          }
        />

        {/* Tài khoản & Auth */}
        <Route
          path="/dang-nhap"
          element={
            <ComingSoonView
              title="Đăng nhập Cổng khách hàng"
              subtitle="Chức năng đăng nhập an toàn sẽ được tích hợp theo đúng lộ trình Giai đoạn 4."
            />
          }
        />
        <Route
          path="/dang-ky"
          element={
            <ComingSoonView
              title="Đăng ký tài khoản hồ sơ thú cưng"
              subtitle="Chức năng tạo tài khoản sẽ được tích hợp theo đúng lộ trình Giai đoạn 4."
            />
          }
        />
        <Route
          path="/tai-khoan/*"
          element={
            <ComingSoonView
              title="Cổng quản lý hồ sơ thú cưng"
              subtitle="Khu vực dành riêng cho khách hàng theo dõi lịch hẹn và báo cáo sức khỏe được bác sĩ ký duyệt."
            />
          }
        />

        {/* Route 404 cho bất kỳ URL nào không thuộc sitemap */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
