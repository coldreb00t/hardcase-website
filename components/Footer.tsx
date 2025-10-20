'use client'

import { motion } from 'framer-motion'
import { Heart, Mail, Phone, Globe, Youtube, Send } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="mb-6">
                <img
                  src="/images/hardcase-logo.png"
                  alt="HARD CASE"
                  className="h-40 w-auto"
                />
              </div>
              <div className="flex items-center text-gray-400">
                <Heart className="text-primary-500 mr-2" size={20} />
                <span className="text-base">Создано с любовью к здоровью</span>
              </div>
            </motion.div>
          </div>

          {/* Contacts */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-4 text-primary-400">Контакты</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:info@hardcase.training"
                    className="flex items-center text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    <Mail size={18} className="mr-3" />
                    info@hardcase.training
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+79854545000"
                    className="flex items-center text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    <Phone size={18} className="mr-3" />
                    +7 (985) 454-50-00
                  </a>
                </li>
                <li>
                  <a
                    href="https://hardcase.training"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    <Globe size={18} className="mr-3" />
                    hardcase.training
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Social Networks */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-4 text-primary-400">Социальные сети</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://www.youtube.com/@hardcasetraining"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-primary-400 transition-colors text-sm group"
                  >
                    <Youtube size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                    YouTube
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/HardCaseTraining"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-primary-400 transition-colors text-sm group"
                  >
                    <Send size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                    Telegram
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

