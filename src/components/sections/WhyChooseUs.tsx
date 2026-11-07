import React from 'react'
import { Link } from 'react-router-dom'
import { Stethoscope, HeartHandshake, Eye, ShieldAlert, Phone } from 'lucide-react'
import { HOSPITAL_CONTACT } from '@/config/contact'
import styles from './WhyChooseUs.module.css'

export const WhyChooseUs: React.FC = () => {
  return (
    <section className={styles.sectionContainer} id="vi-sao-chon-le-son">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 md:mb-16" data-reveal="up">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2.5 block">
            01 &mdash; Triết Lý Y Khoa Tận Tâm
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-tight">
            Vì sao chủ nuôi tin chọn {HOSPITAL_CONTACT.name}?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-fg-muted)] leading-relaxed font-sans">
            Mỗi người bạn bốn chân khi bước qua cánh cửa bệnh viện đều được đón nhận như một thành viên gia đình. Chúng tôi xây dựng niềm tin từ sự cẩn trọng y khoa và tấm lòng yêu thương động vật chân thành.
          </p>
        </div>

        {/* Split Layout: Left Clinical Photography, Right Structured Value Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Photography */}
          <div className="lg:col-span-5 flex flex-col" data-reveal="left">
            <div className={styles.imageWrapper}>
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1.5 rounded-lg bg-white/92 backdrop-blur-md border border-[var(--color-border-subtle)] text-[11px] font-semibold uppercase tracking-wider text-[var(--color-plum-deep)] inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-status-beacon" />
                  Chuẩn mực chăm sóc y khoa
                </span>
              </div>
              <img
                src="/images/why-pet-companion.webp"
                alt="Thú cưng bình yên, tin cậy dưới sự chăm sóc của bệnh viện (Hình ảnh minh họa)"
                width={800}
                height={1000}
                decoding="async"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-plum-deep)]/88 via-[var(--color-plum-deep)]/25 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <span className="text-[11px] uppercase font-bold tracking-widest text-[var(--color-plum-orchid-light)] mb-1.5">
                  Đồng Hành Y Khoa
                </span>
                <p className="font-serif font-semibold text-lg sm:text-xl leading-snug">
                  Nơi sự hồi phục của bé cưng là niềm hạnh phúc trọn vẹn của đội ngũ y bác sĩ.
                </p>
              </div>
            </div>
          </div>

          {/* Right: 3 Core Clinical Values + 1 Emergency Banner */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            {/* Value 1: Chuyên môn & Trách nhiệm */}
            <div className={styles.bentoCard} data-reveal="right" data-reveal-delay="1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-secondary)] text-[var(--color-plum-primary)] border border-[var(--color-border-subtle)] flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)]">
                      1. Chuyên môn và trách nhiệm
                    </h3>
                    <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-md bg-[var(--color-bg-primary)] text-[var(--color-fg-secondary)] border border-[var(--color-border-subtle)] shrink-0">
                      Khoa học & Thực chứng
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
                    Quy trình tiếp cận ca bệnh cẩn trọng, dựa trên chẩn đoán khoa học và kinh nghiệm thực tiễn. Từng quyết định y khoa đều đặt tính mạng và sự an toàn của thú cưng lên hàng đầu.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 2: Tận tâm, lắng nghe */}
            <div className={styles.bentoCard} data-reveal="right" data-reveal-delay="2">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-secondary)] text-[var(--color-plum-primary)] border border-[var(--color-border-subtle)] flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)]">
                      2. Tận tâm, lắng nghe
                    </h3>
                    <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-md bg-[var(--color-bg-primary)] text-[var(--color-fg-secondary)] border border-[var(--color-border-subtle)] shrink-0">
                      Thấu hiểu ân cần
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
                    Chúng tôi lắng nghe kỹ lưỡng từng dấu hiệu bất thường nhỏ nhất mà bạn quan sát được ở nhà, giải thích cặn kẽ tình trạng bệnh để bạn luôn an tâm và chủ động trong quá trình điều trị.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 3: Theo dõi & Chăm sóc minh bạch */}
            <div className={styles.bentoCard} data-reveal="right" data-reveal-delay="3">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-secondary)] text-[var(--color-plum-primary)] border border-[var(--color-border-subtle)] flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)]">
                      3. Theo dõi và chăm sóc minh bạch
                    </h3>
                    <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-md bg-[var(--color-bg-primary)] text-[var(--color-fg-secondary)] border border-[var(--color-border-subtle)] shrink-0">
                      Cập nhật 24/7
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
                    Minh bạch về kết quả thăm khám, liệu trình điều trị và chi phí dịch vụ. Đối với thú cưng lưu trú, tình trạng sức khỏe được thông tin trung thực, rõ ràng đến chủ nuôi.
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency 24/24 Callout */}
            <div className={styles.emergencyBanner} data-reveal="up" data-reveal-delay="4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 text-[var(--color-warm-orange-light)] flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-plum-orchid-light)] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-status-beacon" />
                      Hỗ Trợ Khẩn Cấp &bull; Trực Đêm
                    </span>
                    <p className="font-serif font-bold text-base sm:text-lg text-white mt-0.5">
                      Tiếp nhận Cấp cứu 24/24 — Không gián đoạn
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                  <a
                    href={HOSPITAL_CONTACT.hotlineTel}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{HOSPITAL_CONTACT.hotlineDisplay}</span>
                  </a>
                  <Link
                    to="/dich-vu/cap-cuu"
                    className="inline-flex items-center text-xs text-[var(--color-plum-orchid-light)] hover:text-white underline underline-offset-4 font-medium"
                  >
                    Hướng dẫn cấp cứu
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
