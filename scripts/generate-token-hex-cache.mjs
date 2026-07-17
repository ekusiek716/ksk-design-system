#!/usr/bin/env node
/**
 * semantic トークン hex キャッシュ生成スクリプト
 *
 * 目的:
 *   tokens.json の colors.semantic / colors.semanticDark はフラット文字列
 *   （`var(--Primitive-Gray-900)` / `color-mix(...)` 等）で、AI や人間が読んでも
 *   実 hex が一目で分からない。tokens.json 本体のスキーマは破壊変更を避けるため
 *   変えず、代わりにサイドカーの contracts/token-hex-cache.json に「実 hex に
 *   解決した結果」を機械可読な形で出力する。
 *
 *   同時に、primitive 側の値変更で semantic の実色が意図せず変わる
 *   ドリフトを --check で検出できるようにする。
 *
 * 解決できない値（rgba(...) / color-mix(...) / White-Alpha 系等）は黙殺せず
 * meta.skipped[] に理由付きで記録する。
 *
 * Usage:
 *   node scripts/generate-token-hex-cache.mjs           # 生成
 *   node scripts/generate-token-hex-cache.mjs --check    # 生成せず既存と比較。差分があれば exit 1（CI 用）
 */
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { isBrandDependent, resolveTokenColor } from "./lib/resolve-token-color.mjs"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const OUT_PATH = join(ROOT, "contracts", "token-hex-cache.json")
const CHECK = process.argv.includes("--check")

const tokens = JSON.parse(readFileSync(join(ROOT, "tokens.json"), "utf8"))
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"))
const primitive = tokens.colors.primitive

// メタデータのみで「値」ではないキー（走査から除外する）
const NON_COLOR_KEYS = new Set(["_doc", "hue"])

function classifySkipReason(value) {
  if (typeof value !== "string") return "non-string"
  if (value.includes("color-mix(")) return "color-mix"
  if (/^-?\d/.test(value) && value.includes("rgba(")) return "box-shadow"
  if (/^rgba?\(/.test(value)) return "rgba"
  if (/^var\(--Primitive-/.test(value)) return "unresolvable-var"
  return "other"
}

/**
 * semantic / semanticDark のネストされたオブジェクトを走査し、
 * resolve 可能なエントリと skip されたエントリに分ける。
 */
function walk(node, path, mode, resolved, skipped, themeDependentKeys) {
  for (const [key, value] of Object.entries(node)) {
    if (NON_COLOR_KEYS.has(key)) continue
    const nextPath = path ? `${path}.${key}` : key
    if (value && typeof value === "object" && !Array.isArray(value)) {
      walk(value, nextPath, mode, resolved, skipped, themeDependentKeys)
      continue
    }
    if (typeof value !== "string") continue
    const hex = resolveTokenColor(value, primitive)
    if (hex) {
      resolved[nextPath] = hex
      // Brand primitive 参照はテーマ差し替えで実色が変わる（下の hex はデフォルト＝Blue テーマ値）
      if (isBrandDependent(value)) themeDependentKeys.push(`${mode}.${nextPath}`)
    } else {
      skipped.push({ key: nextPath, mode, value, reason: classifySkipReason(value) })
    }
  }
}

function buildCache() {
  const skipped = []
  const themeDependentKeys = []
  const semantic = {}
  const semanticDark = {}
  walk(tokens.colors.semantic, "", "semantic", semantic, skipped, themeDependentKeys)
  walk(tokens.colors.semanticDark, "", "semanticDark", semanticDark, skipped, themeDependentKeys)

  return {
    meta: {
      name: "KSK Design System — Semantic Token Hex Cache",
      version: pkg.version,
      description:
        "semantic / semanticDark トークン（var(--Primitive-*) 参照）を実 hex に解決したサイドカー生成物。" +
        "hex はデフォルト（Blue）テーマでの解決値であり、Brand 系（meta.themeDependentKeys に列挙）は" +
        "テーマ差し替え（orange/green/violet 等）で実色が変わる。テーマ別の完全解決値は " +
        "`ksk-design-system/native` エクスポート（バンドル済み native トークンモジュール）の themes を参照。" +
        "tokens.json 本体のスキーマは変更せず、AI がこのファイルだけで実色を把握できるようにし、" +
        "primitive 値の変更による semantic 実色のドリフトを --check で機械検出する。",
      generatedBy: "scripts/generate-token-hex-cache.mjs",
      theme: "default",
      themeDependentKeys,
      skipped,
    },
    semantic,
    semanticDark,
  }
}

const cache = buildCache()
const output = `${JSON.stringify(cache, null, 2)}\n`

if (CHECK) {
  let existing
  try {
    existing = readFileSync(OUT_PATH, "utf8")
  } catch {
    console.error(`✗ ${OUT_PATH} が存在しません。node scripts/generate-token-hex-cache.mjs を実行してください`)
    process.exit(1)
  }
  if (existing !== output) {
    console.error("✗ contracts/token-hex-cache.json が tokens.json と一致していません（差分あり）")
    console.error("  node scripts/generate-token-hex-cache.mjs を実行して再生成してください")
    // 簡易 diff（行単位）
    const a = existing.split("\n")
    const b = output.split("\n")
    const max = Math.max(a.length, b.length)
    let shown = 0
    for (let i = 0; i < max && shown < 20; i++) {
      if (a[i] !== b[i]) {
        console.error(`  L${i + 1}: - ${a[i] ?? "(なし)"}`)
        console.error(`  L${i + 1}: + ${b[i] ?? "(なし)"}`)
        shown++
      }
    }
    process.exit(1)
  }
  console.log(`✓ contracts/token-hex-cache.json は最新です（semantic: ${Object.keys(cache.semantic).length} 件 / semanticDark: ${Object.keys(cache.semanticDark).length} 件 / skipped: ${cache.meta.skipped.length} 件）`)
  process.exit(0)
}

writeFileSync(OUT_PATH, output)
console.log(`✓ contracts/token-hex-cache.json を生成しました（semantic: ${Object.keys(cache.semantic).length} 件 / semanticDark: ${Object.keys(cache.semanticDark).length} 件 / skipped: ${cache.meta.skipped.length} 件）`)
