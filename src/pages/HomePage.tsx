import React, { useEffect } from 'react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
import { HOSPITAL_CONTACT } from '@/config/contact'
import { HeroSection } from '@/components/sections/HeroSection'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { FeaturedServices } from '@/components/sections/FeaturedServices'
import { HighlightStory } from '@/components/sections/HighlightStory'
import { EditorialKnowledge } from '@/components/sections/EditorialKnowledge'
import { BookingContactSection } from '@/components/sections/BookingContactSection'

export const HomePage: React.FC = () => {
  useRouteSeo({
    title: 'Bệnh viện Thú y Lê Sơn — Chăm Sóc Y Tế Chuẩn Mực',
    description: 'Bệnh viện Thú y Lê Sơn tại 101 Khuất Duy Tiến, Hà Nội. Dịch vụ khám, nội trú, phẫu thuật và cấp cứu thú cưng 24/24 với đội ngũ nhân viên y tế tận tâm.',
    isIndexable: true,
  })

  // Chỉ phát JSON-LD VeterinaryCare trên trang chủ, xác nhận bởi người dùng ngày 26/10/2026
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'hospital-jsonld'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'VeterinaryCare',
      name: HOSPITAL_CONTACT.name,
      url: 'https://bvthuyleson.vn',
      telephone: '+84973555105',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '101 Khuất Duy Tiến',
        addressLocality: 'Thanh Xuân',
        addressRegion: 'Hà Nội',
        addressCountry: 'VN',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '08:00',
          closes: '21:00',
          description: 'Giờ khám tham chiếu',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
          description: 'Cấp cứu 24/24',
        },
      ],
    })
    document.head.appendChild(script)
    return () => {
      const el = document.getElementById('hospital-jsonld')
      if (el) el.remove()
    }
  }, [])

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. SECTION 1 — EDITORIAL HERO */}
      <HeroSection />

      {/* 2. SECTION 2 — VÌ SAO CHỌN LÊ SƠN? */}
      <WhyChooseUs />

      {/* 3. SECTION 3 — DỊCH VỤ TIÊU BIỂU */}
      <FeaturedServices />

      {/* 4. SECTION 4 — CÂU CHUYỆN NỔI BẬT */}
      <HighlightStory />

      {/* 5. SECTION 5 — GÓC KIẾN THỨC & TIN TỨC */}
      <EditorialKnowledge />

      {/* 6. SECTION 6 — ĐẶT LỊCH & LIÊN HỆ */}
      <BookingContactSection />
    </div>
  )
}
