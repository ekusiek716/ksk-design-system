import * as React from "react";
interface InputProps extends Omit<React.ComponentProps<"input">, "prefix"> {
    /**
     * 入力フィールド左側の装飾。テキスト・アイコン・単位記号など。
     * 例: "¥", "@", <SearchIcon />
     */
    startAdornment?: React.ReactNode;
    /**
     * 入力フィールド右側の装飾。テキスト・アイコン・ボタンなど。
     * 例: "%", "kg", クリアボタン, パスワード表示ボタン
     * インタラクティブ要素（ボタン等）を渡す場合はこちら（pointer-events 有効）。
     */
    endAdornment?: React.ReactNode;
}
declare function Input({ className, type, startAdornment, endAdornment, ...props }: InputProps): import("react/jsx-runtime").JSX.Element;
export { Input };
export type { InputProps };
