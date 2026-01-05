#!/usr/bin/env bash
set -e echo "🚀 Organizing Smart Calculator project..."
# ------------------------------- ۱️⃣ تشخیص اینکه public وجود دارد یا نه 
# -------------------------------
BASE="public" if [ ! -d "$BASE" ]; then echo "ℹ️ Folder 'public' not 
  found — using project root." BASE="."
fi
# ------------------------------- ۲️⃣ ساخت پوشه‌ها (اگر نبودند) 
# -------------------------------
mkdir -p "$BASE/js" mkdir -p "$BASE/css" mkdir -p "$BASE/ai" mkdir -p 
"$BASE/core" mkdir -p "$BASE/physics" mkdir -p "$BASE/ui" mkdir -p 
"$BASE/wasm"
# تابع انتقال امن
safe_move() { if [ -e "$1" ]; then mv "$1" "$2/" echo "✔ moved: $1 -> 
    $2/"
  fi
}
echo "📦 Moving files..."
# ------------------------------- ۳️⃣ AI -------------------------------
safe_move "$BASE/explain-engine.js" "$BASE/ai" safe_move 
"$BASE/intent-engine.js" "$BASE/ai" safe_move "$BASE/learning-engine.js" 
"$BASE/ai" safe_move "$BASE/nlp-parser.js" "$BASE/ai" safe_move 
"$BASE/reality-calc-ai.js" "$BASE/ai"
# ------------------------------- ۴️⃣ Core -------------------------------
safe_move "$BASE/calculator.js" "$BASE/core" safe_move 
"$BASE/geometry.js" "$BASE/core" safe_move "$BASE/units.js" "$BASE/core" 
safe_move "$BASE/engine.v1.js" "$BASE/core" safe_move 
"$BASE/engine.v2.js" "$BASE/core" safe_move "$BASE/engine.v3.js" 
"$BASE/core" safe_move "$BASE/engine" "$BASE/core"
# ------------------------------- ۵️⃣ Physics 
# -------------------------------
safe_move "$BASE/physics" "$BASE/physics" safe_move "$BASE/body.js" 
"$BASE/physics" safe_move "$BASE/world.js" "$BASE/physics" safe_move 
"$BASE/integrator.js" "$BASE/physics" safe_move "$BASE/sandbox.js" 
"$BASE/physics"
# ------------------------------- ۶️⃣ UI -------------------------------
safe_move "$BASE/ui" "$BASE/ui" safe_move "$BASE/ui.js" "$BASE/ui" 
safe_move "$BASE/sandbox-ui.js" "$BASE/ui"
# ------------------------------- ۷️⃣ WASM -------------------------------
safe_move "$BASE/wasm" "$BASE/wasm" safe_move "$BASE/wasm-bridge.js" 
"$BASE/wasm"
echo "✨ Done. Project organized safely!"
