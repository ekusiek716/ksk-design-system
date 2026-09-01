#!/usr/bin/env node
/**
 * contracts/deprecations.json（正本）から MIGRATION.md の「非推奨 API 一覧」節を生成する。
 *
 *   node scripts/generate-migration-doc.mjs           # 書き込み
 *   node scripts/generate-migration-doc.mjs --check   # 手書きとのズレを検出（npm run check）
 *   node scripts/generate-migration-doc.mjs --strict  # 下記の「次のリリース」助言を error に昇格
 *
 * 生成範囲は MIGRATION.md 内のマーカー間だけ。マーカーの外は手書きのまま残る。
 *
 * あわせて、マーカーの外にある「### 次のリリース — ...」見出しのうち
 * **すでに公開済みのもの**を助言として報告する（issue #514 の振り返り）。
 * リリース時に版数へ書き換える運用が定着せず、v1 系の見出しが 11 個
 * 「次のリリース」のまま残っていたため。判定は git タグを正本にする
 * （最新の v タグ時点の MIGRATION.md に同じ見出しがある = その版で公開済み）。
 */

import { execFileSync } from "node:child_process"
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

const strict = process.argv.includes("--strict")

const NEXT_RELEASE_HEADING = /^#{2,4}\s+次のリリース\s*[—-].*$/gm

/** v タグのうち最も新しいもの。タグが引けない環境（shallow clone 等）では null。 */
function latestReleaseTag() {
  let out
  try {
    out = execFileSync("git", ["tag", "--list", "v*.*.*"], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
  } catch {
    return null
  }
  const parsed = out
    .split("\n")
    .map((line) => line.trim())
    .map((tag) => {
      const match = /^v(\d+)\.(\d+)\.(\d+)$/.exec(tag)
      return match ? { tag, parts: match.slice(1).map(Number) } : null
    })
    .filter(Boolean)
  if (parsed.length === 0) return null
  parsed.sort((a, b) => {
    for (let i = 0; i < 3; i += 1) {
      if (a.parts[i] !== b.parts[i]) return a.parts[i] - b.parts[i]
    }
    return 0
  })
  return parsed[parsed.length - 1].tag
}

function docAtTag(tag) {
  try {
    return execFileSync("git", ["show", `${tag}:MIGRATION.md`], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
  } catch {
    return null
  }
}

/**
 * 公開済みなのに「次のリリース」のまま残っている見出しを報告する。
 * 見出しの版数は書き手にしか分からないので自動では直さない（報告のみ）。
 *
 * @returns {number} 該当件数
 */
function reportStaleNextReleaseHeadings(currentDoc) {
  const headings = currentDoc.match(NEXT_RELEASE_HEADING) ?? []
  if (headings.length === 0) return 0

  const tag = latestReleaseTag()
  const released = tag ? docAtTag(tag) : null
  if (!released) {
    // shallow clone 等でタグが引けない環境。--strict では「検査したふりの成功」を
    // 返さず fail closed にする（PR #515 の Codex レビュー指摘）。
    if (strict) {
      console.error(
        `✗ --strict 指定ですが git タグから公開済み版の MIGRATION.md を読めません（fetch --tags で取得してから再実行）`,
      )
      process.exit(1)
    }
    console.log(
      `  [next-release] git タグから公開済み版の MIGRATION.md を読めないため判定をスキップします（見出し ${headings.length} 件）`,
    )
    return 0
  }

  // 最新の v タグ時点で既に存在する見出し = その版で公開済み。
  const stale = headings.filter((heading) => released.includes(heading))
  if (stale.length === 0) {
    console.log(`  [next-release] 「次のリリース」見出し ${headings.length} 件はすべて未公開分です`)
    return 0
  }

  const label = strict ? "✗" : "⚠"
  console.log("")
  console.log(
    `${label} 「次のリリース」のまま残っている公開済み見出しが ${stale.length} 件あります（${tag} 時点で公開済み）:`,
  )
  for (const heading of stale) {
    console.log(`    ${heading.trim()}`)
  }
  console.log("")
  console.log("  リリース時に「次のリリース」を実際の版数（例: 「### v1.62.0 — ...」）へ")
  console.log("  書き換える運用が漏れています。どの版で入ったかは git log / GitHub Release で")
  console.log("  確認して手で直してください（版数は自動判定できないため書き換えはしません）。")
  console.log("")
  return stale.length
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
  const stale = reportStaleNextReleaseHeadings(doc)
  process.exit(strict && stale > 0 ? 1 : 0)
}

if (next === doc) {
  console.log(`✓ MIGRATION.md は既に最新（${entries.length} 件）`)
} else {
  writeFileSync(DOC_PATH, next)
  console.log(`✓ MIGRATION.md の「非推奨 API 一覧」節を更新しました（${entries.length} 件）`)
}

const staleCount = reportStaleNextReleaseHeadings(next)
if (strict && staleCount > 0) process.exit(1)
