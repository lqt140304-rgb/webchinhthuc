import type { Route } from './+types/team'
import TeamPage from '@/pages/TeamPage'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Đội Ngũ Bác Sĩ & Chuyên Gia Y Tế | Bệnh Viện Thú Y Lê Sơn' },
    {
      name: 'description',
      content:
        'Thông tin đội ngũ bác sĩ và nhân sự y tế phụ trách chuyên môn thăm khám tại Bệnh Viện Thú Y Lê Sơn.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Đội Ngũ Bác Sĩ & Chuyên Gia Y Tế | Bệnh Viện Thú Y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Thông tin đội ngũ bác sĩ và nhân sự y tế phụ trách chuyên môn thăm khám tại Bệnh Viện Thú Y Lê Sơn.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function TeamRoute() {
  return <TeamPage />
}
