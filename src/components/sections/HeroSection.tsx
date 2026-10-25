import React from 'react'
import { ShieldCheck, Sparkles, ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 text-blue-700 text-xs sm:text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Giải Pháp Uy Tín & Dịch Vụ Chuẩn Mực</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight md:leading-tight">
          Nền Tảng Dịch Vụ Chuyên Nghiệp <span className="text-blue-600">Lê Sơn</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Cam kết đem đến trải nghiệm dịch vụ tin cậy, quy trình chuẩn hóa, đội ngũ tận tâm và ứng dụng công nghệ hiện đại phục vụ quý khách hàng.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="shadow-lg shadow-blue-500/20">
            <span>Khám phá dịch vụ</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="lg">
            <span>Tư vấn trực tiếp</span>
          </Button>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 border-t border-slate-200/80">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm font-semibold text-slate-900">99.8% Hài Lòng</p>
            <p className="text-xs text-slate-500">Đánh giá 5 sao từ khách hàng</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-blue-600 mb-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-900">100% Cam Kết</p>
            <p className="text-xs text-slate-500">Quy trình minh bạch & chuẩn chỉ</p>
          </div>

          <div className="col-span-2 md:col-span-1 flex flex-col items-center">
            <span className="text-xl font-bold text-slate-900 mb-0.5">24 / 7</span>
            <p className="text-sm font-semibold text-slate-900">Hỗ Trợ Tức Thì</p>
            <p className="text-xs text-slate-500">Sẵn sàng phản hồi mọi lúc</p>
          </div>
        </div>
      </div>
    </section>
  )
}
