#!/usr/bin/env node

// ksk-design-system CLI
// Consumer プロジェクトに AI (Claude / Codex) 向けルールファイルを設置する。
// AI エージェントは node_modules 配下のファイルを自動で読まないため、
// プロジェクトルートに AGENTS.md / CLAUDE.md（node_modules 内の DS ルールを
// 参照する薄いポインタ）を置く必要がある。
//
// Usage:
//   npx ksk-design-system init          # AGENTS.md + CLAUDE.md を設置
//   npx ksk-design-system init --force  # 既存ファイルを上書き
//   npx ksk-design-system demo [dir]    # DS リポを clone + setup（お試し用）
//   npx ksk-ds lint src                 # contracts/rules.json に基づき consumer UI を検査
//   npx ksk-ds check-duplicates src     # DS と同名のローカル実装を検査
//   npx ksk-design-system postinstall   # npm postinstall から呼ばれる silent モード

import { copyFileSync, existsSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(__dirname, "..")

const args = process.argv.slice(2)
const cmd = args[0] || "init"
const force = args.includes("--force")

if (cmd === "help" || cmd === "--help" || cmd === "-h") {
  console.log(`ksk-design-system CLI

使い方:
  npx ksk-design-system init          AI ルールファイルを設置
  npx ksk-design-system init --force  既存ファイルを上書き
  npx ksk-design-system demo [dir]    DS リポを clone + npm install（お試し）
                                      dir 省略時は ./ksk-ds-demo
  npx ksk-ds lint src                 DS-first ルール違反を検査
  npx ksk-ds lint src --format json   CI 向け JSON 出力
  npx ksk-ds lint --changed           Git 差分のみ検査
  npx ksk-ds check-migration ./src    非推奨 API の残存を検査（read-only）
  npx ksk-ds check-duplicates [DIR]    DS と同名のローカル実装を検査
  npx ksk-ds check-duplicates --strict 検出時に exit 1（CI 向け）
`)
  process.exit(0)
}

if (cmd === "lint") {
  const { runLintCli } = await import("./lint.js")
  const status = await runLintCli(args.slice(1), { cwd: process.cwd(), pkgRoot })
  process.exit(status)
}

if (cmd === "check-migration") {
  const { runCheckMigrationCli } = await import("../scripts/codemod/check-migration.mjs")
  const status = runCheckMigrationCli(args.slice(1))
  process.exit(status)
}

if (cmd === "check-duplicates") {
  const { runCheckDuplicatesCli } = await import("./check-duplicates.js")
  const status = runCheckDuplicatesCli(args.slice(1), {
    cwd: process.cwd(),
    pkgRoot,
  })
  process.exit(status)
}

if (cmd === "demo") {
  runDemo(args.slice(1))
  process.exit(0)
}

if (cmd !== "init" && cmd !== "postinstall") {
  console.error(`未知のコマンド: ${cmd}`)
  console.error(`npx ksk-design-system help を参照してください`)
  process.exit(1)
}

function runDemo(rest) {
  const consumerCwd = process.cwd()
  const targetDir = rest.find((a) => !a.startsWith("--")) || "ksk-ds-demo"
  const absDir = resolve(consumerCwd, targetDir)

  if (existsSync(absDir)) {
    console.error(`\n✗ ${absDir} は既に存在します`)
    console.error(`  別名を指定するか、既存フォルダを削除してください`)
    process.exit(1)
  }

  console.log(`\n📦 KSK Design System Demo を ${targetDir}/ に展開します\n`)

  // git clone --depth=1
  const cloneRes = spawnSync(
    "git",
    [
      "clone",
      "--depth=1",
      "https://github.com/ekusiek716/ksk-design-system.git",
      targetDir,
    ],
    { stdio: "inherit", cwd: consumerCwd },
  )
  if (cloneRes.status !== 0) {
    console.error("\n✗ git clone に失敗しました")
    process.exit(1)
  }

  // npm install
  console.log(`\n→ npm install を実行中（数分かかります）...\n`)
  const instRes = spawnSync("npm", ["install"], {
    stdio: "inherit",
    cwd: absDir,
  })
  if (instRes.status !== 0) {
    console.error("\n✗ npm install に失敗しました")
    process.exit(1)
  }

  console.log(`\n✓ セットアップ完了\n`)
  console.log(`次のステップ:\n`)
  console.log(`  cd ${targetDir}`)
  console.log(`  npm run dev          # → http://localhost:5173 で全プロトタイプが触れる`)
  console.log(`  npm run storybook    # → http://localhost:6010 で全コンポーネントカタログ`)
  console.log(``)
  console.log(`💡 Claude Code をこのディレクトリで開くと /mock コマンドが使えます:`)
  console.log(`   /mock https://notion.so/your-spec`)
  console.log(`   /mock 「ECサイトの商品詳細画面」`)
  console.log(`   → DS 準拠のモックが src/prototypes/ に自動生成`)
  console.log(``)
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
  console.log("ksk-design-system init")
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
    console.log(`[ksk-design-system] ${dest} をプロジェクトルートに設置しました`)
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
  2. UI を作る前に必ず node_modules/ksk-design-system/{AGENTS.md,CLAUDE.md,contracts/*,tokens.json} を AI に読ませる
  3. スクラッチコード（ハードコードカラー・余白・角丸等）を書かない運用を徹底する
`)
}
