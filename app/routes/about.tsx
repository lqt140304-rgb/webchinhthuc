import AboutPage from '@/pages/AboutPage'

export function meta() {
  return [
    { title: 'Về Bệnh Viện Thú Y Lê Sơn — Lịch Sử & Tôn Chỉ Y Khoa' },
    {
      name: 'description',
      content:
        'Tìm hiểu hành trình thành lập, đội ngũ chuyên môn và tôn chỉ phụng sự sự sống của Bệnh viện Thú y Lê Sơn tại 101 Khuất Duy Tiến, Hà Nội.',
    },
    { property: 'og:title', content: 'Về Bệnh Viện Thú Y Lê Sơn — Lịch Sử & Tôn Chỉ Y Khoa' },
    {
      property: 'og:description',
      content:
        'Tìm hiểu hành trình thành lập, đội ngũ chuyên môn và tôn chỉ phụng sự sự sống của Bệnh viện Thú y Lê Sơn tại 101 Khuất Duy Tiến, Hà Nội.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://lesonpet.vn/gioi-thieu' },
    { property: 'og:image', content: 'https://lesonpet.vn/images/og-about.webp' },
    { tagName: 'link', rel: 'canonical', href: 'https://lesonpet.vn/gioi-thieu' },
  ]
}

export default function AboutRoute() {
  return <AboutPage />
}
