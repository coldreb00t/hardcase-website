-- ============================================================================
-- HARD CASE - Workout & Activity Tables Migration
-- ============================================================================
-- Description: Creates workout programs and activity tracking tables
-- Version: 1.0.0
-- Compatible with: Web (Next.js), iOS (Swift), Android (Kotlin)
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE program_status AS ENUM ('draft', 'active', 'completed', 'archived');
CREATE TYPE exercise_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE workout_status AS ENUM ('scheduled', 'completed', 'skipped', 'missed');

-- ============================================================================
-- WORKOUT PROGRAMS TABLE
-- ============================================================================
-- Main training programs assigned to clients
-- Used by: Web trainer dashboard, Mobile apps for clients

CREATE TABLE workout_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Ownership
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  trainer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Program details
  title TEXT NOT NULL,
  description TEXT,
  status program_status DEFAULT 'draft' NOT NULL,

  -- Schedule
  start_date DATE NOT NULL,
  end_date DATE,
  weeks_duration INTEGER,

  -- Program structure (flexible JSONB for different workout types)
  program_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Example structure:
  -- {
  --   "weeks": [
  --     {
  --       "week_number": 1,
  --       "workouts": [
  --         {
  --           "day": "monday",
  --           "title": "Upper Body Strength",
  --           "exercises": [
  --             {
  --               "name": "Bench Press",
  --               "sets": 4,
  --               "reps": "8-10",
  --               "rest_seconds": 120,
  --               "notes": "Focus on form",
  --               "video_url": "https://...",
  --               "difficulty": "intermediate"
  --             }
  --           ]
  --         }
  --       ]
  --     }
  --   ],
  --   "general_notes": "Progressive overload each week"
  -- }

  -- Goals
  goals TEXT[],

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Indexes
CREATE INDEX idx_workout_programs_client ON workout_programs(client_id);
CREATE INDEX idx_workout_programs_trainer ON workout_programs(trainer_id);
CREATE INDEX idx_workout_programs_status ON workout_programs(status);
CREATE INDEX idx_workout_programs_dates ON workout_programs(start_date, end_date);

-- ============================================================================
-- WORKOUT SESSIONS TABLE
-- ============================================================================
-- Individual workout sessions (logged by client)
-- Used by: Mobile apps for tracking workout completion

CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- References
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  program_id UUID REFERENCES workout_programs(id) ON DELETE SET NULL,

  -- Session details
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  status workout_status DEFAULT 'scheduled' NOT NULL,

  -- Session data
  title TEXT NOT NULL,
  exercises_completed JSONB DEFAULT '[]'::jsonb,
  -- Example structure:
  -- [
  --   {
  --     "exercise_name": "Bench Press",
  --     "sets_completed": [
  --       { "reps": 10, "weight_kg": 80, "rpe": 7 },
  --       { "reps": 8, "weight_kg": 82.5, "rpe": 8 }
  --     ]
  --   }
  -- ]

  -- Performance metrics
  duration_minutes INTEGER,
  total_volume_kg INTEGER, -- total weight lifted
  average_heart_rate INTEGER,
  max_heart_rate INTEGER,
  calories_burned INTEGER,

  -- Notes
  notes TEXT,
  trainer_feedback TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_workout_sessions_client ON workout_sessions(client_id);
CREATE INDEX idx_workout_sessions_program ON workout_sessions(program_id);
CREATE INDEX idx_workout_sessions_status ON workout_sessions(status);
CREATE INDEX idx_workout_sessions_date ON workout_sessions(completed_at DESC);
CREATE INDEX idx_workout_sessions_client_date ON workout_sessions(client_id, completed_at DESC);

-- ============================================================================
-- ACTIVITY LOGS TABLE
-- ============================================================================
-- Daily activity tracking (steps, sleep, recovery)
-- Used by: Mobile apps syncing with HealthKit/Google Fit

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,

  -- Daily activity
  steps INTEGER,
  distance_km DECIMAL(6,2),
  floors_climbed INTEGER,
  active_calories INTEGER,
  total_calories INTEGER,

  -- Sleep data
  sleep_hours DECIMAL(4,2),
  deep_sleep_hours DECIMAL(4,2),
  rem_sleep_hours DECIMAL(4,2),
  sleep_quality_score INTEGER, -- 1-100

  -- Heart rate
  resting_heart_rate INTEGER,
  average_heart_rate INTEGER,
  max_heart_rate INTEGER,
  hrv_ms INTEGER, -- Heart Rate Variability

  -- Recovery & readiness
  recovery_score INTEGER, -- 1-100
  readiness_score INTEGER, -- 1-100
  stress_level INTEGER, -- 1-10

  -- Heart rate zones (minutes spent in each zone)
  heart_rate_zones JSONB DEFAULT '{}'::jsonb,
  -- Example: { "zone1": 120, "zone2": 45, "zone3": 30, "zone4": 10, "zone5": 5 }

  -- Data source
  data_source TEXT DEFAULT 'manual' CHECK (data_source IN ('manual', 'healthkit', 'googlefit', 'garmin', 'polar')),

  -- Notes
  notes TEXT,
  mood TEXT, -- e.g., "great", "tired", "stressed"

  -- Metadata
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  UNIQUE(client_id, date),
  CONSTRAINT valid_sleep_hours CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  CONSTRAINT valid_scores CHECK (
    (recovery_score IS NULL OR (recovery_score >= 0 AND recovery_score <= 100)) AND
    (readiness_score IS NULL OR (readiness_score >= 0 AND readiness_score <= 100)) AND
    (sleep_quality_score IS NULL OR (sleep_quality_score >= 0 AND sleep_quality_score <= 100))
  )
);

