import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { MOCK_HIGHLIGHT_STORY } from '@/data/mockPublicContent'
import styles from './HighlightStory.module.css'

export const HighlightStory: React.FC = () => {
  const story = MOCK_HIGHLIGHT_STORY

  return (
    <section className={styles.storySection} id="cau-chuyen-noi-bat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/70 border border-purple-200 text-[var(--color-plum-primary)] text-xs font-semibold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Hành Trình Hồi Phục</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-tight">
            Khi tình yêu thương và y học cùng lên tiếng
          </h2>

          <p className="mt-3 text-base sm:text-lg text-[var(--color-fg-muted)] leading-relaxed font-sans">
            Mỗi ca bệnh hồi phục là một hành trình gắn kết kiên trì giữa gia đình chủ nuôi và đội ngũ bác sĩ điều trị.
          </p>
        </div>

        {/* 1 Highlight Story Card (Visual Storytelling) */}
        <div className={styles.storyCard}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Large Photo */}
            <div className="lg:col-span-5 relative">
              <div className={styles.imageFrame}>
                <img
                  src={story.image}
                  alt={story.imageAlt}
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                {story.isMock && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[var(--color-plum-deep)] text-xs font-bold border border-slate-200 shadow-xs">
                      {story.badgeLabel || 'Câu chuyện minh họa'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Story details with clinical timeline */}
            <div className="lg:col-span-7 p-8 sm:p-10 md:p-12 flex flex-col justify-between">
              <div>
                {/* Clear Illustrated / Sample Tag (Strict Requirement - rendered when isMock is true) */}
                {story.isMock && story.editorialNotice && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium mb-5">
                    <AlertCircle className="w-3.5 h-3.5 text-[var(--color-warm-orange-dark)] shrink-0" />
                    <span>{story.editorialNotice}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs text-[var(--color-fg-subtle)] mb-2 font-medium">
                  <span>{story.petMeta}</span>
                  <span>&bull;</span>
                  <span>{story.diagnosisSummary}</span>
                </div>

                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[var(--color-plum-deep)] mb-4 leading-snug">
                  {story.title}
                </h3>

                <p className="text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed mb-6 font-sans">
                  {story.summary}
                </p>

                {/* 3 Steps Timeline (No internal drug doses/orders) */}
                <div className="space-y-4 mb-8">
                  {story.timeline.map((step, idx) => (
                    <div key={idx} className={styles.timelineStep}>
                      <div
                        className={styles.timelineDot}
                        style={
                          step.isSuccess
                            ? { backgroundColor: 'var(--color-status-success-text)' }
                            : undefined
                        }
                      />
                      <p
                        className={
                          step.isSuccess
                            ? 'text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5'
                            : 'text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)]'
                        }
                      >
                        {step.isSuccess && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {step.stepTitle}
                      </p>
                      <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">
                        {step.stepDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/cau-chuyen"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm group"
                >
                  <span>Đọc toàn bộ câu chuyện</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                {story.isMock && story.footnote && (
                  <span className="text-xs text-[var(--color-fg-subtle)] italic">
                    {story.footnote}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

