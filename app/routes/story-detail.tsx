import type { Route } from './+types/story-detail'
import { ComingSoonView } from '@/components/layout/ComingSoonView'
import { getRouteSeoPolicy } from '@/config/seo-policy'

export function meta(): Route.MetaDescriptors {
  const policy = getRouteSeoPolicy('/cau-chuyen/:slug')
  return [
    { title: 'Chi tiết câu chuyện điều trị — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content: 'Nội dung ca bệnh đang được chuẩn bị và biên tập trước khi công bố.',
    },
    { name: 'robots', content: policy.robots },
    { property: 'og:title', content: 'Chi tiết câu chuyện điều trị — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content: 'Nội dung ca bệnh đang được chuẩn bị và biên tập trước khi công bố.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function StoryDetailRoute() {
  return (
    <ComingSoonView
      title="Chi tiết câu chuyện điều trị"
      subtitle="Nội dung ca bệnh đang được chuẩn bị theo chuẩn y khoa không công khai y lệnh bảo mật."
    />
  )
}
