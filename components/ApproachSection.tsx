'use client'

import { motion } from 'framer-motion'

export default function ApproachSection() {
  const highlights = [
    'Реабилитация и силовой тренинг с применением доказательных методов',
    'Контроль тренировок, нагрузки и восстановления на основе точных данных',
    'Работа онлайн по видеосвязи — сопровождение независимо от города',
  ]

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-primary-500 via-orange-500 to-primary-600 p-8 md:p-12 rounded-3xl text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Возврат к нагрузке через грамотное сопровождение
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-white/90 leading-relaxed">
                Hardcase — это силовая реабилитация: возвращаем активных людей к тренировкам после травм и боли.
                Опираемся на доказательные методы и ведём по этапам, а не держим в покое.
              </p>
            </div>
            <div className="space-y-4">
              {highlights.map((highlight, index) => (
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
      </div>
    </section>
  )
}
