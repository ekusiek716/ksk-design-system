import * as React from "react";
type MediaActionClusterOrientation = "vertical" | "horizontal" | "auto";
type MediaActionClusterAnchor = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-left" | "center-right";
type MediaActionClusterPosition = "absolute" | "fixed";
type MediaActionClusterLabelPosition = "below" | "side" | "auto";
interface MediaActionClusterItem {
    id?: string;
    label: string;
    ariaLabel?: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
    active?: boolean;
    badge?: React.ReactNode;
    disabled?: boolean;
}
interface MediaActionClusterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    items: MediaActionClusterItem[];
    orientation?: MediaActionClusterOrientation;
    anchor?: MediaActionClusterAnchor;
    position?: MediaActionClusterPosition;
    labelPosition?: MediaActionClusterLabelPosition;
    autoHideMs?: number | null;
    defaultVisible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    "aria-label"?: string;
}
declare function MediaActionCluster({ items, orientation, anchor, position, labelPosition, autoHideMs, defaultVisible, onVisibleChange, className, "aria-label": ariaLabel, ...props }: MediaActionClusterProps): import("react/jsx-runtime").JSX.Element;
export { MediaActionCluster };
export type { MediaActionClusterAnchor, MediaActionClusterItem, MediaActionClusterLabelPosition, MediaActionClusterOrientation, MediaActionClusterPosition, MediaActionClusterProps, };
