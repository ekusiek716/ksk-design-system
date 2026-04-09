import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/** 価格表示バリアント定義 */
const priceVariants = cva("inline-flex items-baseline gap-0.5 text-[var(--Text-High-Emphasis)]", {
  variants: {
    size: {
      sm: "typo-label-md",
      md: "typo-label-lg",
      lg: "typo-heading-lg",
      xl: "typo-heading-3xl",
    },
  },
  defaultVariants: { size: "md" },
})

interface PriceDisplayProps extends React.ComponentProps<"div">, VariantProps<typeof priceVariants> {
  /** 表示価格 */
  price: number
  /** 価格範囲の最大値（範囲表示用） */
  maxPrice?: number
  /** 元の価格（セール時の打ち消し線表示用） */
  originalPrice?: number
  /** 税込ラベルを表示するか */
  showTaxLabel?: boolean
  /** 通貨記号 */
  currency?: string
}

/** サイズごとの打ち消し線テキストサイズ */
const strikeSize = { sm: "typo-body-xs", md: "typo-body-sm", lg: "typo-body-md", xl: "typo-body-lg" } as const

/** サイズごとの税込ラベルテキストサイズ */
const taxSize = { sm: "typo-body-xs", md: "typo-body-xs", lg: "typo-body-sm", xl: "typo-body-lg" } as const

function PriceDisplay({ className, price, maxPrice, originalPrice, showTaxLabel = true, currency = "¥", size = "md", ...props }: PriceDisplayProps) {
  /** 数値を日本語ロケールでフォーマット */
  const fmt = (n: number) => n.toLocaleString("ja-JP")
  /** セール価格かどうか */
  const isSale = originalPrice != null && originalPrice > price
  /** 価格範囲表示かどうか */
  const isRange = maxPrice != null && maxPrice > price
  const s = size ?? "md"

  return (
    <div data-slot="price-display" className={cn("flex flex-col", className)} role="group" aria-label={`${currency}${fmt(price)} 税込`} {...props}>
      {/* セール時の元価格（打ち消し線） */}
      {isSale && (
        <span aria-hidden className={cn("text-[var(--Text-Low-Emphasis)] line-through", strikeSize[s])}>
          {currency}{fmt(originalPrice)}
        </span>
      )}
      {/* メイン価格表示 */}
      <span aria-hidden className={cn(priceVariants({ size }), isSale && "text-[var(--Text-Caution)]")}>
        {isRange ? <>{currency}{fmt(price)}〜{currency}{fmt(maxPrice)}</> : <>{currency}{fmt(price)}</>}
        {showTaxLabel && <span className={cn("ml-0.5 text-[var(--Text-Low-Emphasis)]", taxSize[s])}>税込</span>}
      </span>
    </div>
  )
}

export { PriceDisplay, priceVariants }
