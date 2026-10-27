import React, { useState } from 'react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import { EditorialBreadcrumb } from '@/components/editorial/EditorialBreadcrumb'
import { EditorialPolicyBanner } from '@/components/editorial/EditorialPolicyBanner'
import { EditorialSlotBox } from '@/components/editorial/EditorialSlotBox'
import { EditorialTriptych } from '@/components/editorial/EditorialTriptych'
import { EditorialDarkCTA } from '@/components/editorial/EditorialDarkCTA'
import { TeamMemberCard, type TeamMember } from '@/components/editorial/TeamMemberCard'
import { TeamGrid } from '@/components/editorial/TeamGrid'

type DeptFilter = 'all' | 'vet' | 'grooming' | 'support'

interface FilterOption {
  id: DeptFilter
  label: string
  announceLabel: string
}

const filterOptions: FilterOption[] = [
  { id: 'all', label: 'Tất cả bộ phận', announceLabel: 'Tất cả các bộ phận' },
  { id: 'vet', label: 'Bộ phận Bác sĩ Thú y (Lâm sàng)', announceLabel: 'Bộ phận Bác sĩ Thú y (Lâm sàng)' },
  { id: 'grooming', label: 'Bộ phận Spa & Grooming (Chờ xác nhận)', announceLabel: 'Bộ phận Spa & Grooming (Chờ xác nhận)' },
  { id: 'support', label: 'Bộ phận Chăm sóc & Hỗ trợ (Chờ xác nhận)', announceLabel: 'Bộ phận Chăm sóc & Hỗ trợ (Chờ xác nhận)' },
]

// Data definitions adhering 100% to Content Lock
const vetTeam: TeamMember[] = [
  {
    id: 'vet-1',
    monogram: 'BS',
    deptPill: 'Bác sĩ Thú y',
    name: '[Bác sĩ Thú y — Dữ liệu mô phỏng]',
    role: '[Chức danh chuyên môn: Chờ xác minh]',
    description: '[Phạm vi phụ trách chuyên môn — Chờ cập nhật hồ sơ thực tế].',
    meta: [
      { label: 'Lĩnh vực', value: '[Chờ cập nhật]' },
      { label: 'Lịch thăm khám', value: '[Cập nhật theo lịch phân công tại viện]' },
    ],
  },
  {
    id: 'vet-lts',
    monogram: 'LTS',
    deptPill: 'Bác sĩ Thú y',
    name: 'BS. Lê Thái Sơn',
    role: '[Chức danh: Bác sĩ Thú y — Chờ xác nhận]',
    description: '[Phạm vi chuyên môn & phụ trách — Chờ cập nhật hồ sơ thực tế].',
    meta: [
      { label: 'Lĩnh vực', value: '[Chờ cập nhật]' },
      { label: 'Lịch thăm khám', value: '[Chờ cập nhật]' },
    ],
  },
  {
    id: 'vet-3',
    monogram: 'BS',
    deptPill: 'Bác sĩ Thú y',
    name: '[Bác sĩ Thú y — Dữ liệu mô phỏng]',
    role: '[Chức danh chuyên môn: Chờ xác minh]',
    description: '[Phạm vi phụ trách chuyên môn — Chờ cập nhật hồ sơ thực tế].',
    meta: [
      { label: 'Lĩnh vực', value: '[Chờ cập nhật]' },
      { label: 'Lịch thăm khám', value: '[Cập nhật theo lịch phân công tại viện]' },
    ],
  },
]

const groomingTeam: TeamMember[] = [
  {
    id: 'grooming-1',
    monogram: 'SG',
    deptPill: '[Spa & Grooming — Đề xuất]',
    name: '[Chuyên viên Chăm sóc da lông — Dữ liệu mô phỏng]',
    role: '[Chức danh: Chờ xác minh]',
    description: '[Phạm vi công việc chăm sóc vệ sinh da lông — Chờ cập nhật hồ sơ thực tế].',
    meta: [{ label: 'Dịch vụ', value: '[Chờ cập nhật]' }],
  },
]

const supportTeam: TeamMember[] = [
  {
    id: 'support-1',
    monogram: 'CS',
    deptPill: '[Chăm sóc Nội trú — Chờ xác nhận]',
    name: '[Nhân viên Chăm sóc nội trú — Dữ liệu mô phỏng]',
    role: '[Chức danh: Chờ xác minh]',
    description: '[Phạm vi công việc hỗ trợ chăm sóc thú cưng — Chờ cập nhật hồ sơ thực tế].',
    meta: [{ label: 'Nhiệm vụ', value: '[Chờ phân công]' }],
  },
  {
    id: 'support-2',
    monogram: 'HT',
    deptPill: '[Tiếp đón & Hỗ trợ — Chờ xác nhận]',
    name: '[Nhân viên Tiếp đón & Hỗ trợ — Dữ liệu mô phỏng]',
    role: '[Chức danh: Chờ xác minh]',
    description: '[Phạm vi công việc hỗ trợ thủ tục tiếp đón — Chờ cập nhật hồ sơ thực tế].',
    meta: [{ label: 'Nhiệm vụ', value: '[Chờ phân công]' }],
  },
]

