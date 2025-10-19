# 🎨 Инструкция по копированию ассетов

## Быстрое копирование всех файлов

Выполните эту команду в терминале:

```bash
cd /Users/eugenemelnik/HCS

# Копирование логотипов
cp Logo/PNG/*.png public/images/

# Копирование паттернов  
cp Pattern/PNG/*.png public/images/

# Копирование фотографий
cp Photostyle/* public/images/

# Копирование мотивационных изображений
cp Motivations/*.png public/images/

# Копирование обложек для соцсетей
cp SocNetwork/PNG/*.png public/images/

echo "✅ Все файлы скопированы!"
ls public/images/ | wc -l
```

## Или скопируйте вручную через Finder:

1. Откройте папку `/Users/eugenemelnik/HCS`
2. Перетащите файлы из папок:
   - `Logo/PNG/` → в `public/images/`
   - `Pattern/PNG/` → в `public/images/`
   - `Photostyle/` → в `public/images/`
   - `Motivations/` → в `public/images/`
   - `SocNetwork/PNG/` → в `public/images/`

## Использованные файлы в компонентах:

- **Navigation**: `HardCase_Logos-01.png`
- **Hero Section**: `HardCase_Logos-16.png`
- **Footer**: `HardCase_Logos-02.png`
- **Contact Section**: `HardCase_phostyle_1.jpg`
- **Background Patterns**: `Hard_Case_Pattern-02.png`, `Hard_Case_Pattern-03.png`, `Hard_Case_Pattern-04.png`

## После копирования:

Перезапустите dev-сервер:
```bash
npm run dev
```

Откройте http://localhost:3000 и проверьте что все изображения загружаются!

