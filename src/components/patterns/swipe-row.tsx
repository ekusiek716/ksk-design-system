import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwipeAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: "default" | "destructive"
}

interface SwipeRowProps {
  children: React.ReactNode
  actions?: SwipeAction[]
  /** スワイプで開く方向 */
  side?: "left" | "right"
  className?: string
}

const ACTION_WIDTH = 72 // px per action

function SwipeRow({ children, actions = [], side = "right", className }: SwipeRowProps) {
  const [offset, setOffset] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const startX = React.useRef(0)
  const startOffset = React.useRef(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const maxOffset = actions.length * ACTION_WIDTH
  const isOpen = Math.abs(offset) > maxOffset / 2

  const snapTo = React.useCallback((target: number) => {
    setOffset(target)
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX
    startOffset.current = offset
    setIsDragging(true)
    containerRef.current?.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const delta = e.clientX - startX.current
    const raw = startOffset.current + delta
    const sign = side === "right" ? -1 : 1
    const clamped = Math.min(0, Math.max(sign * maxOffset, raw))
    setOffset(clamped)
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    const sign = side === "right" ? -1 : 1
    snapTo(isOpen ? sign * maxOffset : 0)
  }

  const close = () => snapTo(0)

  if (actions.length === 0) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Action buttons */}
      <div
        className={cn(
          "absolute inset-y-0 flex",
          side === "right" ? "right-0" : "left-0"
        )}
        style={{ width: maxOffset }}
      >
        {actions.map((action, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { action.onClick(); close() }}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-[72px] typo-label-xs font-medium transition-colors",
              action.variant === "destructive"
                ? "bg-[var(--Caution-Base)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Destructive-Button)]"
                : "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)] hover:bg-[var(--Border-Medium-Emphasis)]"
            )}
          >
            {action.icon && <span className="text-current">{action.icon}</span>}
            {action.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div
        ref={containerRef}
        className={cn(
          "relative bg-[var(--Surface-Primary)] touch-pan-y select-none",
          !isDragging && "transition-transform duration-200 ease-out"
        )}
        style={{ transform: `translateX(${offset}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {children}
      </div>
    </div>
  )
}

export { SwipeRow }
export type { SwipeRowProps }
