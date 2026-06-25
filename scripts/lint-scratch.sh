#!/bin/bash
# =============================================================
# KSK Design System — スクラッチ検出スクリプト
#
# 禁止パターンをgrepで検出し、違反があればCI失敗させる。
# 実行: bash scripts/lint-scratch.sh [ファイルパス...]
# 引数なしの場合は src 配下の全 .tsx を対象（components 本体も含む）
# ※ 生タグ系の構造チェック(1-6)のみ DS 本体(ui/patterns/icons)では
#    スキップする（プリミティブ実装は <button>/<input> 等を正当に使うため）。
#    色・typo・spacing 系チェック(7-12)は DS 本体にも適用（段階導入のため警告扱い）。
#    W1-W11 の警告系は従来どおり全ファイルに適用する。
# =============================================================

set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'
ERRORS=0
WARNINGS=0
CLASS_START='(^|[^[:alnum:]_-])'
CLASS_END='($|[^[:alnum:]_-])'
COMMENT_LINE='(^|:)[[:space:]]*//|/\*'

# 色・typo 系の検出を severity 付きで報告する。
# DS 本体(ui/patterns/icons)は段階導入として WARNING（CI は落とさない）、
# 消費側スクラッチ等は ERROR。$1=severity(err|warn) $2=メッセージ $3=該当行
report() {
  if [ "$1" = "err" ]; then
    echo -e "${RED}❌ $2${NC}"
    echo "$3" | head -3
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${YELLOW}⚠️  $2${NC}"
    echo "$3" | head -3
    WARNINGS=$((WARNINGS + 1))
  fi
}

