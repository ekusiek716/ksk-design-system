import * as React from "react"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
  /** 左端スロット（戻るボタン、ハンバーガー等） */
  leading?: React.ReactNode
  /** 中央タイトル */
  title?: React.ReactNode
  /** サブタイトル（タイトルの下に表示） */
  subtitle?: React.ReactNode
  /** 右端スロット（アクションボタン群） */
  trailing?: React.ReactNode
  /** 固定ヘッダー（スクロールに追従しない） */
  sticky?: boolean
  /** 下線ボーダー */
  bordered?: boolean
  /**
   * 外観バリアント:
   * - "default"     : 通常（Surface-Primary 背景 + ボーダー）
   * - "glass"       : Liquid Glass（コンテンツに重ねる半透明）
   * - "transparent" : 完全透明（スクロール連動で背景を切り替えるときの初期状態）
   */
  variant?: "default" | "glass" | "transparent"
  className?: string
}

function AppHeader({
  leading,
  title,
  subtitle,
  trailing,
  sticky = false,
  bordered = true,
  variant = "default",
  className,
}: AppHeaderProps) {
  const isGlass = variant === "glass"
  const isTransparent = variant === "transparent"

  return (
    <header
      data-slot="app-header"
      data-variant={variant}
      className={cn(
        "flex items-center gap-2 h-14 px-4",
        // 背景
        isGlass && "glass",
        !isGlass && !isTransparent && "bg-[var(--Surface-Primary)]",
        // ボーダー
        bordered && !isGlass && !isTransparent && "border-b border-[var(--Border-Low-Emphasis)]",
        bordered && isGlass && "border-b border-[rgba(255,255,255,0.25)]",
        // Sticky
        sticky && "sticky top-0 z-40",
        className
      )}
    >
      {/* Leading */}
      {leading && (
        <div className="flex items-center shrink-0">{leading}</div>
      )}

      {/* Title (flex-1 で leading/trailing の幅を確保しつつ中央寄り) */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        {title && (
          typeof title === "string"
            ? <span className="typo-heading-sm text-[var(--Text-High-Emphasis)] truncate">{title}</span>
            : title
        )}
        {subtitle && (
          typeof subtitle === "string"
            ? <span className="typo-body-xs text-[var(--Text-Medium-Emphasis)] truncate">{subtitle}</span>
            : subtitle
        )}
      </div>

      {/* Trailing */}
      {trailing && (
        <div className="flex items-center gap-1 shrink-0">{trailing}</div>
      )}
    </header>
  )
}

export { AppHeader }
export type { AppHeaderProps }
