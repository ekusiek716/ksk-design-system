import * as React from "react";
export interface DropdownFilterOption<K extends string = string> {
    key: K;
    label: string;
    /**
     * label の左に表示する任意アイコン（iconsax 等）。色は currentColor を継承するため
     * チップ active 時は自動で白抜きになる。サイズは要素側で指定すること（例: `<Element3 size={16} />`）。
     * チップ（選択中 option）と選択肢リストの両方に表示される。未指定ならテキストのみ＝従来挙動。
     */
    icon?: React.ReactNode;
}
export interface DropdownFilterProps<K extends string = string> {
    label: string;
    value: K | "all";
    options: DropdownFilterOption<K>[];
    onSelect: (key: K | "all") => void;
    /** "すべて" オプションを非表示にする */
    hideAll?: boolean;
    allLabel?: string;
    /**
     * 選択 key を表示用テキストに変換する (例: enum key → 日本語ラベル)。
     * 未指定なら options から label を引く。
     */
    getDisplayLabel?: (key: K) => string;
    /** 選択中は値のみ表示 (例: "カテゴリ別")。プレフィックス "ラベル: " を省略。 */
    valueOnly?: boolean;
    /**
     * この値と一致するときは「未絞り込み」扱いとし、active 色を当てずラベルだけ表示する。
     * 例: "追加順" を pristine とすれば、追加順のときは「並び替え」と表示し pristine 配色に。
     */
    pristineValue?: K;
    className?: string;
}
declare function DropdownFilter<K extends string = string>({ label, value, options, onSelect, hideAll, allLabel, getDisplayLabel, valueOnly, pristineValue, className, }: DropdownFilterProps<K>): React.JSX.Element;
export { DropdownFilter };
