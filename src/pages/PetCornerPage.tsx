import React, { useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Search,
  X,
  ArrowRight,
  Calendar,
  Sparkles,
  CheckCircle2,
  Bookmark,
} from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import {
  MOCK_ARTICLES,
  MOCK_ARTICLE_CATEGORIES,
  MOCK_PET_CORNER_EDITORIAL_NOTICE,
} from '@/data/mockPetCornerContent'
import { EditorialBreadcrumb } from '@/components/editorial/EditorialBreadcrumb'
import { EditorialPolicyBanner } from '@/components/editorial/EditorialPolicyBanner'
import { EditorialDarkCTA } from '@/components/editorial/EditorialDarkCTA'

export const PetCornerPage: React.FC = () => {
  useRouteSeo({
    title: 'Góc thú cưng & Cẩm nang kiến thức — Bệnh viện Thú y Lê Sơn',
    description:
      'Cẩm nang kiến thức chăm sóc, dinh dưỡng và chuẩn bị thông tin khám thú cưng tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến). Xem các bài viết hướng dẫn định hướng an toàn.',
    isIndexable: false,
  })

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Featured article (art-01: dinh-duong-an-toan-cho-thu-cung)
  const featuredArticle = useMemo(() => {
    return MOCK_ARTICLES.find((a) => a.isFeatured) ?? MOCK_ARTICLES[0]
  }, [])

  // Filtered articles
  const filteredArticles = useMemo(() => {
    let result = MOCK_ARTICLES

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.categoryId === selectedCategory)
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          item.categoryName.toLowerCase().includes(q) ||
          item.targetPet.toLowerCase().includes(q)
      )
    }

    return result
  }, [selectedCategory, searchQuery])

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MOCK_ARTICLES.length }
    for (const cat of MOCK_ARTICLE_CATEGORIES) {
      counts[cat.id] = MOCK_ARTICLES.filter((a) => a.categoryId === cat.id).length
    }
    return counts
  }, [])

  // ARIA Tabs keyboard navigation & roving tabindex
  const tabCategoryList = useMemo(
    () => ['all', ...MOCK_ARTICLE_CATEGORIES.map((c) => c.id)],
    []
  )
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleTabKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let targetIndex = currentIndex
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      targetIndex = (currentIndex + 1) % tabCategoryList.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      targetIndex = (currentIndex - 1 + tabCategoryList.length) % tabCategoryList.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      targetIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      targetIndex = tabCategoryList.length - 1
    } else {
      return
    }

    const nextCategoryId = tabCategoryList[targetIndex]
    setSelectedCategory(nextCategoryId)
    tabRefs.current[targetIndex]?.focus()
  }

  return (
    <div className="w-full bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)]">
      {/* 1. Magazine Hero Section */}
      <section className="py-10 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <EditorialBreadcrumb
              currentPage="Góc thú cưng"
              parentGroup="Về Lê Sơn"
              parentLink="/gioi-thieu"
            />
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tạp chí kiến thức thú y</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
            <div className="lg:col-span-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-4 leading-tight">
                Góc thú cưng &amp; Cẩm nang kiến thức
              </h1>
              <p className="text-base sm:text-lg text-[var(--color-fg-muted)] leading-relaxed max-w-2xl mb-6">
                Những bài viết định hướng chăm sóc, dinh dưỡng và chuẩn bị thông tin thăm khám khoa học — cùng bạn xây dựng nếp sống an lành cho các bé cưng.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/dat-lich"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[6px] bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-medium text-xs sm:text-sm transition-colors shadow-2xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Đặt lịch tư vấn sức khỏe</span>
                </Link>
                <Link
                  to="/cau-chuyen"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] border border-[var(--color-border-medium)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-fg-primary)] font-medium text-xs sm:text-sm transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                >
                  <Bookmark className="w-4 h-4 text-[var(--color-plum-primary)]" />
                  <span>Xem Câu chuyện điều trị</span>
                </Link>
              </div>
            </div>

            {/* Editorial Standard Card */}
            <div className="lg:col-span-4 p-5 sm:p-6 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)] block mb-2">
                Tiêu chuẩn nội dung cẩm nang:
              </span>
              <ul className="space-y-2.5 text-xs text-[var(--color-fg-muted)] leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                  <span>Nội dung hướng dẫn chung, an toàn và dễ thực hiện tại gia đình.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                  <span>Không tự ý đưa liều lượng thuốc, phác đồ y khoa hoặc lời khuyên điều trị thay thế bác sĩ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                  <span>Khuyến khích chủ nuôi thăm khám lâm sàng trực tiếp khi bé có biểu hiện khác thường.</span>
                </li>
              </ul>
            </div>
          </div>

          <EditorialPolicyBanner
            label="Chính sách dữ liệu cẩm nang bài viết"
            title="Lưu ý biên tập cẩm nang:"
            className="rounded-[8px] mb-0"
          >
            {MOCK_PET_CORNER_EDITORIAL_NOTICE}
          </EditorialPolicyBanner>
        </div>
      </section>

      {/* 2. Featured Article Showcase */}
      {featuredArticle && (
        <section
          className="py-12 sm:py-16 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/30"
          aria-labelledby="featured-article-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--color-plum-primary)]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)]">
                  Chuyên đề nổi bật
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-[4px] bg-amber-50 border border-amber-200 text-xs font-bold text-[var(--color-warm-orange-dark)]">
                {featuredArticle.badgeLabel}
              </span>
            </div>

            <article className="rounded-[12px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
                <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[340px] bg-[var(--color-bg-secondary)] overflow-hidden">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.imageAlt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-[4px] bg-white/95 text-[var(--color-plum-primary)] text-xs font-bold shadow-xs">
                      {featuredArticle.categoryName}
                    </span>
                    <span className="px-2.5 py-1 rounded-[4px] bg-purple-900/90 text-white text-xs font-semibold">
                      {featuredArticle.targetPet}
                    </span>
                  </div>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-[4px] bg-white/90 text-[var(--color-plum-primary)] text-[11px] font-semibold">
                    Ảnh minh họa
                  </span>
                </div>

                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-fg-subtle)] mb-2.5">
                      <span>{featuredArticle.author}</span>
                      <span>•</span>
                      <span>{featuredArticle.readTime}</span>
                    </div>

                    <h2
                      id="featured-article-heading"
                      className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[var(--color-plum-deep)] mb-3 leading-snug"
                    >
                      {featuredArticle.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-6">
                      {featuredArticle.excerpt}
                    </p>

                    <div className="space-y-1.5 mb-6 text-xs text-[var(--color-fg-muted)]">
                      <span className="font-bold text-[var(--color-plum-deep)] block mb-1">
                        Mục lục chuyên đề:
                      </span>
                      {featuredArticle.tableOfContents.map((toc, tIdx) => (
                        <div key={tIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-plum-primary)]" />
                          <span>{toc.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
                    <span className="text-xs text-[var(--color-fg-subtle)] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Xuất bản: {featuredArticle.publishedDate}</span>
                    </span>

                    <Link
                      to={`/bai-viet/${featuredArticle.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white text-xs sm:text-sm font-semibold transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                    >
                      <span>Đọc bài viết đầy đủ</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* 3. Articles Catalog & Filter Section */}
      <section
        className="py-12 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="articles-catalog-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
                Kho bài viết cẩm nang tham khảo
              </span>
              <h2
                id="articles-catalog-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight"
              >
                Cẩm nang chăm sóc &amp; Dinh dưỡng
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-md">
              Tra cứu nhanh các chủ đề về dinh dưỡng, vệ sinh lông da, phòng ngừa thời tiết và chuẩn bị đưa bé đi khám.
            </p>
          </div>

          {/* Search & Tabs Toolbar */}
          <div className="p-4 sm:p-5 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Search Bar (8 cols) */}
              <div className="md:col-span-8 relative">
                <label htmlFor="article-search-input" className="sr-only">
                  Tìm kiếm bài viết cẩm nang
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[var(--color-fg-subtle)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="article-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo chủ đề bài viết (ví dụ: dinh dưỡng, mùa mưa, sổ khám, tiêm phòng...)"
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
                  Hiển thị: <strong>{filteredArticles.length}</strong> / {MOCK_ARTICLES.length} bài viết
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
            <div
              className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[var(--color-border-subtle)]"
              role="tablist"
              aria-label="Nhóm cẩm nang kiến thức"
            >
              <button
                ref={(el) => {
                  tabRefs.current[0] = el
                }}
                id="article-tab-all"
                type="button"
                role="tab"
                tabIndex={selectedCategory === 'all' ? 0 : -1}
                aria-selected={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
                onKeyDown={(e) => handleTabKeyDown(e, 0)}
                className={`px-3.5 py-2 rounded-[6px] text-xs font-semibold transition-all min-h-[44px] flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] ${
                  selectedCategory === 'all'
                    ? 'bg-[var(--color-plum-primary)] text-white shadow-2xs'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-fg-muted)] hover:bg-[var(--color-border-subtle)]'
                }`}
              >
                <span>Tất cả bài viết</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {categoryCounts['all']}
                </span>
              </button>

              {MOCK_ARTICLE_CATEGORIES.map((cat, idx) => {
                const isSelected = selectedCategory === cat.id
                const tabIndexPosition = idx + 1
                return (
                  <button
                    key={cat.id}
                    ref={(el) => {
                      tabRefs.current[tabIndexPosition] = el
                    }}
                    id={`article-tab-${cat.id}`}
                    type="button"
                    role="tab"
                    tabIndex={isSelected ? 0 : -1}
                    aria-selected={isSelected}
                    onClick={() => setSelectedCategory(cat.id)}
                    onKeyDown={(e) => handleTabKeyDown(e, tabIndexPosition)}
                    className={`px-3.5 py-2 rounded-[6px] text-xs font-semibold transition-all min-h-[44px] flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] ${
                      isSelected
                        ? 'bg-[var(--color-plum-primary)] text-white shadow-2xs'
                        : 'bg-[var(--color-bg-secondary)] text-[var(--color-fg-muted)] hover:bg-[var(--color-border-subtle)]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {categoryCounts[cat.id] ?? 0}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Articles Grid or Empty State */}
          {filteredArticles.length === 0 ? (
            <div className="p-10 sm:p-16 rounded-[12px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] text-center max-w-xl mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-[var(--color-plum-primary)] flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--color-plum-deep)] mb-2">
                Không tìm thấy bài viết phù hợp
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] mb-6">
                Không có bài viết nào khớp với từ khóa tìm kiếm hoặc nhóm danh mục của bạn. Vui lòng thử lại với từ khóa khác.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-[var(--color-plum-primary)] text-white text-xs font-semibold hover:bg-[var(--color-plum-deep)] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
              >
                <span>Xem tất cả bài viết</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredArticles.map((art) => (
                <article
                  key={art.id}
                  className="rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xs transition-shadow"
                >
                  <div>
                    <div className="relative aspect-[16/10] bg-[var(--color-bg-secondary)] overflow-hidden">
                      <img
                        src={art.image}
                        alt={art.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-[4px] bg-white/90 text-[var(--color-plum-primary)] text-[10px] font-semibold">
                        Ảnh minh họa
                      </span>
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded-[4px] bg-purple-900/90 text-white text-[10px] font-semibold">
                          {art.categoryName}
                        </span>
                        <span className="px-2 py-0.5 rounded-[4px] bg-white/95 text-[var(--color-plum-primary)] text-[10px] font-bold">
                          {art.targetPet}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-[var(--color-fg-subtle)] mb-2">
                        <span>{art.readTime}</span>
                        <span>{art.publishedDate}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-serif font-bold text-[var(--color-plum-deep)] mb-2.5 leading-snug line-clamp-2">
                        {art.title}
                      </h3>

                      <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed line-clamp-3 mb-4">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 pt-0 border-t border-[var(--color-border-subtle)]/60 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-[var(--color-warm-orange-dark)] font-semibold">
                      {art.badgeLabel.split('—')[0].trim()}
                    </span>

                    <Link
                      to={`/bai-viet/${art.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-plum-primary)] hover:text-[var(--color-plum-deep)] hover:underline min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] rounded-[4px]"
                    >
                      <span>Đọc bài</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Editorial Dark CTA */}
      <section className="py-12 sm:py-16 md:py-20" aria-label="Đặt lịch thăm khám">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditorialDarkCTA
            title="Đồng hành cùng sức khỏe thú cưng của bạn"
            subtitle="101 Khuất Duy Tiến, Thanh Xuân, Hà Nội • Khám 08:00 – 21:00 • Tiếp nhận cấp cứu 24/24"
          />
        </div>
      </section>
    </div>
  )
}

export default PetCornerPage
