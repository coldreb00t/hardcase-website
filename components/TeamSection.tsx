'use client'

import { motion } from 'framer-motion'
import { Award, Trophy, Star, TrendingUp } from 'lucide-react'

export default function TeamSection() {
  const team = [
    {
      name: 'Мария Мостовая',
      photo: '/images/team/maria.jpg',
      achievements: [
        'Высшее образование тренера-преподавателя по физической культуре',
        'Сертификаты FISAF (персональный тренер, реабилитация)',
        'Чемпион Европы по пауэрлифтингу',
        'Чемпион Мира по пауэрлифтингу',
        'Опыт в «Reebok-Moscow», «World Class» (2007–2013)',
        'Независимый специалист по комплексному сопровождению, персональным тренировкам и реабилитации (2013-2023)',
        'Ведущий специалист проекта «Hardcase» с 2023 года',
      ],
    },
    {
      name: 'Артём Белов',
      photo: '/images/team/artem.jpg',
      achievements: [
        'Сертифицированный персональный тренер «Europe Active»',
        'FPA Элит-тренер («Ассоциация Профессионалов Фитнеса»)',
        'Профессиональная переподготовка «Персональный фитнес-тренер» (Учебно-методический Центр «Профессионалы фитнеса»)',
        'Опыт в «Planet Fitness», «Reebok-Moscow», «World Class» (2001–2013)',
        'Независимый специалист по комплексному сопровождению, персональным тренировкам и реабилитации (2013-2023)',
        'Ведущий специалист проекта «Hardcase» с 2023 года',
      ],
    },
  ]

  const highlights = [
    'Успешно проводила реабилитацию спортсменов из регби клуба ЦСКА',
    'Тренинги для Лиги по Тэг-регби',
    'Профилактика спортивных травм',
    'Оптимизация восстановительных процессов',
    'Приверженность принципам доказательной медицины на основе научных исследований',
  ]

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            О нас: <span className="text-primary-500">Профессиональная команда специалистов</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Команда Hardcase объединяет профессионалов с глубокими знаниями в сфере здоровья, спорта и физической реабилитации
          </p>
        </motion.div>

        {/* Team Members */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow"
            >
              {/* Photo */}
              <div className="flex justify-center mb-6">
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary-500 shadow-xl">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <Trophy className="text-primary-500 mr-3" size={32} />
                <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
              </div>
              <ul className="space-y-3">
                {member.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start">
                    <Star className="text-primary-400 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 p-8 md:p-12 rounded-3xl text-white"
        >
          <div className="flex items-center mb-6">
            <TrendingUp className="mr-3" size={36} />
            <h3 className="text-2xl md:text-3xl font-bold">Наши достижения</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl"
              >
                <Award className="mr-3 mt-1 flex-shrink-0" size={20} />
                <span className="text-white/90">{highlight}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

