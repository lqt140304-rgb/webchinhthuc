import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
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
  Sparkles,
  Info,
  CheckCircle2,
  Eye,
  Tag,
} from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import { HOSPITAL_CONTACT } from '@/config/contact'
import {
  MOCK_PRODUCT_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_PRODUCT_FAQS,
  MOCK_PRODUCTS_EDITORIAL_NOTICE,
  type MockProductItem,
} from '@/data/mockProductsContent'
import { EditorialBreadcrumb } from '@/components/editorial/EditorialBreadcrumb'
import { EditorialPolicyBanner } from '@/components/editorial/EditorialPolicyBanner'
import { EditorialPhotoFrame } from '@/components/editorial/EditorialPhotoFrame'

export const ProductsPage: React.FC = () => {
  useRouteSeo({
    title: 'Sản phẩm & Dinh dưỡng thú cưng — Bệnh viện Thú y Lê Sơn',
    description:
      'Danh mục sản phẩm dinh dưỡng, phụ kiện và chăm sóc thú cưng chọn lọc tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến). Xem danh mục minh họa và liên hệ tư vấn trực tiếp.',
    isIndexable: false,
  })

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPet, setSelectedPet] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'name-desc'>('default')
  const [selectedProduct, setSelectedProduct] = useState<MockProductItem | null>(null)
  const [openFaqId, setOpenFaqId] = useState<string | null>(MOCK_PRODUCT_FAQS[0]?.id ?? null)

  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Featured products
  const featuredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => p.isFeatured)
  }, [])

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.categoryId === selectedCategory)
    }

    if (selectedPet !== 'all') {
      if (selectedPet === 'dog') {
        result = result.filter(
          (item) => item.targetPet.includes('Chó') || item.targetPet.includes('Cún')
        )
      } else if (selectedPet === 'cat') {
        result = result.filter((item) => item.targetPet.includes('Mèo'))
      }
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.categoryName.toLowerCase().includes(q) ||
          item.targetPet.toLowerCase().includes(q)
      )
    }

    // Sort
    if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    } else if (sortBy === 'name-desc') {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name, 'vi'))
    }

    return result
  }, [selectedCategory, selectedPet, searchQuery, sortBy])

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MOCK_PRODUCTS.length }
    for (const cat of MOCK_PRODUCT_CATEGORIES) {
      counts[cat.id] = MOCK_PRODUCTS.filter((p) => p.categoryId === cat.id).length
    }
    return counts
  }, [])

  // Handle open modal with focus management
  const handleOpenModal = useCallback((product: MockProductItem) => {
    previousActiveElement.current = document.activeElement as HTMLElement
    setSelectedProduct(product)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null)
    if (previousActiveElement.current) {
      previousActiveElement.current.focus()
    }
  }, [])

  // Trap Escape key for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProduct) {
        handleCloseModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedProduct, handleCloseModal])

  return (
    <div className="w-full bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)]">
      {/* 1. Editorial Hero Section */}
      <section className="py-10 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <EditorialBreadcrumb
              currentPage="Sản phẩm chọn lọc"
              parentGroup="Dịch vụ &amp; Chăm sóc"
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative (7 cols) */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-purple-100/90 text-[var(--color-plum-primary)] text-xs font-bold uppercase tracking-wider">
                  <Package className="w-3.5 h-3.5" />
                  <span>Dinh Dưỡng &amp; Phụ Kiện Thú Y</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-plum-deep)] text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-plum-primary)]" />
                  <span>Chọn lọc an toàn cho thú cưng</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-[1.15] mb-5">
                Sản phẩm dinh dưỡng &amp; chăm sóc thú cưng tại Lê Sơn
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-[var(--color-fg-muted)] leading-relaxed mb-6 font-sans">
                Song hành cùng hoạt động khám chữa bệnh chuyên khoa, {HOSPITAL_CONTACT.name} tại <strong>{HOSPITAL_CONTACT.address}</strong> giới thiệu các dòng sản phẩm dinh dưỡng phục hồi, sữa tắm dịu nhẹ, phụ kiện tiện ích và vi chất bổ sung được bác sĩ thú y tư vấn trực tiếp theo từng giai đoạn thể trạng của bé.
              </p>

              {/* Quick Store Info Strip */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-[var(--color-fg-muted)] mb-7 pb-6 border-b border-[var(--color-border-subtle)]">
                <span className="inline-flex items-center gap-1.5 font-medium text-[var(--color-plum-deep)]">
                  <MapPin className="w-4 h-4 text-[var(--color-plum-primary)]" />
                  <span>Trưng bày tại quầy cơ sở: {HOSPITAL_CONTACT.shortAddress}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-[var(--color-plum-deep)]">
                  <Clock className="w-4 h-4 text-[var(--color-plum-primary)]" />
                  <span>Giờ phục vụ: {HOSPITAL_CONTACT.workingHours}</span>
                </span>
              </div>

              {/* Hero Action CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={HOSPITAL_CONTACT.hotlineTel}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Tư vấn tình trạng hàng: {HOSPITAL_CONTACT.hotlineDisplay}</span>
                </a>

                <Link
                  to="/dat-lich"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-orange)]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Đặt lịch khám &amp; tư vấn</span>
                </Link>

                <Link
                  to="/bang-gia"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-[6px] border border-[var(--color-border-medium)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-fg-primary)] font-medium text-xs sm:text-sm transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                >
                  <Tag className="w-4 h-4 text-[var(--color-plum-primary)]" />
                  <span>Bảng giá dịch vụ</span>
                </Link>
              </div>
            </div>

            {/* Right Asymmetric Visual Showcase (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <EditorialPhotoFrame
                src="/images/article-nutrition.webp"
                alt="Sản phẩm dinh dưỡng và chăm sóc thú cưng chọn lọc (Ảnh minh họa)"
                aspectRatio="4/3"
                label="Ảnh minh họa • Dinh dưỡng & Chăm sóc"
                className="rounded-[10px]"
              />
              <div className="p-4 rounded-[8px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-fg-muted)] leading-relaxed">
                <strong className="text-[var(--color-plum-deep)] font-semibold block mb-1">
                  Chính sách tư vấn sản phẩm tại viện:
                </strong>
                Bác sĩ luôn đối chiếu thể trạng, độ tuổi và bệnh lý nền trước khi đề xuất sản phẩm dinh dưỡng bổ sung, đảm bảo hiệu quả phục hồi an toàn cho thú cưng.
              </div>
            </div>
          </div>

          <EditorialPolicyBanner
            label="Thông báo chính sách sản phẩm"
            title="Lưu ý về danh mục sản phẩm minh họa:"
            className="rounded-[8px] mb-0"
          >
            {MOCK_PRODUCTS_EDITORIAL_NOTICE}
          </EditorialPolicyBanner>
        </div>
      </section>

      {/* 2. Featured Curated Collection Section */}
      <section
        className="py-12 sm:py-16 md:py-20 bg-[var(--color-bg-secondary)]/50 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="featured-products-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
                Bộ sưu tập gợi ý • Dữ liệu minh họa
              </span>
              <h2
                id="featured-products-heading"
                className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight"
              >
                Sản phẩm dinh dưỡng &amp; chăm sóc tiêu biểu
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-md">
              Các dòng sản phẩm minh họa thường được phụ huynh thú cưng quan tâm trong quá trình chăm sóc phục hồi tại gia đình.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <article
                key={product.id}
                className="rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] overflow-hidden shadow-2xs flex flex-col justify-between transition-all duration-150 hover:shadow-xs group"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-[var(--color-bg-secondary)] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-[4px] bg-[var(--color-plum-deep)]/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                      {product.targetPet}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-[4px] bg-white/95 text-[var(--color-plum-primary)] text-[10px] font-semibold border border-[var(--color-border-subtle)] shadow-2xs">
                      Ảnh minh họa
                    </span>
                  </div>

                  <div className="p-4 sm:p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-plum-primary)] block mb-1">
                      {product.categoryName}
                    </span>
                    <h3 className="text-base font-serif font-bold text-[var(--color-plum-deep)] mb-2 line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[var(--color-fg-muted)] line-clamp-2 leading-relaxed mb-3">
                      {product.summary}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[var(--color-warm-orange-dark)]">
                    {product.priceStatus}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenModal(product)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border-subtle)] text-[var(--color-plum-primary)] text-xs font-semibold transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Chi tiết</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Full Product Catalog with Filter & Search */}
      <section
        className="py-12 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="catalog-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
                Nội dung minh họa — đang cập nhật dữ liệu thực tế
              </span>
              <h2
                id="catalog-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight"
              >
                Danh mục sản phẩm chọn lọc
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-md">
              Tìm kiếm theo từ khóa hoặc phân loại danh mục để khám phá các dòng sản phẩm phù hợp với bé.
            </p>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="p-4 sm:p-5 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Search Bar (7 cols) */}
              <div className="md:col-span-7 relative">
                <label htmlFor="product-search-input" className="sr-only">
                  Tìm kiếm tên sản phẩm, công dụng hoặc danh mục
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[var(--color-fg-subtle)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="product-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo tên sản phẩm (ví dụ: pate, sữa tắm, gel, men vi sinh, bát ăn...)"
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

              {/* Pet Type Filter (2 cols) */}
              <div className="md:col-span-2">
                <label htmlFor="pet-type-select" className="sr-only">
                  Lọc theo loài thú cưng
                </label>
                <select
                  id="pet-type-select"
                  value={selectedPet}
                  onChange={(e) => setSelectedPet(e.target.value)}
                  className="w-full px-3 py-3 rounded-[6px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50 focus:bg-white text-xs sm:text-sm text-[var(--color-fg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] min-h-[44px]"
                >
                  <option value="all">Tất cả thú cưng</option>
                  <option value="cat">Dành cho Mèo</option>
                  <option value="dog">Dành cho Chó</option>
                </select>
              </div>

              {/* Sort Dropdown (3 cols) */}
              <div className="md:col-span-3">
                <label htmlFor="product-sort-select" className="sr-only">
                  Sắp xếp danh mục sản phẩm
                </label>
                <select
                  id="product-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-3 rounded-[6px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50 focus:bg-white text-xs sm:text-sm text-[var(--color-fg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] min-h-[44px]"
                >
                  <option value="default">Sắp xếp: Mặc định</option>
                  <option value="name-asc">Sắp xếp: Tên A &rarr; Z</option>
                  <option value="name-desc">Sắp xếp: Tên Z &rarr; A</option>
                </select>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[var(--color-border-subtle)]" role="tablist" aria-label="Nhóm sản phẩm">
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
                <span>Tất cả sản phẩm</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {categoryCounts['all']}
                </span>
              </button>

              {MOCK_PRODUCT_CATEGORIES.map((cat) => {
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

          {/* Product Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="p-10 sm:p-16 rounded-[12px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] text-center max-w-xl mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-[var(--color-plum-primary)] flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)] mb-2">
                Không tìm thấy sản phẩm phù hợp
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] mb-5 leading-relaxed">
                Không có sản phẩm nào khớp với tiêu chí tìm kiếm hiện tại. Quý khách vui lòng thử từ khóa khác hoặc liên hệ hotline để kiểm tra mặt hàng thực tế tại cơ sở.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSelectedPet('all')
                }}
                className="px-4 py-2.5 rounded-[6px] bg-[var(--color-plum-primary)] text-white font-semibold text-xs min-h-[44px] hover:bg-[var(--color-plum-deep)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
              >
                Xem toàn bộ sản phẩm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] overflow-hidden shadow-2xs flex flex-col justify-between transition-all duration-150 hover:shadow-xs group"
                >
                  <div>
                    <div className="relative aspect-[4/3] bg-[var(--color-bg-secondary)] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.imageAlt}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-[4px] bg-[var(--color-plum-deep)]/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                        {product.targetPet}
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-[4px] bg-white/95 text-[var(--color-plum-primary)] text-[10px] font-semibold border border-[var(--color-border-subtle)] shadow-2xs">
                        Ảnh minh họa
                      </span>
                    </div>

                    <div className="p-5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-plum-primary)] block mb-1">
                        {product.categoryName}
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[var(--color-plum-deep)] mb-2 line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[var(--color-fg-muted)] line-clamp-3 leading-relaxed mb-4">
                        {product.summary}
                      </p>

                      <ul className="space-y-1.5 pt-3 border-t border-dashed border-[var(--color-border-subtle)] text-[11px] text-[var(--color-fg-subtle)]">
                        {product.highlights.slice(0, 2).map((hl, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[var(--color-plum-primary)] font-bold">&bull;</span>
                            <span className="line-clamp-1">{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[var(--color-warm-orange-dark)]">
                      {product.priceStatus}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenModal(product)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[4px] bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white text-xs font-semibold transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem thông tin</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Product FAQs Section */}
      <section
        className="py-12 sm:py-16 md:py-20 bg-[var(--color-bg-secondary)]/50 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="product-faq-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Câu hỏi &amp; câu trả lời minh họa</span>
            </span>
            <h2
              id="product-faq-heading"
              className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-2"
            >
              Lưu ý khi lựa chọn sản phẩm cho thú cưng
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)]">
              Nội dung minh họa — đang cập nhật dữ liệu thực tế tại quầy cơ sở 101 Khuất Duy Tiến.
            </p>
          </div>

          <div className="space-y-3">
            {MOCK_PRODUCT_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id
              const buttonId = `prod-faq-btn-${faq.id}`
              const panelId = `prod-faq-panel-${faq.id}`
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

      {/* 5. Bottom Consultation CTA */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[12px] p-6 sm:p-10 bg-[var(--color-bg-dark)] text-white shadow-md flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-plum-orchid-light)] block mb-1">
                Tư Vấn Sản Phẩm Dinh Dưỡng
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 tracking-tight">
                Cần kiểm tra sản phẩm phù hợp cho bé?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-plum-orchid-light)] leading-relaxed">
                {HOSPITAL_CONTACT.address} • Giờ phục vụ {HOSPITAL_CONTACT.workingHours} • Hotline {HOSPITAL_CONTACT.hotlineDisplay}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={HOSPITAL_CONTACT.hotlineTel}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-xs sm:text-sm transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-orange)]"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi kiểm tra hàng: {HOSPITAL_CONTACT.hotlineDisplay}</span>
              </a>
              <Link
                to="/dat-lich"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] bg-white text-[var(--color-plum-deep)] hover:bg-[var(--color-lavender)] font-semibold text-xs sm:text-sm transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Calendar className="w-4 h-4 text-[var(--color-plum-primary)]" />
                <span>Đặt lịch khám &amp; tư vấn</span>
              </Link>
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

      {/* 6. Product Detail Modal (Accessible Dialog) */}
      {selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-bg-overlay)] backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            ref={modalRef}
            className="w-full max-w-2xl bg-[var(--color-bg-card)] rounded-[12px] border border-[var(--color-border-medium)] shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[var(--color-border-subtle)] flex items-center justify-between gap-3 bg-[var(--color-bg-secondary)]/40">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-xs font-bold uppercase tracking-wider">
                  {selectedProduct.categoryName}
                </span>
                <span className="px-2.5 py-1 rounded-[4px] bg-amber-50 border border-amber-200 text-xs font-bold text-[var(--color-warm-orange-dark)]">
                  {selectedProduct.targetPet}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Đóng cửa sổ chi tiết sản phẩm"
                className="p-2 rounded-[6px] hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                <div className="sm:col-span-5 relative aspect-[4/3] rounded-[8px] overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.imageAlt}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-[4px] bg-white/90 text-[var(--color-plum-primary)] text-[10px] font-semibold">
                    Ảnh minh họa
                  </span>
                </div>

                <div className="sm:col-span-7">
                  <h3
                    id="product-modal-title"
                    className="text-lg sm:text-xl font-serif font-bold text-[var(--color-plum-deep)] mb-2 leading-snug"
                  >
                    {selectedProduct.name}
                  </h3>
                  <div className="mb-3">
                    <span className="inline-block px-2.5 py-1 rounded-[4px] bg-amber-50 border border-amber-200 text-xs font-bold text-[var(--color-warm-orange-dark)]">
                      Trạng thái: {selectedProduct.priceStatus}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                    {selectedProduct.summary}
                  </p>
                </div>
              </div>

              {/* Highlights */}
              <div className="p-4 rounded-[8px] bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border-subtle)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)] block mb-2">
                  Đặc điểm nổi bật &amp; Công dụng:
                </span>
                <ul className="space-y-2 text-xs text-[var(--color-fg-muted)]">
                  {selectedProduct.highlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Usage & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-[8px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
                  <strong className="text-[var(--color-plum-deep)] block mb-1.5 font-semibold">
                    Hướng dẫn sử dụng tham khảo:
                  </strong>
                  <p className="text-[var(--color-fg-muted)] leading-relaxed">
                    {selectedProduct.usageGuide}
                  </p>
                </div>

                <div className="p-4 rounded-[8px] bg-amber-50/70 border border-amber-200/80">
                  <strong className="text-[var(--color-warm-orange-dark)] block mb-1.5 font-semibold">
                    Lưu ý chuyên môn y khoa:
                  </strong>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedProduct.consultationNote}
                  </p>
                </div>
              </div>

              {/* Direct Medical Compliance Notice */}
              <div className="p-3.5 rounded-[6px] bg-purple-50/70 border border-purple-200/70 text-[11px] text-[var(--color-plum-deep)] leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                <span>
                  Bệnh viện không bán thuốc theo toa trên website. Mọi sản phẩm dinh dưỡng bổ sung nên được tham khảo ý kiến bác sĩ để phù hợp nhất với thể trạng của thú cưng.
                </span>
              </div>
            </div>

            {/* Modal Footer CTAs */}
            <div className="p-4 sm:p-5 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/30 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[var(--color-fg-subtle)]">
                Liên hệ trực tiếp để kiểm tra tình trạng hàng tại quầy
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-[6px] border border-[var(--color-border-medium)] bg-white hover:bg-slate-50 text-xs font-semibold text-[var(--color-fg-primary)] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                >
                  Đóng
                </button>
                <a
                  href={HOSPITAL_CONTACT.hotlineTel}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white text-xs font-semibold transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi {HOSPITAL_CONTACT.hotlineDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsPage
