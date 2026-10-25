import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, ChevronDown, Phone, Calendar, MapPin, ShieldAlert, LogIn, UserPlus } from 'lucide-react'

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

  // Đóng drawer khi tuyến đường thay đổi thông qua useEffect (không gọi trong render)
  useEffect(() => {
    if (isOpen) {
      onClose()
    }
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

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
      // Trả lại focus cho nút trigger mở menu
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
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng trên thiết bị di động"
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-[var(--color-bg-primary)] shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300"
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
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)]"
          >
            Trang chủ
          </Link>

          {/* Group 1: Về Lê Sơn */}
          <div className="rounded-xl overflow-hidden border border-[var(--color-border-subtle)]">
            <button
              type="button"
              aria-expanded={openSection === 'about'}
              onClick={() => toggleSection('about')}
              className="w-full flex items-center justify-between px-3.5 py-3 text-sm font-medium text-[var(--color-fg-primary)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-secondary)] cursor-pointer"
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
                  className="block px-3 py-2 text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)]"
                >
                  Giới thiệu
                </Link>
                <Link
                  to="/doi-ngu"
                  onClick={onClose}
                  className="block px-3 py-2 text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)]"
                >
                  Đội ngũ bác sĩ
                </Link>
                <Link
                  to="/co-so-vat-chat"
                  onClick={onClose}
                  className="block px-3 py-2 text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)]"
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
              className="w-full flex items-center justify-between px-3.5 py-3 text-sm font-medium text-[var(--color-fg-primary)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-secondary)] cursor-pointer"
            >
              <span>Dịch vụ</span>
              <ChevronDown
                className={`w-4 h-4 text-[var(--color-fg-subtle)] transition-transform duration-200 ${
                  openSection === 'services' ? 'rotate-180 text-[var(--color-plum-primary)]' : ''
                }`}
              />
            </button>
            {openSection === 'services' && (
              <div className="bg-[var(--color-bg-secondary)]/50 px-2 py-1.5 space-y-0.5 border-t border-[var(--color-border-subtle)]">
                <Link
                  to="/dich-vu/kham-dieu-tri"
                  onClick={onClose}
                  className="block px-3 py-2 text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)]"
                >
                  Khám & điều trị
                </Link>
                <Link
                  to="/dich-vu/noi-tru"
                  onClick={onClose}
                  className="block px-3 py-2 text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)]"
                >
                  Chăm sóc nội trú 24/7
                </Link>
                <Link
                  to="/dich-vu/spa"
                  onClick={onClose}
                  className="block px-3 py-2 text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)]"
                >
                  Spa & Grooming
                </Link>
                <Link
                  to="/dich-vu/cap-cuu"
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[var(--color-warm-orange)] bg-amber-50/70 rounded-lg"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Cấp cứu 24/24
                  </span>
                  <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-[var(--color-warm-orange)] text-white">
                    Khẩn cấp
                  </span>
                </Link>
                <Link
                  to="/bang-gia"
                  onClick={onClose}
                  className="block px-3 py-2 text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)]"
                >
                  Bảng giá niêm yết
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/cau-chuyen"
            onClick={onClose}
            className="flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)]"
          >
            Câu chuyện điều trị
          </Link>

          {/* Group 3: Góc thú cưng */}
          <div className="rounded-xl overflow-hidden border border-[var(--color-border-subtle)]">
            <button
              type="button"
              aria-expanded={openSection === 'petCorner'}
              onClick={() => toggleSection('petCorner')}
              className="w-full flex items-center justify-between px-3.5 py-3 text-sm font-medium text-[var(--color-fg-primary)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-secondary)] cursor-pointer"
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
                  className="block px-3 py-2 text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)]"
                >
                  Kiến thức chăm sóc
                </Link>
                <Link
                  to="/goc-thu-cung?tab=news"
                  onClick={onClose}
                  className="block px-3 py-2 text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)]"
                >
                  Tin tức hoạt động
                </Link>
                <Link
                  to="/san-pham"
                  onClick={onClose}
                  className="block px-3 py-2 text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)]"
                >
                  Sản phẩm chọn lọc
                </Link>
              </div>
            )}
          </div>

          {/* Account links */}
          <div className="pt-3 border-t border-[var(--color-border-subtle)] grid grid-cols-2 gap-2">
            <Link
              to="/dang-nhap"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </Link>
            <Link
              to="/dang-ky"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng ký</span>
            </Link>
          </div>
        </div>

        {/* Drawer Bottom Info */}
        <div className="p-4 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-subtle)] space-y-3">
          <a
            href="tel:0973555105"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-warm-orange)] hover:bg-[var(--color-warm-orange-hover)] text-white font-semibold text-xs shadow-[var(--shadow-warm-orange)]"
          >
            <Phone className="w-4 h-4" />
            <span>Gọi Cấp cứu 24/24: 097 355 51 05</span>
          </a>

          <Link
            to="/dat-lich"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white font-semibold text-xs shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Đặt lịch hẹn</span>
          </Link>

          <div className="flex items-start gap-2 text-[11px] text-[var(--color-fg-muted)] pt-1">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-plum-primary)] shrink-0 mt-0.5" />
            <span>101 Khuất Duy Tiến, Nhân Chính, Thanh Xuân, Hà Nội</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Mobile Bottom Quick CTA Bar
 * Dải hành động nhanh cố định đáy màn hình trên thiết bị di động
 */
export const MobileBottomBar: React.FC = () => {
  return (
    <div
      role="region"
      aria-label="Thanh tác vụ nhanh khẩn cấp"
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[var(--color-bg-card)]/95 backdrop-blur-md border-t border-[var(--color-border-subtle)] p-2.5 flex items-center gap-2 shadow-[var(--shadow-float)]"
    >
      <a
        href="tel:0973555105"
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[var(--color-warm-orange)] text-white font-semibold text-xs shadow-[var(--shadow-warm-orange)] active:scale-98 transition-transform"
      >
        <Phone className="w-3.5 h-3.5" />
        <span>Cấp cứu 24/24</span>
      </a>

      <Link
        to="/dat-lich"
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[var(--color-plum-primary)] text-white font-semibold text-xs shadow-sm active:scale-98 transition-transform"
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>Đặt lịch khám</span>
      </Link>
    </div>
  )
}
