#!/usr/bin/env node
// =============================================================
// KSK Design System — consumer へ配る AI 向けルールの「配布漏れ」検査
//
// consumer の AI は、`npx ksk-ds init` で設置された templates/{CLAUDE,AGENTS}.md と、
// node_modules/ksk-design-system 配下の CLAUDE.md / AGENTS.md の指示に従って
// 「必読ファイル」を開く。その参照先が npm パッケージに**入っていない**と、AI は
// 存在しないファイルを探し、ルールを読まないまま実装する（静かに壊れる）。
//
// check-docs-drift.mjs / check-agents-docs-sync.mjs との棲み分け:
//   - check-docs-drift.mjs        … 文書が参照する名前・contracts・CSS 変数が実在するか
//   - check-agents-docs-sync.mjs  … CLAUDE.md ⇔ AGENTS.md の内容一致
//   - 本スクリプト                … 参照先が package.json の `files` に入っているか（配布されるか）、
//                                    init が配るテンプレートが `files` に入っているか、
//                                    テンプレートが案内するコマンド（init --force）が実在するか
//
// 検査項目:
//   1. bin/init.js が配るテンプレート（src: "templates/…"）が実在し、`files` に入っている
//   2. templates/*.md が参照する `node_modules/ksk-design-system/<path>` が実在し、`files` に入っている
//   3. ルートの CLAUDE.md / AGENTS.md の「必須: セッション開始時に読み込むファイル」の各パスが
//      実在し、`files` に入っている（DS 開発者専用の例外は DEV_ONLY_PREFIXES）
//   4. テンプレートが案内する `npx ksk-ds init --force` を init.js が実際に受け付ける
//
// 実行: node scripts/check-ai-rules-dist.mjs
// =============================================================
import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

/**
 * consumer に配られていないが、ルート文書の「必読」に載っている DS 開発者向けのパス。
 * ここに入れたものは「配布漏れ」ではなく既知の未配布として扱う。
 * 配布する方針に変えたら package.json の `files` に足してここから外す。
 */
export const DEV_ONLY_PREFIXES = [".claude/skills/"]

/** ビルド生成物（リポジトリには無く、publish 時に prepack が作る）。実在確認は飛ばして配布対象かだけ見る */
const BUILD_OUTPUTS = ["dist"]

/** パッケージのルート直下で常に配布される（npm の仕様） */
const ALWAYS_SHIPPED = [/^package\.json$/, /^README(\..+)?$/i, /^LICENSE(\..+)?$/i, /^CHANGELOG(\..+)?$/i]

