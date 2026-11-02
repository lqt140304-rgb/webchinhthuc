import type { Route } from './+types/story-detail'
import { StoryDetailPage } from '@/pages/StoryDetailPage'
import { getRouteSeoPolicy } from '@/config/seo-policy'

export function meta(): Route.MetaDescriptors {
  const policy = getRouteSeoPolicy('/cau-chuyen/:slug')
  return [
    { title: 'Chi tiết câu chuyện điều trị — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content: 'Nội dung ca bệnh và hành trình chăm sóc minh họa tại Bệnh viện Thú y Lê Sơn.',
    },
    { name: 'robots', content: policy.robots },
    { property: 'og:title', content: 'Chi tiết câu chuyện điều trị — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content: 'Nội dung ca bệnh và hành trình chăm sóc minh họa tại Bệnh viện Thú y Lê Sơn.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function StoryDetailRoute() {
  return <StoryDetailPage />
}
