'use client'

import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'
import { PROTOCOL_URL } from '@/lib/config'

export default function ProtocolSection() {
  return (
    <section id="protocol" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl border-2 border-primary-100 p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex p-4 rounded-2xl bg-primary-100 mb-6">
                <FileText className="text-primary-600" size={32} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Протокол первых недель после травмы колена
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Бесплатно, без условий. Что делать в первые недели, чтобы не потерять время и не навредить.
              </p>
            </div>

            <div className="flex justify-center md:justify-end">
              <motion.a
                href={PROTOCOL_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center bg-gradient-to-r from-primary-500 to-orange-500 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Download className="mr-3" size={22} />
                Скачать протокол
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
