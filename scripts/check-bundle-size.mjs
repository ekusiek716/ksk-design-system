#!/usr/bin/env node
// =============================================================
// KSK Design System — 配布物サイズ予算の検査（contracts/bundle-size-budget.json）
//
// dist/ の肥大化と tree-shaking の退行を CI で落とす。2 種類を測る:
//
//  1. entries（エントリ別サイズ予算）
//     package.json exports が指す dist の JS ごとに、「そのエントリを import したとき
//     必ず読み込まれる JS の合計」（エントリ自身 + 静的 import で辿れるチャンク。
//     動的 import() は遅延読み込みなので除く）の raw / gzip / brotli を測る。
//     予算は gzip 基準。各ファイルを個別に圧縮した合計（実際に流れる量に近い）。
//
//  2. treeShaking（tree-shaking 予算・本命）
//     consumer が `import { Button } from "ksk-design-system"` だけしたときに、
//     バンドラが残すコードの大きさ。vite（devDependencies の vite = rolldown）で
//     dist を実際にバンドルし、minify した出力を gzip / brotli で測る。
//     sideEffects 設定の退行や、モジュールのトップレベルの副作用（createContext の
//     呼び出し・Map 生成など、消せない文の混入）で tree-shaking が効かなくなると、
//     ここが膨らんで落ちる。
//
//     external の方針: bare specifier（react / react-dom / radix-ui / iconsax-reactjs /
//     clsx / tailwind-merge / class-variance-authority / react-native 等。package.json の
//     dependencies と peerDependencies）はすべて external にする。測りたいのは
//     「DS 自身のコード」だけで、依存ライブラリの大きさは consumer 側の選択だから。
//     ksk-design-system と ksk-design-system/<subpath> だけは package.json exports の
//     指す dist ファイルへ解決する（exports の対応表の壊れも一緒に検出できる）。
//
// 使い方:
//   npm run build:lib && npm run lint:bundle-size    # 検査（予算超過で exit 1）
//   node scripts/check-bundle-size.mjs --update      # 実測から baseline と budget を書き換える
//   node scripts/check-bundle-size.mjs --dump DIR    # tree-shaking ケースの出力を DIR に書く（何が残ったか調べる用）
//
// --update はローカル専用。CI では使わない（CI で予算を自動更新すると、超過を検出する
// ゲートが毎回通ってしまう）。意図したサイズ増なら --update で予算を更新し、PR に理由を書く。
// 予算を実測の +10%（100 バイト単位で切り上げ）に決める根拠は
// contracts/bundle-size-budget.json の meta を参照。
// =============================================================
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { isAbsolute, join } from "node:path"
import { fileURLToPath } from "node:url"
import {
  BUDGET_PATH,
  buildCaseEntrySource,
  checkEntriesCoverage,
  collectStaticGraph,
  computeBudget,
  exportedJsEntries,
  judge,
  loadBudget,
  measureFiles,
  validateBudget,
} from "./lib/bundle-size.mjs"

const root = join(fileURLToPath(new URL("..", import.meta.url)))
const update = process.argv.includes("--update")
const dumpIndex = process.argv.indexOf("--dump")
const dumpDir = dumpIndex >= 0 ? process.argv[dumpIndex + 1] : undefined
if (dumpIndex >= 0 && !dumpDir) {
  console.error("✗ --dump には出力先ディレクトリを指定してください")
  process.exit(1)
}
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))

const fail = (lines) => {
  for (const line of lines) console.error(line)
  process.exit(1)
}

const budget = loadBudget(root)
if (!budget) fail([`✗ ${BUDGET_PATH} がありません`])
const budgetErrors = [...validateBudget(budget), ...checkEntriesCoverage(pkg, budget)]
if (budgetErrors.length) fail([`✗ ${BUDGET_PATH} の検査で ${budgetErrors.length} 件の問題:`, ...budgetErrors.map((e) => `  - ${e}`)])

if (!existsSync(join(root, "dist/index.js"))) {
  fail(["✗ dist/index.js がありません。先に `npm run build:lib` を実行してください（dist/ は git 追跡外）"])
}

// ---------- 1. エントリ別 ----------
const rows = []
for (const entry of budget.entries) {
  const files = await collectStaticGraph(join(root, entry.file))
  const sources = files.map((file) => readFileSync(file, "utf8"))
  rows.push({ section: "entries", item: entry, measured: measureFiles(sources), fileCount: files.length })
}

// ---------- 2. tree-shaking ----------
const { build } = await import("vite")
const specifierToFile = new Map(
  exportedJsEntries(pkg).map(({ subpath, file }) => [subpath === "." ? pkg.name : `${pkg.name}/${subpath.slice(2)}`, join(root, file)]),
)
const isBare = (id) => !id.startsWith(".") && !id.startsWith("/") && !id.startsWith("\0") && !isAbsolute(id)

