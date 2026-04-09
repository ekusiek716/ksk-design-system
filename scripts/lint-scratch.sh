#!/bin/bash
# =============================================================
# KSK Design System — スクラッチ検出スクリプト
#
# 禁止パターンをgrepで検出し、違反があればCI失敗させる。
# 実行: bash scripts/lint-scratch.sh
# =============================================================

set -euo pipefail

SRC_DIR="src"
ERRORS=0
WARNINGS=0

RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'

error() {
  echo -e "${RED}[ERROR]${NC} $1"
  ERRORS=$((ERRORS + 1))
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
  WARNINGS=$((WARNINGS + 1))
}

echo "🔍 KSK Design System — スクラッチ検出"
echo "======================================="

# ─── コンポーネント禁止パターン（エラー） ───
# 注意: components/ui/ と components/patterns/ 内のDS定義ファイルは除外
if grep -rn '<button\b' "$SRC_DIR" --include="*.tsx" --include="*.ts" | grep -v 'data-slot' | grep -v '.stories.' | grep -v 'node_modules' | grep -v "import" | grep -v 'components/ui/' | grep -v 'components/patterns/' | head -5; then
  error "生の <button> を検出。<Button variant=\"...\" size=\"...\"> を使用してください"
fi

if grep -rn '<input\b' "$SRC_DIR" --include="*.tsx" --include="*.ts" | grep -v 'data-slot' | grep -v '.stories.' | grep -v 'node_modules' | grep -v "import" | grep -v 'type="search"' | grep -v 'type="file"' | grep -v 'components/ui/' | grep -v 'components/patterns/' | head -5; then
  error "生の <input> を検出。<Input> コンポーネントを使用してください"
fi

if grep -rn '<a href' "$SRC_DIR" --include="*.tsx" | grep -v '.stories.' | grep -v 'node_modules' | grep -v 'data-slot' | grep -v 'components/ui/' | grep -v 'components/patterns/' | head -5; then
  error "生の <a href> を検出。<Button variant=\"link\"> を使用してください"
fi

if grep -rn 'pravatar\.cc' "$SRC_DIR" --include="*.tsx" | head -5; then
  error "pravatar.cc を検出。DiceBear shapes を使用してください"
fi

# ─── テキスト禁止パターン（警告） ───
for pattern in "font-bold" "font-semibold" "font-medium" "font-light"; do
  if grep -rn "\"$pattern\|'$pattern\| $pattern" "$SRC_DIR" --include="*.tsx" | grep -v '.stories.' | grep -v 'node_modules' | grep -v 'cva\|variants' | head -3; then
    warn "$pattern を検出。typo-* クラスを使用してください"
  fi
done

if grep -rn 'text-\[[0-9]*px\]' "$SRC_DIR" --include="*.tsx" | grep -v '.stories.' | grep -v 'node_modules' | head -3; then
  warn "text-[Npx] を検出。typo-* クラスを使用してください"
fi

# ─── カラー禁止パターン（警告） ───
if grep -rn 'text-white\b' "$SRC_DIR" --include="*.tsx" | grep -v '.stories.' | grep -v 'node_modules' | head -3; then
  warn "text-white を検出。text-[var(--Text-on-Inverse)] を使用してください"
fi

if grep -rn 'bg-white\b' "$SRC_DIR" --include="*.tsx" | grep -v '.stories.' | grep -v 'node_modules' | head -3; then
  warn "bg-white を検出。bg-[var(--Surface-Primary)] を使用してください"
fi

if grep -rn 'text-black\b' "$SRC_DIR" --include="*.tsx" | grep -v '.stories.' | grep -v 'node_modules' | head -3; then
  warn "text-black を検出。text-[var(--Text-High-Emphasis)] を使用してください"
fi

if grep -rn 'text-gray-\|bg-gray-\|text-blue-\|bg-blue-\|text-red-\|bg-red-\|text-green-\|bg-green-' "$SRC_DIR" --include="*.tsx" | grep -v '.stories.' | grep -v 'node_modules' | head -5; then
  warn "Tailwind 標準色を検出。セマンティックトークン var(--...) を使用してください"
fi

if grep -rn '#[0-9A-Fa-f]\{6\}' "$SRC_DIR" --include="*.tsx" | grep -v '.stories.' | grep -v 'node_modules' | grep -v '.css' | grep -v 'shadow' | head -3; then
  warn "HEX 直書きを検出。セマンティックトークンを使用してください"
fi

# ─── レイアウト禁止パターン（警告） ───
if grep -rn 'rounded-md\b\|rounded-xl\b\|rounded-3xl\b' "$SRC_DIR" --include="*.tsx" | grep -v '.stories.' | grep -v 'node_modules' | head -3; then
  warn "DS 定義外の角丸を検出。rounded-none/sm/lg/2xl/full のみ使用してください"
fi

if grep -rn 'shadow-md\b\|shadow-lg\b\|shadow-xl\b\|shadow-2xl\b' "$SRC_DIR" --include="*.tsx" | grep -v '.stories.' | grep -v 'node_modules' | grep -v 'shadow-\[' | grep -v 'components/ui/' | grep -v 'components/patterns/' | head -3; then
  warn "DS 定義外のシャドウを検出。shadow-[var(--shadow-*)] を使用してください"
fi

if grep -rn 'border-t-4\|border-l-4\|border-r-4\|border-b-4' "$SRC_DIR" --include="*.tsx" | grep -v '.stories.' | grep -v 'node_modules' | head -3; then
  warn "AI 生成パターン（カラーバー）を検出。全周ボーダーを使用してください"
fi

if grep -rn 'bg-gradient-to-' "$SRC_DIR" --include="*.tsx" | grep -v '.stories.' | grep -v 'node_modules' | head -3; then
  warn "グラデーション背景を検出。DS にグラデーション定義はありません"
fi

if grep -rn 'outline-none\b' "$SRC_DIR" --include="*.tsx" | grep -v '.stories.' | grep -v 'node_modules' | grep -v 'focus-visible' | grep -v 'components/ui/' | grep -v 'components/patterns/' | head -3; then
  warn "outline-none を検出。focus-visible:ring で代替してください"
fi

if grep -rn 'z-\[9999\]\|z-\[999\]' "$SRC_DIR" --include="*.tsx" | grep -v 'node_modules' | head -3; then
  warn "過剰な z-index を検出。z-50 を使用してください"
fi

# ─── 結果 ───
echo ""
echo "======================================="
if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}✗ エラー: $ERRORS 件${NC}"
  echo -e "${YELLOW}  警告: $WARNINGS 件${NC}"
  echo "  エラーを修正してください"
  exit 1
elif [ $WARNINGS -gt 0 ]; then
  echo -e "${YELLOW}△ 警告: $WARNINGS 件${NC}"
  echo "  修正を推奨します"
  exit 0
else
  echo -e "${GREEN}✓ 問題なし${NC}"
  exit 0
fi
