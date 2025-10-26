'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { User, Mail, Calendar, LogOut, Loader2 } from 'lucide-react'
import type { Database } from '@/supabase/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      // Dynamic import - load Supabase only when needed
      const { getCurrentUser, getCurrentProfile } = await import('@/lib/supabase')

      const user = await getCurrentUser()
      if (!user) {
        router.push('/login')
        return
      }

      setEmail(user.email || '')

      const userProfile = await getCurrentProfile()
      setProfile(userProfile)
    } catch (error) {
      console.error('Error loading user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    // Dynamic import for logout
    const { supabase } = await import('@/lib/supabase')
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/images/hardcase-logo.png" alt="HARD CASE" className="h-8" />
              <h1 className="text-xl font-bold text-white">Личный кабинет</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
            >
              <LogOut size={20} />
              <span>Выход</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-2">
              Добро пожаловать, {profile?.full_name || 'Спортсмен'}!
            </h2>
            <p className="text-primary-100">
              Ваш путь к идеальной форме начинается здесь
            </p>
          </div>

          {/* Profile Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <User className="text-primary-500" size={24} />
                <h3 className="text-xl font-semibold text-white">Профиль</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Имя</p>
                  <p className="text-white font-medium">{profile?.full_name || 'Не указано'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">{email || 'Не указано'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Роль</p>
                  <p className="text-white font-medium">
                    {profile?.role === 'client' ? 'Клиент' : 'Тренер'}
                  </p>
                </div>
                {profile?.gender && (
                  <div>
                    <p className="text-gray-400 text-sm">Пол</p>
                    <p className="text-white font-medium">
                      {profile.gender === 'male' ? 'Мужской' : 'Женский'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="text-primary-500" size={24} />
                <h3 className="text-xl font-semibold text-white">Статистика</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Дата регистрации</p>
                  <p className="text-white font-medium">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString('ru-RU')
                      : 'Неизвестно'}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Статус</p>
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                    Активен
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Coming Soon Sections */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Мои тренировки', icon: '💪', description: 'Программы и планы' },
              { title: 'Питание', icon: '🥗', description: 'Рацион и калории' },
              { title: 'Прогресс', icon: '📊', description: 'Статистика и фото' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
                  Скоро
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
