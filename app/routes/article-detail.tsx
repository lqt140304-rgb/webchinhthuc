import type { Route } from './+types/article-detail'
import { ComingSoonView } from '@/components/layout/ComingSoonView'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Chi tiết bài viết cẩm nang — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Bài viết cẩm nang y khoa thú cưng đang được rà soát nội dung trước khi xuất bản.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Chi tiết bài viết cẩm nang — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Bài viết cẩm nang y khoa thú cưng đang được rà soát nội dung trước khi xuất bản.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ArticleDetailRoute() {
  return (
    <ComingSoonView
      title="Chi tiết bài viết cẩm nang"
      subtitle="Bài viết đang được rà soát nội dung trước khi xuất bản."
    />
  )
}
