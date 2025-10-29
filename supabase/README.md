# Supabase Database Migrations

This directory contains SQL migrations for the Supabase database used by the Hardcase website.

## Applying the RLS Fix Migration

If you're experiencing the error:
```
new row violates row-level security policy for table "trainer_client_relationships"
```

You need to apply the RLS fix migration to your Supabase database.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `migrations/20250101000005_fix_rls_recursion.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed and linked to your project:

```bash
# Link to your project (if not already linked)
supabase link --project-ref your-project-ref

# Push the migration
supabase db push

# Or apply the specific migration file
supabase db execute --file supabase/migrations/20250101000005_fix_rls_recursion.sql
```

### Option 3: Manual SQL Execution

Connect to your database using any PostgreSQL client and execute the SQL file directly.

## What This Migration Does

The migration fixes an RLS (Row-Level Security) infinite recursion issue by:

1. **Creating SECURITY DEFINER helper functions** that bypass RLS:
   - `get_my_profile_id()` - Returns the current user's profile ID
   - `get_my_role()` - Returns the current user's role

2. **Replacing problematic RLS policies** with ones that use these helper functions instead of direct table joins

3. **Preventing infinite recursion** that occurred when:
   - Policies on `trainer_client_relationships` queried `profiles`
   - Policies on `profiles` queried `trainer_client_relationships`
   - This created a circular dependency

## Verifying the Fix

After applying the migration, test by:

1. Logging in as a trainer user
2. Attempting to add a client relationship
3. The operation should succeed without RLS violations

## Troubleshooting

If you still see RLS errors after applying the migration:

1. **Check if the migration was applied successfully**:
   ```sql
   SELECT * FROM public.profiles WHERE user_id = auth.uid();
   ```

2. **Verify the helper functions exist**:
   ```sql
   SELECT public.get_my_profile_id();
   SELECT public.get_my_role();
   ```

3. **Check current policies**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'trainer_client_relationships';
   ```

4. **Ensure the user has the correct role**:
   - Only users with role='trainer' can create relationships
   - The trainer_id must match the current user's profile ID

## Additional Notes

- These migrations are designed for Supabase PostgreSQL databases
- RLS must be enabled on the `trainer_client_relationships` table
- The `profiles` table must have a `user_id` column that references `auth.users(id)`
