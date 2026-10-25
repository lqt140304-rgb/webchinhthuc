import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Calendar, Menu, ShieldAlert } from 'lucide-react'
import { isLinkActive, isGroupActive } from '@/utils/navigation'

interface DropdownItem {
  label: string
  href: string
  description?: string
  isEmergency?: boolean
}

interface NavGroup {
  id: string
  label: string
  items: DropdownItem[]
  matchPrefixes: string[]
}

const navGroups: NavGroup[] = [
  {
    id: 'about',
    label: 'Về Lê Sơn',
    matchPrefixes: ['/gioi-thieu', '/doi-ngu', '/co-so-vat-chat'],
    items: [
      { label: 'Giới thiệu', href: '/gioi-thieu', description: 'Lịch sử & triết lý chăm sóc y khoa' },
      { label: 'Đội ngũ bác sĩ', href: '/doi-ngu', description: 'Bác sĩ trưởng Lê Thái Sơn & cộng sự' },
      { label: 'Cơ sở vật chất', href: '/co-so-vat-chat', description: 'Phòng khám & trang thiết bị chuyên dụng' },
    ],
  },
  {
    id: 'services',
    label: 'Dịch vụ',
    matchPrefixes: ['/dich-vu', '/bang-gia'],
    items: [
      { label: 'Tất cả dịch vụ', href: '/dich-vu', description: 'Tổng quan danh mục dịch vụ y tế thú y' },
      { label: 'Khám & điều trị', href: '/dich-vu/kham-dieu-tri', description: 'Khám lâm sàng, chẩn đoán & phẫu thuật' },
      { label: 'Nội trú chuyên biệt', href: '/dich-vu/noi-tru', description: 'Chăm sóc nội trú 24/7 theo dõi liên tục' },
      { label: 'Spa & Grooming', href: '/dich-vu/spa', description: 'Tắm trị liệu & vệ sinh thẩm mỹ' },
      { label: 'Cấp cứu 24/24', href: '/dich-vu/cap-cuu', description: 'Tiếp nhận xử lý khẩn cấp 24/7', isEmergency: true },
      { label: 'Bảng giá niêm yết', href: '/bang-gia', description: 'Minh bạch chi phí dịch vụ tham chiếu' },
    ],
  },
  {
    id: 'petCorner',
    label: 'Góc thú cưng',
    matchPrefixes: ['/goc-thu-cung', '/san-pham'],
    items: [
      { label: 'Kiến thức chăm sóc', href: '/goc-thu-cung', description: 'Dinh dưỡng y khoa & phòng bệnh thú cưng' },
      { label: 'Tin tức & Sự kiện', href: '/goc-thu-cung?cat=news', description: 'Thông báo & hoạt động phòng khám' },
      { label: 'Sản phẩm chọn lọc', href: '/san-pham', description: 'Dinh dưỡng & phụ kiện được bác sĩ khuyên dùng' },
    ],
  },
]

