import type { Route } from './+types/contact'
import { ComingSoonView } from '@/components/layout/ComingSoonView'
import { HOSPITAL_CONTACT } from '@/config/contact'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Liên hệ & Thông tin phòng khám — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content: `Địa chỉ: ${HOSPITAL_CONTACT.address} | Hotline 24/24: ${HOSPITAL_CONTACT.hotlineDisplay}.`,
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Liên hệ & Thông tin phòng khám — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content: `Địa chỉ: ${HOSPITAL_CONTACT.address} | Hotline 24/24: ${HOSPITAL_CONTACT.hotlineDisplay}.`,
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ContactRoute() {
  return (
    <ComingSoonView
      title="Liên hệ & Thông tin phòng khám"
      subtitle={`Địa chỉ: ${HOSPITAL_CONTACT.address} | Hotline 24/24: ${HOSPITAL_CONTACT.hotlineDisplay}.`}
    />
  )
}
