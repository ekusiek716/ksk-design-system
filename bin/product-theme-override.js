/**
 * P049 — product theme の許可リスト外の DS 変数上書きを検出する（issue #364）
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
 *   3. `dsVariableNamespaces` のどれかで始まり、`allowedVariables` に無いものを違反とする
 *
 * `var(--Foo)` の**参照**は対象外（読むのは自由）。宣言だけを見る。
 */

/** CSS コメントを、行数を保ったまま空白に置き換える */
function stripCssComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "))
}

/**
 * @param {string} source CSS ソース
 * @param {{ allowed: Set<string>, namespaces: string[] }} contract
 * @returns {Array<{ line: number, name: string }>}
 */
export function inspectProductThemeOverrides(source, contract) {
  const stripped = stripCssComments(source)
  const findings = []
  // 宣言のみを拾う。`var(--Foo, …)` の参照はコロンの前に `(` が来るため一致しない。
  const DECLARATION = /(^|[;{}\s])(--[A-Za-z0-9_-]+)\s*:/g

  for (const match of stripped.matchAll(DECLARATION)) {
    const name = match[2]
    if (contract.allowed.has(name)) continue
    if (!contract.namespaces.some((prefix) => name.startsWith(prefix))) continue
    findings.push({
      line: stripped.slice(0, match.index).split(/\r?\n/).length,
      name,
    })
  }
  return findings
}

/** 契約 JSON から判定に使う形へ畳む */
export function loadProductThemeContract(contract) {
  return {
    allowed: new Set(Object.values(contract.allowedVariables ?? {}).flat()),
    namespaces: Array.isArray(contract.dsVariableNamespaces) ? contract.dsVariableNamespaces : [],
  }
}
