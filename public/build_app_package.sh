#!/usr/bin/env bash
set -e

echo "🚀 شروع ساخت پکیج نهایی اپلیکیشن Reality Smart Calculator..."
sleep 1

APP_NAME="reality-smart-calculator"
DIST_DIR="dist_app"
ZIP_NAME="${APP_NAME}.zip"

echo "📦 حذف پوشه‌های قدیمی (اگر وجود دارند)..."
rm -rf "$DIST_DIR" "$ZIP_NAME"

echo "📁 ساخت پوشه ساخت نهایی..."
mkdir -p "$DIST_DIR"

echo "📂 ایجاد ساختار اپلیکیشن..."
mkdir -p "$DIST_DIR"/{core,physics,ui,wasm,ai}

echo "📥 کپی فایل‌های پروژه..."

cp -r core/*.js "$DIST_DIR/core/" 2>/dev/null || true
cp -r physics/*.js "$DIST_DIR/physics/" 2>/dev/null || true
cp -r ui/*.js "$DIST_DIR/ui/" 2>/dev/null || true
cp -r wasm/* "$DIST_DIR/wasm/" 2>/dev/null || true
cp -r ai/*.js "$DIST_DIR/ai/" 2>/dev/null || true

cp index.html "$DIST_DIR/" 2>/dev/null || true
cp manifest.json "$DIST_DIR/" 2>/dev/null || true
cp sw.js "$DIST_DIR/" 2>/dev/null || true
cp README.md "$DIST_DIR/" 2>/dev/null || true

echo "🧪 بررسی وجود فایل‌های کلیدی..."

FILES=(
 "$DIST_DIR/index.html"
 "$DIST_DIR/core/engine.js"
)

for f in "${FILES[@]}"; do
 if [ ! -f "$f" ]; then
   echo "❌ فایل ضروری پیدا نشد: $f"
 fi
done

echo "🗜 ساخت فایل ZIP نهایی..."
cd "$DIST_DIR"
zip -r "../$ZIP_NAME" ./*
cd ..

echo "✅ ساخت پکیج با موفقیت انجام شد"
echo "📁 فایل آماده دانلود:"
echo "➡  $ZIP_NAME"

echo "🎯 این ZIP را میتوانی:"
echo "   ✔ در هاست آپلود کنی"
echo "   ✔ مستقیم روی موبایل اجرا کنی"
echo "   ✔ PWA نصب کنی"
