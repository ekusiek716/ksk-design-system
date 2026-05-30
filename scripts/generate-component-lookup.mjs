#!/usr/bin/env node
/**
 * COMPONENT_LOOKUP.md 自動生成スクリプト
 *
 * src/components/ui/ と src/components/patterns/ をスキャンし、
 * バリアント情報・インポートパスを含む COMPONENT_LOOKUP.md を生成する。
 *
 * 設計メモ:
 * - cva の variant 抽出は「固定インデント前提の正規表現」をやめ、波括弧の対応を
 *   とるブレースマッチで行う（Prettier の折返し有無に依存しない）。
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
/*  構文ヘルパー（インデント非依存）                                      */
/* ------------------------------------------------------------------ */

/**
 * content[openBraceIdx] === "{" を起点に、対応する "}" までの中身と終端 index を返す。
 * 文字列リテラル（" ' `）内の波括弧は数えない。見つからなければ null。
 */
function extractBalancedBlock(content, openBraceIdx) {
  let depth = 0
  let quote = null
  for (let i = openBraceIdx; i < content.length; i++) {
    const c = content[i]
    const prev = content[i - 1]
    if (quote) {
      if (c === quote && prev !== "\\") quote = null
      continue
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c
      continue
    }
    if (c === "{") {
      depth++
    } else if (c === "}") {
      depth--
      if (depth === 0) return { inner: content.slice(openBraceIdx + 1, i), end: i }
    }
  }
  return null
}

/**
 * オブジェクト本体 inner から「トップレベル（深さ0・文字列外）のキー名」を出現順に返す。
 * 例: `{ default: "...", "inline-info": "...", ghost: { ... } }` -> [default, inline-info, ghost]
 */
function topLevelKeys(inner) {
  const keys = []
  let depth = 0
  let quote = null
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i]
    const prev = inner[i - 1]
    if (quote) {
      if (c === quote && prev !== "\\") quote = null
      continue
    }
    // 深さ0では、まずキー（識別子 or "クォート付き" の直後に :）かを優先判定する。
    // 先に文字列スキップへ入れると "inline-info" / "icon-sm" 等のクォートキーを取りこぼすため。
    if (depth === 0) {
      const m = inner.slice(i).match(/^(?:"([\w-]+)"|'([\w-]+)'|([A-Za-z_$][\w$]*))\s*:/)
      if (m) {
        keys.push(m[1] || m[2] || m[3])
        i += m[0].length - 1
        continue
      }
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c
      continue
    }
    if (c === "{" || c === "[" || c === "(") depth++
    else if (c === "}" || c === "]" || c === ")") depth--
  }
  return keys
}

/** variants ブロック本体から { key, values } 群を抽出（key=variant/size/... value=各選択肢） */
function extractVariantGroups(variantsInner) {
  const groups = []
  let depth = 0
  let quote = null
  for (let i = 0; i < variantsInner.length; i++) {
    const c = variantsInner[i]
    const prev = variantsInner[i - 1]
    if (quote) {
      if (c === quote && prev !== "\\") quote = null
      continue
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c
      continue
    }
    if (depth === 0) {
      const m = variantsInner.slice(i).match(/^(?:"([\w-]+)"|([A-Za-z_$][\w$]*))\s*:\s*\{/)
      if (m) {
        const key = m[1] || m[2]
        const braceIdx = i + m[0].length - 1
        const blk = extractBalancedBlock(variantsInner, braceIdx)
        if (blk) {
          const values = topLevelKeys(blk.inner)
          if (values.length > 0) groups.push({ key, values })
          i = blk.end
          continue
        }
      }
    }
    if (c === "{" || c === "[" || c === "(") depth++
    else if (c === "}" || c === "]" || c === ")") depth--
  }
  return groups
}

const CVA_DECL = /(?:export\s+)?const\s+\w+\s*=\s*cva\(/g

/** CVA からバリアント情報を抽出（同名 variant キーは先勝ちで dedup） */
function extractCvaVariants(content) {
  const out = []
  const seen = new Set()
  const cvas = [...content.matchAll(CVA_DECL)]
  for (let ci = 0; ci < cvas.length; ci++) {
    const start = cvas[ci].index
    const end = ci + 1 < cvas.length ? cvas[ci + 1].index : content.length
    const scope = content.slice(start, end)
    const vm = scope.match(/\bvariants\s*:\s*\{/)
    if (!vm) continue
    const braceIdx = vm.index + vm[0].length - 1
    const blk = extractBalancedBlock(scope, braceIdx)
    if (!blk) continue
    for (const g of extractVariantGroups(blk.inner)) {
      if (seen.has(g.key)) continue
      seen.add(g.key)
      out.push(g)
    }
  }
  return out
}

/** variants ブロックを持つ cva が（少なくとも 1 つ）存在するか＝variant が出るべきファイルか */
function hasVariantsBlock(content) {
  const cvas = [...content.matchAll(CVA_DECL)]
  for (let ci = 0; ci < cvas.length; ci++) {
    const start = cvas[ci].index
    const end = ci + 1 < cvas.length ? cvas[ci + 1].index : content.length
    if (/\bvariants\s*:\s*\{/.test(content.slice(start, end))) return true
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
    const exports = extractExports(content)
    if (exports.length === 0) return []
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
  extractExports,
  extractBalancedBlock,
  topLevelKeys,
  extractVariantGroups,
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
