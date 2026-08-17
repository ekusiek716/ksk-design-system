#!/usr/bin/env node
/**
 * contracts/deprecations.json（非推奨 API の正本台帳）と、実ソースの
 * `@deprecated` JSDoc の整合を検査する。
 *
 * 台帳が腐ると check-migration の残件カウントが嘘になり、
 * 「もう消してよい」の判断を誤る。両方向で照合する:
 *   1. 台帳のエントリ → sources に挙げたファイルに、その prop / export の
 *      `@deprecated` JSDoc が実在するか
 *   2. src 配下の `@deprecated` 宣言 → 台帳に対応エントリがあるか
 * さらにスキーマ（必須フィールド・id の一意性・meta.counts）も検査する。
 *
 * 実行: node scripts/check-deprecations.mjs（npm run check に組み込み済み）
 */

import { existsSync, readFileSync, readdirSync } from "node:fs"
import { extname, join, relative, resolve } from "node:path"
import ts from "typescript"

const ROOT = resolve(new URL("..", import.meta.url).pathname)
const LEDGER_PATH = join(ROOT, "contracts/deprecations.json")
const SRC_DIR = join(ROOT, "src")
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"])

const REQUIRED_FIELDS = ["id", "kind", "since", "replacement", "removeIn", "sources"]

const errors = []

// ─── 台帳を読む ─────────────────────────────────────────────

const ledger = JSON.parse(readFileSync(LEDGER_PATH, "utf8"))
const entries = ledger.deprecations ?? []

const seen = new Set()
for (const entry of entries) {
  const label = entry.id ?? JSON.stringify(entry)
  for (const field of REQUIRED_FIELDS) {
    if (entry[field] === undefined) errors.push(`${label}: 必須フィールド ${field} がない`)
  }
  if (seen.has(entry.id)) errors.push(`${label}: id が重複している`)
  seen.add(entry.id)

  if (entry.kind === "prop") {
    if (!entry.component || !entry.prop) {
      errors.push(`${label}: kind=prop には component と prop が必要`)
    } else if (entry.id !== `${entry.component}.${entry.prop}`) {
      errors.push(`${label}: id は "Component.prop" の形にする`)
    }
  } else if (entry.kind === "export") {
    if (!entry.identifier) errors.push(`${label}: kind=export には identifier が必要`)
    else if (entry.id !== entry.identifier) errors.push(`${label}: id は identifier と同じにする`)
  } else {
    errors.push(`${label}: kind は prop | export のいずれか（現在: ${entry.kind}）`)
  }

  if (!Array.isArray(entry.sources) || entry.sources.length === 0) {
    errors.push(`${label}: sources を 1 件以上書く`)
  }
}

const counts = ledger.meta?.counts ?? {}
if (counts.total !== entries.length) {
  errors.push(`meta.counts.total が実エントリ数と一致しない（${counts.total} != ${entries.length}）`)
}
for (const kind of ["prop", "export"]) {
  const actual = entries.filter((e) => e.kind === kind).length
  if (counts[kind] !== actual) {
    errors.push(`meta.counts.${kind} が実数と一致しない（${counts[kind]} != ${actual}）`)
  }
}

// ─── src の @deprecated 宣言を集める ────────────────────────

function collectSourceFiles(dir) {
  const results = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...collectSourceFiles(full))
    } else if (SOURCE_EXTENSIONS.has(extname(entry.name)) && !entry.name.endsWith(".stories.tsx")) {
      results.push(full)
    }
  }
  return results
}

/** 宣言に @deprecated JSDoc が付いているか */
function isDeprecated(node) {
  return ts
    .getJSDocTags(node)
    .some((tag) => tag.tagName.getText() === "deprecated")
}

function declaredName(node) {
  const name = node.name
  if (!name) return null
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) return name.text
  return null
}

/** ファイル内の `@deprecated` 宣言を { name, file } で列挙する */
function collectDeprecatedDeclarations(file) {
  const source = readFileSync(file, "utf8")
  if (!source.includes("@deprecated")) return []
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )
  const found = []
  const visit = (node) => {
    const named =
      ts.isPropertySignature(node) ||
      ts.isPropertyDeclaration(node) ||
      ts.isMethodSignature(node) ||
      ts.isVariableDeclaration(node) ||
      ts.isFunctionDeclaration(node) ||
      ts.isTypeAliasDeclaration(node) ||
      ts.isInterfaceDeclaration(node) ||
      ts.isClassDeclaration(node) ||
      ts.isEnumDeclaration(node)
    if (named && isDeprecated(node)) {
      const name = declaredName(node)
      if (name) found.push({ name, file: relative(ROOT, file) })
    }
    ts.forEachChild(node, visit)
  }
  ts.forEachChild(sourceFile, visit)
  return found
}

const declarations = collectSourceFiles(SRC_DIR).flatMap(collectDeprecatedDeclarations)

// ─── 方向 1: 台帳 → 実ソース ────────────────────────────────

for (const entry of entries) {
  const wanted = entry.kind === "prop" ? entry.prop : entry.identifier
  for (const source of entry.sources ?? []) {
    const abs = join(ROOT, source)
    if (!existsSync(abs)) {
      errors.push(`${entry.id}: sources のファイルが存在しない（${source}）`)
      continue
    }
    const hit = declarations.some((d) => d.file === source && d.name === wanted)
    if (!hit) {
      errors.push(
        `${entry.id}: ${source} に ${wanted} の @deprecated JSDoc が見つからない（互換を消したなら台帳からも消す）`,
      )
    }
  }
}

// ─── 方向 2: 実ソース → 台帳 ────────────────────────────────

const ledgerPairs = new Set(
  entries.flatMap((entry) => {
    const wanted = entry.kind === "prop" ? entry.prop : entry.identifier
    return (entry.sources ?? []).map((source) => `${source}::${wanted}`)
  }),
)

const uncovered = declarations
  .filter((d) => !ledgerPairs.has(`${d.file}::${d.name}`))
  .map((d) => `${d.file} の ${d.name} が contracts/deprecations.json に無い`)

// 同じ宣言が overload / union 分岐で複数回出るのは重複させない
errors.push(...[...new Set(uncovered)])

// ─── 結果 ───────────────────────────────────────────────────

if (errors.length > 0) {
  console.error(`✗ contracts/deprecations.json と実ソースが乖離しています（${errors.length} 件）\n`)
  for (const error of errors) console.error(`  - ${error}`)
  console.error(`\n台帳を更新するか、実装側の @deprecated を見直してください。`)
  process.exit(1)
}

console.log(
  `✓ contracts/deprecations.json: ${entries.length} 件が実ソースの @deprecated と一致（宣言 ${declarations.length} 件）`,
)
