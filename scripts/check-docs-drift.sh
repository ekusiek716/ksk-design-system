#!/bin/bash
# =============================================================
# KSK Design System — ドキュメント/コード乖離検出スクリプト
#
# CLAUDE.md / AGENTS.md 等のドキュメントが参照する
# コンポーネント名・contracts/*.json ファイル・CSS変数名が
# 実際のソースに存在するかを検査する。
#
# 検査しないもの（棲み分け）:
#   - DESIGN.md の front matter / セクション構造 → check-design-md.mjs
#   - contracts/components.json の件数整合性        → check-drift.sh
#
# 除外方法:
#   ある行を検査対象から外したい場合、直前の行に
#   `<!-- docs-drift-ignore -->` を書く（次の1行のみ無視）。
#
# 実行: bash scripts/check-docs-drift.sh
# =============================================================

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

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

echo "🔍 KSK Design System — ドキュメント/コード乖離検出"
echo "======================================="

# ─── 対象ドキュメントを配列にまとめる（存在するものだけ） ───
CANDIDATE_DOCS=(
  "CLAUDE.md"
  "AGENTS.md"
  "DESIGN.md"
  "NATIVE_RECIPES.md"
  "MIGRATION.md"
  "RELEASE.md"
  "PUBLISHING.md"
)

DOCS=()
for doc in "${CANDIDATE_DOCS[@]}"; do
  if [ -f "$ROOT/$doc" ]; then
    DOCS+=("$doc")
  fi
done

while IFS= read -r f; do
  DOCS+=("${f#"$ROOT"/}")
done < <(find "$ROOT/.claude/skills" -name "*.md" -type f 2>/dev/null | sort)

while IFS= read -r f; do
  DOCS+=("${f#"$ROOT"/}")
done < <(find "$ROOT/templates" -maxdepth 1 -name "*.md" -type f 2>/dev/null | sort)

info "対象ドキュメント: ${#DOCS[@]} 件"

# ─── 行単位の docs-drift-ignore マーカー処理 ───
# docs-drift-ignore マーカーの2通りの使い方に対応する:
#   1) 単独行マーカー（`<!-- docs-drift-ignore -->` のみの行） → 次の1行を検査対象から除外
#   2) 行内マーカー（他の内容と同じ行に埋め込む。Markdown テーブル行など
#      前後に独立行を挿入するとレイアウトが壊れる箇所向け） → その行自身のみ除外
# 対象行番号一覧を取得するヘルパー: 出力は「行番号:行内容」
lines_to_check() {
  local file="$1"
  awk '
    {
      is_marker_only = ($0 ~ /^[[:space:]]*<!--[[:space:]]*docs-drift-ignore[[:space:]]*-->[[:space:]]*$/)
      has_marker = ($0 ~ /docs-drift-ignore/)
      if (skip_next) { skip_next = 0; next }
      if (is_marker_only) { skip_next = 1; next }
      if (has_marker) { next }
      print NR ":" $0
    }
  ' "$file"
}

# =============================================================
# 1) コンポーネント名の存在照合
# =============================================================
echo ""
echo "─── コンポーネント名チェック ───"

# ホワイトリスト（一般語・技術用語・略語）
WHITELIST_RE='^(API|URL|URI|JSON|CSS|HTML|HIG|M3|AI|React|TypeScript|Tailwind|Storybook|Radix|CVA|WCAG|CVD|PascalCase|Props|Provider|DOM|SDK|CLI|PR|CI|CD|JSX|TSX|SVG|PNG|UI|UX|DS|ID|SSR|CSR|npm|Node|Vite|ESLint|Figma|GitHub|Slack|README|CHANGELOG|TODO|FIXME|NOTE|WARN|ERROR|OK|NG|MIT|Apache|BSD|POSIX|YAML|XML|CSV|PDF|SVG|OS|iOS|Android|macOS|Windows|Linux|RGB|RGBA|HSL|HEX|CTA|KPI|MVP|POC|SaaS|BtoB|BtoC|EC|PdM|QA|E2E|Vitest|Jest|Playwright|Zustand|Redux|Context|Hook|Hooks|HOC|Ref|Refs|State|Props|Children|Fragment|Portal|Suspense|StrictMode|ThemeProvider|Codex|Claude|Anthropic|Fable|Opus|Sonnet|Haiku|ActivityIndicator|ScrollView|FlatList|SectionList|TouchableOpacity|TouchableHighlight|SafeAreaView|StyleSheet|Animated|Dimensions|Platform|StatusBar|KeyboardAvoidingView|Pressable|TextInput)$'

