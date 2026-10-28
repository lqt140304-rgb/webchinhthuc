import type { Route } from './+types/facilities'
import FacilitiesPage from '@/pages/FacilitiesPage'
import { getRouteSeoPolicy } from '@/config/seo-policy'
import { HOSPITAL_CONTACT } from '@/config/contact'

export function meta(): Route.MetaDescriptors {
  const policy = getRouteSeoPolicy('/co-so-vat-chat')
  return [
    { title: `Cơ Sở Vật Chất | ${HOSPITAL_CONTACT.name}` },
    {
      name: 'description',
      content: `Thông tin cơ sở vật chất và không gian thăm khám tại ${HOSPITAL_CONTACT.name}, ${HOSPITAL_CONTACT.address}. Hotline: ${HOSPITAL_CONTACT.hotlineDisplay}.`,
    },
    { name: 'robots', content: policy.robots },
    { property: 'og:title', content: `Cơ Sở Vật Chất | ${HOSPITAL_CONTACT.name}` },
    {
      property: 'og:description',
      content: `Thông tin cơ sở vật chất và không gian thăm khám tại ${HOSPITAL_CONTACT.name}, ${HOSPITAL_CONTACT.address}. Hotline: ${HOSPITAL_CONTACT.hotlineDisplay}.`,
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function FacilitiesRoute() {
  return <FacilitiesPage />
}
