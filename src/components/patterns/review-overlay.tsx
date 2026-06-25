import * as React from "react"
import { cn } from "@/lib/utils"

export interface ReviewPin {
  id: string
  x: number
  y: number
  comment?: string
}

export interface ReviewOverlayProps {
  /** オーバーレイを表示するか */
  active: boolean
  /** ピン作成時のコールバック（ページ相対座標 0–1） */
  onPinCreate?: (pin: Omit<ReviewPin, "id">) => void
  /** 既存ピン一覧 */
  pins?: ReviewPin[]
  /** ピンクリック時のコールバック */
  onPinClick?: (pin: ReviewPin) => void
  /** 長押し認識時間 (ms) */
  holdDuration?: number
  /** ハプティックフィードバック（Capacitor Haptics 等のコールバックを渡す） */
  onHaptic?: () => void
  className?: string
  children?: React.ReactNode
}

function ReviewOverlay({
  active,
  onPinCreate,
  pins = [],
  onPinClick,
  holdDuration = 600,
  onHaptic,
  className,
  children,
}: ReviewOverlayProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const [spotlight, setSpotlight] = React.useState<{ x: number; y: number } | null>(null)

  const getRelativePos = (clientX: number, clientY: number) => {
    const el = containerRef.current
    if (!el) return { x: 0.5, y: 0.5 }
    const rect = el.getBoundingClientRect()
    return {
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    }
  }

  const startHold = (clientX: number, clientY: number) => {
    if (!active) return
    const pos = getRelativePos(clientX, clientY)
    setSpotlight(pos)
    timerRef.current = setTimeout(() => {
      onHaptic?.()
      onPinCreate?.(pos)
      setSpotlight(null)
    }, holdDuration)
  }

  const cancelHold = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setSpotlight(null)
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative select-none", className)}
      onMouseDown={(e) => startHold(e.clientX, e.clientY)}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={(e) => {
        const t = e.touches[0]
        startHold(t.clientX, t.clientY)
      }}
      onTouchEnd={cancelHold}
      onTouchCancel={cancelHold}
    >
      {children}

      {/* スポットライトオーバーレイ */}
      {active && spotlight && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle 60px at ${spotlight.x * 100}% ${spotlight.y * 100}%, transparent 40px, rgba(0,0,0,0.45) 70px)`,
          }}
        />
      )}

      {/* ピン */}
      {active &&
        pins.map((pin) => (
          <button
            key={pin.id}
            type="button"
            aria-label={pin.comment ?? `レビューピン`}
            onClick={() => onPinClick?.(pin)}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
            style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-[var(--Object-Caution)] shadow-[var(--shadow-md)] ring-4 ring-[var(--Object-Caution)]/30 group-hover:ring-[var(--Object-Caution)]/50 transition-all" />
          </button>
        ))}
    </div>
  )
}

export { ReviewOverlay }
