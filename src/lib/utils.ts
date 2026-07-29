import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * src/styles/typography.css の `@utility typo-*` のうち、
 * font-size/line-height/font-weight（+letter-spacing）を定義する「プリセット系」クラス名。
 *
 * デフォルトの twMerge は `typo-*` を認識しないため、`cn("typo-label-sm", "typo-label-md")`
 * のような上書きが「どちらも残す」扱いになり、CSS 宣言順（後発クラスが後勝ち）に
 * マージ結果が左右されてしまう（意図した方が負けることがある）。
 * ここではプリセット系 typo-* を単一の classGroup として登録し、同グループ内は
 * 後勝ち（最後に渡したクラスのみ残る）で確実にマージされるようにする。
 *
 * `typo-on-image`（text-shadow のみを付与する加算系ユーティリティ）はここに含めない。
 * サイズ/行間/ウェイトを定義しないため排他マージの対象外で、`typo-label-sm typo-on-image`
 * のようにプリセット系と併用される（PhotoHero 等）。単一 classGroup に含めると
 * 併用時に一方が誤って消される。
 *
 * 注意: typography.css に `@utility typo-*` を追加/削除したら、この配列も
 * 同期して更新すること。__tests__/cn-typo-merge.test.ts がドリフトを検知する
 * （typography.css を正規表現でパースし、font-size を持つプリセット系だけを抽出して
 * この配列と突合し、不一致なら fail）。
 */
export const TYPO_PRESET_CLASS_NAMES = [
  "typo-heading-3xl",
  "typo-heading-2xl",
  "typo-heading-xl",
  "typo-heading-lg",
  "typo-heading-md",
  "typo-heading-sm",
  "typo-body-lg",
  "typo-body-md",
  "typo-body-sm",
  "typo-body-xs",
  "typo-label-lg",
  "typo-label-md",
  "typo-label-sm",
  "typo-label-xs",
  "typo-display-xl",
  "typo-display-lg",
  "typo-caption",
] as const

/**
 * サイズ/行間/ウェイトを持たない「加算系」typo-* クラス名（排他 classGroup の対象外）。
 * 併用ケースのテスト・ドリフト検査で TYPO_PRESET_CLASS_NAMES と区別するために保持する。
 */
export const TYPO_ADDITIVE_CLASS_NAMES = ["typo-on-image"] as const

const customTwMerge = extendTailwindMerge<"ksk-typography">({
  extend: {
    classGroups: {
      "ksk-typography": TYPO_PRESET_CLASS_NAMES,
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
