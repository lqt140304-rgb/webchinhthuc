import React from 'react'
import { Link } from 'react-router-dom'
import {
  Stethoscope,
  Home as HomeIcon,
  Sparkles,
  ShieldAlert,
  Phone,
  Calendar,
  ArrowRight,
  MapPin,
  CheckCircle2,
} from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import { HOSPITAL_CONTACT, CONFIRMED_CLINICAL_SERVICES } from '@/config/contact'
import { MOCK_SERVICE_SUPPLEMENT_NOTES } from '@/data/mockPublicContent'
import { EditorialBreadcrumb } from '@/components/editorial/EditorialBreadcrumb'
import { EditorialPolicyBanner } from '@/components/editorial/EditorialPolicyBanner'

interface ServiceGroupItem {
  id: string
  title: string
  category: string
  tagline: string
  description: string
  points: string[]
  href: string
  image?: string
  isMockImage?: boolean
  icon: React.ElementType
  isEmergency?: boolean
}

const serviceGroups: ServiceGroupItem[] = [
  {
    id: 'kham-dieu-tri',
    title: 'Khám & Điều Trị',
    category: 'Y Khoa Lâm Sàng',
    tagline: 'Thăm khám lâm sàng, xét nghiệm, siêu âm, chụp X-quang và phẫu thuật',
    description:
      'Tiếp nhận thăm khám lâm sàng, thực hiện xét nghiệm, siêu âm, chụp X-quang và phẫu thuật cho thú cưng tại cơ sở 101 Khuất Duy Tiến.',
    points: [
      'Xét nghiệm cận lâm sàng phục vụ chẩn đoán và theo dõi sức khỏe',
      'Chẩn đoán hình ảnh: chụp X-quang và siêu âm theo chỉ định bác sĩ',
      'Thực hiện phẫu thuật thú y sau khi thăm khám và tư vấn trực tiếp',
      `Thời gian khám: ${HOSPITAL_CONTACT.workingHours} • Hotline: ${HOSPITAL_CONTACT.hotlineDisplay}`,
    ],
    href: '/dich-vu/kham-dieu-tri',
    image: '/images/service-exam.webp',
    isMockImage: true,
    icon: Stethoscope,
  },
  {
    id: 'noi-tru',
    title: 'Chăm Sóc Nội Trú',
    category: 'Lưu Trú & Theo Dõi',
    tagline: 'Dịch vụ lưu trú và chăm sóc thú cưng tại cơ sở',
    description:
      'Tiếp nhận nhu cầu lưu trú cho thú cưng tại cơ sở 101 Khuất Duy Tiến.',
    points: [
      'Tiếp nhận đăng ký dịch vụ lưu trú cho thú cưng tại cơ sở',
      'Trao đổi thông tin trực tiếp qua hotline hoặc tại quầy tiếp đón',
      `Địa điểm cơ sở: ${HOSPITAL_CONTACT.shortAddress}`,
      `Hotline tư vấn: ${HOSPITAL_CONTACT.hotlineDisplay}`,
    ],
    href: '/dich-vu/noi-tru',
    image: '/images/service-inpatient.webp',
    isMockImage: true,
    icon: HomeIcon,
  },
  {
    id: 'spa',
    title: 'Spa & Grooming',
    category: 'Vệ Sinh & Chăm Sóc',
    tagline: 'Dịch vụ vệ sinh, tắm sấy và cắt tỉa cho thú cưng',
    description:
      'Dịch vụ tắm vệ sinh và cắt tỉa thẩm mỹ cơ bản cho thú cưng tại cơ sở 101 Khuất Duy Tiến.',
    points: [
      'Tiếp nhận nhu cầu tắm vệ sinh và sấy khô cơ bản',
      'Cắt tỉa gọn gàng và tạo hình theo nhu cầu của chủ nuôi',
      `Địa điểm thực hiện: ${HOSPITAL_CONTACT.shortAddress}`,
      `Hotline liên hệ đặt lịch: ${HOSPITAL_CONTACT.hotlineDisplay}`,
    ],
    href: '/dich-vu/spa',
    image: '/images/service-spa.webp',
    isMockImage: true,
    icon: Sparkles,
  },
  {
    id: 'cap-cuu',
    title: 'Tiếp Nhận Cấp Cứu 24/24',
    category: 'Cấp Cứu Khẩn Cấp',
    tagline: 'Tiếp nhận cấp cứu 24/24 tại 101 Khuất Duy Tiến',
    description:
      'Tiếp nhận cấp cứu 24/24 tại cơ sở 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội. Vui lòng liên hệ hotline 097 355 51 05 trước khi đưa thú cưng đến viện.',
    points: [
      'Thời gian tiếp nhận: Tiếp nhận cấp cứu 24/24',
      'Đường dây nóng cấp cứu 24/24: 097 355 51 05',
      'Địa chỉ tiếp nhận: 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội',
      'Vui lòng gọi hotline trước khi di chuyển để được chuẩn bị tiếp đón',
    ],
    href: '/dich-vu/cap-cuu',
    icon: ShieldAlert,
    isEmergency: true,
  },
]

