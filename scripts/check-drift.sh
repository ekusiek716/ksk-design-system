#!/bin/bash
# =============================================================
# KSK Design System — ドリフト検出スクリプト
#
# contracts/components.json に記録されたコンポーネント数と
# 実際のソースファイル数を比較し、乖離を検出する。
#
# 実行: bash scripts/check-drift.sh
# =============================================================

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONTRACTS="$ROOT/contracts/components.json"
SRC="$ROOT/src/components"

RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

ERRORS=0

error() {
  echo -e "${RED}[DRIFT]${NC} $1"
  ERRORS=$((ERRORS + 1))
}

ok() {
  echo -e "${GREEN}[OK]${NC}    $1"
}

info() {
  echo -e "${CYAN}[INFO]${NC}  $1"
}

echo "🔍 KSK Design System — ドリフト検出"
echo "======================================="

# contracts/components.json が存在するか確認
if [ ! -f "$CONTRACTS" ]; then
  error "contracts/components.json が見つかりません"
  exit 1
fi

# jq が使えるか確認
if ! command -v jq &> /dev/null; then
  echo -e "${YELLOW}[WARN]${NC}  jq が未インストールのため数値検証をスキップします"
  echo "       brew install jq で導入してください"
  SKIP_JSON=true
else
  SKIP_JSON=false
fi

# ─── 実ファイル数をカウント ───
count_components() {
  local dir="$1"
  # .stories.tsx と index.ts を除いた .tsx ファイル数
  find "$dir" -maxdepth 1 -name "*.tsx" ! -name "*.stories.tsx" 2>/dev/null | wc -l | tr -d ' '
}

ACTUAL_UI=$(count_components "$SRC/ui")
ACTUAL_PATTERNS=$(find "$SRC/patterns" -maxdepth 1 -name "*.tsx" ! -name "*.stories.tsx" 2>/dev/null | wc -l | tr -d ' ')
ACTUAL_COMMERCE=$(count_components "$SRC/patterns/commerce")
ACTUAL_ADMIN=$(count_components "$SRC/patterns/admin")
ACTUAL_SHELLS=$(count_components "$SRC/patterns/shells")
ACTUAL_TOTAL=$((ACTUAL_UI + ACTUAL_PATTERNS + ACTUAL_COMMERCE + ACTUAL_ADMIN + ACTUAL_SHELLS))

info "実ファイル数: UI=$ACTUAL_UI / Patterns=$ACTUAL_PATTERNS / Commerce=$ACTUAL_COMMERCE / Admin=$ACTUAL_ADMIN / Shells=$ACTUAL_SHELLS / Total=$ACTUAL_TOTAL"

# ─── contracts の数値と比較 ───
if [ "$SKIP_JSON" = false ]; then
  CONTRACT_UI=$(jq '.meta.counts.ui' "$CONTRACTS")
  CONTRACT_PATTERNS=$(jq '.meta.counts.patterns' "$CONTRACTS")
  CONTRACT_COMMERCE=$(jq '.meta.counts.commerce' "$CONTRACTS")
  CONTRACT_ADMIN=$(jq '.meta.counts.admin' "$CONTRACTS")
  CONTRACT_SHELLS=$(jq '.meta.counts.shells' "$CONTRACTS")
  CONTRACT_TOTAL=$(jq '.meta.counts.total' "$CONTRACTS")

  info "contracts 定義数: UI=$CONTRACT_UI / Patterns=$CONTRACT_PATTERNS / Commerce=$CONTRACT_COMMERCE / Admin=$CONTRACT_ADMIN / Shells=$CONTRACT_SHELLS / Total=$CONTRACT_TOTAL"
  echo ""

  check_count() {
    local label="$1"
    local actual="$2"
    local expected="$3"
    if [ "$actual" -ne "$expected" ]; then
      error "$label: 実ファイル $actual 個 ≠ contracts定義 $expected 個 → contracts/components.json の counts を更新してください"
    else
      ok "$label: $actual 個 ✓"
    fi
  }

  check_count "UI"       "$ACTUAL_UI"       "$CONTRACT_UI"
  check_count "Patterns" "$ACTUAL_PATTERNS"  "$CONTRACT_PATTERNS"
  check_count "Commerce" "$ACTUAL_COMMERCE"  "$CONTRACT_COMMERCE"
  check_count "Admin"    "$ACTUAL_ADMIN"     "$CONTRACT_ADMIN"
  check_count "Shells"   "$ACTUAL_SHELLS"    "$CONTRACT_SHELLS"
  check_count "Total"    "$ACTUAL_TOTAL"     "$CONTRACT_TOTAL"
fi

# ─── index.ts との整合性チェック ───
echo ""
echo "─── index.ts エクスポート整合性 ───"

INDEX="$ROOT/src/index.ts"
if [ -f "$INDEX" ]; then
  EXPORT_COUNT=$(grep -c '^export' "$INDEX" || true)
  info "index.ts エクスポート数: $EXPORT_COUNT 行"
  if [ "$EXPORT_COUNT" -lt 50 ]; then
    error "index.ts のエクスポートが少なすぎます（期待: 50以上）"
  else
    ok "index.ts エクスポート数 OK ($EXPORT_COUNT 行)"
  fi
else
  error "src/index.ts が見つかりません"
fi

# ─── contracts に定義されたパスが実在するか ───
echo ""
echo "─── contracts パス実在チェック ───"

if [ "$SKIP_JSON" = false ]; then
  MISSING=0
  # 全カテゴリのパスを一括取得
  ALL_PATHS=$(jq -r '(.ui[], .patterns[], .commerce[], .admin[], .shells[]) | .path' "$CONTRACTS")
  while IFS= read -r path; do
    full_path="$ROOT/$path"
    if [ ! -f "$full_path" ]; then
      error "ファイルが存在しません: $path"
      MISSING=$((MISSING + 1))
    fi
  done <<< "$ALL_PATHS"

  if [ "$MISSING" -eq 0 ]; then
    ok "全 contracts パスが実在します"
  fi
fi

# ─── 結果 ───
echo ""
echo "======================================="
if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}✗ ドリフト検出: $ERRORS 件${NC}"
  echo "  contracts/components.json を実態に合わせて更新してください"
  exit 1
else
  echo -e "${GREEN}✓ ドリフトなし — contracts と実コードが一致しています${NC}"
  exit 0
fi
