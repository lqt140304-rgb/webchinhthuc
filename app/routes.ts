import { type RouteConfig, index, route, layout } from '@react-router/dev/routes'

export default [
  layout('layouts/public-layout.tsx', [
    index('routes/home.tsx'),
    route('gioi-thieu', 'routes/about.tsx'),
    route('doi-ngu', 'routes/team.tsx'),
    route('co-so-vat-chat', 'routes/facilities.tsx'),
    route('spike-seo-test', 'routes/spike-seo-test.tsx'),
    route('dat-lich', 'routes/booking.tsx'),
    // Private application placeholders (Customer & Staff Portals)
    route('tai-khoan/*', 'routes/customer-portal.tsx'),
    route('quan-ly/*', 'routes/staff-portal.tsx'),
    // 404 page for static prerendering
    route('404', 'routes/static-404.tsx'),
    // Catch-all 404 for client-side navigation
    route('*', 'routes/not-found.tsx'),
  ]),
] satisfies RouteConfig
