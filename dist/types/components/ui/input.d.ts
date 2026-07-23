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
    /**
     * 文字数カウンタを表示する。maxLength とセットで使うと
     * 右下に「現在/max」を表示し、上限到達時は caution 色になる。
     * controlled / uncontrolled と IME 入力の両方に追従する。
     */
    showCount?: boolean;
}
declare function Input({ className, type, startAdornment, endAdornment, showCount, maxLength, value, defaultValue, onChange, onCompositionStart, onCompositionEnd, ref, ...props }: InputProps): React.JSX.Element;
export { Input };
export type { InputProps };
