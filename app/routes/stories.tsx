import type { Route } from './+types/stories'
import { ComingSoonView } from '@/components/layout/ComingSoonView'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Hành trình điều trị tiêu biểu — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Các câu chuyện phục hồi thực tế của các bé cưng đang được xin ý kiến đồng thuận từ chủ nuôi.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Hành trình điều trị tiêu biểu — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Các câu chuyện phục hồi thực tế của các bé cưng đang được xin ý kiến đồng thuận từ chủ nuôi.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function StoriesRoute() {
  return (
    <ComingSoonView
      title="Hành trình điều trị tiêu biểu"
      subtitle="Các câu chuyện phục hồi thực tế của các bé cưng đang được xin ý kiến đồng thuận từ chủ nuôi."
    />
  )
}
