# 🐛 Отладка Realtime на клиенте

## Откройте DevTools Console (F12) и выполните:

### 1. Проверить конфигурацию Supabase
```javascript
// Скопируйте и вставьте в консоль:
console.log('=== SUPABASE CONFIG ===')
console.log('URL:', window.__ENV__?.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Key exists:', !!(window.__ENV__?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY))
```

### 2. Проверить аутентификацию
```javascript
// В консоли:
const checkAuth = async () => {
  const { supabase } = await import('./lib/supabase.js')
  const { data: { user } } = await supabase.auth.getUser()
  console.log('=== AUTH CHECK ===')
  console.log('User:', user)
  console.log('User ID:', user?.id)
  console.log('Email:', user?.email)
}
checkAuth()
```

### 3. Проверить profile_id
```javascript
// В консоли:
const checkProfile = async () => {
  const { supabase } = await import('./lib/supabase.js')
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error('❌ User not authenticated!')
    return
  }
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  console.log('=== PROFILE CHECK ===')
  console.log('Profile:', profile)
  console.log('Profile ID:', profile?.id)
  console.log('Role:', profile?.role)
  
  if (error) {
    console.error('❌ Error fetching profile:', error)
  }
}
checkProfile()
```

### 4. Проверить доступ к таблице messages
```javascript
// В консоли:
const checkMessages = async () => {
  const { supabase } = await import('./lib/supabase.js')
  
  const { data, error, count } = await supabase
    .from('messages')
    .select('*', { count: 'exact' })
    .limit(5)
  
  console.log('=== MESSAGES ACCESS ===')
  console.log('Total messages:', count)
  console.log('Sample messages:', data)
  
  if (error) {
    console.error('❌ RLS Error:', error)
    console.error('This means RLS policies are blocking access!')
  } else {
    console.log('✅ Can read messages')
  }
}
checkMessages()
```

### 5. Тест Realtime подписки
```javascript
// В консоли:
const testRealtime = async () => {
  const { supabase } = await import('./lib/supabase.js')
  
  console.log('=== REALTIME TEST ===')
  console.log('Creating subscription...')
  
  const channel = supabase
    .channel('test-messages')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages'
      },
      (payload) => {
        console.log('🎉 REALTIME EVENT:', payload)
      }
    )
    .subscribe((status) => {
      console.log('Subscription status:', status)
      if (status === 'SUBSCRIBED') {
        console.log('✅ Successfully subscribed!')
        console.log('Now try sending a message from another window...')
      } else if (status === 'CHANNEL_ERROR') {
        console.error('❌ Channel error - Realtime not enabled?')
      } else if (status === 'TIMED_OUT') {
        console.error('❌ Connection timed out')
      }
    })
  
  // Сохраните канал для отписки
  window._testChannel = channel
}
testRealtime()

// Чтобы отписаться:
// window._testChannel.unsubscribe()
```

### 6. Отправить тестовое сообщение
```javascript
// В консоли (после testRealtime):
const sendTestMessage = async () => {
  const { supabase } = await import('./lib/supabase.js')
  
  // Получить текущего пользователя
  const { data: { user } } = await supabase.auth.getUser()
  const { data: myProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()
  
  // Получить другого пользователя (для теста)
  const { data: otherProfile } = await supabase
    .from('profiles')
    .select('id')
    .neq('id', myProfile.id)
    .limit(1)
    .single()
  
  if (!otherProfile) {
    console.error('❌ Need at least 2 users for testing')
    return
  }
  
  console.log('=== SENDING TEST MESSAGE ===')
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: myProfile.id,
      receiver_id: otherProfile.id,
      message: 'Test message ' + new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) {
    console.error('❌ Error sending:', error)
  } else {
    console.log('✅ Message sent:', data)
    console.log('Check if Realtime event appeared above ⬆️')
  }
}
sendTestMessage()
```

---

## 🎯 Что искать:

### ✅ Успех выглядит так:
```
=== REALTIME TEST ===
Subscription status: SUBSCRIBED
✅ Successfully subscribed!
🎉 REALTIME EVENT: { eventType: 'INSERT', new: {...} }
```

### ❌ Проблемы выглядят так:

**Проблема 1: RLS блокирует доступ**
```
❌ RLS Error: { code: '42501', message: 'policy violation' }
```
→ Проблема с RLS политиками

**Проблема 2: Не подключается**
```
Subscription status: CHANNEL_ERROR
```
→ Realtime не включен или проблема с конфигурацией

**Проблема 3: Timeout**
```
Subscription status: TIMED_OUT
```
→ Проблема с сетью или CORS

**Проблема 4: Не аутентифицирован**
```
User: null
```
→ Пользователь не залогинен

---

## 📊 После проверки

Пришлите результаты из консоли, и я помогу найти проблему!

