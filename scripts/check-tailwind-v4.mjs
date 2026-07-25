#!/usr/bin/env node
// =============================================================
// KSK Design System — Tailwind v4 先頭! 検出（記法統一）
//
// Tailwind v4 の正式な important 修飾子は末尾(!): `bg-[var(--x)]!`。
// v3 風の先頭! (`!bg-[var(--x)]`) も v4.2.1 では今も utility として
// 認識され、`.\!bg-…{…!important}` が生成される（実測）。
// つまり「先頭! は CSS が生成されず静かに無効化される」は誤り。
// この検査は**動作バグの検出ではなく記法統一の convention**であり、
// 混在によるレビューコストと v3 由来のコピペ流入を止めるために置く。
//
// 実行: node scripts/check-tailwind-v4.mjs
// =============================================================
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const srcDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src")

// 先頭! の Tailwind クラスのみを拾い、JS の否定演算子を誤検知しない:
//   - `:![a-z]`               variant 付き（hover:! / [&>button]:! 等。JS に無い形）
//   - `![a-z][a-z0-9]*-[[a-z0-9]`  util + `-` + 値/括弧（!bg-[ / !py-4 / !font-bold）
//     `-` を要求することで `!mounted` / `!steps[idx]` 等の JS 否定を除外する。
const RE = /:![a-z]|![a-z][a-z0-9]*-[[a-z0-9]/g

/**
 * コメントを空白に潰す（行番号と桁位置は保つ）。
 * JSDoc / 行コメント中の記法例（例: `[&>[data-slot=header]]:!grid`）は
 * 実コードではないので検出対象から外す。
 */
function stripComments(src) {
  let out = ""
  let i = 0
  let state = "code" // code | line | block | squote | dquote | backtick
  while (i < src.length) {
    const c = src[i]
    const next = src[i + 1]
    if (state === "code") {
      if (c === "/" && next === "/") { state = "line"; out += "  "; i += 2; continue }
      if (c === "/" && next === "*") { state = "block"; out += "  "; i += 2; continue }
      if (c === "'") state = "squote"
      else if (c === '"') state = "dquote"
      else if (c === "`") state = "backtick"
      out += c; i++; continue
    }
    if (state === "line") {
      if (c === "\n") { state = "code"; out += c } else out += " "
      i++; continue
    }
    if (state === "block") {
      if (c === "*" && next === "/") { state = "code"; out += "  "; i += 2; continue }
      out += c === "\n" ? c : " "
      i++; continue
    }
    // 文字列内: エスケープを飛ばしつつ閉じ記号まで素通し（クラス名は文字列内にあるので残す）
    if (c === "\\") { out += c + (next ?? ""); i += 2; continue }
    if ((state === "squote" && c === "'") || (state === "dquote" && c === '"') || (state === "backtick" && c === "`")) {
      state = "code"
    }
    out += c; i++
  }
  return out
}

const hits = []
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) { walk(p); continue }
    if (!/\.(tsx?)$/.test(name)) continue // CSS の実 !important は対象外
    stripComments(readFileSync(p, "utf8")).split("\n").forEach((line, i) => {
      const m = line.match(RE)
      if (m) hits.push({ file: p.replace(srcDir + "/", "src/"), line: i + 1, found: [...new Set(m)].join(" ") })
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
