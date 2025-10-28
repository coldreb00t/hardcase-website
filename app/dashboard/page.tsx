'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

/**
 * Main Dashboard Page - redirects to role-specific dashboard
 *
 * Routes:
 * - client → /dashboard/client
 * - trainer → /dashboard/trainer
 * - admin → /dashboard/admin
 */
export default function DashboardPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    checkUserAndRedirect()
  }, [])

  const checkUserAndRedirect = async () => {
    try {
      const { getCurrentUser, getCurrentProfile } = await import('@/lib/supabase')

      const user = await getCurrentUser()
      if (!user) {
        router.push('/login')
        return
      }

      const profile = await getCurrentProfile()
      if (!profile) {
        console.error('Profile not found')
        router.push('/login')
        return
      }

      // Redirect based on role
      switch (profile.role) {
        case 'admin':
          router.push('/dashboard/admin')
          break
        case 'trainer':
          router.push('/dashboard/trainer')
          break
        case 'client':
        default:
          router.push('/dashboard/client')
          break
      }
    } catch (error) {
      console.error('Error checking user role:', error)
      router.push('/login')
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Загрузка...
        </h2>
        <p className="text-gray-400">
          Определение типа личного кабинета
        </p>
      </div>
    </div>
  )
}
