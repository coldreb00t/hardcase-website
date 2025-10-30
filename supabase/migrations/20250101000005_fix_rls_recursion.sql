-- ============================================================================
-- HARD CASE - Fix RLS Infinite Recursion
-- ============================================================================
-- Description: Fixes infinite recursion in RLS policies by adding helper function
-- Problem: Policies were querying profiles table to check profiles access
-- Solution: Create SECURITY DEFINER function to bypass RLS for profile lookup
-- ============================================================================

-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Trainers can view their clients profiles" ON profiles;
DROP POLICY IF EXISTS "Clients can view their trainers profile" ON profiles;
DROP POLICY IF EXISTS "Trainers can view their relationships" ON trainer_client_relationships;
DROP POLICY IF EXISTS "Clients can view their relationships" ON trainer_client_relationships;
DROP POLICY IF EXISTS "Trainers can create relationships" ON trainer_client_relationships;
DROP POLICY IF EXISTS "Trainers can update relationships" ON trainer_client_relationships;
DROP POLICY IF EXISTS "Clients can view own measurements" ON client_measurements;
DROP POLICY IF EXISTS "Trainers can view clients measurements" ON client_measurements;
DROP POLICY IF EXISTS "Trainers can create measurements" ON client_measurements;
DROP POLICY IF EXISTS "Trainers can update measurements" ON client_measurements;
DROP POLICY IF EXISTS "Clients can view own programs" ON workout_programs;
DROP POLICY IF EXISTS "Trainers can view their programs" ON workout_programs;
DROP POLICY IF EXISTS "Trainers can create programs" ON workout_programs;
DROP POLICY IF EXISTS "Trainers can update programs" ON workout_programs;
DROP POLICY IF EXISTS "Clients can manage own sessions" ON workout_sessions;
DROP POLICY IF EXISTS "Trainers can view clients sessions" ON workout_sessions;
DROP POLICY IF EXISTS "Trainers can update sessions" ON workout_sessions;
DROP POLICY IF EXISTS "Clients can manage own activity" ON activity_logs;
DROP POLICY IF EXISTS "Trainers can view clients activity" ON activity_logs;
DROP POLICY IF EXISTS "Clients can view own nutrition targets" ON nutrition_targets;
DROP POLICY IF EXISTS "Trainers can manage nutrition targets" ON nutrition_targets;
DROP POLICY IF EXISTS "Clients can manage own nutrition logs" ON nutrition_logs;
DROP POLICY IF EXISTS "Trainers can view clients nutrition logs" ON nutrition_logs;
DROP POLICY IF EXISTS "Clients can manage own photos" ON progress_photos;
DROP POLICY IF EXISTS "Trainers can view clients photos" ON progress_photos;
DROP POLICY IF EXISTS "Clients can view own reports" ON monthly_reports;
DROP POLICY IF EXISTS "Trainers can manage reports" ON monthly_reports;
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Users can view their appointments" ON appointments;
DROP POLICY IF EXISTS "Trainers can create appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update their appointments" ON appointments;
DROP POLICY IF EXISTS "Trainers can view clients health data" ON health_sync_data;

-- ============================================================================
-- HELPER FUNCTION - Get current user's profile ID without RLS check
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_my_profile_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

COMMENT ON FUNCTION public.get_my_profile_id() IS
  'Returns the profile ID for the current authenticated user, bypassing RLS. Used in RLS policies to prevent infinite recursion.';

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

COMMENT ON FUNCTION public.get_my_role() IS
  'Returns the role for the current authenticated user, bypassing RLS. Used in RLS policies to prevent infinite recursion.';

-- ============================================================================
-- PROFILES POLICIES (Fixed)
-- ============================================================================

-- Trainers can view their clients' profiles (FIXED - no recursion)
CREATE POLICY "Trainers can view their clients profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      WHERE tcr.trainer_id = public.get_my_profile_id()
        AND tcr.client_id = profiles.id
        AND tcr.status = 'active'
    )
  );

-- Clients can view their trainer's profile (FIXED)
CREATE POLICY "Clients can view their trainers profile"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      WHERE tcr.client_id = public.get_my_profile_id()
        AND tcr.trainer_id = profiles.id
        AND tcr.status = 'active'
    )
  );

-- Admins can view all profiles (FIXED - no recursion)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (public.get_my_role() = 'admin');

-- ============================================================================
-- TRAINER-CLIENT RELATIONSHIPS POLICIES (Fixed)
-- ============================================================================

