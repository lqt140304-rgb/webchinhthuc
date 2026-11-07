import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Calendar, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react'
import { HOSPITAL_CONTACT } from '@/config/contact'
import styles from './HeroSection.module.css'

export const HeroSection: React.FC = () => {
  return (
    <section className={styles.heroContainer}>
      <div className={styles.heroBackgroundTint} aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24 relative z-10">
        {/* Top Part: Split layout (Headline on left, Description + CTAs on right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-14 md:mb-16">
          <div className="lg:col-span-7">
            <div className="animate-hero-1 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-white border border-[var(--color-border-subtle)] text-xs font-semibold tracking-wider uppercase mb-5 text-[var(--color-plum-primary)]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-status-beacon shrink-0" />
              <span>{HOSPITAL_CONTACT.tagline} &bull; Tiếp nhận 24/24</span>
            </div>

            <h1 className="animate-hero-2 text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-[1.14]">
              “Khi bé không khỏe,{' '}
              <span className="text-[var(--color-plum-primary)]">
                bạn không phải lo một mình.”
              </span>
            </h1>

            {/* Unified Clinical Specification Strip */}
            <div className="animate-hero-3 flex flex-wrap items-center gap-2.5 pt-6 text-xs font-medium text-[var(--color-fg-secondary)]">
              <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-lg border border-[var(--color-border-subtle)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-plum-primary)] shrink-0" />
                <span>Bác sĩ trực 24/24</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-lg border border-[var(--color-border-subtle)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-plum-primary)] shrink-0" />
                <span>Chẩn đoán hình ảnh kỹ thuật số</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-lg border border-[var(--color-border-subtle)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-plum-primary)] shrink-0" />
                <span>Nội trú vô trùng riêng biệt</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <p className="animate-hero-2 text-base sm:text-lg text-[var(--color-fg-muted)] leading-relaxed font-sans">
              Chúng tôi hiểu sự lắng lo của bạn khi người bạn nhỏ gặp vấn đề sức khỏe. Tại {HOSPITAL_CONTACT.name}, từng ca bệnh đều được thăm khám cẩn trọng, giải thích rõ ràng và đồng hành chu đáo bằng cả tấm lòng.
            </p>

            <div className="animate-hero-3 flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/dat-lich"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-semibold text-sm transition-colors shadow-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>Đặt lịch khám</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <a
                href={HOSPITAL_CONTACT.hotlineTel}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-sm transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Hotline: {HOSPITAL_CONTACT.hotlineDisplay}</span>
              </a>
            </div>

            <div className="animate-hero-4 flex items-center gap-2 text-xs text-[var(--color-fg-subtle)] pt-1">
              <MapPin className="w-3.5 h-3.5 text-[var(--color-plum-primary)] shrink-0" />
              <span>{HOSPITAL_CONTACT.shortAddress} &bull; {HOSPITAL_CONTACT.emergencyHours}</span>
            </div>
          </div>
        </div>

        {/* Bottom Part: 3 Architectural Editorial Frames */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Frame 1: Pet care & gentle bonding (2B-04, 2B-08: LCP on mobile, eager load, responsive WebP) */}
          <div className={`${styles.frameLeft} animate-arch-1 h-[340px] sm:h-[400px] lg:h-[440px]`}>
            <span className={styles.topPillTag}>01 &bull; Chăm Sóc</span>
            <img
              src="/images/hero-vet-care.webp"
              srcSet="/images/hero-vet-care-400w.webp 400w, /images/hero-vet-care-800w.webp 800w, /images/hero-vet-care.webp 1200w"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
              alt="Chăm sóc và vỗ về thú cưng ân cần (Hình ảnh minh họa)"
              width={1200}
              height={800}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className={styles.editorialImage}
            />
            <div className={styles.frameCaption}>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-plum-orchid-light)]">
                Lâm Sàng Chuẩn Mực
              </span>
              <p className="font-serif font-semibold text-base sm:text-lg leading-tight mt-0.5">
                Ân cần vỗ về & thấu hiểu thú cưng
              </p>
            </div>
          </div>

          {/* Frame 2: Cat wellness (2B-14, 2B-20: LCP on desktop, eager + high fetch priority, responsive WebP) */}
          <div className={`${styles.frameCenter} animate-arch-2 h-[340px] sm:h-[400px] lg:h-[440px]`}>
            <span className={styles.topPillTag}>02 &bull; Không Gian</span>
            <img
              src="/images/hero-happy-cat.webp"
              srcSet="/images/hero-happy-cat-400w.webp 400w, /images/hero-happy-cat-800w.webp 800w, /images/hero-happy-cat.webp 1200w"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
              alt="Mèo cưng khỏe mạnh, bình yên (Hình ảnh minh họa)"
              width={1200}
              height={826}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className={styles.editorialImage}
            />
            <div className={styles.frameCaption}>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-plum-orchid-light)]">
                Môi Trường Y Khoa
              </span>
              <p className="font-serif font-semibold text-base sm:text-lg leading-tight mt-0.5">
                Môi trường dịu nhẹ, giảm stress cho bé
              </p>
            </div>
          </div>

          {/* Frame 3: Cuddle / recovery connection (2B-14: eager load inside initial desktop viewport) */}
          <div className={`${styles.frameRight} animate-arch-3 h-[340px] sm:h-[400px] lg:h-[440px]`}>
            <span className={styles.topPillTag}>03 &bull; Đồng Hành</span>
            <img
              src="/images/hero-clinic-cuddle.webp"
              srcSet="/images/hero-clinic-cuddle-400w.webp 400w, /images/hero-clinic-cuddle-800w.webp 800w, /images/hero-clinic-cuddle.webp 1200w"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
              alt="Sự gắn kết thân tình và đồng hành cùng thú cưng (Hình ảnh minh họa)"
              width={1200}
              height={800}
              loading="eager"
              decoding="async"
              className={styles.editorialImage}
            />
            <div className={styles.frameCaption}>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-plum-orchid-light)]">
                Theo Dõi Sát Sao
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
