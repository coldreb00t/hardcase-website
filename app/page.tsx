'use client'

import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import SocialProofSection from '@/components/SocialProofSection'
import TransformationsSection from '@/components/TransformationsSection'
import TeamSection from '@/components/TeamSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import AdvantagesSection from '@/components/AdvantagesSection'
import ServicesSection from '@/components/ServicesSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import DemoCTASection from '@/components/DemoCTASection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <SocialProofSection />
      <TransformationsSection />
      <TeamSection />
      <HowItWorksSection />
      <AdvantagesSection />
      <ServicesSection />
      <TestimonialsSection />
      <DemoCTASection />
      <ContactSection />
      <Footer />
    </main>
  )
}

