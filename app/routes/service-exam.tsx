import type { Route } from './+types/service-exam'
import { ComingSoonView } from '@/components/layout/ComingSoonView'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Khám & điều trị thú cưng — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Quy trình khám lâm sàng, chẩn đoán cận lâm sàng và phác đồ điều trị đang được chuẩn hóa.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Khám & điều trị thú cưng — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Quy trình khám lâm sàng, chẩn đoán cận lâm sàng và phác đồ điều trị đang được chuẩn hóa.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ServiceExamRoute() {
  return (
    <ComingSoonView
      title="Khám & điều trị thú cưng"
      subtitle="Quy trình khám lâm sàng, chẩn đoán cận lâm sàng và phác đồ điều trị đang được chuẩn hóa."
    />
  )
}
