/**
 * HARD CASE - Supabase Client Configuration
 * Shared client for Web (Next.js), iOS, and Android
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/supabase/types/database.types'

// Environment variables (set these in .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
  )
}

/**
 * Supabase client for client-side operations
 * Uses anon key with Row Level Security (RLS) policies
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
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

  // Create profile after signup
  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: data.user.id,
      full_name: fullName,
      role: 'client', // Default role
    })

    if (profileError) {
      console.error('Error creating profile:', profileError)
    }
  }

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
