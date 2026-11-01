import type { Route } from './+types/contact'
import ContactPage from '@/pages/ContactPage'
import { getRouteSeoPolicy } from '@/config/seo-policy'
import { HOSPITAL_CONTACT } from '@/config/contact'

export function meta(): Route.MetaDescriptors {
  const policy = getRouteSeoPolicy('/lien-he')
  return [
    { title: `Liên hệ & Thông tin phòng khám | ${HOSPITAL_CONTACT.name}` },
    {
      name: 'description',
      content: `Địa chỉ: ${HOSPITAL_CONTACT.address} | Hotline 24/24: ${HOSPITAL_CONTACT.hotlineDisplay}. Chỉ dẫn đường đi và liên hệ Bệnh viện Thú y Lê Sơn.`,
    },
    { name: 'robots', content: policy.robots },
    { property: 'og:title', content: `Liên hệ & Thông tin phòng khám | ${HOSPITAL_CONTACT.name}` },
    {
      property: 'og:description',
      content: `Địa chỉ: ${HOSPITAL_CONTACT.address} | Hotline 24/24: ${HOSPITAL_CONTACT.hotlineDisplay}. Chỉ dẫn đường đi và liên hệ Bệnh viện Thú y Lê Sơn.`,
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ContactRoute() {
  return <ContactPage />
}
