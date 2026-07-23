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
interface ListItemCommonProps {
    leftSlot?: React.ReactNode;
    rightSlot?: React.ReactNode;
    bottomSlot?: React.ReactNode;
    title?: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    /**
     * @deprecated `href` または `onClick` を ListItem 自体へ渡してください。
     * 外側の Link / button でラップする既存コードの視覚互換用に残しています。
     */
    interactive?: boolean;
    variant?: ListItemVariant;
}
type ListItemLinkProps = ListItemCommonProps & Omit<React.ComponentPropsWithoutRef<"a">, keyof ListItemCommonProps | "href" | "onClick"> & {
    href: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};
type ListItemButtonProps = ListItemCommonProps & Omit<React.ComponentPropsWithoutRef<"button">, keyof ListItemCommonProps | "href" | "onClick" | "type"> & {
    href?: never;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};
type ListItemStaticProps = ListItemCommonProps & Omit<React.ComponentPropsWithoutRef<"div">, keyof ListItemCommonProps | "href" | "onClick"> & {
    href?: never;
    onClick?: never;
};
type ListItemProps = ListItemLinkProps | ListItemButtonProps | ListItemStaticProps;
declare function ListItem({ className, leftSlot, rightSlot, bottomSlot, title, description, interactive, disabled, variant, children, href, onClick, ...props }: ListItemProps): React.JSX.Element;
export { ListItem };
export type { ListItemProps, ListItemVariant };
