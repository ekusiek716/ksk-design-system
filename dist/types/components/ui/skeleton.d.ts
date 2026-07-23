import * as React from "react";
type RoundedShorthand = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export interface SkeletonProps extends Omit<React.ComponentProps<"div">, "width" | "height"> {
    /** width shorthand。数値は px、文字列はそのまま CSS に渡す */
    width?: string | number;
    /** height shorthand。数値は px、文字列はそのまま CSS に渡す */
    height?: string | number;
    /** 角丸プリセット（既定 lg）。`className` で上書きすれば任意の rounded-* も指定可。 */
    rounded?: RoundedShorthand;
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
declare function Skeleton({ className, width, height, rounded, style, ...props }: SkeletonProps): React.JSX.Element;
export interface SkeletonTextProps {
    /** 表示する行数（既定 3） */
    lines?: number;
    /** 各行の高さ（px、既定 12） */
    lineHeight?: number;
    /** 最終行を短縮する比率（既定 "60%"）。false で全行同幅 */
    lastLineWidth?: string | false;
    className?: string;
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
declare function SkeletonText({ lines, lineHeight, lastLineWidth, className }: SkeletonTextProps): React.JSX.Element;
export { Skeleton, SkeletonText };