async function bundleCase(caseItem) {
  const virtualId = `\0ksk-bundle-size-case:${caseItem.id}`
  const result = await build({
    root,
    configFile: false,
    envDir: false,
    publicDir: false,
    logLevel: "silent",
    mode: "production",
    plugins: [
      {
        name: "ksk-bundle-size-case",
        enforce: "pre",
        resolveId(id) {
          if (id === virtualId) return id
          return specifierToFile.get(id) // ksk-design-system[/subpath] → exports が指す dist ファイル
        },
        load(id) {
          return id === virtualId ? buildCaseEntrySource(caseItem.imports) : undefined
        },
      },
    ],
    build: {
      write: false,
      minify: true,
      target: "esnext",
      modulePreload: false,
      reportCompressedSize: false,
      rollupOptions: {
        input: virtualId,
        // bare specifier は DS 自身のコードではないので external（上の方針コメント参照）。
        external: (id) => isBare(id) && !specifierToFile.has(id),
        output: { format: "es" },
      },
    },
  })
  const outputs = (Array.isArray(result) ? result : [result]).flatMap((r) => r.output)
  return outputs.filter((o) => o.type === "chunk").map((o) => o.code)
}

for (const item of budget.treeShaking) {
  const sources = await bundleCase(item)
  if (dumpDir) {
    mkdirSync(dumpDir, { recursive: true })
    sources.forEach((code, index) => writeFileSync(join(dumpDir, `${item.id}.${index}.js`), code))
  }
  rows.push({ section: "treeShaking", item, measured: measureFiles(sources), fileCount: sources.length })
}

// ---------- 表示 ----------
const kb = (bytes) => `${(bytes / 1024).toFixed(2)} KiB`
const pad = (value, width) => String(value).padStart(width)
const STATUS_LABEL = { over: "超過", tighten: "締め直し可", ok: "OK" }
const indexRow = rows.find((r) => r.section === "entries" && r.item.id === "index")

function printSection(section, title) {
  console.log(`\n${title}（予算は gzip 基準）`)
  console.log(`${"id".padEnd(26)}${pad("raw", 13)}${pad("gzip", 13)}${pad("brotli", 13)}${pad("budget", 13)}${pad("使用率", 9)}  判定`)
  for (const row of rows.filter((r) => r.section === section)) {
    const verdict = judge(row.measured.gzip, row.item.budgetBytes)
    row.verdict = verdict
    console.log(
      `${row.item.id.padEnd(26)}${pad(kb(row.measured.raw), 13)}${pad(kb(row.measured.gzip), 13)}${pad(kb(row.measured.brotli), 13)}${pad(kb(row.item.budgetBytes), 13)}${pad(`${Math.round(verdict.usage * 100)}%`, 9)}  ${STATUS_LABEL[verdict.status]}`,
    )
  }
}

if (update) {
  for (const row of rows) {
    row.item.baselineRawBytes = row.measured.raw
    row.item.baselineBytes = row.measured.gzip
    row.item.baselineBrotliBytes = row.measured.brotli
    row.item.budgetBytes = computeBudget(row.measured.gzip)
  }
  budget.meta.updatedAt = new Date().toISOString().slice(0, 10)
  writeFileSync(join(root, BUDGET_PATH), `${JSON.stringify(budget, null, 2)}\n`)
  printSection("entries", "エントリ別サイズ")
  printSection("treeShaking", "tree-shaking（import したぶんだけ残るサイズ）")
  console.log(`\n✓ ${BUDGET_PATH} を実測から更新しました（baseline = 実測 / budget = 実測 +10% を 100 バイト単位で切り上げ）`)
  process.exit(0)
}

printSection("entries", "エントリ別サイズ")
printSection("treeShaking", "tree-shaking（import したぶんだけ残るサイズ）")
if (indexRow) {
  console.log(`\n参考: index 全体は gzip ${kb(indexRow.measured.gzip)}。tree-shaking ケースの gzip がこれに近いほど tree-shaking が効いていない。`)
}

const over = rows.filter((r) => r.verdict.status === "over")
const tighten = rows.filter((r) => r.verdict.status === "tighten")
for (const row of tighten) {
  console.log(`ℹ ${row.section}:${row.item.id} は予算の ${Math.round(row.verdict.usage * 100)}% まで縮みました。予算を締め直せます（npm run lint:bundle-size -- --update）`)
}
if (over.length) {
  console.error(`\n✗ ${over.length} 件が予算を超えています:`)
  for (const row of over) {
    console.error(`  - ${row.section}:${row.item.id} gzip ${row.measured.gzip} B > 予算 ${row.item.budgetBytes} B（+${row.verdict.diff} B）  ${row.item.description}`)
  }
  console.error("  意図したサイズ増なら、`npm run build:lib && node scripts/check-bundle-size.mjs --update` で予算を更新し、PR に理由を書いてください（CI では --update を使わない）。")
  console.error("  意図しない増加なら、tree-shaking ケースの超過はトップレベルの副作用や sideEffects 設定の退行を疑ってください。")
  process.exit(1)
}
console.log(`\n✓ 配布物サイズは予算内です（entries ${budget.entries.length} / treeShaking ${budget.treeShaking.length}）`)
