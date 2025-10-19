'use client'

import { motion } from 'framer-motion'
import { Dumbbell, Users, Heart, Building2, TrendingUp, UserCheck, Activity, Briefcase } from 'lucide-react'

export default function AudienceSection() {
  const audiences = [
    {
      icon: Dumbbell,
      title: 'Фитнес-студии',
      description: 'Повышение квалификации персонала, внедрение научно обоснованных программ и увеличение эффективности тренировочного процесса',
      color: 'from-orange-400 to-orange-500',
    },
    {
      icon: Activity,
      title: 'Спортивные команды',
      description: 'Реабилитационные программы, профилактика травм и оптимизация спортивных показателей на основе индивидуального подхода',
      color: 'from-primary-400 to-primary-500',
    },
    {
      icon: Heart,
      title: 'Индивидуальные клиенты',
      description: 'Персональные программы оздоровления, реабилитации после травм и достижения эстетических целей',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Building2,
      title: 'Корпоративные клиенты',
      description: 'Программы корпоративного wellness, снижение заболеваемости сотрудников и повышение общей продуктивности',
      color: 'from-primary-500 to-primary-600',
    },
  ]

  const corporateResults = [
    { title: 'Снижение больничных листов на 40%', icon: TrendingUp },
    { title: 'Повышение работоспособности персонала', icon: UserCheck },
    { title: 'Программы профилактики профессиональных заболеваний', icon: Heart },
    { title: 'Тимбилдинг через спортивные активности', icon: Users },
  ]

  const sportResults = [
    { title: 'Реабилитация игроков Регби клуба ЦСКА', icon: Activity },
    { title: 'Тренинги для Лиги по Тэг-регби', icon: Dumbbell },
    { title: 'Профилактика спортивных травм', icon: Heart },
    { title: 'Оптимизация восстановительных процессов', icon: TrendingUp },
  ]

  return (
    <section id="audience" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Целевая аудитория <span className="text-primary-500">и масштабирование</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hardcase успешно работает с широким спектром клиентов, от индивидуальных программ до крупных корпоративных проектов,
            адаптируя наши методики под специфические потребности каждой аудитории
          </p>
        </motion.div>

        {/* Audience Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl"
                style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              />
              <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${audience.color} mb-6`}>
                  <audience.icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{audience.title}</h3>
                <p className="text-gray-600 leading-relaxed">{audience.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Corporate Programs */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary-500 to-primary-600 p-8 rounded-3xl text-white"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Briefcase className="mr-3" size={28} />
              Корпоративные программы
            </h3>
            <div className="space-y-4">
              {corporateResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center bg-white/10 backdrop-blur-sm p-4 rounded-xl"
                >
                  <result.icon className="mr-3 flex-shrink-0" size={24} />
                  <span>{result.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sport Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 rounded-3xl text-white"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Activity className="mr-3" size={28} />
              Спортивные достижения
            </h3>
            <div className="space-y-4">
              {sportResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center bg-white/10 backdrop-blur-sm p-4 rounded-xl"
                >
                  <result.icon className="mr-3 flex-shrink-0" size={24} />
                  <span>{result.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-600 mb-6">
            Наша гибкая модульная система позволяет масштабировать услуги от индивидуальных консультаций до комплексных корпоративных программ,
            сохраняя при этом высокое качество и персонализированный подход к каждому участнику
          </p>
        </motion.div>
      </div>
    </section>
  )
}

