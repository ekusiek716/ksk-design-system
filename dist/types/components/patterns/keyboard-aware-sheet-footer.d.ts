import * as React from "react";
type KeyboardAwareSheetFooterBehavior = "fixed" | "hide" | "scroll";
interface FocusComfortScrollOptions {
    enabled?: boolean;
    block?: ScrollLogicalPosition;
    behavior?: ScrollBehavior;
}
interface KeyboardAwareSheetFooterProps extends React.ComponentProps<"div"> {
    behavior?: KeyboardAwareSheetFooterBehavior;
    hideWhenInputFocused?: boolean;
}
declare function useFocusedInputComfortScroll<T extends HTMLElement = HTMLDivElement>({ enabled, block, behavior, }?: FocusComfortScrollOptions): React.RefObject<T>;
declare function KeyboardAwareSheetFooter({ className, behavior, hideWhenInputFocused, style, children, ...props }: KeyboardAwareSheetFooterProps): React.JSX.Element;
export { KeyboardAwareSheetFooter, useFocusedInputComfortScroll };
export type { FocusComfortScrollOptions, KeyboardAwareSheetFooterBehavior, KeyboardAwareSheetFooterProps, };
