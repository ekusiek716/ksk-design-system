// =============================================================
// KSK Design System — トークン色解決の共有ロジック
//
// tokens.json の semantic / semanticDark に現れる値
// （`var(--Primitive-X-Y)` / 生 #hex）を実 hex に解決する。
// rgba(...) / color-mix(...) / 未知の var(...) は解決対象外（null を返す）。
//
// scripts/check-contrast.mjs と scripts/generate-token-hex-cache.mjs の
// 両方から使う単一の実装（ロジックの二重管理を避ける）。
// =============================================================
import { readFileSync } from "node:fs"
import { join } from "node:path"

/**
 * CSS テキストから `--Primitive-Brand-<shade>: #hex` を抽出してランプにする
 * （scripts/generate-platform-tokens.mjs の parseBrandRamp と同じ正本の読み方）。
 *
 * @param {string} cssText CSS ファイルの中身
 * @returns {Record<string, string>} shade → hex（例: { "500": "#3B82F6" }）
 */
export function parseBrandRamp(cssText) {
  const ramp = {}
  const re = /--Primitive-Brand-(\d+):\s*(#[0-9A-Fa-f]+)/g
  let m
  while ((m = re.exec(cssText))) ramp[m[1]] = m[2]
  return ramp
}

/**
 * デフォルトテーマの Brand ランプを正本（src/styles/primitive.css）から読む。
 * tokens.json の Blue パレットへのフォールバックではなく、こちらを使うことで
 * primitive.css の Brand 値が Blue と独立に変わってもキャッシュに反映される。
 *
 * @param {string} rootDir リポジトリルートの絶対パス
 * @returns {Record<string, string>} shade → hex
 */
export function loadDefaultBrandRamp(rootDir) {
  const css = readFileSync(join(rootDir, "src", "styles", "primitive.css"), "utf8")
  const ramp = parseBrandRamp(css)
  if (Object.keys(ramp).length === 0) {
    throw new Error("src/styles/primitive.css から --Primitive-Brand-* が見つかりません")
  }
  return ramp
}

/**
 * 値が `var(--Primitive-Brand-*)` を参照しているか（＝テーマ差し替えで実色が変わるか）。
 * デフォルト（Blue）テーマ以外では resolveTokenColor の返す hex と実際の表示色が異なる。
 *
 * @param {string} val 判定対象の値
 * @returns {boolean}
 */
export function isBrandDependent(val) {
  return typeof val === "string" && /var\(--Primitive-Brand-/.test(val)
}

/**
 * `var(--Primitive-X-Y)` / 生 #hex を primitive パレット（tokens.json の
 * colors.primitive）を使って hex に解決する。
 *
 * @param {string} val 解決対象の値
 * @param {Record<string, string | Record<string, string>>} primitive tokens.json の colors.primitive
 * @param {Record<string, string>} [brandRamp] デフォルトテーマの Brand ランプ（shade → hex。
 *   正本 src/styles/primitive.css から loadDefaultBrandRamp で取得）。省略時は tokens.json の
 *   Blue ランプにフォールバックする（後方互換）。
 * @returns {string | null} 解決できた hex、できなければ null（rgba/color-mix/未知の var 等）
 */
export function resolveTokenColor(val, primitive, brandRamp) {
  if (!val) return null
  if (val.startsWith("#")) return val
  const m = val.match(/^var\(--Primitive-([A-Za-z]+)(?:-(\d+))?\)$/)
  if (!m) return null // rgba / color-mix / White-Alpha-* 等は対象外
  // brand は primitive ではなく alias レイヤー。デフォルトテーマの正本は
  // src/styles/primitive.css の --Primitive-Brand-*（brandRamp 経由で解決）。
  // brandRamp 未指定時のみ tokens.json の Blue ランプへフォールバックする。
  const fam =
    primitive[m[1].toLowerCase()] ??
    (m[1].toLowerCase() === "brand" ? (brandRamp ?? primitive.blue) : null)
  if (fam == null) return null
  return typeof fam === "string" ? fam : (m[2] ? fam[m[2]] : null)
}
