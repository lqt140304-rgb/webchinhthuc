import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import styles from './HighlightStory.module.css'

export const HighlightStory: React.FC = () => {
  return (
    <section className={styles.storySection} id="cau-chuyen-noi-bat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 md:mb-16" data-reveal="up">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2.5 block">
            03 &mdash; Hồ Sơ Hồi Phục Lâm Sàng
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-tight">
            Khi tình yêu thương và y học cùng lên tiếng
          </h2>

          <p className="mt-3 text-base sm:text-lg text-[var(--color-fg-muted)] leading-relaxed font-sans">
            Mỗi ca bệnh hồi phục là một hành trình gắn kết kiên trì giữa gia đình chủ nuôi và đội ngũ bác sĩ điều trị.
          </p>
        </div>

        {/* 1 Highlight Story Card (Visual Storytelling) */}
        <div className={styles.storyCard} data-reveal="scale">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Large Photo */}
            <div className="lg:col-span-5 relative border-b lg:border-b-0 lg:border-r border-[var(--color-border-subtle)]">
              <div className={styles.imageFrame}>
                <img
                  src="/images/story-recovery.webp"
                  alt="Chú cún tươi vui, phục hồi sức sống sau ca điều trị (Hình ảnh minh họa)"
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-103"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1.5 rounded-lg bg-white/94 backdrop-blur-md text-[var(--color-plum-deep)] text-[11px] font-semibold uppercase tracking-wider border border-[var(--color-border-subtle)] inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    Hồ sơ ca bệnh mẫu
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Story details with clinical timeline */}
            <div className="lg:col-span-7 p-7 sm:p-10 md:p-12 flex flex-col justify-between">
              <div>
                {/* Clear Illustrated / Sample Tag (Strict Requirement) */}
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] text-[var(--color-fg-secondary)] text-xs font-medium mb-6">
                  <AlertCircle className="w-3.5 h-3.5 text-[var(--color-plum-primary)] shrink-0" />
                  <span>Nội dung minh họa quy trình điều trị — Chưa xuất bản ca bệnh thực tế khi chưa có xác nhận từ chủ nuôi</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-fg-subtle)] mb-2.5 font-medium">
                  <span className="px-2.5 py-0.5 rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-plum-primary)] border border-[var(--color-border-subtle)] font-semibold">
                    Bệnh nhân: Milo (Corgi, 2 tuổi)
                  </span>
                  <span>&bull;</span>
                  <span>Chẩn đoán: Viêm dạ dày ruột cấp & Mất nước nặng</span>
                </div>

                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[var(--color-plum-deep)] mb-3 leading-snug">
                  72 giờ vượt qua cơn nguy kịch của bé Milo
                </h3>

                <p className="text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed mb-5 font-sans">
                  Tiếp nhận trong tình trạng kiệt sức và mất nước nghiêm trọng, Milo được đội ngũ trực cấp cứu nhanh chóng can thiệp hồi sức dịch truyền, kiểm soát nôn và theo dõi sát sao chỉ số sinh tồn suốt đêm. Bằng sự cẩn trọng và phác đồ cá thể hóa, bé đã tự ăn trở lại vào ngày thứ 3.
                </p>

                {/* Pull Quote Highlight */}
                <div className="pl-4 py-2 border-l-2 border-[var(--color-plum-primary)] bg-[var(--color-bg-primary)]/60 rounded-r-lg text-xs sm:text-sm text-[var(--color-plum-deep)] font-serif font-medium leading-relaxed mb-6">
                  “Mỗi ca bệnh hồi phục không chỉ là thành công y khoa, mà là sự trở về trọn vẹn của một thành viên gia đình.”
                </div>

                {/* 3 Steps Timeline (No internal drug doses/orders) */}
                <div className="space-y-4 mb-8">
                  <div className={styles.timelineStep}>
                    <div className={styles.timelineDot} />
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)]">
                      Giai đoạn 1: Tiếp nhận cấp cứu & Cân bằng sinh tồn
                    </p>
                    <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">
                      Xét nghiệm khẩn, bù dịch điện giải và ổn định thân nhiệt tức thì.
                    </p>
                  </div>

                  <div className={styles.timelineStep}>
                    <div className={styles.timelineDot} />
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)]">
                      Giai đoạn 2: Theo dõi nội trú & Cập nhật tình hình
                    </p>
                    <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">
                      Chăm sóc tại phòng lưu trú chuyên biệt, thông báo tiến triển sức khỏe định kỳ cho gia đình.
                    </p>
                  </div>

                  <div className={styles.timelineStep}>
                    <div className={styles.timelineDot} style={{ backgroundColor: 'var(--color-status-success-text)' }} />
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Giai đoạn 3: Phục hồi hoàn toàn & Xuất viện
                    </p>
                    <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">
                      Chỉ số men gan và tiêu hóa trở về mức an toàn, bé vui vẻ trở về nhà cùng hướng dẫn chăm sóc tại gia.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/cau-chuyen"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs group"
                >
                  <span>Đọc toàn bộ câu chuyện</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <span className="text-xs text-[var(--color-fg-subtle)]">
                  * Hình ảnh & tóm tắt quá trình phục hồi lâm sàng
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
