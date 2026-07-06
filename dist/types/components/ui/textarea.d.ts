import * as React from "react";
interface TextareaProps extends React.ComponentProps<"textarea"> {
    /** 入力内容に合わせて高さを自動伸縮する */
    autoGrow?: boolean;
}
declare function Textarea({ className, autoGrow, onChange, ...props }: TextareaProps): React.JSX.Element;
export { Textarea };
export type { TextareaProps };
