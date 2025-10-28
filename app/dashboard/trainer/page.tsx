'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Dumbbell, Apple, MessageSquare, LogOut, Loader2, Calendar, TrendingUp } from 'lucide-react'
import type { Database } from '@/supabase/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type TrainerClientRelationship = Database['public']['Tables']['trainer_client_relationships']['Row']

type ClientWithProfile = TrainerClientRelationship & {
  client: Profile
  is_primary: boolean
}

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

  // Data states
  const [clients, setClients] = useState<ClientWithProfile[]>([])
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalPrograms: 0,
    totalNutritionPlans: 0
  })
  const [loadingData, setLoadingData] = useState(false)

  // Modal states
  const [showCreateProgramModal, setShowCreateProgramModal] = useState(false)
  const [showCreateNutritionModal, setShowCreateNutritionModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<ClientWithProfile | null>(null)

  // Form states
  const [programForm, setProgramForm] = useState({
    clientId: '',
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0]
  })
  const [nutritionForm, setNutritionForm] = useState({
    clientId: '',
    calories: '',
    protein: '',
    fats: '',
    carbs: ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

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

      // Load trainer data
      await loadTrainerData(userProfile.id)
    } catch (error) {
      console.error('[Trainer Dashboard] Error loading user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadTrainerData = async (trainerId: string) => {
    setLoadingData(true)
    try {
      const { supabase } = await import('@/lib/supabase')

      // Load clients with their profiles
      const { data: clientRelationships, error: clientsError } = await supabase
        .from('trainer_client_relationships')
        .select(`
          *,
          client:profiles!trainer_client_relationships_client_id_fkey(*)
        `)
        .eq('trainer_id', trainerId)
        .order('created_at', { ascending: false })

      if (clientsError) throw clientsError

      const clientsWithProfiles = (clientRelationships || []) as unknown as ClientWithProfile[]
      setClients(clientsWithProfiles)

      // Count active clients
      const activeClients = clientsWithProfiles.filter(c => c.status === 'active').length

      // Count workout programs created by this trainer
      const { count: programsCount } = await supabase
        .from('workout_programs')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)

      // Count nutrition plans created by this trainer
      const { count: nutritionCount } = await supabase
        .from('nutrition_targets')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)

      setStats({
        totalClients: clientsWithProfiles.length,
        activeClients,
        totalPrograms: programsCount || 0,
        totalNutritionPlans: nutritionCount || 0
      })

    } catch (error) {
      console.error('[Trainer Dashboard] Error loading data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleCreateProgram = async () => {
    setFormError(null)
    if (!programForm.clientId || !programForm.title) {
      setFormError('Заполните все обязательные поля')
      return
    }

    setSubmitting(true)
    try {
      const { supabase } = await import('@/lib/supabase')

      const { error } = await supabase
        .from('workout_programs')
        // @ts-ignore - Trainer creating workout program
        .insert({
          client_id: programForm.clientId,
          trainer_id: profile!.id,
          title: programForm.title,
          description: programForm.description || null,
          start_date: programForm.startDate,
          status: 'active'
        })

      if (error) throw error

      console.log('[Trainer] Program created successfully')
      await loadTrainerData(profile!.id)
      setShowCreateProgramModal(false)
      setProgramForm({
        clientId: '',
        title: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0]
      })
    } catch (error: any) {
      console.error('[Trainer] Error creating program:', error)
      setFormError(error.message || 'Ошибка при создании программы')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateNutrition = async () => {
    setFormError(null)
    if (!nutritionForm.clientId || !nutritionForm.calories || !nutritionForm.protein || !nutritionForm.fats || !nutritionForm.carbs) {
      setFormError('Заполните все поля')
      return
    }

    setSubmitting(true)
    try {
      const { supabase } = await import('@/lib/supabase')

      const { error } = await supabase
        .from('nutrition_targets')
        // @ts-ignore - Trainer creating nutrition plan
        .insert({
          client_id: nutritionForm.clientId,
          trainer_id: profile!.id,
          calories: parseInt(nutritionForm.calories),
          protein_grams: parseInt(nutritionForm.protein),
          fats_grams: parseInt(nutritionForm.fats),
          carbs_grams: parseInt(nutritionForm.carbs),
          valid_from: new Date().toISOString().split('T')[0]
        })

      if (error) throw error

      console.log('[Trainer] Nutrition plan created successfully')
      await loadTrainerData(profile!.id)
      setShowCreateNutritionModal(false)
      setNutritionForm({
        clientId: '',
        calories: '',
        protein: '',
        fats: '',
        carbs: ''
      })
    } catch (error: any) {
      console.error('[Trainer] Error creating nutrition plan:', error)
      setFormError(error.message || 'Ошибка при создании плана питания')
    } finally {
      setSubmitting(false)
    }
  }

  const openCreateProgramModal = (client: ClientWithProfile) => {
    setSelectedClient(client)
    setProgramForm({ ...programForm, clientId: client.client_id })
    setFormError(null)
    setShowCreateProgramModal(true)
  }

  const openCreateNutritionModal = (client: ClientWithProfile) => {
    setSelectedClient(client)
    setNutritionForm({ ...nutritionForm, clientId: client.client_id })
    setFormError(null)
    setShowCreateNutritionModal(true)
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
              <div className="text-3xl font-bold text-white mb-1">
                {loadingData ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.activeClients}
              </div>
              <p className="text-gray-400 text-sm">Активных клиентов</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <Dumbbell className="text-green-500 mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-1">
                {loadingData ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.totalPrograms}
              </div>
              <p className="text-gray-400 text-sm">Программ тренировок</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <Apple className="text-yellow-500 mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-1">
                {loadingData ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.totalNutritionPlans}
              </div>
              <p className="text-gray-400 text-sm">Планов питания</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <Users className="text-blue-500 mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-1">
                {loadingData ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.totalClients}
              </div>
              <p className="text-gray-400 text-sm">Всего клиентов</p>
            </div>
          </div>

          {/* Clients List */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden">
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <Users className="text-primary-500" size={24} />
                <div>
                  <h3 className="text-xl font-semibold text-white">Мои клиенты</h3>
                  <p className="text-gray-400 text-sm">Клиентов назначает администратор</p>
                </div>
              </div>
            </div>

            {loadingData ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-3" />
                <p className="text-gray-400">Загрузка клиентов...</p>
              </div>
            ) : clients.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Пока нет клиентов</p>
                <p className="text-gray-500 text-sm mt-1">Администратор назначит вам клиентов</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700/50">
                {clients.map((relationship) => (
                  <div key={relationship.id} className="p-6 hover:bg-gray-700/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                          <Users className="text-primary-500" size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-medium">{relationship.client.full_name}</h4>
                            {relationship.is_primary ? (
                              <span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-400 font-medium">
                                Основной
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400">
                                Дополнительный
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              relationship.status === 'active'
                                ? 'bg-green-500/20 text-green-400'
                                : relationship.status === 'paused'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {relationship.status === 'active' ? 'Активен' :
                               relationship.status === 'paused' ? 'Пауза' : 'Завершен'}
                            </span>
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                              <Calendar size={12} />
                              С {new Date(relationship.started_at).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {relationship.is_primary && (
                          <button
                            onClick={() => openCreateProgramModal(relationship)}
                            className="px-3 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all text-sm flex items-center gap-1"
                          >
                            <Dumbbell size={16} />
                            Программа
                          </button>
                        )}
                        <button
                          onClick={() => openCreateNutritionModal(relationship)}
                          className="px-3 py-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-lg transition-all text-sm flex items-center gap-1"
                        >
                          <Apple size={16} />
                          Питание
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Program Modal */}
      {showCreateProgramModal && selectedClient && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Создать программу тренировок</h3>

            <div className="mb-4">
              <p className="text-gray-400 text-sm">Клиент:</p>
              <p className="text-white font-medium">{selectedClient.client.full_name}</p>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Название программы: *</label>
                <input
                  type="text"
                  value={programForm.title}
                  onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                  placeholder="Например: Набор массы - 12 недель"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Описание:</label>
                <textarea
                  value={programForm.description}
                  onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                  placeholder="Краткое описание программы..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Дата начала:</label>
                <input
                  type="date"
                  value={programForm.startDate}
                  onChange={(e) => setProgramForm({ ...programForm, startDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateProgramModal(false)}
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateProgram}
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Создание...</span>
                  </>
                ) : (
                  <>
                    <Dumbbell size={18} />
                    <span>Создать</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Nutrition Plan Modal */}
      {showCreateNutritionModal && selectedClient && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Создать план питания</h3>

            <div className="mb-4">
              <p className="text-gray-400 text-sm">Клиент:</p>
              <p className="text-white font-medium">{selectedClient.client.full_name}</p>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Калории в день: *</label>
                <input
                  type="number"
                  value={nutritionForm.calories}
                  onChange={(e) => setNutritionForm({ ...nutritionForm, calories: e.target.value })}
                  placeholder="2000"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 text-xs mb-2">Белки (г): *</label>
                  <input
                    type="number"
                    value={nutritionForm.protein}
                    onChange={(e) => setNutritionForm({ ...nutritionForm, protein: e.target.value })}
                    placeholder="150"
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-2">Жиры (г): *</label>
                  <input
                    type="number"
                    value={nutritionForm.fats}
                    onChange={(e) => setNutritionForm({ ...nutritionForm, fats: e.target.value })}
                    placeholder="60"
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-2">Углеводы (г): *</label>
                  <input
                    type="number"
                    value={nutritionForm.carbs}
                    onChange={(e) => setNutritionForm({ ...nutritionForm, carbs: e.target.value })}
                    placeholder="200"
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateNutritionModal(false)}
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateNutrition}
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Создание...</span>
                  </>
                ) : (
                  <>
                    <Apple size={18} />
                    <span>Создать</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
