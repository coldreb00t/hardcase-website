# 🔍 Проверка Schema.org разметки

## ✅ Что добавлено

### 1. Структурированные данные (JSON-LD)

Добавлены 4 типа Schema разметки:

1. **Organization Schema** (`MedicalBusiness`)
   - Информация о компании Hardcase
   - Контакты, адрес, рейтинг
   - Команда (Мария Мостовая, Артём Белов) с сертификатами
   - Услуги и специализации

2. **WebSite Schema**
   - Базовая информация о сайте
   - Язык контента

3. **BreadcrumbList Schema**
   - Навигация по секциям сайта

4. **FAQ Schema**
   - 6 часто задаваемых вопросов с ответами
   - Оптимизировано для Google Rich Snippets

### 2. Расширенные метаданные

- ✅ Оптимизированный title и description для SEO
- ✅ Open Graph теги для социальных сетей
- ✅ Twitter Card теги
- ✅ Robots meta теги для индексации

### 3. Robots.txt

Разрешено сканирование для:
- ✅ GPTBot (ChatGPT)
- ✅ ClaudeBot (Claude)
- ✅ PerplexityBot (Perplexity AI)
- ✅ Google-Extended (Bard/Gemini)
- ✅ Googlebot
- ✅ Bingbot (Copilot)
- ✅ YandexBot (Yandex GPT)
- ✅ CCBot, FacebookBot

### 4. Sitemap.xml

Карта сайта с:
- Главной страницей
- Всеми секциями
- Приоритетами страниц
- Датами последнего обновления

---

## 🧪 Как проверить Schema разметку

### 1. Google Rich Results Test

**URL**: https://search.google.com/test/rich-results

**Как проверить**:
1. Перейти на сайт после деплоя
2. Ввести URL: `https://hardcase.training`
3. Нажать "Test URL"

**Ожидаемые результаты**:
- ✅ Organization
- ✅ FAQ
- ✅ BreadcrumbList

### 2. Schema.org Validator

**URL**: https://validator.schema.org/

**Как проверить**:
1. Открыть https://hardcase.training
2. Скопировать HTML код страницы (Ctrl+U)
3. Вставить в валидатор
4. Нажать "Run Test"

**Ожидаемые результаты**:
- 0 ошибок
- 4 найденных схемы

### 3. Проверка robots.txt

**URL**: https://hardcase.training/robots.txt

**Ожидаемый результат**:
```
User-agent: *
Allow: /
Disallow: /api/

User-agent: GPTBot
Allow: /
...
```

### 4. Проверка sitemap.xml

**URL**: https://hardcase.training/sitemap.xml

**Ожидаемый результат**:
- XML файл с 8 URL
- Все ссылки рабочие

### 5. Google Search Console

**После регистрации**:

1. Добавить сайт в Google Search Console
2. Отправить sitemap: `https://hardcase.training/sitemap.xml`
3. Запросить индексацию главной страницы
4. Проверить "URL Inspection" через 24-48 часов

**Ожидаемые данные**:
- Structured data: 4 типа обнаружено
- Errors: 0
- Warnings: 0

---

## 📊 Ожидаемые результаты

### Через 1-2 недели:

**Google Search**:
- ✅ Расширенные сниппеты (Rich Snippets)
- ✅ FAQ блоки в результатах поиска
- ✅ Информация о компании (Knowledge Panel)
- ✅ Хлебные крошки в выдаче

**AI Поисковики**:
- ✅ Правильная интерпретация услуг
- ✅ Распознавание команды и их квалификации
- ✅ Понимание специализации (реабилитация)
- ✅ Корректные контакты в ответах

### Через 1-2 месяца:

**ChatGPT, Claude, Perplexity**:
- ✅ Упоминание Hardcase в ответах на запросы о реабилитации
- ✅ Цитирование экспертов (Мария, Артём)
- ✅ Рекомендации при вопросах типа "где пройти реабилитацию"

---

## 🚀 Дальнейшие шаги

### 1. Регистрация в Google Search Console
```
1. Перейти: https://search.google.com/search-console
2. Добавить домен: hardcase.training
3. Подтвердить владение (DNS или HTML-тег)
4. Добавить sitemap.xml
```

### 2. Регистрация в Яндекс.Вебмастер
```
1. Перейти: https://webmaster.yandex.ru
2. Добавить сайт: hardcase.training
3. Подтвердить владение
4. Добавить sitemap.xml
```

### 3. Создание Google Business Profile
```
1. Перейти: https://business.google.com
2. Создать профиль для Hardcase
3. Заполнить все поля
4. Добавить фото, услуги
5. Собрать первые отзывы
```

### 4. Регистрация на Wikidata
```
1. Перейти: https://www.wikidata.org
2. Создать сущность "Hardcase"
3. Заполнить свойства:
   - instance of: business
   - industry: rehabilitation, fitness
   - website: hardcase.training
   - founders: Maria Mostovaya, Artem Belov
```

---

## 📝 Важные заметки

### Обновление Schema

При изменении контента обновлять:
- `components/StructuredData.tsx` (основная разметка)
- `public/sitemap.xml` (даты lastmod)
- `app/layout.tsx` (meta description)

### Мониторинг

**Еженедельно проверять**:
1. Google Search Console → Performance
2. Schema validation errors
3. Coverage issues
4. Mobile usability

**Ежемесячно проверять**:
1. Упоминания в AI (ChatGPT, Perplexity)
2. Позиции в Google по ключевым запросам
3. Rich Snippets в выдаче

---

## 🎯 Ключевые метрики успеха

### SEO метрики:
- [ ] Индексация в Google (1-2 недели)
- [ ] Rich Snippets в выдаче (2-4 недели)
- [ ] Knowledge Panel (1-3 месяца)
- [ ] TOP-10 по "реабилитация после травмы" (2-3 месяца)

### AI метрики:
- [ ] Упоминание в ChatGPT (1-2 месяца)
- [ ] Упоминание в Claude (1-2 месяца)
- [ ] Упоминание в Perplexity (3-6 недель)
- [ ] Цитирование в 20%+ ответов (3-6 месяцев)

---

**Создано**: 20 октября 2025  
**Последнее обновление**: 20 октября 2025  
**Статус**: ✅ Активно

