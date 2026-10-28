import type { Route } from './+types/booking'
import { BookingPage } from '@/pages/BookingPage'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Đặt Lịch Hẹn Khám | Bệnh Viện Thú Y Lê Sơn' },
    {
      name: 'description',
      content:
        'Đặt lịch thăm khám thú cưng trực tuyến nhanh chóng và thuận tiện tại Bệnh Viện Thú Y Lê Sơn, 101 Khuất Duy Tiến, Hà Nội.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Đặt Lịch Hẹn Khám | Bệnh Viện Thú Y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Đặt lịch thăm khám thú cưng trực tuyến nhanh chóng và thuận tiện tại Bệnh Viện Thú Y Lê Sơn, 101 Khuất Duy Tiến, Hà Nội.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function BookingRoute() {
  return <BookingPage />
}
