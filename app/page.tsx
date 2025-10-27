'use client'

import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import SocialProofSection from '@/components/SocialProofSection'

// Lazy load components below the fold with ssr: false to avoid HTTP/2 chunking issues
// This loads components only on client-side when they become visible
const TransformationsSection = dynamic(() => import('@/components/TransformationsSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
})
const TeamSection = dynamic(() => import('@/components/TeamSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
})
const ServicesSection = dynamic(() => import('@/components/ServicesSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
})
const HowItWorksSection = dynamic(() => import('@/components/HowItWorksSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
})
const AdvantagesSection = dynamic(() => import('@/components/AdvantagesSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
})
const DemoCTASection = dynamic(() => import('@/components/DemoCTASection'), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
})
const ContactSection = dynamic(() => import('@/components/ContactSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
})
const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false,
})

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
