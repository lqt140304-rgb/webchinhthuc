import type { Route } from './+types/pet-corner'
import { ComingSoonView } from '@/components/layout/ComingSoonView'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Góc thú cưng & Cẩm nang kiến thức — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Kho kiến thức y khoa, dinh dưỡng và phòng bệnh từ bác sĩ thú y đang được biên tập.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Góc thú cưng & Cẩm nang kiến thức — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Kho kiến thức y khoa, dinh dưỡng và phòng bệnh từ bác sĩ thú y đang được biên tập.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function PetCornerRoute() {
  return (
    <ComingSoonView
      title="Góc thú cưng & Cẩm nang kiến thức"
      subtitle="Kho kiến thức y khoa, dinh dưỡng và phòng bệnh từ bác sĩ thú y đang được biên tập."
    />
  )
}
