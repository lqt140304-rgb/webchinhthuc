import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, ChevronDown, Phone, Calendar, MapPin, ShieldAlert, LogIn, UserPlus, MessageSquare } from 'lucide-react'
import { HOSPITAL_CONTACT } from '@/config/contact'
import { isLinkActive, isGroupActive } from '@/utils/navigation'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  triggerRef?: React.RefObject<HTMLButtonElement | null>
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, triggerRef }) => {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const location = useLocation()
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Đóng drawer khi tuyến đường thay đổi
  useEffect(() => {
    if (isOpen) {
      onClose()
    }
  }, [location.pathname, location.search]) // eslint-disable-line react-hooks/exhaustive-deps

  // Đóng drawer khi kích thước màn hình vượt quá breakpoint di động (>= 1024px)
  useEffect(() => {
    if (!isOpen) return

    const mql = window.matchMedia('(min-width: 1024px)')
    const handleResize = (e: MediaQueryListEvent) => {
      if (e.matches) {
        onClose()
      }
    }

    if (mql.matches) {
      onClose()
      return
    }

    mql.addEventListener('change', handleResize)
    return () => mql.removeEventListener('change', handleResize)
  }, [isOpen, onClose])

  // Khóa cuộn body an toàn, bảo lưu trạng thái overflow trước đó
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const triggerElement = triggerRef?.current

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    // Tự động focus vào nút đóng khi drawer mở
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 50)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      triggerElement?.focus()
    }
  }, [isOpen, triggerRef])

  // Lắng nghe phím ESC và Focus Trap
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const drawer = drawerRef.current
        if (!drawer) return

        const focusableElements = drawer.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (!firstElement || !lastElement) return

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const toggleSection = (name: string) => {
    setOpenSection(openSection === name ? null : name)
  }

  const checkActive = (href: string) => isLinkActive(href, location.pathname, location.search)
  const isAboutGroupActive = isGroupActive(['/gioi-thieu', '/doi-ngu', '/co-so-vat-chat'], location.pathname)
  const isServicesGroupActive = isGroupActive(['/dich-vu', '/bang-gia'], location.pathname)
  const isPetCornerGroupActive = isGroupActive(['/goc-thu-cung', '/san-pham'], location.pathname)
  const isCauChuyenActive = isGroupActive(['/cau-chuyen'], location.pathname)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Drawer Panel với dialog semantics */}
      <div
        id="mobile-nav-dialog"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng trên thiết bị di động"
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-[var(--color-bg-primary)] shadow-2xl flex flex-col z-50 transition-transform duration-300"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/logo.png"
              alt="Logo Bệnh viện Thú y Lê Sơn"
              className="w-9 h-9 object-cover rounded-lg shadow-xs"
            />
            <div>
              <p className="font-serif font-bold text-sm text-[var(--color-plum-deep)] leading-tight">
                LÊ SƠN
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]">
                Bệnh viện Thú y
              </p>
            </div>
          </div>

          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Đóng menu điều hướng"
            className="p-2 rounded-xl text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Nav Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <Link
            to="/"
            onClick={onClose}
            aria-current={checkActive('/') ? 'page' : undefined}
            className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-colors ${
              checkActive('/')
                ? 'bg-[var(--color-bg-secondary)] text-[var(--color-plum-primary)] font-semibold'
                : 'text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)]'
            }`}
          >
            Trang chủ
          </Link>

          {/* Group 1: Về Lê Sơn */}
          <div className="rounded-xl overflow-hidden border border-[var(--color-border-subtle)]">
            <button
              type="button"
              aria-expanded={openSection === 'about'}
              onClick={() => toggleSection('about')}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-sm font-medium bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-secondary)] cursor-pointer ${isAboutGroupActive ? 'text-[var(--color-plum-primary)] font-semibold' : 'text-[var(--color-fg-primary)]'}`}
            >
              <span>Về Lê Sơn</span>
              <ChevronDown
                className={`w-4 h-4 text-[var(--color-fg-subtle)] transition-transform duration-200 ${
                  openSection === 'about' ? 'rotate-180 text-[var(--color-plum-primary)]' : ''
                }`}
              />
            </button>
            {openSection === 'about' && (
              <div className="bg-[var(--color-bg-secondary)]/50 px-2 py-1.5 space-y-0.5 border-t border-[var(--color-border-subtle)]">
                <Link
                  to="/gioi-thieu"
                  onClick={onClose}
                  aria-current={checkActive('/gioi-thieu') ? 'page' : undefined}
                  className={`block px-3 py-2 text-xs font-medium hover:text-[var(--color-plum-primary)] ${checkActive('/gioi-thieu') ? 'text-[var(--color-plum-primary)] font-semibold bg-[var(--color-bg-primary)]/50 rounded-md' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Giới thiệu bệnh viện
                </Link>
                <Link
                  to="/doi-ngu"
                  onClick={onClose}
                  aria-current={checkActive('/doi-ngu') ? 'page' : undefined}
                  className={`block px-3 py-2 text-xs font-medium hover:text-[var(--color-plum-primary)] ${checkActive('/doi-ngu') ? 'text-[var(--color-plum-primary)] font-semibold bg-[var(--color-bg-primary)]/50 rounded-md' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Đội ngũ bác sĩ
                </Link>
                <Link
                  to="/co-so-vat-chat"
                  onClick={onClose}
                  aria-current={checkActive('/co-so-vat-chat') ? 'page' : undefined}
                  className={`block px-3 py-2 text-xs font-medium hover:text-[var(--color-plum-primary)] ${checkActive('/co-so-vat-chat') ? 'text-[var(--color-plum-primary)] font-semibold bg-[var(--color-bg-primary)]/50 rounded-md' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Cơ sở vật chất
                </Link>
              </div>
            )}
          </div>

          {/* Group 2: Dịch vụ */}
          <div className="rounded-xl overflow-hidden border border-[var(--color-border-subtle)]">
            <button
              type="button"
              aria-expanded={openSection === 'services'}
              onClick={() => toggleSection('services')}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-sm font-medium bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-secondary)] cursor-pointer ${isServicesGroupActive ? 'text-[var(--color-plum-primary)] font-semibold' : 'text-[var(--color-fg-primary)]'}`}
            >
              <span>Dịch vụ y tế</span>
              <ChevronDown
                className={`w-4 h-4 text-[var(--color-fg-subtle)] transition-transform duration-200 ${
                  openSection === 'services' ? 'rotate-180 text-[var(--color-plum-primary)]' : ''
                }`}
              />
            </button>
            {openSection === 'services' && (
              <div className="bg-[var(--color-bg-secondary)]/50 px-2 py-1.5 space-y-0.5 border-t border-[var(--color-border-subtle)]">
                <Link
                  to="/dich-vu"
                  onClick={onClose}
                  aria-current={checkActive('/dich-vu') ? 'page' : undefined}
                  className={`block px-3 py-2 text-xs font-medium hover:text-[var(--color-plum-primary)] ${checkActive('/dich-vu') ? 'text-[var(--color-plum-primary)] font-semibold bg-[var(--color-bg-primary)]/50 rounded-md' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Tất cả dịch vụ
                </Link>
                <Link
                  to="/dich-vu/kham-dieu-tri"
                  onClick={onClose}
                  aria-current={checkActive('/dich-vu/kham-dieu-tri') ? 'page' : undefined}
                  className={`block px-3 py-2 text-xs font-medium hover:text-[var(--color-plum-primary)] ${checkActive('/dich-vu/kham-dieu-tri') ? 'text-[var(--color-plum-primary)] font-semibold bg-[var(--color-bg-primary)]/50 rounded-md' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Khám & điều trị lâm sàng
                </Link>
                <Link
                  to="/dich-vu/noi-tru"
                  onClick={onClose}
                  aria-current={checkActive('/dich-vu/noi-tru') ? 'page' : undefined}
                  className={`block px-3 py-2 text-xs font-medium hover:text-[var(--color-plum-primary)] ${checkActive('/dich-vu/noi-tru') ? 'text-[var(--color-plum-primary)] font-semibold bg-[var(--color-bg-primary)]/50 rounded-md' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Chăm sóc nội trú 24/7
                </Link>
                <Link
                  to="/dich-vu/spa"
                  onClick={onClose}
                  aria-current={checkActive('/dich-vu/spa') ? 'page' : undefined}
                  className={`block px-3 py-2 text-xs font-medium hover:text-[var(--color-plum-primary)] ${checkActive('/dich-vu/spa') ? 'text-[var(--color-plum-primary)] font-semibold bg-[var(--color-bg-primary)]/50 rounded-md' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Spa & Grooming thẩm mỹ
                </Link>
                <Link
                  to="/dich-vu/cap-cuu"
                  onClick={onClose}
                  aria-current={checkActive('/dich-vu/cap-cuu') ? 'page' : undefined}
                  className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[var(--color-warm-orange-dark)] bg-amber-50/80 rounded-lg"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Cấp cứu 24/24
                  </span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[var(--color-warm-orange-dark)] text-white font-bold">
                    Khẩn cấp
                  </span>
                </Link>
                <Link
                  to="/bang-gia"
                  onClick={onClose}
                  aria-current={checkActive('/bang-gia') ? 'page' : undefined}
                  className={`block px-3 py-2 text-xs font-medium hover:text-[var(--color-plum-primary)] ${checkActive('/bang-gia') ? 'text-[var(--color-plum-primary)] font-semibold bg-[var(--color-bg-primary)]/50 rounded-md' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Bảng giá niêm yết
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/cau-chuyen"
            onClick={onClose}
            aria-current={isCauChuyenActive ? 'page' : undefined}
            className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-colors ${
              isCauChuyenActive
                ? 'bg-[var(--color-bg-secondary)] text-[var(--color-plum-primary)] font-semibold'
                : 'text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)]'
            }`}
          >
            Câu chuyện điều trị
          </Link>

          {/* Group 3: Góc thú cưng */}
          <div className="rounded-xl overflow-hidden border border-[var(--color-border-subtle)]">
            <button
              type="button"
              aria-expanded={openSection === 'petCorner'}
              onClick={() => toggleSection('petCorner')}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-sm font-medium bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-secondary)] cursor-pointer ${isPetCornerGroupActive ? 'text-[var(--color-plum-primary)] font-semibold' : 'text-[var(--color-fg-primary)]'}`}
            >
              <span>Góc thú cưng</span>
              <ChevronDown
                className={`w-4 h-4 text-[var(--color-fg-subtle)] transition-transform duration-200 ${
                  openSection === 'petCorner' ? 'rotate-180 text-[var(--color-plum-primary)]' : ''
                }`}
              />
            </button>
            {openSection === 'petCorner' && (
              <div className="bg-[var(--color-bg-secondary)]/50 px-2 py-1.5 space-y-0.5 border-t border-[var(--color-border-subtle)]">
                <Link
                  to="/goc-thu-cung"
                  onClick={onClose}
                  aria-current={checkActive('/goc-thu-cung') ? 'page' : undefined}
                  className={`block px-3 py-2 text-xs font-medium hover:text-[var(--color-plum-primary)] ${checkActive('/goc-thu-cung') ? 'text-[var(--color-plum-primary)] font-semibold bg-[var(--color-bg-primary)]/50 rounded-md' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Kiến thức chăm sóc
                </Link>
                <Link
                  to="/goc-thu-cung?cat=news"
                  onClick={onClose}
                  aria-current={checkActive('/goc-thu-cung?cat=news') ? 'page' : undefined}
                  className={`block px-3 py-2 text-xs font-medium hover:text-[var(--color-plum-primary)] ${checkActive('/goc-thu-cung?cat=news') ? 'text-[var(--color-plum-primary)] font-semibold bg-[var(--color-bg-primary)]/50 rounded-md' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Tin tức & Hoạt động
                </Link>
                <Link
                  to="/san-pham"
                  onClick={onClose}
                  aria-current={checkActive('/san-pham') ? 'page' : undefined}
                  className={`block px-3 py-2 text-xs font-medium hover:text-[var(--color-plum-primary)] ${checkActive('/san-pham') ? 'text-[var(--color-plum-primary)] font-semibold bg-[var(--color-bg-primary)]/50 rounded-md' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Sản phẩm chọn lọc
                </Link>
              </div>
            )}
          </div>

          {/* Liên hệ */}
          <Link
            to="/lien-he"
            onClick={onClose}
            aria-current={checkActive('/lien-he') ? 'page' : undefined}
            className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-colors ${
              checkActive('/lien-he')
                ? 'bg-[var(--color-bg-secondary)] text-[var(--color-plum-primary)] font-semibold'
                : 'text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)]'
            }`}
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[var(--color-plum-primary)]" />
              <span>Liên hệ & Chỉ đường</span>
            </span>
          </Link>

          {/* Account links */}
          <div className="pt-3 border-t border-[var(--color-border-subtle)] grid grid-cols-2 gap-2">
            <Link
              to="/dang-nhap"
              onClick={onClose}
              aria-current={checkActive('/dang-nhap') ? 'page' : undefined}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold active:scale-[0.98] ${checkActive('/dang-nhap') ? 'border-[var(--color-plum-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-plum-primary)] font-semibold' : 'border-[var(--color-border-subtle)] text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)]'}`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </Link>
            <Link
              to="/dang-ky"
              onClick={onClose}
              aria-current={checkActive('/dang-ky') ? 'page' : undefined}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold active:scale-[0.98] ${checkActive('/dang-ky') ? 'border-[var(--color-plum-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-plum-primary)] font-semibold' : 'border-[var(--color-border-subtle)] text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)]'}`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng ký</span>
            </Link>
          </div>
        </div>

        {/* Drawer Bottom Info */}
        <div className="p-4 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-subtle)] space-y-3">
          <a
            href={HOSPITAL_CONTACT.hotlineTel}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-xs shadow-[var(--shadow-warm-orange)] active:scale-[0.98]"
          >
            <Phone className="w-4 h-4" />
            <span>Gọi Cấp cứu 24/24: {HOSPITAL_CONTACT.hotlineDisplay}</span>
          </a>

          <Link
            to="/dat-lich"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-semibold text-xs shadow-xs active:scale-[0.98]"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Đặt lịch hẹn</span>
          </Link>

          <div className="flex items-start gap-2 text-[11px] text-[var(--color-fg-muted)] pt-1">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
            <span>{HOSPITAL_CONTACT.address}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Mobile Bottom Quick CTA Bar
 * Dải hành động nhanh cố định đáy màn hình trên thiết bị di động
 * Tối ưu safe-area-inset-bottom cho thiết bị iPhone có thanh Home Indicator
 */
export const MobileBottomBar: React.FC = () => {
  return (
    <div
      role="region"
      aria-label="Thanh tác vụ nhanh khẩn cấp"
      style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom, 0px))' }}
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[var(--color-bg-card)]/95 backdrop-blur-md border-t border-[var(--color-border-subtle)] p-2.5 flex items-center gap-2 shadow-[var(--shadow-float)]"
    >
      <a
        href={HOSPITAL_CONTACT.hotlineTel}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[var(--color-warm-orange)] text-white font-semibold text-xs shadow-[var(--shadow-warm-orange)] active:scale-[0.98] transition-transform"
      >
        <Phone className="w-3.5 h-3.5" />
        <span>Cấp cứu 24/24</span>
      </a>

      <Link
        to="/dat-lich"
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[var(--color-plum-primary)] text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-transform"
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>Đặt lịch khám</span>
      </Link>
    </div>
  )
}
