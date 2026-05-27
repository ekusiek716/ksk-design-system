export interface DropdownFilterOption<K extends string = string> {
    key: K;
    label: string;
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
declare function DropdownFilter<K extends string = string>({ label, value, options, onSelect, hideAll, allLabel, getDisplayLabel, valueOnly, pristineValue, className, }: DropdownFilterProps<K>): import("react/jsx-runtime").JSX.Element;
export { DropdownFilter };
