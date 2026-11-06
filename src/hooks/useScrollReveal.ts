import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Kích hoạt hiệu ứng xuất hiện mượt mà (Scroll Choreography) khi người dùng cuộn tới từng khu vực.
 * Tự động tôn trọng prefers-reduced-motion.
 */
export function useScrollReveal() {
  const location = useLocation()

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('is-revealed'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    elements.forEach((el) => {
      observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
  }, [location.pathname])
}
