'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Activity, Video } from 'lucide-react'

export default function ApproachSection() {
  const highlights = [
    {
      icon: ShieldCheck,
      title: 'Доказательный подход',
      description: 'Реабилитация и силовой тренинг на основе доказательных методов, а не «терпи и не нагружай».',
    },
    {
      icon: Activity,
      title: 'Контроль нагрузки',
      description: 'Ведём тренировки, нагрузку и восстановление по этапам и на основе точных данных.',
    },
    {
      icon: Video,
      title: 'Работа онлайн',
      description: 'Сопровождение по видеосвязи — занимаемся независимо от твоего города.',
    },
  ]

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-900">Hardcase — это</span> <span className="text-primary-500">онлайн силовая реабилитация</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Возвращаем активных людей к тренировкам после травм и боли — онлайн, по этапам и на доказательных методах,
            а не «терпи и забудь про спорт».
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow border-t-4 border-primary-500"
            >
              <div className="inline-flex p-4 rounded-2xl bg-primary-100 mb-6">
                <item.icon className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
