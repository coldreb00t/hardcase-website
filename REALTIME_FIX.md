# Исправление Realtime для чата

## Проблема
Realtime подписка на таблицу `messages` не срабатывает.

## Решения

### 1. Включить Realtime в Supabase Dashboard

1. Откройте **Supabase Dashboard**
2. Перейдите в **Database** → **Replication**
3. Найдите таблицу `messages`
4. Включите **Realtime** переключателем

Или выполните SQL:

```sql
-- Включить Realtime для таблицы messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

### 2. Проверить RLS политики для Realtime

Realtime требует, чтобы у пользователя были права SELECT на таблицу.

Проверьте политики:

```sql
-- Проверить существующие политики
SELECT * FROM pg_policies WHERE tablename = 'messages';
```

### 3. Исправить фильтр подписки в ChatBox

**Текущий код (строка 50):**
```typescript
filter: `sender_id=eq.${otherUserId},receiver_id=eq.${currentUserId}`
```

**Проблема:** Этот фильтр использует запятую, что означает И (AND).
Фильтр срабатывает только если `sender_id = otherUserId` **И** `receiver_id = currentUserId` одновременно.

**Правильный вариант - две отдельные подписки:**

```typescript
// Подписка 1: Входящие сообщения от собеседника
const incomingChannel = supabase
  .channel('messages-incoming')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `sender_id=eq.${otherUserId}`
    },
    (payload) => {
      const newMessage = payload.new as Message
      // Проверяем, что сообщение действительно нам
      if (newMessage.receiver_id === currentUserId) {
        setMessages((prev) => [...prev, newMessage])
        markMessagesAsRead()
      }
    }
  )
  .subscribe()

// Подписка 2: Обновления прочитанности для наших сообщений
const updatesChannel = supabase
  .channel('messages-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'messages',
      filter: `sender_id=eq.${currentUserId}`
    },
    (payload) => {
      const updated = payload.new as Message
      if (updated.receiver_id === otherUserId) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === updated.id ? updated : msg))
        )
      }
    }
  )
  .subscribe()
```

### 4. Проверить статус подписки

Добавьте логирование:

```typescript
const channel = supabase
  .channel('messages')
  .on(...)
  .subscribe((status) => {
    console.log('[Realtime] Subscription status:', status)
    if (status === 'SUBSCRIBED') {
      console.log('[Realtime] ✅ Successfully subscribed')
    } else if (status === 'CHANNEL_ERROR') {
      console.error('[Realtime] ❌ Channel error')
    } else if (status === 'TIMED_OUT') {
      console.error('[Realtime] ❌ Connection timed out')
    }
  })
```

### 5. Альтернатива: Broadcast вместо Postgres Changes

Если Realtime для таблицы не работает, можно использовать Broadcast:

```typescript
// При отправке сообщения
await supabase.from('messages').insert(message)

// Затем отправить broadcast
await supabase.channel('chat').send({
  type: 'broadcast',
  event: 'new_message',
  payload: message
})

// При получении
supabase
  .channel('chat')
  .on('broadcast', { event: 'new_message' }, (payload) => {
    if (payload.payload.receiver_id === currentUserId) {
      setMessages((prev) => [...prev, payload.payload])
    }
  })
  .subscribe()
```

## Рекомендуемые изменения в ChatBox.tsx

1. Включить Realtime в Supabase Dashboard
2. Добавить логирование статуса подписки
3. Изменить фильтр на более простой (только sender_id)
4. Добавить проверку receiver_id в callback

## Проверка работы

1. Откройте два окна браузера (или инкогнито)
2. Войдите под разными пользователями
3. Откройте чат между ними
4. Откройте DevTools Console
5. Отправьте сообщение
6. Проверьте логи в консоли

Должно появиться:
```
[Realtime] Subscription status: SUBSCRIBED
[Realtime] ✅ Successfully subscribed
[Chat] New message received: { ... }
```

