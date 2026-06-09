'use client'

import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import WedgeSection from '@/components/WedgeSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import TransformationsSection from '@/components/TransformationsSection'
import TeamSection from '@/components/TeamSection'
import SocialProofSection from '@/components/SocialProofSection'
import ServicesSection from '@/components/ServicesSection'
import AdvantagesSection from '@/components/AdvantagesSection'
import ProtocolSection from '@/components/ProtocolSection'
import DemoCTASection from '@/components/DemoCTASection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <WedgeSection />
      <HowItWorksSection />
      <TransformationsSection />
      <TeamSection />
      <SocialProofSection />
      <ServicesSection />
      <AdvantagesSection />
      <ProtocolSection />
      <DemoCTASection />
      <ContactSection />
      <Footer />
    </main>
  )
}
