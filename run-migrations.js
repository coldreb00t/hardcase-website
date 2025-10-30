#!/usr/bin/env node

/**
 * Supabase Migration Runner
 * Executes all SQL migrations using Service Role Key
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://waatdpjvzacdfnebskhf.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhYXRkcGp2emFjZGZuZWJza2hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQ0NDQ3MSwiZXhwIjoyMDc3MDIwNDcxfQ.60jduOxwXJ2OFsaQ07WR5H6fx2mKu6A7YhlIkp_0Qdo';

async function executeSql(sql, description) {
  console.log(`\n📝 ${description}...`);

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sql })
    });

    // Если функция exec_sql не существует, попробуем альтернативный способ
    if (response.status === 404) {
      console.log('   Trying alternative method...');

      // Используем прямой PostgreSQL query через PostgREST
      const lines = sql.split(';').filter(line => line.trim());

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('--')) continue;

        console.log(`   Executing statement ${i + 1}/${lines.length}...`);

        // PostgREST не поддерживает прямое выполнение DDL
        // Нужно использовать другой подход
      }

      throw new Error('Cannot execute SQL directly. Please run migrations manually in Supabase SQL Editor.');
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const result = await response.json();
    console.log('   ✅ Success!');
    return result;

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    throw error;
  }
}

async function runMigrations() {
  console.log('🚀 Starting Supabase migrations...\n');
  console.log(`📍 Target: ${SUPABASE_URL}`);

  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');

  const migrations = [
    '20250101000000_create_core_tables.sql',
    '20250101000001_create_workout_activity_tables.sql',
    '20250101000002_create_nutrition_progress_tables.sql',
    '20250101000003_create_messaging_appointments_tables.sql',
    '20250101000004_enable_rls_policies.sql',
  ];

  for (const migration of migrations) {
    const filePath = path.join(migrationsDir, migration);
    const sql = fs.readFileSync(filePath, 'utf8');

    try {
      await executeSql(sql, `Migration: ${migration}`);
    } catch (error) {
      console.error(`\n❌ Migration failed: ${migration}`);
      console.error('Please run this migration manually in Supabase SQL Editor:');
      console.error(`👉 https://supabase.com/dashboard/project/waatdpjvzacdfnebskhf/sql/new\n`);
      process.exit(1);
    }
  }

  console.log('\n✅ All migrations completed successfully!\n');
}

// Check if we can use PostgREST for SQL execution
async function checkSupabaseConnection() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      }
    });

    if (response.ok) {
      console.log('✅ Connected to Supabase\n');
      return true;
    }
  } catch (error) {
    console.error('❌ Cannot connect to Supabase:', error.message);
    return false;
  }
}

// Main
(async () => {
  const connected = await checkSupabaseConnection();

  if (!connected) {
    console.error('\n⚠️  Cannot proceed with automatic migrations.');
    console.error('Please run migrations manually in Supabase SQL Editor:');
    console.error('👉 https://supabase.com/dashboard/project/waatdpjvzacdfnebskhf/sql/new\n');
    process.exit(1);
  }

  console.log('⚠️  Note: PostgREST API does not support direct DDL execution.');
  console.log('You need to run migrations manually in Supabase SQL Editor.\n');
  console.log('📋 Migration files location: supabase/migrations/\n');
  console.log('Steps:');
  console.log('1. Open: https://supabase.com/dashboard/project/waatdpjvzacdfnebskhf/sql/new');
  console.log('2. Copy content from each migration file');
  console.log('3. Run in order:');
  migrations.forEach((m, i) => console.log(`   ${i + 1}. ${m}`));
  console.log('\nOr follow the guide in SUPABASE_SETUP.md');
})();
