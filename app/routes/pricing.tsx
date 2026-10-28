import type { Route } from './+types/pricing'
import { ComingSoonView } from '@/components/layout/ComingSoonView'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Bảng giá dịch vụ niêm yết — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Biểu phí dịch vụ khám, xét nghiệm và điều trị đang được đối chiếu niêm yết chính thức.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Bảng giá dịch vụ niêm yết — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Biểu phí dịch vụ khám, xét nghiệm và điều trị đang được đối chiếu niêm yết chính thức.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function PricingRoute() {
  return (
    <ComingSoonView
      title="Bảng giá dịch vụ niêm yết"
      subtitle="Biểu phí dịch vụ khám, xét nghiệm và điều trị đang được đối chiếu niêm yết chính thức."
    />
  )
}
