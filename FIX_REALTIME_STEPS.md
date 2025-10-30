# 🔧 Как исправить Realtime для чата

## ✅ Что уже сделано:

1. **Исправлен код `ChatBox.tsx`**:
   - Изменен фильтр подписки (теперь только `sender_id`)
   - Добавлена проверка `receiver_id` в callback
   - Добавлено логирование статуса подписки
   - Добавлена подписка на обновления (прочитанность)

2. **Создана миграция** для включения Realtime

---

## 📋 Что нужно сделать:

### Шаг 1: Включить Realtime в Supabase Dashboard

**Вариант A: Через интерфейс**
1. Откройте https://supabase.com
2. Выберите ваш проект
3. Перейдите в **Database** → **Replication**
4. Найдите таблицу `messages`
5. Включите переключатель **Realtime**

**Вариант B: Через SQL**
1. Откройте **SQL Editor** в Supabase Dashboard
2. Выполните миграцию:
   ```sql
   -- Скопируйте содержимое файла:
   -- supabase/migrations/20250130000010_enable_realtime_messages.sql
   ```

### Шаг 2: Проверить работу

1. Откройте приложение в двух окнах браузера
2. Войдите под двумя разными пользователями (тренер + клиент)
3. Откройте чат между ними
4. Откройте **DevTools Console** (F12)
5. Отправьте сообщение из первого окна

**Что должно появиться в консоли второго окна:**
```
[Realtime] Subscription status: SUBSCRIBED
[Realtime] ✅ Successfully subscribed to messages
[Chat] Realtime event received: { eventType: 'INSERT', new: { ... } }
[Chat] ✅ New message for us: { id: '...', message: 'Привет' }
```

### Шаг 3: Если не работает

**Проверьте:**

1. **RLS политики** - должны разрешать SELECT:
   ```sql
   -- Проверить политики
   SELECT * FROM pg_policies WHERE tablename = 'messages';
   ```

2. **Realtime включен**:
   ```sql
   -- Проверить публикацию
   SELECT * FROM pg_publication_tables 
   WHERE pubname = 'supabase_realtime' 
   AND tablename = 'messages';
   ```
   Должна вернуть строку!

3. **Подключение к Supabase**:
   - Проверьте `NEXT_PUBLIC_SUPABASE_URL` в консоли
   - Проверьте `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Аутентификация**:
   ```typescript
   const { data: { user } } = await supabase.auth.getUser()
   console.log('Current user:', user)
   ```

---

## 🐛 Типичные ошибки

### Ошибка: "CHANNEL_ERROR"
**Причина:** Realtime не включен для таблицы
**Решение:** Выполните Шаг 1

### Ошибка: "TIMED_OUT"
**Причина:** Проблемы с сетью или CORS
**Решение:** Проверьте консоль браузера на ошибки CORS

### Сообщения не приходят
**Причина 1:** RLS политики блокируют SELECT
**Решение:** Проверьте политики (см. выше)

**Причина 2:** Неправильный фильтр
**Решение:** Уже исправлено в новом коде

**Причина 3:** Пользователь не аутентифицирован
**Решение:** Проверьте, что `auth.uid()` не NULL

---

## 🎯 Альтернатива: Broadcast API

Если Realtime с postgres_changes не работает, можно использовать Broadcast:

```typescript
// Отправка
await supabase.from('messages').insert(message)
await supabase.channel('chat').send({
  type: 'broadcast',
  event: 'new_message',
  payload: message
})

// Получение
supabase
  .channel('chat')
  .on('broadcast', { event: 'new_message' }, ({ payload }) => {
    setMessages(prev => [...prev, payload])
  })
  .subscribe()
```

Broadcast не требует включения Realtime для таблицы, но требует ручной отправки событий.

---

## 📊 Проверка в Production

После развертывания:

```bash
# Проверить WebSocket соединение
curl -I https://your-project.supabase.co/realtime/v1/
```

Должен вернуть статус `101 Switching Protocols`

---

**Вопросы?** Откройте консоль браузера и проверьте логи!

