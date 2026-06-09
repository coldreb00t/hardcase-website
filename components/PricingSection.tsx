'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

export default function PricingSection() {
  const plans = [
    {
      name: 'Своими силами',
      price: '4 500 ₽',
      period: 'разово · 12 недель',
      audience: 'Когда боль уже позади, а сила нет. Делаешь сам.',
      includes: [
        'Готовая программа возвращения силы',
        'Все упражнения с видео и прогрессией по этапам',
        'Критерии перехода между фазами и контроль боли',
        'Самостоятельно, без тренера',
      ],
    },
    {
      name: 'С тренером',
      price: '17 000 ₽',
      period: 'разово · 12 недель',
      audience: 'Когда нужно, чтобы за техникой следил тренер.',
      includes: [
        'Индивидуальная программа под твой случай и спорт',
        'Три онлайн-тренировки за программу',
        'Разбор твоей техники по видео — присылаешь, тренер правит',
        'Чек-ины и корректировка по ходу',
      ],
    },
    {
      name: 'Полное сопровождение',
      price: '50 000 ₽',
      period: 'в месяц',
      audience: 'Для сложных случаев и максимального внимания.',
      includes: [
        'Индивидуальная программа под твой случай и цель',
        'Десять онлайн-тренировок в месяц',
        'Сопровождение и корректировка между тренировками',
        'Тестирование, контроль нагрузки и ведение до результата',
      ],
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

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
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

              <div className="mb-4">
                <div className="text-3xl font-bold text-primary-500">{plan.price}</div>
                <div className="text-sm text-gray-500 mt-1">{plan.period}</div>
              </div>

              <p className="text-gray-600 mb-6 min-h-[3.5rem]">{plan.audience}</p>

              <div className="border-t border-gray-100 pt-6">
                <div className="text-sm font-semibold text-gray-900 mb-4">Что входит</div>
                <ul className="space-y-3">
                  {plan.includes.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="text-primary-500 mr-3 mt-0.5 flex-shrink-0" size={18} />
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-gray-600 mt-12 max-w-2xl mx-auto"
        >
          Не знаешь, что выбрать? Не гадай — разбор бесплатный, и мы честно скажем, что подойдёт.
        </motion.p>
      </div>
    </section>
  )
}
