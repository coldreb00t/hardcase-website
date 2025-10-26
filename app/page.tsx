'use client'

import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import SocialProofSection from '@/components/SocialProofSection'

// Lazy load components below the fold for better initial page load
const TransformationsSection = dynamic(() => import('@/components/TransformationsSection'), {
  loading: () => <div className="min-h-screen" />,
})
const TeamSection = dynamic(() => import('@/components/TeamSection'), {
  loading: () => <div className="min-h-screen" />,
})
const ServicesSection = dynamic(() => import('@/components/ServicesSection'), {
  loading: () => <div className="min-h-screen" />,
})
const HowItWorksSection = dynamic(() => import('@/components/HowItWorksSection'), {
  loading: () => <div className="min-h-screen" />,
})
const AdvantagesSection = dynamic(() => import('@/components/AdvantagesSection'), {
  loading: () => <div className="min-h-screen" />,
})
const DemoCTASection = dynamic(() => import('@/components/DemoCTASection'), {
  loading: () => <div className="min-h-screen" />,
})
const ContactSection = dynamic(() => import('@/components/ContactSection'), {
  loading: () => <div className="min-h-screen" />,
})
const Footer = dynamic(() => import('@/components/Footer'))

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <SocialProofSection />
      <TransformationsSection />
      <TeamSection />
      <ServicesSection />
      <HowItWorksSection />
      <AdvantagesSection />
      <DemoCTASection />
      <ContactSection />
      <Footer />
    </main>
  )
}