# 検査対象: 引数があればそれを使う、なければ全 .tsx
if [ $# -gt 0 ]; then
  FILES="$@"
else
  FILES=$(find src -name '*.tsx' \
    -not -path '*/node_modules/*' \
    -not -name '*.stories.tsx' \
    -not -name '*-data.tsx' \
    2>/dev/null)
fi

echo "🔍 KSK Design System — スクラッチ検出"
echo "======================================="

for FILE in $FILES; do
  echo "$FILE" | grep -qE '\.(css|json|js|mjs)$' && continue

  # DS 本体（プリミティブ実装）か判定。
  # true の場合は生タグ系の構造チェックをスキップ（色・typo 系は適用）。
  IS_DS=false
  echo "$FILE" | grep -qE '/components/(ui|patterns|icons)/' && IS_DS=true
  HAS_DS_ESCAPE=false
  grep -q 'ksk-ds-allow-custom-ui' "$FILE" 2>/dev/null && HAS_DS_ESCAPE=true
  # 色・typo 系の severity（DS 本体は段階導入のため warn）
  SEV=err
  [ "$IS_DS" = true ] && SEV=warn

  # ──────────────────────────────────────────
  # 構造チェック（生タグ）: DS 本体ではスキップ
  # ──────────────────────────────────────────
  if [ "$IS_DS" = false ]; then

  # 1. 生の <button>
  MATCHES=$(grep -nE '<button([[:space:]>]|$)' "$FILE" 2>/dev/null \
    | grep -Ev "data-slot|asChild|Comp|Primitive|$COMMENT_LINE" || true)
  if [ -n "$MATCHES" ]; then
    echo -e "${RED}❌ $FILE: 生の<button> → <Button variant=\"...\" size=\"...\">を使う${NC}"
    echo "$MATCHES" | head -3
    ERRORS=$((ERRORS + 1))
  fi

  # 2. 生の <input>
  MATCHES=$(grep -nE '<input([[:space:]>]|$)' "$FILE" 2>/dev/null \
    | grep -Ev "type=\"hidden\"|type=\"search\"|type=\"file\"|data-slot|asChild|Comp|Primitive|$COMMENT_LINE" || true)
  if [ -n "$MATCHES" ]; then
    echo -e "${RED}❌ $FILE: 生の<input> → <Input>コンポーネントを使う${NC}"
    echo "$MATCHES" | head -3
    ERRORS=$((ERRORS + 1))
  fi

  # 3. 生の <textarea>
  MATCHES=$(grep -nE '<textarea([[:space:]>]|$)' "$FILE" 2>/dev/null \
    | grep -Ev "data-slot|asChild|Comp|Primitive|$COMMENT_LINE" || true)
  if [ -n "$MATCHES" ]; then
    echo -e "${RED}❌ $FILE: 生の<textarea> → <Textarea>コンポーネントを使う${NC}"
    echo "$MATCHES" | head -3
    ERRORS=$((ERRORS + 1))
  fi

  # 4. 生の <select>
  MATCHES=$(grep -nE '<select([[:space:]>]|$)' "$FILE" 2>/dev/null \
    | grep -Ev "data-slot|asChild|Comp|Primitive|$COMMENT_LINE" || true)
  if [ -n "$MATCHES" ]; then
    echo -e "${RED}❌ $FILE: 生の<select> → <Select>コンポーネントを使う${NC}"
    echo "$MATCHES" | head -3
    ERRORS=$((ERRORS + 1))
  fi

  # 5. 生の <table>
  MATCHES=$(grep -nE '<table([[:space:]>]|$)' "$FILE" 2>/dev/null \
    | grep -Ev "data-slot|asChild|Comp|Primitive|$COMMENT_LINE" || true)
  if [ -n "$MATCHES" ]; then
    echo -e "${RED}❌ $FILE: 生の<table> → DataTable等のDSコンポーネントを使う${NC}"
    echo "$MATCHES" | head -3
    ERRORS=$((ERRORS + 1))
  fi

  # 6. 生の <a href>（asChild 内を除く）
  MATCHES=""
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    LN=$(echo "$line" | cut -d: -f1)
    S=$((LN - 3)); [ $S -lt 1 ] && S=1
    if ! sed -n "${S},${LN}p" "$FILE" 2>/dev/null | grep -q 'asChild'; then
      MATCHES="${MATCHES}${line}\n"
    fi
  done < <(grep -n '<a href' "$FILE" 2>/dev/null | grep -Ev "$COMMENT_LINE" || true)
  MATCHES=$(printf "%b" "$MATCHES" | sed '/^[[:space:]]*$/d')
  if [ -n "$MATCHES" ]; then
    echo -e "${RED}❌ $FILE: 生の<a href> → <Button variant=\"link\">を使う${NC}"
    echo "$MATCHES" | head -3
    ERRORS=$((ERRORS + 1))
  fi

  fi  # ← 構造チェック（生タグ）ここまで

  # ──────────────────────────────────────────
  # 色・typo・spacing チェック: DS 本体にも適用
  # ──────────────────────────────────────────

  # 7. HEX ハードコード
  MATCHES=$(grep -n '#[0-9a-fA-F]\{6\}' "$FILE" 2>/dev/null \
    | grep -Ev "var\(|fill=\"|stroke=\"|src=|$COMMENT_LINE" || true)
  [ -n "$MATCHES" ] && report "$SEV" "$FILE: HEXハードコード → var(--Token-Name)を使う" "$MATCHES"

  # 8. Tailwind 標準色クラス
  MATCHES=$(grep -nE "${CLASS_START}(text|bg|border)-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+${CLASS_END}" \
    "$FILE" 2>/dev/null | grep -Ev "$COMMENT_LINE" || true)
  [ -n "$MATCHES" ] && report "$SEV" "$FILE: Tailwind標準色 → セマンティックトークン var(--)を使う" "$MATCHES"

  # 9. text-white / bg-white
  MATCHES=$(grep -nE "${CLASS_START}(text-white|bg-white)${CLASS_END}" "$FILE" 2>/dev/null \
    | grep -Ev "$COMMENT_LINE" || true)
  [ -n "$MATCHES" ] && report "$SEV" "$FILE: text-white/bg-white → セマンティックトークンを使う" "$MATCHES"

  # 10. フォントサイズ直書き text-[14px]
  MATCHES=$(grep -nE "${CLASS_START}text-\[[0-9]+px\]${CLASS_END}" "$FILE" 2>/dev/null \
    | grep -Ev "$COMMENT_LINE" || true)
  [ -n "$MATCHES" ] && report "$SEV" "$FILE: フォントサイズ直書き → typo-*クラスを使う" "$MATCHES"

  # 11. 任意値スペーシング px-[17px] 等
  MATCHES=$(grep -nE "${CLASS_START}(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-x|space-y)-\[[0-9]+px\]${CLASS_END}" \
    "$FILE" 2>/dev/null | grep -Ev "$COMMENT_LINE" || true)
  [ -n "$MATCHES" ] && report "$SEV" "$FILE: 任意値スペーシング → spacingトークン（4の倍数）を使う" "$MATCHES"

  # 12. AI 生成パターン: カラーバー border-l-4 等
  MATCHES=$(grep -nE "${CLASS_START}(border-l-4|border-t-4|border-r-4|border-b-4)${CLASS_END}" "$FILE" 2>/dev/null \
    | grep -Ev "$COMMENT_LINE" || true)
  [ -n "$MATCHES" ] && report "$SEV" "$FILE: カラーバー（AI生成パターン禁止）→ 全周ボーダーを使う" "$MATCHES"

  # 13. pravatar.cc（ダミー画像サービス禁止）
  MATCHES=$(grep -n 'pravatar\.cc' "$FILE" 2>/dev/null || true)
  if [ -n "$MATCHES" ]; then
    echo -e "${RED}❌ $FILE: pravatar.cc → DiceBear shapes を使う${NC}"
    echo "$MATCHES" | head -3
    ERRORS=$((ERRORS + 1))
  fi

  # ──────────────────────────────────────────
  # 警告（推奨修正）
  # ──────────────────────────────────────────

  # W1. font-bold 等の直書き
  MATCHES=$(grep -nE "${CLASS_START}font-(bold|semibold|medium|light|normal)${CLASS_END}" \
    "$FILE" 2>/dev/null \
    | grep -Ev "typo-|cva\(|variants|$COMMENT_LINE" || true)
  if [ -n "$MATCHES" ]; then
    echo -e "${YELLOW}⚠️  $FILE: font-*直接使用 → typo-*クラスを使う${NC}"
    echo "$MATCHES" | head -3
    WARNINGS=$((WARNINGS + 1))
  fi

  # W2. text-black
  MATCHES=$(grep -nE "${CLASS_START}text-black${CLASS_END}" "$FILE" 2>/dev/null \
    | grep -Ev "$COMMENT_LINE" || true)
  if [ -n "$MATCHES" ]; then
    echo -e "${YELLOW}⚠️  $FILE: text-black → text-[var(--Text-High-Emphasis)]を使う${NC}"
    echo "$MATCHES" | head -3
    WARNINGS=$((WARNINGS + 1))
  fi

  # W3. DS 外の角丸（tokens.json borderRadius キー none/sm/md/lg/xl/2xl/full が許可セット。3xl 等は非トークン）
  MATCHES=$(grep -nE "${CLASS_START}rounded-3xl${CLASS_END}" "$FILE" 2>/dev/null \
    | grep -Ev "$COMMENT_LINE" || true)
  if [ -n "$MATCHES" ]; then
    echo -e "${YELLOW}⚠️  $FILE: DS外の角丸 → rounded-none/sm/md/lg/xl/2xl/full のみ${NC}"
    echo "$MATCHES" | head -3
    WARNINGS=$((WARNINGS + 1))
  fi

  # W4. DS 外のシャドウ
  MATCHES=$(grep -nE "${CLASS_START}shadow-(md|lg|xl|2xl)${CLASS_END}" "$FILE" 2>/dev/null \
    | grep -Ev "$COMMENT_LINE" || true)
  if [ -n "$MATCHES" ]; then
    echo -e "${YELLOW}⚠️  $FILE: DS外シャドウ → shadow-[var(--shadow-*)]を使う${NC}"
    echo "$MATCHES" | head -3
    WARNINGS=$((WARNINGS + 1))
  fi

  # W5. グラデーション背景（AI 生成パターン）
  MATCHES=$(grep -nE "${CLASS_START}bg-gradient-to-" "$FILE" 2>/dev/null \
    | grep -Ev "$COMMENT_LINE" || true)
  if [ -n "$MATCHES" ]; then
    echo -e "${YELLOW}⚠️  $FILE: グラデーション → DSにグラデーション定義なし${NC}"
    echo "$MATCHES" | head -3
    WARNINGS=$((WARNINGS + 1))
  fi

  # W6. tracking-tight（日本語可読性低下）
  MATCHES=$(grep -nE "${CLASS_START}(tracking-tight|tracking-tighter)${CLASS_END}" "$FILE" 2>/dev/null \
    | grep -Ev "$COMMENT_LINE" || true)
  if [ -n "$MATCHES" ]; then
    echo -e "${YELLOW}⚠️  $FILE: tracking-tight → 日本語の可読性が低下${NC}"
    echo "$MATCHES" | head -3
    WARNINGS=$((WARNINGS + 1))
  fi

  # W7. outline-none（フォーカスリング削除）
  MATCHES=$(grep -nE "${CLASS_START}outline-none${CLASS_END}" "$FILE" 2>/dev/null \
    | grep -Ev "focus-visible|$COMMENT_LINE" || true)
  if [ -n "$MATCHES" ]; then
    echo -e "${YELLOW}⚠️  $FILE: outline-none → focus-visible:ring で代替${NC}"
    echo "$MATCHES" | head -3
    WARNINGS=$((WARNINGS + 1))
  fi

  # W8. 過剰な z-index
  MATCHES=$(grep -nE "${CLASS_START}(z-\[9999\]|z-\[999\])${CLASS_END}" "$FILE" 2>/dev/null \
    | grep -Ev "$COMMENT_LINE" || true)
  if [ -n "$MATCHES" ]; then
    echo -e "${YELLOW}⚠️  $FILE: 過剰なz-index → z-50を使う${NC}"
    echo "$MATCHES" | head -3
    WARNINGS=$((WARNINGS + 1))
  fi

  # W9. <div onClick> / <span onClick>（アクセシビリティ）
  MATCHES=$(grep -nE '<(div|span).*onClick' "$FILE" 2>/dev/null \
    | grep -Ev "$COMMENT_LINE" || true)
  if [ -n "$MATCHES" ]; then
    echo -e "${YELLOW}⚠️  $FILE: <div onClick> → <button>/<Button>を使う（キーボード操作不可）${NC}"
    echo "$MATCHES" | head -3
    WARNINGS=$((WARNINGS + 1))
  fi

  # W10. <img> に alt なし
  MATCHES=""
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    LN=$(echo "$line" | cut -d: -f1)
    BLOCK=$(sed -n "${LN},$((LN + 20))p" "$FILE" 2>/dev/null | sed '/>/q')
    if ! echo "$BLOCK" | grep -q 'alt='; then
      MATCHES="${MATCHES}${line}\n"
    fi
  done < <(grep -nE '<img([[:space:]>]|$)' "$FILE" 2>/dev/null | grep -Ev "$COMMENT_LINE" || true)
  MATCHES=$(printf "%b" "$MATCHES" | sed '/^[[:space:]]*$/d')
  if [ -n "$MATCHES" ]; then
    echo -e "${YELLOW}⚠️  $FILE: <img>にalt属性なし → alt=\"説明テキスト\"を必ず付ける${NC}"
    echo "$MATCHES" | head -3
    WARNINGS=$((WARNINGS + 1))
  fi

  # W11. 生の <header> / <footer>
  MATCHES=""
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    LN=$(echo "$line" | cut -d: -f1)
    BLOCK=$(sed -n "${LN},$((LN + 20))p" "$FILE" 2>/dev/null | sed '/>/q')
    if ! echo "$BLOCK" | grep -q 'data-slot'; then
      MATCHES="${MATCHES}${line}\n"
    fi
  done < <(grep -nE '<(header|footer)([[:space:]>]|$)' "$FILE" 2>/dev/null | grep -Ev "$COMMENT_LINE" || true)
  MATCHES=$(printf "%b" "$MATCHES" | sed '/^[[:space:]]*$/d')
  if [ -n "$MATCHES" ]; then
    echo -e "${YELLOW}⚠️  $FILE: 生の<header>/<footer> → AppShell等のDSシェルを検討${NC}"
    echo "$MATCHES" | head -3
    WARNINGS=$((WARNINGS + 1))
  fi

  # ──────────────────────────────────────────
  # DS-first recipe guardrails（consumer 側のみ）
  # ──────────────────────────────────────────
  if [ "$IS_DS" = false ] && [ "$HAS_DS_ESCAPE" = false ]; then
    # G1. Button を aria-pressed toggle として手組みしない
    MATCHES=$(grep -nE '<Button[^>]*aria-pressed|aria-pressed[^>]*<Button' "$FILE" 2>/dev/null \
      | grep -Ev "$COMMENT_LINE" || true)
    if [ -n "$MATCHES" ]; then
      echo -e "${RED}❌ $FILE: Button toggle の手組み → PillToggle / RadioGroup / Tabs を使う（例外は ksk-ds-allow-custom-ui コメント）${NC}"
      echo "$MATCHES" | head -3
      ERRORS=$((ERRORS + 1))
    fi

    # G2. 一時的な成功/同期通知を page Banner にしない
    MATCHES=$(grep -nE '<Banner[^>]*variant=["'\'']success["'\''][^>]*(保存|復旧|接続|同期|削除|完了)' "$FILE" 2>/dev/null \
      | grep -Ev "$COMMENT_LINE" || true)
    if [ -n "$MATCHES" ]; then
      echo -e "${RED}❌ $FILE: transient notice を Banner 化しない → toast.success / toast.connectionRestored を使う${NC}"
      echo "$MATCHES" | head -3
      ERRORS=$((ERRORS + 1))
    fi

    # G3. raw icon utility class を作らない
    MATCHES=$(grep -nE 'btn-icon|icon-only-button|className=.*icon-button' "$FILE" 2>/dev/null \
      | grep -Ev "$COMMENT_LINE" || true)
    if [ -n "$MATCHES" ]; then
      echo -e "${RED}❌ $FILE: icon button の独自 class → Button size=\"icon\" / \"icon-sm\" / \"icon-lg\" を使う${NC}"
      echo "$MATCHES" | head -3
      ERRORS=$((ERRORS + 1))
    fi

    # G4. EmptyState CTA サイズを画面ごとに className で組まない
    MATCHES=$(grep -n '<EmptyState[^>]*action={[[:space:]]*<Button[^}]*className=' "$FILE" 2>/dev/null \
      | grep -Ev "$COMMENT_LINE" || true)
    if [ -n "$MATCHES" ]; then
      echo -e "${RED}❌ $FILE: EmptyState CTA の手組み → actionLabel + actionLayout=\"content|full|compact\" を使う${NC}"
      echo "$MATCHES" | head -3
      ERRORS=$((ERRORS + 1))
    fi

    # G5. SheetHeader + KebabMenu は DetailSheetHeader recipe を使う
    if grep -q 'SheetHeader' "$FILE" 2>/dev/null && grep -q 'KebabMenu' "$FILE" 2>/dev/null && ! grep -q 'DetailSheetHeader' "$FILE" 2>/dev/null; then
      MATCHES=$(grep -n 'SheetHeader\|KebabMenu' "$FILE" 2>/dev/null | head -3 || true)
      echo -e "${RED}❌ $FILE: SheetHeader + KebabMenu の手配置 → DetailSheetHeader trailing={<KebabMenu ... />} を使う${NC}"
      echo "$MATCHES"
      ERRORS=$((ERRORS + 1))
    fi
  fi

done

echo ""
echo "======================================="
if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}✗ エラー: ${ERRORS}件  警告: ${WARNINGS}件${NC}"
  echo "  エラーを修正してください（contracts/rules.json を参照）"
  exit 1
elif [ $WARNINGS -gt 0 ]; then
  echo -e "${YELLOW}△ 警告: ${WARNINGS}件${NC}"
  echo "  修正を推奨します"
  exit 0
else
  echo -e "${GREEN}✓ 問題なし${NC}"
  exit 0
fi
