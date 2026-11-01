import type { Route } from './+types/service-exam'
import { ComingSoonView } from '@/components/layout/ComingSoonView'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Khám & điều trị thú cưng — Bệnh viện Thú y Lê Sơn' },
    {
      name: 'description',
      content:
        'Dịch vụ khám lâm sàng, xét nghiệm, siêu âm, chụp X-quang và phẫu thuật tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến); nội dung chi tiết từng danh mục đang được cập nhật.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Khám & điều trị thú cưng — Bệnh viện Thú y Lê Sơn' },
    {
      property: 'og:description',
      content:
        'Dịch vụ khám lâm sàng, xét nghiệm, siêu âm, chụp X-quang và phẫu thuật tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến); nội dung chi tiết từng danh mục đang được cập nhật.',
    },
    { property: 'og:type', content: 'website' },
  ]
}

export default function ServiceExamRoute() {
  return (
    <ComingSoonView
      title="Khám & điều trị thú cưng"
      subtitle="Bệnh viện cung cấp dịch vụ khám lâm sàng, xét nghiệm, siêu âm, chụp X-quang và phẫu thuật tại cơ sở 101 Khuất Duy Tiến; trang chi tiết từng danh mục kỹ thuật đang được biên tập."
    />
  )
}
