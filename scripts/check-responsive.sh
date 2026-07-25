#!/bin/bash
# =============================================================
# KSK Design System — レスポンシブ対応チェック
#
# Shell ストーリー (AppShell / AdminShell / MarketingShell) が
# SP/PC 両対応しているかを検出する。
#
# 検出ルール:
#   - container query (@sm: / @md: / @lg: / @xl: / @container) が
#     3 つ未満 → "SP-only?" 警告
#   - @md: を使っているのに @container 宣言なし → "BROKEN"
#
# 既定は助言モード（検出しても exit 0）。「ストーリー本文にレスポンシブ
# クラスが何件書かれているか」を数える grep ベースの発見的検査であり、
# 実際のレスポンシブ品質と一対一ではないため CI を止める根拠には使わない。
# それでも CI から呼ぶのは、走らない検査は存在しないのと同じだから。
# `--strict` を付けると検出時 exit 1（意図的に締める運用に切り替えるとき用）。
#
# 実行: bash scripts/check-responsive.sh [--strict]
# =============================================================

set -euo pipefail

STRICT=0
for arg in "$@"; do
  case "$arg" in
    --strict) STRICT=1 ;;
  esac
done

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SHELLS_DIR="$ROOT/src/components/patterns/shells"

ISSUES=0

echo "╔══════════════════════════════════════════╗"
echo "║   KSK DS — Responsive Check              ║"
echo "╚══════════════════════════════════════════╝"
echo ""

if [ ! -d "$SHELLS_DIR" ]; then
  echo -e "${CYAN}[INFO]${NC} $SHELLS_DIR が無いためスキップ"
  exit 0
fi

# ── Shell ストーリーの SP/PC 両対応チェック ──
for f in "$SHELLS_DIR"/*.stories.tsx; do
  [ -f "$f" ] || continue
  basename=$(basename "$f")

  # grep がノーマッチ時に終了コード1 → pipefail+set -e で誤終了するため `|| true` で吸収
  responsive_count=$(grep -oE '@(sm|md|lg|xl|container)' "$f" 2>/dev/null | wc -l | tr -d ' ' || true)

  if [ "$responsive_count" -lt 3 ]; then
    echo -e "  ${YELLOW}[SP-only?]${NC} $basename — レスポンシブクラス: ${responsive_count}件"
    ISSUES=$((ISSUES + 1))
  fi

  # @md: を使っているのに @container がない → コンテナクエリが効かない
  if grep -q '@md:' "$f" 2>/dev/null && ! grep -q '@container' "$f" 2>/dev/null; then
    echo -e "  ${YELLOW}[BROKEN]${NC} $basename — @md:あり・@container宣言なし"
    ISSUES=$((ISSUES + 1))
  fi
done

# ── commerce 系のグリッド系コンポーネントもチェック ──
COMMERCE_DIR="$ROOT/src/components/patterns/commerce"
if [ -d "$COMMERCE_DIR" ]; then
  for f in "$COMMERCE_DIR"/*.stories.tsx; do
    [ -f "$f" ] || continue
    basename=$(basename "$f")
    # Grid を含むストーリーのみ対象
    if grep -q 'grid-cols' "$f" 2>/dev/null; then
      breakpoints=$(grep -oE '(sm:|md:|lg:|xl:|@sm:|@md:|@lg:|@xl:)' "$f" 2>/dev/null | sort -u | wc -l | tr -d ' ' || true)
      if [ "$breakpoints" -lt 2 ]; then
        echo -e "  ${YELLOW}[GRID-rigid]${NC} $basename — grid-cols あり、breakpoints: ${breakpoints}件"
        ISSUES=$((ISSUES + 1))
      fi
    fi
  done
fi

echo ""

if [ "$ISSUES" -eq 0 ]; then
  echo -e "${GREEN}✓ レスポンシブ問題なし${NC}"
  exit 0
fi

if [ "$STRICT" -eq 1 ]; then
  echo -e "${RED}✗ レスポンシブ警告: ${ISSUES}件（--strict のため失敗）${NC}"
  exit 1
fi

echo -e "${YELLOW}⚠ レスポンシブ警告: ${ISSUES}件${NC}（助言モード / CI は通過。締めるなら --strict）"
exit 0
