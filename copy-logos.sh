#!/bin/bash

# Простая команда для копирования только логотипов

cd /Users/eugenemelnik/HCS

echo "🎨 Копирование логотипов Hardcase..."

# Копируем только нужные варианты логотипов
cp Logo/PNG/HardCase_Logos-01.png public/images/HardCase_Logos-01.png
cp Logo/PNG/HardCase_Logos-02.png public/images/HardCase_Logos-02.png
cp Logo/PNG/HardCase_Logos-16.png public/images/HardCase_Logos-16.png

echo "✅ Готово! Скопировано 3 логотипа"
ls -lh public/images/HardCase_Logos*.png

