import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock,
  MapPin,
  Phone,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
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
    serviceType: 'kham-tong-quat',
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
      newErrors.phone = 'Vui lòng nhập số điện thoại'
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
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('submitting')
    // Mô phỏng kiểm tra dữ liệu client, sau đó hiển thị trạng thái thử nghiệm minh bạch
    setTimeout(() => {
      setStatus('test_completed')
    }, 500)
  }

  const handleReset = () => {
    setStatus('idle')
  }

  // Ngày tối thiểu là ngày hôm nay (khởi tạo an toàn)
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
              Chủ động đặt lịch giúp đội ngũ bác sĩ {HOSPITAL_CONTACT.name} chuẩn bị trước bệnh án, thiết bị chuyên dụng và ưu tiên tiếp đón bé chu đáo nhất.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Transparent Demo Status Notice (B01 requirement) */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3.5 shadow-xs">
          <AlertCircle className="w-5 h-5 text-[var(--color-warm-orange-dark)] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <strong className="block font-serif text-base text-[var(--color-warm-orange-dark)]">
              Thông Báo Minh Bạch — Giao Diện Thử Nghiệm (Chưa Kết Nối Cơ Sở Dữ Liệu)
            </strong>
            <p className="text-slate-700 leading-relaxed">
              Biểu mẫu dưới đây phục vụ kiểm thử giao diện người dùng và kiểm tra tính hợp lệ của cấu trúc dữ liệu đặt lịch (<code>BookingFormData</code>). Hệ thống backend tiếp nhận tự động đang được xây dựng ở Giai đoạn 4.
            </p>
            <p className="font-medium text-amber-900 pt-1">
              &bull; Để đặt hẹn khám có hiệu lực ngay lập tức, xin quý khách vui lòng liên hệ trực tiếp hotline:{' '}
              <a href={HOSPITAL_CONTACT.hotlineTel} className="underline font-bold text-[var(--color-warm-orange-dark)]">
                {HOSPITAL_CONTACT.hotlineDisplay}
              </a>{' '}
              (hoạt động 24/24).
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
                  Quy Trình Xử Lý Đặt Lịch
                </h3>
                <div className="space-y-4">
                  <div className={styles.processStep}>
                    <div className={styles.processStepDot} />
                    <p className="text-xs font-bold text-[var(--color-plum-deep)]">1. Gửi thông tin đăng ký</p>
                    <p className="text-xs text-[var(--color-fg-muted)]">Chủ nuôi cung cấp thông tin bé và dịch vụ cần khám.</p>
                  </div>
                  <div className={styles.processStep}>
                    <div className={styles.processStepDot} />
                    <p className="text-xs font-bold text-[var(--color-plum-deep)]">2. Tiếp nhận & phân loại (received)</p>
                    <p className="text-xs text-[var(--color-fg-muted)]">Hệ thống ghi nhận và chuyển điều phối viên phụ trách.</p>
                  </div>
                  <div className={styles.processStep}>
                    <div className={styles.processStepDot} />
                    <p className="text-xs font-bold text-[var(--color-plum-deep)]">3. Xác nhận giờ hẹn (awaiting_confirmation)</p>
                    <p className="text-xs text-[var(--color-fg-muted)]">Nhân sự liên hệ để chốt khung giờ khám phù hợp nhất.</p>
                  </div>
                  <div className={styles.processStep}>
                    <div className={styles.processStepDot} style={{ backgroundColor: 'var(--color-status-success-text)' }} />
                    <p className="text-xs font-bold text-emerald-700">4. Đón tiếp tại viện (confirmed)</p>
                    <p className="text-xs text-[var(--color-fg-muted)]">Bé được ưu tiên tiếp nhận theo đúng thời gian đã hẹn.</p>
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

          {/* Right Column: Full Booking Form / Test Result */}
          <section className="lg:col-span-7" aria-label="Biểu mẫu đặt lịch khám">
            <div className={styles.formCard}>
              {status === 'test_completed' ? (
                /* Honest Test Result Panel - NEVER claims real appointment confirmed */
                <div className="p-6 sm:p-8 rounded-2xl bg-purple-50/70 border border-purple-200 text-center space-y-5">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-plum-primary)] text-white flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="max-w-md mx-auto space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-200 text-[var(--color-plum-deep)]">
                      Kiểm Thử Giao Diện Thành Công
                    </span>
                    <h2 className="font-serif font-bold text-2xl text-[var(--color-plum-deep)] mt-2">
                      Đã kiểm tra hợp lệ dữ liệu mẫu!
                    </h2>
                    <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
                      Toàn bộ các trường dữ liệu theo quy chuẩn <code>BookingFormData</code> (Họ tên, SĐT, Bé cưng, Dịch vụ, Thời gian) đã được kiểm tra tính hợp lệ thành công phía client.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 text-left max-w-lg mx-auto space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-[var(--color-warm-orange-dark)]">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>Lưu ý quan trọng: Chưa kết nối máy chủ</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      Do hệ thống backend đang được phát triển ở Giai đoạn 4, thông tin trên <strong>chưa được gửi vào cơ sở dữ liệu thật</strong> và <strong>chưa hình thành lịch hẹn có hiệu lực</strong> tại phòng khám.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                    <a
                      href={HOSPITAL_CONTACT.hotlineTel}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-sm transition-all shadow-[var(--shadow-warm-orange)] active:scale-[0.98]"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Gọi hotline đặt thật: {HOSPITAL_CONTACT.hotlineDisplay}</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-[var(--color-border-medium)] hover:bg-white text-xs font-semibold text-[var(--color-fg-primary)] transition-colors cursor-pointer"
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
                          type="text"
                          required
                          value={formData.ownerName}
                          onChange={(e) => {
                            setFormData({ ...formData, ownerName: e.target.value })
                            if (errors.ownerName) setErrors({ ...errors, ownerName: undefined })
                          }}
                          placeholder="Ví dụ: Nguyễn Văn An"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:border-[var(--color-plum-primary)] focus:outline-none text-sm bg-white"
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
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value })
                            if (errors.phone) setErrors({ ...errors, phone: undefined })
                          }}
                          placeholder="Ví dụ: 0912 345 678"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:border-[var(--color-plum-primary)] focus:outline-none text-sm bg-white"
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

                  {/* Section 2: Bé cưng */}
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
                          type="text"
                          required
                          value={formData.petName}
                          onChange={(e) => {
                            setFormData({ ...formData, petName: e.target.value })
                            if (errors.petName) setErrors({ ...errors, petName: undefined })
                          }}
                          placeholder="Ví dụ: Milo, Bông, Miu..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:border-[var(--color-plum-primary)] focus:outline-none text-sm bg-white"
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
                          value={formData.petType}
                          onChange={(e) => setFormData({ ...formData, petType: e.target.value as 'chó' | 'mèo' | 'khác' })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:border-[var(--color-plum-primary)] focus:outline-none text-sm bg-white cursor-pointer"
                        >
                          <option value="chó">Chó cưng</option>
                          <option value="mèo">Mèo cưng</option>
                          <option value="khác">Thú cưng khác</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="service-type" className="block text-xs font-semibold text-[var(--color-fg-primary)] mb-1.5">
                        Dịch vụ bạn quan tâm
                      </label>
                      <select
                        id="service-type"
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:border-[var(--color-plum-primary)] focus:outline-none text-sm bg-white cursor-pointer"
                      >
                        <option value="kham-tong-quat">Khám tổng quát & Chẩn đoán lâm sàng</option>
                        <option value="noi-tru">Chăm sóc nội trú 24/7</option>
                        <option value="spa">Spa & Grooming thẩm mỹ</option>
                        <option value="tiem-phong">Tiêm phòng & Phòng bệnh</option>
                        <option value="xet-nghiem">Xét nghiệm & Chẩn đoán hình ảnh</option>
                        <option value="khac">Khác (trao đổi trực tiếp khi liên hệ)</option>
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
                          type="date"
                          min={todayString}
                          required
                          value={formData.preferredDate}
                          onChange={(e) => {
                            setFormData({ ...formData, preferredDate: e.target.value })
                            if (errors.preferredDate) setErrors({ ...errors, preferredDate: undefined })
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:border-[var(--color-plum-primary)] focus:outline-none text-sm bg-white cursor-pointer"
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
                          value={formData.preferredTimeSlot}
                          onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:border-[var(--color-plum-primary)] focus:outline-none text-sm bg-white cursor-pointer"
                        >
                          <option value="sang">Buổi sáng (08:30 – 11:30)</option>
                          <option value="chieu">Buổi chiều (13:30 – 17:00)</option>
                          <option value="toi">Buổi tối (17:00 – 20:30)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="symptoms-note" className="block text-xs font-semibold text-[var(--color-fg-primary)] mb-1.5">
                        Triệu chứng hoặc ghi chú thêm (nếu có)
                      </label>
                      <textarea
                        id="symptoms-note"
                        rows={3}
                        value={formData.symptomsNote || ''}
                        onChange={(e) => setFormData({ ...formData, symptomsNote: e.target.value })}
                        placeholder="Mô tả các biểu hiện bất thường gần đây của bé (ví dụ: mệt mỏi, bỏ ăn, ngứa tai...)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border-medium)] focus:border-[var(--color-plum-primary)] focus:outline-none text-sm bg-white resize-y"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-[var(--color-border-subtle)]">
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-semibold text-sm transition-all shadow-[var(--shadow-card)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {status === 'submitting' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang kiểm tra dữ liệu mẫu...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Gửi Đăng Ký (Bản Thử Nghiệm Giao Diện)</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-[var(--color-fg-subtle)] mt-2">
                      * Biểu mẫu kiểm thử giao diện — Chưa gửi dữ liệu vào máy chủ cơ sở dữ liệu thật.
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
