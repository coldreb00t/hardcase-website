-- ============================================================================
-- Диагностика Realtime для таблицы messages
-- ============================================================================
-- Выполните этот SQL в Supabase Dashboard → SQL Editor
-- Он покажет все проблемы с конфигурацией
-- ============================================================================

-- 1. Проверка: Включен ли Realtime для таблицы messages
SELECT 
  '1. Realtime Publication' as check_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND tablename = 'messages'
    ) THEN '✅ ENABLED'
    ELSE '❌ NOT ENABLED'
  END as status;

-- 2. Проверка: Есть ли RLS политики для SELECT на messages
SELECT 
  '2. RLS SELECT Policies' as check_name,
  COUNT(*) as policy_count,
  string_agg(policyname, ', ') as policies
FROM pg_policies 
WHERE tablename = 'messages' 
AND cmd = 'SELECT';

-- 3. Проверка: Включен ли RLS на таблице
SELECT 
  '3. RLS Status' as check_name,
  CASE 
    WHEN relrowsecurity THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as status
FROM pg_class 
WHERE relname = 'messages';

-- 4. Список всех политик для таблицы messages
SELECT 
  '4. All Policies' as section,
  policyname as policy_name,
  cmd as command,
  CASE 
    WHEN permissive THEN 'PERMISSIVE'
    ELSE 'RESTRICTIVE'
  END as type,
  roles::text as roles,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'messages'
ORDER BY cmd;

-- 5. Проверка: Какие таблицы есть в публикации supabase_realtime
SELECT 
  '5. Tables in Realtime' as section,
  schemaname as schema,
  tablename as table
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- 6. Проверка структуры таблицы messages
SELECT 
  '6. Table Structure' as section,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'messages'
ORDER BY ordinal_position;

-- 7. Проверка: Есть ли данные в таблице
SELECT 
  '7. Data Check' as section,
  COUNT(*) as total_messages,
  COUNT(*) FILTER (WHERE is_read = false) as unread_messages,
  MAX(created_at) as last_message_at
FROM messages;

-- 8. Проверка функций для RLS
SELECT 
  '8. Helper Functions' as section,
  proname as function_name,
  prosrc as function_body
FROM pg_proc 
WHERE proname IN ('get_my_profile_id', 'get_my_role')
ORDER BY proname;

-- ============================================================================
-- Результат
-- ============================================================================
-- Если увидите:
-- ✅ в строках 1 и 3 - Realtime и RLS включены правильно
-- Несколько политик в строке 2 - RLS политики существуют
-- Таблица messages в строке 5 - Публикация настроена
--
-- Если что-то ❌ - это и есть проблема!
-- ============================================================================

