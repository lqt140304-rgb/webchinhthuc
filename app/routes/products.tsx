import type { Route } from './+types/products'
import { ComingSoonView } from '@/components/layout/ComingSoonView'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Sản phẩm dinh dưỡng & Phụ kiện y tế — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Danh mục sản phẩm chính hãng chọn lọc đang được cập nhật tồn kho và mô tả công dụng.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Sản phẩm dinh dưỡng & Phụ kiện y tế — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Danh mục sản phẩm chính hãng chọn lọc đang được cập nhật tồn kho và mô tả công dụng.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ProductsRoute() {
  return (
    <ComingSoonView
      title="Sản phẩm dinh dưỡng & Phụ kiện y tế"
      subtitle="Danh mục sản phẩm chính hãng chọn lọc đang được cập nhật tồn kho và mô tả công dụng."
    />
  )
}
