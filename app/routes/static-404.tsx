import type { Route } from './+types/static-404'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { HOSPITAL_CONTACT } from '@/config/contact'

export function meta(): Route.MetaDescriptors {
  return [
    { title: `404 — Không tìm thấy trang | ${HOSPITAL_CONTACT.name}` },
    {
      name: 'description',
      content: `Địa chỉ trang không tồn tại hoặc đã được thay đổi trên hệ thống ${HOSPITAL_CONTACT.name}.`,
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: `404 — Không tìm thấy trang | ${HOSPITAL_CONTACT.name}` },
    {
      property: 'og:description',
      content: `Địa chỉ trang không tồn tại hoặc đã được thay đổi trên hệ thống ${HOSPITAL_CONTACT.name}.`,
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function Static404Route() {
  return <NotFoundPage />
}
