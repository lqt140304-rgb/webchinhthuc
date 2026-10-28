import type { Route } from './+types/customer-portal'
import { ComingSoonView } from '@/components/layout/ComingSoonView'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Cổng quản lý hồ sơ thú cưng — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Khu vực dành riêng cho khách hàng theo dõi lịch hẹn và báo cáo sức khỏe được bác sĩ ký duyệt.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Cổng quản lý hồ sơ thú cưng — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Khu vực dành riêng cho khách hàng theo dõi lịch hẹn và báo cáo sức khỏe được bác sĩ ký duyệt.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function CustomerPortalRoute() {
  return (
    <ComingSoonView
      title="Cổng quản lý hồ sơ thú cưng"
      subtitle="Khu vực dành riêng cho khách hàng theo dõi lịch hẹn và báo cáo sức khỏe được bác sĩ ký duyệt."
    />
  )
}
