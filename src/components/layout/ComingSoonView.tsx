import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, Phone, AlertCircle, MessageSquare } from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import { HOSPITAL_CONTACT } from '@/config/contact'

interface ComingSoonViewProps {
  title: string
  subtitle?: string
}

export const ComingSoonView: React.FC<ComingSoonViewProps> = ({
  title,
  subtitle = 'Nội dung chuyên trang đang được đội ngũ Bệnh viện Thú y Lê Sơn hoàn thiện và chuẩn hóa theo tiêu chuẩn y khoa.',
}) => {
  useRouteSeo({
    title: `${title} — ${HOSPITAL_CONTACT.name}`,
    description: subtitle,
    isIndexable: false,
  })

  return (
    <section className="py-16 md:py-28 bg-[var(--color-bg-primary)] px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-plum-primary)] text-xs sm:text-sm font-medium mb-6">
          <Clock className="w-4 h-4 text-[var(--color-warm-orange)]" />
          <span>Chuyên trang đang hoàn thiện nội dung</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-fg-primary)] tracking-tight mb-4">
          {title}
        </h1>

        <p className="text-base sm:text-lg text-[var(--color-fg-muted)] leading-relaxed mb-8">
          {subtitle}
        </p>

        {/* Priority Hotline Callout */}
        <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-[var(--shadow-card)] mb-10 text-left sm:text-center">
          <p className="text-xs uppercase tracking-wider text-[var(--color-fg-subtle)] font-semibold mb-2">
            Hỗ trợ tư vấn & tiếp nhận trực tiếp 24/24
          </p>
          <p className="text-sm text-[var(--color-fg-muted)] mb-4">
            Quý khách có nhu cầu thăm khám, tư vấn dịch vụ hoặc cấp cứu thú cưng tại {HOSPITAL_CONTACT.shortAddress}, vui lòng liên hệ trực tiếp đường dây nóng của bệnh viện:
          </p>
          <div className="flex flex-wrap items-center justify-start sm:justify-center gap-3">
            <a
              href={HOSPITAL_CONTACT.hotlineTel}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-sm transition-all shadow-[var(--shadow-warm-orange)] active:scale-[0.98]"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi Hotline 24/24: {HOSPITAL_CONTACT.hotlineDisplay}</span>
            </a>
            <Link
              to="/lien-he"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--color-border-medium)] text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)] font-semibold text-sm transition-all active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4 text-[var(--color-plum-primary)]" />
              <span>Xem thông tin Liên hệ</span>
            </Link>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-start sm:justify-center gap-2 text-xs text-[var(--color-fg-subtle)]">
            <AlertCircle className="w-3.5 h-3.5 text-[var(--color-warm-orange)] shrink-0" />
            <span>Hệ thống đặt lịch trực tuyến sẽ chính thức vận hành ở Giai đoạn 4.</span>
          </div>
        </div>

        {/* Dual Actions as required by sitemap specification */}
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-plum-primary)] hover:text-[var(--color-plum-deep)] transition-colors py-2 px-3 rounded-lg hover:bg-[var(--color-bg-secondary)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Trang chủ</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
