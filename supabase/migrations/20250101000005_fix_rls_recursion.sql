-- Fix RLS infinite recursion by using SECURITY DEFINER helper functions
-- This migration resolves the error: "new row violates row-level security policy"
-- for the trainer_client_relationships table

-- Drop existing problematic policies if they exist
DROP POLICY IF EXISTS "Trainers can view their relationships" ON trainer_client_relationships;
DROP POLICY IF EXISTS "Clients can view their relationships" ON trainer_client_relationships;
DROP POLICY IF EXISTS "Trainers can create relationships" ON trainer_client_relationships;
DROP POLICY IF EXISTS "Trainers can update relationships" ON trainer_client_relationships;
DROP POLICY IF EXISTS "Trainers can manage relationships" ON trainer_client_relationships;

-- Create helper functions that bypass RLS to prevent infinite recursion
-- These functions use SECURITY DEFINER to access the profiles table without triggering RLS
CREATE OR REPLACE FUNCTION public.get_my_profile_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_my_profile_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;

-- Create fixed RLS policies using the helper functions
-- These policies will NOT cause infinite recursion

-- Trainers can view relationships where they are the trainer
CREATE POLICY "Trainers can view their relationships"
  ON trainer_client_relationships
  FOR SELECT
  USING (trainer_id = public.get_my_profile_id());

-- Clients can view relationships where they are the client
CREATE POLICY "Clients can view their relationships"
  ON trainer_client_relationships
  FOR SELECT
  USING (client_id = public.get_my_profile_id());

-- Only trainers can create relationships, and only with themselves as the trainer
CREATE POLICY "Trainers can create relationships"
  ON trainer_client_relationships
  FOR INSERT
  WITH CHECK (
    trainer_id = public.get_my_profile_id()
    AND public.get_my_role() = 'trainer'
  );

-- Trainers can update relationships where they are the trainer
CREATE POLICY "Trainers can update relationships"
  ON trainer_client_relationships
  FOR UPDATE
  USING (trainer_id = public.get_my_profile_id())
  WITH CHECK (trainer_id = public.get_my_profile_id());

-- Trainers can delete relationships where they are the trainer
CREATE POLICY "Trainers can delete relationships"
  ON trainer_client_relationships
  FOR DELETE
  USING (trainer_id = public.get_my_profile_id());

-- Add comment explaining the fix
COMMENT ON FUNCTION public.get_my_profile_id() IS
  'Helper function with SECURITY DEFINER to get current user profile ID without triggering RLS recursion';

COMMENT ON FUNCTION public.get_my_role() IS
  'Helper function with SECURITY DEFINER to get current user role without triggering RLS recursion';
