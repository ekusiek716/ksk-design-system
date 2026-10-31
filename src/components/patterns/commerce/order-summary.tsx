import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "../../ui/button"
import { useKskLabels } from "../../ui/ksk-labels"

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
  /** 合計ラベル。省略時は KskLabelsProvider の `orderSummaryTotal`（Provider 無しは "合計（税込）"。locale="en" で "Total (incl. tax)"） */
  totalLabel?: string
  /** 合計金額の表示文字列 */
  totalValue: string
  /** CTAボタンのラベル */
  ctaLabel: string
  /** CTAボタンクリック時のコールバック */
  onCTAClick?: () => void
  /** CTAボタンの無効状態 */
  ctaDisabled?: boolean
  /**
   * 画面下部に固定表示するか。
   * true のときは中身の下余白が `max(0.75rem, env(safe-area-inset-bottom))` になり、
   * iOS のホームインジケータを避ける（StickyActionBar と同じ。#832）。
   * className で下余白を足していると safe-area と二重になるので外すこと。
   */
  fixed?: boolean
}

function OrderSummary({ className, lineItems, totalLabel: totalLabelProp, totalValue, ctaLabel, onCTAClick, ctaDisabled = false, fixed = false, ...props }: OrderSummaryProps) {
  const defaultLabels = useKskLabels()
  const totalLabel = totalLabelProp ?? defaultLabels.orderSummaryTotal
  const content = (
    // fixed のときは下端に貼り付くので、注文ボタンが iPhone のホームインジケータに
    // 重ならないよう下余白を StickyActionBar と同じ max(0.75rem, safe-area) にする（#832）。
    // inline は従来どおり py-3。
    <div className={fixed ? "space-y-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]" : "space-y-3 px-4 py-3"}>
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
      <Button size="xl" className="w-full" onClick={onCTAClick} disabled={ctaDisabled}>
        {ctaLabel}
      </Button>
    </div>
  )

  return (
    <div data-slot="order-summary" className={cn("border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]", fixed && "fixed inset-x-0 bottom-0 z-[var(--Z-Sticky)] mx-auto max-w-lg", className)} {...props}>
      {content}
    </div>
  )
}

export { OrderSummary }
