'use client'

import { motion } from 'framer-motion'
import { Activity, Shield, Zap } from 'lucide-react'

export default function WedgeSection() {
  const audience = [
    {
      icon: Activity,
      title: 'Колено',
      description: 'Травма ПКС, мениск, операция на колене — но ты не готов уходить из спорта.',
    },
    {
      icon: Shield,
      title: 'Спина',
      description: 'Грыжа, протрузия, боль в пояснице. Тебе сказали «поднимать нельзя» — а ты хочешь обратно к штанге.',
    },
    {
      icon: Zap,
      title: 'Плечо',
      description: 'Вывих, надрыв, импиджмент. Рука работает, но без уверенности и силы.',
    },
  ]

  return (
    <section id="wedge" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Клин */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
            Часто дело не в том, что тебя плохо лечили, а в том, что <span className="text-primary-500">недогрузили</span>: боль прошла, а сила — нет. И возвращает её не отдых, а <span className="text-primary-500">правильная нагрузка</span>.
          </p>
        </motion.div>

        {/* Кому это */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            Кому это <span className="text-primary-500">подходит</span>
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-3">
            Активным людям, которые тренируются и не готовы бросать спорт после травмы.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {audience.map((item, index) => (
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
              <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
