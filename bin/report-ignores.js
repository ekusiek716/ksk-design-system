// ksk-ds report-ignores
//
// consumer アプリが DS の lint を外すときに残した「理由付き ignore コメント」を、
// 複数リポ横断で集計する。複数のアプリが同じ理由で DS を迂回している箇所は、
// DS に足りない部品・API の候補になる（DS 側 issue 化の入力）。
//
// 拾うマーカー（文法の正本は lint.js / check-duplicates.js）:
//   ksk-ds-lint-ignore <RULE> -- 理由           行スコープ（lint.js の RULE_IGNORE_RE と同じ文法）
//   ksk-ds-lint-ignore-file <RULE> -- 理由      ファイルスコープ
//   ksk-ds-allow-custom-ui: 理由                ファイル全体・全ルール
//   ksk-ds-local-fallback: 理由 (issue #N)      DS に無い部品の一時実装（check-duplicates の抑制マーカー）
//   ksk-lint-ignore <RULE> -- 理由              DS 内部用（scripts/check-flex-shrink.mjs）。拾えるので拾う
//
// 文字列リテラル中のマーカーは数えない（lint.js と同じ maskCodeStrings を共有）。
// 集計ツールなので exit code は常に 0。引数不正のみ 2。

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { basename, extname, join, relative, resolve } from "node:path"
import {
  DEFAULT_IGNORES,
  DEFAULT_IGNORE_PATHS,
  MIN_ESCAPE_REASON_LENGTH,
  isMeaningfulReason,
  maskCodeStrings,
} from "./ignore-comment-utils.js"

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"])

/**
 * 走査しないディレクトリ名。lint の DEFAULT_IGNORES を共有し、
 * lint が見ない Expo / キャッシュ系だけ追加する。
 */
const IGNORED_DIRECTORIES = new Set([...DEFAULT_IGNORES, ".expo", ".cache"])

/** パス単位の除外（Capacitor の同期済み Web アセット。lint の DEFAULT_IGNORE_PATHS を共有） */
const IGNORED_PATHS = DEFAULT_IGNORE_PATHS

/**
 * 行スコープ・ファイルスコープ ignore。`ksk-ds-lint-ignore(-file) RULE -- 理由` の骨格と
 * 理由の取り方（`--` 以降・`*` の手前まで）は lint.js の RULE_IGNORE_RE と同じ。
 * ただしルール ID は lint.js の `[A-Za-z][A-Za-z0-9_]*` より狭く、P008 / KFX001 のような
 * 「英大文字始まりで数字を含む」形に限る。lint では散文中の
 * `ksk-ds-lint-ignore to suppress` のような言及の `to` も ID として読まれるが、
 * 集計ではそれをルールとして数えたくないため。DS のルール ID（P###・AI#・A### 等）は全てこの形。
 */
const LINT_IGNORE_RE = /ksk-ds-lint-ignore(-file)?\s+([A-Z][A-Za-z]*\d[A-Za-z0-9_]*)\s*(?:--\s*([^*]*))?/g
/** DS 内部用の ksk-lint-ignore */
const INTERNAL_IGNORE_RE = /ksk-lint-ignore\s+([A-Z][A-Za-z]*\d[A-Za-z0-9_]*)\s*(?:--\s*([^*]*))?/g
const ALLOW_CUSTOM_UI_RE = /ksk-ds-allow-custom-ui(?::\s*(.+))?/g
const LOCAL_FALLBACK_RE = /ksk-ds-local-fallback(?::\s*(.+))?/g

export const ALLOW_CUSTOM_UI_RULE = "ksk-ds-allow-custom-ui"
export const LOCAL_FALLBACK_RULE = "ksk-ds-local-fallback"

const DEFAULT_MIN_REPOS = 2
const TOP_FILES = 5
const TOP_REASONS = 3
const TEXT_TOP_REASONS = 8

