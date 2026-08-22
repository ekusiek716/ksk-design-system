#!/usr/bin/env node
/**
 * contracts/rules.json のスキーマ検証（issue #410）。
 *
 * rules.json は bin/lint.js の loadRules() が `typeof pattern === "string" &&
 * pattern.length > 0` でフィルタするため、pattern が空文字列のルールは
 * 一度も評価されず黙って無効化される。severity の綴り違いや壊れた正規表現も
 * bin/lint.js:483 付近の catch{continue} で無言スキップされる。
 * これらを npm run check で機械検査する。
 *
 * 検査項目:
 *   - id の一意性（prohibited + aiPatterns.patterns 全体）
 *   - severity ∈ {"error","warning"}（prohibited のみ。aiPatterns は
 *     bin/lint.js が固定で "warn" を付与するため対象外）
 *   - pattern が空でないこと、または machineCheckable: false が明示されて
 *     いること（原則ルールとして機械検査対象外と宣言する）
 *   - pattern が正規表現としてコンパイル可能なこと
 *   - meta.description の件数表現（「禁止パターンN件」「AIアンチパターンN件」）が
 *     実件数と一致すること（machineCheckable: false で除外したルールは
 *     件数から除く）
 *
 * 実行: node scripts/check-rules-contract.mjs（npm run check に組み込み済み）
 */

import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const ROOT = resolve(new URL("..", import.meta.url).pathname)
const RULES_PATH = resolve(ROOT, "contracts/rules.json")

const VALID_SEVERITIES = new Set(["error", "warning"])

const errors = []

const contract = JSON.parse(readFileSync(RULES_PATH, "utf8"))
const prohibited = Array.isArray(contract.prohibited) ? contract.prohibited : []
const aiPatterns = Array.isArray(contract.aiPatterns?.patterns) ? contract.aiPatterns.patterns : []

// ─── id の一意性 ──────────────────────────────────────────────

const seenIds = new Map()
for (const rule of [...prohibited, ...aiPatterns]) {
  if (!rule.id) {
    errors.push(`id が無いルールがある: ${JSON.stringify(rule).slice(0, 80)}`)
    continue
  }
  if (seenIds.has(rule.id)) {
    errors.push(`id が重複している: ${rule.id}`)
  }
  seenIds.set(rule.id, rule)
}

// ─── severity 語彙（prohibited のみ） ──────────────────────────

for (const rule of prohibited) {
  if (!VALID_SEVERITIES.has(rule.severity)) {
    errors.push(
      `${rule.id}: severity が不正（"${rule.severity}"）。許可値は ${[...VALID_SEVERITIES].join(" | ")}`,
    )
  }
}

// ─── pattern: 空 or machineCheckable:false の明示、コンパイル可能性 ──

let machineCheckedProhibited = 0
let machineCheckedAiPatterns = 0

for (const rule of prohibited) {
  const hasPattern = typeof rule.pattern === "string" && rule.pattern.length > 0
  if (!hasPattern) {
    if (rule.machineCheckable !== false) {
      errors.push(
        `${rule.id}: pattern が空だが machineCheckable: false が明示されていない` +
          `（bin/lint.js の loadRules に黙って捨てられ、一度も評価されない）`,
      )
    }
    continue
  }
  try {
    new RegExp(rule.pattern)
  } catch (error) {
    errors.push(`${rule.id}: pattern が正規表現としてコンパイル不能（${error.message}）`)
    continue
  }
  machineCheckedProhibited += 1
}

for (const rule of aiPatterns) {
  const hasPattern = typeof rule.pattern === "string" && rule.pattern.length > 0
  if (!hasPattern) {
    if (rule.machineCheckable !== false) {
      errors.push(
        `${rule.id}: pattern が空だが machineCheckable: false が明示されていない` +
          `（bin/lint.js の loadRules に黙って捨てられ、一度も評価されない）`,
      )
    }
    continue
  }
  try {
    new RegExp(rule.pattern)
  } catch (error) {
    errors.push(`${rule.id}: pattern が正規表現としてコンパイル不能（${error.message}）`)
    continue
  }
  machineCheckedAiPatterns += 1
}

