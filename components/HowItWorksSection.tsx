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
      color: 'from-primary-500 to-orange-500',
    },
    {
      number: '02',
      icon: Target,
      title: 'Индивидуальный план',
      description: 'Разработка персонализированной программы тренировок и питания на основе ваших данных',
      color: 'from-orange-500 to-primary-600',
    },
    {
      number: '03',
      icon: Dumbbell,
      title: 'Тренировки',
      description: 'Регулярные тренировки с контролем техники и постоянной поддержкой вашего тренера',
      color: 'from-primary-600 to-orange-600',
    },
    {
      number: '04',
      icon: TrendingUp,
      title: 'Результат',
      description: 'Достижение поставленных целей с отслеживанием прогресса и корректировкой программы',
      color: 'from-orange-600 to-primary-500',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Как это <span className="text-primary-500">работает</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Простой и понятный процесс от первой консультации до достижения ваших целей
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                {/* Number Badge */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${step.color} text-white font-bold text-2xl mb-6`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-4">
                  <step.icon className="text-primary-500" size={40} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>

              {/* Arrow (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <a
            href="#contact"
            className="inline-block bg-gradient-to-r from-primary-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Записаться на консультацию
          </a>
        </motion.div>
      </div>
    </section>
  )
}

