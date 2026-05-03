import * as React from "react"
import { cn } from "@/lib/utils"

export interface StickyActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 上部ボーダーを表示する（デフォルト: true）
   */
  bordered?: boolean
}

/**
 * BottomAction — モバイル下部操作バー
 *
 * 画面下部に sticky で固定される CTA エリア。iOS の safe-area-inset-bottom に対応。
 * カートに追加・購入するなどの主要アクションボタンを配置する。
 *
 * ### 使用例
 * ```tsx
 * <BottomAction>
 *   <Button className="w-full" size="xl">カートに追加</Button>
 * </BottomAction>
 * ```
 *
 * ### AI 向け使用ルール
 * - 商品詳細・確認画面など、画面内の最重要CTAに使用
 * - SheetContent 内では sticky ではなく absolute 配置になるため注意
 * - 子要素には Button w-full を推奨
 */
function StickyActionBar({
  className,
  bordered = true,
  children,
  ...props
}: StickyActionBarProps) {
  return (
    <div
      data-slot="sticky-action-bar"
      className={cn(
        "sticky bottom-0 z-40 bg-[var(--Surface-Primary)] px-4 py-3",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        bordered && "border-t border-[var(--Border-Low-Emphasis)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { StickyActionBar }