// ─── meta.description の件数表現との整合 ────────────────────────

const description = contract.meta?.description ?? ""
const prohibitedMatch = description.match(/禁止パターン(\d+)件/)
const aiPatternMatch = description.match(/AIアンチパターン(\d+)件/)

if (prohibitedMatch && Number(prohibitedMatch[1]) !== prohibited.length) {
  errors.push(
    `meta.description の「禁止パターン${prohibitedMatch[1]}件」が実件数（${prohibited.length}）と一致しない`,
  )
}
if (aiPatternMatch && Number(aiPatternMatch[1]) !== aiPatterns.length) {
  errors.push(
    `meta.description の「AIアンチパターン${aiPatternMatch[1]}件」が実件数（${aiPatterns.length}）と一致しない。` +
      `machineCheckable: false のルールも「件」に含めるなら、その旨を description に明記する`,
  )
}

// ─── excludes 系のスキーマ準拠（issue #404） ────────────────────
//
// 除外語彙は用途ごとに分かれている:
//   excludePaths   … パスに当てる（全リポジトリで有効。".stories." 等）
//   excludeDsPaths … パスに当てるが DS パッケージ配下のファイルにだけ効く
//                    （"components/ui/" 等。consumer の同名ディレクトリでは効かない）
//   excludeLines   … 行の内容に当てる（"data-slot" / "asChild" 等）
// 旧スキーマの単一 excludes は bin/lint.js が後方互換で読むが、
// パスと内容を区別できないため rules.json 本体では使わせない。

const EXCLUDE_FIELDS = ["excludePaths", "excludeDsPaths", "excludeLines"]
/** パスらしい語（"/" を含むか、拡張子・ファイル名断片） */
const PATH_LIKE = /[/]|^\.[A-Za-z]/

for (const rule of [...prohibited, ...aiPatterns]) {
  for (const field of EXCLUDE_FIELDS) {
    if (rule[field] !== undefined && !Array.isArray(rule[field])) {
      errors.push(`${rule.id}: ${field} は配列でなければならない`)
    }
    for (const entry of Array.isArray(rule[field]) ? rule[field] : []) {
      if (typeof entry === "string" && entry.includes("\\")) {
        errors.push(
          `${rule.id}: ${field} に正規表現エスケープ痕がある（"${entry}"）。` +
            `${field} は bin/lint.js で literal 文字列として includes() 比較されるため、` +
            `エスケープ無しの literal 値に統一する（issue #463）`,
        )
      }
    }
  }
  if (rule.excludes !== undefined) {
    errors.push(
      `${rule.id}: 旧スキーマの excludes は使わない。` +
        `パス除外は excludePaths / excludeDsPaths、行内容の除外は excludeLines に分ける（issue #404）`,
    )
  }
  for (const entry of Array.isArray(rule.excludeLines) ? rule.excludeLines : []) {
    if (typeof entry === "string" && entry.includes("/") && !entry.includes("(")) {
      errors.push(
        `${rule.id}: excludeLines にパスらしい値がある（"${entry}"）。` +
          `パスは excludePaths / excludeDsPaths へ移す`,
      )
    }
  }
  for (const field of ["excludePaths", "excludeDsPaths"]) {
    for (const entry of Array.isArray(rule[field]) ? rule[field] : []) {
      if (typeof entry === "string" && !PATH_LIKE.test(entry)) {
        errors.push(
          `${rule.id}: ${field} にパスでない値がある（"${entry}"）。行内容の除外は excludeLines へ移す`,
        )
      }
    }
  }
}

// ─── 結果 ───────────────────────────────────────────────────

if (errors.length > 0) {
  console.error(`✗ contracts/rules.json のスキーマ検証で ${errors.length} 件のエラー\n`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

console.log(
  `✓ contracts/rules.json: id ${seenIds.size} 件重複なし / ` +
    `prohibited 機械検証可 ${machineCheckedProhibited}/${prohibited.length} 件 / ` +
    `aiPatterns 機械検証可 ${machineCheckedAiPatterns}/${aiPatterns.length} 件`,
)
