import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock,
  MapPin,
  Phone,
  ShieldAlert,
  AlertCircle,
  Send,
  Sparkles,
  Info,
  Navigation,
  RotateCcw,
} from 'lucide-react'
import { HOSPITAL_CONTACT } from '@/config/contact'
import type { BookingFormData } from '@/types'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import styles from './BookingPage.module.css'

const getTodayDateString = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const BookingPage: React.FC = () => {
  useRouteSeo({
    title: 'Đặt Lịch Khám Trực Tuyến — Bệnh viện Thú y Lê Sơn',
    description:
      'Đăng ký lịch khám và tư vấn y tế cho thú cưng tại Bệnh viện Thú y Lê Sơn, 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội. Tiếp nhận cấp cứu 24/24.',
    isIndexable: false, // Giữ noindex cho trang WIP trước khi backend chính thức ra mắt ở GĐ4
  })

  const [formData, setFormData] = useState<BookingFormData>({
    ownerName: '',
    phone: '',
    petName: '',
    petType: 'chó',
    serviceType: 'kham-dieu-tri',
    preferredDate: '',
    preferredTimeSlot: 'sang',
    symptomsNote: '',
  })

  const [status, setStatus] = useState<'idle' | 'submitting' | 'test_completed'>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {}

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Vui lòng nhập họ tên của bạn'
    } else if (formData.ownerName.trim().length < 2) {
      newErrors.ownerName = 'Họ tên cần tối thiểu 2 ký tự'
    }

    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại liên hệ'
    } else if (!phoneRegex.test(formData.phone.trim().replace(/\s+/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (cần 10 chữ số)'
    }

    if (!formData.petName.trim()) {
      newErrors.petName = 'Vui lòng nhập tên của bé cưng'
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Vui lòng chọn ngày khám mong muốn'
    }

    setErrors(newErrors)

    const hasErrors = Object.keys(newErrors).length > 0
    if (hasErrors) {
      // 2B-10: Chuyển focus ngay lập tức tới trường lỗi đầu tiên
      const firstInvalidId = newErrors.ownerName
        ? 'owner-name'
        : newErrors.phone
        ? 'owner-phone'
        : newErrors.petName
        ? 'pet-name'
        : 'preferred-date'
      const el = document.getElementById(firstInvalidId)
      if (el) {
        el.setAttribute('aria-invalid', 'true')
        el.focus()
      }
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('submitting')
    // Mô phỏng kiểm tra dữ liệu, sau đó hiển thị thông báo minh bạch
    setTimeout(() => {
      setStatus('test_completed')
    }, 400)
  }

  const handleReset = () => {
    setStatus('idle')
    setErrors({})
  }

  // Ngày tối thiểu là ngày hôm nay
  const [todayString] = useState(getTodayDateString)

  return (
    <div className={styles.pageContainer}>
      {/* Header Banner */}
      <header className={styles.headerBanner}>
        <div className={styles.headerPattern} aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-xs text-purple-200">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>/</li>
              <li className="text-white font-medium" aria-current="page">
                Đặt lịch khám
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[var(--color-plum-orchid-light)] text-xs font-bold uppercase tracking-wider mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tiếp Nhận Thăm Khám Y Khoa</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Đăng ký lịch khám cho bé cưng
            </h1>
            <p className="mt-3 text-sm sm:text-base text-purple-100/90 leading-relaxed max-w-2xl">
              Đăng ký thông tin giúp đội ngũ {HOSPITAL_CONTACT.name} nắm trước nhu cầu thăm khám và hướng dẫn bạn chuẩn bị chu đáo nhất cho bé cưng.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Transparent Notice (2B-03: không chứa thuật ngữ kỹ thuật BookingFormData, client, API, database) */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3.5 shadow-xs">
          <AlertCircle className="w-5 h-5 text-[var(--color-warm-orange-dark)] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <strong className="block font-serif text-base text-[var(--color-warm-orange-dark)]">
              Thông Báo Minh Bạch — Giao Diện Đang Trong Giai Đoạn Thử Nghiệm
            </strong>
            <p className="text-slate-700 leading-relaxed">
              Biểu mẫu dưới đây đang trong giai đoạn thử nghiệm giao diện. Bệnh viện chưa tiếp nhận thông tin đăng ký tự động qua website.
            </p>
            <p className="font-medium text-amber-900 pt-1">
              &bull; Để đặt hẹn khám có hiệu lực ngay, xin quý khách vui lòng liên hệ trực tiếp hotline:{' '}
              <a href={HOSPITAL_CONTACT.hotlineTel} className="underline font-bold text-[var(--color-warm-orange-dark)]">
                {HOSPITAL_CONTACT.hotlineDisplay}
              </a>{' '}
              (tiếp nhận 24/24).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Clinic Info & Process Guide */}
          <aside className="lg:col-span-5 space-y-6">
            <div className={styles.sidebarCard}>
              <h2 className="font-serif font-bold text-xl text-[var(--color-plum-deep)] mb-4">
                Thông Tin Tiếp Nhận Tại Viện
              </h2>

              <ul className="space-y-4 text-sm text-[var(--color-fg-muted)]">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[var(--color-fg-primary)] block font-medium">Địa chỉ cơ sở:</strong>
                    <span>{HOSPITAL_CONTACT.address}</span>
                    <div className="mt-1.5">
                      <a
                        href={HOSPITAL_CONTACT.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[var(--color-plum-primary)] hover:underline font-semibold"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Mở bản đồ Google Maps</span>
                      </a>
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[var(--color-fg-primary)] block font-medium">Khung giờ hoạt động:</strong>
                    <span>Khám tham chiếu: {HOSPITAL_CONTACT.workingHours}</span>
                    <p className="text-xs text-[var(--color-warm-orange-dark)] font-semibold mt-0.5">
                      * Cấp cứu y tế tiếp nhận 24/24
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[var(--color-warm-orange)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[var(--color-fg-primary)] block font-medium">Hotline hỗ trợ:</strong>
                    <a
                      href={HOSPITAL_CONTACT.hotlineTel}
                      className="text-base font-bold text-[var(--color-warm-orange-dark)] hover:underline inline-block mt-0.5"
                    >
                      {HOSPITAL_CONTACT.hotlineDisplay}
                    </a>
                  </div>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-[var(--color-border-subtle)]">
                <h3 className="font-serif font-bold text-sm text-[var(--color-plum-deep)] uppercase tracking-wider mb-3">
                  Quy Trình Dự Kiến Khi Hệ Thống Vận Hành
                </h3>
                <div className="space-y-4">
                  <div className={styles.processStep}>
                    <div className={styles.processStepDot} />
                    <p className="text-xs font-bold text-[var(--color-plum-deep)]">1. Gửi thông tin đăng ký</p>
                    <p className="text-xs text-[var(--color-fg-muted)]">Chủ nuôi cung cấp thông tin bé và nhu cầu thăm khám.</p>
                  </div>
                  <div className={styles.processStep}>
                    <div className={styles.processStepDot} />
                    <p className="text-xs font-bold text-[var(--color-plum-deep)]">2. Tiếp nhận & phân loại</p>
                    <p className="text-xs text-[var(--color-fg-muted)]">Hệ thống ghi nhận và chuyển bộ phận phụ trách chuyên môn.</p>
                  </div>
                  <div className={styles.processStep}>
                    <div className={styles.processStepDot} />
                    <p className="text-xs font-bold text-[var(--color-plum-deep)]">3. Xác nhận giờ hẹn</p>
                    <p className="text-xs text-[var(--color-fg-muted)]">Nhân sự liên hệ qua điện thoại để thống nhất khung giờ phù hợp.</p>
                  </div>
                  <div className={styles.processStep}>
                    <div className={styles.processStepDot} style={{ backgroundColor: 'var(--color-status-success-text)' }} />
                    <p className="text-xs font-bold text-emerald-700">4. Đón tiếp tại viện</p>
                    <p className="text-xs text-[var(--color-fg-muted)]">Đón tiếp và thăm khám theo thời gian đã thống nhất.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Hotline Alert Box */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 shadow-sm">
              <div className="flex items-start gap-3.5">
                <ShieldAlert className="w-6 h-6 text-amber-200 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Trường Hợp Cấp Cứu Khẩn Cấp
                  </h3>
                  <p className="text-xs text-amber-100 mt-1.5 leading-relaxed">
                    Nếu bé có dấu hiệu nguy kịch (khó thở, co giật, xuất huyết, ngộ độc, tai nạn), <strong>xin không đợi phản hồi từ form</strong>. Hãy đưa bé ngay đến 101 Khuất Duy Tiến hoặc gọi cấp cứu:
                  </p>
                  <a
                    href={HOSPITAL_CONTACT.hotlineTel}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-orange-700 hover:bg-amber-50 font-bold text-xs transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi cấp cứu ngay: {HOSPITAL_CONTACT.hotlineDisplay}</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Full Booking Form / Transparent Result Panel */}
          <section className="lg:col-span-7" aria-label="Biểu mẫu đặt lịch khám">
            <div className={styles.formCard}>
              {status === 'test_completed' ? (
                /* 2B-03: Honest Test Result Panel - NEVER claims real appointment confirmed */
                <div
                  role="status"
                  aria-live="polite"
                  className="p-6 sm:p-8 rounded-2xl bg-purple-50/70 border border-purple-200 text-center space-y-5"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-plum-primary)] text-white flex items-center justify-center shadow-md">
                    <Info className="w-7 h-7 text-amber-200" />
                  </div>

                  <div className="max-w-md mx-auto space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-200 text-[var(--color-plum-deep)]">
                      Giao Diện Thử Nghiệm
                    </span>
                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-[var(--color-plum-deep)] leading-snug">
                      Thông tin bạn nhập chưa được gửi đến bệnh viện.
                    </h2>
                    <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
                      Để đặt lịch khám, vui lòng gọi <strong className="text-[var(--color-plum-deep)] font-bold">{HOSPITAL_CONTACT.hotlineDisplay}</strong>.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                    <a
                      href={HOSPITAL_CONTACT.hotlineTel}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-sm transition-all shadow-[var(--shadow-warm-orange)] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--color-warm-orange)] focus:ring-offset-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Gọi hotline: {HOSPITAL_CONTACT.hotlineDisplay}</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-[var(--color-border-medium)] hover:bg-white text-xs font-semibold text-[var(--color-fg-primary)] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-primary)] focus:ring-offset-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Thử lại biểu mẫu</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* The Full Booking Form */
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="border-b border-[var(--color-border-subtle)] pb-4">
                    <h2 className="font-serif font-bold text-2xl text-[var(--color-plum-deep)]">
                      Biểu Mẫu Đặt Hẹn Chi Tiết
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] mt-1">
                      Các trường có dấu sao (*) là thông tin bắt buộc.
                    </p>
                  </div>

                  {/* Section 1: Chủ nuôi */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)]">
                      1. Thông tin người đặt hẹn
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="owner-name" className="block text-xs font-semibold text-[var(--color-fg-primary)] mb-1.5">
                          Họ và tên của bạn *
                        </label>
                        <input
                          id="owner-name"
                          name="ownerName"
                          type="text"
                          required
                          value={formData.ownerName}
                          onChange={(e) => {
                            setFormData({ ...formData, ownerName: e.target.value })
                            if (errors.ownerName) setErrors({ ...errors, ownerName: undefined })
                          }}
                          placeholder="Ví dụ: Nguyễn Văn An"
                          className={`w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-primary)] focus:border-[var(--color-plum-primary)] text-sm bg-white ${styles.fieldInput}`}
                          aria-invalid={!!errors.ownerName}
                          aria-describedby={errors.ownerName ? 'owner-name-error' : undefined}
                        />
                        {errors.ownerName && (
                          <p id="owner-name-error" className="mt-1 text-xs text-rose-600 font-medium">
                            {errors.ownerName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="owner-phone" className="block text-xs font-semibold text-[var(--color-fg-primary)] mb-1.5">
                          Số điện thoại liên hệ *
                        </label>
                        <input
                          id="owner-phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value })
                            if (errors.phone) setErrors({ ...errors, phone: undefined })
                          }}
                          placeholder="Ví dụ: 0912 345 678"
                          className={`w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-primary)] focus:border-[var(--color-plum-primary)] text-sm bg-white ${styles.fieldInput}`}
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? 'owner-phone-error' : undefined}
                        />
                        {errors.phone && (
                          <p id="owner-phone-error" className="mt-1 text-xs text-rose-600 font-medium">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Bé cưng & Dịch vụ */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)]">
                      2. Thông tin thú cưng & Dịch vụ
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="pet-name" className="block text-xs font-semibold text-[var(--color-fg-primary)] mb-1.5">
                          Tên của bé cưng *
                        </label>
                        <input
                          id="pet-name"
                          name="petName"
                          type="text"
                          required
                          value={formData.petName}
                          onChange={(e) => {
                            setFormData({ ...formData, petName: e.target.value })
                            if (errors.petName) setErrors({ ...errors, petName: undefined })
                          }}
                          placeholder="Ví dụ: Milo, Bông, Miu..."
                          className={`w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-primary)] focus:border-[var(--color-plum-primary)] text-sm bg-white ${styles.fieldInput}`}
                          aria-invalid={!!errors.petName}
                          aria-describedby={errors.petName ? 'pet-name-error' : undefined}
                        />
                        {errors.petName && (
                          <p id="pet-name-error" className="mt-1 text-xs text-rose-600 font-medium">
                            {errors.petName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="pet-type" className="block text-xs font-semibold text-[var(--color-fg-primary)] mb-1.5">
                          Loài thú cưng
                        </label>
                        <select
                          id="pet-type"
                          name="petType"
                          value={formData.petType}
                          onChange={(e) => setFormData({ ...formData, petType: e.target.value as 'chó' | 'mèo' | 'khác' })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-primary)] focus:border-[var(--color-plum-primary)] text-sm bg-white cursor-pointer ${styles.fieldSelect}`}
                        >
                          <option value="chó">Chó cưng</option>
                          <option value="mèo">Mèo cưng</option>
                          <option value="khác">Thú cưng khác</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="service-type" className="block text-xs font-semibold text-[var(--color-fg-primary)] mb-1.5">
                        Dịch vụ bạn quan tâm (Bản thử nghiệm)
                      </label>
                      <select
                        id="service-type"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-primary)] focus:border-[var(--color-plum-primary)] text-sm bg-white cursor-pointer ${styles.fieldSelect}`}
                      >
                        <option value="kham-dieu-tri">Khám & điều trị</option>
                        <option value="noi-tru">Chăm sóc nội trú 24/7</option>
                        <option value="spa">Spa & Grooming</option>
                        <option value="cap-cuu">Cấp cứu 24/24</option>
                        <option value="khac">Dịch vụ khác (trao đổi trực tiếp)</option>
                      </select>
                    </div>
                  </div>

                  {/* Section 3: Thời gian mong muốn */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)]">
                      3. Thời gian mong muốn & Triệu chứng
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="preferred-date" className="block text-xs font-semibold text-[var(--color-fg-primary)] mb-1.5">
                          Ngày hẹn dự kiến *
                        </label>
                        <input
                          id="preferred-date"
                          name="preferredDate"
                          type="date"
                          min={todayString}
                          required
                          value={formData.preferredDate}
                          onChange={(e) => {
                            setFormData({ ...formData, preferredDate: e.target.value })
                            if (errors.preferredDate) setErrors({ ...errors, preferredDate: undefined })
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-primary)] focus:border-[var(--color-plum-primary)] text-sm bg-white cursor-pointer ${styles.fieldInput}`}
                          aria-invalid={!!errors.preferredDate}
                          aria-describedby={errors.preferredDate ? 'preferred-date-error' : undefined}
                        />
                        {errors.preferredDate && (
                          <p id="preferred-date-error" className="mt-1 text-xs text-rose-600 font-medium">
                            {errors.preferredDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="preferred-timeslot" className="block text-xs font-semibold text-[var(--color-fg-primary)] mb-1.5">
                          Khung giờ mong muốn
                        </label>
                        <select
                          id="preferred-timeslot"
                          name="preferredTimeSlot"
                          value={formData.preferredTimeSlot}
                          onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-primary)] focus:border-[var(--color-plum-primary)] text-sm bg-white cursor-pointer ${styles.fieldSelect}`}
                        >
                          <option value="sang">Buổi sáng (đề xuất 08:00 – 12:00)</option>
                          <option value="chieu">Buổi chiều (đề xuất 12:00 – 17:00)</option>
                          <option value="toi">Buổi tối (đề xuất 17:00 – 21:00)</option>
                          <option value="linh-hoat">Linh hoạt theo sắp xếp của phòng khám</option>
                        </select>
                        <p className="text-[11px] text-[var(--color-fg-subtle)] mt-1">
                          * Khung giờ đề xuất tham khảo, phòng khám sẽ liên hệ xác nhận giờ hẹn chính xác.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="symptoms-note" className="block text-xs font-semibold text-[var(--color-fg-primary)] mb-1.5">
                        Triệu chứng hoặc ghi chú thêm (nếu có)
                      </label>
                      <textarea
                        id="symptoms-note"
                        name="symptomsNote"
                        rows={3}
                        value={formData.symptomsNote || ''}
                        onChange={(e) => setFormData({ ...formData, symptomsNote: e.target.value })}
                        placeholder="Mô tả các biểu hiện bất thường gần đây của bé (ví dụ: mệt mỏi, bỏ ăn, ngứa tai...)"
                        className={`w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-primary)] focus:border-[var(--color-plum-primary)] text-sm bg-white resize-y ${styles.fieldTextarea}`}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-[var(--color-border-subtle)]">
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-semibold text-sm transition-all shadow-[var(--shadow-card)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-primary)] focus:ring-offset-2"
                    >
                      {status === 'submitting' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang kiểm tra thông tin...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Gửi Đăng Ký (Giao Diện Thử Nghiệm)</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-[var(--color-fg-subtle)] mt-2">
                      * Biểu mẫu thử nghiệm giao diện — Thông tin chưa gửi đến bệnh viện. Để đặt hẹn ngay, xin gọi {HOSPITAL_CONTACT.hotlineDisplay}.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
