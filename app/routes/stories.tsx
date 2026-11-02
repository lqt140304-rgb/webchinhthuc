import type { Route } from './+types/stories'
import { StoriesPage } from '@/pages/StoriesPage'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Hành trình điều trị tiêu biểu — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Hành trình phục hồi và điều trị thực tế tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến). Xem các câu chuyện tiêu biểu minh họa.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Hành trình điều trị tiêu biểu — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Hành trình phục hồi và điều trị thực tế tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến). Xem các câu chuyện tiêu biểu minh họa.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function StoriesRoute() {
  return <StoriesPage />
}
