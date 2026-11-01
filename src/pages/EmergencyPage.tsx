import React from 'react'
import { Link } from 'react-router-dom'
import {
  Phone,
  MapPin,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Navigation,
  Info,
} from 'lucide-react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import { HOSPITAL_CONTACT } from '@/config/contact'
import { EditorialBreadcrumb } from '@/components/editorial/EditorialBreadcrumb'
import { EditorialPolicyBanner } from '@/components/editorial/EditorialPolicyBanner'

const emergencySigns = [
  {
    title: 'Khó thở hoặc tím tái',
    description: 'Thở dốc, thở há miệng, ngực bụng co bóp bất thường, nướu răng nhợt nhạt hoặc tím tái.',
  },
  {
    title: 'Co giật & Mất ý thức',
    description: 'Co giật toàn thân hoặc từng cơn, li bì bất tỉnh, mất thăng bằng hoặc không phản xạ với tiếng gọi.',
  },
  {
    title: 'Chấn thương & Xuất huyết',
    description: 'Va chạm tai nạn, té ngã từ trên cao, gãy xương, vết thương hở chảy máu khó cầm.',
  },
  {
    title: 'Nghi ngờ nuốt dị vật & Ngộ độc',
    description: 'Nuốt xương, đồ chơi, dị vật đường thở, hoặc tiếp xúc/ăn phải hóa chất, bả độc, sùi bọt mép.',
  },
  {
    title: 'Bí tiểu & Nôn mửa dữ dội',
    description: 'Rặn tiểu liên tục nhưng không ra nước, nôn khan kéo dài hoặc nôn mửa kèm tiêu chảy ra máu.',
  },
  {
    title: 'Hạ thân nhiệt hoặc sốt cao',
    description: 'Cơ thể lạnh ngắt rũ rượi, hoặc run rẩy kèm thân nhiệt tăng cao nguy hiểm.',
  },
]

const intakeSteps = [
  {
    step: '01',
    title: 'Gọi điện báo trước cho bệnh viện',
    description: `Liên hệ ngay hotline ${HOSPITAL_CONTACT.hotlineDisplay} để thông báo ngắn gọn tình trạng bé và thời gian dự kiến đến viện. Bác sĩ trực sẽ hướng dẫn các lưu ý phù hợp và chuẩn bị tiếp nhận khi bạn tới nơi.`,
  },
  {
    step: '02',
    title: 'Làm theo chỉ dẫn của bác sĩ khi di chuyển',
    description:
      'Đặt thú cưng ở tư thế thoải mái trên mặt phẳng hoặc lồng vận chuyển, hạn chế cử động mạnh và giữ đường thở thông thoáng. Làm theo hướng dẫn sơ cứu cụ thể của bác sĩ qua điện thoại cho từng trường hợp. Tuyệt đối không tự ý cho bé uống thuốc của người hay tự ý can thiệp.',
  },
  {
    step: '03',
    title: 'Đến trực tiếp 101 Khuất Duy Tiến',
    description: `Đưa bé tới cơ sở tại ${HOSPITAL_CONTACT.shortAddress} để bác sĩ thăm khám lâm sàng và đánh giá trực tiếp tình trạng của bé.`,
  },
]

