import * as React from "react"
import { cn } from "@/lib/utils"

interface QuantitySelectorProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** 現在の数量 */
  value: number
  /** 最小値 */
  min?: number
  /** 最大値 */
  max?: number
  /** 数量変更時のコールバック */
  onChange?: (value: number) => void
  /** 無効状態 */
  disabled?: boolean
  /** 表示サイズ: sm（カート用コンパクトピル）/ md（詳細ページ用丸ボタン） */
  size?: "sm" | "md"
  /** 最小値以下でゴミ箱アイコンを表示するか */
  showTrash?: boolean
  /** 削除時のコールバック */
  onDelete?: () => void
}

/** マイナスアイコン */
function MinusIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
}

/** プラスアイコン */
function PlusIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
}

/** ゴミ箱アイコン */
function TrashIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function QuantitySelector({ className, value, min = 1, max = 99, onChange, disabled = false, size = "md", showTrash = false, onDelete, ...props }: QuantitySelectorProps) {
  /** ゴミ箱表示条件：showTrashが有効かつ最小値以下 */
  const isTrash = showTrash && value <= min
  /** 減少可能かどうか */
  const canDec = value > min && !disabled
  /** 増加可能かどうか */
  const canInc = value < max && !disabled

  /** 減少ボタンのハンドラ */
  const handleDec = () => { if (isTrash) { onDelete?.(); return }; if (canDec) onChange?.(value - 1) }
  /** 増加ボタンのハンドラ */
  const handleInc = () => { if (canInc) onChange?.(value + 1) }

  /* smサイズ: カート内で使用するコンパクトなピル型 */
  if (size === "sm") {
    return (
      <div data-slot="quantity-selector" className={cn("inline-flex h-9 w-[108px] items-center justify-between rounded-full bg-[var(--Surface-Tertiary)] px-2.5", disabled && "opacity-50", className)} role="group" aria-label="数量選択" {...props}>
        <button type="button" className={cn("flex size-7 items-center justify-center rounded-full", (canDec || isTrash) ? "text-[var(--Object-High-Emphasis)]" : "text-[var(--Object-Disable)]")} onClick={handleDec} disabled={!(canDec || (isTrash && !disabled))} aria-label={isTrash ? "削除" : "数量を減らす"}>
          {isTrash ? <TrashIcon size={14} /> : <MinusIcon size={14} />}
        </button>
        <span className={cn("w-7 text-center typo-label-md select-none", disabled ? "text-[var(--Text-Disable)]" : "text-[var(--Text-High-Emphasis)]")} aria-live="polite">{value}</span>
        <button type="button" className={cn("flex size-7 items-center justify-center rounded-full", canInc ? "text-[var(--Object-High-Emphasis)]" : "text-[var(--Object-Disable)]")} onClick={handleInc} disabled={!canInc} aria-label="数量を増やす">
          <PlusIcon size={14} />
        </button>
      </div>
    )
  }

  /* mdサイズ: 商品詳細ページで使用する丸ボタン型 */
  return (
    <div data-slot="quantity-selector" className={cn("inline-flex items-center gap-3", className)} role="group" aria-label="数量選択" {...props}>
      <button type="button" className={cn("flex size-10 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] transition-colors", (canDec || isTrash) ? "text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)]" : "text-[var(--Object-Disable)]")} onClick={handleDec} disabled={!(canDec || (isTrash && !disabled))} aria-label={isTrash ? "削除" : "数量を減らす"}>
        {isTrash ? <TrashIcon size={18} /> : <MinusIcon size={18} />}
      </button>
      <span className={cn("flex h-10 w-12 items-center justify-center rounded-lg border border-[var(--Border-Medium-Emphasis)] typo-label-lg select-none", disabled ? "bg-[var(--Surface-Tertiary)] text-[var(--Text-Disable)]" : "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]")} aria-live="polite">{value}</span>
      <button type="button" className={cn("flex size-10 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] transition-colors", canInc ? "text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)]" : "text-[var(--Object-Disable)]")} onClick={handleInc} disabled={!canInc} aria-label="数量を増やす">
        <PlusIcon size={18} />
      </button>
    </div>
  )
}

export { QuantitySelector }
