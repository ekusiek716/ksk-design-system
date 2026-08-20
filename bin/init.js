#!/usr/bin/env node

// ksk-design-system CLI
// Consumer プロジェクトに AI (Claude / Codex) 向けルールファイルを設置する。
// AI エージェントは node_modules 配下のファイルを自動で読まないため、
// プロジェクトルートに AGENTS.md / CLAUDE.md（node_modules 内の DS ルールを
// 参照する薄いポインタ）を置く必要がある。
//
// 設置は **明示実行のみ**（`npx ksk-ds init`）。install 時に自動で置く
// postinstall フックは v1.60.0 で廃止した。install-time にプロジェクトルートへ
// AI 指示ファイルを書き込む挙動は、サプライチェーン検査で
// 「同意なき AI エージェント制御面の設置」として Critical 判定されるため
// （LPM Firewall が 1.49.2 / 1.51.1 をこの理由でブロック判定）。
//
// Usage:
//   npx ksk-design-system init          # AGENTS.md + CLAUDE.md を設置
//   npx ksk-design-system init --force  # 既存ファイルを上書き
//   npx ksk-design-system demo [dir]    # DS リポを clone + setup（お試し用）
//   npx ksk-ds lint src                 # contracts/rules.json に基づき consumer UI を検査
//   npx ksk-ds check-duplicates src     # DS と同名のローカル実装を検査
//   npx ksk-ds codemod <name> ./src     # scripts/codemod/<name>.mjs を実行

