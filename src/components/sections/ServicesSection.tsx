import React from 'react'
import { Stethoscope, HeartHandshake, Award, Clock } from 'lucide-react'

const services = [
  {
    icon: Stethoscope,
    title: 'Khám & Kiểm Tra Toàn Diện',
    desc: 'Hệ thống thiết bị hỗ trợ thăm khám tiên tiến, chẩn đoán chính xác và tư vấn chi tiết.',
  },
  {
    icon: HeartHandshake,
    title: 'Dịch Vụ Tận Tâm & Chu Đáo',
    desc: 'Đội ngũ kỹ thuật viên và chuyên viên giàu kinh nghiệm, chu đáo trong từng khâu xử lý.',
  },
  {
    icon: Award,
    title: 'Quy Trình Chuẩn Hóa',
    desc: 'Các quy trình kiểm soát nghiêm ngặt theo tiêu chuẩn cao cấp, bảo đảm an toàn và hiệu quả tối ưu.',
  },
  {
    icon: Clock,
    title: 'Cấp Cứu & Trực Tuyến 24/7',
    desc: 'Hỗ trợ khẩn cấp, tiếp nhận thông tin và giải đáp mọi vấn đề phát sinh 24/7 không gián đoạn.',
  },
]

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
            Dịch Vụ Nổi Bật
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Giải Pháp Toàn Diện Cho Mọi Nhu Cầu
          </p>
          <p className="mt-3 text-slate-600 text-sm">
            Cung cấp những dịch vụ chất lượng với tiêu chuẩn an toàn và hiệu quả hàng đầu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((srv, idx) => {
            const Icon = srv.icon
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-400/80 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{srv.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{srv.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
