import React from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Phone, Home } from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import { HOSPITAL_CONTACT } from '@/config/contact'

export const NotFoundPage: React.FC = () => {
  useRouteSeo({
    title: `404 — Không tìm thấy trang | ${HOSPITAL_CONTACT.name}`,
    description: `Địa chỉ trang không tồn tại hoặc đã được thay đổi trên hệ thống ${HOSPITAL_CONTACT.name}.`,
    isIndexable: false,
    noCanonical: true,
  })

  return (
    <section className="py-24 md:py-36 bg-[var(--color-bg-primary)] px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-plum-primary)] flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-[var(--color-warm-orange)]" />
        </div>

        <p className="text-xs uppercase tracking-widest font-bold text-[var(--color-plum-primary)] mb-2">
          Lỗi 404
        </p>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-fg-primary)] tracking-tight mb-4">
          Không tìm thấy trang yêu cầu
        </h1>

        <p className="text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed mb-8">
          Địa chỉ bạn đang truy cập có thể đã thay đổi hoặc không tồn tại trên hệ thống {HOSPITAL_CONTACT.name}.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-medium text-sm transition-all shadow-[var(--shadow-subtle)] active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang chủ</span>
          </Link>
          <a
            href={HOSPITAL_CONTACT.hotlineTel}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--color-border-medium)] text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)] font-medium text-sm transition-all active:scale-[0.98]"
          >
            <Phone className="w-4 h-4 text-[var(--color-warm-orange)]" />
            <span>Gọi hỗ trợ: {HOSPITAL_CONTACT.hotlineDisplay}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
