#!/usr/bin/env node
/**
 * Codemod テンプレート — ksk-design-system 破壊変更時に複製して使う
 *
 * 使い方:
 *   cp scripts/codemod/template.mjs scripts/codemod/v1-to-v2.mjs
 *   # RENAMES と PACKAGE_PATTERN を編集
 *   node scripts/codemod/v1-to-v2.mjs --dry ../my-app/src   # 事前確認
 *   node scripts/codemod/v1-to-v2.mjs       ../my-app/src   # 実行
 *
 * 利用側プロジェクトへの公開:
 *   npx ksk-design-system codemod v1-to-v2 ./src
 *   または
 *   node node_modules/ksk-design-system/scripts/codemod/v1-to-v2.mjs ./src
 *
 * 注意:
 *   - 正規表現ベースなので 100% 正確ではない（複雑なケースは手動確認推奨）
 *   - --dry オプションで事前確認可能
 *   - 必ずコミット済みの状態で実行すること（git diff で変更確認）
 */

import fs from "node:fs"
import path from "node:path"

// ============================================================
// このテンプレートを複製した後、ここを編集してください
// ============================================================

/** 対象パッケージの import 文を含むファイルだけを処理 */
const PACKAGE_PATTERN = /@ksk\/design-system/

/** 単純な識別子 rename: [oldName, newName] */
const RENAMES = [
  // 例:
  // ["OldComponent", "NewComponent"],
  // ["OldComponentProps", "NewComponentProps"],
]

/** prop 名 rename: [componentName, oldProp, newProp] */
const PROP_RENAMES = [
  // 例:
  // ["Button", "kind", "variant"],
]

/** 手動移行が必要な箇所の警告 */
const WARNINGS = [
  // { pattern: /\bOldThing\b/, message: "OldThing は廃止されました。NewThing への移行ガイドは MIGRATION.md を参照。" },
]

// ============================================================
// CLI 引数
// ============================================================

const args = process.argv.slice(2)
const dry = args.includes("--dry")
const targetDir = args.find((a) => !a.startsWith("--")) || "./src"

if (!fs.existsSync(targetDir)) {
  console.error(`✗ Directory not found: ${targetDir}`)
  process.exit(1)
}

console.log(`\n🔧 ksk-design-system codemod`)
console.log(`   Target: ${path.resolve(targetDir)}`)
console.log(`   Mode:   ${dry ? "DRY RUN (no changes written)" : "APPLY"}`)
console.log("")

// 長い名前から順にマッチさせる（部分マッチ防止）
const sortedRenames = [...RENAMES].sort((a, b) => b[0].length - a[0].length)

// ============================================================
// ファイル探索
// ============================================================

function findFiles(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name.startsWith(".")) continue
      results.push(...findFiles(full))
    } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) {
      results.push(full)
    }
  }
  return results
}

// ============================================================
// 変換
// ============================================================

let totalFiles = 0
let totalChanges = 0
const fileChanges = []

for (const file of findFiles(targetDir)) {
  const original = fs.readFileSync(file, "utf-8")
  let updated = original
  let fileChangeCount = 0

  // 対象パッケージを使っていないファイルはスキップ
  if (!PACKAGE_PATTERN.test(original)) continue

  // 識別子 rename
  for (const [oldName, newName] of sortedRenames) {
    const re = new RegExp(`\\b${oldName}\\b`, "g")
    const matches = updated.match(re)
    if (matches) {
      updated = updated.replace(re, newName)
      fileChangeCount += matches.length
    }
  }

  // prop rename
  for (const [componentName, oldProp, newProp] of PROP_RENAMES) {
    // <Component oldProp= → <Component newProp=
    const re = new RegExp(`(<${componentName}[^>]*\\s)${oldProp}=`, "g")
    const matches = updated.match(re)
    if (matches) {
      updated = updated.replace(re, `$1${newProp}=`)
      fileChangeCount += matches.length
    }
  }

  // 警告のみ
  for (const { pattern, message } of WARNINGS) {
    if (pattern.test(original)) {
      console.log(`  ⚠ ${file}`)
      console.log(`     ${message}`)
    }
  }

  if (fileChangeCount > 0) {
    totalFiles++
    totalChanges += fileChangeCount
    fileChanges.push({ file, count: fileChangeCount })
    if (!dry) {
      fs.writeFileSync(file, updated, "utf-8")
    }
  }
}

// ============================================================
// 結果
// ============================================================

console.log(`\n📊 結果`)
console.log(`   ファイル: ${totalFiles}`)
console.log(`   置換数:   ${totalChanges}`)
console.log("")

if (totalFiles > 0) {
  for (const { file, count } of fileChanges) {
    console.log(`  ${dry ? "[dry]" : "✓"}  ${count.toString().padStart(3)} 件: ${path.relative(process.cwd(), file)}`)
  }
  if (dry) {
    console.log(`\n💡 --dry を外すと実際に書き込みます。`)
  } else {
    console.log(`\n✅ 完了。git diff で変更を確認してください。`)
  }
} else {
  console.log(`変更対象なし。`)
}
