// ============================================================================
// LÊ SƠN VETERINARY HOSPITAL — TRANSITIONAL SPA ROUTE DEFINITIONS
// Lưu ý: File này được duy trì để đồng bộ tương thích ngược (backward compatibility)
// cho kiến trúc SPA/client runtime. Định tuyến chuẩn React Router 7 nằm tại app/routes.ts
// và các route module tương ứng tại app/routes/*.
// ============================================================================

import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { ComingSoonView } from '@/components/layout/ComingSoonView'
import { HomePage } from '@/pages/HomePage'
import { BookingPage } from '@/pages/BookingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const AboutPage = lazy(() => import('@/pages/AboutPage'))
const TeamPage = lazy(() => import('@/pages/TeamPage'))
const FacilitiesPage = lazy(() => import('@/pages/FacilitiesPage'))
const ServicesPage = lazy(() => import('@/pages/ServicesPage'))
const ServiceExamPage = lazy(() => import('@/pages/ServiceExamPage'))
const ServiceInpatientPage = lazy(() => import('@/pages/ServiceInpatientPage'))
const ServiceSpaPage = lazy(() => import('@/pages/ServiceSpaPage'))
const EmergencyPage = lazy(() => import('@/pages/EmergencyPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const PricingPage = lazy(() => import('@/pages/PricingPage'))
const ProductsPage = lazy(() => import('@/pages/ProductsPage'))
const StoriesPage = lazy(() => import('@/pages/StoriesPage'))
const StoryDetailPage = lazy(() => import('@/pages/StoryDetailPage'))
const PetCornerPage = lazy(() => import('@/pages/PetCornerPage'))
const ArticleDetailPage = lazy(() => import('@/pages/ArticleDetailPage'))

const PageLoadingFallback = () => (
  <div
    className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]"
    role="status"
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
            <Suspense fallback={<PageLoadingFallback />}>
              <ServicesPage />
            </Suspense>
          }
        />
        <Route
          path="/dich-vu/kham-dieu-tri"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <ServiceExamPage />
            </Suspense>
          }
        />
        <Route
          path="/dich-vu/noi-tru"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <ServiceInpatientPage />
            </Suspense>
          }
        />
        <Route
          path="/dich-vu/spa"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <ServiceSpaPage />
            </Suspense>
          }
        />
        <Route
          path="/dich-vu/cap-cuu"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <EmergencyPage />
            </Suspense>
          }
        />
        <Route
          path="/bang-gia"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <PricingPage />
            </Suspense>
          }
        />

        {/* Câu chuyện điều trị */}
        <Route
          path="/cau-chuyen"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <StoriesPage />
            </Suspense>
          }
        />
        <Route
          path="/cau-chuyen/:slug"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <StoryDetailPage />
            </Suspense>
          }
        />

        {/* Góc thú cưng & bài viết */}
        <Route
          path="/goc-thu-cung"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <PetCornerPage />
            </Suspense>
          }
        />
        <Route
          path="/bai-viet/:slug"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <ArticleDetailPage />
            </Suspense>
          }
        />

        {/* Sản phẩm chọn lọc */}
        <Route
          path="/san-pham"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <ProductsPage />
            </Suspense>
          }
        />

        {/* Đặt lịch & Liên hệ */}
        <Route path="/dat-lich" element={<BookingPage />} />
        <Route
          path="/lien-he"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <ContactPage />
            </Suspense>
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
