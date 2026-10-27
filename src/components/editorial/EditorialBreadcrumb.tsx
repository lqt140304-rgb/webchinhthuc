import React from 'react'
import { Link } from 'react-router-dom'

interface EditorialBreadcrumbProps {
  currentPage: string
}

export const EditorialBreadcrumb: React.FC<EditorialBreadcrumbProps> = ({ currentPage }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-[var(--color-fg-muted)] mb-6 sm:mb-8">
      <Link
        to="/"
        className="min-h-[44px] inline-flex items-center text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] rounded-md px-1"
      >
        Trang chủ
      </Link>
      <span className="text-[var(--color-border-medium)] select-none" aria-hidden="true">/</span>
      <span className="min-h-[44px] inline-flex items-center px-1 text-[var(--color-fg-muted)] font-medium">
        Về Lê Sơn
      </span>
      <span className="text-[var(--color-border-medium)] select-none" aria-hidden="true">/</span>
      <span
        aria-current="page"
        className="min-h-[44px] inline-flex items-center px-1 font-semibold text-[var(--color-plum-primary)]"
      >
        {currentPage}
      </span>
    </nav>
  )
}
