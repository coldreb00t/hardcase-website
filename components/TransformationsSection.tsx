'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'

export default function TransformationsSection() {
  const transformations = [
    {
      name: 'Анна Соколова',
      age: 34,
      result: '-15 кг за 3 месяца',
      beforeImage: '/images/transformations/client1-before.jpg',
      afterImage: '/images/transformations/client1-after.jpg',
      testimonial: 'Впервые за 10 лет влезла в любимое платье! Спасибо команде Hardcase за профессионализм и поддержку.',
      rating: 5,
    },
    {
      name: 'Дмитрий Волков',
      age: 42,
      result: '+8 кг мышц за 4 месяца',
      beforeImage: '/images/transformations/client2-before.jpg',
      afterImage: '/images/transformations/client2-after.jpg',
      testimonial: 'Научился правильно тренироваться и питаться. Результат превзошёл все ожидания!',
      rating: 5,
    },
    {
      name: 'Елена Петрова',
      age: 28,
      result: 'Восстановление после травмы',
      beforeImage: '/images/transformations/client3-before.jpg',
      afterImage: '/images/transformations/client3-after.jpg',
      testimonial: 'После травмы спины думала, что никогда не вернусь к тренировкам. Но специалисты Hardcase помогли!',
      rating: 5,
    },
  ]

  return (
    <section id="transformations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Истории <span className="text-primary-500">трансформации</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Реальные результаты наших клиентов — лучшее доказательство эффективности наших методик
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {transformations.map((transformation, index) => (
            <motion.div
              key={transformation.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden"
            >
              {/* Before/After Images */}
              <div className="relative h-64 bg-gray-200">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 bg-gray-300 flex items-center justify-center border-r-2 border-white">
                    <div className="text-center">
                      <div className="text-gray-500 text-sm mb-2">ДО</div>
                      <div className="text-6xl">👤</div>
                    </div>
                  </div>
                  <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-500 text-sm mb-2">ПОСЛЕ</div>
                      <div className="text-6xl">💪</div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white p-2 rounded-full shadow-lg">
                  <ArrowRight size={24} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{transformation.name}</h3>
                    <p className="text-gray-500 text-sm">{transformation.age} лет</p>
                  </div>
                  <div className="flex">
                    {[...Array(transformation.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary-500 to-orange-500 text-white px-4 py-2 rounded-full text-center font-semibold mb-4">
                  {transformation.result}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed italic">
                  "{transformation.testimonial}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

