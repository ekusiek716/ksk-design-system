#!/bin/bash
# KSK Design System — プロジェクトセットアップスクリプト
# 使い方: bash scripts/setup-project.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DS_ROOT="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(pwd)"

echo "🎨 KSK Design System セットアップ"
echo "=================================="
echo ""

# 1. CLAUDE.md 注入
bash "$DS_ROOT/scripts/inject-claude-rules.sh" "$PROJECT_ROOT"
echo ""

# 2. 依存パッケージ確認
echo "📦 依存パッケージを確認中..."
MISSING=""
for pkg in "class-variance-authority" "clsx" "tailwind-merge"; do
  if ! grep -q "\"$pkg\"" package.json 2>/dev/null; then
    MISSING="$MISSING $pkg"
  fi
done

if [ -n "$MISSING" ]; then
  echo "  以下のパッケージをインストールしてください:"
  echo "  npm install$MISSING"
else
  echo "  ✓ 全ての依存パッケージが確認できました"
fi

# 3. ブランドカラー検出
echo ""
echo "🎨 ブランドカラーを検出中..."
BRAND_COLOR=""

# tailwind.config から検出
if [ -f "tailwind.config.ts" ] || [ -f "tailwind.config.js" ]; then
  BRAND_COLOR=$(grep -oP "primary.*?['\"]#([0-9A-Fa-f]{6})['\"]" tailwind.config.* 2>/dev/null | grep -oP '#[0-9A-Fa-f]{6}' | head -1)
fi

# CSS変数から検出
if [ -z "$BRAND_COLOR" ]; then
  BRAND_COLOR=$(grep -rh "\-\-primary.*#[0-9A-Fa-f]\{6\}" src/ --include="*.css" 2>/dev/null | grep -oP '#[0-9A-Fa-f]{6}' | head -1)
fi

# 最頻HEXから検出
if [ -z "$BRAND_COLOR" ]; then
  BRAND_COLOR=$(grep -roh '#[0-9A-Fa-f]\{6\}' src/ --include="*.tsx" --include="*.css" 2>/dev/null | grep -iv 'ffffff\|000000\|f[0-9a-f]\{5\}' | sort | uniq -c | sort -rn | head -1 | awk '{print $2}')
fi

if [ -z "$BRAND_COLOR" ]; then
  BRAND_COLOR="#3B82F6"
  echo "  ブランドカラーが検出できませんでした。デフォルト ($BRAND_COLOR) を使用します"
else
  echo "  ✓ 検出: $BRAND_COLOR"
fi

# 4. テーマファイル作成
echo ""
echo "📝 テーマファイルを作成中..."
THEME_PATH="src/styles/theme-client.css"
mkdir -p "$(dirname "$THEME_PATH")"

if [ ! -f "$THEME_PATH" ]; then
  cat > "$THEME_PATH" << THEME
/* KSK Design System — Client Theme */
/* Brand-500: $BRAND_COLOR */
/* 他のシェードは https://uicolors.app/ で生成してください */

@theme {
  --Primitive-Brand-500: $BRAND_COLOR;
}
THEME
  echo "  ✓ $THEME_PATH を作成しました"
  echo "  ⚠ Brand-50〜900 の全シェードを設定してください"
else
  echo "  ⚠ $THEME_PATH は既に存在するためスキップしました"
fi

echo ""
echo "=================================="
echo "✅ セットアップ完了"
echo ""
echo "次のステップ:"
echo "  1. $THEME_PATH でBrand色の全シェードを設定"
echo "  2. グローバルCSSに以下を追加:"
echo "     @import \"./styles/primitive.css\";"
echo "     @import \"./styles/semantic.css\";"
echo "     @import \"./styles/typography.css\";"
echo "     @import \"./styles/theme-client.css\";"
echo "  3. npm run dev で動作確認"
