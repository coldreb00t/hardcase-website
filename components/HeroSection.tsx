'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Aggressive video autoplay for iOS
    const forcePlay = async () => {
      try {
        video.muted = true
        video.playsInline = true
        video.defaultMuted = true
        video.volume = 0
        
        // Load video
        await video.load()
        
        // Try to play
        const playPromise = video.play()
        if (playPromise !== undefined) {
          await playPromise
        }
      } catch (error) {
        console.log('Video play attempt:', error)
      }
    }

    // Try to play immediately
    forcePlay()

    // Retry with delays for iOS
    const timeouts = [100, 300, 500, 1000, 2000]
    const timers = timeouts.map(delay => 
      setTimeout(() => forcePlay(), delay)
    )

    // Try on various video events
    const events = ['loadstart', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough']
    events.forEach(event => {
      video.addEventListener(event, forcePlay, { once: true })
    })

    // Use Intersection Observer to play when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          forcePlay()
        }
      })
    }, { threshold: 0.1 })
    
    observer.observe(video)

    // Cleanup
    return () => {
      timers.forEach(timer => clearTimeout(timer))
      observer.disconnect()
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background Video */}
      <div className="absolute inset-0">
        {/* Background Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/hero-background.png"
          className="absolute inset-0 w-full h-full object-cover"
          webkit-playsinline="true"
          x-webkit-airplay="allow"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          disablePictureInPicture
          disableRemotePlayback
        >
          <source src="/videos/hero-background.webm" type="video/webm" />
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
        {/* Optional accent overlay */}
        <div className="absolute inset-0 bg-primary-900/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="flex justify-center">
              <img
                src="/images/hardcase-logo.png"
                alt="HARD CASE"
                className="w-full max-w-2xl h-auto"
              />
            </div>
          </motion.div>

          <motion.p
            className="text-primary-400 text-lg sm:text-xl font-light tracking-wide uppercase mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            advanced recovery training
          </motion.p>

          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white/90 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Эксперты в силовом тренинге
          </motion.h2>

          <motion.p
            className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-12 font-light leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Превращаем цели в результаты через науку, опыт и силу.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.a
              href="#contact"
              className="bg-primary-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-600 transition-colors shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(251, 146, 60, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              Записаться на консультацию
            </motion.a>
            <motion.a
              href="#team"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Узнать больше
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="text-white/60" size={40} />
      </motion.div>
    </section>
  )
}

