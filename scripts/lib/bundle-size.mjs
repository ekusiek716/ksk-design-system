// =============================================================
// KSK Design System — 配布物サイズ予算（contracts/bundle-size-budget.json）の純関数群
//
// scripts/check-bundle-size.mjs（実測・表示・exit code）から使う。ここには
// 「予算 JSON の形式検査」「超過 / 余裕 / 締め直し注意の判定」「予算の再計算」
// 「dist のエントリから静的 import を辿る」といった、ビルドを伴わないロジックだけを
// 置き、__tests__/check-bundle-size.test.ts で単体検証する。
// =============================================================
import { readFileSync, existsSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { gzipSync, brotliCompressSync, constants as zlibConstants } from "node:zlib"
import { ImportType, init, parse } from "es-module-lexer"

export const BUDGET_PATH = "contracts/bundle-size-budget.json"

/** 予算 = 実測 × (1 + 10%) を、下の単位で切り上げる（小さい成果物でも 0 バイト差の予算にならないように）。 */
export const HEADROOM_RATIO = 0.1
export const BUDGET_ROUND_UP_BYTES = 100
/** 実測が予算の 80% 以下（予算より 20% 以上少ない）なら、予算を締め直せると注意を出す（失敗にはしない）。 */
export const TIGHTEN_RATIO = 0.2

export const gzipBytes = (input) => gzipSync(input, { level: 9 }).length
export const brotliBytes = (input) =>
  brotliCompressSync(input, {
    params: {
      [zlibConstants.BROTLI_PARAM_QUALITY]: 11,
      [zlibConstants.BROTLI_PARAM_SIZE_HINT]: Buffer.byteLength(input),
    },
  }).length

/** 実測 gzip バイト数から予算を作る（+10% を 100 バイト単位で切り上げ）。 */
export function computeBudget(baselineBytes) {
  const withHeadroom = Math.ceil(baselineBytes * (1 + HEADROOM_RATIO))
  return Math.ceil(withHeadroom / BUDGET_ROUND_UP_BYTES) * BUDGET_ROUND_UP_BYTES
}

/**
 * 1 件の実測値を予算と突き合わせる。
 *   over    … 予算超過（失敗）
 *   tighten … 予算より 20% 以上少ない（失敗にはしない。予算を締め直せる）
 *   ok      … 予算内
 */
export function judge(measuredBytes, budgetBytes, tightenRatio = TIGHTEN_RATIO) {
  const usage = budgetBytes > 0 ? measuredBytes / budgetBytes : Number.POSITIVE_INFINITY
  if (measuredBytes > budgetBytes) return { status: "over", usage, diff: measuredBytes - budgetBytes }
  if (measuredBytes <= budgetBytes * (1 - tightenRatio)) return { status: "tighten", usage, diff: measuredBytes - budgetBytes }
  return { status: "ok", usage, diff: measuredBytes - budgetBytes }
}

const isNonNegativeInt = (v) => Number.isInteger(v) && v >= 0
const isCalendarDate = (v) => {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false
  const d = new Date(`${v}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v
}

function validateItem(where, item, errors, requiredStrings) {
  if (typeof item !== "object" || item === null) {
    errors.push(`${where}: オブジェクトで書いてください`)
    return
  }
  for (const key of requiredStrings) {
    if (typeof item[key] !== "string" || item[key].trim() === "") errors.push(`${where}: ${key} がありません`)
  }
  if (!isNonNegativeInt(item.baselineBytes) || item.baselineBytes === 0) errors.push(`${where}: baselineBytes は 1 以上の整数で書いてください`)
  if (!isNonNegativeInt(item.budgetBytes) || item.budgetBytes === 0) errors.push(`${where}: budgetBytes は 1 以上の整数で書いてください`)
  else if (isNonNegativeInt(item.baselineBytes) && item.budgetBytes < item.baselineBytes) {
    errors.push(`${where}: budgetBytes(${item.budgetBytes}) が baselineBytes(${item.baselineBytes}) を下回っています（現状値で既に予算超過）`)
  }
}

/** 予算 JSON の形式を検査し、エラー文の配列を返す（空なら正常）。 */
export function validateBudget(budget) {
  const errors = []
  if (typeof budget !== "object" || budget === null) return ["予算 JSON がオブジェクトではありません"]
  const meta = budget.meta
  if (typeof meta !== "object" || meta === null) errors.push("meta がありません")
  else {
    if (!isCalendarDate(meta.updatedAt)) errors.push("meta.updatedAt は実在する YYYY-MM-DD で書いてください")
    for (const key of ["metric", "budgetPolicy", "externalPolicy"]) {
      if (typeof meta[key] !== "string" || meta[key].trim() === "") errors.push(`meta.${key} がありません（予算の根拠・測定方法の説明）`)
    }
  }
  const seen = new Set()
  for (const [section, required] of [
    ["entries", ["id", "specifier", "file", "description"]],
    ["treeShaking", ["id", "description", "source"]],
  ]) {
    const items = budget[section]
    if (!Array.isArray(items) || items.length === 0) {
      errors.push(`${section}: 1 件以上の配列で書いてください`)
      continue
    }
    items.forEach((item, index) => {
      const where = `${section}[${index}]${item?.id ? ` (${item.id})` : ""}`
      validateItem(where, item, errors, required)
      if (typeof item?.id === "string") {
        const key = `${section}:${item.id}`
        if (seen.has(key)) errors.push(`${where}: id が重複しています`)
        seen.add(key)
      }
      if (section === "treeShaking") {
        if (!Array.isArray(item?.imports) || item.imports.length === 0) errors.push(`${where}: imports（[{from, names}]）がありません`)
        else
          item.imports.forEach((imp, i) => {
            if (typeof imp?.from !== "string" || !Array.isArray(imp?.names) || imp.names.length === 0 || imp.names.some((n) => typeof n !== "string"))
              errors.push(`${where}: imports[${i}] は {from: string, names: string[]} で書いてください`)
          })
      }
    })
  }
  return errors
}

/** package.json の exports から、dist/ 配下の JS を指す公開エントリ（subpath → 相対ファイル）を取り出す。 */
export function exportedJsEntries(pkg) {
  const result = []
  for (const [subpath, target] of Object.entries(pkg.exports ?? {})) {
    const file = typeof target === "string" ? target : (target?.import ?? target?.default)
    if (typeof file !== "string" || !file.endsWith(".js")) continue
    const normalized = file.replace(/^\.\//, "")
    // ビルド成果物（dist/）だけが対象。eslint/ のようにソースをそのまま配る JS は測らない。
    if (!normalized.startsWith("dist/")) continue
    result.push({ subpath, file: normalized })
  }
  return result
}

/** exports が指す JS と予算の entries の食い違い（予算の無い公開エントリ・exports に無い予算）を文で返す。 */
export function checkEntriesCoverage(pkg, budget) {
  const errors = []
  const exported = exportedJsEntries(pkg)
  const budgeted = new Map((budget.entries ?? []).map((e) => [e.file, e]))
  for (const { subpath, file } of exported) {
    if (!budgeted.has(file)) errors.push(`package.json exports "${subpath}" → ${file} の予算が entries にありません`)
  }
  const exportedFiles = new Set(exported.map((e) => e.file))
  for (const entry of budget.entries ?? []) {
    if (!exportedFiles.has(entry.file)) errors.push(`entries (${entry.id}) の file ${entry.file} は package.json exports にありません`)
  }
  return errors
}

/**
 * dist のエントリから**静的 import / re-export だけ**を辿り、そのエントリを import したとき
 * 必ず読み込まれる JS ファイルの集合（エントリ自身を含む・絶対パス）を返す。
 * 動的 import() は遅延読み込みなので含めない。相対 specifier（./ ../）だけ辿り、bare な
 * specifier（react / radix-ui 等）は外部依存として無視する。
 */
export async function collectStaticGraph(entryFile) {
  await init
  const root = resolve(entryFile)
  const files = []
  const queue = [root]
  const seen = new Set()
  while (queue.length) {
    const file = queue.shift()
    if (seen.has(file)) continue
    seen.add(file)
    if (!existsSync(file)) throw new Error(`${file} がありません`)
    files.push(file)
    const source = readFileSync(file, "utf8")
    const [imports] = parse(source)
    for (const imp of imports) {
      if (imp.t === ImportType.Dynamic || imp.n === undefined) continue
      if (!imp.n.startsWith(".")) continue
      queue.push(resolve(dirname(file), imp.n))
    }
  }
  return files
}

/** 各ファイルを個別に圧縮した合計（ネットワークで実際に流れる量に近い）を返す。 */
export function measureFiles(sources) {
  let raw = 0
  let gzip = 0
  let brotli = 0
  for (const source of sources) {
    raw += Buffer.byteLength(source)
    gzip += gzipBytes(source)
    brotli += brotliBytes(source)
  }
  return { raw, gzip, brotli }
}

/** 予算 JSON を読む（無ければ undefined）。 */
export function loadBudget(root) {
  const path = join(root, BUDGET_PATH)
  if (!existsSync(path)) return undefined
  return JSON.parse(readFileSync(path, "utf8"))
}

/** tree-shaking ケースのバンドル入口（ESM）を組み立てる。使った名前は console.log に渡して残させる。 */
export function buildCaseEntrySource(imports) {
  const lines = []
  const used = []
  imports.forEach((imp, index) => {
    const locals = imp.names.map((name, i) => `${name} as __ksk_${index}_${i}`)
    lines.push(`import { ${locals.join(", ")} } from ${JSON.stringify(imp.from)}`)
    imp.names.forEach((_, i) => used.push(`__ksk_${index}_${i}`))
  })
  lines.push(`console.log(${used.join(", ")})`)
  return lines.join("\n")
}

/**
 * package.json の `sideEffects` を、あるファイル（パッケージ root からの相対パス）に当てはめた結果。
 * バンドラの規約どおり、false=副作用なし / true・未指定=あり / 配列=一致するファイルだけ副作用あり。
 * パターンは `*.css` のような「スラッシュなし＝ファイル名に一致」と、`./dist/*.js` のような
 * 「パス付き」を扱う（`*` は `/` を除く任意文字列、`**` は `/` を含む任意文字列）。
 */
export function moduleSideEffectsFor(sideEffects, relativeFile) {
  if (sideEffects === false) return false
  if (!Array.isArray(sideEffects)) return true
  const file = relativeFile.replace(/^\.\//, "")
  const base = file.split("/").pop()
  return sideEffects.some((raw) => {
    const pattern = String(raw).replace(/^\.\//, "")
    const target = pattern.includes("/") ? file : base
    const source = pattern
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*\*/g, "\0")
      .replace(/\*/g, "[^/]*")
      .replace(/\0/g, ".*")
    return new RegExp(`^${source}$`).test(target)
  })
}
