import * as React from "react";
interface StatusTabItem {
    label: string;
    count: number;
}
interface StatusTabsProps extends Omit<React.ComponentProps<"div">, "onSelect"> {
    items: StatusTabItem[];
    activeIndex?: number;
    onSelect?: (index: number) => void;
}
declare function StatusTabs({ items, activeIndex, onSelect, className, ...props }: StatusTabsProps): React.JSX.Element;
export { StatusTabs };
export type { StatusTabItem };
