import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SeoConfig {
  title: string
  description: string
  isIndexable?: boolean
  noCanonical?: boolean
}

const BASE_URL = 'https://bvthuyleson.vn'

export function useRouteSeo({ title, description, isIndexable = false, noCanonical = false }: SeoConfig) {
  const location = useLocation()

  useEffect(() => {
    // 1. Set document title
    document.title = title

    // 2. Set meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', description)

    // 3. Set meta robots (noindex for WIP routes, index only for production-ready pages)
    let metaRobots = document.querySelector('meta[name="robots"]')
    if (!metaRobots) {
      metaRobots = document.createElement('meta')
      metaRobots.setAttribute('name', 'robots')
      document.head.appendChild(metaRobots)
    }
    metaRobots.setAttribute('content', isIndexable ? 'index, follow' : 'noindex, nofollow')

    // 4. Set canonical link (bỏ canonical trên trang 404 theo khuyến nghị P3)
    let canonical = document.querySelector('link[rel="canonical"]')
    if (noCanonical) {
      if (canonical) {
        canonical.remove()
      }
    } else {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      const cleanPath = location.pathname.endsWith('/') && location.pathname.length > 1
        ? location.pathname.slice(0, -1)
        : location.pathname
      canonical.setAttribute('href', `${BASE_URL}${cleanPath}`)
    }

    // 5. Announce page change to screen reader live region if present
    const announcer = document.getElementById('sr-announcer')
    if (announcer) {
      announcer.textContent = `Đã chuyển đến trang: ${title}`
    }
  }, [title, description, isIndexable, noCanonical, location.pathname])
}
