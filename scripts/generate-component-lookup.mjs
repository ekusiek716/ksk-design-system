#!/usr/bin/env node
/**
 * COMPONENT_LOOKUP.md 自動生成スクリプト
 *
 * src/components/ui/ と src/components/patterns/ をスキャンし、
 * バリアント情報・インポートパスを含む COMPONENT_LOOKUP.md を生成する。
 *
 * 設計メモ:
 * - cva の variant 抽出は TypeScript AST（ts.createSourceFile）で行う。正規表現や
 *   インデント・整形に依存せず、クォートキー / 配列値 / スプレッド等も正確に扱える。
 * - variant 定義を別ファイル（src/lib/server-variants/）へ切り出しているコンポーネント
 *   （Button）は import を解決して参照先も走査する。他コンポーネントの buttonVariants
 *   "借用"（alert-dialog / pagination 等）は対象外。
 * - 黙って壊れた表を出さない: variants ブロックを持つ cva があるのに抽出 0 件、または
 *   ストーリー名重複を検出したら、出力せず exit 1（fail-loud）。
 *
 * Usage:
 *   node scripts/generate-component-lookup.mjs           # 生成
 *   node scripts/generate-component-lookup.mjs --check   # 生成せず既存と比較。差分があれば exit 1（CI 用）
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import ts from "typescript"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const SRC = path.join(ROOT, "src")
const UI_DIR = path.join(SRC, "components/ui")
const PATTERNS_DIR = path.join(SRC, "components/patterns")
const OUTPUT = path.join(SRC, "components/COMPONENT_LOOKUP.md")

/* ------------------------------------------------------------------ */
/*  ファイル探索                                                        */
/* ------------------------------------------------------------------ */

/** ディレクトリ（再帰）から .tsx ファイルを取得（.stories.tsx を除く） */
function getComponentFiles(dir) {
  if (!fs.existsSync(dir)) return []
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...getComponentFiles(full))
    } else if (entry.isFile() && entry.name.endsWith(".tsx") && !entry.name.endsWith(".stories.tsx")) {
      results.push(full)
    }
  }
  return results
}

/** ファイルからエクスポートされたコンポーネント名を抽出 */
function extractExports(content) {
  const exports = []
  // export { Foo, Bar }
  for (const match of content.matchAll(/export\s*\{([^}]+)\}/g)) {
    const names = match[1]
      .split(",")
      .map((n) => n.trim().split(/\s+as\s+/).pop().trim())
      .filter((n) => n && /^[A-Z]/.test(n))
    exports.push(...names)
  }
  // export function Foo / export const Foo / export class Foo
  for (const m of content.matchAll(/export\s+(?:function|const|class)\s+([A-Z]\w+)/g)) {
    if (!exports.includes(m[1])) exports.push(m[1])
  }
  return exports
}

/* ------------------------------------------------------------------ */
/*  cva variant 抽出（TypeScript AST ベース）                            */
/* ------------------------------------------------------------------ */

/** ソース文字列を TypeScript の SourceFile にパースする */
function parseSource(content, fileName = "component.tsx") {
  return ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, /* setParentNodes */ true, ts.ScriptKind.TSX)
}

/** プロパティ名を文字列で返す（Identifier / 文字列リテラル）。算出キー等は null。 */
function propNameText(prop) {
  const name = prop.name
  if (!name) return null
  if (ts.isIdentifier(name)) return name.text
  if (ts.isStringLiteralLike(name)) return name.text
  return null
}

/** cva(...) 呼び出しの設定オブジェクト（最後の ObjectLiteralExpression 引数）を返す */
function cvaConfigObject(call) {
  for (let i = call.arguments.length - 1; i >= 0; i--) {
    const arg = call.arguments[i]
    if (ts.isObjectLiteralExpression(arg)) return arg
  }
  return null
}

/** 設定オブジェクトの variants プロパティ（ObjectLiteral）を返す */
function variantsObject(configObj) {
  const prop = configObj.properties.find(
    (p) => ts.isPropertyAssignment(p) && propNameText(p) === "variants",
  )
  return prop && ts.isObjectLiteralExpression(prop.initializer) ? prop.initializer : null
}

