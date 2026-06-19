'use client'

import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import ApproachSection from '@/components/ApproachSection'
import WedgeSection from '@/components/WedgeSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import TeamSection from '@/components/TeamSection'
import SocialProofSection from '@/components/SocialProofSection'
import ServicesSection from '@/components/ServicesSection'
import PricingSection from '@/components/PricingSection'
import ProtocolSection from '@/components/ProtocolSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <ApproachSection />
      <WedgeSection />
      <TeamSection />
      <SocialProofSection />
      <PricingSection />
      <ServicesSection />
      <HowItWorksSection />
      <ProtocolSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
