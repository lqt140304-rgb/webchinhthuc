import type { Route } from './+types/service-emergency'
import EmergencyPage from '@/pages/EmergencyPage'
import { getRouteSeoPolicy } from '@/config/seo-policy'
import { HOSPITAL_CONTACT } from '@/config/contact'

export function meta(): Route.MetaDescriptors {
  const policy = getRouteSeoPolicy('/dich-vu/cap-cuu')
  return [
    { title: `Tiếp Nhận Cấp Cứu 24/24 | ${HOSPITAL_CONTACT.name}` },
    {
      name: 'description',
      content: `Đường dây nóng cấp cứu thú cưng 24/24: ${HOSPITAL_CONTACT.hotlineDisplay}. Địa chỉ tiếp nhận: ${HOSPITAL_CONTACT.address}.`,
    },
    { name: 'robots', content: policy.robots },
    { property: 'og:title', content: `Tiếp Nhận Cấp Cứu 24/24 | ${HOSPITAL_CONTACT.name}` },
    {
      property: 'og:description',
      content: `Đường dây nóng cấp cứu thú cưng 24/24: ${HOSPITAL_CONTACT.hotlineDisplay}. Địa chỉ tiếp nhận: ${HOSPITAL_CONTACT.address}.`,
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ServiceEmergencyRoute() {
  return <EmergencyPage />
}
