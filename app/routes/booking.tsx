import { BookingPage } from '@/pages/BookingPage'

export function meta() {
  return [
    { title: 'Đặt Lịch Khám & Tư Vấn Y Tế Thú Cưng — Bệnh Viện Thú Y Lê Sơn' },
    {
      name: 'description',
      content:
        'Đăng ký lịch khám trực tuyến tại Bệnh viện Thú y Lê Sơn 101 Khuất Duy Tiến để được đón tiếp chu đáo và chủ động thời gian.',
    },
    {
      property: 'og:title',
      content: 'Đặt Lịch Khám & Tư Vấn Y Tế Thú Cưng — Bệnh Viện Thú Y Lê Sơn',
    },
    {
      property: 'og:description',
      content:
        'Đăng ký lịch khám trực tuyến tại Bệnh viện Thú y Lê Sơn 101 Khuất Duy Tiến để được đón tiếp chu đáo và chủ động thời gian.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://lesonpet.vn/dat-lich' },
    { tagName: 'link', rel: 'canonical', href: 'https://lesonpet.vn/dat-lich' },
  ]
}

export default function BookingRoute() {
  return <BookingPage />
}
