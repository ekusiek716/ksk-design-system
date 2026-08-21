/**
 * カテゴリ識別色（`--Categorical-1..16`）の consumer 向け公開ヘルパー。
 *
 * `Tag` の `categorical` prop 以外の場所（ボード列の背景・カレンダーのドット等）で
 * カテゴリ識別色を使うとき、consumer が色クラス一覧を自前で複製せずに済むように
 * 公開する（issue #452）。`Tag` もこのファイルのマップを正本として参照する
 * （二重管理を避けるため）。
 *
 * Tailwind の静的抽出のため、`` `bg-[var(--Categorical-${n}-Subtle)]` `` のような
 * 動的合成は使わず 16 件すべてを完全な文字列で持つ（CLAUDE.md の
 * 「クラス名は完全な文字列で書く」ルール）。source-safelist は対応済み。
 */

/** カテゴリ識別色のインデックス（1..16）。`--Categorical-{n}` に対応する。 */
export type CategoricalIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16

/**
 * `bg-[var(--Categorical-N-Subtle)] text-[var(--Categorical-N-Bold)]` のクラスマップ。
 *
 * 文字色は必ず `-Bold`。base は明色相だと白背景でコントラストが足りない
 * （`src/styles/categorical.css` の注記）。
 */
export const CATEGORICAL_SURFACE_CLASS = {
  1: "bg-[var(--Categorical-1-Subtle)] text-[var(--Categorical-1-Bold)]",
  2: "bg-[var(--Categorical-2-Subtle)] text-[var(--Categorical-2-Bold)]",
  3: "bg-[var(--Categorical-3-Subtle)] text-[var(--Categorical-3-Bold)]",
  4: "bg-[var(--Categorical-4-Subtle)] text-[var(--Categorical-4-Bold)]",
  5: "bg-[var(--Categorical-5-Subtle)] text-[var(--Categorical-5-Bold)]",
  6: "bg-[var(--Categorical-6-Subtle)] text-[var(--Categorical-6-Bold)]",
  7: "bg-[var(--Categorical-7-Subtle)] text-[var(--Categorical-7-Bold)]",
  8: "bg-[var(--Categorical-8-Subtle)] text-[var(--Categorical-8-Bold)]",
  9: "bg-[var(--Categorical-9-Subtle)] text-[var(--Categorical-9-Bold)]",
  10: "bg-[var(--Categorical-10-Subtle)] text-[var(--Categorical-10-Bold)]",
  11: "bg-[var(--Categorical-11-Subtle)] text-[var(--Categorical-11-Bold)]",
  12: "bg-[var(--Categorical-12-Subtle)] text-[var(--Categorical-12-Bold)]",
  13: "bg-[var(--Categorical-13-Subtle)] text-[var(--Categorical-13-Bold)]",
  14: "bg-[var(--Categorical-14-Subtle)] text-[var(--Categorical-14-Bold)]",
  15: "bg-[var(--Categorical-15-Subtle)] text-[var(--Categorical-15-Bold)]",
  16: "bg-[var(--Categorical-16-Subtle)] text-[var(--Categorical-16-Bold)]",
} as const satisfies Record<CategoricalIndex, string>

/** `bg-[var(--Categorical-N)]`（base 塗り。ドット等）のクラスマップ。 */
export const CATEGORICAL_DOT_CLASS = {
  1: "bg-[var(--Categorical-1)]",
  2: "bg-[var(--Categorical-2)]",
  3: "bg-[var(--Categorical-3)]",
  4: "bg-[var(--Categorical-4)]",
  5: "bg-[var(--Categorical-5)]",
  6: "bg-[var(--Categorical-6)]",
  7: "bg-[var(--Categorical-7)]",
  8: "bg-[var(--Categorical-8)]",
  9: "bg-[var(--Categorical-9)]",
  10: "bg-[var(--Categorical-10)]",
  11: "bg-[var(--Categorical-11)]",
  12: "bg-[var(--Categorical-12)]",
  13: "bg-[var(--Categorical-13)]",
  14: "bg-[var(--Categorical-14)]",
  15: "bg-[var(--Categorical-15)]",
  16: "bg-[var(--Categorical-16)]",
} as const satisfies Record<CategoricalIndex, string>

/**
 * カテゴリ識別色 N の Tailwind クラスを返す。
 *
 * `Tag` 以外の場所（ボード列の背景・カレンダーのドット等）でカテゴリ識別色を
 * 使うときに使う。既定は `"surface"`（Subtle 背景 + Bold 文字）、`"dot"` は
 * base 塗りの単色クラス（ドット・アイコン用）。
 *
 * @example
 * // belle-todo: カンバンボードの列見出し背景
 * <div className={categoricalSurfaceClass(category.colorIndex)}>{category.name}</div>
 *
 * @example
 * // belle-todo: カレンダーの予定ドット
 * <span className={cn("size-2 rounded-full", categoricalSurfaceClass(colorIndex, "dot"))} />
 */
export function categoricalSurfaceClass(
  n: CategoricalIndex,
  kind: "surface" | "dot" = "surface"
): string {
  return kind === "dot" ? CATEGORICAL_DOT_CLASS[n] : CATEGORICAL_SURFACE_CLASS[n]
}

/**
 * カテゴリ識別色 N の CSS 変数参照（`var(--Categorical-N...)`）を返す。
 *
 * Tailwind クラスでは表現できない箇所（インライン style・SVG の `fill` 等）で
 * 生の変数名を組み立てる代わりに使う。
 *
 * @example
 * // belle-todo: SVG グラフの系列色
 * <circle fill={categoricalVar(seriesIndex, "bold")} />
 */
export function categoricalVar(n: CategoricalIndex, tone: "base" | "subtle" | "bold" = "base"): string {
  if (tone === "subtle") return `var(--Categorical-${n}-Subtle)`
  if (tone === "bold") return `var(--Categorical-${n}-Bold)`
  return `var(--Categorical-${n})`
}
