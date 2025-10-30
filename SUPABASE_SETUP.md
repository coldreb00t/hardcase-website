# Настройка Supabase для HARD CASE

## Шаг 1: Установка зависимостей

```bash
npm install
```

## Шаг 2: Запуск SQL миграций

Перейдите в ваш Supabase проект:
👉 https://supabase.com/dashboard/project/waatdpjvzacdfnebskhf

### 2.1 Откройте SQL Editor
1. В левом меню выберите **SQL Editor**
2. Нажмите **New query**

### 2.2 Запустите миграции по порядку

**Миграция 1: Core Tables**
- Скопируйте содержимое файла `supabase/migrations/20250101000000_create_core_tables.sql`
- Вставьте в SQL Editor
- Нажмите **Run** (или Ctrl+Enter)
- Убедитесь, что выполнилось без ошибок

**Миграция 2: Workout & Activity Tables**
- Скопируйте `supabase/migrations/20250101000001_create_workout_activity_tables.sql`
- Вставьте и запустите

**Миграция 3: Nutrition & Progress Tables**
- Скопируйте `supabase/migrations/20250101000002_create_nutrition_progress_tables.sql`
- Вставьте и запустите

**Миграция 4: Messaging & Appointments Tables**
- Скопируйте `supabase/migrations/20250101000003_create_messaging_appointments_tables.sql`
- Вставьте и запустите

**Миграция 5: RLS Policies (ВАЖНО!)**
- Скопируйте `supabase/migrations/20250101000004_enable_rls_policies.sql`
- Вставьте и запустите

## Шаг 3: Настройка Storage Buckets

Перейдите в **Storage** → **Create a new bucket**

Создайте следующие buckets (все **Private**):

### 3.1 profile-photos
- Name: `profile-photos`
- Public: **NO** ❌
- Allowed MIME types: `image/*`

### 3.2 progress-photos
- Name: `progress-photos`
- Public: **NO** ❌
- Allowed MIME types: `image/*`

### 3.3 nutrition-photos
- Name: `nutrition-photos`
- Public: **NO** ❌
- Allowed MIME types: `image/*`

### 3.4 workout-videos
- Name: `workout-videos`
- Public: **NO** ❌
- Allowed MIME types: `video/*`

### 3.5 report-attachments
- Name: `report-attachments`
- Public: **NO** ❌
- Allowed MIME types: `application/pdf,image/*`

## Шаг 4: Настройка RLS для Storage

Для каждого bucket, в разделе **Policies**, создайте политики:

### Политика: Users can upload to own folder

```sql
-- В SQL Editor выполните для каждого bucket:

-- profile-photos
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'profile-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Повторите для остальных buckets, меняя bucket_id:
-- 'progress-photos', 'nutrition-photos', 'workout-videos', 'report-attachments'
```

## Шаг 5: Проверка установки

### 5.1 Проверьте таблицы
В **Table Editor** должны появиться все таблицы:
- profiles
- trainer_client_relationships
- client_measurements
- workout_programs
- workout_sessions
- activity_logs
- nutrition_targets
- nutrition_logs
- progress_photos
- monthly_reports
- conversations
- messages
- appointments
- notifications
- device_tokens
- health_sync_data

### 5.2 Проверьте RLS
В **Authentication** → **Policies** должны быть видны все политики безопасности.

### 5.3 Проверьте Storage
В **Storage** должны быть все 5 buckets с политиками.

## Шаг 6: Создание тестовых пользователей (опционально)

В **SQL Editor** выполните:

```sql
-- Создать тестового клиента
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'client@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  ''
)
RETURNING id;

-- Скопируйте ID и создайте профиль:
INSERT INTO profiles (user_id, full_name, role)
VALUES (
  'ВСТАВЬТЕ_ID_СЮДА',
  'Тестовый Клиент',
  'client'
);

-- Повторите для тренера с email 'trainer@test.com' и role = 'trainer'
```

## Шаг 7: Запуск приложения

```bash
npm run dev
```

Откройте http://localhost:3000

## Проверка работоспособности

### Тест подключения к Supabase

Создайте файл `test-supabase.js` в корне проекта:

```javascript
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://waatdpjvzacdfnebskhf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhYXRkcGp2emFjZGZuZWJza2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NDQ0NzEsImV4cCI6MjA3NzAyMDQ3MX0.-h6DXM8Ck6O7AksK-kcnwm7OXEro6dlobv0DVFx9ndw'
)

async function test() {
  console.log('Testing Supabase connection...')

  const { data, error } = await supabase
    .from('profiles')
    .select('count')

  if (error) {
    console.error('❌ Error:', error.message)
  } else {
    console.log('✅ Connected successfully!')
    console.log('Profiles count:', data)
  }
}

test()
```

Запустите:
```bash
node test-supabase.js
```

Должно вывести: `✅ Connected successfully!`

## Готово! 🎉

Теперь у вас:
- ✅ База данных настроена
- ✅ RLS политики активны
- ✅ Storage buckets созданы
- ✅ Приложение подключено к Supabase

## Следующие шаги:

1. Создать страницу входа `/login`
2. Создать dashboard для клиентов `/dashboard`
3. Создать админ-панель для тренеров `/admin`

---

**Нужна помощь?** Смотрите `supabase/README.md` для подробной документации.
