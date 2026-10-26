import * as React from "react"
import { cn } from "@/lib/utils"
import { OVERLAY_FOCUS_RING } from "@/lib/server-variants/overlay-focus-ring"
import { useKskLabels } from "../ui/ksk-labels"

type MediaActionClusterOrientation = "vertical" | "horizontal" | "auto"
type MediaActionClusterAnchor =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center-left"
  | "center-right"
type MediaActionClusterPosition = "absolute" | "fixed"
type MediaActionClusterLabelPosition = "below" | "side" | "auto"

interface MediaActionClusterItem {
  id?: string
  label: string
  ariaLabel?: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
  active?: boolean
  badge?: React.ReactNode
  disabled?: boolean
}

interface MediaActionClusterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  items: MediaActionClusterItem[]
  orientation?: MediaActionClusterOrientation
  anchor?: MediaActionClusterAnchor
  position?: MediaActionClusterPosition
  labelPosition?: MediaActionClusterLabelPosition
  autoHideMs?: number | null
  defaultVisible?: boolean
  onVisibleChange?: (visible: boolean) => void
  /** クラスタ全体（role="group"）の aria-label。省略時は KskLabelsProvider の `mediaActionCluster`（Provider 無しは "メディアアクション"。locale="en" で "Media actions"） */
  "aria-label"?: string
}

const ANCHOR_CLASS: Record<MediaActionClusterAnchor, string> = {
  "top-left": "top-[max(1rem,var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px)))] left-[max(1rem,env(safe-area-inset-left))]",
  "top-right": "top-[max(1rem,var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px)))] right-[max(1rem,env(safe-area-inset-right))]",
  "bottom-left": "bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))]",
  "bottom-right": "bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]",
  "center-left": "top-1/2 left-[max(1rem,env(safe-area-inset-left))] -translate-y-1/2",
  "center-right": "top-1/2 right-[max(1rem,env(safe-area-inset-right))] -translate-y-1/2",
}

const CLUSTER_ORIENTATION_CLASS: Record<MediaActionClusterOrientation, string> = {
  vertical: "flex-col",
  horizontal: "flex-row",
  auto: "flex-col landscape:flex-row",
}

function resolveLabelPosition(
  labelPosition: MediaActionClusterLabelPosition,
  orientation: MediaActionClusterOrientation,
) {
  if (labelPosition === "below") return "flex-col"
  if (labelPosition === "side") return "flex-row"
  if (orientation === "horizontal") return "flex-row"
  if (orientation === "vertical") return "flex-col"
  return "flex-col landscape:flex-row"
}

function displayBadge(badge: React.ReactNode) {
  if (typeof badge === "number" && badge > 99) return "99+"
  return badge
}

