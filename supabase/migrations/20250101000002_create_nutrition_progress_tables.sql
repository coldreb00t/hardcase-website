-- ============================================================================
-- HARD CASE - Nutrition & Progress Tracking Tables Migration
-- ============================================================================
-- Description: Creates nutrition logging and progress photo tables
-- Version: 1.0.0
-- Compatible with: Web (Next.js), iOS (Swift), Android (Kotlin)
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout');
CREATE TYPE photo_type AS ENUM ('front', 'side', 'back', 'progress', 'measurement', 'other');

-- ============================================================================
-- NUTRITION TARGETS TABLE
-- ============================================================================
-- Daily nutrition targets calculated by trainer (based on Harvard methodology)
-- Used by: Web trainer dashboard, Mobile apps for target display

CREATE TABLE nutrition_targets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  trainer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Date range this target is valid for
  valid_from DATE NOT NULL,
  valid_until DATE,

  -- Daily targets
  calories INTEGER NOT NULL,
  protein_grams DECIMAL(6,2) NOT NULL,
  fats_grams DECIMAL(6,2) NOT NULL,
  carbs_grams DECIMAL(6,2) NOT NULL,

  -- Additional targets
  fiber_grams DECIMAL(5,2),
  water_ml INTEGER,
  sodium_mg INTEGER,

  -- Calculation metadata
  calculation_method TEXT, -- e.g., "harvard_tdee", "custom"
  activity_level TEXT,
  goal TEXT, -- e.g., "weight_loss", "muscle_gain", "maintenance"

  -- Notes from trainer
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT valid_target_dates CHECK (valid_until IS NULL OR valid_until >= valid_from),
  CONSTRAINT positive_values CHECK (
    calories > 0 AND
    protein_grams > 0 AND
    fats_grams > 0 AND
    carbs_grams > 0
  )
);

-- Indexes
CREATE INDEX idx_nutrition_targets_client ON nutrition_targets(client_id);
CREATE INDEX idx_nutrition_targets_dates ON nutrition_targets(valid_from, valid_until);
CREATE INDEX idx_nutrition_targets_client_dates ON nutrition_targets(client_id, valid_from, valid_until);

-- ============================================================================
-- NUTRITION LOGS TABLE
-- ============================================================================
-- Daily nutrition intake logged by clients (using FatSecret integration)
-- Used by: Mobile apps, Web dashboard

CREATE TABLE nutrition_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- When
  date DATE NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  meal_type meal_type NOT NULL,

  -- What (macros)
  calories INTEGER NOT NULL,
  protein_grams DECIMAL(6,2) NOT NULL,
  fats_grams DECIMAL(6,2) NOT NULL,
  carbs_grams DECIMAL(6,2) NOT NULL,

  -- Additional nutrients
  fiber_grams DECIMAL(5,2),
  sugar_grams DECIMAL(5,2),
  sodium_mg INTEGER,

  -- Food description
  food_description TEXT,

  -- Photo evidence (stored in Supabase Storage)
  photo_urls TEXT[], -- Array of URLs from storage bucket

  -- Data source
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'fatsecret', 'photo')),

  -- Notes
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT positive_nutrition_values CHECK (
    calories >= 0 AND
    protein_grams >= 0 AND
    fats_grams >= 0 AND
    carbs_grams >= 0
  )
);

-- Indexes
CREATE INDEX idx_nutrition_logs_client ON nutrition_logs(client_id);
CREATE INDEX idx_nutrition_logs_date ON nutrition_logs(date DESC);
CREATE INDEX idx_nutrition_logs_client_date ON nutrition_logs(client_id, date DESC);
CREATE INDEX idx_nutrition_logs_meal_type ON nutrition_logs(meal_type);

-- ============================================================================
-- PROGRESS PHOTOS TABLE
-- ============================================================================
-- Progress photos for visual tracking
-- Used by: Mobile apps (camera), Web dashboard (viewing)

