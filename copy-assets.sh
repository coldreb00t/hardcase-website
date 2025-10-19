#!/bin/bash

# 🎨 Скрипт для копирования ассетов Hardcase в проект

echo "🚀 Копирование ассетов Hardcase..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Базовые пути
SOURCE_BASE="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Desktop/Desktop - MacBook Air — Eugene/Hardcase"
DEST_BASE="/Users/eugenemelnik/HCS/public/images"

# Создание директорий
echo "📁 Создание директорий..."
mkdir -p "$DEST_BASE/logo"
mkdir -p "$DEST_BASE/patterns"
mkdir -p "$DEST_BASE/photos"

# Функция для копирования с проверкой
copy_if_exists() {
    local source="$1"
    local dest="$2"
    
    if [ -d "$source" ] || [ -f "$source" ]; then
        cp -R "$source" "$dest" 2>/dev/null
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓${NC} Скопировано: $(basename "$source")"
            return 0
        else
            echo -e "${RED}✗${NC} Ошибка при копировании: $(basename "$source")"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠${NC} Не найдено: $(basename "$source")"
        return 1
    fi
}

# Копирование логотипов
echo ""
echo "🎨 Копирование логотипов..."
if [ -d "$SOURCE_BASE/Logo/PNG" ]; then
    copy_if_exists "$SOURCE_BASE/Logo/PNG/"* "$DEST_BASE/logo/"
else
    echo -e "${YELLOW}⚠${NC} Папка Logo/PNG не найдена или файлы в iCloud"
    echo "   Попробуйте открыть папку в Finder, чтобы синхронизировать файлы"
fi

# Копирование векторного логотипа
if [ -f "$SOURCE_BASE/Logo/Vector/HardCase_Logos.pdf" ]; then
    copy_if_exists "$SOURCE_BASE/Logo/Vector/HardCase_Logos.pdf" "$DEST_BASE/logo/"
fi

# Копирование паттернов
echo ""
echo "📐 Копирование паттернов..."
if [ -d "$SOURCE_BASE/Pattern" ]; then
    copy_if_exists "$SOURCE_BASE/Pattern/"* "$DEST_BASE/patterns/"
else
    echo -e "${YELLOW}⚠${NC} Папка Pattern не найдена"
fi

# Копирование фотографий
echo ""
echo "📸 Копирование фотографий..."
if [ -d "$SOURCE_BASE/Photostyle" ]; then
    copy_if_exists "$SOURCE_BASE/Photostyle/"* "$DEST_BASE/photos/"
else
    echo -e "${YELLOW}⚠${NC} Папка Photostyle не найдена"
fi

# Подсчет скопированных файлов
echo ""
echo "📊 Статистика:"
echo "   Логотипы: $(ls -1 "$DEST_BASE/logo" 2>/dev/null | wc -l | xargs) файлов"
echo "   Паттерны: $(ls -1 "$DEST_BASE/patterns" 2>/dev/null | wc -l | xargs) файлов"
echo "   Фотографии: $(ls -1 "$DEST_BASE/photos" 2>/dev/null | wc -l | xargs) файлов"

echo ""
echo -e "${GREEN}✓${NC} Готово!"
echo ""
echo "💡 Совет: Если файлы не скопировались, откройте папки в Finder,"
echo "   чтобы iCloud синхронизировал их локально, затем запустите скрипт снова."
echo ""
echo "📝 Для запуска: chmod +x copy-assets.sh && ./copy-assets.sh"

