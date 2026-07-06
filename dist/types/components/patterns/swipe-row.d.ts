import * as React from "react";
export interface SwipeAction {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "destructive";
}
interface SwipeRowProps {
    children: React.ReactNode;
    actions?: SwipeAction[];
    /** スワイプで開く方向 */
    side?: "left" | "right";
    className?: string;
}
declare function SwipeRow({ children, actions, side, className }: SwipeRowProps): React.JSX.Element;
export { SwipeRow };
export type { SwipeRowProps };
