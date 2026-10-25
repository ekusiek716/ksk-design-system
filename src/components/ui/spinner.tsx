import * as React from "react"
import { cn } from "@/lib/utils"
import { useKskLabels } from "./ksk-labels"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** スピナーのサイズ。デフォルト "md" */
  size?: "sm" | "md" | "lg"
  /**
   * スクリーンリーダー向けローディングラベル。
   * 省略時は KskLabelsProvider の `spinnerLoading`（Provider 無しは "読み込み中"。locale="en" で "Loading"）。
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
function Spinner({ className, size = "md", label: labelProp, ...props }: SpinnerProps) {
  const defaultLabels = useKskLabels()
  const label = labelProp ?? defaultLabels.spinnerLoading
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
      // 動きを減らす設定（prefers-reduced-motion）では回転を止める。--Motion-* の一括制御は
      // animate-spin に効かないため個別に指定（Button のスピナーと同じ）。止めても上辺だけ
      // ブランド色の欠けた輪で「処理中」と分かり、状態は role="status" とラベルで伝わる。
      className={cn(
        "animate-spin motion-reduce:animate-none rounded-full border-[var(--Border-Medium-Emphasis)] border-t-[var(--Brand-Primary)]",
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
