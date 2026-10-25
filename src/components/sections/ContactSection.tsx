import React, { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'kham-tong-quat',
    note: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
            Đăng Ký & Tư Vấn
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Liên Hệ Hoặc Đặt Lịch Hẹn
          </p>
          <p className="mt-2 text-slate-600 text-sm">
            Điền thông tin bên dưới, nhân viên hỗ trợ sẽ liên hệ xác nhận trong vòng 15 phút.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
              <h3 className="text-2xl font-bold text-slate-900">Gửi thông tin thành công!</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                Cảm ơn bạn đã liên hệ. Đội ngũ Lê Sơn sẽ gọi điện trực tiếp để xác nhận và tư vấn chi tiết cho bạn.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline">
                Gửi yêu cầu khác
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Dịch vụ cần hỗ trợ
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="kham-tong-quat">Khám & Kiểm Tra Toàn Diện</option>
                  <option value="tu-van-chuyen-sau">Tư Vấn & Chăm Sóc Chuyên Sâu</option>
                  <option value="dinh-ky-tron-goi">Gói Chăm Sóc Định Kỳ</option>
                  <option value="khac">Khác / Yêu cầu riêng</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Ghi chú thêm
                </label>
                <textarea
                  rows={3}
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Mô tả cụ thể nhu cầu hoặc khung giờ bạn mong muốn..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                <Send className="w-4 h-4" />
                <span>Gửi Thông Tin Đặt Lịch</span>
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
