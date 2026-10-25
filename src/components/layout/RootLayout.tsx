import React, { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { MobileNav, MobileBottomBar } from './MobileNav'

export const RootLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()

  // Cuộn lên đầu trang mỗi khi chuyển route
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)] antialiased">
      <Header
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        menuButtonRef={menuButtonRef}
      />

      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        triggerRef={menuButtonRef}
      />

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <Footer />

      <MobileBottomBar />
    </div>
  )
}
