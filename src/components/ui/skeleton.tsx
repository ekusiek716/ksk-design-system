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

export interface SkeletonTextProps {
  /** 表示する行数（既定 3） */
  lines?: number
  /** 各行の高さ（px、既定 12） */
  lineHeight?: number
  /** 最終行を短縮する比率（既定 "60%"）。false で全行同幅 */
  lastLineWidth?: string | false
  className?: string
}

/**
 * SkeletonText — 複数行テキストのローディングプレースホルダ。
 * `lines` 本のバーを積み、最終行だけ幅を縮めて自然なテキストブロックに見せる。
 *
 * ネイティブ版（`src/native/components/Skeleton.tsx` の `SkeletonText`）と対応。
 * native は `lines` のみを受け取るが、web 版は `lineHeight` / `lastLineWidth` で
 * 細かい調整ができるよう拡張している。
 *
 * @example
 * <SkeletonText lines={3} />
 */
function SkeletonText({ lines = 3, lineHeight = 12, lastLineWidth = "60%", className }: SkeletonTextProps) {
  return (
    <div data-slot="skeleton-text" aria-hidden="true" className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 && lastLineWidth ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  )
}

export { Skeleton, SkeletonText }
