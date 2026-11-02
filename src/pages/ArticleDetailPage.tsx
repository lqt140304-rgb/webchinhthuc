import React, { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  User,
} from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import {
  MOCK_ARTICLES,
  MOCK_PET_CORNER_EDITORIAL_NOTICE,
} from '@/data/mockPetCornerContent'
import { EditorialBreadcrumb } from '@/components/editorial/EditorialBreadcrumb'
import { EditorialPolicyBanner } from '@/components/editorial/EditorialPolicyBanner'
import { EditorialDarkCTA } from '@/components/editorial/EditorialDarkCTA'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  const article = useMemo(() => {
    return MOCK_ARTICLES.find((a) => a.slug === slug)
  }, [slug])

  // Related articles
  const relatedArticles = useMemo(() => {
    if (!article) return []
    return MOCK_ARTICLES.filter((a) => article.relatedSlugs.includes(a.slug) && a.slug !== article.slug).slice(0, 2)
  }, [article])

  useRouteSeo({
    title: article
      ? `${article.title} — Cẩm nang thú cưng — Bệnh viện Thú y Lê Sơn`
      : '404 — Không tìm thấy trang | Bệnh viện Thú y Lê Sơn',
    description: article?.excerpt || 'Không tìm thấy bài viết cẩm nang yêu cầu.',
    isIndexable: false,
  })

  // If slug is invalid, render NotFoundPage immediately (Requirement C: HTTP 404 behavior, no empty page)
  if (!article) {
    return <NotFoundPage />
  }

  return (
    <article className="w-full bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)]">
      {/* 1. Header & Breadcrumb */}
      <section className="py-8 sm:py-12 md:py-16 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <EditorialBreadcrumb
              currentPage={article.categoryName}
              parentGroup="Góc thú cưng"
              parentLink="/goc-thu-cung"
            />
            <Link
              to="/goc-thu-cung"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-plum-primary)] font-semibold hover:underline min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] rounded-[4px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Tất cả bài viết</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-xs font-bold uppercase tracking-wider">
              {article.categoryName}
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-amber-50 border border-amber-200 text-xs font-bold text-[var(--color-warm-orange-dark)]">
              {article.targetPet}
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-amber-50 border border-amber-200 text-xs font-bold text-[var(--color-warm-orange-dark)]">
              Nội dung minh họa cẩm nang kiến thức — không thay thế chỉ định trực tiếp từ Bác sĩ Thú y
            </span>
            <span className="text-xs text-[var(--color-fg-subtle)] flex items-center gap-1 ml-auto">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
              <span className="mx-1">•</span>
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.publishedDate}</span>
            </span>
          </div>

          <h1
            aria-label={`Chi tiết bài viết cẩm nang: ${article.title}`}
            className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-4 leading-snug"
          >
            <span className="block text-xs tracking-wider text-[var(--color-plum-primary)] font-bold mb-2">
              Chi tiết bài viết cẩm nang
            </span>
            {' '}
            <span>{article.title}</span>
          </h1>

          <div className="flex items-center gap-2 text-xs text-[var(--color-fg-muted)] mb-6">
            <User className="w-3.5 h-3.5 text-[var(--color-plum-primary)]" />
            <span>Tài liệu: {article.author}</span>
          </div>

          <p className="text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed mb-6 font-normal">
            {article.excerpt}
          </p>

          <EditorialPolicyBanner
            label="Chính sách dữ liệu cẩm nang bài viết"
            title="Lưu ý minh họa:"
            className="rounded-[8px] mb-0"
          >
            {MOCK_PET_CORNER_EDITORIAL_NOTICE}
          </EditorialPolicyBanner>
        </div>
      </section>

      {/* 2. Hero Image, Table of Contents & Article Content */}
      <section className="py-10 sm:py-14 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Visual */}
          <div className="relative aspect-[16/9] rounded-[12px] overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] shadow-xs mb-8">
            <img
              src={article.image}
              alt={article.imageAlt}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-[4px] bg-white/95 text-[var(--color-plum-primary)] text-xs font-semibold shadow-xs">
              Ảnh minh họa
            </span>
          </div>

          {/* Quick Table of Contents Box */}
          {article.tableOfContents.length > 0 && (
            <nav
              aria-label="Mục lục bài viết"
              className="p-5 sm:p-6 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs mb-10"
            >
              <div className="flex items-center gap-2 mb-3 text-[var(--color-plum-primary)]">
                <BookOpen className="w-4 h-4" />
                <h2 className="font-serif font-bold text-sm sm:text-base text-[var(--color-plum-deep)]">
                  Mục lục bài viết
                </h2>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm">
                {article.tableOfContents.map((toc, idx) => (
                  <li key={idx}>
                    <a
                      href={`#${toc.id}`}
                      className="text-[var(--color-plum-primary)] hover:underline inline-flex items-center gap-1.5 min-h-[44px]"
                    >
                      <span className="text-[var(--color-border-medium)] select-none">§</span>
                      <span>{toc.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Article Content Sections */}
          <div className="space-y-10 mb-12">
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 space-y-3.5">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight">
                  {section.heading}
                </h2>

                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                    {p}
                  </p>
                ))}

                {section.tipBox && (
                  <div className="p-4 sm:p-5 rounded-[8px] bg-amber-50/80 border border-amber-200/80 text-xs text-slate-700 my-4">
                    <strong className="font-bold text-[var(--color-warm-orange-dark)] block mb-1">
                      {section.tipBox.title}
                    </strong>
                    <p className="leading-relaxed">
                      {section.tipBox.content}
                    </p>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 sm:py-16 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-plum-deep)] mb-6">
              Các bài viết cẩm nang liên quan
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <article
                  key={rel.id}
                  className="rounded-[8px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5">
                    <span className="text-[11px] font-bold text-[var(--color-plum-primary)] uppercase tracking-wider block mb-1">
                      {rel.categoryName} • {rel.readTime}
                    </span>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-[var(--color-plum-deep)] mb-2 line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-[var(--color-fg-muted)] line-clamp-2 leading-relaxed">
                      {rel.excerpt}
                    </p>
                  </div>

                  <div className="p-5 pt-0 border-t border-[var(--color-border-subtle)]/60 flex items-center justify-between">
                    <span className="text-[11px] text-[var(--color-fg-subtle)]">
                      {rel.publishedDate}
                    </span>
                    <Link
                      to={`/bai-viet/${rel.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-plum-primary)] hover:underline min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] rounded-[4px]"
                    >
                      <span>Đọc bài viết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Editorial Dark CTA */}
      <section className="py-12 sm:py-16" aria-label="Đặt lịch hẹn khám">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditorialDarkCTA
            title="Đồng hành cùng sức khỏe thú cưng của bạn"
            subtitle="101 Khuất Duy Tiến, Thanh Xuân, Hà Nội • Khám 08:00 – 21:00 • Tiếp nhận cấp cứu 24/24"
          />
        </div>
      </section>
    </article>
  )
}

export default ArticleDetailPage
