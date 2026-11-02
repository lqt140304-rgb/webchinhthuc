import type { Route } from './+types/story-detail'
import { StoryDetailPage } from '@/pages/StoryDetailPage'
import { getRouteSeoPolicy } from '@/config/seo-policy'
import { MOCK_STORIES } from '@/data/mockStoriesContent'

export function meta({ params }: Route.MetaArgs): Route.MetaDescriptors {
  const policy = getRouteSeoPolicy('/cau-chuyen/:slug')
  const story = MOCK_STORIES.find((s) => s.slug === params.slug)
  const title = story
    ? `${story.title} — Câu chuyện điều trị — Bệnh viện Thú y Lê Sơn`
    : '404 — Không tìm thấy trang | Bệnh viện Thú y Lê Sơn'
  const description =
    story?.summary || 'Nội dung ca bệnh và hành trình chăm sóc minh họa tại Bệnh viện Thú y Lê Sơn.'
  return [
    { title },
    { name: 'description', content: description },
    { name: 'robots', content: policy.robots },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
  ]
}

export default function StoryDetailRoute() {
  return <StoryDetailPage />
}
