import type { Route } from './+types/products'
import { ProductsPage } from '@/pages/ProductsPage'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Sản phẩm & Dinh dưỡng thú cưng — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Danh mục sản phẩm dinh dưỡng, phụ kiện và chăm sóc thú cưng chọn lọc tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến). Xem danh mục minh họa và liên hệ tư vấn trực tiếp.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Sản phẩm & Dinh dưỡng thú cưng — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Danh mục sản phẩm dinh dưỡng, phụ kiện và chăm sóc thú cưng chọn lọc tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến). Xem danh mục minh họa và liên hệ tư vấn trực tiếp.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ProductsRoute() {
  return <ProductsPage />
}
