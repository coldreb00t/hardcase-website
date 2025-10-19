'use client'

import { motion } from 'framer-motion'
import { Award, Users, Trophy } from 'lucide-react'

export default function SocialProofSection() {
  const partners = [
    { name: 'FISAF', image: '/images/partners/fisaf.png' },
    { name: 'Europe Active', image: '/images/partners/europe-active.png' },
    { name: 'FPA', image: '/images/partners/fpa.png' },
    { name: 'Harvard Medical School', image: '/images/partners/harvard.png' },
    { name: 'World Class', image: '/images/partners/world-class.png' },
    { name: 'Reebok', image: '/images/partners/reebok.png' },
  ]

  const stats = [
    { icon: Users, value: '500+', label: 'Довольных клиентов' },
    { icon: Trophy, value: '15+', label: 'Лет опыта' },
    { icon: Award, value: '2000+', label: 'Тренировок проведено' },
  ]

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="p-4 bg-primary-100 rounded-full mb-4">
                <stat.icon className="text-primary-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-center text-gray-500 text-sm uppercase tracking-wide mb-8">
            Сертификаты и партнёры
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center justify-center h-24 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
              >
                <div className="text-gray-400 text-center text-sm font-semibold">
                  {partner.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

