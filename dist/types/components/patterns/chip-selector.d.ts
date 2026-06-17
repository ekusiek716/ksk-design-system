import * as React from "react";
interface ChipSelectorOption<T extends string = string> {
    label: string;
    value: T;
    icon?: React.ReactNode;
}
interface ChipSelectorProps<T extends string = string> {
    options: ChipSelectorOption<T>[];
    value: T[];
    onChange: (value: T[]) => void;
    /**
     * 複数選択を許可するか。
     *
     * ⚠️ **デフォルトは `true`（複数選択）**。サイズ・カテゴリ等の **単一選択**で使う場合は
     * **必ず `multiple={false}` を渡すこと**。渡し忘れると選択が「置き換え」でなく「追加」になり、
     * `onChange` が常に複数値の配列を返すため、`value[0]` を読む実装だと選択が反映されず
     * サイレントに壊れる（よくある footgun。issue #39）。
     *
     * @default true
     */
    multiple?: boolean;
    /** 最大選択数（multiple=true 時のみ有効） */
    max?: number;
    size?: "sm" | "md" | "lg";
    className?: string;
}
declare function ChipSelector<T extends string = string>({ options, value, onChange, multiple, max, size, className, }: ChipSelectorProps<T>): import("react/jsx-runtime").JSX.Element;
export { ChipSelector };
export type { ChipSelectorProps, ChipSelectorOption };
