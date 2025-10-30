# ⚠️ Ошибка 406 при использовании .single() в Supabase

## Проблема

При запросе данных из Supabase с `.single()` возникает ошибка **406 (Not Acceptable)**, если данных нет в таблице.

```typescript
// ❌ НЕПРАВИЛЬНО - вызывает 406 если данных нет
const { data: measurement } = await supabase
  .from('client_measurements')
  .select('*')
  .eq('client_id', profileId)
  .limit(1)
  .single() // 💥 Ошибка 406 если строк 0!
```

## Почему происходит?

**`.single()`** в Supabase ожидает **ровно одну** строку:
- ✅ Если найдена **1 строка** → возвращает объект
- ❌ Если найдено **0 строк** → ошибка **406 (Not Acceptable)**
- ❌ Если найдено **2+ строки** → ошибка **406 (Not Acceptable)**

Это поведение по дизайну: `.single()` гарантирует, что результат либо один, либо ошибка.

## Решение

### Вариант 1: Убрать .single() и взять первый элемент

```typescript
// ✅ ПРАВИЛЬНО - безопасно для пустых результатов
const { data: measurements } = await supabase
  .from('client_measurements')
  .select('*')
  .eq('client_id', profileId)
  .order('measured_at', { ascending: false })
  .limit(1)

if (measurements && measurements.length > 0) {
  const measurement = measurements[0]
  // Используйте measurement
}
```

### Вариант 2: Использовать .maybeSingle()

```typescript
// ✅ ПРАВИЛЬНО - возвращает null если данных нет
const { data: measurement, error } = await supabase
  .from('client_measurements')
  .select('*')
  .eq('client_id', profileId)
  .order('measured_at', { ascending: false })
  .limit(1)
  .maybeSingle() // Не вызывает ошибку если данных нет!

if (measurement) {
  // Используйте measurement
}
```

### Вариант 3: Обработать ошибку

```typescript
// ✅ ПРАВИЛЬНО - явная обработка ошибки
const { data: measurement, error } = await supabase
  .from('client_measurements')
  .select('*')
  .eq('client_id', profileId)
  .limit(1)
  .single()

if (error) {
  if (error.code === 'PGRST116') {
    // Нет данных - это нормально
    console.log('No measurements yet')
  } else {
    // Другая ошибка
    console.error('Error fetching measurement:', error)
  }
} else if (measurement) {
  // Используйте measurement
}
```

## Когда использовать .single()

Используйте `.single()` только когда **гарантированно** есть ровно одна строка:

```typescript
// ✅ Правильное использование - profile всегда существует для залогиненного юзера
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', auth.uid())
  .single()

// ✅ Правильное использование - уникальное ограничение в БД
const { data: user } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
  .single()
```

## Когда НЕ использовать .single()

❌ Не используйте, если данных может не быть:
- Последнее измерение клиента (может не быть)
- Активная программа тренировок (может не быть)
- Цели по питанию (может не быть)
- Последнее сообщение (может не быть)

## Исправленные места в коде

В файле `app/dashboard/client/page.tsx` были исправлены:

1. **Загрузка nutrition target** (строка 124-134):
   - Было: `.single()` → **406 если нет цели**
   - Стало: массив + проверка `length > 0`

2. **Загрузка latest measurement** (строка 136-145):
   - Было: `.single()` → **406 если нет измерений**
   - Стало: массив + проверка `length > 0`

## Коды ошибок Supabase

- **PGRST116** - Нет строк (при использовании `.single()`)
- **PGRST118** - Более одной строки (при использовании `.single()`)
- **42501** - RLS policy violation (нет доступа)

## Дополнительно

### HTTP статусы от Supabase:
- **200** - Успех
- **201** - Создано
- **406** - Not Acceptable (неправильное использование `.single()`)
- **401** - Unauthorized (не аутентифицирован)
- **403** - Forbidden (RLS блокирует)

### Полезные ссылки:
- [Supabase Docs - Fetching Data](https://supabase.com/docs/reference/javascript/select)
- [PostgREST Errors](https://postgrest.org/en/stable/errors.html)

---

**Резюме:** Используйте `.maybeSingle()` вместо `.single()` когда данных может не быть!

