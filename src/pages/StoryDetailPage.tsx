import React, { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import {
  MOCK_STORIES,
  MOCK_STORIES_EDITORIAL_NOTICE,
} from '@/data/mockStoriesContent'
import { EditorialBreadcrumb } from '@/components/editorial/EditorialBreadcrumb'
import { EditorialPolicyBanner } from '@/components/editorial/EditorialPolicyBanner'
import { EditorialDarkCTA } from '@/components/editorial/EditorialDarkCTA'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const StoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  const story = useMemo(() => {
    return MOCK_STORIES.find((s) => s.slug === slug)
  }, [slug])

  // Related stories
  const relatedStories = useMemo(() => {
    if (!story) return []
    return MOCK_STORIES.filter((s) => story.relatedSlugs.includes(s.slug) && s.slug !== story.slug).slice(0, 2)
  }, [story])

  useRouteSeo({
    title: story ? `${story.title} — Bệnh viện Thú y Lê Sơn` : 'Không tìm thấy trang yêu cầu — Bệnh viện Thú y Lê Sơn',
    description: story?.summary || 'Không tìm thấy câu chuyện điều trị yêu cầu.',
    isIndexable: false,
  })

  // If slug is invalid, render NotFoundPage immediately (Requirement C: HTTP 404 behavior, no empty page)
  if (!story) {
    return <NotFoundPage />
  }

  return (
    <article className="w-full bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)]">
      {/* 1. Header & Breadcrumb */}
      <section className="py-8 sm:py-12 md:py-16 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <EditorialBreadcrumb
              currentPage={story.petName}
              parentGroup="Câu chuyện điều trị"
              parentLink="/cau-chuyen"
            />
            <Link
              to="/cau-chuyen"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-plum-primary)] font-semibold hover:underline min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] rounded-[4px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Tất cả câu chuyện</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-[4px] bg-purple-100 text-[var(--color-plum-primary)] text-xs font-bold uppercase tracking-wider">
              {story.categoryName}
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-amber-50 border border-amber-200 text-xs font-bold text-[var(--color-warm-orange-dark)]">
              {story.targetPet}
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-amber-50 border border-amber-200 text-xs font-bold text-[var(--color-warm-orange-dark)]">
              Câu chuyện minh họa — không phải hồ sơ điều trị thực tế
            </span>
            <span className="text-xs text-[var(--color-fg-subtle)] flex items-center gap-1 ml-auto">
              <Calendar className="w-3.5 h-3.5" />
              <span>Ghi nhận: {story.date}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight mb-4 leading-snug">
            <span className="block text-xs tracking-wider text-[var(--color-plum-primary)] font-bold mb-2">
              Chi tiết câu chuyện điều trị
            </span>
            <span>{story.title}</span>
          </h1>

          <p className="text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed mb-6">
            {story.summary}
          </p>

          <EditorialPolicyBanner
            label="Chính sách dữ liệu ca bệnh minh họa"
            title="Lưu ý minh họa:"
            className="rounded-[8px] mb-0"
          >
            {MOCK_STORIES_EDITORIAL_NOTICE}
          </EditorialPolicyBanner>
        </div>
      </section>

      {/* 2. Hero Image & Case Overview */}
      <section className="py-10 sm:py-14 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Visual */}
          <div className="relative aspect-[16/9] rounded-[12px] overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] shadow-xs mb-8">
            <img
              src={story.image}
              alt={story.imageAlt}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-[4px] bg-white/95 text-[var(--color-plum-primary)] text-xs font-bold shadow-xs">
              {story.petName}
            </div>
            <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-[4px] bg-white/95 text-[var(--color-plum-primary)] text-xs font-semibold shadow-xs">
              Ảnh minh họa
            </span>
          </div>

          {/* Structured Clinical Overview Box */}
          <div className="p-6 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs mb-10">
            <div className="flex items-center gap-2 mb-4 text-[var(--color-plum-primary)]">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="font-serif font-bold text-base text-[var(--color-plum-deep)]">
                Tóm tắt quy trình tiếp nhận &amp; Hỗ trợ y tế
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-[6px] bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border-subtle)]">
                <span className="font-bold text-[var(--color-plum-deep)] block mb-1">
                  1. Biểu hiện ban đầu:
                </span>
                <p className="text-[var(--color-fg-muted)] leading-relaxed">
                  {story.overview.condition}
                </p>
              </div>

              <div className="p-3.5 rounded-[6px] bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border-subtle)]">
                <span className="font-bold text-[var(--color-plum-deep)] block mb-1">
                  2. Hướng tiếp cận ban đầu:
                </span>
                <p className="text-[var(--color-fg-muted)] leading-relaxed">
                  {story.overview.initialApproach}
                </p>
              </div>

              <div className="p-3.5 rounded-[6px] bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border-subtle)]">
                <span className="font-bold text-[var(--color-plum-deep)] block mb-1">
                  3. Chăm sóc nổi bật:
                </span>
                <p className="text-[var(--color-fg-muted)] leading-relaxed">
                  {story.overview.careHighlights}
                </p>
              </div>
            </div>
          </div>

          {/* Story Narrative Sections */}
          <div className="prose prose-plum max-w-none space-y-8 mb-12">
            {story.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight">
                  {section.heading}
                </h3>
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Timeline Milestones */}
          <div className="p-6 rounded-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs mb-12">
            <h3 className="font-serif font-bold text-base text-[var(--color-plum-deep)] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--color-plum-primary)]" />
              <span>Tiến trình các giai đoạn chăm sóc tại cơ sở</span>
            </h3>

            <div className="space-y-4">
              {story.timeline.map((step, sIdx) => (
                <div key={sIdx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-[var(--color-plum-primary)] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--color-plum-deep)]">
                      {step.phaseTitle}
                    </h4>
                    <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Related Stories */}
      {relatedStories.length > 0 && (
        <section className="py-12 sm:py-16 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-plum-deep)] mb-6">
              Các câu chuyện điều trị khác
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedStories.map((rel) => (
                <article
                  key={rel.id}
                  className="rounded-[8px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xs overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5">
                    <span className="text-[11px] font-bold text-[var(--color-plum-primary)] uppercase tracking-wider block mb-1">
                      {rel.categoryName} • {rel.petName}
                    </span>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-[var(--color-plum-deep)] mb-2 line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-[var(--color-fg-muted)] line-clamp-2 leading-relaxed">
                      {rel.summary}
                    </p>
                  </div>

                  <div className="p-5 pt-0 border-t border-[var(--color-border-subtle)]/60 flex items-center justify-between">
                    <span className="text-[11px] text-[var(--color-fg-subtle)]">
                      {rel.date}
                    </span>
                    <Link
                      to={`/cau-chuyen/${rel.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-plum-primary)] hover:underline min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] rounded-[4px]"
                    >
                      <span>Xem hành trình</span>
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
      <section className="py-12 sm:py-16" aria-label="Đặt lịch thăm khám">
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

export default StoryDetailPage