/** SourceFile 内の全 cva(...) 呼び出しノードを返す */
function findCvaCalls(sourceFile) {
  const calls = []
  const visit = (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "cva") {
      calls.push(node)
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return calls
}

/**
 * cva からバリアント情報を抽出（AST ベース）。同名 variant キーは先勝ちで dedup。
 * 正規表現スクレイプと違い、クォートキー / インライン引数 / 配列値 / 整形に依存しない。
 */
function extractCvaVariants(content) {
  const out = []
  const seen = new Set()
  for (const call of findCvaCalls(parseSource(content))) {
    const config = cvaConfigObject(call)
    if (!config) continue
    const variants = variantsObject(config)
    if (!variants) continue
    for (const groupProp of variants.properties) {
      if (!ts.isPropertyAssignment(groupProp)) continue
      const key = propNameText(groupProp)
      if (!key || seen.has(key)) continue
      if (!ts.isObjectLiteralExpression(groupProp.initializer)) continue
      const values = groupProp.initializer.properties.map(propNameText).filter(Boolean)
      if (values.length > 0) {
        seen.add(key)
        out.push({ key, values })
      }
    }
  }
  return out
}

/** variants（非空）を持つ cva が 1 つ以上あるか＝variant が出力されるべきファイルか */
function hasVariantsBlock(content) {
  for (const call of findCvaCalls(parseSource(content))) {
    const config = cvaConfigObject(call)
    if (!config) continue
    const variants = variantsObject(config)
    if (variants && variants.properties.length > 0) return true
  }
  return false
}

/* ------------------------------------------------------------------ */
/*  import 解決（variant 切り出しの追跡）                                */
/* ------------------------------------------------------------------ */

/** @/... と相対パスを実ファイルへ解決。node_modules は対象外。 */
function resolveModulePath(spec, fileDir) {
  let base
  if (spec.startsWith("@/")) base = path.join(SRC, spec.slice(2))
  else if (spec.startsWith(".")) base = path.resolve(fileDir, spec)
  else return null
  for (const ext of [".ts", ".tsx", ".mjs", ".js"]) {
    if (fs.existsSync(base + ext)) return base + ext
  }
  for (const ext of [".ts", ".tsx"]) {
    const idx = path.join(base, "index" + ext)
    if (fs.existsSync(idx)) return idx
  }
  return null
}

/**
 * variant 定義を server-variants/ へ切り出しているコンポーネントの参照先ファイルを返す。
 * `@/components/ui/button` 等からの buttonVariants "借用" は切り出しではないので対象外
 * （借用先の variant を自コンポーネントの variant として誤表示しないため）。
 */
function findExternalVariantFiles(content, fileDir) {
  const files = []
  for (const m of content.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/g)) {
    const spec = m[2]
    if (!/server-variants/.test(spec)) continue
    if (!/Variants/.test(m[1])) continue
    const resolved = resolveModulePath(spec, fileDir)
    if (resolved) files.push(resolved)
  }
  return files
}