-- Indexes
CREATE INDEX idx_activity_logs_client ON activity_logs(client_id);
CREATE INDEX idx_activity_logs_date ON activity_logs(date DESC);
CREATE INDEX idx_activity_logs_client_date ON activity_logs(client_id, date DESC);
CREATE INDEX idx_activity_logs_source ON activity_logs(data_source);

-- ============================================================================
-- DEVICE TOKENS TABLE
-- ============================================================================
-- Push notification tokens for mobile devices
-- Used by: Mobile apps (iOS APNs, Android FCM)

CREATE TABLE device_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Device info
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  token TEXT NOT NULL,
  device_name TEXT,
  device_model TEXT,
  os_version TEXT,
  app_version TEXT,

  -- Status
  active BOOLEAN DEFAULT true NOT NULL,
  last_used_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  UNIQUE(user_id, token)
);

-- Indexes
CREATE INDEX idx_device_tokens_user ON device_tokens(user_id);
CREATE INDEX idx_device_tokens_platform ON device_tokens(platform);
CREATE INDEX idx_device_tokens_active ON device_tokens(active) WHERE active = true;

-- ============================================================================
-- HEALTH SYNC DATA TABLE
-- ============================================================================
-- Raw health data synced from HealthKit/Google Fit
-- Separate from activity_logs for detailed historical data

CREATE TABLE health_sync_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Source
  source_type TEXT NOT NULL CHECK (source_type IN ('healthkit', 'googlefit', 'manual')),
  data_type TEXT NOT NULL, -- e.g., "steps", "heart_rate", "sleep", "workout"

  -- Timestamp
  recorded_at TIMESTAMPTZ NOT NULL,

  -- Value (flexible for different data types)
  value JSONB NOT NULL,
  -- Example for steps: { "count": 8543 }
  -- Example for heart_rate: { "bpm": 72 }
  -- Example for workout: { "type": "running", "duration": 1800, "distance": 5000 }

  -- Metadata
  synced_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_health_sync_user ON health_sync_data(user_id);
CREATE INDEX idx_health_sync_type ON health_sync_data(data_type);
CREATE INDEX idx_health_sync_recorded ON health_sync_data(recorded_at DESC);
CREATE INDEX idx_health_sync_user_type_date ON health_sync_data(user_id, data_type, recorded_at DESC);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_workout_programs_updated_at
  BEFORE UPDATE ON workout_programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_sessions_updated_at
  BEFORE UPDATE ON workout_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activity_logs_updated_at
  BEFORE UPDATE ON activity_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_device_tokens_updated_at
  BEFORE UPDATE ON device_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get active workout program for client
CREATE OR REPLACE FUNCTION get_active_program(client_user_id UUID)
RETURNS UUID AS $$
  SELECT wp.id
  FROM workout_programs wp
  JOIN profiles p ON p.id = wp.client_id
  WHERE p.user_id = client_user_id
    AND wp.status = 'active'
    AND wp.start_date <= CURRENT_DATE
    AND (wp.end_date IS NULL OR wp.end_date >= CURRENT_DATE)
  ORDER BY wp.start_date DESC
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Calculate weekly workout completion rate
CREATE OR REPLACE FUNCTION get_workout_completion_rate(
  client_user_id UUID,
  weeks_back INTEGER DEFAULT 4
)
RETURNS DECIMAL AS $$
DECLARE
  total_scheduled INTEGER;
  total_completed INTEGER;
BEGIN
  SELECT
    COUNT(*) FILTER (WHERE status IN ('scheduled', 'completed', 'skipped', 'missed')),
    COUNT(*) FILTER (WHERE status = 'completed')
  INTO total_scheduled, total_completed
  FROM workout_sessions ws
  JOIN profiles p ON p.id = ws.client_id
  WHERE p.user_id = client_user_id
    AND ws.scheduled_at >= NOW() - (weeks_back || ' weeks')::INTERVAL;

  IF total_scheduled = 0 THEN
    RETURN 0;
  END IF;

  RETURN ROUND((total_completed::DECIMAL / total_scheduled) * 100, 2);
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE workout_programs IS 'Training programs created by trainers for clients';
COMMENT ON TABLE workout_sessions IS 'Individual workout sessions logged by clients';
COMMENT ON TABLE activity_logs IS 'Daily activity tracking from wearables and manual input';
COMMENT ON TABLE device_tokens IS 'Push notification tokens for mobile devices';
COMMENT ON TABLE health_sync_data IS 'Raw health data synced from external sources';
COMMENT ON FUNCTION get_active_program IS 'Returns active workout program ID for a client';
COMMENT ON FUNCTION get_workout_completion_rate IS 'Calculates workout completion percentage';
