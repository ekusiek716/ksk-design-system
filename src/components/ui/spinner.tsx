import * as React from "react"
import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** スピナーのサイズ。デフォルト "md" */
  size?: "sm" | "md" | "lg"
  /**
   * スクリーンリーダー向けローディングラベル。
   * i18n 対応: 英語では "Loading" を渡す。
   * @default "読み込み中"
   */
  label?: string
}

/**
 * Spinner — ローディング表示
 *
 * ### 使用例
 * ```tsx
 * <Spinner size="md" />
 * ```
 */
function Spinner({ className, size = "md", label = "読み込み中", ...props }: SpinnerProps) {
  // check-border-color-ignore-file: 色は下の cn() 内の border-[var(--Border-Medium-Emphasis)] /
  // border-t-[var(--Brand-Primary)] と必ず合成されるため、ここは幅のみでよい。
  const sizeClasses = {
    sm: "size-4 border-2",
    md: "size-8 border-[3px]",
    lg: "size-12 border-4",
  }

  return (
    <div
      data-slot="spinner"
      role="status"
      aria-label={label}
      className={cn(
        "animate-spin rounded-full border-[var(--Border-Medium-Emphasis)] border-t-[var(--Brand-Primary)]",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </div>
  )
}

export { Spinner }
export type { SpinnerProps }
