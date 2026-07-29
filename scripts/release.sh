#!/bin/bash
# =============================================================
# KSK Design System — リリースワンライナー
#
# 使い方:
#   bash scripts/release.sh patch          # 1.34.1 → 1.34.2
#   bash scripts/release.sh minor          # 1.34.1 → 1.35.0
#   bash scripts/release.sh major          # 1.34.1 → 2.0.0
#   bash scripts/release.sh 1.40.0         # 明示指定
#
# publish 経路の一本化（issue #259）:
#   通常の公開経路は npm Trusted Publishing (OIDC) を使う
#   .github/workflows/publish.yml に一本化した。このスクリプトはもう
#   npm publish をローカルで実行しない（2FA/OTP 対話・二重 publish リスクの解消）。
#
# やること:
#   1. clean & main 確認、npm run check
#   2. npm version <level> --no-git-tag-version（ローカルタグ・コミットは作らない。
#      "version" ライフサイクルで scripts/sync-version.mjs は --no-git-tag-version
#      でも変わらず発火し、contracts/components.json の meta.version・
#      token-hex-cache を同期して git add する）
#   3. npm pack で公開物を検証（publish はしない。中身確認のみ）
#   4. git commit + git push origin main（タグは作らず push もしない）
#      → publish.yml が version 変更を検知して npm publish
#      （Trusted Publishing）・タグ作成・GitHub Release を自動実行
#   5. npm view でレジストリ反映をポーリング確認
#   6. bash scripts/update-consumers.sh <version>（5 リポ自動 PR）
#
# タグ・GitHub Release の作成は publish.yml に完全委任する。ローカルで
# `npm version` の既定動作（ローカルタグ作成 + commit）を使うと、
# `git push --tags` で CI（publish.yml）より先にタグが公開リポジトリに
# 届いてしまい、publish.yml がタグ既存と判定して GitHub Release の
# 作成をスキップしてしまう（issue #269 レビュー指摘）。
#
# publish.yml が失敗 / 動かない場合でも、ローカルから npm publish する経路は
# ない（Trusted Publishing に一本化済み・issue #269 レビュー指摘で整合）。
# break-glass 手順は「publish.yml を workflow_dispatch で再実行する」のみ:
#   gh workflow run publish.yml --ref main
# 詳細は PUBLISHING.md の「緊急時（publish.yml が失敗した場合）」を参照。
# =============================================================

set -euo pipefail

LEVEL_OR_VERSION="${1:?usage: release.sh patch|minor|major|<x.y.z>}"

GREEN='\033[0;32m'; RED='\033[0;31m'; CYAN='\033[0;36m'; YELLOW='\033[0;33m'; NC='\033[0m'

# ── 事前チェック ─────────────────────────
if ! git diff --quiet HEAD 2>/dev/null; then
  echo -e "${RED}✗ uncommitted changes があります。先にコミットしてください。${NC}"
  git status --short
  exit 1
fi
if [ "$(git branch --show-current)" != "main" ]; then
  echo -e "${RED}✗ main ブランチではありません (現在: $(git branch --show-current))。${NC}"
  exit 1
fi

# 曜日チェック（金曜・休前日のリリースは禁止 — RELEASE.md に従う）
DOW="$(date +%u)"  # 1=月 .. 7=日
if [ "$DOW" = "5" ]; then
  echo -e "${YELLOW}⚠️  今日は金曜です。週末に障害対応できない場合はリリース禁止 (RELEASE.md)。${NC}"
  read -p "それでも続けますか? (yes/no): " ans
  [ "$ans" = "yes" ] || { echo "中止"; exit 1; }
fi

echo -e "${CYAN}→ npm run check${NC}"
npm run check

# ── version bump（ローカルタグ・コミットは作らない。タグ/Release は publish.yml に委任） ──
echo -e "${CYAN}→ npm version $LEVEL_OR_VERSION --no-git-tag-version${NC}"
npm version "$LEVEL_OR_VERSION" --no-git-tag-version
VERSION="$(node -p "require('./package.json').version")"
echo -e "${GREEN}✓ new version: $VERSION${NC}"

# --no-git-tag-version は package.json の commit を作らないため、
# scripts/sync-version.mjs が git add した変更（package.json 含む）を
# ここで明示的にコミットする。
echo -e "${CYAN}→ git commit${NC}"
git add package.json package-lock.json 2>/dev/null || true
git commit -m "chore(release): v$VERSION"

