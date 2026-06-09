'use client'

import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'
import { PROTOCOL_KNEE_URL, PROTOCOL_SHOULDER_URL, PROTOCOL_BACK_URL } from '@/lib/config'

export default function ProtocolSection() {
  const protocols = [
    {
      title: 'Травма колена',
      description: 'Что делать в первые недели после травмы колена, чтобы не потерять время и не навредить.',
      url: PROTOCOL_KNEE_URL,
    },
    {
      title: 'Травма плеча',
      description: 'Первые шаги после травмы плеча: что можно, чего нельзя и с чего начать восстановление.',
      url: PROTOCOL_SHOULDER_URL,
    },
    {
      title: 'Травма спины',
      description: 'Что делать в первые недели при боли в спине, чтобы безопасно вернуться к нагрузке.',
      url: PROTOCOL_BACK_URL,
    },
  ]

  return (
    <section id="protocol" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Бесплатные <span className="text-primary-500">протоколы</span> первых недель
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Бесплатно, без условий. Что делать сразу после травмы, чтобы не потерять время и не навредить.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {protocols.map((protocol, index) => (
            <motion.div
              key={protocol.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow border-2 border-primary-100 p-8 flex flex-col text-center items-center"
            >
              <div className="inline-flex p-4 rounded-2xl bg-primary-100 mb-6">
                <FileText className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{protocol.title}</h3>
              <p className="text-gray-600 leading-relaxed flex-grow mb-8">{protocol.description}</p>
              <motion.a
                href={protocol.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center bg-gradient-to-r from-primary-500 to-orange-500 text-white px-7 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="mr-2" size={20} />
                Скачать
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
