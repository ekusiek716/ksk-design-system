#!/bin/bash
# =============================================================
# KSK Design System — 消費リポのソース内 import を新名へ一斉変換
#
# 使い方: bash scripts/rename-imports-in-consumers.sh [version]
#   version 指定があれば PR ブランチ chore/bump-ds-<version> 上で実施
#   省略時は現在のブランチで実施
#
# 対象: 各リポ src/ 配下の `from "@ksk/design-system"` を
#       `from "ksk-design-system"` に置換
# =============================================================

set -uo pipefail

VERSION="${1:-}"
REPOS=(belle-todo trip_todo ninshin-todo yokoku-app pawly)

GREEN='\033[0;32m'; RED='\033[0;31m'; CYAN='\033[0;36m'; YELLOW='\033[0;33m'; NC='\033[0m'
RESULTS=()

for name in "${REPOS[@]}"; do
  repo="$HOME/LocalDev/$name"
  echo ""
  echo -e "${CYAN}=== $name ===${NC}"

  if [ ! -d "$repo/.git" ]; then
    RESULTS+=("$name: SKIP")
    continue
  fi
  cd "$repo" || { RESULTS+=("$name: FAIL (cd)"); continue; }

  orig_branch="$(git branch --show-current)"
  stashed=0
  if [ -n "$(git status --porcelain)" ]; then
    git stash push -u -m "rename-imports 一時退避" >/dev/null && stashed=1
  fi

  restore() {
    git checkout "$orig_branch" >/dev/null 2>&1
    [ "$stashed" -eq 1 ] && git stash pop >/dev/null 2>&1
  }

  if [ -n "$VERSION" ]; then
    BRANCH="chore/bump-ds-$VERSION"
    if ! git checkout "$BRANCH" >/dev/null 2>&1; then
      RESULTS+=("$name: FAIL (branch missing)")
      restore
      continue
    fi
    git pull --ff-only >/dev/null 2>&1 || true
  fi

  # ── grep して該当ファイルを sed 置換 ──
  # Next.js でよく使う場所を網羅: src/ app/ components/ lib/ pages/ hooks/ utils/ types/
  SEARCH_DIRS=""
  for d in src app components lib pages hooks utils types; do
    [ -d "$d" ] && SEARCH_DIRS="$SEARCH_DIRS $d"
  done

  if [ -z "$SEARCH_DIRS" ]; then
    RESULTS+=("$name: SKIP (no source dirs)")
    restore
    continue
  fi

  HITS=$(grep -rl '@ksk/design-system' $SEARCH_DIRS 2>/dev/null | grep -v node_modules || true)
  if [ -z "$HITS" ]; then
    echo "→ 該当 import なし"
    restore
    RESULTS+=("$name: SKIP (no imports)")
    continue
  fi

  echo "$HITS" | while read f; do
    [ -f "$f" ] || continue
    sed -i '' 's|@ksk/design-system|ksk-design-system|g' "$f"
    echo "  $f"
  done

  if git diff --quiet; then
    echo -e "${YELLOW}→ 変更なし${NC}"
    restore
    RESULTS+=("$name: SKIP (no-op)")
    continue
  fi

  git add -u
  git commit -m "chore: import を ksk-design-system 新名へ統一" >/dev/null

  if ! git push >/dev/null 2>&1; then
    RESULTS+=("$name: FAIL (push)")
    restore
    continue
  fi

  RESULTS+=("$name: OK")
  echo -e "${GREEN}OK${NC}"
  restore
done

echo ""
echo "======================================="
for r in "${RESULTS[@]}"; do echo "$r"; done
