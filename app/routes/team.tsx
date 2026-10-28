import TeamPage from '@/pages/TeamPage'

export function meta() {
  return [
    { title: 'Đội Ngũ Bác Sĩ & Chuyên Gia Y Tế — Bệnh Viện Thú Y Lê Sơn' },
    {
      name: 'description',
      content:
        'Gặp gỡ đội ngũ bác sĩ thú y giàu kinh nghiệm, tận tâm và chuyên môn vững vàng tại Bệnh viện Thú y Lê Sơn 101 Khuất Duy Tiến.',
    },
    { property: 'og:title', content: 'Đội Ngũ Bác Sĩ & Chuyên Gia Y Tế — Bệnh Viện Thú Y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Gặp gỡ đội ngũ bác sĩ thú y giàu kinh nghiệm, tận tâm và chuyên môn vững vàng tại Bệnh viện Thú y Lê Sơn 101 Khuất Duy Tiến.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://lesonpet.vn/doi-ngu' },
    { property: 'og:image', content: 'https://lesonpet.vn/images/og-team.webp' },
    { tagName: 'link', rel: 'canonical', href: 'https://lesonpet.vn/doi-ngu' },
  ]
}

export default function TeamRoute() {
  return <TeamPage />
}
