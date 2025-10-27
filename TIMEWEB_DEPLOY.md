# Инструкция по деплою на Timeweb.cloud

## Проблема с переменными окружения

При использовании static export (`output: 'export'` в Next.js), переменные окружения встраиваются в код во время сборки. На Timeweb.cloud нет возможности установить runtime переменные окружения для статического сайта.

## Решение: Runtime конфигурация

Используется файл `/public/env-config.js` который загружается в браузере и предоставляет конфигурацию во время выполнения.

## Шаги для деплоя

### 1. Локальная сборка

```bash
npm run build
```

Это создаст папку `out/` с готовым статическим сайтом.

### 2. Подготовка env-config.js

В папке `out/` уже будет файл `env-config.js` с вашими Supabase credentials.

**Важно:** Файл `env-config.js` НЕ коммитится в git (добавлен в .gitignore). Он создается из `env-config.example.js` и содержит реальные данные.

### 3. Загрузка на Timeweb.cloud

Загрузите содержимое папки `out/` на ваш хостинг Timeweb.cloud:

```bash
# Через FTP/SFTP загрузите все файлы из out/ в корень сайта
# Или используйте rsync:
rsync -avz --delete out/ user@your-server:/path/to/hardcase.training/
```

### 4. Проверка

После загрузки откройте https://hardcase.training/ и проверьте:

1. Главная страница загружается мгновенно
2. Можно открыть /login
3. Регистрация и вход работают
4. В консоли браузера нет ошибок "Missing Supabase environment variables"

## Как работает

1. В `app/layout.tsx` добавлен `<script src="/env-config.js" />`
2. Этот скрипт загружается первым и устанавливает `window.__ENV__`
3. `lib/supabase.ts` читает конфигурацию из `window.__ENV__` или `process.env`
4. Приоритет: `window.__ENV__` → `process.env` → placeholder

## Безопасность

- **NEXT_PUBLIC_SUPABASE_ANON_KEY** - это публичный ключ, безопасно хранить в браузере
- Безопасность обеспечивается Row Level Security (RLS) в Supabase
- Никогда не используйте service_role_key в клиентском коде!

## Обновление credentials

Если нужно изменить Supabase credentials:

1. Отредактируйте `public/env-config.js`
2. Пересоберите проект: `npm run build`
3. Загрузите новый `out/` на сервер

## Альтернативный способ (без пересборки)

Можно обновить только файл на сервере:

1. Подключитесь к серверу через SSH/FTP
2. Отредактируйте файл `/env-config.js` напрямую на сервере
3. Перезагрузите страницу в браузере

Это полезно если нужно быстро сменить credentials без пересборки всего проекта.

## Файлы

- `/public/env-config.example.js` - шаблон (в git)
- `/public/env-config.js` - реальные данные (НЕ в git)
- `lib/supabase.ts` - читает из window.__ENV__
- `app/layout.tsx` - загружает env-config.js

## Текущая конфигурация

```javascript
window.__ENV__ = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://waatdpjvzacdfnebskhf.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbG...'
}
```

Эти данные уже настроены в `public/env-config.js`.