CREATE TABLE progress_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- When
  taken_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Photo details
  photo_type photo_type NOT NULL,
  photo_url TEXT NOT NULL, -- URL from Supabase Storage

  -- Optional measurements at time of photo
  weight_kg DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),

  -- Metadata
  tags TEXT[], -- e.g., ["before", "week_12", "contest_prep"]
  notes TEXT,
  is_public BOOLEAN DEFAULT false, -- for sharing/testimonials

  -- Image metadata
  image_width INTEGER,
  image_height INTEGER,
  file_size_bytes INTEGER,
  mime_type TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_progress_photos_client ON progress_photos(client_id);
CREATE INDEX idx_progress_photos_date ON progress_photos(taken_at DESC);
CREATE INDEX idx_progress_photos_type ON progress_photos(photo_type);
CREATE INDEX idx_progress_photos_client_date ON progress_photos(client_id, taken_at DESC);
CREATE INDEX idx_progress_photos_public ON progress_photos(is_public) WHERE is_public = true;

-- ============================================================================
-- MONTHLY REPORTS TABLE
-- ============================================================================
-- Comprehensive monthly progress reports generated by trainers
-- Used by: Web trainer dashboard, Mobile apps (client view)

CREATE TABLE monthly_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  trainer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Report period
  month DATE NOT NULL, -- First day of the month
  year INTEGER NOT NULL,

  -- Weight changes
  start_weight_kg DECIMAL(5,2),
  end_weight_kg DECIMAL(5,2),
  weight_change_kg DECIMAL(5,2),

  -- Body composition changes
  body_composition_change JSONB DEFAULT '{}'::jsonb,
  -- Example:
  -- {
  --   "body_fat_percentage": { "start": 20.5, "end": 18.2, "change": -2.3 },
  --   "muscle_mass_kg": { "start": 55.0, "end": 56.5, "change": 1.5 }
  -- }

  -- Performance metrics
  workout_completion_rate DECIMAL(5,2), -- percentage
  total_workouts_completed INTEGER,
  total_volume_lifted_kg INTEGER,

  -- Nutrition adherence
  nutrition_adherence_rate DECIMAL(5,2), -- percentage
  average_daily_calories INTEGER,
  average_daily_protein DECIMAL(6,2),

  -- Progress highlights
  achievements TEXT[], -- Array of accomplishments
  areas_for_improvement TEXT[],

  -- Recommendations
  trainer_notes TEXT,
  next_month_goals TEXT[],

  -- Attachments
  chart_images TEXT[], -- URLs to generated charts/graphs
  progress_photo_ids UUID[], -- References to progress_photos

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  UNIQUE(client_id, month),
  CONSTRAINT valid_month CHECK (EXTRACT(DAY FROM month) = 1)
);

-- Indexes
CREATE INDEX idx_monthly_reports_client ON monthly_reports(client_id);
CREATE INDEX idx_monthly_reports_month ON monthly_reports(month DESC);
CREATE INDEX idx_monthly_reports_status ON monthly_reports(status);
CREATE INDEX idx_monthly_reports_client_month ON monthly_reports(client_id, month DESC);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_nutrition_targets_updated_at
  BEFORE UPDATE ON nutrition_targets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_logs_updated_at
  BEFORE UPDATE ON nutrition_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_photos_updated_at
  BEFORE UPDATE ON progress_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_reports_updated_at
  BEFORE UPDATE ON monthly_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get current nutrition target for a client
