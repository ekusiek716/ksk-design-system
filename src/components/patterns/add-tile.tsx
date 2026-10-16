import * as React from "react"
import { Add } from "iconsax-reactjs"
import { cn } from "@/lib/utils"

type AddTileSize = "sm" | "md"

interface AddTileProps extends Omit<React.ComponentProps<"button">, "children"> {
  /** 可視ラベル（「タスクを追加」等）。アクセシブルネームにもなる */
  label: string
  /** 先頭のアイコン。既定は iconsax の Add（装飾・aria-hidden） */
  icon?: React.ReactNode
  /** 高さ。sm=44px（一覧の末尾）/ md=64px（空カラム・グリッドの空き枠）。既定 md */
  size?: AddTileSize
  /** 親幅いっぱいに広げる（既定 true）。false はラベル幅 */
  fullWidth?: boolean
}

/**
 * AddTile — 一覧の末尾・空のカラム・グリッドの空き枠に置く「＋追加」の点線タイル（issue #678）
 *
 * 押すと新しい項目を作る（シートを開く等）ための入口。Button に点線の枠・形を上書きして
 * 自作しない。点線（Border-Medium-Emphasis）・hover で Border-Accent-Primary と
 * Text-Accent-Primary・高さ 44px 以上・focus-visible のリングを DS が持つ。
 *
 * - 画面の主操作（ヘッダーの「作成」や FAB）の代わりには使わない。「この場所に足す」入口に限る
 * - 中身の無い空状態全体の案内は EmptyState を使う（AddTile はその中の操作にもなる）
 */
function AddTile({
  label,
  icon,
  size = "md",
  fullWidth = true,
  className,
  type = "button",
  ...props
}: AddTileProps) {
  return (
    <button
      type={type}
      data-slot="add-tile"
      data-size={size}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--Border-Medium-Emphasis)] bg-transparent px-4 typo-label-md text-[var(--Text-Medium-Emphasis)]",
        "cursor-pointer transition-colors duration-[var(--Motion-Duration-Fast)] ease-[var(--Motion-Easing-Standard)]",
        "hover:border-[var(--Border-Accent-Primary)] hover:bg-[var(--Surface-Accent-Primary-Light)] hover:text-[var(--Text-Accent-Primary)]",
        "active:scale-[0.98]",
        "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--Border-Medium-Emphasis)] disabled:hover:bg-transparent disabled:hover:text-[var(--Text-Medium-Emphasis)]",
        size === "sm" ? "min-h-11" : "min-h-16",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center [&_svg]:size-5">
        {icon ?? <Add size={20} color="currentColor" />}
      </span>
      <span className="min-w-[4rem] truncate">{label}</span>
    </button>
  )
}

export { AddTile }
export type { AddTileProps, AddTileSize }