const USAGE = `ksk-ds report-ignores

consumer アプリが DS の lint を外した理由付きコメントを、複数リポ横断で集計します。
複数のリポが同じルールを外している箇所は、DS に足りない部品・API の候補です。

使い方:
  ksk-ds report-ignores <dir...> [--json] [--min-repos N] [--rule ID]

引数:
  <dir...>        1 ディレクトリ = 1 リポ（プロダクト）として集計（リポ名はディレクトリ名）

オプション:
  --json          機械可読 JSON を出力（{ repos, byRule, candidates, invalid, incompleteFallbacks }）
  --min-repos N   N リポ以上で同じルールが外されていたら DS issue 候補にする（既定 ${DEFAULT_MIN_REPOS}）
  --rule ID       指定ルールだけ集計（例: P008 / ${ALLOW_CUSTOM_UI_RULE} / ${LOCAL_FALLBACK_RULE}）
  --help, -h      このヘルプ

拾うマーカー:
  ksk-ds-lint-ignore <RULE> -- 理由 / ksk-ds-lint-ignore-file <RULE> -- 理由
  ksk-ds-allow-custom-ui: 理由
  ksk-ds-local-fallback: 理由 (issue #N)
  ksk-lint-ignore <RULE> -- 理由（DS 内部用）

対象拡張子は .ts .tsx .js .jsx .mjs .css。node_modules / dist / build / .git / .expo /
storybook-static 等は除外。文字列リテラル中のマーカーは数えません。理由が
${MIN_ESCAPE_REASON_LENGTH} 文字未満のものは「理由不足」として別に数えます（判定は lint と同じ入力）。
ksk-ds-local-fallback は理由か issue 番号が欠けているものを別見出しで報告します。
読み取り専用。終了コードは常に 0（引数不正のみ 2）。
`

/**
 * ソース 1 ファイル分のマーカーを拾う。
 * @returns {{ kind: string, rule: string, line: number, reason: string, valid: boolean, issues: number[] }[]}
 */
export function collectIgnoreMarkers(source) {
  const lines = maskCodeStrings(source).split(/\r?\n/)
  const found = []

  const push = (kind, rule, line, rawReason) => {
    // 有効/無効の判定は lint.js が見ている文字列（マッチした生の理由）そのままで行う。
    // 閉じ記号を外すのは表示・集計用の reason だけ（外してから判定すると、lint では有効な
    // `{/* ksk-ds-allow-custom-ui: abcd */}` が理由不足に見えてしまう）。
    const reason = cleanReason(rawReason)
    found.push({
      kind,
      rule,
      line,
      reason,
      valid: isMeaningfulReason(rawReason),
      issues: extractIssueNumbers(reason),
    })
  }

  for (let index = 0; index < lines.length; index++) {
    const text = lines[index]
    if (!text.includes("ksk-")) continue
    const line = index + 1
    for (const match of text.matchAll(LINT_IGNORE_RE)) {
      push(match[1] ? "lint-ignore-file" : "lint-ignore", match[2], line, match[3])
    }
    for (const match of text.matchAll(INTERNAL_IGNORE_RE)) {
      push("internal-ignore", match[1], line, match[2])
    }
    for (const match of text.matchAll(ALLOW_CUSTOM_UI_RE)) {
      push("allow-custom-ui", ALLOW_CUSTOM_UI_RULE, line, match[1])
    }
    for (const match of text.matchAll(LOCAL_FALLBACK_RE)) {
      push("local-fallback", LOCAL_FALLBACK_RULE, line, match[1])
    }
  }

  return found
}

// コメントの閉じ記号（ブロックコメント終端・HTML コメント終端）や JSX の `}` を理由の末尾から外す
function cleanReason(raw) {
  return (raw ?? "")
    .replace(/\s*(?:\*\/\s*\}?|-->)\s*$/, "")
    .replace(/\s+/g, " ")
    .trim()
}

