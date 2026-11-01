import React from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Clock,
  Compass,
  Calendar,
  ShieldAlert,
  ExternalLink,
  Car,
  Info,
  Building2,
  HeartHandshake,
} from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import { HOSPITAL_CONTACT } from '@/config/contact'
import { EditorialBreadcrumb } from '@/components/editorial/EditorialBreadcrumb'
import { EditorialPolicyBanner } from '@/components/editorial/EditorialPolicyBanner'

export function ContactPage(): React.ReactElement {
  useRouteSeo({
    title: `Liên hệ & Thông tin phòng khám — ${HOSPITAL_CONTACT.name}`,
    description: `Địa chỉ: ${HOSPITAL_CONTACT.address} | Hotline 24/24: ${HOSPITAL_CONTACT.hotlineDisplay}.`,
    isIndexable: false,
  })

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)] pb-20">
      {/* Editorial Breadcrumb */}
      <EditorialBreadcrumb
        currentPage="Liên hệ & Thông tin phòng khám"
        parentGroup={null}
      />

      {/* Hero Header */}
      <section
        aria-labelledby="contact-heading"
        className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-[var(--color-border-subtle)] bg-gradient-to-b from-[var(--color-bg-subtle)] to-[var(--color-bg-primary)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[var(--color-plum-50)] text-[var(--color-plum-deep)] text-xs font-semibold tracking-wider uppercase mb-4 border border-[var(--color-plum-100)]">
              <Building2 className="w-3.5 h-3.5 text-[var(--color-plum-primary)]" aria-hidden="true" />
              <span>Thông Tin Cơ Sở Y Tế</span>
            </div>
            <h1
              id="contact-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-tight"
            >
              Liên hệ &amp; Chỉ đường cơ sở
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[var(--color-fg-muted)] leading-relaxed">
              Bệnh viện Thú y Lê Sơn luôn sẵn sàng tiếp đón và đồng hành cùng thú cưng tại cơ sở 101 Khuất Duy Tiến.
              Để đảm bảo quá trình tiếp nhận y tế diễn ra kịp thời và chu đáo nhất, quý chủ nuôi có thể tra cứu thông tin
              liên lạc, khung giờ khám và chỉ đường chi tiết dưới đây.
            </p>
          </div>
        </div>
      </section>

      {/* Urgent Emergency Callout */}
      <section aria-label="Lưu ý khẩn cấp cho ca cấp cứu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8">
        <div className="rounded-[10px] p-5 sm:p-6 bg-amber-500/10 border-2 border-amber-600/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-[6px] bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-amber-800">
                Ưu tiên tiếp nhận cấp cứu 24/24
              </p>
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-plum-deep)] mt-0.5">
                Thú cưng gặp tình huống nguy hiểm đến tính mạng?
              </h2>
              <p className="text-sm text-[var(--color-fg-muted)] mt-1 max-w-2xl">
                Xin không gửi tin nhắn hay chờ biểu mẫu trực tuyến. Vui lòng gọi trực tiếp hotline cấp cứu{' '}
                {HOSPITAL_CONTACT.hotlineDisplay} để thông báo ca khẩn cấp và đưa thú cưng đến viện kịp thời.
              </p>
            </div>
          </div>
          <a
            href={HOSPITAL_CONTACT.hotlineTel}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-[6px] bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-bold text-sm tracking-wide shadow-sm hover:shadow-md transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <Phone className="w-4 h-4 animate-pulse" aria-hidden="true" />
            <span>Gọi Cấp Cứu: {HOSPITAL_CONTACT.hotlineDisplay}</span>
          </a>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section aria-labelledby="contact-details-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <h2 id="contact-details-heading" className="sr-only">
          Chi tiết các kênh liên hệ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Địa chỉ */}
          <div className="bg-[var(--color-bg-card)] rounded-[10px] p-6 sm:p-7 border border-[var(--color-border-subtle)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-[6px] bg-[var(--color-plum-50)] text-[var(--color-plum-primary)] flex items-center justify-center mb-5 border border-[var(--color-plum-100)]">
                <MapPin className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[var(--color-plum-deep)]">
                Cơ Sở Tiếp Nhận &amp; Điều Trị
              </h3>
              <p className="text-sm text-[var(--color-fg-primary)] font-medium mt-2 leading-relaxed">
                {HOSPITAL_CONTACT.address}
              </p>
              <p className="text-xs text-[var(--color-fg-muted)] mt-2 leading-normal">
                Địa chỉ cơ sở chính thức tại {HOSPITAL_CONTACT.address}. Quý khách vui lòng tra cứu bản đồ chỉ đường để đến đúng địa chỉ.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-[var(--color-border-subtle)]">
              <a
                href={HOSPITAL_CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-[6px] bg-[var(--color-bg-subtle)] hover:bg-[var(--color-plum-50)] text-[var(--color-plum-deep)] border border-[var(--color-border-subtle)] text-xs font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
              >
                <span>Mở Google Maps chỉ đường</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Card 2: Đường dây nóng */}
          <div className="bg-[var(--color-bg-card)] rounded-[10px] p-6 sm:p-7 border border-[var(--color-border-subtle)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-[6px] bg-rose-50 text-[var(--color-warm-orange)] flex items-center justify-center mb-5 border border-rose-100">
                <Phone className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[var(--color-plum-deep)]">
                Đường Dây Nóng 24/24
              </h3>
              <p className="text-2xl font-mono font-bold text-[var(--color-plum-deep)] mt-2 tracking-tight">
                {HOSPITAL_CONTACT.hotlineDisplay}
              </p>
              <p className="text-xs text-[var(--color-fg-muted)] mt-2 leading-normal">
                Kênh liên lạc chính thức hỗ trợ tiếp nhận cấp cứu khẩn cấp, giải đáp tình trạng thú cưng nội trú, và tư vấn
                lịch hẹn khám tham chiếu.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-[var(--color-border-subtle)]">
              <a
                href={HOSPITAL_CONTACT.hotlineTel}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-[6px] bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-hover)] text-white text-xs font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-plum-primary)]"
              >
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Gọi số: {HOSPITAL_CONTACT.hotlineDisplay}</span>
              </a>
            </div>
          </div>

          {/* Card 3: Khung giờ hoạt động */}
          <div className="bg-[var(--color-bg-card)] rounded-[10px] p-6 sm:p-7 border border-[var(--color-border-subtle)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-[6px] bg-[var(--color-plum-50)] text-[var(--color-plum-primary)] flex items-center justify-center mb-5 border border-[var(--color-plum-100)]">
                <Clock className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[var(--color-plum-deep)]">
                Khung Giờ Phục Vụ
              </h3>
              <div className="mt-3 space-y-2 text-xs text-[var(--color-fg-muted)]">
                <div className="p-2.5 rounded-[6px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)]">
                  <span className="font-semibold text-[var(--color-plum-deep)] block text-xs">
                    Giờ khám tham chiếu:
                  </span>
                  <span className="text-[var(--color-fg-primary)] font-medium">
                    {HOSPITAL_CONTACT.workingHours}
                  </span>
                </div>
                <div className="p-2.5 rounded-[6px] bg-amber-500/10 border border-amber-600/20">
                  <span className="font-semibold text-amber-800 block text-xs">
                    Tiếp nhận cấp cứu:
                  </span>
                  <span className="text-amber-900 font-semibold">
                    {HOSPITAL_CONTACT.emergencyHours}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-2 text-xs text-[var(--color-fg-muted)]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                <span>Đường dây nóng cấp cứu sẵn sàng hỗ trợ 24/24</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Arrival & Transportation Guidance */}
      <section aria-labelledby="arrival-guidance-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="bg-[var(--color-bg-card)] rounded-[10px] p-6 sm:p-8 lg:p-10 border border-[var(--color-border-subtle)] shadow-xs">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[var(--color-plum-50)] text-[var(--color-plum-deep)] text-xs font-semibold tracking-wider uppercase mb-2">
              <Compass className="w-3.5 h-3.5 text-[var(--color-plum-primary)]" aria-hidden="true" />
              <span>Hướng Dẫn Di Chuyển</span>
            </div>
            <h2 id="arrival-guidance-heading" className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-plum-deep)]">
              Chỉ dẫn ghé thăm cơ sở 101 Khuất Duy Tiến
            </h2>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)] leading-relaxed">
              Cơ sở tiếp nhận tại địa chỉ {HOSPITAL_CONTACT.address}. Quý khách vui lòng tra cứu bản đồ chỉ đường hoặc liên hệ hotline{' '}
              {HOSPITAL_CONTACT.hotlineDisplay} khi cần hỗ trợ thông tin trước khi đến.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-[8px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)]">
              <div className="w-9 h-9 rounded-[6px] bg-[var(--color-bg-card)] text-[var(--color-plum-primary)] flex items-center justify-center mb-3 border border-[var(--color-border-subtle)]">
                <Car className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-sm text-[var(--color-plum-deep)]">
                Địa chỉ cơ sở tiếp nhận
              </h3>
              <p className="text-xs text-[var(--color-fg-muted)] mt-2 leading-relaxed">
                Cơ sở đặt tại {HOSPITAL_CONTACT.address}. Quý khách có thể sử dụng ứng dụng bản đồ chỉ đường trực tiếp tới số 101 Khuất Duy Tiến.
              </p>
            </div>

            <div className="p-5 rounded-[8px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)]">
              <div className="w-9 h-9 rounded-[6px] bg-[var(--color-bg-card)] text-[var(--color-plum-primary)] flex items-center justify-center mb-3 border border-[var(--color-border-subtle)]">
                <ShieldAlert className="w-5 h-5 text-amber-600" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-sm text-[var(--color-plum-deep)]">
                Thông báo trước ca khẩn cấp
              </h3>
              <p className="text-xs text-[var(--color-fg-muted)] mt-2 leading-relaxed">
                Đối với các trường hợp cấp cứu, quý khách vui lòng gọi trực tiếp hotline {HOSPITAL_CONTACT.hotlineDisplay} trên đường di chuyển tới 101 Khuất Duy Tiến.
              </p>
            </div>

            <div className="p-5 rounded-[8px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)]">
              <div className="w-9 h-9 rounded-[6px] bg-[var(--color-bg-card)] text-[var(--color-plum-primary)] flex items-center justify-center mb-3 border border-[var(--color-border-subtle)]">
                <HeartHandshake className="w-5 h-5 text-[var(--color-plum-primary)]" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-sm text-[var(--color-plum-deep)]">
                An toàn khi vận chuyển thú cưng
              </h3>
              <p className="text-xs text-[var(--color-fg-muted)] mt-2 leading-relaxed">
                Khuyến khích dùng lồng vận chuyển cho mèo và dây dắt/rọ mõm phù hợp cho chó để giữ an toàn cho thú cưng
                và tránh trường hợp bé hoảng sợ khi di chuyển ngoài đường.
              </p>
            </div>
          </div>

          {/* Interactive Map Link / Clean Map Representation */}
          <div className="mt-8 p-6 rounded-[8px] bg-gradient-to-r from-[var(--color-plum-50)] to-[var(--color-bg-subtle)] border border-[var(--color-plum-100)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-[var(--color-plum-primary)] shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[var(--color-plum-deep)]">
                  Bản đồ trực tuyến Google Maps
                </p>
                <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">
                  Tọa độ xác thực cơ sở: 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội
                </p>
              </div>
            </div>
            <a
              href={HOSPITAL_CONTACT.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-[6px] bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-hover)] text-white text-xs font-semibold tracking-wide transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
            >
              <span>Xem vị trí và chỉ đường trên Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Booking Consultation Guidance & Notice */}
      <section aria-labelledby="booking-guidance-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking guidance */}
          <div className="bg-[var(--color-bg-card)] rounded-[10px] p-6 sm:p-8 border border-[var(--color-border-subtle)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-[6px] bg-[var(--color-plum-50)] text-[var(--color-plum-primary)] flex items-center justify-center mb-4 border border-[var(--color-plum-100)]">
                <Calendar className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 id="booking-guidance-heading" className="text-lg sm:text-xl font-serif font-bold text-[var(--color-plum-deep)]">
                Trải nghiệm đặt lịch trực tuyến
              </h2>
              <p className="text-sm text-[var(--color-fg-muted)] mt-2 leading-relaxed">
                Website cung cấp giao diện đặt lịch khám tham chiếu trực tuyến để chủ nuôi dễ dàng hình dung và lựa chọn
                dịch vụ mong muốn.
              </p>
              <div className="mt-4 p-3.5 rounded-[6px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-fg-muted)] space-y-1">
                <p className="font-semibold text-[var(--color-plum-deep)]">Lưu ý quan trọng về đặt lịch:</p>
                <p>
                  • Giao diện đặt lịch là luồng trải nghiệm thử nghiệm.
                </p>
                <p>
                  • Để chốt lịch khám xác nhận chính thức với bác sĩ trong ngày, xin vui lòng liên hệ qua hotline{' '}
                  <strong className="text-[var(--color-plum-deep)]">{HOSPITAL_CONTACT.hotlineDisplay}</strong>.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-[var(--color-border-subtle)]">
              <Link
                to="/dat-lich"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-[6px] bg-[var(--color-bg-subtle)] hover:bg-[var(--color-plum-50)] text-[var(--color-plum-deep)] border border-[var(--color-border-subtle)] text-xs font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
              >
                <span>Xem giao diện đặt lịch khám</span>
              </Link>
            </div>
          </div>

          {/* Form policy transparent notice */}
          <div className="bg-[var(--color-bg-card)] rounded-[10px] p-6 sm:p-8 border border-[var(--color-border-subtle)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-[6px] bg-slate-100 text-slate-700 flex items-center justify-center mb-4 border border-slate-200">
                <Info className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[var(--color-plum-deep)]">
                Kênh liên hệ trực tiếp qua điện thoại
              </h2>
              <p className="text-sm text-[var(--color-fg-muted)] mt-2 leading-relaxed">
                Hiện tại website chưa mở cổng tiếp nhận thông tin hoặc đặt lịch trực tuyến tự động. Để đảm bảo tình trạng
                sức khỏe của thú cưng được nhân viên y tế nắm bắt và tư vấn kịp thời, quý khách vui lòng liên hệ trực tiếp qua số hotline.
              </p>
              <div className="mt-4 p-3.5 rounded-[6px] bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                <p className="font-semibold text-slate-900">Tại sao chúng tôi ưu tiên hotline trực tiếp?</p>
                <p>
                  Triệu chứng bệnh ở thú cưng có thể diễn tiến nhanh chóng. Việc liên hệ trực tiếp qua số điện thoại giúp
                  tiếp nhận thông tin kịp thời, tránh độ trễ so với việc gửi biểu mẫu trực tuyến.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-2 text-xs text-[var(--color-fg-muted)]">
                <span>Cần hỗ trợ ngay? Gọi trực tiếp: </span>
                <a
                  href={HOSPITAL_CONTACT.hotlineTel}
                  className="font-bold text-[var(--color-plum-primary)] hover:underline inline-flex items-center min-h-[44px]"
                >
                  {HOSPITAL_CONTACT.hotlineDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Policy Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <EditorialPolicyBanner
          label="Thông tin liên hệ xác thực và hướng dẫn tiếp nhận"
          title="Minh bạch thông tin liên hệ:"
          className="rounded-[6px]"
        >
          Thông tin địa chỉ 101 Khuất Duy Tiến, hotline 097 355 51 05, giờ khám 08:00 – 21:00 và tiếp nhận cấp cứu 24/24 là các
          thông tin chính thức từ bệnh viện. Mọi quy trình thăm khám và điều trị sẽ do bác sĩ phụ trách thực hiện trực tiếp
          khi tiếp nhận thú cưng tại cơ sở.
        </EditorialPolicyBanner>
      </div>
    </div>
  )
}
export default ContactPage
