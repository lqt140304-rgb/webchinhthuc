import type { Route } from './+types/article-detail'
import { ArticleDetailPage } from '@/pages/ArticleDetailPage'
import { getRouteSeoPolicy } from '@/config/seo-policy'

export function meta(): Route.MetaDescriptors {
  const policy = getRouteSeoPolicy('/bai-viet/:slug')
  return [
    { title: 'Chi tiết bài viết cẩm nang — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Cẩm nang chăm sóc thú cưng minh họa và kiến thức nuôi dưỡng tại Bệnh viện Thú y Lê Sơn.',
    },
    { name: 'robots', content: policy.robots },
    { property: 'og:title', content: 'Chi tiết bài viết cẩm nang — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Cẩm nang chăm sóc thú cưng minh họa và kiến thức nuôi dưỡng tại Bệnh viện Thú y Lê Sơn.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ArticleDetailRoute() {
  return <ArticleDetailPage />
}
