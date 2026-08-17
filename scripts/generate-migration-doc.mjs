#!/usr/bin/env node
/**
 * contracts/deprecations.json（正本）から MIGRATION.md の「非推奨 API 一覧」節を生成する。
 *
 *   node scripts/generate-migration-doc.mjs          # 書き込み
 *   node scripts/generate-migration-doc.mjs --check  # 手書きとのズレを検出（npm run check）
 *
 * 生成範囲は MIGRATION.md 内のマーカー間だけ。マーカーの外は手書きのまま残る。
 */

import { readFileSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"

const ROOT = resolve(new URL("..", import.meta.url).pathname)
const LEDGER_PATH = join(ROOT, "contracts/deprecations.json")
const DOC_PATH = join(ROOT, "MIGRATION.md")

const START = "<!-- deprecations:start（自動生成・手で編集しない） -->"
const END = "<!-- deprecations:end -->"

const check = process.argv.includes("--check")

const ledger = JSON.parse(readFileSync(LEDGER_PATH, "utf8"))
const entries = ledger.deprecations ?? []

function escapeCell(text) {
  return String(text).replace(/\|/g, "\\|").replace(/\n/g, " ")
}

function usageLabel(entry) {
  return entry.kind === "prop"
    ? `\`<${entry.component} ${entry.prop}>\``
    : `\`import { ${entry.identifier} }\``
}

function render() {
  const lines = []
  lines.push(START)
  lines.push("")
  lines.push("## 非推奨 API 一覧")
  lines.push("")
  lines.push(
    "正本は [`contracts/deprecations.json`](./contracts/deprecations.json)。この節はそこから生成しています。",
  )
  lines.push("")
  lines.push("消費側での残存件数は次のコマンドで数えられます（read-only・残件があれば exit 1）:")
  lines.push("")
  lines.push("```bash")
  lines.push("npx ksk-ds check-migration ./src")
  lines.push("```")
  lines.push("")

  if (entries.length === 0) {
    lines.push("現時点で非推奨の API はありません。")
  } else {
    lines.push("| API | 使われ方 | 移行先 | 非推奨にした版 | 削除予定 |")
    lines.push("| --- | --- | --- | --- | --- |")
    for (const entry of entries) {
      lines.push(
        `| \`${escapeCell(entry.id)}\` | ${usageLabel(entry)} | ${escapeCell(
          entry.replacement,
        )} | ${escapeCell(entry.since)} | v${escapeCell(entry.removeIn)} |`,
      )
    }
    lines.push("")
    lines.push("各エントリの補足:")
    lines.push("")
    for (const entry of entries) {
      const issue = entry.issue ? `（issue ${entry.issue}）` : ""
      const note = entry.note ? ` ${entry.note}` : ""
      lines.push(`- **${entry.id}**${issue} —${note} 実装: ${entry.sources.join(" / ")}`)
    }
  }

  lines.push("")
  lines.push(
    "削除は「全消費リポで `check-migration` の残件が 0」を条件に、`削除予定` のメジャーリリースで行います。",
  )
  lines.push("")
  lines.push(END)
  return lines.join("\n")
}

const doc = readFileSync(DOC_PATH, "utf8")
const startIndex = doc.indexOf(START)
const endIndex = doc.indexOf(END)

if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
  console.error(`✗ MIGRATION.md に生成マーカーがありません。次の 2 行を追加してください:`)
  console.error(`  ${START}`)
  console.error(`  ${END}`)
  process.exit(1)
}

const next = doc.slice(0, startIndex) + render() + doc.slice(endIndex + END.length)

if (check) {
  if (next !== doc) {
    console.error(`✗ MIGRATION.md が contracts/deprecations.json と乖離しています`)
    console.error(`  修正: node scripts/generate-migration-doc.mjs`)
    process.exit(1)
  }
  console.log(`✓ MIGRATION.md は contracts/deprecations.json と一致`)
  process.exit(0)
}

if (next === doc) {
  console.log(`✓ MIGRATION.md は既に最新（${entries.length} 件）`)
} else {
  writeFileSync(DOC_PATH, next)
  console.log(`✓ MIGRATION.md の「非推奨 API 一覧」節を更新しました（${entries.length} 件）`)
}
