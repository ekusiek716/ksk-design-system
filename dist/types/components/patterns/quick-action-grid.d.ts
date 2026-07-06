import * as React from "react";
type ActionTileVariant = "neutral" | "selected" | "success" | "info" | "caution";
type QuickActionGridColumns = 2 | 3 | 4 | "auto";
type QuickActionGridGap = "sm" | "md";
interface ActionTileProps extends Omit<React.ComponentProps<"button">, "children"> {
    icon?: React.ReactNode;
    emoji?: React.ReactNode;
    label: React.ReactNode;
    description?: React.ReactNode;
    meta?: React.ReactNode;
    selected?: boolean;
    loading?: boolean;
    variant?: ActionTileVariant;
}
interface QuickActionGridProps extends React.ComponentProps<"div"> {
    columns?: QuickActionGridColumns;
    gap?: QuickActionGridGap;
}
declare function ActionTile({ className, icon, emoji, label, description, meta, selected, loading, variant, disabled, type, ...props }: ActionTileProps): React.JSX.Element;
declare function QuickActionGrid({ className, columns, gap, ...props }: QuickActionGridProps): React.JSX.Element;
export { ActionTile, QuickActionGrid };
export type { ActionTileProps, ActionTileVariant, QuickActionGridColumns, QuickActionGridGap, QuickActionGridProps };