export const TeamPage: React.FC = () => {
  useRouteSeo({
    title: 'Đội ngũ Bác sĩ & Nhân sự Chăm sóc — Bệnh viện Thú y Lê Sơn',
    description:
      'Thông tin cơ cấu bộ phận và đội ngũ nhân sự chăm sóc thú cưng tại Bệnh viện Thú y Lê Sơn. Mô phỏng cơ cấu tổ chức chuyên môn.',
    isIndexable: false,
  })

  const [activeFilter, setActiveFilter] = useState<DeptFilter>('all')

  const currentOption = filterOptions.find((o) => o.id === activeFilter) || filterOptions[0]

  return (
    <div className="w-full bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)]">
      {/* SECTION 2.1: TEAM INTRODUCTION HERO & ACCESSIBLE FILTER */}
      <section className="py-10 sm:py-16 md:py-20 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditorialBreadcrumb currentPage="Đội ngũ" />

          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2.5 block">
              Đội ngũ Bệnh viện Thú y Lê Sơn
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-plum-deep)] tracking-tight leading-tight mb-5">
              Sự tận tâm từ những người trực tiếp đồng hành cùng thú cưng.
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-[var(--color-fg-muted)] leading-relaxed mb-6">
              Tại Bệnh viện Thú y Lê Sơn, hoạt động thăm khám và chăm sóc được tổ chức theo từng bộ phận chuyên môn. Các bộ phận và thẻ nhân sự dưới đây hiện là khung mô phỏng giao diện, chờ Chủ dự án xác nhận cơ cấu thực tế.
            </p>
          </div>

          <EditorialPolicyBanner
            label="Thông báo minh bạch hồ sơ nhân sự"
            title="Thông báo hồ sơ nhân sự (Bản thiết kế sơ bộ):"
          >
            Toàn bộ các thẻ dưới đây sử dụng khung Monogram trung tính và khung dữ liệu chờ cập nhật cho tới khi Chủ dự án phê duyệt danh sách nhân sự, chức danh và ảnh chân dung thực tế tại bệnh viện.
          </EditorialPolicyBanner>

          {/* Department Filter Toolbar */}
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]">
            <div className="mb-4">
              <strong className="font-serif font-bold text-base sm:text-lg text-[var(--color-plum-deep)] block">
                Lọc theo bộ phận chuyên môn
              </strong>
              <span className="text-xs sm:text-sm text-[var(--color-fg-muted)]">
                Chọn bộ phận để tra cứu cấu trúc nhân sự tương ứng
              </span>
            </div>

            <div
              role="toolbar"
              aria-label="Lọc nhân sự theo bộ phận"
              className="flex flex-wrap items-center gap-2 sm:gap-2.5"
            >
              {filterOptions.map((opt) => {
                const isActive = activeFilter === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveFilter(opt.id)}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[var(--color-plum-primary)] text-white border-[var(--color-plum-primary)] shadow-xs'
                        : 'bg-[var(--color-bg-card)] text-[var(--color-fg-primary)] border-[var(--color-border-subtle)] hover:bg-[var(--color-lavender)] hover:border-[var(--color-plum-primary)]/40'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>

            <p id="team-filter-status" className="sr-only" role="status" aria-live="polite">
              Đang hiển thị: {currentOption.announceLabel}.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2.2: BỘ PHẬN BÁC SĨ THÚ Y */}
      {(activeFilter === 'all' || activeFilter === 'vet') && (
        <section id="dept-vet" className="py-16 sm:py-20 bg-[var(--color-bg-card)] border-b border-[var(--color-border-subtle)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2 block">
              Khối Lâm sàng
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] mb-4 tracking-tight">
              Bộ phận Bác sĩ Thú y
            </h2>

            <EditorialSlotBox label="DỮ LIỆU NHÂN SỰ ĐANG CẬP NHẬT" className="mb-4 max-w-3xl">
              Sĩ số và danh sách nhân sự thực tế đang chờ Chủ dự án xác nhận. Các thẻ dưới đây hiện là dữ liệu mẫu trung tính để phục vụ hiển thị bố cục.
            </EditorialSlotBox>

            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-8 max-w-3xl">
              [Bộ phận Bác sĩ Thú y phụ trách thăm khám lâm sàng và các hoạt động chuyên môn y khoa — Chờ cập nhật danh mục phân công].
            </p>

            {/* Universal Grid: Same card width across all departments, auto-centered last row */}
            <TeamGrid>
              {vetTeam.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </TeamGrid>
          </div>
        </section>
      )}

      {/* SECTION 2.3A: BỘ PHẬN SPA & GROOMING */}
      {(activeFilter === 'all' || activeFilter === 'grooming') && (
        <section id="dept-grooming" className="py-16 sm:py-20 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-subtle)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2 block">
              Khối Chăm sóc &amp; Vệ sinh
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] mb-2 tracking-tight">
              Bộ phận Spa &amp; Grooming (Chờ xác nhận cơ cấu)
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-8 max-w-3xl">
              [Bộ phận Spa &amp; Grooming phục vụ dịch vụ tắm vệ sinh và chăm sóc da lông — Chờ xác nhận cơ cấu nhân sự thực tế].
            </p>

            {/* Universal Grid: N=1 Card centered with identical width system */}
            <TeamGrid>
              {groomingTeam.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </TeamGrid>
          </div>
        </section>
      )}

      {/* SECTION 2.3B: BỘ PHẬN CHĂM SÓC & HỖ TRỢ VẬN HÀNH */}
      {(activeFilter === 'all' || activeFilter === 'support') && (
        <section id="dept-support" className="py-16 sm:py-20 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-subtle)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-plum-primary)] mb-2 block">
              Khối Hỗ trợ Vận hành
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-plum-deep)] mb-2 tracking-tight">
              Bộ phận Chăm sóc &amp; Hỗ trợ vận hành (Chờ xác nhận cơ cấu)
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-8 max-w-3xl">
              [Đề xuất định hướng hỗ trợ công tác chăm sóc nội trú và tiếp đón khách hàng — Chờ xác nhận cơ cấu thực tế].
            </p>

            {/* Universal Grid: N=2 Cards centered with identical width system */}
            <TeamGrid>
              {supportTeam.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </TeamGrid>
          </div>
        </section>
      )}

      {/* SECTION 2.4: QUY TRÌNH PHỐI HỢP (TRIPTYCH 3 BƯỚC) */}
      <section className="py-16 sm:py-20 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[var(--color-plum-primary)]/10 text-[var(--color-plum-primary)] border border-[var(--color-plum-primary)]/20">
              Bản thảo đề xuất quy trình
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-plum-deep)] mb-3 tracking-tight">
            Cách đội ngũ phối hợp chăm sóc thú cưng
          </h2>

          <EditorialSlotBox label="QUY TRÌNH PHỐI HỢP ĐỀ XUẤT" className="mb-4 max-w-3xl">
            Nội dung dưới đây là bản thảo đề xuất quy trình, đang chờ Chủ dự án xác nhận vận hành thực tế tại cơ sở.
          </EditorialSlotBox>

          <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-10 max-w-3xl">
            [Đề xuất định hướng các bước phối hợp giữa các bộ phận — Chờ xác nhận quy trình vận hành thực tế].
          </p>

          <EditorialTriptych
            items={[
              {
                number: '01',
                title: 'Tiếp nhận & Ghi nhận thông tin',
                description:
                  'Đón tiếp thú cưng tại 101 Khuất Duy Tiến (khung giờ khám tham chiếu 08:00 – 21:00; tiếp nhận cấp cứu 24/24 qua Hotline 097 355 51 05).',
              },
              {
                number: '02',
                title: 'Thăm khám & Trao đổi cùng chủ nuôi',
                description:
                  '[Đề xuất]: Bác sĩ trực tiếp thăm khám và trao đổi định hướng chăm sóc cùng gia đình.',
              },
              {
                number: '03',
                title: 'Chăm sóc & Hướng dẫn theo dõi',
                description:
                  '[Đề xuất]: Thực hiện chăm sóc hoặc lưu trú theo hướng dẫn chuyên môn và dặn dò theo dõi tại nhà.',
              },
            ]}
          />
        </div>
      </section>

      {/* SECTION 2.5: CTA LIÊN HỆ & ĐẶT LỊCH KHÁM */}
      <section className="py-16 sm:py-20 bg-[var(--color-bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditorialDarkCTA
            title="Đặt lịch hẹn khám cùng đội ngũ Lê Sơn"
            subtitle="101 Khuất Duy Tiến, Thanh Xuân, Hà Nội • Khám 08:00 – 21:00 • Cấp cứu 24/24"
          />
        </div>
      </section>
    </div>
  )
}

export default TeamPage

