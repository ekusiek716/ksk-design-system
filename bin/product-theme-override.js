/**
 * P049 — product theme の許可リスト外の DS 変数上書きを検出する（issue #364 / #377）
 *
 * 消費プロダクトの CSS が `:root { --Surface-Primary: … }` のように DS の
 * CSS 変数を上書きするのは、契約 `contracts/product-theme-overrides.json` の
 * `allowedVariables` に載っているものだけ。載っていない変数（`--Hover-*` /
 * `--Z-*` / `--glass-*` などの内部実装）を上書きすると、DS を上げた瞬間に
 * 静かに壊れる。lint で見えるようにする。
 *
 * 判定:
 *   1. CSS のコメントを落とす
 *   2. カスタムプロパティ宣言（`--Foo: value;`）を行番号付きで拾う
 *   3. `dsVariableNamespaces` のどれかで始まり、`allowedVariables` に無く、
 *      かつ **DS 自身の CSS に実在する** ものを違反とする
 *
 * 3 の「実在する」条件は issue #377。接頭辞一致だけだと、消費側が DS の命名に
 * 寄せて作った独自変数（`--Surface-Inverse-Hover` のように DS には無い名前）まで
 * 「DS の上書き」と誤検出する。DS に存在しない変数は上書きしようがない。
 * DS の CSS を読めない環境（パッケージ構成が変わった等）では従来どおり
 * 接頭辞一致だけで判定してフォールバックする。
 */
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join, resolve } from "node:path"

/** カスタムプロパティの**宣言**。`var(--Foo, …)` の参照はコロンの前が `(` なので一致しない。 */
const DECLARATION = /(^|[;{}\s])(--[A-Za-z0-9_-]+)\s*:/g

/**
 * DS 自身の CSS 変数を宣言しているファイル群（npm package の `files` にも含まれる）。
 * 生成ファイルを増やさずに実行時へ集めるので、DS 側の CSS を足してもドリフトしない。
 */
const DS_CSS_DIRS = ["src/styles", "src/themes"]
const DS_CSS_FILES = ["src/preset.css"]

/** CSS コメントを、行数を保ったまま空白に置き換える */
function stripCssComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "))
}

/**
 * DS が実際に宣言している CSS 変数名を集める。
 * 読めない場合は null を返し、呼び出し側は接頭辞一致だけの判定へフォールバックする。
 *
 * @param {string} pkgRoot ksk-design-system パッケージのルート
 * @returns {Set<string> | null}
 */
export function collectDsDeclaredVariables(pkgRoot) {
  if (!pkgRoot) return null
  const files = []
  for (const dir of DS_CSS_DIRS) {
    const abs = resolve(pkgRoot, dir)
    if (!existsSync(abs)) continue
    try {
      for (const name of readdirSync(abs)) {
        if (name.endsWith(".css")) files.push(join(abs, name))
      }
    } catch {
      // 読めないディレクトリは黙って飛ばす（他のファイルで足りることがある）
    }
  }
  for (const file of DS_CSS_FILES) {
    const abs = resolve(pkgRoot, file)
    if (existsSync(abs)) files.push(abs)
  }
  if (files.length === 0) return null

  const names = new Set()
  for (const file of files) {
    let source
    try {
      source = readFileSync(file, "utf8")
    } catch {
      continue
    }
    for (const match of stripCssComments(source).matchAll(DECLARATION)) names.add(match[2])
  }
  return names.size > 0 ? names : null
}

/**
 * @param {string} source CSS ソース
 * @param {{ allowed: Set<string>, namespaces: string[], declared?: Set<string> | null }} contract
 * @returns {Array<{ line: number, name: string }>}
 */
export function inspectProductThemeOverrides(source, contract) {
  const stripped = stripCssComments(source)
  const findings = []
  const declared = contract.declared ?? null

  for (const match of stripped.matchAll(DECLARATION)) {
    const name = match[2]
    if (contract.allowed.has(name)) continue
    if (!contract.namespaces.some((prefix) => name.startsWith(prefix))) continue
    // DS に実在しない名前は「DS の上書き」ではない（issue #377）。
    // 一覧が取れなかったときは従来どおり接頭辞一致だけで判定する。
    if (declared && !declared.has(name)) continue
    findings.push({
      line: stripped.slice(0, match.index).split(/\r?\n/).length,
      name,
    })
  }
  return findings
}

/**
 * P050 — DS を参照しない並行パレットの検出（issue #393）
 *
 * P049 は「DS の名前空間に触れている CSS」しか見ないため、DS 名前空間を
 * 一切使わない独自パレット（`--bg` / `--accent` / `--surface` 等）を持つ
 * consumer には無言だった。`:root` / `.dark` / `[data-theme=...]` のような
 * ルート的セレクタの中で、DS 名前空間に属さないカスタムプロパティへ
 * 色値（hex / rgb / hsl / oklch）を敷いている数を数え、閾値以上なら
 * 「並行パレットの疑い」として warn する。
 *
 * 値が `var(--Primitive-...)` のように DS トークンを参照しているだけの
 * ものはカウントしない（それは並行パレットではなく DS への委譲）。
 */

/** ルート的セレクタ（ここで宣言された変数だけがテーマの「パレット」候補） */
const ROOT_LIKE_BLOCK =
  /(?:^|[};])\s*(:root|\.dark|\[data-theme(?:=[^\]]*)?\])\s*\{([^{}]*)\}/g

/** ブロック内のカスタムプロパティ宣言（値も一緒に取る） */
const DECLARATION_WITH_VALUE = /(^|[;{}\s])(--[A-Za-z0-9_-]+)\s*:\s*([^;]+);/g

/** 色値を含む値（hex / rgb() / rgba() / hsl() / hsla() / oklch()） */
const COLOR_VALUE_RE = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/i

/** 値が `var(...)` の参照だけで完結しているか（DS トークンへの委譲はカウントしない） */
const VAR_ONLY_RE = /^var\(/i

/**
 * @param {string} source CSS ソース
 * @param {{ namespaces?: string[] }} options DS 名前空間の一覧
 * @returns {Array<{ line: number, name: string }>} DS 名前空間に属さず色値を持つ宣言
 */
export function inspectParallelPaletteCandidates(source, { namespaces = [] } = {}) {
  const stripped = stripCssComments(source)
  const candidates = []

  for (const block of stripped.matchAll(ROOT_LIKE_BLOCK)) {
    const body = block[2]
    const bodyStart = block.index + block[0].indexOf(body)
    for (const decl of body.matchAll(DECLARATION_WITH_VALUE)) {
      const name = decl[2]
      const value = decl[3].trim()
      if (namespaces.some((prefix) => name.startsWith(prefix))) continue
      if (VAR_ONLY_RE.test(value)) continue
      if (!COLOR_VALUE_RE.test(value)) continue
      const nameIndex = bodyStart + decl.index + decl[0].indexOf(name)
      candidates.push({
        line: stripped.slice(0, nameIndex).split(/\r?\n/).length,
        name,
      })
    }
  }
  return candidates
}

/**
 * 契約 JSON から判定に使う形へ畳む。
 *
 * @param {object} contract contracts/product-theme-overrides.json の中身
 * @param {{ pkgRoot?: string }} [options] pkgRoot を渡すと「DS に実在する変数」だけに絞る
 */
export function loadProductThemeContract(contract, { pkgRoot } = {}) {
  return {
    allowed: new Set(Object.values(contract.allowedVariables ?? {}).flat()),
    namespaces: Array.isArray(contract.dsVariableNamespaces) ? contract.dsVariableNamespaces : [],
    declared: collectDsDeclaredVariables(pkgRoot),
  }
}
