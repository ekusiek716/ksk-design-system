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
//   - 件数そのものの一致                             → 正本側の各 check
//     ただし正本と競合する可変件数を文書へ直書きすることは禁止する。
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
  "UPDATING.md",
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
// マーカーの2形態:
//   1) 単独行 `<!-- docs-drift-ignore -->` → 次の1行を丸ごと検査対象から除外
//   2) 行内 `<!-- docs-drift-ignore: <トークン...> -->` → spec 部に書かれた
//      トークン（CSS 変数候補 / PascalCase 名）だけをその行で除外する。
//      spec 無しの行内マーカーは、マーカー直後の最初の1トークンのみ除外。
// docCache: { relPath, text, lines, ignored: Set<lineNo>, ignoredTokens: Map<lineNo, Set<string>> }
const MARKER_ONLY_RE = /^\s*<!--\s*docs-drift-ignore[^>]*-->\s*$/
const INLINE_MARKER_RE = /<!--\s*docs-drift-ignore(?::([^>]*?))?\s*-->/g
const TOKEN_IN_SPEC_RE = /--[A-Za-z][A-Za-z0-9-]*(?:\/[A-Za-z0-9/-]*)?|\b[A-Z][a-zA-Z]+\b/g

const docCache = docs.map((full) => {
  const text = readFileSync(full, "utf8")
  const lines = text.split(/\r?\n/)
  const ignored = new Set()
  const ignoredTokens = new Map()
  for (let i = 0; i < lines.length; i += 1) {
    const lineNo = i + 1
    if (MARKER_ONLY_RE.test(lines[i])) {
      ignored.add(lineNo) // マーカー行自身
      ignored.add(lineNo + 1) // 次の1行
      continue
    }
    for (const m of lines[i].matchAll(INLINE_MARKER_RE)) {
      const tokens = ignoredTokens.get(lineNo) ?? new Set()
      const spec = (m[1] ?? "").trim()
      if (spec) {
        // spec 内のトークン（--Var 形式は / 区切り省略記法の先頭部も拾う）
        for (const t of spec.matchAll(TOKEN_IN_SPEC_RE)) {
          const tok = t[0].split("/")[0]
          tokens.add(tok)
        }
      } else {
        // spec 無し: マーカー直後の最初の1トークンのみ
        const rest = lines[i].slice(m.index + m[0].length)
        const first = rest.match(/--[A-Za-z][A-Za-z0-9-]*|`([A-Z][a-zA-Z]+)`/)
        if (first) tokens.add(first[1] ?? first[0])
      }
      if (tokens.size > 0) ignoredTokens.set(lineNo, tokens)
    }
  }
  return { relPath: relative(ROOT, full), text, lines, ignored, ignoredTokens }
})

const isTokenIgnored = (doc, lineNo, token) => doc.ignoredTokens.get(lineNo)?.has(token) ?? false

// =============================================================
// 0) 正本と競合する可変件数の直書き禁止
// =============================================================
console.log("")
console.log("─── 可変件数の直書きチェック ───")

const MUTABLE_COUNT_PATTERNS = [
  /(?:既存|全)\s*\d+\s*コンポーネント/,
  /禁止パターン\s*\d+\s*件/,
  /AIアンチパターン\s*\d+\s*件/,
]
let mutableCountErrors = 0
for (const doc of docCache) {
  for (let i = 0; i < doc.lines.length; i += 1) {
    const lineNo = i + 1
    if (doc.ignored.has(lineNo)) continue
    if (!MUTABLE_COUNT_PATTERNS.some((pattern) => pattern.test(doc.lines[i]))) continue
    error(
      `${doc.relPath}:${lineNo}: 可変件数を直書きせず、contracts の正本または生成済み索引を参照してください`,
    )
    mutableCountErrors += 1
  }
}

if (mutableCountErrors === 0) ok("可変件数の直書きなし")

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

