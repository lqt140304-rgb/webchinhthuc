import React from 'react'

export interface TriptychItem {
  number: string
  title: string
  description: string
}

interface EditorialTriptychProps {
  items: TriptychItem[]
  className?: string
}

export const EditorialTriptych: React.FC<EditorialTriptychProps> = ({
  items,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 ${className}`}>
      {items.map((item) => (
        <article
          key={item.number}
          className="p-6 sm:p-7 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-xs flex flex-col justify-start transition-shadow hover:shadow-sm"
        >
          <span className="font-serif font-bold text-3xl sm:text-4xl text-[var(--color-plum-primary)]/25 mb-3 block leading-none select-none">
            {item.number}
          </span>
          <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--color-plum-deep)] mb-2.5 tracking-tight">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
            {item.description}
          </p>
        </article>
      ))}
    </div>
  )
}
