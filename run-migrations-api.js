#!/usr/bin/env node

/**
 * Supabase Migration Runner - Management API
 * Executes SQL migrations using Supabase Management API
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://waatdpjvzacdfnebskhf.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhYXRkcGp2emFjZGZuZWJza2hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQ0NDQ3MSwiZXhwIjoyMDc3MDIwNDcxfQ.60jduOxwXJ2OFsaQ07WR5H6fx2mKu6A7YhlIkp_0Qdo';

async function executeSql(sql, description) {
  console.log(`\n📝 ${description}...`);

  try {
    // Use Supabase client to execute raw SQL via RPC
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Execute SQL via Supabase pg_execute
    // This won't work directly, but let's try rpc approach
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: sql })
    });

    if (response.status === 404) {
      console.log('   ⚠️  Direct SQL execution not available via API');
      return false;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`   ❌ HTTP ${response.status}: ${errorText}`);
      return false;
    }

    console.log('   ✅ Success!');
    return true;

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function createManualInstructions() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚠️  Automatic migration not available');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('Please run migrations manually via Supabase SQL Editor:\n');
  console.log('👉 https://supabase.com/dashboard/project/waatdpjvzacdfnebskhf/sql/new\n');

  console.log('Run these files in order:\n');

  const migrations = [
    '20250101000000_create_core_tables.sql',
    '20250101000001_create_workout_activity_tables.sql',
    '20250101000002_create_nutrition_progress_tables.sql',
    '20250101000003_create_messaging_appointments_tables.sql',
    '20250101000004_enable_rls_policies.sql',
  ];

  migrations.forEach((file, i) => {
    const filePath = path.join(__dirname, 'supabase', 'migrations', file);
    console.log(`${i + 1}. Copy from: supabase/migrations/${file}`);
  });

  console.log('\n📋 Steps for each file:');
  console.log('   1. Open the file in your editor');
  console.log('   2. Copy all content (Ctrl+A, Ctrl+C)');
  console.log('   3. Paste in Supabase SQL Editor');
  console.log('   4. Click "Run" (or press Ctrl+Enter)');
  console.log('   5. Wait for "Success" message');
  console.log('   6. Repeat for next file\n');

  console.log('💡 Or use the interactive guide:');
  console.log('   cat SUPABASE_SETUP.md\n');
}

// Main
(async () => {
  console.log('🚀 Attempting to run migrations...\n');

  // Try to execute one simple query to test
  const testResult = await executeSql('SELECT 1 as test', 'Testing connection');

  if (!testResult) {
    await createManualInstructions();
    process.exit(0);
  }

  console.log('\n✅ Connection successful! Running migrations...\n');

  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
  const migrations = [
    '20250101000000_create_core_tables.sql',
    '20250101000001_create_workout_activity_tables.sql',
    '20250101000002_create_nutrition_progress_tables.sql',
    '20250101000003_create_messaging_appointments_tables.sql',
    '20250101000004_enable_rls_policies.sql',
  ];

  let allSuccess = true;

  for (let i = 0; i < migrations.length; i++) {
    const migration = migrations[i];
    const filePath = path.join(migrationsDir, migration);
    const sql = fs.readFileSync(filePath, 'utf8');

    const success = await executeSql(sql, `[${i + 1}/${migrations.length}] ${migration}`);

    if (!success) {
      allSuccess = false;
      break;
    }
  }

  if (allSuccess) {
    console.log('\n✅ All migrations completed!\n');
  } else {
    await createManualInstructions();
  }
})();
