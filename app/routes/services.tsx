import type { Route } from './+types/services'
import ServicesPage from '@/pages/ServicesPage'
import { getRouteSeoPolicy } from '@/config/seo-policy'
import { HOSPITAL_CONTACT } from '@/config/contact'

export function meta(): Route.MetaDescriptors {
  const policy = getRouteSeoPolicy('/dich-vu')
  return [
    { title: `Danh Mục Dịch Vụ Y Tế | ${HOSPITAL_CONTACT.name}` },
    {
      name: 'description',
      content:
        'Tổng hợp các giải pháp chăm sóc y tế toàn diện cho thú cưng tại Bệnh viện Thú y Lê Sơn: Khám & Điều trị, Chăm sóc nội trú, Spa & Grooming, Cấp cứu 24/24.',
    },
    { name: 'robots', content: policy.robots },
    { property: 'og:title', content: `Danh Mục Dịch Vụ Y Tế | ${HOSPITAL_CONTACT.name}` },
    {
      property: 'og:description',
      content:
        'Tổng hợp các giải pháp chăm sóc y tế toàn diện cho thú cưng tại Bệnh viện Thú y Lê Sơn: Khám & Điều trị, Chăm sóc nội trú, Spa & Grooming, Cấp cứu 24/24.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ServicesRoute() {
  return <ServicesPage />
}
