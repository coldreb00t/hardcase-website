'use client'

import { motion } from 'framer-motion'
import { Heart, Mail, Phone, Globe, Youtube, Send, Headphones } from 'lucide-react'

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
                <li>
                  <a
                    href="https://vk.ru/hardcasetraining"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-primary-400 transition-colors text-sm group"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-3 group-hover:scale-110 transition-transform">
                      <path d="M13.162 18.994c-7.087 0-11.13-4.86-11.298-12.953h3.55c.116 5.94 2.737 8.457 4.813 8.976V6.04h3.343v5.116c2.05-.22 4.203-2.556 4.93-5.116h3.343c-.558 3.152-2.892 5.488-4.553 6.448 1.66.778 4.319 2.815 5.331 6.505h-3.68c-.79-2.452-2.762-4.35-5.371-4.61v4.61h-.401z"/>
                    </svg>
                    VK
                  </a>
                </li>
                <li>
                  <a
                    href="https://rutube.ru/channel/50641861/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-primary-400 transition-colors text-sm group"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-3 group-hover:scale-110 transition-transform">
                      <path fillRule="evenodd" clipRule="evenodd" d="M5 4h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm5 4.5v7l6-3.5-6-3.5z"/>
                    </svg>
                    Rutube
                  </a>
                </li>
              </ul>

              <a
                href="https://music.yandex.ru/album/42405160"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
              >
                <Headphones size={16} className="mr-2" />
                Слушать на Яндекс.Музыке
              </a>
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
              <a href="/privacy/" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Политика конфиденциальности
              </a>
              <a href="/terms/" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Условия использования
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