export const EmergencyPage: React.FC = () => {
  useRouteSeo({
    title: `Tiếp Nhận Cấp Cứu 24/24 — ${HOSPITAL_CONTACT.name}`,
    description: `Đường dây nóng cấp cứu thú cưng 24/24 tại Hà Nội: ${HOSPITAL_CONTACT.hotlineDisplay}. Địa chỉ tiếp nhận: ${HOSPITAL_CONTACT.address}. Bác sĩ trực sẵn sàng hỗ trợ khẩn cấp.`,
    isIndexable: false,
  })

  return (
    <div className="w-full bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)]">
      {/* 1. Urgent Top Banner & Direct Actions */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-[var(--color-bg-primary)] border-b border-orange-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditorialBreadcrumb
            currentPage="Tiếp nhận Cấp cứu 24/24"
            parentGroup="Dịch vụ"
            parentLink="/dich-vu"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Urgent Notice & Action */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[var(--color-warm-orange)] text-white text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
                <ShieldAlert className="w-4 h-4" />
                <span>Tiếp Nhận Cấp Cứu 24/24 • Ưu Tiên Xử Trí</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-tight mb-4">
                Cấp cứu thú cưng khẩn cấp tại Hà Nội
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed mb-6 font-sans">
                Trong tình huống nguy cấp, từng phút đều quan trọng. Đội ngũ y tế tại <strong>{HOSPITAL_CONTACT.address}</strong> luôn sẵn sàng tiếp nhận và hỗ trợ bạn cùng bé cưng 24 giờ mỗi ngày, tất cả các ngày trong tuần.
              </p>

              {/* Big Direct Call-to-Action Bar for Mobile & Desktop */}
              <div className="p-4 sm:p-6 rounded-[10px] bg-white border-2 border-orange-300 shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href={HOSPITAL_CONTACT.hotlineTel}
                    className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-[6px] bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-bold text-base sm:text-lg transition-all shadow-[var(--shadow-warm-orange)] active:scale-[0.98] min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-orange)]"
                  >
                    <Phone className="w-5 h-5 shrink-0" />
                    <span>Gọi cấp cứu: {HOSPITAL_CONTACT.hotlineDisplay}</span>
                  </a>

                  <a
                    href={HOSPITAL_CONTACT.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-[6px] border border-[var(--color-border-medium)] text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)] font-semibold text-sm transition-colors min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)]"
                  >
                    <Navigation className="w-4 h-4 text-[var(--color-plum-primary)] shrink-0" />
                    <span>Chỉ đường Maps</span>
                  </a>
                </div>

                <p className="mt-3 text-xs text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-warm-orange)] shrink-0" />
                  <span>Đường dây nóng hoạt động 24/24. Vui lòng gọi trước để được hướng dẫn và hỗ trợ tiếp nhận kịp thời.</span>
                </p>
              </div>
            </div>

            {/* Right 5 cols: Key Facility Info Card */}
            <div className="lg:col-span-5">
              <div className="rounded-[10px] bg-[var(--color-bg-dark)] text-white p-6 sm:p-7 shadow-md">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-plum-orchid-light)] block mb-2">
                  Địa Chỉ Tiếp Nhận Trực Cấp Cứu
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-white mb-4">
                  {HOSPITAL_CONTACT.name}
                </h2>

                <ul className="space-y-4 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[var(--color-plum-orchid-light)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">Địa chỉ cơ sở:</strong>
                      <span>{HOSPITAL_CONTACT.address}</span>
                      <p className="text-xs text-[var(--color-plum-orchid-light)] mt-0.5">
                        (Vị trí mặt đường lớn trên trục Khuất Duy Tiến, thuận tiện di chuyển)
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[var(--color-warm-orange-light)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">Thời gian tiếp nhận:</strong>
                      <span className="text-[var(--color-warm-orange-light)] font-bold">
                        {HOSPITAL_CONTACT.emergencyHours}
                      </span>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Tất cả các ngày trong tuần, kể cả ban đêm và cuối tuần.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[var(--color-warm-orange-light)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">Hotline tiếp nhận cấp cứu 24/24:</strong>
                      <a
                        href={HOSPITAL_CONTACT.hotlineTel}
                        className="text-base font-bold text-[var(--color-warm-orange-light)] hover:underline block mt-0.5"
                      >
                        {HOSPITAL_CONTACT.hotlineDisplay}
                      </a>
                    </div>
                  </li>
                </ul>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Cần đặt lịch hẹn không khẩn cấp?</span>
                  <Link
                    to="/dat-lich"
                    className="text-amber-300 hover:text-white underline font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-[4px] inline-flex items-center min-h-[44px] py-2 px-1"
                  >
                    Đặt lịch khám
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Critical Warning Signs */}
      <section className="py-12 sm:py-16 md:py-20" aria-label="Dấu hiệu thú cưng cần đi cấp cứu">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-warm-orange-dark)] mb-2 block">
              Nhận Biết Nguy Cấp
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight">
              Các dấu hiệu cần đưa thú cưng đến bệnh viện ngay
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed font-sans">
              Nếu bạn quan sát thấy một trong các biểu hiện dưới đây, hãy liên hệ hotline và đưa bé đến viện càng sớm càng tốt:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencySigns.map((item, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-[6px] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <AlertTriangle className="w-4 h-4 text-[var(--color-warm-orange)] shrink-0" />
                    <h3 className="font-serif font-bold text-base text-[var(--color-plum-deep)]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Clinical Transparency Banner */}
          <EditorialPolicyBanner
            label="Lưu ý y khoa và quy trình lâm sàng"
            title="Lưu ý chuyên môn:"
            className="rounded-[6px] mt-8"
          >
            Thông tin nhận biết trên mang tính chất hỗ trợ chủ nuôi nhận diện nguy cơ khẩn cấp. Quy trình tiếp nhận lâm sàng thực tế và các can thiệp y khoa sẽ do bác sĩ trực khám, đánh giá trực tiếp dựa trên thể trạng của từng ca bệnh. Bệnh viện không tư vấn dùng thuốc qua điện thoại khi chưa có thăm khám trực tiếp.
          </EditorialPolicyBanner>
        </div>
      </section>

      {/* 3. 3 Practical Steps During Emergency */}
      <section className="py-12 sm:py-16 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2 block">
              Hướng Dẫn Thao Tác
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight">
              3 bước quan trọng khi đưa bé đi cấp cứu
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed font-sans">
              Giữ bình tĩnh và thực hiện đúng các bước sau để việc cấp cứu đạt hiệu quả tốt nhất:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {intakeSteps.map((stepItem) => (
              <div
                key={stepItem.step}
                className="p-6 rounded-[6px] bg-white border border-[var(--color-border-subtle)] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-serif font-bold text-[var(--color-warm-orange)] block mb-3">
                    {stepItem.step}
                  </span>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--color-plum-deep)] mb-2">
                    {stepItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed font-sans">
                    {stepItem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Call Strip */}
          <div className="mt-10 p-6 rounded-[10px] bg-white border border-[var(--color-border-medium)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-[var(--color-plum-primary)] shrink-0" />
              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)]">
                Bạn đang trên đường di chuyển hoặc cần trợ giúp khẩn? Gọi ngay đường dây nóng cấp cứu 24/24:
              </p>
            </div>
            <a
              href={HOSPITAL_CONTACT.hotlineTel}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-bold text-sm transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-orange)]"
            >
              <Phone className="w-4 h-4" />
              <span>{HOSPITAL_CONTACT.hotlineDisplay}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4. Bottom Navigation & Links */}
      <section className="py-10 bg-[var(--color-bg-primary)] border-t border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          <Link
            to="/dich-vu"
            className="inline-flex items-center gap-1.5 text-[var(--color-plum-primary)] hover:text-[var(--color-plum-deep)] font-semibold py-2.5 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] rounded-[4px] min-h-[44px]"
          >
            <span>← Quay lại Danh mục Dịch vụ</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/lien-he"
              className="inline-flex items-center text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)] font-medium py-2.5 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] rounded-[4px] min-h-[44px]"
            >
              <span>Thông tin phòng khám</span>
            </Link>
            <span className="text-[var(--color-border-medium)]">•</span>
            <Link
              to="/dat-lich"
              className="inline-flex items-center text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)] font-medium py-2.5 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] rounded-[4px] min-h-[44px]"
            >
              <span>Đặt lịch khám thường</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EmergencyPage