function MediaActionCluster({
  items,
  orientation = "vertical",
  anchor = "bottom-right",
  position = "absolute",
  labelPosition = "auto",
  autoHideMs = 5000,
  defaultVisible = true,
  onVisibleChange,
  className,
  "aria-label": ariaLabelProp,
  ...props
}: MediaActionClusterProps) {
  const defaultLabels = useKskLabels()
  const ariaLabel = ariaLabelProp ?? defaultLabels.mediaActionCluster
  const autoHideEnabled = autoHideMs != null && autoHideMs > 0
  const [visibility, setVisibility] = React.useState({
    autoHideEnabled,
    value: defaultVisible,
  })
  if (visibility.autoHideEnabled !== autoHideEnabled) {
    setVisibility({ autoHideEnabled, value: true })
  }
  const visible = autoHideEnabled ? visibility.value : true
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearHideTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const setVisibleState = React.useCallback(
    (nextVisible: boolean) => {
      setVisibility((current) => {
        const currentVisible = current.autoHideEnabled ? current.value : true
        if (currentVisible !== nextVisible) onVisibleChange?.(nextVisible)
        return { autoHideEnabled, value: nextVisible }
      })
    },
    [autoHideEnabled, onVisibleChange],
  )

  const scheduleHide = React.useCallback(() => {
    clearHideTimer()
    if (!autoHideEnabled) return
    timerRef.current = setTimeout(() => setVisibleState(false), autoHideMs)
  }, [autoHideEnabled, autoHideMs, clearHideTimer, setVisibleState])

  const reveal = React.useCallback(() => {
    setVisibleState(true)
    scheduleHide()
  }, [scheduleHide, setVisibleState])

  React.useEffect(() => {
    if (!autoHideEnabled) {
      clearHideTimer()
      return
    }
    scheduleHide()
    return clearHideTimer
  }, [autoHideEnabled, clearHideTimer, scheduleHide])

  React.useEffect(() => {
    if (!autoHideEnabled || typeof window === "undefined") return
    const restore = () => reveal()
    window.addEventListener("pointerdown", restore, { passive: true })
    window.addEventListener("touchstart", restore, { passive: true })
    window.addEventListener("keydown", restore)
    window.addEventListener("wheel", restore, { passive: true })
    return () => {
      window.removeEventListener("pointerdown", restore)
      window.removeEventListener("touchstart", restore)
      window.removeEventListener("keydown", restore)
      window.removeEventListener("wheel", restore)
    }
  }, [autoHideEnabled, reveal])

  const itemDirection = resolveLabelPosition(labelPosition, orientation)

  return (
    <div
      data-slot="media-action-cluster"
      data-orientation={orientation}
      data-anchor={anchor}
      data-visible={visible}
      role="group"
      aria-label={ariaLabel}
      onPointerEnter={reveal}
      onFocusCapture={reveal}
      className={cn(
        "z-[var(--Z-Nav)] flex items-center gap-3 transition-opacity duration-[var(--Motion-Duration-Slow)]",
        position === "fixed" ? "fixed" : "absolute",
        ANCHOR_CLASS[anchor],
        CLUSTER_ORIENTATION_CLASS[orientation],
        visible ? "opacity-100" : "opacity-40",
        className,
      )}
      {...props}
    >
      {items.map((item, index) => (
        <MediaActionClusterButton
          key={item.id ?? `${item.label}-${index}`}
          item={item}
          itemDirection={itemDirection}
          onReveal={reveal}
        />
      ))}
    </div>
  )
}

function MediaActionClusterButton({
  item,
  itemDirection,
  onReveal,
}: {
  item: MediaActionClusterItem
  itemDirection: string
  onReveal: () => void
}) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    onReveal()
    if (item.disabled) {
      event.preventDefault()
      return
    }
    item.onClick?.()
  }

  const content = (
    <>
      <span
        className={cn(
          "relative flex size-12 shrink-0 items-center justify-center rounded-full glass glass-specular glass-inverse",
          "transition-transform active:scale-[0.94]",
          // active は Border-Accent-Primary の 2px リング。.glass の非レイヤー box-shadow は Tailwind の ring を打ち消すため、
          // glass.css が box-shadow の先頭に置く --ksk-glass-focus-ring（内部変数）へ値を入れて合成する
          item.active && "[--ksk-glass-focus-ring:0_0_0_2px_var(--Border-Accent-Primary)]",
          item.disabled && "opacity-50",
        )}
        aria-hidden="true"
      >
        {item.icon}
        {item.badge != null && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--Surface-Caution-Strong)] px-1 typo-label-xs text-[var(--Text-on-Media)] shadow-[var(--shadow-sm)]">
            {displayBadge(item.badge)}
          </span>
        )}
      </span>
      <span className="max-w-24 truncate text-center typo-label-xs text-on-media">
        {item.label}
      </span>
    </>
  )

  const className = cn(
    "group inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full",
    // 写真・動画の上に乗る操作子なので、背景に依存しない二重リング（白 + 濃色）にする。
    // 内側の glass 円は aria-hidden の装飾で、フォーカスを受けるのはこの外側の a / button
    OVERLAY_FOCUS_RING,
    "disabled:pointer-events-none disabled:opacity-50",
    itemDirection,
  )

  if (item.href) {
    return (
      <a
        href={item.disabled ? undefined : item.href}
        aria-label={item.ariaLabel ?? item.label}
        aria-disabled={item.disabled || undefined}
        data-active={item.active || undefined}
        onClick={handleClick}
        className={className}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      aria-label={item.ariaLabel ?? item.label}
      aria-pressed={item.active ?? undefined}
      disabled={item.disabled}
      onClick={handleClick}
      className={className}
    >
      {content}
    </button>
  )
}

export { MediaActionCluster }
export type {
  MediaActionClusterAnchor,
  MediaActionClusterItem,
  MediaActionClusterLabelPosition,
  MediaActionClusterOrientation,
  MediaActionClusterPosition,
  MediaActionClusterProps,
}
