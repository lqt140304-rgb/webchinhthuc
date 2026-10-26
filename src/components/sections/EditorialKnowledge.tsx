import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight, Clock, AlertCircle } from 'lucide-react'
import styles from './EditorialKnowledge.module.css'

interface ArticleItem {
  id: string
  title: string
  category: 'Dinh dưỡng' | 'Phòng bệnh' | 'Chăm sóc'
  excerpt: string
  readTime: string
  image: string
  slug: string
}

const articles: ArticleItem[] = [
  {
    id: 'art-1',
    title: 'Xây dựng khẩu phần dinh dưỡng an toàn cho thú cưng theo từng lứa tuổi',
    category: 'Dinh dưỡng',
    excerpt: 'Hướng dẫn lựa chọn thành phần thức ăn, tỷ lệ đạm, khoáng chất phù hợp cho chó mèo con và giai đoạn trưởng thành.',
    readTime: '5 phút đọc',
    image: '/images/article-nutrition.webp',
    slug: 'dinh-duong-an-toan-cho-thu-cung',
  },
  {
    id: 'art-2',
    title: 'Những dấu hiệu cảnh báo bệnh đường hô hấp ở chó mèo khi thời tiết giao mùa',
    category: 'Phòng bệnh',
    excerpt: 'Nhận biết sớm triệu chứng hắt hơi, sốt nhẹ, chảy nước mũi và cách giữ ấm, phòng ngừa biến chứng viêm phổi nguy hiểm.',
    readTime: '4 phút đọc',
    image: '/images/article-prevention.webp',
    slug: 'phong-ngua-benh-duong-ho-hap',
  },
  {
    id: 'art-3',
    title: 'Các bước xử trí sơ cứu ban đầu tại nhà khi thú cưng có dấu hiệu hóc dị vật',
    category: 'Chăm sóc',
    excerpt: 'Kỹ năng giữ bình tĩnh, kiểm tra khoang miệng an toàn và liên hệ hỗ trợ cấp cứu y tế kịp thời.',
    readTime: '6 phút đọc',
    image: '/images/article-firstaid.webp',
    slug: 'xu-tri-so-cuu-hoc-di-vat',
  },
]

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

        {/* Notice: Bản mẫu biên tập */}
        <div className="mb-8 p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80 flex items-center gap-2.5 text-xs text-[var(--color-plum-deep)]">
          <AlertCircle className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0" />
          <span>
            <strong>Lưu ý biên tập:</strong> Các bài viết dưới đây là bản mẫu cấu trúc chuyên đề y khoa — Đang hoàn thiện thẩm định nội dung trước khi xuất bản chính thức.
          </span>
        </div>

        {/* 3 Editorial Magazine Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
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
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-white/90 backdrop-blur-xs">
                  Ảnh minh họa
                </span>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-fg-subtle)] mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readTime}</span>
                    <span>&bull;</span>
                    <span className="italic">Chuyên đề tham khảo</span>
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
