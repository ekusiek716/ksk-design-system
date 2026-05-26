#!/bin/bash
# =============================================================
# KSK Design System — ストーリー品質チェック
#
# ストーリー内で DS コンポーネントを使わずに生 HTML を書いている
# ケースを検出する。
#
# 3 カテゴリ:
#   A. 生 HTML 使用 — <button className=>, <input className=>,
#      <select> 等を検出
#   B. ネイティブ UI 禁止 — type="date" など
#   C. パターン統一 — 専用パーツがあるのに手書きしてる箇所
#
# 実行: bash scripts/check-story-reuse.sh
# =============================================================

set -uo pipefail

RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STORY_DIRS=(
  "$ROOT/src/components/ui"
  "$ROOT/src/components/patterns"
  "$ROOT/src/components/patterns/commerce"
  "$ROOT/src/components/patterns/admin"
  "$ROOT/src/components/patterns/shells"
)

ERRORS=0
WARNINGS=0

scan_stories() {
  local pattern="$1"
  local message="$2"
  local kind="$3" # ERROR | WARN

  for dir in "${STORY_DIRS[@]}"; do
    [ -d "$dir" ] || continue
    for file in "$dir"/*.stories.tsx; do
      [ -f "$file" ] || continue
      while IFS=: read -r lineno line; do
        if [ "$kind" = "ERROR" ]; then
          echo -e "    ${RED}✗${NC} $(basename "$file"):$lineno — $message"
          ERRORS=$((ERRORS + 1))
        else
          echo -e "    ${YELLOW}⚠${NC} $(basename "$file"):$lineno — $message"
          WARNINGS=$((WARNINGS + 1))
        fi
      done < <(grep -nE "$pattern" "$file" 2>/dev/null)
    done
  done
}

echo "╔══════════════════════════════════════════╗"
echo "║   KSK DS — Story Quality Check           ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ─── A. 生 HTML 使用 ───
echo "── A. 生 HTML 使用 ──"
echo ""

echo "  A1. <button className=> → <Button>"
scan_stories '<button\s+className=' "<Button> を使ってください" ERROR

echo "  A2. <input className=> → <Input>"
scan_stories '<input\s+className=' "<Input> を使ってください" ERROR

echo "  A3. <select> → <Select>"
scan_stories '<select[[:space:]>]' "<Select> を使ってください" ERROR

echo "  A4. <textarea className=> → <Textarea>"
scan_stories '<textarea\s+className=' "<Textarea> を使ってください" ERROR

echo ""

# ─── B. ネイティブ UI 禁止 ───
echo "── B. ネイティブ UI 禁止 ──"
echo ""

echo "  B1. type=\"date\" → DatePicker"
scan_stories 'type="date"' "DatePicker を使ってください" ERROR

echo "  B2. type=\"time\" → TimePicker"
scan_stories 'type="time"' "TimePicker を使ってください" ERROR

echo ""

# ─── C. ストーリー内独自コンポーネント定義（警告） ───
echo "── C. ストーリー内独自コンポーネント定義 ──"
echo ""

echo "  C1. function [A-Z] in stories"
scan_stories '^\s*function\s+[A-Z]' "ストーリー内ヘルパーは小文字 / アロー関数で" WARN

echo ""

# ─── 結果 ───
echo "─────────────────────────────────────────"
if [ "$ERRORS" -gt 0 ]; then
  echo -e "${RED}✗ エラー: ${ERRORS} 件${NC}  ${YELLOW}警告: ${WARNINGS} 件${NC}"
  exit 1
elif [ "$WARNINGS" -gt 0 ]; then
  echo -e "${YELLOW}⚠ 警告: ${WARNINGS} 件${NC}（CI は通過）"
  exit 0
else
  echo -e "${GREEN}✓ 問題なし${NC}"
  exit 0
fi
