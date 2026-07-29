import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * src/styles/typography.css の `@utility typo-*` 全クラス名。
 *
 * デフォルトの twMerge は `typo-*` を認識しないため、`cn("typo-label-sm", "typo-label-md")`
 * のような上書きが「どちらも残す」扱いになり、CSS 宣言順（後発クラスが後勝ち）に
 * マージ結果が左右されてしまう（意図した方が負けることがある）。
 * ここでは typo-* 全クラスを単一の classGroup として登録し、同グループ内は
 * 後勝ち（最後に渡したクラスのみ残る）で確実にマージされるようにする。
 *
 * 注意: typography.css に `@utility typo-*` を追加/削除したら、この配列も
 * 同期して更新すること。__tests__/cn-typo-merge.test.ts がドリフトを検知する
 * （typography.css を正規表現でパースしてこの配列と突合し、不一致なら fail）。
 */
export const TYPO_CLASS_NAMES = [
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
  "typo-on-image",
] as const

const customTwMerge = extendTailwindMerge<"ksk-typography">({
  extend: {
    classGroups: {
      "ksk-typography": TYPO_CLASS_NAMES,
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
