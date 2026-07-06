import * as React from "react";
/**
 * ListItem の意味づけ。
 * - "default"     : 通常のリスト項目（既定）。
 * - "destructive" : 削除・ログアウトなど取り返しのつかない操作。
 *                   title を Caution 色にし、interactive=true の場合は
 *                   hover を薄い caution 背景に切り替える。
 *                   leftSlot のアイコンは呼び出し側で色付けする想定
 *                   （currentColor を継承させたい場合は className で調整）。
 */
type ListItemVariant = "default" | "destructive";
interface ListItemProps extends React.ComponentProps<"div"> {
    leftSlot?: React.ReactNode;
    rightSlot?: React.ReactNode;
    bottomSlot?: React.ReactNode;
    title?: string;
    description?: string;
    interactive?: boolean;
    variant?: ListItemVariant;
}
declare function ListItem({ className, leftSlot, rightSlot, bottomSlot, title, description, interactive, variant, children, ...props }: ListItemProps): React.JSX.Element;
export { ListItem };
export type { ListItemProps, ListItemVariant };
