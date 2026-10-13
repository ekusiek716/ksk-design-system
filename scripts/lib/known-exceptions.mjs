// =============================================================
// KSK Design System — 期限付きの例外台帳（test/known-exceptions.json）
//
// 「意図して基準を下回る」項目を 1 か所に集め、理由・issue・見直し期限
// （reviewBy）を必須にする。登録しておけば検査は通るが、
//   - 期限切れ（reviewBy < 今日）
//   - 使われていない登録（直った・対象が消えた）
// は検査で落とす。台帳が実態からずれて「載っているから通る」だけの飾りに
// なるのを防ぐため。
//
// 区分:
//   a11y     … ストーリー側で axe ルールを無効化している箇所
//              （parameters.a11y.config.rules の enabled:false / a11y.test:"off"）
//   contrast … scripts/check-contrast.mjs のトークンペアのうち基準未達のもの
//   visual   … 画像比較で、変化ピクセルを許容する場面（maxChangedPixels）
//
// 使う側: scripts/check-known-exceptions.mjs（npm run check）、
// scripts/check-contrast.mjs、scripts/check-visual.mjs、
// vitest.a11y.config.ts の globalSetup、test/visual/orphans.test.mjs
// =============================================================
import { readFileSync, readdirSync } from "node:fs"
import { join, relative } from "node:path"

export const LEDGER_PATH = "test/known-exceptions.json"
const SECTIONS = { a11y: ["target", "rule"], contrast: ["pair"], visual: ["scenario", "maxChangedPixels"] }

export function loadKnownExceptions(root) {
  const ledger = JSON.parse(readFileSync(join(root, LEDGER_PATH), "utf8"))
  for (const section of Object.keys(SECTIONS)) ledger[section] ??= []
  return ledger
}

/** 今日の日付（YYYY-MM-DD・UTC）。テストでは固定値を渡す。 */
export const todayIso = () => new Date().toISOString().slice(0, 10)

/** 1 区分の各登録の形式と期限を検査し、エラー文の配列を返す。 */
export function validateSection(section, entries, today = todayIso()) {
  const errors = []
  const keyFields = SECTIONS[section]
  if (!keyFields) return [`未知の区分: ${section}`]
  if (!Array.isArray(entries)) return [`${section}: 配列で書いてください`]
  const seen = new Set()
  entries.forEach((entry, index) => {
    const where = `${section}[${index}]`
    for (const field of keyFields) if (entry?.[field] === undefined || entry[field] === "") errors.push(`${where}: ${field} がありません`)
    if (typeof entry?.reason !== "string" || entry.reason.trim().length < 10) errors.push(`${where}: reason（なぜ基準を下回ってよいか）を 10 文字以上で書いてください`)
    if (typeof entry?.issue !== "string" || !/^(#\d+|https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/(issues|pull)\/\d+)$/.test(entry.issue)) errors.push(`${where}: issue は "#123" か GitHub の issue/PR URL で書いてください`)
    if (typeof entry?.reviewBy !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewBy) || Number.isNaN(Date.parse(entry.reviewBy))) errors.push(`${where}: reviewBy は YYYY-MM-DD で書いてください`)
    else if (entry.reviewBy < today) errors.push(`${where}: 見直し期限 ${entry.reviewBy} を過ぎています（${keyFields.map(f => entry[f]).join(" / ")}）。直すか、理由を見直して期限を延ばしてください`)
    const key = keyFields.filter(f => f !== "maxChangedPixels").map(f => entry?.[f]).join("::")
    if (seen.has(key)) errors.push(`${where}: 同じ対象が重複登録されています（${key}）`)
    seen.add(key)
  })
  return errors
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.name.endsWith(".stories.tsx")) out.push(full)
  }
  return out
}

/**
 * ストーリーファイルを静的に走査し、axe ルールの無効化箇所を列挙する。
 * target は `<相対パス>#<export 名>`（meta 全体の場合は `#meta`）、rule は
 * ルール ID（a11y.test:"off" は "*"）。
 * @returns {Array<{ target: string, rule: string }>}
 */
export function scanStoryA11yOverrides(root, sourceDir = "src") {
  const found = []
  for (const file of walk(join(root, sourceDir))) {
    const rel = relative(root, file).split("\\").join("/")
    const text = readFileSync(file, "utf8")
    // export const X / const meta / export default で区切り、区切りごとに対象名を決める。
    const marker = /^(?:export const (\w+)|const meta\b|export default\b)/gm
    const starts = []
    let m
    while ((m = marker.exec(text))) starts.push({ index: m.index, name: m[1] ?? "meta" })
    starts.forEach((start, i) => {
      const block = text.slice(start.index, starts[i + 1]?.index ?? text.length)
      const ruleRe = /id:\s*["']([\w-]+)["']\s*,\s*enabled:\s*false/g
      let r
      while ((r = ruleRe.exec(block))) found.push({ target: `${rel}#${start.name}`, rule: r[1] })
      if (/a11y:\s*\{[^}]*\btest:\s*["']off["']/.test(block)) found.push({ target: `${rel}#${start.name}`, rule: "*" })
    })
  }
  return found
}

/**
 * a11y 区分の台帳とストーリー側の無効化箇所を双方向に突き合わせる。
 * 未登録の無効化（台帳を通らない例外）と、使われていない登録の両方をエラーにする。
 */
export function crossCheckA11y(entries, overrides) {
  const errors = []
  const key = item => `${item.target}::${item.rule}`
  const registered = new Set(entries.map(key))
  const actual = new Set(overrides.map(key))
  for (const item of overrides) if (!registered.has(key(item))) errors.push(`未登録の a11y 除外: ${item.target} の ${item.rule === "*" ? "a11y.test:\"off\"" : item.rule}。${LEDGER_PATH} の a11y に理由・issue・reviewBy 付きで登録してください`)
  for (const item of entries) if (!actual.has(key(item))) errors.push(`使われていない a11y 登録: ${item.target} の ${item.rule}（ストーリー側に該当の除外がありません）。台帳から削除してください`)
  return errors
}

/** a11y 区分の形式・期限・突き合わせを一括で行う（vitest globalSetup と check 用）。 */
export function checkA11yLedger(root, today = todayIso()) {
  const ledger = loadKnownExceptions(root)
  return [...validateSection("a11y", ledger.a11y, today), ...crossCheckA11y(ledger.a11y, scanStoryA11yOverrides(root))]
}
