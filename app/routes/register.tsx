import type { Route } from './+types/register'
import { ComingSoonView } from '@/components/layout/ComingSoonView'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Đăng ký tài khoản hồ sơ thú cưng — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content: 'Chức năng tạo tài khoản sẽ được tích hợp theo đúng lộ trình Giai đoạn 4.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Đăng ký tài khoản hồ sơ thú cưng — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content: 'Chức năng tạo tài khoản sẽ được tích hợp theo đúng lộ trình Giai đoạn 4.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function RegisterRoute() {
  return (
    <ComingSoonView
      title="Đăng ký tài khoản hồ sơ thú cưng"
      subtitle="Chức năng tạo tài khoản sẽ được tích hợp theo đúng lộ trình Giai đoạn 4."
    />
  )
}
