'use client'

import { motion } from 'framer-motion'

export default function SocialProofSection() {
  const partners = [
    { name: 'FISAF', fullName: 'International Fitness Association', logo: '/images/partners/fisaf.png' },
    { name: 'Europe Active', fullName: 'European Health & Fitness', logo: '/images/partners/europe-active.jpg' },
    { name: 'FPA', fullName: 'Fitness Professionals Association', logo: '/images/partners/fpa.png' },
  ]

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Certificates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-center text-gray-500 text-sm uppercase tracking-wide mb-8">
            Сертификаты команды
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center max-w-3xl mx-auto">
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

