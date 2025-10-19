'use client'

import { motion } from 'framer-motion'
import { Heart, Mail, Phone, Globe } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    services: [
      { name: 'Тестирование и анамнез', href: '#services' },
      { name: 'Программы тренировок', href: '#services' },
      { name: 'Расчет КБЖУ', href: '#services' },
      { name: 'Мониторинг прогресса', href: '#services' },
    ],
    company: [
      { name: 'О команде', href: '#team' },
      { name: 'Наши технологии', href: '#technology' },
      { name: 'Преимущества', href: '#advantages' },
      { name: 'Контакты', href: '#contact' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4">
                <img
                  src="/images/hardcase-logo.png"
                  alt="HARD CASE"
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Профессиональная команда специалистов в сфере здоровья, спорта и физической реабилитации
              </p>
              <div className="flex items-center text-gray-400">
                <Heart className="text-primary-500 mr-2" size={18} />
                <span className="text-sm">Создано с любовью к здоровью</span>
              </div>
            </motion.div>
          </div>

          {/* Services */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-4 text-primary-400">Услуги</h4>
              <ul className="space-y-2">
                {links.services.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Company */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-4 text-primary-400">Компания</h4>
              <ul className="space-y-2">
                {links.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-lg font-semibold mb-4 text-primary-400">Контакты</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:info@hardcase.tilda.ws"
                    className="flex items-center text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    <Mail size={16} className="mr-2" />
                    info@hardcase.tilda.ws
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+7XXXXXXXXXX"
                    className="flex items-center text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    <Phone size={16} className="mr-2" />
                    +7 (XXX) XXX-XX-XX
                  </a>
                </li>
                <li>
                  <a
                    href="https://hardcase.tilda.ws"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    <Globe size={16} className="mr-2" />
                    hardcase.tilda.ws
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Hardcase. Все права защищены.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Условия использования
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

