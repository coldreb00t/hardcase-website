'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Dumbbell, Apple, MessageSquare, LogOut, Loader2 } from 'lucide-react'
import type { Database } from '@/supabase/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * Trainer Dashboard
 *
 * Features:
 * - Manage clients
 * - Create workout programs
 * - Assign nutrition plans
 * - View client progress
 */
export default function TrainerDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      console.log('[Trainer Dashboard] Checking user access...')
      const { getCurrentUser, getCurrentProfile } = await import('@/lib/supabase')

      const user = await getCurrentUser()
      console.log('[Trainer Dashboard] User:', user ? `Found (${user.email})` : 'Not found')

      if (!user) {
        console.log('[Trainer Dashboard] No user, redirecting to /login')
        router.push('/login')
        return
      }

      setEmail(user.email || '')

      const userProfile = await getCurrentProfile()
      console.log('[Trainer Dashboard] Profile:', userProfile ? `Found (role: ${userProfile.role})` : 'Not found')

      // Security check: ensure user has 'trainer' role
      if (userProfile?.role !== 'trainer') {
        console.warn('[Trainer Dashboard] Access denied: User role is', userProfile?.role, 'expected trainer')
        router.push('/dashboard') // Will redirect to correct dashboard
        return
      }

      console.log('[Trainer Dashboard] Access granted! Loading trainer dashboard...')
      setProfile(userProfile)
    } catch (error) {
      console.error('[Trainer Dashboard] Error loading user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
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
              <h1 className="text-xl font-bold text-white">Кабинет тренера</h1>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full font-medium">
                Тренер
              </span>
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
        <div className="space-y-8 animate-fade-in">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-2">
              Добро пожаловать, {profile?.full_name || 'Тренер'}!
            </h2>
            <p className="text-purple-100">
              Управляйте тренировками и прогрессом ваших клиентов
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <Users className="text-primary-500 mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <p className="text-gray-400 text-sm">Активных клиентов</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <Dumbbell className="text-green-500 mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <p className="text-gray-400 text-sm">Программ тренировок</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <Apple className="text-yellow-500 mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <p className="text-gray-400 text-sm">Планов питания</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <MessageSquare className="text-blue-500 mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <p className="text-gray-400 text-sm">Сообщений</p>
            </div>
          </div>

          {/* Feature Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Мои клиенты',
                icon: '👥',
                description: 'Управление списком клиентов и их прогрессом',
                color: 'from-blue-500 to-blue-600'
              },
              {
                title: 'Программы тренировок',
                icon: '💪',
                description: 'Создание и назначение программ тренировок',
                color: 'from-green-500 to-green-600'
              },
              {
                title: 'Планы питания',
                icon: '🥗',
                description: 'Расчет КБЖУ и назначение планов питания',
                color: 'from-yellow-500 to-yellow-600'
              },
              {
                title: 'Прогресс клиентов',
                icon: '📊',
                description: 'Просмотр замеров, фото и создание отчетов',
                color: 'from-purple-500 to-purple-600'
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={`bg-gradient-to-r ${item.color} rounded-2xl p-6 text-white shadow-lg animate-fade-in-up cursor-pointer hover:scale-105 transition-transform`}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/80 text-sm mb-4">{item.description}</p>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                  Скоро
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out backwards;
        }
      `}</style>
    </div>
  )
}
