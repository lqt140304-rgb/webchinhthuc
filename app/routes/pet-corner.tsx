import type { Route } from './+types/pet-corner'
import { PetCornerPage } from '@/pages/PetCornerPage'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Góc thú cưng & Cẩm nang kiến thức — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Cẩm nang kiến thức thú cưng, dinh dưỡng và lưu ý y khoa từ Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến).',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Góc thú cưng & Cẩm nang kiến thức — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Cẩm nang kiến thức thú cưng, dinh dưỡng và lưu ý y khoa từ Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến).',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function PetCornerRoute() {
  return <PetCornerPage />
}
