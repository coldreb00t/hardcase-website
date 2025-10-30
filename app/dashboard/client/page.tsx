'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Calendar, LogOut, Loader2, Dumbbell, Apple, TrendingUp, Activity, Target, Camera, Users, MessageCircle } from 'lucide-react'
import type { Database } from '@/supabase/types/database.types'
import ChatBox from '@/components/ChatBox'
import ClientWorkoutView from '@/components/ClientWorkoutView'

type Profile = Database['public']['Tables']['profiles']['Row']
type WorkoutProgram = Database['public']['Tables']['workout_programs']['Row']
type NutritionTarget = Database['public']['Tables']['nutrition_targets']['Row']
type ClientMeasurement = Database['public']['Tables']['client_measurements']['Row']
type TrainerClientRelationship = Database['public']['Tables']['trainer_client_relationships']['Row']

type TrainerWithProfile = TrainerClientRelationship & {
  trainer: Profile
  is_primary: boolean
}

/**
 * Client Dashboard
 *
 * Features:
 * - Profile information
 * - My workouts (coming soon)
 * - Nutrition (coming soon)
 * - Progress tracking (coming soon)
 */
export default function ClientDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState<string>('')

  // Data states
  const [trainers, setTrainers] = useState<TrainerWithProfile[]>([])
  const [workoutPrograms, setWorkoutPrograms] = useState<WorkoutProgram[]>([])
  const [nutritionTarget, setNutritionTarget] = useState<NutritionTarget | null>(null)
  const [latestMeasurement, setLatestMeasurement] = useState<ClientMeasurement | null>(null)
  const [loadingData, setLoadingData] = useState(false)
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerWithProfile | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  // Auto-select primary trainer for chat
  useEffect(() => {
    if (trainers.length > 0 && !selectedTrainer) {
      const primaryTrainer = trainers.find(t => t.is_primary) || trainers[0]
      setSelectedTrainer(primaryTrainer)
    }
  }, [trainers, selectedTrainer])

  const checkUser = async () => {
    try {
      console.log('[Client Dashboard] Checking user access...')
      const { getCurrentUser, getCurrentProfile } = await import('@/lib/supabase')

      const user = await getCurrentUser()
      console.log('[Client Dashboard] User:', user ? `Found (${user.email})` : 'Not found')

      if (!user) {
        console.log('[Client Dashboard] No user, redirecting to /login')
        router.push('/login')
        return
      }

      setEmail(user.email || '')

      const userProfile = await getCurrentProfile()
      console.log('[Client Dashboard] Profile:', userProfile ? `Found (role: ${userProfile.role})` : 'Not found')

      // Security check: ensure user has 'client' role
      if (userProfile?.role !== 'client') {
        console.warn('[Client Dashboard] Access denied: User role is', userProfile?.role, 'expected client')
        router.push('/dashboard') // Will redirect to correct dashboard
        return
      }

      console.log('[Client Dashboard] Access granted! Loading client dashboard...')
      setProfile(userProfile)

      // Load dashboard data
      await loadData(userProfile.id)
    } catch (error) {
      console.error('[Client Dashboard] Error loading user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadData = async (profileId: string) => {
    setLoadingData(true)
    try {
      const { supabase } = await import('@/lib/supabase')

      // Load trainers assigned to this client
      const { data: trainerRelationships } = await supabase
        .from('trainer_client_relationships')
        .select(`
          *,
          trainer:profiles!trainer_client_relationships_trainer_id_fkey(*)
        `)
        .eq('client_id', profileId)
        .eq('status', 'active')
        .order('is_primary', { ascending: false })

      if (trainerRelationships) {
        setTrainers(trainerRelationships as unknown as TrainerWithProfile[])
      }

      // Load workout programs
      const { data: programs } = await supabase
        .from('workout_programs')
        .select('*')
        .eq('client_id', profileId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (programs) setWorkoutPrograms(programs)

      // Load nutrition target
      const { data: targets } = await supabase
        .from('nutrition_targets')
        .select('*')
        .eq('client_id', profileId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (targets && targets.length > 0) {
        setNutritionTarget(targets[0])
      }

      // Load latest measurement
      const { data: measurements } = await supabase
        .from('client_measurements')
        .select('*')
        .eq('client_id', profileId)
        .order('measured_at', { ascending: false })
        .limit(1)

      if (measurements && measurements.length > 0) {
        setLatestMeasurement(measurements[0])
      }

    } catch (error) {
      console.error('[Client Dashboard] Error loading data:', error)
    } finally {
      setLoadingData(false)
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
              <h1 className="text-xl font-bold text-white">Личный кабинет клиента</h1>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">
                Клиент
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
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 animate-slide-in-left">
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
                {profile?.gender && (
                  <div>
                    <p className="text-gray-400 text-sm">Пол</p>
                    <p className="text-white font-medium">
                      {profile.gender === 'male' ? 'Мужской' : profile.gender === 'female' ? 'Женский' : 'Не указано'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 animate-slide-in-right">
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
            </div>
          </div>

          {/* Trainers Section */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden">
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <Users className="text-purple-500" size={24} />
                <div>
                  <h3 className="text-xl font-semibold text-white">Мои тренеры</h3>
                  <p className="text-gray-400 text-sm">Специалисты, работающие с вами</p>
                </div>
              </div>
            </div>

            {loadingData ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-3" />
                <p className="text-gray-400">Загрузка...</p>
              </div>
            ) : trainers.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Пока нет назначенных тренеров</p>
                <p className="text-gray-500 text-sm mt-1">Администратор назначит вам тренера</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700/50">
                {trainers.map((relationship) => (
                  <div key={relationship.id} className="p-6 hover:bg-gray-700/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <User className="text-purple-500" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-medium">{relationship.trainer.full_name}</h4>
                          {relationship.is_primary ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-400 font-medium">
                              Основной тренер
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400">
                              Дополнительный тренер
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          С {new Date(relationship.started_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dashboard Sections */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Workout Programs */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Dumbbell className="text-primary-500" size={24} />
                  <h3 className="text-lg font-semibold text-white">Мои тренировки</h3>
                </div>
              </div>
              {loadingData ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                </div>
              ) : workoutPrograms.length > 0 ? (
                <div className="space-y-3">
                  {workoutPrograms.map((program) => {
                    const programData = program.program_data as any
                    const today = new Date().getDay()
                    const daysMap = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
                    const todayName = daysMap[today]
                    
                    let todayWorkout = null
                    if (programData?.weeks?.[0]?.workouts) {
                      todayWorkout = programData.weeks[0].workouts.find((w: any) => w.day === todayName)
                    }

                    return (
                      <div key={program.id} className="bg-gray-900/50 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">{program.title}</h4>
                        <p className="text-gray-400 text-xs mb-3">
                          {program.start_date ? new Date(program.start_date).toLocaleDateString('ru-RU') : 'Дата не указана'}
                        </p>
                        
                        {todayWorkout && (
                          <div className="mb-3 p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                            <p className="text-primary-400 text-xs font-medium mb-1">Сегодня:</p>
                            <p className="text-white text-sm font-medium">{todayWorkout.title}</p>
                            <p className="text-gray-400 text-xs">{todayWorkout.exercises?.length || 0} упражнений</p>
                          </div>
                        )}
                        
                        <button
                          onClick={() => setSelectedProgram(program)}
                          className="w-full px-3 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 rounded-lg transition-all text-sm font-medium"
                        >
                          📋 Посмотреть программу
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Нет активных программ</p>
                  <p className="text-gray-500 text-xs mt-1">Тренер назначит вам программу</p>
                </div>
              )}
            </div>

            {/* Nutrition */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Apple className="text-green-500" size={24} />
                  <h3 className="text-lg font-semibold text-white">Питание</h3>
                </div>
              </div>
              {loadingData ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                </div>
              ) : nutritionTarget ? (
                <div className="space-y-3">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Калории</span>
                      <span className="text-white font-bold">{nutritionTarget.calories} ккал</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className="text-gray-500">Белки</p>
                        <p className="text-white font-medium">{nutritionTarget.protein_grams}г</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Жиры</p>
                        <p className="text-white font-medium">{nutritionTarget.fats_grams}г</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Углеводы</p>
                        <p className="text-white font-medium">{nutritionTarget.carbs_grams}г</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Цели питания не заданы</p>
                  <p className="text-gray-500 text-xs mt-1">Тренер установит ваши макросы</p>
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-blue-500" size={24} />
                  <h3 className="text-lg font-semibold text-white">Прогресс</h3>
                </div>
              </div>
              {loadingData ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                </div>
              ) : latestMeasurement ? (
                <div className="space-y-3">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-3">
                      {new Date(latestMeasurement.measured_at).toLocaleDateString('ru-RU')}
                    </p>
                    <div className="space-y-2">
                      {latestMeasurement.weight && (
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Вес</span>
                          <span className="text-white font-medium">{latestMeasurement.weight} кг</span>
                        </div>
                      )}
                      {latestMeasurement.body_fat_percentage && (
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Жир</span>
                          <span className="text-white font-medium">{latestMeasurement.body_fat_percentage}%</span>
                        </div>
                      )}
                      {latestMeasurement.muscle_mass && (
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Мышцы</span>
                          <span className="text-white font-medium">{latestMeasurement.muscle_mass} кг</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Camera className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Нет замеров</p>
                  <p className="text-gray-500 text-xs mt-1">Тренер добавит первые замеры</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          {selectedTrainer && profile && (
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden">
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="text-green-500" size={24} />
                    <div>
                      <h3 className="text-xl font-semibold text-white">Сообщения</h3>
                      <p className="text-gray-400 text-sm">Общение с тренером</p>
                    </div>
                  </div>
                  {trainers.length > 1 && (
                    <select
                      value={selectedTrainer.trainer_id}
                      onChange={(e) => {
                        const trainer = trainers.find(t => t.trainer_id === e.target.value)
                        if (trainer) setSelectedTrainer(trainer)
                      }}
                      className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {trainers.map((trainer) => (
                        <option key={trainer.trainer_id} value={trainer.trainer_id}>
                          {trainer.trainer.full_name} {trainer.is_primary ? '(Основной)' : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="h-[600px]">
                <ChatBox
                  currentUserId={profile.id}
                  otherUserId={selectedTrainer.trainer_id}
                  otherUserName={selectedTrainer.trainer.full_name}
                  currentUserName={profile.full_name}
                />
              </div>
            </div>
          )}
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

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out 0.1s backwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out 0.2s backwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out backwards;
        }
      `}</style>

      {/* Workout Program Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl max-w-5xl w-full border border-gray-700 shadow-2xl my-8">
            <div className="sticky top-0 bg-gray-800 rounded-t-2xl px-6 py-4 border-b border-gray-700 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white">Программа тренировок</h2>
              <button
                onClick={() => setSelectedProgram(null)}
                className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-all"
              >
                <LogOut size={24} />
              </button>
            </div>
            <div className="p-6">
              <ClientWorkoutView program={selectedProgram} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
