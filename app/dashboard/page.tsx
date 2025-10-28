'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

type DebugInfo = {
  step: string
  user: any
  profile: any
  role: string | null
  error: string | null
  localStorage: string[]
}

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
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    step: 'Starting...',
    user: null,
    profile: null,
    role: null,
    error: null,
    localStorage: []
  })

  useEffect(() => {
    checkUserAndRedirect()
  }, [])

  const checkUserAndRedirect = async () => {
    try {
      console.log('[Dashboard] Checking user and redirecting...')
      setDebugInfo(prev => ({ ...prev, step: 'Loading Supabase...' }))

      const { getCurrentUser, getCurrentProfile } = await import('@/lib/supabase')

      // Check localStorage
      const storageKeys = Object.keys(localStorage).filter(k => k.includes('supabase') || k.includes('sb-'))
      setDebugInfo(prev => ({ ...prev, step: 'Checking user...', localStorage: storageKeys }))

      const user = await getCurrentUser()
      console.log('[Dashboard] User:', user ? `Found (${user.email})` : 'Not found')
      setDebugInfo(prev => ({ ...prev, user, step: 'User checked' }))

      if (!user) {
        console.log('[Dashboard] No user, redirecting to /login')
        setDebugInfo(prev => ({ ...prev, step: 'No user found!', error: 'Session not found' }))

        // Wait 3 seconds to show debug info
        await new Promise(resolve => setTimeout(resolve, 3000))
        router.push('/login')
        return
      }

      const profile = await getCurrentProfile()
      console.log('[Dashboard] Profile:', profile ? `Found (${profile.full_name}, role: ${profile.role})` : 'Not found')
      setDebugInfo(prev => ({ ...prev, profile, role: profile?.role || null, step: 'Profile checked' }))

      if (!profile) {
        console.error('[Dashboard] Profile not found for user')
        setDebugInfo(prev => ({ ...prev, step: 'Profile not found!', error: 'User has no profile' }))

        // Wait 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000))
        router.push('/login')
        return
      }

      // Redirect based on role
      console.log('[Dashboard] Redirecting based on role:', profile.role)
      setDebugInfo(prev => ({ ...prev, step: `Redirecting to ${profile.role} dashboard...` }))

      // Wait 2 seconds to show debug info
      await new Promise(resolve => setTimeout(resolve, 2000))

      switch (profile.role) {
        case 'admin':
          console.log('[Dashboard] → /dashboard/admin')
          window.location.href = '/dashboard/admin'
          break
        case 'trainer':
          console.log('[Dashboard] → /dashboard/trainer')
          window.location.href = '/dashboard/trainer'
          break
        case 'client':
        default:
          console.log('[Dashboard] → /dashboard/client')
          window.location.href = '/dashboard/client'
          break
      }
    } catch (error: any) {
      console.error('[Dashboard] Error checking user role:', error)
      setDebugInfo(prev => ({ ...prev, step: 'ERROR!', error: error.message }))

      // Wait 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000))
      router.push('/login')
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="text-center max-w-2xl w-full">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          {debugInfo.step}
        </h2>
        <p className="text-gray-400 mb-6">
          Определение типа личного кабинета
        </p>

        {/* Debug Panel */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 text-left text-sm">
          <div className="font-mono space-y-2">
            <div>
              <span className="text-gray-400">localStorage keys:</span>
              <span className="ml-2 text-white">{debugInfo.localStorage.length > 0 ? debugInfo.localStorage.join(', ') : 'None'}</span>
            </div>
            <div>
              <span className="text-gray-400">User:</span>
              <span className="ml-2 text-white">{debugInfo.user ? debugInfo.user.email : 'null'}</span>
            </div>
            <div>
              <span className="text-gray-400">Profile:</span>
              <span className="ml-2 text-white">{debugInfo.profile ? `${debugInfo.profile.full_name} (${debugInfo.profile.role})` : 'null'}</span>
            </div>
            {debugInfo.error && (
              <div className="text-red-400 mt-2">
                Error: {debugInfo.error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

