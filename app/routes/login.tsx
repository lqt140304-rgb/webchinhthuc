import type { Route } from './+types/login'
import { ComingSoonView } from '@/components/layout/ComingSoonView'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Đăng nhập Cổng khách hàng — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content: 'Chức năng đăng nhập an toàn sẽ được tích hợp theo đúng lộ trình Giai đoạn 4.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Đăng nhập Cổng khách hàng — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content: 'Chức năng đăng nhập an toàn sẽ được tích hợp theo đúng lộ trình Giai đoạn 4.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function LoginRoute() {
  return (
    <ComingSoonView
      title="Đăng nhập Cổng khách hàng"
      subtitle="Chức năng đăng nhập an toàn sẽ được tích hợp theo đúng lộ trình Giai đoạn 4."
    />
  )
}
