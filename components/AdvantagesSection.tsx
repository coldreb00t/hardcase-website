'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Award, Users, BookOpen, Globe, TrendingUp, Target, Shield } from 'lucide-react'

export default function AdvantagesSection() {
  const advantages = [
    {
      number: '01',
      icon: Lightbulb,
      title: 'Инновационный подход',
      description: 'Комплексная методология с гарантированными результатами, основанная на анализе больших данных и персонализированных алгоритмах',
    },
    {
      number: '02',
      icon: Award,
      title: 'Международная сертификация',
      description: 'Команда экспертов с престижными сертификатами FISAF, Europe Active, FPA и многолетним опытом в ведущих международных фитнес-центрах',
    },
    {
      number: '03',
      icon: Users,
      title: 'Персонализация',
      description: 'Индивидуальные программы для клиентов всех возрастных категорий с визуальным и количественным контролем прогресса',
    },
    {
      number: '04',
      icon: BookOpen,
      title: 'Научная обоснованность',
      description: 'Строгое соблюдение стандартов доказательной медицины, включая рекомендации Harvard Medical School и других авторитетных институтов',
    },
    {
      number: '05',
      icon: Globe,
      title: 'Глобальная доступность',
      description: 'Возможность получения услуг премиум-класса в любой точке мира благодаря цифровым технологиям',
    },
  ]

  const comparison = [
    { metric: 'Достижение целей', hardcase: 120, market: 75 },
    { metric: 'Удержание клиентов', hardcase: 95, market: 65 },
    { metric: 'Удовлетворенность', hardcase: 110, market: 85 },
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
            Уникальные <span className="text-primary-500">преимущества</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Наш подход обеспечивает надежные результаты благодаря сочетанию передовых методик, персонального внимания и постоянного
            мониторинга прогресса каждого клиента
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

        {/* Comparison Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Hardcase vs Средний рынок
          </h3>
          <div className="space-y-8">
            {comparison.map((item, index) => (
              <div key={item.metric}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700">{item.metric}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">Hardcase: {item.hardcase}%</span>
                    <span className="text-sm text-gray-400">Рынок: {item.market}%</span>
                  </div>
                </div>
                <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.hardcase}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-orange-500 rounded-full"
                  />
                  <div
                    style={{ width: `${item.market}%` }}
                    className="absolute top-0 left-0 h-full bg-gray-400 rounded-full opacity-40"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8 leading-relaxed">
            Цифры основаны на реальных показателях наших клиентов за последние 12 месяцев работы
          </p>
        </motion.div>
      </div>
    </section>
  )
}

