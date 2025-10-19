'use client'

import { motion } from 'framer-motion'
import { Smartphone, BarChart3, Heart, Database, TrendingUp, Zap, Activity } from 'lucide-react'

export default function TechnologySection() {
  const technologies = [
    {
      icon: Smartphone,
      title: 'Система питания Harvard',
      description: 'Интеграция с методикой Harvard T.H. Chan School of Public Health для оптимального баланса макронутриентов и контроля калорийности',
      image: '🥗',
    },
    {
      icon: BarChart3,
      title: 'Аналитика FatSecret',
      description: 'Автоматизированные ежемесячные отчеты с детальным анализом динамики веса, состава тела и пищевых привычек',
      image: '📊',
    },
    {
      icon: Heart,
      title: 'Кардиомониторинг',
      description: 'Индивидуальное планирование тренировочных зон на основе показателей ЧСС покоя, максимальной ЧСС и анаэробного порога',
      image: '💓',
    },
  ]

  const workflow = [
    {
      number: '1',
      title: 'Сбор данных',
      description: 'Автоматический сбор биометрических показателей, активности и питания через мобильные приложения и носимые устройства',
      icon: Database,
    },
    {
      number: '2',
      title: 'Анализ',
      description: 'Обработка данных с помощью алгоритмов машинного обучения для выявления закономерностей и прогнозирования результатов',
      icon: TrendingUp,
    },
    {
      number: '3',
      title: 'Персонализация',
      description: 'Автоматическая корректировка программ на основе индивидуального прогресса и изменения показателей здоровья',
      icon: Zap,
    },
    {
      number: '4',
      title: 'Результат',
      description: 'Достижение поставленных целей с максимальной эффективностью и минимальными временными затратами',
      icon: Activity,
    },
  ]

  return (
    <section id="technology" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Технологическая <span className="text-primary-500">платформа и инновации</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Технологическая экосистема Hardcase представляет собой интегрированную платформу, объединяющую передовые IT-решения,
            искусственный интеллект и облачные технологии для максимальной эффективности оздоровительных программ
          </p>
        </motion.div>

        {/* Technology Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-white to-primary-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary-100">
                <div className="text-6xl mb-6 text-center">{tech.image}</div>
                <div className="flex items-center justify-center mb-4">
                  <tech.icon className="text-primary-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{tech.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Workflow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Как это работает</h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            {workflow.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-primary-50 to-orange-50 p-6 rounded-2xl hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-500 to-orange-500 text-white font-bold text-xl rounded-full mb-4">
                    {step.number}
                  </div>
                  <step.icon className="text-primary-500 mb-4" size={32} />
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
                {index < workflow.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary-500 to-orange-500 p-8 md:p-12 rounded-3xl text-white text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Непрерывный мониторинг прогресса</h3>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Наша платформа обеспечивает непрерывный мониторинг прогресса в режиме реального времени, позволяя специалистам оперативно
            вносить корректировки в программы и гарантировать достижение поставленных целей в оптимальные сроки
          </p>
        </motion.div>
      </div>
    </section>
  )
}

