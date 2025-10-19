# 🚀 Деплой HardCase на Timeweb Cloud (Docker)

## 📋 Что подготовлено

✅ **Dockerfile** - оптимизированная многоступенчатая сборка  
✅ **docker-compose.yml** - для локального тестирования  
✅ **.dockerignore** - исключает ненужные файлы  
✅ **next.config.js** - настроен для standalone режима

---

## 🎯 Вариант 1: Деплой через Git репозиторий (РЕКОМЕНДУЕТСЯ)

### Шаг 1: Создайте Git репозиторий

#### A. GitHub (рекомендуется)

```bash
cd /Users/eugenemelnik/HCS

# Инициализация репозитория
git init

# Создайте .gitignore (если ещё не создан)
cat > .gitignore << 'EOF'
node_modules
.next
out
.DS_Store
*.log
.env*.local
.vercel
EOF

# Добавьте все файлы
git add .
git commit -m "Initial commit: HardCase website"
```

#### B. Создайте репозиторий на GitHub

1. Перейдите на https://github.com/new
2. Название: `hardcase-website`
3. Приватность: выберите по желанию
4. НЕ добавляйте README, .gitignore (у вас уже есть)
5. Нажмите "Create repository"

#### C. Загрузите код

```bash
# Замените YOUR_USERNAME на ваш GitHub username
git remote add origin https://github.com/YOUR_USERNAME/hardcase-website.git
git branch -M main
git push -u origin main
```

---

### Шаг 2: Создайте приложение в Timeweb Cloud

1. **Войдите в панель управления Timeweb Cloud**
   - https://timeweb.cloud/my/

2. **Создайте новое приложение**
   - Нажмите "Создать" → "Приложение"
   - Выберите "Из репозитория"

3. **Подключите репозиторий**
   - Выберите GitHub
   - Авторизуйте Timeweb Cloud
   - Выберите репозиторий `hardcase-website`
   - Ветка: `main`

4. **Настройте конфигурацию**
   - **Регион:** Москва (для российской аудитории)
   - **Framework:** Next.js (должен определиться автоматически)
   - **Build Command:** `npm run build` (по умолчанию)
   - **Start Command:** `node server.js` (будет из Dockerfile)
   - **Port:** `3000`

5. **Выберите тарифный план**
   - Минимальный: 1 vCPU, 512 MB RAM (достаточно для начала)
   - Можно масштабировать позже

6. **Переменные окружения (опционально)**
   ```
   NODE_ENV=production
   PORT=3000
   ```

7. **Нажмите "Создать приложение"**

---

### Шаг 3: Дождитесь сборки

- Timeweb Cloud автоматически:
  - Клонирует репозиторий
  - Соберёт Docker образ
  - Запустит приложение
- Время сборки: 5-10 минут
- Следите за логами в реальном времени

---

### Шаг 4: Настройка домена

1. **В панели приложения найдите раздел "Домены"**

2. **Добавьте ваш домен**
   - Нажмите "Добавить домен"
   - Введите: `ваш-домен.ru`

3. **Настройте DNS**
   
   В панели управления вашего доменного регистратора создайте записи:

   **Для корневого домена (ваш-домен.ru):**
   ```
   Тип: A
   Имя: @
   Значение: IP-адрес из панели Timeweb Cloud
   TTL: 3600
   ```

   **Для www (www.ваш-домен.ru):**
   ```
   Тип: CNAME
   Имя: www
   Значение: ваш-домен.ru
   TTL: 3600
   ```

4. **SSL сертификат**
   - Timeweb Cloud автоматически установит Let's Encrypt
   - Ваш сайт будет доступен по HTTPS

---

## 🎯 Вариант 2: Прямая загрузка Docker образа

Если не хотите использовать Git:

### Шаг 1: Соберите образ локально

```bash
cd /Users/eugenemelnik/HCS

# Тест сборки
docker build -t hardcase-website .

# Тест запуска
docker run -p 3000:3000 hardcase-website
# Откройте http://localhost:3000 для проверки
```

### Шаг 2: Загрузите в Docker Hub

```bash
# Войдите в Docker Hub
docker login

# Тегируйте образ
docker tag hardcase-website ваш-username/hardcase-website:latest

# Загрузите
docker push ваш-username/hardcase-website:latest
```

### Шаг 3: Деплой в Timeweb Cloud

1. Создайте приложение
2. Выберите "Из Docker образа"
3. Укажите: `ваш-username/hardcase-website:latest`
4. Настройте порт: `3000`

---

## 🔄 Автоматические обновления

### Настройка CI/CD через GitHub Actions

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Timeweb Cloud

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Trigger Timeweb Deploy
        run: |
          curl -X POST ${{ secrets.TIMEWEB_WEBHOOK_URL }}
