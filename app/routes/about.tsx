import type { Route } from './+types/about'
import AboutPage from '@/pages/AboutPage'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Về Bệnh Viện Thú Y Lê Sơn — Chăm Sóc Y Tế Chuẩn Mực' },
    {
      name: 'description',
      content:
        'Giới thiệu về tầm nhìn, sứ mệnh y khoa và cam kết đồng hành chăm sóc sức khỏe thú cưng tại Bệnh Viện Thú Y Lê Sơn.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Về Bệnh Viện Thú Y Lê Sơn — Chăm Sóc Y Tế Chuẩn Mực' },
    {
      property: 'og:description',
      content:
        'Giới thiệu về tầm nhìn, sứ mệnh y khoa và cam kết đồng hành chăm sóc sức khỏe thú cưng tại Bệnh Viện Thú Y Lê Sơn.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function AboutRoute() {
  return <AboutPage />
}
