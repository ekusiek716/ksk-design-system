import * as React from "react";
interface SubNavItem {
    label: string;
    value: string;
    badge?: number;
    /** ホバー/長押し時の補足。title と aria-describedby に反映する。 */
    description?: string;
    /** description の短い別名。description がある場合は description を優先。 */
    title?: string;
}
interface SubNavProps {
    items: SubNavItem[];
    value: string;
    onChange: (value: string) => void;
    variant?: "underline" | "chip";
    /** スクロール時に上部に固定 */
    sticky?: boolean;
    className?: string;
}
declare function SubNav({ items, value, onChange, variant, sticky, className, }: SubNavProps): React.JSX.Element;
export { SubNav };
export type { SubNavProps, SubNavItem };
