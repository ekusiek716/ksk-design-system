import * as React from "react";
interface CollapsibleChipFieldProps<K extends string> {
    /** leading アイコン。label 未指定時に w-6 の枠内で表示 */
    icon?: React.ReactNode;
    /**
     * アイコン代わりにテキストラベルを表示。他のフィールド行と幅 w-20 を揃えて
     * レイアウトを統一する用途。
     */
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
 * CollapsibleChipField — 折りたたみ式選択フィールド。
 *
 * UX:
 * - 未選択 → 全 chip をグレーで展開表示
 * - 選択あり → 選択した 1 chip だけ表示（折りたたみ）
 * - 選択中の chip を再タップ → 解除（onClear）して全展開に戻る。
 *   onClear 未指定の場合は再選択用に展開のみ（required field 対応）
 *
 * leading（icon/label）は w-20 固定幅、行は min-h-[36px] で高さ固定。
 * 内部で DS の Chip（selected/onClick 制御）を使用。
 */
declare function CollapsibleChipField<K extends string>({ icon, label, options, selected, onSelect, onClear, getLabel, getIcon, alwaysExpanded, }: CollapsibleChipFieldProps<K>): React.JSX.Element;
export { CollapsibleChipField };
export type { CollapsibleChipFieldProps };
