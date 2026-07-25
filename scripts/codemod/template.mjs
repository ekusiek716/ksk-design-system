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

/**
 * 対象パッケージを**実際に読み込んでいる**ファイルだけを処理。
 *
 * v1.34.0 で `@ksk/design-system` → `ksk-design-system` に改名したため両対応。
 *
 * 判定は「import / export ... from / import() / require() の構文に現れる
 * モジュール指定子」に限定する。ここを緩めると、
 *   - `my-ksk-design-system-plugin` からの import（部分一致）
 *   - `const packageName = "ksk-design-system"` のような単なる文字列
 *   - DS に言及しているだけのコメント
 * を持つファイルまで対象になり、パッケージを使っていないのに RENAMES の
 * 識別子が全部書き換わる（consumer のコードが壊れる）。
 */
const PACKAGE_NAME = String.raw`(?:@ksk\/design-system|ksk-design-system)(?:\/[^"']*)?`
const PACKAGE_PATTERN = new RegExp(
  [
    // import ... from "pkg" / export ... from "pkg" / import "pkg"
    String.raw`\bfrom\s*["']${PACKAGE_NAME}["']`,
    String.raw`\bimport\s*["']${PACKAGE_NAME}["']`,
    // import("pkg") / require("pkg")
    String.raw`\b(?:import|require)\s*\(\s*["']${PACKAGE_NAME}["']\s*\)`,
  ].join("|"),
)

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

/**
 * 行コメント / ブロックコメントを空白に潰す（判定用。書き換えには使わない）。
 * この codemod は consumer に配布されるので、依存を増やさず自己完結させる。
 */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    // URL の `//`（`https://…`）は残す。直前が `:` でない `//` だけを落とす
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1")
}

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

  // 対象パッケージを使っていないファイルはスキップ。
  // コメントアウトされた import（`// import "ksk-design-system"`）や
  // ドキュメント用の例で判定が立つと、パッケージを使っていないファイルの
  // 識別子まで全部書き換わるので、判定はコメントを除いた本文で行う。
  if (!PACKAGE_PATTERN.test(stripComments(original))) continue

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
