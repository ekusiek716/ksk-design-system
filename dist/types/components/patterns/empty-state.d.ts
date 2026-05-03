import * as React from "react";
interface EmptyStateProps extends React.ComponentProps<"div"> {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    /**
     * アイコンの色クラスを上書きする。コンテキストに応じてアイコン色を変えたいとき。
     * @example iconClassName="text-[var(--Object-Caution)]"
     * @default "text-[var(--Object-Low-Emphasis)]"
     */
    iconClassName?: string;
}
declare function EmptyState({ className, icon, title, description, action, iconClassName, ...props }: EmptyStateProps): import("react/jsx-runtime").JSX.Element;
export { EmptyState };
