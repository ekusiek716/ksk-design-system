// =============================================================
// KSK Design System — 期限付きの例外台帳（test/known-exceptions.json）
//
// 「意図して基準を下回る」項目を 1 か所に集め、理由・issue・見直し期限
// （reviewBy）を必須にする。登録しておけば検査は通るが、
//   - 期限切れ（reviewBy < 今日。日付は UTC 基準）
//   - 使われていない登録（直った・対象が消えた）
// は検査で落とす。台帳が実態からずれて「載っているから通る」だけの飾りに
// なるのを防ぐため。期限が 30 日以内に迫った登録は失敗させずに警告する
// （期限日に無関係な PR が一斉に止まらないよう、事前に見直しを促す）。
//
// 区分:
//   a11y     … ストーリー側で axe を弱めている箇所（parameters.a11y の
//              rule 無効化・test:"off"/"todo"・disable:true）
//   contrast … scripts/check-contrast.mjs のトークンペアのうち基準未達のもの
//   visual   … 画像比較で、変化ピクセルを許容する場面（maxChangedPixels）
//
// 使う側: scripts/check-known-exceptions.mjs（npm run check）、
// scripts/check-contrast.mjs、scripts/check-visual.mjs、
// vitest.a11y.config.ts の globalSetup、test/visual/orphans.test.mjs
// =============================================================
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { join, relative } from "node:path"
import ts from "typescript"

export const LEDGER_PATH = "test/known-exceptions.json"
export const WARN_WITHIN_DAYS = 30
const SECTIONS = { a11y: ["target", "rule"], contrast: ["pair"], visual: ["scenario", "maxChangedPixels"] }
// ストーリーを探す場所（.stories.tsx / .stories.ts）。
const STORY_DIRS = ["src", "test/visual"]

export function loadKnownExceptions(root) {
  const ledger = JSON.parse(readFileSync(join(root, LEDGER_PATH), "utf8"))
  for (const section of Object.keys(SECTIONS)) ledger[section] ??= []
  return ledger
}

/** 今日の日付（YYYY-MM-DD・UTC）。テストでは固定値を渡す。 */
export const todayIso = () => new Date().toISOString().slice(0, 10)

/** 実在する暦日か（2027-02-31 のような繰り上がる日付を拒否するため往復で比べる）。 */
export function isCalendarDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

const daysBetween = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000)
const describeKey = (section, entry) => SECTIONS[section].map((f) => entry?.[f]).join(" / ")

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
    if (!isCalendarDate(entry?.reviewBy)) errors.push(`${where}: reviewBy は実在する日付を YYYY-MM-DD で書いてください（${entry?.reviewBy}）`)
    else if (entry.reviewBy < today) errors.push(`${where}: 見直し期限 ${entry.reviewBy}（UTC）を過ぎています（${describeKey(section, entry)}）。直すか、理由を見直して期限を延ばしてください`)
    const key = keyFields.filter((f) => f !== "maxChangedPixels").map((f) => entry?.[f]).join("::")
    if (seen.has(key)) errors.push(`${where}: 同じ対象が重複登録されています（${key}）`)
    seen.add(key)
  })
  return errors
}

/** 見直し期限が近い（今日から withinDays 日以内・期限内）登録の警告文を返す。失敗にはしない。 */
export function upcomingReviews(section, entries, today = todayIso(), withinDays = WARN_WITHIN_DAYS) {
  if (!Array.isArray(entries)) return []
  return entries
    .filter((entry) => isCalendarDate(entry?.reviewBy) && entry.reviewBy >= today && daysBetween(today, entry.reviewBy) <= withinDays)
    .map((entry) => `${section}: ${describeKey(section, entry)} の見直し期限 ${entry.reviewBy}（UTC）まで残り ${daysBetween(today, entry.reviewBy)} 日（${entry.issue}）`)
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) { if (entry.name !== "node_modules") walk(full, out) }
    else if (/\.stories\.tsx?$/.test(entry.name)) out.push(full)
  }
  return out
}

// `{...} satisfies Meta` / `{...} as Story` / `({...})` を剥がす。
function unwrap(node) {
  while (node && (ts.isSatisfiesExpression(node) || ts.isAsExpression(node) || ts.isParenthesizedExpression(node) || ts.isTypeAssertionExpression(node))) node = node.expression
  return node
}

function propertyName(prop) {
  const name = prop.name
  if (!name) return undefined
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name) || ts.isNumericLiteral(name)) return name.text
  return undefined
}

function getProperty(object, key) {
  for (const prop of object.properties) {
    if (ts.isPropertyAssignment(prop) && propertyName(prop) === key) return unwrap(prop.initializer)
    if (ts.isShorthandPropertyAssignment(prop) && prop.name.text === key) return prop.name
  }
  return undefined
}

const isFalse = (node) => node?.kind === ts.SyntaxKind.FalseKeyword
const isTrue = (node) => node?.kind === ts.SyntaxKind.TrueKeyword
const stringValue = (node) => (node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : undefined)

