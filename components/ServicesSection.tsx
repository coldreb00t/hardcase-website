'use client'

import { motion } from 'framer-motion'
import { ClipboardCheck, Dumbbell, Activity, Calculator, Camera, FileText } from 'lucide-react'

export default function ServicesSection() {
  const services = [
    {
      icon: ClipboardCheck,
      title: 'Тестирование и анамнез',
      description: 'Антропометрия, состав тела, функциональное тестирование, анализ образа жизни',
      gradient: 'from-primary-500 to-orange-500',
    },
    {
      icon: Dumbbell,
      title: 'Программа тренировок',
      description: 'Индивидуальный подход, постановка техники выполнения упражнений, решение поставленных целей и задач',
      gradient: 'from-orange-500 to-primary-600',
    },
    {
      icon: Activity,
      title: 'Дневник активности',
      description: 'Комплексный мониторинг физической активности, сна и восстановления для оптимальных результатов. Контроль пульсовых зон',
      gradient: 'from-primary-600 to-orange-600',
    },
    {
      icon: Calculator,
      title: 'Расчет КБЖУ',
      description: 'Персонализированные рекомендации по калорийности и соотношению белков, жиров и углеводов на основе методик Harvard Medical School',
      gradient: 'from-orange-600 to-primary-500',
    },
    {
      icon: Camera,
      title: 'Фотоотчеты питания',
      description: 'Визуальный контроль рациона с профессиональными рекомендациями по корректировке питания',
      gradient: 'from-primary-500 to-orange-500',
    },
    {
      icon: FileText,
      title: 'Ежемесячные отчеты',
      description: 'Детальный анализ прогресса через приложение FatSecret с визуализацией достижений и корректировкой планов. Анализ изменений состава тела',
      gradient: 'from-orange-500 to-primary-600',
    },
  ]

  const approachHighlights = [
    'Экспертные услуги: оздоровительные силовые тренировки, реабилитационные программы и рекомпозиция тела с применением доказательных методов',
    'Модульная система: контроль питания, тренировок, бытовой активности и прогресса на основе точных данных и цифровых инструментов',
    'Глобальная доступность: использование видеосвязи и IT-приложений для работы с клиентами по всему миру',
  ]

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-900">Персонализированные</span> <span className="text-primary-500">программы и модули</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Модульная система позволяет выбрать именно те услуги, которые вам нужны, и получать постоянную поддержку на всех этапах достижения целей
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group flex"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl blur-xl"
                style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              />
              <div className="relative bg-white border-2 border-gray-100 hover:border-primary-200 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col w-full">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${service.gradient} mb-6 self-start`}>
                  <service.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Approach Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-primary-500 via-orange-500 to-primary-600 p-8 md:p-12 rounded-3xl text-white mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Инновационное оздоровление через комплексное сопровождение
          </h3>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                Hardcase — это современный подход к оздоровлению, который объединяет экспертные знания,
                проверенные технологии и научно обоснованные методики для достижения ваших целей в фитнесе и здоровье.
              </p>
            </div>
            <div className="space-y-4">
              {approachHighlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-xl"
                >
                  <p className="text-white/95">{highlight}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-50 p-8 md:p-10 rounded-3xl border-2 border-primary-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Системный подход к здоровью
          </h3>
          <p className="text-gray-700 text-center leading-relaxed max-w-4xl mx-auto">
            Рекомпозиция тела достигается через систематический мониторинг ключевых метрик: калорийности потребления, показателей пульса
            и фотофиксации изменений. Все услуги доступны по всему миру благодаря использованию современных технологий видеосвязи и мобильных
            приложений.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

