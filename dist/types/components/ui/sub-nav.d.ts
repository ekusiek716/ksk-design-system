interface SubNavItem {
    label: string;
    value: string;
    badge?: number;
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
declare function SubNav({ items, value, onChange, variant, sticky, className, }: SubNavProps): import("react/jsx-runtime").JSX.Element;
export { SubNav };
export type { SubNavProps, SubNavItem };
