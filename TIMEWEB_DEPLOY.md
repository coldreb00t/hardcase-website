# Инструкция по деплою на Timeweb.cloud

## Безопасность Supabase credentials

### ✅ Что безопасно:
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** - это публичный ключ, предназначен для клиента
- Безопасность обеспечивается Row Level Security (RLS) в Supabase
- Credentials всегда видны в браузере (в любом решении)

### ⚠️ Best Practice:
**НЕ коммитить credentials в git!** Используйте переменные окружения.

## Решение: Inline runtime configuration

Credentials встраиваются в HTML при сборке через `process.env` с fallback значениями.

## Шаги для деплоя

### Вариант А: Локальная сборка (текущий способ)

1. Убедитесь что `.env.local` содержит ваши credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://waatdpjvzacdfnebskhf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

2. Соберите проект:
```bash
npm run build
```

3. Credentials встроятся в HTML из `.env.local` или fallback значений

### Вариант Б: CI/CD сборка (рекомендуется)

**Настройте переменные окружения в Timeweb.cloud CI/CD:**

1. В панели Timeweb.cloud откройте настройки CI/CD
2. Добавьте переменные окружения:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. При сборке они встроятся в HTML автоматически
4. ✅ Credentials НЕ в git репозитории!

### Загрузка на Timeweb.cloud

Загрузите содержимое папки `out/` на ваш хостинг:

```bash
# Через FTP/SFTP загрузите все файлы из out/ в корень сайта
# Или используйте rsync:
rsync -avz --delete out/ user@your-server:/path/to/hardcase.training/
```

### Проверка после деплоя

Откройте https://hardcase.training/ и проверьте:

1. ✅ Главная страница загружается мгновенно
2. ✅ Можно открыть /login
3. ✅ Регистрация и вход работают
4. ✅ В консоли нет ошибок "Missing Supabase configuration"

## Как это работает

1. **Build time**: `process.env.NEXT_PUBLIC_SUPABASE_*` читаются из `.env.local` или CI/CD
2. **app/layout.tsx**: Credentials встраиваются в HTML через inline `<script>`
3. **Browser**: Скрипт выполняется ДО загрузки React, устанавливает `window.__ENV__`
4. **lib/supabase.ts**: Читает из `window.__ENV__` при создании клиента

```tsx
// app/layout.tsx
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'fallback'
const envConfigScript = `window.__ENV__ = { ... }`
<script dangerouslySetInnerHTML={{ __html: envConfigScript }} />
```

```tsx
// lib/supabase.ts
const windowEnv = (window as any).__ENV__
supabaseUrl = windowEnv?.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
```

## Безопасность

### ✅ Публичный ключ безопасен
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** предназначен для клиента
- Row Level Security (RLS) защищает данные
- Видимость в браузере - это нормально

### ⚠️ Best practices
- Используйте CI/CD переменные окружения
- НЕ коммитьте `.env.local` в git (уже в .gitignore)
- Fallback значения в коде - только для разработки
- ❌ НИКОГДА не используйте `service_role_key` в клиенте!

## Обновление credentials

### Способ 1: Через CI/CD (рекомендуется)
1. Обновите переменные в панели Timeweb.cloud
2. Запустите новую сборку
3. ✅ Готово!

### Способ 2: Локально
1. Обновите `.env.local`
2. Запустите `npm run build`
3. Загрузите новый `out/` на сервер

### Способ 3: Обновить fallback в коде
1. Отредактируйте `app/layout.tsx` (строки 59-60)
2. Закоммитьте и задеплойте
3. ⚠️ Credentials будут в git!
