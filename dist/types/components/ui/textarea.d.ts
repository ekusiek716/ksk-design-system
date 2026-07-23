import * as React from "react";
interface TextareaProps extends React.ComponentProps<"textarea"> {
    /** 入力内容に合わせて高さを自動伸縮する */
    autoGrow?: boolean;
    /**
     * 文字数カウンタを表示する。maxLength とセットで使うと
     * 右下に「現在/max」を表示し、上限到達時は caution 色になる。
     */
    showCount?: boolean;
}
declare function Textarea({ className, autoGrow, showCount, maxLength, value, defaultValue, onChange, onCompositionStart, onCompositionEnd, ref, ...props }: TextareaProps): React.JSX.Element;
export { Textarea };
export type { TextareaProps };
