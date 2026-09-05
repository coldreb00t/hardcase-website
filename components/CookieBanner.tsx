'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'hc_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Показываем только если согласие ещё не дано (и только на клиенте)
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* localStorage недоступен - просто скрываем */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4">
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 shadow-2xl rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-gray-600 leading-relaxed flex-1 text-center sm:text-left">
          Мы используем файлы cookie для корректной работы сайта. Продолжая пользоваться сайтом, вы соглашаетесь
          с этим. Подробнее - в{' '}
          <a href="/privacy/" className="text-primary-600 hover:underline whitespace-nowrap">
            Политике обработки данных
          </a>
          .
        </p>
        <button
          onClick={accept}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors whitespace-nowrap shrink-0"
        >
          Принять
        </button>
      </div>
    </div>
  )
}