-- Trainers can view their client relationships (FIXED)
CREATE POLICY "Trainers can view their relationships"
  ON trainer_client_relationships FOR SELECT
  USING (trainer_id = public.get_my_profile_id());

-- Clients can view their trainer relationships (FIXED)
CREATE POLICY "Clients can view their relationships"
  ON trainer_client_relationships FOR SELECT
  USING (client_id = public.get_my_profile_id());

-- Only trainers can create relationships (FIXED - no recursion)
CREATE POLICY "Trainers can create relationships"
  ON trainer_client_relationships FOR INSERT
  WITH CHECK (
    trainer_id = public.get_my_profile_id()
    AND public.get_my_role() = 'trainer'
  );

-- Trainers can update their relationships (FIXED)
CREATE POLICY "Trainers can update relationships"
  ON trainer_client_relationships FOR UPDATE
  USING (trainer_id = public.get_my_profile_id());

-- ============================================================================
-- CLIENT MEASUREMENTS POLICIES (Fixed)
-- ============================================================================

-- Clients can view their own measurements (FIXED)
CREATE POLICY "Clients can view own measurements"
  ON client_measurements FOR SELECT
  USING (client_id = public.get_my_profile_id());

-- Trainers can view their clients' measurements (FIXED)
CREATE POLICY "Trainers can view clients measurements"
  ON client_measurements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      WHERE tcr.trainer_id = public.get_my_profile_id()
        AND tcr.client_id = client_measurements.client_id
        AND tcr.status = 'active'
    )
  );

-- Trainers can insert measurements for their clients (FIXED)
CREATE POLICY "Trainers can create measurements"
  ON client_measurements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      WHERE tcr.trainer_id = public.get_my_profile_id()
        AND tcr.client_id = client_measurements.client_id
        AND tcr.status = 'active'
    )
  );

-- Trainers can update measurements (FIXED)
CREATE POLICY "Trainers can update measurements"
  ON client_measurements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      WHERE tcr.trainer_id = public.get_my_profile_id()
        AND tcr.client_id = client_measurements.client_id
        AND tcr.status = 'active'
    )
  );

-- ============================================================================
-- WORKOUT PROGRAMS POLICIES (Fixed)
-- ============================================================================

-- Clients can view their own programs (FIXED)
CREATE POLICY "Clients can view own programs"
  ON workout_programs FOR SELECT
  USING (client_id = public.get_my_profile_id());

-- Trainers can view programs they created (FIXED)
CREATE POLICY "Trainers can view their programs"
  ON workout_programs FOR SELECT
  USING (trainer_id = public.get_my_profile_id());

-- Trainers can create programs for their clients (FIXED)
CREATE POLICY "Trainers can create programs"
  ON workout_programs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      WHERE tcr.trainer_id = public.get_my_profile_id()
        AND tcr.client_id = workout_programs.client_id
        AND tcr.status = 'active'
    )
  );

-- Trainers can update their programs (FIXED)
CREATE POLICY "Trainers can update programs"
  ON workout_programs FOR UPDATE
  USING (trainer_id = public.get_my_profile_id());

-- ============================================================================
-- WORKOUT SESSIONS POLICIES (Fixed)
-- ============================================================================

-- Clients can view and manage their own sessions (FIXED)
CREATE POLICY "Clients can manage own sessions"
  ON workout_sessions FOR ALL
  USING (client_id = public.get_my_profile_id());

-- Trainers can view their clients' sessions (FIXED)
CREATE POLICY "Trainers can view clients sessions"
  ON workout_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      WHERE tcr.trainer_id = public.get_my_profile_id()
        AND tcr.client_id = workout_sessions.client_id
        AND tcr.status = 'active'
    )
  );

-- Trainers can update sessions (add feedback) (FIXED)
CREATE POLICY "Trainers can update sessions"
  ON workout_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      WHERE tcr.trainer_id = public.get_my_profile_id()
        AND tcr.client_id = workout_sessions.client_id
        AND tcr.status = 'active'
    )
  );

-- ============================================================================
-- ACTIVITY LOGS POLICIES (Fixed)
-- ============================================================================

-- Clients can manage their own activity logs (FIXED)
CREATE POLICY "Clients can manage own activity"
  ON activity_logs FOR ALL
  USING (client_id = public.get_my_profile_id());

-- Trainers can view their clients' activity logs (FIXED)
CREATE POLICY "Trainers can view clients activity"
  ON activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      WHERE tcr.trainer_id = public.get_my_profile_id()
        AND tcr.client_id = activity_logs.client_id
        AND tcr.status = 'active'
    )
  );

-- ============================================================================
-- NUTRITION POLICIES (Fixed)
-- ============================================================================

-- Nutrition Targets (FIXED)
CREATE POLICY "Clients can view own nutrition targets"
  ON nutrition_targets FOR SELECT
  USING (client_id = public.get_my_profile_id());

CREATE POLICY "Trainers can manage nutrition targets"
  ON nutrition_targets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      WHERE tcr.trainer_id = public.get_my_profile_id()
        AND tcr.client_id = nutrition_targets.client_id
        AND tcr.status = 'active'
    )
  );

-- Nutrition Logs (FIXED)
CREATE POLICY "Clients can manage own nutrition logs"
  ON nutrition_logs FOR ALL
  USING (client_id = public.get_my_profile_id());

CREATE POLICY "Trainers can view clients nutrition logs"
  ON nutrition_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      WHERE tcr.trainer_id = public.get_my_profile_id()
        AND tcr.client_id = nutrition_logs.client_id
        AND tcr.status = 'active'
    )
  );

-- ============================================================================
-- PROGRESS PHOTOS POLICIES (Fixed)
-- ============================================================================

-- Clients can manage their own photos (FIXED)
CREATE POLICY "Clients can manage own photos"
  ON progress_photos FOR ALL
  USING (client_id = public.get_my_profile_id());

-- Trainers can view their clients' photos (FIXED)
CREATE POLICY "Trainers can view clients photos"
  ON progress_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      WHERE tcr.trainer_id = public.get_my_profile_id()
        AND tcr.client_id = progress_photos.client_id
        AND tcr.status = 'active'
    )
  );

-- ============================================================================
-- MONTHLY REPORTS POLICIES (Fixed)
-- ============================================================================

-- Clients can view their own reports (FIXED)
CREATE POLICY "Clients can view own reports"
  ON monthly_reports FOR SELECT
  USING (
    client_id = public.get_my_profile_id()
    AND status = 'published'
  );

-- Trainers can manage reports for their clients (FIXED)
CREATE POLICY "Trainers can manage reports"
  ON monthly_reports FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      WHERE tcr.trainer_id = public.get_my_profile_id()
        AND tcr.client_id = monthly_reports.client_id
        AND tcr.status = 'active'
    )
  );

-- ============================================================================
-- MESSAGING POLICIES (Fixed)
-- ============================================================================

-- Conversations (FIXED)
CREATE POLICY "Users can view their conversations"
  ON conversations FOR SELECT
  USING (
    trainer_id = public.get_my_profile_id()
    OR client_id = public.get_my_profile_id()
  );

CREATE POLICY "Users can update their conversations"
  ON conversations FOR UPDATE
  USING (
    trainer_id = public.get_my_profile_id()
    OR client_id = public.get_my_profile_id()
  );

-- Messages (FIXED)
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (c.trainer_id = public.get_my_profile_id() OR c.client_id = public.get_my_profile_id())
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (c.trainer_id = public.get_my_profile_id() OR c.client_id = public.get_my_profile_id())
        AND messages.sender_id = public.get_my_profile_id()
    )
  );

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  USING (
    sender_id = public.get_my_profile_id()
    OR EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (c.trainer_id = public.get_my_profile_id() OR c.client_id = public.get_my_profile_id())
    )
  );

-- ============================================================================
-- APPOINTMENTS POLICIES (Fixed)
-- ============================================================================

-- Users can view their appointments (FIXED)
CREATE POLICY "Users can view their appointments"
  ON appointments FOR SELECT
  USING (
    trainer_id = public.get_my_profile_id()
    OR client_id = public.get_my_profile_id()
  );

-- Trainers can create appointments (FIXED - no recursion)
CREATE POLICY "Trainers can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (
    trainer_id = public.get_my_profile_id()
    AND public.get_my_role() = 'trainer'
  );

-- Users can update their appointments (FIXED)
CREATE POLICY "Users can update their appointments"
  ON appointments FOR UPDATE
  USING (
    trainer_id = public.get_my_profile_id()
    OR client_id = public.get_my_profile_id()
  );

-- ============================================================================
-- HEALTH SYNC DATA POLICIES (Fixed)
-- ============================================================================

-- Trainers can view their clients' health data (FIXED)
CREATE POLICY "Trainers can view clients health data"
  ON health_sync_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      JOIN profiles client_profile ON client_profile.id = tcr.client_id
      WHERE tcr.trainer_id = public.get_my_profile_id()
        AND client_profile.user_id = health_sync_data.user_id
        AND tcr.status = 'active'
    )
  );
