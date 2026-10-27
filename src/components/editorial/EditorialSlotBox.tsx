import React from 'react'

interface EditorialSlotBoxProps {
  label: string
  children: React.ReactNode
  className?: string
}

export const EditorialSlotBox: React.FC<EditorialSlotBoxProps> = ({
  label,
  children,
  className = '',
}) => {
  return (
    <div
      className={`p-3.5 sm:p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-dashed border-[var(--color-border-medium)] text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed ${className}`}
    >
      <strong className="text-[var(--color-plum-primary)] font-semibold mr-1.5 block sm:inline">
        {label}:
      </strong>
      <span className="italic">{children}</span>
    </div>
  )
}
