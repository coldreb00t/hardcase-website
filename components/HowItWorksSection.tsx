'use client'

import { motion } from 'framer-motion'
import { ClipboardCheck, Target, Dumbbell, TrendingUp } from 'lucide-react'

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      icon: ClipboardCheck,
      title: 'Консультация',
      description: 'Бесплатная первая встреча для оценки вашего текущего состояния, целей и особенностей здоровья',
    },
    {
      number: '02',
      icon: Target,
      title: 'Индивидуальный план',
      description: 'Разработка персонализированной программы тренировок и питания на основе ваших данных',
    },
    {
      number: '03',
      icon: Dumbbell,
      title: 'Тренировки',
      description: 'Регулярные тренировки с контролем техники и постоянной поддержкой вашего тренера',
    },
    {
      number: '04',
      icon: TrendingUp,
      title: 'Результат',
      description: 'Достижение поставленных целей с отслеживанием прогресса и корректировкой программы',
    },
  ]

  return (
    <section id="how-it-works" className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-background.png')" }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Как это <span className="text-primary-400">работает</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Простой и понятный процесс от первой консультации до достижения ваших целей
          </p>
        </motion.div>

        {/* Timeline Style */}
        <div className="relative">
          {/* Connecting Line (desktop only) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-orange-500 to-primary-500"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {/* Step Card */}
                <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-2xl border-2 border-white/20 hover:border-primary-400 transition-all duration-300 hover:shadow-2xl group">
                  {/* Number Circle */}
                  <div className="relative z-10 flex justify-center -mt-16 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-2xl">{step.number}</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-xl bg-primary-500/20 group-hover:bg-primary-500/30 transition-colors">
                      <step.icon className="text-primary-300" size={32} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Arrow Connector (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 -right-6 z-20">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-primary-400 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href="#contact"
            className="inline-block bg-gradient-to-r from-primary-500 to-orange-500 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Записаться на бесплатную консультацию
          </a>
        </motion.div>
      </div>
    </section>
  )
}

