#!/bin/bash
echo "🧹 پاک‌سازی پوشهٔ dist قبلی..." rm -rf dist mkdir -p dist echo "📁 کپی فایل‌های اصلی..." cp index.html 
dist/ 2>/dev/null || echo "⚠️ index.html پیدا نشد" cp manifest.json dist/ 2>/dev/null || echo "⚠️ 
manifest.json پیدا نشد" cp sw.js dist/ 2>/dev/null || echo "⚠️ sw.js پیدا نشد" echo "📦 جمع‌آوری همهٔ 
فایل‌های .js از کل پروژه..." find . -name "*.js" -exec cp {} dist/ \; echo "🚀 اجرای اپلیکیشن روی 
localhost:3000 ..."
serve dist
