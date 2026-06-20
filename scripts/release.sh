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
# やること:
#   1. clean & main 確認、npm run check
#   2. npm version <level>
#   3. npm pack で公開物を検証
#   4. npm publish --access public
#   5. git push origin main --tags
#   6. bash scripts/update-consumers.sh <version>（5 リポ自動 PR）
#
# 失敗時は package.json の name 書換を確実に元に戻す（trap）。
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

# ── npm publish ─────────────────────────
# v1.36.0 以降は npm registry 経由配布。dual tgz は廃止済み。
# 2FA OTP が必要。手元で完結させたい場合は別途 NPM_TOKEN を使う手もある。
echo -e "${CYAN}→ npm whoami${NC}"
WHOAMI="$(npm whoami 2>&1)"
if [[ "$WHOAMI" == *"401"* ]] || [[ "$WHOAMI" == *"error"* ]]; then
  echo -e "${RED}✗ npm にログインしていません。'npm login' で認証してください${NC}"
  exit 1
fi
echo -e "${GREEN}✓ logged in as: $WHOAMI${NC}"

echo -e "${CYAN}→ npm publish --access public${NC}"
# script コマンドで TTY エミュレートして 2FA URL をキャプチャしつつログ保存
script -q /tmp/npm-publish-$VERSION.log npm publish --access public < /dev/null &
PUBLISH_PID=$!

# 認証 URL が出るのを待つ
for i in {1..30}; do
  sleep 2
  if grep -q "Authenticate your account at:" /tmp/npm-publish-$VERSION.log 2>/dev/null; then
    AUTH_URL="$(grep -oE 'https://www.npmjs.com/auth/cli/[a-f0-9-]+' /tmp/npm-publish-$VERSION.log | head -1)"
    if [ -n "$AUTH_URL" ]; then
      echo ""
      echo -e "${YELLOW}🔑 2FA 認証 URL（ブラウザで開いて承認）:${NC}"
      echo "    $AUTH_URL"
      echo ""
      break
    fi
  fi
  if grep -q "^+ ksk-design-system@" /tmp/npm-publish-$VERSION.log 2>/dev/null; then
    break  # OTP 不要で完了したケース
  fi
done

# publish 完了を待つ
wait $PUBLISH_PID 2>/dev/null
sleep 2
if grep -q "^+ ksk-design-system@$VERSION" /tmp/npm-publish-$VERSION.log 2>/dev/null; then
  echo -e "${GREEN}✓ npm publish 成功${NC}"
else
  echo -e "${RED}✗ npm publish 失敗。ログ: /tmp/npm-publish-$VERSION.log${NC}"
  exit 1
fi

# レジストリ到達確認
sleep 3
REG_VER="$(npm view ksk-design-system version 2>/dev/null)"
[ "$REG_VER" = "$VERSION" ] || {
  echo -e "${YELLOW}⚠️  npm registry の最新が ${REG_VER}（期待: ${VERSION}）。CDN 反映遅延の可能性${NC}"
}

# ── push ─────────────────────────
echo -e "${CYAN}→ git push origin main --tags${NC}"
git push origin main --tags

# ── 消費リポへ配布 ─────────────────────────
echo -e "${CYAN}→ update-consumers.sh $VERSION（npm registry 経由）${NC}"
bash scripts/update-consumers.sh "$VERSION"

echo ""
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✓ release v$VERSION 完了${NC}"
echo -e "${GREEN}  npm: https://www.npmjs.com/package/ksk-design-system/v/$VERSION${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
