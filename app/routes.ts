import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  layout('layouts/public-layout.tsx', [
    // Trang chủ
    index('routes/home.tsx'),

    // Khối Về Lê Sơn (3A Hoàn thiện)
    route('gioi-thieu', 'routes/about.tsx'),
    route('doi-ngu', 'routes/team.tsx'),
    route('co-so-vat-chat', 'routes/facilities.tsx'),

    // Khối Dịch vụ (3A ComingSoon)
    route('dich-vu', 'routes/services.tsx'),
    route('dich-vu/kham-dieu-tri', 'routes/service-exam.tsx'),
    route('dich-vu/noi-tru', 'routes/service-inpatient.tsx'),
    route('dich-vu/spa', 'routes/service-spa.tsx'),
    route('dich-vu/cap-cuu', 'routes/service-emergency.tsx'),
    route('bang-gia', 'routes/pricing.tsx'),

    // Câu chuyện điều trị (3A ComingSoon)
    route('cau-chuyen', 'routes/stories.tsx'),
    route('cau-chuyen/:slug', 'routes/story-detail.tsx'),

    // Góc thú cưng & bài viết (3A ComingSoon)
    route('goc-thu-cung', 'routes/pet-corner.tsx'),
    route('bai-viet/:slug', 'routes/article-detail.tsx'),

    // Sản phẩm chọn lọc (3A ComingSoon)
    route('san-pham', 'routes/products.tsx'),

    // Đặt lịch & Liên hệ
    route('dat-lich', 'routes/booking.tsx'),
    route('lien-he', 'routes/contact.tsx'),

    // Tài khoản & Auth (3A ComingSoon)
    route('dang-nhap', 'routes/login.tsx'),
    route('dang-ky', 'routes/register.tsx'),
    route('tai-khoan/*', 'routes/customer-portal.tsx'),

    // 404 & catch-all
    route('*', 'routes/not-found.tsx'),
  ]),
] satisfies RouteConfig