CREATE OR REPLACE FUNCTION get_current_nutrition_target(client_user_id UUID)
RETURNS TABLE (
  calories INTEGER,
  protein_grams DECIMAL,
  fats_grams DECIMAL,
  carbs_grams DECIMAL
) AS $$
  SELECT
    nt.calories,
    nt.protein_grams,
    nt.fats_grams,
    nt.carbs_grams
  FROM nutrition_targets nt
  JOIN profiles p ON p.id = nt.client_id
  WHERE p.user_id = client_user_id
    AND nt.valid_from <= CURRENT_DATE
    AND (nt.valid_until IS NULL OR nt.valid_until >= CURRENT_DATE)
  ORDER BY nt.valid_from DESC
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Calculate daily nutrition totals for a specific date
CREATE OR REPLACE FUNCTION get_daily_nutrition_totals(
  client_user_id UUID,
  target_date DATE
)
RETURNS TABLE (
  total_calories INTEGER,
  total_protein DECIMAL,
  total_fats DECIMAL,
  total_carbs DECIMAL,
  meal_count INTEGER
) AS $$
  SELECT
    SUM(calories)::INTEGER,
    SUM(protein_grams),
    SUM(fats_grams),
    SUM(carbs_grams),
    COUNT(*)::INTEGER
  FROM nutrition_logs nl
  JOIN profiles p ON p.id = nl.client_id
  WHERE p.user_id = client_user_id
    AND nl.date = target_date;
$$ LANGUAGE sql STABLE;

-- Get nutrition adherence rate for a period
CREATE OR REPLACE FUNCTION get_nutrition_adherence_rate(
  client_user_id UUID,
  days_back INTEGER DEFAULT 30
)
RETURNS DECIMAL AS $$
DECLARE
  days_logged INTEGER;
  total_days INTEGER;
BEGIN
  total_days := days_back;

  SELECT COUNT(DISTINCT date)
  INTO days_logged
  FROM nutrition_logs nl
  JOIN profiles p ON p.id = nl.client_id
  WHERE p.user_id = client_user_id
    AND nl.date >= CURRENT_DATE - days_back;

  IF total_days = 0 THEN
    RETURN 0;
  END IF;

  RETURN ROUND((days_logged::DECIMAL / total_days) * 100, 2);
END;
$$ LANGUAGE plpgsql STABLE;

-- Get progress photo comparison (before/after)
CREATE OR REPLACE FUNCTION get_progress_comparison(
  client_user_id UUID,
  photo_type_filter photo_type DEFAULT 'front'
)
RETURNS TABLE (
  first_photo_url TEXT,
  first_photo_date TIMESTAMPTZ,
  latest_photo_url TEXT,
  latest_photo_date TIMESTAMPTZ,
  days_between INTEGER
) AS $$
  WITH first_photo AS (
    SELECT photo_url, taken_at
    FROM progress_photos pp
    JOIN profiles p ON p.id = pp.client_id
    WHERE p.user_id = client_user_id
      AND pp.photo_type = photo_type_filter
    ORDER BY taken_at ASC
    LIMIT 1
  ),
  latest_photo AS (
    SELECT photo_url, taken_at
    FROM progress_photos pp
    JOIN profiles p ON p.id = pp.client_id
    WHERE p.user_id = client_user_id
      AND pp.photo_type = photo_type_filter
    ORDER BY taken_at DESC
    LIMIT 1
  )
  SELECT
    f.photo_url,
    f.taken_at,
    l.photo_url,
    l.taken_at,
    EXTRACT(DAY FROM (l.taken_at - f.taken_at))::INTEGER
  FROM first_photo f
  CROSS JOIN latest_photo l;
$$ LANGUAGE sql STABLE;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE nutrition_targets IS 'Daily nutrition targets set by trainers based on Harvard methodology';
COMMENT ON TABLE nutrition_logs IS 'Client food intake logs with photo evidence from FatSecret/manual';
COMMENT ON TABLE progress_photos IS 'Progress photos for visual tracking and comparisons';
COMMENT ON TABLE monthly_reports IS 'Comprehensive monthly progress reports generated by trainers';
COMMENT ON FUNCTION get_current_nutrition_target IS 'Returns active nutrition target for a client';
COMMENT ON FUNCTION get_daily_nutrition_totals IS 'Calculates total macros consumed on a specific date';
COMMENT ON FUNCTION get_nutrition_adherence_rate IS 'Calculates percentage of days with logged nutrition';
COMMENT ON FUNCTION get_progress_comparison IS 'Returns first and latest progress photos for comparison';