/** stories ファイルからストーリー名を抽出（探索窓は「次のストーリー宣言まで」に限定） */
function extractStoryNames(content) {
  const decls = [...content.matchAll(/export\s+const\s+(\w+)\s*:\s*Story\w*\s*=\s*\{/g)]
  return decls.map((m, i) => {
    const bodyStart = m.index + m[0].length
    const bodyEnd = i + 1 < decls.length ? decls[i + 1].index : content.length
    const body = content.slice(bodyStart, bodyEnd)
    const nameMatch = body.match(/\bname\s*:\s*["']([^"']+)["']/)
    return nameMatch ? nameMatch[1] : m[1]
  })
}

/** ファイルパスを @/ インポートパスに変換 */
function toImportPath(filePath) {
  return "@/" + path.relative(SRC, filePath).replace(/\.tsx$/, "")
}

/* ------------------------------------------------------------------ */
/*  メイン処理                                                          */
/* ------------------------------------------------------------------ */

function processDirectory(dir, category) {
  return getComponentFiles(dir).flatMap((file) => {
    const content = fs.readFileSync(file, "utf-8")
    const allExports = extractExports(content)
    if (allExports.length === 0) return []
    // 補助アイコン(Icon*)は「再利用すべきコンポーネント」ではないので Component 欄から除外。
    // ただし全て除外されてしまうファイル（アイコンのみ）は元のまま残す（誤って行を消さない）。
    const nonIcon = allExports.filter((e) => !/^Icon[A-Z]/.test(e))
    const exports = nonIcon.length > 0 ? nonIcon : allExports
    const fileDir = path.dirname(file)

    let cvaVariants = extractCvaVariants(content)
    let variantsExpected = hasVariantsBlock(content)

    // ファイル内に cva が無い場合、server-variants/ への切り出しを追跡（Button 対応）
    if (cvaVariants.length === 0) {
      for (const ext of findExternalVariantFiles(content, fileDir)) {
        const extContent = fs.readFileSync(ext, "utf-8")
        if (hasVariantsBlock(extContent)) variantsExpected = true
        const v = extractCvaVariants(extContent)
        if (v.length > 0) {
          cvaVariants = v
          break
        }
      }
    }

    const storyFile = file.replace(/\.tsx$/, ".stories.tsx")
    const stories = fs.existsSync(storyFile)
      ? extractStoryNames(fs.readFileSync(storyFile, "utf-8"))
      : []

    const rel = path.relative(dir, file)
    const subcat = rel.includes(path.sep) ? rel.split(path.sep)[0] : null
    return [{
      file: path.basename(file, ".tsx"),
      exports,
      importPath: toImportPath(file),
      cvaVariants,
      variantsExpected,
      stories,
      category,
      subcat,
    }]
  })
}

/** 黙って壊れた表を出さないための不変条件チェック（違反内容の配列を返す） */
function collectProblems(components) {
  const problems = []
  for (const c of components) {
    if (c.variantsExpected && c.cvaVariants.length === 0) {
      problems.push(
        `${c.importPath}: cva に variants 定義があるのに variant を抽出できませんでした（抽出ロジックの取りこぼし）`,
      )
    }
    const dups = [...new Set(c.stories.filter((s, i) => c.stories.indexOf(s) !== i))]
    if (dups.length > 0) {
      problems.push(
        `${c.importPath}: ストーリー名が重複しています [${dups.join(", ")}]（name のすり抜けの可能性）`,
      )
    }
  }
  return problems
}

function generateMarkdown(ui, patterns) {
  const lines = []
  lines.push("# Component Lookup（AI必読）")
  lines.push("")
  lines.push("> **このファイルは `node scripts/generate-component-lookup.mjs` で自動生成されています。手動編集しないでください。**")
  lines.push("")
  lines.push("コンポーネントを使う前に必ずこのファイルを確認し、既存コンポーネントを再利用すること。")
  lines.push("独自でコンポーネントを定義する前に、ここに同等品がないか確認すること。")
  lines.push("")

  const tableHeader = ["| Component | Import | Variants | Stories |", "|-----------|--------|----------|---------|"]

  const row = (c) => {
    const varStr = c.cvaVariants.length > 0
      ? c.cvaVariants.map((v) => `**${v.key}**: ${v.values.map((x) => `\`${x}\``).join(", ")}`).join("<br>")
      : "—"
    const storyStr = c.stories.length > 0 ? c.stories.join(", ") : "—"
    return `| ${c.exports.join(", ")} | \`${c.importPath}\` | ${varStr} | ${storyStr} |`
  }

  // ── UI ──
  lines.push("---", "", "## UI Components（src/components/ui/）", "", ...tableHeader)
  lines.push(...ui.map(row), "")

  // ── Patterns（サブカテゴリ別） ──
  lines.push("---", "", "## Pattern Components（src/components/patterns/）", "")

  const subcats = [...new Set(patterns.map((c) => c.subcat))]
  for (const sub of subcats) {
    const group = patterns.filter((c) => c.subcat === sub)
    const label = sub
      ? `### patterns/${sub}/`
      : "### patterns/（汎用）"
    lines.push(label, "", ...tableHeader)
    lines.push(...group.map(row), "")
  }

  // ── よくある間違い ──
  lines.push("---", "", "## よくある間違い", "",
    "| 禁止（手書き） | 正しい書き方 |",
    "|---|---|",
    "| `<button className=\"...\">` | `<Button variant=\"...\" size=\"...\">` |",
    "| `<input className=\"...\">` | `<Input>` |",
    "| `<textarea className=\"...\">` | `<Textarea>` |",
    "| `<select>...</select>` | `<Select><SelectItem>` |",
    "| `function SectionHeader()` をページ内で定義 | `import { SectionHeader }` |",
    "| `function FormField()` をページ内で定義 | `import { FormField }` |",
    "| `<div className=\"rounded-xl border p-4\">` | `<Card><CardContent>` |",
    "| `text-blue-500` 等 Tailwind 標準色 | `text-[var(--Brand-Primary)]` 等セマンティックトークン |",
    "| `font-bold` 直書き | `typo-body-md-bold` 等 typo-* クラス |",
    "",
  )

  // ── 「ない」と思われがちだが既にあるもの ──
  lines.push("---", "", "## 「DSにない」と誤解されやすいコンポーネント対応表", "",
    "> **新規コンポーネントを提案・実装する前に必ずこの表を確認すること。**",
    "",
    "| やりたいこと | 正しい使い方 | インポート |",
    "|---|---|---|",
    "| アイコンだけのボタン | `<Button size=\"icon\">` / `\"icon-sm\"` / `\"icon-lg\"` | `Button` |",
    "| リンク見た目のボタン | `<Button variant=\"link\">` | `Button` |",
    "| チェックボックス | `<Checkbox>` | `Checkbox` |",
    "| ラジオボタン | `<RadioGroup><RadioGroupItem>` | `RadioGroup, RadioGroupItem` |",
    "| Badge の色違い | `<Badge variant=\"success\">` / `\"caution\"` / `\"warning\"` / `\"info\"` | `Badge` |",
    "| 空状態の表示 | `<EmptyState>` | `EmptyState` |",
    "| 数値カード | `<StatCard>` | `StatCard` |",
    "| トースト通知 | `<Toaster>` + `useToast()` | `Toaster, useToast` |",
    "| スケルトン | `<Skeleton>` | `Skeleton` |",
    "| 下部ナビゲーション | `<BottomTabBar>` | `BottomTabBar` |",
    "| プログレスバー | `<Progress>` | `Progress` |",
    "| フォームフィールド | `<FormField>` | `FormField` |",
    "| ケバブメニュー | `<KebabMenu>` | `KebabMenu` |",
    "| モーダル（PC） | `<Dialog>` | `Dialog, DialogContent, ...` |",
    "| ドロワー（モバイル） | `<Sheet side=\"bottom\">` | `Sheet, SheetContent, ...` |",
    "| PC/モバイル自動切替モーダル | `<ResponsiveDialog>` | `ResponsiveDialog, ...` |",
    "",
  )

  return lines.join("\n")
}

