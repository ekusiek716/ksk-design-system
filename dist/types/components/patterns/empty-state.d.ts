import * as React from "react";
import { type ButtonProps } from "@/components/ui/button";
interface EmptyStateProps extends React.ComponentProps<"div"> {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    actionLabel?: string;
    actionIcon?: React.ReactNode;
    actionLayout?: "compact" | "content" | "full";
    actionButtonProps?: Omit<ButtonProps, "children">;
    onAction?: () => void;
    /** 表示密度。リスト内では compact / inline を使う。 */
    size?: "default" | "compact" | "inline";
    /**
     * アイコンの色クラスを上書きする。コンテキストに応じてアイコン色を変えたいとき。
     * @example iconClassName="text-[var(--Object-Caution)]"
     * @default "text-[var(--Object-Low-Emphasis)]"
     */
    iconClassName?: string;
}
declare function EmptyState({ className, icon, title, description, action, actionLabel, actionIcon, actionLayout, actionButtonProps, onAction, size, iconClassName, ...props }: EmptyStateProps): React.JSX.Element;
export { EmptyState };
export type { EmptyStateProps };
