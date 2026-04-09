#!/bin/bash
# KSK Design System — CLAUDE.md 自動注入スクリプト
# 使い方: bash scripts/inject-claude-rules.sh /path/to/target-project

set -euo pipefail

TARGET="${1:-.}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DS_ROOT="$(dirname "$SCRIPT_DIR")"

echo "📋 KSK DS ルールを $TARGET に注入中..."

# CLAUDE.md をコピー
cp "$DS_ROOT/CLAUDE.md" "$TARGET/CLAUDE.md"
echo "  ✓ CLAUDE.md をコピーしました"

# .claude ディレクトリを作成
mkdir -p "$TARGET/.claude"

# settings.local.json を作成（既存があればマージしない、新規のみ）
if [ ! -f "$TARGET/.claude/settings.local.json" ]; then
  cat > "$TARGET/.claude/settings.local.json" << 'SETTINGS'
{
  "permissions": {
    "allow": [
      "Bash(npx tsc --noEmit)",
      "Bash(bash scripts/lint-scratch.sh)"
    ]
  }
}
SETTINGS
  echo "  ✓ .claude/settings.local.json を作成しました"
else
  echo "  ⚠ .claude/settings.local.json は既に存在するためスキップしました"
fi

# lint-scratch.sh をコピー
mkdir -p "$TARGET/scripts"
cp "$DS_ROOT/scripts/lint-scratch.sh" "$TARGET/scripts/lint-scratch.sh"
echo "  ✓ scripts/lint-scratch.sh をコピーしました"

echo ""
echo "✅ 完了。このプロジェクトで Claude Code を使うと KSK DS ルールが自動適用されます。"
