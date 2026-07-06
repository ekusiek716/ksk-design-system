import * as React from "react";
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
declare function TagInput({ value, onChange, placeholder, disabled, max, allowDuplicates, className, inputLabel, }: TagInputProps): React.JSX.Element;
export { TagInput };
export type { TagInputProps };
