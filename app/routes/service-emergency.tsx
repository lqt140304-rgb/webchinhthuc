import type { Route } from './+types/service-emergency'
import { ComingSoonView } from '@/components/layout/ComingSoonView'
import { HOSPITAL_CONTACT } from '@/config/contact'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Tiếp nhận Cấp cứu 24/24 — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content: `Quy trình hướng dẫn sơ cứu khẩn cấp và đường dây nóng ${HOSPITAL_CONTACT.hotlineDisplay} luôn sẵn sàng phục vụ tại Hà Nội.`,
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Tiếp nhận Cấp cứu 24/24 — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content: `Quy trình hướng dẫn sơ cứu khẩn cấp và đường dây nóng ${HOSPITAL_CONTACT.hotlineDisplay} luôn sẵn sàng phục vụ tại Hà Nội.`,
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ServiceEmergencyRoute() {
  return (
    <ComingSoonView
      title="Tiếp nhận Cấp cứu 24/24"
      subtitle={`Quy trình hướng dẫn sơ cứu khẩn cấp và đường dây nóng ${HOSPITAL_CONTACT.hotlineDisplay} luôn sẵn sàng phục vụ.`}
    />
  )
}
