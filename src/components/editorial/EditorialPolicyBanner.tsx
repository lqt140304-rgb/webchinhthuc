import React from 'react'

interface EditorialPolicyBannerProps {
  label: string
  title: string
  children: React.ReactNode
  className?: string
}

export const EditorialPolicyBanner: React.FC<EditorialPolicyBannerProps> = ({
  label,
  title,
  children,
  className = '',
}) => {
  return (
    <div
      role="region"
      aria-label={label}
      className={`rounded-2xl p-4 sm:p-5 bg-[var(--color-plum-primary)]/5 border border-[var(--color-border-subtle)] border-l-4 border-l-[var(--color-plum-primary)] text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed my-6 sm:my-8 ${className}`}
    >
      <strong className="text-[var(--color-plum-deep)] font-semibold block sm:inline mr-1">
        {title}
      </strong>
      {children}
    </div>
  )
}
