import type { Route } from './+types/service-inpatient'
import { ComingSoonView } from '@/components/layout/ComingSoonView'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Chăm sóc nội trú — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Quy trình chăm sóc lưu chuồng và chính sách cập nhật tình hình bé nội trú đang chờ xác nhận.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Chăm sóc nội trú — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Quy trình chăm sóc lưu chuồng và chính sách cập nhật tình hình bé nội trú đang chờ xác nhận.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ServiceInpatientRoute() {
  return (
    <ComingSoonView
      title="Chăm sóc nội trú"
      subtitle="Quy trình chăm sóc lưu chuồng và chính sách cập nhật tình hình bé nội trú đang chờ xác nhận."
    />
  )
}