extract_exports() {
  local file="$1"
  # export {...} は複数行にまたがることが多いため（例: src/index.ts の
  # DataTable 一式）、grep の行単位マッチでは取りこぼす。Node で
  # 波括弧内の識別子をブロック横断で抽出する。
  if [ -f "$file" ]; then
    node -e '
      const fs = require("fs")
      const src = fs.readFileSync(process.argv[1], "utf8")
      const names = new Set()
      const re = /\{([^}]*)\}/g
      let m
      while ((m = re.exec(src))) {
        for (const tok of m[1].split(",")) {
          // `Foo as Bar` は元名と alias（公開名）の両方を許容する
          // （ドキュメントは公開名で言及するため alias 側が本命）
          const base = tok.trim().replace(/^type\s+/, "")
          for (const part of base.split(/\s+as\s+/)) {
            const t = part.trim()
            if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(t)) names.add(t)
          }
        }
      }
      console.log([...names].join("\n"))
    ' "$file" 2>/dev/null || true
  fi
}

KNOWN_NAMES_FILE="$(mktemp)"
{
  extract_exports "$ROOT/src/index.ts"
  extract_exports "$ROOT/src/native/index.ts"
  extract_exports "$ROOT/src/native/components/index.ts"
} | sort -u > "$KNOWN_NAMES_FILE"

COMPONENT_ERRORS=0
for doc in "${DOCS[@]}"; do
  full="$ROOT/$doc"
  while IFS= read -r entry; do
    line_no="${entry%%:*}"
    content="${entry#*:}"
    names=$(echo "$content" | grep -oE '`[A-Z][a-zA-Z]+`' | tr -d '`' || true)
    [ -z "$names" ] && continue
    while IFS= read -r name; do
      [ -z "$name" ] && continue
      if echo "$name" | grep -qE "$WHITELIST_RE"; then
        continue
      fi
      if ! grep -qxF -- "$name" "$KNOWN_NAMES_FILE"; then
        error "$doc:$line_no: 未知のコンポーネント/識別子名 \`$name\`（src/index.ts 等に存在しません）"
        COMPONENT_ERRORS=$((COMPONENT_ERRORS + 1))
      fi
    done <<< "$names"
  done < <(lines_to_check "$full")
done
rm -f "$KNOWN_NAMES_FILE"

if [ "$COMPONENT_ERRORS" -eq 0 ]; then
  ok "コンポーネント名チェック OK"
fi

# =============================================================
# 2) contracts/*.json 参照の実在チェック
# =============================================================
echo ""
echo "─── contracts 参照チェック ───"

CONTRACTS_ERRORS=0
for doc in "${DOCS[@]}"; do
  full="$ROOT/$doc"
  while IFS= read -r entry; do
    line_no="${entry%%:*}"
    content="${entry#*:}"
    refs=$(echo "$content" | grep -oE 'contracts/[A-Za-z0-9_.-]+\.json' || true)
    [ -z "$refs" ] && continue
    while IFS= read -r ref; do
      [ -z "$ref" ] && continue
      if [ ! -f "$ROOT/$ref" ]; then
        error "$doc:$line_no: 参照先が存在しません: $ref"
        CONTRACTS_ERRORS=$((CONTRACTS_ERRORS + 1))
      fi
    done <<< "$refs"
  done < <(lines_to_check "$full")
done

if [ "$CONTRACTS_ERRORS" -eq 0 ]; then
  ok "contracts 参照チェック OK"
fi

# =============================================================
# 3) CSS 変数名の存在照合
# =============================================================
echo ""
echo "─── CSS 変数名チェック ───"

# CSS ファイルからは「宣言位置」（`--Name:` のプロパティ宣言）のみ抽出する。
# `var(--X)` のような参照を定義扱いすると、未定義変数への参照まで
# 「定義済み」と誤判定してしまうため。
extract_css_declarations() {
  local file="$1"
  [ -f "$file" ] || return 0
  grep -oE -- '(^|[{;])[[:space:]]*--[A-Za-z][A-Za-z0-9-]*[[:space:]]*:' "$file" \
    | grep -oE -- '--[A-Za-z][A-Za-z0-9-]*' || true
}

