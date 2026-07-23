import * as React from "react";
interface SectionNavItem {
    /** activeKey と照合する安定キー。 */
    key: string;
    /** リンクの可視ラベル。 */
    label: string;
    /** ページ内アンカー。`#section-id` 形式を使う。 */
    href: string;
}
interface SectionNavProps extends React.ComponentProps<"nav"> {
    items: SectionNavItem[];
    /** 現在表示中のセクション。IntersectionObserver 等は利用側で制御する。 */
    activeKey?: string;
    /** vertical=目次、horizontal=横スクロールのアンダーバー。 */
    orientation?: "vertical" | "horizontal";
    /** アンカーの既定動作を維持したままクリックを通知する。 */
    onItemClick?: (key: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
}
/**
 * 同一ページ内のセクションへ移動する本物のアンカーナビ。
 *
 * SubNav は button/tab によるビュー状態の切替、SectionNav は href を持つ
 * 現在地ナビであり相互に代用しない。sticky は内蔵しないため、必要なら nav の
 * className に `sticky top-*`、移動先に `scroll-mt-*` を指定する。
 */
declare function SectionNav({ items, activeKey, orientation, onItemClick, className, "aria-label": ariaLabel, ...props }: SectionNavProps): React.JSX.Element;
export { SectionNav };
export type { SectionNavItem, SectionNavProps };