function extractIssueNumbers(reason) {
  const numbers = []
  // `issue #N` と `(#N)` の形だけ。色コード（#333）やアンカーは拾わない。
  for (const match of reason.matchAll(/issues?\s*#(\d+)(?![0-9A-Za-z])|#(\d+)(?![0-9A-Za-z])\s*\)/gi)) {
    numbers.push(Number(match[1] ?? match[2]))
  }
  return [...new Set(numbers)]
}

/**
 * 理由の重複まとめ用キー。小文字化・空白圧縮・句読点除去程度。
 * issue 番号はリポごとに違うので落とす（同じ理由の local-fallback を束ねるため）。
 */
export function normalizeReason(reason) {
  return reason
    .normalize("NFKC")
    .toLowerCase()
    .replace(/issues?\s*#?\d+/g, " ")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function collectSourceFiles(root) {
  const files = []
  const walk = (dir) => {
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const abs = join(dir, entry.name)
      if (entry.isSymbolicLink()) continue
      if (entry.isDirectory()) {
        if (IGNORED_DIRECTORIES.has(entry.name)) continue
        const rel = toPosix(relative(root, abs))
        if (IGNORED_PATHS.some((ignored) => rel === ignored || rel.endsWith(`/${ignored}`))) continue
        walk(abs)
        continue
      }
      if (!entry.isFile()) continue
      if (!SOURCE_EXTENSIONS.has(extname(entry.name))) continue
      if (/\.min\.(?:js|css)$/.test(entry.name)) continue
      files.push(abs)
    }
  }
  walk(root)
  return files
}

function toPosix(path) {
  return path.split("\\").join("/")
}

function parseArgs(argv) {
  const options = { dirs: [], json: false, minRepos: DEFAULT_MIN_REPOS, rule: null, help: false, error: null }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--help" || arg === "-h") {
      options.help = true
    } else if (arg === "--json") {
      options.json = true
    } else if (arg === "--min-repos" || arg.startsWith("--min-repos=")) {
      const raw = arg.includes("=") ? arg.slice(arg.indexOf("=") + 1) : argv[++i]
      if (!/^\d+$/.test(raw ?? "") || Number(raw) < 1) {
        options.error = `--min-repos には 1 以上の整数を指定してください: ${raw ?? "(未指定)"}`
      } else {
        options.minRepos = Number(raw)
      }
    } else if (arg === "--rule" || arg.startsWith("--rule=")) {
      const raw = arg.includes("=") ? arg.slice(arg.indexOf("=") + 1) : argv[++i]
      if (!raw || raw.startsWith("-")) options.error = `--rule にはルール ID を指定してください: ${raw ?? "(未指定)"}`
      else options.rule = raw
    } else if (arg.startsWith("-")) {
      options.error = `未知のオプションです: ${arg}`
    } else {
      options.dirs.push(arg)
    }
    if (options.error) break
  }
  if (!options.error && !options.help && options.dirs.length === 0) {
    options.error = "集計するディレクトリを 1 つ以上指定してください（例: ksk-ds report-ignores ../app-a ../app-b）"
  }
  return options
}

/**
 * ディレクトリ群から集計結果を作る（出力はしない）。
 * @param {string[]} dirs 絶対パスの配列。各ディレクトリを 1 リポとして扱う
 */
