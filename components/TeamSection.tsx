'use client'

import { motion } from 'framer-motion'
import { Trophy, Star } from 'lucide-react'

export default function TeamSection() {
  const team = [
    {
      name: 'Мария Мостовая',
      photo: '/images/team/maria.jpg',
      tagline: 'Чемпионка мира и Европы по пауэрлифтингу, в команде Hardcase',
      achievements: [
        'Высшее образование тренера-преподавателя по физической культуре',
        'Сертификаты FISAF (персональный тренер, реабилитация)',
        'Чемпион Европы по пауэрлифтингу',
        'Чемпион Мира по пауэрлифтингу',
        'Опыт в «Reebok-Moscow», «World Class» (2007-2013)',
        'Независимый специалист по комплексному сопровождению, персональным тренировкам и реабилитации (2013-2023)',
        'Ведущий специалист проекта «Hardcase» с 2023 года',
      ],
      // История Марии - впишем позже (story: '...'), пока скрыта.
      story: '',
    },
    {
      name: 'Артём Белов',
      photo: '/images/team/artem.jpg',
      tagline: '',
      achievements: [
        'Сертифицированный персональный тренер «Europe Active»',
        'FPA Элит-тренер («Ассоциация Профессионалов Фитнеса»)',
        'Профессиональная переподготовка «Персональный фитнес-тренер» (Учебно-методический Центр «Профессионалы фитнеса»)',
        'Опыт в «Planet Fitness», «Reebok-Moscow», «World Class» (2001-2013)',
        'Независимый специалист по комплексному сопровождению, персональным тренировкам и реабилитации (2013-2023)',
        'Ведущий специалист проекта «Hardcase» с 2023 года',
      ],
      story: '',
    },
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-900">Команда</span> <span className="text-primary-500">экспертов</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Команда Hardcase объединяет профессионалов с глубокими знаниями в сфере здоровья, спорта и физической реабилитации
          </p>
        </motion.div>

        {/* Team Members */}
        <div className="grid md:grid-cols-2 gap-8">
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
              
              <div className="flex items-center justify-center mb-2">
                <Trophy className="text-primary-500 mr-3" size={32} />
                <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
              </div>
              <p className="text-center text-primary-600 font-semibold mb-6 min-h-[3.5rem] flex items-center justify-center">
                {member.tagline || ' '}
              </p>
              <ul className="space-y-3">
                {member.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start">
                    <Star className="text-primary-400 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
              {member.story && (
                <div className="mt-6 bg-white/60 border-l-4 border-primary-400 p-4 rounded-r-xl">
                  <p className="text-gray-700 italic leading-relaxed">{member.story}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

