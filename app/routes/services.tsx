import type { Route } from './+types/services'
import { ComingSoonView } from '@/components/layout/ComingSoonView'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Danh mục dịch vụ y tế — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Tổng hợp các giải pháp chăm sóc y tế toàn diện cho thú cưng đang được biên tập chi tiết.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Danh mục dịch vụ y tế — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Tổng hợp các giải pháp chăm sóc y tế toàn diện cho thú cưng đang được biên tập chi tiết.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ServicesRoute() {
  return (
    <ComingSoonView
      title="Danh mục dịch vụ y tế"
      subtitle="Tổng hợp các giải pháp chăm sóc y tế toàn diện cho thú cưng đang được biên tập chi tiết."
    />
  )
}
