import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { ContactSection } from '@/components/sections/ContactSection'

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