export const ServicesPage: React.FC = () => {
  useRouteSeo({
    title: `Danh Mục Dịch Vụ Y Tế — ${HOSPITAL_CONTACT.name}`,
    description:
      'Tổng hợp dịch vụ tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến): Khám & Điều trị (X-quang, Siêu âm, Phẫu thuật, Xét nghiệm), Chăm sóc nội trú, Spa & Grooming, Tiếp nhận cấp cứu 24/24.',
    isIndexable: false,
  })

  return (
    <div className="w-full bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)]">
      {/* 1. Header & Hero Section */}
      <section className="py-10 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditorialBreadcrumb currentPage="Danh mục dịch vụ" parentGroup={null} />

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-plum-primary)] text-xs font-bold uppercase tracking-wider mb-3">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Dịch Vụ Y Tế Lê Sơn</span>
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-tight mb-4">
              Danh mục dịch vụ y tế toàn diện cho thú cưng
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[var(--color-fg-muted)] leading-relaxed mb-6 font-sans">
              Tại {HOSPITAL_CONTACT.address}, Bệnh viện Thú y Lê Sơn cung cấp 4 nhóm dịch vụ chính: Khám &amp; Điều trị (bao gồm X-quang, Siêu âm, Phẫu thuật, Xét nghiệm), Chăm sóc nội trú, Spa &amp; Grooming và Tiếp nhận cấp cứu 24/24.
            </p>

            {/* 4 Confirmed Clinical Services Strip */}
            <div className="mb-6 p-4 rounded-[6px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-plum-primary)] block mb-2.5">
                Năng lực chuyên môn tiếp nhận tại cơ sở:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CONFIRMED_CLINICAL_SERVICES.map((svc) => (
                  <div
                    key={svc.id}
                    className="px-3 py-2 rounded-[6px] bg-purple-50/70 border border-purple-200/80 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-[var(--color-plum-deep)]">
                      {svc.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/dat-lich"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
              >
                <Calendar className="w-4 h-4" />
                <span>Đặt lịch khám trực tuyến</span>
              </Link>
              <a
                href={HOSPITAL_CONTACT.hotlineTel}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-orange)]"
              >
                <Phone className="w-4 h-4" />
                <span>Cấp cứu 24/24: {HOSPITAL_CONTACT.hotlineDisplay}</span>
              </a>
            </div>
          </div>

          {/* Policy Banner */}
          <EditorialPolicyBanner
            label="Chính sách dịch vụ và minh bạch thông tin"
            title="Minh bạch dịch vụ & dữ liệu hiển thị:"
            className="rounded-[6px]"
          >
            Bệnh viện Thú y Lê Sơn phục vụ 4 nhóm dịch vụ chính tại {HOSPITAL_CONTACT.address} (giờ khám {HOSPITAL_CONTACT.workingHours}; {HOSPITAL_CONTACT.emergencyHours.toLowerCase()} qua hotline {HOSPITAL_CONTACT.hotlineDisplay}), bao gồm <strong>X-quang, Siêu âm, Phẫu thuật và Xét nghiệm</strong>. Các mô tả danh mục phụ gắn nhãn <em>[Dữ liệu mẫu]</em> và hình ảnh gắn nhãn <em>Ảnh minh họa</em> phục vụ hoàn thiện bố cục giao diện trong khi chờ cập nhật danh mục chi tiết.
          </EditorialPolicyBanner>
        </div>
      </section>

      {/* 2. 4 Service Groups List */}
      <section className="py-12 sm:py-16 md:py-20" aria-label="Danh sách các nhóm dịch vụ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 sm:space-y-16">
            {serviceGroups.map((group, index) => {
              const Icon = group.icon
              const isEven = index % 2 === 1
              return (
                <article
                  key={group.id}
                  id={group.id}
                  className={`p-6 sm:p-8 lg:p-10 rounded-[10px] border transition-all ${
                    group.isEmergency
                      ? 'bg-gradient-to-br from-amber-50/70 via-orange-50/50 to-amber-50/70 border-orange-200'
                      : 'bg-[var(--color-bg-card)] border-[var(--color-border-subtle)] shadow-xs'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Content Column */}
                    <div
                      className={`lg:col-span-7 flex flex-col justify-between ${
                        isEven && !group.isEmergency ? 'lg:order-2' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider ${
                              group.isEmergency
                                ? 'bg-[var(--color-warm-orange)] text-white'
                                : 'bg-purple-100 text-[var(--color-plum-primary)]'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{group.category}</span>
                          </span>
                          <span className="text-xs text-[var(--color-fg-subtle)] font-medium">
                            Mã: {group.id}
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-2">
                          {group.title}
                        </h2>

                        <p className="text-sm font-medium text-[var(--color-plum-primary)] mb-4">
                          {group.tagline}
                        </p>

                        <p className="text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed mb-6 font-sans">
                          {group.description}
                        </p>

                        <div className="mb-6">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-fg-secondary)] mb-3">
                            Hạng mục phục vụ tại cơ sở:
                          </h3>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[var(--color-fg-muted)]">
                            {group.points.map((pt, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2
                                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                                    group.isEmergency
                                      ? 'text-[var(--color-warm-orange-dark)]'
                                      : 'text-[var(--color-plum-primary)]'
                                  }`}
                                />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {MOCK_SERVICE_SUPPLEMENT_NOTES[group.id]?.isMock && (
                          <div className="mb-6 p-3.5 rounded-[6px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]">
                            <span className="inline-block px-2 py-0.5 rounded-[4px] bg-purple-100/80 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2">
                              {MOCK_SERVICE_SUPPLEMENT_NOTES[group.id].mockLabel}
                            </span>
                            <ul className="space-y-1 text-xs text-[var(--color-fg-muted)]">
                              {MOCK_SERVICE_SUPPLEMENT_NOTES[group.id].items.map((mockPt, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  &bull; {mockPt}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Action Links */}
                      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
                        <Link
                          to={group.href}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] font-semibold text-xs sm:text-sm transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 ${
                            group.isEmergency
                              ? 'bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white focus-visible:ring-[var(--color-warm-orange)] shadow-xs'
                              : 'bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white focus-visible:ring-[var(--color-plum-primary)] shadow-xs'
                          }`}
                        >
                          <span>Xem chi tiết dịch vụ</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>

                        {group.isEmergency ? (
                          <a
                            href={HOSPITAL_CONTACT.hotlineTel}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[6px] border border-orange-300 text-[var(--color-warm-orange-dark)] hover:bg-orange-100/50 font-semibold text-xs sm:text-sm transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-orange)]"
                          >
                            <Phone className="w-4 h-4" />
                            <span>Gọi hotline: {HOSPITAL_CONTACT.hotlineDisplay}</span>
                          </a>
                        ) : (
                          <Link
                            to="/dat-lich"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[6px] border border-[var(--color-border-medium)] text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)] font-medium text-xs sm:text-sm transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                          >
                            <Calendar className="w-4 h-4 text-[var(--color-plum-primary)]" />
                            <span>Đăng ký khám cho bé</span>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Image / Graphic Column */}
                    <div
                      className={`lg:col-span-5 ${
                        isEven && !group.isEmergency ? 'lg:order-1' : ''
                      }`}
                    >
                      {group.image ? (
                        <div className="relative rounded-[6px] overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] aspect-[4/3] shadow-xs">
                          <img
                            src={group.image}
                            alt={`${group.title} (Hình ảnh minh họa)`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                          {group.isMockImage && (
                            <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-black/75 text-white backdrop-blur-xs">
                              Ảnh minh họa
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-[6px] border border-orange-200 bg-white p-6 sm:p-8 flex flex-col justify-center text-center">
                          <div className="w-14 h-14 mx-auto rounded-[6px] bg-[var(--color-warm-orange)] text-white flex items-center justify-center mb-4 shadow-sm">
                            <ShieldAlert className="w-7 h-7" />
                          </div>
                          <h3 className="font-serif font-bold text-lg text-[var(--color-warm-orange-dark)] mb-2">
                            Tiếp Nhận Cấp Cứu 24/24
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                            Tiếp nhận cấp cứu 24/24 tại {HOSPITAL_CONTACT.shortAddress}. Vui lòng gọi hotline trước khi di chuyển đến cơ sở.
                          </p>
                          <a
                            href={HOSPITAL_CONTACT.hotlineTel}
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-[6px] bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-bold text-sm transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-orange)]"
                          >
                            <Phone className="w-4 h-4" />
                            <span>Gọi Cấp cứu: {HOSPITAL_CONTACT.hotlineDisplay}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. Bottom Information & Direct Booking CTA */}
      <section className="py-12 sm:py-16 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[10px] p-6 sm:p-10 bg-[var(--color-bg-dark)] text-white shadow-md flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-plum-orchid-light)] block mb-1">
                Tư Vấn & Tiếp Nhận
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 tracking-tight">
                Bạn cần tư vấn dịch vụ hoặc đặt lịch cho bé?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-plum-orchid-light)] leading-relaxed">
                {HOSPITAL_CONTACT.address} • Giờ khám {HOSPITAL_CONTACT.workingHours} • {HOSPITAL_CONTACT.emergencyHours}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/dat-lich"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-white text-[var(--color-plum-deep)] hover:bg-[var(--color-lavender)] font-semibold text-xs sm:text-sm transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Calendar className="w-4 h-4 text-[var(--color-plum-primary)]" />
                <span>Đặt lịch khám trực tuyến</span>
              </Link>
              <Link
                to="/lien-he"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-[6px] border border-white/30 text-white hover:bg-white/10 font-medium text-xs sm:text-sm transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MapPin className="w-4 h-4 text-[var(--color-plum-orchid-light)]" />
                <span>Thông tin phòng khám</span>
              </Link>
              <a
                href={HOSPITAL_CONTACT.hotlineTel}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-xs sm:text-sm transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-orange)]"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi {HOSPITAL_CONTACT.hotlineDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServicesPage
