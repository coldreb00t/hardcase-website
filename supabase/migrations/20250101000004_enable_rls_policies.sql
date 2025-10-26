-- ============================================================================
-- HARD CASE - Row Level Security (RLS) Policies
-- ============================================================================
-- Description: Security policies ensuring users can only access their own data
-- Version: 1.0.0
-- CRITICAL: These policies protect data across Web, iOS, and Android clients
-- ============================================================================

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_client_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_sync_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Trainers can view their clients' profiles
CREATE POLICY "Trainers can view their clients profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      JOIN profiles trainer_profile ON trainer_profile.id = tcr.trainer_id
      WHERE trainer_profile.user_id = auth.uid()
        AND tcr.client_id = profiles.id
        AND tcr.status = 'active'
    )
  );

-- Clients can view their trainer's profile
CREATE POLICY "Clients can view their trainers profile"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      JOIN profiles client_profile ON client_profile.id = tcr.client_id
      WHERE client_profile.user_id = auth.uid()
        AND tcr.trainer_id = profiles.id
        AND tcr.status = 'active'
    )
  );

-- ============================================================================
-- TRAINER-CLIENT RELATIONSHIPS POLICIES
-- ============================================================================

-- Trainers can view their client relationships
CREATE POLICY "Trainers can view their relationships"
  ON trainer_client_relationships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.id = trainer_client_relationships.trainer_id
    )
  );

-- Clients can view their trainer relationships
CREATE POLICY "Clients can view their relationships"
  ON trainer_client_relationships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.id = trainer_client_relationships.client_id
    )
  );

-- Only trainers can create relationships
CREATE POLICY "Trainers can create relationships"
  ON trainer_client_relationships FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.id = trainer_client_relationships.trainer_id
        AND profiles.role = 'trainer'
    )
  );

-- Trainers can update their relationships
CREATE POLICY "Trainers can update relationships"
  ON trainer_client_relationships FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.id = trainer_client_relationships.trainer_id
    )
  );

-- ============================================================================
-- CLIENT MEASUREMENTS POLICIES
-- ============================================================================

-- Clients can view their own measurements
CREATE POLICY "Clients can view own measurements"
  ON client_measurements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.id = client_measurements.client_id
    )
  );

-- Trainers can view their clients' measurements
CREATE POLICY "Trainers can view clients measurements"
  ON client_measurements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      JOIN profiles trainer_profile ON trainer_profile.id = tcr.trainer_id
      WHERE trainer_profile.user_id = auth.uid()
        AND tcr.client_id = client_measurements.client_id
        AND tcr.status = 'active'
    )
  );

-- Trainers can insert measurements for their clients
CREATE POLICY "Trainers can create measurements"
  ON client_measurements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      JOIN profiles trainer_profile ON trainer_profile.id = tcr.trainer_id
      WHERE trainer_profile.user_id = auth.uid()
        AND tcr.client_id = client_measurements.client_id
        AND tcr.status = 'active'
    )
  );

-- Trainers can update measurements
CREATE POLICY "Trainers can update measurements"
  ON client_measurements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      JOIN profiles trainer_profile ON trainer_profile.id = tcr.trainer_id
      WHERE trainer_profile.user_id = auth.uid()
        AND tcr.client_id = client_measurements.client_id
        AND tcr.status = 'active'
    )
  );

-- ============================================================================
-- WORKOUT PROGRAMS POLICIES
-- ============================================================================

-- Clients can view their own programs
CREATE POLICY "Clients can view own programs"
  ON workout_programs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.id = workout_programs.client_id
    )
  );

-- Trainers can view programs they created
CREATE POLICY "Trainers can view their programs"
  ON workout_programs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.id = workout_programs.trainer_id
    )
  );

-- Trainers can create programs for their clients
CREATE POLICY "Trainers can create programs"
  ON workout_programs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      JOIN profiles trainer_profile ON trainer_profile.id = tcr.trainer_id
      WHERE trainer_profile.user_id = auth.uid()
        AND tcr.client_id = workout_programs.client_id
        AND tcr.status = 'active'
    )
  );

-- Trainers can update their programs
CREATE POLICY "Trainers can update programs"
  ON workout_programs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.id = workout_programs.trainer_id
    )
  );

-- ============================================================================
-- WORKOUT SESSIONS POLICIES
-- ============================================================================

-- Clients can view and manage their own sessions
CREATE POLICY "Clients can manage own sessions"
  ON workout_sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.id = workout_sessions.client_id
    )
  );

-- Trainers can view their clients' sessions
CREATE POLICY "Trainers can view clients sessions"
  ON workout_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      JOIN profiles trainer_profile ON trainer_profile.id = tcr.trainer_id
      WHERE trainer_profile.user_id = auth.uid()
        AND tcr.client_id = workout_sessions.client_id
        AND tcr.status = 'active'
    )
  );

-- Trainers can update sessions (add feedback)
CREATE POLICY "Trainers can update sessions"
  ON workout_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      JOIN profiles trainer_profile ON trainer_profile.id = tcr.trainer_id
      WHERE trainer_profile.user_id = auth.uid()
        AND tcr.client_id = workout_sessions.client_id
        AND tcr.status = 'active'
    )
  );

-- ============================================================================
-- ACTIVITY LOGS POLICIES
-- ============================================================================

-- Clients can manage their own activity logs
CREATE POLICY "Clients can manage own activity"
  ON activity_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.id = activity_logs.client_id
    )
  );

-- Trainers can view their clients' activity logs
CREATE POLICY "Trainers can view clients activity"
  ON activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      JOIN profiles trainer_profile ON trainer_profile.id = tcr.trainer_id
      WHERE trainer_profile.user_id = auth.uid()
        AND tcr.client_id = activity_logs.client_id
        AND tcr.status = 'active'
    )
  );

