import type { Route } from './+types/about'
import AboutPage from '@/pages/AboutPage'
import { getRouteSeoPolicy } from '@/config/seo-policy'
import { HOSPITAL_CONTACT } from '@/config/contact'

export function meta(): Route.MetaDescriptors {
  const policy = getRouteSeoPolicy('/gioi-thieu')
  return [
    { title: `Giới Thiệu | ${HOSPITAL_CONTACT.name}` },
    {
      name: 'description',
      content: `Thông tin giới thiệu về ${HOSPITAL_CONTACT.name} tại ${HOSPITAL_CONTACT.address}. Hotline: ${HOSPITAL_CONTACT.hotlineDisplay}.`,
    },
    { name: 'robots', content: policy.robots },
    { property: 'og:title', content: `Giới Thiệu | ${HOSPITAL_CONTACT.name}` },
    {
      property: 'og:description',
      content: `Thông tin giới thiệu về ${HOSPITAL_CONTACT.name} tại ${HOSPITAL_CONTACT.address}. Hotline: ${HOSPITAL_CONTACT.hotlineDisplay}.`,
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function AboutRoute() {
  return <AboutPage />
}
