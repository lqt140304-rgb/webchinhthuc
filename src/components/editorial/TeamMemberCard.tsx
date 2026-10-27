import React from 'react'

export interface TeamMember {
  id: string
  monogram: string
  deptPill: string
  name: string
  role: string
  description: string
  meta: Array<{ label: string; value: string }>
}

interface TeamMemberCardProps {
  member: TeamMember
  className?: string
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, className = '' }) => {
  return (
    <article
      className={`rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-xs overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-sm ${className}`}
    >
      {/* Monogram Box (4:5 Aspect Ratio, neutral placeholder, NO stock face) */}
      <div className="w-full aspect-[4/5] bg-[#F8F2F9] flex flex-col items-center justify-center p-6 border-b border-[var(--color-border-subtle)] relative">
        <div
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#EFE4F2] text-[var(--color-plum-primary)] font-serif font-bold text-xl sm:text-2xl flex items-center justify-center shadow-xs select-none"
          aria-hidden="true"
        >
          {member.monogram}
        </div>
        <span className="text-[10px] sm:text-[11px] text-[var(--color-fg-muted)] mt-3 text-center px-2">
          Khung ảnh chân dung — Đang cập nhật ảnh thực tế
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <div className="mb-2.5">
          <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-plum-primary)] border border-[var(--color-border-subtle)]">
            {member.deptPill}
          </span>
        </div>

        <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)] mb-1">
          {member.name}
        </h3>

        <p className="text-xs sm:text-sm font-semibold text-[var(--color-plum-primary)] mb-2.5">
          {member.role}
        </p>

        <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed mb-4 flex-1">
          {member.description}
        </p>

        <ul className="text-xs text-[var(--color-fg-muted)] border-t border-[var(--color-border-subtle)] pt-3 space-y-1.5">
          {member.meta.map((m, idx) => (
            <li key={idx} className="flex flex-wrap items-baseline gap-1">
              <strong className="text-[var(--color-fg-primary)] font-semibold">{m.label}:</strong>
              <span>{m.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
