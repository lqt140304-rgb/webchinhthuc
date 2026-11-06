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
      {/* Light Translucent Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/20 backdrop-blur-[2px] transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Compact Floating Popover Card với dialog semantics */}
      <div
        id="mobile-nav-dialog"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng trên thiết bị di động"
        className="fixed top-15.5 sm:top-20 right-3 sm:right-6 w-[310px] sm:w-[340px] max-h-[calc(100vh-7.5rem)] bg-white/95 backdrop-blur-2xl rounded-3xl border border-purple-200/80 shadow-[0_24px_60px_-12px_rgba(66,18,71,0.28)] flex flex-col z-50 animate-popover-spring overflow-hidden"
      >
        {/* Compact Card Top Bar */}
        <div className="px-4 py-2 bg-purple-50/70 border-b border-purple-100/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Logo Bệnh viện Thú y Lê Sơn"
              className="w-7 h-7 object-contain rounded-md"
            />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xs text-[var(--color-plum-deep)] tracking-wide leading-tight">
                BỆNH VIỆN LÊ SƠN
              </span>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 leading-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-status-beacon" />
                Cấp cứu 24/24
              </span>
            </div>
          </div>

          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Đóng menu điều hướng"
            className="inline-flex items-center justify-center gap-1 px-3 py-2 min-h-[44px] min-w-[44px] rounded-xl text-xs font-semibold text-[var(--color-fg-muted)] hover:text-[var(--color-plum-deep)] hover:bg-purple-100/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] transition-colors cursor-pointer"
          >
            <span>Đóng</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Nav Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <Link
            to="/"
            onClick={onClose}
            aria-current={checkActive('/') ? 'page' : undefined}
            className={`flex items-center justify-between px-3.5 py-2.5 min-h-[44px] rounded-xl font-medium text-xs transition-colors ${
              checkActive('/')
                ? 'bg-purple-50 text-[var(--color-plum-primary)] font-semibold'
                : 'text-[var(--color-fg-primary)] hover:bg-purple-50/50'
            }`}
          >
            Trang chủ
          </Link>

          {/* Group 1: Về Lê Sơn */}
          <div className="rounded-xl overflow-hidden border border-purple-100/80 bg-white/70">
            <button
              type="button"
              aria-expanded={openSection === 'about'}
              onClick={() => toggleSection('about')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 min-h-[44px] text-xs font-medium hover:bg-purple-50/50 cursor-pointer transition-colors ${isAboutGroupActive ? 'text-[var(--color-plum-primary)] font-semibold' : 'text-[var(--color-fg-primary)]'}`}
            >
              <span>Về Lê Sơn</span>
              <ChevronDown
                className={`w-4 h-4 text-[var(--color-fg-subtle)] transition-transform duration-200 ${
                  openSection === 'about' ? 'rotate-180 text-[var(--color-plum-primary)]' : ''
                }`}
              />
            </button>
            {openSection === 'about' && (
              <div className="bg-purple-50/40 px-2 py-1 space-y-1 border-t border-purple-100/60">
                <Link
                  to="/gioi-thieu"
                  onClick={onClose}
                  aria-current={checkActive('/gioi-thieu') ? 'page' : undefined}
                  className={`flex items-center px-3 py-2.5 min-h-[40px] text-xs font-medium rounded-lg hover:text-[var(--color-plum-primary)] ${checkActive('/gioi-thieu') ? 'text-[var(--color-plum-primary)] font-semibold bg-white shadow-2xs' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Giới thiệu bệnh viện
                </Link>
                <Link
                  to="/doi-ngu"
                  onClick={onClose}
                  aria-current={checkActive('/doi-ngu') ? 'page' : undefined}
                  className={`flex items-center px-3 py-2.5 min-h-[40px] text-xs font-medium rounded-lg hover:text-[var(--color-plum-primary)] ${checkActive('/doi-ngu') ? 'text-[var(--color-plum-primary)] font-semibold bg-white shadow-2xs' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Đội ngũ bác sĩ
                </Link>
                <Link
                  to="/co-so-vat-chat"
                  onClick={onClose}
                  aria-current={checkActive('/co-so-vat-chat') ? 'page' : undefined}
                  className={`flex items-center px-3 py-2.5 min-h-[40px] text-xs font-medium rounded-lg hover:text-[var(--color-plum-primary)] ${checkActive('/co-so-vat-chat') ? 'text-[var(--color-plum-primary)] font-semibold bg-white shadow-2xs' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Cơ sở vật chất
                </Link>
              </div>
            )}
          </div>

          {/* Group 2: Dịch vụ */}
          <div className="rounded-xl overflow-hidden border border-purple-100/80 bg-white/70">
            <button
              type="button"
              aria-expanded={openSection === 'services'}
              onClick={() => toggleSection('services')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 min-h-[44px] text-xs font-medium hover:bg-purple-50/50 cursor-pointer transition-colors ${isServicesGroupActive ? 'text-[var(--color-plum-primary)] font-semibold' : 'text-[var(--color-fg-primary)]'}`}
            >
              <span>Dịch vụ y tế</span>
              <ChevronDown
                className={`w-4 h-4 text-[var(--color-fg-subtle)] transition-transform duration-200 ${
                  openSection === 'services' ? 'rotate-180 text-[var(--color-plum-primary)]' : ''
                }`}
              />
            </button>
            {openSection === 'services' && (
              <div className="bg-purple-50/40 px-2 py-1 space-y-1 border-t border-purple-100/60">
                <Link
                  to="/dich-vu"
                  onClick={onClose}
                  aria-current={checkActive('/dich-vu') ? 'page' : undefined}
                  className={`flex items-center px-3 py-2.5 min-h-[40px] text-xs font-medium rounded-lg hover:text-[var(--color-plum-primary)] ${checkActive('/dich-vu') ? 'text-[var(--color-plum-primary)] font-semibold bg-white shadow-2xs' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Tất cả dịch vụ
                </Link>
                <Link
                  to="/dich-vu/kham-dieu-tri"
                  onClick={onClose}
                  aria-current={checkActive('/dich-vu/kham-dieu-tri') ? 'page' : undefined}
                  className={`flex items-center px-3 py-2.5 min-h-[40px] text-xs font-medium rounded-lg hover:text-[var(--color-plum-primary)] ${checkActive('/dich-vu/kham-dieu-tri') ? 'text-[var(--color-plum-primary)] font-semibold bg-white shadow-2xs' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Khám & điều trị lâm sàng
                </Link>
                <Link
                  to="/dich-vu/noi-tru"
                  onClick={onClose}
                  aria-current={checkActive('/dich-vu/noi-tru') ? 'page' : undefined}
                  className={`flex items-center px-3 py-2.5 min-h-[40px] text-xs font-medium rounded-lg hover:text-[var(--color-plum-primary)] ${checkActive('/dich-vu/noi-tru') ? 'text-[var(--color-plum-primary)] font-semibold bg-white shadow-2xs' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Chăm sóc nội trú 24/7
                </Link>
                <Link
                  to="/dich-vu/spa"
                  onClick={onClose}
                  aria-current={checkActive('/dich-vu/spa') ? 'page' : undefined}
                  className={`flex items-center px-3 py-2.5 min-h-[40px] text-xs font-medium rounded-lg hover:text-[var(--color-plum-primary)] ${checkActive('/dich-vu/spa') ? 'text-[var(--color-plum-primary)] font-semibold bg-white shadow-2xs' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Spa & Grooming thẩm mỹ
                </Link>
                <Link
                  to="/dich-vu/cap-cuu"
                  onClick={onClose}
                  aria-current={checkActive('/dich-vu/cap-cuu') ? 'page' : undefined}
                  className="flex items-center justify-between px-3 py-2.5 min-h-[40px] text-xs font-semibold text-[var(--color-warm-orange-dark)] bg-amber-50/90 rounded-lg"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Cấp cứu 24/24
                  </span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-full bg-[var(--color-warm-orange-dark)] text-white font-bold">
                    24/24
                  </span>
                </Link>
                <Link
                  to="/bang-gia"
                  onClick={onClose}
                  aria-current={checkActive('/bang-gia') ? 'page' : undefined}
                  className={`flex items-center px-3 py-2.5 min-h-[40px] text-xs font-medium rounded-lg hover:text-[var(--color-plum-primary)] ${checkActive('/bang-gia') ? 'text-[var(--color-plum-primary)] font-semibold bg-white shadow-2xs' : 'text-[var(--color-fg-muted)]'}`}
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
            className={`flex items-center justify-between px-3.5 py-2.5 min-h-[44px] rounded-xl font-medium text-xs transition-colors ${
              isCauChuyenActive
                ? 'bg-purple-50 text-[var(--color-plum-primary)] font-semibold'
                : 'text-[var(--color-fg-primary)] hover:bg-purple-50/50'
            }`}
          >
            Câu chuyện điều trị
          </Link>

          {/* Group 3: Góc thú cưng */}
          <div className="rounded-xl overflow-hidden border border-purple-100/80 bg-white/70">
            <button
              type="button"
              aria-expanded={openSection === 'petCorner'}
              onClick={() => toggleSection('petCorner')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 min-h-[44px] text-xs font-medium hover:bg-purple-50/50 cursor-pointer transition-colors ${isPetCornerGroupActive ? 'text-[var(--color-plum-primary)] font-semibold' : 'text-[var(--color-fg-primary)]'}`}
            >
              <span>Góc thú cưng</span>
              <ChevronDown
                className={`w-4 h-4 text-[var(--color-fg-subtle)] transition-transform duration-200 ${
                  openSection === 'petCorner' ? 'rotate-180 text-[var(--color-plum-primary)]' : ''
                }`}
              />
            </button>
            {openSection === 'petCorner' && (
              <div className="bg-purple-50/40 px-2 py-1 space-y-1 border-t border-purple-100/60">
                <Link
                  to="/goc-thu-cung"
                  onClick={onClose}
                  aria-current={checkActive('/goc-thu-cung') ? 'page' : undefined}
                  className={`flex items-center px-3 py-2.5 min-h-[40px] text-xs font-medium rounded-lg hover:text-[var(--color-plum-primary)] ${checkActive('/goc-thu-cung') ? 'text-[var(--color-plum-primary)] font-semibold bg-white shadow-2xs' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Kiến thức chăm sóc
                </Link>
                <Link
                  to="/goc-thu-cung?cat=news"
                  onClick={onClose}
                  aria-current={checkActive('/goc-thu-cung?cat=news') ? 'page' : undefined}
                  className={`flex items-center px-3 py-2.5 min-h-[40px] text-xs font-medium rounded-lg hover:text-[var(--color-plum-primary)] ${checkActive('/goc-thu-cung?cat=news') ? 'text-[var(--color-plum-primary)] font-semibold bg-white shadow-2xs' : 'text-[var(--color-fg-muted)]'}`}
                >
                  Tin tức & Hoạt động
                </Link>
                <Link
                  to="/san-pham"
                  onClick={onClose}
                  aria-current={checkActive('/san-pham') ? 'page' : undefined}
                  className={`flex items-center px-3 py-2.5 min-h-[40px] text-xs font-medium rounded-lg hover:text-[var(--color-plum-primary)] ${checkActive('/san-pham') ? 'text-[var(--color-plum-primary)] font-semibold bg-white shadow-2xs' : 'text-[var(--color-fg-muted)]'}`}
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
            className={`flex items-center justify-between px-3.5 py-2.5 min-h-[44px] rounded-xl font-medium text-xs transition-colors ${
              checkActive('/lien-he')
                ? 'bg-purple-50 text-[var(--color-plum-primary)] font-semibold'
                : 'text-[var(--color-fg-primary)] hover:bg-purple-50/50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[var(--color-plum-primary)]" />
              <span>Liên hệ & Chỉ đường</span>
            </span>
          </Link>

          {/* Compact Account links */}
          <div className="pt-2 border-t border-purple-100/80 grid grid-cols-2 gap-2">
            <Link
              to="/dang-nhap"
              onClick={onClose}
              aria-current={checkActive('/dang-nhap') ? 'page' : undefined}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 min-h-[44px] rounded-xl border text-xs font-semibold active:scale-[0.98] ${checkActive('/dang-nhap') ? 'border-[var(--color-plum-primary)] bg-purple-50 text-[var(--color-plum-primary)]' : 'border-purple-100 text-[var(--color-fg-primary)] hover:bg-purple-50/50'}`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </Link>
            <Link
              to="/dang-ky"
              onClick={onClose}
              aria-current={checkActive('/dang-ky') ? 'page' : undefined}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 min-h-[44px] rounded-xl border text-xs font-semibold active:scale-[0.98] ${checkActive('/dang-ky') ? 'border-[var(--color-plum-primary)] bg-purple-50 text-[var(--color-plum-primary)]' : 'border-purple-100 text-[var(--color-fg-primary)] hover:bg-purple-50/50'}`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng ký</span>
            </Link>
          </div>
        </div>

        {/* Compact Card Bottom Quick Actions */}
        <div className="p-3 bg-purple-50/60 border-t border-purple-100/80 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <a
              href={HOSPITAL_CONTACT.hotlineTel}
              className="flex items-center justify-center gap-1.5 py-3 px-2 min-h-[44px] rounded-xl bg-gradient-to-r from-[var(--color-warm-orange)] to-[#A34507] text-white font-semibold text-xs shadow-xs active:scale-[0.98]"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>Cấp cứu 24/24</span>
            </a>

            <Link
              to="/dat-lich"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 py-3 px-2 min-h-[44px] rounded-xl bg-gradient-to-r from-[var(--color-plum-primary)] to-[var(--color-plum-deep)] text-white font-semibold text-xs shadow-xs active:scale-[0.98]"
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Đặt lịch hẹn</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1 text-[11px] text-[var(--color-fg-muted)]">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-plum-primary)] shrink-0" />
            <span className="truncate">{HOSPITAL_CONTACT.shortAddress}</span>
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
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/90 backdrop-blur-xl border-t border-[var(--color-border-subtle)]/80 px-3.5 py-2.5 flex items-center gap-2.5 shadow-[0_-8px_32px_rgba(66,18,71,0.08)]"
    >
      <a
        href={HOSPITAL_CONTACT.hotlineTel}
        className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-gradient-to-r from-[var(--color-warm-orange)] to-[#A34507] text-white font-semibold text-xs shadow-[var(--shadow-glow-orange)] active:scale-[0.97] transition-all"
      >
        <Phone className="w-3.5 h-3.5" />
        <span>Cấp cứu 24/24</span>
      </a>

      <Link
        to="/dat-lich"
        className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-gradient-to-r from-[var(--color-plum-primary)] to-[var(--color-plum-deep)] text-white font-semibold text-xs shadow-[var(--shadow-glow-plum)] active:scale-[0.97] transition-all"
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>Đặt lịch khám</span>
      </Link>
    </div>
  )
}
