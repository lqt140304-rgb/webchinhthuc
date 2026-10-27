import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { ComingSoonView } from '@/components/layout/ComingSoonView'
import { HomePage } from '@/pages/HomePage'
import { BookingPage } from '@/pages/BookingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { HOSPITAL_CONTACT } from '@/config/contact'

const AboutPage = lazy(() => import('@/pages/AboutPage'))
const TeamPage = lazy(() => import('@/pages/TeamPage'))
const FacilitiesPage = lazy(() => import('@/pages/FacilitiesPage'))

const PageLoadingFallback = () => (
  <div
    className="min-h-[50vh] flex items-center justify-center"
    aria-busy="true"
    aria-label="Đang tải trang"
  >
    <div className="w-8 h-8 rounded-full border-2 border-[var(--color-plum-primary)] border-t-transparent animate-spin" />
  </div>
)

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
            <Suspense fallback={<PageLoadingFallback />}>
              <AboutPage />
            </Suspense>
          }
        />
        <Route
          path="/doi-ngu"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <TeamPage />
            </Suspense>
          }
        />
        <Route
          path="/co-so-vat-chat"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <FacilitiesPage />
            </Suspense>
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
              subtitle={`Quy trình hướng dẫn sơ cứu khẩn cấp và đường dây nóng ${HOSPITAL_CONTACT.hotlineDisplay} luôn sẵn sàng phục vụ.`}
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
        <Route path="/dat-lich" element={<BookingPage />} />
        <Route
          path="/lien-he"
          element={
            <ComingSoonView
              title="Liên hệ & Thông tin phòng khám"
              subtitle={`Địa chỉ: ${HOSPITAL_CONTACT.address} | Hotline 24/24: ${HOSPITAL_CONTACT.hotlineDisplay}.`}
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
