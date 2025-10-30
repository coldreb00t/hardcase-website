-- ============================================================================
-- HARD CASE - Add Primary Trainer Concept
-- ============================================================================
-- Description: Adds is_primary field to distinguish primary vs additional trainers
-- Business Logic:
--   - One client can have multiple trainers (online training model)
--   - Only ONE trainer can be primary (is_primary = true)
--   - Primary trainer creates and edits workout programs
--   - Additional trainers can view but not edit
--   - Admin can assign trainers and change primary status
-- ============================================================================

-- Add is_primary field to trainer_client_relationships
ALTER TABLE trainer_client_relationships
ADD COLUMN is_primary BOOLEAN DEFAULT false NOT NULL;

-- Create index for quick lookup of primary trainer
CREATE INDEX idx_trainer_client_primary ON trainer_client_relationships(client_id, is_primary)
WHERE is_primary = true;

-- Add constraint: only one primary trainer per client
-- Using unique partial index to enforce this at database level
CREATE UNIQUE INDEX unique_primary_trainer_per_client
ON trainer_client_relationships(client_id)
WHERE is_primary = true AND status = 'active';

-- Update RLS policies for workout_programs
-- Drop old policies
DROP POLICY IF EXISTS "Trainers can create programs" ON workout_programs;
DROP POLICY IF EXISTS "Trainers can update programs" ON workout_programs;

-- Only PRIMARY trainers can create programs
CREATE POLICY "Primary trainers can create programs"
  ON workout_programs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      WHERE tcr.trainer_id = public.get_my_profile_id()
        AND tcr.client_id = workout_programs.client_id
        AND tcr.is_primary = true
        AND tcr.status = 'active'
    )
  );

-- Only PRIMARY trainers can update their programs
CREATE POLICY "Primary trainers can update programs"
  ON workout_programs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trainer_client_relationships tcr
      WHERE tcr.trainer_id = public.get_my_profile_id()
        AND tcr.client_id = workout_programs.client_id
        AND tcr.is_primary = true
        AND tcr.status = 'active'
    )
  );

-- Admins can update any program
CREATE POLICY "Admins can update programs"
  ON workout_programs FOR UPDATE
  USING (public.get_my_role() = 'admin');

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN trainer_client_relationships.is_primary IS
  'Indicates if this trainer is the primary trainer for this client. Only primary trainer can create/edit programs.';

COMMENT ON INDEX unique_primary_trainer_per_client IS
  'Ensures only one active primary trainer per client';

COMMENT ON POLICY "Primary trainers can create programs" ON workout_programs IS
  'Only the primary trainer assigned to a client can create workout programs for them';

COMMENT ON POLICY "Primary trainers can update programs" ON workout_programs IS
  'Only the primary trainer can edit workout programs. Additional trainers can view but not edit.';
