'use client'

import { motion } from 'framer-motion'

export default function PricingSection() {
  const plans = [
    {
      name: 'Своими силами',
      price: '4 500 ₽',
      period: 'разово · 12 недель',
      description:
        'Полная программа возвращения силы под зал. Для фазы, когда боль уже позади, а сила и уверенность не вернулись. Для тех, кто дисциплинированно делает сам.',
    },
    {
      name: 'С тренером',
      price: '17 000 ₽',
      period: 'за программу · 12 недель',
      description:
        'Индивидуальная программа, разбор техники по видео и чек-ины. Для тех, кому нужно, чтобы за техникой следили. Старт — после бесплатного разбора.',
    },
    {
      name: 'Полное сопровождение',
      price: '50 000 ₽',
      period: 'в месяц',
      description:
        'Индивидуальное онлайн-ведение: десять тренировок в месяц и сопровождение между ними. Для сложных случаев и тех, кому нужен максимум внимания.',
    },
  ]

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Сколько это <span className="text-primary-500">стоит</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Цены честные, без звёздочек. Но не покупай вслепую: начни с бесплатного разбора — подскажем минимум,
            который решает твою задачу.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow border-2 border-gray-100 hover:border-primary-200 p-8 flex flex-col"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">{plan.name}</h3>
              <div className="mb-6">
                <div className="text-3xl font-bold text-primary-500">{plan.price}</div>
                <div className="text-sm text-gray-500 mt-1">{plan.period}</div>
              </div>
              <p className="text-gray-600 leading-relaxed flex-grow">{plan.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-gray-500 mt-10"
        >
          Какой тариф нужен именно тебе — поймём на разборе.
        </motion.p>
      </div>
    </section>
  )
}