// モジュール指定子をファイルパスに解決（.ts / .tsx / /index.ts の順に試す）
function resolveModule(fromFile, spec) {
  const base = join(dirname(fromFile), spec)
  for (const cand of [`${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")]) {
    if (existsSync(cand)) return cand
  }
  return null
}

// エクスポート名の収集。`Foo as Bar` は元名と alias（公開名）の両方を許容する。
// `export * from "./xxx"` は depth 段まで再帰的に辿る（現状の index 構成では1段で十分）。
function extractExports(file, names = new Set(), depth = 1, visited = new Set()) {
  if (!existsSync(file) || visited.has(file)) return names
  visited.add(file)
  const src = readFileSync(file, "utf8")
  for (const m of src.matchAll(/\{([^}]*)\}/g)) {
    for (const tok of m[1].split(",")) {
      const base = tok.trim().replace(/^type\s+/, "")
      for (const part of base.split(/\s+as\s+/)) {
        const t = part.trim()
        if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(t)) names.add(t)
      }
    }
  }
  // export const / function / class / type / interface の宣言エクスポート
  for (const m of src.matchAll(/^export\s+(?:const|function|class|type|interface|enum)\s+([A-Za-z_][A-Za-z0-9_]*)/gm)) {
    names.add(m[1])
  }
  // star re-export を1段解決
  if (depth > 0) {
    for (const m of src.matchAll(/^export\s+\*\s+from\s+["']([^"']+)["']/gm)) {
      const resolved = resolveModule(file, m[1])
      if (resolved) extractExports(resolved, names, depth - 1, visited)
    }
  }
  return names
}

const knownNames = new Set()
for (const f of ["src/index.ts", "src/native/index.ts"]) {
  extractExports(join(ROOT, f), knownNames)
}

const lineNoOfIndex = (text, index) => text.slice(0, index).split("\n").length

let componentErrors = 0
// 照合順序: まず export プール（実在すれば OK。typo 検出のため最優先）
// → ホワイトリスト → *Icon/*Screen のプレースホルダー除外（backtick/JSX のみ。
//    実在しない場合に限りプレースホルダー扱いにする）
const checkName = (doc, lineNo, name, { allowPlaceholder = true } = {}) => {
  if (knownNames.has(name)) return
  if (WHITELIST.has(name)) return
  if (allowPlaceholder && PLACEHOLDER_NAME_RE.test(name)) return
  if (isTokenIgnored(doc, lineNo, name)) return
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
    // import はパッケージからの取得を明示しているため、*Icon/*Screen の
    // プレースホルダー除外は適用しない（実在しなければ必ずエラー）
    for (const name of seen) {
      if (knownNames.has(name)) continue
      if (WHITELIST.has(name)) continue
      if (isTokenIgnored(doc, lineNo, name)) continue
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

// プレースホルダー表現のトークン除去（--Surface-* / --Categorical-{1..16} /
// --{Category}-{Role} 等）。行ごとスキップすると同一行の本物の typo が
// 素通りするため、トークン単位で除去してから残りを検証する。
const PLACEHOLDER_TOKEN_RE = /--[A-Za-z0-9-]*(\{[^}]*\}|\*)[A-Za-z0-9*{},.-]*/g

// CSS 変数候補は `--` 直後が大文字の PascalCase 形式のみ。
// KSK のトークンは全て大文字始まり（--Surface-Primary 等）なので、
// `--dry-run` / `--json` のような CLI フラグ（小文字始まり）は原理的に除外される。
// （小文字始まりの bridge 変数 --primary / --shadow-md 等は本チェックの対象外）
const CSS_VAR_CANDIDATE_RE = /--[A-Z][A-Za-z0-9-]*/g

let cssVarErrors = 0
for (const doc of docCache) {
  for (let i = 0; i < doc.lines.length; i += 1) {
    const lineNo = i + 1
    if (doc.ignored.has(lineNo)) continue
    const sanitized = doc.lines[i].replace(PLACEHOLDER_TOKEN_RE, "")
    const seen = new Set()
    for (const m of sanitized.matchAll(CSS_VAR_CANDIDATE_RE)) seen.add(m[0])
    for (const varName of seen) {
      if (definedVars.has(varName)) continue
      if (isTokenIgnored(doc, lineNo, varName)) continue
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
