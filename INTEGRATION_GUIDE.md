# 🎨 Гайд по интеграции логотипов и стилей Hardcase

## 📋 Шаги для интеграции

### 1. Скопируйте файлы в проект

```bash
# Создайте директории
mkdir -p /Users/eugenemelnik/HCS/public/images/logo
mkdir -p /Users/eugenemelnik/HCS/public/images/patterns
mkdir -p /Users/eugenemelnik/HCS/public/images/photos

# Скопируйте логотипы (выберите нужные варианты)
cp "/Users/eugenemelnik/Library/Mobile Documents/com~apple~CloudDocs/Desktop/Desktop - MacBook Air — Eugene/Hardcase/Logo/PNG/"*.png /Users/eugenemelnik/HCS/public/images/logo/

# Скопируйте векторную версию (опционально)
cp "/Users/eugenemelnik/Library/Mobile Documents/com~apple~CloudDocs/Desktop/Desktop - MacBook Air — Eugene/Hardcase/Logo/Vector/HardCase_Logos.pdf" /Users/eugenemelnik/HCS/public/images/logo/

# Скопируйте паттерны
cp "/Users/eugenemelnik/Library/Mobile Documents/com~apple~CloudDocs/Desktop/Desktop - MacBook Air — Eugene/Hardcase/Pattern/"* /Users/eugenemelnik/HCS/public/images/patterns/

# Скопируйте фотостили
cp "/Users/eugenemelnik/Library/Mobile Documents/com~apple~CloudDocs/Desktop/Desktop - MacBook Air — Eugene/Hardcase/Photostyle/"* /Users/eugenemelnik/HCS/public/images/photos/
```

### 2. Рекомендуемые варианты логотипов для использования

Исходя из найденных файлов, рекомендую использовать:

- **HardCase_Logos-01.png** - для навигации (светлая версия)
- **HardCase_Logos-02.png** - для футера (темная версия)
- **HardCase_Logos-16.png** - для favicon/иконки приложения

### 3. Куда интегрировать логотипы

#### Navigation (компонент навигации)
```typescript
// components/Navigation.tsx
<motion.a href="#" className="flex items-center">
  <Image 
    src="/images/logo/HardCase_Logos-01.png" 
    alt="Hardcase Logo" 
    width={150} 
    height={50}
    priority
  />
</motion.a>
```

#### Hero Section (главный экран)
```typescript
// components/HeroSection.tsx
<div className="mb-8">
  <Image 
    src="/images/logo/HardCase_Logos-16.png" 
    alt="Hardcase" 
    width={200} 
    height={80}
    priority
  />
</div>
```

#### Footer
```typescript
// components/Footer.tsx
<Image 
  src="/images/logo/HardCase_Logos-02.png" 
  alt="Hardcase" 
  width={120} 
  height={40}
/>
```

### 4. Использование паттернов

Паттерны можно использовать как фоновые изображения:

```typescript
// В любом компоненте
<div 
  className="relative"
  style={{
    backgroundImage: 'url(/images/patterns/pattern-01.png)',
    backgroundRepeat: 'repeat',
    opacity: 0.05
  }}
>
  {/* Контент */}
</div>
```

Или через Tailwind CSS:

```css
/* app/globals.css */
.pattern-bg {
  background-image: url('/images/patterns/pattern-01.png');
  background-repeat: repeat;
  opacity: 0.05;
}
```

### 5. Использование фотографий

Фотографии из Photostyle можно использовать в секциях:

```typescript
// components/TeamSection.tsx или AudienceSection.tsx
<div className="relative h-64 rounded-2xl overflow-hidden">
  <Image 
    src="/images/photos/team-photo-01.jpg" 
    alt="Hardcase Team" 
    fill
    className="object-cover"
  />
</div>
```

### 6. Оптимизация изображений

Next.js автоматически оптимизирует изображения из `/public/images/`.
Для лучшей производительности:

1. Используйте компонент `<Image>` из `next/image`
2. Укажите `width` и `height` для статических изображений
3. Используйте `priority` для изображений выше fold
4. Для фоновых изображений - используйте WebP формат

### 7. Favicon

Скопируйте логотип для favicon:

```bash
# Конвертируйте PNG в ICO (можно использовать онлайн конвертер)
# или просто используйте PNG напрямую
cp /Users/eugenemelnik/HCS/public/images/logo/HardCase_Logos-16.png /Users/eugenemelnik/HCS/public/favicon.png
```

Затем обновите `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Hardcase — Профессиональная команда специалистов',
  icons: {
    icon: '/favicon.png',
  },
  // ...
}
```

## 🎨 Цветовая палитра из брендбука

Если в папках есть файлы с цветовой палитрой, обновите `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // Основной оранжевый
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  // Добавьте дополнительные цвета из брендбука
}
```

## 📝 Следующие шаги

1. ✅ Скопируйте нужные файлы из iCloud в `/public/images/`
2. ✅ Выберите подходящие варианты логотипов для разных секций
3. ✅ Обновите компоненты с использованием настоящих логотипов
4. ✅ Интегрируйте паттерны как фоновые элементы
5. ✅ Добавьте фотографии в соответствующие секции
6. ✅ Настройте favicon
7. ✅ Протестируйте на разных устройствах

---

После копирования файлов дайте мне знать, и я помогу интегрировать их в компоненты!

