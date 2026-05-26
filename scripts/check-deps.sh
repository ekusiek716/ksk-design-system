#!/bin/bash
# =============================================================
# KSK Design System — 依存方向 Lint
#
# 3-tier 構造の依存ルールを強制する:
#
#   patterns/{commerce,admin,shells}/ ← 業務特化 / レイアウト（最上位）
#     ↓
#   patterns/                          ← 業界汎用パターン
#     ↓
#   ui/                                ← shadcn ベース汎用 UI（最下位）
#
# 違反パターン:
#   - ui/ から patterns/* を import
#   - patterns/ から patterns/{commerce,admin,shells} を import
#
# .stories.tsx と .test.{ts,tsx} は除外（リアル UI 寄りストーリーで
# 上位層を import するのは許可）。
#
# 実行: bash scripts/check-deps.sh
# =============================================================

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/src/components"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

ERRORS=0

violation() {
  echo -e "${RED}[VIOLATION]${NC} $1"
  ERRORS=$((ERRORS + 1))
}

ok() {
  echo -e "${GREEN}[OK]${NC}    $1"
}

info() {
  echo -e "${CYAN}[INFO]${NC}  $1"
}

echo "🔒 KSK Design System — 依存方向 Lint"
echo "========================================="

# ─── ルール 1: ui/ から patterns/* import を禁止 ───
# ui/ は最下位層。patterns に依存してはいけない。
echo ""
echo "── ルール 1: ui/ → patterns/* import の検出 ──"

UI_VIOLATIONS=$(
  grep -rn "from [\"']@/components/patterns" "$SRC/ui" \
    --include="*.tsx" --include="*.ts" 2>/dev/null \
    | grep -v "\.stories\.tsx" \
    | grep -v "\.test\.tsx" \
    | grep -v "\.test\.ts" \
    || true
)

if [ -n "$UI_VIOLATIONS" ]; then
  while IFS= read -r line; do
    violation "$line"
  done <<< "$UI_VIOLATIONS"
else
  ok "ui/ から patterns/ への import なし"
fi

# ─── ルール 2: 汎用 patterns/ から patterns/{commerce,admin,shells}/ import を禁止 ───
# 汎用 patterns は業務特化サブディレクトリに依存してはいけない。
# 対象: src/components/patterns/ 直下の *.tsx / *.ts のみ（サブディレクトリは除外）
echo ""
echo "── ルール 2: patterns/ → patterns/{commerce,admin,shells}/ import の検出 ──"

PATTERNS_VIOLATIONS=$(
  find "$SRC/patterns" -maxdepth 1 -type f \( -name "*.tsx" -o -name "*.ts" \) 2>/dev/null \
    | grep -v "\.stories\.tsx" \
    | grep -v "\.test\.tsx" \
    | grep -v "\.test\.ts" \
    | xargs grep -n "from [\"']@/components/patterns/\(commerce\|admin\|shells\)/" 2>/dev/null \
    || true
)

if [ -n "$PATTERNS_VIOLATIONS" ]; then
  while IFS= read -r line; do
    violation "$line"
  done <<< "$PATTERNS_VIOLATIONS"
else
  ok "patterns/ から patterns/{commerce,admin,shells}/ への import なし"
fi

# ─── ルール 3: relative import での他層参照の検出 ───
# 例: src/components/ui/foo.tsx で `from "../patterns/bar"`
echo ""
echo "── ルール 3: relative import での他層参照の検出 ──"

RELATIVE_VIOLATIONS=$(
  {
    grep -rn "from [\"']\.\./patterns" "$SRC/ui" --include="*.tsx" --include="*.ts" 2>/dev/null
    find "$SRC/patterns" -maxdepth 1 -type f \( -name "*.tsx" -o -name "*.ts" \) 2>/dev/null \
      | xargs grep -n "from [\"']\.\./\(commerce\|admin\|shells\)" 2>/dev/null
    grep -rn "from [\"']\.\./\.\./patterns" "$SRC/ui" --include="*.tsx" --include="*.ts" 2>/dev/null
  } | grep -v "\.stories\.tsx" \
    | grep -v "\.test\.tsx" \
    | grep -v "\.test\.ts" \
    || true
)

if [ -n "$RELATIVE_VIOLATIONS" ]; then
  while IFS= read -r line; do
    violation "$line"
  done <<< "$RELATIVE_VIOLATIONS"
else
  ok "relative import での違反なし"
fi

# ─── 結果 ───
echo ""
echo "========================================="
if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}✗ 依存方向違反: $ERRORS 件${NC}"
  echo ""
  echo "  3-tier 構造の依存ルール:"
  echo "    ui/                                → 他層に依存しない"
  echo "    patterns/                          → ui/ のみ参照可"
  echo "    patterns/{commerce,admin,shells}/  → ui/ と patterns/ を参照可"
  echo ""
  echo "  違反箇所を修正してください。"
  exit 1
else
  echo -e "${GREEN}✓ 依存方向違反なし${NC}"
  exit 0
fi
