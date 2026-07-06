import * as React from "react";
interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    /** スピナーのサイズ。デフォルト "md" */
    size?: "sm" | "md" | "lg";
    /**
     * スクリーンリーダー向けローディングラベル。
     * i18n 対応: 英語では "Loading" を渡す。
     * @default "読み込み中"
     */
    label?: string;
}
/**
 * Spinner — ローディング表示
 *
 * ### 使用例
 * ```tsx
 * <Spinner size="md" />
 * ```
 */
declare function Spinner({ className, size, label, ...props }: SpinnerProps): React.JSX.Element;
export { Spinner };
export type { SpinnerProps };
