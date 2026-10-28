import type { Route } from './+types/team'
import TeamPage from '@/pages/TeamPage'
import { getRouteSeoPolicy } from '@/config/seo-policy'
import { HOSPITAL_CONTACT } from '@/config/contact'

export function meta(): Route.MetaDescriptors {
  const policy = getRouteSeoPolicy('/doi-ngu')
  return [
    { title: `Đội Ngũ Bác Sĩ | ${HOSPITAL_CONTACT.name}` },
    {
      name: 'description',
      content: `Thông tin đội ngũ bác sĩ thú y làm việc tại ${HOSPITAL_CONTACT.name}, ${HOSPITAL_CONTACT.address}. Hotline: ${HOSPITAL_CONTACT.hotlineDisplay}.`,
    },
    { name: 'robots', content: policy.robots },
    { property: 'og:title', content: `Đội Ngũ Bác Sĩ | ${HOSPITAL_CONTACT.name}` },
    {
      property: 'og:description',
      content: `Thông tin đội ngũ bác sĩ thú y làm việc tại ${HOSPITAL_CONTACT.name}, ${HOSPITAL_CONTACT.address}. Hotline: ${HOSPITAL_CONTACT.hotlineDisplay}.`,
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function TeamRoute() {
  return <TeamPage />
}
