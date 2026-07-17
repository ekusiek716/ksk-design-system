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

/**
 * `var(--Primitive-X-Y)` / 生 #hex を primitive パレット（tokens.json の
 * colors.primitive）を使って hex に解決する。
 *
 * @param {string} val 解決対象の値
 * @param {Record<string, string | Record<string, string>>} primitive tokens.json の colors.primitive
 * @returns {string | null} 解決できた hex、できなければ null（rgba/color-mix/未知の var 等）
 */
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

export function resolveTokenColor(val, primitive) {
  if (!val) return null
  if (val.startsWith("#")) return val
  const m = val.match(/^var\(--Primitive-([A-Za-z]+)(?:-(\d+))?\)$/)
  if (!m) return null // rgba / color-mix / White-Alpha-* 等は対象外
  // brand は primitive ではなく alias レイヤー。default テーマでは Blue を指すため
  // --Primitive-Brand-* は Blue ランプに解決する。
  const fam = primitive[m[1].toLowerCase()] ?? (m[1].toLowerCase() === "brand" ? primitive.blue : null)
  if (fam == null) return null
  return typeof fam === "string" ? fam : (m[2] ? fam[m[2]] : null)
}
