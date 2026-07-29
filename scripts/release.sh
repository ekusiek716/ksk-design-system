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
#   2. npm version <level>（"version" ライフサイクルで scripts/sync-version.mjs が
#      自動発火し、contracts/components.json の meta.version・token-hex-cache を
#      同一コミットに同梱する）
#   3. npm pack で公開物を検証（publish はしない。中身確認のみ）
#   4. git push origin main --tags → publish.yml が version 変更を検知して
#      npm publish（Trusted Publishing）・タグ・GitHub Release を自動実行
#   5. npm view でレジストリ反映をポーリング確認
#   6. bash scripts/update-consumers.sh <version>（5 リポ自動 PR）
#
# ローカル npm 認証によるフォールバック公開が必要な場合（publish.yml が
# 利用できない緊急時のみ）は PUBLISHING.md の手動フローを参照。
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

# ── version bump ─────────────────────────
echo -e "${CYAN}→ npm version $LEVEL_OR_VERSION${NC}"
npm version "$LEVEL_OR_VERSION"
VERSION="$(node -p "require('./package.json').version")"
echo -e "${GREEN}✓ new version: $VERSION${NC}"

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

# ── push（publish は publish.yml の Trusted Publishing に一本化） ──────
# ローカルから npm publish は実行しない。push した package.json の version 変更を
# .github/workflows/publish.yml が検知し、npm 上の最新版と比較した上で
# npm publish（OIDC）・タグ・GitHub Release を CI 側で実行する。
echo -e "${CYAN}→ git push origin main --tags${NC}"
git push origin main --tags

# ── publish.yml の実行を確認 ─────────────────────────
echo -e "${CYAN}→ publish.yml の実行状況を確認${NC}"
if command -v gh >/dev/null 2>&1; then
  sleep 5
  RUN_ID="$(gh run list --workflow=publish.yml --branch=main --limit=1 --json databaseId --jq '.[0].databaseId' 2>/dev/null || true)"
  if [ -n "$RUN_ID" ]; then
    echo -e "${CYAN}  run: $RUN_ID (gh run watch $RUN_ID --exit-status)${NC}"
    gh run watch "$RUN_ID" --exit-status || {
      echo -e "${RED}✗ publish.yml が失敗しました。'gh run view $RUN_ID --log' でログを確認してください${NC}"
      exit 1
    }
  else
    echo -e "${YELLOW}⚠️  publish.yml の run が見つかりませんでした。GitHub Actions を手動確認してください${NC}"
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
