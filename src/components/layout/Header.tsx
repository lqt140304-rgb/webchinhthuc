import React from 'react'
import { Phone, Calendar, Menu } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="font-extrabold text-xl tracking-tight text-blue-600">
            LÊ SƠN
          </span>
          <span className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
            Official
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#about" className="hover:text-blue-600 transition-colors">Giới thiệu</a>
          <a href="#services" className="hover:text-blue-600 transition-colors">Dịch vụ</a>
          <a href="#features" className="hover:text-blue-600 transition-colors">Ưu điểm</a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">Liên hệ</a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:0900000000"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600"
          >
            <Phone className="w-4 h-4 text-blue-600" />
            <span>Hotline 24/7</span>
          </a>
          <Button size="sm" className="hidden sm:inline-flex">
            <Calendar className="w-4 h-4" />
            <span>Đặt lịch ngay</span>
          </Button>
          <button className="md:hidden p-2 text-slate-600 hover:text-slate-900" aria-label="Menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