interface HeaderProps {
  onOpenMobileMenu: () => void
  menuButtonRef?: React.RefObject<HTMLButtonElement | null>
  isMobileMenuOpen?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  menuButtonRef,
  isMobileMenuOpen = false,
}) => {
  const location = useLocation()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const openedByHoverRef = useRef<{ [key: string]: boolean }>({})

  const [prevPath, setPrevPath] = useState(location.pathname + location.search)

  // Tự động đóng dropdown khi chuyển tuyến đường
  if (prevPath !== location.pathname + location.search) {
    setPrevPath(location.pathname + location.search)
    setActiveDropdown(null)
  }

  // Đóng khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Đóng và trả lại focus cho nút trigger tương ứng
  const closeDropdown = useCallback((id: string, returnFocus = true) => {
    setActiveDropdown((current) => (current === id ? null : current))
    openedByHoverRef.current[id] = false
    if (returnFocus && triggerRefs.current[id]) {
      triggerRefs.current[id]?.focus()
    }
  }, [])

  // Xử lý bàn phím cho phím Escape và Arrow
  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      closeDropdown(id, true)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (activeDropdown !== id) {
        setActiveDropdown(id)
      }
      setTimeout(() => {
        const firstLink = menuRefs.current[id]?.querySelector('a')
        firstLink?.focus()
      }, 30)
    }
  }

  const handleMenuKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      closeDropdown(id, true)
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const menu = menuRefs.current[id]
      if (!menu) return
      const links = Array.from(menu.querySelectorAll('a'))
      const currentIndex = links.indexOf(document.activeElement as HTMLAnchorElement)
      if (e.key === 'ArrowDown') {
        const nextIndex = (currentIndex + 1) % links.length
        links[nextIndex]?.focus()
      } else {
        const prevIndex = (currentIndex - 1 + links.length) % links.length
        links[prevIndex]?.focus()
      }
    }
  }

  const isHomeActive = isLinkActive('/', location.pathname, location.search)
  const isCauChuyenActive = isGroupActive(['/cau-chuyen'], location.pathname)
  const isLienHeActive = isGroupActive(['/lien-he'], location.pathname)

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg-primary)]/95 backdrop-blur-md border-b border-[var(--color-border-subtle)] transition-colors">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* BRAND LOGO (Không gắn aria-current theo chuẩn P1-3) */}
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-plum-primary)] rounded-xl"
          aria-label="Về Trang chủ Bệnh viện Thú y Lê Sơn"
        >
          <img
            src="/images/logo.png"
            alt="Logo Bệnh viện Thú y Lê Sơn"
            className="w-9 h-9 sm:w-11 sm:h-11 object-cover rounded-lg sm:rounded-xl shadow-xs transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-serif font-bold text-sm sm:text-base xl:text-lg tracking-tight text-[var(--color-plum-deep)] leading-tight">
              LÊ SƠN
            </span>
            <span className="hidden min-[380px]:inline text-[10px] sm:text-xs uppercase font-medium tracking-widest text-[var(--color-fg-muted)]">
              Bệnh viện Thú y
            </span>
          </div>
        </Link>

        {/* DESKTOP & LAPTOP NAVIGATION (CENTER) */}
        <nav
          ref={navRef}
          aria-label="Điều hướng chính"
          className="hidden lg:flex items-center gap-2 xl:gap-4 2xl:gap-6"
        >
          <Link
            to="/"
            aria-current={isHomeActive ? 'page' : undefined}
            className={`text-xs xl:text-sm font-medium transition-colors whitespace-nowrap py-2 border-b-2 ${
              isHomeActive
                ? 'text-[var(--color-plum-primary)] font-semibold border-[var(--color-plum-primary)]'
                : 'text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)] border-transparent'
            }`}
          >
            Trang chủ
          </Link>

          {/* DROPDOWN GROUPS */}
          {navGroups.map((group) => {
            const isOpen = activeDropdown === group.id
            const isGroupCurrent = isGroupActive(group.matchPrefixes, location.pathname)
            const dropdownId = `dropdown-menu-${group.id}`
            const triggerId = `dropdown-trigger-${group.id}`

            return (
              <div
                key={group.id}
                className="relative"
                onMouseEnter={() => {
                  openedByHoverRef.current[group.id] = true
                  setActiveDropdown(group.id)
                }}
                onMouseLeave={() => {
                  openedByHoverRef.current[group.id] = false
                  setActiveDropdown(null)
                }}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    openedByHoverRef.current[group.id] = false
                    setActiveDropdown(null)
                  }
                }}
              >
                <button
                  type="button"
                  id={triggerId}
                  ref={(el) => {
                    triggerRefs.current[group.id] = el
                  }}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  aria-controls={dropdownId}
                  onClick={() => {
                    if (openedByHoverRef.current[group.id]) {
                      // Nếu mở do rê chuột: click vào trigger giữ nguyên trạng thái mở để tương tác
                      openedByHoverRef.current[group.id] = false
                      setActiveDropdown(group.id)
                    } else {
                      // Click bật / tắt dropdown bình thường
                      setActiveDropdown((curr) => (curr === group.id ? null : group.id))
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, group.id)}
                  className={`inline-flex items-center gap-1 py-2 text-xs xl:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                    isGroupCurrent || isOpen
                      ? 'text-[var(--color-plum-primary)] font-semibold border-[var(--color-plum-primary)]'
                      : 'text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)] border-transparent'
                  }`}
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[var(--color-plum-primary)]' : 'text-[var(--color-fg-subtle)]'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={dropdownId}
                    role="menu"
                    aria-labelledby={triggerId}
                    ref={(el) => {
                      menuRefs.current[group.id] = el
                    }}
                    onKeyDown={(e) => handleMenuKeyDown(e, group.id)}
                    className="absolute top-full left-0 w-72 pt-2 z-50 transition-all duration-150"
                  >
                    <div className="bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border-subtle)] shadow-[var(--shadow-card)] p-2 backdrop-blur-md">
                      {group.items.map((item) => {
                        const isItemCurrent = isLinkActive(item.href, location.pathname, location.search)
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            role="menuitem"
                            aria-current={isItemCurrent ? 'page' : undefined}
                            onClick={() => {
                              openedByHoverRef.current[group.id] = false
                              setActiveDropdown(null)
                            }}
                            className={`flex flex-col p-2.5 rounded-xl transition-colors ${
                              item.isEmergency
                                ? 'bg-amber-50/80 hover:bg-amber-100 text-[var(--color-warm-orange-dark)]'
                                : isItemCurrent
                                  ? 'bg-[var(--color-bg-secondary)] text-[var(--color-plum-primary)] font-semibold'
                                  : 'hover:bg-[var(--color-bg-secondary)] text-[var(--color-fg-primary)]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs xl:text-sm font-semibold ${
                                  item.isEmergency ? 'text-[var(--color-warm-orange-dark)] flex items-center gap-1.5' : ''
                                }`}
                              >
                                {item.isEmergency && <ShieldAlert className="w-3.5 h-3.5" />}
                                {item.label}
                              </span>
                              {item.isEmergency && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-warm-orange-dark)] text-white">
                                  24/24
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <span className="text-[11px] text-[var(--color-fg-subtle)] mt-0.5 leading-snug">
                                {item.description}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          <Link
            to="/cau-chuyen"
            aria-current={isCauChuyenActive ? 'page' : undefined}
            className={`text-xs xl:text-sm font-medium transition-colors whitespace-nowrap py-2 border-b-2 ${
              isCauChuyenActive
                ? 'text-[var(--color-plum-primary)] font-semibold border-[var(--color-plum-primary)]'
                : 'text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)] border-transparent'
            }`}
          >
            Câu chuyện
          </Link>

          <Link
            to="/lien-he"
            aria-current={isLienHeActive ? 'page' : undefined}
            className={`text-xs xl:text-sm font-medium transition-colors whitespace-nowrap py-2 border-b-2 ${
              isLienHeActive
                ? 'text-[var(--color-plum-primary)] font-semibold border-[var(--color-plum-primary)]'
                : 'text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)] border-transparent'
            }`}
          >
            Liên hệ
          </Link>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Account Links (Visible on Laptop 1024px+ & Desktop) */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-[var(--color-fg-muted)] border-r border-[var(--color-border-subtle)] pr-3 xl:pr-4">
            <Link
              to="/dang-nhap"
              aria-current={location.pathname === '/dang-nhap' ? 'page' : undefined}
              className="hover:text-[var(--color-plum-primary)] font-medium transition-colors py-1 whitespace-nowrap"
            >
              Đăng nhập
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              to="/dang-ky"
              aria-current={location.pathname === '/dang-ky' ? 'page' : undefined}
              className="hover:text-[var(--color-plum-primary)] font-medium transition-colors py-1 whitespace-nowrap"
            >
              Đăng ký
            </Link>
          </div>

          {/* Primary CTA */}
          <Link
            to="/dat-lich"
            aria-current={location.pathname === '/dat-lich' ? 'page' : undefined}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 xl:px-5 xl:py-2.5 rounded-xl bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white text-xs xl:text-sm font-semibold transition-all shadow-xs active:scale-[0.98] whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
            <span className="hidden min-[380px]:inline">Đặt lịch khám</span>
            <span className="min-[380px]:hidden">Đặt lịch</span>
          </Link>

          {/* Mobile Drawer Hamburger Button */}
          <button
            type="button"
            ref={menuButtonRef}
            onClick={onOpenMobileMenu}
            aria-label="Mở menu điều hướng trên thiết bị di động"
            aria-haspopup="dialog"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-dialog"
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
