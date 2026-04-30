#!/usr/bin/env node
/**
 * COMPONENT_LOOKUP.md 自動生成スクリプト
 *
 * src/components/ui/ と src/components/patterns/ をスキャンし、
 * バリアント情報・インポートパスを含む COMPONENT_LOOKUP.md を生成する。
 *
 * Usage:
 *   node scripts/generate-component-lookup.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const UI_DIR = path.join(ROOT, "src/components/ui")
const PATTERNS_DIR = path.join(ROOT, "src/components/patterns")
const OUTPUT = path.join(ROOT, "src/components/COMPONENT_LOOKUP.md")

/* ------------------------------------------------------------------ */
/*  ユーティリティ                                                       */
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
  // export function Foo / export const Foo
  for (const m of content.matchAll(/export\s+(?:function|const)\s+([A-Z]\w+)/g)) {
    if (!exports.includes(m[1])) exports.push(m[1])
  }
  return exports
}

/** CVA からバリアント情報を抽出 */
function extractCvaVariants(content) {
  const variants = []
  for (const cvaMatch of content.matchAll(/const\s+\w+\s*=\s*cva\(/g)) {
    const startIdx = cvaMatch.index + cvaMatch[0].length
    const variantsMatch = content.slice(startIdx, startIdx + 3000).match(/variants:\s*\{/)
    if (!variantsMatch) continue
    const variantsStart = startIdx + variantsMatch.index + variantsMatch[0].length
    const variantBlock = content.slice(variantsStart, variantsStart + 2000)
    for (const km of variantBlock.matchAll(/^\s{6}(\w+):\s*\{/gm)) {
      const key = km[1]
      const keyBlock = variantBlock.slice(km.index + km[0].length, km.index + km[0].length + 1500)
      const nextKeyIdx = keyBlock.search(/^\s{6}\w+:\s*\{/m)
      const block = nextKeyIdx > 0 ? keyBlock.slice(0, nextKeyIdx) : keyBlock
      const values = [...block.matchAll(/^\s{8}(?:"([^"]+)"|(\w+)):\s/gm)].map((m) => m[1] || m[2])
      if (values.length > 0) variants.push({ key, values })
    }
  }
  return variants
}

/** stories ファイルからストーリー名を抽出 */
function extractStoryNames(content) {
  return [...content.matchAll(/export\s+const\s+(\w+)\s*:\s*Story\w*\s*=\s*\{/g)].map((m) => {
    const after = content.slice(m.index, m.index + 300)
    const nameMatch = after.match(/name:\s*["']([^"']+)["']/)
    return nameMatch ? nameMatch[1] : m[1]
  })
}

/** ファイルパスを @/ インポートパスに変換 */
function toImportPath(filePath) {
  return "@/" + path.relative(path.join(ROOT, "src"), filePath).replace(/\.tsx$/, "")
}

/* ------------------------------------------------------------------ */
/*  メイン処理                                                          */
/* ------------------------------------------------------------------ */

function processDirectory(dir, category) {
  return getComponentFiles(dir).flatMap((file) => {
    const content = fs.readFileSync(file, "utf-8")
    const exports = extractExports(content)
    if (exports.length === 0) return []
    const cvaVariants = extractCvaVariants(content)
    const storyFile = file.replace(".tsx", ".stories.tsx")
    const stories = fs.existsSync(storyFile)
      ? extractStoryNames(fs.readFileSync(storyFile, "utf-8"))
      : []
    // サブカテゴリ（patterns/commerce → commerce）
    const rel = path.relative(dir, file)
    const subcat = rel.includes(path.sep) ? rel.split(path.sep)[0] : null
    return [{ file: path.basename(file, ".tsx"), exports, importPath: toImportPath(file), cvaVariants, stories, category, subcat }]
  })
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
    "| 下部ナビゲーション | `<BottomNav>` | `BottomNav` |",
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

const ui = processDirectory(UI_DIR, "ui")
const patterns = processDirectory(PATTERNS_DIR, "patterns")

const md = generateMarkdown(ui, patterns)
fs.writeFileSync(OUTPUT, md, "utf-8")

console.log(`✅ COMPONENT_LOOKUP.md 生成完了: ${ui.length + patterns.length} コンポーネント`)
console.log(`   UI: ${ui.length} / Patterns: ${patterns.length}`)
console.log(`   出力: ${OUTPUT}`)
