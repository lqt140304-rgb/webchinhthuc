import type { Route } from './+types/pricing'
import { PricingPage } from '@/pages/PricingPage'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Bảng giá dịch vụ — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Bảng giá dịch vụ khám, chẩn đoán cận lâm sàng, phẫu thuật, nội trú và spa tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến). Xem thông tin minh họa và liên hệ tư vấn chi tiết.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Bảng giá dịch vụ — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Bảng giá dịch vụ khám, chẩn đoán cận lâm sàng, phẫu thuật, nội trú và spa tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến). Xem thông tin minh họa và liên hệ tư vấn chi tiết.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function PricingRoute() {
  return <PricingPage />
}
