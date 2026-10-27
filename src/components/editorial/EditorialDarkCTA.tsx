import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Calendar, MapPin } from 'lucide-react'
import { HOSPITAL_CONTACT } from '@/config/contact'

interface EditorialDarkCTAProps {
  title?: string
  subtitle?: string
  showMapsButton?: boolean
  className?: string
}

export const EditorialDarkCTA: React.FC<EditorialDarkCTAProps> = ({
  title = 'Đặt lịch hẹn khám cùng đội ngũ Lê Sơn',
  subtitle = '101 Khuất Duy Tiến, Thanh Xuân, Hà Nội • Khám 08:00 – 21:00 • Cấp cứu 24/24',
  showMapsButton = false,
  className = '',
}) => {
  return (
    <div
      className={`rounded-3xl p-6 sm:p-10 bg-[var(--color-bg-dark)] text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${className}`}
    >
      <div className="max-w-xl">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 tracking-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-plum-orchid-light)] leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Link
          to="/dat-lich"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[var(--color-plum-deep)] hover:bg-[var(--color-lavender)] font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] min-h-[44px]"
        >
          <Calendar className="w-4 h-4 text-[var(--color-plum-primary)]" />
          <span>Đặt lịch khám trực tuyến</span>
        </Link>

        <a
          href="tel:0973555105"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] min-h-[44px]"
        >
          <Phone className="w-4 h-4 text-white" />
          <span>Gọi 097 355 51 05</span>
        </a>

        {showMapsButton && (
          <a
            href={HOSPITAL_CONTACT.mapsUrl || 'https://maps.google.com/?q=101+Khuất+Duy+Tiến,+Thanh+Xuân,+Hà+Nội'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 font-medium text-xs sm:text-sm transition-all min-h-[44px]"
          >
            <MapPin className="w-4 h-4 text-[var(--color-plum-orchid-light)]" />
            <span>Mở bản đồ Google Maps</span>
          </a>
        )}
      </div>
    </div>
  )
}
