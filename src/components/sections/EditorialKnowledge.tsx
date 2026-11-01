import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight, Clock, AlertCircle } from 'lucide-react'
import { MOCK_KNOWLEDGE_ARTICLES, MOCK_KNOWLEDGE_EDITORIAL_NOTICE } from '@/data/mockPublicContent'
import styles from './EditorialKnowledge.module.css'

export const EditorialKnowledge: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[var(--color-bg-primary)]" id="goc-kien-thuc">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2 block">
              Góc Thú Cưng & Cẩm Nang Y Khoa
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-tight">
              Kiến thức chăm sóc chuẩn xác từ chuyên gia
            </h2>
            <p className="mt-3 text-base text-[var(--color-fg-muted)] leading-relaxed font-sans">
              Cập nhật thông tin y học thường thức, chế độ dinh dưỡng và kỹ năng chăm sóc giúp bé cưng luôn khỏe mạnh, vui tươi.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/goc-thu-cung"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--color-border-medium)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-plum-deep)] text-sm font-semibold transition-all group"
            >
              <BookOpen className="w-4 h-4 text-[var(--color-plum-primary)]" />
              <span>Xem tất cả bài viết</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Notice: Bản mẫu biên tập - tự động hiển thị nếu có bài viết là mock */}
        {MOCK_KNOWLEDGE_ARTICLES.some((art) => art.isMock) && (
          <div className="mb-8 p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80 flex items-center gap-2.5 text-xs text-[var(--color-plum-deep)]">
            <AlertCircle className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0" />
            <span>
              <strong>Lưu ý biên tập:</strong> {MOCK_KNOWLEDGE_EDITORIAL_NOTICE}
            </span>
          </div>
        )}

        {/* 3 Editorial Magazine Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_KNOWLEDGE_ARTICLES.map((art) => (
            <article key={art.id} className={styles.articleCard}>
              <div className={styles.imageWrapper}>
                <img
                  src={art.image}
                  alt={`${art.title} (Hình ảnh minh họa)`}
                  width={800}
                  height={533}
                  loading="lazy"
                  decoding="async"
                  className={styles.articleImage}
                />
                <span className={styles.categoryBadge}>{art.category}</span>
                {art.isMock && (
                  <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md text-xs font-medium bg-black/75 text-white shadow-xs backdrop-blur-xs">
                    {art.imageBadgeLabel || 'Ảnh minh họa'}
                  </span>
                )}
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-fg-subtle)] mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readTime}</span>
                    {art.isMock && (
                      <>
                        <span>&bull;</span>
                        <span className="italic">{art.referenceLabel || 'Bài viết mẫu'}</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)] mb-3 leading-snug line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed mb-6 font-sans line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <Link
                  to={`/bai-viet/${art.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)] hover:text-[var(--color-plum-deep)] transition-colors group pt-2 border-t border-[var(--color-border-subtle)]"
                >
                  <span>Xem chi tiết chuyên đề</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

