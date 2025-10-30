# ⚡ Быстрая настройка Supabase (5 минут)

## 📋 Шаг 1: Откройте SQL Editor

Откройте эту ссылку в браузере:
👉 **https://supabase.com/dashboard/project/waatdpjvzacdfnebskhf/sql/new**

## 🔄 Шаг 2: Запустите миграции (по очереди)

### ✅ Миграция 1 из 5: Core Tables

<details>
<summary>📄 Кликните чтобы развернуть SQL</summary>

```sql
-- Скопируйте ВСЁ содержимое файла:
-- supabase/migrations/20250101000000_create_core_tables.sql

-- Вставьте в SQL Editor
-- Нажмите RUN (или Ctrl+Enter)
```

</details>

1. Откройте файл: `supabase/migrations/20250101000000_create_core_tables.sql`
2. Скопируйте **всё содержимое** (Ctrl+A → Ctrl+C)
3. Вставьте в Supabase SQL Editor
4. Нажмите **Run** (или Ctrl+Enter)
5. Дождитесь сообщения "Success ✓"

---

### ✅ Миграция 2 из 5: Workout & Activity

1. Откройте файл: `supabase/migrations/20250101000001_create_workout_activity_tables.sql`
2. Скопируйте всё (Ctrl+A → Ctrl+C)
3. Вставьте в SQL Editor
4. Нажмите **Run**
5. Дождитесь "Success ✓"

---

### ✅ Миграция 3 из 5: Nutrition & Progress

1. Откройте файл: `supabase/migrations/20250101000002_create_nutrition_progress_tables.sql`
2. Скопируйте всё
3. Вставьте в SQL Editor
4. Нажмите **Run**
5. Дождитесь "Success ✓"

---

### ✅ Миграция 4 из 5: Messaging & Appointments

1. Откройте файл: `supabase/migrations/20250101000003_create_messaging_appointments_tables.sql`
2. Скопируйте всё
3. Вставьте в SQL Editor
4. Нажмите **Run**
5. Дождитесь "Success ✓"

---

### ✅ Миграция 5 из 5: RLS Policies

1. Откройте файл: `supabase/migrations/20250101000004_enable_rls_policies.sql`
2. Скопируйте всё
3. Вставьте в SQL Editor
4. Нажмите **Run**
5. Дождитесь "Success ✓"

---

## 🎉 Готово! Проверка

После выполнения всех миграций:

1. Перейдите в **Table Editor**: https://supabase.com/dashboard/project/waatdpjvzacdfnebskhf/editor
2. Вы должны увидеть все таблицы:
   - ✅ profiles
   - ✅ trainer_client_relationships
   - ✅ client_measurements
   - ✅ workout_programs
   - ✅ workout_sessions
   - ✅ activity_logs
   - ✅ nutrition_targets
   - ✅ nutrition_logs
   - ✅ progress_photos
   - ✅ monthly_reports
   - ✅ conversations
   - ✅ messages
   - ✅ appointments
   - ✅ notifications
   - ✅ device_tokens
   - ✅ health_sync_data

---

## 📦 Дополнительно: Storage Buckets (опционально, пока не обязательно)

Когда понадобится загрузка фото, создайте buckets:

1. Перейдите в **Storage**: https://supabase.com/dashboard/project/waatdpjvzacdfnebskhf/storage/buckets
2. Нажмите **New bucket**
3. Создайте (все **Private**):
   - `profile-photos`
   - `progress-photos`
   - `nutrition-photos`
   - `workout-videos`
   - `report-attachments`

---

## 🚀 Запуск приложения

```bash
npm run dev
```

Откройте: http://localhost:3000

---

## ❓ Проблемы?

**Ошибка "already exists":**
- Норма! Значит таблица уже создана, просто продолжайте

**Ошибка синтаксиса:**
- Убедитесь что скопировали **ВСЁ** содержимое файла
- Проверьте что не пропустили какие-то строки

**Другие ошибки:**
- Напишите мне текст ошибки - помогу разобраться

---

**Время выполнения:** ~3-5 минут
**Сложность:** Легко (просто копипаста 5 раз)
