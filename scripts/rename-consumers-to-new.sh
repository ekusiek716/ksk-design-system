#!/bin/bash
# =============================================================
# KSK Design System — 消費リポを新名 (ksk-design-system) に一斉移行
#
# 使い方: bash scripts/rename-consumers-to-new.sh <version>
#   例:   bash scripts/rename-consumers-to-new.sh 1.35.0
#
# 前提:
#   - DS リポ直下に新名 tgz (ksk-design-system-<v>.tgz) が存在
#   - okuno-todo-suite/packages/todo-shared/okuno-todo-shared-0.2.0.tgz が存在
#   - 各消費リポに chore/bump-ds-<version> ブランチが既にある（release.sh の bump-consumers で作成済）
#
# 各リポでやること:
#   1. chore/bump-ds-<version> をチェックアウト
#   2. vendor/ksk-design-system-<v>.tgz を新名版で上書き
#   3. (belle, trip) okuno-todo-shared-0.2.0.tgz を vendor に追加
#   4. package.json で @ksk/design-system → ksk-design-system にキー切替
#      (belle は @ksk/design-system キー削除して新名のみ残す)
#   5. (belle, trip) okuno-todo-shared を 0.1.0 → 0.2.0 に
#   6. npm install で lock 更新
#   7. commit & push（既存PRに追加コミット）
# =============================================================

set -uo pipefail

VERSION="${1:?usage: rename-consumers-to-new.sh <version>}"
DS_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TGZ_NEW="$DS_ROOT/ksk-design-system-${VERSION}.tgz"
TODO_SHARED_TGZ="$HOME/LocalDev/okuno-todo-suite/packages/todo-shared/okuno-todo-shared-0.2.0.tgz"

[ -f "$TGZ_NEW" ] || { echo "✗ $TGZ_NEW がない"; exit 1; }
[ -f "$TODO_SHARED_TGZ" ] || { echo "✗ $TODO_SHARED_TGZ がない"; exit 1; }

REPOS=(belle-todo trip_todo ninshin-todo yokoku-app pawly)

GREEN='\033[0;32m'; RED='\033[0;31m'; CYAN='\033[0;36m'; YELLOW='\033[0;33m'; NC='\033[0m'
RESULTS=()

# todo-shared を使うリポ
uses_todo_shared() { [ "$1" = "belle-todo" ] || [ "$1" = "trip_todo" ]; }

# belle-todo はもう新名キー持っているので削除のみ。他は @ksk/design-system → ksk-design-system に rename
is_belle() { [ "$1" = "belle-todo" ]; }

for name in "${REPOS[@]}"; do
  repo="$HOME/LocalDev/$name"
  echo ""
  echo -e "${CYAN}=== $name ===${NC}"

  if [ ! -d "$repo/.git" ]; then
    RESULTS+=("$name: SKIP (git リポなし)")
    continue
  fi
  cd "$repo" || { RESULTS+=("$name: FAIL (cd)"); continue; }

  orig_branch="$(git branch --show-current)"
  stashed=0
  if [ -n "$(git status --porcelain)" ]; then
    git stash push -u -m "rename-consumers $VERSION 一時退避" >/dev/null && stashed=1
  fi

  restore() {
    git checkout "$orig_branch" >/dev/null 2>&1
    [ "$stashed" -eq 1 ] && git stash pop >/dev/null 2>&1
  }

  BRANCH="chore/bump-ds-$VERSION"
  if ! git checkout "$BRANCH" >/dev/null 2>&1; then
    echo -e "${RED}FAIL: $BRANCH ブランチがない${NC}"
    restore
    RESULTS+=("$name: FAIL (branch missing)")
    continue
  fi
  git pull --ff-only >/dev/null 2>&1 || true

  # ── vendor の DS tgz を新名版で上書き ──
  cp "$TGZ_NEW" "vendor/ksk-design-system-${VERSION}.tgz"
  echo "→ vendor/ksk-design-system-${VERSION}.tgz を新名版に置換"

  # ── (belle, trip) todo-shared 0.2.0 を追加 ──
  if uses_todo_shared "$name"; then
    cp "$TODO_SHARED_TGZ" vendor/
    echo "→ vendor/okuno-todo-shared-0.2.0.tgz 追加"
  fi

  # ── package.json: 旧名キー処理 ──
  if is_belle "$name"; then
    # @ksk/design-system 行を削除
    # 例: "@ksk/design-system": "file:./vendor/ksk-design-system-legacy-1.35.0.tgz",
    sed -i '' -E '/\"@ksk\/design-system\":/d' package.json
    echo "→ @ksk/design-system キー削除"
  else
    # @ksk/design-system → ksk-design-system にキー rename
    sed -i '' -E 's|"@ksk/design-system":|"ksk-design-system":|' package.json
    echo "→ @ksk/design-system キーを ksk-design-system に rename"
  fi

  # ── package.json: todo-shared を 0.2.0 に ──
  if uses_todo_shared "$name"; then
    sed -i '' -E 's|okuno-todo-shared-0\.1\.0\.tgz|okuno-todo-shared-0.2.0.tgz|g' package.json
    echo "→ todo-shared を 0.2.0 に"
  fi

  # ── npm install で lock 更新 ──
  echo "→ npm install"
  if ! npm install --no-audit --no-fund >/dev/null 2>&1; then
    echo -e "${RED}FAIL: npm install${NC}"
    restore
    RESULTS+=("$name: FAIL (npm install)")
    continue
  fi

  # ── 変更分を add ──
  git add package.json package-lock.json "vendor/ksk-design-system-${VERSION}.tgz"
  if uses_todo_shared "$name"; then
    git add "vendor/okuno-todo-shared-0.2.0.tgz"
  fi

  if git diff --staged --quiet; then
    echo -e "${YELLOW}→ 変更なし (既に適用済?)${NC}"
    restore
    RESULTS+=("$name: SKIP (no-op)")
    continue
  fi

  git commit -m "chore: ksk-design-system を新名へ移行 (@ksk/design-system → ksk-design-system)" >/dev/null

  if ! git push >/dev/null 2>&1; then
    echo -e "${RED}FAIL: push${NC}"
    restore
    RESULTS+=("$name: FAIL (push)")
    continue
  fi

  restore
  RESULTS+=("$name: OK")
  echo -e "${GREEN}OK${NC}"
done

echo ""
echo "======================================="
for r in "${RESULTS[@]}"; do echo "$r"; done
