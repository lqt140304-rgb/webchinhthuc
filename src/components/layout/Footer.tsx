import React from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">LÊ SƠN OFFICIAL</h3>
          <p className="text-sm leading-relaxed mb-4">
            Đơn vị uy tín hàng đầu cung cấp giải pháp, dịch vụ chuyên nghiệp, tận tâm và chất lượng cao.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Liên kết nhanh</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#about" className="hover:text-white transition-colors">Về chúng tôi</a></li>
            <li><a href="#services" className="hover:text-white transition-colors">Danh mục dịch vụ</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">Năng lực cốt lõi</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Tư vấn & Báo giá</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Dịch vụ chính</h4>
          <ul className="space-y-2 text-sm">
            <li>Khám & Chăm sóc chuyên sâu</li>
            <li>Tư vấn & Giải pháp kỹ thuật</li>
            <li>Dịch vụ định kỳ trọn gói</li>
            <li>Hỗ trợ & cấp cứu 24/7</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Thông tin liên hệ</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>Cơ sở chính: Số 123 Đường Trung Tâm, TP. Hồ Chí Minh</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <span>0900.000.000</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <span>contact@leson.vn</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Thứ 2 - CN: 07:30 - 20:30</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Lê Sơn Website. Bản quyền thuộc về webchinhthuc.
      </div>
    </footer>
  )
}
