import type { Route } from './+types/service-spa'
import { ServiceSpaPage } from '@/pages/ServiceSpaPage'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Spa & Grooming thẩm mỹ — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Dịch vụ vệ sinh, tắm sấy và cắt tỉa thẩm mỹ cho thú cưng tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến). Xem quy trình mẫu và đặt lịch hẹn trực tuyến.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Spa & Grooming thẩm mỹ — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Dịch vụ vệ sinh, tắm sấy và cắt tỉa thẩm mỹ cho thú cưng tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến). Xem quy trình mẫu và đặt lịch hẹn trực tuyến.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ServiceSpaRoute() {
  return <ServiceSpaPage />
}
