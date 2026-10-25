import React, { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { MobileNav, MobileBottomBar } from './MobileNav'

export const RootLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()

  // Cuộn lên đầu trang & chuyển focus đến main-content khi đổi route
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    const mainEl = document.getElementById('main-content')
    mainEl?.focus({ preventScroll: true })
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)] antialiased">
      {/* Skip to Main Content Link for A11y */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[var(--color-plum-primary)] focus:text-white focus:rounded-xl focus:shadow-xl focus:font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        Nhảy đến nội dung chính
      </a>

      {/* Screen Reader Route Announcer */}
      <div id="sr-announcer" aria-live="polite" aria-atomic="true" className="sr-only" />

      <Header
        isMobileMenuOpen={mobileMenuOpen}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        menuButtonRef={menuButtonRef}
      />

      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        triggerRef={menuButtonRef}
      />

      <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col outline-none">
        <Outlet />
      </main>

      <Footer />

      <MobileBottomBar />
    </div>
  )
}
