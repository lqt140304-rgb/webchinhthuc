import type { Route } from './+types/booking'
import { BookingPage } from '@/pages/BookingPage'
import { getRouteSeoPolicy } from '@/config/seo-policy'
import { HOSPITAL_CONTACT } from '@/config/contact'

export function meta(): Route.MetaDescriptors {
  const policy = getRouteSeoPolicy('/dat-lich')
  return [
    { title: `Đặt Lịch Hẹn Khám | ${HOSPITAL_CONTACT.name}` },
    {
      name: 'description',
      content: `Đặt lịch thăm khám thú cưng tại ${HOSPITAL_CONTACT.name}, ${HOSPITAL_CONTACT.address}. Hotline: ${HOSPITAL_CONTACT.hotlineDisplay}.`,
    },
    { name: 'robots', content: policy.robots },
    { property: 'og:title', content: `Đặt Lịch Hẹn Khám | ${HOSPITAL_CONTACT.name}` },
    {
      property: 'og:description',
      content: `Đặt lịch thăm khám thú cưng tại ${HOSPITAL_CONTACT.name}, ${HOSPITAL_CONTACT.address}. Hotline: ${HOSPITAL_CONTACT.hotlineDisplay}.`,
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function BookingRoute() {
  return <BookingPage />
}
