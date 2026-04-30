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
  className?: string
}

function AppHeader({
  leading,
  title,
  subtitle,
  trailing,
  sticky = false,
  bordered = true,
  className,
}: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      className={cn(
        "flex items-center gap-2 h-14 px-4 bg-[var(--Surface-Primary)]",
        sticky && "sticky top-0 z-40",
        bordered && "border-b border-[var(--Border-Low-Emphasis)]",
        className
      )}
    >
      {/* Leading */}
      {leading && (
        <div className="flex items-center shrink-0">{leading}</div>
      )}

      {/* Title */}
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