# tokens.json は grep でなく node で JSON パースし、キーから
# CSS 変数名を組み立てる（値内の var(--X) 参照や説明文を定義扱いしないため）。
# 命名規約は scripts/generate-platform-tokens.mjs の pascalDash と同一。
extract_tokens_json_vars() {
  local file="$1"
  [ -f "$file" ] || return 0
  node -e '
    const t = require(process.argv[1])
    const out = new Set()
    const pd = (k) => k.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("-")
    // primitive: colors.primitive.{family}.{shade} → --Primitive-{Family}-{shade}
    for (const [fam, val] of Object.entries(t.colors?.primitive ?? {})) {
      if (typeof val === "string") out.add(`--Primitive-${pd(fam)}`)
      else for (const shade of Object.keys(val)) out.add(`--Primitive-${pd(fam)}-${shade}`)
    }
    // brand ランプ: colors.brand.{shade} → --Primitive-Brand-{shade}
    for (const shade of Object.keys(t.colors?.brand ?? {})) out.add(`--Primitive-Brand-${shade}`)
    // semantic / semanticDark: {category}.{role} → --{Category}-{Role}
    for (const sem of [t.colors?.semantic, t.colors?.semanticDark]) {
      if (!sem) continue
      for (const [cat, roles] of Object.entries(sem)) {
        if (cat.startsWith("_") || typeof roles !== "object" || roles == null) continue
        if (cat === "brandExternal") continue // CSS 側と命名が異なるため CSS 宣言を正とする
        for (const role of Object.keys(roles)) {
          if (role.startsWith("_")) continue
          out.add(`--${pd(cat)}-${pd(role)}`)
        }
      }
    }
    // shadows: shadows.{key} → --shadow-{key}
    for (const k of Object.keys(t.shadows ?? {})) {
      if (!k.startsWith("_")) out.add(`--shadow-${k}`)
    }
    console.log([...out].join("\n"))
  ' "$file" 2>/dev/null || true
}

DEFINED_VARS_FILE="$(mktemp)"
{
  for f in "$ROOT"/src/styles/*.css; do
    extract_css_declarations "$f"
  done
  extract_css_declarations "$ROOT/src/preset.css"
  extract_tokens_json_vars "$ROOT/tokens.json"
  for f in "$ROOT"/src/themes/*.css; do
    extract_css_declarations "$f"
  done
} | sort -u > "$DEFINED_VARS_FILE"

# CLI フラグ等、CSS 変数と紛らわしいが実際は無関係な誤検知の除外リスト
# （`--dry-run` `--access` `--force` 等。ドキュメント中のコマンド例に頻出）
CSS_VAR_FALSE_POSITIVE_RE='^--(dry-run|dry|access|force|quiet|tags|name-only|noEmit|no-verify|save-dev)$'

CSS_VAR_ERRORS=0
for doc in "${DOCS[@]}"; do
  full="$ROOT/$doc"
  while IFS= read -r entry; do
    line_no="${entry%%:*}"
    content="${entry#*:}"

    # プレースホルダー表現のトークンだけを除去してから残りを検証する
    # （--Surface-* / --Categorical-{1..16} / --{Category}-{Role} 等。
    #  行ごとスキップすると同一行の本物の typo が素通りするため、トークン単位で除去）
    sanitized=$(echo "$content" | sed -E 's/--[A-Za-z0-9-]*(\{[^}]*\}|\*)[A-Za-z0-9*{},.-]*//g')

    vars=$(echo "$sanitized" | grep -oE -- '--[A-Za-z][A-Za-z0-9-]*' || true)
    [ -z "$vars" ] && continue
    while IFS= read -r var; do
      [ -z "$var" ] && continue
      if echo "$var" | grep -qE -- "$CSS_VAR_FALSE_POSITIVE_RE"; then
        continue
      fi
      if ! grep -qxF -- "$var" "$DEFINED_VARS_FILE"; then
        error "$doc:$line_no: 未定義の CSS 変数 $var"
        CSS_VAR_ERRORS=$((CSS_VAR_ERRORS + 1))
      fi
    done <<< "$vars"
  done < <(lines_to_check "$full")
done
rm -f "$DEFINED_VARS_FILE"

if [ "$CSS_VAR_ERRORS" -eq 0 ]; then
  ok "CSS 変数名チェック OK"
fi

# ─── 結果 ───
echo ""
echo "======================================="
if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}✗ ドキュメント/コード乖離検出: $ERRORS 件${NC}"
  echo "  ドキュメントを実態に合わせて修正するか、意図的な記述には"
  echo "  直前の行に <!-- docs-drift-ignore --> を追加してください"
  exit 1
else
  echo -e "${GREEN}✓ 乖離なし — ドキュメントと実コードが一致しています${NC}"
  exit 0
fi