export function buildIgnoreReport(dirs, { minRepos = DEFAULT_MIN_REPOS, rule = null } = {}) {
  const names = dirs.map((dir) => basename(dir))
  const repoLabels = dirs.map((dir, i) => (names.filter((n) => n === names[i]).length > 1 ? dir : names[i]))

  const repos = []
  const occurrences = []
  dirs.forEach((dir, repoIndex) => {
    const repo = repoLabels[repoIndex]
    const files = collectSourceFiles(dir)
    let markerCount = 0
    for (const file of files) {
      let source
      try {
        source = readFileSync(file, "utf8")
      } catch {
        continue
      }
      if (!source.includes("ksk-")) continue
      for (const marker of collectIgnoreMarkers(source)) {
        if (rule && marker.rule.toLowerCase() !== rule.toLowerCase()) continue
        markerCount += 1
        occurrences.push({ ...marker, repo, file: toPosix(relative(dir, file)) })
      }
    }
    repos.push({ name: repo, path: dir, files: files.length, markers: markerCount })
  })

  // local-fallback は lint 側に有効/無効の概念が無い（check-duplicates の抑制マーカー）ので、
  // 「lint 上は無効」の invalid には入れず、別枠（incompleteFallbacks）で報告する。
  const incompleteFallbacks = occurrences
    .filter((o) => o.kind === "local-fallback" && (!o.valid || o.issues.length === 0))
    .map((o) => ({ repo: o.repo, file: o.file, line: o.line, rule: o.rule, kind: o.kind, reason: o.reason }))
    .sort(compareLocation)

  const invalid = occurrences
    .filter((o) => !o.valid && o.kind !== "local-fallback")
    .map((o) => ({ repo: o.repo, file: o.file, line: o.line, rule: o.rule, kind: o.kind, reason: o.reason }))
    .sort(compareLocation)

  /** @type {Map<string, any[]>} */
  const grouped = new Map()
  for (const occurrence of occurrences.filter((o) => o.valid)) {
    const list = grouped.get(occurrence.rule) ?? []
    list.push(occurrence)
    grouped.set(occurrence.rule, list)
  }

  const byRule = [...grouped.entries()].map(([ruleId, list]) => {
    const repoNames = [...new Set(list.map((o) => o.repo))].sort()
    const reasonMap = new Map()
    for (const o of list) {
      const key = normalizeReason(o.reason) || o.reason
      const entry = reasonMap.get(key) ?? { text: o.reason, count: 0 }
      entry.count += 1
      reasonMap.set(key, entry)
    }
    const reasons = [...reasonMap.values()].sort((a, b) => b.count - a.count || a.text.localeCompare(b.text))
    const result = {
      rule: ruleId,
      count: list.length,
      repos: repoNames,
      reasons,
      files: list.map((o) => ({ repo: o.repo, file: o.file, line: o.line })).sort(compareLocation),
    }
    if (ruleId === LOCAL_FALLBACK_RULE) {
      const issueMap = new Map()
      for (const o of list) {
        for (const number of o.issues) {
          const repoSet = issueMap.get(number) ?? new Set()
          repoSet.add(o.repo)
          issueMap.set(number, repoSet)
        }
      }
      result.issues = [...issueMap.entries()]
        .map(([number, repoSet]) => ({ number, repos: [...repoSet].sort() }))
        .sort((a, b) => a.number - b.number)
    }
    return result
  })
  byRule.sort((a, b) => b.repos.length - a.repos.length || b.count - a.count || a.rule.localeCompare(b.rule))

  const candidates = byRule
    .filter((entry) => entry.repos.length >= minRepos)
    .map((entry) => ({
      rule: entry.rule,
      count: entry.count,
      repos: entry.repos,
      reasons: entry.reasons.slice(0, TOP_REASONS),
      ...(entry.issues ? { issues: entry.issues } : {}),
    }))

  return { repos, byRule, candidates, invalid, incompleteFallbacks }
}

function compareLocation(a, b) {
  return (
    a.repo.localeCompare(b.repo) ||
    a.file.localeCompare(b.file) ||
    a.line - b.line ||
    (a.rule ?? "").localeCompare(b.rule ?? "")
  )
}

