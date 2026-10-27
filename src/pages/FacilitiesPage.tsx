import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Phone, MapPin, Info } from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import { HOSPITAL_CONTACT } from '@/config/contact'
import { EditorialBreadcrumb } from '@/components/editorial/EditorialBreadcrumb'
import { EditorialPolicyBanner } from '@/components/editorial/EditorialPolicyBanner'
import { EditorialSlotBox } from '@/components/editorial/EditorialSlotBox'
import { EditorialPhotoFrame } from '@/components/editorial/EditorialPhotoFrame'

export const FacilitiesPage: React.FC = () => {
  useRouteSeo({
    title: 'Cơ sở vật chất & Không gian Thăm khám — Bệnh viện Thú y Lê Sơn',
    description:
      'Quy hoạch không gian tiếp đón, thăm khám, chăm sóc nội trú 24/7 và dịch vụ tại Bệnh viện Thú y Lê Sơn, 101 Khuất Duy Tiến, Hà Nội.',
    isIndexable: false,
  })

  return (
    <div className="w-full bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)]">
      {/* SECTION 3.1: FACILITIES HERO */}
      <section className="py-10 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditorialBreadcrumb currentPage="Cơ sở vật chất" />

          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2.5 block">
              Không gian thăm khám &amp; chăm sóc • 101 Khuất Duy Tiến
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-tight mb-5">
              Không gian thăm khám và quy hoạch các phân khu chức năng.
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-[var(--color-fg-muted)] leading-relaxed mb-6">
              Cơ sở Bệnh viện Thú y Lê Sơn tại 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội được quy hoạch phục vụ các hoạt động tiếp đón, khám &amp; điều trị, chăm sóc nội trú 24/7 và Spa &amp; Grooming.
            </p>
          </div>

          <EditorialPolicyBanner
            label="Chính sách ảnh minh họa và điều kiện phát hành"
            title="Chính sách ảnh minh họa (Bản thiết kế sơ bộ):"
          >
            Toàn bộ hình ảnh trong bản xem trước đều gắn nhãn trực tiếp <strong>“Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn”</strong>. Trang chỉ xuất bản chính thức sau khi cập nhật bộ ảnh chụp thực tế tại 101 Khuất Duy Tiến được Chủ dự án phê duyệt.
          </EditorialPolicyBanner>
        </div>
      </section>

      {/* SECTION 3.2: GALLERY KHÔNG GIAN BỆNH VIỆN (4 FRAMES) */}
      <section className="py-16 sm:py-20 bg-[var(--color-bg-card)] border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2 block">
              01 • Gallery không gian
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight">
              Quy hoạch các phân khu tại cơ sở
            </h2>
          </div>

          {/* 12-Column Responsive Layout for 4 Frames */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            {/* Frame 1: Span 7 cols */}
            <figure className="lg:col-span-7 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] overflow-hidden flex flex-col shadow-xs">
              <EditorialPhotoFrame
                src="/images/article-prevention.webp"
                alt="Không gian tiếp đón và chờ thăm khám (ảnh minh họa)"
                aspectRatio="16/10"
                label="Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn"
              />
              <figcaption className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)] mb-1.5">
                  Khu vực Tiếp đón &amp; Chờ thăm khám
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                  Không gian tiếp nhận thông tin và hướng dẫn ban đầu cho chủ nuôi cùng thú cưng tại cơ sở 101 Khuất Duy Tiến.
                </p>
              </figcaption>
            </figure>

            {/* Frame 2: Span 5 cols */}
            <figure className="lg:col-span-5 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] overflow-hidden flex flex-col shadow-xs">
              <EditorialPhotoFrame
                src="/images/article-nutrition.webp"
                alt="Khu vực thăm khám lâm sàng (ảnh minh họa)"
                aspectRatio="4/3"
                label="Ảnh minh họa — không phải cơ sở thực tế của Lê Sơn"
              />
              <figcaption className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)] mb-1.5">
                  Khu vực Thăm khám Lâm sàng
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                  Khu vực phục vụ công tác thăm khám tổng quát và kiểm tra sức khỏe ban đầu cho thú cưng.
                </p>
              </figcaption>
            </figure>

            {/* Frame 3: Span 6 cols */}
            <figure className="lg:col-span-6 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] overflow-hidden flex flex-col shadow-xs">
              <EditorialPhotoFrame
                isArchitecturalSvg
                title="Khu vực Chăm sóc Nội trú 24/7"
                subtitle="Khu vực lưu trú và theo dõi thú cưng"
                aspectRatio="16/10"
                label="Khung sơ đồ kiến trúc — Chờ ảnh thực tế"
              />
              <figcaption className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)] mb-1.5">
                  Khu vực Lưu trú &amp; Chăm sóc Nội trú 24/7
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                  Khu vực phục vụ nhu cầu lưu trú và chăm sóc thú cưng theo dịch vụ Nội trú 24/7 của bệnh viện.
                </p>
              </figcaption>
            </figure>

            {/* Frame 4: Span 6 cols */}
            <figure className="lg:col-span-6 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] overflow-hidden flex flex-col shadow-xs">
              <EditorialPhotoFrame
                isArchitecturalSvg
                title="Khu vực Vệ sinh, Spa & Grooming"
                subtitle="Khu vực tắm và chăm sóc vệ sinh lông móng"
                aspectRatio="16/10"
                label="Khung sơ đồ kiến trúc — Chờ ảnh thực tế"
              />
              <figcaption className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)] mb-1.5">
                  Khu vực Vệ sinh &amp; Dịch vụ Spa — Grooming
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                  Khu vực phục vụ các dịch vụ tắm, cắt tỉa và chăm sóc vệ sinh cho thú cưng.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* SECTION 3.3: KHU KHÁM VÀ ĐIỀU TRỊ */}
      <section className="py-16 sm:py-20 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2 block">
              02 • Khu khám và điều trị
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight">
              Tổ chức không gian thăm khám &amp; cận lâm sàng
            </h2>
          </div>

          <div className="space-y-4 max-w-4xl">
            {/* Item 01 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] flex items-start gap-4 sm:gap-6 shadow-xs">
              <span className="font-serif font-bold text-2xl sm:text-3xl text-[var(--color-plum-primary)]/35 select-none shrink-0">
                01
              </span>
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--color-plum-deep)] mb-1.5">
                  Khu vực Thăm khám Lâm sàng &amp; Tư vấn
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                  Phục vụ công tác tiếp nhận, kiểm tra thể trạng và trao đổi ban đầu cùng chủ nuôi.
                </p>
              </div>
            </div>

            {/* Item 02 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] flex items-start gap-4 sm:gap-6 shadow-xs">
              <span className="font-serif font-bold text-2xl sm:text-3xl text-[var(--color-plum-primary)]/35 select-none shrink-0">
                02
              </span>
              <div className="flex-1">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--color-plum-deep)] mb-2">
                  [Trang thiết bị cận lâm sàng — Chờ xác nhận]
                </h3>
                <EditorialSlotBox label="Thông tin trang thiết bị">
                  Danh mục thiết bị xét nghiệm và máy chẩn đoán hình ảnh sẽ được cập nhật cụ thể theo hồ sơ kỹ thuật được Chủ dự án duyệt trước khi công bố.
                </EditorialSlotBox>
              </div>
            </div>

            {/* Item 03 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] flex items-start gap-4 sm:gap-6 shadow-xs">
              <span className="font-serif font-bold text-2xl sm:text-3xl text-[var(--color-plum-primary)]/35 select-none shrink-0">
                03
              </span>
              <div className="flex-1">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--color-plum-deep)] mb-2">
                  [Phân khu chức năng — Chờ Chủ dự án xác nhận]
                </h3>
                <EditorialSlotBox label="Thông tin phân khu chức năng">
                  Sơ đồ phân khu chức năng thực tế sẽ được cập nhật chính xác theo khảo sát mặt bằng cơ sở tại 101 Khuất Duy Tiến.
                </EditorialSlotBox>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3.4: KHU NỘI TRÚ VÀ TRANG THIẾT BỊ CHĂM SÓC */}
      <section className="py-16 sm:py-20 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2 block">
              03 • Khu nội trú 24/7 &amp; Thiết bị chăm sóc
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight">
              Khu vực lưu trú và theo dõi thú cưng
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Box A */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)] mb-2">
                  Chăm sóc &amp; Lưu trú Nội trú 24/7
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-4">
                  Phục vụ các bé cần theo dõi sức khỏe hoặc chăm sóc lưu trú theo dịch vụ Nội trú 24/7 của bệnh viện.
                </p>
              </div>
              <EditorialSlotBox label="Quy chuẩn khu nội trú">
                Quy cách khu vực lưu chuồng và quy trình vệ sinh định kỳ sẽ được cập nhật theo cơ sở thực tế.
              </EditorialSlotBox>
            </div>

            {/* Box B */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)] mb-2">
                  [Trang thiết bị hỗ trợ chăm sóc — Chờ xác nhận]
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-4">
                  [Trang thiết bị và dụng cụ hỗ trợ chăm sóc nội trú thực tế tại 101 Khuất Duy Tiến — Chờ Chủ dự án xác nhận danh mục].
                </p>
              </div>
              <EditorialSlotBox label="Danh mục thiết bị hỗ trợ">
                Thông số trang thiết bị hỗ trợ chăm sóc nội trú sẽ được công bố sau khi kiểm định thực tế tại viện.
              </EditorialSlotBox>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3.5: HƯỚNG DẪN ĐẾN VIỆN & LIÊN HỆ */}
      <section className="py-16 sm:py-20 bg-[var(--color-bg-dark)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left 7 cols: Address & Actions */}
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-orchid-light)] mb-2.5 block">
                Chỉ đường &amp; Tiếp đón
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight mb-4">
                Đến thăm khám tại 101 Khuất Duy Tiến
              </h2>
              <div className="text-xs sm:text-sm text-[var(--color-plum-orchid-light)] leading-relaxed space-y-1.5 mb-8">
                <p>
                  Địa chỉ: <strong className="text-white">101 Khuất Duy Tiến, Thanh Xuân, Hà Nội</strong>
                </p>
                <p>
                  Khung giờ khám tham chiếu: <strong className="text-white">08:00 – 21:00 (Tất cả các ngày)</strong>
                </p>
                <p>
                  Trực cấp cứu: <strong className="text-white">Tiếp nhận cấp cứu 24/24 — Hotline 097 355 51 05</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/dat-lich"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[var(--color-plum-deep)] hover:bg-[var(--color-lavender)] font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] min-h-[44px]"
                >
                  <Calendar className="w-4 h-4 text-[var(--color-plum-primary)]" />
                  <span>Đặt lịch khám trực tuyến</span>
                </Link>

                <a
                  href="tel:0973555105"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] min-h-[44px]"
                >
                  <Phone className="w-4 h-4 text-white" />
                  <span>Gọi Cấp cứu: 097 355 51 05</span>
                </a>

                <a
                  href={HOSPITAL_CONTACT.mapsUrl || 'https://maps.google.com/?q=101+Khuất+Duy+Tiến,+Thanh+Xuân,+Hà+Nội'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 font-medium text-xs sm:text-sm transition-all min-h-[44px]"
                >
                  <MapPin className="w-4 h-4 text-[var(--color-plum-orchid-light)]" />
                  <span>Mở bản đồ Google Maps</span>
                </a>
              </div>
            </div>

            {/* Right 5 cols: Guide box */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl p-6 sm:p-7 bg-white/5 border border-white/15 backdrop-blur-xs">
                <div className="flex items-center gap-2 mb-2.5">
                  <Info className="w-5 h-5 text-[var(--color-plum-orchid-light)]" />
                  <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                    Hướng dẫn khi đưa bé đến viện
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                  Quý khách có thể đặt lịch hẹn trước qua website để giảm thời gian chờ đợi. Trường hợp cấp cứu 24/24, vui lòng gọi trực tiếp Hotline <strong className="text-white">097 355 51 05</strong> để được hỗ trợ hướng dẫn kịp thời.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FacilitiesPage

