import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock, ShieldAlert, Heart } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--color-plum-deep)] text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-[var(--color-border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Logo Bệnh viện Thú y Lê Sơn"
                className="w-12 h-12 object-cover rounded-xl shadow-xs border border-white/20"
              />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg tracking-tight text-white leading-tight">
                  BỆNH VIỆN THÚ Y LÊ SƠN
                </span>
                <span className="text-[10px] uppercase font-medium tracking-widest text-[var(--color-plum-orchid)]">
                  Chăm Sóc Y Tế Thú Cưng Tận Tâm
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Đơn vị y tế thú cưng chuyên nghiệp tại Hà Nội, cung cấp dịch vụ thăm khám, điều trị nội ngoại khoa, phẫu thuật, nội trú và cấp cứu 24/24 với tinh thần trách nhiệm.
            </p>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 max-w-sm">
              <ShieldAlert className="w-5 h-5 text-[var(--color-warm-orange)] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Đường dây nóng Cấp cứu 24/24</p>
                <a
                  href="tel:0973555105"
                  className="text-sm font-bold text-[var(--color-warm-orange)] hover:underline"
                >
                  097 355 51 05
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wide uppercase">
              Về Lê Sơn
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/gioi-thieu" className="hover:text-white transition-colors">
                  Giới thiệu bệnh viện
                </Link>
              </li>
              <li>
                <Link to="/doi-ngu" className="hover:text-white transition-colors">
                  Đội ngũ bác sĩ
                </Link>
              </li>
              <li>
                <Link to="/co-so-vat-chat" className="hover:text-white transition-colors">
                  Cơ sở vật chất
                </Link>
              </li>
              <li>
                <Link to="/bang-gia" className="hover:text-white transition-colors">
                  Bảng giá niêm yết
                </Link>
              </li>
              <li>
                <Link to="/cau-chuyen" className="hover:text-white transition-colors">
                  Câu chuyện điều trị
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wide uppercase">
              Dịch Vụ Y Tế
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dich-vu/kham-dieu-tri" className="hover:text-white transition-colors">
                  Khám & điều trị lâm sàng
                </Link>
              </li>
              <li>
                <Link to="/dich-vu/noi-tru" className="hover:text-white transition-colors">
                  Chăm sóc nội trú 24/7
                </Link>
              </li>
              <li>
                <Link to="/dich-vu/spa" className="hover:text-white transition-colors">
                  Spa & Grooming thẩm mỹ
                </Link>
              </li>
              <li>
                <Link
                  to="/dich-vu/cap-cuu"
                  className="text-[var(--color-warm-orange)] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Cấp cứu khẩn cấp 24/24</span>
                </Link>
              </li>
              <li>
                <Link to="/goc-thu-cung" className="hover:text-white transition-colors">
                  Cẩm nang & Góc thú cưng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (100% verified) */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wide uppercase">
              Thông Tin Phòng Khám
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--color-plum-orchid)] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  101 Khuất Duy Tiến, Phường Nhân Chính, Quận Thanh Xuân, Hà Nội
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[var(--color-plum-orchid)] shrink-0" />
                <a href="tel:0973555105" className="hover:text-white font-semibold">
                  097 355 51 05
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[var(--color-plum-orchid)] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Giờ khám tham chiếu:</p>
                  <p>08:00 – 21:00 (Tất cả các ngày)</p>
                  <p className="text-[11px] text-[var(--color-warm-orange)] mt-0.5 font-medium">
                    * Tiếp nhận cấp cứu: 24/24
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Bệnh viện Thú y Lê Sơn. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Đồng hành cùng thú cưng với tinh thần trách nhiệm</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  )
}
