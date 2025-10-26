/**
 * HARD CASE - Supabase Client Configuration
 * Shared client for Web (Next.js), iOS, and Android
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/supabase/types/database.types'

// Lazy initialization - client is created on first access
let supabaseInstance: SupabaseClient<Database> | null = null

/**
 * Get Supabase client instance (lazy initialization)
 * Creates client only when first accessed, not at import time
 * Safe for static export - uses placeholder values during build
 */
function getSupabaseClient(): SupabaseClient<Database> {
  if (supabaseInstance) {
    return supabaseInstance
  }

  // During static export build, process.env may not have runtime values
  // Use placeholder values during build, real values in browser
  const isBrowser = typeof window !== 'undefined'

  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During build (not in browser), use placeholder values
  if (!isBrowser) {
    supabaseUrl = supabaseUrl || 'https://placeholder.supabase.co'
    supabaseAnonKey = supabaseAnonKey || 'placeholder-anon-key'
  }

  // In browser, throw error if missing (should never happen with proper deployment)
  if (isBrowser && (!supabaseUrl || !supabaseAnonKey)) {
    throw new Error(
      'Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your deployment environment.'
    )
  }

  supabaseInstance = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  })

  return supabaseInstance
}

/**
 * Supabase client for client-side operations
 * Uses anon key with Row Level Security (RLS) policies
 */
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    return getSupabaseClient()[prop as keyof SupabaseClient<Database>]
  },
})

/**
 * Get current user session
 */
export const getCurrentUser = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user ?? null
}

/**
 * Get current user profile
 */
export const getCurrentProfile = async () => {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

/**
 * Sign up new user
 */
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) throw error

  // Profile will be created automatically by database trigger
  // No need to manually create it here

  return data
}

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

/**
 * Sign in with magic link (passwordless)
 */
export const signInWithMagicLink = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) throw error
  return data
}

/**
 * Sign out
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Reset password
 */
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  if (error) throw error
  return data
}

/**
 * Update password
 */
export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw error
  return data
}

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
}

// Export types for convenience
export type { Database } from '@/supabase/types/database.types'
export type Profile = Database['public']['Tables']['profiles']['Row']
export type WorkoutProgram = Database['public']['Tables']['workout_programs']['Row']
export type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row']
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row']
export type NutritionLog = Database['public']['Tables']['nutrition_logs']['Row']
export type ProgressPhoto = Database['public']['Tables']['progress_photos']['Row']
export type MonthlyReport = Database['public']['Tables']['monthly_reports']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']
