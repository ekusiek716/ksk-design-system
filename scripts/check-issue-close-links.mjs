#!/usr/bin/env node
/**
 * `Closes #N` の誤リンク検出（issue #486 の事故が由来）。
 *
 * PR #488 は本文に `Closes #486` を書いていたが、実装したのは
 * ResponsiveOverlayFrame の preset="plain" で、issue #486（BottomTabBar pill の
 * 面を公開変数化）とは無関係だった。その結果 #486 は**未実装のまま自動クローズ**
 * され、消費側（タビパル）はリリースされない要望を待ち続けていた。
 *
 * ── 判定方法 ──
 * contracts/components.json が持つ DS コンポーネント名を語彙として使う。
 *   issueComponents … issue のタイトル / 本文に現れるコンポーネント名
 *   prComponents    … PR が変更したファイルに対応するコンポーネント名 + PR タイトルに現れる名前
 * 両方が空でなく、かつ**共通要素が 0** なら「PR と issue が別物」の疑いとして報告する。
 *
 * 片方が空（インフラ・トークン・スクリプト等、コンポーネント名を含まない issue / PR）は
 * 機械的に判定できないので黙って飛ばす。誤検知を出して信用を落とすより取りこぼす方を選ぶ。
 *
 * ── 実行 ──
 *   node scripts/check-issue-close-links.mjs --pr 488     # 1本を検査
 *   node scripts/check-issue-close-links.mjs --recent 50  # 直近のマージ済み PR を監査
 *
 * gh CLI（ネットワーク）が要るので `npm run check` には**入れない**。
 * リリース前の棚卸しと、疑わしい PR を見つけたときに手で回す。
 * 疑いが1件でもあれば exit 1。
 */
import { readFileSync } from "node:fs"
import { execFileSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const REPO = "ekusiek716/ksk-design-system"

function gh(args) {
  return execFileSync("gh", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 })
}

/** contracts/components.json から {name, path} を集める（DS コンポーネント名の語彙） */
function loadComponents() {
  const json = JSON.parse(readFileSync(join(ROOT, "contracts/components.json"), "utf8"))
  const out = []
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk)
    if (!node || typeof node !== "object") return
    if (typeof node.name === "string" && typeof node.path === "string") {
      out.push({ name: node.name, path: node.path })
    }
    Object.values(node).forEach(walk)
  }
  walk(json)
  // 同名（web/native で同じ名前）は 1 つに畳む
  const byName = new Map()
  for (const c of out) {
    if (!byName.has(c.name)) byName.set(c.name, new Set())
    byName.get(c.name).add(c.path)
  }
  return [...byName].map(([name, paths]) => ({ name, paths: [...paths] }))
}

/**
 * テキスト中に現れるコンポーネント名。
 *
 * 前は前後どちらも英数字でない位置に限っていたが、`DialogContent` /
 * `SheetContent` のような**合成名**で親名を拾えず誤検知した（監査で実測）。
 * 先頭の境界だけ厳格にし、末尾は緩めて合成名も親名の言及として数える。
 * 名前が増える方向にしか効かないので、取りこぼし（見逃し）は増えるが
 * 誤検知は減る — この検査は誤検知を出さないことを優先する。
 */
export function namesInText(text, components) {
  const found = new Set()
  for (const { name } of components) {
    const re = new RegExp(`(^|[^A-Za-z0-9])${name}`)
    if (re.test(text)) found.add(name)
  }
  return found
}

/** 変更ファイルから引ける コンポーネント名 */
export function namesInFiles(files, components) {
  const found = new Set()
  for (const { name, paths } of components) {
    if (paths.some((p) => files.includes(p))) found.add(name)
  }
  return found
}

export const CLOSES_RE = /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#(\d+)/gi

/**
 * PR と issue が別物の疑いか。
 * どちらかが空（判定材料なし）のときは疑わない — 取りこぼす方を選ぶ。
 */
export function isSuspectLink(prNames, issueNames) {
  if (prNames.size === 0 || issueNames.size === 0) return false
  return [...issueNames].every((n) => !prNames.has(n))
}

function checkPr(number, components, issueCache) {
  const pr = JSON.parse(gh(["pr", "view", String(number), "--repo", REPO, "--json", "title,body,files,number"]))
  const files = (pr.files ?? []).map((f) => f.path)
  const body = pr.body ?? ""
  const refs = [...body.matchAll(CLOSES_RE)].map((m) => Number(m[1]))
  if (refs.length === 0) return []

  // PR 本文も材料に入れる。lint やスクリプトの修正のように、直す対象の
  // コンポーネントが**変更ファイルには現れない** PR があるため（監査で実測）。
  const prNames = new Set([
    ...namesInFiles(files, components),
    ...namesInText(`${pr.title ?? ""}\n${body}`, components),
  ])
  if (prNames.size === 0) return [] // 判定材料なし

  const suspects = []
  for (const ref of new Set(refs)) {
    if (!issueCache.has(ref)) {
      try {
        issueCache.set(ref, JSON.parse(gh(["issue", "view", String(ref), "--repo", REPO, "--json", "title,body,number"])))
      } catch {
        issueCache.set(ref, null) // PR 番号を参照している等
      }
    }
    const issue = issueCache.get(ref)
    if (!issue) continue
    const issueNames = namesInText(`${issue.title ?? ""}\n${issue.body ?? ""}`, components)
    if (issueNames.size === 0) continue // 判定材料なし

    if (isSuspectLink(prNames, issueNames)) {
      suspects.push({
        pr: pr.number,
        prTitle: pr.title,
        issue: ref,
        issueTitle: issue.title,
        prNames: [...prNames],
        issueNames: [...issueNames],
      })
    }
  }
  return suspects
}

const invokedDirectly = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (!invokedDirectly) {
  // テストから import されたときは CLI を走らせない（gh へ出ていかない）
} else {
  runCli()
}

function runCli() {
const argv = process.argv.slice(2)
const prIndex = argv.indexOf("--pr")
const recentIndex = argv.indexOf("--recent")
const components = loadComponents()
const issueCache = new Map()

let targets = []
if (prIndex !== -1) {
  targets = [Number(argv[prIndex + 1])]
} else {
  const limit = recentIndex !== -1 ? Number(argv[recentIndex + 1]) : 30
  const list = JSON.parse(
    gh(["pr", "list", "--repo", REPO, "--state", "merged", "--limit", String(limit), "--json", "number"]),
  )
  targets = list.map((p) => p.number)
}

const suspects = []
for (const n of targets) {
  try {
    suspects.push(...checkPr(n, components, issueCache))
  } catch (error) {
    console.error(`[issue-close-links] PR #${n} の取得に失敗: ${error.message.split("\n")[0]}`)
  }
}

if (suspects.length === 0) {
  console.log(`✓ issue-close-links: ${targets.length} 本の PR を検査、Closes の取り違えは見つかりませんでした`)
  process.exit(0)
}

console.error(`✗ issue-close-links: ${suspects.length} 件、PR と issue が別のコンポーネントを指しています\n`)
for (const s of suspects) {
  console.error(`  PR #${s.pr} ${s.prTitle}`)
  console.error(`    → Closes #${s.issue} ${s.issueTitle}`)
  console.error(`    PR が触ったコンポーネント : ${s.prNames.join(", ")}`)
  console.error(`    issue が指すコンポーネント: ${s.issueNames.join(", ")}`)
  console.error("")
}
console.error("issue 番号の取り違えなら、issue を再オープンして PR 本文を修正すること。")
process.exit(1)
}
