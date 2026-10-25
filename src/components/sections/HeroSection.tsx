import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Calendar, ArrowRight, ShieldCheck, MapPin } from 'lucide-react'
import { HOSPITAL_CONTACT } from '@/config/contact'
import styles from './HeroSection.module.css'

export const HeroSection: React.FC = () => {
  return (
    <section className={styles.heroContainer}>
      <div className={styles.heroBackgroundTint} aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-20 md:pb-24 relative z-10">
        {/* Top Part: Split layout (Headline on left, Description + CTAs on right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-14 md:mb-20">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-plum-primary)] text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-warm-orange)]" />
              <span>{HOSPITAL_CONTACT.tagline}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-[1.14]">
              “Khi bé không khỏe, bạn không phải lo một mình.”
            </h1>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <p className="text-base sm:text-lg text-[var(--color-fg-muted)] leading-relaxed font-sans">
              Chúng tôi hiểu sự lắng lo của bạn khi người bạn nhỏ gặp vấn đề sức khỏe. Tại {HOSPITAL_CONTACT.name}, từng ca bệnh đều được thăm khám cẩn trọng, giải thích rõ ràng và đồng hành chu đáo bằng cả tấm lòng.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/dat-lich"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-semibold text-sm transition-all shadow-[var(--shadow-card)] active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                <span>Đặt lịch khám</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={HOSPITAL_CONTACT.hotlineTel}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-sm transition-all shadow-[var(--shadow-warm-orange)] active:scale-[0.98]"
              >
                <Phone className="w-4 h-4" />
                <span>Hotline: {HOSPITAL_CONTACT.hotlineDisplay}</span>
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--color-fg-subtle)] pt-1">
              <MapPin className="w-3.5 h-3.5 text-[var(--color-plum-primary)] shrink-0" />
              <span>{HOSPITAL_CONTACT.shortAddress} &bull; {HOSPITAL_CONTACT.emergencyHours}</span>
            </div>
          </div>
        </div>

        {/* Bottom Part: 3 Large Editorial Frames (Inspired by AURA) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Frame 1: Vet clinical examination */}
          <div className={`${styles.frameLeft} h-[340px] sm:h-[420px] lg:h-[460px]`}>
            <img
              src="/images/hero-vet-care.jpg"
              alt="Bác sĩ thăm khám lâm sàng nhẹ nhàng cho cún cưng"
              loading="eager"
              className={styles.editorialImage}
            />
            <div className={styles.frameCaption}>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-plum-orchid-light)]">
                Lâm Sàng
              </span>
              <p className="font-serif font-semibold text-base sm:text-lg leading-tight mt-0.5">
                Thăm khám ân cần & chẩn đoán chu đáo
              </p>
            </div>
          </div>

          {/* Frame 2: High arch / cat wellness */}
          <div className={`${styles.frameCenter} h-[380px] sm:h-[460px] lg:h-[500px] md:-mt-6`}>
            <img
              src="/images/hero-happy-cat.jpg"
              alt="Mèo cưng khỏe mạnh, bình yên"
              loading="eager"
              className={styles.editorialImage}
            />
            <div className={styles.frameCaption}>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                Chăm Sóc
              </span>
              <p className="font-serif font-semibold text-base sm:text-lg leading-tight mt-0.5">
                Môi trường dịu nhẹ, giảm stress cho bé
              </p>
            </div>
          </div>

          {/* Frame 3: Cuddle / recovery connection */}
          <div className={`${styles.frameRight} h-[340px] sm:h-[420px] lg:h-[460px]`}>
            <img
              src="/images/hero-clinic-cuddle.jpg"
              alt="Sự gắn kết thân tình và đồng hành cùng thú cưng"
              loading="eager"
              className={styles.editorialImage}
            />
            <div className={styles.frameCaption}>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-plum-orchid-light)]">
                Đồng Hành
              </span>
              <p className="font-serif font-semibold text-base sm:text-lg leading-tight mt-0.5">
                Sát cánh bên bạn và bé trong mọi khoảnh khắc
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
