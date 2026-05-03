interface TagInputProps {
    value?: string[];
    onChange?: (tags: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    /** 最大タグ数 */
    max?: number;
    /** 重複タグを許可するか */
    allowDuplicates?: boolean;
    className?: string;
    /**
     * タグ入力フィールドの aria-label。
     * i18n 対応: 英語では "Add tag" を渡す。
     * @default "タグ入力"
     */
    inputLabel?: string;
}
declare function TagInput({ value, onChange, placeholder, disabled, max, allowDuplicates, className, inputLabel, }: TagInputProps): import("react/jsx-runtime").JSX.Element;
export { TagInput };
export type { TagInputProps };
