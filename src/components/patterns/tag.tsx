import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { CATEGORICAL_DOT_CLASS, CATEGORICAL_SURFACE_CLASS, type CategoricalIndex } from "../../lib/categorical"

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
 * 正本は `@/lib/categorical`（issue #452 で consumer 向けに公開）。
 * Tag はそこから import して参照するだけで、ここでは二重管理しない。
 */

/** カテゴリ識別色のインデックス（1..16）。`--Categorical-{n}` に対応する。 */
type TagCategorical = CategoricalIndex

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
        categorical && CATEGORICAL_SURFACE_CLASS[categorical],
        categorical && dot && "gap-1",
        className
      )}
      {...props}
    >
      {categorical && dot && (
        <span
          aria-hidden="true"
          className={cn("inline-block size-2 shrink-0 rounded-full", CATEGORICAL_DOT_CLASS[categorical])}
        />
      )}
      {children}
    </span>
  )
}

export { Tag, tagVariants }
export type { TagProps, TagCategorical }
