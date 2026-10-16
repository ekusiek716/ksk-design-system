import * as React from "react"
import { cn } from "@/lib/utils"

type SelectableTileShape = "rounded" | "circle"
type SelectableTileMoveDirection = "up" | "down" | "left" | "right"

interface SelectableTileProps extends React.ComponentProps<"button"> {
  /** 形。rounded=角丸の長方形（既定。卓・配置ブロック等）/ circle=正円（座席・アバター型の枠） */
  shape?: SelectableTileShape
  /**
   * 選択中。指定時は `aria-pressed` で状態を読み上げる（未指定なら aria-pressed を付けない）。
   * 見た目は Card の selected と同じ Surface-Accent-Primary-Light の面 + Border-Accent-Primary の枠。
   */
  selected?: boolean
  /**
   * 動かせる状態（配置の編集中など）。つかめるカーソル・`touch-action: none`（ドラッグ中に
   * ページがスクロールしない）にし、`onMove` を矢印キーで呼ぶ。
   */
  movable?: boolean
  /** ドラッグ中。持ち上がった見た目（影）にする。ドラッグの状態は consumer が持つ */
  dragging?: boolean
  /**
   * movable の間、矢印キー（↑ ↓ ← →）で呼ぶ。呼んだキーは preventDefault する
   * （ページのスクロールを止める）。consumer の onKeyDown が preventDefault した場合は呼ばない。
   */
  onMove?: (direction: SelectableTileMoveDirection, event: React.KeyboardEvent<HTMLButtonElement>) => void
  /**
   * movable の間に読み上げる操作説明（「矢印キーで移動、Enter で開く」等）。
   * 見えない要素に描画して `aria-describedby` で結ぶ（consumer の aria-describedby と連結）。
   * 非推奨の `aria-grabbed` / `aria-dropeffect` は使わない。
   */
  moveInstructions?: React.ReactNode
}

const MOVE_KEYS: Record<string, SelectableTileMoveDirection> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
}

/** 選択中の面・枠。Card / ActionTile の selected と同じトークン（ring-1 で枠を 2px 相当に） */
const SELECTED_CLASS =
  "border-[var(--Border-Accent-Primary)] ring-1 ring-inset ring-[var(--Border-Accent-Primary)] bg-[var(--Surface-Accent-Primary-Light)]"

/**
 * SelectableTile — 押すと選べて、編集中はドラッグ・矢印キーで動かせるタイル（issue #703）
 *
 * 配席表の卓・座席、レイアウト編集のブロック、並べ替えできるグリッドの項目など、
 * 「1 つの押せる面」として選択・移動するタイル。
 *
 * ### Card selected との違い
 * Card の押せる面は内側の button（card-overlay）なので、外側に付けた pointer / key のハンドラや
 * aria-describedby が押せる面に乗らない。SelectableTile は**押せる面そのものが 1 つの `<button>`**
 * で、`onPointerDown` / `onKeyDown` / `aria-*` を渡すとすべてその button に付く。
 *
 * ### a11y
 * - 名前は中身（または aria-label）。selected 指定時は aria-pressed
 * - movable の間は `moveInstructions` を aria-describedby で読み上げ、矢印キーで `onMove`
 * - フォーカスリングは DS の focus-visible（3px）
 * - ドラッグ＆ドロップ自体（pointer capture・落とし先の判定）は持たない。consumer が
 *   onPointerDown 等で実装し、`dragging` で見た目だけ DS に渡す
 *
 * 大きさは className で渡す（円形は `size-12` 等。タップ領域は 44px 以上を保つ）。
 */
function SelectableTile({
  shape = "rounded",
  selected,
  movable = false,
  dragging = false,
  onMove,
  moveInstructions,
  className,
  type = "button",
  onKeyDown,
  "aria-describedby": ariaDescribedBy,
  disabled,
  ...props
}: SelectableTileProps) {
  const instructionsId = React.useId()
  const hasInstructions = movable && moveInstructions != null && moveInstructions !== false
  const describedBy = [ariaDescribedBy, hasInstructions ? instructionsId : undefined].filter(Boolean).join(" ") || undefined

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !movable || !onMove || disabled) return
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const direction = MOVE_KEYS[event.key]
    if (!direction) return
    event.preventDefault()
    onMove(direction, event)
  }

  return (
    <>
      <button
        type={type}
        data-slot="selectable-tile"
        data-shape={shape}
        data-selected={selected || undefined}
        data-movable={movable || undefined}
        data-dragging={dragging || undefined}
        aria-pressed={selected === undefined ? undefined : selected}
        aria-describedby={describedBy}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center border text-[var(--Text-High-Emphasis)]",
          "cursor-pointer transition-[background-color,border-color,box-shadow] duration-[var(--Motion-Duration-Fast)] ease-[var(--Motion-Easing-Standard)]",
          "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          shape === "circle" ? "aspect-square rounded-full p-1" : "rounded-lg p-3",
          selected
            ? SELECTED_CLASS
            : "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Secondary)]",
          movable && "cursor-grab touch-none select-none active:cursor-grabbing",
          dragging && "cursor-grabbing shadow-[var(--shadow-md)]",
          className
        )}
        {...props}
      />
      {hasInstructions && (
        // aria-describedby は hidden の要素も参照できる（説明は読み上げ、画面とブラウズモードには出ない）
        <span id={instructionsId} hidden data-slot="selectable-tile-instructions">
          {moveInstructions}
        </span>
      )}
    </>
  )
}

export { SelectableTile }
export type { SelectableTileMoveDirection, SelectableTileProps, SelectableTileShape }
