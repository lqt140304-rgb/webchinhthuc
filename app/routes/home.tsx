import { HomePage } from '@/pages/HomePage'

export function meta() {
  return [
    { title: 'Bệnh viện Thú y Lê Sơn — Chăm Sóc Y Tế Thú Cưng Chuẩn Mực' },
    {
      name: 'description',
      content:
        'Bệnh viện Thú y Lê Sơn - Địa chỉ khám, điều trị, phẫu thuật, nội trú và cấp cứu thú cưng 24/24 uy tín tại 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội.',
    },
    { property: 'og:title', content: 'Bệnh viện Thú y Lê Sơn — Chăm Sóc Y Tế Thú Cưng Chuẩn Mực' },
    {
      property: 'og:description',
      content:
        'Bệnh viện Thú y Lê Sơn - Địa chỉ khám, điều trị, phẫu thuật, nội trú và cấp cứu thú cưng 24/24 uy tín tại 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://lesonpet.vn/' },
    { property: 'og:image', content: 'https://lesonpet.vn/images/og-home.webp' },
    { tagName: 'link', rel: 'canonical', href: 'https://lesonpet.vn/' },
  ]
}

export default function HomeRoute() {
  return <HomePage />
}