import { copyFileSync, existsSync, readdirSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(__dirname, "..")

const args = process.argv.slice(2)
const cmd = args[0] || "init"
const force = args.includes("--force")

/** scripts/codemod/ 配下にあるが codemod として呼べないもの（雛形・読み取り専用スキャナ） */
const NON_CODEMOD = new Set(["template", "check-migration"])

/**
 * 出力を掃いてから終了する（issue #394）。
 *
 * stdout がパイプのとき Node の書き込みは非同期で、process.exit() は未フラッシュ分を
 * 捨てる。`ksk-ds lint --format json | jq` のように出力が 64KB（パイプバッファ1個分）を
 * 超えると、そこで切られた壊れた JSON が相手に渡っていた。ファイルへのリダイレクトでは
 * 書き込みが同期なので再現せず、パイプのときだけ壊れる。
 *
 * stream の書き込みは順序が保証されるので、最後に積んだ空 write のコールバックは
 * 先行する出力が全部掃けた後に呼ばれる。それを待ってから exit する。
 */
async function exitWith(code) {
  if (process.stdout.writable) {
    await new Promise((resolve) => process.stdout.write("", () => resolve()))
  }
  process.exit(code)
}

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
  npx ksk-ds check-migration ./src --format=json  CI 向け JSON 出力
  npx ksk-ds check-duplicates [DIR]    DS と同名のローカル実装を検査
  npx ksk-ds check-duplicates --strict 検出時に exit 1（CI 向け）
  npx ksk-ds codemod                   利用できる codemod を一覧
  npx ksk-ds codemod <name> [DIR] --dry 破壊変更の自動移行（事前確認）
  npx ksk-ds codemod <name> [DIR]      破壊変更の自動移行（書き込み）
`)
  await exitWith(0)
}

if (cmd === "lint") {
  const { runLintCli } = await import("./lint.js")
  const status = await runLintCli(args.slice(1), { cwd: process.cwd(), pkgRoot })
  await exitWith(status)
}

if (cmd === "check-migration") {
  // check-migration.js は TypeScript の AST 解析そのものが本体なので、
  // typescript 不在なら raw な ERR_MODULE_NOT_FOUND ではなく案内を出して
  // skip する（exit 0。lint 同様に「無言で落ちる」を避ける／issue #409）。
  let mod
  try {
    mod = await import("./check-migration.js")
  } catch (error) {
    if (error?.code === "ERR_MODULE_NOT_FOUND" && String(error.message ?? "").includes("typescript")) {
      console.log(
        `[ksk-ds check-migration] typescript が見つからないため skip します。` +
          `devDependencies に typescript を追加すると検査できます。`,
      )
      await exitWith(0)
    }
    throw error
  }
  const status = mod.runCheckMigrationCli(args.slice(1), { cwd: process.cwd(), pkgRoot })
  await exitWith(status)
}

if (cmd === "check-duplicates") {
  const { runCheckDuplicatesCli } = await import("./check-duplicates.js")
  const status = runCheckDuplicatesCli(args.slice(1), {
    cwd: process.cwd(),
    pkgRoot,
  })
  await exitWith(status)
}

if (cmd === "codemod") {
  await exitWith(runCodemod(args.slice(1)))
}

if (cmd === "demo") {
  runDemo(args.slice(1))
  await exitWith(0)
}

if (cmd !== "init") {
  console.error(`未知のコマンド: ${cmd}`)
  console.error(`npx ksk-design-system help を参照してください`)
  await exitWith(1)
}

// ─── codemod ────────────────────────────────────────────────
// MIGRATION.md / RELEASE.md / scripts/codemod/README.md が案内している
// `npx ksk-design-system codemod <name> ./src` の実体。
// `scripts/codemod/<name>.mjs` を解決して node で起動し、残りの引数
// （対象ディレクトリ・--dry）はそのまま渡す。

function codemodDir() {
  return join(pkgRoot, "scripts", "codemod")
}

function listCodemods() {
  const dir = codemodDir()
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith(".mjs"))
    .map((f) => f.replace(/\.mjs$/, ""))
    .filter((name) => !NON_CODEMOD.has(name))
    .sort()
}

function printAvailableCodemods() {
  const available = listCodemods()
  if (available.length === 0) {
    console.error(`\n現在提供されている codemod はありません。`)
    console.error(`破壊変更に対応する codemod はリリース時に追加され、`)
    console.error(`MIGRATION.md に実行コマンドが記載されます。`)
    console.error(`\n非推奨 API の残存を数えるだけなら:`)
    console.error(`  npx ksk-ds check-migration ./src`)
    return
  }
  console.error(`\n利用できる codemod:`)
  for (const name of available) console.error(`  ${name}`)
}

function runCodemod(rest) {
  const name = rest.find((a) => !a.startsWith("--"))

  if (!name) {
    console.error(`使い方: npx ksk-design-system codemod <name> [DIR] [--dry]`)
    printAvailableCodemods()
    return 1
  }

  // pkgRoot の外へ抜ける名前・codemod ではないファイルを弾く
  if (!/^[A-Za-z0-9._-]+$/.test(name) || NON_CODEMOD.has(name)) {
    console.error(`✗ codemod 名が不正です: ${name}`)
    printAvailableCodemods()
    return 1
  }

  const scriptPath = join(codemodDir(), `${name}.mjs`)
  if (!existsSync(scriptPath)) {
    console.error(`✗ codemod が見つかりません: ${name}`)
    console.error(`  期待したパス: ${scriptPath}`)
    printAvailableCodemods()
    return 1
  }

  // name だけ取り除いて残り（DIR / --dry 等）をそのまま渡す
  const nameIndex = rest.indexOf(name)
  const forwarded = rest.filter((_, i) => i !== nameIndex)
  const res = spawnSync(process.execPath, [scriptPath, ...forwarded], {
    stdio: "inherit",
    cwd: process.cwd(),
  })
  return res.status ?? 1
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

// ─── init（明示実行のみ）─────────────────────────────────────
// 書き込み先はコマンドを叩いたディレクトリ。install 時の暗黙実行が無くなったので
// INIT_CWD 等の環境変数は参照しない。
const consumerRoot = process.cwd()

const files = [
  { src: "templates/AGENTS.md", dest: "AGENTS.md", label: "Codex 用" },
  { src: "templates/CLAUDE.md", dest: "CLAUDE.md", label: "Claude Code 用" },
]

console.log("ksk-design-system init")
console.log("AI (Claude / Codex) 向けルールファイルを設置します。\n")

let created = 0
let skipped = 0

for (const { src, dest, label } of files) {
  const srcPath = join(pkgRoot, src)
  const destPath = join(consumerRoot, dest)

  if (!existsSync(srcPath)) {
    console.error(`  ✗ テンプレートが見つかりません: ${srcPath}`)
    process.exit(1)
  }

  if (existsSync(destPath) && !force) {
    console.log(`  ⏭  ${dest} は既に存在するためスキップ（--force で上書き）`)
    skipped++
    continue
  }

  copyFileSync(srcPath, destPath)
  console.log(`  ✓ ${dest} を設置しました（${label}）`)
  created++
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
