#!/usr/bin/env bash
set -e

echo "🚀 شروع ساخت پکیج نهایی اپلیکیشن Reality Smart Calculator..."
sleep 1

APP_NAME="reality-smart-calculator"
DIST_DIR="dist_app"
ZIP_NAME="${APP_NAME}.zip"

# ======================
# حذف فایل‌ها و پوشه‌های قدیمی
# ======================
echo "📦 حذف پوشه‌های قدیمی (اگر وجود دارند)..."
rm -rf "$DIST_DIR" "$ZIP_NAME"

# ======================
# ساخت پوشه ساخت نهایی
# ======================
echo "📁 ایجاد پوشه ساخت..."
mkdir -p "$DIST_DIR"

# ======================
# ایجاد ساختار زیرپوشه‌ها
# ======================
echo "📂 ایجاد زیرپوشه‌ها..."
for sub in core physics ui wasm ai; do
  mkdir -p "$DIST_DIR/$sub"
done

# ======================
# کپی فایل‌ها
# ======================
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

# ======================
# بررسی فایل‌های کلیدی
# ======================
echo "🧪 بررسی فایل‌های کلیدی..."
KEY_FILES=(
 "$DIST_DIR/index.html"
 "$DIST_DIR/manifest.json"
 "$DIST_DIR/sw.js"
 "$DIST_DIR/core/engine.v3.js"
)

for f in "${KEY_FILES[@]}"; do
 if [ ! -f "$f" ]; then
   echo "❌ فایل ضروری پیدا نشد: $f"
   exit 1
 fi
done

# ======================
# ساخت ZIP نهایی
# ======================
echo "🗜 ساخت فایل ZIP نهایی..."
cd "$DIST_DIR"
zip -r "../$ZIP_NAME" ./*
cd ..

echo "✅ پکیج با موفقیت ساخته شد!"
echo "📁 فایل آماده دانلود:"
echo "➡ $ZIP_NAME"

echo "🎯 می‌توانی این ZIP را:"
echo "   ✔ در هاست آپلود کنی"
echo "   ✔ روی موبایل اجرا و نصب کنی"
echo "   ✔ به عنوان PWA استفاده کنی"
