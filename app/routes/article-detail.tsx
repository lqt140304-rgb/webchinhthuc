import type { Route } from './+types/article-detail'
import { ArticleDetailPage } from '@/pages/ArticleDetailPage'
import { getRouteSeoPolicy } from '@/config/seo-policy'
import { MOCK_ARTICLES } from '@/data/mockPetCornerContent'

export function meta({ params }: Route.MetaArgs): Route.MetaDescriptors {
  const policy = getRouteSeoPolicy('/bai-viet/:slug')
  const article = MOCK_ARTICLES.find((a) => a.slug === params.slug)
  const title = article
    ? `${article.title} — Cẩm nang thú cưng — Bệnh viện Thú y Lê Sơn`
    : '404 — Không tìm thấy trang | Bệnh viện Thú y Lê Sơn'
  const description =
    article?.excerpt ||
    'Cẩm nang chăm sóc thú cưng minh họa và kiến thức nuôi dưỡng tại Bệnh viện Thú y Lê Sơn.'
  return [
    { title },
    { name: 'description', content: description },
    { name: 'robots', content: policy.robots },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ArticleDetailRoute() {
  return <ArticleDetailPage />
}
