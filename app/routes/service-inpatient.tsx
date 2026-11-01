import type { Route } from './+types/service-inpatient'
import { ServiceInpatientPage } from '@/pages/ServiceInpatientPage'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Chăm sóc nội trú — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Dịch vụ lưu trú và chăm sóc theo dõi sức khỏe cho thú cưng tại cơ sở 101 Khuất Duy Tiến. Vui lòng liên hệ hotline để được tư vấn chi tiết.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Chăm sóc nội trú — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Dịch vụ lưu trú và chăm sóc theo dõi sức khỏe cho thú cưng tại cơ sở 101 Khuất Duy Tiến. Vui lòng liên hệ hotline để được tư vấn chi tiết.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ServiceInpatientRoute() {
  return <ServiceInpatientPage />
}
