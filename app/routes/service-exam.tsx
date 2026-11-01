import type { Route } from './+types/service-exam'
import { ServiceExamPage } from '@/pages/ServiceExamPage'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Khám & điều trị thú cưng — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Dịch vụ khám lâm sàng, xét nghiệm, siêu âm, chụp X-quang và phẫu thuật tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến); tiếp nhận khám 08:00 – 21:00 và cấp cứu 24/24.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Khám & điều trị thú cưng — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Dịch vụ khám lâm sàng, xét nghiệm, siêu âm, chụp X-quang và phẫu thuật tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến); tiếp nhận khám 08:00 – 21:00 và cấp cứu 24/24.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ServiceExamRoute() {
  return <ServiceExamPage />
}
