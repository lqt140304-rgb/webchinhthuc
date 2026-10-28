import { NotFoundPage } from '@/pages/NotFoundPage'

export function meta() {
  return [
    { title: '404 — Không Tìm Thấy Trang | Bệnh Viện Thú Y Lê Sơn' },
    { name: 'robots', content: 'noindex, nofollow' },
  ]
}

export default function NotFoundRoute() {
  return <NotFoundPage />
}
