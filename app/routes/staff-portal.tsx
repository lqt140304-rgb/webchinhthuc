export function meta() {
  return [
    { title: 'Hệ Thống Vận Hành Y Khoa & Quản Lý — Bệnh Viện Thú Y Lê Sơn' },
    { name: 'robots', content: 'noindex, nofollow' },
  ]
}

export default function StaffPortalRoute() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="p-8 bg-slate-100 border border-slate-300 rounded-2xl">
        <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">
          Hệ Thống Quản Lý Nội Bộ & Vận Hành (Staff & Management Portal)
        </h1>
        <p className="text-slate-700 text-sm mb-4">
          [Architecture Spike 01 Check]: Tuyến đường chuyên dụng cho Bác sĩ, Spa và Quản trị.
          Tuyệt đối không render dữ liệu y lệnh, thuốc hoặc thông tin nội bộ trên HTML công khai.
        </p>
        <span className="inline-block px-3 py-1 bg-slate-300 text-slate-900 rounded-full text-xs font-semibold">
          ROBOTS: NOINDEX, NOFOLLOW | INTERNAL SPA SHELL
        </span>
      </div>
    </div>
  )
}
