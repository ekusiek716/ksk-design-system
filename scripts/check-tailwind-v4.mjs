#!/usr/bin/env node
// =============================================================
// KSK Design System — Tailwind v4 構文検査
//
// 1) 先頭! の important 修飾子 — 記法統一の convention（動作バグ検出ではない）
//    v4 の正式表記は末尾(!): `bg-[var(--x)]!`。
//    v3 風の先頭! (`!bg-[var(--x)]`) も **v4.2.1 では今も utility として認識され**、
//    `.\!bg-…{…!important}` が生成される（姉妹 DS の実ビルド出力で実測）。
//    「先頭! は CSS が生成されず静かに無効化される」は誤り。
//    根拠を誤ったままにすると、気付いた人に検査ごと消され、本来の意図
//    （記法統一・v3 由来のコピペ流入の抑止）まで失われるため実態に合わせる。
//
// 2) arbitrary value 内 calc() の二項演算子 — こちらは実バグ検出。
//    空白が無いと Tailwind が値を解釈できない。`_` で空白を表現する。
//
// どちらもコメント（行 / ブロック / JSDoc）は対象外。記法例を JSDoc に
// 書いただけで落ちると、検査を避けるためにドキュメントが痩せる。
//
// 実行: node scripts/check-tailwind-v4.mjs
// =============================================================
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { stripComments } from "./lib/strip-comments.mjs"

// 走査対象。既定は src/。テストから一時ディレクトリを指定できるようにして、
// フィクスチャを src/ に書き込まずに済ませる（他テストと並行実行しても汚染しない）。
const targetArg = process.argv.slice(2).find((a) => !a.startsWith("-"))
const srcDir = targetArg
  ? resolve(targetArg)
  : join(dirname(fileURLToPath(import.meta.url)), "..", "src")

// 先頭! の Tailwind クラスのみを拾い、JS の否定演算子を誤検知しない:
//   - `:![a-z]`               variant 付き（hover:! / [&>button]:! 等。JS に無い形）
//   - `![a-z][a-z0-9]*-[[a-z0-9]`  util + `-` + 値/括弧（!bg-[ / !py-4 / !font-bold）
//     `-` を要求することで `!mounted` / `!steps[idx]` 等の JS 否定を除外する。
const RE = /:![a-z]|![a-z][a-z0-9]*-[[a-z0-9]/g
const UNSPACED_CALC_OPERATOR_RE = /(?:[%a-z0-9)])(?:\+|-(?=\d|env\(|max\(|min\(|clamp\(|var\())/i

const hits = []
const calcHits = []
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) { walk(p); continue }
    if (!/\.(tsx?)$/.test(name)) continue // CSS の実 !important は対象外
    stripComments(readFileSync(p, "utf8")).split("\n").forEach((line, i) => {
      const m = line.match(RE)
      if (m) hits.push({ file: p.replace(srcDir + "/", "src/"), line: i + 1, found: [...new Set(m)].join(" ") })
      const calcExpressions = line.match(/calc\([^"'`]*?\)\]/g) ?? []
      if (calcExpressions.some((expression) => UNSPACED_CALC_OPERATOR_RE.test(expression))) {
        calcHits.push({ file: p.replace(srcDir + "/", "src/"), line: i + 1 })
      }
    })
  }
}
walk(srcDir)

console.log("🎨 Tailwind v4 — 先頭! 検出")
if (hits.length) {
  for (const h of hits) console.error(`\x1b[31m[NG]\x1b[0m ${h.file}:${h.line}  ${h.found}…`)
  console.error(`\x1b[31m✗ ${hits.length} 件: v4 の正式表記は末尾! (例 bg-[var(--x)]!)。記法を統一する\x1b[0m`)
  process.exit(1)
}
console.log("\x1b[32m✓ 先頭! の Tailwind クラスなし\x1b[0m")

console.log("🧮 Tailwind arbitrary calc() — 二項演算子の空白検査")
if (calcHits.length) {
  for (const hit of calcHits) {
    console.error(`\x1b[31m[NG]\x1b[0m ${hit.file}:${hit.line}`)
  }
  console.error(
    `\x1b[31m✗ ${calcHits.length} 件: calc() の + / - は _ で空白を表現してください（例 calc(100%_-_2rem)）\x1b[0m`,
  )
  process.exit(1)
}
console.log("\x1b[32m✓ calc() の二項演算子は空白付きです\x1b[0m")