-- ============================================================================
-- NUTRITION POLICIES
-- ============================================================================

-- Nutrition Targets
CREATE POLICY "Clients can view own nutrition targets"
  ON nutrition_targets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.id = nutrition_targets.client_id
    )
  );

CREATE POLICY "Trainers can manage nutrition targets"
  ON nutrition_targets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      JOIN profiles trainer_profile ON trainer_profile.id = tcr.trainer_id
      WHERE trainer_profile.user_id = auth.uid()
        AND tcr.client_id = nutrition_targets.client_id
        AND tcr.status = 'active'
    )
  );

-- Nutrition Logs
CREATE POLICY "Clients can manage own nutrition logs"
  ON nutrition_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.id = nutrition_logs.client_id
    )
  );

CREATE POLICY "Trainers can view clients nutrition logs"
  ON nutrition_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      JOIN profiles trainer_profile ON trainer_profile.id = tcr.trainer_id
      WHERE trainer_profile.user_id = auth.uid()
        AND tcr.client_id = nutrition_logs.client_id
        AND tcr.status = 'active'
    )
  );

-- ============================================================================
-- PROGRESS PHOTOS POLICIES
-- ============================================================================

-- Clients can manage their own photos
CREATE POLICY "Clients can manage own photos"
  ON progress_photos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.id = progress_photos.client_id
    )
  );

-- Trainers can view their clients' photos
CREATE POLICY "Trainers can view clients photos"
  ON progress_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      JOIN profiles trainer_profile ON trainer_profile.id = tcr.trainer_id
      WHERE trainer_profile.user_id = auth.uid()
        AND tcr.client_id = progress_photos.client_id
        AND tcr.status = 'active'
    )
  );

-- Anyone can view public photos (for testimonials)
CREATE POLICY "Public photos are viewable"
  ON progress_photos FOR SELECT
  USING (is_public = true);

-- ============================================================================
-- MONTHLY REPORTS POLICIES
-- ============================================================================

-- Clients can view their own reports
CREATE POLICY "Clients can view own reports"
  ON monthly_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.id = monthly_reports.client_id
    )
    AND status = 'published'
  );

-- Trainers can manage reports for their clients
CREATE POLICY "Trainers can manage reports"
  ON monthly_reports FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      JOIN profiles trainer_profile ON trainer_profile.id = tcr.trainer_id
      WHERE trainer_profile.user_id = auth.uid()
        AND tcr.client_id = monthly_reports.client_id
        AND tcr.status = 'active'
    )
  );

-- ============================================================================
-- MESSAGING POLICIES
-- ============================================================================

-- Conversations
CREATE POLICY "Users can view their conversations"
  ON conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND (profiles.id = conversations.trainer_id OR profiles.id = conversations.client_id)
    )
  );

CREATE POLICY "Users can update their conversations"
  ON conversations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND (profiles.id = conversations.trainer_id OR profiles.id = conversations.client_id)
    )
  );

-- Messages
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      JOIN profiles p ON p.user_id = auth.uid()
      WHERE c.id = messages.conversation_id
        AND (c.trainer_id = p.id OR c.client_id = p.id)
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations c
      JOIN profiles p ON p.user_id = auth.uid()
      WHERE c.id = messages.conversation_id
        AND (c.trainer_id = p.id OR c.client_id = p.id)
        AND messages.sender_id = p.id
    )
  );

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND (profiles.id = messages.sender_id OR
             EXISTS (
               SELECT 1 FROM conversations c
               WHERE c.id = messages.conversation_id
                 AND (c.trainer_id = profiles.id OR c.client_id = profiles.id)
             ))
    )
  );

-- ============================================================================
-- APPOINTMENTS POLICIES
-- ============================================================================

-- Users can view their appointments
CREATE POLICY "Users can view their appointments"
  ON appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND (profiles.id = appointments.trainer_id OR profiles.id = appointments.client_id)
    )
  );

-- Trainers can create appointments
CREATE POLICY "Trainers can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.id = appointments.trainer_id
        AND profiles.role = 'trainer'
    )
  );

-- Users can update their appointments
CREATE POLICY "Users can update their appointments"
  ON appointments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND (profiles.id = appointments.trainer_id OR profiles.id = appointments.client_id)
    )
  );

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================

-- Users can view and update their own notifications
CREATE POLICY "Users can manage own notifications"
  ON notifications FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- DEVICE TOKENS POLICIES
-- ============================================================================

-- Users can manage their own device tokens
CREATE POLICY "Users can manage own device tokens"
  ON device_tokens FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- HEALTH SYNC DATA POLICIES
-- ============================================================================

-- Users can manage their own health data
CREATE POLICY "Users can manage own health data"
  ON health_sync_data FOR ALL
  USING (auth.uid() = user_id);

-- Trainers can view their clients' health data
CREATE POLICY "Trainers can view clients health data"
  ON health_sync_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      JOIN profiles trainer_profile ON trainer_profile.id = tcr.trainer_id
      JOIN profiles client_profile ON client_profile.id = tcr.client_id
      WHERE trainer_profile.user_id = auth.uid()
        AND client_profile.user_id = health_sync_data.user_id
        AND tcr.status = 'active'
    )
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "Users can view own profile" ON profiles IS 'Users can only see their own profile data';
COMMENT ON POLICY "Trainers can view their clients profiles" ON profiles IS 'Trainers can see profiles of their active clients';
COMMENT ON POLICY "Clients can manage own sessions" ON workout_sessions IS 'Clients have full control over their workout session logs';
COMMENT ON POLICY "Users can view their conversations" ON conversations IS 'Users can only access conversations they are part of';
