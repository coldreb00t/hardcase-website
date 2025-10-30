/**
 * HARD CASE - Database TypeScript Types
 * Auto-generated from Supabase schema
 * Compatible with: Web (Next.js), iOS (Swift code gen), Android (Kotlin code gen)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================================================
// ENUMS
// ============================================================================

export type UserRole = 'client' | 'trainer' | 'admin'
export type GenderType = 'male' | 'female' | 'other' | 'prefer_not_to_say'
export type ProgramStatus = 'draft' | 'active' | 'completed' | 'archived'
export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced'
export type WorkoutStatus = 'scheduled' | 'completed' | 'skipped' | 'missed'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout'
export type PhotoType = 'front' | 'side' | 'back' | 'progress' | 'measurement' | 'other'
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
export type MessageType = 'text' | 'image' | 'video' | 'file' | 'system'

// ============================================================================
// TABLE TYPES
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          role: UserRole
          full_name: string
          phone: string | null
          date_of_birth: string | null
          gender: GenderType | null
          avatar_url: string | null
          timezone: string
          locale: string
          email_notifications: boolean
          push_notifications: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: UserRole
          full_name: string
          phone?: string | null
          date_of_birth?: string | null
          gender?: GenderType | null
          avatar_url?: string | null
          timezone?: string
          locale?: string
          email_notifications?: boolean
          push_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: UserRole
          full_name?: string
          phone?: string | null
          date_of_birth?: string | null
          gender?: GenderType | null
          avatar_url?: string | null
          timezone?: string
          locale?: string
          email_notifications?: boolean
          push_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      trainer_client_relationships: {
        Row: {
          id: string
          trainer_id: string
          client_id: string
          status: string
          started_at: string
          ended_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trainer_id: string
          client_id: string
          status?: string
          started_at?: string
          ended_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trainer_id?: string
          client_id?: string
          status?: string
          started_at?: string
          ended_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      client_measurements: {
        Row: {
          id: string
          client_id: string
          measured_at: string
          weight: number | null
          height: number | null
          body_fat_percentage: number | null
          muscle_mass: number | null
          bone_mass: number | null
          water_percentage: number | null
          visceral_fat: number | null
          measurements: Json
          notes: string | null
          measured_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          measured_at?: string
          weight?: number | null
          height?: number | null
          body_fat_percentage?: number | null
          muscle_mass?: number | null
          bone_mass?: number | null
          water_percentage?: number | null
          visceral_fat?: number | null
          measurements?: Json
          notes?: string | null
          measured_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          measured_at?: string
          weight?: number | null
          height?: number | null
          body_fat_percentage?: number | null
          muscle_mass?: number | null
          bone_mass?: number | null
          water_percentage?: number | null
          visceral_fat?: number | null
          measurements?: Json
          notes?: string | null
          measured_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workout_programs: {
        Row: {
          id: string
          client_id: string
          trainer_id: string | null
          title: string
          description: string | null
          status: ProgramStatus
          start_date: string
          end_date: string | null
          weeks_duration: number | null
          program_data: Json
          goals: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          trainer_id?: string | null
          title: string
          description?: string | null
          status?: ProgramStatus
          start_date: string
          end_date?: string | null
          weeks_duration?: number | null
          program_data?: Json
          goals?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          trainer_id?: string | null
          title?: string
          description?: string | null
          status?: ProgramStatus
          start_date?: string
          end_date?: string | null
          weeks_duration?: number | null
          program_data?: Json
          goals?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      workout_sessions: {
        Row: {
          id: string
          client_id: string
          program_id: string | null
          scheduled_at: string | null
          completed_at: string | null
          status: WorkoutStatus
          title: string
          exercises_completed: Json
          duration_minutes: number | null
          total_volume_kg: number | null
          average_heart_rate: number | null
          max_heart_rate: number | null
          calories_burned: number | null
          notes: string | null
          trainer_feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          program_id?: string | null
          scheduled_at?: string | null
          completed_at?: string | null
          status?: WorkoutStatus
          title: string
          exercises_completed?: Json
          duration_minutes?: number | null
          total_volume_kg?: number | null
          average_heart_rate?: number | null
          max_heart_rate?: number | null
          calories_burned?: number | null
          notes?: string | null
          trainer_feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          program_id?: string | null
          scheduled_at?: string | null
          completed_at?: string | null
          status?: WorkoutStatus
          title?: string
          exercises_completed?: Json
          duration_minutes?: number | null
          total_volume_kg?: number | null
          average_heart_rate?: number | null
          max_heart_rate?: number | null
          calories_burned?: number | null
          notes?: string | null
          trainer_feedback?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          client_id: string
          date: string
          steps: number | null
          distance_km: number | null
          floors_climbed: number | null
          active_calories: number | null
          total_calories: number | null
          sleep_hours: number | null
          deep_sleep_hours: number | null
          rem_sleep_hours: number | null
          sleep_quality_score: number | null
          resting_heart_rate: number | null
          average_heart_rate: number | null
          max_heart_rate: number | null
          hrv_ms: number | null
          recovery_score: number | null
          readiness_score: number | null
          stress_level: number | null
          heart_rate_zones: Json
          data_source: string
          notes: string | null
          mood: string | null
          synced_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          date: string
          steps?: number | null
          distance_km?: number | null
          floors_climbed?: number | null
          active_calories?: number | null
          total_calories?: number | null
          sleep_hours?: number | null
          deep_sleep_hours?: number | null
          rem_sleep_hours?: number | null
          sleep_quality_score?: number | null
          resting_heart_rate?: number | null
          average_heart_rate?: number | null
          max_heart_rate?: number | null
          hrv_ms?: number | null
          recovery_score?: number | null
          readiness_score?: number | null
          stress_level?: number | null
          heart_rate_zones?: Json
          data_source?: string
          notes?: string | null
          mood?: string | null
          synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          date?: string
          steps?: number | null
          distance_km?: number | null
          floors_climbed?: number | null
          active_calories?: number | null
          total_calories?: number | null
          sleep_hours?: number | null
          deep_sleep_hours?: number | null
          rem_sleep_hours?: number | null
          sleep_quality_score?: number | null
          resting_heart_rate?: number | null
          average_heart_rate?: number | null
          max_heart_rate?: number | null
          hrv_ms?: number | null
          recovery_score?: number | null
          readiness_score?: number | null
          stress_level?: number | null
          heart_rate_zones?: Json
          data_source?: string
          notes?: string | null
          mood?: string | null
          synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      nutrition_targets: {
        Row: {
          id: string
          client_id: string
          trainer_id: string | null
          valid_from: string
          valid_until: string | null
          calories: number
          protein_grams: number
          fats_grams: number
          carbs_grams: number
          fiber_grams: number | null
          water_ml: number | null
          sodium_mg: number | null
          calculation_method: string | null
          activity_level: string | null
          goal: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          trainer_id?: string | null
          valid_from: string
          valid_until?: string | null
          calories: number
          protein_grams: number
          fats_grams: number
          carbs_grams: number
          fiber_grams?: number | null
          water_ml?: number | null
          sodium_mg?: number | null
          calculation_method?: string | null
          activity_level?: string | null
          goal?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          trainer_id?: string | null
          valid_from?: string
          valid_until?: string | null
          calories?: number
          protein_grams?: number
          fats_grams?: number
          carbs_grams?: number
          fiber_grams?: number | null
          water_ml?: number | null
          sodium_mg?: number | null
          calculation_method?: string | null
          activity_level?: string | null
          goal?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      nutrition_logs: {
        Row: {
          id: string
          client_id: string
          date: string
          logged_at: string
          meal_type: MealType
          calories: number
          protein_grams: number
          fats_grams: number
          carbs_grams: number
          fiber_grams: number | null
          sugar_grams: number | null
          sodium_mg: number | null
          food_description: string | null
          photo_urls: string[] | null
          source: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          date: string
          logged_at?: string
          meal_type: MealType
          calories: number
          protein_grams: number
          fats_grams: number
          carbs_grams: number
          fiber_grams?: number | null
          sugar_grams?: number | null
          sodium_mg?: number | null
          food_description?: string | null
          photo_urls?: string[] | null
          source?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          date?: string
          logged_at?: string
          meal_type?: MealType
          calories?: number
          protein_grams?: number
          fats_grams?: number
          carbs_grams?: number
          fiber_grams?: number | null
          sugar_grams?: number | null
          sodium_mg?: number | null
          food_description?: string | null
          photo_urls?: string[] | null
          source?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      progress_photos: {
        Row: {
          id: string
          client_id: string
          taken_at: string
          photo_type: PhotoType
          photo_url: string
          weight_kg: number | null
          body_fat_percentage: number | null
          tags: string[] | null
          notes: string | null
          is_public: boolean
          image_width: number | null
          image_height: number | null
          file_size_bytes: number | null
          mime_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          taken_at?: string
          photo_type: PhotoType
          photo_url: string
          weight_kg?: number | null
          body_fat_percentage?: number | null
          tags?: string[] | null
          notes?: string | null
          is_public?: boolean
          image_width?: number | null
          image_height?: number | null
          file_size_bytes?: number | null
          mime_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          taken_at?: string
          photo_type?: PhotoType
          photo_url?: string
          weight_kg?: number | null
          body_fat_percentage?: number | null
          tags?: string[] | null
          notes?: string | null
          is_public?: boolean
          image_width?: number | null
          image_height?: number | null
          file_size_bytes?: number | null
          mime_type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      monthly_reports: {
        Row: {
          id: string
          client_id: string
          trainer_id: string | null
          month: string
          year: number
          start_weight_kg: number | null
          end_weight_kg: number | null
          weight_change_kg: number | null
          body_composition_change: Json
          workout_completion_rate: number | null
          total_workouts_completed: number | null
          total_volume_lifted_kg: number | null
          nutrition_adherence_rate: number | null
          average_daily_calories: number | null
          average_daily_protein: number | null
          achievements: string[] | null
          areas_for_improvement: string[] | null
          trainer_notes: string | null
          next_month_goals: string[] | null
          chart_images: string[] | null
          progress_photo_ids: string[] | null
          status: string
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          trainer_id?: string | null
          month: string
          year: number
          start_weight_kg?: number | null
          end_weight_kg?: number | null
          weight_change_kg?: number | null
          body_composition_change?: Json
          workout_completion_rate?: number | null
          total_workouts_completed?: number | null
          total_volume_lifted_kg?: number | null
          nutrition_adherence_rate?: number | null
          average_daily_calories?: number | null
          average_daily_protein?: number | null
          achievements?: string[] | null
          areas_for_improvement?: string[] | null
          trainer_notes?: string | null
          next_month_goals?: string[] | null
          chart_images?: string[] | null
          progress_photo_ids?: string[] | null
          status?: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          trainer_id?: string | null
          month?: string
          year?: number
          start_weight_kg?: number | null
          end_weight_kg?: number | null
          weight_change_kg?: number | null
          body_composition_change?: Json
          workout_completion_rate?: number | null
          total_workouts_completed?: number | null
          total_volume_lifted_kg?: number | null
          nutrition_adherence_rate?: number | null
          average_daily_calories?: number | null
          average_daily_protein?: number | null
          achievements?: string[] | null
          areas_for_improvement?: string[] | null
          trainer_notes?: string | null
          next_month_goals?: string[] | null
          chart_images?: string[] | null
          progress_photo_ids?: string[] | null
          status?: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          trainer_id: string
          client_id: string
          is_active: boolean
          is_archived: boolean
          last_message_at: string | null
          last_message_preview: string | null
          unread_count_trainer: number
          unread_count_client: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trainer_id: string
          client_id: string
          is_active?: boolean
          is_archived?: boolean
          last_message_at?: string | null
          last_message_preview?: string | null
          unread_count_trainer?: number
          unread_count_client?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trainer_id?: string
          client_id?: string
          is_active?: boolean
          is_archived?: boolean
          last_message_at?: string | null
          last_message_preview?: string | null
          unread_count_trainer?: number
          unread_count_client?: number
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string | null
          message_type: MessageType
          content: string
          attachment_url: string | null
          attachment_type: string | null
          attachment_size_bytes: number | null
          read_at: string | null
          delivered_at: string | null
          edited_at: string | null
          deleted_at: string | null
          is_deleted: boolean
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id?: string | null
          message_type?: MessageType
          content: string
          attachment_url?: string | null
          attachment_type?: string | null
          attachment_size_bytes?: number | null
          read_at?: string | null
          delivered_at?: string | null
          edited_at?: string | null
          deleted_at?: string | null
          is_deleted?: boolean
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string | null
          message_type?: MessageType
          content?: string
          attachment_url?: string | null
          attachment_type?: string | null
          attachment_size_bytes?: number | null
          read_at?: string | null
          delivered_at?: string | null
          edited_at?: string | null
          deleted_at?: string | null
          is_deleted?: boolean
          metadata?: Json
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          trainer_id: string
          client_id: string
          scheduled_at: string
          duration_minutes: number
          ends_at: string
          title: string
          description: string | null
          appointment_type: string | null
          status: AppointmentStatus
          video_link: string | null
          meeting_platform: string | null
          completed_at: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          cancelled_by: string | null
          trainer_notes: string | null
          client_notes: string | null
          reminder_sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trainer_id: string
          client_id: string
          scheduled_at: string
          duration_minutes?: number
          title: string
          description?: string | null
          appointment_type?: string | null
          status?: AppointmentStatus
          video_link?: string | null
          meeting_platform?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          cancelled_by?: string | null
          trainer_notes?: string | null
          client_notes?: string | null
          reminder_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trainer_id?: string
          client_id?: string
          scheduled_at?: string
          duration_minutes?: number
          title?: string
          description?: string | null
          appointment_type?: string | null
          status?: AppointmentStatus
          video_link?: string | null
          meeting_platform?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          cancelled_by?: string | null
          trainer_notes?: string | null
          client_notes?: string | null
          reminder_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string
          type: string
          action_url: string | null
          action_label: string | null
          related_id: string | null
          related_type: string | null
          read_at: string | null
          clicked_at: string | null
          pushed_at: string | null
          push_token: string | null
          metadata: Json
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          body: string
          type: string
          action_url?: string | null
          action_label?: string | null
          related_id?: string | null
          related_type?: string | null
          read_at?: string | null
          clicked_at?: string | null
          pushed_at?: string | null
          push_token?: string | null
          metadata?: Json
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          body?: string
          type?: string
          action_url?: string | null
          action_label?: string | null
          related_id?: string | null
          related_type?: string | null
          read_at?: string | null
          clicked_at?: string | null
          pushed_at?: string | null
          push_token?: string | null
          metadata?: Json
          created_at?: string
          expires_at?: string | null
        }
      }
    }
    Views: {}
    Functions: {
      calculate_bmi: {
        Args: { weight_kg: number; height_cm: number }
        Returns: number
      }
      get_client_trainer: {
        Args: { client_user_id: string }
        Returns: string
      }
      get_active_program: {
        Args: { client_user_id: string }
        Returns: string
      }
      get_workout_completion_rate: {
        Args: { client_user_id: string; weeks_back?: number }
        Returns: number
      }
      get_current_nutrition_target: {
        Args: { client_user_id: string }
        Returns: {
          calories: number
          protein_grams: number
          fats_grams: number
          carbs_grams: number
        }[]
      }
      get_daily_nutrition_totals: {
        Args: { client_user_id: string; target_date: string }
        Returns: {
          total_calories: number
          total_protein: number
          total_fats: number
          total_carbs: number
          meal_count: number
        }[]
      }
      get_nutrition_adherence_rate: {
        Args: { client_user_id: string; days_back?: number }
        Returns: number
      }
      get_or_create_conversation: {
        Args: { p_trainer_id: string; p_client_id: string }
        Returns: string
      }
      mark_conversation_as_read: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: number
      }
      get_upcoming_appointments: {
        Args: { p_user_id: string; days_ahead?: number }
        Returns: {
          appointment_id: string
          scheduled_at: string
          duration_minutes: number
          title: string
          other_participant_name: string
          status: AppointmentStatus
        }[]
      }
      has_appointment_conflict: {
        Args: {
          p_trainer_id: string
          p_scheduled_at: string
          p_duration_minutes: number
          p_exclude_id?: string | null
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
      gender_type: GenderType
      program_status: ProgramStatus
      exercise_difficulty: ExerciseDifficulty
      workout_status: WorkoutStatus
      meal_type: MealType
      photo_type: PhotoType
      appointment_status: AppointmentStatus
      message_type: MessageType
    }
  }
}
