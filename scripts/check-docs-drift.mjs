#!/usr/bin/env node
// =============================================================
// KSK Design System — ドキュメント/コード乖離検出スクリプト
//
// CLAUDE.md 等の主要ドキュメントが参照するコンポーネント名・
// contracts/*.json ファイル・CSS変数名が実コードと一致しているかを
// 検査する。走査・抽出・照合をすべて単一 Node プロセスのメモリ内で
// 行う（行ごとのサブプロセス起動を避け、数秒以内で完走させる）。
//
// 検査しないもの（棲み分け）:
//   - DESIGN.md の front matter / セクション構造 → check-design-md.mjs
//   - contracts/components.json の件数整合性        → check-drift.sh
//
// 除外方法:
//   - 単独行マーカー `<!-- docs-drift-ignore -->` → 次の1行を検査対象から除外
//   - 行内マーカー（テーブル行など独立行を挿入できない箇所） → その行自身を除外
//
// 実行: node scripts/check-docs-drift.mjs
// =============================================================
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

const RED = "\x1b[0;31m"
const GREEN = "\x1b[0;32m"
const CYAN = "\x1b[0;36m"
const NC = "\x1b[0m"

let errors = 0
const error = (msg) => {
  console.log(`${RED}[DRIFT]${NC} ${msg}`)
  errors += 1
}
const ok = (msg) => console.log(`${GREEN}[OK]${NC}    ${msg}`)
const info = (msg) => console.log(`${CYAN}[INFO]${NC}  ${msg}`)

console.log("🔍 KSK Design System — ドキュメント/コード乖離検出")
console.log("=======================================")

// ─── 対象ドキュメント（存在するものだけ） ───
const CANDIDATE_DOCS = [
  "README.md",
  "CLAUDE.md",
  "AGENTS.md",
  "DESIGN.md",
  "NATIVE_RECIPES.md",
  "MIGRATION.md",
  "RELEASE.md",
  "PUBLISHING.md",
]

function walkMd(dir) {
  const out = []
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walkMd(full))
    else if (entry.endsWith(".md")) out.push(full)
  }
  return out
}

const docs = [
  ...CANDIDATE_DOCS.filter((d) => existsSync(join(ROOT, d))).map((d) => join(ROOT, d)),
  ...walkMd(join(ROOT, ".claude", "skills")),
  ...(existsSync(join(ROOT, "templates"))
    ? readdirSync(join(ROOT, "templates"))
        .sort()
        .filter((f) => f.endsWith(".md"))
        .map((f) => join(ROOT, "templates", f))
    : []),
]

info(`対象ドキュメント: ${docs.length} 件`)

// ─── ドキュメント読み込みと ignore マーカー処理 ───
// docCache: { relPath, text, lines, ignored: Set<lineNo(1-based)> }
const MARKER_ONLY_RE = /^\s*<!--\s*docs-drift-ignore[^>]*-->\s*$/
const docCache = docs.map((full) => {
  const text = readFileSync(full, "utf8")
  const lines = text.split(/\r?\n/)
  const ignored = new Set()
  for (let i = 0; i < lines.length; i += 1) {
    if (MARKER_ONLY_RE.test(lines[i])) {
      ignored.add(i + 1) // マーカー行自身
      ignored.add(i + 2) // 次の1行
    } else if (lines[i].includes("docs-drift-ignore")) {
      ignored.add(i + 1) // 行内マーカー: その行自身のみ
    }
  }
  return { relPath: relative(ROOT, full), text, lines, ignored }
})

// =============================================================
// 1) コンポーネント名の存在照合
// =============================================================
console.log("")
console.log("─── コンポーネント名チェック ───")

// ホワイトリスト（一般語・技術用語・RN 組み込み・製品名）
const WHITELIST = new Set(
  (
    "API URL URI JSON CSS HTML HIG M3 AI React TypeScript Tailwind Storybook Radix CVA WCAG CVD " +
    "PascalCase Props Provider DOM SDK CLI PR CI CD JSX TSX SVG PNG UI UX DS ID SSR CSR npm Node " +
    "Vite ESLint Figma GitHub Slack README CHANGELOG TODO FIXME NOTE WARN ERROR OK NG MIT Apache " +
    "BSD POSIX YAML XML CSV PDF OS iOS Android macOS Windows Linux RGB RGBA HSL HEX CTA KPI MVP " +
    "POC SaaS BtoB BtoC EC PdM QA E2E Vitest Jest Playwright Zustand Redux Context Hook Hooks HOC " +
    "Ref Refs State Children Fragment Portal Suspense StrictMode ThemeProvider Codex Claude " +
    "Anthropic Fable Opus Sonnet Haiku " +
    "ActivityIndicator ScrollView FlatList SectionList TouchableOpacity TouchableHighlight " +
    "SafeAreaView StyleSheet Animated Dimensions Platform StatusBar KeyboardAvoidingView Pressable " +
    "TextInput View Image Modal Switch Notion"
  ).split(/\s+/),
)

