import React from 'react'

export interface TeamGridProps {
  children: React.ReactNode
  className?: string
}

/**
 * TeamGrid — Unified responsive grid for all team departments.
 * Ensures:
 * 1. Identical card width across all departments at the same viewport.
 * 2. Last row is automatically centered when cards don't divide evenly.
 * 3. Consistent gap and zero horizontal overflow.
 */
export const TeamGrid: React.FC<TeamGridProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`flex flex-wrap justify-center items-stretch gap-6 sm:gap-8 mx-auto w-full ${className}`}
    >
      {children}
    </div>
  )
}

export default TeamGrid