function formatText(report, { minRepos, rule }) {
  const out = []
  const totalFiles = report.repos.reduce((sum, repo) => sum + repo.files, 0)
  const validCount = report.byRule.reduce((sum, entry) => sum + entry.count, 0)
  out.push(
    `ksk-ds report-ignores: ${report.repos.length} リポ / ${totalFiles} ファイルを走査 / ignore ${validCount} 件` +
      `（理由不足 ${report.invalid.length} 件 / 不備のある local-fallback ${report.incompleteFallbacks.length} 件）${rule ? ` [--rule ${rule}]` : ""}`,
  )
  for (const repo of report.repos) {
    out.push(`  - ${repo.name}: ${repo.files} ファイル / マーカー ${repo.markers} 件`)
  }

  if (report.byRule.length === 0) {
    out.push("\nignore コメントは見つかりませんでした。")
  }

  for (const entry of report.byRule) {
    out.push(`\n■ ${entry.rule}  件数 ${entry.count} / リポ ${entry.repos.length}（${entry.repos.join(", ")}）`)
    out.push("  理由:")
    for (const reason of entry.reasons.slice(0, TEXT_TOP_REASONS)) out.push(`    - ${reason.text}（${reason.count}）`)
    if (entry.reasons.length > TEXT_TOP_REASONS) out.push(`    …ほか ${entry.reasons.length - TEXT_TOP_REASONS} 種類（--json で全件）`)
    if (entry.issues && entry.issues.length > 0) {
      out.push(`  issue: ${entry.issues.map((i) => `#${i.number}（${i.repos.join(", ")}）`).join(" / ")}`)
    }
    out.push("  出現ファイル:")
    for (const file of entry.files.slice(0, TOP_FILES)) out.push(`    ${file.repo}/${file.file}:${file.line}`)
    if (entry.files.length > TOP_FILES) out.push(`    …ほか ${entry.files.length - TOP_FILES} 件`)
  }

  if (report.invalid.length > 0) {
    out.push(`\n■ 理由不足（${MIN_ESCAPE_REASON_LENGTH} 文字未満・lint 上は無効な ignore）: ${report.invalid.length} 件`)
    for (const item of report.invalid) {
      out.push(`  ${item.repo}/${item.file}:${item.line} ${item.rule}（理由: ${item.reason ? `"${item.reason}"` : "なし"}）`)
    }
  }

  if (report.incompleteFallbacks.length > 0) {
    out.push(`\n■ 理由・issue 番号が不足した local-fallback: ${report.incompleteFallbacks.length} 件`)
    for (const item of report.incompleteFallbacks) {
      out.push(`  ${item.repo}/${item.file}:${item.line}（理由: ${item.reason ? `"${item.reason}"` : "なし"}）`)
    }
    out.push("  ※ 書式: // ksk-ds-local-fallback: DS に X が追加されたら削除 (issue #123)")
  }

  out.push(`\n■ DS issue 候補（${minRepos} リポ以上で同じルールが外されている）: ${report.candidates.length} 件`)
  if (report.candidates.length === 0) {
    out.push("  該当なし")
  }
  for (const candidate of report.candidates) {
    out.push(`  ${candidate.rule} — ${candidate.repos.join(", ")}（計 ${candidate.count} 件）`)
    for (const reason of candidate.reasons) out.push(`    例: ${reason.text}（${reason.count}）`)
    if (candidate.issues && candidate.issues.length > 0) {
      out.push(`    issue: ${candidate.issues.map((i) => `#${i.number}（${i.repos.join(", ")}）`).join(" / ")}`)
    }
  }
  return out.join("\n")
}

/**
 * @returns {number} 終了コード（集計ツールなので 0。引数不正のみ 2）
 */
export function runReportIgnoresCli(
  argv,
  { cwd = process.cwd(), log = console.log, error = console.error } = {},
) {
  const options = parseArgs(argv)
  if (options.help) {
    log(USAGE)
    return 0
  }
  if (options.error) {
    error(`ksk-ds report-ignores: ${options.error}`)
    error("使い方は ksk-ds report-ignores --help を参照してください。")
    return 2
  }

  const dirs = []
  for (const dir of options.dirs) {
    const abs = resolve(cwd, dir)
    if (!existsSync(abs) || !statSync(abs).isDirectory()) {
      error(`ksk-ds report-ignores: ディレクトリが見つかりません: ${abs}`)
      return 2
    }
    if (!dirs.includes(abs)) dirs.push(abs)
  }

  const report = buildIgnoreReport(dirs, { minRepos: options.minRepos, rule: options.rule })
  log(options.json ? JSON.stringify(report, null, 2) : formatText(report, options))
  return 0
}
