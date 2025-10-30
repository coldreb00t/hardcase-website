-- ============================================================================
-- HARD CASE - Core Tables Migration
-- ============================================================================
-- Description: Creates core user profiles and client measurement tables
-- Version: 1.0.0
-- Compatible with: Web (Next.js), iOS (Swift), Android (Kotlin)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

-- User role types
CREATE TYPE user_role AS ENUM ('client', 'trainer', 'admin');

-- Gender types
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
-- Extends auth.users with additional profile information
-- Used by: Web, iOS, Android apps

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'client',

  -- Personal Information
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender gender_type,

  -- Profile Settings
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  locale TEXT DEFAULT 'ru',

  -- Notifications
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT valid_phone CHECK (phone ~ '^[\d\s\+\-\(\)]+$' OR phone IS NULL)
);

-- Indexes for performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- ============================================================================
-- TRAINER-CLIENT RELATIONSHIPS TABLE
-- ============================================================================
-- Maps which trainers work with which clients
-- Used for: RLS policies, access control

CREATE TABLE trainer_client_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Relationship status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),

  -- Metadata
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ended_at TIMESTAMPTZ,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  UNIQUE(trainer_id, client_id),
  CONSTRAINT different_users CHECK (trainer_id != client_id)
);

-- Indexes
CREATE INDEX idx_trainer_client_trainer ON trainer_client_relationships(trainer_id);
CREATE INDEX idx_trainer_client_client ON trainer_client_relationships(client_id);
CREATE INDEX idx_trainer_client_status ON trainer_client_relationships(status);

-- ============================================================================
-- CLIENT MEASUREMENTS TABLE
-- ============================================================================
-- Stores body measurements, composition data (anamnez)
-- Used by: Web dashboard, Mobile apps for progress tracking

CREATE TABLE client_measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Measurement date
  measured_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Basic metrics
  weight DECIMAL(5,2), -- kg (e.g., 75.50)
  height DECIMAL(5,2), -- cm (e.g., 175.00)

  -- Body composition
  body_fat_percentage DECIMAL(4,2), -- % (e.g., 15.50)
  muscle_mass DECIMAL(5,2), -- kg
  bone_mass DECIMAL(4,2), -- kg
  water_percentage DECIMAL(4,2), -- %
  visceral_fat INTEGER, -- level 1-59

  -- Circumferences (обхваты) in cm
  measurements JSONB DEFAULT '{}'::jsonb,
  -- Example structure:
  -- {
  --   "chest": 95.5,
  --   "waist": 80.0,
  --   "hips": 98.0,
  --   "bicep_left": 35.0,
  --   "bicep_right": 35.5,
  --   "thigh_left": 58.0,
  --   "thigh_right": 58.5,
  --   "calf_left": 38.0,
  --   "calf_right": 38.0
  -- }

  -- Additional data
  notes TEXT,
  measured_by UUID REFERENCES profiles(id), -- trainer who took measurements

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT valid_weight CHECK (weight > 0 AND weight < 500),
  CONSTRAINT valid_height CHECK (height > 0 AND height < 300),
  CONSTRAINT valid_body_fat CHECK (body_fat_percentage >= 0 AND body_fat_percentage <= 100)
);

-- Indexes
CREATE INDEX idx_measurements_client ON client_measurements(client_id);
CREATE INDEX idx_measurements_date ON client_measurements(measured_at DESC);
CREATE INDEX idx_measurements_client_date ON client_measurements(client_id, measured_at DESC);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainer_client_updated_at
  BEFORE UPDATE ON trainer_client_relationships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_measurements_updated_at
  BEFORE UPDATE ON client_measurements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate BMI
CREATE OR REPLACE FUNCTION calculate_bmi(weight_kg DECIMAL, height_cm DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  IF height_cm IS NULL OR height_cm = 0 OR weight_kg IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN ROUND(weight_kg / POWER(height_cm / 100, 2), 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get client's trainer
CREATE OR REPLACE FUNCTION get_client_trainer(client_user_id UUID)
RETURNS UUID AS $$
  SELECT trainer_id
  FROM trainer_client_relationships tcr
  JOIN profiles p ON p.id = tcr.client_id
  WHERE p.user_id = client_user_id
    AND tcr.status = 'active'
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Function to handle new user signup - auto-create profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profiles extending auth.users - shared across Web, iOS, Android';
COMMENT ON TABLE trainer_client_relationships IS 'Defines trainer-client relationships for access control';
COMMENT ON TABLE client_measurements IS 'Body measurements and composition data for progress tracking';
COMMENT ON FUNCTION calculate_bmi IS 'Calculates BMI from weight (kg) and height (cm)';
COMMENT ON FUNCTION get_client_trainer IS 'Returns active trainer ID for a given client';
