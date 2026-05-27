import * as React from "react"
import { cn } from "@/lib/utils"

type RoundedShorthand = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"

const ROUNDED_MAP: Record<RoundedShorthand, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
}

export interface SkeletonProps extends Omit<React.ComponentProps<"div">, "width" | "height"> {
  /** width shorthand。数値は px、文字列はそのまま CSS に渡す */
  width?: string | number
  /** height shorthand。数値は px、文字列はそのまま CSS に渡す */
  height?: string | number
  /** 角丸プリセット（既定 lg）。`className` で上書きすれば任意の rounded-* も指定可。 */
  rounded?: RoundedShorthand
}

/**
 * Skeleton — 読み込み中のプレースホルダ。
 *
 * - `width` / `height` を数値で渡せば px、文字列ならそのまま CSS に渡る
 * - `rounded` で角丸プリセットを切り替え（既定 `lg`）
 * - `animate-pulse` がデフォルトで適用
 *
 * 複数まとめて並べる場合は `ListSkeleton` / `GridSkeleton` (patterns) を使うと
 * 定型レイアウトが組める。
 *
 * @example
 * // shorthand
 * <Skeleton width={100} height={20} />
 * <Skeleton width="100%" height={56} rounded="2xl" />
 *
 * @example
 * // 旧形式 (className のみ) も互換維持
 * <Skeleton className="h-4 w-32" />
 */
function Skeleton({ className, width, height, rounded = "lg", style, ...props }: SkeletonProps) {
  const inlineStyle: React.CSSProperties = { ...style }
  if (width !== undefined) inlineStyle.width = typeof width === "number" ? `${width}px` : width
  if (height !== undefined) inlineStyle.height = typeof height === "number" ? `${height}px` : height

  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      style={inlineStyle}
      className={cn("animate-pulse bg-[var(--Surface-Tertiary)]", ROUNDED_MAP[rounded], className)}
      {...props}
    />
  )
}

export { Skeleton }
