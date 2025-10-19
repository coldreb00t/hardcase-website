'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      console.log('📱 Устройство:', mobile ? 'Мобильное' : 'Десктоп')
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Установка src напрямую через JavaScript (обход iOS ограничений)
    const videoSrc = isMobile 
      ? '/videos/hero-background-mobile.mp4'
      : '/videos/hero-background.mp4'
    
    video.src = videoSrc
    video.muted = true
    video.playsInline = true
    video.defaultMuted = true
    video.volume = 0
    video.loop = true
    ;(video as any).webkitPlaysInline = true

    let hasPlayed = false

    // Функция автоплея
    const attemptPlay = async () => {
      if (hasPlayed) return
      
      try {
        await video.play()
        hasPlayed = true
        console.log('✅ Видео запущено')
      } catch (err) {
        console.log('⚠️ Ожидание взаимодействия пользователя')
      }
    }

    // Множественные попытки при разных событиях
    video.addEventListener('loadedmetadata', attemptPlay)
    video.addEventListener('loadeddata', attemptPlay)
    video.addEventListener('canplay', attemptPlay)
    
    // Отложенные попытки
    const timers = [
      setTimeout(attemptPlay, 100),
      setTimeout(attemptPlay, 500),
      setTimeout(attemptPlay, 1000),
    ]

    // IntersectionObserver - запуск когда видео в зоне видимости
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          attemptPlay()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(video)

    // Запуск при ЛЮБОМ взаимодействии с документом (скролл, тап, клик)
    const playOnAnyInteraction = () => {
      attemptPlay()
    }
    
    // Слушаем все возможные события взаимодействия
    document.addEventListener('touchstart', playOnAnyInteraction, { once: true, passive: true })
    document.addEventListener('touchmove', playOnAnyInteraction, { once: true, passive: true })
    document.addEventListener('scroll', playOnAnyInteraction, { once: true, passive: true })
    document.addEventListener('click', playOnAnyInteraction, { once: true })

    return () => {
      video.removeEventListener('loadedmetadata', attemptPlay)
      video.removeEventListener('loadeddata', attemptPlay)
      video.removeEventListener('canplay', attemptPlay)
      timers.forEach(clearTimeout)
      observer.disconnect()
      document.removeEventListener('touchstart', playOnAnyInteraction)
      document.removeEventListener('touchmove', playOnAnyInteraction)
      document.removeEventListener('scroll', playOnAnyInteraction)
      document.removeEventListener('click', playOnAnyInteraction)
    }
  }, [isMobile])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background Video */}
      <div className="absolute inset-0">
        {/* Background Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ backgroundColor: '#000' }}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          webkit-playsinline="true"
          disablePictureInPicture
        >
          {/* Src устанавливается динамически через JavaScript в useEffect */}
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

