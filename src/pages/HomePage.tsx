import React from 'react'
import { useRouteSeo } from '@/hooks/useRouteSeo'
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
