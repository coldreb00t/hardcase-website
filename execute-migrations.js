#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://waatdpjvzacdfnebskhf.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhYXRkcGp2emFjZGZuZWJza2hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQ0NDQ3MSwiZXhwIjoyMDc3MDIwNDcxfQ.60jduOxwXJ2OFsaQ07WR5H6fx2mKu6A7YhlIkp_0Qdo';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSqlDirect(sql) {
  // Try to execute SQL using fetch directly to PostgreSQL REST endpoint
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ sql })
  });

  return response;
}

async function createExecFunction() {
  console.log('🔧 Creating helper function for SQL execution...\n');

  const createFunctionSql = `
CREATE OR REPLACE FUNCTION exec(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;
`;

  try {
    const { data, error } = await supabase.rpc('exec', { sql: createFunctionSql });

    if (error) {
      console.log('Function might not exist yet, trying alternative...\n');
      return false;
    }

    console.log('✅ Helper function created!\n');
    return true;
  } catch (e) {
    return false;
  }
}

async function executeMigration(filePath, name) {
  console.log(`📝 Executing: ${name}...`);

  const sql = fs.readFileSync(filePath, 'utf8');

  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`   Found ${statements.length} statements to execute`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';

    try {
      // Try using rpc exec function
      const { data, error } = await supabase.rpc('exec', { sql: statement });

      if (error) {
        // Check if it's just "already exists" error
        if (error.message && (
          error.message.includes('already exists') ||
          error.message.includes('duplicate')
        )) {
          console.log(`   ⚠️  Statement ${i + 1}/${statements.length}: Already exists (OK)`);
          continue;
        }

        console.error(`   ❌ Statement ${i + 1}/${statements.length} failed:`, error.message);
        throw error;
      }

      if (i % 10 === 0 && i > 0) {
        console.log(`   ✓ Progress: ${i}/${statements.length} statements`);
      }

    } catch (e) {
      console.error(`   ❌ Error at statement ${i + 1}:`, e.message);
      console.error(`   Statement: ${statement.substring(0, 100)}...`);
      throw e;
    }
  }

  console.log(`   ✅ Completed: ${statements.length} statements\n`);
}

async function main() {
  console.log('🚀 Starting Supabase migrations with Service Role Key\n');
  console.log(`📍 Target: ${SUPABASE_URL}\n`);

  // First, try to create the exec function
  const functionCreated = await createExecFunction();

  if (!functionCreated) {
    console.log('⚠️  Helper function not available.');
    console.log('This means we need to use Supabase SQL Editor manually.\n');
    console.log('Please follow instructions in QUICK_SETUP.md\n');
    process.exit(1);
  }

  const migrations = [
    { file: '20250101000000_create_core_tables.sql', name: 'Core Tables' },
    { file: '20250101000001_create_workout_activity_tables.sql', name: 'Workout & Activity' },
    { file: '20250101000002_create_nutrition_progress_tables.sql', name: 'Nutrition & Progress' },
    { file: '20250101000003_create_messaging_appointments_tables.sql', name: 'Messaging & Appointments' },
    { file: '20250101000004_enable_rls_policies.sql', name: 'RLS Policies' },
  ];

  for (const migration of migrations) {
    const filePath = path.join(__dirname, 'supabase', 'migrations', migration.file);
    await executeMigration(filePath, migration.name);
  }

  console.log('✅ All migrations completed successfully!\n');
  console.log('Next steps:');
  console.log('1. Verify tables in Supabase Table Editor');
  console.log('2. Run: npm run dev');
  console.log('3. Open: http://localhost:3000\n');
}

main().catch(error => {
  console.error('\n❌ Migration failed:', error);
  console.error('\nPlease run migrations manually using QUICK_SETUP.md\n');
  process.exit(1);
});