# ── tgz 生成 ─────────────────────────
# v1.35.0 で消費リポすべて新名 (ksk-design-system) に移行済のため、
# 旧名 (@ksk/design-system) 互換 tgz の生成は廃止。
# 旧名復活が必要になった場合は git history で v1.35.0 期の release.sh を参照。
echo -e "${CYAN}→ npm pack${NC}"
npm pack
NEW_TGZ="ksk-design-system-${VERSION}.tgz"
if [ ! -f "$NEW_TGZ" ]; then
  echo -e "${RED}✗ tgz が生成されませんでした${NC}"
  exit 1
fi
echo -e "${GREEN}✓ $NEW_TGZ${NC}"

# 中身検証
EXTRACT_DIR="$(mktemp -d)"
tar xzf "$NEW_TGZ" -C "$EXTRACT_DIR" package/package.json
ACTUAL_NEW="$(node -p "require('$EXTRACT_DIR/package/package.json').name")"
rm -rf "$EXTRACT_DIR"
[ "$ACTUAL_NEW" = "ksk-design-system" ] || {
  echo -e "${RED}✗ tgz の name が想定外: $ACTUAL_NEW${NC}"
  exit 1
}
echo -e "${GREEN}✓ 中身検証 OK${NC}"
rm -f "$NEW_TGZ"

# ── push（タグは作らない・push しない。publish/タグ/Release は publish.yml に一本化） ──
# ローカルから npm publish もタグ作成もしない。push した package.json の version
# 変更を .github/workflows/publish.yml が検知し、npm 上の最新版と比較した上で
# npm publish（OIDC）・`vX.Y.Z` タグ・GitHub Release を CI 側で実行する。
# ここでローカルタグを push すると、CI より先にタグが公開されて publish.yml が
# 「タグ既存」と判定し GitHub Release 作成をスキップしてしまうため、意図的に
# `--tags` を付けない。
echo -e "${CYAN}→ git push origin main${NC}"
git push origin main
PUSHED_SHA="$(git rev-parse HEAD)"

# ── publish.yml の実行を確認 ─────────────────────────
# gh run list はブランチ指定のみだと「main の最新 run」を返す。GitHub Actions が
# 今回の push をまだインデックスしていないタイミングだと、直前の（無関係な）
# publish run を掴んで「成功」と誤判定しかねない（review 指摘 issue #269）。
# 今回 push した commit SHA (`--commit`) で run が現れるまでポーリングしてから
# watch することで、確実に今回の push に紐づく run を待つ。
echo -e "${CYAN}→ publish.yml の実行状況を確認（commit: ${PUSHED_SHA:0:7}）${NC}"
if command -v gh >/dev/null 2>&1; then
  RUN_ID=""
  for i in $(seq 1 20); do
    RUN_ID="$(gh run list --workflow=publish.yml --commit "$PUSHED_SHA" --limit=1 --json databaseId --jq '.[0].databaseId' 2>/dev/null || true)"
    [ -n "$RUN_ID" ] && break
    sleep 5
  done
  if [ -n "$RUN_ID" ]; then
    echo -e "${CYAN}  run: $RUN_ID (gh run watch $RUN_ID --exit-status)${NC}"
    gh run watch "$RUN_ID" --exit-status || {
      echo -e "${RED}✗ publish.yml が失敗しました。'gh run view $RUN_ID --log' でログを確認してください${NC}"
      exit 1
    }
  else
    echo -e "${YELLOW}⚠️  commit ${PUSHED_SHA:0:7} に紐づく publish.yml の run が見つかりませんでした。GitHub Actions を手動確認してください${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  gh コマンドがありません。GitHub Actions の publish.yml を手動確認してください${NC}"
fi

# ── レジストリ到達確認（publish.yml 完了後にポーリング） ─────────────────
echo -e "${CYAN}→ npm registry 反映待ち${NC}"
for i in $(seq 1 20); do
  REG_VER="$(npm view ksk-design-system version 2>/dev/null || true)"
  if [ "$REG_VER" = "$VERSION" ]; then
    echo -e "${GREEN}✓ npm registry に $VERSION が反映されました${NC}"
    break
  fi
  if [ "$i" = 20 ]; then
    echo -e "${RED}✗ npm registry に $VERSION が反映されませんでした（現在: ${REG_VER:-取得失敗}）${NC}"
    exit 1
  fi
  sleep 5
done

# ── 消費リポへ配布 ─────────────────────────
echo -e "${CYAN}→ update-consumers.sh $VERSION（npm registry 経由）${NC}"
bash scripts/update-consumers.sh "$VERSION"

echo ""
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✓ release v$VERSION 完了${NC}"
echo -e "${GREEN}  npm: https://www.npmjs.com/package/ksk-design-system/v/$VERSION${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
