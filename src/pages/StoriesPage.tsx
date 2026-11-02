import React, { useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  Search,
  X,
  ArrowRight,
  Clock,
  Calendar,
  Sparkles,
  CheckCircle2,
  BookOpen,
} from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import {
  MOCK_STORIES,
  MOCK_STORY_CATEGORIES,
  MOCK_STORIES_EDITORIAL_NOTICE,
} from '@/data/mockStoriesContent'
import { EditorialBreadcrumb } from '@/components/editorial/EditorialBreadcrumb'
import { EditorialPolicyBanner } from '@/components/editorial/EditorialPolicyBanner'
import { EditorialDarkCTA } from '@/components/editorial/EditorialDarkCTA'

export const StoriesPage: React.FC = () => {
  useRouteSeo({
    title: 'Hành trình điều trị tiêu biểu — Bệnh viện Thú y Lê Sơn',
    description:
      'Các câu chuyện phục hồi và hành trình phối hợp chăm sóc thú cưng minh họa tại Bệnh viện Thú y Lê Sơn (101 Khuất Duy Tiến). Xem quy trình tiếp nhận, theo dõi nội trú và tái khám.',
    isIndexable: false,
  })

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Featured story (ca-dieu-tri-01)
  const featuredStory = useMemo(() => {
    return MOCK_STORIES.find((s) => s.isFeatured) ?? MOCK_STORIES[0]
  }, [])

  // Filtered stories
  const filteredStories = useMemo(() => {
    let result = MOCK_STORIES

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.categoryId === selectedCategory)
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.petName.toLowerCase().includes(q) ||
          item.categoryName.toLowerCase().includes(q)
      )
    }

    return result
  }, [selectedCategory, searchQuery])

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MOCK_STORIES.length }
    for (const cat of MOCK_STORY_CATEGORIES) {
      counts[cat.id] = MOCK_STORIES.filter((s) => s.categoryId === cat.id).length
    }
    return counts
  }, [])

  // ARIA Tabs keyboard navigation & roving tabindex
  const tabCategoryList = useMemo(
    () => ['all', ...MOCK_STORY_CATEGORIES.map((c) => c.id)],
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
      {/* 1. Editorial Hero Section */}
      <section className="py-10 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <EditorialBreadcrumb
              currentPage="Câu chuyện điều trị"
              parentGroup="Về Lê Sơn"
              parentLink="/gioi-thieu"
            />
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5" />
              <span>Hành trình hồi phục</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
            <div className="lg:col-span-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-4 leading-tight">
                Hành trình điều trị tiêu biểu
              </h1>
              <p className="text-base sm:text-lg text-[var(--color-fg-muted)] leading-relaxed max-w-2xl mb-6">
                Những câu chuyện minh họa sinh động về sự kiên nhẫn, tình yêu thương và sự phối hợp ân cần giữa gia đình cùng đội ngũ y tế Bệnh viện Thú y Lê Sơn.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/dat-lich"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[6px] bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-medium text-xs sm:text-sm transition-colors shadow-2xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Đặt lịch thăm khám trực tuyến</span>
                </Link>
                <Link
                  to="/goc-thu-cung"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[6px] border border-[var(--color-border-medium)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-fg-primary)] font-medium text-xs sm:text-sm transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                >
                  <BookOpen className="w-4 h-4 text-[var(--color-plum-primary)]" />
                  <span>Khám phá Cẩm nang thú cưng</span>
                </Link>
              </div>
            </div>

            {/* Quick Editorial Note Card */}
            <div className="lg:col-span-4 p-5 sm:p-6 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)] block mb-2">
                Nguyên tắc chia sẻ câu chuyện:
              </span>
              <ul className="space-y-2.5 text-xs text-[var(--color-fg-muted)] leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                  <span>Mọi câu chuyện bệnh nhân thực tế đều phải có sự đồng thuận từ chủ nuôi trước khi đăng tải.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                  <span>Dữ liệu giai đoạn hiện tại là nội dung minh họa quy trình thăm khám và chăm sóc nội trú.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
                  <span>Bảo mật tuyệt đối y lệnh, liều lượng thuốc và thông tin nghiệp vụ nội bộ của phòng khám.</span>
                </li>
              </ul>
            </div>
          </div>

          <EditorialPolicyBanner
            label="Chính sách dữ liệu câu chuyện điều trị"
            title="Lưu ý về dữ liệu mẫu:"
            className="rounded-[8px] mb-0"
          >
            {MOCK_STORIES_EDITORIAL_NOTICE}
          </EditorialPolicyBanner>
        </div>
      </section>

      {/* 2. Featured Story Showcase */}
      {featuredStory && (
        <section
          className="py-12 sm:py-16 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/30"
          aria-labelledby="featured-story-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--color-plum-primary)]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)]">
                  Câu chuyện nổi bật
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-[4px] bg-amber-50 border border-amber-200 text-xs font-bold text-[var(--color-warm-orange-dark)]">
                {featuredStory.badgeLabel}
              </span>
            </div>

            <article className="rounded-[12px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
                <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[340px] bg-[var(--color-bg-secondary)] overflow-hidden">
                  <img
                    src={featuredStory.image}
                    alt={featuredStory.imageAlt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-[4px] bg-white/95 text-[var(--color-plum-primary)] text-xs font-bold shadow-xs">
                      {featuredStory.petName}
                    </span>
                    <span className="px-2.5 py-1 rounded-[4px] bg-purple-900/90 text-white text-xs font-semibold">
                      {featuredStory.categoryName}
                    </span>
                  </div>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-[4px] bg-white/90 text-[var(--color-plum-primary)] text-[11px] font-semibold">
                    Ảnh minh họa
                  </span>
                </div>

                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <h2
                      id="featured-story-heading"
                      className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[var(--color-plum-deep)] mb-3 leading-snug"
                    >
                      {featuredStory.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-6">
                      {featuredStory.summary}
                    </p>

                    <div className="p-4 rounded-[8px] bg-[var(--color-bg-secondary)]/60 border border-[var(--color-border-subtle)] mb-6 text-xs space-y-2">
                      <div>
                        <strong className="text-[var(--color-plum-deep)]">Biểu hiện ban đầu: </strong>
                        <span className="text-[var(--color-fg-muted)]">{featuredStory.overview.condition}</span>
                      </div>
                      <div>
                        <strong className="text-[var(--color-plum-deep)]">Hướng xử lý: </strong>
                        <span className="text-[var(--color-fg-muted)]">{featuredStory.overview.initialApproach}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
                    <span className="text-xs text-[var(--color-fg-subtle)] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Thông tin: {featuredStory.date}</span>
                    </span>

                    <Link
                      to={`/cau-chuyen/${featuredStory.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white text-xs sm:text-sm font-semibold transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                    >
                      <span>Đọc chi tiết hành trình này</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* 3. Stories Catalog & Filter Section */}
      <section
        className="py-12 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]"
        aria-labelledby="stories-catalog-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-[11px] font-bold uppercase tracking-wider mb-2.5">
                Danh sách câu chuyện điều trị minh họa
              </span>
              <h2
                id="stories-catalog-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight"
              >
                Hành trình phối hợp y tế &amp; Chăm sóc
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-md">
              Tìm kiếm hoặc lọc theo nhóm ca bệnh để tìm hiểu quy trình chăm sóc chuyên môn tại Bệnh viện Thú y Lê Sơn.
            </p>
          </div>

          {/* Search & Tabs Toolbar */}
          <div className="p-4 sm:p-5 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Search Bar (8 cols) */}
              <div className="md:col-span-8 relative">
                <label htmlFor="story-search-input" className="sr-only">
                  Tìm kiếm câu chuyện điều trị hoặc thú cưng
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[var(--color-fg-subtle)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="story-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo tên bé, biểu hiện hoặc ca bệnh (ví dụ: Milo, Corgi, X-quang, cấp cứu...)"
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
                  Hiển thị: <strong>{filteredStories.length}</strong> / {MOCK_STORIES.length} câu chuyện
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
              aria-label="Nhóm câu chuyện điều trị"
            >
              <button
                ref={(el) => {
                  tabRefs.current[0] = el
                }}
                id="story-tab-all"
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
                <span>Tất cả câu chuyện</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {categoryCounts['all']}
                </span>
              </button>

              {MOCK_STORY_CATEGORIES.map((cat, idx) => {
                const isSelected = selectedCategory === cat.id
                const tabIndexPosition = idx + 1
                return (
                  <button
                    key={cat.id}
                    ref={(el) => {
                      tabRefs.current[tabIndexPosition] = el
                    }}
                    id={`story-tab-${cat.id}`}
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

          {/* Stories Grid or Empty State */}
          {filteredStories.length === 0 ? (
            <div className="p-10 sm:p-16 rounded-[12px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] text-center max-w-xl mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-[var(--color-plum-primary)] flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--color-plum-deep)] mb-2">
                Không tìm thấy câu chuyện phù hợp
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] mb-6">
                Không có câu chuyện nào khớp với từ khóa hoặc nhóm ca bệnh bạn đã chọn. Vui lòng thử tìm với từ khóa khác.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-[var(--color-plum-primary)] text-white text-xs font-semibold hover:bg-[var(--color-plum-deep)] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
              >
                <span>Xem tất cả câu chuyện</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredStories.map((story) => (
                <article
                  key={story.id}
                  className="rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xs transition-shadow"
                >
                  <div>
                    <div className="relative aspect-[16/10] bg-[var(--color-bg-secondary)] overflow-hidden">
                      <img
                        src={story.image}
                        alt={story.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-[4px] bg-white/90 text-[var(--color-plum-primary)] text-[10px] font-semibold">
                        Ảnh minh họa
                      </span>
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded-[4px] bg-purple-900/90 text-white text-[10px] font-semibold">
                          {story.categoryName}
                        </span>
                        <span className="px-2 py-0.5 rounded-[4px] bg-white/95 text-[var(--color-plum-primary)] text-[10px] font-bold">
                          {story.targetPet}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-[var(--color-fg-subtle)] mb-2">
                        <span>{story.petName}</span>
                        <span>{story.date}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-serif font-bold text-[var(--color-plum-deep)] mb-2.5 leading-snug line-clamp-2">
                        {story.title}
                      </h3>

                      <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed line-clamp-3 mb-4">
                        {story.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 pt-0 border-t border-[var(--color-border-subtle)]/60 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-[var(--color-warm-orange-dark)] font-semibold">
                      {story.badgeLabel.split('—')[0].trim()}
                    </span>

                    <Link
                      to={`/cau-chuyen/${story.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-plum-primary)] hover:text-[var(--color-plum-deep)] hover:underline min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] rounded-[4px]"
                    >
                      <span>Chi tiết</span>
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
      <section className="py-12 sm:py-16 md:py-20" aria-label="Liên hệ và đặt hẹn">
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

export default StoriesPage
