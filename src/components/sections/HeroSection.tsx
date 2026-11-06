import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Calendar, ArrowRight, MapPin, CheckCircle2, Sparkles } from 'lucide-react'
import { HOSPITAL_CONTACT } from '@/config/contact'
import styles from './HeroSection.module.css'

export const HeroSection: React.FC = () => {
  return (
    <section className={styles.heroContainer}>
      <div className={styles.heroBackgroundTint} aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-16 md:pb-24 relative z-10">
        {/* Top Part: Split layout (Headline on left, Description + CTAs on right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-14 md:mb-20">
          <div className="lg:col-span-7">
            <div className="animate-hero-1 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/85 border border-purple-200/80 shadow-xs text-xs font-semibold tracking-wider mb-4 sm:mb-6 text-[var(--color-plum-primary)] backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-status-beacon shrink-0" />
              <span>{HOSPITAL_CONTACT.tagline} &bull; Tiếp nhận 24/24</span>
            </div>

            <h1 className="animate-hero-2 text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-[1.12]">
              “Khi bé không khỏe,{' '}
              <span className="italic font-normal text-shimmer-plum">
                bạn không phải lo một mình.”
              </span>
            </h1>

            {/* Mini Trust markers strip */}
            <div className="animate-hero-3 flex flex-wrap items-center gap-x-3.5 gap-y-2 pt-5 text-xs font-medium text-[var(--color-fg-muted)]">
              <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50/90 px-3 py-1 rounded-full border border-emerald-200/70 shadow-2xs hover:-translate-y-0.5 transition-transform">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Bác sĩ trực 24/24
              </span>
              <span className="inline-flex items-center gap-1.5 text-purple-900 bg-purple-50/90 px-3 py-1 rounded-full border border-purple-200/70 shadow-2xs hover:-translate-y-0.5 transition-transform">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-plum-primary)]" /> Chẩn đoán hình ảnh kỹ thuật số
              </span>
              <span className="inline-flex items-center gap-1.5 text-amber-900 bg-amber-50/90 px-3 py-1 rounded-full border border-amber-200/70 shadow-2xs hover:-translate-y-0.5 transition-transform">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-warm-orange)]" /> Nội trú vô trùng riêng biệt
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
                className="btn-shine group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--color-plum-primary)] to-[var(--color-plum-deep)] hover:from-[var(--color-plum-deep)] hover:to-[#310D35] text-white font-semibold text-sm transition-all shadow-[var(--shadow-glow-plum)] hover:shadow-[0_16px_36px_-6px_rgba(90,30,94,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                <span>Đặt lịch khám</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href={HOSPITAL_CONTACT.hotlineTel}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--color-warm-orange)] to-[#A34507] hover:from-[#A34507] hover:to-[#873603] text-white font-semibold text-sm transition-all shadow-[var(--shadow-glow-orange)] hover:shadow-[0_16px_36px_-6px_rgba(194,86,12,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
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

        {/* Bottom Part: 3 Large Editorial Frames (Inspired by AURA) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Frame 1: Pet care & gentle bonding (2B-04, 2B-08: LCP on mobile, eager load, responsive WebP) */}
          <div className={`${styles.frameLeft} animate-arch-1 h-[340px] sm:h-[420px] lg:h-[460px]`}>
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
                Chăm Sóc
              </span>
              <p className="font-serif font-semibold text-base sm:text-lg leading-tight mt-0.5">
                Ân cần vỗ về & thấu hiểu thú cưng
              </p>
            </div>
          </div>

          {/* Frame 2: High arch / cat wellness (2B-14, 2B-20: LCP on desktop, eager + high fetch priority, responsive WebP) */}
          <div className={`${styles.frameCenter} animate-arch-2 h-[380px] sm:h-[460px] lg:h-[500px] md:-mt-6`}>
            <div className="absolute top-4 inset-x-4 flex justify-center z-10 pointer-events-none">
              <div className="surface-glass animate-float-gentle px-3.5 py-1 rounded-full text-xs font-semibold text-[var(--color-plum-deep)] flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Không gian dịu êm &bull; Chuẩn y khoa</span>
              </div>
            </div>
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
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                Thư Thái
              </span>
              <p className="font-serif font-semibold text-base sm:text-lg leading-tight mt-0.5">
                Môi trường dịu nhẹ, giảm stress cho bé
              </p>
            </div>
          </div>

          {/* Frame 3: Cuddle / recovery connection (2B-14: eager load inside initial desktop viewport) */}
          <div className={`${styles.frameRight} animate-arch-3 h-[340px] sm:h-[420px] lg:h-[460px]`}>
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
