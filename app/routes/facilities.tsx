import FacilitiesPage from '@/pages/FacilitiesPage'

export function meta() {
  return [
    { title: 'Cơ Sở Vật Chất & Không Gian Khám Chữa — Bệnh Viện Thú Y Lê Sơn' },
    {
      name: 'description',
      content:
        'Hệ thống cơ sở vật chất, phòng khám, phòng chẩn đoán hình ảnh và khu vực lưu trú y tế tiện nghi tại 101 Khuất Duy Tiến, Hà Nội.',
    },
    {
      property: 'og:title',
      content: 'Cơ Sở Vật Chất & Không Gian Khám Chữa — Bệnh Viện Thú Y Lê Sơn',
    },
    {
      property: 'og:description',
      content:
        'Hệ thống cơ sở vật chất, phòng khám, phòng chẩn đoán hình ảnh và khu vực lưu trú y tế tiện nghi tại 101 Khuất Duy Tiến, Hà Nội.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://lesonpet.vn/co-so-vat-chat' },
    { property: 'og:image', content: 'https://lesonpet.vn/images/og-facilities.webp' },
    { tagName: 'link', rel: 'canonical', href: 'https://lesonpet.vn/co-so-vat-chat' },
  ]
}

export default function FacilitiesRoute() {
  return <FacilitiesPage />
}
