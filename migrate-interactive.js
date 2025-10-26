#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

const migrations = [
  { file: '20250101000000_create_core_tables.sql', name: '1/5: Core Tables' },
  { file: '20250101000001_create_workout_activity_tables.sql', name: '2/5: Workout & Activity' },
  { file: '20250101000002_create_nutrition_progress_tables.sql', name: '3/5: Nutrition & Progress' },
  { file: '20250101000003_create_messaging_appointments_tables.sql', name: '4/5: Messaging & Appointments' },
  { file: '20250101000004_enable_rls_policies.sql', name: '5/5: RLS Policies' },
];

async function main() {
  console.clear();
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║         SUPABASE INTERACTIVE MIGRATION HELPER             ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log('📋 This will help you run migrations step by step\n');
  console.log('🔗 Open in browser:');
  console.log('👉 https://supabase.com/dashboard/project/waatdpjvzacdfnebskhf/sql/new\n');

  await question('Press ENTER when SQL Editor is open...');

  for (const migration of migrations) {
    console.clear();
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  Migration: ${migration.name}`);
    console.log(`${'='.repeat(60)}\n`);

    const filePath = path.join(__dirname, 'supabase', 'migrations', migration.file);
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log('📄 SQL Content below (copy from --- START --- to --- END ---):\n');
    console.log('--- START ---');
    console.log(sql);
    console.log('--- END ---\n');

    console.log('📋 Steps:');
    console.log('1. SELECT ALL text above (between START and END)');
    console.log('2. COPY (Ctrl+C or Cmd+C)');
    console.log('3. PASTE in Supabase SQL Editor');
    console.log('4. Click RUN (or press Ctrl+Enter)');
    console.log('5. Wait for "Success ✓"\n');

    const answer = await question('Type "done" when finished, or "skip" to skip: ');

    if (answer.toLowerCase() === 'skip') {
      console.log('⏭️  Skipping...\n');
      continue;
    }

    console.log('✅ Great! Moving to next migration...\n');
  }

  console.clear();
  console.log('\n🎉 All migrations completed!\n');
  console.log('Next steps:');
  console.log('1. Check tables in Supabase Table Editor');
  console.log('2. Run: npm run dev');
  console.log('3. Open: http://localhost:3000\n');

  rl.close();
}

main();
