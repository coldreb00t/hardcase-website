'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Users, Settings, BarChart3, LogOut, Loader2, UserPlus, Edit } from 'lucide-react'
import type { Database } from '@/supabase/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * Admin Dashboard
 *
 * Features:
 * - User management
 * - Role assignment
 * - System statistics
 * - Trainer-Client relationships
 */
export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState<string>('')
  const [users, setUsers] = useState<Profile[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Role change modal
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [newRole, setNewRole] = useState<'client' | 'trainer' | 'admin'>('client')
  const [updatingRole, setUpdatingRole] = useState(false)

  // Create trainer modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'trainer' as 'trainer' | 'admin'
  })
  const [creatingUser, setCreatingUser] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      console.log('[Admin Dashboard] Checking user access...')
      const { getCurrentUser, getCurrentProfile } = await import('@/lib/supabase')

      const user = await getCurrentUser()
      console.log('[Admin Dashboard] User:', user ? `Found (${user.email})` : 'Not found')

      if (!user) {
        console.log('[Admin Dashboard] No user, redirecting to /login')
        router.push('/login')
        return
      }

      setEmail(user.email || '')

      const userProfile = await getCurrentProfile()
      console.log('[Admin Dashboard] Profile:', userProfile ? `Found (role: ${userProfile.role})` : 'Not found')

      // Security check: ensure user has 'admin' role
      if (userProfile?.role !== 'admin') {
        console.warn('[Admin Dashboard] Access denied: User role is', userProfile?.role, 'expected admin')
        router.push('/dashboard') // Will redirect to correct dashboard
        return
      }

      console.log('[Admin Dashboard] Access granted! Loading admin panel...')
      setProfile(userProfile)
      loadUsers() // Load all users
    } catch (error) {
      console.error('[Admin Dashboard] Error loading user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    setLoadingUsers(true)
    try {
      const { supabase } = await import('@/lib/supabase')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleLogout = async () => {
    const { supabase } = await import('@/lib/supabase')
    await supabase.auth.signOut()
    router.push('/')
  }

  const openRoleModal = (user: Profile) => {
    setSelectedUser(user)
    setNewRole(user.role as 'client' | 'trainer' | 'admin')
    setShowRoleModal(true)
  }

  const closeRoleModal = () => {
    setShowRoleModal(false)
    setSelectedUser(null)
    setNewRole('client')
  }

  const handleUpdateRole = async () => {
    if (!selectedUser) return

    setUpdatingRole(true)
    try {
      const { supabase } = await import('@/lib/supabase')

      const { data, error } = await supabase
        .from('profiles')
        // @ts-ignore - Admin can update any profile role
        .update({ role: newRole })
        .eq('id', selectedUser.id)
        .select()

      if (error) {
        console.error('[Admin] Error updating role:', error)
        alert(`Ошибка при изменении роли: ${error.message}\n\nВозможно, нужно применить миграцию 20250101000006_admin_update_profiles.sql`)
        return
      }

      if (!data || data.length === 0) {
        alert('Обновление не удалось. Проверьте RLS политики.')
        return
      }

      console.log(`[Admin] Updated role for ${selectedUser.full_name} to ${newRole}`)

      // Reload users
      await loadUsers()
      closeRoleModal()
    } catch (error: any) {
      console.error('Error updating role:', error)
      alert(`Ошибка: ${error.message || 'Неизвестная ошибка'}`)
    } finally {
      setUpdatingRole(false)
    }
  }

  const openCreateModal = () => {
    setCreateForm({
      email: '',
      password: '',
      full_name: '',
      role: 'trainer'
    })
    setCreateError(null)
    setShowCreateModal(true)
  }

  const closeCreateModal = () => {
    setShowCreateModal(false)
    setCreateForm({
      email: '',
      password: '',
      full_name: '',
      role: 'trainer'
    })
    setCreateError(null)
  }

  const handleCreateUser = async () => {
    setCreateError(null)

    // Validation
    if (!createForm.email || !createForm.password || !createForm.full_name) {
      setCreateError('Заполните все поля')
      return
    }

    if (createForm.password.length < 6) {
      setCreateError('Пароль должен быть не менее 6 символов')
      return
    }

    setCreatingUser(true)
    try {
      const { supabase } = await import('@/lib/supabase')

      // Create user via Supabase Admin API
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: createForm.email,
        password: createForm.password,
        options: {
          data: {
            full_name: createForm.full_name
          }
        }
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('User creation failed')
      }

      console.log('[Admin] User created, waiting for profile trigger...')

      // Wait for trigger to create profile (max 5 seconds)
      let profile = null
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 500))

        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', authData.user.id)
          .single()

        if (data) {
          profile = data
          console.log('[Admin] Profile created by trigger')
          break
        }
      }

      if (!profile) {
        throw new Error('Profile was not created by trigger')
      }

      // Update profile role (trigger creates profile with 'client' role by default)
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        // @ts-ignore - Admin creating user with specific role
        .update({ role: createForm.role })
        .eq('user_id', authData.user.id)
        .select()

      if (updateError) {
        console.error('[Admin] Error updating role:', updateError)
        throw new Error(`Пользователь создан, но не удалось установить роль: ${updateError.message}`)
      }

      if (!updateData || updateData.length === 0) {
        throw new Error('Пользователь создан, но не удалось установить роль. Проверьте RLS политики.')
      }

      console.log(`[Admin] Created ${createForm.role}: ${createForm.email}`)

      // Reload users
      await loadUsers()
      closeCreateModal()
    } catch (error: any) {
      console.error('Error creating user:', error)
      setCreateError(error.message || 'Ошибка при создании пользователя')
    } finally {
      setCreatingUser(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400'
      case 'trainer':
        return 'bg-purple-500/20 text-purple-400'
      case 'client':
      default:
        return 'bg-blue-500/20 text-blue-400'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Администратор'
      case 'trainer':
        return 'Тренер'
      case 'client':
      default:
        return 'Клиент'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    )
  }

  const stats = {
    total: users.length,
    clients: users.filter(u => u.role === 'client').length,
    trainers: users.filter(u => u.role === 'trainer').length,
    admins: users.filter(u => u.role === 'admin').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/images/hardcase-logo.png" alt="HARD CASE" className="h-8" />
              <h1 className="text-xl font-bold text-white">Админ-панель</h1>
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full font-medium">
                <Shield size={12} className="inline mr-1" />
                Администратор
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
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-2">
              Добро пожаловать, {profile?.full_name || 'Администратор'}!
            </h2>
            <p className="text-red-100">
              Полный контроль над системой и пользователями
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <Users className="text-primary-500 mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
              <p className="text-gray-400 text-sm">Всего пользователей</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="w-8 h-8 mb-3 flex items-center justify-center bg-blue-500/20 rounded-lg">
                <span className="text-xl">👤</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.clients}</div>
              <p className="text-gray-400 text-sm">Клиентов</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="w-8 h-8 mb-3 flex items-center justify-center bg-purple-500/20 rounded-lg">
                <span className="text-xl">💪</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.trainers}</div>
              <p className="text-gray-400 text-sm">Тренеров</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <Shield className="text-red-500 mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-1">{stats.admins}</div>
              <p className="text-gray-400 text-sm">Администраторов</p>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden">
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Управление пользователями</h3>
                  <p className="text-gray-400 text-sm">Просмотр и изменение ролей пользователей</p>
                </div>
                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all"
                >
                  <UserPlus size={20} />
                  <span>Создать пользователя</span>
                </button>
              </div>
            </div>

            {loadingUsers ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-3" />
                <p className="text-gray-400">Загрузка пользователей...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Пользователи не найдены</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Пользователь
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Роль
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Дата регистрации
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-700/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{user.full_name}</div>
                          <div className="text-sm text-gray-400">{user.id.substring(0, 8)}...</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getRoleBadgeColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {new Date(user.created_at).toLocaleDateString('ru-RU')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openRoleModal(user)}
                            className="text-primary-400 hover:text-primary-300 transition-colors inline-flex items-center gap-1"
                          >
                            <Edit size={16} />
                            Изменить роль
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Feature Sections - Coming Soon */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Тренер-Клиент связи',
                icon: '🔗',
                description: 'Управление связями между тренерами и клиентами',
                color: 'from-blue-500 to-blue-600'
              },
              {
                title: 'Статистика системы',
                icon: '📊',
                description: 'Аналитика и метрики использования',
                color: 'from-green-500 to-green-600'
              },
              {
                title: 'Настройки системы',
                icon: '⚙️',
                description: 'Конфигурация и параметры',
                color: 'from-purple-500 to-purple-600'
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={`bg-gradient-to-r ${item.color} rounded-2xl p-6 text-white shadow-lg animate-fade-in-up`}
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-white/80 text-sm mb-4">{item.description}</p>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                  Скоро
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Изменить роль пользователя</h3>

            <div className="mb-4">
              <p className="text-gray-400 text-sm mb-2">Пользователь:</p>
              <p className="text-white font-medium">{selectedUser.full_name}</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">Новая роль:</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'client' | 'trainer' | 'admin')}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="client">Клиент</option>
                <option value="trainer">Тренер</option>
                <option value="admin">Администратор</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeRoleModal}
                disabled={updatingRole}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={updatingRole || newRole === selectedUser.role}
                className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updatingRole ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <span>Сохранить</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Создать нового пользователя</h3>

            {createError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {createError}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Полное имя:</label>
                <input
                  type="text"
                  value={createForm.full_name}
                  onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                  placeholder="Иван Иванов"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Email:</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Пароль:</label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="Минимум 6 символов"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Роль:</label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as 'trainer' | 'admin' })}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="trainer">Тренер</option>
                  <option value="admin">Администратор</option>
                </select>
                <p className="text-gray-500 text-xs mt-1">Клиенты регистрируются самостоятельно</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeCreateModal}
                disabled={creatingUser}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateUser}
                disabled={creatingUser}
                className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creatingUser ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Создание...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
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
