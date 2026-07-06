import React from "react";
export interface ChipFilterBarProps {
    children: React.ReactNode;
    /** 検索結果件数。指定すると children の下に件数テキストを表示する */
    resultCount?: number;
    /**
     * 件数テキストのフォーマッタ。未指定時は `"{n}件"` を表示する。
     */
    resultCountLabel?: (n: number) => string;
}
/**
 * ChipFilterBar (native) — Chip を横スクロール表示するフィルターバーパターン。
 * Web 版 (`src/components/patterns/chip-filter-bar.tsx`) と同じ役割。
 *
 * native の `sticky` / `bare` は Web の CSS position 概念に対応するものがなく、
 * ScrollView の親レイアウト側（例: 固定 header の下に配置する等）で吸収する想定のため、
 * ここでは持たない。
 */
export declare function ChipFilterBar({ children, resultCount, resultCountLabel }: ChipFilterBarProps): React.JSX.Element;
