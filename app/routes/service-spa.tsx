import type { Route } from './+types/service-spa'
import { ComingSoonView } from '@/components/layout/ComingSoonView'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Spa & Grooming thẩm mỹ — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Các gói vệ sinh, tắm trị liệu và tạo hình thú cưng đang được biên tập bảng thông số.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Spa & Grooming thẩm mỹ — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Các gói vệ sinh, tắm trị liệu và tạo hình thú cưng đang được biên tập bảng thông số.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ServiceSpaRoute() {
  return (
    <ComingSoonView
      title="Spa & Grooming thẩm mỹ"
      subtitle="Các gói vệ sinh, tắm trị liệu và tạo hình thú cưng đang được biên tập bảng thông số."
    />
  )
}
