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
export { Skeleton };
