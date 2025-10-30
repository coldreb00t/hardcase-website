#!/usr/bin/env node

/**
 * Supabase Migration Runner - PostgreSQL Direct Connection
 * Executes all SQL migrations
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Supabase connection details
const DB_HOST = 'db.waatdpjvzacdfnebskhf.supabase.co';
const DB_PORT = 5432;
const DB_NAME = 'postgres';
const DB_USER = 'postgres';
const DB_PASSWORD = 'Trunk212=';

async function runMigrations() {
  console.log('🚀 Starting Supabase migrations via PostgreSQL...\n');
  console.log(`📍 Connecting to: ${DB_HOST}:${DB_PORT}`);

  const client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Connect to database
    console.log('\n🔌 Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    const migrationsDir = path.join(__dirname, 'supabase', 'migrations');

    const migrations = [
      '20250101000000_create_core_tables.sql',
      '20250101000001_create_workout_activity_tables.sql',
      '20250101000002_create_nutrition_progress_tables.sql',
      '20250101000003_create_messaging_appointments_tables.sql',
      '20250101000004_enable_rls_policies.sql',
    ];

    for (let i = 0; i < migrations.length; i++) {
      const migration = migrations[i];
      const filePath = path.join(migrationsDir, migration);

      console.log(`\n📝 [${i + 1}/${migrations.length}] Running: ${migration}`);

      const sql = fs.readFileSync(filePath, 'utf8');

      try {
        await client.query(sql);
        console.log(`   ✅ Success!`);
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);

        // Check if it's just a "already exists" error (which is OK for re-runs)
        if (error.message.includes('already exists')) {
          console.log('   ⚠️  Object already exists (skipping)');
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ All migrations completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Disconnected from PostgreSQL\n');
  }
}

// Main
(async () => {
  try {
    await runMigrations();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Database setup complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nNext steps:');
    console.log('1. Create Storage buckets (see SUPABASE_SETUP.md)');
    console.log('2. Run: npm run dev');
    console.log('3. Open: http://localhost:3000\n');

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
})();
