'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Menu, X, ChevronDown, Activity, Users, Zap, TrendingUp, Mail, Phone, MapPin } from 'lucide-react'

import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import TeamSection from '@/components/TeamSection'
import AudienceSection from '@/components/AudienceSection'
import TechnologySection from '@/components/TechnologySection'
import AdvantagesSection from '@/components/AdvantagesSection'
import ServicesSection from '@/components/ServicesSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <TeamSection />
      <AudienceSection />
      <TechnologySection />
      <AdvantagesSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </main>
  )
}

