import React from "react";
export interface CollapsibleChipFieldProps<K extends string> {
    /** leading アイコン。label 未指定時に w-6 相当の枠内で表示 */
    icon?: React.ReactNode;
    /** アイコン代わりにテキストラベルを表示。他のフィールド行と幅を揃える用途。 */
    label?: string;
    options: K[];
    /** undefined / "" は未選択扱い（全 chip 展開） */
    selected: K | undefined | "";
    onSelect: (key: K) => void;
    /** 選択中の chip を再タップしたとき呼ぶ。指定がない場合は再選択用に展開のみ。 */
    onClear?: () => void;
    getLabel: (key: K) => string;
    getIcon?: (key: K) => string;
    /** 候補数が少なく、選択後も比較対象を見せたいフィールド用。常に全展開。 */
    alwaysExpanded?: boolean;
}
/**
 * CollapsibleChipField (native) — 折りたたみ式選択フィールド。
 * Web 版 (`src/components/patterns/collapsible-chip-field.tsx`) と同一 UX:
 * 未選択時は全展開、選択後は選択 chip のみ表示、再タップで解除 or 再展開。
 */
export declare function CollapsibleChipField<K extends string>({ icon, label, options, selected, onSelect, onClear, getLabel, getIcon, alwaysExpanded, }: CollapsibleChipFieldProps<K>): React.JSX.Element;
