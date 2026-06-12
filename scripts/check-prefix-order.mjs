#!/usr/bin/env node
// =============================================================
// KSK Design System — ベンダープレフィックス宣言順チェック
//
// 同一ルール内に標準プロパティと -webkit- 版の両方を書く場合、
// 「-webkit- が先 → 標準が後」でなければならない（Tailwind の出力順）。
//
// 消費側の本番 CSS minifier（Next.js / cssnano 系）は両者を同一
// プロパティとして dedupe し「後に書いた方」だけを残す。標準形を先に
// 書くと minify 後に -webkit- だけが残り、エイリアス非対応の Firefox
// で backdrop-filter 等が静かに無効化される（yokoku-app 本番で実害、
// 2026-06-12）。dev サーバーは未 minify のため手元では再現しない。
//
// src/**/*.css の各ルールブロックを走査し、標準形が -webkit- 形より
// 先に宣言されているペアを検出して CI で失敗させる。
//
// 実行: node scripts/check-prefix-order.mjs
// =============================================================
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, dirname, relative } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const srcDir = join(root, "src")

const cssFiles = []
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      walk(p)
      continue
    }
    if (/\.css$/.test(name)) cssFiles.push(p)
  }
}
walk(srcDir)

const hits = []
for (const file of cssFiles) {
  const text = readFileSync(file, "utf8")
  // ルールブロック単位で見る（コメントは除去してから）。ネストや
  // @media は「{ から } まで」の最内ブロックだけ取れれば十分 —
  // 宣言は常に最内ブロックに属するため。
  const stripped = text.replace(/\/\*[\s\S]*?\*\//g, (m) =>
    m.replace(/[^\n]/g, " "),
  )
  const blockRe = /{[^{}]*}/g
  let m
  while ((m = blockRe.exec(stripped)) !== null) {
    const block = m[0]
    const declRe = /(?:^|[{;])\s*(-webkit-)?([a-z-]+)\s*:/g
    const seenStandardAt = new Map() // prop -> 宣言の出現位置
    let d
    while ((d = declRe.exec(block)) !== null) {
      const isWebkit = Boolean(d[1])
      const prop = d[2]
      if (!isWebkit) {
        seenStandardAt.set(prop, d.index)
      } else if (seenStandardAt.has(prop)) {
        // 標準形が先に出てから -webkit- 形が来た = NG 順
        const upto = stripped.slice(0, m.index + d.index)
        const line = upto.split("\n").length
        hits.push(
          `${relative(root, file)}:${line} — ` +
            `「${prop}」が「-webkit-${prop}」より先に宣言されています`,
        )
      }
    }
  }
}

if (hits.length > 0) {
  console.error("✗ ベンダープレフィックスの宣言順が不正です（-webkit- を先、標準形を後に）:")
  for (const h of hits) console.error(`  ${h}`)
  console.error(
    "\n  理由: 消費側の CSS minifier が同一プロパティとして dedupe し後勝ちのみ残すため、" +
      "\n  標準形が消えて Firefox で無効化される。詳細は scripts/check-prefix-order.mjs 冒頭。",
  )
  process.exit(1)
}

console.log(`✓ ベンダープレフィックス宣言順 OK（${cssFiles.length} CSS ファイル走査）`)
