import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Phone,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Camera,
  Scissors,
  Tag,
} from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import { HOSPITAL_CONTACT } from '@/config/contact'
import {
  MOCK_SPA_EDITORIAL_NOTICE,
  MOCK_SPA_SERVICE_GROUPS,
  MOCK_SPA_WORKFLOW_STEPS,
  MOCK_SPA_GALLERY,
  MOCK_SPA_PRICING_TABLE,
  MOCK_SPA_FAQS,
} from '@/data/mockPublicContent'
import { EditorialBreadcrumb } from '@/components/editorial/EditorialBreadcrumb'
import { EditorialPolicyBanner } from '@/components/editorial/EditorialPolicyBanner'
import { EditorialPhotoFrame } from '@/components/editorial/EditorialPhotoFrame'

export const ServiceSpaPage: React.FC = () => {
  useRouteSeo({
    title: 'Spa & Grooming thẩm mỹ — Bệnh viện Thú y Lê Sơn',
    description:
      'Dịch vụ vệ sinh, tắm sấy và cắt tỉa thẩm mỹ cho thú cưng tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến). Xem quy trình mẫu và đặt lịch hẹn trực tuyến.',
    isIndexable: false,
  })

  const [openFaqId, setOpenFaqId] = useState<string | null>(MOCK_SPA_FAQS[0]?.id ?? null)

  return (
    <div className="w-full bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)]">
      {/* 1. Image-Rich Editorial Lookbook Hero */}
      <section className="py-10 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <EditorialBreadcrumb
              currentPage="Spa & Grooming"
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Editorial Lookbook Lead (6 cols) */}
            <div className="lg:col-span-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-purple-100/90 text-[var(--color-plum-primary)] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Grooming Studio &amp; Vệ Sinh Định Kỳ</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-plum-deep)] text-xs font-medium">
                  <Scissors className="w-3.5 h-3.5 text-[var(--color-plum-primary)]" />
                  <span>Chăm sóc dịu nhẹ</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-[1.15] mb-5">
                Spa &amp; Grooming thẩm mỹ cho thú cưng tại Lê Sơn
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-[var(--color-fg-muted)] leading-relaxed mb-6 font-sans">
                Bên cạnh công tác thăm khám lâm sàng, cơ sở <strong>{HOSPITAL_CONTACT.address}</strong> phục vụ nhu cầu tắm vệ sinh, sấy chải mềm mượt, vệ sinh tai móng và cắt tỉa gọn gàng giúp thú cưng luôn sạch thơm, thoải mái trong sinh hoạt hằng ngày.
              </p>

              {/* Quick Studio Info Strip */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-[var(--color-fg-muted)] mb-7 pb-6 border-b border-[var(--color-border-subtle)]">
                <span className="inline-flex items-center gap-1.5 font-medium text-[var(--color-plum-deep)]">
                  <MapPin className="w-4 h-4 text-[var(--color-plum-primary)]" />
                  <span>{HOSPITAL_CONTACT.shortAddress}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-[var(--color-plum-deep)]">
                  <Clock className="w-4 h-4 text-[var(--color-plum-primary)]" />
                  <span>Khung giờ: {HOSPITAL_CONTACT.workingHours}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/dat-lich"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Đặt lịch Spa trực tuyến</span>
                </Link>
                <a
                  href={HOSPITAL_CONTACT.hotlineTel}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-orange)]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Liên hệ đặt giờ: {HOSPITAL_CONTACT.hotlineDisplay}</span>
                </a>
              </div>
            </div>

            {/* Right Asymmetric Dual-Image Collage (6 cols) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-7">
                <EditorialPhotoFrame
                  src="/images/service-spa.webp"
                  alt="Chăm sóc Spa và chải lông cho thú cưng (Ảnh minh họa)"
                  aspectRatio="4/5"
                  label="Ảnh minh họa • Spa & Grooming"
                  className="rounded-[10px]"
                />
              </div>
              <div className="sm:col-span-5 space-y-4">
                <EditorialPhotoFrame
                  src="/images/hero-happy-cat.webp"
                  alt="Mèo cưng sạch sẽ và thư giãn sau khi chải lông (Ảnh minh họa)"
                  aspectRatio="square"
                  label="Ảnh minh họa • Chăm sóc mèo"
                  className="rounded-[10px]"
                />
                <div className="p-4 rounded-[8px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-plum-primary)] block mb-1">
                    Đặt hẹn trước khi đến
                  </span>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    Khuyến khích đặt lịch trước qua hotline {HOSPITAL_CONTACT.hotlineDisplay} để bé được phục vụ đúng khung giờ mong muốn.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <EditorialPolicyBanner
            label="Thông báo dữ liệu mẫu trang Spa & Grooming"
            title="Lưu ý về gói dịch vụ & bảng giá mẫu:"
            className="rounded-[8px] mb-0"
          >
            {MOCK_SPA_EDITORIAL_NOTICE}
          </EditorialPolicyBanner>
        </div>
      </section>

      {/* 2. Core Grooming & Hygiene Service Groups */}
      <section
        className="py-12 sm:py-16 md:py-20 bg-[var(--color-bg-secondary)]/50 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="spa-groups-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="inline-block px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
              Nội dung minh họa — đang cập nhật dữ liệu thực tế
            </span>
            <h2
              id="spa-groups-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-3"
            >
              Ba nhóm chăm sóc vệ sinh &amp; làm đẹp minh họa
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed">
              Các hạng mục dưới đây minh họa cấu trúc gói chăm sóc ngoại hình và vệ sinh định kỳ cho chó mèo tại cơ sở.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {MOCK_SPA_SERVICE_GROUPS.map((group) => (
              <article
                key={group.id}
                className="p-6 sm:p-7 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[var(--color-border-subtle)]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)]">
                      {group.code}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[var(--color-plum-deep)] mb-2 tracking-tight">
                    {group.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[var(--color-plum-primary)] mb-3">
                    {group.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-5">
                    {group.description}
                  </p>
                </div>

                <ul className="space-y-2 pt-4 border-t border-dashed border-[var(--color-border-subtle)] text-xs text-[var(--color-fg-muted)]">
                  {group.highlights.map((hl, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Mock 4-Step Spa Ritual / Workflow */}
      <section
        className="py-12 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="spa-workflow-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="inline-block px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
              Quy trình minh họa — đang cập nhật dữ liệu thực tế
            </span>
            <h2
              id="spa-workflow-heading"
              className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-3"
            >
              Quy trình chăm sóc nhẹ nhàng từ lúc đón bé đến khi bàn giao
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
              Quy trình 4 bước dưới đây là dữ liệu minh họa trình tự tiếp nhận và chăm sóc vệ sinh cho thú cưng tại phòng Spa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MOCK_SPA_WORKFLOW_STEPS.map((step) => (
              <article
                key={step.id}
                className="p-5 sm:p-6 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className="font-serif font-bold text-2xl sm:text-3xl text-[var(--color-plum-primary)] leading-none select-none"
                      aria-hidden="true"
                    >
                      {step.stepNumber}
                    </span>
                    {step.isMock && (
                      <span className="px-2 py-0.5 rounded-[4px] bg-[var(--color-bg-secondary)] text-[10px] font-semibold text-[var(--color-plum-primary)]">
                        {step.detailNote}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[var(--color-plum-deep)] mb-2 leading-snug">
                    <span className="sr-only">Bước {step.stepNumber}: </span>{step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                    {step.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Illustrative Lookbook Gallery */}
      <section
        className="py-12 sm:py-16 md:py-20 bg-[var(--color-bg-secondary)]/40 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="spa-gallery-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Bộ sưu tập hình ảnh minh họa</span>
              </span>
              <h2
                id="spa-gallery-heading"
                className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight"
              >
                Cảm hứng chăm sóc diện mạo sạch thơm cho bé
              </h2>
            </div>
            <p className="text-xs text-[var(--color-fg-muted)] max-w-sm">
              Toàn bộ hình ảnh trong bộ sưu tập dưới đây là ảnh minh họa bố cục giao diện, không mạo danh ảnh chụp khách hàng thực tế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_SPA_GALLERY.map((item) => (
              <figure
                key={item.id}
                className="rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-[var(--color-bg-secondary)] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  {item.isMock && (
                    <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-[4px] text-[11px] font-medium bg-[var(--color-plum-deep)]/85 text-white backdrop-blur-xs">
                      {item.badgeLabel}
                    </span>
                  )}
                </div>
                <figcaption className="p-4 sm:p-5">
                  <h3 className="text-base font-serif font-bold text-[var(--color-plum-deep)] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    {item.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Sample Reference Pricing Table (Explicitly Labeled Mock Layout) */}
      <section
        className="py-12 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="spa-pricing-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-amber-100 text-[var(--color-warm-orange-dark)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Bảng giá minh họa — chưa phải giá niêm yết</span>
            </span>
            <h2
              id="spa-pricing-heading"
              className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-2.5"
            >
              Khung bảng giá minh họa cấu trúc gói dịch vụ
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
              Bảng dưới đây là nội dung minh họa cấu trúc hiển thị theo phân nhóm cân nặng; <strong>không phải biểu phí niêm yết chính thức</strong>. Vui lòng liên hệ hotline {HOSPITAL_CONTACT.hotlineDisplay} để được báo giá thực tế theo thể trạng và bộ lông của bé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_SPA_PRICING_TABLE.map((row) => (
              <div
                key={row.id}
                className="p-5 sm:p-6 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-[var(--color-plum-primary)]">
                      {row.weightRange}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-serif font-bold text-[var(--color-plum-deep)] mb-2">
                    {row.packageTitle}
                  </h3>

                  <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-3">
                    {row.includesSummary}
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[var(--color-fg-subtle)]">{row.durationEstimate}</span>
                  <span className="font-bold text-[var(--color-plum-deep)]">
                    {row.referencePrice}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Mock FAQ Section */}
      <section
        className="py-12 sm:py-16 md:py-20 bg-[var(--color-bg-secondary)]/40 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="spa-faq-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Câu hỏi &amp; câu trả lời minh họa</span>
            </span>
            <h2
              id="spa-faq-heading"
              className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-2"
            >
              Lưu ý khi đặt lịch Spa &amp; Grooming cho thú cưng
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)]">
              Nội dung minh họa — đang cập nhật dữ liệu thực tế.
            </p>
          </div>

          <div className="space-y-3">
            {MOCK_SPA_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id
              const buttonId = `faq-btn-${faq.id}`
              const panelId = `faq-panel-${faq.id}`
              return (
                <div
                  key={faq.id}
                  className="rounded-[8px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] overflow-hidden"
                >
                  <button
                    type="button"
                    id={buttonId}
                    aria-controls={panelId}
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[var(--color-bg-secondary)]/50 transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-plum-primary)]"
                  >
                    <div className="flex flex-wrap items-center gap-2">
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
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className={`px-5 pb-4 pt-1 text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed border-t border-[var(--color-border-subtle)]/60 ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    {faq.answer}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 7. Bottom Booking CTA */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[12px] p-6 sm:p-10 bg-[var(--color-bg-dark)] text-white shadow-md flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-plum-orchid-light)] block mb-1">
                Đặt Lịch Spa &amp; Grooming
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 tracking-tight">
                Đặt hẹn chăm sóc vệ sinh &amp; làm đẹp cho bé
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-plum-orchid-light)] leading-relaxed">
                {HOSPITAL_CONTACT.address} • Giờ phục vụ {HOSPITAL_CONTACT.workingHours} • Hotline {HOSPITAL_CONTACT.hotlineDisplay}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/dat-lich"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-white text-[var(--color-plum-deep)] hover:bg-[var(--color-lavender)] font-semibold text-xs sm:text-sm transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Calendar className="w-4 h-4 text-[var(--color-plum-primary)]" />
                <span>Đặt lịch Spa trực tuyến</span>
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

export default ServiceSpaPage
