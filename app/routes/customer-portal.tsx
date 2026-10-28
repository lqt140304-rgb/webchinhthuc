export function meta() {
  return [
    { title: 'Cổng Khách Hàng — Bệnh Viện Thú Y Lê Sơn' },
    { name: 'robots', content: 'noindex, nofollow' },
  ]
}

export default function CustomerPortalRoute() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="p-8 bg-amber-50 border border-amber-200 rounded-2xl">
        <h1 className="text-2xl font-serif font-bold text-amber-900 mb-2">
          Cổng Quản Lý Hồ Sơ Khách Hàng (Customer Portal)
        </h1>
        <p className="text-amber-800 text-sm mb-4">
          [Architecture Spike 01 Check]: Tuyến đường này được cấu hình SPA client-side thuần túy.
          Dữ liệu khách hàng không bao giờ được đưa vào mã HTML tĩnh lúc prerender (Zero Data Leakage).
        </p>
        <span className="inline-block px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-semibold">
          ROBOTS: NOINDEX, NOFOLLOW | CLIENT-ONLY ROUTE
        </span>
      </div>
    </div>
  )
}