```

В Timeweb Cloud:
1. Настройки приложения → Webhooks
2. Скопируйте Webhook URL
3. В GitHub: Settings → Secrets → New secret
4. Имя: `TIMEWEB_WEBHOOK_URL`
5. Значение: вставьте URL

**Результат:** При каждом push в main автоматически обновится сайт!

---

## 📊 Мониторинг и логи

### Просмотр логов

В панели Timeweb Cloud:
- **Логи приложения:** вкладка "Логи"
- **Метрики:** CPU, RAM, Network в реальном времени
- **Статус:** зелёный = работает, красный = ошибка

### Полезные команды в консоли Timeweb

```bash
# Просмотр логов
timeweb logs hardcase-website --follow

# Перезапуск приложения
timeweb restart hardcase-website

# Масштабирование
timeweb scale hardcase-website --replicas 2
```

---

## 🔧 Локальное тестирование Docker

Перед деплоем протестируйте локально:

```bash
cd /Users/eugenemelnik/HCS

# Вариант 1: Через docker-compose (проще)
docker-compose up --build

# Вариант 2: Напрямую
docker build -t hardcase-website .
docker run -p 3000:3000 hardcase-website

# Откройте: http://localhost:3000
```

---

## 💰 Примерная стоимость

**Минимальная конфигурация:**
- 1 vCPU, 512 MB RAM
- ~300-500 ₽/месяц

**Оптимальная конфигурация:**
- 1 vCPU, 1 GB RAM
- ~500-700 ₽/месяц

**С доменом и SSL:**
- SSL: бесплатно (Let's Encrypt)
- Домен: от 200 ₽/год (зависит от зоны)

---

## ⚡ Оптимизация производительности

### 1. Кеширование

В Timeweb Cloud включите CDN:
- Настройки → CDN → Включить
- Автоматически кеширует статику
- Ускоряет загрузку в 2-3 раза

### 2. Масштабирование

При росте трафика:
```bash
# Вертикальное (больше ресурсов)
CPU: 1 → 2 vCPU
RAM: 512MB → 1GB

# Горизонтальное (больше инстансов)
Replicas: 1 → 2 или 3
+ Load Balancer
```

### 3. Gzip компрессия

Next.js автоматически включает Gzip для статики

---

## 🐛 Решение проблем

### Ошибка: "Build failed"

**Проверьте:**
1. Все зависимости в `package.json`
2. Логи сборки в панели Timeweb
3. Локальная сборка: `npm run build`

**Решение:**
```bash
# Обновите зависимости
npm install
npm run build

# Если работает локально - загрузите в Git
git add .
git commit -m "Fix build"
git push
```

### Ошибка: "Container crashed"

**Проверьте:**
1. Логи приложения
2. Переменные окружения
3. Порт (должен быть 3000)

**Решение:**
```bash
# Тест контейнера локально
docker run -p 3000:3000 hardcase-website
docker logs <container-id>
```

### Ошибка: "Out of memory"

**Решение:** Увеличьте RAM до 1 GB

### Домен не открывается

**Проверьте:**
1. DNS настройки (может занять до 24 часов)
2. A-запись указывает на правильный IP
3. SSL сертификат выпущен

**Решение:** Подождите или проверьте через `dig ваш-домен.ru`

---

## 📞 Поддержка

### Timeweb Cloud
- **Email:** info@timeweb.cloud
- **Чат:** в панели управления
- **Документация:** https://timeweb.cloud/help/

### Сообщество
- **Telegram:** @timeweb_community
- **GitHub Issues:** если используете GitHub

---

## ✅ Checklist деплоя

- [ ] Код загружен в Git репозиторий
- [ ] Приложение создано в Timeweb Cloud
- [ ] Репозиторий подключен
- [ ] Сборка завершена успешно
- [ ] Приложение запущено (статус: зелёный)
- [ ] Временный URL открывается
- [ ] Домен добавлен
- [ ] DNS настроены
- [ ] SSL сертификат выпущен
- [ ] Сайт открывается по вашему домену
- [ ] Все разделы работают
- [ ] Мобильная версия корректна

---

## 🎓 Полезные ссылки

- [Next.js Docker документация](https://nextjs.org/docs/deployment#docker-image)
- [Timeweb Cloud документация](https://timeweb.cloud/help/)
- [Docker лучшие практики](https://docs.docker.com/develop/dev-best-practices/)

---

**Время деплоя:** 20-30 минут  
**Сложность:** ⭐⭐⭐☆☆ (средняя)  
**Масштабируемость:** ⭐⭐⭐⭐⭐ (отличная)

**Готово к production!** 🚀

