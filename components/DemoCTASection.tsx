'use client'

import { motion } from 'framer-motion'
import { Play, CheckCircle } from 'lucide-react'

export default function DemoCTASection() {
  const benefits = [
    'Бесплатная консультация',
    'Индивидуальный план',
    'Поддержка 24/7',
    'Гарантия результата',
  ]

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Video Placeholder */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute inset-0 bg-primary-900/30"></div>
        {/* Можно добавить видео тренировки на фоне */}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Video Demo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
              {/* Video Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Play className="text-white ml-1" size={32} />
                  </div>
                  <p className="text-white text-lg font-semibold">Посмотрите демо</p>
                  <p className="text-gray-400 text-sm">2 минуты</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: CTA */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Начните свою <span className="text-primary-400">трансформацию</span> сегодня
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Запишитесь на бесплатную консультацию и получите персональный план тренировок и питания
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center"
                >
                  <CheckCircle className="text-primary-400 mr-3 flex-shrink-0" size={24} />
                  <span className="text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-gradient-to-r from-primary-500 to-orange-500 text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-primary-500/50 transition-all duration-300"
            >
              Записаться бесплатно
            </motion.a>
            <p className="text-gray-400 text-sm mt-4">
              * Без скрытых платежей. Первая консультация абсолютно бесплатна.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