// rules を配列（[{ id, enabled:false }]）・オブジェクト（{ "id": { enabled:false } }）の
// どちらで書いても無効化したルール ID を拾う。静的に読めない形は "<dynamic>"。
function disabledRules(rules) {
  if (!rules) return []
  if (ts.isArrayLiteralExpression(rules)) {
    return rules.elements.flatMap((element) => {
      const item = unwrap(element)
      if (!ts.isObjectLiteralExpression(item)) return ["<dynamic>"]
      const enabled = getProperty(item, "enabled")
      if (enabled === undefined || isTrue(enabled)) return []
      const id = stringValue(getProperty(item, "id"))
      return [isFalse(enabled) ? (id ?? "<dynamic>") : "<dynamic>"]
    })
  }
  if (ts.isObjectLiteralExpression(rules)) {
    return rules.properties.flatMap((prop) => {
      if (!ts.isPropertyAssignment(prop)) return ["<dynamic>"]
      const value = unwrap(prop.initializer)
      const id = propertyName(prop) ?? "<dynamic>"
      if (isFalse(value)) return [id]
      if (!ts.isObjectLiteralExpression(value)) return isTrue(value) ? [] : ["<dynamic>"]
      const enabled = getProperty(value, "enabled")
      if (enabled === undefined || isTrue(enabled)) return []
      return [isFalse(enabled) ? id : "<dynamic>"]
    })
  }
  return ["<dynamic>"]
}

/** parameters.a11y の値から、axe を弱めている項目（ルール ID / test:off 等）を列挙する。 */
function a11yOverrides(a11y) {
  if (!a11y) return []
  if (!ts.isObjectLiteralExpression(a11y)) return ["<dynamic>"]
  const found = []
  const test = getProperty(a11y, "test")
  if (test !== undefined) {
    const value = stringValue(test)
    if (value === undefined) found.push("<dynamic>")
    else if (value !== "error") found.push(`test:${value}`)
  }
  const disable = getProperty(a11y, "disable")
  if (disable !== undefined && !isFalse(disable)) found.push(isTrue(disable) ? "disable" : "<dynamic>")
  for (const key of ["config", "options"]) {
    const holder = getProperty(a11y, key)
    if (holder === undefined) continue
    if (!ts.isObjectLiteralExpression(holder)) { found.push("<dynamic>"); continue }
    found.push(...disabledRules(getProperty(holder, "rules")))
  }
  return found
}

/**
 * ストーリーファイルを TypeScript の構文木で走査し、axe を弱めている箇所を列挙する。
 * target は `<相対パス>#<変数名>`（`export default {...}` は `#default`）、rule は
 * ルール ID、または `test:off` / `test:todo` / `disable` / `<dynamic>`（静的に読めない）。
 * キーの順番・rules の配列/オブジェクト表記・ネストの位置に依存しない。
 * @returns {Array<{ target: string, rule: string }>}
 */
export function scanStoryA11yOverrides(root, dirs = STORY_DIRS) {
  const found = []
  for (const file of dirs.flatMap((dir) => walk(join(root, dir))).sort()) {
    const rel = relative(root, file).split("\\").join("/")
    const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
    const visitObject = (name, node) => {
      const object = unwrap(node)
      if (!object || !ts.isObjectLiteralExpression(object)) return
      const parameters = getProperty(object, "parameters")
      if (!parameters) return
      const a11y = ts.isObjectLiteralExpression(parameters) ? getProperty(parameters, "a11y") : undefined
      for (const rule of a11yOverrides(a11y)) found.push({ target: `${rel}#${name}`, rule })
    }
    for (const statement of source.statements) {
      if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name) && declaration.initializer) visitObject(declaration.name.text, declaration.initializer)
        }
      } else if (ts.isExportAssignment(statement)) {
        visitObject("default", statement.expression)
      }
    }
  }
  return found
}

/**
 * a11y 区分の台帳とストーリー側の無効化箇所を双方向に突き合わせる。
 * 未登録の無効化（台帳を通らない例外）と、使われていない登録の両方をエラーにする。
 */
export function crossCheckA11y(entries, overrides) {
  const errors = []
  const key = (item) => `${item.target}::${item.rule}`
  const registered = new Set(entries.map(key))
  const actual = new Set(overrides.map(key))
  for (const item of overrides) {
    if (item.rule === "<dynamic>") { errors.push(`静的に読めない a11y 設定: ${item.target}。parameters.a11y はリテラル（変数・スプレッドを使わない形）で書いてください`); continue }
    if (!registered.has(key(item))) errors.push(`未登録の a11y 除外: ${item.target} の ${item.rule}。${LEDGER_PATH} の a11y に理由・issue・reviewBy 付きで登録してください`)
  }
  for (const item of entries) if (!actual.has(key(item))) errors.push(`使われていない a11y 登録: ${item.target} の ${item.rule}（ストーリー側に該当の除外がありません）。台帳から削除してください`)
  return errors
}

/** a11y 区分の形式・期限・突き合わせを一括で行う（vitest globalSetup と check 用）。 */
export function checkA11yLedger(root, today = todayIso()) {
  const ledger = loadKnownExceptions(root)
  return [...validateSection("a11y", ledger.a11y, today), ...crossCheckA11y(ledger.a11y, scanStoryA11yOverrides(root))]
}
