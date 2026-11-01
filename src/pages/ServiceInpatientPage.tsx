import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Home as HomeIcon,
  Phone,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Lock,
  ChevronDown,
  HelpCircle,
  HeartHandshake,
} from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import { HOSPITAL_CONTACT } from '@/config/contact'
import {
  MOCK_INPATIENT_EDITORIAL_NOTICE,
  MOCK_INPATIENT_CARE_SPACES,
  MOCK_INPATIENT_TIMELINE,
  MOCK_INPATIENT_FUTURE_PORTAL_PREVIEW,
  MOCK_INPATIENT_FAQS,
} from '@/data/mockPublicContent'
import { EditorialBreadcrumb } from '@/components/editorial/EditorialBreadcrumb'
import { EditorialPolicyBanner } from '@/components/editorial/EditorialPolicyBanner'

export const ServiceInpatientPage: React.FC = () => {
  useRouteSeo({
    title: 'Chăm sóc nội trú — Bệnh viện Thú y Lê Sơn',
    description:
      'Dịch vụ lưu trú và chăm sóc theo dõi sức khỏe cho thú cưng tại cơ sở 101 Khuất Duy Tiến. Vui lòng liên hệ hotline để được tư vấn chi tiết.',
    isIndexable: false,
  })

  const [openFaqId, setOpenFaqId] = useState<string | null>(MOCK_INPATIENT_FAQS[0]?.id ?? null)

  return (
    <div className="w-full bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)]">
      {/* 1. Sanctuary Hero — Warmth & Owner Peace of Mind */}
      <section className="py-10 sm:py-16 md:py-20 bg-gradient-to-b from-[#F8F2F9]/80 to-[var(--color-bg-primary)] border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <EditorialBreadcrumb
              currentPage="Chăm sóc nội trú"
              parentGroup="Danh mục dịch vụ"
              parentLink="/dich-vu"
            />
            <Link
              to="/dich-vu"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[6px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-secondary)] text-xs sm:text-sm font-medium text-[var(--color-plum-primary)] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Quay lại Danh mục dịch vụ</span>
            </Link>
          </div>

          {/* Centered Editorial Magazine Header + Wide Sanctuary Frame */}
          <div className="max-w-3xl mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-white border border-[var(--color-border-subtle)] text-[var(--color-plum-primary)] text-xs font-bold uppercase tracking-wider">
                <HomeIcon className="w-3.5 h-3.5" />
                <span>Lưu Trú &amp; Chăm Sóc Theo Dõi</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-purple-100/80 text-[var(--color-plum-deep)] text-xs font-medium">
                <HeartHandshake className="w-3.5 h-3.5 text-[var(--color-plum-primary)]" />
                <span>Đồng hành cùng gia đình chủ nuôi</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-[1.15] mb-4">
              Chăm sóc nội trú &amp; lưu trú thú cưng tại 101 Khuất Duy Tiến
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[var(--color-fg-muted)] leading-relaxed mb-6 font-sans">
              Khi thú cưng cần lưu lại theo dõi sau thăm khám hoặc khi gia đình bận công tác xa, {HOSPITAL_CONTACT.name} tại <strong>{HOSPITAL_CONTACT.address}</strong> tiếp nhận đăng ký lưu trú cùng sự quan tâm chu đáo tới nếp ăn uống, vệ sinh và trạng thái tinh thần của từng bé.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/dat-lich"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
              >
                <Calendar className="w-4 h-4" />
                <span>Đăng ký lịch lưu trú</span>
              </Link>
              <a
                href={HOSPITAL_CONTACT.hotlineTel}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-orange)]"
              >
                <Phone className="w-4 h-4" />
                <span>Tư vấn nội trú: {HOSPITAL_CONTACT.hotlineDisplay}</span>
              </a>
              <Link
                to="/dich-vu/kham-dieu-tri"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-[6px] border border-[var(--color-border-medium)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-fg-primary)] font-medium text-xs sm:text-sm transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
              >
                <span>Khám lâm sàng trước lưu trú</span>
                <ArrowRight className="w-4 h-4 text-[var(--color-plum-primary)]" />
              </Link>
            </div>
          </div>

          {/* Sanctuary Summary Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 sm:p-5 rounded-[8px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)] mb-1.5">
                <MapPin className="w-4 h-4" />
                <span>Cơ sở tiếp nhận</span>
              </div>
              <p className="text-sm font-semibold text-[var(--color-plum-deep)]">
                {HOSPITAL_CONTACT.address}
              </p>
              <p className="text-xs text-[var(--color-fg-muted)] mt-1">
                Trao đổi trực tiếp tại quầy tiếp đón trước khi bàn giao bé.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-[8px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)] mb-1.5">
                <Clock className="w-4 h-4" />
                <span>Khung giờ đón &amp; trả bé</span>
              </div>
              <p className="text-sm font-semibold text-[var(--color-plum-deep)]">
                {HOSPITAL_CONTACT.workingHours}
              </p>
              <p className="text-xs text-[var(--color-fg-muted)] mt-1">
                Khung giờ làm việc tiêu chuẩn tất cả các ngày trong tuần.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-[8px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-warm-orange-dark)] mb-1.5">
                <Phone className="w-4 h-4" />
                <span>Liên hệ hỏi thăm &amp; Cấp cứu</span>
              </div>
              <p className="text-sm font-semibold text-[var(--color-plum-deep)]">
                Hotline: {HOSPITAL_CONTACT.hotlineDisplay}
              </p>
              <p className="text-xs text-[var(--color-fg-muted)] mt-1">
                Hỗ trợ trao đổi thông tin lưu trú và {HOSPITAL_CONTACT.emergencyHours.toLowerCase()}.
              </p>
            </div>
          </div>

          <EditorialPolicyBanner
            label="Thông báo dữ liệu mẫu trang Chăm sóc nội trú"
            title="Lưu ý về nội dung minh họa trên trang:"
            className="rounded-[8px] mb-0"
          >
            {MOCK_INPATIENT_EDITORIAL_NOTICE}
          </EditorialPolicyBanner>
        </div>
      </section>

      {/* 2. Illustrative Space & Care Stories (Alternating Editorial Blocks) */}
      <section
        className="py-12 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="inpatient-spaces-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="inline-block px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
              Không gian &amp; Chăm sóc • Dữ liệu mẫu
            </span>
            <h2
              id="inpatient-spaces-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-3"
            >
              Mô tả không gian lưu trú và sự quan tâm hằng ngày
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed">
              Hai khối nội dung dưới đây minh họa cách tổ chức khu vực lưu trú và theo dõi sinh hoạt cho thú cưng trong thời gian lưu lại cơ sở.
            </p>
          </div>

          <div className="space-y-10 sm:space-y-12">
            {MOCK_INPATIENT_CARE_SPACES.map((space, idx) => {
              const isReversed = idx % 2 === 1
              return (
                <article
                  key={space.id}
                  className="p-6 sm:p-8 lg:p-10 rounded-[12px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : ''}`}>
                      {space.isMock && (
                        <span className="inline-block px-2.5 py-1 rounded-[4px] bg-purple-50 border border-purple-200 text-[11px] font-bold uppercase tracking-wider text-[var(--color-plum-primary)] mb-3">
                          {space.badgeLabel}
                        </span>
                      )}
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-plum-deep)] mb-1.5 tracking-tight">
                        {space.zoneTitle}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-[var(--color-plum-primary)] mb-4">
                        {space.subtitle}
                      </p>
                      <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-5">
                        {space.description}
                      </p>

                      <ul className="space-y-2.5 pt-4 border-t border-[var(--color-border-subtle)]">
                        {space.points.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--color-fg-muted)]">
                            <CheckCircle2 className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={`lg:col-span-5 ${isReversed ? 'lg:order-1' : ''}`}>
                      <div className="relative aspect-[4/3] rounded-[8px] overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]">
                        <img
                          src={space.image}
                          alt={space.imageAlt}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                        {space.isMock && (
                          <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-[4px] text-[11px] font-medium bg-[var(--color-plum-deep)]/85 text-white backdrop-blur-xs">
                            Ảnh minh họa • {space.badgeLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. Sample Day-in-Stay Experience Timeline */}
      <section
        className="py-12 sm:py-16 md:py-20 bg-[var(--color-bg-secondary)]/55 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="inpatient-timeline-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="inline-block px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
              Timeline trải nghiệm • Dữ liệu mẫu
            </span>
            <h2
              id="inpatient-timeline-heading"
              className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-3"
            >
              Một ngày lưu trú tham khảo của thú cưng diễn ra như thế nào?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
              Lịch trình mẫu dưới đây minh họa nhịp sinh hoạt trong khung giờ hoạt động tiêu chuẩn (08:00 – 21:00). Thời gian thực tế được điều chỉnh linh hoạt theo thói quen của từng bé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {MOCK_INPATIENT_TIMELINE.map((slot, index) => (
              <article
                key={slot.id}
                className="p-5 sm:p-6 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[10px] font-bold uppercase tracking-wider">
                      0{index + 1} • {slot.phaseCode}
                    </span>
                    {slot.isMock && (
                      <span className="text-[10px] font-medium text-[var(--color-fg-subtle)]">
                        [Mẫu]
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-[var(--color-warm-orange-dark)] mb-2">
                    {slot.timeSlot}
                  </p>

                  <h3 className="text-base sm:text-lg font-serif font-bold text-[var(--color-plum-deep)] mb-2.5 leading-snug">
                    {slot.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-4">
                    {slot.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-[var(--color-border-subtle)] text-[11px] text-[var(--color-plum-primary)] font-medium">
                  {slot.ownerNote}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Future Customer Portal Transparency Preview (Non-Medical / Non-Internal Boundary) */}
      <section
        className="py-12 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="portal-preview-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[12px] p-6 sm:p-8 lg:p-10 bg-[var(--color-bg-card)] border-2 border-[var(--color-border-medium)] shadow-xs">
            <div className="max-w-3xl mb-8">
              {MOCK_INPATIENT_FUTURE_PORTAL_PREVIEW.isMock && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-xs font-bold uppercase tracking-wider mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{MOCK_INPATIENT_FUTURE_PORTAL_PREVIEW.badgeLabel}</span>
                </span>
              )}
              <h2
                id="portal-preview-heading"
                className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-2.5"
              >
                {MOCK_INPATIENT_FUTURE_PORTAL_PREVIEW.title}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-2">
                {MOCK_INPATIENT_FUTURE_PORTAL_PREVIEW.subtitle}
              </p>
              <p className="text-xs text-[var(--color-plum-primary)] italic">
                * {MOCK_INPATIENT_FUTURE_PORTAL_PREVIEW.editorialNotice}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Shared Owner-Facing Updates (7 cols) */}
              <div className="lg:col-span-7 space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)] mb-2">
                  Thông tin sinh hoạt dự kiến chia sẻ cho chủ nuôi (Dữ liệu mẫu):
                </h3>
                {MOCK_INPATIENT_FUTURE_PORTAL_PREVIEW.sharedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-[8px] bg-[var(--color-bg-secondary)]/60 border border-[var(--color-border-subtle)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="text-xs sm:text-sm font-bold text-[var(--color-plum-deep)]">
                        {item.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-[4px] bg-white border border-[var(--color-border-subtle)] text-[10px] font-semibold text-[var(--color-plum-primary)]">
                        Bản tin mẫu
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-[var(--color-plum-primary)] mb-1">
                      “{item.sampleValue}”
                    </p>
                    <p className="text-xs text-[var(--color-fg-muted)]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Restricted Medical / Internal Boundary Card (5 cols) */}
              <div className="lg:col-span-5 p-5 sm:p-6 rounded-[10px] bg-[#F8F2F9] border border-[var(--color-border-medium)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[var(--color-plum-deep)] font-serif font-bold text-base sm:text-lg mb-3">
                    <Lock className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0" />
                    <span>{MOCK_INPATIENT_FUTURE_PORTAL_PREVIEW.restrictedNoticeTitle}</span>
                  </div>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed mb-4">
                    Để đảm bảo an toàn y khoa và tránh việc tự ý áp dụng đơn thuốc tại nhà, hệ thống Cổng khách hàng tuân thủ giới hạn dữ liệu nghiêm ngặt:
                  </p>
                  <ul className="space-y-2.5 text-xs text-[var(--color-fg-primary)]">
                    {MOCK_INPATIENT_FUTURE_PORTAL_PREVIEW.restrictedItems.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="font-bold text-[var(--color-plum-primary)]">&bull;</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--color-border-subtle)] text-xs text-[var(--color-fg-muted)]">
                  Hiện tại, để nhận cập nhật về thú cưng đang lưu trú, quý khách vui lòng liên hệ trực tiếp hotline{' '}
                  <a
                    href={HOSPITAL_CONTACT.hotlineTel}
                    className="font-bold text-[var(--color-plum-primary)] underline underline-offset-2"
                  >
                    {HOSPITAL_CONTACT.hotlineDisplay}
                  </a>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Mock FAQ Section */}
      <section
        className="py-12 sm:py-16 md:py-20 bg-[var(--color-bg-secondary)]/40 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="inpatient-faq-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Câu hỏi thường gặp • Dữ liệu mẫu</span>
            </span>
            <h2
              id="inpatient-faq-heading"
              className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-2"
            >
              Những câu hỏi thường gặp về dịch vụ lưu trú nội trú
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)]">
              Nội dung dưới đây là dữ liệu mẫu minh họa giao diện giải đáp thông tin lưu trú.
            </p>
          </div>

          <div className="space-y-3">
            {MOCK_INPATIENT_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id
              return (
                <div
                  key={faq.id}
                  className="rounded-[8px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[var(--color-bg-secondary)]/50 transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-plum-primary)]"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {faq.isMock && (
                        <span className="px-2 py-0.5 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[10px] font-bold uppercase tracking-wider">
                          FAQ mẫu
                        </span>
                      )}
                      <span className="text-sm sm:text-base font-semibold text-[var(--color-plum-deep)]">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--color-plum-primary)] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed border-t border-[var(--color-border-subtle)]/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6. Bottom CTA & Navigation Back to Services */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[12px] p-6 sm:p-10 bg-[var(--color-bg-dark)] text-white shadow-md flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-plum-orchid-light)] block mb-1">
                Đăng Ký Lưu Trú &amp; Tư Vấn
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 tracking-tight">
                Cần tư vấn chỗ lưu trú cho thú cưng?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-plum-orchid-light)] leading-relaxed">
                {HOSPITAL_CONTACT.address} • Giờ hoạt động {HOSPITAL_CONTACT.workingHours} • Hotline {HOSPITAL_CONTACT.hotlineDisplay}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/dat-lich"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-white text-[var(--color-plum-deep)] hover:bg-[var(--color-lavender)] font-semibold text-xs sm:text-sm transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Calendar className="w-4 h-4 text-[var(--color-plum-primary)]" />
                <span>Đặt lịch hẹn trước</span>
              </Link>
              <a
                href={HOSPITAL_CONTACT.hotlineTel}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-xs sm:text-sm transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-orange)]"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi {HOSPITAL_CONTACT.hotlineDisplay}</span>
              </a>
              <Link
                to="/dich-vu"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-[6px] border border-white/30 text-white hover:bg-white/10 font-medium text-xs sm:text-sm transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Quay lại Danh mục dịch vụ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServiceInpatientPage
