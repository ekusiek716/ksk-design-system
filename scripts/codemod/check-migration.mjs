#!/usr/bin/env node
/**
 * check-migration — 非推奨 API の残存を検査する read-only CLI
 *
 * eslint/deprecated.js の DEPRECATED（正本）を再利用し、
 * 利用側プロジェクトの DS 参照ファイルに非推奨識別子が残っていないか数える。
 *
 * 使い方:
 *   node scripts/codemod/check-migration.mjs [targetDir]   # デフォルト ./src
 *   npx ksk-design-system check-migration ./src
 *
 * 注意:
 *   - 完全 read-only。ファイルの書き換えは行わない
 *   - 正規表現ベースの識別子カウントなので 100% 正確ではない（目安として使う）
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { DEPRECATED } from "../../eslint/deprecated.js"

const TARGET_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"])
const IGNORED_DIRS = new Set(["node_modules", "dist"])
const DS_REFERENCE_PATTERN = /ksk-design-system/

/**
 * 対象ディレクトリを再帰走査し、検査対象ファイルの絶対パス一覧を返す。
 * node_modules / dist / 隠しディレクトリは除外。
 */
export function collectFiles(dir) {
  const results = []
  if (!fs.existsSync(dir)) return results

  const stack = [dir]
  while (stack.length > 0) {
    const current = stack.pop()
    const entries = fs.readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entry.name)) continue
        stack.push(full)
      } else if (TARGET_EXTENSIONS.has(path.extname(entry.name))) {
        results.push(full)
      }
    }
  }
  return results
}

/**
 * targetDir 配下から、非推奨識別子の出現件数を集計する。
 * DS 未参照ファイル（"ksk-design-system" 文字列を含まない）はスキップ。
 *
 * @param {string} targetDir
 * @param {Array<{identifier: string}>} deprecated
 * @returns {{ total: number, byIdentifier: Array<{identifier: string, count: number}>, filesScanned: number }}
 */
export function checkMigration(targetDir, deprecated = DEPRECATED) {
  const files = collectFiles(targetDir)
  const counts = new Map(deprecated.map((entry) => [entry.identifier, 0]))
  let filesScanned = 0

  for (const file of files) {
    const source = fs.readFileSync(file, "utf-8")
    if (!DS_REFERENCE_PATTERN.test(source)) continue
    filesScanned++

    for (const entry of deprecated) {
      const re = new RegExp(`\\b${entry.identifier}\\b`, "g")
      const matches = source.match(re)
      if (matches) {
        counts.set(entry.identifier, (counts.get(entry.identifier) || 0) + matches.length)
      }
    }
  }

  const byIdentifier = [...counts.entries()]
    .filter(([, count]) => count > 0)
    .map(([identifier, count]) => ({ identifier, count }))
    .sort((a, b) => b.count - a.count)

  const total = byIdentifier.reduce((sum, entry) => sum + entry.count, 0)

  return { total, byIdentifier, filesScanned }
}

/**
 * CLI 実行本体。結果を stdout に出力し、exit code を返す（プロセス終了はしない）。
 */
export function runCheckMigrationCli(argv, { deprecated = DEPRECATED } = {}) {
  const targetDir = argv.find((a) => !a.startsWith("--")) || "./src"
  const resolvedDir = path.resolve(targetDir)

  console.log(`\nksk-design-system check-migration`)
  console.log(`  対象: ${resolvedDir}`)

  if (!fs.existsSync(resolvedDir)) {
    console.error(`\n✗ ディレクトリが見つかりません: ${resolvedDir}`)
    return 1
  }

  const { total, byIdentifier, filesScanned } = checkMigration(resolvedDir, deprecated)

  console.log(`  DS 参照ファイル: ${filesScanned}`)
  console.log("")

  if (total === 0) {
    console.log(`✅ 移行完了。非推奨 API の残存は見つかりませんでした。`)
    return 0
  }

  console.log(`⚠ 非推奨 API が ${total} 件見つかりました:\n`)
  console.log(`  件数  識別子`)
  for (const { identifier, count } of byIdentifier) {
    console.log(`  ${count.toString().padStart(4)}  ${identifier}`)
  }
  console.log(`\n移行方法は codemod/MIGRATION.md を参照してください。`)
  console.log(`  npx ksk-design-system codemod <name> ${targetDir}`)

  return 1
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isMain) {
  const status = runCheckMigrationCli(process.argv.slice(2))
  process.exit(status)
}