// コード例中のプレースホルダー名パターン:
//  - `<HeartIcon />` 等の *Icon はアイコン例（実物は iconsax-reactjs から import され DS export ではない）
//  - `<HomeScreen />` 等の *Screen は利用者側アプリの画面例
const PLACEHOLDER_NAME_RE = /^[A-Z][A-Za-z0-9]*(Icon|Screen)$/

// エクスポート名の収集。`Foo as Bar` は元名と alias（公開名）の両方を許容する。
function extractExports(file) {
  const names = new Set()
  if (!existsSync(file)) return names
  const src = readFileSync(file, "utf8")
  const re = /\{([^}]*)\}/g
  let m
  while ((m = re.exec(src))) {
    for (const tok of m[1].split(",")) {
      const base = tok.trim().replace(/^type\s+/, "")
      for (const part of base.split(/\s+as\s+/)) {
        const t = part.trim()
        if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(t)) names.add(t)
      }
    }
  }
  return names
}

const knownNames = new Set()
for (const f of ["src/index.ts", "src/native/index.ts", "src/native/components/index.ts"]) {
  for (const n of extractExports(join(ROOT, f))) knownNames.add(n)
}

const lineNoOfIndex = (text, index) => text.slice(0, index).split("\n").length

let componentErrors = 0
const checkName = (doc, lineNo, name) => {
  if (WHITELIST.has(name)) return
  if (PLACEHOLDER_NAME_RE.test(name)) return
  if (knownNames.has(name)) return
  error(`${doc.relPath}:${lineNo}: 未知のコンポーネント/識別子名 \`${name}\`（src/index.ts 等に存在しません）`)
  componentErrors += 1
}

for (const doc of docCache) {
  // a) backtick 内の PascalCase 単独語 / b) JSX タグ（行単位で抽出。
  //    <Tab.Navigator> のような名前空間タグは除外）
  for (let i = 0; i < doc.lines.length; i += 1) {
    const lineNo = i + 1
    if (doc.ignored.has(lineNo)) continue
    const line = doc.lines[i]
    const seen = new Set()
    for (const m of line.matchAll(/`([A-Z][a-zA-Z]+)`/g)) seen.add(m[1])
    for (const m of line.matchAll(/<([A-Z][A-Za-z0-9]*)(\.?)/g)) {
      if (m[2] !== ".") seen.add(m[1])
    }
    for (const name of seen) checkName(doc, lineNo, name)
  }

  // c) ksk-design-system からの import（複数行対応。文書全体を s 相当で走査）
  //    `Foo as LocalFoo` はパッケージの export 名である Foo 側を検証する
  for (const m of doc.text.matchAll(/import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*["']ksk-design-system[^"']*["']/g)) {
    const lineNo = lineNoOfIndex(doc.text, m.index)
    if (doc.ignored.has(lineNo)) continue
    const seen = new Set()
    for (const tok of m[1].split(",")) {
      const base = tok.trim().replace(/^type\s+/, "")
      const original = base.split(/\s+as\s+/)[0].trim()
      if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(original)) seen.add(original)
    }
    for (const name of seen) {
      if (knownNames.has(name)) continue
      if (WHITELIST.has(name) || PLACEHOLDER_NAME_RE.test(name)) continue
      error(`${doc.relPath}:${lineNo}: 未知の import 名 \`${name}\`（ksk-design-system のエクスポートに存在しません）`)
      componentErrors += 1
    }
  }
}

if (componentErrors === 0) ok("コンポーネント名チェック OK")

// =============================================================
// 2) contracts/*.json 参照の実在チェック
// =============================================================
console.log("")
console.log("─── contracts 参照チェック ───")

let contractsErrors = 0
for (const doc of docCache) {
  for (let i = 0; i < doc.lines.length; i += 1) {
    const lineNo = i + 1
    if (doc.ignored.has(lineNo)) continue
    for (const m of doc.lines[i].matchAll(/contracts\/[A-Za-z0-9_.-]+\.json/g)) {
      if (!existsSync(join(ROOT, m[0]))) {
        error(`${doc.relPath}:${lineNo}: 参照先が存在しません: ${m[0]}`)
        contractsErrors += 1
      }
    }
  }
}

if (contractsErrors === 0) ok("contracts 参照チェック OK")

// =============================================================
// 3) CSS 変数名の存在照合
// =============================================================
console.log("")
console.log("─── CSS 変数名チェック ───")

