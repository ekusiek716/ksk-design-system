import * as React from "react";
import { Button } from "@/components/ui/button";
type MobileFloatingActionButtonPlacement = "end" | "start" | "center";
type MobileFloatingActionButtonKeyboardBehavior = "hide" | "lift" | "stay";
type MobileFloatingActionButtonBottomOffset = "none" | "bottom-nav" | "bottom-nav-pill" | "bottom-nav-pill-inline";
interface MobileFloatingActionButtonProps extends Omit<React.ComponentProps<typeof Button>, "children" | "size" | "variant"> {
    label: string;
    icon?: React.ReactNode;
    showLabel?: boolean;
    placement?: MobileFloatingActionButtonPlacement;
    bottomOffset?: MobileFloatingActionButtonBottomOffset;
    keyboardBehavior?: MobileFloatingActionButtonKeyboardBehavior;
    mobileOnly?: boolean;
}
declare function MobileFloatingActionButton({ className, label, icon, showLabel, placement, bottomOffset, keyboardBehavior, mobileOnly, style, ...props }: MobileFloatingActionButtonProps): React.JSX.Element;
export { MobileFloatingActionButton };
export type { MobileFloatingActionButtonBottomOffset, MobileFloatingActionButtonKeyboardBehavior, MobileFloatingActionButtonPlacement, MobileFloatingActionButtonProps, };
