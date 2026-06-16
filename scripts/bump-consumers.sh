#!/bin/bash
# =============================================================
# KSK Design System — 消費リポへの版上げ配布スクリプト
#
# 使い方: bash scripts/bump-consumers.sh <version> [repo-name...]
#   例:   bash scripts/bump-consumers.sh 1.30.3
#         bash scripts/bump-consumers.sh 1.30.3 belle-todo pawly
#
# 前提: DS リポ直下に ksk-design-system-<version>.tgz が生成済み（npm pack）
#
# 各消費リポ（~/LocalDev/<name>）で:
#   1. dirty なら git stash -u で退避
#   2. main を checkout / pull
#   3. chore/bump-ds-<version> ブランチを作成
#   4. tgz を vendor/ へコピー（過去版は残す運用）
#   5. package.json の file: 参照を新版に書換（sed で該当行のみ）
#   6. npm install（package-lock 更新）
#   7. commit / push / gh pr create
#   8. 元ブランチへ戻し stash pop
# 失敗したリポはスキップして最後にまとめて報告する。
# =============================================================

set -uo pipefail

VERSION="${1:?usage: bump-consumers.sh <version> [repos...]}"
shift || true
REPOS=("$@")
[ ${#REPOS[@]} -eq 0 ] && REPOS=(belle-todo trip_todo ninshin-todo yokoku-app pawly)

DS_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TGZ="$DS_ROOT/ksk-design-system-$VERSION.tgz"
if [ ! -f "$TGZ" ]; then
  echo "ERROR: $TGZ がありません。先に npm pack を実行してください。"
  exit 1
fi

GREEN='\033[0;32m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
RESULTS=()

for name in "${REPOS[@]}"; do
  repo="$HOME/LocalDev/$name"
  echo ""
  echo -e "${CYAN}=== $name ===${NC}"

  if [ ! -d "$repo/.git" ]; then
    RESULTS+=("$name: SKIP (git リポジトリでない)")
    continue
  fi
  cd "$repo" || { RESULTS+=("$name: FAIL (cd)"); continue; }

  orig_branch="$(git branch --show-current)"
  stashed=0
  if [ -n "$(git status --porcelain)" ]; then
    git stash push -u -m "bump-ds-$VERSION 一時退避" >/dev/null && stashed=1
    echo "dirty だったため stash 退避 (元ブランチ: $orig_branch)"
  fi

  restore() {
    git checkout "$orig_branch" >/dev/null 2>&1
    [ "$stashed" -eq 1 ] && git stash pop >/dev/null 2>&1
  }

  if ! git checkout main >/dev/null 2>&1 || ! git pull --ff-only >/dev/null 2>&1; then
    echo -e "${RED}FAIL: main の checkout / pull${NC}"
    restore
    RESULTS+=("$name: FAIL (main checkout/pull)")
    continue
  fi

  git checkout -B "chore/bump-ds-$VERSION" >/dev/null 2>&1

  mkdir -p vendor
  cp "$TGZ" vendor/

  # package.json の tgz 参照だけを書換（ファイル全体は再フォーマットしない）
  sed -i '' -E "s|(ksk-design-system-)[0-9]+\.[0-9]+\.[0-9]+(\.tgz)|\1${VERSION}\2|" package.json
  if ! grep -q "ksk-design-system-$VERSION.tgz" package.json; then
    echo -e "${RED}FAIL: package.json の参照書換${NC}"
    restore
    RESULTS+=("$name: FAIL (package.json 書換)")
    continue
  fi

  if ! npm install --no-audit --no-fund >/dev/null 2>&1; then
    echo -e "${RED}FAIL: npm install${NC}"
    restore
    RESULTS+=("$name: FAIL (npm install)")
    continue
  fi

  git add "vendor/ksk-design-system-$VERSION.tgz" package.json package-lock.json
  git commit -m "chore: ksk-design-system を v$VERSION に更新" >/dev/null

  if ! git push -u origin "chore/bump-ds-$VERSION" >/dev/null 2>&1; then
    echo -e "${RED}FAIL: push${NC}"
    restore
    RESULTS+=("$name: FAIL (push)")
    continue
  fi

  pr_url="$(gh pr create \
    --title "chore: ksk-design-system v$VERSION" \
    --body "DS を v$VERSION に更新（vendor tgz 差し替え + npm install）。変更内容は DS 側リリースノート参照。" \
    2>/dev/null | tail -1)"

  restore
  RESULTS+=("$name: OK ${pr_url:-（PR作成失敗・branchはpush済）}")
  echo -e "${GREEN}OK${NC} ${pr_url:-}"
done

echo ""
echo "======================================="
for r in "${RESULTS[@]}"; do echo "$r"; done