// CSS ファイルからは「宣言位置」（`--Name:` のプロパティ宣言）のみ抽出する。
// var(--X) のような参照を定義扱いすると、未定義変数への参照まで
// 「定義済み」と誤判定してしまうため。
function extractCssDeclarations(file, out) {
  if (!existsSync(file)) return
  const css = readFileSync(file, "utf8")
  for (const m of css.matchAll(/(?:^|[{;])\s*(--[A-Za-z][A-Za-z0-9-]*)\s*:/gm)) out.add(m[1])
}

// tokens.json はキーから CSS 変数名を組み立てる（値内の var(--X) 参照や
// 説明文を定義扱いしないため）。命名規約は generate-platform-tokens.mjs の
// pascalDash と同一。
function extractTokensJsonVars(file, out) {
  if (!existsSync(file)) return
  const t = JSON.parse(readFileSync(file, "utf8"))
  const pd = (k) => k.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("-")
  for (const [fam, val] of Object.entries(t.colors?.primitive ?? {})) {
    if (typeof val === "string") out.add(`--Primitive-${pd(fam)}`)
    else for (const shade of Object.keys(val)) out.add(`--Primitive-${pd(fam)}-${shade}`)
  }
  for (const shade of Object.keys(t.colors?.brand ?? {})) out.add(`--Primitive-Brand-${shade}`)
  for (const sem of [t.colors?.semantic, t.colors?.semanticDark]) {
    if (!sem) continue
    for (const [cat, roles] of Object.entries(sem)) {
      if (cat.startsWith("_") || typeof roles !== "object" || roles == null) continue
      if (cat === "brandExternal") continue // CSS 側と命名が異なるため CSS 宣言を正とする
      for (const role of Object.keys(roles)) {
        if (role.startsWith("_")) continue
        out.add(`--${pd(cat)}-${pd(role)}`)
      }
    }
  }
  for (const k of Object.keys(t.shadows ?? {})) if (!k.startsWith("_")) out.add(`--shadow-${k}`)
}

const definedVars = new Set()
for (const dir of ["src/styles", "src/themes"]) {
  const full = join(ROOT, dir)
  if (existsSync(full)) {
    for (const f of readdirSync(full).sort()) {
      if (f.endsWith(".css")) extractCssDeclarations(join(full, f), definedVars)
    }
  }
}
extractCssDeclarations(join(ROOT, "src/preset.css"), definedVars)
extractTokensJsonVars(join(ROOT, "tokens.json"), definedVars)

// CLI フラグ等、CSS 変数と紛らわしいが実際は無関係な誤検知の除外リスト
// （`--dry-run` `--access` `--force` 等。ドキュメント中のコマンド例に頻出）
const CSS_VAR_FALSE_POSITIVE_RE =
  /^--(dry-run|dry|access|force|quiet|tags|name-only|noEmit|no-verify|save-dev|format|changed|json|range|check|watch|help|version)$/

// プレースホルダー表現のトークン除去（--Surface-* / --Categorical-{1..16} /
// --{Category}-{Role} 等）。行ごとスキップすると同一行の本物の typo が
// 素通りするため、トークン単位で除去してから残りを検証する。
const PLACEHOLDER_TOKEN_RE = /--[A-Za-z0-9-]*(\{[^}]*\}|\*)[A-Za-z0-9*{},.-]*/g

let cssVarErrors = 0
for (const doc of docCache) {
  for (let i = 0; i < doc.lines.length; i += 1) {
    const lineNo = i + 1
    if (doc.ignored.has(lineNo)) continue
    const sanitized = doc.lines[i].replace(PLACEHOLDER_TOKEN_RE, "")
    const seen = new Set()
    for (const m of sanitized.matchAll(/--[A-Za-z][A-Za-z0-9-]*/g)) seen.add(m[0])
    for (const varName of seen) {
      if (CSS_VAR_FALSE_POSITIVE_RE.test(varName)) continue
      if (definedVars.has(varName)) continue
      error(`${doc.relPath}:${lineNo}: 未定義の CSS 変数 ${varName}`)
      cssVarErrors += 1
    }
  }
}

if (cssVarErrors === 0) ok("CSS 変数名チェック OK")

// ─── 結果 ───
console.log("")
console.log("=======================================")
if (errors > 0) {
  console.log(`${RED}✗ ドキュメント/コード乖離検出: ${errors} 件${NC}`)
  console.log("  ドキュメントを実態に合わせて修正するか、意図的な記述には")
  console.log("  <!-- docs-drift-ignore --> マーカー（単独行 or 行内）を追加してください")
  process.exit(1)
} else {
  console.log(`${GREEN}✓ 乖離なし — ドキュメントと実コードが一致しています${NC}`)
  process.exit(0)
}
