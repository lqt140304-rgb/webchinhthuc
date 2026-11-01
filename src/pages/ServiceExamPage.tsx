import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Stethoscope,
  Phone,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ClipboardList,
  HelpCircle,
} from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import { HOSPITAL_CONTACT, CONFIRMED_CLINICAL_SERVICES } from '@/config/contact'
import {
  MOCK_EXAM_EDITORIAL_NOTICE,
  MOCK_EXAM_PROCESS_STEPS,
  MOCK_EXAM_FAQS,
  MOCK_SERVICE_SUPPLEMENT_NOTES,
} from '@/data/mockPublicContent'
import { EditorialBreadcrumb } from '@/components/editorial/EditorialBreadcrumb'
import { EditorialPolicyBanner } from '@/components/editorial/EditorialPolicyBanner'
import { EditorialPhotoFrame } from '@/components/editorial/EditorialPhotoFrame'

export const ServiceExamPage: React.FC = () => {
  useRouteSeo({
    title: 'Khám & điều trị thú cưng — Bệnh viện Thú y Lê Sơn',
    description:
      'Dịch vụ khám lâm sàng, xét nghiệm, siêu âm, chụp X-quang và phẫu thuật tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến); tiếp nhận khám 08:00 – 21:00 và cấp cứu 24/24.',
    isIndexable: false,
  })

  const [openFaqId, setOpenFaqId] = useState<string | null>(MOCK_EXAM_FAQS[0]?.id ?? null)
  const supplementNote = MOCK_SERVICE_SUPPLEMENT_NOTES['kham-dieu-tri']

  return (
    <div className="w-full bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)]">
      {/* 1. Editorial Clinical Hero (Asymmetric Split Layout) */}
      <section className="py-10 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <EditorialBreadcrumb
              currentPage="Khám & Điều trị"
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Editorial Narrative (7 cols) */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-plum-primary)] text-xs font-bold uppercase tracking-wider">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Y Khoa Lâm Sàng &amp; Chẩn Đoán</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-amber-50 border border-amber-200/80 text-[var(--color-warm-orange-dark)] text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Khám: {HOSPITAL_CONTACT.workingHours}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-[1.15] mb-5">
                Khám &amp; điều trị thú cưng tại 101 Khuất Duy Tiến
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-[var(--color-fg-muted)] leading-relaxed mb-6 font-sans">
                Tại cơ sở <strong>{HOSPITAL_CONTACT.address}</strong>, {HOSPITAL_CONTACT.name} tiếp nhận thăm khám lâm sàng và cung cấp bốn nhóm dịch vụ chuyên môn gồm <strong>X-quang, Siêu âm, Xét nghiệm và Phẫu thuật</strong>. Mọi chỉ định kiểm tra cận lâm sàng hoặc can thiệp ngoại khoa đều được bác sĩ trao đổi trực tiếp cùng chủ nuôi sau khi thăm khám thể trạng thực tế của bé.
              </p>

              {/* Verified Operational Fact Ledger */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7 p-4 rounded-[8px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-fg-subtle)] block">
                      Địa chỉ tiếp nhận
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[var(--color-plum-deep)]">
                      {HOSPITAL_CONTACT.shortAddress}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:border-l sm:border-[var(--color-border-subtle)] sm:pl-3">
                  <Clock className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-fg-subtle)] block">
                      Khung giờ khám
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[var(--color-plum-deep)]">
                      {HOSPITAL_CONTACT.workingHours}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:border-l sm:border-[var(--color-border-subtle)] sm:pl-3">
                  <ShieldAlert className="w-4 h-4 text-[var(--color-warm-orange)] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-warm-orange-dark)] block">
                      Trực cấp cứu
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[var(--color-warm-orange-dark)]">
                      {HOSPITAL_CONTACT.emergencyHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Hero Actions */}
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
                  <span>Gọi tư vấn / Cấp cứu: {HOSPITAL_CONTACT.hotlineDisplay}</span>
                </a>

                <Link
                  to="/lien-he"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-[6px] border border-[var(--color-border-medium)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-fg-primary)] font-medium text-xs sm:text-sm transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                >
                  <MapPin className="w-4 h-4 text-[var(--color-plum-primary)]" />
                  <span>Chỉ đường đến viện</span>
                </Link>
              </div>
            </div>

            {/* Right Asymmetric Visual Composition (5 cols) */}
            <div className="lg:col-span-5">
              <EditorialPhotoFrame
                src="/images/service-exam.webp"
                alt="Bác sĩ thăm khám lâm sàng cho thú cưng (Hình ảnh minh họa)"
                aspectRatio="4/3"
                label="Ảnh minh họa • Khám & Điều trị"
                className="rounded-[10px]"
              />
              <div className="mt-3 p-3.5 rounded-[8px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-plum-primary)] block mb-0.5">
                    Tiếp nhận trực tiếp &amp; Đặt hẹn trước
                  </span>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    Với các biểu hiện khẩn cấp ngoài khung giờ 08:00 – 21:00, vui lòng gọi hotline {HOSPITAL_CONTACT.hotlineDisplay} trước khi di chuyển.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <EditorialPolicyBanner
            label="Thông báo phân tách thông tin dịch vụ và dữ liệu mẫu"
            title="Phạm vi dịch vụ & dữ liệu mẫu trên trang:"
            className="rounded-[8px] mb-0"
          >
            Bốn nhóm năng lực chuyên môn <strong>X-quang, Siêu âm, Xét nghiệm và Phẫu thuật</strong> là dịch vụ thực tế tại {HOSPITAL_CONTACT.address}. Các bước quy trình và câu hỏi thường gặp là <em>nội dung minh họa — đang cập nhật dữ liệu thực tế</em> phục vụ hoàn thiện giao diện.
          </EditorialPolicyBanner>
        </div>
      </section>

      {/* 2. Confirmed 4 Clinical Pillars (Editorial Dossier Grid) */}
      <section
        className="py-12 sm:py-16 md:py-20 bg-[var(--color-bg-secondary)]/55 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="clinical-pillars-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] block mb-2">
              Năng Lực Chuyên Môn Tại Cơ Sở
            </span>
            <h2
              id="clinical-pillars-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-3"
            >
              Bốn nhóm dịch vụ lâm sàng &amp; cận lâm sàng trọng tâm
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed">
              Dựa trên kết quả khám lâm sàng ban đầu, bác sĩ thú y tại Lê Sơn sẽ tư vấn các hạng mục kiểm tra cận lâm sàng hoặc can thiệp phẫu thuật phù hợp với tình trạng thực tế của thú cưng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONFIRMED_CLINICAL_SERVICES.map((service, idx) => (
              <article
                key={service.id}
                className="p-6 sm:p-8 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--color-border-subtle)]">
                    <span
                      className="font-serif font-bold text-2xl sm:text-3xl text-[var(--color-plum-primary)] leading-none select-none"
                      aria-hidden="true"
                    >
                      0{idx + 1}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-purple-50 border border-purple-200/80 text-[11px] font-bold uppercase tracking-wider text-[var(--color-plum-primary)]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Dịch vụ tại 101 Khuất Duy Tiến</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-plum-deep)] mb-2.5 tracking-tight">
                    <span className="sr-only">Hạng mục 0{idx + 1}: </span>Dịch vụ {service.name}
                  </h3>

                  <p className="text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed mb-4">
                    {service.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-[var(--color-border-subtle)] flex items-center justify-between text-xs text-[var(--color-fg-subtle)]">
                  <span>Thực hiện theo chỉ định thăm khám trực tiếp</span>
                  <span className="font-semibold text-[var(--color-plum-primary)]">
                    Mã nhóm: {service.id}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Supplement Mock Notes Block */}
          {supplementNote?.isMock && (
            <div className="mt-8 p-5 sm:p-6 rounded-[8px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-purple-100/80 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider">
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>{supplementNote.mockLabel}</span>
                </span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm text-[var(--color-fg-muted)]">
                {supplementNote.items.map((item, i) => (
                  <li
                    key={i}
                    className="p-3 rounded-[6px] bg-[var(--color-bg-secondary)]/70 border border-[var(--color-border-subtle)] leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 3. Illustrative Examination Process (Step-by-Step Editorial Ledger) */}
      <section
        className="py-12 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="exam-process-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Sticky/Intro Column (4 cols) */}
            <div className="lg:col-span-4">
              <span className="inline-block px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-3">
                Nội dung minh họa — đang cập nhật dữ liệu thực tế
              </span>
              <h2
                id="exam-process-heading"
                className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-3"
              >
                Minh họa các bước thăm khám tổng quát
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-5">
                {MOCK_EXAM_EDITORIAL_NOTICE}
              </p>

              <div className="p-4 sm:p-5 rounded-[8px] bg-amber-50/70 border border-amber-200/80 text-xs text-slate-700 leading-relaxed">
                <strong className="text-[var(--color-warm-orange-dark)] font-semibold block mb-1.5 text-xs sm:text-sm">
                  Lưu ý trường hợp khẩn cấp:
                </strong>
                <p className="mb-3 text-xs leading-relaxed text-slate-700">
                  Nếu thú cưng có biểu hiện khó thở, co giật, chấn thương nặng hoặc nghi ngờ ngộ độc, vui lòng chuyển sang hướng dẫn cấp cứu và liên hệ hotline ngay lập tức.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    to="/dich-vu/cap-cuu"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-[6px] bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-xs transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-orange)]"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>Hướng dẫn Cấp cứu 24/24</span>
                  </Link>
                  <a
                    href={HOSPITAL_CONTACT.hotlineTel}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-[6px] border border-orange-300 bg-white hover:bg-orange-50 text-[var(--color-warm-orange-dark)] font-semibold text-xs transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-orange)]"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>Gọi {HOSPITAL_CONTACT.hotlineDisplay}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Step-by-Step Ledger (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {MOCK_EXAM_PROCESS_STEPS.map((step) => (
                <article
                  key={step.id}
                  className="p-5 sm:p-6 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs flex flex-col sm:flex-row sm:items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-[8px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] flex items-center justify-center shrink-0">
                    <span className="font-serif font-bold text-lg text-[var(--color-plum-deep)]" aria-hidden="true">
                      {step.stepNumber}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[var(--color-plum-deep)]">
                        <span className="sr-only">Bước {step.stepNumber}: </span>{step.title}
                      </h3>
                      {step.isMock && (
                        <span className="px-2 py-0.5 rounded-[4px] bg-purple-50 border border-purple-200/70 text-[10px] font-semibold text-[var(--color-plum-primary)]">
                          {step.detailNote}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                      {step.summary}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Mock FAQ Accordion Section */}
      <section
        className="py-12 sm:py-16 md:py-20 bg-[var(--color-bg-secondary)]/40 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="exam-faq-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Câu hỏi &amp; câu trả lời minh họa</span>
            </span>
            <h2
              id="exam-faq-heading"
              className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-2"
            >
              Giải đáp thắc mắc khi đưa bé đi khám
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)]">
              Nội dung minh họa — đang cập nhật dữ liệu thực tế.
            </p>
          </div>

          <div className="space-y-3">
            {MOCK_EXAM_FAQS.map((faq) => {
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

      {/* 5. Bottom Booking & Cross-Service Navigation */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[12px] p-6 sm:p-10 bg-[var(--color-bg-dark)] text-white shadow-md flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-plum-orchid-light)] block mb-1">
                Đặt Lịch Khám &amp; Tư Vấn Trực Tiếp
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 tracking-tight">
                Chủ động đặt lịch khám cho bé tại Lê Sơn
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
                <span>Tất cả dịch vụ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServiceExamPage
