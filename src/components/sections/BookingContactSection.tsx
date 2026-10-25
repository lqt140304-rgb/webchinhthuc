import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock, ShieldAlert, Navigation, AlertCircle, Calendar } from 'lucide-react'
import { HOSPITAL_CONTACT } from '@/config/contact'
import styles from './BookingContactSection.module.css'

export const BookingContactSection: React.FC = () => {
  const [showDemoNotice, setShowDemoNotice] = useState(false)
  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    petType: 'chó',
    service: 'kham-tong-quat',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Không bao giờ báo thành công giả — Hiển thị thông báo minh bạch
    setShowDemoNotice(true)
  }

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

              {/* Bottom Alert Banner */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-[var(--color-warm-orange-light)] shrink-0" />
                <p className="text-xs text-slate-300 leading-snug">
                  Đội ngũ bác sĩ trực sẵn sàng tiếp nhận thú cưng khẩn cấp trong mọi khung giờ đêm hoặc ngày lễ.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Transparent Preview Form (Honest Status) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className={styles.formCard}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[var(--color-plum-deep)]">
                  Đăng Ký Tư Vấn & Đặt Hẹn
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-100 text-[var(--color-plum-primary)]">
                  Bản Mẫu Giao Diện
                </span>
              </div>

              {/* Transparent Status Banner */}
              <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200/90 text-xs text-amber-950 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[var(--color-warm-orange-dark)] shrink-0 mt-0.5" />
                <div>
                  <strong>Thông báo minh bạch:</strong> Biểu mẫu dưới đây là bản mẫu giao diện tương tác (chưa kết nối cơ sở dữ liệu tiếp nhận). Để đặt lịch hẹn có hiệu lực ngay, quý khách vui lòng liên hệ qua hotline <strong>{HOSPITAL_CONTACT.hotlineDisplay}</strong>.
                </div>
              </div>

              {showDemoNotice ? (
                <div className="p-6 rounded-2xl bg-purple-50/70 border border-purple-200 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--color-plum-primary)] text-white flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-[var(--color-plum-deep)]">
                    Hướng Dẫn Đặt Lịch Trực Tiếp
                  </h4>
                  <p className="text-sm text-[var(--color-fg-muted)] max-w-md mx-auto leading-relaxed">
                    Hệ thống đặt lịch trực tuyến đang được hoàn thiện kỹ thuật ở Giai đoạn 4. Để đảm bảo lịch hẹn của bé được phục vụ chu đáo nhất, xin quý khách gọi điện trực tiếp hotline:
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={HOSPITAL_CONTACT.hotlineTel}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-sm transition-all shadow-[var(--shadow-warm-orange)] active:scale-[0.98]"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Gọi ngay: {HOSPITAL_CONTACT.hotlineDisplay}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setShowDemoNotice(false)}
                      className="px-5 py-3 rounded-xl border border-[var(--color-border-medium)] text-xs font-semibold text-[var(--color-fg-primary)] hover:bg-white transition-colors active:scale-[0.98] cursor-pointer"
                    >
                      Xem lại biểu mẫu
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="owner-name-input" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-primary)] mb-1.5">
                        Họ tên của bạn *
                      </label>
                      <input
                        id="owner-name-input"
                        type="text"
                        required
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:border-[var(--color-plum-primary)] focus:outline-none text-sm bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone-input" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-primary)] mb-1.5">
                        Số điện thoại *
                      </label>
                      <input
                        id="phone-input"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Ví dụ: 0912 345 678"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:border-[var(--color-plum-primary)] focus:outline-none text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pet-type-select" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-primary)] mb-1.5">
                        Loài thú cưng
                      </label>
                      <select
                        id="pet-type-select"
                        value={formData.petType}
                        onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:border-[var(--color-plum-primary)] focus:outline-none text-sm bg-white cursor-pointer"
                      >
                        <option value="chó">Chó cưng</option>
                        <option value="mèo">Mèo cưng</option>
                        <option value="khác">Thú cưng khác</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="service-select" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-primary)] mb-1.5">
                        Dịch vụ quan tâm
                      </label>
                      <select
                        id="service-select"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:border-[var(--color-plum-primary)] focus:outline-none text-sm bg-white cursor-pointer"
                      >
                        <option value="kham-tong-quat">Khám & Điều trị lâm sàng</option>
                        <option value="noi-tru">Chăm sóc nội trú 24/7</option>
                        <option value="spa">Spa & Grooming thẩm mỹ</option>
                        <option value="cap-cuu">Hỗ trợ khẩn cấp / Cấp cứu</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-semibold text-sm transition-all shadow-[var(--shadow-card)] active:scale-[0.98] cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Thử nghiệm gửi yêu cầu (Bản mẫu)</span>
                    </button>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border-subtle)] text-center">
                    <Link
                      to="/dat-lich"
                      className="text-xs text-[var(--color-plum-primary)] hover:text-[var(--color-plum-deep)] font-medium underline underline-offset-4"
                    >
                      Xem trang thông tin đặt lịch chi tiết đầy đủ &rarr;
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
