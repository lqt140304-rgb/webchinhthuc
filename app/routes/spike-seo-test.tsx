export function meta() {
  return [
    { title: 'Thử Nghiệm Kiến Trúc SEO — Architecture Spike 01' },
    {
      name: 'description',
      content:
        'Trang thử nghiệm kỹ thuật đánh giá khả năng sinh mã HTML tĩnh và SEO metadata độc lập của React Router 7 Framework Mode.',
    },
    { property: 'og:title', content: 'Thử Nghiệm Kiến Trúc SEO — Architecture Spike 01' },
    {
      property: 'og:description',
      content:
        'Trang thử nghiệm kỹ thuật đánh giá khả năng sinh mã HTML tĩnh và SEO metadata độc lập của React Router 7 Framework Mode.',
    },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: 'https://lesonpet.vn/spike-seo-test' },
    { property: 'og:image', content: 'https://lesonpet.vn/images/og-spike.webp' },
    { tagName: 'link', rel: 'canonical', href: 'https://lesonpet.vn/spike-seo-test' },
  ]
}

export default function SpikeSeoTestRoute() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-8 border-b border-stone-200 pb-6">
        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold mb-3">
          SPIKE-01-VERIFIED-ROUTE
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-plum-primary)] mb-4">
          Xác Minh Hiển Thị SEO HTML Tĩnh Không Cần JavaScript
        </h1>
        <p className="text-stone-600 text-lg leading-relaxed">
          Trang này được tạo riêng biệt trong khuôn khổ Architecture Spike 01 để kiểm thử khả năng
          kết xuất mã HTML ban đầu (Prerendered HTML) trực tiếp từ máy chủ build của React Router 7
          Framework Mode.
        </p>
      </header>

      <div className="space-y-6 text-stone-700 leading-relaxed">
        <section className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
          <h2 className="text-xl font-bold text-stone-900 mb-3">
            1. Các chỉ số kiểm thử Gate A (Rendering & SEO)
          </h2>
          <ul className="list-disc list-inside space-y-2 text-stone-600">
            <li>
              <strong>Thẻ &lt;title&gt;:</strong> Riêng biệt theo từng route, không bị trùng với
              trang chủ.
            </li>
            <li>
              <strong>Thẻ Meta Description:</strong> Chứa thông tin mô tả độc lập cho bot tìm kiếm.
            </li>
            <li>
              <strong>Thẻ Open Graph:</strong> Hỗ trợ đầy đủ og:title, og:description, og:image,
              og:url.
            </li>
            <li>
              <strong>Nội dung HTML ngữ nghĩa:</strong> Có đầy đủ h1, h2, p, article trong mã HTML
              gốc trước khi trình duyệt tải script.
            </li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl border border-stone-200">
          <h2 className="text-xl font-bold text-stone-900 mb-3">
            2. Kết luận kiểm chứng sơ bộ
          </h2>
          <p>
            Mã HTML tĩnh được sinh ra tại thời điểm build mà không đòi hỏi Node.js runtime SSR khi
            phục vụ người dùng cuối. Toàn bộ trải nghiệm điều hướng phía client (Client-side
            hydration) vẫn được bảo toàn sau khi script tải xong.
          </p>
        </section>
      </div>
    </article>
  )
}
