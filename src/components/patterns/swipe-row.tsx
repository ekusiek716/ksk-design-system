import * as React from "react"
import { cn } from "@/lib/utils"
import { useKskLabels } from "../ui/ksk-labels"

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
  /**
   * アクション群をまとめる group のラベル（支援技術向け）。
   * 省略時は KskLabelsProvider の `swipeRowActions`（Provider 無しは "行の操作"。locale="en" で "Row actions"）。
   */
  actionsLabel?: string
}

const ACTION_WIDTH = 72 // px per action
/** この距離（px）を超えて横に動いたら初めてスワイプとみなす（issue #794） */
const DRAG_THRESHOLD = 8

function SwipeRow({ children, actions = [], side = "right", className, actionsLabel: actionsLabelProp }: SwipeRowProps) {
  const defaultLabels = useKskLabels()
  const actionsLabel = actionsLabelProp ?? defaultLabels.swipeRowActions
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

  // issue #794: pointerdown の時点ではポインタを握らない。握ると children の
  // ボタン・リンクへの click が行本体に横取りされる（pointerup の付け替え先が行本体になり、
  // click は共通祖先＝行本体へ投げられる）。pointerdown では開始位置を記録するだけにし、
  // 横移動が DRAG_THRESHOLD を超えて横方向が優勢になった時点で初めてドラッグを確定し、
  // setPointerCapture する（Sheet のマウス経路と同じ方式）。縦方向が優勢なら記録を
  // 破棄して縦スクロール（touch-pan-y）に譲る。
  const pendingPointerId = React.useRef<number | null>(null)
  const startY = React.useRef(0)
  const draggingRef = React.useRef(false)
  // ドラッグ確定後に飛んでくる click を 1 回だけ握りつぶす（スワイプ直後の子の誤発火防止）
  const suppressClick = React.useRef(false)

  const updateOffset = (clientX: number) => {
    const delta = clientX - startX.current
    const raw = startOffset.current + delta
    // side="right": 左方向(負)に開く → [-maxOffset, 0] にクランプ
    // side="left" : 右方向(正)に開く → [0, maxOffset] にクランプ
    const clamped =
      side === "right"
        ? Math.max(-maxOffset, Math.min(0, raw))
        : Math.min(maxOffset, Math.max(0, raw))
    setOffset(clamped)
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    // マウスの右クリック・中クリックではドラッグ状態に入らない
    if (e.pointerType === "mouse" && e.button !== 0) return
    // 2 本目以降の指（isPrimary=false）・ドラッグ中の別ポインタは無視する。上書きすると
    // 1 本目の pointerup が id 不一致で捨てられ、行がスナップせず止まる。
    if (e.isPrimary === false || draggingRef.current) return
    pendingPointerId.current = e.pointerId
    draggingRef.current = false
    startX.current = e.clientX
    startY.current = e.clientY
    startOffset.current = offset
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pendingPointerId.current !== e.pointerId) return
    if (!draggingRef.current) {
      // ドラッグ確定前はポインタを握っていないため、行の外で離した pointerup は届かない。
      // ボタンが押されていないマウスの move は「既に離した」とみなし記録を破棄する
      // （残すと、後でボタンを押さずに行へ戻ったときに行がカーソルに付いて動く）。
      if (e.pointerType === "mouse" && (e.buttons & 1) === 0) {
        pendingPointerId.current = null
        return
      }
      const dx = e.clientX - startX.current
      const dy = e.clientY - startY.current
      if (Math.abs(dx) <= DRAG_THRESHOLD && Math.abs(dy) <= DRAG_THRESHOLD) return
      if (Math.abs(dx) <= Math.abs(dy)) {
        // 縦方向が優勢: スワイプではなくスクロール。以後このポインタは追わない
        pendingPointerId.current = null
        return
      }
      draggingRef.current = true
      setIsDragging(true)
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        // setPointerCapture は未対応環境・既に解放済みのポインタで例外を投げるため無視
      }
    }
    updateOffset(e.clientX)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pendingPointerId.current !== e.pointerId) return
    pendingPointerId.current = null
    if (!draggingRef.current) return
    draggingRef.current = false
    setIsDragging(false)
    if (e.type === "pointerup") {
      suppressClick.current = true
      // click は pointerup と同じ入力処理の中で続けて届く。届かなかった場合に
      // 次のクリックまで握りつぶさないよう、次の tick で解除する。
      window.setTimeout(() => {
        suppressClick.current = false
      }, 0)
    }
    const sign = side === "right" ? -1 : 1
    snapTo(isOpen ? sign * maxOffset : 0)
  }

  const handleClickCapture = (e: React.MouseEvent) => {
    if (!suppressClick.current) return
    suppressClick.current = false
    e.preventDefault()
    e.stopPropagation()
  }

  const close = () => snapTo(0)
  const open = () => snapTo((side === "right" ? -1 : 1) * maxOffset)

  // キーボード / スクリーンリーダー用の到達経路（issue #342 web 側）。
  // スワイプはポインタ操作でしか開けないため、actions グループに
  // フォーカスが入った瞬間に開き、グループの外へ抜けたら閉じる。
  // inert で常時隠すと Tab / VoiceOver からアクションへ到達できなくなるため、
  // フォーカス時だけ視覚的にも開いて到達可能にする（レイアウト自体は不変）。
  const handleActionsFocus = () => open()
  const handleActionsBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) close()
  }

  if (actions.length === 0) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Action buttons — 常にフォーカス・読み上げ可能。閉じている間は主コンテンツの
          背後に視覚的に隠れるが、フォーカスが入ると自動で開く（inert は使わない）。 */}
      <div
        role="group"
        aria-label={actionsLabel}
        className={cn(
          "absolute inset-y-0 flex",
          side === "right" ? "right-0" : "left-0"
        )}
        style={{ width: maxOffset }}
        onFocus={handleActionsFocus}
        onBlur={handleActionsBlur}
      >
        {actions.map((action, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { action.onClick(); close() }}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-[72px] typo-label-xs font-medium transition-colors",
              "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]",
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
          !isDragging && "transition-transform duration-[var(--Motion-Duration-Base)] ease-[var(--Motion-Easing-Standard)]"
        )}
        style={{ transform: `translateX(${offset}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClickCapture={handleClickCapture}
      >
        {children}
      </div>
    </div>
  )
}

export { SwipeRow }
export type { SwipeRowProps }
