'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DebugPage() {
  const [localStorageData, setLocalStorageData] = useState<Record<string, string>>({})
  const [sessionData, setSessionData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkStorage()
  }, [])

  const checkStorage = async () => {
    // 1. Check localStorage
    const storage: Record<string, string> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        storage[key] = localStorage.getItem(key) || ''
      }
    }
    setLocalStorageData(storage)

    // 2. Check Supabase session
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setError(error.message)
      } else {
        setSessionData(data.session)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const clearStorage = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">🔍 Debug: Storage & Session</h1>
          <Link href="/login" className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
            ← К логину
          </Link>
        </div>

        {/* LocalStorage */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">📦 localStorage</h2>
            <button
              onClick={clearStorage}
              className="px-3 py-1 bg-red-500 text-sm rounded hover:bg-red-600"
            >
              Очистить
            </button>
          </div>

          {Object.keys(localStorageData).length === 0 ? (
            <p className="text-gray-400">Пусто</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(localStorageData).map(([key, value]) => (
                <div key={key} className="border-b border-gray-700 pb-2">
                  <div className="text-sm text-gray-400 font-mono break-all">{key}</div>
                  <div className="text-xs text-gray-500 font-mono break-all mt-1">
                    {value.length > 200 ? value.substring(0, 200) + '...' : value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Supabase Session */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🔐 Supabase Session</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded p-4 mb-4">
              <p className="text-red-300">Ошибка: {error}</p>
            </div>
          )}

          {sessionData ? (
            <div className="space-y-3">
              <div>
                <span className="text-green-400 font-semibold">✅ Сессия найдена!</span>
              </div>
              <div>
                <span className="text-gray-400">Email:</span>
                <span className="ml-2 font-mono">{sessionData.user?.email}</span>
              </div>
              <div>
                <span className="text-gray-400">User ID:</span>
                <span className="ml-2 font-mono text-sm">{sessionData.user?.id}</span>
              </div>
              <div>
                <span className="text-gray-400">Истекает:</span>
                <span className="ml-2 font-mono text-sm">
                  {sessionData.expires_at
                    ? new Date(sessionData.expires_at * 1000).toLocaleString('ru-RU')
                    : 'Не указано'}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Access token (первые 50 символов):</span>
                <div className="mt-1 font-mono text-xs text-gray-500 break-all">
                  {sessionData.access_token?.substring(0, 50)}...
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-500/20 border border-yellow-500 rounded p-4">
              <p className="text-yellow-300">⚠️ Сессия не найдена</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-500/20 border border-blue-500 rounded p-4">
          <h3 className="font-semibold mb-2">📋 Инструкция:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-200">
            <li>Войдите через /login</li>
            <li>Сразу откройте эту страницу /debug</li>
            <li>Проверьте, есть ли ключи с "supabase" в localStorage</li>
            <li>Проверьте, найдена ли сессия Supabase</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
