'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, CheckCircle, ArrowRight } from 'lucide-react'
import { useRazbor } from '@/components/RazborModal'

export default function ContactSection() {
  const { open } = useRazbor()
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'info@hardcase.training',
      link: 'mailto:info@hardcase.training',
    },
    {
      icon: Phone,
      title: 'Телефон',
      value: '+7 (985) 454-50-00',
      link: 'tel:+79854545000',
    },
    {
      icon: MapPin,
      title: 'Формат',
      value: 'Онлайн по видеосвязи',
      link: null,
    },
  ]

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Разберём <span className="text-primary-500">твой случай</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ни к чему не обязывает. Посмотрим твою травму и скажем, что реально поможет вернуться к тренировкам.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-8 h-full"
          >
            <div className="bg-gradient-to-br from-primary-500 to-orange-600 p-8 rounded-3xl text-white">
              <h3 className="text-2xl font-bold mb-4">Как с нами связаться</h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                Напиши нам — честно скажем, поможем ли мы или сначала нужно к врачу.
              </p>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center bg-white/10 backdrop-blur-sm p-4 rounded-xl"
                  >
                    <div className="p-3 bg-white/20 rounded-lg mr-4">
                      <info.icon size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-white/70">{info.title}</div>
                      {info.link ? (
                        <a href={info.link} className="font-semibold hover:text-white/80 transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <div className="font-semibold">{info.value}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-primary-100">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Что тебя ждёт:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                  <span>Посмотрим твою травму и текущее состояние</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                  <span>Скажем, что реально поможет именно тебе</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                  <span>Если нужно сначала к врачу — честно об этом скажем</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col h-full"
          >
            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 flex-1 flex flex-col items-center justify-center text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Сделай первый шаг</h3>
              <p className="text-gray-600 mb-8 max-w-sm">
                Напиши пару слов о травме — и мы скажем, что делать дальше.
              </p>
              <motion.button
                type="button"
                onClick={open}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center bg-gradient-to-r from-primary-500 to-orange-500 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Разобрать мой случай — бесплатно
                <ArrowRight className="ml-3" size={22} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 md:p-12 rounded-3xl text-center text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Покой не лечит — лечит грамотная нагрузка
            </h3>
            <p className="text-xl text-white/80">
              Вернём тебя к тренировкам после травмы. По этапам, без «забудь про спорт».
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
