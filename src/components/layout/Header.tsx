import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Phone, Calendar, Menu, ShieldAlert } from 'lucide-react'

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
}

const navGroups: NavGroup[] = [
  {
    id: 'about',
    label: 'Về Lê Sơn',
    items: [
      { label: 'Giới thiệu', href: '/gioi-thieu', description: 'Lịch sử & triết lý chăm sóc' },
      { label: 'Đội ngũ bác sĩ', href: '/doi-ngu', description: 'Bác sĩ trưởng Lê Thái Sơn & nhân sự' },
      { label: 'Cơ sở vật chất', href: '/co-so-vat-chat', description: 'Phòng khám & trang thiết bị' },
    ],
  },
  {
    id: 'services',
    label: 'Dịch vụ',
    items: [
      { label: 'Khám & điều trị', href: '/dich-vu/kham-dieu-tri', description: 'Khám lâm sàng, chẩn đoán, phẫu thuật' },
      { label: 'Nội trú', href: '/dich-vu/noi-tru', description: 'Chăm sóc nội trú 24/7 chuyên biệt' },
      { label: 'Spa & Grooming', href: '/dich-vu/spa', description: 'Tắm trị liệu & vệ sinh thẩm mỹ' },
      { label: 'Cấp cứu 24/24', href: '/dich-vu/cap-cuu', description: 'Tiếp nhận xử lý khẩn cấp 24/7', isEmergency: true },
      { label: 'Bảng giá', href: '/bang-gia', description: 'Minh bạch chi phí dịch vụ' },
    ],
  },
  {
    id: 'petCorner',
    label: 'Góc thú cưng',
    items: [
      { label: 'Kiến thức chăm sóc', href: '/goc-thu-cung', description: 'Dinh dưỡng & phòng bệnh' },
      { label: 'Tin tức', href: '/goc-thu-cung?tab=news', description: 'Hoạt động & thông báo' },
      { label: 'Sản phẩm', href: '/san-pham', description: 'Dinh dưỡng & phụ kiện chọn lọc' },
    ],
  },
]

interface HeaderProps {
  onOpenMobileMenu: () => void
  menuButtonRef?: React.RefObject<HTMLButtonElement | null>
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu, menuButtonRef }) => {
  const location = useLocation()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [prevPath, setPrevPath] = useState(location.pathname)
  const navRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Tự động đóng dropdown khi chuyển tuyến đường
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
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
      } else {
        // Focus first link in dropdown
        const firstLink = menuRefs.current[id]?.querySelector('a')
        firstLink?.focus()
      }
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

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg-primary)]/95 backdrop-blur-md border-b border-[var(--color-border-subtle)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* BRAND LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0 group focus-visible:rounded-lg"
          aria-label="Về Trang chủ Bệnh viện Thú y Lê Sơn"
        >
          <img
            src="/images/logo.png"
            alt="Logo Bệnh viện Thú y Lê Sơn"
            className="w-11 h-11 object-cover rounded-xl shadow-xs transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-[var(--color-plum-deep)] leading-tight">
              LÊ SƠN
            </span>
            <span className="text-[10px] sm:text-xs uppercase font-medium tracking-widest text-[var(--color-fg-muted)]">
              Bệnh viện Thú y
            </span>
          </div>
        </Link>

        {/* DESKTOP & LAPTOP NAVIGATION (CENTER) */}
        <nav
          ref={navRef}
          aria-label="Điều hướng chính"
          className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8"
        >
          <Link
            to="/"
            className={`text-xs xl:text-sm font-medium transition-colors whitespace-nowrap py-2 ${
              location.pathname === '/'
                ? 'text-[var(--color-plum-primary)] font-semibold'
                : 'text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)]'
            }`}
          >
            Trang chủ
          </Link>

          {/* DROPDOWN GROUPS */}
          {navGroups.map((group) => {
            const isOpen = activeDropdown === group.id
            const dropdownId = `dropdown-menu-${group.id}`
            const triggerId = `dropdown-trigger-${group.id}`

            return (
              <div
                key={group.id}
                className="relative"
                onMouseEnter={() => setActiveDropdown(group.id)}
                onMouseLeave={() => setActiveDropdown(null)}
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
                  onClick={() => setActiveDropdown(isOpen ? null : group.id)}
                  onKeyDown={(e) => handleKeyDown(e, group.id)}
                  className={`inline-flex items-center gap-1 py-2 text-xs xl:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isOpen
                      ? 'text-[var(--color-plum-primary)] font-semibold'
                      : 'text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)]'
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
                    className="absolute top-full left-0 w-72 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    <div className="bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border-subtle)] shadow-[var(--shadow-card)] p-2 backdrop-blur-md">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          role="menuitem"
                          onClick={() => setActiveDropdown(null)}
                          className={`flex flex-col p-2.5 rounded-xl transition-colors ${
                            item.isEmergency
                              ? 'bg-amber-50/70 hover:bg-amber-100/70 text-[var(--color-warm-orange)]'
                              : 'hover:bg-[var(--color-bg-secondary)] text-[var(--color-fg-primary)]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs xl:text-sm font-semibold ${
                                item.isEmergency ? 'text-[var(--color-warm-orange)] flex items-center gap-1.5' : ''
                              }`}
                            >
                              {item.isEmergency && <ShieldAlert className="w-3.5 h-3.5" />}
                              {item.label}
                            </span>
                            {item.isEmergency && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-warm-orange)] text-white">
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
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          <Link
            to="/cau-chuyen"
            className={`text-xs xl:text-sm font-medium transition-colors whitespace-nowrap py-2 ${
              location.pathname === '/cau-chuyen'
                ? 'text-[var(--color-plum-primary)] font-semibold'
                : 'text-[var(--color-fg-muted)] hover:text-[var(--color-plum-primary)]'
            }`}
          >
            Câu chuyện
          </Link>
        </nav>

        {/* RIGHT ACTIONS (LAPTOP & DESKTOP) */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-3 xl:gap-4 shrink-0">
          {/* Account Links (Visible on Laptop 1024px+ & Desktop) */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-[var(--color-fg-muted)] border-r border-[var(--color-border-subtle)] pr-3 xl:pr-4">
            <Link
              to="/dang-nhap"
              className="hover:text-[var(--color-plum-primary)] font-medium transition-colors py-1 whitespace-nowrap"
            >
              Đăng nhập
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              to="/dang-ky"
              className="hover:text-[var(--color-plum-primary)] font-medium transition-colors py-1 whitespace-nowrap"
            >
              Đăng ký
            </Link>
          </div>

          {/* Hotline Callout */}
          <a
            href="tel:0973555105"
            aria-label="Gọi hotline tiếp nhận 0973555105"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 xl:py-1.5 rounded-lg border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-warm-orange)] hover:bg-orange-50/70 transition-colors whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Hotline:</span>
            <span>097 355 51 05</span>
          </a>

          {/* Primary CTA */}
          <Link
            to="/dat-lich"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 xl:px-5 xl:py-2.5 rounded-xl bg-[var(--color-plum-primary)] hover:bg-[var(--color-plum-deep)] text-white text-xs xl:text-sm font-semibold transition-all shadow-sm active:scale-98 whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
            <span>Đặt lịch khám</span>
          </Link>

          {/* Mobile Drawer Hamburger Button */}
          <button
            type="button"
            ref={menuButtonRef}
            onClick={onOpenMobileMenu}
            aria-label="Mở menu điều hướng trên thiết bị di động"
            aria-haspopup="dialog"
            className="lg:hidden p-2 rounded-xl text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
