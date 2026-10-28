import type { Route } from './+types/facilities'
import FacilitiesPage from '@/pages/FacilitiesPage'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Cơ Sở Vật Chất & Không Gian Y Tế | Bệnh Viện Thú Y Lê Sơn' },
    {
      name: 'description',
      content:
        'Không gian thăm khám và chăm sóc tiện nghi, môi trường vô trùng chuẩn y khoa dành cho thú cưng tại Bệnh Viện Thú Y Lê Sơn.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Cơ Sở Vật Chất & Không Gian Y Tế | Bệnh Viện Thú Y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Không gian thăm khám và chăm sóc tiện nghi, môi trường vô trùng chuẩn y khoa dành cho thú cưng tại Bệnh Viện Thú Y Lê Sơn.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function FacilitiesRoute() {
  return <FacilitiesPage />
}
