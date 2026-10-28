import { useEffect } from 'react'

interface SeoConfig {
  title: string
  description: string
  isIndexable?: boolean
  noCanonical?: boolean
}

/**
 * useRouteSeo:
 * In React Router Framework Mode, document.title, meta description, robots, and canonical
 * tags are managed as a single source of truth by route-level `meta()` descriptors rendered
 * via `<Meta />` in `app/root.tsx`.
 *
 * This hook is preserved for component-level compatibility and strictly updates the screen
 * reader accessibility live region (`#sr-announcer`) without mutating `<head>`, thereby
 * preventing hydration race conditions or head tag duplication.
 */
export function useRouteSeo({ title }: SeoConfig) {
  useEffect(() => {
    const announcer = document.getElementById('sr-announcer')
    if (announcer) {
      announcer.textContent = `Đã chuyển đến trang: ${title}`
    }
  }, [title])
}
