-- ============================================================================
-- HARD CASE - Admin Trainer Assignment Policies
-- ============================================================================
-- Description: Allows admins to assign trainers to clients
-- Fixes: RLS error when admin tries to create trainer_client_relationships
-- ============================================================================

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Admins can assign trainers" ON trainer_client_relationships;
DROP POLICY IF EXISTS "Admins can update trainer assignments" ON trainer_client_relationships;
DROP POLICY IF EXISTS "Admins can view all relationships" ON trainer_client_relationships;

-- Admin can create trainer-client relationships
CREATE POLICY "Admins can assign trainers"
  ON trainer_client_relationships FOR INSERT
  TO authenticated
  WITH CHECK (public.get_my_role() = 'admin');

-- Admin can update trainer-client relationships (e.g., change primary status)
CREATE POLICY "Admins can update trainer assignments"
  ON trainer_client_relationships FOR UPDATE
  TO authenticated
  USING (public.get_my_role() = 'admin')
  WITH CHECK (public.get_my_role() = 'admin');

-- Admin can view all trainer-client relationships
CREATE POLICY "Admins can view all relationships"
  ON trainer_client_relationships FOR SELECT
  TO authenticated
  USING (public.get_my_role() = 'admin');

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "Admins can assign trainers" ON trainer_client_relationships IS
  'Allows admins to assign trainers to clients and set primary trainer status';

COMMENT ON POLICY "Admins can update trainer assignments" ON trainer_client_relationships IS
  'Allows admins to modify trainer assignments including changing primary trainer';

COMMENT ON POLICY "Admins can view all relationships" ON trainer_client_relationships IS
  'Allows admins to see all trainer-client relationships in the system';
