import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock, ShieldAlert, Navigation, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react'
import { HOSPITAL_CONTACT } from '@/config/contact'
import styles from './BookingContactSection.module.css'

export const BookingContactSection: React.FC = () => {
  return (
    <section className={styles.contactSection} id="dat-lich-va-lien-he">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 md:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2 block">
            Đặt Lịch Khám & Liên Hệ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-tight">
            Sẵn sàng đồng hành cùng bạn và bé cưng
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[var(--color-fg-muted)] leading-relaxed font-sans">
            Bệnh viện Thú y Lê Sơn tọa lạc tại trung tâm quận Thanh Xuân, Hà Nội, thuận tiện di chuyển và mở cửa tiếp nhận cấp cứu 24/24.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Verified Clinic Info & Direct Contact */}
          <div className="lg:col-span-5 flex flex-col">
            <div className={styles.infoCard}>
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-plum-orchid-light)]">
                    Thông Tin Địa Chỉ & Hotline
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-white mt-1">
                    {HOSPITAL_CONTACT.name}
                  </h3>
                </div>

                <ul className="space-y-4 text-sm text-slate-200">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[var(--color-plum-orchid-light)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">Địa chỉ cơ sở:</strong>
                      <span>{HOSPITAL_CONTACT.address}</span>
                      <div className="mt-2">
                        <a
                          href={HOSPITAL_CONTACT.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white underline underline-offset-4 font-semibold"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Xem chỉ đường trên Google Maps</span>
                        </a>
                      </div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[var(--color-warm-orange-light)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">Hotline tư vấn & Cấp cứu 24/24:</strong>
                      <a
                        href={HOSPITAL_CONTACT.hotlineTel}
                        className="text-lg font-bold text-[var(--color-warm-orange-light)] hover:underline inline-block mt-0.5"
                      >
                        {HOSPITAL_CONTACT.hotlineDisplay}
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[var(--color-plum-orchid-light)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">Thời gian hoạt động:</strong>
                      <span>Giờ khám tham chiếu: {HOSPITAL_CONTACT.workingHours}</span>
                      <p className="text-xs text-[var(--color-warm-orange-light)] font-semibold mt-1">
                        * {HOSPITAL_CONTACT.emergencyHours}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Bottom Alert Banner - B02: đã bỏ cam kết trực ngày lễ chưa xác minh */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-[var(--color-warm-orange-light)] shrink-0" />
                <p className="text-xs text-slate-300 leading-snug">
                  Đội ngũ bác sĩ sẵn sàng tiếp nhận thú cưng khẩn cấp trong khung giờ trực cấp cứu 24/24.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Refined Booking Call To Action Card (B01: không đặt form đầy đủ trên trang chủ) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className={styles.ctaCard}>
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-[var(--color-plum-primary)] text-xs font-semibold uppercase tracking-wider mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Đặt Lịch Khám Chu Đáo</span>
                  </div>

                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[var(--color-plum-deep)] mb-3 leading-snug">
                    Chủ động thời gian, an tâm đồng hành cùng bé cưng
                  </h3>

                  <p className="text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed font-sans mb-6">
                    Để giảm thiểu thời gian chờ đợi và giúp bác sĩ chuẩn bị chu đáo nhất hồ sơ thăm khám cho thú cưng, quý khách có thể chủ động đăng ký trước qua trang đặt lịch trực tuyến hoặc liên hệ trực tiếp hotline.
                  </p>

                  <div className="space-y-3 pt-1 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm text-[var(--color-fg-primary)]">
                        <strong>Tiếp nhận ưu tiên:</strong> Giảm tối đa thời gian chờ tại phòng khám, hạn chế căng thẳng cho thú cưng.
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-100 text-[var(--color-plum-primary)] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm text-[var(--color-fg-primary)]">
                        <strong>Chuẩn bị trước y án:</strong> Bác sĩ chuyên khoa theo dõi trước tiền sử sức khỏe và dịch tễ.
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-orange-100 text-[var(--color-warm-orange-dark)] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm text-[var(--color-fg-primary)]">
                        <strong>Tư vấn chuẩn bị:</strong> Hướng dẫn chi tiết trước khi đưa bé đến viện (chế độ nhịn ăn, sổ tiêm chủng).
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[var(--color-border-subtle)] space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Link
                      to="/dat-lich"
                      className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-semibold text-sm transition-all shadow-[var(--shadow-card)] active:scale-[0.98] group"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Đặt lịch khám trực tuyến</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <a
                      href={HOSPITAL_CONTACT.hotlineTel}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-sm transition-all shadow-[var(--shadow-warm-orange)] active:scale-[0.98]"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Hotline: {HOSPITAL_CONTACT.hotlineDisplay}</span>
                    </a>
                  </div>

                  <p className="text-xs text-[var(--color-fg-subtle)] flex items-center gap-1.5 italic">
                    <ShieldAlert className="w-3.5 h-3.5 text-[var(--color-warm-orange-dark)] shrink-0" />
                    <span>Hỗ trợ cấp cứu 24/24 — Không cần đặt lịch trước trong trường hợp khẩn cấp.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
