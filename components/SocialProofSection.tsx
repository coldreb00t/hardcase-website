'use client'

import { motion } from 'framer-motion'
import { Award, Users, Trophy } from 'lucide-react'

export default function SocialProofSection() {
  const partners = [
    { name: 'FISAF', fullName: 'International Fitness Association', logo: '/images/partners/fisaf.png' },
    { name: 'Europe Active', fullName: 'European Health & Fitness', logo: '/images/partners/europe-active.jpg' },
    { name: 'FPA', fullName: 'Fitness Professionals Association', logo: '/images/partners/fpa.png' },
    { name: 'Harvard', fullName: 'Harvard Medical School', logo: null },
    { name: 'World Class', fullName: 'World Class Fitness', logo: null },
    { name: 'Reebok', fullName: 'Reebok Sports Club', logo: null },
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="flex flex-col items-center justify-center h-28 bg-white rounded-2xl border-2 border-gray-100 hover:border-primary-300 transition-all duration-300 hover:shadow-lg p-4 cursor-pointer">
                  {partner.logo ? (
                    /* Real logo */
                    <div className="w-full h-16 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <img 
                        src={partner.logo} 
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    /* Logo placeholder with first letter */
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-orange-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-xl">
                        {partner.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Partner name */}
                  <div className="text-center">
                    <div className="text-gray-900 font-bold text-sm group-hover:text-primary-600 transition-colors">
                      {partner.name}
                    </div>
                    {!partner.logo && (
                      <div className="text-gray-400 text-xs mt-0.5">
                        {partner.fullName}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

