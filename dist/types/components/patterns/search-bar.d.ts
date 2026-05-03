import * as React from "react";
interface SearchBarProps extends Omit<React.ComponentProps<"input">, "type"> {
    onSearch?: (value: string) => void;
}
declare function SearchBar({ className, onSearch, ...props }: SearchBarProps): import("react/jsx-runtime").JSX.Element;
export { SearchBar };
