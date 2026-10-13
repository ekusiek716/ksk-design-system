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
//   6. SKILL.md / references に書いたトークンの px 値が src/styles の CSS 定義と一致する
//   5. テンプレートの角丸の許可セットが contracts/rules.json（AI3 の fix）と一致する
//   4. テンプレートが案内する `npx ksk-ds init --force` を init.js が実際に受け付ける
//
// 実行: node scripts/check-ai-rules-dist.mjs
// =============================================================
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

/**
 * consumer に配られていないが、ルート文書の「必読」に載っている DS 開発者向けのパス。
 * ここに入れたものは「配布漏れ」ではなく既知の未配布として扱う（現在は無し。
 * .claude/skills/ksk-design-system は files に入れて配布する）。
 */
export const DEV_ONLY_PREFIXES = []

/** ビルド生成物（リポジトリには無く、publish 時に prepack が作る）。実在確認は飛ばして配布対象かだけ見る */
const BUILD_OUTPUTS = ["dist"]

/** パッケージのルート直下で常に配布される（npm の仕様） */
const ALWAYS_SHIPPED = [/^package\.json$/, /^README(\..+)?$/i, /^LICENSE(\..+)?$/i, /^CHANGELOG(\..+)?$/i]

/** files / .npmignore の1エントリ（ファイル・ディレクトリ・簡易 glob）がパスを含むか */
function matchesEntry(path, entry) {
  const e = entry.replace(/^\.\//, "").replace(/^\//, "").replace(/\/+$/, "")
  if (/[*?]/.test(e)) {
    const re = new RegExp(
      "^" + e.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\u0000").replace(/\*/g, "[^/]*").replace(/\u0000/g, ".*") + "(/.*)?$",
    )
    return re.test(path)
  }
  return path === e || path.startsWith(e + "/")
}

/**
 * npm pack が配布するパスか。package.json の `files` を先頭から評価し（`!` 始まりは除外）、
 * 加えてルートの .npmignore の行（`npmignore`）に当たるものは配布しない。
 */
export function isShipped(path, files, npmignore = []) {
  const p = path.replace(/^\.\//, "").replace(/\/+$/, "")
  if (ALWAYS_SHIPPED.some((re) => re.test(p))) return true
  let shipped = false
  for (const entry of files) {
    if (entry.startsWith("!")) {
      if (matchesEntry(p, entry.slice(1))) shipped = false
    } else if (matchesEntry(p, entry)) {
      shipped = true
    }
  }
  if (shipped && npmignore.some((line) => matchesEntry(p, line))) return false
  return shipped
}

/** .npmignore の本文から有効な行（空行・コメント・否定を除く）を取り出す */
export function parseNpmignore(text) {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith("!"))
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

/** `rounded-xxx` の値（xxx）の集合を取り出す */
export function roundedSet(text) {
  return new Set([...text.matchAll(/rounded-([a-z0-9]+(?:\/[a-z0-9]+)*)/g)].flatMap((m) => m[1].split("/")))
}

/** テンプレートの角丸の行（「カスタム角丸」の表の行）の「代わりに使うもの」側の許可セット */
export function templateRoundedAllowed(text) {
  const row = text.split(/\r?\n/).find((l) => l.includes("カスタム角丸"))
  if (!row) return null
  const cells = row.split("|")
  const right = cells[2] ?? ""
  return roundedSet(right)
}

/** rules.json の許可セット（AI3 の fix。`rounded-a / rounded-b …` 形式） */
export function rulesRoundedAllowed(rules) {
  const ai3 = (rules.aiPatterns?.patterns ?? []).find((p) => p.id === "AI3")
  return ai3 ? roundedSet(ai3.fix) : null
}

/**
 * bin/init.js が実際に `--force` を引数として処理しているか。
 * `//` コメント行とヘルプ文（引用符で囲まれない `--force`）は数えず、引用符付きのリテラルだけを見る。
 */
export function acceptsForceFlag(initSource) {
  const code = initSource.split(/\r?\n/).filter((l) => !l.trim().startsWith("//")).join("\n")
  return /["'`]--force["'`]/.test(code)
}

/**
 * CSS からトークンの長さ（px 換算）を集める。`--Name: 0.875rem;` / `--Name: 24px;` の単純な値だけ対象。
 * 同名の再定義（dark・media query 内）は最初の定義を採る。
 * @returns {Map<string, number>}
 */
export function parseCssLengths(cssTexts) {
  const map = new Map()
  for (const css of cssTexts) {
    const noComments = css.replace(/\/\*[\s\S]*?\*\//g, "")
    for (const m of noComments.matchAll(/(--[A-Za-z][\w-]*)\s*:\s*(-?\d*\.?\d+)(rem|px)\s*;/g)) {
      if (map.has(m[1])) continue
      map.set(m[1], m[3] === "rem" ? Number(m[2]) * 16 : Number(m[2]))
    }
  }
  return map
}

/**
 * 文書中の `--Token` の直後に書かれた px 値（`(14)` / `14px` / `（14/24/32px）`）を CSS の定義と照合する。
 * 対象は CSS に長さの定義があるトークンだけ。トークンの次の `--Token` までを文脈とし、最初に現れる数値を見る。
 * @returns {{line: number, message: string}[]}
 */
export function findTokenPxMismatches(text, lengths) {
  const out = []
  const lines = text.split(/\r?\n/)
  lines.forEach((line, idx) => {
    // `--Radius-Surface|Modal|Sheet)]`（14/24/32px） の束ね書き
    for (const g of line.matchAll(/(--[A-Za-z]+-)([A-Za-z]+(?:\|[A-Za-z]+)+)[^（\n]{0,6}（([\d/]+)px）/g)) {
      const names = g[2].split("|")
      const nums = g[3].split("/").map(Number)
      names.forEach((n, i) => {
        const want = lengths.get(g[1] + n)
        if (want !== undefined && nums[i] !== undefined && nums[i] !== want) {
          out.push({ line: idx + 1, message: `${g[1]}${n} は ${nums[i]}px と書かれていますが CSS の定義は ${want}px です` })
        }
      })
    }
    // 単独の `--Token` ＋ 直後の (N) または N px
    const tokens = [...line.matchAll(/`?(--[A-Za-z][\w-]*)`?/g)]
    tokens.forEach((t, i) => {
      const want = lengths.get(t[1])
      if (want === undefined) return
      const start = t.index + t[0].length
      const end = i + 1 < tokens.length ? tokens[i + 1].index : line.length
      const seg = line.slice(start, end).replace(/（[^）]*）/g, "")
      const m = seg.match(/^\s*\((\d+)\)|^[^0-9]{0,12}?(\d+)\s*px/)
      const got = m ? Number(m[1] ?? m[2]) : undefined
      if (got !== undefined && got !== want) {
        out.push({ line: idx + 1, message: `${t[1]} は ${got}px と書かれていますが CSS の定義は ${want}px です` })
      }
    })
  })
  return out
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
export function checkAiRulesDist({ files, npmignore = [], initSource, templates, rootDocs, skillDocs = {}, cssSources = {}, exists, rules }) {
  const shipped = (p) => isShipped(p, files, npmignore)
  const problems = []
  const add = (kind, where, message) => problems.push({ kind, where, message })

  // 1. init.js が配るテンプレート
  const distributed = extractInitTemplates(initSource)
  if (distributed.length === 0) add("INIT", "bin/init.js", "配布テンプレート（src: \"templates/…\"）を1件も検出できません")
  for (const t of distributed) {
    if (!exists(t)) add("INIT", t, "init が配るテンプレートが存在しません")
    else if (!shipped(t)) add("NOT-SHIPPED", t, "init が配るテンプレートが package.json の files に入っていません")
  }

  // 2. テンプレート内の node_modules 参照
  for (const [name, text] of Object.entries(templates)) {
    for (const ref of extractTemplateRefs(text)) {
      if (!exists(ref)) add("MISSING", name, `参照先が存在しません: ${ref}`)
      else if (!shipped(ref)) add("NOT-SHIPPED", name, `参照先が package.json の files に入っていません: ${ref}`)
    }
    // 4. 案内するコマンド
    if (/ksk-ds init --force/.test(text) && !acceptsForceFlag(initSource)) {
      add("COMMAND", name, "`npx ksk-ds init --force` を案内していますが、bin/init.js の引数処理に \"--force\" がありません（コメント・ヘルプ文は数えない）")
    }
  }

  // 5. 角丸の許可セットを正本（rules.json）と突き合わせる
  const canonical = rules ? rulesRoundedAllowed(rules) : null
  if (rules && !canonical) add("RULES", "contracts/rules.json", "aiPatterns の AI3（角丸の許可セット）を検出できません")
  for (const [name, text] of Object.entries(templates)) {
    if (!canonical) break
    const got = templateRoundedAllowed(text)
    if (!got) add("RULES", name, "「カスタム角丸」の行を検出できません")
    else if ([...canonical].sort().join() !== [...got].sort().join()) {
      add("RULES", name, `角丸の許可セットが rules.json と食い違います（テンプレート: ${[...got].sort().join("/")} / 正本: ${[...canonical].sort().join("/")}）`)
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
      else if (!shipped(ref) && !DEV_ONLY_PREFIXES.some((p) => ref.startsWith(p))) {
        add("NOT-SHIPPED", name, `必読リストの参照先が package.json の files に入っていません: ${ref}`)
      }
    }
  }

  // 6. SKILL・references に書いたトークンの px 値を CSS の定義と突き合わせる
  const lengths = parseCssLengths(Object.values(cssSources))
  if (Object.keys(skillDocs).length > 0 && lengths.size === 0) add("TOKEN-PX", "src/styles", "CSS からトークンの長さ定義を1件も読めません")
  for (const [name, text] of Object.entries(skillDocs)) {
    for (const m of findTokenPxMismatches(text, lengths)) {
      add("TOKEN-PX", `${name}:${m.line}`, m.message)
    }
  }
  return problems
}

/** consumer に配る判断 Skill（SKILL.md と references/*.md）を {相対パス: 本文} で返す */
function readSkillDocs() {
  const dir = ".claude/skills/ksk-design-system"
  const rels = [`${dir}/SKILL.md`, ...readdirSync(join(ROOT, dir, "references")).filter((f) => f.endsWith(".md")).map((f) => `${dir}/references/${f}`)]
  return Object.fromEntries(rels.map((r) => [r, readFileSync(join(ROOT, r), "utf8")]))
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
    npmignore: existsSync(join(ROOT, ".npmignore")) ? parseNpmignore(read(".npmignore")) : [],
    skillDocs: readSkillDocs(),
    cssSources: Object.fromEntries(readdirSync(join(ROOT, "src/styles")).filter((f) => f.endsWith(".css")).map((f) => [f, read(`src/styles/${f}`)])),
    exists: existsRef,
    rules: JSON.parse(read("contracts/rules.json")),
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
