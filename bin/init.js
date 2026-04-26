#!/usr/bin/env node

// @ksk/design-system init
// Consumer プロジェクトに AI (Claude / Codex) 向けルールファイルを設置する。
// AI エージェントは node_modules 配下のファイルを自動で読まないため、
// プロジェクトルートに AGENTS.md / CLAUDE.md（node_modules 内の DS ルールを
// 参照する薄いポインタ）を置く必要がある。
//
// Usage:
//   npx ksk-ds init          # AGENTS.md + CLAUDE.md を設置
//   npx ksk-ds init --force  # 既存ファイルを上書き
//   npx ksk-ds postinstall   # npm postinstall から呼ばれる silent モード

import { copyFileSync, existsSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(__dirname, "..")

const args = process.argv.slice(2)
const cmd = args[0] || "init"
const force = args.includes("--force")

if (cmd === "help" || cmd === "--help" || cmd === "-h") {
  console.log(`@ksk/design-system CLI

使い方:
  npx ksk-ds init          AI ルールファイルを設置
  npx ksk-ds init --force  既存ファイルを上書き
`)
  process.exit(0)
}

if (cmd !== "init" && cmd !== "postinstall") {
  console.error(`未知のコマンド: ${cmd}`)
  console.error(`npx ksk-ds help を参照してください`)
  process.exit(1)
}

// ─── postinstall モードのガード ─────────────────────────────
// INIT_CWD は npm install が実行されたディレクトリ（consumer のルート）。
// 未設定、または pkgRoot と同じ場合は DS 自身のインストールコンテキストなのでスキップ。
const isPostinstall = cmd === "postinstall"
const consumerRoot = process.env.INIT_CWD || process.cwd()

if (isPostinstall) {
  // DS 自身を開発している場合（INIT_CWD が pkgRoot）はスキップ
  if (!process.env.INIT_CWD || resolve(consumerRoot) === pkgRoot) {
    process.exit(0)
  }
  // consumer のルートに package.json が無ければスキップ（安全のため）
  if (!existsSync(join(consumerRoot, "package.json"))) {
    process.exit(0)
  }
}

const files = [
  { src: "templates/AGENTS.md", dest: "AGENTS.md", label: "Codex 用" },
  { src: "templates/CLAUDE.md", dest: "CLAUDE.md", label: "Claude Code 用" },
]

if (!isPostinstall) {
  console.log("@ksk/design-system init")
  console.log("AI (Claude / Codex) 向けルールファイルを設置します。\n")
}

let created = 0
let skipped = 0

for (const { src, dest, label } of files) {
  const srcPath = join(pkgRoot, src)
  const destPath = join(consumerRoot, dest)

  if (!existsSync(srcPath)) {
    if (!isPostinstall) {
      console.error(`  ✗ テンプレートが見つかりません: ${srcPath}`)
    }
    process.exit(isPostinstall ? 0 : 1)
  }

  if (existsSync(destPath) && !force) {
    if (!isPostinstall) {
      console.log(`  ⏭  ${dest} は既に存在するためスキップ（--force で上書き）`)
    }
    skipped++
    continue
  }

  copyFileSync(srcPath, destPath)
  if (isPostinstall) {
    console.log(`[@ksk/design-system] ${dest} をプロジェクトルートに設置しました`)
  } else {
    console.log(`  ✓ ${dest} を設置しました（${label}）`)
  }
  created++
}

if (isPostinstall) {
  process.exit(0)
}

console.log(`\n完了: ${created} 作成 / ${skipped} スキップ`)

if (created > 0) {
  console.log(`
次のステップ:
  1. AI (Claude Code / Codex) を再起動してルールを読み込ませる
  2. UI を作る前に必ず node_modules/@ksk/design-system/{AGENTS.md,CLAUDE.md,contracts/*,tokens.json} を AI に読ませる
  3. スクラッチコード（ハードコードカラー・余白・角丸等）を書かない運用を徹底する
`)
}