/** package.json の files エントリ（ファイル・ディレクトリ・簡易 glob）がパスを含むか */
export function isShipped(path, files) {
  const p = path.replace(/^\.\//, "").replace(/\/+$/, "")
  if (ALWAYS_SHIPPED.some((re) => re.test(p))) return true
  return files.some((entry) => {
    const e = entry.replace(/^\.\//, "").replace(/\/+$/, "")
    if (/[*?]/.test(e)) {
      const re = new RegExp(
        "^" + e.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\u0000").replace(/\*/g, "[^/]*").replace(/\u0000/g, ".*") + "(/.*)?$",
      )
      return re.test(p)
    }
    return p === e || p.startsWith(e + "/")
  })
}

/** `a/{X,Y}.md` を `a/X.md` と `a/Y.md` に展開する（1段のみ） */
export function expandBraces(ref) {
  const m = ref.match(/^(.*)\{([^{}]+)\}(.*)$/)
  if (!m) return [ref]
  return m[2].split(",").map((alt) => `${m[1]}${alt}${m[3]}`)
}

/** 実在確認。`dir/*` や `dir/*.json` は親ディレクトリの実在で見る */
function existsRef(ref) {
  if (BUILD_OUTPUTS.some((b) => ref === b || ref.startsWith(b + "/"))) return true
  const base = ref.includes("*") ? ref.slice(0, ref.indexOf("*")) : ref
  return existsSync(join(ROOT, base))
}

const PKG_PREFIX = "node_modules/ksk-design-system/"

/** テンプレート本文から `node_modules/ksk-design-system/<path>` 参照を取り出す（パッケージ内パスに変換して返す） */
export function extractTemplateRefs(text) {
  const out = new Set()
  const re = /node_modules\/ksk-design-system\/((?:\{[^{}`\s]+\}|[A-Za-z0-9_.@\-/*])+)/g
  for (const m of text.matchAll(re)) {
    // 文末の句読点・コンマを落とす（`…/CLAUDE.md` の直後の `,` 等）
    const ref = m[1].replace(/[.,;:]+$/, "")
    // `@source "../node_modules/ksk-design-system/dist"` のようなディレクトリ参照もそのまま扱う
    for (const r of expandBraces(ref)) out.add(r)
  }
  return [...out]
}

/** ルート文書の「セッション開始時に読み込むファイル」節のコードブロックからパスを取り出す */
export function extractRootReadList(text) {
  const lines = text.split(/\r?\n/)
  const start = lines.findIndex((l) => /^#{2,3}\s.*セッション開始時に読み込むファイル/.test(l))
  if (start < 0) return null
  const fence = lines.findIndex((l, i) => i > start && l.startsWith("```"))
  if (fence < 0) return null
  const refs = []
  for (let i = fence + 1; i < lines.length && !lines[i].startsWith("```"); i += 1) {
    const first = lines[i].trim().split(/\s+/)[0]
    if (first) refs.push(first)
  }
  return refs
}

/** init.js が配るテンプレート（`src: "templates/…"`）を取り出す */
export function extractInitTemplates(initSource) {
  return [...initSource.matchAll(/src:\s*"(templates\/[^"]+)"/g)].map((m) => m[1])
}

/**
 * 全検査を実行して違反のリストを返す（純関数。ファイル読み込みは引数で受ける）。
 * @param {{files: string[], initSource: string, templates: Record<string,string>, rootDocs: Record<string,string>, exists: (ref:string)=>boolean}} input
 * @returns {{kind: string, where: string, message: string}[]}
 */
export function checkAiRulesDist({ files, initSource, templates, rootDocs, exists }) {
  const problems = []
  const add = (kind, where, message) => problems.push({ kind, where, message })

  // 1. init.js が配るテンプレート
  const distributed = extractInitTemplates(initSource)
  if (distributed.length === 0) add("INIT", "bin/init.js", "配布テンプレート（src: \"templates/…\"）を1件も検出できません")
  for (const t of distributed) {
    if (!exists(t)) add("INIT", t, "init が配るテンプレートが存在しません")
    else if (!isShipped(t, files)) add("NOT-SHIPPED", t, "init が配るテンプレートが package.json の files に入っていません")
  }

  // 2. テンプレート内の node_modules 参照
  for (const [name, text] of Object.entries(templates)) {
    for (const ref of extractTemplateRefs(text)) {
      if (!exists(ref)) add("MISSING", name, `参照先が存在しません: ${ref}`)
      else if (!isShipped(ref, files)) add("NOT-SHIPPED", name, `参照先が package.json の files に入っていません: ${ref}`)
    }
    // 4. 案内するコマンド
    if (/ksk-ds init --force/.test(text) && !/--force/.test(initSource)) {
      add("COMMAND", name, "`npx ksk-ds init --force` を案内していますが、bin/init.js が --force を受け付けません")
    }
  }

  // 3. ルート文書の必読リスト
  for (const [name, text] of Object.entries(rootDocs)) {
    const refs = extractRootReadList(text)
    if (refs === null) {
      add("STRUCTURE", name, "「セッション開始時に読み込むファイル」節のコードブロックを検出できません（見出しを変えた場合は本スクリプトも更新）")
      continue
    }
    for (const ref of refs) {
      if (!exists(ref)) add("MISSING", name, `必読リストの参照先が存在しません: ${ref}`)
      else if (!isShipped(ref, files) && !DEV_ONLY_PREFIXES.some((p) => ref.startsWith(p))) {
        add("NOT-SHIPPED", name, `必読リストの参照先が package.json の files に入っていません: ${ref}`)
      }
    }
  }
  return problems
}

function main() {
  const RED = "\x1b[0;31m"
  const GREEN = "\x1b[0;32m"
  const NC = "\x1b[0m"
  console.log("🔍 KSK Design System — AI 向けルールの配布漏れ検査")
  console.log("=======================================")

  const read = (rel) => readFileSync(join(ROOT, rel), "utf8")
  const pkg = JSON.parse(read("package.json"))
  const problems = checkAiRulesDist({
    files: pkg.files ?? [],
    initSource: read("bin/init.js"),
    templates: { "templates/CLAUDE.md": read("templates/CLAUDE.md"), "templates/AGENTS.md": read("templates/AGENTS.md") },
    rootDocs: { "CLAUDE.md": read("CLAUDE.md"), "AGENTS.md": read("AGENTS.md") },
    exists: existsRef,
  })

  for (const p of problems) console.log(`${RED}[AI-RULES-DIST:${p.kind}]${NC} ${p.where}: ${p.message}`)
  console.log("=======================================")
  if (problems.length > 0) {
    console.log(`${RED}✗ ${problems.length} 件の配布漏れ・不整合があります${NC}`)
    process.exit(1)
  }
  console.log(`${GREEN}✓ consumer へ配る AI 向けルールの参照先はすべて配布されます${NC}`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
