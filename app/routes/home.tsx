import type { Route } from './+types/home'
import { HomePage } from '@/pages/HomePage'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Bệnh Viện Thú Y Lê Sơn — Chăm Sóc Y Tế Chuẩn Mực Cho Thú Cưng' },
    {
      name: 'description',
      content:
        'Hệ sinh thái y tế thú y chất lượng cao tại Hà Nội: Đội ngũ y bác sĩ tận tâm, cơ sở vật chất hiện đại, dịch vụ y tế chuẩn mực.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Bệnh Viện Thú Y Lê Sơn — Chăm Sóc Y Tế Chuẩn Mực Cho Thú Cưng' },
    {
      property: 'og:description',
      content:
        'Hệ sinh thái y tế thú y chất lượng cao tại Hà Nội: Đội ngũ y bác sĩ tận tâm, cơ sở vật chất hiện đại, dịch vụ y tế chuẩn mực.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function HomeRoute() {
  return <HomePage />
}
