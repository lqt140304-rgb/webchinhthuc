import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Tag,
  Phone,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ArrowRight,
  Search,
  X,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import { HOSPITAL_CONTACT } from '@/config/contact'
import {
  MOCK_PRICING_CATEGORIES,
  MOCK_PRICING_SERVICES,
  MOCK_PRICING_FAQS,
  MOCK_PRICING_EDITORIAL_NOTICE,
} from '@/data/mockPricingContent'
import { EditorialBreadcrumb } from '@/components/editorial/EditorialBreadcrumb'
import { EditorialPolicyBanner } from '@/components/editorial/EditorialPolicyBanner'

export const PricingPage: React.FC = () => {
  useRouteSeo({
    title: 'Bảng giá dịch vụ — Bệnh viện Thú y Lê Sơn',
    description:
      'Bảng giá dịch vụ khám, chẩn đoán cận lâm sàng, phẫu thuật, nội trú và spa tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến). Xem thông tin minh họa và liên hệ tư vấn chi tiết.',
    isIndexable: false,
  })

  // State management
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [openItemId, setOpenItemId] = useState<string | null>(null)
  const [openFaqId, setOpenFaqId] = useState<string | null>(MOCK_PRICING_FAQS[0]?.id ?? null)

  // Filtered services
  const filteredServices = useMemo(() => {
    let result = MOCK_PRICING_SERVICES

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.categoryId === selectedCategory)
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.shortDesc.toLowerCase().includes(q) ||
          item.applicableFor.toLowerCase().includes(q)
      )
    }

    return result
  }, [selectedCategory, searchQuery])

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MOCK_PRICING_SERVICES.length }
    for (const cat of MOCK_PRICING_CATEGORIES) {
      counts[cat.id] = MOCK_PRICING_SERVICES.filter((s) => s.categoryId === cat.id).length
    }
    return counts
  }, [])

  return (
    <div className="w-full bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)]">
      {/* 1. Editorial Hero Section */}
      <section className="py-10 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <EditorialBreadcrumb
              currentPage="Bảng giá dịch vụ"
              parentGroup="Dịch vụ &amp; Chi phí"
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
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-plum-primary)] text-xs font-bold uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Biểu Phí Tham Chiếu • Dữ Liệu Minh Họa</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-amber-50 border border-amber-200/80 text-[var(--color-warm-orange-dark)] text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Khám: {HOSPITAL_CONTACT.workingHours}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-[1.15] mb-5">
                Bảng giá dịch vụ tại Bệnh viện Thú y Lê Sơn
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-[var(--color-fg-muted)] leading-relaxed mb-6 font-sans">
                Tại <strong>{HOSPITAL_CONTACT.address}</strong>, mọi chi phí thăm khám, xét nghiệm cận lâm sàng, điều trị và phẫu thuật đều được bác sĩ tư vấn dự toán cụ thể với chủ nuôi trước khi tiến hành. Khung bảng giá dưới đây minh họa các hạng mục dịch vụ phục vụ trải nghiệm giao diện trong khi chờ cập nhật biểu phí niêm yết chính thức.
              </p>

              {/* Verified Operational Quick Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7 p-4 rounded-[8px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-fg-subtle)] block">
                      Cơ sở thực hiện
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
                  <Phone className="w-4 h-4 text-[var(--color-warm-orange)] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-warm-orange-dark)] block">
                      Tư vấn &amp; Cấp cứu
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[var(--color-warm-orange-dark)]">
                      {HOSPITAL_CONTACT.hotlineDisplay}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hero Action CTAs */}
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
                  <span>Gọi tư vấn chi phí: {HOSPITAL_CONTACT.hotlineDisplay}</span>
                </a>

                <Link
                  to="/dich-vu"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-[6px] border border-[var(--color-border-medium)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-fg-primary)] font-medium text-xs sm:text-sm transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                >
                  <span>Chi tiết dịch vụ y tế</span>
                  <ArrowRight className="w-4 h-4 text-[var(--color-plum-primary)]" />
                </Link>
              </div>
            </div>

            {/* Right Information Card (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-6 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs">
                <div className="flex items-center gap-2 mb-3 text-[var(--color-plum-primary)]">
                  <ShieldCheck className="w-5 h-5" />
                  <h2 className="font-serif font-bold text-base text-[var(--color-plum-deep)]">
                    Cam kết minh bạch y khoa
                  </h2>
                </div>
                <ul className="space-y-3 text-xs text-[var(--color-fg-muted)] leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                    <span>Khám và đánh giá thể trạng trực tiếp trước khi đề xuất bất kỳ can thiệp nào.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                    <span>Giải thích cặn kẽ mục đích của từng xét nghiệm, phim X-quang hoặc phẫu thuật.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                    <span>Dự toán chi phí minh bạch cùng chủ nuôi trước khi thực hiện.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-[8px] bg-amber-50/80 border border-amber-200/80 text-xs text-slate-700">
                <span className="font-bold text-[var(--color-warm-orange-dark)] block mb-1">
                  Trường hợp cấp cứu khẩn cấp:
                </span>
                <p className="leading-relaxed mb-2.5">
                  Ưu tiên cứu chữa thể trạng thú cưng lên hàng đầu. Đội ngũ bác sĩ trực 24/24 tiếp nhận xử lý ngay khi đưa bé đến cơ sở.
                </p>
                <a
                  href={HOSPITAL_CONTACT.hotlineTel}
                  className="font-bold text-[var(--color-warm-orange-dark)] hover:underline inline-flex items-center gap-1.5 min-h-[44px]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi cấp cứu 24/24: {HOSPITAL_CONTACT.hotlineDisplay}</span>
                </a>
              </div>
            </div>
          </div>

          <EditorialPolicyBanner
            label="Thông báo chính sách dữ liệu bảng giá"
            title="Lưu ý về dữ liệu minh họa bảng giá:"
            className="rounded-[8px] mb-0"
          >
            {MOCK_PRICING_EDITORIAL_NOTICE}
          </EditorialPolicyBanner>
        </div>
      </section>

      {/* 2. Interactive Pricing Ledger Section */}
      <section
        className="py-12 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="pricing-ledger-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <span className="inline-block px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
                Bảng giá minh họa — đang cập nhật dữ liệu thực tế
              </span>
              <h2
                id="pricing-ledger-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight"
              >
                Danh mục dịch vụ &amp; Trạng thái chi phí tham chiếu
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-md">
              Sử dụng thanh tìm kiếm hoặc chọn nhóm dịch vụ bên dưới để tra cứu thông tin chi tiết từng hạng mục.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 sm:p-5 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Search Bar (8 cols) */}
              <div className="md:col-span-8 relative">
                <label htmlFor="service-search-input" className="sr-only">
                  Tìm kiếm tên dịch vụ hoặc triệu chứng
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[var(--color-fg-subtle)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="service-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm dịch vụ (ví dụ: X-quang, triệt sản, siêu âm, vaccine, tắm sấy...)"
                    className="w-full pl-10 pr-10 py-3 rounded-[6px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50 focus:bg-white text-xs sm:text-sm text-[var(--color-fg-primary)] placeholder:text-[var(--color-fg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] min-h-[44px]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Xóa nội dung tìm kiếm"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-[4px] hover:bg-slate-200/60 text-slate-500 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status summary (4 cols) */}
              <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-3 text-xs text-[var(--color-fg-muted)]">
                <span>
                  Hiển thị: <strong>{filteredServices.length}</strong> / {MOCK_PRICING_SERVICES.length} dịch vụ
                </span>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                    className="text-[var(--color-plum-primary)] hover:underline font-semibold min-h-[44px] inline-flex items-center px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] rounded-[4px]"
                  >
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[var(--color-border-subtle)]" role="tablist" aria-label="Nhóm dịch vụ">
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-2 rounded-[6px] text-xs font-semibold transition-all min-h-[44px] flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] ${
                  selectedCategory === 'all'
                    ? 'bg-[var(--color-plum-primary)] text-white shadow-2xs'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-fg-muted)] hover:bg-[var(--color-border-subtle)]'
                }`}
              >
                <span>Tất cả dịch vụ</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {categoryCounts['all']}
                </span>
              </button>

              {MOCK_PRICING_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-[6px] text-xs font-semibold transition-all min-h-[44px] flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] ${
                      isSelected
                        ? 'bg-[var(--color-plum-primary)] text-white shadow-2xs'
                        : 'bg-[var(--color-bg-secondary)] text-[var(--color-fg-muted)] hover:bg-[var(--color-border-subtle)]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {categoryCounts[cat.id] ?? 0}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pricing Table / Accordion List */}
          {filteredServices.length === 0 ? (
            /* Empty State */
            <div className="p-10 sm:p-16 rounded-[12px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] text-center max-w-xl mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-[var(--color-plum-primary)] flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)] mb-2">
                Không tìm thấy dịch vụ phù hợp
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] mb-5 leading-relaxed">
                Không có hạng mục nào khớp với từ khóa &ldquo;{searchQuery}&rdquo;. Quý khách vui lòng thử lại bằng từ khóa khác hoặc liên hệ hotline để được bác sĩ tư vấn trực tiếp.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="px-4 py-2.5 rounded-[6px] bg-[var(--color-plum-primary)] text-white font-semibold text-xs min-h-[44px] hover:bg-[var(--color-plum-deep)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                >
                  Xem toàn bộ bảng giá
                </button>
                <a
                  href={HOSPITAL_CONTACT.hotlineTel}
                  className="px-4 py-2.5 rounded-[6px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] text-[var(--color-plum-deep)] font-semibold text-xs min-h-[44px] inline-flex items-center gap-1.5 hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi {HOSPITAL_CONTACT.hotlineDisplay}</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredServices.map((service) => {
                const isOpen = openItemId === service.id
                const buttonId = `pricing-btn-${service.id}`
                const panelId = `pricing-panel-${service.id}`
                const category = MOCK_PRICING_CATEGORIES.find((c) => c.id === service.categoryId)

                return (
                  <article
                    key={service.id}
                    className="rounded-[8px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs overflow-hidden transition-all duration-150"
                  >
                    {/* Accordion Row Header */}
                    <button
                      type="button"
                      id={buttonId}
                      aria-controls={panelId}
                      aria-expanded={isOpen}
                      onClick={() => setOpenItemId(isOpen ? null : service.id)}
                      className="w-full px-5 py-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--color-bg-secondary)]/40 transition-colors min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-plum-primary)]"
                    >
                      <div className="flex-1 pr-2">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs sm:text-sm font-bold text-[var(--color-plum-deep)] group-hover:text-[var(--color-plum-primary)]">
                            {service.name}
                          </span>
                          {category && (
                            <span className="px-2 py-0.5 rounded-[4px] bg-[var(--color-bg-secondary)] text-[10px] font-semibold text-[var(--color-plum-primary)]">
                              {category.name}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--color-fg-muted)] line-clamp-1 sm:line-clamp-none">
                          {service.shortDesc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--color-border-subtle)]/50">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[4px] bg-amber-50 border border-amber-200 text-xs font-semibold text-[var(--color-warm-orange-dark)]">
                          <Tag className="w-3 h-3 shrink-0" />
                          <span>{service.priceStatus}</span>
                        </span>

                        <div className="flex items-center gap-1 text-xs text-[var(--color-plum-primary)] font-medium">
                          <span className="hidden md:inline">{isOpen ? 'Thu gọn' : 'Chi tiết'}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </button>

                    {/* Accordion Expandable Detail Panel */}
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isOpen}
                      className={`px-5 pb-5 pt-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/30 ${
                        isOpen ? 'block' : 'hidden'
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-xs">
                        <div className="p-3.5 rounded-[6px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
                          <span className="font-bold text-[var(--color-plum-deep)] block mb-1">
                            Đối tượng áp dụng:
                          </span>
                          <span className="text-[var(--color-fg-muted)] leading-relaxed">
                            {service.applicableFor}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-[6px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
                          <span className="font-bold text-[var(--color-plum-deep)] block mb-1">
                            Thời gian thực hiện dự kiến:
                          </span>
                          <span className="text-[var(--color-fg-muted)] leading-relaxed">
                            {service.executionTime}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-[6px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
                          <span className="font-bold text-[var(--color-plum-deep)] block mb-1">
                            Lưu ý chuẩn bị:
                          </span>
                          <span className="text-[var(--color-fg-muted)] leading-relaxed">
                            {service.notes}
                          </span>
                        </div>
                      </div>

                      {/* Micro actions inside panel */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-dashed border-[var(--color-border-subtle)]">
                        <span className="text-[11px] text-[var(--color-fg-subtle)] italic">
                          * Mọi chỉ định kỹ thuật đều được bác sĩ thống nhất trước khi tiến hành.
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to="/dat-lich"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-medium text-xs transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Đặt lịch dịch vụ này</span>
                          </Link>
                          <a
                            href={HOSPITAL_CONTACT.hotlineTel}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-orange-300 bg-white hover:bg-orange-50 text-[var(--color-warm-orange-dark)] font-medium text-xs transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-orange)]"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Hỏi giá: {HOSPITAL_CONTACT.hotlineDisplay}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. Pricing Policy & FAQ Section */}
      <section
        className="py-12 sm:py-16 md:py-20 bg-[var(--color-bg-secondary)]/50 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="pricing-faq-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Câu hỏi &amp; câu trả lời minh họa</span>
            </span>
            <h2
              id="pricing-faq-heading"
              className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-2"
            >
              Giải đáp thắc mắc về chi phí &amp; biểu phí dịch vụ
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)]">
              Nội dung minh họa — đang cập nhật dữ liệu thực tế từ cơ sở 101 Khuất Duy Tiến.
            </p>
          </div>

          <div className="space-y-3">
            {MOCK_PRICING_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id
              const buttonId = `pricing-faq-btn-${faq.id}`
              const panelId = `pricing-faq-panel-${faq.id}`
              return (
                <div
                  key={faq.id}
                  className="rounded-[8px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] overflow-hidden shadow-2xs"
                >
                  <button
                    type="button"
                    id={buttonId}
                    aria-controls={panelId}
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[var(--color-bg-secondary)]/50 transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-plum-primary)]"
                  >
                    <span className="text-sm sm:text-base font-semibold text-[var(--color-plum-deep)]">
                      {faq.question}
                    </span>
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

      {/* 4. Bottom Booking & Services Navigation */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[12px] p-6 sm:p-10 bg-[var(--color-bg-dark)] text-white shadow-md flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-plum-orchid-light)] block mb-1">
                Tư Vấn Thăm Khám &amp; Dự Toán Chi Phí
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 tracking-tight">
                Cần biết chi phí cụ thể cho thú cưng của bạn?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-plum-orchid-light)] leading-relaxed">
                {HOSPITAL_CONTACT.address} • Giờ khám {HOSPITAL_CONTACT.workingHours} • Cấp cứu {HOSPITAL_CONTACT.emergencyHours}
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
                <span>Xem dịch vụ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PricingPage
