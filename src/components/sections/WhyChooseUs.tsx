import React from 'react'
import { Link } from 'react-router-dom'
import { Stethoscope, HeartHandshake, Eye, ShieldAlert, Phone } from 'lucide-react'
import styles from './WhyChooseUs.module.css'

export const WhyChooseUs: React.FC = () => {
  return (
    <section className={styles.sectionContainer} id="vi-sao-chon-le-son">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 md:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2 block">
            Triết Lý Hoạt Động
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-tight">
            Vì sao chủ nuôi tin chọn Bệnh viện Thú y Lê Sơn?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-fg-muted)] leading-relaxed font-sans">
            Mỗi người bạn bốn chân khi bước qua cánh cửa bệnh viện đều được đón nhận như một thành viên gia đình. Chúng tôi xây dựng niềm tin từ sự cẩn trọng y khoa và tấm lòng yêu thương động vật chân thành.
          </p>
        </div>

        {/* Immersive Split Layout: Left Large Image, Right Asymmetric Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Large Immersive Photography with Warm Mood */}
          <div className="lg:col-span-5 flex flex-col">
            <div className={styles.imageWrapper}>
              <img
                src="/images/why-pet-companion.jpg"
                alt="Thú cưng bình yên, tin cậy dưới sự chăm sóc của bệnh viện"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-plum-deep)]/75 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-300 mb-1">
                  Chăm sóc bằng sự thấu hiểu
                </span>
                <p className="font-serif font-semibold text-lg sm:text-xl leading-snug">
                  Nơi sự hồi phục của bé cưng là niềm hạnh phúc trọn vẹn của đội ngũ.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Asymmetric Bento Grid (3 Core Values + 1 Emergency Banner) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-5">
            {/* Value 1: Chuyên môn & Trách nhiệm */}
            <div className={styles.bentoCard}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-[var(--color-plum-primary)] border border-purple-100 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)] mb-1.5">
                    1. Chuyên môn và trách nhiệm
                  </h3>
                  <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
                    Quy trình tiếp cận ca bệnh cẩn trọng, dựa trên chẩn đoán khoa học và kinh nghiệm thực tiễn. Từng quyết định y khoa đều đặt tính mạng và sự an toàn của thú cưng lên hàng đầu.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 2: Tận tâm, lắng nghe */}
            <div className={styles.bentoCard}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[var(--color-warm-orange)] border border-orange-100 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)] mb-1.5">
                    2. Tận tâm, lắng nghe
                  </h3>
                  <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
                    Chúng tôi lắng nghe kỹ lưỡng từng dấu hiệu bất thường nhỏ nhất mà bạn quan sát được ở nhà, giải thích cặn kẽ tình trạng bệnh để bạn luôn an tâm và chủ động trong quá trình điều trị.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 3: Theo dõi & Chăm sóc minh bạch */}
            <div className={styles.bentoCard}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)] mb-1.5">
                    3. Theo dõi và chăm sóc minh bạch
                  </h3>
                  <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
                    Minh bạch về kết quả thăm khám, liệu trình điều trị và chi phí dịch vụ. Đối với thú cưng lưu trú, tình trạng sức khỏe được thông tin trung thực, rõ ràng đến chủ nuôi.
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency 24/24 Callout Bento */}
            <div className={styles.emergencyBanner}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[var(--color-warm-orange)] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block">
                      Hỗ Trợ Khẩn Cấp
                    </span>
                    <p className="font-serif font-bold text-base sm:text-lg text-white">
                      Tiếp nhận Cấp cứu 24/24 — Không gián đoạn
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="tel:0973555105"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>097 355 51 05</span>
                  </a>
                  <Link
                    to="/dich-vu/cap-cuu"
                    className="inline-flex items-center text-xs text-white/80 hover:text-white underline underline-offset-4 font-medium"
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
