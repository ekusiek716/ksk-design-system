import { type DialogProps } from "./Dialog";
export interface ResponsiveDialogProps extends DialogProps {
    /** width <= breakpoint で BottomSheet 化（既定 600） */
    breakpoint?: number;
}
/** sm 以下では Sheet(bottom)、それ以上は Dialog。 */
export declare function ResponsiveDialog({ breakpoint, ...props }: ResponsiveDialogProps): import("react/jsx-runtime").JSX.Element;
