'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function ContactSection() {
  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setFormStatus('success')
    setTimeout(() => setFormStatus('idle'), 5000)
  }

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
      title: 'Локация',
      value: 'Онлайн по всему миру',
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
            Свяжитесь <span className="text-primary-500">с нами сегодня</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Запишитесь на бесплатную консультацию и получите персональную программу тренировок и реабилитации
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
              <h3 className="text-2xl font-bold mb-4">Начните прямо сейчас</h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                Первая консультация включает в себя комплексную оценку текущего состояния здоровья, постановку целей и разработку
                индивидуального плана действий. Свяжитесь с нами через сайт или оставьте заявку для получения персонального предложения.
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
              <h4 className="font-bold text-gray-900 mb-3 text-lg">💡 Что вас ждет на первой консультации:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                  <span>Комплексная оценка текущего состояния здоровья</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                  <span>Постановку целей и анализ особенностей</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                  <span>Разработку индивидуального плана действий</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col h-full"
          >
            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 flex-1 flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Оставьте заявку</h3>
              
              {formStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="text-green-600" size={48} />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Спасибо!</h4>
                  <p className="text-gray-600">Мы свяжемся с вами в ближайшее время</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Имя *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="Ваше имя"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="+7 (985) 454-50-00"
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Сообщение
                    </label>
                    <textarea
                      id="message"
                      className="w-full flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                      placeholder="Расскажите о ваших целях и пожеланиях..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-primary-500 to-orange-500 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <Send className="mr-2" size={20} />
                    Отправить заявку
                  </motion.button>
                </form>
              )}
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
              HARDCASE — это инвестиция в ваше здоровье, которая окупается качеством жизни,<br />
              энергией и уверенностью в себе
            </h3>
            <p className="text-xl text-white/80">
              Начните свою трансформацию уже сегодня!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

