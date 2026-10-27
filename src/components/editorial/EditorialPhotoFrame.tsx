import React from 'react'

interface EditorialPhotoFrameProps {
  src?: string
  alt?: string
  aspectRatio?: '4/5' | '16/10' | '4/3' | 'square'
  label: string
  title?: string
  subtitle?: string
  className?: string
  isArchitecturalSvg?: boolean
}

export const EditorialPhotoFrame: React.FC<EditorialPhotoFrameProps> = ({
  src,
  alt = '(Ảnh minh họa)',
  aspectRatio = '4/5',
  label,
  title,
  subtitle,
  className = '',
  isArchitecturalSvg = false,
}) => {
  const aspectClass =
    aspectRatio === '4/5'
      ? 'aspect-[4/5]'
      : aspectRatio === '16/10'
      ? 'aspect-[16/10]'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : 'aspect-square'

  return (
    <div
      className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] shadow-xs ${className}`}
    >
      {isArchitecturalSvg || !src ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F8F2F9] to-[#EFE4F2]">
          {title && (
            <strong className="font-serif text-lg sm:text-xl text-[var(--color-plum-primary)] mb-1.5 block">
              {title}
            </strong>
          )}
          {subtitle && (
            <span className="text-xs sm:text-sm text-[var(--color-fg-muted)]">
              {subtitle}
            </span>
          )}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      )}

      {/* Mandatory Illustrative / Architectural Badge */}
      <span className="absolute bottom-2.5 right-2.5 max-w-[90%] px-2.5 py-1 text-[10px] sm:text-[11px] font-medium tracking-wide bg-[var(--color-plum-deep)]/85 text-white backdrop-blur-xs rounded-md shadow-xs pointer-events-none text-center">
        {label}
      </span>
    </div>
  )
}
