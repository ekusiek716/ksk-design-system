#!/bin/bash
# =============================================================
# KSK Design System — 消費リポを npm registry 経由に更新
#
# 使い方: bash scripts/update-consumers.sh <version> [repo-name...]
#   例:   bash scripts/update-consumers.sh 1.36.0
#         bash scripts/update-consumers.sh 1.36.0 belle-todo
#
# 前提: ksk-design-system@<version> が npm registry に publish 済み
#
# 各消費リポで:
#   1. dirty なら git stash で退避
#   2. main を pull
#   3. chore/bump-ds-<version> ブランチ作成
#   4. package.json の "ksk-design-system" の value を
#        "file:./vendor/...tgz" → "^<version>" に書き換え
#      （初回の vendor→npm 切替の場合）
#      または既に semver の場合は version を bump
#   5. 既存の vendor/ksk-design-system-*.tgz を全削除（履歴は git history で）
#   6. npm install で lock 更新（registry から取得）
#   7. commit / push / gh pr create
# =============================================================

set -uo pipefail

VERSION="${1:?usage: update-consumers.sh <version> [repos...]}"
shift || true
REPOS=("$@")
[ ${#REPOS[@]} -eq 0 ] && REPOS=(belle-todo trip_todo ninshin-todo yokoku-app pawly)

GREEN='\033[0;32m'; RED='\033[0;31m'; CYAN='\033[0;36m'; YELLOW='\033[0;33m'; NC='\033[0m'
RESULTS=()

for name in "${REPOS[@]}"; do
  repo="$HOME/LocalDev/$name"
  echo ""
  echo -e "${CYAN}=== $name ===${NC}"

  if [ ! -d "$repo/.git" ]; then
    RESULTS+=("$name: SKIP (no git)")
    continue
  fi
  cd "$repo" || { RESULTS+=("$name: FAIL (cd)"); continue; }

  orig_branch="$(git branch --show-current)"
  stashed=0
  if [ -n "$(git status --porcelain)" ]; then
    git stash push -u -m "update-consumers $VERSION 一時退避" >/dev/null && stashed=1
    echo "dirty だったため stash 退避"
  fi

  restore() {
    git checkout "$orig_branch" >/dev/null 2>&1
    [ "$stashed" -eq 1 ] && git stash pop >/dev/null 2>&1
  }

  if ! git checkout main >/dev/null 2>&1 || ! git pull --ff-only >/dev/null 2>&1; then
    echo -e "${RED}FAIL: main の checkout / pull${NC}"
    restore
    RESULTS+=("$name: FAIL (main)")
    continue
  fi

  git checkout -B "chore/bump-ds-$VERSION" >/dev/null 2>&1

  # ── package.json の "ksk-design-system" を npm registry 参照に切替 ──
  # 旧キー: "@ksk/design-system" or "ksk-design-system" (file:./vendor/...)
  # 新:    "ksk-design-system": "^<version>"
  # 旧名 @ksk/design-system が残ってたら同時に rename する
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    let changed = false;
    for (const k of ['dependencies', 'devDependencies', 'peerDependencies']) {
      if (!pkg[k]) continue;
      // 旧名キー (@ksk/design-system) は削除して新名キーに統合
      if (pkg[k]['@ksk/design-system']) {
        delete pkg[k]['@ksk/design-system'];
        pkg[k]['ksk-design-system'] = '^${VERSION}';
        changed = true;
      } else if (pkg[k]['ksk-design-system']) {
        pkg[k]['ksk-design-system'] = '^${VERSION}';
        changed = true;
      }
    }
    if (!changed) {
      console.error('FAIL: ksk-design-system 依存が見つからない');
      process.exit(1);
    }
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  " 2>&1
  if [ $? -ne 0 ]; then
    restore
    RESULTS+=("$name: FAIL (deps)")
    continue
  fi

  # ── vendor 配下の ksk-design-system-*.tgz を全削除 ──
  # 履歴は git で追えるので過去版を残す必要なし
  REMOVED=$(find vendor -maxdepth 1 -name 'ksk-design-system-*.tgz' 2>/dev/null | wc -l | tr -d ' ')
  if [ "$REMOVED" -gt 0 ]; then
    find vendor -maxdepth 1 -name 'ksk-design-system-*.tgz' -exec git rm -f {} \; >/dev/null 2>&1
    echo "→ $REMOVED 個の vendor/ksk-design-system-*.tgz を削除"
  fi

  # ── npm install で registry から取得 ──
  echo "→ npm install (npm registry から取得)"
  if ! npm install --no-audit --no-fund >/dev/null 2>&1; then
    echo -e "${RED}FAIL: npm install${NC}"
    restore
    RESULTS+=("$name: FAIL (npm install)")
    continue
  fi

  # ── インストール検証 ──
  INSTALLED="$(node -p "require('./node_modules/ksk-design-system/package.json').version" 2>/dev/null)"
  if [ "$INSTALLED" != "$VERSION" ]; then
    echo -e "${RED}FAIL: 期待 $VERSION / 実際 $INSTALLED${NC}"
    restore
    RESULTS+=("$name: FAIL (version mismatch: $INSTALLED)")
    continue
  fi
  echo "→ ksk-design-system@$INSTALLED 取得確認"

  git add package.json package-lock.json
  if git diff --staged --quiet; then
    echo -e "${YELLOW}→ 変更なし${NC}"
    restore
    RESULTS+=("$name: SKIP (no-op)")
    continue
  fi

  git commit -m "chore: ksk-design-system を v$VERSION に更新（npm registry 経由）

vendor/*.tgz 方式から npm install 方式へ移行。
- package.json: file:./vendor/... → ^$VERSION
- vendor/ksk-design-system-*.tgz は削除（過去版は git history で追える）" >/dev/null

  if ! git push -u origin "chore/bump-ds-$VERSION" >/dev/null 2>&1; then
    echo -e "${RED}FAIL: push${NC}"
    restore
    RESULTS+=("$name: FAIL (push)")
    continue
  fi

  pr_body_file="$(mktemp)"
  cat > "$pr_body_file" <<EOF
DS を v$VERSION に更新し、vendor tgz 方式から npm registry 経由に切替。

## 変更
- \`package.json\`: \`file:./vendor/ksk-design-system-X.Y.Z.tgz\` → \`^$VERSION\`
- \`vendor/ksk-design-system-*.tgz\` を削除（過去版は git history で復元可能）
- \`package-lock.json\` は npm registry のメタ情報で更新

## メリット
- 配布が npm 標準フローに統一（dependabot / renovate も使える）
- リポサイズが軽くなる
- ロールバックは \`npm install ksk-design-system@<旧バージョン>\` で可能

詳細は DS リポのリリースノート参照。
EOF

  pr_url="$(gh pr create \
    --title "chore: ksk-design-system v$VERSION（npm registry へ移行）" \
    --body-file "$pr_body_file" \
    2>/dev/null | tail -1)"
  rm -f "$pr_body_file"

  restore
  RESULTS+=("$name: OK ${pr_url:-（PR作成失敗・branch は push 済）}")
  echo -e "${GREEN}OK${NC} ${pr_url:-}"
done

echo ""
echo "======================================="
for r in "${RESULTS[@]}"; do echo "$r"; done
