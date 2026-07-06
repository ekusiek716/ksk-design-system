import * as React from "react";
interface SearchPanelProps extends React.ComponentProps<"div"> {
    onSearch?: () => void;
    onReset?: () => void;
    columns?: 2 | 3 | 4;
    layout?: "grid" | "flex";
}
declare function SearchPanel({ children, onSearch, onReset, columns, layout, className, ...props }: SearchPanelProps): React.JSX.Element;
export { SearchPanel };
