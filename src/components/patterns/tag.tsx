import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 typo-label-xs whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]",
        brand: "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]",
        caution: "bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]",
        success: "bg-[var(--Surface-Success)] text-[var(--Text-Success)]",
        warning: "bg-[var(--Surface-Warning)] text-[var(--Text-Warning)]",
        info: "bg-[var(--Surface-Info)] text-[var(--Text-Info)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * カテゴリ識別色（`--Categorical-1..16`）のクラスマップ。
 *
 * Tailwind の静的抽出のため、`` `bg-[var(--Categorical-${n}-Subtle)]` `` のような
 * 動的合成は使わず 16 件すべてを完全な文字列で持つ（CLAUDE.md の
 * 「クラス名は完全な文字列で書く」ルール）。
 *
 * 文字色は必ず `-Bold`。base は明色相だと白背景でコントラストが足りない
 * （`src/styles/categorical.css` の注記）。
 */
const CATEGORICAL_SURFACE = {
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
} as const

const CATEGORICAL_DOT = {
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
} as const

/** カテゴリ識別色のインデックス（1..16）。`--Categorical-{n}` に対応する。 */
type TagCategorical = keyof typeof CATEGORICAL_SURFACE

interface TagProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof tagVariants> {
  /**
   * カテゴリ識別色（1..16）。指定すると `variant` の配色より優先され、
   * `--Categorical-{n}-Subtle` 背景 + `--Categorical-{n}-Bold` 文字になる。
   *
   * Brand に連動しないテーマ非依存の質的パレットなので、
   * 「N 番目のカテゴリ」を色で区別する用途にだけ使う。
   * ステータス（成功・警告）は `variant` を使うこと。
   */
  categorical?: TagCategorical
  /**
   * `categorical` 指定時に、ラベル左へ `--Categorical-{n}`（base）のドットを出す。
   * 色だけに頼らずカテゴリの区別を補助する。`categorical` 無指定では無視される。
   */
  dot?: boolean
}

function Tag({
  className,
  variant,
  categorical,
  dot = false,
  children,
  ...props
}: TagProps) {
  return (
    <span
      data-slot="tag"
      data-categorical={categorical}
      className={cn(
        tagVariants({ variant }),
        categorical && CATEGORICAL_SURFACE[categorical],
        categorical && dot && "gap-1",
        className
      )}
      {...props}
    >
      {categorical && dot && (
        <span
          aria-hidden="true"
          className={cn("inline-block size-2 shrink-0 rounded-full", CATEGORICAL_DOT[categorical])}
        />
      )}
      {children}
    </span>
  )
}

export { Tag, tagVariants }
export type { TagProps, TagCategorical }
