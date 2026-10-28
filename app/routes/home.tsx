import type { Route } from './+types/home'
import { HomePage } from '@/pages/HomePage'
import { getRouteSeoPolicy } from '@/config/seo-policy'
import { HOSPITAL_CONTACT } from '@/config/contact'

export function meta(): Route.MetaDescriptors {
  const policy = getRouteSeoPolicy('/')
  return [
    { title: `${HOSPITAL_CONTACT.name} — Dịch Vụ Thú Y Tại Hà Nội` },
    {
      name: 'description',
      content: `${HOSPITAL_CONTACT.name} tại ${HOSPITAL_CONTACT.address}. Tiếp nhận thăm khám thú cưng, hotline: ${HOSPITAL_CONTACT.hotlineDisplay}.`,
    },
    { name: 'robots', content: policy.robots },
    { property: 'og:title', content: `${HOSPITAL_CONTACT.name} — Dịch Vụ Thú Y Tại Hà Nội` },
    {
      property: 'og:description',
      content: `${HOSPITAL_CONTACT.name} tại ${HOSPITAL_CONTACT.address}. Tiếp nhận thăm khám thú cưng, hotline: ${HOSPITAL_CONTACT.hotlineDisplay}.`,
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function HomeRoute() {
  return <HomePage />
}
