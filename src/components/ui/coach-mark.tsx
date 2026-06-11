import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

type CoachMarkPlacement = "top" | "bottom" | "left" | "right"
type CoachMarkVariant = "default" | "brand"

interface CoachMarkProps {
  /** バルーンに表示するコンテンツ */
  content: React.ReactNode
  children: React.ReactNode
  placement?: CoachMarkPlacement
  variant?: CoachMarkVariant
  /** 制御モード: open を外から制御 */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** ステップ番号（オンボーディング用） */
  step?: number
  /** 合計ステップ数 */
  totalSteps?: number
  /** 次へボタンクリック */
  onNext?: () => void
  /** 閉じるボタン表示 */
  showClose?: boolean
  onClose?: () => void
  delayDuration?: number
  className?: string
}

const sideMap: Record<CoachMarkPlacement, "top" | "bottom" | "left" | "right"> = {
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",
}

function CoachMark({
  content,
  children,
  placement = "top",
  variant = "default",
  open,
  onOpenChange,
  step,
  totalSteps,
  onNext,
  showClose,
  onClose,
  delayDuration = 0,
  className,
}: CoachMarkProps) {
  const isOnboarding = step !== undefined

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            data-slot="coach-mark"
            data-variant={variant}
            side={sideMap[placement]}
            sideOffset={8}
            className={cn(
              "z-50 max-w-[240px] rounded-lg px-3 py-2 text-[12px] leading-relaxed shadow-lg",
              "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
              variant === "brand"
                ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]"
                : "bg-[var(--Surface-Inverse)] text-[var(--Text-on-Inverse)]",
              className
            )}
          >
            {isOnboarding ? (
              <div className="flex flex-col gap-2">
                {totalSteps && (
                  <span className="text-[10px] font-semibold opacity-70">
                    {step} / {totalSteps}
                  </span>
                )}
                {/* div wrapper (not p) so callers can pass block-level
                    content (<div>, <p>, <h2>, <ul> 等) without producing
                    a HTML validity / React hydration error. */}
                <div className="font-medium">{content}</div>
                {(onNext || showClose) && (
                  <div className="flex items-center justify-between mt-1">
                    {showClose && (
                      <button
                        onClick={onClose}
                        className="text-[10px] opacity-60 hover:opacity-100 transition-opacity"
                      >
                        スキップ
                      </button>
                    )}
                    {onNext && (
                      <button
                        onClick={onNext}
                        className="text-[11px] font-bold bg-[var(--Object-on-Inverse)]/20 hover:bg-[var(--Object-on-Inverse)]/30 px-2.5 py-0.5 rounded-md transition-colors ml-auto"
                      >
                        次へ →
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              content
            )}
            <TooltipPrimitive.Arrow
              className={cn(
                variant === "brand"
                  ? "fill-[var(--Brand-Primary)]"
                  : "fill-[var(--Surface-Inverse)]"
              )}
              width={10}
              height={5}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export { CoachMark }
export type { CoachMarkProps, CoachMarkPlacement, CoachMarkVariant }
