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
TGZ_NEW="$DS_ROOT/ksk-design-system-$VERSION.tgz"
TGZ_LEGACY="$DS_ROOT/ksk-design-system-legacy-$VERSION.tgz"
if [ ! -f "$TGZ_NEW" ]; then
  echo "ERROR: $TGZ_NEW がありません。先に npm pack または scripts/release.sh を実行してください。"
  exit 1
fi
if [ ! -f "$TGZ_LEGACY" ]; then
  echo "ERROR: $TGZ_LEGACY がありません。release.sh で legacy 互換 tgz も生成してください。"
  exit 1
fi

# 消費リポ別の依存形態:
#   belle-todo: 新名 + 旧名キーの両方を持つ → 両方の tgz を vendor に置く
#   その他    : 旧名キーのみ → legacy tgz を ksk-design-system-X.Y.Z.tgz のファイル名で配置
is_dual_repo() { [ "$1" = "belle-todo" ]; }

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
  if is_dual_repo "$name"; then
    # belle-todo: 新名 + legacy 両方を vendor に置く
    cp "$TGZ_NEW" vendor/
    cp "$TGZ_LEGACY" vendor/
  else
    # 旧名のみのリポ: legacy tgz を「新名形式のファイル名」で配置（中身は @ksk/design-system）
    cp "$TGZ_LEGACY" "vendor/ksk-design-system-${VERSION}.tgz"
  fi

  # package.json の tgz 参照を書換（ファイル全体は再フォーマットしない）
  # パターン: /ksk-design-system-<x.y.z>.tgz と /ksk-design-system-legacy-<x.y.z>.tgz の両方
  sed -i '' -E "s|/ksk-design-system-legacy-[0-9]+\.[0-9]+\.[0-9]+\.tgz|/ksk-design-system-legacy-${VERSION}.tgz|g" package.json
  sed -i '' -E "s|/ksk-design-system-[0-9]+\.[0-9]+\.[0-9]+\.tgz|/ksk-design-system-${VERSION}.tgz|g" package.json
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

  # 追加された新規 vendor tgz と書換済 package.json/lock を add
  if is_dual_repo "$name"; then
    git add "vendor/ksk-design-system-$VERSION.tgz" "vendor/ksk-design-system-legacy-$VERSION.tgz" package.json package-lock.json
  else
    git add "vendor/ksk-design-system-$VERSION.tgz" package.json package-lock.json
  fi
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
