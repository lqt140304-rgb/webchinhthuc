import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldAlert, Phone, Stethoscope, Home, Sparkles } from 'lucide-react'
import { HOSPITAL_CONTACT } from '@/config/contact'
import styles from './FeaturedServices.module.css'

interface ServiceItem {
  id: string
  title: string
  category: string
  description: string
  image: string
  href: string
  icon: React.ElementType
}

const services: ServiceItem[] = [
  {
    id: 'kham-dieu-tri',
    title: 'Khám & Điều Trị',
    category: 'Y Khoa Lâm Sàng',
    description: 'Thăm khám kỹ lưỡng, xét nghiệm sinh hóa, chẩn đoán hình ảnh kỹ thuật số và phẫu thuật ngoại khoa an toàn.',
    image: '/images/service-exam.webp',
    href: '/dich-vu/kham-dieu-tri',
    icon: Stethoscope,
  },
  {
    id: 'noi-tru',
    title: 'Chăm Sóc Nội Trú 24/7',
    category: 'Lưu Trú Y Tế',
    description: 'Khu vực nội trú chuyên biệt được vệ sinh khử khuẩn định kỳ, theo dõi chỉ số sức khỏe liên tục và chế độ dinh dưỡng phục hồi.',
    image: '/images/service-inpatient.webp',
    href: '/dich-vu/noi-tru',
    icon: Home,
  },
  {
    id: 'spa',
    title: 'Spa & Grooming',
    category: 'Vệ Sinh Y Tế & Chăm Sóc',
    description: 'Quy trình tắm dưỡng da lông, cắt tỉa tạo hình vệ sinh và chăm sóc móng, tai dịu nhẹ bởi chuyên viên tận tâm.',
    image: '/images/service-spa.webp',
    href: '/dich-vu/spa',
    icon: Sparkles,
  },
]

export const FeaturedServices: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[var(--color-bg-primary)]" id="dich-vu-tieu-bieu">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Top Header with "Xem tất cả dịch vụ" Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16" data-reveal="up">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 border border-purple-200/60 text-[var(--color-plum-primary)] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-plum-orchid)]" />
              <span>Tiêu Chuẩn Y Khoa Toàn Diện</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-tight">
              Giải pháp y tế toàn diện cho bé cưng
            </h2>
            <p className="mt-3 text-base text-[var(--color-fg-muted)] leading-relaxed font-sans">
              Chúng tôi tập trung vào 3 dịch vụ cốt lõi, đảm bảo tiêu chuẩn y khoa nghiêm ngặt và trải nghiệm êm ái nhất cho thú cưng.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/dich-vu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--color-border-medium)] hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-plum-primary)] text-[var(--color-plum-deep)] text-sm font-semibold transition-all group shadow-2xs"
            >
              <span>Xem tất cả dịch vụ</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[var(--color-plum-primary)]" />
            </Link>
          </div>
        </div>

        {/* 3 Image-led Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {services.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className={`${styles.serviceCard} group`}
                data-reveal="scale"
                data-reveal-delay={String(idx + 1)}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={item.image}
                    alt={`${item.title} (Hình ảnh minh họa)`}
                    width={800}
                    height={533}
                    loading="lazy"
                    decoding="async"
                    className={styles.serviceImage}
                  />
                  <span className={styles.badge}>{item.category}</span>
                  <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/70 text-white shadow-xs backdrop-blur-md">
                    Ảnh minh họa
                  </span>
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 text-[var(--color-plum-primary)] border border-purple-200/60 flex items-center justify-center mb-4.5 shadow-2xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[var(--color-plum-deep)] mb-2.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed mb-6 font-sans">
                      {item.description}
                    </p>
                  </div>

                  <Link
                    to={item.href}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)] hover:text-[var(--color-plum-deep)] transition-colors group/link"
                  >
                    <span>Chi tiết dịch vụ</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Dedicated Emergency 24/24 Gateway Bar */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-50 border border-amber-200/90 p-6 sm:p-8 shadow-sm" data-reveal="up" data-reveal-delay="2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[var(--color-warm-orange)] to-[#A34507] text-white flex items-center justify-center shrink-0 shadow-[var(--shadow-glow-orange)]">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-lg text-[var(--color-warm-orange-dark)]">
                    Cấp Cứu Thú Cưng Khẩn Cấp 24/24
                  </h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-warm-orange)] text-white shadow-2xs">
                    24/24
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-xl">
                  Bé có dấu hiệu khó thở, co giật, ngộ độc, xuất huyết hoặc tai nạn? Đội ngũ y tế trực đêm tại {HOSPITAL_CONTACT.shortAddress} luôn sẵn sàng tiếp nhận ngay lập tức.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={HOSPITAL_CONTACT.hotlineTel}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--color-warm-orange)] to-[#A34507] hover:from-[#A34507] hover:to-[#873603] text-white font-semibold text-sm transition-all shadow-[var(--shadow-glow-orange)] hover:scale-105 active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi Cấp cứu: {HOSPITAL_CONTACT.hotlineDisplay}</span>
              </a>
              <Link
                to="/dich-vu/cap-cuu"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-2xl border border-orange-300 bg-white/60 text-[var(--color-warm-orange-dark)] hover:bg-orange-100/70 font-semibold text-sm transition-colors shadow-2xs"
              >
                <span>Quy trình</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
