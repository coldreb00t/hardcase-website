'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export default function TransformationsSection() {
  // Реальные клиенты (с согласия). Поле result/story — опционально:
  // показываются только если заполнены. Исход не выдумываем — впишет владелец.
  const stories = [
    {
      name: 'Алла Разумная',
      sport: 'Регби, клуб «ЦСКА»',
      injury: 'Разрыв ПКС',
      result: '',
      story: '',
    },
    {
      name: 'Карина Голополосова',
      sport: 'Бег',
      injury: 'Разрыв ПКС',
      result: '',
      story: '',
    },
    {
      name: 'Егор',
      sport: 'Тэг-регби',
      injury: 'Разрыв ПКС',
      result: '',
      story: '',
    },
  ]

  return (
    <section id="stories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Реальные <span className="text-primary-500">истории</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Возвращение к тренировкам после травмы — как это было у тех, кто прошёл путь с нами.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden flex flex-col"
            >
              {/* Шапка карточки */}
              <div className="bg-gradient-to-r from-primary-500 to-orange-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold">{story.name}</div>
                    <div className="text-white/80 text-sm">{story.sport}</div>
                  </div>
                  <Quote size={32} className="text-white/40" />
                </div>
              </div>

              {/* Контент */}
              <div className="p-6 flex flex-col flex-grow">
                <div className={story.result ? 'mb-4' : ''}>
                  <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Травма</div>
                  <div className="text-gray-900 font-semibold">{story.injury}</div>
                </div>
                {story.result && (
                  <div className="mb-2">
                    <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Результат</div>
                    <div className="text-gray-900 font-semibold">{story.result}</div>
                  </div>
                )}
                {story.story && (
                  <p className="text-gray-500 text-sm leading-relaxed italic mt-4">{story.story}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
