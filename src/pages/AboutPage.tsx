import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Phone, ArrowRight } from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import { EditorialBreadcrumb } from '@/components/editorial/EditorialBreadcrumb'
import { EditorialSlotBox } from '@/components/editorial/EditorialSlotBox'
import { EditorialTriptych } from '@/components/editorial/EditorialTriptych'
import { EditorialPhotoFrame } from '@/components/editorial/EditorialPhotoFrame'
import { EditorialDarkCTA } from '@/components/editorial/EditorialDarkCTA'

export const AboutPage: React.FC = () => {
  useRouteSeo({
    title: 'Về Bệnh viện Thú y Lê Sơn — Chăm Sóc Y Tế Chuẩn Mực',
    description:
      'Giới thiệu về Bệnh viện Thú y Lê Sơn tại 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội. Nơi sự cẩn trọng y khoa song hành cùng lòng thấu cảm.',
    isIndexable: false,
  })

  return (
    <div className="w-full bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)]">
      {/* SECTION 1.1: EDITORIAL HERO */}
      <section className="py-10 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditorialBreadcrumb currentPage="Giới thiệu bệnh viện" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left 7 cols */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2.5 block">
                Về Bệnh viện Thú y Lê Sơn
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-tight mb-5">
                Nơi sự cẩn trọng y khoa song hành cùng lòng thấu cảm.
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-[var(--color-fg-muted)] leading-relaxed mb-8 max-w-2xl">
                Tại 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội, Bệnh viện Thú y Lê Sơn hướng tới việc xây dựng một điểm tựa y tế đáng tin cậy cho chủ nuôi — nơi mỗi bé cưng được thăm khám kỹ lưỡng, giải thích rõ ràng và chăm sóc bằng sự tôn trọng sự sống.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/dat-lich"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] min-h-[44px]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Đặt lịch khám</span>
                </Link>
                <a
                  href="tel:0973555105"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] min-h-[44px]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Gọi Hotline: 097 355 51 05</span>
                </a>
              </div>
            </div>

            {/* Right 5 cols */}
            <div className="lg:col-span-5">
              <EditorialPhotoFrame
                src="/images/article-prevention.webp"
                alt="Thú cưng nghỉ ngơi trong không gian ấm áp (ảnh minh họa)"
                aspectRatio="4/5"
                label="Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn"
              />
            </div>
          </div>

          {/* Meta Strip */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-[var(--color-border-subtle)] grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-plum-primary)] block mb-1">
                01 • Địa chỉ cơ sở
              </span>
              <span className="text-sm font-semibold text-[var(--color-fg-primary)]">
                101 Khuất Duy Tiến, Thanh Xuân, Hà Nội
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-plum-primary)] block mb-1">
                02 • Khung giờ khám tham chiếu
              </span>
              <span className="text-sm font-semibold text-[var(--color-fg-primary)]">
                08:00 – 21:00 (Tất cả các ngày)
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-warm-orange-dark)] block mb-1">
                03 • Trực cấp cứu
              </span>
              <span className="text-sm font-semibold text-[var(--color-fg-primary)]">
                Tiếp nhận cấp cứu 24/24 — 097 355 51 05
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1.2: CÂU CHUYỆN LÊ SƠN */}
      <section className="py-16 sm:py-20 bg-[var(--color-bg-card)] border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2.5 block">
                01 • Câu chuyện Lê Sơn
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] leading-snug border-l-4 border-[var(--color-plum-primary)] pl-4">
                “Mỗi bé cưng đến viện đều mang theo niềm thương yêu và sự gửi gắm của cả một gia đình.”
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-4">
              <p className="text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed">
                Khi thú cưng có biểu hiện bất thường, điều người nuôi cần nhất là sự lắng nghe kỹ lưỡng và những giải thích rõ ràng. Định hướng hoạt động tại Lê Sơn đặt trọng tâm vào việc quan sát lâm sàng cẩn trọng và đồng hành minh bạch cùng chủ nuôi trong suốt quá trình chăm sóc.
              </p>
              <EditorialSlotBox label="Thông tin lịch sử hình thành">
                Lịch sử hình thành và câu chuyện sáng lập của Bệnh viện Thú y Lê Sơn sẽ được cập nhật chính thức sau khi Chủ dự án xác nhận nội dung.
              </EditorialSlotBox>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1.3: GIÁ TRỊ VÀ TRIẾT LÝ CHĂM SÓC */}
      <section className="py-16 sm:py-20 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2 block">
              02 • Triết lý hoạt động
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight">
              Ba giá trị làm nên chuẩn mực chăm sóc tại Lê Sơn
            </h2>
          </div>

          <EditorialTriptych
            items={[
              {
                number: '01',
                title: 'Chuyên môn và trách nhiệm',
                description:
                  'Tiếp cận từng ca bệnh cẩn trọng, chẩn đoán dựa trên biểu hiện lâm sàng và các bước kiểm tra cần thiết; đặt sự an toàn của thú cưng làm trọng tâm.',
              },
              {
                number: '02',
                title: 'Tận tâm và lắng nghe',
                description:
                  'Lắng nghe kỹ lưỡng những thay đổi nhỏ trong thói quen sinh hoạt của bé do chủ nuôi chia sẻ; giao tiếp nhẹ nhàng, giảm bớt áp lực tâm lý cho cả bé và gia đình.',
              },
              {
                number: '03',
                title: 'Theo dõi và minh bạch',
                description:
                  'Giải thích rõ ràng tình trạng sức khỏe, hướng xử trí và chi phí dự kiến trước khi thực hiện; thông tin trung thực trong suốt quá trình theo dõi.',
              },
            ]}
          />
        </div>
      </section>

      {/* SECTION 1.4: QUAN ĐIỂM PHỤC VỤ & CHĂM SÓC THÚ CƯNG */}
      <section className="py-16 sm:py-20 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left 5 cols: Photo Frame */}
            <div className="lg:col-span-5">
              <EditorialPhotoFrame
                src="/images/article-nutrition.webp"
                alt="Chăm sóc dinh dưỡng cho thú cưng (ảnh minh họa)"
                aspectRatio="4/5"
                label="Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn"
              />
            </div>

            {/* Right 7 cols: Ledger */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[var(--color-warm-orange)]/10 text-[var(--color-warm-orange-dark)] border border-[var(--color-warm-orange)]/25">
                  Bản thảo đề xuất định hướng chăm sóc
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] mb-2 tracking-tight">
                Quan điểm phục vụ &amp; chăm sóc thú cưng
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] italic mb-4">
                Định hướng phục vụ được xây dựng với mục tiêu mang lại trải nghiệm êm dịu cho thú cưng và sự an tâm cho người nuôi.
              </p>

              <EditorialSlotBox label="ĐỀ XUẤT NỘI DUNG" className="mb-6">
                Bốn định hướng chăm sóc dưới đây là bản thảo đề xuất, đang chờ Chủ dự án xác nhận nguyên tắc vận hành thực tế.
              </EditorialSlotBox>

              <div className="space-y-4">
                {[
                  {
                    idx: 'I.',
                    title: '[Đề xuất 01] Tiếp nhận điềm tĩnh, thao tác nhẹ nhàng',
                    desc: '[Đề xuất định hướng]: Chú trọng hạn chế tiếng ồn và giảm bớt căng thẳng khi thú cưng mới đến phòng khám.',
                  },
                  {
                    idx: 'II.',
                    title: '[Đề xuất 02] Giải thích rõ ràng cho chủ nuôi',
                    desc: '[Đề xuất định hướng]: Trình bày tình trạng sức khỏe và trao đổi phương án chăm sóc để gia đình nắm rõ thông tin.',
                  },
                  {
                    idx: 'III.',
                    title: '[Đề xuất 03] Theo dõi chu đáo khi lưu trú nội trú',
                    desc: '[Đề xuất định hướng]: Khu vực lưu trú được duy trì ngăn nắp và cập nhật tình hình sức khỏe thường xuyên cho gia đình.',
                  },
                  {
                    idx: 'IV.',
                    title: '[Đề xuất 04] Tôn trọng và bảo mật thông tin',
                    desc: '[Đề xuất định hướng]: Thông tin bệnh án và hướng dẫn chăm sóc chỉ trao đổi trực tiếp với gia đình của bé.',
                  },
                ].map((item) => (
                  <div
                    key={item.idx}
                    className="p-4 sm:p-5 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] flex items-start gap-4"
                  >
                    <span className="font-serif font-bold text-base sm:text-lg text-[var(--color-plum-primary)] shrink-0 select-none">
                      {item.idx}
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--color-plum-deep)] mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1.5: ĐIỀU HƯỚNG LIÊN TRANG & CTA */}
      <section className="py-16 sm:py-20 bg-[var(--color-bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* Card Link to /doi-ngu */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)] block mb-1.5">
                  Khám phá nhân sự
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-plum-deep)] mb-2.5">
                  Đội ngũ Bác sĩ &amp; Nhân sự Chăm sóc
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-6">
                  Tìm hiểu cấu trúc các bộ phận chuyên môn và nguyên tắc phối hợp chăm sóc thú cưng tại Lê Sơn.
                </p>
              </div>
              <div>
                <Link
                  to="/doi-ngu"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--color-plum-primary)] text-[var(--color-plum-primary)] hover:bg-[var(--color-plum-primary)] hover:text-white font-semibold text-xs sm:text-sm transition-all min-h-[44px]"
                >
                  <span>Xem trang Đội ngũ</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card Link to /co-so-vat-chat */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-plum-primary)] block mb-1.5">
                  Không gian phòng khám
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-plum-deep)] mb-2.5">
                  Cơ sở vật chất &amp; Khu nội trú
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-6">
                  Tham quan quy hoạch các phân khu tiếp đón, thăm khám, chăm sóc nội trú 24/7 và Spa &amp; Grooming.
                </p>
              </div>
              <div>
                <Link
                  to="/co-so-vat-chat"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--color-plum-primary)] text-[var(--color-plum-primary)] hover:bg-[var(--color-plum-primary)] hover:text-white font-semibold text-xs sm:text-sm transition-all min-h-[44px]"
                >
                  <span>Xem Cơ sở vật chất</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <EditorialDarkCTA
            title="Chủ động đặt lịch hẹn cho bé cưng"
            subtitle="Đặt lịch trực tuyến hoặc liên hệ ngay khi cần hỗ trợ cấp cứu 24/24."
          />
        </div>
      </section>
    </div>
  )
}

export default AboutPage

