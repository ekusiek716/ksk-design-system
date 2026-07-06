import * as React from "react";
interface ChipFilterBarProps {
    children: React.ReactNode;
    /** 検索結果件数。指定すると children の下に件数テキストを表示する */
    resultCount?: number;
    /**
     * 件数テキストのフォーマッタ。未指定時は `"{n}件"` を表示する。
     * i18n が必要な消費側はここに関数を渡して差し替える。
     */
    resultCountLabel?: (n: number) => string;
    /**
     * true でチップ行をスクロール時に上部固定する。背景を敷いて下のリストの
     * 透けを防ぐ。固定位置は `stickyOffset` で調整する。
     */
    sticky?: boolean;
    /**
     * sticky 時の `top` オフセット（px）。固定ヘッダー等の高さ分だけ相殺したい場合に指定する。
     * @default 0
     */
    stickyOffset?: number;
    /**
     * true で自前の overflow/padding ラッパーを付けず children のみ返す。
     * 外側の 1 つのスクロール行に他の要素（view セレクタ等）と並べて横スクロールを
     * 共有させたい場合に使う（二重スクロールコンテナの回避）。
     */
    bare?: boolean;
    className?: string;
}
/**
 * ChipFilterBar — Chip を横スクロール表示するフィルターバーパターン。
 * belle-todo の FilterBar（Chips.tsx 107-134行）を移植。
 *
 * DS 既存の `commerce/FilterBar`（filters/sortOptions 統合型）とは別 API・別用途。
 * 本コンポーネントは children に任意の Chip 群を渡すシンプルな横スクロールラッパー。
 */
declare function ChipFilterBar({ children, resultCount, resultCountLabel, sticky, stickyOffset, bare, className, }: ChipFilterBarProps): React.JSX.Element;
export { ChipFilterBar };
export type { ChipFilterBarProps };
