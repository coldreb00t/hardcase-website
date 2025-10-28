-- ============================================================================
-- HARD CASE - Admin Profile Update Policy
-- ============================================================================
-- Description: Allow admins to update any user profile (including role)
-- ============================================================================

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (public.get_my_role() = 'admin')
  WITH CHECK (public.get_my_role() = 'admin');

COMMENT ON POLICY "Admins can update any profile" ON profiles IS
  'Administrators can modify any user profile, including role assignments';
