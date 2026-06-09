'use client'

import { motion } from 'framer-motion'
import { ClipboardCheck, Dumbbell, Activity, TrendingUp, Video, RefreshCw } from 'lucide-react'

export default function ServicesSection() {
  const services = [
    {
      icon: ClipboardCheck,
      title: 'Тестирование и анамнез',
      description: 'Функциональное тестирование, оценка ограничений после травмы, анализ образа жизни и нагрузок',
      gradient: 'from-primary-500 to-orange-500',
    },
    {
      icon: Dumbbell,
      title: 'Программа тренировок',
      description: 'Индивидуальный план, постановка техники упражнений, прогрессия нагрузки по этапам восстановления',
      gradient: 'from-orange-500 to-primary-600',
    },
    {
      icon: Activity,
      title: 'Контроль нагрузки',
      description: 'Мониторинг физической активности, сна и восстановления. Контроль пульсовых зон, чтобы не перегрузить',
      gradient: 'from-primary-600 to-orange-600',
    },
    {
      icon: TrendingUp,
      title: 'Этапы возврата в спорт',
      description: 'От первых безопасных движений до рабочих весов и возврата к твоему виду спорта — по шагам',
      gradient: 'from-orange-600 to-primary-500',
    },
    {
      icon: Video,
      title: 'Онлайн-сопровождение',
      description: 'Работа по видеосвязи, разбор техники по видео и обратная связь между тренировками',
      gradient: 'from-primary-500 to-orange-500',
    },
    {
      icon: RefreshCw,
      title: 'Прогресс и корректировка',
      description: 'Регулярная оценка прогресса и пересмотр плана под текущее состояние и цели',
      gradient: 'from-orange-500 to-primary-600',
    },
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
            <span className="text-gray-900">Что входит в</span> <span className="text-primary-500">работу с тренером</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Вот из чего состоит индивидуальная работа — от оценки до возврата к твоему спорту. Полный набор входит в «Полное сопровождение»; в «С тренером» — индивидуальная программа, разбор техники по видео и чек-ины.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </div>
    </section>
  )
}

