'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Award, Users, BookOpen, Globe } from 'lucide-react'

export default function AdvantagesSection() {
  const advantages = [
    {
      number: '01',
      icon: Lightbulb,
      title: 'Силовая реабилитация',
      description: 'Возврат не к покою, а к нагрузке: восстанавливаем силу и уверенность, а не просто снимаем боль',
    },
    {
      number: '02',
      icon: Award,
      title: 'Международная сертификация',
      description: 'Команда с сертификатами FISAF, Europe Active, FPA и многолетним опытом работы с травмами и реабилитацией',
    },
    {
      number: '03',
      icon: Users,
      title: 'Персонализация',
      description: 'Индивидуальные программы под конкретную травму, вид спорта и цели - с контролем прогресса',
    },
    {
      number: '04',
      icon: BookOpen,
      title: 'Доказательный подход',
      description: 'Опираемся на принципы доказательной медицины и современные данные о восстановлении после травм',
    },
    {
      number: '05',
      icon: Globe,
      title: 'Работа онлайн',
      description: 'Сопровождение по видеосвязи - продолжаем работу независимо от твоего города',
    },
  ]

  return (
    <section id="advantages" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Почему <span className="text-primary-500">Hardcase</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Доказательный подход, персональное внимание и контроль нагрузки на каждом этапе восстановления
          </p>
        </motion.div>

        {/* Advantages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {advantages.map((advantage, index) => (
            <motion.div
              key={advantage.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary-500"
            >
              <div className="absolute top-4 right-4 text-5xl font-bold text-primary-100">
                {advantage.number}
              </div>
              <div className="relative z-10">
                <div className="inline-flex p-3 rounded-xl bg-primary-100 mb-4">
                  <advantage.icon className="text-primary-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{advantage.title}</h3>
                <p className="text-gray-600 leading-relaxed">{advantage.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

