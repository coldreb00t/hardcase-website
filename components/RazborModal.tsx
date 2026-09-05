'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, Send } from 'lucide-react'
import { RAZBOR_API_URL } from '@/lib/config'

type Ctx = { open: () => void }
const RazborContext = createContext<Ctx>({ open: () => {} })
export const useRazbor = () => useContext(RazborContext)

const CHANNELS = [
  { value: 'telegram', label: 'Telegram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'phone', label: 'Телефон' },
  { value: 'email', label: 'Email' },
]

const CONTACT_PLACEHOLDER: Record<string, string> = {
  telegram: '@username или телефон',
  whatsapp: 'Номер телефона',
  phone: '+7 (___) ___-__-__',
  email: 'your@email.com',
}

const EMPTY = {
  name: '',
  injury: '',
  channel: 'telegram',
  contact: '',
  email: '',
  consent: false,
  website: '', // honeypot
}

export function RazborProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  return (
    <RazborContext.Provider value={{ open }}>
      {children}
      <RazborModal isOpen={isOpen} onClose={close} />
    </RazborContext.Provider>
  )
}

function RazborModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ ...EMPTY })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }))

  // Блокируем скролл фона + сброс при открытии
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setForm({ ...EMPTY })
      setStatus('idle')
      setError('')
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.consent) {
      setError('Нужно согласие на обработку данных')
      return
    }
    setStatus('sending')
    setError('')
    try {
      const res = await fetch(RAZBOR_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setError(data.error || 'Не удалось отправить. Попробуйте позже.')
      }
    } catch {
      setStatus('error')
      setError('Сеть недоступна. Попробуйте позже.')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-2xl font-bold text-gray-900">Разобрать мой случай</h3>
                <button
                  onClick={onClose}
                  aria-label="Закрыть"
                  className="text-gray-400 hover:text-gray-700 transition-colors -mr-2 -mt-1 p-1"
                >
                  <X size={24} />
                </button>
              </div>

              {status === 'success' ? (
                <div className="text-center py-10">
                  <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="text-green-600" size={48} />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Спасибо!</h4>
                  <p className="text-gray-600">Получили заявку - свяжемся с тобой и честно скажем, что поможет.</p>
                  <button
                    onClick={onClose}
                    className="mt-6 bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <p className="text-gray-500 text-sm mb-2">Бесплатно и ни к чему не обязывает.</p>

                  {/* Honeypot - скрыто от людей, видно ботам */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => set('website', e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div>
                    <label htmlFor="rz-name" className="block text-sm font-semibold text-gray-700 mb-1">Имя *</label>
                    <input
                      id="rz-name"
                      type="text"
                      required
                      maxLength={100}
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="Как тебя зовут"
                    />
                  </div>

                  <div>
                    <label htmlFor="rz-injury" className="block text-sm font-semibold text-gray-700 mb-1">Описание травмы *</label>
                    <textarea
                      id="rz-injury"
                      required
                      maxLength={2000}
                      rows={4}
                      value={form.injury}
                      onChange={(e) => set('injury', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                      placeholder="Что за травма, что говорят врачи, чего хочешь вернуть"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rz-channel" className="block text-sm font-semibold text-gray-700 mb-1">Как связаться *</label>
                      <select
                        id="rz-channel"
                        value={form.channel}
                        onChange={(e) => set('channel', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors bg-white"
                      >
                        {CHANNELS.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="rz-contact" className="block text-sm font-semibold text-gray-700 mb-1">Контакт *</label>
                      <input
                        id="rz-contact"
                        type="text"
                        required
                        maxLength={200}
                        value={form.contact}
                        onChange={(e) => set('contact', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                        placeholder={CONTACT_PLACEHOLDER[form.channel]}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="rz-email" className="block text-sm font-semibold text-gray-700 mb-1">Email (необязательно)</label>
                    <input
                      id="rz-email"
                      type="email"
                      maxLength={200}
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={form.consent}
                      onChange={(e) => set('consent', e.target.checked)}
                      className="mt-1 w-4 h-4 accent-primary-500 flex-shrink-0"
                    />
                    <span>
                      Соглашаюсь на обработку персональных данных в соответствии с{' '}
                      <a href="/privacy/" target="_blank" className="text-primary-600 hover:underline">Политикой</a>.
                    </span>
                  </label>

                  {error && <p className="text-red-600 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-gradient-to-r from-primary-500 to-orange-500 text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-60"
                  >
                    <Send className="mr-2" size={20} />
                    {status === 'sending' ? 'Отправляем…' : 'Отправить'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
