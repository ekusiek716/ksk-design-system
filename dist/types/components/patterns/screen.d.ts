import * as React from "react";
type ScreenPadding = "none" | "page";
interface ScreenProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    /** スクロールする本文 */
    children: React.ReactNode;
    /** 下部固定 CTA。safe-area 分の余白を自動付与する */
    footer?: React.ReactNode;
    /** 上部固定ヘッダ */
    header?: React.ReactNode;
    /** default true。false で 1 画面固定にする */
    scroll?: boolean;
    /** 既定の本文パディング */
    padding?: ScreenPadding;
    bodyClassName?: string;
    headerClassName?: string;
    footerClassName?: string;
}
declare function Screen({ children, footer, header, scroll, padding, className, bodyClassName, headerClassName, footerClassName, ...props }: ScreenProps): import("react/jsx-runtime").JSX.Element;
export { Screen };
export type { ScreenPadding, ScreenProps };
