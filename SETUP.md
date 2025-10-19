# 🚀 Финальная настройка сайта Hardcase

## Осталось только скопировать логотипы!

Выполните эту простую команду в терминале:

```bash
cd /Users/eugenemelnik/HCS && \
cp Logo/PNG/HardCase_Logos-01.png public/images/ && \
cp Logo/PNG/HardCase_Logos-02.png public/images/ && \
cp Logo/PNG/HardCase_Logos-16.png public/images/ && \
echo "✅ Логотипы скопированы! Готово к запуску."
```

## Или скопируйте через Finder:

1. Откройте папки в Finder
2. Скопируйте эти 3 файла из `Logo/PNG/`:
   - `HardCase_Logos-01.png` → в `public/images/`
   - `HardCase_Logos-02.png` → в `public/images/`
   - `HardCase_Logos-16.png` → в `public/images/`

## Запуск сайта:

```bash
cd /Users/eugenemelnik/HCS
npm run dev
```

Откройте: **http://localhost:3000**

## Что использовано:

✅ **Логотипы**:
- Navigation: `HardCase_Logos-01.png` (светлая версия в шапке)
- Hero Section: `HardCase_Logos-16.png` (большой центральный логотип)
- Footer: `HardCase_Logos-02.png` (темная версия в футере)
- Favicon: `HardCase_Logos-16.png` (иконка браузера)

✅ **Дизайн**:
- Фирменные цвета: оранжевый (#f97316) + градиенты
- Современный минималистичный интерфейс
- Плавные анимации Framer Motion
- Полностью адаптивный дизайн

❌ **Не использовано** (пока):
- Фотографии из Photostyle (можно добавить позже при необходимости)
- Паттерны (чтобы не перегружать дизайн)
- Обложки соцсетей (для других целей)

Сайт готов работать с чистым профессиональным дизайном! 🎉