function main() {
  const checkMode = process.argv.includes("--check")

  const ui = processDirectory(UI_DIR, "ui")
  const patterns = processDirectory(PATTERNS_DIR, "patterns")

  // fail-loud: 抽出の取りこぼし・名前重複があれば、壊れた表を書き出さずに中断
  const problems = collectProblems([...ui, ...patterns])
  if (problems.length > 0) {
    console.error("❌ COMPONENT_LOOKUP 生成中止: 不変条件違反（黙って壊れた表は出力しません）")
    for (const p of problems) console.error("   - " + p)
    process.exit(1)
  }

  const md = generateMarkdown(ui, patterns)

  if (checkMode) {
    const existing = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, "utf-8") : ""
    if (existing !== md) {
      console.error("❌ COMPONENT_LOOKUP.md がソースと乖離しています。`npm run generate:lookup` で再生成してコミットしてください。")
      process.exit(1)
    }
    console.log("✅ COMPONENT_LOOKUP.md は最新です。")
  } else {
    fs.writeFileSync(OUTPUT, md, "utf-8")
    console.log(`✅ COMPONENT_LOOKUP.md 生成完了: ${ui.length + patterns.length} コンポーネント`)
    console.log(`   UI: ${ui.length} / Patterns: ${patterns.length}`)
    console.log(`   出力: ${OUTPUT}`)
  }
}

// CLI として直接実行されたときのみ走らせる（テストから import しても副作用なし）
if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  main()
}

export {
  parseSource,
  extractExports,
  extractCvaVariants,
  hasVariantsBlock,
  resolveModulePath,
  findExternalVariantFiles,
  extractStoryNames,
  toImportPath,
  processDirectory,
  collectProblems,
  generateMarkdown,
}
