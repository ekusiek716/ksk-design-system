import * as React from "react"
import { cn } from "@/lib/utils"

/** 注文サマリーの明細行 */
interface OrderSummaryLineItem {
  /** ラベル（例: 小計、送料） */
  label: string
  /** 値（文字列またはReactノード） */
  value: React.ReactNode
}

interface OrderSummaryProps extends React.ComponentProps<"div"> {
  /** 明細行の配列 */
  lineItems?: OrderSummaryLineItem[]
  /** 合計ラベル */
  totalLabel?: string
  /** 合計金額の表示文字列 */
  totalValue: string
  /** CTAボタンのラベル */
  ctaLabel: string
  /** CTAボタンクリック時のコールバック */
  onCTAClick?: () => void
  /** CTAボタンの無効状態 */
  ctaDisabled?: boolean
  /** 画面下部に固定表示するか */
  fixed?: boolean
}

function OrderSummary({ className, lineItems, totalLabel = "合計（税込）", totalValue, ctaLabel, onCTAClick, ctaDisabled = false, fixed = false, ...props }: OrderSummaryProps) {
  const content = (
    <div className="space-y-3 px-4 py-3">
      {/* 明細行 */}
      {lineItems?.map((item) => (
        <div key={item.label} className="flex items-center justify-between typo-body-md">
          <span className="text-[var(--Text-Medium-Emphasis)]">{item.label}</span>
          <span className="text-[var(--Text-High-Emphasis)]">{item.value}</span>
        </div>
      ))}
      {/* 明細行と合計の区切り線 */}
      {lineItems && lineItems.length > 0 && <hr className="border-[var(--Border-Low-Emphasis)]" />}
      {/* 合計金額 */}
      <div className="flex items-center justify-between">
        <span className="typo-heading-md text-[var(--Text-High-Emphasis)]">{totalLabel}</span>
        <span className="typo-heading-lg text-[var(--Text-High-Emphasis)]">{totalValue}</span>
      </div>
      {/* CTAボタン */}
      <button data-slot="button" type="button" className={cn("flex h-14 w-full items-center justify-center rounded-full bg-[var(--Brand-Primary)] typo-label-lg text-[var(--Text-on-Inverse)] transition-colors hover:bg-[var(--Hover-Primary-Button)] cursor-pointer", ctaDisabled && "opacity-50 cursor-not-allowed")} onClick={onCTAClick} disabled={ctaDisabled}>
        {ctaLabel}
      </button>
    </div>
  )

  return (
    <div data-slot="order-summary" className={cn("border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]", fixed && "fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg", className)} {...props}>
      {content}
    </div>
  )
}

export { OrderSummary }
