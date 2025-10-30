'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get hash params from URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        console.log('[Auth Callback] Type:', type)
        console.log('[Auth Callback] Access token:', accessToken ? 'Present' : 'Missing')

        if (accessToken && refreshToken) {
          // Set session in Supabase
          const { supabase } = await import('@/lib/supabase')

          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            console.error('[Auth Callback] Error setting session:', error)
            throw error
          }

          console.log('[Auth Callback] Session set successfully')

          // Redirect based on type
          if (type === 'signup') {
            // After signup confirmation, go to dashboard
            router.push('/dashboard')
          } else if (type === 'recovery') {
            // After password recovery, go to reset page
            router.push('/auth/reset-password')
          } else {
            // Default: go to dashboard
            router.push('/dashboard')
          }
        } else {
          // No tokens in URL, something went wrong
          console.error('[Auth Callback] No tokens found in URL')
          router.push('/login?error=no_tokens')
        }
      } catch (error) {
        console.error('[Auth Callback] Error:', error)
        router.push('/login?error=callback_failed')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Подтверждение регистрации...
        </h2>
        <p className="text-gray-400">
          Пожалуйста, подождите
        </p>
      </div>
    </div>
  )
}
